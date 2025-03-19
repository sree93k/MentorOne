import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import adminAuthController from "../../controllers/adminAuth/adminAuthController";
import { validateAdminLogin } from "../../validator/adminValidator";

const adminAuthRoutes = Router();

// Admin login route
adminAuthRoutes.post('/login', validateAdminLogin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        return await adminAuthController.login(req, res);
    } catch (error) {
        next(error);
    }
});

export default adminAuthRoutes;