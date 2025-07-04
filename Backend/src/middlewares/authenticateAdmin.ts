// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import { logger } from "../utils/logger";
// import { AppError } from "../errors/appError";
// import { ApiResponse } from "../utils/apiResponse";
// import { HttpStatus } from "../constants/HttpStatus";
// import { RedisTokenService } from "../services/implementations/RedisTokenService";
// import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt";

// interface JwtPayload {
//   id: string;
//   role: string[];
// }

// export const authenticate = (
//   req: Request & { user?: JwtPayload },
//   res: Response,
//   next: NextFunction
// ): void => {
//   logger.info("Authenticate middleware started", { path: req.path });

//   const token =
//     req.cookies?.adminAccessToken ||
//     req.headers["authorization"]?.replace("Bearer ", "");

//   if (!token) {
//     logger.warn("No token provided", { path: req.path });
//     throw new AppError(
//       "Access denied: No token provided",
//       HttpStatus.UNAUTHORIZED,
//       "warn",
//       "NO_TOKEN"
//     );
//   }

//   try {
//     const decoded = verifyAccessToken(token) as JwtPayload;
//     logger.debug("Token decoded", { userId: decoded.id, role: decoded.role });

//     if (!decoded.role?.includes("admin")) {
//       logger.warn("User is not an admin", { userId: decoded.id, role: decoded.role });
//       throw new AppError(
//         "You are not authorized",
//         HttpStatus.FORBIDDEN,
//         "warn",
//         "NOT_ADMIN"
//       );
//     }

//     req.user = decoded;
//     logger.info("Authentication successful", { userId: decoded.id });
//     next();
//   } catch (err) {
//     logger.error("Authentication failed", {
//       error: err instanceof Error ? err.message : String(err),
//       path: req.path,
//     });
//     throw new AppError(
//       "Invalid or expired token",
//       HttpStatus.UNAUTHORIZED,
//       "error",
//       "INVALID_TOKEN"
//     );
//   }
// };

// export const verifyRefreshTokenMiddleware = (
//   req: Request & { user?: JwtPayload & { rawToken: string } },
//   res: Response,
//   next: NextFunction
// ): void => {
//   logger.info("Verify refresh token middleware started", { path: req.path });

//   const refreshToken = req.cookies?.adminRefreshToken;

//   if (!refreshToken) {
//     logger.warn("No refresh token provided", { path: req.path });
//     throw new AppError(
//       "Access denied: No refresh token provided",
//       HttpStatus.UNAUTHORIZED,
//       "warn",
//       "NO_REFRESH_TOKEN"
//     );
//   }

//   try {
//     const decoded = verifyRefreshToken(refreshToken) as JwtPayload;
//     logger.debug("Refresh token decoded", { userId: decoded.id });

//     RedisTokenService.verifyRefreshToken(decoded.id, refreshToken)
//       .then((isValid) => {
//         if (!isValid) {
//           logger.warn("Invalid refresh token", { userId: decoded.id });
//           throw new AppError(
//             "Invalid or expired refresh token",
//             HttpStatus.UNAUTHORIZED,
//             "warn",
//             "INVALID_REFRESH_TOKEN"
//           );
//         }

//         req.user = { ...decoded, rawToken: refreshToken };
//         logger.info("Refresh token verification successful", { userId: decoded.id });
//         next();
//       })
//       .catch((err) => {
//         logger.error("Redis verification failed", {
//           error: err instanceof Error ? err.message : String(err),
//           userId: decoded.id,
//         });
//         throw new AppError(
//           "Failed to verify refresh token",
//           HttpStatus.UNAUTHORIZED,
//           "error",
//           "REDIS_ERROR"
//         );
//       });
//   } catch (err) {
//     logger.error("Refresh token verification failed", {
//       error: err instanceof Error ? err.message : String(err),
//       path: req.path,
//     });
//     throw new AppError(
//       "Invalid or expired refresh token",
//       HttpStatus.UNAUTHORIZED,
//       "error",
//       "INVALID_REFRESH_TOKEN"
//     );
//   }
// };

// export const decodedRefreshToken = (
//   req: Request & { user?: JwtPayload & { rawToken: string } },
//   res: Response,
//   next: NextFunction
// ): void => {
//   logger.info("Decode refresh token middleware started", { path: req.path });

//   const refreshToken = req.cookies?.adminRefreshToken;

//   if (!refreshToken) {
//     logger.warn("No refresh token provided", { path: req.path });
//     throw new AppError(
//       "Access denied: No refresh token provided",
//       HttpStatus.UNAUTHORIZED,
//       "warn",
//       "NO_REFRESH_TOKEN"
//     );
//   }

//   try {
//     const decoded = jwt.decode(refreshToken) as JwtPayload | null;
//     if (!decoded || typeof decoded !== "object" || !decoded.id) {
//       logger.error("Invalid refresh token payload", { path: req.path });
//       throw new AppError(
//         "Invalid refresh token",
//         HttpStatus.UNAUTHORIZED,
//         "error",
//         "INVALID_REFRESH_TOKEN"
//       );
//     }
//     req.user = { ...decoded, rawToken: refreshToken };
//     logger.info("Refresh token decoded", { userId: decoded.id });
//     next();
//   } catch (err) {
//     logger.error("Decode refresh token failed", {
// 不说

