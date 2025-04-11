// src/components/landing/Header.tsx
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeConfig } from "flowbite-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "../../utils/ThemeProvider";
import { Menu } from "lucide-react";
import Logo1 from "../../assets/logo.png";
import LogoName1 from "../../assets/brandlogo.png";
import ThemeToggle from "../users/ThemeToggle";
const pages = ["About", "Blog", "Community"];

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 dark:bg-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[70px]">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <img src={Logo1} alt="Logo" className="w-14 h-auto" />
            <img src={LogoName1} alt="Brand" className="w-40 h-auto" />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="w-6 h-6 text-black" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {pages.map((page) => (
                  <DropdownMenuItem key={page} asChild>
                    <Link
                      to={`/${page.toLowerCase()}`}
                      className="w-full text-black hover:bg-gray-100 dark:text-white"
                    >
                      {page}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem>
                  <Button
                    variant="default"
                    className="w-full bg-black text-white hover:bg-gray-800"
                    onClick={handleGetStarted}
                  >
                    Get Started
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {pages.map((page) => (
              <Link
                key={page}
                to={`/${page.toLowerCase()}`}
                className="text-black dark:text-white hover:text-blue-600 font-medium transition-colors"
              >
                {page}
              </Link>
            ))}
            <Button
              variant="default"
              className="bg-black text-white hover:bg-white hover:text-black border border-black transition-all"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
