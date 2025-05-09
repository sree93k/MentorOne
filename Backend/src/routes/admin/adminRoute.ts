import { Router } from "express";
import adminController from "../../controllers/adminController/adminController";
import { validateAdminLogin } from "../../validator/adminValidator";
import adminAuthRoute from "./adminAuthRoute";
import { authenticate } from "../../middlewares/authenticateAdmin";

const adminRoutes = Router();

adminRoutes.use("/auth", adminAuthRoute);

adminRoutes.get("/validate_session", adminController.validateSuccessResponse);
adminRoutes.get("/allUsers", authenticate, adminController.getAllUsers);
adminRoutes.get("/userData/:id", authenticate, adminController.userDatas);
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
