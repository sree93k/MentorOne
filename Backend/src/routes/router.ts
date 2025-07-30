import { Router } from "express";
import adminRoutes from "./admin/adminRoute";
import userRoutes from "./userRoutes/userRoute";
import expertRoutes from "./mentor/mentorRoute";
import seekerRoutes from "./mentee/menteeRoute";
import webhookRoute from "./webhook/webhhookRoute";
import mediaRoutes from "./media/mediaRoute";
import adminMediaRoutes from "./media/adminMediaRoute"; // NEW: Import admin media routes
import chatbotRouter from "./chatbot/chatbot";
import adminAppealRoutes from "./admin/adminAppealRoutes";
const router = Router();

console.log("step 0");

router.use("/admin", adminRoutes);
router.use("/user", userRoutes);
router.use("/seeker", seekerRoutes);
router.use("/expert", expertRoutes);
router.use("/stripe/api", webhookRoute);
router.use("/media", mediaRoutes); // Keep this for user access
router.use("/admin-media", adminMediaRoutes); // Use admin-specific routes
router.use("/api/chatbot", chatbotRouter);
router.use("/", adminAppealRoutes);
export { router };
