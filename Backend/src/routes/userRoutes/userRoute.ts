import { Router } from "express";
import userAuthRoute from "./userAuthRoute";
// import userPrivateRoute from './userPrivateRoute'
// import {authenticateUser} from '../../middlewares/authenticateuser'
import userPrivateRoute from "./userPrivateRoute";
import userController from "../../controllers/implementation/userController";

const userRoutes = Router();

userRoutes.use("/auth", userAuthRoute);
userRoutes.get("/validate_session", userController.validateSuccessResponse);

userRoutes.use("/", userPrivateRoute);

export default userRoutes;
