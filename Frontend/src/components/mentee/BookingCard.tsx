// // export default BookingCard;
// import { useEffect, useState } from "react";
// import {
//   Calendar,
//   Clock,
//   Tag,
//   CheckCircle,
//   XCircle,
//   MessageCircle,
//   Star,
//   FileText,
//   MoreVertical,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useNavigate } from "react-router-dom";
// import DigitalProductModal from "@/components/modal/DocumentModal";
// import PriorityDMModal from "@/components/modal/PriorityDMModal";
// import AnswerModal from "@/components/modal/AnswerModal";
// import ConfirmationModal from "@/components/modal/ConfirmationModal";
// import {
//   getMentorSchedule,
//   getMentorBlockedDates,
//   getMentorPolicy,
// } from "@/services/menteeService";
// import { toast } from "react-hot-toast";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";

// interface Booking {
//   id: string;
//   serviceId: string;
//   mentorName: string;
//   mentorImage: string;
//   mentorId: string;
//   title: string;
//   technology: string;
//   date: string;
//   time: string;
//   price: number;
//   status: string;
//   serviceType: string;
//   rating?: number;
//   feedback?: string;
//   oneToOneType?: string | null;
//   digitalProductType?: string | null;
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

// interface MentorPolicy {
//   bookingPeriod: { unit: string; value: number };
//   reschedulePeriod: { unit: string; value: number };
//   noticePeriod: { unit: string; value: number };
//   _id: string;
//   userId: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface BookingCardProps {
//   booking: Booking;
//   type: "upcoming" | "completed";
//   navigateToProfile?: () => void;
//   onFeedbackClick?: () => void;
//   refreshBookings?: () => void;
// }

// const BookingCard = ({
//   booking,
//   type,
//   navigateToProfile,
//   onFeedbackClick,
//   refreshBookings,
// }: BookingCardProps) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [isDigitalProductModalOpen, setIsDigitalProductModalOpen] =
//     useState(false);
//   const [isPriorityDMModalOpen, setIsPriorityDMModalOpen] = useState(false);
//   const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
//   const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
//   const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
//   const [selectedDM, setSelectedDM] = useState<any | null>(null);
//   const [selectedDate, setSelectedDate] = useState<string | null>(null);
//   const [selectedTime, setSelectedTime] = useState<string | null>(null);
//   const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(
//     null
//   );
//   const [availableDates, setAvailableDates] = useState<
//     { day: string; date: string; fullDate: string; isAvailable: boolean }[]
//   >([]);
//   const [availableTimes, setAvailableTimes] = useState<
//     { time: string; slotIndex: number }[]
//   >([]);
//   const [mentorDecides, setMentorDecides] = useState(false);
//   const [mentorPolicy, setMentorPolicy] = useState<MentorPolicy | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false); // Control DropdownMenu state
//   const navigate = useNavigate();

//   useEffect(() => {
//     console.log("BOOKING Card >>>>> STEP 1", booking);
//     console.log("BOOKING Card >>>>> STEP 2", type);
//     console.log("BOOKING Card >>>>> STEP 3", navigateToProfile);
//     console.log("BOOKING Card >>>>> STEP 4", onFeedbackClick);
//     console.log("BOOKING Card >>>>> STEP 5", refreshBookings);
//   }, [booking, type, navigateToProfile, onFeedbackClick, refreshBookings]);

//   const isDigitalDocument = () => {
//     const serviceType = booking.serviceType.toLowerCase().replace(/-/g, "");
//     return (
//       (serviceType === "digitalproducts" || serviceType === "digitalproduct") &&
//       booking.digitalProductType === "documents"
//     );
//   };

//   const isDigitalVideoTutorial = () => {
//     const serviceType = booking.serviceType.toLowerCase().replace(/-/g, "");
//     return (
//       (serviceType === "digitalproducts" || serviceType === "digitalproduct") &&
//       booking.digitalProductType === "videoTutorials"
//     );
//   };

//   const isPriorityDM = () => {
//     const serviceType = booking.serviceType.toLowerCase().replace(/-/g, "");
//     return serviceType === "prioritydm";
//   };

//   const handleCardClick = async () => {
//     if (isDigitalDocument()) {
//       setIsDigitalProductModalOpen(true);
//     } else if (isDigitalVideoTutorial()) {
//       navigate(`/seeker/digitalcontent/${booking.serviceId}`);
//     } else if (isPriorityDM()) {
//       console.log("Bookingcards getPriorityDMs response is step 1", booking);
//       if (
//         booking.status.toLowerCase() === "completed" ||
//         booking.status.toLowerCase() === "pending"
//       ) {
//         try {
//           console.log("Bookingcards getPriorityDMs response is step 1.5");
//           const response = await getPriorityDMs(booking.id);
//           console.log(
//             "Bookingcards getPriorityDMs response is step 2",
//             response
//           );
//           if (response.status === "replied" || response.status === "pending") {
//             setSelectedDM(response);
//             setIsAnswerModalOpen(true);
//           } else {
//             toast.error("No Priority DM found for this booking.");
//           }
//         } catch (error) {
//           toast.error("Failed to fetch Priority DM.");
//           console.error("Error fetching Priority DM:", error);
//         }
//       } else {
//         setIsPriorityDMModalOpen(true);
//       }
//     }
//   };

//   const handleCancelBooking = async () => {
//     try {
//       // Assume a cancelBooking service exists
//       await cancelBooking(booking.id);
//       toast.success("Booking cancelled successfully.");
//       if (refreshBookings) refreshBookings();
//     } catch (error) {
//       toast.error("Failed to cancel booking.");
//       console.error("Error cancelling booking:", error);
//     }
//   };

