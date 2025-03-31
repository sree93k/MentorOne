import React, { useState } from "react";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Home,
  FileText,
  Phone,
  Clock,
  Bell,
  LogOut,
  ChevronDown,
  UserCircle2,
  ChevronRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Footer from "@/components/landing/Footer";
import { LogoutConfirmationModal } from "@/components/modal/Logout";
import { logoutUser } from "@/services/userAuthService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const barData = [
  { name: "01", value: 40, lastWeek: 30 },
  { name: "02", value: 30, lastWeek: 25 },
  { name: "03", value: 35, lastWeek: 30 },
  { name: "04", value: 25, lastWeek: 20 },
  { name: "05", value: 40, lastWeek: 35 },
  { name: "06", value: 45, lastWeek: 40 },
  { name: "07", value: 35, lastWeek: 30 },
  { name: "08", value: 30, lastWeek: 25 },
  { name: "09", value: 35, lastWeek: 30 },
  { name: "10", value: 25, lastWeek: 20 },
  { name: "11", value: 40, lastWeek: 35 },
  { name: "12", value: 45, lastWeek: 40 },
];

const pieData = [
  { name: "Morning", value: 28 },
  { name: "Evening", value: 32 },
  { name: "Afternoon", value: 40 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

const ratingData = [
  { name: "One to One", value: 85 },
  { name: "Package", value: 85 },
  { name: "Tutorial", value: 92 },
];

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
      active ? "bg-gray-100" : "hover:bg-gray-100"
    }`}
    onClick={onClick}
  >
    <Icon
      size={24}
      className={`${active ? "text-[#e44332]" : "text-gray-600"}`}
    />
    <span
      className={`text-gray-700 whitespace-nowrap transition-all duration-300 ${
        isExpanded ? "opacity-100" : "opacity-0 w-0"
      }`}
    >
      {text}
    </span>
  </div>
);

const ProductItem = ({
  image,
  name,
  price,
}: {
  image: string;
  name: string;
  price: string;
}) => (
  <div className="flex items-center gap-3 mb-4">
    <img
      src={image}
      alt={name}
      className="w-10 h-10 rounded-full object-cover"
    />
    <div className="flex-1">
      <p className="font-medium">{name}</p>
    </div>
    <p className="text-gray-600">{price}</p>
  </div>
);

//Mentee Dashboard
export const MentorDashboard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentDashboard, setCurrentDashboard] = useState("Mentor Dashboard");
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutUser();
      toast.success("Logged out successfully!");
      setLogoutModalOpen(false);
      navigate("/"); // Redirect to login page after logout
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white">
        <div className="flex items-center gap-4">
          <img src="/m1--5-.png" alt="Mentor ONE" className="w-10 h-10" />
          <span className="text-xl">MENTOR ONE</span>
        </div>
        <div className="flex items-center gap-8">
          <nav className="flex gap-8">
            <a href="#" className="font-medium border-b-2 border-black">
              Home
            </a>
            <a href="#" className="text-gray-500">
              Mentors
            </a>
            <a href="#" className="text-gray-500">
              Courses
            </a>
            <a href="#" className="text-gray-500">
              Blog
            </a>
            <a href="#" className="text-gray-500">
              Community
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Input type="search" placeholder="Search" className="w-64" />
            <UserCircle2 size={24} />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className="fixed left-4 top-4 bottom-4 bg-white rounded-xl shadow-lg transition-all duration-300 z-10"
        style={{ width: isExpanded ? "240px" : "80px" }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Dashboard Selector */}
        <div className="p-4">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 w-full">
                <UserCircle2 size={24} />
                {isExpanded && (
                  <>
                    <span className="flex-1 text-left">{currentDashboard}</span>
                    <ChevronDown size={20} />
                  </>
                )}
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="bg-white rounded-lg shadow-lg p-2 min-w-[200px]">
              <DropdownMenu.Item
                className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                onSelect={() => setCurrentDashboard("Mentor Dashboard")}
              >
                Mentor Dashboard
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                onSelect={() => setCurrentDashboard("Mentee Dashboard")}
              >
                Mentee Dashboard
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2 px-2">
          <SidebarItem icon={Home} text="Home" isExpanded={isExpanded} active />
          <SidebarItem
            icon={FileText}
            text="Profile Details"
            isExpanded={isExpanded}
          />
          <SidebarItem icon={Phone} text="Bookings" isExpanded={isExpanded} />
          <SidebarItem
            icon={Clock}
            text="Bill History"
            isExpanded={isExpanded}
          />
          <SidebarItem
            icon={Bell}
            text="Notification"
            isExpanded={isExpanded}
          />
        </nav>

        {/* Logout at bottom */}
        <div className="absolute bottom-4 w-full px-2">
          <SidebarItem
            icon={LogOut}
            text="Logout"
            isExpanded={isExpanded}
            onClick={() => setLogoutModalOpen(true)}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="ml-24 p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-sm text-gray-600 mb-2">
              Current Month Bookings
            </h3>
            <p className="text-3xl font-bold">10</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm text-gray-600 mb-2">
              Current Month Earnings
            </h3>
            <p className="text-3xl font-bold">₹ 8200</p>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Trends */}
          <Card className="p-6 col-span-2">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">
                  Month on Month Booking Trends
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>IDR 7,852,000</span>
                  <span className="text-green-500">↑ 2.1% vs last week</span>
                </div>
                <p className="text-sm text-gray-500">
                  Sales from 1-12 Dec, 2020
                </p>
              </div>
              <button className="text-blue-600">View Report</button>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                  <Bar dataKey="lastWeek" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Earnings Breakdown */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">
                  2025 Earning break down
                </h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">2,568</span>
                  <span className="text-red-500">↓ 2.1% vs last week</span>
                </div>
                <p className="text-sm text-gray-500">
                  Sales from 1-6 Dec, 2020
                </p>
              </div>
              <button className="text-blue-600">View Report</button>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData.slice(0, 6)}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Lifetime Earnings */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Lifetime Earnings</h2>
                <p className="text-sm text-gray-500">1-6 Dec, 2020</p>
              </div>
              <button className="text-blue-600">View Report</button>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-around mt-4">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="text-center">
                  <p className="text-sm font-medium">{entry.name}</p>
                  <p className="text-sm text-gray-600">{entry.value}%</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Rating */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">Your Rating</h2>
            <p className="text-sm text-gray-500 mb-4">
              Lorem ipsum dolor sit amet, consectetur
            </p>
            <div className="relative h-[200px]">
              <div className="absolute inset-0 flex items-center justify-center">
                {ratingData.map((item, index) => (
                  <div
                    key={item.name}
                    className={`absolute rounded-full flex items-center justify-center ${
                      index === 0
                        ? "w-24 h-24 bg-[#8884d8] text-white"
                        : index === 1
                        ? "w-32 h-32 bg-[#ffc658] text-white"
                        : "w-28 h-28 bg-[#82ca9d] text-white"
                    }`}
                    style={{
                      transform:
                        index === 0
                          ? "translate(-50%, -50%)"
                          : index === 1
                          ? "translate(0%, 0%)"
                          : "translate(50%, 50%)",
                    }}
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold">{item.value}%</div>
                      <div className="text-sm">{item.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Most Ordered */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">
              Most Ordered Service Products
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Adipiscing elit, sed do eiusmod tempor
            </p>
            <div className="space-y-4">
              <ProductItem
                image="/m1--5-.png"
                name="Fresh Salad Bowl"
                price="IDR 45,000"
              />
              <ProductItem
                image="/m1--5-.png"
                name="Chicken Noodles"
                price="IDR 75,000"
              />
              <ProductItem
                image="/m1--5-.png"
                name="Smoothie Fruits"
                price="IDR 45,000"
              />
              <ProductItem
                image="/m1--5-.png"
                name="Hot Chicken Wings"
                price="IDR 45,000"
              />
            </div>
          </Card>
        </div>
      </main>
      <Footer />
      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        open={logoutModalOpen}
        onOpenChange={setLogoutModalOpen}
        onConfirm={handleLogout}
        loggingOut={loggingOut}
      />
    </div>
  );
};

export default MentorDashboard;
