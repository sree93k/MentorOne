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
  console.log("Initializing Socket.IO /chat namespace");

  const chatService = new ChatService();
  const messageService = new MessageService();
  const userRepository = new UserRepository();

  chatNamespace.use((socket: CustomSocket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      console.error("Authentication error: No token provided");
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = verifyAccessToken(token) as UserPayload;
      socket.data.user = decoded;
      next();
    } catch (error: any) {
      console.error("Authentication error:", error.message);
      next(new Error(`Authentication error: ${error.message}`));
    }
  });

  chatNamespace.on("connection", async (socket: CustomSocket) => {
    const userId = socket.data.user?.id;
    const roles = socket.data.user?.role;
    if (!userId || !roles || !Array.isArray(roles)) {
      console.error("Invalid user data, disconnecting:", { userId, roles });
      return socket.disconnect();
    }

    console.log(
      `User connected to /chat: ${userId} with roles ${roles.join(", ")}`
    );

    const pubClient = createClient({ url: process.env.REDIS_URL });
    await pubClient.connect();

    try {
      for (const role of roles) {
        if (role === "mentor" || role === "mentee") {
          await userRepository.updateOnlineStatus(userId, role, true);
          console.log(`Updated online status for ${userId} as ${role}`);
        }
      }
      await pubClient.sAdd("online_users", userId);
    } catch (err: any) {
      console.error("Error updating online status:", err.message);
    }

    try {
      for (const role of roles) {
        if (role === "mentor" || role === "mentee") {
          const chats = await chatService.getChatsByUserAndRole(userId, role);
          chats.forEach((chat) => {
            socket.join(`chat_${chat._id}`);
            console.log(`User ${userId} joined chat: ${chat._id} as ${role}`);
          });
        }
      }
    } catch (err: any) {
      console.error("Error joining chats:", err.message);
    }

    chatNamespace.emit("userStatus", { userId, roles, isOnline: true });

    socket.on(
      "sendMessage",
      async ({ chatId, content, type = "text" }, callback) => {
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
          callback({ success: true, message: latestMessage });
        } catch (error: any) {
          console.error("Error in sendMessage:", error.message);
          callback({ error: error.message });
        }
      }
    );

    socket.on("getChatHistory", async ({ chatId }, callback) => {
      try {
        const messages = await messageService.getMessagesByChatId(chatId);
        callback({ success: true, messages });
      } catch (error: any) {
        console.error("Error fetching chat history:", error.message);
        callback({ error: error.message });
      }
    });

    socket.on("markAsRead", async ({ chatId }, callback) => {
      try {
        await messageService.markMessagesAsRead(chatId, userId);
        chatNamespace
          .to(`chat_${chatId}`)
          .emit("messagesRead", { chatId, userId });
        callback({ success: true });
      } catch (error: any) {
        console.error("Error marking messages as read:", error.message);
        callback({ error: error.message });
      }
    });

    socket.on("disconnect", async () => {
      console.log(`User disconnected from /chat: ${userId}`);
      try {
        for (const role of roles) {
          if (role === "mentor" || role === "mentee") {
            await userRepository.updateOnlineStatus(userId, false, null);
          }
        }
        await pubClient.sRem("online_users", userId);
        chatNamespace.emit("userStatus", { userId, roles, isOnline: false });
        await pubClient.quit();
      } catch (err: any) {
        console.error("Error handling disconnect:", err.message);
      }
    });
  });
};
