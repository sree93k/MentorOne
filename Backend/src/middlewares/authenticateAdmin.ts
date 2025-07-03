import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { inject, injectable } from "inversify";
import ApiResponse from "../utils/apiResponse";
import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt";
import { TYPES } from "../inversify/types";
import { RedisTokenService } from "../services/implementations/RedisTokenService";
import { logger } from "../utils/logger";
import AppError from "../errors/appError";
import { HttpStatus } from "../constants/HttpStatus";

@injectable()
export class AdminAuthMiddleware {
  constructor(
    @inject(TYPES.RedisTokenService)
    private redisTokenService: RedisTokenService
  ) {}

  public authenticate = (
    req: Request & Partial<{ user: string | jwt.JwtPayload }>,
    res: Response,
    next: NextFunction
  ): void => {
    logger.info("Admin authentication attempt", {
      headers: req.headers["authorization"],
      hasCookie: !!req.cookies?.adminAccessToken,
    });

    const token =
      req.cookies?.adminAccessToken ||
      req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      logger.warn("Authentication failed: No token provided");
      throw new AppError(
        "Access denied: No token provided",
        HttpStatus.UNAUTHORIZED,
        "warn"
      );
    }

    try {
      const decoded = verifyAccessToken(token);
      if (!decoded.role?.includes("admin")) {
        logger.warn("Authentication failed: Not an admin", {
          role: decoded.role,
        });
        throw new AppError(
          "You are not authorized",
          HttpStatus.FORBIDDEN,
          "warn"
        );
      }

      req.user = decoded;
      logger.info("Authentication successful", { userId: decoded.id });
      next();
    } catch (err) {
      logger.error("Authentication error", {
        error: err instanceof Error ? err.message : String(err),
      });
      throw new AppError(
        "Invalid or expired token",
        HttpStatus.UNAUTHORIZED,
        "warn"
      );
    }
  };

  public verifyRefreshTokenMiddleware = (
    req: Request &
      Partial<{ user: string | (jwt.JwtPayload & { rawToken: string }) }>,
    res: Response,
    next: NextFunction
  ): void => {
    logger.info("Verify refresh token attempt", {
      hasCookie: !!req.cookies?.adminRefreshToken,
    });

    const refreshToken = req.cookies?.adminRefreshToken;
    if (!refreshToken) {
      logger.warn("Verify refresh token failed: No refresh token provided");
      throw new AppError(
        "Access denied: No refresh token provided",
        HttpStatus.UNAUTHORIZED,
        "warn"
      );
    }

    try {
      const decoded = verifyRefreshToken(refreshToken);
      this.redisTokenService
        .verifyRefreshToken(decoded.id, refreshToken)
        .then((isValid) => {
          if (!isValid) {
            logger.warn("Verify refresh token failed: Invalid refresh token", {
              userId: decoded.id,
            });
            throw new AppError(
              "Invalid or expired refresh token",
              HttpStatus.UNAUTHORIZED,
              "warn"
            );
          }

          req.user = { ...decoded, rawToken: refreshToken };
          logger.info("Verify refresh token successful", {
            userId: decoded.id,
          });
          next();
        })
        .catch((err) => {
          logger.error("Redis error in verify refresh token", {
            error: err instanceof Error ? err.message : String(err),
          });
          throw new AppError(
            "Failed to verify refresh token",
            HttpStatus.UNAUTHORIZED,
            "warn"
          );
        });
    } catch (err) {
      logger.error("JWT error in verify refresh token", {
        error: err instanceof Error ? err.message : String(err),
      });
      throw new AppError(
        "Invalid or expired refresh token",
        HttpStatus.UNAUTHORIZED,
        "warn"
      );
    }
  };

  public decodedRefreshToken = (
    req: Request &
      Partial<{ user: string | (jwt.JwtPayload & { rawToken: string }) }>,
    res: Response,
    next: NextFunction
  ): void => {
    logger.info("Decode refresh token attempt", {
      hasCookie: !!req.cookies?.adminRefreshToken,
    });

    const refreshToken = req.cookies?.adminRefreshToken;
    if (!refreshToken) {
      logger.warn("Decode refresh token failed: No refresh token provided");
      throw new AppError(
        "Access denied: No refresh token provided",
        HttpStatus.UNAUTHORIZED,
        "warn"
      );
    }

    try {
      const decoded = jwt.decode(refreshToken) as jwt.JwtPayload;
      if (!decoded || typeof decoded !== "object" || !decoded.id) {
        logger.error("Decode refresh token error: Missing id in token payload");
        throw new AppError(
          "Invalid refresh token",
          HttpStatus.UNAUTHORIZED,
          "warn"
        );
      }
      req.user = { ...decoded, rawToken: refreshToken, id: decoded.id };
      logger.info("Decode refresh token successful", { userId: decoded.id });
      next();
    } catch (err) {
      logger.error("Decode refresh token error", {
        error: err instanceof Error ? err.message : String(err),
      });
      throw new AppError(
        "Invalid refresh token",
        HttpStatus.UNAUTHORIZED,
        "warn"
      );
    }
  };
}
