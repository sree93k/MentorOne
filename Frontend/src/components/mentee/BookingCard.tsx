// import { useState } from "react";
// import { Star } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import DigitalProductModal from "@/components/modal/DocumentModal";
// import PriorityDMModal from "@/components/modal/PriorityDMModal";

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

// export default function BookingCard({
//   booking,
//   type,
//   navigateToProfile,
//   onFeedbackClick,
// }: BookingCardProps) {
//   const [isDigitalProductModalOpen, setIsDigitalProductModalOpen] =
//     useState(false);
//   const [isPriorityDMModalOpen, setIsPriorityDMModalOpen] = useState(false);

//   // Display both service type and subtype if available
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

//   // Check if this is a digital document
//   const isDigitalDocument = () => {
//     const serviceType = booking.serviceType.toLowerCase().replace(/-/g, "");
//     return (
//       (serviceType === "digitalproducts" || serviceType === "digitalproduct") &&
//       booking.digitalProductType === "documents"
//     );
//   };

//   // Check if this is a priority DM
//   const isPriorityDM = () => {
//     const serviceType = booking.serviceType.toLowerCase().replace(/-/g, "");
//     return serviceType === "prioritydm";
//   };

//   // Handle card click
//   const handleCardClick = () => {
//     if (isDigitalDocument()) {
//       setIsDigitalProductModalOpen(true);
//     } else if (isPriorityDM()) {
//       setIsPriorityDMModalOpen(true);
//     }
//   };

//   return (
//     <>
//       <div
//         className={`bg-white rounded-lg shadow-md overflow-hidden max-w-[250px] ${
//           isDigitalDocument() || isPriorityDM()
//             ? "cursor-pointer hover:shadow-lg transition-shadow"
//             : ""
//         }`}
//         onClick={handleCardClick}
//       >
//         <div className="bg-red-500 p-4">
//           <div className="flex items-center gap-4">
//             <img
//               src={booking.mentorImage}
//               alt={booking.mentorName}
//               className="w-12 h-12 rounded-full object-cover"
//             />
//             <div>
//               <h3 className="text-white font-semibold">{booking.mentorName}</h3>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="mt-1 bg-white hover:bg-gray-100 rounded-full"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   if (navigateToProfile) navigateToProfile();
//                 }}
//               >
//                 Profile
//               </Button>
//             </div>
//           </div>
//         </div>
//         <div className="p-4">
//           <h4 className="font-semibold text-lg">{booking.title}</h4>
//           <p className="font-semibold text-gray-600 text-sm">
//             {getServiceTypeDetails()}
//           </p>
//           <p className="text-gray-600">{booking.technology}</p>
//           <div className="flex flex-col justify- mt-2">
//             <div className="flex justify-between gap-4">
//               <p className="text-sm text-gray-600">{booking.date}</p>
//               <p className="text-sm text-gray-600">{booking.time}</p>
//             </div>
//             <p className="font-semibold py-2">₹{booking.price}/-</p>
//           </div>
//           <div className="flex justify-between">
//             <div>
//               {type === "upcoming" ? (
//                 <div className="mt-4">
//                   <span className="px-5 py-2 bg-green-500 text-white rounded-full text-sm">
//                     {booking.status.charAt(0).toUpperCase() +
//                       booking.status.slice(1)}
//                   </span>
//                 </div>
//               ) : (
//                 <div className="mt-4 flex justify-between items-center">
//                   {booking.rating ? (
//                     <div className="flex items-center gap-1">
//                       <span className="font-semibold">{booking.rating}</span>
//                       <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                     </div>
//                   ) : null}
//                   {!booking.feedback && (
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         if (onFeedbackClick) onFeedbackClick();
//                       }}
//                       className="bg-orange-500 text-white hover:bg-orange-600 rounded-full"
//                     >
//                       Feedback
//                     </Button>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Digital Product Modal */}
//       {isDigitalDocument() && (
//         <DigitalProductModal
//           isOpen={isDigitalProductModalOpen}
//           onClose={() => setIsDigitalProductModalOpen(false)}
//           serviceId={booking.serviceId}
//           title={booking.title}
//           productType={booking.digitalProductType || "Document"}
//         />
//       )}

