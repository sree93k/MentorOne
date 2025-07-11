import jwt from "jsonwebtoken";

// Use the correct environment variables that match your .env file
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET as string;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET as string;

// Use the expiration times from environment variables
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "5m";
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d";

export const generateAccessToken = (payload: object): string => {
  // Use environment variable instead of hardcoded time
  return jwt.sign(payload, accessTokenSecret, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

export const accessTokenForReset = (payload: object): string => {
  return jwt.sign(payload, accessTokenSecret, { expiresIn: "1m" });
};

export const generateRefreshToken = (payload: object): string => {
  // Use environment variable instead of hardcoded "5m"
  return jwt.sign(payload, refreshTokenSecret, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

export const verifyAccessToken = (token: string): any => {
  try {
    const decoded = jwt.verify(token, accessTokenSecret);
    console.log("Access token verified successfully:", decoded);
    return decoded;
  } catch (error) {
    console.error("Access token verification failed:", error);
    throw new Error("Invalid access token");
  }
};

export const verifyRefreshToken = (token: string): any => {
  try {
    const decoded = jwt.verify(token, refreshTokenSecret);
    console.log("Refresh token verified successfully:", decoded);
    return decoded;
  } catch (error) {
    console.error("Refresh token verification failed:", error);
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Refresh token expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid refresh token format");
    } else {
      throw new Error("Invalid refresh token");
    }
  }
};

export const decodeToken = (token: string): any => {
  try {
    console.log("decode token 1, token:", token);
    const decoded = jwt.decode(token);
    console.log("decode token 2, decoded:", decoded);
    return decoded;
  } catch (error) {
    console.error("Token decode error:", error);
    throw new Error("invalid");
  }
};

export const decodeAndVerifyToken = (token: string): any => {
  try {
    const decoded: any = jwt.verify(token, accessTokenSecret);

    if (decoded && decoded._doc) {
      return decoded._doc;
    }

    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
