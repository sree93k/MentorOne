/**
 * 🔹 PHASE 3 MIGRATION: Modern Mentor Repository
 * Type-safe, comprehensive mentor management with profile analytics and service integration
 */

import { injectable } from "inversify";
import { Types, FilterQuery } from "mongoose";
import { EMentor } from "../../entities/mentorEntity";
import { EService } from "../../entities/serviceEntity";
import { IMentorRepository } from "../interface/IMentorRepository";
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
import Mentor from "../../models/mentorModel";
import Service from "../../models/serviceModel";
import OnlineService from "../../models/onlineServiceModel";
import DigitalProduct from "../../models/digitalProductsModel";

/**
 * 🔹 MENTOR-SPECIFIC TYPES
 */
type MentorStatus = "pending" | "approved" | "rejected" | "suspended";
type ServiceType = "online" | "offline" | "digital" | "tutorial";
type ExperienceLevel = "junior" | "mid" | "senior" | "expert" | "thought_leader";

interface MentorCreateData {
  bio?: string;
  skills?: string[];
  selfIntro?: string;
  shortIntro?: string;
  displayName?: string;
  achievements?: string;
  linkedinURL?: string;
  youtubeURL?: string;
  portfolio?: string;
  mentorMotivation?: string;
  interestedNewCareer?: string[];
  featuredArticle?: string;
  totalExperience?: string;
  isApproved?: MentorStatus;
  approvalReason?: string;
  isBlocked?: boolean;
  mentorPolicyId?: string;
  metadata?: {
    profileCompleteness?: number;
    verificationStatus?: string;
    lastActiveAt?: Date;
    specializations?: string[];
    languages?: string[];
    timezone?: string;
    hourlyRate?: {
      min: number;
      max: number;
      currency: string;
    };
    responseTime?: string;
    availability?: {
      weekdays: string[];
      timeSlots: string[];
    };
  };
}

interface MentorUpdateData {
  bio?: string;
  skills?: string[];
  selfIntro?: string;
  shortIntro?: string;
  displayName?: string;
  achievements?: string;
  linkedinURL?: string;
  youtubeURL?: string;
  portfolio?: string;
  mentorMotivation?: string;
  interestedNewCareer?: string[];
  featuredArticle?: string;
  totalExperience?: string;
  isApproved?: MentorStatus;
  approvalReason?: string;
  isBlocked?: boolean;
  isOnline?: boolean;
  lastActiveAt?: Date;
  profileCompleteness?: number;
}

interface MentorFilters {
  skills?: string | string[];
  isApproved?: MentorStatus | MentorStatus[];
  isBlocked?: boolean;
  isOnline?: boolean;
  experienceLevel?: ExperienceLevel[];
  specializations?: string[];
  languages?: string[];
  hourlyRateRange?: {
    min: number;
    max: number;
  };
  availability?: {
    weekdays?: string[];
    timeSlots?: string[];
  };
  location?: {
    city?: string;
    country?: string;
    timezone?: string;
  };
  rating?: {
    min: number;
    max?: number;
  };
  searchTerm?: string;
  hasServices?: boolean;
  lastActiveRange?: {
    start: Date;
    end: Date;
  };
}

interface MentorAnalytics {
  totalMentors: number;
  activeMentors: number;
  approvalStatusDistribution: Record<MentorStatus, number>;
  topSkills: Array<{
    skill: string;
    mentorCount: number;
  }>;
  experienceDistribution: Record<ExperienceLevel, number>;
  geographicDistribution: Array<{
    country: string;
    mentorCount: number;
  }>;
  serviceTypeDistribution: Record<ServiceType, number>;
  averageProfileCompleteness: number;
  topPerformingMentors: Array<{
    mentorId: string;
    mentorName: string;
    rating: number;
    sessionsCompleted: number;
    revenue: number;
  }>;
  engagementMetrics: {
    averageResponseTime: number;
    averageSessionDuration: number;
    mentorRetentionRate: number;
    clientSatisfactionScore: number;
  };
}

