// import { Server, Socket } from "socket.io";
// import { createClient } from "redis";
// import { createAdapter } from "@socket.io/redis-adapter";
// import UserRepository from "../../repositories/implementations/imUserRepository";
// import VideoCallService from "../../services/implementations/imVideoCallService";
// import { NextFunction, Request, Response } from "express";
// import { verifyAccessToken } from "../../utils/jwt";

// interface UserPayload {
//   id: string;
//   role: "mentee" | "mentor" | string[];
// }

// interface CustomSocket extends Socket {
//   data: {
//     user?: UserPayload;
//   };
// }

// export const auth = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");
//   if (!token) {
//     console.error("HTTP auth error: No token provided");
//     return res.status(401).json({ error: "No token provided" });
//   }

//   try {
//     console.log("Verifying HTTP token with ACCESS_TOKEN_SECRET");
//     const decoded = verifyAccessToken(token);
//     console.log("HTTP auth successful, user:", decoded);
//     req.user = decoded;
//     next();
//   } catch (error: any) {
//     console.error("HTTP auth error:", error.message);
//     res.status(401).json({ error: "Invalid token" });
//   }
// };

// export const initializeVideoSocket = async (httpServer: any) => {
//   console.log(
//     "Initializing Socket.IO for video call with CORS origin:",
//     process.env.FRONTEND_URL
//   );
//   const io = new Server(httpServer, {
//     cors: {
//       origin: process.env.FRONTEND_URL,
//       methods: ["GET", "POST"],
//       credentials: true,
//     },
//     path: "/video-socket.io/",
//   });
//   console.log("Socket.IO video call server initialized");

//   // Redis Setup
//   const pubClient = createClient({
//     url: process.env.REDIS_URL || "redis://localhost:6379",
//   });
//   const subClient = pubClient.duplicate();

//   pubClient.on("error", (err) => console.error("Redis Pub Client Error:", err));
//   subClient.on("error", (err) => console.error("Redis Sub Client Error:", err));

//   try {
//     await Promise.all([pubClient.connect(), subClient.connect()]);
//     console.log("Redis clients connected successfully");
//   } catch (err) {
//     console.error("Failed to connect Redis clients:", err);
//     throw err;
//   }
//   io.adapter(createAdapter(pubClient, subClient));
//   console.log("Redis adapter for video call connected");

//   // Initialize services and repositories
//   const userRepository = new UserRepository();
//   const videoCallService = new VideoCallService();

//   // Socket.IO Authentication
//   io.use((socket: CustomSocket, next: (err?: Error) => void) => {
//     const token = socket.handshake.auth.token;
//     console.log(
//       "Socket.IO video call authentication attempt with token:",
//       token?.substring(0, 20) + "..."
//     );
//     if (!token) {
//       console.error("Video call authentication error: No token provided");
//       return next(new Error("Authentication error: No token provided"));
//     }

//     try {
//       console.log("Verifying token with ACCESS_TOKEN_SECRET");
//       const decoded = verifyAccessToken(token);
//       console.log(
//         "Socket.IO video call authentication successful, user:",
//         decoded
//       );
//       socket.data.user = decoded;
//       next();
//     } catch (error: any) {
//       console.error(
//         "Video call authentication error:",
//         error.message,
//         error.stack
//       );
//       next(new Error(`Authentication error: ${error.message}`));
//     }
//   });

//   // Socket.IO Connection Handling
//   io.on("connection", async (socket: CustomSocket) => {
//     const userId = socket.data.user?.id;
//     const role = socket.data.user?.role;
//     if (!userId || !role) {
//       console.error("Invalid user data, disconnecting:", { userId, role });
//       socket.disconnect();
//       return;
//     }

//     console.log(
//       `Video call user connected: ${userId} as ${role}, socket ID: ${socket.id}`
//     );

//     // Update online status
//     await userRepository.updateOnlineStatus(userId, role, true);
//     await pubClient.set(`user:${userId}:online`, "true", { EX: 3600 });

//     // Emit online status to all clients
//     io.emit("userStatus", { userId, role, isOnline: true });

//     // Log all incoming events for debugging
//     socket.onAny((event, ...args) => {
//       console.log(`Received video call event: ${event}`, args);
//     });

//     socket.on("join-meeting", async (payload, callback) => {
//       const { meetingId, userId: joiningUserId, userName, peerId } = payload;
//       console.log(
//         `join-meeting event received for user ${joiningUserId}, meeting ${meetingId}`
//       );

//       if (!meetingId || !joiningUserId || !peerId) {
//         console.error("Invalid join-meeting payload:", payload);
//         callback({ success: false, error: "Invalid payload" });
//         return;
//       }

//       try {
//         // Join the room
//         socket.join(`meeting_${meetingId}`);
//         console.log(
//           `User ${joiningUserId} joined room: meeting_${meetingId}, socket ID: ${socket.id}`
//         );

//         // Log all sockets in the room
//         const socketsInRoom = await io.in(`meeting_${meetingId}`).allSockets();
//         console.log(
//           `Sockets in meeting_${meetingId}:`,
//           Array.from(socketsInRoom)
//         );

