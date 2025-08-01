import React from "react";
import { AlertTriangle, Shield } from "lucide-react";
import appealService from "@/services/appealService";

interface BlockData {
  reason: string;
  category: string;
  adminEmail: string;
  timestamp: string;
  canAppeal: boolean;
  severity?: "high" | "medium" | "low";
}

interface BlockMessageUIProps {
  blockData?: BlockData;
  isApproved?: boolean;
}

export const BlockMessageUI: React.FC<BlockMessageUIProps> = ({
  blockData,
  isApproved = false,
}) => {
  const getSeverityColor = () => {
    switch (blockData?.severity) {
      case "high":
        return "from-red-500/20 to-red-600/20";
      case "medium":
        return "from-orange-500/20 to-orange-600/20";
      case "low":
        return "from-blue-500/20 to-blue-600/20";
      default:
        return isApproved
          ? "from-green-500/20 to-green-600/20"
          : "from-red-500/20 to-pink-500/20";
    }
  };

  return (
    <>
      {/* Header Section */}
      <div
        className={`bg-gradient-to-r ${getSeverityColor()} border-b border-white/10 p-6`}
      >
        <div className="flex items-center justify-center space-x-3 mb-3">
          <div
            className={`p-3 ${
              isApproved ? "bg-green-500/20" : "bg-red-500/20"
            } rounded-full`}
          >
            <Shield
              className={`h-8 w-8 ${
                isApproved ? "text-green-400" : "text-red-400"
              }`}
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">
              {isApproved ? "Account Restored!" : "Access Restricted"}
            </h1>
            <p
              className={`${
                isApproved ? "text-green-200" : "text-red-200"
              } text-sm`}
            >
              {isApproved
                ? "Your appeal has been approved"
                : "Account temporarily suspended"}
            </p>
          </div>
        </div>
      </div>

      {/* Block Details */}
      {blockData && !isApproved && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <div>
                <p className="text-red-300 font-medium">{blockData.reason}</p>
                <p className="text-red-400/70 text-sm">
                  Category: {appealService.formatCategory(blockData.category)}
                </p>
              </div>
              <p className="text-red-400/70 text-sm">
                Blocked on: {new Date(blockData.timestamp).toLocaleString()}
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
    </>
  );
};
