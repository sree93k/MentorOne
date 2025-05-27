// import { Server, Socket } from "socket.io";
// import { pubClient, subClient } from "../../server"; // Reuse shared Redis clients
// import { verifyAccessToken } from "../../utils/jwt";
// import NotificationService from "../../services/implementations/NotificationService";

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

// export const initializeNotificationSocket = async (
//   notificationNamespace: Server
// ) => {
//   console.log("Initializing Socket.IO /notifications namespace");

//   ioInstance = notificationNamespace.server; // Store the parent server instance

//   // Ensure Redis clients are connected
//   if (!pubClient.isOpen) await pubClient.connect();
//   if (!subClient.isOpen) await subClient.connect();

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

// src/utils/socket/notification.ts
import { Server, Socket } from "socket.io";
import { pubClient, subClient } from "../../server";
import { verifyAccessToken } from "../../utils/jwt";
import NotificationService from "../../services/implementations/NotificationService";

interface UserPayload {
  id: string;
  role: string[];
}

interface CustomSocket extends Socket {
  data: {
    user?: UserPayload;
  };
}

let ioInstance: Server | null = null;

export const initializeNotificationSocket = async (
  notificationNamespace: Server
) => {
  console.log("Initializing Socket.IO /notifications namespace");

  ioInstance = notificationNamespace?.server;

  if (!pubClient.isOpen) await pubClient.connect();
  if (!subClient.isOpen) await subClient.connect();

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
      )}, joined room: user_${userId}`
    );
    socket.join(`user_${userId}`);

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

  return notificationNamespace;
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error("Notification Socket.IO not initialized");
  }
  return ioInstance;
};
