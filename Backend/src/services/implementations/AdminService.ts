import { injectable, inject } from "inversify";
import { TYPES } from "../../inversify/types";
import { IAdminService } from "../interface/IAdminService";
import { IUserService } from "../interface/IUserService";
import { IBookingService } from "../interface/IBookingService";
import { IPaymentService } from "../interface/IPaymentService";
import { IMentorService } from "../interface/IMentorService";
import {
  GetAllUsersResponseDTO,
  GetUserDataResponseDTO,
  MentorStatusUpdateDTO,
  UserStatusUpdateDTO,
  FetchBookingsQueryDto,
  FetchPaymentsQueryDto,
  TransferToMentorDto,
  DashboardDataResponseDTO,
} from "../../dtos/adminDTO";
import { EUsers } from "../../entities/userEntity";
import { EMentor } from "../../entities/mentorEntity";
import { EMentee } from "../../entities/menteeEntity";
import { sendMail } from "../../utils/emailService";
import AppError from "../../errors/appError";
import { HttpStatus } from "../../constants/HttpStatus";
import { logger } from "../../utils/logger";

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject(TYPES.IUserService) private userService: IUserService,
    @inject(TYPES.IMentorService) private mentorService: IMentorService,
    @inject(TYPES.IBookingService) private bookingService: IBookingService,
    @inject(TYPES.IPaymentService) private paymentService: IPaymentService
  ) {}

  async validateSession(): Promise<void> {
    // Implement session validation logic (e.g., check JWT, session token)
    logger.info("Session validation performed");
    // Throw AppError if validation fails
  }

  async fetchDashboardDatas(): Promise<DashboardDataResponseDTO> {
    logger.info("Fetching dashboard data");

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // Fetch users
    const userQuery = { page: 1, limit: 1000 };
    const usersData = await this.fetchAllUsers(userQuery);

    // Fetch bookings
    const bookingQuery: FetchBookingsQueryDto = { page: 1, limit: 1000 };
    const bookingsData = await this.bookingService.getAllBookings(
      bookingQuery.page,
      bookingQuery.limit,
      bookingQuery.searchQuery,
      bookingQuery.service,
      bookingQuery.status
    );

    // Fetch payments
    const paymentQuery: FetchPaymentsQueryDto = { page: 1, limit: 1000 };
    const paymentsData = await this.paymentService.getAllPayments(
      paymentQuery.page,
      paymentQuery.limit,
      paymentQuery.searchQuery,
      paymentQuery.status
    );

    // Process bookings for monthly and yearly data
    const monthlyByService: { [key: string]: number[] } = {};
    const serviceSet = new Set<string>();
    const yearlyMap: { [key: number]: number } = {};

    bookingsData.bookings.forEach((booking: any) => {
      const date = new Date(booking.createdAt);
      if (date.getFullYear() === currentYear) {
        const month = date.getMonth();
        const service = booking.serviceId?.title || "Unknown";
        if (!monthlyByService[service]) {
          monthlyByService[service] = Array(12).fill(0);
        }
        monthlyByService[service][month] += 1;
      }
      serviceSet.add(booking.serviceId?.title || "Unknown");
      const year = date.getFullYear();
      yearlyMap[year] = (yearlyMap[year] || 0) + 1;
    });

    const yearlyBookings = Object.entries(yearlyMap)
      .map(([year, count]) => ({ year: parseInt(year), count }))
      .sort((a, b) => a.year - b.year);

    // Calculate monthly earnings
    const monthlyEarnings = paymentsData.payments.reduce(
      (sum: number, payment: any) => {
        const paymentDate = new Date(payment.createdAt);
        if (
          paymentDate.getFullYear() === currentYear &&
          paymentDate.getMonth() === currentMonth
        ) {
          return sum + (payment.amount || 0);
        }
        return sum;
      },
      0
    );

    return {
      users: {
        totalMentors: usersData.totalMentors,
        totalMentees: usersData.totalMentees,
        totalBoth: usersData.totalBoth,
        approvalPending: usersData.approvalPending,
      },
      bookings: {
        total: bookingsData.total,
        monthlyByService,
        yearlyBookings,
        totalServices: serviceSet.size,
      },
      payments: {
        monthlyEarnings,
        total: paymentsData.total,
      },
    };
  }

  async fetchAllUsers(
    dto: GetAllUsersRequestDTO
  ): Promise<GetAllUsersResponseDTO> {
    const { page, limit, role, status, searchQuery } = dto;
    const query: any = {};
    if (role) query.role = role;
    if (status) query.isBlocked = status === "blocked";
    if (searchQuery) {
      query.$or = [
        { firstName: { $regex: searchQuery, $options: "i" } },
        { lastName: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userService.findMany(query, page, limit),
      this.userService.countDocuments(query),
    ]);

    const totalMentors = await this.userService.countMentors(role, searchQuery);
    const totalMentees = await this.userService.countDocuments({
      role: "mentee",
    });
    const totalBoth = await this.userService.countDocuments({
      role: { $all: ["mentor", "mentee"] },
    });
    const approvalPending = await this.mentorService.countDocuments({
      isApproved: "Pending",
    });

    return {
      users: users as EUsers[],
      total,
      totalMentors,
      totalMentees,
      totalBoth,
      approvalPending,
    };
  }

  async getUserDetails(id: string): Promise<GetUserDataResponseDTO | null> {
    const user = await this.userService.findById(id, "user");
    if (!user) return null;

    const menteeData = user.menteeId
      ? await this.userService.findById(user.menteeId.toString(), "mentee")
      : null;
    const mentorData = user.mentorId
      ? await this.mentorService.getMentor(user.mentorId.toString())
      : null;
    const bookingData = user.menteeId
      ? await this.bookingService.findByMenteeSimple(user.menteeId.toString())
      : [];

    return {
      user,
      menteeData,
      mentorData,
      bookingData,
      serviceData: [], // Add service query if needed
    };
  }

  async mentorStatusChange(
    dto: MentorStatusUpdateDTO
  ): Promise<{ mentorData: EMentor }> {
    const { id, status, reason } = dto;

    const mentorData = await this.mentorService.updateField(
      id,
      "isApproved",
      status,
      reason
    );
    if (!mentorData) {
      throw new AppError("Mentor not found", HttpStatus.NOT_FOUND);
    }

    const user = await this.userService.findById(
      mentorData._id.toString(),
      "user"
    );
    if (!user) {
      throw new AppError("Associated user not found", HttpStatus.NOT_FOUND);
    }

    const name = `${user.firstName} ${user.lastName}`.trim();
    let message: string;

    if (status === "Approved") {
      message = `Congratulations! Your mentor status has been approved. You can now start mentoring on Mentor One.`;
      if (user._id) {
        await this.userService.update(
          user._id.toString(),
          {
            mentorActivated: true,
          },
          "user"
        );
      } else {
        throw new AppError(
          "User ID is missing",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    } else if (status === "Rejected") {
      message = `We regret to inform you that your mentor status has been rejected. ${
        reason
          ? `Reason: ${reason}`
          : "Please contact support for more details."
      }`;
      if (user._id) {
        await this.userService.update(
          user._id.toString(),
          {
            mentorActivated: false,
            refreshToken: [],
          },
          "user"
        );
      } else {
        throw new AppError(
          "User ID is missing",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    } else {
      message = `Your mentor status is now ${status}. ${
        reason
          ? `Reason: ${reason}`
          : "Please contact support for more details."
      }`;
    }

    if (user.email && name && message) {
      await sendMail(user.email, message, name, "Mentor Status Update");
    } else {
      logger.error("Email not sent: Missing user.email, name, or message", {
        email: user.email,
        name,
        message,
      });
    }

    return { mentorData };
  }

  async userStatusChange(
    dto: UserStatusUpdateDTO
  ): Promise<{ userData: EUsers }> {
    const { id, isBlocked } = dto;
    const userData = await this.userService.update(id, { isBlocked }, "user");
    if (!userData) {
      throw new AppError("User not found", HttpStatus.NOT_FOUND);
    }

    const name = `${userData.firstName} ${userData.lastName}`.trim();
    const message = isBlocked
      ? "Your account has been blocked. Please contact support for more details."
      : "Your account has been unblocked. You can now access Mentor One.";

    if (userData.email && name && message) {
      await sendMail(userData.email, message, name, "User Status Update");
    } else {
      logger.error("Email not sent: Missing user.email, name, or message", {
        email: userData.email,
        name,
        message,
      });
    }

    return { userData };
  }

  async getAllBookings(
    query: FetchBookingsQueryDto
  ): Promise<{ bookings: any[]; total: number }> {
    return await this.bookingService.getAllBookings(
      query.page,
      query.limit,
      query.searchQuery,
      query.service,
      query.status
    );
  }

  async getAllPayments(
    query: FetchPaymentsQueryDto
  ): Promise<{ payments: any[]; total: number }> {
    return await this.paymentService.getAllPayments(
      query.page,
      query.limit,
      query.searchQuery,
      query.status
    );
  }

  async transferToMentor(dto: TransferToMentorDto): Promise<any> {
    return await this.paymentService.transferToMentor(
      dto.paymentId,
      dto.mentorId,
      dto.amount
    );
  }
}
