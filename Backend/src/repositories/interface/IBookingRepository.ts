import { EBooking } from "../../entities/bookingEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface IBookingRepository extends IBaseRepository<EBooking> {
  // create(data: any): Promise<any>;
  // findById(id: string): Promise<any | null>;
  findBySessionId(sessionId: string): Promise<any | null>;
}
