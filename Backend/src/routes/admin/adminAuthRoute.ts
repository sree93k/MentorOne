// src/routes/adminAuthRoutes.ts
import { Router } from "express";
import { container } from "../../inversify/container"; // Fixed typo: conatainer -> container
import { TYPES } from "../../inversify/types";
import { IAdminAuthController } from "../../controllers/interface/IAdminAuthController"; // Import the interface
import { AdminAuthMiddleware } from "../../middlewares/authenticateAdmin";
import { validateAdminLogin } from "../../validator/adminValidator";

const adminAuthRoutes = Router();
const adminAuthController = container.get<IAdminAuthController>(
  TYPES.AdminAuthController
);
const adminAuthMiddleware = container.get<AdminAuthMiddleware>(
  TYPES.AdminAuthMiddleware
);

adminAuthRoutes.post(
  "/login",
  validateAdminLogin,
  adminAuthController.login.bind(adminAuthController)
);
adminAuthRoutes.patch(
  "/logout",
  adminAuthMiddleware.decodedRefreshToken.bind(adminAuthMiddleware),
  adminAuthController.logout.bind(adminAuthController)
);
adminAuthRoutes.post(
  "/refresh-token",
  adminAuthMiddleware.verifyRefreshTokenMiddleware.bind(adminAuthMiddleware),
  adminAuthController.refreshToken.bind(adminAuthController)
);

export default adminAuthRoutes;
