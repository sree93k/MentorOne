import { EUsers } from "../../entities/userEntity";
import { EPriorityDM } from "../../entities/priorityDMEntity";
import { EService } from "../../entities/serviceEntity";
import { ETestimonial } from "../../entities/testimonialEntity";
import { EMentee } from "../../entities/menteeEntiry";

interface DashboardData {
  topServices: EService[];
  topMentors: EUsers[];
  topTestimonials: ETestimonial[];
}

export interface IMenteeService {
  welcomeData(formData: object, id: string): Promise<EUsers | null>;
  deleteAccount(id: string): Promise<EUsers>;
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
  getDashboardData(): Promise<DashboardData>;
  findMenteeById(id: string): Promise<EMentee | null>;
  updateMentee(id: string, payload: Partial<EMentee>): Promise<EMentee | null>;
}
