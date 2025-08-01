import React from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ExternalLink,
  Mail,
} from "lucide-react";
import { ExistingAppeal } from "@/services/appealService";
import appealService from "@/services/appealService";

interface AppealStatusUIProps {
  appeal: ExistingAppeal;
  appealState:
    | "pending"
    | "approved"
    | "rejected_can_reappeal"
    | "rejected_final";
  refreshing: boolean;
  appealJustSubmitted?: boolean;
  blockData?: any;
  onRefresh: () => void;
  onStartReappeal: () => void;
  onNavigateToLogin: () => void;
}

export const AppealStatusUI: React.FC<AppealStatusUIProps> = ({
  appeal,
  appealState,
  refreshing,
  blockData,
  onRefresh,
  appealJustSubmitted = false,
  onStartReappeal,
  onNavigateToLogin,
}) => {
  const getStatusConfig = () => {
    switch (appealState) {
      case "pending":
        return {
          icon: <Clock className="h-6 w-6 text-amber-400" />,
          title: appealJustSubmitted
            ? `${
                appeal.appealCount === 1 ? "Appeal" : "Re-appeal"
              } Submitted Successfully! ✅`
            : "Appeal Under Review",
          description: appealJustSubmitted
            ? `Your ${
                appeal.appealCount === 1 ? "appeal" : "re-appeal"
              } has been submitted and is now being reviewed by our team. You'll receive an email with the decision within 24-48 hours.`
            : "Your appeal is being reviewed by our team. You'll receive an email with the decision within 24-48 hours.",
          bgColor: appealJustSubmitted
            ? "bg-green-500/10 border-green-500/30"
            : "bg-amber-500/10 border-amber-500/30",
          textColor: appealJustSubmitted ? "text-green-300" : "text-amber-300",
          showRefresh: !appealJustSubmitted, // Don't show refresh immediately after submission
        };

      case "approved":
        return {
          icon: <CheckCircle className="h-6 w-6 text-green-400" />,
          title: "Appeal Approved! 🎉",
          description:
            appeal.adminResponse ||
            "Great news! Your appeal has been approved and your account has been restored.",
          bgColor: "bg-green-500/10 border-green-500/30",
          textColor: "text-green-300",
          showRefresh: false,
        };

      case "rejected_can_reappeal":
        return {
          icon: <XCircle className="h-6 w-6 text-red-400" />,
          title: "Appeal Rejected",
          description:
            appeal.adminResponse ||
            "Your appeal has been reviewed and rejected.",
          bgColor: "bg-red-500/10 border-red-500/30",
          textColor: "text-red-300",
          showRefresh: false,
        };

      case "rejected_final":
        return {
          icon: <XCircle className="h-6 w-6 text-red-400" />,
          title: "Appeal Rejected (Final Decision)",
          description:
            appeal.adminResponse ||
            "Your appeal has been reviewed and rejected. This was your final appeal for this blocking incident.",
          bgColor: "bg-red-500/10 border-red-500/30",
          textColor: "text-red-300",
          showRefresh: false,
        };

      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig();
  if (!statusConfig) return null;

  return (
    <div className={`${statusConfig.bgColor} border rounded-xl p-6`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">{statusConfig.icon}</div>
        <div className="flex-1 space-y-4">
          {/* Title and Refresh */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${statusConfig.textColor}`}>
                {statusConfig.title}
              </h3>
              {statusConfig.showRefresh && (
                <button
                  onClick={onRefresh}
                  disabled={refreshing}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                  title="Refresh status"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${statusConfig.textColor} ${
                      refreshing ? "animate-spin" : ""
                    }`}
                  />
                </button>
              )}
            </div>
            <p
              className={`${statusConfig.textColor}/90 text-sm mt-2 leading-relaxed`}
            >
              {statusConfig.description}
            </p>
          </div>

          {/* Appeal Metadata */}
          <div
            className={`${statusConfig.textColor}/70 text-xs bg-white/5 rounded-lg p-4`}
          >
            {appealJustSubmitted && (
              <div
                className={`${statusConfig.textColor} border border-current/20 rounded-lg p-3 mb-3`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Submission Confirmed</span>
                </div>
                <p className="text-xs">
                  Appeal ID: <strong>{appeal._id}</strong>
                </p>
                <p className="text-xs mt-1">
                  Save this page URL to check your appeal status anytime.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Appeal #{appeal.appealCount}:</strong>
                </p>
                <p>Submitted {appealService.getTimeAgo(appeal.submittedAt)}</p>
              </div>
              <div>
                <p>
                  <strong>Category:</strong>{" "}
                  {appealService.formatCategory(appeal.category)}
                </p>
                {appeal.reviewedAt && (
                  <p>Reviewed {appealService.getTimeAgo(appeal.reviewedAt)}</p>
                )}
              </div>
            </div>
            {appeal.appealCount > 1 && (
              <p className="pt-2 mt-2 border-t border-white/10">
                <strong>Note:</strong> This was a re-appeal for the same
                blocking incident.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {appealState === "approved" && (
              <div className="space-y-3">
                <button
                  onClick={onNavigateToLogin}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Login to Account</span>
                </button>
                <div className="px-4 py-3 bg-green-500/20 text-green-300 rounded-lg text-sm">
                  ⚠️ <strong>Important:</strong> Please follow our community
                  guidelines to avoid future suspensions.
                </div>
              </div>
            )}

            {appealState === "rejected_can_reappeal" && (
              <div className="space-y-3">
                <button
                  onClick={onStartReappeal}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Submit Re-appeal
                </button>
                <div className="px-4 py-3 bg-blue-500/20 text-blue-300 rounded-lg text-sm">
                  ℹ️ This will be your final appeal for this blocking incident.
                </div>
              </div>
            )}

            {appealState === "rejected_final" && (
              <div className="space-y-3">
                <div className="px-4 py-3 bg-red-500/20 text-red-300 rounded-lg text-sm">
                  ⚠️ You have reached the maximum number of appeals for this
                  incident.
                </div>

                <a
                  href={`mailto:${
                    blockData?.adminEmail || "sreekuttan12kaathu@gmail.com"
                  }?subject=Appeal Follow-up: ${
                    appeal._id
                  }&body=Dear Support Team,%0A%0AI would like to follow up on my appeal (ID: ${
                    appeal._id
                  }) that was rejected.%0A%0APlease provide additional information or reconsider my case.%0A%0AThank you.`}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors inline-flex items-center justify-center space-x-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>Contact Support</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
