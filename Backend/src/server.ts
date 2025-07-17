// // import dotenv from "dotenv";
// // import path from "path";
// // dotenv.config({ path: path.resolve(__dirname, "../.env") });

// // import express from "express";
// // import { createServer } from "http";
// // import cors from "cors";
// // import compression from "compression";
// // import morgan from "morgan";
// // import { connectDatabase } from "./config/database";
// // import { router } from "./routes/router";
// // import cookieParser from "cookie-parser";
// // import multer from "multer";
// // import { Server } from "socket.io";
// // import { createClient } from "@redis/client";
// // import { createAdapter } from "@socket.io/redis-adapter";
// // // import { TransferJob } from "./services/implementations/TransferJobService";
// // const requiredEnvVars = [
// //   "ACCESS_TOKEN_SECRET",
// //   "REFRESH_TOKEN_SECRET",
// //   "MONGO_URI",
// //   "STRIPE_SECRET_KEY",
// //   "STRIPE_WEBHOOK_SECRET",
// //   "REDIS_URL",
// //   "FRONTEND_URL",
// // ];

// // for (const envVar of requiredEnvVars) {
// //   if (!process.env[envVar]) {
// //     console.error(`Error: ${envVar} is not defined in environment variables`);
// //     process.exit(1);
// //   }
// // }

// // const app = express();
// // const httpServer = createServer(app);

// // // // Initialize TransferJob
// // // const transferJob = new TransferJob();
// // // transferJob.start();

// // // Initialize Socket.IO server
// // const io = new Server(httpServer, {
// //   cors: {
// //     origin: process.env.FRONTEND_URL || "http://localhost:5173",
// //     credentials: true,
// //     methods: ["GET", "POST"],
// //   },
// //   path: "/socket.io/",
// // });

// // // Redis Setup for Socket.IO
// // export const pubClient = createClient({ url: process.env.REDIS_URL });
// // export const subClient = pubClient.duplicate();

// // export const tokenClient = createClient({ url: process.env.REDIS_URL });

// // pubClient.on("error", (err) => console.error("Redis Pub Client Error:", err));
// // subClient.on("error", (err) => console.error("Redis Sub Client Error:", err));
// // tokenClient.on("error", (err) =>
// //   console.error("Redis Token Client Error:", err)
// // );

// // pubClient.on("connect", () => console.log("Redis Pub Client connected"));
// // subClient.on("connect", () => console.log("Redis Sub Client connected"));
// // tokenClient.on("connect", () => console.log("Redis Token Client connected"));

// // (async () => {
// //   try {
// //     await Promise.all([
// //       pubClient.connect(),
// //       subClient.connect(),
// //       tokenClient.connect(),
// //     ]);
// //     io.adapter(createAdapter(pubClient, subClient));
// //     console.log("Redis adapter connected for Socket.IO");
// //   } catch (err) {
// //     console.error("Failed to connect Redis adapter:", err);
// //   }
// // })();

// // // Define namespaces
// // const chatNamespace = io.of("/chat");
// // const videoNamespace = io.of("/video");
// // const notificationNamespace = io.of("/notifications");

// // // Initialize sockets with namespaces
// // import { initializeChatSocket } from "./utils/socket/chat";
// // import { initializeVideoSocket } from "./utils/socket/videoCall";
// // import { initializeNotificationSocket } from "./utils/socket/notification";

// // initializeChatSocket(chatNamespace)
// //   .then(() => console.log("Socket.IO /chat namespace initialized"))
// //   .catch((err) => console.error("Socket.IO /chat initialization failed:", err));

// // initializeVideoSocket(videoNamespace)
// //   .then(() => console.log("Socket.IO /video namespace initialized"))
// //   .catch((err) =>
// //     console.error("Socket.IO /video initialization failed:", err)
// //   );

// // initializeNotificationSocket(notificationNamespace)
// //   .then(() => console.log("Socket.IO /notifications namespace initialized"))
// //   .catch((err) =>
// //     console.error("Socket.IO /notifications initialization failed:", err)
// //   );

// // // Middleware
// // app.use(
// //   cors({
// //     origin: process.env.FRONTEND_URL || "http://localhost:5173",
// //     credentials: true,
// //     methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
// //     allowedHeaders: ["Content-Type", "Authorization", "Stripe-Signature"],
// //   })
// // );

// // app.use("/stripe/api/webhook", express.raw({ type: "application/json" }));
// // app.use(express.json());
// // app.use(cookieParser());
// // app.use(morgan("dev"));
// // app.use(compression());
// // app.use("/uploads", express.static("uploads"));

