import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Video,
  Smile,
  Paperclip,
  Send,
  MoreVertical,
  CircleSmall,
  Check,
  CheckCheck,
} from "lucide-react";
import Pattern from "@/assets/pattern-2.svg?url";
import { io, Socket } from "socket.io-client";
import { getChatHistory } from "../../services/userServices";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import axios from "axios";

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
  status?: "sent" | "delivered" | "read"; // For ticks
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
}

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
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const { user, dashboard } = useSelector((state: RootState) => state.user);
  const userId = user?._id;
  const role = user?.role;

  // Initialize Socket.IO
  useEffect(() => {
    console.log("user id iis", userId);

    const token = localStorage.getItem("accessToken");
    console.log("Socket.IO auth token:", token?.substring(0, 20) + "...");
    try {
      if (token) {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        console.log("Decoded JWT payload:", decoded);
      }
    } catch (e) {
      console.error("Failed to decode JWT:", e);
      setError("Invalid authentication token");
    }

    console.log(
      "Initializing Socket.IO with VITE_API_URL:",
      import.meta.env.VITE_API_URL
    );
    const socketInstance = io(import.meta.env.VITE_API_URL, {
      auth: {
        token,
      },
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
      console.error("Socket.IO connection error:", error.message, error);
      setError(`Failed to connect to chat server: ${error.message}`);
    });

    socketInstance.on("reconnect_attempt", (attempt) => {
      console.log("Socket.IO reconnect attempt:", attempt);
    });

    socketInstance.on("reconnect_failed", () => {
      console.error("Socket.IO reconnect failed");
      setError("Failed to reconnect to chat server");
    });

    socketInstance.on("receiveMessage", (message) => {
      console.log("Received message:", message);
      setChatHistories((prev) => {
        const chatId = message.chat.toString();
        console.log("Processing message for chatId:", chatId);
        const formattedMessage: ChatMessage = {
          _id: message._id,
          content: message.content,
          timestamp: new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          sender: message.sender._id === userId ? "user" : "other",
          senderId: message.sender._id,
          status: message.sender._id === userId ? "sent" : "delivered",
        };
        const updated = [...(prev[chatId] || []), formattedMessage];
        return { ...prev, [chatId]: updated };
      });
    });

    socketInstance.on("messageDelivered", ({ messageId, chatId }) => {
      console.log("Message delivered:", { messageId, chatId });
      setChatHistories((prev) => {
        const updatedMessages = (prev[chatId] || []).map((msg) =>
          msg._id === messageId ? { ...msg, status: "delivered" } : msg
        );
        return { ...prev, [chatId]: updatedMessages };
      });
    });

    socketInstance.on("messageRead", ({ messageId, chatId }) => {
      console.log("Message read:", { messageId, chatId });
      setChatHistories((prev) => {
        const updatedMessages = (prev[chatId] || []).map((msg) =>
          msg._id === messageId ? { ...msg, status: "read" } : msg
        );
        return { ...prev, [chatId]: updatedMessages };
      });
    });

    socketInstance.on("userStatus", ({ userId, isOnline }) => {
      console.log("User status update:", { userId, isOnline });
      setChatUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, isOnline } : user))
      );
      setFilteredChatUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, isOnline } : user))
      );
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  // Fetch chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!dashboard) {
        console.warn("Dashboard not set, skipping chat history fetch");
        setError("Please select a dashboard (mentor or mentee)");
        return;
      }

      try {
        setError(null);
        console.log("Fetching chat history for dashboard:", dashboard);
        const response = await getChatHistory(dashboard);
        console.log("Chat history response:", response);
        const updatedChatUsers = response.data.map((user: ChatUser) => ({
          ...user,
          isOnline: false,
        }));
        setChatUsers(updatedChatUsers);
        setFilteredChatUsers(updatedChatUsers);
        if (updatedChatUsers.length > 0) {
          setSelectedUser(updatedChatUsers[0]);
          setActiveChatId(updatedChatUsers[0].id);
        } else {
          setError("No chats available");
        }
      } catch (error: any) {
        console.error("Failed to fetch chat history:", error);
        setError(error.message || "Failed to fetch chat history");
      }
    };

    if (role && dashboard) {
      fetchChatHistory();
    }
  }, [role, dashboard]);

  // Filter chat users based on search query
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

  // Fetch messages for selected chat
  useEffect(() => {
    if (socket && activeChatId && socket.connected) {
      console.log("Fetching messages for chatId:", activeChatId);
      socket.emit(
        "getChatHistory",
        { chatId: activeChatId },
        (response: any) => {
          console.log("getChatHistory response:", response);
          if (response.success) {
            setChatHistories((prev) => ({
              ...prev,
              [activeChatId]: response.messages.map((msg: any) => ({
                _id: msg._id,
                content: msg.content,
                timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                sender: msg.sender._id === userId ? "user" : "other",
                senderId: msg.sender._id,
                status:
                  msg.status ||
                  (msg.sender._id === userId ? "sent" : "delivered"),
              })),
            }));
            socket.emit(
              "markAsRead",
              { chatId: activeChatId },
              (response: any) => {
                console.log("markAsRead response:", response);
                if (!response.success) {
                  console.error(
                    "Failed to mark messages as read:",
                    response.error
                  );
                  setError(response.error || "Failed to mark messages as read");
                }
              }
            );
          } else {
            console.error("Failed to fetch chat history:", response.error);
            setError(response.error || "Failed to load chat messages");
          }
        }
      );
    } else if (socket && !socket.connected) {
      console.warn("Cannot fetch chat history: Socket.IO not connected");
      setError("Chat server disconnected, please try again later");
    }
  }, [socket, activeChatId, userId]);

  // Close emoji picker when clicking outside

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
  // useEffect(() => {
  //   if (chatContainerRef.current) {
  //     chatContainerRef.current.scrollTop =
  //       chatContainerRef.current.scrollHeight;
  //   }
  // }, [chatHistories[activeChatId || ""]]);
  // const handleUserClick = (user: ChatUser) => {
  //   console.log("Selected user:", user);
  //   setSelectedUser(user);
  //   setActiveChatId(user.id);
  //   setError(null);
  // };
  // Replace the Scroll to bottom useEffect (lines ~216–224)
  // Replace the Scroll to bottom useEffect (lines ~215–224)
  // useEffect(() => {
  //   if (chatContainerRef.current) {
  //     setTimeout(() => {
  //       chatContainerRef.current!.scrollTop =
  //         chatContainerRef.current!.scrollHeight;
  //       console.log("Scrolled to bottom on chat selection or message update");
  //     }, 300); // Increased delay for DOM rendering
  //   }
  // }, [activeChatId, chatHistories[activeChatId || ""]]);

  // Add a new useEffect after the existing scroll useEffect (after line ~224)
  useEffect(() => {
    if (chatContainerRef.current) {
      requestAnimationFrame(() => {
        chatContainerRef.current!.scrollTop =
          chatContainerRef.current!.scrollHeight;
        console.log(
          "Scrolled to bottom (chat opened or updated)",
          chatHistories[activeChatId || ""]?.map((m) => ({
            content: m.content,
            timestamp: m.timestamp,
          }))
        );
      });
    }
  }, [activeChatId, chatHistories[activeChatId || ""]]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [activeChatId, chatHistories[activeChatId || ""]]);
  // Replace the handleUserClick function (lines ~226–236)
  const handleUserClick = (user: ChatUser) => {
    console.log("Selected user:", user);
    setSelectedUser(user);
    setActiveChatId(user.id);
    setError(null);
  };
  const handleSendMessage = () => {
    console.log("handleSendMessage called", {
      socket,
      activeChatId,
      newMessage,
    });
    if (!socket || !activeChatId || newMessage.trim() === "") {
      console.warn(
        "Cannot send message: invalid socket, chatId, or empty message"
      );
      setError("Cannot send message: please select a chat and enter a message");
      return;
    }

    if (!socket.connected) {
      console.warn("Socket.IO not connected, cannot send message");
      setError("Chat server disconnected, please try again later");
      return;
    }

    socket.emit(
      "sendMessage",
      { chatId: activeChatId, content: newMessage },
      (response: any) => {
        console.log("sendMessage response:", response);
        if (response.success) {
          setNewMessage("");
        } else {
          console.error("Failed to send message:", response.error);
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
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && socket && activeChatId && socket.connected) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const imageUrl = response.data.url;
        socket.emit(
          "sendMessage",
          { chatId: activeChatId, content: imageUrl },
          (response: any) => {
            console.log("Image sendMessage response:", response);
            if (response.error) {
              console.error("Failed to send image message:", response.error);
              setError(response.error || "Failed to send image");
            }
          }
        );
      } catch (error: any) {
        console.error("Failed to upload image:", error);
        setError(error.message || "Failed to upload image");
      }
    } else {
      console.warn(
        "Cannot send file: Socket.IO not connected or invalid state"
      );
      setError("Cannot send file: chat server disconnected or invalid state");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const isImageUrl = (content: string) => {
    return /\.(png|jpg|jpeg|gif)$/i.test(content);
  };

  const renderMessageStatus = (status?: string) => {
    if (!status) return null;
    if (status === "sent") {
      return <Check className="h-4 w-4 text-gray-400" />;
    } else if (status === "delivered") {
      return <CheckCheck className="h-4 w-4 text-gray-400" />;
    } else if (status === "read") {
      return <CheckCheck className="h-4 w-4 text-blue-500" />;
    }
    return null;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="pr-0 pl-3 gap-0 bg-white"
        style={{ width: "70vw", maxWidth: "1000px" }}
      >
        <div className="flex h-full">
          <div className="w-[300px] border-r">
            <SheetHeader className="border-b">
              <SheetTitle className="text-gray-000">Chats</SheetTitle>
            </SheetHeader>
            <div className="p-2 mr-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search chats"
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="h-[calc(100vh-200px)] mr-2">
              <div className="space-y-2">
                {error && (
                  <p className="text-center text-sm text-red-500">{error}</p>
                )}
                {filteredChatUsers.length > 0 ? (
                  filteredChatUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserClick(user)}
                      className={`w-full flex items-center space-x-4 p-4 rounded-lg hover:bg-accent ${
                        selectedUser?.id === user.id ? "bg-accent" : ""
                      }`}
                      style={{ backgroundColor: "#333333" }}
                    >
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-300">
                            {user.name.slice(0, user.name.indexOf(" "))}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 truncate">
                          {user.lastMessage}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.isOnline ? (
                            <CircleSmall color="#13c91f" />
                          ) : null}
                        </p>
                      </div>
                      {user.unread && (
                        <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
                          {user.unread}
                        </span>
                      )}
                    </button>
                  ))
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    No chats found
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="flex-1 flex flex-col">
            {selectedUser ? (
              <>
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={selectedUser.avatar} />
                      <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {selectedUser.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedUser.isOnline ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Video className="h-8 w-8" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <ScrollArea
                  className="flex-1 p-4"
                  ref={chatContainerRef}
                  style={{
                    backgroundImage: `url(${Pattern}), linear-gradient(#404040, #404040)`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "auto",
                  }}
                >
                  {error && (
                    <p className="text-center text-sm text-red-500">{error}</p>
                  )}
                  <div className="space-y-4">
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
                            className={`max-w-[70%] rounded-lg p-1 text-gray-200 ${
                              message.sender === "user"
                                ? "bg-green-800 text-primary-foreground"
                                : ""
                            }`}
                            style={{
                              backgroundColor:
                                message.sender !== "user"
                                  ? "#2d2d2d"
                                  : undefined,
                            }}
                          >
                            {isImageUrl(message.content) ? (
                              <img
                                src={message.content}
                                alt="Chat image"
                                className="max-w-[200px] rounded-lg"
                              />
                            ) : (
                              <p className="text-sm">{message.content}</p>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-xs opacity-70 mt-1 text-white">
                                {message.timestamp}
                              </span>
                              {message.sender === "user" &&
                                renderMessageStatus(message.status)}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                    <div ref={bottomRef} />
                  </div>
                </ScrollArea>

                <div className="p-4 border-t relative">
                  {showEmojiPicker && (
                    <div
                      ref={emojiPickerRef}
                      className="absolute bottom-16 left-0 z-10"
                    >
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowEmojiPicker((prev) => !prev)}
                    >
                      <Smile className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={triggerFileInput}
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                    <Input
                      placeholder="Type your message here..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button size="icon" onClick={handleSendMessage}>
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div className="space-y-2">
                  <h3 className="font-medium">No chat selected</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a conversation from the left to start chatting
                  </p>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Chatting;
