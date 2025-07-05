// // // // import {
// // // //   RedisClientType,
// // // //   RedisModules,
// // // //   RedisFunctions,
// // // //   RedisScripts,
// // // // } from "@redis/client";
// // // // import bcrypt from "bcryptjs";
// // // // import { logger } from "../../utils/logger";
// // // // import { ServiceError } from "../../errors/serviceError";
// // // // import { HttpStatus } from "../../constants/HttpStatus";

// // // // export class RedisTokenService {
// // // //   constructor(
// // // //     private readonly redis: RedisClientType<
// // // //       RedisModules,
// // // //       RedisFunctions,
// // // //       RedisScripts
// // // //     >
// // // //   ) {}

// // // //   async saveRefreshToken(
// // // //     userId: string,
// // // //     refreshToken: string,
// // // //     expiresInDays: number = 7
// // // //   ): Promise<void> {
// // // //     try {
// // // //       logger.info("RedisTokenService saveRefreshToken step 1");
// // // //       console.log("userId", userId);
// // // //       console.log("refreshToken", refreshToken);
// // // //       console.log("expiresInDays", expiresInDays);
// // // //       logger.info("RedisTokenService saveRefreshToken step 2");
// // // //       const hashedToken = await bcrypt.hash(refreshToken, 10);
// // // //       const key = `refresh_token:${userId}`;
// // // //       const expirationSeconds = expiresInDays * 24 * 60 * 60;
// // // //       logger.info("RedisTokenService saveRefreshToken step 3");
// // // //       await this.redis.setEx(key, expirationSeconds, hashedToken);
// // // //       logger.info("RedisTokenService saveRefreshToken step 4");
// // // //       logger.info("Refresh token saved", { userId });
// // // //     } catch (error) {
// // // //       logger.error("Failed to save refresh token", {
// // // //         userId,
// // // //         error: error instanceof Error ? error.message : String(error),
// // // //       });
// // // //       throw new ServiceError(
// // // //         "Failed to save refresh token",
// // // //         "REDIS_SAVE_ERROR",
// // // //         HttpStatus.INTERNAL_SERVER,
// // // //         "error"
// // // //       );
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
// // // //         logger.warn("No refresh token found", { userId });
// // // //         return false;
// // // //       }

// // // //       const isValid = await bcrypt.compare(refreshToken, hashedToken);
// // // //       logger.debug("Token verification result", { userId, isValid });
// // // //       return isValid;
// // // //     } catch (error) {
// // // //       logger.error("Failed to verify refresh token", {
// // // //         userId,
// // // //         error: error instanceof Error ? error.message : String(error),
// // // //       });
// // // //       throw new ServiceError(
// // // //         "Failed to verify refresh token",
// // // //         "REDIS_VERIFY_ERROR",
// // // //         HttpStatus.INTERNAL_SERVER,
// // // //         "error"
// // // //       );
// // // //     }
// // // //   }

// // // //   async removeRefreshToken(userId: string): Promise<boolean> {
// // // //     try {
// // // //       const key = `refresh_token:${userId}`;
// // // //       const result = await this.redis.del(key);

// // // //       logger.info("Refresh token removed", { userId });
// // // //       return result === 1;
// // // //     } catch (error) {
// // // //       logger.error("Failed to remove refresh token", {
// // // //         userId,
// // // //         error: error instanceof Error ? error.message : String(error),
// // // //       });
// // // //       throw new ServiceError(
// // // //         "Failed to remove refresh token",
// // // //         "REDIS_DELETE_ERROR",
// // // //         HttpStatus.INTERNAL_SERVER,
// // // //         "error"
// // // //       );
// // // //     }
// // // //   }

// // // //   async getTokenTTL(userId: string): Promise<number> {
// // // //     try {
// // // //       const key = `refresh_token:${userId}`;
// // // //       const ttl = await this.redis.ttl(key);
// // // //       logger.debug("Token TTL retrieved", { userId, ttl });
// // // //       return ttl;
// // // //     } catch (error) {
// // // //       logger.error("Failed to get token TTL", {
// // // //         userId,
// // // //         error: error instanceof Error ? error.message : String(error),
// // // //       });
// // // //       throw new ServiceError(
// // // //         "Failed to get token TTL",
// // // //         "REDIS_TTL_ERROR",
// // // //         HttpStatus.INTERNAL_SERVER,
// // // //         "error"
// // // //       );
// // // //     }
// // // //   }

