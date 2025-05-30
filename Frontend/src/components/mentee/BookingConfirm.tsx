// // "use client";

// // import { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { Button } from "@/components/ui/button";
// // import {
// //   getMentorSchedule,
// //   getMentorBlockedDates,
// // } from "@/services/menteeService";
// // import { toast } from "react-hot-toast";

// // interface Service {
// //   _id: string;
// //   type: string;
// //   title: string;
// //   description: string;
// //   duration: string;
// //   price: number;
// //   slot: string;
// // }
// // interface Mentor {
// //   _id: string;
// //   userData: string;
// //   mentorData: string;
// //   name: string;
// //   role: string;
// //   work: string;
// //   workRole: string;
// //   profileImage?: string;
// //   badge: string;
// //   isBlocked: boolean;
// //   isApproved: string;
// //   bio?: string;
// //   skills?: string[];
// //   services: {
// //     _id: string;
// //     type: string;
// //     title: string;
// //     description: string;
// //     duration: string;
// //     price: number;
// //     slot: string;
// //   }[];
// //   education?: {
// //     schoolName?: string;
// //     collegeName?: string;
// //     city?: string;
// //   };
// //   workExperience?: {
// //     company: string;
// //     jobRole: string;
// //     city?: string;
// //   };
// // }

// // interface BookingConfirmProps {
// //   onConfirm: (date: string, time: string) => void;
// //   mentor: Mentor;
// //   service: Service; // Change from `string` to `Service`
// // }

// // interface ScheduleSlot {
// //   index: number;
// //   startTime: string;
// //   endTime: string;
// //   isAvailable: boolean;
// // }

// // interface ScheduleDay {
// //   day: string;
// //   slots: ScheduleSlot[];
// // }

// // interface Schedule {
// //   mentorId: string;
// //   scheduleName: string;
// //   weeklySchedule: ScheduleDay[];
// //   createdAt: string;
// //   updatedAt: string;
// //   _id: string;
// // }

// // interface BlockedDate {
// //   date: string;
// //   day: string;
// //   mentorId: string;
// //   createdAt: string;
// //   _id: string;
// // }

// // export default function BookingConfirm({
// //   onConfirm,
// //   mentor,
// //   service,
// // }: BookingConfirmProps) {
// //   const [selectedDate, setSelectedDate] = useState<string | null>(null);
// //   const [selectedTime, setSelectedTime] = useState<string | null>(null);
// //   const [availableDates, setAvailableDates] = useState<
// //     { day: string; date: string; fullDate: string; isAvailable: boolean }[]
// //   >([]);
// //   const [availableTimes, setAvailableTimes] = useState<string[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const navigate = useNavigate();

// //   // useEffect(() => {
// //   //   console.log("BookingConfirm STEP 1: mentor", mentor);
// //   //   console.log("BookingConfirm STEP 1.5: service", service);
// //   //   if (!mentor?.userData) {
// //   //     console.error("Mentor ID is missing.");
// //   //     toast.error("Mentor ID is missing.");
// //   //     navigate("/seeker/mentors");
// //   //     return;
// //   //   }

// //   //   console.log("BookingConfirm STEP 2: mentor.userData", mentor.userData);
// //   //   const fetchScheduleAndBlockedDates = async () => {
// //   //     try {
// //   //       console.log("BookingConfirm STEP 3: fetching data");
// //   //       setLoading(true);
// //   //       console.log(
// //   //         "BookingConfirm STEP 3.5: ",
// //   //         service?.slot,
// //   //         " and >> ",
// //   //         mentor.userData
// //   //       );
// //   //       const [schedules, blockedDates] = await Promise.all([
// //   //         getMentorSchedule(service?.slot),
// //   //         getMentorBlockedDates(mentor.userData),
// //   //       ]);

// //   //       console.log("BookingConfirm STEP 4: fetched data", {
// //   //         schedules,
// //   //         blockedDates,
// //   //       });

