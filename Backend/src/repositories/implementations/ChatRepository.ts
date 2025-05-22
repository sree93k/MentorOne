import mongoose from "mongoose";
import Chat from "../../models/chatModel";
import { ApiError } from "../../middlewares/errorHandler";
import { EChat } from "../../entities/chatEntity";

export default class ChatRepository {
  async create(data: Partial<EChat>): Promise<EChat> {
    try {
      const chat = new Chat(data);
      return (await chat.save()) as EChat;
    } catch (error: any) {
      throw new ApiError(500, "Failed to create chat", error.message);
    }
  }

  async findById(id: string): Promise<EChat | null> {
    try {
      const chat = await Chat.findById(id)
        .populate("users", "firstName lastName profilePicture")
        .populate("latestMessage");

      return chat as unknown as EChat | null;
    } catch (error: any) {
      throw new ApiError(500, "Failed to find chat", error.message);
    }
  }

  async findByIdAndUpdate(
    id: string,
    update: Partial<EChat>
  ): Promise<EChat | null> {
    try {
      const chat = await Chat.findByIdAndUpdate(id, update, { new: true })
        .populate("users", "firstName lastName profilePicture")
        .populate("latestMessage");

      return chat as unknown as EChat | null;
    } catch (error: any) {
      throw new ApiError(500, "Failed to update chat", error.message);
    }
  }

  async findByUserAndRole(
    userId: string,
    role: "mentee" | "mentor"
  ): Promise<EChat[]> {
    try {
      const chats = await Chat.find({
        "roles.userId": userId,
        "roles.role": role,
      })
        .populate("users", "firstName lastName profilePicture")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });

      return chats as unknown as EChat[];
    } catch (error: any) {
      throw new ApiError(500, "Failed to find chats", error.message);
    }
  }

  async findByBookingId(bookingId: string): Promise<EChat | null> {
    try {
      const chat = await Chat.findOne({ bookingId })
        .populate("users", "firstName lastName profilePicture")
        .populate("latestMessage");

      return chat as unknown as EChat | null;
    } catch (error: any) {
      throw new ApiError(500, "Failed to find chat", error.message);
    }
  }
}
