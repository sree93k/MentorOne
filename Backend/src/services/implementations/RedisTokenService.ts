// // // // // import {
// // // // //   RedisClientType,
// // // // //   RedisModules,
// // // // //   RedisFunctions,
// // // // //   RedisScripts,
// // // // // } from "@redis/client";
// // // // // import bcrypt from "bcryptjs";
// // // // // import { tokenClient } from "../../server"; // Import from your main server file

// // // // // export class RedisTokenService {
// // // // //   private redis: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;

// // // // //   constructor() {
// // // // //     this.redis = tokenClient; // Use the existing token client
// // // // //   }

// // // // //   async saveRefreshToken(
// // // // //     userId: string,
// // // // //     refreshToken: string,
// // // // //     expiresInDays: number = 7
// // // // //   ): Promise<void> {
// // // // //     try {
// // // // //       const hashedToken = await bcrypt.hash(refreshToken, 10);
// // // // //       const key = `refresh_token:${userId}`;
// // // // //       const expirationSeconds = expiresInDays * 24 * 60 * 60;

// // // // //       await this.redis.setEx(key, expirationSeconds, hashedToken);
// // // // //       console.log(`Refresh token saved for user: ${userId}`);
// // // // //     } catch (error) {
// // // // //       console.error("Error saving refresh token to Redis:", error);
// // // // //       throw new Error("Failed to save refresh token");
// // // // //     }
// // // // //   }

// // // // //   async verifyRefreshToken(
// // // // //     userId: string,
// // // // //     refreshToken: string
// // // // //   ): Promise<boolean> {
// // // // //     try {
// // // // //       const key = `refresh_token:${userId}`;
// // // // //       const hashedToken = await this.redis.get(key);

// // // // //       if (!hashedToken) {
// // // // //         console.log(`No refresh token found for user: ${userId}`);
// // // // //         return false;
// // // // //       }

// // // // //       const isValid = await bcrypt.compare(refreshToken, hashedToken);
// // // // //       console.log(`Token verification for user ${userId}:`, isValid);

// // // // //       return isValid;
// // // // //     } catch (error) {
// // // // //       console.error("Error verifying refresh token:", error);
// // // // //       return false;
// // // // //     }
// // // // //   }

// // // // //   async removeRefreshToken(userId: string): Promise<boolean> {
// // // // //     try {
// // // // //       const key = `refresh_token:${userId}`;
// // // // //       const result = await this.redis.del(key);

// // // // //       console.log(`Refresh token removed for user: ${userId}`);
// // // // //       return result === 1;
// // // // //     } catch (error) {
// // // // //       console.error("Error removing refresh token:", error);
// // // // //       return false;
// // // // //     }
// // // // //   }

// // // // //   async getTokenTTL(userId: string): Promise<number> {
// // // // //     try {
// // // // //       const key = `refresh_token:${userId}`;
// // // // //       return await this.redis.ttl(key);
// // // // //     } catch (error) {
// // // // //       console.error("Error getting token TTL:", error);
// // // // //       return -1;
// // // // //     }
// // // // //   }

// // // // //   // Multi-device support
// // // // //   async saveDeviceRefreshToken(
// // // // //     userId: string,
// // // // //     deviceId: string,
// // // // //     refreshToken: string,
// // // // //     expiresInDays: number = 7
// // // // //   ): Promise<void> {
// // // // //     try {
// // // // //       const hashedToken = await bcrypt.hash(refreshToken, 10);
// // // // //       const key = `refresh_token:${userId}:${deviceId}`;
// // // // //       const expirationSeconds = expiresInDays * 24 * 60 * 60;

// // // // //       await this.redis.setEx(key, expirationSeconds, hashedToken);
// // // // //       await this.redis.sAdd(`user_devices:${userId}`, deviceId);

// // // // //       console.log(
// // // // //         `Device refresh token saved for user: ${userId}, device: ${deviceId}`
// // // // //       );
// // // // //     } catch (error) {
// // // // //       console.error("Error saving device refresh token:", error);
// // // // //       throw new Error("Failed to save device refresh token");
// // // // //     }
// // // // //   }

// // // // //   async verifyDeviceRefreshToken(
// // // // //     userId: string,
// // // // //     deviceId: string,
// // // // //     refreshToken: string
// // // // //   ): Promise<boolean> {
// // // // //     try {
// // // // //       const key = `refresh_token:${userId}:${deviceId}`;
// // // // //       const hashedToken = await this.redis.get(key);

// // // // //       if (!hashedToken) {
// // // // //         return false;
// // // // //       }

// // // // //       return await bcrypt.compare(refreshToken, hashedToken);
// // // // //     } catch (error) {
// // // // //       console.error("Error verifying device refresh token:", error);
// // // // //       return false;
// // // // //     }
// // // // //   }

// // // // //   async removeAllUserTokens(userId: string): Promise<boolean> {
// // // // //     try {
// // // // //       const devices = await this.redis.sMembers(`user_devices:${userId}`);

// // // // //       const pipeline = this.redis.multi();

// // // // //       // Remove single user token
// // // // //       pipeline.del(`refresh_token:${userId}`);

// // // // //       // Remove all device tokens
// // // // //       devices.forEach((deviceId) => {
// // // // //         pipeline.del(`refresh_token:${userId}:${deviceId}`);
// // // // //       });

