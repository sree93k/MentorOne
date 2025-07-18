// // // src/middlewares/authenticateAdmin.ts
// // import { Request, Response, NextFunction } from "express";
// // import ApiResponse from "../utils/apiResponse";
// // import jwt from "jsonwebtoken";
// // import RedisTokenService from "../services/implementations/RedisTokenService";
// // import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt";

// // export const authenticate = (
// //   req: Request & Partial<{ user: string | jwt.JwtPayload }>,
// //   res: Response,
// //   next: NextFunction
// // ): void => {
// //   console.log("authenticate start");
// //   const token =
// //     req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];

// //   if (!token) {
// //     console.log("authenticate failed: No token provided");
// //     res
// //       .status(401)
// //       .json(new ApiResponse(401, null, "Access denied: No token provided"));
// //     return;
// //   }

// //   try {
// //     const decoded = verifyAccessToken(token);
// //     console.log("authenticate decoded:", decoded);

// //     if (!decoded.role?.includes("admin")) {
// //       console.log("authenticate failed: Not an admin, role:", decoded.role);
// //       res
// //         .status(403)
// //         .json(new ApiResponse(403, null, "You are not authorized"));
// //       return;
// //     }

// //     req.user = decoded;
// //     console.log("authenticate success, user:", req.user);
// //     next();
// //   } catch (err) {
// //     console.error("authenticate error:", err);
// //     res
// //       .status(401)
// //       .json(new ApiResponse(401, null, "Invalid or expired token"));
// //   }
// // };

// // export const verifyRefreshTokenMiddleware = (
// //   req: Request &
// //     Partial<{ user: string | (jwt.JwtPayload & { rawToken: string }) }>,
// //   res: Response,
// //   next: NextFunction
// // ): void => {
// //   console.log("verifyRefreshTokenMiddleware start, cookies:", req.cookies);
// //   const refreshToken = req.cookies?.refreshToken;

// //   if (!refreshToken) {
// //     console.log(
// //       "verifyRefreshTokenMiddleware failed: No refresh token provided"
// //     );
// //     res
// //       .status(401)
// //       .json(
// //         new ApiResponse(401, null, "Access denied: No refresh token provided")
// //       );
// //     return;
// //   }

// //   try {
// //     const decoded = verifyRefreshToken(refreshToken);
// //     console.log("verifyRefreshTokenMiddleware decoded:", decoded);

// //     RedisTokenService.verifyRefreshToken(decoded.id, refreshToken)
// //       .then((isValid) => {
// //         if (!isValid) {
// //           console.log(
// //             "verifyRefreshTokenMiddleware failed: Invalid refresh token for user:",
// //             decoded.id
// //           );
// //           res
// //             .status(401)
// //             .json(
// //               new ApiResponse(401, null, "Invalid or expired refresh token")
// //             );
// //           return;
// //         }

// //         req.user = { ...decoded, rawToken: refreshToken };
// //         console.log("verifyRefreshTokenMiddleware success, user:", req.user);
// //         next();
// //       })
// //       .catch((err) => {
// //         console.error("verifyRefreshTokenMiddleware Redis error:", err);
// //         res
// //           .status(401)
// //           .json(new ApiResponse(401, null, "Failed to verify refresh token"));
// //       });
// //   } catch (err) {
// //     console.error("verifyRefreshTokenMiddleware JWT error:", err);
// //     res
// //       .status(401)
// //       .json(new ApiResponse(401, null, "Invalid or expired refresh token"));
// //   }
// // };

// // export const decodedRefreshToken = (
// //   req: Request &
// //     Partial<{ user: string | (jwt.JwtPayload & { rawToken: string }) }>,
// //   res: Response,
// //   next: NextFunction
// // ): void => {
// //   console.log("decodedRefreshToken start, cookies:", req.cookies);
// //   const refreshToken = req.cookies?.refreshToken;

// //   if (!refreshToken) {
// //     console.log("decodedRefreshToken failed: No refresh token provided");
// //     res
// //       .status(401)
// //       .json(
// //         new ApiResponse(401, null, "Access denied: No refresh token provided")
// //       );
// //     return;
// //   }

