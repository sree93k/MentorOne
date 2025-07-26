import cron from "node-cron";
import { reminderQueue, cleanupQueue } from "../services/queue/ReminderQueue";
import Booking from "../models/bookingModel";

export class CleanupJobs {
  static initializeCleanupJobs() {
    console.log("🧹 Initializing cleanup jobs...");

    // Clean completed jobs every hour
    cron.schedule("0 * * * *", async () => {
      try {
        console.log("🧹 Running hourly queue cleanup...");
        await reminderQueue.clean(24 * 60 * 60 * 1000, "completed"); // Clean completed jobs older than 24 hours
        await reminderQueue.clean(7 * 24 * 60 * 60 * 1000, "failed"); // Clean failed jobs older than 7 days
        console.log("✅ Queue cleanup completed");
      } catch (error: any) {
        console.error("❌ Queue cleanup failed:", error.message);
      }
    });

    // Check for missed reminders every 10 minutes
    cron.schedule("*/10 * * * *", async () => {
      try {
        console.log("🔍 Checking for missed reminders...");
        await this.checkMissedReminders();
        console.log("✅ Missed reminder check completed");
      } catch (error: any) {
        console.error("❌ Missed reminder check failed:", error.message);
      }
    });

    // Clean old reminder status daily at 2 AM
    cron.schedule("0 2 * * *", async () => {
      try {
        console.log("🧹 Cleaning old reminder statuses...");
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        await Booking.updateMany(
          {
            bookingDate: { $lt: thirtyDaysAgo },
            status: { $in: ["completed", "cancelled"] },
          },
          {
            $unset: {
              reminderJobs: 1,
              reminderStatus: 1,
            },
          }
        );

        console.log("✅ Old reminder status cleanup completed");
      } catch (error: any) {
        console.error("❌ Reminder status cleanup failed:", error.message);
      }
    });
  }

  private static async checkMissedReminders() {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    // Find bookings starting within next hour that haven't received critical reminders
    const upcomingBookings = await Booking.find({
      bookingDate: {
        $gte: now,
        $lte: oneHourFromNow,
      },
      status: "confirmed",
      $or: [
        { "reminderStatus.thirtyMinSent": { $ne: true } },
        { "reminderStatus.tenMinSent": { $ne: true } },
      ],
    }).populate(
      "menteeId mentorId serviceId",
      "firstName lastName email title"
    );

    for (const booking of upcomingBookings) {
      try {
        const bookingTime = new Date(booking.bookingDate);
        const minutesUntilStart =
          (bookingTime.getTime() - now.getTime()) / (1000 * 60);

        // Send late 30-min reminder if within 35 minutes and not sent
        if (minutesUntilStart <= 35 && !booking.reminderStatus?.thirtyMinSent) {
          console.log(
            `⚠️ Sending late 30-min reminder for booking ${booking._id}`
          );
          // You can trigger immediate reminder job here
        }

        // Send late 10-min reminder if within 15 minutes and not sent
        if (minutesUntilStart <= 15 && !booking.reminderStatus?.tenMinSent) {
          console.log(
            `⚠️ Sending late 10-min reminder for booking ${booking._id}`
          );
          // You can trigger immediate reminder job here
        }
      } catch (error: any) {
        console.error(
          `❌ Failed to process missed reminder for booking ${booking._id}:`,
          error.message
        );
      }
    }
  }
}
