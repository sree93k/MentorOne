// import { useEffect, useState } from "react";
// import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { CheckCircle, XCircle, CreditCard } from "lucide-react";
// import ConfettiExplosion from "react-confetti-explosion";

// interface PaymentStatusModalProps {
//   isOpen: boolean;
//   status: "success" | "failure" | null;
//   message?: string;
//   onRetry?: () => void;
//   onCancel: () => void;
// }

// export default function PaymentStatusModal({
//   isOpen,
//   status,
//   message,
//   onRetry,
//   onCancel,
// }: PaymentStatusModalProps) {
//   const [countdown, setCountdown] = useState(3);
//   const [isExploding, setIsExploding] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       if (status === "success") {
//         setIsExploding(true); // Trigger confetti on success

//         const timer = setInterval(() => {
//           setCountdown((prev) => {
//             if (prev <= 1) {
//               clearInterval(timer);
//               onCancel();
//               return 0;
//             }
//             return prev - 1;
//           });
//         }, 1000);

//         return () => {
//           clearInterval(timer);
//           setIsExploding(false); // Reset confetti on unmount or status change
//         };
//       } else {
//         setIsExploding(false); // Ensure confetti is off for failure/other states
//         setCountdown(3); // Reset countdown for future successes
//       }
//     }
//   }, [isOpen, status, onCancel]);

//   const isSuccess = status === "success";

//   return (
//     <Dialog open={isOpen} onOpenChange={onCancel}>
//       {status === "success" && isExploding && (
//         <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[9999]">
//           {" "}
//           {/* Very high z-index */}
//           <ConfettiExplosion
//             force={0.8}
//             duration={3500}
//             particleCount={250}
//             width={2000}
//             onComplete={() => setIsExploding(false)}
//           />
//         </div>
//       )}

//       <DialogContent
//         className={`
//           max-w-lg
//           w-[calc(100%-2rem)]
//           p-0 overflow-hidden rounded-2xl
//           border-0 bg-transparent shadow-none
//         `}
//       >
//         <div
//           className={`
//             relative flex flex-col items-center justify-between h-full w-full
//             rounded-2xl
//             shadow-lg
//             ${
//               isSuccess
//                 ? "bg-gradient-to-br from-emerald-50 via-white to-green-50"
//                 : "bg-gradient-to-br from-red-50 via-white to-rose-50"
//             }
//           `}
//         >
//           {/* Animated background pattern */}
//           <div className="absolute inset-0 opacity-10 pointer-events-none">
//             <div
//               className={`absolute top-4 left-4 w-40 h-40 rounded-full ${
//                 isSuccess ? "bg-emerald-400" : "bg-red-400"
//               } animate-blob-pulse`}
//             ></div>
//             <div
//               className={`absolute bottom-8 right-8 w-24 h-24 rounded-full ${
//                 isSuccess ? "bg-green-300" : "bg-rose-300"
//               } animate-blob-bounce`}
//             ></div>
//           </div>

//           {/* Header with icon and title */}
//           <div className="relative z-10 px-6 pt-10 pb-6 text-center w-full">
//             <div
//               className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
//                 isSuccess
//                   ? "bg-gradient-to-r from-emerald-400 to-green-500 shadow-xl shadow-emerald-300"
//                   : "bg-gradient-to-r from-red-400 to-rose-500 shadow-xl shadow-red-300"
//               } animate-pop-in`}
//             >
//               {isSuccess ? (
//                 <CheckCircle className="h-12 w-12 text-white" />
//               ) : (
//                 <XCircle className="h-12 w-12 text-white" />
//               )}
//             </div>

//             <DialogTitle
//               className={`text-3xl font-extrabold mb-3 ${
//                 isSuccess ? "text-emerald-800" : "text-red-800"
//               }`}
//             >
//               {isSuccess ? "Payment Successful!" : "Payment Failed"}
//             </DialogTitle>

//             <div
//               className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-base font-medium ${
//                 isSuccess
//                   ? "bg-emerald-100 text-emerald-700"
//                   : "bg-red-100 text-red-700"
//               } shadow-sm`}
//             >
//               <CreditCard className="h-5 w-5" />
//               {isSuccess ? "Transaction Complete" : "Transaction Failed"}
//             </div>
//           </div>