// //   //       // Process blocked dates
// //   //       const blockedDateSet = new Set(
// //   //         blockedDates.map(
// //   //           (bd: BlockedDate) => new Date(bd.date).toISOString().split("T")[0]
// //   //         )
// //   //       );

// //   //       // Process schedules (array of schedules)
// //   //       const today = new Date();
// //   //       today.setHours(0, 0, 0, 0);
// //   //       const dates: {
// //   //         day: string;
// //   //         date: string;
// //   //         fullDate: string;
// //   //         isAvailable: boolean;
// //   //       }[] = [];

// //   //       // Generate dates for the next 30 days
// //   //       for (let i = 0; i < 30; i++) {
// //   //         const date = new Date();
// //   //         date.setDate(today.getDate() + i);
// //   //         const fullDate = date.toISOString().split("T")[0];
// //   //         const dayName = date
// //   //           .toLocaleString("en-US", { weekday: "long" })
// //   //           .toLowerCase();
// //   //         const dateStr = date.toLocaleString("en-US", {
// //   //           day: "2-digit",
// //   //           month: "short",
// //   //         });

// //   //         // Check if any schedule has available slots for this day
// //   //         let isAvailable = false;
// //   //         for (const schedule of schedules as Schedule[]) {
// //   //           const scheduleDay = schedule.weeklySchedule.find(
// //   //             (d: ScheduleDay) => d.day === dayName
// //   //           );
// //   //           if (
// //   //             scheduleDay?.slots.some((slot: ScheduleSlot) => slot.isAvailable)
// //   //           ) {
// //   //             isAvailable = true;
// //   //             break;
// //   //           }
// //   //         }

// //   //         // Disable if blocked
// //   //         if (blockedDateSet.has(fullDate)) {
// //   //           isAvailable = false;
// //   //         }

// //   //         dates.push({
// //   //           day: date.toLocaleString("en-US", { weekday: "short" }),
// //   //           date: dateStr,
// //   //           fullDate,
// //   //           isAvailable,
// //   //         });
// //   //       }

// //   //       setAvailableDates(dates);

// //   //       // Set available times for the selected date
// //   //       if (selectedDate) {
// //   //         const selectedDay = new Date(selectedDate)
// //   //           .toLocaleString("en-US", { weekday: "long" })
// //   //           .toLowerCase();
// //   //         let times: string[] = [];

// //   //         // Aggregate available slots from all schedules
// //   //         for (const schedule of schedules as Schedule[]) {
// //   //           const scheduleDay = schedule.weeklySchedule.find(
// //   //             (d: ScheduleDay) => d.day === selectedDay
// //   //           );
// //   //           if (scheduleDay) {
// //   //             const availableSlots = scheduleDay.slots
// //   //               .filter((slot: ScheduleSlot) => slot.isAvailable)
// //   //               .map((slot: ScheduleSlot) => slot.startTime);
// //   //             times = [...times, ...availableSlots];
// //   //           }
// //   //         }

// //   //         // Remove duplicates and sort times
// //   //         times = [...new Set(times)].sort((a, b) => {
// //   //           const timeA = new Date(`1970-01-01T${convertTo24Hour(a)}`);
// //   //           const timeB = new Date(`1970-01-01T${convertTo24Hour(b)}`);
// //   //           return timeA.getTime() - timeB.getTime();
// //   //         });

// //   //         setAvailableTimes(times);
// //   //       }
// //   //     } catch (error: any) {
// //   //       console.error("Error fetching schedule or blocked dates:", error);
// //   //       toast.error("Failed to load mentor availability.");
// //   //     } finally {
// //   //       setLoading(false);
// //   //     }
// //   //   };

// //   //   fetchScheduleAndBlockedDates();
// //   // }, [mentor?.userData, selectedDate, navigate]);
// //   useEffect(() => {
// //     console.log("BookingConfirm STEP 1: mentor", mentor);
// //     console.log("BookingConfirm STEP 1.5: service", service);
// //     if (!mentor?.userData) {
// //       console.error("Mentor ID or Service slot is missing.", {
// //         mentor,
// //         service,
// //       });
// //       toast.error("Mentor or service data is missing.");
// //       navigate("/seeker/mentors");
// //       return;
// //     }

