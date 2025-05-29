import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PaymentMethods from "@/components/payments/PaymentForm";
import CardForm from "@/components/payments/CardForm";
import { ChevronLeft, Lock } from "lucide-react";
import { useState } from "react";

interface Service {
  _id?: string;
  title: string;
  duration: string | number;
  amount: number;
}

interface Mentor {
  _id?: string;
  name: string;
  role: string;
}

interface StripeCheckoutPageProps {
  service?: Service;
  mentor?: Mentor;
  selectedDate?: string;
  selectedTime?: string;
  menteeId?: string;
}

const formatPrice = (amount: number, currency: string) => {
  const numberFormat = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  });
  return numberFormat.format(amount);
};

export default function StripeCheckoutPage({
  service = {
    title: "Career Guidance Session",
    duration: "30 minutes",
    amount: 328,
  },
  mentor = { name: "John Doe", role: "Career Coach" },
  selectedDate = "2025-03-11",
  selectedTime = "12:00 PM",
  menteeId = "demo-mentee-id",
}: StripeCheckoutPageProps) {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "gpay" | "amazon" | "upi"
  >("card");

  const platformCharge = Math.round(Number(service.amount) * 0.15);
  const totalAmount = Number(service.amount) + platformCharge;

  const formattedDate = selectedDate
    ? format(new Date(selectedDate), "d MMMM yyyy")
    : "N/A";

  const handlePay = () => {
    // Static UI, no action
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl bg-neutral-50">
      <Button
        variant="ghost"
        className="mb-6 pl-2 text-blue-600 hover:text-blue-700"
        onClick={() => navigate("/seeker/mentorservice")}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back
      </Button>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Payment Form Section */}
        <div className="md:col-span-2">
          <Card className="shadow-sm border-neutral-200">
            <CardContent className="p-6">
              <h1 className="text-2xl font-semibold mb-6">Payment Details</h1>

              <PaymentMethods
                selected={paymentMethod}
                onSelect={setPaymentMethod}
              />

              {paymentMethod === "card" && (
                <>
                  <div className="flex items-center gap-1 mt-4 mb-6 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">Secure</span>
                    <span>, 1-click checkout</span>
                  </div>

                  <CardForm onSubmit={handlePay} />

                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-6">
                    <Lock className="h-4 w-4" />
                    Payments are secure and encrypted
                  </div>
                </>
              )}

              {paymentMethod === "gpay" && (
                <div className="py-16 text-center">
                  <p className="text-muted-foreground">
                    You will be redirected to Google Pay to complete your
                    payment
                  </p>
                </div>
              )}

              {paymentMethod === "amazon" && (
                <div className="py-16 text-center">
                  <p className="text-muted-foreground">
                    You will be redirected to Amazon Pay to complete your
                    payment
                  </p>
                </div>
              )}

              {paymentMethod === "upi" && (
                <div className="py-16 text-center">
                  <p className="text-muted-foreground">
                    You will be redirected to UPI to complete your payment
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary Section */}
        <div className="md:col-span-1">
          <Card className="shadow-sm border-neutral-200">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Booking Summary</h2>
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Mentor:
                </p>
                <p>{mentor.name}</p>
                <p className="text-sm text-muted-foreground">{mentor.role}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Service:
                </p>
                <p>{service.title}</p>
                <p className="text-sm text-muted-foreground">
                  {typeof service.duration === "string"
                    ? service.duration
                    : `${service.duration} minutes`}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Date & Time:
                </p>
                <p>{formattedDate}</p>
                <p>{selectedTime}</p>
              </div>
              <hr className="border-neutral-200" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Service Fee:</span>
                  <span>{formatPrice(service.amount, "INR")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee (15%):</span>
                  <span>{formatPrice(platformCharge, "INR")}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(totalAmount, "INR")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
