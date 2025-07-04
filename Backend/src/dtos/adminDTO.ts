import { EUsers } from "../entities/userEntity";
import { EMentee } from "../entities/menteeEntity";
import { EMentor } from "../entities/mentorEntity";

export interface AdminLoginDTO {
  adminEmail: string;
  adminPassword: string;
}

export interface FetchUsersQueryDto {
  page: number;
  limit: number;
  role?: string;
  status?: string;
  searchQuery?: string;
}

export interface GetAllUsersRequestDTO {
  page: number;
  limit: number;
  role?: string;
  status?: string;
  searchQuery?: string;
}

export interface GetAllUsersResponseDTO {
  users: EUsers[];
  total: number;
  totalMentors: number;
  totalMentees: number;
  totalBoth: number;
  approvalPending: number;
}

export interface GetUserDataResponseDTO {
  user: EUsers;
  menteeData: EMentee | null;
  mentorData: EMentor | null;
  bookingData: any[] | null;
  serviceData: any[] | null;
}

export interface MentorStatusUpdateDTO {
  id: string;
  status: string;
  reason?: string;
}

export interface UserStatusUpdateDTO {
  id: string;
  isBlocked: boolean;
}

export interface FetchBookingsQueryDto {
  page: number;
  limit: number;
  searchQuery?: string;
  service?: string;
  status?: string;
}

export interface FetchPaymentsQueryDto {
  page: number;
  limit: number;
  searchQuery?: string;
  status?: string;
}

export interface TransferToMentorDto {
  paymentId: string;
  mentorId: string;
  amount: number;
}

export interface DashboardDataResponseDTO {
  users: {
    totalMentors: number;
    totalMentees: number;
    totalBoth: number;
    approvalPending: number;
  };
  bookings: {
    total: number;
    monthlyByService: { [key: string]: number[] };
    yearlyBookings: { year: number; count: number }[];
    totalServices: number;
  };
  payments: {
    monthlyEarnings: number;
    total: number;
  };
}
