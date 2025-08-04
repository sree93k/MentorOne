// // types/contact.ts
// export interface ContactFormData {
//   name: string;
//   email: string;
//   phone: string;
//   subject: string;
//   inquiryType: string;
//   message: string;
//   preferredContact: "email" | "phone" | "whatsapp";
//   agreeToPrivacy: boolean;
//   company?: string;
//   website?: string;
// }

// export interface ContactInfo {
//   email: string;
//   phone: string;
//   address: string;
//   hours: string;
//   emergencyPhone?: string;
//   fax?: string;
//   coordinates: {
//     lat: number;
//     lng: number;
//   };
// }

// export interface SocialLinks {
//   facebook?: string;
//   twitter?: string;
//   linkedin?: string;
//   instagram?: string;
//   youtube?: string;
//   github?: string;
// }

// export interface ContactResponse {
//   success: boolean;
//   message: string;
//   data?: any;
//   errors?: Record<string, string>;
// }

// export interface FormErrors {
//   [key: string]: string;
// }

// export interface BusinessHours {
//   day: string;
//   hours: string;
//   isToday: boolean;
//   isOpen: boolean;
// }

// export interface QuickAction {
//   label: string;
//   icon: React.ComponentType;
//   onClick: () => void;
//   color: string;
//   disabled?: boolean;
// }

// // Map related types
// export interface MapMarker {
//   position: [number, number];
//   title: string;
//   description: string;
//   icon?: L.Icon;
// }

// export interface MapProps {
//   center: [number, number];
//   zoom: number;
//   markers: MapMarker[];
//   height?: string;
//   className?: string;
// }
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
