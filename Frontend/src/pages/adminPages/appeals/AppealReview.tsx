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

//       console.log("📋 AppealReview: Loading appeal details", { appealId });

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

//   // ✅ REPLACE handleReviewSubmit:
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

//       console.log("📋 AppealReview: Submitting review", { appealId, decision });

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
//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "pending":
//         return <Clock className="h-5 w-5 text-yellow-500" />;
//       case "under_review":
//         return <AlertTriangle className="h-5 w-5 text-blue-500" />;
//       case "approved":
//         return <CheckCircle className="h-5 w-5 text-green-500" />;
//       case "rejected":
//         return <XCircle className="h-5 w-5 text-red-500" />;
//       default:
//         return <Clock className="h-5 w-5 text-gray-500" />;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "pending":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//       case "under_review":
//         return "bg-blue-100 text-blue-800 border-blue-200";
//       case "approved":
//         return "bg-green-100 text-green-800 border-green-200";
//       case "rejected":
//         return "bg-red-100 text-red-800 border-red-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   const canReview =
//     appeal && (appeal.status === "pending" || appeal.status === "under_review");

//   if (loading) {
//     return (
//       <div className="p-6 max-w-4xl mx-auto">
//         <div className="animate-pulse space-y-4">
//           <div className="h-8 bg-gray-200 rounded w-1/4"></div>
//           <div className="h-64 bg-gray-200 rounded"></div>
//         </div>
//       </div>
//     );
//   }

//   if (!appeal) {
//     return (
//       <div className="p-6 max-w-4xl mx-auto text-center">
//         <h1 className="text-xl font-semibold text-gray-900">
//           Appeal not found
//         </h1>
//         <button
//           onClick={() => navigate("/admin/appeals")}
//           className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//         >
//           Back to Appeals
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-2 max-w-8xl mx-auto">
//       {/* Header */}
//       <main className="flex-1 mx-32 p-6 bg-white dark:bg-gray-900">
//         <div className="mb-6 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => navigate("/admin/appeals")}
//               className="p-2 hover:bg-gray-100 rounded-lg"
//             >
//               <ArrowLeft className="h-5 w-5" />
//             </button>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">
//                 Appeal Review
//               </h1>
//               <p className="text-gray-600">Review and respond to user appeal</p>
//             </div>
//           </div>

//           <div
//             className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(
//               appeal.status
//             )}`}
//           >
//             {getStatusIcon(appeal.status)}
//             <span className="text-sm font-medium capitalize">
//               {appeal.status.replace("_", " ")}
//             </span>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Appeal Details */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* User Information */}
//             <div className="bg-white rounded-lg shadow p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                 <User className="h-5 w-5 mr-2" />
//                 User Information
//               </h2>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Name
//                   </label>
//                   <p className="mt-1 text-sm text-gray-900">
//                     {appeal.firstName} {appeal.lastName}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Email
//                   </label>
//                   <p className="mt-1 text-sm text-gray-900">{appeal.email}</p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Category
//                   </label>
//                   <p className="mt-1 text-sm text-gray-900 capitalize">
//                     {appeal.category.replace("_", " ")}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Submitted
//                   </label>
//                   <p className="mt-1 text-sm text-gray-900">
//                     {new Date(appeal.submittedAt).toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Appeal Message */}
//             <div className="bg-white rounded-lg shadow p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                 <MessageSquare className="h-5 w-5 mr-2" />
//                 Appeal Message
//               </h2>
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
//                   {appeal.appealMessage}
//                 </p>
//               </div>
//             </div>

//             {/* Previous Review (if exists) */}
//             {appeal.adminResponse && (
//               <div className="bg-white rounded-lg shadow p-6">
//                 <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                   Previous Review
//                 </h2>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Admin Response
//                     </label>
//                     <div className="mt-1 bg-gray-50 rounded-lg p-4">
//                       <p className="text-gray-900 whitespace-pre-wrap">
//                         {appeal.adminResponse}
//                       </p>
//                     </div>
//                   </div>
//                   {appeal.adminNotes && (
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">
//                         Internal Notes
//                       </label>
//                       <div className="mt-1 bg-gray-50 rounded-lg p-4">
//                         <p className="text-gray-900 whitespace-pre-wrap">
//                           {appeal.adminNotes}
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                   <div className="flex items-center space-x-4 text-sm text-gray-500">
//                     <span>
//                       Reviewed: {new Date(appeal.reviewedAt!).toLocaleString()}
//                     </span>
//                     <span>By: {appeal.reviewedBy}</span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Review Actions */}
//           {canReview && (
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-lg shadow p-6 sticky top-6">
//                 <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                   Review Appeal
//                 </h2>

