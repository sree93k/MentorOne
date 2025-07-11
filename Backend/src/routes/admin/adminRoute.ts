import { Router } from "express";
import adminController from "../../controllers/implementation/adminController";
import { validateAdminLogin } from "../../validator/adminValidator";
import adminAuthRoute from "./adminAuthRoute";
import { authenticate } from "../../middlewares/authenticateAdmin";

const adminRoutes = Router();

adminRoutes.use("/auth", adminAuthRoute);

adminRoutes.get("/validate_session", adminController.validateSuccessResponse);
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