//   const convertTo24Hour = (time: string): string => {
//     const [timePart, period] = time.split(" ");
//     let [hours, minutes] = timePart.split(":").map(Number);
//     if (period === "PM" && hours !== 12) hours += 12;
//     if (period === "AM" && hours === 12) hours = 0;
//     return `${hours.toString().padStart(2, "0")}:${minutes
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   const fetchScheduleAndBlockedDates = async () => {
//     try {
//       setLoading(true);
//       const [schedules, blockedDates, policy] = await Promise.all([
//         getMentorSchedule(booking.serviceId),
//         getMentorBlockedDates(booking.mentorId),
//         getMentorPolicy(booking.mentorId),
//       ]);
//       console.log(
//         "############## BookingCard fetchScheduleAndBlockedDates step 1",
//         schedules
//       );
//       console.log(
//         "############## BookingCard fetchScheduleAndBlockedDates step 2",
//         blockedDates
//       );
//       console.log(
//         "############## BookingCard fetchScheduleAndBlockedDates step 3",
//         policy
//       );
//       setMentorPolicy(policy);

//       const blockedDateSet = new Set(
//         blockedDates.map(
//           (bd: BlockedDate) => new Date(bd.date).toISOString().split("T")[0]
//         )
//       );

//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       const dates: {
//         day: string;
//         date: string;
//         fullDate: string;
//         isAvailable: boolean;
//       }[] = [];

//       const bookingPeriodDays =
//         policy?.bookingPeriod?.unit === "days" ? policy.bookingPeriod.value : 0;
//       const minBookableDate = new Date(today);
//       minBookableDate.setDate(today.getDate() + bookingPeriodDays);

//       for (let i = 0; i < 30; i++) {
//         const date = new Date();
//         date.setDate(today.getDate() + i);
//         const fullDate = date.toISOString().split("T")[0];
//         const dayName = date
//           .toLocaleString("en-US", { weekday: "long" })
//           .toLowerCase();
//         const dateStr = date.toLocaleString("en-US", {
//           day: "2-digit",
//           month: "short",
//         });

//         let isAvailable = false;
//         if (date >= minBookableDate) {
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
//         }

//         if (blockedDateSet.has(fullDate)) {
//           isAvailable = false;
//         }

//         dates.push({
//           day: date.toLocaleString("en-US", { weekday: "short" }),
//           date: dateStr,
//           fullDate,
//           isAvailable,
//         });
//       }

//       setAvailableDates(dates);
//     } catch (error) {
//       console.error("Error fetching schedule or blocked dates:", error);
//       toast.error("Failed to load mentor availability.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDateSelect = async (fullDate: string) => {
//     const dateObj = availableDates.find((d) => d.fullDate === fullDate);
//     if (!dateObj?.isAvailable) return;
//     setSelectedDate(fullDate);
//     setSelectedTime(null);
//     setSelectedSlotIndex(null);

//     try {
//       const schedules: Schedule[] = await getMentorSchedule(booking.serviceId);
//       const selectedDay = new Date(fullDate)
//         .toLocaleString("en-US", { weekday: "long" })
//         .toLowerCase();
//       let times: { time: string; slotIndex: number }[] = [];

//       for (const schedule of schedules) {
//         const scheduleDay = schedule.weeklySchedule.find(
//           (d: ScheduleDay) => d.day === selectedDay
//         );
//         if (scheduleDay) {
//           const availableSlots = scheduleDay.slots
//             .filter((slot: ScheduleSlot) => slot.isAvailable)
//             .map((slot: ScheduleSlot) => ({
//               time: slot.startTime,
//               slotIndex: slot.index,
//             }));
//           times = [...times, ...availableSlots];
//         }
//       }

//       times = [
//         ...new Map(times.map((item) => [item.time, item])).values(),
//       ].sort((a, b) => {
//         const timeA = new Date(`1970-01-01T${convertTo24Hour(a.time)}`);
//         const timeB = new Date(`1970-01-01T${convertTo24Hour(b.time)}`);
//         return timeA.getTime() - timeB.getTime();
//       });

//       setAvailableTimes(times);
//     } catch (error) {
//       console.error("Error fetching schedules for selected date:", error);
//       toast.error("Failed to load available times.");
//     }
//   };

//   const handleTimeSelect = (time: string, slotIndex: number) => {
//     setSelectedTime(time);
//     setSelectedSlotIndex(slotIndex);
//   };

//   const handleRescheduleSubmit = async () => {
//     try {
//       // Assume a requestReschedule service exists
//       await requestReschedule(booking.id, {
//         requestedDate: selectedDate,
//         requestedTime: selectedTime,
//         requestedSlotIndex: selectedSlotIndex,
//         mentorDecides,
//       });
//       toast.success("Reschedule request sent successfully.");
//       setIsRescheduleModalOpen(false);
//       if (refreshBookings) refreshBookings();
//     } catch (error) {
//       toast.error("Failed to send reschedule request.");
//       console.error("Error sending reschedule request:", error);
//     }
//   };

//   const getServiceTypeDetails = () => {
//     let mainType = "";
//     const serviceType = booking.serviceType.toLowerCase().replace(/-/g, "");
//     switch (serviceType) {
//       case "11call":
//       case "1-1call":
//       case "1:1call":
//         mainType = "1:1 Call";
//         break;
//       case "digitalproducts":
//       case "digitalproduct":
//         mainType = "Digital Product";
//         break;
//       case "prioritydm":
//         mainType = "Direct Message";
//         break;
//       default:
//         mainType = booking.serviceType;
//     }
//     let subType = "";
//     if (
//       (serviceType === "11call" ||
//         serviceType === "1-1call" ||
//         serviceType === "1:1call") &&
//       booking.oneToOneType
//     ) {
//       subType = booking.oneToOneType;
//     } else if (
//       (serviceType === "digitalproducts" || serviceType === "digitalproduct") &&
//       booking.digitalProductType
//     ) {
//       subType = booking.digitalProductType;
//     }
//     if (subType) {
//       return `${mainType} - ${subType}`;
//     }
//     return mainType;
//   };

//   const getStatusBadge = () => {
//     const statusStyles = {
//       confirmed: "bg-black text-white",
//       completed: "bg-white text-black border border-black",
//       cancelled: "bg-gray-100 text-gray-500 border border-gray-300",
//       rescheduled: "bg-white text-black border border-black",
//       pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
//     };
//     const statusIcons = {
//       confirmed: <CheckCircle className="w-4 h-4 mr-1" />,
//       completed: <CheckCircle className="w-4 h-4 mr-1" />,
//       cancelled: <XCircle className="w-4 h-4 mr-1" />,
//       rescheduled: <Clock className="w-4 h-4 mr-1" />,
//       pending: <Clock className="w-4 h-4 mr-1" />,
//     };
//     return (
//       <div
//         className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium flex items-center ${
//           statusStyles[booking.status.toLowerCase()]
//         }`}
//       >
//         {statusIcons[booking.status.toLowerCase()]}
//         {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//       </div>
//     );
//   };

//   const getServiceTypeIcon = () => {
//     const serviceType = booking.serviceType.toLowerCase().replace(/-/g, "");
//     if (
//       serviceType === "11call" ||
//       serviceType === "1-1call" ||
//       serviceType === "1:1call"
//     ) {
//       return (
//         <div className="bg-black text-white p-2 rounded-full">
//           <MessageCircle className="w-4 h-4" />
//         </div>
//       );
//     } else if (serviceType === "prioritydm") {
//       return (
//         <div className="bg-black text-white p-2 rounded-full">
//           <MessageCircle className="w-4 h-4" />
//         </div>
//       );
//     } else if (
//       serviceType === "digitalproducts" ||
//       serviceType === "digitalproduct"
//     ) {
//       return (
//         <div className="bg-black text-white p-2 rounded-full">
//           <FileText className="w-4 h-4" />
//         </div>
//       );
//     } else {
//       return (
//         <div className="bg-black text-white p-2 rounded-full">
//           <Tag className="w-4 h-4" />
//         </div>
//       );
//     }
//   };

//   return (
//     <>
//       <div
//         className={`relative overflow-hidden rounded-xl border-2 border-black transition-all duration-300 flex flex-col max-w-[250px] ${
//           isDigitalDocument() || isDigitalVideoTutorial() || isPriorityDM()
//             ? "cursor-pointer"
//             : ""
//         }`}
//         style={{
//           transform: isHovered ? "translateY(-5px)" : "translateY(0)",
//           boxShadow: isHovered ? "0 10px 30px rgba(0, 0, 0, 0.1)" : "none",
//         }}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         onClick={handleCardClick}
//       >
//         <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gray-50">
//           <div className="relative">
//             <img
//               src={booking.mentorImage || "/api/placeholder/40/40"}
//               alt={booking.mentorName}
//               className="w-12 h-12 rounded-full object-cover border-2 border-black"
//             />
//             <div className="absolute -top-3 -left-3">
//               {getServiceTypeIcon()}
//             </div>
//           </div>
//           <div className="relative flex-1">
//             <h3 className="font-semibold text-sm">{booking.mentorName}</h3>
//             <p className="text-xs text-gray-600">{getServiceTypeDetails()}</p>
//             <div className="absolute bottom-4 -right-6">{getStatusBadge()}</div>
//           </div>
//           <div>
//             {(booking.serviceType === "1:1call" ||
//               booking.serviceType === "1-1Call" ||
//               booking.serviceType === "11call") &&
//               booking.status === "confirmed" && (
//                 <DropdownMenu
//                   open={dropdownOpen}
//                   onOpenChange={setDropdownOpen}
//                 >
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="icon">
//                       <MoreVertical className="h-5 w-5" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent className="bg-white rounded-lg shadow-lg border border-gray-200">
//                     <DropdownMenuItem
//                       className="hover:bg-gray-100 cursor-pointer"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setIsCancelModalOpen(true);
//                         setDropdownOpen(false);
//                       }}
//                     >
//                       Cancel Booking
//                     </DropdownMenuItem>
//                     <DropdownMenuItem
//                       className="hover:bg-gray-100 cursor-pointer"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setIsRescheduleModalOpen(true);
//                         fetchScheduleAndBlockedDates();
//                         setDropdownOpen(false);
//                       }}
//                     >
//                       Request Reschedule
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               )}
//           </div>
//         </div>

