import { Request, Response } from "express";
import { ApiError } from "../../middlewares/errorHandler";
import ApiResponse from "../../utils/apiResponse";
import AdminAuthService from "../../services/implementations/AdminAuthService";

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
  //login
  public login = async (req: Request, res: Response): Promise<void> => {
    console.log("Controller - Login request received:", req.body);
    const loginData = await this.adminAuthService.login(req.body);
    console.log("Controller - Login service response:", loginData);

    if (!loginData) {
      console.log("Controller - Login failed: Invalid credentials");
      res.status(400).json(new ApiError(400, "Invalid email or password"));
      return;
    }

    console.log("Controller - Login successful login data is", loginData);

    res
      .status(200)
      .cookie("adminRefreshToken", loginData.refreshToken, this.options)
      .json(new ApiResponse(200, loginData));
    return;
  };

  //logout

  public logout = async (req: Request, res: Response) => {
    // Assert that req.user is defined since middleware guarantees it
    const { rawToken, id } = req.user!;
    console.log("admin logout step 1", rawToken, id);

    const logoutData = await this.adminAuthService.logout(rawToken, id);
    console.log("admin logout step 2", logoutData);
    if (logoutData) {
      console.log("admin logout step 3 error");
      res
        .status(200)
        .clearCookie("adminRefreshToken")
        .json(
          new ApiResponse(
            200,
            { message: "successfully cleared the token" },
            "logout success"
          )
        );
      console.log("admin logout step 3 success");
      return;
    }

    res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          "Something Went Wrong Clear your Browser Cookies"
        )
      );
    console.log("admin logout step 4 error 500");
    return;
  };

  public refreshAccessToken = async (req: Request, res: Response) => {
    // Assert that req.user is defined since middleware guarantees it
    const { id } = req.user!;
    console.log("admin refreshAccessToken  step1 ");
    const accessToken = await this.adminAuthService.refreshAccessToken(id);
    console.log("admin refreshAccessToken  step2 ", accessToken);
    if (accessToken) {
      console.log("admin refreshAccessToken  step3 have token");
      res
        .status(200)
        .json(
          new ApiResponse(200, { accessToken }, "token Created Successfully")
        );
      console.log("admin refreshAccessToken  step4 no toekn");
      return;
    }
    // Add error handling if needed
    console.log("admin refreshAccessToken  step6 errorr ");
    res.status(500).json(new ApiResponse(500, null, "Failed to refresh token"));
  };
}

export default new AdminAuthController();
