// types/contact.ts
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  inquiryType: string;
  message: string;
  preferredContact: "email" | "phone" | "whatsapp";
  agreeToPrivacy: boolean;
  company?: string;
  website?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  hours: string;
  emergencyPhone?: string;
  fax?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  github?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: Record<string, string>;
}

export interface FormErrors {
  [key: string]: string;
}

export interface BusinessHours {
  day: string;
  hours: string;
  isToday: boolean;
  isOpen: boolean;
}

export interface QuickAction {
  label: string;
  icon: React.ComponentType;
  onClick: () => void;
  color: string;
  disabled?: boolean;
}

// Map related types
export interface MapMarker {
  position: [number, number];
  title: string;
  description: string;
  icon?: L.Icon;
}

export interface MapProps {
  center: [number, number];
  zoom: number;
  markers: MapMarker[];
  height?: string;
  className?: string;
}