// // connectDatabase();

// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => cb(null, "uploads/"),
// //   filename: (req, file, cb) =>
// //     cb(null, Date.now() + path.extname(file.originalname)),
// // });

// // app.use("/", router);

// // app.get("/*", function (req, res) {
// //   res.sendFile(
// //     path.join(__dirname, "../../Frontend/index.html"),
// //     function (err) {
// //       if (err) {
// //         res.status(500).send("something wrong");
// //       }
// //     }
// //   );
// // });
// // const PORT = process.env.PORT || 5002;

// // httpServer.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// //   console.log("Environment:", process.env.NODE_ENV || "development");
// // });
// // process.on("SIGTERM", async () => {
// //   console.log("SIGTERM received, shutting down gracefully");
// //   await Promise.all([pubClient.quit(), subClient.quit(), tokenClient.quit()]);
// //   process.exit(0);
// // });

// // process.on("SIGINT", async () => {
// //   console.log("SIGINT received, shutting down gracefully");
// //   await Promise.all([pubClient.quit(), subClient.quit(), tokenClient.quit()]);
// //   process.exit(0);
// // });
// import dotenv from "dotenv";
// import path from "path";
// dotenv.config({ path: path.resolve(__dirname, "../.env") });

// import express from "express";
// import { createServer } from "http";
// import cors from "cors";
// import compression from "compression";
// import morgan from "morgan";
// import { connectDatabase } from "./config/database";
// import { router } from "./routes/router";
// import cookieParser from "cookie-parser";
// import multer from "multer";
// import { Server } from "socket.io";
// import { createClient } from "@redis/client";
// import { createAdapter } from "@socket.io/redis-adapter";

// const requiredEnvVars = [
//   "ACCESS_TOKEN_SECRET",
//   "REFRESH_TOKEN_SECRET",
//   "MONGO_URI",
//   "STRIPE_SECRET_KEY",
//   "STRIPE_WEBHOOK_SECRET",
//   "REDIS_URL",
//   "FRONTEND_URL",
// ];

// for (const envVar of requiredEnvVars) {
//   if (!process.env[envVar]) {
//     console.error(`Error: ${envVar} is not defined in environment variables`);
//     process.exit(1);
//   }
// }

// const app = express();
// const httpServer = createServer(app);

// // Redis Setup - Create clients
// export const pubClient = createClient({ url: process.env.REDIS_URL });
// export const subClient = pubClient.duplicate();
// export const tokenClient = createClient({ url: process.env.REDIS_URL });

// // Add connection status tracking
// let redisConnected = false;

// // Enhanced error handling and connection tracking
// pubClient.on("error", (err) => {
//   console.error("❌ Redis Pub Client Error:", err);
//   redisConnected = false;
// });

// subClient.on("error", (err) => {
//   console.error("❌ Redis Sub Client Error:", err);
//   redisConnected = false;
// });

// tokenClient.on("error", (err) => {
//   console.error("❌ Redis Token Client Error:", err);
//   redisConnected = false;
// });

// pubClient.on("connect", () => {
//   console.log("✅ Redis Pub Client connected");
// });

// subClient.on("connect", () => {
//   console.log("✅ Redis Sub Client connected");
// });

// tokenClient.on("connect", () => {
//   console.log("✅ Redis Token Client connected");
//   redisConnected = true;
// });

// tokenClient.on("ready", () => {
//   console.log("🚀 Redis Token Client is ready to use");
//   redisConnected = true;
// });

// // Function to initialize Redis connections
// const initializeRedis = async (): Promise<void> => {
//   try {
//     console.log("🔧 Initializing Redis connections...");

//     await Promise.all([
//       pubClient.connect(),
//       subClient.connect(),
//       // tokenClient.connect(),
//     ]);

//     // Test tokenClient specifically
//     await tokenClient.ping();
//     console.log("✅ Redis tokenClient ping successful");

//     redisConnected = true;
//     console.log("✅ All Redis clients connected successfully");

//     // Set up Socket.IO adapter
//     io.adapter(createAdapter(pubClient, subClient));
//     console.log("✅ Redis adapter connected for Socket.IO");
//   } catch (err) {
//     console.error("❌ Failed to connect Redis:", err);
//     redisConnected = false;
//     throw err;
//   }
// };

