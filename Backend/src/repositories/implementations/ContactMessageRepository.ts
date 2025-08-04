import BaseRepository from "../implementations/BaseRepository";
import {
  IContactMessageRepository,
  PaginationOptions,
  FilterOptions,
  PaginatedResult,
} from "../interface/IContactMessageRepository";
import {
  ContactMessage,
  AdminResponse,
  InternalNote,
  ContactStatistics,
} from "../../entities/ContactMessage";
import ContactMessageModel from "../../models/ContactMessage";
import { IUserService } from "../../services/interface/IUserService";
import { FilterQuery } from "mongoose";

export class ContactMessageRepository
  extends BaseRepository<any>
  implements IContactMessageRepository
{
  private userService: IUserService;
  private userRegistrationCache: Map<
    string,
    { isRegistered: boolean; timestamp: number }
  > = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(userService: IUserService) {
    super(ContactMessageModel);
    this.userService = userService;
  }

  async create(message: Partial<ContactMessage>): Promise<ContactMessage> {
    try {
      // Check if user is registered with caching
      const isRegisteredUser = await this.checkUserRegistrationStatusCached(
        message.email!
      );

      const messageData = {
        ...message,
        isRegisteredUser,
      };

      const newMessage = new ContactMessageModel(messageData);
      const saved = await newMessage.save();
      return saved.toJSON();
    } catch (error: any) {
      console.error("Error creating contact message:", error);
      throw new Error(`Failed to create contact message: ${error.message}`);
    }
  }

  async findById(id: string): Promise<ContactMessage | null> {
    try {
      const message = await ContactMessageModel.findById(id).lean();
      return message as ContactMessage | null;
    } catch (error: any) {
      console.error("Error finding contact message by ID:", error);
      throw new Error(`Failed to find contact message: ${error.message}`);
    }
  }

  async findAll(
    options: PaginationOptions,
    filters?: FilterOptions
  ): Promise<PaginatedResult<ContactMessage>> {
    try {
      const { page, limit, sortBy = "createdAt", sortOrder = "desc" } = options;
      const skip = (page - 1) * limit;

      // Build filter query
      const filterQuery: FilterQuery<any> = {};

      if (filters) {
        if (filters.status) {
          filterQuery.status = filters.status;
        }

        if (filters.inquiryType) {
          filterQuery.inquiryType = filters.inquiryType;
        }

        if (filters.priority) {
          filterQuery.priority = filters.priority;
        }

        if (filters.assignedTo) {
          filterQuery.assignedTo = filters.assignedTo;
        }

        if (typeof filters.isRegisteredUser === "boolean") {
          filterQuery.isRegisteredUser = filters.isRegisteredUser;
        }

        if (filters.dateRange) {
          filterQuery.createdAt = {
            $gte: filters.dateRange.start,
            $lte: filters.dateRange.end,
          };
        }

        if (filters.search) {
          filterQuery.$or = [
            { name: { $regex: filters.search, $options: "i" } },
            { email: { $regex: filters.search, $options: "i" } },
            { subject: { $regex: filters.search, $options: "i" } },
            { message: { $regex: filters.search, $options: "i" } },
          ];
        }
      }

      const [data, totalItems] = await Promise.all([
        ContactMessageModel.find(filterQuery)
          .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        ContactMessageModel.countDocuments(filterQuery),
      ]);

      const totalPages = Math.ceil(totalItems / limit);

      return {
        data: data as ContactMessage[],
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error: any) {
      console.error("Error finding all contact messages:", error);
      throw new Error(`Failed to fetch contact messages: ${error.message}`);
    }
  }

  async update(
    id: string,
    updates: Partial<ContactMessage>
  ): Promise<ContactMessage | null> {
    try {
      const updated = await ContactMessageModel.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).lean();

      return updated as ContactMessage | null;
    } catch (error: any) {
      console.error("Error updating contact message:", error);
      throw new Error(`Failed to update contact message: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await ContactMessageModel.findByIdAndDelete(id);
      return !!result;
    } catch (error: any) {
      console.error("Error deleting contact message:", error);
      throw new Error(`Failed to delete contact message: ${error.message}`);
    }
  }

  async markAsRead(id: string): Promise<ContactMessage | null> {
    return this.update(id, { isRead: true });
  }

  async markAsSeen(id: string): Promise<ContactMessage | null> {
    return this.update(id, { isSeen: true });
  }

  async bulkMarkAsSeen(ids: string[]): Promise<number> {
    try {
      const result = await ContactMessageModel.updateMany(
        { _id: { $in: ids } },
        { isSeen: true, updatedAt: new Date() }
      );
      return result.modifiedCount;
    } catch (error: any) {
      console.error("Error bulk marking as seen:", error);
      throw new Error(`Failed to mark messages as seen: ${error.message}`);
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      return await ContactMessageModel.countDocuments({ isRead: false });
    } catch (error: any) {
      console.error("Error getting unread count:", error);
      throw new Error(`Failed to get unread count: ${error.message}`);
    }
  }

  async getUnseenCount(): Promise<number> {
    try {
      return await ContactMessageModel.countDocuments({ isSeen: false });
    } catch (error: any) {
      console.error("Error getting unseen count:", error);
      throw new Error(`Failed to get unseen count: ${error.message}`);
    }
  }

  async getStatistics(): Promise<ContactStatistics> {
    try {
      const stats = await ContactMessageModel.aggregate([
        {
          $group: {
            _id: null,
            totalMessages: { $sum: 1 },
            unseenCount: {
              $sum: { $cond: [{ $eq: ["$isSeen", false] }, 1, 0] },
            },
            unreadCount: {
              $sum: { $cond: [{ $eq: ["$isRead", false] }, 1, 0] },
            },
            newMessages: {
              $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] },
            },
            inProgressMessages: {
              $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] },
            },
            resolvedMessages: {
              $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] },
            },
            registeredUserMessages: {
              $sum: { $cond: [{ $eq: ["$isRegisteredUser", true] }, 1, 0] },
            },
            guestUserMessages: {
              $sum: { $cond: [{ $eq: ["$isRegisteredUser", false] }, 1, 0] },
            },
          },
        },
      ]);

      const result = stats[0] || {
        totalMessages: 0,
        unseenCount: 0,
        unreadCount: 0,
        newMessages: 0,
        inProgressMessages: 0,
        resolvedMessages: 0,
        registeredUserMessages: 0,
        guestUserMessages: 0,
      };

      return {
        ...result,
        hasNewMessages: result.unseenCount > 0,
      };
    } catch (error: any) {
      console.error("Error getting statistics:", error);
      throw new Error(`Failed to get statistics: ${error.message}`);
    }
  }

  async addResponse(
    id: string,
    response: AdminResponse
  ): Promise<ContactMessage | null> {
    try {
      const updated = await ContactMessageModel.findByIdAndUpdate(
        id,
        {
          $push: { responses: response },
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      ).lean();

      return updated as ContactMessage | null;
    } catch (error: any) {
      console.error("Error adding response:", error);
      throw new Error(`Failed to add response: ${error.message}`);
    }
  }

  async addInternalNote(
    id: string,
    note: InternalNote
  ): Promise<ContactMessage | null> {
    try {
      const updated = await ContactMessageModel.findByIdAndUpdate(
        id,
        {
          $push: { internalNotes: note },
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      ).lean();

      return updated as ContactMessage | null;
    } catch (error: any) {
      console.error("Error adding internal note:", error);
      throw new Error(`Failed to add internal note: ${error.message}`);
    }
  }

  async search(
    query: string,
    options: PaginationOptions
  ): Promise<PaginatedResult<ContactMessage>> {
    try {
      const { page, limit, sortBy = "createdAt", sortOrder = "desc" } = options;
      const skip = (page - 1) * limit;

      const searchQuery = {
        $text: { $search: query },
      };

      const [data, totalItems] = await Promise.all([
        ContactMessageModel.find(searchQuery, { score: { $meta: "textScore" } })
          .sort({
            score: { $meta: "textScore" },
            [sortBy]: sortOrder === "asc" ? 1 : -1,
          })
          .skip(skip)
          .limit(limit)
          .lean(),
        ContactMessageModel.countDocuments(searchQuery),
      ]);

      const totalPages = Math.ceil(totalItems / limit);

      return {
        data: data as ContactMessage[],
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error: any) {
      console.error("Error searching contact messages:", error);
      throw new Error(`Failed to search contact messages: ${error.message}`);
    }
  }

  async findByEmailAndStatus(
    email: string,
    status: string
  ): Promise<ContactMessage[]> {
    try {
      const messages = await ContactMessageModel.find({
        email: email.toLowerCase(),
        status,
      })
        .sort({ createdAt: -1 })
        .lean();

      return messages as ContactMessage[];
    } catch (error: any) {
      console.error("Error finding messages by email and status:", error);
      throw new Error(`Failed to find messages: ${error.message}`);
    }
  }

  async findUnseenMessages(): Promise<ContactMessage[]> {
    try {
      const messages = await ContactMessageModel.find({ isSeen: false })
        .sort({ createdAt: -1 })
        .lean();

      return messages as ContactMessage[];
    } catch (error: any) {
      console.error("Error finding unseen messages:", error);
      throw new Error(`Failed to find unseen messages: ${error.message}`);
    }
  }

  async findMessagesByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<ContactMessage[]> {
    try {
      const messages = await ContactMessageModel.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
        .sort({ createdAt: -1 })
        .lean();

      return messages as ContactMessage[];
    } catch (error: any) {
      console.error("Error finding messages by date range:", error);
      throw new Error(
        `Failed to find messages by date range: ${error.message}`
      );
    }
  }

  // Private method for cached user registration checking
  private async checkUserRegistrationStatusCached(
    email: string
  ): Promise<boolean> {
    try {
      const normalizedEmail = email.toLowerCase();
      const cached = this.userRegistrationCache.get(normalizedEmail);
      const now = Date.now();

      // Return cached result if still valid
      if (cached && now - cached.timestamp < this.CACHE_TTL) {
        return cached.isRegistered;
      }

      // Fetch from UserService
      const isRegistered = await this.userService.checkUserRegistrationByEmail(
        normalizedEmail
      );

      // Cache the result
      this.userRegistrationCache.set(normalizedEmail, {
        isRegistered,
        timestamp: now,
      });

      // Clean old cache entries periodically
      this.cleanupCache();

      return isRegistered;
    } catch (error: any) {
      console.error("Error checking user registration status:", error);
      // Default to false (guest user) if error
      return false;
    }
  }

  // Private method to cleanup expired cache entries
  private cleanupCache(): void {
    const now = Date.now();
    for (const [email, data] of this.userRegistrationCache.entries()) {
      if (now - data.timestamp > this.CACHE_TTL) {
        this.userRegistrationCache.delete(email);
      }
    }
  }

  // Method to invalidate cache when user registration changes
  public invalidateUserCache(email: string): void {
    this.userRegistrationCache.delete(email.toLowerCase());
  }

  // Method to clear all cache
  public clearCache(): void {
    this.userRegistrationCache.clear();
  }
}
