import { reminderQueue } from "./ReminderQueue";
import { BookingReminderProcessor } from "./processors/BookingReminderProcessor";

const processor = new BookingReminderProcessor();

// Process reminder jobs
reminderQueue.process("*", async (job) => {
  return await processor.processReminderJob(job);
});

// Queue event listeners
reminderQueue.on("completed", (job, result) => {
  console.log(`✅ Reminder job ${job.id} completed:`, result);
});

reminderQueue.on("failed", (job, err) => {
  console.error(`❌ Reminder job ${job.id} failed:`, err.message);
});

reminderQueue.on("stalled", (job) => {
  console.warn(`⚠️ Reminder job ${job.id} stalled`);
});

export { reminderQueue };
