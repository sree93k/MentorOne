// import React, { useState, useRef, useEffect } from "react";
// import { Send, X } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// interface Message {
//   id: string;
//   senderId: string;
//   senderName: string;
//   text: string;
//   timestamp: Date;
// }

// interface ChatProps {
//   isOpen: boolean;
//   onClose: () => void;
//   messages: Message[];
//   sendMessage: (text: string) => void;
//   currentUserId: string;
// }

// const Chat: React.FC<ChatProps> = ({
//   isOpen,
//   onClose,
//   messages,
//   sendMessage,
//   currentUserId,
// }) => {
//   const [newMessage, setNewMessage] = useState("");
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSendMessage = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (newMessage.trim()) {
//       sendMessage(newMessage);
//       setNewMessage("");
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg flex flex-col z-10">
//       <div className="flex items-center justify-between p-4 border-b">
//         <h3 className="text-lg font-medium">In-call messages</h3>
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={onClose}
//           className="rounded-full"
//         >
//           <X className="w-5 h-5" />
//         </Button>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((message) => {
//           // Ensure timestamp is a valid Date; if not, use a fallback
//           const timestamp =
//             message.timestamp instanceof Date &&
//             !isNaN(message.timestamp.getTime())
//               ? message.timestamp
//               : new Date();
//           return (
//             <div
//               key={message.id}
//               className={`p-3 rounded-lg max-w-[85%] ${
//                 message.senderId === currentUserId
//                   ? "ml-auto bg-blue-100 text-gray-900"
//                   : "bg-gray-100 text-gray-900"
//               }`}
//             >
//               <div className="font-medium text-xs text-gray-600">
//                 {message.senderName}
//               </div>
//               <p>{message.text}</p>
//               <div className="text-xs text-right mt-1 text-gray-500">
//                 {timestamp.toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </div>
//             </div>
//           );
//         })}
//         <div ref={messagesEndRef} />
//       </div>

//       <form onSubmit={handleSendMessage} className="p-4 border-t">
//         <div className="relative">
//           <Input
//             type="text"
//             placeholder="Send a message"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             className="pr-10"
//           />
//           <Button
//             type="submit"
//             variant="ghost"
//             size="icon"
//             className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
//           >
//             <Send className="w-4 h-4 text-blue-600" />
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Chat;
import React, { useState, useRef, useEffect } from "react";
import { Send, X, MessageSquare, Smile } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
}

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  sendMessage: (text: string) => void;
  currentUserId: string;
}

const Chat: React.FC<ChatProps> = ({
  isOpen,
  onClose,
  messages,
  sendMessage,
  currentUserId,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage("");
      setIsTyping(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-gradient-to-b from-white via-gray-50 to-white shadow-2xl flex flex-col z-30 border-l border-gray-200 animate-slide-in-right">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Chat</h3>
            <p className="text-sm text-gray-500">{messages.length} messages</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <X className="w-5 h-5 text-gray-600" />
        </Button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">No messages yet</p>
            <p className="text-sm text-center mt-1">Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const timestamp =
              message.timestamp instanceof Date &&
              !isNaN(message.timestamp.getTime())
                ? message.timestamp
                : new Date();

            const isCurrentUser = message.senderId === currentUserId;
            const showAvatar =
              index === 0 || messages[index - 1].senderId !== message.senderId;

            return (
              <div
                key={message.id}
                className={`flex gap-3 animate-fade-in ${
                  isCurrentUser ? "flex-row-reverse" : "flex-row"
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Avatar */}
                {showAvatar && (
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                      isCurrentUser
                        ? "bg-gradient-to-r from-blue-500 to-blue-600"
                        : "bg-gradient-to-r from-gray-500 to-gray-600"
                    }`}
                  >
                    {message.senderName.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Message Content */}
                <div
                  className={`flex flex-col max-w-[80%] ${
                    isCurrentUser ? "items-end" : "items-start"
                  }`}
                >
                  {/* Sender Name */}
                  {showAvatar && (
                    <div
                      className={`text-xs text-gray-500 mb-1 ${
                        isCurrentUser ? "text-right" : "text-left"
                      }`}
                    >
                      {isCurrentUser ? "You" : message.senderName}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`relative p-3 rounded-2xl max-w-full break-words transition-all duration-200 hover:scale-[1.02] ${
                      isCurrentUser
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-sm"
                        : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>

                    {/* Message Tail */}
                    <div
                      className={`absolute top-0 w-3 h-3 ${
                        isCurrentUser
                          ? "-right-1 bg-blue-600 transform rotate-45"
                          : "-left-1 bg-white border-l border-t border-gray-200 transform rotate-45"
                      }`}
                    />
                  </div>

                  {/* Timestamp */}
                  <div
                    className={`text-xs text-gray-400 mt-1 ${
                      isCurrentUser ? "text-right" : "text-left"
                    }`}
                  >
                    {timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="px-4 py-2 text-sm text-gray-500 bg-gray-50 border-t">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
            <span>You are typing...</span>
          </div>
        </div>
      )}

      {/* Enhanced Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-200 bg-white"
      >
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={handleInputChange}
            className="pr-12 pl-4 py-3 rounded-full border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
          />

          {/* Emoji Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-12 top-1/2 transform -translate-y-1/2 rounded-full hover:bg-gray-100"
          >
            <Smile className="w-4 h-4 text-gray-500" />
          </Button>

          {/* Send Button */}
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            disabled={!newMessage.trim()}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full transition-all duration-200 ${
              newMessage.trim()
                ? "text-blue-600 hover:bg-blue-50 hover:scale-110"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>

      {/* Custom CSS for animations */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }

        .scrollbar-thin {
          scrollbar-width: thin;
        }

        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 6px;
        }

        .scrollbar-track-gray-100::-webkit-scrollbar-track {
          background-color: #f3f4f6;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Chat;
