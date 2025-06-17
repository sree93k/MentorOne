import Notification from "../../models/notificationModel";
import { ApiError } from "../../middlewares/errorHandler";
import {
  INotificationRepository,
  ICreateNotificationDTO,
} from "../../repositories/interface/INotifictaionRepository";
import { HttpStatus } from "../../constants/HttpStatus";

export default class NotificationRepository implements INotificationRepository {
  async create(data: ICreateNotificationDTO) {
    try {
      const notification = new Notification(data);
      const savedNotification = await notification.save();
      console.log("Saved notification:", {
        _id: savedNotification._id,
        recipientId: savedNotification.recipientId,
        type: savedNotification.type,
      });
      return savedNotification;
    } catch (error: any) {
      throw new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create notification",
        error.message
      );
    }
  }

  async findUnreadByRecipient(recipientId: string) {
    try {
      return await Notification.find({ recipientId })
        .populate({
          path: "senderId",
          select: "firstName lastName",
          model: "User",
        })
        .sort({ createdAt: -1 })
        .lean()
        .then((notifications) =>
          notifications.map((n) => ({
            _id: n._id.toString(),
            recipient: n.recipientId,
            type: n.type,
            content: n.message,
            relatedId: n.relatedId,
            isRead: n.isRead,
            createdAt: n.createdAt,
            sender:
              n.senderId &&
              typeof n.senderId === "object" &&
              "firstName" in n.senderId &&
              "lastName" in n.senderId
                ? {
                    firstName: (n.senderId as any).firstName,
                    lastName: (n.senderId as any).lastName,
                  }
                : undefined,
          }))
        );
    } catch (error: any) {
      throw new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to fetch notifications",
        error.message
      );
    }
  }

  async findById(notificationId: string) {
    try {
      return await Notification.findById(notificationId);
    } catch (error: any) {
      throw new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to find notification",
        error.message
      );
    }
  }

  async markAsRead(notificationId: string) {
    try {
      return await Notification.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true }
      );
    } catch (error: any) {
      throw new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to mark notification as read",
        error.message
      );
    }
  }
}
