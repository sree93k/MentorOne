// import { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
// } from "@/components/ui/sheet";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Search,
//   Video,
//   Smile,
//   Paperclip,
//   Send,
//   MoreVertical,
//   Circle,
//   Check,
//   CheckCheck,
// } from "lucide-react";
// import Pattern from "@/assets/pattern-2.svg?url";
// import { io, Socket } from "socket.io-client";
// import { getChatHistory } from "../../services/userServices";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
// import axios from "axios";

// interface ChatProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// interface ChatMessage {
//   _id: string;
//   content: string;
//   timestamp: string;
//   sender: "user" | "other";
//   senderId: string;
//   status?: "sent" | "delivered" | "read";
// }

// interface ChatUser {
//   id: string;
//   name: string;
//   avatar: string;
//   bookingId: string;
//   lastMessage?: string;
//   timestamp?: string;
//   unread?: number;
//   isOnline?: boolean;
// }

// const Chatting = ({ open, onOpenChange }: ChatProps) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
//   const [filteredChatUsers, setFilteredChatUsers] = useState<ChatUser[]>([]);
//   const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
//   const [newMessage, setNewMessage] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [chatHistories, setChatHistories] = useState<{
//     [chatId: string]: ChatMessage[];
//   }>({});
//   const [activeChatId, setActiveChatId] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const chatContainerRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const emojiPickerRef = useRef<HTMLDivElement>(null);
//   const bottomRef = useRef<HTMLDivElement>(null);
//   const { user, dashboard } = useSelector((state: RootState) => state.user);
//   const userId = user?._id;
//   const role = user?.role;

//   // Initialize Socket.IO
//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     try {
//       if (token) {
//         const decoded = JSON.parse(atob(token.split(".")[1]));
//         console.log("Decoded JWT payload:", decoded);
//       }
//     } catch (e) {
//       console.error("Failed to decode JWT:", e);
//       setError("Invalid authentication token");
//     }

//     const socketInstance = io(import.meta.env.VITE_API_URL, {
//       auth: { token },
//       transports: ["websocket", "polling"],
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     });

//     setSocket(socketInstance);

//     socketInstance.on("connect", () => {
//       console.log("Connected to Socket.IO server");
//       setError(null);
//     });

//     socketInstance.on("connect_error", (error) => {
//       console.error("Socket.IO connection error:", error.message, error);
//       setError(`Failed to connect to chat server: ${error.message}`);
//     });

//     socketInstance.on("receiveMessage", (message) => {
//       setChatHistories((prev) => {
//         const chatId = message.chat.toString();
//         const formattedMessage: ChatMessage = {
//           _id: message._id,
//           content: message.content,
//           timestamp: new Date(message.createdAt).toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           }),
//           sender: message.sender._id === userId ? "user" : "other",
//           senderId: message.sender._id,
//           status: message.sender._id === userId ? "sent" : "delivered",
//         };
//         const updated = [...(prev[chatId] || []), formattedMessage];
//         return { ...prev, [chatId]: updated };
//       });
//     });

//     socketInstance.on("messageDelivered", ({ messageId, chatId }) => {
//       setChatHistories((prev) => {
//         const updatedMessages = (prev[chatId] || []).map((msg) =>
//           msg._id === messageId ? { ...msg, status: "delivered" } : msg
//         );
//         return { ...prev, [chatId]: updatedMessages };
//       });
//     });

//     socketInstance.on("messageRead", ({ messageId, chatId }) => {
//       setChatHistories((prev) => {
//         const updatedMessages = (prev[chatId] || []).map((msg) =>
//           msg._id === messageId ? { ...msg, status: "read" } : msg
//         );
//         return { ...prev, [chatId]: updatedMessages };
//       });
//     });

//     socketInstance.on("userStatus", ({ userId, isOnline }) => {
//       setChatUsers((prev) =>
//         prev.map((user) => (user.id === userId ? { ...user, isOnline } : user))
//       );
//       setFilteredChatUsers((prev) =>
//         prev.map((user) => (user.id === userId ? { ...user, isOnline } : user))
//       );
//     });

