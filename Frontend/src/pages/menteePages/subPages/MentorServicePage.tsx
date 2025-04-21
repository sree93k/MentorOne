"use client";

import { useState } from "react";
import BookingDetails from "@/components/mentee/BookingDetails";
import PaymentModal from "@/components/modal/PaymentConfirmModal";
import BookingConfirm from "@/components/mentee/BookingConfirm";
// import BookingModal from "@/components/mentee/BookingModal";
import { Search, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
export default function MentorServicePage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();
  const handleConfirmClick = () => {
    // Placeholder for BookingDetails button (e.g., could open BookingModal)
    console.log("BookingDetails Confirm clicked");
  };

  const handleBookingConfirm = () => {
    setShowPaymentModal(true); // Open PaymentModal
  };

  const handlePaymentConfirm = () => {
    setShowPaymentModal(false); // Close PaymentModal
    // Handle final booking confirmation logic here
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div>
        <Button variant="ghost" className="pl-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-7 w-7 " />
        </Button>
      </div>
      <div className="flex-1 flex flex-row justify-between gap-10 max-w-7xl mx-auto p-4">
        {/* Booking Details */}
        <div className="flex-[2]  p-4">
          <BookingDetails onConfirmClick={handleConfirmClick} />
        </div>
        {/* Booking Confirm (Date/Time Selection) */}
        <div className="flex-1  p-4">
          <BookingConfirm onConfirm={handleBookingConfirm} />
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onConfirm={handlePaymentConfirm}
        />
      )}
    </div>
  );
}
