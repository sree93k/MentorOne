// import { Server, Socket } from "socket.io";
// import { createClient } from "redis";
// import { createAdapter } from "@socket.io/redis-adapter";
// import jwt from "jsonwebtoken";
// import ChatService from "../services/implementations/imChatService";
// import MessageService from "../services/implementations/imMessageService";
// import UserRepository from "../repositories/implementations/imUserRepository";
// import VideoCallService from "../services/implementations/imVideoCallService";
// import VideoCallRepository from "../repositories/implementations/imVideoCallRepository";
// import { NextFunction, Request, Response } from "express";
// import { decodeToken, verifyAccessToken } from "../utils/jwt";

// interface UserPayload {
//   id: string;
//   role: "mentee" | "mentor";
// }

// interface CustomSocket extends Socket {
//   data: {
//     user?: UserPayload;
//   };
// }

// export const auth = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");
//   if (!token) {
//     return res.status(401).json({ error: "No token provided" });
//   }

//   try {
//     const decoded = verifyAccessToken(token);
//     req.user = decoded;
//     next();
//   } catch (error: any) {
//     res.status(401).json({ error: "Invalid token" });
//   }
// };

// export const initializeSocket = async (httpServer: any) => {
//   const io = new Server(httpServer, {
//     cors: {
//       origin: process.env.FRONTEND_URL || "http://localhost:5173",
//       methods: ["GET", "POST"],
//       credentials: true,
//     },
//     path: "/socket.io/",
//   });

//   const pubClient = createClient({ url: process.env.REDIS_URL });
//   const subClient = pubClient.duplicate();

//   pubClient.on("error", (err) => console.error("Redis Pub Client Error:", err));
//   subClient.on("error", (err) => console.error("Redis Sub Client Error:", err));

//   await Promise.all([pubClient.connect(), subClient.connect()]);
//   io.adapter(createAdapter(pubClient, subClient));

//   const chatService = new ChatService();
//   const messageService = new MessageService();
//   const userRepository = new UserRepository();
//   const videoCallService = new VideoCallService(new VideoCallRepository());

//   io.use((socket: CustomSocket, next: (err?: Error) => void) => {
//     const token = socket.handshake.auth.token;
//     if (!token) {
//       return next(new Error("Authentication error: No token provided"));
//     }

//     try {
//       const decoded = verifyAccessToken(token);
//       socket.data.user = decoded;
//       next();
//     } catch (error: any) {
//       next(new Error(`Authentication error: ${error.message}`));
//     }
//   });

//   io.on("connection", async (socket: CustomSocket) => {
//     const userId = socket.data.user?.id;
//     const role = socket.data.user?.role;
//     if (!userId || !role) {
//       socket.disconnect();
//       return;
//     }

//     await userRepository.updateOnlineStatus(userId, role, true);
//     await pubClient.set(`user:${userId}:online`, "true", { EX: 3600 });

//     const chats = await chatService.getChatsByUserAndRole(userId, role);
//     chats.forEach((chat) => {
//       socket.join(`chat_${chat._id}`);
//     });

//     io.emit("userStatus", { userId, role, isOnline: true });

//     socket.on(
//       "sendMessage",
//       async ({ chatId, content, type = "text" }, callback) => {
//         try {
//           const message = await messageService.sendMessage(
//             chatId,
//             userId,
//             content,
//             type
//           );
//           const populatedMessage = await messageService.getMessagesByChatId(
//             chatId
//           );
//           const latestMessage = populatedMessage[populatedMessage.length - 1];
//           io.to(`chat_${chatId}`).emit("receiveMessage", latestMessage);
//           callback({ success: true, message: latestMessage });
//         } catch (error: any) {
//           callback({ error: error.message });
//         }
//       }
//     );

//     socket.on("getChatHistory", async ({ chatId }, callback) => {
//       try {
//         const messages = await messageService.getMessagesByChatId(chatId);
//         callback({ success: true, messages });
//       } catch (error: any) {
//         callback({ error: error.message });
//       }
//     });

