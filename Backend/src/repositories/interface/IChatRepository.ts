import { EChat } from "../../entities/chatEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface IChatRepository extends IBaseRepository<EChat> {
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
