import MessageRepository from "../../repositories/implementations/MessageRepository";
import ChatRepository from "../../repositories/implementations/ChatRepository";
import { IMessageService } from "../interface/IMessageService";
import { EMessage } from "../../entities/messageEntity";

export default class MessageService implements IMessageService {
  private messageRepository: MessageRepository;
  private chatRepository: ChatRepository;

  constructor() {
    this.messageRepository = new MessageRepository();
    this.chatRepository = new ChatRepository();
  }

  // 🎯 ENHANCED: Send message with proper status management
  // async sendMessage(
  //   chatId: string,
  //   senderId: string,
  //   content: string,
  //   type: "text" | "image" | "audio" = "text"
  // ): Promise<EMessage> {
  //   try {
  //     console.log("📤 MessageService: sendMessage start", {
  //       chatId,
  //       senderId,
  //       type,
  //       timestamp: new Date().toISOString(),
  //     });

  //     // Create the message with proper initial status
  //     const messageData = {
  //       sender: senderId,
  //       content,
  //       type,
  //       chat: chatId,
  //       readBy: [senderId], // 🎯 CRITICAL: Sender automatically reads their own message
  //       status: "sent" as const, // 🎯 INDUSTRY STANDARD: Start with "sent" status
  //     };

  //     const message = await this.messageRepository.create(messageData);
  //     console.log("📤 MessageService: Message created", {
  //       messageId: message._id,
  //       status: message.status,
  //       timestamp: new Date().toISOString(),
  //     });

  //     // Update chat's latest message
  //     await this.chatRepository.findByIdAndUpdate(chatId, {
  //       latestMessage: message._id,
  //       updatedAt: new Date(),
  //     });

  //     console.log("📤 MessageService: sendMessage completed", {
  //       messageId: message._id,
  //       chatId,
  //       timestamp: new Date().toISOString(),
  //     });

