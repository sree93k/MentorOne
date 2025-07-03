import { QueryOptions } from "mongoose";
import { EBooking } from "../../entities/bookingEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface IBookingRepository extends IBaseRepository<EBooking> {
  findByMenteeSimple(menteeId: string): Promise<EBooking[]>;
  findAll(query?: any, options?: QueryOptions): Promise<EBooking[]>;
  findAllBookings(
    page: number,
    limit: number,
    searchQuery?: string,
    service?: string,
    status?: string
  ): Promise<EBooking[]>;
  count(
    searchQuery?: string,
    service?: string,
    status?: string
  ): Promise<number>;
}
