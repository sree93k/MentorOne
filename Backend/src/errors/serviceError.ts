/**
 * Custom error class for service-layer errors in the MentorOne API.
 */
export class ServiceError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly level: "info" | "warn" | "error";

  constructor(
    message: string,
    code: string = "SERVICE_ERROR",
    statusCode: number = 500,
    level: "info" | "warn" | "error" = "error"
  ) {
    super(message);
    this.name = "ServiceError";
    this.code = code;
    this.statusCode = statusCode;
    this.level = level;

    Error.captureStackTrace(this, this.constructor);
  }
}
