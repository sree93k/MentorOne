// src/components/admin/ContactNotificationBadge.tsx
import React from "react";
import { MessageSquare } from "lucide-react";

interface ContactNotificationBadgeProps {
  hasNewMessages: boolean;
  onClick: () => void;
  size?: number;
  className?: string;
}

const ContactNotificationBadge: React.FC<ContactNotificationBadgeProps> = ({
  hasNewMessages,
  onClick,
  size = 20,
  className = "",
}) => {
  const getBellStyles = () => {
    const baseStyles = "transition-all duration-200";

    if (hasNewMessages) {
      return `${baseStyles} text-green-600 dark:text-green-400`;
    }

    return `${baseStyles} text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300`;
  };

  return (
    <div
      className={`relative inline-block cursor-pointer ${className}`}
      onClick={onClick}
    >
      <MessageSquare size={size} className={getBellStyles()} />

      {hasNewMessages && (
        <>
          {/* Green dot indicator */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full shadow-sm" />

          {/* Pulse animation */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75" />
        </>
      )}
    </div>
  );
};

export default ContactNotificationBadge;
