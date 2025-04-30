// src/controllers/adminController.ts
import { NextFunction, Request, response, Response } from "express";
import ApiResponse from "../../utils/apiResponse";
import { EUsers } from "../../entities/userEntity";
import { inAdminService } from "../../services/interface/inAdminService";
import imAdminService from "../../services/implementations/imAdminService";
import { string } from "joi";

class AdminController {
  private adminService: inAdminService;

  constructor() {
    this.adminService = new imAdminService();
  }

  public validateSuccessResponse = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("admincontrolleer validateSuccessResponse step1");

      res.status(200).json(new ApiResponse(200, null, "Success"));
      return;
    } catch (error) {
      next(error);
    }
  };

  // public getAllUsers = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   try {
  //     console.log("adminController all users step1", req.query);
  //     const { page = 1, limit = 10, role, status } = req.query;

  //     const response = await this.adminService.fetchAllUsers(
  //       Number(page),
  //       Number(limit),
  //       role as string | undefined,
  //       status as string | undefined
  //     );
  //     console.log("adminController all users step2", response);
  //     if (response) {
  //       console.log("adminController all users step3 success response");
  //       res
  //         .status(200)
  //         .json(new ApiResponse(200, response, "Users fetched successfully"));
  //     } else {
  //       console.log("adminController all users step4 no response");
  //       res.status(404).json(new ApiResponse(404, null, "No users found"));
  //     }
  //   } catch (error) {
  //     next(error);
  //   }
  // };
  public getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("adminController all users step1", req.query);
      const { page = 1, limit = 10, role, status } = req.query;

      const response = await this.adminService.fetchAllUsers(
        Number(page),
        Number(limit),
        role as string | undefined,
        status as string | undefined
      );
      console.log("adminController all users step2", response);
      if (response) {
        console.log("adminController all users step3 success response");
        res
          .status(200)
          .json(new ApiResponse(200, response, "Users fetched successfully"));
      } else {
        console.log("adminController all users step4 no response");
        res.status(404).json(new ApiResponse(404, null, "No users found"));
      }
    } catch (error) {
      next(error);
    }
  };
  public userDatas = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("userDatas admin controller step 1:", req.params.id);
      const id = req.params.id;
      const response = await this.adminService.getUserDatas(id);
      console.log("userDatas admin controller step 2:", response);
      if (response) {
        res
          .status(200)
          .json(
            new ApiResponse(200, response, "User data fetched successfully")
          );
      } else {
        res.status(404).json(new ApiResponse(404, null, "User not found"));
      }
    } catch (error) {
      next(error);
    }
  };

  public mentorStatusUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("admincontroller mentorStatusUpdate step1 ", req.params.id);
      console.log("admincontroller mentorStatusUpdate step2 ", req.body);
      const id = req.params.id;
      const { status, reason } = req.body; // Extract reason from body
      const response = await this.adminService.mentorStatusChange(
        id,
        status,
        reason
      );
      console.log(
        "admincontroller mentorStatusUpdate step3 response",
        response
      );
      res
        .status(200)
        .json(
          new ApiResponse(200, response, "Mentor status updated successfully")
        );
    } catch (error) {
      next(error);
    }
  };
  // public mentorStatusUpdate = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   try {
  //     console.log("admincontroller mentorStatusUpdate step1 ", req.params.id);
  //     console.log("admincontroller mentorStatusUpdate step2 ", req.body);
  //     const id = req.params.id;
  //     const status = req.body.status;
  //     const repsonse = await this.adminService.mentorStatusChange(id, status);
  //     console.log(
  //       "admincontroller mentorStatusUpdate step3 resposne",
  //       repsonse
  //     );
  //     res
  //       .status(200)
  //       .json(
  //         new ApiResponse(200, repsonse, "Mentor status updated successfully")
  //       );
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  public userStatusUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("admincontroller mentorStatusUpdate step1 ", req.params.id);
      console.log("admincontroller mentorStatusUpdate step2 ", req.body);
      const id = req.params.id;
      const status = req.body.isBlocked;
      const repsonse = await this.adminService.userStatusChange(id, status);
      console.log(
        "admincontroller mentorStatusUpdate step3 resposne",
        repsonse
      );
      res
        .status(200)
        .json(
          new ApiResponse(200, repsonse, "Mentor status updated successfully")
        );
    } catch (error) {
      next(error);
    }
  };
  //===========================================
}
export default new AdminController();
