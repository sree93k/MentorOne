import Bull from "bull";
import { createClient } from "redis";

// Redis connection for Bull
const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD || undefined,
};

// Create queues for different reminder types
export const reminderQueue = new Bull("booking-reminders", {
  redis: redisConfig,
  defaultJobOptions: {
    removeOnComplete: 50, // Keep last 50 completed jobs
    removeOnFail: 100, // Keep last 100 failed jobs
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

export const cleanupQueue = new Bull("reminder-cleanup", {
  redis: redisConfig,
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 50,
    attempts: 2,
  },
});

// Job types
export enum ReminderType {
  ONE_HOUR_BEFORE = "one_hour_before",
  THIRTY_MIN_BEFORE = "thirty_min_before",
  TEN_MIN_BEFORE = "ten_min_before",
  SESSION_STARTED = "session_started",
}

export interface ReminderJobData {
  bookingId: string;
  menteeId: string;
  mentorId: string;
  reminderType: ReminderType;
  bookingDate: string;
  startTime: string;
  serviceName: string;
  mentorName: string;
  menteeName: string;
}
