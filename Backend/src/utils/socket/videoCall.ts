// import { Server, Socket } from "socket.io";
// import { createClient } from "redis";
// import { createAdapter } from "@socket.io/redis-adapter";
// import { verifyAccessToken } from "../../utils/jwt";
// import VideoCallRepository from "../../repositories/implementations/imVideoCallRepository";
// import VideoCallService from "../../services/implementations/imVideoCallService";

// interface UserPayload {
//   id: string;
//   role: string;
// }

// interface CustomSocket extends Socket {
//   data: {
//     user?: UserPayload;
//   };
// }

// export const initializeVideoSocket = async (httpServer: any) => {
//   const io = new Server(httpServer, {
//     cors: {
//       origin: process.env.FRONTEND_URL || "http://localhost:5173",
//       methods: ["GET", "POST"],
//       credentials: true,
//     },
//     path: "/video-socket.io/",
//   });
//   console.log("Socket.IO video call server initialized");

//   // Redis Setup
//   const pubClient = createClient({ url: process.env.REDIS_URL });
//   const subClient = pubClient.duplicate();

//   pubClient.on("error", (err) => console.error("Redis Pub Client Error:", err));
//   subClient.on("error", (err) => console.error("Redis Sub Client Error:", err));

//   await Promise.all([pubClient.connect(), subClient.connect()]);
//   io.adapter(createAdapter(pubClient, subClient));
//   console.log("Redis adapter for video call connected");

//   // Socket.IO Authentication
//   io.use((socket: CustomSocket, next: (err?: Error) => void) => {
//     const token = socket.handshake.auth.token;
//     if (!token) {
//       console.error("Authentication error: No token provided");
//       return next(new Error("Authentication error: No token provided"));
//     }

//     try {
//       const decoded = verifyAccessToken(token);
//       socket.data.user = decoded;
//       next();
//     } catch (error: any) {
//       console.error("Authentication error:", error.message);
//       next(new Error("Authentication error: Invalid token"));
//     }
//   });

//   // Socket.IO Connection Handling
//   io.on("connection", (socket: CustomSocket) => {
//     const userId = socket.data.user?.id;
//     if (!userId) {
//       socket.disconnect();
//       return;
//     }
//     console.log(
//       `Video call user connected: ${userId}, socket ID: ${socket.id}`
//     );

//     socket.on(
//       "join-meeting",
//       async ({ meetingId, userId, userName, peerId }, callback) => {
//         console.log(
//           `join-meeting: ${userId} joining meeting ${meetingId}, peerId: ${peerId}`
//         );
//         if (!meetingId || !userId || !peerId) {
//           console.error("Invalid payload for join-meeting");
//           callback({ success: false, error: "Invalid payload" });
//           return;
//         }

//         try {
//           const videoCallRepo = new VideoCallRepository();
//           const meeting = await videoCallRepo.findMeeting(meetingId);
//           if (!meeting) {
//             console.error(`Meeting ${meetingId} not found`);
//             callback({ success: false, error: "Meeting not found" });
//             return;
//           }

//           // Store socket ID, peer ID, and name
//           await pubClient.set(
//             `meeting:${meetingId}:user:${userId}:socket`,
//             socket.id,
//             { EX: 3600 }
//           );
//           await pubClient.set(
//             `meeting:${meetingId}:user:${userId}:peer`,
//             peerId,
//             { EX: 3600 }
//           );
//           await pubClient.set(
//             `meeting:${meetingId}:user:${userId}:name`,
//             userName,
//             { EX: 3600 }
//           );

//           // Check if user was recently admitted
//           const admittedKey = `meeting:${meetingId}:admitted:${userId}`;
//           const isAdmitted = await pubClient.get(admittedKey);
//           console.log(`join-meeting: isAdmitted for ${userId}:`, !!isAdmitted);

//           // Check if user is in participants
//           const isAlreadyJoined = meeting.participants.some(
//             (p) => p.userId === userId
//           );
//           console.log(
//             `join-meeting: isAlreadyJoined for ${userId}:`,
//             isAlreadyJoined
//           );

