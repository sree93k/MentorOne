// import React from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Mic,
//   MicOff,
//   Video,
//   VideoOff,
//   ScreenShare,
//   ScreenShareOff,
//   Smile,
//   MessageSquare,
//   Users,
//   Info,
//   Phone,
// } from "lucide-react";

// interface MeetingControllerProps {
//   meetingId: string | undefined;
//   isAudioOn: boolean;
//   isVideoOn: boolean;
//   isSharingScreen: boolean;
//   showReactions: boolean;
//   isChatOpen: boolean;
//   isParticipantsOpen: boolean;
//   isMeetingInfoOpen: boolean;
//   toggleAudio: () => void;
//   toggleVideo: () => void;
//   toggleScreenShare: () => void;
//   setShowReactions: (value: boolean) => void;
//   setIsChatOpen: (value: boolean) => void;
//   setIsParticipantsOpen: (value: boolean) => void;
//   setIsMeetingInfoOpen: (value: boolean) => void;
//   leaveMeeting: () => void;
// }

// const MeetingController: React.FC<MeetingControllerProps> = ({
//   meetingId,
//   isAudioOn,
//   isVideoOn,
//   isSharingScreen,
//   showReactions,
//   isChatOpen,
//   isParticipantsOpen,
//   isMeetingInfoOpen,
//   toggleAudio,
//   toggleVideo,
//   toggleScreenShare,
//   setShowReactions,
//   setIsChatOpen,
//   setIsParticipantsOpen,
//   setIsMeetingInfoOpen,
//   leaveMeeting,
// }) => {
//   return (
//     <div className="relative flex items-center p-4 bg-gray-900 text-white">
//       <div className="flex items-center gap-2">
//         <span className="text-gray-400 truncate max-w-xs">
//           {meetingId ? ` ${meetingId}` : "No Meeting ID"}
//         </span>
//       </div>
//       <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
//         <Button
//           variant="ghost"
//           className={`w-14 h-14 rounded-full ${
//             !isAudioOn
//               ? "bg-red-600 text-white"
//               : "bg-gray-700 text-white hover:bg-gray-600"
//           }`}
//           onClick={toggleAudio}
//           aria-label={isAudioOn ? "Mute microphone" : "Unmute microphone"}
//         >
//           {isAudioOn ? <Mic size={24} /> : <MicOff size={24} />}
//         </Button>
//         <Button
//           variant="ghost"
//           className={`w-14 h-14 rounded-full ${
//             !isVideoOn
//               ? "bg-red-600 text-white"
//               : "bg-gray-700 text-white hover:bg-gray-600"
//           }`}
//           onClick={toggleVideo}
//           aria-label={isVideoOn ? "Turn off camera" : "Turn on camera"}
//         >
//           {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
//         </Button>
//         <Button
//           variant="ghost"
//           className={`w-14 h-14 rounded-full ${
//             isSharingScreen
//               ? "bg-green-600 text-white"
//               : "bg-gray-700 text-white hover:bg-gray-600"
//           }`}
//           onClick={toggleScreenShare}
//           aria-label={isSharingScreen ? "Stop sharing screen" : "Share screen"}
//         >
//           {isSharingScreen ? (
//             <ScreenShareOff size={24} />
//           ) : (
//             <ScreenShare size={24} />
//           )}
//         </Button>
//         <Button
//           variant="ghost"
//           className={`w-14 h-14 rounded-full ${
//             showReactions
//               ? "bg-yellow-600 text-white"
//               : "bg-gray-700 text-white hover:bg-gray-600"
//           }`}
//           onClick={() => setShowReactions(!showReactions)}
//           aria-label="Show reactions"
//         >
//           <Smile size={24} />
//         </Button>
//         <Button
//           variant="ghost"
//           className={`w-14 h-14 rounded-full ${
//             isChatOpen
//               ? "bg-blue-600 text-white"
//               : "bg-gray-700 text-white hover:bg-gray-600"
//           }`}
//           onClick={() => setIsChatOpen(!isChatOpen)}
//           aria-label="Toggle chat"
//         >
//           <MessageSquare size={24} />
//         </Button>
//         <Button
//           variant="ghost"
//           className={`w-14 h-14 rounded-full ${
//             isParticipantsOpen
//               ? "bg-blue-600 text-white"
//               : "bg-gray-700 text-white hover:bg-gray-600"
//           }`}
//           onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
//           aria-label="Toggle participants"
//         >
//           <Users size={24} />
//         </Button>
//         <Button
//           variant="ghost"
//           className={`w-14 h-14 rounded-full ${
//             isMeetingInfoOpen
//               ? "bg-blue-600 text-white"
//               : "bg-gray-700 text-white hover:bg-gray-600"
//           }`}
//           onClick={() => setIsMeetingInfoOpen(!isMeetingInfoOpen)}
//           aria-label="Toggle meeting info"
//         >
//           <Info size={24} />
//         </Button>
//         <Button
//           variant="ghost"
//           className="w-14 h-14 rounded-full bg-red-600 text-white hover:bg-red-700"
//           onClick={leaveMeeting}
//           aria-label="Leave meeting"
//         >
//           <Phone size={24} className="rotate-135" />
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default MeetingController;