// // // //   async saveDeviceRefreshToken(
// // // //     userId: string,
// // // //     deviceId: string,
// // // //     refreshToken: string,
// // // //     expiresInDays: number = 7
// // // //   ): Promise<void> {
// // // //     try {
// // // //       const hashedToken = await bcrypt.hash(refreshToken, 10);
// // // //       const key = `refresh_token:${userId}:${deviceId}`;
// // // //       const expirationSeconds = expiresInDays * 24 * 60 * 60;

// // // //       await this.redis.setEx(key, expirationSeconds, hashedToken);
// // // //       await this.redis.sAdd(`user_devices:${userId}`, deviceId);

// // // //       logger.info("Device refresh token saved", { userId, deviceId });
// // // //     } catch (error) {
// // // //       logger.error("Failed to save device refresh token", {
// // // //         userId,
// // // //         deviceId,
// // // //         error: error instanceof Error ? error.message : String(error),
// // // //       });
// // // //       throw new ServiceError(
// // // //         "Failed to save device refresh token",
// // // //         "REDIS_DEVICE_SAVE_ERROR",
// // // //         HttpStatus.INTERNAL_SERVER,
// // // //         "error"
// // // //       );
// // // //     }
// // // //   }

// // // //   async verifyDeviceRefreshToken(
// // // //     userId: string,
// // // //     deviceId: string,
// // // //     refreshToken: string
// // // //   ): Promise<boolean> {
// // // //     try {
// // // //       const key = `refresh_token:${userId}:${deviceId}`;
// // // //       const hashedToken = await this.redis.get(key);

// // // //       if (!hashedToken) {
// // // //         logger.warn("No device refresh token found", { userId, deviceId });
// // // //         return false;
// // // //       }

// // // //       const isValid = await bcrypt.compare(refreshToken, hashedToken);
// // // //       logger.debug("Device token verification result", {
// // // //         userId,
// // // //         deviceId,
// // // //         isValid,
// // // //       });
// // // //       return isValid;
// // // //     } catch (error) {
// // // //       logger.error("Failed to verify device refresh token", {
// // // //         userId,
// // // //         deviceId,
// // // //         error: error instanceof Error ? error.message : String(error),
// // // //       });
// // // //       throw new ServiceError(
// // // //         "Failed to verify device refresh token",
// // // //         "REDIS_DEVICE_VERIFY_ERROR",
// // // //         HttpStatus.INTERNAL_SERVER,
// // // //         "error"
// // // //       );
// // // //     }
// // // //   }

// // // //   async removeAllUserTokens(userId: string): Promise<boolean> {
// // // //     try {
// // // //       const devices = await this.redis.sMembers(`user_devices:${userId}`);
// // // //       const pipeline = this.redis.multi();

// // // //       pipeline.del(`refresh_token:${userId}`);
// // // //       devices.forEach((deviceId) => {
// // // //         pipeline.del(`refresh_token:${userId}:${deviceId}`);
// // // //       });
// // // //       pipeline.del(`user_devices:${userId}`);

// // // //       await pipeline.exec();
// // // //       logger.info("All tokens removed", { userId });
// // // //       return true;
// // // //     } catch (error) {
// // // //       logger.error("Failed to remove all user tokens", {
// // // //         userId,
// // // //         error: error instanceof Error ? error.message : String(error),
// // // //       });
// // // //       throw new ServiceError(
// // // //         "Failed to remove all user tokens",
// // // //         "REDIS_DELETE_ALL_ERROR",
// // // //         HttpStatus.INTERNAL_SERVER,
// // // //         "error"
// // // //       );
// // // //     }
// // // //   }
// // // // }
// // // import { RedisClientType } from "@redis/client";
// // // import bcrypt from "bcryptjs";
// // // import { logger } from "../../utils/logger";
// // // import { ServiceError } from "../../errors/serviceError";
// // // import { HttpStatus } from "../../constants/HttpStatus";

// // // export class RedisTokenService {
// // //   constructor(private readonly redis: RedisClientType) {
// // //     if (!redis.isOpen) {
// // //       redis.connect().catch((err) => {
// // //         logger.error("Redis client connection failed in RedisTokenService", {
// // //           error: err.message,
// // //         });
// // //       });
// // //     }
// // //   }

