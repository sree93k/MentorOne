import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

interface ContactInfoProps {
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    hours: string;
  };
  officeLocation: [number, number];
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  contactInfo,
  officeLocation,
}) => {
  const contactMethods = [
    {
      icon: Phone,
      label: "Phone",
      value: contactInfo.phone,
      href: `tel:${contactInfo.phone}`,
      color: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
    },
    {
      icon: Mail,
      label: "Email",
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
      color:
        "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
    },
    {
      icon: MapPin,
      label: "Address",
      value: contactInfo.address,
      href: "#",
      color:
        "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
    },
    {
      icon: Clock,
      label: "Business Hours",
      value: "Mon-Sat: 9AM-6PM | Sun: Closed",
      href: "#",
      color:
        "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-xl border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {contactMethods.map((method, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${method.color}`}
            >
              <method.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {method.label}
              </p>
              {method.href.startsWith("tel:") ||
              method.href.startsWith("mailto:") ? (
                <a
                  href={method.href}
                  className="text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {method.value}
                </a>
              ) : (
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-relaxed">
                  {method.value}
                </p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ContactInfo;
