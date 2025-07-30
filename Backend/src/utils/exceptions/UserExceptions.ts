import { HttpStatus } from "../../constants/HttpStatus";

export class UserException extends Error {
  public statusCode: number;
  public code: string;
  public timestamp: Date;
  public context?: any;

  constructor(
    message: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    code: string = "USER_ERROR",
    context?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.timestamp = new Date();
    this.context = context;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class UserNotFoundError extends UserException {
  constructor(userId: string, context?: any) {
    super(
      `User not found with ID: ${userId}`,
      HttpStatus.NOT_FOUND,
      "USER_NOT_FOUND",
      { userId, ...context }
    );
  }
}

export class UserUnauthorizedError extends UserException {
  constructor(message: string = "Unauthorized access", context?: any) {
    super(message, HttpStatus.UNAUTHORIZED, "USER_UNAUTHORIZED", context);
  }
}

export class UserValidationError extends UserException {
  constructor(field: string, value: any, context?: any) {
    super(
      `Invalid ${field}: ${value}`,
      HttpStatus.BAD_REQUEST,
      "USER_VALIDATION_ERROR",
      { field, value, ...context }
    );
  }
}

export class UserBlockedError extends UserException {
  constructor(userId: string, blockData: any, context?: any) {
    super(
      `User ${userId} is currently blocked`,
      HttpStatus.FORBIDDEN,
      "USER_BLOCKED",
      { userId, blockData, ...context }
    );
  }
}

export class UserCacheError extends UserException {
  constructor(operation: string, error: any, context?: any) {
    super(
      `Cache operation failed: ${operation}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      "USER_CACHE_ERROR",
      { operation, originalError: error.message, ...context }
    );
  }
}
