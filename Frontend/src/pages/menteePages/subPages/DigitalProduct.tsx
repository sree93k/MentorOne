// import { useState, useEffect } from "react";
// import { ArrowLeft } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import {
//   getTutorialById,
//   checkBookingStatus,
//   createBooking,
// } from "@/services/menteeService";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import PaymentModal from "@/components/modal/PaymentConfirmModal"; // Adjust path as needed

// export default function DigitalProducts() {
//   const { id } = useParams<{ id: string }>();
//   const [tutorial, setTutorial] = useState<any>(null);
//   const [isBooked, setIsBooked] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useSelector((state: RootState) => state.user);

//   useEffect(() => {
//     const fetchTutorialAndBookingStatus = async () => {
//       if (!id) {
//         setError("Tutorial ID is missing");
//         return;
//       }
//       try {
//         const [tutorialData, bookingStatus] = await Promise.all([
//           getTutorialById(id),
//           checkBookingStatus(id),
//         ]);
//         setTutorial(tutorialData);
//         setIsBooked(bookingStatus);
//         console.log(
//           "*******DIgital products >>> Booking status ....",
//           bookingStatus
//         );

//         setError(null);
//       } catch (err: any) {
//         console.error("Failed to fetch data:", err);
//         setError(err.message || "Failed to load tutorial or booking status");
//       }
//     };
//     fetchTutorialAndBookingStatus();
//   }, [id]);

//   useEffect(() => {
//     // Handle payment success redirect
//     const query = new URLSearchParams(location.search);
//     const paymentStatus = query.get("payment");
//     const sessionId = query.get("session_id");
//     if (
//       paymentStatus === "success" &&
//       sessionId &&
//       id &&
//       tutorial &&
//       user?._id
//     ) {
//       const createBookingAfterPayment = async () => {
//         try {
//           await createBooking(id, tutorial.mentorId._id, sessionId);
//           setIsBooked(true);
//           // Clear query params
//           navigate(`/digitalcontent/${id}`, { replace: true });
//         } catch (err: any) {
//           setError(err.message || "Failed to create booking after payment");
//         }
//       };
//       createBookingAfterPayment();
//     } else if (paymentStatus === "cancel") {
//       setError("Payment was cancelled");
//       navigate(`/digitalcontent/${id}`, { replace: true });
//     }
//   }, [location.search, id, tutorial, user, navigate]);

//   const handleEnrollClick = () => {
//     if (!tutorial || !user?._id) {
//       setError("User or tutorial data is missing");
//       return;
//     }
//     setIsPaymentModalOpen(true);
//   };

//   const handleStartLearningClick = () => {
//     navigate(`/seeker/tutorials/${id}`);
//   };

//   const handlePaymentModalClose = () => {
//     setIsPaymentModalOpen(false);
//   };

//   if (error) {
//     return (
//       <div className="flex min-h-screen justify-center items-center">
//         <p className="text-red-500">{error}</p>
//       </div>
//     );
//   }

//   if (!tutorial || !user?._id) {
//     return (
//       <div className="flex min-h-screen justify-center items-center">
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   const mentorName = `${tutorial.mentorId.firstName} ${
//     tutorial.mentorId.lastName || ""
//   }`.trim();
//   const company =
//     tutorial.mentorId.professionalDetails?.company || "Unknown Company";
//   const profilePicture =
//     tutorial.mentorId.profilePicture ||
//     "https://www.svgrepo.com/show/192247/man-user.svg";

//   // Prepare data for PaymentModal
//   const service = {
//     _id: tutorial._id,
//     title: tutorial.title,
//     duration: "30 minutes", // Dummy duration for video tutorials
//     amount: tutorial.amount,
//   };

//   const mentor = {
//     _id: tutorial.mentorId._id,
//     name: mentorName,
//     userData: tutorial.mentorId._id, // Assuming userData is mentor's _id
//   };

//   // Use current date and dummy time for video tutorials
//   const currentDate = new Date().toISOString().split("T")[0]; // e.g., "2025-05-03"
//   const dummyTime = "12:00 PM"; // Matches slotIndex: 1 in PaymentModal

