// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   MessageSquare,
//   User,
//   CheckCircle,
//   XCircle,
//   Clock,
//   AlertTriangle,
//   Calendar,
//   Mail,
//   FileText,
//   Shield,
//   Eye,
//   Send,
// } from "lucide-react";
// import { toast } from "react-hot-toast";
// import adminAppealService from "@/services/adminAppealService";

// interface AppealDetails {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   category: string;
//   status: string;
//   appealMessage: string;
//   submittedAt: string;
//   reviewedAt?: string;
//   reviewedBy?: string;
//   adminResponse?: string;
//   adminNotes?: string;
//   ipAddress?: string;
//   userAgent?: string;
// }

// const AppealReview: React.FC = () => {
//   const { appealId } = useParams<{ appealId: string }>();
//   const navigate = useNavigate();

//   const [appeal, setAppeal] = useState<AppealDetails | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [reviewing, setReviewing] = useState(false);
//   const [decision, setDecision] = useState<"approved" | "rejected" | "">("");
//   const [adminResponse, setAdminResponse] = useState("");
//   const [adminNotes, setAdminNotes] = useState("");

//   useEffect(() => {
//     if (appealId) {
//       loadAppealDetails();
//     }
//   }, [appealId]);

//   const loadAppealDetails = async () => {
//     try {
//       setLoading(true);
//       const result = await adminAppealService.getAppealDetails(appealId!);

//       if (result.success && result.data) {
//         setAppeal(result.data);
//         console.log("✅ AppealReview: Appeal details loaded successfully");
//       } else {
//         console.error("❌ AppealReview: Failed to load appeal", result.message);
//         toast.error("Failed to load appeal details");
//         navigate("/admin/appeals");
//       }
//     } catch (error) {
//       console.error("❌ AppealReview: Error loading appeal:", error);
//       toast.error("Error loading appeal details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReviewSubmit = async () => {
//     if (!decision) {
//       toast.error("Please select a decision");
//       return;
//     }

//     if (!adminResponse.trim()) {
//       toast.error("Please provide a response to the user");
//       return;
//     }

//     try {
//       setReviewing(true);
//       const result = await adminAppealService.reviewAppeal(
//         appealId!,
//         decision,
//         adminResponse.trim(),
//         adminNotes.trim()
//       );

//       if (result.success) {
//         toast.success(`Appeal ${decision} successfully`);
//         navigate("/admin/appeals");
//       } else {
//         toast.error(result.message || "Failed to review appeal");
//       }
//     } catch (error) {
//       console.error("❌ AppealReview: Error reviewing appeal:", error);
//       toast.error("Error submitting review");
//     } finally {
//       setReviewing(false);
//     }
//   };

//   const getStatusConfig = (status: string) => {
//     switch (status) {
//       case "pending":
//         return {
//           icon: <Clock className="h-5 w-5" />,
//           color: "bg-amber-50 text-amber-700 border-amber-200",
//           badgeColor: "bg-amber-100 text-amber-800",
//           gradient: "from-amber-500/10 to-yellow-500/10",
//         };
//       case "under_review":
//         return {
//           icon: <Eye className="h-5 w-5" />,
//           color: "bg-blue-50 text-blue-700 border-blue-200",
//           badgeColor: "bg-blue-100 text-blue-800",
//           gradient: "from-blue-500/10 to-indigo-500/10",
//         };
//       case "approved":
//         return {
//           icon: <CheckCircle className="h-5 w-5" />,
//           color: "bg-green-50 text-green-700 border-green-200",
//           badgeColor: "bg-green-100 text-green-800",
//           gradient: "from-green-500/10 to-emerald-500/10",
//         };
//       case "rejected":
//         return {
//           icon: <XCircle className="h-5 w-5" />,
//           color: "bg-red-50 text-red-700 border-red-200",
//           badgeColor: "bg-red-100 text-red-800",
//           gradient: "from-red-500/10 to-rose-500/10",
//         };
//       default:
//         return {
//           icon: <AlertTriangle className="h-5 w-5" />,
//           color: "bg-gray-50 text-gray-700 border-gray-200",
//           badgeColor: "bg-gray-100 text-gray-800",
//           gradient: "from-gray-500/10 to-slate-500/10",
//         };
//     }
//   };

