// src/components/landing/Footer.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

import { FooterProps } from "@/types/landing";
import Logo1 from "../../assets/logo1.png";

const defaultQuickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Features", href: "/features" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const Footer: React.FC<FooterProps> = ({
  companyName = "Mentor One",
  socialLinks = {},
  quickLinks = defaultQuickLinks,
  contactInfo = {
    email: "contact@mentorone.com",
    phone: "091 6282155102",
    address:
      "123 Mentorship Street, Kinfra Techno Park, Kakkanchery, Kerala 673634",
  },
}) => {
  const SocialIcon = ({
    icon: Icon,
    href,
    label,
  }: {
    icon: React.ElementType;
    href?: string;
    label: string;
  }) => (
    <a
      href={href || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-white transition-colors"
      aria-label={label}
    >
      <Icon className="w-5 h-5" />
    </a>
  );

  return (
    <footer className="bg-black text-white pt-24 pb-4 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={Logo1} alt={companyName} className="h-10 w-auto" />
              <h2 className="text-xl font-semibold">{companyName}</h2>
            </div>
            <p className="text-gray-400 max-w-[90%] text-sm">
              Empowering mentorship connections and fostering professional
              growth through our innovative platform.
            </p>
            <div className="flex gap-4">
              {socialLinks.facebook && (
                <SocialIcon
                  icon={Facebook}
                  href={socialLinks.facebook}
                  label="Facebook"
                />
              )}
              {socialLinks.twitter && (
                <SocialIcon
                  icon={Twitter}
                  href={socialLinks.twitter}
                  label="Twitter"
                />
              )}
              {socialLinks.linkedin && (
                <SocialIcon
                  icon={Linkedin}
                  href={socialLinks.linkedin}
                  label="LinkedIn"
                />
              )}
              {socialLinks.instagram && (
                <SocialIcon
                  icon={Instagram}
                  href={socialLinks.instagram}
                  label="Instagram"
                />
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-white/70" />
                <span className="text-gray-400 text-sm">
                  {contactInfo.phone}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-white/70" />
                <span className="text-gray-400 text-sm">
                  {contactInfo.email}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-white/70" />
                <span className="text-gray-400 text-sm">
                  {contactInfo.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-6 pt-4 text-center">
          <p className="text-gray-400 text-sm">
            {new Date().getFullYear()} {companyName}. All rights reserved to
            Sreekuttan N.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
