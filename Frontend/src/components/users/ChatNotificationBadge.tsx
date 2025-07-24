import React from "react";
import { Send } from "lucide-react";

interface ChatNotificationBadgeProps {
  count: number;
  role: "mentor" | "mentee";
  onClick: () => void;
  size?: number;
}

const ChatNotificationBadge: React.FC<ChatNotificationBadgeProps> = ({
  count,
  role,
  onClick,
  size = 24,
}) => {
  const baseStyles =
    "absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full text-xs font-bold text-white flex items-center justify-center";

  const getBadgeStyles = () => {
    if (role === "mentor") {
      return `${baseStyles} bg-red-500 border-2 border-white shadow-lg`;
    } else {
      return `${baseStyles} bg-blue-500 border-2 border-white shadow-lg`;
    }
  };

  const displayCount = count > 9 ? "9+" : count.toString();

  return (
    <div className="relative inline-block">
      <button onClick={onClick} className="relative">
        <Send size={size} className="text-gray-600 dark:text-gray-300" />
        {count > 0 && <span className={getBadgeStyles()}>{displayCount}</span>}
      </button>
    </div>
  );
};

export default ChatNotificationBadge;
