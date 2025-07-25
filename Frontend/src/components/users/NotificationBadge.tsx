import React from "react";
import { Bell } from "lucide-react";

interface NotificationBadgeProps {
  count: number;
  role: "mentor" | "mentee";
  onClick: () => void;
  size?: number;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  role,
  onClick,
  size = 24,
}) => {
  const getBadgeStyles = () => {
    const baseStyles =
      "absolute -top-1 -right-1 flex items-center justify-center text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] px-1 shadow-lg";

    if (role === "mentor") {
      return `${baseStyles} bg-red-500 border-2 border-white`;
    } else {
      return `${baseStyles} bg-blue-500 border-2 border-white`;
    }
  };

  const getBellStyles = () => {
    const baseStyles = "transition-colors duration-200";

    if (count > 0) {
      return role === "mentor"
        ? `${baseStyles} text-red-600 dark:text-red-400`
        : `${baseStyles} text-blue-600 dark:text-blue-400`;
    }

    return `${baseStyles} text-gray-600 dark:text-gray-400`;
  };

  const getDisplayCount = () => {
    if (count === 0) return null;
    if (count > 99) return "99+";
    return count.toString();
  };

  return (
    <div className="relative inline-block cursor-pointer" onClick={onClick}>
      <Bell size={size} className={getBellStyles()} />

      {count > 0 && (
        <>
          <div className={getBadgeStyles()}>
            <span className="leading-none">{getDisplayCount()}</span>
          </div>
          {/* ✅ Enhanced pulse animation */}
          <div
            className={`absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full animate-ping ${
              role === "mentor" ? "bg-red-500" : "bg-blue-500"
            } opacity-75`}
          />
        </>
      )}
    </div>
  );
};

export default NotificationBadge;
