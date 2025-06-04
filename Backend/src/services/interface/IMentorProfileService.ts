import { EService } from "../../entities/serviceEntity";
import { EUsers } from "../../entities/userEntity";
import { ESchedule } from "../../entities/scheduleEntity";
import { EBlockedDate } from "../../entities/blockedEntity";
import { EPriorityDM } from "../../entities/priorityDMEntity";

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
export interface IMentorProfileService {
  welcomeData(formData: object, id: string): Promise<EUsers | null>;
  profileDatas(userId: string): Promise<EUsers | null>;
  createService(formData: Record<string, any>): Promise<EService | null>;
  // getAllServices(userId: string): Promise<EService[]>;
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
  // getAllPriorityDMsByMentor(mentorId: string): Promise<EPriorityDM[]>;
  getAllPriorityDMsByMentor(
    mentorId: string,
    page: number,
    limit: number,
    searchQuery: string,
    status?: "pending" | "replied",
    sort?: "asc" | "desc"
  ): Promise<{ priorityDMs: EPriorityDM[]; total: number }>;
}
