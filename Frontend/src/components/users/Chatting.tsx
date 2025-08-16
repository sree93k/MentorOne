import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Smile,
  Image as ImageIcon,
  Mic,
  Send,
  MoreVertical,
  Check,
  CheckCheck,
  X,
  Play,
  Pause,
  Loader2,
  Menu,
} from "lucide-react";
import Pattern from "@/assets/pattern-2.svg";
import { io, Socket } from "socket.io-client";
import {
  getChatHistory,
  uploadToS3WithPresignedUrl,
  getMediaUrl,
  checkUserOnlineStatus,
} from "@/services/userServices";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import Logo from "@/assets/Logorebarnd1.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateBookingStatus } from "../../services/bookingService";
import ConfirmationModal from "../modal/ConfirmationModal";
import { checkAuthStatus } from "@/utils/auth";
import { setChatUnreadCounts } from "@/redux/slices/userSlice";

interface ChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ChatMessage {
  _id: string;
  content: string;
  timestamp: string;
  sender: "user" | "other";
  senderId: string;
  type: "text" | "image" | "audio";
  status?: "sent" | "delivered" | "read";
}

interface TypingUser {
  userId: string;
  userName: string;
  timestamp: number;
}

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  bookingId: string;
  lastMessage?: string;
  timestamp?: string;
  unread?: number;
  isOnline?: boolean;
  bookingStatus?: "pending" | "confirmed" | "completed";
  isActive: boolean;
  otherUserId?: string;
  isTyping?: boolean;
  typingUsers?: TypingUser[];
}

const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const formatTimestamp = (timestamp: string | undefined) => {
  if (!timestamp) return "12:30 PM";

  const now = new Date();
  const messageDate = new Date(timestamp);
  const diffMs = now.getTime() - messageDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24) {
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffHours < 48) {
    return "Yesterday";
  } else {
    return messageDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
};