interface MentorWithDetails extends EMentor {
  services?: EService[];
  statistics?: {
    totalSessions: number;
    averageRating: number;
    responseRate: number;
    completionRate: number;
    totalRevenue: number;
    followerCount: number;
  };
  recentActivity?: Array<{
    type: string;
    description: string;
    timestamp: Date;
  }>;
  profileMetrics?: {
    profileViews: number;
    bookingConversionRate: number;
    repeatClientRate: number;
  };
}

interface ServiceCreateData {
  title: string;
  type: ServiceType;
  description: string;
  price: number;
  duration?: number;
  category: string;
  mentorId: string;
  isActive?: boolean;
  metadata?: {
    maxParticipants?: number;
    prerequisites?: string[];
    deliverables?: string[];
    refundPolicy?: string;
  };
}

interface OnlineServiceData {
  serviceId: string;
  meetingLink?: string;
  platform?: string;
  accessInstructions?: string;
  recordingPolicy?: string;
  techRequirements?: string[];
}

interface DigitalProductData {
  title: string;
  description: string;
  price: number;
  type: "ebook" | "course" | "template" | "toolkit";
  downloadUrl?: string;
  previewUrl?: string;
  fileSize?: number;
  format?: string;
  mentorId: string;
}

/**
 * 🔹 MODERN MENTOR REPOSITORY
 * Industry-standard mentor management with comprehensive analytics and service integration
 */
