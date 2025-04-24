import { Router } from "express";
import multer from "multer";
import uploadController from "../../controllers/userController/uploadController";
import { authenticate } from "../../middlewares/authenticateuser";
import userController from "../../controllers/userController/userController";
const userPrivateRoute = Router();

// Configure multer to save files to an 'uploads' folder
const upload = multer({ dest: "uploads/" });

// Add multer middleware to the route, expecting a single file with the field name "image"
userPrivateRoute.post(
  "/upload_image",
  upload.single("image"),
  uploadController.uploadProfileImage
);

userPrivateRoute.put(
  "/update_profile_image",
  authenticate,
  upload.single("image"),
  uploadController.uploadProfileImage
);

userPrivateRoute.put(
  "/profileEdit",
  authenticate,
  userController.editUserProfile
);

userPrivateRoute.put(
  "/resetPassword",
  authenticate,
  userController.resetPassword
);

export default userPrivateRoute;
