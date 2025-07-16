// // src/components/landing/Header.tsx
// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useTheme } from "../../utils/ThemeProvider";
// import { Menu } from "lucide-react";
// import Logo1 from "../../assets/logo.png";
// import LogoName1 from "../../assets/brandlogo.png";
// import Logo2 from "../../assets/logoDark.png";
// import LogoName2 from "../../assets/logonameDark.png";
// import ThemeToggle from "../users/ThemeToggle";
// const pages = ["About", "Blog", "Community"];

// const Header: React.FC = () => {
//   const navigate = useNavigate();
//   const { theme } = useTheme();

//   const handleGetStarted = () => {
//     navigate("/login");
//   };

//   return (
//     <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 dark:bg-black dark:text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-[70px]">
//           {/* Logo Section */}
//           <div className="flex items-center gap-2">
//             <img
//               src={theme === "dark" ? Logo2 : Logo1}
//               alt="Logo"
//               className="w-14 h-auto"
//             />
//             <img
//               src={theme === "dark" ? LogoName2 : LogoName1}
//               alt="Brand"
//               className="w-40 h-auto"
//             />
//           </div>

//           {/* Mobile Menu */}
//           <div className="md:hidden">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="icon" aria-label="Menu">
//                   <Menu className="w-6 h-6 text-black" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-48">
//                 {pages.map((page) => (
//                   <DropdownMenuItem key={page} asChild>
//                     <Link
//                       to={`/${page.toLowerCase()}`}
//                       className="w-full text-black hover:bg-gray-100 dark:text-white"
//                     >
//                       {page}
//                     </Link>
//                   </DropdownMenuItem>
//                 ))}
//                 <DropdownMenuItem>
//                   <Button
//                     variant="default"
//                     className="w-full bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 "
//                     onClick={handleGetStarted}
//                   >
//                     Get Started
//                   </Button>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center gap-6">
//             {pages.map((page) => (
//               <Link
//                 key={page}
//                 to={`/${page.toLowerCase()}`}
//                 className="text-black dark:text-white hover:text-blue-600 font-medium transition-colors"
//               >
//                 {page}
//               </Link>
//             ))}
//             <Button
//               variant="default"
//               className="bg-black text-white hover:bg-white hover:text-black border border-black transition-all"
//               onClick={handleGetStarted}
//             >
//               Get Started
//             </Button>
//             <ThemeToggle />
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
// src/components/landing/Header.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "../../utils/ThemeProvider";
import { Menu, X } from "lucide-react";
import Logo1 from "../../assets/logo.png";
import LogoName1 from "../../assets/brandlogo.png";
import Logo2 from "../../assets/logoDark.png";
import LogoName2 from "../../assets/logonameDark.png";
import ThemeToggle from "../users/ThemeToggle";

const pages = ["About", "Blog", "Community"];

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 dark:bg-black dark:text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-[70px]">
            {/* Logo Section */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <img
                src={theme === "dark" ? Logo2 : Logo1}
                alt="Logo"
                className="w-10 h-auto sm:w-12 md:w-14"
              />
              <img
                src={theme === "dark" ? LogoName2 : LogoName1}
                alt="Brand"
                className="w-24 h-auto sm:w-32 md:w-40"
              />
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              {pages.map((page) => (
                <Link
                  key={page}
                  to={`/${page.toLowerCase()}`}
                  className="text-black dark:text-white hover:text-blue-600 font-medium transition-colors text-sm xl:text-base"
                >
                  {page}
                </Link>
              ))}
              <Button
                variant="default"
                className="bg-black text-white hover:bg-white hover:text-black border border-black transition-all text-sm xl:text-base px-4 xl:px-6"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="h-10 w-10"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-black dark:text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-black dark:text-white" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-16 sm:top-[70px] right-0 h-[calc(100vh-4rem)] sm:h-[calc(100vh-70px)] w-64 sm:w-80 bg-white dark:bg-black shadow-lg z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Navigation Links */}
          <nav className="space-y-3 sm:space-y-4">
            {pages.map((page) => (
              <Link
                key={page}
                to={`/${page.toLowerCase()}`}
                className="block text-black dark:text-white hover:text-blue-600 font-medium transition-colors text-base sm:text-lg py-2 border-b border-gray-100 dark:border-gray-800"
                onClick={closeMobileMenu}
              >
                {page}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="default"
              className="w-full bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-base sm:text-lg py-3 sm:py-4"
              onClick={() => {
                handleGetStarted();
                closeMobileMenu();
              }}
            >
              Get Started
            </Button>
          </div>

          {/* Additional Mobile Menu Items */}
          <div className="pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="space-y-3 sm:space-y-4">
              <Link
                to="/help"
                className="block text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm sm:text-base"
                onClick={closeMobileMenu}
              >
                Help & Support
              </Link>
              <Link
                to="/contact"
                className="block text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm sm:text-base"
                onClick={closeMobileMenu}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
