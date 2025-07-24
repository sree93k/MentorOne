import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import uploadController from "../../controllers/implementation/uploadController";
import { authenticate } from "../../middlewares/authenticateuser";
import userController from "../../controllers/implementation/userController";
import paymentController from "../../controllers/implementation/paymentController";
import socketController from "../../controllers/implementation/socketController";
import videoCallController from "../../controllers/implementation/videoCallController";
import chatController from "../../controllers/implementation/socketController";
import notificationController from "../../controllers/implementation/notificationController";
import bookingController from "../../controllers/implementation/bookingController";

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

// NEW: Add chat unread counts route
userPrivateRoute.get(
  "/chat/unread-counts",
  authenticate,
  chatController.getChatUnreadCounts.bind(chatController)
);

// ✅ NEW: Mark specific chat as read
userPrivateRoute.post(
  "/chat/:chatId/mark-read",
  authenticate,
  chatController.markChatAsRead.bind(chatController)
);

// ✅ NEW: Get unread count for specific chat
userPrivateRoute.get(
  "/chat/:chatId/unread-count",
  authenticate,
  chatController.getChatUnreadMessageCount.bind(chatController)
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

// New route for sending meeting notifications
userPrivateRoute.post(
  "/video-call/notify",
  authenticate,
  videoCallController.notifyMentee.bind(videoCallController)
);

userPrivateRoute.put(
  "/update-online-status",
  authenticate,
  userController.updateOnlineStatus.bind(userController)
);

// Notification routes
userPrivateRoute.get(
  "/notifications/unread",
  authenticate,
  notificationController.getUnreadNotifications.bind(notificationController)
);

userPrivateRoute.post(
  "/notifications/:notificationId/read",
  authenticate,
  notificationController.markNotificationAsRead.bind(notificationController)
);

// NEW: Get notification counts route
userPrivateRoute.get(
  "/notifications/counts",
  authenticate,
  notificationController.getNotificationCounts.bind(notificationController)
);

// New route for updating booking status
userPrivateRoute.put(
  "/booking/:bookingId/updatestatus",
  authenticate,
  bookingController.updateBookingServiceStatus.bind(bookingController)
);

userPrivateRoute.put(
  "/booking/:bookingId/updatereshedule",
  authenticate,
  bookingController.updateBookingResheduleStatus.bind(bookingController)
);

userPrivateRoute.get(
  "/bookings/:bookingId",
  authenticate,
  bookingController.getBookingData.bind(bookingController)
);

userPrivateRoute.get(
  `/:userId/online-status`,
  authenticate,
  socketController.getUserOnlineStatus.bind(socketController)
);

export default userPrivateRoute;
