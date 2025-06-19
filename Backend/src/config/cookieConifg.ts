import { CookieOptions } from "express";

const cookieConfig: CookieOptions = {
  httpOnly: process.env.COOKIE_HTTP_ONLY === "true",
  secure: process.env.COOKIE_SECURE === "true",
  sameSite: process.env.COOKIE_SAME_SITE as "lax" | "strict" | "none",
  path: process.env.COOKIE_PATH || "/",
  maxAge: parseInt(process.env.COOKIE_MAX_AGE || "604800000", 10),
};

export default cookieConfig;
