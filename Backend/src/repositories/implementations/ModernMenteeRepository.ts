/**
 * 🔹 PHASE 3 MIGRATION: Modern Mentee Repository
 * Type-safe, comprehensive mentee management with learning analytics and goal tracking
 */

import { injectable } from "inversify";
import { Types, FilterQuery } from "mongoose";
import { EMentee } from "../../entities/menteeEntiry";
import { IMenteeRepository } from "../interface/IMenteeRepository";
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
import Mentee from "../../models/menteeModel";

/**
 * 🔹 MENTEE-SPECIFIC TYPES
 */
type LearningGoalStatus = "active" | "completed" | "paused" | "cancelled";
type MenteeStatus = "active" | "inactive" | "onboarding" | "churned";
type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
type EngagementLevel = "high" | "medium" | "low" | "inactive";

interface MenteeCreateData {
  joinPurpose: string[];
  careerGoals: string;
  interestedNewcareer: string[];
  status?: MenteeStatus;
  isOnline?: boolean;
  metadata?: {
    currentRole?: string;
    experience?: string;
    industry?: string;
    skills?: string[];
    learningStyle?: string[];
    availability?: {
      weekdays: string[];
      timeSlots: string[];
      timezone: string;
    };
    budget?: {
      min: number;
      max: number;
      currency: string;
    };
    preferences?: {
      mentorGender?: string;
      communicationStyle?: string[];
      sessionFormat?: string[];
    };
  };
}

interface MenteeUpdateData {
  joinPurpose?: string[];
  careerGoals?: string;
  interestedNewcareer?: string[];
  status?: MenteeStatus;
  isOnline?: boolean;
  lastActiveAt?: Date;
  profileCompleteness?: number;
  engagementScore?: number;
  learningProgress?: number;
}

interface MenteeFilters {
  joinPurpose?: string | string[];
  interestedNewcareer?: string | string[];
  status?: MenteeStatus | MenteeStatus[];
  isOnline?: boolean;
  engagementLevel?: EngagementLevel | EngagementLevel[];
  industry?: string[];
  experience?: string[];
  budget?: {
    min?: number;
    max?: number;
  };
  lastActiveRange?: {
    start: Date;
    end: Date;
  };
  createdRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
  hasBookings?: boolean;
  hasCompletedSessions?: boolean;
}

interface MenteeAnalytics {
  totalMentees: number;
  activeMentees: number;
  statusDistribution: Record<MenteeStatus, number>;
  engagementDistribution: Record<EngagementLevel, number>;
  topJoinPurposes: Array<{
    purpose: string;
    menteeCount: number;
  }>;
  topCareerInterests: Array<{
    career: string;
    menteeCount: number;
  }>;
  learningProgress: {
    averageProgress: number;
    completionRate: number;
    dropoutRate: number;
  };
  bookingMetrics: {
    totalBookings: number;
    averageBookingsPerMentee: number;
    completionRate: number;
    cancellationRate: number;
  };
  satisfactionMetrics: {
    averageRating: number;
    recommendationRate: number;
    repeatBookingRate: number;
  };
  growthMetrics: {
    newMenteesThisMonth: number;
    churnRate: number;
    reactivationRate: number;
  };
}

interface MenteeWithDetails extends EMentee {
  bookings?: Array<{
    _id: string;
    mentorId: string;
    serviceId: string;
    status: BookingStatus;
    scheduledAt: Date;
    completedAt?: Date;
  }>;
  learningJourney?: {
    totalSessions: number;
    completedSessions: number;
    totalSpent: number;
    averageSessionRating: number;
    skills?: string[];
    achievements?: string[];
    certificates?: string[];
  };
  engagementMetrics?: {
    level: EngagementLevel;
    score: number;
    lastActiveAt: Date;
    sessionFrequency: number;
    responseRate: number;
  };
  preferences?: {
    favoriteTopics: string[];
    preferredMentors: string[];
    communicationStyle: string[];
    learningGoals: Array<{
      goal: string;
      status: LearningGoalStatus;
      targetDate?: Date;
      progress: number;
    }>;
  };
}

