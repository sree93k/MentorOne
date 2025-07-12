import { IBookingService, BookingParams } from "../interface/IBookingService";
import BookingRepository from "../../repositories/implementations/BookingRepository";
import PaymentRepository from "../../repositories/implementations/PaymentRepository";

import ServiceRepository from "../../repositories/implementations/ServiceRepository";
import ChatService from "./ChatService";
import { IChatService } from "../interface/IChatService";
import NotificationService from "./NotificationService";
import { INotificationService } from "../interface/INotificationService";

import { EService } from "../../entities/serviceEntity";
import UserRepository from "../../repositories/implementations/UserRepository";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { getIO } from "../../utils/socket/notification";
import WalletRepository from "../../repositories/implementations/WalletRepository";
import { IWalletRepository } from "../../repositories/interface/IWalletRepository";
import { IServiceRepository } from "../../repositories/interface/IServiceRepository";

import { IPaymentRepository } from "../../repositories/interface/IPaymentRepository";
import { IBookingRepository } from "../../repositories/interface/IBookingRepository";
import SlotRepository from "../../repositories/implementations/SlotRepository";
import { ISlotRepository } from "../../repositories/interface/ISlotRepository";
import BlockedRepository from "../../repositories/implementations/BlockedRepository";
import { IBlockedRepository } from "../../repositories/interface/IBlockedRepository";
import { EBooking } from "../../entities/bookingEntity";
import { toASCII } from "punycode";

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
  platformPercentage: number;
  platformCharge: number;
  total: number;
}

interface BookServiceParams {
  serviceId: string;
  mentorId: string;
  menteeId: string;
  sessionId: string;
}

interface RescheduleParams {
  requestedDate?: string;
  requestedTime?: string;
  requestedSlotIndex?: number;
  mentorDecides: boolean;
}