//         // Update meeting participants
//         await videoCallService.joinMeeting(
//           meetingId,
//           joiningUserId,
//           userName,
//           peerId
//         );
//         console.log(
//           `User ${joiningUserId} added to meeting ${meetingId} in database`
//         );

//         // Store peerId in Redis
//         await pubClient.set(
//           `meeting:${meetingId}:user:${joiningUserId}:peer`,
//           peerId,
//           { EX: 3600 }
//         );
//         console.log(
//           `Stored peerId ${peerId} for user ${joiningUserId} in Redis`
//         );

//         // Emit user-joined to other sockets in the room
//         console.log(
//           `Emitting user-joined to meeting_${meetingId} for user ${joiningUserId}`
//         );
//         socket.to(`meeting_${meetingId}`).emit("user-joined", {
//           userId: joiningUserId,
//           userName,
//           peerId,
//         });

//         // Log emission details
//         console.log(
//           `user-joined event emitted for ${joiningUserId} to meeting_${meetingId}`
//         );

//         // Send callback response
//         console.log(`Sending join-meeting callback for user ${joiningUserId}`);
//         callback({ success: true, message: "Joined meeting successfully" });
//       } catch (error: any) {
//         console.error("Error in join-meeting:", error.message, error.stack);
//         callback({ success: false, error: error.message });
//       }
//     });

//     socket.on("offer", ({ to, offer }) => {
//       console.log("Received offer event:", { from: userId, to });
//       socket.to(to).emit("offer", { from: userId, offer });
//     });

//     socket.on("answer", ({ to, answer }) => {
//       console.log("Received answer event:", { from: userId, to });
//       socket.to(to).emit("answer", { from: userId, answer });
//     });

//     socket.on("ice-candidate", ({ to, candidate }) => {
//       console.log("Received ice-candidate event:", { from: userId, to });
//       socket.to(to).emit("ice-candidate", { from: userId, candidate });
//     });

//     socket.on(
//       "update-status",
//       ({ meetingId, userId: statusUserId, audio, video }) => {
//         console.log("Received update-status event:", {
//           meetingId,
//           statusUserId,
//           audio,
//           video,
//         });
//         socket
//           .to(`meeting_${meetingId}`)
//           .emit("update-status", { userId: statusUserId, audio, video });
//       }
//     );

//     socket.on("message", ({ meetingId, message }) => {
//       console.log("Received message event for meeting:", {
//         meetingId,
//         message,
//       });
//       io.to(`meeting_${meetingId}`).emit("message", message);
//     });

//     socket.on(
//       "reaction",
//       ({ meetingId, userId: reactionUserId, userName, reaction }) => {
//         console.log("Received reaction event:", {
//           meetingId,
//           reactionUserId,
//           userName,
//           reaction,
//         });
//         io.to(`meeting_${meetingId}`).emit("reaction", {
//           senderId: reactionUserId,
//           senderName: userName,
//           reaction,
//         });
//       }
//     );

//     socket.on("leave-meeting", async ({ meetingId, userId: leavingUserId }) => {
//       console.log("Received leave-meeting event:", {
//         meetingId,
//         leavingUserId,
//       });
//       try {
//         await videoCallService.leaveMeeting(meetingId, leavingUserId);
//         socket.leave(`meeting_${meetingId}`);
//         socket
//           .to(`meeting_${meetingId}`)
//           .emit("user-left", { userId: leavingUserId });
//         await pubClient.del(`meeting:${meetingId}:user:${leavingUserId}:peer`);
//         console.log(`User ${leavingUserId} left meeting: ${meetingId}`);
//       } catch (error: any) {
//         console.error("Error in leave-meeting:", error.message, error.stack);
//       }
//     });

//     socket.on("debug-ping", (payload, callback) => {
//       console.log("Received debug-ping event:", payload);
//       callback({ success: true, message: "Pong" });
//     });

//     socket.on("disconnect", async () => {
//       console.log(
//         `Video call user disconnected: ${userId}, socket ID: ${socket.id}`
//       );
//       await userRepository.updateOnlineStatus(userId, role, false);
//       await pubClient.del(`user:${userId}:online`);
//       io.emit("userStatus", { userId, role, isOnline: false });

//       const meetings = await pubClient.keys(`meeting:*:user:${userId}:peer`);
//       for (const key of meetings) {
//         const meetingId = key.split(":")[1];
//         await videoCallService.leaveMeeting(meetingId, userId);
//         socket.to(`meeting_${meetingId}`).emit("user-left", { userId });
//         await pubClient.del(key);
//         console.log(`Cleaned up user ${userId} from meeting: ${meetingId}`);
//       }
//     });
//   });

//   return io;
// };
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
          await pubClient.set(
            `meeting:${meetingId}:user:${userId}:peer`,
            peerId,
            { EX: 3600 }
          );
          socket
            .to(`meeting_${meetingId}`)
            .emit("user-joined", { userId, userName, peerId });
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
