import { Router } from "express";
import multer from "multer";
import uploadController from "../../controllers/userController/uploadController";
import { authenticate } from "../../middlewares/authenticateuser";
import userController from "../../controllers/userController/userController";
import paymentController from "../../controllers/paymentController/paymentController";
import socketController from "../../controllers/soketController/socketController";

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

userPrivateRoute.post(
  "/payment/create-checkout-session",
  authenticate,
  paymentController.createCheckoutSession
);

userPrivateRoute.post(
  "/payment/create-payment-intent",
  authenticate,
  paymentController.createPaymentIntent
);

userPrivateRoute.get(
  "/payment/verify-session/:sessionId",
  authenticate,
  paymentController.verifySession
);

userPrivateRoute.get(
  "/:dashboard/chat-history",
  authenticate,
  socketController.getChatUsers.bind(socketController)
);

userPrivateRoute.get(
  "/generate-presigned-url",
  authenticate,
  uploadController.generatePresignedUrl
);

userPrivateRoute.get(
  "/get-presigned-url",
  authenticate,
  uploadController.getPresignedUrl
);
export default userPrivateRoute;
