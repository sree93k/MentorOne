import mongoose from "mongoose";
import Chat from "../../models/chatModel";
import { ApiError } from "../../middlewares/errorHandler";
import { EChat } from "../../entities/chatEntity";
import { HttpStatus } from "../../constants/HttpStatus";

export default class ChatRepository {
  async create(data: Partial<EChat>): Promise<EChat> {
    try {
      console.log("=========ChatRepository create step 1", data);

      const chat = new Chat(data);
      return (await chat.save()) as EChat;
    } catch (error: any) {
      throw new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create chat",
        error.message
      );
    }
  }

  async findById(id: string): Promise<EChat | null> {
    try {
      console.log("CHAT REPOSITORY findById step 1");
      const chat = await Chat.findById(id)
        .populate("users", "firstName lastName profilePicture")
        .populate("latestMessage");
      console.log("CHAT REPOSITORY findById step 2");
      return chat as unknown as EChat | null;
    } catch (error: any) {
      throw new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to find chat",
        error.message
      );
    }
  }

  async findByIdAndUpdate(
    id: string,
    update: Partial<EChat>
  ): Promise<EChat | null> {
    try {
      console.log("CHAT REPOSITORY findByIdAndUpdate step 1");
      const chat = await Chat.findByIdAndUpdate(id, update, { new: true })
        .populate("users", "firstName lastName profilePicture")
        .populate("latestMessage");
      console.log("CHAT REPOSITORY findByIdAndUpdate step 2");
      return chat as unknown as EChat | null;
    } catch (error: any) {
      throw new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to update chat",
        error.message
      );
    }
  }

  async findByUserAndRole(
    userId: string,
    role: "mentee" | "mentor"
  ): Promise<EChat[]> {
    try {
      console.log("ChatRepository: findByUserAndRole start", { userId, role });

      const chats = await Chat.find({
        "roles.userId": userId,
        "roles.role": role,
      })
        .populate("users", "firstName lastName profilePicture")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });

      console.log("ChatRepository: findByUserAndRole - Chats found", {
        chatCount: chats.length,
        chatIds: chats.map((chat) => chat._id.toString()),
      });

      // Map chats to include otherUserId
      const enhancedChats = chats.map((chat) => {
        // Find the other user's ID (opposite role)
        const otherUserRole = role === "mentee" ? "mentor" : "mentee";
        const otherUser = chat.roles.find((r) => r.role === otherUserRole);
        const otherUserId = otherUser ? otherUser.userId.toString() : null;

        console.log(
          "ChatRepository: findByUserAndRole - Other user extracted",
          {
            chatId: chat._id.toString(),
            userId,
            role,
            otherUserRole,
            otherUserId,
          }
        );

        return {
          ...chat.toObject(),
          otherUserId,
        } as unknown as EChat;
      });

      console.log(
        "ChatRepository: findByUserAndRole - Enhanced chats prepared",
        {
          chatCount: enhancedChats.length,
        }
      );

      return enhancedChats;
    } catch (error: any) {
      console.error("ChatRepository: findByUserAndRole error", {
        userId,
        role,
        error: error.message,
      });
      throw new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to find chats",
        error.message
      );
    }
  }
  async findByBookingId(bookingId: string): Promise<EChat | null> {
    try {
      console.log("CHAT REPOSITORY findByBookingId step 1");
      const chat = await Chat.findOne({ bookingId })
        .populate("users", "firstName lastName profilePicture")
        .populate("latestMessage");
      console.log("CHAT REPOSITORY findByBookingId step 2");
      return chat as unknown as EChat | null;
    } catch (error: any) {
      throw new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to find chat",
        error.message
      );
    }
  }
  async updateByBookingId(
    bookingId: string,
    isActive: boolean
  ): Promise<EChat | null> {
    try {
      console.log(
        "Chatrepository updateByBookingId step 1 bookingId",
        bookingId
      );
      console.log("Chatrepository updateByBookingId step 2 isActive", isActive);
      const chat = await Chat.findOneAndUpdate(
        { bookingId },
        { $set: { isActive } },
        { new: true } // Return the updated document
      ).exec();
      console.log("Chatrepository updateByBookingId step 3 chat");
      // if (!chat) {
      //   throw new ApiError(404, "Chat not found for the provided booking ID");
      // }

      return chat as EChat;
    } catch (error: any) {
      throw new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to update chat",
        process.env.NODE_ENV === "development" ? error.message : undefined
      );
    }
  }
  async findByUsersAndRoles(
    menteeId: string,
    mentorId: string
  ): Promise<EChat | null> {
    try {
      console.log("CHAT REPOSITORY findByUsersAndRoles step 1", {
        menteeId,
        mentorId,
      });
      const chat = await Chat.findOne({
        roles: {
          $all: [
            { $elemMatch: { userId: menteeId, role: "mentee" } },
            { $elemMatch: { userId: mentorId, role: "mentor" } },
          ],
        },
      })
        .populate("users", "firstName lastName profilePicture")
        .populate("latestMessage");
      console.log("CHAT REPOSITORY findByUsersAndRoles step 2", chat);
      return chat as unknown as EChat | null;
    } catch (error: any) {
      throw new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to find chat by users and roles",
        error.message
      );
    }
  }
  async updateByUsersAndRoles(
    menteeId: string,
    mentorId: string,
    update: { isActive: boolean; bookingId: string }
  ): Promise<EChat | null> {
    try {
      console.log("CHAT REPOSITORY updateByUsersAndRoles step 1", {
        menteeId,
        mentorId,
        update,
      });
      const chat = await Chat.findOneAndUpdate(
        {
          roles: {
            $all: [
              { $elemMatch: { userId: menteeId, role: "mentee" } },
              { $elemMatch: { userId: mentorId, role: "mentor" } },
            ],
          },
        },
        { $set: { isActive: update.isActive, bookingId: update.bookingId } },
        { new: true }
      )
        .populate("users", "firstName lastName profilePicture")
        .populate("latestMessage");
      console.log("CHAT REPOSITORY updateByUsersAndRoles step 2", chat);
      if (!chat) {
        throw new ApiError(
          HttpStatus.NOT_FOUND,
          "Chat not found for the provided users and roles"
        );
      }
      return chat as unknown as EChat;
    } catch (error: any) {
      throw new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to update chat",
        error.message
      );
    }
  }
}