//   const canReview =
//     appeal && (appeal.status === "pending" || appeal.status === "under_review");
//   const statusConfig = appeal
//     ? getStatusConfig(appeal.status)
//     : getStatusConfig("pending");

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="bg-white rounded-2xl shadow-xl p-8 w-96">
//           <div className="animate-pulse space-y-4">
//             <div className="h-6 bg-gray-200 rounded-lg w-2/3"></div>
//             <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//             <div className="h-32 bg-gray-200 rounded-lg"></div>
//             <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!appeal) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <AlertTriangle className="h-8 w-8 text-red-600" />
//           </div>
//           <h1 className="text-xl font-semibold text-gray-900 mb-2">
//             Appeal Not Found
//           </h1>
//           <p className="text-gray-600 mb-6">
//             The appeal you're looking for doesn't exist or has been removed.
//           </p>
//           <button
//             onClick={() => navigate("/admin/appeals")}
//             className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium"
//           >
//             Back to Appeals
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 ml-24 p-8 bg-white">
//       {/* Modern Header */}
//       <div className="bg-white border-b border-gray-200 sticky top-0  backdrop-blur-sm bg-white/95">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <div className="space-y-2">
//                 <div className="flex items-center">
//                   <button
//                     className="group flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-blue-700 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 active:scale-95 shadow-sm"
//                     onClick={() => navigate(-1)}
//                     aria-label="Go back"
//                   >
//                     <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
//                   </button>
//                 </div>
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">
//                   Appeal Review
//                 </h1>
//                 <p className="text-sm text-gray-600">
//                   Review and respond to user appeal
//                 </p>
//               </div>
//             </div>

//             <div
//               className={`flex items-center space-x-3 px-4 py-2 rounded-xl border-2 ${statusConfig.color}`}
//             >
//               {statusConfig.icon}
//               <span className="font-semibold capitalize">
//                 {appeal.status.replace("_", " ")}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//           {/* Left Column - Appeal Details */}
//           <div className="xl:col-span-2 space-y-6">
//             {/* User Information Card */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
//                     <User className="h-5 w-5 text-blue-600" />
//                   </div>
//                   <h2 className="text-lg font-semibold text-gray-900">
//                     User Information
//                   </h2>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <div className="grid grid-cols-2 gap-6">
//                   <div className="space-y-1">
//                     <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
//                       Full Name
//                     </label>
//                     <p className="text-lg font-semibold text-gray-900">
//                       {appeal.firstName} {appeal.lastName}
//                     </p>
//                   </div>
//                   <div className="space-y-1">
//                     <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
//                       Email Address
//                     </label>
//                     <div className="flex items-center space-x-2">
//                       <Mail className="h-4 w-4 text-gray-400" />
//                       <p className="text-gray-900 font-medium">
//                         {appeal.email}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="space-y-1">
//                     <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
//                       Category
//                     </label>
//                     <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
//                       {appeal.category.replace("_", " ")}
//                     </span>
//                   </div>
//                   <div className="space-y-1">
//                     <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
//                       Submitted
//                     </label>
//                     <div className="flex items-center space-x-2">
//                       <Calendar className="h-4 w-4 text-gray-400" />
//                       <p className="text-gray-900 font-medium">
//                         {new Date(appeal.submittedAt).toLocaleDateString()} at{" "}
//                         {new Date(appeal.submittedAt).toLocaleTimeString()}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Appeal Message Card */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
//                     <MessageSquare className="h-5 w-5 text-green-600" />
//                   </div>
//                   <h2 className="text-lg font-semibold text-gray-900">
//                     Appeal Message
//                   </h2>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-500">
//                   <p className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium">
//                     {appeal.appealMessage}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Previous Review Card */}
//             {appeal.adminResponse && (
//               <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-gray-200">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
//                       <FileText className="h-5 w-5 text-orange-600" />
//                     </div>
//                     <h2 className="text-lg font-semibold text-gray-900">
//                       Previous Review
//                     </h2>
//                   </div>
//                 </div>
//                 <div className="p-6 space-y-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
//                       Admin Response
//                     </label>
//                     <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
//                       <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
//                         {appeal.adminResponse}
//                       </p>
//                     </div>
//                   </div>

