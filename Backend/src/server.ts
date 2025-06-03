import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
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
// import { TransferJob } from "./services/implementations/TransferJobService";
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
    console.error(`Error: ${envVar} is not defined in environment variables`);
    process.exit(1);
  }
}

const app = express();
const httpServer = createServer(app);

// // Initialize TransferJob
// const transferJob = new TransferJob();
// transferJob.start();

// Initialize Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
  path: "/socket.io/",
});

// Redis Setup for Socket.IO
export const pubClient = createClient({ url: process.env.REDIS_URL });
export const subClient = pubClient.duplicate();

pubClient.on("error", (err) => console.error("Redis Pub Client Error:", err));
subClient.on("error", (err) => console.error("Redis Sub Client Error:", err));
pubClient.on("connect", () => console.log("Redis Pub Client connected"));
subClient.on("connect", () => console.log("Redis Sub Client connected"));

(async () => {
  try {
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    console.log("Redis adapter connected for Socket.IO");
  } catch (err) {
    console.error("Failed to connect Redis adapter:", err);
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
  .then(() => console.log("Socket.IO /chat namespace initialized"))
  .catch((err) => console.error("Socket.IO /chat initialization failed:", err));

initializeVideoSocket(videoNamespace)
  .then(() => console.log("Socket.IO /video namespace initialized"))
  .catch((err) =>
    console.error("Socket.IO /video initialization failed:", err)
  );

initializeNotificationSocket(notificationNamespace)
  .then(() => console.log("Socket.IO /notifications namespace initialized"))
  .catch((err) =>
    console.error("Socket.IO /notifications initialization failed:", err)
  );

// Middleware
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
app.use(morgan("dev"));
app.use(compression());
app.use("/uploads", express.static("uploads"));

connectDatabase();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

app.use("/", router);

const PORT = process.env.PORT || 5002;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Environment:", process.env.NODE_ENV || "development");
});
