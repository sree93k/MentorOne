// Frontend: services/chatbotService.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

const chatbotAPI = axios.create({
  baseURL: `${API_BASE_URL}/api/chatbot`,
  withCredentials: true, // Important for cookie-based auth
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ChatbotMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  source?: "faq" | "ai" | "fallback";
  faqId?: string;
  helpful?: boolean;
}

export interface ChatbotResponse {
  response: string;
  source: "faq" | "ai" | "fallback";
  confidence: number;
  faqId?: string;
  suggestions?: string[];
  userType: "anonymous" | "mentee" | "mentor";
  timestamp: string;
}

export interface FAQ {
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

export interface FAQCategory {
  _id: string;
  name: string;
  description: string;
  priority: number;
}

export interface RateLimitStatus {
  hasLimit: boolean;
  allowed?: boolean;
  remaining?: number;
  resetTime?: string;
  message?: string;
}

class ChatbotService {
  private sessionId: string;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem("chatbot_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      sessionStorage.setItem("chatbot_session_id", sessionId);
    }
    return sessionId;
  }

  // Send message to chatbot
  async sendMessage(message: string): Promise<ChatbotResponse> {
    try {
      const response = await chatbotAPI.post("/message", {
        message,
        sessionId: this.sessionId,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to send message");
      }

      return response.data.data;
    } catch (error: any) {
      console.error("Send message error:", error);

      if (error.response?.status === 429) {
        throw new Error(`Rate limit exceeded. ${error.response.data.message}`);
      }

      throw new Error(
        error.response?.data?.message || "Failed to send message"
      );
    }
  }

  // Get FAQ categories
  async getCategories(): Promise<FAQCategory[]> {
    try {
      const response = await chatbotAPI.get("/categories");

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch categories");
      }

      return response.data.data;
    } catch (error: any) {
      console.error("Get categories error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }

  // Get all FAQs
  async getFAQs(): Promise<FAQ[]> {
    try {
      const response = await chatbotAPI.get("/faqs");

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch FAQs");
      }

      return response.data.data;
    } catch (error: any) {
      console.error("Get FAQs error:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch FAQs");
    }
  }

  // Get FAQs by category
  async getFAQsByCategory(categoryId: string): Promise<FAQ[]> {
    try {
      const response = await chatbotAPI.get(`/faqs/category/${categoryId}`);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch FAQs");
      }

      return response.data.data;
    } catch (error: any) {
      console.error("Get FAQs by category error:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch FAQs");
    }
  }

  // Mark FAQ as helpful
  async markFAQHelpful(faqId: string, helpful: boolean): Promise<void> {
    try {
      const response = await chatbotAPI.post(`/faq/${faqId}/helpful`, {
        helpful,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to record feedback");
      }
    } catch (error: any) {
      console.error("Mark FAQ helpful error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to record feedback"
      );
    }
  }

  // Get conversation history
  async getConversationHistory(): Promise<ChatbotMessage[]> {
    try {
      const response = await chatbotAPI.get(`/conversation/${this.sessionId}`);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch conversation"
        );
      }

      return response.data.data.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    } catch (error: any) {
      console.error("Get conversation history error:", error);
      // Don't throw error for conversation history - just return empty array
      return [];
    }
  }

  // Clear conversation
  async clearConversation(): Promise<void> {
    try {
      const response = await chatbotAPI.delete(
        `/conversation/${this.sessionId}`
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to clear conversation"
        );
      }

      // Create new session ID after clearing
      this.sessionId = this.getOrCreateSessionId();
    } catch (error: any) {
      console.error("Clear conversation error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to clear conversation"
      );
    }
  }

  // Check rate limit status
  async getRateLimitStatus(): Promise<RateLimitStatus> {
    try {
      const response = await chatbotAPI.get("/rate-limit-status");

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to check rate limit");
      }

      return response.data.data;
    } catch (error: any) {
      console.error("Get rate limit status error:", error);
      // Return default status if error
      return {
        hasLimit: false,
        message: "Unable to check rate limit status",
      };
    }
  }

  // Get current session ID
  getSessionId(): string {
    return this.sessionId;
  }

  // Reset session (creates new session ID)
  resetSession(): void {
    sessionStorage.removeItem("chatbot_session_id");
    this.sessionId = this.getOrCreateSessionId();
  }
}

export default new ChatbotService();
