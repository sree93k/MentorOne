// import { useState, useEffect, useRef } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import {
//   Home,
//   FileText,
//   Phone,
//   Clock,
//   Bell,
//   LogOut,
//   ChevronDown,
//   UserCircle2,
//   MessageSquareCode,
//   Heart,
//   CalendarDays,
//   HandCoins,
//   Wallet,
//   Video,
// } from "lucide-react";
// import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
// import { LogoutConfirmationModal } from "@/components/modal/Logout";
// import { logout } from "@/services/userAuthService";
// import { useNavigate } from "react-router-dom";
// import toast, { Toaster } from "react-hot-toast";
// import Notification from "../users/Notification";
// import WelcomeModalForm1 from "./MentorWelcomeModal";
// import {
//   setUser,
//   resetUser,
//   setMentorActivated,
//   setDashboard,
//   setOnlineStatus,
// } from "@/redux/slices/userSlice";
// import { uploadMentorWelcomeForm, uploadImage } from "@/services/mentorService";
// import { updateOnlineStatus } from "@/services/userServices"; // Import updateOnlineStatus
// import logo from "@/assets/Logo2.png";

// interface WelcomeFormData {
//   userType: string;
//   schoolName?: string;
//   class?: string;
//   course?: string;
//   specializedIn?: string;
//   collegeName?: string;
//   startDate?: string;
//   endDate?: string;
//   experience?: string;
//   jobRole?: string;
//   company?: string;
//   currentlyWorking?: boolean;
//   city: string;
//   imageFile?: File;
//   imageUrl?: string;
//   careerGoals?: string;
//   interestedNewcareer?: string[];
//   goals?: string[];
//   skills?: string[];
//   bio?: string;
//   linkedinUrl?: string;
//   youtubeLink?: string;
//   portfolio?: string;
//   selfIntro?: string;
//   featuredArticle?: string;
//   mentorMotivation?: string;
//   achievements?: string;
// }

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
//       active
//         ? "bg-gray-100 dark:bg-gray-700"
//         : "hover:bg-gray-100 dark:hover:bg-gray-700"
//     }`}
//     onClick={onClick}
//   >
//     <Icon
//       size={24}
//       className={
//         active
//           ? "text-black dark:text-white"
//           : "text-gray-600 dark:text-gray-400"
//       }
//     />
//     <span
//       className={`text-gray-700 dark:text-gray-300 whitespace-nowrap transition-all duration-300 ${
//         isExpanded ? "opacity-100" : "opacity-0 w-0"
//       }`}
//     >
//       {text}
//     </span>
//   </div>
// );

// const SidebarItem2 = ({
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
//     className={`flex items-center gap-4 px-3 rounded-lg cursor-pointer transition-colors ${
//       active
//         ? "bg-gray-100 dark:bg-gray-700"
//         : "hover:bg-gray-100 dark:hover:bg-gray-700"
//     }`}
//     onClick={onClick}
//   >
//     <Icon
//       size={24}
//       className={
//         active
//           ? "text-black dark:text-white"
//           : "text-gray-600 dark:text-gray-400"
//       }
//     />
//     <span
//       className={`text-gray-700 dark:text-gray-300 whitespace-nowrap transition-all duration-300 ${
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
//   const [logoutModalOpen, setLogoutModalOpen] = useState(false);
//   const [loggingOut, setLoggingOut] = useState(false);
//   const [activeItem, setActiveItem] = useState("Dashboard");
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
//   const sidebarRef = useRef<HTMLDivElement>(null);
//   const [isNotification, setIsNotification] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Access user data and authentication status from Redux store
//   const { user, isAuthenticated, accessToken } = useSelector(
//     (state: RootState) => state.user
//   );
//   const isActivated = useSelector(
//     (state: RootState) => state.user.mentorActivated
//   );

//   // Set dashboard and update online status on mount (login)
//   useEffect(() => {
//     console.log(
//       "is activated is >>>>>>>>>>mentor>>>>>>>>>>>>>>>>s",
//       isActivated
//     );
//     dispatch(setDashboard("mentor"));
//     console.log("users", user);

