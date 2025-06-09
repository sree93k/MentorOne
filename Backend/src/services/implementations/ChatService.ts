// import ChatRepository from "../../repositories/implementations/ChatRepository";
// import BookingRepository from "../../repositories/implementations/BookingRepository";
// import { ApiError } from "../../middlewares/errorHandler";
// import { IChatService } from "../interface/IChatService";
// import { log } from "winston";

// export default class ChatService implements IChatService {
//   private chatRepository: ChatRepository;
//   private bookingRepository: BookingRepository;

//   constructor() {
//     this.chatRepository = new ChatRepository();
//     this.bookingRepository = new BookingRepository();
//   }

//   async createChat(bookingId: string, menteeId: string, mentorId: string) {
//     console.log("Chat service createChat step 1", {
//       bookingId,
//       menteeId,
//       mentorId,
//     });

//     const booking = await this.bookingRepository.findById(bookingId);
//     if (!booking) {
//       throw new ApiError(404, "Booking not found");
//     }
//     console.log("Chat service createChat step 2", booking);

//     // Check for existing chat by menteeId and mentorId with roles
//     const existingChatByUsers = await this.chatRepository.findByUsersAndRoles(
//       menteeId,
//       mentorId
//     );
//     if (existingChatByUsers) {
//       console.log(
//         "Chat service createChat step 3: Existing chat found by users",
//         existingChatByUsers
//       );
//       // Update isActive and bookingId
//       const updatedChat = await this.chatRepository.updateByUsersAndRoles(
//         menteeId,
//         mentorId,
//         {
//           isActive: true,
//           bookingId,
//         }
//       );
//       console.log(
//         "Chat service createChat step 4: Updated existing chat",
//         updatedChat
//       );
//       return updatedChat;
//     }
//     console.log("Chat service createChat step 3: No chat found by users");

//     // Check for existing chat by bookingId (maintain existing logic)
//     const existingChatByBooking = await this.chatRepository.findByBookingId(
//       bookingId
//     );
//     if (existingChatByBooking) {
//       console.log(
//         "Chat service createChat step 4: Existing chat found by bookingId",
//         existingChatByBooking
//       );
//       return existingChatByBooking;
//     }
//     console.log("Chat service createChat step 4: No chat found by bookingId");

//     // Create new chat
//     const chatData = {
//       users: [menteeId, mentorId],
//       roles: [
//         { userId: menteeId, role: "mentee" },
//         { userId: mentorId, role: "mentor" },
//       ],
//       bookingId,
//       chatName: `${menteeId}-${mentorId}`,
//       isActive: true, // Explicitly set isActive to true for new chats
//     };
//     console.log("Chat service createChat step 5", chatData);
//     const chat = await this.chatRepository.create(chatData);
//     console.log("Chat service createChat step 6", chat);
//     return chat;
//   }

//   async getChatsByUserAndRole(userId: string, role: "mentee" | "mentor") {
//     console.log("CHAT service getChatsByUserAndRole step 1");

//     const chat = await this.chatRepository.findByUserAndRole(userId, role);
//     console.log("CHAT service getChatsByUserAndRole step 2");
//     return chat;
//   }

//   async getUserOnlineStatus(mentorId: string): Promise<Boolean | null> {
//     try {
//       console.log("CHAT service getUserOnlineStatus step 1", mentorId);

//       console.log("CHAT service getUserOnlineStatus step 2");
//       return null;
//     } catch (error) {
//       console.log("error at find user with email at service", error);
//       return null;
//     }
//   }
// }
import ChatRepository from "../../repositories/implementations/ChatRepository";
import BookingRepository from "../../repositories/implementations/BookingRepository";
import { ApiError } from "../../middlewares/errorHandler";
import { IChatService } from "../interface/IChatService";
import { createClient } from "@redis/client";

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
      throw new ApiError(404, "Booking not found");
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
      throw new ApiError(500, "Failed to check online status", error.message);
    }
  }
}
