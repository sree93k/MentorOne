import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../middlewares/errorHandler";
import ApiResponse from "../../utils/apiResponse";
import ChatService from "../../services/implementations/ChatService";
import MessageService from "../../services/implementations/MessageService";
import VideoCallService from "../../services/implementations/VideoCallService";
import { IChatService } from "../../services/interface/IChatService";
import { IMessageService } from "../../services/interface/IMessageService";
import { IVideoCallService } from "../../services/interface/IVideoCallService";
import { HttpStatus } from "../../constants/HttpStatus";

interface AuthUser {
  id: string;
}

interface ChatUserResponse {
  id: string;
  name: string;
  avatar: string;
  bookingId: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  isOnline: boolean;
  isActive: boolean;
  otherUserId: string;
}

class SocketController {
  private chatService: IChatService;
  private messageService: IMessageService;
  private videoCallService: IVideoCallService;

  constructor() {
    this.chatService = new ChatService();
    this.messageService = new MessageService();
    this.videoCallService = new VideoCallService();
  }

  public getChatUsers = async (
    req: Request & { user?: AuthUser },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("SocketController getChatUsers step 1", {
        userId: req.user?.id,
        role: req.params.dashboard,
      });

      const userId = req.user?.id;
      const role = req.params.dashboard;

      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }
      if (!role || !["mentor", "mentee"].includes(role)) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Invalid or missing role; must be 'mentor' or 'mentee'"
        );
      }

      const chats = await this.chatService.getChatsByUserAndRole(
        userId,
        role as "mentee" | "mentor"
      );
      console.log("SocketController getChatUsers step 2", {
        chatCount: chats.length,
        chatIds: chats.map((c) => c._id.toString()),
      });

      const chatUsers: ChatUserResponse[] = (
        await Promise.all(
          chats.map(async (chat) => {
            const otherUser = chat.users.find(
              (u) => u._id.toString() !== userId
            );
            if (!otherUser) {
              console.warn(
                "SocketController getChatUsers - No other user found",
                {
                  chatId: chat._id.toString(),
                  userId,
                }
              );
              return null;
            }

            const otherUserId = chat.otherUserId;
            let isOnline = false;
            if (otherUserId) {
              try {
                isOnline = await this.chatService.getUserOnlineStatus(
                  otherUserId
                );
                console.log(
                  "SocketController getChatUsers - Online status checked",
                  {
                    chatId: chat._id.toString(),
                    otherUserId,
                    isOnline,
                  }
                );
              } catch (error: any) {
                console.error(
                  "SocketController getChatUsers - Online status check failed",
                  {
                    chatId: chat._id.toString(),
                    otherUserId,
                    error: error.message,
                  }
                );
              }
            } else {
              console.warn("SocketController getChatUsers - No otherUserId", {
                chatId: chat._id.toString(),
              });
            }

            return {
              id: chat._id.toString(),
              name:
                `${otherUser.firstName} ${otherUser.lastName}`.trim() ||
                "Unknown",
              avatar: otherUser.profilePicture || "",
              bookingId: chat.bookingId?.toString() || "",
              lastMessage: chat.latestMessage?.content || "",
              timestamp: chat.latestMessage?.createdAt || chat.updatedAt,
              unread:
                chat.latestMessage &&
                !chat.latestMessage.readBy.includes(userId)
                  ? 1
                  : 0,
              isOnline,
              isActive: chat.isActive,
              otherUserId: otherUserId || "",
            };
          })
        )
      ).filter((user): user is ChatUserResponse => user !== null);

      console.log("SocketController getChatUsers step 3", {
        userCount: chatUsers.length,
      });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            chatUsers,
            "Chat users fetched successfully"
          )
        );
    } catch (error) {
      console.error("Error in getChatUsers:", error);
      next(error);
    }
  };

  // NEW: Get chat unread counts
  public getChatUnreadCounts = async (
    req: Request & { user?: AuthUser },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      console.log("SocketController getChatUnreadCounts start", { userId });

      const [mentorUnreadChats, menteeUnreadChats] = await Promise.all([
        this.chatService.getUnreadChatCount(userId, "mentor"),
        this.chatService.getUnreadChatCount(userId, "mentee"),
      ]);

      console.log("SocketController getChatUnreadCounts result", {
        userId,
        mentorUnreadChats,
        menteeUnreadChats,
      });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { mentorUnreadChats, menteeUnreadChats },
            "Chat unread counts fetched successfully"
          )
        );
    } catch (error) {
      console.error("Error in getChatUnreadCounts:", error);
      next(error);
    }
  };

  // ✅ NEW: Mark specific chat as read
  public markChatAsRead = async (
    req: Request & { user?: AuthUser },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { chatId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User not authenticated");
      }

      if (!chatId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Chat ID is required");
      }

      console.log("SocketController markChatAsRead start", { chatId, userId });

      const markedCount = await this.messageService.markMessagesAsRead(
        chatId,
        userId
      );

      console.log("SocketController markChatAsRead result", {
        chatId,
        userId,
        markedCount,
      });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { markedCount },
            "Messages marked as read successfully"
          )
        );
    } catch (error) {
      console.error("Error in markChatAsRead:", error);
      next(error);
    }
  };

  // ✅ NEW: Get unread count for specific chat
  public getChatUnreadMessageCount = async (
    req: Request & { user?: AuthUser },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { chatId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User not authenticated");
      }

      if (!chatId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Chat ID is required");
      }

      console.log("SocketController getChatUnreadMessageCount start", {
        chatId,
        userId,
      });

      const unreadCount = await this.messageService.getUnreadMessageCount(
        chatId,
        userId
      );

      console.log("SocketController getChatUnreadMessageCount result", {
        chatId,
        userId,
        unreadCount,
      });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { unreadCount },
            "Unread count retrieved successfully"
          )
        );
    } catch (error) {
      console.error("Error in getChatUnreadMessageCount:", error);
      next(error);
    }
  };

  public getUserOnlineStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "User ID is required");
      }
      console.log("SocketController getUserOnlineStatus step 1", { userId });

      const isOnline = await this.chatService.getUserOnlineStatus(userId);
      console.log("SocketController getUserOnlineStatus step 2", {
        userId,
        isOnline,
      });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { isOnline },
            "Online status fetched successfully"
          )
        );
    } catch (error) {
      console.error("Error in getUserOnlineStatus:", error);
      next(error);
    }
  };
}

export default new SocketController();
