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

      console.log("📋 AppealReview: Loading appeal details", { appealId });

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

  // ✅ REPLACE handleReviewSubmit:
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

      console.log("📋 AppealReview: Submitting review", { appealId, decision });

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
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "under_review":
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "under_review":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const canReview =
    appeal && (appeal.status === "pending" || appeal.status === "under_review");

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!appeal) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h1 className="text-xl font-semibold text-gray-900">
          Appeal not found
        </h1>
        <button
          onClick={() => navigate("/admin/appeals")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Appeals
        </button>
      </div>
    );
  }

  return (
    <div className="p-2 max-w-8xl mx-auto">
      {/* Header */}
      <main className="flex-1 mx-32 p-6 bg-white dark:bg-gray-900">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/admin/appeals")}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Appeal Review
              </h1>
              <p className="text-gray-600">Review and respond to user appeal</p>
            </div>
          </div>

          <div
            className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(
              appeal.status
            )}`}
          >
            {getStatusIcon(appeal.status)}
            <span className="text-sm font-medium capitalize">
              {appeal.status.replace("_", " ")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appeal Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                User Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {appeal.firstName} {appeal.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{appeal.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">
                    {appeal.category.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Submitted
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(appeal.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Appeal Message */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Appeal Message
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                  {appeal.appealMessage}
                </p>
              </div>
            </div>

            {/* Previous Review (if exists) */}
            {appeal.adminResponse && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Previous Review
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Admin Response
                    </label>
                    <div className="mt-1 bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {appeal.adminResponse}
                      </p>
                    </div>
                  </div>
                  {appeal.adminNotes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Internal Notes
                      </label>
                      <div className="mt-1 bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-900 whitespace-pre-wrap">
                          {appeal.adminNotes}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>
                      Reviewed: {new Date(appeal.reviewedAt!).toLocaleString()}
                    </span>
                    <span>By: {appeal.reviewedBy}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Review Actions */}
          {canReview && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Review Appeal
                </h2>

                <div className="space-y-4">
                  {/* Decision */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Decision *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="decision"
                          value="approved"
                          checked={decision === "approved"}
                          onChange={(e) =>
                            setDecision(e.target.value as "approved")
                          }
                          className="h-4 w-4 text-green-600"
                        />
                        <span className="ml-2 text-sm text-gray-900">
                          Approve Appeal
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="decision"
                          value="rejected"
                          checked={decision === "rejected"}
                          onChange={(e) =>
                            setDecision(e.target.value as "rejected")
                          }
                          className="h-4 w-4 text-red-600"
                        />
                        <span className="ml-2 text-sm text-gray-900">
                          Reject Appeal
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Admin Response */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Response to User *
                    </label>
                    <textarea
                      value={adminResponse}
                      onChange={(e) => setAdminResponse(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Explain your decision to the user..."
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      This message will be sent to the user via email.
                    </p>
                  </div>

                  {/* Internal Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Internal Notes (Optional)
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Internal notes for other admins..."
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Only visible to admin team.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleReviewSubmit}
                    disabled={reviewing || !decision || !adminResponse.trim()}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {reviewing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting Review...
                      </>
                    ) : (
                      `Submit ${
                        decision
                          ? decision.charAt(0).toUpperCase() + decision.slice(1)
                          : "Review"
                      }`
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AppealReview;
