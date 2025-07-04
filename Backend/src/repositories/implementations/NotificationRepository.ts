import {
  INotificationRepository,
  ICreateNotification,
} from "../interface/INotifictaionRepository";
import { ENotification } from "../../entities/notificationEntity";
import Notification from "../../models/notificationModel";
import BaseRepository from "./BaseRepository";
import { injectable } from "inversify";

@injectable()
export default class NotificationRepository
  extends BaseRepository<ENotification>
  implements INotificationRepository
{
  constructor() {
    super(Notification);
  }

  async createNotification(data: ICreateNotification): Promise<ENotification> {
    try {
      // Convert senderId from string to ObjectId if present
      const { senderId, ...rest } = data;
      const mongoose = require("mongoose");
      const objectData = {
        ...rest,
        ...(senderId && { senderId: new mongoose.Types.ObjectId(senderId) }),
      };
      return await super.create(objectData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to create notification: ${error.message}`);
      }
      throw new Error("Unknown error while creating notification");
    }
  }

  async findUnreadByRecipient(recipientId: string): Promise<
    {
      _id: string;
      recipient: string;
      type: string;
      content: string;
      relatedId?: string;
      isRead: boolean;
      createdAt: Date;
      sender?: {
        firstName: string;
        lastName: string;
      };
    }[]
  > {
    try {
      const notifications = await this.model
        .find({ recipientId, isRead: false })
        .populate({
          path: "senderId",
          select: "firstName lastName",
          model: "Users",
        })
        .sort({ createdAt: -1 })
        .lean();

      return notifications.map((n) => ({
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
          "firstName" in n.senderId
            ? {
                firstName: (n.senderId as any).firstName,
                lastName: (n.senderId as any).lastName,
              }
            : undefined,
      }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch notifications: ${error.message}`);
      }
      throw new Error("Unknown error while fetching notifications");
    }
  }

  async findById(notificationId: string): Promise<ENotification | null> {
    try {
      return await super.findById(notificationId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to find notification: ${error.message}`);
      }
      throw new Error("Unknown error while finding notification");
    }
  }

  async markAsRead(notificationId: string): Promise<ENotification | null> {
    try {
      return await this.model.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true }
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to mark notification as read: ${error.message}`
        );
      }
      throw new Error("Unknown error while marking notification as read");
    }
  }
}
