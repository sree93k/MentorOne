import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Chatbot from "./ChatBot"; // Your core Chatbot component
import { Button } from "@/components/ui/button"; // Shadcn Button
import AnimatedGradientCircle from "@/components/users/AnimatedGraidentCirlce"; // Import the new component

// Optional: If you use lucide-react for icons
// import { MessageSquare, X } from 'lucide-react';

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Replace with a dynamic userId from your authentication context
  // This helps maintain chat history per user on the backend.
  const userId = "currentMenteeUser"; // Example: Get this from your auth state (e.g., useSelector, useContext)

  return (
    <>
      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 100, x: 100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            // Fixed position for the chat window
            className="fixed bottom-24 right-4 z-[1000] w-full max-w-sm h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden flex flex-col md:max-w-md lg:max-w-lg"
          >
            <div className="flex justify-between items-center p-4 bg-blue-600 text-white rounded-t-lg shadow-md">
              <h3 className="text-lg font-semibold">AI Mentor Chat</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
                className="hover:bg-blue-700 text-white"
              >
                {/* Use a simple X or an icon component like <X className="h-5 w-5" /> */}
                <span className="text-xl font-bold">×</span>
              </Button>
            </div>
            <div className="flex-grow overflow-hidden">
              <Chatbot userId={userId} /> {/* Pass the userId */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button (with Animated Gradient) */}
      <Button
        onClick={toggleChat}
        // Fixed position for the button
        className="fixed bottom-4 right-4 z-[1001] p-0 w-16 h-16 rounded-full overflow-hidden shadow-lg transform hover:scale-110 transition-all duration-300 ease-in-out group"
        size="icon"
      >
        <AnimatedGradientCircle /> {/* The animated gradient circle */}
        {/* Icon/Text for the button, overlaid on the gradient */}
        <div className="relative z-10 flex items-center justify-center w-full h-full text-white text-3xl font-bold group-hover:animate-pulse">
          {/* Use icons if you have them, e.g., <MessageSquare className="w-8 h-8" /> */}
          {isOpen ? (
            <span className="text-4xl">×</span>
          ) : (
            // A simple message icon SVG
            <svg
              className="w-8 h-8"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
            </svg>
          )}
        </div>
      </Button>
    </>
  );
};

export default ChatbotWidget;
