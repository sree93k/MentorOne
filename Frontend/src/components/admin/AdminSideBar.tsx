// import { useState } from "react";
// import {
//   LayoutDashboard,
//   Users,
//   Calendar,
//   BadgeIndianRupee,
//   LogOut,
//   MessageSquare,
// } from "lucide-react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import { LogoutConfirmationModal } from "@/components/modal/Logout";
// import { logout } from "@/services/adminAuth";
// import { toast, Toaster } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import Logo from "@/assets/logo3.png";
// import LogoName from "@/assets/logoname3.png";
// import { resetAdmin } from "@/redux/slices/adminSlice";
// import { AdminProfilePicture } from "@/components/admin/AdminSecureMedia";

// const SidebarItem = ({
//   icon: Icon,
//   text,
//   isExpanded,
//   onClick,
//   active = false,
// }: {
//   icon: React.ElementType;
//   text: React.ReactNode;
//   isExpanded: boolean;
//   onClick?: () => void;
//   active?: boolean;
// }) => (
//   <div
//     className={`flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg cursor-pointer ${
//       active ? "bg-gray-100" : ""
//     }`}
//     onClick={onClick}
//   >
//     <Icon size={24} className={active ? "text-black" : "text-gray-600"} />
//     <span
//       className={`text-gray-700 whitespace-nowrap transition-all duration-300 ${
//         isExpanded ? "opacity-100" : "opacity-0 w-0"
//       }`}
//     >
//       {text}
//     </span>
//   </div>
// );

// const AdminSidebar: React.FC = () => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [logoutModalOpen, setLogoutModalOpen] = useState(false);
//   const [loggingOut, setLoggingOut] = useState(false);
//   const [activeItem, setActiveItem] = useState("Dashboard");
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user } = useSelector((state: RootState) => state.admin);

//   const handleLogout = async () => {
//     setLoggingOut(true);
//     try {
//       await logout();
//       toast.success("Logged out successfully!");
//       setLogoutModalOpen(false);
//       dispatch(resetAdmin());
//       navigate("/admin/login");
//     } catch {
//       toast.error("Failed to logout. Please try again.");
//     } finally {
//       setLoggingOut(false);
//     }
//   };

//   const handleItemClick = (itemName: string, path?: string) => {
//     setActiveItem(itemName);
//     if (path) {
//       navigate(path);
//     }
//   };

//   return (
//     <>
//       <div
//         className="fixed left-4 top-4 bottom-4 bg-white rounded-xl shadow-lg transition-all duration-300 z-10"
//         style={{ width: isExpanded ? "240px" : "80px" }}
//         onMouseEnter={() => setIsExpanded(true)}
//         onMouseLeave={() => setIsExpanded(false)}
//       >
//         <div className="p-4 mb-4 flex items-center">
//           <img
//             src={Logo}
//             alt="Mentor ONE Logo"
//             className="w-10 h-10 object-contain"
//           />
//           <img
//             src={LogoName}
//             alt="Mentor ONE Logoname"
//             className={`h-10 ml-2 object-contain transition-all duration-300 ${
//               isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
//             }`}
//           />
//         </div>
//         <nav className="space-y-2 px-2">
//           <SidebarItem
//             icon={LayoutDashboard}
//             text="Dashboard"
//             isExpanded={isExpanded}
//             active={activeItem === "Dashboard"}
//             onClick={() => handleItemClick("Dashboard", "/admin/dashboard")}
//           />
//           <SidebarItem
//             icon={Users}
//             text="Users"
//             isExpanded={isExpanded}
//             active={activeItem === "Users"}
//             onClick={() => handleItemClick("Users", "/admin/users")}
//           />
//           <SidebarItem
//             icon={Calendar}
//             text="Bookings"
//             isExpanded={isExpanded}
//             active={activeItem === "Bookings"}
//             onClick={() => handleItemClick("Bookings", "/admin/bookings")}
//           />
//           <SidebarItem
//             icon={BadgeIndianRupee}
//             text="Transactions"
//             isExpanded={isExpanded}
//             active={activeItem === "Transactions"}
//             onClick={() =>
//               handleItemClick("Transactions", "/admin/transactions")
//             }
//           />
//           <SidebarItem
//             icon={MessageSquare}
//             text="Appeals"
//             isExpanded={isExpanded}
//             active={activeItem === "Appeals"}
//             onClick={() => handleItemClick("Appeals", "/admin/appeals")}
//           />
//         </nav>
//         <div className="absolute bottom-4 w-full px-2">
//           {user?.adminName && (
//             <SidebarItem
//               icon={() => (
//                 <AdminProfilePicture
//                   profilePicture={user.profilePicture}
//                   userName={`${user.firstName} ${user.lastName}`}
//                   size="sm"
//                   className="h-24 w-24"
//                 />
//               )}
//               text={
//                 <div className="flex flex-col">
//                   <span className=" text-sm font-medium">{user.adminName}</span>
//                   <span className="text-xs text-gray-500">
//                     {user.adminEmail}
//                   </span>
//                 </div>
//               }
//               isExpanded={isExpanded}
//             />
//           )}
//           <SidebarItem
//             icon={LogOut}
//             text="Logout"
//             isExpanded={isExpanded}
//             onClick={() => setLogoutModalOpen(true)}
//           />
//         </div>
//       </div>
//       <LogoutConfirmationModal
//         open={logoutModalOpen}
//         onOpenChange={setLogoutModalOpen}
//         onConfirm={handleLogout}
//         loggingOut={loggingOut}
//       />
//       <Toaster position="top-right" />
//     </>
//   );
// };

