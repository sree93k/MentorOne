import dotenv from "dotenv";
import path from "path";

// Determine which environment file to load
const environment = process.env.NODE_ENV || "development";
const envFile = `.env.${environment}`;

// Load environment-specific .env file
dotenv.config({
  path: path.resolve(process.cwd(), envFile),
});

// Fallback to .env if environment-specific file doesn't exist
if (!process.env.JWT_ACCESS_TOKEN_SECRET) {
  dotenv.config({
    path: path.resolve(process.cwd(), ".env"),
  });
}

export interface EnvironmentConfig {
  // Environment
  NODE_ENV: string;
  PORT: number;
  LOG_LEVEL: string;

  // Database
  MONGO_URI: string;

  // CORS
  FRONTEND_URL: string;
  ADMIN_FRONTEND_URL: string;

  // JWT
  JWT_ACCESS_TOKEN_SECRET: string;
  JWT_REFRESH_TOKEN_SECRET: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRY: string;
  REFRESH_TOKEN_EXPIRY: string;

  // Email
  EMAIL_USER?: string;
  EMAIL_PASS?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: number;
  EMAIL_ENABLED?: boolean;

  // AWS S3
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AWS_REGION?: string;
  AWS_S3_BUCKET_NAME?: string;

  // Cloudinary
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;

  // Redis
  REDIS_URL?: string;
  REDIS_HOST?: string;
  REDIS_PORT?: number;
  REDIS_PASSWORD?: string;

  // Stripe
  STRIPE_PUBLISHABLE_KEY?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_ENDPOINT_SECRET?: string;

  // Google OAuth
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_REDIRECT_URI?: string;

  // AI Services
  GOOGLE_API_KEY?: string;
  OPENAI_API_KEY?: string;

  // Session
  SESSION_SECRET?: string;

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS?: number;
  RATE_LIMIT_MAX_REQUESTS?: number;

  // Video Processing
  VIDEO_PROCESSING_ENABLED?: boolean;
  HLS_PROCESSING_ENABLED?: boolean;
  VIDEO_QUALITY_LEVELS?: string;

  // File Upload
  MAX_FILE_SIZE?: number;
  MAX_VIDEO_SIZE?: number;

  // Security
  COOKIE_SECURE?: boolean;
  COOKIE_HTTP_ONLY?: boolean;
  COOKIE_SAME_SITE?: string;
  CORS_CREDENTIALS?: boolean;

  // Logging
  ENABLE_DB_LOGGING?: boolean;
  LOG_FILE_PATH?: string;

  // Background Jobs
  ENABLE_JOB_QUEUE?: boolean;
  JOB_QUEUE_CONCURRENCY?: number;

  // Feature Flags
  DEBUG_MODE?: boolean;
  ENABLE_CORS_ALL?: boolean;
  ENABLE_PERFORMANCE_MONITORING?: boolean;
  ENABLE_ERROR_REPORTING?: boolean;
  ENABLE_METRICS?: boolean;
  HEALTH_CHECK_ENABLED?: boolean;
  HELMET_ENABLED?: boolean;
  CSP_ENABLED?: boolean;

  // CDN
  CDN_ENABLED?: boolean;
  CDN_URL?: string;
}

class EnvironmentService {
  private config: EnvironmentConfig;

  constructor() {
    this.config = this.loadConfig();
    this.validateConfig();
  }

  private loadConfig(): EnvironmentConfig {
    return {
      // Environment
      NODE_ENV: process.env.NODE_ENV || "development",
      PORT: parseInt(process.env.PORT || "5002", 10),
      LOG_LEVEL: process.env.LOG_LEVEL || "info",

      // Database
      MONGO_URI: process.env.MONGO_URI || "",

      // CORS
      FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
      ADMIN_FRONTEND_URL: process.env.ADMIN_FRONTEND_URL || "http://localhost:5173",

      // JWT
      JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET || "",
      JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET || "",
      ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",
      REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",
      ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "15m",
      REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "7d",

      // Email
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASS: process.env.EMAIL_PASS,
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
      EMAIL_ENABLED: process.env.EMAIL_ENABLED === "true",

      // AWS S3
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
      AWS_REGION: process.env.AWS_REGION,
      AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,

      // Cloudinary
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

      // Redis
      REDIS_URL: process.env.REDIS_URL,
      REDIS_HOST: process.env.REDIS_HOST,
      REDIS_PORT: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
      REDIS_PASSWORD: process.env.REDIS_PASSWORD,

      // Stripe
      STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_ENDPOINT_SECRET: process.env.STRIPE_ENDPOINT_SECRET,

      // Google OAuth
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,

      // AI Services
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,

      // Session
      SESSION_SECRET: process.env.SESSION_SECRET,

      // Rate Limiting
      RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) : 900000,
      RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) : 100,

