export interface NotificationSender {
  firstName: string;
  lastName: string;
  id: string;
}

export interface INotificationService {
  createNotification(
    recipientId: string,
    type: "payment" | "booking" | "chat",
    message: string,
    relatedId?: string,
    io?: any,
    sender?: NotificationSender
  ): Promise<void>;

  createPaymentAndBookingNotifications(
    paymentId: string,
    bookingId: string,
    menteeId: string,
    mentorId: string,
    amount: number,
    io?: any
  ): Promise<void>;

  getUnreadNotifications(recipientId: string): Promise<
    {
      _id: string;
      recipient: string;
      type: "payment" | "booking" | "chat";
      content: string;
      link?: string;
      isRead: boolean;
      createdAt: string;
      sender?: {
        firstName: string;
        lastName: string;
        id?: string;
      };
    }[]
  >;

  markNotificationAsRead(notificationId: string, userId: string): Promise<void>;
}
