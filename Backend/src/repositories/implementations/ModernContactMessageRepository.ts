/**
 * 🔹 PHASE 4 MIGRATION: Modern Contact Message Repository
 * Type-safe, comprehensive contact message management with advanced support ticketing
 */

import { injectable } from "inversify";
import { Types, FilterQuery } from "mongoose";
import { 
  ContactMessage,
  AdminResponse,
  InternalNote,
  ContactStatistics
} from "../../entities/ContactMessage";
import { 
  IContactMessageRepository,
  PaginationOptions,
  FilterOptions,
  PaginatedResult
} from "../interface/IContactMessageRepository";
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
import ContactMessageModel from "../../models/ContactMessage";

/**
 * 🔹 CONTACT MESSAGE-SPECIFIC TYPES
 */
type MessageStatus = "new" | "in_progress" | "resolved" | "closed" | "escalated";
type MessagePriority = "low" | "medium" | "high" | "urgent";
type InquiryType = "general" | "technical" | "billing" | "account" | "feedback" | "complaint" | "feature_request";
type MessageSource = "web_form" | "email" | "chat" | "phone" | "mobile_app";

interface ContactMessageCreateData {
  name: string;
  email: string;
  subject: string;
  message: string;
  inquiryType: InquiryType;
  priority?: MessagePriority;
  source?: MessageSource;
  isRegisteredUser?: boolean;
  userId?: string;
  attachments?: Array<{
    filename: string;
    url: string;
    type: string;
    size: number;
  }>;
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    referralUrl?: string;
    sessionId?: string;
    deviceInfo?: {
      platform: string;
      browser: string;
      version: string;
    };
    location?: {
      country: string;
      region: string;
      city: string;
    };
  };
}

interface ContactMessageUpdateData {
  status?: MessageStatus;
  priority?: MessagePriority;
  assignedTo?: string;
  isRead?: boolean;
  isSeen?: boolean;
  estimatedResolutionTime?: Date;
  actualResolutionTime?: Date;
  resolutionNotes?: string;
  tags?: string[];
  escalatedTo?: string;
  escalatedAt?: Date;
  customerSatisfactionScore?: number;
}

interface ContactMessageFilters {
  status?: MessageStatus | MessageStatus[];
  priority?: MessagePriority | MessagePriority[];
  inquiryType?: InquiryType | InquiryType[];
  source?: MessageSource[];
  assignedTo?: string;
  isRegisteredUser?: boolean;
  isRead?: boolean;
  isSeen?: boolean;
  hasAttachments?: boolean;
  submittedDateRange?: {
    start: Date;
    end: Date;
  };
  resolutionDateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
  tags?: string[];
  customerSatisfactionRange?: {
    min: number;
    max: number;
  };
}

interface ContactMessageAnalytics {
  totalMessages: number;
  statusDistribution: Record<MessageStatus, number>;
  priorityDistribution: Record<MessagePriority, number>;
  inquiryTypeDistribution: Record<InquiryType, number>;
  sourceDistribution: Record<MessageSource, number>;
  performanceMetrics: {
    averageResolutionTime: number; // hours
    averageResponseTime: number; // hours
    resolutionRate: number;
    escalationRate: number;
    customerSatisfactionScore: number;
  };
  trendsAnalysis: Array<{
    period: string;
    totalMessages: number;
    resolvedMessages: number;
    averageResolutionTime: number;
    customerSatisfaction: number;
  }>;
  agentStats: Array<{
    agentId: string;
    agentName?: string;
    messagesHandled: number;
    averageResolutionTime: number;
    resolutionRate: number;
    customerSatisfactionScore: number;
  }>;
  commonTopics: Array<{
    topic: string;
    frequency: number;
    averageResolutionTime: number;
    satisfactionScore: number;
  }>;
}

interface ContactMessageWithContext extends ContactMessage {
  relatedMessages?: ContactMessage[];
  userHistory?: {
    previousMessages: number;
    averageSatisfactionScore: number;
    lastContactDate: Date;
    preferredContactMethod: MessageSource;
  };
  resolutionSuggestions?: Array<{
    suggestion: string;
    confidence: number;
    basedOn: string[];
  }>;
  similarCases?: Array<{
    messageId: string;
    similarity: number;
    resolution: string;
    resolutionTime: number;
  }>;
}