// // //   async saveRefreshToken(
// // //     userId: string,
// // //     refreshToken: string,
// // //     expiresInDays: number = 7
// // //   ): Promise<void> {
// // //     try {
// // //       logger.info("RedisTokenService saveRefreshToken step 1");
// // //       if (!this.redis.isOpen) {
// // //         await this.redis.connect();
// // //         logger.info("Redis client reconnected for saveRefreshToken", { userId });
// // //       }
// // //       logger.info("RedisTokenService saveRefreshToken step 2");
// // //       const hashedToken = await bcrypt.hash(refreshToken, 10);
// // //       const key = `refresh_token:${userId}`;
// // //       const expirationSeconds = expiresInDays * 24 * 60 * 60;
// // //       logger.info("RedisTokenService saveRefreshToken step 3");
// // //       await this.redis.setEx(key, expirationSeconds, hashedToken);
// // //       logger.info("RedisTokenService saveRefreshToken step 4");
// // //       logger.info("Refresh token saved", { userId });
// // //     } catch (error) {
// // //       logger.error("Failed to save refresh token", {
// // //         userId,
// // //         error: error instanceof Error ? error.message : String(error),
// // //       });
// // //       throw new ServiceError(
// // //         "Failed to save refresh token",
// // //         "REDIS_SAVE_ERROR",
// // //         HttpStatus.INTERNAL_SERVER,
// // //         "error"
// // //       );
// // //     }
// // //   }

// // //   async verifyRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
// // //     try {
// // //       if (!this.redis.isOpen) {
// // //         await this.redis.connect();
// // //         logger.info("Redis client reconnected for verifyRefreshToken", { userId });
// // //       }
// // //       const key = `refresh_token:${userId}`;
// // //       const hashedToken = await this.redis.get(key);

// // //       if (!hashedToken) {
// // //         logger.warn("No refresh token found", { userId });
// // //         return false;
// // //       }

// // //       const isValid = await bcrypt.compare(refreshToken, hashedToken);
// // //       logger.debug("Token verification result", { userId, isValid });
// // //       return isValid;
// // //     } catch (error) {
// // //       logger.error("Failed to verify refresh token", {
// // //         userId,
// // //         error: error instanceof Error ? error.message : String(error),
// // //       });
// // //       throw new ServiceError(
// // //         "Failed to verify refresh token",
// // //         "REDIS_VERIFY_ERROR",
// // //         HttpStatus.INTERNAL_SERVER,
// // //         "error"
// // //       );
// // //     }
// // //   }

// // //   async removeRefreshToken(userId: string): Promise<boolean> {
// // //     try {
// // //       if (!this.redis.isOpen) {
// // //         await this.redis.connect();
// // //         logger.info("Redis client reconnected for removeRefreshToken", { userId });
// // //       }
// // //       const key = `refresh_token:${userId}`;
// // //       const result = await this.redis.del(key);

// // //       logger.info("Refresh token removed", { userId });
// // //       return result === 1;
// // //     } catch (error) {
// // //       logger.error("Failed to remove refresh token", {
// // //         userId,
// // //         error: error instanceof Error ? error.message : String(error),
// // //       });
// // //       throw new ServiceError(
// // //         "Failed to remove refresh token",
// // //         "REDIS_DELETE_ERROR",
// // //         HttpStatus.INTERNAL_SERVER,
// // //         "error"
// // //       );
// // //     }
// // //   }

// // //   async getTokenTTL(userId: string): Promise<number> {
// // //     try {
// // //       if (!this.redis.isOpen) {
// // //         await this.redis.connect();
// // //         logger.info("Redis client reconnected for getTokenTTL", { userId });
// // //       }
// // //       const key = `refresh_token:${userId}`;
// // //       const ttl = await this.redis.ttl(key);
// // //       logger.debug("Token TTL retrieved", { userId, ttl });
// // //       return ttl;
// // //     } catch (error) {
// // //       logger.error("Failed to get token TTL", {
// // //         userId,
// // //         error: error instanceof Error ? error.message : String(error),
// // //       });
// // //       throw new ServiceError(
// // //         "Failed to get token TTL",
// // //         "REDIS_TTL_ERROR",
// // //         HttpStatus.INTERNAL_SERVER,
// // //         "error"
// // //       );
// // //     }
// // //   }

