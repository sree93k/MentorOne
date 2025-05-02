import mongoose from "mongoose";
import Chat from "../../models/chatModel";
import { ApiError } from "../../middlewares/errorHandler";

export default class ChatRepository {
  async create(data: any) {
    try {
      const chat = new Chat(data);
      return await chat.save();
    } catch (error: any) {
      throw new ApiError(500, "Failed to create chat", error.message);
    }
  }

  async findById(id: string) {
    try {
      return await Chat.findById(id)
        .populate("users", "firstName lastName profilePicture")
        .populate("latestMessage");
    } catch (error: any) {
      throw new ApiError(500, "Failed to find chat", error.message);
    }
  }

  async findByIdAndUpdate(id: string, update: any) {
    try {
      return await Chat.findByIdAndUpdate(id, update, { new: true })
        .populate("users", "firstName lastName profilePicture")
        .populate("latestMessage");
    } catch (error: any) {
      throw new ApiError(500, "Failed to update chat", error.message);
    }
  }

  async findByUserAndRole(userId: string, role: "mentee" | "mentor") {
    try {
      return await Chat.find({
        "roles.userId": userId,
        "roles.role": role,
      })
        .populate("users", "firstName lastName profilePicture")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });
    } catch (error: any) {
      throw new ApiError(500, "Failed to find chats", error.message);
    }
  }

  async findByBookingId(bookingId: string) {
    try {
      return await Chat.findOne({ bookingId })
        .populate("users", "firstName lastName profilePicture")
        .populate("latestMessage");
    } catch (error: any) {
      throw new ApiError(500, "Failed to find chat", error.message);
    }
  }
}
