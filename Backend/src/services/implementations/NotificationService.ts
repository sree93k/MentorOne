import NotificationRepository from "../../repositories/implementations/NotificationRepository";
import { ApiError } from "../../middlewares/errorHandler";
import { pubClient } from "../../server";
import BookingRepository from "../../repositories/implementations/BookingRepository";
import { IBookingRepository } from "../../repositories/interface/IBookingRepository";
import mongoose from "mongoose";
import { INotificationService } from "../../services/interface/INotificationService";
interface NotificationData {
  recipientId: string;
  type: "payment" | "booking" | "chat";
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
    type: "payment" | "booking" | "chat",
    message: string,
    relatedId?: string,
    io?: any,
    sender?: { firstName: string; lastName: string; id: string }
  ): Promise<void> {
    try {
      console.log("Notification service...>>>>>>>>>>>>>>createing");
      console.log("receipentId", recipientId);
      console.log("type", type);
      console.log("message ", message);
      console.log("relatedId", relatedId);
      console.log("sender", sender);

      const notification = await this.notificationRepository.create({
        recipientId,
        type,
        message,
        relatedId,
        isRead: false,
        createdAt: new Date(),
        senderId: sender?.id,
      });

      const payload = {
        _id: notification._id.toString(),
        recipient: recipientId,
        type,
        content: message,
        link:
          type === "payment"
            ? `/payments/${relatedId}`
            : type === "booking"
            ? `/bookings/${relatedId}`
            : undefined,
        isRead: false,
        createdAt: notification.createdAt.toISOString(),
        sender: sender
          ? { firstName: sender.firstName, lastName: sender.lastName }
          : undefined,
      };

      console.log("Created notification payload:", payload);

      if (!pubClient.isOpen) await pubClient.connect();
      await pubClient.publish(`${type}-notifications`, JSON.stringify(payload));
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
      console.log("Admin fetch result:", admin);

      // Correct fallback admin ID
      const fallbackAdminId = "67db051192a2210b560467d4";
      if (!admin) {
        console.warn(
          "Admin not found. Using fallback admin ID:",
          fallbackAdminId
        );
      }

      console.log("Fetched users for notifications:", {
        mentee,
        mentor,
        admin,
      });
      const booking = await this.bookingRepository.findById(bookingId);
      console.log("Booking response:", booking);

      // Mentee notifications
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
          : undefined
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
          : undefined
      );

      // Mentor notifications
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
          : undefined
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
          : undefined
      );

      // Admin notifications
      const adminId = admin?._id.toString() || fallbackAdminId;
      const adminSenderName = admin?.firstName || admin?.adminName || "System";
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
          : undefined
      );
      await this.createNotification(
        adminId,
        "booking",
        `New booking ${
          booking?.serviceId?.title || "Unknown Service"
        } confirmed by ${mentee?.firstName || "Unknown"} ${
          mentee?.lastName || ""
        }`,
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
      const mappedNotifications = notifications.map((n) => ({
        _id: n._id,
        recipient: n.recipient,
        type: n.type,
        content: n.content,
        link:
          n.type === "payment"
            ? `/payments/${n.relatedId}`
            : n.type === "booking"
            ? `/bookings/${n.relatedId}`
            : undefined,
        isRead: n.isRead,
        createdAt: new Date(n.createdAt).toISOString(),
        sender: n.sender,
      }));
      console.log("Fetched notifications:", mappedNotifications);
      return mappedNotifications;
    } catch (error: any) {
      console.error("Error fetching unread notifications:", error.message);
      throw new ApiError(500, "Failed to fetch notifications", error.message);
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
      console.error("Error marking notification as read:", error.message);
      throw new ApiError(
        500,
        "Failed to mark notification as read",
        error.message
      );
    }
  }
}