      // Video Processing
      VIDEO_PROCESSING_ENABLED: process.env.VIDEO_PROCESSING_ENABLED === "true",
      HLS_PROCESSING_ENABLED: process.env.HLS_PROCESSING_ENABLED === "true",
      VIDEO_QUALITY_LEVELS: process.env.VIDEO_QUALITY_LEVELS,

      // File Upload
      MAX_FILE_SIZE: process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE, 10) : 104857600,
      MAX_VIDEO_SIZE: process.env.MAX_VIDEO_SIZE ? parseInt(process.env.MAX_VIDEO_SIZE, 10) : 1073741824,

      // Security
      COOKIE_SECURE: process.env.COOKIE_SECURE === "true",
      COOKIE_HTTP_ONLY: process.env.COOKIE_HTTP_ONLY !== "false",
      COOKIE_SAME_SITE: process.env.COOKIE_SAME_SITE || "lax",
      CORS_CREDENTIALS: process.env.CORS_CREDENTIALS === "true",

      // Logging
      ENABLE_DB_LOGGING: process.env.ENABLE_DB_LOGGING === "true",
      LOG_FILE_PATH: process.env.LOG_FILE_PATH || "./logs/app.log",

      // Background Jobs
      ENABLE_JOB_QUEUE: process.env.ENABLE_JOB_QUEUE !== "false",
      JOB_QUEUE_CONCURRENCY: process.env.JOB_QUEUE_CONCURRENCY ? parseInt(process.env.JOB_QUEUE_CONCURRENCY, 10) : 5,

      // Feature Flags
      DEBUG_MODE: process.env.DEBUG_MODE === "true",
      ENABLE_CORS_ALL: process.env.ENABLE_CORS_ALL === "true",
      ENABLE_PERFORMANCE_MONITORING: process.env.ENABLE_PERFORMANCE_MONITORING === "true",
      ENABLE_ERROR_REPORTING: process.env.ENABLE_ERROR_REPORTING === "true",
      ENABLE_METRICS: process.env.ENABLE_METRICS === "true",
      HEALTH_CHECK_ENABLED: process.env.HEALTH_CHECK_ENABLED === "true",
      HELMET_ENABLED: process.env.HELMET_ENABLED === "true",
      CSP_ENABLED: process.env.CSP_ENABLED === "true",

      // CDN
      CDN_ENABLED: process.env.CDN_ENABLED === "true",
      CDN_URL: process.env.CDN_URL,
    };
  }

  private validateConfig(): void {
    const requiredFields = [
      "MONGO_URI",
      "JWT_ACCESS_TOKEN_SECRET",
      "JWT_REFRESH_TOKEN_SECRET",
    ];

    const missingFields = requiredFields.filter(field => !this.config[field as keyof EnvironmentConfig]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required environment variables: ${missingFields.join(", ")}`);
    }

    // Validate environment-specific requirements
    if (this.config.NODE_ENV === "production") {
      const prodRequiredFields = [
        "AWS_ACCESS_KEY_ID",
        "AWS_SECRET_ACCESS_KEY",
        "AWS_S3_BUCKET_NAME",
        "STRIPE_SECRET_KEY",
        "SESSION_SECRET",
        "REDIS_PASSWORD",
      ];

      const missingProdFields = prodRequiredFields.filter(field => !this.config[field as keyof EnvironmentConfig]);

      if (missingProdFields.length > 0) {
        console.warn(`Warning: Missing production environment variables: ${missingProdFields.join(", ")}`);
      }
    }
  }

  get(): EnvironmentConfig {
    return { ...this.config };
  }

  isDevelopment(): boolean {
    return this.config.NODE_ENV === "development";
  }

  isStaging(): boolean {
    return this.config.NODE_ENV === "staging";
  }

  isProduction(): boolean {
    return this.config.NODE_ENV === "production";
  }

  getDbUri(): string {
    return this.config.MONGO_URI;
  }

  getPort(): number {
    return this.config.PORT;
  }

  getCorsOrigins(): string[] {
    const origins = [this.config.FRONTEND_URL];
    
    if (this.config.ADMIN_FRONTEND_URL && this.config.ADMIN_FRONTEND_URL !== this.config.FRONTEND_URL) {
      origins.push(this.config.ADMIN_FRONTEND_URL);
    }

    // Add localhost origins for development
    if (this.isDevelopment()) {
      origins.push("http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173");
    }

    return origins;
  }

  getJwtConfig() {
    return {
      accessTokenSecret: this.config.JWT_ACCESS_TOKEN_SECRET,
      refreshTokenSecret: this.config.JWT_REFRESH_TOKEN_SECRET,
      accessTokenExpiry: this.config.ACCESS_TOKEN_EXPIRY,
      refreshTokenExpiry: this.config.REFRESH_TOKEN_EXPIRY,
    };
  }

  getAwsConfig() {
    return {
      accessKeyId: this.config.AWS_ACCESS_KEY_ID,
      secretAccessKey: this.config.AWS_SECRET_ACCESS_KEY,
      region: this.config.AWS_REGION,
      bucketName: this.config.AWS_S3_BUCKET_NAME,
    };
  }

  getRedisConfig() {
    return {
      url: this.config.REDIS_URL,
      host: this.config.REDIS_HOST,
      port: this.config.REDIS_PORT,
      password: this.config.REDIS_PASSWORD,
    };
  }

  getStripeConfig() {
    return {
      publishableKey: this.config.STRIPE_PUBLISHABLE_KEY,
      secretKey: this.config.STRIPE_SECRET_KEY,
      webhookSecret: this.config.STRIPE_ENDPOINT_SECRET,
    };
  }

  getRateLimitConfig() {
    return {
      windowMs: this.config.RATE_LIMIT_WINDOW_MS,
      maxRequests: this.config.RATE_LIMIT_MAX_REQUESTS,
    };
  }

  getCookieConfig() {
    return {
      secure: this.config.COOKIE_SECURE || this.isProduction(),
      httpOnly: this.config.COOKIE_HTTP_ONLY,
      sameSite: this.config.COOKIE_SAME_SITE as "lax" | "strict" | "none",
    };
  }

  // Feature flag methods
  isFeatureEnabled(feature: keyof EnvironmentConfig): boolean {
    return Boolean(this.config[feature]);
  }

  logConfig(): void {
    const safeConfig = { ...this.config };
    
    // Mask sensitive information
    const sensitiveKeys = [
      "JWT_ACCESS_TOKEN_SECRET",
      "JWT_REFRESH_TOKEN_SECRET",
      "ACCESS_TOKEN_SECRET",
      "REFRESH_TOKEN_SECRET",
      "EMAIL_PASS",
      "AWS_SECRET_ACCESS_KEY",
      "CLOUDINARY_API_SECRET",
      "REDIS_PASSWORD",
      "STRIPE_SECRET_KEY",
      "STRIPE_ENDPOINT_SECRET",
      "GOOGLE_CLIENT_SECRET",
      "GOOGLE_API_KEY",
      "OPENAI_API_KEY",
      "SESSION_SECRET",
    ];

    sensitiveKeys.forEach(key => {
      if (safeConfig[key as keyof EnvironmentConfig]) {
        (safeConfig as any)[key] = "***MASKED***";
      }
    });

    console.log("🌍 Environment Configuration:", JSON.stringify(safeConfig, null, 2));
  }
}

// Export singleton instance
export const environmentService = new EnvironmentService();
export default environmentService;