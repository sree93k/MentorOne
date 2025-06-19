import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookingDetails from "@/components/mentee/BookingDetails";
import PaymentModal from "@/components/modal/PaymentConfirmModal";
import BookingConfirm from "@/components/mentee/BookingConfirm";
import { ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { verifySession } from "@/services/paymentServcie";
import { getMentorServiceTestimonials } from "@/services/testimonialService";

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
    return <div>Loading...</div>;
  }

  if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
    console.error(
      "Stripe publishable key is missing in environment variables."
    );
    return (
      <div>
        Error: Payment system is not configured. Please try again later.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div>
        <Button variant="ghost" className="pl-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-7 w-7" />
        </Button>
      </div>
      <div className="flex-1 flex flex-row justify-between gap-10 max-w-7xl mx-auto p-4">
        <div className="flex-[2] p-0">
          <BookingDetails
            onConfirmClick={handleConfirmClick}
            service={service}
            mentor={mentor}
          />

          <div className="bg-gray-50 p-4 rounded-lg mt-6">
            <h3 className="font-medium mb-4">Testimonials</h3>
            {isLoadingTestimonials ? (
              <p>Loading testimonials...</p>
            ) : testimonials.length ? (
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
                {testimonials.map((testimonial) => (
                  <TestimonialCard
                    key={testimonial._id}
                    testimonial={testimonial}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg p-6 animate-fade-in shadow-sm">
                <div className="relative mb-4">
                  <Star className="w-16 h-16 text-gray-400 animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 border-2 border-gray-200 rounded-full animate-pulse opacity-50"></div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  No Testimonials Yet
                </h3>
                <p className="text-sm text-gray-500 mt-2 max-w-sm text-center">
                  Be the first to book this service and share your experience!
                </p>
                <Button
                  variant="outline"
                  className="mt-4 bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
                  onClick={() => navigate("/seeker/mentors")}
                >
                  Explore Other Mentors
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 p-0">
          <BookingConfirm
            onConfirm={handleBookingConfirm}
            mentor={mentor}
            service={service}
          />
        </div>
      </div>
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
    </div>
  );
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-1">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>
      <p className="text-gray-700 mb-4">{testimonial.comment}</p>
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-gray-900">
            {`${testimonial.menteeId.firstName} ${testimonial.menteeId.lastName}`}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(testimonial.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span className="px-3 py-1 bg-gray-100 text-sm rounded-full text-gray-600">
          {testimonial.serviceId.type}
        </span>
      </div>
    </div>
  );
}