//   return (
//     <div className="flex min-h-screen">
//       <div className="flex-1">
//         <main className="flex p-2 gap-8">
//           <div>
//             <Button
//               variant="ghost"
//               className="pl-0"
//               onClick={() => navigate(-1)}
//             >
//               <ArrowLeft className="h-7 w-7" />
//             </Button>
//           </div>
//           <div className="w-2/3 p-8 pt-2 bg-white">
//             <div className="mb-6 mt-6">
//               <h2 className="text-3xl font-bold mb-2">{tutorial.title}</h2>
//               <div className="flex items-center">
//                 <span className="text-red-500 font-bold mr-1">4.7</span>
//                 <div className="flex">
//                   {[1, 2, 3, 4].map((star) => (
//                     <svg
//                       key={star}
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       fill="gold"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path d="M11.0489 3.92705C11.3483 3.00574 12.6517 3.00574 12.9511 3.92705L14.0206 7.21885C14.1545 7.63087 14.5385 7.90983 14.9717 7.90983H18.4329C19.4016 7.90983 19.8044 9.14945 19.0207 9.71885L16.2205 11.7533C15.87 12.0079 15.7234 12.4593 15.8572 12.8713L16.9268 16.1631C17.2261 17.0844 16.1717 17.8506 15.388 17.2812L12.5878 15.2467C12.2373 14.9921 11.7627 14.9921 11.4122 15.2467L8.61204 17.2812C7.82833 17.8506 6.77385 17.0844 7.0732 16.1631L8.14277 12.8713C8.27665 12.4593 8.12999 12.0079 7.7795 11.7533L4.97933 9.71885C4.19562 9.14945 4.59839 7.90983 5.56712 7.90983H9.02832C9.46154 7.90983 9.8455 7.63087 9.97937 7.21885L11.0489 3.92705Z" />
//                     </svg>
//                   ))}
//                   <svg
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="gold"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path d="M11.0489 3.92705C11.3483 3.00574 12.6517 3.00574 12.9511 3.92705L14.0206 7.21885C14.1545 7.63087 14.5385 7.90983 14.9717 7.90983H18.4329C19.4016 7.90983 19.8044 9.14945 19.0207 9.71885L16.2205 11.7533C15.87 12.0079 15.7234 12.4593 15.8572 12.8713L16.9268 16.1631C17.2261 17.0844 16.1717 17.8506 15.388 17.2812L12.5878 15.2467C12.2373 14.9921 11.7627 14.9921 11.4122 15.2467L8.61204 17.2812C7.82833 17.8506 6.77385 17.0844 7.0732 16.1631L8.14277 12.8713C8.27665 12.4593 8.12999 12.0079 7.7795 11.7533L4.97933 9.71885C4.19562 9.14945 4.59839 7.90983 5.56712 7.90983H9.02832C9.46154 7.90983 9.8455 7.63087 9.97937 7.21885L11.0489 3.92705Z" />
//                   </svg>
//                 </div>
//               </div>
//               <p className="text-gray-700 mt-2">
//                 {tutorial.shortDescription}{" "}
//                 {tutorial.longDescription && (
//                   <button
//                     className="text-blue-600 font-medium"
//                     onClick={() => alert(tutorial.longDescription)}
//                   >
//                     Read More
//                   </button>
//                 )}
//               </p>
//             </div>

//             <div>
//               <h3 className="text-xl font-bold mb-4">Course Content</h3>
//               <Accordion type="single" collapsible className="w-full">
//                 {tutorial.exclusiveContent.map((season: any, index: number) => (
//                   <AccordionItem
//                     key={season._id || index}
//                     value={`season-${season._id || index}`}
//                   >
//                     <AccordionTrigger className="bg-gray-100 p-4 px-8 flex justify-between items-center rounded-md hover:no-underline">
//                       <h1 className="font-medium text-left text-xl">
//                         {season.season}
//                       </h1>
//                     </AccordionTrigger>
//                     <AccordionContent className="mt-4 space-y-4">
//                       {season.episodes.map((episode: any) => (
//                         <div
//                           key={episode._id}
//                           className="flex gap-4 border-b pb-4"
//                         >
//                           <div className="flex-shrink-0 mt-1">
//                             <svg
//                               width="24"
//                               height="24"
//                               viewBox="0 0 24 24"
//                               fill="none"
//                               xmlns="http://www.w3.org/2000/svg"
//                             >
//                               <rect
//                                 width="24"
//                                 height="24"
//                                 rx="4"
//                                 fill="#F1F1F1"
//                               />
//                               <path
//                                 d="M16 12L10 16.5V7.5L16 12Z"
//                                 fill="black"
//                                 stroke="black"
//                                 strokeWidth="1.5"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                               />
//                             </svg>
//                           </div>
//                           <div>
//                             <h5 className="font-medium">
//                               {episode.episode} | {episode.title}
//                             </h5>
//                             <p className="text-sm text-gray-600">
//                               {episode.description}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </AccordionContent>
//                   </AccordionItem>
//                 ))}
//               </Accordion>
//             </div>
//           </div>

