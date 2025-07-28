import {
  IChatbotService,
  IChatbotResponse,
} from "../interface/IChatbotService";
import { FAQRepository } from "../../repositories/implementations/FAQRepository";
import { BotConversationRepository } from "../../repositories/implementations/BotConversationRepository";
import { BotRateLimitRepository } from "../../repositories/implementations/BotRateLimitRepository";
import { AIService } from "./AIService";

export class ChatbotService implements IChatbotService {
  private faqRepository: FAQRepository;
  private conversationRepository: BotConversationRepository;
  private rateLimitRepository: BotRateLimitRepository;
  private aiService: AIService;

  constructor() {
    this.faqRepository = new FAQRepository();
    this.conversationRepository = new BotConversationRepository();
    this.rateLimitRepository = new BotRateLimitRepository();
    this.aiService = new AIService();
  }

  async processMessage(
    message: string,
    sessionId: string,
    userType: "anonymous" | "mentee" | "mentor",
    userId?: string,
    conversationHistory: any[] = []
  ): Promise<IChatbotResponse> {
    try {
      // Step 1: Try FAQ matching first
      const faqResults = await this.faqRepository.searchFAQs(message, userType);

      if (faqResults.length > 0) {
        const bestMatch = faqResults[0];

        // Calculate confidence based on text similarity (simplified)
        const confidence = this.calculateFAQConfidence(message, bestMatch);

        if (confidence > 0.7) {
          // High confidence FAQ match
          await this.faqRepository.updateFAQAnalytics(
            bestMatch._id.toString(),
            "view"
          );

          // Save conversation
          await this.saveConversation(
            sessionId,
            message,
            bestMatch.answer,
            userType,
            userId,
            "faq",
            bestMatch._id.toString()
          );

          return {
            text: bestMatch.answer,
            source: "faq",
            confidence,
            faqId: bestMatch._id.toString(),
            suggestions: this.generateSuggestions(bestMatch, userType),
          };
        }
      }

      // Step 2: Use AI for complex queries
      try {
        const context = this.buildAIContext(userType, conversationHistory);
        const aiResponse = await this.aiService.generateResponse(
          message,
          context
        );

        // Save conversation
        await this.saveConversation(
          sessionId,
          message,
          aiResponse,
          userType,
          userId,
          "ai"
        );

        return {
          text: aiResponse,
          source: "ai",
          confidence: 0.8,
          suggestions: this.generateGenericSuggestions(userType),
        };
      } catch (aiError) {
        console.error("AI Service Error:", aiError);

        // Step 3: Fallback response
        const fallbackResponse = this.getFallbackResponse(userType);
        await this.saveConversation(
          sessionId,
          message,
          fallbackResponse,
          userType,
          userId,
          "fallback"
        );

        return {
          text: fallbackResponse,
          source: "fallback",
          confidence: 0.3,
          suggestions: this.generateGenericSuggestions(userType),
        };
      }
    } catch (error) {
      console.error("Chatbot Service Error:", error);

      const fallbackResponse = this.getFallbackResponse(userType);
      return {
        text: fallbackResponse,
        source: "fallback",
        confidence: 0.1,
      };
    }
  }

  private calculateFAQConfidence(query: string, faq: any): number {
    const queryWords = query.toLowerCase().split(" ");
    const faqWords = (faq.question + " " + faq.keywords.join(" "))
      .toLowerCase()
      .split(" ");

    const matches = queryWords.filter((word) => faqWords.includes(word));
    return matches.length / Math.max(queryWords.length, 1);
  }

  private buildAIContext(userType: string, history: any[]): any {
    const contextInfo = {
      anonymous:
        "You are helping a visitor explore our mentorship platform. Focus on general information, features, and encourage them to sign up.",
      mentee:
        "You are helping a mentee who is looking for guidance and mentorship. Focus on how to find mentors, book sessions, and get the most from mentorship.",
      mentor:
        "You are helping a mentor who wants to provide guidance. Focus on managing mentees, scheduling, and effective mentoring practices.",
    };

    return {
      userContext: contextInfo[userType as keyof typeof contextInfo],
      recentHistory: history.slice(-4), // Last 4 messages for context
      platformInfo: {
        pricing:
          "$50 for 1-on-1 sessions, $30 for group sessions, monthly packages from $150",
        features:
          "mentor matching, session booking, progress tracking, recordings",
        userTypes: "school students, college students, professionals",
      },
    };
  }