//           // If user is the creator or recently admitted, join directly
//           if (meeting.creatorId === userId || (isAdmitted && isAlreadyJoined)) {
//             socket.join(`meeting_${meetingId}`);
//             console.log(`User ${userId} joined room meeting_${meetingId}`);
//             const userKeys = await pubClient.keys(
//               `meeting:${meetingId}:user:*:peer`
//             );
//             const existingParticipants = [];
//             for (const key of userKeys) {
//               const participantId = key.split(":")[3];
//               if (participantId === userId) continue;
//               const participantPeerId = await pubClient.get(
//                 `meeting:${meetingId}:user:${participantId}:peer`
//               );
//               const participantName = await pubClient.get(
//                 `meeting:${meetingId}:user:${participantId}:name`
//               );
//               if (participantPeerId && participantName) {
//                 existingParticipants.push({
//                   userId: participantId,
//                   userName: participantName,
//                   peerId: participantPeerId,
//                 });
//               }
//             }

//             socket.emit("existing-participants", existingParticipants);
//             callback({
//               success: true,
//               message:
//                 meeting.creatorId === userId
//                   ? "Creator joined meeting"
//                   : "Re-joined meeting successfully",
//               creatorId: meeting.creatorId,
//               isAlreadyJoined: true,
//             });
//             return;
//           }

//           // For non-creator, non-admitted users, send join request
//           console.log(`join-meeting: Sending join request for ${userId}`);
//           await pubClient.set(
//             `meeting:${meetingId}:pending:${userId}`,
//             JSON.stringify({ userId, userName, peerId }),
//             { EX: 300 }
//           );

//           // Notify creator directly
//           const creatorSocketId = await pubClient.get(
//             `meeting:${meetingId}:user:${meeting.creatorId}:socket`
//           );
//           if (creatorSocketId) {
//             io.to(creatorSocketId).emit("join-request", {
//               userId,
//               userName,
//               peerId,
//             });
//             console.log(
//               `Sent join-request for ${userId} to creator ${meeting.creatorId} (socket ${creatorSocketId})`
//             );
//           } else {
//             console.warn(`Creator socket not found for ${meeting.creatorId}`);
//             callback({ success: false, error: "Creator not available" });
//             return;
//           }

//           socket.join(`meeting_${meetingId}`);
//           callback({ success: true, message: "Join request sent to creator" });
//         } catch (error: any) {
//           console.error("Error in join-meeting:", error.message);
//           callback({ success: false, error: error.message });
//         }
//       }
//     );

//     socket.on("admit-user", async ({ meetingId, userId, userName, peerId }) => {
//       console.log(`admit-user: ${userId} for meeting ${meetingId}`);
//       const videoCallRepo = new VideoCallRepository();
//       const videoCallService = new VideoCallService();
//       const meeting = await videoCallRepo.findMeeting(meetingId);
//       if (!meeting || meeting.creatorId !== socket.data.user?.id) {
//         console.error("Unauthorized or meeting not found");
//         return;
//       }

//       // Add user to MongoDB
//       try {
//         await videoCallService.joinMeeting(meetingId, userId, userName, peerId);
//         console.log(
//           `MongoDB updated with participant ${userId} for meeting ${meetingId}`
//         );
//       } catch (error: any) {
//         console.error(`Failed to update MongoDB for ${userId}:`, error.message);
//         return;
//       }

//       // Mark user as admitted
//       await pubClient.set(`meeting:${meetingId}:admitted:${userId}`, "true", {
//         EX: 3600,
//       });

//       // Update Redis with latest peer ID and name
//       await pubClient.set(`meeting:${meetingId}:user:${userId}:peer`, peerId, {
//         EX: 3600,
//       });
//       await pubClient.set(
//         `meeting:${meetingId}:user:${userId}:name`,
//         userName,
//         { EX: 3600 }
//       );

//       // Get joiner's socket ID
//       const joinerSocketId = await pubClient.get(
//         `meeting:${meetingId}:user:${userId}:socket`
//       );
//       if (!joinerSocketId) {
//         console.error(`No socket ID found for user ${userId}`);
//         return;
//       }

//       // Ensure joiner is in the room
//       io.sockets.sockets.get(joinerSocketId)?.join(`meeting_${meetingId}`);
//       console.log(
//         `User ${userId} joined room meeting_${meetingId} via admit-user`
//       );

