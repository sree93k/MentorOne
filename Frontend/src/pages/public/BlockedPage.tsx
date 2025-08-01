// // import React from "react";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import {
// //   AlertTriangle,
// //   Mail,
// //   MessageSquare,
// //   Home,
// //   Shield,
// //   CheckCircle,
// //   XCircle,
// //   Clock,
// //   Loader2,
// // } from "lucide-react";
// // import { useEffect, useState } from "react";
// // import { toast } from "react-hot-toast"; // ✅ ADD this import
// // import appealService, { AppealSubmissionData } from "@/services/appealService";
// // interface BlockData {
// //   reason: string;
// //   category: string;
// //   adminEmail: string;
// //   timestamp: string;
// //   canAppeal: boolean;
// //   severity?: "high" | "medium" | "low";
// // }
// // interface ExistingAppeal {
// //   _id: string;
// //   status: string;
// //   appealCount: number;
// //   canReappeal: boolean;
// //   submittedAt: string;
// //   adminResponse?: string;
// // }
// // export const BlockedPage = () => {
// //   const location = useLocation();
// //   const navigate = useNavigate();

// //   // Get block data from navigation state
// //   const blockData = location.state?.blockData as BlockData | undefined;

// //   // ✅ NEW: State for existing appeals
// //   const [existingAppeal, setExistingAppeal] = useState<ExistingAppeal | null>(
// //     null
// //   );
// //   const [checkingAppeals, setCheckingAppeals] = useState(true);

// //   // Form state (only used if no existing appeal)
// //   const [formData, setFormData] = useState<AppealSubmissionData>({
// //     email: "",
// //     firstName: "",
// //     lastName: "",
// //     appealMessage: "",
// //     category: "wrongful_block",
// //   });

// //   // UI state
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [appealSubmitted, setAppealSubmitted] = useState(false);
// //   const [appealId, setAppealId] = useState<string | null>(null);
// //   const [errors, setErrors] = useState<string[]>([]);
// //   const [showForm, setShowForm] = useState(false);

// //   // ✅ NEW: Check for existing appeals
// //   useEffect(() => {
// //     checkExistingAppeals();
// //   }, []);

// //   const checkExistingAppeals = async () => {
// //     try {
// //       setCheckingAppeals(true);
// //       const userInfo = appealService.getUserInfoFromStorage();

// //       if (userInfo.email) {
// //         console.log(
// //           "🔍 BlockedPage: Checking existing appeals for",
// //           userInfo.email
// //         );

// //         // ✅ Use service instead of direct fetch
// //         const result = await appealService.getLatestAppealByEmail(
// //           userInfo.email
// //         );

// //         console.log("🔍 BlockedPage: Service response", result);

// //         if (result.success && result.data) {
// //           setExistingAppeal(result.data);
// //           console.log("✅ BlockedPage: Found existing appeal", result.data);
// //         } else {
// //           console.log("ℹ️ BlockedPage: No existing appeal found");
// //         }
// //       }
// //     } catch (error) {
// //       console.error("❌ BlockedPage: Error checking existing appeals", error);
// //     } finally {
// //       setCheckingAppeals(false);
// //     }
// //   };

// //   // Initialize form with user data
// //   useEffect(() => {
// //     const userInfo = appealService.getUserInfoFromStorage();
// //     setFormData((prev) => ({
// //       ...prev,
// //       ...userInfo,
// //     }));
// //   }, []);

// //   // ✅ NEW: Navigate to appeal status
// //   const handleViewAppealStatus = () => {
// //     if (existingAppeal?._id) {
// //       navigate(`/appeal/status/${existingAppeal._id}`);
// //     }
// //   };

// //   // ✅ NEW: Handle re-appeal (only for rejected appeals)
// //   const handleReappeal = () => {
// //     if (existingAppeal?.canReappeal) {
// //       setShowForm(true);
// //     } else {
// //       // Show contact support message
// //       toast.error(
// //         "You have reached the maximum number of appeals. Please contact support directly."
// //       );
// //     }
// //   };

// //   // Rest of existing functions remain the same...
// //   const handleInputChange = (
// //     field: keyof AppealSubmissionData,
// //     value: string
// //   ) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       [field]: value,
// //     }));

// //     if (errors.length > 0) {
// //       setErrors([]);
// //     }
// //   };

// //   const handleSubmitAppeal = async () => {
// //     try {
// //       setIsSubmitting(true);
// //       setErrors([]);

// //       const validation = appealService.validateAppealData(formData);

// //       if (!validation.isValid) {
// //         setErrors(validation.errors);
// //         setIsSubmitting(false);
// //         return;
// //       }

// //       const result = await appealService.submitAppeal(formData);

// //       if (result.success) {
// //         setAppealSubmitted(true);
// //         setAppealId(result.data?.appealId || null);
// //         setShowForm(false);