// // // // //       // Remove device list
// // // // //       pipeline.del(`user_devices:${userId}`);

// // // // //       await pipeline.exec();

// // // // //       console.log(`All tokens removed for user: ${userId}`);
// // // // //       return true;
// // // // //     } catch (error) {
// // // // //       console.error("Error removing all user tokens:", error);
// // // // //       return false;
// // // // //     }
// // // // //   }
// // // // // }

// // // // // export default new RedisTokenService();
// // // // import {
// // // //   RedisClientType,
// // // //   RedisModules,
// // // //   RedisFunctions,
// // // //   RedisScripts,
// // // // } from "@redis/client";
// // // // import bcrypt from "bcryptjs";
// // // // import { tokenClient } from "../../server";

// // // // export class RedisTokenService {
// // // //   private redis: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;

// // // //   constructor() {
// // // //     this.redis = tokenClient;
// // // //   }

// // // //   async saveRefreshToken(
// // // //     userId: string,
// // // //     refreshToken: string,
// // // //     expiresInMinutes: number = 5 // Changed to minutes for short-lived tokens
// // // //   ): Promise<void> {
// // // //     try {
// // // //       const hashedToken = await bcrypt.hash(refreshToken, 10);
// // // //       const key = `refresh_token:${userId}`;
// // // //       const expirationSeconds = expiresInMinutes * 60; // Convert to seconds

// // // //       await this.redis.setEx(key, expirationSeconds, hashedToken);
// // // //       console.log(
// // // //         `Refresh token saved for user: ${userId}, expires in ${expiresInMinutes} minutes`
// // // //       );
// // // //     } catch (error) {
// // // //       console.error("Error saving refresh token to Redis:", error);
// // // //       throw new Error("Failed to save refresh token");
// // // //     }
// // // //   }

// // // //   async verifyRefreshToken(
// // // //     userId: string,
// // // //     refreshToken: string
// // // //   ): Promise<boolean> {
// // // //     try {
// // // //       const key = `refresh_token:${userId}`;
// // // //       const hashedToken = await this.redis.get(key);

// // // //       if (!hashedToken) {
// // // //         console.log(`No refresh token found for user: ${userId}`);
// // // //         return false;
// // // //       }

// // // //       const isValid = await bcrypt.compare(refreshToken, hashedToken);
// // // //       console.log(`Token verification for user ${userId}:`, isValid);

// // // //       return isValid;
// // // //     } catch (error) {
// // // //       console.error("Error verifying refresh token:", error);
// // // //       return false;
// // // //     }
// // // //   }

// // // //   async removeRefreshToken(userId: string): Promise<boolean> {
// // // //     try {
// // // //       const key = `refresh_token:${userId}`;
// // // //       const result = await this.redis.del(key);

// // // //       console.log(`Refresh token removed for user: ${userId}`);
// // // //       return result === 1;
// // // //     } catch (error) {
// // // //       console.error("Error removing refresh token:", error);
// // // //       return false;
// // // //     }
// // // //   }

// // // //   async getTokenTTL(userId: string): Promise<number> {
// // // //     try {
// // // //       const key = `refresh_token:${userId}`;
// // // //       return await this.redis.ttl(key);
// // // //     } catch (error) {
// // // //       console.error("Error getting token TTL:", error);
// // // //       return -1;
// // // //     }
// // // //   }

// // // //   async removeAllUserTokens(userId: string): Promise<boolean> {
// // // //     try {
// // // //       const devices = await this.redis.sMembers(`user_devices:${userId}`);

// // // //       const pipeline = this.redis.multi();

// // // //       // Remove single user token
// // // //       pipeline.del(`refresh_token:${userId}`);

// // // //       // Remove all device tokens
// // // //       devices.forEach((deviceId) => {
// // // //         pipeline.del(`refresh_token:${userId}:${deviceId}`);
// // // //       });

// // // //       // Remove device list
// // // //       pipeline.del(`user_devices:${userId}`);

// // // //       await pipeline.exec();

// // // //       console.log(`All tokens removed for user: ${userId}`);
// // // //       return true;
// // // //     } catch (error) {
// // // //       console.error("Error removing all user tokens:", error);
// // // //       return false;
// // // //     }
// // // //   }
// // // // }

// // // // export default new RedisTokenService();
// // // import {
// // //   RedisClientType,
// // //   RedisModules,
// // //   RedisFunctions,
// // //   RedisScripts,
// // // } from "@redis/client";
// // // import bcrypt from "bcryptjs";
// // // import { tokenClient } from "../../server";

// // // export class RedisTokenService {
// // //   private redis: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;

// // //   constructor() {
// // //     this.redis = tokenClient;
// // //   }

// // //   async saveRefreshToken(
// // //     userId: string,
// // //     refreshToken: string,
// // //     expiresInMinutes: number = 2 // 2 minutes for testing
// // //   ): Promise<void> {
// // //     try {
// // //       const hashedToken = await bcrypt.hash(refreshToken, 10);
// // //       const key = `refresh_token:${userId}`;
// // //       const expirationSeconds = expiresInMinutes * 60;

