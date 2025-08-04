// src/services/interface/IContactMessageService.ts
import {
  ContactMessage,
  AdminResponse,
  InternalNote,
  ContactStatistics,
} from "../../entities/ContactMessage";
import {
  PaginationOptions,
  PaginatedResult,
} from "../../repositories/interface/IContactMessageRepository";

export interface CreateContactMessageDTO {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  inquiryType: string;
  message: string;
  preferredContact: string;
  agreeToPrivacy: boolean;
  attachments?: string[];
  isRegisteredUser?: boolean;
}

export interface UpdateContactMessageDTO {
  status?: string;
  priority?: string;
  assignedTo?: string;
  isRead?: boolean;
  isSeen?: boolean;
}

export interface ContactMessageFilters {
  status?: string;
  inquiryType?: string;
  priority?: string;
  assignedTo?: string;
  isRegisteredUser?: boolean;
  onlyRegisteredUsers?: boolean;
  onlyGuestUsers?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface IContactMessageService {
  createMessage(data: CreateContactMessageDTO): Promise<ContactMessage>;
  getMessageById(id: string): Promise<ContactMessage>;
  getAllMessages(
    options: PaginationOptions,
    filters?: ContactMessageFilters
  ): Promise<PaginatedResult<ContactMessage>>;
  updateMessage(
    id: string,
    updates: UpdateContactMessageDTO
  ): Promise<ContactMessage>;
  deleteMessage(id: string): Promise<void>;
  markAsRead(id: string): Promise<ContactMessage>;
  markAsSeen(id: string): Promise<ContactMessage>;
  bulkMarkAsSeen(ids: string[]): Promise<number>;
  getStatistics(): Promise<ContactStatistics>;
  getUnreadCount(): Promise<number>;
  getUnseenCount(): Promise<number>;
  addResponse(
    id: string,
    adminId: string,
    adminName: string,
    message: string
  ): Promise<ContactMessage>;
  addInternalNote(
    id: string,
    adminId: string,
    adminName: string,
    note: string
  ): Promise<ContactMessage>;
  searchMessages(
    query: string,
    options: PaginationOptions
  ): Promise<PaginatedResult<ContactMessage>>;
  assignMessage(id: string, adminId: string): Promise<ContactMessage>;
  changeStatus(id: string, status: string): Promise<ContactMessage>;
  changePriority(id: string, priority: string): Promise<ContactMessage>;
  bulkUpdateStatus(ids: string[], status: string): Promise<number>;
  bulkDelete(ids: string[]): Promise<number>;
  getMessagesByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<ContactMessage[]>;
  getMessageCountByInquiryType(): Promise<{ [key: string]: number }>;
  getAverageResponseTime(): Promise<number>;
}
