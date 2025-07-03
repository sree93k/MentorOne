import { EService } from "../../entities/serviceEntity";
import { EUsers } from "../../entities/userEntity";
import { ESchedule } from "../../entities/scheduleEntity";
import { EBlockedDate } from "../../entities/blockedEntity";
import { EPriorityDM } from "../../entities/priorityDMEntity";
import { EMentor } from "../../entities/mentorEntity";
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
  countDocuments(isApproved: string): Promise<number | null>;
  getMentor(mentorId: string): Promise<EMentor | null>;
}
