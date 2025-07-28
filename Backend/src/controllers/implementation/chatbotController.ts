// // Backend/src/controllers/implementation/chatbotController.ts
// import { Request, Response } from "express";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { FAQRepository } from "../../repositories/implementations/FAQRepository";
// import { BotConversationRepository } from "../../repositories/implementations/BotConversationRepository";
// import { BotRateLimitRepository } from "../../repositories/implementations/BotRateLimitRepository";

// // ✅ Helper function to get user from request (avoids TypeScript conflicts)
// function getUser(
//   req: Request
// ): { id: string; role: string[]; rawToken?: string } | undefined {
//   return (req as any).user;
// }

// class AIService {
//   private genAI: GoogleGenerativeAI | null = null;
//   private model: any = null;
//   private isInitialized: boolean = false;
//   private readonly MAX_WORDS = 50; // ✅ Set maximum words limit
//   private readonly MAX_CHARS = 300; // ✅ Set maximum character limit

//   constructor() {
//     this.initializeAI();
//   }

//   private initializeAI() {
//     try {
//       const apiKey = process.env.GEMINI_API_KEY;

//       console.log("🤖 AIService: Initializing...");
//       console.log("🔑 AIService: API Key exists:", !!apiKey);

//       if (!apiKey) {
//         console.error("❌ AIService: GEMINI_API_KEY not found in environment");
//         this.isInitialized = false;
//         return;
//       }

//       this.genAI = new GoogleGenerativeAI(apiKey);
//       this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//       this.isInitialized = true;

//       console.log(
//         "✅ AIService: Initialized successfully with word limit:",
//         this.MAX_WORDS
//       );
//     } catch (error: any) {
//       console.error("❌ AIService: Initialization failed:", error.message);
//       this.isInitialized = false;
//     }
//   }

//   async testConnection(): Promise<string> {
//     try {
//       if (!this.isInitialized || !this.model) {
//         throw new Error("AI service not initialized");
//       }

//       console.log("🧪 AIService: Testing connection...");

//       const result = await this.model.generateContent(
//         "Respond with exactly: 'AI CONNECTION WORKING'"
//       );
//       const response = result.response.text().trim();

//       console.log("✅ AIService: Test response:", response);

//       return response;
//     } catch (error: any) {
//       console.error("❌ AIService: Connection test failed:", error.message);
//       throw error;
//     }
//   }

//   async generateResponse(
//     message: string,
//     userType: "anonymous" | "mentee" | "mentor"
//   ): Promise<string> {
//     try {
//       if (!this.isInitialized || !this.model) {
//         throw new Error("AI service not initialized");
//       }

//       // ✅ STEP 1: Check if question is mentorship-related
//       if (!this.isMentorshipRelated(message)) {
//         console.log(
//           "🚫 AIService: Question not mentorship-related, returning redirect"
//         );
//         return this.getNonMentorshipResponse(userType);
//       }

//       console.log(
//         "🤖 AIService: Generating response for:",
//         message.substring(0, 50) + "..."
//       );
//       console.log("🤖 AIService: User type:", userType);

//       const prompt = this.buildPrompt(message, userType);

//       console.log("🤖 AIService: Sending request to Gemini...");
//       const result = await this.model.generateContent(prompt);
//       const response = result.response.text().trim();

//       console.log("✅ AIService: Response generated successfully");
//       console.log("✅ AIService: Original response length:", response.length);

//       const cleanedResponse = this.cleanAndLimitResponse(response);

//       console.log(
//         "✅ AIService: Final response length:",
//         cleanedResponse.length
//       );
//       console.log(
//         "✅ AIService: Word count:",
//         this.countWords(cleanedResponse)
//       );

//       return cleanedResponse;
//     } catch (error: any) {
//       console.error("❌ AIService: Generation failed:", error.message);
//       throw error;
//     }
//   }

//   // ✅ Check if question is mentorship-related
//   private isMentorshipRelated(message: string): boolean {
//     const mentorshipKeywords = [
//       // Core mentorship terms
//       "mentor",
//       "mentee",
//       "mentoring",
//       "guidance",
//       "advice",
//       "coach",
//       "coaching",

//       // Career-related
//       "career",
//       "job",
//       "work",
//       "professional",
//       "skill",
//       "development",
//       "growth",
//       "interview",
//       "resume",
//       "cv",
//       "networking",
//       "promotion",
//       "salary",

//       // Learning-related
//       "learn",
//       "learning",
//       "study",
//       "education",
//       "training",
//       "course",
//       "practice",
//       "improve",
//       "help",
//       "support",
//       "guide",
//       "teach",
//       "experience",

//       // Platform-related
//       "session",
//       "booking",
//       "schedule",
//       "meeting",
//       "platform",
//       "price",
//       "pricing",
//       "cost",
//       "payment",
//       "plan",
//       "service",
//       "feature",

//       // Goals and success
//       "goal",
//       "goals",
//       "success",
//       "achievement",
//       "progress",
//       "challenge",
//       "problem",
//       "solution",
//       "strategy",
//       "plan",
//       "future",
//       "direction",
//     ];

//     const messageWords = message.toLowerCase().split(/\s+/);
//     const hasKeyword = messageWords.some((word) =>
//       mentorshipKeywords.some(
//         (keyword) => word.includes(keyword) || keyword.includes(word)
//       )
//     );

//     // Also check for greeting/platform questions
//     const greetings = [
//       "hello",
//       "hi",
//       "hey",
//       "help",
//       "what",
//       "how",
//       "can",
//       "about",
//     ];
//     const hasGreeting = messageWords.some((word) => greetings.includes(word));

//     console.log("🔍 AIService: Mentorship check:", {
//       message: message.substring(0, 50),
//       hasKeyword,
//       hasGreeting,
//       isRelated: hasKeyword || hasGreeting,
//     });

//     return hasKeyword || hasGreeting;
//   }

//   // ✅ Response for non-mentorship questions
//   private getNonMentorshipResponse(userType: string): string {
//     const responses = {
//       anonymous:
//         "I'm specifically designed to help with mentorship and career guidance questions. Feel free to ask me about finding mentors, career development, or our platform features!",
//       mentee:
//         "I'm here to help with your mentorship journey! Please ask me questions about finding mentors, career development, skill building, or how to make the most of our platform.",
//       mentor:
//         "I'm focused on helping with mentoring and career guidance topics. Feel free to ask about managing mentees, effective mentoring strategies, or platform features!",
//     };

//     return responses[userType] || responses.anonymous;
//   }

//   // ✅ Count words in text

//   // ✅ Clean and limit response
//   private cleanAndLimitResponse(response: string): string {
//     // Remove markdown formatting
//     let cleaned = response.replace(/\*\*(.*?)\*\*/g, "$1");
//     cleaned = cleaned.replace(/\*(.*?)\*/g, "$1");
//     cleaned = cleaned.replace(/#{1,6}\s/g, ""); // Remove headers
//     cleaned = cleaned.replace(/`([^`]*)`/g, "$1"); // Remove code formatting

//     // Remove extra whitespace
//     cleaned = cleaned.replace(/\s+/g, " ").trim();

//     // ✅ WORD LIMIT: Limit by word count first
//     const words = cleaned.split(/\s+/);
//     if (words.length > this.MAX_WORDS) {
//       cleaned = words.slice(0, this.MAX_WORDS).join(" ") + "...";
//       console.log(`📝 AIService: Truncated to ${this.MAX_WORDS} words`);
//     }

//     // ✅ CHARACTER LIMIT: Secondary limit by characters
//     if (cleaned.length > this.MAX_CHARS) {
//       cleaned = cleaned.substring(0, this.MAX_CHARS - 3) + "...";
//       console.log(`📝 AIService: Truncated to ${this.MAX_CHARS} characters`);
//     }

//     // Ensure we don't cut off mid-sentence
//     if (cleaned.endsWith("...")) {
//       const lastSentenceEnd = cleaned.lastIndexOf(".", cleaned.length - 4);
//       const lastQuestionEnd = cleaned.lastIndexOf("?", cleaned.length - 4);
//       const lastExclamationEnd = cleaned.lastIndexOf("!", cleaned.length - 4);

//       const lastEnd = Math.max(
//         lastSentenceEnd,
//         lastQuestionEnd,
//         lastExclamationEnd
//       );

//       if (lastEnd > cleaned.length * 0.7) {
//         // Only if we're not cutting too much
//         cleaned = cleaned.substring(0, lastEnd + 1) + "..";
//       }
//     }

//     return cleaned;
//   }

//   private buildPrompt(message: string, userType: string): string {
//     const contextInfo = {
//       anonymous:
//         "You are helping a visitor explore our mentorship platform. Focus on general information, features, and encourage them to sign up.",
//       mentee:
//         "You are helping a mentee who is looking for guidance and mentorship. Focus on how to find mentors, book sessions, and get the most from mentorship.",
//       mentor:
//         "You are helping a mentor who wants to provide guidance. Focus on managing mentees, scheduling, and effective mentoring practices.",
//     };

