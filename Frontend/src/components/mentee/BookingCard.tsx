// "use client";
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
// import RescheduleModal from "@/components/modal/ResheduleModal";
// import { getMentorPolicy, getPriorityDMs } from "@/services/menteeService";
// import { cancelBooking } from "@/services/bookingService";
// import { toast } from "react-hot-toast";
// import { ProfilePicture } from "@/components/users/SecureMedia";

// interface MentorPolicy {
//   bookingPeriod: { unit: string; value: number };
//   reschedulePeriod: { unit: string; value: number };
//   noticePeriod: { unit: string; value: number };
//   _id: string;
//   userId: string;
//   createdAt: string;
//   updatedAt: string;
// }

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
//   slot: string;
//   testimonial?: {
//     _id: string;
//     comment: string;
//     rating: number;
//   };
// }

// interface BookingCardProps {
//   booking: Booking;
//   serviceSlot: string;
//   type: "upcoming" | "completed";
//   navigateToProfile?: () => void;
//   onFeedbackClick?: () => void;
//   refreshBookings?: () => Promise<void>;
// }

// const BookingCard = ({
//   booking,
//   serviceSlot,
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
//   const [mentorPolicy, setMentorPolicy] = useState<MentorPolicy | null>(null);
//   const [canReschedule, setCanReschedule] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     console.log("BOOKING Card >>>>> STEP 1", booking);
//     console.log("BOOKING Card >>>>> STEP 2", type);
//     console.log("BOOKING Card >>>>> STEP 3", navigateToProfile);
//     console.log("BOOKING Card >>>>> STEP 4", onFeedbackClick);
//     console.log("BOOKING Card >>>>> STEP 5", refreshBookings);
//     console.log("BOOKING Card >>>>> STEP 6", serviceSlot);

//     // Check if rescheduling is allowed based on reschedulePeriod
//     const checkRescheduleEligibility = async () => {
//       try {
//         const policy = await getMentorPolicy(booking.mentorId);
//         setMentorPolicy(policy);
//         console.log("getMentorPolicy <<<<<<<", policy);

//         // Convert booking.date from DD/MM/YYYY to YYYY-MM-DD
//         const [day, month, year] = booking.date.split("/");
//         const formattedDate = `${year}-${month}-${day}`;

//         // Combine date and time
//         const bookedDateTime = new Date(`${formattedDate} ${booking.time}`);

//         if (isNaN(bookedDateTime.getTime())) {
//           console.error(
//             "Invalid date format:",
//             `${formattedDate} ${booking.time}`
//           );
//           setCanReschedule(false);
//           return;
//         }

//         const currentTime = new Date();
//         console.log("bookedDateTime >>>>> STEP 1", bookedDateTime);

//         const rescheduleDeadline = new Date(bookedDateTime);
//         console.log("rescheduleDeadline >>>>> STEP 2", rescheduleDeadline);

//         const { unit, value } = policy.reschedulePeriod || {
//           unit: "hours",
//           value: 0,
//         };

//         if (unit === "days") {
//           rescheduleDeadline.setDate(rescheduleDeadline.getDate() - value);
//         } else if (unit === "hours") {
//           rescheduleDeadline.setHours(rescheduleDeadline.getHours() - value);
//         } else if (unit === "minutes") {
//           rescheduleDeadline.setMinutes(
//             rescheduleDeadline.getMinutes() - value
//           );
//         }

//         console.log(
//           "setCanReschedule >>>>>>>>>>>",
//           currentTime,
//           " and ",
//           rescheduleDeadline
//         );

//         setCanReschedule(currentTime <= rescheduleDeadline);
//       } catch (error) {
//         console.error("Error checking reschedule eligibility:", error);
//         setCanReschedule(false);
//       }
//     };

//     checkRescheduleEligibility();
//   }, [
//     booking,
//     type,
//     navigateToProfile,
//     onFeedbackClick,
//     refreshBookings,
//     serviceSlot,
//   ]);

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
//       await cancelBooking(booking.id);
//       toast.success("Booking cancelled successfully.");
//       if (refreshBookings) await refreshBookings();
//       setIsCancelModalOpen(false);
//     } catch (error) {
//       toast.error("Failed to cancel booking.");
//       console.error("Error cancelling booking:", error);
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
//           statusStyles[booking?.status?.toLowerCase()]
//         }`}
//       >
//         {statusIcons[booking?.status?.toLowerCase()]}
//         {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//       </div>
//     );
//   };

//   const getServiceTypeIcon = () => {
//     const serviceType = booking.serviceType.toLowerCase().replace(/-/g, "");
//     if (
//       serviceType === "1-1Call" ||
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