//         <div className="p-5 flex-1 flex flex-col">
//           <h3 className="text-lg font-bold mb-2 line-clamp-2">
//             {booking.title}
//           </h3>
//           {booking.technology && (
//             <div className="mb-4">
//               <span className="inline-block bg-gray-100 text-xs px-3 py-1 rounded-full font-medium">
//                 {booking.technology}
//               </span>
//             </div>
//           )}
//           <div className="space-y-3 mt-auto">
//             <div className="flex items-center text-sm">
//               <Calendar className="w-4 h-4 mr-2 text-gray-500" />
//               <span>{booking.date}</span>
//             </div>
//             <div className="flex items-center text-sm">
//               <Clock className="w-4 h-4 mr-2 text-gray-500" />
//               <span>{booking.time}</span>
//             </div>
//             <div className="font-bold mt-2">₹{booking.price}/-</div>
//           </div>
//         </div>
//         <div className="p-4 pt-2 border-t border-gray-200">
//           {type === "upcoming" ? (
//             <Button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 if (navigateToProfile) navigateToProfile();
//               }}
//               className="w-full bg-black hover:bg-gray-800 text-white transition-colors"
//             >
//               View Mentor
//             </Button>
//           ) : (
//             <div className="flex flex-col gap-2">
//               {booking.rating ? (
//                 <div className="flex items-center mb-2">
//                   <div className="flex">
//                     {[...Array(5)].map((_, i) => (
//                       <Star
//                         key={i}
//                         className={`w-4 h-4 ${
//                           i < booking.rating!
//                             ? "fill-black text-black"
//                             : "text-gray-300"
//                         }`}
//                       />
//                     ))}
//                   </div>
//                   <span className="ml-1 text-xs">{booking.rating}/5</span>
//                 </div>
//               ) : (
//                 booking.status.toLowerCase() === "completed" &&
//                 !booking.feedback && (
//                   <Button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       if (onFeedbackClick) onFeedbackClick();
//                     }}
//                     className="w-full bg-white hover:bg-gray-100 text-black border border-black transition-colors"
//                   >
//                     Leave Feedback
//                   </Button>
//                 )
//               )}
//               <Button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   if (navigateToProfile) navigateToProfile();
//                 }}
//                 className="w-full bg-black hover:bg-gray-800 text-white transition-colors"
//               >
//                 View Mentor
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>

//       {isDigitalDocument() && (
//         <DigitalProductModal
//           isOpen={isDigitalProductModalOpen}
//           onClose={() => setIsDigitalProductModalOpen(false)}
//           serviceId={booking.serviceId}
//           title={booking.title}
//           productType={booking.digitalProductType || "Document"}
//         />
//       )}

