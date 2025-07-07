// import { NextFunction, Request, Response } from "express";
// import ApiResponse from "../../utils/apiResponse";
// import { IAdminService } from "../../services/interface/IAdminService";
// import AdminService from "../../services/implementations/AdminService";
// import { IBookingService } from "../../services/interface/IBookingService";
// import BookingService from "../../services/implementations/Bookingservice";
// import { IPaymentService } from "../../services/interface/IPaymentService";
// import PaymentService from "../../services/implementations/PaymentService";
// import { HttpStatus } from "../../constants/HttpStatus";

// class AdminController {
//   private adminService: IAdminService;
//   private bookingService: IBookingService;
//   private paymentService: IPaymentService;

//   constructor() {
//     this.adminService = new AdminService();
//     this.bookingService = new BookingService();
//     this.paymentService = new PaymentService();
//   }

//   public validateSuccessResponse = (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       console.log("admincontroller validateSuccessResponse step1");

//       // If we reach here, the authentication middleware has already validated the session
//       res.status(HttpStatus.OK).json({
//         success: true,
//         message: "Session is valid",
//         data: { user: req.user },
//       });
//     } catch (error) {
//       console.error("Validate session error:", error);
//       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         message: "Session validation failed",
//         error: error instanceof Error ? error.message : "Unknown error",
//       });
//       next(error);
//     }
//   };

//   public getAllUsers = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("adminController all users step1", req.query);
//       const { page = 1, limit = 10, role, status } = req.query;

//       const response = await this.adminService.fetchAllUsers(
//         Number(page),
//         Number(limit),
//         role as string | undefined,
//         status as string | undefined
//       );
//       console.log("adminController all users step2", response);

//       if (response) {
//         console.log("adminController all users step3 success response");
//         res.status(HttpStatus.OK).json({
//           success: true,
//           data: response,
//           message: "Users fetched successfully",
//         });
//       } else {
//         console.log("adminController all users step4 no response");
//         res.status(HttpStatus.NOT_FOUND).json({
//           success: false,
//           data: null,
//           message: "No users found",
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         data: null,
//         message: "Failed to fetch users",
//         error: error instanceof Error ? error.message : "Unknown error",
//       });
//       next(error);
//     }
//   };

//   public userDatas = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("userDatas admin controller step 1:", req.params.id);
//       const id = req.params.id;
//       const response = await this.adminService.getUserDatas(id);
//       console.log("userDatas admin controller step 2:", response);

//       if (response) {
//         res.status(HttpStatus.OK).json({
//           success: true,
//           data: response,
//           message: "User data fetched successfully",
//         });
//       } else {
//         res.status(HttpStatus.NOT_FOUND).json({
//           success: false,
//           data: null,
//           message: "User not found or data retrieval failed",
//         });
//       }
//     } catch (error) {
//       console.error("Error in userDatas:", error);
//       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         data: null,
//         message: "Internal server error",
//         error: error instanceof Error ? error.message : "Unknown error",
//       });
//       next(error);
//     }
//   };

//   public mentorStatusUpdate = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("admincontroller mentorStatusUpdate step1 ", req.params.id);
//       console.log("admincontroller mentorStatusUpdate step2 ", req.body);
//       const id = req.params.id;
//       const { status, reason } = req.body;

//       const response = await this.adminService.mentorStatusChange(
//         id,
//         status,
//         reason
//       );
//       console.log("admincontroller mentorStatusUpdate step3 response", response);

//       res.status(HttpStatus.OK).json({
//         success: true,
//         data: response,
//         message: "Mentor status updated successfully",
//       });
//     } catch (error) {
//       console.error("Error updating mentor status:", error);
//       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         data: null,
//         message: "Failed to update mentor status",
//         error: error instanceof Error ? error.message : "Unknown error",
//       });
//       next(error);
//     }
//   };

//   public userStatusUpdate = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("admincontroller userStatusUpdate step1 ", req.params.id);
//       console.log("admincontroller userStatusUpdate step2 ", req.body);
//       const id = req.params.id;
//       const status = req.body.isBlocked;

//       const response = await this.adminService.userStatusChange(id, status);
//       console.log("admincontroller userStatusUpdate step3 response", response);

//       res.status(HttpStatus.OK).json({
//         success: true,
//         data: response,
//         message: "User status updated successfully",
//       });
//     } catch (error) {
//       console.error("Error updating user status:", error);
//       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         data: null,
//         message: "Failed to update user status",
//         error: error instanceof Error ? error.message : "Unknown error",
//       });
//       next(error);
//     }
//   };

//   public getAllBookings = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const page = parseInt(req.query.page as string) || 1;
//       const limit = parseInt(req.query.limit as string) || 10;
//       const searchQuery = (req.query.searchQuery as string) || "";
//       const service = (req.query.service as string) || "";
//       const status = (req.query.status as string) || "";

//       const { bookings, total } = await this.bookingService.getAllBookings(
//         page,
//         limit,
//         searchQuery,
//         service,
//         status
//       );

