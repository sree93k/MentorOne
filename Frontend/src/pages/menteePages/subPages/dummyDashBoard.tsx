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
  Moon,
  Sun,
  ArrowLeft,
  Phone,
  Video,
  Settings,
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

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("chatDarkMode") === "true" ||
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    }
    return false;
  });

  // All your existing state variables
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
  const [isMobile, setIsMobile] = useState(false);

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

  // Dark mode toggle
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("chatDarkMode", newDarkMode.toString());
  };

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-close sidebar on mobile when user is selected
  useEffect(() => {
    if (isMobile && selectedUser) {
      setIsSidebarOpen(false);
    }
  }, [selectedUser, isMobile]);

  // All your existing methods remain exactly the same...
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

    socketInstance.on("connect", () => {
      console.log("💬 Connected to chat socket");
      setConnectionState("connected");
      setError(null);
      setReconnectAttempts(0);
      updateChatNotificationCounts();
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("🔌 Frontend: Socket disconnected", { reason });
      setConnectionState("disconnected");
    });

    socketInstance.on("reconnecting", (attemptNumber) => {
      console.log("🔄 Frontend: Socket reconnecting", { attemptNumber });
      setConnectionState("reconnecting");
      setReconnectAttempts(attemptNumber);
    });

    socketInstance.on("reconnect", (attemptNumber) => {
      console.log("✅ Frontend: Socket reconnected", { attemptNumber });
      setConnectionState("connected");
      setReconnectAttempts(0);
    });

    socketInstance.on("reconnect_failed", () => {
      console.error("❌ Frontend: Socket reconnection failed");
      setConnectionState("disconnected");
      setError("Connection lost. Please refresh the page.");
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error.message);
      setConnectionState("disconnected");
      setError(`Failed to connect to chat server: ${error.message}`);
    });

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
        if (data.userId === userId) {
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
          setMediaUrls((prev) => ({ ...prev, [message._id]: presignedUrl }));
        } catch (err: any) {
          console.error(
            `Failed to get presigned URL for received message ${message._id}:`,
            err
          );
          setError(`Failed to load media for message ${message._id}`);
        }
      }

      if (
        message.chat.toString() === activeChatId &&
        message.sender._id !== userId &&
        hasUserInteracted &&
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

    // Continue with all your other socket event listeners...
    socketInstance.on("messageDelivered", ({ messageId, chatId }) => {
      setChatHistories((prev) => {
        const updatedMessages = (prev[chatId] || []).map((msg) =>
          msg._id === messageId ? { ...msg, status: "delivered" } : msg
        );
        return { ...prev, [chatId]: updatedMessages };
      });
    });

    socketInstance.on("messagesRead", ({ chatId, userId: readByUserId }) => {
      setChatHistories((prev) => {
        const updatedMessages = (prev[chatId] || []).map((msg) =>
          msg.sender === "user" && msg.senderId === userId
            ? { ...msg, status: "read" }
            : msg
        );
        return { ...prev, [chatId]: updatedMessages };
      });

      setChatUsers((prev) =>
        prev.map((user) => (user.id === chatId ? { ...user, unread: 0 } : user))
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
        setChatHistories((prev) => {
          const updatedMessages = (prev[chatId] || []).map((msg) =>
            msg._id === messageId ? { ...msg, status: "read" } : msg
          );
          return { ...prev, [chatId]: updatedMessages };
        });
      }
    );

    socketInstance.on(
      "messagesDelivered",
      ({ chatId, userId: deliveredToUserId, count }) => {
        console.log("📨 Frontend: Messages delivered confirmation", {
          chatId,
          deliveredToUserId,
          count,
        });
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
      if (isTyping) {
        handleTypingStop();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      socketInstance.disconnect();
    };
  }, [userId, dispatch]);

  // Continue with all your other useEffect hooks...
  useEffect(() => {
    const chatArea = scrollAreaRef.current;
    const handleFirstInteraction = () => {
      if (!hasUserInteracted && selectedUser && activeChatId) {
        console.log("🎯 First interaction detected with auto-selected chat");
        setHasUserInteracted(true);
        setTimeout(() => {
          markCurrentChatAsRead();
        }, 500);
      }
    };

    if (chatArea && selectedUser && !hasUserInteracted) {
      chatArea.addEventListener("click", handleFirstInteraction);
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
    if (open && chatUsers.length > 0 && !selectedUser) {
      const firstUser = chatUsers[0];
      console.log(
        "👤 Chat is now visible - Auto-selecting first user:",
        firstUser.name
      );

      setSelectedUser(firstUser);
      setActiveChatId(firstUser.id);
      setIsFirstUserAutoSelected(true);
      setHasUserInteracted(false);

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

  useEffect(() => {
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
      chatVisible: open,
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

            setChatHistories((prev) => ({ ...prev, [activeChatId]: messages }));
            setIsMessagesLoaded(true);

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

                    await updateChatNotificationCounts();
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
  ]);

  useEffect(() => {
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
      const staleThreshold = 10000;

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
    if (now - lastTypingTimeRef.current < 500) return;

    lastTypingTimeRef.current = now;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("userTyping", {
        chatId: activeChatId,
        userName: `${user?.firstName} ${user?.lastName}`.trim() || "User",
      });
      console.log("🎯 Frontend: Started typing, emitted userTyping");
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      console.log("🎯 Frontend: 3-second timeout reached, stopping typing");
      handleTypingStop();
    }, 3000);
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

  const handleUserClick = async (user: ChatUser) => {
    console.log("💬 User clicked:", user.name, "Chat ID:", user.id);

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
    setHasUserInteracted(true);
    setIsFirstUserAutoSelected(false);

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
    console.log("🎨 Rendering message status:", { status });

    if (!status) return null;

    if (status === "sent") {
      return <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white opacity-90" />;
    } else if (status === "delivered") {
      return (
        <CheckCheck className="h-3 w-3 sm:h-4 sm:w-4 text-white opacity-90" />
      );
    } else if (status === "read") {
      return <CheckCheck className="h-3 w-3 sm:h-4 sm:w-4 text-blue-300" />;
    } else if (status === "failed") {
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
      return (
        <span className="text-blue-500 dark:text-blue-400 italic">
          typing...
        </span>
      );
    } else if (typingUsers.length === 2) {
      return (
        <span className="text-blue-500 dark:text-blue-400 italic">
          {typingUsers[0].userName} and {typingUsers[1].userName} are typing...
        </span>
      );
    } else {
      return (
        <span className="text-blue-500 dark:text-blue-400 italic">
          {typingUsers[0].userName} and {typingUsers.length - 1} others are
          typing...
        </span>
      );
    }
  };

  const themeClasses = darkMode ? "dark" : "";

  return (
    <div className={themeClasses}>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="p-0 gap-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-x-hidden border-l border-slate-200 dark:border-slate-700"
          style={{ width: "100vw", maxWidth: "1200px" }}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Chat</SheetTitle>
            <SheetDescription>Chat with mentors or mentees</SheetDescription>
          </SheetHeader>

          <div className="flex h-full">
            {/* Sidebar */}
            <div
              className={`${
                isMobile ? "fixed" : "static"
              } inset-y-0 left-0 z-20 bg-white dark:bg-slate-900 backdrop-blur-xl bg-opacity-95 dark:bg-opacity-95 border-r border-slate-200 dark:border-slate-700 shadow-xl transform transition-all duration-300 ease-in-out w-[300px] sm:w-[360px] ${
                isSidebarOpen || !isMobile
                  ? "translate-x-0"
                  : "-translate-x-full"
              }`}
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={Logo}
                        alt="Logo"
                        className="w-10 h-10 rounded-xl shadow-lg"
                      />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white">ChatONE</h1>
                      <p className="text-blue-100 text-xs">
                        {connectionState === "connected"
                          ? "Online"
                          : "Connecting..."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleDarkMode}
                      className="text-white hover:bg-white/20 rounded-full transition-colors"
                    >
                      {darkMode ? (
                        <Sun className="h-5 w-5" />
                      ) : (
                        <Moon className="h-5 w-5" />
                      )}
                    </Button>

                    {isMobile && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(false)}
                        className="text-white hover:bg-white/20 rounded-full"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Search */}
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-blue-100 focus:border-white focus:ring-white/50 backdrop-blur-sm rounded-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Chat List */}
              <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="p-2">
                  {filteredChatUsers.length > 0 ? (
                    filteredChatUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleUserClick(user)}
                        className={`w-full flex items-center p-3 rounded-2xl transition-all duration-200 mb-2 hover:bg-slate-100 dark:hover:bg-slate-800 group ${
                          selectedUser?.id === user.id
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-[0.98]"
                            : "bg-transparent"
                        }`}
                      >
                        <div className="relative">
                          <Avatar className="h-12 w-12 border-2 border-white shadow-md ring-2 ring-slate-200 dark:ring-slate-600">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                              {user.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          {user.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>

                        <div className="flex-1 ml-3 text-left">
                          <div className="flex justify-between items-center">
                            <span
                              className={`font-semibold text-sm truncate ${
                                selectedUser?.id === user.id
                                  ? "text-white"
                                  : "text-slate-900 dark:text-white"
                              }`}
                            >
                              {user.name}
                            </span>
                            <span
                              className={`text-xs ${
                                selectedUser?.id === user.id
                                  ? "text-blue-100"
                                  : "text-slate-500 dark:text-slate-400"
                              }`}
                            >
                              {formatTimestamp(user.timestamp)}
                            </span>
                          </div>

                          <div className="flex justify-between items-center mt-1">
                            <p
                              className={`text-xs truncate max-w-[150px] ${
                                selectedUser?.id === user.id
                                  ? "text-blue-100"
                                  : "text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              {renderTypingIndicator(user)}
                            </p>

                            {typeof user.unread === "number" &&
                              user.unread > 0 &&
                              user.id !== activeChatId && (
                                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold shadow-lg animate-pulse">
                                  {user.unread > 99 ? "99+" : user.unread}
                                </div>
                              )}
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Search className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                        No conversations found
                      </p>
                      <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
                        Try adjusting your search
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedUser ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-xl bg-opacity-95 dark:bg-opacity-95">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        {isMobile && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(true)}
                            className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                          >
                            <ArrowLeft className="h-5 w-5" />
                          </Button>
                        )}

                        <div className="relative">
                          <Avatar className="h-11 w-11 border-2 border-slate-200 dark:border-slate-600 shadow-md">
                            <AvatarImage src={selectedUser.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                              {selectedUser.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          {selectedUser.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                            {selectedUser.name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                            {selectedUser.isOnline ? (
                              <>
                                <span className="h-2 w-2 rounded-full bg-green-500 inline-block mr-1.5 animate-pulse"></span>
                                Online
                              </>
                            ) : (
                              "Last seen recently"
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {connectionState !== "connected" && (
                          <div className="flex items-center space-x-2">
                            {connectionState === "reconnecting" ? (
                              <div className="flex items-center space-x-1 text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full text-xs font-medium">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                <span>Reconnecting...</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1 text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full text-xs font-medium">
                                <X className="h-3 w-3" />
                                <span>Disconnected</span>
                              </div>
                            )}
                          </div>
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                        >
                          <Phone className="h-5 w-5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                        >
                          <Video className="h-5 w-5" />
                        </Button>

                        {isOnline.role === "mentor" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                              >
                                <MoreVertical className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
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
                                    disabled={
                                      selectedUser.bookingStatus === status
                                    }
                                    className="hover:bg-slate-100 dark:hover:bg-slate-700"
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
                  </div>

                  {/* Messages Area */}
                  <ScrollArea
                    className="flex-1 px-4 py-6"
                    ref={scrollAreaRef}
                    onScroll={handleScroll}
                    style={{
                      background: darkMode
                        ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
                        : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #cbd5e1 100%)",
                      backgroundAttachment: "fixed",
                    }}
                  >
                    {!isMessagesLoaded ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="flex flex-col items-center gap-4">
                          <div className="relative">
                            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                            <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></div>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                            Loading messages...
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 max-w-4xl mx-auto">
                        <div className="flex justify-center mb-6">
                          <div className="px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-xs text-slate-600 dark:text-slate-400 shadow-lg border border-slate-200 dark:border-slate-700">
                            Today
                          </div>
                        </div>

                        {(chatHistories[activeChatId || ""] || []).map(
                          (message) => (
                            <div
                              key={message._id}
                              className={`flex ${
                                message.sender === "user"
                                  ? "justify-end"
                                  : "justify-start"
                              } group`}
                            >
                              <div
                                className={`max-w-[85%] sm:max-w-[70%] rounded-3xl p-4 shadow-lg backdrop-blur-sm transform transition-all duration-200 hover:scale-[1.02] ${
                                  message.sender === "user"
                                    ? "bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white rounded-br-lg ml-12"
                                    : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-lg mr-12 border border-slate-200 dark:border-slate-700"
                                }`}
                              >
                                {message.type === "image" ? (
                                  <div className="relative w-full max-w-[250px] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                                    {mediaUrls[message._id] ? (
                                      <img
                                        src={mediaUrls[message._id]}
                                        alt="Chat image"
                                        className="w-full h-auto object-cover transition-transform duration-200 hover:scale-105"
                                        onError={() =>
                                          setError("Failed to load image")
                                        }
                                      />
                                    ) : (
                                      <div className="w-full h-32 flex items-center justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                                      </div>
                                    )}
                                  </div>
                                ) : message.type === "audio" ? (
                                  <div className="w-[200px] p-3 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center gap-3">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => toggleAudio(message._id)}
                                      className="h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                                    >
                                      {isPlaying[message._id] ? (
                                        <Pause className="h-4 w-4" />
                                      ) : (
                                        <Play className="h-4 w-4" />
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
                                    <div className="flex-1 h-2 bg-slate-300 dark:bg-slate-600 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                                        style={{
                                          width: `${
                                            audioProgress[message._id] || 0
                                          }%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm leading-relaxed">
                                    {message.content}
                                  </p>
                                )}

                                <div className="flex items-center justify-end mt-2 gap-1">
                                  <span
                                    className={`text-xs opacity-75 ${
                                      message.sender === "user"
                                        ? "text-blue-100"
                                        : "text-slate-500 dark:text-slate-400"
                                    }`}
                                  >
                                    {message.timestamp}
                                  </span>
                                  {message.sender === "user" && (
                                    <span className="text-xs text-blue-100 ml-1">
                                      {renderMessageStatus(message.status)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        )}

                        {/* Preview messages */}
                        {imagePreview && (
                          <div className="flex justify-end group">
                            <div className="max-w-[85%] sm:max-w-[70%] rounded-3xl p-4 shadow-lg bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white rounded-br-lg ml-12 relative">
                              <div className="relative w-full max-w-[250px] rounded-2xl overflow-hidden bg-slate-100">
                                <img
                                  src={imagePreview}
                                  alt="Image preview"
                                  className="w-full h-auto object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 text-white hover:bg-white/20 rounded-full"
                                onClick={() => setImagePreview(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}

                        {audioBlob && (
                          <div className="flex justify-end group">
                            <div className="max-w-[85%] sm:max-w-[70%] rounded-3xl p-4 shadow-lg bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white rounded-br-lg ml-12 relative">
                              <div className="w-[200px] p-3 bg-white/20 rounded-2xl flex items-center gap-3">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white"
                                >
                                  <Play className="h-4 w-4" />
                                </Button>
                                <div className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden">
                                  <div className="h-full bg-white w-0"></div>
                                </div>
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-2xl">
                                  <Loader2 className="h-4 w-4 text-white animate-spin" />
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 text-white hover:bg-white/20 rounded-full"
                                onClick={() => setAudioBlob(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}

                        <div ref={lastMessageRef} />
                      </div>
                    )}
                  </ScrollArea>

                  {/* Input Area */}
                  <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 backdrop-blur-xl bg-opacity-95 dark:bg-opacity-95">
                    {/* Status Messages */}
                    {isOnline.role === "mentee" &&
                      selectedUser &&
                      !selectedUser.isActive && (
                        <div className="mb-3 p-3 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-200 dark:border-red-800 rounded-2xl text-center">
                          <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                            This chat is inactive. Please wait for the booking
                            to be confirmed.
                          </p>
                        </div>
                      )}

                    {isOnline.role === "mentor" &&
                      selectedUser &&
                      !selectedUser.isActive && (
                        <div className="mb-3 p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200 dark:border-amber-800 rounded-2xl text-center">
                          <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                            Service is completed.
                          </p>
                        </div>
                      )}

                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                      <div
                        ref={emojiPickerRef}
                        className="absolute bottom-20 left-4 right-4 sm:left-auto sm:right-auto sm:bottom-24 z-50 shadow-2xl rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700"
                        style={{ maxWidth: "400px" }}
                      >
                        <EmojiPicker
                          onEmojiClick={handleEmojiClick}
                          theme={darkMode ? "dark" : "light"}
                        />
                      </div>
                    )}

                    {/* Recording Indicator */}
                    {isRecording && (
                      <div className="absolute bottom-20 left-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-3xl shadow-2xl flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">
                            Recording: {Math.floor(recordingTime / 60)}:
                            {(recordingTime % 60).toString().padStart(2, "0")}
                          </span>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={stopRecording}
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-full"
                        >
                          Stop
                        </Button>
                      </div>
                    )}

                    {/* Input Field */}
                    <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-3xl p-2 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-200">
                      <Input
                        ref={inputRef}
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => {
                          const value = e.target.value;
                          setNewMessage(value);
                          if (value.length > 0) {
                            if (!isTyping) {
                              handleTypingStart();
                            } else {
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
                        onFocus={handleInputFocus}
                        className="flex-1 border-none bg-transparent text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm px-4"
                        disabled={
                          isRecording ||
                          (isOnline.role === "mentee" &&
                            selectedUser &&
                            !selectedUser.isActive)
                        }
                      />

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowEmojiPicker((prev) => !prev)}
                          className="rounded-full h-9 w-9 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          disabled={
                            isRecording ||
                            (isOnline.role === "mentee" &&
                              selectedUser &&
                              !selectedUser.isActive)
                          }
                        >
                          <Smile className="h-5 w-5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => fileInputRef.current?.click()}
                          className="rounded-full h-9 w-9 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          disabled={
                            isRecording ||
                            (isOnline.role === "mentee" &&
                              selectedUser &&
                              !selectedUser.isActive)
                          }
                        >
                          <ImageIcon className="h-5 w-5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (isRecording) {
                              stopRecording();
                            } else {
                              startRecording();
                            }
                          }}
                          className={`rounded-full h-9 w-9 transition-colors ${
                            isRecording
                              ? "text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          }`}
                          disabled={
                            isOnline.role === "mentee" &&
                            selectedUser &&
                            !selectedUser.isActive
                          }
                        >
                          <Mic className="h-5 w-5" />
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
                          className="rounded-full h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ml-1"
                          disabled={
                            isRecording ||
                            !newMessage.trim() ||
                            (isOnline.role === "mentee" &&
                              selectedUser &&
                              !selectedUser.isActive)
                          }
                        >
                          <Send className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Empty State */
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                  <div className="text-center p-8 max-w-md">
                    <div className="mx-auto h-24 w-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-2xl flex items-center justify-center mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                      <Send className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="font-bold text-2xl text-slate-900 dark:text-white mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Start Messaging
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-base mb-6 leading-relaxed">
                      Select a conversation from the list to start chatting or
                      search for someone specific
                    </p>

                    {isMobile && (
                      <Button
                        onClick={() => setIsSidebarOpen(true)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                      >
                        <Menu className="h-5 w-5 mr-2" />
                        View Conversations
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Confirmation Modal */}
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
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Chatting;
