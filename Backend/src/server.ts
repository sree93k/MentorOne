import dotenv from "dotenv";
import path from "path";

import express, { ErrorRequestHandler } from "express";
import { createServer } from "http";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import { connectDatabase } from "./config/database";
import { router } from "./routes/router";
import cookieParser from "cookie-parser";
import multer from "multer";
import { Server } from "socket.io";
import { createClient } from "@redis/client";
import { createAdapter } from "@socket.io/redis-adapter";
import helmet from "helmet";
import { logger, stream } from "./utils/logger";
import { AppError } from "./errors/appError";
import { errorHandler } from "./errors/errorHandler";
import { RedisTokenService } from "./services/implementations/RedisTokenService";
// import { TransferJob } from "./services/implementations/TransferJobService";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const requiredEnvVars = [
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "MONGO_URI",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "REDIS_URL",
  "FRONTEND_URL",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    logger.error(`Missing environment variable: ${envVar}`);
    throw new AppError(
      `Missing environment variable: ${envVar}`,
      500,
      "error",
      "MISSING_ENV_VAR"
    );
  }
}

const app = express();
const httpServer = createServer(app);

// // Initialize TransferJob
// const transferJob = new TransferJob();
// transferJob.start();

// Redis Setup for Socket.IO
export const pubClient = createClient({ url: process.env.REDIS_URL });
export const subClient = pubClient.duplicate();
export const tokenClient = createClient({ url: process.env.REDIS_URL });

pubClient.on("error", (err) => console.error("Redis Pub Client Error:", err));
subClient.on("error", (err) => console.error("Redis Sub Client Error:", err));
tokenClient.on("error", (err) =>
  console.error("Redis Token Client Error:", err)
);

pubClient.on("connect", () => console.log("Redis Pub Client connected"));
subClient.on("connect", () => console.log("Redis Sub Client connected"));
tokenClient.on("connect", () => console.log("Redis Token Client connected"));

// Initialize RedisTokenService
export const redisTokenService = new RedisTokenService(tokenClient);

// Initialize Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
  path: "/socket.io/",
});

(async () => {
  try {
    await Promise.all([
      pubClient.connect(),
      subClient.connect(),
      tokenClient.connect(),
    ]);
    io.adapter(createAdapter(pubClient, subClient));
    logger.info("Redis adapter connected for Socket.IO");
  } catch (err) {
    logger.error("Failed to connect Redis adapter", {
      error: err instanceof Error ? err.message : String(err),
    });
    throw new AppError(
      "Failed to connect Redis adapter",
      500,
      "error",
      "REDIS_ADAPTER_ERROR"
    );
  }
})();

// Define namespaces
const chatNamespace = io.of("/chat");
const videoNamespace = io.of("/video");
const notificationNamespace = io.of("/notifications");

// Initialize sockets with namespaces
import { initializeChatSocket } from "./utils/socket/chat";
import { initializeVideoSocket } from "./utils/socket/videoCall";
import { initializeNotificationSocket } from "./utils/socket/notification";

initializeChatSocket(chatNamespace)
  .then(() => logger.info("Socket.IO /chat namespace initialized"))
  .catch((err) =>
    logger.error("Socket.IO /chat initialization failed", {
      error: err.message,
    })
  );
initializeVideoSocket(videoNamespace)
  .then(() => logger.info("Socket.IO /video namespace initialized"))
  .catch((err) =>
    logger.error("Socket.IO /video initialization failed", {
      error: err.message,
    })
  );

initializeNotificationSocket(notificationNamespace)
  .then(() => logger.info("Socket.IO /notifications namespace initialized"))
  .catch((err) =>
    logger.error("Socket.IO /notifications initialization failed", {
      error: err.message,
    })
  );

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Stripe-Signature"],
  })
);
app.use("/stripe/api/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("combined", { stream }));
app.use(compression());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// app.use(errorHandler);
// connectDatabase();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });
app.use(upload.any());

// Connect to MongoDB
connectDatabase().catch((err) =>
  logger.error("Failed to connect to MongoDB", { error: err.message })
);

app.use("/", router);

// Serve frontend
app.get("/*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../../Frontend/index.html"), (err) => {
    if (err) {
      next(
        new AppError("Failed to serve frontend", 500, "error", "FRONTEND_ERROR")
      );
    }
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5002;
httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, {
    environment: process.env.NODE_ENV || "development",
  });
});

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully");
  await Promise.all([pubClient.quit(), subClient.quit(), tokenClient.quit()]);
  httpServer.close(() => process.exit(0));
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received, shutting down gracefully");
  await Promise.all([pubClient.quit(), subClient.quit(), tokenClient.quit()]);
  httpServer.close(() => process.exit(0));
});
