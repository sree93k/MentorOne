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
//   const { meetingId } = useParams<{ meetingId: string }>();
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
//     console.log("VideoCallMeeting: Meeting ID:", meetingId);
//     if (!meetingId) {
//       console.error("VideoCallMeeting: Invalid meetingId");
//       toast({
//         title: "Error",
//         description: "Invalid meeting ID",
//         variant: "destructive",
//       });
//       navigate("/user/meetinghome", { replace: true });
//       return;
//     }
//   }, [meetingId, navigate]);

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     console.log("VideoCallMeeting: Initializing socket with token:", token);
//     const socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
//       auth: { token },
//       transports: ["websocket"],
//       query: { meetingId },
//     });
//     const peerInstance = new Peer(userId, {
//       host: "/",
//       port: 9000, // Adjust if using a custom PeerJS server
//       path: "/peerjs",
//       debug: 3, // Enable verbose logging
//     });

//     setSocket(socketInstance);
//     setPeer(peerInstance);

//     const initLocalStream = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           audio: true,
//           video: true,
//         });
//         console.log("VideoCallMeeting: Local stream initialized:", stream);
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
//         console.error(
//           "VideoCallMeeting: Error accessing media devices:",
//           error
//         );
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
//       console.log("VideoCallMeeting: Socket connected, joining meeting:", {
//         meetingId,
//         userId,
//         userName: user?.firstName || "Anonymous",
//       });
//       socketInstance.emit("join-meeting", {
//         meetingId,
//         userId,
//         userName: user?.firstName || "Anonymous",
//       });
//     });

//     socketInstance.on("connect_error", (error) => {
//       console.error("VideoCallMeeting: Socket connect error:", error);
//       toast({
//         title: "Connection Error",
//         description: "Failed to connect to the server. Please try again.",
//         variant: "destructive",
//       });
//       navigate("/user/meetinghome", { replace: true });
//     });

//     peerInstance.on("open", (id) => {
//       console.log("VideoCallMeeting: PeerJS ID:", id);
//     });

//     peerInstance.on("error", (error) => {
//       console.error("VideoCallMeeting: PeerJS error:", error);
//       toast({
//         title: "PeerJS Error",
//         description: `PeerJS error: ${error.message || error.type}`,
//         variant: "destructive",
//       });
//     });

//     socketInstance.on("user-joined", ({ userId: remoteUserId, userName }) => {
//       console.log("VideoCallMeeting: User joined:", { remoteUserId, userName });
//       setParticipants((prev) => {
//         if (prev.some((p) => p.id === remoteUserId)) {
//           console.log(
//             "VideoCallMeeting: User already in participants:",
//             remoteUserId
//           );
//           return prev;
//         }
//         const newParticipants = [
//           ...prev,
//           { id: remoteUserId, name: userName, audio: true, video: true },
//         ];
//         console.log("VideoCallMeeting: Updated participants:", newParticipants);
//         return newParticipants;
//       });
//       initiateCall(remoteUserId);
//     });

//     peerInstance.on("call", (call) => {
//       console.log("VideoCallMeeting: Received call from:", call.peer);
//       call.answer(localStream);
//       call.on("stream", (remoteStream) => {
//         console.log("VideoCallMeeting: Received remote stream for:", call.peer);
//         setParticipants((prev) => {
//           const updated = prev.map((p) =>
//             p.id === call.peer ? { ...p, stream: remoteStream } : p
//           );
//           console.log(
//             "VideoCallMeeting: Updated participants with stream:",
//             updated
//           );
//           return updated;
//         });
//       });
//       call.on("error", (error) => {
//         console.error("VideoCallMeeting: Call error:", error);
//       });
//       call.on("close", () => {
//         console.log("VideoCallMeeting: Call closed:", call.peer);
//       });
//     });

