export interface IAIService {
  generateResponse(message: string, context: any): Promise<string>;
  detectIntent(
    message: string
  ): Promise<{ intent: string; confidence: number }>;
}