// // //   async saveDeviceRefreshToken(
// // //     userId: string,
// // //     deviceId: string,
// // //     refreshToken: string,
// // //     expiresInDays: number = 7
// // //   ): Promise<void> {
// // //     try {
// // //       if (!this.redis.isOpen) {
// // //         await this.redis.connect();
// // //         logger.info("Redis client reconnected for saveDeviceRefreshToken", { userId, deviceId });
// // //       }
// // //       const hashedToken = await bcrypt.hash(refreshToken, 10);
// // //       const key = `refresh_token:${userId}:${deviceId}`;
// // //       const expirationSeconds = expiresInDays * 24 * 60 * 60;

// // //       await this.redis.setEx(key, expirationSeconds, hashedToken);
// // //       await this.redis.sAdd(`user_devices:${userId}`, deviceId);

// // //       logger.info("Device refresh token saved", { userId, deviceId });
// // //     } catch (error) {
// // //       logger.error("Failed to save device refresh token", {
// // //         userId,
// // //         deviceId,
// // //         error: error instanceof Error ? error.message : String(error),
// // //       });
// // //       throw new ServiceError(
// // //         "Failed to save device refresh token",
// // //         "REDIS_DEVICE_SAVE_ERROR",
// // //         HttpStatus.INTERNAL_SERVER,
// // //         "error"
// // //       );
// // //     }
// // //   }

// // //   async verifyDeviceRefreshToken(
// // //     userId: string,
// // //     deviceId: string,
// // //     refreshToken: string
// // //   ): Promise<boolean> {
// // //     try {
// // //       if (!this.redis.isOpen) {
// // //         await this.redis.connect();
// // //         logger.info("Redis client reconnected for verifyDeviceRefreshToken", { userId, deviceId });
// // //       }
// // //       const key = `refresh_token:${userId}:${deviceId}`;
// // //       const hashedToken = await this.redis.get(key);

// // //       if (!hashedToken) {
// // //         logger.warn("No device refresh token found", { userId, deviceId });
// // //         return false;
// // //       }

// // //       const isValid = await bcrypt.compare(refreshToken, hashedToken);
// // //       logger.debug("Device token verification result", { userId, deviceId, isValid });
// // //       return isValid;
// // //     } catch (error) {
// // //       logger.error("Failed to verify device refresh token", {
// // //         userId,
// // //         deviceId,
// // //         error: error instanceof Error ? error.message : String(error),
// // //       });
// // //       throw new ServiceError(
// // //         "Failed to verify device refresh token",
// // //         "REDIS_DEVICE_VERIFY_ERROR",
// // //         HttpStatus.INTERNAL_SERVER,
// // //         "error"
// // //       );
// // //     }
// // //   }

// // //   async removeAllUserTokens(userId: string): Promise<boolean> {
// // //     try {
// // //       if (!this.redis.isOpen) {
// // //         await this.redis.connect();
// // //         logger.info("Redis client reconnected for removeAllUserTokens", { userId });
// // //       }
// // //       const devices = await this.redis.sMembers(`user_devices:${userId}`);
// // //       const pipeline = this.redis.multi();

// // //       pipeline.del(`refresh_token:${userId}`);
// // //       devices.forEach((deviceId) => {
// // //         pipeline.del(`refresh_token:${userId}:${deviceId}`);
// // //       });
// // //       pipeline.del(`user_devices:${userId}`);

// // //       await pipeline.exec();
// // //       logger.info("All tokens removed", { userId });
// // //       return true;
// // //     } catch (error) {
// // //       logger.error("Failed to remove all user tokens", {
// // //         userId,
// // //         error: error instanceof Error ? error.message : String(error),
// // //       });
// // //       throw new ServiceError(
// // //         "Failed to remove all user tokens",
// // //         "REDIS_DELETE_ALL_ERROR",
// // //         HttpStatus.INTERNAL_SERVER,
// // //         "error"
// // //       );
// // //     }
// // //   }
// // // }
// // import {
// //   RedisClientType,
// //   RedisModules,
// //   RedisFunctions,
// //   RedisScripts,
// // } from "@redis/client";
// // import bcrypt from "bcryptjs";
// // import { logger } from "../../utils/logger";
// // import { ServiceError } from "../../errors/serviceError";
// // import { HttpStatus } from "../../constants/HttpStatus";

// // export class RedisTokenService {
// //   constructor(
// //     private readonly redis: RedisClientType<
// //       RedisModules,
// //       RedisFunctions,
// //       RedisScripts
// //     >
// //   ) {
// //     if (!redis.isOpen) {
// //       redis.connect().catch((err) => {
// //         logger.error("Redis client connection failed in RedisTokenService", {
// //           error: err.message,
// //         });
// //       });
// //     }
// //   }

