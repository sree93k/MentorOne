// import {
//   reminderQueue,
//   ReminderType,
//   ReminderJobData,
// } from "../services/queue/ReminderQueue";
// import { Job } from "bull";

// export interface ScheduleRemindersParams {
//   bookingId: string;
//   menteeId: string;
//   mentorId: string;
//   bookingDate: string;
//   startTime: string;
//   serviceName: string;
//   mentorName: string;
//   menteeName: string;
// }

// export class ReminderScheduler {
//   static async scheduleBookingReminders(
//     params: ScheduleRemindersParams
//   ): Promise<{ [key: string]: string }> {
//     const {
//       bookingId,
//       menteeId,
//       mentorId,
//       bookingDate,
//       startTime,
//       serviceName,
//       mentorName,
//       menteeName,
//     } = params;

//     console.log(`📅 Scheduling reminders for booking ${bookingId}`);

//     const bookingDateTime = new Date(
//       `${bookingDate}T${this.convertTo24Hour(startTime)}`
//     );
//     const now = new Date();

//     const jobIds: { [key: string]: string } = {};

//     // Calculate reminder times
//     const oneHourBefore = new Date(bookingDateTime.getTime() - 60 * 60 * 1000);
//     const thirtyMinBefore = new Date(
//       bookingDateTime.getTime() - 30 * 60 * 1000
//     );
//     // const thirtyMinBefore = new Date(bookingDateTime.getTime() - 1 * 60 * 1000); //development
//     const tenMinBefore = new Date(bookingDateTime.getTime() - 10 * 60 * 1000);
//     const sessionStart = new Date(bookingDateTime.getTime());

//     const baseJobData: ReminderJobData = {
//       bookingId,
//       menteeId,
//       mentorId,
//       bookingDate,
//       startTime,
//       serviceName,
//       mentorName,
//       menteeName,
//       reminderType: ReminderType.THIRTY_MIN_BEFORE, // will be overridden
//     };

//     try {
//       // Schedule 1 hour reminder (only if more than 1 hour away)
//       if (oneHourBefore > now) {
//         const job = await reminderQueue.add(
//           ReminderType.ONE_HOUR_BEFORE,
//           { ...baseJobData, reminderType: ReminderType.ONE_HOUR_BEFORE },
//           {
//             delay: oneHourBefore.getTime() - now.getTime(),
//             priority: 5,
//           }
//         );
//         jobIds.oneHourJob = job.id.toString();
//         console.log(`⏰ Scheduled 1-hour reminder: ${job.id}`);
//       }

//       // Schedule 30 min reminder (only if more than 30 min away)
//       if (thirtyMinBefore > now) {
//         const job = await reminderQueue.add(
//           ReminderType.THIRTY_MIN_BEFORE,
//           { ...baseJobData, reminderType: ReminderType.THIRTY_MIN_BEFORE },
//           {
//             delay: thirtyMinBefore.getTime() - now.getTime(),
//             priority: 8,
//           }
//         );
//         jobIds.thirtyMinJob = job.id.toString();
//         console.log(`🔔 Scheduled 30-min reminder: ${job.id}`);
//       }

//       // Schedule 10 min reminder (only if more than 10 min away)
//       if (tenMinBefore > now) {
//         const job = await reminderQueue.add(
//           ReminderType.TEN_MIN_BEFORE,
//           { ...baseJobData, reminderType: ReminderType.TEN_MIN_BEFORE },
//           {
//             delay: tenMinBefore.getTime() - now.getTime(),
//             priority: 9,
//           }
//         );
//         jobIds.tenMinJob = job.id.toString();
//         console.log(`🚨 Scheduled 10-min reminder: ${job.id}`);
//       }

//       // Schedule session start reminder (only if in future)
//       if (sessionStart > now) {
//         const job = await reminderQueue.add(
//           ReminderType.SESSION_STARTED,
//           { ...baseJobData, reminderType: ReminderType.SESSION_STARTED },
//           {
//             delay: sessionStart.getTime() - now.getTime(),
//             priority: 10,
//           }
//         );
//         jobIds.sessionStartJob = job.id.toString();
//         console.log(`🎯 Scheduled session start reminder: ${job.id}`);
//       }

//       console.log(
//         `✅ Successfully scheduled ${
//           Object.keys(jobIds).length
//         } reminders for booking ${bookingId}`
//       );
//       return jobIds;
//     } catch (error: any) {
//       console.error(
//         `❌ Failed to schedule reminders for booking ${bookingId}:`,
//         error.message
//       );
//       throw error;
//     }
//   }

//   static async cancelBookingReminders(jobIds: {
//     [key: string]: string;
//   }): Promise<void> {
//     console.log("🗑️ Cancelling reminder jobs:", jobIds);

