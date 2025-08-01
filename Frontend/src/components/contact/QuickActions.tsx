// components/contact/QuickActions.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, ExternalLink, Mail } from "lucide-react";

interface QuickActionsProps {
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    hours: string;
  };
  officeLocation: [number, number];
}

const QuickActions: React.FC<QuickActionsProps> = ({
  contactInfo,
  officeLocation,
}) => {
  const quickActions = [
    {
      label: "WhatsApp Us",
      icon: MessageCircle,
      onClick: () => {
        const phoneNumber = contactInfo.phone.replace(/\s/g, "");
        window.open(`https://wa.me/${6282155102}`, "_blank");
      },
      color:
        "hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400",
    },
    {
      label: "Get Directions",
      icon: ExternalLink,
      onClick: () => {
        window.open(
          `https://maps.google.com/?q=${officeLocation[0]},${officeLocation[1]}`,
          "_blank"
        );
      },
      color:
        "hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400",
    },

    {
      label: "Send Email",
      icon: Mail,
      onClick: () => {
        window.location.href = `mailto:${contactInfo.email}`;
      },
      color:
        "hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-900/20 dark:hover:text-orange-400",
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
      <CardContent className="pt-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="space-y-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`w-full justify-start transition-all duration-200 ${action.color}`}
              onClick={action.onClick}
            >
              <action.icon className="w-4 h-4 mr-2" />
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
