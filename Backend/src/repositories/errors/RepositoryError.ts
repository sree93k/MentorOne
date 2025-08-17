/**
 * 🔹 INDUSTRY STANDARD: Repository Error System
 * Type-safe error handling for repository operations
 */

export enum RepositoryErrorCode {
  // Validation Errors
  INVALID_ID = 'INVALID_ID',
  INVALID_DATA = 'INVALID_DATA',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  
  // Not Found Errors
  ENTITY_NOT_FOUND = 'ENTITY_NOT_FOUND',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  
  // Conflict Errors
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  CONSTRAINT_VIOLATION = 'CONSTRAINT_VIOLATION',
  
  // Database Errors
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  QUERY_FAILED = 'QUERY_FAILED',
  
  // Operation Errors
  CREATE_FAILED = 'CREATE_FAILED',
  UPDATE_FAILED = 'UPDATE_FAILED',
  DELETE_FAILED = 'DELETE_FAILED',
  FIND_FAILED = 'FIND_FAILED',
  
  // Permission Errors
  ACCESS_DENIED = 'ACCESS_DENIED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  
  // Generic
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface RepositoryErrorDetails {
  code: RepositoryErrorCode;
  message: string;
  operation: string;
  entityName: string;
  entityId?: string;
  originalError?: Error;
  context?: Record<string, unknown>;
  timestamp: Date;
}

/**
 * 🔹 BASE REPOSITORY ERROR CLASS
 * Standardized error with detailed context
 */
export class RepositoryError extends Error {
  public readonly code: RepositoryErrorCode;
  public readonly operation: string;
  public readonly entityName: string;
  public readonly entityId?: string;
  public readonly originalError?: Error;
  public readonly context?: Record<string, unknown>;
  public readonly timestamp: Date;

  constructor(details: RepositoryErrorDetails) {
    super(details.message);
    
    this.name = 'RepositoryError';
    this.code = details.code;
    this.operation = details.operation;
    this.entityName = details.entityName;
    this.entityId = details.entityId;
    this.originalError = details.originalError;
    this.context = details.context;
    this.timestamp = details.timestamp;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RepositoryError);
    }
  }

  /**
   * Convert to JSON for logging
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      operation: this.operation,
      entityName: this.entityName,
      entityId: this.entityId,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      originalError: this.originalError ? {
        name: this.originalError.name,
        message: this.originalError.message,
        stack: this.originalError.stack
      } : undefined
    };
  }

  /**
   * Check if error is of specific type
   */
  isCode(code: RepositoryErrorCode): boolean {
    return this.code === code;
  }

  /**
   * Check if error is validation related
   */
  isValidationError(): boolean {
    return [
      RepositoryErrorCode.INVALID_ID,
      RepositoryErrorCode.INVALID_DATA,
      RepositoryErrorCode.VALIDATION_FAILED
    ].includes(this.code);
  }

  /**
   * Check if error is not found related
   */
  isNotFoundError(): boolean {
    return [
      RepositoryErrorCode.ENTITY_NOT_FOUND,
      RepositoryErrorCode.RESOURCE_NOT_FOUND
    ].includes(this.code);
  }

  /**
   * Check if error is database related
   */
  isDatabaseError(): boolean {
    return [
      RepositoryErrorCode.CONNECTION_ERROR,
      RepositoryErrorCode.TRANSACTION_FAILED,
      RepositoryErrorCode.QUERY_FAILED
    ].includes(this.code);
  }
}

/**
 * 🔹 REPOSITORY ERROR FACTORY
 * Standardized error creation
 */
export class RepositoryErrorFactory {
  /**
   * Create validation error
   */
  static validationError(
    message: string,
    operation: string,
    entityName: string,
    originalError?: Error,
    context?: Record<string, unknown>
  ): RepositoryError {
    return new RepositoryError({
      code: RepositoryErrorCode.VALIDATION_FAILED,
      message,
      operation,
      entityName,
      originalError,
      context,
      timestamp: new Date()
    });
  }

  /**
   * Create not found error
   */
  static notFoundError(
    entityName: string,
    entityId: string,
    operation: string = 'find'
  ): RepositoryError {
    return new RepositoryError({
      code: RepositoryErrorCode.ENTITY_NOT_FOUND,
      message: `${entityName} with ID '${entityId}' not found`,
      operation,
      entityName,
      entityId,
      timestamp: new Date()
    });
  }

