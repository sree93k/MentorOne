import NotificationRepository from "../../repositories/implementations/NotificationRepository";
import { pubClient } from "../../server";
import BookingRepository from "../../repositories/implementations/BookingRepository";
import { IBookingRepository } from "../../repositories/interface/IBookingRepository";
import { INotificationService } from "../../services/interface/INotificationService";

interface NotificationData {
  recipientId: string;
  targetRole: "mentor" | "mentee" | "both";
  type: "payment" | "booking" | "chat" | "meeting" | "booking_reminder";
  message: string;
  relatedId?: string;
  sender?: { firstName: string; lastName: string; id: string };
}

export default class NotificationService implements INotificationService {
  private notificationRepository: NotificationRepository;
  private bookingRepository: IBookingRepository;

  constructor() {
    this.notificationRepository = new NotificationRepository();
    this.bookingRepository = new BookingRepository();
  }

  async createNotification(
    recipientId: string,
    type: "payment" | "booking" | "chat" | "meeting" | "booking_reminder",
    message: string,
    relatedId?: string,
    io?: any,
    sender?: { firstName: string; lastName: string; id: string },
    targetRole: "mentor" | "mentee" | "both" = "both" // NEW PARAMETER
  ): Promise<void> {
    try {
      console.log("Notification service creating notification:", {
        recipientId,
        type,
        message,
        relatedId,
        sender,
        targetRole, // NEW LOG
      });

      const notification = await this.notificationRepository.create({
        recipientId,
        targetRole, // NEW FIELD
        type,
        message,
        relatedId,
        isRead: false,
        isSeen: false,
        createdAt: new Date(),
        senderId: sender?.id,
      });
      console.log("✅ Notification created:", {
        _id: notification._id,
        targetRole: notification.targetRole, // ✅ VERIFY THIS
      });
      const payload = {
        _id: notification._id.toString(),
        recipient: recipientId,
        targetRole, // NEW FIELD
        type,
        content: message,
        link:
          type === "payment"
            ? `/payment/${relatedId}`
            : type === "booking"
            ? `/bookings/${relatedId}`
            : type === "meeting"
            ? `/user/meeting-join/${relatedId}`
            : type === "booking_reminder"
            ? `/bookings/${relatedId}`
            : undefined,
        isRead: false,
        createdAt: notification.createdAt.toISOString(),
        sender: sender
          ? { firstName: sender.firstName, lastName: sender.lastName }
          : undefined,
      };

      console.log("Created notification payload:", payload);

      // Publish to role-specific Redis channels
      if (!pubClient.isOpen) await pubClient.connect();

      // Publish to general notification channel
      await pubClient.publish(`${type}-notifications`, JSON.stringify(payload));

      // Publish to role-specific channels for real-time count updates
      if (targetRole === "both") {
        await pubClient.publish(
          "mentor-notification-count",
          JSON.stringify({ recipientId, increment: 1 })
        );
        await pubClient.publish(
          "mentee-notification-count",
          JSON.stringify({ recipientId, increment: 1 })
        );
      } else {
        await pubClient.publish(
          `${targetRole}-notification-count`,
          JSON.stringify({ recipientId, increment: 1 })
        );
      }
    } catch (error: any) {
      console.error("Error creating notification:", error.message);
      throw new Error("Failed to create notification: " + error.message);
    }
  }