//       {/* Priority DM Modal */}
//       {isPriorityDM() && (
//         <PriorityDMModal
//           isOpen={isPriorityDMModalOpen}
//           onClose={() => setIsPriorityDMModalOpen(false)}
//           serviceId={booking.serviceId}
//           title={booking.title}
//           productType="Direct Message"
//         />
//       )}
//     </>
//   );
// }

//===========================================================================================
// import { useState } from "react";
// import {
//   Calendar,
//   Clock,
//   Tag,
//   CheckCircle,
//   XCircle,
//   MessageCircle,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";

// const BookingCard = ({ booking, type, navigateToProfile, onFeedbackClick }) => {
//   const [isHovered, setIsHovered] = useState(false);

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
//           statusStyles[booking.status]
//         }`}
//       >
//         {statusIcons[booking.status]}
//         {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//       </div>
//     );
//   };

//   const getServiceTypeIcon = () => {
//     switch (booking.serviceType) {
//       case "1-1Call":
//         return (
//           <div className="bg-black text-white p-2 rounded-full">
//             <MessageCircle className="w-4 h-4" />
//           </div>
//         );
//       case "priorityDM":
//         return (
//           <div className="bg-black text-white p-2 rounded-full">
//             <MessageCircle className="w-4 h-4" />
//           </div>
//         );
//       case "DigitalProducts":
//         return (
//           <div className="bg-black text-white p-2 rounded-full">
//             <Tag className="w-4 h-4" />
//           </div>
//         );
//       default:
//         return (
//           <div className="bg-black text-white p-2 rounded-full">
//             <Tag className="w-4 h-4" />
//           </div>
//         );
//     }
//   };

//   const formatServiceType = (type) => {
//     switch (type) {
//       case "1-1Call":
//         return "1:1 Call";
//       case "priorityDM":
//         return "Priority DM";
//       case "DigitalProducts":
//         return "Digital Product";
//       default:
//         return type;
//     }
//   };

//   return (
//     <div
//       className="relative overflow-hidden rounded-xl border border-black transition-all duration-300 flex flex-col"
//       style={{
//         transform: isHovered ? "translateY(-5px)" : "translateY(0)",
//         boxShadow: isHovered ? "0 10px 30px rgba(0, 0, 0, 0.1)" : "none",
//       }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Card Header with Mentor Info */}
//       <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gray-50">
//         <div className="relative">
//           <img
//             src={booking.mentorImage || "/api/placeholder/40/40"}
//             alt={booking.mentorName}
//             className="w-14 h-14 rounded-full object-cover border-2 border-black"
//           />
//           <div className="absolute -top-3 -left-3">{getServiceTypeIcon()}</div>
//         </div>
//         <div className="relative flex-1">
//           <h3 className="font-semibold text-sm">{booking.mentorName}</h3>
//           <p className="text-xs text-gray-600">
//             {formatServiceType(booking.serviceType)}
//           </p>
//           <div className="absolute bottom-4 -right-6">{getStatusBadge()}</div>
//         </div>
//       </div>

//       {/* Card Body */}
//       <div className="p-5 flex-1 flex flex-col">
//         <h3 className="text-lg font-bold mb-2 line-clamp-2">{booking.title}</h3>

//         {booking.technology && (
//           <div className="mb-4">
//             <span className="inline-block bg-gray-100 text-xs px-3 py-1 rounded-full font-medium">
//               {booking.technology}
//             </span>
//           </div>
//         )}

//         <div className="space-y-3 mt-auto">
//           <div className="flex items-center text-sm">
//             <Calendar className="w-4 h-4 mr-2 text-gray-500" />
//             <span>{booking.date}</span>
//           </div>

//           <div className="flex items-center text-sm">
//             <Clock className="w-4 h-4 mr-2 text-gray-500" />
//             <span>{booking.time}</span>
//           </div>

//           <div className="font-bold mt-2"> ₹ {booking.price}</div>
//         </div>
//       </div>