// //   try {
// //     const decoded = jwt.decode(refreshToken) as jwt.JwtPayload;
// //     if (!decoded || typeof decoded !== "object" || !decoded.id) {
// //       console.error("decodedRefreshToken error: Missing id in token payload");
// //       res.status(401).json(new ApiResponse(401, null, "Invalid refresh token"));
// //       return;
// //     }
// //     req.user = { ...decoded, rawToken: refreshToken, id: decoded.id };
// //     console.log("decodedRefreshToken success, user:", req.user);
// //     next();
// //   } catch (err) {
// //     console.error("decodedRefreshToken error:", err);
// //     res.status(401).json(new ApiResponse(401, null, "Invalid refresh token"));
// //   }
// // };
// import { Request, Response, NextFunction } from "express";
// import ApiResponse from "../utils/apiResponse";
// import jwt from "jsonwebtoken";
// import RedisTokenService from "../services/implementations/RedisTokenService";
// import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt";

// export const authenticate = (
//   req: Request & Partial<{ user: string | jwt.JwtPayload }>,
//   res: Response,
//   next: NextFunction
// ): void => {
//   console.log("authenticate start");
//   // Check for token in cookies first, then fallback to Authorization header
//   const token =
//     req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];

//   if (!token) {
//     console.log("authenticate failed: No token provided");
//     res
//       .status(401)
//       .json(new ApiResponse(401, null, "Access denied: No token provided"));
//     return;
//   }

//   try {
//     const decoded = verifyAccessToken(token);
//     console.log("authenticate decoded:", decoded);

//     if (!decoded.role?.includes("admin")) {
//       console.log("authenticate failed: Not an admin, role:", decoded.role);
//       res
//         .status(403)
//         .json(new ApiResponse(403, null, "You are not authorized"));
//       return;
//     }

//     req.user = decoded;
//     console.log("authenticate success, user:", req.user);
//     next();
//   } catch (err) {
//     console.error("authenticate error:", err);
//     res
//       .status(401)
//       .json(new ApiResponse(401, null, "Invalid or expired token"));
//   }
// };

// export const verifyRefreshTokenMiddleware = (
//   req: Request &
//     Partial<{ user: string | (jwt.JwtPayload & { rawToken: string }) }>,
//   res: Response,
//   next: NextFunction
// ): void => {
//   console.log("verifyRefreshTokenMiddleware start, cookies:", req.cookies);
//   const refreshToken = req.cookies?.refreshToken;

//   if (!refreshToken) {
//     console.log(
//       "verifyRefreshTokenMiddleware failed: No refresh token provided"
//     );
//     res
//       .status(401)
//       .json(
//         new ApiResponse(401, null, "Access denied: No refresh token provided")
//       );
//     return;
//   }

//   try {
//     const decoded = verifyRefreshToken(refreshToken);
//     console.log("verifyRefreshTokenMiddleware decoded:", decoded);

//     RedisTokenService.verifyRefreshToken(decoded.id, refreshToken)
//       .then((isValid) => {
//         if (!isValid) {
//           console.log(
//             "verifyRefreshTokenMiddleware failed: Invalid refresh token for user:",
//             decoded.id
//           );
//           res
//             .status(401)
//             .json(
//               new ApiResponse(401, null, "Invalid or expired refresh token")
//             );
//           return;
//         }

//         req.user = { ...decoded, rawToken: refreshToken };
//         console.log("verifyRefreshTokenMiddleware success, user:", req.user);
//         next();
//       })
//       .catch((err) => {
//         console.error("verifyRefreshTokenMiddleware Redis error:", err);
//         res
//           .status(401)
//           .json(new ApiResponse(401, null, "Failed to verify refresh token"));
//       });
//   } catch (err) {
//     console.error("verifyRefreshTokenMiddleware JWT error:", err);
//     res
//       .status(401)
//       .json(new ApiResponse(401, null, "Invalid or expired refresh token"));
//   }
// };

