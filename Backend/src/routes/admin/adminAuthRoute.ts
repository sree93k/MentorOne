import { Router } from "express";
import adminAuthController from "../../controllers/adminAuth/adminAuthController";
import { validateAdminLogin } from "../../validator/adminValidator";
import {
  decodedRefreshToken,
  verifyRefreshTokenMiddleware,
} from "../../middlewares/authenticateAdmin";
const adminAuthRoutes = Router();

// Admin login route
adminAuthRoutes.post("/login", validateAdminLogin, adminAuthController.login);
adminAuthRoutes.patch(
  "/logout",
  decodedRefreshToken,
  adminAuthController.logout
);
adminAuthRoutes.get(
  "/refresh_token",
  verifyRefreshTokenMiddleware,
  adminAuthController.refreshAccessToken
);

export default adminAuthRoutes;