//     socketInstance.on("user-left", ({ userId: remoteUserId }) => {
//       console.log("VideoCallMeeting: User left:", remoteUserId);
//       setParticipants((prev) => {
//         const updated = prev.filter((p) => p.id !== remoteUserId);
//         console.log(
//           "VideoCallMeeting: Updated participants after user left:",
//           updated
//         );
//         return updated;
//       });
//       if (peerConnections.current[remoteUserId]) {
//         peerConnections.current[remoteUserId].close();
//         delete peerConnections.current[remoteUserId];
//       }
//     });

//     socketInstance.on("message", (message) => {
//       console.log("VideoCallMeeting: Received message:", message);
//       setMessages((prev) => [...prev, message]);
//     });

//     socketInstance.on("reaction", ({ senderId, senderName, reaction }) => {
//       console.log("VideoCallMeeting: Received reaction:", {
//         senderId,
//         senderName,
//         reaction,
//       });
//       toast({
//         title: `${senderName} reacted`,
//         description: `Sent a ${reaction} reaction`,
//       });
//     });

//     const initiateCall = async (remoteUserId: string) => {
//       console.log("VideoCallMeeting: Initiating call to:", remoteUserId);
//       const pc = new RTCPeerConnection({
//         iceServers: [
//           { urls: "stun:stun.l.google.com:19302" },
//           // Add TURN server if available
//           // {
//           //   urls: "turn:your.turn.server:3478",
//           //   username: "username",
//           //   credential: "password",
//           // },
//         ],
//       });
//       peerConnections.current[remoteUserId] = pc;

//       if (localStream) {
//         localStream.getTracks().forEach((track) => {
//           console.log("VideoCallMeeting: Adding track:", track.kind);
//           pc.addTrack(track, localStream);
//         });
//       } else {
//         console.warn("VideoCallMeeting: No local stream available");
//       }

//       pc.ontrack = (event) => {
//         console.log(
//           "VideoCallMeeting: Received track from:",
//           remoteUserId,
//           event.streams
//         );
//         setParticipants((prev) => {
//           const updated = prev.map((p) =>
//             p.id === remoteUserId ? { ...p, stream: event.streams[0] } : p
//           );
//           console.log(
//             "VideoCallMeeting: Updated participants with track:",
//             updated
//           );
//           return updated;
//         });
//       };

//       pc.onicecandidate = (event) => {
//         if (event.candidate) {
//           console.log(
//             "VideoCallMeeting: Sending ICE candidate to:",
//             remoteUserId
//           );
//           socketInstance.emit("ice-candidate", {
//             to: remoteUserId,
//             candidate: event.candidate,
//           });
//         }
//       };

//       pc.oniceconnectionstatechange = () => {
//         console.log(
//           "VideoCallMeeting: ICE connection state:",
//           pc.iceConnectionState
//         );
//         if (pc.iceConnectionState === "failed") {
//           console.error(
//             "VideoCallMeeting: ICE connection failed for:",
//             remoteUserId
//           );
//           toast({
//             title: "Connection Error",
//             description: "Failed to connect to peer. Trying to reconnect...",
//             variant: "destructive",
//           });
//           pc.restartIce();
//         }
//       };

//       try {
//         const offer = await pc.createOffer();
//         await pc.setLocalDescription(offer);
//         console.log("VideoCallMeeting: Sending offer to:", remoteUserId);
//         socketInstance.emit("offer", { to: remoteUserId, offer });
//       } catch (error) {
//         console.error("VideoCallMeeting: Error creating offer:", error);
//       }

//       socketInstance.on("answer", async ({ from, answer }) => {
//         if (from === remoteUserId) {
//           console.log("VideoCallMeeting: Received answer from:", from);
//           try {
//             await pc.setRemoteDescription(new RTCSessionDescription(answer));
//           } catch (error) {
//             console.error(
//               "VideoCallMeeting: Error setting remote description:",
//               error
//             );
//           }
//         }
//       });

