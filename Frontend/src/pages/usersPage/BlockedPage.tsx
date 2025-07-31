// import { useState } from "react";
// import { AlertTriangle, Mail, MessageSquare, Home, Shield } from "lucide-react";

// export const BlockedPage = () => {
//   const [appealSubmitted, setAppealSubmitted] = useState(false);
//   const [appealReason, setAppealReason] = useState("");

//   // Mock block data for demo
//   const blockData = {
//     reason: "Suspicious activity detected",
//     timestamp: new Date().toISOString(),
//   };

//   //   const handleSubmitAppeal = async () => {
//   //     try {
//   //       // Simulate API call
//   //       await new Promise((resolve) => setTimeout(resolve, 1000));
//   //       setAppealSubmitted(true);
//   //     } catch (error) {
//   //       console.error("Error submitting appeal:", error);
//   //     }
//   //   };
//   // Submit appeal
//   const handleSubmitAppeal = async () => {
//     try {
//       console.log("🚀 BlockedPage: Starting appeal submission process");
//       console.log("🚀 BlockedPage: Form data", formData);

//       setIsSubmitting(true);
//       setErrors([]);

//       console.log("🔍 BlockedPage: Validating appeal data");

//       // Validate form data
//       const validation = appealService.validateAppealData(formData);

//       if (!validation.isValid) {
//         console.log("❌ BlockedPage: Validation failed", validation.errors);
//         setErrors(validation.errors);
//         setIsSubmitting(false);
//         return;
//       }

//       console.log(
//         "✅ BlockedPage: Validation passed, submitting appeal via service"
//       );

//       // Submit appeal
//       const result = await appealService.submitAppeal(formData);

//       console.log("🔍 BlockedPage: Appeal service result", result);

//       if (result.success) {
//         setAppealSubmitted(true);
//         setAppealId(result.data?.appealId || null);
//         setShowForm(false);

//         console.log("✅ BlockedPage: Appeal submitted successfully", {
//           appealId: result.data?.appealId,
//         });
//       } else {
//         console.error("❌ BlockedPage: Appeal submission failed", {
//           message: result.message,
//           errors: result.error,
//         });
//         setErrors([result.message]);
//       }
//     } catch (error: any) {
//       console.error(
//         "❌ BlockedPage: Unexpected error during appeal submission",
//         error
//       );
//       setErrors(["An unexpected error occurred. Please try again."]);
//     } finally {
//       console.log("🔍 BlockedPage: Appeal submission process completed");
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
//       <div className="w-full max-w-4xl">
//         <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
//           {/* Header Section */}
//           <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border-b border-white/10 p-6">
//             <div className="flex items-center justify-center space-x-3 mb-3">
//               <div className="p-3 bg-red-500/20 rounded-full">
//                 <Shield className="h-8 w-8 text-red-400" />
//               </div>
//               <div className="text-center">
//                 <h1 className="text-2xl font-bold text-white">
//                   Access Restricted
//                 </h1>
//                 <p className="text-red-200 text-sm">
//                   Account temporarily suspended
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="p-6 space-y-6">
//             {/* Block Details */}
//             {blockData && (
//               <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
//                 <div className="flex items-start space-x-3">
//                   <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
//                   <div className="space-y-1">
//                     <p className="text-red-300 font-medium">
//                       {blockData.reason}
//                     </p>
//                     <p className="text-red-400/70 text-sm">
//                       {new Date(blockData.timestamp).toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Main Content Grid */}
//             <div className="grid md:grid-cols-2 gap-6">
//               {/* Appeal Section */}
//               <div className="bg-white/5 border border-white/10 rounded-xl p-5">
//                 {!appealSubmitted ? (
//                   <div className="space-y-4">
//                     <div className="flex items-center space-x-2 mb-3">
//                       <MessageSquare className="h-5 w-5 text-blue-400" />
//                       <h3 className="font-semibold text-white">
//                         Submit Appeal
//                       </h3>
//                     </div>
//                     <p className="text-gray-300 text-sm">
//                       Explain why this action should be reviewed:
//                     </p>
//                     <textarea
//                       value={appealReason}
//                       onChange={(e) => setAppealReason(e.target.value)}
//                       placeholder="Describe your situation..."
//                       className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 resize-none h-20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
//                       maxLength={500}
//                     />
//                     <div className="flex justify-between items-center">
//                       <span className="text-xs text-gray-400">
//                         {appealReason.length}/500
//                       </span>
//                       <button
//                         onClick={handleSubmitAppeal}
//                         disabled={appealReason.length < 10}
//                         className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//                       >
//                         Submit
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
//                     <div className="flex items-center space-x-2">
//                       <div className="w-2 h-2 bg-green-400 rounded-full"></div>
//                       <h3 className="font-semibold text-green-300">
//                         Appeal Submitted
//                       </h3>
//                     </div>
//                     <p className="text-green-400/80 text-sm mt-2">
//                       We'll review your case and contact you via email.
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Contact Support */}
//               <div className="bg-white/5 border border-white/10 rounded-xl p-5">
//                 <div className="flex items-center space-x-2 mb-3">
//                   <Mail className="h-5 w-5 text-purple-400" />
//                   <h3 className="font-semibold text-white">Need Help?</h3>
//                 </div>
//                 <p className="text-gray-300 text-sm mb-4">
//                   Contact our support team:
//                 </p>
//                 <div className="space-y-2">
//                   <a
//                     href="mailto:sreekuttan12kaathu@gmail.com"
//                     className="flex items-center space-x-2 text-purple-300 hover:text-purple-200 transition-colors text-sm"
//                   >
//                     <span>📧</span>
//                     <span>sreekuttan12kaathu@gmail.com</span>
//                   </a>
//                   <p className="text-xs text-gray-400">
//                     Include your user ID in your message
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="pt-4 border-t border-white/10 text-center">
//               <button
//                 onClick={() => (window.location.href = "/")}
//                 className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-200 text-sm"
//               >
//                 <Home className="h-4 w-4" />
//                 <span>Return Home</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlockedPage;
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertTriangle, Mail, MessageSquare, Home, Shield } from "lucide-react";