// export const decodedRefreshToken = (
//   req: Request &
//     Partial<{ user: string | (jwt.JwtPayload & { rawToken: string }) }>,
//   res: Response,
//   next: NextFunction
// ): void => {
//   console.log("decodedRefreshToken start, cookies:", req.cookies);
//   const refreshToken = req.cookies?.refreshToken;

//   if (!refreshToken) {
//     console.log("decodedRefreshToken failed: No refresh token provided");
//     res
//       .status(401)
//       .json(
//         new ApiResponse(401, null, "Access denied: No refresh token provided")
//       );
//     return;
//   }

//   try {
//     const decoded = jwt.decode(refreshToken) as jwt.JwtPayload;
//     if (!decoded || typeof decoded !== "object" || !decoded.id) {
//       console.error("decodedRefreshToken error: Missing id in token payload");
//       res.status(401).json(new ApiResponse(401, null, "Invalid refresh token"));
//       return;
//     }
//     req.user = { ...decoded, rawToken: refreshToken, id: decoded.id };
//     console.log("decodedRefreshToken success, user:", req.user);
//     next();
//   } catch (err) {
//     console.error("decodedRefreshToken error:", err);
//     res.status(401).json(new ApiResponse(401, null, "Invalid refresh token"));
//   }
// };
import { Request, Response, NextFunction } from "express";
import ApiResponse from "../utils/apiResponse";
import jwt from "jsonwebtoken";
import RedisTokenService from "../services/implementations/RedisTokenService";
import {
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
} from "../utils/jwt";

export const authenticate = (
  req: Request & Partial<{ user: string | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
): void => {
  console.log("authenticate start");
  // Check for token in cookies first, then fallback to Authorization header
  const token =
    req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    console.log("authenticate failed: No token provided");
    res
      .status(401)
      .json(new ApiResponse(401, null, "Access denied: No token provided"));
    return;
  }

  try {
    const decoded = verifyAccessToken(token);
    console.log("authenticate decoded:", decoded);

    if (!decoded.role?.includes("admin")) {
      console.log("authenticate failed: Not an admin, role:", decoded.role);
      res
        .status(403)
        .json(new ApiResponse(403, null, "You are not authorized"));
      return;
    }

    req.user = decoded;
    console.log("authenticate success, user:", req.user);
    next();
  } catch (err) {
    console.error("authenticate error:", err);
    res
      .status(401)
      .json(new ApiResponse(401, null, "Invalid or expired token"));
  }
};

// ✅ UPDATED: Extract userId from expired/missing access token or Authorization header
export const verifyRefreshTokenMiddleware = async (
  req: Request &
    Partial<{ user: string | (jwt.JwtPayload & { rawToken?: string }) }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("verifyRefreshTokenMiddleware start");
  console.log("verifyRefreshTokenMiddleware cookies:", req.cookies);
  console.log(
    "verifyRefreshTokenMiddleware headers:",
    req.headers.authorization
  );

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
          "verifyRefreshTokenMiddleware: Got userId from access token:",
          userId
        );
      } catch (decodeError) {
        console.error(
          "verifyRefreshTokenMiddleware: Failed to decode access token:",
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
                "verifyRefreshTokenMiddleware: Got userId from expired token:",
                userId
              );
            } catch (finalDecodeError) {
              console.error(
                "verifyRefreshTokenMiddleware: Completely invalid token"
              );
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

      // ✅ Set user with decoded info (no rawToken since it's not from cookies)
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

// ✅ UPDATED: Extract userId from expired/missing access token
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

        // If token is completely invalid, try to verify it anyway to check if it's just expired
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

    // ✅ CHANGED: Get refresh token from Redis
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

// ✅ NEW: Alternative middleware that gets userId from request body (for specific endpoints)
export const extractUserIdFromBody = (
  req: Request & Partial<{ user: string | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
): void => {
  console.log("extractUserIdFromBody start, body:", req.body);

  const userId = req.body?.userId;

  if (!userId) {
    console.log("extractUserIdFromBody failed: No userId in request body");
    res.status(400).json(new ApiResponse(400, null, "User ID required"));
    return;
  }

  req.user = { id: userId };
  console.log("extractUserIdFromBody success, user:", req.user);
  next();
};
