/**
 * 🔹 PHASE 3 MIGRATION: Modern Schedule Repository
 * Type-safe, comprehensive schedule management with calendar integration and advanced scheduling
 */

import { injectable } from "inversify";
import { Types, FilterQuery } from "mongoose";
import { ESchedule, DaySchedule, Slot } from "../../entities/scheduleEntity";
import { IScheduleRepository, ScheduleData } from "../interface/IScheduleRepository";
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
import Schedule from "../../models/scheduleModel";

/**
 * 🔹 SCHEDULE-SPECIFIC TYPES
 */
type DayOfWeek = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
type ScheduleStatus = "active" | "inactive" | "draft" | "archived";
type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "custom";
type ScheduleTemplate = "standard" | "flexible" | "peak_hours" | "custom";

interface ScheduleCreateData {
  mentorId: string;
  scheduleName: string;
  weeklySchedule: DaySchedule[];
  status?: ScheduleStatus;
  template?: ScheduleTemplate;
  timezone?: string;
  effectiveFrom?: Date;
  effectiveUntil?: Date;
  recurrence?: {
    type: RecurrenceType;
    interval: number;
    endDate?: Date;
  };
  metadata?: {
    bufferTime?: number; // minutes between sessions
    maxSessionsPerDay?: number;
    minBreakBetweenSessions?: number;
    autoBreaks?: boolean;
    holidayHandling?: "block" | "skip" | "reschedule";
    notifications?: {
      reminderMinutes?: number[];
      enableEmailReminders?: boolean;
      enableSMSReminders?: boolean;
    };
  };
}

interface ScheduleUpdateData {
  scheduleName?: string;
  weeklySchedule?: DaySchedule[];
  status?: ScheduleStatus;
  template?: ScheduleTemplate;
  timezone?: string;
  effectiveFrom?: Date;
  effectiveUntil?: Date;
  recurrence?: {
    type: RecurrenceType;
    interval: number;
    endDate?: Date;
  };
  bufferTime?: number;
  maxSessionsPerDay?: number;
  minBreakBetweenSessions?: number;
  autoBreaks?: boolean;
}

interface ScheduleFilters {
  mentorId?: string;
  status?: ScheduleStatus | ScheduleStatus[];
  template?: ScheduleTemplate[];
  effectiveDateRange?: {
    start: Date;
    end: Date;
  };
  hasAvailableSlots?: boolean;
  dayOfWeek?: DayOfWeek[];
  timeRange?: {
    startTime: string;
    endTime: string;
  };
  searchTerm?: string;
}

interface ScheduleWithAvailability extends ESchedule {
  availabilityStats?: {
    totalSlots: number;
    availableSlots: number;
    bookedSlots: number;
    utilizationRate: number;
    peakHours: Array<{
      hour: number;
      utilization: number;
    }>;
  };
  conflictAnalysis?: {
    hasConflicts: boolean;
    conflictCount: number;
    conflictTypes: string[];
  };
  optimizationSuggestions?: Array<{
    type: string;
    description: string;
    impact: "low" | "medium" | "high";
    effort: "easy" | "moderate" | "complex";
  }>;
}

interface ScheduleAnalytics {
  totalSchedules: number;
  activeSchedules: number;
  statusDistribution: Record<ScheduleStatus, number>;
  templateUsage: Record<ScheduleTemplate, number>;
  utilizationMetrics: {
    averageUtilization: number;
    peakUtilizationHour: number;
    lowUtilizationHour: number;
    weekdayVsWeekendRatio: number;
  };
  availabilityTrends: Array<{
    date: Date;
    totalAvailableHours: number;
    bookedHours: number;
    utilizationRate: number;
  }>;
  mentorScheduleStats: {
    mentorsWithSchedules: number;
    averageSchedulesPerMentor: number;
    mostActiveTimeSlots: Array<{
      timeSlot: string;
      mentorCount: number;
    }>;
  };
  optimizationOpportunities: Array<{
    mentorId: string;
    mentorName?: string;
    currentUtilization: number;
    potentialImprovement: number;
    suggestions: string[];
  }>;
}

