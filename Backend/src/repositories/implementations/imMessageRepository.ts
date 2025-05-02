import mongoose from "mongoose";
import Message from "../../models/messageModel";
import { ApiError } from "../../middlewares/errorHandler";

export default class MessageRepository {
  async create(data: any) {
    try {
      const message = new Message(data);
      return await message.save();
    } catch (error: any) {
      throw new ApiError(500, "Failed to create message", error.message);
    }
  }

  async findByChatId(chatId: string) {
    try {
      return await Message.find({ chat: chatId })
        .populate("sender", "firstName lastName profilePicture")
        .populate("readBy", "firstName lastName")
        .sort({ createdAt: 1 });
    } catch (error: any) {
      throw new ApiError(500, "Failed to find messages", error.message);
    }
  }

  async markAsRead(chatId: string, userId: string) {
    try {
      return await Message.updateMany(
        { chat: chatId, readBy: { $ne: userId } },
        { $addToSet: { readBy: userId } }
      );
    } catch (error: any) {
      throw new ApiError(500, "Failed to mark messages as read", error.message);
    }
  }
}
