export interface IMessageService {
  sendMessage(
    chatId: string,
    senderId: string,
    content: string,
    type: "text" | "image" | "audio",
    file?: Buffer
  ): Promise<any>; // Replace `any` with a `Message` entity type if available

  getMessagesByChatId(chatId: string): Promise<any[]>; // Replace `any` with `Message` type if available

  markMessagesAsRead(chatId: string, userId: string): Promise<any>; // Adjust return type if markAsRead has a specific result
}
