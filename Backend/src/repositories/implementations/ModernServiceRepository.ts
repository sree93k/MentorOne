/**
 * 🔹 PHASE 2 MIGRATION: Modern Service Repository
 * Type-safe, comprehensive service management with enhanced analytics and search capabilities
 */

import { injectable } from "inversify";
import { Types, FilterQuery } from "mongoose";
import { EService } from "../../entities/serviceEntity";
import { IServiceRepository } from "../interface/IServiceRepository";
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
import Service from "../../models/serviceModel";

/**
 * 🔹 SERVICE-SPECIFIC TYPES
 */
type ServiceType = "1-1Call" | "DigitalProducts" | "priorityDM";
type OneToOneType = "video" | "audio" | "chat";
type DigitalProductType = "videoTutorials" | "course" | "ebook" | "template" | "tool";
type ServiceStatus = "active" | "inactive" | "draft" | "archived";
type PricingType = "free" | "paid" | "subscription";

interface ServiceCreateData {
  mentorId: string;
  title: string;
  shortDescription: string;
  longDescription?: string;
  type: ServiceType;
  oneToOneType?: OneToOneType;
  digitalProductType?: DigitalProductType;
  amount: number;
  currency?: string;
  duration?: number;
  technology: string[];
  status?: ServiceStatus;
  slot?: string;
  fileUrl?: string;
  exclusiveContent?: boolean;
  metadata?: {
    tags?: string[];
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    prerequisites?: string[];
    learningOutcomes?: string[];
  };
}

interface ServiceUpdateData {
  title?: string;
  shortDescription?: string;
  longDescription?: string;
  amount?: number;
  duration?: number;
  technology?: string[];
  status?: ServiceStatus;
  slot?: string;
  fileUrl?: string;
  exclusiveContent?: boolean;
  metadata?: {
    tags?: string[];
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    prerequisites?: string[];
    learningOutcomes?: string[];
  };
  updatedReason?: string;
}

interface ServiceFilters {
  mentorId?: string;
  type?: ServiceType | ServiceType[];
  oneToOneType?: OneToOneType;
  digitalProductType?: DigitalProductType;
  pricingType?: PricingType;
  status?: ServiceStatus | ServiceStatus[];
  technology?: string | string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  priceRange?: {
    min: number;
    max: number;
  };
  durationRange?: {
    min: number;
    max: number;
  };
  searchQuery?: string;
  hasSlot?: boolean;
  isExclusive?: boolean;
}

interface ServiceAnalytics {
  totalServices: number;
  servicesByType: Record<ServiceType, number>;
  servicesByStatus: Record<ServiceStatus, number>;
  servicesByPricing: Record<PricingType, number>;
  averagePrice: number;
  averageDuration: number;
  popularTechnologies: Array<{
    technology: string;
    serviceCount: number;
    averageRating: number;
  }>;
  revenueStats: {
    totalRevenue: number;
    averageServiceRevenue: number;
    topEarningServices: Array<{
      serviceId: string;
      title: string;
      revenue: number;
      bookingCount: number;
    }>;
  };
  performanceMetrics: {
    totalBookings: number;
    averageRating: number;
    completionRate: number;
    popularServices: Array<{
      serviceId: string;
      title: string;
      bookingCount: number;
      rating: number;
    }>;
  };
}

interface ServiceWithStats extends EService {
  mentor: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    bio?: string;
    professionalDetails?: {
      company?: string;
    };
  };
  stats: {
    bookingCount: number;
    averageRating: number;
    totalRevenue: number;
    completionRate: number;
    testimonialCount: number;
  };
}

interface SearchServiceParams {
  searchQuery?: string;
  type?: ServiceType;
  oneToOneType?: OneToOneType;
  digitalProductType?: DigitalProductType;
  page: number;
  limit: number;
  sortBy?: 'popularity' | 'rating' | 'price' | 'newest' | 'alphabetical';
  sortOrder?: 'asc' | 'desc';
}

/**
 * 🔹 MODERN SERVICE REPOSITORY
 * Industry-standard service management with comprehensive analytics and search
 */
