import { z } from "zod";
import { IUserService } from "../interface/IUserService";
import { IBookingService } from "../interface/IBookingService";
import { IPaymentService } from "../interface/IPaymentService";
import { IServiceServices } from "../interface/IServiceServices";
import { IAdminService } from "../interface/IAdminService";
import { UserResponseDto } from "../../dtos/userDTO";
import {
  FetchUsersQueryDto,
  FetchBookingsQueryDto,
  FetchPaymentsQueryDto,
  TransferToMentorDto,
} from "../../dtos/adminDTO";
import { logger } from "../../utils/logger";
import { AppError } from "../../errors/appError";
import { HttpStatus } from "../../constants/HttpStatus";
import { EBooking } from "../../entities/bookingEntity";
import { EPayment } from "../../entities/paymentEntity";
import { EService } from "../../entities/serviceEntity";

export class AdminService implements IAdminService {
  constructor(
    private readonly userService: IUserService,
    private readonly bookingService: IBookingService,
    private readonly paymentService: IPaymentService,
    private readonly serviceServices: IServiceServices
  ) {}

  async validateSession(userId: string): Promise<boolean> {
    const QuerySchema = z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).default(1),
      searchQuery: z.string(),
    });

    try {
      const query = QuerySchema.parse({
        page: 1,
        limit: 1,
        searchQuery: userId,
      });
      const result = await this.userService.getAllUsers(query);
      return !!result.users.length;
    } catch (error) {
      logger.error("Error validating session", {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to validate session",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "VALIDATE_SESSION_ERROR"
      );
    }
  }

  async fetchDashboard(): Promise<{
    users: UserResponseDto[];
    bookings: EBooking[];
    payments: EPayment[];
    services: EService[];
  }> {
    try {
      const allServices = await this.serviceServices.findAllServices();
      const allBookings = await this.bookingService.findAllBookings();
      const allPayments = await this.paymentService.findAllPayments();
      const allUsers = await this.userService.findAllUsers();

      return {
        users: allUsers,
        bookings: allBookings,
        payments: allPayments,
        services: allServices,
      };
    } catch (error) {
      logger.error("Error fetching dashboard data", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to fetch dashboard data",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FETCH_DASHBOARD_ERROR"
      );
    }
  }

  async fetchAllUsers(
    query: FetchUsersQueryDto
  ): Promise<{ users: UserResponseDto[]; total: number }> {
    try {
      return await this.userService.getAllUsers(query);
    } catch (error) {
      logger.error("Error fetching all users in AdminService", {
        query,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to fetch users",
            HttpStatus.INTERNAL_SERVER,
            "error",
            "FETCH_USERS_ADMIN_ERROR"
          );
    }
  }

  async getUserDetails(userId: string): Promise<UserResponseDto | null> {
    const QuerySchema = z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).default(1),
      searchQuery: z.string(),
    });

    try {
      const query = QuerySchema.parse({
        page: 1,
        limit: 1,
        searchQuery: userId,
      });
      const result = await this.userService.getAllUsers(query);
      return result.users[0] || null;
    } catch (error) {
      logger.error("Error fetching user details", {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to fetch user details",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FETCH_USER_DETAILS_ERROR"
      );
    }
  }

  async getAllBookings(
    query: FetchBookingsQueryDto
  ): Promise<{ bookings: EBooking[]; total: number }> {
    try {
      return await this.bookingService.findAll(query);
    } catch (error) {
      logger.error("Error fetching all bookings", {
        query,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to fetch bookings",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FETCH_BOOKINGS_ERROR"
      );
    }
  }

  async getAllPayments(
    query: FetchPaymentsQueryDto
  ): Promise<{ payments: EPayment[]; total: number }> {
    try {
      return await this.paymentService.getAllPayments(query);
    } catch (error) {
      logger.error("Error fetching all payments", {
        query,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to fetch payments",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FETCH_PAYMENTS_ERROR"
      );
    }
  }

  async transferToMentor(dto: TransferToMentorDto): Promise<any> {
    try {
      return await this.paymentService.transferToMentor(dto);
    } catch (error) {
      logger.error("Error transferring to mentor", {
        dto,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to transfer to mentor",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "TRANSFER_MENTOR_ERROR"
      );
    }
  }

  async mentorStatusChange(dto: {
    id: string;
    status: string;
  }): Promise<UserResponseDto> {
    throw new AppError(
      "Method not implemented",
      HttpStatus.NOT_IMPLEMENTED,
      "error",
      "MENTOR_STATUS_CHANGE_NOT_IMPLEMENTED"
    );
  }

  async userStatusChange(dto: {
    id: string;
    isBlocked: boolean;
  }): Promise<UserResponseDto> {
    throw new AppError(
      "Method not implemented",
      HttpStatus.NOT_IMPLEMENTED,
      "error",
      "USER_STATUS_CHANGE_NOT_IMPLEMENTED"
    );
  }
}
