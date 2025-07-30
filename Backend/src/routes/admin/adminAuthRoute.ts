import { Router } from "express";
import adminAuthController from "../../controllers/implementation/adminAuthController";
import { validateAdminLogin } from "../../validator/AdminValidator";
import {
  verifyRefreshTokenMiddleware,
  decodedRefreshToken,
} from "../../middlewares/authenticateAdmin";

const adminAuthRoute = Router();

// Login route
adminAuthRoute.post("/login", validateAdminLogin, adminAuthController.login);

// Logout route (requires valid refresh token)
adminAuthRoute.patch(
  "/logout",
  verifyRefreshTokenMiddleware,
  adminAuthController.logout
);

// Refresh token route (requires valid refresh token)
adminAuthRoute.post(
  "/refresh-token",
  verifyRefreshTokenMiddleware,
  adminAuthController.refreshToken
);

export default adminAuthRoute;