//       // Retry broadcasting user-joined
//       const broadcastUserJoined = async (retryCount = 0) => {
//         io.to(`meeting_${meetingId}`).emit("user-joined", {
//           userId,
//           userName,
//           peerId,
//         });
//         console.log(
//           `Emitted user-joined for ${userId} in meeting ${meetingId} (attempt ${
//             retryCount + 1
//           })`
//         );

//         // Verify if all participants received user-joined
//         const userKeys = await pubClient.keys(
//           `meeting:${meetingId}:user:*:socket`
//         );
//         for (const key of userKeys) {
//           const participantId = key.split(":")[3];
//           if (participantId === userId) continue;
//           const participantSocketId = await pubClient.get(key);
//           if (
//             participantSocketId &&
//             io.sockets.sockets.get(participantSocketId)
//           ) {
//             console.log(
//               `Confirmed ${participantId} is in room for ${userId}'s join`
//             );
//           } else if (retryCount < 3) {
//             console.log(
//               `Retrying user-joined broadcast for ${userId} (attempt ${
//                 retryCount + 2
//               })`
//             );
//             setTimeout(() => broadcastUserJoined(retryCount + 1), 2000);
//           }
//         }
//       };

//       await broadcastUserJoined();

//       // Remove pending request
//       await pubClient.del(`meeting:${meetingId}:pending:${userId}`);

//       // Notify admitted user directly
//       io.to(joinerSocketId).emit("user-admitted", { userId });
//       console.log(
//         `Emitted user-admitted to ${userId} (socket ${joinerSocketId})`
//       );

//       // Notify existing participants to call the new user
//       io.to(`meeting_${meetingId}`).emit("request-existing-participants", {
//         userId,
//         peerId,
//       });
//       console.log(`Emitted request-existing-participants for ${userId}`);
//     });

//     socket.on("reject-user", async ({ meetingId, userId, userName }) => {
//       console.log(`reject-user: ${userId} for meeting ${meetingId}`);
//       const videoCallRepo = new VideoCallRepository();
//       const meeting = await videoCallRepo.findMeeting(meetingId);
//       if (!meeting || meeting.creatorId !== socket.data.user?.id) {
//         console.error("Unauthorized or meeting not found");
//         return;
//       }

//       // Notify rejected user
//       const joinerSocketId = await pubClient.get(
//         `meeting:${meetingId}:user:${userId}:socket`
//       );
//       if (joinerSocketId) {
//         io.to(joinerSocketId).emit("join-rejected", { userId });
//         console.log(
//           `Emitted join-rejected to ${userId} (socket ${joinerSocketId})`
//         );
//       }

//       // Remove pending request
//       await pubClient.del(`meeting:${meetingId}:pending:${userId}`);
//     });

//     socket.on("join-room", ({ meetingId, userId }) => {
//       console.log(`join-room: ${userId} joining room for meeting ${meetingId}`);
//       socket.join(`meeting_${meetingId}`);
//       console.log(`User ${userId} joined room meeting_${meetingId}`);
//     });

//     socket.on("update-status", ({ meetingId, userId, audio, video }) => {
//       socket
//         .to(`meeting_${meetingId}`)
//         .emit("update-status", { userId, audio, video });
//     });

//     socket.on(
//       "screen-share-status",
//       ({ meetingId, userId, isSharingScreen, screenSharePeerId }) => {
//         console.log(
//           `screen-share-status: ${userId} in meeting ${meetingId} - isSharingScreen: ${isSharingScreen}, screenSharePeerId: ${screenSharePeerId}`
//         );
//         io.to(`meeting_${meetingId}`).emit("screen-share-status", {
//           userId,
//           isSharingScreen,
//           screenSharePeerId,
//         });
//         console.log(
//           `Broadcasted screen-share-status for ${userId} to meeting ${meetingId}`
//         );
//       }
//     );

//     socket.on("update-peer-id", async ({ meetingId, userId, peerId }) => {
//       console.log(
//         `update-peer-id: ${userId} updated peerId to ${peerId} for meeting ${meetingId}`
//       );
//       await pubClient.set(`meeting:${meetingId}:user:${userId}:peer`, peerId, {
//         EX: 3600,
//       });
//       io.to(`meeting_${meetingId}`).emit("update-peer-id", { userId, peerId });
//       console.log(
//         `Broadcasted update-peer-id for ${userId} to meeting ${meetingId}`
//       );

