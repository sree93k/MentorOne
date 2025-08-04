// src/types/contact.ts
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  inquiryType:
    | "general"
    | "mentorship"
    | "courses"
    | "partnership"
    | "support"
    | "feedback"
    | "media";
  message: string;
  preferredContact: "email" | "phone" | "whatsapp";
  agreeToPrivacy: boolean;
  attachments?: string[];
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface ContactMessage {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  inquiryType: string;
  message: string;
  preferredContact: string;
  status: "new" | "in_progress" | "resolved" | "archived";
  priority: "low" | "medium" | "high";
  assignedTo?: string;
  attachments?: string[];
  responses?: AdminResponse[];
  internalNotes?: InternalNote[];
  isRead: boolean;
  isSeen: boolean;
  isRegisteredUser: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AdminResponse {
  _id?: string;
  adminId: string;
  adminName: string;
  message: string;
  createdAt: Date;
}

export interface InternalNote {
  _id?: string;
  adminId: string;
  adminName: string;
  note: string;
  createdAt: Date;
}

export interface ContactStatistics {
  unseenCount: number;
  unreadCount: number;
  hasNewMessages: boolean;
  totalMessages: number;
  newMessages: number;
  inProgressMessages: number;
  resolvedMessages: number;
  registeredUserMessages: number;
  guestUserMessages: number;
}

export interface ContactFilters {
  status?: string;
  inquiryType?: string;
  priority?: string;
  assignedTo?: string;
  isRegisteredUser?: boolean;
  startDate?: string;
  endDate?: string;
  search?: string;
}