//     return `
// You are an AI assistant for a mentorship platform focused ONLY on mentorship, career guidance, and our platform features.

// User Context: ${contextInfo[userType as keyof typeof contextInfo]}

// Platform Information:
// - Pricing: $50 for 1-on-1 sessions, $30 for group sessions, monthly packages from $150
// - Features: mentor matching, session booking, progress tracking, video calls, session recordings
// - User Types: school students, college students, professionals
// - Platform Focus: Career development, skill building, professional growth

// IMPORTANT RESTRICTIONS:
// - ONLY answer questions related to mentorship, career guidance, professional development, or our platform
// - Keep responses to maximum 40-50 words
// - Be concise, helpful, and encouraging
// - Focus on actionable advice
// - If asked about non-mentorship topics, politely redirect to mentorship-related questions

// User Question: "${message}"

// Provide a brief, helpful response (maximum 50 words) as a mentorship platform assistant.
// `;
//   }

//   isReady(): boolean {
//     return this.isInitialized;
//   }

//   // ✅ Public method to get current limits (for debugging)
//   getLimits(): { maxWords: number; maxChars: number } {
//     return {
//       maxWords: this.MAX_WORDS,
//       maxChars: this.MAX_CHARS,
//     };
//   }
// }

// export class ChatbotController {
//   private aiService: AIService;
//   private faqRepository: FAQRepository;
//   private conversationRepository: BotConversationRepository;
//   private rateLimitRepository: BotRateLimitRepository;

//   constructor() {
//     this.aiService = new AIService();
//     this.faqRepository = new FAQRepository();
//     this.conversationRepository = new BotConversationRepository();
//     this.rateLimitRepository = new BotRateLimitRepository();
//     console.log(
//       "🤖 ChatbotController: Initialized with AI service and repositories"
//     );
//   }

//   // 🧪 Test AI Connection
//   async testAI(req: Request, res: Response): Promise<void> {
//     try {
//       console.log("🧪 ChatbotController: Testing AI connection...");

//       const hasApiKey = !!process.env.GEMINI_API_KEY;
//       console.log("🔑 API Key exists:", hasApiKey);

//       if (!hasApiKey) {
//         res.status(500).json({
//           success: false,
//           message: "GEMINI_API_KEY not configured",
//           details: "Add GEMINI_API_KEY to your .env file",
//         });
//         return;
//       }

//       const testResponse = await this.aiService.testConnection();
//       const limits = this.aiService.getLimits();

//       res.status(200).json({
//         success: true,
//         message: "AI integration working!",
//         data: {
//           aiResponse: testResponse,
//           aiReady: this.aiService.isReady(),
//           apiKeyConfigured: hasApiKey,
//           modelUsed: "gemini-1.5-flash",
//           limits: limits, // ✅ Include word/character limits
//           timestamp: new Date(),
//         },
//       });
//     } catch (error: any) {
//       console.error("🧪 ChatbotController: AI test error:", error);
//       res.status(500).json({
//         success: false,
//         message: "AI integration failed",
//         error: error.message,
//         details: {
//           apiKeyConfigured: !!process.env.GEMINI_API_KEY,
//           errorType: error.constructor.name,
//           modelAttempted: "gemini-1.5-flash",
//         },
//       });
//     }
//   }

//   async sendMessage(req: Request, res: Response): Promise<void> {
//     try {
//       const { message, sessionId } = req.body;
//       const user = getUser(req);
//       const userId = user?.id;
//       const userRoles = user?.role || [];

//       console.log("💬 ChatbotController: Processing message:", {
//         userId: userId || "anonymous",
//         userRoles,
//         messagePreview: message?.substring(0, 50) + "...",
//         sessionId,
//         timestamp: new Date().toISOString(),
//       });

//       // Validation
//       if (!message || !sessionId) {
//         res.status(400).json({
//           success: false,
//           message: "Message and sessionId are required",
//         });
//         return;
//       }

//       // ✅ CONTENT FILTER: Check message appropriateness
//       if (!this.isAppropriateMessage(message)) {
//         const redirectResponse =
//           "I'm designed to help with mentorship and career guidance. Please ask me about finding mentors, career development, or our platform features!";

//         res.status(200).json({
//           success: true,
//           data: {
//             response: redirectResponse,
//             source: "content_filter",
//             confidence: 1.0,
//             userType: "anonymous",
//             timestamp: new Date(),
//             suggestions: [
//               "How do I find a mentor?",
//               "Tell me about pricing",
//               "What features do you offer?",
//             ],
//           },
//         });
//         return;
//       }

//       // Determine user type
//       let userType: "anonymous" | "mentee" | "mentor" = "anonymous";
//       if (userId && userRoles.length > 0) {
//         if (userRoles.includes("mentor")) {
//           userType = "mentor";
//         } else if (userRoles.includes("mentee")) {
//           userType = "mentee";
//         }
//       }

//       console.log("👤 ChatbotController: User type determined:", userType);

//       // Check rate limit for anonymous users
//       if (!userId) {
//         const identifier = req.ip || "unknown";
//         const rateLimitCheck = await this.rateLimitRepository.checkRateLimit(
//           identifier,
//           10, // 10 requests per hour
//           1 // 1 hour window
//         );

//         if (!rateLimitCheck.allowed) {
//           res.status(429).json({
//             success: false,
//             message: "Rate limit exceeded. Please try again later.",
//             data: {
//               remaining: rateLimitCheck.remaining,
//               resetTime: rateLimitCheck.resetTime,
//             },
//           });
//           return;
//         }
//       }

//       let botResponse = "";
//       let responseSource = "";
//       let confidence = 0.8;
//       let faqId: string | undefined;
//       const lowerMessage = message.toLowerCase();

//       // 🎯 STRATEGY 1: Enhanced FAQ search with better matching
//       try {
//         console.log(
//           "🔍 ChatbotController: Searching FAQ database for:",
//           message
//         );

//         const allFAQs = await this.faqRepository.findFAQsByUserType(userType);
//         console.log(
//           "📚 ChatbotController: Found",
//           allFAQs.length,
//           "FAQs for userType:",
//           userType
//         );

//         if (allFAQs.length > 0) {
//           let bestMatch = null;
//           let bestScore = 0;

//           for (const faq of allFAQs) {
//             const score = this.calculateFAQScore(message, faq);

//             if (score > bestScore) {
//               bestScore = score;
//               bestMatch = faq;
//             }
//           }

//           console.log("🏆 Best FAQ match score:", bestScore);

//           // Lower threshold for better FAQ matching
//           if (bestMatch && bestScore > 0.4) {
//             console.log(
//               "✅ ChatbotController: Found FAQ match with score:",
//               bestScore
//             );

//             await this.faqRepository.updateFAQAnalytics(
//               bestMatch._id.toString(),
//               "view"
//             );

//             botResponse = bestMatch.answer;
//             responseSource = "faq";
//             confidence = bestScore;
//             faqId = bestMatch._id.toString();
//           }
//         }
//       } catch (faqError) {
//         console.error("❌ ChatbotController: FAQ search failed:", faqError);
//       }

//       // 🎯 STRATEGY 2: Try keyword matching for simple queries
//       if (!botResponse && this.isSimpleQuery(lowerMessage)) {
//         console.log("⚡ ChatbotController: Using keyword matching");

//         const keywordResponse = this.getKeywordResponse(lowerMessage, userType);
//         if (keywordResponse) {
//           botResponse = keywordResponse;
//           responseSource = "keyword_match";
//           confidence = 0.9;
//         }
//       }

//       // 🎯 STRATEGY 3: Use AI for complex queries
//       if (!botResponse) {
//         console.log("🤖 ChatbotController: Using AI for complex query...");

//         try {
//           if (!this.aiService.isReady()) {
//             throw new Error("AI service not ready");
//           }

//           botResponse = await this.aiService.generateResponse(
//             message,
//             userType
//           );
//           responseSource = "ai_powered";
//           confidence = 0.95;

//           console.log(
//             "✅ ChatbotController: AI response generated successfully"
//           );
//           console.log(
//             "📝 Final response word count:",
//             this.countWords(botResponse)
//           );
//         } catch (aiError: any) {
//           console.error(
//             "❌ ChatbotController: AI failed, using fallback:",
//             aiError.message
//           );

//           botResponse = this.getFallbackResponse(userType);
//           responseSource = "fallback";
//           confidence = 0.6;
//         }
//       }

//       // 💾 Save conversation to database
//       try {
//         await this.saveConversation(
//           sessionId,
//           message,
//           botResponse,
//           userType,
//           userId,
//           responseSource,
//           faqId
//         );
//       } catch (saveError) {
//         console.error(
//           "❌ ChatbotController: Failed to save conversation:",
//           saveError
//         );
//       }

