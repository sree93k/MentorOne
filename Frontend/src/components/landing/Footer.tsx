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
      className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-white/10"
      aria-label={label}
    >
      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
    </a>
  );

  return (
    <footer className="bg-black text-white pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-4 sm:pb-6 mt-12 sm:mt-16 md:mt-20 lg:mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
          {/* Company Info */}
          <div className="space-y-4 sm:space-y-6 text-center md:text-left">
            <div className="flex items-center gap-2 sm:gap-3 justify-center md:justify-start">
              <img
                src={Logo1}
                alt={companyName}
                className="h-8 sm:h-10 md:h-12 w-auto"
              />
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
                {companyName}
              </h2>
            </div>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-sm mx-auto md:mx-0">
              Empowering mentorship connections and fostering professional
              growth through our innovative platform.
            </p>
            {/* Social Links */}
            <div className="flex gap-2 sm:gap-3 justify-center md:justify-start">
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
          <div className="text-center md:text-left">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6">
              Quick Links
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-w-sm mx-auto md:mx-0">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm sm:text-base py-1 hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left lg:col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6">
              Contact Us
            </h3>
            <div className="space-y-3 sm:space-y-4 max-w-sm mx-auto md:mx-0">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="flex-shrink-0 p-2 bg-white/10 rounded-full">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" />
                </div>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                >
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="flex-shrink-0 p-2 bg-white/10 rounded-full">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" />
                </div>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                >
                  {contactInfo.email}
                </a>
              </div>
              <div className="flex items-start gap-3 justify-center md:justify-start">
                <div className="flex-shrink-0 p-2 bg-white/10 rounded-full mt-1">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" />
                </div>
                <span className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  {contactInfo.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section (Optional) */}
        <div className="mt-8 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">
              Stay Updated
            </h3>
            <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
              Subscribe to our newsletter for the latest mentorship
              opportunities and career tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 sm:py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base font-medium">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="border-t border-white/10 mt-6 sm:mt-8 lg:mt-12 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <p className="text-gray-400 text-xs sm:text-sm">
              © {new Date().getFullYear()} {companyName}. All rights reserved to
              Sreekuttan N.
            </p>

            {/* Additional Footer Links */}
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-xs sm:text-sm"
          >
            Back to Top ↑
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
