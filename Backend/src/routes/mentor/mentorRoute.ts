import { Router } from "express";
import { welcomeFormValidator } from "../../validator/MentorValidator";
import mentorController from "../../controllers/mentorController/mentorController";
import { authenticate } from "../../middlewares/authenticateuser";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const mentorRoutes = Router();

mentorRoutes.put(
  "/welcomeform",
  authenticate,
  welcomeFormValidator,
  mentorController.uploadWelcomeForm
);

mentorRoutes.get("/profile/:id", authenticate, mentorController.getProfileData);

mentorRoutes.post(
  "/createService",
  authenticate,
  upload.any(),
  mentorController.createService
);
mentorRoutes.get(
  "/generate-presigned-url",
  authenticate,
  mentorController.generatePresignedUrl
);

mentorRoutes.get(
  "/get-presigned-url",
  authenticate,
  mentorController.getPresignedUrl
);

mentorRoutes.get("/allServices", authenticate, mentorController.getAllServices);
mentorRoutes.get("/service/:id", authenticate, mentorController.getServiceById);
mentorRoutes.put(
  "/updateService/:id",
  authenticate,
  upload.any(),
  mentorController.updateService
);

mentorRoutes.get(
  "/:mentorId/calendar",
  authenticate,
  mentorController.getMentorCalendar.bind(mentorController)
);
mentorRoutes.put(
  "/:mentorId/policy",
  authenticate,
  mentorController.updatePolicy.bind(mentorController)
);
mentorRoutes.post(
  "/:mentorId/schedules",
  authenticate,
  mentorController.createSchedule.bind(mentorController)
);
mentorRoutes.put(
  "/:mentorId/schedules/:scheduleId",
  authenticate,
  mentorController.updateSchedule.bind(mentorController)
);
mentorRoutes.delete(
  "/:mentorId/schedules/:scheduleId",
  authenticate,
  mentorController.deleteSchedule.bind(mentorController)
);
mentorRoutes.post(
  "/:mentorId/blocked-dates",
  authenticate,
  mentorController.addBlockedDates.bind(mentorController)
);
mentorRoutes.delete(
  "/:mentorId/blocked-dates/:blockedDateId",
  authenticate,
  mentorController.removeBlockedDate.bind(mentorController)
);
export default mentorRoutes;
