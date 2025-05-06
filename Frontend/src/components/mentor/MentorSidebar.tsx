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
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogoutConfirmationModal } from "@/components/modal/Logout";
import { logout } from "@/services/userAuthService";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Notification from "../users/Notification";
import WelcomeModalForm1 from "./MentorWelcomeModal";
import {
  setUser,
  resetUser,
  setMentorActivated,
  setDashboard,
} from "@/redux/slices/userSlice";
import { uploadMentorWelcomeForm, uploadImage } from "@/services/mentorService";
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

const MentorSidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentDashboard, setCurrentDashboard] = useState("Mentor Dashboard");
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isNotification, setIsNotification] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //   const user = useSelector((state: RootState) => state.user.user);
  // Access user data and authentication status from Redux store
  const { user, isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.user
  );
  //   const isAuthenticated = useSelector(
  //     (state: RootState) => state.user.isAuthenticated
  //   );
  const isActivated = useSelector(
    (state: RootState) => state.user.mentorActivated
  );
  useEffect(() => {
    console.log(
      "is activated is >>>>>>>>>>mentor>>>>>>>>>>>>>>>>s",
      isActivated
    );
    dispatch(setDashboard("mentor"));
    console.log("users", user);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to continue.");
      navigate("/login");
    } else if (!isActivated) {
      console.log("is activated..mentor activated", isActivated);
      console.log("modal true>>>>>>>>>>>>>>>", isWelcomeModalOpen);
      setIsWelcomeModalOpen(true);
      console.log("modal isWelcomeModalOpen", isWelcomeModalOpen);
    }
  }, [isAuthenticated, isActivated, navigate]);

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
        console.log(
          "uddate user mentor actvatedis",
          updatedUser.mentorActivated
        );
        console.log("update user activated is ", updatedUser.activated);
        dispatch(setUser(updatedUser));
        dispatch(setMentorActivated(true));
        toast.success("Profile updated successfully!");
        return true;
      }
      return false;
    } catch (error) {
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
    if (dashboard === "Mentee Dashboard") {
      navigate("/seeker/dashboard");
    } else if (dashboard === "Mentor Dashboard") {
      navigate("/expert/dashboard");
    }
    setDropdownOpen(false);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("Logged out successfully!");
      setLogoutModalOpen(false);
      dispatch(resetUser());
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    // <div
    //   ref={sidebarRef}
    //   className="fixed left-4 top-4 bottom-4 bg-white rounded-xl shadow-lg transition-all duration-300 z-10"
    //   style={{ width: isExpanded ? "240px" : "80px" }}
    //   onMouseEnter={() => setIsExpanded(true)}
    //   onMouseLeave={handleMouseLeave}
    // >
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
              {/* <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 w-full"> */}
              <button className="flex items-center gap-2 p-2 rounded-lg bg-red-500  text-white w-full">
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
        {/* <SidebarItem icon={HandCoins} text="Services" isExpanded={isExpanded} /> */}
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

        {/* <SidebarItem
        icon={Wallet}
        text="Payment History"
        isExpanded={isExpanded}
      /> */}
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
      </nav>
      <div className="absolute bottom-4 w-full px-2">
        {/* User Profile SidebarItem (shown in both expanded and collapsed states) */}
        {/* {user?.firstName && (
          <SidebarItem
            icon={() => (
              <img
                src={user?.profilePicture || "https://via.placeholder.com/24"} // Fallback image if profilePicture is null
                alt="Profile"
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
            text={`${
              user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)
            } ${
              user.lastName
                ? user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)
                : ""
            }`}
            isExpanded={isExpanded}
          />
        )} */}
        {user?.firstName && (
          <SidebarItem
            icon={() => (
              <img
                src={user?.profilePicture || "https://via.placeholder.com/24"}
                alt="Profile"
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
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
  );
};

export default MentorSidebar;
