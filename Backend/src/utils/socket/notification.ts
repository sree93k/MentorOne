// // import { Server, Socket } from "socket.io";
// // import { createClient } from "@redis/client";
// // import { verifyAccessToken } from "../../utils/jwt";
// // import NotificationService from "../../services/implementations/NotifictaionService";

// // interface UserPayload {
// //   id: string;
// //   role: string[];
// // }

// // interface CustomSocket extends Socket {
// //   data: {
// //     user?: UserPayload;
// //   };
// // }

// // export const initializeNotificationSocket = async (io: Server) => {
// //   console.log("Initializing Socket.IO /notifications namespace");

// //   const notificationNamespace = io.of("/notifications");

// //   // Redis Setup
// //   const pubClient = createClient({ url: process.env.REDIS_URL });
// //   const subClient = pubClient.duplicate();

// //   pubClient.on("error", (err) => console.error("Redis Pub Client Error:", err));
// //   subClient.on("error", (err) => console.error("Redis Sub Client Error:", err));
// //   pubClient.on("connect", () =>
// //     console.log("Redis Pub Client connected (notifications)")
// //   );
// //   subClient.on("connect", () =>
// //     console.log("Redis Sub Client connected (notifications)")
// //   );

// //   try {
// //     await Promise.all([pubClient.connect(), subClient.connect()]);
// //   } catch (err) {
// //     console.error("Failed to connect Redis for notifications:", err);
// //   }

// //   // Subscribe to notification channels
// //   const channels = [
// //     "payment-notifications",
// //     "booking-notifications",
// //     "chat-notifications",
// //   ];
// //   for (const channel of channels) {
// //     await subClient.subscribe(channel, (message, channel) => {
// //       try {
// //         const notification = JSON.parse(message);
// //         console.log("Received Redis notification:", { channel, notification });
// //         notificationNamespace
// //           .to(`user_${notification.recipient}`)
// //           .emit("new_notification", notification); // Changed to new_notification
// //       } catch (err: any) {
// //         console.error(
// //           `Error processing Redis ${channel} notification:`,
// //           err.message
// //         );
// //       }
// //     });
// //   }

// //   // Authentication Middleware
// //   notificationNamespace.use(
// //     (socket: CustomSocket, next: (err?: Error) => void) => {
// //       const token = socket.handshake.auth.token;
// //       if (!token) {
// //         console.error("Notification namespace auth error: No token provided");
// //         return next(new Error("Authentication error: No token provided"));
// //       }

// //       try {
// //         const decoded = verifyAccessToken(token) as UserPayload;
// //         socket.data.user = decoded;
// //         next();
// //       } catch (error: any) {
// //         console.error("Notification namespace auth error:", error.message);
// //         next(new Error(`Authentication error: ${error.message}`));
// //       }
// //     }
// //   );

// //   // Connection Handling
// //   notificationNamespace.on("connection", async (socket: CustomSocket) => {
// //     const userId = socket.data.user?.id;
// //     const roles = socket.data.user?.role;
// //     if (!userId || !roles || !Array.isArray(roles)) {
// //       console.error("Invalid user data, disconnecting:", { userId, roles });
// //       return socket.disconnect();
// //     }

// //     console.log(
// //       `User connected to /notifications: ${userId} with roles ${roles.join(
// //         ", "
// //       )}`
// //     );

// //     // Join user-specific room
// //     socket.join(`user_${userId}`);
// //     console.log(`User ${userId} joined notification room: user_${userId}`);

// //     // Fetch unread notifications
// //     socket.on("getUnreadNotifications", async (callback) => {
// //       try {
// //         const notificationService = new NotificationService();
// //         const notifications = await notificationService.getUnreadNotifications(
// //           userId
// //         );
// //         callback({ success: true, notifications });
// //       } catch (error: any) {
// //         console.error("Error fetching unread notifications:", error.message);
// //         callback({ success: false, error: "Failed to fetch notifications" });
// //       }
// //     });

// //     // Mark notification as read
// //     socket.on(
// //       "markNotificationAsRead",
// //       async ({ notificationId }, callback) => {
// //         try {
// //           const notificationService = new NotificationService();
// //           await notificationService.markNotificationAsRead(
// //             notificationId,
// //             userId
// //           );
// //           notificationNamespace.to(`user_${userId}`).emit("notificationRead", {
// //             notificationId,
// //             isRead: true,
// //           });
// //           callback({ success: true });
// //         } catch (error: any) {
// //           console.error("Error marking notification as read:", error.message);
// //           callback({
// //             success: false,
// //             error: "Failed to mark notification as read",
// //           });
// //         }
// //       }
// //     );

