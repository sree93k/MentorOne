/**
 * Custom error class for operational errors in the MentorOne API.
 */
export class AppError extends Error {
  statusCode: number;
  status: "fail" | "error";
  isOperational: boolean;
  level: "info" | "warn" | "error";
  code?: string;

  constructor(
    message: string,
    statusCode: number,
    level: "info" | "warn" | "error" = "error",
    code?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.level = level;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
