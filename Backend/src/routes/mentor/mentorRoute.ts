import { Router } from "express";
import { welcomeFormValidator } from "../../validator/MentorValidator";
import mentorController from "../../controllers/mentorController/mentorController";
import { authenticate } from "../../middlewares/authenticateUser";
const mentorRoutes = Router();

mentorRoutes.put(
  "/welcomeform",
  authenticate,
  welcomeFormValidator,
  mentorController.uploadWelcomeForm
);

mentorRoutes.get("/profile/:id", authenticate, mentorController.getProfileData);

export default mentorRoutes;
