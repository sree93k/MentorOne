import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";

import {
  Home,
  FileText,
  Phone,
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
import { LogoutConfirmationModal } from "@/components/modal/Logout";
import { logout } from "@/services/userAuthService";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Notification from "../users/Notification";
import WelcomeModalForm1 from "./MentorWelcomeModal";
import SuccessStep from "@/components/mentor/WelcomeComponents/SuccessStep";
import {
  setError,
  setUser,
  resetUser,
  setMentorActivated,
  setDashboard,
  setOnlineStatus,
  setIsApproved,
  setReason,
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

  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        console.log(
          "useEffect checkApprovalStatus isAuthenticated is",
          isAuthenticated
        );
        console.log("useEffect checkApprovalStatus user is", user);
        console.log("useEffect checkApprovalStatus isApproved is", isApproved);
        console.log(
          "useEffect checkApprovalStatus isActivated is",
          isActivated
        );
        console.log("useEffect checkApprovalStatus dispatch is", dispatch);
        console.log("Redux isApproved status is step", user?.mentorId);
        console.log("Redux isApproved status is step1", isApproved);

        const mentorId =
          typeof user?.mentorId === "string"
            ? user.mentorId
            : user?.mentorId?._id;

        if (!mentorId) {
          console.log("No mentorId found in user data");
          setIsSuccessModalOpen(false);
          if (!isActivated) {
            console.log("Opening WelcomeModal for non-mentor user", {
              isActivated,
            });
            setIsWelcomeModalOpen(true);
          } else {
            setIsWelcomeModalOpen(false);
          }
          dispatch(setIsApproved(""));
          setApprovalReason(null);
          return;
        }

        console.log("Using mentorId:", mentorId);
        const response = await isApprovalChecking(mentorId);
        console.log("isApprovalChecking response", response);
        console.log("user.isApproved status is", user?.mentorId?.isApproved);
        console.log("Redux isApproved status is step2", isApproved);

        const { isApproved: approvalStatus, approvalReason } = response;
        console.log("isapproval status", approvalStatus);
        console.log("approval reason", approvalReason);

        dispatch(setIsApproved(approvalStatus || ""));
        dispatch(setReason(approvalReason));
        setApprovalReason(approvalReason);

        if (approvalStatus === "Pending") {
          console.log("step11111");
          setIsSuccessModalOpen(true);
        } else {
          console.log("step22222");
          setIsSuccessModalOpen(false);
        }

        if (approvalStatus === "Rejected" || !isActivated) {
          console.log("step33333: Opening WelcomeModal", {
            approvalStatus,
            isActivated,
            approvalReason,
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

  useEffect(() => {
    console.log("User object:", user);
    console.log("Profile picture in Redux:", user?.profilePicture);
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
      approvalReason,
    });
  }, [
    isAuthenticated,
    user,
    isApproved,
    isWelcomeModalOpen,
    isSuccessModalOpen,
    logoutModalOpen,
    isNotification,
    approvalReason,
  ]);

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
          dispatch(setError(error));
          toast.error("Failed to update online status");
        });
    }
  }, [isAuthenticated, dispatch]);

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
      console.log("++++++++     UPDATED PAYLOAD DATA   ", payload);

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

  const openNotification = () => {
    setIsNotification(true);
  };

  const handleMouseLeave = () => {
    if (!dropdownOpen) setIsExpanded(false);
  };

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
            icon={() => {
              console.log("Rendering profile picture:", user?.profilePicture);
              return (
                <img
                  src={user?.profilePicture}
                  alt="Profile"
                  className="w-6 h-6 rounded-full object-cover"
                  onError={(e) => {
                    console.error("Profile picture failed to load:", {
                      url: user?.profilePicture,
                      // error: e.currentTarget.error,
                    });
                  }}
                  onLoad={() =>
                    console.log(
                      "Profile picture loaded successfully:",
                      user?.profilePicture
                    )
                  }
                />
              );
            }}
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
