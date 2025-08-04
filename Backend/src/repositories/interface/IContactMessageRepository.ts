// src/repositories/interface/IContactMessageRepository.ts
import {
  ContactMessage,
  AdminResponse,
  InternalNote,
  ContactStatistics,
} from "../../entities/ContactMessage";

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FilterOptions {
  status?: string;
  inquiryType?: string;
  priority?: string;
  assignedTo?: string;
  isRegisteredUser?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface IContactMessageRepository {
  create(message: Partial<ContactMessage>): Promise<ContactMessage>;
  findById(id: string): Promise<ContactMessage | null>;
  findAll(
    options: PaginationOptions,
    filters?: FilterOptions
  ): Promise<PaginatedResult<ContactMessage>>;
  update(
    id: string,
    updates: Partial<ContactMessage>
  ): Promise<ContactMessage | null>;
  delete(id: string): Promise<boolean>;
  markAsRead(id: string): Promise<ContactMessage | null>;
  markAsSeen(id: string): Promise<ContactMessage | null>;
  bulkMarkAsSeen(ids: string[]): Promise<number>;
  getUnreadCount(): Promise<number>;
  getUnseenCount(): Promise<number>;
  getStatistics(): Promise<ContactStatistics>;
  addResponse(
    id: string,
    response: AdminResponse
  ): Promise<ContactMessage | null>;
  addInternalNote(
    id: string,
    note: InternalNote
  ): Promise<ContactMessage | null>;
  search(
    query: string,
    options: PaginationOptions
  ): Promise<PaginatedResult<ContactMessage>>;
  findByEmailAndStatus(
    email: string,
    status: string
  ): Promise<ContactMessage[]>;
  findUnseenMessages(): Promise<ContactMessage[]>;
  findMessagesByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<ContactMessage[]>;
}
