import React from "react";
import { Link } from "react-router-dom";
import { Video } from "lucide-react";

interface HeaderProps {
  variant?: "home" | "meeting";
}

const Header: React.FC<HeaderProps> = ({ variant = "home" }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-sm">
      <Link to="/" className="flex items-center space-x-2">
        <Video className="h-6 w-6 text-primary-500" />
        <span className="text-xl font-medium text-neutral-800">MeetUp</span>
      </Link>

      {variant === "home" && (
        <div className="flex items-center space-x-4">
          <button className="btn-secondary">Sign in</button>
          <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
            <span className="text-neutral-600 text-sm">?</span>
          </div>
        </div>
      )}

      {variant === "meeting" && (
        <div className="flex items-center space-x-2">
          <div className="text-sm text-neutral-600 font-medium">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
            <span className="text-neutral-600 text-sm">?</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
