import { EChat } from "../../entities/chatEntity";

export interface IChatService {
  createChat(
    bookingId: string,
    menteeId: string,
    mentorId: string
  ): Promise<any>; // Replace `any` with your `Chat` entity type if available

  getChatsByUserAndRole(
    userId: string,
    role: "mentee" | "mentor"
  ): Promise<any[]>; // Replace `any` with your `Chat` entity type if available
  getUserOnlineStatus(mentorId: string): Promise<Boolean | null>;
  updateByBookingId(
    bookingId: string,
    isActive: boolean
  ): Promise<EChat | null>;
  findChatById(chatId: string): Promise<EChat | null>;
  findChatByIdAndUpdate(
    chatId: string,
    data: Partial<EChat>
  ): Promise<EChat | null>;
}
