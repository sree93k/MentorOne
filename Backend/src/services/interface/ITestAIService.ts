/**
 * 🔹 DIP COMPLIANCE: Test AI Service Interface
 * Defines AI testing and smart response operations
 */
export interface ITestAIService {
  // AI Connection Testing
  testConnection(): Promise<string>;

  // Smart Response Generation
  generateSmartResponse(
    message: string,
    userType: string
  ): Promise<string>;
}