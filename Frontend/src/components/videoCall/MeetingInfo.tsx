import React, { useState } from "react";
import { Copy, Check, X, Info, Link, QrCode, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MeetingInfoProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: string;
}

const MeetingInfo: React.FC<MeetingInfoProps> = ({
  isOpen,
  onClose,
  meetingId,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const meetingLink = `${window.location.origin}/user/meeting-join/${meetingId}`;

  const copyMeetingId = async () => {
    try {
      await navigator.clipboard.writeText(meetingId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch (err) {
      console.error("Failed to copy meeting ID:", err);
    }
  };

  const copyMeetingLink = async () => {
    try {
      await navigator.clipboard.writeText(meetingLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Failed to copy meeting link:", err);
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent("Join my MentorOne Meeting");
    const body = encodeURIComponent(
      `Hi! Please join my meeting:\n\nMeeting Link: ${meetingLink}\nMeeting ID: ${meetingId}\n\nSee you there!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-4 left-4 bg-white rounded-2xl shadow-2xl w-96 z-40 border border-gray-200 animate-slide-in-left overflow-hidden">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Info className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Meeting Details</h3>
              <p className="text-sm text-gray-500">Share with others to join</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Meeting ID Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-gray-600" />
            <label className="text-sm font-medium text-gray-700">
              Meeting ID
            </label>
          </div>
          <div className="relative group">
            <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-md">
              <span className="font-mono font-semibold text-gray-800 tracking-wider">
                {meetingId}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyMeetingId}
                className="rounded-full hover:bg-white hover:shadow-sm transition-all duration-200"
              >
                {copiedId ? (
                  <div className="flex items-center gap-1">
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                ) : (
                  <Copy className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                )}
              </Button>
            </div>
            {copiedId && (
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-lg animate-fade-in">
                Copied!
              </div>
            )}
          </div>
        </div>

        {/* Meeting Link Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Link className="w-4 h-4 text-gray-600" />
            <label className="text-sm font-medium text-gray-700">
              Meeting Link
            </label>
          </div>
          <div className="relative group">
            <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-md">
              <span className="text-sm text-gray-700 truncate mr-3 flex-1">
                {meetingLink}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyMeetingLink}
                className="rounded-full hover:bg-white hover:shadow-sm transition-all duration-200 flex-shrink-0"
              >
                {copiedLink ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                )}
              </Button>
            </div>
            {copiedLink && (
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-lg animate-fade-in">
                Link copied!
              </div>
            )}
          </div>
        </div>

        {/* Share Options */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-gray-600" />
            <label className="text-sm font-medium text-gray-700">
              Quick Share
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={shareViaEmail}
              variant="outline"
              className="flex items-center gap-2 p-3 rounded-xl border-2 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">@</span>
              </div>
              <span className="text-sm font-medium">Email</span>
            </Button>

            <Button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: "Join my MentorOne Meeting",
                    text: `Join my meeting with ID: ${meetingId}`,
                    url: meetingLink,
                  });
                } else {
                  copyMeetingLink();
                }
              }}
              variant="outline"
              className="flex items-center gap-2 p-3 rounded-xl border-2 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
            >
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Share2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium">Share</span>
            </Button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-amber-800 text-sm">
                Secure Meeting
              </h4>
              <p className="text-amber-700 text-xs leading-relaxed">
                People who use this meeting link must be approved by the meeting
                host before they can join. All communications are encrypted for
                your privacy.
              </p>
            </div>
          </div>
        </div>

        {/* Meeting Stats */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">HD</div>
            <div className="text-xs text-gray-500">Quality</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">🔒</div>
            <div className="text-xs text-gray-500">Encrypted</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">∞</div>
            <div className="text-xs text-gray-500">No Limit</div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        .animate-slide-in-left {
          animation: slideInLeft 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default MeetingInfo;