const Chatting = ({ open, onOpenChange }: ChatProps) => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [filteredChatUsers, setFilteredChatUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatHistories, setChatHistories] = useState<{
    [chatId: string]: ChatMessage[];
  }>({});
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<
    "pending" | "confirmed" | "completed" | null
  >(null);
  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  const [mediaUrls, setMediaUrls] = useState<{ [key: string]: string }>({});
  const [audioProgress, setAudioProgress] = useState<{ [key: string]: number }>(
    {}
  );
  const [isFirstUserAutoSelected, setIsFirstUserAutoSelected] = useState(false);
  const [typingStates, setTypingStates] = useState<{
    [chatId: string]: TypingUser[];
  }>({});
  const [isTyping, setIsTyping] = useState(false);
  const [connectionState, setConnectionState] = useState<
    "connected" | "disconnected" | "reconnecting"
  >("disconnected");
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isMessagesLoaded, setIsMessagesLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const { user, dashboard, isOnline } = useSelector(
    (state: RootState) => state.user
  );
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingTimeRef = useRef<number>(0);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const userId = user?._id;
  const role = user?.role;

  const scrollToBottom = debounce(
    (retryCount = 0, maxRetries = 5, messageCount = 0) => {
      if (scrollAreaRef.current) {
        const scrollElement = scrollAreaRef.current.querySelector(
          "[data-radix-scroll-area-viewport]"
        ) as HTMLElement;
        if (scrollElement) {
          console.log("Scrolling to bottom", {
            scrollTop: scrollElement.scrollTop,
            scrollHeight: scrollElement.scrollHeight,
            clientHeight: scrollElement.clientHeight,
            messages: messageCount,
            retryCount,
          });
          scrollElement.scrollTop = scrollElement.scrollHeight;
          setTimeout(() => {
            if (
              scrollElement.scrollTop <
              scrollElement.scrollHeight - scrollElement.clientHeight - 1
            ) {
              console.log("Scroll not at bottom, retrying", {
                scrollTop: scrollElement.scrollTop,
                scrollHeight: scrollElement.scrollHeight,
              });
              if (retryCount < maxRetries) {
                scrollToBottom(retryCount + 1, maxRetries, messageCount);
              } else {
                console.error(
                  "Max retries reached, falling back to lastMessageRef"
                );
                if (lastMessageRef.current) {
                  lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
                  console.log("Used lastMessageRef fallback");
                }
              }
            } else {
              console.log("Scroll successful");
            }
          }, 100);
        } else {
          console.error("Scroll viewport not found");
          if (retryCount < maxRetries) {
            setTimeout(
              () => scrollToBottom(retryCount + 1, maxRetries, messageCount),
              1000
            );
            console.log("Retrying due to missing viewport", { retryCount });
          } else {
            console.error(
              "Max retries reached, falling back to lastMessageRef"
            );
            if (lastMessageRef.current) {
              lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
              console.log("Used lastMessageRef fallback");
            }
          }
        }
      } else {
        console.error("ScrollArea ref not set");
        if (retryCount < maxRetries) {
          setTimeout(
            () => scrollToBottom(retryCount + 1, maxRetries, messageCount),
            1000
          );
          console.log("Retrying due to unset ref", { retryCount });
        } else {
          console.error("Max retries reached, falling back to lastMessageRef");
          if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
            console.log("Used lastMessageRef fallback");
          }
        }
      }
    },
    100
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const scrollPosition = scrollHeight - scrollTop - clientHeight;
    setShouldScrollToBottom(scrollPosition < 100);
  };

  // ✅ NEW: Function to update chat notification counts in Redux
  // const updateChatNotificationCounts = async () => {
  //   try {
  //     if (!userId) return;

  //     // Get updated counts from backend
  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_URL}/user/chat/unread-counts`,
  //       {
  //         credentials: "include",
  //       }
  //     );

  //     if (response.ok) {
  //       const counts = await response.json();
  //       dispatch(setChatUnreadCounts(counts.data));
  //       console.log("💬 Updated chat notification counts:", counts.data);
  //     }
  //   } catch (error) {
  //     console.error("Failed to update chat notification counts:", error);
  //   }
  // };
  const updateChatNotificationCounts = async () => {
    try {
      if (!userId) return;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/chat/unread-counts`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const counts = await response.json();
        dispatch(setChatUnreadCounts(counts.data));
        console.log("💬 Updated chat notification counts:", counts.data);
      }
    } catch (error) {
      console.error("Failed to update chat notification counts:", error);
    }
  };
  const markCurrentChatAsRead = async () => {
    if (socket && socket.connected && activeChatId && hasUserInteracted) {
      socket.emit(
        "markAsRead",
        { chatId: activeChatId },
        async (response: any) => {
          if (response.success) {
            console.log("💬 Explicitly marked current chat as read");
            await updateChatNotificationCounts();

            // Update local state to reflect read status
            setChatUsers((prev) =>
              prev.map((u) => (u.id === activeChatId ? { ...u, unread: 0 } : u))
            );
            setFilteredChatUsers((prev) =>
              prev.map((u) => (u.id === activeChatId ? { ...u, unread: 0 } : u))
            );
          }
        }
      );
    }
  };
  const debugCurrentChat = () => {
    if (socket && socket.connected && activeChatId) {
      socket.emit(
        "debugChatStatus",
        { chatId: activeChatId },
        (response: any) => {
          console.log("🔍 Frontend: Debug response", response);
        }
      );
    } else {
      console.log("🔍 Frontend: No active chat or socket not connected");
    }
  };
  const debugUnreadCounts = () => {
    if (socket && socket.connected) {
      socket.emit("debugUnreadCounts", (response: any) => {
        console.log("🔍 Frontend: Debug unread counts response", response);
      });
    } else {
      console.log("🔍 Frontend: Socket not connected");
    }
  };

  // Make it globally available
  useEffect(() => {
    (window as any).debugUnreadCounts = debugUnreadCounts;
    return () => {
      delete (window as any).debugUnreadCounts;
    };
  }, [socket]);
  useEffect(() => {
    (window as any).debugCurrentChat = debugCurrentChat;
    return () => {
      delete (window as any).debugCurrentChat;
    };
  }, [socket, activeChatId]);
  useEffect(() => {
    setChatHistories({});
    setSelectedUser(null);
    setActiveChatId(null);
    setIsMessagesLoaded(false);
    setMediaUrls({});
    setAudioProgress({});
    setIsPlaying({});
  }, []);

  useLayoutEffect(() => {
    if (
      scrollAreaRef.current &&
      selectedUser &&
      activeChatId &&
      shouldScrollToBottom &&
      isMessagesLoaded &&
      chatHistories[activeChatId]?.length > 0
    ) {
      console.log("ScrollArea ref set, triggering scroll", {
        viewport: !!scrollAreaRef.current.querySelector(
          "[data-radix-scroll-area-viewport]"
        ),
        messageCount: chatHistories[activeChatId].length,
      });
      scrollToBottom(0, 5, chatHistories[activeChatId].length);
    }
  }, [
    scrollAreaRef,
    selectedUser,
    activeChatId,
    shouldScrollToBottom,
    isMessagesLoaded,
    chatHistories,
  ]);

  useEffect(() => {
    if (selectedUser) {
      const updatedUser = chatUsers.find((u) => u.id === selectedUser.id);
      if (updatedUser && updatedUser.isOnline !== selectedUser.isOnline) {
        setSelectedUser((prev) =>
          prev ? { ...prev, isOnline: updatedUser.isOnline } : null
        );
      }
    }
  }, [chatUsers, selectedUser]);

  // ✅ MAIN SOCKET CONNECTION WITH CHAT NOTIFICATIONS
  useEffect(() => {
    console.log("🔍 Chat component: Checking authentication");
    const isAuthenticated = checkAuthStatus();
    console.log("🔍 Chat authentication result:", isAuthenticated);

    if (!isAuthenticated) {
      console.log("❌ Chat: Not authenticated, cannot connect to socket");
      setError("Please log in to access chat");
      return;
    }

    console.log("✅ Chat: Authenticated, connecting to socket");
    const socketInstance = io(`${import.meta.env.VITE_SOCKET_URL}/chat`, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true,
    });

    setSocket(socketInstance);

    // ✅ FIX 1: ADD CONNECTION STATE HANDLERS
    socketInstance.on("connect", () => {
      console.log("💬 Connected to chat socket");
      setConnectionState("connected"); // ✅ FIXED: Update connection state
      setError(null);
      setReconnectAttempts(0);
      // Update initial counts when connected
      updateChatNotificationCounts();
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("🔌 Frontend: Socket disconnected", { reason });
      setConnectionState("disconnected"); // ✅ FIXED: Update connection state
    });

    socketInstance.on("reconnecting", (attemptNumber) => {
      console.log("🔄 Frontend: Socket reconnecting", { attemptNumber });
      setConnectionState("reconnecting"); // ✅ FIXED: Update connection state
      setReconnectAttempts(attemptNumber);
    });

    socketInstance.on("reconnect", (attemptNumber) => {
      console.log("✅ Frontend: Socket reconnected", { attemptNumber });
      setConnectionState("connected"); // ✅ FIXED: Update connection state
      setReconnectAttempts(0);
    });

    socketInstance.on("reconnect_failed", () => {
      console.error("❌ Frontend: Socket reconnection failed");
      setConnectionState("disconnected"); // ✅ FIXED: Update connection state
      setError("Connection lost. Please refresh the page.");
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error.message);
      setConnectionState("disconnected"); // ✅ FIXED: Update connection state
      setError(`Failed to connect to chat server: ${error.message}`);
    });

    // ✅ NEW: Listen for live chat notification updates
    socketInstance.on(
      "chatNotificationUpdate",
      async (data: {
        userId: string;
        role: "mentor" | "mentee";
        count: number;
        chatId: string;
        senderId?: string;
      }) => {
        console.log("💬 Received chat notification update:", data);

        // Only update if this event is for the current user
        if (data.userId === userId) {
          // Update Redux store with new counts
          await updateChatNotificationCounts();

          console.log(`💬 Updated ${data.role} chat count to: ${data.count}`);
        }
      }
    );

    socketInstance.on("receiveMessage", async (message) => {
      console.log("💬 Received new message:", message);

      setChatHistories((prev) => {
        const chatId = message.chat.toString();
        const formattedMessage: ChatMessage = {
          _id: message._id,
          content: message.content,
          timestamp: new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          sender: message.sender._id === userId ? "user" : "other",
          senderId: message.sender._id,
          type: message.type,
          // 🎯 CRITICAL: Use actual message status from backend
          status: message.status || "sent",
        };
        const updated = [...(prev[chatId] || []), formattedMessage];
        return { ...prev, [chatId]: updated };
      });
      setChatUsers((prev) => {
        const updatedUsers = prev.map((user) =>
          user.id === message.chat.toString()
            ? {
                ...user,
                lastMessage:
                  message.type === "text"
                    ? message.content
                    : message.type === "image"
                    ? "Image"
                    : "Audio",
                timestamp: message.createdAt,
                // ✅ FIXED: Only auto-mark as read if user has interacted AND chat is active
                unread:
                  message.sender._id === userId
                    ? user.unread || 0 // Don't change count for own messages
                    : user.id === activeChatId && hasUserInteracted
                    ? 0 // Only mark as read if user has actually interacted with this chat
                    : (user.unread || 0) + 1, // Otherwise increment
              }
            : user
        );
        return updatedUsers.sort((a, b) =>
          b.timestamp && a.timestamp
            ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            : b.timestamp
            ? -1
            : a.timestamp
            ? 1
            : 0
        );
      });

      setFilteredChatUsers((prev) => {
        const updatedUsers = prev.map((user) =>
          user.id === message.chat.toString()
            ? {
                ...user,
                lastMessage:
                  message.type === "text"
                    ? message.content
                    : message.type === "image"
                    ? "Image"
                    : "Audio",
                timestamp: message.createdAt,
                unread:
                  message.sender._id === userId
                    ? user.unread || 0
                    : user.id === activeChatId && hasUserInteracted
                    ? 0
                    : (user.unread || 0) + 1,
              }
            : user
        );
        return updatedUsers.sort((a, b) =>
          b.timestamp && a.timestamp
            ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            : b.timestamp
            ? -1
            : a.timestamp
            ? 1
            : 0
        );
      });

      // Handle media URLs
      if (message.type === "image" || message.type === "audio") {
        try {
          const s3Key = getS3Key(message.content);
          const presignedUrl = await getMediaUrl(s3Key);
          setMediaUrls((prev) => ({
            ...prev,
            [message._id]: presignedUrl,
          }));
        } catch (err: any) {
          console.error(
            `Failed to get presigned URL for received message ${message._id}:`,
            err
          );
          setError(`Failed to load media for message ${message._id}`);
        }
      }

      // ✅ IMPROVED: Auto-mark as read only if user has interacted AND chat is currently open
      if (
        message.chat.toString() === activeChatId &&
        message.sender._id !== userId &&
        hasUserInteracted && // ✅ NEW: Only auto-read if user has interacted
        socketInstance.connected
      ) {
        socketInstance.emit(
          "markAsRead",
          { chatId: activeChatId },
          (response: any) => {
            if (!response.success) {
              console.error("Failed to mark messages as read:", response.error);
            } else {
              console.log(
                "💬 Auto-marked message as read (user has interacted)"
              );
            }
          }
        );
      }

      // ✅ IMPROVED: Update global notification counts when receiving messages from others
      if (message.sender._id !== userId) {
        await updateChatNotificationCounts();
      }

      if (shouldScrollToBottom) {
        scrollToBottom(
          0,
          5,
          (chatHistories[message.chat.toString()] || []).length + 1
        );
      }
    });

    // ✅ IMPROVED: Message status updates
    socketInstance.on("messageDelivered", ({ messageId, chatId }) => {
      setChatHistories((prev) => {
        const updatedMessages = (prev[chatId] || []).map((msg) =>
          msg._id === messageId ? { ...msg, status: "delivered" } : msg
        );
        return { ...prev, [chatId]: updatedMessages };
      });
    });

    socketInstance.on("messagesRead", ({ chatId, userId: readByUserId }) => {
      // ✅ IMPROVED: Update message status to read for messages sent by current user
      setChatHistories((prev) => {
        const updatedMessages = (prev[chatId] || []).map((msg) =>
          msg.sender === "user" && msg.senderId === userId
            ? { ...msg, status: "read" }
            : msg
        );
        return { ...prev, [chatId]: updatedMessages };
      });

      // Update unread counts in chat users list
      setChatUsers((prev) =>
        prev.map((user) =>
          user.id === chatId
            ? { ...user, unread: 0 } // Reset unread count when messages are read
            : user
        )
      );

      setFilteredChatUsers((prev) =>
        prev.map((user) => (user.id === chatId ? { ...user, unread: 0 } : user))
      );
    });

    socketInstance.on("userStatus", ({ userId, isOnline }) => {
      setChatUsers((prev) =>
        prev.map((user) =>
          user.otherUserId === userId ? { ...user, isOnline } : user
        )
      );
      setFilteredChatUsers((prev) =>
        prev.map((user) =>
          user.otherUserId === userId ? { ...user, isOnline } : user
        )
      );
    });

    socketInstance.on("bookingStatus", ({ bookingId, status }) => {
      setChatUsers((prev) =>
        prev.map((user) =>
          user.bookingId === bookingId
            ? {
                ...user,
                bookingStatus: status,
                isActive: status === "confirmed",
              }
            : user
        )
      );
      setFilteredChatUsers((prev) =>
        prev.map((user) =>
          user.bookingId === bookingId
            ? {
                ...user,
                bookingStatus: status,
                isActive: status === "confirmed",
              }
            : user
        )
      );
      if (selectedUser?.bookingId === bookingId) {
        setSelectedUser((prev) =>
          prev
            ? {
                ...prev,
                bookingStatus: status,
                isActive: status === "confirmed",
              }
            : null
        );
      }
    });
    socketInstance.on(
      "userTyping",
      ({ userId: typingUserId, userName, chatId }) => {
        console.log("🎯 User typing received", {
          typingUserId,
          userName,
          chatId,
        });

        setTypingStates((prev) => ({
          ...prev,
          [chatId]: [
            ...(prev[chatId] || []).filter((u) => u.userId !== typingUserId),
            { userId: typingUserId, userName, timestamp: Date.now() },
          ],
        }));

        setChatUsers((prev) =>
          prev.map((user) => {
            if (user.id === chatId) {
              const typingUsers = [
                ...(typingStates[chatId] || []).filter(
                  (u) => u.userId !== typingUserId
                ),
                { userId: typingUserId, userName, timestamp: Date.now() },
              ];
              return { ...user, isTyping: true, typingUsers };
            }
            return user;
          })
        );

        setFilteredChatUsers((prev) =>
          prev.map((user) => {
            if (user.id === chatId) {
              const typingUsers = [
                ...(typingStates[chatId] || []).filter(
                  (u) => u.userId !== typingUserId
                ),
                { userId: typingUserId, userName, timestamp: Date.now() },
              ];
              return { ...user, isTyping: true, typingUsers };
            }
            return user;
          })
        );
      }
    );

    socketInstance.on(
      "userStoppedTyping",
      ({ userId: typingUserId, chatId }) => {
        console.log("🎯 User stopped typing", { typingUserId, chatId });

        setTypingStates((prev) => ({
          ...prev,
          [chatId]: (prev[chatId] || []).filter(
            (u) => u.userId !== typingUserId
          ),
        }));

        setChatUsers((prev) =>
          prev.map((user) => {
            if (user.id === chatId) {
              const typingUsers = (typingStates[chatId] || []).filter(
                (u) => u.userId !== typingUserId
              );
              return { ...user, isTyping: typingUsers.length > 0, typingUsers };
            }
            return user;
          })
        );

        setFilteredChatUsers((prev) =>
          prev.map((user) => {
            if (user.id === chatId) {
              const typingUsers = (typingStates[chatId] || []).filter(
                (u) => u.userId !== typingUserId
              );
              return { ...user, isTyping: typingUsers.length > 0, typingUsers };
            }
            return user;
          })
        );
      }
    );

    socketInstance.on(
      "messageRead",
      ({ messageId, chatId, userId: readByUserId }) => {
        console.log("👁️ Frontend: Message read confirmation", {
          messageId,
          chatId,
          readByUserId,
        });

        // Update specific message status to read
        setChatHistories((prev) => {
          const updatedMessages = (prev[chatId] || []).map((msg) =>
            msg._id === messageId ? { ...msg, status: "read" } : msg
          );
          return { ...prev, [chatId]: updatedMessages };
        });
      }
    );

    // 🎯 NEW: Listen for bulk messages delivered confirmations
    socketInstance.on(
      "messagesDelivered",
      ({ chatId, userId: deliveredToUserId, count }) => {
        console.log("📨 Frontend: Messages delivered confirmation", {
          chatId,
          deliveredToUserId,
          count,
        });

        // Update message statuses for messages sent to this user
        setChatHistories((prev) => {
          const updatedMessages = (prev[chatId] || []).map((msg) =>
            msg.sender === "user" && msg.status === "sent"
              ? { ...msg, status: "delivered" }
              : msg
          );
          return { ...prev, [chatId]: updatedMessages };
        });
      }
    );
    return () => {
      // ✅ ADD: Cleanup typing when disconnecting
      if (isTyping) {
        handleTypingStop();
      }

      // Clear intervals
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      socketInstance.disconnect();
    };
  }, [userId, dispatch]);
  useEffect(() => {
    // Set up a click handler on the chat area to detect first interaction
    const chatArea = scrollAreaRef.current;

    const handleFirstInteraction = () => {
      if (!hasUserInteracted && selectedUser && activeChatId) {
        console.log("🎯 First interaction detected with auto-selected chat");
        setHasUserInteracted(true);
        // Mark messages as read after a small delay to ensure UI is ready
        setTimeout(() => {
          markCurrentChatAsRead();
        }, 500);
      }
    };

    if (chatArea && selectedUser && !hasUserInteracted) {
      chatArea.addEventListener("click", handleFirstInteraction);
      // Also listen for scroll as interaction
      chatArea.addEventListener("scroll", handleFirstInteraction);

      return () => {
        chatArea.removeEventListener("click", handleFirstInteraction);
        chatArea.removeEventListener("scroll", handleFirstInteraction);
      };
    }
  }, [selectedUser, activeChatId, hasUserInteracted, socket]);
  const handleInputFocus = () => {
    if (!hasUserInteracted && selectedUser && activeChatId) {
      console.log("🎯 User started typing - marking as interacted");
      setHasUserInteracted(true);
      setTimeout(() => {
        markCurrentChatAsRead();
      }, 500);
    }
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!dashboard) {
        setError("Please select a dashboard (mentor or mentee)");
        return;
      }

      try {
        setError(null);
        console.log("📋 Fetching chat users for dashboard:", dashboard);

        const response = await getChatHistory(dashboard);
        const updatedChatUsers = response.data.map((user: ChatUser) => ({
          ...user,
          isOnline: false,
          isActive: user.isActive ?? true,
        }));

        console.log("📋 Chat users fetched", {
          count: updatedChatUsers.length,
        });

        setChatUsers(updatedChatUsers);
        setFilteredChatUsers(updatedChatUsers);

        // ✅ FIXED: Auto-select first user but DON'T mark as read yet
        // if (updatedChatUsers.length > 0) {
        //   const firstUser = updatedChatUsers[0];
        //   console.log("👤 Auto-selecting first user:", firstUser.name);

        //   setSelectedUser(firstUser);
        //   setActiveChatId(firstUser.id);
        //   setIsFirstUserAutoSelected(true);
        //   setHasUserInteracted(false);

        //   // Check online status for the selected user
        //   if (firstUser.otherUserId) {
        //     try {
        //       const isOnline = await checkUserOnlineStatus(
        //         firstUser.otherUserId
        //       );
        //       const userWithOnlineStatus = { ...firstUser, isOnline };
        //       setSelectedUser(userWithOnlineStatus);

        //       // Update the user in the lists as well
        //       setChatUsers((prev) =>
        //         prev.map((u) =>
        //           u.id === firstUser.id ? userWithOnlineStatus : u
        //         )
        //       );
        //       setFilteredChatUsers((prev) =>
        //         prev.map((u) =>
        //           u.id === firstUser.id ? userWithOnlineStatus : u
        //         )
        //       );
        //     } catch (error: any) {
        //       console.error("Failed to check online status:", error);
        //     }
        //   }
        // } else {
        //   console.log("❌ No chat users found");
        //   setError(`No chats available for ${dashboard} dashboard`);
        // }
        console.log(
          "📋 Chat users loaded, waiting for chat to open for auto-selection"
        );
      } catch (error: any) {
        console.error("fetchChatHistory error:", error);
        setError(error.message || "Failed to fetch chat history");
      }
    };

    if (isOnline.role && dashboard) {
      fetchChatHistory();
    }
  }, [isOnline.role, dashboard]);
  useEffect(() => {
    // Only auto-select when chat becomes visible AND we have users
    if (open && chatUsers.length > 0 && !selectedUser) {
      const firstUser = chatUsers[0];
      console.log(
        "👤 Chat is now visible - Auto-selecting first user:",
        firstUser.name
      );

      setSelectedUser(firstUser);
      setActiveChatId(firstUser.id);
      setIsFirstUserAutoSelected(true);
      setHasUserInteracted(false); // Will be set to true when user actually interacts

      // Check online status for the selected user
      if (firstUser.otherUserId) {
        checkUserOnlineStatus(firstUser.otherUserId)
          .then((isOnline) => {
            const userWithOnlineStatus = { ...firstUser, isOnline };
            setSelectedUser(userWithOnlineStatus);

            setChatUsers((prev) =>
              prev.map((u) =>
                u.id === firstUser.id ? userWithOnlineStatus : u
              )
            );
            setFilteredChatUsers((prev) =>
              prev.map((u) =>
                u.id === firstUser.id ? userWithOnlineStatus : u
              )
            );
          })
          .catch((error) => {
            console.error("Failed to check online status:", error);
          });
      }
    }

    // Reset selection when chat closes
    if (!open && selectedUser) {
      console.log("👤 Chat closed - Clearing selection");
      if (socket && socket.connected && activeChatId) {
        socket.emit("chatClosed", { chatId: activeChatId }, (response: any) => {
          console.log("👁️ Frontend: Chat closed on sheet close", {
            chatId: activeChatId,
            success: response?.success,
          });
        });
      }

      setSelectedUser(null);
      setActiveChatId(null);
      setHasUserInteracted(false);
      setIsFirstUserAutoSelected(false);
      setIsMessagesLoaded(false);
    }
  }, [open, chatUsers, selectedUser, socket, activeChatId]);
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredChatUsers(chatUsers);
    } else {
      const filtered = chatUsers.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredChatUsers(filtered);
    }
  }, [searchQuery, chatUsers]);

  // useEffect(() => {
  //   // ✅ CRITICAL: Don't run if no user is selected or if this is just initialization
  //   // if (!selectedUser || !activeChatId) {
  //   //   console.log("🔍 Chat history: No user selected, skipping");
  //   //   return;
  //   // }
  //   if (!selectedUser || !activeChatId || !open) {
  //     console.log(
  //       "🔍 Chat history: Chat not visible or no user selected, skipping"
  //     );
  //     return;
  //   }

  //   // console.log("🔍 Chat history effect triggered", {
  //   //   hasSocket: !!socket,
  //   //   socketConnected: socket?.connected,
  //   //   activeChatId,
  //   //   selectedUser: selectedUser?.name,
  //   //   userId,
  //   //   hasUserInteracted, // ✅ NEW: Log interaction state
  //   // });
  //   console.log("🔍 Chat history effect triggered", {
  //     hasSocket: !!socket,
  //     socketConnected: socket?.connected,
  //     activeChatId,
  //     selectedUser: selectedUser?.name,
  //     userId,
  //     chatVisible: open, // ✅ NEW: Log visibility
  //     hasUserInteracted,
  //   });

  //   // ✅ CRITICAL: If socket exists but not connected, wait for connection
  //   if (socket && !socket.connected) {
  //     console.log(
  //       "⏳ Chat history: Socket exists but not connected, waiting..."
  //     );

  //     const handleConnect = () => {
  //       console.log("🔗 Chat history: Socket connected, loading messages");
  //       loadChatHistory();
  //     };

  //     socket.on("connect", handleConnect);

  //     return () => {
  //       socket.off("connect", handleConnect);
  //     };
  //   }

  //   // ✅ If socket is connected, load immediately
  //   if (socket && socket.connected) {
  //     loadChatHistory();
  //   }

  //   // ✅ EXTRACTED: Chat history loading logic
  //   function loadChatHistory() {
  //     if (
  //       !socket ||
  //       !socket.connected ||
  //       !activeChatId ||
  //       !selectedUser ||
  //       !userId
  //     ) {
  //       console.log("❌ Chat history: Missing required data for loading");
  //       return;
  //     }

  //     console.log("✅ Chat history: Loading messages for", {
  //       chatId: activeChatId,
  //       user: selectedUser.name,
  //       willMarkAsRead: hasUserInteracted, // ✅ NEW: Log if we'll mark as read
  //     });

  //     setIsMessagesLoaded(false);
  //     setError(null);

  //     socket.emit(
  //       "getChatHistory",
  //       { chatId: activeChatId },
  //       async (response: any) => {
  //         console.log("📨 Chat history response:", {
  //           success: response.success,
  //           messageCount: response.messages?.length || 0,
  //         });

  //         if (response.success) {
  //           const messages =
  //             response.messages?.map((msg: any) => ({
  //               _id: msg._id,
  //               content: msg.content,
  //               timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
  //                 hour: "2-digit",
  //                 minute: "2-digit",
  //               }),
  //               sender: msg.sender._id === userId ? "user" : "other",
  //               senderId: msg.sender._id,
  //               type: msg.type,
  //               // 🎯 CRITICAL: Always use database status, never infer from readBy
  //               status: msg.status || "sent", // Use actual database status field
  //             })) || [];

  //           // Handle media URLs
  //           const mediaMessages = messages.filter(
  //             (msg: ChatMessage) => msg.type === "image" || msg.type === "audio"
  //           );

  //           if (mediaMessages.length > 0) {
  //             const newMediaUrls: { [key: string]: string } = {};
  //             for (const msg of mediaMessages) {
  //               try {
  //                 const s3Key = getS3Key(msg.content);
  //                 const presignedUrl = await getMediaUrl(s3Key);
  //                 newMediaUrls[msg._id] = presignedUrl;
  //               } catch (err: any) {
  //                 console.error(
  //                   `Failed to get presigned URL for ${msg._id}:`,
  //                   err
  //                 );
  //               }
  //             }
  //             setMediaUrls((prev) => ({ ...prev, ...newMediaUrls }));
  //           }

  //           // Update chat histories
  //           setChatHistories((prev) => ({
  //             ...prev,
  //             [activeChatId]: messages,
  //           }));

  //           setIsMessagesLoaded(true);

  //           if (socket.connected) {
  //             socket.emit(
  //               "chatOpened",
  //               { chatId: activeChatId },
  //               (response: any) => {
  //                 if (response.success) {
  //                   console.log("👁️ Frontend: Chat opened event sent", {
  //                     chatId: activeChatId,
  //                     markedAsRead: response.markedCount,
  //                   });
  //                 }
  //               }
  //             );
  //           }

  //           const shouldAutoMarkAsRead =
  //             isFirstUserAutoSelected && !hasUserInteracted;

  //           if (shouldAutoMarkAsRead) {
  //             console.log(
  //               "🎯 Auto-marking messages as read for FIRST user via chatOpened event"
  //             );
  //             // Use chatOpened event instead of direct markAsRead
  //             if (socket.connected) {
  //               socket.emit(
  //                 "chatOpened",
  //                 { chatId: activeChatId },
  //                 async (readResponse: any) => {
  //                   if (readResponse.success) {
  //                     console.log(
  //                       "✅ Auto-marked first user messages as read",
  //                       {
  //                         markedCount: readResponse.markedCount,
  //                       }
  //                     );
  //                     await updateChatNotificationCounts();

  //                     // Update local state immediately
  //                     setChatUsers((prev) =>
  //                       prev.map((u) =>
  //                         u.id === activeChatId ? { ...u, unread: 0 } : u
  //                       )
  //                     );
  //                     setFilteredChatUsers((prev) =>
  //                       prev.map((u) =>
  //                         u.id === activeChatId ? { ...u, unread: 0 } : u
  //                       )
  //                     );
  //                   } else {
  //                     console.error(
  //                       "❌ Failed to auto-mark messages as read:",
  //                       readResponse.error
  //                     );
  //                   }
  //                 }
  //               );
  //             }
  //           } else if (hasUserInteracted) {
  //             console.log("👤 User has interacted, using chatOpened event");
  //             socket.emit(
  //               "chatOpened",
  //               { chatId: activeChatId },
  //               async (readResponse: any) => {
  //                 if (readResponse.success) {
  //                   console.log("💬 Marked messages as read via interaction", {
  //                     markedCount: readResponse.markedCount,
  //                   });
  //                   await updateChatNotificationCounts();
  //                 }
  //               }
  //             );
  //           } else {
  //             console.log(
  //               "🤖 Other user selection, needs manual interaction to mark as read"
  //             );
  //           }
  //           // Scroll to bottom
  //           if (messages.length > 0) {
  //             setTimeout(() => {
  //               scrollToBottom(0, 5, messages.length);
  //             }, 100);
  //           }
  //         } else {
  //           console.error("❌ Chat history loading failed:", response.error);
  //           setError(response.error || "Failed to load chat messages");
  //           setIsMessagesLoaded(true);
  //         }
  //       }
  //     );
  //   }
  // }, [
  //   socket,
  //   activeChatId,
  //   selectedUser,
  //   userId,
  //   shouldScrollToBottom,
  //   hasUserInteracted,
  // ]); // ✅ Add hasUserInteracted to dependencies
  useEffect(() => {
    // ✅ CRITICAL: Only load if chat is visible AND user is selected
    if (!selectedUser || !activeChatId || !open) {
      console.log(
        "🔍 Chat history: Chat not visible or no user selected, skipping"
      );
      return;
    }

    console.log("🔍 Chat history effect triggered", {
      hasSocket: !!socket,
      socketConnected: socket?.connected,
      activeChatId,
      selectedUser: selectedUser?.name,
      userId,
      chatVisible: open, // ✅ NEW: Log visibility
      hasUserInteracted,
    });

    if (socket && !socket.connected) {
      console.log(
        "⏳ Chat history: Socket exists but not connected, waiting..."
      );
      const handleConnect = () => {
        console.log("🔗 Chat history: Socket connected, loading messages");
        loadChatHistory();
      };
      socket.on("connect", handleConnect);
      return () => {
        socket.off("connect", handleConnect);
      };
    }

    if (socket && socket.connected) {
      loadChatHistory();
    }

    function loadChatHistory() {
      if (
        !socket ||
        !socket.connected ||
        !activeChatId ||
        !selectedUser ||
        !userId
      ) {
        console.log("❌ Chat history: Missing required data for loading");
        return;
      }

      console.log("✅ Chat history: Loading messages for visible chat", {
        chatId: activeChatId,
        user: selectedUser.name,
        isFirstUser: isFirstUserAutoSelected,
        hasUserInteracted,
      });

      setIsMessagesLoaded(false);
      setError(null);

      socket.emit(
        "getChatHistory",
        { chatId: activeChatId },
        async (response: any) => {
          console.log("📨 Chat history response:", {
            success: response.success,
            messageCount: response.messages?.length || 0,
          });

          if (response.success) {
            const messages =
              response.messages?.map((msg: any) => ({
                _id: msg._id,
                content: msg.content,
                timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                sender: msg.sender._id === userId ? "user" : "other",
                senderId: msg.sender._id,
                type: msg.type,
                status: msg.status || "sent",
              })) || [];

            // Handle media URLs
            const mediaMessages = messages.filter(
              (msg: ChatMessage) => msg.type === "image" || msg.type === "audio"
            );

            if (mediaMessages.length > 0) {
              const newMediaUrls: { [key: string]: string } = {};
              for (const msg of mediaMessages) {
                try {
                  const s3Key = getS3Key(msg.content);
                  const presignedUrl = await getMediaUrl(s3Key);
                  newMediaUrls[msg._id] = presignedUrl;
                } catch (err: any) {
                  console.error(
                    `Failed to get presigned URL for ${msg._id}:`,
                    err
                  );
                }
              }
              setMediaUrls((prev) => ({ ...prev, ...newMediaUrls }));
            }

            setChatHistories((prev) => ({
              ...prev,
              [activeChatId]: messages,
            }));

            setIsMessagesLoaded(true);

            // ✅ FIXED: Only auto-mark as read for FIRST user when chat is VISIBLE
            if (isFirstUserAutoSelected && !hasUserInteracted && open) {
              console.log(
                "🎯 Chat is visible - Auto-marking first user messages as read"
              );

              socket.emit(
                "chatOpened",
                { chatId: activeChatId },
                async (readResponse: any) => {
                  if (readResponse.success) {
                    console.log(
                      "✅ Auto-marked first user messages as read (chat visible)",
                      {
                        markedCount: readResponse.markedCount,
                      }
                    );

                    // Update notification counts
                    await updateChatNotificationCounts();

                    // Update local state immediately
                    setChatUsers((prev) =>
                      prev.map((u) =>
                        u.id === activeChatId ? { ...u, unread: 0 } : u
                      )
                    );
                    setFilteredChatUsers((prev) =>
                      prev.map((u) =>
                        u.id === activeChatId ? { ...u, unread: 0 } : u
                      )
                    );
                  } else {
                    console.error(
                      "❌ Failed to auto-mark messages as read:",
                      readResponse.error
                    );
                  }
                }
              );
            } else {
              console.log("🤖 Not auto-marking as read:", {
                isFirstUser: isFirstUserAutoSelected,
                hasInteracted: hasUserInteracted,
                chatVisible: open,
              });
            }

            // Scroll to bottom
            if (messages.length > 0) {
              setTimeout(() => {
                scrollToBottom(0, 5, messages.length);
              }, 100);
            }
          } else {
            console.error("❌ Chat history loading failed:", response.error);
            setError(response.error || "Failed to load chat messages");
            setIsMessagesLoaded(true);
          }
        }
      );
    }
  }, [
    socket,
    activeChatId,
    selectedUser,
    userId,
    shouldScrollToBottom,
    hasUserInteracted,
    open,
    isFirstUserAutoSelected,
  ]); // ✅ Added 'open' dependency

  useEffect(() => {
    // Cleanup function when component unmounts or chat closes
    return () => {
      if (socket && socket.connected && activeChatId) {
        socket.emit("chatClosed", { chatId: activeChatId }, (response: any) => {
          console.log("👁️ Frontend: Chat closed on unmount", {
            chatId: activeChatId,
            success: response?.success,
          });
        });
      }
    };
  }, [socket, activeChatId]);
  // Rest of the component methods remain the same...
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  useEffect(() => {
    const updateProgress = () => {
      Object.entries(audioRefs.current).forEach(([messageId, audio]) => {
        if (audio && isPlaying[messageId]) {
          const progress = (audio.currentTime / audio.duration) * 100;
          setAudioProgress((prev) => ({
            ...prev,
            [messageId]: isNaN(progress) ? 0 : progress,
          }));
        }
      });
    };

    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      const staleThreshold = 10000; // 10 seconds

      setTypingStates((prev) => {
        const updated = { ...prev };
        let hasChanges = false;

        Object.keys(updated).forEach((chatId) => {
          const validUsers = updated[chatId].filter(
            (user) => now - user.timestamp < staleThreshold
          );

          if (validUsers.length !== updated[chatId].length) {
            updated[chatId] = validUsers;
            hasChanges = true;
          }
        });

        return hasChanges ? updated : prev;
      });

      setChatUsers((prev) =>
        prev.map((user) => {
          const typingUsers = typingStates[user.id] || [];
          const validTypingUsers = typingUsers.filter(
            (tu) => now - tu.timestamp < staleThreshold
          );

          return {
            ...user,
            isTyping: validTypingUsers.length > 0,
            typingUsers: validTypingUsers,
          };
        })
      );

      setFilteredChatUsers((prev) =>
        prev.map((user) => {
          const typingUsers = typingStates[user.id] || [];
          const validTypingUsers = typingUsers.filter(
            (tu) => now - tu.timestamp < staleThreshold
          );

          return {
            ...user,
            isTyping: validTypingUsers.length > 0,
            typingUsers: validTypingUsers,
          };
        })
      );
    }, 5000);

    return () => clearInterval(cleanupInterval);
  }, [typingStates]);

  const handleTypingStart = () => {
    if (!socket || !activeChatId || !selectedUser) return;

    const now = Date.now();
    // 🎯 RATE LIMITING: Max 2 events per second
    if (now - lastTypingTimeRef.current < 500) return;

    lastTypingTimeRef.current = now;

    // Only emit if not already typing
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("userTyping", {
        chatId: activeChatId,
        userName: `${user?.firstName} ${user?.lastName}`.trim() || "User",
      });
      console.log("🎯 Frontend: Started typing, emitted userTyping");
    }

    // 🎯 CRITICAL: Clear previous timeout and set new 3-second timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      console.log("🎯 Frontend: 3-second timeout reached, stopping typing");
      handleTypingStop();
    }, 3000); // 🎯 FIXED: 3 seconds instead of 15
  };

  const handleTypingStop = () => {
    if (!socket || !activeChatId || !isTyping) return;

    setIsTyping(false);
    socket.emit("userStoppedTyping", { chatId: activeChatId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };
  const getS3Key = (url: string): string => {
    const bucketUrl = `https://${import.meta.env.VITE_S3_BUCKET_NAME}.s3.${
      import.meta.env.VITE_AWS_REGION
    }.amazonaws.com/`;
    let key = url;
    if (url.startsWith(bucketUrl)) {
      key = url.replace(bucketUrl, "");
    } else if (url.includes("/images/") || url.includes("/audio/")) {
      key = url.split("/").slice(-2).join("/");
    } else {
      key = url;
    }
    key = key.split("?")[0];
    return key;
  };

  // const handleUserClick = async (user: ChatUser) => {
  //   console.log("💬 User clicked:", user.name, "Chat ID:", user.id);
  //   if (
  //     socket &&
  //     socket.connected &&
  //     activeChatId &&
  //     activeChatId !== user.id
  //   ) {
  //     socket.emit("chatClosed", { chatId: activeChatId }, (response: any) => {
  //       console.log("👁️ Frontend: Previous chat closed", {
  //         previousChatId: activeChatId,
  //         success: response?.success,
  //       });
  //     });
  //   }

  //   setSelectedUser(user);
  //   setActiveChatId(user.id);
  //   setError(null);
  //   setImagePreview(null);
  //   setAudioBlob(null);
  //   setIsPlaying({});
  //   setMediaUrls({});
  //   setAudioProgress({});
  //   setShouldScrollToBottom(true);
  //   setIsMessagesLoaded(false);

  //   // ✅ CRITICAL: Mark this as user-initiated interaction
  //   setHasUserInteracted(true);

  //   // ✅ IMMEDIATELY reset unread count in UI for better UX
  //   setChatUsers((prev) =>
  //     prev.map((u) => (u.id === user.id ? { ...u, unread: 0 } : u))
  //   );
  //   setFilteredChatUsers((prev) =>
  //     prev.map((u) => (u.id === user.id ? { ...u, unread: 0 } : u))
  //   );

  //   try {
  //     const isOnline = await checkUserOnlineStatus(user?.otherUserId);
  //     setSelectedUser((prev) =>
  //       prev ? { ...prev, isOnline } : { ...user, isOnline }
  //     );
  //     setChatUsers((prev) =>
  //       prev.map((u) => (u.id === user.id ? { ...u, isOnline } : u))
  //     );
  //     setFilteredChatUsers((prev) =>
  //       prev.map((u) => (u.id === user.id ? { ...u, isOnline } : u))
  //     );
  //   } catch (error: any) {
  //     console.error("Failed to check online status:", error);
  //     setError("Failed to load user online status");
  //   }

  //   // ✅ The markAsRead will be handled in the chat history loading effect
  //   // since hasUserInteracted is now true

  //   setIsSidebarOpen(false);
  // };

  const handleUserClick = async (user: ChatUser) => {
    console.log("💬 User clicked:", user.name, "Chat ID:", user.id);

    // Close previous chat if different
    if (
      socket &&
      socket.connected &&
      activeChatId &&
      activeChatId !== user.id
    ) {
      socket.emit("chatClosed", { chatId: activeChatId }, (response: any) => {
        console.log("👁️ Frontend: Previous chat closed", {
          previousChatId: activeChatId,
          success: response?.success,
        });
      });
    }

    setSelectedUser(user);
    setActiveChatId(user.id);
    setError(null);
    setImagePreview(null);
    setAudioBlob(null);
    setIsPlaying({});
    setMediaUrls({});
    setAudioProgress({});
    setShouldScrollToBottom(true);
    setIsMessagesLoaded(false);

    // ✅ CRITICAL: Mark this as user-initiated interaction
    setHasUserInteracted(true);
    setIsFirstUserAutoSelected(false); // ✅ Not auto-selected anymore

    // ✅ IMMEDIATELY reset unread count in UI for better UX
    setChatUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, unread: 0 } : u))
    );
    setFilteredChatUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, unread: 0 } : u))
    );

    try {
      if (user.otherUserId) {
        const isOnline = await checkUserOnlineStatus(user.otherUserId);
        setSelectedUser((prev) =>
          prev ? { ...prev, isOnline } : { ...user, isOnline }
        );
        setChatUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, isOnline } : u))
        );
        setFilteredChatUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, isOnline } : u))
        );
      }
    } catch (error: any) {
      console.error("Failed to check online status:", error);
      setError("Failed to load user online status");
    }

    setIsSidebarOpen(false);
  };

  const handleSendMessage = () => {
    if (!socket || !activeChatId || newMessage.trim() === "") {
      setError("Cannot send message: please select a chat and enter a message");
      return;
    }

    // ✅ ADD: Stop typing indicator when sending message
    if (isTyping) {
      handleTypingStop();
    }
    if (!socket.connected) {
      setError("Chat server disconnected, please try again later");
      return;
    }

    if (isOnline.role === "mentee" && selectedUser && !selectedUser.isActive) {
      setError("Cannot send message: Booking is not confirmed");
      return;
    }

    socket.emit(
      "sendMessage",
      { chatId: activeChatId, content: newMessage, type: "text" },
      (response: any) => {
        if (response.success) {
          setNewMessage("");
          setShouldScrollToBottom(true);
          scrollToBottom(0, 5, (chatHistories[activeChatId] || []).length + 1);
          setChatUsers((prev) => {
            const updatedUsers = prev.map((user) =>
              user.id === activeChatId
                ? {
                    ...user,
                    lastMessage: newMessage,
                    timestamp: new Date().toISOString(),
                    unread: user.unread || 0,
                  }
                : user
            );
            return updatedUsers.sort((a, b) =>
              b.timestamp && a.timestamp
                ? new Date(b.timestamp).getTime() -
                  new Date(a.timestamp).getTime()
                : b.timestamp
                ? -1
                : a.timestamp
                ? 1
                : 0
            );
          });
          setFilteredChatUsers((prev) => {
            const updatedUsers = prev.map((user) =>
              user.id === activeChatId
                ? {
                    ...user,
                    lastMessage: newMessage,
                    timestamp: new Date().toISOString(),
                    unread: user.unread || 0,
                  }
                : user
            );
            return updatedUsers.sort((a, b) =>
              b.timestamp && a.timestamp
                ? new Date(b.timestamp).getTime() -
                  new Date(a.timestamp).getTime()
                : b.timestamp
                ? -1
                : a.timestamp
                ? 1
                : 0
            );
          });
        } else {
          setError(response.error || "Failed to send message");
        }
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && socket && activeChatId && socket.connected) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      if (
        isOnline.role === "mentee" &&
        selectedUser &&
        !selectedUser.isActive
      ) {
        setError("Cannot send message: Booking is not confirmed");
        return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        scrollToBottom(0, 5, (chatHistories[activeChatId] || []).length);

        try {
          const url = await uploadToS3WithPresignedUrl(
            file,
            "images",
            file.type
          );
          socket.emit(
            "sendMessage",
            { chatId: activeChatId, content: url, type: "image" },
            async (response: any) => {
              if (response.error) {
                setError(response.error || "Failed to send image");
                setImagePreview(null);
              } else {
                const s3Key = getS3Key(url);
                const presignedUrl = await getMediaUrl(s3Key);
                setMediaUrls((prev) => ({
                  ...prev,
                  [response.message._id]: presignedUrl,
                }));
                setImagePreview(null);
                setShouldScrollToBottom(true);
                scrollToBottom(
                  0,
                  5,
                  (chatHistories[activeChatId] || []).length + 1
                );
              }
            }
          );
        } catch (error: any) {
          console.error("Image upload error:", error);
          setError(error.message || "Failed to upload image");
          setImagePreview(null);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setError("Cannot send file: chat server disconnected or invalid state");
    }
  };

  const startRecording = async () => {
    if (isOnline.role === "mentee" && selectedUser && !selectedUser.isActive) {
      setError("Cannot send message: Booking is not confirmed");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
        scrollToBottom(0, 5, (chatHistories[activeChatId] || []).length);

        try {
          const file = new File([blob], `recording_${Date.now()}.webm`, {
            type: "audio/webm",
          });
          const url = await uploadToS3WithPresignedUrl(
            file,
            "audio",
            "audio/webm"
          );
          socket.emit(
            "sendMessage",
            { chatId: activeChatId, content: url, type: "audio" },
            async (response: any) => {
              if (response.error) {
                setError(response.error || "Failed to send audio");
                setAudioBlob(null);
                setRecordingTime(0);
              } else {
                const s3Key = getS3Key(url);
                const presignedUrl = await getMediaUrl(s3Key);
                setMediaUrls((prev) => ({
                  ...prev,
                  [response.message._id]: presignedUrl,
                }));
                setAudioBlob(null);
                setRecordingTime(0);
                setShouldScrollToBottom(true);
                scrollToBottom(
                  0,
                  5,
                  (chatHistories[activeChatId] || []).length + 1
                );
              }
            }
          );
        } catch (error: any) {
          console.error("Audio upload error:", error);
          setError(error.message || "Failed to upload audio");
          setAudioBlob(null);
          setRecordingTime(0);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Recording error:", error);
      setError("Failed to access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const toggleAudio = async (messageId: string) => {
    const audio = audioRefs.current[messageId];
    if (audio) {
      try {
        if (isPlaying[messageId]) {
          await audio.pause();
          setIsPlaying((prev) => ({ ...prev, [messageId]: false }));
        } else {
          await audio.play();
          setIsPlaying((prev) => ({ ...prev, [messageId]: true }));
        }
      } catch (e) {
        console.error("Audio playback error:", e);
        setError("Failed to play audio: " + (e as Error).message);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const isImageUrl = (content: string) => {
    return /\.(png|jpg|jpeg|gif)$/i.test(content);
  };

  const isAudioUrl = (content: string) => {
    return /\.(webm|mp3|wav)$/i.test(content);
  };

  const renderMessageStatus = (status?: string) => {
    // 🎯 DEBUG: Log status rendering for debugging
    console.log("🎨 Rendering message status:", { status });

    if (!status) return null;

    if (status === "sent") {
      // Single white tick for sent
      return <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white opacity-90" />;
    } else if (status === "delivered") {
      // Double white ticks for delivered
      return (
        <CheckCheck className="h-3 w-3 sm:h-4 sm:w-4 text-white opacity-90" />
      );
    } else if (status === "read") {
      // Double blue ticks for read
      return <CheckCheck className="h-3 w-3 sm:h-4 sm:w-4 text-blue-700" />;
    } else if (status === "failed") {
      // Red X for failed
      return <X className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />;
    }

    return null;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleUpdateBookingStatus = async (
    bookingId: string,
    status: "pending" | "confirmed" | "completed"
  ) => {
    setPendingBookingId(bookingId);
    setPendingStatus(status);
    setIsConfirmModalOpen(true);
  };

  const confirmUpdateBookingStatus = async () => {
    if (!pendingBookingId || !pendingStatus) return;

    try {
      await updateBookingStatus(pendingBookingId, pendingStatus);
      setChatUsers((prev) =>
        prev.map((user) =>
          user.bookingId === pendingBookingId
            ? {
                ...user,
                bookingStatus: pendingStatus,
                isActive: pendingStatus === "confirmed",
              }
            : user
        )
      );
      setFilteredChatUsers((prev) =>
        prev.map((user) =>
          user.bookingId === pendingBookingId
            ? {
                ...user,
                bookingStatus: pendingStatus,
                isActive: pendingStatus === "confirmed",
              }
            : user
        )
      );
      if (selectedUser?.bookingId === pendingBookingId) {
        setSelectedUser((prev) =>
          prev
            ? {
                ...prev,
                bookingStatus: pendingStatus,
                isActive: pendingStatus === "confirmed",
              }
            : null
        );
      }
      setIsConfirmModalOpen(false);
      setPendingBookingId(null);
      setPendingStatus(null);
    } catch (error: any) {
      setError(error.message || "Failed to update booking status");
      setIsConfirmModalOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  const renderTypingIndicator = (user: ChatUser) => {
    if (!user.isTyping || !user.typingUsers?.length) {
      return user.lastMessage || "Start chatting now!";
    }

    const typingUsers = user.typingUsers;
    if (typingUsers.length === 1) {
      return <span className="text-indigo-500 italic">typing...</span>;
    } else if (typingUsers.length === 2) {
      return (
        <span className="text-indigo-500 italic">
          {typingUsers[0].userName} and {typingUsers[1].userName} are typing...
        </span>
      );
    } else {
      return (
        <span className="text-indigo-500 italic">
          {typingUsers[0].userName} and {typingUsers.length - 1} others are
          typing...
        </span>
      );
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="p-0 gap-0 bg-gradient-to-r from-blue-50 to-indigo-50 overflow-x-hidden"
        style={{ width: "100vw", maxWidth: "1200px" }}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Chat</SheetTitle>
          <SheetDescription>Chat with mentors or mentees</SheetDescription>
        </SheetHeader>
        <div className="flex h-full">
          {/* Sidebar: Hidden on mobile, toggled with button */}
          <div
            className={`fixed sm:static inset-y-0 left-0 z-20 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-300 ease-in-out w-[280px] sm:w-[320px] ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full sm:translate-x-0"
            }`}
          >
            <div className="p-2 sm:p-4 border-b border-gray-100 bg-white flex justify-between items-center">
              <h1 className="text-lg bold sm:text-2xl font-bold flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                <img
                  src={Logo}
                  alt="Logo"
                  className="w-10 h-10 sm:w-10 sm:h-10"
                />
                <span>Chat ONE</span>
              </h1>
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden"
                onClick={toggleSidebar}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-2 sm:p-3">
              <div className="relative mb-2 sm:mb-3">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations"
                  className="pl-9 bg-gray-50 border-gray-200 text-gray-700 placeholder:text-gray-400 focus:border-indigo-300 focus:ring-indigo-300 transition-all text-sm sm:text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="h-[calc(100vh-120px)] sm:h-[calc(100vh-150px)]">
              <div className="space-y-1 px-2">
                {filteredChatUsers.length > 0 ? (
                  filteredChatUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserClick(user)}
                      className={`w-full flex items-center p-2 sm:p-3 rounded-lg transition-all duration-200 hover:bg-gray-50
                        ${
                          selectedUser?.id === user.id
                            ? "bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-500"
                            : ""
                        }`}
                      disabled={selectedUser?.id === user.id}
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-white shadow-sm">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-400 text-white">
                            {user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        {user.isOnline && (
                          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-500 border-1.5 border-white"></span>
                        )}
                      </div>
                      <div className="flex-1 ml-2 sm:ml-3 text-left">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800 text-sm sm:text-base">
                            {user.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(user.timestamp)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[120px] sm:max-w-[150px]">
                            {renderTypingIndicator(user)}
                          </p>
                          {typeof user.unread === "number" &&
                            user.unread > 0 &&
                            user.id !== activeChatId && (
                              <span className="bg-indigo-500 text-white rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-xs font-bold">
                                {user.unread}
                              </span>
                            )}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <p className="text-gray-600 text-sm">
                      No conversations found
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Try adjusting your search
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          <div className="flex-1 flex flex-col">
            {selectedUser ? (
              <>
                <div className="p-2 sm:p-4 border-b border-gray-200 bg-white shadow-sm flex justify-between items-center">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="sm:hidden"
                      onClick={toggleSidebar}
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-indigo-100 shadow-sm">
                      <AvatarImage src={selectedUser.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-400 text-white">
                        {selectedUser.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
                        {selectedUser.name}
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center">
                        {selectedUser.isOnline ? (
                          <>
                            <span className="h-2 w-2 rounded-full bg-green-500 inline-block mr-1"></span>
                            Online
                          </>
                        ) : (
                          "Last seen recently"
                        )}
                      </p>
                    </div>
                    {connectionState !== "connected" && (
                      <div className="flex items-center space-x-2">
                        {connectionState === "reconnecting" ? (
                          <div className="flex items-center space-x-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md text-xs">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>Reconnecting...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs">
                            <X className="h-3 w-3" />
                            <span>Disconnected</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    {isOnline.role === "mentor" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-lg h-8 w-8 sm:h-9 sm:w-9 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                          >
                            <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white">
                          {["pending", "confirmed", "completed"].map(
                            (status) => (
                              <DropdownMenuItem
                                key={status}
                                onClick={() =>
                                  handleUpdateBookingStatus(
                                    selectedUser.bookingId,
                                    status as
                                      | "pending"
                                      | "confirmed"
                                      | "completed"
                                  )
                                }
                                disabled={selectedUser.bookingStatus === status}
                              >
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </DropdownMenuItem>
                            )
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
                <ScrollArea
                  className="flex-1 p-2 sm:p-4"
                  ref={scrollAreaRef}
                  onScroll={handleScroll}
                  style={{
                    backgroundImage: `url(${Pattern})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundBlendMode: "soft-light",
                    backgroundColor: "rgba(240, 245, 255, 0.95)",
                  }}
                >
                  <style>
                    {`
                      [data-radix-scroll-area-viewport] {
                        overflow-y: auto !important;
                        height: 100% !important;
                      }
                    `}
                  </style>
                  {!isMessagesLoaded ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 animate-spin" />
                        <p className="text-sm text-gray-600">
                          Loading messages...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-center mb-4 sm:mb-6">
                        <div className="px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-600 shadow-sm">
                          Today
                        </div>
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        {(chatHistories[activeChatId || ""] || []).map(
                          (message) => (
                            <div
                              key={message._id}
                              className={`flex ${
                                message.sender === "user"
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-2 sm:p-3 shadow-sm ${
                                  message.sender === "user"
                                    ? "bg-gradient-to-r from-indigo-500 to-blue-400 text-white rounded-br-none"
                                    : "bg-gradient-to-r from-violet-400 to-blue-400 text-white rounded-bl-none"
                                }`}
                              >
                                {message.type === "image" &&
                                isImageUrl(message.content) ? (
                                  <div className="relative w-[150px] sm:w-[200px] max-h-[150px] sm:max-h-[200px] overflow-hidden rounded-lg bg-gray-100">
                                    {mediaUrls[message._id] ? (
                                      <img
                                        src={mediaUrls[message._id]}
                                        alt="Chat image"
                                        className="w-full h-auto object-contain"
                                        onError={() =>
                                          setError("Failed to load image")
                                        }
                                      />
                                    ) : (
                                      <p className="text-sm text-gray-500">
                                        Loading image...
                                      </p>
                                    )}
                                  </div>
                                ) : message.type === "audio" &&
                                  isAudioUrl(message.content) ? (
                                  <div className="w-[150px] sm:w-[200px] p-2 bg-gray-100 rounded-lg flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => toggleAudio(message._id)}
                                      className="h-6 w-6 sm:h-8 sm:w-8"
                                    >
                                      {isPlaying[message._id] ? (
                                        <Pause
                                          className="h-3 w-3 sm:h-4 sm:w-4"
                                          color="#000000"
                                        />
                                      ) : (
                                        <Play
                                          className="h-3 w-3 sm:h-4 sm:w-4"
                                          color="#000000"
                                        />
                                      )}
                                    </Button>
                                    <audio
                                      ref={(el) => {
                                        if (el)
                                          audioRefs.current[message._id] = el;
                                      }}
                                      src={mediaUrls[message._id]}
                                      className="hidden"
                                      preload="auto"
                                      onEnded={() =>
                                        setIsPlaying((prev) => ({
                                          ...prev,
                                          [message._id]: false,
                                        }))
                                      }
                                    />
                                    <div className="flex-1 h-2 bg-gray-300 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-indigo-500"
                                        style={{
                                          width: `${
                                            audioProgress[message._id] || 0
                                          }%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-xs sm:text-sm">
                                    {message.content}
                                  </p>
                                )}
                                <div className="flex items-center justify-end mt-1 gap-1">
                                  <span
                                    className={`text-xs opacity-80 ${
                                      message.sender === "user"
                                        ? "text-blue-100"
                                        : "text-indigo-100"
                                    }`}
                                  >
                                    {message.timestamp}
                                  </span>
                                  {message.sender === "user" && (
                                    <span className="text-xs text-blue-100">
                                      {renderMessageStatus(message.status)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                        {imagePreview && (
                          <div className="flex justify-end">
                            <div className="max-w-[85%] sm:max-w-[70%] rounded-2xl p-2 sm:p-3 shadow-sm bg-gradient-to-r from-indigo-500 to-blue-400 text-white rounded-br-none relative">
                              <div className="relative w-[150px] sm:w-[200px] max-h-[150px] sm:max-h-[200px] overflow-hidden rounded-lg bg-gray-100">
                                <img
                                  src={imagePreview}
                                  alt="Image preview"
                                  className="w-full h-auto object-contain"
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 sm:top-2 sm:right-2 text-white"
                                onClick={() => setImagePreview(null)}
                              >
                                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              <div className="flex items-center justify-end mt-1">
                                <span className="text-xs text-blue-100">
                                  Uploading...
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        {audioBlob && (
                          <div className="flex justify-end">
                            <div className="max-w-[85%] sm:max-w-[70%] rounded-2xl p-2 sm:p-3 shadow-sm bg-gradient-to-r from-indigo-500 to-blue-400 text-white rounded-br-none relative">
                              <div className="w-[150px] sm:w-[200px] p-2 bg-gray-100 rounded-lg flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    const audio = new Audio(
                                      URL.createObjectURL(audioBlob)
                                    );
                                    audio
                                      .play()
                                      .catch((e) =>
                                        setError(
                                          "Preview playback error: " + e.message
                                        )
                                      );
                                  }}
                                  className="h-6 w-6 sm:h-8 sm:w-8"
                                >
                                  <Play
                                    className="h-3 w-3 sm:h-4 sm:w-4"
                                    color="#000000"
                                  />
                                </Button>
                                <audio
                                  controls
                                  src={URL.createObjectURL(audioBlob)}
                                  className="hidden"
                                />
                                <div className="flex-1 h-2 bg-gray-300 rounded-full overflow-hidden">
                                  <div className="h-full bg-indigo-500 w-0"></div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 sm:top-2 sm:right-2 text-white"
                                onClick={() => setAudioBlob(null)}
                              >
                                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              <div className="flex items-center justify-end mt-1">
                                <span className="text-xs text-blue-100">
                                  Uploading...
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={lastMessageRef} />
                      </div>
                    </div>
                  )}
                </ScrollArea>

                <div className="p-1 sm:p-2 border-t border-gray-200 bg-white relative shadow-sm">
                  {isOnline.role === "mentee" &&
                    selectedUser &&
                    !selectedUser.isActive && (
                      <div className="p-2 bg-red-100 text-red-600 text-center text-xs sm:text-sm">
                        This chat is inactive. Please wait for the booking to be
                        confirmed to send messages.
                      </div>
                    )}
                  {isOnline.role === "mentor" &&
                    selectedUser &&
                    !selectedUser.isActive && (
                      <div className="p-2 bg-red-100 text-red-600 text-center text-xs sm:text-sm">
                        Service is completed.
                      </div>
                    )}
                  {showEmojiPicker && (
                    <div
                      ref={emojiPickerRef}
                      className="absolute bottom-12 left-2 sm:left-4 z-10 shadow-lg rounded-lg overflow-hidden max-w-[90vw] sm:max-w-[400px]"
                    >
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  )}
                  {isRecording && (
                    <div className="absolute bottom-12 left-2 sm:left-4 right-2 sm:right-4 bg-white p-2 sm:p-4 rounded-lg shadow-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mic className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 animate-pulse" />
                        <span className="text-xs sm:text-sm text-gray-700">
                          Recording: {formatTime(recordingTime)}
                        </span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={stopRecording}
                      >
                        Stop
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 rounded-full p-1 sm:p-2 pl-3 sm:pl-4 pr-1 border border-gray-200 hover:border-blue-200 transition-colors shadow-sm">
                    <Input
                      ref={inputRef}
                      placeholder="Type your message here..."
                      value={newMessage}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewMessage(value);

                        // 🎯 IMPROVED: More responsive typing detection
                        if (value.length > 0) {
                          if (!isTyping) {
                            handleTypingStart();
                          } else {
                            // Reset timeout if still typing
                            if (typingTimeoutRef.current) {
                              clearTimeout(typingTimeoutRef.current);
                            }
                            typingTimeoutRef.current = setTimeout(() => {
                              handleTypingStop();
                            }, 3000);
                          }
                        } else if (value.length === 0 && isTyping) {
                          handleTypingStop();
                        }
                      }}
                      onKeyPress={handleKeyPress}
                      onFocus={handleInputFocus} // ✅ NEW: Detect when user starts typing
                      className="flex-1 border-none bg-transparent text-gray-700 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm sm:text-base"
                      disabled={
                        isRecording ||
                        (isOnline.role === "mentee" &&
                          selectedUser &&
                          !selectedUser.isActive)
                      }
                    />
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                        className="rounded-full h-8 w-8 sm:h-9 sm:w-9 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                        disabled={
                          isRecording ||
                          (isOnline.role === "mentee" &&
                            selectedUser &&
                            !selectedUser.isActive)
                        }
                      >
                        <Smile className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={triggerFileInput}
                        className="rounded-full h-8 w-8 sm:h-9 sm:w-9 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                        disabled={
                          isRecording ||
                          (isOnline.role === "mentee" &&
                            selectedUser &&
                            !selectedUser.isActive)
                        }
                      >
                        <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          isRecording ? stopRecording() : startRecording()
                        }
                        className={`rounded-full h-8 w-8 sm:h-9 sm:w-9 ${
                          isRecording
                            ? "text-red-600 hover:text-red-600 hover:bg-red-50"
                            : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                        disabled={
                          isOnline.role === "mentee" &&
                          selectedUser &&
                          !selectedUser.isActive
                        }
                      >
                        <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <Button
                        size="icon"
                        onClick={handleSendMessage}
                        className="rounded-full h-8 w-8 sm:h-10 sm:w-10 bg-blue-500 hover:bg-blue-600 text-white ml-1 shadow-sm transition-colors"
                        disabled={
                          isRecording ||
                          (isOnline.role === "mentee" &&
                            selectedUser &&
                            !selectedUser.isActive)
                        }
                      >
                        <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-blue-200 to-blue-100">
                <div className="text-center p-4 sm:p-8 max-w-md">
                  <div className="mx-auto h-16 w-16 sm:h-24 sm:w-24 rounded-full bg-white shadow-md flex items-center justify-center mb-4 sm:mb-6">
                    <Send className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500" />
                  </div>
                  <h3 className="font-bold text-lg sm:text-2xl text-gray-800 mb-2 sm:mb-3">
                    Start Messaging
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
                    Select a conversation from the list to start chatting or
                    search for someone specific
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="sm:hidden"
                    onClick={toggleSidebar}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          <ConfirmationModal
            open={isConfirmModalOpen}
            onOpenChange={(open) => {
              setIsConfirmModalOpen(open);
              if (!open) {
                setPendingBookingId(null);
                setPendingStatus(null);
              }
            }}
            onConfirm={confirmUpdateBookingStatus}
            title="Confirm Booking Status Update"
            description={`Are you sure you want to update the booking status to "${
              pendingStatus || "unknown"
            }"?`}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Chatting;
