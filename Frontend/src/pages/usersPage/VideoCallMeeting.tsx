// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { toast } from "react-hot-toast";
// import {
//   Mic,
//   MicOff,
//   Video,
//   VideoOff,
//   ScreenShare,
//   ScreenShareOff,
//   Phone,
//   MessageSquare,
//   Users,
//   Info,
//   Smile,
//   Heart,
//   ThumbsUp,
//   PartyPopper,
// } from "lucide-react";
// import { io, Socket } from "socket.io-client";
// import Peer from "peerjs";
// import VideoGrid from "@/components/videoCall/VideoGrid";
// import Chat from "@/components/videoCall/Chat";
// import Participants from "@/components/videoCall/Participants";
// import MeetingInfo from "@/components/videoCall/MeetingInfo";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store/store";

// interface Participant {
//   id: string;
//   name: string;
//   stream?: MediaStream;
//   audio: boolean;
//   video: boolean;
// }

// interface Message {
//   id: string;
//   senderId: string;
//   senderName: string;
//   text: string;
//   timestamp: Date;
// }

// const VideoCallMeeting: React.FC = () => {
//   const { id: meetingId } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { user } = useSelector((state: RootState) => state.user);
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [peer, setPeer] = useState<Peer | null>(null);
//   const [participants, setParticipants] = useState<Participant[]>([]);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [localStream, setLocalStream] = useState<MediaStream | null>(null);
//   const [isAudioOn, setIsAudioOn] = useState(true);
//   const [isVideoOn, setIsVideoOn] = useState(true);
//   const [isSharingScreen, setIsSharingScreen] = useState(false);
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
//   const [isMeetingInfoOpen, setIsMeetingInfoOpen] = useState(false);
//   const [showReactions, setShowReactions] = useState(false);
//   const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
//   const userId = user?._id || "anonymous";

//   useEffect(() => {
//     document.title = `Meeting: ${meetingId} | MentorOne Meet`;
//     return () => {
//       document.title = "MentorOne Meet";
//     };
//   }, [meetingId]);

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     const socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
//       auth: { token },
//       transports: ["websocket"],
//     });
//     const peerInstance = new Peer(userId); // Use default PeerJS cloud server

//     setSocket(socketInstance);
//     setPeer(peerInstance);

//     const initLocalStream = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           audio: true,
//           video: true,
//         });
//         setLocalStream(stream);
//         setParticipants([
//           {
//             id: userId,
//             name: user?.firstName || "You",
//             stream,
//             audio: true,
//             video: true,
//           },
//         ]);
//       } catch (error) {
//         console.error("Error accessing media devices:", error);
//         toast({
//           title: "Media Error",
//           description:
//             "Failed to access camera or microphone. Please check permissions.",
//           variant: "destructive",
//         });
//       }
//     };

//     initLocalStream();

//     socketInstance.on("connect", () => {
//       socketInstance.emit("join-meeting", {
//         meetingId,
//         userId,
//         userName: user?.firstName || "Anonymous",
//       });
//     });

//     socketInstance.on("connect_error", (error) => {
//       toast({
//         title: "Connection Error",
//         description: "Failed to connect to the server. Please try again.",
//         variant: "destructive",
//       });
//     });

//     peerInstance.on("open", (id) => {
//       console.log("PeerJS ID:", id);
//     });

//     socketInstance.on("user-joined", ({ userId: remoteUserId, userName }) => {
//       setParticipants((prev) => [
//         ...prev,
//         { id: remoteUserId, name: userName, audio: true, video: true },
//       ]);
//       initiateCall(remoteUserId);
//     });

//     peerInstance.on("call", (call) => {
//       call.answer(localStream);
//       call.on("stream", (remoteStream) => {
//         setParticipants((prev) =>
//           prev.map((p) =>
//             p.id === call.peer ? { ...p, stream: remoteStream } : p
//           )
//         );
//       });
//     });

//     socketInstance.on("user-left", ({ userId: remoteUserId }) => {
//       setParticipants((prev) => prev.filter((p) => p.id !== remoteUserId));
//       if (peerConnections.current[remoteUserId]) {
//         peerConnections.current[remoteUserId].close();
//         delete peerConnections.current[remoteUserId];
//       }
//     });

//     socketInstance.on("message", (message) => {
//       setMessages((prev) => [...prev, message]);
//     });

//     socketInstance.on("reaction", ({ senderId, senderName, reaction }) => {
//       toast({
//         title: `${senderName} reacted`,
//         description: `Sent a ${reaction} reaction`,
//       });
//     });

//     const initiateCall = async (remoteUserId: string) => {
//       const pc = new RTCPeerConnection({
//         iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//       });
//       peerConnections.current[remoteUserId] = pc;

