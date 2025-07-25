import Message from "../../models/messageModel";
import BaseRepository from "./BaseRepository";
import { EMessage } from "../../entities/messageEntity";
import { IMessageRepository } from "../interface/IMessageRepository";
import mongoose from "mongoose";

export default class MessageRepository
  extends BaseRepository<EMessage>
  implements IMessageRepository
{
  constructor() {
    super(Message);
  }

  // 🎯 ENHANCED: Create message with proper status and logging
  async create(data: Partial<EMessage>): Promise<EMessage> {
    try {
      // console.log("📤 MessageRepository: create start", {
      //   senderId: data.sender,
      //   chatId: data.chat,
      //   type: data.type,
      //   status: data.status,
      //   timestamp: new Date().toISOString(),
      // });

      // const message = new Message({
      //   ...data,
      //   status: data.status || "sent", // 🎯 INDUSTRY STANDARD: Default to "sent"
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // });

      const savedMessage = await message.save();

      // Populate sender information
      await savedMessage.populate(
        "sender",
        "firstName lastName profilePicture"
      );

      // console.log("📤 MessageRepository: create completed", {
      //   messageId: savedMessage._id,
      //   status: savedMessage.status,
      //   timestamp: new Date().toISOString(),
      // });

      return savedMessage as EMessage;
    } catch (error: any) {
      // console.error("📤 MessageRepository: create error", {
      //   error: error.message,
      //   senderId: data.sender,
      //   chatId: data.chat,
      //   timestamp: new Date().toISOString(),
      // });
      throw new Error("Failed to create message: " + error.message);
    }
  }

  // 🎯 ENHANCED: Find messages with better sorting and population
  // async findByChatId(chatId: string): Promise<EMessage[]> {
  //   try {
  //     console.log("📨 MessageRepository: findByChatId start", {
  //       chatId,
  //       timestamp: new Date().toISOString(),
  //     });

  //     const messages = await Message.find({ chat: chatId })
  //       .populate("sender", "firstName lastName profilePicture")
  //       .sort({ createdAt: 1 }) // Oldest first
  //       .lean(); // 🎯 PERFORMANCE: Use lean() for read-only operations

  //     console.log("📨 MessageRepository: findByChatId completed", {
  //       chatId,
  //       messageCount: messages.length,
  //       timestamp: new Date().toISOString(),
  //     });

  //     return messages as EMessage[];
  //   } catch (error: any) {
  //     console.error("📨 MessageRepository: findByChatId error", {
  //       error: error.message,
  //       chatId,
  //       timestamp: new Date().toISOString(),
  //     });
  //     throw new Error("Failed to find messages: " + error.message);
  //   }
  // }
  // async findByChatId(chatId: string): Promise<EMessage[]> {
  //   try {
  //     console.log("📨 MessageRepository: findByChatId start", {
  //       chatId,
  //       timestamp: new Date().toISOString(),
  //     });

  //     const messages = await Message.find({ chat: chatId })
  //       .populate("sender", "firstName lastName profilePicture")
  //       .sort({ createdAt: 1 }) // Oldest first
  //       .lean(); // Performance optimization

  //     // 🎯 CRITICAL: Ensure all messages have proper status from database
  //     const messagesWithStatus = messages.map((msg: any) => ({
  //       ...msg,
  //       status: msg.status || "sent", // Fallback to "sent" if somehow missing
  //     }));

  //     console.log("📨 MessageRepository: findByChatId completed", {
  //       chatId,
  //       messageCount: messagesWithStatus.length,
  //       statusBreakdown: messagesWithStatus.reduce((acc: any, msg: any) => {
  //         acc[msg.status] = (acc[msg.status] || 0) + 1;
  //         return acc;
  //       }, {}),
  //       timestamp: new Date().toISOString(),
  //     });

  //     return messagesWithStatus as EMessage[];
  //   } catch (error: any) {
  //     console.error("📨 MessageRepository: findByChatId error", {
  //       error: error.message,
  //       chatId,
  //       timestamp: new Date().toISOString(),
  //     });
  //     throw new Error("Failed to find messages: " + error.message);
  //   }
  // }
  async findByChatId(chatId: string): Promise<EMessage[]> {
    try {
      // console.log("📨 MessageRepository: findByChatId start", {
      //   chatId,
      //   timestamp: new Date().toISOString(),
      // });

      const messages = await Message.find({ chat: chatId })
        .populate("sender", "firstName lastName profilePicture")
        .sort({ createdAt: 1 }) // Oldest first
        .lean(); // Performance optimization

      // 🎯 CRITICAL: Ensure all messages have proper status from database
      const messagesWithStatus = messages.map((msg: any) => {
        const dbStatus = msg.status || "sent";

        // 🎯 VALIDATION: Ensure status is valid
        const validStatuses = ["sent", "delivered", "read", "failed"];
        const finalStatus = validStatuses.includes(dbStatus)
          ? dbStatus
          : "sent";

        if (dbStatus !== finalStatus) {
          // console.warn("📨 Invalid message status detected:", {
          //   messageId: msg._id,
          //   invalidStatus: dbStatus,
          //   correctedTo: finalStatus,
          // });
        }

        return {
          ...msg,
          status: finalStatus,
        };
      });

      // console.log("📨 MessageRepository: findByChatId completed", {
      //   chatId,
      //   messageCount: messagesWithStatus.length,
      //   statusBreakdown: messagesWithStatus.reduce((acc: any, msg: any) => {
      //     acc[msg.status] = (acc[msg.status] || 0) + 1;
      //     return acc;
      //   }, {}),
      //   timestamp: new Date().toISOString(),
      // });

      return messagesWithStatus as EMessage[];
    } catch (error: any) {
      console.error("📨 MessageRepository: findByChatId error", {
        error: error.message,
        chatId,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to find messages: " + error.message);
    }
  }

  // 🎯 ENHANCED: Mark messages as read with comprehensive validation and logging
  async markAsReadByUser(chatId: string, userId: string): Promise<number> {
    try {
      console.log("🎯 MessageRepository: markAsReadByUser start", {
        chatId,
        userId,
        timestamp: new Date().toISOString(),
      });

      // 🎯 CRITICAL: Only update messages that:
      // 1. Are in this chat
      // 2. Were NOT sent by this user
      // 3. Don't already have this user in readBy array
      // 4. Update their status to "read"
      const result = await Message.updateMany(
        {
          chat: chatId,
          sender: { $ne: userId }, // Not sent by this user
          readBy: { $ne: userId }, // User hasn't read it yet
        },
        {
          $addToSet: { readBy: userId }, // Add user to readBy array
          $set: {
            status: "read", // 🎯 INDUSTRY STANDARD: Update status to read
            updatedAt: new Date(),
          },
        }
      );

      // console.log("🎯 MessageRepository: markAsReadByUser completed", {
      //   chatId,
      //   userId,
      //   modifiedCount: result.modifiedCount,
      //   matchedCount: result.matchedCount,
      //   timestamp: new Date().toISOString(),
      // });

      return result.modifiedCount;
    } catch (error: any) {
      console.error("🎯 MessageRepository: markAsReadByUser error", {
        error: error.message,
        chatId,
        userId,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to mark messages as read: " + error.message);
    }
  }

  // 🎯 ENHANCED: Get unread count with optimized query
  async getUnreadCount(chatId: string, userId: string): Promise<number> {
    try {
      console.log("📊 MessageRepository: getUnreadCount start", {
        chatId,
        userId,
        timestamp: new Date().toISOString(),
      });

      const count = await Message.countDocuments({
        chat: chatId,
        sender: { $ne: userId }, // Messages not sent by this user
        readBy: { $ne: userId }, // Messages not read by this user
      });

      console.log("📊 MessageRepository: getUnreadCount completed", {
        chatId,
        userId,
        unreadCount: count,
        timestamp: new Date().toISOString(),
      });

      return count;
    } catch (error: any) {
      console.error("📊 MessageRepository: getUnreadCount error", {
        error: error.message,
        chatId,
        userId,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to get unread count: " + error.message);
    }
  }

  // 🎯 ENHANCED: Update message status with validation
  async updateStatus(
    messageId: string,
    status: "sent" | "delivered" | "read" | "failed"
  ): Promise<EMessage | null> {
    try {
      console.log("🔄 MessageRepository: updateStatus start", {
        messageId,
        status,
        timestamp: new Date().toISOString(),
      });

      const message = await Message.findByIdAndUpdate(
        messageId,
        {
          status,
          updatedAt: new Date(),
        },
        {
          new: true,
          runValidators: true, // 🎯 VALIDATION: Ensure schema validation
        }
      ).populate("sender", "firstName lastName profilePicture");

      console.log("🔄 MessageRepository: updateStatus completed", {
        messageId,
        status,
        found: !!message,
        timestamp: new Date().toISOString(),
      });

      return message as EMessage | null;
    } catch (error: any) {
      console.error("🔄 MessageRepository: updateStatus error", {
        error: error.message,
        messageId,
        status,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to update message status: " + error.message);
    }
  }

  // 🎯 ENHANCED: Find message by ID with population
  async findById(messageId: string): Promise<EMessage | null> {
    try {
      console.log("📨 MessageRepository: findById start", {
        messageId,
        timestamp: new Date().toISOString(),
      });

      const message = await Message.findById(messageId)
        .populate("sender", "firstName lastName profilePicture")
        .lean();

      console.log("📨 MessageRepository: findById completed", {
        messageId,
        found: !!message,
        timestamp: new Date().toISOString(),
      });

      return message as EMessage | null;
    } catch (error: any) {
      console.error("📨 MessageRepository: findById error", {
        error: error.message,
        messageId,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to find message: " + error.message);
    }
  }

  // 🎯 NEW: Find messages by status for debugging/analytics
  async findByStatus(
    chatId: string,
    status: "sent" | "delivered" | "read" | "failed"
  ): Promise<EMessage[]> {
    try {
      console.log("📊 MessageRepository: findByStatus start", {
        chatId,
        status,
        timestamp: new Date().toISOString(),
      });

      const messages = await Message.find({
        chat: chatId,
        status: status,
      })
        .populate("sender", "firstName lastName profilePicture")
        .sort({ createdAt: -1 }) // Newest first for status queries
        .lean();

      console.log("📊 MessageRepository: findByStatus completed", {
        chatId,
        status,
        messageCount: messages.length,
        timestamp: new Date().toISOString(),
      });

      return messages as EMessage[];
    } catch (error: any) {
      console.error("📊 MessageRepository: findByStatus error", {
        error: error.message,
        chatId,
        status,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to find messages by status: " + error.message);
    }
  }

  // 🎯 NEW: Bulk update message status for efficiency
  async bulkUpdateStatus(
    chatId: string,
    userId: string,
    status: "sent" | "delivered" | "read" | "failed"
  ): Promise<number> {
    try {
      console.log("🔄 MessageRepository: bulkUpdateStatus start", {
        chatId,
        userId,
        status,
        timestamp: new Date().toISOString(),
      });

      // Only update messages sent TO this user (not sent BY this user)
      const result = await Message.updateMany(
        {
          chat: chatId,
          sender: { $ne: userId }, // Not sent by this user
          status: { $ne: status }, // Not already in this status
        },
        {
          $set: {
            status,
            updatedAt: new Date(),
          },
        }
      );

      console.log("🔄 MessageRepository: bulkUpdateStatus completed", {
        chatId,
        userId,
        status,
        modifiedCount: result.modifiedCount,
        timestamp: new Date().toISOString(),
      });

      return result.modifiedCount;
    } catch (error: any) {
      console.error("🔄 MessageRepository: bulkUpdateStatus error", {
        error: error.message,
        chatId,
        userId,
        status,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to bulk update message status: " + error.message);
    }
  }

  // 🎯 NEW: Get comprehensive chat statistics
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
      console.log("📊 MessageRepository: getChatStatistics start", {
        chatId,
        timestamp: new Date().toISOString(),
      });

      const pipeline = [
        { $match: { chat: new mongoose.Types.ObjectId(chatId) } },
        {
          $group: {
            _id: null,
            totalMessages: { $sum: 1 },
            messagesByType: {
              $push: "$type",
            },
            messagesByStatus: {
              $push: "$status",
            },
            participantCounts: {
              $push: "$sender",
            },
          },
        },
      ];

      const results = await Message.aggregate(pipeline);

      if (results.length === 0) {
        return {
          totalMessages: 0,
          messagesByType: { text: 0, image: 0, audio: 0 },
          messagesByStatus: { sent: 0, delivered: 0, read: 0, failed: 0 },
          participantCounts: {},
        };
      }

      const data = results[0];

      // Process message types
      const messagesByType = data.messagesByType.reduce(
        (acc: any, type: string) => {
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        },
        {}
      );

      // Process message statuses
      const messagesByStatus = data.messagesByStatus.reduce(
        (acc: any, status: string) => {
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        {}
      );

      // Process participant counts
      const participantCounts = data.participantCounts.reduce(
        (acc: any, senderId: string) => {
          acc[senderId.toString()] = (acc[senderId.toString()] || 0) + 1;
          return acc;
        },
        {}
      );

      const stats = {
        totalMessages: data.totalMessages,
        messagesByType: {
          text: messagesByType.text || 0,
          image: messagesByType.image || 0,
          audio: messagesByType.audio || 0,
        },
        messagesByStatus: {
          sent: messagesByStatus.sent || 0,
          delivered: messagesByStatus.delivered || 0,
          read: messagesByStatus.read || 0,
          failed: messagesByStatus.failed || 0,
        },
        participantCounts,
      };

      console.log("📊 MessageRepository: getChatStatistics completed", {
        chatId,
        stats,
        timestamp: new Date().toISOString(),
      });

      return stats;
    } catch (error: any) {
      console.error("📊 MessageRepository: getChatStatistics error", {
        error: error.message,
        chatId,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to get chat statistics: " + error.message);
    }
  }

  // 🎯 NEW: Delete message by ID
  async deleteById(messageId: string): Promise<boolean> {
    try {
      console.log("🗑️ MessageRepository: deleteById start", {
        messageId,
        timestamp: new Date().toISOString(),
      });

      const result = await Message.findByIdAndDelete(messageId);

      console.log("🗑️ MessageRepository: deleteById completed", {
        messageId,
        deleted: !!result,
        timestamp: new Date().toISOString(),
      });

      return !!result;
    } catch (error: any) {
      console.error("🗑️ MessageRepository: deleteById error", {
        error: error.message,
        messageId,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to delete message: " + error.message);
    }
  }

  // 🎯 NEW: Get messages with pagination for large chats
  async findByChatIdPaginated(
    chatId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{
    messages: EMessage[];
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }> {
    try {
      console.log("📨 MessageRepository: findByChatIdPaginated start", {
        chatId,
        page,
        limit,
        timestamp: new Date().toISOString(),
      });

      const skip = (page - 1) * limit;

      const [messages, totalCount] = await Promise.all([
        Message.find({ chat: chatId })
          .populate("sender", "firstName lastName profilePicture")
          .sort({ createdAt: -1 }) // Newest first for pagination
          .skip(skip)
          .limit(limit)
          .lean(),
        Message.countDocuments({ chat: chatId }),
      ]);

      const hasNextPage = skip + messages.length < totalCount;
      const hasPrevPage = page > 1;

      console.log("📨 MessageRepository: findByChatIdPaginated completed", {
        chatId,
        page,
        limit,
        messageCount: messages.length,
        totalCount,
        hasNextPage,
        hasPrevPage,
        timestamp: new Date().toISOString(),
      });

      return {
        messages: messages as EMessage[],
        totalCount,
        hasNextPage,
        hasPrevPage,
      };
    } catch (error: any) {
      console.error("📨 MessageRepository: findByChatIdPaginated error", {
        error: error.message,
        chatId,
        page,
        limit,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to find paginated messages: " + error.message);
    }
  }

  // 🎯 NEW: Get latest messages for each chat (for chat list)
  async getLatestMessagesByChats(
    chatIds: string[]
  ): Promise<{ [chatId: string]: EMessage }> {
    try {
      console.log("📨 MessageRepository: getLatestMessagesByChats start", {
        chatCount: chatIds.length,
        timestamp: new Date().toISOString(),
      });

      const pipeline = [
        {
          $match: {
            chat: { $in: chatIds.map((id) => new mongoose.Types.ObjectId(id)) },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $group: {
            _id: "$chat",
            latestMessage: { $first: "$ROOT" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "latestMessage.sender",
            foreignField: "_id",
            as: "senderInfo",
            pipeline: [
              { $project: { firstName: 1, lastName: 1, profilePicture: 1 } },
            ],
          },
        },
      ];

      const results = await Message.aggregate(pipeline);

      const latestMessages: { [chatId: string]: EMessage } = {};

      results.forEach((result) => {
        const chatId = result._id.toString();
        const message = {
          ...result.latestMessage,
          sender: result.senderInfo[0] || result.latestMessage.sender,
        };
        latestMessages[chatId] = message as EMessage;
      });

      console.log("📨 MessageRepository: getLatestMessagesByChats completed", {
        chatCount: chatIds.length,
        foundCount: Object.keys(latestMessages).length,
        timestamp: new Date().toISOString(),
      });

      return latestMessages;
    } catch (error: any) {
      console.error("📨 MessageRepository: getLatestMessagesByChats error", {
        error: error.message,
        chatCount: chatIds.length,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to get latest messages: " + error.message);
    }
  }

  // 🎯 NEW: Clean up old failed messages (maintenance function)
  async cleanupFailedMessages(olderThanDays: number = 7): Promise<number> {
    try {
      console.log("🧹 MessageRepository: cleanupFailedMessages start", {
        olderThanDays,
        timestamp: new Date().toISOString(),
      });

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      const result = await Message.deleteMany({
        status: "failed",
        createdAt: { $lt: cutoffDate },
      });

      console.log("🧹 MessageRepository: cleanupFailedMessages completed", {
        olderThanDays,
        deletedCount: result.deletedCount,
        timestamp: new Date().toISOString(),
      });

      return result.deletedCount || 0;
    } catch (error: any) {
      console.error("🧹 MessageRepository: cleanupFailedMessages error", {
        error: error.message,
        olderThanDays,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to cleanup failed messages: " + error.message);
    }
  }

  // async markAsReadByUserWithStatus(
  //   chatId: string,
  //   userId: string
  // ): Promise<number> {
  //   try {
  //     console.log("🎯 MessageRepository: markAsReadByUserWithStatus start", {
  //       chatId,
  //       userId,
  //       timestamp: new Date().toISOString(),
  //     });

  //     // 🎯 IMPROVED: Only mark messages that are "delivered" or "sent" as "read"
  //     // This prevents marking already "read" messages and maintains proper state
  //     const result = await Message.updateMany(
  //       {
  //         chat: chatId,
  //         sender: { $ne: userId }, // Not sent by this user
  //         readBy: { $ne: userId }, // User hasn't read it yet
  //         status: { $in: ["sent", "delivered"] }, // 🎯 NEW: Only these statuses can become "read"
  //       },
  //       {
  //         $addToSet: { readBy: userId }, // Add user to readBy array
  //         $set: {
  //           status: "read", // 🎯 CRITICAL: Update status to read
  //           updatedAt: new Date(),
  //         },
  //       }
  //     );

  //     // 🎯 VALIDATION: Log any potential issues
  //     if (result.matchedCount === 0) {
  //       console.log("🎯 MessageRepository: No messages to mark as read", {
  //         chatId,
  //         userId,
  //         reason: "All messages already read or sent by user",
  //       });
  //     }

  //     console.log(
  //       "🎯 MessageRepository: markAsReadByUserWithStatus completed",
  //       {
  //         chatId,
  //         userId,
  //         modifiedCount: result.modifiedCount,
  //         matchedCount: result.matchedCount,
  //         timestamp: new Date().toISOString(),
  //       }
  //     );

  //     return result.modifiedCount;
  //   } catch (error: any) {
  //     console.error("🎯 MessageRepository: markAsReadByUserWithStatus error", {
  //       error: error.message,
  //       chatId,
  //       userId,
  //       timestamp: new Date().toISOString(),
  //     });
  //     throw new Error("Failed to mark messages as read: " + error.message);
  //   }
  // }
  async markAsReadByUserWithStatus(
    chatId: string,
    userId: string
  ): Promise<number> {
    try {
      console.log("🎯 MessageRepository: markAsReadByUserWithStatus start", {
        chatId,
        userId,
        timestamp: new Date().toISOString(),
      });

      // ✅ STEP 1: Find messages that need to be marked as read
      const messagesToRead = await Message.find({
        chat: chatId,
        sender: { $ne: userId }, // Not sent by this user
        readBy: { $ne: userId }, // User hasn't read it yet
        status: { $in: ["sent", "delivered"] }, // Only these statuses can become "read"
      }).select("_id sender status readBy");

      console.log("🎯 MessageRepository: Messages found to mark as read", {
        chatId,
        userId,
        messageCount: messagesToRead.length,
        messageIds: messagesToRead.map((m) => m._id),
        currentStatuses: messagesToRead.reduce((acc: any, msg: any) => {
          acc[msg.status] = (acc[msg.status] || 0) + 1;
          return acc;
        }, {}),
        timestamp: new Date().toISOString(),
      });

      if (messagesToRead.length === 0) {
        console.log("🎯 MessageRepository: No messages to mark as read", {
          chatId,
          userId,
          reason: "All messages already read or sent by user",
          timestamp: new Date().toISOString(),
        });
        return 0;
      }

      // ✅ STEP 2: Update messages with both readBy array AND status field
      const result = await Message.updateMany(
        {
          chat: chatId,
          sender: { $ne: userId }, // Not sent by this user
          readBy: { $ne: userId }, // User hasn't read it yet
          status: { $in: ["sent", "delivered"] }, // Only these statuses can become "read"
        },
        {
          $addToSet: { readBy: userId }, // Add user to readBy array
          $set: {
            status: "read", // 🎯 CRITICAL: Update status to read
            updatedAt: new Date(),
          },
        }
      );

      // ✅ STEP 3: Verify the update worked
      const verificationMessages = await Message.find({
        _id: { $in: messagesToRead.map((m) => m._id) },
      }).select("_id status readBy");

      const successfullyUpdated = verificationMessages.filter(
        (msg) => msg.status === "read" && msg.readBy.includes(userId)
      );

      console.log("🎯 MessageRepository: Update verification", {
        chatId,
        userId,
        expectedUpdates: messagesToRead.length,
        actualUpdates: result.modifiedCount,
        verifiedUpdates: successfullyUpdated.length,
        matchedCount: result.matchedCount,
        timestamp: new Date().toISOString(),
      });

      // ✅ STEP 4: Log any discrepancies
      if (result.modifiedCount !== messagesToRead.length) {
        console.warn("🎯 MessageRepository: Update count mismatch", {
          chatId,
          userId,
          expected: messagesToRead.length,
          actual: result.modifiedCount,
          timestamp: new Date().toISOString(),
        });
      }

      console.log(
        "🎯 MessageRepository: markAsReadByUserWithStatus completed",
        {
          chatId,
          userId,
          modifiedCount: result.modifiedCount,
          matchedCount: result.matchedCount,
          timestamp: new Date().toISOString(),
        }
      );

      return result.modifiedCount;
    } catch (error: any) {
      console.error("🎯 MessageRepository: markAsReadByUserWithStatus error", {
        error: error.message,
        stack: error.stack,
        chatId,
        userId,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to mark messages as read: " + error.message);
    }
  }

  // async bulkUpdateSentToDelivered(
  //   chatId: string,
  //   recipientId: string
  // ): Promise<number> {
  //   try {
  //     console.log("📨 MessageRepository: bulkUpdateSentToDelivered start", {
  //       chatId,
  //       recipientId,
  //       timestamp: new Date().toISOString(),
  //     });

  //     // Only update messages that are currently "sent" and not sent by the recipient
  //     const result = await Message.updateMany(
  //       {
  //         chat: chatId,
  //         sender: { $ne: recipientId }, // Not sent by recipient
  //         status: "sent", // Only update sent messages
  //       },
  //       {
  //         $set: {
  //           status: "delivered", // Update to delivered
  //           updatedAt: new Date(),
  //         },
  //       }
  //     );

  //     console.log("📨 MessageRepository: bulkUpdateSentToDelivered completed", {
  //       chatId,
  //       recipientId,
  //       modifiedCount: result.modifiedCount,
  //       timestamp: new Date().toISOString(),
  //     });

  //     return result.modifiedCount;
  //   } catch (error: any) {
  //     console.error("📨 MessageRepository: bulkUpdateSentToDelivered error", {
  //       error: error.message,
  //       chatId,
  //       recipientId,
  //       timestamp: new Date().toISOString(),
  //     });
  //     throw new Error("Failed to bulk update to delivered: " + error.message);
  //   }
  // }
  async bulkUpdateSentToDelivered(
    chatId: string,
    recipientId: string
  ): Promise<number> {
    try {
      console.log("📨 MessageRepository: bulkUpdateSentToDelivered start", {
        chatId,
        recipientId,
        timestamp: new Date().toISOString(),
      });

      // ✅ STEP 1: Find messages that need to be updated
      const messagesToUpdate = await Message.find({
        chat: chatId,
        sender: { $ne: recipientId }, // Not sent by recipient
        status: "sent", // Only update sent messages
      }).select("_id sender status");

      // console.log(
      //   "📨 MessageRepository: Messages found to update to delivered",
      //   {
      //     chatId,
      //     recipientId,
      //     messageCount: messagesToUpdate.length,
      //     messageIds: messagesToUpdate.map((m) => m._id),
      //     timestamp: new Date().toISOString(),
      //   }
      // );

      if (messagesToUpdate.length === 0) {
        // console.log("📨 MessageRepository: No sent messages to update", {
        //   chatId,
        //   recipientId,
        //   timestamp: new Date().toISOString(),
        // });
        return 0;
      }

      // ✅ STEP 2: Update messages to delivered
      const result = await Message.updateMany(
        {
          chat: chatId,
          sender: { $ne: recipientId }, // Not sent by recipient
          status: "sent", // Only update sent messages
        },
        {
          $set: {
            status: "delivered", // Update to delivered
            updatedAt: new Date(),
          },
        }
      );

      // ✅ STEP 3: Verify the update
      const verificationMessages = await Message.find({
        _id: { $in: messagesToUpdate.map((m) => m._id) },
      }).select("_id status");

      const successfullyUpdated = verificationMessages.filter(
        (msg) => msg.status === "delivered"
      );

      // console.log("📨 MessageRepository: Delivery update verification", {
      //   chatId,
      //   recipientId,
      //   expectedUpdates: messagesToUpdate.length,
      //   actualUpdates: result.modifiedCount,
      //   verifiedUpdates: successfullyUpdated.length,
      //   timestamp: new Date().toISOString(),
      // });

      // console.log("📨 MessageRepository: bulkUpdateSentToDelivered completed", {
      //   chatId,
      //   recipientId,
      //   modifiedCount: result.modifiedCount,
      //   timestamp: new Date().toISOString(),
      // });

      return result.modifiedCount;
    } catch (error: any) {
      // console.error("📨 MessageRepository: bulkUpdateSentToDelivered error", {
      //   error: error.message,
      //   stack: error.stack,
      //   chatId,
      //   recipientId,
      //   timestamp: new Date().toISOString(),
      // });
      throw new Error("Failed to bulk update to delivered: " + error.message);
    }
  }
}
