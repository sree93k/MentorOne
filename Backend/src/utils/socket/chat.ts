import { Server, Socket } from "socket.io";
import { createClient } from "@redis/client";
import { verifyAccessToken } from "../../utils/jwt";
import ChatService from "../../services/implementations/ChatService";
import MessageService from "../../services/implementations/MessageService";
import UserRepository from "../../repositories/implementations/UserRepository";

interface UserPayload {
  id: string;
  role: string[];
}

interface CustomSocket extends Socket {
  data: {
    user?: UserPayload;
  };
}

export const initializeChatSocket = async (chatNamespace: Server) => {
  console.log("ChatSocket: Initializing Socket.IO /chat namespace");

  const chatService = new ChatService();
  const messageService = new MessageService();
  const userRepository = new UserRepository();

  chatNamespace.use((socket: CustomSocket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token;
    console.log("ChatSocket: Middleware - Checking token", { token: !!token });
    if (!token) {
      console.error("ChatSocket: Authentication error: No token provided");
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = verifyAccessToken(token) as UserPayload;
      socket.data.user = decoded;
      console.log("ChatSocket: Middleware - Token verified", {
        userId: decoded.id,
      });
      next();
    } catch (error: any) {
      console.error("ChatSocket: Authentication error:", error.message);
      next(new Error(`Authentication error: ${error.message}`));
    }
  });

  chatNamespace.on("connection", async (socket: CustomSocket) => {
    const userId = socket.data.user?.id;
    const roles = socket.data.user?.role;
    console.log("ChatSocket: User connected", { userId, roles });
    if (!userId || !roles || !Array.isArray(roles)) {
      console.error("ChatSocket: Invalid user data, disconnecting", {
        userId,
        roles,
      });
      return socket.disconnect();
    }

    const pubClient = createClient({ url: process.env.REDIS_URL });
    console.log("ChatSocket: Connecting to Redis", {
      redisUrl: process.env.REDIS_URL,
    });
    await pubClient.connect().catch((err) => {
      console.error("ChatSocket: Redis connection error:", err.message);
    });

    try {
      for (const role of roles) {
        if (role === "mentor" || role === "mentee") {
          await userRepository.updateOnlineStatus(userId, role, true);
          console.log("ChatSocket: Updated online status in DB", {
            userId,
            role,
          });
        }
      }
      await pubClient.sAdd("online_users", userId);
      console.log("ChatSocket: Added to online_users in Redis", { userId });
    } catch (err: any) {
      console.error("ChatSocket: Error updating online status:", err.message);
    }

    try {
      for (const role of roles) {
        if (role === "mentor" || role === "mentee") {
          const chats = await chatService.getChatsByUserAndRole(userId, role);
          chats.forEach((chat) => {
            socket.join(`chat_${chat._id}`);
            console.log("ChatSocket: User joined chat", {
              userId,
              chatId: chat._id,
              role,
            });
          });
        }
      }
    } catch (err: any) {
      console.error("ChatSocket: Error joining chats:", err.message);
    }

    chatNamespace.emit("userStatus", { userId, roles, isOnline: true });
    console.log("ChatSocket: Emitted userStatus", { userId, isOnline: true });

    socket.on(
      "sendMessage",
      async ({ chatId, content, type = "text" }, callback) => {
        console.log("ChatSocket: sendMessage received", {
          chatId,
          userId,
          type,
        });
        try {
          const message = await messageService.sendMessage(
            chatId,
            userId,
            content,
            type
          );
          const populatedMessage = await messageService.getMessagesByChatId(
            chatId
          );
          const latestMessage = populatedMessage[populatedMessage.length - 1];
          chatNamespace
            .to(`chat_${chatId}`)
            .emit("receiveMessage", latestMessage);
          console.log("ChatSocket: Emitted receiveMessage", {
            chatId,
            messageId: latestMessage._id,
          });
          callback({ success: true, message: latestMessage });
        } catch (error: any) {
          console.error("ChatSocket: Error in sendMessage:", error.message);
          callback({ error: error.message });
        }
      }
    );

    socket.on("getChatHistory", async ({ chatId }, callback) => {
      console.log("ChatSocket: getChatHistory received", { chatId });
      try {
        const messages = await messageService.getMessagesByChatId(chatId);
        console.log("ChatSocket: Fetched chat history", {
          chatId,
          messageCount: messages.length,
        });
        callback({ success: true, messages });
      } catch (error: any) {
        console.error(
          "ChatSocket: Error fetching chat history:",
          error.message
        );
        callback({ error: error.message });
      }
    });

    socket.on("markAsRead", async ({ chatId }, callback) => {
      console.log("ChatSocket: markAsRead received", { chatId, userId });
      try {
        await messageService.markMessagesAsRead(chatId, userId);
        chatNamespace
          .to(`chat_${chatId}`)
          .emit("messagesRead", { chatId, userId });
        console.log("ChatSocket: Emitted messagesRead", { chatId, userId });
        callback({ success: true });
      } catch (error: any) {
        console.error(
          "ChatSocket: Error marking messages as read:",
          error.message
        );
        callback({ error: error.message });
      }
    });

    socket.on("disconnect", async () => {
      console.log("ChatSocket: User disconnected", { userId });
      try {
        for (const role of roles) {
          if (role === "mentor" || role === "mentee") {
            await userRepository.updateOnlineStatus(userId, role, false);
            console.log("ChatSocket: Updated online status in DB to offline", {
              userId,
              role,
            });
          }
        }
        await pubClient.sRem("online_users", userId);
        console.log("ChatSocket: Removed from online_users in Redis", {
          userId,
        });
        chatNamespace.emit("userStatus", { userId, roles, isOnline: false });
        console.log("ChatSocket: Emitted userStatus", {
          userId,
          isOnline: false,
        });
        await pubClient.quit();
        console.log("ChatSocket: Redis client disconnected");
      } catch (err: any) {
        console.error("ChatSocket: Error handling disconnect:", err.message);
      }
    });
  });
};
