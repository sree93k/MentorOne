// // import { Router } from "express";
// // import adminAuthController from "../../controllers/implementation/adminAuthController";
// // import { validateAdminLogin } from "../../validator/adminValidator";
// // import {
// //   decodedRefreshToken,
// //   verifyRefreshTokenMiddleware,
// // } from "../../middlewares/authenticateAdmin";

// // const adminAuthRoutes = Router();

// // adminAuthRoutes.post("/login", validateAdminLogin, adminAuthController.login);
// // adminAuthRoutes.patch(
// //   "/logout",
// //   decodedRefreshToken,
// //   adminAuthController.logout
// // );
// // adminAuthRoutes.get(
// //   "/refresh_token",
// //   verifyRefreshTokenMiddleware,
// //   adminAuthController.refreshToken
// // );

// // export default adminAuthRoutes;
// // src/routes/adminAuthRoutes.ts
// import { Router } from "express";
// import adminAuthController from "../../controllers/implementation/adminAuthController";
// import { validateAdminLogin } from "../../validator/adminValidator";
// import {
//   decodedRefreshToken,
//   verifyRefreshTokenMiddleware,
// } from "../../middlewares/authenticateAdmin";

// const adminAuthRoutes = Router();

// adminAuthRoutes.post("/login", validateAdminLogin, adminAuthController.login);
// adminAuthRoutes.patch(
//   "/logout",
//   decodedRefreshToken,
//   adminAuthController.logout
// );
// adminAuthRoutes.post(
//   "/refresh-token",
//   verifyRefreshTokenMiddleware,
//   adminAuthController.refreshToken
// );

// export default adminAuthRoutes;
import { Router } from "express";
import adminAuthController from "../../controllers/implementation/adminAuthController";
import { validateAdminLogin } from "../../validator/adminValidator";
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