//     if (isAuthenticated) {
//       updateOnlineStatus(true, "mentor")
//         .then((updatedUser) => {
//           dispatch(setOnlineStatus({ status: true, role: "mentor" }));
//           if (updatedUser) {
//             dispatch(setUser(updatedUser));
//           }
//         })
//         .catch((error) => {
//           toast.error("Failed to update online status");
//         });
//     }
//   }, [isAuthenticated, dispatch]);

//   // Check authentication and activation status
//   useEffect(() => {
//     if (!isAuthenticated) {
//       toast.error("Please log in to continue.");
//       navigate("/login");
//     } else if (!isActivated) {
//       console.log("is activated..mentor activated", isActivated);
//       setIsWelcomeModalOpen(true);
//     }
//   }, [isAuthenticated, isActivated, navigate]);

//   // Handle welcome form submission
//   const handleWelcomeFormSubmit = async (
//     formData: WelcomeFormData
//   ): Promise<boolean> => {
//     try {
//       let imageUrl = "";
//       if (formData.imageFile) {
//         imageUrl = await uploadImage(formData.imageFile);
//       }

//       interface UpdateUserDataPayload
//         extends Omit<WelcomeFormData, "imageFile"> {
//         imageUrl?: string;
//       }

//       const payload: UpdateUserDataPayload = {
//         ...formData,
//         imageUrl,
//       };

//       if (!user || !user._id) {
//         throw new Error("User ID not found. Please log in again.");
//       }

//       const updatedUser = await uploadMentorWelcomeForm(payload, user._id);
//       if (updatedUser) {
//         console.log("new updated user data is", updatedUser);
//         dispatch(setUser(updatedUser));
//         dispatch(setMentorActivated(true));
//         toast.success("Profile updated successfully!");
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error("Failed to update user data", error);
//       toast.error("Failed to submit form. Please try again.");
//       return false;
//     }
//   };

//   // Handle sidebar item click
//   const handleItemClick = (itemName: string, path?: string) => {
//     if (!isAuthenticated) {
//       toast.error("Please log in to continue.");
//       navigate("/login");
//       return;
//     }
//     if (!isActivated) {
//       toast.error("Please complete the welcome form first.");
//       setIsWelcomeModalOpen(true);
//       return;
//     }
//     setActiveItem(itemName);
//     if (path) navigate(path);
//   };

//   const openNotification = () => {
//     setIsNotification(true);
//   };

//   const handleMouseLeave = () => {
//     if (!dropdownOpen) setIsExpanded(false);
//   };

//   // Handle role switching
//   const handleDropdownSelect = (dashboard: string) => {
//     setCurrentDashboard(dashboard);
//     const newRole = dashboard === "Mentor Dashboard" ? "mentor" : "mentee";
//     // const userId = user._id;
//     updateOnlineStatus(true, newRole)
//       .then((updatedUser) => {
//         dispatch(setOnlineStatus({ status: true, role: newRole }));
//         if (updatedUser) {
//           dispatch(setUser(updatedUser));
//         }
//         if (dashboard === "Mentee Dashboard") {
//           navigate("/seeker/dashboard");
//         } else if (dashboard === "Mentor Dashboard") {
//           navigate("/expert/dashboard");
//         }
//         setDropdownOpen(false);
//       })
//       .catch((error) => {
//         toast.error("Failed to update online status");
//       });
//   };

//   // Handle logout
//   const handleLogout = async () => {
//     setLoggingOut(true);
//     try {
//       await updateOnlineStatus(false, null); // Clear online status
//       await logout();
//       toast.success("Logged out successfully!");
//       setLogoutModalOpen(false);
//       dispatch(resetUser());
//       dispatch(setOnlineStatus({ status: false, role: null }));
//       navigate("/");
//     } catch (error) {
//       toast.error("Failed to logout. Please try again.");
//     } finally {
//       setLoggingOut(false);
//     }
//   };

