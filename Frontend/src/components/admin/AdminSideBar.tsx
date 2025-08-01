import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  BadgeIndianRupee,
  LogOut,
  MessageSquare,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import { LogoutConfirmationModal } from "@/components/modal/Logout";
import { logout } from "@/services/adminAuth";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/logo3.png";
import LogoName from "@/assets/logoname3.png";
import { resetAdmin } from "@/redux/slices/adminSlice";
import { AdminProfilePicture } from "@/components/admin/AdminSecureMedia";

const SidebarItem = ({
  icon: Icon,
  text,
  isExpanded,
  onClick,
  active = false,
}: {
  icon: React.ElementType;
  text: React.ReactNode;
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
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.admin);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("Logged out successfully!");
      setLogoutModalOpen(false);
      dispatch(resetAdmin());
      navigate("/admin/login");
    } catch {
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
        <nav className="space-y-2 px-2">
          <SidebarItem
            icon={LayoutDashboard}
            text="Dashboard"
            isExpanded={isExpanded}
            active={activeItem === "Dashboard"}
            onClick={() => handleItemClick("Dashboard", "/admin/dashboard")}
          />
          <SidebarItem
            icon={Users}
            text="Users"
            isExpanded={isExpanded}
            active={activeItem === "Users"}
            onClick={() => handleItemClick("Users", "/admin/users")}
          />
          <SidebarItem
            icon={Calendar}
            text="Bookings"
            isExpanded={isExpanded}
            active={activeItem === "Bookings"}
            onClick={() => handleItemClick("Bookings", "/admin/bookings")}
          />
          <SidebarItem
            icon={BadgeIndianRupee}
            text="Transactions"
            isExpanded={isExpanded}
            active={activeItem === "Transactions"}
            onClick={() =>
              handleItemClick("Transactions", "/admin/transactions")
            }
          />
          <SidebarItem
            icon={MessageSquare}
            text="Appeals"
            isExpanded={isExpanded}
            active={activeItem === "Appeals"}
            onClick={() => handleItemClick("Appeals", "/admin/appeals")}
          />
        </nav>
        <div className="absolute bottom-4 w-full px-2">
          {user?.adminName && (
            <SidebarItem
              icon={() => (
                <AdminProfilePicture
                  profilePicture={user.profilePicture}
                  userName={`${user.firstName} ${user.lastName}`}
                  size="sm"
                  className="h-24 w-24"
                />
              )}
              text={
                <div className="flex flex-col">
                  <span className=" text-sm font-medium">{user.adminName}</span>
                  <span className="text-xs text-gray-500">
                    {user.adminEmail}
                  </span>
                </div>
              }
              isExpanded={isExpanded}
            />
          )}
          <SidebarItem
            icon={LogOut}
            text="Logout"
            isExpanded={isExpanded}
            onClick={() => setLogoutModalOpen(true)}
          />
        </div>
      </div>
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
