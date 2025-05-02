// import { Server, Socket } from "socket.io";
// import { createClient } from "redis";
// import { createAdapter } from "@socket.io/redis-adapter";
// import jwt from "jsonwebtoken";
// import mongoose from "mongoose";
// import { ExtendedError } from "socket.io/dist/namespace";

// interface UserPayload {
//   id: string;
//   role: "mentee" | "mentor";
// }

// interface CustomSocket extends Socket {
//   data: {
//     user?: UserPayload;
//   };
// }

// export const initializeSocket = async (httpServer: any) => {
//   const io = new Server(httpServer, {
//     cors: {
//       origin: process.env.FRONTEND_URL || "http://localhost:5173",
//       methods: ["GET", "POST"],
//       credentials: true,
//     },
//   });

//   // Redis Setup
//   const pubClient = createClient({ url: process.env.REDIS_URL });
//   const subClient = pubClient.duplicate();

//   pubClient.on("error", (err) => console.error("Redis Pub Client Error:", err));
//   subClient.on("error", (err) => console.error("Redis Sub Client Error:", err));

//   await Promise.all([pubClient.connect(), subClient.connect()]);
//   io.adapter(createAdapter(pubClient, subClient));
//   console.log("Redis adapter connected");

//   // Socket.IO Authentication
//   io.use((socket: CustomSocket, next: (err?: ExtendedError) => void) => {
//     const token = socket.handshake.auth.token;
//     if (!token) {
//       return next(new Error("Authentication error: No token provided"));
//     }

//     try {
//       const decoded = jwt.verify(
//         token,
//         process.env.ACCESS_TOKEN_SECRET!
//       ) as UserPayload;
//       socket.data.user = decoded;
//       next();
//     } catch (error) {
//       next(new Error("Authentication error: Invalid token"));
//     }
//   });

//   // Socket.IO Connection Handling
//   io.on("connection", async (socket: CustomSocket) => {
//     const userId = socket.data.user?.id;
//     const role = socket.data.user?.role;
//     if (!userId || !role) return socket.disconnect();

//     console.log(`User connected: ${userId} as ${role}`);

//     // Update online status in MongoDB
//     if (role === "mentor") {
//       await mongoose
//         .model("Mentor")
//         .findByIdAndUpdate(userId, { isOnline: true });
//     } else if (role === "mentee") {
//       await mongoose
//         .model("Mentee")
//         .findByIdAndUpdate(userId, { isOnline: true });
//     }

//     // Cache online status in Redis (expires in 1 hour)
//     await pubClient.set(`user:${userId}:online`, "true", { EX: 3600 });

//     // Join role-specific chat rooms
//     const chats = await mongoose.model("Chat").find({
//       "roles.userId": userId,
//       "roles.role": role,
//     });
//     chats.forEach((chat) => {
//       socket.join(`chat_${chat._id}`);
//       console.log(`User ${userId} joined chat: ${chat._id} as ${role}`);
//     });

//     // Emit online status to all clients
//     io.emit("userStatus", { userId, role, isOnline: true });

//     // Send message
//     socket.on("sendMessage", async ({ chatId, content }, callback) => {
//       try {
//         const chat = await mongoose.model("Chat").findById(chatId);
//         if (
//           !chat ||
//           !chat.users.includes(new mongoose.Types.ObjectId(userId))
//         ) {
//           return callback({ error: "Unauthorized or chat not found" });
//         }

//         const message = new (mongoose.model("Message"))({
//           sender: userId,
//           content,
//           chat: chatId,
//           readBy: [userId],
//         });

//         await message.save();
//         await mongoose
//           .model("Chat")
//           .findByIdAndUpdate(chatId, { latestMessage: message._id });

//         const populatedMessage = await mongoose
//           .model("Message")
//           .findById(message._id)
//           .populate("sender", "firstName lastName profilePicture")
//           .populate("readBy", "firstName lastName");

//         io.to(`chat_${chatId}`).emit("receiveMessage", populatedMessage);
//         callback({ success: true, message: populatedMessage });
//       } catch (error: any) {
//         callback({ error: error.message });
//       }
//     });

//     // Fetch chat history
//     socket.on("getChatHistory", async ({ chatId }, callback) => {
//       try {
//         const messages = await mongoose
//           .model("Message")
//           .find({ chat: chatId })
//           .populate("sender", "firstName lastName profilePicture")
//           .populate("readBy", "firstName lastName")
//           .sort({ createdAt: 1 });
//         callback({ success: true, messages });
//       } catch (error: any) {
//         callback({ error: error.message });
//       }
//     });

//     // Mark messages as read
//     socket.on("markAsRead", async ({ chatId }, callback) => {
//       try {
//         await mongoose
//           .model("Message")
//           .updateMany(
//             { chat: chatId, readBy: { $ne: userId } },
//             { $addToSet: { readBy: userId } }
//           );
//         callback({ success: true });
//       } catch (error: any) {
//         callback({ error: error.message });
//       }
//     });

