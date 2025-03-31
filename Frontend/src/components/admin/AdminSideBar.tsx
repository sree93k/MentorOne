import { useState } from "react";
import {
  LayoutDashboard,
  Bell,
  Users,
  Calendar,
  Wallet,
  Users2,
  LogOut,
} from "lucide-react";
import { LogoutConfirmationModal } from "@/components/modal/Logout";
import { adminLogout } from "@/services/adminAuth";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/logo.png";
import LogoName from "@/assets/brandlogo.png";

const SidebarItem = ({
  icon: Icon,
  text,
  isExpanded,
  onClick,
  active = false,
}: {
  icon: any;
  text: string;
  isExpanded: boolean;
  onClick?: () => void;
  active?: boolean;
}) => (
  <div
    className={`flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg cursor-pointer ${
      active ? "bg-gray-100" : ""
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

const AdminSidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await adminLogout();
      toast.success("Logged out successfully!");
      setLogoutModalOpen(false);
      navigate("/admin/signin"); // Redirect to login page after logout
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

  return (
    <>
      <div
        className="fixed left-4 top-4 bottom-4 bg-white rounded-xl shadow-lg transition-all duration-300 z-10"
        style={{ width: isExpanded ? "240px" : "80px" }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo */}
        <div className="p-4 mb-4 flex items-center">
          <img
            src={Logo}
            alt="Mentor ONE Logo"
            className="w-10 h-10 object-contain"
          />
          <img
            src={LogoName}
            alt="Mentor ONE Logoname"
            className={`h-10 ml-2 object-contain transition-all duration-300 ${
              isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
            }`}
          />
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2 px-2">
          <SidebarItem
            icon={LayoutDashboard}
            text="Dashboard"
            isExpanded={isExpanded}
            active={activeItem === "Dashboard"}
            onClick={() => handleItemClick("Dashboard", "/admin/dashboard")}
          />
          <SidebarItem
            icon={Bell}
            text="Notifications"
            isExpanded={isExpanded}
            active={activeItem === "Notifications"}
            onClick={() =>
              handleItemClick("Notifications", "/admin/notifications")
            }
          />
          <SidebarItem
            icon={Users}
            text="Users"
            isExpanded={isExpanded}
            active={activeItem === "Users"}
            onClick={() => handleItemClick("Users", "/admin/allUsers")}
          />
          <SidebarItem
            icon={Calendar}
            text="Bookings"
            isExpanded={isExpanded}
            active={activeItem === "Bookings"}
            onClick={() => handleItemClick("Bookings", "/admin/bookings")}
          />
          <SidebarItem
            icon={Wallet}
            text="Transactions"
            isExpanded={isExpanded}
            active={activeItem === "Transactions"}
            onClick={() =>
              handleItemClick("Transactions", "/admin/transactions")
            }
          />
          <SidebarItem
            icon={Users2}
            text="Subscribers"
            isExpanded={isExpanded}
            active={activeItem === "Subscribers"}
            onClick={() => handleItemClick("Subscribers", "/admin/subscribers")}
          />
        </nav>

        {/* Logout at bottom */}
        <div className="absolute bottom-4 w-full px-2">
          <SidebarItem
            icon={LogOut}
            text="Logout"
            isExpanded={isExpanded}
            onClick={() => setLogoutModalOpen(true)}
          />
        </div>
      </div>
      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        open={logoutModalOpen}
        onOpenChange={setLogoutModalOpen}
        onConfirm={handleLogout}
        loggingOut={loggingOut}
      />
      <Toaster position="top-right" />
    </>
  );
};

export default AdminSidebar;
