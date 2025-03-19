import { Request, Response } from 'express';
import { ApiError } from '../../middlewares/errorHandler';
import ApiResponse from '../../utils/apiResponse';
import AdminAuthService from '../../services/implementations/imAdminAuthService';

class AdminAuthController {
    private adminAuthService: AdminAuthService;

    private options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    };

    constructor() {
        this.adminAuthService = new AdminAuthService();
    }

    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            const loginData = await this.adminAuthService.login(req.body);

            if (loginData) {
                res.status(200)
                    .cookie('adminRefreshToken', loginData.refreshToken, this.options)
                    .json(new ApiResponse(200, loginData));
                return;
            }

            res.status(400).json(new ApiError(400, 'Login failed', 'Invalid credentials'));
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
            res.status(500).json(new ApiError(500, 'Internal Server Error', errorMessage));
        }
    };

    public logout = async (req: Request, res: Response): Promise<void> => {
        try {
            const { refreshToken } = req.cookies;
            const { id } = req.params;

            const result = await this.adminAuthService.logout(refreshToken, id);

            if (result) {
                res.clearCookie('adminRefreshToken', this.options)
                    .status(200)
                    .json(new ApiResponse(200, { message: 'Logged out successfully' }));
                return;
            }

            res.status(400).json(new ApiError(400, 'Logout failed', 'Invalid session'));
        } catch (error) {
            console.error('Logout error:', error);
            const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
            res.status(500).json(new ApiError(500, 'Internal Server Error', errorMessage));
        }
    };
}

export default new AdminAuthController();