// // //       await this.redis.setEx(key, expirationSeconds, hashedToken);
// // //       console.log(
// // //         `💾 Refresh token saved for user: ${userId}, expires in ${expiresInMinutes} minutes`
// // //       );
// // //     } catch (error) {
// // //       console.error("🚨 Error saving refresh token to Redis:", error);
// // //       throw new Error("Failed to save refresh token");
// // //     }
// // //   }

// // //   async verifyRefreshToken(
// // //     userId: string,
// // //     refreshToken: string
// // //   ): Promise<boolean> {
// // //     try {
// // //       const key = `refresh_token:${userId}`;
// // //       const hashedToken = await this.redis.get(key);

// // //       if (!hashedToken) {
// // //         console.log(`❌ No refresh token found for user: ${userId}`);
// // //         return false;
// // //       }

// // //       const isValid = await bcrypt.compare(refreshToken, hashedToken);
// // //       console.log(`🔍 Token verification for user ${userId}:`, isValid);

// // //       return isValid;
// // //     } catch (error) {
// // //       console.error("🚨 Error verifying refresh token:", error);
// // //       return false;
// // //     }
// // //   }

// // //   async removeRefreshToken(userId: string): Promise<boolean> {
// // //     try {
// // //       const key = `refresh_token:${userId}`;
// // //       const result = await this.redis.del(key);

// // //       console.log(`🗑️ Refresh token removed for user: ${userId}`);
// // //       return result === 1;
// // //     } catch (error) {
// // //       console.error("🚨 Error removing refresh token:", error);
// // //       return false;
// // //     }
// // //   }

// // //   async getTokenTTL(userId: string): Promise<number> {
// // //     try {
// // //       const key = `refresh_token:${userId}`;
// // //       const ttl = await this.redis.ttl(key);
// // //       console.log(`⏰ Token TTL for user ${userId}: ${ttl} seconds`);
// // //       return ttl;
// // //     } catch (error) {
// // //       console.error("🚨 Error getting token TTL:", error);
// // //       return -1;
// // //     }
// // //   }

// // //   async removeAllUserTokens(userId: string): Promise<boolean> {
// // //     try {
// // //       const devices = await this.redis.sMembers(`user_devices:${userId}`);

// // //       const pipeline = this.redis.multi();
// // //       pipeline.del(`refresh_token:${userId}`);

// // //       devices.forEach((deviceId) => {
// // //         pipeline.del(`refresh_token:${userId}:${deviceId}`);
// // //       });

// // //       pipeline.del(`user_devices:${userId}`);
// // //       await pipeline.exec();

// // //       console.log(`🧹 All tokens removed for user: ${userId}`);
// // //       return true;
// // //     } catch (error) {
// // //       console.error("🚨 Error removing all user tokens:", error);
// // //       return false;
// // //     }
// // //   }
// // // }

// // // export default new RedisTokenService();
// // // RedisTokenService.ts - Self-contained version (RECOMMENDED)
// // import {
// //   createClient,
// //   RedisClientType,
// //   RedisModules,
// //   RedisFunctions,
// //   RedisScripts,
// // } from "@redis/client";
// // import bcrypt from "bcryptjs";

// // export class RedisTokenService {
// //   private redis: RedisClientType<
// //     RedisModules,
// //     RedisFunctions,
// //     RedisScripts
// //   > | null = null;
// //   private isConnected = false;
// //   private connectionPromise: Promise<void> | null = null;

// //   constructor() {
// //     console.log(
// //       "🔧 RedisTokenService constructor - will create own Redis client"
// //     );
// //   }

// //   private async initializeRedis(): Promise<void> {
// //     if (this.connectionPromise) {
// //       return this.connectionPromise;
// //     }

// //     this.connectionPromise = this._initializeRedis();
// //     return this.connectionPromise;
// //   }

// //   private async _initializeRedis(): Promise<void> {
// //     try {
// //       if (this.redis && this.isConnected) {
// //         return; // Already connected
// //       }

// //       console.log("🔧 Creating dedicated Redis client for tokens");

// //       // Create our own Redis client for tokens
// //       this.redis = createClient({
// //         url: process.env.REDIS_URL || "redis://localhost:6379",
// //         database: 1, // Use database 1 for tokens (separate from main app)
// //       });

// //       // Set up event handlers
// //       this.redis.on("error", (err) => {
// //         console.error("❌ Redis Token Client Error:", err);
// //         this.isConnected = false;
// //       });

// //       this.redis.on("connect", () => {
// //         console.log("✅ Redis Token Client connected");
// //       });

// //       this.redis.on("ready", () => {
// //         console.log("🚀 Redis Token Client ready");
// //         this.isConnected = true;
// //       });

// //       this.redis.on("end", () => {
// //         console.log("📤 Redis Token Client disconnected");
// //         this.isConnected = false;
// //       });

// //       // Connect to Redis
// //       await this.redis.connect();

// //       // Test the connection
// //       const pingResult = await this.redis.ping();
// //       console.log(`✅ Redis Token Client ping: ${pingResult}`);

// //       this.isConnected = true;
// //       console.log("✅ RedisTokenService initialized with dedicated client");
// //     } catch (error) {
// //       console.error("❌ Failed to initialize Redis token client:", error);
// //       this.isConnected = false;
// //       this.connectionPromise = null;
// //       throw error;
// //     }
// //   }