//       {isPriorityDM() && booking.status.toLowerCase() !== "completed" && (
//         <PriorityDMModal
//           isOpen={isPriorityDMModalOpen}
//           onClose={() => setIsPriorityDMModalOpen(false)}
//           serviceId={booking.serviceId}
//           bookingId={booking.id}
//           title={booking.title}
//           productType="Direct Message"
//           refreshBookings={refreshBookings}
//         />
//       )}

//       {isPriorityDM() && selectedDM && (
//         <AnswerModal
//           isOpen={isAnswerModalOpen}
//           onClose={() => {
//             setIsAnswerModalOpen(false);
//             setSelectedDM(null);
//           }}
//           question={selectedDM}
//         />
//       )}

//       <ConfirmationModal
//         open={isCancelModalOpen}
//         onOpenChange={setIsCancelModalOpen}
//         onConfirm={handleCancelBooking}
//         title="Cancel Booking"
//         description="Are you sure you want to cancel this booking? This action cannot be undone."
//       />

//       <Dialog
//         open={isRescheduleModalOpen}
//         onOpenChange={setIsRescheduleModalOpen}
//       >
//         <DialogContent className="sm:max-w-lg rounded-3xl p-6 bg-black text-white shadow-2xl overflow-hidden">
//           <div className="bg-gray-100 text-black rounded-xl p-5">
//             <DialogHeader className="text-center space-y-4 mb-4">
//               <div className="flex justify-center">
//                 <div className="relative">
//                   <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse"></div>
//                   <div className="relative bg-white rounded-full p-3 shadow-lg border-2 border-blue-100">
//                     <Calendar className="w-8 h-8 text-blue-500" />
//                   </div>
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <DialogTitle className="text-2xl font-bold text-gray-900 leading-tight">
//                   Request Reschedule
//                 </DialogTitle>
//                 <p className="text-base text-gray-600 leading-relaxed max-w-sm mx-auto">
//                   Select a new date and time or let the mentor decide.
//                 </p>
//               </div>
//             </DialogHeader>

//             {loading ? (
//               <div className="text-center text-gray-500">
//                 Loading availability...
//               </div>
//             ) : (
//               <>
//                 <div className="flex items-center space-x-2 mb-6 bg-white p-3 rounded-lg shadow-sm">
//                   <Switch
//                     id="mentor-decides"
//                     checked={mentorDecides}
//                     onCheckedChange={(checked) => {
//                       setMentorDecides(checked);
//                       if (checked) {
//                         setSelectedDate(null);
//                         setSelectedTime(null);
//                         setSelectedSlotIndex(null);
//                         setAvailableTimes([]);
//                       }
//                     }}
//                     className={`${
//                       mentorDecides ? "bg-blue-500" : "bg-gray-200"
//                     } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
//                   />
//                   <Label
//                     htmlFor="mentor-decides"
//                     className="text-sm font-medium text-gray-900"
//                   >
//                     Let Mentor Decide
//                   </Label>
//                 </div>

//                 {!mentorDecides && (
//                   <>
//                     <h3 className="font-semibold text-lg mb-1">Select Date</h3>
//                     <div className="flex items-center justify-between mb-6">
//                       <button className="p-2 hover:bg-gray-200 rounded-full">
//                         <svg
//                           width="20"
//                           height="20"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <path
//                             d="M15 18L9 12L15 6"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           />
//                         </svg>
//                       </button>

//                       <div className="flex gap-2 overflow-x-auto py-2 px-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//                         {availableDates.map((date) => (
//                           <button
//                             key={date.fullDate}
//                             className={`flex flex-col items-center justify-center p-3 rounded-lg min-w-[70px] transition-colors ${
//                               selectedDate === date.fullDate
//                                 ? "bg-black text-white"
//                                 : date.isAvailable
//                                 ? "bg-white hover:bg-gray-200 border border-gray-300"
//                                 : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                             }`}
//                             onClick={() => handleDateSelect(date.fullDate)}
//                             disabled={!date.isAvailable}
//                           >
//                             <span className="text-sm font-medium">
//                               {date.day}
//                             </span>
//                             <span className="text-xs">{date.date}</span>
//                           </button>
//                         ))}
//                       </div>

//                       <button className="p-2 hover:bg-gray-200 rounded-full">
//                         <svg
//                           width="20"
//                           height="20"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <path
//                             d="M9 6L15 12L9 18"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           />
//                         </svg>
//                       </button>
//                     </div>

//                     <h3 className="font-semibold text-lg mb-1">Select Time</h3>
//                     <div className="flex flex-wrap gap-2 mb-6">
//                       {availableTimes.length > 0 ? (
//                         availableTimes.map(({ time, slotIndex }) => (
//                           <Button
//                             key={time}
//                             variant={
//                               selectedTime === time ? "default" : "outline"
//                             }
//                             className={`px-4 py-2 rounded-lg ${
//                               selectedTime === time
//                                 ? "bg-black text-white"
//                                 : "bg-white text-black border-gray-300 hover:bg-gray-200"
//                             }`}
//                             onClick={() => handleTimeSelect(time, slotIndex)}
//                           >
//                             {time}
//                           </Button>
//                         ))
//                       ) : (
//                         <p className="text-gray-500">
//                           No available times for this date.
//                         </p>
//                       )}
//                     </div>

//                     {(selectedDate || selectedTime) && (
//                       <div className="mb-6">
//                         <h3 className="font-semibold text-lg mb-2">
//                           Selected Schedule
//                         </h3>
//                         <div className="bg-white p-3 rounded-lg shadow-sm">
//                           <p className="text-sm">
//                             <span className="font-medium">Date:</span>{" "}
//                             {selectedDate || "Not selected"}
//                           </p>
//                           <p className="text-sm">
//                             <span className="font-medium">Time:</span>{" "}
//                             {selectedTime || "Not selected"}
//                           </p>
//                         </div>
//                       </div>
//                     )}
//                   </>
//                 )}

//                 <div className="flex gap-3">
//                   <Button
//                     variant="outline"
//                     onClick={() => {
//                       setIsRescheduleModalOpen(false);
//                       setSelectedDate(null);
//                       setSelectedTime(null);
//                       setSelectedSlotIndex(null);
//                       setMentorDecides(false);
//                     }}
//                     className="flex-1 h-12 font-medium border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     variant="default"
//                     onClick={handleRescheduleSubmit}
//                     className="flex-1 h-12 font-medium bg-black hover:bg-gray-800 text-white transition-all duration-200"
//                     disabled={
//                       !mentorDecides && (!selectedDate || !selectedTime)
//                     }
//                   >
//                     Confirm
//                   </Button>
//                 </div>
//               </>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default BookingCard;

