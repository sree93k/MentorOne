// // // import { useEffect, useState } from "react";
// // // import {
// // //   Dialog,
// // //   DialogContent,
// // //   DialogHeader,
// // //   DialogTitle,
// // // } from "@/components/ui/dialog";
// // // import { Button } from "@/components/ui/button";
// // // import { CheckCircle, XCircle, CreditCard, RotateCcw } from "lucide-react";

// // // interface PaymentStatusModalProps {
// // //   isOpen: boolean;
// // //   status: "success" | "failure" | null;
// // //   message?: string;
// // //   onRetry?: () => void;
// // //   onCancel: () => void;
// // // }

// // // export default function PaymentStatusModal({
// // //   isOpen,
// // //   status,
// // //   message,
// // //   onRetry,
// // //   onCancel,
// // // }: PaymentStatusModalProps) {
// // //   const [countdown, setCountdown] = useState(3);

// // //   useEffect(() => {
// // //     if (isOpen && status === "success") {
// // //       const timer = setInterval(() => {
// // //         setCountdown((prev) => {
// // //           if (prev <= 1) {
// // //             clearInterval(timer);
// // //             onCancel();
// // //             return 0;
// // //           }
// // //           return prev - 1;
// // //         });
// // //       }, 1000);

// // //       return () => clearInterval(timer);
// // //     }
// // //   }, [isOpen, status, onCancel]);

// // //   const isSuccess = status === "success";

// // //   return (
// // //     <Dialog open={isOpen} onOpenChange={onCancel}>
// // //       <DialogContent className="sm:max-w-md border-0 p-0 overflow-hidden bg-transparent shadow-none">
// // //         <div
// // //           className={`relative rounded-2xl overflow-hidden ${
// // //             isSuccess
// // //               ? "bg-gradient-to-br from-emerald-50 via-white to-green-50"
// // //               : "bg-gradient-to-br from-red-50 via-white to-rose-50"
// // //           }`}
// // //         >
// // //           {/* Animated background pattern */}
// // //           <div className="absolute inset-0 opacity-5">
// // //             <div
// // //               className={`absolute top-4 right-4 w-32 h-32 rounded-full ${
// // //                 isSuccess ? "bg-emerald-400" : "bg-red-400"
// // //               } animate-pulse`}
// // //             ></div>
// // //             <div
// // //               className={`absolute bottom-8 left-4 w-20 h-20 rounded-full ${
// // //                 isSuccess ? "bg-green-300" : "bg-rose-300"
// // //               } animate-bounce`}
// // //             ></div>
// // //           </div>

// // //           {/* Header with icon */}
// // //           <div className="relative px-6 pt-8 pb-6 text-center">
// // //             <div
// // //               className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
// // //                 isSuccess
// // //                   ? "bg-gradient-to-r from-emerald-400 to-green-500 shadow-lg shadow-emerald-200"
// // //                   : "bg-gradient-to-r from-red-400 to-rose-500 shadow-lg shadow-red-200"
// // //               } animate-bounce`}
// // //             >
// // //               {isSuccess ? (
// // //                 <CheckCircle className="h-10 w-10 text-white" />
// // //               ) : (
// // //                 <XCircle className="h-10 w-10 text-white" />
// // //               )}
// // //             </div>

// // //             <DialogTitle
// // //               className={`text-2xl font-bold mb-2 ${
// // //                 isSuccess ? "text-emerald-800" : "text-red-800"
// // //               }`}
// // //             >
// // //               {isSuccess ? "Payment Successful!" : "Payment Failed"}
// // //             </DialogTitle>

// // //             <div
// // //               className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
// // //                 isSuccess
// // //                   ? "bg-emerald-100 text-emerald-700"
// // //                   : "bg-red-100 text-red-700"
// // //               }`}
// // //             >
// // //               <CreditCard className="h-4 w-4" />
// // //               {isSuccess ? "Transaction Complete" : "Transaction Failed"}
// // //             </div>
// // //           </div>

