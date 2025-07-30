import { Request, Response, NextFunction } from "express";
import ApiResponse from "../utils/apiResponse";
import {
  decodeToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/jwt";
import jwt from "jsonwebtoken";
import RedisTokenService from "../services/implementations/RedisTokenService";

// ✅ UPDATED: Check for access token in cookies instead of Authorization header
export const authenticate = (
  req: Request & Partial<{ user: string | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
): void => {
  console.log("authenticate start 1");

  // ✅ CHANGED: Check cookies first, then fallback to Authorization header
  const token =
    req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];

  console.log("authenticate start 2");
  if (!token) {
    console.log("authenticate failed 3");
    res
      .status(401)
      .json(new ApiResponse(401, null, "Access denied: No token provided"));
    return;
  }

  console.log("authenticate start 4 token is", token);
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    console.log("authenticate start 5", decoded);
    console.log("authenticate start 5.5", req.user);

    if (decoded.role.includes("admin")) {
      console.log("authenticate start7", decoded.role);
      console.log("authenticate failed2");
      res
        .status(401)
        .json(new ApiResponse(401, null, "you are not authorized"));
      return;
    }

    console.log("authenticate start 6......");
    console.log("authenticate success");
    next();
  } catch (err) {
    console.log("authenticate start 7 error", err);
    res
      .status(401)
      .json(new ApiResponse(401, null, "Invalid Token or Expired"));
    return;
  }
};

// ✅ UPDATED: No longer expects refresh token from cookies - gets it from Redis
export const decodedRefreshToken = async (
  req: Request &
    Partial<{ user: string | (jwt.JwtPayload & { rawToken?: string }) }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("decodedRefreshToken start");
  console.log("decodedRefreshToken cookies:", req.cookies);
  console.log("decodedRefreshToken headers:", req.headers.authorization);

  try {
    let userId: string;

    // Try multiple sources for userId
    const accessToken =
      req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];

    if (accessToken) {
      try {
        // Try to decode even if expired to get userId
        const decodedAccess = decodeToken(accessToken) as jwt.JwtPayload;
        userId = decodedAccess.id;
        console.log(
          "decodedRefreshToken: Got userId from access token:",
          userId
        );
      } catch (decodeError) {
        console.error(
          "decodedRefreshToken: Failed to decode access token:",
          decodeError
        );

        // If token is completely invalid, try to verify it anyway to see if it's just expired
        try {
          const verified = verifyAccessToken(accessToken);
          userId = verified.id;
        } catch (verifyError) {
          // Check if it's an expiry error vs invalid token
          if (verifyError.message.includes("expired")) {
            // Token is expired but valid structure - try to decode anyway
            try {
              const expiredDecoded = jwt.decode(accessToken) as jwt.JwtPayload;
              userId = expiredDecoded.id;
              console.log(
                "decodedRefreshToken: Got userId from expired token:",
                userId
              );
            } catch (finalDecodeError) {
              console.error("decodedRefreshToken: Completely invalid token");
              res
                .status(401)
                .json(
                  new ApiResponse(401, null, "Invalid access token format")
                );
              return;
            }
          } else {
            res
              .status(401)
              .json(new ApiResponse(401, null, "Invalid access token format"));
            return;
          }
        }
      }
    } else {
      console.log("decodedRefreshToken failed: No access token provided");
      res
        .status(401)
        .json(
          new ApiResponse(401, null, "Access denied: No access token provided")
        );
      return;
    }

    // ✅ CHANGED: Get refresh token from Redis instead of cookies
    const refreshToken = await RedisTokenService.getRefreshToken(userId);

    if (!refreshToken) {
      console.log(
        "decodedRefreshToken failed: No refresh token found in Redis"
      );
      res
        .status(401)
        .json(
          new ApiResponse(401, null, "Access denied: No refresh token found")
        );
      return;
    }

    // ✅ Decode the refresh token from Redis
    const decoded = jwt.decode(refreshToken) as jwt.JwtPayload;
    if (!decoded || typeof decoded !== "object" || !decoded.id) {
      console.error("decodedRefreshToken error: Missing id in token payload");
      res.status(401).json(new ApiResponse(401, null, "Invalid refresh token"));
      return;
    }

    // ✅ Set user info (no rawToken since it's not from cookies)
    req.user = { ...decoded, id: decoded.id };
    console.log("decodedRefreshToken success, user:", req.user);
    next();
  } catch (err) {
    console.error("decodedRefreshToken error:", err);
    res.status(401).json(new ApiResponse(401, null, "Invalid refresh token"));
  }
};
// ADD this new middleware function at the end of the file
export const blockDetectionMiddleware = async (
  req: Request & Partial<{ user: string | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res
        .status(401)
        .json(new ApiResponse(401, null, "User not authenticated"));
      return;
    }

    // Import UserRepository dynamically to avoid circular dependencies
    const { default: UserRepository } = await import(
      "../repositories/implementations/UserRepository"
    );
    const userRepo = new UserRepository();
    const user = await userRepo.findById(userId);

    if (user?.isBlocked) {
      res
        .status(403)
        .json(
          new ApiResponse(
            403,
            { action: "logout", blocked: true },
            "Account has been blocked"
          )
        );
      return;
    }

    next();
  } catch (error) {
    console.error("Error in blockDetectionMiddleware:", error);
    next(error);
  }
};
// ✅ UPDATED: No longer expects refresh token from cookies
export const verifyRefreshTokenMiddleware = async (
  req: Request & Partial<{ user: string | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("verifyRefreshTokenMiddleware start");

  try {
    let userId: string;

    // Extract userId from access token (even if expired)
    const accessToken =
      req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];

    if (accessToken) {
      try {
        // Decode without verification to get userId
        const decodedAccess = decodeToken(accessToken) as jwt.JwtPayload;
        userId = decodedAccess.id;
        console.log(
          "verifyRefreshTokenMiddleware: Got userId from access token:",
          userId
        );
      } catch (decodeError) {
        console.error(
          "verifyRefreshTokenMiddleware: Failed to decode access token:",
          decodeError
        );

        // Try to handle expired tokens
        try {
          const verified = verifyAccessToken(accessToken);
          userId = verified.id;
        } catch (verifyError) {
          if (verifyError.message.includes("expired")) {
            try {
              const expiredDecoded = jwt.decode(accessToken) as jwt.JwtPayload;
              userId = expiredDecoded.id;
              console.log(
                "verifyRefreshTokenMiddleware: Got userId from expired token:",
                userId
              );
            } catch (finalDecodeError) {
              res
                .status(401)
                .json(
                  new ApiResponse(401, null, "Invalid access token format")
                );
              return;
            }
          } else {
            res
              .status(401)
              .json(new ApiResponse(401, null, "Invalid access token format"));
            return;
          }
        }
      }
    } else {
      console.log(
        "verifyRefreshTokenMiddleware failed: No access token provided"
      );
      res
        .status(401)
        .json(
          new ApiResponse(401, null, "Access denied: No access token provided")
        );
      return;
    }

    // ✅ CHANGED: Get refresh token from Redis instead of cookies
    const refreshToken = await RedisTokenService.getRefreshToken(userId);

    if (!refreshToken) {
      console.log(
        "verifyRefreshTokenMiddleware failed: No refresh token found in Redis for user:",
        userId
      );
      res
        .status(401)
        .json(
          new ApiResponse(401, null, "Access denied: No refresh token found")
        );
      return;
    }

    // ✅ Verify the refresh token from Redis
    try {
      const decoded = verifyRefreshToken(refreshToken);
      console.log("verifyRefreshTokenMiddleware decoded:", decoded);

      // ✅ Verify token is still valid in Redis
      const isValid = await RedisTokenService.verifyRefreshTokenDirect(
        userId,
        refreshToken
      );

      if (!isValid) {
        console.log(
          "verifyRefreshTokenMiddleware failed: Invalid refresh token for user:",
          userId
        );
        res
          .status(401)
          .json(new ApiResponse(401, null, "Invalid or expired refresh token"));
        return;
      }

      // ✅ Set user with decoded info
      req.user = { ...decoded };
      console.log("verifyRefreshTokenMiddleware success, user:", req.user);
      next();
    } catch (jwtError) {
      console.error("verifyRefreshTokenMiddleware JWT error:", jwtError);
      res
        .status(401)
        .json(new ApiResponse(401, null, "Invalid or expired refresh token"));
    }
  } catch (err) {
    console.error("verifyRefreshTokenMiddleware Redis error:", err);
    res
      .status(401)
      .json(new ApiResponse(401, null, "Failed to verify refresh token"));
  }
};

