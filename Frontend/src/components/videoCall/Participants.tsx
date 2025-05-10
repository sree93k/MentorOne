// import React from "react";
// import { useMeeting } from "@/contexts/MeetingContext";
// import { Mic, MicOff, Video as VideoIcon, VideoOff, X } from "lucide-react";

// interface ParticipantsProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const Participants: React.FC<ParticipantsProps> = ({ isOpen, onClose }) => {
//   const { participants } = useMeeting();

//   if (!isOpen) return null;

//   return (
//     <div className="fixed right-0 top-0 h-full w-full sm:w-80 bg-white shadow-lg flex flex-col z-10 slide-up">
//       <div className="flex items-center justify-between p-4 border-b">
//         <h3 className="text-lg font-medium">
//           Participants ({participants.length})
//         </h3>
//         <button
//           onClick={onClose}
//           className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100"
//         >
//           <X className="w-5 h-5" />
//         </button>
//       </div>

//       <div className="flex-1 overflow-y-auto p-2">
//         {participants.map((participant) => (
//           <div
//             key={participant.id}
//             className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg"
//           >
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-lg font-medium">
//                 {participant.name.charAt(0)}
//               </div>
//               <span
//                 className={`font-medium ${
//                   participant.id === "local" ? "text-primary-700" : ""
//                 }`}
//               >
//                 {participant.name} {participant.id === "local" && "(You)"}
//               </span>
//             </div>

//             <div className="flex items-center space-x-2">
//               {participant.audio ? (
//                 <Mic className="w-4 h-4 text-neutral-600" />
//               ) : (
//                 <MicOff className="w-4 h-4 text-danger-500" />
//               )}

//               {participant.video ? (
//                 <VideoIcon className="w-4 h-4 text-neutral-600" />
//               ) : (
//                 <VideoOff className="w-4 h-4 text-danger-500" />
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Participants;
import React, { useEffect } from "react";
import { Mic, MicOff, Video as VideoIcon, VideoOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Participant {
  id: string;
  name: string;
  stream?: MediaStream | null;
  audio: boolean;
  video: boolean;
}

interface ParticipantsProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
}

const Participants: React.FC<ParticipantsProps> = ({
  isOpen,
  onClose,
  participants,
}) => {
  if (!isOpen) return null;
  useEffect(() => {
    console.log(
      "Participants: Current participants:",
      participants.map((p) => ({
        id: p.id,
        name: p.name,
        hasStream: !!p.stream,
        audio: p.audio,
        video: p.video,
      }))
    );
  }, [participants]);

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg flex flex-col z-10">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-medium">
          Participants ({participants.length})
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-lg font-medium">
                {participant.name.charAt(0)}
              </div>
              <span
                className={`font-medium ${
                  participant.id === userId ? "text-blue-700" : ""
                }`}
              >
                {participant.name} {participant.id === userId && "(You)"}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {participant.audio ? (
                <Mic className="w-4 h-4 text-gray-600" />
              ) : (
                <MicOff className="w-4 h-4 text-red-500" />
              )}
              {participant.video ? (
                <VideoIcon className="w-4 h-4 text-gray-600" />
              ) : (
                <VideoOff className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Participants;
