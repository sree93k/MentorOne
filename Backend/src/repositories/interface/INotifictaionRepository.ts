// // interfaces/repositories/INotificationRepository.ts
// import { ENotification } from "../../entities/notificationEntity";
// // export interface ICreateNotificationDTO {
// //   recipientId: string;
// //   type: string;
// //   message: string;
// //   relatedId?: string;
// //   isRead: boolean;
// //   createdAt: Date;
// //   senderId?: string;
// // }

// export interface ISenderInfo {
//   firstName: string;
//   lastName: string;
// }

// export interface INotificationResponse {
//   _id: string;
//   recipient: string;
//   type: string;
//   content: string;
//   relatedId?: string;
//   isRead: boolean;
//   createdAt: Date;
//   sender?: ISenderInfo;
// }

// export interface INotificationRepository {
//   create(data: ENotification): Promise<ENotification>;

//   findUnreadByRecipient(recipientId: string): Promise<ENotification[]>;

//   findById(notificationId: string): Promise<ENotification>;

//   markAsRead(notificationId: string): Promise<ENotification>;
// }
// interfaces/repositories/INotificationRepository.ts
import { ENotification } from "../../entities/notificationEntity";

export interface ISenderInfo {
  firstName: string;
  lastName: string;
}

export interface INotificationResponse {
  _id: string;
  recipient: string;
  type: "payment" | "booking" | "chat";
  content: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: Date;
  sender?: ISenderInfo;
}

export interface INotificationRepository {
  create(data: ENotification): Promise<ENotification>;

  // Use the correct return type for your transformed data
  findUnreadByRecipient(recipientId: string): Promise<INotificationResponse[]>;

  findById(notificationId: string): Promise<ENotification | null>;

  markAsRead(notificationId: string): Promise<ENotification | null>;
}
