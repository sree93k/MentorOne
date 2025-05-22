import { EMessage } from "../../entities/messageEntity";

export interface IMessageRepository {
  create(data: any): Promise<EMessage>;
  findByChatId(chatId: string): Promise<EMessage[]>;
  markAsRead(chatId: string, userId: string): Promise<any>;
}
