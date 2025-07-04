// // import {
// //   FetchUsersQueryDto,
// //   MentorStatusUpdateDTO,
// //   UserStatusUpdateDTO,
// //   FetchBookingsQueryDto,
// //   FetchPaymentsQueryDto,
// //   TransferToMentorDto,
// // } from "../../dtos/adminDTO";

// // export interface IAdminService {
// //   validateSession(userId: string): Promise<boolean>;
// //   fetchAllUsers(
// //     query: FetchUsersQueryDto
// //   ): Promise<{ data: any[]; total: number }>;
// //   getUserDetails(userId: string): Promise<any | null>;
// //   getAllBookings(
// //     query: FetchBookingsQueryDto
// //   ): Promise<{ bookings: any[]; total: number }>;
// //   getAllPayments(
// //     query: FetchPaymentsQueryDto
// //   ): Promise<{ payments: any[]; total: number }>;
// //   transferToMentor(dto: TransferToMentorDto): Promise<any>;
// //   mentorStatusChange(dto: MentorStatusUpdateDTO): Promise<any>;
// //   userStatusChange(dto: UserStatusUpdateDTO): Promise<any>;
// // }

// import { EUsers } from "../../entities/userEntity";
// import { EBooking } from "../../entities/bookingEntity";
// import { EPayment } from "../../entities/paymentEntity";
// import { EMentor } from "../../entities/mentorEntity";
// import {
//   FetchUsersQueryDto,
//   MentorStatusUpdateDTO,
//   UserStatusUpdateDTO,
//   FetchBookingsQueryDto,
//   FetchPaymentsQueryDto,
//   TransferToMentorDto,
// } from "../../dtos/adminDTO";

// export interface IAdminService {
//   validateSession(userId: string): Promise<boolean>;
//   fetchAllUsers(
//     query: FetchUsersQueryDto
//   ): Promise<{ data: EUsers[]; total: number }>;
//   getUserDetails(userId: string): Promise<EUsers | null>;
//   getAllBookings(
//     query: FetchBookingsQueryDto
//   ): Promise<{ bookings: EBooking[]; total: number }>;
//   getAllPayments(
//     query: FetchPaymentsQueryDto
//   ): Promise<{ payments: EPayment[]; total: number }>;
//   transferToMentor(dto: TransferToMentorDto): Promise<EPayment>;
//   mentorStatusChange(dto: MentorStatusUpdateDTO): Promise<EMentor>;
//   userStatusChange(dto: UserStatusUpdateDTO): Promise<EUsers>;
// }
import { UserResponseDto } from "../../dtos/userDTO";
import {
  FetchUsersQueryDto,
  FetchBookingsQueryDto,
  FetchPaymentsQueryDto,
  TransferToMentorDto,
  MentorStatusUpdateDTO,
  UserStatusUpdateDTO,
} from "../../dtos/adminDTO";

export interface IAdminService {
  validateSession(userId: string): Promise<boolean>;
  fetchAllUsers(
    query: FetchUsersQueryDto
  ): Promise<{ users: UserResponseDto[]; total: number }>;
  getUserDetails(userId: string): Promise<UserResponseDto | null>;
  getAllBookings(
    query: FetchBookingsQueryDto
  ): Promise<{ bookings: any[]; total: number }>;
  getAllPayments(
    query: FetchPaymentsQueryDto
  ): Promise<{ payments: any[]; total: number }>;
  transferToMentor(dto: TransferToMentorDto): Promise<any>;
  mentorStatusChange(dto: MentorStatusUpdateDTO): Promise<any>;
  userStatusChange(dto: UserStatusUpdateDTO): Promise<any>;
}
