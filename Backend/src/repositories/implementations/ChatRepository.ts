// import { injectable } from "inversify";
// import { IChatRepository } from "../interface/IChatRepository";
// import { EChat } from "../../entities/chatEntity";
// import Chat from "../../models/chatModel";
// import BaseRepository from "../implementations/BaseRepository";

// @injectable()
// export default class ChatRepository
//   extends BaseRepository<EChat>
//   implements IChatRepository
// {
//   constructor() {
//     super(Chat);
//   }

//   async findByIdAndUpdate(
//     id: string,
//     update: Partial<EChat>
//   ): Promise<EChat | null> {
//     try {
//       return await this.model
//         .findByIdAndUpdate(id, update, { new: true })
//         .populate("users", "firstName lastName profilePicture")
//         .populate("latestMessage")
//         .exec();
//     } catch (error: any) {
//       throw new Error("Failed to update chat: " + error.message);
//     }
//   }

//   async findByUserAndRole(
//     userId: string,
//     role: "mentee" | "mentor"
//   ): Promise<EChat[]> {
//     try {
//       const chats = await this.model
//         .find({
//           "roles.userId": userId,
//           "roles.role": role,
//         })
//         .populate("users", "firstName lastName profilePicture")
//         .populate("latestMessage")
//         .sort({ updatedAt: -1 })
//         .exec();

//       return chats.map((chat) => {
//         const otherRole = role === "mentee" ? "mentor" : "mentee";
//         const otherUser = chat.roles.find((r) => r.role === otherRole);
//         return {
//           ...chat.toObject(),
//           otherUserId: otherUser?.userId.toString() || null,
//         };
//       });
//     } catch (error: any) {
//       throw new Error("Failed to find chats: " + error.message);
//     }
//   }

//   async findByBookingId(bookingId: string): Promise<EChat | null> {
//     try {
//       return await this.model
//         .findOne({ bookingId })
//         .populate("users", "firstName lastName profilePicture")
//         .populate("latestMessage")
//         .exec();
//     } catch (error: any) {
//       throw new Error("Failed to find chat: " + error.message);
//     }
//   }

//   async updateByBookingId(
//     bookingId: string,
//     isActive: boolean
//   ): Promise<EChat | null> {
//     try {
//       return await this.model
//         .findOneAndUpdate({ bookingId }, { $set: { isActive } }, { new: true })
//         .exec();
//     } catch (error: any) {
//       throw new Error("Failed to update chat: " + error.message);
//     }
//   }

//   async findByUsersAndRoles(
//     menteeId: string,
//     mentorId: string
//   ): Promise<EChat | null> {
//     try {
//       return await this.model
//         .findOne({
//           roles: {
//             $all: [
//               { $elemMatch: { userId: menteeId, role: "mentee" } },
//               { $elemMatch: { userId: mentorId, role: "mentor" } },
//             ],
//           },
//         })
//         .populate("users", "firstName lastName profilePicture")
//         .populate("latestMessage")
//         .exec();
//     } catch (error: any) {
//       throw new Error(
//         "Failed to find chat by users and roles: " + error.message
//       );
//     }
//   }

//   async updateByUsersAndRoles(
//     menteeId: string,
//     mentorId: string,
//     update: { isActive: boolean; bookingId: string }
//   ): Promise<EChat | null> {
//     try {
//       const chat = await this.model
//         .findOneAndUpdate(
//           {
//             roles: {
//               $all: [
//                 { $elemMatch: { userId: menteeId, role: "mentee" } },
//                 { $elemMatch: { userId: mentorId, role: "mentor" } },
//               ],
//             },
//           },
//           {
//             $set: {
//               isActive: update.isActive,
//               bookingId: update.bookingId,
//             },
//           },
//           { new: true }
//         )
//         .populate("users", "firstName lastName profilePicture")
//         .populate("latestMessage")
//         .exec();

//       if (!chat) {
//         throw new Error("Chat not found for the provided users and roles");
//       }

//       return chat;
//     } catch (error: any) {
//       throw new Error("Failed to update chat: " + error.message);
//     }
//   }
// }
