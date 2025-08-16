// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { toast } from "react-hot-toast";
// import { loadStripe } from "@stripe/stripe-js";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import { createCheckoutSession } from "@/services/paymentServcie";

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// interface Service {
//   _id: string;
//   title: string;
//   duration: string | number;
//   amount: number;
//   type: string;
// }

// interface Mentor {
//   _id: string;
//   name: string;
//   userData: string;
// }

// interface PaymentModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   service: Service | null;
//   mentor: Mentor | null;
//   selectedDate: string | null;
//   selectedTime: string | null;
//   selectedSlotIndex: number | null;
//   menteeId: string;
// }

// export default function PaymentModal({
//   isOpen,
//   onClose,
//   service,
//   mentor,
//   selectedDate,
//   selectedTime,
//   selectedSlotIndex,
//   menteeId,
// }: PaymentModalProps) {
//   useEffect(() => {
//     console.log("=========PaymentModal step 1", selectedDate);
//     console.log("=========PaymentModal step 1", selectedTime);
//   });
//   const { user } = useSelector((state: RootState) => state.user);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//   });

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         name:
//           `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
//           "Guest User",
//         email: user.email || "",
//         phone: user.phone || "",
//       });
//     }
//   }, [user]);

//   useEffect(() => {
//     console.log(
//       "Stripe Publishable Key:",
//       import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
//     );

//     stripePromise
//       .then((stripe) => console.log("Stripe initialized:", !!stripe))
//       .catch((error) => console.error("Stripe initialization failed:", error));
//   }, []);

//   useEffect(() => {
//     if (isOpen && (!service || !mentor)) {
//       console.error("Missing service or mentor:", { service, mentor });
//       toast.error("Service or mentor information is missing");
//       onClose();
//     }
//   }, [isOpen, service, mentor, onClose]);

//   if (!service || !mentor) {
//     return null;
//   }

//   const platformPercentage = 15;
//   const platformCharge = Math.round(
//     service.amount * (platformPercentage / 100)
//   );
//   const totalAmount = service.amount + platformCharge;

//   const formattedDate = selectedDate
//     ? new Date(selectedDate).toLocaleDateString("en-GB", {
//         day: "numeric",
//         month: "long",
//         year: "numeric",
//       })
//     : "N/A";

//   const parseTime = (time: string): { hours: number; minutes: number } => {
//     if (!time) return { hours: 0, minutes: 0 };
//     const [timePart, period] = time.split(" ");
//     let [hours, minutes] = timePart.split(":").map(Number);
//     if (period === "PM" && hours !== 12) hours += 12;
//     if (period === "AM" && hours === 12) hours = 0;
//     return { hours, minutes };
//   };

//   const calculateEndTime = (
//     startTime: string,
//     duration: string | number | undefined
//   ) => {
//     if (!startTime || !duration) return "N/A";
//     const durationMinutes =
//       typeof duration === "string"
//         ? parseInt(duration.match(/^(\d+)/)?.[1] || "0", 10)
//         : duration;
//     if (isNaN(durationMinutes)) return "N/A";
//     const { hours, minutes } = parseTime(startTime);
//     const totalMinutes = minutes + durationMinutes;
//     const newHours = Math.floor(totalMinutes / 60) + hours;
//     const newMinutes = totalMinutes % 60;
//     const period = newHours >= 12 ? "PM" : "AM";
//     const adjustedHours = newHours % 12 || 12;
//     return `${adjustedHours.toString().padStart(2, "0")}:${newMinutes
//       .toString()
//       .padStart(2, "0")} ${period}`;
//   };

//   const startTime =
//     selectedTime ||
//     (service.type === "DigitalProducts"
//       ? new Date().toLocaleTimeString("en-US", {
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: true,
//         })
//       : "N/A");