// //   private async ensureConnection(): Promise<void> {
// //     if (!this.isConnected || !this.redis) {
// //       await this.initializeRedis();
// //     }

// //     if (!this.redis) {
// //       throw new Error("Redis client initialization failed");
// //     }

// //     // Double-check connection with ping
// //     try {
// //       await this.redis.ping();
// //     } catch (pingError) {
// //       console.error("❌ Redis ping failed, reconnecting...");
// //       this.isConnected = false;
// //       this.connectionPromise = null;
// //       await this.initializeRedis();
// //     }
// //   }

// //   async saveRefreshToken(
// //     userId: string,
// //     refreshToken: string,
// //     expiresInMinutes: number = 2
// //   ): Promise<void> {
// //     try {
// //       console.log(`💾 Attempting to save refresh token for user: ${userId}`);
// //       await this.ensureConnection();

// //       const hashedToken = await bcrypt.hash(refreshToken, 10);
// //       const key = `refresh_token:${userId}`;
// //       const expirationSeconds = expiresInMinutes * 60;

// //       await this.redis!.setEx(key, expirationSeconds, hashedToken);
// //       console.log(
// //         `✅ Refresh token saved for user: ${userId}, expires in ${expiresInMinutes} minutes`
// //       );

// //       // Verify it was saved
// //       const ttl = await this.redis!.ttl(key);
// //       console.log(`🔍 Verified: TTL for ${key} is ${ttl} seconds`);
// //     } catch (error) {
// //       console.error("🚨 Error saving refresh token to Redis:", error);
// //       throw new Error(`Failed to save refresh token: ${error.message}`);
// //     }
// //   }

// //   async verifyRefreshToken(
// //     userId: string,
// //     refreshToken: string
// //   ): Promise<boolean> {
// //     try {
// //       console.log(`🔍 Verifying refresh token for user: ${userId}`);
// //       await this.ensureConnection();

// //       const key = `refresh_token:${userId}`;
// //       console.log(`🔑 Looking for key: ${key}`);

// //       // Check if key exists first
// //       const exists = await this.redis!.exists(key);
// //       console.log(`🔍 Key exists: ${exists}`);

// //       if (!exists) {
// //         console.log(`❌ No refresh token found in Redis for user: ${userId}`);
// //         return false;
// //       }

// //       const hashedToken = await this.redis!.get(key);

// //       if (!hashedToken) {
// //         console.log(`❌ No refresh token value found for user: ${userId}`);
// //         return false;
// //       }

// //       console.log(`🔑 Found hashed token in Redis for user: ${userId}`);
// //       const isValid = await bcrypt.compare(refreshToken, hashedToken);
// //       console.log(`🔍 Token verification for user ${userId}: ${isValid}`);

// //       return isValid;
// //     } catch (error) {
// //       console.error("🚨 Error verifying refresh token:", error);
// //       console.error("🚨 Error details:", {
// //         name: error.name,
// //         message: error.message,
// //       });
// //       return false;
// //     }
// //   }

// //   async removeRefreshToken(userId: string): Promise<boolean> {
// //     try {
// //       await this.ensureConnection();

// //       const key = `refresh_token:${userId}`;
// //       const result = await this.redis!.del(key);

// //       console.log(
// //         `🗑️ Refresh token removed for user: ${userId}, result: ${result}`
// //       );
// //       return result === 1;
// //     } catch (error) {
// //       console.error("🚨 Error removing refresh token:", error);
// //       return false;
// //     }
// //   }

// //   async getTokenTTL(userId: string): Promise<number> {
// //     try {
// //       await this.ensureConnection();

// //       const key = `refresh_token:${userId}`;
// //       const ttl = await this.redis!.ttl(key);
// //       console.log(`⏰ Token TTL for user ${userId}: ${ttl} seconds`);
// //       return ttl;
// //     } catch (error) {
// //       console.error("🚨 Error getting token TTL:", error);
// //       return -1;
// //     }
// //   }

// //   async removeAllUserTokens(userId: string): Promise<boolean> {
// //     try {
// //       await this.ensureConnection();

// //       const devices = await this.redis!.sMembers(`user_devices:${userId}`);

// //       const pipeline = this.redis!.multi();
// //       pipeline.del(`refresh_token:${userId}`);

// //       devices.forEach((deviceId) => {
// //         pipeline.del(`refresh_token:${userId}:${deviceId}`);
// //       });

// //       pipeline.del(`user_devices:${userId}`);
// //       await pipeline.exec();

// //       console.log(`🧹 All tokens removed for user: ${userId}`);
// //       return true;
// //     } catch (error) {
// //       console.error("🚨 Error removing all user tokens:", error);
// //       return false;
// //     }
// //   }

// //   // Graceful shutdown
// //   async disconnect(): Promise<void> {
// //     try {
// //       if (this.redis && this.isConnected) {
// //         await this.redis.quit();
// //         console.log("✅ Redis Token Client disconnected gracefully");
// //       }
// //     } catch (error) {
// //       console.error("❌ Error disconnecting Redis Token Client:", error);
// //     } finally {
// //       this.isConnected = false;
// //       this.redis = null;
// //       this.connectionPromise = null;
// //     }
// //   }

