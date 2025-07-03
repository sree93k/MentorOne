// src/utils/logger.ts
import { createLogger, format, transports } from "winston";
import "winston-mongodb";

import path from "path";

// Import environment variables
const mongoUri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/mentorOne";
const logLevel = process.env.LOG_LEVEL || "info";

// Create the logger
const logger = createLogger({
  level: logLevel,
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "mentor-one-api" },
  transports: [
    // Console transport for development
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    }),

    // File transport for errors
    new transports.File({
      filename: path.join(__dirname, "../../logs/error.log"),
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // File transport for all logs
    new transports.File({
      filename: path.join(__dirname, "../../logs/combined.log"),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    //MongoDB transport
    new transports.MongoDB({
      level: "info",
      db: mongoUri,
      collection: "logs",
      tryReconnect: true,
      format: format.combine(format.timestamp(), format.json()),
      // Optional capped collection (limits the size of the logs collection)
      capped: true,
      cappedSize: 10000000, // 10MB
      cappedMax: 5000,
    }),
  ],
  // Handle uncaught exceptions
  exceptionHandlers: [
    new transports.File({
      filename: path.join(__dirname, "../../logs/exceptions.log"),
    }),
  ],
  // Prevents Winston from exiting after handling an uncaught exception
  exitOnError: false,
});

// Create a stream object for Morgan integration
const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export { logger, stream };
export default logger;
