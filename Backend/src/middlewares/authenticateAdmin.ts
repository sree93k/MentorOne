// // import { Request, Response, NextFunction } from "express";
// // import ApiResponse from "../utils/apiResponse";
// // // import { AuthRequest } from "../types/express";
// // import {
// //   decodeToken,
// //   verifyAccessToken,
// //   verifyRefreshToken,
// // } from "../utils/jwt";
// // import jwt from "jsonwebtoken";

// // //====>>>>>>>>
// // export const authenticate = (
// //   req: Request & Partial<{ user: string | jwt.JwtPayload }>,
// //   res: Response,
// //   next: NextFunction
// // ): void => {
// //   console.log("autheticte start1");

// //   const token =
// //     req.headers["authorization"]?.split(" ")[1] || req.header("authorization");

// //   console.log("autheticte start2", token);
// //   if (!token) {
// //     console.log("autheticte failed 1");
// //     res.status(401).send("Access denied");
// //     return;
// //   }
// //   console.log("autheticte start3");
// //   try {
// //     console.log("autheticte start4");
// //     const decoded = verifyAccessToken(token);
// //     console.log("autheticte start5");
// //     req.user = decoded;
// //     console.log("autheticte start6.....admin auth", req.user);
// //     if (!decoded.role.includes("admin")) {
// //       console.log("autheticte start7", decoded.role);
// //       console.log("autheticte failed2");
// //       res
// //         .status(401)
// //         .json(new ApiResponse(401, null, "you are not authorized"));
// //       return;
// //     }
// //     console.log("autheticte success");
// //     next();
// //   } catch (err) {
// //     res
// //       .status(401)
// //       .json(new ApiResponse(401, null, "Invalid Token or Expired"));
// //     return;
// //   }
// // };

// // //====>>>>>>>>
// // export const decodedRefreshToken = (
// //   req: Request &
// //     Partial<{ user: string | (jwt.JwtPayload & { rawToken: string }) }>,
// //   res: Response,
// //   next: NextFunction
// // ): void => {
// //   console.log("decode refresh token step 1 - Headers:", req.headers);
// //   console.log("decode refresh token step 2 - Cookies:", req.cookies);

// //   const refreshToken =
// //     (req.cookies && req.cookies["adminRefreshToken"]) || // Check if cookies exist
// //     (req.headers["adminrefreshtoken"] as string); // Lowercase header name

// //   if (!refreshToken) {
// //     console.log("decode refresh token step 3 - No token found");
// //     res
// //       .status(401)
// //       .json(
// //         new ApiResponse(401, null, "Access Denied: No refresh token provided")
// //       );
// //     return;
// //   }

// //   console.log("decode refresh token step 4 - Token:", refreshToken);
// //   try {
// //     const decoded = decodeToken(refreshToken);
// //     // const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "your-secret"); // Replace decodeToken with jwt.verify
// //     console.log("decode refresh token step 5 - Decoded:", decoded);

// //     req.user = { ...decoded, rawToken: refreshToken };
// //     console.log("decode refresh token step 6 - req.user set");
// //     next();
// //   } catch (err) {
// //     console.log("decode refresh token step 7 - Error:", err);
// //     res.status(401).json(new ApiResponse(401, null, "Invalid refresh token"));
// //   }
// // };

// // export const verifyRefreshTokenMiddleware = (
// //   req: Request & Partial<{ user: string | jwt.JwtPayload }>,
// //   res: Response,
// //   next: NextFunction
// // ): void => {
// //   console.log("verifyRefreshTokenMiddleware step 1");
// //   const refreshToken =
// //     req.cookies["adminRefreshToken"] || req.header("adminRefreshToken");

// //   if (!refreshToken) {
// //     res.status(401).json(new ApiResponse(401, null, "Access Denied"));
// //     return; // Just return without value
// //   }

// //   try {
// //     const decoded = verifyRefreshToken(refreshToken);

// //     req.user = { ...decoded, rawToken: refreshToken };

// //     next();
// //   } catch (err) {
// //     res
// //       .status(401)
// //       .json(new ApiResponse(401, null, "Invalid Token or Expired"));
// //     return; // Just return without value
// //   }
// // };

// // //====>>>>>>>>
// // export const refreshAccessToken = (
// //   req: Request & Partial<{ user: string | jwt.JwtPayload }>,
// //   res: Response,
// //   next: NextFunction
// // ) => {
// //   const refreshToken =
// //     req.cookies["refreshToken"] || req.header("refreshToken");

// //   if (!refreshToken) {
// //     return res.status(401).json(new ApiResponse(401, null, "Access Denied"));
// //   }

// //   try {
// //     const decoded = verifyRefreshToken(refreshToken);