"use client";
import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Tag,
  CheckCircle,
  XCircle,
  MessageCircle,
  Star,
  FileText,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import DigitalProductModal from "@/components/modal/DocumentModal";
import PriorityDMModal from "@/components/modal/PriorityDMModal";
import AnswerModal from "@/components/modal/AnswerModal";
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import {
  getMentorSchedule,
  getMentorBlockedDates,
  getMentorPolicy,
} from "@/services/menteeService";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// interface Booking {
//   id: string;
//   serviceId: Object;
//   mentorName: string;
//   mentorImage: string;
//   mentorId: string;
//   title: string;
//   technology: string;
//   date: string;
//   time: string;
//   price: number;
//   status: string;
//   serviceType: string;
//   rating?: number;
//   feedback?: string;
//   oneToOneType?: string | null;
//   digitalProductType?: string | null;
// }

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

// interface BookingCardProps {
//   booking: Booking;
//   serviceSlot: string; //
//   type: "upcoming" | "completed";
//   navigateToProfile?: () => void;
//   onFeedbackClick?: () => void;
//   refreshBookings?: () => void;
// }
interface Booking {
  id: string;
  serviceId: string; // Change from Object to string
  mentorName: string;
  mentorImage: string;
  mentorId: string;
  title: string;
  technology: string;
  date: string;
  time: string;
  price: number;
  status: string;
  serviceType: string;
  rating?: number;
  feedback?: string;
  oneToOneType?: string | null;
  digitalProductType?: string | null;
}

interface BookingCardProps {
  booking: Booking;
  serviceSlot: string;
  type: "upcoming" | "completed";
  navigateToProfile?: () => void;
  onFeedbackClick?: () => void;
  refreshBookings?: () => Promise<void>; // Type as async function
}