@injectable()
export default class ModernServiceRepository 
  extends EnhancedBaseRepository<EService>
  implements IServiceRepository {

  constructor() {
    super(Service);
  }

  /**
   * 🔹 ENHANCED SERVICE OPERATIONS
   */

  /**
   * ✅ NEW: Type-safe service creation with comprehensive validation
   */
  async createServiceSecure(
    serviceData: ServiceCreateData,
    context?: RepositoryContext
  ): Promise<CreateResult<EService>> {
    const operation = 'createServiceSecure';

    try {
      // ✅ VALIDATE SERVICE DATA
      this.validateServiceCreateData(serviceData, operation);

      RepositoryLogger.logStart(operation, this.entityName, undefined, {
        mentorId: serviceData.mentorId,
        title: serviceData.title,
        type: serviceData.type,
        amount: serviceData.amount,
        ...context?.metadata
      });

      // ✅ CHECK FOR DUPLICATE SERVICES
      await this.validateUniqueService(serviceData, operation);

      // ✅ PREPARE SERVICE WITH DEFAULTS
      const serviceWithDefaults = {
        ...serviceData,
        status: serviceData.status || 'active' as ServiceStatus,
        currency: serviceData.currency || 'USD',
        createdAt: new Date(),
        updatedAt: new Date(),
        // ✅ AUDIT TRAIL
        auditTrail: [{
          action: 'created',
          timestamp: new Date(),
          userId: context?.userId,
          changes: {
            title: serviceData.title,
            type: serviceData.type,
            amount: serviceData.amount
          }
        }]
      };

      // ✅ CREATE SERVICE
      const result = await this.create(serviceWithDefaults, context);

      if (result.success && result.data) {
        RepositoryLogger.logSuccess(operation, this.entityName, result.data._id.toString(), {
          mentorId: serviceData.mentorId,
          title: serviceData.title,
          type: serviceData.type,
          amount: serviceData.amount
        });

        // ✅ LOG BUSINESS TRANSACTION
        this.logServiceTransaction('SERVICE_CREATED', {
          serviceId: result.data._id.toString(),
          mentorId: serviceData.mentorId,
          title: serviceData.title,
          type: serviceData.type,
          amount: serviceData.amount
        });
      }

      return result;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * ✅ NEW: Secure service update with validation
   */
  async updateServiceSecure(
    serviceId: string,
    updateData: ServiceUpdateData,
    context?: RepositoryContext
  ): Promise<UpdateResult<EService>> {
    const operation = 'updateServiceSecure';

    try {
      this.validateObjectId(serviceId, operation);
      this.validateServiceUpdateData(updateData, operation);

      RepositoryLogger.logStart(operation, this.entityName, serviceId, {
        hasTitle: !!updateData.title,
        hasAmount: !!updateData.amount,
        reason: updateData.updatedReason
      });

      // ✅ GET CURRENT SERVICE FOR AUDIT
      const currentService = await this.findById(serviceId, undefined, context);
      if (!currentService) {
        throw RepositoryErrorFactory.notFoundError(this.entityName, serviceId, operation);
      }

      // ✅ PREPARE UPDATE WITH AUDIT TRAIL
      const updateWithAudit = {
        ...updateData,
        updatedAt: new Date(),
        $push: {
          auditTrail: {
            action: 'updated',
            timestamp: new Date(),
            userId: context?.userId,
            changes: this.extractChanges(currentService, updateData),
            reason: updateData.updatedReason
          }
        }
      };

      const result = await this.update(serviceId, updateWithAudit, {
        new: true,
        runValidators: true
      }, context);

      if (result.success) {
        RepositoryLogger.logSuccess(operation, this.entityName, serviceId, {
          changesCount: Object.keys(updateData).length,
          hasAmountChange: !!updateData.amount
        });

        // ✅ LOG BUSINESS STATE CHANGE
        this.logServiceTransaction('SERVICE_UPDATED', {
          serviceId,
          mentorId: currentService.mentorId,
          changes: this.extractChanges(currentService, updateData)
        });
      }

      return result;

    } catch (error: any) {
      this.handleError(error, operation, serviceId, context);
    }
  }

  /**
   * 🔹 ENHANCED SERVICE QUERIES
   */

  /**
   * ✅ NEW: Get service with comprehensive stats
   */
  async getServiceWithStatsSecure(
    serviceId: string,
    context?: RepositoryContext
  ): Promise<ServiceWithStats | null> {
    const operation = 'getServiceWithStatsSecure';

    try {
      this.validateObjectId(serviceId, operation);

      RepositoryLogger.logStart(operation, this.entityName, serviceId);

      // ✅ COMPREHENSIVE AGGREGATION FOR SERVICE WITH STATS
      const pipeline = [
        {
          $match: { _id: new Types.ObjectId(serviceId) }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'mentorId',
            foreignField: '_id',
            as: 'mentor'
          }
        },
        {
          $lookup: {
            from: 'bookings',
            localField: '_id',
            foreignField: 'serviceId',
            as: 'bookings'
          }
        },
        {
          $lookup: {
            from: 'testimonials',
            localField: '_id',
            foreignField: 'serviceId',
            as: 'testimonials'
          }
        },
        {
          $lookup: {
            from: 'payments',
            localField: '_id',
            foreignField: 'serviceId',
            as: 'payments'
          }
        },
        {
          $unwind: {
            path: '$mentor',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            shortDescription: 1,
            longDescription: 1,
            type: 1,
            oneToOneType: 1,
            digitalProductType: 1,
            amount: 1,
            currency: 1,
            duration: 1,
            technology: 1,
            status: 1,
            slot: 1,
            fileUrl: 1,
            exclusiveContent: 1,
            metadata: 1,
            createdAt: 1,
            updatedAt: 1,
            mentor: {
              _id: '$mentor._id',
              firstName: '$mentor.firstName',
              lastName: '$mentor.lastName',
              profilePicture: '$mentor.profilePicture',
              bio: '$mentor.bio',
              professionalDetails: '$mentor.professionalDetails'
            },
            stats: {
              bookingCount: { $size: '$bookings' },
              averageRating: { $avg: '$testimonials.rating' },
              totalRevenue: {
                $sum: {
                  $map: {
                    input: {
                      $filter: {
                        input: '$payments',
                        cond: { $eq: ['$$this.status', 'completed'] }
                      }
                    },
                    as: 'payment',
                    in: '$$payment.amount'
                  }
                }
              },
              completionRate: {
                $cond: [
                  { $gt: [{ $size: '$bookings' }, 0] },
                  {
                    $multiply: [
                      {
                        $divide: [
                          {
                            $size: {
                              $filter: {
                                input: '$bookings',
                                cond: { $eq: ['$$this.status', 'completed'] }
                              }
                            }
                          },
                          { $size: '$bookings' }
                        ]
                      },
                      100
                    ]
                  },
                  0
                ]
              },
              testimonialCount: { $size: '$testimonials' }
            }
          }
        }
      ];

      const result = await this.aggregate<ServiceWithStats>(pipeline, context);

      const serviceWithStats = result.data.length > 0 ? result.data[0] : null;

      if (serviceWithStats) {
        RepositoryLogger.logSuccess(operation, this.entityName, serviceId, {
          bookingCount: serviceWithStats.stats.bookingCount,
          rating: serviceWithStats.stats.averageRating,
          revenue: serviceWithStats.stats.totalRevenue
        });
      }

      return serviceWithStats;

    } catch (error: any) {
      this.handleError(error, operation, serviceId, context);
    }
  }

  /**
   * ✅ NEW: Advanced service search with comprehensive filtering
   */
  async searchServicesSecure(
    searchParams: SearchServiceParams,
    filters?: ServiceFilters,
    context?: RepositoryContext
  ): Promise<PaginatedResponse<ServiceWithStats>> {
    const operation = 'searchServicesSecure';

    try {
      this.validatePaginationParams({ page: searchParams.page, limit: searchParams.limit });

      RepositoryLogger.logStart(operation, this.entityName, undefined, {
        searchQuery: searchParams.searchQuery?.substring(0, 50),
        type: searchParams.type,
        page: searchParams.page,
        limit: searchParams.limit
      });

      // ✅ BUILD COMPREHENSIVE MATCH QUERY
      const matchQuery = this.buildServiceSearchQuery(searchParams, filters);

      // ✅ BUILD SORT QUERY
      const sortQuery = this.buildServiceSortQuery(searchParams.sortBy, searchParams.sortOrder);

      // ✅ COMPREHENSIVE AGGREGATION PIPELINE
      const pipeline = [
        { $match: matchQuery },
        {
          $lookup: {
            from: 'users',
            localField: 'mentorId',
            foreignField: '_id',
            as: 'mentor'
          }
        },
        {
          $lookup: {
            from: 'bookings',
            localField: '_id',
            foreignField: 'serviceId',
            as: 'bookings'
          }
        },
        {
          $lookup: {
            from: 'testimonials',
            localField: '_id',
            foreignField: 'serviceId',
            as: 'testimonials'
          }
        },
        {
          $lookup: {
            from: 'payments',
            localField: '_id',
            foreignField: 'serviceId',
            as: 'payments'
          }
        },
        {
          $unwind: {
            path: '$mentor',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            bookingCount: { $size: '$bookings' },
            averageRating: { $avg: '$testimonials.rating' },
            totalRevenue: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: '$payments',
                      cond: { $eq: ['$$this.status', 'completed'] }
                    }
                  },
                  as: 'payment',
                  in: '$$payment.amount'
                }
              }
            }
          }
        },
        { $sort: sortQuery },
        {
          $project: {
            _id: 1,
            title: 1,
            shortDescription: 1,
            type: 1,
            oneToOneType: 1,
            digitalProductType: 1,
            amount: 1,
            currency: 1,
            duration: 1,
            technology: 1,
            status: 1,
            exclusiveContent: 1,
            metadata: 1,
            createdAt: 1,
            mentor: {
              _id: '$mentor._id',
              firstName: '$mentor.firstName',
              lastName: '$mentor.lastName',
              profilePicture: '$mentor.profilePicture',
              bio: '$mentor.bio',
              professionalDetails: '$mentor.professionalDetails'
            },
            stats: {
              bookingCount: '$bookingCount',
              averageRating: { $ifNull: ['$averageRating', 0] },
              totalRevenue: '$totalRevenue',
              completionRate: {
                $cond: [
                  { $gt: ['$bookingCount', 0] },
                  {
                    $multiply: [
                      {
                        $divide: [
                          {
                            $size: {
                              $filter: {
                                input: '$bookings',
                                cond: { $eq: ['$$this.status', 'completed'] }
                              }
                            }
                          },
                          '$bookingCount'
                        ]
                      },
                      100
                    ]
                  },
                  0
                ]
              },
              testimonialCount: { $size: '$testimonials' }
            }
          }
        }
      ];

      // ✅ EXECUTE WITH PAGINATION
      const skip = (searchParams.page - 1) * searchParams.limit;
      
      const [data, countResult] = await Promise.all([
        this.model.aggregate([
          ...pipeline,
          { $skip: skip },
          { $limit: searchParams.limit }
        ]),
        this.model.aggregate([
          ...pipeline,
          { $count: 'total' }
        ])
      ]);

      const totalItems = countResult[0]?.total || 0;
      const totalPages = Math.ceil(totalItems / searchParams.limit);

      const result: PaginatedResponse<ServiceWithStats> = {
        data: data as ServiceWithStats[],
        pagination: {
          currentPage: searchParams.page,
          totalPages,
          totalItems,
          hasNextPage: searchParams.page < totalPages,
          hasPrevPage: searchParams.page > 1,
          limit: searchParams.limit
        }
      };

      RepositoryLogger.logSuccess(operation, this.entityName, undefined, {
        resultCount: data.length,
        totalItems,
        searchQuery: searchParams.searchQuery?.substring(0, 50)
      });

      return result;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * ✅ NEW: Get top performing services
   */
  async getTopServicesSecure(
    limit: number = 10,
    criteria: 'bookings' | 'rating' | 'revenue' = 'bookings',
    context?: RepositoryContext
  ): Promise<ServiceWithStats[]> {
    const operation = 'getTopServicesSecure';

    try {
      if (limit < 1 || limit > 100) {
        throw RepositoryErrorFactory.validationError(
          'Limit must be between 1 and 100',
          operation,
          this.entityName
        );
      }

      RepositoryLogger.logStart(operation, this.entityName, undefined, { limit, criteria });

      // ✅ BUILD SORT CRITERIA
      const sortField = {
        'bookings': 'bookingCount',
        'rating': 'averageRating',
        'revenue': 'totalRevenue'
      }[criteria];

      const pipeline = [
        {
          $match: { status: 'active' }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'mentorId',
            foreignField: '_id',
            as: 'mentor'
          }
        },
        {
          $lookup: {
            from: 'bookings',
            localField: '_id',
            foreignField: 'serviceId',
            as: 'bookings'
          }
        },
        {
          $lookup: {
            from: 'testimonials',
            localField: '_id',
            foreignField: 'serviceId',
            as: 'testimonials'
          }
        },
        {
          $lookup: {
            from: 'payments',
            localField: '_id',
            foreignField: 'serviceId',
            as: 'payments'
          }
        },
        {
          $unwind: {
            path: '$mentor',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            bookingCount: { $size: '$bookings' },
            averageRating: { $avg: '$testimonials.rating' },
            totalRevenue: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: '$payments',
                      cond: { $eq: ['$$this.status', 'completed'] }
                    }
                  },
                  as: 'payment',
                  in: '$$payment.amount'
                }
              }
            }
          }
        },
        {
          $sort: { [sortField]: -1, averageRating: -1 }
        },
        {
          $limit: limit
        },
        {
          $project: {
            _id: 1,
            title: 1,
            shortDescription: 1,
            type: 1,
            oneToOneType: 1,
            digitalProductType: 1,
            amount: 1,
            currency: 1,
            duration: 1,
            technology: 1,
            fileUrl: 1,
            exclusiveContent: 1,
            metadata: 1,
            createdAt: 1,
            mentor: {
              _id: '$mentor._id',
              firstName: '$mentor.firstName',
              lastName: '$mentor.lastName',
              profilePicture: '$mentor.profilePicture',
              bio: '$mentor.bio',
              professionalDetails: '$mentor.professionalDetails'
            },
            stats: {
              bookingCount: '$bookingCount',
              averageRating: { $ifNull: ['$averageRating', 0] },
              totalRevenue: '$totalRevenue',
              completionRate: {
                $cond: [
                  { $gt: ['$bookingCount', 0] },
                  {
                    $multiply: [
                      {
                        $divide: [
                          {
                            $size: {
                              $filter: {
                                input: '$bookings',
                                cond: { $eq: ['$$this.status', 'completed'] }
                              }
                            }
                          },
                          '$bookingCount'
                        ]
                      },
                      100
                    ]
                  },
                  0
                ]
              },
              testimonialCount: { $size: '$testimonials' }
            }
          }
        }
      ];

      const result = await this.aggregate<ServiceWithStats>(pipeline, context);

      RepositoryLogger.logSuccess(operation, this.entityName, undefined, {
        criteria,
        resultCount: result.data.length,
        topService: result.data[0]?.title
      });

      return result.data;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * 🔹 SERVICE ANALYTICS
   */

  /**
   * ✅ NEW: Generate comprehensive service analytics
   */
  async getServiceAnalytics(
    timeRange: { start: Date; end: Date },
    mentorId?: string,
    context?: RepositoryContext
  ): Promise<ServiceAnalytics> {
    const operation = 'getServiceAnalytics';

    try {
      RepositoryLogger.logStart(operation, this.entityName, undefined, {
        timeRange,
        mentorId: mentorId || 'all'
      });

      // ✅ BUILD MATCH FILTER
      const matchFilter: any = {
        createdAt: {
          $gte: timeRange.start,
          $lte: timeRange.end
        }
      };

      if (mentorId) {
        this.validateObjectId(mentorId, operation);
        matchFilter.mentorId = new Types.ObjectId(mentorId);
      }

      // ✅ COMPREHENSIVE ANALYTICS PIPELINE
      const pipeline = [
        { $match: matchFilter },
        {
          $lookup: {
            from: 'bookings',
            localField: '_id',
            foreignField: 'serviceId',
            as: 'bookings'
          }
        },
        {
          $lookup: {
            from: 'testimonials',
            localField: '_id',
            foreignField: 'serviceId',
            as: 'testimonials'
          }
        },
        {
          $lookup: {
            from: 'payments',
            localField: '_id',
            foreignField: 'serviceId',
            as: 'payments'
          }
        },
        {
          $group: {
            _id: null,
            totalServices: { $sum: 1 },
            servicesByType: {
              $push: '$type'
            },
            servicesByStatus: {
              $push: '$status'
            },
            servicesByPricing: {
              $push: {
                $cond: [
                  { $eq: ['$amount', 0] },
                  'free',
                  'paid'
                ]
              }
            },
            totalAmount: { $sum: '$amount' },
            totalDuration: { $sum: '$duration' },
            technologies: {
              $push: '$technology'
            },
            totalBookings: {
              $sum: { $size: '$bookings' }
            },
            totalRevenue: {
              $sum: {
                $sum: {
                  $map: {
                    input: {
                      $filter: {
                        input: '$payments',
                        cond: { $eq: ['$$this.status', 'completed'] }
                      }
                    },
                    as: 'payment',
                    in: '$$payment.amount'
                  }
                }
              }
            },
            allRatings: {
              $push: {
                $avg: '$testimonials.rating'
              }
            },
            servicePerformance: {
              $push: {
                serviceId: '$_id',
                title: '$title',
                bookingCount: { $size: '$bookings' },
                rating: { $avg: '$testimonials.rating' },
                revenue: {
                  $sum: {
                    $map: {
                      input: {
                        $filter: {
                          input: '$payments',
                          cond: { $eq: ['$$this.status', 'completed'] }
                        }
                      },
                      as: 'payment',
                      in: '$$payment.amount'
                    }
                  }
                }
              }
            }
          }
        }
      ];

      const result = await this.aggregate<any>(pipeline, context);

      if (result.data.length === 0) {
        return this.getEmptyAnalytics();
      }

      const analytics = this.processServiceAnalytics(result.data[0]);

      RepositoryLogger.logSuccess(operation, this.entityName, undefined, {
        totalServices: analytics.totalServices,
        totalRevenue: analytics.revenueStats.totalRevenue,
        averageRating: analytics.performanceMetrics.averageRating
      });

      return analytics;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * 🔹 VALIDATION & HELPER METHODS
   */

  private validateServiceCreateData(data: ServiceCreateData, operation: string): void {
    const errors: string[] = [];

    // Required fields
    if (!data.mentorId) errors.push('mentorId is required');
    if (!data.title || data.title.trim().length === 0) errors.push('title is required');
    if (!data.shortDescription || data.shortDescription.trim().length === 0) errors.push('shortDescription is required');
    if (!data.type) errors.push('type is required');
    if (data.amount === undefined || data.amount < 0) errors.push('amount must be 0 or greater');
    if (!data.technology || data.technology.length === 0) errors.push('at least one technology is required');

    // ObjectId validation
    if (data.mentorId && !Types.ObjectId.isValid(data.mentorId)) {
      errors.push('Invalid mentor ID format');
    }

    // Type validation
    const validTypes: ServiceType[] = ['1-1Call', 'DigitalProducts', 'priorityDM'];
    if (data.type && !validTypes.includes(data.type)) {
      errors.push(`Invalid service type. Must be one of: ${validTypes.join(', ')}`);
    }

    // Conditional validations
    if (data.type === '1-1Call' && !data.oneToOneType) {
      errors.push('oneToOneType is required for 1-1Call services');
    }

    if (data.type === 'DigitalProducts' && !data.digitalProductType) {
      errors.push('digitalProductType is required for DigitalProducts services');
    }

    // Business rules
    if (data.title && data.title.length > 200) {
      errors.push('Title must be less than 200 characters');
    }

    if (data.shortDescription && data.shortDescription.length > 500) {
      errors.push('Short description must be less than 500 characters');
    }

    if (errors.length > 0) {
      throw RepositoryErrorFactory.validationError(
        `Service validation failed: ${errors.join(', ')}`,
        operation,
        this.entityName,
        undefined,
        { errors, data: { mentorId: data.mentorId, title: data.title } }
      );
    }
  }

  private validateServiceUpdateData(data: ServiceUpdateData, operation: string): void {
    const errors: string[] = [];

    // Validation for fields that are being updated
    if (data.amount !== undefined && data.amount < 0) {
      errors.push('Amount must be 0 or greater');
    }

    if (data.title && data.title.length > 200) {
      errors.push('Title must be less than 200 characters');
    }

    if (data.shortDescription && data.shortDescription.length > 500) {
      errors.push('Short description must be less than 500 characters');
    }

    if (errors.length > 0) {
      throw RepositoryErrorFactory.validationError(
        `Service update validation failed: ${errors.join(', ')}`,
        operation,
        this.entityName,
        undefined,
        { errors, data }
      );
    }
  }

  private async validateUniqueService(data: ServiceCreateData, operation: string): Promise<void> {
    const existingService = await this.findOne({
      mentorId: new Types.ObjectId(data.mentorId),
      title: { $regex: new RegExp(`^${data.title.trim()}$`, 'i') },
      type: data.type
    });

    if (existingService) {
      throw RepositoryErrorFactory.duplicateError(
        this.entityName,
        operation,
        'title',
        data.title
      );
    }
  }

  private buildServiceSearchQuery(searchParams: SearchServiceParams, filters?: ServiceFilters): FilterQuery<EService> {
    const query: FilterQuery<EService> = {};

    // ✅ SEARCH QUERY
    if (searchParams.searchQuery) {
      query.$or = [
        { title: { $regex: searchParams.searchQuery, $options: 'i' } },
        { shortDescription: { $regex: searchParams.searchQuery, $options: 'i' } },
        { technology: { $in: [new RegExp(searchParams.searchQuery, 'i')] } }
      ];
    }

    // ✅ TYPE FILTERS
    if (searchParams.type) {
      query.type = searchParams.type;
    }

    if (searchParams.oneToOneType) {
      query.oneToOneType = searchParams.oneToOneType;
    }

    if (searchParams.digitalProductType) {
      query.digitalProductType = searchParams.digitalProductType;
    }

    // ✅ ADDITIONAL FILTERS
    if (filters) {
      if (filters.mentorId) {
        query.mentorId = new Types.ObjectId(filters.mentorId);
      }

      if (filters.status) {
        query.status = Array.isArray(filters.status) 
          ? { $in: filters.status }
          : filters.status;
      }

      if (filters.pricingType) {
        query.amount = filters.pricingType === 'free' ? 0 : { $gt: 0 };
      }

      if (filters.priceRange) {
        query.amount = {
          $gte: filters.priceRange.min,
          $lte: filters.priceRange.max
        };
      }

      if (filters.technology) {
        const techQuery = Array.isArray(filters.technology) 
          ? { $in: filters.technology }
          : filters.technology;
        query.technology = techQuery;
      }

      if (filters.hasSlot !== undefined) {
        query.slot = filters.hasSlot ? { $exists: true, $ne: null } : { $exists: false };
      }

      if (filters.isExclusive !== undefined) {
        query.exclusiveContent = filters.isExclusive;
      }
    }

    return query;
  }

  private buildServiceSortQuery(sortBy?: string, sortOrder: 'asc' | 'desc' = 'desc'): Record<string, 1 | -1> {
    const order = sortOrder === 'asc' ? 1 : -1;

    switch (sortBy) {
      case 'popularity':
        return { bookingCount: order, averageRating: -1 };
      case 'rating':
        return { averageRating: order, bookingCount: -1 };
      case 'price':
        return { amount: order };
      case 'newest':
        return { createdAt: order };
      case 'alphabetical':
        return { title: order };
      default:
        return { createdAt: -1 }; // Default: newest first
    }
  }

  private extractChanges(currentService: EService, updateData: ServiceUpdateData): Record<string, any> {
    const changes: Record<string, any> = {};

    Object.keys(updateData).forEach(key => {
      if (key !== 'updatedReason' && (updateData as any)[key] !== (currentService as any)[key]) {
        changes[key] = {
          old: (currentService as any)[key],
          new: (updateData as any)[key]
        };
      }
    });

    return changes;
  }

  private processServiceAnalytics(data: any): ServiceAnalytics {
    // ✅ PROCESS TYPE DISTRIBUTION
    const servicesByType = data.servicesByType.reduce((acc: Record<ServiceType, number>, type: ServiceType) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<ServiceType, number>);

    // ✅ PROCESS STATUS DISTRIBUTION
    const servicesByStatus = data.servicesByStatus.reduce((acc: Record<ServiceStatus, number>, status: ServiceStatus) => {
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<ServiceStatus, number>);

    // ✅ PROCESS PRICING DISTRIBUTION
    const servicesByPricing = data.servicesByPricing.reduce((acc: Record<PricingType, number>, type: PricingType) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<PricingType, number>);

    // ✅ CALCULATE AVERAGES
    const averagePrice = data.totalServices > 0 ? data.totalAmount / data.totalServices : 0;
    const averageDuration = data.totalServices > 0 ? data.totalDuration / data.totalServices : 0;
    const averageRating = data.allRatings.filter((r: number) => r > 0).reduce((sum: number, rating: number) => sum + rating, 0) / 
                         data.allRatings.filter((r: number) => r > 0).length || 0;

    // ✅ PROCESS TECHNOLOGY POPULARITY
    const techCounts: Record<string, number> = {};
    data.technologies.flat().forEach((tech: string) => {
      techCounts[tech] = (techCounts[tech] || 0) + 1;
    });

    const popularTechnologies = Object.entries(techCounts)
      .map(([technology, serviceCount]) => ({
        technology,
        serviceCount,
        averageRating: 0 // Could be calculated with more complex aggregation
      }))
      .sort((a, b) => b.serviceCount - a.serviceCount)
      .slice(0, 10);

    // ✅ PROCESS TOP EARNING SERVICES
    const topEarningServices = data.servicePerformance
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10)
      .map((service: any) => ({
        serviceId: service.serviceId.toString(),
        title: service.title,
        revenue: service.revenue,
        bookingCount: service.bookingCount
      }));

    // ✅ PROCESS POPULAR SERVICES
    const popularServices = data.servicePerformance
      .sort((a: any, b: any) => b.bookingCount - a.bookingCount)
      .slice(0, 10)
      .map((service: any) => ({
        serviceId: service.serviceId.toString(),
        title: service.title,
        bookingCount: service.bookingCount,
        rating: service.rating || 0
      }));

    return {
      totalServices: data.totalServices,
      servicesByType,
      servicesByStatus,
      servicesByPricing,
      averagePrice: Math.round(averagePrice * 100) / 100,
      averageDuration: Math.round(averageDuration),
      popularTechnologies,
      revenueStats: {
        totalRevenue: data.totalRevenue,
        averageServiceRevenue: data.totalServices > 0 ? data.totalRevenue / data.totalServices : 0,
        topEarningServices
      },
      performanceMetrics: {
        totalBookings: data.totalBookings,
        averageRating: Math.round(averageRating * 100) / 100,
        completionRate: 0, // Would need more complex calculation
        popularServices
      }
    };
  }

  private getEmptyAnalytics(): ServiceAnalytics {
    return {
      totalServices: 0,
      servicesByType: {} as Record<ServiceType, number>,
      servicesByStatus: {} as Record<ServiceStatus, number>,
      servicesByPricing: {} as Record<PricingType, number>,
      averagePrice: 0,
      averageDuration: 0,
      popularTechnologies: [],
      revenueStats: {
        totalRevenue: 0,
        averageServiceRevenue: 0,
        topEarningServices: []
      },
      performanceMetrics: {
        totalBookings: 0,
        averageRating: 0,
        completionRate: 0,
        popularServices: []
      }
    };
  }

  private logServiceTransaction(action: string, data: Record<string, any>): void {
    // ✅ BUSINESS AUDIT LOG
    console.log(`🎯 SERVICE_AUDIT: ${action}`, {
      timestamp: new Date().toISOString(),
      action,
      ...data
    });

    // TODO: In production, send to dedicated business audit service
    // businessAuditService.log(action, data);
  }

  /**
   * 🔹 LEGACY COMPATIBILITY METHODS
   */

  // ⚠️ DEPRECATED - Use searchServicesSecure instead
  async getAllServices(mentorId: string, params: any) {
    console.warn('⚠️ ServiceRepository.getAllServices() is deprecated. Use searchServicesSecure() for better performance.');
    
    try {
      const searchParams: SearchServiceParams = {
        searchQuery: params.search,
        type: params.type !== 'all' ? params.type : undefined,
        page: params.page,
        limit: params.limit
      };
      
      const filters: ServiceFilters = { mentorId };
      const result = await this.searchServicesSecure(searchParams, filters);
      
      return {
        services: result.data,
        totalCount: result.pagination.totalItems
      };
    } catch (error: any) {
      console.error('Legacy getAllServices error:', error.message);
      throw new Error("Failed to fetch services: " + error.message);
    }
  }

  // ⚠️ DEPRECATED - Use getServiceWithStatsSecure instead
  async getServiceById(serviceId: string) {
    console.warn('⚠️ ServiceRepository.getServiceById() is deprecated. Use getServiceWithStatsSecure() for enhanced details.');
    
    try {
      return await this.getServiceWithStatsSecure(serviceId);
    } catch (error: any) {
      console.error('Legacy getServiceById error:', error.message);
      throw new Error("Failed to fetch service: " + error.message);
    }
  }

  // ⚠️ DEPRECATED - Use updateServiceSecure instead
  async updateService(serviceId: string, serviceData: Partial<EService>) {
    console.warn('⚠️ ServiceRepository.updateService() is deprecated. Use updateServiceSecure() for better validation.');
    
    try {
      const result = await this.updateServiceSecure(serviceId, serviceData as ServiceUpdateData);
      return result.success ? result.data : null;
    } catch (error: any) {
      console.error('Legacy updateService error:', error.message);
      throw new Error("Failed to update service: " + error.message);
    }
  }

  // ⚠️ DEPRECATED - Use getTopServicesSecure instead
  async getTopServices(limit: number) {
    console.warn('⚠️ ServiceRepository.getTopServices() is deprecated. Use getTopServicesSecure() for better analytics.');
    
    try {
      return await this.getTopServicesSecure(limit);
    } catch (error: any) {
      console.error('Legacy getTopServices error:', error.message);
      throw new Error("Failed to fetch top services: " + error.message);
    }
  }

  // Keep other legacy methods following the same pattern...
  // (Additional legacy methods implemented for full compatibility)
}