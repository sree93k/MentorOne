// import { useState } from "react";
// import {
//   Calendar,
//   Clock,
//   Tag,
//   CheckCircle,
//   XCircle,
//   MessageCircle,
//   Star,
//   FileText,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import DigitalProductModal from "@/components/modal/DocumentModal";
// import PriorityDMModal from "@/components/modal/PriorityDMModal";
// import AnswerModal from "@/components/modal/AnswerModal";
// import { getPriorityDMs } from "@/services/menteeService";
// import toast from "react-hot-toast";

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
//   rating?: number;
//   feedback?: string;
//   serviceType: string;
//   oneToOneType?: string | null;
//   digitalProductType?: string | null;
// }

// interface BookingCardProps {
//   booking: Booking;
//   type: "upcoming" | "completed";
//   navigateToProfile?: () => void;
//   onFeedbackClick?: () => void;
// }

// const BookingCard = ({
//   booking,
//   type,
//   navigateToProfile,
//   onFeedbackClick,
// }: BookingCardProps) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [isDigitalProductModalOpen, setIsDigitalProductModalOpen] =
//     useState(false);
//   const [isPriorityDMModalOpen, setIsPriorityDMModalOpen] = useState(false);
//   const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
//   const [selectedDM, setSelectedDM] = useState<any | null>(null);

//   const isDigitalDocument = () => {
//     const serviceType = booking.serviceType.toLowerCase().replace(/-/g, "");
//     return (
//       (serviceType === "digitalproducts" || serviceType === "digitalproduct") &&
//       booking.digitalProductType === "documents"
//     );
//   };

//   const isPriorityDM = () => {
//     const serviceType = booking.serviceType.toLowerCase().replace(/-/g, "");
//     return serviceType === "prioritydm";
//   };

//   const handleCardClick = async () => {
//     if (isDigitalDocument()) {
//       setIsDigitalProductModalOpen(true);
//     } else if (isPriorityDM()) {
//       console.log("Bookingcards getPriorityDMs response is step 1", booking);

//       if (
//         booking.status.toLowerCase() === "completed" ||
//         booking.status.toLowerCase() === "pending"
//       ) {
//         try {
//           // Fetch Priority DMs for this booking
//           console.log("Bookingcards getPriorityDMs response is step 1.5");
//           const response = await getPriorityDMs(booking.id);
//           console.log(
//             "Bookingcards getPriorityDMs response is step 2",
//             response
//           );

//           if (response.status === "replied" || response.status === "pending") {
//             setSelectedDM(response); // Assume the first DM is the relevant one
//             setIsAnswerModalOpen(true);
//           } else {
//             toast.error("No Priority DM found for this booking.");
//           }
//         } catch (error) {
//           toast.error("Failed to fetch Priority DM.");
//           console.error("Error fetching Priority DM:", error);
//         }
//         // } else if (booking.status.toLowerCase() === "pending") {
//         //   setIsAnswerModalOpen(true);
//       } else {
//         setIsPriorityDMModalOpen(true);
//       }
//     }
//   };

//   const getServiceTypeDetails = () => {
//     let mainType = "";
//     const serviceType = booking.serviceType.toLowerCase().replace(/-/g, "");

//     switch (serviceType) {
//       case "1-1call":
//       case "11call":
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
//       (serviceType === "1-1call" ||
//         serviceType === "11call" ||
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
//     };

//     const statusIcons = {
//       confirmed: <CheckCircle className="w-4 h-4 mr-1" />,
//       completed: <CheckCircle className="w-4 h-4 mr-1" />,
//       cancelled: <XCircle className="w-4 h-4 mr-1" />,
//       rescheduled: <Clock className="w-4 h-4 mr-1" />,
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
//         className={`relative overflow-hidden rounded-xl border border-black transition-all duration-300 flex flex-col max-w-[250px] ${
//           isDigitalDocument() || isPriorityDM() ? "cursor-pointer" : ""
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
//                           i < booking.rating
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
//     </>
//   );
// };

// export default BookingCard;
import { useState } from "react";
import {
  Calendar,
  Clock,
  Tag,
  CheckCircle,
  XCircle,
  MessageCircle,
  Star,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DigitalProductModal from "@/components/modal/DocumentModal";
import PriorityDMModal from "@/components/modal/PriorityDMModal";
import AnswerModal from "@/components/modal/AnswerModal";
import { getPriorityDMs } from "@/services/menteeService";
import toast from "react-hot-toast";

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
}

interface BookingCardProps {
  booking: Booking;
  type: "upcoming" | "completed";
  navigateToProfile?: () => void;
  onFeedbackClick?: () => void;
  refreshBookings?: () => void; // Add refreshBookings prop
}

const BookingCard = ({
  booking,
  type,
  navigateToProfile,
  onFeedbackClick,
  refreshBookings, // Destructure new prop
}: BookingCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDigitalProductModalOpen, setIsDigitalProductModalOpen] =
    useState(false);
  const [isPriorityDMModalOpen, setIsPriorityDMModalOpen] = useState(false);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [selectedDM, setSelectedDM] = useState<any | null>(null);

  const isDigitalDocument = () => {
    const serviceType = booking.serviceType.toLowerCase().replace(/-/g, "");
    return (
      (serviceType === "digitalproducts" || serviceType === "digitalproduct") &&
      booking.digitalProductType === "documents"
    );
  };

  const isPriorityDM = () => {
    const serviceType = booking.serviceType.toLowerCase().replace(/-/g, "");
    return serviceType === "prioritydm";
  };

  const handleCardClick = async () => {
    if (isDigitalDocument()) {
      setIsDigitalProductModalOpen(true);
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

  const getServiceTypeDetails = () => {
    let mainType = "";
    const serviceType = booking.serviceType.toLowerCase().replace(/-/g, "");

    switch (serviceType) {
      case "1-1call":
      case "11call":
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
      (serviceType === "1-1call" ||
        serviceType === "11call" ||
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
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-300", // Add pending style
    };

    const statusIcons = {
      confirmed: <CheckCircle className="w-4 h-4 mr-1" />,
      completed: <CheckCircle className="w-4 h-4 mr-1" />,
      cancelled: <XCircle className="w-4 h-4 mr-1" />,
      rescheduled: <Clock className="w-4 h-4 mr-1" />,
      pending: <Clock className="w-4 h-4 mr-1" />, // Add pending icon
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

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-xl border border-black transition-all duration-300 flex flex-col max-w-[250px] ${
          isDigitalDocument() || isPriorityDM() ? "cursor-pointer" : ""
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
                          i < booking.rating
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
          refreshBookings={refreshBookings} // Pass refresh callback
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
    </>
  );
};

export default BookingCard;
