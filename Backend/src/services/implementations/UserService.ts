import { injectable } from "inversify";
import { EUsers } from "../../entities/userEntity";
import { EMentee } from "../../entities/menteeEntiry";
import { EMentor } from "../../entities/mentorEntity";
import { IUserService } from "../interface/IUserService";
import UserRespository from "../../repositories/implementations/UserRepository";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import bcrypt from "bcryptjs";
import * as Yup from "yup";
import CareerCollege from "../../repositories/implementations/CareerCollege";
import { ICareerCollege } from "../../repositories/interface/ICareerCollege";
import CareerSchool from "../../repositories/implementations/CareerSchool";
import { ICareerSchool } from "../../repositories/interface/ICareerSchool";
import CareerProfessional from "../../repositories/implementations/CareerProfessional";
import { ICareerProfessional } from "../../repositories/interface/ICareerProfessional";
import MenteeService from "./MenteeService";
import { IMenteeService } from "../interface/IMenteeService";
import MentorService from "./MentorService";
import { IMentorService } from "../interface/IMentorService";
import {
  UserNotFoundError,
  UserUnauthorizedError,
  UserValidationError,
  UserBlockedError,
} from "../../utils/exceptions/UserExceptions";
import { UserValidators } from "../../utils/validators/UserValidators";
import { UserCacheService } from "../../utils/cache/UserCacheService";
// Define collection types
type CollectionType = "user" | "mentee" | "mentor";

const collegeDetailsSchema = Yup.object().shape({
  collegeName: Yup.string().required("College name is required"),
  course: Yup.string().required("Course is required"),
  specializedIn: Yup.string().optional(),
  city: Yup.string().required("City is required"),
  startDate: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date format (YYYY-MM-DD)")
    .required("Start date is required"),
  endDate: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid end date format (YYYY-MM-DD)")
    .required("End date is required"),
  userType: Yup.string()
    .oneOf(["college", "fresher"], "Invalid user type")
    .required("User type is required"),
});
interface BlockStatusResponse {
  isBlocked: boolean;
  blockData?: {
    reason: string;
    category: string;
    adminEmail: string;
    timestamp: string;
    canAppeal: boolean;
    severity: "high" | "medium" | "low";
  };
  userInfo: {
    userId: string;
    email: string;
    isActive: boolean;
    lastLogin?: Date;
  };
  cacheHit?: boolean;
}
@injectable()
export default class UserService implements IUserService {
  private UserRepository: IUserRepository;
  private CareerCollege: ICareerCollege;
  private CareerSchool: ICareerSchool;
  private CareerProfessional: ICareerProfessional;
  private MenteeService: IMenteeService;
  private MentorService: IMentorService;
  private cacheService: UserCacheService;
  constructor() {
    this.UserRepository = new UserRespository();
    this.CareerCollege = new CareerCollege();
    this.CareerSchool = new CareerSchool();
    this.CareerProfessional = new CareerProfessional();
    this.MenteeService = new MenteeService();
    this.MentorService = new MentorService();
    this.cacheService = UserCacheService.getInstance();
  }

  async findUserWithEmail(user: Partial<EUsers>): Promise<EUsers | null> {
    try {
      console.log("user data step 1 : users", user);
      if (!user.email) {
        console.log("user data step 2 : no user ");
        throw new Error("Email not existing");
      }
      console.log("user data step 4 : ");
      const userFound = await this.UserRepository.findByEmail(user.email);
      console.log("user data step 5 : ", userFound);
      if (!userFound) {
        console.log("user data step 6 : error");
        console.error("user not found find with user email in service");
        return null;
      }
      console.log("user data step 7: success ");
      const userObject = userFound.toObject();
      console.log("user data step 8: success ");
      const { password, ...userData } = userObject;
      console.log("user data step 9: success ", userData);
      return userData;
    } catch (error) {
      console.log("error at find user with email at service", error);
      return null;
    }
  }

