// Environment Configuration Service for Frontend
export interface EnvironmentConfig {
  // Environment
  NODE_ENV: string;
  APP_ENV: string;

  // API Configuration
  API_URL: string;
  ADMIN_API_URL: string;
  SOCKET_URL: string;

  // AWS S3
  AWS_REGION: string;
  S3_BUCKET_NAME: string;

  // Stripe
  STRIPE_PUBLISHABLE_KEY?: string;

  // Google OAuth
  GOOGLE_CLIENT_ID?: string;

  // Firebase
  FIREBASE_API_KEY?: string;
  FIREBASE_AUTH_DOMAIN?: string;
  FIREBASE_PROJECT_ID?: string;
  FIREBASE_STORAGE_BUCKET?: string;
  FIREBASE_MESSAGING_SENDER_ID?: string;
  FIREBASE_APP_ID?: string;

  // Feature Flags
  ENABLE_PWA: boolean;
  ENABLE_ANALYTICS: boolean;
  ENABLE_NOTIFICATIONS: boolean;
  ENABLE_VIDEO_UPLOAD: boolean;
  ENABLE_HLS_STREAMING: boolean;
  ENABLE_MOCK_DATA: boolean;
  ENABLE_API_MOCKING: boolean;

  // CDN
  CDN_URL?: string;

  // App
  APP_NAME: string;
  APP_VERSION: string;
  APP_DESCRIPTION: string;

  // Theme
  DEFAULT_THEME: string;
  THEME_PERSISTENCE: boolean;

  // Video
  MAX_VIDEO_SIZE: number;
  SUPPORTED_VIDEO_FORMATS: string[];
  VIDEO_CHUNK_SIZE: number;
  VIDEO_QUALITY_OPTIONS: string[];

  // File Upload
  MAX_FILE_SIZE: number;
  SUPPORTED_IMAGE_FORMATS: string[];
  SUPPORTED_DOCUMENT_FORMATS: string[];

  // Security
  ENABLE_CONTENT_SECURITY_POLICY: boolean;
  SECURE_COOKIES: boolean;
  ENABLE_CSRF_PROTECTION: boolean;

  // Debug
  DEBUG_MODE: boolean;
  LOG_LEVEL: string;
  ENABLE_REDUX_DEVTOOLS: boolean;
  ENABLE_PERFORMANCE_MONITORING: boolean;
  SHOW_ERROR_DETAILS: boolean;

  // Performance
  ENABLE_LAZY_LOADING: boolean;
  ENABLE_CODE_SPLITTING: boolean;
  ENABLE_SERVICE_WORKER: boolean;
  ENABLE_HOT_RELOAD: boolean;

  // Environment-specific features
  ENABLE_STAGING_BANNER?: boolean;
  STAGING_PASSWORD_REQUIRED?: boolean;
  ENABLE_FEATURE_TOGGLES?: boolean;
  BETA_FEATURES_ENABLED?: boolean;
  ENABLE_ERROR_REPORTING?: boolean;
  ENABLE_CRASH_REPORTING?: boolean;
  ENABLE_USER_FEEDBACK?: boolean;
  MINIFY_ASSETS?: boolean;
  OPTIMIZE_IMAGES?: boolean;
  ENABLE_SEO_OPTIMIZATION?: boolean;
  SITEMAP_GENERATION?: boolean;
  ROBOTS_TXT_GENERATION?: boolean;
  ENABLE_REAL_USER_MONITORING?: boolean;
  ENABLE_SYNTHETIC_MONITORING?: boolean;

  // Development-specific
  DEV_SERVER_PORT?: number;
  DEV_SERVER_HOST?: string;
  ENABLE_MOCK_PAYMENTS?: boolean;
  BYPASS_AUTH_FOR_TESTING?: boolean;
  SIMULATE_SLOW_NETWORK?: boolean;
}

class EnvironmentService {
  private config: EnvironmentConfig;

  constructor() {
    this.config = this.loadConfig();
    this.validateConfig();
  }