//       localStream
//         ?.getTracks()
//         .forEach((track) => pc.addTrack(track, localStream));
//       pc.ontrack = (event) => {
//         setParticipants((prev) =>
//           prev.map((p) =>
//             p.id === remoteUserId ? { ...p, stream: event.streams[0] } : p
//           )
//         );
//       };
//       pc.onicecandidate = (event) => {
//         if (event.candidate) {
//           socketInstance.emit("ice-candidate", {
//             to: remoteUserId,
//             candidate: event.candidate,
//           });
//         }
//       };

//       const offer = await pc.createOffer();
//       await pc.setLocalDescription(offer);
//       socketInstance.emit("offer", { to: remoteUserId, offer });

//       socketInstance.on("answer", async ({ from, answer }) => {
//         if (from === remoteUserId) {
//           await pc.setRemoteDescription(new RTCSessionDescription(answer));
//         }
//       });

//       socketInstance.on("ice-candidate", async ({ from, candidate }) => {
//         if (from === remoteUserId) {
//           await pc.addIceCandidate(new RTCIceCandidate(candidate));
//         }
//       });
//     };

//     return () => {
//       socketInstance.disconnect();
//       peerInstance.destroy();
//       localStream?.getTracks().forEach((track) => track.stop());
//       Object.values(peerConnections.current).forEach((pc) => pc.close());
//     };
//   }, [meetingId, userId, user?.firstName, navigate]);

//   const toggleAudio = () => {
//     if (localStream) {
//       const audioTrack = localStream.getAudioTracks()[0];
//       audioTrack.enabled = !audioTrack.enabled;
//       setIsAudioOn(audioTrack.enabled);
//       setParticipants((prev) =>
//         prev.map((p) =>
//           p.id === userId ? { ...p, audio: audioTrack.enabled } : p
//         )
//       );
//       socket?.emit("update-status", {
//         meetingId,
//         userId,
//         audio: audioTrack.enabled,
//         video: isVideoOn,
//       });
//     }
//   };

//   const toggleVideo = () => {
//     if (localStream) {
//       const videoTrack = localStream.getVideoTracks()[0];
//       videoTrack.enabled = !videoTrack.enabled;
//       setIsVideoOn(videoTrack.enabled);
//       setParticipants((prev) =>
//         prev.map((p) =>
//           p.id === userId ? { ...p, video: videoTrack.enabled } : p
//         )
//       );
//       socket?.emit("update-status", {
//         meetingId,
//         userId,
//         audio: isAudioOn,
//         video: videoTrack.enabled,
//       });
//     }
//   };

//   const toggleScreenShare = async () => {
//     try {
//       if (isSharingScreen) {
//         localStream?.getTracks().forEach((track) => track.stop());
//         const stream = await navigator.mediaDevices.getUserMedia({
//           audio: true,
//           video: true,
//         });
//         setLocalStream(stream);
//         setIsSharingScreen(false);
//         Object.values(peerConnections.current).forEach((pc) => {
//           const sender = pc.getSenders().find((s) => s.track?.kind === "video");
//           if (sender) {
//             sender.replaceTrack(stream.getVideoTracks()[0]);
//           }
//         });
//         setParticipants((prev) =>
//           prev.map((p) => (p.id === userId ? { ...p, stream } : p))
//         );
//       } else {
//         const stream = await navigator.mediaDevices.getDisplayMedia({
//           video: true,
//         });
//         setLocalStream(stream);
//         setIsSharingScreen(true);
//         Object.values(peerConnections.current).forEach((pc) => {
//           const sender = pc.getSenders().find((s) => s.track?.kind === "video");
//           if (sender) {
//             sender.replaceTrack(stream.getVideoTracks()[0]);
//           }
//         });
//         setParticipants((prev) =>
//           prev.map((p) => (p.id === userId ? { ...p, stream } : p))
//         );
//       }
//     } catch (error) {
//       console.error("Error toggling screen share:", error);
//       toast({
//         title: "Screen Share Error",
//         description: "Failed to start or stop screen sharing.",
//         variant: "destructive",
//       });
//     }
//   };

//   const sendMessage = (text: string) => {
//     const message: Message = {
//       id: Date.now().toString(),
//       senderId: userId,
//       senderName: user?.firstName || "You",
//       text,
//       timestamp: new Date(),
//     };
//     socket?.emit("message", { meetingId, message });
//     setMessages((prev) => [...prev, message]);
//   };

//   const sendReaction = (reaction: string) => {
//     socket?.emit("reaction", {
//       meetingId,
//       userId,
//       userName: user?.firstName || "You",
//       reaction,
//     });
//   };