  public async editProfile<T>(
    id: string,
    payload: any,
    collectionType: CollectionType
  ): Promise<T | null> {
    try {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      console.log(
        `service editProfile for ${collectionType} step 1`,
        id,
        payload
      );
      let updateData: T | null = null;
      const editableFields = [
        "featuredArticle",
        "portfolio",
        "youtubeURL",
        "linkedinURL",
        "achievements",
        "portfolio",
        "bio",
      ];
      if (editableFields.some((key) => key in payload)) {
        console.log(
          "Updating portfolio-related or achievements-related fields.step 1 "
        );
        const user = await this.UserRepository.findById(id);
        console.log(
          "Updating portfolio-related or achievements-related fields.step 2 ",
          user
        );
        const mentorId = user?.mentorId?.toString();
        console.log(
          "Updating portfolio-related or achievements-related fields.step 3 ",
          mentorId
        );
        if (!mentorId) {
          throw new Error("Mentor ID is undefined for this user.");
        }
        const updateMentor = await this.MentorService.updateMentor(
          mentorId,
          payload
        );
        console.log(
          "Updating portfolio-related or achievements-related fields.step 4",
          updateMentor
        );
      }
      if ("schoolDetails" in payload) {
        console.log("Payload has schoolDetails:step 1", payload.schoolDetails);

        const user = await this.UserRepository.findById(id);
        console.log("Payload has schoolDetails:step 2", user);

        const updateSchoolDetails =
          await this.CareerSchool.updateSchoolExperience(
            user?.schoolDetails, // this is ObjectId from User
            payload.schoolDetails // ✅ pass only the object inside
          );

        console.log("Updated schoolDetails >>>>", updateSchoolDetails);
      } else if ("collegeDetails" in payload) {
        console.log(
          "Payload has collegeDetails:step 1",
          payload.collegeDetails
        );

        const user = await this.UserRepository.findById(id);
        console.log("Payload has collegeDetails:step 2", user);

        const updateCollegeDetails =
          await this.CareerCollege.updateCollegeExperience(
            user?.collegeDetails, // this is ObjectId from User
            payload.collegeDetails // ✅ pass only the object inside
          );

        console.log("Updated collegeDetails >>>>", updateCollegeDetails);
      } else if ("professionalDetails" in payload) {
        console.log(
          "Payload has professionalDetails:step 1",
          payload.professionalDetails
        );

        const user = await this.UserRepository.findById(id);
        console.log("Payload has professionalDetails:step 2", user);

        const updateProfessionalDetails =
          await this.CareerProfessional.updateProfessionalExperience(
            user?.professionalDetails, // this is ObjectId from User
            payload.professionalDetails // ✅ pass only the object inside
          );

        console.log(
          "Updated professionalDetails >>>>",
          updateProfessionalDetails
        );
      } else {
        if (collectionType === "user") {
          const user = await this.UserRepository.findById(id);

          if (!user) {
            console.error("User not found:", id);
            throw new Error("User not found");
          }

          let userUpdatePayload = { ...payload };

          // Handle schoolDetails
          if (payload.schoolDetails) {
            // Add schoolDetails validation if needed
            const schoolPayload = {
              ...payload.schoolDetails,
              userType: payload.schoolDetails.userType || "school",
            };
            let schoolDoc;
            if (user.schoolDetails) {
              schoolDoc = await this.CareerSchool.updateSchoolExperience(
                user.schoolDetails.toString(), // Ensure ObjectId is passed as string
                schoolPayload
              );
            } else {
              schoolDoc = await this.CareerSchool.schoolStudentFormDataCreate(
                schoolPayload,
                id
              );
              if (schoolDoc) {
                userUpdatePayload.schoolDetails = schoolDoc._id;
              }
            }
            if (!schoolDoc) {
              throw new Error("Failed to update or create school details");
            }
          }

          // Handle collegeDetails
          if (payload.collegeDetails) {
            // Validate collegeDetails payload
            await collegeDetailsSchema.validate(payload.collegeDetails, {
              abortEarly: false,
            });

            const collegePayload = {
              ...payload.collegeDetails,
              collegeName:
                payload.collegeDetails.collegeName ||
                payload.collegeDetails.college, // Map 'college' to 'collegeName' for backward compatibility
              userType:
                payload.collegeDetails.userType ||
                user.category ||
                user.collegeDetails?.userType ||
                "college",
            };
            let collegeDoc;
            if (user.collegeDetails) {
              collegeDoc = await this.CareerCollege.updateCollegeExperience(
                user.collegeDetails.toString(), // Ensure ObjectId is passed as string
                collegePayload
              );
            } else {
              collegeDoc =
                await this.CareerCollege.collegeStudentFormDataCreate(
                  collegePayload,
                  id
                );
              if (collegeDoc) {
                userUpdatePayload.collegeDetails = collegeDoc._id;
              }
            }
            if (!collegeDoc) {
              throw new Error("Failed to update or create college details");
            }
          }

          // Handle professionalDetails
          if (payload.professionalDetails) {
            // Add professionalDetails validation if needed
            const professionalPayload = {
              ...payload.professionalDetails,
              userType: payload.professionalDetails.userType || "professional",
            };
            let professionalDoc;
            if (user.professionalDetails) {
              professionalDoc =
                await this.CareerProfessional.updateProfessionalExperience(
                  user.professionalDetails.toString(),
                  professionalPayload
                );
            } else {
              professionalDoc =
                await this.CareerProfessional.professionalFormDataCreate(
                  professionalPayload,
                  id
                );
              if (professionalDoc) {
                userUpdatePayload.professionalDetails = professionalDoc._id;
              }
            }
            if (!professionalDoc) {
              throw new Error(
                "Failed to update or create professional details"
              );
            }
          }

          // Update user document with references or other fields
          updateData = (await this.UserRepository.update(
            id,
            userUpdatePayload
          )) as T;
        } else {
          // Handle mentee or mentor updates
          switch (collectionType) {
            case "mentee":
              updateData = (await this.MenteeService.updateMentee(
                id,
                payload
              )) as T;
              break;
            case "mentor":
              updateData = (await this.MentorService.updateMentor(
                id,
                payload
              )) as T;
              break;
            default:
              throw new Error(`Unsupported collection type: ${collectionType}`);
          }
        }
      }

      updateData = await this.UserRepository.findById(id);

      console.log(
        `service editProfile for ${collectionType} step 2`,
        updateData
      );
      return updateData;
    } catch (error) {
      console.log(`error at editProfile service for ${collectionType}`, error);
      throw error; // Throw error to be handled by controller
    }
  }

