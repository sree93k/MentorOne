// import LogoImg from "@/assets/logo3.png";
// import LogoName from "@/assets/logoname3.png";
// import ThemeToggle from "../users/ThemeToggle";
// const MentorHeader: React.FC = () => {
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
//           {/* <span className="text-xl">MENTOR ONE</span> */}
//         </div>

//         <div className="flex items gap-8">
//           <span className="text-3xl  text-blue-700 dark:text-white">
//             Hi, Admin !
//           </span>

//           <ThemeToggle />
//         </div>
//         {/* <MentorChat open={isChatOpen} onOpenChange={setIsChatOpen} /> */}
//       </header>
//     </>
//   );
// };

// export default MentorHeader;
import LogoImg from "@/assets/logo3.png";
import LogoName from "@/assets/logoname3.png";
import ThemeToggle from "../users/ThemeToggle";

const MentorHeader: React.FC = () => {
  return (
    <>
      <header className="relative flex items-center justify-between px-8 md:px-16 lg:px-32 py-6 bg-white/80 backdrop-blur-xl dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-900/10 dark:to-purple-900/10 pointer-events-none" />

        {/* Logo Section */}
        <div className="relative flex items-center gap-4 group">
          {/* Logo Container */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl blur-md group-hover:blur-lg transition-all duration-300" />
            {/* <div className="relative p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"> */}
            <img
              src={LogoImg}
              alt="Mentor ONE Logo"
              className="w-14 h-14 filter "
            />
            {/* </div> */}
          </div>

          {/* Logo Name with Animation */}
          <div className="flex flex-col">
            <img
              src={LogoName}
              alt="Mentor ONE"
              className="w-auto h-14 transition-all duration-300 group-hover:scale-105"
            />
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wide">
                ADMIN PORTAL
              </span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="relative flex items-center gap-6">
          {/* Welcome Message */}
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-2">
              <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                Hi, Admin!
              </span>
              <div className="animate-bounce">👋</div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide mt-1">
              Welcome back to your dashboard
            </div>
          </div>

          {/* Mobile Welcome (Smaller) */}
          <div className="md:hidden flex flex-col items-end">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Hi, Admin!
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Dashboard
            </span>
          </div>

          {/* Divider */}
          <div className="h-12 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent dark:via-gray-600" />

          {/* Theme Toggle with Enhancement */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-300" />
            <div className="relative p-2 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 group-hover:border-blue-300/50 group-hover:shadow-lg">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-60" />

        {/* Decorative dots */}
        <div className="absolute top-4 right-8 flex gap-1">
          <div
            className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-1 h-1 bg-purple-400 rounded-full animate-pulse"
            style={{ animationDelay: "200ms" }}
          />
          <div
            className="w-1 h-1 bg-pink-400 rounded-full animate-pulse"
            style={{ animationDelay: "400ms" }}
          />
        </div>
      </header>

      {/* Custom CSS for gradient animation */}
      <style>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </>
  );
};

export default MentorHeader;