//   const leaveMeeting = () => {
//     socket?.emit("leave-meeting", { meetingId, userId });
//     navigate(`/user/meeting-end/${meetingId}`);
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-900">
//       <div className="flex-1 flex">
//         <VideoGrid participants={participants} />
//         <Chat
//           isOpen={isChatOpen}
//           onClose={() => setIsChatOpen(false)}
//           messages={messages}
//           sendMessage={sendMessage}
//         />
//         <Participants
//           isOpen={isParticipantsOpen}
//           onClose={() => setIsParticipantsOpen(false)}
//           participants={participants}
//         />
//         <MeetingInfo
//           isOpen={isMeetingInfoOpen}
//           onClose={() => setIsMeetingInfoOpen(false)}
//           meetingId={meetingId}
//         />
//       </div>

//       {showReactions && (
//         <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-full p-2 flex gap-2">
//           <Button
//             variant="ghost"
//             className="rounded-full p-2 text-pink-500 hover:bg-gray-700"
//             onClick={() => sendReaction("heart")}
//           >
//             <Heart size={20} />
//           </Button>
//           <Button
//             variant="ghost"
//             className="rounded-full p-2 text-yellow-500 hover:bg-gray-700"
//             onClick={() => sendReaction("thumbsup")}
//           >
//             <ThumbsUp size={20} />
//           </Button>
//           <Button
//             variant="ghost"
//             className="rounded-full p-2 text-purple-500 hover:bg-gray-700"
//             onClick={() => sendReaction("party")}
//           >
//             <PartyPopper size={20} />
//           </Button>
//         </div>
//       )}

//       <div className="p-4 flex  items-center justify-between bg-gray-900 text-white">
//         <div className="flex items-center gap-2">
//           <span className="text-gray-400">{meetingId}</span>
//         </div>

//         <div className="flex items-center gap-2 mx-auto pb-6">
//           <Button
//             variant="ghost"
//             className={`w-14 h-14 rounded-full ${
//               !isAudioOn
//                 ? "bg-red-600 text-white"
//                 : "bg-gray-700 text-white hover:bg-gray-600"
//             }`}
//             onClick={toggleAudio}
//             aria-label={isAudioOn ? "Mute microphone" : "Unmute microphone"}
//           >
//             {isAudioOn ? <Mic size={32} /> : <MicOff size={32} />}
//           </Button>

//           <Button
//             variant="ghost"
//             className={`w-14 h-14 rounded-full ${
//               !isVideoOn
//                 ? "bg-red-600 text-white"
//                 : "bg-gray-700 text-white hover:bg-gray-600"
//             }`}
//             onClick={toggleVideo}
//             aria-label={isVideoOn ? "Turn off camera" : "Turn on camera"}
//           >
//             {isVideoOn ? <Video size={32} /> : <VideoOff size={32} />}
//           </Button>

//           <Button
//             variant="ghost"
//             className="w-14 h-14 rounded-full bg-gray-700 text-white hover:bg-gray-600"
//             onClick={toggleScreenShare}
//             aria-label={
//               isSharingScreen ? "Stop sharing screen" : "Share screen"
//             }
//           >
//             {isSharingScreen ? (
//               <ScreenShareOff size={32} />
//             ) : (
//               <ScreenShare size={32} />
//             )}
//           </Button>

//           <Button
//             variant="ghost"
//             className="w-14 h-14 rounded-full bg-gray-700 text-white hover:bg-gray-600"
//             onClick={() => setShowReactions(!showReactions)}
//             aria-label="Show reactions"
//           >
//             <Smile size={32} />
//           </Button>

//           <Button
//             variant="ghost"
//             className="w-14 h-14 rounded-full bg-gray-700 text-white hover:bg-gray-600"
//             onClick={() => setIsChatOpen(!isChatOpen)}
//             aria-label="Toggle chat"
//           >
//             <MessageSquare size={32} />
//           </Button>

//           <Button
//             variant="ghost"
//             className="w-14 h-14 rounded-full bg-gray-700 text-white hover:bg-gray-600"
//             onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
//             aria-label="Toggle participants"
//           >
//             <Users size={32} />
//           </Button>

//           <Button
//             variant="ghost"
//             className="w-14 h-14 rounded-full bg-gray-700 text-white hover:bg-gray-600"
//             onClick={() => setIsMeetingInfoOpen(!isMeetingInfoOpen)}
//             aria-label="Toggle meeting info"
//           >
//             <Info size={32} />
//           </Button>

//           <Button
//             variant="ghost"
//             className="w-14 h-14 rounded-full bg-red-600 text-white hover:bg-red-700"
//             onClick={leaveMeeting}
//             aria-label="Leave meeting"
//           >
//             <Phone size={32} className="rotate-135" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoCallMeeting;
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  ScreenShareOff,
  Phone,
  MessageSquare,
  Users,
  Info,
  Smile,
  Heart,
  ThumbsUp,
  PartyPopper,
} from "lucide-react";
import VideoGrid from "@/components/videoCall/VideoGrid";
import Chat from "@/components/videoCall/Chat";
import Participants from "@/components/videoCall/Participants";
import MeetingInfo from "@/components/videoCall/MeetingInfo";
import { useMeeting } from "@/contexts/MeetingContext";

