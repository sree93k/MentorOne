/**
 * 🔹 PHASE 1 MIGRATION: Modern Payment Repository
 * Type-safe, secure financial transaction repository with comprehensive audit trails
 */

import { injectable } from "inversify";
import { Types, FilterQuery } from "mongoose";
import { EPayment } from "../../entities/paymentEntity";
import { IPaymentRepository } from "../interface/IPaymentRepository";
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
import Payment from "../../models/paymentModel";

/**
 * 🔹 PAYMENT-SPECIFIC TYPES
 */
type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
type PaymentMethod = 'card' | 'bank_transfer' | 'wallet' | 'upi' | 'paypal' | 'stripe';
type Currency = 'USD' | 'INR' | 'EUR' | 'GBP';

interface PaymentCreateData {
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  bookingId: string;
  menteeId: string;
  description?: string;
  metadata?: {
    stripePaymentIntentId?: string;
    stripeChargeId?: string;
    gatewayTransactionId?: string;
    sessionId?: string;
    clientIp?: string;
    userAgent?: string;
  };
  status?: PaymentStatus;
}

interface PaymentUpdateData {
  status?: PaymentStatus;
  gatewayTransactionId?: string;
  gatewayResponse?: Record<string, any>;
  failureReason?: string;
  refundAmount?: number;
  refundReason?: string;
  processedAt?: Date;
  settledAt?: Date;
}

interface PaymentFilters {
  mentorId?: string;
  menteeId?: string;
  bookingId?: string;
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  currency?: Currency;
  amountRange?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
}

interface PaymentSummary {
  totalAmount: number;
  totalCount: number;
  successfulPayments: number;
  failedPayments: number;
  refundedAmount: number;
  averageAmount: number;
  paymentsByMethod: Record<PaymentMethod, number>;
  paymentsByStatus: Record<PaymentStatus, number>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    count: number;
  }>;
}

