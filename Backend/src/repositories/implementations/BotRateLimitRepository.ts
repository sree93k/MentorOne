// import BotRateLimit from "../../models/BotRateLimitModel";
// import { EBotRateLimit } from "../../entities/EBotRateLimitEntity";
// import { IBotRateLimitRepository } from "../interface/IBotRateLimitRepository";

// export class BotRateLimitRepository implements IBotRateLimitRepository {
//   async findByIdentifier(identifier: string): Promise<EBotRateLimit | null> {
//     return await BotRateLimit.findOne({ identifier }).lean();
//   }

//   async createOrUpdateLimit(
//     identifier: string,
//     count: number,
//     resetTime: Date
//   ): Promise<EBotRateLimit> {
//     return await BotRateLimit.findOneAndUpdate(
//       { identifier },
//       { count, resetTime },
//       { upsert: true, new: true }
//     );
//   }

//   async checkRateLimit(
//     identifier: string,
//     maxRequests: number,
//     windowHours: number
//   ): Promise<{ allowed: boolean; remaining: number; resetTime: Date }> {
//     const now = new Date();
//     const windowStart = new Date(now.getTime() - windowHours * 60 * 60 * 1000);

//     let rateLimit = await this.findByIdentifier(identifier);

//     // If no record or reset time passed, create new window
//     if (!rateLimit || rateLimit.resetTime < now) {
//       const resetTime = new Date(now.getTime() + windowHours * 60 * 60 * 1000);
//       rateLimit = await this.createOrUpdateLimit(identifier, 1, resetTime);

//       return {
//         allowed: true,
//         remaining: maxRequests - 1,
//         resetTime: resetTime,
//       };
//     }

//     // Check if limit exceeded
//     if (rateLimit.count >= maxRequests) {
//       return {
//         allowed: false,
//         remaining: 0,
//         resetTime: rateLimit.resetTime,
//       };
//     }

//     // Increment count
//     await BotRateLimit.findOneAndUpdate({ identifier }, { $inc: { count: 1 } });

//     return {
//       allowed: true,
//       remaining: maxRequests - rateLimit.count - 1,
//       resetTime: rateLimit.resetTime,
//     };
//   }
// }
import BotRateLimit from "../../models/BotRateLimitModel";
import { EBotRateLimit } from "../../entities/EBotRateLimitEntity";
import { IBotRateLimitRepository } from "../interface/IBotRateLimitRepository";
import BaseRepository from "./BaseRepository";

export class BotRateLimitRepository
  extends BaseRepository<EBotRateLimit>
  implements IBotRateLimitRepository
{
  constructor() {
    super(BotRateLimit);
  }

  async findByIdentifier(identifier: string): Promise<EBotRateLimit | null> {
    try {
      return await this.findOne({ identifier }, { lean: true });
    } catch (error) {
      throw this.handleError(error, "findByIdentifier");
    }
  }

  async createOrUpdateLimit(
    identifier: string,
    count: number,
    resetTime: Date
  ): Promise<EBotRateLimit> {
    try {
      const result = await this.getModel().findOneAndUpdate(
        { identifier },
        { count, resetTime },
        { upsert: true, new: true }
      );

      if (!result) {
        throw new Error("Failed to create or update rate limit");
      }

      return result;
    } catch (error) {
      throw this.handleError(error, "createOrUpdateLimit");
    }
  }

  async checkRateLimit(
    identifier: string,
    maxRequests: number,
    windowHours: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: Date }> {
    try {
      const now = new Date();
      const windowStart = new Date(
        now.getTime() - windowHours * 60 * 60 * 1000
      );

      let rateLimit = await this.findByIdentifier(identifier);

      // If no record or reset time passed, create new window
      if (!rateLimit || rateLimit.resetTime < now) {
        const resetTime = new Date(
          now.getTime() + windowHours * 60 * 60 * 1000
        );
        rateLimit = await this.createOrUpdateLimit(identifier, 1, resetTime);

        return {
          allowed: true,
          remaining: maxRequests - 1,
          resetTime: resetTime,
        };
      }

      // Check if limit exceeded
      if (rateLimit.count >= maxRequests) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: rateLimit.resetTime,
        };
      }

      // Increment count
      await this.getModel().findOneAndUpdate(
        { identifier },
        { $inc: { count: 1 } }
      );

      return {
        allowed: true,
        remaining: maxRequests - rateLimit.count - 1,
        resetTime: rateLimit.resetTime,
      };
    } catch (error) {
      throw this.handleError(error, "checkRateLimit");
    }
  }
}
