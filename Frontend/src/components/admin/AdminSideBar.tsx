// import { useState } from "react";
// import {
//   LayoutDashboard,
//   Users,
//   Calendar,
//   BadgeIndianRupee,
//   LogOut,
//   Mail,
//   Shield,
// } from "lucide-react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import { LogoutConfirmationModal } from "@/components/modal/Logout";
// import { logout } from "@/services/adminAuth";
// import { toast, Toaster } from "react-hot-toast";
// import { useNavigate, useLocation } from "react-router-dom";
// import Logo from "@/assets/logo3.png";
// import LogoName from "@/assets/logoname3.png";
// import { resetAdmin } from "@/redux/slices/adminSlice";
// import { AdminProfilePicture } from "@/components/admin/AdminSecureMedia";
// import { useContactNotifications } from "@/hooks/useContactNotifications";
// import ContactNotificationBadge from "./ContactNotificationBadge";

// interface SidebarItemProps {
//   icon: React.ElementType;
//   text: React.ReactNode;
//   isExpanded: boolean;
//   onClick?: () => void;
//   active?: boolean;
//   hasNotification?: boolean;
//   notificationCount?: number;
// }

// const SidebarItem = ({
//   icon: Icon,
//   text,
//   isExpanded,
//   onClick,
//   active = false,
//   hasNotification = false,
//   notificationCount = 0,
// }: SidebarItemProps) => (
//   <div
//     className={`flex items-center justify-between gap-4 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-all duration-200 ${
//       active ? "bg-gray-100" : ""
//     }`}
//     onClick={onClick}
//   >
//     <div className="flex items-center gap-4">
//       <div className="relative">
//         <Icon size={24} className={active ? "text-black" : "text-gray-600"} />
//         {/* Small notification dot when collapsed */}
//         {hasNotification && !isExpanded && (
//           <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
//         )}
//       </div>
//       <span
//         className={`text-gray-700 whitespace-nowrap transition-all duration-300 ${
//           isExpanded ? "opacity-100" : "opacity-0 w-0"
//         }`}
//       >
//         {text}
//       </span>
//     </div>

//     {/* Notification badge when expanded */}
//     {hasNotification && isExpanded && (
//       <ContactNotificationBadge
//         hasNewMessages={hasNotification}
//         onClick={() => {}} // Handled by parent
//         size={16}
//       />
//     )}
//   </div>
// );

// const AdminSidebar: React.FC = () => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [logoutModalOpen, setLogoutModalOpen] = useState(false);
//   const [loggingOut, setLoggingOut] = useState(false);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();

//   const { user } = useSelector((state: RootState) => state.admin);
//   const { contactNotifications } = useSelector(
//     (state: RootState) => state.admin
//   );
//   const { clearNotifications } = useContactNotifications();

//   // Determine active item from current path
//   const getActiveItem = () => {
//     const path = location.pathname;
//     if (path.includes("/dashboard")) return "Dashboard";
//     if (path.includes("/users")) return "Users";
//     if (path.includes("/bookings")) return "Bookings";
//     if (path.includes("/transactions")) return "Transactions";
//     if (path.includes("/messages")) return "Messages";
//     if (path.includes("/appeals")) return "Appeals";
//     return "Dashboard";
//   };

//   const activeItem = getActiveItem();

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
//     if (path) {
//       navigate(path);

//       // Clear notifications when visiting messages
//       if (itemName === "Messages") {
//         clearNotifications();
//       }
//     }
//   };

//   const menuItems = [
//     {
//       name: "Dashboard",
//       icon: LayoutDashboard,
//       path: "/admin/dashboard",
//     },
//     {
//       name: "Users",
//       icon: Users,
//       path: "/admin/users",
//     },
//     {
//       name: "Bookings",
//       icon: Calendar,
//       path: "/admin/bookings",
//     },
//     {
//       name: "Transactions",
//       icon: BadgeIndianRupee,
//       path: "/admin/transactions",
//     },
//     {
//       name: "Messages",
//       icon: Mail,
//       path: "/admin/messages",
//       hasNotification: contactNotifications?.hasNewMessages || false,
//     },
//     {
//       name: "Appeals",
//       icon: Shield,
//       path: "/admin/appeals",
//     },
//   ];

//   return (
//     <>
//       <div
//         className="fixed left-4 top-4 bottom-4 bg-white rounded-xl shadow-lg transition-all duration-300 z-10"
//         style={{ width: isExpanded ? "280px" : "80px" }}
//         onMouseEnter={() => setIsExpanded(true)}
//         onMouseLeave={() => setIsExpanded(false)}
//       >
//         {/* Header with Logo */}
//         <div className="p-4 mb-4 flex items-center border-b border-gray-100">
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

//         {/* Navigation Menu */}
//         <nav className="space-y-2 px-2 flex-1">
//           {menuItems.map((item) => (
//             <SidebarItem
//               key={item.name}
//               icon={item.icon}
//               text={item.name}
//               isExpanded={isExpanded}
//               active={activeItem === item.name}
//               hasNotification={item.hasNotification}
//               onClick={() => handleItemClick(item.name, item.path)}
//             />
//           ))}
//         </nav>