//       socketInstance.on("ice-candidate", async ({ from, candidate }) => {
//         if (from === remoteUserId) {
//           console.log("VideoCallMeeting: Received ICE candidate from:", from);
//           try {
//             await pc.addIceCandidate(new RTCIceCandidate(candidate));
//           } catch (error) {
//             console.error(
//               "VideoCallMeeting: Error adding ICE candidate:",
//               error
//             );
//           }
//         }
//       });
//     };

//     return () => {
//       console.log("VideoCallMeeting: Cleaning up...");
//       socketInstance.disconnect();
//       peerInstance.destroy();
//       localStream?.getTracks().forEach((track) => track.stop());
//       Object.values(peerConnections.current).forEach((pc) => pc.close());
//       peerConnections.current = {};
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
//       console.log("VideoCallMeeting: Toggled audio:", audioTrack.enabled);
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
//       console.log("VideoCallMeeting: Toggled video:", videoTrack.enabled);
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
//         console.log("VideoCallMeeting: Stopped screen sharing");
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
//         console.log("VideoCallMeeting: Started screen sharing");
//       }
//     } catch (error) {
//       console.error("VideoCallMeeting: Error toggling screen share:", error);
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
//     console.log("VideoCallMeeting: Sent message:", message);
//   };

//   const sendReaction = (reaction: string) => {
//     socket?.emit("reaction", {
//       meetingId,
//       userId,
//       userName: user?.firstName || "You",
//       reaction,
//     });
//     console.log("VideoCallMeeting: Sent reaction:", reaction);
//   };

//   const leaveMeeting = () => {
//     socket?.emit("leave-meeting", { meetingId, userId });
//     navigate(`/user/meeting-end/${meetingId}`);
//     console.log("VideoCallMeeting: Left meeting");
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

//       <div className="p-4 flex items-center justify-between bg-gray-900 text-white">
//         <div className="flex items-center gap-2">
//           <span className="text-gray-400">{meetingId || "No Meeting ID"}</span>
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
import React, { useState, useEffect, useRef } from "react";
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
import { io, Socket } from "socket.io-client";
import Peer from "peerjs";
import VideoGrid from "@/components/videoCall/VideoGrid";
import Chat from "@/components/videoCall/Chat";
import Participants from "@/components/videoCall/Participants";
import MeetingInfo from "@/components/videoCall/MeetingInfo";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

interface Participant {
  id: string;
  name: string;
  stream?: MediaStream;
  audio: boolean;
  video: boolean;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
}