// //     console.log("BookingConfirm STEP 2: mentor.userData", mentor.userData);
// //     const fetchScheduleAndBlockedDates = async () => {
// //       try {
// //         console.log("BookingConfirm STEP 3: fetching data");
// //         setLoading(true);
// //         console.log(
// //           "BookingConfirm STEP 3.5: ",
// //           service?.slot,
// //           " and >> ",
// //           mentor.userData
// //         );
// //         const [schedules, blockedDates] = await Promise.all([
// //           getMentorSchedule(service?.slot), // Use service.slot for schedule
// //           getMentorBlockedDates(mentor.userData),
// //         ]);

// //         console.log("BookingConfirm STEP 4: fetched data", {
// //           schedules,
// //           blockedDates,
// //         });

// //         // Process blocked dates
// //         const blockedDateSet = new Set(
// //           blockedDates.map(
// //             (bd: BlockedDate) => new Date(bd.date).toISOString().split("T")[0]
// //           )
// //         );

// //         // Process schedules
// //         const today = new Date();
// //         today.setHours(0, 0, 0, 0);
// //         const dates: {
// //           day: string;
// //           date: string;
// //           fullDate: string;
// //           isAvailable: boolean;
// //         }[] = [];

// //         // Generate dates for the next 30 days
// //         for (let i = 0; i < 30; i++) {
// //           const date = new Date();
// //           date.setDate(today.getDate() + i);
// //           const fullDate = date.toISOString().split("T")[0];
// //           const dayName = date
// //             .toLocaleString("en-US", { weekday: "long" })
// //             .toLowerCase();
// //           const dateStr = date.toLocaleString("en-US", {
// //             day: "2-digit",
// //             month: "short",
// //           });

// //           // Check if any schedule has available slots for this day
// //           let isAvailable = false;
// //           for (const schedule of schedules as Schedule[]) {
// //             const scheduleDay = schedule.weeklySchedule.find(
// //               (d: ScheduleDay) => d.day === dayName
// //             );
// //             if (
// //               scheduleDay?.slots.some((slot: ScheduleSlot) => slot.isAvailable)
// //             ) {
// //               isAvailable = true;
// //               break;
// //             }
// //           }

// //           // Disable if blocked
// //           if (blockedDateSet.has(fullDate)) {
// //             isAvailable = false;
// //           }

// //           dates.push({
// //             day: date.toLocaleString("en-US", { weekday: "short" }),
// //             date: dateStr,
// //             fullDate,
// //             isAvailable,
// //           });
// //         }

// //         setAvailableDates(dates);
// //       } catch (error: any) {
// //         console.error("Error fetching schedule or blocked dates:", error);
// //         toast.error("Failed to load mentor availability.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchScheduleAndBlockedDates();
// //   }, [mentor?.userData, service?.slot, navigate]); // Remove selectedDate from dependencies

// //   // Helper function to convert 12-hour time to 24-hour for sorting
// //   const convertTo24Hour = (time: string): string => {
// //     const [timePart, period] = time.split(" ");
// //     let [hours, minutes] = timePart.split(":").map(Number);
// //     if (period === "PM" && hours !== 12) hours += 12;
// //     if (period === "AM" && hours === 12) hours = 0;
// //     return `${hours.toString().padStart(2, "0")}:${minutes
// //       .toString()
// //       .padStart(2, "0")}`;
// //   };

// //   // const handleDateSelect = (fullDate: string) => {
// //   //   const dateObj = availableDates.find((d) => d.fullDate === fullDate);
// //   //   if (!dateObj?.isAvailable) return; // Prevent selecting unavailable dates
// //   //   setSelectedDate(fullDate);
// //   //   setSelectedTime(null); // Reset time when date changes