//           <div className="w-1/3 p-4 bg-white">
//             <div className="flex flex-col items-center">
//               <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
//                 <img
//                   src={profilePicture}
//                   alt={mentorName}
//                   width={128}
//                   height={128}
//                   className="object-cover"
//                 />
//               </div>
//               <h3 className="text-xl font-bold mb-1">{mentorName}</h3>
//               <p className="text-gray-600 mb-6">{company}</p>

//               <div className="w-full max-w-xs">
//                 <div className="bg-purple-600 rounded-lg p-4 mb-6 flex items-center justify-center">
//                   <div className="relative w-full h-32">
//                     <div className="absolute inset-0">
//                       {Array.from({ length: 10 }).map((_, i) => (
//                         <div
//                           key={i}
//                           className="absolute rounded-full border border-white opacity-20"
//                           style={{
//                             width: `${(i + 1) * 20}px`,
//                             height: `${(i + 1) * 20}px`,
//                             top: "50%",
//                             left: "50%",
//                             transform: "translate(-50%, -50%)",
//                           }}
//                         />
//                       ))}
//                     </div>
//                     <div className="absolute right-0 bottom-0 bg-yellow-300 p-4 rounded-lg">
//                       <span className="text-3xl font-bold">
//                         {tutorial.technology?.slice(0, 2).toUpperCase() || "JS"}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mb-4">
//                   <div className="flex items-center justify-between">
//                     <span className="text-3xl font-bold">
//                       ₹{tutorial.amount}
//                     </span>
//                     <span className="text-gray-500 line-through">
//                       ₹{tutorial.amount + 1800}
//                     </span>
//                   </div>
//                   <div className="text-gray-800 font-medium">
//                     Discount: ₹1800 OFF
//                   </div>
//                 </div>

//                 {isBooked ? (
//                   <Button
//                     className="w-full py-6 text-lg bg-green-700 hover:bg-green-800 text-white rounded-full"
//                     onClick={handleStartLearningClick}
//                   >
//                     Start Learning
//                   </Button>
//                 ) : (
//                   <Button
//                     className="w-full py-6 text-lg bg-black hover:bg-gray-800 text-white rounded-full"
//                     onClick={handleEnrollClick}
//                   >
//                     Enroll Now
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>

//       {tutorial && user?._id && (
//         <PaymentModal
//           isOpen={isPaymentModalOpen}
//           onClose={handlePaymentModalClose}
//           service={service}
//           mentor={mentor}
//           selectedDate={currentDate} // Current date for video tutorials
//           selectedTime={dummyTime} // Dummy time for video tutorials
//           menteeId={user._id}
//         />
//       )}
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Play,
  Star,
  Clock,
  Users,
  Award,
  Crown,
  Sparkles,
  CheckCircle,
  BookOpen,
  Video,
  Target,
  Lock,
  Unlock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getTutorialById,
  checkBookingStatus,
  createBooking,
} from "@/services/menteeService";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import PaymentModal from "@/components/modal/PaymentConfirmModal";
import { ProfilePicture } from "@/components/users/SecureMedia";

