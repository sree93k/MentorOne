// import { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import BookingDetails from "@/components/mentee/BookingDetails";
// import PaymentModal from "@/components/modal/PaymentConfirmModal";
// import BookingConfirm from "@/components/mentee/BookingConfirm";
// import { ArrowLeft, Star } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { toast } from "react-hot-toast";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import { verifySession } from "@/services/paymentServcie";
// import { getMentorServiceTestimonials } from "@/services/testimonialService";
// import { useSearchParams } from "react-router-dom";

// import PaymentStatusModal from "@/components/modal/PaymentStatusModal";
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// interface Testimonial {
//   _id: string;
//   menteeId: { firstName: string; lastName: string };
//   mentorId: string;
//   serviceId: { title: string; type: string };
//   bookingId: string;
//   comment: string;
//   rating: number;
//   createdAt: string;
//   updatedAt: string;
// }

// export default function MentorServicePage() {
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [selectedDate, setSelectedDate] = useState<string | null>(null);
//   const [selectedTime, setSelectedTime] = useState<string | null>(null);
//   const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(
//     null
//   );
//   const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
//   const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { service, mentor } = location.state || {};
//   const { user, error, loading, isAuthenticated } = useSelector(
//     (state: RootState) => state.user
//   );
//   const menteeId = user?._id || null;
//   const [searchParams, setSearchParams] = useSearchParams();
//   const status = searchParams.get("status");
//   const [showModal, setShowModal] = useState(false);
//   useEffect(() => {
//     if (loading) return;
//     console.log("^^^^^^^^^^^^^^^^^^^^^^mentor DETAILS", mentor);

//     if (!user || !isAuthenticated) {
//       toast.error("Please log in to book a service.");
//       navigate("/login");
//       return;
//     }

//     if (!service || !mentor) {
//       console.error("Missing service or mentor data:", { service, mentor });
//       toast.error("Service or mentor data is missing.");
//       navigate(-1);
//       return;
//     }

//     // Fetch testimonials
//     const fetchTestimonials = async () => {
//       setIsLoadingTestimonials(true);
//       try {
//         const response = await getMentorServiceTestimonials(
//           mentor.userData,
//           service._id
//         );
//         setTestimonials(response.testimonials);
//       } catch (error: any) {
//         console.error("Failed to fetch testimonials:", error);
//         toast.error("Failed to load testimonials.");
//       } finally {
//         setIsLoadingTestimonials(false);
//       }
//     };
//     fetchTestimonials();
//   }, [service, mentor, user, loading, isAuthenticated, navigate]);

//   useEffect(() => {
//     const verifyBooking = async () => {
//       const params = new URLSearchParams(location.search);
//       const sessionId = params.get("session_id");
//       if (sessionId) {
//         try {
//           const response = await verifySession(sessionId);
//           if (response.bookingId) {
//             toast.success("Payment successful! Booking confirmed.");
//             navigate("/seeker/bookings");
//           } else {
//             toast.error("Booking creation failed. Please contact support.");
//           }
//         } catch (error: any) {
//           console.error("Error verifying session:", error);
//           toast.error(
//             error.message || "Payment failed or booking not created."
//           );
//         }
//       }
//     };

//     verifyBooking();
//   }, [location, navigate]);
//   useEffect(() => {
//     if (status === "cancel") {
//       setShowModal(true);
//     }
//   }, [status]);

//   const handleModalClose = () => {
//     setShowModal(false);
//     searchParams.delete("status");
//     searchParams.delete("session_id");
//     setSearchParams(searchParams);
//   };

//   const handleRetry = () => {
//     // Retry logic — maybe take from localStorage or re-initiate booking
//     searchParams.delete("status");
//     searchParams.delete("session_id");
//     setSearchParams(searchParams);
//     window.location.reload(); // or open your checkout session again
//   };

//   const handleConfirmClick = () => {
//     console.log("BookingDetails Confirm clicked");
//   };

//   const handleBookingConfirm = (
//     date: string,
//     time: string,
//     slotIndex: number
//   ) => {
//     setSelectedDate(date);
//     setSelectedTime(time);
//     setSelectedSlotIndex(slotIndex);
//     setShowPaymentModal(true);
//   };

//   const handlePaymentConfirm = () => {
//     setShowPaymentModal(false);
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
//     console.error(
//       "Stripe publishable key is missing in environment variables."
//     );
//     return (
//       <div>
//         Error: Payment system is not configured. Please try again later.
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen bg-white">
//       <div>
//         <Button variant="ghost" className="pl-2" onClick={() => navigate(-1)}>
//           <ArrowLeft className="h-7 w-7" />
//         </Button>
//       </div>
//       <div className="flex-1 flex flex-row justify-between gap-10 max-w-7xl mx-auto p-4">
//         <div className="flex-[2] p-0">
//           <BookingDetails
//             onConfirmClick={handleConfirmClick}
//             service={service}
//             mentor={mentor}
//           />

