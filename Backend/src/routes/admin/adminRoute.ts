// import { Router, Request, Response } from "express";
// import adminController from "../../controllers/implementation/adminController";
// import { validateAdminLogin } from "../../validator/AdminValidator";
// import adminAuthRoute from "./adminAuthRoute";
// import { authenticate } from "../../middlewares/authenticateAdmin";
// import appealController from "../../controllers/implementation/AppealController";

// const adminRoutes = Router();

// // Existing routes
// adminRoutes.use("/auth", adminAuthRoute);
// adminRoutes.get("/validate_session", adminController.validateSuccessResponse);

// // Test route
// adminRoutes.get("/test-cookies", (req: Request, res: Response) => {
//   console.log("🧪 === COOKIE TEST ENDPOINT ===");
//   console.log("🧪 Request cookies:", req.cookies);
//   console.log("🧪 Request headers cookie:", req.headers.cookie);

//   res.cookie("testCookie", "testValue123", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     maxAge: 60 * 1000,
//     path: "/",
//   });

//   res.cookie("visibleTestCookie", "visible123", {
//     httpOnly: false,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     maxAge: 60 * 1000,
//     path: "/",
//   });

//   res.json({
//     message: "Cookie test endpoint",
//     cookiesReceived: req.cookies,
//     cookieHeader: req.headers.cookie,
//     testCookiesSet: true,
//     environment: process.env.NODE_ENV || "development",
//     timestamp: new Date().toISOString(),
//   });
// });

// // Existing protected routes
// adminRoutes.get("/users", authenticate, adminController.getAllUsers);
// adminRoutes.get("/user/:id", authenticate, adminController.userDatas);
// adminRoutes.get("/bookings", authenticate, adminController.getAllBookings);
// adminRoutes.get("/payments", authenticate, adminController.getAllPayments);
// adminRoutes.post(
//   "/transfer-to-mentor",
//   authenticate,
//   adminController.transferToMentor
// );
// adminRoutes.patch(
//   "/mentorstatus_update/:id/",
//   authenticate,
//   adminController.mentorStatusUpdate
// );
// adminRoutes.patch(
//   "/userstatus_update/:id/",
//   authenticate,
//   adminController.userStatusUpdate
// );
// adminRoutes.post(
//   "/block-user-realtime",
//   authenticate,
//   adminController.blockUserRealtime
// );
// adminRoutes.get(
//   "/debug/socket-rooms/:userId",
//   adminController.debugUserSocketRoom
// );

// // ✅ APPEAL ROUTES (CORRECT ORDER):
// adminRoutes.get(
//   "/appeals/statistics",
//   authenticate,
//   appealController.getAppealStatistics
// ); // ✅ SPECIFIC ROUTES FIRST
// adminRoutes.get("/appeals", authenticate, appealController.getAppeals);
// adminRoutes.patch(
//   "/appeals/:appealId/review",
//   authenticate,
//   appealController.reviewAppeal
// );
// adminRoutes.get(
//   "/appeals/:appealId",
//   authenticate,
//   appealController.getAppealDetails
// ); // ✅ PARAMETERIZED ROUTES LAST

// export default adminRoutes;
import { Router, Request, Response } from "express";
import adminController from "../../controllers/implementation/adminController";
import { validateAdminLogin } from "../../validator/AdminValidator";
import adminAuthRoute from "./adminAuthRoute";
import { authenticate } from "../../middlewares/authenticateAdmin";
import appealController from "../../controllers/implementation/AppealController";

const adminRoutes = Router();

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

export default adminRoutes;