// //         // Refresh appeal status
// //         await checkExistingAppeals();
// //       } else {
// //         setErrors([result.message]);
// //       }
// //     } catch (error: any) {
// //       console.error("❌ BlockedPage: Error submitting appeal", error);
// //       setErrors(["An unexpected error occurred. Please try again."]);
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   const getSeverityColor = () => {
// //     switch (blockData?.severity) {
// //       case "high":
// //         return "from-red-500/20 to-red-600/20";
// //       case "medium":
// //         return "from-orange-500/20 to-orange-600/20";
// //       case "low":
// //         return "from-blue-500/20 to-blue-600/20";
// //       default:
// //         return "from-red-500/20 to-pink-500/20";
// //     }
// //   };

// //   // ✅ NEW: Get appeal status display
// //   const getAppealStatusDisplay = () => {
// //     if (!existingAppeal) return null;

// //     switch (existingAppeal.status) {
// //       case "pending":
// //         return {
// //           icon: <Clock className="h-5 w-5 text-amber-400" />,
// //           title: "Appeal Under Review",
// //           description:
// //             "Your appeal is being reviewed by our team. You'll receive an email with the decision within 24-48 hours.",
// //           bgColor: "bg-amber-500/10 border-amber-500/30",
// //           textColor: "text-amber-300",
// //           action: "View Status",
// //         };
// //       case "under_review":
// //         return {
// //           icon: <AlertTriangle className="h-5 w-5 text-blue-400" />,
// //           title: "Appeal In Progress",
// //           description:
// //             "An admin is currently reviewing your appeal. Please wait for the final decision.",
// //           bgColor: "bg-blue-500/10 border-blue-500/30",
// //           textColor: "text-blue-300",
// //           action: "View Status",
// //         };
// //       case "approved":
// //         return {
// //           icon: <CheckCircle className="h-5 w-5 text-green-400" />,
// //           title: "Appeal Approved!",
// //           description:
// //             "Great news! Your appeal has been approved and your account has been restored.",
// //           bgColor: "bg-green-500/10 border-green-500/30",
// //           textColor: "text-green-300",
// //           action: "Login to Account",
// //         };
// //       case "rejected":
// //         return {
// //           icon: <XCircle className="h-5 w-5 text-red-400" />,
// //           title: "Appeal Rejected",
// //           description:
// //             existingAppeal.adminResponse ||
// //             "Your appeal has been reviewed and rejected.",
// //           bgColor: "bg-red-500/10 border-red-500/30",
// //           textColor: "text-red-300",
// //           action: existingAppeal.canReappeal
// //             ? "Submit New Appeal"
// //             : "Contact Support",
// //         };
// //       default:
// //         return null;
// //     }
// //   };

// //   const appealStatus = getAppealStatusDisplay();

// //   if (checkingAppeals) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
// //         <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
// //           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
// //           <p className="text-white text-center">Checking appeal status...</p>
// //         </div>
// //       </div>
// //     );
// //   }
// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
// //       <div className="w-full max-w-4xl">
// //         <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
// //           {/* Header Section */}
// //           <div
// //             className={`bg-gradient-to-r ${getSeverityColor()} border-b border-white/10 p-6`}
// //           >
// //             <div className="flex items-center justify-center space-x-3 mb-3">
// //               <div className="p-3 bg-red-500/20 rounded-full">
// //                 <Shield className="h-8 w-8 text-red-400" />
// //               </div>
// //               <div className="text-center">
// //                 <h1 className="text-2xl font-bold text-white">
// //                   Access Restricted
// //                 </h1>
// //                 <p className="text-red-200 text-sm">
// //                   Account temporarily suspended
// //                 </p>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="p-6 space-y-6">
// //             {/* Block Details */}
// //             {blockData && (
// //               <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
// //                 <div className="flex items-start space-x-3">
// //                   <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
// //                   <div className="space-y-2">
// //                     <div>
// //                       <p className="text-red-300 font-medium">
// //                         {blockData.reason}
// //                       </p>
// //                       <p className="text-red-400/70 text-sm">
// //                         Category:{" "}
// //                         {appealService.formatCategory(blockData.category)}
// //                       </p>
// //                     </div>
// //                     <p className="text-red-400/70 text-sm">
// //                       Blocked on:{" "}
// //                       {new Date(blockData.timestamp).toLocaleString()}
// //                     </p>
// //                     {blockData.severity && (
// //                       <span
// //                         className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
// //                           blockData.severity === "high"
// //                             ? "bg-red-500/20 text-red-300"
// //                             : blockData.severity === "medium"
// //                             ? "bg-orange-500/20 text-orange-300"
// //                             : "bg-blue-500/20 text-blue-300"
// //                         }`}
// //                       >
// //                         {blockData.severity.toUpperCase()} PRIORITY
// //                       </span>
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>
// //             )}

// //             {/* ✅ NEW: Existing Appeal Status */}
// //             {appealStatus && !showForm && !appealSubmitted && (
// //               <div className={`${appealStatus.bgColor} border rounded-xl p-6`}>
// //                 <div className="flex items-start space-x-4">
// //                   <div className="flex-shrink-0">{appealStatus.icon}</div>
// //                   <div className="flex-1 space-y-3">
// //                     <div>
// //                       <h3
// //                         className={`text-lg font-semibold ${appealStatus.textColor}`}
// //                       >
// //                         {appealStatus.title}
// //                       </h3>
// //                       <p
// //                         className={`${appealStatus.textColor}/90 text-sm mt-1`}
// //                       >
// //                         {appealStatus.description}
// //                       </p>
// //                     </div>

// //                     {/* Appeal Metadata */}
// //                     <div
// //                       className={`${appealStatus.textColor}/70 text-xs space-y-1`}
// //                     >
// //                       <p>
// //                         <strong>Appeal #{existingAppeal?.appealCount}:</strong>{" "}
// //                         Submitted on{" "}
// //                         {new Date(existingAppeal!.submittedAt).toLocaleString()}
// //                       </p>
// //                       {existingAppeal!.appealCount > 1 && (
// //                         <p>
// //                           <strong>Note:</strong> This is a re-appeal for the
// //                           same blocking incident.
// //                         </p>
// //                       )}
// //                     </div>

// //                     {/* Action Button */}
// //                     <div className="flex space-x-3">
// //                       {existingAppeal?.status === "approved" ? (
// //                         <button
// //                           onClick={() => (window.location.href = "/login")}
// //                           className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
// //                         >
// //                           Login to Account
// //                         </button>
// //                       ) : existingAppeal?.status === "rejected" &&
// //                         existingAppeal?.canReappeal ? (
// //                         <button
// //                           onClick={handleReappeal}
// //                           className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
// //                         >
// //                           Submit New Appeal
// //                         </button>
// //                       ) : (
// //                         <button
// //                           onClick={handleViewAppealStatus}
// //                           className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
// //                         >
// //                           {appealStatus.action}
// //                         </button>
// //                       )}

// //                       {existingAppeal?.status === "rejected" &&
// //                         !existingAppeal?.canReappeal && (
// //                           <a
// //                             href={`mailto:${
// //                               blockData?.adminEmail || "support@example.com"
// //                             }`}
// //                             className="px-4 py-2 border border-white/20 text-white rounded-lg text-sm hover:bg-white/10 transition-colors"
// //                           >
// //                             Contact Support
// //                           </a>
// //                         )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}

// //             {/* Success State */}
// //             {appealSubmitted && (
// //               <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
// //                 <div className="text-center space-y-4">
// //                   <div className="flex justify-center">
// //                     <CheckCircle className="h-12 w-12 text-green-400" />
// //                   </div>
// //                   <div>
// //                     <h3 className="text-xl font-semibold text-green-300 mb-2">
// //                       Appeal Submitted Successfully!
// //                     </h3>
// //                     <p className="text-green-400/80 text-sm mb-4">
// //                       We'll review your case and contact you via email within
// //                       24-48 hours.
// //                     </p>
// //                     {appealId && (
// //                       <div className="bg-green-500/20 rounded-lg p-3 mb-4">
// //                         <p className="text-green-300 text-sm">
// //                           <strong>Appeal ID:</strong> {appealId}
// //                         </p>
// //                         <p className="text-green-400/70 text-xs mt-1">
// //                           Save this ID to track your appeal status
// //                         </p>
// //                       </div>
// //                     )}
// //                     <button
// //                       onClick={() => navigate(`/appeal/status/${appealId}`)}
// //                       disabled={!appealId}
// //                       className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
// //                     >
// //                       Check Appeal Status
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}

