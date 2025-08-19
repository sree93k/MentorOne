/**
 * 🔹 PHASE 1 MIGRATION: Modern Message Repository
 * Type-safe, real-time messaging repository with enhanced status tracking
 */

import { injectable } from "inversify";
import { Types, FilterQuery } from "mongoose";
import { EMessage } from "../../entities/messageEntity";
import { IMessageRepository } from "../interface/IMessageRepository";
import { EnhancedBaseRepository } from "./EnhancedBaseRepository";
import { 
  RepositoryErrorFactory, 
  RepositoryLogger,
  RepositoryErrorCode 
} from "../errors/RepositoryError";
import {
  CreateResult,
  UpdateResult,
  PaginationParams,
  PaginatedResponse,
  FindOptions,
  RepositoryContext,
  DeepPartial
} from "../types/RepositoryTypes";

// Import models
import Message from "../../models/messageModel";

/**
 * 🔹 MESSAGE-SPECIFIC TYPES
 */
type MessageStatus = "sent" | "delivered" | "read" | "failed";
type MessageType = "text" | "image" | "audio" | "video" | "file" | "system";

interface MessageCreateData {
  sender: string;
  chat: string;
  type: MessageType;
  content: string;
  status?: MessageStatus;
  replyTo?: string;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    duration?: number; // for audio/video
    dimensions?: { width: number; height: number }; // for images
  };
}

interface MessageUpdateData {
  content?: string;
  status?: MessageStatus;
  readBy?: string[];
  deliveredAt?: Date;
  readAt?: Date;
  editedAt?: Date;
}

interface MessageFilters {
  chatId?: string;
  senderId?: string;
  type?: MessageType;
  status?: MessageStatus;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchQuery?: string;
  hasReply?: boolean;
}

interface MessageStatistics {
  totalMessages: number;
  messagesByType: Record<MessageType, number>;
  messagesByStatus: Record<MessageStatus, number>;
  participantCounts: Record<string, number>;
  averageResponseTime: number;
  activeChatsToday: number;
}

interface ReadReceiptData {
  chatId: string;
  userId: string;
  messageIds?: string[];
  readAt?: Date;
}

/**
 * 🔹 MODERN MESSAGE REPOSITORY
 * Industry-standard real-time messaging with comprehensive status tracking
 */
