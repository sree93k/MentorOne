// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Send } from "lucide-react";
// import LogoImg from "@/assets/logo.png";
// import LogoName from "@/assets/brandlogo.png";
// import MenteeChat from "../users/Chatting";
// import { Link, useLocation } from "react-router-dom";
// import ThemeToggle from "../users/ThemeToggle";
// const MenteeHeader: React.FC = () => {
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const location = useLocation();
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
//             {/* <Link
//               to="/seeker/blog"
//               className={`${isActive(
//                 "/seeker/blog"
//               )} text-gray-700 dark:text-gray-300`}
//             >
//               Blog
//             </Link> */}
//             {/* <Link
//               to="/community"
//               className={`${isActive(
//                 "/contact"
//               )} text-gray-700 dark:text-gray-300`}
//             >
//               Contact Us
//             </Link> */}
//           </nav>
//           <div className="flex items-center gap-4">
//             <Input
//               type="search"
//               placeholder="Search"
//               className="w-64 rounded-full"
//             />
//             <button onClick={openChat}>
//               <Send size={24} className="text-gray-600 dark:text-gray-300" />
//             </button>
//           </div>
//         </div>
//         <MenteeChat open={isChatOpen} onOpenChange={setIsChatOpen} />
//         <ThemeToggle />
//       </header>
//     </>
//   );
// };

// export default MenteeHeader;
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import LogoImg from "@/assets/logo.png";
import LogoName from "@/assets/brandlogo.png";
import Chatting from "../users/Chatting";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "../users/ThemeToggle";

const MenteeHeader: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();

  const openChat = () => {
    setIsChatOpen(true);
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
          </nav>
          <div className="flex items-center gap-4">
            <Input
              type="search"
              placeholder="Search"
              className="w-64 rounded-full"
            />
            <button onClick={openChat}>
              <Send size={24} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
        <Chatting open={isChatOpen} onOpenChange={setIsChatOpen} />
        <ThemeToggle />
      </header>
    </>
  );
};

export default MenteeHeader;
