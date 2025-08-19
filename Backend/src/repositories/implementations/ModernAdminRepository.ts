/**
 * 🔹 PHASE 3 MIGRATION: Modern Admin Repository
 * Type-safe, comprehensive admin management with authentication and role-based access control
 */

import { injectable } from "inversify";
import { Types, FilterQuery } from "mongoose";
import { EAdmin } from "../../entities/adminEntity";
import { IAdminRepository } from "../interface/IAdminRespository";
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
import Admin from "../../models/adminModel";

/**
 * 🔹 ADMIN-SPECIFIC TYPES
 */
type AdminRole = "super_admin" | "admin" | "moderator" | "support";
type AdminStatus = "active" | "inactive" | "suspended" | "pending";

interface AdminCreateData {
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  role?: AdminRole[];
  profilePicture?: string;
  status?: AdminStatus;
  permissions?: string[];
  metadata?: {
    createdBy?: string;
    department?: string;
    employeeId?: string;
    phoneNumber?: string;
    lastLoginIp?: string;
    lastLoginAt?: Date;
    isEmailVerified?: boolean;
    isTwoFactorEnabled?: boolean;
  };
}

interface AdminUpdateData {
  adminName?: string;
  adminEmail?: string;
  adminPassword?: string;
  role?: AdminRole[];
  profilePicture?: string;
  status?: AdminStatus;
  permissions?: string[];
  lastLoginAt?: Date;
  lastLoginIp?: string;
  failedLoginAttempts?: number;
  lockedUntil?: Date;
  passwordChangedAt?: Date;
  isEmailVerified?: boolean;
  isTwoFactorEnabled?: boolean;
}

interface AdminFilters {
  role?: AdminRole | AdminRole[];
  status?: AdminStatus | AdminStatus[];
  department?: string;
  isEmailVerified?: boolean;
  isTwoFactorEnabled?: boolean;
  lastLoginRange?: {
    start: Date;
    end: Date;
  };
  createdRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string; // Search in name, email
}

interface AdminAnalytics {
  totalAdmins: number;
  activeAdmins: number;
  roleDistribution: Record<AdminRole, number>;
  statusDistribution: Record<AdminStatus, number>;
  loginActivityStats: {
    totalLogins: number;
    uniqueLogins: number;
    averageSessionDuration: number;
    recentLogins: Array<{
      adminId: string;
      adminName: string;
      lastLogin: Date;
      loginCount: number;
    }>;
  };
  securityStats: {
    twoFactorEnabled: number;
    emailVerified: number;
    suspendedAccounts: number;
    lockedAccounts: number;
    failedLoginAttempts: number;
  };
  departmentStats: Array<{
    department: string;
    adminCount: number;
    activeCount: number;
  }>;
}

interface AdminWithActivity extends EAdmin {
  loginHistory?: Array<{
    timestamp: Date;
    ipAddress: string;
    userAgent: string;
    success: boolean;
  }>;
  activityLog?: Array<{
    action: string;
    resource: string;
    timestamp: Date;
    metadata?: Record<string, any>;
  }>;
  permissions?: string[];
  securitySettings?: {
    isTwoFactorEnabled: boolean;
    lastPasswordChange: Date;
    failedLoginAttempts: number;
    lockedUntil?: Date;
  };
}

interface LoginAttemptData {
  adminId: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  failureReason?: string;
}