export default function DigitalProducts() {
  const { id } = useParams<{ id: string }>();
  const [tutorial, setTutorial] = useState<any>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [hoveredEpisode, setHoveredEpisode] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchTutorialAndBookingStatus = async () => {
      if (!id) {
        setError("Tutorial ID is missing");
        return;
      }
      try {
        const [tutorialData, bookingStatus] = await Promise.all([
          getTutorialById(id),
          checkBookingStatus(id),
        ]);
        setTutorial(tutorialData);
        setIsBooked(bookingStatus);
        console.log(
          "*******DIgital products >>> Booking status ....",
          bookingStatus
        );
        console.log(
          "*******DIgital products >>> tutorialData ....",
          tutorialData
        );

        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError(err.message || "Failed to load tutorial or booking status");
      }
    };
    fetchTutorialAndBookingStatus();
  }, [id]);

  useEffect(() => {
    // Handle payment success redirect
    const query = new URLSearchParams(location.search);
    const paymentStatus = query.get("payment");
    const sessionId = query.get("session_id");
    if (
      paymentStatus === "success" &&
      sessionId &&
      id &&
      tutorial &&
      user?._id
    ) {
      const createBookingAfterPayment = async () => {
        try {
          await createBooking(id, tutorial.mentorId._id, sessionId);
          setIsBooked(true);
          // Clear query params
          navigate(`/digitalcontent/${id}`, { replace: true });
        } catch (err: any) {
          setError(err.message || "Failed to create booking after payment");
        }
      };
      createBookingAfterPayment();
    } else if (paymentStatus === "cancel") {
      setError("Payment was cancelled");
      navigate(`/digitalcontent/${id}`, { replace: true });
    }
  }, [location.search, id, tutorial, user, navigate]);

  const handleEnrollClick = () => {
    if (!tutorial || !user?._id) {
      setError("User or tutorial data is missing");
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handleStartLearningClick = () => {
    navigate(`/seeker/tutorials/${id}`);
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Error Loading Course
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={() => navigate(-1)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl"
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tutorial || !user?._id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">
                Loading course details...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const mentorName = `${tutorial.mentorId.firstName} ${
    tutorial.mentorId.lastName || ""
  }`.trim();
  const company =
    tutorial.mentorId.professionalDetails?.company || "Tech Professional";
  const profilePicture =
    tutorial.mentorId.profilePicture ||
    "https://www.svgrepo.com/show/192247/man-user.svg";

  // Prepare data for PaymentModal
  const service = {
    _id: tutorial._id,
    title: tutorial.title,
    duration: "Lifetime Access",
    amount: tutorial.amount,
    type: "DigitalProducts",
  };

  const mentor = {
    _id: tutorial.mentorId._id,
    name: mentorName,
    userData: tutorial.mentorId._id,
  };

  // Use current date and dummy time for video tutorials
  const currentDate = new Date().toISOString().split("T")[0];
  const dummyTime = "12:00 PM";

  // Calculate total episodes
  const totalEpisodes =
    tutorial.exclusiveContent?.reduce(
      (acc: number, season: any) => acc + (season.episodes?.length || 0),
      0
    ) || 0;

  // Get badge configuration
  const getBadgeConfig = (type: string) => {
    const configs = {
      premium: {
        gradient: "bg-gradient-to-r from-purple-500 to-blue-500",
        icon: <Crown className="w-3 h-3" />,
        label: "Premium Course",
      },
      bestseller: {
        gradient: "bg-gradient-to-r from-orange-500 to-red-500",
        icon: <Award className="w-3 h-3" />,
        label: "Bestseller",
      },
      new: {
        gradient: "bg-gradient-to-r from-green-500 to-emerald-500",
        icon: <Sparkles className="w-3 h-3" />,
        label: "New Course",
      },
    };
    return configs.premium; // Default to premium
  };

  const badgeConfig = getBadgeConfig("premium");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="relative z-10 -ml-6  ">
        <button
          className=" group flex h-12 w-12 items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-blue-600 hover:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-8 py-8 -mt-16">
        {/* Back Button */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <Card className="border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge
                        className={`${badgeConfig.gradient} text-white border-0 px-4 py-2 rounded-full font-semibold`}
                      >
                        <span className="flex items-center gap-1">
                          {badgeConfig.icon}
                          {badgeConfig.label}
                        </span>
                      </Badge>
                      <Badge className="bg-white/20 text-white border-0 px-3 py-1 rounded-full text-sm">
                        <Video className="w-3 h-3 mr-1" />
                        Video Course
                      </Badge>
                    </div>

                    <h1 className="text-4xl font-bold mb-4">
                      {tutorial.title}
                    </h1>

                    <div className="flex items-center gap-6 mb-6">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < 4
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-white/30"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-bold">4.7</span>
                        <span className="text-white/80">(2 reviews)</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>3 students</span>
                      </div>
                    </div>

                    <p className="text-white/90 text-lg leading-relaxed">
                      {tutorial.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="p-6 bg-gray-50 border-b border-gray-100">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                      <BookOpen className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">
                        {tutorial.exclusiveContent?.length || 0}
                      </p>
                      <p className="text-sm text-gray-600">Seasons</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                      <Video className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">
                        {totalEpisodes}
                      </p>
                      <p className="text-sm text-gray-600">Episodes</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                      <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">20+</p>
                      <p className="text-sm text-gray-600">Hours</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                      <Target className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">∞</p>
                      <p className="text-sm text-gray-600">Lifetime</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {tutorial.longDescription && (
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      About This Course
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {tutorial.longDescription}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Course Content */}
            <Card className="border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  Course Content
                </CardTitle>
                <p className="text-gray-600">
                  {tutorial.exclusiveContent?.length || 0} seasons •{" "}
                  {totalEpisodes} episodes • 20+ hours of content
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <Accordion
                  type="single"
                  collapsible
                  className="w-full space-y-4"
                >
                  {tutorial.exclusiveContent?.map(
                    (season: any, seasonIndex: number) => (
                      <AccordionItem
                        key={season._id || seasonIndex}
                        value={`season-${season._id || seasonIndex}`}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <AccordionTrigger className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 hover:no-underline hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 transition-all duration-200">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                              <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                              <h4 className="text-lg font-bold text-gray-900">
                                {season.season}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {season.episodes?.length || 0} episodes
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 py-4 bg-white">
                          <div className="space-y-3">
                            {season.episodes?.map(
                              (episode: any, episodeIndex: number) => (
                                <div
                                  key={episode._id || episodeIndex}
                                  className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-200 cursor-pointer ${
                                    isBooked
                                      ? "hover:bg-green-50 border border-green-200"
                                      : "hover:bg-gray-50 border border-gray-200"
                                  }`}
                                  onMouseEnter={() =>
                                    setHoveredEpisode(episode._id)
                                  }
                                  onMouseLeave={() => setHoveredEpisode(null)}
                                >
                                  <div
                                    className={`p-3 rounded-xl transition-all duration-200 ${
                                      isBooked
                                        ? "bg-green-100 group-hover:bg-green-200"
                                        : "bg-gray-100 group-hover:bg-purple-100"
                                    }`}
                                  >
                                    {isBooked ? (
                                      <Play
                                        className={`w-5 h-5 ${
                                          hoveredEpisode === episode._id
                                            ? "text-green-700"
                                            : "text-green-600"
                                        }`}
                                      />
                                    ) : (
                                      <Lock className="w-5 h-5 text-gray-500" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h5 className="font-semibold text-gray-900">
                                        {episode.episode}
                                      </h5>
                                      <span className="text-gray-400">•</span>
                                      <h5 className="font-semibold text-gray-900">
                                        {episode.title}
                                      </h5>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                      {episode.description}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-500">
                                      15 min
                                    </span>
                                    {isBooked && (
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                    )}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  )}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Instructor Card */}
              <Card className="border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
                <CardHeader className="flex flex- bg-gradient-to-r from-blue-50 to-purple-100 border-b border-gray-200">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    Your Instructor
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="relative mb-4">
                      <div className="w-44 h-44 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <ProfilePicture
                          profilePicture={profilePicture}
                          userName={mentor.name}
                          size="xl"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-500 to-blue-500 p-1.5 rounded-full">
                        <Award className="w-3 h-3 text-white" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {mentorName}
                    </h3>
                    <p className="text-gray-600 mb-4">{company}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          4.8
                        </div>
                        <div className="text-gray-500">Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          12K
                        </div>
                        <div className="text-gray-500">Students</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Card */}
              <Card className="border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  {/* Technology Badge */}
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-4 mb-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute rounded-full border border-white opacity-10"
                          style={{
                            width: `${(i + 1) * 30}px`,
                            height: `${(i + 1) * 30}px`,
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      ))}
                    </div>
                    <div className="relative z-10">
                      <div className="bg-yellow-400 text-black font-bold text-xl px-4 py-2 rounded-lg inline-block">
                        {tutorial.technology?.slice(0, 2).toUpperCase() || "JS"}
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                          ₹{tutorial.amount}
                        </span>
                        <Badge className="bg-green-100 text-green-800 border-0 text-xs">
                          Best Price
                        </Badge>
                      </div>
                      <span className="text-gray-500 line-through text-lg">
                        ₹{tutorial.amount + 1800}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        SAVE ₹1800
                      </div>
                      <span className="text-sm text-gray-600">
                        Limited time offer!
                      </span>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200 mb-4">
                      <div className="flex items-center gap-2 text-green-700 text-sm font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        <span>Lifetime Access Included</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  {isBooked ? (
                    <Button
                      className="w-full py-4 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
                      onClick={handleStartLearningClick}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Learning
                    </Button>
                  ) : (
                    <Button
                      className="w-full py-4 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
                      onClick={handleEnrollClick}
                    >
                      <Crown className="w-5 h-5 mr-2" />
                      Enroll Now
                    </Button>
                  )}

                  {/* Features */}
                  <div className="mt-6 space-y-3">
                    {[
                      {
                        icon: <Unlock className="w-4 h-4" />,
                        text: "Lifetime access",
                      },
                      {
                        icon: <Video className="w-4 h-4" />,
                        text: "HD video content",
                      },
                      {
                        icon: <Award className="w-4 h-4" />,
                        text: "Certificate of completion",
                      },
                      {
                        icon: <Users className="w-4 h-4" />,
                        text: "Community access",
                      },
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 text-sm text-gray-600"
                      >
                        <div className="text-purple-600">{feature.icon}</div>
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {tutorial && user?._id && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={handlePaymentModalClose}
          service={service}
          mentor={mentor}
          selectedDate={currentDate}
          selectedTime={dummyTime}
          selectedSlotIndex={0}
          menteeId={user._id}
        />
      )}
    </div>
  );
}
