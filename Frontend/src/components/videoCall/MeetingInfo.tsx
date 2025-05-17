// import React, { useState } from "react";
// import { Copy, Check, X } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface MeetingInfoProps {
//   isOpen: boolean;
//   onClose: () => void;
//   meetingId: string;
// }

// const MeetingInfo: React.FC<MeetingInfoProps> = ({
//   isOpen,
//   onClose,
//   meetingId,
// }) => {
//   const [copied, setCopied] = useState(false);
//   const meetingLink = `${window.location.origin}/user/meeting/${meetingId}`;

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(meetingLink);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="absolute top-16 left-4 bg-white rounded-lg shadow-lg w-80 p-4">
//       <div className="flex items-start justify-between mb-4">
//         <div className="flex items-center">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="20"
//             height="20"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             className="text-blue-600 mr-2"
//           >
//             <circle cx="12" cy="12" r="10" />
//             <path d="M12 16v.01" />
//             <path d="M12 8v4" />
//           </svg>
//           <h3 className="font-medium">Meeting details</h3>
//         </div>
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={onClose}
//           className="rounded-full"
//         >
//           <X className="w-5 h-5" />
//         </Button>
//       </div>

//       <div className="space-y-4">
//         <div>
//           <label className="text-sm text-gray-600 block mb-1">Meeting ID</label>
//           <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
//             <span className="font-medium">{meetingId}</span>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={copyToClipboard}
//               className="rounded-full"
//             >
//               {copied ? (
//                 <Check className="w-4 h-4 text-green-500" />
//               ) : (
//                 <Copy className="w-4 h-4 text-gray-600" />
//               )}
//             </Button>
//           </div>
//         </div>

//         <div>
//           <label className="text-sm text-gray-600 block mb-1">
//             Meeting link
//           </label>
//           <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
//             <span className="font-medium truncate mr-2">{meetingLink}</span>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={copyToClipboard}
//               className="rounded-full"
//             >
//               {copied ? (
//                 <Check className="w-4 h-4 text-green-500" />
//               ) : (
//                 <Copy className="w-4 h-4 text-gray-600" />
//               )}
//             </Button>
//           </div>
//         </div>

//         <div className="pt-2 border-t border-gray-200">
//           <p className="text-sm text-gray-600">
//             People who use this meeting link must be approved by the meeting
//             host before they can join.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MeetingInfo;
import React, { useState } from "react";
import { Copy, Check, X } from "lucide-react";
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
  const meetingLink = `${window.location.origin}/user/meeting/${meetingId}`;

  const copyMeetingId = () => {
    navigator.clipboard.writeText(meetingId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(meetingLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 left-4 bg-white rounded-lg shadow-lg w-80 p-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-600 mr-2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v.01" />
            <path d="M12 8v4" />
          </svg>
          <h3 className="font-medium">Meeting details</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Meeting ID</label>
          <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
            <span className="font-medium">{meetingId}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyMeetingId}
              className="rounded-full"
            >
              {copiedId ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600" />
              )}
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">
            Meeting link
          </label>
          <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
            <span className="font-medium truncate mr-2">{meetingLink}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyMeetingLink}
              className="rounded-full"
            >
              {copiedLink ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600" />
              )}
            </Button>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            People who use this meeting link must be approved by the meeting
            host before they can join.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MeetingInfo;