//       // Log final response
//       console.log("📤 ChatbotController: Sending response:", {
//         source: responseSource,
//         confidence,
//         responseLength: botResponse.length,
//         wordCount: this.countWords(botResponse),
//         userType,
//         faqId: faqId || null,
//       });

//       res.status(200).json({
//         success: true,
//         data: {
//           response: botResponse,
//           source: responseSource,
//           confidence,
//           userType,
//           timestamp: new Date(),
//           suggestions: this.getSuggestions(userType, responseSource),
//           faqId,
//           wordCount: this.countWords(botResponse), // ✅ Include word count in response
//         },
//       });
//     } catch (error: any) {
//       console.error("❌ ChatbotController: Unexpected error:", error);
//       res.status(500).json({
//         success: false,
//         message: "I'm having trouble right now. Please try again later.",
//         error: error.message,
//       });
//     }
//   }

//   //   // ✅ Content appropriateness filter
//   //   private isAppropriateMessage(message: string): boolean {
//   //     const inappropriatePatterns = [
//   //       // Completely unrelated topics
//   //       /weather|climate|temperature|rain|snow/i,
//   //       /sports|football|basketball|soccer|cricket/i,
//   //       /politics|government|election|president/i,
//   //       /cooking|recipe|food|restaurant/i,
//   //       /movie|film|tv show|entertainment/i,
//   //       /shopping|buy|sell|product/i,
//   //       /dating|relationship|love|romance/i,
//   //       /medical|health|doctor|hospital/i,
//   //       /legal|law|lawyer|court/i,

//   //       // Inappropriate content
//   //       /offensive|inappropriate|spam/i,

//   //       // Random/testing messages
//   //       /^test$/i,
//   //       /^hello$/i, // Simple hello is OK, but we want more context
//   //       /random|nonsense|gibberish/i,
//   //     ];

//   //     // Check for inappropriate patterns
//   //     const hasInappropriate = inappropriatePatterns.some((pattern) =>
//   //       pattern.test(message)
//   //     );

//   //     // Check if message is too short or random
//   //     const words = message.trim().split(/\s+/);
//   //     const isTooShort =
//   //       words.length < 2 &&
//   //       !["hello", "hi", "help", "pricing", "price"].includes(
//   //         message.toLowerCase()
//   //       );

//   //     // Check for mentorship-related keywords
//   //     const mentorshipKeywords = [
//   //       "mentor",
//   //       "mentee",
//   //       "career",
//   //       "job",
//   //       "work",
//   //       "skill",
//   //       "learn",
//   //       "help",
//   //       "guidance",
//   //       "advice",
//   //       "coaching",
//   //       "development",
//   //       "growth",
//   //       "session",
//   //       "booking",
//   //       "platform",
//   //       "price",
//   //       "pricing",
//   //       "feature",
//   //       "goal",
//   //       "success",
//   //     ];

//   //     const hasMentorshipContext = mentorshipKeywords.some((keyword) =>
//   //       message.toLowerCase().includes(keyword)
//   //     );

//   //     console.log("🔍 Content filter check:", {
//   //       hasInappropriate,
//   //       isTooShort,
//   //       hasMentorshipContext,
//   //       isAppropriate:
//   //         !hasInappropriate &&
//   //         !isTooShort &&
//   //         (hasMentorshipContext || words.length >= 3),
//   //     });

//   //     // Allow if: not inappropriate AND (has mentorship context OR is substantial question)
//   //     return (
//   //       !hasInappropriate &&
//   //       !isTooShort &&
//   //       (hasMentorshipContext || words.length >= 3)
//   //     );
//   //   }
//   private isAppropriateMessage(message: string): boolean {
//     const inappropriatePatterns = [
//       // Completely unrelated topics
//       /weather|climate|temperature|rain|snow/i,
//       /sports|football|basketball|soccer|cricket/i,
//       /politics|government|election|president/i,
//       /cooking|recipe|food|restaurant/i,
//       /movie|film|tv show|entertainment/i,
//       /shopping|buy|sell|product/i,
//       /dating|relationship|love|romance/i,
//       /medical|health|doctor|hospital/i,
//       /legal|law|lawyer|court/i,

//       // Inappropriate content
//       /offensive|inappropriate|spam/i,

//       // Random/testing messages
//       /^test$/i,
//       /random|nonsense|gibberish/i,
//     ];

//     // Check for inappropriate patterns
//     const hasInappropriate = inappropriatePatterns.some((pattern) =>
//       pattern.test(message)
//     );

//     // ✅ FIXED: More comprehensive mentorship keywords
//     const mentorshipKeywords = [
//       // Core mentorship terms
//       "mentor",
//       "mentee",
//       "mentoring",
//       "guidance",
//       "advice",
//       "coach",
//       "coaching",

//       // Career-related
//       "career",
//       "job",
//       "work",
//       "professional",
//       "skill",
//       "development",
//       "growth",
//       "interview",
//       "resume",
//       "cv",
//       "networking",
//       "promotion",
//       "salary",

//       // Learning-related
//       "learn",
//       "learning",
//       "study",
//       "education",
//       "training",
//       "course",
//       "practice",
//       "improve",
//       "help",
//       "support",
//       "guide",
//       "teach",
//       "experience",

//       // Platform-related
//       "session",
//       "booking",
//       "schedule",
//       "meeting",
//       "platform",
//       "price",
//       "pricing",
//       "cost",
//       "payment",
//       "plan",
//       "service",
//       "feature",

//       // Goals and success
//       "goal",
//       "goals",
//       "success",
//       "achievement",
//       "progress",
//       "challenge",
//       "problem",
//       "solution",
//       "strategy",
//       "plan",
//       "future",
//       "direction",

//       // Relationship and communication (✅ ADDED)
//       "relationship",
//       "communication",
//       "feedback",
//       "styles",
//       "approach",
//       "handle",
//       "manage",
//       "effective",
//       "successful",
//       "best",
//       "measure",
//       "evaluate",
//     ];

//     // ✅ IMPROVED: Check for mentorship context more intelligently
//     const messageWords = message.toLowerCase().split(/\s+/);
//     const hasMentorshipContext = mentorshipKeywords.some((keyword) =>
//       messageWords.some(
//         (word) =>
//           word.includes(keyword) ||
//           keyword.includes(word) ||
//           // Check partial matches for compound words
//           (word.length > 3 &&
//             keyword.length > 3 &&
//             (word.includes(keyword.substring(0, 4)) ||
//               keyword.includes(word.substring(0, 4))))
//       )
//     );

//     // ✅ IMPROVED: Better greeting detection
//     const greetingWords = [
//       "hello",
//       "hi",
//       "hey",
//       "help",
//       "what",
//       "how",
//       "can",
//       "about",
//       "tell",
//       "explain",
//     ];
//     const hasGreeting = messageWords.some((word) =>
//       greetingWords.includes(word)
//     );

//     // ✅ FIXED: Less restrictive length check
//     const words = message.trim().split(/\s+/);
//     const isTooShort =
//       words.length < 2 &&
//       ![
//         "hello",
//         "hi",
//         "help",
//         "pricing",
//         "price",
//         "mentor",
//         "mentoring",
//       ].includes(message.toLowerCase());

//     // ✅ IMPROVED: Question indicators
//     const questionIndicators = [
//       "what",
//       "how",
//       "why",
//       "when",
//       "where",
//       "which",
//       "can",
//       "should",
//       "best",
//       "approach",
//     ];
//     const hasQuestionIndicator = messageWords.some((word) =>
//       questionIndicators.includes(word)
//     );

//     console.log("🔍 Content filter check:", {
//       message: message.substring(0, 50) + "...",
//       hasInappropriate,
//       isTooShort,
//       hasMentorshipContext,
//       hasGreeting,
//       hasQuestionIndicator,
//       wordCount: words.length,
//       isAppropriate:
//         !hasInappropriate &&
//         !isTooShort &&
//         (hasMentorshipContext ||
//           hasGreeting ||
//           hasQuestionIndicator ||
//           words.length >= 5),
//     });

//     // ✅ FIXED: More lenient approval logic
//     // Allow if:
//     // 1. Not inappropriate AND
//     // 2. Not too short AND
//     // 3. (Has mentorship context OR has greeting OR has question indicators OR is substantial)
//     return (
//       !hasInappropriate &&
//       !isTooShort &&
//       (hasMentorshipContext ||
//         hasGreeting ||
//         hasQuestionIndicator ||
//         words.length >= 5)
//     );
//   }
//   // ✅ ADD THIS METHOD HERE
//   private countWords(text: string): number {
//     return text
//       .trim()
//       .split(/\s+/)
//       .filter((word) => word.length > 0).length;
//   }
//   private calculateFAQScore(query: string, faq: any): number {
//     const queryWords = query
//       .toLowerCase()
//       .split(/\s+/)
//       .filter((word) => word.length > 2);
//     const question = faq.question.toLowerCase();
//     const keywords = faq.keywords.map((k: string) => k.toLowerCase());
//     const answer = faq.answer.toLowerCase();