// //             {/* ✅ UPDATED: Appeal Form (only show if no existing appeal or re-appealing) */}
// //             {!appealStatus && !appealSubmitted && (
// //               <div className="grid md:grid-cols-2 gap-6">
// //                 {/* Appeal Section */}
// //                 <div className="bg-white/5 border border-white/10 rounded-xl p-5">
// //                   {!showForm ? (
// //                     <div className="space-y-4">
// //                       <div className="flex items-center space-x-2 mb-3">
// //                         <MessageSquare className="h-5 w-5 text-blue-400" />
// //                         <h3 className="font-semibold text-white">
// //                           Submit Appeal
// //                         </h3>
// //                       </div>
// //                       <p className="text-gray-300 text-sm mb-4">
// //                         If you believe this suspension was made in error, you
// //                         can submit an appeal for review.
// //                       </p>
// //                       <button
// //                         onClick={() => setShowForm(true)}
// //                         className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
// //                       >
// //                         Start Appeal Process
// //                       </button>
// //                     </div>
// //                   ) : (
// //                     // Existing form code remains the same...
// //                     <div className="space-y-4">
// //                       <div className="flex items-center space-x-2 mb-3">
// //                         <MessageSquare className="h-5 w-5 text-blue-400" />
// //                         <h3 className="font-semibold text-white">
// //                           Appeal Form
// //                         </h3>
// //                       </div>

// //                       {/* Error Display */}
// //                       {errors.length > 0 && (
// //                         <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
// //                           <div className="flex items-start space-x-2">
// //                             <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
// //                             <div>
// //                               <p className="text-red-300 text-sm font-medium mb-1">
// //                                 Please fix the following errors:
// //                               </p>
// //                               <ul className="text-red-400/80 text-sm space-y-1">
// //                                 {errors.map((error, index) => (
// //                                   <li key={index}>• {error}</li>
// //                                 ))}
// //                               </ul>
// //                             </div>
// //                           </div>
// //                         </div>
// //                       )}

// //                       {/* Form Fields */}
// //                       <div className="space-y-3">
// //                         <div className="grid grid-cols-2 gap-3">
// //                           <input
// //                             type="text"
// //                             placeholder="First Name"
// //                             value={formData.firstName}
// //                             onChange={(e) =>
// //                               handleInputChange("firstName", e.target.value)
// //                             }
// //                             className="p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
// //                           />
// //                           <input
// //                             type="text"
// //                             placeholder="Last Name"
// //                             value={formData.lastName}
// //                             onChange={(e) =>
// //                               handleInputChange("lastName", e.target.value)
// //                             }
// //                             className="p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
// //                           />
// //                         </div>

// //                         <input
// //                           type="email"
// //                           placeholder="Email Address"
// //                           value={formData.email}
// //                           onChange={(e) =>
// //                             handleInputChange("email", e.target.value)
// //                           }
// //                           className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
// //                         />

