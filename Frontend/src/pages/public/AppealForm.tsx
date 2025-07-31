import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
  Send,
  AlertTriangle,
} from "lucide-react";
import appealService, {
  AppealSubmissionData,
} from "../../services/appealService";

export const AppealForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get passed data
  const blockData = location.state?.blockData;
  const passedUserInfo = location.state?.userInfo;

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

  // Initialize form
  useEffect(() => {
    console.log("🔍 AppealForm: Initializing form");

    // Get user info from storage or passed data
    const userInfo = passedUserInfo || appealService.getUserInfoFromStorage();

    setFormData((prev) => ({
      ...prev,
      ...userInfo,
    }));

    console.log("🔍 AppealForm: User info loaded", userInfo);
  }, [passedUserInfo]);

  // Handle input changes
  const handleInputChange = (
    field: keyof AppealSubmissionData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear errors
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  // Submit appeal
  const handleSubmitAppeal = async () => {
    try {
      console.log("🚀 AppealForm: Starting appeal submission");
      console.log("🚀 AppealForm: Form data", formData);

      setIsSubmitting(true);
      setErrors([]);

      // Validate
      console.log("🔍 AppealForm: Validating data");
      const validation = appealService.validateAppealData(formData);

      if (!validation.isValid) {
        console.log("❌ AppealForm: Validation failed", validation.errors);
        setErrors(validation.errors);
        setIsSubmitting(false);
        return;
      }

      console.log("✅ AppealForm: Validation passed, submitting...");

      // Submit
      const result = await appealService.submitAppeal(formData);

      console.log("🔍 AppealForm: Service result", result);

      if (result.success) {
        setAppealSubmitted(true);
        setAppealId(result.data?.appealId || null);
        console.log("✅ AppealForm: Appeal submitted successfully");
      } else {
        console.error("❌ AppealForm: Submission failed", result.message);
        setErrors([result.message]);
      }
    } catch (error: any) {
      console.error("❌ AppealForm: Unexpected error", error);
      setErrors(["An unexpected error occurred. Please try again."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigate to status page
  const handleCheckStatus = () => {
    if (appealId) {
      navigate(`/appeal/status/${appealId}`);
    }
  };

  // Go back to blocked page
  const handleGoBack = () => {
    navigate("/blocked", { state: { blockData } });
  };

  // Success state
  if (appealSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-green-500/10 border-b border-green-500/30 p-6">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-green-300 mb-2">
                  Appeal Submitted Successfully!
                </h1>
                <p className="text-green-400/80">
                  We'll review your case and contact you via email within 24-48
                  hours.
                </p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {appealId && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h3 className="text-green-300 font-semibold mb-2">
                    Appeal Details:
                  </h3>
                  <p className="text-green-200 text-sm">
                    <strong>Appeal ID:</strong> {appealId}
                  </p>
                  <p className="text-green-400/70 text-xs mt-1">
                    Save this ID to track your appeal status
                  </p>
                </div>
              )}

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h3 className="text-blue-300 font-semibold mb-2">
                  What happens next:
                </h3>
                <ul className="text-blue-200/80 text-sm space-y-1">
                  <li>• Our team will review your appeal within 24-48 hours</li>
                  <li>• You'll receive an email with the decision</li>
                  <li>
                    • If approved, your account will be reactivated immediately
                  </li>
                  <li>
                    • You can check your appeal status using the link below
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCheckStatus}
                  disabled={!appealId}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  Check Appeal Status
                </button>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  Return Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-b border-white/10 p-6">
            <div className="flex items-center space-x-3 mb-3">
              <button
                onClick={handleGoBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Submit Appeal</h1>
                <p className="text-blue-200 text-sm">
                  Tell us why this decision should be reviewed
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Block Info Reminder */}
            {blockData && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="text-red-300 text-sm font-medium">
                    Appealing: {blockData.reason}
                  </span>
                </div>
              </div>
            )}

            {/* Error Display */}
            {errors.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <XCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-300 font-medium mb-2">
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

            {/* Form */}
            <div className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Appeal Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value as any)
                  }
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="wrongful_block">Wrongful Block</option>
                  <option value="account_hacked">Account Hacked</option>
                  <option value="misunderstanding">Misunderstanding</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Appeal Message *
                </label>
                <textarea
                  value={formData.appealMessage}
                  onChange={(e) =>
                    handleInputChange("appealMessage", e.target.value)
                  }
                  placeholder="Explain why this suspension should be reviewed. Include any relevant details that might help us understand your situation..."
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  maxLength={1000}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">
                    {formData.appealMessage.length}/1000 characters
                  </span>
                  <span className="text-xs text-gray-400">
                    Minimum 10 characters required
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleGoBack}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAppeal}
                disabled={isSubmitting || formData.appealMessage.length < 10}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Appeal</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppealForm;
