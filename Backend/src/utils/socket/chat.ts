// import { Server, Socket } from "socket.io";
// import { createClient } from "@redis/client";
// import { verifyAccessToken } from "../../utils/jwt";
// import ChatService from "../../services/implementations/ChatService";
// import MessageService from "../../services/implementations/MessageService";
// import UserRepository from "../../repositories/implementations/UserRepository";

// interface UserPayload {
//   id: string;
//   role: string[];
// }

// interface CustomSocket extends Socket {
//   data: {
//     user?: UserPayload;
//   };
// }

// // 🎯 FIXED: 3-second timeout typing state management
// interface TypingUser {
//   userId: string;
//   userName: string;
//   timestamp: number;
//   timeoutId?: NodeJS.Timeout; // Track individual timeouts
// }

// interface TypingState {
//   [chatId: string]: {
//     [userId: string]: TypingUser;
//   };
// }
// interface UserPresence {
//   userId: string;
//   isOnline: boolean;
//   activeChatId?: string;
//   socketId: string;
//   lastSeen: Date;
// }

// const userPresence = new Map<string, UserPresence>();
// export const initializeChatSocket = async (chatNamespace: Server) => {
//   console.log("🔌 ChatSocket: Initializing Socket.IO /chat namespace");

//   const chatService = new ChatService();
//   const messageService = new MessageService();
//   const userRepository = new UserRepository();

//   // 🎯 FIXED: Better typing state management
//   const typingStates: TypingState = {};

//   // 🎯 NEW: Check if user is online via Redis/socket connection
//   const isUserOnline = async (userId: string): Promise<boolean> => {
//     try {
//       const onlineUsers = await chatNamespace.in("online_users").allSockets();
//       const userSockets = await chatNamespace.in(`user_${userId}`).allSockets();
//       return userSockets.size > 0;
//     } catch (error) {
//       console.error("Error checking user online status:", error);
//       return false;
//     }
//   };

//   chatNamespace.use((socket: CustomSocket, next: (err?: Error) => void) => {
//     // Authentication middleware remains the same...
//     const cookieHeader = socket.handshake.headers.cookie;
//     if (!cookieHeader) {
//       return next(new Error("Authentication error: No cookies provided"));
//     }

//     const cookies = cookieHeader
//       .split(";")
//       .reduce((acc: Record<string, string>, cookie) => {
//         const [name, value] = cookie.trim().split("=");
//         acc[name] = value;
//         return acc;
//       }, {});

//     const token = cookies.accessToken;
//     if (!token) {
//       return next(new Error("Authentication error: No accessToken provided"));
//     }

//     try {
//       const decoded = verifyAccessToken(token) as UserPayload;
//       socket.data.user = decoded;
//       next();
//     } catch (error: any) {
//       next(new Error(`Authentication error: ${error.message}`));
//     }
//   });

//   chatNamespace.on("connection", async (socket: CustomSocket) => {
//     const userId = socket.data.user?.id;
//     const roles = socket.data.user?.role;

//     if (!userId || !roles || !Array.isArray(roles)) {
//       return socket.disconnect();
//     }

//     console.log("💬 ChatSocket: User connected", {
//       userId,
//       socketId: socket.id,
//     });

//     // Join user-specific room for online status tracking
//     socket.join(`user_${userId}`);
//     socket.join("online_users");

//     // 🎯 FIXED: 3-second timeout typing handlers
//     socket.on("userTyping", ({ chatId, userName }) => {
//       console.log("🎯 ChatSocket: userTyping received", {
//         userId,
//         chatId,
//         userName,
//         timestamp: new Date().toISOString(),
//       });

//       // Initialize typing state for chat if needed
//       if (!typingStates[chatId]) {
//         typingStates[chatId] = {};
//       }

//       // Clear existing timeout for this user if any
//       if (typingStates[chatId][userId]?.timeoutId) {
//         clearTimeout(typingStates[chatId][userId].timeoutId);
//       }

//       // Set new typing state with 3-second timeout
//       const timeoutId = setTimeout(() => {
//         console.log("🎯 ChatSocket: Typing timeout reached", {
//           userId,
//           chatId,
//         });

//         // Remove from typing state
//         if (typingStates[chatId] && typingStates[chatId][userId]) {
//           delete typingStates[chatId][userId];

//           // Clean up empty chat states
//           if (Object.keys(typingStates[chatId]).length === 0) {
//             delete typingStates[chatId];
//           }

//           // Emit stop typing
//           socket.to(`chat_${chatId}`).emit("userStoppedTyping", {
//             userId,
//             userName,
//             chatId,
//           });

//           console.log("🎯 ChatSocket: Auto-emitted userStoppedTyping", {
//             userId,
//             chatId,
//           });
//         }
//       }, 3000); // 🎯 FIXED: 3 seconds instead of 15

//       // Update typing state
//       typingStates[chatId][userId] = {
//         userId,
//         userName: userName || "User",
//         timestamp: Date.now(),
//         timeoutId,
//       };

//       // Emit to other users in chat
//       socket.to(`chat_${chatId}`).emit("userTyping", {
//         userId,
//         userName: userName || "User",
//         chatId,
//       });

//       console.log("🎯 ChatSocket: Emitted userTyping with 3s timeout", {
//         userId,
//         chatId,
//       });
//     });

//     socket.on("userStoppedTyping", ({ chatId }) => {
//       console.log("🎯 ChatSocket: userStoppedTyping received", {
//         userId,
//         chatId,
//       });

//       // Clear timeout and remove from state
//       if (typingStates[chatId] && typingStates[chatId][userId]) {
//         const typingUser = typingStates[chatId][userId];

//         // Clear the timeout
//         if (typingUser.timeoutId) {
//           clearTimeout(typingUser.timeoutId);
//         }

//         // Remove from state
//         delete typingStates[chatId][userId];