// //   //   // Fetch schedules again for the selected date
// //   //   getMentorSchedule(mentor.userData).then((schedules: Schedule[]) => {
// //   //     const selectedDay = new Date(fullDate)
// //   //       .toLocaleString("en-US", { weekday: "long" })
// //   //       .toLowerCase();
// //   //     let times: string[] = [];

// //   //     // Aggregate available slots from all schedules
// //   //     for (const schedule of schedules) {
// //   //       const scheduleDay = schedule.weeklySchedule.find(
// //   //         (d: ScheduleDay) => d.day === selectedDay
// //   //       );
// //   //       if (scheduleDay) {
// //   //         const availableSlots = scheduleDay.slots
// //   //           .filter((slot: ScheduleSlot) => slot.isAvailable)
// //   //           .map((slot: ScheduleSlot) => slot.startTime);
// //   //         times = [...times, ...availableSlots];
// //   //       }
// //   //     }

// //   //     // Remove duplicates and sort times
// //   //     times = [...new Set(times)].sort((a, b) => {
// //   //       const timeA = new Date(`1970-01-01T${convertTo24Hour(a)}`);
// //   //       const timeB = new Date(`1970-01-01T${convertTo24Hour(b)}`);
// //   //       return timeA.getTime() - timeB.getTime();
// //   //     });

// //   //     setAvailableTimes(times);
// //   //   });
// //   // };
// //   // components/mentee/BookingConfirm.tsx
// //   const handleDateSelect = (
// //     fullDate: string,
// //     event: React.MouseEvent<HTMLButtonElement>
// //   ) => {
// //     event.preventDefault(); // Prevent default behavior (e.g., form submission)
// //     const dateObj = availableDates.find((d) => d.fullDate === fullDate);
// //     if (!dateObj?.isAvailable) return; // Prevent selecting unavailable dates
// //     setSelectedDate(fullDate);
// //     setSelectedTime(null); // Reset time when date changes

// //     // Fetch schedules for the selected date
// //     getMentorSchedule(service?.slot)
// //       .then((schedules: Schedule[]) => {
// //         const selectedDay = new Date(fullDate)
// //           .toLocaleString("en-US", { weekday: "long" })
// //           .toLowerCase();
// //         let times: string[] = [];

// //         // Aggregate available slots from all schedules
// //         for (const schedule of schedules) {
// //           const scheduleDay = schedule.weeklySchedule.find(
// //             (d: ScheduleDay) => d.day === selectedDay
// //           );
// //           if (scheduleDay) {
// //             const availableSlots = scheduleDay.slots
// //               .filter((slot: ScheduleSlot) => slot.isAvailable)
// //               .map((slot: ScheduleSlot) => slot.startTime);
// //             times = [...times, ...availableSlots];
// //           }
// //         }

// //         // Remove duplicates and sort times
// //         times = [...new Set(times)].sort((a, b) => {
// //           const timeA = new Date(`1970-01-01T${convertTo24Hour(a)}`);
// //           const timeB = new Date(`1970-01-01T${convertTo24Hour(b)}`);
// //           return timeA.getTime() - timeB.getTime();
// //         });

// //         setAvailableTimes(times);
// //       })
// //       .catch((error) => {
// //         console.error("Error fetching schedules for selected date:", error);
// //         toast.error("Failed to load available times.");
// //       });
// //   };

// //   //...

// //   const handleTimeSelect = (time: string) => {
// //     setSelectedTime(time);
// //   };

// //   const handleConfirmClick = () => {
// //     if (selectedDate && selectedTime) {
// //       onConfirm(selectedDate, selectedTime);
// //     }
// //   };

// //   if (loading) {
// //     return <div>Loading availability...</div>;
// //   }

// //   return (
// //     <div className="bg-black text-white rounded-3xl max-w-md w-full p-6">
// //       <div className="bg-gray-100 text-black rounded-xl p-6">
// //         <h3 className="font-semibold mb-4">Select Date</h3>