//                 <div className="space-y-4">
//                   {/* Decision */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Decision *
//                     </label>
//                     <div className="space-y-2">
//                       <label className="flex items-center">
//                         <input
//                           type="radio"
//                           name="decision"
//                           value="approved"
//                           checked={decision === "approved"}
//                           onChange={(e) =>
//                             setDecision(e.target.value as "approved")
//                           }
//                           className="h-4 w-4 text-green-600"
//                         />
//                         <span className="ml-2 text-sm text-gray-900">
//                           Approve Appeal
//                         </span>
//                       </label>
//                       <label className="flex items-center">
//                         <input
//                           type="radio"
//                           name="decision"
//                           value="rejected"
//                           checked={decision === "rejected"}
//                           onChange={(e) =>
//                             setDecision(e.target.value as "rejected")
//                           }
//                           className="h-4 w-4 text-red-600"
//                         />
//                         <span className="ml-2 text-sm text-gray-900">
//                           Reject Appeal
//                         </span>
//                       </label>
//                     </div>
//                   </div>

//                   {/* Admin Response */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Response to User *
//                     </label>
//                     <textarea
//                       value={adminResponse}
//                       onChange={(e) => setAdminResponse(e.target.value)}
//                       rows={4}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="Explain your decision to the user..."
//                     />
//                     <p className="mt-1 text-xs text-gray-500">
//                       This message will be sent to the user via email.
//                     </p>
//                   </div>

//                   {/* Internal Notes */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Internal Notes (Optional)
//                     </label>
//                     <textarea
//                       value={adminNotes}
//                       onChange={(e) => setAdminNotes(e.target.value)}
//                       rows={3}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="Internal notes for other admins..."
//                     />
//                     <p className="mt-1 text-xs text-gray-500">
//                       Only visible to admin team.
//                     </p>
//                   </div>