//   const handleRescheduleClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     e.stopPropagation();
//     if (canReschedule) {
//       setIsRescheduleModalOpen(true);
//       setDropdownOpen(false);
//     } else {
//       toast.error("Reschedule period has expired.");
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
//             {booking.mentorImage ? (
//               <ProfilePicture
//                 profilePicture={booking.mentorImage}
//                 userName={booking.mentorName}
//                 size="md"
//                 className="w-14 h-14 rounded-full object-cover border-2 border-black"
//               />
//             ) : (
//               <img
//                 src="/api/placeholder/40/40"
//                 alt={booking.mentorName}
//                 className="w-12 h-12 rounded-full object-cover border-2 border-black"
//               />
//             )}
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
//                       onClick={handleRescheduleClick}
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
//               {booking.testimonial ? (
//                 <>
//                   <div className="flex items-center mb-2">
//                     <div className="flex">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           className={`w-4 h-4 ${
//                             i < booking.testimonial!.rating
//                               ? "fill-black text-black"
//                               : "text-gray-300"
//                           }`}
//                         />
//                       ))}
//                     </div>
//                     <span className="ml-1 text-xs">
//                       {booking.testimonial.rating}/5
//                     </span>
//                   </div>
//                   <Button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       if (onFeedbackClick) onFeedbackClick();
//                     }}
//                     variant="outline"
//                     className="w-full bg-white hover:bg-gray-100 text-black border border-black transition-colors"
//                   >
//                     See/Edit Feedback
//                   </Button>
//                 </>
//               ) : (
//                 booking.status.toLowerCase() === "completed" && (
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

//       <RescheduleModal
//         isOpen={isRescheduleModalOpen}
//         onClose={() => {
//           setIsRescheduleModalOpen(false);
//         }}
//         bookingId={booking.id}
//         serviceSlot={serviceSlot}
//         mentorId={booking.mentorId}
//         refreshBookings={refreshBookings}
//       />
//     </>
//   );
// };

// export default BookingCard;
"use client";
import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle,
  Star,
  FileText,
  MoreVertical,
  Video,
  Zap,
  Eye,
  ArrowRight,
  Sparkles,
  User,
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
import RescheduleModal from "@/components/modal/ResheduleModal";
import { getMentorPolicy, getPriorityDMs } from "@/services/menteeService";
import { cancelBooking } from "@/services/bookingService";
import { toast } from "react-hot-toast";
import { ProfilePicture } from "@/components/users/SecureMedia";

interface MentorPolicy {
  bookingPeriod: { unit: string; value: number };
  reschedulePeriod: { unit: string; value: number };
  noticePeriod: { unit: string; value: number };
  _id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface Booking {
  id: string;
  serviceId: string;
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
  slot: string;
  testimonial?: {
    _id: string;
    comment: string;
    rating: number;
  };
}

interface BookingCardProps {
  booking: Booking;
  serviceSlot: string;
  type: "upcoming" | "completed";
  navigateToProfile?: () => void;
  onFeedbackClick?: () => void;
  refreshBookings?: () => Promise<void>;
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
  const [mentorPolicy, setMentorPolicy] = useState<MentorPolicy | null>(null);
  const [canReschedule, setCanReschedule] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkRescheduleEligibility = async () => {
      try {
        const policy = await getMentorPolicy(booking.mentorId);
        setMentorPolicy(policy);

        const [day, month, year] = booking.date.split("/");
        const formattedDate = `${year}-${month}-${day}`;
        const bookedDateTime = new Date(`${formattedDate} ${booking.time}`);

        if (isNaN(bookedDateTime.getTime())) {
          console.error(
            "Invalid date format:",
            `${formattedDate} ${booking.time}`
          );
          setCanReschedule(false);
          return;
        }

        const currentTime = new Date();
        const rescheduleDeadline = new Date(bookedDateTime);
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
  }, [booking]);

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
      if (
        booking.status.toLowerCase() === "completed" ||
        booking.status.toLowerCase() === "pending"
      ) {
        try {
          const response = await getPriorityDMs(booking.id);
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
      await cancelBooking(booking.id);
      toast.success("Booking cancelled successfully.");
      if (refreshBookings) await refreshBookings();
      setIsCancelModalOpen(false);
    } catch (error) {
      toast.error("Failed to cancel booking.");
      console.error("Error cancelling booking:", error);
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
        mainType = "Priority DM";
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
    const statusConfig = {
      confirmed: {
        bg: "bg-gradient-to-r from-green-500 to-emerald-500",
        icon: CheckCircle,
        text: "Confirmed",
      },
      completed: {
        bg: "bg-gradient-to-r from-purple-500 to-pink-500",
        icon: CheckCircle,
        text: "Completed",
      },
      cancelled: {
        bg: "bg-gradient-to-r from-gray-500 to-slate-500",
        icon: XCircle,
        text: "Cancelled",
      },
      rescheduled: {
        bg: "bg-gradient-to-r from-yellow-500 to-orange-500",
        icon: Clock,
        text: "Rescheduled",
      },
      pending: {
        bg: "bg-gradient-to-r from-blue-500 to-indigo-500",
        icon: Clock,
        text: "Pending",
      },
    };

    const config =
      statusConfig[booking.status.toLowerCase()] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <div
        className={`absolute top-2 right-4 px-3 py-1 rounded-full text-xs font-bold text-white flex items-center ${config.bg} shadow-lg`}
      >
        <IconComponent className="w-3 h-3 mr-1" />
        {config.text}
      </div>
    );
  };

