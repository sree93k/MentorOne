import React, { useState } from "react";

interface Props {
  initialTime?: string;
  onConfirm: (time: string) => void;
}

const CustomTimePicker: React.FC<Props> = ({
  initialTime = "12:00 AM",
  onConfirm,
}) => {
  const [hour, setHour] = useState<number>(
    parseInt(initialTime.split(":")[0]) || 12
  );
  const [minute, setMinute] = useState<number>(
    parseInt(initialTime.split(":")[1]) || 0
  );
  const [period, setPeriod] = useState<"AM" | "PM">(
    initialTime.includes("PM") ? "PM" : "AM"
  );

  const formatTime = () => {
    const h = hour < 10 ? `0${hour}` : hour;
    const m = minute < 10 ? `0${minute}` : minute;
    return `${h}:${m} ${period}`;
  };

  return (
    <div className="bg-white border rounded-md shadow-md p-3 w-64">
      <div className="flex gap-2">
        <select
          className="border p-2 rounded w-full"
          value={hour}
          onChange={(e) => setHour(parseInt(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
            <option key={h} value={h}>
              {h < 10 ? `0${h}` : h}
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded w-full"
          value={minute}
          onChange={(e) => setMinute(parseInt(e.target.value))}
        >
          {Array.from({ length: 60 }, (_, i) => i).map((m) => (
            <option key={m} value={m}>
              {m < 10 ? `0${m}` : m}
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded w-full"
          value={period}
          onChange={(e) => setPeriod(e.target.value as "AM" | "PM")}
        >
          <option>AM</option>
          <option>PM</option>
        </select>
      </div>
      <button
        className="mt-3 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
        onClick={() => onConfirm(formatTime())}
      >
        OK
      </button>
    </div>
  );
};

export default CustomTimePicker;
