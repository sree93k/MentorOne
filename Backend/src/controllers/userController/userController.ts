import { NextFunction, Request, Response } from "express";
import ApiResponse from "../../utils/apiResponse";
import { inUserService } from "../../services/interface/inUserService";
import imUserService from "../../services/implementations/imUserService";

class UserController {
  private UserService: inUserService;
  constructor() {
    this.UserService = new imUserService();
  }

  public validateSuccessResponse = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.status(200).json(new ApiResponse(200, null, "Success"));
      return;
    } catch (error) {
      next(error);
    }
  };

  //editUserProfile
  public editUserProfile = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("mentee copntroller editUserProfile step 1", req.user);

      const id = req.user?.id;
      if (!id) {
        console.log("mentee copntroller editUserProfile step 2");
        res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
        return;
      }
      console.log("mentee copntroller editUserProfile step 3");
      const payload = req.body;
      console.log("mentee copntroller editUserProfile step 4", payload);
      const updatedUser = await this.UserService.editUserProfile(id, payload);
      console.log("mentee copntroller editUserProfile step 5", updatedUser);
      if (!updatedUser) {
        console.log("mentee copntroller editUserProfile step 6");
        res.status(404).json(new ApiResponse(404, null, "User not found"));
        return;
      }
      console.log("mentee copntroller editUserProfile step 7");
      res
        .status(200)
        .json(
          new ApiResponse(200, updatedUser, "Profile updated successfully")
        );
    } catch (error) {
      console.log("mentee copntroller editUserProfile step 8 errror", error);
      next(error);
    }
  };

  public resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { currentPassword: password, newPassword } = req.body;
      const id = req.user?.id;

      console.log("resetPassword request", req.body);

      if (!id) {
        res.status(400).json(new ApiResponse(400, null, "User ID is required"));
        return;
      }

      const result = await this.UserService.updatePassword(
        id,
        password,
        newPassword
      );

      if (!result.success) {
        console.log("result.message....", result.message);
        res.status(400).json(new ApiResponse(400, null, result.message));
      } else {
        res.status(200).json(new ApiResponse(200, null, result.message));
      }
    } catch (error) {
      console.error("resetPassword error:", error);
      next(error);
    }
  };

  // public resetPassword = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const { currentPassword: password, newPassword } = req.body;
  //     const id = req.user?.id;

  //     console.log("resetPassword request", req.body);

  //     if (!id) {
  //       return res
  //         .status(400)
  //         .json(new ApiResponse(400, null, "User ID is required"));
  //     }

  //     const result = await this.UserService.updatePassword(
  //       id,
  //       password,
  //       newPassword
  //     );

  //     if (!result.success) {
  //       console.log("result.message....", result.message);

  //       return res.status(400).json(new ApiResponse(400, null, result.message));
  //     } else {
  //       return res.status(200).json(new ApiResponse(200, null, result.message));
  //     }
  //   } catch (error) {
  //     console.error("resetPassword error:", error);
  //     next(error);
  //   }
  // };
}

export default new UserController();
