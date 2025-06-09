// src/controllers/adminController.ts
import { NextFunction, Request, response, Response } from "express";
import ApiResponse from "../../utils/apiResponse";
import { EUsers } from "../../entities/userEntity";
import { IAdminService } from "../../services/interface/IAdminService";
import AdminService from "../../services/implementations/AdminService";
import { string } from "joi";
import { IBookingService } from "../../services/interface/IBookingService";
import BookingService from "../../services/implementations/Bookingservice";
import { IPaymentService } from "../../services/interface/IPaymentService";
import PaymentService from "../../services/implementations/PaymentService";

class AdminController {
  private adminService: IAdminService;
  private bookingService: IBookingService;
  private paymentService: IPaymentService;

  constructor() {
    this.adminService = new AdminService();
    this.bookingService = new BookingService();
    this.paymentService = new PaymentService();
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
        res
          .status(404)
          .json(
            new ApiResponse(
              404,
              null,
              "User not found or data retrieval failed"
            )
          );
      }
    } catch (error) {
      console.error("Error in userDatas:", error);
      res.status(500).json(new ApiResponse(500, null, "Internal server error"));
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

  public getAllBookings = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const searchQuery = (req.query.searchQuery as string) || "";
      const service = (req.query.service as string) || "";
      const status = (req.query.status as string) || "";

      const { bookings, total } = await this.bookingService.getAllBookings(
        page,
        limit,
        searchQuery,
        service,
        status
      );

      res.json({ data: bookings, total });
    } catch (error: any) {
      console.error("Error fetching all bookings:", error);
      next(error);
    }
  };

  public getAllPayments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const searchQuery = (req.query.searchQuery as string) || "";
      const status = (req.query.status as string) || "";

      const { payments, total } = await this.paymentService.getAllPayments(
        page,
        limit,
        searchQuery,
        status
      );

      res.json({ data: payments, total });
    } catch (error: any) {
      console.error("Error fetching all payments:", error);
      next(error);
    }
  };

  public transferToMentor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { paymentId, mentorId, amount } = req.body;
      console.log("admincontroller transferToMentor step1", {
        paymentId,
        mentorId,
        amount,
      });
      const response = await this.paymentService.transferToMentor(
        paymentId,
        mentorId,
        amount
      );
      console.log("admincontroller transferToMentor step2", response);
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            response,
            "Payment transferred to mentor successfully"
          )
        );
    } catch (error) {
      console.error("Error transferring to mentor:", error);
      next(error);
    }
  };
}
export default new AdminController();