//                   {appeal.adminNotes && (
//                     <div>
//                       <label className="block text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
//                         Internal Notes
//                       </label>
//                       <div className="bg-amber-50 rounded-xl p-4 border-l-4 border-amber-500">
//                         <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
//                           {appeal.adminNotes}
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   <div className="flex items-center justify-between pt-4 border-t border-gray-200">
//                     <div className="flex items-center space-x-4 text-sm text-gray-500">
//                       <span className="flex items-center space-x-1">
//                         <Calendar className="h-4 w-4" />
//                         <span>
//                           Reviewed:{" "}
//                           {new Date(appeal.reviewedAt!).toLocaleString()}
//                         </span>
//                       </span>
//                       <span className="flex items-center space-x-1">
//                         <Shield className="h-4 w-4" />
//                         <span>By: {appeal.reviewedBy}</span>
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Technical Info Card */}
//             {(appeal.ipAddress || appeal.userAgent) && (
//               <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4 border-b border-gray-200">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
//                       <Shield className="h-5 w-5 text-gray-600" />
//                     </div>
//                     <h2 className="text-lg font-semibold text-gray-900">
//                       Technical Details
//                     </h2>
//                   </div>
//                 </div>
//                 <div className="p-6 space-y-4">
//                   {appeal.ipAddress && (
//                     <div>
//                       <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//                         IP Address
//                       </label>
//                       <p className="text-sm font-mono text-gray-700 bg-gray-100 px-3 py-1 rounded-lg inline-block">
//                         {appeal.ipAddress}
//                       </p>
//                     </div>
//                   )}
//                   {appeal.userAgent && (
//                     <div>
//                       <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//                         User Agent
//                       </label>
//                       <p className="text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded-lg">
//                         {appeal.userAgent}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Column - Review Actions */}
//           {canReview && (
//             <div className="xl:col-span-1">
//               <div className="bg-white rounded-2xl shadow-sm border border-gray-200 sticky top-24 overflow-hidden">
//                 <div
//                   className={`bg-gradient-to-r ${statusConfig.gradient} px-6 py-4 border-b border-gray-200`}
//                 >
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
//                       <Send className="h-5 w-5 text-blue-600" />
//                     </div>
//                     <h2 className="text-lg font-semibold text-gray-900">
//                       Review Appeal
//                     </h2>
//                   </div>
//                 </div>

//                 <div className="p-6 space-y-6">
//                   {/* Decision Selection */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-3">
//                       Decision <span className="text-red-500">*</span>
//                     </label>
//                     <div className="space-y-3">
//                       <label className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-green-50 cursor-pointer transition-colors">
//                         <input
//                           type="radio"
//                           name="decision"
//                           value="approved"
//                           checked={decision === "approved"}
//                           onChange={(e) =>
//                             setDecision(e.target.value as "approved")
//                           }
//                           className="h-4 w-4 text-green-600 focus:ring-green-500"
//                         />
//                         <div className="ml-3 flex items-center space-x-2">
//                           <CheckCircle className="h-5 w-5 text-green-600" />
//                           <span className="text-sm font-medium text-gray-900">
//                             Approve Appeal
//                           </span>
//                         </div>
//                       </label>
//                       <label className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-red-50 cursor-pointer transition-colors">
//                         <input
//                           type="radio"
//                           name="decision"
//                           value="rejected"
//                           checked={decision === "rejected"}
//                           onChange={(e) =>
//                             setDecision(e.target.value as "rejected")
//                           }
//                           className="h-4 w-4 text-red-600 focus:ring-red-500"
//                         />
//                         <div className="ml-3 flex items-center space-x-2">
//                           <XCircle className="h-5 w-5 text-red-600" />
//                           <span className="text-sm font-medium text-gray-900">
//                             Reject Appeal
//                           </span>
//                         </div>
//                       </label>
//                     </div>
//                   </div>

//                   {/* Admin Response */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Response to User <span className="text-red-500">*</span>
//                     </label>
//                     <textarea
//                       value={adminResponse}
//                       onChange={(e) => setAdminResponse(e.target.value)}
//                       rows={4}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                       placeholder="Explain your decision to the user..."
//                     />
//                     <p className="mt-2 text-xs text-gray-500 flex items-center space-x-1">
//                       <Mail className="h-3 w-3" />
//                       <span>
//                         This message will be sent to the user via email
//                       </span>
//                     </p>
//                   </div>

//                   {/* Internal Notes */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Internal Notes{" "}
//                       <span className="text-gray-400">(Optional)</span>
//                     </label>
//                     <textarea
//                       value={adminNotes}
//                       onChange={(e) => setAdminNotes(e.target.value)}
//                       rows={3}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                       placeholder="Internal notes for other admins..."
//                     />
//                     <p className="mt-2 text-xs text-gray-500 flex items-center space-x-1">
//                       <Shield className="h-3 w-3" />
//                       <span>Only visible to admin team</span>
//                     </p>
//                   </div>

