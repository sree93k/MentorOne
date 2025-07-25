import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import {
  Home,
  FileText,
  Phone,
  LogOut,
  ChevronDown,
  UserCircle2,
  Wallet,
  Video,
} from "lucide-react";
import { io } from "socket.io-client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogoutConfirmationModal } from "@/components/modal/Logout";
import { logout } from "@/services/userAuthService";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import WelcomeModalForm1 from "./MenteeWelcomeModal";
import SocketService from "@/services/socketService";
import {
  setUser,
  resetUser,
  setActivated,
  setDashboard,
  setOnlineStatus,
  setNotificationCounts,
  incrementNotificationCount,
  clearNotificationCount,
  setUnseenNotificationCounts,
  clearUnseenNotificationCount, // ✅ ADD THIS MISSING IMPORT
  decrementNotificationCount,
} from "@/redux/slices/userSlice";
import { uploadMenteeWelcomeForm } from "@/services/menteeService";
import { updateOnlineStatus } from "@/services/userServices";
import Notification from "../users/Notification";
// Import secure components
import { ProfilePicture } from "@/components/users/SecureMedia";
import logo from "@/assets/logo.png";
// NEW: Import notification badge
import NotificationBadge from "@/components/users/NotificationBadge";
// NEW: Import enhanced notification services
import {
  initializeNotificationsWithCounts,
  cleanupNotifications,
  getUnseenNotificationCounts,
  markAllNotificationsAsSeen, // ✅ ADD THIS MISSING IMPORT
} from "@/services/userServices";

interface WelcomeFormData {
  userType: string;
  schoolName?: string;
  currentClass?: string;
  course?: string;
  specialization?: string;
  collegeName?: string;
  startYear?: string;
  endYear?: string;
  experience?: string;
  jobRole?: string;
  company?: string;
  currentlyWorking?: boolean;
  city: string;
  careerGoal?: string;
  interestedCareer?: string[];
  selectedOptions?: string[];
}

