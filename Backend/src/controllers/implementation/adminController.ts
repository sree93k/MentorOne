// src/controllers/adminController.ts
import { NextFunction, Request, response, Response } from "express";
import ApiResponse from "../../utils/apiResponse";
import { IAdminService } from "../../services/interface/IAdminService";
import AdminService from "../../services/implementations/AdminService";
import { IBookingService } from "../../services/interface/IBookingService";
import BookingService from "../../services/implementations/Bookingservice";
import { IPaymentService } from "../../services/interface/IPaymentService";
import PaymentService from "../../services/implementations/PaymentService";
import { HttpStatus } from "../../constants/HttpStatus";

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

      res
        .status(HttpStatus.OK)
        .json(new ApiResponse(HttpStatus.OK, null, "Success"));
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
          .status(HttpStatus.OK)
          .json(
            new ApiResponse(
              HttpStatus.OK,
              response,
              "Users fetched successfully"
            )
          );
      } else {
        console.log("adminController all users step4 no response");
        res
          .status(HttpStatus.NOT_FOUND)
          .json(new ApiResponse(HttpStatus.NOT_FOUND, null, "No users found"));
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
          .status(HttpStatus.OK)
          .json(
            new ApiResponse(
              HttpStatus.OK,
              response,
              "User data fetched successfully"
            )
          );
      } else {
        res
          .status(HttpStatus.NOT_FOUND)
          .json(
            new ApiResponse(
              HttpStatus.NOT_FOUND,
              null,
              "User not found or data retrieval failed"
            )
          );
      }
    } catch (error) {
      console.error("Error in userDatas:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            null,
            "Internal server error"
          )
        );
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
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            response,
            "Mentor status updated successfully"
          )
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
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            repsonse,
            "Mentor status updated successfully"
          )
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

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { data: bookings, total: total },
            "Bookings fetched successfully"
          )
        );
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

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { data: payments, total: total },
            "Payments fetched successfully"
          )
        );
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
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
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

export const testCookies = (req: Request, res: Response): void => {
  console.log("🧪 === COOKIE TEST ENDPOINT ===");
  console.log("🧪 Request cookies:", req.cookies);
  console.log("🧪 Request headers cookie:", req.headers.cookie);

  // Set a test cookie
  res.cookie("testCookie", "testValue", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 1000, // 1 minute
    path: "/",
  });

  res.json({
    message: "Cookie test endpoint",
    cookiesReceived: req.cookies,
    cookieHeader: req.headers.cookie,
    testCookieSet: true,
  });
};
