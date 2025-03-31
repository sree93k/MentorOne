import { Router } from "express";
import userAuthController from "../../controllers/userAuth/userAuthController";
import {
  validateUserLogin,
  validateUserSignUp,
  validateSignUpOTP,
  validateReceivedOTP,
  validateGoogleData,
  validateEmail,
  validateResetPassword
} from "../../validator/userValidator";

const userAuthRoutes = Router();

// User auth routes

userAuthRoutes.post(
  "/auth/sendOTP",
  validateSignUpOTP,
  userAuthController.sendOTP
);

// userAuthRoutes.post(
//   "/auth/verifyEmail",
//   validateReceivedOTP,
//   userAuthController.verifyEmail
// );
userAuthRoutes.post(
  "/auth/signup",
  validateUserSignUp,
  userAuthController.createUser
);
userAuthRoutes.post("/auth/login", validateUserLogin, userAuthController.login);

userAuthRoutes.post(
  "/auth/google_signin",
  validateGoogleData,
  userAuthController.googleAuthentication
);

userAuthRoutes.post(
  "/auth/forgot_password_otp",
  validateEmail,
  userAuthController.forgotPasswordOTP
);

userAuthRoutes.post(
  "/auth/otp_verify",
  validateEmail,
  userAuthController.verifyOTP
);

userAuthRoutes.patch(
  "/auth/forgot_password_reset",
  validateResetPassword,
  userAuthController.resetPassword
);
export default userAuthRoutes;