//           {/* Content Area */}
//           <div className="relative z-10 px-6 pb-10 w-full">
//             <div
//               className={`p-5 rounded-xl mb-8 ${
//                 isSuccess
//                   ? "bg-emerald-50 border border-emerald-100"
//                   : "bg-red-50 border border-red-100"
//               }`}
//             >
//               <p
//                 className={`text-center text-base leading-relaxed ${
//                   isSuccess ? "text-emerald-700" : "text-red-700"
//                 }`}
//               >
//                 {isSuccess
//                   ? `Your payment was processed successfully! You'll be redirected to your bookings in ${countdown} seconds.`
//                   : message ||
//                     "We encountered an issue while processing your payment. Please try again or contact support if the problem persists."}
//               </p>
//             </div>

//             {/* Action buttons */}
//             {isSuccess ? (
//               <div className="space-y-4">
//                 <Button
//                   className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center gap-2 text-lg"
//                   onClick={onCancel} // This will trigger the redirect
//                 >
//                   <CheckCircle className="h-5 w-5" />
//                   View My Bookings
//                 </Button>
//                 <div className="flex justify-center mt-3">
//                   <div
//                     className={`flex items-center gap-2 text-sm ${
//                       isSuccess
//                         ? "text-emerald-600 bg-emerald-100"
//                         : "text-gray-600 bg-gray-100"
//                     } px-4 py-1.5 rounded-full`}
//                   >
//                     <div
//                       className={`w-2.5 h-2.5 ${
//                         isSuccess ? "bg-emerald-500" : "bg-gray-500"
//                       } rounded-full animate-pulse`}
//                     ></div>
//                     Auto-redirecting in {countdown}s
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <div className="text-center mt-4">
//                   <p className="text-sm text-gray-500">
//                     Need help? Contact our{" "}
//                     <span className="text-red-600 font-medium cursor-pointer hover:underline">
//                       support team
//                     </span>
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  CreditCard,
  Sparkles,
  Calendar,
  ArrowRight,
} from "lucide-react";
import ConfettiExplosion from "react-confetti-explosion";

interface PaymentStatusModalProps {
  isOpen: boolean;
  status: "success" | "failure" | null;
  message?: string;
  onRetry?: () => void;
  onCancel: () => void;
}

