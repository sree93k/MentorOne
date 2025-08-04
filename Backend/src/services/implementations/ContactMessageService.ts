// src/services/implementation/ContactMessageService.ts
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

export class ContactMessageService implements IContactMessageService {
  private contactMessageRepository: ContactMessageRepository;
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
    this.contactMessageRepository = new ContactMessageRepository(userService);
  }

  async createMessage(data: CreateContactMessageDTO): Promise<ContactMessage> {
    try {
      // Validate required fields
      this.validateCreateMessageData(data);

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
      };

      return await this.contactMessageRepository.create(messageData);
    } catch (error: any) {
      console.error("Service: Error creating contact message:", error);
      throw new Error(`Failed to create contact message: ${error.message}`);
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

      return await this.contactMessageRepository.findAll(
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

  async addResponse(
    id: string,
    adminId: string,
    adminName: string,
    message: string
  ): Promise<ContactMessage> {
    try {
      this.validateId(id);
      this.validateResponseData(adminId, adminName, message);

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
        // Re-fetch the updated message
        return await this.getMessageById(id);
      }

      return updated;
    } catch (error: any) {
      console.error("Service: Error adding response:", error);
      throw new Error(`Failed to add response: ${error.message}`);
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
      const messages = await this.contactMessageRepository.findAll(
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
      const messages = await this.contactMessageRepository.findAll(
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