// //                         <select
// //                           value={formData.category}
// //                           onChange={(e) =>
// //                             handleInputChange("category", e.target.value as any)
// //                           }
// //                           className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
// //                         >
// //                           <option value="wrongful_block">Wrongful Block</option>
// //                           <option value="account_hacked">Account Hacked</option>
// //                           <option value="misunderstanding">
// //                             Misunderstanding
// //                           </option>
// //                           <option value="other">Other</option>
// //                         </select>

// //                         <textarea
// //                           value={formData.appealMessage}
// //                           onChange={(e) =>
// //                             handleInputChange("appealMessage", e.target.value)
// //                           }
// //                           placeholder="Explain why this action should be reviewed..."
// //                           className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 resize-none h-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
// //                           maxLength={1000}
// //                         />
// //                       </div>

// //                       <div className="flex justify-between items-center">
// //                         <span className="text-xs text-gray-400">
// //                           {formData.appealMessage.length}/1000
// //                         </span>
// //                         <div className="flex space-x-2">
// //                           <button
// //                             onClick={() => setShowForm(false)}
// //                             disabled={isSubmitting}
// //                             className="px-4 py-2 border border-white/20 text-white rounded-lg text-sm hover:bg-white/10 disabled:opacity-50 transition-colors"
// //                           >
// //                             Cancel
// //                           </button>
// //                           <button
// //                             onClick={handleSubmitAppeal}
// //                             disabled={
// //                               isSubmitting || formData.appealMessage.length < 10
// //                             }
// //                             className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
// //                           >
// //                             {isSubmitting && (
// //                               <Loader2 className="h-4 w-4 animate-spin" />
// //                             )}
// //                             <span>
// //                               {isSubmitting ? "Submitting..." : "Submit Appeal"}
// //                             </span>
// //                           </button>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>

// //                 {/* Contact Support */}
// //                 <div className="bg-white/5 border border-white/10 rounded-xl p-5">
// //                   <div className="flex items-center space-x-2 mb-3">
// //                     <Mail className="h-5 w-5 text-purple-400" />
// //                     <h3 className="font-semibold text-white">Need Help?</h3>
// //                   </div>
// //                   <p className="text-gray-300 text-sm mb-4">
// //                     Contact our support team directly:
// //                   </p>
// //                   <div className="space-y-3">
// //                     <a
// //                       href={`mailto:${
// //                         blockData?.adminEmail || "sreekuttan12kaathu@gmail.com"
// //                       }`}
// //                       className="flex items-center space-x-2 text-purple-300 hover:text-purple-200 transition-colors text-sm"
// //                     >
// //                       <span>📧</span>
// //                       <span>
// //                         {blockData?.adminEmail ||
// //                           "sreekuttan12kaathu@gmail.com"}
// //                       </span>
// //                     </a>
// //                     <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
// //                       <p className="text-purple-300 text-xs">
// //                         <strong>When contacting support:</strong>
// //                         <br />
// //                         • Include your email address
// //                         <br />
// //                         • Mention this is regarding a blocked account
// //                         <br />• Provide details about your situation
// //                       </p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}

// //             {/* Footer */}
// //             <div className="pt-4 border-t border-white/10 text-center">
// //               <button
// //                 onClick={() => (window.location.href = "/")}
// //                 className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-600 border border-white/20 text-white rounded-lg hover:bg-slate-700 transition-all duration-200 text-sm"
// //               >
// //                 <Home className="h-4 w-4" />
// //                 <span>Return Home</span>
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default BlockedPage;
// import React from "react";
// import {
//   useLocation,
//   useNavigate,
//   useParams,
//   useSearchParams,
// } from "react-router-dom";
// import {
//   AlertTriangle,
//   Mail,
//   MessageSquare,
//   Home,
//   Shield,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Loader2,
//   RefreshCw,
//   ExternalLink,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { toast } from "react-hot-toast";
// import appealService, {
//   AppealSubmissionData,
//   ExistingAppeal,
// } from "@/services/appealService";

// interface BlockData {
//   reason: string;
//   category: string;
//   adminEmail: string;
//   timestamp: string;
//   canAppeal: boolean;
//   severity?: "high" | "medium" | "low";
// }

// export const BlockedPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { appealId } = useParams(); // 🆕 NEW: Get appealId from URL
//   const [searchParams] = useSearchParams(); // 🆕 NEW: Get URL parameters

//   // Get block data from navigation state
//   const blockData = location.state?.blockData as BlockData | undefined;

//   // 🆕 NEW: Get email from URL parameters (for admin email links)
//   const emailFromUrl = searchParams.get("email");

//   // 🔧 ENHANCED: Appeal state management
//   const [existingAppeal, setExistingAppeal] = useState<ExistingAppeal | null>(
//     null
//   );
//   const [checkingAppeals, setCheckingAppeals] = useState(true);
//   const [refreshing, setRefreshing] = useState(false); // 🆕 NEW: Manual refresh state

//   // Form state
//   const [formData, setFormData] = useState<AppealSubmissionData>({
//     email: "",
//     firstName: "",
//     lastName: "",
//     appealMessage: "",
//     category: "wrongful_block",
//   });

//   // UI state
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [appealSubmitted, setAppealSubmitted] = useState(false);
//   const [newAppealId, setNewAppealId] = useState<string | null>(null);
//   const [errors, setErrors] = useState<string[]>([]);
//   const [showForm, setShowForm] = useState(false);