interface BlockData {
  reason: string;
  category: string;
  adminEmail: string;
  timestamp: string;
  canAppeal: boolean;
  severity?: "high" | "medium" | "low";
}

export const BlockedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get block data from navigation state or use default
  const blockData = (location.state?.blockData as BlockData) || {
    reason: "Account has been suspended due to policy violations",
    category: "terms_violation",
    adminEmail: "sreekuttan12kaathu@gmail.com",
    timestamp: new Date().toISOString(),
    canAppeal: true,
    severity: "medium",
  };

  const handleStartAppeal = () => {
    navigate("/appeal/submit", {
      state: {
        blockData,
        userInfo: {
          // You can pass user info if available
          email: localStorage.getItem("userEmail") || "",
          firstName: localStorage.getItem("userFirstName") || "",
          lastName: localStorage.getItem("userLastName") || "",
        },
      },
    });
  };

  const getSeverityColor = () => {
    switch (blockData?.severity) {
      case "high":
        return "from-red-500/20 to-red-600/20";
      case "medium":
        return "from-orange-500/20 to-orange-600/20";
      case "low":
        return "from-blue-500/20 to-blue-600/20";
      default:
        return "from-red-500/20 to-pink-500/20";
    }
  };

  const getSeverityBadge = () => {
    switch (blockData?.severity) {
      case "high":
        return "bg-red-500/20 text-red-300";
      case "medium":
        return "bg-orange-500/20 text-orange-300";
      case "low":
        return "bg-blue-500/20 text-blue-300";
      default:
        return "bg-red-500/20 text-red-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div
            className={`bg-gradient-to-r ${getSeverityColor()} border-b border-white/10 p-6`}
          >
            <div className="flex items-center justify-center space-x-3 mb-3">
              <div className="p-3 bg-red-500/20 rounded-full">
                <Shield className="h-8 w-8 text-red-400" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white">
                  Account Suspended
                </h1>
                <p className="text-red-200 text-sm">
                  Access temporarily restricted
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Block Details */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <div>
                    <p className="text-red-300 font-medium text-base">
                      {blockData.reason}
                    </p>
                    <p className="text-red-400/70 text-sm mt-1">
                      Category:{" "}
                      {blockData.category.replace("_", " ").toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-red-400/70 text-sm">
                      Suspended:{" "}
                      {new Date(blockData.timestamp).toLocaleString()}
                    </p>
                    {blockData.severity && (
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityBadge()}`}
                      >
                        {blockData.severity.toUpperCase()} PRIORITY
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* What This Means */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <h3 className="text-blue-300 font-semibold mb-2 flex items-center">
                <span className="mr-2">ℹ️</span>
                What this means:
              </h3>
              <ul className="text-blue-200/80 text-sm space-y-1">
                <li>• Your account access has been temporarily suspended</li>
                <li>• All active sessions have been terminated</li>
                <li>• Your account data remains secure and preserved</li>
                <li>
                  • You can appeal this decision if you believe it's incorrect
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Appeal Button */}
              {blockData.canAppeal && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <div className="flex items-center space-x-2 mb-3">
                    <MessageSquare className="h-5 w-5 text-blue-400" />
                    <h3 className="font-semibold text-white">
                      Disagree with this decision?
                    </h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    If you believe this suspension was made in error, you can
                    submit an appeal for review.
                  </p>
                  <button
                    onClick={handleStartAppeal}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                  >
                    Submit Appeal
                  </button>
                </div>
              )}

              {/* Contact Support */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="flex items-center space-x-2 mb-3">
                  <Mail className="h-5 w-5 text-purple-400" />
                  <h3 className="font-semibold text-white">Need Help?</h3>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Contact our support team:
                </p>
                <div className="space-y-3">
                  <a
                    href={`mailto:${blockData.adminEmail}`}
                    className="flex items-center space-x-2 text-purple-300
                  hover:text-purple-200 transition-colors text-sm"
                  >
                    <span>📧</span>
                    <span>{blockData.adminEmail}</span>
                  </a>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                    <p className="text-purple-300 text-xs">
                      <strong>When contacting support:</strong>
                      <br />
                      • Include your email address
                      <br />
                      • Reference this suspension
                      <br />• Provide relevant details
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-white/10 text-center">
              <button
                onClick={() => (window.location.href = "/")}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 border border-white/20 text-white rounded-lg hover:bg-slate-700 transition-all duration-200 text-sm"
              >
                <Home className="h-4 w-4" />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockedPage;