const SidebarItem = ({
  icon: Icon,
  text,
  isExpanded,
  active = false,
  onClick,
}: {
  icon: any;
  text: string | React.ReactNode;
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

const MenteeSidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentDashboard, setCurrentDashboard] = useState("Mentee Dashboard");
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isNotification, setIsNotification] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Access user data and authentication status from Redux store
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
  const isActivated = useSelector((state: RootState) => state.user.activated);

  // ✅ UPDATED: Access notification counts from Redux
  const { notifications } = useSelector((state: RootState) => state.user);
  const currentRole = "mentee"; // This sidebar is for mentees
  // const notificationCount = notifications.menteeCount; // Dynamic count from Redux
  const notificationCount = notifications.menteeUnseenCount;
  // Set dashboard and update online status on mount (login)
  useEffect(() => {
    dispatch(setDashboard("mentee"));
    console.log(
      "is activated is >>>>>>>>>mentee>>>>>>>>>>>>>>>>>s",
      isActivated
    );

    console.log("users...mentee", user);
    console.log("user.isapproved statuys is", user?.mentorId?.isApproved);

    if (isAuthenticated) {
      updateOnlineStatus(true, "mentee")
        .then((updatedUser) => {
          dispatch(setOnlineStatus({ status: true, role: "mentee" }));
          if (updatedUser) {
            dispatch(setUser(updatedUser));
          }
        })
        .catch((error) => {
          console.log("err", error);
          toast.error("Failed to update online status");
        });
    }
  }, [isAuthenticated, dispatch]);

  // ✅ UPDATED: Initialize notifications and sync counts
  // useEffect(() => {
  //   if (!isAuthenticated || !user?._id) return;

  //   console.log("🔔 Initializing mentee notifications for user:", user._id);

  //   // Get initial notification counts
  //   // const fetchInitialCounts = async () => {
  //   //   try {
  //   //     const counts = await getNotificationCounts();
  //   //     dispatch(setNotificationCounts(counts));
  //   //     console.log("📊 Initial notification counts loaded:", counts);
  //   //   } catch (error) {
  //   //     console.error("Failed to fetch initial notification counts:", error);
  //   //   }
  //   // };
  //   const fetchInitialCounts = async () => {
  //     try {
  //       const counts = await getUnseenNotificationCounts(); // ✅ CHANGED
  //       dispatch(setUnseenNotificationCounts(counts)); // ✅ CHANGED
  //       console.log("📊 Initial unseen notification counts loaded:", counts);
  //     } catch (error) {
  //       console.error(
  //         "Failed to fetch initial unseen notification counts:",
  //         error
  //       );
  //     }
  //   };

  //   fetchInitialCounts();

  //   // Initialize real-time notifications
  //   const handleNewNotification = (notification: any) => {
  //     console.log("🔔 New notification received:", notification);

  //     // Only increment count if notification is for mentee role
  //     if (
  //       notification.targetRole === "mentee" ||
  //       notification.targetRole === "both"
  //     ) {
  //       dispatch(incrementNotificationCount({ role: "mentee" }));
  //       toast.success(
  //         `New notification: ${notification.content || "No content"}`
  //       );
  //     }
  //   };

  //   const handleCountUpdate = (data: {
  //     role: "mentor" | "mentee";
  //     increment: number;
  //   }) => {
  //     console.log("📊 Count update received:", data);

  //     if (data.role === "mentee") {
  //       if (data.increment > 0) {
  //         dispatch(incrementNotificationCount({ role: "mentee" }));
  //       } else {
  //         dispatch(decrementNotificationCount({ role: "mentee" }));
  //       }
  //     }
  //   };

  //   try {
  //     // initializeNotificationsWithCounts(
  //     //   user._id,
  //     //   handleNewNotification,
  //     //   handleCountUpdate
  //     // );
  //     // ✅ ADD THIS LINE
  //     SocketService.connect("/notifications", user._id);
  //     SocketService.onNewNotification(handleNewNotification);
  //     SocketService.onNotificationCountUpdate(handleCountUpdate);

  //     console.log("✅ Real-time notifications initialized successfully");
  //   } catch (error) {
  //     console.error("Failed to initialize notifications:", error);
  //   }

  //   return () => {
  //     cleanupNotifications();
  //   };
  // }, [isAuthenticated, user?._id, dispatch]);
  useEffect(() => {
    if (!isAuthenticated || !user?._id) return;

    console.log("🔔 NUCLEAR: Initializing notifications for user:", user._id);

    const fetchInitialCounts = async () => {
      try {
        const counts = await getUnseenNotificationCounts();
        dispatch(setUnseenNotificationCounts(counts));
        console.log("📊 Counts loaded:", counts);
      } catch (error) {
        console.error("Failed to fetch counts:", error);
      }
    };

    fetchInitialCounts();

    // ✅ NUCLEAR: Direct socket connection
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";
    const socket = io(`${API_URL}/notifications`, {
      withCredentials: true,
      reconnection: true,
    });

    socket.on("connect", () => {
      console.log("✅ NUCLEAR: Socket connected", socket.id);
      socket.emit("join", user._id);
    });

    socket.on("new_notification", (notification) => {
      console.log("📨 NUCLEAR: New notification:", notification);
      if (
        notification.targetRole === currentRole || // ✅ Change currentRole to "mentor"/"mentee"
        notification.targetRole === "both"
      ) {
        dispatch(incrementNotificationCount({ role: currentRole }));
        toast.success(
          `New notification: ${notification.content || "No content"}`
        );
      }
    });

    socket.on("notification_count_update", (data) => {
      console.log("📊 NUCLEAR: Count update:", data);
      if (data.role === currentRole) {
        if (data.increment > 0) {
          dispatch(incrementNotificationCount({ role: currentRole }));
        } else {
          dispatch(decrementNotificationCount({ role: currentRole }));
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, user?._id, dispatch]);

  // Check authentication and activation status
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to continue.");
      navigate("/login");
    } else if (!isActivated) {
      setIsWelcomeModalOpen(true);
    }
  }, [isAuthenticated, isActivated, navigate]);

  // Handle welcome form submission
  const handleWelcomeFormSubmit = async (
    formData: WelcomeFormData
  ): Promise<boolean> => {
    try {
      console.log("welcome sidebar 1 submit", user);
      if (!user || !user._id) {
        throw new Error("User ID not found. Please log in again.");
      }
      console.log("access token >>");

      const updatedUser = await uploadMenteeWelcomeForm(formData, user._id);
      console.log("welcome sidebar 2 submit", updatedUser);
      if (updatedUser) {
        dispatch(setUser(updatedUser));
        dispatch(setActivated(true));
        setIsWelcomeModalOpen(false);
        toast.success("Profile updated successfully!");
      }
      return true;
    } catch (error) {
      console.error("Failed to update user data", error);
      toast.error("Failed to submit form. Please try again.");
      return false;
    }
  };

  // Handle logout
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await updateOnlineStatus(false, null); // Clear online status
      const response = await logout();
      console.log("logout response is ", response);
      toast.success("Logged out successfully!");
      setLogoutModalOpen(false);
      dispatch(resetUser());
      dispatch(setOnlineStatus({ status: false, role: null }));
      navigate("/");
    } catch (error) {
      console.log("err", error);
      toast.error("Failed to logout. Please try again.");
    } finally {
      setLoggingOut(false);
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
    console.log("path and navigate", itemName, "and ", path);
    setActiveItem(itemName);
    if (path) navigate(path);
  };

  const openNotification = async () => {
    console.log("🔔 Opening notification panel, marking as seen for mentee");

    try {
      // Mark all notifications as seen when panel opens
      await markAllNotificationsAsSeen("mentee");

      // Clear the unseen count for mentee role
      dispatch(clearUnseenNotificationCount({ role: "mentee" }));

      setIsNotification(true);
    } catch (error) {
      console.error("Failed to mark notifications as seen:", error);
      // Still open the panel even if marking as seen fails
      setIsNotification(true);
    }
  };

  const handleMouseLeave = () => {
    if (!dropdownOpen) {
      setIsExpanded(false);
    }
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
        }
        if (dashboard === "Mentee Dashboard") {
          navigate("/seeker/dashboard");
        } else if (dashboard === "Mentor Dashboard") {
          navigate("/expert/dashboard");
        }
        setDropdownOpen(false);
      })
      .catch((error) => {
        console.log("err", error);
        toast.error("Failed to update online status");
      });
  };

  return (
    <>
      <div
        ref={sidebarRef}
        className="fixed left-4 top-4 bottom-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 z-10"
        style={{ width: isExpanded ? "240px" : "80px" }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={handleMouseLeave}
      >
        <div className="p-4">
          {isExpanded ? (
            <DropdownMenu.Root
              open={dropdownOpen}
              onOpenChange={setDropdownOpen}
            >
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-2 p-2 rounded-lg bg-black text-white w-full">
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
              <img src={logo} alt="Logo" className="w-full h-auto" />
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

          {/* ✅ UPDATED: Dynamic Notification Badge */}
          <SidebarItem
            icon={() => (
              <NotificationBadge
                count={notificationCount} // ✅ DYNAMIC: From Redux state
                role="mentee"
                onClick={openNotification}
                size={24}
              />
            )}
            text="Notification"
            isExpanded={isExpanded}
            active={activeItem === "Notification"}
            onClick={openNotification}
          />

          <SidebarItem
            icon={FileText}
            text="Profile Details"
            isExpanded={isExpanded}
            active={activeItem === "Profile Details"}
            onClick={() =>
              handleItemClick("Profile Details", "/seeker/profile")
            }
          />
          <SidebarItem
            icon={Phone}
            text="Bookings"
            isExpanded={isExpanded}
            active={activeItem === "Bookings"}
            onClick={() => handleItemClick("Bookings", "/seeker/bookings")}
          />
          <SidebarItem
            icon={Wallet}
            text="Payment History"
            isExpanded={isExpanded}
            active={activeItem === "Payment History"}
            onClick={() =>
              handleItemClick("Payment History", "/seeker/payment")
            }
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
            <SidebarItem
              icon={() => {
                console.log("Rendering ProfilePicture with:", {
                  profilePicture: user?.profilePicture,
                  userName: `${user.firstName} ${user.lastName || ""}`,
                  size: "xs",
                });

                return (
                  <ProfilePicture
                    profilePicture={user?.profilePicture}
                    userName={`${user.firstName} ${user.lastName || ""}`}
                    size="sm"
                  />
                );
              }}
              text={
                <div className="flex flex-col">
                  <span className="font-medium">
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
            active={activeItem === "Logout"}
            onClick={() => setLogoutModalOpen(true)}
          />
        </div>

        <LogoutConfirmationModal
          open={logoutModalOpen}
          onOpenChange={setLogoutModalOpen}
          onConfirm={handleLogout}
          loggingOut={loggingOut}
        />

        <WelcomeModalForm1
          open={isWelcomeModalOpen}
          onOpenChange={setIsWelcomeModalOpen}
          onSubmit={handleWelcomeFormSubmit}
        />
        <Toaster position="top-right" />
        <Notification open={isNotification} onOpenChange={setIsNotification} />
      </div>
    </>
  );
};

export default MenteeSidebar;