// //     socket.on("disconnect", () => {
// //       console.log(`User disconnected from /notifications: ${userId}`);
// //     });

// //     // Handle reconnect attempts
// //     socket.on("reconnect_attempt", () => {
// //       console.log(`User ${userId} attempting to reconnect`);
// //     });
// //   });

// //   return notificationNamespace;
// // };
// import { Server, Socket } from "socket.io";
// import { createClient } from "@redis/client";
// import { verifyAccessToken } from "../../utils/jwt";
// import NotificationService from "../../services/implementations/NotifictaionService";

// interface UserPayload {
//   id: string;
//   role: string[];
// }

// interface CustomSocket extends Socket {
//   data: {
//     user?: UserPayload;
//   };
// }

// let ioInstance: Server | null = null;

// export const initializeNotificationSocket = async (httpServer: any) => {
//   console.log("Initializing Socket.IO /notifications namespace");

//   // Initialize Socket.IO with the provided httpServer
//   const io = new Server(httpServer, {
//     cors: {
//       origin: process.env.FRONTEND_URL || "http://localhost:5173",
//       methods: ["GET", "POST"],
//       credentials: true,
//     },
//     path: "/socket.io/",
//   });

//   const notificationNamespace = io.of("/notifications");
//   ioInstance = io; // Store the instance

//   // Redis Setup
//   const pubClient = createClient({ url: process.env.REDIS_URL });
//   const subClient = pubClient.duplicate();

//   pubClient.on("error", (err) => console.error("Redis Pub Client Error:", err));
//   subClient.on("error", (err) => console.error("Redis Sub Client Error:", err));
//   pubClient.on("connect", () =>
//     console.log("Redis Pub Client connected (notifications)")
//   );
//   subClient.on("connect", () =>
//     console.log("Redis Sub Client connected (notifications)")
//   );

//   try {
//     await Promise.all([pubClient.connect(), subClient.connect()]);
//   } catch (err) {
//     console.error("Failed to connect Redis for notifications:", err);
//   }

//   // Subscribe to notification channels
//   const channels = [
//     "payment-notifications",
//     "booking-notifications",
//     "chat-notifications",
//   ];
//   for (const channel of channels) {
//     await subClient.subscribe(channel, (message) => {
//       try {
//         const notification = JSON.parse(message);
//         console.log("Received Redis notification:", { channel, notification });
//         notificationNamespace
//           .to(`user_${notification.recipient}`)
//           .emit("new_notification", notification);
//       } catch (err: any) {
//         console.error(
//           `Error processing Redis ${channel} notification:`,
//           err.message
//         );
//       }
//     });
//   }

//   // Authentication Middleware
//   notificationNamespace.use(
//     (socket: CustomSocket, next: (err?: Error) => void) => {
//       const token = socket.handshake.auth.token;
//       if (!token) {
//         console.error("Notification namespace auth error: No token provided");
//         return next(new Error("Authentication error: No token provided"));
//       }

//       try {
//         const decoded = verifyAccessToken(token) as UserPayload;
//         socket.data.user = decoded;
//         next();
//       } catch (error: any) {
//         console.error("Notification namespace auth error:", error.message);
//         next(new Error(`Authentication error: ${error.message}`));
//       }
//     }
//   );

//   // Connection Handling
//   notificationNamespace.on("connection", async (socket: CustomSocket) => {
//     const userId = socket.data.user?.id;
//     const roles = socket.data.user?.role;
//     if (!userId || !roles || !Array.isArray(roles)) {
//       console.error("Invalid user data, disconnecting:", { userId, roles });
//       return socket.disconnect();
//     }

//     console.log(
//       `User connected to /notifications: ${userId} with roles ${roles.join(
//         ", "
//       )}`
//     );
//     socket.join(`user_${userId}`);
//     console.log(`User ${userId} joined notification room: user_${userId}`);

//     socket.on("getUnreadNotifications", async (callback) => {
//       try {
//         const notificationService = new NotificationService();
//         const notifications = await notificationService.getUnreadNotifications(
//           userId
//         );
//         callback({ success: true, notifications });
//       } catch (error: any) {
//         console.error("Error fetching unread notifications:", error.message);
//         callback({ success: false, error: "Failed to fetch notifications" });
//       }
//     });