//         // Clean up empty chat states
//         if (Object.keys(typingStates[chatId]).length === 0) {
//           delete typingStates[chatId];
//         }

//         // Emit to other users
//         socket.to(`chat_${chatId}`).emit("userStoppedTyping", {
//           userId,
//           userName: typingUser.userName,
//           chatId,
//         });

//         console.log("🎯 ChatSocket: Emitted userStoppedTyping", {
//           userId,
//           chatId,
//         });
//       }
//     });

//     // 🎯 ENHANCED: Send message with proper status management
//     socket.on(
//       "sendMessage",
//       async ({ chatId, content, type = "text" }, callback) => {
//         console.log("📤 ChatSocket: sendMessage received", {
//           chatId,
//           userId,
//           type,
//           timestamp: new Date().toISOString(),
//         });

//         try {
//           // 🎯 CRITICAL: Always start with "sent" status
//           const message = await messageService.sendMessage(
//             chatId,
//             userId,
//             content,
//             type
//           );

//           const populatedMessage = await messageService.getMessagesByChatId(
//             chatId
//           );
//           const latestMessage = populatedMessage[populatedMessage.length - 1];

//           // 🎯 ENHANCED: Include initial status in broadcast
//           const messageWithCorrectStatus = {
//             ...latestMessage,
//             status: message.status, // Use the actual database status
//           };

//           // Emit message to chat room
//           chatNamespace
//             .to(`chat_${chatId}`)
//             .emit("receiveMessage", messageWithCorrectStatus);

//           console.log("📤 ChatSocket: Emitted receiveMessage with status", {
//             messageId: message._id,
//             status: message.status,
//             chatId,
//           });

//           try {
//             const chat = await chatService.findChatById(chatId);
//             if (chat && chat.users) {
//               const otherUserIds = chat.users
//                 .map((user: any) => user._id?.toString() || user.toString())
//                 .filter((id: string) => id !== userId);

//               for (const otherUserId of otherUserIds) {
//                 const recipientPresence = userPresence.get(otherUserId);

//                 console.log("📨 ChatSocket: Checking recipient presence", {
//                   recipientId: otherUserId,
//                   isOnline: recipientPresence?.isOnline || false,
//                   activeChatId: recipientPresence?.activeChatId,
//                   currentChatId: chatId,
//                   messageId: message._id,
//                 });

//                 if (recipientPresence?.isOnline) {
//                   // Check if recipient has this chat actively open
//                   const isActivelyViewingChat =
//                     recipientPresence.activeChatId === chatId;

//                   if (isActivelyViewingChat) {
//                     // 🎯 INSTANT READ: Recipient is actively viewing this chat
//                     await messageService.updateMessageStatus(
//                       message._id.toString(),
//                       "read"
//                     );

//                     // Emit read confirmation immediately
//                     chatNamespace.to(`chat_${chatId}`).emit("messageRead", {
//                       messageId: message._id,
//                       chatId,
//                       userId: otherUserId,
//                     });

//                     console.log(
//                       "👁️ ChatSocket: Message auto-read (active chat)",
//                       {
//                         messageId: message._id,
//                         recipientId: otherUserId,
//                         activeChatId: recipientPresence.activeChatId,
//                       }
//                     );
//                   } else {
//                     // 🎯 DELIVERED: Recipient is online but chat not active
//                     await messageService.markMessageAsDelivered(
//                       message._id.toString(),
//                       true
//                     );

//                     // Emit delivery confirmation
//                     chatNamespace
//                       .to(`chat_${chatId}`)
//                       .emit("messageDelivered", {
//                         messageId: message._id,
//                         chatId,
//                       });

//                     console.log("📨 ChatSocket: Message marked as delivered", {
//                       messageId: message._id,
//                       recipientId: otherUserId,
//                       recipientOnline: true,
//                       chatActive: false,
//                     });
//                   }
//                 } else {
//                   // 🎯 SENT: Recipient is offline
//                   console.log(
//                     "📨 ChatSocket: Recipient offline, staying as sent",
//                     {
//                       messageId: message._id,
//                       recipientId: otherUserId,
//                     }
//                   );
//                 }
//               }
//             }
//           } catch (statusError: any) {
//             console.error(
//               "📨 ChatSocket: Error updating delivery/read status:",
//               statusError.message
//             );
//           }

//           // Update notification counts (existing logic)
//           try {
//             const chat = await chatService.findChatById(chatId);
//             if (chat && chat.users) {
//               const otherUserIds = chat.users
//                 .map((user: any) => user._id?.toString() || user.toString())
//                 .filter((id: string) => id !== userId);

//               for (const otherUserId of otherUserIds) {
//                 const userRole = chat.roles?.find(
//                   (r: any) => r.userId?.toString() === otherUserId
//                 )?.role;

//                 if (
//                   userRole &&
//                   (userRole === "mentor" || userRole === "mentee")
//                 ) {
//                   const unreadCount = await chatService.getUnreadChatCount(
//                     otherUserId,
//                     userRole
//                   );

//                   chatNamespace.emit("chatNotificationUpdate", {
//                     userId: otherUserId,
//                     role: userRole,
//                     count: unreadCount,
//                     chatId: chatId,
//                     senderId: userId,
//                   });
//                 }
//               }
//             }
//           } catch (countError: any) {
//             console.error(
//               "🔔 ChatSocket: Error updating notification counts:",
//               countError.message
//             );
//           }

//           callback({ success: true, message: latestMessage });
//         } catch (error: any) {
//           console.error("📤 ChatSocket: Error in sendMessage:", {
//             error: error.message,
//             chatId,
//             userId,
//             timestamp: new Date().toISOString(),
//           });

//           callback({ error: error.message });
//         }
//       }
//     );

//     socket.on("getChatHistory", async ({ chatId }, callback) => {
//       console.log("📨 ChatSocket: getChatHistory received", {
//         chatId,
//         userId,
//         timestamp: new Date().toISOString(),
//       });