@injectable()
export default class ModernMessageRepository 
  extends EnhancedBaseRepository<EMessage>
  implements IMessageRepository {

  constructor() {
    super(Message);
  }

  /**
   * 🔹 ENHANCED MESSAGE CREATION
   */

  /**
   * ✅ NEW: Type-safe message creation with validation
   */
  async createMessageSecure(
    messageData: MessageCreateData,
    context?: RepositoryContext
  ): Promise<CreateResult<EMessage>> {
    const operation = 'createMessageSecure';

    try {
      // ✅ VALIDATE MESSAGE DATA
      this.validateMessageCreateData(messageData, operation);

      RepositoryLogger.logStart(operation, this.entityName, undefined, {
        senderId: messageData.sender,
        chatId: messageData.chat,
        type: messageData.type,
        hasReply: !!messageData.replyTo,
        ...context?.metadata
      });

      // ✅ PREPARE MESSAGE WITH DEFAULTS
      const messageWithDefaults = {
        ...messageData,
        status: messageData.status || 'sent' as MessageStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
        readBy: [], // Initialize empty readBy array
        deliveredAt: messageData.status === 'delivered' ? new Date() : undefined,
        readAt: messageData.status === 'read' ? new Date() : undefined
      };

      // ✅ CREATE MESSAGE
      const result = await this.create(messageWithDefaults, context);

      if (result.success && result.data) {
        // ✅ POPULATE SENDER INFORMATION
        const populatedMessage = await this.findById(
          result.data._id.toString(),
          {
            populate: [
              {
                path: 'sender',
                select: 'firstName lastName profilePicture'
              },
              {
                path: 'replyTo',
                select: 'content sender type createdAt',
                populate: {
                  path: 'sender',
                  select: 'firstName lastName'
                }
              }
            ]
          },
          context
        );

        RepositoryLogger.logSuccess(operation, this.entityName, result.data._id.toString(), {
          chatId: messageData.chat,
          type: messageData.type,
          status: messageData.status
        });

        return {
          success: true,
          data: populatedMessage!
        };
      }

      return result;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * 🔹 ENHANCED MESSAGE QUERIES
   */

  /**
   * ✅ NEW: Type-safe chat messages retrieval with real-time features
   */
  async getChatMessagesSecure(
    chatId: string,
    pagination?: PaginationParams,
    filters?: MessageFilters,
    context?: RepositoryContext
  ): Promise<PaginatedResponse<EMessage> | EMessage[]> {
    const operation = 'getChatMessagesSecure';

    try {
      this.validateObjectId(chatId, operation);

      RepositoryLogger.logStart(operation, this.entityName, undefined, { 
        chatId, 
        pagination, 
        filters 
      });

      // ✅ BUILD FILTER QUERY
      const query: FilterQuery<EMessage> = {
        chat: new Types.ObjectId(chatId),
        ...this.buildMessageFilterQuery(filters)
      };

      // ✅ POPULATION OPTIONS FOR REAL-TIME MESSAGING
      const options: FindOptions = {
        populate: [
          {
            path: 'sender',
            select: 'firstName lastName profilePicture isOnline lastSeen'
          },
          {
            path: 'replyTo',
            select: 'content sender type createdAt',
            populate: {
              path: 'sender',
              select: 'firstName lastName'
            }
          }
        ],
        sort: { createdAt: pagination ? -1 : 1 } // Newest first for pagination, oldest first for full load
      };

      let result: PaginatedResponse<EMessage> | EMessage[];

      if (pagination) {
        // ✅ PAGINATED RESULTS (for chat history)
        this.validatePaginationParams(pagination);
        result = await this.findPaginated(query, pagination, options, context);
        
        // Reverse data for chronological order in chat
        (result as PaginatedResponse<EMessage>).data.reverse();
      } else {
        // ✅ ALL MESSAGES (for real-time chat)
        result = await this.find(query, options, context);
      }

      // ✅ ENHANCE MESSAGES WITH STATUS VALIDATION
      const enhancedMessages = Array.isArray(result) 
        ? this.enhanceMessagesWithStatus(result)
        : this.enhanceMessagesWithStatus((result as PaginatedResponse<EMessage>).data);

      if (Array.isArray(result)) {
        RepositoryLogger.logSuccess(operation, this.entityName, undefined, {
          chatId,
          messageCount: enhancedMessages.length
        });
        return enhancedMessages;
      } else {
        (result as PaginatedResponse<EMessage>).data = enhancedMessages;
        RepositoryLogger.logSuccess(operation, this.entityName, undefined, {
          chatId,
          messageCount: enhancedMessages.length,
          page: pagination?.page,
          total: result.pagination.totalItems
        });
        return result;
      }

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * ✅ NEW: Advanced message search with type safety
   */
  async searchMessagesSecure(
    searchQuery: string,
    chatIds: string[],
    pagination: PaginationParams,
    filters?: MessageFilters,
    context?: RepositoryContext
  ): Promise<PaginatedResponse<EMessage>> {
    const operation = 'searchMessagesSecure';

    try {
      this.validatePaginationParams(pagination);

      if (!searchQuery || searchQuery.trim().length < 2) {
        throw RepositoryErrorFactory.validationError(
          'Search query must be at least 2 characters',
          operation,
          this.entityName,
          undefined,
          { searchQuery }
        );
      }

      // ✅ VALIDATE CHAT IDS
      chatIds.forEach(id => this.validateObjectId(id, operation));

      RepositoryLogger.logStart(operation, this.entityName, undefined, {
        searchQuery: searchQuery.substring(0, 50),
        chatCount: chatIds.length,
        pagination
      });

      // ✅ BUILD SEARCH QUERY
      const query: FilterQuery<EMessage> = {
        chat: { $in: chatIds.map(id => new Types.ObjectId(id)) },
        $text: { $search: searchQuery },
        ...this.buildMessageFilterQuery(filters)
      };

      const options: FindOptions = {
        populate: [
          {
            path: 'sender',
            select: 'firstName lastName profilePicture'
          },
          {
            path: 'chat',
            select: 'participants chatName type'
          }
        ],
        sort: { score: { $meta: 'textScore' }, createdAt: -1 }
      };

      const result = await this.findPaginated(query, pagination, options, context);

      RepositoryLogger.logSuccess(operation, this.entityName, undefined, {
        searchQuery: searchQuery.substring(0, 50),
        resultCount: result.data.length,
        total: result.pagination.totalItems
      });

      return result;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * 🔹 REAL-TIME MESSAGE STATUS OPERATIONS
   */

  /**
   * ✅ NEW: Advanced read receipt system
   */
  async markMessagesAsReadSecure(
    readReceiptData: ReadReceiptData,
    context?: RepositoryContext
  ): Promise<UpdateResult<any>> {
    const operation = 'markMessagesAsReadSecure';

    try {
      this.validateObjectId(readReceiptData.chatId, operation);
      this.validateObjectId(readReceiptData.userId, operation);

      RepositoryLogger.logStart(operation, this.entityName, undefined, {
        chatId: readReceiptData.chatId,
        userId: readReceiptData.userId,
        messageCount: readReceiptData.messageIds?.length || 'all_unread'
      });

      // ✅ BUILD UPDATE FILTER
      const filter: FilterQuery<EMessage> = {
        chat: new Types.ObjectId(readReceiptData.chatId),
        sender: { $ne: new Types.ObjectId(readReceiptData.userId) }, // Not sent by this user
        readBy: { $ne: new Types.ObjectId(readReceiptData.userId) }, // User hasn't read yet
        status: { $in: ['sent', 'delivered'] } // Only these can become 'read'
      };

      // ✅ ADD MESSAGE ID FILTER IF SPECIFIED
      if (readReceiptData.messageIds && readReceiptData.messageIds.length > 0) {
        filter._id = { $in: readReceiptData.messageIds.map(id => new Types.ObjectId(id)) };
      }

      // ✅ UPDATE WITH READ RECEIPT
      const updateData = {
        $addToSet: { readBy: new Types.ObjectId(readReceiptData.userId) },
        $set: {
          status: 'read' as MessageStatus,
          readAt: readReceiptData.readAt || new Date(),
          updatedAt: new Date()
        }
      };

      const result = await this.model.updateMany(filter, updateData);

      RepositoryLogger.logSuccess(operation, this.entityName, undefined, {
        chatId: readReceiptData.chatId,
        userId: readReceiptData.userId,
        markedAsRead: result.modifiedCount
      });

      return {
        success: true,
        modified: result.modifiedCount > 0,
        data: {
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount
        }
      };

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * ✅ NEW: Bulk delivery status update
   */
  async markMessagesAsDeliveredSecure(
    chatId: string,
    recipientId: string,
    deliveredAt?: Date,
    context?: RepositoryContext
  ): Promise<UpdateResult<any>> {
    const operation = 'markMessagesAsDeliveredSecure';

    try {
      this.validateObjectId(chatId, operation);
      this.validateObjectId(recipientId, operation);

      RepositoryLogger.logStart(operation, this.entityName, undefined, {
        chatId,
        recipientId
      });

      // ✅ UPDATE UNDELIVERED MESSAGES
      const filter: FilterQuery<EMessage> = {
        chat: new Types.ObjectId(chatId),
        sender: { $ne: new Types.ObjectId(recipientId) }, // Not sent by recipient
        status: 'sent' // Only update sent messages
      };

      const updateData = {
        $set: {
          status: 'delivered' as MessageStatus,
          deliveredAt: deliveredAt || new Date(),
          updatedAt: new Date()
        }
      };

      const result = await this.model.updateMany(filter, updateData);

      RepositoryLogger.logSuccess(operation, this.entityName, undefined, {
        chatId,
        recipientId,
        deliveredCount: result.modifiedCount
      });

      return {
        success: true,
        modified: result.modifiedCount > 0,
        data: {
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount
        }
      };

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * ✅ NEW: Get unread message count with detailed breakdown
   */
  async getUnreadCountDetailed(
    chatId: string,
    userId: string,
    context?: RepositoryContext
  ): Promise<{
    unreadCount: number;
    lastReadMessageId?: string;
    lastReadAt?: Date;
    oldestUnreadAt?: Date;
    unreadByType: Record<MessageType, number>;
  }> {
    const operation = 'getUnreadCountDetailed';

    try {
      this.validateObjectId(chatId, operation);
      this.validateObjectId(userId, operation);

      // ✅ AGGREGATION FOR DETAILED UNREAD STATS
      const pipeline = [
        {
          $match: {
            chat: new Types.ObjectId(chatId),
            sender: { $ne: new Types.ObjectId(userId) },
            readBy: { $ne: new Types.ObjectId(userId) }
          }
        },
        {
          $group: {
            _id: null,
            unreadCount: { $sum: 1 },
            oldestUnreadAt: { $min: '$createdAt' },
            unreadByType: {
              $push: {
                type: '$type',
                createdAt: '$createdAt'
              }
            }
          }
        }
      ];

      const result = await this.aggregate<any>(pipeline, context);

      if (result.data.length === 0) {
        return {
          unreadCount: 0,
          unreadByType: {} as Record<MessageType, number>
        };
      }

      const stats = result.data[0];
      
      // ✅ PROCESS UNREAD BY TYPE
      const unreadByType = stats.unreadByType.reduce((acc: Record<MessageType, number>, item: any) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      }, {} as Record<MessageType, number>);

      // ✅ GET LAST READ MESSAGE
      const lastReadMessage = await this.findOne(
        {
          chat: new Types.ObjectId(chatId),
          readBy: new Types.ObjectId(userId)
        },
        { sort: { readAt: -1 }, select: '_id readAt' },
        context
      );

      return {
        unreadCount: stats.unreadCount,
        lastReadMessageId: lastReadMessage?._id?.toString(),
        lastReadAt: lastReadMessage ? new Date(lastReadMessage.readAt) : undefined,
        oldestUnreadAt: stats.oldestUnreadAt,
        unreadByType
      };

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * 🔹 MESSAGE ANALYTICS & STATISTICS
   */

  /**
   * ✅ NEW: Comprehensive messaging statistics
   */
  async getMessagingStatistics(
    timeRange: { start: Date; end: Date },
    chatIds?: string[],
    context?: RepositoryContext
  ): Promise<MessageStatistics> {
    const operation = 'getMessagingStatistics';

    try {
      RepositoryLogger.logStart(operation, this.entityName, undefined, {
        timeRange,
        chatCount: chatIds?.length || 'all'
      });

      // ✅ BUILD MATCH FILTER
      const matchFilter: any = {
        createdAt: {
          $gte: timeRange.start,
          $lte: timeRange.end
        }
      };

      if (chatIds && chatIds.length > 0) {
        matchFilter.chat = { $in: chatIds.map(id => new Types.ObjectId(id)) };
      }

      // ✅ COMPREHENSIVE AGGREGATION PIPELINE
      const pipeline = [
        { $match: matchFilter },
        {
          $group: {
            _id: null,
            totalMessages: { $sum: 1 },
            messagesByType: {
              $push: '$type'
            },
            messagesByStatus: {
              $push: '$status'
            },
            participantCounts: {
              $push: '$sender'
            },
            chats: { $addToSet: '$chat' },
            responseTimes: {
              $push: {
                $cond: [
                  { $ne: ['$replyTo', null] },
                  { $subtract: ['$createdAt', '$replyTo.createdAt'] },
                  null
                ]
              }
            }
          }
        },
        {
          $project: {
            totalMessages: 1,
            activeChatsToday: { $size: '$chats' },
            messagesByType: {
              $arrayToObject: {
                $map: {
                  input: { $setUnion: ['$messagesByType'] },
                  as: 'type',
                  in: {
                    k: '$$type',
                    v: {
                      $size: {
                        $filter: {
                          input: '$messagesByType',
                          cond: { $eq: ['$$this', '$$type'] }
                        }
                      }
                    }
                  }
                }
              }
            },
            messagesByStatus: {
              $arrayToObject: {
                $map: {
                  input: { $setUnion: ['$messagesByStatus'] },
                  as: 'status',
                  in: {
                    k: '$$status',
                    v: {
                      $size: {
                        $filter: {
                          input: '$messagesByStatus',
                          cond: { $eq: ['$$this', '$$status'] }
                        }
                      }
                    }
                  }
                }
              }
            },
            participantCounts: {
              $arrayToObject: {
                $map: {
                  input: { $setUnion: ['$participantCounts'] },
                  as: 'participant',
                  in: {
                    k: { $toString: '$$participant' },
                    v: {
                      $size: {
                        $filter: {
                          input: '$participantCounts',
                          cond: { $eq: ['$$this', '$$participant'] }
                        }
                      }
                    }
                  }
                }
              }
            },
            averageResponseTime: {
              $avg: {
                $filter: {
                  input: '$responseTimes',
                  cond: { $ne: ['$$this', null] }
                }
              }
            }
          }
        }
      ];

      const result = await this.aggregate<any>(pipeline, context);

      if (result.data.length === 0) {
        return {
          totalMessages: 0,
          messagesByType: {} as Record<MessageType, number>,
          messagesByStatus: {} as Record<MessageStatus, number>,
          participantCounts: {},
          averageResponseTime: 0,
          activeChatsToday: 0
        };
      }

      const stats = result.data[0];

      RepositoryLogger.logSuccess(operation, this.entityName, undefined, {
        totalMessages: stats.totalMessages,
        activeChats: stats.activeChatsToday,
        averageResponseTime: stats.averageResponseTime
      });

      return {
        totalMessages: stats.totalMessages,
        messagesByType: stats.messagesByType || {},
        messagesByStatus: stats.messagesByStatus || {},
        participantCounts: stats.participantCounts || {},
        averageResponseTime: Math.round(stats.averageResponseTime || 0),
        activeChatsToday: stats.activeChatsToday
      };

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * 🔹 VALIDATION & HELPER METHODS
   */

  private validateMessageCreateData(data: MessageCreateData, operation: string): void {
    const errors: string[] = [];

    // Required fields validation
    if (!data.sender) errors.push('sender is required');
    if (!data.chat) errors.push('chat is required');
    if (!data.type) errors.push('type is required');
    if (!data.content || data.content.trim().length === 0) errors.push('content is required');

    // ObjectId validation
    if (data.sender && !Types.ObjectId.isValid(data.sender)) {
      errors.push('Invalid sender ID format');
    }
    if (data.chat && !Types.ObjectId.isValid(data.chat)) {
      errors.push('Invalid chat ID format');
    }
    if (data.replyTo && !Types.ObjectId.isValid(data.replyTo)) {
      errors.push('Invalid replyTo message ID format');
    }

    // Type validation
    const validTypes: MessageType[] = ['text', 'image', 'audio', 'video', 'file', 'system'];
    if (data.type && !validTypes.includes(data.type)) {
      errors.push(`Invalid message type. Must be one of: ${validTypes.join(', ')}`);
    }

    // Status validation
    const validStatuses: MessageStatus[] = ['sent', 'delivered', 'read', 'failed'];
    if (data.status && !validStatuses.includes(data.status)) {
      errors.push(`Invalid message status. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Content length validation
    if (data.content && data.content.length > 5000) {
      errors.push('Message content must be less than 5000 characters');
    }

    if (errors.length > 0) {
      throw RepositoryErrorFactory.validationError(
        `Message validation failed: ${errors.join(', ')}`,
        operation,
        this.entityName,
        undefined,
        { errors, data: { sender: data.sender, chat: data.chat, type: data.type } }
      );
    }
  }

  private buildMessageFilterQuery(filters?: MessageFilters): FilterQuery<EMessage> {
    if (!filters) return {};

    const query: FilterQuery<EMessage> = {};

    if (filters.senderId) {
      query.sender = new Types.ObjectId(filters.senderId);
    }

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.dateRange) {
      query.createdAt = {
        $gte: filters.dateRange.start,
        $lte: filters.dateRange.end
      };
    }

    if (filters.searchQuery) {
      query.$text = { $search: filters.searchQuery };
    }

    if (filters.hasReply !== undefined) {
      query.replyTo = filters.hasReply ? { $exists: true, $ne: null } : { $exists: false };
    }

    return query;
  }

  private enhanceMessagesWithStatus(messages: EMessage[]): EMessage[] {
    return messages.map(msg => {
      const validStatuses: MessageStatus[] = ['sent', 'delivered', 'read', 'failed'];
      const currentStatus = msg.status as MessageStatus;
      
      if (!validStatuses.includes(currentStatus)) {
        console.warn(`📨 Invalid message status detected: ${currentStatus}, correcting to 'sent'`);
        (msg as any).status = 'sent';
      }

      return msg;
    });
  }

  /**
   * 🔹 LEGACY COMPATIBILITY METHODS
   */

  // ⚠️ DEPRECATED - Use createMessageSecure instead
  async create(data: Partial<EMessage>): Promise<EMessage> {
    console.warn('⚠️ MessageRepository.create() is deprecated. Use createMessageSecure() for better type safety.');
    
    try {
      const result = await this.createMessageSecure(data as MessageCreateData);
      return result.success ? result.data! : {} as EMessage;
    } catch (error: any) {
      console.error('Legacy create error:', error.message);
      throw new Error("Failed to create message: " + error.message);
    }
  }

  // ⚠️ DEPRECATED - Use getChatMessagesSecure instead  
  async findByChatId(chatId: string): Promise<EMessage[]> {
    console.warn('⚠️ MessageRepository.findByChatId() is deprecated. Use getChatMessagesSecure() for better performance.');
    
    try {
      const result = await this.getChatMessagesSecure(chatId);
      return Array.isArray(result) ? result : result.data;
    } catch (error: any) {
      console.error('Legacy findByChatId error:', error.message);
      throw new Error("Failed to find messages: " + error.message);
    }
  }

  // ⚠️ DEPRECATED - Use markMessagesAsReadSecure instead
  async markAsReadByUser(chatId: string, userId: string): Promise<number> {
    console.warn('⚠️ MessageRepository.markAsReadByUser() is deprecated. Use markMessagesAsReadSecure() for better tracking.');
    
    try {
      const result = await this.markMessagesAsReadSecure({ chatId, userId });
      return result.success ? (result.data?.modifiedCount || 0) : 0;
    } catch (error: any) {
      console.error('Legacy markAsReadByUser error:', error.message);
      throw new Error("Failed to mark messages as read: " + error.message);
    }
  }

  // ⚠️ DEPRECATED - Use getUnreadCountDetailed instead
  async getUnreadCount(chatId: string, userId: string): Promise<number> {
    console.warn('⚠️ MessageRepository.getUnreadCount() is deprecated. Use getUnreadCountDetailed() for better insights.');
    
    try {
      const result = await this.getUnreadCountDetailed(chatId, userId);
      return result.unreadCount;
    } catch (error: any) {
      console.error('Legacy getUnreadCount error:', error.message);
      throw new Error("Failed to get unread count: " + error.message);
    }
  }

  // Keep other legacy methods following the same pattern...
  // (Additional legacy methods would be implemented here for full compatibility)
}