//       {/* Card Footer */}
//       <div className="p-4 pt-2 border-t border-gray-200">
//         {type === "upcoming" ? (
//           <Button
//             onClick={navigateToProfile}
//             className="w-full bg-black hover:bg-gray-800 text-white transition-colors"
//           >
//             View Mentor
//           </Button>
//         ) : (
//           <div className="flex flex-col gap-2">
//             {booking.rating ? (
//               <div className="flex items-center mb-2">
//                 <div className="flex">
//                   {[...Array(5)].map((_, i) => (
//                     <svg
//                       key={i}
//                       className={`w-4 h-4 ${
//                         i < booking.rating ? "text-black" : "text-gray-300"
//                       }`}
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                   ))}
//                 </div>
//                 <span className="ml-1 text-xs">{booking.rating}/5</span>
//               </div>
//             ) : (
//               booking.status === "completed" && (
//                 <Button
//                   onClick={onFeedbackClick}
//                   className="w-full bg-white hover:bg-gray-100 text-black border border-black transition-colors"
//                 >
//                   Leave Feedback
//                 </Button>
//               )
//             )}
//             <Button
//               onClick={navigateToProfile}
//               className="w-full bg-black hover:bg-gray-800 text-white transition-colors"
//             >
//               View Mentor
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
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

// Interface definitions
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
  rating?: number;
  feedback?: string;
  serviceType: string;
  oneToOneType?: string | null;
  digitalProductType?: string | null;
}

interface BookingCardProps {
  booking: Booking;
  type: "upcoming" | "completed";
  navigateToProfile?: () => void;
  onFeedbackClick?: () => void;
}

const BookingCard = ({
  booking,
  type,
  navigateToProfile,
  onFeedbackClick,
}: BookingCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDigitalProductModalOpen, setIsDigitalProductModalOpen] =
    useState(false);
  const [isPriorityDMModalOpen, setIsPriorityDMModalOpen] = useState(false);

  // Check if this is a digital document
  const isDigitalDocument = () => {
    const serviceType = booking.serviceType.toLowerCase().replace(/-/g, "");
    return (
      (serviceType === "digitalproducts" || serviceType === "digitalproduct") &&
      booking.digitalProductType === "documents"
    );
  };

  // Check if this is a priority DM
  const isPriorityDM = () => {
    const serviceType = booking.serviceType.toLowerCase().replace(/-/g, "");
    return serviceType === "prioritydm";
  };

  // Handle card click
  const handleCardClick = () => {
    if (isDigitalDocument()) {
      setIsDigitalProductModalOpen(true);
    } else if (isPriorityDM()) {
      setIsPriorityDMModalOpen(true);
    }
  };

  // Display both service type and subtype if available
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
    };

    const statusIcons = {
      confirmed: <CheckCircle className="w-4 h-4 mr-1" />,
      completed: <CheckCircle className="w-4 h-4 mr-1" />,
      cancelled: <XCircle className="w-4 h-4 mr-1" />,
      rescheduled: <Clock className="w-4 h-4 mr-1" />,
    };

    return (
      <div
        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium flex items-center ${
          statusStyles[booking.status]
        }`}
      >
        {statusIcons[booking.status]}
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
        {/* Card Header with Mentor Info */}
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

        {/* Card Body */}
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

        {/* Card Footer */}
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
                booking.status === "completed" &&
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

      {/* Digital Product Modal */}
      {isDigitalDocument() && (
        <DigitalProductModal
          isOpen={isDigitalProductModalOpen}
          onClose={() => setIsDigitalProductModalOpen(false)}
          serviceId={booking.serviceId}
          title={booking.title}
          productType={booking.digitalProductType || "Document"}
        />
      )}

      {/* Priority DM Modal */}
      {isPriorityDM() && (
        <PriorityDMModal
          isOpen={isPriorityDMModalOpen}
          onClose={() => setIsPriorityDMModalOpen(false)}
          serviceId={booking.serviceId}
          title={booking.title}
          productType="Direct Message"
        />
      )}
    </>
  );
};

export default BookingCard;
