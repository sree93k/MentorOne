import { Router } from "express";
import userAuthRoute from "./userAuthRoute";
import userPrivateRoute from "./userPrivateRoute";
import userController from "../../controllers/implementation/userController";
import appealController from "../../controllers/implementation/AppealController";

const userRoutes = Router();

// ✅ INDUSTRY STANDARD: Auth routes first
userRoutes.use("/auth", userAuthRoute);

// ✅ INDUSTRY STANDARD: Public validation endpoints
userRoutes.get("/validate_session", userController.validateSuccessResponse);
userRoutes.get("/test", (req, res) => {
  console.log("✅ UserRoutes: Test route hit");
  res.json({
    message: "User routes working",
    timestamp: new Date().toISOString(),
  });
});

// ✅ INDUSTRY STANDARD: Appeal routes (public - no auth required for blocked users)
// userRoutes.post(
//   "/appeal/submit",
//   appealController.validateAppealSubmission, // ✅ Add validation middleware
//   appealController.submitAppeal
// );

// userRoutes.get("/appeal/status/:appealId", appealController.getAppealStatus);

// userRoutes.get(
//   "/appeal/latest/:email",
//   appealController.getLatestAppealByEmail
// );

// 🔧 ENHANCED: Appeal routes with better error handling
userRoutes.post(
  "/appeal/submit",
  appealController.validateAppealSubmission,
  appealController.submitAppeal
);

userRoutes.get(
  "/appeal/status/:appealId",
  (req, res, next) => {
    console.log("🔍 Appeal status route hit:", {
      appealId: req.params.appealId,
      query: req.query,
    });
    next();
  },
  appealController.getAppealStatus
);

userRoutes.get(
  "/appeal/latest/:email",
  (req, res, next) => {
    console.log("🔍 Latest appeal route hit:", {
      email: req.params.email,
    });
    next();
  },
  appealController.getLatestAppealByEmail
);
// ✅ INDUSTRY STANDARD: Protected routes last
userRoutes.use("/", userPrivateRoute);

export default userRoutes;