//   // 🔧 ENHANCED: Initialize user info with URL support
//   useEffect(() => {
//     const userInfo = appealService.getUserInfoFromStorage(
//       emailFromUrl || undefined
//     );
//     setFormData((prev) => ({
//       ...prev,
//       ...userInfo,
//     }));
//   }, [emailFromUrl]);

//   // 🔧 ENHANCED: Check appeals with URL parameter support
//   useEffect(() => {
//     if (appealId) {
//       // 🆕 NEW: Load specific appeal from URL
//       checkSpecificAppeal(appealId);
//     } else {
//       // Normal flow - check existing appeals
//       checkExistingAppeals();
//     }
//   }, [appealId, emailFromUrl]);

//   // 🆕 NEW: Check specific appeal by ID
//   const checkSpecificAppeal = async (id: string) => {
//     try {
//       setCheckingAppeals(true);
//       console.log("🔍 BlockedPage: Checking specific appeal", { appealId: id });

//       const result = await appealService.getAppealStatus(id);

//       if (result.success && result.data) {
//         setExistingAppeal(result.data);
//         console.log("✅ BlockedPage: Specific appeal loaded", result.data);
//       } else {
//         console.log("❌ BlockedPage: Appeal not found", result.message);
//         toast.error("Appeal not found or access denied");
//         // Fallback to normal appeal checking
//         await checkExistingAppeals();
//       }
//     } catch (error) {
//       console.error("❌ BlockedPage: Error checking specific appeal", error);
//       await checkExistingAppeals(); // Fallback
//     } finally {
//       setCheckingAppeals(false);
//     }
//   };

//   // 🔧 ENHANCED: Check existing appeals
//   const checkExistingAppeals = async () => {
//     try {
//       setCheckingAppeals(true);
//       const userEmail =
//         emailFromUrl || appealService.getUserInfoFromStorage().email;

//       if (userEmail) {
//         console.log("🔍 BlockedPage: Checking existing appeals for", userEmail);

//         const result = await appealService.getLatestAppealByEmail(userEmail);

//         if (result.success && result.data) {
//           setExistingAppeal(result.data);
//           console.log("✅ BlockedPage: Found existing appeal", result.data);
//         } else {
//           console.log("ℹ️ BlockedPage: No existing appeal found");
//           setExistingAppeal(null);
//         }
//       }
//     } catch (error) {
//       console.error("❌ BlockedPage: Error checking existing appeals", error);
//     } finally {
//       setCheckingAppeals(false);
//     }
//   };

//   // 🆕 NEW: Manual refresh functionality
//   const handleRefreshStatus = async () => {
//     setRefreshing(true);
//     if (appealId) {
//       await checkSpecificAppeal(appealId);
//     } else {
//       await checkExistingAppeals();
//     }
//     setRefreshing(false);
//     toast.success("Status refreshed");
//   };

//   // 🆕 NEW: Navigate to appeal status
//   const handleViewAppealStatus = () => {
//     if (existingAppeal?._id) {
//       const email = formData.email || emailFromUrl;
//       const statusUrl = `/appeal/status/${existingAppeal._id}${
//         email ? `?email=${encodeURIComponent(email)}` : ""
//       }`;
//       navigate(statusUrl);
//     }
//   };

//   // 🔧 ENHANCED: Handle re-appeal
//   const handleReappeal = () => {
//     if (existingAppeal?.canReappeal && existingAppeal.appealCount < 2) {
//       setShowForm(true);
//       setAppealSubmitted(false); // Reset submission state
//     } else {
//       toast.error(
//         "You have reached the maximum number of appeals. Please contact support directly."
//       );
//     }
//   };

//   // Existing form handling functions (unchanged)
//   const handleInputChange = (
//     field: keyof AppealSubmissionData,
//     value: string
//   ) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));

//     if (errors.length > 0) {
//       setErrors([]);
//     }
//   };

//   const handleSubmitAppeal = async () => {
//     try {
//       setIsSubmitting(true);
//       setErrors([]);

//       const validation = appealService.validateAppealData(formData);

//       if (!validation.isValid) {
//         setErrors(validation.errors);
//         setIsSubmitting(false);
//         return;
//       }

//       const result = await appealService.submitAppeal(formData);

//       if (result.success) {
//         setAppealSubmitted(true);
//         setNewAppealId(result.data?.appealId || null);
//         setShowForm(false);

//         // Refresh appeal status
//         await checkExistingAppeals();

//         toast.success("Appeal submitted successfully!");
//       } else {
//         setErrors([result.message]);
//       }
//     } catch (error: any) {
//       console.error("❌ BlockedPage: Error submitting appeal", error);
//       setErrors(["An unexpected error occurred. Please try again."]);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const getSeverityColor = () => {
//     switch (blockData?.severity) {
//       case "high":
//         return "from-red-500/20 to-red-600/20";
//       case "medium":
//         return "from-orange-500/20 to-orange-600/20";
//       case "low":
//         return "from-blue-500/20 to-blue-600/20";
//       default:
//         return "from-red-500/20 to-pink-500/20";
//     }
//   };

//   // 🔧 ENHANCED: Get appeal status display
//   const getAppealStatusDisplay = () => {
//     if (!existingAppeal) return null;

//     const timeAgo = appealService.getTimeAgo(existingAppeal.submittedAt);
//     const reviewedAgo = existingAppeal.reviewedAt
//       ? appealService.getTimeAgo(existingAppeal.reviewedAt)
//       : null;

