import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, MessageSquare, Mail, Loader2 } from "lucide-react";
import { useAppealManagement } from "@/hooks/useAppealManagement";
import { AppealFormUI } from "@/components/appeal/AppealFormUI";
import { AppealStatusUI } from "@/components/appeal/AppealStatusUI";
import { BlockMessageUI } from "@/components/appeal/BlockMessageUI";

export const AppealPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    // State
    appealState,
    currentAppeal,
    refreshing,
    blockData,

    // Form state
    formData,
    errors,
    showForm,
    appealJustSubmitted,
    // Actions
    handleInputChange,
    handleSubmitAppeal,
    handleRefreshStatus,
    handleStartReappeal,
    handleStartAppeal,
    handleCancelForm,

    // Computed
    isLoading,
    isSubmitting,
    canSubmitForm,
  } = useAppealManagement();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-center">Loading appeal status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header - Dynamic based on appeal state */}
          <BlockMessageUI
            blockData={blockData}
            isApproved={appealState === "approved"}
          />

          <div className="p-6 space-y-6">
            {/* Main Content - Dynamic based on appeal state */}
            {appealState === "no_appeal" && !showForm && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Start Appeal Section */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <MessageSquare className="h-5 w-5 text-blue-400" />
                    <h3 className="font-semibold text-white">Submit Appeal</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    If you believe this suspension was made in error, you can
                    submit an appeal for review.
                  </p>
                  <button
                    onClick={handleStartAppeal}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                  >
                    Start Appeal Process
                  </button>
                </div>

                {/* Contact Support */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Mail className="h-5 w-5 text-purple-400" />
                    <h3 className="font-semibold text-white">Need Help?</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    Contact our support team directly:
                  </p>
                  <div className="space-y-3">
                    <a
                      href={`mailto:${
                        blockData?.adminEmail || "sreekuttan12kaathu@gmail.com"
                      }`}
                      className="flex items-center space-x-2 text-purple-300 hover:text-purple-200 transition-colors text-sm"
                    >
                      <span>📧</span>
                      <span>
                        {blockData?.adminEmail ||
                          "sreekuttan12kaathu@gmail.com"}
                      </span>
                    </a>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                      <p className="text-purple-300 text-xs">
                        <strong>When contacting support:</strong>
                        <br />• Include your email address
                        <br />• Mention this is regarding a blocked account
                        <br />• Provide details about your situation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Show Form */}
            {showForm && (
              <AppealFormUI
                formData={formData}
                errors={errors}
                isSubmitting={isSubmitting}
                canSubmitForm={canSubmitForm}
                existingAppeal={currentAppeal}
                emailFromUrl={formData.email}
                onInputChange={handleInputChange}
                onSubmit={handleSubmitAppeal}
                onCancel={handleCancelForm}
              />
            )}

            {/* Show Appeal Status */}
            {currentAppeal &&
              !showForm &&
              (appealState === "pending" ||
                appealState === "approved" ||
                appealState === "rejected_can_reappeal" ||
                appealState === "rejected_final") && (
                <AppealStatusUI
                  appeal={currentAppeal}
                  appealState={appealState as any}
                  refreshing={refreshing}
                  blockData={blockData}
                  appealJustSubmitted={appealJustSubmitted}
                  onRefresh={handleRefreshStatus}
                  onStartReappeal={handleStartReappeal}
                  onNavigateToLogin={() => navigate("/login")}
                />
              )}

            {/* Loading state for form submission */}
            {isSubmitting && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-center justify-center space-x-3">
                  <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
                  <p className="text-blue-300 font-medium">
                    {currentAppeal?.appealCount > 0
                      ? "Submitting re-appeal..."
                      : "Submitting appeal..."}
                  </p>
                </div>
                <p className="text-blue-400/70 text-sm text-center mt-2">
                  Please wait while we process your request.
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="pt-4 border-t border-white/10 text-center">
              <button
                onClick={() => (window.location.href = "/")}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-600 border border-white/20 text-white rounded-lg hover:bg-slate-700 transition-all duration-200 text-sm"
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

export default AppealPage;
