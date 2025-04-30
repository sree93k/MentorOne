import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CardElement,
  PaymentRequestButtonElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { saveBooking } from "@/services/paymentServcie";

interface PaymentFormProps {
  service: { _id: string; title: string; amount: number };
  mentor: { _id: string; name: string };
  selectedDate: string;
  selectedTime: string;
  menteeId: string;
  clientSecret: string;
  paymentIntentId: string;
  onClose: () => void;
}

export default function PaymentForm({
  service,
  mentor,
  selectedDate,
  selectedTime,
  menteeId,
  clientSecret,
  paymentIntentId,
  onClose,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Setup Google Pay and Apple Pay
  useEffect(() => {
    if (!stripe || !elements) return;

    const amount = Number(service.amount);
    if (isNaN(amount) || amount <= 0) {
      console.error("Invalid service amount:", service.amount);
      toast.error("Invalid service amount. Please try again.");
      onClose();
      return;
    }

    const totalAmount = Math.round((amount + amount * 0.15) * 100); // Convert to paise

    const pr = stripe.paymentRequest({
      country: "IN",
      currency: "inr",
      total: {
        label: service.title || "Mentorship Session",
        amount: totalAmount,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment()
      .then((result) => {
        if (result?.applePay || result?.googlePay) {
          setPaymentRequest(pr);
        } else {
          console.log("Google Pay/Apple Pay not available");
        }
      })
      .catch((error) => {
        console.error("PaymentRequest error:", error);
        toast.error("Failed to initialize Google Pay/Apple Pay");
      });

    pr.on("paymentmethod", async (ev) => {
      setLoading(true);
      try {
        const { error, paymentIntent } = await stripe.confirmPayment({
          clientSecret,
          paymentMethod: ev.paymentMethod.id,
          confirmParams: {
            return_url: window.location.origin,
          },
        });

        if (error) {
          ev.complete("fail");
          toast.error(error.message || "Payment failed");
          setErrorMessage(error.message || "Payment failed");
          setLoading(false);
          return;
        }

        ev.complete("success");
        if (paymentIntent.status === "succeeded") {
          await handleBookingSave();
        }
      } catch (error: any) {
        ev.complete("fail");
        toast.error(error.message || "Payment failed");
        setErrorMessage(error.message || "Payment failed");
      } finally {
        setLoading(false);
      }
    });
  }, [stripe, elements, clientSecret, service, onClose]);

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (!stripe || !elements) {
      toast.error("Stripe.js not loaded");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Card element not found");
      setLoading(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: mentor.name || "Anonymous",
            },
          },
        }
      );

      if (error) {
        console.error("Card payment error:", error);
        toast.error(error.message || "Payment failed");
        setErrorMessage(error.message || "Payment failed");
        setLoading(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        await handleBookingSave();
      }
    } catch (error: any) {
      console.error("Card payment error:", error);
      toast.error(error.message || "Payment failed");
      setErrorMessage(error.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSave = async () => {
    try {
      const slotIndex = ["10:00 AM", "12:00 PM", "3:00 PM"].indexOf(
        selectedTime
      );
      const parseTime = (time: string) => {
        const [hours, minutes] = time
          .replace(" AM", "")
          .replace(" PM", "")
          .split(":")
          .map(Number);
        const isPM = time.includes("PM");
        const adjustedHours =
          isPM && hours !== 12 ? hours + 12 : !isPM && hours === 12 ? 0 : hours;
        return `${adjustedHours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`;
      };
      const startTime = parseTime(selectedTime);
      const durationMinutes = 30; // Adjust based on service.duration
      const totalMinutes = durationMinutes;
      const newHours =
        Math.floor(totalMinutes / 60) + parseInt(startTime.split(":")[0]);
      const newMinutes = totalMinutes % 60;
      const endTime = `${newHours.toString().padStart(2, "0")}:${newMinutes
        .toString()
        .padStart(2, "0")}`;

      const amount = Number(service.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Invalid service amount");
      }

      const bookingResponse = await saveBooking({
        serviceId: service._id,
        mentorId: mentor._id,
        menteeId,
        bookingDate: selectedDate,
        startTime,
        endTime,
        day: new Date(selectedDate)
          .toLocaleDateString("en-US", { weekday: "long" })
          .toLowerCase(),
        slotIndex,
        paymentIntentId,
        amount: amount + Math.round(amount * 0.15),
      });

      if (bookingResponse.booking) {
        toast.success("Booking confirmed!");
        navigate("/seeker/dashboard");
        onClose();
      } else {
        throw new Error("Failed to save booking");
      }
    } catch (error: any) {
      console.error("Booking save error:", error);
      toast.error(error.message || "Failed to confirm booking");
      setErrorMessage(error.message || "Failed to confirm booking");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Complete Your Payment</h2>
      <div className="mb-6 bg-gray-100 p-4 rounded-md">
        <h3 className="font-semibold mb-2">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>{service.title || "Mentorship Session"}</span>
            <span>₹{service.amount}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Charge (15%)</span>
            <span>₹{Math.round(service.amount * 0.15)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>
              ₹{Number(service.amount) + Math.round(service.amount * 0.15)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {selectedTime} |{" "}
            {new Date(selectedDate).toLocaleDateString("en-GB")}
          </p>
        </div>
      </div>

      {paymentRequest && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Pay with Google Pay or Apple Pay
          </h3>
          <PaymentRequestButtonElement
            options={{
              paymentRequest,
              style: {
                paymentRequestButton: {
                  theme: "dark",
                  height: "48px",
                },
              },
            }}
          />
        </div>
      )}

      <form onSubmit={handleCardSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Pay with Card</h3>
          <div className="p-3 bg-gray-100 rounded-md border border-gray-300">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": { color: "#aab7c4" },
                  },
                  invalid: { color: "#9e2146" },
                },
              }}
            />
          </div>
        </div>

        {errorMessage && (
          <div className="text-red-600 text-sm">{errorMessage}</div>
        )}

        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1 rounded-full"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 rounded-full bg-black text-white"
            type="submit"
            disabled={loading || !stripe || !elements}
          >
            {loading ? "Processing..." : "Pay Now"}
          </Button>
        </div>
      </form>
    </div>
  );
}
