import { EUsers } from "../../entities/userEntity";
import { EPriorityDM } from "../../entities/priorityDMEntity";
export interface IMenteeProfileService {
  welcomeData(formData: object, id: string): Promise<EUsers | null>;
  deleteAccount(id: string): Promise<boolean>;
  userProfielData(
    id: string
  ): Promise<{ user: Omit<EUsers, "password">[] } | null>;
  getAllMentors(
    page?: number,
    limit?: number,
    role?: string,
    searchQuery?: string
  ): Promise<{ mentors: EUsers[]; total: number }>;
  getMentorById(mentorId: string): Promise<EUsers>;
  createPriorityDM(data: {
    serviceId: string;
    bookingId?: string;
    menteeId: string;
    content: string;
    pdfFiles: Array<{ fileName: string; s3Key: string; url: string }>;
  }): Promise<EPriorityDM>;
  getPriorityDMs(bookingId: string, menteeId: string): Promise<EPriorityDM[]>;
}