//     socket.on("markAsRead", async ({ chatId }, callback) => {
//       try {
//         await messageService.markMessagesAsRead(chatId, userId);
//         callback({ success: true });
//       } catch (error: any) {
//         callback({ error: error.message });
//       }
//     });

//     socket.on(
//       "join-meeting",
//       async ({ meetingId, userId, userName }, callback) => {
//         try {
//           await videoCallService.joinMeeting(meetingId, userId);
//           socket.join(`meeting_${meetingId}`);
//           io.to(`meeting_${meetingId}`).emit("user-joined", {
//             userId,
//             userName,
//           });
//           await pubClient.set(`meeting:${meetingId}:user:${userId}`, userName, {
//             EX: 3600,
//           });
//           callback({ success: true });
//         } catch (error: any) {
//           callback({ error: error.message });
//         }
//       }
//     );

//     socket.on("offer", ({ to, offer }) => {
//       socket
//         .to(`meeting_${meetingId}`)
//         .emit("offer", { from: userId, to, offer });
//     });

//     socket.on("answer", ({ to, answer }) => {
//       socket
//         .to(`meeting_${meetingId}`)
//         .emit("answer", { from: userId, to, answer });
//     });

//     socket.on("ice-candidate", ({ to, candidate }) => {
//       socket
//         .to(`meeting_${meetingId}`)
//         .emit("ice-candidate", { from: userId, to, candidate });
//     });

//     socket.on("update-status", ({ meetingId, userId, audio, video }) => {
//       io.to(`meeting_${meetingId}`).emit("update-status", {
//         userId,
//         audio,
//         video,
//       });
//     });

//     socket.on("message", ({ meetingId, message }) => {
//       io.to(`meeting_${meetingId}`).emit("message", message);
//     });

//     socket.on("reaction", ({ meetingId, userId, userName, reaction }) => {
//       io.to(`meeting_${meetingId}`).emit("reaction", {
//         userId,
//         userName,
//         reaction,
//       });
//     });

//     socket.on("leave-meeting", async ({ meetingId, userId }) => {
//       try {
//         await videoCallService.leaveMeeting(meetingId, userId);
//         socket.leave(`meeting_${meetingId}`);
//         io.to(`meeting_${meetingId}`).emit("user-left", { userId });
//         await pubClient.del(`meeting:${meetingId}:user:${userId}`);
//       } catch (error: any) {
//         console.error("Error leaving meeting:", error);
//       }
//     });

//     socket.on("disconnect", async () => {
//       await userRepository.updateOnlineStatus(userId, role, false);
//       await pubClient.del(`user:${userId}:online`);
//       io.emit("userStatus", { userId, role, isOnline: false });

//       const meetings = await pubClient.keys(`meeting:*:user:${userId}`);
//       for (const key of meetings) {
//         const meetingId = key.split(":")[1];
//         await videoCallService.leaveMeeting(meetingId, userId);
//         io.to(`meeting_${meetingId}`).emit("user-left", { userId });
//         await pubClient.del(key);
//       }
//     });
//   });

//   // In socket.ts, inside io.on("connection")
//   socket.on(
//     "join-meeting",
//     async ({ meetingId, userId, userName }, callback) => {
//       try {
//         await videoCallService.joinMeeting(meetingId, userId);
//         socket.join(`meeting_${meetingId}`);
//         io.to(`meeting_${meetingId}`).emit("user-joined", {
//           userId,
//           userName,
//         });
//         await pubClient.set(`meeting:${meetingId}:user:${userId}`, userName, {
//           EX: 3600,
//         });
//         callback({ success: true });
//       } catch (error: any) {
//         if (error.status === 403) {
//           socket.emit("meeting-full");
//         }
//         callback({ error: error.message });
//       }
//     }
//   );

//   return io;
// };
import { Server, Socket } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import ChatService from "../services/implementations/imChatService";
import MessageService from "../services/implementations/imMessageService";
import UserRepository from "../repositories/implementations/imUserRepository";
import VideoCallService from "../services/implementations/imVideoCallService";
import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { ApiError } from "../middlewares/errorHandler";

interface UserPayload {
  id: string;
  role: "mentee" | "mentor";
}

