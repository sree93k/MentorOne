import { Router } from "express";
import adminController from "../../controllers/adminController/adminController";
import { validateAdminLogin } from "../../validator/adminValidator";
import adminAuthRoute from "./adminAuthRoute";
import { authenticate } from "../../middlewares/authenticateuser";

const adminRoutes = Router();

adminRoutes.use("/auth", adminAuthRoute);

adminRoutes.get("/validate_session", adminController.validateSuccessResponse);
// adminRoutes.get("/allUsers", authenticate, adminController.getAllUser);

export default adminRoutes;
