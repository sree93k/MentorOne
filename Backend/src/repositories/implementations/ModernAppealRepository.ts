/**
 * 🔹 PHASE 3 MIGRATION: Modern Appeal Repository
 * Type-safe, comprehensive appeal management with advanced moderation and analytics
 */

import { injectable } from "inversify";
import { Types, FilterQuery } from "mongoose";
import { 
  EAppeal, 
  CreateAppealDTO, 
  UpdateAppealDTO, 
  AppealSearchFilters 
} from "../../entities/appealEntity";
import { IAppealRepository } from "../interface/IAppealRepository";
import { IPaginatedResult } from "../interface/IBaseRepository";
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
import AppealModel from "../../models/appealModel";

/**
 * 🔹 APPEAL-SPECIFIC TYPES
 */
type AppealStatus = "pending" | "under_review" | "approved" | "rejected" | "escalated";
type AppealCategory = "wrongful_block" | "account_hacked" | "misunderstanding" | "service_issue" | "payment_dispute" | "other";
type AppealPriority = "low" | "medium" | "high" | "urgent";
type AppealSource = "web" | "mobile" | "email" | "support_ticket" | "phone";

interface AppealCreateData {
  userId?: string;
  email: string;
  firstName: string;
  lastName: string;
  appealMessage: string;
  category: AppealCategory;
  priority?: AppealPriority;
  source?: AppealSource;
  blockEventId?: string;
  previousAppealId?: string;
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
  };
}

interface AppealUpdateData {
  status?: AppealStatus;
  priority?: AppealPriority;
  reviewedBy?: string;
  reviewedAt?: Date;
  adminResponse?: string;
  adminNotes?: string;
  escalatedTo?: string;
  escalatedAt?: Date;
  resolutionType?: "approved" | "rejected" | "partial" | "referred";
  followUpRequired?: boolean;
  followUpDate?: Date;
}

interface AppealFilters {
  userId?: string;
  email?: string;
  status?: AppealStatus | AppealStatus[];
  category?: AppealCategory | AppealCategory[];
  priority?: AppealPriority | AppealPriority[];
  source?: AppealSource[];
  reviewedBy?: string;
  submittedDateRange?: {
    start: Date;
    end: Date;
  };
  reviewedDateRange?: {
    start: Date;
    end: Date;
  };
  blockEventId?: string;
  hasFollowUp?: boolean;
  searchTerm?: string; // Search in appeal message, names, email
  requiresEscalation?: boolean;
}

interface AppealAnalytics {
  totalAppeals: number;
  statusDistribution: Record<AppealStatus, number>;
  categoryDistribution: Record<AppealCategory, number>;
  priorityDistribution: Record<AppealPriority, number>;
  sourceDistribution: Record<AppealSource, number>;
  performanceMetrics: {
    averageResolutionTime: number; // hours
    averageResponseTime: number; // hours
    approvalRate: number;
    escalationRate: number;
    reopenRate: number;
  };
  trendsAnalysis: Array<{
    period: string;
    totalAppeals: number;
    approvedAppeals: number;
    rejectedAppeals: number;
    averageResolutionTime: number;
  }>;
  moderatorStats: Array<{
    moderatorId: string;
    moderatorName?: string;
    appealsHandled: number;
    averageResolutionTime: number;
    approvalRate: number;
    escalationRate: number;
  }>;
  commonIssues: Array<{
    category: AppealCategory;
    keywords: string[];
    frequency: number;
    resolutionPattern: string;
  }>;
}

interface AppealWithContext extends EAppeal {
  relatedAppeals?: EAppeal[];
  userHistory?: {
    previousAppeals: number;
    appealSuccessRate: number;
    accountAge: number;
    lastActivity: Date;
  };
  blockContext?: {
    blockReason: string;
    blockDate: Date;
    blockDuration: string;
    moderatorWhoBlocked: string;
  };
  similarCases?: Array<{
    appealId: string;
    similarity: number;
    resolution: AppealStatus;
    resolutionNotes: string;
  }>;
  riskAssessment?: {
    riskLevel: "low" | "medium" | "high";
    riskFactors: string[];
    recommendedAction: string;
  };
}

interface AppealWorkflowStep {
  stepId: string;
  stepName: string;
  status: "pending" | "completed" | "skipped";
  assignedTo?: string;
  completedAt?: Date;
  completedBy?: string;
  notes?: string;
  duration?: number;
}