interface CustomSocket extends Socket {
  data: {
    user?: UserPayload;
  };
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    console.error("HTTP auth error: No token provided");
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    console.log("Verifying HTTP token with ACCESS_TOKEN_SECRET");
    const decoded = verifyAccessToken(token);
    console.log("HTTP auth successful, user:", decoded);
    req.user = decoded;
    next();
  } catch (error: any) {
    console.error("HTTP auth error:", error.message);
    res.status(401).json({ error: "Invalid token" });
  }
};

export const initializeSocket = async (httpServer: any) => {
  console.log(
    "Initializing Socket.IO with CORS origin:",
    process.env.FRONTEND_URL || "http://localhost:5173"
  );
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/socket.io/",
  });
  console.log("Socket.IO server initialized");

  // Redis Setup
  const pubClient = createClient({ url: process.env.REDIS_URL });
  const subClient = pubClient.duplicate();

  pubClient.on("error", (err) => console.error("Redis Pub Client Error:", err));
  subClient.on("error", (err) => console.error("Redis Sub Client Error:", err));

  await Promise.all([pubClient.connect(), subClient.connect()]);
  io.adapter(createAdapter(pubClient, subClient));
  console.log("Redis adapter connected");

  // Initialize services and repositories
  const chatService = new ChatService();
  const messageService = new MessageService();
  const userRepository = new UserRepository();
  const videoCallService = new VideoCallService();

  // Socket.IO Authentication
  io.use((socket: CustomSocket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token;
    console.log(
      "Socket.IO authentication attempt with token:",
      token?.substring(0, 20) + "..."
    );
    if (!token) {
      console.error("Authentication error: No token provided");
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      console.log("Verifying token with ACCESS_TOKEN_SECRET");
      const decoded = verifyAccessToken(token);
      console.log("Socket.IO authentication successful, user:", decoded);
      socket.data.user = decoded;
      next();
    } catch (error: any) {
      console.error("Authentication error:", error.message, error.stack);
      next(new Error(`Authentication error: ${error.message}`));
    }
  });

  // Socket.IO Connection Handling
  io.on("connection", async (socket: CustomSocket) => {
    const userId = socket.data.user?.id;
    const role = socket.data.user?.role;
    if (!userId || !role) {
      console.error("Invalid user data, disconnecting:", { userId, role });
      socket.disconnect();
      return;
    }

    console.log(`User connected: ${userId} as ${role}`);

    // Update online status
    await userRepository.updateOnlineStatus(userId, role, true);
    await pubClient.set(`user:${userId}:online`, "true", { EX: 3600 });

    // Join role-specific chat rooms
    const chats = await chatService.getChatsByUserAndRole(userId, role);
    console.log(
      `User ${userId} joining chats:`,
      chats.map((c) => c._id.toString())
    );
    chats.forEach((chat) => {
      socket.join(`chat_${chat._id}`);
      console.log(`User ${userId} joined chat: ${chat._id} as ${role}`);
    });

    // Emit online status to all clients
    io.emit("userStatus", { userId, role, isOnline: true });

    // Log all incoming events for debugging
    socket.onAny((event, ...args) => {
      console.log(`Received event: ${event}`, args);
    });

    // Video Call Events
    // socket.on("join-meeting", async (payload, callback) => {
    //   console.log("Raw join-meeting payload:", payload);
    //   try {
    //     const { meetingId, userId: clientUserId, userName } = payload || {};
    //     console.log("Parsed join-meeting event:", {
    //       meetingId,
    //       clientUserId,
    //       userName,
    //     });
    //     if (!meetingId || !clientUserId || !userName) {
    //       throw new Error(
    //         "Missing required fields: meetingId, userId, or userName"
    //       );
    //     }
    //     if (clientUserId !== userId) {
    //       throw new ApiError(403, "Forbidden", "User ID mismatch");
    //     }
    //     console.log(
    //       `Calling videoCallService.joinMeeting: ${meetingId}, ${userId}`
    //     );
    //     await videoCallService.joinMeeting(meetingId, userId);
    //     console.log(`Joining room: meeting_${meetingId}`);
    //     await socket.join(`meeting_${meetingId}`);
    //     console.log(`Emitting user-joined to room: meeting_${meetingId}`);
    //     socket
    //       .to(`meeting_${meetingId}`)
    //       .emit("user-joined", { userId, userName });
    //     await pubClient.set(`meeting:${meetingId}:user:${userId}`, userName, {
    //       EX: 3600,
    //     });
    //     console.log(`User ${userId} joined meeting: ${meetingId}`);
    //     callback({ success: true });
    //   } catch (error: any) {
    //     console.error("Error in join-meeting:", {
    //       message: error.message,
    //       stack: error.stack,
    //       status: error.status,
    //     });
    //     callback({
    //       success: false,
    //       error: error.message || "Failed to join meeting",
    //     });
    //   }
    // });
    socket.on("join-meeting", async (payload, callback) => {
      console.log("Received join-meeting event with payload:", payload);
      try {
        console.log("Processing join-meeting...");
        callback({ success: true, message: "Test response" });
      } catch (error: any) {
        console.error("Error in join-meeting:", {
          message: error.message,
          stack: error.stack,
        });
        callback({ success: false, error: error.message || "Test error" });
      }
    });
    socket.on("offer", ({ to, offer }) => {
      console.log("Received offer event:", { from: userId, to });
      socket.to(to).emit("offer", { from: userId, offer });
    });

    socket.on("answer", ({ to, answer }) => {
      console.log("Received answer event:", { from: userId, to });
      socket.to(to).emit("answer", { from: userId, answer });
    });

    socket.on("ice-candidate", ({ to, candidate }) => {
      console.log("Received ice-candidate event:", { from: userId, to });
      socket.to(to).emit("ice-candidate", { from: userId, candidate });
    });

    socket.on(
      "update-status",
      ({ meetingId, userId: statusUserId, audio, video }) => {
        console.log("Received update-status event:", {
          meetingId,
          statusUserId,
          audio,
          video,
        });
        socket
          .to(`meeting_${meetingId}`)
          .emit("update-status", { userId: statusUserId, audio, video });
      }
    );

    socket.on("message", ({ meetingId, message }) => {
      console.log("Received message event for meeting:", {
        meetingId,
        message,
      });
      io.to(`meeting_${meetingId}`).emit("message", message);
    });

    socket.on(
      "reaction",
      ({ meetingId, userId: reactionUserId, userName, reaction }) => {
        console.log("Received reaction event:", {
          meetingId,
          reactionUserId,
          userName,
          reaction,
        });
        io.to(`meeting_${meetingId}`).emit("reaction", {
          senderId: reactionUserId,
          senderName: userName,
          reaction,
        });
      }
    );

    socket.on("leave-meeting", async ({ meetingId, userId: leavingUserId }) => {
      console.log("Received leave-meeting event:", {
        meetingId,
        leavingUserId,
      });
      try {
        await videoCallService.leaveMeeting(meetingId, userId);
        socket.leave(`meeting_${meetingId}`);
        socket
          .to(`meeting_${meetingId}`)
          .emit("user-left", { userId: leavingUserId });
        await pubClient.del(`meeting:${meetingId}:user:${userId}`);
        console.log(`User ${userId} left meeting: ${meetingId}`);
      } catch (error: any) {
        console.error("Error in leave-meeting:", error.message, error.stack);
      }
    });

    // Handle disconnection
    socket.on("disconnect", async () => {
      console.log(`User disconnected: ${userId}`);
      await userRepository.updateOnlineStatus(userId, role, false);
      await pubClient.del(`user:${userId}:online`);
      io.emit("userStatus", { userId, role, isOnline: false });

      const meetings = await pubClient.keys(`meeting:*:user:${userId}`);
      for (const key of meetings) {
        const meetingId = key.split(":")[1];
        await videoCallService.leaveMeeting(meetingId, userId);
        socket.to(`meeting_${meetingId}`).emit("user-left", { userId });
        await pubClient.del(key);
        console.log(`Cleaned up user ${userId} from meeting: ${meetingId}`);
      }
    });
  });

  return io;
};
