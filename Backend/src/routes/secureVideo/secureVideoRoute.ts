import { Router } from "express";
import { authenticate } from "../../middlewares/authenticateuser";
import secureVideoProxyController from "../../controllers/implementation/secureVideoProxyController";

const secureVideoRoutes = Router();

// 🎬 SECURE VIDEO STREAMING ROUTES

// OPTIONS handler for CORS preflight
secureVideoRoutes.options('*', secureVideoProxyController.handleOptions);

// Stream video with authentication and access control
secureVideoRoutes.get(
  "/stream",
  authenticate,
  secureVideoProxyController.streamVideo
);

// Generate secure streaming URL
secureVideoRoutes.get(
  "/streaming-url",
  authenticate,
  secureVideoProxyController.generateStreamingUrl
);

// Validate video access permissions
secureVideoRoutes.get(
  "/validate-access",
  authenticate,
  secureVideoProxyController.validateVideoAccess
);

// Track video analytics events
secureVideoRoutes.post(
  "/track-event",
  authenticate,
  secureVideoProxyController.trackVideoEvent
);

export default secureVideoRoutes;