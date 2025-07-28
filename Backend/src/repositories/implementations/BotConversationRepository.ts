// import BotConversation from "../../models/BotConversationModel";
// import { EBotConversation } from "../../entities/EBotConversationEntity";
// import { IBotConversationRepository } from "../interface/IBotConversationRepository";

// export class BotConversationRepository implements IBotConversationRepository {
//   async createConversation(
//     data: Partial<EBotConversation>
//   ): Promise<EBotConversation> {
//     const conversation = new BotConversation(data);
//     return await conversation.save();
//   }

//   async findBySessionId(sessionId: string): Promise<EBotConversation | null> {
//     return await BotConversation.findOne({ sessionId }).lean();
//   }

//   async addMessage(sessionId: string, message: any): Promise<EBotConversation> {
//     return await BotConversation.findOneAndUpdate(
//       { sessionId },
//       {
//         $push: { messages: message },
//         $inc: { totalQuestions: message.sender === "user" ? 1 : 0 },
//       },
//       { new: true, upsert: true }
//     );
//   }

//   async updateConversation(
//     sessionId: string,
//     updates: Partial<EBotConversation>
//   ): Promise<EBotConversation | null> {
//     return await BotConversation.findOneAndUpdate({ sessionId }, updates, {
//       new: true,
//     });
//   }

//   async getConversationHistory(sessionId: string): Promise<any[]> {
//     const conversation = await BotConversation.findOne({ sessionId });
//     return conversation?.messages || [];
//   }
// }
import BotConversation from "../../models/BotConversationModel";
import { EBotConversation } from "../../entities/EBotConversationEntity";
import { IBotConversationRepository } from "../interface/IBotConversationRepository";
import BaseRepository from "./BaseRepository";

export class BotConversationRepository
  extends BaseRepository<EBotConversation>
  implements IBotConversationRepository
{
  constructor() {
    super(BotConversation);
  }

  async createConversation(
    data: Partial<EBotConversation>
  ): Promise<EBotConversation> {
    try {
      return await this.create(data);
    } catch (error) {
      throw this.handleError(error, "createConversation");
    }
  }

  async findBySessionId(sessionId: string): Promise<EBotConversation | null> {
    try {
      return await this.findOne({ sessionId }, { lean: true });
    } catch (error) {
      throw this.handleError(error, "findBySessionId");
    }
  }

  async addMessage(sessionId: string, message: any): Promise<EBotConversation> {
    try {
      const result = await this.getModel().findOneAndUpdate(
        { sessionId },
        {
          $push: { messages: message },
          $inc: { totalQuestions: message.sender === "user" ? 1 : 0 },
        },
        { new: true, upsert: true }
      );

      if (!result) {
        throw new Error("Failed to add message to conversation");
      }

      return result;
    } catch (error) {
      throw this.handleError(error, "addMessage");
    }
  }

  async updateConversation(
    sessionId: string,
    updates: Partial<EBotConversation>
  ): Promise<EBotConversation | null> {
    try {
      return await this.updateOne({ sessionId }, updates);
    } catch (error) {
      throw this.handleError(error, "updateConversation");
    }
  }

  async getConversationHistory(sessionId: string): Promise<any[]> {
    try {
      const conversation = await this.findOne({ sessionId });
      return conversation?.messages || [];
    } catch (error) {
      throw this.handleError(error, "getConversationHistory");
    }
  }
}
