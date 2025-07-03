// src/errors/appError.ts
export default class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  level: string;

  constructor(message: string, statusCode: number, level: string = "error") {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.level = level;

    Error.captureStackTrace(this, this.constructor);
  }
}
