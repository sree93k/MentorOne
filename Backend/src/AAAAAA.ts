// import dotenv from "dotenv";
// import path from "path";
// dotenv.config({ path: path.resolve(__dirname, "../.env") });

// import express from "express";
// import cors from "cors";
// import compression from "compression";
// import morgan from "morgan";
// import { connectDatabase } from "./config/database";
// import { router } from "./routes/router";
// import cookieParser from "cookie-parser";
// import multer from "multer";

// const requiredEnvVars = [
//   "ACCESS_TOKEN_SECRET",
//   "REFRESH_TOKEN_SECRET",
//   "MONGO_URI",
//   "STRIPE_SECRET_KEY",
//   "STRIPE_WEBHOOK_SECRET",
// ];
// for (const envVar of requiredEnvVars) {
//   if (!process.env[envVar]) {
//     console.error(`Error: ${envVar} is not defined in environment variables`);
//     process.exit(1);
//   }
// }

// const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "Stripe-Signature"],
//   })
// );
// app.use("/user/webhook", express.raw({ type: "application/json" }));
// app.use(express.json());
// app.use(cookieParser());
// app.use(morgan("dev"));
// app.use(compression());
// app.use("/uploads", express.static("uploads"));

// connectDatabase();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage });

// app.use("/", router);

// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log("Environment:", process.env.NODE_ENV || "development");
// });
