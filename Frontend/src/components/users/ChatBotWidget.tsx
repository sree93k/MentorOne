// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Chatbot from "./ChatBot"; // Your core Chatbot component
// import { Button } from "@/components/ui/button"; // Shadcn Button
// import AnimatedGradientCircle from "@/components/users/AnimatedGraidentCirlce"; // Import the new component

// // Optional: If you use lucide-react for icons
// // import { MessageSquare, X } from 'lucide-react';

// const ChatbotWidget: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleChat = () => {
//     setIsOpen(!isOpen);
//   };

//   // Replace with a dynamic userId from your authentication context
//   // This helps maintain chat history per user on the backend.
//   const userId = "currentMenteeUser"; // Example: Get this from your auth state (e.g., useSelector, useContext)

//   return (
//     <>
//       {/* Chatbot Window */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: 100, x: 100 }}
//             animate={{ opacity: 1, y: 0, x: 0 }}
//             exit={{ opacity: 0, y: 100, x: 100 }}
//             transition={{ duration: 0.3, ease: "easeOut" }}
//             // Fixed position for the chat window
//             className="fixed bottom-24 right-4 z-[1000] w-full max-w-sm h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden flex flex-col md:max-w-md lg:max-w-lg"
//           >
//             <div className="flex justify-between items-center p-4 bg-blue-600 text-white rounded-t-lg shadow-md">
//               <h3 className="text-lg font-semibold">AI Mentor Chat</h3>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={toggleChat}
//                 className="hover:bg-blue-700 text-white"
//               >
//                 {/* Use a simple X or an icon component like <X className="h-5 w-5" /> */}
//                 <span className="text-xl font-bold">×</span>
//               </Button>
//             </div>
//             <div className="flex-grow overflow-hidden">
//               <Chatbot userId={userId} /> {/* Pass the userId */}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Toggle Button (with Animated Gradient) */}
//       <Button
//         onClick={toggleChat}
//         // Fixed position for the button
//         className="fixed bottom-4 right-4 z-[1001] p-0 w-16 h-16 rounded-full overflow-hidden shadow-lg transform hover:scale-110 transition-all duration-300 ease-in-out group"
//         size="icon"
//       >
//         <AnimatedGradientCircle /> {/* The animated gradient circle */}
//         {/* Icon/Text for the button, overlaid on the gradient */}
//         <div className="relative z-10 flex items-center justify-center w-full h-full text-white text-3xl font-bold group-hover:animate-pulse">
//           {/* Use icons if you have them, e.g., <MessageSquare className="w-8 h-8" /> */}
//           {isOpen ? (
//             <span className="text-4xl">×</span>
//           ) : (
//             // A simple message icon SVG
//             <svg
//               className="w-8 h-8"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
//               <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
//             </svg>
//           )}
//         </div>
//       </Button>
//     </>
//   );
// };

// export default ChatbotWidget;
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Bot, User, ChevronDown } from "lucide-react";

// FAQ Data Structure
const FAQ_DATA = [
  {
    id: 1,
    category: "Getting Started",
    question: "How do I find the right mentor?",
    answer:
      "Browse our mentor profiles, filter by expertise, and book a consultation. We match you based on your goals and learning style.",
  },
  {
    id: 2,
    category: "Sessions",
    question: "How long are mentoring sessions?",
    answer:
      "Standard sessions are 60 minutes, but we offer 30-minute quick consultations and 90-minute deep-dive sessions.",
  },
  {
    id: 3,
    category: "Pricing",
    question: "What are your pricing plans?",
    answer:
      "We offer flexible pricing: $50/session for 1-on-1 mentoring, $30/session for group sessions, and monthly packages starting at $150.",
  },
  {
    id: 4,
    category: "Platform",
    question: "Can I reschedule sessions?",
    answer:
      "Yes! You can reschedule up to 24 hours before your session through your dashboard or by contacting your mentor directly.",
  },
  {
    id: 5,
    category: "Support",
    question: "What if I'm not satisfied with my mentor?",
    answer:
      "We offer a satisfaction guarantee. You can request a new mentor match within your first 3 sessions at no extra cost.",
  },
];

