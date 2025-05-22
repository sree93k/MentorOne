import { Server, Socket } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import jwt from "jsonwebtoken";
import ChatService from "../services/implementations/imChatService";
import MessageService from "../services/implementations/imMessageService";
import UserRepository from "../repositories/implementations/UserRepository";
import { NextFunction, Request, Response } from "express";
import {
  decodeToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/jwt";
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
  console.log("HTTP auth attempt with token:", token?.substring(0, 20) + "...");
  if (!token) {
    console.error("HTTP auth error: No token provided");
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    console.log("Verifying HTTP token with ACCESS_TOKEN_SECRET");
    // const decoded = jwt.verify(
    //   token,
    //   process.env.JACCESS_TOKEN_SECRET!
    // ) as UserPayload;
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
      return socket.disconnect();
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

    // Send message
    socket.on(
      "sendMessage",
      async ({ chatId, content, type = "text" }, callback) => {
        console.log("Received sendMessage event:", {
          chatId,
          content,
          type,
          userId,
        });
        try {
          const message = await messageService.sendMessage(
            chatId,
            userId,
            content,
            type
          );
          console.log("Message created:", message);
          const populatedMessage = await messageService.getMessagesByChatId(
            chatId
          );
          const latestMessage = populatedMessage[populatedMessage.length - 1];
          io.to(`chat_${chatId}`).emit("receiveMessage", latestMessage);
          callback({ success: true, message: latestMessage });
        } catch (error: any) {
          console.error("Error in sendMessage:", error.message, error.stack);
          callback({ error: error.message });
        }
      }
    );

    // Fetch chat history
    socket.on("getChatHistory", async ({ chatId }, callback) => {
      console.log("Received getChatHistory event:", { chatId });
      try {
        const messages = await messageService.getMessagesByChatId(chatId);
        callback({ success: true, messages });
      } catch (error: any) {
        console.error("Error fetching chat history:", error);
        callback({ error: error.message });
      }
    });

    // Mark messages as read
    socket.on("markAsRead", async ({ chatId }, callback) => {
      console.log("Received markAsRead event:", { chatId });
      try {
        await messageService.markMessagesAsRead(chatId, userId);
        callback({ success: true });
      } catch (error: any) {
        console.error("Error marking messages as read:", error);
        callback({ error: error.message });
      }
    });

    socket.on("disconnect", async () => {
      console.log(`User disconnected: ${userId}`);
      await userRepository.updateOnlineStatus(userId, role, false);
      await pubClient.del(`user:${userId}:online`);
      io.emit("userStatus", { userId, role, isOnline: false });
    });
  });

  return io;
};
