import { Router } from "express";
import userAuthController from "../../controllers/userAuth/userAuthController";
import { validateUserLogin } from "../../validator/userValidator";

const userAuthRoutes = Router();

// Admin login route
userAuthRoutes.post('/login', validateUserLogin, userAuthController.login);

export default userAuthRoutes;