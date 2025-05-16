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
// }

// const Chat: React.FC<ChatProps> = ({
//   isOpen,
//   onClose,
//   messages,
//   sendMessage,
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
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`p-3 rounded-lg max-w-[85%] ${
//               message.senderId === "local"
//                 ? "ml-auto bg-blue-100 text-gray-900"
//                 : "bg-gray-100 text-gray-900"
//             }`}
//           >
//             <div className="font-medium text-xs text-gray-600">
//               {message.senderName}
//             </div>
//             <p>{message.text}</p>
//             <div className="text-xs text-right mt-1 text-gray-500">
//               {message.timestamp.toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })}
//             </div>
//           </div>
//         ))}
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
import React from "react";
import { X } from "lucide-react";
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
}

const Chat: React.FC<ChatProps> = ({
  isOpen,
  onClose,
  messages,
  sendMessage,
}) => {
  const [input, setInput] = React.useState("");

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-0 h-full bg-white dark:bg-gray-900 w-80 z-10 overflow-y-auto">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Chat</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={20} />
        </Button>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <p className="font-semibold">{msg.senderName}</p>
            <p>{msg.text}</p>
            <p className="text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          className="w-full p-2 rounded bg-gray-800 text-white"
          placeholder="Type a message..."
        />
      </div>
    </div>
  );
};

export default Chat;
