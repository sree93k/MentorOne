"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DummyImage from "@/assets/DummyProfile.jpg";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createPaymentIntent, saveBooking } from "@/services/paymentServcie";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

// Initialize Stripe
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
  name: string;
  profileImage?: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  service: Service;
  mentor: Mentor;
  selectedDate: string | null;
  selectedTime: string | null;
  menteeId: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onConfirm,
  service,
  mentor,
  selectedDate,
  selectedTime,
  menteeId,
}: PaymentModalProps) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: `${user.firstName} ${user.lastName}` || "",
        email: user.email || "",
        phone: user.phone || "", // Adjust based on your user object
      });
    }
  }, [user]);

  const platformCharge = Math.round(service.price * 0.15);
  const totalAmount = service.price + platformCharge;

  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  const parseTime = (time: string) => {
    const [hours, minutes] = time
      .replace(" AM", "")
      .replace(" PM", "")
      .split(":")
      .map(Number);
    const isPM = time.includes("PM");
    const adjustedHours =
      isPM && hours !== 12 ? hours + 12 : !isPM && hours === 12 ? 0 : hours;
    return { hours: adjustedHours, minutes };
  };

  const calculateEndTime = (
    startTime: string,
    duration: string | undefined
  ) => {
    if (!duration || typeof duration !== "string") {
      return "N/A"; // Fallback if duration is invalid
    }

    const match = duration.match(/^(\d+)\s*minutes?$/i); // Match "30 minutes" or "30 minute"
    if (!match) {
      return "N/A"; // Fallback if duration format is invalid
    }

    const durationMinutes = parseInt(match[1], 10);
    const { hours, minutes } = parseTime(startTime);
    const totalMinutes = minutes + durationMinutes;
    const newHours = Math.floor(totalMinutes / 60) + hours;
    const newMinutes = totalMinutes % 60;
    return `${newHours.toString().padStart(2, "0")}:${newMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  const startTime = selectedTime
    ? parseTime(selectedTime).hours.toString().padStart(2, "0") +
      ":" +
      parseTime(selectedTime).minutes.toString().padStart(2, "0")
    : "N/A";
  const endTime =
    selectedTime && service.duration
      ? calculateEndTime(selectedTime, service.duration)
      : "N/A";

  const timeToSlotIndex = (time: string) => {
    const slots = ["10:00 AM", "12:00 PM", "3:00 PM"];
    return slots.indexOf(time); // Returns 0, 1, or 2, or -1 if not found
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      toast.error("Stripe.js has not loaded.");
      return;
    }

    if (!service._id || !mentor._id) {
      toast.error("Service or mentor ID is missing.");
      return;
    }

    setLoading(true);
    setCardError(null);

    try {
      const slotIndex = selectedTime ? timeToSlotIndex(selectedTime) : -1;
      if (slotIndex === -1) {
        throw new Error("Invalid time slot selected.");
      }

      const paymentResponse = await createPaymentIntent({
        amount: totalAmount,
        serviceId: service._id,
        mentorId: mentor._id,
        menteeId,
        bookingDate: selectedDate || "",
        startTime,
        endTime,
        day: selectedDate
          ? new Date(selectedDate)
              .toLocaleDateString("en-US", { weekday: "long" })
              .toLowerCase()
          : "",
        slotIndex,
      });

      if (!paymentResponse?.data?.clientSecret) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret } = paymentResponse.data;

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
            },
          },
        }
      );

      if (error) {
        setCardError(error.message || "Payment failed");
        toast.error(error.message || "Payment failed");
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        const bookingResponse = await saveBooking({
          serviceId: service._id,
          mentorId: mentor._id,
          menteeId,
          bookingDate: selectedDate || "",
          startTime,
          endTime,
          day: selectedDate
            ? new Date(selectedDate)
                .toLocaleDateString("en-US", { weekday: "long" })
                .toLowerCase()
            : "",
          slotIndex,
          paymentIntentId: paymentIntent.id,
          amount: totalAmount,
        });

        if (bookingResponse?.data?.booking && bookingResponse?.data?.payment) {
          toast.success("Booking confirmed successfully!");
          onConfirm();
          navigate("/seeker/dashboard");
        } else {
          throw new Error("Failed to save booking");
        }
      }
    } catch (error) {
      setCardError(
        (error as { message?: string })?.message || "An error occurred"
      );
      toast.error(
        (error as { message?: string })?.message || "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-black text-white rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Confirm Payment
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center mb-1">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
            <img
              src={mentor.profileImage || DummyImage}
              alt={mentor.name}
              className="w-auto h-10"
            />
          </div>
          <div>
            <h1 className="text-sm">{mentor.name}</h1>
            <h2 className="text-xl font-bold">{service.title}</h2>
          </div>
        </div>

        <div className="flex text-sm gap-2">
          <span>{service.duration} Meeting</span>
          <span>|</span>
          <span>At {selectedTime || "N/A"}</span>
          <span>|</span>
          <span>{formattedDate}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              className="bg-white border-white text-black"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className="bg-white border-white text-black"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              className="bg-white border-white text-black"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label>Card Details</Label>
            <CardElement
              className="bg-white border-white text-black p-2 rounded"
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#000",
                    "::placeholder": { color: "#aab7c4" },
                  },
                  invalid: { color: "#9e2146" },
                },
              }}
            />
            {cardError && (
              <p className="text-red-500 text-sm mt-1">{cardError}</p>
            )}
          </div>

          <div className="bg-white text-black rounded-lg p-4">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{service.title}</span>
                <span>₹{service.price}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Charge</span>
                <span>₹{platformCharge}</span>
              </div>
              <div className="h-px bg-gray-200 my-2"></div>
              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between gap-6 px-10">
            <Button
              variant="outline"
              className="flex-1 rounded-full border-gray-400 flex items-center justify-center gap-2"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="flex-1 rounded-full bg-white text-black"
              type="submit"
              disabled={loading || !stripe || !elements}
            >
              {loading ? "Processing..." : "Confirm And Pay"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
