import { Router } from "express";
import userAuthRoute from "./userAuthRoute";
import userPrivateRoute from "./userPrivateRoute";
import userController from "../../controllers/implementation/userController";
const userRoutes = Router();
import appealController from "../../controllers/implementation/AppealController";
userRoutes.use("/auth", userAuthRoute);
userRoutes.get("/validate_session", userController.validateSuccessResponse);
userRoutes.get("/test", (req, res) => {
  console.log("✅ UserRoutes: Test route hit");
  res.json({
    message: "User routes working",
    timestamp: new Date().toISOString(),
  });
});

// ✅ ADD THESE APPEAL ROUTES:
userRoutes.post(
  "/appeal/submit",
  appealController.validateAppealSubmission,
  appealController.submitAppeal
);
userRoutes.get("/appeal/status/:appealId", appealController.getAppealStatus);

userRoutes.use("/", userPrivateRoute);

export default userRoutes;