// //     req.user = { ...decoded, rawToken: refreshToken };

// //     next();
// //   } catch (err) {
// //     res
// //       .status(401)
// //       .json(new ApiResponse(401, null, "Invalid Token or Expired"));
// //   }
// // };

// // //====>>>>>>>>

// // export const decodedUserRefreshToken = (
// //   req: Request & Partial<{ user: string | jwt.JwtPayload }>,
// //   res: Response,
// //   next: NextFunction
// // ) => {
// //   const refreshToken =
// //     req.cookies["refreshToken"] || req.header("refreshToken");

// //   if (!refreshToken) {
// //     return res.status(401).json(new ApiResponse(401, null, "Access Denied"));
// //   }

// //   try {
// //     const decoded = decodeToken(refreshToken);

// //     req.user = { ...decoded, rawToken: refreshToken };

// //     next();
// //   } catch (err) {
// //     res.status(401).json(new ApiResponse(401, null, "Invalid "));
// //   }
// // };
// // //====>>>>>>>>
// // export const authenticateUser = (
// //   req: Request & Partial<{ user: {} | jwt.JwtPayload }>,
// //   res: Response,
// //   next: NextFunction
// // ) => {
// //   const token =
// //     req.headers["authorization"]?.split(" ")[1] || req.header("authorization");

// //   if (!token) {
// //     return res.status(401).send("Access denied");
// //   }

// //   try {
// //     const decoded = verifyAccessToken(token);
// //     req.user = decoded;

// //     if (decoded.role.includes("mentee") || decoded.role.includes("mentor")) {
// //       res
// //         .status(401)
// //         .json(new ApiResponse(401, null, "you are not authorized"));
// //     }

// //     next();
// //   } catch (err) {
// //     res
// //       .status(401)
// //       .json(new ApiResponse(401, null, "Invalid Token or Expired"));
// //   }
// // };
// // //====>>>>>>>>
// // export const verifyUserRefreshToken = (
// //   req: Request & Partial<{ user: string | jwt.JwtPayload }>,
// //   res: Response,
// //   next: NextFunction
// // ) => {
// //   const refreshToken =
// //     req.cookies["refreshToken"] || req.header("refreshToken");

// //   if (!refreshToken) {
// //     return res.status(401).json(new ApiResponse(401, null, "Access Denied"));
// //   }

// //   try {
// //     const decoded = verifyRefreshToken(refreshToken);

// //     req.user = { ...decoded, rawToken: refreshToken };

// //     next();
// //   } catch (err) {
// //     res
// //       .status(401)
// //       .json(new ApiResponse(401, null, "Invalid Token or Expired"));
// //   }
// // };
// // //====>>>>>>>>
// import { Request, Response, NextFunction } from "express";
// import ApiResponse from "../utils/apiResponse";
// import jwt from "jsonwebtoken";
// import RedisTokenService from "../services/implementations/RedisTokenService";
// import { verifyAccessToken, decodeToken, verifyRefreshToken } from "../utils/jwt";

// export const authenticate = (
//   req: Request & Partial<{ user: string | jwt.JwtPayload }>,
//   res: Response,
//   next: NextFunction
// ): void => {
//   console.log("authenticate start");
//   const token =
//     req.headers["authorization"]?.split(" ")[1] || req.header("authorization");
//   console.log("authenticate token:", token);

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

// export const decodedRefreshToken = (
//   req: Request &
//     Partial<{ user: string | (jwt.JwtPayload & { rawToken: string }) }>,
//   res: Response,
//   next: NextFunction
// ): void => {
//   console.log(
//     "decodedRefreshToken start, headers:",
//     req.headers,
//     "cookies:",
//     req.cookies
//   );
//   const refreshToken =
//     req.cookies["refreshToken"] || req.header("refreshToken");

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
//     const decoded = decodeToken(refreshToken);
//     console.log("decodedRefreshToken decoded:", decoded);
//     req.user = { ...decoded, rawToken: refreshToken };
//     console.log("decodedRefreshToken success, user:", req.user);
//     next();
//   } catch (err) {
//     console.error("decodedRefreshToken error:", err);
//     res
//       .status(401)
//       .json(new ApiResponse(401, null, "Invalid or expired refresh token"));
//   }
// };

// export const verifyRefreshTokenMiddleware = (
//   req: Request &
//     Partial<{ user: string | (jwt.JwtPayload & { rawToken: string }) }>,
//   res: Response,
//   next: NextFunction
// ): void => {
//   console.log(
//     "verifyRefreshTokenMiddleware start, headers:",
//     req.headers,
//     "cookies:",
//     req.cookies
//   );
//   const refreshToken =
//     req.cookies["refreshToken"] || req.header("refreshToken");

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
//     const decoded = jwt.verify(
//       refreshToken,
//       process.env.REFRESH_TOKEN_SECRET || "secret"
//     ) as jwt.JwtPayload;
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

