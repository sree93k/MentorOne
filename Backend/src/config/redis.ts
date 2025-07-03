// import { createClient } from "redis";

// const redisClient = createClient();

// redisClient.on("error", (err) => console.error("Redis Client Error", err));

// redisClient.connect();

// export default redisClient;
// src/config/redis.ts
import { createClient, RedisClientType } from "@redis/client";

const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

redisClient.connect().catch((err) => {
  console.error("Failed to connect to Redis", err);
});

export default redisClient;
