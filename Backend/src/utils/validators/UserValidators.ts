import { Types } from "mongoose";
import { UserValidationError } from "../exceptions/UserExceptions";

export class UserValidators {
  /**
   * Validate MongoDB ObjectId
   */
  static validateUserId(userId: string, fieldName: string = "userId"): void {
    if (!userId) {
      throw new UserValidationError(fieldName, userId, {
        reason: "Required field missing",
      });
    }

    if (typeof userId !== "string") {
      throw new UserValidationError(fieldName, userId, {
        reason: "Must be a string",
      });
    }

    if (userId.trim().length === 0) {
      throw new UserValidationError(fieldName, userId, {
        reason: "Cannot be empty",
      });
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new UserValidationError(fieldName, userId, {
        reason: "Invalid MongoDB ObjectId format",
      });
    }
  }

  /**
   * Validate user authorization
   */
  static validateUserAuthorization(
    requestingUserId: string,
    targetUserId: string,
    isAdmin: boolean = false
  ): void {
    this.validateUserId(requestingUserId, "requestingUserId");
    this.validateUserId(targetUserId, "targetUserId");

    // Allow access if:
    // 1. User is requesting their own data
    // 2. User is an admin
    if (requestingUserId !== targetUserId && !isAdmin) {
      throw new UserValidationError(
        "authorization",
        {
          requestingUserId,
          targetUserId,
        },
        {
          reason: "Users can only access their own block status",
        }
      );
    }
  }

  /**
   * Validate block status response data
   */
  static validateBlockStatusData(blockData: any): void {
    if (!blockData) return;

    const requiredFields = ["reason", "category", "adminEmail", "timestamp"];
    const missingFields = requiredFields.filter((field) => !blockData[field]);

    if (missingFields.length > 0) {
      throw new UserValidationError("blockData", blockData, {
        reason: "Missing required fields",
        missingFields,
      });
    }
  }

  /**
   * Sanitize user input
   */
  static sanitizeUserId(userId: string): string {
    if (!userId) return userId;

    return userId.toString().trim();
  }

  /**
   * Validate cache key format
   */
  static validateCacheKey(key: string): void {
    if (!key || typeof key !== "string") {
      throw new UserValidationError("cacheKey", key, {
        reason: "Cache key must be a non-empty string",
      });
    }

    // Ensure cache key follows naming convention
    if (!/^user_block_status_[a-f0-9]{24}$/.test(key)) {
      throw new UserValidationError("cacheKey", key, {
        reason: "Cache key must follow pattern: user_block_status_{userId}",
      });
    }
  }
}
