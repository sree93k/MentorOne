// interfaces/repositories/INotificationRepository.ts

export interface ICreateNotificationDTO {
  recipientId: string;
  type: string;
  message: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: Date;
  senderId?: string;
}

export interface ISenderInfo {
  firstName: string;
  lastName: string;
}

export interface INotificationResponse {
  _id: string;
  recipient: string;
  type: string;
  content: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: Date;
  sender?: ISenderInfo;
}

export interface INotificationRepository {
  create(data: ICreateNotificationDTO): Promise<any>;

  findUnreadByRecipient(recipientId: string): Promise<INotificationResponse[]>;

  findById(notificationId: string): Promise<any>;

  markAsRead(notificationId: string): Promise<any>;
}
