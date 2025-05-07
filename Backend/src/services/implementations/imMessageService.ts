// import MessageRepository from "../../repositories/implementations/imMessageRepository";
// import ChatRepository from "../../repositories/implementations/imChatRepository";
// import { ApiError } from "../../middlewares/errorHandler";
// import mongoose from "mongoose";

// export default class MessageService {
//   private messageRepository: MessageRepository;
//   private chatRepository: ChatRepository;

//   constructor() {
//     this.messageRepository = new MessageRepository();
//     this.chatRepository = new ChatRepository();
//   }

//   async sendMessage(chatId: string, senderId: string, content: string) {
//     console.log("MessageService.sendMessage called:", {
//       chatId,
//       senderId,
//       content,
//     });
//     const chat = await this.chatRepository.findById(chatId);
//     if (
//       !chat ||
//       !chat.users.some((user) =>
//         user._id.equals(new mongoose.Types.ObjectId(senderId))
//       )
//     ) {
//       console.error("Unauthorized or chat not found:", { chatId, senderId });
//       throw new ApiError(403, "Unauthorized or chat not found");
//     }

//     const messageData = {
//       sender: senderId,
//       content,
//       chat: chatId,
//       readBy: [senderId],
//     };

//     console.log("Creating message with data:", messageData);
//     const message = await this.messageRepository.create(messageData);
//     console.log("Message created, updating latestMessage:", message._id);
//     await this.chatRepository.findByIdAndUpdate(chatId, {
//       latestMessage: message._id,
//     });
//     console.log("latestMessage updated for chat:", chatId);
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
import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";
import { PassThrough } from "stream";

export default class MessageService {
  private messageRepository: MessageRepository;
  private chatRepository: ChatRepository;

  constructor() {
    this.messageRepository = new MessageRepository();
    this.chatRepository = new ChatRepository();
  }

  async sendMessage(
    chatId: string,
    senderId: string,
    content: string,
    type: "text" | "image" | "audio" = "text",
    file?: Buffer
  ) {
    console.log("MessageService.sendMessage called:", {
      chatId,
      senderId,
      content,
      type,
    });
    const chat = await this.chatRepository.findById(chatId);
    if (
      !chat ||
      !chat.users.some((user) =>
        user._id.equals(new mongoose.Types.ObjectId(senderId))
      )
    ) {
      console.error("Unauthorized or chat not found:", { chatId, senderId });
      throw new ApiError(403, "Unauthorized or chat not found");
    }

    let finalContent = content;
    if (file && type === "image") {
      // Compress image
      const compressedImage = await sharp(file)
        .resize({ width: 800 }) // Resize to 800px width
        .jpeg({ quality: 80 }) // Compress to 80% quality
        .toBuffer();
      finalContent = compressedImage.toString("base64");
    } else if (file && type === "audio") {
      // Compress audio (example using ffmpeg, adjust as needed)
      const outputStream = new PassThrough();
      ffmpeg()
        .input(file)
        .audioCodec("libopus")
        .format("webm")
        .audioBitrate("64k")
        .pipe(outputStream);
      const compressedAudio = await new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        outputStream.on("data", (chunk) => chunks.push(chunk));
        outputStream.on("end", () => resolve(Buffer.concat(chunks)));
        outputStream.on("error", reject);
      });
      finalContent = compressedAudio.toString("base64");
    }

    const messageData = {
      sender: senderId,
      content: finalContent,
      type,
      chat: chatId,
      readBy: [senderId],
    };

    console.log("Creating message with data:", messageData);
    const message = await this.messageRepository.create(messageData);
    console.log("Message created, updating latestMessage:", message._id);
    await this.chatRepository.findByIdAndUpdate(chatId, {
      latestMessage: message._id,
    });
    console.log("latestMessage updated for chat:", chatId);
    return message;
  }

  async getMessagesByChatId(chatId: string) {
    return await this.messageRepository.findByChatId(chatId);
  }

  async markMessagesAsRead(chatId: string, userId: string) {
    return await this.messageRepository.markAsRead(chatId, userId);
  }
}