@injectable()
export default class ModernMentorRepository 
  extends EnhancedBaseRepository<EMentor>
  implements IMentorRepository {

  constructor() {
    super(Mentor);
  }

  /**
   * 🔹 MENTOR-SPECIFIC CRUD OPERATIONS
   */

  /**
   * Create a new mentor with comprehensive validation
   */
  async createMentorSecure(
    data: MentorCreateData,
    context?: RepositoryContext
  ): Promise<CreateResult<EMentor>> {
    const operation = 'createMentorSecure';

    try {
      // ✅ TYPE-SAFE VALIDATION
      this.validateMentorData(data, operation);

      // ✅ BUSINESS RULE VALIDATION
      await this.validateBusinessRules(data, operation, context);

      // ✅ ENHANCE WITH COMPUTED FIELDS
      const enhancedData = await this.enhanceWithComputedFields(data, operation, context);

      // ✅ USE ENHANCED BASE CREATE
      const result = await this.create(enhancedData, context);

      // ✅ POST-CREATION SETUP
      if (result.success && result.data) {
        await this.performPostCreationSetup(result.data, context);
      }

      return result;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Find mentor by ID with full details and analytics
   */
  async findMentorWithDetails(
    id: string,
    context?: RepositoryContext
  ): Promise<MentorWithDetails | null> {
    const operation = 'findMentorWithDetails';

    try {
      this.validateObjectId(id, operation);
      RepositoryLogger.logStart(operation, this.entityName, id);

      // ✅ GET BASE MENTOR DATA
      const mentor = await this.findById(id, {
        populate: [
          {
            path: 'services',
            select: 'title type price category isActive'
          },
          {
            path: 'schedules',
            select: 'availableSlots timezone'
          },
          {
            path: 'topTestimonials',
            select: 'rating comment menteeId'
          }
        ],
        lean: true
      }, context);

      if (!mentor) {
        return null;
      }

      // ✅ ENHANCE WITH ANALYTICS DATA
      const mentorWithDetails: MentorWithDetails = {
        ...mentor,
        services: await this.getMentorServices(id, context),
        statistics: await this.getMentorStatistics(id, context),
        recentActivity: await this.getMentorRecentActivity(id, context),
        profileMetrics: await this.getMentorProfileMetrics(id, context)
      };

      RepositoryLogger.logSuccess(operation, this.entityName, id, { 
        hasServices: (mentorWithDetails.services?.length || 0) > 0,
        hasStatistics: !!mentorWithDetails.statistics
      });

      return mentorWithDetails;

    } catch (error: any) {
      this.handleError(error, operation, id, context);
    }
  }

  /**
   * Update mentor with comprehensive validation and analytics recalculation
   */
  async updateMentorSecure(
    id: string,
    data: MentorUpdateData,
    context?: RepositoryContext
  ): Promise<UpdateResult<EMentor>> {
    const operation = 'updateMentorSecure';

    try {
      // ✅ VALIDATE UPDATE DATA
      this.validateMentorUpdateData(data, operation);

      // ✅ GET EXISTING DATA FOR COMPARISON
      const existingMentor = await this.findById(id, { lean: true }, context);
      if (!existingMentor) {
        throw RepositoryErrorFactory.notFoundError(this.entityName, id, operation);
      }

      // ✅ ENHANCE UPDATE DATA
      const enhancedData = await this.enhanceUpdateData(data, existingMentor, operation, context);

      // ✅ USE ENHANCED BASE UPDATE
      const result = await this.update(id, enhancedData, {
        new: true,
        runValidators: true
      }, context);

      // ✅ POST-UPDATE PROCESSING
      if (result.success && result.data) {
        await this.performPostUpdateProcessing(result.data, existingMentor, context);
      }

      return result;

    } catch (error: any) {
      this.handleError(error, operation, id, context);
    }
  }

  /**
   * 🔹 MENTOR SERVICE OPERATIONS
   */

  /**
   * Create service for mentor with validation
   */
  async createServiceSecure(
    data: ServiceCreateData,
    context?: RepositoryContext
  ): Promise<CreateResult<EService>> {
    const operation = 'createServiceSecure';

    try {
      // ✅ VALIDATE SERVICE DATA
      this.validateServiceData(data, operation);

      // ✅ VERIFY MENTOR EXISTS
      const mentor = await this.findById(data.mentorId, { lean: true }, context);
      if (!mentor) {
        throw RepositoryErrorFactory.notFoundError('Mentor', data.mentorId, operation);
      }

      // ✅ CREATE SERVICE
      RepositoryLogger.logStart(operation, 'Service', undefined, { mentorId: data.mentorId, type: data.type });

      const service = new Service({
        ...data,
        mentorId: new Types.ObjectId(data.mentorId),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const savedService = await service.save();

      // ✅ UPDATE MENTOR'S SERVICES ARRAY
      await this.update(data.mentorId, {
        $addToSet: { services: savedService._id }
      }, { new: true }, context);

      RepositoryLogger.logSuccess(operation, 'Service', savedService._id.toString(), { 
        mentorId: data.mentorId,
        serviceType: data.type
      });

      return {
        success: true,
        data: savedService as EService,
        message: 'Service created successfully'
      };

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Create online service with platform integration
   */
  async createOnlineServiceSecure(
    data: OnlineServiceData,
    context?: RepositoryContext
  ): Promise<CreateResult<string>> {
    const operation = 'createOnlineServiceSecure';

    try {
      // ✅ VALIDATE SERVICE EXISTS
      const service = await Service.findById(data.serviceId);
      if (!service) {
        throw RepositoryErrorFactory.notFoundError('Service', data.serviceId, operation);
      }

      RepositoryLogger.logStart(operation, 'OnlineService', undefined, { serviceId: data.serviceId });

      // ✅ CREATE ONLINE SERVICE
      const onlineService = new OnlineService({
        ...data,
        serviceId: new Types.ObjectId(data.serviceId),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const savedOnlineService = await onlineService.save();

      RepositoryLogger.logSuccess(operation, 'OnlineService', savedOnlineService._id.toString());

      return {
        success: true,
        data: savedOnlineService._id.toString(),
        message: 'Online service created successfully'
      };

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Create digital product for mentor
   */
  async createDigitalProductSecure(
    data: DigitalProductData,
    context?: RepositoryContext
  ): Promise<CreateResult<string>> {
    const operation = 'createDigitalProductSecure';

    try {
      // ✅ VALIDATE MENTOR EXISTS
      const mentor = await this.findById(data.mentorId, { lean: true }, context);
      if (!mentor) {
        throw RepositoryErrorFactory.notFoundError('Mentor', data.mentorId, operation);
      }

      // ✅ VALIDATE DIGITAL PRODUCT DATA
      this.validateDigitalProductData(data, operation);

      RepositoryLogger.logStart(operation, 'DigitalProduct', undefined, { 
        mentorId: data.mentorId, 
        type: data.type 
      });

      // ✅ CREATE DIGITAL PRODUCT
      const digitalProduct = new DigitalProduct({
        ...data,
        mentorId: new Types.ObjectId(data.mentorId),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const savedDigitalProduct = await digitalProduct.save();

      RepositoryLogger.logSuccess(operation, 'DigitalProduct', savedDigitalProduct._id.toString());

      return {
        success: true,
        data: savedDigitalProduct._id.toString(),
        message: 'Digital product created successfully'
      };

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * 🔹 ADVANCED MENTOR OPERATIONS
   */

  /**
   * Find mentors with advanced filtering and search
   */
  async findMentorsWithFilters(
    filters: MentorFilters,
    pagination: PaginationParams,
    context?: RepositoryContext
  ): Promise<PaginatedResponse<EMentor>> {
    const operation = 'findMentorsWithFilters';

    try {
      RepositoryLogger.logStart(operation, this.entityName, undefined, { filters, pagination });

      const filter = this.buildMentorFilterQuery(filters);
      
      const options: FindOptions = {
        populate: [
          {
            path: 'services',
            select: 'title type price category rating'
          },
          {
            path: 'topTestimonials',
            select: 'rating comment',
            options: { limit: 3 }
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
   * Get comprehensive mentor analytics
   */
  async getMentorAnalytics(
    context?: RepositoryContext
  ): Promise<MentorAnalytics> {
    const operation = 'getMentorAnalytics';

    try {
      RepositoryLogger.logStart(operation, this.entityName, undefined);

      // ✅ PARALLEL ANALYTICS QUERIES
      const [
        totalCount,
        statusDistribution,
        topSkills,
        experienceDistribution,
        geographicDistribution,
        serviceTypeDistribution,
        avgProfileCompleteness,
        topPerformers,
        engagementMetrics
      ] = await Promise.all([
        this.getTotalMentorCount(context),
        this.getApprovalStatusDistribution(context),
        this.getTopSkills(context),
        this.getExperienceDistribution(context),
        this.getGeographicDistribution(context),
        this.getServiceTypeDistribution(context),
        this.getAverageProfileCompleteness(context),
        this.getTopPerformingMentors(context),
        this.getEngagementMetrics(context)
      ]);

      const analytics: MentorAnalytics = {
        totalMentors: totalCount,
        activeMentors: statusDistribution.approved || 0,
        approvalStatusDistribution: statusDistribution,
        topSkills: topSkills,
        experienceDistribution: experienceDistribution,
        geographicDistribution: geographicDistribution,
        serviceTypeDistribution: serviceTypeDistribution,
        averageProfileCompleteness: avgProfileCompleteness,
        topPerformingMentors: topPerformers,
        engagementMetrics: engagementMetrics
      };

      RepositoryLogger.logSuccess(operation, this.entityName, undefined, { 
        totalMentors: analytics.totalMentors,
        activeMentors: analytics.activeMentors
      });

      return analytics;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Update mentor field (approval status, blocking, etc.)
   */
  async updateMentorField(
    id: string,
    field: string,
    value: any,
    reason?: string,
    context?: RepositoryContext
  ): Promise<UpdateResult<EMentor>> {
    const operation = 'updateMentorField';

    try {
      this.validateObjectId(id, operation);
      RepositoryLogger.logStart(operation, this.entityName, id, { field, value, reason });

      // ✅ BUILD UPDATE DATA
      const updateData: Record<string, any> = { [field]: value };
      if (reason && field === 'isApproved') {
        updateData.approvalReason = reason;
      }
      updateData.updatedAt = new Date();

      // ✅ USE ENHANCED BASE UPDATE
      const result = await this.update(id, updateData, {
        new: true,
        runValidators: true
      }, context);

      // ✅ TRIGGER FIELD-SPECIFIC PROCESSING
      if (result.success && result.data) {
        await this.handleFieldUpdate(result.data, field, value, reason, context);
      }

      RepositoryLogger.logSuccess(operation, this.entityName, id, { field, value });

      return result;

    } catch (error: any) {
      this.handleError(error, operation, id, context);
    }
  }

  /**
   * 🔹 VALIDATION METHODS
   */

  /**
   * Validate mentor creation data
   */
  private validateMentorData(data: MentorCreateData, operation: string): void {
    const errors: string[] = [];

    // Basic validations
    if (data.displayName && data.displayName.trim().length < 2) {
      errors.push('Display name must be at least 2 characters');
    }

    if (data.skills && (!Array.isArray(data.skills) || data.skills.length === 0)) {
      errors.push('Skills must be a non-empty array');
    }

    if (data.linkedinURL && !this.isValidUrl(data.linkedinURL)) {
      errors.push('Invalid LinkedIn URL format');
    }

    if (data.youtubeURL && !this.isValidUrl(data.youtubeURL)) {
      errors.push('Invalid YouTube URL format');
    }

    if (data.portfolio && !this.isValidUrl(data.portfolio)) {
      errors.push('Invalid portfolio URL format');
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
   * Validate mentor update data
   */
  private validateMentorUpdateData(data: MentorUpdateData, operation: string): void {
    const errors: string[] = [];

    // Similar validations as create but for updates
    if (data.displayName !== undefined && data.displayName.trim().length < 2) {
      errors.push('Display name must be at least 2 characters');
    }

    if (data.skills !== undefined && (!Array.isArray(data.skills) || data.skills.length === 0)) {
      errors.push('Skills must be a non-empty array');
    }

    if (data.linkedinURL !== undefined && data.linkedinURL && !this.isValidUrl(data.linkedinURL)) {
      errors.push('Invalid LinkedIn URL format');
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
   * Validate service creation data
   */
  private validateServiceData(data: ServiceCreateData, operation: string): void {
    const errors: string[] = [];

    if (!data.title?.trim()) errors.push('Service title is required');
    if (!data.description?.trim()) errors.push('Service description is required');
    if (!data.type) errors.push('Service type is required');
    if (!data.category?.trim()) errors.push('Service category is required');
    if (typeof data.price !== 'number' || data.price < 0) {
      errors.push('Service price must be a non-negative number');
    }

    if (errors.length > 0) {
      throw RepositoryErrorFactory.validationError(
        `Service validation failed: ${errors.join(', ')}`,
        operation,
        'Service',
        undefined,
        { errors, data }
      );
    }
  }

  /**
   * Validate digital product data
   */
  private validateDigitalProductData(data: DigitalProductData, operation: string): void {
    const errors: string[] = [];

    if (!data.title?.trim()) errors.push('Product title is required');
    if (!data.description?.trim()) errors.push('Product description is required');
    if (!data.type) errors.push('Product type is required');
    if (typeof data.price !== 'number' || data.price < 0) {
      errors.push('Product price must be a non-negative number');
    }

    if (errors.length > 0) {
      throw RepositoryErrorFactory.validationError(
        `Digital product validation failed: ${errors.join(', ')}`,
        operation,
        'DigitalProduct',
        undefined,
        { errors, data }
      );
    }
  }

  /**
   * 🔹 HELPER METHODS
   */

  /**
   * Validate business rules for mentor creation
   */
  private async validateBusinessRules(
    data: MentorCreateData,
    operation: string,
    context?: RepositoryContext
  ): Promise<void> {
    // No specific business rules for mentor creation currently
    // Could add checks for uniqueness, policy compliance, etc.
  }

  /**
   * Enhance mentor data with computed fields
   */
  private async enhanceWithComputedFields(
    data: MentorCreateData,
    operation: string,
    context?: RepositoryContext
  ): Promise<DeepPartial<EMentor>> {
    return {
      ...data,
      isApproved: data.isApproved || 'pending',
      isBlocked: data.isBlocked || false,
      isOnline: false,
      services: [],
      schedules: [],
      followers: [],
      topTestimonials: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Build filter query for mentor search
   */
  private buildMentorFilterQuery(filters: MentorFilters): FilterQuery<EMentor> {
    const query: FilterQuery<EMentor> = {};

    if (filters.skills) {
      const skills = Array.isArray(filters.skills) ? filters.skills : [filters.skills];
      query.skills = { $in: skills };
    }

    if (filters.isApproved) {
      query.isApproved = Array.isArray(filters.isApproved) ? 
        { $in: filters.isApproved } : filters.isApproved;
    }

    if (filters.isBlocked !== undefined) {
      query.isBlocked = filters.isBlocked;
    }

    if (filters.isOnline !== undefined) {
      query.isOnline = filters.isOnline;
    }

    if (filters.searchTerm) {
      const searchRegex = { $regex: filters.searchTerm, $options: 'i' };
      query.$or = [
        { displayName: searchRegex },
        { bio: searchRegex },
        { skills: searchRegex }
      ];
    }

    if (filters.hasServices) {
      query.services = { $exists: true, $not: { $size: 0 } };
    }

    return query;
  }

  /**
   * 🔹 ANALYTICS HELPER METHODS (Placeholders)
   */

  private async getMentorServices(mentorId: string, context?: RepositoryContext): Promise<EService[]> {
    return [];
  }

  private async getMentorStatistics(mentorId: string, context?: RepositoryContext) {
    return {
      totalSessions: 0,
      averageRating: 0,
      responseRate: 0,
      completionRate: 0,
      totalRevenue: 0,
      followerCount: 0
    };
  }

  private async getMentorRecentActivity(mentorId: string, context?: RepositoryContext) {
    return [];
  }

  private async getMentorProfileMetrics(mentorId: string, context?: RepositoryContext) {
    return {
      profileViews: 0,
      bookingConversionRate: 0,
      repeatClientRate: 0
    };
  }

  private async performPostCreationSetup(mentor: EMentor, context?: RepositoryContext): Promise<void> {
    // Setup default mentor configurations
  }

  private async performPostUpdateProcessing(
    updatedMentor: EMentor, 
    originalMentor: EMentor, 
    context?: RepositoryContext
  ): Promise<void> {
    // Handle update-specific processing
  }

  private async enhanceUpdateData(
    data: MentorUpdateData,
    existingMentor: EMentor,
    operation: string,
    context?: RepositoryContext
  ): Promise<MentorUpdateData> {
    return {
      ...data,
      updatedAt: new Date()
    };
  }

  private async handleFieldUpdate(
    mentor: EMentor,
    field: string,
    value: any,
    reason?: string,
    context?: RepositoryContext
  ): Promise<void> {
    // Handle field-specific updates (notifications, etc.)
  }

  private async getTotalMentorCount(context?: RepositoryContext): Promise<number> {
    return this.count({}, context);
  }

  private async getApprovalStatusDistribution(context?: RepositoryContext): Promise<Record<MentorStatus, number>> {
    const pipeline = [
      { $group: { _id: '$isApproved', count: { $sum: 1 } } }
    ];
    
    const result = await this.aggregate<{ _id: MentorStatus; count: number }>(pipeline, context);
    
    const distribution: Record<MentorStatus, number> = {
      pending: 0,
      approved: 0,
      rejected: 0,
      suspended: 0
    };

    result.data.forEach(item => {
      if (item._id && item._id in distribution) {
        distribution[item._id] = item.count;
      }
    });

    return distribution;
  }

  private async getTopSkills(context?: RepositoryContext) {
    const pipeline = [
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ];

    const result = await this.aggregate<{ _id: string; count: number }>(pipeline, context);
    
    return result.data.map(item => ({
      skill: item._id,
      mentorCount: item.count
    }));
  }

  private async getExperienceDistribution(context?: RepositoryContext): Promise<Record<ExperienceLevel, number>> {
    // Placeholder - would need experience level field in mentor model
    return {
      junior: 0,
      mid: 0,
      senior: 0,
      expert: 0,
      thought_leader: 0
    };
  }

  private async getGeographicDistribution(context?: RepositoryContext) {
    // Placeholder - would need location data in mentor model
    return [];
  }

  private async getServiceTypeDistribution(context?: RepositoryContext): Promise<Record<ServiceType, number>> {
    // Placeholder - would aggregate from services
    return {
      online: 0,
      offline: 0,
      digital: 0,
      tutorial: 0
    };
  }

  private async getAverageProfileCompleteness(context?: RepositoryContext): Promise<number> {
    // Placeholder - would calculate based on filled fields
    return 75;
  }

  private async getTopPerformingMentors(context?: RepositoryContext) {
    // Placeholder - would aggregate from bookings and testimonials
    return [];
  }

  private async getEngagementMetrics(context?: RepositoryContext) {
    // Placeholder - would calculate from various metrics
    return {
      averageResponseTime: 0,
      averageSessionDuration: 0,
      mentorRetentionRate: 0,
      clientSatisfactionScore: 0
    };
  }

  /**
   * 🔹 LEGACY METHODS (for backward compatibility)
   */

  // ❌ DEPRECATED - Use createMentorSecure instead
  async createMentor(mentorData: EMentor): Promise<EMentor | null> {
    console.warn('⚠️ MentorRepository.createMentor() is deprecated. Use createMentorSecure() instead.');
    const result = await this.createMentorSecure(mentorData);
    return result.success ? result.data : null;
  }

  // ❌ DEPRECATED - Use findMentorWithDetails instead
  async getMentor(id: string): Promise<EMentor | null> {
    console.warn('⚠️ MentorRepository.getMentor() is deprecated. Use findMentorWithDetails() instead.');
    return this.findById(id);
  }

  // ❌ DEPRECATED - Use updateMentorField instead
  async updateField(id: string, field: string, status: string, reason: string = ""): Promise<EMentor | null> {
    console.warn('⚠️ MentorRepository.updateField() is deprecated. Use updateMentorField() instead.');
    const result = await this.updateMentorField(id, field, status, reason);
    return result.success ? result.data : null;
  }

  // ❌ DEPRECATED - Use createServiceSecure instead
  async createService(service: Partial<EService>): Promise<EService | null> {
    console.warn('⚠️ MentorRepository.createService() is deprecated. Use createServiceSecure() instead.');
    if (!service.mentorId) {
      throw new Error('mentorId is required for service creation');
    }
    const result = await this.createServiceSecure(service as ServiceCreateData);
    return result.success ? result.data : null;
  }

  // ❌ DEPRECATED - Use createOnlineServiceSecure instead
  async createOnlineService(onlineService: Record<string, any>): Promise<string> {
    console.warn('⚠️ MentorRepository.createOnlineService() is deprecated. Use createOnlineServiceSecure() instead.');
    const result = await this.createOnlineServiceSecure(onlineService as OnlineServiceData);
    if (!result.success) {
      throw new Error('Failed to create online service');
    }
    return result.data;
  }

  // ❌ DEPRECATED - Use createDigitalProductSecure instead
  async createDigitalProduct(digitalProduct: Record<string, any>): Promise<string> {
    console.warn('⚠️ MentorRepository.createDigitalProduct() is deprecated. Use createDigitalProductSecure() instead.');
    const result = await this.createDigitalProductSecure(digitalProduct as DigitalProductData);
    if (!result.success) {
      throw new Error('Failed to create digital product');
    }
    return result.data;
  }

  // ❌ DEPRECATED - Use updateMentorSecure instead
  async update(id: string, data: any): Promise<EMentor> {
    console.warn('⚠️ MentorRepository.update() is deprecated. Use updateMentorSecure() instead.');
    const result = await this.updateMentorSecure(id, data);
    if (!result.success) {
      throw new Error('Failed to update mentor');
    }
    return result.data;
  }

  // ❌ DEPRECATED - Use deleteById from base repository
  async deleteMentor(id: string): Promise<void> {
    console.warn('⚠️ MentorRepository.deleteMentor() is deprecated. Use deleteById() instead.');
    const result = await this.deleteById(id);
    if (!result.success) {
      throw new Error('Failed to delete mentor');
    }
  }

  // ❌ DEPRECATED - Use createMentorSecure instead
  async create(data: DeepPartial<EMentor>, context?: RepositoryContext): Promise<CreateResult<EMentor>> {
    console.warn('⚠️ MentorRepository.create() is deprecated. Use createMentorSecure() instead.');
    return super.create(data, context);
  }
}

// Re-export for use by other modules
export type {
  MentorCreateData,
  MentorUpdateData,
  MentorFilters,
  MentorAnalytics,
  MentorWithDetails,
  ServiceCreateData,
  OnlineServiceData,
  DigitalProductData,
  MentorStatus,
  ServiceType,
  ExperienceLevel
};