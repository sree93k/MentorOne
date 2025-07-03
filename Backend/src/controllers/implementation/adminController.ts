import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../inversify/types";
import { IAdminService } from "../../services/interface/IAdminService";
import { wrapAsync } from "../../errors/catchAsync";
import ApiResponse from "../../utils/apiResponse";
import { HttpStatus } from "../../constants/HttpStatus";
import { logger } from "../../utils/logger";
import {
  FetchUsersQueryDto,
  MentorStatusUpdateDTO,
  UserStatusUpdateDTO,
  FetchBookingsQueryDto,
  FetchPaymentsQueryDto,
  TransferToMentorDto,
} from "../../dtos/adminDTO";

@injectable()
export class AdminController {
  constructor(
    @inject(TYPES.IAdminService) private adminService: IAdminService
  ) {}

  public validateSession = wrapAsync(async (req: Request, res: Response) => {
    logger.info("Validating admin session");
    await this.adminService.validateSession();
    res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(HttpStatus.OK, null, "Session validated successfully")
      );
  });

  public getDashboardDatas = wrapAsync(async (req: Request, res: Response) => {
    logger.info("Fetching dashboard data");
    const response = await this.adminService.fetchDashboardDatas();
    res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(
          HttpStatus.OK,
          response,
          "Dashboard data fetched successfully"
        )
      );
  });

  public getAllUsers = wrapAsync(async (req: Request, res: Response) => {
    logger.info("Fetching all users", { query: req.query });
    const query: FetchUsersQueryDto = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 12,
      role: req.query.role as string | undefined,
      status: req.query.status as string | undefined,
      searchQuery: req.query.searchQuery as string | undefined,
    };

    const response = await this.adminService.fetchAllUsers(query);
    res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(HttpStatus.OK, response, "Users fetched successfully")
      );
  });

  public getUserDetails = wrapAsync(async (req: Request, res: Response) => {
    logger.info("Fetching user data", { userId: req.params.id });
    const userId = req.params.id;
    const response = await this.adminService.getUserDetails(userId);

    if (!response) {
      res
        .status(HttpStatus.NOT_FOUND)
        .json(new ApiResponse(HttpStatus.NOT_FOUND, null, "User not found"));
      return;
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

  public updateMentorStatus = wrapAsync(async (req: Request, res: Response) => {
    logger.info("Updating mentor status", {
      mentorId: req.params.id,
      body: req.body,
    });
    const dto: MentorStatusUpdateDTO = {
      id: req.params.id,
      status: req.body.status,
      reason: req.body.reason,
    };

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

  public updateUserStatus = wrapAsync(async (req: Request, res: Response) => {
    logger.info("Updating user status", {
      userId: req.params.id,
      body: req.body,
    });
    const dto: UserStatusUpdateDTO = {
      id: req.params.id,
      isBlocked: req.body.status === "true" || req.body.status === true,
    };

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

  public getAllBookings = wrapAsync(async (req: Request, res: Response) => {
    logger.info("Fetching all bookings", { query: req.query });
    const query: FetchBookingsQueryDto = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      searchQuery: req.query.searchQuery as string | undefined,
      service: req.query.service as string | undefined,
      status: req.query.status as string | undefined,
    };

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
    const query: FetchPaymentsQueryDto = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      searchQuery: req.query.searchQuery as string | undefined,
      status: req.query.status as string | undefined,
    };

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
    const dto: TransferToMentorDto = {
      paymentId: req.body.paymentId,
      mentorId: req.body.mentorId,
      amount: req.body.amount,
    };

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
}
