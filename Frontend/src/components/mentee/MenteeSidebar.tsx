import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store"; // Adjust the import based on your store setup
import {
  Home,
  FileText,
  Phone,
  Clock,
  Bell,
  LogOut,
  ChevronDown,
  UserCircle2,
  Wallet,
} from "lucide-react";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogoutConfirmationModal } from "@/components/modal/Logout";
import { logout } from "@/services/userAuthService";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import WelcomeModalForm1 from "./MenteeWelcomeModal";
import { setUser, resetUser, setActivated } from "@/redux/slices/userSlice"; // Import action to update user
import { uploadMenteeWelcomeForm } from "@/services/menteeService";
import Notification from "../users/Notification";
import logo from "@/assets/logo.png";
import { log } from "node:console";

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
  const { user, isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.user
  );
  const isActivated = useSelector((state: RootState) => state.user.activated);
  useEffect(() => {
    console.log(
      "is activated is >>>>>>>>>mentee>>>>>>>>>>>>>>>>>s",
      isActivated
    );
    console.log("users", user);
  }, []);

  // Check authentication and activation status on mount
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to continue.");
      navigate("/login");
    } else if (!isActivated) {
      setIsWelcomeModalOpen(true); // Open modal if user is not activated
    }
  }, [isAuthenticated, isActivated, navigate]);
  // Handle form submission with typed formData
  const handleWelcomeFormSubmit = async (
    formData: WelcomeFormData
  ): Promise<boolean> => {
    try {
      console.log("welcome sidebar 1 submit", user);
      console.log("welcome sidebar 1 submit");
      console.log("welcome sidebar 1 submit", user?._id);
      if (!user || !user._id) {
        throw new Error("User ID not found. Please log in again.");
      }
      console.log("user and userid exists..");

      console.log("access token >>", accessToken);

      const updatedUser = await uploadMenteeWelcomeForm(
        formData,
        user._id,
        accessToken
      );
      console.log("welcome sidebar 2 submit", updatedUser);
      if (updatedUser) {
        console.log("yess");

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

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const response = await logout();
      console.log("logout reposnse is ", response);

      toast.success("Logged out successfully!");
      setLogoutModalOpen(false);
      dispatch(resetUser());
      navigate("/"); // Redirect to login page after logout
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    } finally {
      setLoggingOut(false);
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
    console.log("path and navigate", itemName, "and ", path);

    setActiveItem(itemName);
    if (path) navigate(path);
  };
  const openNotification = () => {
    setIsNotification(true);
  };

  const handleMouseLeave = () => {
    if (!dropdownOpen) {
      setIsExpanded(false);
    }
  };

  const handleDropdownSelect = (dashboard: string) => {
    setCurrentDashboard(dashboard); // Updates the displayed dashboard name in the trigger
    if (dashboard === "Mentee Dashboard") {
      navigate("/seeker/dashboard"); // Navigate to /seeker/dashboard when Mentee Dashboard is selected
    } else if (dashboard === "Mentor Dashboard") {
      navigate("/expert/dashboard"); // Navigate to /expert/dashboard when Mentor Dashboard is selected
    }
    setDropdownOpen(false); // Close the dropdown after selection
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
              {/* <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 w-full"> */}
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
            {/* <UserCircle2 size={24} /> */}
            <img src={logo} alt="" />
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
        <SidebarItem
          icon={FileText}
          text="Profile Details"
          isExpanded={isExpanded}
          active={activeItem === "Profile Details"}
          onClick={() => handleItemClick("Profile Details", "/seeker/profile")}
        />
        <SidebarItem
          icon={Phone}
          text="Bookings"
          isExpanded={isExpanded}
          active={activeItem === "Bookings"}
          onClick={() => handleItemClick("Bookings")}
        />
        <SidebarItem
          icon={Wallet}
          text="Payment History"
          isExpanded={isExpanded}
          active={activeItem === "Bill History"}
          onClick={() => handleItemClick("Profile Details", "/seeker/payment")}
        />
        <SidebarItem
          icon={Bell}
          text="Notification"
          isExpanded={isExpanded}
          active={activeItem === "Notification"}
          onClick={openNotification}
        />
      </nav>

      <div className="absolute bottom-4 w-full px-2">
        <SidebarItem
          icon={LogOut}
          text="Logout"
          isExpanded={isExpanded}
          active={activeItem === "Logout"}
          onClick={() => setLogoutModalOpen(true)}
        />
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        open={logoutModalOpen}
        onOpenChange={setLogoutModalOpen}
        onConfirm={handleLogout}
        loggingOut={loggingOut}
      />

      {/* Mentee Welcome Form Modal */}
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

export default MenteeSidebar;
