// "use client";

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import {
//   getMentorSchedule,
//   getMentorBlockedDates,
//   getMentorPolicy,
// } from "@/services/menteeService";
// import { toast } from "react-hot-toast";
// import { Calendar, Clock, RefreshCw } from "lucide-react";

// interface Service {
//   _id: string;
//   type: string;
//   title: string;
//   description: string;
//   duration: string;
//   price: number;
//   slot: string;
// }

// interface Mentor {
//   _id: string;
//   userData: string;
//   mentorData: string;
//   name: string;
//   role: string;
//   work: string;
//   workRole: string;
//   profileImage?: string;
//   badge: string;
//   isBlocked: boolean;
//   isApproved: string;
//   bio?: string;
//   skills?: string[];
//   services: {
//     _id: string;
//     type: string;
//     title: string;
//     description: string;
//     duration: string;
//     price: number;
//     slot: string;
//   }[];
//   education?: {
//     schoolName?: string;
//     collegeName?: string;
//     city?: string;
//   };
//   workExperience?: {
//     company: string;
//     jobRole: string;
//     city?: string;
//   };
// }

// interface ScheduleSlot {
//   index: number;
//   startTime: string;
//   endTime: string;
//   isAvailable: boolean;
// }

// interface ScheduleDay {
//   day: string;
//   slots: ScheduleSlot[];
// }

// interface Schedule {
//   mentorId: string;
//   scheduleName: string;
//   weeklySchedule: ScheduleDay[];
//   createdAt: string;
//   updatedAt: string;
//   _id: string;
// }

// interface BlockedDate {
//   date: string;
//   day: string;
//   mentorId: string;
//   type: "blocked" | "booking";
//   slotTime?: string;
//   createdAt: string;
//   updatedAt: string;
//   _id: string;
// }

// interface MentorPolicy {
//   bookingPeriod: { unit: string; value: number };
//   reschedulePeriod: { unit: string; value: number };
//   noticePeriod: { unit: string; value: number };
//   _id: string;
//   userId: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface BookingConfirmProps {
//   onConfirm: (date: string, time: string, slotIndex: number) => void;
//   mentor: Mentor;
//   service: Service;
// }

// export default function BookingConfirm({
//   onConfirm,
//   mentor,
//   service,
// }: BookingConfirmProps) {
//   const [selectedDate, setSelectedDate] = useState<string | null>(null);
//   const [selectedTime, setSelectedTime] = useState<string | null>(null);
//   const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(
//     null
//   );
//   const [availableDates, setAvailableDates] = useState<
//     { day: string; date: string; fullDate: string; isAvailable: boolean }[]
//   >([]);
//   const [availableTimes, setAvailableTimes] = useState<
//     { time: string; slotIndex: number; isBooked: boolean }[]
//   >([]);
//   const [mentorPolicy, setMentorPolicy] = useState<MentorPolicy | null>(null);
//   const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     console.log("BookingConfirm STEP 1: mentor", mentor);
//     console.log("BookingConfirm STEP 1.5: service", service);

//     const fetchPolicyAndSchedule = async () => {
//       try {
//         const mentorPolicy = await getMentorPolicy(mentor.userData);
//         // console.log("STEP 1 mentorpolicy >>>>", mentorPolicy);
//         console.log("BookingConfirm STEP 2 menotrpolicy", mentorPolicy);
//         setMentorPolicy(mentorPolicy);

//         if (!mentor?.userData || !service) {
//           console.error("Mentor ID or Service is missing.", {
//             mentor,
//             service,
//           });
//           toast.error("Mentor or service data is missing.");
//           navigate("/seeker/mentors");
//           return;
//         }

//         if (
//           service.type === "DigitalProducts" ||
//           service.type === "priorityDM"
//         ) {
//           setLoading(false);
//           return;
//         }
//         console.log("BookingConfirm STEP 2.5: service", service);

//         console.log("BookingConfirm STEP 3: service", service.slot);

//         const [schedules, fetchedBlockedDates] = await Promise.all([
//           getMentorSchedule(service?.slot),
//           getMentorBlockedDates(mentor.userData),
//         ]);

//         console.log("BookingConfirm STEP 4: fetched data", {
//           schedules,
//           blockedDates: fetchedBlockedDates,
//         });

//         setBlockedDates(fetchedBlockedDates);

//         const blockedDateSet = new Set(
//           fetchedBlockedDates
//             .filter((bd: BlockedDate) => bd.type === "blocked")
//             .map(
//               (bd: BlockedDate) => new Date(bd.date).toISOString().split("T")[0]
//             )
//         );
//         console.log("BookingConfirm STEP 5: blockedDateSet", blockedDateSet);

//         const today = new Date();

//         today.setHours(0, 0, 0, 0);
//         const dates: {
//           day: string;
//           date: string;
//           fullDate: string;
//           isAvailable: boolean;
//         }[] = [];
//         console.log("BookingConfirm STEP 6: ", dates);
//         const bookingPeriodDays =
//           mentorPolicy?.bookingPeriod?.unit === "days"
//             ? mentorPolicy.bookingPeriod.value
//             : 0;
//         const minBookableDate = new Date(today);
//         minBookableDate.setDate(today.getDate() + bookingPeriodDays);
//         console.log("BookingConfirm STEP 7: ", minBookableDate);
//         for (let i = 0; i < 30; i++) {
//           const date = new Date();
//           date.setDate(today.getDate() + i);
//           const fullDate = date.toISOString().split("T")[0];
//           const dayName = date
//             .toLocaleString("en-US", { weekday: "long" })
//             .toLowerCase();
//           const dateStr = date.toLocaleString("en-US", {
//             day: "2-digit",
//             month: "short",
//           });
//           console.log(
//             "BookingConfirm STEP 8: ",
//             date,
//             fullDate,
//             dayName,
//             dateStr
//           );
//           let isAvailable = false;
//           if (date >= minBookableDate && !blockedDateSet.has(fullDate)) {
//             for (const schedule of schedules as Schedule[]) {
//               console.log("BookingConfirm STEP 8.5 ");
//               const scheduleDay = schedule.weeklySchedule.find(
//                 (d: ScheduleDay) => d.day === dayName
//               );
//               console.log("BookingConfirm STEP 9: ");
//               if (
//                 scheduleDay?.slots.some(
//                   (slot: ScheduleSlot) =>
//                     slot.isAvailable &&
//                     !fetchedBlockedDates.some(
//                       (bd: BlockedDate) =>
//                         bd.type === "booking" &&
//                         bd.slotTime === slot.startTime &&
//                         new Date(bd.date).toISOString().split("T")[0] ===
//                           fullDate
//                     )
//                 )
//               ) {
//                 console.log("BookingConfirm STEP 10: ");
//                 isAvailable = true;
//                 break;
//               }
//             }
//           }
//           console.log("BookingConfirm STEP 11: ");
//           dates.push({
//             day: date.toLocaleString("en-US", { weekday: "short" }),
//             date: dateStr,
//             fullDate,
//             isAvailable,
//           });
//         }
//         console.log("BookingConfirm STEP 12: ", dates);
//         setAvailableDates(dates);
//         console.log("BookingConfirm STEP 13: ");
//         console.log("AVIALBLE DATES", availableDates);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         toast.error("Failed to load mentor availability or policy.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPolicyAndSchedule();
//   }, [mentor?.userData, service?.slot, navigate]);

//   const convertTo24Hour = (time: string): string => {
//     const [timePart, period] = time.split(" ");
//     // eslint-disable-next-line prefer-const
//     let [hours, minutes] = timePart.split(":").map(Number);
//     if (period === "PM" && hours !== 12) hours += 12;
//     if (period === "AM" && hours === 12) hours = 0;
//     return `${hours.toString().padStart(2, "0")}:${minutes
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   const handleDateSelect = (
//     fullDate: string,
//     event: React.MouseEvent<HTMLButtonElement>
//   ) => {
//     event.preventDefault();
//     const dateObj = availableDates.find((d) => d.fullDate === fullDate);
//     if (!dateObj?.isAvailable) return;
//     setSelectedDate(fullDate);
//     setSelectedTime(null);
//     setSelectedSlotIndex(null);

//     getMentorSchedule(service?.slot)
//       .then((schedules: Schedule[]) => {
//         const selectedDay = new Date(fullDate)
//           .toLocaleString("en-US", { weekday: "long" })
//           .toLowerCase();
//         const bookedSlotsForDate = blockedDates
//           .filter(
//             (bd: BlockedDate) =>
//               bd.type === "booking" &&
//               new Date(bd.date).toISOString().split("T")[0] === fullDate &&
//               bd.slotTime
//           )
//           .map((bd: BlockedDate) => bd.slotTime);

//         let times: { time: string; slotIndex: number; isBooked: boolean }[] =
//           [];

//         for (const schedule of schedules) {
//           const scheduleDay = schedule.weeklySchedule.find(
//             (d: ScheduleDay) => d.day === selectedDay
//           );
//           if (scheduleDay) {
//             const slots = scheduleDay.slots.map((slot: ScheduleSlot) => ({
//               time: slot.startTime,
//               slotIndex: slot.index,
//               isBooked: bookedSlotsForDate.includes(slot.startTime),
//             }));
//             times = [...times, ...slots];
//           }
//         }

//         times = [
//           ...new Map(times.map((item) => [item.time, item])).values(),
//         ].sort((a, b) => {
//           const timeA = new Date(`1970-01-01T${convertTo24Hour(a.time)}`);
//           const timeB = new Date(`1970-01-01T${convertTo24Hour(b.time)}`);
//           return timeA.getTime() - timeB.getTime();
//         });

//         setAvailableTimes(times);
//       })
//       .catch((error) => {
//         console.error("Error fetching schedules for selected date:", error);
//         toast.error("Failed to load available times.");
//       });
//   };

//   const handleTimeSelect = (
//     time: string,
//     slotIndex: number,
//     isBooked: boolean
//   ) => {
//     if (!isBooked) {
//       setSelectedTime(time);
//       setSelectedSlotIndex(slotIndex);
//     }
//   };

//   const handleConfirmClick = () => {
//     if (service.type === "DigitalProducts" || service.type === "priorityDM") {
//       const now = new Date();
//       const currentDate = now.toISOString().split("T")[0];
//       const currentTime = now.toLocaleTimeString("en-US", {
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true,
//       });
//       onConfirm(currentDate, currentTime, 0);
//     } else if (selectedDate && selectedTime && selectedSlotIndex !== null) {
//       onConfirm(selectedDate, selectedTime, selectedSlotIndex);
//     } else {
//       toast.error("Please select a date and time.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="text-center text-gray-500">Loading availability...</div>
//     );
//   }

//   const renderPolicyDetails = () => (
//     <div className="mb-1 space-y-4">
//       <h3 className="font-semibold text-lg">Booking Policies</h3>
//       <div className="space-y-3">
//         <div className="flex items-start gap-3">
//           <Calendar className="w-5 h-5 text-gray-500 mt-1" />
//           <div>
//             <p className="font-medium">Booking Period</p>
//             <p className="text-sm text-gray-600">
//               Bookings must be made at least{" "}
//               {mentorPolicy?.bookingPeriod?.value}{" "}
//               {mentorPolicy?.bookingPeriod?.unit || "days"} in advance.
//             </p>
//           </div>
//         </div>
//         <div className="flex items-start gap-3">
//           <RefreshCw className="w-5 h-5 text-gray-500 mt-1" />
//           <div>
//             <p className="font-medium">Reschedule Period</p>
//             <p className="text-sm text-gray-600">
//               You can reschedule your booking up to{" "}
//               {mentorPolicy?.reschedulePeriod?.value}{" "}
//               {mentorPolicy?.reschedulePeriod?.unit || "hours"} before the
//               scheduled time.
//             </p>
//           </div>
//         </div>
//         <div className="flex items-start gap-3">
//           <Clock className="w-5 h-5 text-gray-500 mt-1" />
//           <div>
//             <p className="font-medium">Notice Period</p>
//             <p className="text-sm text-gray-600">
//               The mentor will wait for {mentorPolicy?.noticePeriod?.value}{" "}
//               {mentorPolicy?.noticePeriod?.unit || "minutes"} if you are late
//               for the session.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   if (service.type === "DigitalProducts" || service.type === "priorityDM") {
//     return (
//       <div className="bg-black text-white rounded-3xl max-w-md w-full p-6">
//         <div className="bg-gray-100 text-black rounded-xl p-6">
//           {renderPolicyDetails()}
//           <Button
//             variant="default"
//             className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
//             onClick={handleConfirmClick}
//           >
//             Confirm
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-black text-white rounded-3xl max-w-md w-full p-6">
//       <div className="bg-gray-100 text-black rounded-xl p-5">
//         {renderPolicyDetails()}
//         <h3 className="font-semibold text-lg mb-1">Select Date</h3>
//         <div className="flex items-center justify-between mb-6">
//           <button
//             className="p-2 hover:bg-gray-200 rounded-full flex-shrink-0"
//             onClick={() => {
//               const container = document.querySelector(".overflow-x-auto");
//               if (container) {
//                 container.scrollBy({
//                   left: -200,
//                   behavior: "smooth",
//                 });
//               }
//             }}
//           >
//             <svg
//               width="20"
//               height="20"
//               viewBox="0 0 24 24"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M15 18L9 12L15 6"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </button>

//           <div className="flex gap-2 overflow-x-auto py-2 px-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//             {availableDates.map((date) => (
//               <button
//                 key={date.fullDate}
//                 className={`flex flex-col items-center justify-center p-3 rounded-lg min-w-[70px] transition-colors ${
//                   selectedDate === date.fullDate
//                     ? "bg-black text-white"
//                     : date.isAvailable
//                     ? "bg-white hover:bg-gray-200 border border-gray-300"
//                     : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 }`}
//                 onClick={(event) => handleDateSelect(date.fullDate, event)}
//                 disabled={!date.isAvailable}
//               >
//                 <span className="text-sm font-medium">{date.day}</span>
//                 <span className="text-xs">{date.date}</span>
//               </button>
//             ))}
//           </div>

//           <button
//             className="p-2 hover:bg-gray-200 rounded-full flex-shrink-0"
//             onClick={() => {
//               const container = document.querySelector(".overflow-x-auto");
//               if (container) {
//                 container.scrollBy({
//                   left: 200,
//                   behavior: "smooth",
//                 });
//               }
//             }}
//           >
//             <svg
//               width="20"
//               height="20"
//               viewBox="0 0 24 24"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M9 6L15 12L9 18"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </button>
//         </div>
//         <h3 className="font-semibold text-lg mb-1">Select Time</h3>
//         <div className="flex flex-wrap gap-2 mb-6">
//           {availableTimes.length > 0 ? (
//             availableTimes.map(({ time, slotIndex, isBooked }) => (
//               <Button
//                 key={time}
//                 variant={
//                   isBooked
//                     ? "ghost"
//                     : selectedTime === time
//                     ? "default"
//                     : "outline"
//                 }
//                 className={`px-4 py-2 rounded-lg ${
//                   isBooked
//                     ? "bg-gray-400 text-gray-700 cursor-not-allowed"
//                     : selectedTime === time
//                     ? "bg-black text-white"
//                     : "bg-white text-black border-gray-300 hover:bg-gray-200"
//                 }`}
//                 onClick={() => handleTimeSelect(time, slotIndex, isBooked)}
//                 disabled={isBooked}
//               >
//                 {isBooked ? "Booked" : time}
//               </Button>
//             ))
//           ) : (
//             <p className="text-gray-500">No available times for this date.</p>
//           )}
//         </div>

//         <Button
//           variant="default"
//           className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
//           onClick={handleConfirmClick}
//           disabled={!selectedDate || !selectedTime}
//         >
//           Confirm
//         </Button>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getMentorSchedule,
  getMentorBlockedDates,
  getMentorPolicy,
} from "@/services/menteeService";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Clock,
  RefreshCw,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Shield,
  Zap,
  AlertCircle,
  Crown,
  Target,
  Award,
} from "lucide-react";