const VideoCallMeeting: React.FC = () => {
  const { id: meetingId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    participants,
    messages,
    isAudioOn,
    isVideoOn,
    isSharingScreen,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    sendMessage,
    leaveMeeting,
    initializeMeeting,
  } = useMeeting();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isMeetingInfoOpen, setIsMeetingInfoOpen] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  useEffect(() => {
    document.title = `Meeting: ${meetingId} | MentorOne Meet`;
    initializeMeeting();
    return () => {
      document.title = "MentorOne Meet";
    };
  }, [meetingId, initializeMeeting]);

  const sendReaction = (reaction: string) => {
    sendMessage(`Reaction: ${reaction}`);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="flex-1 flex">
        <VideoGrid participants={participants} />
        <Chat
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          messages={messages}
          sendMessage={sendMessage}
        />
        <Participants
          isOpen={isParticipantsOpen}
          onClose={() => setIsParticipantsOpen(false)}
          participants={participants}
        />
        <MeetingInfo
          isOpen={isMeetingInfoOpen}
          onClose={() => setIsMeetingInfoOpen(false)}
          meetingId={meetingId}
        />
      </div>

      {showReactions && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-full p-2 flex gap-2">
          <Button
            variant="ghost"
            className="rounded-full p-2 text-pink-500 hover:bg-gray-700"
            onClick={() => sendReaction("heart")}
          >
            <Heart size={20} />
          </Button>
          <Button
            variant="ghost"
            className="rounded-full p-2 text-yellow-500 hover:bg-gray-700"
            onClick={() => sendReaction("thumbsup")}
          >
            <ThumbsUp size={20} />
          </Button>
          <Button
            variant="ghost"
            className="rounded-full p-2 text-purple-500 hover:bg-gray-700"
            onClick={() => sendReaction("party")}
          >
            <PartyPopper size={20} />
          </Button>
        </div>
      )}

      <div className="p-4 flex items-center justify-between bg-gray-900 text-white">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">{meetingId}</span>
        </div>

        <div className="flex items-center gap-2 mx-auto pb-6">
          <Button
            variant="ghost"
            className={`w-14 h-14 rounded-full ${
              !isAudioOn
                ? "bg-red-600 text-white"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
            onClick={toggleAudio}
            aria-label={isAudioOn ? "Mute microphone" : "Unmute microphone"}
          >
            {isAudioOn ? <Mic size={32} /> : <MicOff size={32} />}
          </Button>

          <Button
            variant="ghost"
            className={`w-14 h-14 rounded-full ${
              !isVideoOn
                ? "bg-red-600 text-white"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
            onClick={toggleVideo}
            aria-label={isVideoOn ? "Turn off camera" : "Turn on camera"}
          >
            {isVideoOn ? <Video size={32} /> : <VideoOff size={32} />}
          </Button>

          <Button
            variant="ghost"
            className="w-14 h-14 rounded-full bg-gray-700 text-white hover:bg-gray-600"
            onClick={toggleScreenShare}
            aria-label={
              isSharingScreen ? "Stop sharing screen" : "Share screen"
            }
          >
            {isSharingScreen ? (
              <ScreenShareOff size={32} />
            ) : (
              <ScreenShare size={32} />
            )}
          </Button>

          <Button
            variant="ghost"
            className="w-14 h-14 rounded-full bg-gray-700 text-white hover:bg-gray-600"
            onClick={() => setShowReactions(!showReactions)}
            aria-label="Show reactions"
          >
            <Smile size={32} />
          </Button>

          <Button
            variant="ghost"
            className="w-14 h-14 rounded-full bg-gray-700 text-white hover:bg-gray-600"
            onClick={() => setIsChatOpen(!isChatOpen)}
            aria-label="Toggle chat"
          >
            <MessageSquare size={32} />
          </Button>

          <Button
            variant="ghost"
            className="w-14 h-14 rounded-full bg-gray-700 text-white hover:bg-gray-600"
            onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
            aria-label="Toggle participants"
          >
            <Users size={32} />
          </Button>

          <Button
            variant="ghost"
            className="w-14 h-14 rounded-full bg-gray-700 text-white hover:bg-gray-600"
            onClick={() => setIsMeetingInfoOpen(!isMeetingInfoOpen)}
            aria-label="Toggle meeting info"
          >
            <Info size={32} />
          </Button>

          <Button
            variant="ghost"
            className="w-14 h-14 rounded-full bg-red-600 text-white hover:bg-red-700"
            onClick={leaveMeeting}
            aria-label="Leave meeting"
          >
            <Phone size={32} className="rotate-135" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallMeeting;
