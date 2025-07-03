import { Router } from "express";
import { container } from "../../inversify/container";
import { TYPES } from "../../inversify/types";
import { AdminController } from "../../controllers/implementation/adminController";
import { AdminAuthMiddleware } from "../../middlewares/authenticateAdmin";
import adminAuthRoute from "./adminAuthRoute";

const adminRoutes = Router();
const adminController = container.get<AdminController>(TYPES.AdminController);
const adminAuthMiddleware = container.get<AdminAuthMiddleware>(
  TYPES.AdminAuthMiddleware
);

adminRoutes.use("/auth", adminAuthRoute);
adminRoutes.get(
  "/validate_session",
  adminAuthMiddleware.authenticate.bind(adminAuthMiddleware),
  adminController.validateSession.bind(adminController)
);

adminRoutes.get(
  "/dashboard",
  adminAuthMiddleware.authenticate.bind(adminAuthMiddleware),
  adminController.getDashboardDatas.bind(adminController)
);
adminRoutes.get(
  "/users",
  adminAuthMiddleware.authenticate.bind(adminAuthMiddleware),
  adminController.getAllUsers.bind(adminController)
);
adminRoutes.get(
  "/user/:id",
  adminAuthMiddleware.authenticate.bind(adminAuthMiddleware),
  adminController.getUserDetails.bind(adminController)
);
adminRoutes.get(
  "/bookings",
  adminAuthMiddleware.authenticate.bind(adminAuthMiddleware),
  adminController.getAllBookings.bind(adminController)
);
adminRoutes.get(
  "/payments",
  adminAuthMiddleware.authenticate.bind(adminAuthMiddleware),
  adminController.getAllPayments.bind(adminController)
);
adminRoutes.post(
  "/transfer-to-mentor",
  adminAuthMiddleware.authenticate.bind(adminAuthMiddleware),
  adminController.transferToMentor.bind(adminController)
);
adminRoutes.patch(
  "/mentorstatus_update/:id",
  adminAuthMiddleware.authenticate.bind(adminAuthMiddleware),
  adminController.updateMentorStatus.bind(adminController)
);
adminRoutes.patch(
  "/userstatus_update/:id",
  adminAuthMiddleware.authenticate.bind(adminAuthMiddleware),
  adminController.updateUserStatus.bind(adminController)
);

export default adminRoutes;