  //     return message;
  //   } catch (error: any) {
  //     console.error("📤 MessageService: sendMessage error", {
  //       chatId,
  //       senderId,
  //       error: error.message,
  //       timestamp: new Date().toISOString(),
  //     });
  //     throw new Error("Failed to send message: " + error.message);
  //   }
  // }
  async sendMessage(
    chatId: string,
    senderId: string,
    content: string,
    type: "text" | "image" | "audio" = "text"
  ): Promise<EMessage> {
    try {
      console.log("📤 MessageService: sendMessage start", {
        chatId,
        senderId,
        type,
        timestamp: new Date().toISOString(),
      });

      // 🎯 CRITICAL: Always start with "sent" status (never "delivered")
      const messageData = {
        sender: senderId,
        content,
        type,
        chat: chatId,
        readBy: [senderId], // Sender automatically reads their own message
        status: "sent" as const, // 🎯 INDUSTRY STANDARD: Always start with "sent"
      };

      const message = await this.messageRepository.create(messageData);
      console.log("📤 MessageService: Message created with sent status", {
        messageId: message._id,
        status: message.status,
        timestamp: new Date().toISOString(),
      });

      // Update chat's latest message
      await this.chatRepository.findByIdAndUpdate(chatId, {
        latestMessage: message._id,
        updatedAt: new Date(),
      });

      return message;
    } catch (error: any) {
      console.error("📤 MessageService: sendMessage error", {
        chatId,
        senderId,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to send message: " + error.message);
    }
  }
  async markMessageAsDelivered(
    messageId: string,
    recipientSocketConnected: boolean
  ): Promise<EMessage | null> {
    try {
      console.log("📨 MessageService: markMessageAsDelivered", {
        messageId,
        recipientSocketConnected,
        timestamp: new Date().toISOString(),
      });

      // 🎯 CRITICAL: Only mark as delivered if recipient is actually online
      if (!recipientSocketConnected) {
        console.log(
          "📨 MessageService: Recipient not online, staying as 'sent'"
        );
        return null;
      }

      const message = await this.messageRepository.updateStatus(
        messageId,
        "delivered"
      );

      console.log("📨 MessageService: Message marked as delivered", {
        messageId,
        newStatus: "delivered",
        timestamp: new Date().toISOString(),
      });

      return message;
    } catch (error: any) {
      console.error("📨 MessageService: markMessageAsDelivered error", {
        messageId,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to mark message as delivered: " + error.message);
    }
  }

  // 🎯 ENHANCED: Get messages with proper status information
  // async getMessagesByChatId(chatId: string): Promise<EMessage[]> {
  //   try {
  //     console.log("📨 MessageService: getMessagesByChatId start", {
  //       chatId,
  //       timestamp: new Date().toISOString(),
  //     });

  //     const messages = await this.messageRepository.findByChatId(chatId);
  //     console.log("📨 MessageService: Messages fetched", {
  //       chatId,
  //       messageCount: messages.length,
  //       timestamp: new Date().toISOString(),
  //     });

  //     return messages;
  //   } catch (error: any) {
  //     console.error("📨 MessageService: getMessagesByChatId error", {
  //       chatId,
  //       error: error.message,
  //       timestamp: new Date().toISOString(),
  //     });
  //     throw new Error("Failed to get messages: " + error.message);
  //   }
  // }
  async getMessagesByChatId(chatId: string): Promise<EMessage[]> {
    try {
      console.log("📨 MessageService: getMessagesByChatId start", {
        chatId,
        timestamp: new Date().toISOString(),
      });

      const messages = await this.messageRepository.findByChatId(chatId);

      // 🎯 CRITICAL: Always use database status, never infer from readBy
      console.log("📨 MessageService: Messages fetched with database status", {
        chatId,
        messageCount: messages.length,
        statusBreakdown: messages.reduce((acc: any, msg: any) => {
          acc[msg.status || "unknown"] =
            (acc[msg.status || "unknown"] || 0) + 1;
          return acc;
        }, {}),
        timestamp: new Date().toISOString(),
      });

      return messages;
    } catch (error: any) {
      console.error("📨 MessageService: getMessagesByChatId error", {
        chatId,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to get messages: " + error.message);
    }
  }

  // 🎯 ENHANCED: Mark messages as read with comprehensive logging and status updates
  // async markMessagesAsRead(chatId: string, userId: string): Promise<number> {
  //   try {
  //     console.log("🎯 MessageService: markMessagesAsRead start", {
  //       chatId,
  //       userId,
  //       timestamp: new Date().toISOString(),
  //     });

  //     // 🎯 CRITICAL: Only mark messages as read that:
  //     // 1. Are in this chat
  //     // 2. Were NOT sent by this user
  //     // 3. Are NOT already read by this user
  //     const result = await this.messageRepository.markAsReadByUser(
  //       chatId,
  //       userId
  //     );

  //     console.log("🎯 MessageService: markMessagesAsRead completed", {
  //       chatId,
  //       userId,
  //       markedCount: result,
  //       timestamp: new Date().toISOString(),
  //     });

  //     return result;
  //   } catch (error: any) {
  //     console.error("🎯 MessageService: markMessagesAsRead error", {
  //       chatId,
  //       userId,
  //       error: error.message,
  //       timestamp: new Date().toISOString(),
  //     });
  //     throw new Error("Failed to mark messages as read: " + error.message);
  //   }
  // }
  // async markMessagesAsRead(chatId: string, userId: string): Promise<number> {
  //   try {
  //     console.log("🎯 MessageService: markMessagesAsRead start", {
  //       chatId,
  //       userId,
  //       timestamp: new Date().toISOString(),
  //     });

  //     // 🎯 CRITICAL: Update both readBy array AND status field
  //     const result = await this.messageRepository.markAsReadByUserWithStatus(
  //       chatId,
  //       userId
  //     );

  //     console.log("🎯 MessageService: markMessagesAsRead completed", {
  //       chatId,
  //       userId,
  //       markedCount: result,
  //       timestamp: new Date().toISOString(),
  //     });

  //     return result;
  //   } catch (error: any) {
  //     console.error("🎯 MessageService: markMessagesAsRead error", {
  //       chatId,
  //       userId,
  //       error: error.message,
  //       timestamp: new Date().toISOString(),
  //     });
  //     throw new Error("Failed to mark messages as read: " + error.message);
  //   }
  // }
  async markMessagesAsRead(chatId: string, userId: string): Promise<number> {
    try {
      console.log("🎯 MessageService: markMessagesAsRead start", {
        chatId,
        userId,
        timestamp: new Date().toISOString(),
      });

      // Get current unread messages for this user before marking as read
      const unreadMessages = await this.messageRepository.findByStatus(
        chatId,
        "delivered"
      );
      const userUnreadMessages = unreadMessages.filter(
        (msg: any) => msg.sender.toString() !== userId
      );

      console.log("🎯 MessageService: Found unread messages", {
        chatId,
        userId,
        totalUnreadMessages: userUnreadMessages.length,
        messageIds: userUnreadMessages.map((msg: any) => msg._id),
      });

      // 🎯 CRITICAL: Update both readBy array AND status field to "read"
      const result = await this.messageRepository.markAsReadByUserWithStatus(
        chatId,
        userId
      );

      console.log("🎯 MessageService: markMessagesAsRead completed", {
        chatId,
        userId,
        markedCount: result,
        expectedCount: userUnreadMessages.length,
        timestamp: new Date().toISOString(),
      });

      return result;
    } catch (error: any) {
      console.error("🎯 MessageService: markMessagesAsRead error", {
        chatId,
        userId,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to mark messages as read: " + error.message);
    }
  }
  async markChatMessagesAsDelivered(
    chatId: string,
    recipientId: string,
    isRecipientOnline: boolean
  ): Promise<number> {
    try {
      console.log("📨 MessageService: markChatMessagesAsDelivered", {
        chatId,
        recipientId,
        isRecipientOnline,
        timestamp: new Date().toISOString(),
      });

      if (!isRecipientOnline) {
        console.log("📨 Recipient not online, skipping delivery update");
        return 0;
      }

      // Only mark sent messages as delivered
      const updatedCount =
        await this.messageRepository.bulkUpdateSentToDelivered(
          chatId,
          recipientId
        );

      console.log("📨 MessageService: Bulk updated to delivered", {
        chatId,
        recipientId,
        updatedCount,
        timestamp: new Date().toISOString(),
      });

      return updatedCount;
    } catch (error: any) {
      console.error("📨 MessageService: markChatMessagesAsDelivered error", {
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to mark messages as delivered: " + error.message);
    }
  }
  // 🎯 NEW: Get unread message count for a specific chat and user
  async getUnreadMessageCount(chatId: string, userId: string): Promise<number> {
    try {
      console.log("📊 MessageService: getUnreadMessageCount start", {
        chatId,
        userId,
        timestamp: new Date().toISOString(),
      });

      const count = await this.messageRepository.getUnreadCount(chatId, userId);

      console.log("📊 MessageService: getUnreadMessageCount result", {
        chatId,
        userId,
        unreadCount: count,
        timestamp: new Date().toISOString(),
      });

      return count;
    } catch (error: any) {
      console.error("📊 MessageService: getUnreadMessageCount error", {
        chatId,
        userId,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to get unread count: " + error.message);
    }
  }

  // 🎯 ENHANCED: Update message status with proper validation and logging
  async updateMessageStatus(
    messageId: string,
    status: "sent" | "delivered" | "read" | "failed"
  ): Promise<EMessage | null> {
    try {
      console.log("🔄 MessageService: updateMessageStatus start", {
        messageId,
        status,
        timestamp: new Date().toISOString(),
      });

      // 🎯 VALIDATION: Ensure status progression is logical
      const currentMessage = await this.messageRepository.findById(messageId);
      if (!currentMessage) {
        console.error("🔄 MessageService: Message not found", {
          messageId,
          status,
        });
        return null;
      }

      // 🎯 INDUSTRY STANDARD: Status validation
      const validTransitions = {
        sent: ["delivered", "failed"],
        delivered: ["read", "failed"],
        read: [], // Final state
        failed: ["sent"], // Allow retry
      };

      const currentStatus = currentMessage.status || "sent";
      if (
        status !== currentStatus &&
        !validTransitions[
          currentStatus as keyof typeof validTransitions
        ]?.includes(status)
      ) {
        console.warn("🔄 MessageService: Invalid status transition", {
          messageId,
          currentStatus,
          newStatus: status,
          timestamp: new Date().toISOString(),
        });
        // Allow the transition but log warning for debugging
      }

      const message = await this.messageRepository.updateStatus(
        messageId,
        status
      );

      console.log("🔄 MessageService: updateMessageStatus completed", {
        messageId,
        oldStatus: currentStatus,
        newStatus: status,
        success: !!message,
        timestamp: new Date().toISOString(),
      });

      return message;
    } catch (error: any) {
      console.error("🔄 MessageService: updateMessageStatus error", {
        messageId,
        status,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to update message status: " + error.message);
    }
  }

  // 🎯 NEW: Get message by ID
  async getMessageById(messageId: string): Promise<EMessage | null> {
    try {
      console.log("📨 MessageService: getMessageById start", {
        messageId,
        timestamp: new Date().toISOString(),
      });

      const message = await this.messageRepository.findById(messageId);

      console.log("📨 MessageService: getMessageById result", {
        messageId,
        found: !!message,
        timestamp: new Date().toISOString(),
      });

      return message;
    } catch (error: any) {
      console.error("📨 MessageService: getMessageById error", {
        messageId,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to get message: " + error.message);
    }
  }

  // 🎯 NEW: Batch update message statuses for efficiency
  async batchUpdateMessageStatus(
    messageIds: string[],
    status: "sent" | "delivered" | "read" | "failed"
  ): Promise<number> {
    try {
      console.log("🔄 MessageService: batchUpdateMessageStatus start", {
        messageCount: messageIds.length,
        status,
        timestamp: new Date().toISOString(),
      });

      let updatedCount = 0;
      for (const messageId of messageIds) {
        try {
          const result = await this.updateMessageStatus(messageId, status);
          if (result) updatedCount++;
        } catch (error: any) {
          console.error(
            "🔄 MessageService: Failed to update message in batch",
            {
              messageId,
              error: error.message,
            }
          );
        }
      }

      console.log("🔄 MessageService: batchUpdateMessageStatus completed", {
        totalMessages: messageIds.length,
        updatedCount,
        status,
        timestamp: new Date().toISOString(),
      });

      return updatedCount;
    } catch (error: any) {
      console.error("🔄 MessageService: batchUpdateMessageStatus error", {
        messageCount: messageIds.length,
        status,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      throw new Error(
        "Failed to batch update message statuses: " + error.message
      );
    }
  }

  // 🎯 NEW: Get messages by status for maintenance/debugging
  async getMessagesByStatus(
    chatId: string,
    status: "sent" | "delivered" | "read" | "failed"
  ): Promise<EMessage[]> {
    try {
      console.log("📊 MessageService: getMessagesByStatus start", {
        chatId,
        status,
        timestamp: new Date().toISOString(),
      });

      const messages = await this.messageRepository.findByStatus(
        chatId,
        status
      );

      console.log("📊 MessageService: getMessagesByStatus result", {
        chatId,
        status,
        messageCount: messages.length,
        timestamp: new Date().toISOString(),
      });

      return messages;
    } catch (error: any) {
      console.error("📊 MessageService: getMessagesByStatus error", {
        chatId,
        status,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to get messages by status: " + error.message);
    }
  }

  // 🎯 NEW: Mark all messages in chat as delivered for a user (bulk operation)
  async markAllMessagesAsDelivered(
    chatId: string,
    userId: string
  ): Promise<number> {
    try {
      console.log("📨 MessageService: markAllMessagesAsDelivered start", {
        chatId,
        userId,
        timestamp: new Date().toISOString(),
      });

      const updatedCount = await this.messageRepository.bulkUpdateStatus(
        chatId,
        userId,
        "delivered"
      );

      console.log("📨 MessageService: markAllMessagesAsDelivered completed", {
        chatId,
        userId,
        updatedCount,
        timestamp: new Date().toISOString(),
      });

      return updatedCount;
    } catch (error: any) {
      console.error("📨 MessageService: markAllMessagesAsDelivered error", {
        chatId,
        userId,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to mark messages as delivered: " + error.message);
    }
  }

  // 🎯 NEW: Get chat statistics for analytics
  async getChatStatistics(chatId: string): Promise<{
    totalMessages: number;
    messagesByType: { text: number; image: number; audio: number };
    messagesByStatus: {
      sent: number;
      delivered: number;
      read: number;
      failed: number;
    };
    participantCounts: { [userId: string]: number };
  }> {
    try {
      console.log("📊 MessageService: getChatStatistics start", {
        chatId,
        timestamp: new Date().toISOString(),
      });

      const stats = await this.messageRepository.getChatStatistics(chatId);

      console.log("📊 MessageService: getChatStatistics completed", {
        chatId,
        stats,
        timestamp: new Date().toISOString(),
      });

      return stats;
    } catch (error: any) {
      console.error("📊 MessageService: getChatStatistics error", {
        chatId,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to get chat statistics: " + error.message);
    }
  }

  // 🎯 NEW: Delete message (for future admin functionality)
  async deleteMessage(messageId: string, userId: string): Promise<boolean> {
    try {
      console.log("🗑️ MessageService: deleteMessage start", {
        messageId,
        userId,
        timestamp: new Date().toISOString(),
      });

      // Check if user owns the message
      const message = await this.messageRepository.findById(messageId);
      if (!message) {
        throw new Error("Message not found");
      }

      if (message.sender.toString() !== userId) {
        throw new Error(
          "Unauthorized: Cannot delete message sent by another user"
        );
      }

      const deleted = await this.messageRepository.deleteById(messageId);

      console.log("🗑️ MessageService: deleteMessage completed", {
        messageId,
        userId,
        deleted,
        timestamp: new Date().toISOString(),
      });

      return deleted;
    } catch (error: any) {
      console.error("🗑️ MessageService: deleteMessage error", {
        messageId,
        userId,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to delete message: " + error.message);
    }
  }

  async bulkUpdateMessageStatusesOnUserOnline(
    userId: string,
    role: "mentor" | "mentee"
  ): Promise<{ chatId: string; updatedCount: number }[]> {
    try {
      console.log("📈 MessageService: bulkUpdateMessageStatusesOnUserOnline", {
        userId,
        role,
        timestamp: new Date().toISOString(),
      });

      const results: { chatId: string; updatedCount: number }[] = [];

      // Get user's chats for this role
      const chatService = new (await import("./ChatService")).default();
      const chats = await chatService.getChatsByUserAndRole(userId, role);

      for (const chat of chats) {
        const updatedCount =
          await this.messageRepository.bulkUpdateSentToDelivered(
            chat._id.toString(),
            userId
          );

        if (updatedCount > 0) {
          results.push({
            chatId: chat._id.toString(),
            updatedCount,
          });

          console.log("📈 MessageService: Updated messages to delivered", {
            chatId: chat._id,
            userId,
            updatedCount,
          });
        }
      }

      console.log("📈 MessageService: Bulk update completed", {
        userId,
        role,
        totalChatsUpdated: results.length,
        timestamp: new Date().toISOString(),
      });

      return results;
    } catch (error: any) {
      console.error(
        "📈 MessageService: bulkUpdateMessageStatusesOnUserOnline error",
        {
          userId,
          role,
          error: error.message,
          timestamp: new Date().toISOString(),
        }
      );
      throw new Error(
        "Failed to bulk update message statuses: " + error.message
      );
    }
  }
  async debugMessageStatuses(chatId: string, userId: string): Promise<void> {
    try {
      console.log("🔍 MessageService: debugMessageStatuses start", {
        chatId,
        userId,
        timestamp: new Date().toISOString(),
      });

      const messages = await this.messageRepository.findByChatId(chatId);

      const analysis = {
        total: messages.length,
        byStatus: {} as any,
        byReadStatus: {} as any,
        unreadForUser: 0,
        messagesDetail: [] as any[],
      };

      messages.forEach((msg: any) => {
        // Count by status
        analysis.byStatus[msg.status] =
          (analysis.byStatus[msg.status] || 0) + 1;

        // Count by read status for this user
        const isReadByUser = msg.readBy.includes(userId);
        const isSentByUser = msg.sender.toString() === userId;

        if (!isSentByUser) {
          const readKey = isReadByUser ? "read" : "unread";
          analysis.byReadStatus[readKey] =
            (analysis.byReadStatus[readKey] || 0) + 1;

          if (!isReadByUser && ["sent", "delivered"].includes(msg.status)) {
            analysis.unreadForUser++;
          }
        }

        analysis.messagesDetail.push({
          id: msg._id,
          status: msg.status,
          readBy: msg.readBy,
          sender: msg.sender,
          isSentByUser,
          isReadByUser,
          shouldCountAsUnread:
            !isSentByUser &&
            !isReadByUser &&
            ["sent", "delivered"].includes(msg.status),
        });
      });

      console.log("🔍 MessageService: debugMessageStatuses analysis", {
        chatId,
        userId,
        analysis,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("🔍 MessageService: debugMessageStatuses error", {
        error: error.message,
        chatId,
        userId,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