//       // Trigger existing-participants for the updated peer
//       const userKeys = await pubClient.keys(`meeting:${meetingId}:user:*:peer`);
//       const existingParticipants = [];
//       for (const key of userKeys) {
//         const participantId = key.split(":")[3];
//         if (participantId === userId) continue;
//         const participantPeerId = await pubClient.get(
//           `meeting:${meetingId}:user:${participantId}:peer`
//         );
//         const participantName = await pubClient.get(
//           `meeting:${meetingId}:user:${participantId}:name`
//         );
//         if (participantPeerId && participantName) {
//           existingParticipants.push({
//             userId: participantId,
//             userName: participantName,
//             peerId: participantPeerId,
//           });
//         }
//       }
//       const userSocketId = await pubClient.get(
//         `meeting:${meetingId}:user:${userId}:socket`
//       );
//       if (userSocketId) {
//         io.to(userSocketId).emit("existing-participants", existingParticipants);
//         console.log(
//           `Sent existing-participants to ${userId} after peer ID update`
//         );
//       }
//     });

//     socket.on("leave-meeting", async ({ meetingId, userId }) => {
//       console.log(`leave-meeting: ${userId} leaving meeting ${meetingId}`);
//       socket.leave(`meeting_${meetingId}`);
//       socket.to(`meeting_${meetingId}`).emit("user-left", { userId });
//       await pubClient.del(`meeting:${meetingId}:user:${userId}:peer`);
//       await pubClient.del(`meeting:${meetingId}:user:${userId}:name`);
//       await pubClient.del(`meeting:${meetingId}:user:${userId}:socket`);
//       await pubClient.del(`meeting:${meetingId}:admitted:${userId}`);
//     });

//     socket.on("disconnect", async () => {
//       console.log(`Video call user disconnected: ${userId}`);
//       const meetings = await pubClient.keys(`meeting:*:user:${userId}:peer`);
//       for (const key of meetings) {
//         const meetingId = key.split(":")[1];
//         socket.to(`meeting_${meetingId}`).emit("user-left", { userId });
//         await pubClient.del(key);
//         await pubClient.del(`meeting:${meetingId}:user:${userId}:name`);
//         await pubClient.del(`meeting:${meetingId}:user:${userId}:socket`);
//         await pubClient.del(`meeting:${meetingId}:admitted:${userId}`);
//       }
//     });
//   });

//   return io;
// };
import { Server, Socket } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import { verifyAccessToken } from "../../utils/jwt";
import VideoCallRepository from "../../repositories/implementations/imVideoCallRepository";
import VideoCallService from "../../services/implementations/imVideoCallService";

interface UserPayload {
  id: string;
  role: string;
}

interface CustomSocket extends Socket {
  data: {
    user?: UserPayload;
  };
}

