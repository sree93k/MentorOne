// src/services/implementation/ContactMessageService.ts
import { injectable, inject } from "inversify";
import {
  IContactMessageService,
  CreateContactMessageDTO,
  UpdateContactMessageDTO,
  ContactMessageFilters,
} from "../interface/IContactMessageService";
import {
  ContactMessage,
  AdminResponse,
  InternalNote,
  ContactStatistics,
} from "../../entities/ContactMessage";
import { ContactMessageRepository } from "../../repositories/implementations/ContactMessageRepository";
import {
  PaginationOptions,
  PaginatedResult,
} from "../../repositories/interface/IContactMessageRepository";
import { IUserService } from "../interface/IUserService";
import { ADMIN_CONFIG } from "../../config/adminConfig";
import { TYPES } from "../../inversify/types";

@injectable()
export class ContactMessageService implements IContactMessageService {
  private contactMessageRepository: ContactMessageRepository;
  private userService: IUserService;

  constructor(@inject(TYPES.IUserService) userService: IUserService) {
    this.userService = userService;
    // ✅ FIXED: Remove userService dependency from repository
    this.contactMessageRepository = new ContactMessageRepository();
  }

  async createMessage(data: CreateContactMessageDTO): Promise<ContactMessage> {
    try {
      // Validate required fields
      this.validateCreateMessageData(data);

      // ✅ FIXED: Check user registration at service level (proper architecture)
      const isRegisteredUser = await this.checkUserRegistrationStatus(
        data.email
      );
      console.log("ContactMessageService: User registration check result", {
        email: data.email,
        isRegisteredUser,
      });

      // Auto-assign priority based on inquiry type
      let priority: "low" | "medium" | "high" = "medium";

      switch (data.inquiryType) {
        case "support":
        case "partnership":
          priority = "high";
          break;
        case "mentorship":
        case "courses":
          priority = "medium";
          break;
        case "general":
        case "feedback":
          priority = "low";
          break;
        default:
          priority = "medium";
      }

      // ✅ FIXED: Include isRegisteredUser in message data
      const messageData: Partial<ContactMessage> = {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        phone: data.phone?.trim(),
        subject: data.subject.trim(),
        inquiryType: data.inquiryType as any,
        message: data.message.trim(),
        preferredContact: data.preferredContact as any,
        priority,
        status: "new",
        isRead: false,
        isSeen: false,
        attachments: data.attachments || [],
        isRegisteredUser, // ✅ Set the correct value
      };

      return await this.contactMessageRepository.create(messageData);
    } catch (error: any) {
      console.error("Service: Error creating contact message:", error);
      throw new Error(`Failed to create contact message: ${error.message}`);
    }
  }