export default function PaymentStatusModal({
  isOpen,
  status,
  message,
  onRetry,
  onCancel,
}: PaymentStatusModalProps) {
  const [countdown, setCountdown] = useState(5);
  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (status === "success") {
        setIsExploding(true);

        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              onCancel();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => {
          clearInterval(timer);
          setIsExploding(false);
        };
      } else {
        setIsExploding(false);
        setCountdown(5);
      }
    }
  }, [isOpen, status, onCancel]);

  const isSuccess = status === "success";

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      {status === "success" && isExploding && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[9999]">
          <ConfettiExplosion
            force={0.8}
            duration={4000}
            particleCount={300}
            width={2000}
            colors={[
              "#8B5CF6",
              "#3B82F6",
              "#10B981",
              "#F59E0B",
              "#EF4444",
              "#EC4899",
            ]}
            onComplete={() => setIsExploding(false)}
          />
        </div>
      )}

      <DialogContent className="max-w-lg w-[calc(100%-2rem)] p-0 overflow-hidden rounded-3xl border-0 bg-transparent shadow-none">
        <div
          className={`relative flex flex-col items-center justify-between h-full w-full rounded-3xl shadow-2xl ${
            isSuccess
              ? "bg-gradient-to-br from-emerald-50 via-white to-green-50"
              : "bg-gradient-to-br from-red-50 via-white to-rose-50"
          }`}
        >
          {/* Animated background decorations */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div
              className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 ${
                isSuccess
                  ? "bg-gradient-to-r from-emerald-400 to-green-400"
                  : "bg-gradient-to-r from-red-400 to-rose-400"
              } animate-pulse`}
            />
            <div
              className={`absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${
                isSuccess
                  ? "bg-gradient-to-r from-green-300 to-emerald-300"
                  : "bg-gradient-to-r from-rose-300 to-red-300"
              } animate-bounce`}
            />

            {/* Floating sparkles for success */}
            {isSuccess && (
              <>
                <Sparkles className="absolute top-12 left-12 w-6 h-6 text-emerald-300 animate-pulse" />
                <Sparkles className="absolute top-20 right-16 w-4 h-4 text-green-300 animate-ping" />
                <Sparkles className="absolute bottom-20 left-20 w-5 h-5 text-emerald-400 animate-pulse" />
              </>
            )}
          </div>

          {/* Header with icon and title */}
          <div className="relative z-10 px-8 pt-12 pb-6 text-center w-full">
            <div
              className={`inline-flex items-center justify-center w-28 h-28 rounded-3xl mb-6 shadow-2xl ${
                isSuccess
                  ? "bg-gradient-to-r from-emerald-500 to-green-500"
                  : "bg-gradient-to-r from-red-500 to-rose-500"
              } ${isSuccess ? "animate-bounce" : ""}`}
            >
              {isSuccess ? (
                <CheckCircle className="h-14 w-14 text-white" />
              ) : (
                <XCircle className="h-14 w-14 text-white" />
              )}
            </div>

            <DialogTitle
              className={`text-4xl font-black mb-4 ${
                isSuccess ? "text-emerald-800" : "text-red-800"
              }`}
            >
              {isSuccess ? "🎉 Payment Successful!" : "❌ Payment Failed"}
            </DialogTitle>

            <div
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-lg font-bold shadow-lg ${
                isSuccess
                  ? "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200"
                  : "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200"
              }`}
            >
              <CreditCard className="h-6 w-6" />
              {isSuccess ? "Transaction Completed ✨" : "Transaction Failed 💳"}
            </div>
          </div>

          {/* Content Area */}
          <div className="relative z-10 px-8 pb-12 w-full">
            <div
              className={`p-6 rounded-2xl mb-8 shadow-lg border-2 ${
                isSuccess
                  ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200"
                  : "bg-gradient-to-r from-red-50 to-rose-50 border-red-200"
              }`}
            >
              <p
                className={`text-center text-lg leading-relaxed font-medium ${
                  isSuccess ? "text-emerald-800" : "text-red-800"
                }`}
              >
                {isSuccess ? (
                  <>
                    <span className="block text-2xl mb-2">🚀 Awesome!</span>
                    Your booking has been confirmed successfully! Get ready for
                    an amazing learning experience.
                    <span className="block mt-3 text-base text-emerald-600">
                      Redirecting to your bookings in {countdown} seconds...
                    </span>
                  </>
                ) : (
                  <>
                    <span className="block text-2xl mb-2">😔 Oops!</span>
                    {message ||
                      "We encountered an issue while processing your payment. Please try again or contact our support team for assistance."}
                  </>
                )}
              </p>
            </div>

            {/* Action buttons */}
            {isSuccess ? (
              <div className="space-y-4">
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-6 text-lg rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300"
                  onClick={onCancel}
                >
                  <Calendar className="h-6 w-6 mr-3" />
                  View My Bookings
                  <ArrowRight className="h-6 w-6 ml-3" />
                </Button>

                <div className="flex justify-center">
                  <div className="flex items-center gap-3 text-base bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 px-6 py-3 rounded-2xl border border-emerald-200 shadow-md">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="font-semibold">
                      Auto-redirecting in {countdown}s
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {onRetry && (
                  <Button
                    onClick={onRetry}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-6 text-lg rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <CreditCard className="h-6 w-6 mr-3" />
                    Try Payment Again
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="w-full border-2 border-gray-300 hover:bg-gray-50 font-bold py-6 text-lg rounded-2xl shadow-lg transition-all duration-300"
                >
                  Go Back
                </Button>

                <div className="text-center">
                  <p className="text-gray-600 font-medium">
                    Need help? Contact our{" "}
                    <button className="text-red-600 font-bold hover:text-red-700 hover:underline transition-colors">
                      support team 💬
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
