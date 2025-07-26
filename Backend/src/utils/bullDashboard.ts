import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { reminderQueue, cleanupQueue } from "../services/queue/ReminderQueue";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullAdapter(reminderQueue), new BullAdapter(cleanupQueue)],
  serverAdapter: serverAdapter,
});

export { serverAdapter };
