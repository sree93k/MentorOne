import { Router } from "express";
import multer from "multer";
import uploadController from "../../controllers/userController/uploadController";
import { authenticate } from "../../middlewares/authenticateuser";
import userController from "../../controllers/userController/userController";
import paymentController from "../../controllers/paymentController/paymentController";
import socketController from "../../controllers/socketController/socketController";
import videoCallController from "../../controllers/VideoCallController/videoCallController";
import chatController from "../../controllers/socketController/socketController";
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
  chatController.getChatUsers.bind(chatController)
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

// User session validation
userPrivateRoute.get("/validate_session", authenticate, (req, res) => {
  res.status(200).json({ valid: true });
});

// Video call routes
// Make sure videoCallController methods are properly bound
userPrivateRoute.post(
  "/video-call/create",
  authenticate,
  videoCallController.createMeeting.bind(videoCallController)
);

userPrivateRoute.get(
  "/video-call/validate/:meetingId",
  authenticate,
  videoCallController.validateMeeting.bind(videoCallController)
);

userPrivateRoute.post(
  "/video-call/join/:meetingId",
  authenticate,
  videoCallController.joinMeeting.bind(videoCallController)
);

userPrivateRoute.post(
  "/video-call/end/:meetingId",
  authenticate,
  videoCallController.endMeeting.bind(videoCallController)
);
export default userPrivateRoute;