  public async editUserProfile(
    id: string,
    payload: any
  ): Promise<EUsers | null> {
    return this.editProfile<EUsers>(id, payload, "user");
  }

  public async editMenteeProfile(
    id: string,
    payload: any
  ): Promise<EMentee | null> {
    return this.editProfile<EMentee>(id, payload, "mentee");
  }

  public async editMentorProfile(
    id: string,
    payload: any
  ): Promise<EMentor | null> {
    return this.editProfile<EMentor>(id, payload, "mentor");
  }

  private getRepository(collectionType: CollectionType): RepositoryType {
    switch (collectionType) {
      case "user":
        return this.UserRepository;
      case "mentee":
        return this.MenteeService;
      case "mentor":
        return this.MentorService;
      default:
        throw new Error(`Unsupported collection type: ${collectionType}`);
    }
  }

  public async findById<T>(
    id: string,
    collectionType: CollectionType
  ): Promise<T | null> {
    try {
      console.log(`Finding ${collectionType} by ID:`, id);

      let result: T | null = null;

      // Handle each collection type specifically
      switch (collectionType) {
        case "user":
          // For Users collection, just use findById with single argument
          result = (await this.UserRepository.findById(id)) as T;
          break;
        case "mentee":
          result = (await this.MenteeService.findMenteeById(id)) as T;
          break;
        case "mentor":
          result = (await this.MentorService.getMentorById(id)) as T;
          break;
        default:
          throw new Error(`Unsupported collection type: ${collectionType}`);
      }

      console.log(`Found ${collectionType}:`, result);
      return result;
    } catch (error) {
      console.log(`Error finding ${collectionType} by ID:`, error);
      return null;
    }
  }