// //   // Debug method
// //   async debugRedisState(userId: string): Promise<void> {
// //     try {
// //       console.log("🔧 === REDIS TOKEN SERVICE DEBUG ===");
// //       console.log("🔧 Connected:", this.isConnected);
// //       console.log("🔧 Redis client exists:", !!this.redis);

// //       if (this.redis && this.isConnected) {
// //         try {
// //           const pingResult = await this.redis.ping();
// //           console.log("🔧 Redis ping result:", pingResult);

// //           const key = `refresh_token:${userId}`;
// //           const exists = await this.redis.exists(key);
// //           const ttl = await this.redis.ttl(key);

// //           console.log(`🔧 Key ${key} exists:`, exists);
// //           console.log(`🔧 Key ${key} TTL:`, ttl);

// //           if (exists) {
// //             const value = await this.redis.get(key);
// //             console.log(`🔧 Key ${key} value length:`, value?.length || 0);
// //           }
// //         } catch (redisError) {
// //           console.error("🔧 Redis operation failed:", redisError);
// //         }
// //       }
// //       console.log("🔧 === END DEBUG INFO ===");
// //     } catch (error) {
// //       console.error("🔧 Debug failed:", error);
// //     }
// //   }
// // }

// // export default new RedisTokenService();
// import {
//   createClient,
//   RedisClientType,
//   RedisModules,
//   RedisFunctions,
//   RedisScripts,
// } from "@redis/client";
// import bcrypt from "bcryptjs";

// export class RedisTokenService {
//   private redis: RedisClientType<
//     RedisModules,
//     RedisFunctions,
//     RedisScripts
//   > | null = null;
//   private isConnected = false;
//   private connectionPromise: Promise<void> | null = null;

//   constructor() {
//     console.log(
//       "🔧 RedisTokenService constructor - will create own Redis client"
//     );
//   }

//   private async initializeRedis(): Promise<void> {
//     if (this.connectionPromise) {
//       return this.connectionPromise;
//     }

//     this.connectionPromise = this._initializeRedis();
//     return this.connectionPromise;
//   }

//   private async _initializeRedis(): Promise<void> {
//     try {
//       if (this.redis && this.isConnected) {
//         return; // Already connected
//       }

//       console.log("🔧 Creating dedicated Redis client for tokens");

//       // Create our own Redis client for tokens
//       this.redis = createClient({
//         url: process.env.REDIS_URL || "redis://localhost:6379",
//         database: 1, // Use database 1 for tokens (separate from main app)
//       });

//       // Set up event handlers
//       this.redis.on("error", (err) => {
//         console.error("❌ Redis Token Client Error:", err);
//         this.isConnected = false;
//       });

//       this.redis.on("connect", () => {
//         console.log("✅ Redis Token Client connected");
//       });

//       this.redis.on("ready", () => {
//         console.log("🚀 Redis Token Client ready");
//         this.isConnected = true;
//       });

//       this.redis.on("end", () => {
//         console.log("📤 Redis Token Client disconnected");
//         this.isConnected = false;
//       });

//       // Connect to Redis
//       await this.redis.connect();

//       // Test the connection
//       const pingResult = await this.redis.ping();
//       console.log(`✅ Redis Token Client ping: ${pingResult}`);

//       this.isConnected = true;
//       console.log("✅ RedisTokenService initialized with dedicated client");
//     } catch (error) {
//       console.error("❌ Failed to initialize Redis token client:", error);
//       this.isConnected = false;
//       this.connectionPromise = null;
//       throw error;
//     }
//   }

//   private async ensureConnection(): Promise<void> {
//     if (!this.isConnected || !this.redis) {
//       await this.initializeRedis();
//     }

//     if (!this.redis) {
//       throw new Error("Redis client initialization failed");
//     }

//     // Double-check connection with ping
//     try {
//       await this.redis.ping();
//     } catch (pingError) {
//       console.error("❌ Redis ping failed, reconnecting...");
//       this.isConnected = false;
//       this.connectionPromise = null;
//       await this.initializeRedis();
//     }
//   }

//   async saveRefreshToken(
//     userId: string,
//     refreshToken: string,
//     expiresInMinutes: number = 2
//   ): Promise<void> {
//     try {
//       console.log(`💾 Attempting to save refresh token for user: ${userId}`);
//       await this.ensureConnection();

//       // ✅ STORE THE ACTUAL TOKEN (not hashed for retrieval)
//       const key = `refresh_token:${userId}`;
//       const expirationSeconds = expiresInMinutes * 60;

//       await this.redis!.setEx(key, expirationSeconds, refreshToken);
//       console.log(
//         `✅ Refresh token saved for user: ${userId}, expires in ${expiresInMinutes} minutes`
//       );

//       // Verify it was saved
//       const ttl = await this.redis!.ttl(key);
//       console.log(`🔍 Verified: TTL for ${key} is ${ttl} seconds`);
//     } catch (error) {
//       console.error("🚨 Error saving refresh token to Redis:", error);
//       throw new Error(`Failed to save refresh token: ${error.message}`);
//     }
//   }

//   // ✅ NEW METHOD: Get refresh token from Redis
//   async getRefreshToken(userId: string): Promise<string | null> {
//     try {
//       console.log(`🔍 Getting refresh token for user: ${userId}`);
//       await this.ensureConnection();

