import { IBookingService, BookingParams } from "../interface/IBookingService";
import BookingRepository from "../../repositories/implementations/BookingRepository";
import PaymentRepository from "../../repositories/implementations/PaymentRepository";
import ChatRepository from "../../repositories/implementations/ChatRepository";
import ServiceRepository from "../../repositories/implementations/ServiceRepository";
import ChatService from "./ChatService";
import { ApiError } from "../../middlewares/errorHandler";
import { EService } from "../../entities/serviceEntity";

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

interface BookServiceParams {
  serviceId: string;
  mentorId: string;
  menteeId: string;
  sessionId: string;
}

export default class BookingService implements IBookingService {
  private bookingRepository: BookingRepository;
  private paymentRepository: PaymentRepository;
  private chatRepository: ChatRepository;
  private serviceRepository: ServiceRepository;
  private chatService: ChatService;

  constructor() {
    this.bookingRepository = new BookingRepository();
    this.paymentRepository = new PaymentRepository();
    this.chatRepository = new ChatRepository();
    this.serviceRepository = new ServiceRepository();
    this.chatService = new ChatService();
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
  ): Promise<{ booking: any; payment: any; chat?: any }> {
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
      // Fetch the service to check its type
      const service = await this.serviceRepository.getServiceById(serviceId);
      if (!service) {
        throw new ApiError(404, "Service not found", "Invalid service ID");
      }
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

      // Create chat for "chat" type services
      let chat;
      if (service.oneToOneType === "chat") {
        chat = await this.chatService.createChat(
          booking._id.toString(),
          menteeId,
          mentorId
        );
        console.log("Created chat:", chat._id);
      }

      console.log("Saved booking:", booking._id);
      console.log("Saved payment:", payment._id);

      return { booking, payment, chat };
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
    console.log("booking service getBookingsByMentee step 1", menteeId);

    const response = this.bookingRepository.findByMentee(menteeId);
    console.log("booking service getBookingsByMentee step 2", response);
    return response;
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

  async getAllVideoTutorials(): Promise<any[]> {
    try {
      console.log("bookingservice getAllVideoTutorials step 1");
      const tutorials = await this.serviceRepository.getAllVideoTutorials();
      console.log("bookingservice getAllVideoTutorials step 2", tutorials);
      return tutorials;
    } catch (error: any) {
      console.log("bookingservice getAllVideoTutorials step errror", error);
      console.error("Error fetching video tutorials:", error);
      throw new ApiError(
        500,
        error.message || "Failed to fetch video tutorials"
      );
    }
  }

  async getTutorialById(tutorialId: string): Promise<any> {
    try {
      console.log("bookingservice getTutorialById step 1", tutorialId);
      const tutorial = await this.serviceRepository.getTutorialById(tutorialId);
      console.log("bookingservice getTutorialById step 2", tutorial);
      if (!tutorial) {
        throw new ApiError(404, "Tutorial not found");
      }
      return tutorial;
    } catch (error: any) {
      console.error("Error fetching tutorial by ID:", error);
      throw new ApiError(
        500,
        error.message || "Failed to fetch tutorial details"
      );
    }
  }

  async checkBookingStatus(
    menteeId: string,
    serviceId: string
  ): Promise<boolean> {
    try {
      console.log(
        "bookingservice checkBookingStatus step 1",
        menteeId,
        serviceId
      );
      const booking = await this.bookingRepository.findByMenteeAndService(
        menteeId,
        serviceId
      );
      console.log("bookingservice checkBookingStatus step 2", booking);
      return !!booking && booking.status === "confirmed";
    } catch (error: any) {
      console.error("Error checking booking status:", error);
      throw new ApiError(
        500,
        error.message || "Failed to check booking status"
      );
    }
  }

  async bookService(params: BookServiceParams): Promise<any> {
    try {
      console.log("bookingservice bookService step 1", params);
      const { serviceId, mentorId, menteeId, sessionId } = params;
      const service = await this.serviceRepository.getServiceById(serviceId);
      if (!service) {
        throw new ApiError(404, "Service not found");
      }
      const booking = await this.bookingRepository.create({
        serviceId,
        mentorId,
        menteeId,
        status: "confirmed",
      });
      const payment = await this.paymentRepository.create({
        bookingId: booking._id,
        menteeId,
        amount: service.amount,
        status: "completed",
        transactionId: sessionId,
      });
      console.log("bookingservice bookService step 2", booking, payment);
      return { booking, payment };
    } catch (error: any) {
      console.error("Error booking service:", error);
      throw new ApiError(500, error.message || "Failed to book service");
    }
  }
  async getServiceById(serviceId: string): Promise<EService | null> {
    try {
      console.log("bookingservice getServiceById step 1", serviceId);
      const service = await this.serviceRepository.getServiceById(serviceId);
      console.log("bookingservice getServiceById step 2", service);
      return service;
    } catch (error: any) {
      console.error("Error fetching service by ID:", error);
      throw new ApiError(500, error.message || "Failed to fetch service");
    }
  }
}
