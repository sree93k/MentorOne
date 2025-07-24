// import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import LogoImg from "@/assets/logo.png";
// import LogoName from "@/assets/brandlogo.png";
// import Chatting from "../users/Chatting";
// import { Link, useLocation } from "react-router-dom";
// import ThemeToggle from "../users/ThemeToggle";
// import ChatNotificationBadge from "@/components/users/ChatNotificationBadge";
// import { setChatUnreadCounts } from "@/redux/slices/userSlice";
// import { getChatUnreadCounts } from "@/services/userServices";

// const MenteeHeader: React.FC = () => {
//   const [isChatOpen, setIsChatOpen] = useState(false);

//   const location = useLocation();
//   const dispatch = useDispatch();

//   const { user, isAuthenticated, chatNotifications } = useSelector(
//     (state: RootState) => state.user
//   );

//   const currentRole = "mentee";
//   console.log("CHat chatNotifications mentee✅ ✅ ✅ ✅ ", chatNotifications);

//   const chatUnreadCount = chatNotifications.menteeUnreadChats;

//   useEffect(() => {
//     if (!isAuthenticated || !user?._id) return;

//     const fetchInitialChatCounts = async () => {
//       try {
//         const counts = await getChatUnreadCounts();
//         dispatch(setChatUnreadCounts(counts));
//         console.log("📊 MenteeHeader: Initial chat counts loaded:", counts);
//       } catch (error) {
//         console.error("Failed to fetch initial chat counts:", error);
//       }
//     };

//     fetchInitialChatCounts();
//   }, [isAuthenticated, user?._id, dispatch]);

//   const openChat = () => {
//     setIsChatOpen(true);
//   };

//   const isActive = (path: string) =>
//     location.pathname === path
//       ? "font-medium border-b-2 border-black text-black dark:text-white"
//       : "text-gray-500 dark:text-gray-300";

//   return (
//     <>
//       <header className="flex items-center justify-between pl-40 pr-10 py-4 bg-white dark:text-white dark:bg-gray-800">
//         <div className="flex items-center gap-4">
//           <img src={LogoImg} alt="Mentor ONE Logo" className="w-14 h-14" />
//           <img
//             src={LogoName}
//             alt="Mentor ONE LogoName"
//             className="w-auto h-16"
//           />
//         </div>
//         <div className="flex items-center gap-8">
//           <nav className="flex gap-8">
//             <Link
//               to="/seeker/dashboard"
//               className={`${isActive(
//                 "/seeker/dashboard"
//               )} text-gray-700 dark:text-gray-300`}
//             >
//               Home
//             </Link>
//             <Link
//               to="/seeker/mentors"
//               className={`${isActive(
//                 "/seeker/mentors"
//               )} text-gray-700 dark:text-gray-300`}
//             >
//               Mentors
//             </Link>
//             <Link
//               to="/seeker/courses"
//               className={`${isActive(
//                 "/seeker/courses"
//               )} text-gray-700 dark:text-gray-300`}
//             >
//               Courses
//             </Link>
//             <Link
//               to="/seeker/allservices"
//               className={`${isActive(
//                 "/seeker/allservices"
//               )} text-gray-700 dark:text-gray-300`}
//             >
//               Services
//             </Link>
//           </nav>
//           <div className="flex items-center gap-4"></div>
//         </div>

//         <div className="px-24 flex items-center gap-12">
//           <ChatNotificationBadge
//             count={chatUnreadCount}
//             role={currentRole}
//             onClick={openChat}
//             size={24}
//           />
//           <ThemeToggle />
//         </div>

//         <Chatting open={isChatOpen} onOpenChange={setIsChatOpen} />
//       </header>
//     </>
//   );
// };

// export default MenteeHeader;
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import LogoImg from "@/assets/logo.png";
import LogoName from "@/assets/brandlogo.png";
import Chatting from "../users/Chatting";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "../users/ThemeToggle";
import ChatNotificationBadge from "@/components/users/ChatNotificationBadge";
import { setChatUnreadCounts } from "@/redux/slices/userSlice";
import { getChatUnreadCounts } from "@/services/userServices";

const MenteeHeader: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  const { user, isAuthenticated, chatNotifications } = useSelector(
    (state: RootState) => state.user
  );

  const currentRole = "mentee";
  console.log("CHat chatNotifications mentee✅ ✅ ✅ ✅ ", chatNotifications);

  const chatUnreadCount = chatNotifications.menteeUnreadChats;

  useEffect(() => {
    if (!isAuthenticated || !user?._id) return;

    const fetchInitialChatCounts = async () => {
      try {
        const counts = await getChatUnreadCounts();
        dispatch(setChatUnreadCounts(counts));
        console.log("📊 MenteeHeader: Initial chat counts loaded:", counts);
      } catch (error) {
        console.error("Failed to fetch initial chat counts:", error);
      }
    };

    fetchInitialChatCounts();
  }, [isAuthenticated, user?._id, dispatch]);

  const openChat = () => {
    console.log("🔥 MenteeHeader: Opening chat, isChatOpen will be:", true);
    setIsChatOpen(true);
  };

  // ✅ NEW: Handle chat close to update counts
  const handleChatClose = (isOpen: boolean) => {
    console.log("🔥 MenteeHeader: Chat visibility changed:", isOpen);
    setIsChatOpen(isOpen);

    // ✅ Refresh counts when chat closes to get latest state
    if (!isOpen && isAuthenticated && user?._id) {
      setTimeout(async () => {
        try {
          const counts = await getChatUnreadCounts();
          dispatch(setChatUnreadCounts(counts));
          console.log(
            "📊 MenteeHeader: Refreshed counts after chat close:",
            counts
          );
        } catch (error) {
          console.error("Failed to refresh chat counts:", error);
        }
      }, 1000); // Small delay to ensure backend is updated
    }
  };

  const isActive = (path: string) =>
    location.pathname === path
      ? "font-medium border-b-2 border-black text-black dark:text-white"
      : "text-gray-500 dark:text-gray-300";

  return (
    <>
      <header className="flex items-center justify-between pl-40 pr-10 py-4 bg-white dark:text-white dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <img src={LogoImg} alt="Mentor ONE Logo" className="w-14 h-14" />
          <img
            src={LogoName}
            alt="Mentor ONE LogoName"
            className="w-auto h-16"
          />
        </div>
        <div className="flex items-center gap-8">
          <nav className="flex gap-8">
            <Link
              to="/seeker/dashboard"
              className={`${isActive(
                "/seeker/dashboard"
              )} text-gray-700 dark:text-gray-300`}
            >
              Home
            </Link>
            <Link
              to="/seeker/mentors"
              className={`${isActive(
                "/seeker/mentors"
              )} text-gray-700 dark:text-gray-300`}
            >
              Mentors
            </Link>
            <Link
              to="/seeker/courses"
              className={`${isActive(
                "/seeker/courses"
              )} text-gray-700 dark:text-gray-300`}
            >
              Courses
            </Link>
            <Link
              to="/seeker/allservices"
              className={`${isActive(
                "/seeker/allservices"
              )} text-gray-700 dark:text-gray-300`}
            >
              Services
            </Link>
          </nav>
          <div className="flex items-center gap-4"></div>
        </div>

        <div className="px-24 flex items-center gap-12">
          <ChatNotificationBadge
            count={chatUnreadCount}
            role={currentRole}
            onClick={openChat}
            size={24}
          />
          <ThemeToggle />
        </div>

        {/* ✅ FIXED: Pass proper onOpenChange handler */}
        <Chatting open={isChatOpen} onOpenChange={handleChatClose} />
      </header>
    </>
  );
};

export default MenteeHeader;
