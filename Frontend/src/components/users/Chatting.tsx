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

interface MenteeChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sender: "user" | "other";
}

interface ChatUser {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
}

const users: ChatUser[] = [
  {
    id: 1,
    name: "Jasna Jaffer",
    avatar: "https://ui.shadcn.com/avatars/01.png",
    lastMessage: "Hey! How are you?",
    timestamp: "8:30 PM",
    unread: 2,
  },
  {
    id: 2,
    name: "Anila Benny",
    avatar: "https://ui.shadcn.com/avatars/02.png",
    lastMessage: "Can we schedule a call?",
    timestamp: "7:45 PM",
  },
];

function MentorChat({ open, onOpenChange }: MenteeChatProps) {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(users[0]);
  const [newMessage, setNewMessage] = useState("");
  const [openChats, setOpenChats] = useState<ChatUser[]>([users[0]]);
  const [activeChatId, setActiveChatId] = useState<number>(users[0].id);
  const [chatHistories, setChatHistories] = useState<{
    [userId: number]: ChatMessage[];
  }>({
    [users[0].id]: [],
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistories[activeChatId]]); // Watch current chat's messages

  const handleUserClick = (user: ChatUser) => {
    setSelectedUser(user);
    setOpenChats((prev) => {
      const exists = prev.find((u) => u.id === user.id);
      return exists ? prev : [...prev, user];
    });
    setActiveChatId(user.id);
  };

  const formatTimestamp = (date: Date): string => {
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = date.getHours() >= 12 ? "PM" : "AM";
    return `${hours}:${minutes} ${period}`;
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      content: newMessage,
      timestamp: formatTimestamp(new Date()),
      sender: "user",
    };

    setChatHistories((prev) => {
      const updated = [...(prev[activeChatId] || []), newMsg];
      return { ...prev, [activeChatId]: updated };
    });

    setNewMessage("");

    setTimeout(() => {
      const reply: ChatMessage = {
        id: crypto.randomUUID(),
        content: `Thanks for your message!`,
        timestamp: formatTimestamp(new Date()),
        sender: "other",
      };

      setChatHistories((prev) => {
        const updated = [...(prev[activeChatId] || []), reply];
        return { ...prev, [activeChatId]: updated };
      });
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newMsg: ChatMessage = {
        id: crypto.randomUUID(),
        content: `Sent file: ${file.name}`,
        timestamp: formatTimestamp(new Date()),
        sender: "user",
      };
      setChatHistories((prev) => {
        const updated = [...(prev[activeChatId] || []), newMsg];
        return { ...prev, [activeChatId]: updated };
      });

      setTimeout(() => {
        const reply: ChatMessage = {
          id: crypto.randomUUID(),
          content: `Received your file: ${file.name}`,
          timestamp: formatTimestamp(new Date()),
          sender: "other",
        };
        setChatHistories((prev) => {
          const updated = [...(prev[activeChatId] || []), reply];
          return { ...prev, [activeChatId]: updated };
        });
      }, 1000);
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
          {/* Users List Section */}
          <div className="w-[300px] border-r">
            <SheetHeader className="border-b">
              <SheetTitle className="text-gray-000">Chats</SheetTitle>
            </SheetHeader>
            <div className="p-2 mr-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search chats" className="pl-8" />
              </div>
            </div>
            {/* <div className="mr-1" style={{ backgroundColor: "#404040" }}> */}
            {/* <div className="mr-0"> */}
            <ScrollArea className="h-[calc(100vh-200px)] mr-2">
              <div className="space-y-2">
                {users.map((user) => (
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
            {/* </div> */}
          </div>

          {/* Chat Section */}
          <div className="flex-1 flex flex-col">
            {selectedUser ? (
              <>
                {/* Tabs for open chats */}

                {/* Chat Header */}
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
                      <p className="text-sm text-muted-foreground">Online</p>
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

                {/* Chat Messages */}
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
                    {(chatHistories[activeChatId] || []).map((message) => (
                      <div
                        key={message.id}
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
                              message.sender !== "user" ? "#2d2d2d" : undefined,
                          }}
                        >
                          <p className="text-sm">{message.content}</p>
                          <span className="text-xs opacity-70 mt-1 block text-white">
                            {message.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
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
}

export default MentorChat;