//     try {
//       const cancelPromises = Object.entries(jobIds).map(
//         async ([type, jobId]) => {
//           if (jobId) {
//             try {
//               const job = await reminderQueue.getJob(jobId);
//               if (
//                 job &&
//                 ["waiting", "delayed", "active"].includes(await job.getState())
//               ) {
//                 await job.remove();
//                 console.log(`✅ Cancelled ${type} job: ${jobId}`);
//               }
//             } catch (error: any) {
//               console.error(
//                 `❌ Failed to cancel ${type} job ${jobId}:`,
//                 error.message
//               );
//             }
//           }
//         }
//       );

//       await Promise.all(cancelPromises);
//       console.log("✅ Finished cancelling reminder jobs");
//     } catch (error: any) {
//       console.error("❌ Failed to cancel some reminder jobs:", error.message);
//       throw error;
//     }
//   }

//   private static convertTo24Hour(time12h: string): string {
//     const [time, modifier] = time12h.split(" ");
//     let [hours, minutes] = time.split(":");

//     if (hours === "12") {
//       hours = "00";
//     }

//     if (modifier.toUpperCase() === "PM") {
//       hours = (parseInt(hours, 10) + 12).toString();
//     }

//     return `${hours.padStart(2, "0")}:${minutes}:00`;
//   }
// }
import {
  reminderQueue,
  ReminderType,
  ReminderJobData,
} from "../services/queue/ReminderQueue";
import { Job } from "bull";

export interface ScheduleRemindersParams {
  bookingId: string;
  menteeId: string;
  mentorId: string;
  bookingDate: string;
  startTime: string;
  serviceName: string;
  mentorName: string;
  menteeName: string;
}

// 📍 ADD DEVELOPMENT INTERVALS
const DEV_INTERVALS = {
  oneHour: 2 * 60 * 1000, // 2 minutes instead of 1 hour
  thirtyMin: 1 * 60 * 1000, // 1 minute instead of 30 minutes
  tenMin: 30 * 1000, // 30 seconds instead of 10 minutes
  sessionStart: 10 * 1000, // 10 seconds after "start time"
};

const PRODUCTION_INTERVALS = {
  oneHour: 60 * 60 * 1000, // 1 hour
  thirtyMin: 30 * 60 * 1000, // 30 minutes
  tenMin: 10 * 60 * 1000, // 10 minutes
  sessionStart: 0, // Exactly at session start
};