//     switch (existingAppeal.status) {
//       case "pending":
//         return {
//           icon: <Clock className="h-6 w-6 text-amber-400" />,
//           title: "Appeal Under Review",
//           description:
//             "Your appeal is being reviewed by our team. You'll receive an email with the decision within 24-48 hours.",
//           bgColor: "bg-amber-500/10 border-amber-500/30",
//           textColor: "text-amber-300",
//           showRefresh: true,
//           showActions: false,
//         };

//       case "under_review":
//         return {
//           icon: <AlertTriangle className="h-6 w-6 text-blue-400" />,
//           title: "Appeal In Progress",
//           description:
//             "An admin is currently reviewing your appeal. Please wait for the final decision.",
//           bgColor: "bg-blue-500/10 border-blue-500/30",
//           textColor: "text-blue-300",
//           showRefresh: true,
//           showActions: false,
//         };

//       case "approved":
//         return {
//           icon: <CheckCircle className="h-6 w-6 text-green-400" />,
//           title: "Appeal Approved! 🎉",
//           description:
//             existingAppeal.adminResponse ||
//             "Great news! Your appeal has been approved and your account has been restored.",
//           bgColor: "bg-green-500/10 border-green-500/30",
//           textColor: "text-green-300",
//           showRefresh: false,
//           showActions: true,
//           actionType: "login",
//         };

//       case "rejected":
//         return {
//           icon: <XCircle className="h-6 w-6 text-red-400" />,
//           title: `Appeal Rejected ${
//             existingAppeal.appealCount > 1 ? "(Final Decision)" : ""
//           }`,
//           description:
//             existingAppeal.adminResponse ||
//             "Your appeal has been reviewed and rejected.",
//           bgColor: "bg-red-500/10 border-red-500/30",
//           textColor: "text-red-300",
//           showRefresh: false,
//           showActions: true,
//           actionType:
//             existingAppeal.canReappeal && existingAppeal.appealCount < 2
//               ? "reappeal"
//               : "support",
//         };

//       default:
//         return null;
//     }
//   };

//   const appealStatus = getAppealStatusDisplay();

//   // Loading state
//   if (checkingAppeals) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
//         <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-white text-center">
//             {appealId
//               ? "Loading appeal status..."
//               : "Checking appeal status..."}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
//       <div className="w-full max-w-4xl">
//         <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
//           {/* Header Section */}
//           <div
//             className={`bg-gradient-to-r ${getSeverityColor()} border-b border-white/10 p-6`}
//           >
//             <div className="flex items-center justify-center space-x-3 mb-3">
//               <div className="p-3 bg-red-500/20 rounded-full">
//                 <Shield className="h-8 w-8 text-red-400" />
//               </div>
//               <div className="text-center">
//                 <h1 className="text-2xl font-bold text-white">
//                   {appealStatus?.title.includes("Approved")
//                     ? "Account Restored!"
//                     : "Access Restricted"}
//                 </h1>
//                 <p className="text-red-200 text-sm">
//                   {appealStatus?.title.includes("Approved")
//                     ? "Your appeal has been approved"
//                     : "Account temporarily suspended"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="p-6 space-y-6">
//             {/* Block Details */}
//             {blockData && !appealStatus?.title.includes("Approved") && (
//               <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
//                 <div className="flex items-start space-x-3">
//                   <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
//                   <div className="space-y-2">
//                     <div>
//                       <p className="text-red-300 font-medium">
//                         {blockData.reason}
//                       </p>
//                       <p className="text-red-400/70 text-sm">
//                         Category:{" "}
//                         {appealService.formatCategory(blockData.category)}
//                       </p>
//                     </div>
//                     <p className="text-red-400/70 text-sm">
//                       Blocked on:{" "}
//                       {new Date(blockData.timestamp).toLocaleString()}
//                     </p>
//                     {blockData.severity && (
//                       <span
//                         className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
//                           blockData.severity === "high"
//                             ? "bg-red-500/20 text-red-300"
//                             : blockData.severity === "medium"
//                             ? "bg-orange-500/20 text-orange-300"
//                             : "bg-blue-500/20 text-blue-300"
//                         }`}
//                       >
//                         {blockData.severity.toUpperCase()} PRIORITY
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* 🔧 ENHANCED: Appeal Status Display */}
//             {appealStatus && !showForm && !appealSubmitted && (
//               <div className={`${appealStatus.bgColor} border rounded-xl p-6`}>
//                 <div className="flex items-start space-x-4">
//                   <div className="flex-shrink-0">{appealStatus.icon}</div>
//                   <div className="flex-1 space-y-4">
//                     <div>
//                       <div className="flex items-center justify-between">
//                         <h3
//                           className={`text-lg font-semibold ${appealStatus.textColor}`}
//                         >
//                           {appealStatus.title}
//                         </h3>
//                         {appealStatus.showRefresh && (
//                           <button
//                             onClick={handleRefreshStatus}
//                             disabled={refreshing}
//                             className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
//                             title="Refresh status"
//                           >
//                             <RefreshCw
//                               className={`h-4 w-4 ${appealStatus.textColor} ${
//                                 refreshing ? "animate-spin" : ""
//                               }`}
//                             />
//                           </button>
//                         )}
//                       </div>
//                       <p
//                         className={`${appealStatus.textColor}/90 text-sm mt-2 leading-relaxed`}
//                       >
//                         {appealStatus.description}
//                       </p>
//                     </div>

