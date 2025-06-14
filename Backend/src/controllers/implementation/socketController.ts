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
      console.log("SocketController: getChatUsers start", {
        userId: req.user?.id,
        role: req.params.dashboard,
      });

      const userId = req.user?.id;
      const role = req.params.dashboard;

      if (!userId || !role) {
        console.error(
          "SocketController: getChatUsers - Missing userId or role",
          { userId, role }
        );
        throw new ApiError(
          401,
          "Unauthorized",
          "User ID and role are required"
        );
      }

      if (!["mentor", "mentee"].includes(role)) {
        console.error("SocketController: getChatUsers - Invalid role", {
          role,
        });
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
      console.log("SocketController: getChatUsers - Chats fetched", {
        chatCount: chats.length,
        chatIds: chats.map((c) => c._id.toString()),
      });

      const chatUsers = await Promise.all(
        chats.map(async (chat) => {
          const otherUser = chat.users.find((u) => u._id.toString() !== userId);
          if (!otherUser) {
            console.warn(
              "SocketController: getChatUsers - No other user found",
              {
                chatId: chat._id.toString(),
                userId,
              }
            );
            return null;
          }

          // Use otherUserId from chat to check online status via Redis
          const otherUserId = chat.otherUserId;
          let isOnline = false;
          if (otherUserId) {
            try {
              const isOnline = await this.chatService.getUserOnlineStatus(
                otherUserId
              );
              console.log(
                "SocketController: getChatUsers - Online status checked",
                {
                  chatId: chat._id.toString(),
                  otherUserId,
                  isOnline,
                }
              );
            } catch (error: any) {
              console.error(
                "SocketController: getChatUsers - Online status check failed",
                {
                  chatId: chat._id.toString(),
                  otherUserId,
                  error: error.message,
                }
              );
            }
          } else {
            console.warn("SocketController: getChatUsers - No otherUserId", {
              chatId: chat._id.toString(),
            });
          }

          const userData = {
            id: chat._id.toString(),
            name: otherUser
              ? `${otherUser.firstName} ${otherUser.lastName}`
              : "Unknown",
            avatar: otherUser?.profilePicture || "",
            bookingId: chat.bookingId?.toString() || "",
            lastMessage: chat.latestMessage?.content || "",
            timestamp: chat.latestMessage?.createdAt || chat.updatedAt,
            unread:
              chat.latestMessage && !chat.latestMessage.readBy.includes(userId)
                ? 1
                : 0,
            isOnline,
            isActive: chat.isActive,
            otherUserId: otherUserId || "", // Optional: Include for frontend
          };

          console.log("SocketController: getChatUsers - User data prepared", {
            chatId: chat._id.toString(),
            userData,
          });

          return userData;
        })
      );

      const filteredUsers = chatUsers.filter(Boolean);
      console.log("SocketController: getChatUsers - Sending response", {
        userCount: filteredUsers.length,
      });

      res.json(
        new ApiResponse(200, filteredUsers, "Chat users fetched successfully")
      );
    } catch (error: any) {
      console.error("SocketController: getChatUsers error", {
        userId: req.user?.id,
        role: req.params.dashboard,
        error: error.message,
      });
      next(error);
    }
  }
  async getUserOnlineStatus(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("SocketController: getUserOnlineStatus start", {
        userId: req.params.userId,
      });

      const userId = req.params.userId;
      if (!userId) {
        console.error("SocketController: getUserOnlineStatus - Missing userId");
        throw new ApiError(400, "Bad Request", "User ID is required");
      }

      const isOnline = await this.chatService.getUserOnlineStatus(userId);
      console.log("SocketController: getUserOnlineStatus - Status fetched", {
        userId,
        isOnline,
      });

      res.json(
        new ApiResponse(200, { isOnline }, "Online status fetched successfully")
      );
    } catch (error) {
      console.error("SocketController: getUserOnlineStatus error", {
        userId: req.params.userId,
        error: error.message,
      });
      next(error);
    }
  }
}

export default new SocketController();