const QUICK_ACTIONS = [
  { id: 1, text: "Find a mentor", action: "find_mentor" },
  { id: 2, text: "Book a session", action: "book_session" },
  { id: 3, text: "View my dashboard", action: "dashboard" },
  { id: 4, text: "Pricing plans", action: "pricing" },
];

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "text" | "faq" | "quick_action";
}

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial welcome message
      setTimeout(() => {
        addBotMessage(
          "Hi! 👋 How can I help you today? I can assist you with finding mentors, booking sessions, or answer any questions about our platform."
        );
        setTimeout(() => {
          addBotMessage(
            "Feel free to ask me anything or check out our FAQ for quick answers!",
            "faq"
          );
        }, 1000);
      }, 500);
    }
  }, [isOpen]);

  const addBotMessage = (
    text: string,
    type: "text" | "faq" | "quick_action" = "text"
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "bot",
      timestamp: new Date(),
      type,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const simulateTyping = (callback: () => void, delay = 1500) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    addUserMessage(inputText);
    const userMessage = inputText.toLowerCase();
    setInputText("");

    // Simple keyword-based responses
    simulateTyping(() => {
      if (userMessage.includes("mentor") || userMessage.includes("find")) {
        addBotMessage(
          "Great! I can help you find the perfect mentor. What field or skill are you looking to develop? You can browse our mentors by expertise on the 'Find Mentors' page."
        );
      } else if (
        userMessage.includes("book") ||
        userMessage.includes("session")
      ) {
        addBotMessage(
          "Booking a session is easy! Once you've chosen a mentor, you can view their availability and book directly through their profile. Need help finding the right time slot?"
        );
      } else if (
        userMessage.includes("price") ||
        userMessage.includes("cost")
      ) {
        addBotMessage(
          "Our pricing is flexible: $50 for 1-on-1 sessions, $30 for group sessions, and we offer monthly packages starting at $150. Would you like to see our full pricing details?"
        );
      } else if (
        userMessage.includes("cancel") ||
        userMessage.includes("reschedule")
      ) {
        addBotMessage(
          "You can reschedule or cancel sessions up to 24 hours in advance through your dashboard. Need help accessing your bookings?"
        );
      } else {
        addBotMessage(
          "I'd be happy to help! You can ask me about finding mentors, booking sessions, pricing, or check our FAQ for more information. What specifically would you like to know?"
        );
      }
    });
  };

  const handleQuickAction = (action: string, text: string) => {
    addUserMessage(text);
    simulateTyping(() => {
      switch (action) {
        case "find_mentor":
          addBotMessage(
            "Perfect! Let me guide you to find the right mentor. What's your area of interest? We have experts in technology, business, design, marketing, and more."
          );
          break;
        case "book_session":
          addBotMessage(
            "Ready to book? First, you'll need to select a mentor. Once you've found someone who matches your needs, you can view their calendar and pick a time that works for you."
          );
          break;
        case "dashboard":
          addBotMessage(
            "Your dashboard shows all your upcoming sessions, mentor connections, and learning progress. You can access it from the main menu after logging in."
          );
          break;
        case "pricing":
          addBotMessage(
            "Here's our pricing: Individual sessions ($50), Group sessions ($30), Monthly unlimited ($150), Quarterly package ($400). All plans include session recordings and follow-up resources."
          );
          break;
      }
    });
  };

  const handleFAQClick = (faq: (typeof FAQ_DATA)[0]) => {
    addUserMessage(faq.question);
    simulateTyping(() => {
      addBotMessage(faq.answer);
    }, 800);
    setShowFAQ(false);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowFAQ(false);
    }
  };

  const categories = [
    "all",
    ...Array.from(new Set(FAQ_DATA.map((faq) => faq.category))),
  ];
  const filteredFAQs =
    selectedCategory === "all"
      ? FAQ_DATA
      : FAQ_DATA.filter((faq) => faq.category === selectedCategory);

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
              scale: { duration: 0.3 },
            }}
            className="fixed bottom-20 right-4 z-[1000] w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">AI Mentor Assistant</h3>
                  <p className="text-xs text-white/80">Always here to help</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
                className="hover:bg-white/20 text-white h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      message.sender === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === "user"
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-white text-gray-800 rounded-bl-md shadow-sm border"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Actions */}
              {messages.length <= 2 && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  className="grid grid-cols-2 gap-2 mt-4"
                >
                  {QUICK_ACTIONS.map((action) => (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleQuickAction(action.action, action.text)
                      }
                      className="text-xs py-2 h-auto text-left justify-start hover:bg-blue-50 hover:border-blue-300"
                    >
                      {action.text}
                    </Button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* FAQ Toggle */}
            <div className="px-4 py-2 border-t bg-white">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFAQ(!showFAQ)}
                className="w-full justify-between text-sm text-gray-600 hover:bg-gray-50"
              >
                Frequently Asked Questions
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showFAQ ? "rotate-180" : ""
                  }`}
                />
              </Button>

              <AnimatePresence>
                {showFAQ && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 space-y-2 max-h-48 overflow-y-auto"
                  >
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-2 text-xs border rounded-lg"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat === "all" ? "All Categories" : cat}
                        </option>
                      ))}
                    </select>
                    {filteredFAQs.map((faq) => (
                      <button
                        key={faq.id}
                        onClick={() => handleFAQClick(faq)}
                        className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <div className="font-medium text-gray-800">
                          {faq.question}
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                          {faq.category}
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="rounded-full bg-blue-600 hover:bg-blue-700 w-10 h-10"
                  disabled={!inputText.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-4 right-4 z-[1001]"
      >
        <Button
          onClick={toggleChat}
          className={`w-16 h-16 rounded-full shadow-lg transition-all duration-300 ${
            isOpen
              ? "bg-gray-600 hover:bg-gray-700"
              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          }`}
          size="icon"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <MessageCircle className="w-6 h-6 text-white" />
                {/* Notification dot */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    </>
  );
};

export default ChatbotWidget;