// export const refreshAccessToken = (
//   req: Request & Partial<{ user: string | jwt.JwtPayload }>,
//   res: Response,
//   next: NextFunction
// ): void => {
//   console.log(
//     "refreshAccessToken start, headers:",
//     req.headers,
//     "cookies:",
//     req.cookies
//   );
//   const refreshToken =
//     req.cookies["refreshToken"] || req.header("refreshToken");

//   if (!refreshToken) {
//     console.log("refreshAccessToken failed: No refresh token provided");
//     res
//       .status(401)
//       .json(
//         new ApiResponse(401, null, "Access denied: No refresh token provided")
//       );
//     return;
//   }

//   try {
//     const decoded = verifyRefreshToken(refreshToken);
//     req.user = { ...decoded, rawToken: refreshToken };
//     console.log("refreshAccessToken success, user:", req.user);
//     next();
//   } catch (err) {
//     console.error("refreshAccessToken error:", err);
//     res
//       .status(401)
//       .json(new ApiResponse(401, null, "Invalid or expired refresh token"));
//   }
// };

// export const decodedUserRefreshToken = (
//   req: Request & Partial<{ user: string | jwt.JwtPayload }>,
//   res: Response,
//   next: NextFunction
// ): void => {
//   console.log(
//     "decodedUserRefreshToken start, headers:",
//     req.headers,
//     "cookies:",
//     req.cookies
//   );
//   const refreshToken =
//     req.cookies["refreshToken"] || req.header("refreshToken");

//   if (!refreshToken) {
//     console.log("decodedUserRefreshToken failed: No refresh token provided");
//     res
//       .status(401)
//       .json(
//         new ApiResponse(401, null, "Access denied: No refresh token provided")
//       );
//     return;
//   }

//   try {
//     const decoded = decodeToken(refreshToken);
//     req.user = { ...decoded, rawToken: refreshToken };
//     console.log("decodedUserRefreshToken success, user:", req.user);
//     next();
//   } catch (err) {
//     console.error("decodedUserRefreshToken error:", err);
//     res.status(401).json(new ApiResponse(401, null, "Invalid refresh token"));
//   }
// };

// export const authenticateUser = (
//   req: Request & Partial<{ user: string | jwt.JwtPayload }>,
//   res: Response,
//   next: NextFunction
// ): void => {
//   console.log("authenticateUser start");
//   const token =
//     req.headers["authorization"]?.split(" ")[1] || req.header("authorization");

//   if (!token) {
//     console.log("authenticateUser failed: No token provided");
//     res
//       .status(401)
//       .json(new ApiResponse(401, null, "Access denied: No token provided"));
//     return;
//   }

//   try {
//     const decoded = verifyAccessToken(token);
//     console.log("authenticateUser decoded:", decoded);

//     if (
//       !decoded.role?.includes("mentee") &&
//       !decoded.role?.includes("mentor")
//     ) {
//       console.log("authenticateUser failed: Invalid role:", decoded.role);
//       res
//         .status(403)
//         .json(new ApiResponse(403, null, "You are not authorized"));
//       return;
//     }

//     req.user = decoded;
//     console.log("authenticateUser success, user:", req.user);
//     next();
//   } catch (err) {
//     console.error("authenticateUser error:", err);
//     res
//       .status(401)
//       .json(new ApiResponse(401, null, "Invalid or expired token"));
//   }
// };

// export const verifyUserRefreshToken = (
//   req: Request & Partial<{ user: string | jwt.JwtPayload }>,
//   res: Response,
//   next: NextFunction
// ): void => {
//   console.log(
//     "verifyUserRefreshToken start, headers:",
//     req.headers,
//     "cookies:",
//     req.cookies
//   );
//   const refreshToken =
//     req.cookies["refreshToken"] || req.header("refreshToken");

//   if (!refreshToken) {
//     console.log("verifyUserRefreshToken failed: No refresh token provided");
//     res
//       .status(401)
//       .json(
//         new ApiResponse(401, null, "Access denied: No refresh token provided")
//       );
//     return;
//   }

//   try {
//     const decoded = verifyRefreshToken(refreshToken);
//     req.user = { ...decoded, rawToken: refreshToken };
//     console.log("verifyUserRefreshToken success, user:", req.user);
//     next();
//   } catch (err) {
//     console.error("verifyUserRefreshToken error:", err);
//     res
//       .status(401)
//       .json(new ApiResponse(401, null, "Invalid or expired refresh token"));
//   }
// };
// src/middlewares/authenticateAdmin.ts
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
