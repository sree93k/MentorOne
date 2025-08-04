import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { useContactNotifications } from "@/hooks/useContactNotifications";
import ContactNotificationBadge from "./ContactNotificationBadge";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  MessageSquare,
  BarChart3,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
  badge?: boolean;
}

const AdminSideBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Get contact notifications from Redux
  const { contactNotifications } = useSelector(
    (state: RootState) => state.admin
  );

  // Initialize contact notifications hook
  const { clearNotifications } = useContactNotifications();

  const sidebarItems: SidebarItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      path: "/admin/users",
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: Calendar,
      path: "/admin/bookings",
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: CreditCard,
      path: "/admin/transactions",
    },
    {
      id: "messages", // ✅ NEW: Contact messages
      label: "Messages",
      icon: MessageSquare,
      path: "/admin/messages",
      badge: contactNotifications.hasNewMessages,
    },
    {
      id: "appeals",
      label: "Appeals",
      icon: Shield,
      path: "/admin/appeals",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      path: "/admin/analytics",
    },
  ];

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const handleNavigation = (item: SidebarItem) => {
    navigate(item.path);

    // Clear contact notifications when visiting messages
    if (item.id === "messages") {
      clearNotifications();
    }
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logout clicked");
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-50 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Admin Panel
          </h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight
              size={20}
              className="text-gray-600 dark:text-gray-400"
            />
          ) : (
            <ChevronLeft
              size={20}
              className="text-gray-600 dark:text-gray-400"
            />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item)}
            className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 group ${
              isActive(item.path)
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-600"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <item.icon
                size={20}
                className={`transition-colors ${
                  isActive(item.path)
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                }`}
              />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </div>

            {/* Contact notification badge */}
            {item.id === "messages" && !isCollapsed && (
              <ContactNotificationBadge
                hasNewMessages={contactNotifications.hasNewMessages}
                onClick={() => {}} // Handled by parent button
                size={16}
              />
            )}

            {/* Collapsed state notification indicator */}
            {item.id === "messages" &&
              isCollapsed &&
              contactNotifications.hasNewMessages && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors ${
            isCollapsed ? "justify-center" : "space-x-3"
          }`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSideBar;
