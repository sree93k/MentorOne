"use client";
import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import {
  getMentorSchedule,
  getMentorBlockedDates,
} from "@/services/menteeService";
import { requestReschedule } from "@/services/bookingService";

interface ScheduleSlot {
  index: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface ScheduleDay {
  day: string;
  slots: ScheduleSlot[];
}

interface Schedule {
  mentorId: string;
  scheduleName: string;
  weeklySchedule: ScheduleDay[];
  createdAt: string;
  updatedAt: string;
  _id: string;
}

interface BlockedDate {
  date: string;
  day: string;
  mentorId: string;
  type: "blocked" | "booking";
  slotTime?: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
}

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  serviceSlot: string;
  mentorId: string;
  refreshBookings?: () => Promise<void>;
}

const RescheduleModal = ({
  isOpen,
  onClose,
  bookingId,
  serviceSlot,
  mentorId,
  refreshBookings,
}: RescheduleModalProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(
    null
  );
  const [availableDates, setAvailableDates] = useState<
    { day: string; date: string; fullDate: string; isAvailable: boolean }[]
  >([]);
  const [availableTimes, setAvailableTimes] = useState<
    { time: string; slotIndex: number; isBooked: boolean }[]
  >([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [mentorDecides, setMentorDecides] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      console.log("open the modal ");
      console.log("bookingId", bookingId);
      console.log("serviceSlot", serviceSlot);
      console.log("mentorId", mentorId);
      console.log("refreshBookings", refreshBookings);

      fetchScheduleAndBlockedDates();
    }
  }, [isOpen]);

  const convertTo24Hour = (time: string): string => {
    const [timePart, period] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const fetchScheduleAndBlockedDates = async () => {
    try {
      setLoading(true);
      if (!serviceSlot) {
        console.error(
          "fetchScheduleAndBlockedDates ERROR: No slot ID provided"
        );
        toast.error("Service schedule not found.");
        return;
      }

      const [schedules, fetchedBlockedDates] = await Promise.all([
        getMentorSchedule(serviceSlot),
        getMentorBlockedDates(mentorId),
      ]);

      const blockedDateSet = new Set(
        fetchedBlockedDates
          .filter((bd: BlockedDate) => bd.type === "blocked")
          .map((bd: BlockedDate) => {
            // Fix: Use local date formatting for blocked dates too
            const date = new Date(bd.date);
            return `${date.getFullYear()}-${String(
              date.getMonth() + 1
            ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
          })
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dates: {
        day: string;
        date: string;
        fullDate: string;
        isAvailable: boolean;
      }[] = [];

      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        // Fix: Use local date formatting instead of toISOString()
        const fullDate = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

        const dayName = date
          .toLocaleString("en-US", { weekday: "long" })
          .toLowerCase();
        const dateStr = date.toLocaleString("en-US", {
          day: "2-digit",
          month: "short",
        });

        let isAvailable = false;
        if (!blockedDateSet.has(fullDate)) {
          for (const schedule of schedules as Schedule[]) {
            const scheduleDay = schedule.weeklySchedule.find(
              (d: ScheduleDay) => d.day === dayName
            );
            if (
              scheduleDay?.slots.some(
                (slot: ScheduleSlot) =>
                  slot.isAvailable &&
                  !fetchedBlockedDates.some((bd: BlockedDate) => {
                    const bdDate = new Date(bd.date);
                    const bdFullDate = `${bdDate.getFullYear()}-${String(
                      bdDate.getMonth() + 1
                    ).padStart(2, "0")}-${String(bdDate.getDate()).padStart(
                      2,
                      "0"
                    )}`;
                    return (
                      bd.type === "booking" &&
                      bd.slotTime === slot.startTime &&
                      bdFullDate === fullDate
                    );
                  })
              )
            ) {
              isAvailable = true;
              break;
            }
          }
        }

        dates.push({
          day: date.toLocaleString("en-US", { weekday: "short" }),
          date: dateStr,
          fullDate,
          isAvailable,
        });
      }

      setAvailableDates(dates);
      setBlockedDates(fetchedBlockedDates);
    } catch (error) {
      console.error("Error fetching schedule or blocked dates:", error);
      toast.error("Failed to load mentor availability.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = async (
    fullDate: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const dateObj = availableDates.find((d) => d.fullDate === fullDate);
    if (!dateObj?.isAvailable) return;

    setSelectedDate(fullDate);
    setSelectedTime(null);
    setSelectedSlotIndex(null);

    try {
      const schedules: Schedule[] = await getMentorSchedule(serviceSlot);
      const selectedDay = new Date(fullDate)
        .toLocaleString("en-US", { weekday: "long" })
        .toLowerCase();

      const bookedSlotsForDate = blockedDates
        .filter((bd: BlockedDate) => {
          const bdDate = new Date(bd.date);
          const bdFullDate = `${bdDate.getFullYear()}-${String(
            bdDate.getMonth() + 1
          ).padStart(2, "0")}-${String(bdDate.getDate()).padStart(2, "0")}`;
          return (
            bd.type === "booking" && bdFullDate === fullDate && bd.slotTime
          );
        })
        .map((bd: BlockedDate) => bd.slotTime);

      let times: { time: string; slotIndex: number; isBooked: boolean }[] = [];

      for (const schedule of schedules) {
        const scheduleDay = schedule.weeklySchedule.find(
          (d: ScheduleDay) => d.day === selectedDay
        );
        if (scheduleDay) {
          const slots = scheduleDay.slots.map((slot: ScheduleSlot) => ({
            time: slot.startTime,
            slotIndex: slot.index,
            isBooked: bookedSlotsForDate.includes(slot.startTime),
          }));
          times = [...times, ...slots];
        }
      }

      times = [
        ...new Map(times.map((item) => [item.time, item])).values(),
      ].sort((a, b) => {
        const timeA = new Date(`1970-01-01T${convertTo24Hour(a.time)}`);
        const timeB = new Date(`1970-01-01T${convertTo24Hour(b.time)}`);
        return timeA.getTime() - timeB.getTime();
      });

      setAvailableTimes(times);
    } catch (error) {
      console.error("Error fetching schedules for selected date:", error);
      toast.error("Failed to load available times.");
    }
  };

  const handleTimeSelect = (
    time: string,
    slotIndex: number,
    isBooked: boolean
  ) => {
    if (!isBooked) {
      setSelectedTime(time);
      setSelectedSlotIndex(slotIndex);
    }
  };
  const formatSelectedDate = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00"); // Add time to avoid timezone issues
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const handleRescheduleSubmit = async () => {
    try {
      await requestReschedule(bookingId, {
        requestedDate: selectedDate || undefined,
        requestedTime: selectedTime || undefined,
        requestedSlotIndex:
          selectedSlotIndex !== null ? selectedSlotIndex : undefined,
        mentorDecides,
      });
      toast.success("Reschedule request sent successfully.");
      onClose();
      if (refreshBookings) await refreshBookings();
    } catch (error) {
      toast.error("Failed to send reschedule request.");
      console.error("Error sending reschedule request:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-3xl p-6 bg-black text-white shadow-2xl overflow-hidden">
        <div className="bg-gray-100 text-black rounded-xl p-5 max-w-[460px]">
          <DialogHeader className="text-center space-y-4 mb-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse"></div>
                <div className="relative bg-white rounded-full p-3 shadow-lg border-2 border-blue-100">
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold text-gray-900 leading-tight">
                Request Reschedule
              </DialogTitle>
              <p className="text-base text-gray-600 leading-relaxed max-w-sm mx-auto">
                Select a new date and time or let the mentor decide.
              </p>
            </div>
          </DialogHeader>

          {loading ? (
            <div className="text-center text-gray-500">
              Loading availability...
            </div>
          ) : (
            <>
              {!mentorDecides && (
                <>
                  <h3 className="font-semibold text-lg mb-1">Select Date</h3>
                  <div className="flex items-center mb-6">
                    <button
                      className="p-2 hover:bg-gray-200 rounded-full flex-shrink-0"
                      onClick={() => {
                        const container =
                          document.querySelector(".overflow-x-auto");
                        if (container) {
                          container.scrollBy({
                            left: -200,
                            behavior: "smooth",
                          });
                        }
                      }}
                    >
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
                    <div className="flex-1 mx-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      <div className="flex gap-2 py-2 px-1">
                        {availableDates.map((date) => (
                          <button
                            key={date.fullDate}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg min-w-[70px] transition-colors ${
                              selectedDate === date.fullDate
                                ? "bg-black text-white"
                                : date.isAvailable
                                ? "bg-white hover:bg-gray-200 border border-gray-300"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                            onClick={(e) => handleDateSelect(date.fullDate, e)}
                            disabled={!date.isAvailable}
                          >
                            <span className="text-sm font-medium">
                              {date.day}
                            </span>
                            <span className="text-xs">{date.date}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      className="p-2 hover:bg-gray-200 rounded-full flex-shrink-0"
                      onClick={() => {
                        const container =
                          document.querySelector(".overflow-x-auto");
                        if (container) {
                          container.scrollBy({ left: 200, behavior: "smooth" });
                        }
                      }}
                    >
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
                  <h3 className="font-semibold text-lg mb-1">Select Time</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {availableTimes.length > 0 ? (
                      availableTimes.map(({ time, slotIndex, isBooked }) => (
                        <Button
                          key={time}
                          variant={
                            isBooked
                              ? "ghost"
                              : selectedTime === time
                              ? "default"
                              : "outline"
                          }
                          className={`px-4 py-2 rounded-lg ${
                            isBooked
                              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                              : selectedTime === time
                              ? "bg-black text-white"
                              : "bg-white text-black border-gray-300 hover:bg-gray-200"
                          }`}
                          onClick={() =>
                            handleTimeSelect(time, slotIndex, isBooked)
                          }
                          disabled={isBooked}
                        >
                          {isBooked ? "Booked" : time}
                        </Button>
                      ))
                    ) : (
                      <p className="text-gray-500">
                        No available times for this date.
                      </p>
                    )}
                  </div>

                  {/* {(selectedDate || selectedTime) && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-lg mb-2">
                        Selected Schedule
                      </h3>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-sm">
                          <span className="font-medium">Date:</span>{" "}
                          {selectedDate || "Not selected"}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Time:</span>{" "}
                          {selectedTime || "Not selected"}
                        </p>
                      </div>
                    </div>
                  )} */}
                  {(selectedDate || selectedTime) && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-lg mb-2">
                        Selected Schedule
                      </h3>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-sm">
                          <span className="font-medium">Date:</span>{" "}
                          {selectedDate
                            ? formatSelectedDate(selectedDate)
                            : "Not selected"}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Time:</span>{" "}
                          {selectedTime || "Not selected"}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    onClose();
                    setSelectedDate(null);
                    setSelectedTime(null);
                    setSelectedSlotIndex(null);
                    setMentorDecides(false);
                  }}
                  className="flex-1 h-12 font-medium border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleRescheduleSubmit}
                  className="flex-1 h-12 font-medium bg-black hover:bg-gray-800 text-white transition-all duration-200"
                  disabled={!mentorDecides && (!selectedDate || !selectedTime)}
                >
                  Confirm
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleModal;
