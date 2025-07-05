import dotenv from "dotenv";
import path from "path";
import { logger } from "../utils/logger";
import { AppError } from "../errors/appError";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

logger.info("Environment variables loaded", {
  envPath: path.resolve(__dirname, "../../.env"),
});

// Verify critical environment variables
const requiredEnvVars = [
  "JWT_ACCESS_TOKEN_SECRET",
  "JWT_REFRESH_TOKEN_SECRET",
  "MONGO_URI",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "REDIS_URL",
  "FRONTEND_URL",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    logger.error(`Missing environment variable: ${envVar}`);
    throw new AppError(
      `Missing environment variable: ${envVar}`,
      500,
      "error",
      "MISSING_ENV_VAR"
    );
  }
}

export const config = {
  jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET!,
  jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET!,
  mongoUri: process.env.MONGO_URI!,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  redisUrl: process.env.REDIS_URL!,
  frontendUrl: process.env.FRONTEND_URL!,
  port: process.env.PORT || "5002",
  nodeEnv: process.env.NODE_ENV || "development",
};
