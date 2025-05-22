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
}
