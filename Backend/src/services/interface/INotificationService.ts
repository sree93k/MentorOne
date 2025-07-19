// export interface NotificationSender {
//   firstName: string;
//   lastName: string;
//   id: string;
// }

// export interface INotificationService {
//   createNotification(
//     recipientId: string,
//     type: "payment" | "booking" | "chat",
//     message: string,
//     relatedId?: string,
//     io?: any,
//     sender?: NotificationSender
//   ): Promise<void>;

//   createPaymentAndBookingNotifications(
//     paymentId: string,
//     bookingId: string,
//     menteeId: string,
//     mentorId: string,
//     amount: number,
//     io?: any
//   ): Promise<void>;

//   getUnreadNotifications(recipientId: string): Promise<
//     {
//       _id: string;
//       recipient: string;
//       type: "payment" | "booking" | "chat";
//       content: string;
//       link?: string;
//       isRead: boolean;
//       createdAt: string;
//       sender?: {
//         firstName: string;
//         lastName: string;
//         id?: string;
//       };
//     }[]
//   >;

//   markNotificationAsRead(notificationId: string, userId: string): Promise<void>;
// }
export interface NotificationSender {
  firstName: string;
  lastName: string;
  id: string;
}

export interface INotificationService {
  createNotification(
    recipientId: string,
    type: "payment" | "booking" | "chat" | "meeting",
    message: string,
    relatedId?: string,
    io?: any,
    sender?: NotificationSender,
    targetRole?: "mentor" | "mentee" | "both" // NEW PARAMETER
  ): Promise<void>;

  createPaymentAndBookingNotifications(
    paymentId: string,
    bookingId: string,
    menteeId: string,
    mentorId: string,
    amount: number,
    io?: any
  ): Promise<void>;

  // UPDATED: Role-aware notification fetching
  getUnreadNotifications(
    recipientId: string,
    role?: "mentor" | "mentee"
  ): Promise<
    {
      _id: string;
      recipient: string;
      targetRole: "mentor" | "mentee" | "both"; // NEW FIELD
      type: "payment" | "booking" | "chat" | "meeting";
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

  // NEW: Get notification counts
  getUnreadNotificationCount(
    recipientId: string,
    role: "mentor" | "mentee"
  ): Promise<number>;

  getUnreadNotificationCounts(
    recipientId: string
  ): Promise<{ mentorCount: number; menteeCount: number }>;

  markNotificationAsRead(notificationId: string, userId: string): Promise<void>;
}
