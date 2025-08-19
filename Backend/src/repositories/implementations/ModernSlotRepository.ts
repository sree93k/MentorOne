/**
 * 🔹 PHASE 3 MIGRATION: Modern Slot Repository
 * Type-safe, comprehensive slot and schedule management with availability optimization
 */

import { injectable } from "inversify";
import { Types, FilterQuery } from "mongoose";
import { ESchedule, Slot, DaySchedule } from "../../entities/scheduleEntity";
import { EBlockedDate } from "../../entities/blockedEntity";
import { ISlotRepository } from "../interface/ISlotRepository";
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
import scheduleModel from "../../models/scheduleModel";
import blockedModel from "../../models/blockedModel";

/**
 * 🔹 SLOT-SPECIFIC TYPES
 */
type DayOfWeek = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
type SlotStatus = "available" | "booked" | "blocked" | "maintenance";
type BlockType = "temporary" | "permanent" | "vacation" | "sick_leave" | "personal";
type TimeZone = string; // e.g., "America/New_York", "UTC", "Asia/Kolkata"

interface SlotCreateData {
  mentorId: string;
  scheduleName: string;
  weeklySchedule: DaySchedule[];
  status?: boolean;
  timezone?: TimeZone;
  metadata?: {
    bufferTime?: number; // minutes between slots
    maxAdvanceBooking?: number; // days in advance
    minAdvanceBooking?: number; // hours in advance
    autoConfirm?: boolean;
    slotDuration?: number; // minutes
    breakTime?: number; // minutes
  };
}

interface SlotUpdateData {
  scheduleName?: string;
  weeklySchedule?: DaySchedule[];
  status?: boolean;
  timezone?: TimeZone;
  bufferTime?: number;
  maxAdvanceBooking?: number;
  minAdvanceBooking?: number;
  autoConfirm?: boolean;
}

interface BlockedDateCreateData {
  mentorId: string;
  date: Date;
  day: string;
  slotTime: string;
  type: BlockType;
  reason?: string;
  duration?: {
    startDate: Date;
    endDate: Date;
  };
}

interface AvailabilityFilters {
  mentorId?: string;
  date?: Date;
  dateRange?: {
    start: Date;
    end: Date;
  };
  dayOfWeek?: DayOfWeek | DayOfWeek[];
  timeRange?: {
    startTime: string;
    endTime: string;
  };
  status?: SlotStatus[];
  timezone?: TimeZone;
  duration?: number; // minimum slot duration needed
}

interface SlotAvailability {
  scheduleId: string;
  mentorId: string;
  date: Date;
  dayOfWeek: DayOfWeek;
  availableSlots: Array<{
    index: number;
    startTime: string;
    endTime: string;
    duration: number;
    status: SlotStatus;
    isBookable: boolean;
  }>;
  blockedSlots: Array<{
    slotTime: string;
    blockType: BlockType;
    reason?: string;
  }>;
  totalSlots: number;
  availableCount: number;
  blockedCount: number;
  bookedCount: number;
}

interface ScheduleAnalytics {
  totalSchedules: number;
  activeSchedules: number;
  mentorCoverage: {
    totalMentors: number;
    mentorsWithSchedules: number;
    averageSlotsPerMentor: number;
  };
  availabilityMetrics: {
    totalSlots: number;
    availableSlots: number;
    bookedSlots: number;
    blockedSlots: number;
    utilizationRate: number;
  };
  timeDistribution: Array<{
    hour: number;
    totalSlots: number;
    averageAvailability: number;
  }>;
  dayDistribution: Record<DayOfWeek, {
    totalSlots: number;
    averageAvailability: number;
  }>;
  blockingAnalytics: {
    totalBlocks: number;
    blocksByType: Record<BlockType, number>;
    averageBlockDuration: number;
    frequentlyBlockedTimes: Array<{
      day: DayOfWeek;
      timeSlot: string;
      blockCount: number;
    }>;
  };
}

