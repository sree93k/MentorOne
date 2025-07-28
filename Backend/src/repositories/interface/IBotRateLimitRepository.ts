// import { EBotRateLimit } from "../../entities/EBotRateLimitEntity";

// export interface IBotRateLimitRepository {
//   findByIdentifier(identifier: string): Promise<EBotRateLimit | null>;
//   createOrUpdateLimit(
//     identifier: string,
//     count: number,
//     resetTime: Date
//   ): Promise<EBotRateLimit>;
//   checkRateLimit(
//     identifier: string,
//     maxRequests: number,
//     windowHours: number
//   ): Promise<{ allowed: boolean; remaining: number; resetTime: Date }>;
// }
import { EBotRateLimit } from "../../entities/EBotRateLimitEntity";

export interface IBotRateLimitRepository {
  findByIdentifier(identifier: string): Promise<EBotRateLimit | null>;
  createOrUpdateLimit(
    identifier: string,
    count: number,
    resetTime: Date
  ): Promise<EBotRateLimit>;
  checkRateLimit(
    identifier: string,
    maxRequests: number,
    windowHours: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: Date }>;
}
