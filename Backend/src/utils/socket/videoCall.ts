import { Server, Socket } from "socket.io";
import { createClient } from "@redis/client";
import { verifyAccessToken } from "../../utils/jwt";
import VideoCallRepository from "../../repositories/implementations/VideoCallRepository";
import VideoCallService from "../../services/implementations/VideoCallService";

interface UserPayload {
  id: string;
  role: string;
}

interface CustomSocket extends Socket {
  data: {
    user?: UserPayload;
  };
}

export const initializeVideoSocket = async (videoNamespace: Server) => {
  console.log("Initializing Socket.IO /video namespace");

  // videoNamespace.use((socket: CustomSocket, next: (err?: Error) => void) => {
  //   const token = socket.handshake.auth.token;
  //   if (!token) {
  //     console.error("Authentication error: No token provided");
  //     return next(new Error("Authentication error: No token provided"));
  //   }

  //   try {
  //     const decoded = verifyAccessToken(token) as UserPayload;
  //     socket.data.user = decoded;
  //     next();
  //   } catch (error: any) {
  //     console.error("Authentication error:", error.message);
  //     return next(new Error("Authentication error: Invalid token"));
  //   }
  // });
  videoNamespace.use((socket: CustomSocket, next: (err?: Error) => void) => {
    // ✅ FIXED: Read token from cookies instead of auth object
    console.log("🔍 Socket middleware: Checking authentication");
    console.log("🔍 Socket handshake headers:", socket.handshake.headers);

    // Parse cookies from the Cookie header
    const cookieHeader = socket.handshake.headers.cookie;
    console.log("🔍 Cookie header:", cookieHeader);

    if (!cookieHeader) {
      console.error("❌ Authentication error: No cookies provided");
      return next(new Error("Authentication error: No cookies provided"));
    }

    // Extract accessToken from cookies
    const cookies = cookieHeader
      .split(";")
      .reduce((acc: Record<string, string>, cookie) => {
        const [name, value] = cookie.trim().split("=");
        acc[name] = value;
        return acc;
      }, {});

    const token = cookies.accessToken;
    console.log(
      "🔍 Extracted token from cookies:",
      token ? "Found" : "Not found"
    );

    if (!token) {
      console.error("❌ Authentication error: No accessToken in cookies");
      return next(new Error("Authentication error: No accessToken provided"));
    }

    try {
      const decoded = verifyAccessToken(token) as UserPayload;
      socket.data.user = decoded;
      console.log("✅ Socket authentication successful for user:", decoded.id);
      next();
    } catch (error: any) {
      console.error("❌ Socket authentication error:", error.message);
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  videoNamespace.on("connection", (socket: CustomSocket) => {
    const userId = socket.data.user?.id;
    if (!userId) {
      socket.disconnect();
      return;
    }
    console.log(
      `Video call user connected: ${userId}, socket ID: ${socket.id}`
    );

    socket.on(
      "join-meeting",
      async ({ meetingId, userId, userName, peerId }, callback) => {
        console.log(
          `join-meeting: ${userId} joining meeting ${meetingId}, peerId: ${peerId}`
        );
        if (!meetingId || !userId || !peerId) {
          console.error("Invalid payload for join-meeting");
          callback({ success: false, error: "Invalid payload" });
          return;
        }

        try {
          const pubClient = createClient({ url: process.env.REDIS_URL });
          await pubClient.connect();

          const videoCallRepo = new VideoCallRepository();
          const meeting = await videoCallRepo.findMeeting(meetingId);
          if (!meeting) {
            console.error(`Meeting ${meetingId} not found`);
            callback({ success: false, error: "Meeting not found" });
            await pubClient.quit();
            return;
          }

          await pubClient.set(
            `meeting:${meetingId}:user:${userId}:socket`,
            socket.id,
            { EX: 3600 }
          );
          await pubClient.set(
            `meeting:${meetingId}:user:${userId}:peer`,
            peerId,
            { EX: 3600 }
          );
          await pubClient.set(
            `meeting:${meetingId}:user:${userId}:name`,
            userName,
            { EX: 3600 }
          );

          const admittedKey = `meeting:${meetingId}:admitted:${userId}`;
          const isAdmitted = await pubClient.get(admittedKey);
          const isAlreadyJoined = meeting.participants.some(
            (p) => p.userId === userId
          );

          if (meeting.creatorId === userId || (isAdmitted && isAlreadyJoined)) {
            socket.join(`meeting_${meetingId}`);
            const userKeys = await pubClient.keys(
              `meeting:${meetingId}:user:*:peer`
            );
            const existingParticipants = [];
            for (const key of userKeys) {
              const participantId = key.split(":")[3];
              if (participantId === userId) continue;
              const participantPeerId = await pubClient.get(
                `meeting:${meetingId}:user:${participantId}:peer`
              );
              const participantName = await pubClient.get(
                `meeting:${meetingId}:user:${participantId}:name`
              );
              if (participantPeerId && participantName) {
                existingParticipants.push({
                  userId: participantId,
                  userName: participantName,
                  peerId: participantPeerId,
                });
              }
            }

            socket.emit("existing-participants", existingParticipants);
            callback({
              success: true,
              message:
                meeting.creatorId === userId
                  ? "Creator joined meeting"
                  : "Re-joined meeting successfully",
              creatorId: meeting.creatorId,
              isAlreadyJoined: true,
            });
            await pubClient.quit();
            return;
          }

          await pubClient.set(
            `meeting:${meetingId}:pending:${userId}`,
            JSON.stringify({ userId, userName, peerId }),
            { EX: 300 }
          );
          const creatorSocketId = await pubClient.get(
            `meeting:${meetingId}:user:${meeting.creatorId}:socket`
          );
          if (creatorSocketId) {
            videoNamespace.to(creatorSocketId).emit("join-request", {
              userId,
              userName,
              peerId,
            });
            console.log(
              `Sent join-request for ${userId} to creator ${meeting.creatorId} (socket ${creatorSocketId})`
            );
          } else {
            console.warn(`Creator socket not found for ${meeting.creatorId}`);
            callback({ success: false, error: "Creator not available" });
            await pubClient.quit();
            return;
          }

          socket.join(`meeting_${meetingId}`);
          callback({ success: true, message: "Join request sent to creator" });
          await pubClient.quit();
        } catch (error: any) {
          console.error("Error in join-meeting:", error.message);
          callback({ success: false, error: error.message });
        }
      }
    );

    socket.on("admit-user", async ({ meetingId, userId, userName, peerId }) => {
      console.log(`admit-user: ${userId} for meeting ${meetingId}`);
      const pubClient = createClient({ url: process.env.REDIS_URL });
      await pubClient.connect();

      const videoCallRepo = new VideoCallRepository();
      const videoCallService = new VideoCallService();
      const meeting = await videoCallRepo.findMeeting(meetingId);
      console.log("MEETING SOCKET MEETING +++++++. ", meeting);

      if (!meeting || meeting.creatorId !== socket.data.user?.id) {
        console.error("Unauthorized or meeting not found");
        await pubClient.quit();
        return;
      }

      try {
        await videoCallService.joinMeeting(meetingId, userId, userName, peerId);
        console.log(
          `MongoDB updated with participant ${userId} for meeting ${meetingId}`
        );
      } catch (error: any) {
        console.error(`Failed to update MongoDB for ${userId}:`, error.message);
        await pubClient.quit();
        return;
      }

      await pubClient.set(`meeting:${meetingId}:admitted:${userId}`, "true", {
        EX: 3600,
      });
      await pubClient.set(`meeting:${meetingId}:user:${userId}:peer`, peerId, {
        EX: 3600,
      });
      await pubClient.set(
        `meeting:${meetingId}:user:${userId}:name`,
        userName,
        { EX: 3600 }
      );

      const joinerSocketId = await pubClient.get(
        `meeting:${meetingId}:user:${userId}:socket`
      );
      if (!joinerSocketId) {
        console.error(`No socket ID found for user ${userId}`);
        await pubClient.del(`meeting:${meetingId}:pending:${userId}`);
        await pubClient.quit();
        return;
      }

      const joinerSocket = videoNamespace.sockets.get(joinerSocketId); // Fixed: Removed extra .sockets
      if (!joinerSocket) {
        console.error(`Socket not found for joinerSocketId: ${joinerSocketId}`);
        // Clean up stale Redis keys
        await pubClient.del(`meeting:${meetingId}:user:${userId}:socket`);
        await pubClient.del(`meeting:${meetingId}:user:${userId}:peer`);
        await pubClient.del(`meeting:${meetingId}:user:${userId}:name`);
        await pubClient.del(`meeting:${meetingId}:admitted:${userId}`);
        await pubClient.del(`meeting:${meetingId}:pending:${userId}`);
        await pubClient.quit();
        return;
      }

      joinerSocket.join(`meeting_${meetingId}`);

      const broadcastUserJoined = async (retryCount = 0) => {
        const maxRetries = 3;
        videoNamespace.to(`meeting_${meetingId}`).emit("user-joined", {
          userId,
          userName,
          peerId,
        });
        const userKeys = await pubClient.keys(
          `meeting:${meetingId}:user:*:socket`
        );
        for (const key of userKeys) {
          const participantId = key.split(":")[3];
          const participantSocketId = await pubClient.get(key);
          const participantSocket =
            videoNamespace.sockets.get(participantSocketId); // Fixed: Removed extra .sockets
          if (participantSocket) {
            console.log(
              `Confirmed ${participantId} is in room for ${userId}'s join`
            );
          } else if (retryCount < maxRetries) {
            console.log(
              `Retrying user-joined broadcast for ${userId} (attempt ${
                retryCount + 1
              })`
            );
            setTimeout(() => broadcastUserJoined(retryCount + 1), 2000);
          }
        }
      };

      await broadcastUserJoined();
      await pubClient.del(`meeting:${meetingId}:pending:${userId}`);
      videoNamespace.to(joinerSocketId).emit("user-admitted", { userId });
      videoNamespace
        .to(`meeting_${meetingId}`)
        .emit("request-existing-participants", {
          userId,
          peerId,
        });
      await pubClient.quit();
    });
    socket.on("reject-user", async ({ meetingId, userId, userName }) => {
      console.log(`reject-user: ${userId} for meeting ${meetingId}`);
      const pubClient = createClient({ url: process.env.REDIS_URL });
      await pubClient.connect();

      const videoCallRepo = new VideoCallRepository();
      const meeting = await videoCallRepo.findMeeting(meetingId);
      if (!meeting || meeting.creatorId !== socket.data.user?.id) {
        console.error("Unauthorized or meeting not found");
        await pubClient.quit();
        return;
      }

      const joinerSocketId = await pubClient.get(
        `meeting:${meetingId}:user:${userId}:socket`
      );
      if (joinerSocketId) {
        videoNamespace.to(joinerSocketId).emit("join-rejected", { userId });
      }
      await pubClient.del(`meeting:${meetingId}:pending:${userId}`);
      await pubClient.quit();
    });

    socket.on("join-room", ({ meetingId, userId }) => {
      console.log(`join-room: ${userId} joining room for meeting ${meetingId}`);
      socket.join(`meeting_${meetingId}`);
    });

    socket.on("update-status", ({ meetingId, userId, audio, video }) => {
      socket
        .to(`meeting_${meetingId}`)
        .emit("update-status", { userId, audio, video });
    });

    socket.on(
      "screen-share-status",
      ({ meetingId, userId, isSharingScreen, screenSharePeerId }) => {
        console.log(
          `screen-share-status: ${userId} in meeting ${meetingId} - isSharingScreen: ${isSharingScreen}, screenSharePeerId: ${screenSharePeerId}`
        );
        videoNamespace.to(`meeting_${meetingId}`).emit("screen-share-status", {
          userId,
          isSharingScreen,
          screenSharePeerId,
        });
      }
    );

    socket.on("message", ({ meetingId, message }) => {
      console.log(
        `message: User ${message.senderId} sent a message in meeting: ${meetingId} - ${message.text}`
      );
      videoNamespace.to(`meeting_${meetingId}`).emit("message", message);
    });

    socket.on("update-peer-id", async ({ meetingId, userId, peerId }) => {
      console.log(
        `update-peer-id: ${userId} updated peerId ${peerId} for meeting: ${meetingId}`
      );
      const pubClient = createClient({ url: process.env.REDIS_URL });
      await pubClient.connect();

      await pubClient.set(`meeting:${meetingId}:user:${userId}:peer`, peerId, {
        EX: 3600,
      });
      const userSocketId = await pubClient.get(
        `meeting:${meetingId}:user:${userId}:socket`
      );
      const userKeys = await pubClient.keys(`meeting:${meetingId}:user:*:peer`);
      const existingParticipants = [];
      for (const key of userKeys) {
        const participantId = key.split(":")[3];
        if (participantId === userId) continue;
        const participantPeerId = await pubClient.get(
          `meeting:${meetingId}:user:${participantId}:peer`
        );
        const participantName = await pubClient.get(
          `meeting:${meetingId}:user:${participantId}:name`
        );
        if (participantPeerId && participantName) {
          existingParticipants.push({
            userId: participantId,
            userName: participantName,
            peerId: participantPeerId,
          });
        }
      }
      if (userSocketId) {
        videoNamespace
          .to(userSocketId)
          .emit("existing-participants", existingParticipants);
      }
      await pubClient.quit();
    });

    socket.on("leave-meeting", async ({ meetingId, userId }) => {
      console.log(`leave-meeting: ${userId} leaving meeting: ${meetingId}`);
      const pubClient = createClient({ url: process.env.REDIS_URL });
      await pubClient.connect();

      socket.leave(`meeting_${meetingId}`);
      videoNamespace.to(`meeting_${meetingId}`).emit("user-left", { userId });
      await pubClient.del(`meeting:${meetingId}:user:${userId}:peer`);
      await pubClient.del(`meeting:${meetingId}:user:${userId}:name`);
      await pubClient.del(`meeting:${meetingId}:user:${userId}:socket`);
      await pubClient.del(`meeting:${meetingId}:admitted:${userId}`);
      await pubClient.quit();
    });

    socket.on("disconnect", async () => {
      console.log(`Video call user disconnected: ${userId}`);
      const pubClient = createClient({ url: process.env.REDIS_URL });
      await pubClient.connect();

      const meetings = await pubClient.keys(`meeting:*:user:${userId}:peer`);
      for (const key of meetings) {
        const meetingId = key.split(":")[1];
        videoNamespace.to(`meeting_${meetingId}`).emit("user-left", { userId });
        await pubClient.del(key);
        await pubClient.del(`meeting:${meetingId}:user:${userId}:name`);
        await pubClient.del(`meeting:${meetingId}:user:${userId}:socket`);
        await pubClient.del(`meeting:${meetingId}:user:${userId}:peer`);
        await pubClient.del(`meeting:${meetingId}:admitted:${userId}`);
        await pubClient.del(`meeting:${meetingId}:pending:${userId}`);
      }
      await pubClient.quit();
    });
  });
};
