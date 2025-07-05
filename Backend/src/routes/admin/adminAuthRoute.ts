// // export default adminAuthRoutes;
// import { Router } from "express";
// import { validateAdminLogin } from "../../validator/adminValidator";
// import {
//   verifyRefreshTokenMiddleware,
//   decodedRefreshToken,
// } from "../../middlewares/authenticateAdmin";
// import { initDIContainer } from "../../diContainer/diContainer";

// const { adminAuthController } = initDIContainer();

// const adminAuthRoutes = Router();

// adminAuthRoutes.post(
//   "/login",
//   validateAdminLogin,
//   adminAuthController.login.bind(adminAuthController)
// );
// adminAuthRoutes.post(
//   "/logout",
//   decodedRefreshToken,
//   adminAuthController.logout.bind(adminAuthController)
// );
// adminAuthRoutes.post(
//   "/refresh-token",
//   verifyRefreshTokenMiddleware,
//   adminAuthController.refreshToken.bind(adminAuthController)
// );

// export default adminAuthRoutes;
import { Router } from "express";
import { validateAdminLogin } from "../../validator/adminValidator";
import {
  verifyRefreshTokenMiddleware,
  decodedRefreshToken,
} from "../../middlewares/authenticateAdmin";
import { initDIContainer } from "../../diContainer/diContainer";

const adminAuthRoutes = Router();

(async () => {
  const { adminAuthController } = await initDIContainer();

  adminAuthRoutes.post(
    "/login",
    validateAdminLogin,
    adminAuthController.login.bind(adminAuthController)
  );
  adminAuthRoutes.post(
    "/logout",
    decodedRefreshToken,
    adminAuthController.logout.bind(adminAuthController)
  );
  adminAuthRoutes.post(
    "/refresh-token",
    verifyRefreshTokenMiddleware,
    adminAuthController.refreshToken.bind(adminAuthController)
  );
})();

export default adminAuthRoutes;
