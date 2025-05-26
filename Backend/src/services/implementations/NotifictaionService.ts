// import NotificationRepository from "../../repositories/implementations/NotificationRepository";
// import { ApiError } from "../../middlewares/errorHandler";
// import { createClient } from "@redis/client";

// interface NotificationData {
//   recipientId: string;
//   type: "payment" | "booking" | "chat";
//   message: string;
//   relatedId?: string;
//   sender?: { firstName: string; lastName: string; id: string };
// }

// export default class NotificationService {
//   private notificationRepository: NotificationRepository;
//   private redisClient: any;

//   constructor() {
//     this.notificationRepository = new NotificationRepository();
//     this.redisClient = createClient({ url: process.env.REDIS_URL });
//     this.redisClient.connect().catch((err: any) => {
//       console.error("Redis connection error:", err);
//     });
//   }

//   async createNotification(
//     recipientId: string,
//     type: "payment" | "booking" | "chat",
//     message: string,
//     relatedId?: string,
//     io?: any,
//     sender?: { firstName: string; lastName: string; id: string }
//   ): Promise<void> {
//     try {
//       const notification = await this.notificationRepository.create({
//         recipientId,
//         type,
//         message,
//         relatedId,
//         isRead: false,
//         createdAt: new Date(),
//       });

//       const payload = {
//         _id: notification._id,
//         recipient: recipientId, // Align with frontend
//         type,
//         content: message, // Align with frontend
//         relatedId,
//         isRead: false,
//         createdAt: notification.createdAt,
//         sender: sender
//           ? { firstName: sender.firstName, lastName: sender.lastName }
//           : undefined,
//       };

//       // Publish to Redis instead of direct Socket.IO emission
//       await this.redisClient.publish(
//         `${type}-notifications`,
//         JSON.stringify(payload)
//       );

//       // Fallback direct emission if io is provided (for compatibility)
//       if (io) {
//         io.to(`user_${recipientId}`).emit("new_notification", payload);
//       }
//     } catch (error: any) {
//       throw new ApiError(500, "Failed to create notification", error.message);
//     }
//   }

//   async createPaymentAndBookingNotifications(
//     paymentId: string,
//     bookingId: string,
//     menteeId: string,
//     mentorId: string,
//     io?: any
//   ): Promise<void> {
//     try {
//       // Fetch mentor and mentee details for sender information
//       const User = require("mongoose").model("Users"); // Adjust based on your model
//       const mentee = await User.findById(menteeId).select("firstName lastName");
//       const mentor = await User.findById(mentorId).select("firstName lastName");

//       // Notify mentee
//       await this.createNotification(
//         menteeId,
//         "payment",
//         `Payment of ₹${paymentId} confirmed for booking ${bookingId}`,
//         paymentId,
//         io,
//         mentor
//           ? {
//               firstName: mentor.firstName,
//               lastName: mentor.lastName,
//               id: mentorId,
//             }
//           : undefined
//       );
//       await this.createNotification(
//         menteeId,
//         "booking",
//         `Booking ${bookingId} confirmed`,
//         bookingId,
//         io,
//         mentor
//           ? {
//               firstName: mentor.firstName,
//               lastName: mentor.lastName,
//               id: mentorId,
//             }
//           : undefined
//       );

//       // Notify mentor
//       await this.createNotification(
//         mentorId,
//         "payment",
//         `Received payment of ₹${paymentId} for booking ${bookingId}`,
//         paymentId,
//         io,
//         mentee
//           ? {
//               firstName: mentee.firstName,
//               lastName: mentee.lastName,
//               id: menteeId,
//             }
//           : undefined
//       );
//       await this.createNotification(
//         mentorId,
//         "booking",
//         `New booking ${bookingId} confirmed`,
//         bookingId,
//         io,
//         mentee
//           ? {
//               firstName: mentee.firstName,
//               lastName: mentee.lastName,
//               id: menteeId,
//             }
//           : undefined
//       );
//     } catch (error: any) {
//       throw new ApiError(
//         500,
//         "Failed to create payment and booking notifications",
//         error.message
//       );
//     }
//   }

//   async getUnreadNotifications(recipientId: string): Promise<any[]> {
//     try {
//       return await this.notificationRepository.findUnreadByRecipient(
//         recipientId
//       );
//     } catch (error: any) {
//       throw new ApiError(
//         500,
//         "Failed to fetch unread notifications",
//         error.message
//       );
//     }
//   }

//   async markNotificationAsRead(
//     notificationId: string,
//     userId: string
//   ): Promise<void> {
//     try {
//       const notification = await this.notificationRepository.findById(
//         notificationId
//       );
//       if (!notification) {
//         throw new ApiError(404, "Notification not found");
//       }
//       if (notification.recipientId !== userId) {
//         throw new ApiError(
//           403,
//           "Unauthorized to mark this notification as read"
//         );
//       }
//       await this.notificationRepository.markAsRead(notificationId);
//     } catch (error: any) {
//       throw new ApiError(
//         500,
//         "Failed to mark notification as read",
//         error.message
//       );
//     }
//   }
// }
import NotificationRepository from "../../repositories/implementations/NotificationRepository";
import { ApiError } from "../../middlewares/errorHandler";
import { createClient } from "@redis/client";