//     let score = 0;
//     let matches = 0;

//     for (const word of queryWords) {
//       // Exact question match (highest weight)
//       if (question.includes(word)) {
//         score += 3;
//         matches++;
//       }
//       // Keyword match (medium weight)
//       else if (keywords.some((keyword) => keyword.includes(word))) {
//         score += 2;
//         matches++;
//       }
//       // Answer match (lowest weight)
//       else if (answer.includes(word)) {
//         score += 1;
//         matches++;
//       }
//     }

//     // Normalize score by query length
//     const normalizedScore =
//       queryWords.length > 0 ? matches / queryWords.length : 0;

//     console.log(
//       `FAQ Score Debug - Query: "${query}" vs FAQ: "${faq.question}"`
//     );
//     console.log(`- Query words: [${queryWords.join(", ")}]`);
//     console.log(`- Keywords: [${keywords.join(", ")}]`);
//     console.log(
//       `- Raw score: ${score}, Matches: ${matches}, Normalized: ${normalizedScore}`
//     );

//     return normalizedScore;
//   }
//   // 💾 Save conversation to database
//   private async saveConversation(
//     sessionId: string,
//     userMessage: string,
//     botResponse: string,
//     userType: string,
//     userId?: string,
//     responseType: string = "fallback",
//     faqId?: string
//   ): Promise<void> {
//     try {
//       // Check if conversation exists
//       let conversation = await this.conversationRepository.findBySessionId(
//         sessionId
//       );

//       if (!conversation) {
//         // Create new conversation
//         conversation = await this.conversationRepository.createConversation({
//           sessionId,
//           userId: userId ? (userId as any) : undefined,
//           userType: userType as any,
//           messages: [],
//           totalQuestions: 0,
//           resolved: false,
//         });
//       }

//       // Add user message
//       await this.conversationRepository.addMessage(sessionId, {
//         text: userMessage,
//         sender: "user",
//         timestamp: new Date(),
//       });

//       // Add bot response
//       await this.conversationRepository.addMessage(sessionId, {
//         text: botResponse,
//         sender: "bot",
//         responseType: responseType as any,
//         faqId: faqId ? (faqId as any) : undefined,
//         timestamp: new Date(),
//       });

//       console.log("💾 ChatbotController: Conversation saved successfully");
//     } catch (error) {
//       console.error("❌ ChatbotController: Error saving conversation:", error);
//       throw error;
//     }
//   }

//   private isSimpleQuery(message: string): boolean {
//     const simpleKeywords = [
//       "hello",
//       "hi",
//       "hey",
//       "price",
//       "cost",
//       "pricing",
//       "help",
//       "support",
//     ];

//     return (
//       simpleKeywords.some((keyword) => message.includes(keyword)) &&
//       message.length < 50
//     );
//   }

//   private getKeywordResponse(message: string, userType: string): string | null {
//     if (
//       message.includes("price") ||
//       message.includes("cost") ||
//       message.includes("pricing")
//     ) {
//       return `Great question! Our ${
//         userType === "mentor" ? "mentor" : "mentee"
//       } pricing is flexible: $50/session for 1-on-1 mentoring, $30/session for group sessions, and monthly packages starting at $150. All plans include session recordings and follow-up resources.`;
//     }

//     if (
//       message.includes("hello") ||
//       message.includes("hi") ||
//       message.includes("hey")
//     ) {
//       return `Hello! 👋 I'm your AI mentor assistant. I can help you with ${
//         userType === "anonymous" ? "learning about our platform, " : ""
//       }finding mentors, booking sessions, pricing information, and answering any questions about our mentorship platform. What would you like to know?`;
//     }

//     if (message.includes("help") || message.includes("support")) {
//       return `I'm here to help! I can assist you with finding mentors, booking sessions, understanding our pricing, and answering questions about our mentorship platform. What specific information are you looking for?`;
//     }

//     return null;
//   }

//   private getFallbackResponse(userType: string): string {
//     return `I'd be happy to help you as ${
//       userType === "anonymous" ? "a visitor" : `a ${userType}`
//     }! You can ask me about finding mentors, booking sessions, pricing, or any other questions about our mentorship platform. What specifically would you like to know?`;
//   }

//   private getSuggestions(userType: string, source: string): string[] {
//     if (userType === "anonymous") {
//       return [
//         "Tell me about pricing",
//         "How do I sign up?",
//         "What is mentorship?",
//       ];
//     } else if (userType === "mentee") {
//       return ["Find a mentor", "Book a session", "How does mentoring work?"];
//     } else {
//       return [
//         "Manage my schedule",
//         "View my mentees",
//         "Mentoring best practices",
//       ];
//     }
//   }

//   // 📁 Get FAQ categories from database
//   async getCategories(req: Request, res: Response): Promise<void> {
//     try {
//       const user = getUser(req);
//       const userType = this.getUserType(user);

//       console.log(
//         "📁 ChatbotController: Fetching categories for userType:",
//         userType
//       );
//       const categories = await this.faqRepository.findActiveCategories(
//         userType
//       );

//       res.status(200).json({ success: true, data: categories });
//     } catch (error: any) {
//       console.error("❌ ChatbotController: Failed to fetch categories:", error);
//       res
//         .status(500)
//         .json({ success: false, message: "Failed to fetch categories" });
//     }
//   }

//   // 📋 Get all FAQs from database
//   async getAllFAQs(req: Request, res: Response): Promise<void> {
//     try {
//       const user = getUser(req);
//       const userType = this.getUserType(user);

//       console.log(
//         "📋 ChatbotController: Fetching FAQs for userType:",
//         userType
//       );
//       const faqs = await this.faqRepository.findFAQsByUserType(userType);

//       res.status(200).json({ success: true, data: faqs });
//     } catch (error: any) {
//       console.error("❌ ChatbotController: Failed to fetch FAQs:", error);
//       res.status(500).json({ success: false, message: "Failed to fetch FAQs" });
//     }
//   }

//   // 📂 Get FAQs by category from database
//   async getFAQsByCategory(req: Request, res: Response): Promise<void> {
//     try {
//       const { categoryId } = req.params;
//       const user = getUser(req);
//       const userType = this.getUserType(user);

//       console.log(
//         "📂 ChatbotController: Fetching FAQs for category:",
//         categoryId,
//         "userType:",
//         userType
//       );
//       const faqs = await this.faqRepository.findFAQsByCategory(
//         categoryId,
//         userType
//       );

//       res.status(200).json({ success: true, data: faqs });
//     } catch (error: any) {
//       console.error(
//         "❌ ChatbotController: Failed to fetch FAQs by category:",
//         error
//       );
//       res.status(500).json({ success: false, message: "Failed to fetch FAQs" });
//     }
//   }

//   // 👍 Mark FAQ as helpful
//   async markFAQHelpful(req: Request, res: Response): Promise<void> {
//     try {
//       const { faqId } = req.params;
//       const { helpful } = req.body;

//       console.log("👍 ChatbotController: Marking FAQ helpful:", faqId, helpful);

//       const type = helpful ? "helpful" : "notHelpful";
//       await this.faqRepository.updateFAQAnalytics(faqId, type);

//       res.status(200).json({ success: true, message: "Feedback recorded" });
//     } catch (error: any) {
//       console.error("❌ ChatbotController: Failed to mark FAQ helpful:", error);
//       res
//         .status(500)
//         .json({ success: false, message: "Failed to record feedback" });
//     }
//   }

//   // 📜 Get conversation history
//   async getConversationHistory(req: Request, res: Response): Promise<void> {
//     try {
//       const { sessionId } = req.params;

//       console.log(
//         "📜 ChatbotController: Fetching conversation history for:",
//         sessionId
//       );
//       const messages = await this.conversationRepository.getConversationHistory(
//         sessionId
//       );

//       res.status(200).json({ success: true, data: messages });
//     } catch (error: any) {
//       console.error(
//         "❌ ChatbotController: Failed to fetch conversation history:",
//         error
//       );
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch conversation history",
//       });
//     }
//   }

//   // 🗑️ Clear conversation
//   async clearConversation(req: Request, res: Response): Promise<void> {
//     try {
//       const { sessionId } = req.params;

//       console.log(
//         "🗑️ ChatbotController: Clearing conversation for:",
//         sessionId
//       );

//       // Update conversation as resolved
//       await this.conversationRepository.updateConversation(sessionId, {
//         resolved: true,
//         messages: [],
//         totalQuestions: 0,
//       });

//       res.status(200).json({ success: true, message: "Conversation cleared" });
//     } catch (error: any) {
//       console.error(
//         "❌ ChatbotController: Failed to clear conversation:",
//         error
//       );
//       res
//         .status(500)
//         .json({ success: false, message: "Failed to clear conversation" });
//     }
//   }

