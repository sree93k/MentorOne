import { GoogleGenerativeAI } from "@google/generative-ai";
import { IAIService } from "../interface/IAIService";

export class AIService implements IAIService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    // ✅ FIXED: Updated model name from "gemini-pro" to "gemini-1.5-flash"
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateResponse(message: string, context: any): Promise<string> {
    try {
      const prompt = this.buildPrompt(message, context);
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      return this.validateAndCleanResponse(response);
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("AI service temporarily unavailable");
    }
  }

  async detectIntent(
    message: string
  ): Promise<{ intent: string; confidence: number }> {
    // Simple intent detection - you can enhance this
    const intents = {
      greeting: ["hello", "hi", "hey", "good morning", "good afternoon"],
      pricing: [
        "price",
        "cost",
        "fee",
        "payment",
        "money",
        "cheap",
        "expensive",
      ],
      booking: ["book", "schedule", "appointment", "session", "meeting"],
      mentor_search: [
        "find mentor",
        "search mentor",
        "mentor",
        "teacher",
        "guide",
      ],
      platform_info: [
        "how it works",
        "features",
        "about",
        "platform",
        "service",
      ],
    };

    const lowercaseMessage = message.toLowerCase();
    let bestMatch = { intent: "general", confidence: 0 };

    for (const [intent, keywords] of Object.entries(intents)) {
      const matches = keywords.filter((keyword) =>
        lowercaseMessage.includes(keyword)
      );
      const confidence = matches.length / keywords.length;

      if (confidence > bestMatch.confidence) {
        bestMatch = { intent, confidence };
      }
    }

    return bestMatch;
  }

  private buildPrompt(message: string, context: any): string {
    return `
    You are an AI assistant for a mentorship platform.
    
    Context: ${context.userContext}
    
    Platform Information:
    - Pricing: ${context.platformInfo.pricing}
    - Features: ${context.platformInfo.features}
    - User Types: ${context.platformInfo.userTypes}
    
    Recent conversation context:
    ${context.recentHistory
      .map((msg: any) => `${msg.sender}: ${msg.text}`)
      .join("\n")}
    
    User question: "${message}"
    
    Provide a helpful, concise response (under 150 words) as a mentorship platform assistant.
    Be encouraging and guide users toward relevant platform features.
    `;
  }

  private validateAndCleanResponse(response: string): string {
    // Clean up response
    let cleaned = response.trim();

    // Ensure it's not too long
    if (cleaned.length > 400) {
      cleaned = cleaned.substring(0, 397) + "...";
    }

    // Remove any markdown formatting
    cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, "$1");
    cleaned = cleaned.replace(/\*(.*?)\*/g, "$1");

    return cleaned;
  }
}