// // Export a function to check Redis status
// export const isRedisConnected = (): boolean => {
//   return redisConnected && tokenClient.isReady;
// };

// // Initialize Socket.IO server
// const io = new Server(httpServer, {
//   cors: {
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST"],
//   },
//   path: "/socket.io/",
// });

// // Define namespaces
// const chatNamespace = io.of("/chat");
// const videoNamespace = io.of("/video");
// const notificationNamespace = io.of("/notifications");

// // Middleware
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "Stripe-Signature"],
//   })
// );

// app.use("/stripe/api/webhook", express.raw({ type: "application/json" }));
// app.use(express.json());
// app.use(cookieParser());
// app.use(morgan("dev"));
// app.use(compression());
// app.use("/uploads", express.static("uploads"));

// // Multer setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) =>
//     cb(null, Date.now() + path.extname(file.originalname)),
// });

// // Add health check endpoint
// app.get("/health", (req, res) => {
//   res.json({
//     status: "ok",
//     redis: isRedisConnected(),
//     timestamp: new Date().toISOString(),
//   });
// });

// // Routes
// app.use("/", router);

// app.get("/*", function (req, res) {
//   res.sendFile(
//     path.join(__dirname, "../../Frontend/index.html"),
//     function (err) {
//       if (err) {
//         res.status(500).send("something wrong");
//       }
//     }
//   );
// });

// // Main initialization function
// const startServer = async (): Promise<void> => {
//   try {
//     // 1. Connect to database
//     await connectDatabase();
//     console.log("✅ Database connected");

//     // 2. Initialize Redis connections
//     await initializeRedis();
//     console.log("✅ Redis initialized");

//     // 3. Initialize Socket.IO namespaces
//     const { initializeChatSocket } = await import("./utils/socket/chat");
//     const { initializeVideoSocket } = await import("./utils/socket/videoCall");
//     const { initializeNotificationSocket } = await import(
//       "./utils/socket/notification"
//     );

//     await initializeChatSocket(chatNamespace);
//     console.log("✅ Socket.IO /chat namespace initialized");

//     await initializeVideoSocket(videoNamespace);
//     console.log("✅ Socket.IO /video namespace initialized");

//     await initializeNotificationSocket(notificationNamespace);
//     console.log("✅ Socket.IO /notifications namespace initialized");

//     // 4. Start HTTP server
//     const PORT = process.env.PORT || 5002;
//     httpServer.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//       console.log("🌍 Environment:", process.env.NODE_ENV || "development");
//       console.log("✅ All services initialized successfully");
//     });
//   } catch (error) {
//     console.error("❌ Failed to start server:", error);
//     process.exit(1);
//   }
// };

// // Graceful shutdown
// // const gracefulShutdown = async (signal: string): Promise<void> => {
// //   console.log(`${signal} received, shutting down gracefully`);
// //   try {
// //     // Close HTTP server
// //     httpServer.close();

// //     // Close Redis connections
// //     await Promise.all([pubClient.quit(), subClient.quit(), tokenClient.quit()]);

// //     console.log("✅ Graceful shutdown completed");
// //     process.exit(0);
// //   } catch (error) {
// //     console.error("❌ Error during shutdown:", error);
// //     process.exit(1);
// //   }
// // };

// // process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
// // process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// // // Start the server
// // startServer().catch((error) => {
// //   console.error("❌ Failed to start server:", error);
// //   process.exit(1);
// // });

// const gracefulShutdown = async (signal: string): Promise<void> => {
//   console.log(`${signal} received, shutting down gracefully`);
//   try {
//     // Import and disconnect token service
//     const RedisTokenService = (
//       await import("./services/implementations/RedisTokenService")
//     ).default;
//     await RedisTokenService.disconnect();

//     // Close other Redis connections
//     await Promise.all([pubClient.quit(), subClient.quit()]);

//     console.log("✅ Graceful shutdown completed");
//     process.exit(0);
//   } catch (error) {
//     console.error("❌ Error during shutdown:", error);
//     process.exit(1);
//   }
// };
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

// Redis Setup - Only for Socket.IO now (since tokens have their own client)
export const pubClient = createClient({ url: process.env.REDIS_URL });
export const subClient = pubClient.duplicate();

let redisConnected = false;

// Enhanced error handling and connection tracking
pubClient.on("error", (err) => {
  console.error("❌ Redis Pub Client Error:", err);
  redisConnected = false;
});

subClient.on("error", (err) => {
  console.error("❌ Redis Sub Client Error:", err);
  redisConnected = false;
});

