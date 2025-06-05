import React, { useState, useEffect } from "react";

interface Props {
  initialTime?: string; // e.g., "10:00 AM"
  onConfirm: (time: string) => void; // Outputs time in 12-hour format (e.g., "10:00 AM")
}

const CustomTimePicker: React.FC<Props> = ({
  initialTime = "12:00 AM",
  onConfirm,
}) => {
  // Parse initialTime to extract hour, minute, and period
  const parseTime = (time: string) => {
    const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) {
      return { hour: 12, minute: 0, period: "AM" };
    }
    const hour = parseInt(match[1]);
    const minute = parseInt(match[2]);
    const period = match[3].toUpperCase() as "AM" | "PM";
    return { hour: hour % 12 || 12, minute, period };
  };

  const [hour, setHour] = useState<number>(parseTime(initialTime).hour);
  const [minute, setMinute] = useState<number>(parseTime(initialTime).minute);
  const [period, setPeriod] = useState<"AM" | "PM">(
    parseTime(initialTime).period
  );

  // Update state if initialTime changes
  useEffect(() => {
    const { hour, minute, period } = parseTime(initialTime);
    setHour(hour);
    setMinute(minute);
    setPeriod(period);
  }, [initialTime]);

  const formatTime = () => {
    const h = hour;
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
              {h}
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
          <option value="AM">AM</option>
          <option value="PM">PM</option>
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