interface SecurityAuditData {
  adminId: string;
  action: string;
  resource: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * 🔹 MODERN ADMIN REPOSITORY
 * Industry-standard admin management with comprehensive security and audit trails
 */
@injectable()
export default class ModernAdminRepository 
  extends EnhancedBaseRepository<EAdmin>
  implements IAdminRepository {

  constructor() {
    super(Admin);
  }

  /**
   * 🔹 ADMIN-SPECIFIC CRUD OPERATIONS
   */

  /**
   * Create a new admin with comprehensive validation and security
   */
  async createAdminSecure(
    data: AdminCreateData,
    context?: RepositoryContext
  ): Promise<CreateResult<EAdmin>> {
    const operation = 'createAdminSecure';

    try {
      // ✅ TYPE-SAFE VALIDATION
      this.validateAdminData(data, operation);

      // ✅ BUSINESS RULE VALIDATION
      await this.validateBusinessRules(data, operation, context);

      // ✅ SECURITY ENHANCEMENTS
      const secureData = await this.enhanceWithSecurityData(data, operation, context);

      // ✅ USE ENHANCED BASE CREATE
      const result = await this.create(secureData, context);

      // ✅ AUDIT TRAIL
      if (result.success && result.data && context?.adminId) {
        await this.logSecurityAudit({
          adminId: context.adminId,
          action: 'CREATE_ADMIN',
          resource: `admin:${result.data._id}`,
          newValues: { adminEmail: data.adminEmail, role: data.role },
          ipAddress: context.ipAddress,
          userAgent: context.userAgent
        }, context);
      }

      return result;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Find admin by email with security context
   */
  async findByEmailSecure(
    adminEmail: string,
    includePassword: boolean = false,
    context?: RepositoryContext
  ): Promise<EAdmin | null> {
    const operation = 'findByEmailSecure';

    try {
      this.validateEmail(adminEmail, operation);
      RepositoryLogger.logStart(operation, this.entityName, undefined, { adminEmail, includePassword });

      // ✅ SECURITY-AWARE QUERY
      const selectFields = includePassword ? "+adminPassword" : "-adminPassword";
      
      const filter: FilterQuery<EAdmin> = { 
        adminEmail: adminEmail.toLowerCase().trim()
      };

      const options: FindOptions = {
        select: selectFields,
        lean: !includePassword // Use lean for better performance when password not needed
      };

      const admin = await this.findOne(filter, options, context);

      // ✅ AUDIT FAILED ATTEMPTS
      if (!admin && context?.skipAudit !== true) {
        await this.logSecurityAudit({
          adminId: 'unknown',
          action: 'FAILED_ADMIN_LOOKUP',
          resource: `email:${adminEmail}`,
          ipAddress: context?.ipAddress,
          userAgent: context?.userAgent
        }, context);
      }

      RepositoryLogger.logSuccess(operation, this.entityName, admin?._id?.toString(), { 
        found: !!admin, 
        adminEmail 
      });

      return admin;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Find admin by ID with populated activity data
   */
  async findAdminByIdWithActivity(
    id: string,
    context?: RepositoryContext
  ): Promise<AdminWithActivity | null> {
    const operation = 'findAdminByIdWithActivity';

    try {
      this.validateObjectId(id, operation);
      RepositoryLogger.logStart(operation, this.entityName, id);

      // ✅ GET BASE ADMIN DATA
      const admin = await this.findById(id, {
        select: '-adminPassword',
        lean: true
      }, context);

      if (!admin) {
        return null;
      }

      // ✅ ENHANCE WITH ACTIVITY DATA
      const adminWithActivity: AdminWithActivity = {
        ...admin,
        loginHistory: await this.getAdminLoginHistory(id, context),
        activityLog: await this.getAdminActivityLog(id, context),
        permissions: await this.getAdminPermissions(id, context),
        securitySettings: await this.getAdminSecuritySettings(id, context)
      };

      RepositoryLogger.logSuccess(operation, this.entityName, id, { 
        hasLoginHistory: (adminWithActivity.loginHistory?.length || 0) > 0,
        hasActivityLog: (adminWithActivity.activityLog?.length || 0) > 0
      });

      return adminWithActivity;

    } catch (error: any) {
      this.handleError(error, operation, id, context);
    }
  }

  /**
   * Update admin with comprehensive validation and audit
   */
  async updateAdminSecure(
    id: string,
    data: AdminUpdateData,
    context?: RepositoryContext
  ): Promise<UpdateResult<EAdmin>> {
    const operation = 'updateAdminSecure';

    try {
      // ✅ VALIDATE UPDATE DATA
      this.validateAdminUpdateData(data, operation);

      // ✅ GET EXISTING DATA FOR AUDIT
      const existingAdmin = await this.findById(id, { lean: true }, context);
      if (!existingAdmin) {
        throw RepositoryErrorFactory.notFoundError(this.entityName, id, operation);
      }

      // ✅ SECURITY VALIDATIONS
      await this.validateUpdateSecurity(id, data, existingAdmin, operation, context);

      // ✅ USE ENHANCED BASE UPDATE
      const result = await this.update(id, data, {
        new: true,
        runValidators: true,
        select: '-adminPassword'
      }, context);

      // ✅ AUDIT TRAIL
      if (result.success && result.data && context?.adminId) {
        await this.logSecurityAudit({
          adminId: context.adminId,
          action: 'UPDATE_ADMIN',
          resource: `admin:${id}`,
          oldValues: this.extractAuditableFields(existingAdmin),
          newValues: this.extractAuditableFields(data),
          ipAddress: context.ipAddress,
          userAgent: context.userAgent
        }, context);
      }

      return result;

    } catch (error: any) {
      this.handleError(error, operation, id, context);
    }
  }

  /**
   * 🔹 ADMIN-SPECIFIC BUSINESS OPERATIONS
   */

  /**
   * Get admin analytics and statistics
   */
  async getAdminAnalytics(
    context?: RepositoryContext
  ): Promise<AdminAnalytics> {
    const operation = 'getAdminAnalytics';

    try {
      RepositoryLogger.logStart(operation, this.entityName, undefined);

      // ✅ PARALLEL ANALYTICS QUERIES
      const [
        totalCount,
        roleStats,
        statusStats,
        loginStats,
        securityStats,
        departmentStats
      ] = await Promise.all([
        this.getTotalAdminCount(context),
        this.getAdminRoleDistribution(context),
        this.getAdminStatusDistribution(context),
        this.getLoginActivityStats(context),
        this.getSecurityStats(context),
        this.getDepartmentStats(context)
      ]);

      const analytics: AdminAnalytics = {
        totalAdmins: totalCount,
        activeAdmins: statusStats.active || 0,
        roleDistribution: roleStats,
        statusDistribution: statusStats,
        loginActivityStats: loginStats,
        securityStats: securityStats,
        departmentStats: departmentStats
      };

      RepositoryLogger.logSuccess(operation, this.entityName, undefined, { 
        totalAdmins: analytics.totalAdmins,
        activeAdmins: analytics.activeAdmins
      });

      return analytics;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Find admins with advanced filtering and pagination
   */
  async findAdminsWithFilters(
    filters: AdminFilters,
    pagination: PaginationParams,
    context?: RepositoryContext
  ): Promise<PaginatedResponse<EAdmin>> {
    const operation = 'findAdminsWithFilters';

    try {
      RepositoryLogger.logStart(operation, this.entityName, undefined, { filters, pagination });

      const filter = this.buildAdminFilterQuery(filters);
      
      const options: FindOptions = {
        select: '-adminPassword',
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
   * Record login attempt and update security metrics
   */
  async recordLoginAttempt(
    data: LoginAttemptData,
    context?: RepositoryContext
  ): Promise<void> {
    const operation = 'recordLoginAttempt';

    try {
      RepositoryLogger.logStart(operation, this.entityName, data.adminId, { 
        success: data.success,
        ipAddress: data.ipAddress
      });

      // ✅ UPDATE ADMIN LOGIN DATA
      const updateData: AdminUpdateData = {
        lastLoginAt: new Date(),
        lastLoginIp: data.ipAddress
      };

      if (data.success) {
        // ✅ SUCCESSFUL LOGIN
        updateData.failedLoginAttempts = 0;
        updateData.lockedUntil = undefined;
      } else {
        // ✅ FAILED LOGIN
        const admin = await this.findById(data.adminId, { lean: true }, context);
        if (admin) {
          const failedAttempts = (admin.failedLoginAttempts || 0) + 1;
          updateData.failedLoginAttempts = failedAttempts;
          
          // ✅ LOCK ACCOUNT AFTER 5 FAILED ATTEMPTS
          if (failedAttempts >= 5) {
            updateData.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
          }
        }
      }

      await this.update(data.adminId, updateData, { new: true }, context);

      // ✅ LOG SECURITY AUDIT
      await this.logSecurityAudit({
        adminId: data.adminId,
        action: data.success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
        resource: `admin:${data.adminId}`,
        newValues: { 
          ipAddress: data.ipAddress,
          failureReason: data.failureReason
        },
        ipAddress: data.ipAddress,
        userAgent: data.userAgent
      }, context);

      RepositoryLogger.logSuccess(operation, this.entityName, data.adminId);

    } catch (error: any) {
      this.handleError(error, operation, data.adminId, context);
    }
  }

  /**
   * 🔹 HELPER METHODS
   */

  /**
   * Validate admin creation data
   */
  private validateAdminData(data: AdminCreateData, operation: string): void {
    const errors: string[] = [];

    // Required fields
    if (!data.adminName?.trim()) errors.push('adminName is required');
    if (!data.adminEmail?.trim()) errors.push('adminEmail is required');
    if (!data.adminPassword?.trim()) errors.push('adminPassword is required');

    // Email validation
    if (data.adminEmail && !this.isValidEmail(data.adminEmail)) {
      errors.push('Invalid email format');
    }

    // Password validation
    if (data.adminPassword && data.adminPassword.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    // Role validation
    if (data.role && !Array.isArray(data.role)) {
      errors.push('Role must be an array');
    }

    if (errors.length > 0) {
      throw RepositoryErrorFactory.validationError(
        `Validation failed: ${errors.join(', ')}`,
        operation,
        this.entityName,
        undefined,
        { errors, data: { ...data, adminPassword: '[HIDDEN]' } }
      );
    }
  }

  /**
   * Validate admin update data
   */
  private validateAdminUpdateData(data: AdminUpdateData, operation: string): void {
    const errors: string[] = [];

    // Email validation if provided
    if (data.adminEmail && !this.isValidEmail(data.adminEmail)) {
      errors.push('Invalid email format');
    }

    // Password validation if provided
    if (data.adminPassword && data.adminPassword.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    // Role validation if provided
    if (data.role && !Array.isArray(data.role)) {
      errors.push('Role must be an array');
    }

    if (errors.length > 0) {
      throw RepositoryErrorFactory.validationError(
        `Update validation failed: ${errors.join(', ')}`,
        operation,
        this.entityName,
        undefined,
        { errors, data: { ...data, adminPassword: data.adminPassword ? '[HIDDEN]' : undefined } }
      );
    }
  }

  /**
   * Validate business rules for admin creation
   */
  private async validateBusinessRules(
    data: AdminCreateData,
    operation: string,
    context?: RepositoryContext
  ): Promise<void> {
    // Check for duplicate email
    const existingAdmin = await this.findByEmailSecure(
      data.adminEmail, 
      false, 
      { ...context, skipAudit: true }
    );
    
    if (existingAdmin) {
      throw RepositoryErrorFactory.duplicateError(
        this.entityName,
        operation,
        'adminEmail',
        data.adminEmail
      );
    }
  }

  /**
   * Enhance admin data with security features
   */
  private async enhanceWithSecurityData(
    data: AdminCreateData,
    operation: string,
    context?: RepositoryContext
  ): Promise<DeepPartial<EAdmin>> {
    // Note: Password hashing should be handled by the model/service layer
    return {
      ...data,
      adminEmail: data.adminEmail.toLowerCase().trim(),
      status: data.status || 'pending',
      role: data.role || ['admin'],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Build filter query for admin search
   */
  private buildAdminFilterQuery(filters: AdminFilters): FilterQuery<EAdmin> {
    const query: FilterQuery<EAdmin> = {};

    if (filters.role) {
      query.role = Array.isArray(filters.role) ? { $in: filters.role } : filters.role;
    }

    if (filters.status) {
      query.status = Array.isArray(filters.status) ? { $in: filters.status } : filters.status;
    }

    if (filters.department) {
      query['metadata.department'] = filters.department;
    }

    if (filters.isEmailVerified !== undefined) {
      query['metadata.isEmailVerified'] = filters.isEmailVerified;
    }

    if (filters.searchTerm) {
      const searchRegex = { $regex: filters.searchTerm, $options: 'i' };
      query.$or = [
        { adminName: searchRegex },
        { adminEmail: searchRegex }
      ];
    }

    if (filters.lastLoginRange) {
      query.lastLoginAt = {
        $gte: filters.lastLoginRange.start,
        $lte: filters.lastLoginRange.end
      };
    }

    return query;
  }

  /**
   * Get admin login history (placeholder - would integrate with audit system)
   */
  private async getAdminLoginHistory(adminId: string, context?: RepositoryContext) {
    // This would typically query a separate audit/login table
    return [];
  }

  /**
   * Get admin activity log (placeholder - would integrate with audit system)
   */
  private async getAdminActivityLog(adminId: string, context?: RepositoryContext) {
    // This would typically query a separate activity log table
    return [];
  }

  /**
   * Get admin permissions (placeholder)
   */
  private async getAdminPermissions(adminId: string, context?: RepositoryContext) {
    // This would typically be calculated based on roles and assignments
    return [];
  }

  /**
   * Get admin security settings
   */
  private async getAdminSecuritySettings(adminId: string, context?: RepositoryContext) {
    const admin = await this.findById(adminId, { lean: true }, context);
    if (!admin) return undefined;

    return {
      isTwoFactorEnabled: admin.metadata?.isTwoFactorEnabled || false,
      lastPasswordChange: admin.passwordChangedAt || admin.createdAt,
      failedLoginAttempts: admin.failedLoginAttempts || 0,
      lockedUntil: admin.lockedUntil
    };
  }

  /**
   * Log security audit (placeholder - would integrate with audit system)
   */
  private async logSecurityAudit(data: SecurityAuditData, context?: RepositoryContext): Promise<void> {
    // This would typically write to a separate audit log table
    console.log('🔒 Security Audit:', data);
  }

  /**
   * 🔹 ANALYTICS HELPER METHODS
   */

  private async getTotalAdminCount(context?: RepositoryContext): Promise<number> {
    return this.count({}, context);
  }

  private async getAdminRoleDistribution(context?: RepositoryContext): Promise<Record<AdminRole, number>> {
    const pipeline = [
      { $unwind: '$role' },
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ];
    
    const result = await this.aggregate<{ _id: AdminRole; count: number }>(pipeline, context);
    
    const distribution: Record<AdminRole, number> = {
      super_admin: 0,
      admin: 0,
      moderator: 0,
      support: 0
    };

    result.data.forEach(item => {
      if (item._id in distribution) {
        distribution[item._id] = item.count;
      }
    });

    return distribution;
  }

  private async getAdminStatusDistribution(context?: RepositoryContext): Promise<Record<AdminStatus, number>> {
    const pipeline = [
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ];
    
    const result = await this.aggregate<{ _id: AdminStatus; count: number }>(pipeline, context);
    
    const distribution: Record<AdminStatus, number> = {
      active: 0,
      inactive: 0,
      suspended: 0,
      pending: 0
    };

    result.data.forEach(item => {
      if (item._id in distribution) {
        distribution[item._id] = item.count;
      }
    });

    return distribution;
  }

  private async getLoginActivityStats(context?: RepositoryContext) {
    // Placeholder - would calculate from audit logs
    return {
      totalLogins: 0,
      uniqueLogins: 0,
      averageSessionDuration: 0,
      recentLogins: []
    };
  }

  private async getSecurityStats(context?: RepositoryContext) {
    const pipeline = [
      {
        $group: {
          _id: null,
          twoFactorEnabled: {
            $sum: { $cond: [{ $eq: ['$metadata.isTwoFactorEnabled', true] }, 1, 0] }
          },
          emailVerified: {
            $sum: { $cond: [{ $eq: ['$metadata.isEmailVerified', true] }, 1, 0] }
          },
          suspendedAccounts: {
            $sum: { $cond: [{ $eq: ['$status', 'suspended'] }, 1, 0] }
          },
          lockedAccounts: {
            $sum: { $cond: [{ $ne: ['$lockedUntil', null] }, 1, 0] }
          },
          failedLoginAttempts: { $sum: '$failedLoginAttempts' }
        }
      }
    ];

    const result = await this.aggregate<any>(pipeline, context);
    return result.data[0] || {
      twoFactorEnabled: 0,
      emailVerified: 0,
      suspendedAccounts: 0,
      lockedAccounts: 0,
      failedLoginAttempts: 0
    };
  }

  private async getDepartmentStats(context?: RepositoryContext) {
    const pipeline = [
      { $group: { _id: '$metadata.department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ];

    const result = await this.aggregate<{ _id: string; count: number }>(pipeline, context);
    
    return result.data.map(item => ({
      department: item._id || 'Unknown',
      adminCount: item.count,
      activeCount: item.count // Would need additional query for active count
    }));
  }

  /**
   * 🔹 LEGACY METHODS (for backward compatibility)
   */

  // ❌ DEPRECATED - Use findByEmailSecure instead
  async findByEmail(adminEmail: string): Promise<EAdmin | null> {
    console.warn('⚠️ AdminRepository.findByEmail() is deprecated. Use findByEmailSecure() instead.');
    return this.findByEmailSecure(adminEmail, true);
  }

  // ❌ DEPRECATED - Use findAdminByIdWithActivity instead
  async findUserById(userId: string): Promise<EAdmin | null> {
    console.warn('⚠️ AdminRepository.findUserById() is deprecated. Use findAdminByIdWithActivity() instead.');
    const admin = await this.findById(userId, { select: '-adminPassword' });
    return admin;
  }

  // ❌ DEPRECATED - Use createAdminSecure instead
  async create(data: DeepPartial<EAdmin>, context?: RepositoryContext): Promise<CreateResult<EAdmin>> {
    console.warn('⚠️ AdminRepository.create() is deprecated. Use createAdminSecure() instead.');
    return super.create(data, context);
  }
}

// ✅ TYPE DEFINITIONS
interface RatingStats {
  averageRating: number;
  totalCount: number;
  ratingDistribution: Record<string, number>;
}

// Re-export for use by other modules
export type {
  AdminCreateData,
  AdminUpdateData,
  AdminFilters,
  AdminAnalytics,
  AdminWithActivity,
  LoginAttemptData,
  SecurityAuditData,
  AdminRole,
  AdminStatus
};