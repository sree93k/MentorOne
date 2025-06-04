// "use client";

// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { CheckCircle, Mail } from "lucide-react";
// import { OtpInput } from "./OTPInput";
// import { EmailVerificationModalProps } from "@/types/modal";

// export function EmailVerificationModal({
//   open,
//   onOpenChange,
//   email,
//   onVerify,
//   onResendOtp,
//   onReportIssue,
// }: EmailVerificationModalProps) {
//   const [otp, setOtp] = useState("");
//   const [resendTimer, setResendTimer] = useState(60); // Start at 60
//   const [verifying, setVerifying] = useState(false);

//   // Timer logic
//   useEffect(() => {
//     let interval: NodeJS.Timeout;

//     if (open && resendTimer > 0) {
//       interval = setInterval(() => {
//         setResendTimer((prev) => {
//           if (prev <= 1) {
//             clearInterval(interval);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }

//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [open, resendTimer]); // Re-run when resendTimer changes

//   // Reset OTP and timer when modal opens
//   useEffect(() => {
//     if (open) {
//       setOtp(""); // Clear OTP input
//       setResendTimer(60); // Reset timer to 60 seconds
//     }
//   }, [open]);

//   const handleResendOtp = async () => {
//     if (resendTimer === 0) {
//       try {
//         await onResendOtp(); // Call the resend function (should trigger backend sendOTP)
//         setResendTimer(60); // Reset timer to 60 seconds
//         setOtp(""); // Clear the OTP input
//       } catch (error) {
//         console.error("Failed to resend OTP:", error);
//         // Optionally, show an error message to the user
//       }
//     }
//   };

//   const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, "$1****$3");

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md border-t-4 border-b-4 border-blue-600 rounded-lg p-0 bg-white">
//         <div className="p-6">
//           <div className="flex items-center gap-3 mb-2">
//             <CheckCircle className="h-8 w-8 text-green-500" />
//             <span className="text-gray-700 font-medium">
//               Great Almost Done!
//             </span>
//           </div>
//           <DialogHeader>
//             <DialogTitle className="text-xl font-semibold text-left">
//               Please Verify your Email
//             </DialogTitle>
//           </DialogHeader>
//           <div className="bg-green-100 rounded-md p-4 my-6 flex items-start gap-3">
//             <div className="bg-white rounded-full p-2 mt-1">
//               <Mail className="h-5 w-5 text-green-500" />
//             </div>
//             <p className="text-gray-700">
//               Enter the One Time Password (OTP) which has been sent to (
//               {maskedEmail})
//             </p>
//           </div>
//           <OtpInput value={otp} onChange={setOtp} length={5} />
//           <div className="mt-4 text-sm">
//             <p className="text-gray-700">
//               Didn't receive OTP? Resend in{" "}
//               {resendTimer > 0 ? (
//                 <span>{resendTimer}s</span>
//               ) : (
//                 <button
//                   onClick={handleResendOtp}
//                   className="text-blue-600 hover:underline font-medium"
//                 >
//                   Resend OTP
//                 </button>
//               )}
//             </p>
//             <p className="text-gray-700 mt-2">
//               Having Trouble?{" "}
//               <button
//                 onClick={onReportIssue}
//                 className="text-blue-600 hover:underline font-medium"
//               >
//                 Report Issue!
//               </button>
//             </p>
//           </div>
//         </div>
//         <DialogFooter className="flex flex-row justify-between p-4 bg-gray-50 rounded-b-lg">
//           <Button
//             variant="outline"
//             onClick={() => onOpenChange(false)}
//             className="rounded-full px-8"
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={() => onVerify(otp)}
//             disabled={otp.length !== 5 || verifying}
//             className="rounded-full px-8 bg-blue-600 hover:bg-blue-700"
//           >
//             {verifying ? "Verifying..." : "Verify Email"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail } from "lucide-react";
import { OtpInput } from "./OTPInput";
import { EmailVerificationModalProps } from "@/types/modal";

export function EmailVerificationModal({
  open,
  onOpenChange,
  email,
  onVerify,
  onResendOtp,
  onReportIssue,
}: EmailVerificationModalProps) {
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(60); // Start at 60
  const [verifying, setVerifying] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (open && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [open, resendTimer]); // Re-run when resendTimer changes

  // Reset OTP and timer when modal opens
  useEffect(() => {
    if (open) {
      setOtp(""); // Clear OTP input
      setResendTimer(60); // Reset timer to 60 seconds
    }
  }, [open]);

  // Handle Enter key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && open && otp.length === 5 && !verifying) {
        onVerify(otp);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, otp, verifying, onVerify]);

  // Handle OTP input change with number validation
  const handleOtpChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "");
    setOtp(numericValue);
  };

  const handleResendOtp = async () => {
    if (resendTimer === 0) {
      try {
        await onResendOtp(); // Call the resend function (should trigger backend sendOTP)
        setResendTimer(60); // Reset timer to 60 seconds
        setOtp(""); // Clear the OTP input
      } catch (error) {
        console.error("Failed to resend OTP:", error);
        // Optionally, show an error message to the user
      }
    }
  };

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, "$1****$3");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-t-4 border-b-4 border-blue-600 rounded-lg p-0 bg-white">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <span className="text-gray-700 font-medium">
              Great Almost Done!
            </span>
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-left">
              Please Verify your Email
            </DialogTitle>
          </DialogHeader>
          <div className="bg-green-100 rounded-md p-4 my-6 flex items-start gap-3">
            <div className="bg-white rounded-full p-2 mt-1">
              <Mail className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-gray-700">
              Enter the One Time Password (OTP) which has been sent to (
              {maskedEmail})
            </p>
          </div>
          <OtpInput value={otp} onChange={handleOtpChange} length={5} />
          <div className="mt-4 text-sm">
            <p className="text-gray-700">
              Didn't receive OTP? Resend in{" "}
              {resendTimer > 0 ? (
                <span>{resendTimer}s</span>
              ) : (
                <button
                  onClick={handleResendOtp}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Resend OTP
                </button>
              )}
            </p>
            <p className="text-gray-700 mt-2">
              Having Trouble?{" "}
              <button
                onClick={onReportIssue}
                className="text-blue-600 hover:underline font-medium"
              >
                Report Issue!
              </button>
            </p>
          </div>
        </div>
        <DialogFooter className="flex flex-row justify-between p-4 bg-gray-50 rounded-b-lg">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full px-8"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onVerify(otp)}
            disabled={otp.length !== 5 || verifying}
            className="rounded-full px-8 bg-blue-600 hover:bg-blue-700"
          >
            {verifying ? "Verifying..." : "Verify Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
