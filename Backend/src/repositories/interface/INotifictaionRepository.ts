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
  countUnseenByRecipientAndRole(
    recipientId: string,
    role: "mentor" | "mentee"
  ): Promise<number>;
  markAllAsSeen(recipientId: string, role: "mentor" | "mentee"): Promise<void>;
  markAllAsRead(recipientId: string, role: "mentor" | "mentee"): Promise<void>;
}
