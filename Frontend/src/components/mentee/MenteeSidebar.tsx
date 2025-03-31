import {
  Home,
  FileText,
  Phone,
  Clock,
  Bell,
  LogOut,
  ChevronDown,
  UserCircle2,
} from "lucide-react";
import { useState, useRef } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogoutConfirmationModal } from "@/components/modal/Logout";
import { logoutUser } from "@/services/userAuthService";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const SidebarItem = ({
  icon: Icon,
  text,
  isExpanded,
  active = false,
  onClick,
}: {
  icon: any;
  text: string;
  isExpanded: boolean;
  active?: boolean;
  onClick?: () => void;
}) => (
  <div
    className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
      active ? "bg-gray-100" : "hover:bg-gray-100"
    }`}
    onClick={onClick}
  >
    <Icon size={24} className={active ? "text-black" : "text-gray-600"} />
    <span
      className={`text-gray-700 whitespace-nowrap transition-all duration-300 ${
        isExpanded ? "opacity-100" : "opacity-0 w-0"
      }`}
    >
      {text}
    </span>
  </div>
);

const MenteeSidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentDashboard, setCurrentDashboard] = useState("Mentee Dashboard");
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutUser();
      toast.success("Logged out successfully!");
      setLogoutModalOpen(false);
      navigate("/"); // Redirect to login page after logout
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const handleItemClick = (itemName: string, path?: string) => {
    setActiveItem(itemName);
    if (path) {
      navigate(path);
    }
  };

  const handleMouseLeave = () => {
    // Only collapse sidebar if dropdown is not open
    if (!dropdownOpen) {
      setIsExpanded(false);
    }
  };

  const handleDropdownSelect = (dashboard: string) => {
    setCurrentDashboard(dashboard);
    setDropdownOpen(false);
  };

  return (
    <div
      ref={sidebarRef}
      className="fixed left-4 top-4 bottom-4 bg-white rounded-xl shadow-lg transition-all duration-300 z-10"
      style={{ width: isExpanded ? "240px" : "80px" }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-4">
        {isExpanded ? (
          <DropdownMenu.Root open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 w-full">
                <UserCircle2 size={24} />
                <span className="flex-1 text-left">{currentDashboard}</span>
                <ChevronDown size={20} />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="bg-white rounded-lg shadow-lg p-2 min-w-[200px] z-20"
                sideOffset={5}
              >
                <DropdownMenu.Item
                  className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onSelect={() => handleDropdownSelect("Mentor Dashboard")}
                >
                  Mentor Dashboard
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onSelect={() => handleDropdownSelect("Mentee Dashboard")}
                >
                  Mentee Dashboard
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        ) : (
          <button className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 w-full">
            <UserCircle2 size={24} />
          </button>
        )}
      </div>

      <nav className="space-y-2 px-2">
        <SidebarItem
          icon={Home}
          text="Home"
          isExpanded={isExpanded}
          active={activeItem === "Home"}
          onClick={() => handleItemClick("Home", "/seeker/dashboard")}
        />
        <SidebarItem
          icon={FileText}
          text="Profile Details"
          isExpanded={isExpanded}
          active={activeItem === "Profile Details"}
          onClick={() => handleItemClick("Profile Details", "/seeker/profile")}
        />
        <SidebarItem
          icon={Phone}
          text="Bookings"
          isExpanded={isExpanded}
          active={activeItem === "Bookings"}
          onClick={() => handleItemClick("Bookings")}
        />
        <SidebarItem
          icon={Clock}
          text="Bill History"
          isExpanded={isExpanded}
          active={activeItem === "Bill History"}
          onClick={() => handleItemClick("Bill History")}
        />
        <SidebarItem
          icon={Bell}
          text="Notification"
          isExpanded={isExpanded}
          active={activeItem === "Notification"}
          onClick={() => handleItemClick("Notification")}
        />
      </nav>

      <div className="absolute bottom-4 w-full px-2">
        <SidebarItem
          icon={LogOut}
          text="Logout"
          isExpanded={isExpanded}
          active={activeItem === "Logout"}
          onClick={() => setLogoutModalOpen(true)}
        />
      </div>
      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        open={logoutModalOpen}
        onOpenChange={setLogoutModalOpen}
        onConfirm={handleLogout}
        loggingOut={loggingOut}
      />
      <Toaster position="top-right" />
    </div>
  );
};

export default MenteeSidebar;
