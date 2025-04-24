import { Request, Response, NextFunction } from "express";
import ApiResponse from "../utils/apiResponse";
// import { AuthRequest } from "../types/express";
import {
  decodeToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/jwt";
import jwt from "jsonwebtoken";

//====>>>>>>>>
export const authenticate = (
  req: Request & Partial<{ user: string | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
): void => {
  console.log("autheticte start 1");
  // console.log("request  IS ", req);

  const token =
    req.headers["authorization"]?.split(" ")[1] || req.header("authorization");
  console.log("autheticte start 2");
  if (!token) {
    console.log("autheticte failed 3");
    res.status(401).send("Access denied");
    return;
  }
  console.log("autheticte start 4");
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    console.log("autheticte start 5", decoded);
    console.log("autheticte start 5.5", req.user);
    // if (decoded.role.includes("mentee") && decoded.role !== "mentor") {
    // console.log("autheticte failed2");
    // res.status(401).json(new ApiResponse(401, null, "you are not authorized"));
    // return;
    // }

    console.log("autheticte start 6......");
    console.log("autheticte success");
    next();
  } catch (err) {
    console.log("autheticte start 7 error", err);
    res
      .status(401)
      .json(new ApiResponse(401, null, "Invalid Token or Expired"));
    return;
  }
};

//====>>>>>>>>
export const decodedRefreshToken = (
  req: Request &
    Partial<{ user: string | (jwt.JwtPayload & { rawToken: string }) }>,
  res: Response,
  next: NextFunction
): void => {
  console.log("decode refrsh token step 1");
  console.log("decodedUserRefreshToken - Headers:", req.headers);
  console.log("decodedUserRefreshToken - Cookies:", req.cookies);
  const refreshToken =
    (req.cookies && req.cookies["refreshToken"]) || // Check if cookies exist
    (req.headers["refreshtoken"] as string);
  console.log("decode refrsh token step 2", refreshToken);
  if (!refreshToken) {
    console.log("decodedUserRefreshToken - No refresh token found");
    res
      .status(401)
      .json(
        new ApiResponse(401, null, "Access Denied: No refresh token provided")
      );
    return;
  }
  console.log("decode refrsh token step 4");
  try {
    const verifyToken = verifyRefreshToken(refreshToken);
    const decoded = decodeToken(refreshToken);
    console.log(
      "veridfy token",
      verifyToken,
      " and decode token ",
      decodeToken
    );

    console.log("decode refrsh token step 5", decoded);
    req.user = { ...decoded, rawToken: refreshToken };
    console.log("decode refrsh token step 6");
    next();
  } catch (err) {
    console.log("decode refrsh token step 7 error");
    res.status(401).json(new ApiResponse(401, null, "Invalid Token"));
    return; // Just return without value
  }
};

export const verifyRefreshTokenMiddleware = (
  req: Request & Partial<{ user: string | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
): void => {
  console.log("verifyRefreshTokenMiddleware step 1");
  const refreshToken =
    req.cookies["refreshToken"] || req.header("refreshToken");

  if (!refreshToken) {
    res.status(401).json(new ApiResponse(401, null, "Access Denied"));
    return; // Just return without value
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);

    req.user = { ...decoded, rawToken: refreshToken };

    next();
  } catch (err) {
    res
      .status(401)
      .json(new ApiResponse(401, null, "Invalid Token or Expired"));
    return; // Just return without value
  }
};

//====>>>>>>>>
export const refreshAccessToken = (
  req: Request & Partial<{ user: string | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
) => {
  const refreshToken =
    req.cookies["refreshToken"] || req.header("refreshToken");

  if (!refreshToken) {
    return res.status(401).json(new ApiResponse(401, null, "Access Denied"));
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);

    req.user = { ...decoded, rawToken: refreshToken };

    next();
  } catch (err) {
    res
      .status(401)
      .json(new ApiResponse(401, null, "Invalid Token or Expired"));
  }
};

//====>>>>>>>>

export const decodedUserRefreshToken = (
  req: Request & Partial<{ user: string | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
): void => {
  console.log("decode refresh token step 1 - Headers:", req.headers);
  console.log("decode refresh token step 2 - Cookies:", req.cookies);

  const refreshToken =
    (req.cookies && req.cookies["adminRefreshToken"]) || // Check if cookies exist
    (req.headers["adminrefreshtoken"] as string); // Lowercase header name

  if (!refreshToken) {
    console.log("decode refresh token step 3 - No token found");
    res
      .status(401)
      .json(
        new ApiResponse(401, null, "Access Denied: No refresh token provided")
      );
    return;
  }
  try {
    const decoded = decodeToken(refreshToken);
    // const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "your-secret"); // Replace decodeToken with jwt.verify
    console.log("decode refresh token step 5 - Decoded:", decoded);

    req.user = { ...decoded, rawToken: refreshToken };
    console.log("decode refresh token step 6 - req.user set");
    next();
  } catch (err) {
    console.log("decode refresh token step 7 - Error:", err);
    res.status(401).json(new ApiResponse(401, null, "Invalid refresh token"));
  }
};
//====>>>>>>>>
export const authenticateUser = (
  req: Request & Partial<{ user: {} | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.headers["authorization"]?.split(" ")[1] || req.header("authorization");

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
//====>>>>>>>>
export const verifyUserRefreshToken = (
  req: Request & Partial<{ user: string | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
) => {
  const refreshToken =
    req.cookies["refreshToken"] || req.header("refreshToken");

  if (!refreshToken) {
    return res.status(401).json(new ApiResponse(401, null, "Access Denied"));
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);

    req.user = { ...decoded, rawToken: refreshToken };

    next();
  } catch (err) {
    res
      .status(401)
      .json(new ApiResponse(401, null, "Invalid Token or Expired"));
  }
};
//====>>>>>>>>
