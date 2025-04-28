import { inBookingService, BookingParams } from "../interface/inBookingService";
import BookingRepository from "../../repositories/bookingRepository";
import { ApiError } from "../../middlewares/errorHandler";
import Schedule from "../../models/ScheduleModel";

export default class BookingService implements inBookingService {
  private bookingRepository: BookingRepository;

  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  async createBooking(params: BookingParams): Promise<any> {
    const {
      serviceId,
      mentorId,
      menteeId,
      bookingDate,
      startTime,
      endTime,
      day,
      slotIndex,
    } = params;

    const schedule = await Schedule.findOne({
      mentorId,
      day,
      "slots.index": slotIndex,
      "slots.isAvailable": true,
    });
    if (!schedule) {
      throw new ApiError(
        400,
        "Selected slot is not available",
        "Invalid schedule"
      );
    }

    schedule.slots[slotIndex].isAvailable = false;
    await schedule.save();

    const booking = await this.bookingRepository.create({
      scheduleId: schedule._id,
      serviceId,
      mentorId,
      menteeId,
      day,
      slotIndex,
      startTime,
      endTime,
      bookingDate: new Date(bookingDate),
      status: "confirmed",
    });

    return booking;
  }

  async getBookingsByMentee(menteeId: string): Promise<any[]> {
    return this.bookingRepository.findByMentee(menteeId);
  }

  async getBookingsByMentor(mentorId: string): Promise<any[]> {
    return this.bookingRepository.findByMentor(mentorId);
  }

  async cancelBooking(bookingId: string): Promise<void> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new ApiError(404, "Booking not found", "Invalid booking ID");
    }

    await this.bookingRepository.update(bookingId, { status: "cancelled" });

    const schedule = await Schedule.findById(booking.scheduleId);
    if (schedule) {
      schedule.slots[booking.slotIndex].isAvailable = true;
      await schedule.save();
    }
  }
}
