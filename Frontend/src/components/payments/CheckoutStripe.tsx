"use client";

import React from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { createCheckoutSession } from "@/services/userServices";

interface CheckoutButtonProps {
  serviceId: string;
  mentorId: string;
  menteeId: string;
  amount: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  day: string;
  slotIndex: number;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  serviceId,
  mentorId,
  menteeId,
  amount,
  bookingDate,
  startTime,
  endTime,
  day,
  slotIndex,
}) => {
  const stripe = useStripe();

  const handleCheckout = async () => {
    if (!stripe) {
      toast.error("Stripe.js has not loaded.");
      return;
    }

    try {
      const response = await createCheckoutSession({
        serviceId,
        mentorId,
        menteeId,
        amount,
        bookingDate,
        startTime,
        endTime,
        day,
        slotIndex,
      });

      const { id } = response.data;
      if (!id) {
        throw new Error("Failed to create checkout session");
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: id,
      });

      if (error) {
        toast.error(error.message || "Checkout failed");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during checkout");
      console.error("Checkout error:", error);
    }
  };

  return (
    <Button
      variant="default"
      className="rounded-full bg-black text-white"
      onClick={handleCheckout}
      disabled={!stripe}
    >
      Pay with Stripe Checkout
    </Button>
  );
};

export default CheckoutButton;
