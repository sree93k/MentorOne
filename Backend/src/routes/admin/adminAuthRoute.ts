import { Router } from "express";
import adminAuthController from "../../controllers/implementation/adminAuthController";
import { validateAdminLogin } from "../../validator/adminValidator";
import {
  decodedRefreshToken,
  verifyRefreshTokenMiddleware,
} from "../../middlewares/authenticateAdmin";

const adminAuthRoutes = Router();

adminAuthRoutes.post("/login", validateAdminLogin, adminAuthController.login);
adminAuthRoutes.patch(
  "/logout",
  decodedRefreshToken,
  adminAuthController.logout
);
adminAuthRoutes.post(
  "/refresh-token",
  verifyRefreshTokenMiddleware,
  adminAuthController.refreshToken
);

export default adminAuthRoutes;