// // //           {/* Content */}
// // //           <div className="px-6 pb-8">
// // //             <div
// // //               className={`p-4 rounded-xl mb-6 ${
// // //                 isSuccess
// // //                   ? "bg-emerald-50 border border-emerald-100"
// // //                   : "bg-red-50 border border-red-100"
// // //               }`}
// // //             >
// // //               <p
// // //                 className={`text-center text-sm leading-relaxed ${
// // //                   isSuccess ? "text-emerald-700" : "text-red-700"
// // //                 }`}
// // //               >
// // //                 {isSuccess
// // //                   ? `Your payment was processed successfully! You'll be redirected to your bookings in ${countdown} seconds.`
// // //                   : message ||
// // //                     "We encountered an issue while processing your payment. Please try again or contact support if the problem persists."}
// // //               </p>
// // //             </div>

// // //             {/* Action buttons */}
// // //             {isSuccess ? (
// // //               <div className="space-y-3">
// // //                 <Button
// // //                   className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-emerald-200 transition-all duration-200 transform hover:scale-[1.02]"
// // //                   onClick={onCancel}
// // //                 >
// // //                   View My Bookings
// // //                 </Button>
// // //                 <div className="flex justify-center">
// // //                   <div
// // //                     className={`flex items-center gap-2 text-xs text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full`}
// // //                   >
// // //                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
// // //                     Auto-redirecting in {countdown}s
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             ) : (
// // //               <div className="space-y-3">
// // //                 <div className="flex gap-3">
// // //                   <Button
// // //                     variant="outline"
// // //                     className="flex-1 border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl transition-all duration-200"
// // //                     onClick={onCancel}
// // //                   >
// // //                     Cancel
// // //                   </Button>
// // //                   {onRetry && (
// // //                     <Button
// // //                       className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-red-200 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
// // //                       onClick={onRetry}
// // //                     >
// // //                       <RotateCcw className="h-4 w-4" />
// // //                       Try Again
// // //                     </Button>
// // //                   )}
// // //                 </div>

// // //                 <div className="text-center">
// // //                   <p className="text-xs text-gray-500">
// // //                     Need help? Contact our{" "}
// // //                     <span className="text-red-600 font-medium cursor-pointer hover:underline">
// // //                       support team
// // //                     </span>
// // //                   </p>
// // //                 </div>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </DialogContent>
// // //     </Dialog>
// // //   );
// // // }
// // import { useEffect, useState } from "react";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader, // Although we might bypass it for custom layout
// //   DialogTitle,
// // } from "@/components/ui/dialog";
// // import { Button } from "@/components/ui/button";
// // import { CheckCircle, XCircle, CreditCard, RotateCcw } from "lucide-react";

// // // Assuming you have this installed for confetti, otherwise remove or replace
// // import ConfettiExplosion from "react-confetti-explosion"; // npm install react-confetti-explosion

// // interface PaymentStatusModalProps {
// //   isOpen: boolean;
// //   status: "success" | "failure" | null;
// //   message?: string;
// //   onRetry?: () => void;
// //   onCancel: () => void;
// // }

// // export default function PaymentStatusModal({
// //   isOpen,
// //   status,
// //   message,
// //   onRetry,
// //   onCancel,
// // }: PaymentStatusModalProps) {
// //   const [countdown, setCountdown] = useState(3);
// //   const [isExploding, setIsExploding] = useState(false); // State for confetti

// //   useEffect(() => {
// //     if (isOpen) {
// //       if (status === "success") {
// //         setIsExploding(true); // Trigger confetti
// //         const timer = setInterval(() => {
// //           setCountdown((prev) => {
// //             if (prev <= 1) {
// //               clearInterval(timer);
// //               onCancel(); // Call onCancel when countdown finishes
// //               return 0;
// //             }
// //             return prev - 1;
// //           });
// //         }, 1000);

// //         return () => {
// //           clearInterval(timer);
// //           setIsExploding(false); // Reset confetti on unmount or status change
// //         };
// //       } else {
// //         setIsExploding(false); // Ensure confetti is off for failure/other states
// //         setCountdown(3); // Reset countdown for future successes
// //       }
// //     }
// //   }, [isOpen, status, onCancel]);

// //   const isSuccess = status === "success";

// //   return (
// //     <Dialog open={isOpen} onOpenChange={onCancel}>
// //       {/* DialogContent takes care of the dark overlay and centers the modal.
// //           We'll give it a defined size and background for content to appear. */}
// //       <DialogContent
// //         className={`
// //           sm:max-w-md w-[calc(100%-2rem)] max-h-[90vh]
// //           rounded-2xl p-0 overflow-hidden
// //           border-0 shadow-lg // Removed bg-transparent and border for the inner div to handle it
// //           animate-fade-in
// //         `}
// //       >
// //         {/* Main container for the modal's visible content and background */}
// //         <div
// //           className={`
// //             relative flex flex-col items-center justify-between h-full w-full p-0
// //             ${
// //               isSuccess
// //                 ? "bg-gradient-to-br from-emerald-50 via-white to-green-50"
// //                 : "bg-gradient-to-br from-red-50 via-white to-rose-50"
// //             }
// //           `}
// //         >
// //           {/* Confetti Explosion (rendered above everything else, but within the modal bounds) */}
// //           {isSuccess && isExploding && (
// //             <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
// //               <ConfettiExplosion
// //                 force={0.8}
// //                 duration={3500} // Increased duration for a longer effect
// //                 particleCount={250} // More particles
// //                 width={2000} // Wider spread
// //                 onComplete={() => setIsExploding(false)}
// //               />
// //             </div>
// //           )}

// //           {/* Animated background pattern */}
// //           <div className="absolute inset-0 opacity-10 pointer-events-none">
// //             <div
// //               className={`absolute top-4 left-4 w-40 h-40 rounded-full ${
// //                 isSuccess ? "bg-emerald-400" : "bg-red-400"
// //               } animate-blob-pulse`}
// //             ></div>
// //             <div
// //               className={`absolute bottom-8 right-8 w-24 h-24 rounded-full ${
// //                 isSuccess ? "bg-green-300" : "bg-rose-300"
// //               } animate-blob-bounce`}
// //             ></div>
// //           </div>

// //           {/* Header with icon and title */}
// //           <div className="relative z-10 px-6 pt-10 pb-6 text-center w-full">
// //             <div
// //               className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
// //                 isSuccess
// //                   ? "bg-gradient-to-r from-emerald-400 to-green-500 shadow-xl shadow-emerald-300"
// //                   : "bg-gradient-to-r from-red-400 to-rose-500 shadow-xl shadow-red-300"
// //               } animate-pop-in`}
// //             >
// //               {isSuccess ? (
// //                 <CheckCircle className="h-12 w-12 text-white" />
// //               ) : (
// //                 <XCircle className="h-12 w-12 text-white" />
// //               )}
// //             </div>

// //             <DialogTitle
// //               className={`text-3xl font-extrabold mb-3 ${
// //                 isSuccess ? "text-emerald-800" : "text-red-800"
// //               }`}
// //             >
// //               {isSuccess ? "Payment Successful!" : "Payment Failed"}
// //             </DialogTitle>

// //             <div
// //               className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-base font-medium ${
// //                 isSuccess
// //                   ? "bg-emerald-100 text-emerald-700"
// //                   : "bg-red-100 text-red-700"
// //               } shadow-sm`}
// //             >
// //               <CreditCard className="h-5 w-5" />
// //               {isSuccess ? "Transaction Complete" : "Transaction Failed"}
// //             </div>
// //           </div>

// //           {/* Content Area */}
// //           <div className="relative z-10 px-6 pb-10 w-full">
// //             <div
// //               className={`p-5 rounded-xl mb-8 ${
// //                 isSuccess
// //                   ? "bg-emerald-50 border border-emerald-100"
// //                   : "bg-red-50 border border-red-100"
// //               }`}
// //             >
// //               <p
// //                 className={`text-center text-base leading-relaxed ${
// //                   isSuccess ? "text-emerald-700" : "text-red-700"
// //                 }`}
// //               >
// //                 {isSuccess
// //                   ? `Your payment was processed successfully! You'll be redirected to your bookings in ${countdown} seconds.`
// //                   : message ||
// //                     "We encountered an issue while processing your payment. Please try again or contact support if the problem persists."}
// //               </p>
// //             </div>

// //             {/* Action buttons */}
// //             {isSuccess ? (
// //               <div className="space-y-4">
// //                 <Button
// //                   className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center gap-2 text-lg"
// //                   onClick={onCancel} // This will trigger the redirect
// //                 >
// //                   <CheckCircle className="h-5 w-5" />
// //                   View My Bookings
// //                 </Button>
// //                 <div className="flex justify-center mt-3">
// //                   <div
// //                     className={`flex items-center gap-2 text-sm ${
// //                       isSuccess
// //                         ? "text-emerald-600 bg-emerald-100"
// //                         : "text-gray-600 bg-gray-100"
// //                     } px-4 py-1.5 rounded-full`}
// //                   >
// //                     <div
// //                       className={`w-2.5 h-2.5 ${
// //                         isSuccess ? "bg-emerald-500" : "bg-gray-500"
// //                       } rounded-full animate-pulse`}
// //                     ></div>
// //                     Auto-redirecting in {countdown}s
// //                   </div>
// //                 </div>
// //               </div>
// //             ) : (
// //               <div className="space-y-4">
// //                 <div className="flex flex-col sm:flex-row gap-3">
// //                   <Button
// //                     variant="outline"
// //                     className="flex-1 border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl transition-all duration-200 text-base"
// //                     onClick={onCancel}
// //                   >
// //                     Cancel
// //                   </Button>
// //                   {onRetry && (
// //                     <Button
// //                       className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-red-200 transition-all duration-200 transform hover:scale-[1.01] flex items-center justify-center gap-2 text-base"
// //                       onClick={onRetry}
// //                     >
// //                       <RotateCcw className="h-5 w-5" />
// //                       Try Again
// //                     </Button>
// //                   )}
// //                 </div>

// //                 <div className="text-center mt-4">
// //                   <p className="text-sm text-gray-500">
// //                     Need help? Contact our{" "}
// //                     <span className="text-red-600 font-medium cursor-pointer hover:underline">
// //                       support team
// //                     </span>
// //                   </p>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }
// import { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   // DialogHeader, // We'll handle custom header layout
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { CheckCircle, XCircle, CreditCard, RotateCcw } from "lucide-react";
// import ConfettiExplosion from "react-confetti-explosion"; // npm install react-confetti-explosion

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
//       {/* DialogContent: Let it handle its default centering.
//           We apply minimal styling here and let the INNER div control the main visual.
//           Increased max-w for a slightly larger modal. */}
//       <DialogContent
//         className={`
//           max-w-lg // Increased size from sm:max-w-md
//           w-[calc(100%-2rem)] // Responsive width
//           p-0 overflow-hidden rounded-2xl
//           border-0 bg-transparent shadow-none // Let inner div handle background, border, shadow
//         `}
//       >
//         {/* This inner div is now responsible for ALL visible styling (background, border, shadow, content padding) */}
//         <div
//           className={`
//             relative flex flex-col items-center justify-between h-full w-full
//             rounded-2xl // Apply border radius here
//             shadow-lg // Apply shadow here
//             ${
//               isSuccess
//                 ? "bg-gradient-to-br from-emerald-50 via-white to-green-50"
//                 : "bg-gradient-to-br from-red-50 via-white to-rose-50"
//             }
//           `}
//         >
//           {/* Confetti Explosion (rendered above everything else, but within the modal bounds) */}
//           {isSuccess && isExploding && (
//             <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
//               <ConfettiExplosion
//                 force={0.8}
//                 duration={3500} // Increased duration for a longer effect
//                 particleCount={250} // More particles
//                 width={2000} // Wider spread
//                 onComplete={() => setIsExploding(false)}
//               />
//             </div>
//           )}

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
//                 <div className="flex flex-col sm:flex-row gap-3">
//                   <Button
//                     variant="outline"
//                     className="flex-1 border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl transition-all duration-200 text-base"
//                     onClick={onCancel}
//                   >
//                     Cancel
//                   </Button>
//                   {onRetry && (
//                     <Button
//                       className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-red-200 transition-all duration-200 transform hover:scale-[1.01] flex items-center justify-center gap-2 text-base"
//                       onClick={onRetry}
//                     >
//                       <RotateCcw className="h-5 w-5" />
//                       Try Again
//                     </Button>
//                   )}
//                 </div>

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
import { CheckCircle, XCircle, CreditCard, RotateCcw } from "lucide-react";
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
                {/* <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl transition-all duration-200 text-base"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                  {onRetry && (
                    <Button
                      className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-red-200 transition-all duration-200 transform hover:scale-[1.01] flex items-center justify-center gap-2 text-base"
                      onClick={onRetry}
                    >
                      <RotateCcw className="h-5 w-5" />
                      Try Again
                    </Button>
                  )}
                </div> */}

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
