import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Mail,
  MessageSquare,
  Home,
  Shield,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import appealService, { AppealSubmissionData } from "@/services/appealService";

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

  // Get block data from navigation state or props
  const blockData = location.state?.blockData as BlockData | undefined;

  // Form state
  const [formData, setFormData] = useState<AppealSubmissionData>({
    email: "",
    firstName: "",
    lastName: "",
    appealMessage: "",
    category: "wrongful_block",
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appealSubmitted, setAppealSubmitted] = useState(false);
  const [appealId, setAppealId] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    const userInfo = appealService.getUserInfoFromStorage();
    setFormData((prev) => ({
      ...prev,
      ...userInfo,
    }));
  }, []);

  // Handle form field changes
  const handleInputChange = (
    field: keyof AppealSubmissionData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  // Submit appeal
  const handleSubmitAppeal = async () => {
    try {
      setIsSubmitting(true);
      setErrors([]);

      console.log("🔍 BlockedPage: Validating appeal data");

      // Validate form data
      const validation = appealService.validateAppealData(formData);

      if (!validation.isValid) {
        setErrors(validation.errors);
        setIsSubmitting(false);
        return;
      }

      console.log("🔍 BlockedPage: Submitting appeal via service");

      // Submit appeal
      const result = await appealService.submitAppeal(formData);

      if (result.success) {
        setAppealSubmitted(true);
        setAppealId(result.data?.appealId || null);
        setShowForm(false);

        console.log("✅ BlockedPage: Appeal submitted successfully", {
          appealId: result.data?.appealId,
        });
      } else {
        setErrors([result.message]);
        console.error("❌ BlockedPage: Appeal submission failed", {
          message: result.message,
          errors: result.error,
        });
      }
    } catch (error: any) {
      console.error(
        "❌ BlockedPage: Unexpected error during appeal submission",
        error
      );
      setErrors(["An unexpected error occurred. Please try again."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check appeal status
  const handleCheckStatus = () => {
    if (appealId) {
      navigate(`/appeal/status/${appealId}`);
    }
  };

  // Get severity color
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div
            className={`bg-gradient-to-r ${getSeverityColor()} border-b border-white/10 p-6`}
          >
            <div className="flex items-center justify-center space-x-3 mb-3">
              <div className="p-3 bg-red-500/20 rounded-full">
                <Shield className="h-8 w-8 text-red-400" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white">
                  Access Restricted
                </h1>
                <p className="text-red-200 text-sm">
                  Account temporarily suspended
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Block Details */}
            {blockData && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <div>
                      <p className="text-red-300 font-medium">
                        {blockData.reason}
                      </p>
                      <p className="text-red-400/70 text-sm">
                        Category:{" "}
                        {appealService.formatCategory(blockData.category)}
                      </p>
                    </div>
                    <p className="text-red-400/70 text-sm">
                      Blocked on:{" "}
                      {new Date(blockData.timestamp).toLocaleString()}
                    </p>
                    {blockData.severity && (
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          blockData.severity === "high"
                            ? "bg-red-500/20 text-red-300"
                            : blockData.severity === "medium"
                            ? "bg-orange-500/20 text-orange-300"
                            : "bg-blue-500/20 text-blue-300"
                        }`}
                      >
                        {blockData.severity.toUpperCase()} PRIORITY
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Success State */}
            {appealSubmitted && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <CheckCircle className="h-12 w-12 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-green-300 mb-2">
                      Appeal Submitted Successfully!
                    </h3>
                    <p className="text-green-400/80 text-sm mb-4">
                      We'll review your case and contact you via email within
                      24-48 hours.
                    </p>
                    {appealId && (
                      <div className="bg-green-500/20 rounded-lg p-3 mb-4">
                        <p className="text-green-300 text-sm">
                          <strong>Appeal ID:</strong> {appealId}
                        </p>
                        <p className="text-green-400/70 text-xs mt-1">
                          Save this ID to track your appeal status
                        </p>
                      </div>
                    )}
                    <button
                      onClick={handleCheckStatus}
                      disabled={!appealId}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      Check Appeal Status
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Grid */}
            {!appealSubmitted && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Appeal Section */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  {!showForm ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <MessageSquare className="h-5 w-5 text-blue-400" />
                        <h3 className="font-semibold text-white">
                          Submit Appeal
                        </h3>
                      </div>
                      <p className="text-gray-300 text-sm mb-4">
                        If you believe this suspension was made in error, you
                        can submit an appeal for review.
                      </p>
                      <button
                        onClick={() => setShowForm(true)}
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                      >
                        Start Appeal Process
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <MessageSquare className="h-5 w-5 text-blue-400" />
                        <h3 className="font-semibold text-white">
                          Appeal Form
                        </h3>
                      </div>

                      {/* Error Display */}
                      {errors.length > 0 && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                          <div className="flex items-start space-x-2">
                            <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-red-300 text-sm font-medium mb-1">
                                Please fix the following errors:
                              </p>
                              <ul className="text-red-400/80 text-sm space-y-1">
                                {errors.map((error, index) => (
                                  <li key={index}>• {error}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Form Fields */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={(e) =>
                              handleInputChange("firstName", e.target.value)
                            }
                            className="p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          />
                          <input
                            type="text"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={(e) =>
                              handleInputChange("lastName", e.target.value)
                            }
                            className="p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          />
                        </div>

                        <input
                          type="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />

                        <select
                          value={formData.category}
                          onChange={(e) =>
                            handleInputChange("category", e.target.value as any)
                          }
                          className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                          <option value="wrongful_block">Wrongful Block</option>
                          <option value="account_hacked">Account Hacked</option>
                          <option value="misunderstanding">
                            Misunderstanding
                          </option>
                          <option value="other">Other</option>
                        </select>

                        <textarea
                          value={formData.appealMessage}
                          onChange={(e) =>
                            handleInputChange("appealMessage", e.target.value)
                          }
                          placeholder="Explain why this action should be reviewed..."
                          className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 resize-none h-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          maxLength={1000}
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">
                          {formData.appealMessage.length}/1000
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setShowForm(false)}
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-white/20 text-white rounded-lg text-sm hover:bg-white/10 disabled:opacity-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSubmitAppeal}
                            disabled={
                              isSubmitting || formData.appealMessage.length < 10
                            }
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                          >
                            {isSubmitting && (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                            <span>
                              {isSubmitting ? "Submitting..." : "Submit Appeal"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Support */}
                {/* <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <div className="flex items-center space-x-2 mb-3">
                    <Mail className="h-5 w-5 text-purple-400" />
                    <h3 className="font-semibold text-white">Need Help?</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    Contact our support team directly:
                  </p>
                  <div className="space-y-3">
                    href=
                    {`mailto:${
                      blockData?.adminEmail || "sreekuttan12kaathu@gmail.com"
                    }`}
                    className="flex items-center space-x-2 text-purple-300
                    hover:text-purple-200 transition-colors text-sm"
                    <a>
                      <span>📧</span>
                      <span>
                        {blockData?.adminEmail ||
                          "sreekuttan12kaathu@gmail.com"}
                      </span>
                    </a>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                      <p className="text-purple-300 text-xs">
                        <strong>When contacting support:</strong>
                        <br />
                        • Include your email address
                        <br />
                        • Mention this is regarding a blocked account
                        <br />• Provide details about your situation
                      </p>
                    </div>
                  </div>
                </div>
                 */}
                {/* Contact Support */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <div className="flex items-center space-x-2 mb-3">
                    <Mail className="h-5 w-5 text-purple-400" />
                    <h3 className="font-semibold text-white">Need Help?</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    Contact our support team directly:
                  </p>
                  <div className="space-y-3">
                    href=
                    {`mailto:${
                      blockData?.adminEmail || "sreekuttan12kaathu@gmail.com"
                    }`}
                    className="flex items-center space-x-2 text-purple-300
                    hover:text-purple-200 transition-colors text-sm"
                    <a>
                      <span>📧</span>
                      <span>
                        {blockData?.adminEmail ||
                          "sreekuttan12kaathu@gmail.com"}
                      </span>
                    </a>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                      <p className="text-purple-300 text-xs">
                        <strong>When contacting support:</strong>
                        <br />
                        • Include your email address
                        <br />
                        • Mention this is regarding a blocked account
                        <br />• Provide details about your situation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pt-4 border-t border-white/10 text-center">
              <button
                onClick={() => (window.location.href = "/")}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-600 border border-white/20 text-white rounded-lg hover:bg-slate-700 transition-all duration-200 text-sm"
              >
                <Home className="h-4 w-4" />
                <span>Return Home..</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockedPage;
