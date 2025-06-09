import { EChat } from "../../entities/chatEntity";

export interface IChatRepository {
  create(data: Partial<EChat>): Promise<EChat>;
  findById(id: string): Promise<EChat | null>;
  findByIdAndUpdate(id: string, update: Partial<EChat>): Promise<EChat | null>;
  findByUserAndRole(
    userId: string,
    role: "mentee" | "mentor"
  ): Promise<EChat[]>;
  findByBookingId(bookingId: string): Promise<EChat | null>;
  updateByBookingId(
    bookingId: string,
    isActive: boolean
  ): Promise<EChat | null>;
  findByUsersAndRoles(
    menteeId: string,
    mentorId: string
  ): Promise<EChat | null>;
  updateByUsersAndRoles(
    menteeId: string,
    mentorId: string,
    update: { isActive: boolean; bookingId: string }
  ): Promise<EChat | null>;
}
