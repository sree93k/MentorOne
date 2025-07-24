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
  console.log(
    "Initializing Socket.IO /notifications namespace with role support"
  );

  ioInstance = notificationNamespace?.server;

  if (!pubClient.isOpen) await pubClient.connect();
  if (!subClient.isOpen) await subClient.connect();

  // Subscribe to existing notification channels
  const channels = [
    "payment-notifications",
    "booking-notifications",
    "chat-notifications",
    "meeting-notifications", // Added meeting notifications
    // NEW: Role-specific count channels
    "mentor-notification-count",
    "mentee-notification-count",
  ];

  for (const channel of channels) {
    await subClient.subscribe(channel, (message) => {
      try {
        const data = JSON.parse(message);
        console.log("Received Redis notification:", { channel, data });

        if (channel.includes("-notification-count")) {
          // Handle count updates
          const role = channel.includes("mentor") ? "mentor" : "mentee";
          notificationNamespace
            .to(`user_${data.recipientId}`)
            .emit("notification_count_update", {
              role,
              increment: data.increment,
            });
        } else {
          // Handle regular notifications
          const notification = data;
          notificationNamespace
            .to(`user_${notification.recipient}`)
            .emit("new_notification", notification);
        }
      } catch (err: any) {
        console.error(
          `Error processing Redis ${channel} notification:`,
          err.message
        );
      }
    });
  }

  // Socket authentication middleware
  notificationNamespace.use(
    (socket: CustomSocket, next: (err?: Error) => void) => {
      console.log("🔍 Notification socket middleware: Checking authentication");
      console.log("🔍 Socket handshake headers:", socket.handshake.headers);

      const cookieHeader = socket.handshake.headers.cookie;
      console.log("🔍 Cookie header:", cookieHeader);

      if (!cookieHeader) {
        console.error("❌ Notification auth error: No cookies provided");
        return next(new Error("Authentication error: No cookies provided"));
      }

      const cookies = cookieHeader
        .split(";")
        .reduce((acc: Record<string, string>, cookie) => {
          const [name, value] = cookie.trim().split("=");
          acc[name] = value;
          return acc;
        }, {});

      const token = cookies.accessToken;
      console.log(
        "🔍 Extracted token from cookies:",
        token ? "Found" : "Not found"
      );

      if (!token) {
        console.error("❌ Notification auth error: No accessToken in cookies");
        return next(new Error("Authentication error: No accessToken provided"));
      }

      try {
        const decoded = verifyAccessToken(token) as UserPayload;
        socket.data.user = decoded;
        console.log(
          "✅ Notification socket authentication successful for user:",
          decoded.id
        );
        next();
      } catch (error: any) {
        console.error(
          "❌ Notification socket authentication error:",
          error.message
        );
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

    // NEW: Send initial notification counts when user connects
    socket.on("getNotificationCounts", async (callback) => {
      try {
        const notificationService = new NotificationService();
        const counts = await notificationService.getUnreadNotificationCounts(
          userId
        );
        callback({ success: true, counts });
      } catch (error: any) {
        console.error("Error fetching notification counts:", error.message);
        callback({
          success: false,
          error: "Failed to fetch notification counts",
        });
      }
    });

    // UPDATED: Role-aware notification fetching
    socket.on("getUnreadNotifications", async ({ role }, callback) => {
      try {
        const notificationService = new NotificationService();
        const notifications = await notificationService.getUnreadNotifications(
          userId,
          role // Pass role parameter
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

    // NEW: Clear notification count for specific role
    socket.on("clearNotificationCount", async ({ role }, callback) => {
      try {
        // This will be handled by the frontend Redux state
        // Just acknowledge the request
        callback({ success: true });
      } catch (error: any) {
        console.error("Error clearing notification count:", error.message);
        callback({
          success: false,
          error: "Failed to clear notification count",
        });
      }
    });

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
