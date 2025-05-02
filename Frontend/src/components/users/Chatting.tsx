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
} from "lucide-react";
import Pattern from "@/assets/pattern-2.svg?url";
import { io, Socket } from "socket.io-client";
import { getChatHistory } from "@/services/userServices";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

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
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, dashboard } = useSelector((state: RootState) => state.user);
  const userId = user?.id;
  const role = user?.role;

  // Initialize Socket.IO
  useEffect(() => {
    const socketInstance = io(import.meta.env.VITE_API_URL, {
      auth: {
        token: localStorage.getItem("accessToken"),
      },
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error.message);
    });

    socketInstance.on("receiveMessage", (message) => {
      setChatHistories((prev) => {
        const chatId = message.chat;
        const formattedMessage: ChatMessage = {
          _id: message._id,
          content: message.content,
          timestamp: new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          sender: message.sender._id === userId ? "user" : "other",
          senderId: message.sender._id,
        };
        const updated = [...(prev[chatId] || []), formattedMessage];
        return { ...prev, [chatId]: updated };
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

    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  // Fetch chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!dashboard) {
        console.warn("Dashboard not set, skipping chat history fetch");
        return;
      }

      try {
        const response = await getChatHistory(dashboard);
        const updatedChatUsers = response.data.map((user: ChatUser) => ({
          ...user,
          isOnline: false, // Initialize as false, updated via socket
        }));
        setChatUsers(updatedChatUsers);
        setFilteredChatUsers(updatedChatUsers); // Initialize filtered list
        if (updatedChatUsers.length > 0) {
          setSelectedUser(updatedChatUsers[0]);
          setActiveChatId(updatedChatUsers[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
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
    if (socket && activeChatId) {
      socket.emit(
        "getChatHistory",
        { chatId: activeChatId },
        (response: any) => {
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
              })),
            }));
            socket.emit("markAsRead", { chatId: activeChatId });
          } else {
            console.error("Failed to fetch chat history:", response.error);
          }
        }
      );
    }
  }, [socket, activeChatId, userId]);

  // Scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistories[activeChatId || ""]]);

  const handleUserClick = (user: ChatUser) => {
    setSelectedUser(user);
    setActiveChatId(user.id);
  };

  const handleSendMessage = () => {
    if (!socket || !activeChatId || newMessage.trim() === "") return;

    socket.emit(
      "sendMessage",
      { chatId: activeChatId, content: newMessage },
      (response: any) => {
        if (response.error) {
          console.error("Failed to send message:", response.error);
        }
      }
    );

    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && socket && activeChatId) {
      socket.emit(
        "sendMessage",
        { chatId: activeChatId, content: `Sent file: ${file.name}` },
        (response: any) => {
          if (response.error) {
            console.error("Failed to send file message:", response.error);
          }
        }
      );
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
                {filteredChatUsers.map((user) => (
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
                          {user.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {user.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">
                        {user.lastMessage}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.isOnline ? "Online" : "Offline"}
                      </p>
                    </div>
                    {user.unread && (
                      <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
                        {user.unread}
                      </span>
                    )}
                  </button>
                ))}
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
                            <p className="text-sm">{message.content}</p>
                            <span className="text-xs opacity-70 mt-1 block text-white">
                              {message.timestamp}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
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
