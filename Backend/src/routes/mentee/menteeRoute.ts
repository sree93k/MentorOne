import { Router } from "express";
import menteeController from "../../controllers/implementation/menteeController";
import multer from "multer";
import { authenticate } from "../../middlewares/authenticateuser";
import uploadController from "../../controllers/implementation/uploadController";
import bookingController from "../../controllers/implementation/bookingController";
import paymentController from "../../controllers/implementation/paymentController";
import videoAccessMiddleware from "../../middlewares/videoAccessMiddleware";

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
menteeRoutes.post("/bookings", authenticate, bookingController.createBooking);

menteeRoutes.get("/bookings", authenticate, bookingController.getBookings);

menteeRoutes.delete(
  "/bookings/:bookingId",
  authenticate,
  bookingController.cancelBooking
);

menteeRoutes.get(
  "/seeker/getbookings",
  authenticate,
  menteeController.getBookings.bind(menteeController)
);

menteeRoutes.get(
  "/alltutorials",
  authenticate,
  menteeController.getAllTutorials.bind(menteeController)
);

menteeRoutes.get(
  "/exclusivecontent/:id",
  authenticate,
  menteeController.getTutorialById.bind(menteeController)
);

menteeRoutes.get(
  "/check-booking/:serviceId",
  authenticate,
  menteeController.checkBookingStatus.bind(menteeController)
);

menteeRoutes.post(
  "/initiate-payment",
  authenticate,
  menteeController.initiatePayment.bind(menteeController)
);

// New route for Payment Intent creation (Stripe Elements)
menteeRoutes.post(
  "/create-payment-intent",
  authenticate,
  menteeController.createPaymentIntent.bind(menteeController)
);

menteeRoutes.post(
  "/book-service",
  authenticate,
  menteeController.bookService.bind(menteeController)
);

// 🔒 SECURE VIDEO ROUTES - Phase 1 Implementation
// Create video session before accessing content
menteeRoutes.post(
  "/video-session/:serviceId",
  authenticate,
  videoAccessMiddleware.verifyVideoPurchase,
  videoAccessMiddleware.videoUrlRateLimit,
  menteeController.createEnhancedVideoSession.bind(menteeController)
);

// Legacy: Get secure video URL (Phase 1)
menteeRoutes.get(
  "/secure-video-url/:key",
  authenticate,
  videoAccessMiddleware.videoUrlRateLimit,
  menteeController.getSecureVideoUrl.bind(menteeController)
);

// Legacy: Extend video session (Phase 1)
menteeRoutes.post(
  "/extend-video-session",
  authenticate,
  menteeController.extendVideoSession.bind(menteeController)
);

// Legacy: Revoke video session (Phase 1)
menteeRoutes.post(
  "/revoke-video-session",
  authenticate,
  menteeController.revokeVideoSession.bind(menteeController)
);

// 🔒 LEGACY VIDEO ROUTE - Kept for backward compatibility but with security
menteeRoutes.get(
  "/video-url/:key",
  authenticate,
  videoAccessMiddleware.videoUrlRateLimit,
  menteeController.getVideoUrl.bind(menteeController)
);

menteeRoutes.get(
  "/payment/mentee-payments",
  authenticate,
  menteeController.getAllMenteePayments
);

menteeRoutes.get(
  "/document/:serviceId",
  authenticate,
  videoAccessMiddleware.verifyVideoPurchase,
  menteeController.getDocumentUrl.bind(menteeController)
);

menteeRoutes.get(
  "/mentor/:id/schedule",
  authenticate,
  menteeController.getMentorSchedule.bind(menteeController)
);

menteeRoutes.get(
  "/mentor/:id/blocked-dates",
  authenticate,
  menteeController.getMentorBlockedDates.bind(menteeController)
);

menteeRoutes.get(
  "/mentor/:mentorId/policy",
  authenticate,
  menteeController.getMentorPolicy.bind(menteeController)
);

menteeRoutes.post(
  "/priority-dm",
  authenticate,
  menteeController.createPriorityDM.bind(menteeController)
);

menteeRoutes.get(
  "/priority-dm/:bookingId",
  authenticate,
  menteeController.getPriorityDMs.bind(menteeController)
);

menteeRoutes.post(
  "/bookings/:bookingId/reschedule",
  authenticate,
  bookingController.requestReschedule.bind(bookingController)
);

menteeRoutes.post(
  "/bookings/:bookingId/testimonial",
  authenticate,
  bookingController.submitTestimonial.bind(bookingController)
);

menteeRoutes.put(
  "/testimonials/:testimonialId",
  authenticate,
  bookingController.updateTestimonial.bind(bookingController)
);

menteeRoutes.get(
  "/bookings/:bookingId/testimonial",
  authenticate,
  bookingController.getTestimonialByBookingId.bind(bookingController)
);

