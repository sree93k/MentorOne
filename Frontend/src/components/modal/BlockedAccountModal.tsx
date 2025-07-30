import React, { useState, useEffect } from "react";
import { Clock, Mail, Shield, ExternalLink, Copy } from "lucide-react";

interface BlockedAccountModalProps {
  isOpen: boolean;
  blockData: {
    reason: string;
    category?: string;
    adminEmail: string;
    timestamp: string;
    canAppeal: boolean;
    severity?: "high" | "medium" | "low";
  };
  onClose?: () => void;
}

export const BlockedAccountModal: React.FC<BlockedAccountModalProps> = ({
  isOpen,
  blockData,
  onClose,
}) => {
  const [countdown, setCountdown] = useState(10);
  const [emailCopied, setEmailCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose?.();
          // Force redirect to blocked page
          window.location.href = "/blocked";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getSeverityConfig = (severity?: string) => {
    switch (severity) {
      case "high":
        return {
          color: "#dc2626",
          bgColor: "#fef2f2",
          borderColor: "#fecaca",
          icon: "🚨",
          label: "High Priority",
        };
      case "medium":
        return {
          color: "#ea580c",
          bgColor: "#fff7ed",
          borderColor: "#fed7aa",
          icon: "⚠️",
          label: "Medium Priority",
        };
      case "low":
        return {
          color: "#0ea5e9",
          bgColor: "#f0f9ff",
          borderColor: "#bae6fd",
          icon: "ℹ️",
          label: "Low Priority",
        };
      default:
        return {
          color: "#dc2626",
          bgColor: "#fef2f2",
          borderColor: "#fecaca",
          icon: "🛡️",
          label: "Suspended",
        };
    }
  };

  const severityConfig = getSeverityConfig(blockData.severity);

  const getCategoryLabel = (category?: string) => {
    const labels: { [key: string]: string } = {
      spam: "Spam/Unsolicited Messages",
      harassment: "Harassment/Abusive Behavior",
      inappropriate_content: "Inappropriate Content",
      terms_violation: "Terms of Service Violation",
      fraud: "Fraudulent Activity",
      security: "Security Concerns",
      other: "Policy Violation",
    };
    return labels[category || "other"] || "Policy Violation";
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(blockData.adminEmail);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy email:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full mx-4 shadow-2xl overflow-hidden border border-gray-200">
        {/* Enhanced Header */}
        <div
          className="px-6 pt-8 pb-6 text-center"
          style={{
            background: `linear-gradient(135deg, ${severityConfig.color} 0%, ${severityConfig.color}dd 100%)`,
          }}
        >
          <div
            className="mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-sm"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <span className="text-3xl">{severityConfig.icon}</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Account Suspended
          </h2>

          <div
            className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "white",
              backdropFilter: "blur(10px)",
            }}
          >
            {severityConfig.label}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Category & Reason */}
          <div
            className="rounded-lg p-4 mb-6 border"
            style={{
              backgroundColor: severityConfig.bgColor,
              borderColor: severityConfig.borderColor,
            }}
          >
            <div className="flex items-center mb-3">
              <Shield
                className="w-5 h-5 mr-2"
                style={{ color: severityConfig.color }}
              />
              <h3
                className="font-semibold"
                style={{ color: severityConfig.color }}
              >
                {getCategoryLabel(blockData.category)}
              </h3>
            </div>
            <div
              className="bg-white rounded-md p-3 border-l-4"
              style={{ borderLeftColor: severityConfig.color }}
            >
              <p className="text-gray-800 text-sm leading-relaxed">
                <strong>Reason:</strong> {blockData.reason}
              </p>
            </div>
          </div>

          {/* Auto-redirect countdown */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center text-amber-800 mb-2">
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-semibold">
                Redirecting in {countdown} seconds
              </span>
            </div>
            <div className="w-full bg-amber-200 rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* What happens now */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
              <span className="mr-2">📋</span>
              What happens now:
            </h4>
            <ul className="text-blue-800 text-sm space-y-2">
              <li className="flex items-start">
                <span className="mr-2 mt-0.5">•</span>
                All active sessions have been terminated
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-0.5">•</span>
                Account access is immediately suspended
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-0.5">•</span>
                You'll receive an email with full details
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-0.5">•</span>
                You can appeal this decision through support
              </li>
            </ul>
          </div>

          {/* Enhanced Contact Support */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Mail className="h-4 w-4 mr-2 text-blue-600" />
              Appeal This Decision
            </h4>

            <p className="text-gray-700 text-sm mb-4 leading-relaxed">
              If you believe this suspension is incorrect, contact our support
              team:
            </p>

            <div className="flex items-center space-x-2 p-3 bg-white rounded-md border">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-mono text-gray-800 flex-1">
                {blockData.adminEmail}
              </span>
              <button
                onClick={copyEmail}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                {emailCopied ? (
                  <>
                    <span className="text-green-600">✓</span>
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-3 flex space-x-2">
              <a
                href={`mailto:${
                  blockData.adminEmail
                }?subject=Appeal Account Suspension&body=Hello, I would like to appeal my account suspension. Suspension Date: ${new Date(
                  blockData.timestamp
                ).toLocaleString()}. Please review my case.`}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                <span>Send Appeal Email</span>
              </a>
            </div>
          </div>

          {/* Timestamp */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Suspended on: {new Date(blockData.timestamp).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={() => (window.location.href = "/blocked")}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Go to Blocked Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockedAccountModal;
