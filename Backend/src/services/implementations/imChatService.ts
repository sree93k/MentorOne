import ChatRepository from "../../repositories/implementations/imChatRepository";
import Booking from "../../models/bookingModel";
import { ApiError } from "../../middlewares/errorHandler";

export default class ChatService {
  private chatRepository: ChatRepository;

  constructor() {
    this.chatRepository = new ChatRepository();
  }

  async createChat(bookingId: string, menteeId: string, mentorId: string) {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new ApiError(404, "Booking not found");
    }

    const existingChat = await this.chatRepository.findByBookingId(bookingId);
    if (existingChat) {
      return existingChat;
    }

    const chatData = {
      users: [menteeId, mentorId],
      roles: [
        { userId: menteeId, role: "mentee" },
        { userId: mentorId, role: "mentor" },
      ],
      bookingId,
      chatName: `${menteeId}-${mentorId}`, // Optional
    };

    return await this.chatRepository.create(chatData);
  }

  async getChatsByUserAndRole(userId: string, role: "mentee" | "mentor") {
    return await this.chatRepository.findByUserAndRole(userId, role);
  }
}
