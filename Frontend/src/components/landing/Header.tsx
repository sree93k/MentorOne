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

const pages = ["About", "Blog", "Community"];

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  const handleGetStarted = () => {
    navigate("/signin");
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
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
                      className="w-full text-black hover:bg-gray-100"
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
                className="text-black hover:text-blue-600 font-medium transition-colors"
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
          </div>
          {/* <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeConfig dark={false} />
          </div> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
