import { EPriorityDM } from "../../entities/priorityDMEntity";

export interface IPriorityDMRepository {
  create(data: Partial<EPriorityDM>): Promise<EPriorityDM>;
  findById(id: string): Promise<EPriorityDM | null>;
  findByServiceAndMentee(
    bookingId: string,
    menteeId: string
  ): Promise<EPriorityDM[]>;
  findByServiceAndMentor(
    serviceId: string,
    mentorId: string
  ): Promise<EPriorityDM[]>;
  // findByMentor(mentorId: string): Promise<EPriorityDM[]>;
  findByMentor(
    mentorId: string,
    page: number,
    limit: number,
    searchQuery: string,
    status?: "pending" | "replied",
    sort?: "asc" | "desc"
  ): Promise<{ priorityDMs: EPriorityDM[]; total: number }>;
  update(id: string, data: Partial<EPriorityDM>): Promise<EPriorityDM | null>;
}
