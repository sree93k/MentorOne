// import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import LogoImg from "@/assets/Logo2.png";
// import LogoName from "@/assets/LogoName2.png";
// import Chatting from "../users/Chatting";
// import ThemeToggle from "../users/ThemeToggle";
// import ChatNotificationBadge from "@/components/users/ChatNotificationBadge";
// import { setChatUnreadCounts } from "@/redux/slices/userSlice";
// import { getChatUnreadCounts } from "@/services/userServices";

// const MentorHeader: React.FC = () => {
//   const [isChatOpen, setIsChatOpen] = useState(false);

//   const dispatch = useDispatch();

//   const { user, isAuthenticated, chatNotifications } = useSelector(
//     (state: RootState) => state.user
//   );

//   const currentRole = "mentor";
//   const chatUnreadCount = chatNotifications.mentorUnreadChats;

//   useEffect(() => {
//     if (!isAuthenticated || !user?._id) return;

//     const fetchInitialChatCounts = async () => {
//       try {
//         const counts = await getChatUnreadCounts();
//         dispatch(setChatUnreadCounts(counts));
//         console.log("📊 MentorHeader: Initial chat counts loaded:", counts);
//       } catch (error) {
//         console.error("Failed to fetch initial chat counts:", error);
//       }
//     };

//     fetchInitialChatCounts();
//   }, [isAuthenticated, user?._id, dispatch]);

//   const openChat = () => {
//     setIsChatOpen(true);
//   };

//   return (
//     <>
//       <header className="flex items-center justify-between px-32 py-4 bg-white dark:text-white dark:bg-gray-800">
//         <div className="flex items-center gap-4">
//           <img src={LogoImg} alt="Mentor ONE Logo" className="w-14 h-14" />
//           <img
//             src={LogoName}
//             alt="Mentor ONE LogoName"
//             className="w-auto h-16"
//           />
//         </div>
//         <div className="flex items-center gap-8">
//           <div className="flex px-6 items-center gap-4">
//             <ChatNotificationBadge
//               count={chatUnreadCount}
//               role={currentRole}
//               onClick={openChat}
//               size={24}
//             />
//           </div>
//           <ThemeToggle />
//         </div>
//         <Chatting open={isChatOpen} onOpenChange={setIsChatOpen} />
//       </header>
//     </>
//   );
// };

// export default MentorHeader;
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import LogoImg from "@/assets/Logo2.png";
import LogoName from "@/assets/LogoName2.png";
import Chatting from "../users/Chatting";
import ThemeToggle from "../users/ThemeToggle";
import ChatNotificationBadge from "@/components/users/ChatNotificationBadge";
import { setChatUnreadCounts } from "@/redux/slices/userSlice";
import { getChatUnreadCounts } from "@/services/userServices";

const MentorHeader: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const dispatch = useDispatch();

  const { user, isAuthenticated, chatNotifications } = useSelector(
    (state: RootState) => state.user
  );

  const currentRole = "mentor";
  const chatUnreadCount = chatNotifications.mentorUnreadChats;

  useEffect(() => {
    if (!isAuthenticated || !user?._id) return;

    const fetchInitialChatCounts = async () => {
      try {
        const counts = await getChatUnreadCounts();
        dispatch(setChatUnreadCounts(counts));
        console.log("📊 MentorHeader: Initial chat counts loaded:", counts);
      } catch (error) {
        console.error("Failed to fetch initial chat counts:", error);
      }
    };

    fetchInitialChatCounts();
  }, [isAuthenticated, user?._id, dispatch]);

  const openChat = () => {
    console.log("🔥 MentorHeader: Opening chat, isChatOpen will be:", true);
    setIsChatOpen(true);
  };

  // ✅ NEW: Handle chat close to update counts
  const handleChatClose = (isOpen: boolean) => {
    console.log("🔥 MentorHeader: Chat visibility changed:", isOpen);
    setIsChatOpen(isOpen);

    // ✅ Refresh counts when chat closes to get latest state
    if (!isOpen && isAuthenticated && user?._id) {
      setTimeout(async () => {
        try {
          const counts = await getChatUnreadCounts();
          dispatch(setChatUnreadCounts(counts));
          console.log(
            "📊 MentorHeader: Refreshed counts after chat close:",
            counts
          );
        } catch (error) {
          console.error("Failed to refresh chat counts:", error);
        }
      }, 1000); // Small delay to ensure backend is updated
    }
  };

  return (
    <>
      <header className="flex items-center justify-between px-32 py-4 bg-white dark:text-white dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <img src={LogoImg} alt="Mentor ONE Logo" className="w-14 h-14" />
          <img
            src={LogoName}
            alt="Mentor ONE LogoName"
            className="w-auto h-16"
          />
        </div>
        <div className="flex items-center gap-8">
          <div className="flex px-6 items-center gap-4">
            <ChatNotificationBadge
              count={chatUnreadCount}
              role={currentRole}
              onClick={openChat}
              size={24}
            />
          </div>
          <ThemeToggle />
        </div>

        {/* ✅ FIXED: Pass proper onOpenChange handler */}
        <Chatting open={isChatOpen} onOpenChange={handleChatClose} />
      </header>
    </>
  );
};

export default MentorHeader;
