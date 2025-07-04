// import { Request, Response, NextFunction } from "express";
// import { logger } from "../utils/logger";
// import { AppError } from "./appError";
// import { ServiceError } from "./serviceError";
// import { ApiResponse } from "../utils/apiResponse";
// import { HttpStatus } from "../constants/HttpStatus";

// /**
//  * Global error handler for the MentorOne API.
//  */
// export const errorHandler = (
//   err: AppError | ServiceError | Error,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Response => {
//   const statusCode = (err as AppError).statusCode || HttpStatus.INTERNAL_SERVER;
//   const status = (err as AppError).status || "error";
//   const level = (err as AppError).level || "error";
//   const message = err.message || "Something went wrong";
//   const code = (err as AppError).code || undefined;

//   // Log error with metadata
//   const logMeta = {
//     path: req.path,
//     method: req.method,
//     code,
//     stack: err.stack,
//   };

//   switch (level) {
//     case "info":
//       logger.info(message, logMeta);
//       break;
//     case "warn":
//       logger.warn(message, logMeta);
//       break;
//     case "error":
//     default:
//       logger.error(message, logMeta);
//   }

//   if (err instanceof AppError) {
//     return res
//       .status(statusCode)
//       .json(new ApiResponse(statusCode, { code }, message));
//   }

//   if (err instanceof ServiceError) {
//     return res
//       .status(err.statusCode)
//       .json(new ApiResponse(err.statusCode, { code }, message));
//   }

//   if (process.env.NODE_ENV === "development") {
//     return res
//       .status(statusCode)
//       .json(new ApiResponse(statusCode, { stack: err.stack, code }, message));
//   }

//   return res
//     .status(HttpStatus.INTERNAL_SERVER)
//     .json(
//       new ApiResponse(
//         HttpStatus.INTERNAL_SERVER,
//         null,
//         "Something went wrong. Please try again later."
//       )
//     );
// };
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { logger } from "../utils/logger";
import { AppError } from "./appError";
import { ServiceError } from "./serviceError";
import { ApiResponse } from "../utils/apiResponse";
import { HttpStatus } from "../constants/HttpStatus";

/**
 * Global error handler for the MentorOne API.
 */
export const errorHandler: ErrorRequestHandler = (
  err: AppError | ServiceError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = (err as AppError).statusCode || HttpStatus.INTERNAL_SERVER;
  const status = (err as AppError).status || "error";
  const level = (err as AppError).level || "error";
  const message = err.message || "Something went wrong";
  const code = (err as AppError).code || undefined;

  // Log error with metadata
  const logMeta = {
    path: req.path,
    method: req.method,
    code,
    stack: err.stack,
  };

  switch (level) {
    case "info":
      logger.info(message, logMeta);
      break;
    case "warn":
      logger.warn(message, logMeta);
      break;
    case "error":
    default:
      logger.error(message, logMeta);
  }

  if (err instanceof AppError) {
    res.status(statusCode).json(new ApiResponse(statusCode, { code }, message));
    return;
  }

  if (err instanceof ServiceError) {
    res
      .status(err.statusCode)
      .json(new ApiResponse(err.statusCode, { code }, message));
    return;
  }

  if (process.env.NODE_ENV === "development") {
    res
      .status(statusCode)
      .json(new ApiResponse(statusCode, { stack: err.stack, code }, message));
    return;
  }

  res
    .status(HttpStatus.INTERNAL_SERVER)
    .json(
      new ApiResponse(
        HttpStatus.INTERNAL_SERVER,
        null,
        "Something went wrong. Please try again later."
      )
    );
};
