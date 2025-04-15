import { Router } from "express";
import multer from "multer";
import uploadController from "../../controllers/userController/uploadController";
const userPrivateRoute = Router();

// Configure multer to save files to an 'uploads' folder
const upload = multer({ dest: "uploads/" });

// Add multer middleware to the route, expecting a single file with the field name "image"
userPrivateRoute.post(
  "/upload_image",
  upload.single("image"),
  uploadController.uploadProfileImage
);

userPrivateRoute.post(
  "/update_profile_image",
  upload.single("image"),
  uploadController.uploadProfileImage
);

export default userPrivateRoute;