//       const key = `refresh_token:${userId}`;
//       console.log(`🔑 Looking for key: ${key}`);

//       // Check if key exists first
//       const exists = await this.redis!.exists(key);
//       console.log(`🔍 Key exists: ${exists}`);

//       if (!exists) {
//         console.log(`❌ No refresh token found in Redis for user: ${userId}`);
//         return null;
//       }

//       const token = await this.redis!.get(key);

//       if (!token) {
//         console.log(`❌ No refresh token value found for user: ${userId}`);
//         return null;
//       }

//       console.log(`🔑 Found refresh token in Redis for user: ${userId}`);
//       return token;
//     } catch (error) {
//       console.error("🚨 Error getting refresh token:", error);
//       return null;
//     }
//   }

//   // ✅ MODIFIED: Verify token against what's stored in Redis
//   async verifyRefreshToken(
//     userId: string,
//     refreshToken: string
//   ): Promise<boolean> {
//     try {
//       console.log(`🔍 Verifying refresh token for user: ${userId}`);
//       await this.ensureConnection();

//       const storedToken = await this.getRefreshToken(userId);

//       if (!storedToken) {
//         console.log(`❌ No stored refresh token found for user: ${userId}`);
//         return false;
//       }

//       const isValid = storedToken === refreshToken;
//       console.log(`🔍 Token verification for user ${userId}: ${isValid}`);

//       return isValid;
//     } catch (error) {
//       console.error("🚨 Error verifying refresh token:", error);
//       return false;
//     }
//   }

//   // ✅ NEW METHOD: Direct verification without external token parameter
//   async verifyRefreshTokenDirect(
//     userId: string,
//     tokenToVerify: string
//   ): Promise<boolean> {
//     try {
//       console.log(`🔍 Direct token verification for user: ${userId}`);
//       const storedToken = await this.getRefreshToken(userId);

//       if (!storedToken) {
//         return false;
//       }

//       return storedToken === tokenToVerify;
//     } catch (error) {
//       console.error("🚨 Error in direct token verification:", error);
//       return false;
//     }
//   }

//   async removeRefreshToken(userId: string): Promise<boolean> {
//     try {
//       await this.ensureConnection();

//       const key = `refresh_token:${userId}`;
//       const result = await this.redis!.del(key);

//       console.log(
//         `🗑️ Refresh token removed for user: ${userId}, result: ${result}`
//       );
//       return result === 1;
//     } catch (error) {
//       console.error("🚨 Error removing refresh token:", error);
//       return false;
//     }
//   }

//   async getTokenTTL(userId: string): Promise<number> {
//     try {
//       await this.ensureConnection();

//       const key = `refresh_token:${userId}`;
//       const ttl = await this.redis!.ttl(key);
//       console.log(`⏰ Token TTL for user ${userId}: ${ttl} seconds`);
//       return ttl;
//     } catch (error) {
//       console.error("🚨 Error getting token TTL:", error);
//       return -1;
//     }
//   }

//   async removeAllUserTokens(userId: string): Promise<boolean> {
//     try {
//       await this.ensureConnection();

//       const devices = await this.redis!.sMembers(`user_devices:${userId}`);

//       const pipeline = this.redis!.multi();
//       pipeline.del(`refresh_token:${userId}`);

//       devices.forEach((deviceId) => {
//         pipeline.del(`refresh_token:${userId}:${deviceId}`);
//       });

//       pipeline.del(`user_devices:${userId}`);
//       await pipeline.exec();

//       console.log(`🧹 All tokens removed for user: ${userId}`);
//       return true;
//     } catch (error) {
//       console.error("🚨 Error removing all user tokens:", error);
//       return false;
//     }
//   }

//   // Graceful shutdown
//   async disconnect(): Promise<void> {
//     try {
//       if (this.redis && this.isConnected) {
//         await this.redis.quit();
//         console.log("✅ Redis Token Client disconnected gracefully");
//       }
//     } catch (error) {
//       console.error("❌ Error disconnecting Redis Token Client:", error);
//     } finally {
//       this.isConnected = false;
//       this.redis = null;
//       this.connectionPromise = null;
//     }
//   }

//   // Debug method
//   async debugRedisState(userId: string): Promise<void> {
//     try {
//       console.log("🔧 === REDIS TOKEN SERVICE DEBUG ===");
//       console.log("🔧 Connected:", this.isConnected);
//       console.log("🔧 Redis client exists:", !!this.redis);

//       if (this.redis && this.isConnected) {
//         try {
//           const pingResult = await this.redis.ping();
//           console.log("🔧 Redis ping result:", pingResult);

//           const key = `refresh_token:${userId}`;
//           const exists = await this.redis.exists(key);
//           const ttl = await this.redis.ttl(key);

//           console.log(`🔧 Key ${key} exists:`, exists);
//           console.log(`🔧 Key ${key} TTL:`, ttl);

//           if (exists) {
//             const value = await this.redis.get(key);
//             console.log(`🔧 Key ${key} value length:`, value?.length || 0);
//           }
//         } catch (redisError) {
//           console.error("🔧 Redis operation failed:", redisError);
//         }
//       }
//       console.log("🔧 === END DEBUG INFO ===");
//     } catch (error) {
//       console.error("🔧 Debug failed:", error);
//     }
//   }
// }