//         {/* Bottom Section - User Profile & Logout */}
//         <div className="absolute bottom-4 w-full px-2 space-y-2">
//           {/* User Profile */}
//           {user?.adminName && (
//             <div
//               className={`flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 ${
//                 isExpanded ? "" : "justify-center"
//               }`}
//             >
//               <AdminProfilePicture
//                 profilePicture={user.profilePicture}
//                 userName={`${user.firstName} ${user.lastName}`}
//                 size="sm"
//                 className="h-8 w-8 flex-shrink-0"
//               />
//               <div
//                 className={`flex flex-col transition-all duration-300 ${
//                   isExpanded ? "opacity-100" : "opacity-0 w-0"
//                 }`}
//               >
//                 <span className="text-sm font-medium text-gray-900 truncate">
//                   {user.adminName}
//                 </span>
//                 <span className="text-xs text-gray-500 truncate">
//                   {user.adminEmail}
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* Logout Button */}
//           <SidebarItem
//             icon={LogOut}
//             text="Logout"
//             isExpanded={isExpanded}
//             onClick={() => setLogoutModalOpen(true)}
//           />
//         </div>
//       </div>

//       {/* Logout Confirmation Modal */}
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
    className={`group relative flex items-center justify-between gap-3 p-3 mx-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${
      active
        ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-blue-500/25"
        : "hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 text-gray-600 hover:text-gray-800"
    }`}
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      <div className="relative">
        <div
          className={`p-2 rounded-lg transition-all duration-300 ${
            active ? "bg-white/20 backdrop-blur-sm" : "group-hover:bg-blue-100"
          }`}
        >
          <Icon
            size={24}
            className={`transition-all duration-300 ${
              active
                ? " text-white"
                : "text-gray-600 group-hover:text-blue-600 "
            }`}
          />
        </div>
        {/* Notification dot when collapsed */}
        {hasNotification && !isExpanded && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse shadow-md" />
        )}
      </div>
      <span
        className={`font-medium whitespace-nowrap transition-all duration-300 ${
          isExpanded
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-2 w-0"
        } ${active ? "text-white" : "text-gray-700 group-hover:text-gray-900"}`}
      >
        {text}
      </span>
    </div>

    {/* Notification badge when expanded */}
    {hasNotification && isExpanded && (
      <div className="flex-shrink-0">
        <ContactNotificationBadge
          hasNewMessages={hasNotification}
          onClick={() => {}}
          size={16}
        />
      </div>
    )}

    {/* Active item indicator */}
    {active && (
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
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
        className="fixed left-4 top-4 bottom-4 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 transition-all duration-300 z-10 overflow-hidden"
        style={{
          width: isExpanded ? "300px" : "100px",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
        }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 pointer-events-none" />

        {/* Header with Logo */}
        <div className="relative p-6 mb-2 flex items-center border-b border-gradient-to-r from-gray-100 to-gray-200">
          <div className="relative">
            {/* <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"> */}
            <img
              src={Logo}
              alt="Mentor ONE Logo"
              className="w-10 h-10 object-contain "
            />
            {/* </div> */}
          </div>
          <div
            className={`ml-3 transition-all duration-300 ${
              isExpanded
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4 w-0"
            }`}
          >
            <img
              src={LogoName}
              alt="Mentor ONE"
              className="h-12 object-contain"
            />
            <div className="text-xs text-gray-500 font-medium mt-1">
              Admin Panel
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="relative space-y-1 px-2 flex-1 py-4">
          {menuItems.map((item, index) => (
            <div key={item.name} style={{ animationDelay: `${index * 50}ms` }}>
              <SidebarItem
                icon={item.icon}
                text={item.name}
                isExpanded={isExpanded}
                active={activeItem === item.name}
                hasNotification={item.hasNotification}
                onClick={() => handleItemClick(item.name, item.path)}
              />
            </div>
          ))}
        </nav>

        {/* Bottom Section - User Profile & Logout */}
        <div className="absolute bottom-4 w-full px-2 space-y-3">
          {/* User Profile */}
          {user?.adminName && (
            <div
              className={`relative group flex items-center gap-3 p-3 mx-2 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md ${
                isExpanded ? "" : "justify-center"
              }`}
            >
              <div className="relative">
                <AdminProfilePicture
                  profilePicture={user.profilePicture}
                  userName={`${user.firstName} ${user.lastName}`}
                  size="sm"
                  className="h-10 w-10 flex-shrink-0 ring-2 ring-white shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" />
              </div>
              <div
                className={`flex flex-col transition-all duration-300 ${
                  isExpanded
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2 w-0"
                }`}
              >
                <span className="text-sm font-semibold text-gray-900 truncate">
                  {user.adminName}
                </span>
                <span className="text-xs text-gray-500 truncate">
                  {user.adminEmail}
                </span>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <div className="relative">
            <SidebarItem
              icon={LogOut}
              text="Logout"
              isExpanded={isExpanded}
              onClick={() => setLogoutModalOpen(true)}
            />
          </div>
        </div>

        {/* Expand indicator */}
        <div
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
            isExpanded ? "opacity-0 scale-75" : "opacity-60 scale-100"
          }`}
        >
          <div className="w-1 h-12 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full" />
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
