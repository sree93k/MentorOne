import { Server, Socket } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import { verifyAccessToken } from "../../utils/jwt";

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
        console.log(`join-meeting: ${userId} joining meeting ${meetingId}`);
        if (!meetingId || !userId || !peerId) {
          callback({ success: false, error: "Invalid payload" });
          return;
        }

        try {
          socket.join(`meeting_${meetingId}`);

          //   await pubClient.set(
          //     `meeting:${meetingId}:user:${userId}:peer`,
          //     peerId,
          //     { EX: 3600 }
          //   );
          // Store user data in Redis
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

          // Get existing participants
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
          // Notify existing participants about the new user
          socket
            .to(`meeting_${meetingId}`)
            .emit("user-joined", { userId, userName, peerId });
          console.log(
            `Emitted user-joined for ${userId} to meeting_${meetingId}`
          );

          // Send existing participants to the joining user
          socket.emit("existing-participants", existingParticipants);
          console.log(
            `Sent existing participants to ${userId}:`,
            existingParticipants
          );

          callback({ success: true, message: "Joined meeting successfully" });
        } catch (error: any) {
          console.error("Error in join-meeting:", error.message);
          callback({ success: false, error: error.message });
        }
      }
    );

    socket.on("update-status", ({ meetingId, userId, audio, video }) => {
      socket
        .to(`meeting_${meetingId}`)
        .emit("update-status", { userId, audio, video });
    });

    socket.on("leave-meeting", async ({ meetingId, userId }) => {
      console.log(`leave-meeting: ${userId} leaving meeting ${meetingId}`);
      socket.leave(`meeting_${meetingId}`);
      socket.to(`meeting_${meetingId}`).emit("user-left", { userId });
      await pubClient.del(`meeting:${meetingId}:user:${userId}:peer`);
    });

    socket.on("disconnect", async () => {
      console.log(`Video call user disconnected: ${userId}`);
      const meetings = await pubClient.keys(`meeting:*:user:${userId}:peer`);
      for (const key of meetings) {
        const meetingId = key.split(":")[1];
        socket.to(`meeting_${meetingId}`).emit("user-left", { userId });
        await pubClient.del(key);
      }
    });
  });

  return io;
};