//   const endTime =
//     selectedTime && service.duration
//       ? calculateEndTime(selectedTime, service.duration)
//       : "N/A";

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (!service._id || !mentor.userData) {
//         console.error("Invalid service or mentor ID:", { service, mentor });
//         throw new Error("Service or mentor ID is missing");
//       }

//       const slotIndex = selectedSlotIndex ?? 0;

//       const payload = {
//         amount: service.amount,
//         platformPercentage,
//         platformCharge,
//         total: totalAmount,
//         serviceId: service._id,
//         mentorId: mentor.userData,
//         menteeId,
//         bookingDate: selectedDate || "",
//         startTime,
//         endTime,
//         day: selectedDate
//           ? new Date(selectedDate)
//               .toLocaleDateString("en-US", { weekday: "long" })
//               .toLowerCase()
//           : "",
//         slotIndex,
//         customerEmail: formData.email,
//         customerName: formData.name,
//         customerPhone: formData.phone || undefined,
//       };

//       console.log("Submitting checkout session with payload:", payload);

//       const stripe = await stripePromise;
//       if (!stripe) {
//         console.error("Stripe not initialized");
//         throw new Error("Stripe.js failed to load");
//       }
//       console.log("laod createCheckoutSession");

//       const response = await createCheckoutSession(payload);
//       console.log("Checkout session response:", response);

//       if (!response.sessionId || typeof response.sessionId !== "string") {
//         console.error("Invalid sessionId:", response);
//         throw new Error("Invalid or missing sessionId from backend");
//       }

//       console.log(
//         "Redirecting to Stripe Checkout with sessionId:",
//         response.sessionId
//       );
//       const { error } = await stripe.redirectToCheckout({
//         sessionId: response.sessionId,
//       });

//       if (error) {
//         console.error("Stripe redirect error:", error);
//         throw new Error(
//           error.message || "Failed to redirect to Stripe Checkout"
//         );
//       }
//     } catch (error) {
//       console.error("Payment error:", error);
//       toast.error(error.message || "Payment failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-800 to-blue-800 text-white rounded-3xl">
//         <DialogHeader>
//           <DialogTitle className="text-xl font-bold">
//             Confirm Payment
//           </DialogTitle>
//         </DialogHeader>
//         <div className="mb-4">
//           <h2 className="text-xl font-bold">{service.title}</h2>
//           <p className="text-sm">
//             {typeof service.duration === "string"
//               ? service.duration
//               : `${service.duration} minutes`}{" "}
//             | {startTime} | {formattedDate}
//           </p>
//         </div>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <Label htmlFor="name">Name</Label>
//             <Input
//               id="name"
//               className="bg-white text-black"
//               value={formData.name}
//               onChange={(e) =>
//                 setFormData({ ...formData, name: e.target.value })
//               }
//             />
//           </div>
//           <div>
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               className="bg-white text-black"
//               value={formData.email}
//               onChange={(e) =>
//                 setFormData({ ...formData, email: e.target.value })
//               }
//             />
//           </div>
//           <div>
//             <Label htmlFor="phone">Phone</Label>
//             <Input
//               id="phone"
//               className="bg-white text-black"
//               value={formData.phone}
//               onChange={(e) =>
//                 setFormData({ ...formData, phone: e.target.value })
//               }
//             />
//           </div>
//           <div className="bg-white text-black rounded-lg p-4">
//             <h3 className="font-semibold mb-2">Order Summary</h3>
//             <div className="space-y-2">
//               <div className="flex justify-between">
//                 <span>Service Charge</span>
//                 <span>₹{service.amount}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Platform Charge</span>
//                 <span>₹{platformCharge}</span>
//               </div>
//               <div className="flex justify-between font-semibold">
//                 <span>Total</span>
//                 <span>₹{totalAmount}</span>
//               </div>
//             </div>
//           </div>
//           <div className="flex gap-4">
//             <Button
//               variant="outline"
//               className="flex-1 rounded-md transform transition-transform duration-200 hover:scale-105"
//               onClick={onClose}
//               disabled={loading}
//             >
//               Cancel
//             </Button>
//             <Button
//               className="flex-1 rounded-md bg-green-500 hover:bg-green-600 text-white transform transition-transform duration-200 hover:scale-105"
//               type="submit"
//               disabled={loading}
//             >
//               {loading ? "Processing..." : "Confirm and Pay"}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import { stripePromise } from "@/config/stripe";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { createCheckoutSession } from "@/services/paymentServcie";
import { CreditCard, Shield, Clock, Calendar, Lock } from "lucide-react";

interface Service {
  _id: string;
  title: string;
  duration: string | number;
  amount: number;
  type: string;
}

interface Mentor {
  _id: string;
  name: string;
  userData: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  mentor: Mentor | null;
  selectedDate: string | null;
  selectedTime: string | null;
  selectedSlotIndex: number | null;
  menteeId: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  service,
  mentor,
  selectedDate,
  selectedTime,
  selectedSlotIndex,
  menteeId,
}: PaymentModalProps) {
  const { user } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name:
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          "Guest User",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  useEffect(() => {
    console.log(
      "Stripe Publishable Key:",
      import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    );

    stripePromise
      .then((stripe) => console.log("Stripe initialized:", !!stripe))
      .catch((error) => console.error("Stripe initialization failed:", error));
  }, []);

  useEffect(() => {
    if (isOpen && (!service || !mentor)) {
      console.error("Missing service or mentor:", { service, mentor });
      toast.error("Service or mentor information is missing");
      onClose();
    }
  }, [isOpen, service, mentor, onClose]);

  if (!service || !mentor) {
    return null;
  }

  const platformPercentage = 15;
  const platformCharge = Math.round(
    service.amount * (platformPercentage / 100)
  );
  const totalAmount = service.amount + platformCharge;

  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const parseTime = (time: string): { hours: number; minutes: number } => {
    if (!time) return { hours: 0, minutes: 0 };
    const [timePart, period] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return { hours, minutes };
  };

  const calculateEndTime = (
    startTime: string,
    duration: string | number | undefined
  ) => {
    if (!startTime || !duration) return "N/A";
    const durationMinutes =
      typeof duration === "string"
        ? parseInt(duration.match(/^(\d+)/)?.[1] || "0", 10)
        : duration;
    if (isNaN(durationMinutes)) return "N/A";
    const { hours, minutes } = parseTime(startTime);
    const totalMinutes = minutes + durationMinutes;
    const newHours = Math.floor(totalMinutes / 60) + hours;
    const newMinutes = totalMinutes % 60;
    const period = newHours >= 12 ? "PM" : "AM";
    const adjustedHours = newHours % 12 || 12;
    return `${adjustedHours.toString().padStart(2, "0")}:${newMinutes
      .toString()
      .padStart(2, "0")} ${period}`;
  };

  const startTime =
    selectedTime ||
    (service.type === "DigitalProducts"
      ? new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "N/A");

  const endTime =
    selectedTime && service.duration
      ? calculateEndTime(selectedTime, service.duration)
      : "N/A";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!service._id || !mentor.userData) {
        console.error("Invalid service or mentor ID:", { service, mentor });
        throw new Error("Service or mentor ID is missing");
      }

      const slotIndex = selectedSlotIndex ?? 0;

      const payload = {
        amount: service.amount,
        platformPercentage,
        platformCharge,
        total: totalAmount,
        serviceId: service._id,
        mentorId: mentor.userData,
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
        customerEmail: formData.email,
        customerName: formData.name,
        customerPhone: formData.phone || undefined,
      };

      console.log("Submitting checkout session with payload:", payload);

      const stripe = await stripePromise;
      if (!stripe) {
        console.error("Stripe not initialized");
        throw new Error("Stripe.js failed to load");
      }
      console.log("laod createCheckoutSession");

      const response = await createCheckoutSession(payload);
      console.log("Checkout session response:", response);

      if (!response.sessionId || typeof response.sessionId !== "string") {
        console.error("Invalid sessionId:", response);
        throw new Error("Invalid or missing sessionId from backend");
      }

      console.log(
        "Redirecting to Stripe Checkout with sessionId:",
        response.sessionId
      );
      console.log("Stripe instance:", stripe);
      console.log("Stripe redirect method available:", typeof stripe.redirectToCheckout);
      
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.sessionId,
      });

      if (error) {
        console.error("Stripe redirect error:", error);
        console.error("Error details:", {
          type: error.type,
          code: error.code,
          message: error.message,
          payment_intent: error.payment_intent
        });
        throw new Error(
          error.message || "Failed to redirect to Stripe Checkout"
        );
      } else {
        console.log("Stripe redirect successful - should be redirecting now");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-purple-50 to-blue-50 border-0 shadow-2xl rounded-2xl p-0 overflow-hidden max-h-[100vh] overflow-y-auto">
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="relative z-10">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <CreditCard className="w-5 h-5" />
                </div>
                Confirm Booking
              </DialogTitle>
            </DialogHeader>
          </div>
        </div>

        {/* Compact Security Notice */}
        <div className="mx-4 flex items-center gap-2 px-8 py-2 bg-green-50 rounded-lg border border-green-200">
          <div className=" bg-green-100 rounded">
            <Shield className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-green-800">
              Secure Payment
            </p>
            <p className="text-xs text-green-600">
              Protected by Stripe security
            </p>
          </div>
          <Lock className="w-4 h-4 text-green-600" />
        </div>

        <div className="px-4 pb-8 space-y-2">
          {/* Compact Service Summary */}

          <Card className="border-0 shadow-md bg-white rounded-xl overflow-hidden">
            <CardContent className="px-3 py-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                {/* Left Column - Title & Mentor */}
                <div className="md:w-1/3">
                  <h3 className="text-lg font-bold text-gray-900">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600">with {mentor.name}</p>
                </div>

                {/* Right Column - Details */}
                <div className="grid grid-cols-3 gap-2 text-xs md:w-2/3">
                  <div className="text-center p-2 bg-purple-50 rounded-lg">
                    <Clock className="w-3 h-3 text-purple-600 mx-auto mb-1" />
                    <p className="text-gray-500">Duration</p>
                    <p className="font-semibold text-gray-900">
                      {typeof service.duration === "string"
                        ? service.duration
                        : `${service.duration}m`}
                    </p>
                  </div>

                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <Calendar className="w-3 h-3 text-blue-600 mx-auto mb-1" />
                    <p className="text-gray-500">Date</p>
                    <p className="font-semibold text-gray-900">
                      {formattedDate}
                    </p>
                  </div>

                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <Clock className="w-3 h-3 text-green-600 mx-auto mb-1" />
                    <p className="text-gray-500">Time</p>
                    <p className="font-semibold text-gray-900">{startTime}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compact Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Contact Information */}
            <Card className="border-0 shadow-md bg-white rounded-xl overflow-hidden">
              <CardContent className="p-4 space-y-3">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-xs font-semibold text-gray-700"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    className="mt-1 h-9 rounded-lg border-gray-200 focus:border-purple-400 text-sm"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="text-xs font-semibold text-gray-700"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="mt-1 h-9 rounded-lg border-gray-200 focus:border-purple-400 text-sm"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="phone"
                    className="text-xs font-semibold text-gray-700"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    className="mt-1 h-9 rounded-lg border-gray-200 focus:border-purple-400 text-sm"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Enter your phone"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Compact Payment Summary */}
            <Card className="border-0 shadow-md bg-white rounded-xl overflow-hidden">
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Service Charge</span>
                    <span className="font-semibold text-gray-900">
                      ₹{service.amount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      Platform Fee ({platformPercentage}%)
                    </span>
                    <span className="font-semibold text-gray-900">
                      ₹{platformCharge}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">
                        Total Amount
                      </span>
                      <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        ₹{totalAmount}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compact Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-lg border-2 border-gray-300 hover:bg-gray-50 h-10 text-sm font-semibold"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg h-10 text-sm font-semibold shadow-lg transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Pay ₹{totalAmount}
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
