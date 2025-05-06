"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface BookingConfirmProps {
  onConfirm: (date: string, time: string) => void;
}

export default function BookingConfirm({ onConfirm }: BookingConfirmProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Sample dates for the next 5 days
  const dates = [
    { day: "Tue", date: "06 May", fullDate: "2025-05-06" },
    { day: "Wed", date: "07 May", fullDate: "2025-05-07" },
    { day: "Thu", date: "08 May", fullDate: "2025-05-08" },
    { day: "Fri", date: "09 May", fullDate: "2025-05-09" },
    { day: "Sat", date: "10 May", fullDate: "2025-05-10" },
    { day: "Sun", date: "11 May", fullDate: "2025-05-11" },
    { day: "Mon", date: "12 May", fullDate: "2025-05-12" },
    { day: "Tue", date: "13 May", fullDate: "2025-05-13" },
    { day: "Wed", date: "14 May", fullDate: "2025-05-14" },
    { day: "Thu", date: "15 May", fullDate: "2025-05-15" },
  ];

  // Sample time slots
  const times = ["10:00 AM", "12:00 PM", "3:00 PM"];

  const handleDateSelect = (fullDate: string) => {
    setSelectedDate(fullDate);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmClick = () => {
    if (selectedDate && selectedTime) {
      onConfirm(selectedDate, selectedTime);
    }
  };

  return (
    <div className="bg-black text-white rounded-3xl max-w-md w-full p-6">
      <div className="bg-gray-100 text-black rounded-xl p-6">
        <h3 className="font-semibold mb-4">Select Date</h3>

        <div className="flex items-center justify-between mb-6">
          <button className="p-1">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="flex gap-2 overflow-x-auto">
            {dates.map((date) => (
              <button
                key={date.fullDate}
                className={`flex flex-col items-center justify-center p-2 rounded-md min-w-[60px] ${
                  selectedDate === date.fullDate
                    ? "bg-black text-white"
                    : "bg-white"
                }`}
                onClick={() => handleDateSelect(date.fullDate)}
              >
                <span className="text-xs">{date.day}</span>
                <span className="text-xs">{date.date}</span>
              </button>
            ))}
          </div>

          <button className="p-1">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 6L15 12L9 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <h3 className="font-semibold mb-4">Now Select Time</h3>

        <div className="flex gap-2 mb-6">
          {times.map((time) => (
            <Button
              key={time}
              variant={selectedTime === time ? "default" : "outline"}
              className={`px-4 py-2 rounded-md ${
                selectedTime === time
                  ? "bg-black text-white"
                  : "bg-white text-black border-gray-200"
              }`}
              onClick={() => handleTimeSelect(time)}
            >
              {time}
            </Button>
          ))}
        </div>

        <Button
          variant="default"
          className="w-full py-3 bg-black text-white rounded-md"
          onClick={handleConfirmClick}
          disabled={!selectedDate || !selectedTime}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