//     socket.on("disconnect", async () => {
//       console.log(`User disconnected: ${userId}`);
//       if (role === "mentor") {
//         await mongoose
//           .model("Mentor")
//           .findByIdAndUpdate(userId, { isOnline: false });
//       } else if (role === "mentee") {
//         await mongoose
//           .model("Mentee")
//           .findByIdAndUpdate(userId, { isOnline: false });
//       }
//       await pubClient.del(`user:${userId}:online`);
//       io.emit("userStatus", { userId, role, isOnline: false });
//     });
//   });

//   return io;
// };
import { Server, Socket } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

interface UserPayload {
  id: string;
  role: "mentee" | "mentor";
}

interface CustomSocket extends Socket {
  data: {
    user?: UserPayload;
  };
}

export const initializeSocket = async (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Redis Setup
  const pubClient = createClient({ url: process.env.REDIS_URL });
  const subClient = pubClient.duplicate();

  pubClient.on("error", (err) => console.error("Redis Pub Client Error:", err));
  subClient.on("error", (err) => console.error("Redis Sub Client Error:", err));

  await Promise.all([pubClient.connect(), subClient.connect()]);
  io.adapter(createAdapter(pubClient, subClient));
  console.log("Redis adapter connected");

  // Socket.IO Authentication
  io.use((socket: CustomSocket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!
      ) as UserPayload;
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  // Socket.IO Connection Handling
  io.on("connection", async (socket: CustomSocket) => {
    const userId = socket.data.user?.id;
    const role = socket.data.user?.role;
    if (!userId || !role) return socket.disconnect();

    console.log(`User connected: ${userId} as ${role}`);

    // Update online status in MongoDB
    if (role === "mentor") {
      await mongoose
        .model("Mentor")
        .findByIdAndUpdate(userId, { isOnline: true });
    } else if (role === "mentee") {
      await mongoose
        .model("Mentee")
        .findByIdAndUpdate(userId, { isOnline: true });
    }

    // Cache online status in Redis (expires in 1 hour)
    await pubClient.set(`user:${userId}:online`, "true", { EX: 3600 });

    // Join role-specific chat rooms
    const chats = await mongoose.model("Chat").find({
      "roles.userId": userId,
      "roles.role": role,
    });
    chats.forEach((chat) => {
      socket.join(`chat_${chat._id}`);
      console.log(`User ${userId} joined chat: ${chat._id} as ${role}`);
    });

    // Emit online status to all clients
    io.emit("userStatus", { userId, role, isOnline: true });

    // Send message
    socket.on("sendMessage", async ({ chatId, content }, callback) => {
      try {
        const chat = await mongoose.model("Chat").findById(chatId);
        if (
          !chat ||
          !chat.users.includes(new mongoose.Types.ObjectId(userId))
        ) {
          return callback({ error: "Unauthorized or chat not found" });
        }

        const message = new (mongoose.model("Message"))({
          sender: userId,
          content,
          chat: chatId,
          readBy: [userId],
        });

        await message.save();
        await mongoose
          .model("Chat")
          .findByIdAndUpdate(chatId, { latestMessage: message._id });

        const populatedMessage = await mongoose
          .model("Message")
          .findById(message._id)
          .populate("sender", "firstName lastName profilePicture")
          .populate("readBy", "firstName lastName");

        io.to(`chat_${chatId}`).emit("receiveMessage", populatedMessage);
        callback({ success: true, message: populatedMessage });
      } catch (error: any) {
        callback({ error: error.message });
      }
    });

    // Fetch chat history
    socket.on("getChatHistory", async ({ chatId }, callback) => {
      try {
        const messages = await mongoose
          .model("Message")
          .find({ chat: chatId })
          .populate("sender", "firstName lastName profilePicture")
          .populate("readBy", "firstName lastName")
          .sort({ createdAt: 1 });
        callback({ success: true, messages });
      } catch (error: any) {
        callback({ error: error.message });
      }
    });

    // Mark messages as read
    socket.on("markAsRead", async ({ chatId }, callback) => {
      try {
        await mongoose
          .model("Message")
          .updateMany(
            { chat: chatId, readBy: { $ne: userId } },
            { $addToSet: { readBy: userId } }
          );
        callback({ success: true });
      } catch (error: any) {
        callback({ error: error.message });
      }
    });

    socket.on("disconnect", async () => {
      console.log(`User disconnected: ${userId}`);
      if (role === "mentor") {
        await mongoose
          .model("Mentor")
          .findByIdAndUpdate(userId, { isOnline: false });
      } else if (role === "mentee") {
        await mongoose
          .model("Mentee")
          .findByIdAndUpdate(userId, { isOnline: false });
      }
      await pubClient.del(`user:${userId}:online`);
      io.emit("userStatus", { userId, role, isOnline: false });
    });
  });

  return io;
};
