// import React, { useState, useRef, useEffect } from "react";
// import { useMeeting } from "@/contexts/MeetingContext";
// import { Send, X } from "lucide-react";

// interface ChatProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const Chat: React.FC<ChatProps> = ({ isOpen, onClose }) => {
//   const { messages, sendMessage } = useMeeting();
//   const [newMessage, setNewMessage] = useState("");
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Auto-scroll to bottom when new messages arrive
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

//   // Add some mock messages for demonstration
//   useEffect(() => {
//     if (messages.length === 0) {
//       setTimeout(() => {
//         sendMessage("Hello everyone!");
//       }, 1000);

//       setTimeout(() => {
//         // Using context to simulate a received message
//         const mockMessage = {
//           id: Date.now().toString(),
//           senderId: "123",
//           senderName: "John Doe",
//           text: "Hi there, can everyone see my screen?",
//           timestamp: new Date(),
//         };
//         // @ts-ignore - This is just for demo purposes
//         setMessages((prev) => [...prev, mockMessage]);
//       }, 2000);
//     }
//   }, []);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed right-0 top-0 h-full w-full sm:w-80 bg-white shadow-lg flex flex-col z-10 slide-up">
//       <div className="flex items-center justify-between p-4 border-b">
//         <h3 className="text-lg font-medium">In-call messages</h3>
//         <button
//           onClick={onClose}
//           className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100"
//         >
//           <X className="w-5 h-5" />
//         </button>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`p-3 rounded-lg max-w-[85%] ${
//               message.senderId === "local"
//                 ? "ml-auto bg-primary-100 text-neutral-900"
//                 : "bg-neutral-100 text-neutral-900"
//             }`}
//           >
//             <div className="font-medium text-xs text-neutral-600">
//               {message.senderName}
//             </div>
//             <p>{message.text}</p>
//             <div className="text-xs text-right mt-1 text-neutral-500">
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
//           <input
//             type="text"
//             placeholder="Send a message"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             className="input-field pr-10"
//           />
//           <button
//             type="submit"
//             className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-primary-500 hover:bg-primary-50"
//           >
//             <Send className="w-4 h-4" />
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Chat;

import React, { useState, useRef, useEffect } from "react";
import { Send, X } from "lucide-react";
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
}

const Chat: React.FC<ChatProps> = ({
  isOpen,
  onClose,
  messages,
  sendMessage,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg flex flex-col z-10">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-medium">In-call messages</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg max-w-[85%] ${
              message.senderId === "local"
                ? "ml-auto bg-blue-100 text-gray-900"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            <div className="font-medium text-xs text-gray-600">
              {message.senderName}
            </div>
            <p>{message.text}</p>
            <div className="text-xs text-right mt-1 text-gray-500">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="relative">
          <Input
            type="text"
            placeholder="Send a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="pr-10"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
          >
            <Send className="w-4 h-4 text-blue-600" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
