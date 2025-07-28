import Chat from "../../models/chatModel";
import Message from "../../models/messageModel";
import BaseRepository from "./BaseRepository";
import { EChat } from "../../entities/chatEntity";
import { IChatRepository } from "../interface/IChatRepository";
import mongoose from "mongoose";

export default class ChatRepository
  extends BaseRepository<EChat>
  implements IChatRepository
{
  constructor() {
    super(Chat);
  }
  async create(data: Partial<EChat>): Promise<EChat> {
    try {
      console.log("=========ChatRepository create step 1", data);

      const chat = new Chat(data);
      return (await chat.save()) as EChat;
    } catch (error: any) {
      throw new Error("Failed to create chat", error.message);
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
      throw new Error("Failed to find chat", error.message);
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
      throw new Error("Failed to update chat", error.message);
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
      throw new Error("Failed to find chats", error.message);
    }
  }

  async getUnreadChatCountByRole(
    userId: string,
    role: "mentee" | "mentor"
  ): Promise<number> {
    try {
      console.log("📊 ChatRepository: getUnreadChatCountByRole start", {
        userId,
        role,
        timestamp: new Date().toISOString(),
      });

      // 🔧 CRITICAL FIX: Convert string userId to ObjectId
      const userObjectId = new mongoose.Types.ObjectId(userId);

      // ✅ STEP 1: Get all chats for this user and role
      const chats = await Chat.find({
        "roles.userId": userObjectId,
        "roles.role": role,
      }).select("_id");

      if (chats.length === 0) {
        console.log(
          "📊 ChatRepository: getUnreadChatCountByRole - No chats found",
          { userId, role }
        );
        return 0;
      }

      const chatIds = chats.map((chat) => chat._id);
      console.log("📊 ChatRepository: Found chats for user", {
        userId,
        role,
        totalChats: chats.length,
        chatIds: chatIds.map((id) => id.toString()),
      });

      // ✅ ENHANCED: More comprehensive aggregation with debugging
      const pipeline = [
        {
          $match: {
            chat: { $in: chatIds },
            sender: { $ne: userObjectId }, // Messages not sent by this user
          },
        },
        {
          $group: {
            _id: "$chat", // Group by chat
            messages: {
              $push: {
                messageId: "$_id",
                status: "$status",
                readBy: "$readBy",
                sender: "$sender",
                createdAt: "$createdAt",
              },
            },
            totalMessages: { $sum: 1 },
            // ✅ Count unread messages using BOTH status and readBy
            unreadByReadBy: {
              $sum: {
                $cond: [{ $not: { $in: [userObjectId, "$readBy"] } }, 1, 0],
              },
            },
            unreadByStatus: {
              $sum: {
                $cond: [{ $in: ["$status", ["sent", "delivered"]] }, 1, 0],
              },
            },
            // ✅ MOST ACCURATE: Combine both conditions
            unreadCombined: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $not: { $in: [userObjectId, "$readBy"] } },
                      { $in: ["$status", ["sent", "delivered"]] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $match: {
            // ✅ FIX: Use the most accurate count (both conditions must be true)
            unreadCombined: { $gt: 0 },
          },
        },
        {
          $addFields: {
            chatId: "$_id",
          },
        },
      ];

      const unreadChatsAnalysis = await Message.aggregate(pipeline);

      // ✅ ENHANCED DEBUGGING: Log detailed analysis for each chat
      console.log("📊 ChatRepository: Unread analysis per chat", {
        userId,
        role,
        totalChatsAnalyzed: unreadChatsAnalysis.length,
        timestamp: new Date().toISOString(),
      });

      unreadChatsAnalysis.forEach((chat, index) => {
        console.log(`📊 Chat ${index + 1} analysis:`, {
          chatId: chat.chatId.toString(),
          userId,
          totalMessages: chat.totalMessages,
          unreadByReadBy: chat.unreadByReadBy,
          unreadByStatus: chat.unreadByStatus,
          unreadCombined: chat.unreadCombined, // This is the most accurate
          // Sample messages for debugging
          sampleMessages: chat.messages.slice(0, 3).map((msg: any) => ({
            id: msg.messageId.toString(),
            status: msg.status,
            isReadByUser: msg.readBy.some(
              (id: any) => id.toString() === userId
            ),
            readByCount: msg.readBy.length,
          })),
        });
      });

      const finalCount = unreadChatsAnalysis.length;

      // ✅ COMPARISON: Also get the old method result for comparison
      const oldMethodResult = await Message.aggregate([
        {
          $match: {
            chat: { $in: chatIds },
            sender: { $ne: userObjectId },
            readBy: { $nin: [userObjectId] },
          },
        },
        {
          $group: {
            _id: "$chat",
          },
        },
        {
          $count: "unreadChats",
        },
      ]);

      const oldCount =
        oldMethodResult.length > 0 ? oldMethodResult[0].unreadChats : 0;

      console.log("📊 ChatRepository: getUnreadChatCountByRole comparison", {
        userId,
        role,
        totalChats: chats.length,
        newMethodCount: finalCount,
        oldMethodCount: oldCount,
        difference: finalCount - oldCount,
        timestamp: new Date().toISOString(),
      });

      // ✅ ALERT: Log if there's a difference between methods
      if (finalCount !== oldCount) {
        console.warn("⚠️ ChatRepository: Count discrepancy detected!", {
          userId,
          role,
          newMethod: finalCount,
          oldMethod: oldCount,
          possibleCause:
            "Messages with status='read' but user not in readBy array",
          recommendation: "Check markAsReadByUserWithStatus implementation",
        });

        // ✅ DEEP DIVE: Find the problematic messages
        const problematicMessages = await Message.find({
          chat: { $in: chatIds },
          sender: { $ne: userObjectId },
          $or: [
            // Messages that are read status but user not in readBy
            {
              status: "read",
              readBy: { $nin: [userObjectId] },
            },
            // Messages that have user in readBy but status is not read
            {
              readBy: { $in: [userObjectId] },
              status: { $in: ["sent", "delivered"] },
            },
          ],
        }).select("_id chat status readBy sender createdAt");

        console.log("🔍 ChatRepository: Problematic messages found", {
          userId,
          count: problematicMessages.length,
          messages: problematicMessages.map((msg) => ({
            id: msg._id.toString(),
            chat: msg.chat.toString(),
            status: msg.status,
            readBy: msg.readBy.map((id) => id.toString()),
            hasUserInReadBy: msg.readBy.some((id) => id.toString() === userId),
          })),
        });
      }

      console.log("📊 ChatRepository: getUnreadChatCountByRole final result", {
        userId,
        role,
        unreadChatsCount: finalCount,
        method: "enhanced_with_status_and_readby",
        timestamp: new Date().toISOString(),
      });

      return finalCount;
    } catch (error: any) {
      console.error("📊 ChatRepository: getUnreadChatCountByRole error", {
        userId,
        role,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to get unread chat count: " + error.message);
    }
  }
  async debugUnreadCountIssues(
    userId: string,
    role: "mentor" | "mentee"
  ): Promise<void> {
    try {
      console.log("🔍 ChatRepository: debugUnreadCountIssues start", {
        userId,
        role,
        timestamp: new Date().toISOString(),
      });

      const userObjectId = new mongoose.Types.ObjectId(userId);

      // Get all chats for this user
      const chats = await Chat.find({
        "roles.userId": userObjectId,
        "roles.role": role,
      }).select("_id users roles");

      console.log("🔍 Debug: User's chats", {
        userId,
        role,
        chatCount: chats.length,
        chats: chats.map((c) => ({
          id: c._id.toString(),
          users: c.users.map((u) => u.toString()),
          roles: c.roles,
        })),
      });

      for (const chat of chats) {
        console.log(`\n🔍 === ANALYZING CHAT ${chat._id} ===`);

        // Get all messages in this chat
        const messages = await Message.find({ chat: chat._id }).sort({
          createdAt: 1,
        });

        console.log("🔍 Chat messages overview", {
          chatId: chat._id.toString(),
          totalMessages: messages.length,
          messagesByStatus: messages.reduce((acc: any, msg: any) => {
            acc[msg.status] = (acc[msg.status] || 0) + 1;
            return acc;
          }, {}),
        });

        // Analyze each message
        const messagesFromOthers = messages.filter(
          (msg) => msg.sender.toString() !== userId
        );

        console.log("🔍 Messages from others analysis", {
          chatId: chat._id.toString(),
          messagesFromOthers: messagesFromOthers.length,
          breakdown: messagesFromOthers.map((msg) => ({
            id: msg._id.toString(),
            status: msg.status,
            readBy: msg.readBy.map((id) => id.toString()),
            isReadByCurrentUser: msg.readBy.some(
              (id) => id.toString() === userId
            ),
            sender: msg.sender.toString(),
            createdAt: msg.createdAt,
            // Determine if this should count as unread
            shouldCountAsUnread:
              !msg.readBy.some((id) => id.toString() === userId) &&
              ["sent", "delivered"].includes(msg.status),
          })),
        });

        // Count unread by different methods
        const unreadByReadByOnly = messagesFromOthers.filter(
          (msg) => !msg.readBy.some((id) => id.toString() === userId)
        ).length;

        const unreadByStatusOnly = messagesFromOthers.filter((msg) =>
          ["sent", "delivered"].includes(msg.status)
        ).length;

        const unreadByCombined = messagesFromOthers.filter(
          (msg) =>
            !msg.readBy.some((id) => id.toString() === userId) &&
            ["sent", "delivered"].includes(msg.status)
        ).length;

        console.log("🔍 Chat unread count comparison", {
          chatId: chat._id.toString(),
          unreadByReadByOnly,
          unreadByStatusOnly,
          unreadByCombined,
          hasUnreadMessages: unreadByCombined > 0,
        });

        // Find inconsistent messages
        const inconsistentMessages = messagesFromOthers.filter((msg) => {
          const isReadByUser = msg.readBy.some(
            (id) => id.toString() === userId
          );
          const statusIsRead = msg.status === "read";

          // Message is inconsistent if:
          // 1. Status is 'read' but user not in readBy array, OR
          // 2. User in readBy array but status is not 'read'
          return (
            (statusIsRead && !isReadByUser) || (!statusIsRead && isReadByUser)
          );
        });

        if (inconsistentMessages.length > 0) {
          console.warn("⚠️ INCONSISTENT MESSAGES FOUND", {
            chatId: chat._id.toString(),
            count: inconsistentMessages.length,
            details: inconsistentMessages.map((msg) => ({
              id: msg._id.toString(),
              status: msg.status,
              readBy: msg.readBy.map((id) => id.toString()),
              hasUserInReadBy: msg.readBy.some(
                (id) => id.toString() === userId
              ),
              issue:
                msg.status === "read" &&
                !msg.readBy.some((id) => id.toString() === userId)
                  ? "Status is 'read' but user not in readBy array"
                  : "User in readBy array but status is not 'read'",
            })),
          });
        }
      }

      console.log("🔍 ChatRepository: debugUnreadCountIssues completed", {
        userId,
        role,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("🔍 ChatRepository: debugUnreadCountIssues error", {
        error: error.message,
        userId,
        role,
      });
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
      throw new Error("Failed to find chat", error.message);
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

      return chat as EChat;
    } catch (error: any) {
      throw new Error(
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
      throw new Error("Failed to find chat by users and roles", error.message);
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
        throw new Error("Chat not found for the provided users and roles");
      }
      return chat as unknown as EChat;
    } catch (error: any) {
      throw new Error("Failed to update chat", error.message);
    }
  }
}