// //   async saveRefreshToken(
// //     userId: string,
// //     refreshToken: string,
// //     expiresInDays: number = 7
// //   ): Promise<void> {
// //     try {
// //       logger.info("RedisTokenService saveRefreshToken step 1");

// //       // Check if Redis is connected
// //       if (!this.redis.isOpen) {
// //         await this.redis.connect();
// //         logger.info("Redis client reconnected for saveRefreshToken", {
// //           userId,
// //         });
// //       }

// //       logger.info("RedisTokenService saveRefreshToken step 2");
// //       const hashedToken = await bcrypt.hash(refreshToken, 10);
// //       const key = `refresh_token:${userId}`;
// //       const expirationSeconds = expiresInDays * 24 * 60 * 60;

// //       logger.info("RedisTokenService saveRefreshToken step 3");
// //       await this.redis.setEx(key, expirationSeconds, hashedToken);

// //       logger.info("RedisTokenService saveRefreshToken step 4");
// //       logger.info("Refresh token saved", { userId });
// //     } catch (error) {
// //       logger.error("Failed to save refresh token", {
// //         userId,
// //         error: error instanceof Error ? error.message : String(error),
// //       });
// //       throw new ServiceError(
// //         "Failed to save refresh token",
// //         "REDIS_SAVE_ERROR",
// //         HttpStatus.INTERNAL_SERVER,
// //         "error"
// //       );
// //     }
// //   }

// //   async getRefreshToken(userId: string): Promise<string | null> {
// //     try {
// //       if (!this.redis.isOpen) {
// //         await this.redis.connect();
// //       }

// //       const key = `refresh_token:${userId}`;
// //       return await this.redis.get(key);
// //     } catch (error) {
// //       logger.error("Failed to get refresh token", {
// //         userId,
// //         error: error instanceof Error ? error.message : String(error),
// //       });
// //       throw new ServiceError(
// //         "Failed to get refresh token",
// //         "REDIS_GET_ERROR",
// //         HttpStatus.INTERNAL_SERVER,
// //         "error"
// //       );
// //     }
// //   }

// //   async deleteRefreshToken(userId: string): Promise<void> {
// //     try {
// //       if (!this.redis.isOpen) {
// //         await this.redis.connect();
// //       }

// //       const key = `refresh_token:${userId}`;
// //       await this.redis.del(key);
// //       logger.info("Refresh token deleted", { userId });
// //     } catch (error) {
// //       logger.error("Failed to delete refresh token", {
// //         userId,
// //         error: error instanceof Error ? error.message : String(error),
// //       });
// //       throw new ServiceError(
// //         "Failed to delete refresh token",
// //         "REDIS_DELETE_ERROR",
// //         HttpStatus.INTERNAL_SERVER,
// //         "error"
// //       );
// //     }
// //   }
// // }
// import { RedisClientType } from "@redis/client";
// import bcrypt from "bcryptjs";
// import { logger } from "../../utils/logger";
// import { ServiceError } from "../../errors/serviceError";
// import { HttpStatus } from "../../constants/HttpStatus";

// export class RedisTokenService {
//   constructor(private readonly redis: RedisClientType) {
//     if (!redis.isOpen) {
//       redis.connect().catch((err) => {
//         logger.error("Redis client connection failed in RedisTokenService", {
//           error: err.message,
//         });
//       });
//     }
//   }

//   async saveRefreshToken(
//     userId: string,
//     refreshToken: string,
//     expiresInDays: number = 7
//   ): Promise<void> {
//     try {
//       logger.info("RedisTokenService saveRefreshToken step 1");
//       if (!this.redis.isOpen) {
//         await this.redis.connect();
//         logger.info("Redis client reconnected for saveRefreshToken", {
//           userId,
//         });
//       }
//       logger.info("RedisTokenService saveRefreshToken step 2");
//       const hashedToken = await bcrypt.hash(refreshToken, 10);
//       const key = `refresh_token:${userId}`;
//       const expirationSeconds = expiresInDays * 24 * 60 * 60;
//       logger.info("RedisTokenService saveRefreshToken step 3");
//       await this.redis.setEx(key, expirationSeconds, hashedToken);
//       logger.info("RedisTokenService saveRefreshToken step 4");
//       logger.info("Refresh token saved", { userId });
//     } catch (error) {
//       logger.error("Failed to save refresh token", {
//         userId,
//         error: error instanceof Error ? error.message : String(error),
//       });
//       throw new ServiceError(
//         "Failed to save refresh token",
//         "REDIS_SAVE_ERROR",
//         HttpStatus.INTERNAL_SERVER,
//         "error"
//       );
//     }
//   }