// export default new RedisTokenService();
import {
  createClient,
  RedisClientType,
  RedisModules,
  RedisFunctions,
  RedisScripts,
} from "@redis/client";

// ✅ ENHANCED VERSION: Handles both Admin and User tokens
export class RedisTokenService {
  private redis: RedisClientType<
    RedisModules,
    RedisFunctions,
    RedisScripts
  > | null = null;
  private isConnected = false;
  private connectionPromise: Promise<void> | null = null;

  constructor() {
    console.log(
      "🔧 RedisTokenService constructor - handles both ADMIN and USER tokens"
    );
  }

  private async initializeRedis(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = this._initializeRedis();
    return this.connectionPromise;
  }

  private async _initializeRedis(): Promise<void> {
    try {
      if (this.redis && this.isConnected) {
        return;
      }

      console.log("🔧 Creating unified Redis client for all tokens");

      this.redis = createClient({
        url: process.env.REDIS_URL || "redis://localhost:6379",
        database: 1, // Single database with prefixed keys
      });

      this.redis.on("error", (err) => {
        console.error("❌ Redis Token Client Error:", err);
        this.isConnected = false;
      });

      this.redis.on("connect", () => {
        console.log("✅ Redis Token Client connected");
      });

      this.redis.on("ready", () => {
        console.log("🚀 Redis Token Client ready");
        this.isConnected = true;
      });

      this.redis.on("end", () => {
        console.log("📤 Redis Token Client disconnected");
        this.isConnected = false;
      });

      await this.redis.connect();
      const pingResult = await this.redis.ping();
      console.log(`✅ Redis Token Client ping: ${pingResult}`);

      this.isConnected = true;
      console.log("✅ RedisTokenService initialized for ADMIN and USER tokens");
    } catch (error) {
      console.error("❌ Failed to initialize Redis token client:", error);
      this.isConnected = false;
      this.connectionPromise = null;
      throw error;
    }
  }

  private async ensureConnection(): Promise<void> {
    if (!this.isConnected || !this.redis) {
      await this.initializeRedis();
    }

    if (!this.redis) {
      throw new Error("Redis client initialization failed");
    }

    try {
      await this.redis.ping();
    } catch (pingError) {
      console.error("❌ Redis ping failed, reconnecting...");
      this.isConnected = false;
      this.connectionPromise = null;
      await this.initializeRedis();
    }
  }

  // ✅ ENHANCED: Generate key with proper prefix
  private getTokenKey(userId: string, userType: "admin" | "user"): string {
    return `${userType}_refresh_token:${userId}`;
  }

  // ✅ ENHANCED: Save refresh token with user type
  async saveRefreshToken(
    userId: string,
    refreshToken: string,
    expiresInMinutes: number = 2,
    userType: "admin" | "user" = "user"
  ): Promise<void> {
    try {
      console.log(
        `💾 Attempting to save ${userType.toUpperCase()} refresh token for user: ${userId}`
      );
      await this.ensureConnection();

      const key = this.getTokenKey(userId, userType);
      const expirationSeconds = expiresInMinutes * 60;

      await this.redis!.setEx(key, expirationSeconds, refreshToken);
      console.log(
        `✅ ${userType.toUpperCase()} refresh token saved for user: ${userId}, expires in ${expiresInMinutes} minutes`
      );

      const ttl = await this.redis!.ttl(key);
      console.log(`🔍 Verified: TTL for ${key} is ${ttl} seconds`);
    } catch (error) {
      console.error(
        `🚨 Error saving ${userType.toUpperCase()} refresh token to Redis:`,
        error
      );
      throw new Error(`Failed to save refresh token: ${error.message}`);
    }
  }

  // ✅ ENHANCED: Get refresh token with user type
  async getRefreshToken(
    userId: string,
    userType: "admin" | "user" = "user"
  ): Promise<string | null> {
    try {
      console.log(
        `🔍 Getting ${userType.toUpperCase()} refresh token for user: ${userId}`
      );
      await this.ensureConnection();

      const key = this.getTokenKey(userId, userType);
      console.log(`🔑 Looking for key: ${key}`);

      const exists = await this.redis!.exists(key);
      console.log(`🔍 Key exists: ${exists}`);

      if (!exists) {
        console.log(
          `❌ No ${userType.toUpperCase()} refresh token found in Redis for user: ${userId}`
        );
        return null;
      }

      const token = await this.redis!.get(key);

      if (!token) {
        console.log(
          `❌ No ${userType.toUpperCase()} refresh token value found for user: ${userId}`
        );
        return null;
      }

      console.log(
        `🔑 Found ${userType.toUpperCase()} refresh token in Redis for user: ${userId}`
      );
      return token;
    } catch (error) {
      console.error(
        `🚨 Error getting ${userType.toUpperCase()} refresh token:`,
        error
      );
      return null;
    }
  }

