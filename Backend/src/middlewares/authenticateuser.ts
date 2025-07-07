// import { Request, Response, NextFunction } from "express";
// import ApiResponse from "../utils/apiResponse";
// // import { AuthRequest } from "../types/express";
// import {
//   decodeToken,
//   verifyAccessToken,
//   verifyRefreshToken,
// } from "../utils/jwt";
// import jwt from "jsonwebtoken";

// //====>>>>>>>>
// export const authenticate = (
//   req: Request & Partial<{ user: string | jwt.JwtPayload }>,
//   res: Response,
//   next: NextFunction
// ): void => {
//   console.log("autheticte start 1");
//   // console.log("request  IS ", req);

//   const token =
//     req.headers["authorization"]?.split(" ")[1] || req.header("authorization");
//   console.log("autheticte start 2");
//   if (!token) {
//     console.log("autheticte failed 3");
//     res.status(401).send("Access denied");
//     return;
//   }
//   console.log("autheticte start 4 token is ", token);
//   try {
//     const decoded = verifyAccessToken(token);
//     req.user = decoded;
//     console.log("autheticte start 5", decoded);
//     console.log("autheticte start 5.5", req.user);
//     if (decoded.role.includes("admin")) {
//       console.log("autheticte start7", decoded.role);
//       console.log("autheticte failed2");
//       res
//         .status(401)
//         .json(new ApiResponse(401, null, "you are not authorized"));
//       return;
//     }

//     console.log("autheticte start 6......");
//     console.log("autheticte success");
//     next();
//   } catch (err) {
//     console.log("autheticte start 7 error", err);
//     res
//       .status(401)
//       .json(new ApiResponse(401, null, "Invalid Token or Expired"));
//     return;
//   }
// };

// //====>>>>>>>>
// export const decodedRefreshToken = (
//   req: Request &
//     Partial<{ user: string | (jwt.JwtPayload & { rawToken: string }) }>,
//   res: Response,
//   next: NextFunction
// ): void => {
//   console.log("decode refrsh token step 1");
//   console.log("decodedUserRefreshToken - Headers:", req.headers);
//   console.log("decodedUserRefreshToken - Cookies:", req.cookies);
//   const refreshToken =
//     (req.cookies && req.cookies["refreshToken"]) || // Check if cookies exist
//     (req.headers["refreshtoken"] as string);
//   console.log("decode refrsh token step 2", refreshToken);
//   if (!refreshToken) {
//     console.log("decodedUserRefreshToken - No refresh token found");
//     res
//       .status(401)
//       .json(
//         new ApiResponse(401, null, "Access Denied: No refresh token provided")
//       );
//     return;
//   }
//   console.log("decode refrsh token step 4");
//   try {
//     const verifyToken = verifyRefreshToken(refreshToken);
//     const decoded = decodeToken(refreshToken);
//     console.log(
//       "veridfy token",
//       verifyToken,
//       " and decode token ",
//       decodeToken
//     );

//     console.log("decode refrsh token step 5", decoded);
//     req.user = { ...decoded, rawToken: refreshToken };
//     console.log("decode refrsh token step 6", req.user);
//     next();
//   } catch (err) {
//     console.log("decode refrsh token step 7 error");
//     res.status(401).json(new ApiResponse(401, null, "Invalid Token"));
//     return; // Just return without value
//   }
// };

// export const verifyRefreshTokenMiddleware = (
//   req: Request & Partial<{ user: string | jwt.JwtPayload }>,
//   res: Response,
//   next: NextFunction
// ): void => {
//   console.log("verifyRefreshTokenMiddleware step 1");
//   const refreshToken =
//     req.cookies["refreshToken"] || req.header("refreshToken");

//   if (!refreshToken) {
//     res.status(401).json(new ApiResponse(401, null, "Access Denied"));
//     return; // Just return without value
//   }

//   try {
//     const decoded = verifyRefreshToken(refreshToken);