// System: {
//   error: err instanceof Error ? err.message : String(err),
//       path: req.path,
//     });
//     throw new AppError(
//       "Invalid refresh token",
//       HttpStatus.UNAUTHORIZED,
//       "error",
//       "INVALID_REFRESH_TOKEN"
//     );
//   }
// };

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger";
import { AppError } from "../errors/appError";
import { ApiResponse } from "../utils/apiResponse";
import { HttpStatus } from "../constants/HttpStatus";
import { RedisTokenService } from "../services/implementations/RedisTokenService";
import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt";
import { initDIContainer } from "../diContainer/diContainer";

const { redisTokenService } = initDIContainer();

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.info("Authenticate middleware started", { path: req.path });

  const token =
    req.cookies?.adminAccessToken ||
    req.headers["authorization"]?.replace("Bearer ", "");

  if (!token) {
    logger.warn("No token provided", { path: req.path });
    throw new AppError(
      "Access denied: No token provided",
      HttpStatus.UNAUTHORIZED,
      "warn",
      "NO_TOKEN"
    );
  }

  try {
    const decoded = verifyAccessToken(token) as jwt.JwtPayload;
    logger.debug("Token decoded", { userId: decoded.id, role: decoded.role });

    if (!decoded.role?.includes("admin")) {
      logger.warn("User is not an admin", {
        userId: decoded.id,
        role: decoded.role,
      });
      throw new AppError(
        "You are not authorized",
        HttpStatus.FORBIDDEN,
        "warn",
        "NOT_ADMIN"
      );
    }

    req.user = decoded;
    logger.info("Authentication successful", { userId: decoded.id });
    next();
  } catch (err) {
    logger.error("Authentication failed", {
      error: err instanceof Error ? err.message : String(err),
      path: req.path,
    });
    throw new AppError(
      "Invalid or expired token",
      HttpStatus.UNAUTHORIZED,
      "error",
      "INVALID_TOKEN"
    );
  }
};

export const verifyRefreshTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.info("Verify refresh token middleware started", { path: req.path });

  const refreshToken = req.cookies?.adminRefreshToken;

  if (!refreshToken) {
    logger.warn("No refresh token provided", { path: req.path });
    throw new AppError(
      "Access denied: No refresh token provided",
      HttpStatus.UNAUTHORIZED,
      "warn",
      "NO_REFRESH_TOKEN"
    );
  }

  try {
    const decoded = verifyRefreshToken(refreshToken) as jwt.JwtPayload;
    logger.debug("Refresh token decoded", { userId: decoded.id });

    redisTokenService
      .verifyRefreshToken(decoded.id, refreshToken)
      .then((isValid) => {
        if (!isValid) {
          logger.warn("Invalid refresh token", { userId: decoded.id });
          throw new AppError(
            "Invalid or expired refresh token",
            HttpStatus.UNAUTHORIZED,
            "warn",
            "INVALID_REFRESH_TOKEN"
          );
        }

        req.user = { ...decoded, rawToken: refreshToken };
        logger.info("Refresh token verification successful", {
          userId: decoded.id,
        });
        next();
      })
      .catch((err) => {
        logger.error("Redis verification failed", {
          error: err instanceof Error ? err.message : String(err),
          userId: decoded.id,
        });
        throw new AppError(
          "Failed to verify refresh token",
          HttpStatus.UNAUTHORIZED,
          "error",
          "REDIS_ERROR"
        );
      });
  } catch (err) {
    logger.error("Refresh token verification failed", {
      error: err instanceof Error ? err.message : String(err),
      path: req.path,
    });
    throw new AppError(
      "Invalid or expired refresh token",
      HttpStatus.UNAUTHORIZED,
      "error",
      "INVALID_REFRESH_TOKEN"
    );
  }
};

export const decodedRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.info("Decode refresh token middleware started", { path: req.path });

  const refreshToken = req.cookies?.adminRefreshToken;

  if (!refreshToken) {
    logger.warn("No refresh token provided", { path: req.path });
    throw new AppError(
      "Access denied: No refresh token provided",
      HttpStatus.UNAUTHORIZED,
      "warn",
      "NO_REFRESH_TOKEN"
    );
  }

  try {
    const decoded = jwt.decode(refreshToken) as jwt.JwtPayload | null;
    if (!decoded || typeof decoded !== "object" || !decoded.id) {
      logger.error("Invalid refresh token payload", { path: req.path });
      throw new AppError(
        "Invalid refresh token",
        HttpStatus.UNAUTHORIZED,
        "error",
        "INVALID_REFRESH_TOKEN"
      );
    }
    req.user = { ...decoded, rawToken: refreshToken };
    logger.info("Refresh token decoded", { userId: decoded.id });
    next();
  } catch (err) {
    logger.error("Decode refresh token failed", {
      error: err instanceof Error ? err.message : String(err),
      path: req.path,
    });
    throw new AppError(
      "Invalid refresh token",
      HttpStatus.UNAUTHORIZED,
      "error",
      "INVALID_REFRESH_TOKEN"
    );
  }
};
