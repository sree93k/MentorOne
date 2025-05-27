// import Notification from "../../models/notificationModel";
// import { ApiError } from "../../middlewares/errorHandler";

// export default class NotificationRepository {
//   async create(data: {
//     recipientId: string;
//     type: string;
//     message: string;
//     relatedId?: string;
//     isRead: boolean;
//     createdAt: Date;
//     senderId?: string; // Added for sender reference
//   }) {
//     try {
//       const notification = new Notification(data);
//       return await notification.save();
//     } catch (error: any) {
//       throw new ApiError(500, "Failed to create notification", error.message);
//     }
//   }

//   async findUnreadByRecipient(recipientId: string) {
//     try {
//       return await Notification.find({ recipientId, isRead: false })
//         .populate("senderId", "firstName lastName") // Populate sender details
//         .sort({ createdAt: -1 })
//         .lean()
//         .then((notifications) =>
//           notifications.map((n) => ({
//             _id: n._id,
//             recipient: n.recipientId, // Align with frontend
//             type: n.type,
//             content: n.message, // Align with frontend
//             relatedId: n.relatedId,
//             isRead: n.isRead,
//             createdAt: n.createdAt,
//             sender: n.senderId
//               ? {
//                   firstName: n.senderId.firstName,
//                   lastName: n.senderId.lastName,
//                 }
//               : undefined,
//           }))
//         );
//     } catch (error: any) {
//       throw new ApiError(500, "Failed to fetch notifications", error.message);
//     }
//   }

//   async findById(notificationId: string) {
//     try {
//       return await Notification.findById(notificationId);
//     } catch (error: any) {
//       throw new ApiError(500, "Failed to find notification", error.message);
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
//       throw new ApiError(
//         500,
//         "Failed to mark notification as read",
//         error.message
//       );
//     }
//   }
// }
// src/repositories/implementations/notificationRepository.ts
import Notification from "../../models/notificationModel";
import { ApiError } from "../../middlewares/errorHandler";

export default class NotificationRepository {
  async create(data: {
    recipientId: string;
    type: string;
    message: string;
    relatedId?: string;
    isRead: boolean;
    createdAt: Date;
    senderId?: string;
  }) {
    try {
      const notification = new Notification(data);
      return await notification.save();
    } catch (error: any) {
      throw new ApiError(500, "Failed to create notification", error.message);
    }
  }

  async findUnreadByRecipient(recipientId: string) {
    try {
      return await Notification.find({ recipientId }) // Remove isRead filter
        .populate("senderId", "firstName lastName")
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
            sender: n.senderId
              ? {
                  firstName: n.senderId.firstName,
                  lastName: n.senderId.lastName,
                }
              : undefined,
          }))
        );
    } catch (error: any) {
      throw new ApiError(500, "Failed to fetch notifications", error.message);
    }
  }

  async findById(notificationId: string) {
    try {
      return await Notification.findById(notificationId);
    } catch (error: any) {
      throw new ApiError(500, "Failed to find notification", error.message);
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
        500,
        "Failed to mark notification as read",
        error.message
      );
    }
  }
}