  async updatePassword(
    id: string,
    password: string,
    newPassword: string,
    collectionType: CollectionType = "user"
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log(
        `UserService updatePassword step 1 for ${collectionType}`,
        id,
        password,
        newPassword
      );

      let user: any = null;

      // Get user from appropriate repository
      switch (collectionType) {
        case "user":
          user = await this.UserRepository.findById(id);
          break;
        case "mentee":
          user = await this.MenteeService.findMenteeById(id);
          break;
        case "mentor":
          user = await this.MentorService.getMentorById(id);
          break;
        default:
          throw new Error(`Unsupported collection type: ${collectionType}`);
      }

      if (!user || !user.password) {
        return {
          success: false,
          message: "User not found or password missing",
        };
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return { success: false, message: "Current password is incorrect" };
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password in appropriate repository
      switch (collectionType) {
        case "user":
          await this.UserRepository.update(id, {
            password: hashedPassword,
          } as any);
          break;
        case "mentee":
          await this.MenteeService.updateMentee(id, {
            password: hashedPassword,
          } as any);
          break;
        case "mentor":
          await this.MentorService.updateMentor(id, {
            password: hashedPassword,
          } as any);
          break;
      }

      return { success: true, message: "Password updated successfully" };
    } catch (error) {
      console.error(
        `Error at updatePassword in UserService for ${collectionType}:`,
        error
      );
      return {
        success: false,
        message: "Something went wrong while updating password",
      };
    }
  }

  async updateOnlineStatus(
    userId: string,
    isOnline: boolean,
    role: "mentor" | "mentee" | null,
    collectionType: CollectionType = "user"
  ): Promise<any | null> {
    try {
      console.log(
        `UserService updateOnlineStatus step 1 for ${collectionType}`,
        { userId, isOnline, role }
      );

      const updateData = {
        isOnline: { status: isOnline, role },
      };

      let updatedUser: any = null;

      // Update in appropriate repository
      switch (collectionType) {
        case "user":
          updatedUser = await this.UserRepository.update(userId, updateData);
          break;
        case "mentee":
          updatedUser = await this.MenteeService.updateMentee(
            userId,
            updateData
          );
          break;
        case "mentor":
          updatedUser = await this.MentorService.updateMentor(
            userId,
            updateData
          );
          break;
        default:
          throw new Error(`Unsupported collection type: ${collectionType}`);
      }

      console.log(
        `UserService updateOnlineStatus step 2 for ${collectionType}`,
        updatedUser
      );

      if (!updatedUser) {
        console.error(
          `UserService: Failed to update ${collectionType}`,
          userId
        );
        return null;
      }

      return updatedUser;
    } catch (error: any) {
      console.error(
        `Error at updateOnlineStatus in UserService for ${collectionType}:`,
        error.message
      );
      throw new Error(`Failed to update online status for ${collectionType}`);
    }
  }