//       res.status(HttpStatus.OK).json({
//         success: true,
//         data: { data: bookings, total: total },
//         message: "Bookings fetched successfully",
//       });
//     } catch (error: any) {
//       console.error("Error fetching all bookings:", error);
//       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         data: null,
//         message: "Failed to fetch bookings",
//         error: error instanceof Error ? error.message : "Unknown error",
//       });
//       next(error);
//     }
//   };

//   public getAllPayments = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const page = parseInt(req.query.page as string) || 1;
//       const limit = parseInt(req.query.limit as string) || 10;
//       const searchQuery = (req.query.searchQuery as string) || "";
//       const status = (req.query.status as string) || "";

//       const { payments, total } = await this.paymentService.getAllPayments(
//         page,
//         limit,
//         searchQuery,
//         status
//       );

//       res.status(HttpStatus.OK).json({
//         success: true,
//         data: { data: payments, total: total },
//         message: "Payments fetched successfully",
//       });
//     } catch (error: any) {
//       console.error("Error fetching all payments:", error);
//       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         data: null,
//         message: "Failed to fetch payments",
//         error: error instanceof Error ? error.message : "Unknown error",
//       });
//       next(error);
//     }
//   };

//   public transferToMentor = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const { paymentId, mentorId, amount } = req.body;
//       console.log("admincontroller transferToMentor step1", {
//         paymentId,
//         mentorId,
//         amount,
//       });

//       const response = await this.paymentService.transferToMentor(
//         paymentId,
//         mentorId,
//         amount
//       );
//       console.log("admincontroller transferToMentor step2", response);

//       res.status(HttpStatus.OK).json({
//         success: true,
//         data: response,
//         message: "Payment transferred to mentor successfully",
//       });
//     } catch (error) {
//       console.error("Error transferring to mentor:", error);
//       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         data: null,
//         message: "Failed to transfer payment to mentor",
//         error: error instanceof Error ? error.message : "Unknown error",
//       });
//       next(error);
//     }
//   };
// }

// export default new AdminController();
import { NextFunction, Request, Response } from "express";
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
      console.log("admincontroller validateSuccessResponse step1");

      // If we reach here, the authenticate middleware has already validated the access token from cookies
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Session is valid",
        data: { user: req.user },
      });
    } catch (error) {
      console.error("Validate session error:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Session validation failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
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
        res.status(HttpStatus.OK).json({
          success: true,
          data: response,
          message: "Users fetched successfully",
        });
      } else {
        console.log("adminController all users step4 no response");
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          data: null,
          message: "No users found",
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: null,
        message: "Failed to fetch users",
        error: error instanceof Error ? error.message : "Unknown error",
      });
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
        res.status(HttpStatus.OK).json({
          success: true,
          data: response,
          message: "User data fetched successfully",
        });
      } else {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          data: null,
          message: "User not found or data retrieval failed",
        });
      }
    } catch (error) {
      console.error("Error in userDatas:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: null,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
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
      const { status, reason } = req.body;

      const response = await this.adminService.mentorStatusChange(
        id,
        status,
        reason
      );
      console.log(
        "admincontroller mentorStatusUpdate step3 response",
        response
      );

      res.status(HttpStatus.OK).json({
        success: true,
        data: response,
        message: "Mentor status updated successfully",
      });
    } catch (error) {
      console.error("Error updating mentor status:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: null,
        message: "Failed to update mentor status",
        error: error instanceof Error ? error.message : "Unknown error",
      });
      next(error);
    }
  };

  public userStatusUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("admincontroller userStatusUpdate step1 ", req.params.id);
      console.log("admincontroller userStatusUpdate step2 ", req.body);
      const id = req.params.id;
      const status = req.body.isBlocked;

      const response = await this.adminService.userStatusChange(id, status);
      console.log("admincontroller userStatusUpdate step3 response", response);

      res.status(HttpStatus.OK).json({
        success: true,
        data: response,
        message: "User status updated successfully",
      });
    } catch (error) {
      console.error("Error updating user status:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: null,
        message: "Failed to update user status",
        error: error instanceof Error ? error.message : "Unknown error",
      });
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

      res.status(HttpStatus.OK).json({
        success: true,
        data: { data: bookings, total: total },
        message: "Bookings fetched successfully",
      });
    } catch (error: any) {
      console.error("Error fetching all bookings:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: null,
        message: "Failed to fetch bookings",
        error: error instanceof Error ? error.message : "Unknown error",
      });
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

      res.status(HttpStatus.OK).json({
        success: true,
        data: { data: payments, total: total },
        message: "Payments fetched successfully",
      });
    } catch (error: any) {
      console.error("Error fetching all payments:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: null,
        message: "Failed to fetch payments",
        error: error instanceof Error ? error.message : "Unknown error",
      });
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

      res.status(HttpStatus.OK).json({
        success: true,
        data: response,
        message: "Payment transferred to mentor successfully",
      });
    } catch (error) {
      console.error("Error transferring to mentor:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: null,
        message: "Failed to transfer payment to mentor",
        error: error instanceof Error ? error.message : "Unknown error",
      });
      next(error);
    }
  };
}

export default new AdminController();
