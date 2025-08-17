/**
 * 🔹 MODERN INDUSTRY STANDARD: Testimonial Repository
 * Type-safe, comprehensive testimonial repository implementation
 */

import { injectable } from "inversify";
import { Types, FilterQuery } from "mongoose";
import { ETestimonial } from "../../entities/testimonialEntity";
import { EBooking } from "../../entities/bookingEntity";
import { ITestimonialRepository } from "../interface/ITestimonialRepository";
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
import TestimonialModel from "../../models/testimonialsModel";
import BookingModel from "../../models/bookingModel";

/**
 * 🔹 TESTIMONIAL-SPECIFIC TYPES
 */
interface TestimonialCreateData {
  menteeId: string;
  mentorId: string;
  serviceId: string;
  bookingId: string;
  comment: string;
  rating: number;
}

interface TestimonialUpdateData {
  comment?: string;
  rating?: number;
  isApproved?: boolean;
  moderatorNotes?: string;
}

interface TestimonialFilters {
  mentorId?: string;
  serviceId?: string;
  menteeId?: string;
  bookingId?: string;
  rating?: number;
  isApproved?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

interface RatingStats {
  averageRating: number;
  totalCount: number;
  ratingDistribution: Record<number, number>;
}

/**
 * 🔹 MODERN TESTIMONIAL REPOSITORY
 * Industry-standard implementation with comprehensive error handling and type safety
 */
@injectable()
export default class ModernTestimonialRepository 
  extends EnhancedBaseRepository<ETestimonial>
  implements ITestimonialRepository {

  constructor() {
    super(TestimonialModel);
  }

  /**
   * 🔹 TESTIMONIAL-SPECIFIC CRUD OPERATIONS
   */

  /**
   * Create a new testimonial with comprehensive validation
   */
  async createTestimonial(
    data: TestimonialCreateData,
    context?: RepositoryContext
  ): Promise<CreateResult<ETestimonial>> {
    const operation = 'createTestimonial';

    try {
      // ✅ TYPE-SAFE VALIDATION
      this.validateTestimonialData(data, operation);

      // ✅ BUSINESS RULE VALIDATION
      await this.validateBusinessRules(data, operation, context);

      // ✅ USE ENHANCED BASE CREATE
      const result = await this.create(data, context);

      // ✅ UPDATE BOOKING IF TESTIMONIAL CREATED SUCCESSFULLY
      if (result.success && result.data) {
        await this.updateBookingWithTestimonial(data.bookingId, result.data._id.toString());
      }

      return result;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Find testimonial by ID with populated fields
   */
  async findTestimonialById(
    id: string,
    context?: RepositoryContext
  ): Promise<ETestimonial | null> {
    const options: FindOptions = {
      populate: [
        {
          path: 'menteeId',
          select: 'firstName lastName profilePicture'
        },
        {
          path: 'serviceId',
          select: 'title type category'
        }
      ]
    };

    return this.findById(id, options, context);
  }

  /**
   * Find testimonial by booking ID
   */
  async findByBookingId(
    bookingId: string,
    context?: RepositoryContext
  ): Promise<ETestimonial | null> {
    this.validateObjectId(bookingId, 'findByBookingId');

    const filter: FilterQuery<ETestimonial> = { bookingId };
    const options: FindOptions = {
      populate: [
        {
          path: 'menteeId',
          select: 'firstName lastName profilePicture'
        }
      ],
      lean: true
    };

    return this.findOne(filter, options, context);
  }

  /**
   * Find testimonials by mentor with pagination
   */
  async findByMentor(
    mentorId: string,
    pagination: PaginationParams,
    filters?: TestimonialFilters,
    context?: RepositoryContext
  ): Promise<PaginatedResponse<ETestimonial>> {
    this.validateObjectId(mentorId, 'findByMentor');

    const filter: FilterQuery<ETestimonial> = {
      mentorId: new Types.ObjectId(mentorId),
      ...this.buildFilterQuery(filters)
    };

    const options: FindOptions = {
      populate: [
        {
          path: 'menteeId',
          select: 'firstName lastName profilePicture'
        },
        {
          path: 'serviceId',
          select: 'title type category'
        }
      ],
      sort: { createdAt: -1 }
    };

    return this.findPaginated(filter, pagination, options, context);
  }

  /**
   * Find testimonials by mentor and service
   */
  async findByMentorAndService(
    mentorId: string,
    serviceId: string,
    pagination: PaginationParams,
    context?: RepositoryContext
  ): Promise<PaginatedResponse<ETestimonial>> {
    this.validateObjectId(mentorId, 'findByMentorAndService');
    this.validateObjectId(serviceId, 'findByMentorAndService');

    const filter: FilterQuery<ETestimonial> = {
      mentorId: new Types.ObjectId(mentorId),
      serviceId: new Types.ObjectId(serviceId)
    };

    const options: FindOptions = {
      populate: [
        {
          path: 'menteeId',
          select: 'firstName lastName profilePicture'
        },
        {
          path: 'serviceId',
          select: 'title type'
        }
      ],
      sort: { createdAt: -1 }
    };

    return this.findPaginated(filter, pagination, options, context);
  }

  /**
   * Update testimonial with validation
   */
  async updateTestimonial(
    id: string,
    data: TestimonialUpdateData,
    context?: RepositoryContext
  ): Promise<UpdateResult<ETestimonial>> {
    const operation = 'updateTestimonial';

    try {
      // ✅ VALIDATE UPDATE DATA
      this.validateTestimonialUpdateData(data, operation);

      // ✅ USE ENHANCED BASE UPDATE
      return this.update(id, data, {
        new: true,
        runValidators: true,
        populate: [
          {
            path: 'menteeId',
            select: 'firstName lastName profilePicture'
          },
          {
            path: 'serviceId',
            select: 'title type'
          }
        ]
      }, context);

    } catch (error: any) {
      this.handleError(error, operation, id, context);
    }
  }

  /**
   * 🔹 ADVANCED TESTIMONIAL OPERATIONS
   */

  /**
   * Get top testimonials with advanced filtering
   */
  async getTopTestimonials(
    limit: number = 10,
    minRating: number = 4,
    context?: RepositoryContext
  ): Promise<ETestimonial[]> {
    const operation = 'getTopTestimonials';

    try {
      RepositoryLogger.logStart(operation, this.entityName, undefined, { limit, minRating });

      if (limit <= 0 || limit > 100) {
        throw RepositoryErrorFactory.validationError(
          'Limit must be between 1 and 100',
          operation,
          this.entityName,
          undefined,
          { limit }
        );
      }

      const filter: FilterQuery<ETestimonial> = {
        rating: { $gte: minRating },
        isApproved: true
      };

      const options: FindOptions = {
        populate: [
          {
            path: 'menteeId',
            select: 'firstName lastName profilePicture'
          },
          {
            path: 'mentorId',
            select: 'firstName lastName'
          },
          {
            path: 'serviceId',
            select: 'title category'
          }
        ],
        sort: { rating: -1, createdAt: -1 },
        limit,
        lean: true
      };

      const testimonials = await this.find(filter, options, context);

      RepositoryLogger.logSuccess(operation, this.entityName, undefined, { 
        count: testimonials.length, 
        minRating 
      });

      return testimonials;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Get average rating statistics for a service
   */
  async getServiceRatingStats(
    serviceId: string,
    context?: RepositoryContext
  ): Promise<RatingStats> {
    const operation = 'getServiceRatingStats';

    try {
      this.validateObjectId(serviceId, operation);
      RepositoryLogger.logStart(operation, this.entityName, serviceId);

      const pipeline = [
        { 
          $match: { 
            serviceId: new Types.ObjectId(serviceId),
            isApproved: true
          } 
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalCount: { $sum: 1 },
            ratings: { $push: '$rating' }
          }
        },
        {
          $addFields: {
            ratingDistribution: {
              $reduce: {
                input: '$ratings',
                initialValue: {},
                in: {
                  $mergeObjects: [
                    '$$value',
                    {
                      $arrayToObject: [[
                        { k: { $toString: '$$this' }, v: { $add: [{ $ifNull: [{ $getField: { field: { $toString: '$$this' }, input: '$$value' } }, 0] }, 1] } }
                      ]]
                    }
                  ]
                }
              }
            }
          }
        }
      ];

      const result = await this.aggregate<any>(pipeline, context);

      if (result.data.length === 0) {
        return {
          averageRating: 0,
          totalCount: 0,
          ratingDistribution: {}
        };
      }

      const stats = result.data[0];
      
      RepositoryLogger.logSuccess(operation, this.entityName, serviceId, { 
        averageRating: stats.averageRating,
        totalCount: stats.totalCount
      });

      return {
        averageRating: parseFloat(stats.averageRating.toFixed(1)),
        totalCount: stats.totalCount,
        ratingDistribution: stats.ratingDistribution || {}
      };

    } catch (error: any) {
      this.handleError(error, operation, serviceId, context);
    }
  }

  /**
   * Get mentor rating statistics
   */
  async getMentorRatingStats(
    mentorId: string,
    context?: RepositoryContext
  ): Promise<RatingStats> {
    const operation = 'getMentorRatingStats';

    try {
      this.validateObjectId(mentorId, operation);

      const pipeline = [
        { 
          $match: { 
            mentorId: new Types.ObjectId(mentorId),
            isApproved: true
          } 
        },
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: { $multiply: ['$_id', '$count'] } },
            totalCount: { $sum: '$count' },
            ratingDistribution: {
              $push: {
                k: { $toString: '$_id' },
                v: '$count'
              }
            }
          }
        },
        {
          $addFields: {
            averageRating: { $divide: ['$averageRating', '$totalCount'] },
            ratingDistribution: { $arrayToObject: '$ratingDistribution' }
          }
        }
      ];

      const result = await this.aggregate<any>(pipeline, context);

      if (result.data.length === 0) {
        return {
          averageRating: 0,
          totalCount: 0,
          ratingDistribution: {}
        };
      }

      const stats = result.data[0];

      return {
        averageRating: parseFloat(stats.averageRating.toFixed(1)),
        totalCount: stats.totalCount,
        ratingDistribution: stats.ratingDistribution
      };

    } catch (error: any) {
      this.handleError(error, operation, mentorId, context);
    }
  }

  /**
   * 🔹 BOOKING OPERATIONS
   */

  /**
   * Find booking by ID with population
   */
  async findBookingById(bookingId: string, context?: RepositoryContext): Promise<EBooking | null> {
    const operation = 'findBookingById';

    try {
      this.validateObjectId(bookingId, operation);
      RepositoryLogger.logStart(operation, 'Booking', bookingId);

      const booking = await BookingModel.findById(bookingId)
        .populate('mentorId', 'firstName lastName profilePicture')
        .populate('serviceId', 'title type category')
        .populate('menteeId', 'firstName lastName profilePicture')
        .lean() as EBooking | null;

      if (!booking) {
        throw RepositoryErrorFactory.notFoundError('Booking', bookingId, operation);
      }

      RepositoryLogger.logSuccess(operation, 'Booking', bookingId);
      return booking;

    } catch (error: any) {
      if (error.code === RepositoryErrorCode.ENTITY_NOT_FOUND) {
        throw error;
      }
      this.handleError(error, operation, bookingId, context);
    }
  }

  /**
   * Update booking with testimonial reference
   */
  async updateBookingWithTestimonial(
    bookingId: string,
    testimonialId: string,
    context?: RepositoryContext
  ): Promise<void> {
    const operation = 'updateBookingWithTestimonial';

    try {
      this.validateObjectId(bookingId, operation);
      this.validateObjectId(testimonialId, operation);

      RepositoryLogger.logStart(operation, 'Booking', bookingId, { testimonialId });

      const result = await BookingModel.findByIdAndUpdate(
        bookingId,
        { 
          testimonials: testimonialId,
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!result) {
        throw RepositoryErrorFactory.notFoundError('Booking', bookingId, operation);
      }

      RepositoryLogger.logSuccess(operation, 'Booking', bookingId, { testimonialId });

    } catch (error: any) {
      this.handleError(error, operation, bookingId, context);
    }
  }

  /**
   * 🔹 VALIDATION METHODS
   */

  /**
   * Validate testimonial creation data
   */
  private validateTestimonialData(data: TestimonialCreateData, operation: string): void {
    const errors: string[] = [];

    // Validate required fields
    if (!data.menteeId) errors.push('menteeId is required');
    if (!data.mentorId) errors.push('mentorId is required');
    if (!data.serviceId) errors.push('serviceId is required');
    if (!data.bookingId) errors.push('bookingId is required');
    if (!data.comment || data.comment.trim().length === 0) errors.push('comment is required');
    if (typeof data.rating !== 'number') errors.push('rating must be a number');

    // Validate ObjectIds
    if (data.menteeId && !Types.ObjectId.isValid(data.menteeId)) {
      errors.push('Invalid menteeId format');
    }
    if (data.mentorId && !Types.ObjectId.isValid(data.mentorId)) {
      errors.push('Invalid mentorId format');
    }
    if (data.serviceId && !Types.ObjectId.isValid(data.serviceId)) {
      errors.push('Invalid serviceId format');
    }
    if (data.bookingId && !Types.ObjectId.isValid(data.bookingId)) {
      errors.push('Invalid bookingId format');
    }

    // Validate rating range
    if (typeof data.rating === 'number' && (data.rating < 1 || data.rating > 5)) {
      errors.push('Rating must be between 1 and 5');
    }

    // Validate comment length
    if (data.comment && data.comment.length > 1000) {
      errors.push('Comment must be less than 1000 characters');
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
   * Validate testimonial update data
   */
  private validateTestimonialUpdateData(data: TestimonialUpdateData, operation: string): void {
    const errors: string[] = [];

    // Validate rating if provided
    if (data.rating !== undefined) {
      if (typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5) {
        errors.push('Rating must be a number between 1 and 5');
      }
    }

    // Validate comment length if provided
    if (data.comment !== undefined) {
      if (typeof data.comment !== 'string') {
        errors.push('Comment must be a string');
      } else if (data.comment.length > 1000) {
        errors.push('Comment must be less than 1000 characters');
      } else if (data.comment.trim().length === 0) {
        errors.push('Comment cannot be empty');
      }
    }

    // Validate boolean fields
    if (data.isApproved !== undefined && typeof data.isApproved !== 'boolean') {
      errors.push('isApproved must be a boolean');
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
   * Validate business rules
   */
  private async validateBusinessRules(
    data: TestimonialCreateData,
    operation: string,
    context?: RepositoryContext
  ): Promise<void> {
    // Check if testimonial already exists for this booking
    const existingTestimonial = await this.findByBookingId(data.bookingId, context);
    if (existingTestimonial) {
      throw RepositoryErrorFactory.duplicateError(
        this.entityName,
        operation,
        'bookingId',
        data.bookingId
      );
    }

    // Verify booking exists and belongs to the mentee
    const booking = await this.findBookingById(data.bookingId, context);
    if (booking.menteeId.toString() !== data.menteeId) {
      throw RepositoryErrorFactory.validationError(
        'Booking does not belong to the specified mentee',
        operation,
        this.entityName,
        undefined,
        { bookingId: data.bookingId, menteeId: data.menteeId }
      );
    }

    // Verify booking is completed
    if (booking.status !== 'completed') {
      throw RepositoryErrorFactory.validationError(
        'Testimonials can only be created for completed bookings',
        operation,
        this.entityName,
        undefined,
        { bookingId: data.bookingId, bookingStatus: booking.status }
      );
    }
  }

  /**
   * Build filter query from testimonial filters
   */
  private buildFilterQuery(filters?: TestimonialFilters): FilterQuery<ETestimonial> {
    if (!filters) return {};

    const query: FilterQuery<ETestimonial> = {};

    if (filters.serviceId) {
      query.serviceId = new Types.ObjectId(filters.serviceId);
    }

    if (filters.menteeId) {
      query.menteeId = new Types.ObjectId(filters.menteeId);
    }

    if (filters.rating) {
      query.rating = filters.rating;
    }

    if (filters.isApproved !== undefined) {
      query.isApproved = filters.isApproved;
    }

    if (filters.dateRange) {
      query.createdAt = {
        $gte: filters.dateRange.start,
        $lte: filters.dateRange.end
      };
    }

    return query;
  }

  /**
   * 🔹 LEGACY METHODS (for backward compatibility)
   */

  // ❌ DEPRECATED - Use createTestimonial instead
  async create(data: DeepPartial<ETestimonial>, context?: RepositoryContext): Promise<CreateResult<ETestimonial>> {
    console.warn('⚠️ TestimonialRepository.create() is deprecated. Use createTestimonial() instead.');
    return super.create(data, context);
  }

  // Legacy methods to maintain interface compatibility
  async findByMentor(mentorId: string, skip: number, limit: number): Promise<ETestimonial[]> {
    const pagination: PaginationParams = {
      page: Math.floor(skip / limit) + 1,
      limit,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };

    const result = await this.findByMentor(mentorId, pagination);
    return result.data;
  }

  async countByMentor(mentorId: string): Promise<number> {
    const filter: FilterQuery<ETestimonial> = { mentorId: new Types.ObjectId(mentorId) };
    return this.count(filter);
  }

  async getAverageRatingByService(serviceId: string): Promise<number> {
    const stats = await this.getServiceRatingStats(serviceId);
    return stats.averageRating;
  }
}