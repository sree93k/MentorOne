// import { CookieOptions } from "express";

// const cookieConfig: CookieOptions = {
//   httpOnly: process.env.COOKIE_HTTP_ONLY === "true",
//   secure: process.env.COOKIE_SECURE === "true",
//   sameSite:
//     (process.env.COOKIE_SAME_SITE as "lax" | "strict" | "none") || "strict",
//   path: process.env.COOKIE_PATH || "/",
//   maxAge: parseInt(process.env.COOKIE_MAX_AGE || "604800000", 10), // 7 days
// };

// export default cookieConfig;
import { CookieOptions } from "express";

// Validate environment variables
const parseBoolean = (
  value: string | undefined,
  defaultValue: boolean
): boolean => (value ? value.toLowerCase() === "true" : defaultValue);

const parseSameSite = (
  value: string | undefined,
  defaultValue: "lax" | "strict" | "none"
): "lax" | "strict" | "none" => {
  const validValues = ["lax", "strict", "none"] as const;
  return value && validValues.includes(value as any)
    ? (value as "lax" | "strict" | "none")
    : defaultValue;
};

// Base cookie configuration
const baseConfig: CookieOptions = {
  httpOnly: parseBoolean(process.env.COOKIE_HTTP_ONLY, true),
  secure: parseBoolean(
    process.env.COOKIE_SECURE,
    process.env.NODE_ENV === "production"
  ),
  sameSite: parseSameSite(process.env.COOKIE_SAME_SITE, "strict"),
  path: process.env.COOKIE_PATH || "/",
};

// Access token configuration (shorter-lived)
export const accessTokenConfig: CookieOptions = {
  ...baseConfig,
  maxAge: parseInt(process.env.COOKIE_ACCESS_MAX_AGE || "604800000", 10), // 7 days
};

// Refresh token configuration (longer-lived)
export const refreshTokenConfig: CookieOptions = {
  ...baseConfig,
  maxAge: parseInt(process.env.COOKIE_REFRESH_MAX_AGE || "1209600000", 10), // 14 days
};
