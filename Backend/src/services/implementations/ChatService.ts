import ChatRepository from "../../repositories/implementations/ChatRepository";
import BookingRepository from "../../repositories/implementations/BookingRepository";
import { IChatService } from "../interface/IChatService";
import { createClient } from "@redis/client";
import { EChat } from "../../entities/chatEntity";

export default class ChatService implements IChatService {
  private chatRepository: ChatRepository;
  private bookingRepository: BookingRepository;
  private redisClient;

  constructor() {
    this.chatRepository = new ChatRepository();
    this.bookingRepository = new BookingRepository();
    this.redisClient = createClient({ url: process.env.REDIS_URL });
    this.redisClient.connect().catch((err) => {
      console.error("ChatService: Redis connection error:", err.message);
    });
  }

  async createChat(bookingId: string, menteeId: string, mentorId: string) {
    console.log("ChatService: createChat start", {
      bookingId,
      menteeId,
      mentorId,
    });

    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      console.error("ChatService: createChat - Booking not found", {
        bookingId,
      });
      throw new Error("Booking not found");
    }
    console.log("ChatService: createChat - Booking found", { booking });

    const existingChatByUsers = await this.chatRepository.findByUsersAndRoles(
      menteeId,
      mentorId
    );
    if (existingChatByUsers) {
      console.log("ChatService: createChat - Existing chat found by users", {
        chatId: existingChatByUsers._id,
      });
      const updatedChat = await this.chatRepository.updateByUsersAndRoles(
        menteeId,
        mentorId,
        {
          isActive: true,
          bookingId,
        }
      );
      console.log("ChatService: createChat - Updated existing chat", {
        updatedChat,
      });
      return updatedChat;
    }
    console.log("ChatService: createChat - No chat found by users");

    const existingChatByBooking = await this.chatRepository.findByBookingId(
      bookingId
    );
    if (existingChatByBooking) {
      console.log(
        "ChatService: createChat - Existing chat found by bookingId",
        {
          chatId: existingChatByBooking._id,
        }
      );
      return existingChatByBooking;
    }
    console.log("ChatService: createChat - No chat found by bookingId");

    const chatData = {
      users: [menteeId, mentorId],
      roles: [
        { userId: menteeId, role: "mentee" },
        { userId: mentorId, role: "mentor" },
      ],
      bookingId,
      chatName: `${menteeId}-${mentorId}`,
      isActive: true,
    };
    console.log("ChatService: createChat - Creating new chat", { chatData });
    const chat = await this.chatRepository.create(chatData);
    console.log("ChatService: createChat - Chat created", { chat });
    return chat;
  }

  async getChatsByUserAndRole(userId: string, role: "mentee" | "mentor") {
    console.log("ChatService: getChatsByUserAndRole start", { userId, role });

    const chats = await this.chatRepository.findByUserAndRole(userId, role);
    console.log("ChatService: getChatsByUserAndRole - Chats fetched", {
      chatCount: chats.length,
    });
    return chats;
  }

  async getUserOnlineStatus(userId: string): Promise<boolean> {
    try {
      console.log("ChatService: getUserOnlineStatus start", { userId });

      if (!this.redisClient.isOpen) {
        console.warn("ChatService: getUserOnlineStatus - Reconnecting Redis");
        await this.redisClient.connect();
      }

      const isOnline = await this.redisClient.sIsMember("online_users", userId);
      console.log("ChatService: getUserOnlineStatus - Redis check result", {
        userId,
        isOnline,
      });

      return isOnline;
    } catch (error: any) {
      console.error("ChatService: getUserOnlineStatus error", {
        userId,
        error: error.message,
      });
      throw new Error("Failed to check online status", error.message);
    }
  }

  async updateByBookingId(
    bookingId: string,
    isActive: boolean
  ): Promise<EChat | null> {
    try {
      console.log("ChatService: updateByBookingId start 1");

      const chatUpdate = await this.chatRepository.updateByBookingId(
        bookingId,
        isActive
      );
      console.log("ChatService: updateByBookingId start 1");
      return chatUpdate;
    } catch (error: any) {
      console.error("ChatService: updateByBookingId error", {
        error: error.message,
      });
      throw new Error("Failed to check updateByBookingId", error.message);
    }
  }

  async findChatById(chatId: string): Promise<EChat | null> {
    try {
      console.log("ChatService: findChatById start 1");

      const chat = await this.chatRepository.findById(chatId);
      console.log("ChatService: findChatById start 1");
      return chat;
    } catch (error: any) {
      console.error("ChatService: findChatById error", {
        error: error.message,
      });
      throw new Error("Failed to check findChatById", error.message);
    }
  }
  async findChatByIdAndUpdate(
    chatId: string,
    data: Partial<EChat>
  ): Promise<EChat | null> {
    try {
      console.log("ChatService: findChatByIdAndUpdate start 1");

      const chat = await this.chatRepository.findByIdAndUpdate(chatId, data);
      console.log("ChatService: findChatByIdAndUpdate start 1");
      return chat;
    } catch (error: any) {
      console.error("ChatService: findChatByIdAndUpdate error", {
        error: error.message,
      });
      throw new Error("Failed to check findChatByIdAndUpdate", error.message);
    }
  }
}