export class ReminderScheduler {
  static async scheduleBookingReminders(
    params: ScheduleRemindersParams
  ): Promise<{ [key: string]: string }> {
    const {
      bookingId,
      menteeId,
      mentorId,
      bookingDate,
      startTime,
      serviceName,
      mentorName,
      menteeName,
    } = params;

    console.log(`📅 Scheduling reminders for booking ${bookingId}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || "development"}`);

    const bookingDateTime = new Date(
      `${bookingDate}T${this.convertTo24Hour(startTime)}`
    );
    const now = new Date();

    console.log(`📅 Booking DateTime: ${bookingDateTime.toISOString()}`);
    console.log(`⏰ Current Time: ${now.toISOString()}`);

    // 📍 USE DEVELOPMENT INTERVALS FOR TESTING
    const isDevelopment = process.env.NODE_ENV !== "production";
    const intervals = isDevelopment ? DEV_INTERVALS : PRODUCTION_INTERVALS;

    console.log(
      `🔧 Using ${isDevelopment ? "DEVELOPMENT" : "PRODUCTION"} intervals:`,
      intervals
    );

    const jobIds: { [key: string]: string } = {};

    // Calculate reminder times using the appropriate intervals
    const oneHourBefore = new Date(
      bookingDateTime.getTime() - intervals.oneHour
    );
    const thirtyMinBefore = new Date(
      bookingDateTime.getTime() - intervals.thirtyMin
    );
    const tenMinBefore = new Date(bookingDateTime.getTime() - intervals.tenMin);
    const sessionStart = new Date(
      bookingDateTime.getTime() + intervals.sessionStart
    );

    console.log(`⏰ Reminder times calculated:`);
    console.log(`  - 1 hour before: ${oneHourBefore.toISOString()}`);
    console.log(`  - 30 min before: ${thirtyMinBefore.toISOString()}`);
    console.log(`  - 10 min before: ${tenMinBefore.toISOString()}`);
    console.log(`  - Session start: ${sessionStart.toISOString()}`);

    const baseJobData: ReminderJobData = {
      bookingId,
      menteeId,
      mentorId,
      bookingDate,
      startTime,
      serviceName,
      mentorName,
      menteeName,
      reminderType: ReminderType.THIRTY_MIN_BEFORE, // will be overridden
    };

    try {
      // Schedule 1 hour reminder (only if more than required time away)
      if (oneHourBefore > now) {
        const delay = oneHourBefore.getTime() - now.getTime();
        console.log(
          `⏰ Scheduling 1-hour reminder with delay: ${delay}ms (${Math.round(
            delay / 1000
          )}s)`
        );

        const job = await reminderQueue.add(
          ReminderType.ONE_HOUR_BEFORE,
          { ...baseJobData, reminderType: ReminderType.ONE_HOUR_BEFORE },
          {
            delay: delay,
            priority: 5,
          }
        );
        jobIds.oneHourJob = job.id.toString();
        console.log(`⏰ Scheduled 1-hour reminder: ${job.id}`);
      } else {
        console.log(`⚠️ Skipping 1-hour reminder (time has passed)`);
      }

      // Schedule 30 min reminder (only if more than required time away)
      if (thirtyMinBefore > now) {
        const delay = thirtyMinBefore.getTime() - now.getTime();
        console.log(
          `🔔 Scheduling 30-min reminder with delay: ${delay}ms (${Math.round(
            delay / 1000
          )}s)`
        );

        const job = await reminderQueue.add(
          ReminderType.THIRTY_MIN_BEFORE,
          { ...baseJobData, reminderType: ReminderType.THIRTY_MIN_BEFORE },
          {
            delay: delay,
            priority: 8,
          }
        );
        jobIds.thirtyMinJob = job.id.toString();
        console.log(`🔔 Scheduled 30-min reminder: ${job.id}`);
      } else {
        console.log(`⚠️ Skipping 30-min reminder (time has passed)`);
      }

      // Schedule 10 min reminder (only if more than required time away)
      if (tenMinBefore > now) {
        const delay = tenMinBefore.getTime() - now.getTime();
        console.log(
          `🚨 Scheduling 10-min reminder with delay: ${delay}ms (${Math.round(
            delay / 1000
          )}s)`
        );

        const job = await reminderQueue.add(
          ReminderType.TEN_MIN_BEFORE,
          { ...baseJobData, reminderType: ReminderType.TEN_MIN_BEFORE },
          {
            delay: delay,
            priority: 9,
          }
        );
        jobIds.tenMinJob = job.id.toString();
        console.log(`🚨 Scheduled 10-min reminder: ${job.id}`);
      } else {
        console.log(`⚠️ Skipping 10-min reminder (time has passed)`);
      }

      // Schedule session start reminder (only if in future)
      if (sessionStart > now) {
        const delay = sessionStart.getTime() - now.getTime();
        console.log(
          `🎯 Scheduling session start reminder with delay: ${delay}ms (${Math.round(
            delay / 1000
          )}s)`
        );

        const job = await reminderQueue.add(
          ReminderType.SESSION_STARTED,
          { ...baseJobData, reminderType: ReminderType.SESSION_STARTED },
          {
            delay: delay,
            priority: 10,
          }
        );
        jobIds.sessionStartJob = job.id.toString();
        console.log(`🎯 Scheduled session start reminder: ${job.id}`);
      } else {
        console.log(`⚠️ Skipping session start reminder (time has passed)`);
      }

      console.log(
        `✅ Successfully scheduled ${
          Object.keys(jobIds).length
        } reminders for booking ${bookingId}:`,
        jobIds
      );
      return jobIds;
    } catch (error: any) {
      console.error(
        `❌ Failed to schedule reminders for booking ${bookingId}:`,
        error.message
      );
      throw error;
    }
  }

  static async cancelBookingReminders(jobIds: {
    [key: string]: string;
  }): Promise<void> {
    console.log("🗑️ Cancelling reminder jobs:", jobIds);

    try {
      const cancelPromises = Object.entries(jobIds).map(
        async ([type, jobId]) => {
          if (jobId) {
            try {
              const job = await reminderQueue.getJob(jobId);
              if (
                job &&
                ["waiting", "delayed", "active"].includes(await job.getState())
              ) {
                await job.remove();
                console.log(`✅ Cancelled ${type} job: ${jobId}`);
              }
            } catch (error: any) {
              console.error(
                `❌ Failed to cancel ${type} job ${jobId}:`,
                error.message
              );
            }
          }
        }
      );

      await Promise.all(cancelPromises);
      console.log("✅ Finished cancelling reminder jobs");
    } catch (error: any) {
      console.error("❌ Failed to cancel some reminder jobs:", error.message);
      throw error;
    }
  }

  private static convertTo24Hour(time12h: string): string {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");

    if (hours === "12") {
      hours = "00";
    }

    if (modifier.toUpperCase() === "PM") {
      hours = (parseInt(hours, 10) + 12).toString();
    }

    return `${hours.padStart(2, "0")}:${minutes}:00`;
  }
}
