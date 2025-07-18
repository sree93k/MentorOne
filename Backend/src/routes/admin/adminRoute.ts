// import { Router } from "express";
// import adminController from "../../controllers/implementation/adminController";
// import { validateAdminLogin } from "../../validator/adminValidator";
// import adminAuthRoute from "./adminAuthRoute";
// import { authenticate } from "../../middlewares/authenticateAdmin";

// const adminRoutes = Router();

// adminRoutes.use("/auth", adminAuthRoute);

// adminRoutes.get("/validate_session", adminController.validateSuccessResponse);
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
// export default adminRoutes;
import { Router, Request, Response } from "express";
import adminController from "../../controllers/implementation/adminController";
import { validateAdminLogin } from "../../validator/adminValidator";
import adminAuthRoute from "./adminAuthRoute";
import { authenticate } from "../../middlewares/authenticateAdmin";

const adminRoutes = Router();

// Existing routes
adminRoutes.use("/auth", adminAuthRoute);
adminRoutes.get("/validate_session", adminController.validateSuccessResponse);

// ADD THIS TEST ROUTE for debugging cookies
adminRoutes.get("/test-cookies", (req: Request, res: Response) => {
  console.log("🧪 === COOKIE TEST ENDPOINT ===");
  console.log("🧪 Request cookies:", req.cookies);
  console.log("🧪 Request headers cookie:", req.headers.cookie);
  console.log("🧪 Request headers:", req.headers);

  // Set a test cookie
  res.cookie("testCookie", "testValue123", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 1000, // 1 minute
    path: "/",
  });

  // Set another test cookie without httpOnly to check if it shows in document.cookie
  res.cookie("visibleTestCookie", "visible123", {
    httpOnly: false, // This should be visible in document.cookie
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 1000,
    path: "/",
  });

  console.log("🧪 Setting test cookies...");
  console.log("🧪 Response headers:", res.getHeaders());

  res.json({
    message: "Cookie test endpoint",
    cookiesReceived: req.cookies,
    cookieHeader: req.headers.cookie,
    testCookiesSet: true,
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Existing protected routes
adminRoutes.get("/users", authenticate, adminController.getAllUsers);
adminRoutes.get("/user/:id", authenticate, adminController.userDatas);
adminRoutes.get("/bookings", authenticate, adminController.getAllBookings);
adminRoutes.get("/payments", authenticate, adminController.getAllPayments);
adminRoutes.post(
  "/transfer-to-mentor",
  authenticate,
  adminController.transferToMentor
);
adminRoutes.patch(
  "/mentorstatus_update/:id/",
  authenticate,
  adminController.mentorStatusUpdate
);
adminRoutes.patch(
  "/userstatus_update/:id/",
  authenticate,
  adminController.userStatusUpdate
);

export default adminRoutes;
