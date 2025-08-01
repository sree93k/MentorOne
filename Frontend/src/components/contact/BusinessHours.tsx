// components/contact/BusinessHours.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface BusinessHoursProps {
  customSchedule?: Array<{
    day: string;
    hours: string;
    isToday?: boolean;
  }>;
}

const BusinessHours: React.FC<BusinessHoursProps> = ({ customSchedule }) => {
  // Get current day
  const getCurrentDay = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[new Date().getDay()];
  };

  const currentDay = getCurrentDay();

  const defaultSchedule = [
    {
      day: "Monday",
      hours: "9:00 AM - 6:00 PM",
      isToday: currentDay === "Monday",
    },
    {
      day: "Tuesday",
      hours: "9:00 AM - 6:00 PM",
      isToday: currentDay === "Tuesday",
    },
    {
      day: "Wednesday",
      hours: "9:00 AM - 6:00 PM",
      isToday: currentDay === "Wednesday",
    },
    {
      day: "Thursday",
      hours: "9:00 AM - 6:00 PM",
      isToday: currentDay === "Thursday",
    },
    {
      day: "Friday",
      hours: "9:00 AM - 6:00 PM",
      isToday: currentDay === "Friday",
    },
    {
      day: "Saturday",
      hours: "9:00 AM - 6:00 PM",
      isToday: currentDay === "Saturday",
    },
    { day: "Sunday", hours: "Closed", isToday: currentDay === "Sunday" },
  ];

  const schedule = customSchedule || defaultSchedule;

  // Check if currently open
  const isCurrentlyOpen = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const todaySchedule = schedule.find((item) => item.isToday);
    if (!todaySchedule || todaySchedule.hours === "Closed") return false;

    const timeRange = todaySchedule.hours.split(" - ");
    if (timeRange.length !== 2) return false;

    const parseTime = (timeStr: string) => {
      const [time, period] = timeStr.split(" ");
      const [hours, minutes] = time.split(":").map(Number);
      let hour24 = hours;

      if (period === "PM" && hours !== 12) hour24 += 12;
      if (period === "AM" && hours === 12) hour24 = 0;

      return hour24 * 60 + minutes;
    };

    const openTime = parseTime(timeRange[0]);
    const closeTime = parseTime(timeRange[1]);

    return currentTime >= openTime && currentTime <= closeTime;
  };

  const isOpen = isCurrentlyOpen();

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-xl border-0">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Business Hours
          <span
            className={`ml-auto text-sm px-2 py-1 rounded-full ${
              isOpen
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {isOpen ? "Open Now" : "Closed"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {schedule.map((item, index) => (
            <div
              key={index}
              className={`flex justify-between items-center py-2 px-3 rounded-lg transition-colors ${
                item.isToday
                  ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}
            >
              <span
                className={`font-medium ${
                  item.isToday
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {item.day}
                {item.isToday && (
                  <span className="ml-2 text-xs bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">
                    Today
                  </span>
                )}
              </span>
              <span
                className={`text-sm font-medium ${
                  item.isToday
                    ? "text-blue-600 dark:text-blue-400"
                    : item.hours === "Closed"
                    ? "text-red-500 dark:text-red-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {item.hours}
              </span>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> For urgent support outside business hours,
            please email us and we'll respond as soon as possible.
          </p>
        </div>

        {/* Holiday Notice (Optional) */}
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Holiday Hours:</strong> We may have modified hours during
            holidays. Check our social media for updates.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessHours;