//           <div className="bg-gray-50 p-4 rounded-lg mt-6">
//             <h3 className="font-medium mb-4">Testimonials</h3>
//             {isLoadingTestimonials ? (
//               <p>Loading testimonials...</p>
//             ) : testimonials.length ? (
//               <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
//                 {testimonials.map((testimonial) => (
//                   <TestimonialCard
//                     key={testimonial._id}
//                     testimonial={testimonial}
//                   />
//                 ))}
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg p-6 animate-fade-in shadow-sm">
//                 <div className="relative mb-4">
//                   <Star className="w-16 h-16 text-gray-400 animate-pulse" />
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <div className="w-20 h-20 border-2 border-gray-200 rounded-full animate-pulse opacity-50"></div>
//                   </div>
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
//                   No Testimonials Yet
//                 </h3>
//                 <p className="text-sm text-gray-500 mt-2 max-w-sm text-center">
//                   Be the first to book this service and share your experience!
//                 </p>
//                 <Button
//                   variant="outline"
//                   className="mt-4 bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
//                   onClick={() => navigate("/seeker/mentors")}
//                 >
//                   Explore Other Mentors
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>
//         <div className="flex-1 p-0">
//           <BookingConfirm
//             onConfirm={handleBookingConfirm}
//             mentor={mentor}
//             service={service}
//           />
//         </div>
//       </div>
//       {showPaymentModal && service && mentor && menteeId && (
//         <Elements stripe={stripePromise}>
//           <PaymentModal
//             isOpen={showPaymentModal}
//             onClose={() => setShowPaymentModal(false)}
//             onConfirm={handlePaymentConfirm}
//             service={service}
//             mentor={mentor}
//             selectedDate={selectedDate}
//             selectedTime={selectedTime}
//             selectedSlotIndex={selectedSlotIndex}
//             menteeId={menteeId}
//           />
//         </Elements>
//       )}
//       <PaymentStatusModal
//         isOpen={showModal}
//         status="failure"
//         onCancel={handleModalClose}
//         onRetry={handleRetry}
//       />
//     </div>
//   );
// }

// interface TestimonialCardProps {
//   testimonial: Testimonial;
// }

