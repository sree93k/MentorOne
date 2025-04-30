// import { format } from "date-fns";
// import {
//   ArrowLeft,
//   Clock,
//   CreditCard,
//   Shield,
//   CheckCircle,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";

// interface Service {
//   _id?: string;
//   title: string;
//   duration: string | number;
//   amount: number;
// }

// interface Mentor {
//   _id?: string;
//   name: string;
//   role: string;
// }

// interface StripeCheckoutPageProps {
//   service: Service;
//   mentor: Mentor;
//   selectedDate: string;
//   selectedTime: string;
//   onBack: () => void;
// }

// export default function StripeCheckoutPage({
//   service = {
//     title: "Career Guidance Session",
//     duration: "30 minutes",
//     amount: 328,
//   },
//   mentor = { name: "John Doe", role: "Career Coach" },
//   selectedDate = "2025-03-11",
//   selectedTime = "12:00 PM",
//   onBack,
// }: StripeCheckoutPageProps) {
//   const platformCharge = Math.round(Number(service.amount) * 0.15);
//   const totalAmount = Number(service.amount) + platformCharge;

//   const bookingDetails = {
//     mentorName: mentor.name,
//     role: mentor.role,
//     serviceTitle: service.title,
//     bookingDate: new Date(selectedDate),
//     startTime: selectedTime,
//     duration:
//       typeof service.duration === "string"
//         ? service.duration
//         : `${service.duration} minutes`,
//     amount: service.amount,
//     totalAmount,
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="max-w-3xl w-full bg-gray-50 rounded-lg overflow-hidden">
//         <Button
//           variant="ghost"
//           onClick={onBack}
//           className="m-6 text-blue-600 hover:text-blue-700"
//         >
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back
//         </Button>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
//           {/* Payment Form Section */}
//           <div className="md:col-span-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-2xl font-bold">
//                   Payment Details
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <form className="space-y-6">
//                   <div>
//                     <Label htmlFor="email">Email</Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       placeholder="you@example.com"
//                       className="bg-white"
//                       disabled
//                     />
//                     {/* Placeholder for email error */}
//                     <div className="hidden p-3 bg-red-50 text-red-600 rounded-md text-sm mt-2">
//                       Invalid email address
//                     </div>
//                   </div>

//                   <div>
//                     <Label>Payment</Label>
//                     <div className="border rounded-md p-4 bg-gray-100">
//                       <div className="space-y-2">
//                         <Input
//                           placeholder="Card number"
//                           className="bg-white"
//                           disabled
//                         />
//                         <div className="flex gap-2">
//                           <Input
//                             placeholder="MM/YY"
//                             className="bg-white"
//                             disabled
//                           />
//                           <Input
//                             placeholder="CVC"
//                             className="bg-white"
//                             disabled
//                           />
//                         </div>
//                       </div>
//                       <p className="text-sm text-gray-500 mt-2">
//                         (Payment form placeholder - will support card, Google
//                         Pay, Apple Pay)
//                       </p>
//                     </div>
//                   </div>

//                   {/* Placeholder for payment error */}
//                   <div className="hidden p-3 bg-red-50 text-red-600 rounded-md text-sm">
//                     An error occurred with your payment
//                   </div>

//                   <Button
//                     className="w-full bg-blue-600 hover:bg-blue-700"
//                     disabled
//                   >
//                     <span className="flex items-center">
//                       <CreditCard className="mr-2 h-4 w-4" />
//                       Pay ₹ {bookingDetails.totalAmount}
//                     </span>
//                   </Button>

//                   {/* Loading state preview */}
//                   <Button
//                     className="w-full bg-blue-600 hover:bg-blue-700 hidden"
//                     disabled
//                   >
//                     <span className="flex items-center">
//                       <Clock className="animate-spin mr-2 h-4 w-4" />
//                       Processing...
//                     </span>
//                   </Button>

//                   <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
//                     <Shield className="h-4 w-4" />
//                     <span>Payments are secure and encrypted</span>
//                   </div>
//                 </form>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Booking Summary Section */}
//         </div>
//       </div>
//     </div>
//   );
// }
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
