import {
  GetAllUsersRequestDTO,
  GetAllUsersResponseDTO,
  GetUserDataResponseDTO,
  MentorStatusUpdateDTO,
  UserStatusUpdateDTO,
  FetchBookingsQueryDto,
  FetchPaymentsQueryDto,
  TransferToMentorDto,
  DashboardDataResponseDTO,
} from "../../dtos/adminDTO";

export interface IAdminService {
  validateSession(): Promise<void>;
  fetchDashboardDatas(): Promise<DashboardDataResponseDTO>;
  fetchAllUsers(dto: GetAllUsersRequestDTO): Promise<GetAllUsersResponseDTO>;
  getUserDetails(id: string): Promise<GetUserDataResponseDTO | null>;
  mentorStatusChange(dto: MentorStatusUpdateDTO): Promise<{ mentorData: any }>;
  userStatusChange(dto: UserStatusUpdateDTO): Promise<{ userData: any }>;
  getAllBookings(
    query: FetchBookingsQueryDto
  ): Promise<{ bookings: any[]; total: number }>;
  getAllPayments(
    query: FetchPaymentsQueryDto
  ): Promise<{ payments: any[]; total: number }>;
  transferToMentor(dto: TransferToMentorDto): Promise<any>;
}
