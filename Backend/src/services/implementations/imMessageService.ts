// import MessageRepository from "../../repositories/implementations/imMessageRepository";
// import ChatRepository from "../../repositories/implementations/imChatRepository";
// import { ApiError } from "../../middlewares/errorHandler";

// export default class MessageService {
//   private messageRepository: MessageRepository;
//   private chatRepository: ChatRepository;

//   constructor() {
//     this.messageRepository = new MessageRepository();
//     this.chatRepository = new ChatRepository();
//   }

//   async sendMessage(chatId: string, senderId: string, content: string) {
//     const chat = await this.chatRepository.findById(chatId);
//     if (!chat || !chat.users.includes(senderId)) {
//       throw new ApiError(403, "Unauthorized or chat not found");
//     }

//     const messageData = {
//       sender: senderId,
//       content,
//       chat: chatId,
//       readBy: [senderId],
//     };

//     const message = await this.messageRepository.create(messageData);
//     await this.chatRepository.findByIdAndUpdate(chatId, {
//       latestMessage: message._id,
//     });
//     return message;
//   }

//   async getMessagesByChatId(chatId: string) {
//     return await this.messageRepository.findByChatId(chatId);
//   }

//   async markMessagesAsRead(chatId: string, userId: string) {
//     return await this.messageRepository.markAsRead(chatId, userId);
//   }
// }
import MessageRepository from "../../repositories/implementations/imMessageRepository";
import ChatRepository from "../../repositories/implementations/imChatRepository";
import { ApiError } from "../../middlewares/errorHandler";
import mongoose from "mongoose";

export default class MessageService {
  private messageRepository: MessageRepository;
  private chatRepository: ChatRepository;

  constructor() {
    this.messageRepository = new MessageRepository();
    this.chatRepository = new ChatRepository();
  }

  async sendMessage(chatId: string, senderId: string, content: string) {
    const chat = await this.chatRepository.findById(chatId);
    if (
      !chat ||
      !chat.users.some((user) =>
        user._id.equals(new mongoose.Types.ObjectId(senderId))
      )
    ) {
      throw new ApiError(403, "Unauthorized or chat not found");
    }

    const messageData = {
      sender: senderId,
      content,
      chat: chatId,
      readBy: [senderId],
    };

    const message = await this.messageRepository.create(messageData);
    await this.chatRepository.findByIdAndUpdate(chatId, {
      latestMessage: message._id,
    });
    return message;
  }

  async getMessagesByChatId(chatId: string) {
    return await this.messageRepository.findByChatId(chatId);
  }

  async markMessagesAsRead(chatId: string, userId: string) {
    return await this.messageRepository.markAsRead(chatId, userId);
  }
}
