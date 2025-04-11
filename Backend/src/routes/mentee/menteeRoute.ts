import { Router } from "express";
import menteeController from "../../controllers/menteeController/menteeController";
import multer from "multer";
import { authenticate } from "../../middlewares/authenticateUser";
import uploadController from "../../controllers/userController/uploadController";
const menteeRoutes = Router();
const upload = multer({ dest: "uploads/" });

menteeRoutes.put(
  "/welcomeform",
  authenticate,
  menteeController.uploadWelcomeForm
);

menteeRoutes.get("/profileData", authenticate, menteeController.profileData);

menteeRoutes.put(
  "/upload_profile_image",
  authenticate,
  upload.single("image"),
  uploadController.uploadImage
);

menteeRoutes.put(
  "/profileEdit",
  authenticate,
  menteeController.editUserProfile
);

menteeRoutes.delete(
  "/deleteAccount",
  authenticate,
  menteeController.deleteAccount
);

export default menteeRoutes;
