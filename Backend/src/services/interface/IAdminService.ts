import { UserResponseDto } from "../../dtos/userDTO";
import {
  FetchUsersQueryDto,
  FetchBookingsQueryDto,
  FetchPaymentsQueryDto,
  TransferToMentorDto,
} from "../../dtos/adminDTO";
import { EBooking } from "../../entities/bookingEntity";
import { EPayment } from "../../entities/paymentEntity";
import { EService } from "../../entities/serviceEntity";

export interface IAdminService {
  validateSession(userId: string): Promise<boolean>;
  fetchDashboard(): Promise<{
    users: UserResponseDto[];
    bookings: EBooking[];
    payments: EPayment[];
    services: EService[];
  }>;
  fetchAllUsers(
    query: FetchUsersQueryDto
  ): Promise<{ users: UserResponseDto[]; total: number }>;
  getUserDetails(userId: string): Promise<UserResponseDto | null>;
  getAllBookings(
    query: FetchBookingsQueryDto
  ): Promise<{ bookings: EBooking[]; total: number }>;
  getAllPayments(
    query: FetchPaymentsQueryDto
  ): Promise<{ payments: EPayment[]; total: number }>;
  transferToMentor(dto: TransferToMentorDto): Promise<any>;
  mentorStatusChange(dto: {
    id: string;
    status: string;
  }): Promise<UserResponseDto>;
  userStatusChange(dto: {
    id: string;
    isBlocked: boolean;
  }): Promise<UserResponseDto>;
}
