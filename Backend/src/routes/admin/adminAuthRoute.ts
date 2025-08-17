import { Router } from "express";
import { RouteFactory } from "../../utils/routeFactory";
import { validateAdminLogin } from "../../validator/AdminValidator";
import {
  verifyRefreshTokenMiddleware,
  decodedRefreshToken,
} from "../../middlewares/authenticateAdmin";

const adminAuthRoute = Router();

// Get controller instance from factory
const adminAuthController = RouteFactory.getAdminAuthController();

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