//                   {/* Submit Button */}
//                   <button
//                     onClick={handleReviewSubmit}
//                     disabled={reviewing || !decision || !adminResponse.trim()}
//                     className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 font-semibold"
//                   >
//                     {reviewing ? (
//                       <>
//                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
//                         Submitting Review...
//                       </>
//                     ) : (
//                       <>
//                         <Send className="h-5 w-5 mr-2" />
//                         Submit{" "}
//                         {decision
//                           ? decision.charAt(0).toUpperCase() + decision.slice(1)
//                           : "Review"}
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AppealReview;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MessageSquare,
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Mail,
  FileText,
  Shield,
  Eye,
  Send,
  Globe,
  Monitor,
  Star,
  Award,
  Target,
  Zap,
  Info,
  Lock,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-hot-toast";
import adminAppealService from "@/services/adminAppealService";

interface AppealDetails {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  category: string;
  status: string;
  appealMessage: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminResponse?: string;
  adminNotes?: string;
  ipAddress?: string;
  userAgent?: string;
}

const AppealReview: React.FC = () => {
  const { appealId } = useParams<{ appealId: string }>();
  const navigate = useNavigate();

  const [appeal, setAppeal] = useState<AppealDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [decision, setDecision] = useState<"approved" | "rejected" | "">("");
  const [adminResponse, setAdminResponse] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    if (appealId) {
      loadAppealDetails();
    }
  }, [appealId]);

  const loadAppealDetails = async () => {
    try {
      setLoading(true);
      const result = await adminAppealService.getAppealDetails(appealId!);

      if (result.success && result.data) {
        setAppeal(result.data);
        console.log("✅ AppealReview: Appeal details loaded successfully");
      } else {
        console.error("❌ AppealReview: Failed to load appeal", result.message);
        toast.error("Failed to load appeal details");
        navigate("/admin/appeals");
      }
    } catch (error) {
      console.error("❌ AppealReview: Error loading appeal:", error);
      toast.error("Error loading appeal details");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!decision) {
      toast.error("Please select a decision");
      return;
    }

    if (!adminResponse.trim()) {
      toast.error("Please provide a response to the user");
      return;
    }

    try {
      setReviewing(true);
      const result = await adminAppealService.reviewAppeal(
        appealId!,
        decision,
        adminResponse.trim(),
        adminNotes.trim()
      );

      if (result.success) {
        toast.success(`Appeal ${decision} successfully`);
        navigate("/admin/appeals");
      } else {
        toast.error(result.message || "Failed to review appeal");
      }
    } catch (error) {
      console.error("❌ AppealReview: Error reviewing appeal:", error);
      toast.error("Error submitting review");
    } finally {
      setReviewing(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="h-5 w-5" />,
          color:
            "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200",
          badgeColor:
            "bg-gradient-to-r from-amber-500 to-yellow-600 text-white",
          gradient: "from-amber-50 to-yellow-50",
          glowColor: "shadow-amber-500/20",
        };
      case "under_review":
        return {
          icon: <Eye className="h-5 w-5" />,
          color:
            "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200",
          badgeColor: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white",
          gradient: "from-blue-50 to-indigo-50",
          glowColor: "shadow-blue-500/20",
        };
      case "approved":
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          color:
            "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200",
          badgeColor:
            "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
          gradient: "from-green-50 to-emerald-50",
          glowColor: "shadow-green-500/20",
        };
      case "rejected":
        return {
          icon: <XCircle className="h-5 w-5" />,
          color:
            "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200",
          badgeColor: "bg-gradient-to-r from-red-500 to-rose-600 text-white",
          gradient: "from-red-50 to-rose-50",
          glowColor: "shadow-red-500/20",
        };
      default:
        return {
          icon: <AlertTriangle className="h-5 w-5" />,
          color:
            "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200",
          badgeColor: "bg-gradient-to-r from-gray-500 to-slate-600 text-white",
          gradient: "from-gray-50 to-slate-50",
          glowColor: "shadow-gray-500/20",
        };
    }
  };

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case "wrongful_block":
        return {
          icon: <Shield className="h-4 w-4" />,
          color:
            "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border border-purple-200",
          description: "User believes they were blocked incorrectly",
        };
      case "account_hacked":
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          color:
            "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200",
          description: "User's account may have been compromised",
        };
      case "misunderstanding":
        return {
          icon: <MessageSquare className="h-4 w-4" />,
          color:
            "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200",
          description: "Potential miscommunication or confusion",
        };
      default:
        return {
          icon: <FileText className="h-4 w-4" />,
          color:
            "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200",
          description: "General appeal category",
        };
    }
  };

  const canReview =
    appeal && (appeal.status === "pending" || appeal.status === "under_review");
  const statusConfig = appeal
    ? getStatusConfig(appeal.status)
    : getStatusConfig("pending");
  const categoryConfig = appeal
    ? getCategoryConfig(appeal.category)
    : getCategoryConfig("other");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-96">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-200 to-purple-200 rounded-xl"></div>
              <div className="space-y-2 flex-1">
                <div className="h-6 bg-gray-200 rounded-lg w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-32 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 bg-gray-200 rounded-xl flex-1"></div>
              <div className="h-10 bg-gray-200 rounded-xl flex-1"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!appeal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-3">
            Appeal Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The appeal you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/admin/appeals")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
          >
            Back to Appeals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="ml-24 p-8">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                className="group flex h-12 w-12 items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-blue-600 hover:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
                onClick={() => navigate(-1)}
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  Appeal Review
                </h1>
                <p className="text-gray-600 mt-2">
                  Review and respond to user appeal submission
                </p>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl shadow-lg ${statusConfig.glowColor} ${statusConfig.badgeColor}`}
            >
              {statusConfig.icon}
              <span className="font-bold capitalize text-lg">
                {appeal.status.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Appeal Details */}
          <div className="xl:col-span-2 space-y-8">
            {/* User Information Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      User Information
                    </h2>
                    <p className="text-gray-600">Profile and contact details</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </label>
                    <p className="text-xl font-bold text-gray-900">
                      {appeal.firstName} {appeal.lastName}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </label>
                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <p className="text-gray-900 font-semibold">
                        {appeal.email}
                      </p>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Category
                    </label>
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl font-bold ${categoryConfig.color} shadow-lg`}
                    >
                      {categoryConfig.icon}
                      <span className="text-sm uppercase tracking-wide">
                        {appeal.category.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {categoryConfig.description}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Submitted
                    </label>
                    <div className="bg-gray-50 px-4 py-3 rounded-xl">
                      <div className="flex items-center gap-2 text-gray-900 font-semibold">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span>
                          {new Date(appeal.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        at {new Date(appeal.submittedAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Appeal Message Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 px-8 py-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Appeal Message
                    </h2>
                    <p className="text-gray-600">
                      User's explanation and request
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-l-4 border-blue-500 shadow-inner">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-blue-700">
                      User's Appeal
                    </div>
                  </div>
                  <p className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium text-lg">
                    {appeal.appealMessage}
                  </p>
                </div>
              </div>
            </div>

            {/* Previous Review Card */}
            {appeal.adminResponse && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 px-8 py-6 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Previous Review
                      </h2>
                      <p className="text-gray-600">
                        Admin's previous response and notes
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-8 space-y-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Admin Response
                    </label>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-l-4 border-blue-500 shadow-inner">
                      <p className="text-gray-900 whitespace-pre-wrap leading-relaxed font-medium">
                        {appeal.adminResponse}
                      </p>
                    </div>
                  </div>

                  {appeal.adminNotes && (
                    <div>
                      <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Internal Notes
                      </label>
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border-l-4 border-amber-500 shadow-inner">
                        <p className="text-gray-900 whitespace-pre-wrap leading-relaxed font-medium">
                          {appeal.adminNotes}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-xl p-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <span className="flex items-center gap-2 font-medium">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span>
                            Reviewed:{" "}
                            {new Date(appeal.reviewedAt!).toLocaleString()}
                          </span>
                        </span>
                        <span className="flex items-center gap-2 font-medium">
                          <Shield className="h-4 w-4 text-purple-500" />
                          <span>By: {appeal.reviewedBy}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Technical Info Card */}
            {(appeal.ipAddress || appeal.userAgent) && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 via-slate-50 to-zinc-50 px-8 py-6 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-slate-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Technical Details
                      </h2>
                      <p className="text-gray-600">
                        Request metadata and security information
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  {appeal.ipAddress && (
                    <div>
                      <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        IP Address
                      </label>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-lg font-mono font-bold text-gray-900 bg-white px-4 py-2 rounded-lg inline-block shadow-sm">
                          {appeal.ipAddress}
                        </p>
                      </div>
                    </div>
                  )}
                  {appeal.userAgent && (
                    <div>
                      <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        User Agent
                      </label>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm text-gray-900 bg-white px-4 py-3 rounded-lg font-medium leading-relaxed shadow-sm">
                          {appeal.userAgent}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Review Actions */}
          {canReview && (
            <div className="xl:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 sticky top-8 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Review Appeal
                      </h2>
                      <p className="text-gray-600">Make your decision</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {/* Decision Selection */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Decision <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-4">
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-2xl hover:bg-green-50 hover:border-green-300 cursor-pointer transition-all duration-300 group">
                        <input
                          type="radio"
                          name="decision"
                          value="approved"
                          checked={decision === "approved"}
                          onChange={(e) =>
                            setDecision(e.target.value as "approved")
                          }
                          className="h-5 w-5 text-green-600 focus:ring-green-500 focus:ring-2"
                        />
                        <div className="ml-4 flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center transition-colors">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <span className="text-lg font-bold text-gray-900">
                              Approve Appeal
                            </span>
                            <p className="text-sm text-gray-600">
                              Unblock user and restore access
                            </p>
                          </div>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-2xl hover:bg-red-50 hover:border-red-300 cursor-pointer transition-all duration-300 group">
                        <input
                          type="radio"
                          name="decision"
                          value="rejected"
                          checked={decision === "rejected"}
                          onChange={(e) =>
                            setDecision(e.target.value as "rejected")
                          }
                          className="h-5 w-5 text-red-600 focus:ring-red-500 focus:ring-2"
                        />
                        <div className="ml-4 flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-100 group-hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors">
                            <XCircle className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <span className="text-lg font-bold text-gray-900">
                              Reject Appeal
                            </span>
                            <p className="text-sm text-gray-600">
                              Maintain current restrictions
                            </p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Admin Response */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Response to User <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={adminResponse}
                      onChange={(e) => setAdminResponse(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all duration-300 text-gray-900 font-medium"
                      placeholder="Provide a clear explanation for your decision..."
                    />
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                      <Info className="h-4 w-4 text-blue-500" />
                      <span>
                        This message will be sent to the user via email
                      </span>
                    </div>
                  </div>

                  {/* Internal Notes */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Internal Notes{" "}
                      <span className="text-gray-400">(Optional)</span>
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none transition-all duration-300 text-gray-900 font-medium"
                      placeholder="Add internal notes for the admin team..."
                    />
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="h-4 w-4 text-purple-500" />
                      <span>Only visible to admin team members</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleReviewSubmit}
                    disabled={reviewing || !decision || !adminResponse.trim()}
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none"
                  >
                    {reviewing ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                        Submitting Review...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-3" />
                        Submit{" "}
                        {decision
                          ? decision.charAt(0).toUpperCase() + decision.slice(1)
                          : "Review"}
                      </>
                    )}
                  </button>

                  {/* Decision Preview */}
                  {decision && adminResponse.trim() && (
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            decision === "approved"
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          {decision === "approved" ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">
                            Decision Preview
                          </h4>
                          <p className="text-sm text-gray-600">
                            {decision === "approved"
                              ? "User will be unblocked and notified"
                              : "Appeal will be rejected and user notified"}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border-l-4 border-blue-500">
                        <p className="text-sm text-gray-700 font-medium leading-relaxed">
                          {adminResponse}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900">Quick Actions</h3>
                </div>
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-xl hover:from-green-200 hover:to-emerald-200 transition-all duration-300 font-bold flex items-center justify-center gap-2">
                    <Award className="h-4 w-4" />
                    Quick Approve
                  </button>
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-red-100 to-rose-100 text-red-800 rounded-xl hover:from-red-200 hover:to-rose-200 transition-all duration-300 font-bold flex items-center justify-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Quick Reject
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Read-only status for completed appeals */}
          {!canReview && (
            <div className="xl:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div
                  className={`bg-gradient-to-r ${statusConfig.gradient} px-8 py-6 border-b border-gray-100`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${statusConfig.badgeColor}`}
                    >
                      {statusConfig.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Appeal Status
                      </h2>
                      <p className="text-gray-600">
                        This appeal has been reviewed
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-lg ${statusConfig.badgeColor} shadow-xl`}
                    >
                      {statusConfig.icon}
                      <span className="capitalize">
                        {appeal.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-4">
                      This appeal has already been processed and cannot be
                      modified.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppealReview;
