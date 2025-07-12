import MessageRepository from "../../repositories/implementations/MessageRepository";
import ChatService from "./ChatService";
import { IChatService } from "../interface/IChatService";
import mongoose from "mongoose";
import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";
import { PassThrough } from "stream";
import { IMessageService } from "../interface/IMessageService";

export default class MessageService implements IMessageService {
  private messageRepository: MessageRepository;
  private chatService: IChatService;

  constructor() {
    this.messageRepository = new MessageRepository();
    this.chatService = new ChatService();
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
    const chat = await this.chatService.findChatById(chatId);
    if (
      !chat ||
      !chat.users.some((user) =>
        user._id.equals(new mongoose.Types.ObjectId(senderId))
      )
    ) {
      console.error("Unauthorized or chat not found:", { chatId, senderId });
      throw new Error("Unauthorized or chat not found");
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
    await this.chatService.findChatByIdAndUpdate(chatId, {
      latestMessage: message._id,
    });
    console.log("latestMessage updated for chat:", chatId);
    return message;
  }

  async getMessagesByChatId(chatId: string) {
    console.log("get meesage servcie step 1");

    const response = await this.messageRepository.findByChatId(chatId);
    console.log("get meesage servcie step 2");
    return response;
  }

  async markMessagesAsRead(chatId: string, userId: string) {
    return await this.messageRepository.markAsRead(chatId, userId);
  }
}
