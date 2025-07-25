import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";

import {
  Home,
  FileText,
  Phone,
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
import { LogoutConfirmationModal } from "@/components/modal/Logout";
import { logout } from "@/services/userAuthService";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Notification from "../users/Notification";
import WelcomeModalForm1 from "./MentorWelcomeModal";
import SuccessStep from "@/components/mentor/WelcomeComponents/SuccessStep";
import SocketService from "@/services/socketService";
import { io } from "socket.io-client";
import {
  setError,
  setUser,
  resetUser,
  setMentorActivated,
  setDashboard,
  setOnlineStatus,
  setIsApproved,
  setReason,
  // NEW: Import notification actions
  setNotificationCounts,
  incrementNotificationCount,
  clearNotificationCount,
  decrementNotificationCount,
  clearUnseenNotificationCount,
  setUnseenNotificationCounts,
  markAllNotificationsAsRead, // ✅ ADD THIS
} from "@/redux/slices/userSlice";
import {
  uploadMentorWelcomeForm,
  uploadImage,
  isApprovalChecking,
} from "@/services/mentorService";
import { updateOnlineStatus } from "@/services/userServices";
// Import secure components - ProfilePicture for user images, regular img for static assets
import logo from "@/assets/Logo2.png";
// NEW: Import notification badge
import NotificationBadge from "@/components/users/NotificationBadge";
// NEW: Import enhanced notification services
import {
  initializeNotificationsWithCounts,
  cleanupNotifications,
  markAllNotificationsAsSeen,
  getUnseenNotificationCounts,
} from "@/services/userServices";

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
  text: string | React.ReactNode;
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
  const [approvalReason, setApprovalReason] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isNotification, setIsNotification] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated, isApproved } = useSelector(
    (state: RootState) => state.user
  );
  const isActivated = useSelector(
    (state: RootState) => state.user.mentorActivated
  );

  // ✅ UPDATED: Access notification counts from Redux
  const { notifications } = useSelector((state: RootState) => state.user);
  const currentRole = "mentor"; // This sidebar is for mentors
  // const notificationCount = notifications.mentorCount; // Dynamic count from Redux
  const notificationCount = notifications.mentorUnseenCount;
  // Approval checking useEffect (keep existing logic)
  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        console.log(
          "useEffect checkApprovalStatus isAuthenticated is",
          isAuthenticated
        );

        const mentorId =
          typeof user?.mentorId === "string"
            ? user.mentorId
            : user?.mentorId?._id;

        if (!mentorId) {
          console.log("No mentorId found in user data");
          setIsSuccessModalOpen(false);
          if (!isActivated) {
            setIsWelcomeModalOpen(true);
          } else {
            setIsWelcomeModalOpen(false);
          }
          dispatch(setIsApproved(""));
          setApprovalReason(null);
          return;
        }

        const response = await isApprovalChecking(mentorId);
        const { isApproved: approvalStatus, approvalReason } = response;

        dispatch(setIsApproved(approvalStatus || ""));
        dispatch(setReason(approvalReason));
        setApprovalReason(approvalReason);

        if (approvalStatus === "Pending") {
          setIsSuccessModalOpen(true);
        } else {
          setIsSuccessModalOpen(false);
        }

        if (approvalStatus === "Rejected" || !isActivated) {
          setIsWelcomeModalOpen(true);
        } else {
          setIsWelcomeModalOpen(false);
        }
      } catch (error) {
        console.error("Error checking approval status:", error);
        dispatch(setError(error));
        setIsSuccessModalOpen(false);
        setIsWelcomeModalOpen(false);
        dispatch(setIsApproved(""));
        setApprovalReason(null);
      }
    };

    if (isAuthenticated) {
      checkApprovalStatus();
      const interval = setInterval(() => {
        checkApprovalStatus();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user, isApproved, isActivated, dispatch]);

  // Initial dashboard setup
  useEffect(() => {
    dispatch(setDashboard("mentor"));

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
          dispatch(setError(error));
          toast.error("Failed to update online status");
        });
    }
  }, [isAuthenticated, dispatch]);

  // ✅ UPDATED: Initialize notifications and sync counts
  // useEffect(() => {
  //   if (!isAuthenticated || !user?._id) return;

  //   console.log("🔔 Initializing mentor notifications for user:", user._id);
  //   cleanupNotifications();
  //   const fetchInitialCounts = async () => {
  //     try {
  //       const counts = await getUnseenNotificationCounts();
  //       console.log("🔍 DEBUG: Fetched counts from API:", counts); // ✅ ADD THIS
  //       dispatch(setUnseenNotificationCounts(counts));
  //       console.log(
  //         "🔍 DEBUG: Current Redux state after dispatch:",
  //         notifications
  //       ); // ✅ ADD THIS
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
  //     console.log(
  //       "🔍 DEBUG: Current mentor unseen count before increment:",
  //       notifications.mentorUnseenCount
  //     ); // ✅ ADD THIS

  //     if (
  //       notification.targetRole === "mentor" ||
  //       notification.targetRole === "both"
  //     ) {
  //       dispatch(incrementNotificationCount({ role: "mentor" }));
  //       console.log("🔍 DEBUG: Incremented mentor count"); // ✅ ADD THIS
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

  //     if (data.role === "mentor") {
  //       if (data.increment > 0) {
  //         dispatch(incrementNotificationCount({ role: "mentor" }));
  //       } else {
  //         dispatch(decrementNotificationCount({ role: "mentor" }));
  //       }
  //     }
  //   };

  //   // try {
  //   //   initializeNotificationsWithCounts(
  //   //     user._id,
  //   //     handleNewNotification,
  //   //     handleCountUpdate
  //   //   );
  //   // } catch (error) {
  //   //   console.error("Failed to initialize notifications:", error);
  //   //   // Don't crash the app, just log the error
  //   // }
  //   try {
  //     // ✅ Don't use socket for initial counts, just use the direct API call
  //     // The fetchInitialCounts() already handles this correctly

  //     // Only initialize socket for real-time updates
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
    cleanupNotifications();
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

    // socket.on("new_notification", (notification) => {
    //   console.log("📨 NUCLEAR: New notification:", notification);
    //   if (
    //     notification.targetRole === currentRole || // ✅ Change currentRole to "mentor"/"mentee"
    //     notification.targetRole === "both"
    //   ) {
    //     dispatch(incrementNotificationCount({ role: currentRole }));
    //     toast.success(
    //       `New notification: ${notification.content || "No content"}`
    //     );
    //   }
    // });

    // socket.on("notification_count_update", (data) => {
    //   console.log("📊 NUCLEAR: Count update:", data);
    //   if (data.role === currentRole) {
    //     if (data.increment > 0) {
    //       dispatch(incrementNotificationCount({ role: currentRole }));
    //     } else {
    //       dispatch(decrementNotificationCount({ role: currentRole }));
    //     }
    //   }
    // });
    let countUpdatedByNotification = false;

    socket.on("new_notification", (notification) => {
      console.log("📨 NUCLEAR: New notification:", notification);
      if (
        notification.targetRole === currentRole ||
        notification.targetRole === "both"
      ) {
        dispatch(incrementNotificationCount({ role: currentRole }));
        countUpdatedByNotification = true; // ✅ SET FLAG
        toast.success(
          `New notification: ${notification.content || "No content"}`
        );

        // Reset flag after 1 second
        setTimeout(() => {
          countUpdatedByNotification = false;
        }, 1000);
      }
    });

    socket.on("notification_count_update", (data) => {
      console.log("📊 NUCLEAR: Count update:", data);

      // ✅ ONLY UPDATE IF NOT ALREADY UPDATED BY NOTIFICATION
      if (!countUpdatedByNotification && data.role === currentRole) {
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
        dispatch(setUser(updatedUser));
        dispatch(setMentorActivated(true));
        dispatch(setIsApproved(updatedUser?.mentorId?.isApproved || ""));
        toast.success("Profile updated successfully!");
        setIsWelcomeModalOpen(false);
        return true;
      }
      return false;
    } catch (error) {
      dispatch(setError(error));
      console.error("Failed to update user data", error);
      toast.error("Failed to submit form. Please try again.");
      return false;
    }
  };

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

  const openNotification = async () => {
    console.log("🔔 Opening notification panel, marking as seen for mentor");
    console.log(
      "🔍 markAllNotificationsAsSeen function:",
      typeof markAllNotificationsAsSeen
    ); // ✅ ADD THIS DEBUG

    try {
      await markAllNotificationsAsSeen("mentor");
      console.log("✅ Successfully marked mentor notifications as seen"); // ✅ ADD THIS

      // Clear the unseen count for mentor role
      dispatch(clearUnseenNotificationCount({ role: "mentor" }));

      setIsNotification(true);
    } catch (error) {
      console.error("Failed to mark notifications as seen:", error);
      // Still open the panel even if marking as seen fails
      setIsNotification(true);
    }
  };

  const handleMouseLeave = () => {
    if (!dropdownOpen) setIsExpanded(false);
  };

  // Handle role switching with enhanced cleanup
  const handleDropdownSelect = (dashboard: string) => {
    console.log("🔄 MentorSidebar: Switching dashboard to:", dashboard);

    // Clean up current notifications before switching
    if (dashboard !== "Mentor Dashboard") {
      console.log(
        "🧹 MentorSidebar: Cleaning up mentor notifications before switch"
      );
      cleanupNotifications();
    }

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

        // Navigate to appropriate dashboard
        if (dashboard === "Mentee Dashboard") {
          navigate("/seeker/dashboard");
        } else if (dashboard === "Mentor Dashboard") {
          navigate("/expert/dashboard");
        }

        setDropdownOpen(false);

        // // Re-initialize notifications for new role after a short delay
        // if (user?._id) {
        //   setTimeout(() => {
        //     console.log(
        //       `🔔 MentorSidebar: Re-initializing notifications for ${newRole}`
        //     );
        //     initializeNotificationsWithCounts(
        //       user._id,
        //       (notification: any) => {
        //         if (
        //           notification.targetRole === newRole ||
        //           notification.targetRole === "both"
        //         ) {
        //           dispatch(incrementNotificationCount({ role: newRole }));
        //           toast.success(
        //             `New notification: ${notification.content || "No content"}`
        //           );
        //         }
        //       },
        //       (data: { role: "mentor" | "mentee"; increment: number }) => {
        //         if (data.role === newRole) {
        //           if (data.increment > 0) {
        //             dispatch(incrementNotificationCount({ role: newRole }));
        //           } else {
        //             dispatch(decrementNotificationCount({ role: newRole }));
        //           }
        //         }
        //       }
        //     );
        //   }, 1000);
        // }
        if (user?._id) {
          setTimeout(async () => {
            console.log(
              `🔔 MentorSidebar: Re-initializing notifications for ${newRole}`
            );

            // ✅ FETCH INITIAL UNSEEN COUNTS FOR NEW ROLE
            try {
              const counts = await getUnseenNotificationCounts();
              dispatch(setUnseenNotificationCounts(counts));
              console.log(
                `📊 Initial unseen notification counts loaded for ${newRole}:`,
                counts
              );
            } catch (error) {
              console.error(
                `Failed to fetch initial unseen notification counts for ${newRole}:`,
                error
              );
            }

            initializeNotificationsWithCounts(
              user._id,
              (notification: any) => {
                if (
                  notification.targetRole === newRole ||
                  notification.targetRole === "both"
                ) {
                  dispatch(incrementNotificationCount({ role: newRole }));
                  toast.success(
                    `New notification: ${notification.content || "No content"}`
                  );
                }
              },
              (data: { role: "mentor" | "mentee"; increment: number }) => {
                if (data.role === newRole) {
                  if (data.increment > 0) {
                    dispatch(incrementNotificationCount({ role: newRole }));
                  } else {
                    dispatch(decrementNotificationCount({ role: newRole }));
                  }
                }
              }
            );
          }, 1000);
        }
      })
      .catch((error) => {
        console.error(
          "❌ MentorSidebar: Failed to update online status:",
          error
        );
        dispatch(setError(error));
        toast.error("Failed to update online status");
      });
  };

  const handleLogout = async () => {
    console.log("handleLogout triggered");
    setLoggingOut(true);
    try {
      await updateOnlineStatus(false, null);
      await logout();
      toast.success("Logged out successfully!");
      setLogoutModalOpen(false);
      dispatch(resetUser());
      dispatch(setOnlineStatus({ status: false, role: null }));
      dispatch(setIsApproved(""));
      navigate("/");
    } catch (error) {
      dispatch(setError(error));
      toast.error("Failed to logout. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

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
          onClick={() => handleItemClick("Home", "/expert/dashboard")}
        />

        {/* ✅ UPDATED: Dynamic Notification Badge */}
        <SidebarItem
          icon={() => (
            <NotificationBadge
              count={notificationCount} // ✅ DYNAMIC: From Redux state
              role="mentor"
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
          <div
            className={`flex items-center gap-4 px-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-700`}
          >
            {/* Simple User Circle Icon instead of ProfilePicture */}
            <UserCircle2
              size={24}
              className="text-gray-600 dark:text-gray-400"
            />
            <span
              className={`text-gray-700 dark:text-gray-300 whitespace-nowrap transition-all duration-300 ${
                isExpanded ? "opacity-100" : "opacity-0 w-0"
              }`}
            >
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
            </span>
          </div>
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