const BookingCard = ({
  booking,
  serviceSlot,
  type,
  navigateToProfile,
  onFeedbackClick,
  refreshBookings,
}: BookingCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDigitalProductModalOpen, setIsDigitalProductModalOpen] =
    useState(false);
  const [isPriorityDMModalOpen, setIsPriorityDMModalOpen] = useState(false);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedDM, setSelectedDM] = useState<any | null>(null);
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
  const [mentorPolicy, setMentorPolicy] = useState<MentorPolicy | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [canReschedule, setCanReschedule] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("BOOKING Card >>>>> STEP 1", booking);
    console.log("BOOKING Card >>>>> STEP 2", type);
    console.log("BOOKING Card >>>>> STEP 3", navigateToProfile);
    console.log("BOOKING Card >>>>> STEP 4", onFeedbackClick);
    console.log("BOOKING Card >>>>> STEP 5", refreshBookings);
    console.log("BOOKING Card >>>>> STEP 5", serviceSlot);

    // Check if rescheduling is allowed based on reschedulePeriod
    const checkRescheduleEligibility = async () => {
      try {
        const policy = await getMentorPolicy(booking.mentorId);
        setMentorPolicy(policy);

        const bookedDateTime = new Date(`${booking.date} ${booking.time}`);
        const currentTime = new Date(); // Current time: June 06, 2025, 11:55 AM IST

        let rescheduleDeadline = new Date(bookedDateTime);
        const { unit, value } = policy.reschedulePeriod || {
          unit: "hours",
          value: 0,
        };
        if (unit === "days") {
          rescheduleDeadline.setDate(rescheduleDeadline.getDate() - value);
        } else if (unit === "hours") {
          rescheduleDeadline.setHours(rescheduleDeadline.getHours() - value);
        } else if (unit === "minutes") {
          rescheduleDeadline.setMinutes(
            rescheduleDeadline.getMinutes() - value
          );
        }

        setCanReschedule(currentTime <= rescheduleDeadline);
      } catch (error) {
        console.error("Error checking reschedule eligibility:", error);
        setCanReschedule(false);
      }
    };

    checkRescheduleEligibility();
  }, [
    booking,
    type,
    navigateToProfile,
    onFeedbackClick,
    refreshBookings,
    serviceSlot,
  ]);

  const isDigitalDocument = () => {
    const serviceType = booking.serviceType.toLowerCase().replace(/-/g, "");
    return (
      (serviceType === "digitalproducts" || serviceType === "digitalproduct") &&
      booking.digitalProductType === "documents"
    );
  };

  const isDigitalVideoTutorial = () => {
    const serviceType = booking.serviceType.toLowerCase().replace(/-/g, "");
    return (
      (serviceType === "digitalproducts" || serviceType === "digitalproduct") &&
      booking.digitalProductType === "videoTutorials"
    );
  };

  const isPriorityDM = () => {
    const serviceType = booking.serviceType.toLowerCase().replace(/-/g, "");
    return serviceType === "prioritydm";
  };

  const handleCardClick = async () => {
    if (isDigitalDocument()) {
      setIsDigitalProductModalOpen(true);
    } else if (isDigitalVideoTutorial()) {
      navigate(`/seeker/digitalcontent/${booking.serviceId}`);
    } else if (isPriorityDM()) {
      console.log("Bookingcards getPriorityDMs response is step 1", booking);
      if (
        booking.status.toLowerCase() === "completed" ||
        booking.status.toLowerCase() === "pending"
      ) {
        try {
          console.log("Bookingcards getPriorityDMs response is step 1.5");
          const response = await getPriorityDMs(booking.id);
          console.log(
            "Bookingcards getPriorityDMs response is step 2",
            response
          );
          if (response.status === "replied" || response.status === "pending") {
            setSelectedDM(response);
            setIsAnswerModalOpen(true);
          } else {
            toast.error("No Priority DM found for this booking.");
          }
        } catch (error) {
          toast.error("Failed to fetch Priority DM.");
          console.error("Error fetching Priority DM:", error);
        }
      } else {
        setIsPriorityDMModalOpen(true);
      }
    }
  };

  const handleCancelBooking = async () => {
    try {
      // Assume a cancelBooking service exists
      await cancelBooking(booking.id);
      toast.success("Booking cancelled successfully.");
      if (refreshBookings) refreshBookings();
    } catch (error) {
      toast.error("Failed to cancel booking.");
      console.error("Error cancelling booking:", error);
    }
  };

  const convertTo24Hour = (time: string): string => {
    const [timePart, period] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  // const fetchScheduleAndBlockedDates = async () => {
  //   try {
  //     setLoading(true);

  //     console.log("STEP 2 mentorpolicy >>>>!!", booking);
  //     console.log("STEP 3 mentorpolicy >>>>!!", serviceSlot);
  //     const [schedules, fetchedBlockedDates, policy] = await Promise.all([
  //       getMentorSchedule(serviceSlot),
  //       getMentorBlockedDates(booking.mentorId),
  //       getMentorPolicy(booking.mentorId),
  //     ]);
  //     console.log("fetchScheduleAndBlockedDates schedules:", schedules);
  //     console.log(
  //       "fetchScheduleAndBlockedDates blockedDates:",
  //       fetchedBlockedDates
  //     );
  //     console.log("fetchScheduleAndBlockedDates policy:", policy);
  //     console.log("BookingConfirm STEP 4: fetched data", {
  //       schedules,
  //       blockedDates: fetchedBlockedDates,
  //     });
  //     setMentorPolicy(policy);
  //     setBlockedDates(fetchedBlockedDates);

  //     const blockedDateSet = new Set(
  //       fetchedBlockedDates
  //         .filter((bd: BlockedDate) => bd.type === "blocked")
  //         .map(
  //           (bd: BlockedDate) => new Date(bd.date).toISOString().split("T")[0]
  //         )
  //     );
  //     console.log("BookingConfirm STEP 5: ", blockedDateSet);
  //     const today = new Date();
  //     today.setHours(0, 0, 0, 0);
  //     const dates: {
  //       day: string;
  //       date: string;
  //       fullDate: string;
  //       isAvailable: boolean;
  //     }[] = [];
  //     console.log("BookingConfirm STEP 6: ", dates);
  //     const bookingPeriodDays =
  //       policy?.bookingPeriod?.unit === "days" ? policy.bookingPeriod.value : 0;
  //     const minBookableDate = new Date(today);
  //     minBookableDate.setDate(today.getDate() + bookingPeriodDays);
  //     console.log("BookingConfirm STEP 7: ", minBookableDate);
  //     for (let i = 0; i < 30; i++) {
  //       const date = new Date();
  //       date.setDate(today.getDate() + i);
  //       const fullDate = date.toISOString().split("T")[0];
  //       const dayName = date
  //         .toLocaleString("en-US", { weekday: "long" })
  //         .toLowerCase();
  //       const dateStr = date.toLocaleString("en-US", {
  //         day: "2-digit",
  //         month: "short",
  //       });
  //       console.log(
  //         "BookingConfirm STEP 8: ",
  //         date,
  //         fullDate,
  //         dayName,
  //         dateStr
  //       );
  //       let isAvailable = false;
  //       if (date >= minBookableDate && !blockedDateSet.has(fullDate)) {
  //         for (const schedule of schedules as Schedule[]) {
  //           console.log("BookingConfirm STEP 8.5 ");
  //           const scheduleDay = schedule.weeklySchedule.find(
  //             (d: ScheduleDay) => d.day === dayName
  //           );
  //           console.log("BookingConfirm STEP 9: ");
  //           if (
  //             scheduleDay?.slots.some(
  //               (slot: ScheduleSlot) =>
  //                 slot.isAvailable &&
  //                 !fetchedBlockedDates.some(
  //                   (bd: BlockedDate) =>
  //                     bd.type === "booking" &&
  //                     bd.slotTime === slot.startTime &&
  //                     new Date(bd.date).toISOString().split("T")[0] === fullDate
  //                 )
  //             )
  //           ) {
  //             console.log("BookingConfirm STEP 10: ");
  //             isAvailable = true;
  //             break;
  //           }
  //         }
  //       }
  //       console.log("BookingConfirm STEP 11: ");
  //       dates.push({
  //         day: date.toLocaleString("en-US", { weekday: "short" }),
  //         date: dateStr,
  //         fullDate,
  //         isAvailable,
  //       });
  //     }
  //     console.log("BookingConfirm STEP 12: ", dates);
  //     setAvailableDates(dates);
  //     console.log("BookingConfirm STEP 13: ");
  //     console.log("AVIALBLE DATES", availableDates);
  //     setAvailableDates(dates);
  //     console.log("AVIALBLE DATES....", availableDates);
  //   } catch (error) {
  //     console.error("Error fetching schedule or blocked dates:", error);
  //     toast.error("Failed to load mentor availability.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchScheduleAndBlockedDates = async () => {
    try {
      setLoading(true);

      console.log("STEP 2 mentorpolicy >>>>!!", booking);
      console.log("STEP 3 mentorpolicy >>>>!!", serviceSlot);
      if (!serviceSlot) {
        console.error(
          "fetchScheduleAndBlockedDates ERROR: No slot ID provided"
        );
        toast.error("Service schedule not found.");
        setLoading(false);
        return;
      }

      const [schedules, fetchedBlockedDates, policy] = await Promise.all([
        getMentorSchedule(serviceSlot), // Use slot ID directly
        getMentorBlockedDates(booking.mentorId),
        getMentorPolicy(booking.mentorId),
      ]);
      console.log("fetchScheduleAndBlockedDates STEP 1: schedules:", schedules);
      console.log(
        "fetchScheduleAndBlockedDates STEP 2: blockedDates:",
        fetchedBlockedDates
      );
      console.log("fetchScheduleAndBlockedDates STEP 3: policy:", policy);
      console.log("BookingConfirm STEP 4: fetched data", {
        schedules,
        blockedDates: fetchedBlockedDates,
      });
      setMentorPolicy(policy);
      setBlockedDates(fetchedBlockedDates);

      const blockedDateSet = new Set(
        fetchedBlockedDates
          .filter((bd: BlockedDate) => bd.type === "blocked")
          .map(
            (bd: BlockedDate) => new Date(bd.date).toISOString().split("T")[0]
          )
      );
      console.log("BookingConfirm STEP 5: ", blockedDateSet);
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
        policy?.bookingPeriod?.unit === "days" ? policy.bookingPeriod.value : 0;
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
            console.log("BookingConfirm STEP 9: ", scheduleDay);
            if (
              scheduleDay?.slots.some(
                (slot: ScheduleSlot) =>
                  slot.isAvailable &&
                  !fetchedBlockedDates.some(
                    (bd: BlockedDate) =>
                      bd.type === "booking" &&
                      bd.slotTime === slot.startTime &&
                      new Date(bd.date).toISOString().split("T")[0] === fullDate
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
      console.error("Error fetching schedule or blocked dates:", error);
      toast.error("Failed to load mentor availability.");
    } finally {
      setLoading(false);
    }
  };
  // const handleDateSelect = async (
  //   fullDate: string,
  //   event: React.MouseEvent<HTMLButtonElement>
  // ) => {
  //   event.preventDefault();
  //   const dateObj = availableDates.find((d) => d.fullDate === fullDate);
  //   if (!dateObj?.isAvailable) return;
  //   setSelectedDate(fullDate);
  //   setSelectedTime(null);
  //   setSelectedSlotIndex(null);

  //   try {
  //     const schedules: Schedule[] = await getMentorSchedule(booking.serviceId);
  //     const selectedDay = new Date(fullDate)
  //       .toLocaleString("en-US", { weekday: "long" })
  //       .toLowerCase();
  //     const bookedSlotsForDate = blockedDates
  //       .filter(
  //         (bd: BlockedDate) =>
  //           bd.type === "booking" &&
  //           new Date(bd.date).toISOString().split("T")[0] === fullDate &&
  //           bd.slotTime
  //       )
  //       .map((bd: BlockedDate) => bd.slotTime);

  //     let times: { time: string; slotIndex: number; isBooked: boolean }[] = [];

  //     for (const schedule of schedules) {
  //       const scheduleDay = schedule.weeklySchedule.find(
  //         (d: ScheduleDay) => d.day === selectedDay
  //       );
  //       if (scheduleDay) {
  //         const slots = scheduleDay.slots.map((slot: ScheduleSlot) => ({
  //           time: slot.startTime,
  //           slotIndex: slot.index,
  //           isBooked: bookedSlotsForDate.includes(slot.startTime),
  //         }));
  //         times = [...times, ...slots];
  //       }
  //     }

  //     times = [
  //       ...new Map(times.map((item) => [item.time, item])).values(),
  //     ].sort((a, b) => {
  //       const timeA = new Date(`1970-01-01T${convertTo24Hour(a.time)}`);
  //       const timeB = new Date(`1970-01-01T${convertTo24Hour(b.time)}`);
  //       return timeA.getTime() - timeB.getTime();
  //     });

  //     setAvailableTimes(times);
  //   } catch (error) {
  //     console.error("Error fetching schedules for selected date:", error);
  //     toast.error("Failed to load available times.");
  //   }
  // };
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
      const schedules: Schedule[] = await getMentorSchedule(serviceSlot); // Use slot ID
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

  const handleRescheduleSubmit = async () => {
    try {
      // Assume a requestReschedule service exists
      await requestReschedule(booking.id, {
        requestedDate: selectedDate,
        requestedTime: selectedTime,
        requestedSlotIndex: selectedSlotIndex,
        mentorDecides,
      });
      toast.success("Reschedule request sent successfully.");
      setIsRescheduleModalOpen(false);
      if (refreshBookings) refreshBookings();
    } catch (error) {
      toast.error("Failed to send reschedule request.");
      console.error("Error sending reschedule request:", error);
    }
  };

  const getServiceTypeDetails = () => {
    let mainType = "";
    const serviceType = booking.serviceType.toLowerCase().replace(/-/g, "");
    switch (serviceType) {
      case "11call":
      case "1-1call":
      case "1:1call":
        mainType = "1:1 Call";
        break;
      case "digitalproducts":
      case "digitalproduct":
        mainType = "Digital Product";
        break;
      case "prioritydm":
        mainType = "Direct Message";
        break;
      default:
        mainType = booking.serviceType;
    }
    let subType = "";
    if (
      (serviceType === "11call" ||
        serviceType === "1-1call" ||
        serviceType === "1:1call") &&
      booking.oneToOneType
    ) {
      subType = booking.oneToOneType;
    } else if (
      (serviceType === "digitalproducts" || serviceType === "digitalproduct") &&
      booking.digitalProductType
    ) {
      subType = booking.digitalProductType;
    }
    if (subType) {
      return `${mainType} - ${subType}`;
    }
    return mainType;
  };

  const getStatusBadge = () => {
    const statusStyles = {
      confirmed: "bg-black text-white",
      completed: "bg-white text-black border border-black",
      cancelled: "bg-gray-100 text-gray-500 border border-gray-300",
      rescheduled: "bg-white text-black border border-black",
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    };
    const statusIcons = {
      confirmed: <CheckCircle className="w-4 h-4 mr-1" />,
      completed: <CheckCircle className="w-4 h-4 mr-1" />,
      cancelled: <XCircle className="w-4 h-4 mr-1" />,
      rescheduled: <Clock className="w-4 h-4 mr-1" />,
      pending: <Clock className="w-4 h-4 mr-1" />,
    };
    return (
      <div
        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium flex items-center ${
          statusStyles[booking.status.toLowerCase()]
        }`}
      >
        {statusIcons[booking.status.toLowerCase()]}
        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
      </div>
    );
  };

  const getServiceTypeIcon = () => {
    const serviceType = booking.serviceType.toLowerCase().replace(/-/g, "");
    if (
      serviceType === "11call" ||
      serviceType === "1-1call" ||
      serviceType === "1:1call"
    ) {
      return (
        <div className="bg-black text-white p-2 rounded-full">
          <MessageCircle className="w-4 h-4" />
        </div>
      );
    } else if (serviceType === "prioritydm") {
      return (
        <div className="bg-black text-white p-2 rounded-full">
          <MessageCircle className="w-4 h-4" />
        </div>
      );
    } else if (
      serviceType === "digitalproducts" ||
      serviceType === "digitalproduct"
    ) {
      return (
        <div className="bg-black text-white p-2 rounded-full">
          <FileText className="w-4 h-4" />
        </div>
      );
    } else {
      return (
        <div className="bg-black text-white p-2 rounded-full">
          <Tag className="w-4 h-4" />
        </div>
      );
    }
  };

  const handleRescheduleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (canReschedule) {
      setIsRescheduleModalOpen(true);
      fetchScheduleAndBlockedDates();
      setDropdownOpen(false);
    } else {
      toast.error("Reschedule period has expired.");
    }
  };

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-xl border-2 border-black transition-all duration-300 flex flex-col max-w-[250px] ${
          isDigitalDocument() || isDigitalVideoTutorial() || isPriorityDM()
            ? "cursor-pointer"
            : ""
        }`}
        style={{
          transform: isHovered ? "translateY(-5px)" : "translateY(0)",
          boxShadow: isHovered ? "0 10px 30px rgba(0, 0, 0, 0.1)" : "none",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <img
              src={booking.mentorImage || "/api/placeholder/40/40"}
              alt={booking.mentorName}
              className="w-12 h-12 rounded-full object-cover border-2 border-black"
            />
            <div className="absolute -top-3 -left-3">
              {getServiceTypeIcon()}
            </div>
          </div>
          <div className="relative flex-1">
            <h3 className="font-semibold text-sm">{booking.mentorName}</h3>
            <p className="text-xs text-gray-600">{getServiceTypeDetails()}</p>
            <div className="absolute bottom-4 -right-6">{getStatusBadge()}</div>
          </div>
          <div>
            {(booking.serviceType === "1:1call" ||
              booking.serviceType === "1-1Call" ||
              booking.serviceType === "11call") &&
              booking.status === "confirmed" && (
                <DropdownMenu
                  open={dropdownOpen}
                  onOpenChange={setDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white rounded-lg shadow-lg border border-gray-200">
                    <DropdownMenuItem
                      className="hover:bg-gray-100 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCancelModalOpen(true);
                        setDropdownOpen(false);
                      }}
                    >
                      Cancel Booking
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:bg-gray-100 cursor-pointer"
                      onClick={handleRescheduleClick}
                    >
                      Request Reschedule
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-bold mb-2 line-clamp-2">
            {booking.title}
          </h3>
          {booking.technology && (
            <div className="mb-4">
              <span className="inline-block bg-gray-100 text-xs px-3 py-1 rounded-full font-medium">
                {booking.technology}
              </span>
            </div>
          )}
          <div className="space-y-3 mt-auto">
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span>{booking.date}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-2 text-gray-500" />
              <span>{booking.time}</span>
            </div>
            <div className="font-bold mt-2">₹{booking.price}/-</div>
          </div>
        </div>
        <div className="p-4 pt-2 border-t border-gray-200">
          {type === "upcoming" ? (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                if (navigateToProfile) navigateToProfile();
              }}
              className="w-full bg-black hover:bg-gray-800 text-white transition-colors"
            >
              View Mentor
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              {booking.rating ? (
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < booking.rating!
                            ? "fill-black text-black"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-1 text-xs">{booking.rating}/5</span>
                </div>
              ) : (
                booking.status.toLowerCase() === "completed" &&
                !booking.feedback && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onFeedbackClick) onFeedbackClick();
                    }}
                    className="w-full bg-white hover:bg-gray-100 text-black border border-black transition-colors"
                  >
                    Leave Feedback
                  </Button>
                )
              )}
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  if (navigateToProfile) navigateToProfile();
                }}
                className="w-full bg-black hover:bg-gray-800 text-white transition-colors"
              >
                View Mentor
              </Button>
            </div>
          )}
        </div>
      </div>

      {isDigitalDocument() && (
        <DigitalProductModal
          isOpen={isDigitalProductModalOpen}
          onClose={() => setIsDigitalProductModalOpen(false)}
          serviceId={booking.serviceId}
          title={booking.title}
          productType={booking.digitalProductType || "Document"}
        />
      )}

      {isPriorityDM() && booking.status.toLowerCase() !== "completed" && (
        <PriorityDMModal
          isOpen={isPriorityDMModalOpen}
          onClose={() => setIsPriorityDMModalOpen(false)}
          serviceId={booking.serviceId}
          bookingId={booking.id}
          title={booking.title}
          productType="Direct Message"
          refreshBookings={refreshBookings}
        />
      )}

      {isPriorityDM() && selectedDM && (
        <AnswerModal
          isOpen={isAnswerModalOpen}
          onClose={() => {
            setIsAnswerModalOpen(false);
            setSelectedDM(null);
          }}
          question={selectedDM}
        />
      )}

      <ConfirmationModal
        open={isCancelModalOpen}
        onOpenChange={setIsCancelModalOpen}
        onConfirm={handleCancelBooking}
        title="Cancel Booking"
        description="Are you sure you want to cancel this booking? This action cannot be undone."
      />

      <Dialog
        open={isRescheduleModalOpen}
        onOpenChange={setIsRescheduleModalOpen}
      >
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
                <div className="flex items-center space-x-2 mb-6 bg-white p-3 rounded-lg shadow-sm">
                  <Switch
                    id="mentor-decides"
                    checked={mentorDecides}
                    onCheckedChange={(checked) => {
                      setMentorDecides(checked);
                      if (checked) {
                        setSelectedDate(null);
                        setSelectedTime(null);
                        setSelectedSlotIndex(null);
                        setAvailableTimes([]);
                      }
                    }}
                    className={`${
                      mentorDecides ? "bg-blue-500" : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                  />
                  <Label
                    htmlFor="mentor-decides"
                    className="text-sm font-medium text-gray-900"
                  >
                    Let Mentor Decide
                  </Label>
                </div>

                {!mentorDecides && (
                  <>
                    <h3 className="font-semibold text-lg mb-1">Select Date</h3>
                    <div className="flex items-center mb-6">
                      <button className="p-2 hover:bg-gray-200 rounded-full flex-shrink-0">
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
                              onClick={(e) =>
                                handleDateSelect(date.fullDate, e)
                              }
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
                      <button className="p-2 hover:bg-gray-200 rounded-full flex-shrink-0">
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

                    {(selectedDate || selectedTime) && (
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
                    )}
                  </>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsRescheduleModalOpen(false);
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
                    disabled={
                      !mentorDecides && (!selectedDate || !selectedTime)
                    }
                  >
                    Confirm
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookingCard;
