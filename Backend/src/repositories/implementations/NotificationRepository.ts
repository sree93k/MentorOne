// import { ENotification } from "../../entities/notificationEntity";
// import Notification from "../../models/notificationModel";
// import { INotificationRepository } from "../../repositories/interface/INotifictaionRepository";
// import BaseRepository from "./BaseRepository";

// export default class NotificationRepository
//   extends BaseRepository<ENotification>
//   implements INotificationRepository
// {
//   constructor() {
//     super(Notification);
//   }
//   async create(data: ENotification): Promise<ENotification> {
//     try {
//       const notification = new Notification(data);
//       const savedNotification = await notification.save();
//       console.log("Saved notification:", {
//         _id: savedNotification._id,
//         recipientId: savedNotification.recipientId,
//         type: savedNotification.type,
//       });
//       return savedNotification;
//     } catch (error: any) {
//       throw new Error("Failed to create notification", error.message);
//     }
//   }

//   async findUnreadByRecipient(recipientId: string) {
//     try {
//       return await Notification.find({ recipientId })
//         .populate({
//           path: "senderId",
//           select: "firstName lastName",
//           model: "Users",
//         })
//         .sort({ createdAt: -1 })
//         .lean()
//         .then((notifications) =>
//           notifications.map((n) => ({
//             _id: n._id.toString(),
//             recipient: n.recipientId,
//             type: n.type,
//             content: n.message,
//             relatedId: n.relatedId,
//             isRead: n.isRead,
//             createdAt: n.createdAt,
//             sender:
//               n.senderId &&
//               typeof n.senderId === "object" &&
//               "firstName" in n.senderId
//                 ? {
//                     firstName: (n.senderId as any).firstName,
//                     lastName: (n.senderId as any).lastName,
//                   }
//                 : undefined,
//           }))
//         );
//     } catch (error: any) {
//       throw new Error("Failed to fetch notifications", error.message);
//     }
//   }

//   async findById(notificationId: string) {
//     try {
//       return await Notification.findById(notificationId);
//     } catch (error: any) {
//       throw new Error("Failed to find notification", error.message);
//     }
//   }

//   async markAsRead(notificationId: string) {
//     try {
//       return await Notification.findByIdAndUpdate(
//         notificationId,
//         { isRead: true },
//         { new: true }
//       );
//     } catch (error: any) {
//       throw new Error("Failed to mark notification as read", error.message);
//     }
//   }
// }
import { ENotification } from "../../entities/notificationEntity";
import Notification from "../../models/notificationModel";
import { INotificationRepository } from "../../repositories/interface/INotifictaionRepository";
import BaseRepository from "./BaseRepository";

export default class NotificationRepository
  extends BaseRepository<ENotification>
  implements INotificationRepository
{
  constructor() {
    super(Notification);
  }

  async create(data: ENotification): Promise<ENotification> {
    try {
      const notification = new Notification(data);
      const savedNotification = await notification.save();
      console.log("Saved notification:", {
        _id: savedNotification._id,
        recipientId: savedNotification.recipientId,
        targetRole: savedNotification.targetRole, // NEW LOG
        type: savedNotification.type,
      });
      return savedNotification;
    } catch (error: any) {
      throw new Error("Failed to create notification: " + error.message);
    }
  }

  async findUnreadByRecipient(recipientId: string) {
    try {
      return await Notification.find({
        recipientId,
        isRead: false,
      })
        .populate({
          path: "senderId",
          select: "firstName lastName",
          model: "Users",
        })
        .sort({ createdAt: -1 })
        .lean()
        .then((notifications) =>
          notifications.map((n) => ({
            _id: n._id.toString(),
            recipient: n.recipientId,
            targetRole: n.targetRole, // NEW FIELD
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
          }))
        );
    } catch (error: any) {
      throw new Error("Failed to fetch notifications: " + error.message);
    }
  }

  // NEW METHOD: Find unread notifications by role
  async findUnreadByRecipientAndRole(
    recipientId: string,
    role: "mentor" | "mentee"
  ) {
    try {
      return await Notification.find({
        recipientId,
        isRead: false,
        $or: [{ targetRole: role }, { targetRole: "both" }],
      })
        .populate({
          path: "senderId",
          select: "firstName lastName",
          model: "Users",
        })
        .sort({ createdAt: -1 })
        .lean()
        .then((notifications) =>
          notifications.map((n) => ({
            _id: n._id.toString(),
            recipient: n.recipientId,
            targetRole: n.targetRole,
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
          }))
        );
    } catch (error: any) {
      throw new Error(
        "Failed to fetch role-specific notifications: " + error.message
      );
    }
  }

  // NEW METHOD: Count unread notifications by role
  async countUnreadByRecipientAndRole(
    recipientId: string,
    role: "mentor" | "mentee"
  ): Promise<number> {
    try {
      return await Notification.countDocuments({
        recipientId,
        isRead: false,
        $or: [{ targetRole: role }, { targetRole: "both" }],
      });
    } catch (error: any) {
      throw new Error(
        "Failed to count role-specific notifications: " + error.message
      );
    }
  }

  async findById(notificationId: string) {
    try {
      return await Notification.findById(notificationId);
    } catch (error: any) {
      throw new Error("Failed to find notification: " + error.message);
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
      throw new Error("Failed to mark notification as read: " + error.message);
    }
  }
}