// //         <div className="flex items-center justify-between mb-6">
// //           <button className="p-1">
// //             <svg
// //               width="20"
// //               height="20"
// //               viewBox="0 0 24 24"
// //               fill="none"
// //               xmlns="http://www.w3.org/2000/svg"
// //             >
// //               <path
// //                 d="M15 18L9 12L15 6"
// //                 stroke="currentColor"
// //                 strokeWidth="2"
// //                 strokeLinecap="round"
// //                 strokeLinejoin="round"
// //               />
// //             </svg>
// //           </button>

// //           <div className="flex gap-2 overflow-x-auto">
// //             {availableDates.map((date) => (
// //               // <button
// //               //   key={date.fullDate}
// //               //   className={`flex flex-col items-center justify-center p-2 rounded-md min-w-[60px] ${
// //               //     selectedDate === date.fullDate
// //               //       ? "bg-black text-white"
// //               //       : date.isAvailable
// //               //       ? "bg-white hover:bg-gray-200"
// //               //       : "bg-gray-300 text-gray-500 cursor-not-allowed"
// //               //   }`}
// //               //   onClick={() => handleDateSelect(date.fullDate)}
// //               //   disabled={!date.isAvailable}
// //               // >
// //               //   <span className="text-xs">{date.day}</span>
// //               //   <span className="text-xs">{date.date}</span>
// //               // </button>
// //               <button
// //                 key={date.fullDate}
// //                 className={`flex flex-col items-center justify-center p-2 rounded-md min-w-[60px] ${
// //                   selectedDate === date.fullDate
// //                     ? "bg-black text-white"
// //                     : date.isAvailable
// //                     ? "bg-white hover:bg-gray-200"
// //                     : "bg-gray-300 text-gray-500 cursor-not-allowed"
// //                 }`}
// //                 onClick={(event) => handleDateSelect(date.fullDate, event)} // Pass the event
// //                 disabled={!date.isAvailable}
// //               >
// //                 <span className="text-xs">{date.day}</span>
// //                 <span className="text-xs">{date.date}</span>
// //               </button>
// //             ))}
// //           </div>

// //           <button className="p-1">
// //             <svg
// //               width="20"
// //               height="20"
// //               viewBox="0 0 24 24"
// //               fill="none"
// //               xmlns="http://www.w3.org/2000/svg"
// //             >
// //               <path
// //                 d="M9 6L15 12L9 18"
// //                 stroke="currentColor"
// //                 strokeWidth="2"
// //                 strokeLinecap="round"
// //                 strokeLinejoin="round"
// //               />
// //             </svg>
// //           </button>
// //         </div>

// //         <h3 className="font-semibold mb-4">Select Time</h3>

// //         <div className="flex gap-2 mb-6">
// //           {availableTimes.length > 0 ? (
// //             availableTimes.map((time) => (
// //               <Button
// //                 key={time}
// //                 variant={selectedTime === time ? "default" : "outline"}
// //                 className={`px-4 py-2 rounded-md ${
// //                   selectedTime === time
// //                     ? "bg-black text-white"
// //                     : "bg-white text-black border-gray-200"
// //                 }`}
// //                 onClick={() => handleTimeSelect(time)}
// //               >
// //                 {time}
// //               </Button>
// //             ))
// //           ) : (
// //             <p className="text-gray-500">No available times for this date.</p>
// //           )}
// //         </div>

