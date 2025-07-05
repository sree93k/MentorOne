import jwt from "jsonwebtoken";
import { logger } from "../utils/logger";
import { AppError } from "../errors/appError";
import { HttpStatus } from "../constants/HttpStatus";
import { config } from "../config/env";

export const generateAccessToken = (payload: object): string => {
  logger.debug("Generating access token", { payload });
  if (!config.jwtAccessTokenSecret) {
    logger.error("JWT_ACCESS_TOKEN_SECRET is not defined");
    throw new AppError(
      "JWT access token secret is not configured",
      HttpStatus.INTERNAL_SERVER,
      "error",
      "JWT_ACCESS_TOKEN_SECRET_MISSING"
    );
  }

  try {
    return jwt.sign(payload, config.jwtAccessTokenSecret, { expiresIn: "20m" });
  } catch (error) {
    logger.error("Error generating access token", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw new AppError(
      "Failed to generate access token",
      HttpStatus.INTERNAL_SERVER,
      "error",
      "JWT_GENERATE_ACCESS_ERROR"
    );
  }
};

export const generateRefreshToken = (payload: object): string => {
  if (!config.jwtRefreshTokenSecret) {
    logger.error("JWT_REFRESH_TOKEN_SECRET is not defined");
    throw new AppError(
      "JWT refresh token secret is not configured",
      HttpStatus.INTERNAL_SERVER,
      "error",
      "JWT_REFRESH_TOKEN_SECRET_MISSING"
    );
  }

  try {
    return jwt.sign(payload, config.jwtRefreshTokenSecret, { expiresIn: "7d" });
  } catch (error) {
    logger.error("Error generating refresh token", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw new AppError(
      "Failed to generate refresh token",
      HttpStatus.INTERNAL_SERVER,
      "error",
      "JWT_GENERATE_REFRESH_ERROR"
    );
  }
};

export const accessTokenForReset = (payload: object): string => {
  if (!config.jwtAccessTokenSecret) {
    logger.error("JWT_ACCESS_TOKEN_SECRET is not defined");
    throw new AppError(
      "JWT access token secret is not configured",
      HttpStatus.INTERNAL_SERVER,
      "error",
      "JWT_ACCESS_TOKEN_SECRET_MISSING"
    );
  }

  try {
    return jwt.sign(payload, config.jwtAccessTokenSecret, { expiresIn: "1m" });
  } catch (error) {
    logger.error("Error generating reset token", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw new AppError(
      "Failed to generate reset token",
      HttpStatus.INTERNAL_SERVER,
      "error",
      "JWT_GENERATE_RESET_ERROR"
    );
  }
};

export const verifyAccessToken = (token: string): any => {
  if (!config.jwtAccessTokenSecret) {
    logger.error("JWT_ACCESS_TOKEN_SECRET is not defined");
    throw new AppError(
      "JWT access token secret is not configured",
      HttpStatus.INTERNAL_SERVER,
      "error",
      "JWT_ACCESS_TOKEN_SECRET_MISSING"
    );
  }

  try {
    return jwt.verify(token, config.jwtAccessTokenSecret);
  } catch (error) {
    logger.error("Error verifying access token", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw new AppError(
      "Invalid access token",
      HttpStatus.UNAUTHORIZED,
      "warn",
      "INVALID_ACCESS_TOKEN"
    );
  }
};

export const verifyRefreshToken = (token: string): any => {
  if (!config.jwtRefreshTokenSecret) {
    logger.error("JWT_REFRESH_TOKEN_SECRET is not defined");
    throw new AppError(
      "JWT refresh token secret is not configured",
      HttpStatus.INTERNAL_SERVER,
      "error",
      "JWT_REFRESH_TOKEN_SECRET_MISSING"
    );
  }

  try {
    return jwt.verify(token, config.jwtRefreshTokenSecret);
  } catch (error) {
    logger.error("Error verifying refresh token", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw new AppError(
      "Invalid refresh token",
      HttpStatus.UNAUTHORIZED,
      "warn",
      "INVALID_REFRESH_TOKEN"
    );
  }
};

export const decodeToken = (token: string): any => {
  try {
    logger.info("Decoding token", { token: token.substring(0, 10) + "..." });
    return jwt.decode(token);
  } catch (error) {
    logger.error("Error decoding token", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw new AppError(
      "Invalid token",
      HttpStatus.UNAUTHORIZED,
      "warn",
      "INVALID_TOKEN"
    );
  }
};

export const decodeAndVerifyToken = (token: string): any => {
  if (!config.jwtAccessTokenSecret) {
    logger.error("JWT_ACCESS_TOKEN_SECRET is not defined");
    throw new AppError(
      "JWT access token secret is not configured",
      HttpStatus.INTERNAL_SERVER,
      "error",
      "JWT_ACCESS_TOKEN_SECRET_MISSING"
    );
  }

  try {
    const decoded: any = jwt.verify(token, config.jwtAccessTokenSecret);
    logger.info("Token verified and decoded", {
      token: token.substring(0, 10) + "...",
    });
    return decoded._doc || decoded;
  } catch (error) {
    logger.error("Error verifying and decoding token", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw new AppError(
      "Invalid token",
      HttpStatus.UNAUTHORIZED,
      "warn",
      "INVALID_TOKEN"
    );
  }
};
