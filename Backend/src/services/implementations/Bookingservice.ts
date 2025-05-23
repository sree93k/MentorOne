import { IBookingService, BookingParams } from "../interface/IBookingService";
import BookingRepository from "../../repositories/implementations/BookingRepository";
import PaymentRepository from "../../repositories/implementations/PaymentRepository";
import ChatRepository from "../../repositories/implementations/ChatRepository";
import ServiceRepository from "../../repositories/implementations/ServiceRepository";
import ChatService from "./ChatService";
import { ApiError } from "../../middlewares/errorHandler";
import { EService } from "../../entities/serviceEntity";
import UserRepository from "../../repositories/implementations/UserRepository";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { response } from "express";

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
  private userRepository: IUserRepository;

  constructor() {
    this.bookingRepository = new BookingRepository();
    this.paymentRepository = new PaymentRepository();
    this.chatRepository = new ChatRepository();
    this.serviceRepository = new ServiceRepository();
    this.chatService = new ChatService();
    this.userRepository = new UserRepository();
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

  // async getBookingsByMentee(
  //   menteeId: string,
  //   page: number = 1,
  //   limit: number = 12,
  //   searchQuery: string = ""
  // ): Promise<{ bookings: any[]; total: number }> {
  //   console.log("booking service getBookingsByMentee step 1", {
  //     menteeId,
  //     page,
  //     limit,
  //     searchQuery,
  //   });

  //   const skip = (page - 1) * limit;
  //   const query: any = { menteeId };

  //   if (searchQuery) {
  //     query.$or = [
  //       { "mentorId.firstName": { $regex: searchQuery, $options: "i" } },
  //       { "mentorId.lastName": { $regex: searchQuery, $options: "i" } },
  //       { "serviceId.title": { $regex: searchQuery, $options: "i" } },
  //     ];
  //   }

  //   try {
  //     const [bookings, total] = await Promise.all([
  //       this.bookingRepository.findByMentee(menteeId, skip, limit, query),
  //       this.bookingRepository.countByMentee(menteeId, query),
  //     ]);
  //     console.log("booking service getBookingsByMentee step 2", {
  //       bookings,
  //       total,
  //     });
  //     return { bookings, total };
  //   } catch (error: any) {
  //     console.log("booking service getBookingsByMentee step error", error);
  //     throw new ApiError(500, "Failed to fetch bookings");
  //   }
  // }
  async getBookingsByMentee(
    menteeId: string,
    page: number = 1,
    limit: number = 12,
    searchQuery: string = ""
  ): Promise<{ bookings: any[]; total: number }> {
    console.log("booking service getBookingsByMentee step 1", {
      menteeId,
      page,
      limit,
      searchQuery,
    });

    const skip = (page - 1) * limit;
    const query: any = { menteeId };

    if (searchQuery) {
      query.$or = [
        { "mentorId.firstName": { $regex: searchQuery, $options: "i" } },
        { "mentorId.lastName": { $regex: searchQuery, $options: "i" } },
        { "serviceId.title": { $regex: searchQuery, $options: "i" } },
      ];
    }

    try {
      const [bookings, total] = await Promise.all([
        this.bookingRepository.findByMentee(menteeId, skip, limit, query),
        this.bookingRepository.countByMentee(menteeId, query),
      ]);
      console.log("booking service getBookingsByMentee step 2", {
        bookings,
        total,
      });
      return { bookings, total };
    } catch (error: any) {
      console.log("booking service getBookingsByMentee step error", error);
      throw new ApiError(500, "Failed to fetch bookings");
    }
  }

  async getBookingsByMentor(
    mentorId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<any[]> {
    try {
      const skip = (page - 1) * limit;
      const [bookings, total] = await Promise.all([
        this.bookingRepository.findByMentor(mentorId, skip, limit),
        this.bookingRepository.countByMentor(mentorId),
      ]);
      return { bookings, total };
    } catch (error: any) {
      throw new ApiError(500, "Failed to fetch mentor bookings");
    }
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

  // async getAllBookings(
  //   page: number = 1,
  //   limit: number = 10,
  //   searchQuery: string = "",
  //   service: string = "",
  //   status: string = ""
  // ): Promise<{ bookings: any[]; total: number }> {
  //   try {
  //     console.log("booking service gettAllBookings >page", page);
  //     console.log("booking service gettAllBookings >limit", limit);
  //     console.log("booking service gettAllBookings >searchQuery", searchQuery);
  //     console.log("booking service gettAllBookings >service", service);
  //     console.log("booking service gettAllBookings >status", status);
  //     const skip = (page - 1) * limit;
  //     const query: any = {};

  //     if (searchQuery) {
  //       query.$or = [
  //         { "mentorId.firstName": { $regex: searchQuery, $options: "i" } },
  //         { "mentorId.lastName": { $regex: searchQuery, $options: "i" } },
  //         { "menteeId.firstName": { $regex: searchQuery, $options: "i" } },
  //         { "menteeId.lastName": { $regex: searchQuery, $options: "i" } },
  //         { "serviceId.title": { $regex: searchQuery, $options: "i" } },
  //       ];
  //     }

  //     if (service && service !== "All") {
  //       query["serviceId.type"] = service;
  //     }

  //     if (status && status !== "All") {
  //       query.status = status;
  //     }

  //     const [bookings, total] = await Promise.all([
  //       this.bookingRepository.findAllBookings(skip, limit, query),
  //       this.bookingRepository.countAllBookings(query),
  //     ]);
  //     console.log("booking service gettAllBookings response", bookings, total);

  //     return { bookings, total };
  //   } catch (error: any) {
  //     console.error("Error fetching all bookings:", error);
  //     throw new ApiError(500, "Failed to fetch all bookings");
  //   }
  // }
  async getAllBookings(
    page: number = 1,
    limit: number = 10,
    searchQuery: string = "",
    service: string = "",
    status: string = ""
  ): Promise<{ bookings: any[]; total: number }> {
    try {
      console.log("BookingService getAllBookings > params:", {
        page,
        limit,
        searchQuery,
        service,
        status,
      });
      const skip = (page - 1) * limit;
      const query: any = {};

      if (searchQuery) {
        // Fetch matching User IDs
        const users = await this.userRepository.findUsersByNameOrEmail(
          searchQuery
        );
        const userIds = users.map((user: any) => user._id);

        // Fetch matching Service IDs
        const services = await this.serviceRepository.findServicesByTitle(
          searchQuery
        );
        const serviceIds = services.map((service: any) => service._id);

        console.log("BookingService getAllBookings > search IDs:", {
          userIds,
          serviceIds,
        });

        if (userIds.length === 0 && serviceIds.length === 0) {
          return { bookings: [], total: 0 }; // No matching users or services
        }

        query.$or = [
          { mentorId: { $in: userIds } },
          { menteeId: { $in: userIds } },
          { serviceId: { $in: serviceIds } },
        ];
      }

      if (service && service !== "All") {
        query["serviceId.type"] = service;
      }

      if (status && status !== "All") {
        query.status = status;
      }

      console.log(
        "BookingService getAllBookings > query:",
        JSON.stringify(query)
      );

      const [bookings, total] = await Promise.all([
        this.bookingRepository.findAllBookings(skip, limit, query),
        this.bookingRepository.countAllBookings(query),
      ]);

      console.log("BookingService getAllBookings > response:", {
        bookingsCount: bookings.length,
        bookings: bookings.map((b: any) => ({
          _id: b._id,
          mentorId: b.mentorId,
          menteeId: b.menteeId,
          serviceId: b.serviceId,
          status: b.status,
        })),
        total,
      });

      return { bookings, total };
    } catch (error: any) {
      console.error("BookingService getAllBookings > error:", error);
      throw new ApiError(500, "Failed to fetch all bookings");
    }
  }
  // async getAllBookings(
  //   page: number = 1,
  //   limit: number = 10,
  //   searchQuery: string = "",
  //   service: string = "",
  //   status: string = ""
  // ): Promise<{ bookings: any[]; total: number }> {
  //   try {
  //     console.log("BookingService getAllBookings > params:", {
  //       page,
  //       limit,
  //       searchQuery,
  //       service,
  //       status,
  //     });
  //     const skip = (page - 1) * limit;
  //     const query: any = {};

  //     if (searchQuery) {
  //       query.$or = [
  //         { "mentorId.firstName": { $regex: searchQuery, $options: "i" } },
  //         { "mentorId.lastName": { $regex: searchQuery, $options: "i" } },
  //         { "menteeId.firstName": { $regex: searchQuery, $options: "i" } },
  //         { "menteeId.lastName": { $regex: searchQuery, $options: "i" } },
  //         { "serviceId.title": { $regex: searchQuery, $options: "i" } },
  //       ];
  //     }

  //     if (service && service !== "All") {
  //       query["serviceId.type"] = service;
  //     }

  //     if (status && status !== "All") {
  //       query.status = status;
  //     }

  //     console.log(
  //       "BookingService getAllBookings > query:",
  //       JSON.stringify(query)
  //     );

  //     const [bookings, total] = await Promise.all([
  //       this.bookingRepository.findAllBookings(skip, limit, query),
  //       this.bookingRepository.countAllBookings(query),
  //     ]);

  //     console.log("BookingService getAllBookings > response:", {
  //       bookingsCount: bookings.length,
  //       bookings: bookings.map((b: any) => ({
  //         _id: b._id,
  //         mentorId: b.mentorId,
  //         menteeId: b.menteeId,
  //         serviceId: b.serviceId,
  //         status: b.status,
  //       })),
  //       total,
  //     });

  //     return { bookings, total };
  //   } catch (error: any) {
  //     console.error("BookingService getAllBookings > error:", error);
  //     throw new ApiError(500, "Failed to fetch all bookings");
  //   }
  // }
}
