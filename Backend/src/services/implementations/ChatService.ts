import ChatRepository from "../../repositories/implementations/ChatRepository";
import BookingRepository from "../../repositories/implementations/BookingRepository";
import { ApiError } from "../../middlewares/errorHandler";
import { IChatService } from "../interface/IChatService";
import { log } from "winston";

export default class ChatService implements IChatService {
  private chatRepository: ChatRepository;
  private bookingRepository: BookingRepository;

  constructor() {
    this.chatRepository = new ChatRepository();
    this.bookingRepository = new BookingRepository();
  }

  // async createChat(bookingId: string, menteeId: string, mentorId: string) {
  //   console.log("Chat service createChat step 1");

  //   const booking = await this.bookingRepository.findById(bookingId);
  //   if (!booking) {
  //     throw new ApiError(404, "Booking not found");
  //   }
  //   console.log("Chat service createChat step 2", booking);
  //   const existingChat = await this.chatRepository.findByBookingId(bookingId);
  //   if (existingChat) {
  //     return existingChat;
  //   }
  //   console.log("Chat service createChat step 3", existingChat);
  //   const chatData = {
  //     users: [menteeId, mentorId],
  //     roles: [
  //       { userId: menteeId, role: "mentee" },
  //       { userId: mentorId, role: "mentor" },
  //     ],
  //     bookingId,
  //     chatName: `${menteeId}-${mentorId}`, // Optional
  //   };
  //   console.log("Chat service createChat step 4");
  //   const chat = await this.chatRepository.create(chatData);
  //   console.log("Chat service createChat step 5");
  //   return chat;
  // }
  async createChat(bookingId: string, menteeId: string, mentorId: string) {
    console.log("Chat service createChat step 1", {
      bookingId,
      menteeId,
      mentorId,
    });

    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new ApiError(404, "Booking not found");
    }
    console.log("Chat service createChat step 2", booking);

    // Check for existing chat by menteeId and mentorId with roles
    const existingChatByUsers = await this.chatRepository.findByUsersAndRoles(
      menteeId,
      mentorId
    );
    if (existingChatByUsers) {
      console.log(
        "Chat service createChat step 3: Existing chat found by users",
        existingChatByUsers
      );
      // Update isActive and bookingId
      const updatedChat = await this.chatRepository.updateByUsersAndRoles(
        menteeId,
        mentorId,
        {
          isActive: true,
          bookingId,
        }
      );
      console.log(
        "Chat service createChat step 4: Updated existing chat",
        updatedChat
      );
      return updatedChat;
    }
    console.log("Chat service createChat step 3: No chat found by users");

    // Check for existing chat by bookingId (maintain existing logic)
    const existingChatByBooking = await this.chatRepository.findByBookingId(
      bookingId
    );
    if (existingChatByBooking) {
      console.log(
        "Chat service createChat step 4: Existing chat found by bookingId",
        existingChatByBooking
      );
      return existingChatByBooking;
    }
    console.log("Chat service createChat step 4: No chat found by bookingId");

    // Create new chat
    const chatData = {
      users: [menteeId, mentorId],
      roles: [
        { userId: menteeId, role: "mentee" },
        { userId: mentorId, role: "mentor" },
      ],
      bookingId,
      chatName: `${menteeId}-${mentorId}`,
      isActive: true, // Explicitly set isActive to true for new chats
    };
    console.log("Chat service createChat step 5", chatData);
    const chat = await this.chatRepository.create(chatData);
    console.log("Chat service createChat step 6", chat);
    return chat;
  }

  async getChatsByUserAndRole(userId: string, role: "mentee" | "mentor") {
    console.log("CHAT service getChatsByUserAndRole step 1");

    const chat = await this.chatRepository.findByUserAndRole(userId, role);
    console.log("CHAT service getChatsByUserAndRole step 2");
    return chat;
  }
}
