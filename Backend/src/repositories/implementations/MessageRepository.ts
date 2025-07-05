// import { injectable } from "inversify";
// import { IMessageRepository } from "../interface/IMessageRepository";
// import { EMessage } from "../../entities/messageEntity";
// import Message from "../../models/messageModel";
// import BaseRepository from "./BaseRepository";

// @injectable()
// export default class MessageRepository
//   extends BaseRepository<EMessage>
//   implements IMessageRepository
// {
//   constructor() {
//     super(Message);
//   }

//   async findByChatId(chatId: string): Promise<EMessage[]> {
//     try {
//       return await this.model
//         .find({ chat: chatId })
//         .populate("sender", "firstName lastName profilePicture")
//         .populate("readBy", "firstName lastName")
//         .sort({ createdAt: 1 })
//         .exec();
//     } catch (error: any) {
//       throw new Error("Failed to find messages: " + error.message);
//     }
//   }

//   async markAsRead(
//     chatId: string,
//     userId: string
//   ): Promise<{ modifiedCount: number }> {
//     try {
//       const result = await this.model.updateMany(
//         { chat: chatId, readBy: { $ne: userId } },
//         { $addToSet: { readBy: userId } }
//       );
//       return { modifiedCount: result.modifiedCount };
//     } catch (error: any) {
//       throw new Error("Failed to mark messages as read: " + error.message);
//     }
//   }
// }