  public async bulkUpdate<T>(
    updates: Array<{ id: string; payload: any }>,
    collectionType: CollectionType
  ): Promise<Array<T | null>> {
    try {
      console.log(`Bulk updating ${collectionType} profiles`, updates);

      const results = await Promise.allSettled(
        updates.map(async ({ id, payload }) => {
          switch (collectionType) {
            case "user":
              return await this.UserRepository.update(id, payload);
            case "mentee":
              return await this.MenteeService.updateMentee(id, payload);
            case "mentor":
              return await this.MentorService.updateMentor(id, payload);
            default:
              throw new Error(`Unsupported collection type: ${collectionType}`);
          }
        })
      );

      return results.map((result) =>
        result.status === "fulfilled" ? (result.value as T) : null
      );
    } catch (error) {
      console.log(`Error in bulk update for ${collectionType}:`, error);
      return [];
    }
  }
  async checkUserBlockStatus(
    userId: string,
    requestingUserId: string
  ): Promise<BlockStatusResponse> {
    const startTime = Date.now();
    console.log("🔍 UserService: Starting checkUserBlockStatus", {
      userId,
      requestingUserId,
      timestamp: new Date().toISOString(),
    });

    try {
      // 🎯 STEP 1: Input Validation
      console.log("🔍 UserService: Step 1 - Validating inputs");

      UserValidators.validateUserId(userId, "userId");
      UserValidators.validateUserId(requestingUserId, "requestingUserId");
      UserValidators.validateUserAuthorization(requestingUserId, userId);

      console.log("✅ UserService: Input validation passed");

      // 🎯 STEP 2: Cache Check
      console.log("🔍 UserService: Step 2 - Checking cache");

      const cachedResult = await this.cacheService.getBlockStatus(userId);
      if (cachedResult) {
        console.log("✅ UserService: Cache hit, returning cached data");

        const result: BlockStatusResponse = {
          isBlocked: cachedResult.isBlocked,
          blockData: cachedResult.blockData,
          userInfo: cachedResult.userInfo,
          cacheHit: true,
        };

        this.logPerformanceMetrics("checkUserBlockStatus", startTime, true);
        return result;
      }

      console.log("📦 UserService: Cache miss, querying database");

      // 🎯 STEP 3: Database Query (through Repository)
      console.log("🔍 UserService: Step 3 - Querying database via repository");

      const user = await this.UserRepository.findById(userId);

      if (!user) {
        console.error("❌ UserService: User not found in database");
        throw new UserNotFoundError(userId, {
          requestingUserId,
          method: "checkUserBlockStatus",
        });
      }

      console.log("✅ UserService: User found in database", {
        userId: user._id,
        email: user.email,
        isBlocked: user.isBlocked,
      });

      // 🎯 STEP 4: Business Logic Processing
      console.log("🔍 UserService: Step 4 - Processing business logic");

      const blockStatusResponse = await this.processUserBlockStatus(user);

      // 🎯 STEP 5: Cache the Result
      console.log("🔍 UserService: Step 5 - Caching result");

      const cacheSuccess = await this.cacheService.setBlockStatus(userId, {
        isBlocked: blockStatusResponse.isBlocked,
        blockData: blockStatusResponse.blockData,
        userInfo: blockStatusResponse.userInfo,
      });

      if (cacheSuccess) {
        console.log("✅ UserService: Result cached successfully");
      } else {
        console.warn("⚠️ UserService: Failed to cache result (non-critical)");
      }

      // 🎯 STEP 6: Return Response
      const finalResponse: BlockStatusResponse = {
        ...blockStatusResponse,
        cacheHit: false,
      };

      this.logPerformanceMetrics("checkUserBlockStatus", startTime, false);
      console.log(
        "✅ UserService: checkUserBlockStatus completed successfully"
      );

      return finalResponse;
    } catch (error: any) {
      console.error("❌ UserService: checkUserBlockStatus failed", {
        userId,
        requestingUserId,
        error: error.message,
        errorType: error.constructor.name,
        stack: error.stack,
      });

      // Log performance metrics even for errors
      this.logPerformanceMetrics(
        "checkUserBlockStatus",
        startTime,
        false,
        error
      );

      // Re-throw if it's already our custom exception
      if (
        error instanceof UserNotFoundError ||
        error instanceof UserUnauthorizedError ||
        error instanceof UserValidationError
      ) {
        throw error;
      }

      // Wrap unexpected errors
      throw new UserValidationError("system", "unexpected_error", {
        originalError: error.message,
        userId,
        requestingUserId,
      });
    }
  }