//       try {
//         const messages = await messageService.getMessagesByChatId(chatId);

//         // 🎯 CRITICAL: Use ONLY database status, with comprehensive logging
//         const messagesWithDatabaseStatus = messages.map((msg: any) => {
//           const dbStatus = msg.status || "sent";

//           // 🎯 DEBUG: Log any messages without proper status
//           if (!msg.status) {
//             console.warn("📨 Message without status field:", {
//               messageId: msg._id,
//               defaultedTo: "sent",
//               sender: msg.sender?._id,
//               chatId,
//             });
//           }

//           return {
//             ...msg,
//             status: dbStatus, // Always use database status
//           };
//         });

//         console.log(
//           "📨 ChatSocket: Fetched chat history with database status",
//           {
//             chatId,
//             messageCount: messagesWithDatabaseStatus.length,
//             statusBreakdown: messagesWithDatabaseStatus.reduce(
//               (acc: any, msg: any) => {
//                 acc[msg.status] = (acc[msg.status] || 0) + 1;
//                 return acc;
//               },
//               {}
//             ),
//             timestamp: new Date().toISOString(),
//           }
//         );

//         callback({ success: true, messages: messagesWithDatabaseStatus });
//       } catch (error: any) {
//         console.error("📨 ChatSocket: Error fetching chat history:", {
//           error: error.message,
//           chatId,
//           userId,
//           timestamp: new Date().toISOString(),
//         });
//         callback({ error: error.message });
//       }
//     });

//     // 🎯 ENHANCED: markAsRead with proper status updates
//     socket.on("markAsRead", async ({ chatId }, callback) => {
//       console.log("🎯 ChatSocket: markAsRead received", {
//         chatId,
//         userId,
//         timestamp: new Date().toISOString(),
//       });

//       try {
//         // Mark messages as read (updates both readBy and status)
//         const markedCount = await messageService.markMessagesAsRead(
//           chatId,
//           userId
//         );

//         console.log("🎯 ChatSocket: Marked messages as read", {
//           chatId,
//           userId,
//           markedCount,
//           timestamp: new Date().toISOString(),
//         });

//         // Emit read confirmation to other users
//         chatNamespace
//           .to(`chat_${chatId}`)
//           .emit("messagesRead", { chatId, userId });

//         // Update notification counts
//         try {
//           const userRoles = roles || [];
//           for (const role of userRoles) {
//             if (role === "mentor" || role === "mentee") {
//               const unreadCount = await chatService.getUnreadChatCount(
//                 userId,
//                 role
//               );

//               chatNamespace.emit("chatNotificationUpdate", {
//                 userId: userId,
//                 role: role,
//                 count: unreadCount,
//                 chatId: chatId,
//               });
//             }
//           }
//         } catch (countError: any) {
//           console.error(
//             "🔔 ChatSocket: Error updating counts after read:",
//             countError.message
//           );
//         }

//         callback({ success: true, markedCount });
//       } catch (error: any) {
//         console.error("🎯 ChatSocket: Error marking messages as read:", {
//           error: error.message,
//           chatId,
//           userId,
//           timestamp: new Date().toISOString(),
//         });
//         callback({ error: error.message });
//       }
//     });

//     socket.on("chatOpened", async ({ chatId }, callback) => {
//       console.log("👁️ ChatSocket: chatOpened received", {
//         userId,
//         chatId,
//         timestamp: new Date().toISOString(),
//       });

//       try {
//         // Update user presence with active chat
//         const presence = userPresence.get(userId);
//         if (presence) {
//           presence.activeChatId = chatId;
//           userPresence.set(userId, presence);
//         }

//         // Mark delivered messages as read for this chat
//         const markedCount = await messageService.markMessagesAsRead(
//           chatId,
//           userId
//         );

//         console.log("👁️ ChatSocket: Chat opened, messages marked as read", {
//           userId,
//           chatId,
//           markedCount,
//           timestamp: new Date().toISOString(),
//         });

//         // Emit read confirmation to other users
//         if (markedCount > 0) {
//           chatNamespace
//             .to(`chat_${chatId}`)
//             .emit("messagesRead", { chatId, userId });
//         }

//         callback({ success: true, markedCount });
//       } catch (error: any) {
//         console.error("👁️ ChatSocket: Error handling chatOpened:", {
//           userId,
//           chatId,
//           error: error.message,
//         });
//         callback({ error: error.message });
//       }
//     });

//     // 🎯 NEW: Track when user closes a specific chat
//     socket.on("chatClosed", ({ chatId }, callback) => {
//       console.log("👁️ ChatSocket: chatClosed received", {
//         userId,
//         chatId,
//         timestamp: new Date().toISOString(),
//       });

//       try {
//         // Update user presence to remove active chat
//         const presence = userPresence.get(userId);
//         if (presence && presence.activeChatId === chatId) {
//           delete presence.activeChatId;
//           userPresence.set(userId, presence);
//         }

//         console.log("👁️ ChatSocket: Chat closed, stopped auto-read", {
//           userId,
//           chatId,
//         });

//         callback({ success: true });
//       } catch (error: any) {
//         console.error("👁️ ChatSocket: Error handling chatClosed:", {
//           userId,
//           chatId,
//           error: error.message,
//         });
//         callback({ error: error.message });
//       }
//     });

//     // 🎯 ENHANCED: Disconnect handler with typing cleanup
//     socket.on("disconnect", async () => {
//       console.log("💬 ChatSocket: User disconnected", {
//         userId,
//         socketId: socket.id,
//         timestamp: new Date().toISOString(),
//       });

//       try {
//         // 🎯 FIXED: Clean up all typing states for this user
//         Object.keys(typingStates).forEach((chatId) => {
//           if (typingStates[chatId] && typingStates[chatId][userId]) {
//             const typingUser = typingStates[chatId][userId];

