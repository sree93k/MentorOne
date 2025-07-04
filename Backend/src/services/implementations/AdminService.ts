// import { logger } from "../../utils/logger";
// import { AppError } from "../../errors/appError";
// import { HttpStatus } from "../../constants/HttpStatus";
// import { IAdminRepository } from "../../repositories/interface/IAdminRepository";
// import { IUserRepository } from "../../repositories/interface/IUserRepository";
// import { IBookingRepository } from "../../repositories/interface/IBookingRepository";
// import { IPaymentRepository } from "../../repositories/interface/IPaymentRepository";
// import { IMentorRepository } from "../../repositories/interface/IMentorRepository";
// import {
//   FetchUsersQueryDto,
//   MentorStatusUpdateDTO,
//   UserStatusUpdateDTO,
//   FetchBookingsQueryDto,
//   FetchPaymentsQueryDto,
//   TransferToMentorDto,
// } from "../../dtos/adminDTO";
// import { IAdminService } from "../interface/IAdminService";
// import { EUsers } from "../../entities/userEntity";
// import { EBooking } from "../../entities/bookingEntity";
// import { EPayment } from "../../entities/paymentEntity";
// import { EMentor } from "../../entities/mentorEntity";

// export class AdminService implements IAdminService {
//   constructor(
//     private readonly adminRepository: IAdminRepository,
//     private readonly userRepository: IUserRepository,
//     private readonly bookingRepository: IBookingRepository,
//     private readonly paymentRepository: IPaymentRepository,
//     private readonly mentorRepository: IMentorRepository
//   ) {}

//   async validateSession(userId: string): Promise<boolean> {
//     logger.info("Validating session", { userId });
//     try {
//       const admin = await this.adminRepository.findById(userId);
//       return !!admin;
//     } catch (error) {
//       logger.error("Failed to validate session", {
//         userId,
//         error: error instanceof Error ? error.message : String(error),
//       });
//       throw new AppError(
//         "Failed to validate session",
//         HttpStatus.INTERNAL_SERVER,
//         "error",
//         "VALIDATE_SESSION_ERROR"
//       );
//     }
//   }

//   async fetchAllUsers(
//     query: FetchUsersQueryDto
//   ): Promise<{ data: EUsers[]; total: number }> {
//     logger.info("Fetching all users", { query });
//     try {
//       const { page, limit, role, status, searchQuery } = query;
//       const mongoQuery: any = {};
//       if (role) mongoQuery.role = role;
//       if (status) mongoQuery.isBlocked = status === "blocked";
//       if (searchQuery) {
//         mongoQuery.$or = [
//           { firstName: { $regex: searchQuery, $options: "i" } },
//           { lastName: { $regex: searchQuery, $options: "i" } },
//           { email: { $regex: searchQuery, $options: "i" } },
//         ];
//       }

//       const [data, total] = await Promise.all([
//         this.userRepository.findMany(mongoQuery, page, limit),
//         this.userRepository.countDocuments(mongoQuery),
//       ]);

//       return { data: data as EUsers[], total };
//     } catch (error) {
//       logger.error("Failed to fetch users", {
//         query,
//         error: error instanceof Error ? error.message : String(error),
//       });
//       throw new AppError(
//         "Failed to fetch users",
//         HttpStatus.INTERNAL_SERVER,
//         "error",
//         "FETCH_USERS_ERROR"
//       );
//     }
//   }

//   async getUserDetails(userId: string): Promise<EUsers | null> {
//     logger.info("Fetching user details", { userId });
//     try {
//       const user = await this.userRepository.findById(userId);
//       if (!user) {
//         throw new AppError(
//           "User not found",
//           HttpStatus.NOT_FOUND,
//           "warn",
//           "USER_NOT_FOUND"
//         );
//       }
//       return user;
//     } catch (error) {
//       logger.error("Failed to fetch user details", {
//         userId,
//         error: error instanceof Error ? error.message : String(error),
//       });
//       throw error instanceof AppError
//         ? error
//         : new AppError(
//             "Failed to fetch user details",
//             HttpStatus.INTERNAL_SERVER,
//             "error",
//             "FETCH_USER_DETAILS_ERROR"
//           );
//     }
//   }

//   async getAllBookings(
//     query: FetchBookingsQueryDto
//   ): Promise<{ bookings: EBooking[]; total: number }> {
//     logger.info("Fetching all bookings", { query });
//     try {
//       const { page, limit, searchQuery, service, status } = query;
//       const mongoQuery: any = {};
//       if (service) mongoQuery.serviceId = service;
//       if (status) mongoQuery.status = status;
//       if (searchQuery) {
//         mongoQuery.$or = [
//           { "menteeId.firstName": { $regex: searchQuery, $options: "i" } },
//           { "menteeId.lastName": { $regex: searchQuery, $options: "i" } },
//           { "mentorId.firstName": { $regex: searchQuery, $options: "i" } },
//           { "mentorId.lastName": { $regex: searchQuery, $options: "i" } },
//         ];
//       }