  // ✅ ENHANCED: Verify refresh token with user type
  async verifyRefreshToken(
    userId: string,
    refreshToken: string,
    userType: "admin" | "user" = "user"
  ): Promise<boolean> {
    try {
      console.log(
        `🔍 Verifying ${userType.toUpperCase()} refresh token for user: ${userId}`
      );

      const storedToken = await this.getRefreshToken(userId, userType);

      if (!storedToken) {
        console.log(
          `❌ No stored ${userType.toUpperCase()} refresh token found for user: ${userId}`
        );
        return false;
      }

      const isValid = storedToken === refreshToken;
      console.log(
        `🔍 ${userType.toUpperCase()} token verification for user ${userId}: ${isValid}`
      );

      return isValid;
    } catch (error) {
      console.error(
        `🚨 Error verifying ${userType.toUpperCase()} refresh token:`,
        error
      );
      return false;
    }
  }

  // ✅ ENHANCED: Direct verification with user type
  async verifyRefreshTokenDirect(
    userId: string,
    tokenToVerify: string,
    userType: "admin" | "user" = "user"
  ): Promise<boolean> {
    try {
      console.log(
        `🔍 Direct ${userType.toUpperCase()} token verification for user: ${userId}`
      );
      const storedToken = await this.getRefreshToken(userId, userType);

      if (!storedToken) {
        return false;
      }

      return storedToken === tokenToVerify;
    } catch (error) {
      console.error(
        `🚨 Error in direct ${userType.toUpperCase()} token verification:`,
        error
      );
      return false;
    }
  }

  // ✅ ENHANCED: Remove refresh token with user type
  async removeRefreshToken(
    userId: string,
    userType: "admin" | "user" = "user"
  ): Promise<boolean> {
    try {
      await this.ensureConnection();

      const key = this.getTokenKey(userId, userType);
      const result = await this.redis!.del(key);

      console.log(
        `🗑️ ${userType.toUpperCase()} refresh token removed for user: ${userId}, result: ${result}`
      );
      return result === 1;
    } catch (error) {
      console.error(
        `🚨 Error removing ${userType.toUpperCase()} refresh token:`,
        error
      );
      return false;
    }
  }

  // ✅ ENHANCED: Get token TTL with user type
  async getTokenTTL(
    userId: string,
    userType: "admin" | "user" = "user"
  ): Promise<number> {
    try {
      await this.ensureConnection();

      const key = this.getTokenKey(userId, userType);
      const ttl = await this.redis!.ttl(key);
      console.log(
        `⏰ ${userType.toUpperCase()} token TTL for user ${userId}: ${ttl} seconds`
      );
      return ttl;
    } catch (error) {
      console.error(
        `🚨 Error getting ${userType.toUpperCase()} token TTL:`,
        error
      );
      return -1;
    }
  }

  // ✅ ENHANCED: Remove all user tokens with user type
  async removeAllUserTokens(
    userId: string,
    userType: "admin" | "user" = "user"
  ): Promise<boolean> {
    try {
      await this.ensureConnection();

      const devices = await this.redis!.sMembers(
        `${userType}_devices:${userId}`
      );

      const pipeline = this.redis!.multi();
      pipeline.del(this.getTokenKey(userId, userType));

      devices.forEach((deviceId) => {
        pipeline.del(`${userType}_refresh_token:${userId}:${deviceId}`);
      });

      pipeline.del(`${userType}_devices:${userId}`);
      await pipeline.exec();

      console.log(
        `🧹 All ${userType.toUpperCase()} tokens removed for user: ${userId}`
      );
      return true;
    } catch (error) {
      console.error(
        `🚨 Error removing all ${userType.toUpperCase()} tokens:`,
        error
      );
      return false;
    }
  }

  // ✅ ENHANCED: Debug with user type
  async debugRedisState(
    userId: string,
    userType: "admin" | "user" = "user"
  ): Promise<void> {
    try {
      console.log(
        `🔧 === ${userType.toUpperCase()} REDIS TOKEN SERVICE DEBUG ===`
      );
      console.log("🔧 Connected:", this.isConnected);
      console.log("🔧 Redis client exists:", !!this.redis);

      if (this.redis && this.isConnected) {
        try {
          const pingResult = await this.redis.ping();
          console.log("🔧 Redis ping result:", pingResult);

          const key = this.getTokenKey(userId, userType);
          const exists = await this.redis.exists(key);
          const ttl = await this.redis.ttl(key);

          console.log(`🔧 Key ${key} exists:`, exists);
          console.log(`🔧 Key ${key} TTL:`, ttl);

          if (exists) {
            const value = await this.redis.get(key);
            console.log(`🔧 Key ${key} value length:`, value?.length || 0);
          }
        } catch (redisError) {
          console.error("🔧 Redis operation failed:", redisError);
        }
      }
      console.log(`🔧 === END ${userType.toUpperCase()} DEBUG INFO ===`);
    } catch (error) {
      console.error(`🔧 ${userType.toUpperCase()} debug failed:`, error);
    }
  }

  // Graceful shutdown
  async disconnect(): Promise<void> {
    try {
      if (this.redis && this.isConnected) {
        await this.redis.quit();
        console.log("✅ Redis Token Client disconnected gracefully");
      }
    } catch (error) {
      console.error("❌ Error disconnecting Redis Token Client:", error);
    } finally {
      this.isConnected = false;
      this.redis = null;
      this.connectionPromise = null;
    }
  }
}

export default new RedisTokenService();
