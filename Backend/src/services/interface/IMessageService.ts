// // export interface IMessageService {
// //   sendMessage(
// //     chatId: string,
// //     senderId: string,
// //     content: string,
// //     type: "text" | "image" | "audio",
// //     file?: Buffer
// //   ): Promise<any>; // Replace `any` with a `Message` entity type if available

// //   getMessagesByChatId(chatId: string): Promise<any[]>; // Replace `any` with `Message` type if available

// //   markMessagesAsRead(chatId: string, userId: string): Promise<any>; // Adjust return type if markAsRead has a specific result
// // }
// import { EMessage } from "../../entities/messageEntity";

// export interface IMessageService {
//   sendMessage(
//     chatId: string,
//     senderId: string,
//     content: string,
//     type?: "text" | "image" | "audio"
//   ): Promise<EMessage>;
//   markMessageAsDelivered(
//     messageId: string,
//     recipientSocketConnected: boolean
//   ): Promise<EMessage | null>;
//   getMessagesByChatId(chatId: string): Promise<EMessage[]>;
//   markChatMessagesAsDelivered(
//     chatId: string,
//     recipientId: string,
//     isRecipientOnline: boolean
//   ): Promise<number>;
//   markMessagesAsRead(chatId: string, userId: string): Promise<number>;

//   getUnreadMessageCount(chatId: string, userId: string): Promise<number>;

//   updateMessageStatus(
//     messageId: string,
//     status: "sent" | "delivered" | "read"
//   ): Promise<EMessage | null>;
// }
import { EMessage } from "../../entities/messageEntity";

export interface IMessageService {
  // ✅ EXISTING - Core messaging operations
  sendMessage(
    chatId: string,
    senderId: string,
    content: string,
    type?: "text" | "image" | "audio"
  ): Promise<EMessage>;

  getMessagesByChatId(chatId: string): Promise<EMessage[]>;

  // ✅ EXISTING - Status management
  markMessageAsDelivered(
    messageId: string,
    recipientSocketConnected: boolean
  ): Promise<EMessage | null>;

  markChatMessagesAsDelivered(
    chatId: string,
    recipientId: string,
    isRecipientOnline: boolean
  ): Promise<number>;

  markMessagesAsRead(chatId: string, userId: string): Promise<number>;

  updateMessageStatus(
    messageId: string,
    status: "sent" | "delivered" | "read" | "failed"
  ): Promise<EMessage | null>;

  // ✅ EXISTING - Analytics
  getUnreadMessageCount(chatId: string, userId: string): Promise<number>;

  // 🎯 NEW - Enhanced methods for better functionality
  getMessageById(messageId: string): Promise<EMessage | null>;

  batchUpdateMessageStatus(
    messageIds: string[],
    status: "sent" | "delivered" | "read" | "failed"
  ): Promise<number>;

  getMessagesByStatus(
    chatId: string,
    status: "sent" | "delivered" | "read" | "failed"
  ): Promise<EMessage[]>;

  markAllMessagesAsDelivered(chatId: string, userId: string): Promise<number>;

  getChatStatistics(chatId: string): Promise<{
    totalMessages: number;
    messagesByType: { text: number; image: number; audio: number };
    messagesByStatus: {
      sent: number;
      delivered: number;
      read: number;
      failed: number;
    };
    participantCounts: { [userId: string]: number };
  }>;

  deleteMessage(messageId: string, userId: string): Promise<boolean>;
  bulkUpdateMessageStatusesOnUserOnline(
    userId: string,
    role: "mentor" | "mentee"
  ): Promise<{ chatId: string; updatedCount: number }[]>;
  debugMessageStatuses(chatId: string, userId: string): Promise<void>;
}