//   return (
//     <div
//       ref={sidebarRef}
//       className="fixed left-4 top-4 bottom-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 z-10"
//       style={{ width: isExpanded ? "240px" : "80px" }}
//       onMouseEnter={() => setIsExpanded(true)}
//       onMouseLeave={handleMouseLeave}
//     >
//       <div className="p-4">
//         {isExpanded ? (
//           <DropdownMenu.Root open={dropdownOpen} onOpenChange={setDropdownOpen}>
//             <DropdownMenu.Trigger asChild>
//               <button className="flex items-center gap-2 p-2 rounded-lg bg-red-500 text-white w-full">
//                 <UserCircle2 size={24} />
//                 <span className="flex-1 text-left">{currentDashboard}</span>
//                 <ChevronDown size={20} />
//               </button>
//             </DropdownMenu.Trigger>
//             <DropdownMenu.Portal>
//               <DropdownMenu.Content
//                 className="bg-white rounded-lg shadow-lg p-2 min-w-[200px] z-20"
//                 sideOffset={5}
//               >
//                 <DropdownMenu.Item
//                   className="p-2 hover:bg-gray-100 rounded cursor-pointer"
//                   onSelect={() => handleDropdownSelect("Mentor Dashboard")}
//                 >
//                   Mentor Dashboard
//                 </DropdownMenu.Item>
//                 <DropdownMenu.Item
//                   className="p-2 hover:bg-gray-100 rounded cursor-pointer"
//                   onSelect={() => handleDropdownSelect("Mentee Dashboard")}
//                 >
//                   Mentee Dashboard
//                 </DropdownMenu.Item>
//               </DropdownMenu.Content>
//             </DropdownMenu.Portal>
//           </DropdownMenu.Root>
//         ) : (
//           <button className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 w-full">
//             <img src={logo} alt="Logo" />
//           </button>
//         )}
//       </div>
//       <nav className="space-y-2 px-2">
//         <SidebarItem
//           icon={Home}
//           text="Home"
//           isExpanded={isExpanded}
//           active={activeItem === "Home"}
//           onClick={() => handleItemClick("Home", "/expert/dashboard")}
//         />
//         <SidebarItem
//           icon={Bell}
//           text="Notification"
//           isExpanded={isExpanded}
//           active={activeItem === "Notification"}
//           onClick={openNotification}
//         />
//         <SidebarItem
//           icon={Phone}
//           text="Bookings"
//           isExpanded={isExpanded}
//           active={activeItem === "Bookings"}
//           onClick={() => handleItemClick("Bookings", "/expert/booking")}
//         />
//         <SidebarItem
//           icon={HandCoins}
//           text="Services"
//           isExpanded={isExpanded}
//           active={activeItem === "Services"}
//           onClick={() => handleItemClick("Services", "/expert/services")}
//         />
//         <SidebarItem
//           icon={MessageSquareCode}
//           text="Priority"
//           isExpanded={isExpanded}
//           active={activeItem === "Priority"}
//           onClick={() => handleItemClick("Priority", "/expert/prioritydm")}
//         />
//         <SidebarItem
//           icon={Heart}
//           text="Testimonials"
//           isExpanded={isExpanded}
//           active={activeItem === "Testimonials"}
//           onClick={() =>
//             handleItemClick("Testimonials", "/expert/testimonials")
//           }
//         />
//         <SidebarItem
//           icon={CalendarDays}
//           text="Calender"
//           isExpanded={isExpanded}
//           active={activeItem === "Calender"}
//           onClick={() => handleItemClick("Calender", "/expert/calender")}
//         />
//         <SidebarItem
//           icon={Wallet}
//           text="Payment History"
//           isExpanded={isExpanded}
//           active={activeItem === "Payment"}
//           onClick={() => handleItemClick("Payment", "/expert/payment")}
//         />
//         <SidebarItem
//           icon={FileText}
//           text="Profile Details"
//           isExpanded={isExpanded}
//           active={activeItem === "Profile Details"}
//           onClick={() => handleItemClick("Profile Details", "/expert/profile")}
//         />
//         <SidebarItem
//           icon={Video}
//           text="Video Call"
//           isExpanded={isExpanded}
//           active={activeItem === "Video Call"}
//           onClick={() => handleItemClick("Video Call", "/user/meetinghome")}
//         />
//       </nav>
//       <div className="absolute bottom-4 w-full px-2 ">
//         {user?.firstName && (
//           <SidebarItem2
//             icon={() => (
//               <img
//                 src={user?.profilePicture || "https://via.placeholder.com/24"}
//                 alt="Profile"
//                 className="w-6 h-6 rounded-full object-cover"
//               />
//             )}
//             text={
//               <div className="flex flex-col">
//                 <span className="font-sm">
//                   {user.firstName.charAt(0).toUpperCase() +
//                     user.firstName.slice(1)}{" "}
//                   {user.lastName
//                     ? user.lastName.charAt(0).toUpperCase() +
//                       user.lastName.slice(1)
//                     : ""}
//                 </span>
//                 <span className="text-xs text-gray-500">{user.email}</span>
//               </div>
//             }
//             isExpanded={isExpanded}
//           />
//         )}
//         <SidebarItem
//           icon={LogOut}
//           text="Logout"
//           isExpanded={isExpanded}
//           onClick={() => setLogoutModalOpen(true)}
//         />
//       </div>
//       <LogoutConfirmationModal
//         open={logoutModalOpen}
//         onOpenChange={setLogoutModalOpen}
//         onConfirm={handleLogout}
//         loggingOut={loggingOut}
//       />
//       <WelcomeModalForm1
//         open={isWelcomeModalOpen}
//         onOpenChange={setIsWelcomeModalOpen}
//         onSubmit={handleWelcomeFormSubmit}
//       />
//       <Toaster position="top-right" />
//       <Notification open={isNotification} onOpenChange={setIsNotification} />
//     </div>
//   );
// };

