import { Request, Response } from "express";
import { ApiError } from "../../middlewares/errorHandler";
import ApiResponse from "../../utils/apiResponse";
import AdminAuthService from "../../services/implementations/AdminAuthService";
import { HttpStatus } from "../../constants/HttpStatus";

class AdminAuthController {
  private adminAuthService: AdminAuthService;

  public options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  constructor() {
    this.adminAuthService = new AdminAuthService();
  }

  // Login
  public login = async (req: Request, res: Response): Promise<void> => {
    console.log("Controller - Login request received:", req.body);
    const loginData = await this.adminAuthService.login(req.body);
    console.log("Controller - Login service response:", loginData);

    if (!loginData) {
      console.log("Controller - Login failed: Invalid credentials");
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new ApiResponse(
            HttpStatus.BAD_REQUEST,
            null,
            "Invalid email or password"
          )
        );
      return;
    }

    console.log("Controller - Login successful login data is", loginData);

    res
      .status(HttpStatus.OK)
      .cookie("adminRefreshToken", loginData.refreshToken, this.options)
      .json(new ApiResponse(HttpStatus.OK, loginData));
    return;
  };

  // Logout
  public logout = async (req: Request, res: Response) => {
    // Assert that req.user is defined since middleware guarantees it
    const { rawToken, id } = req.user!;
    console.log("admin logout step 1", rawToken, id);

    const logoutData = await this.adminAuthService.logout(rawToken, id);
    console.log("admin logout step 2", logoutData);
    if (logoutData) {
      console.log("admin logout step 3 error");
      res
        .status(HttpStatus.OK)
        .clearCookie("adminRefreshToken")
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { message: "successfully cleared the token" },
            "logout success"
          )
        );
      console.log("admin logout step 3 success");
      return;
    }

    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(
        new ApiResponse(
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          "Something Went Wrong Clear your Browser Cookies"
        )
      );
    console.log("admin logout step 4 error 500");
    return;
  };

  // Refresh Access Token
  public refreshAccessToken = async (req: Request, res: Response) => {
    // Assert that req.user is defined since middleware guarantees it
    const { id } = req.user!;
    console.log("admin refreshAccessToken step1 ");
    const accessToken = await this.adminAuthService.refreshAccessToken(id);
    console.log("admin refreshAccessToken step2 ", accessToken);
    if (accessToken) {
      console.log("admin refreshAccessToken step3 have token");
      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { accessToken },
            "token Created Successfully"
          )
        );
      console.log("admin refreshAccessToken step4 no token");
      return;
    }
    // Add error handling if needed
    console.log("admin refreshAccessToken step6 error ");
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(
        new ApiResponse(
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          "Failed to refresh token"
        )
      );
  };
}

export default new AdminAuthController();