interface MentorPaymentData {
  payments: Array<{
    _id: string;
    amount: number;
    currency: Currency;
    status: PaymentStatus;
    paymentMethod: PaymentMethod;
    createdAt: Date;
    booking: {
      _id: string;
      startTime: Date;
      endTime: Date;
      status: string;
    };
    service: {
      _id: string;
      title: string;
      type: string;
      price: number;
    };
    mentee: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
  summary: PaymentSummary;
}

/**
 * 🔹 MODERN PAYMENT REPOSITORY
 * Industry-standard financial transaction management with comprehensive security
 */
@injectable()
export default class ModernPaymentRepository 
  extends EnhancedBaseRepository<EPayment>
  implements IPaymentRepository {

  constructor() {
    super(Payment);
  }

  /**
   * 🔹 SECURE PAYMENT OPERATIONS
   */

  /**
   * ✅ NEW: Type-safe payment creation with comprehensive validation
   */
  async createPaymentSecure(
    paymentData: PaymentCreateData,
    context?: RepositoryContext
  ): Promise<CreateResult<EPayment>> {
    const operation = 'createPaymentSecure';

    try {
      // ✅ VALIDATE PAYMENT DATA
      this.validatePaymentCreateData(paymentData, operation);

      RepositoryLogger.logStart(operation, this.entityName, undefined, {
        amount: paymentData.amount,
        currency: paymentData.currency,
        paymentMethod: paymentData.paymentMethod,
        bookingId: paymentData.bookingId,
        ...context?.metadata
      });

      // ✅ CHECK FOR DUPLICATE PAYMENT
      await this.validateUniqueBookingPayment(paymentData.bookingId, operation);

      // ✅ PREPARE PAYMENT WITH SECURITY METADATA
      const paymentWithDefaults = {
        ...paymentData,
        status: paymentData.status || 'pending' as PaymentStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
        // ✅ AUDIT TRAIL
        auditTrail: [{
          action: 'created',
          timestamp: new Date(),
          userId: context?.userId,
          ipAddress: paymentData.metadata?.clientIp,
          userAgent: paymentData.metadata?.userAgent
        }]
      };

      // ✅ CREATE PAYMENT
      const result = await this.create(paymentWithDefaults, context);

      if (result.success && result.data) {
        RepositoryLogger.logSuccess(operation, this.entityName, result.data._id.toString(), {
          amount: paymentData.amount,
          currency: paymentData.currency,
          bookingId: paymentData.bookingId
        });

        // ✅ LOG FINANCIAL TRANSACTION (IMPORTANT FOR COMPLIANCE)
        this.logFinancialTransaction('PAYMENT_CREATED', {
          paymentId: result.data._id.toString(),
          amount: paymentData.amount,
          currency: paymentData.currency,
          bookingId: paymentData.bookingId,
          menteeId: paymentData.menteeId
        });
      }

      return result;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * ✅ NEW: Secure payment status update with audit trail
   */
  async updatePaymentStatusSecure(
    paymentId: string,
    updateData: PaymentUpdateData,
    context?: RepositoryContext
  ): Promise<UpdateResult<EPayment>> {
    const operation = 'updatePaymentStatusSecure';

    try {
      this.validateObjectId(paymentId, operation);
      this.validatePaymentUpdateData(updateData, operation);

      RepositoryLogger.logStart(operation, this.entityName, paymentId, {
        status: updateData.status,
        hasGatewayData: !!updateData.gatewayTransactionId
      });

      // ✅ GET CURRENT PAYMENT FOR AUDIT
      const currentPayment = await this.findById(paymentId, undefined, context);
      if (!currentPayment) {
        throw RepositoryErrorFactory.notFoundError(this.entityName, paymentId, operation);
      }

      // ✅ VALIDATE STATUS TRANSITION
      this.validateStatusTransition(
        currentPayment.status as PaymentStatus, 
        updateData.status!, 
        operation
      );

      // ✅ PREPARE UPDATE WITH AUDIT TRAIL
      const updateWithAudit = {
        ...updateData,
        updatedAt: new Date(),
        $push: {
          auditTrail: {
            action: `status_changed_to_${updateData.status}`,
            previousStatus: currentPayment.status,
            timestamp: new Date(),
            userId: context?.userId,
            gatewayTransactionId: updateData.gatewayTransactionId,
            failureReason: updateData.failureReason
          }
        }
      };

      // ✅ SET PROCESSED/SETTLED TIMESTAMPS
      if (updateData.status === 'completed' && !updateData.processedAt) {
        updateWithAudit.processedAt = new Date();
      }

      const result = await this.update(paymentId, updateWithAudit, {
        new: true,
        runValidators: true
      }, context);

      if (result.success) {
        RepositoryLogger.logSuccess(operation, this.entityName, paymentId, {
          oldStatus: currentPayment.status,
          newStatus: updateData.status
        });

        // ✅ LOG FINANCIAL STATE CHANGE
        this.logFinancialTransaction('PAYMENT_STATUS_CHANGED', {
          paymentId,
          oldStatus: currentPayment.status,
          newStatus: updateData.status,
          amount: currentPayment.amount,
          currency: currentPayment.currency
        });
      }

      return result;

    } catch (error: any) {
      this.handleError(error, operation, paymentId, context);
    }
  }

  /**
   * 🔹 ADVANCED PAYMENT QUERIES
   */

  /**
   * ✅ NEW: Get comprehensive mentor payment data
   */
  async getMentorPaymentsSecure(
    mentorId: string,
    pagination?: PaginationParams,
    filters?: PaymentFilters,
    context?: RepositoryContext
  ): Promise<MentorPaymentData> {
    const operation = 'getMentorPaymentsSecure';

    try {
      this.validateObjectId(mentorId, operation);

      RepositoryLogger.logStart(operation, this.entityName, undefined, {
        mentorId,
        pagination,
        hasFilters: !!filters
      });

      // ✅ BUILD COMPREHENSIVE AGGREGATION PIPELINE
      const pipeline = [
        {
          $lookup: {
            from: 'bookings',
            localField: 'bookingId',
            foreignField: '_id',
            as: 'booking'
          }
        },
        {
          $unwind: {
            path: '$booking',
            preserveNullAndEmptyArrays: false
          }
        },
        {
          $match: {
            'booking.mentorId': new Types.ObjectId(mentorId),
            ...this.buildPaymentFilterQuery(filters)
          }
        },
        {
          $lookup: {
            from: 'services',
            localField: 'booking.serviceId',
            foreignField: '_id',
            as: 'service'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'menteeId',
            foreignField: '_id',
            as: 'mentee'
          }
        },
        {
          $unwind: {
            path: '$service',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $unwind: {
            path: '$mentee',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            amount: 1,
            currency: 1,
            status: 1,
            paymentMethod: 1,
            createdAt: 1,
            processedAt: 1,
            'booking._id': 1,
            'booking.startTime': 1,
            'booking.endTime': 1,
            'booking.status': 1,
            'service._id': 1,
            'service.title': 1,
            'service.type': 1,
            'service.price': 1,
            'mentee._id': 1,
            'mentee.firstName': 1,
            'mentee.lastName': 1,
            'mentee.email': 1
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ];

      // ✅ EXECUTE WITH OPTIONAL PAGINATION
      let payments: any[];
      let totalCount: number;

      if (pagination) {
        this.validatePaginationParams(pagination);
        const skip = (pagination.page - 1) * pagination.limit;

        const [data, countResult] = await Promise.all([
          this.model.aggregate([
            ...pipeline,
            { $skip: skip },
            { $limit: pagination.limit }
          ]),
          this.model.aggregate([
            ...pipeline,
            { $count: 'total' }
          ])
        ]);

        payments = data;
        totalCount = countResult[0]?.total || 0;
      } else {
        payments = await this.model.aggregate(pipeline);
        totalCount = payments.length;
      }

      // ✅ CALCULATE COMPREHENSIVE SUMMARY
      const summary = await this.calculatePaymentSummary(mentorId, filters, context);

      // ✅ TRANSFORM PAYMENT DATA
      const transformedPayments = payments.map(payment => ({
        _id: payment._id.toString(),
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        createdAt: payment.createdAt,
        booking: {
          _id: payment.booking._id.toString(),
          startTime: payment.booking.startTime,
          endTime: payment.booking.endTime,
          status: payment.booking.status
        },
        service: {
          _id: payment.service?._id?.toString() || '',
          title: payment.service?.title || 'Unknown Service',
          type: payment.service?.type || 'unknown',
          price: payment.service?.price || payment.amount
        },
        mentee: {
          _id: payment.mentee?._id?.toString() || '',
          firstName: payment.mentee?.firstName || 'Unknown',
          lastName: payment.mentee?.lastName || '',
          email: payment.mentee?.email || ''
        }
      }));

      RepositoryLogger.logSuccess(operation, this.entityName, undefined, {
        mentorId,
        paymentCount: transformedPayments.length,
        totalRevenue: summary.totalAmount
      });

      return {
        payments: transformedPayments,
        summary
      };

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * ✅ NEW: Get payment by booking with security checks
   */
  async getPaymentByBookingSecure(
    bookingId: string,
    context?: RepositoryContext
  ): Promise<EPayment | null> {
    const operation = 'getPaymentByBookingSecure';

    try {
      this.validateObjectId(bookingId, operation);

      RepositoryLogger.logStart(operation, this.entityName, undefined, { bookingId });

      const options: FindOptions = {
        populate: [
          {
            path: 'menteeId',
            select: 'firstName lastName email'
          }
        ]
      };

      const payment = await this.findOne({ bookingId }, options, context);

      RepositoryLogger.logSuccess(operation, this.entityName, payment?._id?.toString(), {
        bookingId,
        found: !!payment,
        amount: payment?.amount
      });

      return payment;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * 🔹 FINANCIAL ANALYTICS
   */

  /**
   * ✅ NEW: Calculate comprehensive payment summary
   */
  private async calculatePaymentSummary(
    mentorId: string,
    filters?: PaymentFilters,
    context?: RepositoryContext
  ): Promise<PaymentSummary> {
    const operation = 'calculatePaymentSummary';

    try {
      // ✅ BUILD AGGREGATION FOR COMPREHENSIVE STATS
      const pipeline = [
        {
          $lookup: {
            from: 'bookings',
            localField: 'bookingId',
            foreignField: '_id',
            as: 'booking'
          }
        },
        {
          $unwind: '$booking'
        },
        {
          $match: {
            'booking.mentorId': new Types.ObjectId(mentorId),
            ...this.buildPaymentFilterQuery(filters)
          }
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            totalCount: { $sum: 1 },
            successfulPayments: {
              $sum: {
                $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
              }
            },
            failedPayments: {
              $sum: {
                $cond: [{ $in: ['$status', ['failed', 'cancelled']] }, 1, 0]
              }
            },
            refundedAmount: {
              $sum: {
                $cond: [{ $eq: ['$status', 'refunded'] }, '$amount', 0]
              }
            },
            paymentMethods: { $push: '$paymentMethod' },
            statuses: { $push: '$status' },
            monthlyData: {
              $push: {
                month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                amount: '$amount',
                status: '$status'
              }
            }
          }
        }
      ];

      const result = await this.aggregate<any>(pipeline, context);

      if (result.data.length === 0) {
        return {
          totalAmount: 0,
          totalCount: 0,
          successfulPayments: 0,
          failedPayments: 0,
          refundedAmount: 0,
          averageAmount: 0,
          paymentsByMethod: {} as Record<PaymentMethod, number>,
          paymentsByStatus: {} as Record<PaymentStatus, number>,
          revenueByMonth: []
        };
      }

      const data = result.data[0];

      // ✅ PROCESS PAYMENT METHODS DISTRIBUTION
      const paymentsByMethod = data.paymentMethods.reduce((acc: Record<PaymentMethod, number>, method: PaymentMethod) => {
        acc[method] = (acc[method] || 0) + 1;
        return acc;
      }, {} as Record<PaymentMethod, number>);

      // ✅ PROCESS STATUS DISTRIBUTION
      const paymentsByStatus = data.statuses.reduce((acc: Record<PaymentStatus, number>, status: PaymentStatus) => {
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<PaymentStatus, number>);

      // ✅ PROCESS MONTHLY REVENUE
      const monthlyRevenue = data.monthlyData.reduce((acc: Record<string, { revenue: number; count: number }>, item: any) => {
        if (item.status === 'completed') {
          if (!acc[item.month]) {
            acc[item.month] = { revenue: 0, count: 0 };
          }
          acc[item.month].revenue += item.amount;
          acc[item.month].count += 1;
        }
        return acc;
      }, {});

      const revenueByMonth = Object.entries(monthlyRevenue)
        .map(([month, data]) => ({ month, ...data }))
        .sort((a, b) => a.month.localeCompare(b.month));

      return {
        totalAmount: data.totalAmount,
        totalCount: data.totalCount,
        successfulPayments: data.successfulPayments,
        failedPayments: data.failedPayments,
        refundedAmount: data.refundedAmount,
        averageAmount: data.totalCount > 0 ? data.totalAmount / data.totalCount : 0,
        paymentsByMethod,
        paymentsByStatus,
        revenueByMonth
      };

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * 🔹 VALIDATION & SECURITY METHODS
   */

  private validatePaymentCreateData(data: PaymentCreateData, operation: string): void {
    const errors: string[] = [];

    // Required fields
    if (!data.amount || data.amount <= 0) errors.push('Valid amount is required');
    if (!data.currency) errors.push('Currency is required');
    if (!data.paymentMethod) errors.push('Payment method is required');
    if (!data.bookingId) errors.push('Booking ID is required');
    if (!data.menteeId) errors.push('Mentee ID is required');

    // ObjectId validation
    if (data.bookingId && !Types.ObjectId.isValid(data.bookingId)) {
      errors.push('Invalid booking ID format');
    }
    if (data.menteeId && !Types.ObjectId.isValid(data.menteeId)) {
      errors.push('Invalid mentee ID format');
    }

    // Business rules
    if (data.amount && (data.amount < 0.01 || data.amount > 10000)) {
      errors.push('Amount must be between $0.01 and $10,000');
    }

    // Enum validation
    const validCurrencies: Currency[] = ['USD', 'INR', 'EUR', 'GBP'];
    if (data.currency && !validCurrencies.includes(data.currency)) {
      errors.push(`Invalid currency. Must be one of: ${validCurrencies.join(', ')}`);
    }

    const validMethods: PaymentMethod[] = ['card', 'bank_transfer', 'wallet', 'upi', 'paypal', 'stripe'];
    if (data.paymentMethod && !validMethods.includes(data.paymentMethod)) {
      errors.push(`Invalid payment method. Must be one of: ${validMethods.join(', ')}`);
    }

    if (errors.length > 0) {
      throw RepositoryErrorFactory.validationError(
        `Payment validation failed: ${errors.join(', ')}`,
        operation,
        this.entityName,
        undefined,
        { errors, data: { amount: data.amount, bookingId: data.bookingId } }
      );
    }
  }

  private validatePaymentUpdateData(data: PaymentUpdateData, operation: string): void {
    const errors: string[] = [];

    // Status validation
    if (data.status) {
      const validStatuses: PaymentStatus[] = ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'];
      if (!validStatuses.includes(data.status)) {
        errors.push(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }
    }

    // Refund validation
    if (data.refundAmount !== undefined) {
      if (data.refundAmount < 0) {
        errors.push('Refund amount cannot be negative');
      }
      if (data.status !== 'refunded') {
        errors.push('Refund amount can only be set when status is "refunded"');
      }
    }

    if (errors.length > 0) {
      throw RepositoryErrorFactory.validationError(
        `Payment update validation failed: ${errors.join(', ')}`,
        operation,
        this.entityName,
        undefined,
        { errors, data }
      );
    }
  }

  private async validateUniqueBookingPayment(bookingId: string, operation: string): Promise<void> {
    const existingPayment = await this.findOne({ 
      bookingId, 
      status: { $in: ['pending', 'processing', 'completed'] } 
    });
    
    if (existingPayment) {
      throw RepositoryErrorFactory.duplicateError(
        this.entityName,
        operation,
        'bookingId',
        bookingId
      );
    }
  }

  private validateStatusTransition(
    currentStatus: PaymentStatus,
    newStatus: PaymentStatus,
    operation: string
  ): void {
    const validTransitions: Record<PaymentStatus, PaymentStatus[]> = {
      'pending': ['processing', 'cancelled', 'failed'],
      'processing': ['completed', 'failed'],
      'completed': ['refunded'],
      'failed': ['pending'], // Allow retry
      'refunded': [], // Terminal state
      'cancelled': [] // Terminal state
    };

    const allowedTransitions = validTransitions[currentStatus] || [];
    
    if (!allowedTransitions.includes(newStatus)) {
      throw RepositoryErrorFactory.validationError(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
        operation,
        this.entityName,
        undefined,
        { currentStatus, newStatus, allowedTransitions }
      );
    }
  }

  private buildPaymentFilterQuery(filters?: PaymentFilters): FilterQuery<EPayment> {
    if (!filters) return {};

    const query: FilterQuery<EPayment> = {};

    if (filters.menteeId) {
      query.menteeId = new Types.ObjectId(filters.menteeId);
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.paymentMethod) {
      query.paymentMethod = filters.paymentMethod;
    }

    if (filters.currency) {
      query.currency = filters.currency;
    }

    if (filters.amountRange) {
      query.amount = {
        $gte: filters.amountRange.min,
        $lte: filters.amountRange.max
      };
    }

    if (filters.dateRange) {
      query.createdAt = {
        $gte: filters.dateRange.start,
        $lte: filters.dateRange.end
      };
    }

    return query;
  }

  private logFinancialTransaction(action: string, data: Record<string, any>): void {
    // ✅ FINANCIAL AUDIT LOG (CRITICAL FOR COMPLIANCE)
    console.log(`💰 FINANCIAL_AUDIT: ${action}`, {
      timestamp: new Date().toISOString(),
      action,
      ...data
    });

    // TODO: In production, send to dedicated financial audit service
    // financialAuditService.log(action, data);
  }

  /**
   * 🔹 LEGACY COMPATIBILITY METHODS
   */

  // ⚠️ DEPRECATED - Use createPaymentSecure instead
  async create(data: any) {
    console.warn('⚠️ PaymentRepository.create() is deprecated. Use createPaymentSecure() for better validation.');
    
    try {
      const result = await this.createPaymentSecure(data as PaymentCreateData);
      return result.success ? result.data : null;
    } catch (error: any) {
      console.error('Legacy create error:', error.message);
      throw new Error("Failed to create payment: " + error.message);
    }
  }

  // ⚠️ DEPRECATED - Use findById from base class instead
  async findById(id: string) {
    console.warn('⚠️ PaymentRepository.findById() is deprecated. Use base findById() method.');
    
    try {
      return await super.findById(id);
    } catch (error: any) {
      console.error('Legacy findById error:', error.message);
      throw new Error("Failed to find payment: " + error.message);
    }
  }

  // ⚠️ DEPRECATED - Use getPaymentByBookingSecure instead
  async findByBookingId(bookingId: string) {
    console.warn('⚠️ PaymentRepository.findByBookingId() is deprecated. Use getPaymentByBookingSecure() for better security.');
    
    try {
      return await this.getPaymentByBookingSecure(bookingId);
    } catch (error: any) {
      console.error('Legacy findByBookingId error:', error.message);
      throw new Error("Failed to find payment: " + error.message);
    }
  }

  // ⚠️ DEPRECATED - Use getMentorPaymentsSecure instead
  async findAllByMentorId(mentorId: string): Promise<{ payments: any[]; totalAmount: number; totalCount: number; }> {
    console.warn('⚠️ PaymentRepository.findAllByMentorId() is deprecated. Use getMentorPaymentsSecure() for comprehensive data.');
    
    try {
      const result = await this.getMentorPaymentsSecure(mentorId);
      return {
        payments: result.payments,
        totalAmount: result.summary.totalAmount,
        totalCount: result.summary.totalCount
      };
    } catch (error: any) {
      console.error('Legacy findAllByMentorId error:', error.message);
      throw new Error("Failed to fetch mentor payments: " + error.message);
    }
  }
}