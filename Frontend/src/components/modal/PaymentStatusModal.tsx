import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, CreditCard } from "lucide-react";
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
  const [countdown, setCountdown] = useState(3);
  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (status === "success") {
        setIsExploding(true); // Trigger confetti on success

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
          setIsExploding(false); // Reset confetti on unmount or status change
        };
      } else {
        setIsExploding(false); // Ensure confetti is off for failure/other states
        setCountdown(3); // Reset countdown for future successes
      }
    }
  }, [isOpen, status, onCancel]);

  const isSuccess = status === "success";

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      {status === "success" && isExploding && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[9999]">
          {" "}
          {/* Very high z-index */}
          <ConfettiExplosion
            force={0.8}
            duration={3500}
            particleCount={250}
            width={2000}
            onComplete={() => setIsExploding(false)}
          />
        </div>
      )}

      <DialogContent
        className={`
          max-w-lg
          w-[calc(100%-2rem)]
          p-0 overflow-hidden rounded-2xl
          border-0 bg-transparent shadow-none
        `}
      >
        <div
          className={`
            relative flex flex-col items-center justify-between h-full w-full
            rounded-2xl
            shadow-lg
            ${
              isSuccess
                ? "bg-gradient-to-br from-emerald-50 via-white to-green-50"
                : "bg-gradient-to-br from-red-50 via-white to-rose-50"
            }
          `}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div
              className={`absolute top-4 left-4 w-40 h-40 rounded-full ${
                isSuccess ? "bg-emerald-400" : "bg-red-400"
              } animate-blob-pulse`}
            ></div>
            <div
              className={`absolute bottom-8 right-8 w-24 h-24 rounded-full ${
                isSuccess ? "bg-green-300" : "bg-rose-300"
              } animate-blob-bounce`}
            ></div>
          </div>

          {/* Header with icon and title */}
          <div className="relative z-10 px-6 pt-10 pb-6 text-center w-full">
            <div
              className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
                isSuccess
                  ? "bg-gradient-to-r from-emerald-400 to-green-500 shadow-xl shadow-emerald-300"
                  : "bg-gradient-to-r from-red-400 to-rose-500 shadow-xl shadow-red-300"
              } animate-pop-in`}
            >
              {isSuccess ? (
                <CheckCircle className="h-12 w-12 text-white" />
              ) : (
                <XCircle className="h-12 w-12 text-white" />
              )}
            </div>

            <DialogTitle
              className={`text-3xl font-extrabold mb-3 ${
                isSuccess ? "text-emerald-800" : "text-red-800"
              }`}
            >
              {isSuccess ? "Payment Successful!" : "Payment Failed"}
            </DialogTitle>

            <div
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-base font-medium ${
                isSuccess
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              } shadow-sm`}
            >
              <CreditCard className="h-5 w-5" />
              {isSuccess ? "Transaction Complete" : "Transaction Failed"}
            </div>
          </div>

          {/* Content Area */}
          <div className="relative z-10 px-6 pb-10 w-full">
            <div
              className={`p-5 rounded-xl mb-8 ${
                isSuccess
                  ? "bg-emerald-50 border border-emerald-100"
                  : "bg-red-50 border border-red-100"
              }`}
            >
              <p
                className={`text-center text-base leading-relaxed ${
                  isSuccess ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {isSuccess
                  ? `Your payment was processed successfully! You'll be redirected to your bookings in ${countdown} seconds.`
                  : message ||
                    "We encountered an issue while processing your payment. Please try again or contact support if the problem persists."}
              </p>
            </div>

            {/* Action buttons */}
            {isSuccess ? (
              <div className="space-y-4">
                <Button
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center gap-2 text-lg"
                  onClick={onCancel} // This will trigger the redirect
                >
                  <CheckCircle className="h-5 w-5" />
                  View My Bookings
                </Button>
                <div className="flex justify-center mt-3">
                  <div
                    className={`flex items-center gap-2 text-sm ${
                      isSuccess
                        ? "text-emerald-600 bg-emerald-100"
                        : "text-gray-600 bg-gray-100"
                    } px-4 py-1.5 rounded-full`}
                  >
                    <div
                      className={`w-2.5 h-2.5 ${
                        isSuccess ? "bg-emerald-500" : "bg-gray-500"
                      } rounded-full animate-pulse`}
                    ></div>
                    Auto-redirecting in {countdown}s
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-500">
                    Need help? Contact our{" "}
                    <span className="text-red-600 font-medium cursor-pointer hover:underline">
                      support team
                    </span>
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
