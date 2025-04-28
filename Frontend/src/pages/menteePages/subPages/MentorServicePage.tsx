"use client";

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
// import { useAuth } from "@/contexts/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
// Initialize Stripe with the publishable key
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51RI4FgFsFOD99qS8Y20Dtcig0jF0WQONBXTy4GYIqAC9hgXnuCgzLpuEBmJ8YPCgC1D8SNrYFj0lnO2iczlwghcl00efCUTVEX"
);

interface Service {
  _id: string;
  type: string;
  title: string;
  description: string;
  duration: string;
  price: number;
}

interface Mentor {
  _id: string;
  userData: string;
  mentorId: string;
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
}

export default function MentorServicePage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { service, mentor } = location.state || {};
  // const { user, loading } = useAuth();

  const { user, error, loading, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
  const menteeId = user?._id || null;
  useEffect(() => {
    if (loading) return; // Wait for auth check

    if (!user) {
      toast.error("Please log in to book a service.");
      navigate("/login");
      return;
    }

    if (!service || !mentor) {
      console.error("Missing service or mentor data:", { service, mentor });
      toast.error("Service or mentor data is missing.");
      navigate(-1);
    }
  }, [service, mentor, user, loading, navigate]);

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
    toast.success("Booking confirmed!");
    navigate("/seeker/dashboard");
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
          <BookingConfirm onConfirm={handleBookingConfirm} />
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
