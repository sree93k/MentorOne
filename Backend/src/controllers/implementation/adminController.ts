import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/HttpStatus";
import { IAdminService } from "../../services/interface/IAdminService";
import { wrapAsync } from "../../errors/catchAsync";
import { ApiResponse } from "../../utils/apiResponse";
import { logger } from "../../utils/logger";
import { AppError } from "../../errors/appError";
import {
  FetchUsersQueryDto,
  MentorStatusUpdateDTO,
  UserStatusUpdateDTO,
  FetchBookingsQueryDto,
  FetchPaymentsQueryDto,
  TransferToMentorDto,
} from "../../dtos/adminDTO";
import { IAdminController } from "../interface/IAdminController";
import { z } from "zod";

export class AdminController implements IAdminController {
  constructor(private readonly adminService: IAdminService) {}

  public validateSuccessResponse = wrapAsync(
    async (req: Request, res: Response) => {
      logger.info("Validating admin session", { userId: req.user?.id });
      const userId = req.user?.id;

      if (!userId) {
        logger.warn("Validate session failed: Missing user ID");
        throw new AppError(
          "Missing user ID",
          HttpStatus.BAD_REQUEST,
          "warn",
          "MISSING_USER_ID"
        );
      }

      const isValid = await this.adminService.validateSession(userId);
      if (!isValid) {
        logger.warn("Validate session failed: Invalid session", { userId });
        throw new AppError(
          "Invalid session",
          HttpStatus.UNAUTHORIZED,
          "warn",
          "INVALID_SESSION"
        );
      }

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(HttpStatus.OK, null, "Session validated successfully")
        );
    }
  );

  public getAllUsers = wrapAsync(
    async (req: Request, res: Response, _next: NextFunction) => {
      logger.info("Fetching all users", { query: req.query });
      const QuerySchema = z.object({
        page: z
          .string()
          .optional()
          .transform((val) => Number(val) || 1),
        limit: z
          .string()
          .optional()
          .transform((val) => Number(val) || 12),
        role: z.enum(["mentee", "mentor", "all"]).optional(),
        status: z.enum(["blocked", "active"]).optional(),
        searchQuery: z.string().optional(),
      });

      const query = QuerySchema.parse(req.query) as FetchUsersQueryDto;

      const response = await this.adminService.fetchAllUsers(query);
      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(HttpStatus.OK, response, "Users fetched successfully")
        );
    }
  );

  public userDatas = wrapAsync(async (req: Request, res: Response) => {
    logger.info("Fetching user data", { userId: req.params.id });
    const userId = req.params.id;

    if (!userId) {
      logger.warn("Fetch user data failed: Missing user ID");
      throw new AppError(
        "Missing user ID",
        HttpStatus.BAD_REQUEST,
        "warn",
        "MISSING_USER_ID"
      );
    }

    const response = await this.adminService.getUserDetails(userId);
    if (!response) {
      logger.warn("Fetch user data failed: User not found", { userId });
      throw new AppError(
        "User not found",
        HttpStatus.NOT_FOUND,
        "warn",
        "USER_NOT_FOUND"
      );
    }

    res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(
          HttpStatus.OK,
          response,
          "User data fetched successfully"
        )
      );
  });

  public getAllBookings = wrapAsync(async (req: Request, res: Response) => {
    logger.info("Fetching all bookings", { query: req.query });
    const QuerySchema = z.object({
      page: z
        .string()
        .optional()
        .transform((val) => Number(val) || 1),
      limit: z
        .string()
        .optional()
        .transform((val) => Number(val) || 10),
      searchQuery: z.string().optional(),
      service: z.string().optional(),
      status: z.string().optional(),
    });

    const query = QuerySchema.parse(req.query) as FetchBookingsQueryDto;

    const response = await this.adminService.getAllBookings(query);
    res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(
          HttpStatus.OK,
          { data: response.bookings, total: response.total },
          "Bookings fetched successfully"
        )
      );
  });

  public getAllPayments = wrapAsync(async (req: Request, res: Response) => {
    logger.info("Fetching all payments", { query: req.query });
    const QuerySchema = z.object({
      page: z
        .string()
        .optional()
        .transform((val) => Number(val) || 1),
      limit: z
        .string()
        .optional()
        .transform((val) => Number(val) || 10),
      searchQuery: z.string().optional(),
      status: z.string().optional(),
    });

    const query = QuerySchema.parse(req.query) as FetchPaymentsQueryDto;

    const response = await this.adminService.getAllPayments(query);
    res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(
          HttpStatus.OK,
          { data: response.payments, total: response.total },
          "Payments fetched successfully"
        )
      );
  });

  public transferToMentor = wrapAsync(async (req: Request, res: Response) => {
    logger.info("Transferring payment to mentor", { body: req.body });
    const TransferSchema = z.object({
      paymentId: z.string(),
      mentorId: z.string(),
      amount: z.number().positive(),
    });

    const dto = TransferSchema.parse(req.body) as TransferToMentorDto;

    const response = await this.adminService.transferToMentor(dto);
    res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(
          HttpStatus.OK,
          response,
          "Payment transferred to mentor successfully"
        )
      );
  });

  public mentorStatusUpdate = wrapAsync(async (req: Request, res: Response) => {
    logger.info("Updating mentor status", {
      mentorId: req.params.id,
      body: req.body,
    });
    const StatusSchema = z.object({
      status: z.enum(["Approved", "Pending", "Rejected"]),
      reason: z.string().optional(),
    });

    const dto: MentorStatusUpdateDTO = {
      id: req.params.id,
      ...StatusSchema.parse(req.body),
    };

    if (!dto.id) {
      logger.warn("Mentor status update failed: Missing mentor ID");
      throw new AppError(
        "Missing mentor ID",
        HttpStatus.BAD_REQUEST,
        "warn",
        "MISSING_MENTOR_ID"
      );
    }

    const response = await this.adminService.mentorStatusChange(dto);
    res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(
          HttpStatus.OK,
          response,
          "Mentor status updated successfully"
        )
      );
  });

  public userStatusUpdate = wrapAsync(async (req: Request, res: Response) => {
    logger.info("Updating user status", {
      userId: req.params.id,
      body: req.body,
    });
    const StatusSchema = z.object({
      status: z
        .union([z.string(), z.boolean()])
        .transform((val) => val === "true" || val === true),
    });

    const dto: UserStatusUpdateDTO = {
      id: req.params.id,
      isBlocked: StatusSchema.parse(req.body).status,
    };

    if (!dto.id) {
      logger.warn("User status update failed: Missing user ID");
      throw new AppError(
        "Missing user ID",
        HttpStatus.BAD_REQUEST,
        "warn",
        "MISSING_USER_ID"
      );
    }

    const response = await this.adminService.userStatusChange(dto);
    res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(
          HttpStatus.OK,
          response,
          "User status updated successfully"
        )
      );
  });
}