  const getServiceTypeIcon = () => {
    const serviceType = booking.serviceType.toLowerCase().replace(/-/g, "");

    if (
      serviceType === "1-1call" ||
      serviceType === "1:1call" ||
      serviceType === "11call"
    ) {
      return (
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
          {booking.oneToOneType === "video" ? (
            <Video className="w-5 h-5 text-white" />
          ) : (
            <MessageCircle className="w-5 h-5 text-white" />
          )}
        </div>
      );
    } else if (serviceType === "prioritydm") {
      return (
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
          <Zap className="w-5 h-5 text-white" />
        </div>
      );
    } else if (
      serviceType === "digitalproducts" ||
      serviceType === "digitalproduct"
    ) {
      return (
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
          {booking.digitalProductType === "documents" ? (
            <FileText className="w-5 h-5 text-white" />
          ) : (
            <Video className="w-5 h-5 text-white" />
          )}
        </div>
      );
    } else {
      return (
        <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-slate-500 rounded-xl flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      );
    }
  };

  const handleRescheduleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (canReschedule) {
      setIsRescheduleModalOpen(true);
      setDropdownOpen(false);
    } else {
      toast.error("Reschedule period has expired.");
    }
  };

  return (
    <>
      <div
        className={`group relative bg-white rounded-3xl border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
          isDigitalDocument() || isDigitalVideoTutorial() || isPriorityDM()
            ? "cursor-pointer"
            : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status Badge */}
        {getStatusBadge()}

        {/* Header Section */}
        <div className="relative p-6 pt-10 ">
          <div className="flex items-start gap-4">
            {/* Service Type Icon */}
            <div className="relative">
              {getServiceTypeIcon()}

              {booking.status.toLowerCase() === "confirmed" && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 animate-ping opacity-20" />
              )}
            </div>

            {/* Mentor Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  {booking.mentorImage ? (
                    <ProfilePicture
                      profilePicture={booking.mentorImage}
                      userName={booking.mentorName}
                      size="sm"
                      className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 flex items-center justify-center border-2 border-white shadow-md">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {/* Online indicator */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate text-sm">
                    {booking.mentorName}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {getServiceTypeDetails()}
                  </p>
                </div>
              </div>
            </div>

            {/* Dropdown Menu */}
            {(booking.serviceType === "1:1call" ||
              booking.serviceType === "1-1Call" ||
              booking.serviceType === "11call") &&
              booking.status === "confirmed" && (
                <DropdownMenu
                  open={dropdownOpen}
                  onOpenChange={setDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white rounded-xl shadow-xl border border-gray-100 p-1">
                    <DropdownMenuItem
                      className="hover:bg-red-50 hover:text-red-600 cursor-pointer rounded-lg px-3 py-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCancelModalOpen(true);
                        setDropdownOpen(false);
                      }}
                    >
                      Cancel Booking
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer rounded-lg px-3 py-2"
                      onClick={handleRescheduleClick}
                    >
                      Request Reschedule
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
          </div>
        </div>

        {/* Main Content */}
        <div className="relative px-6">
          <div className="mb-4">
            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight">
              {booking.title}
            </h3>

            {booking.technology && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-xs font-medium">
                <Sparkles className="w-3 h-3 mr-1" />
                {booking.technology}
              </div>
            )}
          </div>

          {/* Date & Time */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <span className="font-medium">{booking.date}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-medium">{booking.time}</span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ₹{booking.price}
              </span>
              {isHovered && (
                <div className="flex items-center text-sm text-gray-500">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>Click to view</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="relative border-t border-gray-50 p-6 pt-1">
          {type === "upcoming" ? (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                if (navigateToProfile) navigateToProfile();
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl py-3 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <User className="w-4 h-4 mr-2" />
              View Mentor Profile
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <div className="space-y-3">
              {booking.testimonial ? (
                <>
                  {/* <div className="flex items-center justify-center  mb-0 p-1 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < booking.testimonial!.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-semibold text-gray-700">
                        {booking.testimonial.rating}/5
                      </span>
                    </div>
                  </div> */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onFeedbackClick) onFeedbackClick();
                    }}
                    variant="outline"
                    className="w-full rounded-xl py-3 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 font-semibold transition-all duration-200"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    View/Edit Feedback
                  </Button>
                </>
              ) : (
                booking.status.toLowerCase() === "completed" && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onFeedbackClick) onFeedbackClick();
                    }}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl py-3 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Leave Feedback
                  </Button>
                )
              )}
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  if (navigateToProfile) navigateToProfile();
                }}
                variant="outline"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl py-3 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <User className="w-4 h-4 mr-2" />
                View Mentor Profile
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Modals */}
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

      <RescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => {
          setIsRescheduleModalOpen(false);
        }}
        bookingId={booking.id}
        serviceSlot={serviceSlot}
        mentorId={booking.mentorId}
        refreshBookings={refreshBookings}
      />
    </>
  );
};

export default BookingCard;