menteeRoutes.get(
  "/testimonials",
  authenticate,
  bookingController.getTestimonialsByMentor.bind(bookingController)
);

menteeRoutes.get(
  "/testimonials/mentor/:mentorId/service/:serviceId",
  bookingController.getTestimonialsByMentorAndService.bind(bookingController)
);

menteeRoutes.put(
  "/bookings/:bookingId/status",
  authenticate,
  bookingController.updateBookingServiceStatus.bind(bookingController)
);

menteeRoutes.get(
  "/dashboard-data",
  authenticate,
  menteeController.getDashboardData.bind(menteeController)
);

menteeRoutes.get("/allServices", authenticate, menteeController.getAllServices);
menteeRoutes.get("/wallet", authenticate, paymentController.getMenteeWallet);

// Get secure HLS playlist for streaming
menteeRoutes.get(
  "/hls-playlist/:serviceId/:episodeId?",
  authenticate,
  videoAccessMiddleware.videoUrlRateLimit,
  menteeController.getSecureHLSPlaylist.bind(menteeController)
);

// Serve secure HLS segments (individual video chunks)
menteeRoutes.get(
  "/hls-segment/:segmentKey",
  authenticate,
  videoAccessMiddleware.videoUrlRateLimit,
  menteeController.getSecureHLSSegment.bind(menteeController)
);

// Get video streaming info (HLS vs legacy)
menteeRoutes.get(
  "/video-streaming-info/:serviceId/:episodeId?",
  authenticate,
  menteeController.getVideoStreamingInfo.bind(menteeController)
);

// Check HLS processing status
menteeRoutes.get(
  "/hls-status/:serviceId/:episodeId?",
  authenticate,
  menteeController.getHLSProcessingStatus.bind(menteeController)
);

// Process video to HLS (for admin/mentor use)
menteeRoutes.post(
  "/process-video-hls",
  authenticate,
  menteeController.processVideoToHLS.bind(menteeController)
);

menteeRoutes.post(
  "/video-session-active",
  authenticate,
  menteeController.markVideoSessionActive.bind(menteeController)
);

menteeRoutes.post(
  "/video-session-inactive",
  authenticate,
  menteeController.markVideoSessionInactive.bind(menteeController)
);

// 🔥 PHASE 2: Enhanced Video Session Heartbeat (fixes the 404 errors)
menteeRoutes.post(
  "/video-heartbeat",
  authenticate,
  menteeController.processVideoHeartbeat.bind(menteeController)
);

// Enhanced secure video URL endpoint
menteeRoutes.get(
  "/enhanced-secure-video-url/:key",
  authenticate,
  videoAccessMiddleware.videoUrlRateLimit,
  menteeController.getEnhancedSecureVideoUrl.bind(menteeController)
);

// Refresh video session endpoint
menteeRoutes.post(
  "/refresh-video-session",
  authenticate,
  menteeController.refreshVideoSession.bind(menteeController)
);

// Get video session status
menteeRoutes.get(
  "/video-session-status",
  authenticate,
  menteeController.getVideoSessionStatus.bind(menteeController)
);

// 🔒 SECURE VIDEO PROXY - Stream video through backend (prevents direct S3 access)
menteeRoutes.get(
  "/secure-video-proxy/:videoKey",
  authenticate,
  videoAccessMiddleware.videoUrlRateLimit,
  menteeController.streamSecureVideo.bind(menteeController)
);

// 🔒 NEW: SECURE VIDEO BLOB CHUNKS - For complete URL protection
menteeRoutes.get(
  "/secure-video-chunk/:videoKey/:chunkIndex",
  authenticate,
  videoAccessMiddleware.videoUrlRateLimit,
  menteeController.getSecureVideoChunk.bind(menteeController)
);

// 🔒 SIGNED URL ENDPOINTS - Secure video access with expiration
menteeRoutes.get(
  "/generate-video-signed-url",
  authenticate,
  videoAccessMiddleware.videoUrlRateLimit,
  menteeController.generateVideoSignedUrl.bind(menteeController)
);

menteeRoutes.get(
  "/generate-tutorial-signed-urls/:tutorialId",
  authenticate,
  videoAccessMiddleware.videoUrlRateLimit,
  menteeController.generateTutorialSignedUrls.bind(menteeController)
);

menteeRoutes.post(
  "/refresh-video-signed-url",
  authenticate,
  videoAccessMiddleware.videoUrlRateLimit,
  menteeController.refreshVideoSignedUrl.bind(menteeController)
);

// 🔄 MIGRATION ROUTES FOR S3 SIGNED URLS
menteeRoutes.post(
  "/migrate-video-urls",
  authenticate,
  menteeController.migrateVideoUrls.bind(menteeController)
);

menteeRoutes.get(
  "/migration-status",
  authenticate,
  menteeController.checkMigrationStatus.bind(menteeController)
);

export default menteeRoutes;
