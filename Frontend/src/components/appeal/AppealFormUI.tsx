import React from "react";
import { MessageSquare, XCircle, Loader2 } from "lucide-react";
import { AppealSubmissionData, ExistingAppeal } from "@/services/appealService";

interface AppealFormUIProps {
  formData: AppealSubmissionData;
  errors: string[];
  isSubmitting: boolean;
  canSubmitForm: boolean;
  existingAppeal?: ExistingAppeal | null;
  emailFromUrl?: string;
  onInputChange: (field: keyof AppealSubmissionData, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const AppealFormUI: React.FC<AppealFormUIProps> = ({
  formData,
  errors,
  isSubmitting,
  canSubmitForm,
  existingAppeal,
  emailFromUrl,
  onInputChange,
  onSubmit,
  onCancel,
}) => {
  const isReappeal = existingAppeal && existingAppeal.appealCount > 0;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center space-x-2 mb-4">
        <MessageSquare className="h-5 w-5 text-blue-400" />
        <h3 className="font-semibold text-white">
          {isReappeal ? "Submit Re-appeal" : "Submit Appeal"}
        </h3>
      </div>

      {/* Show previous rejection reason if re-appealing */}
      {isReappeal &&
        existingAppeal?.status === "rejected" &&
        existingAppeal.adminResponse && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
            <p className="text-red-300 text-sm font-medium mb-2">
              Previous Rejection Reason:
            </p>
            <div className="bg-red-500/20 rounded-lg p-3">
              <p className="text-red-200 text-sm">
                {existingAppeal.adminResponse}
              </p>
            </div>
            <p className="text-red-400/70 text-xs mt-2">
              Please address the above concerns in your re-appeal.
            </p>
          </div>
        )}

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
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
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => onInputChange("firstName", e.target.value)}
            disabled={isSubmitting}
            className="p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => onInputChange("lastName", e.target.value)}
            disabled={isSubmitting}
            className="p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
          />
        </div>

        <input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => onInputChange("email", e.target.value)}
          disabled={isSubmitting}
          className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
        />

        <select
          value={formData.category}
          onChange={(e) => onInputChange("category", e.target.value as any)}
          disabled={isSubmitting}
          className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
        >
          <option value="wrongful_block">Wrongful Block</option>
          <option value="account_hacked">Account Hacked</option>
          <option value="misunderstanding">Misunderstanding</option>
          <option value="other">Other</option>
        </select>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-white text-sm font-medium">
              {isReappeal ? "Re-appeal Message *" : "Appeal Message *"}
            </label>
            {isReappeal && formData.appealMessage.length > 0 && (
              <button
                type="button"
                onClick={() => onInputChange("appealMessage", "")}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Clear Message
              </button>
            )}
          </div>

          <textarea
            value={formData.appealMessage}
            onChange={(e) => onInputChange("appealMessage", e.target.value)}
            placeholder={
              isReappeal
                ? "Please provide additional information or clarification addressing the previous rejection reason..."
                : "Explain why this action should be reviewed. Include any relevant details..."
            }
            disabled={isSubmitting}
            className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 resize-none h-32 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
            maxLength={1000}
          />
        </div>

        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>{formData.appealMessage.length}/1000 characters</span>
          <span>Minimum 10 characters required</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4">
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting || !canSubmitForm}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>
            {isSubmitting
              ? "Submitting..."
              : isReappeal
              ? "Submit Re-appeal"
              : "Submit Appeal"}
          </span>
        </button>
      </div>

      {isReappeal && (
        <div className="mt-3 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <p className="text-amber-300 text-xs">
            ⚠️ <strong>Important:</strong> This will be your final appeal for
            this blocking incident.
          </p>
        </div>
      )}
    </div>
  );
};