interface NotificationData {
  recipientId: string;
  type: "payment" | "booking" | "chat";
  message: string;
  relatedId?: string;
  sender?: { firstName: string; lastName: string; id: string };
}

export default class NotificationService {
  private notificationRepository: NotificationRepository;
  private redisClient: any;

  constructor() {
    this.notificationRepository = new NotificationRepository();
    this.redisClient = createClient({ url: process.env.REDIS_URL });
    this.redisClient.connect().catch((err: any) => {
      console.error("Redis connection error:", err);
    });
  }

  async createNotification(
    recipientId: string,
    type: "payment" | "booking" | "chat",
    message: string,
    relatedId?: string,
    io?: any,
    sender?: { firstName: string; lastName: string; id: string }
  ): Promise<void> {
    try {
      const notification = await this.notificationRepository.create({
        recipientId,
        type,
        message,
        relatedId,
        isRead: false,
        createdAt: new Date(),
      });

      const payload = {
        _id: notification._id.toString(),
        recipient: recipientId,
        type,
        content: message,
        link:
          type === "payment"
            ? `/payments/${relatedId}`
            : `/bookings/${relatedId}`, // Add link for navigation
        isRead: false,
        createdAt: notification.createdAt.toISOString(),
        sender: sender
          ? { firstName: sender.firstName, lastName: sender.lastName }
          : undefined,
      };

      // Publish to Redis
      await this.redisClient.publish(
        `${type}-notifications`,
        JSON.stringify(payload)
      );

      // Direct emission if io is provided
      if (io) {
        io.of("/notifications")
          .to(`user_${recipientId}`)
          .emit("new_notification", payload);
      }
    } catch (error: any) {
      console.error("Error creating notification:", error.message);
      throw new ApiError(500, "Failed to create notification", error.message);
    }
  }

  async createPaymentAndBookingNotifications(
    paymentId: string,
    bookingId: string,
    menteeId: string,
    mentorId: string,
    io?: any
  ): Promise<void> {
    try {
      const User = require("mongoose").model("Users");
      const mentee = await User.findById(menteeId).select("firstName lastName");
      const mentor = await User.findById(mentorId).select("firstName lastName");

      // Mentee notifications
      await this.createNotification(
        menteeId,
        "payment",
        `Payment of ₹${paymentId} confirmed for booking ${bookingId}`,
        paymentId,
        io,
        mentor
          ? {
              firstName: mentor.firstName,
              lastName: mentor.lastName,
              id: mentorId,
            }
          : undefined
      );
      await this.createNotification(
        menteeId,
        "booking",
        `Booking ${bookingId} confirmed`,
        bookingId,
        io,
        mentor
          ? {
              firstName: mentor.firstName,
              lastName: mentor.lastName,
              id: mentorId,
            }
          : undefined
      );

      // Mentor notifications
      await this.createNotification(
        mentorId,
        "payment",
        `Received payment of ₹${paymentId} for booking ${bookingId}`,
        paymentId,
        io,
        mentee
          ? {
              firstName: mentee.firstName,
              lastName: mentee.lastName,
              id: menteeId,
            }
          : undefined
      );
      await this.createNotification(
        mentorId,
        "booking",
        `New booking ${bookingId} confirmed`,
        bookingId,
        io,
        mentee
          ? {
              firstName: mentee.firstName,
              lastName: mentee.lastName,
              id: menteeId,
            }
          : undefined
      );
    } catch (error: any) {
      console.error(
        "Error creating payment and booking notifications:",
        error.message
      );
      throw new ApiError(
        500,
        "Failed to create payment and booking notifications",
        error.message
      );
    }
  }

  async getUnreadNotifications(recipientId: string): Promise<any[]> {
    try {
      const notifications =
        await this.notificationRepository.findUnreadByRecipient(recipientId);
      // Transform to match frontend NotificationData interface
      return notifications.map((n) => ({
        _id: n._id.toString(),
        recipient: n.recipientId,
        type: n.type,
        content: n.message,
        link:
          n.type === "payment"
            ? `/payments/${n.relatedId}`
            : `/bookings/${n.relatedId}`,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
        sender: n.sender
          ? { firstName: n.sender.firstName, lastName: n.sender.lastName }
          : undefined,
      }));
    } catch (error: any) {
      throw new ApiError(
        500,
        "Failed to fetch unread notifications",
        error.message
      );
    }
  }

  async markNotificationAsRead(
    notificationId: string,
    userId: string
  ): Promise<void> {
    try {
      const notification = await this.notificationRepository.findById(
        notificationId
      );
      if (!notification) {
        throw new ApiError(404, "Notification not found");
      }
      if (notification.recipientId !== userId) {
        throw new ApiError(
          403,
          "Unauthorized to mark this notification as read"
        );
      }
      await this.notificationRepository.markAsRead(notificationId);
    } catch (error: any) {
      throw new ApiError(
        500,
        "Failed to mark notification as read",
        error.message
      );
    }
  }
}
