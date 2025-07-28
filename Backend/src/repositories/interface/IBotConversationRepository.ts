// import { EBotConversation } from "../../entities/EBotConversationEntity";

// export interface IBotConversationRepository {
//   createConversation(
//     data: Partial<EBotConversation>
//   ): Promise<EBotConversation>;
//   findBySessionId(sessionId: string): Promise<EBotConversation | null>;
//   addMessage(sessionId: string, message: any): Promise<EBotConversation>;
//   updateConversation(
//     sessionId: string,
//     updates: Partial<EBotConversation>
//   ): Promise<EBotConversation | null>;
//   getConversationHistory(sessionId: string): Promise<any[]>;
// }
import { EBotConversation } from "../../entities/EBotConversationEntity";

export interface IBotConversationRepository {
  createConversation(
    data: Partial<EBotConversation>
  ): Promise<EBotConversation>;
  findBySessionId(sessionId: string): Promise<EBotConversation | null>;
  addMessage(sessionId: string, message: any): Promise<EBotConversation>;
  updateConversation(
    sessionId: string,
    updates: Partial<EBotConversation>
  ): Promise<EBotConversation | null>;
  getConversationHistory(sessionId: string): Promise<any[]>;
}
