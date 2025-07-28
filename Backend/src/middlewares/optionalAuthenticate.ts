// Backend/src/middlewares/optionalAuthenticate.ts
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

// ✅ FINAL FIX: Use standard Express Request type with type assertion
export const optionalAuthenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // ✅ FIXED: Use same logic as your existing authenticate middleware
    const token =
      req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      console.log(
        "optionalAuthenticate: No token found, continuing as anonymous"
      );
      return next(); // Continue without user data
    }

    try {
      const decoded = verifyAccessToken(token) as any;

      // ✅ FIXED: Use type assertion to add user property
      (req as any).user = {
        id: decoded.id,
        role: decoded.role || [], // Ensure it's always an array
        rawToken: token, // Include rawToken like your existing auth
      };

      console.log("optionalAuthenticate: User authenticated:", {
        id: (req as any).user.id,
        role: (req as any).user.role,
      });
    } catch (tokenError) {
      // Token invalid, but continue without user data
      console.log(
        "optionalAuthenticate: Invalid token, continuing as anonymous"
      );
    }

    next();
  } catch (error) {
    // Don't block request, just continue without user data
    console.error("optionalAuthenticate error:", error);
    next();
  }
};