//   async getRefreshToken(userId: string): Promise<string | null> {
//     try {
//       if (!this.redis.isOpen) {
//         await this.redis.connect();
//         logger.info("Redis client reconnected for getRefreshToken", { userId });
//       }
//       const key = `refresh_token:${userId}`;
//       return await this.redis.get(key);
//     } catch (error) {
//       logger.error("Failed to get refresh token", {
//         userId,
//         error: error instanceof Error ? error.message : String(error),
//       });
//       throw new ServiceError(
//         "Failed to get refresh token",
//         "REDIS_GET_ERROR",
//         HttpStatus.INTERNAL_SERVER,
//         "error"
//       );
//     }
//   }

//   async deleteRefreshToken(userId: string): Promise<void> {
//     try {
//       if (!this.redis.isOpen) {
//         await this.redis.connect();
//         logger.info("Redis client reconnected for deleteRefreshToken", {
//           userId,
//         });
//       }
//       const key = `refresh_token:${userId}`;
//       await this.redis.del(key);
//       logger.info("Refresh token deleted", { userId });
//     } catch (error) {
//       logger.error("Failed to delete refresh token", {
//         userId,
//         error: error instanceof Error ? error.message : String(error),
//       });
//       throw new ServiceError(
//         "Failed to delete refresh token",
//         "REDIS_DELETE_ERROR",
//         HttpStatus.INTERNAL_SERVER,
//         "error"
//       );
//     }
//   }
// }
import { RedisClientType } from "@redis/client";
import bcrypt from "bcryptjs";
import { logger } from "../../utils/logger";
import { ServiceError } from "../../errors/serviceError";
import { HttpStatus } from "../../constants/HttpStatus";

export class RedisTokenService {
  constructor(private readonly redis: RedisClientType) {
    if (!redis.isOpen) {
      redis.connect().catch((err) => {
        logger.error("Redis client connection failed in RedisTokenService", {
          error: err.message,
        });
      });
    }
  }

  async saveRefreshToken(
    userId: string,
    refreshToken: string,
    expiresInDays: number = 7
  ): Promise<void> {
    try {
      logger.info("RedisTokenService saveRefreshToken step 1");
      if (!this.redis.isOpen) {
        await this.redis.connect();
        logger.info("Redis client reconnected for saveRefreshToken", {
          userId,
        });
      }
      logger.info("RedisTokenService saveRefreshToken step 2");
      const hashedToken = await bcrypt.hash(refreshToken, 10);
      const key = `refresh_token:${userId}`;
      const expirationSeconds = expiresInDays * 24 * 60 * 60;
      logger.info("RedisTokenService saveRefreshToken step 3");
      await this.redis.setEx(key, expirationSeconds, hashedToken);
      logger.info("RedisTokenService saveRefreshToken step 4");
      logger.info("Refresh token saved", { userId });
    } catch (error) {
      logger.error("Failed to save refresh token", {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new ServiceError(
        "Failed to save refresh token",
        "REDIS_SAVE_ERROR",
        HttpStatus.INTERNAL_SERVER,
        "error"
      );
    }
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    try {
      if (!this.redis.isOpen) {
        await this.redis.connect();
        logger.info("Redis client reconnected for getRefreshToken", { userId });
      }
      const key = `refresh_token:${userId}`;
      return await this.redis.get(key);
    } catch (error) {
      logger.error("Failed to get refresh token", {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new ServiceError(
        "Failed to get refresh token",
        "REDIS_GET_ERROR",
        HttpStatus.INTERNAL_SERVER,
        "error"
      );
    }
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    try {
      if (!this.redis.isOpen) {
        await this.redis.connect();
        logger.info("Redis client reconnected for deleteRefreshToken", {
          userId,
        });
      }
      const key = `refresh_token:${userId}`;
      await this.redis.del(key);
      logger.info("Refresh token deleted", { userId });
    } catch (error) {
      logger.error("Failed to delete refresh token", {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new ServiceError(
        "Failed to delete refresh token",
        "REDIS_DELETE_ERROR",
        HttpStatus.INTERNAL_SERVER,
        "error"
      );
    }
  }
}
