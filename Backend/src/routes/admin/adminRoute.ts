import { Router } from 'express';
import adminAuthController from '../../controllers/adminAuth/adminAuthController';
import { validateAdminLogin } from '../../validator/adminValidator';

const adminAuthRoutes = Router();

// Admin login route
adminAuthRoutes.post('/login', validateAdminLogin, adminAuthController.login);

export default adminAuthRoutes;