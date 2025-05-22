export interface IBookingRepository {
  create(data: any): Promise<any>;
  findById(id: string): Promise<any | null>;
  findBySessionId(sessionId: string): Promise<any | null>;
  findByMentee(menteeId: string): Promise<any[]>;
  findByMentor(mentorId: string): Promise<any[]>;
  update(id: string, data: any): Promise<any | null>;
  findByMenteeAndService(
    menteeId: string,
    serviceId: string
  ): Promise<any | null>;
}
