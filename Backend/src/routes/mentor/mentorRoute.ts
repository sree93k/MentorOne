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
  "/mentors/:mentorId/calendar",
  mentorController.getMentorCalendar.bind(mentorController)
);
mentorRoutes.put(
  "/mentors/:mentorId/policy",
  mentorController.updatePolicy.bind(mentorController)
);
mentorRoutes.post(
  "/mentors/:mentorId/schedules",
  mentorController.createSchedule.bind(mentorController)
);
mentorRoutes.put(
  "/mentors/:mentorId/schedules/:scheduleId",
  mentorController.updateSchedule.bind(mentorController)
);
mentorRoutes.delete(
  "/mentors/:mentorId/schedules/:scheduleId",
  mentorController.deleteSchedule.bind(mentorController)
);
mentorRoutes.post(
  "/mentors/:mentorId/blocked-dates",
  mentorController.addBlockedDates.bind(mentorController)
);
mentorRoutes.delete(
  "/mentors/:mentorId/blocked-dates/:blockedDateId",
  mentorController.removeBlockedDate.bind(mentorController)
);
export default mentorRoutes;
