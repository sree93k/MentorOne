// import { Router } from "express";
// import userAuthController from "../../controllers/implementation/userAuthController";
// import {
//   validateUserLogin,
//   validateUserSignUp,
//   validateSignUpOTP,
//   validateReceivedOTP,
//   validateGoogleData,
//   validateEmail,
//   validateResetPassword,
// } from "../../validator/userValidator";
// import {
//   authenticate,
//   authenticateUser,
//   decodedRefreshToken,
//   decodedUserRefreshToken,
//   verifyUserRefreshToken,
// } from "../../middlewares/authenticateuser";
// const userAuthRoutes = Router();

// // User auth routes

// userAuthRoutes.post("/sendOTP", validateSignUpOTP, userAuthController.sendOTP);

// userAuthRoutes.post(
//   "/signup",
//   validateUserSignUp,
//   userAuthController.createUser
// );
// userAuthRoutes.post("/login", validateUserLogin, userAuthController.login);

// userAuthRoutes.post(
//   "/google_signin",
//   validateGoogleData,
//   userAuthController.googleAuthentication
// );

// userAuthRoutes.post(
//   "/forgot_password_otp",
//   validateEmail,
//   userAuthController.forgotPasswordOTP
// );

// userAuthRoutes.post("/otp_verify", validateEmail, userAuthController.verifyOTP);

// userAuthRoutes.patch(
//   "/forgot_password_reset",
//   validateResetPassword,
//   userAuthController.resetPassword
// );

// userAuthRoutes.patch(
//   "/logout",
//   decodedUserRefreshToken,
//   userAuthController.logout
// );

// export default userAuthRoutes;
import { Router } from "express";
import userAuthController from "../../controllers/implementation/userAuthController";
import {
  validateUserLogin,
  validateUserSignUp,
  validateSignUpOTP,
  validateReceivedOTP,
  validateGoogleData,
  validateEmail,
  validateResetPassword,
} from "../../validator/userValidator";
import {
  authenticate,
  authenticateUser,
  decodedRefreshToken,
  decodedUserRefreshToken,
  verifyUserRefreshToken,
  verifyRefreshTokenMiddleware,
} from "../../middlewares/authenticateuser";

const userAuthRoutes = Router();

// User auth routes
userAuthRoutes.post("/sendOTP", validateSignUpOTP, userAuthController.sendOTP);

userAuthRoutes.post(
  "/signup",
  validateUserSignUp,
  userAuthController.createUser
);

userAuthRoutes.post("/login", validateUserLogin, userAuthController.login);

userAuthRoutes.post(
  "/google_signin",
  validateGoogleData,
  userAuthController.googleAuthentication
);

userAuthRoutes.post(
  "/forgot_password_otp",
  validateEmail,
  userAuthController.forgotPasswordOTP
);

userAuthRoutes.post("/otp_verify", validateEmail, userAuthController.verifyOTP);

userAuthRoutes.patch(
  "/forgot_password_reset",
  validateResetPassword,
  userAuthController.resetPassword
);

// ✅ UPDATED: Use new middleware that doesn't expect refresh token from cookies
userAuthRoutes.patch(
  "/logout",
  verifyRefreshTokenMiddleware,
  userAuthController.logout
);

// ✅ NEW: Add refresh token route (requires valid refresh token)
userAuthRoutes.post(
  "/refresh-token",
  verifyRefreshTokenMiddleware,
  userAuthController.refreshToken
);

export default userAuthRoutes;
