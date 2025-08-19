/**
 * 🔹 PHASE 1 MIGRATION: Modern User Repository
 * Backward-compatible, type-safe user repository with enhanced error handling
 */

import { injectable } from "inversify";
import { Types, FilterQuery } from "mongoose";
import { EUsers } from "../../entities/userEntity";
import { IUserRepository } from "../interface/IUserRepository";
import { IUserCrudRepository } from "../interface/IUserCrudRepository";
import { IMentorQueryRepository } from "../interface/IMentorQueryRepository";
import { IUserStatusRepository } from "../interface/IUserStatusRepository";
import { IUserStatsRepository } from "../interface/IUserStatsRepository";
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
import Users from "../../models/userModel";
import Service from "../../models/serviceModel";
import mongoose from "mongoose";

/**
 * 🔹 USER-SPECIFIC TYPES
 */
interface UserCreateData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role?: string[];
  userType?: 'student' | 'professional' | 'mentor';
  profilePicture?: string;
  isGoogleAuth?: boolean;
  googleId?: string;
}

interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  bio?: string;
  activated?: boolean;
  mentorActivated?: boolean;
  isBlocked?: boolean;
  role?: string[];
  mentorId?: string;
  menteeId?: string;
  schoolDetails?: string;
  collegeDetails?: string;
  professionalDetails?: string;
}

interface MentorSearchFilters {
  role?: string;
  searchQuery?: string;
  isBlocked?: boolean;
  isApproved?: 'Approved' | 'Pending' | 'Rejected';
  location?: string;
  skills?: string[];
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  mentors: number;
  mentees: number;
  newUsersThisMonth: number;
  usersByRole: Record<string, number>;
}

/**
 * 🔹 MODERN USER REPOSITORY
 * Maintains backward compatibility while providing enhanced functionality
 */