//     req.user = { ...decoded, rawToken: refreshToken };

//     next();
//   } catch (err) {
//     res
//       .status(401)
//       .json(new ApiResponse(401, null, "Invalid Token or Expired"));
//     return; // Just return without value
//   }
// };

// //====>>>>>>>>
// export const refreshAccessToken = (
//   req: Request & Partial<{ user: string | jwt.JwtPayload }>,
//   res: Response,
//   next: NextFunction
// ) => {
//   const refreshToken =
//     req.cookies["refreshToken"] || req.header("refreshToken");

//   if (!refreshToken) {
//     return res.status(401).json(new ApiResponse(401, null, "Access Denied"));
//   }

//   try {
//     const decoded = verifyRefreshToken(refreshToken);

//     req.user = { ...decoded, rawToken: refreshToken };

//     next();
//   } catch (err) {
//     res
//       .status(401)
//       .json(new ApiResponse(401, null, "Invalid Token or Expired"));
//   }
// };

// //====>>>>>>>>

// export const decodedUserRefreshToken = (
//   req: Request & Partial<{ user: string | jwt.JwtPayload }>,
//   res: Response,
//   next: NextFunction
// ): void => {
//   console.log("decode refresh token step 1 - Headers:", req.headers);
//   console.log("decode refresh token step 2 - Cookies:", req.cookies);

//   const refreshToken =
//     (req.cookies && req.cookies["adminRefreshToken"]) || // Check if cookies exist
//     (req.headers["adminrefreshtoken"] as string); // Lowercase header name

//   if (!refreshToken) {
//     console.log("decode refresh token step 3 - No token found");
//     res
//       .status(401)
//       .json(
//         new ApiResponse(401, null, "Access Denied: No refresh token provided")
//       );
//     return;
//   }
//   try {
//     const decoded = decodeToken(refreshToken);
//     // const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "your-secret"); // Replace decodeToken with jwt.verify
//     console.log("decode refresh token step 5 - Decoded:", decoded);

//     req.user = { ...decoded, rawToken: refreshToken };
//     console.log("decode refresh token step 6 - req.user set");
//     next();
//   } catch (err) {
//     console.log("decode refresh token step 7 - Error:", err);
//     res.status(401).json(new ApiResponse(401, null, "Invalid refresh token"));
//   }
// };
// //====>>>>>>>>
// export const authenticateUser = (
//   req: Request & Partial<{ user: {} | jwt.JwtPayload }>,
//   res: Response,
//   next: NextFunction
// ) => {
//   const token =
//     req.headers["authorization"]?.split(" ")[1] || req.header("authorization");

//   if (!token) {
//     return res.status(401).send("Access denied");
//   }

//   try {
//     const decoded = verifyAccessToken(token);
//     req.user = decoded;

//     if (decoded.role != "user") {
//       res
//         .status(401)
//         .json(new ApiResponse(401, null, "you are not authorized"));
//     }

//     next();
//   } catch (err) {
//     res
//       .status(401)
//       .json(new ApiResponse(401, null, "Invalid Token or Expired"));
//   }
// };
// //====>>>>>>>>
// export const verifyUserRefreshToken = (
//   req: Request & Partial<{ user: string | jwt.JwtPayload }>,
//   res: Response,
//   next: NextFunction
// ) => {
//   const refreshToken =
//     req.cookies["refreshToken"] || req.header("refreshToken");

//   if (!refreshToken) {
//     return res.status(401).json(new ApiResponse(401, null, "Access Denied"));
//   }

//   try {
//     const decoded = verifyRefreshToken(refreshToken);

//     req.user = { ...decoded, rawToken: refreshToken };