export default class BookingService implements IBookingService {
  private bookingRepository: IBookingRepository;
  private paymentRepository: IPaymentRepository;
  private serviceRepository: IServiceRepository;
  private chatService: IChatService;
  private userRepository: IUserRepository;
  private notificationService: INotificationService;
  private walletRepository: IWalletRepository;
  private slotRepository: ISlotRepository;
  private blockedRepository: IBlockedRepository;
  constructor() {
    this.bookingRepository = new BookingRepository();
    this.paymentRepository = new PaymentRepository();
    this.chatService = new ChatService();
    this.serviceRepository = new ServiceRepository();
    this.userRepository = new UserRepository();
    this.notificationService = new NotificationService();
    this.walletRepository = new WalletRepository();
    this.slotRepository = new SlotRepository();
    this.blockedRepository = new BlockedRepository();
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

    let status;
    const response = await this.serviceRepository.getServiceById(serviceId);
    if (response?.type === "DigitalProducts") {
      status = "completed";
    } else {
      status = "confirmed";
    }
    console.log("++++++++++BOOKING SERVICE createBooking step 1", response);
    console.log(
      "++++++++++BOOKING SERVICE createBooking step 2",
      response?.type
    );
    if (response?.type === "1-1Call") {
      const dates = [
        {
          date: bookingDate,
          day,
          slotTime: startTime,
          type: "booking",
        },
      ];
      console.log("++++++++++BOOKING SERVICE createBooking step 3", dates);
      const blockedDate = await this.blockedRepository.addBlockedDates(
        mentorId,
        dates
      );
      console.log(
        "++++++++++BOOKING SERVICE createBooking step 4",
        blockedDate
      );
    }
    const booking = await this.bookingRepository.create({
      serviceId,
      mentorId,
      menteeId,
      day,
      slotIndex,
      startTime,
      endTime,
      bookingDate: new Date(bookingDate),
      status: status,
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
      platformPercentage,
      platformCharge,
      total,
    } = params;

    console.log(
      "Booking service saveBookingAndPayment  STEP 1 ...params:",
      params
    );

    try {
      if (!amount || amount <= 0) {
        throw new Error("Invalid amount");
      }

      const service = await this.serviceRepository.getServiceById(serviceId);
      if (!service) {
        throw new Error("Service not found");
      }

      const existingBooking = await this.bookingRepository.findBySessionId(
        sessionId
      );
      if (existingBooking) {
        console.log("Booking already exists for sessionId:", sessionId);
        return { booking: existingBooking, payment: null, chat: null };
      }

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

      const payment = await this.paymentRepository.create({
        bookingId: booking._id,
        menteeId,
        mentorId,
        amount,
        platformPercentage,
        platformCharge,
        total,
        status: "completed",
        transactionId: sessionId,
      });

      // Add to mentor's pending balance
      // let wallet = await this.walletRepository.findByUserId(mentorId);
      // if (!wallet) {
      //   wallet = await this.walletRepository.createWallet(mentorId);
      // }
      // await this.walletRepository.addPendingBalance(
      //   mentorId,
      //   amount,
      //   payment._id.toString()
      // );

      let chat;
      if (service.oneToOneType === "chat") {
        chat = await this.chatService.createChat(
          booking._id.toString(),
          menteeId,
          mentorId
        );
        console.log("Created chat:", chat._id);
      }

      try {
        const io = getIO();
        console.log("IO instance:", !!io);
        console.log("Sending notifications for:", {
          paymentId: payment._id,
          bookingId: booking._id,
          total,
          menteeId,
          mentorId,
        });
        await this.notificationService.createPaymentAndBookingNotifications(
          payment._id.toString(),
          booking._id.toString(),
          menteeId,
          mentorId,
          total,
          io
        );
        console.log("Notifications sent successfully:", {
          paymentId: payment._id,
          bookingId: booking._id,
        });
      } catch (notificationError: any) {
        console.error(
          "Failed to send notifications:",
          notificationError.message
        );
      }

      console.log("Saved booking:", booking._id);
      console.log("Saved payment:", payment._id);

      return { booking, payment, chat };
    } catch (error: any) {
      console.error("Detailed error in saveBookingAndPayment:", error);
      throw new Error(error.message || "Failed to save booking and payment");
    }
  }
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
      console.log("booking service getBookingsByMentee step 2");
      return { bookings, total };
    } catch (error: any) {
      console.log("booking service getBookingsByMentee step error", error);
      throw new Error("Failed to fetch bookings");
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
      throw new Error("Failed to fetch mentor bookings");
    }
  }

  async cancelBooking(bookingId: string): Promise<void> {
    console.log("cancel Booking Booking servcie step 1", bookingId);

    const booking = await this.bookingRepository.findById(bookingId);
    console.log("cancel Booking Booking servcie step 2", booking);
    if (!booking) {
      console.log("cancel Booking Booking servcie step 2.5 ERROR");
      throw new Error("Booking not found");
    }
    console.log("cancel Booking Booking servcie step 3");
    const updatedBooking = await this.bookingRepository.update(bookingId, {
      status: "cancelled",
    });
    await this.blockedRepository.deleteBlockedDate(
      booking.mentorId,
      booking.bookingDate,
      booking.startTime
    );
    console.log("cancel Booking Booking servcie step 4", updatedBooking);
    const updatePayment = await this.paymentRepository.updateByBookingId(
      bookingId,
      {
        status: "refunded",
      }
    );
    console.log(
      "cancel Booking Booking servcie step 4.5 updatePayment",
      updatePayment
    );

    let wallet = await this.walletRepository.findByUserId(booking.menteeId);
    console.log("cancel Booking Booking servcie step 4..6", updatePayment);
    if (!wallet) {
      console.log("cancel Booking Booking servcie step 4.7");
      wallet = await this.walletRepository.createWallet(booking.menteeId);
    }
    console.log("cancel Booking Booking servcie step 4.8");
    const updatedWallet = await this.walletRepository.addPendingBalance(
      updatePayment.menteeId.toString(),
      updatePayment.total,
      updatePayment._id.toString()
    );
    console.log("cancel Booking Booking servcie step 4.9", updatedWallet);
    console.log("cancel Booking Booking servcie step 5");
  }

  async verifyBookingBySessionId(sessionId: string): Promise<any> {
    const booking = await this.bookingRepository.findBySessionId(sessionId);
    if (!booking) {
      throw new Error("Booking not found");
    }
    return booking;
  }

  async getAllVideoTutorials(
    type?: string,
    searchQuery?: string,
    page: number = 1,
    limit: number = 12
  ): Promise<{ tutorials: any[]; total: number }> {
    try {
      console.log("bookingservice getAllVideoTutorials step 1", {
        type,
        searchQuery,
        page,
        limit,
      });
      const { tutorials, total } =
        await this.serviceRepository.getAllVideoTutorials(
          type,
          searchQuery,
          page,
          limit
        );
      console.log(
        "bookingservice getAllVideoTutorials step 2: Tutorials fetched",
        tutorials.length
      );
      return { tutorials, total };
    } catch (error: any) {
      console.error("Error fetching tutorials:", error);
      throw new Error(`Failed to fetch tutorials: ${error.message}`);
    }
  }

  async getTutorialById(tutorialId: string): Promise<any> {
    try {
      console.log("bookingservice getTutorialById step 1", tutorialId);
      const tutorial = await this.serviceRepository.getTutorialById(tutorialId);
      console.log("bookingservice getTutorialById step 2", tutorial);
      if (!tutorial) {
        throw new Error("Tutorial not found");
      }
      return tutorial;
    } catch (error: any) {
      console.error("Error fetching tutorial by ID:", error);
      throw new Error(error.message || "Failed to fetch tutorial details");
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
      return !!booking && booking.status === "completed";
    } catch (error: any) {
      console.error("Error checking booking status:", error);
      throw new Error(error.message || "Failed to check booking status");
    }
  }

  async bookService(params: BookServiceParams): Promise<any> {
    try {
      console.log("bookingservice bookService step 1", params);
      const { serviceId, mentorId, menteeId, sessionId } = params;
      const service = await this.serviceRepository.getServiceById(serviceId);
      if (!service) {
        throw new Error("Service not found");
      }

      // Check if booking already exists for this sessionId
      const existingBooking = await this.bookingRepository.findBySessionId(
        sessionId
      );
      if (existingBooking) {
        console.log("Booking already exists for sessionId:", sessionId);
        return { booking: existingBooking, payment: null };
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
      console.log("bookingservice bookService step 2");

      try {
        const io = getIO();
        console.log("Sending notifications for:", {
          paymentId: payment._id,
          bookingId: booking._id,
        });
        await this.notificationService.createPaymentAndBookingNotifications(
          payment._id.toString(),
          booking._id.toString(),
          menteeId,
          mentorId,
          io
        );
        console.log("Notifications sent successfully:", {
          paymentId: payment._id,
          bookingId: booking._id,
        });
      } catch (notificationError: any) {
        console.error(
          "Failed to send notifications:",
          notificationError.message
        );
      }

      return { booking, payment };
    } catch (error: any) {
      console.error("Error booking service:", error);
      throw new Error(error.message || "Failed to book service");
    }
  }

  async getServiceById(serviceId: string): Promise<EService | null> {
    try {
      console.log("bookingservice getServiceById step 1", serviceId);
      const service = await this.serviceRepository.getServiceById(serviceId);
      console.log("bookingservice getServiceById step 2");
      return service;
    } catch (error: any) {
      console.error("Error fetching service by ID:", error);
      throw new Error(error.message || "Failed to fetch service");
    }
  }

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
        const users = await this.userRepository.findUsersByNameOrEmail(
          searchQuery
        );
        const userIds = users.map((user: any) => user._id);
        const services = await this.serviceRepository.findServicesByTitle(
          searchQuery
        );
        const serviceIds = services.map((service: any) => service._id);

        console.log("BookingService getAllBookings > search IDs:", {
          userIds,
          serviceIds,
        });

        if (userIds.length === 0 && serviceIds.length === 0) {
          return { bookings: [], total: 0 };
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
      throw new Error("Failed to fetch all bookings");
    }
  }

  async getAllVideoCalls(
    mentorId: string,
    status?: string[], // Changed from string to string[]
    limit?: number
  ): Promise<EBooking[]> {
    try {
      console.log("BookingService getAllVideoCalls step 1", {
        mentorId,
        status,
        limit,
      });
      const allVideoCallBookings =
        await this.bookingRepository.findAllVideoCalls(
          mentorId,
          status || ["confirmed", "rescheduled"], // Default to ["confirmed", "rescheduled"]
          limit
        );
      console.log(
        "BookingService getAllVideoCalls step 2",
        allVideoCallBookings
      );
      return allVideoCallBookings;
    } catch (error: any) {
      console.error("BookingService getAllVideoCalls > error:", error);
      throw new Error("Failed to fetch video call bookings");
    }
  }

  async updateBookingStatus(
    bookingId: string,
    updates: {
      status: string;
      bookingDate?: string;
      startTime?: string;
      slotIndex?: number;
      rescheduleRequest?: {
        rescheduleStatus: "noreschedule" | "pending" | "accepted" | "rejected";
      };
    },
    mentorId: string
  ): Promise<EBooking> {
    try {
      console.log("BookingService updateBookingStatus step 1", {
        bookingId,
        updates,
        mentorId,
      });

      const booking = await this.bookingRepository.findById(bookingId);
      if (!booking) {
        throw new Error("Booking not found");
      }
      if (booking.mentorId._id.toString() !== mentorId) {
        throw new Error("Not authorized to update this booking");
      }

      // Update calendar if status is confirmed and date/time changes
      if (
        updates.status === "confirmed" &&
        updates.bookingDate &&
        updates.startTime &&
        (updates.bookingDate !==
          booking.bookingDate.toISOString().split("T")[0] ||
          updates.startTime !== booking.startTime)
      ) {
        // Remove old blocked date
        await this.blockedRepository.removeBlockedDate(
          mentorId,
          booking.bookingDate.toISOString().split("T")[0],
          booking.startTime
        );
        // Add new blocked date
        await this.blockedRepository.addBlockedDates(mentorId, [
          {
            date: updates.bookingDate,
            day: new Date(updates.bookingDate)
              .toLocaleString("en-US", { weekday: "long" })
              .toLowerCase(),
            slotTime: updates.startTime,
            type: "booking",
          },
        ]);
      }

      const updatedBooking = await this.bookingRepository.update(bookingId, {
        ...updates,
        updatedAt: new Date(),
      });

      if (!updatedBooking) {
        throw new Error("Failed to update booking status");
      }

      // Notify mentee
      try {
        const io = getIO();
        const notificationMessage =
          updates.rescheduleRequest?.rescheduleStatus === "accepted"
            ? `Your reschedule request for booking ${bookingId} has been accepted.`
            : `Your reschedule request for booking ${bookingId} has been rejected.`;
        await this.notificationService.createNotification(
          booking.menteeId.toString(),
          "booking",
          notificationMessage,
          bookingId,
          io
        );
      } catch (notificationError: any) {
        console.error(
          "Failed to send notification:",
          notificationError.message
        );
      }

      console.log("BookingService updateBookingStatus step 2", updatedBooking);
      return updatedBooking;
    } catch (error: any) {
      console.error("BookingService updateBookingStatus error:", error);
      throw new Error(error.message || "Failed to update booking status");
    }
  }
  async requestReschedule(
    bookingId: string,
    menteeId: string,
    params: RescheduleParams
  ): Promise<EBooking> {
    try {
      console.log("BookingService requestReschedule step 1", {
        bookingId,
        menteeId,
        params,
      });

      const booking = await this.bookingRepository.findById(bookingId);
      console.log("BookingService requestReschedule step 1.1");
      if (!booking) {
        console.log("ERRROr 1");

        throw new Error("Booking not found");
      }

      if (booking.status !== "confirmed") {
        console.log("ERRROr 3");
        throw new Error("Only confirmed bookings can be rescheduled");
      }

      const rescheduleRequest = {
        requestedDate: params.requestedDate,
        requestedTime: params.requestedTime,
        requestedSlotIndex: params.requestedSlotIndex,
        mentorDecides: params.mentorDecides,
        rescheduleStatus: "pending" as "pending",
        reason: params.mentorDecides ? "Mentor to decide" : undefined,
      };
      console.log("BookingService requestReschedule step 1.2");
      const updatedBooking = await this.bookingRepository.update(bookingId, {
        rescheduleRequest,
        status: "rescheduled",
        updatedAt: new Date(),
      });
      console.log("BookingService requestReschedule step 1.3");
      if (!updatedBooking) {
        throw new Error("Failed to submit reschedule request");
      }

      // Notify mentor about the reschedule request
      try {
        const io = getIO();
        const notificationMessage = `A reschedule request has been submitted for booking ${bookingId}`;
        await this.notificationService.createNotification(
          booking.mentorId.toString(), // recipientId
          "booking", // type
          notificationMessage, // message (string)
          bookingId, // relatedId
          io // optional io
        );
      } catch (notificationError: any) {
        console.error(
          "Failed to send reschedule notification:",
          notificationError.message
        );
      }

      console.log("BookingService requestReschedule step 2", updatedBooking);
      return updatedBooking;
    } catch (error: any) {
      console.error("BookingService requestReschedule error:", error);
      throw new Error(error.message || "Failed to submit reschedule request");
    }
  }
  async getBookingsWithTestimonialsByMentee(
    menteeId: string,
    page: number = 1,
    limit: number = 12,
    searchQuery: string = ""
  ): Promise<{ bookings: any[]; total: number }> {
    console.log("booking service getBookingsWithTestimonialsByMentee step 1", {
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
        this.bookingRepository.findByMenteeWithTestimonials(
          menteeId,
          skip,
          limit,
          query
        ),
        this.bookingRepository.countByMentee(menteeId, query),
      ]);
      console.log(
        "booking service getBookingsWithTestimonialsByMentee step 2",
        {
          bookings,
          total,
        }
      );
      return { bookings, total };
    } catch (error: any) {
      console.log(
        "booking service getBookingsWithTestimonialsByMentee step error",
        error
      );
      throw new Error("Failed to fetch bookings");
    }
  }
  async findById(bookingId: string): Promise<any> {
    try {
      console.log("BookingService findById step 1 bookingId", bookingId);
      const booking = await this.bookingRepository.findById(bookingId);
      console.log("BookingService findById step 2 booking response");
      if (!booking) {
        throw new Error("Booking not found");
      }
      return booking;
    } catch (error: any) {
      console.error("BookingService findById error", error);
      throw new Error("Failed to find booking", error.message);
    }
  }

  async updateBookingServiceStatus(
    bookingId: string,
    status: "pending" | "confirmed" | "completed" | "rescheduled" | "cancelled"
  ): Promise<any> {
    try {
      console.log("BookingService updateBookingStatus step 1", {
        bookingId,
        status,
      });

      // Compute isActive based on status
      const isActive = status === "confirmed";

      // Update booking status
      const booking = await this.bookingRepository.updateBookingStatus(
        bookingId,
        status
      );
      console.log(
        "BookingService updateBookingStatus step 1.5 isActive",
        isActive
      );

      const paymentTransfer = await this.paymentRepository.updateByBookingId(
        bookingId,
        { status: "transferred" }
      );

      console.log(
        "BookingService updateBookingServiceStatus step 1.6 paymentTransfer",
        paymentTransfer
      );
      // Update chat isActive field
      const chatUpdate = await this.chatService.updateByBookingId(
        bookingId,
        isActive
      );
      console.log(
        "BookingService updateBookingStatus step 2 chatUpdate",
        chatUpdate
      );

      console.log("BookingService updateBookingStatus step 3 booking", booking);
      return booking;
    } catch (error: any) {
      console.error("BookingService updateBookingStatus error", error);
      throw new Error(
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to update booking status"
      );
    }
  }

  async updateResheduleBooking(
    userId: string,
    bookingId: string,
    payload: {
      status: string;
      dayOfWeek: string;
      bookingDate?: string;
      startTime?: string;
      slotIndex?: number;
      rescheduleRequest: {
        rescheduleStatus: "noreschedule" | "pending" | "accepted" | "rejected";
        requestedDate?: string;
        requestedTime?: string;
        requestedSlotIndex?: number;
      };
    }
  ): Promise<any> {
    try {
      console.log("BookingService updateResheduleBooking step 1", {
        bookingId,
        payload,
        userId,
      });

      if (!bookingId || !payload) {
        throw new Error("Booking ID and payload are required");
      }

      if (!["pending", "confirmed", "rescheduled"].includes(payload.status)) {
        throw new Error("Invalid booking status");
      }

      if (
        !["noreschedule", "pending", "accepted", "rejected"].includes(
          payload.rescheduleRequest.rescheduleStatus
        )
      ) {
        throw new Error("Invalid reschedule status");
      }

      // Prepare update data
      const updateData: any = {
        status: payload.status,
        rescheduleRequest: {
          rescheduleStatus: payload.rescheduleRequest.rescheduleStatus,
          requestedDate: payload.rescheduleRequest.requestedDate,
          requestedTime: payload.rescheduleRequest.requestedTime,
          requestedSlotIndex: payload.rescheduleRequest.requestedSlotIndex,
        },
      };

      // If reschedule is approved, update booking date, time, and slot
      if (payload.rescheduleRequest.rescheduleStatus === "accepted") {
        if (
          !payload.bookingDate ||
          !payload.startTime ||
          payload.slotIndex === undefined
        ) {
          throw new Error(
            "bookingDate, startTime, and slotIndex are required for approved reschedule"
          );
        }

        updateData.bookingDate = new Date(payload.bookingDate);
        updateData.startTime = payload.startTime;
        updateData.slotIndex = payload.slotIndex;

        // Validate date and time formats
        if (isNaN(updateData.bookingDate.getTime())) {
          throw new Error("Invalid bookingDate format");
        }
        if (
          !/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i.test(payload.startTime)
        ) {
          throw new Error("Invalid startTime format");
        }
        if (
          !Number.isInteger(payload.slotIndex) ||
          payload.slotIndex < 0 ||
          payload.slotIndex > 2
        ) {
          throw new Error("Invalid slotIndex");
        }
      }
      const bookings = await this.bookingRepository.findById(bookingId);
      console.log("BookingService updateResheduleBooking step 1.1", bookings);

      const deletedBlockedDate = await this.blockedRepository.deleteBlockedDate(
        userId,
        bookings.bookingDate,
        bookings.startTime
      );
      console.log(
        "BookingService updateResheduleBooking step 1.4",
        deletedBlockedDate
      );
      // Update booking
      const booking = await this.bookingRepository.update(
        bookingId,
        updateData
      );
      console.log("BookingService updateResheduleBooking step 1.2");
      const dates = [
        {
          date: payload.bookingDate,
          day: payload?.dayOfWeek,
          slotTime: payload.startTime,
          type: "booking",
        },
      ];
      console.log("BookingService updateResheduleBooking step 1.3", booking);

      const blockedDate = await this.blockedRepository.addBlockedDates(
        userId,
        dates
      );
      console.log(
        "BookingService updateResheduleBooking step 1.5",
        blockedDate
      );

      if (!booking) {
        throw new Error("Booking not found");
      }

      console.log("BookingService updateResheduleBooking step 3 booking");
      return booking;
    } catch (error: any) {
      console.error("BookingService updateResheduleBooking error", error);
      throw new Error(
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to update reschedule booking"
      );
    }
  }

  async getBookingData(
    dashboard: "mentor" | "mentee",
    bookingId: string
  ): Promise<EBooking[]> {
    try {
      console.log("BookingService getBookingData", { dashboard });
      const bookings = await this.bookingRepository.getBookingsByDashboard(
        dashboard,
        bookingId
      );
      console.log("BookingService getBookingData success", {
        count: Array.isArray(bookings) ? bookings.length : 1,
      });
      return Array.isArray(bookings) ? bookings : [bookings];
    } catch (error: any) {
      console.error("BookingService getBookingData error", error);
      throw new Error(
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch booking data"
      );
    }
  }

  async getAllServices(
    page: number,
    limit: number,
    type?: string,
    searchQuery?: string,
    oneToOneType?: string,
    digitalProductType?: string
  ): Promise<{ services: any[]; total: number }> {
    try {
      console.log("MenteeProfileService getAllServices", {
        page,
        limit,
        type,
        searchQuery,
        oneToOneType,
        digitalProductType,
      });
      const { services, total } =
        await this.serviceRepository.getAllServicesForMentee({
          page,
          limit,
          search: searchQuery || "",
          type,
          oneToOneType,
          digitalProductType,
        });
      console.log(
        "BOOKING SERVICE ......getAllServices step 1",
        services.length,
        total
      );

      return { services, total };
    } catch (error: any) {
      throw new Error(`Failed to fetch services: ${error.message}`);
    }
  }

  async findByMentee(menteeId: string): Promise<EBooking[]> {
    try {
      const bookingData = await this.bookingRepository.findByMentee(menteeId);
      return bookingData;
    } catch (error) {
      throw new Error(`Failed to fetch bookings: ${error}`);
    }
  }

  async updateStatus(
    bookingId: string,
    status: Partial<EBooking>
  ): Promise<EBooking[]> {
    try {
      const bookingData = await this.bookingRepository.update(
        bookingId,
        status
      );
      return bookingData;
    } catch (error) {
      throw new Error(`Failed to fetch bookings: ${error}`);
    }
  }
  async update(bookingId: string, meetingId: object): Promise<EBooking> {
    try {
      const bookingData = await this.bookingRepository.update(bookingId, {
        meetingId,
      });
      return bookingData;
    } catch (error) {
      throw new Error("Failed to send notification: " + error);
    }
  }
}