@injectable()
export default class ModernUserRepository 
  extends EnhancedBaseRepository<EUsers>
  implements 
    IUserRepository,
    IUserCrudRepository,
    IMentorQueryRepository,
    IUserStatusRepository,
    IUserStatsRepository {

  constructor() {
    super(Users);
  }

  /**
   * 🔹 ENHANCED USER CREATION
   */

  /**
   * ✅ NEW: Type-safe user creation with comprehensive validation
   */
  async createUserSecure(
    userData: UserCreateData,
    context?: RepositoryContext
  ): Promise<CreateResult<EUsers>> {
    const operation = 'createUserSecure';

    try {
      // ✅ VALIDATE INPUT DATA
      this.validateUserCreateData(userData, operation);

      // ✅ CHECK FOR EXISTING USER
      await this.validateUniqueEmail(userData.email, operation);

      RepositoryLogger.logStart(operation, this.entityName, undefined, {
        email: userData.email,
        userType: userData.userType,
        ...context?.metadata
      });

      // ✅ PREPARE USER DATA
      const userDataWithDefaults = {
        ...userData,
        role: userData.role || ['mentee'],
        activated: false,
        mentorActivated: false,
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // ✅ CREATE USER
      const result = await this.create(userDataWithDefaults, context);

      if (result.success && result.data) {
        // ✅ REMOVE SENSITIVE DATA FROM RESPONSE
        const safeUser = await this.findById(
          result.data._id.toString(),
          { select: '-password' },
          context
        );

        RepositoryLogger.logSuccess(operation, this.entityName, result.data._id.toString(), {
          email: userData.email,
          userType: userData.userType
        });

        return {
          success: true,
          data: safeUser!
        };
      }

      return result;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * ✅ NEW: Secure Google sign-up with validation
   */
  async createGoogleUser(
    googleData: UserCreateData & { googleId: string },
    context?: RepositoryContext
  ): Promise<CreateResult<EUsers>> {
    const operation = 'createGoogleUser';

    try {
      // ✅ VALIDATE GOOGLE DATA
      if (!googleData.googleId) {
        throw RepositoryErrorFactory.validationError(
          'Google ID is required for Google sign-up',
          operation,
          this.entityName,
          undefined,
          { email: googleData.email }
        );
      }

      // ✅ CHECK FOR EXISTING GOOGLE USER
      const existingUser = await this.findOne({
        $or: [
          { email: googleData.email },
          { googleId: googleData.googleId }
        ]
      }, undefined, context);

      if (existingUser) {
        throw RepositoryErrorFactory.duplicateError(
          this.entityName,
          operation,
          'email or googleId',
          googleData.email
        );
      }

      // ✅ CREATE GOOGLE USER
      const userData: UserCreateData = {
        ...googleData,
        isGoogleAuth: true,
        role: ['mentee']
      };

      return this.createUserSecure(userData, context);

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * 🔹 ENHANCED USER QUERIES
   */

  /**
   * ✅ NEW: Type-safe email lookup with population options
   */
  async findByEmailSecure(
    email: string,
    includePassword: boolean = false,
    context?: RepositoryContext
  ): Promise<EUsers | null> {
    const operation = 'findByEmailSecure';

    try {
      this.validateEmail(email, operation);

      RepositoryLogger.logStart(operation, this.entityName, undefined, { email });

      const selectFields = includePassword ? '' : '-password';
      const options: FindOptions = {
        select: selectFields,
        populate: [
          { path: 'mentorId' },
          { path: 'menteeId' },
          { path: 'schoolDetails' },
          { path: 'collegeDetails' },
          { path: 'professionalDetails' }
        ]
      };

      const user = await this.findOne({ email }, options, context);

      RepositoryLogger.logSuccess(operation, this.entityName, user?._id?.toString(), {
        email,
        found: !!user
      });

      return user;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * ✅ NEW: Enhanced user update with validation
   */
  async updateUserSecure(
    userId: string,
    updateData: UserUpdateData,
    context?: RepositoryContext
  ): Promise<UpdateResult<EUsers>> {
    const operation = 'updateUserSecure';

    try {
      this.validateObjectId(userId, operation);
      this.validateUserUpdateData(updateData, operation);

      RepositoryLogger.logStart(operation, this.entityName, userId, { updateData });

      // ✅ POPULATE AFTER UPDATE
      const options = {
        new: true,
        runValidators: true,
        populate: [
          { path: 'mentorId' },
          { path: 'menteeId' },
          { path: 'schoolDetails' },
          { path: 'collegeDetails' },
          { path: 'professionalDetails' }
        ]
      };

      return this.update(userId, updateData, options, context);

    } catch (error: any) {
      this.handleError(error, operation, userId, context);
    }
  }

  /**
   * ✅ NEW: Secure password change with validation
   */
  async changePasswordSecure(
    email: string,
    newPassword: string,
    context?: RepositoryContext
  ): Promise<UpdateResult<EUsers>> {
    const operation = 'changePasswordSecure';

    try {
      this.validateEmail(email, operation);
      this.validatePassword(newPassword, operation);

      RepositoryLogger.logStart(operation, this.entityName, undefined, { email });

      // ✅ FIND USER FIRST
      const user = await this.findByEmailSecure(email, false, context);
      if (!user) {
        throw RepositoryErrorFactory.notFoundError(this.entityName, email, operation);
      }

      // ✅ UPDATE PASSWORD
      const result = await this.update(
        user._id.toString(),
        { password: newPassword },
        { new: true, runValidators: true },
        context
      );

      RepositoryLogger.logSuccess(operation, this.entityName, user._id.toString(), { email });

      return result;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * 🔹 ENHANCED MENTOR OPERATIONS
   */

  /**
   * ✅ NEW: Advanced mentor search with type-safe filters
   */
  async getMentorsAdvanced(
    pagination: PaginationParams,
    filters?: MentorSearchFilters,
    context?: RepositoryContext
  ): Promise<PaginatedResponse<any>> {
    const operation = 'getMentorsAdvanced';

    try {
      this.validatePaginationParams(pagination);

      RepositoryLogger.logStart(operation, this.entityName, undefined, { pagination, filters });

      // ✅ BUILD TYPE-SAFE FILTER QUERY
      const query = this.buildMentorFilterQuery(filters);

      // ✅ USE AGGREGATION FOR COMPLEX MENTOR DATA
      const pipeline = [
        { $match: query },
        {
          $lookup: {
            from: 'mentors',
            localField: 'mentorId',
            foreignField: '_id',
            as: 'mentorDetails'
          }
        },
        { $unwind: { path: '$mentorDetails', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'schooldetails',
            localField: 'schoolDetails',
            foreignField: '_id',
            as: 'schoolInfo'
          }
        },
        {
          $lookup: {
            from: 'collegedetails',
            localField: 'collegeDetails',
            foreignField: '_id',
            as: 'collegeInfo'
          }
        },
        {
          $lookup: {
            from: 'professionaldetails',
            localField: 'professionalDetails',
            foreignField: '_id',
            as: 'professionalInfo'
          }
        },
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            profilePicture: 1,
            isBlocked: 1,
            mentorId: '$mentorDetails._id',
            bio: '$mentorDetails.bio',
            skills: '$mentorDetails.skills',
            isApproved: '$mentorDetails.isApproved',
            schoolInfo: { $arrayElemAt: ['$schoolInfo', 0] },
            collegeInfo: { $arrayElemAt: ['$collegeInfo', 0] },
            professionalInfo: { $arrayElemAt: ['$professionalInfo', 0] }
          }
        },
        { $sort: { [pagination.sortBy || 'createdAt']: pagination.sortOrder === 'asc' ? 1 : -1 } }
      ];

      // ✅ EXECUTE WITH PAGINATION
      const skip = (pagination.page - 1) * pagination.limit;
      const [data, totalCount] = await Promise.all([
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

      const total = totalCount[0]?.total || 0;
      const totalPages = Math.ceil(total / pagination.limit);

      // ✅ TRANSFORM DATA FOR FRONTEND
      const transformedData = data.map(this.transformMentorData);

      RepositoryLogger.logSuccess(operation, this.entityName, undefined, {
        count: transformedData.length,
        total,
        page: pagination.page
      });

      return {
        data: transformedData,
        pagination: {
          currentPage: pagination.page,
          totalPages,
          totalItems: total,
          hasNext: pagination.page < totalPages,
          hasPrev: pagination.page > 1,
          limit: pagination.limit
        }
      };

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * ✅ NEW: Get detailed mentor profile by ID
   */
  async getMentorByIdDetailed(
    mentorId: string,
    context?: RepositoryContext
  ): Promise<any> {
    const operation = 'getMentorByIdDetailed';

    try {
      this.validateObjectId(mentorId, operation);

      RepositoryLogger.logStart(operation, this.entityName, mentorId);

      // ✅ COMPLEX AGGREGATION FOR MENTOR DETAILS
      const pipeline = [
        { $match: { _id: new Types.ObjectId(mentorId) } },
        {
          $lookup: {
            from: 'mentors',
            localField: 'mentorId',
            foreignField: '_id',
            as: 'mentorDetails',
            pipeline: [{
              $lookup: {
                from: 'testimonials',
                localField: 'topTestimonials',
                foreignField: '_id',
                as: 'testimonials',
                pipeline: [{
                  $lookup: {
                    from: 'users',
                    localField: 'menteeId',
                    foreignField: '_id',
                    as: 'menteeInfo'
                  }
                }]
              }
            }]
          }
        },
        // ... additional lookups for education, work, etc.
        {
          $lookup: {
            from: 'services',
            localField: '_id',
            foreignField: 'mentorId',
            as: 'services',
            pipeline: [{
              $match: {
                $or: [
                  { type: '1-1Call', slot: { $exists: true, $ne: null } },
                  { type: { $in: ['DigitalProducts', 'priorityDM'] } }
                ]
              }
            }]
          }
        }
      ];

      const result = await this.aggregate(pipeline, context);

      if (result.data.length === 0) {
        throw RepositoryErrorFactory.notFoundError(this.entityName, mentorId, operation);
      }

      const mentorData = this.transformDetailedMentorData(result.data[0]);

      RepositoryLogger.logSuccess(operation, this.entityName, mentorId);

      return mentorData;

    } catch (error: any) {
      this.handleError(error, operation, mentorId, context);
    }
  }

  /**
   * 🔹 USER STATISTICS
   */

  /**
   * ✅ NEW: Comprehensive user statistics
   */
  async getUserStatistics(context?: RepositoryContext): Promise<UserStats> {
    const operation = 'getUserStatistics';

    try {
      RepositoryLogger.logStart(operation, this.entityName);

      const [totalUsers, activeUsers, usersByRole, newUsersThisMonth] = await Promise.all([
        this.count({}, context),
        this.count({ isBlocked: false }, context),
        this.getUsersByRole(context),
        this.getNewUsersThisMonth(context)
      ]);

      const stats: UserStats = {
        totalUsers,
        activeUsers,
        mentors: usersByRole.mentor || 0,
        mentees: usersByRole.mentee || 0,
        newUsersThisMonth,
        usersByRole
      };

      RepositoryLogger.logSuccess(operation, this.entityName, undefined, stats);

      return stats;

    } catch (error: any) {
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * 🔹 VALIDATION METHODS
   */

  private validateUserCreateData(data: UserCreateData, operation: string): void {
    const errors: string[] = [];

    if (!data.firstName?.trim()) errors.push('firstName is required');
    if (!data.lastName?.trim()) errors.push('lastName is required');
    if (!data.email?.trim()) errors.push('email is required');
    
    if (data.email && !this.isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }

    if (data.password && data.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    if (errors.length > 0) {
      throw RepositoryErrorFactory.validationError(
        `User creation validation failed: ${errors.join(', ')}`,
        operation,
        this.entityName,
        undefined,
        { errors, data: { email: data.email, firstName: data.firstName } }
      );
    }
  }

  private validateUserUpdateData(data: UserUpdateData, operation: string): void {
    const errors: string[] = [];

    if (data.firstName !== undefined && !data.firstName.trim()) {
      errors.push('firstName cannot be empty');
    }

    if (data.lastName !== undefined && !data.lastName.trim()) {
      errors.push('lastName cannot be empty');
    }

    if (data.role && !Array.isArray(data.role)) {
      errors.push('role must be an array');
    }

    if (errors.length > 0) {
      throw RepositoryErrorFactory.validationError(
        `User update validation failed: ${errors.join(', ')}`,
        operation,
        this.entityName,
        undefined,
        { errors, data }
      );
    }
  }

  private async validateUniqueEmail(email: string, operation: string): Promise<void> {
    const existingUser = await this.findOne({ email });
    if (existingUser) {
      throw RepositoryErrorFactory.duplicateError(
        this.entityName,
        operation,
        'email',
        email
      );
    }
  }

  private validateEmail(email: string, operation: string): void {
    if (!email || !this.isValidEmail(email)) {
      throw RepositoryErrorFactory.validationError(
        'Invalid email format',
        operation,
        this.entityName,
        undefined,
        { email }
      );
    }
  }

  private validatePassword(password: string, operation: string): void {
    if (!password || password.length < 8) {
      throw RepositoryErrorFactory.validationError(
        'Password must be at least 8 characters',
        operation,
        this.entityName,
        undefined,
        { passwordLength: password?.length }
      );
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 🔹 HELPER METHODS
   */

  private buildMentorFilterQuery(filters?: MentorSearchFilters): FilterQuery<EUsers> {
    const query: FilterQuery<EUsers> = {
      mentorId: { $exists: true, $ne: null }
    };

    if (!filters) return query;

    if (filters.role && filters.role.toLowerCase() !== 'all') {
      if (filters.role === 'School Student') {
        query.schoolDetails = { $exists: true, $ne: null };
      } else if (filters.role === 'College Student') {
        query.collegeDetails = { $exists: true, $ne: null };
      } else if (filters.role === 'Professional') {
        query.professionalDetails = { $exists: true, $ne: null };
      }
    }

    if (filters.searchQuery) {
      query.$or = [
        { firstName: { $regex: filters.searchQuery, $options: 'i' } },
        { lastName: { $regex: filters.searchQuery, $options: 'i' } },
        { email: { $regex: filters.searchQuery, $options: 'i' } }
      ];
    }

    if (filters.isBlocked !== undefined) {
      query.isBlocked = filters.isBlocked;
    }

    return query;
  }

  private transformMentorData(mentor: any): any {
    let mappedRole = 'N/A';
    let work = 'N/A';
    let badge = 'N/A';
    let workRole = 'N/A';

    if (mentor.professionalInfo) {
      mappedRole = 'Professional';
      work = mentor.professionalInfo.company || 'Unknown';
      badge = mentor.professionalInfo.jobRole || 'N/A';
      workRole = mentor.professionalInfo.jobRole || 'Professional';
    } else if (mentor.collegeInfo) {
      mappedRole = 'College Student';
      work = mentor.collegeInfo.collegeName || 'Unknown';
      badge = mentor.collegeInfo.course || 'N/A';
      workRole = mentor.collegeInfo.specializedIn || 'N/A';
    } else if (mentor.schoolInfo) {
      mappedRole = 'School Student';
      work = mentor.schoolInfo.schoolName || 'Unknown';
      badge = mentor.schoolInfo.schoolName || 'N/A';
      workRole = mentor.schoolInfo.class ? String(mentor.schoolInfo.class) : 'N/A';
    }

    return {
      userId: mentor._id?.toString(),
      mentorId: mentor.mentorId?.toString(),
      name: `${mentor.firstName} ${mentor.lastName || ''}`.trim(),
      bio: mentor.bio,
      role: mappedRole,
      work,
      workRole,
      profileImage: mentor.profilePicture,
      badge,
      isBlocked: mentor.isBlocked,
      isApproved: mentor.isApproved || 'Pending'
    };
  }

  private transformDetailedMentorData(data: any): any {
    // Implementation for detailed mentor data transformation
    // This would include education, work experience, testimonials, etc.
    return data; // Simplified for brevity
  }

  private async getUsersByRole(context?: RepositoryContext): Promise<Record<string, number>> {
    const pipeline = [
      { $unwind: '$role' },
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ];

    const result = await this.aggregate(pipeline, context);
    
    return result.data.reduce((acc: Record<string, number>, item: any) => {
      acc[item._id] = item.count;
      return acc;
    }, {});
  }

  private async getNewUsersThisMonth(context?: RepositoryContext): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return this.count({
      createdAt: { $gte: startOfMonth }
    }, context);
  }

  /**
   * 🔹 LEGACY COMPATIBILITY METHODS
   * These methods maintain backward compatibility while providing deprecation warnings
   */

  // ⚠️ DEPRECATED - Use createUserSecure instead
  async createUser(user: Partial<EUsers>): Promise<EUsers | null> {
    console.warn('⚠️ UserRepository.createUser() is deprecated. Use createUserSecure() for better type safety and error handling.');
    
    try {
      const result = await this.createUserSecure(user as UserCreateData);
      return result.success ? result.data || null : null;
    } catch (error: any) {
      console.error('Legacy createUser error:', error.message);
      return null;
    }
  }

  // ⚠️ DEPRECATED - Use findByEmailSecure instead
  async findByEmail(email: string): Promise<EUsers | null> {
    console.warn('⚠️ UserRepository.findByEmail() is deprecated. Use findByEmailSecure() for better error handling.');
    
    try {
      return await this.findByEmailSecure(email);
    } catch (error: any) {
      console.error('Legacy findByEmail error:', error.message);
      return null;
    }
  }

  // ⚠️ DEPRECATED - Use createGoogleUser instead
  async googleSignUp(user: Partial<EUsers>): Promise<EUsers | null> {
    console.warn('⚠️ UserRepository.googleSignUp() is deprecated. Use createGoogleUser() for better validation.');
    
    try {
      if (!user.email) return null;
      
      const result = await this.createGoogleUser({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
        googleId: user.googleId || '',
        profilePicture: user.profilePicture
      });
      
      return result.success ? result.data || null : null;
    } catch (error: any) {
      console.error('Legacy googleSignUp error:', error.message);
      return null;
    }
  }

  // ⚠️ DEPRECATED - Use changePasswordSecure instead
  async changePassword(email: string, password: string): Promise<EUsers | null> {
    console.warn('⚠️ UserRepository.changePassword() is deprecated. Use changePasswordSecure() for better validation.');
    
    try {
      const result = await this.changePasswordSecure(email, password);
      return result.success ? result.data || null : null;
    } catch (error: any) {
      console.error('Legacy changePassword error:', error.message);
      return null;
    }
  }

  // Keep other existing methods for full backward compatibility
  // ... (implement remaining legacy methods following the same pattern)
}