  async createPaymentAndBookingNotifications(
    paymentId: string,
    bookingId: string,
    menteeId: string,
    mentorId: string,
    amount: number,
    io?: any
  ): Promise<void> {
    try {
      const User = require("mongoose").model("Users");
      const Admin = require("mongoose").model("Admin");
      const mentee = await User.findById(menteeId).select("firstName lastName");
      const mentor = await User.findById(mentorId).select("firstName lastName");
      const admin = await Admin.findOne({
        role: { $regex: "^admin$", $options: "i" },
      }).select("adminName _id firstName lastName");

      const fallbackAdminId = "67db051192a2210b560467d4";
      if (!admin) {
        console.warn(
          "Admin not found. Using fallback admin ID:",
          fallbackAdminId
        );
      }

      const booking = await this.bookingRepository.findById(bookingId);
      console.log("Booking response:", booking);

      // Mentee notifications (role-specific)
      await this.createNotification(
        menteeId,
        "payment",
        `Payment of ₹${amount} confirmed for booking ${
          booking?.serviceId?.title || "Unknown Service"
        }`,
        paymentId,
        io,
        mentor
          ? {
              firstName: mentor.firstName,
              lastName: mentor.lastName,
              id: mentorId,
            }
          : undefined,
        "mentee" // ROLE-SPECIFIC
      );

      await this.createNotification(
        menteeId,
        "booking",
        `Booking ${booking?.serviceId?.title || "Unknown Service"} confirmed`,
        bookingId,
        io,
        mentor
          ? {
              firstName: mentor.firstName,
              lastName: mentor.lastName,
              id: mentorId,
            }
          : undefined,
        "mentee" // ROLE-SPECIFIC
      );

      // Mentor notifications (role-specific)
      await this.createNotification(
        mentorId,
        "payment",
        `Received payment of ₹${amount} for booking ${
          booking?.serviceId?.title || "Unknown Service"
        }`,
        paymentId,
        io,
        mentee
          ? {
              firstName: mentee.firstName,
              lastName: mentee.lastName,
              id: menteeId,
            }
          : undefined,
        "mentor" // ROLE-SPECIFIC
      );

      await this.createNotification(
        mentorId,
        "booking",
        `New booking ${
          booking?.serviceId?.title || "Unknown Service"
        } confirmed`,
        bookingId,
        io,
        mentee
          ? {
              firstName: mentee.firstName,
              lastName: mentee.lastName,
              id: menteeId,
            }
          : undefined,
        "mentor" // ROLE-SPECIFIC
      );

      // Admin notifications (both roles or create separate admin handling)
      const adminId = admin?._id.toString() || fallbackAdminId;
      await this.createNotification(
        adminId,
        "payment",
        `Payment of ₹${amount} confirmed for booking ${
          booking?.serviceId?.title || "Unknown Service"
        } by ${mentee?.firstName || "Unknown"} ${mentee?.lastName || ""}`,
        paymentId,
        io,
        mentee
          ? {
              firstName: mentee.firstName,
              lastName: mentee.lastName,
              id: menteeId,
            }
          : undefined,
        "both" // Admin sees both roles
      );
    } catch (error: any) {
      console.error(
        "Error creating payment and booking notifications:",
        error.message
      );
      throw new Error(
        "Failed to create payment and booking notifications: " + error.message
      );
    }
  }

  // NEW METHOD: Get role-specific unread count
  async getUnreadNotificationCount(
    recipientId: string,
    role: "mentor" | "mentee"
  ): Promise<number> {
    try {
      const count =
        await this.notificationRepository.countUnreadByRecipientAndRole(
          recipientId,
          role
        );
      console.log(`Unread ${role} notifications for ${recipientId}:`, count);
      return count;
    } catch (error: any) {
      console.error("Error fetching unread notification count:", error.message);
      throw new Error("Failed to fetch notification count: " + error.message);
    }
  }

  // NEW METHOD: Get both role counts
  async getUnreadNotificationCounts(
    recipientId: string
  ): Promise<{ mentorCount: number; menteeCount: number }> {
    try {
      const [mentorCount, menteeCount] = await Promise.all([
        this.notificationRepository.countUnreadByRecipientAndRole(
          recipientId,
          "mentor"
        ),
        this.notificationRepository.countUnreadByRecipientAndRole(
          recipientId,
          "mentee"
        ),
      ]);

      console.log(`Notification counts for ${recipientId}:`, {
        mentorCount,
        menteeCount,
      });
      return { mentorCount, menteeCount };
    } catch (error: any) {
      console.error("Error fetching notification counts:", error.message);
      throw new Error("Failed to fetch notification counts: " + error.message);
    }
  }

  // UPDATED METHOD: Role-aware notification fetching
  // async getUnreadNotifications(
  //   recipientId: string,
  //   role?: "mentor" | "mentee"
  // ): Promise<any[]> {
  //   try {
  //     const notifications = role
  //       ? await this.notificationRepository.findUnreadByRecipientAndRole(
  //           recipientId,
  //           role
  //         )
  //       : await this.notificationRepository.findUnreadByRecipient(recipientId);

  //     const mappedNotifications = notifications.map((n) => ({
  //       _id: n._id,
  //       recipient: n.recipient,
  //       targetRole: n.targetRole, // NEW FIELD
  //       type: n.type,
  //       content: n.content,
  //       link:
  //         n.type === "payment"
  //           ? `/payments/${n.relatedId}`
  //           : n.type === "booking"
  //           ? `/bookings/${n.relatedId}`
  //           : n.type === "meeting"
  //           ? `/user/meeting-join/${n.relatedId}`
  //           : undefined,
  //       isRead: n.isRead,
  //       createdAt: new Date(n.createdAt).toISOString(),
  //       sender: n.sender,
  //     }));