interface Service {
  _id: string;
  type: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  slot: string;
}

interface Mentor {
  _id: string;
  userData: string;
  mentorData: string;
  name: string;
  role: string;
  work: string;
  workRole: string;
  profileImage?: string;
  badge: string;
  isBlocked: boolean;
  isApproved: string;
  bio?: string;
  skills?: string[];
  services: {
    _id: string;
    type: string;
    title: string;
    description: string;
    duration: string;
    price: number;
    slot: string;
  }[];
  education?: {
    schoolName?: string;
    collegeName?: string;
    city?: string;
  };
  workExperience?: {
    company: string;
    jobRole: string;
    city?: string;
  };
}

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

interface MentorPolicy {
  bookingPeriod: { unit: string; value: number };
  reschedulePeriod: { unit: string; value: number };
  noticePeriod: { unit: string; value: number };
  _id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface BookingConfirmProps {
  onConfirm: (date: string, time: string, slotIndex: number) => void;
  mentor: Mentor;
  service: Service;
}

export default function BookingConfirm({
  onConfirm,
  mentor,
  service,
}: BookingConfirmProps) {
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
  const [mentorPolicy, setMentorPolicy] = useState<MentorPolicy | null>(null);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("BookingConfirm STEP 1: mentor", mentor);
    console.log("BookingConfirm STEP 1.5: service", service);

    const fetchPolicyAndSchedule = async () => {
      try {
        const mentorPolicy = await getMentorPolicy(mentor.userData);
        console.log("BookingConfirm STEP 2 menotrpolicy", mentorPolicy);
        setMentorPolicy(mentorPolicy);

        if (!mentor?.userData || !service) {
          console.error("Mentor ID or Service is missing.", {
            mentor,
            service,
          });
          toast.error("Mentor or service data is missing.");
          navigate("/seeker/mentors");
          return;
        }

        if (
          service.type === "DigitalProducts" ||
          service.type === "priorityDM"
        ) {
          setLoading(false);
          return;
        }
        console.log("BookingConfirm STEP 2.5: service", service);
        console.log("BookingConfirm STEP 3: service", service.slot);

        const [schedules, fetchedBlockedDates] = await Promise.all([
          getMentorSchedule(service?.slot),
          getMentorBlockedDates(mentor.userData),
        ]);

        console.log("BookingConfirm STEP 4: fetched data", {
          schedules,
          blockedDates: fetchedBlockedDates,
        });

        setBlockedDates(fetchedBlockedDates);

        const blockedDateSet = new Set(
          fetchedBlockedDates
            .filter((bd: BlockedDate) => bd.type === "blocked")
            .map(
              (bd: BlockedDate) => new Date(bd.date).toISOString().split("T")[0]
            )
        );
        console.log("BookingConfirm STEP 5: blockedDateSet", blockedDateSet);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dates: {
          day: string;
          date: string;
          fullDate: string;
          isAvailable: boolean;
        }[] = [];
        console.log("BookingConfirm STEP 6: ", dates);
        const bookingPeriodDays =
          mentorPolicy?.bookingPeriod?.unit === "days"
            ? mentorPolicy.bookingPeriod.value
            : 0;
        const minBookableDate = new Date(today);
        minBookableDate.setDate(today.getDate() + bookingPeriodDays);
        console.log("BookingConfirm STEP 7: ", minBookableDate);

        for (let i = 0; i < 30; i++) {
          const date = new Date();
          date.setDate(today.getDate() + i);
          const fullDate = date.toISOString().split("T")[0];
          const dayName = date
            .toLocaleString("en-US", { weekday: "long" })
            .toLowerCase();
          const dateStr = date.toLocaleString("en-US", {
            day: "2-digit",
            month: "short",
          });
          console.log(
            "BookingConfirm STEP 8: ",
            date,
            fullDate,
            dayName,
            dateStr
          );
          let isAvailable = false;
          if (date >= minBookableDate && !blockedDateSet.has(fullDate)) {
            for (const schedule of schedules as Schedule[]) {
              console.log("BookingConfirm STEP 8.5 ");
              const scheduleDay = schedule.weeklySchedule.find(
                (d: ScheduleDay) => d.day === dayName
              );
              console.log("BookingConfirm STEP 9: ");
              if (
                scheduleDay?.slots.some(
                  (slot: ScheduleSlot) =>
                    slot.isAvailable &&
                    !fetchedBlockedDates.some(
                      (bd: BlockedDate) =>
                        bd.type === "booking" &&
                        bd.slotTime === slot.startTime &&
                        new Date(bd.date).toISOString().split("T")[0] ===
                          fullDate
                    )
                )
              ) {
                console.log("BookingConfirm STEP 10: ");
                isAvailable = true;
                break;
              }
            }
          }
          console.log("BookingConfirm STEP 11: ");
          dates.push({
            day: date.toLocaleString("en-US", { weekday: "short" }),
            date: dateStr,
            fullDate,
            isAvailable,
          });
        }
        console.log("BookingConfirm STEP 12: ", dates);
        setAvailableDates(dates);
        console.log("BookingConfirm STEP 13: ");
        console.log("AVIALBLE DATES", availableDates);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load mentor availability or policy.");
      } finally {
        setLoading(false);
      }
    };

    fetchPolicyAndSchedule();
  }, [mentor?.userData, service?.slot, navigate]);

  const convertTo24Hour = (time: string): string => {
    const [timePart, period] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const handleDateSelect = (
    fullDate: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const dateObj = availableDates.find((d) => d.fullDate === fullDate);
    if (!dateObj?.isAvailable) return;
    setSelectedDate(fullDate);
    setSelectedTime(null);
    setSelectedSlotIndex(null);

    getMentorSchedule(service?.slot)
      .then((schedules: Schedule[]) => {
        const selectedDay = new Date(fullDate)
          .toLocaleString("en-US", { weekday: "long" })
          .toLowerCase();
        const bookedSlotsForDate = blockedDates
          .filter(
            (bd: BlockedDate) =>
              bd.type === "booking" &&
              new Date(bd.date).toISOString().split("T")[0] === fullDate &&
              bd.slotTime
          )
          .map((bd: BlockedDate) => bd.slotTime);

        let times: { time: string; slotIndex: number; isBooked: boolean }[] =
          [];

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
      })
      .catch((error) => {
        console.error("Error fetching schedules for selected date:", error);
        toast.error("Failed to load available times.");
      });
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

  const handleConfirmClick = () => {
    if (service.type === "DigitalProducts" || service.type === "priorityDM") {
      const now = new Date();
      const currentDate = now.toISOString().split("T")[0];
      const currentTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      onConfirm(currentDate, currentTime, 0);
    } else if (selectedDate && selectedTime && selectedSlotIndex !== null) {
      onConfirm(selectedDate, selectedTime, selectedSlotIndex);
    } else {
      toast.error("Please select a date and time.");
    }
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-2xl bg-white rounded-3xl overflow-hidden max-w-md">
        <CardContent className="p-8">
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">
                Loading availability...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderPolicyDetails = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Booking Policies</h3>
          <p className="text-sm text-gray-600">
            Important guidelines for your session
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
          <div className="p-2 bg-blue-100 rounded-lg mt-0.5">
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              Advance Booking
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Book at least {mentorPolicy?.bookingPeriod?.value}{" "}
              {mentorPolicy?.bookingPeriod?.unit || "days"} in advance
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl">
          <div className="p-2 bg-orange-100 rounded-lg mt-0.5">
            <RefreshCw className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              Reschedule Policy
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Reschedule up to {mentorPolicy?.reschedulePeriod?.value}{" "}
              {mentorPolicy?.reschedulePeriod?.unit || "hours"} before session
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
          <div className="p-2 bg-green-100 rounded-lg mt-0.5">
            <Clock className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Wait Time</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Mentor waits {mentorPolicy?.noticePeriod?.value}{" "}
              {mentorPolicy?.noticePeriod?.unit || "minutes"} if you're late
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Special handling for Digital Products and Priority DM
  if (service.type === "DigitalProducts" || service.type === "priorityDM") {
    return (
      <Card className="border-0 shadow-2xl bg-white rounded-3xl overflow-hidden max-w-md sticky top-8">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Zap className="w-6 h-6" />
            </div>
            Instant Access
          </CardTitle>
          <p className="text-purple-100">No scheduling required</p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {renderPolicyDetails()}

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-green-800">Ready to Start</p>
                <p className="text-sm text-green-600">
                  Access immediately after payment
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleConfirmClick}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl py-4 font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Confirm Booking
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-2xl bg-white rounded-3xl overflow-hidden max-w-md sticky top-8">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          Schedule Session
        </CardTitle>
        <p className="text-purple-100">Choose your preferred date and time</p>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Date Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Select Date
            </h3>
            <div className="flex gap-2">
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => {
                  const container = document.querySelector(".date-scroll");
                  if (container) {
                    container.scrollBy({ left: -200, behavior: "smooth" });
                  }
                }}
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => {
                  const container = document.querySelector(".date-scroll");
                  if (container) {
                    container.scrollBy({ left: 200, behavior: "smooth" });
                  }
                }}
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="date-scroll flex gap-2 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {availableDates.map((date) => (
              <button
                key={date.fullDate}
                className={`flex flex-col items-center justify-center p-3 rounded-xl min-w-[70px] transition-all duration-200 ${
                  selectedDate === date.fullDate
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105"
                    : date.isAvailable
                    ? "bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 hover:border-purple-300 text-gray-900"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                onClick={(event) => handleDateSelect(date.fullDate, event)}
                disabled={!date.isAvailable}
              >
                <span className="text-xs font-medium mb-1">{date.day}</span>
                <span className="text-sm font-bold">{date.date}</span>
                {selectedDate === date.fullDate && (
                  <div className="w-1 h-1 bg-white rounded-full mt-1"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Available Times
          </h3>

          <div className="grid grid-cols-2 gap-2">
            {availableTimes.length > 0 ? (
              availableTimes.map(({ time, slotIndex, isBooked }) => (
                <button
                  key={time}
                  className={`p-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isBooked
                      ? "bg-red-50 text-red-400 cursor-not-allowed border-2 border-red-200"
                      : selectedTime === time
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105"
                      : "bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 text-gray-900"
                  }`}
                  onClick={() => handleTimeSelect(time, slotIndex, isBooked)}
                  disabled={isBooked}
                >
                  {isBooked ? (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>Booked</span>
                    </div>
                  ) : (
                    time
                  )}
                </button>
              ))
            ) : selectedDate ? (
              <div className="col-span-2 p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No available times</p>
                <p className="text-sm text-gray-400">
                  Please select another date
                </p>
              </div>
            ) : (
              <div className="col-span-2 p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-gray-500 font-medium">Select a date first</p>
                <p className="text-sm text-gray-400">
                  Choose from available dates above
                </p>
              </div>
            )}
          </div>
        </div>
        {renderPolicyDetails()}
        {/* Confirmation Button */}
        <div className="pt-4">
          <Button
            onClick={handleConfirmClick}
            disabled={!selectedDate || !selectedTime}
            className={`w-full py-4 font-bold text-lg rounded-xl shadow-lg transition-all duration-200 ${
              selectedDate && selectedTime
                ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transform hover:scale-105"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {selectedDate && selectedTime ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Confirm Booking
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Select Date & Time
              </div>
            )}
          </Button>
        </div>

        {/* Selected Summary */}
        {selectedDate && selectedTime && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-green-800">
                  Session Scheduled
                </p>
                <p className="text-sm text-green-600">
                  {new Date(selectedDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  at {selectedTime}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
