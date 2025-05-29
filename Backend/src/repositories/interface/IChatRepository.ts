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
}