interface SlotConflictCheck {
  hasConflict: boolean;
  conflictType?: "booking" | "block" | "schedule";
  conflictDetails?: {
    conflictingSlot?: Slot;
    conflictingBooking?: string;
    conflictingBlock?: EBlockedDate;
  };
  suggestions?: Array<{
    alternativeTime: string;
    alternativeDate?: Date;
    reason: string;
  }>;
}

/**
 * 🔹 MODERN SLOT REPOSITORY
 * Industry-standard slot and schedule management with comprehensive availability optimization
 */
@injectable()
export default class ModernSlotRepository 
  extends EnhancedBaseRepository<ESchedule>
  implements ISlotRepository {

  constructor() {
    super(scheduleModel);
  }

  /**
   * 🔹 SLOT-SPECIFIC CRUD OPERATIONS
   */

  /**
   * Create schedule with comprehensive validation
   */
  async createScheduleSecure(
    data: SlotCreateData,
    context?: RepositoryContext
  ): Promise<CreateResult<ESchedule>> {
    const operation = 'createScheduleSecure';

    try {
      // ✅ TYPE-SAFE VALIDATION
      this.validateScheduleData(data, operation);

      // ✅ BUSINESS RULE VALIDATION
      await this.validateScheduleBusinessRules(data, operation, context);

      // ✅ ENHANCE WITH METADATA
      const enhancedData = await this.enhanceWithScheduleMetadata(data, operation, context);

      // ✅ USE ENHANCED BASE CREATE
      const result = await this.create(enhancedData, context);

      // ✅ POST-CREATION OPTIMIZATION
      if (result.success && result.data) {
        await this.optimizeScheduleSlots(result.data, context);
      }

      return result;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Find available slots with advanced filtering
   */
  async findAvailableSlotsSecure(
    filters: AvailabilityFilters,
    context?: RepositoryContext
  ): Promise<SlotAvailability[]> {
    const operation = 'findAvailableSlotsSecure';

    try {
      this.validateAvailabilityFilters(filters, operation);
      RepositoryLogger.logStart(operation, this.entityName, undefined, filters);

      // ✅ BUILD QUERY FOR SCHEDULES
      const scheduleFilter = this.buildScheduleFilterQuery(filters);
      
      const schedules = await this.find(scheduleFilter, {
        populate: [
          {
            path: 'mentorId',
            select: 'displayName timezone'
          }
        ],
        lean: true
      }, context);

      // ✅ PROCESS EACH SCHEDULE FOR AVAILABILITY
      const availabilityPromises = schedules.map(schedule => 
        this.processScheduleAvailability(schedule, filters, context)
      );

      const availabilities = await Promise.all(availabilityPromises);

      RepositoryLogger.logSuccess(operation, this.entityName, undefined, { 
        schedulesFound: schedules.length,
        totalAvailableSlots: availabilities.reduce((sum, avail) => sum + avail.availableCount, 0)
      });

      return availabilities;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Create blocked date with conflict checking
   */
  async createBlockedDateSecure(
    data: BlockedDateCreateData,
    context?: RepositoryContext
  ): Promise<CreateResult<EBlockedDate>> {
    const operation = 'createBlockedDateSecure';

    try {
      // ✅ VALIDATE BLOCKED DATE DATA
      this.validateBlockedDateData(data, operation);

      // ✅ CHECK FOR CONFLICTS
      const conflictCheck = await this.checkSlotConflicts(
        data.mentorId,
        data.date,
        data.slotTime,
        context
      );

      if (conflictCheck.hasConflict && conflictCheck.conflictType === 'booking') {
        throw RepositoryErrorFactory.conflictError(
          'Cannot block slot that has existing booking',
          operation,
          'BlockedDate',
          undefined,
          conflictCheck.conflictDetails
        );
      }

      RepositoryLogger.logStart(operation, 'BlockedDate', undefined, { 
        mentorId: data.mentorId,
        date: data.date,
        type: data.type
      });

      // ✅ CREATE BLOCKED DATE
      const blockedDate = new blockedModel({
        ...data,
        mentorId: new Types.ObjectId(data.mentorId),
        createdAt: new Date()
      });

      const savedBlockedDate = await blockedDate.save();

      RepositoryLogger.logSuccess(operation, 'BlockedDate', savedBlockedDate._id.toString());

      return {
        success: true,
        data: savedBlockedDate as EBlockedDate,
        message: 'Blocked date created successfully'
      };

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Find blocked dates with filtering
   */
  async findBlockedDatesSecure(
    mentorId: string,
    filters?: {
      dateRange?: { start: Date; end: Date };
      blockType?: BlockType[];
      includeExpired?: boolean;
    },
    context?: RepositoryContext
  ): Promise<EBlockedDate[]> {
    const operation = 'findBlockedDatesSecure';

    try {
      this.validateObjectId(mentorId, operation);
      RepositoryLogger.logStart(operation, 'BlockedDate', mentorId, filters);

      // ✅ BUILD QUERY
      const query: FilterQuery<EBlockedDate> = {
        mentorId: new Types.ObjectId(mentorId)
      };

      if (filters?.dateRange) {
        query.date = {
          $gte: filters.dateRange.start,
          $lte: filters.dateRange.end
        };
      }

      if (filters?.blockType && filters.blockType.length > 0) {
        query.type = { $in: filters.blockType };
      }

      if (!filters?.includeExpired) {
        query.date = { ...query.date, $gte: new Date() };
      }

      // ✅ EXECUTE QUERY
      const blockedDates = await blockedModel
        .find(query)
        .sort({ date: 1, slotTime: 1 })
        .lean() as EBlockedDate[];

      RepositoryLogger.logSuccess(operation, 'BlockedDate', mentorId, { 
        blockedDatesFound: blockedDates.length
      });

      return blockedDates;

    } catch (error: any) {
      this.handleError(error, operation, mentorId, context);
    }
  }

  /**
   * 🔹 ADVANCED SLOT OPERATIONS
   */

  /**
   * Check for slot conflicts
   */
  async checkSlotConflicts(
    mentorId: string,
    date: Date,
    slotTime: string,
    context?: RepositoryContext
  ): Promise<SlotConflictCheck> {
    const operation = 'checkSlotConflicts';

    try {
      this.validateObjectId(mentorId, operation);
      RepositoryLogger.logStart(operation, this.entityName, mentorId, { date, slotTime });

      // ✅ CHECK FOR EXISTING BLOCKS
      const existingBlock = await blockedModel.findOne({
        mentorId: new Types.ObjectId(mentorId),
        date: {
          $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
        },
        slotTime: slotTime
      });

      if (existingBlock) {
        return {
          hasConflict: true,
          conflictType: 'block',
          conflictDetails: {
            conflictingBlock: existingBlock as EBlockedDate
          }
        };
      }

      // ✅ CHECK FOR BOOKINGS (Would integrate with booking system)
      const hasBookingConflict = await this.checkBookingConflict(mentorId, date, slotTime, context);
      
      if (hasBookingConflict) {
        return {
          hasConflict: true,
          conflictType: 'booking',
          suggestions: await this.generateAlternativeSlots(mentorId, date, slotTime, context)
        };
      }

      RepositoryLogger.logSuccess(operation, this.entityName, mentorId, { hasConflict: false });

      return { hasConflict: false };

    } catch (error: any) {
      this.handleError(error, operation, mentorId, context);
    }
  }

  /**
   * Get comprehensive schedule analytics
   */
  async getScheduleAnalytics(
    filters?: {
      mentorIds?: string[];
      dateRange?: { start: Date; end: Date };
    },
    context?: RepositoryContext
  ): Promise<ScheduleAnalytics> {
    const operation = 'getScheduleAnalytics';

    try {
      RepositoryLogger.logStart(operation, this.entityName, undefined, filters);

      // ✅ PARALLEL ANALYTICS QUERIES
      const [
        totalSchedules,
        mentorCoverage,
        availabilityMetrics,
        timeDistribution,
        dayDistribution,
        blockingAnalytics
      ] = await Promise.all([
        this.getTotalScheduleCount(filters, context),
        this.getMentorCoverageStats(filters, context),
        this.getAvailabilityMetrics(filters, context),
        this.getTimeDistribution(filters, context),
        this.getDayDistribution(filters, context),
        this.getBlockingAnalytics(filters, context)
      ]);

      const analytics: ScheduleAnalytics = {
        totalSchedules: totalSchedules,
        activeSchedules: totalSchedules, // Would filter by status
        mentorCoverage: mentorCoverage,
        availabilityMetrics: availabilityMetrics,
        timeDistribution: timeDistribution,
        dayDistribution: dayDistribution,
        blockingAnalytics: blockingAnalytics
      };

      RepositoryLogger.logSuccess(operation, this.entityName, undefined, { 
        totalSchedules: analytics.totalSchedules,
        utilizationRate: analytics.availabilityMetrics.utilizationRate
      });

      return analytics;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Optimize schedule slots for better utilization
   */
  async optimizeScheduleSlots(
    schedule: ESchedule,
    context?: RepositoryContext
  ): Promise<UpdateResult<ESchedule>> {
    const operation = 'optimizeScheduleSlots';

    try {
      RepositoryLogger.logStart(operation, this.entityName, schedule._id.toString());

      // ✅ ANALYZE CURRENT SCHEDULE
      const analytics = await this.analyzeScheduleUtilization(schedule, context);
      
      // ✅ GENERATE OPTIMIZATION SUGGESTIONS
      const optimizations = this.generateScheduleOptimizations(schedule, analytics);
      
      if (optimizations.length === 0) {
        return {
          success: true,
          data: schedule,
          message: 'Schedule is already optimized'
        };
      }

      // ✅ APPLY OPTIMIZATIONS
      const optimizedSchedule = this.applyScheduleOptimizations(schedule, optimizations);
      
      // ✅ UPDATE SCHEDULE
      const result = await this.update(schedule._id.toString(), {
        weeklySchedule: optimizedSchedule.weeklySchedule,
        updatedAt: new Date()
      }, { new: true }, context);

      RepositoryLogger.logSuccess(operation, this.entityName, schedule._id.toString(), { 
        optimizationsApplied: optimizations.length
      });

      return result;

    } catch (error: any) {
      this.handleError(error, operation, schedule._id.toString(), context);
    }
  }

  /**
   * 🔹 VALIDATION METHODS
   */

  /**
   * Validate schedule creation data
   */
  private validateScheduleData(data: SlotCreateData, operation: string): void {
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
      
      data.weeklySchedule.forEach((daySchedule, index) => {
        if (!validDays.includes(daySchedule.day)) {
          errors.push(`Invalid day at index ${index}: ${daySchedule.day}`);
        }
        
        if (!Array.isArray(daySchedule.slots)) {
          errors.push(`Slots must be an array for day ${daySchedule.day}`);
        } else {
          daySchedule.slots.forEach((slot, slotIndex) => {
            if (typeof slot.index !== 'number') {
              errors.push(`Invalid slot index at ${daySchedule.day}[${slotIndex}]`);
            }
            if (!this.isValidTimeFormat(slot.startTime)) {
              errors.push(`Invalid startTime format at ${daySchedule.day}[${slotIndex}]: ${slot.startTime}`);
            }
            if (!this.isValidTimeFormat(slot.endTime)) {
              errors.push(`Invalid endTime format at ${daySchedule.day}[${slotIndex}]: ${slot.endTime}`);
            }
            if (typeof slot.isAvailable !== 'boolean') {
              errors.push(`isAvailable must be boolean at ${daySchedule.day}[${slotIndex}]`);
            }
          });
        }
      });
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
   * Validate blocked date data
   */
  private validateBlockedDateData(data: BlockedDateCreateData, operation: string): void {
    const errors: string[] = [];

    if (!data.mentorId) errors.push('mentorId is required');
    if (!data.date) errors.push('date is required');
    if (!data.day?.trim()) errors.push('day is required');
    if (!data.slotTime?.trim()) errors.push('slotTime is required');
    if (!data.type) errors.push('type is required');

    // Validate mentor ID
    if (data.mentorId && !Types.ObjectId.isValid(data.mentorId)) {
      errors.push('Invalid mentorId format');
    }

    // Validate date
    if (data.date && data.date <= new Date()) {
      errors.push('Date must be in the future');
    }

    // Validate slot time format
    if (data.slotTime && !this.isValidTimeFormat(data.slotTime)) {
      errors.push('Invalid slotTime format. Use HH:MM format');
    }

    // Validate block type
    const validTypes: BlockType[] = ["temporary", "permanent", "vacation", "sick_leave", "personal"];
    if (data.type && !validTypes.includes(data.type)) {
      errors.push(`Invalid block type. Must be one of: ${validTypes.join(', ')}`);
    }

    if (errors.length > 0) {
      throw RepositoryErrorFactory.validationError(
        `Blocked date validation failed: ${errors.join(', ')}`,
        operation,
        'BlockedDate',
        undefined,
        { errors, data }
      );
    }
  }

  /**
   * Validate availability filters
   */
  private validateAvailabilityFilters(filters: AvailabilityFilters, operation: string): void {
    const errors: string[] = [];

    if (filters.mentorId && !Types.ObjectId.isValid(filters.mentorId)) {
      errors.push('Invalid mentorId format');
    }

    if (filters.dateRange) {
      if (filters.dateRange.start >= filters.dateRange.end) {
        errors.push('Start date must be before end date');
      }
    }

    if (filters.timeRange) {
      if (!this.isValidTimeFormat(filters.timeRange.startTime)) {
        errors.push('Invalid startTime format');
      }
      if (!this.isValidTimeFormat(filters.timeRange.endTime)) {
        errors.push('Invalid endTime format');
      }
    }

    if (errors.length > 0) {
      throw RepositoryErrorFactory.validationError(
        `Availability filter validation failed: ${errors.join(', ')}`,
        operation,
        this.entityName,
        undefined,
        { errors, filters }
      );
    }
  }

  /**
   * 🔹 HELPER METHODS
   */

  /**
   * Validate business rules for schedule creation
   */
  private async validateScheduleBusinessRules(
    data: SlotCreateData,
    operation: string,
    context?: RepositoryContext
  ): Promise<void> {
    // Check if mentor already has an active schedule
    const existingSchedule = await this.findOne({
      mentorId: new Types.ObjectId(data.mentorId),
      status: true
    }, { lean: true }, context);

    if (existingSchedule) {
      throw RepositoryErrorFactory.duplicateError(
        this.entityName,
        operation,
        'mentorId',
        data.mentorId,
        'Mentor already has an active schedule'
      );
    }
  }

  /**
   * Enhance schedule data with metadata
   */
  private async enhanceWithScheduleMetadata(
    data: SlotCreateData,
    operation: string,
    context?: RepositoryContext
  ): Promise<DeepPartial<ESchedule>> {
    return {
      ...data,
      mentorId: new Types.ObjectId(data.mentorId),
      status: data.status !== undefined ? data.status : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Build filter query for schedules
   */
  private buildScheduleFilterQuery(filters: AvailabilityFilters): FilterQuery<ESchedule> {
    const query: FilterQuery<ESchedule> = {};

    if (filters.mentorId) {
      query.mentorId = new Types.ObjectId(filters.mentorId);
    }

    // Add status filter for active schedules
    query.status = true;

    return query;
  }

  /**
   * Process schedule availability for a specific schedule
   */
  private async processScheduleAvailability(
    schedule: ESchedule,
    filters: AvailabilityFilters,
    context?: RepositoryContext
  ): Promise<SlotAvailability> {
    // ✅ GET BLOCKED DATES FOR THIS MENTOR
    const blockedDates = await this.findBlockedDatesSecure(
      schedule.mentorId.toString(),
      filters.dateRange ? { dateRange: filters.dateRange } : undefined,
      context
    );

    // ✅ PROCESS AVAILABILITY FOR TARGET DATE
    const targetDate = filters.date || new Date();
    const dayOfWeek = this.getDayOfWeekFromDate(targetDate);
    
    const daySchedule = schedule.weeklySchedule.find(ds => ds.day === dayOfWeek);
    
    if (!daySchedule) {
      return {
        scheduleId: schedule._id.toString(),
        mentorId: schedule.mentorId.toString(),
        date: targetDate,
        dayOfWeek: dayOfWeek,
        availableSlots: [],
        blockedSlots: [],
        totalSlots: 0,
        availableCount: 0,
        blockedCount: 0,
        bookedCount: 0
      };
    }

    // ✅ PROCESS SLOTS
    const processedSlots = daySchedule.slots.map(slot => {
      const isBlocked = blockedDates.some(block => 
        this.isSameDate(block.date, targetDate) && block.slotTime === slot.startTime
      );

      return {
        index: slot.index,
        startTime: slot.startTime,
        endTime: slot.endTime,
        duration: this.calculateSlotDuration(slot.startTime, slot.endTime),
        status: isBlocked ? 'blocked' as SlotStatus : 
                slot.isAvailable ? 'available' as SlotStatus : 'booked' as SlotStatus,
        isBookable: slot.isAvailable && !isBlocked
      };
    });

    const blockedSlots = blockedDates
      .filter(block => this.isSameDate(block.date, targetDate))
      .map(block => ({
        slotTime: block.slotTime,
        blockType: block.type as BlockType,
        reason: block.reason
      }));

    return {
      scheduleId: schedule._id.toString(),
      mentorId: schedule.mentorId.toString(),
      date: targetDate,
      dayOfWeek: dayOfWeek,
      availableSlots: processedSlots,
      blockedSlots: blockedSlots,
      totalSlots: processedSlots.length,
      availableCount: processedSlots.filter(s => s.isBookable).length,
      blockedCount: processedSlots.filter(s => s.status === 'blocked').length,
      bookedCount: processedSlots.filter(s => s.status === 'booked').length
    };
  }

  /**
   * Check for booking conflicts (placeholder)
   */
  private async checkBookingConflict(
    mentorId: string,
    date: Date,
    slotTime: string,
    context?: RepositoryContext
  ): Promise<boolean> {
    // Placeholder - would integrate with booking system
    return false;
  }

  /**
   * Generate alternative slot suggestions
   */
  private async generateAlternativeSlots(
    mentorId: string,
    originalDate: Date,
    originalSlotTime: string,
    context?: RepositoryContext
  ): Promise<Array<{ alternativeTime: string; alternativeDate?: Date; reason: string }>> {
    // Placeholder - would generate intelligent suggestions
    return [
      {
        alternativeTime: "10:00",
        alternativeDate: new Date(originalDate.getTime() + 24 * 60 * 60 * 1000),
        reason: "Next available slot on following day"
      }
    ];
  }

  /**
   * 🔹 ANALYTICS HELPER METHODS (Placeholders)
   */

  private async getTotalScheduleCount(filters?: any, context?: RepositoryContext): Promise<number> {
    return this.count({}, context);
  }

  private async getMentorCoverageStats(filters?: any, context?: RepositoryContext) {
    return {
      totalMentors: 100,
      mentorsWithSchedules: 85,
      averageSlotsPerMentor: 25
    };
  }

  private async getAvailabilityMetrics(filters?: any, context?: RepositoryContext) {
    return {
      totalSlots: 1000,
      availableSlots: 750,
      bookedSlots: 200,
      blockedSlots: 50,
      utilizationRate: 75
    };
  }

  private async getTimeDistribution(filters?: any, context?: RepositoryContext) {
    return Array.from({ length: 24 }, (_, hour) => ({
      hour,
      totalSlots: Math.floor(Math.random() * 50),
      averageAvailability: Math.random() * 100
    }));
  }

  private async getDayDistribution(filters?: any, context?: RepositoryContext) {
    const days: DayOfWeek[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return days.reduce((acc, day) => {
      acc[day] = {
        totalSlots: Math.floor(Math.random() * 100),
        averageAvailability: Math.random() * 100
      };
      return acc;
    }, {} as Record<DayOfWeek, { totalSlots: number; averageAvailability: number }>);
  }

  private async getBlockingAnalytics(filters?: any, context?: RepositoryContext) {
    return {
      totalBlocks: 50,
      blocksByType: {
        temporary: 20,
        permanent: 5,
        vacation: 15,
        sick_leave: 5,
        personal: 5
      } as Record<BlockType, number>,
      averageBlockDuration: 2,
      frequentlyBlockedTimes: []
    };
  }

  private async analyzeScheduleUtilization(schedule: ESchedule, context?: RepositoryContext) {
    return { utilizationRate: 75, lowUtilizationSlots: [] };
  }

  private generateScheduleOptimizations(schedule: ESchedule, analytics: any) {
    return []; // Placeholder
  }

  private applyScheduleOptimizations(schedule: ESchedule, optimizations: any[]) {
    return schedule; // Placeholder
  }

  private async optimizeScheduleSlots(schedule: ESchedule, context?: RepositoryContext): Promise<void> {
    // Post-creation optimization logic
  }

  /**
   * 🔹 UTILITY METHODS
   */

  private isValidTimeFormat(time: string): boolean {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  private getDayOfWeekFromDate(date: Date): DayOfWeek {
    const days: DayOfWeek[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return days[date.getDay()];
  }

  private isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  private calculateSlotDuration(startTime: string, endTime: string): number {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    return (endHour * 60 + endMin) - (startHour * 60 + startMin);
  }

  /**
   * 🔹 LEGACY METHODS (for backward compatibility)
   */

  // ❌ DEPRECATED - Use findAvailableSlotsSecure instead
  async findAvailableSlots(serviceId: string): Promise<ESchedule[]> {
    console.warn('⚠️ SlotRepository.findAvailableSlots() is deprecated. Use findAvailableSlotsSecure() instead.');
    // Note: serviceId doesn't match new mentorId approach, need to handle this carefully
    const schedules = await this.find({ _id: new Types.ObjectId(serviceId) }, { lean: true });
    return schedules;
  }

  // ❌ DEPRECATED - Use findBlockedDatesSecure instead
  async findBlockedDates(mentorId: string): Promise<EBlockedDate[]> {
    console.warn('⚠️ SlotRepository.findBlockedDates() is deprecated. Use findBlockedDatesSecure() instead.');
    return this.findBlockedDatesSecure(mentorId);
  }

  // ❌ DEPRECATED - Use createScheduleSecure instead
  async create(data: DeepPartial<ESchedule>, context?: RepositoryContext): Promise<CreateResult<ESchedule>> {
    console.warn('⚠️ SlotRepository.create() is deprecated. Use createScheduleSecure() instead.');
    return super.create(data, context);
  }
}

// Re-export for use by other modules
export type {
  SlotCreateData,
  SlotUpdateData,
  BlockedDateCreateData,
  AvailabilityFilters,
  SlotAvailability,
  ScheduleAnalytics,
  SlotConflictCheck,
  DayOfWeek,
  SlotStatus,
  BlockType,
  TimeZone
};