const VideoCallMeeting: React.FC = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isMeetingInfoOpen, setIsMeetingInfoOpen] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
  const userId = user?._id || "anonymous";
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    console.log(`VideoCallMeeting: Render count: ${renderCount.current}`);
    document.title = `Meeting: ${meetingId} | MentorOne Meet`;
    return () => {
      document.title = "MentorOne Meet";
    };
  }, [meetingId]);

  useEffect(() => {
    console.log("VideoCallMeeting: Meeting ID:", meetingId);
    if (!meetingId) {
      console.error("VideoCallMeeting: Invalid meetingId");
      toast({
        title: "Error",
        description: "Invalid meeting ID",
        variant: "destructive",
      });
      navigate("/user/meetinghome", { replace: true });
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("VideoCallMeeting: No accessToken found");
      toast({
        title: "Authentication Error",
        description: "Please log in to join the meeting",
        variant: "destructive",
      });
      navigate("/login", { replace: true });
      return;
    }

    console.log(
      "VideoCallMeeting: Initializing socket with token:",
      token.substring(0, 20) + "..."
    );
    const socketInstance = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5002",
      {
        auth: { token },
        transports: ["websocket"],
        path: "/socket.io/",
        query: { meetingId },
        reconnectionAttempts: 5,
      }
    );
    const peerId = `${userId}_${Date.now()}`; // Unique peer ID
    const peerInstance = new Peer(peerId, {
      host: "localhost",
      port: 9000,
      path: "/peerjs",
      debug: 3,
    });

    setSocket(socketInstance);
    setPeer(peerInstance);

    const initLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        console.log("VideoCallMeeting: Local stream initialized:", stream);
        setLocalStream(stream);
        setParticipants([
          {
            id: userId,
            name: user?.firstName || "You",
            stream,
            audio: true,
            video: true,
          },
        ]);
      } catch (error) {
        console.error(
          "VideoCallMeeting: Error accessing media devices:",
          error
        );
        toast({
          title: "Media Error",
          description:
            "Failed to access camera or microphone. Please check permissions.",
          variant: "destructive",
        });
      }
    };

    initLocalStream();

    // socketInstance.on("connect", () => {
    //   console.log("VideoCallMeeting: Socket connected, joining meeting:", {
    //     meetingId,
    //     userId,
    //     userName: user?.firstName || "Anonymous",
    //   });
    //   socketInstance.emit(
    //     "join-meeting",
    //     {
    //       meetingId,
    //       userId,
    //       userName: user?.firstName || "Anonymous",
    //     },
    //     (response: any) => {
    //       console.log("VideoCallMeeting: Join-meeting response:", response);
    //       if (!response?.success) {
    //         console.error(
    //           "VideoCallMeeting: Failed to join meeting:",
    //           response?.error
    //         );
    //         toast({
    //           title: "Error",
    //           description: response?.error || "Failed to join meeting",
    //           variant: "destructive",
    //         });
    //         navigate("/user/meetinghome", { replace: true });
    //       }
    //     }
    //   );
    // });
    socketInstance.on("connect", () => {
      console.log("VideoCallMeeting: Socket connected, joining meeting:", {
        meetingId,
        userId,
        userName: user?.firstName || "Anonymous",
      });
      socketInstance.emit(
        "join-meeting",
        {
          meetingId,
          userId,
          userName: user?.firstName || "Anonymous",
        },
        (response: any) => {
          console.log("VideoCallMeeting: Join-meeting response:", response);
          if (!response?.success) {
            console.error(
              "VideoCallMeeting: Failed to join meeting:",
              response?.error
            );
            toast({
              title: "Error",
              description: response?.error || "Failed to join meeting",
              variant: "destructive",
            });
            navigate("/user/meetinghome", { replace: true });
          }
        }
      );
      console.log("VideoCallMeeting: Emitted join-meeting event");
    });
    socketInstance.on("connect_error", (error) => {
      console.error("VideoCallMeeting: Socket connect error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the server. Please try again.",
        variant: "destructive",
      });
      navigate("/user/meetinghome", { replace: true });
    });

    socketInstance.on("error", (error) => {
      console.error("VideoCallMeeting: Socket error:", error);
      toast({
        title: "Socket Error",
        description: "An error occurred with the server connection.",
        variant: "destructive",
      });
    });

    peerInstance.on("open", (id) => {
      console.log("VideoCallMeeting: PeerJS ID:", id);
    });

    peerInstance.on("error", (error) => {
      console.error("VideoCallMeeting: PeerJS error:", error);
      toast({
        title: "PeerJS Error",
        description: `PeerJS error: ${error.message || error.type}`,
        variant: "destructive",
      });
    });

    socketInstance.on("user-joined", ({ userId: remoteUserId, userName }) => {
      console.log("VideoCallMeeting: User joined:", { remoteUserId, userName });
      setParticipants((prev) => {
        if (prev.some((p) => p.id === remoteUserId)) {
          console.log(
            "VideoCallMeeting: User already in participants:",
            remoteUserId
          );
          return prev;
        }
        const newParticipants = [
          ...prev,
          { id: remoteUserId, name: userName, audio: true, video: true },
        ];
        console.log("VideoCallMeeting: Updated participants:", newParticipants);
        return newParticipants;
      });
      initiateCall(remoteUserId);
    });

    peerInstance.on("call", (call) => {
      console.log("VideoCallMeeting: Received call from:", call.peer);
      call.answer(localStream || undefined);
      call.on("stream", (remoteStream) => {
        console.log("VideoCallMeeting: Received remote stream for:", call.peer);
        setParticipants((prev) => {
          const updated = prev.map((p) =>
            p.id === call.peer ? { ...p, stream: remoteStream } : p
          );
          console.log(
            "VideoCallMeeting: Updated participants with stream:",
            updated
          );
          return updated;
        });
      });
      call.on("error", (error) => {
        console.error("VideoCallMeeting: Call error:", error);
      });
      call.on("close", () => {
        console.log("VideoCallMeeting: Call closed:", call.peer);
      });
    });

    socketInstance.on("user-left", ({ userId: remoteUserId }) => {
      console.log("VideoCallMeeting: User left:", remoteUserId);
      setParticipants((prev) => {
        const updated = prev.filter((p) => p.id !== remoteUserId);
        console.log(
          "VideoCallMeeting: Updated participants after user left:",
          updated
        );
        return updated;
      });
      if (peerConnections.current[remoteUserId]) {
        peerConnections.current[remoteUserId].close();
        delete peerConnections.current[remoteUserId];
      }
    });

    socketInstance.on("message", (message) => {
      console.log("VideoCallMeeting: Received message:", message);
      setMessages((prev) => [...prev, message]);
    });

    socketInstance.on("reaction", ({ senderId, senderName, reaction }) => {
      console.log("VideoCallMeeting: Received reaction:", {
        senderId,
        senderName,
        reaction,
      });
      toast({
        title: `${senderName} reacted`,
        description: `Sent a ${reaction} reaction`,
      });
    });

    socketInstance.on("offer", async ({ from, offer }) => {
      console.log("VideoCallMeeting: Received offer from:", from);
      const pc =
        peerConnections.current[from] ||
        new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
      peerConnections.current[from] = pc;

      pc.ontrack = (event) => {
        console.log(
          "VideoCallMeeting: Received track from:",
          from,
          event.streams
        );
        setParticipants((prev) => {
          const updated = prev.map((p) =>
            p.id === from ? { ...p, stream: event.streams[0] } : p
          );
          console.log(
            "VideoCallMeeting: Updated participants with track:",
            updated
          );
          return updated;
        });
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("VideoCallMeeting: Sending ICE candidate to:", from);
          socketInstance.emit("ice-candidate", {
            to: from,
            candidate: event.candidate,
          });
        }
      };

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        if (localStream) {
          localStream
            .getTracks()
            .forEach((track) => pc.addTrack(track, localStream));
        }
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        console.log("VideoCallMeeting: Sending answer to:", from);
        socketInstance.emit("answer", { to: from, answer });
      } catch (error) {
        console.error("VideoCallMeeting: Error handling offer:", error);
      }
    });

    socketInstance.on("answer", async ({ from, answer }) => {
      console.log("VideoCallMeeting: Received answer from:", from);
      const pc = peerConnections.current[from];
      if (pc) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (error) {
          console.error(
            "VideoCallMeeting: Error setting remote description:",
            error
          );
        }
      }
    });

    socketInstance.on("ice-candidate", async ({ from, candidate }) => {
      console.log("VideoCallMeeting: Received ICE candidate from:", from);
      const pc = peerConnections.current[from];
      if (pc) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error("VideoCallMeeting: Error adding ICE candidate:", error);
        }
      }
    });

    const initiateCall = async (remoteUserId: string) => {
      console.log("VideoCallMeeting: Initiating call to:", remoteUserId);
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      peerConnections.current[remoteUserId] = pc;

      if (localStream) {
        localStream.getTracks().forEach((track) => {
          console.log("VideoCallMeeting: Adding track:", track.kind);
          pc.addTrack(track, localStream);
        });
      } else {
        console.warn("VideoCallMeeting: No local stream available");
      }

      pc.ontrack = (event) => {
        console.log(
          "VideoCallMeeting: Received track from:",
          remoteUserId,
          event.streams
        );
        setParticipants((prev) => {
          const updated = prev.map((p) =>
            p.id === remoteUserId ? { ...p, stream: event.streams[0] } : p
          );
          console.log(
            "VideoCallMeeting: Updated participants with track:",
            updated
          );
          return updated;
        });
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log(
            "VideoCallMeeting: Sending ICE candidate to:",
            remoteUserId
          );
          socketInstance.emit("ice-candidate", {
            to: remoteUserId,
            candidate: event.candidate,
          });
        }
      };

      pc.oniceconnectionstatechange = () => {
        console.log(
          "VideoCallMeeting: ICE connection state:",
          pc.iceConnectionState
        );
        if (pc.iceConnectionState === "failed") {
          console.error(
            "VideoCallMeeting: ICE connection failed for:",
            remoteUserId
          );
          toast({
            title: "Connection Error",
            description: "Failed to connect to peer. Trying to reconnect...",
            variant: "destructive",
          });
          pc.restartIce();
        }
      };

      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        console.log("VideoCallMeeting: Sending offer to:", remoteUserId);
        socketInstance.emit("offer", { to: remoteUserId, offer });
      } catch (error) {
        console.error("VideoCallMeeting: Error creating offer:", error);
      }
    };

    return () => {
      console.log("VideoCallMeeting: Cleaning up...");
      socketInstance.disconnect();
      peerInstance.destroy();
      localStream?.getTracks().forEach((track) => track.stop());
      Object.values(peerConnections.current).forEach((pc) => pc.close());
      peerConnections.current = {};
    };
  }, [meetingId, userId, user?.firstName, navigate]);

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioOn(audioTrack.enabled);
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === userId ? { ...p, audio: audioTrack.enabled } : p
        )
      );
      socket?.emit("update-status", {
        meetingId,
        userId,
        audio: audioTrack.enabled,
        video: isVideoOn,
      });
      console.log("VideoCallMeeting: Toggled audio:", audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOn(videoTrack.enabled);
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === userId ? { ...p, video: videoTrack.enabled } : p
        )
      );
      socket?.emit("update-status", {
        meetingId,
        userId,
        audio: isAudioOn,
        video: videoTrack.enabled,
      });
      console.log("VideoCallMeeting: Toggled video:", videoTrack.enabled);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (isSharingScreen) {
        localStream?.getTracks().forEach((track) => track.stop());
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setLocalStream(stream);
        setIsSharingScreen(false);
        Object.values(peerConnections.current).forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === "video");
          if (sender) {
            sender.replaceTrack(stream.getVideoTracks()[0]);
          }
        });
        setParticipants((prev) =>
          prev.map((p) => (p.id === userId ? { ...p, stream } : p))
        );
        console.log("VideoCallMeeting: Stopped screen sharing");
      } else {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        setLocalStream(stream);
        setIsSharingScreen(true);
        Object.values(peerConnections.current).forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === "video");
          if (sender) {
            sender.replaceTrack(stream.getVideoTracks()[0]);
          }
        });
        setParticipants((prev) =>
          prev.map((p) => (p.id === userId ? { ...p, stream } : p))
        );
        console.log("VideoCallMeeting: Started screen sharing");
      }
    } catch (error) {
      console.error("VideoCallMeeting: Error toggling screen share:", error);
      toast({
        title: "Screen Share Error",
        description: "Failed to start or stop screen sharing.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      senderId: userId,
      senderName: user?.firstName || "You",
      text,
      timestamp: new Date(),
    };
    socket?.emit("message", { meetingId, message });
    setMessages((prev) => [...prev, message]);
    console.log("VideoCallMeeting: Sent message:", message);
  };

  const sendReaction = (reaction: string) => {
    socket?.emit("reaction", {
      meetingId,
      userId,
      userName: user?.firstName || "You",
      reaction,
    });
    console.log("VideoCallMeeting: Sent reaction:", reaction);
  };

  const leaveMeeting = () => {
    socket?.emit("leave-meeting", { meetingId, userId });
    navigate(`/user/meeting-end/${meetingId}`);
    console.log("VideoCallMeeting: Left meeting");
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
          <span className="text-gray-400">{meetingId || "No Meeting ID"}</span>
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