  // ✅ NEW: Private method to check user registration status
  private async checkUserRegistrationStatus(email: string): Promise<boolean> {
    try {
      if (!email || typeof email !== "string") {
        console.log("ContactMessageService: Invalid email provided");
        return false;
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Use UserService to check registration
      const isRegistered = await this.userService.checkUserRegistrationByEmail(
        normalizedEmail
      );

      console.log("ContactMessageService: User registration check", {
        email: normalizedEmail,
        isRegistered,
      });

      return isRegistered;
    } catch (error: any) {
      console.error("ContactMessageService: Error checking user registration", {
        email,
        error: error.message,
      });
      // Default to false (guest user) on error
      return false;
    }
  }

  async getMessageById(id: string): Promise<ContactMessage> {
    try {
      this.validateId(id);

      const message = await this.contactMessageRepository.findById(id);
      if (!message) {
        throw new Error("Contact message not found");
      }
      return message;
    } catch (error: any) {
      console.error("Service: Error getting message by ID:", error);
      throw new Error(`Failed to get contact message: ${error.message}`);
    }
  }

  async getAllMessages(
    options: PaginationOptions,
    filters?: ContactMessageFilters
  ): Promise<PaginatedResult<ContactMessage>> {
    try {
      this.validatePaginationOptions(options);

      // Convert service filters to repository filters
      const repositoryFilters = this.convertFilters(filters);

      return await this.contactMessageRepository.findAllContactMessages(
        options,
        repositoryFilters
      );
    } catch (error: any) {
      console.error("Service: Error getting all messages:", error);
      throw new Error(`Failed to get contact messages: ${error.message}`);
    }
  }

  async updateMessage(
    id: string,
    updates: UpdateContactMessageDTO
  ): Promise<ContactMessage> {
    try {
      this.validateId(id);
      this.validateUpdateData(updates);

      const updated = await this.contactMessageRepository.update(id, updates);
      if (!updated) {
        throw new Error("Contact message not found");
      }
      return updated;
    } catch (error: any) {
      console.error("Service: Error updating message:", error);
      throw new Error(`Failed to update contact message: ${error.message}`);
    }
  }

  async deleteMessage(id: string): Promise<void> {
    try {
      this.validateId(id);

      const deleted = await this.contactMessageRepository.delete(id);
      if (!deleted) {
        throw new Error("Contact message not found");
      }
    } catch (error: any) {
      console.error("Service: Error deleting message:", error);
      throw new Error(`Failed to delete contact message: ${error.message}`);
    }
  }

  async markAsRead(id: string): Promise<ContactMessage> {
    try {
      this.validateId(id);

      const updated = await this.contactMessageRepository.markAsRead(id);
      if (!updated) {
        throw new Error("Contact message not found");
      }
      return updated;
    } catch (error: any) {
      console.error("Service: Error marking as read:", error);
      throw new Error(`Failed to mark message as read: ${error.message}`);
    }
  }

  async markAsSeen(id: string): Promise<ContactMessage> {
    try {
      this.validateId(id);

      const updated = await this.contactMessageRepository.markAsSeen(id);
      if (!updated) {
        throw new Error("Contact message not found");
      }
      return updated;
    } catch (error: any) {
      console.error("Service: Error marking as seen:", error);
      throw new Error(`Failed to mark message as seen: ${error.message}`);
    }
  }

  async bulkMarkAsSeen(ids: string[]): Promise<number> {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error("Invalid message IDs array");
      }

      ids.forEach((id) => this.validateId(id));

      return await this.contactMessageRepository.bulkMarkAsSeen(ids);
    } catch (error: any) {
      console.error("Service: Error bulk marking as seen:", error);
      throw new Error(`Failed to mark messages as seen: ${error.message}`);
    }
  }

  async getStatistics(): Promise<ContactStatistics> {
    try {
      return await this.contactMessageRepository.getStatistics();
    } catch (error: any) {
      console.error("Service: Error getting statistics:", error);
      throw new Error(`Failed to get statistics: ${error.message}`);
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      return await this.contactMessageRepository.getUnreadCount();
    } catch (error: any) {
      console.error("Service: Error getting unread count:", error);
      throw new Error(`Failed to get unread count: ${error.message}`);
    }
  }

  async getUnseenCount(): Promise<number> {
    try {
      return await this.contactMessageRepository.getUnseenCount();
    } catch (error: any) {
      console.error("Service: Error getting unseen count:", error);
      throw new Error(`Failed to get unseen count: ${error.message}`);
    }
  }

  //   async addResponse(
  //     id: string,
  //     adminId: string,
  //     adminName: string,
  //     message: string
  //   ): Promise<ContactMessage> {
  //     try {
  //       this.validateId(id);
  //       this.validateResponseData(adminId, adminName, message);

  //       const response: AdminResponse = {
  //         adminId: adminId.trim(),
  //         adminName: adminName.trim(),
  //         message: message.trim(),
  //         createdAt: new Date(),
  //       };

  //       const updated = await this.contactMessageRepository.addResponse(
  //         id,
  //         response
  //       );
  //       if (!updated) {
  //         throw new Error("Contact message not found");
  //       }

  //       // Auto-update status to in_progress when admin responds for the first time
  //       if (updated.status === "new") {
  //         await this.changeStatus(id, "in_progress");
  //         // Re-fetch the updated message
  //         return await this.getMessageById(id);
  //       }

  //       return updated;
  //     } catch (error: any) {
  //       console.error("Service: Error adding response:", error);
  //       throw new Error(`Failed to add response: ${error.message}`);
  //     }
  //   }

  // Updated addResponse method for ContactMessageService.ts
  async addResponse(
    id: string,
    adminId: string,
    adminName: string,
    message: string
  ): Promise<ContactMessage> {
    try {
      this.validateId(id);
      this.validateResponseData(adminId, adminName, message);

      // Get the original message first
      const originalMessage = await this.getMessageById(id);
      if (!originalMessage) {
        throw new Error("Contact message not found");
      }

      const response: AdminResponse = {
        adminId: adminId.trim(),
        adminName: adminName.trim(),
        message: message.trim(),
        createdAt: new Date(),
      };

      const updated = await this.contactMessageRepository.addResponse(
        id,
        response
      );
      if (!updated) {
        throw new Error("Contact message not found");
      }

      // Auto-update status to in_progress when admin responds for the first time
      if (updated.status === "new") {
        await this.changeStatus(id, "in_progress");
      }

      // ✅ NEW: Send response notifications and emails
      try {
        await this.sendResponseNotifications(updated, response);
      } catch (notificationError: any) {
        // ✅ Non-blocking: Log error but don't fail the response
        console.error("❌ Failed to send response notifications:", {
          contactMessageId: id,
          userEmail: updated.email,
          error: notificationError.message,
        });
        // Continue execution - admin response was successful
      }

      // Re-fetch the updated message if status was changed
      if (updated.status === "new") {
        return await this.getMessageById(id);
      }

      return updated;
    } catch (error: any) {
      console.error("Service: Error adding response:", error);
      throw new Error(`Failed to add response: ${error.message}`);
    }
  }

  // ✅ ADD THESE NEW METHODS TO YOUR ContactMessageService CLASS:

  private async sendResponseNotifications(
    contactMessage: ContactMessage,
    adminResponse: AdminResponse
  ): Promise<void> {
    console.log("📧 Sending response notifications for contact message:", {
      messageId: contactMessage._id,
      userEmail: contactMessage.email,
      userName: contactMessage.name,
    });

    try {
      // 1. Check if user is registered
      const isRegisteredUser =
        await this.userService.checkUserRegistrationByEmail(
          contactMessage.email
        );

      console.log("👤 User registration status:", {
        email: contactMessage.email,
        isRegistered: isRegisteredUser,
      });

      // 2. Send email to all users (registered + guests)
      await this.sendResponseEmail(contactMessage, adminResponse);

      // 3. Send socket notification only to registered users
      if (isRegisteredUser) {
        await this.sendResponseSocketNotification(
          contactMessage,
          adminResponse
        );
      }

      console.log("✅ Response notifications sent successfully");
    } catch (error: any) {
      console.error("❌ Error in sendResponseNotifications:", error);
      throw error;
    }
  }

  // ✅ NEW: Private method to send response email
  private async sendResponseEmail(
    contactMessage: ContactMessage,
    adminResponse: AdminResponse
  ): Promise<void> {
    try {
      console.log("📧 Sending response email to:", contactMessage.email);

      // Import the email functions
      const { sendMail, createContactResponseEmailTemplate } = await import(
        "../../utils/emailService"
      );

      // Create email content
      const emailHtml = createContactResponseEmailTemplate(
        contactMessage.name,
        contactMessage.subject,
        adminResponse.message,
        contactMessage.message
      );

      const emailSubject = `Re: ${contactMessage.subject} - MentorOne Support Response`;

      const emailText = `Dear ${contactMessage.name},

Thank you for contacting MentorOne Support. We've reviewed your inquiry and have a response for you.

Your Original Message:
Subject: ${contactMessage.subject}
${contactMessage.message}

MentorOne Support Response:
${adminResponse.message}

If you have any follow-up questions or need further assistance, please don't hesitate to reach out to us again.

Best regards,
MentorOne Support Team
Visit us at: ${process.env.CLIENT_HOST_URL || "https://mentorone.com"}`;

      // Send email using existing sendMail function
      const emailResult = await sendMail(
        contactMessage.email,
        emailText,
        contactMessage.name,
        emailSubject,
        emailHtml
      );

      if (emailResult) {
        console.log(
          "✅ Response email sent successfully to:",
          contactMessage.email
        );
      } else {
        console.error(
          "❌ Failed to send response email to:",
          contactMessage.email
        );
        throw new Error("Email delivery failed");
      }
    } catch (error: any) {
      console.error("❌ Error sending response email:", error);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }

  // ✅ NEW: Private method to send socket notification to registered users
  private async sendResponseSocketNotification(
    contactMessage: ContactMessage,
    adminResponse: AdminResponse
  ): Promise<void> {
    try {
      console.log(
        "🔔 Sending socket notification for registered user:",
        contactMessage.email
      );

      // Find the registered user to get their ID and roles
      const user = await this.userService.findUserWithEmail({
        email: contactMessage.email,
      });

      if (!user || !user._id) {
        console.log(
          "⚠️ Registered user not found, skipping socket notification"
        );
        return;
      }

      console.log("👤 Found registered user:", {
        userId: user._id,
        roles: user.role,
        name: `${user.firstName} ${user.lastName}`,
      });

      // Determine target role based on user's roles
      let targetRole: "mentor" | "mentee" | "both" = "both";

      if (user.role && Array.isArray(user.role)) {
        if (user.role.includes("mentor") && user.role.includes("mentee")) {
          targetRole = "both";
        } else if (user.role.includes("mentor")) {
          targetRole = "mentor";
        } else if (user.role.includes("mentee")) {
          targetRole = "mentee";
        }
      }

      console.log("🎯 Notification target role:", targetRole);

      // Import NotificationService
      const NotificationService = (
        await import("../implementations/NotificationService")
      ).default;
      const notificationService = new NotificationService();

      const notificationMessage = `You have received a response to your contact message: "${contactMessage.subject}"`;

      await notificationService.createNotification(
        user._id.toString(),
        "contact_response",
        notificationMessage,
        contactMessage._id?.toString(),
        undefined,
        {
          firstName: ADMIN_CONFIG.ADMIN_DISPLAY_NAME.firstName,
          lastName: ADMIN_CONFIG.ADMIN_DISPLAY_NAME.lastName,
          id: ADMIN_CONFIG.ADMIN_USER_ID,
        },
        targetRole
      );

      console.log(
        "✅ Socket notification sent successfully to user:",
        user._id
      );
    } catch (error: any) {
      console.error("❌ Error sending socket notification:", error);
      throw new Error(`Socket notification failed: ${error.message}`);
    }
  }

  async addInternalNote(
    id: string,
    adminId: string,
    adminName: string,
    note: string
  ): Promise<ContactMessage> {
    try {
      this.validateId(id);
      this.validateNoteData(adminId, adminName, note);

      const internalNote: InternalNote = {
        adminId: adminId.trim(),
        adminName: adminName.trim(),
        note: note.trim(),
        createdAt: new Date(),
      };

      const updated = await this.contactMessageRepository.addInternalNote(
        id,
        internalNote
      );
      if (!updated) {
        throw new Error("Contact message not found");
      }
      return updated;
    } catch (error: any) {
      console.error("Service: Error adding internal note:", error);
      throw new Error(`Failed to add internal note: ${error.message}`);
    }
  }

  async searchMessages(
    query: string,
    options: PaginationOptions
  ): Promise<PaginatedResult<ContactMessage>> {
    try {
      if (!query || query.trim().length < 2) {
        throw new Error("Search query must be at least 2 characters long");
      }

      this.validatePaginationOptions(options);

      return await this.contactMessageRepository.search(query.trim(), options);
    } catch (error: any) {
      console.error("Service: Error searching messages:", error);
      throw new Error(`Failed to search messages: ${error.message}`);
    }
  }

  async assignMessage(id: string, adminId: string): Promise<ContactMessage> {
    try {
      this.validateId(id);
      if (!adminId || adminId.trim().length === 0) {
        throw new Error("Admin ID is required");
      }

      return await this.updateMessage(id, { assignedTo: adminId.trim() });
    } catch (error: any) {
      console.error("Service: Error assigning message:", error);
      throw new Error(`Failed to assign message: ${error.message}`);
    }
  }

  async changeStatus(id: string, status: string): Promise<ContactMessage> {
    try {
      this.validateId(id);
      this.validateStatus(status);

      return await this.updateMessage(id, { status: status as any });
    } catch (error: any) {
      console.error("Service: Error changing status:", error);
      throw new Error(`Failed to change status: ${error.message}`);
    }
  }

  async changePriority(id: string, priority: string): Promise<ContactMessage> {
    try {
      this.validateId(id);
      this.validatePriority(priority);

      return await this.updateMessage(id, { priority: priority as any });
    } catch (error: any) {
      console.error("Service: Error changing priority:", error);
      throw new Error(`Failed to change priority: ${error.message}`);
    }
  }

  async bulkUpdateStatus(ids: string[], status: string): Promise<number> {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error("Invalid message IDs array");
      }

      this.validateStatus(status);
      ids.forEach((id) => this.validateId(id));

      let updatedCount = 0;
      for (const id of ids) {
        try {
          await this.changeStatus(id, status);
          updatedCount++;
        } catch (error) {
          console.error(`Failed to update status for message ${id}:`, error);
        }
      }

      return updatedCount;
    } catch (error: any) {
      console.error("Service: Error bulk updating status:", error);
      throw new Error(`Failed to bulk update status: ${error.message}`);
    }
  }

  async bulkDelete(ids: string[]): Promise<number> {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error("Invalid message IDs array");
      }

      ids.forEach((id) => this.validateId(id));

      let deletedCount = 0;
      for (const id of ids) {
        try {
          await this.deleteMessage(id);
          deletedCount++;
        } catch (error) {
          console.error(`Failed to delete message ${id}:`, error);
        }
      }

      return deletedCount;
    } catch (error: any) {
      console.error("Service: Error bulk deleting:", error);
      throw new Error(`Failed to bulk delete messages: ${error.message}`);
    }
  }

  async getMessagesByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<ContactMessage[]> {
    try {
      if (!startDate || !endDate) {
        throw new Error("Start date and end date are required");
      }

      if (startDate > endDate) {
        throw new Error("Start date cannot be after end date");
      }

      return await this.contactMessageRepository.findMessagesByDateRange(
        startDate,
        endDate
      );
    } catch (error: any) {
      console.error("Service: Error getting messages by date range:", error);
      throw new Error(`Failed to get messages by date range: ${error.message}`);
    }
  }

  async getMessageCountByInquiryType(): Promise<{ [key: string]: number }> {
    try {
      const messages =
        await this.contactMessageRepository.findAllContactMessages(
          { page: 1, limit: 999999 }, // Get all messages for counting
          {}
        );

      const counts: { [key: string]: number } = {};
      messages.data.forEach((message) => {
        counts[message.inquiryType] = (counts[message.inquiryType] || 0) + 1;
      });

      return counts;
    } catch (error: any) {
      console.error(
        "Service: Error getting message count by inquiry type:",
        error
      );
      throw new Error(
        `Failed to get message count by inquiry type: ${error.message}`
      );
    }
  }

  async getAverageResponseTime(): Promise<number> {
    try {
      const messages =
        await this.contactMessageRepository.findAllContactMessages(
          { page: 1, limit: 999999 },
          { status: "resolved" }
        );

      if (messages.data.length === 0) {
        return 0;
      }

      let totalResponseTime = 0;
      let messagesWithResponses = 0;

      messages.data.forEach((message) => {
        if (message.responses && message.responses.length > 0) {
          const firstResponse = message.responses[0];
          const responseTime =
            new Date(firstResponse.createdAt).getTime() -
            new Date(message.createdAt!).getTime();
          totalResponseTime += responseTime;
          messagesWithResponses++;
        }
      });

      if (messagesWithResponses === 0) {
        return 0;
      }

      // Return average response time in hours
      return totalResponseTime / messagesWithResponses / (1000 * 60 * 60);
    } catch (error: any) {
      console.error("Service: Error calculating average response time:", error);
      throw new Error(
        `Failed to calculate average response time: ${error.message}`
      );
    }
  }

  // Private validation methods
  private validateCreateMessageData(data: CreateContactMessageDTO): void {
    if (!data.name || data.name.trim().length < 2) {
      throw new Error("Name must be at least 2 characters long");
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      throw new Error("Valid email address is required");
    }

    if (!data.subject || data.subject.trim().length < 5) {
      throw new Error("Subject must be at least 5 characters long");
    }

    if (!data.inquiryType) {
      throw new Error("Inquiry type is required");
    }

    if (!data.message || data.message.trim().length < 10) {
      throw new Error("Message must be at least 10 characters long");
    }

    if (!data.preferredContact) {
      throw new Error("Preferred contact method is required");
    }

    if (!data.agreeToPrivacy) {
      throw new Error("Privacy policy agreement is required");
    }
  }

  private validateUpdateData(data: UpdateContactMessageDTO): void {
    if (
      data.status &&
      !["new", "in_progress", "resolved", "archived"].includes(data.status)
    ) {
      throw new Error("Invalid status value");
    }

    if (data.priority && !["low", "medium", "high"].includes(data.priority)) {
      throw new Error("Invalid priority value");
    }
  }

  private validatePaginationOptions(options: PaginationOptions): void {
    if (!options.page || options.page < 1) {
      throw new Error("Page must be a positive integer");
    }

    if (!options.limit || options.limit < 1 || options.limit > 100) {
      throw new Error("Limit must be between 1 and 100");
    }
  }

  private validateId(id: string): void {
    if (!id || typeof id !== "string" || id.trim().length === 0) {
      throw new Error("Valid ID is required");
    }
  }

  private validateResponseData(
    adminId: string,
    adminName: string,
    message: string
  ): void {
    if (!adminId || adminId.trim().length === 0) {
      throw new Error("Admin ID is required");
    }

    if (!adminName || adminName.trim().length === 0) {
      throw new Error("Admin name is required");
    }

    if (!message || message.trim().length < 1) {
      throw new Error("Response message is required");
    }

    if (message.length > 2000) {
      throw new Error("Response message is too long (max 2000 characters)");
    }
  }

  private validateNoteData(
    adminId: string,
    adminName: string,
    note: string
  ): void {
    if (!adminId || adminId.trim().length === 0) {
      throw new Error("Admin ID is required");
    }

    if (!adminName || adminName.trim().length === 0) {
      throw new Error("Admin name is required");
    }

    if (!note || note.trim().length < 1) {
      throw new Error("Note content is required");
    }

    if (note.length > 1000) {
      throw new Error("Note is too long (max 1000 characters)");
    }
  }

  private validateStatus(status: string): void {
    if (!["new", "in_progress", "resolved", "archived"].includes(status)) {
      throw new Error("Invalid status value");
    }
  }

  private validatePriority(priority: string): void {
    if (!["low", "medium", "high"].includes(priority)) {
      throw new Error("Invalid priority value");
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private convertFilters(filters?: ContactMessageFilters): any {
    if (!filters) return {};

    const converted: any = { ...filters };

    // Handle special filter conversions
    if (filters.onlyRegisteredUsers) {
      converted.isRegisteredUser = true;
      delete converted.onlyRegisteredUsers;
    }

    if (filters.onlyGuestUsers) {
      converted.isRegisteredUser = false;
      delete converted.onlyGuestUsers;
    }

    return converted;
  }
}

export default ContactMessageService;
