import { createClient, RedisClientType } from "@redis/client";
import { logger } from "../utils/logger";
import { config } from "./env";

export const pubClient: RedisClientType = createClient({
  url: config.redisUrl,
});
export const subClient: RedisClientType = pubClient.duplicate();
export const tokenClient: RedisClientType = createClient({
  url: config.redisUrl,
});

pubClient.on("error", (err) =>
  logger.error("Redis Pub Client Error:", { error: err.message })
);
subClient.on("error", (err) =>
  logger.error("Redis Sub Client Error:", { error: err.message })
);
tokenClient.on("error", (err) =>
  logger.error("Redis Token Client Error:", { error: err.message })
);

pubClient.on("connect", () =>
  logger.info("Redis Pub Client connected", { isOpen: pubClient.isOpen })
);
subClient.on("connect", () =>
  logger.info("Redis Sub Client connected", { isOpen: subClient.isOpen })
);
tokenClient.on("connect", () =>
  logger.info("Redis Token Client connected", { isOpen: tokenClient.isOpen })
);
tokenClient.on("ready", () =>
  logger.info("Redis Token Client ready", { isOpen: tokenClient.isOpen })
);

export async function connectRedisClients(): Promise<void> {
  const maxRetries = 3;
  const timeoutMs = 5000; // 5 seconds timeout per attempt
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      logger.info(
        `Connecting Redis clients (attempt ${attempts + 1}/${maxRetries})...`
      );

      // Create a timeout promise
      const timeout = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Redis connection timed out")),
          timeoutMs
        )
      );

      // Connect all clients with timeout
      await Promise.race([
        Promise.all([
          pubClient.connect(),
          subClient.connect(),
          tokenClient.connect(),
        ]),
        timeout,
      ]);

      // Verify all clients are connected
      if (!pubClient.isOpen || !subClient.isOpen || !tokenClient.isOpen) {
        throw new Error("One or more Redis clients failed to open");
      }

      logger.info("Redis clients connected successfully", {
        pubClientOpen: pubClient.isOpen,
        subClientOpen: subClient.isOpen,
        tokenClientOpen: tokenClient.isOpen,
      });
      return;
    } catch (err) {
      attempts++;
      logger.error(
        `Failed to connect Redis clients (attempt ${attempts}/${maxRetries})`,
        {
          error: err instanceof Error ? err.message : String(err),
        }
      );
      if (attempts >= maxRetries) {
        throw new Error(
          "Failed to connect Redis clients after maximum retries"
        );
      }
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}
