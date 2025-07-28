import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

// Backend service
import chatbotService from "@/services/chatbotService";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  source?: "faq" | "ai" | "fallback" | "keyword_match";
  faqId?: string;
  helpful?: boolean;
  suggestions?: string[];
  userType?: "anonymous" | "mentee" | "mentor";
}

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: {
    name: string;
    _id: string;
  };
  keywords: string[];
  priority: number;
  analytics: {
    views: number;
    helpful: number;
    notHelpful: number;
  };
}

interface FAQCategory {
  _id: string;
  name: string;
  description: string;
  priority: number;
}

interface RateLimitStatus {
  hasLimit: boolean;
  allowed?: boolean;
  remaining?: number;
  resetTime?: string;
  message?: string;
}

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [rateLimitStatus, setRateLimitStatus] =
    useState<RateLimitStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load initial data when component mounts
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log("🔄 Loading initial chatbot data...");
        const [faqsData, categoriesData, rateLimitData] = await Promise.all([
          chatbotService.getFAQs(),
          chatbotService.getCategories(),
          chatbotService.getRateLimitStatus(),
        ]);

        setFaqs(faqsData);
        setCategories(categoriesData);
        setRateLimitStatus(rateLimitData);
        setIsConnected(true);
        console.log("✅ Initial data loaded successfully");
      } catch (error) {
        console.error("❌ Failed to load initial data:", error);
        setIsConnected(false);
        setError("Unable to connect to chatbot service");
      }
    };

    loadInitialData();
  }, []);

  // Load conversation history and show welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addBotMessage(
          "Hi! 👋 How can I help you today? I can assist you with finding mentors, booking sessions, or answer any questions about our platform."
        );
        setTimeout(() => {
          addBotMessage(
            "Feel free to ask me anything or check out our FAQ for quick answers!",
            undefined,
            undefined,
            undefined,
            [
              "Tell me about pricing",
              "How do I find a mentor?",
              "What features do you offer?",
            ]
          );
        }, 1000);
      }, 500);
    }
  }, [isOpen]);

  const addBotMessage = (
    text: string,
    source?: "faq" | "ai" | "fallback" | "keyword_match",
    faqId?: string,
    helpful?: boolean,
    suggestions?: string[],
    userType?: "anonymous" | "mentee" | "mentor"
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "bot",
      timestamp: new Date(),
      source,
      faqId,
      helpful,
      suggestions,
      userType,
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

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Check rate limit for anonymous users
    if (rateLimitStatus?.hasLimit && !rateLimitStatus.allowed) {
      setError(`Rate limit exceeded. Please try again later.`);
      return;
    }

    const userMessage = inputText;
    setInputText("");
    setError(null);

    addUserMessage(userMessage);
    setIsTyping(true);

    try {
      console.log("🚀 Sending message to backend:", userMessage);
      const response = await chatbotService.sendMessage(userMessage);
      console.log("✅ Received response:", response);

      setIsTyping(false);
      setIsConnected(true);

      addBotMessage(
        response.response,
        response.source,
        response.faqId,
        undefined,
        response.suggestions,
        response.userType
      );

      // Update rate limit status
      try {
        const newRateLimit = await chatbotService.getRateLimitStatus();
        setRateLimitStatus(newRateLimit);
      } catch (rateLimitError) {
        console.warn("Failed to update rate limit status:", rateLimitError);
      }
    } catch (error: any) {
      console.error("❌ Failed to send message:", error);
      setIsTyping(false);
      setIsConnected(false);
      setError(error.message);

      addBotMessage(
        "I'm sorry, I'm having trouble responding right now. Please try again later.",
        "fallback"
      );
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  const handleFAQClick = (faq: FAQ) => {
    addUserMessage(faq.question);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      addBotMessage(faq.answer, "faq", faq._id);
    }, 800);

    setShowFAQ(false);
  };

  const handleFeedback = async (
    messageId: string,
    faqId: string,
    helpful: boolean
  ) => {
    try {
      await chatbotService.markFAQHelpful(faqId, helpful);

      // Update the message to show feedback was recorded
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, helpful } : msg))
      );
    } catch (error) {
      console.error("Failed to record feedback:", error);
    }
  };

  const clearConversation = async () => {
    try {
      await chatbotService.clearConversation();
      setMessages([]);
      setError(null);

      // Add welcome message after clearing
      setTimeout(() => {
        addBotMessage(
          "Hi! 👋 How can I help you today? I can assist you with finding mentors, booking sessions, or answer any questions about our platform."
        );
      }, 500);
    } catch (error) {
      console.error("Failed to clear conversation:", error);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowFAQ(false);
      setError(null);
    }
  };

  const filteredFAQs =
    selectedCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category._id === selectedCategory);

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map((cat) => ({ value: cat._id, label: cat.name })),
  ];

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
                  <p className="text-xs text-white/80 flex items-center">
                    {isConnected ? (
                      <>
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        Always here to help
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                        Connection issues
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearConversation}
                  className="hover:bg-white/20 text-white h-8 w-8"
                  title="Clear conversation"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleChat}
                  className="hover:bg-white/20 text-white h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border-b border-red-200">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Rate Limit Warning */}
            {rateLimitStatus?.hasLimit &&
              rateLimitStatus.remaining !== undefined &&
              rateLimitStatus.remaining < 3 && (
                <div className="p-3 bg-yellow-50 border-b border-yellow-200">
                  <p className="text-sm text-yellow-700">
                    {rateLimitStatus.remaining} questions remaining this hour
                  </p>
                </div>
              )}

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
                    <div className="flex flex-col space-y-1">
                      <div
                        className={`px-4 py-3 rounded-2xl text-sm ${
                          message.sender === "user"
                            ? "bg-blue-600 text-white rounded-br-md"
                            : "bg-white text-gray-800 rounded-bl-md shadow-sm border"
                        }`}
                      >
                        {message.text}

                        {/* Source indicator for bot messages */}
                        {message.sender === "bot" && message.source && (
                          <div className="text-xs text-gray-500 mt-1">
                            {message.userType && (
                              <span className="capitalize">
                                {message.userType}
                              </span>
                            )}{" "}
                            • {message.source.replace("_", " ").toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Feedback buttons for FAQ responses */}
                      {message.sender === "bot" &&
                        message.source === "faq" &&
                        message.faqId &&
                        message.helpful === undefined && (
                          <div className="flex items-center space-x-2 px-2">
                            <span className="text-xs text-gray-500">
                              Was this helpful?
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleFeedback(message.id, message.faqId!, true)
                              }
                              className="h-6 w-6 p-0 hover:bg-green-100"
                            >
                              <ThumbsUp className="h-3 w-3 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleFeedback(
                                  message.id,
                                  message.faqId!,
                                  false
                                )
                              }
                              className="h-6 w-6 p-0 hover:bg-red-100"
                            >
                              <ThumbsDown className="h-3 w-3 text-red-600" />
                            </Button>
                          </div>
                        )}

                      {/* Feedback confirmation */}
                      {message.sender === "bot" &&
                        message.helpful !== undefined && (
                          <div className="px-2">
                            <span className="text-xs text-gray-500">
                              Thanks for your feedback!{" "}
                              {message.helpful ? "👍" : "👎"}
                            </span>
                          </div>
                        )}

                      {/* Suggestions */}
                      {message.sender === "bot" &&
                        message.suggestions &&
                        message.suggestions.length > 0 && (
                          <div className="flex flex-wrap gap-1 px-2">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleSuggestionClick(suggestion)
                                }
                                className="text-xs py-1 px-2 h-auto hover:bg-blue-50 hover:border-blue-300"
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
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
                Frequently Asked Questions ({faqs.length})
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
                    {categoryOptions.length > 1 && (
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full p-2 text-xs border rounded-lg"
                      >
                        {categoryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                    {filteredFAQs.map((faq) => (
                      <button
                        key={faq._id}
                        onClick={() => handleFAQClick(faq)}
                        className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <div className="font-medium text-gray-800">
                          {faq.question}
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                          {faq.category.name} • {faq.analytics.views} views
                        </div>
                      </button>
                    ))}
                    {filteredFAQs.length === 0 && (
                      <div className="text-center text-gray-500 text-xs py-4">
                        No FAQs found for this category
                      </div>
                    )}
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
                  placeholder={
                    isConnected
                      ? "Type your message..."
                      : "Connection lost, retrying..."
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  disabled={
                    isTyping ||
                    !isConnected ||
                    (rateLimitStatus?.hasLimit && !rateLimitStatus.allowed)
                  }
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="rounded-full bg-blue-600 hover:bg-blue-700 w-10 h-10"
                  disabled={
                    !inputText.trim() ||
                    isTyping ||
                    !isConnected ||
                    (rateLimitStatus?.hasLimit && !rateLimitStatus.allowed)
                  }
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Connection status */}
              {!isConnected && (
                <div className="text-xs text-gray-500 mt-2 text-center">
                  Trying to reconnect...
                </div>
              )}
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
