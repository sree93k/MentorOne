import { ENotification } from "../../entities/notificationEntity";

export interface ICreateNotification {
  recipientId: string;
  senderId: string;
  type: "payment" | "booking" | "chat" | "meeting";
  message: string;
  relatedId?: string;
}
export interface INotificationRepository {
  createNotification(data: ICreateNotification): Promise<ENotification>;
  findUnreadByRecipient(recipientId: string): Promise<any[]>;
  findById(notificationId: string): Promise<ENotification | null>;
  markAsRead(notificationId: string): Promise<ENotification | null>;
}
