import { Router } from "express";
import menteeController from "../../controllers/menteeController/menteeController";
import multer from "multer";
import { authenticate } from "../../middlewares/authenticateuser";
import uploadController from "../../controllers/userController/uploadController";
const menteeRoutes = Router();
const upload = multer({ dest: "uploads/" });

menteeRoutes.put(
  "/welcomeform",
  authenticate,
  menteeController.uploadWelcomeForm
);

menteeRoutes.get("/profileData", authenticate, menteeController.profileData);

menteeRoutes.delete(
  "/deleteAccount",
  authenticate,
  menteeController.deleteAccount
);

menteeRoutes.get("/allMentors", authenticate, menteeController.getAllMentors);
menteeRoutes.get("/mentor/:id", menteeController.getMentorById);
export default menteeRoutes;
