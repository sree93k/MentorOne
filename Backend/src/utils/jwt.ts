import jwt from "jsonwebtoken";

const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET as string;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET as string;

export const generateAccessToken = (payload: object): string => {
  return jwt.sign(payload, accessTokenSecret, { expiresIn: "15m" }); // 30s -2m -15m seconds for testing
};

export const accessTokenForReset = (payload: object): string => {
  return jwt.sign(payload, accessTokenSecret, { expiresIn: "1m" }); //1m - 2m
};

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, refreshTokenSecret, { expiresIn: "3h" }); // 2m -5m -7d for testing
};

export const verifyAccessToken = (token: string): any => {
  try {
    return jwt.verify(token, accessTokenSecret);
  } catch (error) {
    throw new Error("Invalid access token");
  }
};

export const verifyRefreshToken = (token: string): any => {
  try {
    return jwt.verify(token, refreshTokenSecret);
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

export const decodeToken = (token: string): any => {
  try {
    console.log("decode token 1, token", token);
    return jwt.decode(token);
  } catch (error) {
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