//     return () => {
//       socketInstance.disconnect();
//     };
//   }, [userId]);

//   // Fetch chat history
//   useEffect(() => {
//     const fetchChatHistory = async () => {
//       if (!dashboard) {
//         setError("Please select a dashboard (mentor or mentee)");
//         return;
//       }

//       try {
//         setError(null);
//         const response = await getChatHistory(dashboard);
//         const updatedChatUsers = response.data.map((user: ChatUser) => ({
//           ...user,
//           isOnline: false,
//         }));
//         setChatUsers(updatedChatUsers);
//         setFilteredChatUsers(updatedChatUsers);
//         if (updatedChatUsers.length > 0) {
//           setSelectedUser(updatedChatUsers[0]);
//           setActiveChatId(updatedChatUsers[0].id);
//         } else {
//           setError("No chats available");
//         }
//       } catch (error: any) {
//         setError(error.message || "Failed to fetch chat history");
//       }
//     };

//     if (role && dashboard) {
//       fetchChatHistory();
//     }
//   }, [role, dashboard]);

//   // Filter chat users based on search query
//   useEffect(() => {
//     if (searchQuery.trim() === "") {
//       setFilteredChatUsers(chatUsers);
//     } else {
//       const filtered = chatUsers.filter((user) =>
//         user.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setFilteredChatUsers(filtered);
//     }
//   }, [searchQuery, chatUsers]);

//   // Fetch messages for selected chat
//   useEffect(() => {
//     if (socket && activeChatId && socket.connected) {
//       socket.emit(
//         "getChatHistory",
//         { chatId: activeChatId },
//         (response: any) => {
//           if (response.success) {
//             setChatHistories((prev) => ({
//               ...prev,
//               [activeChatId]: response.messages.map((msg: any) => ({
//                 _id: msg._id,
//                 content: msg.content,
//                 timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 }),
//                 sender: msg.sender._id === userId ? "user" : "other",
//                 senderId: msg.sender._id,
//                 status:
//                   msg.status ||
//                   (msg.sender._id === userId ? "sent" : "delivered"),
//               })),
//             }));
//             socket.emit(
//               "markAsRead",
//               { chatId: activeChatId },
//               (response: any) => {
//                 if (!response.success) {
//                   setError(response.error || "Failed to mark messages as read");
//                 }
//               }
//             );
//           } else {
//             setError(response.error || "Failed to load chat messages");
//           }
//         }
//       );
//     } else if (socket && !socket.connected) {
//       setError("Chat server disconnected, please try again later");
//     }
//   }, [socket, activeChatId, userId]);

//   // Close emoji picker when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         emojiPickerRef.current &&
//         !emojiPickerRef.current.contains(event.target as Node)
//       ) {
//         setShowEmojiPicker(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Scroll to bottom on chat update
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [activeChatId, chatHistories[activeChatId || ""]]);

//   const handleUserClick = (user: ChatUser) => {
//     setSelectedUser(user);
//     setActiveChatId(user.id);
//     setError(null);
//   };

//   const handleSendMessage = () => {
//     if (!socket || !activeChatId || newMessage.trim() === "") {
//       setError("Cannot send message: please select a chat and enter a message");
//       return;
//     }

//     if (!socket.connected) {
//       setError("Chat server disconnected, please try again later");
//       return;
//     }

//     socket.emit(
//       "sendMessage",
//       { chatId: activeChatId, content: newMessage },
//       (response: any) => {
//         if (response.success) {
//           setNewMessage("");
//         } else {
//           setError(response.error || "Failed to send message");
//         }
//       }
//     );
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       handleSendMessage();
//     }
//   };

