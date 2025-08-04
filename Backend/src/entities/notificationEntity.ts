// export interface ENotification {
//   _id?: string;
//   recipientId: string;
//   targetRole: "mentor" | "mentee" | "both";
//   type: "payment" | "booking" | "chat" | "meeting";
//   message: string;
//   relatedId?: string;
//   isRead: boolean;
//   isSeen: boolean; // ✅ NEW FIELD
//   createdAt: Date;
//   senderId?: string;
// }
export interface ENotification {
  _id?: string;
  recipientId: string;
  targetRole: "mentor" | "mentee" | "both";
  // 📍 FIXED: Add booking_reminder to type union
  type:
    | "payment"
    | "booking"
    | "chat"
    | "meeting"
    | "booking_reminder"
    | "contact_response";
  message: string;
  relatedId?: string;
  isRead: boolean;
  isSeen: boolean;
  createdAt: Date;
  senderId?: string;
}
