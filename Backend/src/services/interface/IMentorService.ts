// import { EService } from "../../entities/serviceEntity";
// import { EUsers } from "../../entities/userEntity";
// import { ESchedule } from "../../entities/scheduleEntity";
// import { EBlockedDate } from "../../entities/blockedEntity";
// import { EPriorityDM } from "../../entities/priorityDMEntity";
// import { EMentor } from "../../entities/mentorEntity";
// interface GetAllServicesParams {
//   page: number;
//   limit: number;
//   search: string;
//   type?: string;
// }

// interface GetAllServicesResponse {
//   services: EService[];
//   totalPages: number;
//   currentPage: number;
// }

// interface UpdateMentorFieldDTO {
//   field: string;
//   status: string;
//   reason?: string;
// }

// interface UpdateMentorDTO {
//   isApproved?: string;
//   approvalReason?: string;
//   bio?: string;
//   expertise?: string[];
//   experience?: number;
// }

// export interface IMentorService {
//   welcomeData(formData: object, id: string): Promise<EUsers | null>;
//   profileDatas(userId: string): Promise<EUsers | null>;
//   createService(formData: Record<string, any>): Promise<EService | null>;
//   // getAllServices(userId: string): Promise<EService[]>;
//   getAllServices(
//     userId: string,
//     params: GetAllServicesParams
//   ): Promise<GetAllServicesResponse>;
//   getServiceById(serviceId: string): Promise<EService | null>;
//   updateService(
//     serviceId: string,
//     formData: Record<string, any>
//   ): Promise<EService | null>;
//   getAllMentors(serviceType?: string): Promise<EUsers[]>;
//   getMentorById(mentorId: string): Promise<EUsers>;

//   isApprovalChecking(
//     userId: string
//   ): Promise<{ isApproved: string | null; approvalReason: string | null }>;
//   findMentorById(mentorId: string): Promise<EMentor | null>;
//   getMentorSchedule(serviceId: string): Promise<ESchedule[]>;
//   getMentorBlockedDates(mentorId: string): Promise<EBlockedDate[]>;
//   assignScheduleToService(
//     serviceId: string,
//     scheduleId: string
//   ): Promise<EService | null>;
//   replyToPriorityDM(
//     priorityDMId: string,
//     mentorId: string,
//     data: {
//       content: string;
//       pdfFiles: Array<{ fileName: string; s3Key: string; url: string }>;
//     }
//   ): Promise<EPriorityDM | null>;
//   getPriorityDMs(serviceId: string, mentorId: string): Promise<EPriorityDM[]>;
//   // getAllPriorityDMsByMentor(mentorId: string): Promise<EPriorityDM[]>;
//   getAllPriorityDMsByMentor(
//     mentorId: string,
//     page: number,
//     limit: number,
//     searchQuery: string,
//     status?: "pending" | "replied",
//     sort?: "asc" | "desc"
//   ): Promise<{ priorityDMs: EPriorityDM[]; total: number }>;
//   updateTopTestimonials(
//     mentorId: string,
//     testimonialIds: string[]
//   ): Promise<EMentor>;
//   updateMentorField(
//     id: string,
//     data: UpdateMentorFieldDTO
//   ): Promise<EMentor | null>;
//   updateMentor(id: string, data: UpdateMentorDTO): Promise<EMentor | null>;
// }
import { EService } from "../../entities/serviceEntity";
import { EUsers } from "../../entities/userEntity";
import { ESchedule } from "../../entities/scheduleEntity";
import { EBlockedDate } from "../../entities/blockedEntity";
import { EPriorityDM } from "../../entities/priorityDMEntity";
import { EMentor } from "../../entities/mentorEntity";

import { UpdateMentorDTO, UpdateMentorFieldDTO } from "../../dtos/mentorDTO";

interface GetAllServicesParams {
  page: number;
  limit: number;
  search: string;
  type?: string;
}

interface GetAllServicesResponse {
  services: EService[];
  totalPages: number;
  currentPage: number;
}

export interface IMentorService {
  welcomeData(formData: object, id: string): Promise<EUsers | null>;
  profileDatas(userId: string): Promise<EUsers | null>;
  createService(formData: Record<string, any>): Promise<EService | null>;

  getAllServices(
    userId: string,
    params: GetAllServicesParams
  ): Promise<GetAllServicesResponse>;

  getServiceById(serviceId: string): Promise<EService | null>;

  updateService(
    serviceId: string,
    formData: Record<string, any>
  ): Promise<EService | null>;

  getAllMentors(serviceType?: string): Promise<EUsers[]>;
  getMentorById(mentorId: string): Promise<EUsers>;

  isApprovalChecking(
    userId: string
  ): Promise<{ isApproved: string | null; approvalReason: string | null }>;

  findMentorById(mentorId: string): Promise<EMentor | null>;
  getMentorSchedule(serviceId: string): Promise<ESchedule[]>;
  getMentorBlockedDates(mentorId: string): Promise<EBlockedDate[]>;

  assignScheduleToService(
    serviceId: string,
    scheduleId: string
  ): Promise<EService | null>;

  replyToPriorityDM(
    priorityDMId: string,
    mentorId: string,
    data: {
      content: string;
      pdfFiles: Array<{ fileName: string; s3Key: string; url: string }>;
    }
  ): Promise<EPriorityDM | null>;

  getPriorityDMs(serviceId: string, mentorId: string): Promise<EPriorityDM[]>;

  getAllPriorityDMsByMentor(
    mentorId: string,
    page: number,
    limit: number,
    searchQuery: string,
    status?: "pending" | "replied",
    sort?: "asc" | "desc"
  ): Promise<{ priorityDMs: EPriorityDM[]; total: number }>;

  updateTopTestimonials(
    mentorId: string,
    testimonialIds: string[]
  ): Promise<EMentor>;

  // Updated method signatures with proper types
  updateMentorField(
    id: string,
    data: UpdateMentorFieldDTO
  ): Promise<EMentor | null>;
  updateMentor(id: string, data: UpdateMentorDTO): Promise<EMentor | null>;
  // updateMentorProfile(
  //   id: string,
  //   data: UpdateMentorProfileDTO
  // ): Promise<EMentor | null>;

  createMentor(data: EMentor): Promise<EMentor | null>;
}