  private generateSuggestions(faq: any, userType: string): string[] {
    const suggestions = [
      "Tell me more about pricing",
      "How do I get started?",
      "What features do you offer?",
    ];

    if (userType === "mentee") {
      suggestions.push(
        "How do I find the right mentor?",
        "Can I book a trial session?"
      );
    } else if (userType === "mentor") {
      suggestions.push(
        "How do I manage my schedule?",
        "What tools do you provide?"
      );
    }

    return suggestions.slice(0, 3); // Return max 3 suggestions
  }

  private generateGenericSuggestions(userType: string): string[] {
    const base = [
      "Learn about our platform",
      "View pricing plans",
      "Contact support",
    ];

    if (userType === "anonymous") {
      return ["Sign up as mentee", "Become a mentor", ...base];
    } else if (userType === "mentee") {
      return ["Find mentors", "Book a session", ...base];
    } else {
      return ["Manage schedule", "View mentees", ...base];
    }
  }

  private getFallbackResponse(userType: string): string {
    const responses = {
      anonymous:
        "I'd be happy to help you learn about our mentorship platform! You can ask me about our features, pricing, or how to get started. Would you like to know more about finding mentors or our pricing plans?",
      mentee:
        "I'm here to help with your mentorship journey! You can ask me about finding mentors, booking sessions, or any questions about our platform. What would you like to know?",
      mentor:
        "I'm here to assist you with mentoring on our platform! Feel free to ask about managing your mentees, scheduling sessions, or any platform features. How can I help?",
    };

    return responses[userType as keyof typeof responses];
  }

  private async saveConversation(
    sessionId: string,
    userMessage: string,
    botResponse: string,
    userType: string,
    userId?: string,
    responseType: "faq" | "ai" | "fallback" = "fallback",
    faqId?: string
  ): Promise<void> {
    try {
      // Add user message
      await this.conversationRepository.addMessage(sessionId, {
        text: userMessage,
        sender: "user",
        timestamp: new Date(),
      });

      // Add bot response
      await this.conversationRepository.addMessage(sessionId, {
        text: botResponse,
        sender: "bot",
        responseType,
        faqId,
        timestamp: new Date(),
      });

      // Update conversation metadata if needed
      const conversation = await this.conversationRepository.findBySessionId(
        sessionId
      );
      if (!conversation) {
        await this.conversationRepository.createConversation({
          sessionId,
          userId,
          userType: userType as any,
          messages: [],
          totalQuestions: 0,
          resolved: false,
        });
      }
    } catch (error) {
      console.error("Error saving conversation:", error);
    }
  }

  async getFAQs(userType: "anonymous" | "mentee" | "mentor"): Promise<any[]> {
    return await this.faqRepository.findFAQsByUserType(userType);
  }

  async getFAQsByCategory(
    categoryId: string,
    userType: "anonymous" | "mentee" | "mentor"
  ): Promise<any[]> {
    return await this.faqRepository.findFAQsByCategory(categoryId, userType);
  }

  async getCategories(
    userType: "anonymous" | "mentee" | "mentor"
  ): Promise<any[]> {
    return await this.faqRepository.findActiveCategories(userType);
  }

  async markFAQHelpful(faqId: string, helpful: boolean): Promise<void> {
    const type = helpful ? "helpful" : "notHelpful";
    await this.faqRepository.updateFAQAnalytics(faqId, type);
  }

  async checkRateLimit(
    identifier: string
  ): Promise<{ allowed: boolean; remaining: number; resetTime: Date }> {
    const maxRequests = 10; // 10 requests per hour for anonymous users
    const windowHours = 1;

    return await this.rateLimitRepository.checkRateLimit(
      identifier,
      maxRequests,
      windowHours
    );
  }
}
