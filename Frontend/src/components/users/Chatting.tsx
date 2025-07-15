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
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import Logo from "@/assets/logo6.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateBookingStatus } from "../../services/bookingService";
import ConfirmationModal from "../modal/ConfirmationModal";

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

  // Socket and chat logic remains unchanged (omitted for brevity)
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

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const socketInstance = io(`${import.meta.env.VITE_SOCKET_URL}/chat`, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Connected to Socket.IO server");
      setError(null);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error.message);
      setError(`Failed to connect to chat server: ${error.message}`);
    });

    socketInstance.on("receiveMessage", async (message) => {
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
          status: message.sender._id === userId ? "sent" : "delivered",
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
                  message.sender._id === userId || user.id === activeChatId
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
                  message.sender._id === userId || user.id === activeChatId
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

      if (message.chat.toString() === activeChatId && socket.connected) {
        socket.emit("markAsRead", { chatId: activeChatId }, (response: any) => {
          if (!response.success) {
            console.error("Failed to mark messages as read:", response.error);
          }
        });
      }

      if (shouldScrollToBottom) {
        scrollToBottom(
          0,
          5,
          (chatHistories[message.chat.toString()] || []).length + 1
        );
      }
    });

    socketInstance.on("messageDelivered", ({ messageId, chatId }) => {
      setChatHistories((prev) => {
        const updatedMessages = (prev[chatId] || []).map((msg) =>
          msg._id === messageId ? { ...msg, status: "delivered" } : msg
        );
        return { ...prev, [chatId]: updatedMessages };
      });
    });

    socketInstance.on("userStatus", ({ userId, isOnline }) => {
      setChatUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, isOnline } : user))
      );
      setFilteredChatUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, isOnline } : user))
      );
    });

    socketInstance.on("messageRead", ({ messageId, chatId }) => {
      setChatHistories((prev) => {
        const updatedMessages = (prev[chatId] || []).map((msg) =>
          msg._id === messageId ? { ...msg, status: "read" } : msg
        );
        return { ...prev, [chatId]: updatedMessages };
      });

      setChatUsers((prev) =>
        prev.map((user) =>
          user.id === chatId
            ? {
                ...user,
                unread: (chatHistories[chatId] || []).filter(
                  (msg) => msg.sender !== "user" && msg.status !== "read"
                ).length,
              }
            : user
        )
      );

      setFilteredChatUsers((prev) =>
        prev.map((user) =>
          user.id === chatId
            ? {
                ...user,
                unread: (chatHistories[chatId] || []).filter(
                  (msg) => msg.sender !== "user" && msg.status !== "read"
                ).length,
              }
            : user
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

    return () => {
      socketInstance.disconnect();
    };
  }, [userId, shouldScrollToBottom]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!dashboard) {
        setError("Please select a dashboard (mentor or mentee)");
        return;
      }

      try {
        setError(null);
        const response = await getChatHistory(dashboard);
        const updatedChatUsers = response.data.map((user: ChatUser) => ({
          ...user,
          isOnline: false,
          isActive: user.isActive ?? true,
        }));
        const isOnline = updatedChatUsers[0]?.otherUserId
          ? await checkUserOnlineStatus(updatedChatUsers[0].otherUserId)
          : false;

        const updatedChatUsersWithOnline = updatedChatUsers.map((u, index) =>
          index === 0 ? { ...u, isOnline } : u
        );
        setChatUsers(updatedChatUsersWithOnline);
        setFilteredChatUsers(updatedChatUsersWithOnline);
        if (updatedChatUsers.length > 0) {
          setSelectedUser(updatedChatUsers[0]);
          setActiveChatId(updatedChatUsers[0].id);
        } else {
          setError(`No chats available for ${dashboard} dashboard`);
        }
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
    if (socket && activeChatId && socket.connected) {
      setIsMessagesLoaded(false);
      socket.emit(
        "getChatHistory",
        { chatId: activeChatId },
        async (response: any) => {
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
                status:
                  msg.status ||
                  (msg.sender._id === userId ? "sent" : "delivered"),
              })) || [];

            if (messages.length === 0) {
              setError(`No messages found for chat ${activeChatId}`);
            }

            const mediaMessages = messages.filter(
              (msg: ChatMessage) => msg.type === "image" || msg.type === "audio"
            );
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
                setError(`Failed to load media for message ${msg._id}`);
              }
            }

            setMediaUrls((prev) => ({ ...prev, ...newMediaUrls }));
            setChatHistories((prev) => ({
              ...prev,
              [activeChatId]: messages,
            }));
            setIsMessagesLoaded(true);
            socket.emit(
              "markAsRead",
              { chatId: activeChatId },
              (response: any) => {
                if (!response.success) {
                  setError(response.error || "Failed to mark messages as read");
                }
              }
            );
            if (messages.length > 0 && shouldScrollToBottom) {
              scrollToBottom(0, 5, messages.length);
            }
          } else {
            setError(response.error || "Failed to load chat messages");
            setIsMessagesLoaded(true);
          }
        }
      );
    } else if (socket && !socket.connected) {
      setError("Chat server disconnected, please try again later");
      setIsMessagesLoaded(true);
    }
  }, [socket, activeChatId, userId, shouldScrollToBottom]);

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
    setChatUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, unread: 0 } : u))
    );
    setFilteredChatUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, unread: 0 } : u))
    );

    try {
      const isOnline = await checkUserOnlineStatus(user?.otherUserId);
      setSelectedUser((prev) =>
        prev ? { ...prev, isOnline } : { ...user, isOnline }
      );
      setChatUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isOnline } : u))
      );
      setFilteredChatUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isOnline } : u))
      );
    } catch (error: any) {
      console.error("Failed to check online status:", error);
      setError("Failed to load user online status");
    }

    if (socket && socket.connected) {
      socket.emit("markAsRead", { chatId: user.id }, (response: any) => {
        if (!response.success) {
          setError(response.error || "Failed to mark messages as read");
        }
      });
    }

    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleSendMessage = () => {
    if (!socket || !activeChatId || newMessage.trim() === "") {
      setError("Cannot send message: please select a chat and enter a message");
      return;
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
    if (!status) return null;
    if (status === "sent") {
      return <Check className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />;
    } else if (status === "delivered") {
      return <CheckCheck className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />;
    } else if (status === "read") {
      return <CheckCheck className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />;
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
              <h2
                className="text-lg sm:text-xl font-semibold flex items-center space-x-2"
                style={{ color: "#6978f5" }}
              >
                <img src={Logo} alt="Logo" className="w-6 h-6 sm:w-8 sm:h-8" />
                <span>Chat ONE</span>
              </h2>
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
                            {user.lastMessage || "Start chatting now!"}
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
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
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