  //     console.log(
  //       `Fetched ${role || "all"} notifications:`,
  //       mappedNotifications.length
  //     );
  //     return mappedNotifications;
  //   } catch (error: any) {
  //     console.error("Error fetching unread notifications:", error.message);
  //     throw new Error("Failed to fetch notifications: " + error.message);
  //   }
  // }
  async getUnreadNotifications(
    recipientId: string,
    role?: "mentor" | "mentee",
    page: number = 1,
    limit: number = 12
  ): Promise<any[]> {
    try {
      const notifications = role
        ? await this.notificationRepository.findUnreadByRecipientAndRole(
            recipientId,
            role,
            page,
            limit
          )
        : await this.notificationRepository.findUnreadByRecipient(recipientId);

      const mappedNotifications = notifications.map((n) => ({
        _id: n._id,
        recipient: n.recipient,
        targetRole: n.targetRole,
        type: n.type,
        content: n.content,
        link:
          n.type === "payment"
            ? `/payments/${n.relatedId}`
            : n.type === "booking"
            ? `/bookings/${n.relatedId}`
            : n.type === "meeting"
            ? `/user/meeting-join/${n.relatedId}`
            : n.type === "booking_reminder"
            ? `/bookings/${n.relatedId}`
            : undefined,
        isRead: n.isRead,
        isSeen: n.isSeen, // ✅ NEW FIELD
        createdAt: new Date(n.createdAt).toISOString(),
        sender: n.sender,
      }));

      console.log(
        `Fetched ${role || "all"} notifications (page ${page}):`,
        mappedNotifications.length
      );
      return mappedNotifications;
    } catch (error: any) {
      console.error("Error fetching unread notifications:", error.message);
      throw new Error("Failed to fetch notifications: " + error.message);
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
        throw new Error("Notification not found");
      }
      if (notification.recipientId !== userId) {
        throw new Error("Unauthorized to mark this notification as read");
      }

      await this.notificationRepository.markAsRead(notificationId);

      // Publish count decrement to Redis
      const { targetRole } = notification;
      if (!pubClient.isOpen) await pubClient.connect();

      if (targetRole === "both") {
        await pubClient.publish(
          "mentor-notification-count",
          JSON.stringify({ recipientId: userId, increment: -1 })
        );
        await pubClient.publish(
          "mentee-notification-count",
          JSON.stringify({ recipientId: userId, increment: -1 })
        );
      } else {
        await pubClient.publish(
          `${targetRole}-notification-count`,
          JSON.stringify({ recipientId: userId, increment: -1 })
        );
      }
    } catch (error: any) {
      console.error("Error marking notification as read:", error.message);
      throw new Error("Failed to mark notification as read: " + error.message);
    }
  }
  async getUnseenNotificationCounts(
    recipientId: string
  ): Promise<{ mentorCount: number; menteeCount: number }> {
    try {
      const [mentorCount, menteeCount] = await Promise.all([
        this.notificationRepository.countUnseenByRecipientAndRole(
          recipientId,
          "mentor"
        ),
        this.notificationRepository.countUnseenByRecipientAndRole(
          recipientId,
          "mentee"
        ),
      ]);

      console.log(`Unseen notification counts for ${recipientId}:`, {
        mentorCount,
        menteeCount,
      });
      return { mentorCount, menteeCount };
    } catch (error: any) {
      console.error(
        "Error fetching unseen notification counts:",
        error.message
      );
      throw new Error(
        "Failed to fetch unseen notification counts: " + error.message
      );
    }
  }

  // ✅ NEW METHOD: Mark all notifications as seen
  async markAllNotificationsAsSeen(
    recipientId: string,
    role: "mentor" | "mentee"
  ): Promise<void> {
    try {
      await this.notificationRepository.markAllAsSeen(recipientId, role);

      // Publish count update to Redis
      if (!pubClient.isOpen) await pubClient.connect();
      await pubClient.publish(
        `${role}-notification-seen`,
        JSON.stringify({ recipientId, action: "markAllSeen" })
      );
    } catch (error: any) {
      console.error("Error marking notifications as seen:", error.message);
      throw new Error("Failed to mark notifications as seen: " + error.message);
    }
  }

  // ✅ NEW METHOD: Mark all notifications as read
  async markAllNotificationsAsRead(
    recipientId: string,
    role: "mentor" | "mentee"
  ): Promise<void> {
    try {
      await this.notificationRepository.markAllAsRead(recipientId, role);

      // Publish count update to Redis
      if (!pubClient.isOpen) await pubClient.connect();
      await pubClient.publish(
        `${role}-notification-read`,
        JSON.stringify({ recipientId, action: "markAllRead" })
      );
    } catch (error: any) {
      console.error("Error marking all notifications as read:", error.message);
      throw new Error(
        "Failed to mark all notifications as read: " + error.message
      );
    }
  }
}
