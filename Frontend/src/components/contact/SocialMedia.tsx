// components/contact/SocialMedia.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Github,
} from "lucide-react";

interface SocialMediaProps {
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    github?: string;
  };
}

const SocialMedia: React.FC<SocialMediaProps> = ({ socialLinks = {} }) => {
  const defaultSocialLinks = [
    {
      icon: Twitter,
      href: socialLinks.twitter || "https://twitter.com/mentorone",
      label: "Twitter",
      color: "hover:text-blue-400",
    },
    {
      icon: Linkedin,
      href: socialLinks.linkedin || "https://linkedin.com/company/mentorone",
      label: "LinkedIn",
      color: "hover:text-blue-700",
    },
    {
      icon: Instagram,
      href: socialLinks.instagram || "https://instagram.com/mentorone",
      label: "Instagram",
      color: "hover:text-pink-600",
    },
    {
      icon: Youtube,
      href: socialLinks.youtube || "https://youtube.com/@mentorone",
      label: "YouTube",
      color: "hover:text-red-600",
    },
  ];

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-xl border-0">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
          Follow Us
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {defaultSocialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 ${social.color} transition-all duration-300 hover:scale-110 transform shadow-md hover:shadow-lg`}
              aria-label={social.label}
            >
              <social.icon className="w-6 h-6" />
            </a>
          ))}
        </div>
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Stay updated with our latest mentorship opportunities, success
            stories, and career tips!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMedia;
