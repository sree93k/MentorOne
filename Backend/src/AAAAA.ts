// import express from "express";
// import { createServer } from "http";
// import cors from "cors";
// import compression from "compression";
// import morgan from "morgan";
// import { connectDatabase } from "./config/database";
// import { router } from "./routes/router";
// import cookieParser from "cookie-parser";
// import multer from "multer";
// import { Server } from "socket.io"; // Import Server from socket.io

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

// // Initialize a single Socket.IO server instance
// const io = new Server(httpServer, {
//   cors: {
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST"],
//   },
// });

// // Initialize Socket.IO namespaces
// import { initializeChatSocket } from "./utils/socket/chat";
// import { initializeVideoSocket } from "./utils/socket/videoCall";
// import { initializeNotificationSocket } from "./utils/socket/notification";

// // Pass the single `io` instance to each namespace initializer
// initializeChatSocket(io)
//   .then(() => console.log("Socket.IO (chat) initialized"))
//   .catch((err) =>
//     console.error("Socket.IO (chat) initialization failed:", err)
//   );

// initializeVideoSocket(io)
//   .then(() => console.log("Socket.IO (video call) initialized"))
//   .catch((err) =>
//     console.error("Socket.IO (video call) initialization failed:", err)
//   );

// initializeNotificationSocket(io)
//   .then(() => console.log("Socket.IO (notifications) initialized"))
//   .catch((err) =>
//     console.error("Socket.IO (notifications) initialization failed:", err)
//   );

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

// connectDatabase();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) =>
//     cb(null, Date.now() + path.extname(file.originalname)),
// });

// const upload = multer({ storage });

// app.use("/", router);

// const PORT = process.env.PORT || 5002;
// httpServer.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log("Environment:", process.env.NODE_ENV || "development");
// });
