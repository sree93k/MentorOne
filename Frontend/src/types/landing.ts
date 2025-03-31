export interface NavItem {
  label: string;
  href: string;
}

export interface HeaderProps {
  navItems?: NavItem[];
  isAuthenticated?: boolean;
  onLogin?: () => void;
  onRegister?: () => void;
}

export interface FooterProps {
  companyName?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  quickLinks?: { label: string; href: string }[];
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}