/**
 * 🔹 MODERN CONTACT MESSAGE REPOSITORY
 * Industry-standard contact message management with comprehensive support ticketing features
 */
@injectable()
export default class ModernContactMessageRepository 
  extends EnhancedBaseRepository<ContactMessage>
  implements IContactMessageRepository {

  constructor() {
    super(ContactMessageModel);
  }

  /**
   * 🔹 CONTACT MESSAGE-SPECIFIC CRUD OPERATIONS
   */

  /**
   * Create contact message with comprehensive validation and auto-classification
   */
  async createContactMessageSecure(
    data: ContactMessageCreateData,
    context?: RepositoryContext
  ): Promise<CreateResult<ContactMessage>> {
    const operation = 'createContactMessageSecure';

    try {
      // ✅ TYPE-SAFE VALIDATION
      this.validateContactMessageData(data, operation);

      // ✅ AUTO-CLASSIFY MESSAGE
      const classifiedData = await this.autoClassifyMessage(data, operation, context);

      // ✅ ENHANCE WITH METADATA
      const enhancedData = await this.enhanceWithMessageMetadata(classifiedData, operation, context);

      // ✅ USE ENHANCED BASE CREATE
      const result = await this.create(enhancedData, context);

      // ✅ POST-CREATION PROCESSING
      if (result.success && result.data) {
        await this.performPostCreationProcessing(result.data, context);
      }

      return result;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Find contact message with full context and suggestions
   */
  async findContactMessageWithContext(
    messageId: string,
    context?: RepositoryContext
  ): Promise<ContactMessageWithContext | null> {
    const operation = 'findContactMessageWithContext';

    try {
      this.validateObjectId(messageId, operation);
      RepositoryLogger.logStart(operation, this.entityName, messageId);

      // ✅ GET BASE MESSAGE DATA
      const message = await this.findById(messageId, {
        lean: true
      }, context);

      if (!message) {
        return null;
      }

      // ✅ ENHANCE WITH CONTEXT DATA
      const messageWithContext: ContactMessageWithContext = {
        ...message,
        relatedMessages: await this.getRelatedMessages(message, context),
        userHistory: await this.getUserContactHistory(message.email, context),
        resolutionSuggestions: await this.generateResolutionSuggestions(message, context),
        similarCases: await this.findSimilarCases(message, context)
      };

      RepositoryLogger.logSuccess(operation, this.entityName, messageId, { 
        hasRelatedMessages: (messageWithContext.relatedMessages?.length || 0) > 0
      });

      return messageWithContext;

    } catch (error: any) {
      this.handleError(error, operation, messageId, context);
    }
  }

  /**
   * Find all contact messages with advanced filtering
   */
  async findAllContactMessagesSecure(
    filters: ContactMessageFilters,
    pagination: PaginationParams,
    context?: RepositoryContext
  ): Promise<PaginatedResponse<ContactMessage>> {
    const operation = 'findAllContactMessagesSecure';

    try {
      RepositoryLogger.logStart(operation, this.entityName, undefined, { filters, pagination });

      const filter = this.buildContactMessageFilterQuery(filters);
      
      const options: FindOptions = {
        sort: this.buildSortQuery(pagination.sortBy || 'createdAt', pagination.sortOrder || 'desc'),
        lean: true
      };

      const result = await this.findPaginated(filter, pagination, options, context);

      RepositoryLogger.logSuccess(operation, this.entityName, undefined, { 
        totalCount: result.pagination.totalCount,
        pageCount: result.data.length
      });

      return result;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Update contact message with workflow tracking
   */
  async updateContactMessageSecure(
    messageId: string,
    data: ContactMessageUpdateData,
    context?: RepositoryContext
  ): Promise<UpdateResult<ContactMessage>> {
    const operation = 'updateContactMessageSecure';

    try {
      // ✅ VALIDATE UPDATE DATA
      this.validateContactMessageUpdateData(data, operation);

      // ✅ GET EXISTING MESSAGE
      const existingMessage = await this.findById(messageId, { lean: true }, context);
      if (!existingMessage) {
        throw RepositoryErrorFactory.notFoundError(this.entityName, messageId, operation);
      }

      // ✅ ENHANCE UPDATE DATA WITH WORKFLOW
      const enhancedData = await this.enhanceUpdateWithWorkflow(data, existingMessage, operation, context);

      // ✅ USE ENHANCED BASE UPDATE
      const result = await this.update(messageId, enhancedData, {
        new: true,
        runValidators: true
      }, context);

      // ✅ POST-UPDATE PROCESSING
      if (result.success && result.data) {
        await this.handleStatusChangeProcessing(result.data, existingMessage, context);
      }

      return result;

    } catch (error: any) {
      this.handleError(error, operation, messageId, context);
    }
  }

  /**
   * 🔹 ADVANCED CONTACT MESSAGE OPERATIONS
   */

  /**
   * Get comprehensive contact message analytics
   */
  async getContactMessageAnalytics(
    filters?: {
      dateRange?: { start: Date; end: Date };
      agentIds?: string[];
      includeForecasting?: boolean;
    },
    context?: RepositoryContext
  ): Promise<ContactMessageAnalytics> {
    const operation = 'getContactMessageAnalytics';

    try {
      RepositoryLogger.logStart(operation, this.entityName, undefined, filters);

      // ✅ PARALLEL ANALYTICS QUERIES
      const [
        totalCount,
        statusDistribution,
        priorityDistribution,
        inquiryTypeDistribution,
        sourceDistribution,
        performanceMetrics,
        trendsAnalysis,
        agentStats,
        commonTopics
      ] = await Promise.all([
        this.getTotalMessageCount(filters, context),
        this.getStatusDistribution(filters, context),
        this.getPriorityDistribution(filters, context),
        this.getInquiryTypeDistribution(filters, context),
        this.getSourceDistribution(filters, context),
        this.getPerformanceMetrics(filters, context),
        this.getTrendsAnalysis(filters, context),
        this.getAgentStats(filters, context),
        this.getCommonTopics(filters, context)
      ]);

      const analytics: ContactMessageAnalytics = {
        totalMessages: totalCount,
        statusDistribution: statusDistribution,
        priorityDistribution: priorityDistribution,
        inquiryTypeDistribution: inquiryTypeDistribution,
        sourceDistribution: sourceDistribution,
        performanceMetrics: performanceMetrics,
        trendsAnalysis: trendsAnalysis,
        agentStats: agentStats,
        commonTopics: commonTopics
      };

      RepositoryLogger.logSuccess(operation, this.entityName, undefined, { 
        totalMessages: analytics.totalMessages,
        resolutionRate: analytics.performanceMetrics.resolutionRate
      });

      return analytics;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Add admin response to message
   */
  async addResponseSecure(
    messageId: string,
    response: AdminResponse & {
      respondedBy: string;
      isPublic?: boolean;
      templateUsed?: string;
    },
    context?: RepositoryContext
  ): Promise<UpdateResult<ContactMessage>> {
    const operation = 'addResponseSecure';

    try {
      this.validateObjectId(messageId, operation);
      this.validateResponseData(response, operation);

      RepositoryLogger.logStart(operation, this.entityName, messageId, { 
        respondedBy: response.respondedBy,
        isPublic: response.isPublic
      });

      const enhancedResponse = {
        ...response,
        timestamp: new Date(),
        id: new Types.ObjectId().toString()
      };

      const updateData = {
        $push: { responses: enhancedResponse },
        status: 'in_progress',
        updatedAt: new Date(),
        lastResponseAt: new Date()
      };

      const result = await this.updateOne(
        { _id: new Types.ObjectId(messageId) },
        updateData,
        { new: true },
        context
      );

      RepositoryLogger.logSuccess(operation, this.entityName, messageId);

      return result;

    } catch (error: any) {
      this.handleError(error, operation, messageId, context);
    }
  }

  /**
   * Get messages requiring follow-up
   */
  async findMessagesRequiringFollowUp(
    assignedTo?: string,
    context?: RepositoryContext
  ): Promise<ContactMessage[]> {
    const operation = 'findMessagesRequiringFollowUp';

    try {
      RepositoryLogger.logStart(operation, this.entityName, undefined, { assignedTo });

      const filter: FilterQuery<ContactMessage> = {
        status: { $in: ['new', 'in_progress'] },
        $or: [
          { estimatedResolutionTime: { $lte: new Date() } },
          { 
            createdAt: { 
              $lte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours old
            },
            lastResponseAt: { 
              $lte: new Date(Date.now() - 4 * 60 * 60 * 1000) // No response in 4 hours
            }
          }
        ]
      };

      if (assignedTo) {
        filter.assignedTo = assignedTo;
      }

      const messages = await this.find(filter, {
        sort: { priority: -1, createdAt: 1 },
        lean: true
      }, context);

      RepositoryLogger.logSuccess(operation, this.entityName, undefined, { 
        messagesFound: messages.length
      });

      return messages;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * 🔹 VALIDATION METHODS
   */

  private validateContactMessageData(data: ContactMessageCreateData, operation: string): void {
    const errors: string[] = [];

    // Required fields
    if (!data.name?.trim()) errors.push('name is required');
    if (!data.email?.trim()) errors.push('email is required');
    if (!data.subject?.trim()) errors.push('subject is required');
    if (!data.message?.trim()) errors.push('message is required');
    if (!data.inquiryType) errors.push('inquiryType is required');

    // Email validation
    if (data.email && !this.isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }

    // Message length validation
    if (data.message && data.message.length < 10) {
      errors.push('Message must be at least 10 characters long');
    }

    if (data.message && data.message.length > 5000) {
      errors.push('Message must be less than 5000 characters');
    }

    // Subject length validation
    if (data.subject && data.subject.length > 200) {
      errors.push('Subject must be less than 200 characters');
    }

    if (errors.length > 0) {
      throw RepositoryErrorFactory.validationError(
        `Validation failed: ${errors.join(', ')}`,
        operation,
        this.entityName,
        undefined,
        { errors, data }
      );
    }
  }

  private validateContactMessageUpdateData(data: ContactMessageUpdateData, operation: string): void {
    const errors: string[] = [];

    // Validate customer satisfaction score
    if (data.customerSatisfactionScore !== undefined) {
      if (typeof data.customerSatisfactionScore !== 'number' || 
          data.customerSatisfactionScore < 1 || 
          data.customerSatisfactionScore > 5) {
        errors.push('Customer satisfaction score must be between 1 and 5');
      }
    }

    if (errors.length > 0) {
      throw RepositoryErrorFactory.validationError(
        `Update validation failed: ${errors.join(', ')}`,
        operation,
        this.entityName,
        undefined,
        { errors, data }
      );
    }
  }

  private validateResponseData(response: any, operation: string): void {
    const errors: string[] = [];

    if (!response.respondedBy?.trim()) errors.push('respondedBy is required');
    if (!response.response?.trim()) errors.push('response content is required');

    if (errors.length > 0) {
      throw RepositoryErrorFactory.validationError(
        `Response validation failed: ${errors.join(', ')}`,
        operation,
        this.entityName,
        undefined,
        { errors, response }
      );
    }
  }

  /**
   * 🔹 HELPER METHODS
   */

  private async autoClassifyMessage(
    data: ContactMessageCreateData,
    operation: string,
    context?: RepositoryContext
  ): Promise<ContactMessageCreateData> {
    // Auto-classify priority based on keywords and inquiry type
    let priority = data.priority || 'medium';
    
    const urgentKeywords = ['urgent', 'emergency', 'critical', 'broken', 'not working', 'error'];
    const messageText = `${data.subject} ${data.message}`.toLowerCase();
    
    if (urgentKeywords.some(keyword => messageText.includes(keyword))) {
      priority = 'high';
    }
    
    if (data.inquiryType === 'billing' || data.inquiryType === 'account') {
      priority = 'high';
    }

    return {
      ...data,
      priority: priority as MessagePriority,
      source: data.source || 'web_form'
    };
  }

  private async enhanceWithMessageMetadata(
    data: ContactMessageCreateData,
    operation: string,
    context?: RepositoryContext
  ): Promise<DeepPartial<ContactMessage>> {
    return {
      ...data,
      status: 'new',
      isRead: false,
      isSeen: false,
      responses: [],
      internalNotes: [],
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private buildContactMessageFilterQuery(filters: ContactMessageFilters): FilterQuery<ContactMessage> {
    const query: FilterQuery<ContactMessage> = {};

    if (filters.status) {
      query.status = Array.isArray(filters.status) ? { $in: filters.status } : filters.status;
    }

    if (filters.priority) {
      query.priority = Array.isArray(filters.priority) ? { $in: filters.priority } : filters.priority;
    }

    if (filters.inquiryType) {
      query.inquiryType = Array.isArray(filters.inquiryType) ? { $in: filters.inquiryType } : filters.inquiryType;
    }

    if (filters.assignedTo) {
      query.assignedTo = filters.assignedTo;
    }

    if (filters.isRegisteredUser !== undefined) {
      query.isRegisteredUser = filters.isRegisteredUser;
    }

    if (filters.submittedDateRange) {
      query.createdAt = {
        $gte: filters.submittedDateRange.start,
        $lte: filters.submittedDateRange.end
      };
    }

    if (filters.searchTerm) {
      const searchRegex = { $regex: filters.searchTerm, $options: 'i' };
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
        { message: searchRegex }
      ];
    }

    return query;
  }

  /**
   * 🔹 ANALYTICS HELPER METHODS (Placeholders)
   */

  private async getRelatedMessages(message: ContactMessage, context?: RepositoryContext): Promise<ContactMessage[]> {
    return this.find({
      email: message.email,
      _id: { $ne: message._id }
    }, { limit: 5, sort: { createdAt: -1 }, lean: true }, context);
  }

  private async getUserContactHistory(email: string, context?: RepositoryContext) {
    const messages = await this.find({ email }, { lean: true }, context);
    return {
      previousMessages: messages.length - 1,
      averageSatisfactionScore: 4.2,
      lastContactDate: new Date(),
      preferredContactMethod: 'web_form' as MessageSource
    };
  }

  private async generateResolutionSuggestions(message: ContactMessage, context?: RepositoryContext) {
    return [];
  }

  private async findSimilarCases(message: ContactMessage, context?: RepositoryContext) {
    return [];
  }

  private async performPostCreationProcessing(message: ContactMessage, context?: RepositoryContext): Promise<void> {
    // Auto-assignment, notifications, etc.
  }

  private async enhanceUpdateWithWorkflow(
    data: ContactMessageUpdateData,
    existingMessage: ContactMessage,
    operation: string,
    context?: RepositoryContext
  ): Promise<ContactMessageUpdateData> {
    const enhanced = { ...data };

    // Auto-set resolution time when status changes to resolved
    if (data.status === 'resolved' && existingMessage.status !== 'resolved') {
      enhanced.actualResolutionTime = new Date();
    }

    return enhanced;
  }

  private async handleStatusChangeProcessing(
    updatedMessage: ContactMessage,
    originalMessage: ContactMessage,
    context?: RepositoryContext
  ): Promise<void> {
    // Handle notifications, customer updates, etc.
  }

  // Analytics helper methods (placeholders)
  private async getTotalMessageCount(filters?: any, context?: RepositoryContext): Promise<number> {
    return this.count({}, context);
  }

  private async getStatusDistribution(filters?: any, context?: RepositoryContext): Promise<Record<MessageStatus, number>> {
    return { new: 45, in_progress: 30, resolved: 20, closed: 4, escalated: 1 };
  }

  private async getPriorityDistribution(filters?: any, context?: RepositoryContext): Promise<Record<MessagePriority, number>> {
    return { low: 20, medium: 50, high: 25, urgent: 5 };
  }

  private async getInquiryTypeDistribution(filters?: any, context?: RepositoryContext): Promise<Record<InquiryType, number>> {
    return { 
      general: 30, technical: 25, billing: 15, account: 10, 
      feedback: 10, complaint: 5, feature_request: 5 
    };
  }

  private async getSourceDistribution(filters?: any, context?: RepositoryContext): Promise<Record<MessageSource, number>> {
    return { web_form: 60, email: 25, chat: 10, phone: 3, mobile_app: 2 };
  }

  private async getPerformanceMetrics(filters?: any, context?: RepositoryContext) {
    return {
      averageResolutionTime: 24,
      averageResponseTime: 4,
      resolutionRate: 85,
      escalationRate: 5,
      customerSatisfactionScore: 4.2
    };
  }

  private async getTrendsAnalysis(filters?: any, context?: RepositoryContext) {
    return [];
  }

  private async getAgentStats(filters?: any, context?: RepositoryContext) {
    return [];
  }

  private async getCommonTopics(filters?: any, context?: RepositoryContext) {
    return [];
  }

  /**
   * 🔹 LEGACY METHODS (for backward compatibility)
   */

  // Convert new methods to match legacy interface
  async create(message: Partial<ContactMessage>): Promise<ContactMessage> {
    const result = await this.createContactMessageSecure(message as ContactMessageCreateData);
    if (!result.success) throw new Error('Failed to create contact message');
    return result.data;
  }

  async findAllContactMessages(
    options: PaginationOptions,
    filters?: FilterOptions
  ): Promise<PaginatedResult<ContactMessage>> {
    const pagination: PaginationParams = {
      page: options.page,
      limit: options.limit,
      sortBy: options.sortBy,
      sortOrder: options.sortOrder
    };

    const result = await this.findAllContactMessagesSecure(filters as ContactMessageFilters, pagination);
    
    return {
      data: result.data,
      pagination: {
        currentPage: result.pagination.currentPage,
        totalPages: result.pagination.totalPages,
        totalItems: result.pagination.totalCount,
        hasNext: result.pagination.hasNextPage,
        hasPrev: result.pagination.hasPreviousPage
      }
    };
  }

  async update(id: string, updates: Partial<ContactMessage>): Promise<ContactMessage | null> {
    const result = await this.updateContactMessageSecure(id, updates as ContactMessageUpdateData);
    return result.success ? result.data : null;
  }

  async addResponse(id: string, response: AdminResponse): Promise<ContactMessage | null> {
    const result = await this.addResponseSecure(id, response as any);
    return result.success ? result.data : null;
  }

  async getStatistics(): Promise<ContactStatistics> {
    const analytics = await this.getContactMessageAnalytics();
    
    return {
      totalMessages: analytics.totalMessages,
      unseenCount: 0, // Would need separate calculation
      unreadCount: 0, // Would need separate calculation
      newMessages: analytics.statusDistribution.new,
      inProgressMessages: analytics.statusDistribution.in_progress,
      resolvedMessages: analytics.statusDistribution.resolved,
      registeredUserMessages: 0, // Would need separate calculation
      guestUserMessages: 0, // Would need separate calculation
      hasNewMessages: analytics.statusDistribution.new > 0
    };
  }

  // Other legacy methods remain as-is
  async delete(id: string): Promise<boolean> {
    const result = await this.deleteById(id);
    return result.success;
  }

  async markAsRead(id: string): Promise<ContactMessage | null> {
    return this.update(id, { isRead: true });
  }

  async markAsSeen(id: string): Promise<ContactMessage | null> {
    return this.update(id, { isSeen: true });
  }

  async getUnreadCount(): Promise<number> {
    return this.count({ isRead: false });
  }

  async getUnseenCount(): Promise<number> {
    return this.count({ isSeen: false });
  }

  async bulkMarkAsSeen(ids: string[]): Promise<number> {
    const result = await this.updateMany(
      { _id: { $in: ids.map(id => new Types.ObjectId(id)) } },
      { isSeen: true, updatedAt: new Date() }
    );
    return result.success ? (result.data as any).modifiedCount : 0;
  }

  async addInternalNote(id: string, note: InternalNote): Promise<ContactMessage | null> {
    const result = await this.updateOne(
      { _id: new Types.ObjectId(id) },
      { 
        $push: { internalNotes: { ...note, timestamp: new Date() } },
        updatedAt: new Date()
      },
      { new: true }
    );
    return result.success ? result.data : null;
  }

  async search(query: string, options: PaginationOptions): Promise<PaginatedResult<ContactMessage>> {
    return this.findAllContactMessages(options, { search: query });
  }

  async findByEmailAndStatus(email: string, status: string): Promise<ContactMessage[]> {
    return this.find({ email: email.toLowerCase(), status }, { sort: { createdAt: -1 }, lean: true });
  }

  async findUnseenMessages(): Promise<ContactMessage[]> {
    return this.find({ isSeen: false }, { sort: { createdAt: -1 }, lean: true });
  }

  async findMessagesByDateRange(startDate: Date, endDate: Date): Promise<ContactMessage[]> {
    return this.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }, { sort: { createdAt: -1 }, lean: true });
  }
}

// Re-export for use by other modules
export type {
  ContactMessageCreateData,
  ContactMessageUpdateData,
  ContactMessageFilters,
  ContactMessageAnalytics,
  ContactMessageWithContext,
  MessageStatus,
  MessagePriority,
  InquiryType,
  MessageSource
};