export const initializeVideoSocket = async (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/video-socket.io/",
  });
  console.log("Socket.IO video call server initialized");

  // Redis Setup
  const pubClient = createClient({ url: process.env.REDIS_URL });
  const subClient = pubClient.duplicate();

  pubClient.on("error", (err) => console.error("Redis Pub Client Error:", err));
  subClient.on("error", (err) => console.error("Redis Sub Client Error:", err));

  await Promise.all([pubClient.connect(), subClient.connect()]);
  io.adapter(createAdapter(pubClient, subClient));
  console.log("Redis adapter for video call connected");

  // Socket.IO Authentication
  io.use((socket: CustomSocket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      console.error("Authentication error: No token provided");
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = verifyAccessToken(token);
      socket.data.user = decoded;
      next();
    } catch (error: any) {
      console.error("Authentication error:", error.message);
      next(new Error("Authentication error: Invalid token"));
    }
  });

  // Socket.IO Connection Handling
  io.on("connection", (socket: CustomSocket) => {
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
          const videoCallRepo = new VideoCallRepository();
          const meeting = await videoCallRepo.findMeeting(meetingId);
          if (!meeting) {
            console.error(`Meeting ${meetingId} not found`);
            callback({ success: false, error: "Meeting not found" });
            return;
          }

          // Store socket ID, peer ID, and name
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

          // Check if user was recently admitted
          const admittedKey = `meeting:${meetingId}:admitted:${userId}`;
          const isAdmitted = await pubClient.get(admittedKey);
          console.log(`join-meeting: isAdmitted for ${userId}:`, !!isAdmitted);

          // Check if user is in participants
          const isAlreadyJoined = meeting.participants.some(
            (p) => p.userId === userId
          );
          console.log(
            `join-meeting: isAlreadyJoined for ${userId}:`,
            isAlreadyJoined
          );

          // If user is the creator or recently admitted, join directly
          if (meeting.creatorId === userId || (isAdmitted && isAlreadyJoined)) {
            socket.join(`meeting_${meetingId}`);
            console.log(`User ${userId} joined room meeting_${meetingId}`);
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
            return;
          }

          // For non-creator, non-admitted users, send join request
          console.log(`join-meeting: Sending join request for ${userId}`);
          await pubClient.set(
            `meeting:${meetingId}:pending:${userId}`,
            JSON.stringify({ userId, userName, peerId }),
            { EX: 300 }
          );

          // Notify creator directly
          const creatorSocketId = await pubClient.get(
            `meeting:${meetingId}:user:${meeting.creatorId}:socket`
          );
          if (creatorSocketId) {
            io.to(creatorSocketId).emit("join-request", {
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
            return;
          }

          socket.join(`meeting_${meetingId}`);
          callback({ success: true, message: "Join request sent to creator" });
        } catch (error: any) {
          console.error("Error in join-meeting:", error.message);
          callback({ success: false, error: error.message });
        }
      }
    );

    socket.on("admit-user", async ({ meetingId, userId, userName, peerId }) => {
      console.log(`admit-user: ${userId} for meeting ${meetingId}`);
      const videoCallRepo = new VideoCallRepository();
      const videoCallService = new VideoCallService();
      const meeting = await videoCallRepo.findMeeting(meetingId);
      if (!meeting || meeting.creatorId !== socket.data.user?.id) {
        console.error("Unauthorized or meeting not found");
        return;
      }

      // Add user to MongoDB
      try {
        await videoCallService.joinMeeting(meetingId, userId, userName, peerId);
        console.log(
          `MongoDB updated with participant ${userId} for meeting ${meetingId}`
        );
      } catch (error: any) {
        console.error(`Failed to update MongoDB for ${userId}:`, error.message);
        return;
      }

      // Mark user as admitted
      await pubClient.set(`meeting:${meetingId}:admitted:${userId}`, "true", {
        EX: 3600,
      });

      // Update Redis with latest peer ID and name
      await pubClient.set(`meeting:${meetingId}:user:${userId}:peer`, peerId, {
        EX: 3600,
      });
      await pubClient.set(
        `meeting:${meetingId}:user:${userId}:name`,
        userName,
        { EX: 3600 }
      );

      // Get joiner's socket ID
      const joinerSocketId = await pubClient.get(
        `meeting:${meetingId}:user:${userId}:socket`
      );
      if (!joinerSocketId) {
        console.error(`No socket ID found for user ${userId}`);
        return;
      }

      // Ensure joiner is in the room
      io.sockets.sockets.get(joinerSocketId)?.join(`meeting_${meetingId}`);
      console.log(
        `User ${userId} joined room meeting_${meetingId} via admit-user`
      );

      // Retry broadcasting user-joined
      const broadcastUserJoined = async (retryCount = 0) => {
        io.to(`meeting_${meetingId}`).emit("user-joined", {
          userId,
          userName,
          peerId,
        });
        console.log(
          `Emitted user-joined for ${userId} in meeting ${meetingId} (attempt ${
            retryCount + 1
          })`
        );

        // Verify if all participants received user-joined
        const userKeys = await pubClient.keys(
          `meeting:${meetingId}:user:*:socket`
        );
        for (const key of userKeys) {
          const participantId = key.split(":")[3];
          if (participantId === userId) continue;
          const participantSocketId = await pubClient.get(key);
          if (
            participantSocketId &&
            io.sockets.sockets.get(participantSocketId)
          ) {
            console.log(
              `Confirmed ${participantId} is in room for ${userId}'s join`
            );
          } else if (retryCount < 3) {
            console.log(
              `Retrying user-joined broadcast for ${userId} (attempt ${
                retryCount + 2
              })`
            );
            setTimeout(() => broadcastUserJoined(retryCount + 1), 2000);
          }
        }
      };

      await broadcastUserJoined();

      // Remove pending request
      await pubClient.del(`meeting:${meetingId}:pending:${userId}`);

      // Notify admitted user directly
      io.to(joinerSocketId).emit("user-admitted", { userId });
      console.log(
        `Emitted user-admitted to ${userId} (socket ${joinerSocketId})`
      );

      // Notify existing participants to call the new user
      io.to(`meeting_${meetingId}`).emit("request-existing-participants", {
        userId,
        peerId,
      });
      console.log(`Emitted request-existing-participants for ${userId}`);
    });

    socket.on("reject-user", async ({ meetingId, userId, userName }) => {
      console.log(`reject-user: ${userId} for meeting ${meetingId}`);
      const videoCallRepo = new VideoCallRepository();
      const meeting = await videoCallRepo.findMeeting(meetingId);
      if (!meeting || meeting.creatorId !== socket.data.user?.id) {
        console.error("Unauthorized or meeting not found");
        return;
      }

      // Notify rejected user
      const joinerSocketId = await pubClient.get(
        `meeting:${meetingId}:user:${userId}:socket`
      );
      if (joinerSocketId) {
        io.to(joinerSocketId).emit("join-rejected", { userId });
        console.log(
          `Emitted join-rejected to ${userId} (socket ${joinerSocketId})`
        );
      }

      // Remove pending request
      await pubClient.del(`meeting:${meetingId}:pending:${userId}`);
    });

    socket.on("join-room", ({ meetingId, userId }) => {
      console.log(`join-room: ${userId} joining room for meeting ${meetingId}`);
      socket.join(`meeting_${meetingId}`);
      console.log(`User ${userId} joined room meeting_${meetingId}`);
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
        io.to(`meeting_${meetingId}`).emit("screen-share-status", {
          userId,
          isSharingScreen,
          screenSharePeerId,
        });
        console.log(
          `Broadcasted screen-share-status for ${userId} to meeting ${meetingId}`
        );
      }
    );

    socket.on("message", ({ meetingId, message }) => {
      console.log(
        `message: User ${message.senderId} sent a message in meeting ${meetingId}: ${message.text}`
      );
      io.to(`meeting_${meetingId}`).emit("message", message);
      console.log(
        `Broadcasted message from ${message.senderId} to meeting ${meetingId}`
      );
    });

    socket.on("update-peer-id", async ({ meetingId, userId, peerId }) => {
      console.log(
        `update-peer-id: ${userId} updated peerId to ${peerId} for meeting ${meetingId}`
      );
      await pubClient.set(`meeting:${meetingId}:user:${userId}:peer`, peerId, {
        EX: 3600,
      });
      io.to(`meeting_${meetingId}`).emit("update-peer-id", { userId, peerId });
      console.log(
        `Broadcasted update-peer-id for ${userId} to meeting ${meetingId}`
      );

      // Trigger existing-participants for the updated peer
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
      const userSocketId = await pubClient.get(
        `meeting:${meetingId}:user:${userId}:socket`
      );
      if (userSocketId) {
        io.to(userSocketId).emit("existing-participants", existingParticipants);
        console.log(
          `Sent existing-participants to ${userId} after peer ID update`
        );
      }
    });

    socket.on("leave-meeting", async ({ meetingId, userId }) => {
      console.log(`leave-meeting: ${userId} leaving meeting ${meetingId}`);
      socket.leave(`meeting_${meetingId}`);
      socket.to(`meeting_${meetingId}`).emit("user-left", { userId });
      await pubClient.del(`meeting:${meetingId}:user:${userId}:peer`);
      await pubClient.del(`meeting:${meetingId}:user:${userId}:name`);
      await pubClient.del(`meeting:${meetingId}:user:${userId}:socket`);
      await pubClient.del(`meeting:${meetingId}:admitted:${userId}`);
    });

    socket.on("disconnect", async () => {
      console.log(`Video call user disconnected: ${userId}`);
      const meetings = await pubClient.keys(`meeting:*:user:${userId}:peer`);
      for (const key of meetings) {
        const meetingId = key.split(":")[1];
        socket.to(`meeting_${meetingId}`).emit("user-left", { userId });
        await pubClient.del(key);
        await pubClient.del(`meeting:${meetingId}:user:${userId}:name`);
        await pubClient.del(`meeting:${meetingId}:user:${userId}:socket`);
        await pubClient.del(`meeting:${meetingId}:admitted:${userId}`);
      }
    });
  });

  return io;
};
