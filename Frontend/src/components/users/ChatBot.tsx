import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button"; // Assuming Shadcn Button component
import { Input } from "@/components/ui/input"; // Assuming Shadcn Input component
import { Card, CardContent } from "@/components/ui/card"; // Assuming Shadcn Card components
import { ScrollArea } from "@/components/ui/scroll-area"; // Assuming Shadcn ScrollArea component

/**
 * Interface for a single chat message.
 */
interface ChatMessage {
  sender: "user" | "bot"; // Who sent the message: 'user' or 'bot'
  text: string; // The content of the message
}

/**
 * Props for the Chatbot component.
 */
interface ChatbotProps {
  userId?: string; // Optional user ID, useful for backend to track conversations
}

/**
 * The core Chatbot component providing the chat interface.
 * It handles message display, user input, and communication with the backend AI.
 */
const Chatbot: React.FC<ChatbotProps> = ({ userId }) => {
  // State to store all chat messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // State for the current message being typed by the user
  const [inputMessage, setInputMessage] = useState<string>("");
  // State to indicate if an AI response is being loaded
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Ref to automatically scroll to the bottom of the chat
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Effect to scroll to the latest message whenever messages state updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * Handles sending a message:
   * 1. Adds user message to chat.
   * 2. Clears input field.
   * 3. Calls backend API to get AI response.
   * 4. Adds bot response to chat.
   */
  const sendMessage = async () => {
    // Prevent sending empty messages
    if (inputMessage.trim() === "") return;

    // Add user's message to the chat display immediately
    const newUserMessage: ChatMessage = { sender: "user", text: inputMessage };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage(""); // Clear the input field
    setIsLoading(true); // Show loading indicator

    try {
      // Prepare conversation history to send to the AI for context.
      // We send the last 5 messages as an example to maintain context.
      // Adjust this number based on your AI model's token limits and desired conversation depth.
      const conversationHistory = messages.slice(-5);

      // Make a POST request to your backend's chatbot API endpoint
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: inputMessage,
        conversationHistory: conversationHistory,
        userId: userId, // Pass the userId for backend tracking if available
      });

      // Extract the bot's response from the API result
      const botResponse: ChatMessage = {
        sender: "bot",
        text: response.data.response,
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]); // Add bot's message to chat
    } catch (error) {
      console.error("Error sending message to AI:", error);
      // Display an error message if the API call fails
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          text: "Oops! Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  /**
   * Handles the "Enter" key press in the input field to send messages.
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      // Send only if Enter is pressed and not already loading
      sendMessage();
    }
  };

  return (
    // The main container for the chat interface. It assumes its size is set by its parent (ChatbotWidget).
    <Card className="flex flex-col h-full border-none shadow-none rounded-none">
      <CardContent className="p-4 flex flex-col flex-grow overflow-hidden">
        {/* Scrollable area for chat messages */}
        <ScrollArea className="flex-grow pr-4">
          <div className="flex flex-col space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl ${
                    // Message bubble styling
                    msg.sender === "user"
                      ? "bg-blue-500 text-white rounded-br-none" // User messages (blue, right-aligned)
                      : "bg-gray-200 text-gray-800 rounded-bl-none" // Bot messages (gray, left-aligned)
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {/* Loading indicator when waiting for AI response */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[70%] p-3 rounded-xl bg-gray-200 text-gray-800 rounded-bl-none">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} /> {/* Invisible element to scroll to */}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Input field and send button */}
      <div className="p-4 border-t flex items-center gap-2">
        <Input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-grow rounded-lg p-2"
          disabled={isLoading} // Disable input while loading
        />
        <Button
          onClick={sendMessage}
          disabled={isLoading}
          className="rounded-lg px-4 py-2"
        >
          {isLoading ? "Sending..." : "Send"}{" "}
          {/* Button text changes while loading */}
        </Button>
      </div>
    </Card>
  );
};

export default Chatbot;