//             // Clear timeout
//             if (typingUser.timeoutId) {
//               clearTimeout(typingUser.timeoutId);
//             }

//             // Remove from state
//             delete typingStates[chatId][userId];

//             // Emit stop typing to chat
//             socket.to(`chat_${chatId}`).emit("userStoppedTyping", {
//               userId,
//               userName: typingUser.userName,
//               chatId,
//             });

//             // Clean up empty chat states
//             if (Object.keys(typingStates[chatId]).length === 0) {
//               delete typingStates[chatId];
//             }

//             console.log(
//               "🎯 ChatSocket: Cleaned up typing state on disconnect",
//               {
//                 chatId,
//                 userId,
//               }
//             );
//           }
//         });

//         const presence = userPresence.get(userId);
//         if (presence) {
//           presence.isOnline = false;
//           presence.lastSeen = new Date();
//           delete presence.activeChatId; // Clear active chat
//           userPresence.set(userId, presence);
//         }

//         // Update online status in database
//         for (const role of roles) {
//           if (role === "mentor" || role === "mentee") {
//             await userRepository.updateOnlineStatus(userId, role, false);
//           }
//         }
//         // Remove from online tracking
//         socket.leave(`user_${userId}`);
//         socket.leave("online_users");

//         // Emit offline status
//         chatNamespace.emit("userStatus", { userId, roles, isOnline: false });

//         console.log("💬 ChatSocket: Cleanup completed on disconnect", {
//           userId,
//           presenceCleared: !!presence,
//         });
//       } catch (err: any) {
//         console.error("💬 ChatSocket: Error handling disconnect:", {
//           error: err.message,
//           userId,
//           timestamp: new Date().toISOString(),
//         });
//       }
//     });
//     socket.on("reconnecting", () => {
//       console.log("🔄 ChatSocket: User reconnecting", {
//         userId,
//         socketId: socket.id,
//         timestamp: new Date().toISOString(),
//       });

//       // Don't emit loading states to other users during reconnection
//       // Just log for debugging
//     });

//     socket.on("reconnect", async (attemptNumber) => {
//       console.log("🔄 ChatSocket: User reconnected", {
//         userId,
//         socketId: socket.id,
//         attemptNumber,
//         timestamp: new Date().toISOString(),
//       });

//       try {
//         // 🎯 SILENT SYNC: Update presence without notifying others
//         const presence = userPresence.get(userId);
//         if (presence) {
//           presence.isOnline = true;
//           presence.socketId = socket.id;
//           presence.lastSeen = new Date();
//           userPresence.set(userId, presence);
//         }

//         // Rejoin chat rooms silently
//         for (const role of roles) {
//           if (role === "mentor" || role === "mentee") {
//             const chats = await chatService.getChatsByUserAndRole(userId, role);
//             chats.forEach((chat) => {
//               socket.join(`chat_${chat._id}`);
//             });
//           }
//         }

//         console.log("✅ ChatSocket: Reconnection sync completed silently");
//       } catch (error: any) {
//         console.error("❌ ChatSocket: Error during reconnection sync:", {
//           error: error.message,
//           userId,
//         });
//       }
//     });

//     try {
//       // 🎯 NEW: Track user presence
//       userPresence.set(userId, {
//         userId,
//         isOnline: true,
//         socketId: socket.id,
//         lastSeen: new Date(),
//       });

//       // Update online status in database
//       for (const role of roles) {
//         if (role === "mentor" || role === "mentee") {
//           await userRepository.updateOnlineStatus(userId, role, true);

//           // Join relevant chat rooms
//           const chats = await chatService.getChatsByUserAndRole(userId, role);
//           chats.forEach((chat) => {
//             socket.join(`chat_${chat._id}`);
//           });

//           // 🎯 NEW: Mark pending messages as delivered when user comes online
//           await markPendingMessagesAsDelivered(userId, role);
//         }
//       }

//       // Emit online status
//       chatNamespace.emit("userStatus", { userId, roles, isOnline: true });

//       console.log("👤 User presence tracked:", {
//         userId,
//         isOnline: true,
//         socketId: socket.id,
//       });
//     } catch (err: any) {
//       console.error(
//         "💬 ChatSocket: Error in user initialization:",
//         err.message
//       );
//     }
//   });

//   console.log(
//     "✅ ChatSocket: Socket.IO chat namespace initialized successfully"
//   );
// };

// const markPendingMessagesAsDelivered = async (userId: string, role: string) => {
//   try {
//     console.log("📨 Marking pending messages as delivered for online user", {
//       userId,
//       role,
//       timestamp: new Date().toISOString(),
//     });

//     // 🎯 OPTIMIZED: Use bulk update method
//     const results = await messageService.bulkUpdateMessageStatusesOnUserOnline(
//       userId,
//       role
//     );

//     // Emit delivery confirmations for updated chats
//     for (const result of results) {
//       if (result.updatedCount > 0) {
//         chatNamespace.to(`chat_${result.chatId}`).emit("messagesDelivered", {
//           chatId: result.chatId,
//           userId,
//           count: result.updatedCount,
//         });

//         console.log("📨 Emitted delivery confirmation", {
//           chatId: result.chatId,
//           userId,
//           updatedCount: result.updatedCount,
//         });
//       }
//     }

//     console.log("📨 Bulk delivery update completed", {
//       userId,
//       role,
//       totalChatsAffected: results.length,
//       totalMessagesUpdated: results.reduce((sum, r) => sum + r.updatedCount, 0),
//     });
//   } catch (error: any) {
//     console.error("📨 Error marking pending messages as delivered:", {
//       userId,
//       error: error.message,
//     });
//   }
// };
import { Server, Socket } from "socket.io";
import { createClient } from "@redis/client";
import { verifyAccessToken } from "../../utils/jwt";
import ChatService from "../../services/implementations/ChatService";
import MessageService from "../../services/implementations/MessageService";
import UserRepository from "../../repositories/implementations/UserRepository";

