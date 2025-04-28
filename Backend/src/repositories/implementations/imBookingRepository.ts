import Booking from "../../models/bookingModel";
import { ApiError } from "../../middlewares/errorHandler";

export default class BookingRepository {
  async create(data: any) {
    try {
      const booking = new Booking(data);
      return await booking.save();
    } catch (error: any) {
      throw new ApiError(500, "Failed to create booking", error.message);
    }
  }

  async findById(id: string) {
    try {
      return await Booking.findById(id);
    } catch (error: any) {
      throw new ApiError(500, "Failed to find booking", error.message);
    }
  }

  async findByMentee(menteeId: string) {
    try {
      return await Booking.find({ menteeId }).populate("serviceId mentorId");
    } catch (error: any) {
      throw new ApiError(500, "Failed to find bookings", error.message);
    }
  }

  async findByMentor(mentorId: string) {
    try {
      return await Booking.find({ mentorId }).populate("serviceId menteeId");
    } catch (error: any) {
      throw new ApiError(500, "Failed to find bookings", error.message);
    }
  }

  async update(id: string, data: any) {
    try {
      return await Booking.findByIdAndUpdate(id, data, { new: true });
    } catch (error: any) {
      throw new ApiError(500, "Failed to update booking", error.message);
    }
  }
}