//   const handleEmojiClick = (emojiData: EmojiClickData) => {
//     setNewMessage((prev) => prev + emojiData.emoji);
//     setShowEmojiPicker(false);
//   };

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file && socket && activeChatId && socket.connected) {
//       if (!file.type.startsWith("image/")) {
//         setError("Please select an image file");
//         return;
//       }

//       const formData = new FormData();
//       formData.append("file", file);
//       try {
//         const response = await axios.post(
//           `${import.meta.env.VITE_API_URL}/upload`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );
//         const imageUrl = response.data.url;
//         socket.emit(
//           "sendMessage",
//           { chatId: activeChatId, content: imageUrl },
//           (response: any) => {
//             if (response.error) {
//               setError(response.error || "Failed to send image");
//             }
//           }
//         );
//       } catch (error: any) {
//         setError(error.message || "Failed to upload image");
//       }
//     } else {
//       setError("Cannot send file: chat server disconnected or invalid state");
//     }
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   const isImageUrl = (content: string) => {
//     return /\.(png|jpg|jpeg|gif)$/i.test(content);
//   };

//   const renderMessageStatus = (status?: string) => {
//     if (!status) return null;
//     if (status === "sent") {
//       return <Check className="h-4 w-4 text-gray-500" />;
//     } else if (status === "delivered") {
//       return <CheckCheck className="h-4 w-4 text-gray-500" />;
//     } else if (status === "read") {
//       return <CheckCheck className="h-4 w-4 text-teal-500" />;
//     }
//     return null;
//   };

//   return (
//     <Sheet open={open} onOpenChange={onOpenChange}>
//       <SheetContent
//         side="right"
//         className="p-0 gap-0 bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900"
//         style={{ width: "70vw", maxWidth: "1000px" }}
//       >
//         <div className="flex h-full">
//           {/* Sidebar */}
//           <div className="w-[300px] border-r border-gray-200 bg-white/80 backdrop-blur-sm">
//             <SheetHeader className="border-b border-gray-200 p-4">
//               <SheetTitle className="text-2xl font-bold text-gray-900">
//                 Chat
//               </SheetTitle>
//             </SheetHeader>
//             <div className="p-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <Input
//                   placeholder="Search conversations..."
//                   className="pl-10 bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500 rounded-lg transition-all duration-200"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//             </div>
//             <ScrollArea className="h-[calc(100vh-180px)] p-4">
//               <div className="space-y-2">
//                 {error && (
//                   <p className="text-center text-sm text-red-500 bg-red-100/50 p-2 rounded-lg">
//                     {error}
//                   </p>
//                 )}
//                 {filteredChatUsers.length > 0 ? (
//                   filteredChatUsers.map((user) => (
//                     <button
//                       key={user.id}
//                       onClick={() => handleUserClick(user)}
//                       className={`w-full flex items-center space-x-4 p-3 rounded-xl hover:bg-teal-50 transition-all duration-200 ${
//                         selectedUser?.id === user.id
//                           ? "bg-teal-100"
//                           : "bg-white/50"
//                       }`}
//                     >
//                       <div className="relative">
//                         <Avatar className="h-12 w-12 border-2 border-teal-500">
//                           <AvatarImage src={user.avatar} />
//                           <AvatarFallback className="bg-teal-600 text-white">
//                             {user.name[0]}
//                           </AvatarFallback>
//                         </Avatar>
//                         {user.isOnline && (
//                           <Circle className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
//                         )}
//                       </div>
//                       <div className="flex-1 text-left">
//                         <div className="flex justify-between items-center">
//                           <span className="font-semibold text-gray-900">
//                             {user.name.slice(
//                               0,
//                               user.name.indexOf(" ") || undefined
//                             )}
//                           </span>
//                           <span className="text-xs text-gray-500">
//                             {user.timestamp}
//                           </span>
//                         </div>
//                         <p className="text-sm text-gray-600 truncate">
//                           {user.lastMessage || "No messages yet"}
//                         </p>
//                       </div>
//                       {user.unread && (
//                         <span className="bg-teal-500 text-white rounded-full px-2 py-1 text-xs font-bold">
//                           {user.unread}
//                         </span>
//                       )}
//                     </button>
//                   ))
//                 ) : (
//                   <p className="text-center text-sm text-gray-500">
//                     No conversations found
//                   </p>
//                 )}
//               </div>
//             </ScrollArea>
//           </div>

//           {/* Chat Area */}
//           <div className="flex-1 flex flex-col">
//             {selectedUser ? (
//               <>
//                 <div className="p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm flex justify-between items-center">
//                   <div className="flex items-center space-x-4">
//                     <Avatar className="h-10 w-10 border-2 border-teal-500">
//                       <AvatarImage src={selectedUser.avatar} />
//                       <AvatarFallback className="bg-teal-600 text-white">
//                         {selectedUser.name[0]}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <h3 className="font-semibold text-lg text-gray-900">
//                         {selectedUser.name}
//                       </h3>
//                       <p className="text-sm text-gray-500">
//                         {selectedUser.isOnline ? (
//                           <span className="text-green-500">Online</span>
//                         ) : (
//                           "Offline"
//                         )}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="text-gray-600 hover:text-teal-500 hover:bg-gray-100 rounded-full"
//                     >
//                       <Video className="h-6 w-6" />
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="text-gray-600 hover:text-teal-500 hover:bg-gray-100 rounded-full"
//                     >
//                       <MoreVertical className="h-5 w-5" />
//                     </Button>
//                   </div>
//                 </div>

//                 <ScrollArea
//                   className="flex-1 p-6"
//                   ref={chatContainerRef}
//                   style={{
//                     backgroundImage: `url(${Pattern}), linear-gradient(#f3f4f6, #e5e7eb)`,
//                     backgroundRepeat: "repeat",
//                     backgroundSize: "auto",
//                   }}
//                 >
//                   {error && (
//                     <p className="text-center text-sm text-red-500 bg-red-100/50 p-2 rounded-lg">
//                       {error}
//                     </p>
//                   )}
//                   <div className="space-y-4">
//                     {(chatHistories[activeChatId || ""] || []).map(
//                       (message) => (
//                         <div
//                           key={message._id}
//                           className={`flex ${
//                             message.sender === "user"
//                               ? "justify-end"
//                               : "justify-start"
//                           }`}
//                         >
//                           <div
//                             className={`max-w-[70%] rounded-2xl p-3 shadow-sm transition-all duration-200 ${
//                               message.sender === "user"
//                                 ? "bg-teal-500 text-white"
//                                 : "bg-gray-200 text-gray-900"
//                             }`}
//                           >
//                             {isImageUrl(message.content) ? (
//                               <img
//                                 src={message.content}
//                                 alt="Chat image"
//                                 className="max-w-[200px] rounded-lg shadow-sm"
//                               />
//                             ) : (
//                               <p className="text-sm leading-relaxed">
//                                 {message.content}
//                               </p>
//                             )}
//                             <div className="flex items-center justify-between mt-1">
//                               <span className="text-xs opacity-70">
//                                 {message.timestamp}
//                               </span>
//                               {message.sender === "user" &&
//                                 renderMessageStatus(message.status)}
//                             </div>
//                           </div>
//                         </div>
//                       )
//                     )}
//                     <div ref={bottomRef} />
//                   </div>
//                 </ScrollArea>

//                 <div className="p-4 border-t border-gray-200 bg-white/80 backdrop-blur-sm relative">
//                   {showEmojiPicker && (
//                     <div
//                       ref={emojiPickerRef}
//                       className="absolute bottom-16 left-4 z-20"
//                     >
//                       <EmojiPicker
//                         onEmojiClick={handleEmojiClick}
//                         theme="light"
//                         className="border border-gray-300 rounded-lg shadow-xl"
//                       />
//                     </div>
//                   )}
//                   <div className="flex items-center space-x-3">
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => setShowEmojiPicker((prev) => !prev)}
//                       className="text-gray-600 hover:text-teal-500 hover:bg-gray-100 rounded-full"
//                     >
//                       <Smile className="h-5 w-5" />
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={triggerFileInput}
//                       className="text-gray-600 hover:text-teal-500 hover:bg-gray-100 rounded-full"
//                     >
//                       <Paperclip className="h-5 w-5" />
//                     </Button>
//                     <input
//                       type="file"
//                       ref={fileInputRef}
//                       className="hidden"
//                       accept="image/*"
//                       onChange={handleFileUpload}
//                     />
//                     <Input
//                       placeholder="Type your message..."
//                       value={newMessage}
//                       onChange={(e) => setNewMessage(e.target.value)}
//                       onKeyPress={handleKeyPress}
//                       className="flex-1 bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500 rounded-lg transition-all duration-200"
//                     />
//                     <Button
//                       size="icon"
//                       onClick={handleSendMessage}
//                       className="bg-teal-500 hover:bg-teal-600 text-white rounded-full"
//                     >
//                       <Send className="h-5 w-5" />
//                     </Button>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div className="flex-1 flex items-center justify-center text-center p-8 bg-white/80 backdrop-blur-sm">
//                 <div className="space-y-4">
//                   <h3 className="font-semibold text-xl text-gray-900">
//                     No Conversation Selected
//                   </h3>
//                   <p className="text-sm text-gray-500">
//                     Choose a conversation from the left to start chatting
//                   </p>
//                   {error && (
//                     <p className="text-sm text-red-500 bg-red-100/50 p-2 rounded-lg">
//                       {error}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// };

// export default Chatting;
// //==================================================================================================================================
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
  Phone,
  Image,
  Mic,
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

  // Get time for message groups
  const getMessageDate = (timestamp: string) => {
    return new Date().toLocaleDateString() === new Date().toLocaleDateString()
      ? "Today"
      : new Date().toLocaleDateString();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="pr-0 pl-0 gap-0 p-0 bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden"
        style={{ width: "70vw", maxWidth: "1200px" }}
      >
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-[320px] bg-white border-r border-gray-200 shadow-sm">
            <SheetHeader className="p-4 border-b border-gray-100 bg-white">
              <SheetTitle className="text-indigo-700 text-xl font-bold">
                Chat
              </SheetTitle>
            </SheetHeader>
            <div className="p-3">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations"
                  className="pl-9 bg-gray-50 border-gray-200 text-gray-700 placeholder:text-gray-400 focus:border-indigo-300 focus:ring-indigo-300 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="h-[calc(100vh-150px)]">
              <div className="space-y-1 px-2">
                {error && (
                  <p className="text-center text-sm text-red-600 p-3 bg-red-50 rounded-md mx-2">
                    {error}
                  </p>
                )}
                {filteredChatUsers.length > 0 ? (
                  filteredChatUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserClick(user)}
                      className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 
                      ${
                        selectedUser?.id === user.id
                          ? "bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-500"
                          : ""
                      }`}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-400 text-white">
                            {user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        {user.isOnline && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                        )}
                      </div>
                      <div className="flex-1 ml-3 text-left">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">
                            {user.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {user.timestamp || "12:30 PM"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-gray-500 truncate max-w-[150px]">
                            {user.lastMessage || "Start chatting now!"}
                          </p>
                          {user.unread && (
                            <span className="bg-indigo-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                              {user.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8">
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

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedUser ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-gray-200 bg-white shadow-sm flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 border-2 border-indigo-100 shadow-sm">
                      <AvatarImage src={selectedUser.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-400 text-white">
                        {selectedUser.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-9 w-9 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                    >
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-9 w-9 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                    >
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-9 w-9 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Chat Area */}
                <ScrollArea
                  className="flex-1 p-4"
                  ref={chatContainerRef}
                  style={{
                    backgroundImage: `url(${Pattern})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundBlendMode: "soft-light",
                    backgroundColor: "rgba(240, 245, 255, 0.95)",
                  }}
                >
                  {error && (
                    <p className="text-center text-sm text-red-600 p-3 bg-red-50 rounded-md mb-4 shadow-sm">
                      {error}
                    </p>
                  )}

                  {/* Date separator */}
                  <div className="flex justify-center mb-6">
                    <div className="px-4 py-1 rounded-full bg-gray-100 text-xs text-gray-600 shadow-sm">
                      {getMessageDate("")}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {(chatHistories[activeChatId || ""] || []).map(
                      (message, index) => (
                        <div
                          key={message._id}
                          className={`flex ${
                            message.sender === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          {message.sender !== "user" &&
                            index > 0 &&
                            chatHistories[activeChatId || ""][index - 1]
                              .sender === "user" && (
                              <Avatar className="h-8 w-8 mr-2 mt-1">
                                <AvatarImage src={selectedUser.avatar} />
                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-400 text-white text-xs">
                                  {selectedUser.name[0]}
                                </AvatarFallback>
                              </Avatar>
                            )}

                          <div
                            className={`max-w-[70%] rounded-2xl p-3 shadow-sm ${
                              message.sender === "user"
                                ? "bg-gradient-to-r from-indigo-500 to-blue-400 text-white rounded-br-none"
                                : "bg-white text-gray-700 rounded-bl-none"
                            }`}
                          >
                            {isImageUrl(message.content) ? (
                              <div className="rounded-lg overflow-hidden mb-1">
                                <img
                                  src={message.content}
                                  alt="Chat image"
                                  className="max-w-full h-auto rounded-lg"
                                />
                              </div>
                            ) : (
                              <p className="text-sm">{message.content}</p>
                            )}
                            <div className="flex items-center justify-end mt-1 gap-1">
                              <span
                                className={`text-xs opacity-80 ${
                                  message.sender === "user"
                                    ? "text-blue-100"
                                    : "text-gray-500"
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
                    <div ref={bottomRef} />
                  </div>
                </ScrollArea>

                {/* Message Input Area */}
                <div className="p-4 border-t border-gray-200 bg-white relative shadow-sm">
                  {showEmojiPicker && (
                    <div
                      ref={emojiPickerRef}
                      className="absolute bottom-16 left-4 z-10 shadow-lg rounded-lg overflow-hidden"
                    >
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  )}
                  <div className="flex items-center gap-2 bg-gray-50 rounded-full p-1 pl-4 pr-1 border border-gray-200 hover:border-indigo-200 transition-colors shadow-sm">
                    <Input
                      placeholder="Type your message here..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 border-0 bg-transparent text-gray-700 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />

                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                        className="rounded-full h-9 w-9 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                      >
                        <Smile className="h-5 w-5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={triggerFileInput}
                        className="rounded-full h-9 w-9 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                      >
                        <Image className="h-5 w-5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-9 w-9 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                      >
                        <Mic className="h-5 w-5" />
                      </Button>

                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                      />

                      <Button
                        size="icon"
                        onClick={handleSendMessage}
                        className="rounded-full h-10 w-10 bg-indigo-500 hover:bg-indigo-600 text-white ml-1 shadow-sm transition-colors"
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // No chat selected state
              <div className="flex-1 flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="text-center p-8 max-w-md">
                  <div className="mx-auto h-24 w-24 rounded-full bg-white shadow-md flex items-center justify-center mb-6">
                    <Send className="h-10 w-10 text-indigo-500" />
                  </div>
                  <h3 className="font-bold text-2xl text-gray-800 mb-3">
                    Start Messaging
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Select a conversation from the list to start chatting or
                    search for someone specific
                  </p>
                  {error && (
                    <p className="text-sm text-red-600 p-3 bg-red-50 rounded-md shadow-sm">
                      {error}
                    </p>
                  )}
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
