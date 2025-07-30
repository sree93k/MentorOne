import React, { useState, useEffect } from "react";
import { AlertTriangle, Mail, User, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface BlockUserModalProps {
  isOpen: boolean;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string[];
    createdAt: string;
  };
  onConfirm: (blockData: {
    category: string;
    reason: string;
    adminNote?: string;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Industry Standard Block Categories
const BLOCK_CATEGORIES = [
  {
    value: "spam",
    label: "Spam/Unsolicited Messages",
    description: "Sending unwanted promotional content or messages",
    severity: "medium",
    icon: "📧",
  },
  {
    value: "harassment",
    label: "Harassment/Abusive Behavior",
    description: "Threatening, bullying, or abusive conduct",
    severity: "high",
    icon: "⚠️",
  },
  {
    value: "inappropriate_content",
    label: "Inappropriate Content",
    description: "Sharing offensive, explicit, or inappropriate material",
    severity: "medium",
    icon: "🚫",
  },
  {
    value: "terms_violation",
    label: "Terms of Service Violation",
    description: "Breaking platform rules or community guidelines",
    severity: "medium",
    icon: "📋",
  },
  {
    value: "fraud",
    label: "Fraudulent Activity",
    description: "Scamming, impersonation, or financial fraud",
    severity: "high",
    icon: "🔒",
  },
  {
    value: "security",
    label: "Security Concerns",
    description: "Account compromise or suspicious activity",
    severity: "high",
    icon: "🛡️",
  },
  {
    value: "other",
    label: "Other (Please Specify)",
    description: "Custom reason not covered by above categories",
    severity: "low",
    icon: "📝",
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "bg-red-50 text-red-700 border-red-200";
    case "medium":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "low":
      return "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

export const BlockUserModal: React.FC<BlockUserModalProps> = ({
  isOpen,
  user,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [confirmationText, setConfirmationText] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedCategory("");
      setCustomReason("");
      setAdminNote("");
      setConfirmationText("");
      setErrors({});
    }
  }, [isOpen]);

  const selectedCategoryData = BLOCK_CATEGORIES.find(
    (cat) => cat.value === selectedCategory
  );

  const validateStep = (currentStep: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (currentStep === 1) {
      if (!selectedCategory) {
        newErrors.category = "Please select a block category";
      }
    }

    if (currentStep === 2) {
      if (!customReason.trim()) {
        newErrors.reason = "Please provide a detailed reason";
      } else if (customReason.trim().length < 10) {
        newErrors.reason = "Reason must be at least 10 characters";
      } else if (customReason.trim().length > 500) {
        newErrors.reason = "Reason must be less than 500 characters";
      }
    }

    if (currentStep === 3) {
      if (confirmationText !== "BLOCK") {
        newErrors.confirmation = 'Please type "BLOCK" to confirm';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleConfirm = () => {
    if (validateStep(3)) {
      onConfirm({
        category: selectedCategory,
        reason: customReason.trim(),
        adminNote: adminNote.trim() || undefined,
      });
    }
  };

  const generateEmailPreview = () => {
    const categoryLabel = selectedCategoryData?.label || selectedCategory;
    return `Dear ${user.firstName} ${user.lastName},

Your account has been temporarily suspended due to: ${categoryLabel}

Reason: ${customReason}

If you believe this is a mistake, please contact our support team at sreekuttan12kaathu@gmail.com with your account details.

Best regards,
Mentor One Support Team`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-2xl max-h-[100vh] border-0 rounded-xl p-0 bg-white shadow-2xl overflow-hidden">
        {/* Modern Header with Gradient */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 pt-6 pb-4">
          <DialogHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse"></div>
                <div className="relative bg-white rounded-full p-3 shadow-lg">
                  <Shield className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <DialogTitle className="text-xl font-semibold text-white">
                Block User Account
              </DialogTitle>
              <DialogDescription className="text-slate-300 text-sm">
                This action will immediately suspend the user's access
              </DialogDescription>
            </div>

            {/* Compact User Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500/20 rounded-full p-2">
                  <User className="w-4 h-4 text-blue-300" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-white text-sm">
                    {user.firstName} {user.lastName}
                  </h4>
                  <p className="text-xs text-slate-300">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {user.role.slice(0, 2).map((role) => (
                      <Badge
                        key={role}
                        variant="outline"
                        className="text-xs border-white/30 text-white"
                      >
                        {role}
                      </Badge>
                    ))}
                    {user.role.length > 2 && (
                      <span className="text-xs text-slate-300">
                        +{user.role.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modern Progress Indicator */}
            <div className="flex justify-center space-x-2">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                      step >= stepNumber
                        ? "bg-blue-500 text-white shadow-lg scale-110"
                        : "bg-white/20 text-slate-300"
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <ChevronRight
                      className={`w-4 h-4 mx-1 ${
                        step > stepNumber ? "text-blue-400" : "text-slate-500"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </DialogHeader>
        </div>

        {/* Content with Fixed Height and Scrolling for All Steps */}
        <div className="px-6 py-4 h-[400px] overflow-hidden">
          {/* Step 1: Category Selection with Scroll */}
          {step === 1 && (
            <div className="h-full flex flex-col">
              <div className="text-center mb-4 flex-shrink-0">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  Select Block Category
                </h3>
                <p className="text-sm text-slate-600">
                  Choose the primary reason for blocking this user
                </p>
              </div>

              {/* Scrollable Categories Container */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {BLOCK_CATEGORIES.map((category) => (
                  <div
                    key={category.value}
                    className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedCategory === category.value
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                    onClick={() => setSelectedCategory(category.value)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <span className="text-lg mt-0.5">{category.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-slate-900 text-sm truncate">
                              {category.label}
                            </h4>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getSeverityColor(
                                category.severity
                              )}`}
                            >
                              {category.severity}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {category.description}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ml-2 flex-shrink-0 transition-all ${
                          selectedCategory === category.value
                            ? "border-blue-500 bg-blue-500"
                            : "border-slate-300"
                        }`}
                      >
                        {selectedCategory === category.value && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {errors.category && (
                <p className="text-sm text-red-600 mt-2 text-center flex-shrink-0">
                  {errors.category}
                </p>
              )}
            </div>
          )}

          {/* Step 2: Details with Scroll */}
          {step === 2 && (
            <div className="h-full flex flex-col">
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-4">
                  {/* Selected Category Display */}
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm">
                        {selectedCategoryData?.icon}
                      </span>
                      <span className="font-medium text-slate-900 text-sm">
                        {selectedCategoryData?.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {selectedCategoryData?.description}
                    </p>
                  </div>

                  {/* Detailed Reason */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Detailed Reason <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      placeholder="Provide specific details about why this user is being blocked..."
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      className={`min-h-[120px] resize-none ${
                        errors.reason ? "border-red-500" : "border-slate-300"
                      }`}
                      maxLength={500}
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{customReason.length}/500 characters</span>
                      {errors.reason && (
                        <span className="text-red-500">{errors.reason}</span>
                      )}
                    </div>
                  </div>

                  {/* Admin Notes */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Internal Notes (Optional)
                    </label>
                    <Textarea
                      placeholder="Add internal notes for other admins..."
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      className="min-h-[80px] resize-none border-slate-300"
                      maxLength={300}
                    />
                    <div className="text-xs text-slate-500">
                      {adminNote.length}/300 characters • Internal only
                    </div>
                  </div>

                  {/* Additional Guidelines */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-medium text-blue-900 text-sm mb-2">
                      Guidelines:
                    </h4>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Be specific and factual in your reason</li>
                      <li>• Include evidence or examples if available</li>
                      <li>• Consider the severity of the violation</li>
                      <li>• Document any previous warnings given</li>
                    </ul>
                  </div>

                  {/* Policy Reminder */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <h4 className="font-medium text-amber-900 text-sm mb-2">
                      ⚠️ Reminder:
                    </h4>
                    <p className="text-xs text-amber-800">
                      Blocked users will lose immediate access to their account.
                      This action should be taken only when other moderation
                      measures are insufficient. Consider temporary restrictions
                      for first-time violations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation with Scroll */}
          {step === 3 && (
            <div className="h-full flex flex-col">
              <div className="text-center mb-4 flex-shrink-0">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  Confirm Block Action
                </h3>
                <p className="text-sm text-slate-600">
                  Review details and confirm the blocking action
                </p>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-red-900 mb-2 text-sm">
                          Action Summary
                        </h4>
                        <div className="space-y-1 text-xs text-red-800">
                          <div>
                            <strong>User:</strong> {user.firstName}{" "}
                            {user.lastName} ({user.email})
                          </div>
                          <div>
                            <strong>Category:</strong>{" "}
                            {selectedCategoryData?.label}
                          </div>
                          <div>
                            <strong>Reason:</strong> {customReason}
                          </div>
                          {adminNote && (
                            <div>
                              <strong>Admin Notes:</strong> {adminNote}
                            </div>
                          )}
                          <div>
                            <strong>Roles:</strong> {user.role.join(", ")}
                          </div>
                          <div>
                            <strong>Member Since:</strong>{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Impact Notice */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <h4 className="font-medium text-orange-900 text-sm mb-2">
                      📋 What happens next:
                    </h4>
                    <ul className="text-xs text-orange-800 space-y-1">
                      <li>• User will be immediately logged out</li>
                      <li>• Account access will be suspended</li>
                      <li>• User will receive notification email</li>
                      <li>• Action will be logged in admin records</li>
                      <li>• User can appeal through support</li>
                    </ul>
                  </div>

                  {/* Email Preview */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-slate-600" />
                      <span className="font-medium text-slate-900 text-sm">
                        Email Preview:
                      </span>
                    </div>
                    <div className="bg-slate-50 border rounded-lg p-3 max-h-48 overflow-y-auto custom-scrollbar">
                      <pre className="whitespace-pre-wrap font-sans text-xs text-slate-700 leading-relaxed">
                        {generateEmailPreview()}
                      </pre>
                    </div>
                  </div>

                  {/* Legal Disclaimer */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <h4 className="font-medium text-slate-900 text-sm mb-2">
                      ⚖️ Legal Notice:
                    </h4>
                    <p className="text-xs text-slate-700">
                      This action is taken in accordance with our Terms of
                      Service and Community Guidelines. Users have the right to
                      appeal this decision through our standard support
                      channels. All user data will be retained as per our data
                      retention policy.
                    </p>
                  </div>

                  {/* Confirmation Input */}
                  <div className="space-y-2 bg-white border-2 border-red-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-slate-700">
                      Type "BLOCK" to confirm this action{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Type BLOCK to confirm"
                      value={confirmationText}
                      onChange={(e) =>
                        setConfirmationText(e.target.value.toUpperCase())
                      }
                      className={`font-mono text-center text-lg font-bold ${
                        errors.confirmation
                          ? "border-red-500"
                          : "border-slate-300"
                      } ${
                        confirmationText === "BLOCK"
                          ? "bg-green-50 border-green-500"
                          : ""
                      }`}
                    />
                    {errors.confirmation && (
                      <p className="text-sm text-red-600 text-center">
                        {errors.confirmation}
                      </p>
                    )}
                    {confirmationText === "BLOCK" && (
                      <p className="text-sm text-green-600 text-center">
                        ✓ Confirmation verified
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modern Footer */}
        <DialogFooter className="px-6 pb-6 pt-4 bg-slate-50/50 border-t border-slate-200">
          <div className="flex justify-between w-full">
            <div>
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={isLoading}
                  className="px-6 border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Back
                </Button>
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                className="px-6 border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </Button>

              {step < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  onClick={handleConfirm}
                  disabled={isLoading || confirmationText !== "BLOCK"}
                  className="px-6 bg-red-600 hover:bg-red-700 text-white shadow-sm"
                >
                  {isLoading ? "Blocking..." : "Block User"}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>

        {/* Custom Scrollbar Styles */}
        <style jsx>{`
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 #f1f5f9;
          }

          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 3px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};

export default BlockUserModal;
