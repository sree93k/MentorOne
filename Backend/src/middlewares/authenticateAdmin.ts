// // src/middlewares/authenticateAdmin.ts
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
import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt";

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

export const verifyRefreshTokenMiddleware = (
  req: Request &
    Partial<{ user: string | (jwt.JwtPayload & { rawToken: string }) }>,
  res: Response,
  next: NextFunction
): void => {
  console.log("verifyRefreshTokenMiddleware start, cookies:", req.cookies);
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    console.log(
      "verifyRefreshTokenMiddleware failed: No refresh token provided"
    );
    res
      .status(401)
      .json(
        new ApiResponse(401, null, "Access denied: No refresh token provided")
      );
    return;
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    console.log("verifyRefreshTokenMiddleware decoded:", decoded);

    RedisTokenService.verifyRefreshToken(decoded.id, refreshToken)
      .then((isValid) => {
        if (!isValid) {
          console.log(
            "verifyRefreshTokenMiddleware failed: Invalid refresh token for user:",
            decoded.id
          );
          res
            .status(401)
            .json(
              new ApiResponse(401, null, "Invalid or expired refresh token")
            );
          return;
        }

        req.user = { ...decoded, rawToken: refreshToken };
        console.log("verifyRefreshTokenMiddleware success, user:", req.user);
        next();
      })
      .catch((err) => {
        console.error("verifyRefreshTokenMiddleware Redis error:", err);
        res
          .status(401)
          .json(new ApiResponse(401, null, "Failed to verify refresh token"));
      });
  } catch (err) {
    console.error("verifyRefreshTokenMiddleware JWT error:", err);
    res
      .status(401)
      .json(new ApiResponse(401, null, "Invalid or expired refresh token"));
  }
};

export const decodedRefreshToken = (
  req: Request &
    Partial<{ user: string | (jwt.JwtPayload & { rawToken: string }) }>,
  res: Response,
  next: NextFunction
): void => {
  console.log("decodedRefreshToken start, cookies:", req.cookies);
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    console.log("decodedRefreshToken failed: No refresh token provided");
    res
      .status(401)
      .json(
        new ApiResponse(401, null, "Access denied: No refresh token provided")
      );
    return;
  }

  try {
    const decoded = jwt.decode(refreshToken) as jwt.JwtPayload;
    if (!decoded || typeof decoded !== "object" || !decoded.id) {
      console.error("decodedRefreshToken error: Missing id in token payload");
      res.status(401).json(new ApiResponse(401, null, "Invalid refresh token"));
      return;
    }
    req.user = { ...decoded, rawToken: refreshToken, id: decoded.id };
    console.log("decodedRefreshToken success, user:", req.user);
    next();
  } catch (err) {
    console.error("decodedRefreshToken error:", err);
    res.status(401).json(new ApiResponse(401, null, "Invalid refresh token"));
  }
};
