import {
  RedisClientType,
  RedisModules,
  RedisFunctions,
  RedisScripts,
} from "@redis/client";
import bcrypt from "bcryptjs";
import { tokenClient } from "../../server"; // Import from your main server file

export class RedisTokenService {
  private redis: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;

  constructor() {
    this.redis = tokenClient; // Use the existing token client
  }

  async saveRefreshToken(
    userId: string,
    refreshToken: string,
    expiresInDays: number = 7
  ): Promise<void> {
    try {
      const hashedToken = await bcrypt.hash(refreshToken, 10);
      const key = `refresh_token:${userId}`;
      const expirationSeconds = expiresInDays * 24 * 60 * 60;

      await this.redis.setEx(key, expirationSeconds, hashedToken);
      console.log(`Refresh token saved for user: ${userId}`);
    } catch (error) {
      console.error("Error saving refresh token to Redis:", error);
      throw new Error("Failed to save refresh token");
    }
  }

  async verifyRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<boolean> {
    try {
      const key = `refresh_token:${userId}`;
      const hashedToken = await this.redis.get(key);

      if (!hashedToken) {
        console.log(`No refresh token found for user: ${userId}`);
        return false;
      }

      const isValid = await bcrypt.compare(refreshToken, hashedToken);
      console.log(`Token verification for user ${userId}:`, isValid);

      return isValid;
    } catch (error) {
      console.error("Error verifying refresh token:", error);
      return false;
    }
  }

  async removeRefreshToken(userId: string): Promise<boolean> {
    try {
      const key = `refresh_token:${userId}`;
      const result = await this.redis.del(key);

      console.log(`Refresh token removed for user: ${userId}`);
      return result === 1;
    } catch (error) {
      console.error("Error removing refresh token:", error);
      return false;
    }
  }

  async getTokenTTL(userId: string): Promise<number> {
    try {
      const key = `refresh_token:${userId}`;
      return await this.redis.ttl(key);
    } catch (error) {
      console.error("Error getting token TTL:", error);
      return -1;
    }
  }

  // Multi-device support
  async saveDeviceRefreshToken(
    userId: string,
    deviceId: string,
    refreshToken: string,
    expiresInDays: number = 7
  ): Promise<void> {
    try {
      const hashedToken = await bcrypt.hash(refreshToken, 10);
      const key = `refresh_token:${userId}:${deviceId}`;
      const expirationSeconds = expiresInDays * 24 * 60 * 60;

      await this.redis.setEx(key, expirationSeconds, hashedToken);
      await this.redis.sAdd(`user_devices:${userId}`, deviceId);

      console.log(
        `Device refresh token saved for user: ${userId}, device: ${deviceId}`
      );
    } catch (error) {
      console.error("Error saving device refresh token:", error);
      throw new Error("Failed to save device refresh token");
    }
  }

  async verifyDeviceRefreshToken(
    userId: string,
    deviceId: string,
    refreshToken: string
  ): Promise<boolean> {
    try {
      const key = `refresh_token:${userId}:${deviceId}`;
      const hashedToken = await this.redis.get(key);

      if (!hashedToken) {
        return false;
      }

      return await bcrypt.compare(refreshToken, hashedToken);
    } catch (error) {
      console.error("Error verifying device refresh token:", error);
      return false;
    }
  }

  async removeAllUserTokens(userId: string): Promise<boolean> {
    try {
      const devices = await this.redis.sMembers(`user_devices:${userId}`);

      const pipeline = this.redis.multi();

      // Remove single user token
      pipeline.del(`refresh_token:${userId}`);

      // Remove all device tokens
      devices.forEach((deviceId) => {
        pipeline.del(`refresh_token:${userId}:${deviceId}`);
      });

      // Remove device list
      pipeline.del(`user_devices:${userId}`);

      await pipeline.exec();

      console.log(`All tokens removed for user: ${userId}`);
      return true;
    } catch (error) {
      console.error("Error removing all user tokens:", error);
      return false;
    }
  }
}
