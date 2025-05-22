import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../middlewares/errorHandler";
import ApiResponse from "../../utils/apiResponse";
import ChatService from "../../services/implementations/ChatService";
import VideoCallService from "../../services/implementations/VideoCallService";
import { IChatService } from "../../services/interface/IChatService";
import { IVideoCallService } from "../../services/interface/IVideoCallService";
import mongoose from "mongoose";

class SocketController {
  private chatService: IChatService;
  private videoCallService: IVideoCallService;

  constructor() {
    this.chatService = new ChatService();
    this.videoCallService = new VideoCallService();
  }

  async getChatUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const role = req.params.dashboard;

      if (!userId || !role) {
        throw new ApiError(
          401,
          "Unauthorized",
          "User ID and role are required"
        );
      }

      if (!["mentor", "mentee"].includes(role)) {
        throw new ApiError(
          400,
          "Invalid dashboard",
          "Dashboard must be 'mentor' or 'mentee'"
        );
      }

      const chats = await this.chatService.getChatsByUserAndRole(
        userId,
        role as "mentee" | "mentor"
      );
      const chatUsers = await Promise.all(
        chats.map(async (chat) => {
          const otherUser = chat.users.find((u) => u._id.toString() !== userId);
          if (!otherUser) return null;

          let isOnline = false;
          const otherUserRole = chat.roles.find(
            (r) => r.userId.toString() === otherUser._id.toString()
          )?.role;
          if (otherUserRole === "mentor") {
            const mentor = await mongoose
              .model("Mentor")
              .findById(otherUser._id);
            isOnline = mentor?.isOnline || false;
          } else if (otherUserRole === "mentee") {
            const mentee = await mongoose
              .model("Mentee")
              .findById(otherUser._id);
            isOnline = mentee?.isOnline || false;
          }

          return {
            id: chat._id,
            name: otherUser
              ? `${otherUser.firstName} ${otherUser.lastName}`
              : "Unknown",
            avatar: otherUser?.profilePicture || "",
            bookingId: chat.bookingId,
            lastMessage: chat.latestMessage?.content || "",
            timestamp: chat.latestMessage?.createdAt || chat.updatedAt,
            unread:
              chat.latestMessage && !chat.latestMessage.readBy.includes(userId)
                ? 1
                : 0,
            isOnline,
          };
        })
      );

      res.json(
        new ApiResponse(
          200,
          chatUsers.filter(Boolean),
          "Chat users fetched successfully"
        )
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new SocketController();
