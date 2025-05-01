// import { inBookingService, BookingParams } from "../interface/inBookingService";
// import BookingRepository from "../../repositories/bookingRepository";
// import { ApiError } from "../../middlewares/errorHandler";
// import Schedule from "../../models/ScheduleModel";

// export default class BookingService implements inBookingService {
//   private bookingRepository: BookingRepository;

//   constructor() {
//     this.bookingRepository = new BookingRepository();
//   }

//   async createBooking(params: BookingParams): Promise<any> {
//     const {
//       serviceId,
//       mentorId,
//       menteeId,
//       bookingDate,
//       startTime,
//       endTime,
//       day,
//       slotIndex,
//     } = params;

//     const schedule = await Schedule.findOne({
//       mentorId,
//       day,
//       "slots.index": slotIndex,
//       "slots.isAvailable": true,
//     });
//     if (!schedule) {
//       throw new ApiError(
//         400,
//         "Selected slot is not available",
//         "Invalid schedule"
//       );
//     }

//     schedule.slots[slotIndex].isAvailable = false;
//     await schedule.save();

//     const booking = await this.bookingRepository.create({
//       scheduleId: schedule._id,
//       serviceId,
//       mentorId,
//       menteeId,
//       day,
//       slotIndex,
//       startTime,
//       endTime,
//       bookingDate: new Date(bookingDate),
//       status: "confirmed",
//     });

//     return booking;
//   }

//   async getBookingsByMentee(menteeId: string): Promise<any[]> {
//     return this.bookingRepository.findByMentee(menteeId);
//   }

//   async getBookingsByMentor(mentorId: string): Promise<any[]> {
//     return this.bookingRepository.findByMentor(mentorId);
//   }

//   async cancelBooking(bookingId: string): Promise<void> {
//     const booking = await this.bookingRepository.findById(bookingId);
//     if (!booking) {
//       throw new ApiError(404, "Booking not found", "Invalid booking ID");
//     }

//     await this.bookingRepository.update(bookingId, { status: "cancelled" });

//     const schedule = await Schedule.findById(booking.scheduleId);
//     if (schedule) {
//       schedule.slots[booking.slotIndex].isAvailable = true;
//       await schedule.save();
//     }
//   }
// }
import { inBookingService, BookingParams } from "../interface/inBookingService";
import BookingRepository from "../../repositories/implementations/imBookingRepository";
import PaymentRepository from "../../repositories/implementations/imPaymentRepository";
import { ApiError } from "../../middlewares/errorHandler";

interface SaveBookingAndPaymentParams {
  sessionId: string;
  serviceId: string;
  mentorId: string;
  menteeId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  day: string;
  slotIndex: number;
  amount: number;
}

export default class BookingService implements inBookingService {
  private bookingRepository: BookingRepository;
  private paymentRepository: PaymentRepository;

  constructor() {
    this.bookingRepository = new BookingRepository();
    this.paymentRepository = new PaymentRepository();
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

    const booking = await this.bookingRepository.create({
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

  async saveBookingAndPayment(
    params: SaveBookingAndPaymentParams
  ): Promise<{ booking: any; payment: any }> {
    const {
      sessionId,
      serviceId,
      mentorId,
      menteeId,
      bookingDate,
      startTime,
      endTime,
      day,
      slotIndex,
      amount,
    } = params;

    console.log("saveBookingAndPayment params:", params);

    try {
      // Create booking
      const booking = await this.createBooking({
        serviceId,
        mentorId,
        menteeId,
        bookingDate,
        startTime,
        endTime,
        day,
        slotIndex,
      });

      // Create payment
      const payment = await this.paymentRepository.create({
        bookingId: booking._id,
        menteeId,
        amount,
        status: "completed",
        transactionId: sessionId,
      });

      console.log("Saved booking:", booking._id);
      console.log("Saved payment:", payment._id);

      return { booking, payment };
    } catch (error: any) {
      console.error("Detailed error in saveBookingAndPayment:", error);
      throw new ApiError(
        500,
        error.message || "Failed to save booking and payment",
        "Error during booking and payment creation"
      );
    }
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
  }

  async verifyBookingBySessionId(sessionId: string): Promise<any> {
    const booking = await this.bookingRepository.findBySessionId(sessionId);
    if (!booking) {
      throw new ApiError(404, "Booking not found", "Booking not created");
    }
    return booking;
  }
}
