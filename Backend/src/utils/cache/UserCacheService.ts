import { createClient, RedisClientType } from "@redis/client";
import { UserCacheError } from "../exceptions/UserExceptions";
import { UserValidators } from "../validators/UserValidators";

interface CacheConfig {
  ttl: number; // Time to live in seconds
  prefix: string;
  enabled: boolean;
}

interface CachedBlockStatus {
  isBlocked: boolean;
  blockData?: any;
  userInfo: any;
  cachedAt: string;
  expiresAt: string;
}

export class UserCacheService {
  private static instance: UserCacheService;
  private redisClient: RedisClientType | null = null;
  private isConnected: boolean = false;

  //   private config: CacheConfig = {
  //     ttl: 300, // 5 minutes default TTL
  //     prefix: "user_block_status_",
  //     enabled: process.env.NODE_ENV !== "test", // Disable in tests
  //   };
  private config: CacheConfig = {
    ttl: process.env.USER_CACHE_TTL
      ? parseInt(process.env.USER_CACHE_TTL)
      : 300,
    prefix: process.env.USER_CACHE_PREFIX || "user_block_status_",
    enabled: process.env.USER_CACHE_ENABLED !== "false",
  };

  private constructor() {
    this.initializeRedisClient();
  }

  public static getInstance(): UserCacheService {
    if (!UserCacheService.instance) {
      UserCacheService.instance = new UserCacheService();
    }
    return UserCacheService.instance;
  }

  private async initializeRedisClient(): Promise<void> {
    if (!this.config.enabled) {
      console.log("📦 UserCacheService: Caching disabled");
      return;
    }

    try {
      this.redisClient = createClient({
        url: process.env.REDIS_URL,
        socket: {
          connectTimeout: 5000,
          lazyConnect: true,
        },
      });

      this.redisClient.on("error", (err) => {
        console.error("📦 UserCacheService Redis error:", err.message);
        this.isConnected = false;
      });

      this.redisClient.on("connect", () => {
        console.log("📦 UserCacheService: Redis connected");
        this.isConnected = true;
      });

      this.redisClient.on("disconnect", () => {
        console.log("📦 UserCacheService: Redis disconnected");
        this.isConnected = false;
      });

      await this.redisClient.connect();
      console.log("✅ UserCacheService: Initialized successfully");
    } catch (error: any) {
      console.error(
        "❌ UserCacheService: Failed to initialize Redis:",
        error.message
      );
      this.isConnected = false;
      // Don't throw - graceful degradation
    }
  }

  /**
   * Generate cache key for user block status
   */
  private generateCacheKey(userId: string): string {
    const sanitizedUserId = UserValidators.sanitizeUserId(userId);
    UserValidators.validateUserId(sanitizedUserId);

    const cacheKey = `${this.config.prefix}${sanitizedUserId}`;
    UserValidators.validateCacheKey(cacheKey);

    return cacheKey;
  }

  /**
   * Get cached block status
   */
  async getBlockStatus(userId: string): Promise<CachedBlockStatus | null> {
    if (!this.config.enabled || !this.isConnected || !this.redisClient) {
      console.log("📦 UserCacheService: Cache not available, skipping get");
      return null;
    }

    try {
      const cacheKey = this.generateCacheKey(userId);
      console.log("📦 UserCacheService: Getting cache for key:", cacheKey);

      const cachedData = await this.redisClient.get(cacheKey);

      if (!cachedData) {
        console.log("📦 UserCacheService: Cache miss for user:", userId);
        return null;
      }

      const parsed: CachedBlockStatus = JSON.parse(cachedData);

      // Check if cache is expired (additional safety check)
      const now = new Date();
      const expiresAt = new Date(parsed.expiresAt);

      if (now > expiresAt) {
        console.log("📦 UserCacheService: Cache expired for user:", userId);
        await this.deleteBlockStatus(userId); // Clean up expired cache
        return null;
      }

      console.log("✅ UserCacheService: Cache hit for user:", userId);
      return parsed;
    } catch (error: any) {
      console.error(
        "❌ UserCacheService: Get operation failed:",
        error.message
      );

      // For monitoring - log but don't throw
      if (process.env.NODE_ENV === "production") {
        // Here you could send to monitoring service like Sentry
        console.error("Cache get error details:", {
          userId,
          error: error.message,
          stack: error.stack,
        });
      }

      return null; // Graceful degradation
    }
  }

  /**
   * Set cached block status
   */
  async setBlockStatus(
    userId: string,
    blockStatus: Omit<CachedBlockStatus, "cachedAt" | "expiresAt">
  ): Promise<boolean> {
    if (!this.config.enabled || !this.isConnected || !this.redisClient) {
      console.log("📦 UserCacheService: Cache not available, skipping set");
      return false;
    }

    try {
      const cacheKey = this.generateCacheKey(userId);
      const now = new Date();
      const expiresAt = new Date(now.getTime() + this.config.ttl * 1000);

      const cacheData: CachedBlockStatus = {
        ...blockStatus,
        cachedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
      };

      console.log("📦 UserCacheService: Setting cache for key:", cacheKey);

      await this.redisClient.setEx(
        cacheKey,
        this.config.ttl,
        JSON.stringify(cacheData)
      );

      console.log(
        "✅ UserCacheService: Cache set successfully for user:",
        userId
      );
      return true;
    } catch (error: any) {
      console.error(
        "❌ UserCacheService: Set operation failed:",
        error.message
      );

      // Don't throw - graceful degradation
      if (process.env.NODE_ENV === "production") {
        console.error("Cache set error details:", {
          userId,
          error: error.message,
          stack: error.stack,
        });
      }

      return false;
    }
  }

  /**
   * Delete cached block status
   */
  async deleteBlockStatus(userId: string): Promise<boolean> {
    if (!this.config.enabled || !this.isConnected || !this.redisClient) {
      return false;
    }

    try {
      const cacheKey = this.generateCacheKey(userId);
      console.log("📦 UserCacheService: Deleting cache for key:", cacheKey);

      const result = await this.redisClient.del(cacheKey);

      console.log("✅ UserCacheService: Cache deleted for user:", userId);
      return result > 0;
    } catch (error: any) {
      console.error(
        "❌ UserCacheService: Delete operation failed:",
        error.message
      );
      return false;
    }
  }

  /**
   * Invalidate cache when user is blocked/unblocked
   */
  async invalidateUserCache(userId: string): Promise<void> {
    console.log("🗑️ UserCacheService: Invalidating cache for user:", userId);
    await this.deleteBlockStatus(userId);
  }

  /**
   * Health check for cache service
   */
  async healthCheck(): Promise<{
    isConnected: boolean;
    redisStatus: string;
    cacheEnabled: boolean;
  }> {
    let redisStatus = "disconnected";

    if (this.isConnected && this.redisClient) {
      try {
        await this.redisClient.ping();
        redisStatus = "connected";
      } catch (error) {
        redisStatus = "error";
        this.isConnected = false;
      }
    }

    return {
      isConnected: this.isConnected,
      redisStatus,
      cacheEnabled: this.config.enabled,
    };
  }

  /**
   * Close Redis connection
   */
  async disconnect(): Promise<void> {
    if (this.redisClient) {
      await this.redisClient.quit();
      this.isConnected = false;
      console.log("📦 UserCacheService: Disconnected from Redis");
    }
  }
}