interface AppealEscalation {
  escalatedBy: string;
  escalatedTo: string;
  escalatedAt: Date;
  reason: string;
  priority: AppealPriority;
  dueDate?: Date;
  notes?: string;
}

/**
 * 🔹 MODERN APPEAL REPOSITORY
 * Industry-standard appeal management with comprehensive moderation and advanced analytics
 */
@injectable()
export default class ModernAppealRepository 
  extends EnhancedBaseRepository<EAppeal>
  implements IAppealRepository {

  constructor() {
    super(AppealModel);
  }

  /**
   * 🔹 APPEAL-SPECIFIC CRUD OPERATIONS
   */

  /**
   * Create appeal with comprehensive validation and duplicate checking
   */
  async createAppealSecure(
    data: AppealCreateData,
    context?: RepositoryContext
  ): Promise<CreateResult<EAppeal>> {
    const operation = 'createAppealSecure';

    try {
      // ✅ TYPE-SAFE VALIDATION
      this.validateAppealCreateData(data, operation);

      // ✅ BUSINESS RULE VALIDATION
      await this.validateAppealBusinessRules(data, operation, context);

      // ✅ CHECK FOR DUPLICATE APPEALS
      await this.checkDuplicateAppeals(data, operation, context);

      // ✅ ENHANCE WITH COMPUTED FIELDS
      const enhancedData = await this.enhanceWithAppealMetadata(data, operation, context);

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
   * Find appeal with full context and related information
   */
  async findAppealWithContext(
    appealId: string,
    context?: RepositoryContext
  ): Promise<AppealWithContext | null> {
    const operation = 'findAppealWithContext';

    try {
      this.validateObjectId(appealId, operation);
      RepositoryLogger.logStart(operation, this.entityName, appealId);

      // ✅ GET BASE APPEAL DATA
      const appeal = await this.findById(appealId, {
        lean: true
      }, context);

      if (!appeal) {
        return null;
      }

      // ✅ ENHANCE WITH CONTEXT DATA
      const appealWithContext: AppealWithContext = {
        ...appeal,
        relatedAppeals: await this.getRelatedAppeals(appeal, context),
        userHistory: await this.getUserAppealHistory(appeal.userId || appeal.email, context),
        blockContext: await this.getBlockContext(appeal.blockEventId, context),
        similarCases: await this.findSimilarCases(appeal, context),
        riskAssessment: await this.assessAppealRisk(appeal, context)
      };

      RepositoryLogger.logSuccess(operation, this.entityName, appealId, { 
        hasRelatedAppeals: (appealWithContext.relatedAppeals?.length || 0) > 0,
        riskLevel: appealWithContext.riskAssessment?.riskLevel
      });

      return appealWithContext;

    } catch (error: any) {
      this.handleError(error, operation, appealId, context);
    }
  }

  /**
   * Update appeal status with workflow tracking
   */
  async updateAppealStatusSecure(
    appealId: string,
    data: AppealUpdateData,
    context?: RepositoryContext
  ): Promise<UpdateResult<EAppeal>> {
    const operation = 'updateAppealStatusSecure';

    try {
      // ✅ VALIDATE UPDATE DATA
      this.validateAppealUpdateData(data, operation);

      // ✅ GET EXISTING APPEAL
      const existingAppeal = await this.findById(appealId, { lean: true }, context);
      if (!existingAppeal) {
        throw RepositoryErrorFactory.notFoundError(this.entityName, appealId, operation);
      }

      // ✅ VALIDATE STATUS TRANSITION
      this.validateStatusTransition(existingAppeal.status, data.status, operation);

      // ✅ ENHANCE UPDATE DATA WITH WORKFLOW
      const enhancedData = await this.enhanceUpdateWithWorkflow(data, existingAppeal, operation, context);

      // ✅ USE ENHANCED BASE UPDATE
      const result = await this.update(appealId, enhancedData, {
        new: true,
        runValidators: true
      }, context);

      // ✅ POST-UPDATE PROCESSING
      if (result.success && result.data) {
        await this.handleStatusChangeProcessing(result.data, existingAppeal, context);
      }

      return result;

    } catch (error: any) {
      this.handleError(error, operation, appealId, context);
    }
  }

  /**
   * 🔹 ADVANCED APPEAL OPERATIONS
   */

  /**
   * Find appeals with advanced filtering and search
   */
  async findAppealsWithFiltersSecure(
    filters: AppealFilters,
    pagination: PaginationParams,
    context?: RepositoryContext
  ): Promise<PaginatedResponse<EAppeal>> {
    const operation = 'findAppealsWithFiltersSecure';

    try {
      RepositoryLogger.logStart(operation, this.entityName, undefined, { filters, pagination });

      const filter = this.buildAppealFilterQuery(filters);
      
      const options: FindOptions = {
        sort: this.buildSortQuery(pagination.sortBy || 'submittedAt', pagination.sortOrder || 'desc'),
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
   * Get comprehensive appeal analytics
   */
  async getAppealAnalytics(
    filters?: {
      dateRange?: { start: Date; end: Date };
      moderatorIds?: string[];
      includeForecasting?: boolean;
    },
    context?: RepositoryContext
  ): Promise<AppealAnalytics> {
    const operation = 'getAppealAnalytics';

    try {
      RepositoryLogger.logStart(operation, this.entityName, undefined, filters);

      // ✅ PARALLEL ANALYTICS QUERIES
      const [
        totalCount,
        statusDistribution,
        categoryDistribution,
        priorityDistribution,
        sourceDistribution,
        performanceMetrics,
        trendsAnalysis,
        moderatorStats,
        commonIssues
      ] = await Promise.all([
        this.getTotalAppealCount(filters, context),
        this.getStatusDistribution(filters, context),
        this.getCategoryDistribution(filters, context),
        this.getPriorityDistribution(filters, context),
        this.getSourceDistribution(filters, context),
        this.getPerformanceMetrics(filters, context),
        this.getTrendsAnalysis(filters, context),
        this.getModeratorStats(filters, context),
        this.getCommonIssues(filters, context)
      ]);

      const analytics: AppealAnalytics = {
        totalAppeals: totalCount,
        statusDistribution: statusDistribution,
        categoryDistribution: categoryDistribution,
        priorityDistribution: priorityDistribution,
        sourceDistribution: sourceDistribution,
        performanceMetrics: performanceMetrics,
        trendsAnalysis: trendsAnalysis,
        moderatorStats: moderatorStats,
        commonIssues: commonIssues
      };

      RepositoryLogger.logSuccess(operation, this.entityName, undefined, { 
        totalAppeals: analytics.totalAppeals,
        approvalRate: analytics.performanceMetrics.approvalRate
      });

      return analytics;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Escalate appeal to higher authority
   */
  async escalateAppeal(
    appealId: string,
    escalationData: AppealEscalation,
    context?: RepositoryContext
  ): Promise<UpdateResult<EAppeal>> {
    const operation = 'escalateAppeal';

    try {
      this.validateObjectId(appealId, operation);
      this.validateEscalationData(escalationData, operation);

      RepositoryLogger.logStart(operation, this.entityName, appealId, { 
        escalatedTo: escalationData.escalatedTo,
        reason: escalationData.reason
      });

      // ✅ UPDATE APPEAL WITH ESCALATION INFO
      const updateData: AppealUpdateData = {
        status: 'escalated',
        priority: escalationData.priority,
        escalatedTo: escalationData.escalatedTo,
        escalatedAt: escalationData.escalatedAt,
        followUpRequired: true,
        followUpDate: escalationData.dueDate
      };

      const result = await this.updateAppealStatusSecure(appealId, updateData, context);

      // ✅ CREATE ESCALATION RECORD
      if (result.success) {
        await this.createEscalationRecord(appealId, escalationData, context);
      }

      RepositoryLogger.logSuccess(operation, this.entityName, appealId);

      return result;

    } catch (error: any) {
      this.handleError(error, operation, appealId, context);
    }
  }

  /**
   * Find appeals requiring follow-up
   */
  async findAppealsRequiringFollowUp(
    assignedTo?: string,
    context?: RepositoryContext
  ): Promise<EAppeal[]> {
    const operation = 'findAppealsRequiringFollowUp';

    try {
      RepositoryLogger.logStart(operation, this.entityName, undefined, { assignedTo });

      const filter: FilterQuery<EAppeal> = {
        followUpRequired: true,
        followUpDate: { $lte: new Date() },
        status: { $in: ['under_review', 'escalated'] }
      };

      if (assignedTo) {
        filter.$or = [
          { reviewedBy: assignedTo },
          { escalatedTo: assignedTo }
        ];
      }

      const appeals = await this.find(filter, {
        sort: { followUpDate: 1 },
        lean: true
      }, context);

      RepositoryLogger.logSuccess(operation, this.entityName, undefined, { 
        appealsFound: appeals.length
      });

      return appeals;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * 🔹 VALIDATION METHODS
   */

  /**
   * Validate appeal creation data
   */
  private validateAppealCreateData(data: AppealCreateData, operation: string): void {
    const errors: string[] = [];

    // Required fields
    if (!data.email?.trim()) errors.push('email is required');
    if (!data.firstName?.trim()) errors.push('firstName is required');
    if (!data.lastName?.trim()) errors.push('lastName is required');
    if (!data.appealMessage?.trim()) errors.push('appealMessage is required');
    if (!data.category) errors.push('category is required');

    // Email validation
    if (data.email && !this.isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }

    // Appeal message length
    if (data.appealMessage && data.appealMessage.length < 10) {
      errors.push('Appeal message must be at least 10 characters long');
    }

    if (data.appealMessage && data.appealMessage.length > 2000) {
      errors.push('Appeal message must be less than 2000 characters');
    }

    // Validate category
    const validCategories: AppealCategory[] = [
      "wrongful_block", "account_hacked", "misunderstanding", 
      "service_issue", "payment_dispute", "other"
    ];
    if (data.category && !validCategories.includes(data.category)) {
      errors.push(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
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

  /**
   * Validate appeal update data
   */
  private validateAppealUpdateData(data: AppealUpdateData, operation: string): void {
    const errors: string[] = [];

    // Validate status if provided
    if (data.status) {
      const validStatuses: AppealStatus[] = ["pending", "under_review", "approved", "rejected", "escalated"];
      if (!validStatuses.includes(data.status)) {
        errors.push(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }
    }

    // Validate priority if provided
    if (data.priority) {
      const validPriorities: AppealPriority[] = ["low", "medium", "high", "urgent"];
      if (!validPriorities.includes(data.priority)) {
        errors.push(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`);
      }
    }

    // Admin response validation
    if (data.adminResponse && data.adminResponse.length > 1000) {
      errors.push('Admin response must be less than 1000 characters');
    }

    // Admin notes validation
    if (data.adminNotes && data.adminNotes.length > 500) {
      errors.push('Admin notes must be less than 500 characters');
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

  /**
   * Validate escalation data
   */
  private validateEscalationData(data: AppealEscalation, operation: string): void {
    const errors: string[] = [];

    if (!data.escalatedBy?.trim()) errors.push('escalatedBy is required');
    if (!data.escalatedTo?.trim()) errors.push('escalatedTo is required');
    if (!data.reason?.trim()) errors.push('escalation reason is required');
    if (!data.escalatedAt) errors.push('escalatedAt is required');

    if (data.reason && data.reason.length < 10) {
      errors.push('Escalation reason must be at least 10 characters long');
    }

    if (errors.length > 0) {
      throw RepositoryErrorFactory.validationError(
        `Escalation validation failed: ${errors.join(', ')}`,
        operation,
        this.entityName,
        undefined,
        { errors, data }
      );
    }
  }

  /**
   * 🔹 HELPER METHODS
   */

  /**
   * Validate appeal business rules
   */
  private async validateAppealBusinessRules(
    data: AppealCreateData,
    operation: string,
    context?: RepositoryContext
  ): Promise<void> {
    // Check appeal rate limiting
    if (data.userId || data.email) {
      const recentAppeals = await this.findRecentAppealsByUser(
        data.userId || data.email, 
        24, 
        context
      );

      if (recentAppeals.length >= 3) {
        throw RepositoryErrorFactory.businessRuleError(
          'Too many appeals submitted in the last 24 hours',
          operation,
          this.entityName,
          data.userId || data.email
        );
      }
    }
  }

  /**
   * Check for duplicate appeals
   */
  private async checkDuplicateAppeals(
    data: AppealCreateData,
    operation: string,
    context?: RepositoryContext
  ): Promise<void> {
    // Check for similar appeal in the last 7 days
    const recentSimilar = await this.find({
      email: data.email,
      category: data.category,
      status: { $in: ['pending', 'under_review'] },
      submittedAt: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    }, { limit: 1, lean: true }, context);

    if (recentSimilar.length > 0) {
      throw RepositoryErrorFactory.duplicateError(
        this.entityName,
        operation,
        'similar_appeal',
        `${data.email}:${data.category}`,
        'Similar appeal already exists in pending/review status'
      );
    }
  }

  /**
   * Enhance appeal data with computed fields
   */
  private async enhanceWithAppealMetadata(
    data: AppealCreateData,
    operation: string,
    context?: RepositoryContext
  ): Promise<DeepPartial<EAppeal>> {
    // Calculate appeal count for this user/email
    const appealCount = await this.count({
      $or: [
        { userId: data.userId },
        { email: data.email }
      ]
    }, context) + 1;

    return {
      ...data,
      status: 'pending',
      priority: data.priority || this.calculateInitialPriority(data),
      source: data.source || 'web',
      appealCount: appealCount,
      canReappeal: true,
      submittedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Validate status transition
   */
  private validateStatusTransition(currentStatus: string, newStatus?: string, operation?: string): void {
    if (!newStatus || currentStatus === newStatus) return;

    const validTransitions: Record<string, string[]> = {
      'pending': ['under_review', 'rejected'],
      'under_review': ['approved', 'rejected', 'escalated'],
      'escalated': ['approved', 'rejected', 'under_review'],
      'approved': [], // Final state
      'rejected': ['under_review'] // Can be reopened
    };

    const allowedTransitions = validTransitions[currentStatus] || [];
    if (!allowedTransitions.includes(newStatus)) {
      throw RepositoryErrorFactory.businessRuleError(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
        operation || 'validateStatusTransition',
        this.entityName
      );
    }
  }

  /**
   * Build filter query for appeals
   */
  private buildAppealFilterQuery(filters: AppealFilters): FilterQuery<EAppeal> {
    const query: FilterQuery<EAppeal> = {};

    if (filters.userId) {
      query.userId = filters.userId;
    }

    if (filters.email) {
      query.email = { $regex: filters.email, $options: 'i' };
    }

    if (filters.status) {
      query.status = Array.isArray(filters.status) ? { $in: filters.status } : filters.status;
    }

    if (filters.category) {
      query.category = Array.isArray(filters.category) ? { $in: filters.category } : filters.category;
    }

    if (filters.priority) {
      query.priority = Array.isArray(filters.priority) ? { $in: filters.priority } : filters.priority;
    }

    if (filters.reviewedBy) {
      query.reviewedBy = filters.reviewedBy;
    }

    if (filters.submittedDateRange) {
      query.submittedAt = {
        $gte: filters.submittedDateRange.start,
        $lte: filters.submittedDateRange.end
      };
    }

    if (filters.blockEventId) {
      query.blockEventId = filters.blockEventId;
    }

    if (filters.hasFollowUp !== undefined) {
      query.followUpRequired = filters.hasFollowUp;
    }

    if (filters.searchTerm) {
      const searchRegex = { $regex: filters.searchTerm, $options: 'i' };
      query.$or = [
        { appealMessage: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { adminResponse: searchRegex }
      ];
    }

    return query;
  }

  /**
   * 🔹 ANALYTICS AND CONTEXT HELPER METHODS (Placeholders)
   */

  private async getRelatedAppeals(appeal: EAppeal, context?: RepositoryContext): Promise<EAppeal[]> {
    // Find appeals from same user/email
    return this.find({
      $or: [
        { userId: appeal.userId },
        { email: appeal.email }
      ],
      _id: { $ne: appeal._id }
    }, { limit: 5, sort: { submittedAt: -1 }, lean: true }, context);
  }

  private async getUserAppealHistory(userIdOrEmail: string, context?: RepositoryContext) {
    const appeals = await this.find({
      $or: [
        { userId: userIdOrEmail },
        { email: userIdOrEmail }
      ]
    }, { lean: true }, context);

    const approved = appeals.filter(a => a.status === 'approved').length;
    const total = appeals.length;

    return {
      previousAppeals: total - 1, // Exclude current
      appealSuccessRate: total > 1 ? (approved / (total - 1)) * 100 : 0,
      accountAge: 30, // Placeholder
      lastActivity: new Date()
    };
  }

  private async getBlockContext(blockEventId?: string, context?: RepositoryContext) {
    // Placeholder - would integrate with blocking system
    return blockEventId ? {
      blockReason: "Suspicious activity",
      blockDate: new Date(),
      blockDuration: "7 days",
      moderatorWhoBlocked: "system"
    } : undefined;
  }

  private async findSimilarCases(appeal: EAppeal, context?: RepositoryContext) {
    // Placeholder - would use ML/NLP to find similar cases
    return [];
  }

  private async assessAppealRisk(appeal: EAppeal, context?: RepositoryContext) {
    // Placeholder - risk assessment algorithm
    return {
      riskLevel: "low" as const,
      riskFactors: [],
      recommendedAction: "Standard review process"
    };
  }

  private async performPostCreationProcessing(appeal: EAppeal, context?: RepositoryContext): Promise<void> {
    // Auto-assignment, notifications, etc.
  }

  private async enhanceUpdateWithWorkflow(
    data: AppealUpdateData,
    existingAppeal: EAppeal,
    operation: string,
    context?: RepositoryContext
  ): Promise<AppealUpdateData> {
    const enhanced = { ...data };

    // Auto-set reviewedAt for status changes
    if (data.status && data.status !== existingAppeal.status && data.status !== 'pending') {
      enhanced.reviewedAt = new Date();
    }

    return enhanced;
  }

  private async handleStatusChangeProcessing(
    updatedAppeal: EAppeal,
    originalAppeal: EAppeal,
    context?: RepositoryContext
  ): Promise<void> {
    // Handle notifications, user account updates, etc.
  }

  private async createEscalationRecord(
    appealId: string,
    escalationData: AppealEscalation,
    context?: RepositoryContext
  ): Promise<void> {
    // Create escalation audit record
  }

  private calculateInitialPriority(data: AppealCreateData): AppealPriority {
    // Priority calculation logic
    if (data.category === 'account_hacked') return 'urgent';
    if (data.category === 'wrongful_block') return 'high';
    return 'medium';
  }

  private async findRecentAppealsByUser(
    userIdOrEmail: string, 
    hoursBack: number, 
    context?: RepositoryContext
  ): Promise<EAppeal[]> {
    const timeThreshold = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
    
    return this.find({
      $or: [
        { userId: userIdOrEmail },
        { email: userIdOrEmail }
      ],
      submittedAt: { $gte: timeThreshold }
    }, { sort: { submittedAt: -1 }, lean: true }, context);
  }

  // Analytics helper methods (placeholders)
  private async getTotalAppealCount(filters?: any, context?: RepositoryContext): Promise<number> {
    return this.count({}, context);
  }

  private async getStatusDistribution(filters?: any, context?: RepositoryContext): Promise<Record<AppealStatus, number>> {
    const pipeline = [
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ];
    
    const result = await this.aggregate<{ _id: AppealStatus; count: number }>(pipeline, context);
    
    const distribution: Record<AppealStatus, number> = {
      pending: 0,
      under_review: 0,
      approved: 0,
      rejected: 0,
      escalated: 0
    };

    result.data.forEach(item => {
      if (item._id && item._id in distribution) {
        distribution[item._id] = item.count;
      }
    });

    return distribution;
  }

  private async getCategoryDistribution(filters?: any, context?: RepositoryContext): Promise<Record<AppealCategory, number>> {
    return {
      wrongful_block: 45,
      account_hacked: 20,
      misunderstanding: 15,
      service_issue: 10,
      payment_dispute: 5,
      other: 5
    };
  }

  private async getPriorityDistribution(filters?: any, context?: RepositoryContext): Promise<Record<AppealPriority, number>> {
    return {
      low: 20,
      medium: 50,
      high: 25,
      urgent: 5
    };
  }

  private async getSourceDistribution(filters?: any, context?: RepositoryContext): Promise<Record<AppealSource, number>> {
    return {
      web: 60,
      mobile: 30,
      email: 5,
      support_ticket: 3,
      phone: 2
    };
  }

  private async getPerformanceMetrics(filters?: any, context?: RepositoryContext) {
    return {
      averageResolutionTime: 48, // hours
      averageResponseTime: 6, // hours
      approvalRate: 65,
      escalationRate: 8,
      reopenRate: 3
    };
  }

  private async getTrendsAnalysis(filters?: any, context?: RepositoryContext) {
    return [];
  }

  private async getModeratorStats(filters?: any, context?: RepositoryContext) {
    return [];
  }

  private async getCommonIssues(filters?: any, context?: RepositoryContext) {
    return [];
  }

  /**
   * 🔹 LEGACY METHODS (for backward compatibility)
   */

  // ❌ DEPRECATED - Use createAppealSecure instead
  async createAppeal(appealData: CreateAppealDTO): Promise<EAppeal> {
    console.warn('⚠️ AppealRepository.createAppeal() is deprecated. Use createAppealSecure() instead.');
    const result = await this.createAppealSecure(appealData);
    if (!result.success) {
      throw new Error('Failed to create appeal');
    }
    return result.data;
  }

  // ❌ DEPRECATED - Use updateAppealStatusSecure instead
  async updateAppealStatus(appealId: string, updateData: UpdateAppealDTO): Promise<EAppeal | null> {
    console.warn('⚠️ AppealRepository.updateAppealStatus() is deprecated. Use updateAppealStatusSecure() instead.');
    const result = await this.updateAppealStatusSecure(appealId, updateData);
    return result.success ? result.data : null;
  }

  // ❌ DEPRECATED - Use getAppealAnalytics instead
  async getAppealStatistics(): Promise<any> {
    console.warn('⚠️ AppealRepository.getAppealStatistics() is deprecated. Use getAppealAnalytics() instead.');
    const analytics = await this.getAppealAnalytics();
    
    // Convert to legacy format
    return {
      total: analytics.totalAppeals,
      pending: analytics.statusDistribution.pending,
      approved: analytics.statusDistribution.approved,
      rejected: analytics.statusDistribution.rejected,
      under_review: analytics.statusDistribution.under_review,
      recent: 0, // Would need additional calculation
      categoryBreakdown: Object.entries(analytics.categoryDistribution).map(([_id, count]) => ({ _id, count })),
      approvalRate: analytics.performanceMetrics.approvalRate
    };
  }

  // ❌ DEPRECATED - Use findAppealsWithFiltersSecure instead
  async findAppealsWithFilters(
    searchQuery: any,
    page: number,
    limit: number
  ): Promise<IPaginatedResult<EAppeal>> {
    console.warn('⚠️ AppealRepository.findAppealsWithFilters() is deprecated. Use findAppealsWithFiltersSecure() instead.');
    
    const pagination: PaginationParams = {
      page,
      limit,
      sortBy: 'submittedAt',
      sortOrder: 'desc'
    };

    const result = await this.findAppealsWithFiltersSecure(searchQuery as AppealFilters, pagination);
    
    // Convert to legacy format
    return {
      data: result.data,
      totalCount: result.pagination.totalCount,
      currentPage: result.pagination.currentPage,
      totalPages: result.pagination.totalPages,
      hasNextPage: result.pagination.hasNextPage,
      hasPreviousPage: result.pagination.hasPreviousPage
    };
  }

  // Legacy methods that still work
  async findByUserIdAndStatus(userId: string, status?: string): Promise<EAppeal[]> {
    const filter: FilterQuery<EAppeal> = { userId };
    if (status) filter.status = status;
    return this.find(filter, { sort: { submittedAt: -1 } });
  }

  async findByEmail(email: string): Promise<EAppeal[]> {
    return this.find({ email }, { sort: { submittedAt: -1 } });
  }

  async findByQuery(query: any): Promise<EAppeal[]> {
    return this.find(query, { sort: { submittedAt: -1 }, lean: true });
  }

  async findRecentAppealsByUser(userId: string, hoursBack: number = 24): Promise<EAppeal[]> {
    return this.findRecentAppealsByUser(userId, hoursBack);
  }

  // ❌ DEPRECATED - Use createAppealSecure instead
  async create(data: DeepPartial<EAppeal>, context?: RepositoryContext): Promise<CreateResult<EAppeal>> {
    console.warn('⚠️ AppealRepository.create() is deprecated. Use createAppealSecure() instead.');
    return super.create(data, context);
  }
}

// Re-export for use by other modules
export type {
  AppealCreateData,
  AppealUpdateData,
  AppealFilters,
  AppealAnalytics,
  AppealWithContext,
  AppealWorkflowStep,
  AppealEscalation,
  AppealStatus,
  AppealCategory,
  AppealPriority,
  AppealSource
};