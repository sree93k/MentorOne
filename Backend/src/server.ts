import express from "express";
import { createServer } from "http";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import { connectDatabase } from "./config/database";
import { router } from "./routes/router";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import helmet from "helmet";
import { logger, stream } from "./utils/logger";
import { AppError } from "./errors/appError";
import { errorHandler } from "./errors/errorHandler";
import { config } from "./config/env";
import { initDIContainer } from "./diContainer/diContainer";
import { setServerStarted } from "./diContainer/diContainer";
import {
  pubClient,
  subClient,
  tokenClient,
  connectRedisClients,
} from "./config/redisClients";

async function initializeServer() {
  try {
    // Connect Redis clients first
    logger.info("Step 1: Connecting Redis clients...");
    await connectRedisClients();
    logger.info("Step 1: Redis clients connected successfully");

    // Initialize express and HTTP server
    logger.info("Step 2: Initializing Express and HTTP server...");
    const app = express();
    const httpServer = createServer(app);
    logger.info("Step 2: Express and HTTP server initialized");

    // Initialize Socket.IO server
    console.log("stepss 1");
    logger.info("Step 3: Initializing Socket.IO server...", config.frontendUrl);
    console.log("stepss 2");

    logger.info("Step 3a: Creating Socket.IO server instance...");
    console.log("stepss 3");
    const io = new Server(httpServer, {
      cors: {
        origin: config.frontendUrl,
        credentials: true,
        methods: ["GET", "POST"],
      },
      path: "/socket.io/",
    });
    console.log("stepss 4");
    logger.info("Step 3b: Socket.IO server instance created");
    logger.info("Step 3: Socket.IO server initialized");
    console.log("stepss 5");
    // Initialize DI container - THIS IS WHERE THE ERROR OCCURS
    logger.info("Step 4: Starting DI container initialization...");
    logger.info("Step 4a: Attempting to import diContainer module...");
    console.log("stepss 6");
    logger.info("Step 4: Starting DI container initialization...");
    console.log("stepss 7");
    // try {
    //   console.log("stepss 8");
    //   await initDIContainer();
    //   logger.info("Step 4: DI container initialized successfully");
    // } catch (initError) {
    //   console.log("stepss 9");
    //   logger.error("Step 4: Failed to initialize DI container", {
    //     error:
    //       initError instanceof Error ? initError.message : String(initError),
    //     stack: initError instanceof Error ? initError.stack : undefined,
    //   });
    //   throw initError;
    // }
    try {
      console.log("stepss 7");
      await initDIContainer();
      console.log("stepss 8 - DI container initialized");
      logger.info("Step 4: DI container initialized successfully");
    } catch (initError) {
      console.log("stepss 9 - DI container error:", initError);
      logger.error("Step 4: Failed to initialize DI container", {
        error:
          initError instanceof Error ? initError.message : String(initError),
        stack: initError instanceof Error ? initError.stack : undefined,
      });
      throw initError;
    }
    console.log("stepss 10");
    logger.info("Step 4b: Calling initDIContainer function...");
    try {
      await initDIContainer();
      logger.info("Step 4b: DI container initialized successfully");
    } catch (initError) {
      logger.error("Step 4b: Failed to initialize DI container", {
        error:
          initError instanceof Error ? initError.message : String(initError),
        stack: initError instanceof Error ? initError.stack : undefined,
      });
      console.log("stepss 10 throw");
      throw initError;
    }

    // Set up Socket.IO adapter
    logger.info("Step 5: Setting up Socket.IO Redis adapter...");
    io.adapter(createAdapter(pubClient, subClient));
    logger.info("Step 5: Redis adapter connected for Socket.IO");

    // Initialize socket namespaces
    logger.info("Step 6: Initializing socket namespaces...");
    await initializeSocketNamespaces(io);
    logger.info("Step 6: Socket namespaces initialized");

    // Middleware
    logger.info("Step 7: Setting up middleware...");
    app.use(helmet());
    app.use(
      cors({
        origin: config.frontendUrl,
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
    app.use("/uploads", express.static(path.join(__dirname, "../Uploads")));

    // Multer configuration
    const storage = multer.diskStorage({
      destination: (req, file, cb) =>
        cb(null, path.join(__dirname, "../Uploads")),
      filename: (req, file, cb) =>
        cb(null, `${Date.now()}${path.extname(file.originalname)}`),
    });
    const upload = multer({ storage });
    app.use(upload.any());
    logger.info("Step 7: Middleware setup complete");

    // Connect to MongoDB
    logger.info("Step 8: Connecting to MongoDB...");
    await connectDatabase().catch((err) =>
      logger.error("Failed to connect to MongoDB", { error: err.message })
    );
    logger.info("Step 8: MongoDB connection complete");

    logger.info("Step 9: Setting up routes...");
    app.use("/", router);

    // Serve frontend
    app.get("/*", (req, res, next) => {
      res.sendFile(path.join(__dirname, "../../Frontend/index.html"), (err) => {
        if (err) {
          next(
            new AppError(
              "Failed to serve frontend",
              500,
              "error",
              "FRONTEND_ERROR"
            )
          );
        }
      });
    });

    // Error handling middleware
    app.use(errorHandler);
    logger.info("Step 9: Routes and error handling setup complete");

    // Start server
    logger.info("Step 10: Starting HTTP server...");
    httpServer.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`, {
        environment: config.nodeEnv,
      });
    });
    logger.info("Step 10: Server initialization complete");
  } catch (err) {
    logger.error("DETAILED ERROR - Failed to initialize server", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      name: err instanceof Error ? err.name : undefined,
      cause: err instanceof Error ? err.cause : undefined,
    });

    // Log the specific module that failed
    if (err instanceof Error && err.message.includes("Cannot find module")) {
      const moduleMatch = err.message.match(/Cannot find module '([^']+)'/);
      if (moduleMatch) {
        const modulePath = moduleMatch[1];
        logger.error("MODULE NOT FOUND DETAILS", {
          missingModule: modulePath,
          currentWorkingDirectory: process.cwd(),
          nodeModulesPath: path.join(process.cwd(), "node_modules"),
          srcPath: path.join(process.cwd(), "src"),
        });

        // Check if the file exists
        const fs = require("fs");
        const possiblePaths = [
          modulePath,
          modulePath + ".ts",
          modulePath + ".js",
          modulePath + "/index.ts",
          modulePath + "/index.js",
        ];

        for (const checkPath of possiblePaths) {
          try {
            const exists = fs.existsSync(checkPath);
            logger.info(
              `File check: ${checkPath} - ${exists ? "EXISTS" : "NOT FOUND"}`
            );
          } catch (checkError) {
            logger.error(`Error checking file: ${checkPath}`, {
              error: checkError,
            });
          }
        }
      }
    }

    throw new AppError(
      "Failed to initialize server",
      500,
      "error",
      "SERVER_INIT_ERROR"
    );
  }
}

// Socket namespace initialization
async function initializeSocketNamespaces(io: Server): Promise<void> {
  const chatNamespace = io.of("/chat");
  const videoNamespace = io.of("/video");
  const notificationNamespace = io.of("/notifications");

  // Dynamic imports to avoid circular dependencies
  logger.info("Importing socket modules...");

  try {
    logger.info("Importing chat socket module...");
    const { initializeChatSocket } = await import("./utils/socket/chat.js");
    await initializeChatSocket(chatNamespace);
    logger.info("Socket.IO /chat namespace initialized");
  } catch (err) {
    logger.error("Socket.IO /chat initialization failed", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
  }

  try {
    logger.info("Importing video socket module...");
    const { initializeVideoSocket } = await import(
      "./utils/socket/videoCall.js"
    );
    await initializeVideoSocket(videoNamespace);
    logger.info("Socket.IO /video namespace initialized");
  } catch (err) {
    logger.error("Socket.IO /video initialization failed", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
  }

  try {
    logger.info("Importing notification socket module...");
    const { initializeNotificationSocket } = await import(
      "./utils/socket/notification"
    );
    await initializeNotificationSocket(notificationNamespace);
    logger.info("Socket.IO /notifications namespace initialized");
  } catch (err) {
    logger.error("Socket.IO /notifications initialization failed", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
  }
}

// // Start server
// async function startServer() {
//   try {
//     logger.info("=== SERVER STARTUP INITIATED ===");
//     await initializeServer();
//     logger.info("=== SERVER STARTUP COMPLETED ===");
//   } catch (error) {
//     logger.error("=== SERVER STARTUP FAILED ===", {
//       error: error instanceof Error ? error.message : String(error),
//       stack: error instanceof Error ? error.stack : undefined,
//     });
//     process.exit(1);
//   }
// }
// export async function startServer() {
//   try {
//     logger.info("=== SERVER STARTUP INITIATED ===");

//     // Step 1: Connect Redis clients FIRST
//     logger.info("Step 1: Connecting Redis clients...");
//     await connectRedisClients();
//     logger.info("Step 1: Redis clients connected successfully");

//     // Step 2: Initialize DI Container AFTER Redis is ready
//     logger.info("Step 2: Initializing DI Container...");
//     const container = await initDIContainer();
//     logger.info("Step 2: DI Container initialized successfully");

//     // Step 3: Continue with other initialization
//     logger.info("Step 3: Initializing Express and HTTP server...");
//     // ... rest of your startup code
//   } catch (error) {
//     logger.error("Server startup failed:", error);
//     process.exit(1);
//   }
// }
export async function startServer() {
  try {
    logger.info("=== SERVER STARTUP INITIATED ===");

    // Step 1: Connect Redis clients
    logger.info("Step 1: Connecting Redis clients...");
    await connectRedisClients();
    logger.info("Step 1: Redis clients connected successfully");

    // Step 2: Mark server as started
    setServerStarted(true);

    // Step 3: Initialize DI Container
    logger.info("Step 2: Initializing DI Container...");
    const container = await initDIContainer();
    logger.info("Step 2: DI Container initialized successfully");

    // Continue with rest of startup...
  } catch (error) {
    logger.error("Server startup failed:", error);
    process.exit(1);
  }
}

// Graceful shutdown handlers
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully");
  try {
    await Promise.all([pubClient.quit(), subClient.quit(), tokenClient.quit()]);
    process.exit(0);
  } catch (error) {
    logger.error("Error during shutdown", {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received, shutting down gracefully");
  try {
    await Promise.all([pubClient.quit(), subClient.quit(), tokenClient.quit()]);
    process.exit(0);
  } catch (error) {
    logger.error("Error during shutdown", {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
});

// Start the server
startServer();
