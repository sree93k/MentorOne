import { Router, Request, Response } from "express";
import { RouteFactory } from "../../utils/routeFactory";
import { validateAdminLogin } from "../../validator/AdminValidator";
import adminAuthRoute from "./adminAuthRoute";
import { authenticate } from "../../middlewares/authenticateAdmin";
import adminContactRoutes from "../contact/adminContactRoute"; // ✅ NEW

const adminRoutes = Router();

// Get controller instances from DI factory
const adminController = RouteFactory.getAdminController();
const appealController = RouteFactory.getAppealController();

// ✅ INDUSTRY STANDARD: Auth routes first
adminRoutes.use("/auth", adminAuthRoute);

// ✅ INDUSTRY STANDARD: Public validation endpoints
adminRoutes.get("/validate_session", adminController.validateSuccessResponse);

// ✅ INDUSTRY STANDARD: Test/Debug routes (remove in production)
if (process.env.NODE_ENV !== "production") {
  adminRoutes.get("/test-cookies", (req: Request, res: Response) => {
    console.log("🧪 === COOKIE TEST ENDPOINT ===");
    console.log("🧪 Request cookies:", req.cookies);
    console.log("🧪 Request headers cookie:", req.headers.cookie);

    res.cookie("testCookie", "testValue123", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 1000,
      path: "/",
    });

    res.json({
      message: "Cookie test endpoint",
      cookiesReceived: req.cookies,
      cookieHeader: req.headers.cookie,
      testCookiesSet: true,
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    });
  });

  adminRoutes.get(
    "/debug/socket-rooms/:userId",
    adminController.debugUserSocketRoom
  );
}

// ✅ INDUSTRY STANDARD: Protected routes with consistent structure
adminRoutes.use(authenticate); // Apply auth middleware to all routes below

// User management routes
adminRoutes.get("/users", adminController.getAllUsers);
adminRoutes.get("/user/:id", adminController.userDatas);
adminRoutes.patch("/userstatus_update/:id", adminController.userStatusUpdate);

// Mentor management routes
adminRoutes.patch(
  "/mentorstatus_update/:id",
  adminController.mentorStatusUpdate
);

// Booking and payment routes
adminRoutes.get("/bookings", adminController.getAllBookings);
adminRoutes.get("/payments", adminController.getAllPayments);
adminRoutes.post("/transfer-to-mentor", adminController.transferToMentor);

// Real-time blocking
adminRoutes.post("/block-user-realtime", adminController.blockUserRealtime);

// ✅ INDUSTRY STANDARD: Appeal routes (specific routes before parameterized)
adminRoutes.get("/appeals/statistics", appealController.getAppealStatistics);
adminRoutes.get("/appeals", appealController.getAppeals);
adminRoutes.patch("/appeals/:appealId/review", appealController.reviewAppeal);
adminRoutes.get("/appeals/:appealId", appealController.getAppealDetails);

// ✅ NEW: Contact management routes
adminRoutes.use("/contact", adminContactRoutes);

export default adminRoutes;