// export default AdminSidebar;
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  BadgeIndianRupee,
  LogOut,
  Mail,
  Shield,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import { LogoutConfirmationModal } from "@/components/modal/Logout";
import { logout } from "@/services/adminAuth";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "@/assets/logo3.png";
import LogoName from "@/assets/logoname3.png";
import { resetAdmin } from "@/redux/slices/adminSlice";
import { AdminProfilePicture } from "@/components/admin/AdminSecureMedia";
import { useContactNotifications } from "@/hooks/useContactNotifications";
import ContactNotificationBadge from "./ContactNotificationBadge";

interface SidebarItemProps {
  icon: React.ElementType;
  text: React.ReactNode;
  isExpanded: boolean;
  onClick?: () => void;
  active?: boolean;
  hasNotification?: boolean;
  notificationCount?: number;
}

const SidebarItem = ({
  icon: Icon,
  text,
  isExpanded,
  onClick,
  active = false,
  hasNotification = false,
  notificationCount = 0,
}: SidebarItemProps) => (
  <div
    className={`flex items-center justify-between gap-4 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-all duration-200 ${
      active ? "bg-gray-100" : ""
    }`}
    onClick={onClick}
  >
    <div className="flex items-center gap-4">
      <div className="relative">
        <Icon size={24} className={active ? "text-black" : "text-gray-600"} />
        {/* Small notification dot when collapsed */}
        {hasNotification && !isExpanded && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        )}
      </div>
      <span
        className={`text-gray-700 whitespace-nowrap transition-all duration-300 ${
          isExpanded ? "opacity-100" : "opacity-0 w-0"
        }`}
      >
        {text}
      </span>
    </div>

    {/* Notification badge when expanded */}
    {hasNotification && isExpanded && (
      <ContactNotificationBadge
        hasNewMessages={hasNotification}
        onClick={() => {}} // Handled by parent
        size={16}
      />
    )}
  </div>
);

const AdminSidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.admin);
  const { contactNotifications } = useSelector(
    (state: RootState) => state.admin
  );
  const { clearNotifications } = useContactNotifications();

  // Determine active item from current path
  const getActiveItem = () => {
    const path = location.pathname;
    if (path.includes("/dashboard")) return "Dashboard";
    if (path.includes("/users")) return "Users";
    if (path.includes("/bookings")) return "Bookings";
    if (path.includes("/transactions")) return "Transactions";
    if (path.includes("/messages")) return "Messages";
    if (path.includes("/appeals")) return "Appeals";
    return "Dashboard";
  };

  const activeItem = getActiveItem();

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
    if (path) {
      navigate(path);

      // Clear notifications when visiting messages
      if (itemName === "Messages") {
        clearNotifications();
      }
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      name: "Users",
      icon: Users,
      path: "/admin/users",
    },
    {
      name: "Bookings",
      icon: Calendar,
      path: "/admin/bookings",
    },
    {
      name: "Transactions",
      icon: BadgeIndianRupee,
      path: "/admin/transactions",
    },
    {
      name: "Messages",
      icon: Mail,
      path: "/admin/messages",
      hasNotification: contactNotifications?.hasNewMessages || false,
    },
    {
      name: "Appeals",
      icon: Shield,
      path: "/admin/appeals",
    },
  ];

  return (
    <>
      <div
        className="fixed left-4 top-4 bottom-4 bg-white rounded-xl shadow-lg transition-all duration-300 z-10"
        style={{ width: isExpanded ? "280px" : "80px" }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Header with Logo */}
        <div className="p-4 mb-4 flex items-center border-b border-gray-100">
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

        {/* Navigation Menu */}
        <nav className="space-y-2 px-2 flex-1">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.name}
              icon={item.icon}
              text={item.name}
              isExpanded={isExpanded}
              active={activeItem === item.name}
              hasNotification={item.hasNotification}
              onClick={() => handleItemClick(item.name, item.path)}
            />
          ))}
        </nav>

        {/* Bottom Section - User Profile & Logout */}
        <div className="absolute bottom-4 w-full px-2 space-y-2">
          {/* User Profile */}
          {user?.adminName && (
            <div
              className={`flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 ${
                isExpanded ? "" : "justify-center"
              }`}
            >
              <AdminProfilePicture
                profilePicture={user.profilePicture}
                userName={`${user.firstName} ${user.lastName}`}
                size="sm"
                className="h-8 w-8 flex-shrink-0"
              />
              <div
                className={`flex flex-col transition-all duration-300 ${
                  isExpanded ? "opacity-100" : "opacity-0 w-0"
                }`}
              >
                <span className="text-sm font-medium text-gray-900 truncate">
                  {user.adminName}
                </span>
                <span className="text-xs text-gray-500 truncate">
                  {user.adminEmail}
                </span>
              </div>
            </div>
          )}

          {/* Logout Button */}
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