//     socket.on(
//       "markNotificationAsRead",
//       async ({ notificationId }, callback) => {
//         try {
//           const notificationService = new NotificationService();
//           await notificationService.markNotificationAsRead(
//             notificationId,
//             userId
//           );
//           notificationNamespace.to(`user_${userId}`).emit("notificationRead", {
//             notificationId,
//             isRead: true,
//           });
//           callback({ success: true });
//         } catch (error: any) {
//           console.error("Error marking notification as read:", error.message);
//           callback({
//             success: false,
//             error: "Failed to mark notification as read",
//           });
//         }
//       }
//     );

//     socket.on("disconnect", () => {
//       console.log(`User disconnected from /notifications: ${userId}`);
//     });
//   });

//   return notificationNamespace;
// };

// export const getIO = () => {
//   if (!ioInstance) {
//     throw new Error("Notification Socket.IO not initialized");
//   }
//   return ioInstance;
// };
import { Server, Socket } from "socket.io";
import { createClient } from "@redis/client";
import { verifyAccessToken } from "../../utils/jwt";
import NotificationService from "../../services/implementations/NotifictaionService";

interface UserPayload {
  id: string;
  role: string[];
}

interface CustomSocket extends Socket {
  data: {
    user?: UserPayload;
  };
}

export const initializeNotificationSocket = async (
  notificationNamespace: Server
) => {
  console.log("Initializing Socket.IO /notifications namespace");

  // Redis Setup
  const pubClient = createClient({ url: process.env.REDIS_URL });
  const subClient = pubClient.duplicate();

  pubClient.on("error", (err) => console.error("Redis Pub Client Error:", err));
  subClient.on("error", (err) => console.error("Redis Sub Client Error:", err));
  pubClient.on("connect", () =>
    console.log("Redis Pub Client connected (notifications)")
  );
  subClient.on("connect", () =>
    console.log("Redis Sub Client connected (notifications)")
  );

  try {
    await Promise.all([pubClient.connect(), subClient.connect()]);
  } catch (err) {
    console.error("Failed to connect Redis for notifications:", err);
  }

  // Subscribe to notification channels
  const channels = [
    "payment-notifications",
    "booking-notifications",
    "chat-notifications",
  ];
  for (const channel of channels) {
    await subClient.subscribe(channel, (message) => {
      try {
        const notification = JSON.parse(message);
        console.log("Received Redis notification:", { channel, notification });
        notificationNamespace
          .to(`user_${notification.recipient}`)
          .emit("new_notification", notification);
      } catch (err: any) {
        console.error(
          `Error processing Redis ${channel} notification:`,
          err.message
        );
      }
    });
  }

  notificationNamespace.use(
    (socket: CustomSocket, next: (err?: Error) => void) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        console.error("Notification namespace auth error: No token provided");
        return next(new Error("Authentication error: No token provided"));
      }

      try {
        const decoded = verifyAccessToken(token) as UserPayload;
        socket.data.user = decoded;
        next();
      } catch (error: any) {
        console.error("Notification namespace auth error:", error.message);
        next(new Error(`Authentication error: ${error.message}`));
      }
    }
  );

  notificationNamespace.on("connection", async (socket: CustomSocket) => {
    const userId = socket.data.user?.id;
    const roles = socket.data.user?.role;
    if (!userId || !roles || !Array.isArray(roles)) {
      console.error("Invalid user data, disconnecting:", { userId, roles });
      return socket.disconnect();
    }

    console.log(
      `User connected to /notifications: ${userId} with roles ${roles.join(
        ", "
      )}`
    );
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined notification room: user_${userId}`);

    socket.on("getUnreadNotifications", async (callback) => {
      try {
        const notificationService = new NotificationService();
        const notifications = await notificationService.getUnreadNotifications(
          userId
        );
        callback({ success: true, notifications });
      } catch (error: any) {
        console.error("Error fetching unread notifications:", error.message);
        callback({ success: false, error: "Failed to fetch notifications" });
      }
    });

    socket.on(
      "markNotificationAsRead",
      async ({ notificationId }, callback) => {
        try {
          const notificationService = new NotificationService();
          await notificationService.markNotificationAsRead(
            notificationId,
            userId
          );
          notificationNamespace.to(`user_${userId}`).emit("notificationRead", {
            notificationId,
            isRead: true,
          });
          callback({ success: true });
        } catch (error: any) {
          console.error("Error marking notification as read:", error.message);
          callback({
            success: false,
            error: "Failed to mark notification as read",
          });
        }
      }
    );

    socket.on("disconnect", () => {
      console.log(`User disconnected from /notifications: ${userId}`);
    });
  });
};