  /**
   * Create duplicate entry error
   */
  static duplicateError(
    entityName: string,
    operation: string,
    duplicateField: string,
    duplicateValue: string
  ): RepositoryError {
    return new RepositoryError({
      code: RepositoryErrorCode.DUPLICATE_ENTRY,
      message: `${entityName} with ${duplicateField} '${duplicateValue}' already exists`,
      operation,
      entityName,
      context: { duplicateField, duplicateValue },
      timestamp: new Date()
    });
  }

  /**
   * Create database operation error
   */
  static operationError(
    operation: string,
    entityName: string,
    originalError: Error,
    entityId?: string
  ): RepositoryError {
    // Determine error code based on operation
    let code: RepositoryErrorCode;
    switch (operation.toLowerCase()) {
      case 'create':
        code = RepositoryErrorCode.CREATE_FAILED;
        break;
      case 'update':
        code = RepositoryErrorCode.UPDATE_FAILED;
        break;
      case 'delete':
        code = RepositoryErrorCode.DELETE_FAILED;
        break;
      case 'find':
      case 'findone':
      case 'findall':
        code = RepositoryErrorCode.FIND_FAILED;
        break;
      default:
        code = RepositoryErrorCode.QUERY_FAILED;
    }

    return new RepositoryError({
      code,
      message: `Failed to ${operation} ${entityName}`,
      operation,
      entityName,
      entityId,
      originalError,
      timestamp: new Date()
    });
  }

  /**
   * Create error from mongoose/mongodb error
   */
  static fromMongoError(
    error: any,
    operation: string,
    entityName: string,
    entityId?: string
  ): RepositoryError {
    let code: RepositoryErrorCode;
    let message: string;

    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      code = RepositoryErrorCode.VALIDATION_FAILED;
      message = `Validation failed for ${entityName}: ${error.message}`;
    } else if (error.name === 'CastError') {
      code = RepositoryErrorCode.INVALID_ID;
      message = `Invalid ID format for ${entityName}: ${error.value}`;
    } else if (error.code === 11000) {
      code = RepositoryErrorCode.DUPLICATE_ENTRY;
      message = `Duplicate entry for ${entityName}`;
    } else if (error.name === 'MongoNetworkError') {
      code = RepositoryErrorCode.CONNECTION_ERROR;
      message = `Database connection failed during ${operation}`;
    } else {
      code = RepositoryErrorCode.UNKNOWN_ERROR;
      message = `Unknown error during ${operation} for ${entityName}`;
    }

    return new RepositoryError({
      code,
      message,
      operation,
      entityName,
      entityId,
      originalError: error,
      timestamp: new Date()
    });
  }
}

/**
 * 🔹 REPOSITORY LOGGER
 * Centralized logging for repository operations
 */
export class RepositoryLogger {
  private static formatContext(context?: Record<string, unknown>): string {
    if (!context || Object.keys(context).length === 0) return '';
    return ` | Context: ${JSON.stringify(context)}`;
  }

  /**
   * Log repository error with detailed context
   */
  static logError(error: RepositoryError): void {
    const logMessage = [
      `❌ [${error.entityName}Repository]`,
      `${error.operation} failed:`,
      `${error.message}`,
      `| Code: ${error.code}`,
      error.entityId ? `| ID: ${error.entityId}` : '',
      this.formatContext(error.context),
      `| Time: ${error.timestamp.toISOString()}`
    ].filter(Boolean).join(' ');

    console.error(logMessage);
    
    if (error.originalError) {
      console.error(`❌ Original Error:`, {
        name: error.originalError.name,
        message: error.originalError.message,
        stack: error.originalError.stack
      });
    }
  }

  /**
   * Log successful repository operation
   */
  static logSuccess(
    operation: string,
    entityName: string,
    entityId?: string,
    context?: Record<string, unknown>
  ): void {
    const logMessage = [
      `✅ [${entityName}Repository]`,
      `${operation} success`,
      entityId ? `| ID: ${entityId}` : '',
      this.formatContext(context)
    ].filter(Boolean).join(' ');

    console.log(logMessage);
  }

  /**
   * Log repository operation start
   */
  static logStart(
    operation: string,
    entityName: string,
    entityId?: string,
    context?: Record<string, unknown>
  ): void {
    const logMessage = [
      `🔄 [${entityName}Repository]`,
      `${operation} start`,
      entityId ? `| ID: ${entityId}` : '',
      this.formatContext(context)
    ].filter(Boolean).join(' ');

    console.log(logMessage);
  }
}