interface ScheduleConflict {
  conflictId: string;
  type: "overlap" | "gap" | "overutilization" | "underutilization";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  affectedSlots: Array<{
    day: DayOfWeek;
    startTime: string;
    endTime: string;
  }>;
  resolution: {
    automatic: boolean;
    suggestions: string[];
    requiredAction?: string;
  };
}

interface CalendarIntegration {
  provider: "google" | "outlook" | "apple" | "ical";
  syncEnabled: boolean;
  lastSync?: Date;
  syncErrors?: string[];
  externalCalendarId?: string;
  bidirectionalSync?: boolean;
}

/**
 * 🔹 MODERN SCHEDULE REPOSITORY
 * Industry-standard schedule management with calendar integration and advanced scheduling features
 */
@injectable()
export default class ModernScheduleRepository 
  extends EnhancedBaseRepository<ESchedule>
  implements IScheduleRepository {

  constructor() {
    super(Schedule);
  }

  /**
   * 🔹 SCHEDULE-SPECIFIC CRUD OPERATIONS
   */

  /**
   * Create schedule with comprehensive validation and optimization
   */
  async createScheduleSecure(
    data: ScheduleCreateData,
    context?: RepositoryContext
  ): Promise<CreateResult<ESchedule>> {
    const operation = 'createScheduleSecure';

    try {
      // ✅ TYPE-SAFE VALIDATION
      this.validateScheduleCreateData(data, operation);

      // ✅ BUSINESS RULE VALIDATION
      await this.validateScheduleBusinessRules(data, operation, context);

      // ✅ ENHANCE WITH COMPUTED FIELDS
      const enhancedData = await this.enhanceWithScheduleMetadata(data, operation, context);

      // ✅ OPTIMIZE SCHEDULE AUTOMATICALLY
      const optimizedData = await this.optimizeNewSchedule(enhancedData, context);

      // ✅ USE ENHANCED BASE CREATE
      const result = await this.create(optimizedData, context);

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
   * Get schedules for mentor with analytics
   */
  async getSchedulesWithAnalytics(
    mentorId: string,
    includeInactive: boolean = false,
    context?: RepositoryContext
  ): Promise<ScheduleWithAvailability[]> {
    const operation = 'getSchedulesWithAnalytics';

    try {
      this.validateObjectId(mentorId, operation);
      RepositoryLogger.logStart(operation, this.entityName, mentorId, { includeInactive });

      // ✅ BUILD QUERY
      const filter: FilterQuery<ESchedule> = {
        mentorId: new Types.ObjectId(mentorId)
      };

      if (!includeInactive) {
        filter.status = { $ne: 'inactive' };
      }

      // ✅ GET BASE SCHEDULES
      const schedules = await this.find(filter, {
        sort: { createdAt: -1 },
        lean: true
      }, context);

      // ✅ ENHANCE WITH ANALYTICS
      const schedulesWithAnalytics = await Promise.all(
        schedules.map(schedule => this.enhanceScheduleWithAnalytics(schedule, context))
      );

      RepositoryLogger.logSuccess(operation, this.entityName, mentorId, { 
        schedulesFound: schedules.length
      });

      return schedulesWithAnalytics;

    } catch (error: any) {
      this.handleError(error, operation, mentorId, context);
    }
  }

  /**
   * Update schedule with conflict detection and optimization
   */
  async updateScheduleSecure(
    scheduleId: string,
    data: ScheduleUpdateData,
    context?: RepositoryContext
  ): Promise<UpdateResult<ESchedule>> {
    const operation = 'updateScheduleSecure';

    try {
      // ✅ VALIDATE UPDATE DATA
      this.validateScheduleUpdateData(data, operation);

      // ✅ GET EXISTING SCHEDULE
      const existingSchedule = await this.findById(scheduleId, { lean: true }, context);
      if (!existingSchedule) {
        throw RepositoryErrorFactory.notFoundError(this.entityName, scheduleId, operation);
      }

      // ✅ DETECT CONFLICTS
      const conflicts = await this.detectScheduleConflicts(existingSchedule, data, context);
      if (conflicts.length > 0) {
        const criticalConflicts = conflicts.filter(c => c.severity === 'critical');
        if (criticalConflicts.length > 0) {
          throw RepositoryErrorFactory.conflictError(
            'Critical schedule conflicts detected',
            operation,
            this.entityName,
            scheduleId,
            { conflicts: criticalConflicts }
          );
        }
      }

      // ✅ ENHANCE UPDATE DATA
      const enhancedData = await this.enhanceUpdateData(data, existingSchedule, operation, context);

      // ✅ USE ENHANCED BASE UPDATE
      const result = await this.update(scheduleId, enhancedData, {
        new: true,
        runValidators: true
      }, context);

      // ✅ POST-UPDATE PROCESSING
      if (result.success && result.data) {
        await this.handlePostUpdateProcessing(result.data, existingSchedule, conflicts, context);
      }

      return result;

    } catch (error: any) {
      this.handleError(error, operation, scheduleId, context);
    }
  }

  /**
   * Delete schedule with dependency checking
   */
  async deleteScheduleSecure(
    scheduleId: string,
    options?: {
      force?: boolean;
      rescheduleBookings?: boolean;
      notifyMentees?: boolean;
    },
    context?: RepositoryContext
  ): Promise<UpdateResult<void>> {
    const operation = 'deleteScheduleSecure';

    try {
      this.validateObjectId(scheduleId, operation);
      RepositoryLogger.logStart(operation, this.entityName, scheduleId, options);

      // ✅ CHECK DEPENDENCIES
      const dependencies = await this.checkScheduleDependencies(scheduleId, context);
      if (dependencies.hasActiveBookings && !options?.force) {
        throw RepositoryErrorFactory.conflictError(
          'Cannot delete schedule with active bookings',
          operation,
          this.entityName,
          scheduleId,
          { 
            dependencies,
            suggestion: 'Use force option or reschedule existing bookings'
          }
        );
      }

      // ✅ HANDLE ACTIVE BOOKINGS
      if (dependencies.hasActiveBookings && options?.rescheduleBookings) {
        await this.rescheduleAffectedBookings(scheduleId, context);
      }

      // ✅ PERFORM SOFT DELETE (Mark as archived)
      const result = await this.update(scheduleId, {
        status: 'archived',
        archivedAt: new Date(),
        updatedAt: new Date()
      }, { new: true }, context);

      // ✅ NOTIFY AFFECTED USERS
      if (options?.notifyMentees && dependencies.affectedMentees.length > 0) {
        await this.notifyAffectedMentees(scheduleId, dependencies.affectedMentees, context);
      }

      RepositoryLogger.logSuccess(operation, this.entityName, scheduleId);

      return {
        success: true,
        data: undefined as void,
        message: 'Schedule archived successfully'
      };

    } catch (error: any) {
      this.handleError(error, operation, scheduleId, context);
    }
  }

  /**
   * 🔹 ADVANCED SCHEDULE OPERATIONS
   */

  /**
   * Find schedules with comprehensive filtering
   */
  async findSchedulesWithFilters(
    filters: ScheduleFilters,
    pagination: PaginationParams,
    context?: RepositoryContext
  ): Promise<PaginatedResponse<ESchedule>> {
    const operation = 'findSchedulesWithFilters';

    try {
      RepositoryLogger.logStart(operation, this.entityName, undefined, { filters, pagination });

      const filter = this.buildScheduleFilterQuery(filters);
      
      const options: FindOptions = {
        populate: [
          {
            path: 'mentorId',
            select: 'displayName profilePicture timezone'
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
   * Get comprehensive schedule analytics
   */
  async getScheduleAnalytics(
    filters?: {
      mentorIds?: string[];
      dateRange?: { start: Date; end: Date };
      includePredictions?: boolean;
    },
    context?: RepositoryContext
  ): Promise<ScheduleAnalytics> {
    const operation = 'getScheduleAnalytics';

    try {
      RepositoryLogger.logStart(operation, this.entityName, undefined, filters);

      // ✅ PARALLEL ANALYTICS QUERIES
      const [
        totalCount,
        statusDistribution,
        templateUsage,
        utilizationMetrics,
        availabilityTrends,
        mentorScheduleStats,
        optimizationOpportunities
      ] = await Promise.all([
        this.getTotalScheduleCount(filters, context),
        this.getStatusDistribution(filters, context),
        this.getTemplateUsage(filters, context),
        this.getUtilizationMetrics(filters, context),
        this.getAvailabilityTrends(filters, context),
        this.getMentorScheduleStats(filters, context),
        this.getOptimizationOpportunities(filters, context)
      ]);

      const analytics: ScheduleAnalytics = {
        totalSchedules: totalCount,
        activeSchedules: statusDistribution.active || 0,
        statusDistribution: statusDistribution,
        templateUsage: templateUsage,
        utilizationMetrics: utilizationMetrics,
        availabilityTrends: availabilityTrends,
        mentorScheduleStats: mentorScheduleStats,
        optimizationOpportunities: optimizationOpportunities
      };

      RepositoryLogger.logSuccess(operation, this.entityName, undefined, { 
        totalSchedules: analytics.totalSchedules,
        averageUtilization: analytics.utilizationMetrics.averageUtilization
      });

      return analytics;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Detect and analyze schedule conflicts
   */
  async detectScheduleConflicts(
    existingSchedule: ESchedule,
    updateData: ScheduleUpdateData,
    context?: RepositoryContext
  ): Promise<ScheduleConflict[]> {
    const operation = 'detectScheduleConflicts';

    try {
      RepositoryLogger.logStart(operation, this.entityName, existingSchedule._id.toString());

      const conflicts: ScheduleConflict[] = [];

      // ✅ CHECK FOR SLOT OVERLAPS
      if (updateData.weeklySchedule) {
        const overlapConflicts = this.detectSlotOverlaps(updateData.weeklySchedule);
        conflicts.push(...overlapConflicts);
      }

      // ✅ CHECK FOR BOOKING CONFLICTS
      const bookingConflicts = await this.detectBookingConflicts(existingSchedule, updateData, context);
      conflicts.push(...bookingConflicts);

      // ✅ CHECK FOR UTILIZATION ISSUES
      const utilizationConflicts = await this.detectUtilizationIssues(existingSchedule, updateData, context);
      conflicts.push(...utilizationConflicts);

      RepositoryLogger.logSuccess(operation, this.entityName, existingSchedule._id.toString(), { 
        conflictsFound: conflicts.length
      });

      return conflicts;

    } catch (error: any) {
      this.handleError(error, operation, existingSchedule._id.toString(), context);
    }
  }

  /**
   * Generate optimized schedule recommendations
   */
  async generateScheduleRecommendations(
    mentorId: string,
    preferences?: {
      preferredHours?: { start: string; end: string };
      maxSessionsPerDay?: number;
      preferredDays?: DayOfWeek[];
      breakPreferences?: number;
    },
    context?: RepositoryContext
  ): Promise<ScheduleCreateData> {
    const operation = 'generateScheduleRecommendations';

    try {
      this.validateObjectId(mentorId, operation);
      RepositoryLogger.logStart(operation, this.entityName, mentorId, preferences);

      // ✅ ANALYZE MENTOR'S HISTORICAL DATA
      const historicalData = await this.analyzeMentorHistoricalSchedule(mentorId, context);
      
      // ✅ ANALYZE MARKET DEMAND
      const marketDemand = await this.analyzeMarketDemand(context);
      
      // ✅ GENERATE OPTIMAL SCHEDULE
      const optimizedSchedule = this.generateOptimalSchedule(
        mentorId,
        historicalData,
        marketDemand,
        preferences
      );

      RepositoryLogger.logSuccess(operation, this.entityName, mentorId);

      return optimizedSchedule;

    } catch (error: any) {
      this.handleError(error, operation, mentorId, context);
    }
  }

  /**
   * 🔹 VALIDATION METHODS
   */

  /**
   * Validate schedule creation data
   */
  private validateScheduleCreateData(data: ScheduleCreateData, operation: string): void {
    const errors: string[] = [];

    // Required fields
    if (!data.mentorId) errors.push('mentorId is required');
    if (!data.scheduleName?.trim()) errors.push('scheduleName is required');
    if (!data.weeklySchedule || !Array.isArray(data.weeklySchedule)) {
      errors.push('weeklySchedule is required and must be an array');
    }

    // Validate mentor ID
    if (data.mentorId && !Types.ObjectId.isValid(data.mentorId)) {
      errors.push('Invalid mentorId format');
    }

    // Validate weekly schedule
    if (data.weeklySchedule) {
      const validDays: DayOfWeek[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      const providedDays = new Set<string>();

      data.weeklySchedule.forEach((daySchedule, index) => {
        if (!validDays.includes(daySchedule.day)) {
          errors.push(`Invalid day at index ${index}: ${daySchedule.day}`);
        }

        if (providedDays.has(daySchedule.day)) {
          errors.push(`Duplicate day found: ${daySchedule.day}`);
        }
        providedDays.add(daySchedule.day);
        
        if (!Array.isArray(daySchedule.slots)) {
          errors.push(`Slots must be an array for day ${daySchedule.day}`);
        } else {
          this.validateDayScheduleSlots(daySchedule.slots, daySchedule.day, errors);
        }
      });
    }

    // Validate dates
    if (data.effectiveFrom && data.effectiveUntil && data.effectiveFrom >= data.effectiveUntil) {
      errors.push('effectiveFrom must be before effectiveUntil');
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
   * Validate schedule update data
   */
  private validateScheduleUpdateData(data: ScheduleUpdateData, operation: string): void {
    const errors: string[] = [];

    // Validate schedule name if provided
    if (data.scheduleName !== undefined && !data.scheduleName.trim()) {
      errors.push('scheduleName cannot be empty');
    }

    // Validate weekly schedule if provided
    if (data.weeklySchedule) {
      const validDays: DayOfWeek[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      const providedDays = new Set<string>();

      data.weeklySchedule.forEach((daySchedule, index) => {
        if (!validDays.includes(daySchedule.day)) {
          errors.push(`Invalid day at index ${index}: ${daySchedule.day}`);
        }

        if (providedDays.has(daySchedule.day)) {
          errors.push(`Duplicate day found: ${daySchedule.day}`);
        }
        providedDays.add(daySchedule.day);
        
        if (!Array.isArray(daySchedule.slots)) {
          errors.push(`Slots must be an array for day ${daySchedule.day}`);
        } else {
          this.validateDayScheduleSlots(daySchedule.slots, daySchedule.day, errors);
        }
      });
    }

    // Validate dates if provided
    if (data.effectiveFrom && data.effectiveUntil && data.effectiveFrom >= data.effectiveUntil) {
      errors.push('effectiveFrom must be before effectiveUntil');
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
   * Validate day schedule slots
   */
  private validateDayScheduleSlots(slots: Slot[], day: string, errors: string[]): void {
    slots.forEach((slot, slotIndex) => {
      if (typeof slot.index !== 'number') {
        errors.push(`Invalid slot index at ${day}[${slotIndex}]`);
      }
      if (!this.isValidTimeFormat(slot.startTime)) {
        errors.push(`Invalid startTime format at ${day}[${slotIndex}]: ${slot.startTime}`);
      }
      if (!this.isValidTimeFormat(slot.endTime)) {
        errors.push(`Invalid endTime format at ${day}[${slotIndex}]: ${slot.endTime}`);
      }
      if (typeof slot.isAvailable !== 'boolean') {
        errors.push(`isAvailable must be boolean at ${day}[${slotIndex}]`);
      }
      
      // Check time logic
      if (slot.startTime >= slot.endTime) {
        errors.push(`startTime must be before endTime at ${day}[${slotIndex}]`);
      }
    });

    // Check for overlapping slots
    const sortedSlots = [...slots].sort((a, b) => a.startTime.localeCompare(b.startTime));
    for (let i = 0; i < sortedSlots.length - 1; i++) {
      if (sortedSlots[i].endTime > sortedSlots[i + 1].startTime) {
        errors.push(`Overlapping slots detected in ${day}: ${sortedSlots[i].endTime} overlaps with ${sortedSlots[i + 1].startTime}`);
      }
    }
  }

  /**
   * 🔹 HELPER METHODS
   */

  /**
   * Validate schedule business rules
   */
  private async validateScheduleBusinessRules(
    data: ScheduleCreateData,
    operation: string,
    context?: RepositoryContext
  ): Promise<void> {
    // Check if mentor already has too many active schedules
    const existingSchedules = await this.count({
      mentorId: new Types.ObjectId(data.mentorId),
      status: { $in: ['active', 'draft'] }
    }, context);

    if (existingSchedules >= 5) { // Arbitrary limit
      throw RepositoryErrorFactory.businessRuleError(
        'Mentor cannot have more than 5 active schedules',
        operation,
        this.entityName,
        data.mentorId
      );
    }
  }

  /**
   * Enhance schedule data with metadata
   */
  private async enhanceWithScheduleMetadata(
    data: ScheduleCreateData,
    operation: string,
    context?: RepositoryContext
  ): Promise<DeepPartial<ESchedule>> {
    return {
      ...data,
      mentorId: new Types.ObjectId(data.mentorId),
      status: data.status || 'active',
      effectiveFrom: data.effectiveFrom || new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Build filter query for schedules
   */
  private buildScheduleFilterQuery(filters: ScheduleFilters): FilterQuery<ESchedule> {
    const query: FilterQuery<ESchedule> = {};

    if (filters.mentorId) {
      query.mentorId = new Types.ObjectId(filters.mentorId);
    }

    if (filters.status) {
      query.status = Array.isArray(filters.status) ? { $in: filters.status } : filters.status;
    }

    if (filters.template && filters.template.length > 0) {
      query.template = { $in: filters.template };
    }

    if (filters.effectiveDateRange) {
      query.$or = [
        {
          effectiveFrom: {
            $gte: filters.effectiveDateRange.start,
            $lte: filters.effectiveDateRange.end
          }
        },
        {
          effectiveUntil: {
            $gte: filters.effectiveDateRange.start,
            $lte: filters.effectiveDateRange.end
          }
        }
      ];
    }

    if (filters.searchTerm) {
      const searchRegex = { $regex: filters.searchTerm, $options: 'i' };
      query.scheduleName = searchRegex;
    }

    return query;
  }

  /**
   * 🔹 ANALYTICS AND OPTIMIZATION HELPER METHODS (Placeholders)
   */

  private async enhanceScheduleWithAnalytics(schedule: ESchedule, context?: RepositoryContext): Promise<ScheduleWithAvailability> {
    // Placeholder - would calculate real analytics
    return {
      ...schedule,
      availabilityStats: {
        totalSlots: 40,
        availableSlots: 30,
        bookedSlots: 10,
        utilizationRate: 75,
        peakHours: [
          { hour: 10, utilization: 90 },
          { hour: 14, utilization: 85 }
        ]
      },
      conflictAnalysis: {
        hasConflicts: false,
        conflictCount: 0,
        conflictTypes: []
      },
      optimizationSuggestions: []
    };
  }

  private async optimizeNewSchedule(data: DeepPartial<ESchedule>, context?: RepositoryContext): Promise<DeepPartial<ESchedule>> {
    // Placeholder - would apply optimization algorithms
    return data;
  }

  private async performPostCreationSetup(schedule: ESchedule, context?: RepositoryContext): Promise<void> {
    // Placeholder - setup notifications, integrations, etc.
  }

  private async detectSlotOverlaps(weeklySchedule: DaySchedule[]): Promise<ScheduleConflict[]> {
    // Placeholder - detect overlapping time slots
    return [];
  }

  private async detectBookingConflicts(existingSchedule: ESchedule, updateData: ScheduleUpdateData, context?: RepositoryContext): Promise<ScheduleConflict[]> {
    // Placeholder - check against existing bookings
    return [];
  }

  private async detectUtilizationIssues(existingSchedule: ESchedule, updateData: ScheduleUpdateData, context?: RepositoryContext): Promise<ScheduleConflict[]> {
    // Placeholder - analyze utilization patterns
    return [];
  }

  private async checkScheduleDependencies(scheduleId: string, context?: RepositoryContext) {
    // Placeholder - check for active bookings, etc.
    return {
      hasActiveBookings: false,
      activeBookingCount: 0,
      affectedMentees: []
    };
  }

  private async rescheduleAffectedBookings(scheduleId: string, context?: RepositoryContext): Promise<void> {
    // Placeholder - reschedule logic
  }

  private async notifyAffectedMentees(scheduleId: string, mentees: string[], context?: RepositoryContext): Promise<void> {
    // Placeholder - notification logic
  }

  private async enhanceUpdateData(data: ScheduleUpdateData, existingSchedule: ESchedule, operation: string, context?: RepositoryContext): Promise<ScheduleUpdateData> {
    return {
      ...data,
      updatedAt: new Date()
    };
  }

  private async handlePostUpdateProcessing(
    updatedSchedule: ESchedule, 
    originalSchedule: ESchedule, 
    conflicts: ScheduleConflict[], 
    context?: RepositoryContext
  ): Promise<void> {
    // Handle post-update processing, notifications, etc.
  }

  private async analyzeMentorHistoricalSchedule(mentorId: string, context?: RepositoryContext) {
    // Placeholder - analyze historical patterns
    return { preferredTimes: [], busyDays: [], averageUtilization: 0 };
  }

  private async analyzeMarketDemand(context?: RepositoryContext) {
    // Placeholder - analyze market demand patterns
    return { peakHours: [], lowDemandTimes: [] };
  }

  private generateOptimalSchedule(
    mentorId: string,
    historicalData: any,
    marketDemand: any,
    preferences?: any
  ): ScheduleCreateData {
    // Placeholder - generate optimized schedule
    const validDays: DayOfWeek[] = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    
    return {
      mentorId,
      scheduleName: "Optimized Schedule",
      weeklySchedule: validDays.map(day => ({
        day,
        slots: [
          {
            index: 0,
            startTime: "09:00",
            endTime: "10:00",
            isAvailable: true
          },
          {
            index: 1,
            startTime: "10:00",
            endTime: "11:00",
            isAvailable: true
          }
        ]
      })),
      template: "standard"
    };
  }

  // Analytics helper methods (placeholders)
  private async getTotalScheduleCount(filters?: any, context?: RepositoryContext): Promise<number> {
    return this.count({}, context);
  }

  private async getStatusDistribution(filters?: any, context?: RepositoryContext): Promise<Record<ScheduleStatus, number>> {
    const pipeline = [
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ];
    
    const result = await this.aggregate<{ _id: ScheduleStatus; count: number }>(pipeline, context);
    
    const distribution: Record<ScheduleStatus, number> = {
      active: 0,
      inactive: 0,
      draft: 0,
      archived: 0
    };

    result.data.forEach(item => {
      if (item._id && item._id in distribution) {
        distribution[item._id] = item.count;
      }
    });

    return distribution;
  }

  private async getTemplateUsage(filters?: any, context?: RepositoryContext): Promise<Record<ScheduleTemplate, number>> {
    return {
      standard: 50,
      flexible: 25,
      peak_hours: 15,
      custom: 10
    };
  }

  private async getUtilizationMetrics(filters?: any, context?: RepositoryContext) {
    return {
      averageUtilization: 75,
      peakUtilizationHour: 14,
      lowUtilizationHour: 8,
      weekdayVsWeekendRatio: 3.5
    };
  }

  private async getAvailabilityTrends(filters?: any, context?: RepositoryContext) {
    return [];
  }

  private async getMentorScheduleStats(filters?: any, context?: RepositoryContext) {
    return {
      mentorsWithSchedules: 85,
      averageSchedulesPerMentor: 1.2,
      mostActiveTimeSlots: [
        { timeSlot: "10:00-11:00", mentorCount: 45 },
        { timeSlot: "14:00-15:00", mentorCount: 42 }
      ]
    };
  }

  private async getOptimizationOpportunities(filters?: any, context?: RepositoryContext) {
    return [];
  }

  /**
   * 🔹 UTILITY METHODS
   */

  private isValidTimeFormat(time: string): boolean {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  /**
   * 🔹 LEGACY METHODS (for backward compatibility)
   */

  // ❌ DEPRECATED - Use getSchedulesWithAnalytics instead
  async getSchedules(mentorId: string | Types.ObjectId): Promise<ESchedule[]> {
    console.warn('⚠️ ScheduleRepository.getSchedules() is deprecated. Use getSchedulesWithAnalytics() instead.');
    const mentorIdString = typeof mentorId === 'string' ? mentorId : mentorId.toString();
    const result = await this.getSchedulesWithAnalytics(mentorIdString);
    return result.map(schedule => {
      // Remove analytics fields to match legacy interface
      const { availabilityStats, conflictAnalysis, optimizationSuggestions, ...legacySchedule } = schedule;
      return legacySchedule as ESchedule;
    });
  }

  // ❌ DEPRECATED - Use createScheduleSecure instead
  async createSchedule(mentorId: string | Types.ObjectId, data: ScheduleData): Promise<ESchedule> {
    console.warn('⚠️ ScheduleRepository.createSchedule() is deprecated. Use createScheduleSecure() instead.');
    const mentorIdString = typeof mentorId === 'string' ? mentorId : mentorId.toString();
    
    const createData: ScheduleCreateData = {
      mentorId: mentorIdString,
      scheduleName: data.scheduleName || 'Default Schedule',
      weeklySchedule: data.weeklySchedule || []
    };

    const result = await this.createScheduleSecure(createData);
    if (!result.success) {
      throw new Error('Failed to create schedule');
    }
    return result.data;
  }

  // ❌ DEPRECATED - Use updateScheduleSecure instead
  async updateSchedule(scheduleId: string, data: ScheduleData): Promise<ESchedule | null> {
    console.warn('⚠️ ScheduleRepository.updateSchedule() is deprecated. Use updateScheduleSecure() instead.');
    
    const updateData: ScheduleUpdateData = {
      scheduleName: data.scheduleName,
      weeklySchedule: data.weeklySchedule
    };

    const result = await this.updateScheduleSecure(scheduleId, updateData);
    return result.success ? result.data : null;
  }

  // ❌ DEPRECATED - Use deleteScheduleSecure instead
  async deleteSchedule(scheduleId: string): Promise<ESchedule | null> {
    console.warn('⚠️ ScheduleRepository.deleteSchedule() is deprecated. Use deleteScheduleSecure() instead.');
    
    const existingSchedule = await this.findById(scheduleId);
    if (!existingSchedule) return null;

    await this.deleteScheduleSecure(scheduleId);
    return existingSchedule;
  }

  // ❌ DEPRECATED - Use createScheduleSecure instead
  async create(data: DeepPartial<ESchedule>, context?: RepositoryContext): Promise<CreateResult<ESchedule>> {
    console.warn('⚠️ ScheduleRepository.create() is deprecated. Use createScheduleSecure() instead.');
    return super.create(data, context);
  }
}

// Re-export for use by other modules
export type {
  ScheduleCreateData,
  ScheduleUpdateData,
  ScheduleFilters,
  ScheduleWithAvailability,
  ScheduleAnalytics,
  ScheduleConflict,
  CalendarIntegration,
  DayOfWeek,
  ScheduleStatus,
  RecurrenceType,
  ScheduleTemplate
};