// export default MentorSidebar;

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import {
  Home,
  FileText,
  Phone,
  Clock,
  Bell,
  LogOut,
  ChevronDown,
  UserCircle2,
  MessageSquareCode,
  Heart,
  CalendarDays,
  HandCoins,
  Wallet,
  Video,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogoutConfirmationModal } from "@/components/modal/Logout";
import { logout } from "@/services/userAuthService";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Notification from "../users/Notification";
import WelcomeModalForm1 from "./MentorWelcomeModal";
import SuccessStep from "@/components/mentor/WelcomeComponents/SuccessStep";
import {
  setUser,
  resetUser,
  setMentorActivated,
  setDashboard,
  setOnlineStatus,
  setIsApproved,
} from "@/redux/slices/userSlice";
import {
  uploadMentorWelcomeForm,
  uploadImage,
  isApprovalChecking,
} from "@/services/mentorService";
import { updateOnlineStatus } from "@/services/userServices";
import logo from "@/assets/Logo2.png";

interface WelcomeFormData {
  userType: string;
  schoolName?: string;
  class?: string;
  course?: string;
  specializedIn?: string;
  collegeName?: string;
  startDate?: string;
  endDate?: string;
  experience?: string;
  jobRole?: string;
  company?: string;
  currentlyWorking?: boolean;
  city: string;
  imageFile?: File;
  imageUrl?: string;
  careerGoals?: string;
  interestedNewcareer?: string[];
  goals?: string[];
  skills?: string[];
  bio?: string;
  linkedinUrl?: string;
  youtubeLink?: string;
  portfolio?: string;
  selfIntro?: string;
  featuredArticle?: string;
  mentorMotivation?: string;
  achievements?: string;
}

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
      active
        ? "bg-gray-100 dark:bg-gray-700"
        : "hover:bg-gray-100 dark:hover:bg-gray-700"
    }`}
    onClick={onClick}
  >
    <Icon
      size={24}
      className={
        active
          ? "text-black dark:text-white"
          : "text-gray-600 dark:text-gray-400"
      }
    />
    <span
      className={`text-gray-700 dark:text-gray-300 whitespace-nowrap transition-all duration-300 ${
        isExpanded ? "opacity-100" : "opacity-0 w-0"
      }`}
    >
      {text}
    </span>
  </div>
);

const SidebarItem2 = ({
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
    className={`flex items-center gap-4 px-3 rounded-lg cursor-pointer transition-colors ${
      active
        ? "bg-gray-100 dark:bg-gray-700"
        : "hover:bg-gray-100 dark:hover:bg-gray-700"
    }`}
    onClick={onClick}
  >
    <Icon
      size={24}
      className={
        active
          ? "text-black dark:text-white"
          : "text-gray-600 dark:text-gray-400"
      }
    />
    <span
      className={`text-gray-700 dark:text-gray-300 whitespace-nowrap transition-all duration-300 ${
        isExpanded ? "opacity-100" : "opacity-0 w-0"
      }`}
    >
      {text}
    </span>
  </div>
);

const MentorSidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentDashboard, setCurrentDashboard] = useState("Mentor Dashboard");
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isNotification, setIsNotification] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Access user data and authentication status from Redux store
  const { user, isAuthenticated, accessToken, isApproved } = useSelector(
    (state: RootState) => state.user
  );
  const isActivated = useSelector(
    (state: RootState) => state.user.mentorActivated
  );

  // Check for approval status and control modals
  // useEffect(() => {
  //   const checkApprovalStatus = async () => {
  //     try {
  //       console.log("Redux isApproved status is step", user?.mentorId);
  //       console.log("Redux isApproved status is step1", isApproved);
  //       // Handle both object and string mentorId
  //       const mentorId =
  //         typeof user?.mentorId === "string"
  //           ? user.mentorId
  //           : user?.mentorId?._id;
  //       if (!mentorId) {
  //         console.log("No mentorId found in user data");
  //         setIsSuccessModalOpen(false);
  //         setIsWelcomeModalOpen(false);
  //         dispatch(setIsApproved(""));
  //         return;
  //       }
  //       console.log("Using mentorId:", mentorId);
  //       const response = await isApprovalChecking(mentorId);
  //       console.log("isApprovalChecking response", response);
  //       console.log("user.isApproved status is", user?.mentorId?.isApproved);
  //       console.log("Redux isApproved status is step2", isApproved);

  //       const approvalStatus = response?.isApproved || "";
  //       dispatch(setIsApproved(approvalStatus));

  //       // Control SuccessStep modal for Pending status
  //       if (approvalStatus === "Pending") {
  //         console.log("step11111");
  //         setIsSuccessModalOpen(true);
  //       } else {
  //         console.log("step22222");
  //         setIsSuccessModalOpen(false);
  //       }

  //       // Control WelcomeModal for Rejected or non-activated status
  //       if (approvalStatus === "Rejected" || !isActivated) {
  //         console.log("step33333: Opening WelcomeModal", {
  //           approvalStatus,
  //           isActivated,
  //         });
  //         setIsWelcomeModalOpen(true);
  //       } else {
  //         console.log("step44444: Closing WelcomeModal", {
  //           approvalStatus,
  //           isActivated,
  //         });
  //         setIsWelcomeModalOpen(false);
  //       }
  //     } catch (error) {
  //       console.error("Error checking approval status:", error);
  //       setIsSuccessModalOpen(false);
  //       setIsWelcomeModalOpen(false);
  //       dispatch(setIsApproved(""));
  //     }
  //   };

  //   if (isAuthenticated && user?.mentorId) {
  //     checkApprovalStatus();
  //     // Poll every 30 seconds to check for updates
  //     const interval = setInterval(() => {
  //       checkApprovalStatus();
  //     }, 30000);
  //     return () => clearInterval(interval); // Cleanup on unmount
  //   }
  // }, [isAuthenticated, user?.mentorId, isApproved, isActivated, dispatch]);
  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        console.log("Redux isApproved status is step", user?.mentorId);
        console.log("Redux isApproved status is step1", isApproved);

        // Handle both object and string mentorId
        const mentorId =
          typeof user?.mentorId === "string"
            ? user.mentorId
            : user?.mentorId?._id;

        if (!mentorId) {
          console.log("No mentorId found in user data");
          setIsSuccessModalOpen(false);
          // Open WelcomeModal for non-mentor users if not activated
          if (!isActivated) {
            console.log("Opening WelcomeModal for non-mentor user", {
              isActivated,
            });
            setIsWelcomeModalOpen(true);
          } else {
            setIsWelcomeModalOpen(false);
          }
          dispatch(setIsApproved(""));
          return;
        }

        console.log("Using mentorId:", mentorId);
        const response = await isApprovalChecking(mentorId);
        console.log("isApprovalChecking response", response);
        console.log("user.isApproved status is", user?.mentorId?.isApproved);
        console.log("Redux isApproved status is step2", isApproved);

        const approvalStatus = response?.isApproved || "";
        dispatch(setIsApproved(approvalStatus));

        // Control SuccessStep modal for Pending status
        if (approvalStatus === "Pending") {
          console.log("step11111");
          setIsSuccessModalOpen(true);
        } else {
          console.log("step22222");
          setIsSuccessModalOpen(false);
        }

        // Control WelcomeModal for Rejected or non-activated status
        if (approvalStatus === "Rejected" || !isActivated) {
          console.log("step33333: Opening WelcomeModal", {
            approvalStatus,
            isActivated,
          });
          setIsWelcomeModalOpen(true);
        } else {
          console.log("step44444: Closing WelcomeModal", {
            approvalStatus,
            isActivated,
          });
          setIsWelcomeModalOpen(false);
        }
      } catch (error) {
        console.error("Error checking approval status:", error);
        setIsSuccessModalOpen(false);
        setIsWelcomeModalOpen(false);
        dispatch(setIsApproved(""));
      }
    };

    if (isAuthenticated) {
      checkApprovalStatus();
      // Poll every 30 seconds to check for updates
      const interval = setInterval(() => {
        checkApprovalStatus();
      }, 30000);
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [isAuthenticated, user, isApproved, isActivated, dispatch]);

  // Debug logs for state changes
  useEffect(() => {
    console.log("ssmple 1", isAuthenticated);
    console.log("ssmple 1.5", user);
    console.log("ssmple 2", user?.mentorId);
    console.log("ssmple 2.5", user?.mentorId?._id);
    console.log("ssmple 3", isApproved);
    console.log("ssmple 3.5", isActivated);
    console.log("ssmple 4", dispatch);
    console.log("ssmple 5: isWelcomeModalOpen", isWelcomeModalOpen);
    console.log("ssmple 6: Modal states", {
      isSuccessModalOpen,
      logoutModalOpen,
      isNotification,
    });
  }, [
    isAuthenticated,
    user?.mentorId,
    isApproved,
    isWelcomeModalOpen,
    isSuccessModalOpen,
    logoutModalOpen,
    isNotification,
  ]);

  // Set dashboard and update online status on mount (login)
  useEffect(() => {
    console.log(
      "is activated is >>>>>>>>>>mentor>>>>>>>>>>>>>>>>s",
      isActivated
    );
    dispatch(setDashboard("mentor"));
    console.log("users...mentor", user);

    if (isAuthenticated) {
      updateOnlineStatus(true, "mentor")
        .then((updatedUser) => {
          dispatch(setOnlineStatus({ status: true, role: "mentor" }));
          if (updatedUser) {
            dispatch(setUser(updatedUser));
            dispatch(setMentorActivated(updatedUser?.mentorActivated || false));
            dispatch(setIsApproved(updatedUser?.mentorId?.isApproved || ""));
          }
        })
        .catch((error) => {
          toast.error("Failed to update online status");
        });
    }
  }, [isAuthenticated, dispatch]);

  // Handle welcome form submission
  const handleWelcomeFormSubmit = async (
    formData: WelcomeFormData
  ): Promise<boolean> => {
    try {
      let imageUrl = "";
      if (formData.imageFile) {
        imageUrl = await uploadImage(formData.imageFile);
      }

      interface UpdateUserDataPayload
        extends Omit<WelcomeFormData, "imageFile"> {
        imageUrl?: string;
      }

      const payload: UpdateUserDataPayload = {
        ...formData,
        imageUrl,
      };

      if (!user || !user._id) {
        throw new Error("User ID not found. Please log in again.");
      }

      const updatedUser = await uploadMentorWelcomeForm(payload, user._id);
      if (updatedUser) {
        console.log("new updated user data is", updatedUser);
        dispatch(setUser(updatedUser));
        dispatch(setMentorActivated(true));
        dispatch(setIsApproved(updatedUser?.mentorId?.isApproved || ""));
        toast.success("Profile updated successfully!");
        setIsWelcomeModalOpen(false); // Close modal after successful submission
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update user data", error);
      toast.error("Failed to submit form. Please try again.");
      return false;
    }
  };

  // Handle sidebar item click
  const handleItemClick = (itemName: string, path?: string) => {
    if (!isAuthenticated) {
      toast.error("Please log in to continue.");
      navigate("/login");
      return;
    }
    if (!isActivated) {
      toast.error("Please complete the welcome form first.");
      setIsWelcomeModalOpen(true);
      return;
    }
    if (isApproved === "Pending") {
      toast.error("Your mentor application is pending approval.");
      return;
    }
    setActiveItem(itemName);
    if (path) navigate(path);
  };

  const openNotification = () => {
    setIsNotification(true);
  };

  const handleMouseLeave = () => {
    if (!dropdownOpen) setIsExpanded(false);
  };

  // Handle role switching
  const handleDropdownSelect = (dashboard: string) => {
    setCurrentDashboard(dashboard);
    const newRole = dashboard === "Mentor Dashboard" ? "mentor" : "mentee";
    updateOnlineStatus(true, newRole)
      .then((updatedUser) => {
        dispatch(setOnlineStatus({ status: true, role: newRole }));
        if (updatedUser) {
          dispatch(setUser(updatedUser));
          dispatch(setMentorActivated(updatedUser?.mentorActivated || false));
          dispatch(setIsApproved(updatedUser?.mentorId?.isApproved || ""));
        }
        if (dashboard === "Mentee Dashboard") {
          navigate("/seeker/dashboard");
        } else if (dashboard === "Mentor Dashboard") {
          navigate("/expert/dashboard");
        }
        setDropdownOpen(false);
      })
      .catch((error) => {
        toast.error("Failed to update online status");
      });
  };

  // Handle logout
  const handleLogout = async () => {
    console.log("handleLogout triggered");
    setLoggingOut(true);
    try {
      await updateOnlineStatus(false, null); // Clear online status
      await logout();
      toast.success("Logged out successfully!");
      setLogoutModalOpen(false);
      dispatch(resetUser());
      dispatch(setOnlineStatus({ status: false, role: null }));
      dispatch(setIsApproved(""));
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  // Debug sidebar logout click
  const handleSidebarLogoutClick = () => {
    console.log(
      "Sidebar logout button clicked, setting logoutModalOpen to true"
    );
    setLogoutModalOpen(true);
  };

  return (
    <div
      ref={sidebarRef}
      className="fixed left-4 top-4 bottom-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 z-10"
      style={{ width: isExpanded ? "240px" : "80px" }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-4">
        {isExpanded ? (
          <DropdownMenu.Root open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-2 p-2 rounded-lg bg-red-500 text-white w-full">
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
            <img src={logo} alt="Logo" />
          </button>
        )}
      </div>
      <nav className="space-y-2 px-2">
        <SidebarItem
          icon={Home}
          text="Home"
          isExpanded={isExpanded}
          active={activeItem === "Home"}
          onClick={() => handleItemClick("Home", "/expert/dashboard")}
        />
        <SidebarItem
          icon={Bell}
          text="Notification"
          isExpanded={isExpanded}
          active={activeItem === "Notification"}
          onClick={openNotification}
        />
        <SidebarItem
          icon={Phone}
          text="Bookings"
          isExpanded={isExpanded}
          active={activeItem === "Bookings"}
          onClick={() => handleItemClick("Bookings", "/expert/booking")}
        />
        <SidebarItem
          icon={HandCoins}
          text="Services"
          isExpanded={isExpanded}
          active={activeItem === "Services"}
          onClick={() => handleItemClick("Services", "/expert/services")}
        />
        <SidebarItem
          icon={MessageSquareCode}
          text="Priority"
          isExpanded={isExpanded}
          active={activeItem === "Priority"}
          onClick={() => handleItemClick("Priority", "/expert/prioritydm")}
        />
        <SidebarItem
          icon={Heart}
          text="Testimonials"
          isExpanded={isExpanded}
          active={activeItem === "Testimonials"}
          onClick={() =>
            handleItemClick("Testimonials", "/expert/testimonials")
          }
        />
        <SidebarItem
          icon={CalendarDays}
          text="Calender"
          isExpanded={isExpanded}
          active={activeItem === "Calender"}
          onClick={() => handleItemClick("Calender", "/expert/calender")}
        />
        <SidebarItem
          icon={Wallet}
          text="Payment History"
          isExpanded={isExpanded}
          active={activeItem === "Payment"}
          onClick={() => handleItemClick("Payment", "/expert/payment")}
        />
        <SidebarItem
          icon={FileText}
          text="Profile Details"
          isExpanded={isExpanded}
          active={activeItem === "Profile Details"}
          onClick={() => handleItemClick("Profile Details", "/expert/profile")}
        />
        <SidebarItem
          icon={Video}
          text="Video Call"
          isExpanded={isExpanded}
          active={activeItem === "Video Call"}
          onClick={() => handleItemClick("Video Call", "/user/meetinghome")}
        />
      </nav>
      <div className="absolute bottom-4 w-full px-2">
        {user?.firstName && (
          <SidebarItem2
            icon={() => (
              <img
                src={user?.profilePicture || "https://via.placeholder.com/24"}
                alt="Profile"
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
            text={
              <div className="flex flex-col">
                <span className="font-sm">
                  {user.firstName.charAt(0).toUpperCase() +
                    user.firstName.slice(1)}{" "}
                  {user.lastName
                    ? user.lastName.charAt(0).toUpperCase() +
                      user.lastName.slice(1)
                    : ""}
                </span>
                <span className="text-xs text-gray-500">{user.email}</span>
              </div>
            }
            isExpanded={isExpanded}
          />
        )}
        <SidebarItem
          icon={LogOut}
          text="Logout"
          isExpanded={isExpanded}
          onClick={handleSidebarLogoutClick}
        />
      </div>
      <LogoutConfirmationModal
        open={logoutModalOpen}
        onOpenChange={setLogoutModalOpen}
        onConfirm={handleLogout}
        loggingOut={loggingOut}
      />
      <WelcomeModalForm1
        key={`welcome-modal-${isWelcomeModalOpen ? "open" : "closed"}`}
        open={isWelcomeModalOpen}
        onOpenChange={(open) => {
          console.log("WelcomeModal onOpenChange: open=", open);
          // Only update state if user explicitly closes the modal
          if (!open && isWelcomeModalOpen) {
            setIsWelcomeModalOpen(false);
          }
        }}
        onSubmit={handleWelcomeFormSubmit}
      />
      <Toaster position="top-right" />
      <Notification open={isNotification} onOpenChange={setIsNotification} />
      {isSuccessModalOpen && (
        <SuccessStep
          setLogoutModalOpen={setLogoutModalOpen}
          loggingOut={loggingOut}
          handleLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default MentorSidebar;
