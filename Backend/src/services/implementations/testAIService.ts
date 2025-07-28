import { GoogleGenerativeAI } from "@google/generative-ai";

export class TestAIService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("🤖 AI Service - API Key exists:", !!apiKey);

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not found in environment variables");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async testConnection(): Promise<string> {
    try {
      console.log("🧪 Testing Gemini AI connection...");

      const result = await this.model.generateContent(
        "Say 'AI integration working' if you can read this."
      );
      const response = result.response.text();

      console.log("✅ AI Response received:", response);
      return response;
    } catch (error: any) {
      console.error("❌ AI Connection failed:", error);
      throw error;
    }
  }

  async generateSmartResponse(
    message: string,
    userType: string
  ): Promise<string> {
    try {
      const prompt = `
      You are an AI assistant for a mentorship platform. 
      User type: ${userType}
      User question: "${message}"
      
      Platform context:
      - 1-on-1 sessions ($50), group sessions ($30), monthly packages ($150+)
      - Features: video calls, progress tracking, session recordings
      - Users: school students, college students, professionals
      
      Provide a helpful, specific response (max 150 words) as a mentorship platform assistant.
      Be encouraging and guide users toward relevant platform features.
      `;

      console.log("🤖 Sending to Gemini AI:", message.substring(0, 50) + "...");

      const result = await this.model.generateContent(prompt);
      const response = result.response.text().trim();

      console.log("✅ AI Response length:", response.length);

      // Clean up response
      if (response.length > 400) {
        return response.substring(0, 397) + "...";
      }

      return response;
    } catch (error: any) {
      console.error("❌ AI Generation failed:", error);
      throw error;
    }
  }
}