interface UserPayload {
  id: string;
  role: string[];
}

interface CustomSocket extends Socket {
  data: {
    user?: UserPayload;
  };
}

// 🎯 FIXED: 3-second timeout typing state management
interface TypingUser {
  userId: string;
  userName: string;
  timestamp: number;
  timeoutId?: NodeJS.Timeout; // Track individual timeouts
}

interface TypingState {
  [chatId: string]: {
    [userId: string]: TypingUser;
  };
}
interface UserPresence {
  userId: string;
  isOnline: boolean;
  activeChatId?: string;
  socketId: string;
  lastSeen: Date;
}

const userPresence = new Map<string, UserPresence>();

export const initializeChatSocket = async (chatNamespace: Server) => {
  console.log("🔌 ChatSocket: Initializing Socket.IO /chat namespace");

  const chatService = new ChatService();
  const messageService = new MessageService(); // ✅ FIX 1: Move to module scope
  const userRepository = new UserRepository();

  // 🎯 FIXED: Better typing state management
  const typingStates: TypingState = {};

  // 🎯 NEW: Check if user is online via Redis/socket connection
  const isUserOnline = async (userId: string): Promise<boolean> => {
    try {
      const onlineUsers = await chatNamespace.in("online_users").allSockets();
      const userSockets = await chatNamespace.in(`user_${userId}`).allSockets();
      return userSockets.size > 0;
    } catch (error) {
      console.error("Error checking user online status:", error);
      return false;
    }
  };

  // ✅ FIX 1: Move markPendingMessagesAsDelivered to module scope with proper messageService access
  const markPendingMessagesAsDelivered = async (
    userId: string,
    role: string
  ) => {
    try {
      console.log("📨 Marking pending messages as delivered for online user", {
        userId,
        role,
        timestamp: new Date().toISOString(),
      });

      // 🎯 OPTIMIZED: Use bulk update method with proper messageService access
      const results =
        await messageService.bulkUpdateMessageStatusesOnUserOnline(
          userId,
          role
        );

      // Emit delivery confirmations for updated chats
      for (const result of results) {
        if (result.updatedCount > 0) {
          chatNamespace.to(`chat_${result.chatId}`).emit("messagesDelivered", {
            chatId: result.chatId,
            userId,
            count: result.updatedCount,
          });

          console.log("📨 Emitted delivery confirmation", {
            chatId: result.chatId,
            userId,
            updatedCount: result.updatedCount,
          });
        }
      }

      console.log("📨 Bulk delivery update completed", {
        userId,
        role,
        totalChatsAffected: results.length,
        totalMessagesUpdated: results.reduce(
          (sum, r) => sum + r.updatedCount,
          0
        ),
      });
    } catch (error: any) {
      console.error("📨 Error marking pending messages as delivered:", {
        userId,
        error: error.message,
        stack: error.stack, // ✅ ADD: Better error logging
      });
    }
  };

  chatNamespace.use((socket: CustomSocket, next: (err?: Error) => void) => {
    // Authentication middleware remains the same...
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) {
      return next(new Error("Authentication error: No cookies provided"));
    }

    const cookies = cookieHeader
      .split(";")
      .reduce((acc: Record<string, string>, cookie) => {
        const [name, value] = cookie.trim().split("=");
        acc[name] = value;
        return acc;
      }, {});

    const token = cookies.accessToken;
    if (!token) {
      return next(new Error("Authentication error: No accessToken provided"));
    }

    try {
      const decoded = verifyAccessToken(token) as UserPayload;
      socket.data.user = decoded;
      next();
    } catch (error: any) {
      next(new Error(`Authentication error: ${error.message}`));
    }
  });

  chatNamespace.on("connection", async (socket: CustomSocket) => {
    const userId = socket.data.user?.id;
    const roles = socket.data.user?.role;

    if (!userId || !roles || !Array.isArray(roles)) {
      return socket.disconnect();
    }

    console.log("💬 ChatSocket: User connected", {
      userId,
      socketId: socket.id,
    });

    // Join user-specific room for online status tracking
    socket.join(`user_${userId}`);
    socket.join("online_users");

    // 🎯 FIXED: 3-second timeout typing handlers
    socket.on("userTyping", ({ chatId, userName }) => {
      console.log("🎯 ChatSocket: userTyping received", {
        userId,
        chatId,
        userName,
        timestamp: new Date().toISOString(),
      });

      // Initialize typing state for chat if needed
      if (!typingStates[chatId]) {
        typingStates[chatId] = {};
      }

      // Clear existing timeout for this user if any
      if (typingStates[chatId][userId]?.timeoutId) {
        clearTimeout(typingStates[chatId][userId].timeoutId);
      }

      // Set new typing state with 3-second timeout
      const timeoutId = setTimeout(() => {
        console.log("🎯 ChatSocket: Typing timeout reached", {
          userId,
          chatId,
        });

        // Remove from typing state
        if (typingStates[chatId] && typingStates[chatId][userId]) {
          delete typingStates[chatId][userId];

          // Clean up empty chat states
          if (Object.keys(typingStates[chatId]).length === 0) {
            delete typingStates[chatId];
          }

          // Emit stop typing
          socket.to(`chat_${chatId}`).emit("userStoppedTyping", {
            userId,
            userName,
            chatId,
          });

          console.log("🎯 ChatSocket: Auto-emitted userStoppedTyping", {
            userId,
            chatId,
          });
        }
      }, 3000); // 🎯 FIXED: 3 seconds instead of 15

      // Update typing state
      typingStates[chatId][userId] = {
        userId,
        userName: userName || "User",
        timestamp: Date.now(),
        timeoutId,
      };

      // Emit to other users in chat
      socket.to(`chat_${chatId}`).emit("userTyping", {
        userId,
        userName: userName || "User",
        chatId,
      });

      console.log("🎯 ChatSocket: Emitted userTyping with 3s timeout", {
        userId,
        chatId,
      });
    });

    socket.on("userStoppedTyping", ({ chatId }) => {
      console.log("🎯 ChatSocket: userStoppedTyping received", {
        userId,
        chatId,
      });

      // Clear timeout and remove from state
      if (typingStates[chatId] && typingStates[chatId][userId]) {
        const typingUser = typingStates[chatId][userId];

        // Clear the timeout
        if (typingUser.timeoutId) {
          clearTimeout(typingUser.timeoutId);
        }

        // Remove from state
        delete typingStates[chatId][userId];

        // Clean up empty chat states
        if (Object.keys(typingStates[chatId]).length === 0) {
          delete typingStates[chatId];
        }

        // Emit to other users
        socket.to(`chat_${chatId}`).emit("userStoppedTyping", {
          userId,
          userName: typingUser.userName,
          chatId,
        });

        console.log("🎯 ChatSocket: Emitted userStoppedTyping", {
          userId,
          chatId,
        });
      }
    });

    // 🎯 ENHANCED: Send message with proper status management
    socket.on(
      "sendMessage",
      async ({ chatId, content, type = "text" }, callback) => {
        console.log("📤 ChatSocket: sendMessage received", {
          chatId,
          userId,
          type,
          timestamp: new Date().toISOString(),
        });

        try {
          // 🎯 CRITICAL: Always start with "sent" status
          const message = await messageService.sendMessage(
            chatId,
            userId,
            content,
            type
          );

          const populatedMessage = await messageService.getMessagesByChatId(
            chatId
          );
          const latestMessage = populatedMessage[populatedMessage.length - 1];

          // 🎯 ENHANCED: Include initial status in broadcast
          const messageWithCorrectStatus = {
            ...latestMessage,
            status: message.status, // Use the actual database status
          };

          // Emit message to chat room
          chatNamespace
            .to(`chat_${chatId}`)
            .emit("receiveMessage", messageWithCorrectStatus);

          console.log("📤 ChatSocket: Emitted receiveMessage with status", {
            messageId: message._id,
            status: message.status,
            chatId,
          });

          try {
            const chat = await chatService.findChatById(chatId);
            if (chat && chat.users) {
              const otherUserIds = chat.users
                .map((user: any) => user._id?.toString() || user.toString())
                .filter((id: string) => id !== userId);

              for (const otherUserId of otherUserIds) {
                const recipientPresence = userPresence.get(otherUserId);

                console.log("📨 ChatSocket: Checking recipient presence", {
                  recipientId: otherUserId,
                  isOnline: recipientPresence?.isOnline || false,
                  activeChatId: recipientPresence?.activeChatId,
                  currentChatId: chatId,
                  messageId: message._id,
                });

                if (recipientPresence?.isOnline) {
                  // Check if recipient has this chat actively open
                  const isActivelyViewingChat =
                    recipientPresence.activeChatId === chatId;

                  if (isActivelyViewingChat) {
                    // ✅ FIX 2: Use markMessagesAsRead instead of updateMessageStatus
                    console.log(
                      "👁️ ChatSocket: Recipient actively viewing, using markMessagesAsRead"
                    );

                    const markedCount = await messageService.markMessagesAsRead(
                      chatId,
                      otherUserId
                    );

                    // Emit read confirmation immediately
                    if (markedCount > 0) {
                      chatNamespace.to(`chat_${chatId}`).emit("messagesRead", {
                        chatId,
                        userId: otherUserId,
                      });

                      console.log(
                        "👁️ ChatSocket: Message auto-read (active chat)",
                        {
                          messageId: message._id,
                          recipientId: otherUserId,
                          markedCount,
                          activeChatId: recipientPresence.activeChatId,
                        }
                      );
                    }
                  } else {
                    // 🎯 DELIVERED: Recipient is online but chat not active
                    await messageService.markMessageAsDelivered(
                      message._id.toString(),
                      true
                    );

                    // Emit delivery confirmation
                    chatNamespace
                      .to(`chat_${chatId}`)
                      .emit("messageDelivered", {
                        messageId: message._id,
                        chatId,
                      });

                    console.log("📨 ChatSocket: Message marked as delivered", {
                      messageId: message._id,
                      recipientId: otherUserId,
                      recipientOnline: true,
                      chatActive: false,
                    });
                  }
                } else {
                  // 🎯 SENT: Recipient is offline
                  console.log(
                    "📨 ChatSocket: Recipient offline, staying as sent",
                    {
                      messageId: message._id,
                      recipientId: otherUserId,
                    }
                  );
                }
              }
            }
          } catch (statusError: any) {
            console.error(
              "📨 ChatSocket: Error updating delivery/read status:",
              statusError.message
            );
          }

          // Update notification counts (existing logic)
          try {
            const chat = await chatService.findChatById(chatId);
            if (chat && chat.users) {
              const otherUserIds = chat.users
                .map((user: any) => user._id?.toString() || user.toString())
                .filter((id: string) => id !== userId);

              for (const otherUserId of otherUserIds) {
                const userRole = chat.roles?.find(
                  (r: any) => r.userId?.toString() === otherUserId
                )?.role;

                if (
                  userRole &&
                  (userRole === "mentor" || userRole === "mentee")
                ) {
                  const unreadCount = await chatService.getUnreadChatCount(
                    otherUserId,
                    userRole
                  );

                  chatNamespace.emit("chatNotificationUpdate", {
                    userId: otherUserId,
                    role: userRole,
                    count: unreadCount,
                    chatId: chatId,
                    senderId: userId,
                  });
                }
              }
            }
          } catch (countError: any) {
            console.error(
              "🔔 ChatSocket: Error updating notification counts:",
              countError.message
            );
          }

          callback({ success: true, message: latestMessage });
        } catch (error: any) {
          console.error("📤 ChatSocket: Error in sendMessage:", {
            error: error.message,
            chatId,
            userId,
            timestamp: new Date().toISOString(),
          });

          callback({ error: error.message });
        }
      }
    );

    socket.on("getChatHistory", async ({ chatId }, callback) => {
      console.log("📨 ChatSocket: getChatHistory received", {
        chatId,
        userId,
        timestamp: new Date().toISOString(),
      });

      try {
        const messages = await messageService.getMessagesByChatId(chatId);

        // 🎯 CRITICAL: Use ONLY database status, with comprehensive logging
        const messagesWithDatabaseStatus = messages.map((msg: any) => {
          const dbStatus = msg.status || "sent";

          // 🎯 DEBUG: Log any messages without proper status
          if (!msg.status) {
            console.warn("📨 Message without status field:", {
              messageId: msg._id,
              defaultedTo: "sent",
              sender: msg.sender?._id,
              chatId,
            });
          }

          return {
            ...msg,
            status: dbStatus, // Always use database status
          };
        });

        console.log(
          "📨 ChatSocket: Fetched chat history with database status",
          {
            chatId,
            messageCount: messagesWithDatabaseStatus.length,
            statusBreakdown: messagesWithDatabaseStatus.reduce(
              (acc: any, msg: any) => {
                acc[msg.status] = (acc[msg.status] || 0) + 1;
                return acc;
              },
              {}
            ),
            timestamp: new Date().toISOString(),
          }
        );

        callback({ success: true, messages: messagesWithDatabaseStatus });
      } catch (error: any) {
        console.error("📨 ChatSocket: Error fetching chat history:", {
          error: error.message,
          chatId,
          userId,
          timestamp: new Date().toISOString(),
        });
        callback({ error: error.message });
      }
    });

    // 🎯 ENHANCED: markAsRead with proper status updates
    socket.on("markAsRead", async ({ chatId }, callback) => {
      console.log("🎯 ChatSocket: markAsRead received", {
        chatId,
        userId,
        timestamp: new Date().toISOString(),
      });

      try {
        // Mark messages as read (updates both readBy and status)
        const markedCount = await messageService.markMessagesAsRead(
          chatId,
          userId
        );

        console.log("🎯 ChatSocket: Marked messages as read", {
          chatId,
          userId,
          markedCount,
          timestamp: new Date().toISOString(),
        });

        // Emit read confirmation to other users
        if (markedCount > 0) {
          chatNamespace
            .to(`chat_${chatId}`)
            .emit("messagesRead", { chatId, userId });
        }

        // Update notification counts
        try {
          const userRoles = roles || [];
          for (const role of userRoles) {
            if (role === "mentor" || role === "mentee") {
              const unreadCount = await chatService.getUnreadChatCount(
                userId,
                role
              );

              chatNamespace.emit("chatNotificationUpdate", {
                userId: userId,
                role: role,
                count: unreadCount,
                chatId: chatId,
              });
            }
          }
        } catch (countError: any) {
          console.error(
            "🔔 ChatSocket: Error updating counts after read:",
            countError.message
          );
        }

        callback({ success: true, markedCount });
      } catch (error: any) {
        console.error("🎯 ChatSocket: Error marking messages as read:", {
          error: error.message,
          chatId,
          userId,
          timestamp: new Date().toISOString(),
        });
        callback({ error: error.message });
      }
    });

    socket.on("chatOpened", async ({ chatId }, callback) => {
      console.log("👁️ ChatSocket: chatOpened received", {
        userId,
        chatId,
        timestamp: new Date().toISOString(),
      });

      try {
        // Update user presence with active chat
        const presence = userPresence.get(userId);
        if (presence) {
          presence.activeChatId = chatId;
          userPresence.set(userId, presence);
        }

        // ✅ FIX 2: Use markMessagesAsRead consistently
        const markedCount = await messageService.markMessagesAsRead(
          chatId,
          userId
        );

        console.log("👁️ ChatSocket: Chat opened, messages marked as read", {
          userId,
          chatId,
          markedCount,
          timestamp: new Date().toISOString(),
        });

        // Emit read confirmation to other users
        if (markedCount > 0) {
          chatNamespace
            .to(`chat_${chatId}`)
            .emit("messagesRead", { chatId, userId });
        }

        callback({ success: true, markedCount });
      } catch (error: any) {
        console.error("👁️ ChatSocket: Error handling chatOpened:", {
          userId,
          chatId,
          error: error.message,
        });
        callback({ error: error.message });
      }
    });

    // 🎯 NEW: Track when user closes a specific chat
    socket.on("chatClosed", ({ chatId }, callback) => {
      console.log("👁️ ChatSocket: chatClosed received", {
        userId,
        chatId,
        timestamp: new Date().toISOString(),
      });

      try {
        // Update user presence to remove active chat
        const presence = userPresence.get(userId);
        if (presence && presence.activeChatId === chatId) {
          delete presence.activeChatId;
          userPresence.set(userId, presence);
        }

        console.log("👁️ ChatSocket: Chat closed, stopped auto-read", {
          userId,
          chatId,
        });

        callback({ success: true });
      } catch (error: any) {
        console.error("👁️ ChatSocket: Error handling chatClosed:", {
          userId,
          chatId,
          error: error.message,
        });
        callback({ error: error.message });
      }
    });
    socket.on("debugUnreadCounts", async (callback) => {
      console.log("🔍 ChatSocket: debugUnreadCounts received", {
        userId,
        timestamp: new Date().toISOString(),
      });

      try {
        await chatService.debugUserUnreadCounts(userId);

        const mentorCount = await chatService.getUnreadChatCount(
          userId,
          "mentor"
        );
        const menteeCount = await chatService.getUnreadChatCount(
          userId,
          "mentee"
        );

        callback({
          success: true,
          counts: {
            mentor: mentorCount,
            mentee: menteeCount,
          },
          message: "Debug analysis completed - check server logs",
        });
      } catch (error: any) {
        console.error("🔍 ChatSocket: debugUnreadCounts error", {
          error: error.message,
          userId,
        });
        callback({ error: error.message });
      }
    });
    socket.on("debugChatStatus", async ({ chatId }, callback) => {
      console.log("🔍 ChatSocket: debugChatStatus received", {
        chatId,
        userId,
        timestamp: new Date().toISOString(),
      });

      try {
        if (!chatId) {
          callback({ error: "chatId is required" });
          return;
        }

        // Debug message statuses
        await messageService.debugMessageStatuses(chatId, userId);

        // Get current unread count
        const unreadCount = await messageService.getUnreadMessageCount(
          chatId,
          userId
        );

        // Get chat statistics
        const stats = await messageService.getChatStatistics(chatId);

        callback({
          success: true,
          debug: {
            unreadCount,
            stats,
            userId,
            chatId,
            timestamp: new Date().toISOString(),
          },
        });
      } catch (error: any) {
        console.error("🔍 ChatSocket: debugChatStatus error", {
          error: error.message,
          chatId,
          userId,
          timestamp: new Date().toISOString(),
        });
        callback({ error: error.message });
      }
    });
    // 🎯 ENHANCED: Disconnect handler with typing cleanup
    socket.on("disconnect", async () => {
      console.log("💬 ChatSocket: User disconnected", {
        userId,
        socketId: socket.id,
        timestamp: new Date().toISOString(),
      });

      try {
        // 🎯 FIXED: Clean up all typing states for this user
        Object.keys(typingStates).forEach((chatId) => {
          if (typingStates[chatId] && typingStates[chatId][userId]) {
            const typingUser = typingStates[chatId][userId];

            // Clear timeout
            if (typingUser.timeoutId) {
              clearTimeout(typingUser.timeoutId);
            }

            // Remove from state
            delete typingStates[chatId][userId];

            // Emit stop typing to chat
            socket.to(`chat_${chatId}`).emit("userStoppedTyping", {
              userId,
              userName: typingUser.userName,
              chatId,
            });

            // Clean up empty chat states
            if (Object.keys(typingStates[chatId]).length === 0) {
              delete typingStates[chatId];
            }

            console.log(
              "🎯 ChatSocket: Cleaned up typing state on disconnect",
              {
                chatId,
                userId,
              }
            );
          }
        });

        const presence = userPresence.get(userId);
        if (presence) {
          presence.isOnline = false;
          presence.lastSeen = new Date();
          delete presence.activeChatId; // Clear active chat
          userPresence.set(userId, presence);
        }

        // Update online status in database
        for (const role of roles) {
          if (role === "mentor" || role === "mentee") {
            await userRepository.updateOnlineStatus(userId, role, false);
          }
        }
        // Remove from online tracking
        socket.leave(`user_${userId}`);
        socket.leave("online_users");

        // Emit offline status
        chatNamespace.emit("userStatus", { userId, roles, isOnline: false });

        console.log("💬 ChatSocket: Cleanup completed on disconnect", {
          userId,
          presenceCleared: !!presence,
        });
      } catch (err: any) {
        console.error("💬 ChatSocket: Error handling disconnect:", {
          error: err.message,
          userId,
          timestamp: new Date().toISOString(),
        });
      }
    });

    socket.on("reconnecting", () => {
      console.log("🔄 ChatSocket: User reconnecting", {
        userId,
        socketId: socket.id,
        timestamp: new Date().toISOString(),
      });

      // Don't emit loading states to other users during reconnection
      // Just log for debugging
    });

    socket.on("reconnect", async (attemptNumber) => {
      console.log("🔄 ChatSocket: User reconnected", {
        userId,
        socketId: socket.id,
        attemptNumber,
        timestamp: new Date().toISOString(),
      });

      try {
        // 🎯 SILENT SYNC: Update presence without notifying others
        const presence = userPresence.get(userId);
        if (presence) {
          presence.isOnline = true;
          presence.socketId = socket.id;
          presence.lastSeen = new Date();
          userPresence.set(userId, presence);
        }

        // Rejoin chat rooms silently
        for (const role of roles) {
          if (role === "mentor" || role === "mentee") {
            const chats = await chatService.getChatsByUserAndRole(userId, role);
            chats.forEach((chat) => {
              socket.join(`chat_${chat._id}`);
            });
          }
        }

        console.log("✅ ChatSocket: Reconnection sync completed silently");
      } catch (error: any) {
        console.error("❌ ChatSocket: Error during reconnection sync:", {
          error: error.message,
          userId,
        });
      }
    });

    try {
      // 🎯 NEW: Track user presence
      userPresence.set(userId, {
        userId,
        isOnline: true,
        socketId: socket.id,
        lastSeen: new Date(),
      });

      // Update online status in database
      for (const role of roles) {
        if (role === "mentor" || role === "mentee") {
          await userRepository.updateOnlineStatus(userId, role, true);

          // Join relevant chat rooms
          const chats = await chatService.getChatsByUserAndRole(userId, role);
          chats.forEach((chat) => {
            socket.join(`chat_${chat._id}`);
          });

          // ✅ FIX 1: Now properly scoped markPendingMessagesAsDelivered
          await markPendingMessagesAsDelivered(userId, role);
        }
      }

      // Emit online status
      chatNamespace.emit("userStatus", { userId, roles, isOnline: true });

      console.log("👤 User presence tracked:", {
        userId,
        isOnline: true,
        socketId: socket.id,
      });
    } catch (err: any) {
      console.error(
        "💬 ChatSocket: Error in user initialization:",
        err.message,
        err.stack // ✅ ADD: Better error logging
      );
    }
  });

  console.log(
    "✅ ChatSocket: Socket.IO chat namespace initialized successfully"
  );
};
