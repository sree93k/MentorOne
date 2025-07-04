import { EMessage } from "../../entities/messageEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface IMessageRepository extends IBaseRepository<EMessage> {
  findByChatId(chatId: string): Promise<EMessage[]>;
  markAsRead(
    chatId: string,
    userId: string
  ): Promise<{ modifiedCount: number }>;
}