//       const [bookings, total] = await Promise.all([
//         this.bookingRepository.findAllBookings(page, limit, mongoQuery),
//         this.bookingRepository.countAllBookings(mongoQuery),
//       ]);

//       return { bookings, total };
//     } catch (error) {
//       logger.error("Failed to fetch bookings", {
//         query,
//         error: error instanceof Error ? error.message : String(error),
//       });
//       throw new AppError(
//         "Failed to fetch bookings",
//         HttpStatus.INTERNAL_SERVER,
//         "error",
//         "FETCH_BOOKINGS_ERROR"
//       );
//     }
//   }

//   async getAllPayments(
//     query: FetchPaymentsQueryDto
//   ): Promise<{ payments: EPayment[]; total: number }> {
//     logger.info("Fetching all payments", { query });
//     try {
//       const { page, limit, searchQuery, status } = query;
//       const mongoQuery: any = {};
//       if (status) mongoQuery.status = status;
//       if (searchQuery) {
//         mongoQuery.$or = [
//           { "menteeId.email": { $regex: searchQuery, $options: "i" } },
//           { "mentorId.email": { $regex: searchQuery, $options: "i" } },
//         ];
//       }

//       const [payments, total] = await Promise.all([
//         this.paymentRepository.findAllPayments(page, limit, mongoQuery),
//         this.paymentRepository.countAllPayments(mongoQuery),
//       ]);

//       return { payments, total };
//     } catch (error) {
//       logger.error("Failed to fetch payments", {
//         query,
//         error: error instanceof Error ? error.message : String(error),
//       });
//       throw new AppError(
//         "Failed to fetch payments",
//         HttpStatus.INTERNAL_SERVER,
//         "error",
//         "FETCH_PAYMENTS_ERROR"
//       );
//     }
//   }

//   async transferToMentor(dto: TransferToMentorDto): Promise<EPayment> {
//     logger.info("Transferring to mentor", { dto });
//     try {
//       const payment = await this.paymentRepository.findById(dto.paymentId);
//       if (!payment) {
//         throw new AppError(
//           "Payment not found",
//           HttpStatus.NOT_FOUND,
//           "warn",
//           "PAYMENT_NOT_FOUND"
//         );
//       }
//       const mentor = await this.mentorRepository.findById(dto.mentorId);
//       if (!mentor) {
//         throw new AppError(
//           "Mentor not found",
//           HttpStatus.NOT_FOUND,
//           "warn",
//           "MENTOR_NOT_FOUND"
//         );
//       }
//       const result = await this.paymentRepository.update(dto.paymentId, {
//         mentorId: dto.mentorId,
//         amount: dto.amount,
//         status: "transferred",
//       });
//       if (!result) {
//         throw new AppError(
//           "Failed to transfer payment",
//           HttpStatus.INTERNAL_SERVER,
//           "error",
//           "TRANSFER_ERROR"
//         );
//       }
//       return result;
//     } catch (error) {
//       logger.error("Failed to transfer to mentor", {
//         dto,
//         error: error instanceof Error ? error.message : String(error),
//       });
//       throw error instanceof AppError
//         ? error
//         : new AppError(
//             "Failed to transfer to mentor",
//             HttpStatus.INTERNAL_SERVER,
//             "error",
//             "TRANSFER_ERROR"
//           );
//     }
//   }

//   async mentorStatusChange(dto: MentorStatusUpdateDTO): Promise<EMentor> {
//     logger.info("Updating mentor status", { dto });
//     try {
//       const mentor = await this.mentorRepository.findById(dto.id);
//       if (!mentor) {
//         throw new AppError(
//           "Mentor not found",
//           HttpStatus.NOT_FOUND,
//           "warn",
//           "MENTOR_NOT_FOUND"
//         );
//       }
//       const result = await this.mentorRepository.updateField(
//         dto.id,
//         "isApproved",
//         dto.status,
//         dto.reason
//       );
//       if (!result) {
//         throw new AppError(
//           "Failed to update mentor status",
//           HttpStatus.INTERNAL_SERVER,
//           "error",
//           "MENTOR_STATUS_UPDATE_ERROR"
//         );
//       }
//       return result;
//     } catch (error) {
//       logger.error("Failed to update mentor status", {
//         dto,
//         error: error instanceof Error ? error.message : String(error),
//       });
//       throw error instanceof AppError
//         ? error
//         : new AppError(
//             "Failed to update mentor status",
//             HttpStatus.INTERNAL_SERVER,
//             "error",
//             "MENTOR_STATUS_UPDATE_ERROR"
//           );
//     }
//   }

