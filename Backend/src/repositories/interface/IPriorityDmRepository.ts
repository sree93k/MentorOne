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
  findByMentor(mentorId: string): Promise<EPriorityDM[]>;
  update(id: string, data: Partial<EPriorityDM>): Promise<EPriorityDM | null>;
}