// //         <Button
// //           variant="default"
// //           className="w-full py-3 bg-black text-white rounded-md"
// //           onClick={handleConfirmClick}
// //           disabled={!selectedDate || !selectedTime}
// //         >
// //           Confirm
// //         </Button>
// //       </div>
// //     </div>
// //   );
// // }
// "use client";

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import {
//   getMentorSchedule,
//   getMentorBlockedDates,
// } from "@/services/menteeService";
// import { toast } from "react-hot-toast";

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
//   createdAt: string;
//   _id: string;
// }

// interface BookingConfirmProps {
//   onConfirm: (date: string, time: string) => void;
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
//   const [availableDates, setAvailableDates] = useState<
//     { day: string; date: string; fullDate: string; isAvailable: boolean }[]
//   >([]);
//   const [availableTimes, setAvailableTimes] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     console.log("BookingConfirm STEP 1: mentor", mentor);
//     console.log("BookingConfirm STEP 1.5: service", service);

//     if (!mentor?.userData || !service) {
//       console.error("Mentor ID or Service is missing.", { mentor, service });
//       toast.error("Mentor or service data is missing.");
//       navigate("/seeker/mentors");
//       return;
//     }

//     if (service.type === "DigitalProducts") {
//       // For DigitalProducts, skip fetching and set loading to false
//       setLoading(false);
//       return;
//     }

//     const fetchScheduleAndBlockedDates = async () => {
//       try {
//         console.log("BookingConfirm STEP 3: fetching data");
//         setLoading(true);
//         console.log(
//           "BookingConfirm STEP 3.5: ",
//           service?.slot,
//           " and >> ",
//           mentor.userData
//         );
//         const [schedules, blockedDates] = await Promise.all([
//           getMentorSchedule(service?.slot),
//           getMentorBlockedDates(mentor.userData),
//         ]);

//         console.log("BookingConfirm STEP 4: fetched data", {
//           schedules,
//           blockedDates,
//         });

//         // Process blocked dates
//         const blockedDateSet = new Set(
//           blockedDates.map(
//             (bd: BlockedDate) => new Date(bd.date).toISOString().split("T")[0]
//           )
//         );

//         // Process schedules
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         const dates: {
//           day: string;
//           date: string;
//           fullDate: string;
//           isAvailable: boolean;
//         }[] = [];

//         // Generate dates for the next 30 days
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

//           // Check if any schedule has available slots for this day
//           let isAvailable = false;
//           for (const schedule of schedules as Schedule[]) {
//             const scheduleDay = schedule.weeklySchedule.find(
//               (d: ScheduleDay) => d.day === dayName
//             );
//             if (
//               scheduleDay?.slots.some((slot: ScheduleSlot) => slot.isAvailable)
//             ) {
//               isAvailable = true;
//               break;
//             }
//           }

//           // Disable if blocked
//           if (blockedDateSet.has(fullDate)) {
//             isAvailable = false;
//           }

//           dates.push({
//             day: date.toLocaleString("en-US", { weekday: "short" }),
//             date: dateStr,
//             fullDate,
//             isAvailable,
//           });
//         }

//         setAvailableDates(dates);
//       } catch (error: any) {
//         console.error("Error fetching schedule or blocked dates:", error);
//         toast.error("Failed to load mentor availability.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchScheduleAndBlockedDates();
//   }, [mentor?.userData, service?.slot, navigate]);

//   // Helper function to convert 12-hour time to 24-hour for sorting
//   const convertTo24Hour = (time: string): string => {
//     const [timePart, period] = time.split(" ");
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

//     getMentorSchedule(service?.slot)
//       .then((schedules: Schedule[]) => {
//         const selectedDay = new Date(fullDate)
//           .toLocaleString("en-US", { weekday: "long" })
//           .toLowerCase();
//         let times: string[] = [];

//         for (const schedule of schedules) {
//           const scheduleDay = schedule.weeklySchedule.find(
//             (d: ScheduleDay) => d.day === selectedDay
//           );
//           if (scheduleDay) {
//             const availableSlots = scheduleDay.slots
//               .filter((slot: ScheduleSlot) => slot.isAvailable)
//               .map((slot: ScheduleSlot) => slot.startTime);
//             times = [...times, ...availableSlots];
//           }
//         }

//         times = [...new Set(times)].sort((a, b) => {
//           const timeA = new Date(`1970-01-01T${convertTo24Hour(a)}`);
//           const timeB = new Date(`1970-01-01T${convertTo24Hour(b)}`);
//           return timeA.getTime() - timeB.getTime();
//         });

//         setAvailableTimes(times);
//       })
//       .catch((error) => {
//         console.error("Error fetching schedules for selected date:", error);
//         toast.error("Failed to load available times.");
//       });
//   };

//   const handleTimeSelect = (time: string) => {
//     setSelectedTime(time);
//   };

//   const handleConfirmClick = () => {
//     if (service.type === "DigitalProducts") {
//       // For DigitalProducts, pass current date and time
//       const now = new Date();
//       const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
//       const currentTime = now.toLocaleTimeString("en-US", {
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true,
//       }); // e.g., "02:30 PM"
//       onConfirm(currentDate, currentTime);
//     } else if (selectedDate && selectedTime) {
//       onConfirm(selectedDate, selectedTime);
//     } else {
//       toast.error("Please select a date and time.");
//     }
//   };

//   if (loading) {
//     return <div>Loading availability...</div>;
//   }

//   if (service.type === "DigitalProducts") {
//     return (
//       <div className="bg-black text-white rounded-3xl max-w-md w-full p-6">
//         <div className="bg-gray-100 text-black rounded-xl p-6">
//           <Button
//             variant="default"
//             className="w-full py-3 bg-black text-white rounded-md"
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
//       <div className="bg-gray-100 text-black rounded-xl p-6">
//         <h3 className="font-semibold mb-4">Select Date</h3>

//         <div className="flex items-center justify-between mb-6">
//           <button className="p-1">
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

//           <div className="flex gap-2 overflow-x-auto">
//             {availableDates.map((date) => (
//               <button
//                 key={date.fullDate}
//                 className={`flex flex-col items-center justify-center p-2 rounded-md min-w-[60px] ${
//                   selectedDate === date.fullDate
//                     ? "bg-black text-white"
//                     : date.isAvailable
//                     ? "bg-white hover:bg-gray-200"
//                     : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 }`}
//                 onClick={(event) => handleDateSelect(date.fullDate, event)}
//                 disabled={!date.isAvailable}
//               >
//                 <span className="text-xs">{date.day}</span>
//                 <span className="text-xs">{date.date}</span>
//               </button>
//             ))}
//           </div>

//           <button className="p-1">
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

//         <h3 className="font-semibold mb-4">Select Time</h3>

//         <div className="flex gap-2 mb-6">
//           {availableTimes.length > 0 ? (
//             availableTimes.map((time) => (
//               <Button
//                 key={time}
//                 variant={selectedTime === time ? "default" : "outline"}
//                 className={`px-4 py-2 rounded-md ${
//                   selectedTime === time
//                     ? "bg-black text-white"
//                     : "bg-white text-black border-gray-200"
//                 }`}
//                 onClick={() => handleTimeSelect(time)}
//               >
//                 {time}
//               </Button>
//             ))
//           ) : (
//             <p className="text-gray-500">No available times for this date.</p>
//           )}
//         </div>

//         <Button
//           variant="default"
//           className="w-full py-3 bg-black text-white rounded-md"
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
import {
  getMentorSchedule,
  getMentorBlockedDates,
} from "@/services/menteeService";
import { toast } from "react-hot-toast";

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
  createdAt: string;
  _id: string;
}

interface BookingConfirmProps {
  onConfirm: (date: string, time: string, slotIndex: number) => void; // Updated to include slotIndex
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
  ); // New state for slotIndex
  const [availableDates, setAvailableDates] = useState<
    { day: string; date: string; fullDate: string; isAvailable: boolean }[]
  >([]);
  const [availableTimes, setAvailableTimes] = useState<
    { time: string; slotIndex: number }[]
  >([]); // Store time with slotIndex
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("BookingConfirm STEP 1: mentor", mentor);
    console.log("BookingConfirm STEP 1.5: service", service);

    if (!mentor?.userData || !service) {
      console.error("Mentor ID or Service is missing.", { mentor, service });
      toast.error("Mentor or service data is missing.");
      navigate("/seeker/mentors");
      return;
    }

    if (service.type === "DigitalProducts") {
      setLoading(false);
      return;
    }

    const fetchScheduleAndBlockedDates = async () => {
      try {
        console.log("BookingConfirm STEP 3: fetching data");
        setLoading(true);
        console.log(
          "BookingConfirm STEP 3.5: ",
          service?.slot,
          " and >> ",
          mentor.userData
        );
        const [schedules, blockedDates] = await Promise.all([
          getMentorSchedule(service?.slot),
          getMentorBlockedDates(mentor.userData),
        ]);

        console.log("BookingConfirm STEP 4: fetched data", {
          schedules,
          blockedDates,
        });

        const blockedDateSet = new Set(
          blockedDates.map(
            (bd: BlockedDate) => new Date(bd.date).toISOString().split("T")[0]
          )
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

          let isAvailable = false;
          for (const schedule of schedules as Schedule[]) {
            const scheduleDay = schedule.weeklySchedule.find(
              (d: ScheduleDay) => d.day === dayName
            );
            if (
              scheduleDay?.slots.some((slot: ScheduleSlot) => slot.isAvailable)
            ) {
              isAvailable = true;
              break;
            }
          }

          if (blockedDateSet.has(fullDate)) {
            isAvailable = false;
          }

          dates.push({
            day: date.toLocaleString("en-US", { weekday: "short" }),
            date: dateStr,
            fullDate,
            isAvailable,
          });
        }

        setAvailableDates(dates);
      } catch (error: any) {
        console.error("Error fetching schedule or blocked dates:", error);
        toast.error("Failed to load mentor availability.");
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleAndBlockedDates();
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
        let times: { time: string; slotIndex: number }[] = [];

        for (const schedule of schedules) {
          const scheduleDay = schedule.weeklySchedule.find(
            (d: ScheduleDay) => d.day === selectedDay
          );
          if (scheduleDay) {
            const availableSlots = scheduleDay.slots
              .filter((slot: ScheduleSlot) => slot.isAvailable)
              .map((slot: ScheduleSlot) => ({
                time: slot.startTime,
                slotIndex: slot.index,
              }));
            times = [...times, ...availableSlots];
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

  const handleTimeSelect = (time: string, slotIndex: number) => {
    setSelectedTime(time);
    setSelectedSlotIndex(slotIndex);
  };

  const handleConfirmClick = () => {
    if (service.type === "DigitalProducts") {
      const now = new Date();
      const currentDate = now.toISOString().split("T")[0];
      const currentTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      onConfirm(currentDate, currentTime, 0); // Default slotIndex for DigitalProducts
    } else if (selectedDate && selectedTime && selectedSlotIndex !== null) {
      onConfirm(selectedDate, selectedTime, selectedSlotIndex);
    } else {
      toast.error("Please select a date and time.");
    }
  };

  if (loading) {
    return <div>Loading availability...</div>;
  }

  if (service.type === "DigitalProducts") {
    return (
      <div className="bg-black text-white rounded-3xl max-w-md w-full p-6">
        <div className="bg-gray-100 text-black rounded-xl p-6">
          <Button
            variant="default"
            className="w-full py-3 bg-black text-white rounded-md"
            onClick={handleConfirmClick}
          >
            Confirm
          </Button>
        </div>
      </div>
    );
  }

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
            {availableDates.map((date) => (
              <button
                key={date.fullDate}
                className={`flex flex-col items-center justify-center p-2 rounded-md min-w-[60px] ${
                  selectedDate === date.fullDate
                    ? "bg-black text-white"
                    : date.isAvailable
                    ? "bg-white hover:bg-gray-200"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                onClick={(event) => handleDateSelect(date.fullDate, event)}
                disabled={!date.isAvailable}
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

        <h3 className="font-semibold mb-4">Select Time</h3>

        <div className="flex gap-2 mb-6">
          {availableTimes.length > 0 ? (
            availableTimes.map(({ time, slotIndex }) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                className={`px-4 py-2 rounded-md ${
                  selectedTime === time
                    ? "bg-black text-white"
                    : "bg-white text-black border-gray-200"
                }`}
                onClick={() => handleTimeSelect(time, slotIndex)}
              >
                {time}
              </Button>
            ))
          ) : (
            <p className="text-gray-500">No available times for this date.</p>
          )}
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