//                   {/* Submit Button */}
//                   <button
//                     onClick={handleReviewSubmit}
//                     disabled={reviewing || !decision || !adminResponse.trim()}
//                     className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//                   >
//                     {reviewing ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Submitting Review...
//                       </>
//                     ) : (
//                       `Submit ${
//                         decision
//                           ? decision.charAt(0).toUpperCase() + decision.slice(1)
//                           : "Review"
//                       }`
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
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
          color: "bg-amber-50 text-amber-700 border-amber-200",
          badgeColor: "bg-amber-100 text-amber-800",
          gradient: "from-amber-500/10 to-yellow-500/10",
        };
      case "under_review":
        return {
          icon: <Eye className="h-5 w-5" />,
          color: "bg-blue-50 text-blue-700 border-blue-200",
          badgeColor: "bg-blue-100 text-blue-800",
          gradient: "from-blue-500/10 to-indigo-500/10",
        };
      case "approved":
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          color: "bg-green-50 text-green-700 border-green-200",
          badgeColor: "bg-green-100 text-green-800",
          gradient: "from-green-500/10 to-emerald-500/10",
        };
      case "rejected":
        return {
          icon: <XCircle className="h-5 w-5" />,
          color: "bg-red-50 text-red-700 border-red-200",
          badgeColor: "bg-red-100 text-red-800",
          gradient: "from-red-500/10 to-rose-500/10",
        };
      default:
        return {
          icon: <AlertTriangle className="h-5 w-5" />,
          color: "bg-gray-50 text-gray-700 border-gray-200",
          badgeColor: "bg-gray-100 text-gray-800",
          gradient: "from-gray-500/10 to-slate-500/10",
        };
    }
  };

  const canReview =
    appeal && (appeal.status === "pending" || appeal.status === "under_review");
  const statusConfig = appeal
    ? getStatusConfig(appeal.status)
    : getStatusConfig("pending");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-96">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded-lg w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!appeal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Appeal Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The appeal you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/admin/appeals")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium"
          >
            Back to Appeals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="flex-1 mx-32 p-6 bg-white dark:bg-gray-900">
        {/* Modern Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0  backdrop-blur-sm bg-white/95">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("/admin/appeals")}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 group"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Appeal Review
                  </h1>
                  <p className="text-sm text-gray-600">
                    Review and respond to user appeal
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center space-x-3 px-4 py-2 rounded-xl border-2 ${statusConfig.color}`}
              >
                {statusConfig.icon}
                <span className="font-semibold capitalize">
                  {appeal.status.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Appeal Details */}
            <div className="xl:col-span-2 space-y-6">
              {/* User Information Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      User Information
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Full Name
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {appeal.firstName} {appeal.lastName}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Email Address
                      </label>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-900 font-medium">
                          {appeal.email}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Category
                      </label>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        {appeal.category.replace("_", " ")}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Submitted
                      </label>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-900 font-medium">
                          {new Date(appeal.submittedAt).toLocaleDateString()} at{" "}
                          {new Date(appeal.submittedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appeal Message Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Appeal Message
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-500">
                    <p className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium">
                      {appeal.appealMessage}
                    </p>
                  </div>
                </div>
              </div>

              {/* Previous Review Card */}
              {appeal.adminResponse && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <FileText className="h-5 w-5 text-orange-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Previous Review
                      </h2>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Admin Response
                      </label>
                      <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                        <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                          {appeal.adminResponse}
                        </p>
                      </div>
                    </div>

                    {appeal.adminNotes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                          Internal Notes
                        </label>
                        <div className="bg-amber-50 rounded-xl p-4 border-l-4 border-amber-500">
                          <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                            {appeal.adminNotes}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Reviewed:{" "}
                            {new Date(appeal.reviewedAt!).toLocaleString()}
                          </span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Shield className="h-4 w-4" />
                          <span>By: {appeal.reviewedBy}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Technical Info Card */}
              {(appeal.ipAddress || appeal.userAgent) && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Shield className="h-5 w-5 text-gray-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Technical Details
                      </h2>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    {appeal.ipAddress && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          IP Address
                        </label>
                        <p className="text-sm font-mono text-gray-700 bg-gray-100 px-3 py-1 rounded-lg inline-block">
                          {appeal.ipAddress}
                        </p>
                      </div>
                    )}
                    {appeal.userAgent && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          User Agent
                        </label>
                        <p className="text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded-lg">
                          {appeal.userAgent}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Review Actions */}
            {canReview && (
              <div className="xl:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 sticky top-24 overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${statusConfig.gradient} px-6 py-4 border-b border-gray-200`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Send className="h-5 w-5 text-blue-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Review Appeal
                      </h2>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Decision Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Decision <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-green-50 cursor-pointer transition-colors">
                          <input
                            type="radio"
                            name="decision"
                            value="approved"
                            checked={decision === "approved"}
                            onChange={(e) =>
                              setDecision(e.target.value as "approved")
                            }
                            className="h-4 w-4 text-green-600 focus:ring-green-500"
                          />
                          <div className="ml-3 flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-medium text-gray-900">
                              Approve Appeal
                            </span>
                          </div>
                        </label>
                        <label className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-red-50 cursor-pointer transition-colors">
                          <input
                            type="radio"
                            name="decision"
                            value="rejected"
                            checked={decision === "rejected"}
                            onChange={(e) =>
                              setDecision(e.target.value as "rejected")
                            }
                            className="h-4 w-4 text-red-600 focus:ring-red-500"
                          />
                          <div className="ml-3 flex items-center space-x-2">
                            <XCircle className="h-5 w-5 text-red-600" />
                            <span className="text-sm font-medium text-gray-900">
                              Reject Appeal
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Admin Response */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Response to User <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={adminResponse}
                        onChange={(e) => setAdminResponse(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Explain your decision to the user..."
                      />
                      <p className="mt-2 text-xs text-gray-500 flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>
                          This message will be sent to the user via email
                        </span>
                      </p>
                    </div>

                    {/* Internal Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Internal Notes{" "}
                        <span className="text-gray-400">(Optional)</span>
                      </label>
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Internal notes for other admins..."
                      />
                      <p className="mt-2 text-xs text-gray-500 flex items-center space-x-1">
                        <Shield className="h-3 w-3" />
                        <span>Only visible to admin team</span>
                      </p>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleReviewSubmit}
                      disabled={reviewing || !decision || !adminResponse.trim()}
                      className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 font-semibold"
                    >
                      {reviewing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Submitting Review...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Submit{" "}
                          {decision
                            ? decision.charAt(0).toUpperCase() +
                              decision.slice(1)
                            : "Review"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppealReview;
