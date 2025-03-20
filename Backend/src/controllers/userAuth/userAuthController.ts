import { Request, Response } from 'express';
import { ApiError } from '../../middlewares/errorHandler';
import ApiResponse from '../../utils/apiResponse';
import imUserAuthService from '../../services/implementations/imUserAuthService'

class UserAuthController {
    private userAuthService: imUserAuthService;

    private options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
    };

    constructor() {
        this.userAuthService = new imUserAuthService();
    }

    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log("Controller - Login request received:", req.body);
            const loginData = await this.userAuthService.login(req.body);
            console.log("Controller - Login service response:", loginData);
            
            if (!loginData) {
                console.log("Controller - Login failed: Invalid credentials");
                res.status(401).json(new ApiError(401, "Authentication Failed", "Invalid email or password"));
                return;
            }

            console.log("Controller - Login successful");
            res.status(200).json(new ApiResponse(200, loginData));
        } catch (error) {
            console.error("Controller - Login error:", error);
            if (error instanceof ApiError) {
                res.status(error.statusCode).json(error);
            } else {
                res.status(500).json(new ApiError(500, "Internal Server Error", "An unexpected error occurred"));
            }
        }
    };

   
}

export default new UserAuthController();