//   // ⏱️ Get rate limit status
//   async getRateLimitStatus(req: Request, res: Response): Promise<void> {
//     try {
//       const user = getUser(req);
//       const userId = user?.id;

//       if (userId) {
//         // Authenticated users have no limits
//         res.status(200).json({
//           success: true,
//           data: {
//             hasLimit: false,
//             allowed: true,
//             remaining: null,
//             message: "Authenticated users have unlimited access",
//           },
//         });
//       } else {
//         // Check rate limit for anonymous users
//         const identifier = req.ip || "unknown";
//         const rateLimitCheck = await this.rateLimitRepository.checkRateLimit(
//           identifier,
//           10, // 10 requests per hour
//           1 // 1 hour window
//         );

//         res.status(200).json({
//           success: true,
//           data: {
//             hasLimit: true,
//             allowed: rateLimitCheck.allowed,
//             remaining: rateLimitCheck.remaining,
//             resetTime: rateLimitCheck.resetTime,
//             message: `${rateLimitCheck.remaining} questions remaining this hour`,
//           },
//         });
//       }
//     } catch (error: any) {
//       console.error(
//         "❌ ChatbotController: Failed to get rate limit status:",
//         error
//       );
//       res
//         .status(500)
//         .json({ success: false, message: "Failed to check rate limit status" });
//     }
//   }

//   // Helper method to determine user type
//   private getUserType(user?: {
//     id: string;
//     role: string[];
//   }): "anonymous" | "mentee" | "mentor" {
//     if (!user || !user.role || user.role.length === 0) {
//       return "anonymous";
//     }

//     if (user.role.includes("mentor")) {
//       return "mentor";
//     } else if (user.role.includes("mentee")) {
//       return "mentee";
//     }

//     return "anonymous";
//   }

//   async debugFAQs(req: Request, res: Response): Promise<void> {
//     try {
//       const user = getUser(req);
//       const userType = this.getUserType(user);

//       console.log("🔍 Debug: Fetching FAQs for userType:", userType);

//       // Get all FAQs
//       const allFAQs = await this.faqRepository.findFAQsByUserType(userType);

//       // Test search with "find mentor"
//       const searchResults = await this.faqRepository.searchFAQs(
//         "find mentor",
//         userType
//       );

//       // Test scoring
//       const testQuery = "How do I find a mentor?";
//       const scores = allFAQs.map((faq) => ({
//         question: faq.question,
//         keywords: faq.keywords,
//         score: this.calculateFAQScore(testQuery, faq),
//       }));

//       res.status(200).json({
//         success: true,
//         data: {
//           userType,
//           totalFAQs: allFAQs.length,
//           searchResults: searchResults.length,
//           testQuery,
//           scores: scores.sort((a, b) => b.score - a.score),
//           sampleFAQ: allFAQs[0] || null,
//         },
//       });
//     } catch (error: any) {
//       console.error("❌ Debug FAQ error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Debug failed",
//         error: error.message,
//       });
//     }
//   }
// }

// export default new ChatbotController();
// Backend/src/controllers/implementation/chatbotController.ts
import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FAQRepository } from "../../repositories/implementations/FAQRepository";
import { BotConversationRepository } from "../../repositories/implementations/BotConversationRepository";
import { BotRateLimitRepository } from "../../repositories/implementations/BotRateLimitRepository";

// ✅ Helper function to get user from request (avoids TypeScript conflicts)
function getUser(
  req: Request
): { id: string; role: string[]; rawToken?: string } | undefined {
  return (req as any).user;
}