//   async userStatusChange(dto: UserStatusUpdateDTO): Promise<EUsers> {
//     logger.info("Updating user status", { dto });
//     try {
//       const user = await this.userRepository.findById(dto.id);
//       if (!user) {
//         throw new AppError(
//           "User not found",
//           HttpStatus.NOT_FOUND,
//           "warn",
//           "USER_NOT_FOUND"
//         );
//       }
//       const result = await this.userRepository.update(dto.id, {
//         isBlocked: dto.isBlocked,
//       });
//       if (!result) {
//         throw new AppError(
//           "Failed to update user status",
//           HttpStatus.INTERNAL_SERVER,
//           "error",
//           "USER_STATUS_UPDATE_ERROR"
//         );
//       }
//       return result;
//     } catch (error) {
//       logger.error("Failed to update user status", {
//         dto,
//         error: error instanceof Error ? error.message : String(error),
//       });
//       throw error instanceof AppError
//         ? error
//         : new AppError(
//             "Failed to update user status",
//             HttpStatus.INTERNAL_SERVER,
//             "error",
//             "USER_STATUS_UPDATE_ERROR"
//           );
//     }
//   }
// }

import { IUserService } from "../interface/IUserService";
import { IBookingRepository } from "../../repositories/interface/IBookingRepository";
import { IPaymentRepository } from "../../repositories/interface/IPaymentRepository";
import { IAdminService } from "../interface/IAdminService";
import { UserResponseDto } from "../../dtos/userDTO";
import {
  FetchUsersQueryDto,
  FetchBookingsQueryDto,
  FetchPaymentsQueryDto,
  TransferToMentorDto,
  MentorStatusUpdateDTO,
  UserStatusUpdateDTO,
} from "../../dtos/adminDTO";
import { logger } from "../../utils/logger";
import { AppError } from "../../errors/appError";
import { HttpStatus } from "../../constants/HttpStatus";

export class AdminService implements IAdminService {
  constructor(
    private readonly userService: IUserService,
    private readonly bookingRepository: IBookingRepository,
    private readonly paymentRepository: IPaymentRepository
  ) {}

  async validateSession(userId: string): Promise<boolean> {
    try {
      const result = await this.userService.getAllUsers({
        page: 1,
        limit: 1,
        searchQuery: userId,
      });
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
    try {
      const result = await this.userService.getAllUsers({
        page: 1,
        limit: 1,
        searchQuery: userId,
      });
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
  ): Promise<{ bookings: any[]; total: number }> {
    try {
      const { page = 1, limit = 10, searchQuery, service, status } = query;
      const dbQuery: any = {};
      if (searchQuery) {
        dbQuery.$or = [
          { title: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } },
        ];
      }
      if (service) dbQuery.service = service;
      if (status) dbQuery.status = status;

      const [bookings, total] = await Promise.all([
        this.bookingRepository.findMany(dbQuery, page, limit),
        this.bookingRepository.countDocuments(dbQuery),
      ]);

      return { bookings, total };
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
  ): Promise<{ payments: any[]; total: number }> {
    try {
      const { page = 1, limit = 10, searchQuery, status } = query;
      const dbQuery: any = {};
      if (searchQuery) {
        dbQuery.$or = [{ paymentId: { $regex: searchQuery, $options: "i" } }];
      }
      if (status) dbQuery.status = status;

      const [payments, total] = await Promise.all([
        this.paymentRepository.findAllPayments(
          (page - 1) * limit,
          limit,
          dbQuery
        ),
        this.paymentRepository.countAllPayments(dbQuery),
      ]);

      return { payments, total };
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
      const payment = await this.paymentRepository.update(dto.paymentId, {
        status: "transferred",
        mentorId: dto.mentorId,
        amount: dto.amount,
      });
      return payment;
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

  async mentorStatusChange(dto: MentorStatusUpdateDTO): Promise<any> {
    try {
      const result = await this.userService.getAllUsers({
        page: 1,
        limit: 1,
        searchQuery: dto.id,
      });
      if (!result.users.length) {
        throw new AppError(
          "Mentor not found",
          HttpStatus.NOT_FOUND,
          "warn",
          "MENTOR_NOT_FOUND"
        );
      }
      // Placeholder: Add logic to update mentor status if needed
      return result.users[0];
    } catch (error) {
      logger.error("Error changing mentor status", {
        dto,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to change mentor status",
            HttpStatus.INTERNAL_SERVER,
            "error",
            "MENTOR_STATUS_CHANGE_ERROR"
          );
    }
  }

  async userStatusChange(dto: UserStatusUpdateDTO): Promise<any> {
    try {
      const result = await this.userService.getAllUsers({
        page: 1,
        limit: 1,
        searchQuery: dto.id,
      });
      if (!result.users.length) {
        throw new AppError(
          "User not found",
          HttpStatus.NOT_FOUND,
          "warn",
          "USER_NOT_FOUND"
        );
      }
      // Placeholder: Add logic to update user status if needed
      return result.users[0];
    } catch (error) {
      logger.error("Error changing user status", {
        dto,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to change user status",
            HttpStatus.INTERNAL_SERVER,
            "error",
            "USER_STATUS_CHANGE_ERROR"
          );
    }
  }
}