// ✅ UPDATED: Use same pattern as other middlewares
export const refreshAccessToken = async (
  req: Request & Partial<{ user: string | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("refreshAccessToken middleware start");

  try {
    let userId: string;

    const accessToken =
      req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];

    if (accessToken) {
      try {
        const decodedAccess = decodeToken(accessToken) as jwt.JwtPayload;
        userId = decodedAccess.id;
      } catch (decodeError) {
        try {
          const verified = verifyAccessToken(accessToken);
          userId = verified.id;
        } catch (verifyError) {
          if (verifyError.message.includes("expired")) {
            try {
              const expiredDecoded = jwt.decode(accessToken) as jwt.JwtPayload;
              userId = expiredDecoded.id;
            } catch (finalDecodeError) {
              res
                .status(401)
                .json(
                  new ApiResponse(401, null, "Invalid access token format")
                );
              return;
            }
          } else {
            res
              .status(401)
              .json(new ApiResponse(401, null, "Invalid access token format"));
            return;
          }
        }
      }
    } else {
      res
        .status(401)
        .json(
          new ApiResponse(401, null, "Access denied: No access token provided")
        );
      return;
    }

    const refreshToken = await RedisTokenService.getRefreshToken(userId);

    if (!refreshToken) {
      res
        .status(401)
        .json(
          new ApiResponse(401, null, "Access denied: No refresh token found")
        );
      return;
    }

    try {
      const decoded = verifyRefreshToken(refreshToken);
      req.user = { ...decoded };
      next();
    } catch (jwtError) {
      res
        .status(401)
        .json(new ApiResponse(401, null, "Invalid or expired refresh token"));
    }
  } catch (err) {
    res
      .status(401)
      .json(new ApiResponse(401, null, "Failed to verify refresh token"));
  }
};

// ✅ KEEP THESE AS-IS (they're fine for their use cases)
export const decodedUserRefreshToken = decodedRefreshToken; // Alias for compatibility

export const authenticateUser = (
  req: Request & Partial<{ user: {} | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).send("Access denied");
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;

    if (decoded.role != "user") {
      res
        .status(401)
        .json(new ApiResponse(401, null, "you are not authorized"));
    }

    next();
  } catch (err) {
    res
      .status(401)
      .json(new ApiResponse(401, null, "Invalid Token or Expired"));
  }
};

export const verifyUserRefreshToken = verifyRefreshTokenMiddleware; // Alias for compatibility
