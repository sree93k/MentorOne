// // import { EMessage } from "../../entities/messageEntity";

// // export interface IMessageRepository {
// //   create(data: any): Promise<EMessage>;
// //   findByChatId(chatId: string): Promise<EMessage[]>;
// //   markAsRead(chatId: string, userId: string): Promise<any>;
// // }
// import { EMessage } from "../../entities/messageEntity";

// export interface IMessageRepository {
//   create(data: Partial<EMessage>): Promise<EMessage>;

//   findByChatId(chatId: string): Promise<EMessage[]>;

//   markAsReadByUser(chatId: string, userId: string): Promise<number>;

//   getUnreadCount(chatId: string, userId: string): Promise<number>;

//   updateStatus(
//     messageId: string,
//     status: "sent" | "delivered" | "read"
//   ): Promise<EMessage | null>;

//   findById(messageId: string): Promise<EMessage | null>;
//   cleanupFailedMessages(olderThanDays: number): Promise<number>;
//   deleteById(messageId: string): Promise<boolean>;
// }
import { EMessage } from "../../entities/messageEntity";

export interface IMessageRepository {
  // ✅ EXISTING - Basic CRUD operations
  create(data: Partial<EMessage>): Promise<EMessage>;
  findById(messageId: string): Promise<EMessage | null>;
  findByChatId(chatId: string): Promise<EMessage[]>;

  // ✅ EXISTING - Read status management
  markAsReadByUser(chatId: string, userId: string): Promise<number>;
  getUnreadCount(chatId: string, userId: string): Promise<number>;

  // ✅ EXISTING - Status updates
  updateStatus(
    messageId: string,
    status: "sent" | "delivered" | "read" | "failed"
  ): Promise<EMessage | null>;

  // ✅ EXISTING - Maintenance operations
  cleanupFailedMessages(olderThanDays: number): Promise<number>;
  deleteById(messageId: string): Promise<boolean>;

  // 🎯 NEW - Enhanced methods for proper status handling
  markAsReadByUserWithStatus(chatId: string, userId: string): Promise<number>;
  bulkUpdateSentToDelivered(
    chatId: string,
    recipientId: string
  ): Promise<number>;
  findByStatus(
    chatId: string,
    status: "sent" | "delivered" | "read" | "failed"
  ): Promise<EMessage[]>;
  bulkUpdateStatus(
    chatId: string,
    userId: string,
    status: "sent" | "delivered" | "read" | "failed"
  ): Promise<number>;

  // 🎯 NEW - Analytics and pagination
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
  findByChatIdPaginated(
    chatId: string,
    page?: number,
    limit?: number
  ): Promise<{
    messages: EMessage[];
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }>;
  getLatestMessagesByChats(
    chatIds: string[]
  ): Promise<{ [chatId: string]: EMessage }>;
}