class AIService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private isInitialized: boolean = false;
  private readonly MAX_WORDS = 50; // ✅ Set maximum words limit
  private readonly MAX_CHARS = 300; // ✅ Set maximum character limit

  constructor() {
    this.initializeAI();
  }

  private initializeAI() {
    try {
      const apiKey = process.env.GEMINI_API_KEY;

      console.log("🤖 AIService: Initializing...");
      console.log("🔑 AIService: API Key exists:", !!apiKey);

      if (!apiKey) {
        console.error("❌ AIService: GEMINI_API_KEY not found in environment");
        this.isInitialized = false;
        return;
      }

      this.genAI = new GoogleGenerativeAI(apiKey);
      // ✅ FIXED: Use the correct model name
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      this.isInitialized = true;

      console.log(
        "✅ AIService: Initialized successfully with word limit:",
        this.MAX_WORDS
      );
    } catch (error: any) {
      console.error("❌ AIService: Initialization failed:", error.message);
      this.isInitialized = false;
    }
  }

  async testConnection(): Promise<string> {
    try {
      if (!this.isInitialized || !this.model) {
        throw new Error("AI service not initialized");
      }

      console.log("🧪 AIService: Testing connection...");

      const result = await this.model.generateContent(
        "Respond with exactly: 'AI CONNECTION WORKING'"
      );
      const response = result.response.text().trim();

      console.log("✅ AIService: Test response:", response);

      return response;
    } catch (error: any) {
      console.error("❌ AIService: Connection test failed:", error.message);
      throw error;
    }
  }

  async generateResponse(
    message: string,
    userType: "anonymous" | "mentee" | "mentor"
  ): Promise<string> {
    try {
      if (!this.isInitialized || !this.model) {
        throw new Error("AI service not initialized");
      }

      // ✅ STEP 1: Check if question is mentorship-related
      if (!this.isMentorshipRelated(message)) {
        console.log(
          "🚫 AIService: Question not mentorship-related, returning redirect"
        );
        return this.getNonMentorshipResponse(userType);
      }

      console.log(
        "🤖 AIService: Generating response for:",
        message.substring(0, 50) + "..."
      );
      console.log("🤖 AIService: User type:", userType);

      const prompt = this.buildPrompt(message, userType);

      console.log("🤖 AIService: Sending request to Gemini...");
      const result = await this.model.generateContent(prompt);
      const response = result.response.text().trim();

      console.log("✅ AIService: Response generated successfully");
      console.log("✅ AIService: Original response length:", response.length);

      const cleanedResponse = this.cleanAndLimitResponse(response);

      console.log(
        "✅ AIService: Final response length:",
        cleanedResponse.length
      );
      console.log(
        "✅ AIService: Word count:",
        this.countWords(cleanedResponse)
      );

      return cleanedResponse;
    } catch (error: any) {
      console.error("❌ AIService: Generation failed:", error.message);
      throw error;
    }
  }

  // ✅ IMPROVED: More comprehensive mentorship checking
  private isMentorshipRelated(message: string): boolean {
    const mentorshipKeywords = [
      // Core mentorship terms
      "mentor",
      "mentee",
      "mentoring",
      "guidance",
      "advice",
      "coach",
      "coaching",

      // Career-related
      "career",
      "job",
      "work",
      "professional",
      "skill",
      "development",
      "growth",
      "interview",
      "resume",
      "cv",
      "networking",
      "promotion",
      "salary",

      // Learning-related
      "learn",
      "learning",
      "study",
      "education",
      "training",
      "course",
      "practice",
      "improve",
      "help",
      "support",
      "guide",
      "teach",
      "experience",

      // Platform-related
      "session",
      "booking",
      "schedule",
      "meeting",
      "platform",
      "price",
      "pricing",
      "cost",
      "payment",
      "plan",
      "service",
      "feature",

      // Goals and success
      "goal",
      "goals",
      "success",
      "achievement",
      "progress",
      "challenge",
      "problem",
      "solution",
      "strategy",
      "plan",
      "future",
      "direction",

      // ✅ ADDED: Communication and relationship terms
      "relationship",
      "communication",
      "approach",
      "handle",
      "manage",
      "effective",
      "successful",
      "best",
      "measure",
      "evaluate",
      "feedback",
      "styles",
    ];

    const messageWords = message.toLowerCase().split(/\s+/);
    const hasKeyword = messageWords.some((word) =>
      mentorshipKeywords.some(
        (keyword) =>
          word.includes(keyword) ||
          keyword.includes(word) ||
          // Check for partial matches
          (word.length > 3 &&
            keyword.length > 3 &&
            (word.includes(keyword.substring(0, 4)) ||
              keyword.includes(word.substring(0, 4))))
      )
    );

    // Also check for greeting/platform questions
    const greetings = [
      "hello",
      "hi",
      "hey",
      "help",
      "what",
      "how",
      "can",
      "about",
    ];
    const hasGreeting = messageWords.some((word) => greetings.includes(word));

    console.log("🔍 AIService: Mentorship check:", {
      message: message.substring(0, 50),
      hasKeyword,
      hasGreeting,
      isRelated: hasKeyword || hasGreeting,
    });

    return hasKeyword || hasGreeting;
  }

  // ✅ Response for non-mentorship questions
  private getNonMentorshipResponse(userType: string): string {
    const responses = {
      anonymous:
        "I'm specifically designed to help with mentorship and career guidance questions. Feel free to ask me about finding mentors, career development, or our platform features!",
      mentee:
        "I'm here to help with your mentorship journey! Please ask me questions about finding mentors, career development, skill building, or how to make the most of our platform.",
      mentor:
        "I'm focused on helping with mentoring and career guidance topics. Feel free to ask about managing mentees, effective mentoring strategies, or platform features!",
    };

    return responses[userType] || responses.anonymous;
  }

  // ✅ Count words in AIService
  private countWords(text: string): number {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }

  // ✅ Clean and limit response
  private cleanAndLimitResponse(response: string): string {
    // Remove markdown formatting
    let cleaned = response.replace(/\*\*(.*?)\*\*/g, "$1");
    cleaned = cleaned.replace(/\*(.*?)\*/g, "$1");
    cleaned = cleaned.replace(/#{1,6}\s/g, ""); // Remove headers
    cleaned = cleaned.replace(/`([^`]*)`/g, "$1"); // Remove code formatting

    // Remove extra whitespace
    cleaned = cleaned.replace(/\s+/g, " ").trim();

    // ✅ WORD LIMIT: Limit by word count first
    const words = cleaned.split(/\s+/);
    if (words.length > this.MAX_WORDS) {
      cleaned = words.slice(0, this.MAX_WORDS).join(" ") + "...";
      console.log(`📝 AIService: Truncated to ${this.MAX_WORDS} words`);
    }

    // ✅ CHARACTER LIMIT: Secondary limit by characters
    if (cleaned.length > this.MAX_CHARS) {
      cleaned = cleaned.substring(0, this.MAX_CHARS - 3) + "...";
      console.log(`📝 AIService: Truncated to ${this.MAX_CHARS} characters`);
    }

    // Ensure we don't cut off mid-sentence
    if (cleaned.endsWith("...")) {
      const lastSentenceEnd = cleaned.lastIndexOf(".", cleaned.length - 4);
      const lastQuestionEnd = cleaned.lastIndexOf("?", cleaned.length - 4);
      const lastExclamationEnd = cleaned.lastIndexOf("!", cleaned.length - 4);

      const lastEnd = Math.max(
        lastSentenceEnd,
        lastQuestionEnd,
        lastExclamationEnd
      );

      if (lastEnd > cleaned.length * 0.7) {
        // Only if we're not cutting too much
        cleaned = cleaned.substring(0, lastEnd + 1) + "..";
      }
    }

    return cleaned;
  }

  private buildPrompt(message: string, userType: string): string {
    const contextInfo = {
      anonymous:
        "You are helping a visitor explore our mentorship platform. Focus on general information, features, and encourage them to sign up.",
      mentee:
        "You are helping a mentee who is looking for guidance and mentorship. Focus on how to find mentors, book sessions, and get the most from mentorship.",
      mentor:
        "You are helping a mentor who wants to provide guidance. Focus on managing mentees, scheduling, and effective mentoring practices.",
    };

    return `
You are an AI assistant for a mentorship platform focused ONLY on mentorship, career guidance, and our platform features.

User Context: ${contextInfo[userType as keyof typeof contextInfo]}

Platform Information:
- Pricing: $50 for 1-on-1 sessions, $30 for group sessions, monthly packages from $150
- Features: mentor matching, session booking, progress tracking, video calls, session recordings
- User Types: school students, college students, professionals
- Platform Focus: Career development, skill building, professional growth

IMPORTANT RESTRICTIONS:
- ONLY answer questions related to mentorship, career guidance, professional development, or our platform
- Keep responses to maximum 40-50 words
- Be concise, helpful, and encouraging
- Focus on actionable advice
- If asked about non-mentorship topics, politely redirect to mentorship-related questions

User Question: "${message}"

Provide a brief, helpful response (maximum 50 words) as a mentorship platform assistant.
`;
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  // ✅ Public method to get current limits (for debugging)
  getLimits(): { maxWords: number; maxChars: number } {
    return {
      maxWords: this.MAX_WORDS,
      maxChars: this.MAX_CHARS,
    };
  }
}

export class ChatbotController {
  private aiService: AIService;
  private faqRepository: FAQRepository;
  private conversationRepository: BotConversationRepository;
  private rateLimitRepository: BotRateLimitRepository;

  constructor() {
    this.aiService = new AIService();
    this.faqRepository = new FAQRepository();
    this.conversationRepository = new BotConversationRepository();
    this.rateLimitRepository = new BotRateLimitRepository();
    console.log(
      "🤖 ChatbotController: Initialized with AI service and repositories"
    );
  }

  // 🧪 Test AI Connection
  async testAI(req: Request, res: Response): Promise<void> {
    try {
      console.log("🧪 ChatbotController: Testing AI connection...");

      const hasApiKey = !!process.env.GEMINI_API_KEY;
      console.log("🔑 API Key exists:", hasApiKey);

      if (!hasApiKey) {
        res.status(500).json({
          success: false,
          message: "GEMINI_API_KEY not configured",
          details: "Add GEMINI_API_KEY to your .env file",
        });
        return;
      }

      const testResponse = await this.aiService.testConnection();
      const limits = this.aiService.getLimits();

      res.status(200).json({
        success: true,
        message: "AI integration working!",
        data: {
          aiResponse: testResponse,
          aiReady: this.aiService.isReady(),
          apiKeyConfigured: hasApiKey,
          modelUsed: "gemini-1.5-flash",
          limits: limits,
          timestamp: new Date(),
        },
      });
    } catch (error: any) {
      console.error("🧪 ChatbotController: AI test error:", error);
      res.status(500).json({
        success: false,
        message: "AI integration failed",
        error: error.message,
        details: {
          apiKeyConfigured: !!process.env.GEMINI_API_KEY,
          errorType: error.constructor.name,
          modelAttempted: "gemini-1.5-flash",
        },
      });
    }
  }

  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { message, sessionId } = req.body;
      const user = getUser(req);
      const userId = user?.id;
      const userRoles = user?.role || [];

      console.log("💬 ChatbotController: Processing message:", {
        userId: userId || "anonymous",
        userRoles,
        messagePreview: message?.substring(0, 50) + "...",
        sessionId,
        timestamp: new Date().toISOString(),
      });

      // Validation
      if (!message || !sessionId) {
        res.status(400).json({
          success: false,
          message: "Message and sessionId are required",
        });
        return;
      }

      // ✅ IMPROVED CONTENT FILTER: Much more lenient for mentorship questions
      if (!this.isAppropriateMessage(message)) {
        const redirectResponse =
          "I'm designed to help with mentorship and career guidance. Please ask me about finding mentors, career development, or our platform features!";

        res.status(200).json({
          success: true,
          data: {
            response: redirectResponse,
            source: "content_filter",
            confidence: 1.0,
            userType: "anonymous",
            timestamp: new Date(),
            suggestions: [
              "How do I find a mentor?",
              "Tell me about pricing",
              "What features do you offer?",
            ],
          },
        });
        return;
      }

      // Determine user type
      let userType: "anonymous" | "mentee" | "mentor" = "anonymous";
      if (userId && userRoles.length > 0) {
        if (userRoles.includes("mentor")) {
          userType = "mentor";
        } else if (userRoles.includes("mentee")) {
          userType = "mentee";
        }
      }

      console.log("👤 ChatbotController: User type determined:", userType);

      // Check rate limit for anonymous users
      if (!userId) {
        const identifier = req.ip || "unknown";
        const rateLimitCheck = await this.rateLimitRepository.checkRateLimit(
          identifier,
          10, // 10 requests per hour
          1 // 1 hour window
        );

        if (!rateLimitCheck.allowed) {
          res.status(429).json({
            success: false,
            message: "Rate limit exceeded. Please try again later.",
            data: {
              remaining: rateLimitCheck.remaining,
              resetTime: rateLimitCheck.resetTime,
            },
          });
          return;
        }
      }

      let botResponse = "";
      let responseSource = "";
      let confidence = 0.8;
      let faqId: string | undefined;
      const lowerMessage = message.toLowerCase();

      // 🎯 STRATEGY 1: Enhanced FAQ search with better matching
      try {
        console.log(
          "🔍 ChatbotController: Searching FAQ database for:",
          message
        );

        const allFAQs = await this.faqRepository.findFAQsByUserType(userType);
        console.log(
          "📚 ChatbotController: Found",
          allFAQs.length,
          "FAQs for userType:",
          userType
        );

        if (allFAQs.length > 0) {
          let bestMatch = null;
          let bestScore = 0;

          for (const faq of allFAQs) {
            const score = this.calculateFAQScore(message, faq);

            if (score > bestScore) {
              bestScore = score;
              bestMatch = faq;
            }
          }

          console.log("🏆 Best FAQ match score:", bestScore);

          // Lower threshold for better FAQ matching
          if (bestMatch && bestScore > 0.4) {
            console.log(
              "✅ ChatbotController: Found FAQ match with score:",
              bestScore
            );

            await this.faqRepository.updateFAQAnalytics(
              bestMatch._id.toString(),
              "view"
            );

            botResponse = bestMatch.answer;
            responseSource = "faq";
            confidence = bestScore;
            faqId = bestMatch._id.toString();
          }
        }
      } catch (faqError) {
        console.error("❌ ChatbotController: FAQ search failed:", faqError);
      }

      // 🎯 STRATEGY 2: Try keyword matching for simple queries
      if (!botResponse && this.isSimpleQuery(lowerMessage)) {
        console.log("⚡ ChatbotController: Using keyword matching");

        const keywordResponse = this.getKeywordResponse(lowerMessage, userType);
        if (keywordResponse) {
          botResponse = keywordResponse;
          responseSource = "keyword_match";
          confidence = 0.9;
        }
      }

      // 🎯 STRATEGY 3: Use AI for complex queries
      if (!botResponse) {
        console.log("🤖 ChatbotController: Using AI for complex query...");

        try {
          if (!this.aiService.isReady()) {
            throw new Error("AI service not ready");
          }

          botResponse = await this.aiService.generateResponse(
            message,
            userType
          );
          responseSource = "ai_powered";
          confidence = 0.95;

          console.log(
            "✅ ChatbotController: AI response generated successfully"
          );
          console.log(
            "📝 Final response word count:",
            this.countWords(botResponse)
          );
        } catch (aiError: any) {
          console.error(
            "❌ ChatbotController: AI failed, using fallback:",
            aiError.message
          );

          botResponse = this.getFallbackResponse(userType);
          responseSource = "fallback";
          confidence = 0.6;
        }
      }

      // 💾 Save conversation to database
      try {
        await this.saveConversation(
          sessionId,
          message,
          botResponse,
          userType,
          userId,
          responseSource,
          faqId
        );
      } catch (saveError) {
        console.error(
          "❌ ChatbotController: Failed to save conversation:",
          saveError
        );
      }

      // Log final response
      console.log("📤 ChatbotController: Sending response:", {
        source: responseSource,
        confidence,
        responseLength: botResponse.length,
        wordCount: this.countWords(botResponse),
        userType,
        faqId: faqId || null,
      });

      res.status(200).json({
        success: true,
        data: {
          response: botResponse,
          source: responseSource,
          confidence,
          userType,
          timestamp: new Date(),
          suggestions: this.getSuggestions(userType, responseSource),
          faqId,
          wordCount: this.countWords(botResponse),
        },
      });
    } catch (error: any) {
      console.error("❌ ChatbotController: Unexpected error:", error);
      res.status(500).json({
        success: false,
        message: "I'm having trouble right now. Please try again later.",
        error: error.message,
      });
    }
  }

  // ✅ MUCH MORE LENIENT Content appropriateness filter
  private isAppropriateMessage(message: string): boolean {
    const inappropriatePatterns = [
      // Only block obviously unrelated topics
      /weather|climate|temperature|rain|snow|sunny|cloudy/i,
      /sports|football|basketball|soccer|cricket|tennis/i,
      /politics|government|election|president|voting/i,
      /cooking|recipe|food|restaurant|kitchen/i,
      /movie|film|tv show|entertainment|celebrity/i,
      /shopping|buy|sell|product|store/i,
      /medical|health|doctor|hospital|medicine/i,
      /legal|law|lawyer|court|judge/i,

      // Inappropriate content
      /spam|offensive|inappropriate/i,

      // Random/testing messages
      /^test$/i,
      /random|nonsense|gibberish/i,
    ];

    // Check for inappropriate patterns
    const hasInappropriate = inappropriatePatterns.some((pattern) =>
      pattern.test(message)
    );

    // ✅ COMPREHENSIVE mentorship keywords
    const mentorshipKeywords = [
      // Core mentorship terms
      "mentor",
      "mentee",
      "mentoring",
      "guidance",
      "advice",
      "coach",
      "coaching",

      // Career-related
      "career",
      "job",
      "work",
      "professional",
      "skill",
      "development",
      "growth",
      "interview",
      "resume",
      "cv",
      "networking",
      "promotion",
      "salary",

      // Learning-related
      "learn",
      "learning",
      "study",
      "education",
      "training",
      "course",
      "practice",
      "improve",
      "help",
      "support",
      "guide",
      "teach",
      "experience",

      // Platform-related
      "session",
      "booking",
      "schedule",
      "meeting",
      "platform",
      "price",
      "pricing",
      "cost",
      "payment",
      "plan",
      "service",
      "feature",

      // Goals and success
      "goal",
      "goals",
      "success",
      "achievement",
      "progress",
      "challenge",
      "problem",
      "solution",
      "strategy",
      "plan",
      "future",
      "direction",

      // ✅ RELATIONSHIP AND COMMUNICATION TERMS
      "relationship",
      "communication",
      "feedback",
      "styles",
      "approach",
      "handle",
      "manage",
      "effective",
      "successful",
      "best",
      "measure",
      "evaluate",
      "age",
      "gap",
      "different",
      "conflicting",
      "transition",
      "specific",
      "qualities",
      "strategies",
      "consistency",
      "constructive",
      "situation",
      "multiple",
      "deep",
    ];

    // ✅ IMPROVED: More intelligent keyword matching
    const messageWords = message.toLowerCase().split(/\s+/);
    const hasMentorshipContext = mentorshipKeywords.some((keyword) =>
      messageWords.some(
        (word) =>
          word.includes(keyword) ||
          keyword.includes(word) ||
          // Check partial matches for compound words
          (word.length > 3 &&
            keyword.length > 3 &&
            (word.includes(keyword.substring(0, 4)) ||
              keyword.includes(word.substring(0, 4))))
      )
    );

    // ✅ QUESTION INDICATORS
    const questionIndicators = [
      "what",
      "how",
      "why",
      "when",
      "where",
      "which",
      "can",
      "should",
      "best",
      "approach",
      "way",
      "handle",
      "manage",
      "difference",
      "strategies",
    ];
    const hasQuestionIndicator = messageWords.some((word) =>
      questionIndicators.includes(word)
    );

    // ✅ GREETING WORDS
    const greetingWords = [
      "hello",
      "hi",
      "hey",
      "help",
      "about",
      "tell",
      "explain",
      "find",
    ];
    const hasGreeting = messageWords.some((word) =>
      greetingWords.includes(word)
    );

    // ✅ LESS RESTRICTIVE length check
    const words = message.trim().split(/\s+/);
    const isTooShort =
      words.length < 2 &&
      !["help", "pricing", "mentor"].includes(message.toLowerCase());

    console.log("🔍 Content filter check:", {
      message: message.substring(0, 50) + "...",
      hasInappropriate,
      isTooShort,
      hasMentorshipContext,
      hasGreeting,
      hasQuestionIndicator,
      wordCount: words.length,
      isAppropriate:
        !hasInappropriate &&
        !isTooShort &&
        (hasMentorshipContext ||
          hasGreeting ||
          hasQuestionIndicator ||
          words.length >= 4), // More lenient word count
    });

    // ✅ MUCH MORE LENIENT: Allow most questions through
    return (
      !hasInappropriate &&
      !isTooShort &&
      (hasMentorshipContext ||
        hasGreeting ||
        hasQuestionIndicator ||
        words.length >= 4) // Allow longer questions even without keywords
    );
  }

  // ✅ Count words helper method for ChatbotController
  private countWords(text: string): number {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }

  private calculateFAQScore(query: string, faq: any): number {
    const queryWords = query
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2);
    const question = faq.question.toLowerCase();
    const keywords = faq.keywords.map((k: string) => k.toLowerCase());
    const answer = faq.answer.toLowerCase();

    let score = 0;
    let matches = 0;

    for (const word of queryWords) {
      // Exact question match (highest weight)
      if (question.includes(word)) {
        score += 3;
        matches++;
      }
      // Keyword match (medium weight)
      else if (keywords.some((keyword) => keyword.includes(word))) {
        score += 2;
        matches++;
      }
      // Answer match (lowest weight)
      else if (answer.includes(word)) {
        score += 1;
        matches++;
      }
    }

    // Normalize score by query length
    const normalizedScore =
      queryWords.length > 0 ? matches / queryWords.length : 0;

    console.log(
      `FAQ Score Debug - Query: "${query}" vs FAQ: "${faq.question}"`
    );
    console.log(`- Query words: [${queryWords.join(", ")}]`);
    console.log(`- Keywords: [${keywords.join(", ")}]`);
    console.log(
      `- Raw score: ${score}, Matches: ${matches}, Normalized: ${normalizedScore}`
    );

    return normalizedScore;
  }

  // 💾 Save conversation to database
  private async saveConversation(
    sessionId: string,
    userMessage: string,
    botResponse: string,
    userType: string,
    userId?: string,
    responseType: string = "fallback",
    faqId?: string
  ): Promise<void> {
    try {
      // Check if conversation exists
      let conversation = await this.conversationRepository.findBySessionId(
        sessionId
      );

      if (!conversation) {
        // Create new conversation
        conversation = await this.conversationRepository.createConversation({
          sessionId,
          userId: userId ? (userId as any) : undefined,
          userType: userType as any,
          messages: [],
          totalQuestions: 0,
          resolved: false,
        });
      }

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
        responseType: responseType as any,
        faqId: faqId ? (faqId as any) : undefined,
        timestamp: new Date(),
      });

      console.log("💾 ChatbotController: Conversation saved successfully");
    } catch (error) {
      console.error("❌ ChatbotController: Error saving conversation:", error);
      throw error;
    }
  }

  private isSimpleQuery(message: string): boolean {
    const simpleKeywords = [
      "hello",
      "hi",
      "hey",
      "price",
      "cost",
      "pricing",
      "help",
      "support",
    ];

    return (
      simpleKeywords.some((keyword) => message.includes(keyword)) &&
      message.length < 50
    );
  }

  private getKeywordResponse(message: string, userType: string): string | null {
    if (
      message.includes("price") ||
      message.includes("cost") ||
      message.includes("pricing")
    ) {
      return `Great question! Our ${
        userType === "mentor" ? "mentor" : "mentee"
      } pricing is flexible: $50/session for 1-on-1 mentoring, $30/session for group sessions, and monthly packages starting at $150. All plans include session recordings and follow-up resources.`;
    }

    if (
      message.includes("hello") ||
      message.includes("hi") ||
      message.includes("hey")
    ) {
      return `Hello! 👋 I'm your AI mentor assistant. I can help you with ${
        userType === "anonymous" ? "learning about our platform, " : ""
      }finding mentors, booking sessions, pricing information, and answering any questions about our mentorship platform. What would you like to know?`;
    }

    if (message.includes("help") || message.includes("support")) {
      return `I'm here to help! I can assist you with finding mentors, booking sessions, understanding our pricing, and answering questions about our mentorship platform. What specific information are you looking for?`;
    }

    return null;
  }

  private getFallbackResponse(userType: string): string {
    return `I'd be happy to help you as ${
      userType === "anonymous" ? "a visitor" : `a ${userType}`
    }! You can ask me about finding mentors, booking sessions, pricing, or any other questions about our mentorship platform. What specifically would you like to know?`;
  }

  private getSuggestions(userType: string, source: string): string[] {
    if (userType === "anonymous") {
      return [
        "Tell me about pricing",
        "How do I sign up?",
        "What is mentorship?",
      ];
    } else if (userType === "mentee") {
      return ["Find a mentor", "Book a session", "How does mentoring work?"];
    } else {
      return [
        "Manage my schedule",
        "View my mentees",
        "Mentoring best practices",
      ];
    }
  }

  // 📁 Get FAQ categories from database
  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const user = getUser(req);
      const userType = this.getUserType(user);

      console.log(
        "📁 ChatbotController: Fetching categories for userType:",
        userType
      );
      const categories = await this.faqRepository.findActiveCategories(
        userType
      );

      res.status(200).json({ success: true, data: categories });
    } catch (error: any) {
      console.error("❌ ChatbotController: Failed to fetch categories:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch categories" });
    }
  }

  // 📋 Get all FAQs from database
  async getAllFAQs(req: Request, res: Response): Promise<void> {
    try {
      const user = getUser(req);
      const userType = this.getUserType(user);

      console.log(
        "📋 ChatbotController: Fetching FAQs for userType:",
        userType
      );
      const faqs = await this.faqRepository.findFAQsByUserType(userType);

      res.status(200).json({ success: true, data: faqs });
    } catch (error: any) {
      console.error("❌ ChatbotController: Failed to fetch FAQs:", error);
      res.status(500).json({ success: false, message: "Failed to fetch FAQs" });
    }
  }

  // 📂 Get FAQs by category from database
  async getFAQsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;
      const user = getUser(req);
      const userType = this.getUserType(user);

      console.log(
        "📂 ChatbotController: Fetching FAQs for category:",
        categoryId,
        "userType:",
        userType
      );
      const faqs = await this.faqRepository.findFAQsByCategory(
        categoryId,
        userType
      );

      res.status(200).json({ success: true, data: faqs });
    } catch (error: any) {
      console.error(
        "❌ ChatbotController: Failed to fetch FAQs by category:",
        error
      );
      res.status(500).json({ success: false, message: "Failed to fetch FAQs" });
    }
  }

  // 👍 Mark FAQ as helpful
  async markFAQHelpful(req: Request, res: Response): Promise<void> {
    try {
      const { faqId } = req.params;
      const { helpful } = req.body;

      console.log("👍 ChatbotController: Marking FAQ helpful:", faqId, helpful);

      const type = helpful ? "helpful" : "notHelpful";
      await this.faqRepository.updateFAQAnalytics(faqId, type);

      res.status(200).json({ success: true, message: "Feedback recorded" });
    } catch (error: any) {
      console.error("❌ ChatbotController: Failed to mark FAQ helpful:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to record feedback" });
    }
  }

  // 📜 Get conversation history
  async getConversationHistory(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;

      console.log(
        "📜 ChatbotController: Fetching conversation history for:",
        sessionId
      );
      const messages = await this.conversationRepository.getConversationHistory(
        sessionId
      );

      res.status(200).json({ success: true, data: messages });
    } catch (error: any) {
      console.error(
        "❌ ChatbotController: Failed to fetch conversation history:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Failed to fetch conversation history",
      });
    }
  }

  // 🗑️ Clear conversation
  async clearConversation(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;

      console.log(
        "🗑️ ChatbotController: Clearing conversation for:",
        sessionId
      );

      // Update conversation as resolved
      await this.conversationRepository.updateConversation(sessionId, {
        resolved: true,
        messages: [],
        totalQuestions: 0,
      });

      res.status(200).json({ success: true, message: "Conversation cleared" });
    } catch (error: any) {
      console.error(
        "❌ ChatbotController: Failed to clear conversation:",
        error
      );
      res
        .status(500)
        .json({ success: false, message: "Failed to clear conversation" });
    }
  }

  // ⏱️ Get rate limit status
  async getRateLimitStatus(req: Request, res: Response): Promise<void> {
    try {
      const user = getUser(req);
      const userId = user?.id;

      if (userId) {
        // Authenticated users have no limits
        res.status(200).json({
          success: true,
          data: {
            hasLimit: false,
            allowed: true,
            remaining: null,
            message: "Authenticated users have unlimited access",
          },
        });
      } else {
        // Check rate limit for anonymous users
        const identifier = req.ip || "unknown";
        const rateLimitCheck = await this.rateLimitRepository.checkRateLimit(
          identifier,
          10, // 10 requests per hour
          1 // 1 hour window
        );

        res.status(200).json({
          success: true,
          data: {
            hasLimit: true,
            allowed: rateLimitCheck.allowed,
            remaining: rateLimitCheck.remaining,
            resetTime: rateLimitCheck.resetTime,
            message: `${rateLimitCheck.remaining} questions remaining this hour`,
          },
        });
      }
    } catch (error: any) {
      console.error(
        "❌ ChatbotController: Failed to get rate limit status:",
        error
      );
      res
        .status(500)
        .json({ success: false, message: "Failed to check rate limit status" });
    }
  }

  // Helper method to determine user type
  private getUserType(user?: {
    id: string;
    role: string[];
  }): "anonymous" | "mentee" | "mentor" {
    if (!user || !user.role || user.role.length === 0) {
      return "anonymous";
    }

    if (user.role.includes("mentor")) {
      return "mentor";
    } else if (user.role.includes("mentee")) {
      return "mentee";
    }

    return "anonymous";
  }

  // 🔍 Debug FAQ endpoint
  async debugFAQs(req: Request, res: Response): Promise<void> {
    try {
      const user = getUser(req);
      const userType = this.getUserType(user);

      console.log("🔍 Debug: Fetching FAQs for userType:", userType);

      // Get all FAQs
      const allFAQs = await this.faqRepository.findFAQsByUserType(userType);

      // Test search with "find mentor"
      const searchResults = await this.faqRepository.searchFAQs(
        "find mentor",
        userType
      );

      // Test scoring
      const testQuery = "How do I find a mentor?";
      const scores = allFAQs.map((faq) => ({
        question: faq.question,
        keywords: faq.keywords,
        score: this.calculateFAQScore(testQuery, faq),
      }));

      res.status(200).json({
        success: true,
        data: {
          userType,
          totalFAQs: allFAQs.length,
          searchResults: searchResults.length,
          testQuery,
          scores: scores.sort((a, b) => b.score - a.score),
          sampleFAQ: allFAQs[0] || null,
        },
      });
    } catch (error: any) {
      console.error("❌ Debug FAQ error:", error);
      res.status(500).json({
        success: false,
        message: "Debug failed",
        error: error.message,
      });
    }
  }
}

export default new ChatbotController();