  private loadConfig(): EnvironmentConfig {
    const env = import.meta.env;

    return {
      // Environment
      NODE_ENV: env.NODE_ENV || "development",
      APP_ENV: env.VITE_APP_ENV || "development",

      // API Configuration
      API_URL: env.VITE_API_URL || "http://localhost:5002",
      ADMIN_API_URL: env.VITE_ADMIN_API_URL || "http://localhost:5002",
      SOCKET_URL: env.VITE_SOCKET_URL || "http://localhost:5002",

      // AWS S3
      AWS_REGION: env.VITE_AWS_REGION || "us-east-1",
      S3_BUCKET_NAME: env.VITE_S3_BUCKET_NAME || "",

      // Stripe
      STRIPE_PUBLISHABLE_KEY: env.VITE_STRIPE_PUBLISHABLE_KEY,

      // Google OAuth
      GOOGLE_CLIENT_ID: env.VITE_GOOGLE_CLIENT_ID,

      // Firebase
      FIREBASE_API_KEY: env.VITE_FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: env.VITE_FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: env.VITE_FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: env.VITE_FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: env.VITE_FIREBASE_APP_ID,

      // Feature Flags
      ENABLE_PWA: env.VITE_ENABLE_PWA === "true",
      ENABLE_ANALYTICS: env.VITE_ENABLE_ANALYTICS === "true",
      ENABLE_NOTIFICATIONS: env.VITE_ENABLE_NOTIFICATIONS === "true",
      ENABLE_VIDEO_UPLOAD: env.VITE_ENABLE_VIDEO_UPLOAD !== "false",
      ENABLE_HLS_STREAMING: env.VITE_ENABLE_HLS_STREAMING === "true",
      ENABLE_MOCK_DATA: env.VITE_ENABLE_MOCK_DATA === "true",
      ENABLE_API_MOCKING: env.VITE_ENABLE_API_MOCKING === "true",

      // CDN
      CDN_URL: env.VITE_CDN_URL,

      // App
      APP_NAME: env.VITE_APP_NAME || "MentorOne",
      APP_VERSION: env.VITE_APP_VERSION || "1.0.0",
      APP_DESCRIPTION: env.VITE_APP_DESCRIPTION || "Professional Mentoring Platform",

      // Theme
      DEFAULT_THEME: env.VITE_DEFAULT_THEME || "light",
      THEME_PERSISTENCE: env.VITE_THEME_PERSISTENCE !== "false",

      // Video
      MAX_VIDEO_SIZE: parseInt(env.VITE_MAX_VIDEO_SIZE || "1073741824", 10), // 1GB default
      SUPPORTED_VIDEO_FORMATS: env.VITE_SUPPORTED_VIDEO_FORMATS?.split(",") || ["mp4", "webm", "avi"],
      VIDEO_CHUNK_SIZE: parseInt(env.VITE_VIDEO_CHUNK_SIZE || "1048576", 10), // 1MB default
      VIDEO_QUALITY_OPTIONS: env.VITE_VIDEO_QUALITY_OPTIONS?.split(",") || ["720p", "480p", "360p"],

      // File Upload
      MAX_FILE_SIZE: parseInt(env.VITE_MAX_FILE_SIZE || "104857600", 10), // 100MB default
      SUPPORTED_IMAGE_FORMATS: env.VITE_SUPPORTED_IMAGE_FORMATS?.split(",") || ["jpg", "jpeg", "png", "gif", "webp"],
      SUPPORTED_DOCUMENT_FORMATS: env.VITE_SUPPORTED_DOCUMENT_FORMATS?.split(",") || ["pdf", "doc", "docx", "txt"],

      // Security
      ENABLE_CONTENT_SECURITY_POLICY: env.VITE_ENABLE_CONTENT_SECURITY_POLICY === "true",
      SECURE_COOKIES: env.VITE_SECURE_COOKIES === "true",
      ENABLE_CSRF_PROTECTION: env.VITE_ENABLE_CSRF_PROTECTION === "true",

      // Debug
      DEBUG_MODE: env.VITE_DEBUG_MODE === "true",
      LOG_LEVEL: env.VITE_LOG_LEVEL || "info",
      ENABLE_REDUX_DEVTOOLS: env.VITE_ENABLE_REDUX_DEVTOOLS === "true",
      ENABLE_PERFORMANCE_MONITORING: env.VITE_ENABLE_PERFORMANCE_MONITORING === "true",
      SHOW_ERROR_DETAILS: env.VITE_SHOW_ERROR_DETAILS === "true",

      // Performance
      ENABLE_LAZY_LOADING: env.VITE_ENABLE_LAZY_LOADING !== "false",
      ENABLE_CODE_SPLITTING: env.VITE_ENABLE_CODE_SPLITTING !== "false",
      ENABLE_SERVICE_WORKER: env.VITE_ENABLE_SERVICE_WORKER === "true",
      ENABLE_HOT_RELOAD: env.VITE_ENABLE_HOT_RELOAD === "true",

      // Environment-specific features
      ENABLE_STAGING_BANNER: env.VITE_ENABLE_STAGING_BANNER === "true",
      STAGING_PASSWORD_REQUIRED: env.VITE_STAGING_PASSWORD_REQUIRED === "true",
      ENABLE_FEATURE_TOGGLES: env.VITE_ENABLE_FEATURE_TOGGLES === "true",
      BETA_FEATURES_ENABLED: env.VITE_BETA_FEATURES_ENABLED === "true",
      ENABLE_ERROR_REPORTING: env.VITE_ENABLE_ERROR_REPORTING === "true",
      ENABLE_CRASH_REPORTING: env.VITE_ENABLE_CRASH_REPORTING === "true",
      ENABLE_USER_FEEDBACK: env.VITE_ENABLE_USER_FEEDBACK === "true",
      MINIFY_ASSETS: env.VITE_MINIFY_ASSETS === "true",
      OPTIMIZE_IMAGES: env.VITE_OPTIMIZE_IMAGES === "true",
      ENABLE_SEO_OPTIMIZATION: env.VITE_ENABLE_SEO_OPTIMIZATION === "true",
      SITEMAP_GENERATION: env.VITE_SITEMAP_GENERATION === "true",
      ROBOTS_TXT_GENERATION: env.VITE_ROBOTS_TXT_GENERATION === "true",
      ENABLE_REAL_USER_MONITORING: env.VITE_ENABLE_REAL_USER_MONITORING === "true",
      ENABLE_SYNTHETIC_MONITORING: env.VITE_ENABLE_SYNTHETIC_MONITORING === "true",

      // Development-specific
      DEV_SERVER_PORT: env.VITE_DEV_SERVER_PORT ? parseInt(env.VITE_DEV_SERVER_PORT, 10) : 5173,
      DEV_SERVER_HOST: env.VITE_DEV_SERVER_HOST || "localhost",
      ENABLE_MOCK_PAYMENTS: env.VITE_ENABLE_MOCK_PAYMENTS === "true",
      BYPASS_AUTH_FOR_TESTING: env.VITE_BYPASS_AUTH_FOR_TESTING === "true",
      SIMULATE_SLOW_NETWORK: env.VITE_SIMULATE_SLOW_NETWORK === "true",
    };
  }