interface LearningGoal {
  title: string;
  description: string;
  targetDate: Date;
  status: LearningGoalStatus;
  progress: number;
  milestones: Array<{
    title: string;
    description: string;
    completed: boolean;
    completedAt?: Date;
  }>;
}

interface BookingCreateData {
  menteeId: string;
  mentorId: string;
  serviceId: string;
  scheduledAt: Date;
  notes?: string;
  status?: BookingStatus;
}

/**
 * 🔹 MODERN MENTEE REPOSITORY
 * Industry-standard mentee management with comprehensive learning analytics and goal tracking
 */
@injectable()
export default class ModernMenteeRepository 
  extends EnhancedBaseRepository<EMentee>
  implements IMenteeRepository {

  constructor() {
    super(Mentee);
  }

  /**
   * 🔹 MENTEE-SPECIFIC CRUD OPERATIONS
   */

  /**
   * Create a new mentee with comprehensive onboarding
   */
  async createMenteeSecure(
    data: MenteeCreateData,
    context?: RepositoryContext
  ): Promise<CreateResult<EMentee>> {
    const operation = 'createMenteeSecure';

    try {
      // ✅ TYPE-SAFE VALIDATION
      this.validateMenteeData(data, operation);

      // ✅ BUSINESS RULE VALIDATION
      await this.validateBusinessRules(data, operation, context);

      // ✅ ENHANCE WITH ONBOARDING DATA
      const enhancedData = await this.enhanceWithOnboardingData(data, operation, context);

      // ✅ USE ENHANCED BASE CREATE
      const result = await this.create(enhancedData, context);

      // ✅ POST-CREATION ONBOARDING
      if (result.success && result.data) {
        await this.performOnboardingSetup(result.data, context);
      }

      return result;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Find mentee by ID with comprehensive learning details
   */
  async findMenteeWithDetails(
    id: string,
    context?: RepositoryContext
  ): Promise<MenteeWithDetails | null> {
    const operation = 'findMenteeWithDetails';

    try {
      this.validateObjectId(id, operation);
      RepositoryLogger.logStart(operation, this.entityName, id);

      // ✅ GET BASE MENTEE DATA
      const mentee = await this.findById(id, {
        populate: [
          {
            path: 'Bookings',
            select: 'mentorId serviceId status scheduledAt completedAt rating'
          }
        ],
        lean: true
      }, context);

      if (!mentee) {
        return null;
      }

      // ✅ ENHANCE WITH LEARNING ANALYTICS
      const menteeWithDetails: MenteeWithDetails = {
        ...mentee,
        bookings: await this.getMenteeBookings(id, context),
        learningJourney: await this.getMenteeLearningJourney(id, context),
        engagementMetrics: await this.getMenteeEngagementMetrics(id, context),
        preferences: await this.getMenteePreferences(id, context)
      };

      RepositoryLogger.logSuccess(operation, this.entityName, id, { 
        hasBookings: (menteeWithDetails.bookings?.length || 0) > 0,
        hasLearningJourney: !!menteeWithDetails.learningJourney
      });

      return menteeWithDetails;

    } catch (error: any) {
      this.handleError(error, operation, id, context);
    }
  }

  /**
   * Update mentee with learning progress tracking
   */
  async updateMenteeSecure(
    id: string,
    data: MenteeUpdateData,
    context?: RepositoryContext
  ): Promise<UpdateResult<EMentee>> {
    const operation = 'updateMenteeSecure';

    try {
      // ✅ VALIDATE UPDATE DATA
      this.validateMenteeUpdateData(data, operation);

      // ✅ GET EXISTING DATA FOR COMPARISON
      const existingMentee = await this.findById(id, { lean: true }, context);
      if (!existingMentee) {
        throw RepositoryErrorFactory.notFoundError(this.entityName, id, operation);
      }

      // ✅ ENHANCE UPDATE DATA WITH ANALYTICS
      const enhancedData = await this.enhanceUpdateWithAnalytics(data, existingMentee, operation, context);

      // ✅ USE ENHANCED BASE UPDATE
      const result = await this.update(id, enhancedData, {
        new: true,
        runValidators: true
      }, context);

      // ✅ POST-UPDATE PROCESSING
      if (result.success && result.data) {
        await this.performPostUpdateAnalytics(result.data, existingMentee, context);
      }

      return result;

    } catch (error: any) {
      this.handleError(error, operation, id, context);
    }
  }

  /**
   * 🔹 LEARNING AND GOAL MANAGEMENT
   */

  /**
   * Add learning goal for mentee
   */
  async addLearningGoal(
    menteeId: string,
    goal: LearningGoal,
    context?: RepositoryContext
  ): Promise<UpdateResult<EMentee>> {
    const operation = 'addLearningGoal';

    try {
      this.validateObjectId(menteeId, operation);
      this.validateLearningGoal(goal, operation);

      RepositoryLogger.logStart(operation, this.entityName, menteeId, { 
        goalTitle: goal.title,
        targetDate: goal.targetDate
      });

      // ✅ UPDATE MENTEE WITH NEW GOAL
      const result = await this.update(menteeId, {
        $push: { 
          'metadata.learningGoals': {
            ...goal,
            id: new Types.ObjectId(),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        },
        updatedAt: new Date()
      }, { new: true }, context);

      RepositoryLogger.logSuccess(operation, this.entityName, menteeId, { goalTitle: goal.title });

      return result;

    } catch (error: any) {
      this.handleError(error, operation, menteeId, context);
    }
  }

  /**
   * Update learning goal progress
   */
  async updateLearningGoalProgress(
    menteeId: string,
    goalId: string,
    progress: number,
    status?: LearningGoalStatus,
    context?: RepositoryContext
  ): Promise<UpdateResult<EMentee>> {
    const operation = 'updateLearningGoalProgress';

    try {
      this.validateObjectId(menteeId, operation);
      this.validateObjectId(goalId, operation);

      if (progress < 0 || progress > 100) {
        throw RepositoryErrorFactory.validationError(
          'Progress must be between 0 and 100',
          operation,
          this.entityName,
          menteeId
        );
      }

      RepositoryLogger.logStart(operation, this.entityName, menteeId, { goalId, progress, status });

      // ✅ UPDATE SPECIFIC GOAL PROGRESS
      const updateData: any = {
        'metadata.learningGoals.$.progress': progress,
        'metadata.learningGoals.$.updatedAt': new Date(),
        updatedAt: new Date()
      };

      if (status) {
        updateData['metadata.learningGoals.$.status'] = status;
        if (status === 'completed') {
          updateData['metadata.learningGoals.$.completedAt'] = new Date();
        }
      }

      const result = await this.updateOne(
        { 
          _id: new Types.ObjectId(menteeId),
          'metadata.learningGoals.id': new Types.ObjectId(goalId)
        },
        { $set: updateData },
        { new: true },
        context
      );

      RepositoryLogger.logSuccess(operation, this.entityName, menteeId, { goalId, progress });

      return result;

    } catch (error: any) {
      this.handleError(error, operation, menteeId, context);
    }
  }

  /**
   * 🔹 ADVANCED MENTEE OPERATIONS
   */

  /**
   * Find mentees with advanced filtering and analytics
   */
  async findMenteesWithFilters(
    filters: MenteeFilters,
    pagination: PaginationParams,
    context?: RepositoryContext
  ): Promise<PaginatedResponse<EMentee>> {
    const operation = 'findMenteesWithFilters';

    try {
      RepositoryLogger.logStart(operation, this.entityName, undefined, { filters, pagination });

      const filter = this.buildMenteeFilterQuery(filters);
      
      const options: FindOptions = {
        populate: [
          {
            path: 'Bookings',
            select: 'mentorId serviceId status scheduledAt rating',
            options: { limit: 5, sort: { scheduledAt: -1 } }
          }
        ],
        sort: this.buildSortQuery(pagination.sortBy, pagination.sortOrder),
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
   * Get comprehensive mentee analytics
   */
  async getMenteeAnalytics(
    context?: RepositoryContext
  ): Promise<MenteeAnalytics> {
    const operation = 'getMenteeAnalytics';

    try {
      RepositoryLogger.logStart(operation, this.entityName, undefined);

      // ✅ PARALLEL ANALYTICS QUERIES
      const [
        totalCount,
        statusDistribution,
        engagementDistribution,
        topJoinPurposes,
        topCareerInterests,
        learningProgress,
        bookingMetrics,
        satisfactionMetrics,
        growthMetrics
      ] = await Promise.all([
        this.getTotalMenteeCount(context),
        this.getMenteeStatusDistribution(context),
        this.getEngagementDistribution(context),
        this.getTopJoinPurposes(context),
        this.getTopCareerInterests(context),
        this.getLearningProgressMetrics(context),
        this.getBookingMetrics(context),
        this.getSatisfactionMetrics(context),
        this.getGrowthMetrics(context)
      ]);

      const analytics: MenteeAnalytics = {
        totalMentees: totalCount,
        activeMentees: statusDistribution.active || 0,
        statusDistribution: statusDistribution,
        engagementDistribution: engagementDistribution,
        topJoinPurposes: topJoinPurposes,
        topCareerInterests: topCareerInterests,
        learningProgress: learningProgress,
        bookingMetrics: bookingMetrics,
        satisfactionMetrics: satisfactionMetrics,
        growthMetrics: growthMetrics
      };

      RepositoryLogger.logSuccess(operation, this.entityName, undefined, { 
        totalMentees: analytics.totalMentees,
        activeMentees: analytics.activeMentees
      });

      return analytics;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Calculate mentee engagement score
   */
  async calculateEngagementScore(
    menteeId: string,
    context?: RepositoryContext
  ): Promise<number> {
    const operation = 'calculateEngagementScore';

    try {
      this.validateObjectId(menteeId, operation);
      RepositoryLogger.logStart(operation, this.entityName, menteeId);

      // ✅ GET ENGAGEMENT FACTORS
      const [
        bookingActivity,
        sessionCompletions,
        profileCompleteness,
        recentActivity,
        goalProgress
      ] = await Promise.all([
        this.getMenteeBookingActivity(menteeId, context),
        this.getMenteeSessionCompletions(menteeId, context),
        this.getMenteeProfileCompleteness(menteeId, context),
        this.getMenteeRecentActivity(menteeId, context),
        this.getMenteeGoalProgress(menteeId, context)
      ]);

      // ✅ CALCULATE WEIGHTED SCORE
      const engagementScore = (
        (bookingActivity * 0.3) +
        (sessionCompletions * 0.25) +
        (profileCompleteness * 0.15) +
        (recentActivity * 0.2) +
        (goalProgress * 0.1)
      );

      // ✅ UPDATE MENTEE WITH CALCULATED SCORE
      await this.update(menteeId, {
        engagementScore: Math.round(engagementScore),
        lastEngagementCalculation: new Date()
      }, { new: true }, context);

      RepositoryLogger.logSuccess(operation, this.entityName, menteeId, { 
        engagementScore: Math.round(engagementScore)
      });

      return Math.round(engagementScore);

    } catch (error: any) {
      this.handleError(error, operation, menteeId, context);
    }
  }

  /**
   * 🔹 VALIDATION METHODS
   */

  /**
   * Validate mentee creation data
   */
  private validateMenteeData(data: MenteeCreateData, operation: string): void {
    const errors: string[] = [];

    // Required fields
    if (!data.joinPurpose || !Array.isArray(data.joinPurpose) || data.joinPurpose.length === 0) {
      errors.push('joinPurpose is required and must be a non-empty array');
    }

    if (!data.careerGoals || data.careerGoals.trim().length === 0) {
      errors.push('careerGoals is required');
    }

    if (!data.interestedNewcareer || !Array.isArray(data.interestedNewcareer) || data.interestedNewcareer.length === 0) {
      errors.push('interestedNewcareer is required and must be a non-empty array');
    }

    // Validate array contents
    if (data.joinPurpose && data.joinPurpose.some(purpose => !purpose.trim())) {
      errors.push('All join purposes must be non-empty strings');
    }

    if (data.interestedNewcareer && data.interestedNewcareer.some(career => !career.trim())) {
      errors.push('All career interests must be non-empty strings');
    }

    // Validate career goals length
    if (data.careerGoals && data.careerGoals.length > 500) {
      errors.push('Career goals must be less than 500 characters');
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
   * Validate mentee update data
   */
  private validateMenteeUpdateData(data: MenteeUpdateData, operation: string): void {
    const errors: string[] = [];

    // Validate arrays if provided
    if (data.joinPurpose !== undefined) {
      if (!Array.isArray(data.joinPurpose) || data.joinPurpose.length === 0) {
        errors.push('joinPurpose must be a non-empty array');
      } else if (data.joinPurpose.some(purpose => !purpose.trim())) {
        errors.push('All join purposes must be non-empty strings');
      }
    }

    if (data.interestedNewcareer !== undefined) {
      if (!Array.isArray(data.interestedNewcareer) || data.interestedNewcareer.length === 0) {
        errors.push('interestedNewcareer must be a non-empty array');
      } else if (data.interestedNewcareer.some(career => !career.trim())) {
        errors.push('All career interests must be non-empty strings');
      }
    }

    // Validate career goals
    if (data.careerGoals !== undefined) {
      if (!data.careerGoals.trim()) {
        errors.push('careerGoals cannot be empty');
      } else if (data.careerGoals.length > 500) {
        errors.push('Career goals must be less than 500 characters');
      }
    }

    // Validate numeric fields
    if (data.profileCompleteness !== undefined) {
      if (typeof data.profileCompleteness !== 'number' || data.profileCompleteness < 0 || data.profileCompleteness > 100) {
        errors.push('profileCompleteness must be a number between 0 and 100');
      }
    }

    if (data.engagementScore !== undefined) {
      if (typeof data.engagementScore !== 'number' || data.engagementScore < 0 || data.engagementScore > 100) {
        errors.push('engagementScore must be a number between 0 and 100');
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

  /**
   * Validate learning goal data
   */
  private validateLearningGoal(goal: LearningGoal, operation: string): void {
    const errors: string[] = [];

    if (!goal.title?.trim()) errors.push('Goal title is required');
    if (!goal.description?.trim()) errors.push('Goal description is required');
    if (!goal.targetDate) errors.push('Target date is required');
    if (goal.targetDate && goal.targetDate <= new Date()) {
      errors.push('Target date must be in the future');
    }
    if (typeof goal.progress !== 'number' || goal.progress < 0 || goal.progress > 100) {
      errors.push('Progress must be a number between 0 and 100');
    }

    if (errors.length > 0) {
      throw RepositoryErrorFactory.validationError(
        `Learning goal validation failed: ${errors.join(', ')}`,
        operation,
        this.entityName,
        undefined,
        { errors, goal }
      );
    }
  }

  /**
   * 🔹 HELPER METHODS
   */

  /**
   * Validate business rules for mentee creation
   */
  private async validateBusinessRules(
    data: MenteeCreateData,
    operation: string,
    context?: RepositoryContext
  ): Promise<void> {
    // No specific business rules for mentee creation currently
    // Could add checks for duplicate mentees, policy compliance, etc.
  }

  /**
   * Enhance mentee data with onboarding information
   */
  private async enhanceWithOnboardingData(
    data: MenteeCreateData,
    operation: string,
    context?: RepositoryContext
  ): Promise<DeepPartial<EMentee>> {
    return {
      ...data,
      status: data.status || 'onboarding',
      isOnline: data.isOnline || false,
      Bookings: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Build filter query for mentee search
   */
  private buildMenteeFilterQuery(filters: MenteeFilters): FilterQuery<EMentee> {
    const query: FilterQuery<EMentee> = {};

    if (filters.joinPurpose) {
      const purposes = Array.isArray(filters.joinPurpose) ? filters.joinPurpose : [filters.joinPurpose];
      query.joinPurpose = { $in: purposes };
    }

    if (filters.interestedNewcareer) {
      const careers = Array.isArray(filters.interestedNewcareer) ? filters.interestedNewcareer : [filters.interestedNewcareer];
      query.interestedNewcareer = { $in: careers };
    }

    if (filters.status) {
      query.status = Array.isArray(filters.status) ? { $in: filters.status } : filters.status;
    }

    if (filters.isOnline !== undefined) {
      query.isOnline = filters.isOnline;
    }

    if (filters.searchTerm) {
      const searchRegex = { $regex: filters.searchTerm, $options: 'i' };
      query.$or = [
        { careerGoals: searchRegex },
        { joinPurpose: searchRegex },
        { interestedNewcareer: searchRegex }
      ];
    }

    if (filters.hasBookings) {
      query.Bookings = { $exists: true, $not: { $size: 0 } };
    }

    if (filters.lastActiveRange) {
      query.lastActiveAt = {
        $gte: filters.lastActiveRange.start,
        $lte: filters.lastActiveRange.end
      };
    }

    return query;
  }

  /**
   * 🔹 ANALYTICS HELPER METHODS (Placeholders)
   */

  private async getMenteeBookings(menteeId: string, context?: RepositoryContext) {
    // Would query booking collection
    return [];
  }

  private async getMenteeLearningJourney(menteeId: string, context?: RepositoryContext) {
    // Would aggregate from bookings and sessions
    return {
      totalSessions: 0,
      completedSessions: 0,
      totalSpent: 0,
      averageSessionRating: 0,
      skills: [],
      achievements: [],
      certificates: []
    };
  }

  private async getMenteeEngagementMetrics(menteeId: string, context?: RepositoryContext) {
    return {
      level: 'medium' as EngagementLevel,
      score: 75,
      lastActiveAt: new Date(),
      sessionFrequency: 2,
      responseRate: 85
    };
  }

  private async getMenteePreferences(menteeId: string, context?: RepositoryContext) {
    return {
      favoriteTopics: [],
      preferredMentors: [],
      communicationStyle: [],
      learningGoals: []
    };
  }

  private async performOnboardingSetup(mentee: EMentee, context?: RepositoryContext): Promise<void> {
    // Setup onboarding tasks, welcome messages, etc.
  }

  private async performPostUpdateAnalytics(
    updatedMentee: EMentee, 
    originalMentee: EMentee, 
    context?: RepositoryContext
  ): Promise<void> {
    // Recalculate analytics if needed
  }

  private async enhanceUpdateWithAnalytics(
    data: MenteeUpdateData,
    existingMentee: EMentee,
    operation: string,
    context?: RepositoryContext
  ): Promise<MenteeUpdateData> {
    return {
      ...data,
      updatedAt: new Date()
    };
  }

  // Analytics helper methods
  private async getTotalMenteeCount(context?: RepositoryContext): Promise<number> {
    return this.count({}, context);
  }

  private async getMenteeStatusDistribution(context?: RepositoryContext): Promise<Record<MenteeStatus, number>> {
    const pipeline = [
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ];
    
    const result = await this.aggregate<{ _id: MenteeStatus; count: number }>(pipeline, context);
    
    const distribution: Record<MenteeStatus, number> = {
      active: 0,
      inactive: 0,
      onboarding: 0,
      churned: 0
    };

    result.data.forEach(item => {
      if (item._id && item._id in distribution) {
        distribution[item._id] = item.count;
      }
    });

    return distribution;
  }

  private async getEngagementDistribution(context?: RepositoryContext): Promise<Record<EngagementLevel, number>> {
    // Placeholder - would calculate based on engagement scores
    return {
      high: 0,
      medium: 0,
      low: 0,
      inactive: 0
    };
  }

  private async getTopJoinPurposes(context?: RepositoryContext) {
    const pipeline = [
      { $unwind: '$joinPurpose' },
      { $group: { _id: '$joinPurpose', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ];

    const result = await this.aggregate<{ _id: string; count: number }>(pipeline, context);
    
    return result.data.map(item => ({
      purpose: item._id,
      menteeCount: item.count
    }));
  }

  private async getTopCareerInterests(context?: RepositoryContext) {
    const pipeline = [
      { $unwind: '$interestedNewcareer' },
      { $group: { _id: '$interestedNewcareer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ];

    const result = await this.aggregate<{ _id: string; count: number }>(pipeline, context);
    
    return result.data.map(item => ({
      career: item._id,
      menteeCount: item.count
    }));
  }

  private async getLearningProgressMetrics(context?: RepositoryContext) {
    return {
      averageProgress: 65,
      completionRate: 78,
      dropoutRate: 12
    };
  }

  private async getBookingMetrics(context?: RepositoryContext) {
    return {
      totalBookings: 0,
      averageBookingsPerMentee: 0,
      completionRate: 0,
      cancellationRate: 0
    };
  }

  private async getSatisfactionMetrics(context?: RepositoryContext) {
    return {
      averageRating: 0,
      recommendationRate: 0,
      repeatBookingRate: 0
    };
  }

  private async getGrowthMetrics(context?: RepositoryContext) {
    return {
      newMenteesThisMonth: 0,
      churnRate: 0,
      reactivationRate: 0
    };
  }

  // Engagement calculation helpers
  private async getMenteeBookingActivity(menteeId: string, context?: RepositoryContext): Promise<number> {
    return 75; // Placeholder
  }

  private async getMenteeSessionCompletions(menteeId: string, context?: RepositoryContext): Promise<number> {
    return 80; // Placeholder
  }

  private async getMenteeProfileCompleteness(menteeId: string, context?: RepositoryContext): Promise<number> {
    return 90; // Placeholder
  }

  private async getMenteeRecentActivity(menteeId: string, context?: RepositoryContext): Promise<number> {
    return 60; // Placeholder
  }

  private async getMenteeGoalProgress(menteeId: string, context?: RepositoryContext): Promise<number> {
    return 70; // Placeholder
  }

  /**
   * 🔹 LEGACY METHODS (for backward compatibility)
   */

  // ❌ DEPRECATED - Use createMenteeSecure instead
  async createMentee(data: {
    joinPurpose: string[];
    careerGoals: string;
    interestedNewcareer: string[];
  }): Promise<EMentee> {
    console.warn('⚠️ MenteeRepository.createMentee() is deprecated. Use createMenteeSecure() instead.');
    const result = await this.createMenteeSecure(data);
    if (!result.success) {
      throw new Error('Failed to create mentee');
    }
    return result.data;
  }

  // ❌ DEPRECATED - Use findMenteeWithDetails instead
  async getMentee(id: string): Promise<EMentee | null> {
    console.warn('⚠️ MenteeRepository.getMentee() is deprecated. Use findMenteeWithDetails() instead.');
    return this.findById(id);
  }

  // ❌ DEPRECATED - Use createMenteeSecure instead
  async create(data: DeepPartial<EMentee>, context?: RepositoryContext): Promise<CreateResult<EMentee>> {
    console.warn('⚠️ MenteeRepository.create() is deprecated. Use createMenteeSecure() instead.');
    return super.create(data, context);
  }
}

// Re-export for use by other modules
export type {
  MenteeCreateData,
  MenteeUpdateData,
  MenteeFilters,
  MenteeAnalytics,
  MenteeWithDetails,
  LearningGoal,
  BookingCreateData,
  MenteeStatus,
  LearningGoalStatus,
  EngagementLevel
};