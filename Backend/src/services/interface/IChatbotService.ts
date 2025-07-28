export interface IChatbotResponse {
  text: string;
  source: "faq" | "ai" | "fallback";
  confidence: number;
  faqId?: string;
  suggestions?: string[];
}

export interface IChatbotService {
  processMessage(
    message: string,
    sessionId: string,
    userType: "anonymous" | "mentee" | "mentor",
    userId?: string,
    conversationHistory?: any[]
  ): Promise<IChatbotResponse>;

  getFAQs(userType: "anonymous" | "mentee" | "mentor"): Promise<any[]>;
  getFAQsByCategory(
    categoryId: string,
    userType: "anonymous" | "mentee" | "mentor"
  ): Promise<any[]>;
  getCategories(userType: "anonymous" | "mentee" | "mentor"): Promise<any[]>;
  markFAQHelpful(faqId: string, helpful: boolean): Promise<void>;
  checkRateLimit(
    identifier: string
  ): Promise<{ allowed: boolean; remaining: number; resetTime: Date }>;
}