//     next();
//   } catch (err) {
//     res
//       .status(401)
//       .json(new ApiResponse(401, null, "Invalid Token or Expired"));
//   }
// };
// //====>>>>>>>>
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
  console.log("=== USER AUTHENTICATE MIDDLEWARE START ===");
  const token =
    req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];

  console.log("Available cookies:", Object.keys(req.cookies || {}));
  console.log("Access token present:", !!token);

  if (!token) {
    console.log("User authenticate failed: No token provided");
    res
      .status(401)
      .json(new ApiResponse(401, null, "Access denied: No token provided"));
    return;
  }

  try {
    const decoded = verifyAccessToken(token);
    console.log("User authenticate decoded:", decoded);

    // Check if user has admin role (reject admin access)
    if (decoded.role?.includes("admin")) {
      console.log(
        "User authenticate failed: Admin role detected:",
        decoded.role
      );
      res
        .status(403)
        .json(new ApiResponse(403, null, "You are not authorized"));
      return;
    }

    req.user = decoded;
    console.log("User authenticate success, user:", req.user);
    console.log("=== USER AUTHENTICATE MIDDLEWARE SUCCESS ===");
    next();
  } catch (err) {
    console.error("User authenticate error:", err);
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
  console.log("=== USER VERIFY REFRESH TOKEN MIDDLEWARE START ===");
  console.log("All cookies:", req.cookies);

  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    console.log(
      "User verifyRefreshTokenMiddleware failed: No refresh token provided"
    );
    res
      .status(401)
      .json(
        new ApiResponse(401, null, "Access denied: No refresh token provided")
      );
    return;
  }

  // Debug: Decode token to see its contents
  const decodedPayload = decodeToken(refreshToken);
  console.log("User decoded refresh token payload:", decodedPayload);

  // Check if token is expired before verification
  if (decodedPayload && decodedPayload.exp) {
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = decodedPayload.exp < currentTime;
    console.log("Current time:", currentTime);
    console.log("Token expires at:", decodedPayload.exp);
    console.log("Token is expired:", isExpired);

    if (isExpired) {
      console.log("Token is already expired, clearing cookies");
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res
        .status(401)
        .json(new ApiResponse(401, null, "Refresh token has expired"));
      return;
    }
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    console.log("User verifyRefreshTokenMiddleware decoded:", decoded);

    RedisTokenService.verifyRefreshToken(decoded.id, refreshToken)
      .then((isValid) => {
        if (!isValid) {
          console.log(
            "User verifyRefreshTokenMiddleware failed: Invalid refresh token for user:",
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
        console.log(
          "User verifyRefreshTokenMiddleware success, user:",
          req.user
        );
        console.log("=== USER VERIFY REFRESH TOKEN MIDDLEWARE SUCCESS ===");
        next();
      })
      .catch((err) => {
        console.error("User verifyRefreshTokenMiddleware Redis error:", err);
        res
          .status(401)
          .json(new ApiResponse(401, null, "Failed to verify refresh token"));
      });
  } catch (err) {
    console.error("User verifyRefreshTokenMiddleware JWT error:", err);

    // Clear potentially corrupted cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

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
  console.log("=== USER DECODED REFRESH TOKEN MIDDLEWARE START ===");
  console.log("User decodedRefreshToken start, cookies:", req.cookies);
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    console.log("User decodedRefreshToken failed: No refresh token provided");
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
      console.error(
        "User decodedRefreshToken error: Missing id in token payload"
      );
      res.status(401).json(new ApiResponse(401, null, "Invalid refresh token"));
      return;
    }

    req.user = { ...decoded, rawToken: refreshToken, id: decoded.id };
    console.log("User decodedRefreshToken success, user:", req.user);
    console.log("=== USER DECODED REFRESH TOKEN MIDDLEWARE SUCCESS ===");
    next();
  } catch (err) {
    console.error("User decodedRefreshToken error:", err);
    res.status(401).json(new ApiResponse(401, null, "Invalid refresh token"));
  }
};

// Legacy middleware functions - keeping for backward compatibility but updated for cookies
export const decodedUserRefreshToken = decodedRefreshToken;
export const verifyUserRefreshToken = verifyRefreshTokenMiddleware;
export const authenticateUser = authenticate;
