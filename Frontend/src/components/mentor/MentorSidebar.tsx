// import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
// import { useState } from "react";
// import {
//   Home,
//   FileText,
//   Phone,
//   Clock,
//   Bell,
//   LogOut,
//   ChevronDown,
//   UserCircle2,
//   ChevronRight,
// } from "lucide-react";
// import { LogoutConfirmationModal } from "@/components/modal/Logout";
// import { logoutUser } from "@/services/userAuthService";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";

// const SidebarItem = ({
//   icon: Icon,
//   text,
//   isExpanded,
//   active = false,
//   onClick,
// }: {
//   icon: any;
//   text: string;
//   isExpanded: boolean;
//   active?: boolean;
//   onClick?: () => void;
// }) => (
//   <div
//     className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
//       active ? "bg-gray-100" : "hover:bg-gray-100"
//     }`}
//     onClick={onClick}
//   >
//     <Icon
//       size={24}
//       className={`${active ? "text-[#e44332]" : "text-gray-600"}`}
//     />
//     <span
//       className={`text-gray-700 whitespace-nowrap transition-all duration-300 ${
//         isExpanded ? "opacity-100" : "opacity-0 w-0"
//       }`}
//     >
//       {text}
//     </span>
//   </div>
// );

// const MentorSidebar: React.FC = () => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [currentDashboard, setCurrentDashboard] = useState("Mentor Dashboard");
//   const [loggingOut, setLoggingOut] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     setLoggingOut(true);
//     try {
//       await logoutUser();
//       toast.success("Logged out successfully!");
//       setLogoutModalOpen(false);
//       navigate("/"); // Redirect to login page after logout
//     } catch (error) {
//       toast.error("Failed to logout. Please try again.");
//     } finally {
//       setLoggingOut(false);
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
//         {/* Dashboard Selector */}
//         <div className="p-4">
//           <DropdownMenu.Root>
//             <DropdownMenu.Trigger asChild>
//               <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 w-full">
//                 <UserCircle2 size={24} />
//                 {isExpanded && (
//                   <>
//                     <span className="flex-1 text-left">{currentDashboard}</span>
//                     <ChevronDown size={20} />
//                   </>
//                 )}
//               </button>
//             </DropdownMenu.Trigger>
//             <DropdownMenu.Content className="bg-white rounded-lg shadow-lg p-2 min-w-[200px]">
//               <DropdownMenu.Item
//                 className="p-2 hover:bg-gray-100 rounded cursor-pointer"
//                 onSelect={() => setCurrentDashboard("Mentor Dashboard")}
//               >
//                 Mentor Dashboard
//               </DropdownMenu.Item>
//               <DropdownMenu.Item
//                 className="p-2 hover:bg-gray-100 rounded cursor-pointer"
//                 onSelect={() => setCurrentDashboard("Mentee Dashboard")}
//               >
//                 Mentee Dashboard
//               </DropdownMenu.Item>
//             </DropdownMenu.Content>
//           </DropdownMenu.Root>
//         </div>

//         {/* Navigation Items */}
//         <nav className="space-y-2 px-2">
//           <SidebarItem icon={Home} text="Home" isExpanded={isExpanded} active />
//           <SidebarItem
//             icon={FileText}
//             text="Profile Details"
//             isExpanded={isExpanded}
//           />
//           <SidebarItem icon={Phone} text="Bookings" isExpanded={isExpanded} />
//           <SidebarItem
//             icon={Clock}
//             text="Bill History"
//             isExpanded={isExpanded}
//           />
//           <SidebarItem
//             icon={Bell}
//             text="Notification"
//             isExpanded={isExpanded}
//           />
//         </nav>

//         {/* Logout at bottom */}
//         <div className="absolute bottom-4 w-full px-2">
//           <SidebarItem
//             icon={LogOut}
//             text="Logout"
//             isExpanded={isExpanded}
//             onClick={() => setLogoutModalOpen(true)}
//           />
//         </div>
//       </div>

//     </>
//   );
// };

// export default MentorSidebar;
