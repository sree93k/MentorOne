import { Router } from "express";
import { validateAdminLogin } from "../../validator/adminValidator";
import { authenticate } from "../../middlewares/authenticateAdmin";
import { initDIContainer } from "../../diContainer/diContainer";
import adminAuthRoutes from "./adminAuthRoute";

const { adminController } = initDIContainer();
const adminRoutes = Router();

adminRoutes.use("/auth", adminAuthRoutes);

adminRoutes.get(
  "/validate_session",
  authenticate,
  adminController.validateSuccessResponse.bind(adminController)
);

adminRoutes.get(
  "/users",
  authenticate,
  adminController.getAllUsers.bind(adminController)
);

adminRoutes.get(
  "/user/:id",
  authenticate,
  adminController.userDatas.bind(adminController)
);

adminRoutes.get(
  "/bookings",
  authenticate,
  adminController.getAllBookings.bind(adminController)
);

adminRoutes.get(
  "/payments",
  authenticate,
  adminController.getAllPayments.bind(adminController)
);

adminRoutes.post(
  "/transfer-to-mentor",
  authenticate,
  adminController.transferToMentor.bind(adminController)
);

adminRoutes.patch(
  "/mentorstatus_update/:id",
  authenticate,
  adminController.mentorStatusUpdate.bind(adminController)
);

adminRoutes.patch(
  "/userstatus_update/:id",
  authenticate,
  adminController.userStatusUpdate.bind(adminController)
);

export default adminRoutes;
