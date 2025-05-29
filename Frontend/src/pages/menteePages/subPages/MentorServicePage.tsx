import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookingDetails from "@/components/mentee/BookingDetails";
import PaymentModal from "@/components/modal/PaymentConfirmModal";
import BookingConfirm from "@/components/mentee/BookingConfirm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { verifySession } from "@/services/paymentServcie";
import { log } from "util";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function MentorServicePage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { service, mentor } = location.state || {};
  const { user, error, loading, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
  const menteeId = user?._id || null;

  useEffect(() => {
    if (loading) return;
    console.log("^^^^^^^^^^^^^^^^^^^^^^mentor DETIAILS", mentor);

    if (!user || !isAuthenticated) {
      toast.error("Please log in to book a service.");
      navigate("/login");
      return;
    }

    if (!service || !mentor) {
      console.error("Missing service or mentor data:", { service, mentor });
      toast.error("Service or mentor data is missing.");
      navigate(-1);
    }
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

  const handleBookingConfirm = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
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
        <div className="flex-[2] p-4">
          <BookingDetails
            onConfirmClick={handleConfirmClick}
            service={service}
            mentor={mentor}
          />
        </div>
        <div className="flex-1 p-4">
          <BookingConfirm onConfirm={handleBookingConfirm} mentor={mentor} />
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
            menteeId={menteeId}
          />
        </Elements>
      )}
    </div>
  );
}