//                     {/* Appeal Metadata */}
//                     <div
//                       className={`${appealStatus.textColor}/70 text-xs space-y-1 bg-white/5 rounded-lg p-3`}
//                     >
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <p>
//                             <strong>
//                               Appeal #{existingAppeal?.appealCount}:
//                             </strong>
//                           </p>
//                           <p>
//                             Submitted{" "}
//                             {appealService.getTimeAgo(
//                               existingAppeal!.submittedAt
//                             )}
//                           </p>
//                         </div>
//                         <div>
//                           <p>
//                             <strong>Category:</strong>{" "}
//                             {appealService.formatCategory(
//                               existingAppeal!.category
//                             )}
//                           </p>
//                           {existingAppeal!.reviewedAt && (
//                             <p>
//                               Reviewed{" "}
//                               {appealService.getTimeAgo(
//                                 existingAppeal!.reviewedAt
//                               )}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                       {existingAppeal!.appealCount > 1 && (
//                         <p className="pt-2 border-t border-white/10">
//                           <strong>Note:</strong> This was a re-appeal for the
//                           same blocking incident.
//                         </p>
//                       )}
//                     </div>

//                     {/* Action Buttons */}
//                     {appealStatus.showActions && (
//                       <div className="flex flex-wrap gap-3">
//                         {appealStatus.actionType === "login" && (
//                           <>
//                             <button
//                               onClick={() => navigate("/login")}
//                               className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
//                             >
//                               <ExternalLink className="h-4 w-4" />
//                               <span>Login to Account</span>
//                             </button>
//                             <div className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg text-sm">
//                               ⚠️ <strong>Warning:</strong> Please follow our
//                               community guidelines to avoid future suspensions.
//                             </div>
//                           </>
//                         )}

//                         {appealStatus.actionType === "reappeal" && (
//                           <>
//                             <button
//                               onClick={handleReappeal}
//                               className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
//                             >
//                               Submit Re-appeal
//                             </button>
//                             <div className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg text-sm">
//                               ℹ️ This will be your final appeal for this
//                               blocking incident.
//                             </div>
//                           </>
//                         )}

//                         {appealStatus.actionType === "support" && (
//                           <div className="w-full">
//                             <div className="px-4 py-3 bg-red-500/20 text-red-300 rounded-lg text-sm mb-3">
//                               ⚠️ You have reached the maximum number of appeals
//                               for this incident.
//                             </div>

//                             <a
//                               href={`mailto:${
//                                 blockData?.adminEmail ||
//                                 "sreekuttan12kaathu@gmail.com"
//                               }?subject=Appeal Follow-up: ${
//                                 existingAppeal?._id
//                               }&body=Dear Support Team,%0A%0AI would like to follow up on my appeal (ID: ${
//                                 existingAppeal?._id
//                               }) that was rejected.%0A%0APlease provide additional information or reconsider my case.%0A%0AThank you.`}
//                               className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors inline-flex items-center space-x-2"
//                             >
//                               <Mail className="h-4 w-4" />
//                               <span>Contact Support</span>
//                             </a>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Success State - New Appeal Submitted */}
//             {appealSubmitted && newAppealId && (
//               <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
//                 <div className="text-center space-y-4">
//                   <div className="flex justify-center">
//                     <CheckCircle className="h-12 w-12 text-green-400" />
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-semibold text-green-300 mb-2">
//                       {existingAppeal?.appealCount === 1
//                         ? "Appeal Submitted Successfully!"
//                         : "Re-appeal Submitted!"}
//                     </h3>
//                     <p className="text-green-400/80 text-sm mb-4">
//                       We'll review your case and contact you via email within
//                       24-48 hours.
//                     </p>
//                     <div className="bg-green-500/20 rounded-lg p-3 mb-4">
//                       <p className="text-green-300 text-sm">
//                         <strong>Appeal ID:</strong> {newAppealId}
//                       </p>
//                       <p className="text-green-400/70 text-xs mt-1">
//                         Save this ID to track your appeal status
//                       </p>
//                     </div>
//                     <div className="flex gap-3 justify-center">
//                       <button
//                         onClick={() => {
//                           const email = formData.email || emailFromUrl;
//                           const statusUrl = `/appeal/status/${newAppealId}${
//                             email ? `?email=${encodeURIComponent(email)}` : ""
//                           }`;
//                           navigate(statusUrl);
//                         }}
//                         className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
//                       >
//                         Check Appeal Status
//                       </button>
//                       <button
//                         onClick={handleRefreshStatus}
//                         className="px-4 py-2 border border-green-500/30 text-green-300 rounded-lg text-sm hover:bg-green-500/10 transition-colors"
//                       >
//                         Refresh Page
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Appeal Form or Initial State */}
//             {!appealStatus && !appealSubmitted && (
//               <div className="grid md:grid-cols-2 gap-6">
//                 {/* Appeal Section */}
//                 <div className="bg-white/5 border border-white/10 rounded-xl p-5">
//                   {!showForm ? (
//                     <div className="space-y-4">
//                       <div className="flex items-center space-x-2 mb-3">
//                         <MessageSquare className="h-5 w-5 text-blue-400" />
//                         <h3 className="font-semibold text-white">
//                           Submit Appeal
//                         </h3>
//                       </div>
//                       <p className="text-gray-300 text-sm mb-4">
//                         If you believe this suspension was made in error, you
//                         can submit an appeal for review.
//                       </p>
//                       <button
//                         onClick={() => setShowForm(true)}
//                         className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
//                       >
//                         Start Appeal Process
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <div className="flex items-center space-x-2 mb-3">
//                         <MessageSquare className="h-5 w-5 text-blue-400" />
//                         <h3 className="font-semibold text-white">
//                           {existingAppeal?.appealCount > 0
//                             ? "Re-appeal Form"
//                             : "Appeal Form"}
//                         </h3>
//                       </div>

