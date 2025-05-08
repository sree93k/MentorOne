// import React, { useState } from "react";
// import { useMeeting } from "@/contexts/MeetingContext";
// import { Copy, Check, Info } from "lucide-react";
// import { X } from "lucide-react";
// interface MeetingInfoProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const MeetingInfo: React.FC<MeetingInfoProps> = ({ isOpen, onClose }) => {
//   const { meetingId } = useMeeting();
//   const [copied, setCopied] = useState(false);

//   const meetingLink = `${window.location.origin}/meeting/${meetingId}`;

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(meetingLink);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="absolute top-16 left-4 bg-white rounded-lg shadow-elevated w-80 p-4 bounce-in">
//       <div className="flex items-start justify-between mb-4">
//         <div className="flex items-center">
//           <Info className="w-5 h-5 text-primary-500 mr-2" />
//           <h3 className="font-medium">Meeting details</h3>
//         </div>
//         <button
//           onClick={onClose}
//           className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100"
//         >
//           <X className="w-5 h-5" />
//         </button>
//       </div>

//       <div className="space-y-4">
//         <div>
//           <label className="text-sm text-neutral-600 block mb-1">
//             Meeting ID
//           </label>
//           <div className="flex items-center justify-between bg-neutral-100 p-2 rounded">
//             <span className="font-medium">{meetingId}</span>
//             <button
//               onClick={copyToClipboard}
//               className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200"
//             >
//               {copied ? (
//                 <Check className="w-4 h-4 text-secondary-500" />
//               ) : (
//                 <Copy className="w-4 h-4 text-neutral-600" />
//               )}
//             </button>
//           </div>
//         </div>

//         <div>
//           <label className="text-sm text-neutral-600 block mb-1">
//             Meeting link
//           </label>
//           <div className="flex items-center justify-between bg-neutral-100 p-2 rounded">
//             <span className="font-medium truncate mr-2">{meetingLink}</span>
//             <button
//               onClick={copyToClipboard}
//               className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200 flex-shrink-0"
//             >
//               {copied ? (
//                 <Check className="w-4 h-4 text-secondary-500" />
//               ) : (
//                 <Copy className="w-4 h-4 text-neutral-600" />
//               )}
//             </button>
//           </div>
//         </div>

//         <div className="pt-2 border-t border-neutral-200">
//           <p className="text-sm text-neutral-600">
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
  const [copied, setCopied] = useState(false);
  const meetingLink = `${window.location.origin}/user/meeting/${meetingId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              onClick={copyToClipboard}
              className="rounded-full"
            >
              {copied ? (
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
              onClick={copyToClipboard}
              className="rounded-full"
            >
              {copied ? (
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