  /**
   * Process user block status with comprehensive business logic
   * Private method - encapsulates business rules
   */
  private async processUserBlockStatus(
    user: any
  ): Promise<Omit<BlockStatusResponse, "cacheHit">> {
    console.log("🔄 UserService: Processing user block status", {
      userId: user._id,
      isBlocked: user.isBlocked,
    });

    try {
      // Build user info
      const userInfo = {
        userId: user._id.toString(),
        email: user.email,
        isActive: !user.isBlocked && user.activated !== false,
        lastLogin: user.lastLogin || undefined,
      };

      // If user is not blocked, return simple response
      if (!user.isBlocked) {
        console.log("✅ UserService: User is not blocked");
        return {
          isBlocked: false,
          userInfo,
        };
      }

      // User is blocked - get block details
      console.log("🚨 UserService: User is blocked, processing block data");

      const blockData = await this.buildBlockData(user);
      UserValidators.validateBlockStatusData(blockData);

      const response = {
        isBlocked: true,
        blockData,
        userInfo,
      };

      console.log("✅ UserService: Block status processed successfully", {
        userId: user._id,
        category: blockData.category,
        severity: blockData.severity,
      });

      return response;
    } catch (error: any) {
      console.error("❌ UserService: Failed to process block status", {
        userId: user._id,
        error: error.message,
      });
      throw error;
    }
  }
  private async buildBlockData(user: any): Promise<{
    reason: string;
    category: string;
    adminEmail: string;
    timestamp: string;
    canAppeal: boolean;
    severity: "high" | "medium" | "low";
  }> {
    console.log("🔨 UserService: Building block data for user", user._id);

    // Default block data structure
    const defaultBlockData = {
      reason: "Account suspended due to policy violation",
      category: "terms_violation",
      adminEmail: "sreekuttan12kaathu@gmail.com",
      timestamp: user.blockedAt || user.updatedAt || new Date().toISOString(),
      canAppeal: true,
      severity: "medium" as const,
    };

    // In a real application, you might have a separate BlockedUsers collection
    // or additional fields in the User model to store block details

    // For now, we'll check if there's any additional block information
    const blockData = {
      ...defaultBlockData,
      // Override with actual data if available
      ...(user.blockDetails || {}),
      // Ensure severity is one of the allowed values
      severity: this.determineSeverity(
        user.blockReason || defaultBlockData.category
      ),
    };

    console.log("✅ UserService: Block data built successfully", {
      userId: user._id,
      category: blockData.category,
      severity: blockData.severity,
    });

    return blockData;
  }
  private determineSeverity(category: string): "high" | "medium" | "low" {
    const severityMap: { [key: string]: "high" | "medium" | "low" } = {
      harassment: "high",
      fraud: "high",
      security: "high",
      spam: "medium",
      inappropriate_content: "medium",
      terms_violation: "medium",
      other: "low",
    };

    return severityMap[category] || "medium";
  }

  /**
   * Log performance metrics
   * Private method - monitoring and observability
   */
  private logPerformanceMetrics(
    operation: string,
    startTime: number,
    cacheHit: boolean,
    error?: Error
  ): void {
    const duration = Date.now() - startTime;
    const metrics = {
      operation,
      duration: `${duration}ms`,
      cacheHit,
      success: !error,
      timestamp: new Date().toISOString(),
      ...(error && {
        error: error.message,
        errorType: error.constructor.name,
      }),
    };

    console.log("📊 UserService: Performance metrics", metrics);

    // In production, you might send this to a monitoring service
    if (process.env.NODE_ENV === "production") {
      // Example: Send to monitoring service
      // this.monitoringService.trackMetrics(metrics);
    }
  }

  // ✅ ADD this new method:
  async getLatestAppealByEmail(email: string): Promise<{
    success: boolean;
    data?: any;
    message: string;
  }> {
    try {
      console.log("AppealService: Getting latest appeal for email", { email });

      // Find user by email
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      // Find latest appeal for this user
      const appeals = await this.appealRepository.find({
        userId: user._id.toString(),
      });

      if (appeals.length === 0) {
        return {
          success: false,
          message: "No appeals found",
        };
      }

      // Get the most recent appeal
      const latestAppeal = appeals.sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      )[0];

      console.log("AppealService: Latest appeal found", {
        appealId: latestAppeal._id,
        status: latestAppeal.status,
        appealCount: latestAppeal.appealCount,
      });

      return {
        success: true,
        data: {
          _id: latestAppeal._id,
          status: latestAppeal.status,
          appealCount: latestAppeal.appealCount || 1,
          canReappeal: latestAppeal.canReappeal !== false,
          submittedAt: latestAppeal.submittedAt,
          adminResponse: latestAppeal.adminResponse,
        },
        message: "Latest appeal retrieved successfully",
      };
    } catch (error: any) {
      console.error("AppealService: Error getting latest appeal", error);
      return {
        success: false,
        message: "Failed to retrieve latest appeal",
      };
    }
  }
  async checkUserRegistrationByEmail(email: string): Promise<boolean> {
    try {
      console.log("UserService: Checking user registration for email", email);

      if (!email || typeof email !== "string") {
        console.log("UserService: Invalid email provided");
        return false;
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Use existing findByEmail method
      const user = await this.UserRepository.findByEmail(normalizedEmail);

      const isRegistered = !!user;
      console.log("UserService: User registration check result", {
        email: normalizedEmail,
        isRegistered,
      });

      return isRegistered;
    } catch (error: any) {
      console.error("UserService: Error checking user registration", {
        email,
        error: error.message,
      });
      // Return false on error (treat as guest user)
      return false;
    }
  }
}