//                       {/* Show previous rejection reason if re-appealing */}
//                       {existingAppeal?.status === "rejected" &&
//                         existingAppeal.adminResponse && (
//                           <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
//                             <p className="text-red-300 text-sm font-medium mb-1">
//                               Previous Rejection Reason:
//                             </p>
//                             <p className="text-red-400/80 text-sm">
//                               {existingAppeal.adminResponse}
//                             </p>
//                           </div>
//                         )}

//                       {/* Error Display */}
//                       {errors.length > 0 && (
//                         <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
//                           <div className="flex items-start space-x-2">
//                             <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
//                             <div>
//                               <p className="text-red-300 text-sm font-medium mb-1">
//                                 Please fix the following errors:
//                               </p>
//                               <ul className="text-red-400/80 text-sm space-y-1">
//                                 {errors.map((error, index) => (
//                                   <li key={index}>• {error}</li>
//                                 ))}
//                               </ul>
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       {/* Form Fields */}
//                       <div className="space-y-3">
//                         <div className="grid grid-cols-2 gap-3">
//                           <input
//                             type="text"
//                             placeholder="First Name"
//                             value={formData.firstName}
//                             onChange={(e) =>
//                               handleInputChange("firstName", e.target.value)
//                             }
//                             className="p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
//                           />
//                           <input
//                             type="text"
//                             placeholder="Last Name"
//                             value={formData.lastName}
//                             onChange={(e) =>
//                               handleInputChange("lastName", e.target.value)
//                             }
//                             className="p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
//                           />
//                         </div>

//                         <input
//                           type="email"
//                           placeholder="Email Address"
//                           value={formData.email}
//                           onChange={(e) =>
//                             handleInputChange("email", e.target.value)
//                           }
//                           disabled={!!emailFromUrl} // Disable if email came from URL
//                           className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
//                         />

//                         <select
//                           value={formData.category}
//                           onChange={(e) =>
//                             handleInputChange("category", e.target.value as any)
//                           }
//                           className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
//                         >
//                           <option value="wrongful_block">Wrongful Block</option>
//                           <option value="account_hacked">Account Hacked</option>
//                           <option value="misunderstanding">
//                             Misunderstanding
//                           </option>
//                           <option value="other">Other</option>
//                         </select>

//                         <textarea
//                           value={formData.appealMessage}
//                           onChange={(e) =>
//                             handleInputChange("appealMessage", e.target.value)
//                           }
//                           placeholder={
//                             existingAppeal?.appealCount > 0
//                               ? "Please provide additional information or clarification for your re-appeal..."
//                               : "Explain why this action should be reviewed..."
//                           }
//                           className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 resize-none h-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
//                           maxLength={1000}
//                         />
//                       </div>

//                       <div className="flex justify-between items-center">
//                         <span className="text-xs text-gray-400">
//                           {formData.appealMessage.length}/1000
//                         </span>
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => setShowForm(false)}
//                             disabled={isSubmitting}
//                             className="px-4 py-2 border border-white/20 text-white rounded-lg text-sm hover:bg-white/10 disabled:opacity-50 transition-colors"
//                           >
//                             Cancel
//                           </button>
//                           <button
//                             onClick={handleSubmitAppeal}
//                             disabled={
//                               isSubmitting || formData.appealMessage.length < 10
//                             }
//                             className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
//                           >
//                             {isSubmitting && (
//                               <Loader2 className="h-4 w-4 animate-spin" />
//                             )}
//                             <span>
//                               {isSubmitting
//                                 ? "Submitting..."
//                                 : existingAppeal?.appealCount > 0
//                                 ? "Submit Re-appeal"
//                                 : "Submit Appeal"}
//                             </span>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Contact Support */}
//                 <div className="bg-white/5 border border-white/10 rounded-xl p-5">
//                   <div className="flex items-center space-x-2 mb-3">
//                     <Mail className="h-5 w-5 text-purple-400" />
//                     <h3 className="font-semibold text-white">Need Help?</h3>
//                   </div>
//                   <p className="text-gray-300 text-sm mb-4">
//                     Contact our support team directly:
//                   </p>
//                   <div className="space-y-3">
//                     <a
//                       href={`mailto:${
//                         blockData?.adminEmail || "sreekuttan12kaathu@gmail.com"
//                       }`}
//                       className="flex items-center space-x-2 text-purple-300 hover:text-purple-200 transition-colors text-sm"
//                     >
//                       <span>📧</span>
//                       <span>
//                         {blockData?.adminEmail ||
//                           "sreekuttan12kaathu@gmail.com"}
//                       </span>
//                     </a>
//                     <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
//                       <p className="text-purple-300 text-xs">
//                         <strong>When contacting support:</strong>
//                         <br />• Include your email address
//                         <br />• Mention this is regarding a blocked account
//                         <br />• Provide details about your situation
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Footer */}
//             <div className="pt-4 border-t border-white/10 text-center">
//               <button
//                 onClick={() => (window.location.href = "/")}
//                 className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-600 border border-white/20 text-white rounded-lg hover:bg-slate-700 transition-all duration-200 text-sm"
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
