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
//   type: string; // Added type
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
//   selectedSlotIndex: number | null; // New prop
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

//   // const platformCharge = Math.round(service.amount * 0.15);
//   // const totalAmount = service.amount + platformCharge;
//   const platformPercentage = 15; // Fixed at 15%
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

//   const formatTimeForBackend = (time: string): string => {
//     if (!time) return "00:00";
//     const { hours, minutes } = parseTime(time);
//     return `${hours.toString().padStart(2, "0")}:${minutes
//       .toString()
//       .padStart(2, "0")}`;
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
//     return `${newHours.toString().padStart(2, "0")}:${newMinutes
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   const startTime = selectedTime
//     ? formatTimeForBackend(selectedTime)
//     : service.type === "DigitalProducts"
//     ? formatTimeForBackend(
//         new Date().toLocaleTimeString("en-US", {
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: true,
//         })
//       )
//     : "00:00";

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
//     } catch (error: any) {
//       console.error("Payment error:", error);
//       toast.error(error.message || "Payment failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md bg-black text-white rounded-3xl">
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
//             | {selectedTime || "N/A"} | {formattedDate}
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
//               className="flex-1 rounded-md"
//               onClick={onClose}
//               disabled={loading}
//             >
//               Cancel
//             </Button>
//             <Button
//               className="flex-1 rounded-md bg-white text-black"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { createCheckoutSession } from "@/services/paymentServcie";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

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
  useEffect(() => {
    console.log("=========PaymentModal step 1", selectedDate);
    console.log("=========PaymentModal step 1", selectedTime);
  });
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
        month: "long",
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
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.sessionId,
      });

      if (error) {
        console.error("Stripe redirect error:", error);
        throw new Error(
          error.message || "Failed to redirect to Stripe Checkout"
        );
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
      <DialogContent className="sm:max-w-md bg-black text-white rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Confirm Payment
          </DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <h2 className="text-xl font-bold">{service.title}</h2>
          <p className="text-sm">
            {typeof service.duration === "string"
              ? service.duration
              : `${service.duration} minutes`}{" "}
            | {startTime} | {formattedDate}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              className="bg-white text-black"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className="bg-white text-black"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              className="bg-white text-black"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
          <div className="bg-white text-black rounded-lg p-4">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Service Charge</span>
                <span>₹{service.amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Charge</span>
                <span>₹{platformCharge}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1 rounded-md"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 rounded-md bg-white text-black"
              type="submit"
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm and Pay"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