// function TestimonialCard({ testimonial }: TestimonialCardProps) {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 relative">
//       <div className="flex justify-between items-start mb-4">
//         <div className="flex items-center space-x-1">
//           {[...Array(testimonial.rating)].map((_, i) => (
//             <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
//           ))}
//         </div>
//       </div>
//       <p className="text-gray-700 mb-4">{testimonial.comment}</p>
//       <div className="flex justify-between items-center">
//         <div>
//           <p className="font-semibold text-gray-900">
//             {`${testimonial.menteeId.firstName} ${testimonial.menteeId.lastName}`}
//           </p>
//           <p className="text-sm text-gray-500">
//             {new Date(testimonial.createdAt).toLocaleDateString()}
//           </p>
//         </div>
//         <span className="px-3 py-1 bg-gray-100 text-sm rounded-full text-gray-600">
//           {testimonial.serviceId.type}
//         </span>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookingDetails from "@/components/mentee/BookingDetails";
import PaymentModal from "@/components/modal/PaymentConfirmModal";
import BookingConfirm from "@/components/mentee/BookingConfirm";
import { ArrowLeft, Star, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { verifySession } from "@/services/paymentServcie";
import { getMentorServiceTestimonials } from "@/services/testimonialService";
import { useSearchParams } from "react-router-dom";
import PaymentStatusModal from "@/components/modal/PaymentStatusModal";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface Testimonial {
  _id: string;
  menteeId: { firstName: string; lastName: string };
  mentorId: string;
  serviceId: { title: string; type: string };
  bookingId: string;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export default function MentorServicePage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(
    null
  );
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { service, mentor } = location.state || {};
  const { user, error, loading, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
  const menteeId = user?._id || null;
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (loading) return;
    console.log("^^^^^^^^^^^^^^^^^^^^^^mentor DETAILS", mentor);

    if (!user || !isAuthenticated) {
      toast.error("Please log in to book a service.");
      navigate("/login");
      return;
    }

    if (!service || !mentor) {
      console.error("Missing service or mentor data:", { service, mentor });
      toast.error("Service or mentor data is missing.");
      navigate(-1);
      return;
    }

    // Fetch testimonials
    const fetchTestimonials = async () => {
      setIsLoadingTestimonials(true);
      try {
        const response = await getMentorServiceTestimonials(
          mentor.userData,
          service._id
        );
        setTestimonials(response.testimonials);
      } catch (error: any) {
        console.error("Failed to fetch testimonials:", error);
        toast.error("Failed to load testimonials.");
      } finally {
        setIsLoadingTestimonials(false);
      }
    };
    fetchTestimonials();
  }, [service, mentor, user, loading, isAuthenticated, navigate]);

  useEffect(() => {
    const verifyBooking = async () => {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get("session_id");
      if (sessionId) {
        try {
          const response = await verifySession(sessionId);
          if (response.bookingId) {
            toast.success("Payment successful! Booking confirmed.");
            navigate("/seeker/bookings");
          } else {
            toast.error("Booking creation failed. Please contact support.");
          }
        } catch (error: any) {
          console.error("Error verifying session:", error);
          toast.error(
            error.message || "Payment failed or booking not created."
          );
        }
      }
    };

    verifyBooking();
  }, [location, navigate]);

  useEffect(() => {
    if (status === "cancel") {
      setShowModal(true);
    }
  }, [status]);

  const handleModalClose = () => {
    setShowModal(false);
    searchParams.delete("status");
    searchParams.delete("session_id");
    setSearchParams(searchParams);
  };

  const handleRetry = () => {
    searchParams.delete("status");
    searchParams.delete("session_id");
    setSearchParams(searchParams);
    window.location.reload();
  };

  const handleConfirmClick = () => {
    console.log("BookingDetails Confirm clicked");
  };

  const handleBookingConfirm = (
    date: string,
    time: string,
    slotIndex: number
  ) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setSelectedSlotIndex(slotIndex);
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = () => {
    setShowPaymentModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">
                Loading service details...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
    console.error(
      "Stripe publishable key is missing in environment variables."
    );
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Payment System Error
              </h3>
              <p className="text-gray-600 mb-4">
                Payment system is not configured. Please try again later.
              </p>
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

  const calculateAverageRating = () => {
    if (!testimonials.length) return 0;
    const total = testimonials.reduce(
      (sum, testimonial) => sum + testimonial.rating,
      0
    );
    return (total / testimonials.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="relative  -ml-6  ">
        <button
          className=" group flex h-12 w-12 items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-blue-600 hover:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-10 py-1 -mt-8">
        {/* Header */}

        {/* Page Title */}
        <div className=" mb-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Book Your Session
          </h1>
          <p className="text-gray-600">
            Choose your preferred time and complete your booking
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-8">
          {/* Left Column - Service Details */}
          <div className="lg:col-span-5 space-y-6">
            <BookingDetails
              onConfirmClick={handleConfirmClick}
              service={service}
              mentor={mentor}
            />

            {/* Testimonials Section */}
            <Card className="border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-gray-100">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  Student Reviews
                  {testimonials.length > 0 && (
                    <div className="flex items-center gap-2 ml-auto">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(Number(calculateAverageRating()))
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-gray-900">
                        {calculateAverageRating()}
                      </span>
                      <span className="text-gray-500">
                        ({testimonials.length})
                      </span>
                    </div>
                  )}
                </CardTitle>
                <p className="text-gray-600">
                  What students say about this service
                </p>
              </CardHeader>
              <CardContent className="p-6">
                {isLoadingTestimonials ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading reviews...</p>
                    </div>
                  </div>
                ) : testimonials.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testimonials.map((testimonial, index) => (
                      <TestimonialCard
                        key={testimonial._id}
                        testimonial={testimonial}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mb-4">
                      <Star className="w-10 h-10 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No Reviews Yet
                    </h3>
                    <p className="text-gray-600 text-center max-w-sm mb-6">
                      Be the first to book this service and share your
                      experience!
                    </p>
                    <Button
                      onClick={() => navigate("/seeker/mentors")}
                      className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-xl"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Explore Other Mentors
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Confirmation */}
          <div className="lg:col-span-3">
            <div className="sticky top-8">
              <BookingConfirm
                onConfirm={handleBookingConfirm}
                mentor={mentor}
                service={service}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && service && mentor && menteeId && (
        <Elements stripe={stripePromise}>
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            onConfirm={handlePaymentConfirm}
            service={service}
            mentor={mentor}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedSlotIndex={selectedSlotIndex}
            menteeId={menteeId}
          />
        </Elements>
      )}

      {/* Payment Status Modal */}
      <PaymentStatusModal
        isOpen={showModal}
        status="failure"
        onCancel={handleModalClose}
        onRetry={handleRetry}
      />
    </div>
  );
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  return (
    <Card
      className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-6">
        {/* Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200 text-xs"
          >
            {testimonial.serviceId.type}
          </Badge>
        </div>

        {/* Comment */}
        <p className="text-gray-700 mb-4 leading-relaxed italic">
          "{testimonial.comment}"
        </p>

        {/* Author Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {testimonial.menteeId.firstName.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {`${testimonial.menteeId.firstName} ${testimonial.menteeId.lastName}`}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(testimonial.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-sm font-bold text-gray-900">
                {testimonial.rating}.0
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