  private validateConfig(): void {
    const requiredFields = [
      "API_URL",
      "APP_NAME",
    ];

    const missingFields = requiredFields.filter(field => !this.config[field as keyof EnvironmentConfig]);

    if (missingFields.length > 0) {
      console.warn(`Missing environment variables: ${missingFields.join(", ")}`);
    }

    // Environment-specific validations
    if (this.isProduction()) {
      const prodRequiredFields = [
        "STRIPE_PUBLISHABLE_KEY",
        "S3_BUCKET_NAME",
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
    return this.config.NODE_ENV === "development" || this.config.APP_ENV === "development";
  }

  isStaging(): boolean {
    return this.config.NODE_ENV === "staging" || this.config.APP_ENV === "staging";
  }

  isProduction(): boolean {
    return this.config.NODE_ENV === "production" || this.config.APP_ENV === "production";
  }

  getApiUrl(): string {
    return this.config.API_URL;
  }

  getSocketUrl(): string {
    return this.config.SOCKET_URL;
  }

  getAwsConfig() {
    return {
      region: this.config.AWS_REGION,
      bucketName: this.config.S3_BUCKET_NAME,
    };
  }

  getStripeConfig() {
    return {
      publishableKey: this.config.STRIPE_PUBLISHABLE_KEY,
    };
  }

  getFirebaseConfig() {
    return {
      apiKey: this.config.FIREBASE_API_KEY,
      authDomain: this.config.FIREBASE_AUTH_DOMAIN,
      projectId: this.config.FIREBASE_PROJECT_ID,
      storageBucket: this.config.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: this.config.FIREBASE_MESSAGING_SENDER_ID,
      appId: this.config.FIREBASE_APP_ID,
    };
  }

  getVideoConfig() {
    return {
      maxSize: this.config.MAX_VIDEO_SIZE,
      supportedFormats: this.config.SUPPORTED_VIDEO_FORMATS,
      chunkSize: this.config.VIDEO_CHUNK_SIZE,
      qualityOptions: this.config.VIDEO_QUALITY_OPTIONS,
    };
  }

  getFileUploadConfig() {
    return {
      maxSize: this.config.MAX_FILE_SIZE,
      supportedImageFormats: this.config.SUPPORTED_IMAGE_FORMATS,
      supportedDocumentFormats: this.config.SUPPORTED_DOCUMENT_FORMATS,
    };
  }

  getThemeConfig() {
    return {
      defaultTheme: this.config.DEFAULT_THEME,
      persistence: this.config.THEME_PERSISTENCE,
    };
  }

  // Feature flag methods
  isFeatureEnabled(feature: keyof EnvironmentConfig): boolean {
    return Boolean(this.config[feature]);
  }

  // URL builders
  buildApiUrl(path: string): string {
    return `${this.config.API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  }

  buildSocketUrl(namespace: string = ""): string {
    return `${this.config.SOCKET_URL}${namespace}`;
  }

  buildCdnUrl(path: string): string {
    if (!this.config.CDN_URL) return path;
    return `${this.config.CDN_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  }

  // Utility methods
  getLogLevel(): string {
    return this.config.LOG_LEVEL;
  }

  shouldShowErrorDetails(): boolean {
    return this.config.SHOW_ERROR_DETAILS || this.isDevelopment();
  }

  shouldEnableReduxDevtools(): boolean {
    return this.config.ENABLE_REDUX_DEVTOOLS || this.isDevelopment();
  }

  getAppInfo() {
    return {
      name: this.config.APP_NAME,
      version: this.config.APP_VERSION,
      description: this.config.APP_DESCRIPTION,
      environment: this.config.APP_ENV,
    };
  }

  logConfig(): void {
    const safeConfig = { ...this.config };
    
    // Mask sensitive information
    const sensitiveKeys = [
      "STRIPE_PUBLISHABLE_KEY",
      "GOOGLE_CLIENT_ID",
      "FIREBASE_API_KEY",
      "FIREBASE_APP_ID",
    ];

    sensitiveKeys.forEach(key => {
      if (safeConfig[key as keyof EnvironmentConfig]) {
        (safeConfig as any)[key] = "***MASKED***";
      }
    });

    console.log("🌍 Frontend Environment Configuration:", safeConfig);
  }

  // Environment banner for non-production environments
  getEnvironmentBanner(): string | null {
    if (this.isProduction()) return null;
    
    const env = this.config.APP_ENV.toUpperCase();
    const colors = {
      DEVELOPMENT: "#10B981", // Green
      STAGING: "#F59E0B",     // Amber
    };

    return `🚧 ${env} ENVIRONMENT - ${colors[env as keyof typeof colors] || "#6B7280"}`;
  }
}

// Export singleton instance
export const environmentService = new EnvironmentService();
export default environmentService;

// Export individual config getters for convenience
export const {
  isDevelopment,
  isStaging,
  isProduction,
  getApiUrl,
  getSocketUrl,
  isFeatureEnabled,
  buildApiUrl,
  buildSocketUrl,
  buildCdnUrl,
} = environmentService;