pubClient.on("connect", () => {
  console.log("✅ Redis Pub Client connected");
});

subClient.on("connect", () => {
  console.log("✅ Redis Sub Client connected");
  redisConnected = true;
});

pubClient.on("ready", () => {
  console.log("🚀 Redis Pub Client is ready to use");
  redisConnected = true;
});

// Function to initialize Redis connections (only for Socket.IO)
const initializeRedis = async (): Promise<void> => {
  try {
    console.log("🔧 Initializing Redis connections for Socket.IO...");

    await Promise.all([pubClient.connect(), subClient.connect()]);

    redisConnected = true;
    console.log("✅ Socket.IO Redis clients connected successfully");

    // Set up Socket.IO adapter
    io.adapter(createAdapter(pubClient, subClient));
    console.log("✅ Redis adapter connected for Socket.IO");
  } catch (err) {
    console.error("❌ Failed to connect Socket.IO Redis:", err);
    redisConnected = false;
    throw err;
  }
};

// Export a function to check Redis status (for Socket.IO)
export const isRedisConnected = (): boolean => {
  return redisConnected;
};

// Initialize Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
  path: "/socket.io/",
});

// Define namespaces
const chatNamespace = io.of("/chat");
const videoNamespace = io.of("/video");
const notificationNamespace = io.of("/notifications");

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

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

// Add health check endpoint
app.get("/health", async (req, res) => {
  try {
    // Dynamically import token service for health check
    const { default: RedisTokenService } = await import(
      "./services/implementations/RedisTokenService"
    );

    res.json({
      status: "ok",
      socketIORedis: isRedisConnected(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.json({
      status: "partial",
      socketIORedis: isRedisConnected(),
      tokenServiceError: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Routes
app.use("/", router);

app.get("/*", function (req, res) {
  res.sendFile(
    path.join(__dirname, "../../Frontend/index.html"),
    function (err) {
      if (err) {
        res.status(500).send("something wrong");
      }
    }
  );
});

// Main initialization function
const startServer = async (): Promise<void> => {
  try {
    console.log("🚀 Starting server initialization...");

    // 1. Connect to database
    console.log("📄 Connecting to database...");
    await connectDatabase();
    console.log("✅ Database connected");

    // 2. Initialize Redis connections for Socket.IO
    console.log("🔧 Initializing Socket.IO Redis...");
    await initializeRedis();
    console.log("✅ Socket.IO Redis initialized");

    // 3. Test token service Redis connection (optional - will initialize on first use)
    console.log("🔧 Token service will initialize on first use...");

    // 4. Initialize Socket.IO namespaces
    console.log("🌐 Initializing Socket.IO namespaces...");

    const { initializeChatSocket } = await import("./utils/socket/chat");
    const { initializeVideoSocket } = await import("./utils/socket/videoCall");
    const { initializeNotificationSocket } = await import(
      "./utils/socket/notification"
    );

    await initializeChatSocket(chatNamespace);
    console.log("✅ Socket.IO /chat namespace initialized");

    await initializeVideoSocket(videoNamespace);
    console.log("✅ Socket.IO /video namespace initialized");

    await initializeNotificationSocket(notificationNamespace);
    console.log("✅ Socket.IO /notifications namespace initialized");

    // 5. Start HTTP server
    const PORT = process.env.PORT || 5002;
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log("🌍 Environment:", process.env.NODE_ENV || "development");
      console.log("🎯 Frontend URL:", process.env.FRONTEND_URL);
      console.log("✅ All services initialized successfully");
      console.log("🔗 Health check: http://localhost:" + PORT + "/health");
      console.log(
        "🔗 Admin login: http://localhost:" + PORT + "/admin/auth/login"
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`${signal} received, shutting down gracefully`);
  try {
    // Try to disconnect token service gracefully
    try {
      const { default: RedisTokenService } = await import(
        "./services/implementations/RedisTokenService"
      );
      console.log("🔧 Disconnecting token service...");
      await RedisTokenService.disconnect();
    } catch (tokenError) {
      console.warn(
        "⚠️ Could not disconnect token service:",
        tokenError.message
      );
    }

    // Close Socket.IO Redis connections
    console.log("🔧 Disconnecting Socket.IO Redis...");
    await Promise.all([pubClient.quit(), subClient.quit()]);

    // Close HTTP server
    console.log("🔧 Closing HTTP server...");
    httpServer.close();

    console.log("✅ Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Start the server
startServer().catch((error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});
