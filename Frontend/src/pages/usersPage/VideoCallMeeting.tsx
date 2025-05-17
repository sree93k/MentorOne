// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useParams, useNavigate, useBeforeUnload } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { toast } from "react-hot-toast";
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

// interface JoinRequest {
//   userId: string;
//   userName: string;
//   peerId: string;
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
//   const [pendingJoinRequests, setPendingJoinRequests] = useState<JoinRequest[]>(
//     []
//   );
//   const [creatorId, setCreatorId] = useState<string | null>(null);

//   const socketRef = useRef<Socket | null>(null);
//   const peerRef = useRef<Peer | null>(null);
//   const localStreamRef = useRef<MediaStream | null>(null);
//   const peerCallsRef = useRef<{ [key: string]: any }>({});
//   const pendingJoinsRef = useRef<
//     { userId: string; userName: string; peerId: string }[]
//   >([]);
//   const pendingCallsRef = useRef<{ call: any; remoteUserId: string }[]>([]);

//   const userId = user?._id || `anonymous_${Date.now()}`;
//   const userName = user?.firstName || "Anonymous";

//   // Before unload handler
//   useBeforeUnload(
//     useCallback(() => {
//       if (localStreamRef.current) {
//         console.log("BeforeUnload: Stopping media tracks");
//         localStreamRef.current.getTracks().forEach((track) => {
//           track.enabled = false;
//           track.stop();
//         });
//         localStreamRef.current = null;
//       }
//     }, [])
//   );

//   // Initialize local stream
//   const initLocalStream = async () => {
//     try {
//       console.log("Initializing local stream...");
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//         video: true,
//       });
//       localStreamRef.current = stream;
//       setLocalStream(stream);
//       setParticipants([
//         {
//           id: userId,
//           name: userName,
//           stream,
//           audio: true,
//           video: true,
//         },
//       ]);
//       console.log("Local stream initialized");
//       processPendingJoins();
//       processPendingCalls();
//     } catch (error) {
//       console.error("Error accessing media devices:", error);
//       toast.error("Failed to access camera or microphone.");
//     }
//   };

//   // Process pending user joins
//   const processPendingJoins = () => {
//     if (!localStreamRef.current || !peerRef.current) return;

//     const pendingJoins = [...pendingJoinsRef.current];
//     pendingJoinsRef.current = [];
//     pendingJoins.forEach(
//       ({
//         userId: remoteUserId,
//         userName: remoteName,
//         peerId: remotePeerId,
//       }) => {
//         console.log(
//           `Processing pending join for ${remoteUserId} (${remotePeerId})`
//         );
//         setParticipants((prev) => {
//           if (prev.some((p) => p.id === remoteUserId)) return prev;
//           return [
//             ...prev,
//             { id: remoteUserId, name: remoteName, audio: true, video: true },
//           ];
//         });

//         const call = peerRef.current!.call(
//           remotePeerId,
//           localStreamRef.current!
//         );
//         peerCallsRef.current[remoteUserId] = call;
//         call.on("stream", (remoteStream) => {
//           console.log(`Received remote stream from ${remoteUserId}`);
//           setParticipants((prev) =>
//             prev.map((p) =>
//               p.id === remoteUserId ? { ...p, stream: remoteStream } : p
//             )
//           );
//         });
//         call.on("error", (err) => {
//           console.error(`PeerJS call error with ${remoteUserId}:`, err);
//           toast.error(`Failed to connect to ${remoteName}`);
//         });
//         call.on("close", () => {
//           console.log(`PeerJS call closed with ${remoteUserId}`);
//           setParticipants((prev) => prev.filter((p) => p.id !== remoteUserId));
//         });
//       }
//     );
//   };

//   // Process pending calls
//   const processPendingCalls = () => {
//     if (!localStreamRef.current) return;

//     const pendingCalls = [...pendingCallsRef.current];
//     pendingCallsRef.current = [];
//     pendingCalls.forEach(({ call, remoteUserId }) => {
//       console.log(`Processing pending call from ${remoteUserId}`);
//       call.answer(localStreamRef.current);
//       peerCallsRef.current[remoteUserId] = call;
//       call.on("stream", (remoteStream) => {
//         console.log(
//           `Received remote stream from ${remoteUserId} via pending call`
//         );
//         setParticipants((prev) => {
//           const participant = prev.find((p) => p.id === remoteUserId);
//           if (participant) {
//             return prev.map((p) =>
//               p.id === remoteUserId ? { ...p, stream: remoteStream } : p
//             );
//           }
//           return [
//             ...prev,
//             {
//               id: remoteUserId,
//               name: `User_${remoteUserId.slice(0, 5)}`,
//               stream: remoteStream,
//               audio: true,
//               video: true,
//             },
//           ];
//         });
//       });
//       call.on("error", (err) => {
//         console.error(`PeerJS call error with ${remoteUserId}:`, err);
//       });
//       call.on("close", () => {
//         console.log(`PeerJS call closed with ${remoteUserId}`);
//         setParticipants((prev) => prev.filter((p) => p.id !== remoteUserId));
//       });
//     });
//   };

//   // Handle admit user
//   const handleAdmitUser = (request: JoinRequest) => {
//     socket?.emit("admit-user", {
//       meetingId,
//       userId: request.userId,
//       userName: request.userName,
//       peerId: request.peerId,
//     });
//     setPendingJoinRequests((prev) =>
//       prev.filter((req) => req.userId !== request.userId)
//     );
//     toast.success(`${request.userName} admitted to the meeting`);
//   };

//   // Handle reject user
//   const handleRejectUser = (request: JoinRequest) => {
//     socket?.emit("reject-user", {
//       meetingId,
//       userId: request.userId,
//       userName: request.userName,
//     });
//     setPendingJoinRequests((prev) =>
//       prev.filter((req) => req.userId !== request.userId)
//     );
//     toast.success(`${request.userName} rejected from the meeting`);
//   };

//   useEffect(() => {
//     document.title = `Meeting: ${meetingId} | MentorOne Meet`;

//     if (!meetingId || !userId) {
//       toast.error("Invalid meeting ID or user ID.");
//       navigate("/login");
//       return;
//     }

//     const token = localStorage.getItem("accessToken");
//     if (!token) {
//       toast.error("Please log in to join the meeting.");
//       navigate("/login");
//       return;
//     }

//     // Initialize Socket.IO
//     const socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
//       auth: { token },
//       transports: ["websocket"],
//       path: "/video-socket.io/",
//       query: { meetingId },
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     });
//     socketRef.current = socketInstance;
//     setSocket(socketInstance);

//     // Initialize PeerJS
//     const peerId = `${userId}_${Date.now()}`;
//     const peerInstance = new Peer(peerId, {
//       host: import.meta.env.VITE_PEER_HOST || "localhost",
//       port: parseInt(import.meta.env.VITE_PEER_PORT || "9000"),
//       path: "/peerjs",
//       debug: 3,
//       config: {
//         iceServers: [
//           { urls: "stun:stun.l.google.com:19302" },
//           { urls: "stun:stun1.l.google.com:19302" },
//           {
//             urls: "turn:openrelay.metered.ca:443",
//             username: "openrelay.project",
//             credential: "openrelay",
//           },
//         ],
//       },
//     });
//     peerRef.current = peerInstance;
//     setPeer(peerInstance);

//     // Initialize local stream
//     initLocalStream();

//     // Socket.IO event listeners
//     socketInstance.on("connect", () => {
//       console.log("Socket.IO connected:", socketInstance.id);
//       socketInstance.emit(
//         "join-meeting",
//         { meetingId, userId, userName, peerId },
//         (response: any) => {
//           if (!response?.success) {
//             console.error("Failed to join meeting:", response?.error);
//             toast.error(response?.error || "Failed to join meeting.");
//             navigate("/user/meetinghome");
//           } else {
//             console.log("Joined meeting successfully");
//             setCreatorId(response.creatorId); // Store creatorId
//           }
//         }
//       );
//     });

//     socketInstance.on("connect_error", (error) => {
//       console.error("Socket.IO connection error:", error.message);
//       toast.error("Failed to connect to the server.");
//       if (error.message.includes("Authentication error")) {
//         localStorage.removeItem("accessToken");
//         navigate("/login");
//       }
//     });

//     socketInstance.on(
//       "join-request",
//       ({ userId: remoteUserId, userName, peerId }) => {
//         if (userId !== creatorId) return; // Only creator handles join requests
//         console.log(`Join request from ${userName} (${remoteUserId})`);
//         setPendingJoinRequests((prev) => [
//           ...prev,
//           { userId: remoteUserId, userName, peerId },
//         ]);
//         toast.info(`${userName} is requesting to join the meeting`, {
//           duration: 10000,
//         });
//       }
//     );

//     socketInstance.on(
//       "user-joined",
//       ({
//         userId: remoteUserId,
//         userName: remoteName,
//         peerId: remotePeerId,
//       }) => {
//         console.log(
//           `User joined: ${remoteUserId} (${remoteName}, ${remotePeerId})`
//         );
//         if (remoteUserId === userId) return;

//         if (!localStreamRef.current || !peerRef.current) {
//           console.log(
//             `Queuing join for ${remoteUserId} (local stream or peer not ready)`
//           );
//           pendingJoinsRef.current.push({
//             userId: remoteUserId,
//             userName: remoteName,
//             peerId: remotePeerId,
//           });
//           return;
//         }

//         setParticipants((prev) => {
//           if (prev.some((p) => p.id === remoteUserId)) return prev;
//           return [
//             ...prev,
//             { id: remoteUserId, name: remoteName, audio: true, video: true },
//           ];
//         });

//         const call = peerInstance.call(remotePeerId, localStreamRef.current);
//         console.log(`Initiating call to ${remotePeerId}`);
//         peerCallsRef.current[remoteUserId] = call;
//         call.on("stream", (remoteStream) => {
//           console.log(`Received remote stream from ${remoteUserId}`);
//           setParticipants((prev) =>
//             prev.map((p) =>
//               p.id === remoteUserId ? { ...p, stream: remoteStream } : p
//             )
//           );
//         });
//         call.on("error", (err) => {
//           console.error(`PeerJS call error with ${remoteUserId}:`, err);
//           toast.error(`Failed to connect to ${remoteName}`);
//         });
//         call.on("close", () => {
//           console.log(`PeerJS call closed with ${remoteUserId}`);
//           setParticipants((prev) => prev.filter((p) => p.id !== remoteUserId));
//         });
//       }
//     );

//     socketInstance.on(
//       "existing-participants",
//       (
//         existingParticipants: {
//           userId: string;
//           userName: string;
//           peerId: string;
//         }[]
//       ) => {
//         console.log("Received existing participants:", existingParticipants);
//         existingParticipants.forEach(
//           ({
//             userId: remoteUserId,
//             userName: remoteName,
//             peerId: remotePeerId,
//           }) => {
//             if (remoteUserId === userId) return;

//             if (!localStreamRef.current || !peerRef.current) {
//               console.log(
//                 `Queuing existing participant ${remoteUserId} (local stream or peer not ready)`
//               );
//               pendingJoinsRef.current.push({
//                 userId: remoteUserId,
//                 userName: remoteName,
//                 peerId: remotePeerId,
//               });
//               return;
//             }

//             setParticipants((prev) => {
//               if (prev.some((p) => p.id === remoteUserId)) return prev;
//               return [
//                 ...prev,
//                 {
//                   id: remoteUserId,
//                   name: remoteName,
//                   audio: true,
//                   video: true,
//                 },
//               ];
//             });

//             const call = peerInstance.call(
//               remotePeerId,
//               localStreamRef.current
//             );
//             console.log(
//               `Initiating call to existing participant ${remotePeerId}`
//             );
//             peerCallsRef.current[remoteUserId] = call;
//             call.on("stream", (remoteStream) => {
//               console.log(`Received remote stream from ${remoteUserId}`);
//               setParticipants((prev) =>
//                 prev.map((p) =>
//                   p.id === remoteUserId ? { ...p, stream: remoteStream } : p
//                 )
//               );
//             });
//             call.on("error", (err) => {
//               console.error(`PeerJS call error with ${remoteUserId}:`, err);
//               toast.error(`Failed to connect to ${remoteName}`);
//             });
//             call.on("close", () => {
//               console.log(`PeerJS call closed with ${remoteUserId}`);
//               setParticipants((prev) =>
//                 prev.filter((p) => p.id !== remoteUserId)
//               );
//             });
//           }
//         );
//       }
//     );

//     socketInstance.on("user-left", ({ userId: remoteUserId }) => {
//       console.log(`User left: ${remoteUserId}`);
//       setParticipants((prev) => prev.filter((p) => p.id !== remoteUserId));
//       if (peerCallsRef.current[remoteUserId]) {
//         peerCallsRef.current[remoteUserId].close();
//         delete peerCallsRef.current[remoteUserId];
//       }
//     });

//     socketInstance.on("message", (message: Message) => {
//       console.log("Received message:", message);
//       setMessages((prev) => [...prev, message]);
//     });

//     socketInstance.on("reaction", ({ senderId, senderName, reaction }) => {
//       console.log("Received reaction:", { senderId, senderName, reaction });
//       toast({
//         title: `${senderName} reacted`,
//         description: `Sent a ${reaction} reaction`,
//       });
//     });

//     socketInstance.on(
//       "update-status",
//       ({ userId: remoteUserId, audio, video }) => {
//         console.log("Status update:", { remoteUserId, audio, video });
//         setParticipants((prev) =>
//           prev.map((p) => (p.id === remoteUserId ? { ...p, audio, video } : p))
//         );
//       }
//     );

//     socketInstance.on("join-rejected", () => {
//       toast.error("Your join request was rejected by the meeting creator.");
//       navigate("/user/meetinghome");
//     });

//     // PeerJS event listeners
//     peerInstance.on("open", (id) => {
//       console.log("PeerJS connected:", id);
//     });

//     peerInstance.on("error", (err) => {
//       console.error("PeerJS error:", err);
//       toast.error(`PeerJS error: ${err.message || err.type}`);
//     });

//     peerInstance.on("call", (call) => {
//       console.log(`Received call from ${call.peer}`);
//       const remoteUserId = call.peer.split("_")[0];
//       if (localStreamRef.current) {
//         console.log(`Answering call from ${remoteUserId}`);
//         call.answer(localStreamRef.current);
//         peerCallsRef.current[remoteUserId] = call;
//         call.on("stream", (remoteStream) => {
//           console.log(
//             `Received remote stream from ${remoteUserId} via call answer`
//           );
//           setParticipants((prev) => {
//             const participant = prev.find((p) => p.id === remoteUserId);
//             if (participant) {
//               return prev.map((p) =>
//                 p.id === remoteUserId ? { ...p, stream: remoteStream } : p
//               );
//             }
//             return [
//               ...prev,
//               {
//                 id: remoteUserId,
//                 name: `User_${remoteUserId.slice(0, 5)}`,
//                 stream: remoteStream,
//                 audio: true,
//                 video: true,
//               },
//             ];
//           });
//         });
//         call.on("error", (err) => {
//           console.error(`PeerJS call error with ${remoteUserId}:`, err);
//         });
//         call.on("close", () => {
//           console.log(`PeerJS call closed with ${remoteUserId}`);
//           setParticipants((prev) => prev.filter((p) => p.id !== remoteUserId));
//         });
//       } else {
//         console.log(
//           `Queuing call from ${remoteUserId} (local stream not ready)`
//         );
//         pendingCallsRef.current.push({ call, remoteUserId });
//       }
//     });

//     // Cleanup
//     // return () => {
//     //   console.log("Cleaning up VideoCallMeeting");
//     //   socketInstance.disconnect();
//     //   if (localStreamRef.current) {
//     //     console.log("Stopping media tracks in cleanup");
//     //     localStreamRef.current.getTracks().forEach((track) => {
//     //       track.enabled = false;
//     //       track.stop();
//     //     });
//     //     localStreamRef.current = null;
//     //   }
//     //   Object.values(peerCallsRef.current).forEach((call) => call?.close());
//     //   peerInstance.destroy();
//     //   document.title = "MentorOne Meet";
//     // };
//     // Enhanced cleanup function for useEffect
//     // Add this to your useEffect return statement

//     return () => {
//       console.log("Component unmounting - thorough cleanup starting");

//       // 1. Disconnect socket
//       if (socketRef.current) {
//         console.log("Disconnecting socket");
//         socketRef.current.disconnect();
//         socketRef.current = null;
//       }

//       // 2. Close all peer connections
//       console.log("Closing all peer connections");
//       Object.entries(peerCallsRef.current).forEach(([userId, call]) => {
//         try {
//           if (call) {
//             // Close any peer connection senders first
//             if (call.peerConnection) {
//               const senders = call.peerConnection.getSenders();
//               senders.forEach((sender) => {
//                 if (sender.track) {
//                   sender.track.stop();
//                 }
//               });
//             }
//             call.close();
//           }
//         } catch (err) {
//           console.error(`Error closing peer connection for ${userId}:`, err);
//         }
//       });
//       peerCallsRef.current = {};

//       // 3. Destroy PeerJS instance
//       if (peerRef.current) {
//         console.log("Destroying peer instance");
//         try {
//           peerRef.current.destroy();
//         } catch (err) {
//           console.error("Error destroying PeerJS instance:", err);
//         }
//         peerRef.current = null;
//       }

//       // 4. Stop all local media tracks with multiple approaches
//       console.log("Stopping all media tracks");

//       // Stop tracks in localStreamRef
//       if (localStreamRef.current) {
//         const tracks = localStreamRef.current.getTracks();
//         console.log(`Stopping ${tracks.length} tracks from localStreamRef`);
//         tracks.forEach((track) => {
//           try {
//             console.log(`Stopping track: ${track.kind} (${track.id})`);
//             track.stop();
//           } catch (err) {
//             console.error(`Error stopping track ${track.id}:`, err);
//           }
//         });
//         localStreamRef.current = null;
//       }

//       // 5. Try to release devices by requesting with false constraints
//       try {
//         navigator.mediaDevices
//           .getUserMedia({
//             audio: false,
//             video: false,
//           })
//           .then((s) => s.getTracks().forEach((track) => track.stop()))
//           .catch((e) =>
//             console.log("Expected error from false constraints:", e)
//           );
//       } catch (err) {
//         console.log("Expected error from attempt to force-stop devices:", err);
//       }

//       document.title = "MentorOne Meet";
//       console.log("Component unmount cleanup complete");
//     };
//   }, [meetingId, userId, userName, navigate, creatorId]);

//   // Toggle audio
//   const toggleAudio = () => {
//     if (localStream) {
//       const audioTrack = localStream.getAudioTracks()[0];
//       if (audioTrack) {
//         audioTrack.enabled = !audioTrack.enabled;
//         setIsAudioOn(audioTrack.enabled);
//         setParticipants((prev) =>
//           prev.map((p) =>
//             p.id === userId ? { ...p, audio: audioTrack.enabled } : p
//           )
//         );
//         socket?.emit("update-status", {
//           meetingId,
//           userId,
//           audio: audioTrack.enabled,
//           video: isVideoOn,
//         });
//         console.log(`Audio ${audioTrack.enabled ? "enabled" : "disabled"}`);
//       }
//     }
//   };

//   // Toggle video
//   const toggleVideo = () => {
//     if (localStream) {
//       const videoTrack = localStream.getVideoTracks()[0];
//       if (videoTrack) {
//         videoTrack.enabled = !videoTrack.enabled;
//         setIsVideoOn(videoTrack.enabled);
//         setParticipants((prev) =>
//           prev.map((p) =>
//             p.id === userId ? { ...p, video: videoTrack.enabled } : p
//           )
//         );
//         socket?.emit("update-status", {
//           meetingId,
//           userId,
//           audio: isAudioOn,
//           video: videoTrack.enabled,
//         });
//         console.log(`Video ${videoTrack.enabled ? "enabled" : "disabled"}`);
//       }
//     }
//   };

//   // Toggle screen sharing
//   const toggleScreenShare = async () => {
//     try {
//       if (isSharingScreen) {
//         if (localStream) {
//           localStream.getTracks().forEach((track) => track.stop());
//         }
//         const newStream = await navigator.mediaDevices.getUserMedia({
//           audio: true,
//           video: true,
//         });
//         localStreamRef.current = newStream;
//         setLocalStream(newStream);
//         setIsVideoOn(true);
//         setIsSharingScreen(false);
//         const videoTrack = newStream.getVideoTracks()[0];
//         Object.values(peerCallsRef.current).forEach((call) => {
//           if (call && call.peerConnection) {
//             const sender = call.peerConnection
//               .getSenders()
//               .find((s) => s.track?.kind === "video");
//             if (sender && videoTrack) {
//               sender.replaceTrack(videoTrack);
//             }
//           }
//         });
//         setParticipants((prev) =>
//           prev.map((p) => (p.id === userId ? { ...p, stream: newStream } : p))
//         );
//         console.log("Switched back to camera stream:", newStream.id);
//       } else {
//         const screenStream = await navigator.mediaDevices.getDisplayMedia({
//           video: true,
//         });
//         const audioTrack = localStream?.getAudioTracks()[0];
//         const newStream = new MediaStream();
//         screenStream.getTracks().forEach((track) => {
//           newStream.addTrack(track);
//           track.onended = () => {
//             console.log(
//               `Screen share track ended: ${track.kind} (${track.id})`
//             );
//             toggleScreenShare();
//           };
//         });
//         if (audioTrack) {
//           newStream.addTrack(audioTrack);
//         }
//         localStreamRef.current = newStream;
//         setLocalStream(newStream);
//         setIsSharingScreen(true);
//         const videoTrack = newStream.getVideoTracks()[0];
//         Object.values(peerCallsRef.current).forEach((call) => {
//           if (call && call.peerConnection) {
//             const sender = call.peerConnection
//               .getSenders()
//               .find((s) => s.track?.kind === "video");
//             if (sender && videoTrack) {
//               sender.replaceTrack(videoTrack);
//             }
//           }
//         });
//         setParticipants((prev) =>
//           prev.map((p) => (p.id === userId ? { ...p, stream: newStream } : p))
//         );
//         console.log("Started screen sharing with stream:", newStream.id);
//       }
//     } catch (error) {
//       console.error("Error toggling screen share:", error);
//       toast.error("Failed to start or stop screen sharing.");
//     }
//   };

//   // Send a chat message
//   const sendMessage = (text: string) => {
//     if (!text.trim()) return;
//     const message: Message = {
//       id: `${userId}_${Date.now()}`,
//       senderId: userId,
//       senderName: userName,
//       text,
//       timestamp: new Date(),
//     };
//     socket?.emit("message", { meetingId, message });
//     setMessages((prev) => [...prev, message]);
//     console.log("Sent message:", message);
//   };

//   // Send a reaction
//   const sendReaction = (reaction: string) => {
//     socket?.emit("reaction", { meetingId, userId, userName, reaction });
//     toast({
//       title: "Reaction sent",
//       description: `You sent a ${reaction} reaction`,
//     });
//     setShowReactions(false);
//     console.log("Sent reaction:", reaction);
//   };

//   // Leave meeting
//   const leaveMeeting = () => {
//     console.log("Leaving meeting, stopping media tracks");
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach((track) => {
//         console.log(`Stopping track: ${track.kind} (${track.id})`);
//         track.enabled = false;
//         track.stop();
//       });
//       localStreamRef.current = null;
//     }
//     setLocalStream(null);
//     socket?.emit("leave-meeting", { meetingId, userId });
//     navigate(`/user/meeting-end/${meetingId}`);
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-900">
//       <div className="flex-1 flex relative">
//         <VideoGrid participants={participants} currentUserId={userId} />
//         {isChatOpen && (
//           <Chat
//             isOpen={isChatOpen}
//             onClose={() => setIsChatOpen(false)}
//             messages={messages}
//             sendMessage={sendMessage}
//           />
//         )}
//         {isParticipantsOpen && (
//           <Participants
//             isOpen={isParticipantsOpen}
//             onClose={() => setIsParticipantsOpen(false)}
//             participants={participants}
//             userId={userId}
//           />
//         )}
//         {isMeetingInfoOpen && (
//           <MeetingInfo
//             isOpen={isMeetingInfoOpen}
//             onClose={() => setIsMeetingInfoOpen(false)}
//             meetingId={meetingId || ""}
//           />
//         )}
//       </div>
//       {showReactions && (
//         <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-full p-2 flex gap-2 z-10">
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
//       {userId === creatorId && pendingJoinRequests.length > 0 && (
//         <div className="absolute bottom-4 right-4 bg-gray-800 rounded-lg p-4 z-20 max-w-md w-full">
//           {pendingJoinRequests.map((request) => (
//             <div
//               key={request.userId}
//               className="flex items-center justify-between mb-2"
//             >
//               <span className="text-white">
//                 {request.userName} wants to join
//               </span>
//               <div className="flex gap-2">
//                 <Button
//                   variant="default"
//                   className="bg-blue-600 hover:bg-green-700"
//                   onClick={() => handleAdmitUser(request)}
//                 >
//                   Admit
//                 </Button>
//                 <Button
//                   variant="default"
//                   className="bg-white hover:bg-red-700"
//                   onClick={() => handleRejectUser(request)}
//                 >
//                   Reject
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//       <div className="relative flex items-center p-4 bg-gray-900 text-white">
//         <div className="flex items-center gap-2">
//           <span className="text-gray-400 truncate max-w-xs">
//             {meetingId ? ` ${meetingId}` : "No Meeting ID"}
//           </span>
//         </div>
//         <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
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
//             {isAudioOn ? <Mic size={24} /> : <MicOff size={24} />}
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
//             {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
//           </Button>
//           <Button
//             variant="ghost"
//             className={`w-14 h-14 rounded-full ${
//               isSharingScreen
//                 ? "bg-green-600 text-white"
//                 : "bg-gray-700 text-white hover:bg-gray-600"
//             }`}
//             onClick={toggleScreenShare}
//             aria-label={
//               isSharingScreen ? "Stop sharing screen" : "Share screen"
//             }
//           >
//             {isSharingScreen ? (
//               <ScreenShareOff size={24} />
//             ) : (
//               <ScreenShare size={24} />
//             )}
//           </Button>
//           <Button
//             variant="ghost"
//             className={`w-14 h-14 rounded-full ${
//               showReactions
//                 ? "bg-yellow-600 text-white"
//                 : "bg-gray-700 text-white hover:bg-gray-600"
//             }`}
//             onClick={() => setShowReactions(!showReactions)}
//             aria-label="Show reactions"
//           >
//             <Smile size={24} />
//           </Button>
//           <Button
//             variant="ghost"
//             className={`w-14 h-14 rounded-full ${
//               isChatOpen
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-700 text-white hover:bg-gray-600"
//             }`}
//             onClick={() => setIsChatOpen(!isChatOpen)}
//             aria-label="Toggle chat"
//           >
//             <MessageSquare size={24} />
//           </Button>
//           <Button
//             variant="ghost"
//             className={`w-14 h-14 rounded-full ${
//               isParticipantsOpen
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-700 text-white hover:bg-gray-600"
//             }`}
//             onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
//             aria-label="Toggle participants"
//           >
//             <Users size={24} />
//           </Button>
//           <Button
//             variant="ghost"
//             className={`w-14 h-14 rounded-full ${
//               isMeetingInfoOpen
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-700 text-white hover:bg-gray-600"
//             }`}
//             onClick={() => setIsMeetingInfoOpen(!isMeetingInfoOpen)}
//             aria-label="Toggle meeting info"
//           >
//             <Info size={24} />
//           </Button>
//           <Button
//             variant="ghost"
//             className="w-14 h-14 rounded-full bg-red-600 text-white hover:bg-red-700"
//             onClick={leaveMeeting}
//             aria-label="Leave meeting"
//           >
//             <Phone size={24} className="rotate-135" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoCallMeeting;
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  useParams,
  useNavigate,
  useBeforeUnload,
  useLocation,
} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  ScreenShareOff,
  Smile,
  MessageSquare,
  Users,
  Info,
  Phone,
  Heart,
  ThumbsUp,
  PartyPopper,
  CameraOff,
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

interface JoinRequest {
  userId: string;
  userName: string;
  peerId: string;
}

const VideoCallMeeting: React.FC = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
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
  const [pendingJoinRequests, setPendingJoinRequests] = useState<JoinRequest[]>(
    []
  );
  const [creatorId, setCreatorId] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerCallsRef = useRef<{ [key: string]: any }>({});
  const pendingJoinsRef = useRef<
    { userId: string; userName: string; peerId: string }[]
  >([]);
  const pendingCallsRef = useRef<{ call: any; remoteUserId: string }[]>([]);

  const userId = user?._id || `anonymous_${Date.now()}`;
  const userName = user?.firstName || "User";
  const { isVideoOn: initialVideoOn = true, isMicOn: initialAudioOn = true } =
    location.state || {};

  useBeforeUnload(
    useCallback(() => {
      if (localStreamRef.current) {
        console.log("BeforeUnload: Stopping media tracks");
        localStreamRef.current.getTracks().forEach((track) => {
          track.enabled = false;
          track.stop();
        });
        localStreamRef.current = null;
      }
    }, [])
  );

  const initLocalStream = async () => {
    try {
      console.log("Initializing local stream with:", {
        initialVideoOn,
        initialAudioOn,
      });
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: initialAudioOn,
        video: initialVideoOn,
      });
      localStreamRef.current = stream;
      setLocalStream(stream);
      setIsAudioOn(initialAudioOn);
      setIsVideoOn(initialVideoOn);

      if (!initialAudioOn && stream.getAudioTracks()[0]) {
        stream.getAudioTracks()[0].enabled = false;
      }
      if (!initialVideoOn && stream.getVideoTracks()[0]) {
        stream.getVideoTracks()[0].enabled = false;
      }

      setParticipants([
        {
          id: userId,
          name: userName,
          stream,
          audio: initialAudioOn,
          video: initialVideoOn,
        },
      ]);
      console.log("Local stream initialized");
      processPendingJoins();
      processPendingCalls();
    } catch (error) {
      console.error("Error accessing media devices:", error);
      toast.error("Failed to access camera or microphone.");
    }
  };

  const processPendingJoins = () => {
    if (!localStreamRef.current || !peerRef.current) return;

    const pendingJoins = [...pendingJoinsRef.current];
    pendingJoinsRef.current = [];
    pendingJoins.forEach(
      ({
        userId: remoteUserId,
        userName: remoteName,
        peerId: remotePeerId,
      }) => {
        console.log(
          `Processing pending join for ${remoteUserId} (${remotePeerId})`
        );
        setParticipants((prev) => {
          if (prev.some((p) => p.id === remoteUserId)) return prev;
          return [
            ...prev,
            { id: remoteUserId, name: remoteName, audio: true, video: true },
          ];
        });

        const call = peerRef.current!.call(
          remotePeerId,
          localStreamRef.current!
        );
        peerCallsRef.current[remoteUserId] = call;
        call.on("stream", (remoteStream) => {
          console.log(`Received remote stream from ${remoteUserId}`);
          setParticipants((prev) =>
            prev.map((p) =>
              p.id === remoteUserId ? { ...p, stream: remoteStream } : p
            )
          );
        });
        call.on("error", (err) => {
          console.error(`PeerJS call error with ${remoteUserId}:`, err);
          toast.error(`Failed to connect to ${remoteName}`);
        });
        call.on("close", () => {
          console.log(`PeerJS call closed with ${remoteUserId}`);
          setParticipants((prev) => prev.filter((p) => p.id !== remoteUserId));
        });
      }
    );
  };

  const processPendingCalls = () => {
    if (!localStreamRef.current) return;

    const pendingCalls = [...pendingCallsRef.current];
    pendingCallsRef.current = [];
    pendingCalls.forEach(({ call, remoteUserId }) => {
      console.log(`Processing pending call from ${remoteUserId}`);
      call.answer(localStreamRef.current);
      peerCallsRef.current[remoteUserId] = call;
      call.on("stream", (remoteStream) => {
        console.log(
          `Received remote stream from ${remoteUserId} via pending call`
        );
        setParticipants((prev) => {
          const participant = prev.find((p) => p.id === remoteUserId);
          if (participant) {
            return prev.map((p) =>
              p.id === remoteUserId ? { ...p, stream: remoteStream } : p
            );
          }
          return [
            ...prev,
            {
              id: remoteUserId,
              name: `User_${remoteUserId.slice(0, 5)}`,
              stream: remoteStream,
              audio: true,
              video: true,
            },
          ];
        });
      });
      call.on("error", (err) => {
        console.error(`PeerJS call error with ${remoteUserId}:`, err);
      });
      call.on("close", () => {
        console.log(`PeerJS call closed with ${remoteUserId}`);
        setParticipants((prev) => prev.filter((p) => p.id !== remoteUserId));
      });
    });
  };

  const handleAdmitUser = (request: JoinRequest) => {
    socket?.emit("admit-user", {
      meetingId,
      userId: request.userId,
      userName: request.userName,
      peerId: request.peerId,
    });
    setPendingJoinRequests((prev) =>
      prev.filter((req) => req.userId !== request.userId)
    );
    toast.success(`${request.userName} admitted to the meeting`);
  };

  const handleRejectUser = (request: JoinRequest) => {
    socket?.emit("reject-user", {
      meetingId,
      userId: request.userId,
      userName: request.userName,
    });
    setPendingJoinRequests((prev) =>
      prev.filter((req) => req.userId !== request.userId)
    );
    toast.success(`${request.userName} rejected from the meeting`);
  };

  const toggleAudio = async () => {
    if (!localStreamRef.current) return;

    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    if (audioTrack) {
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
      console.log(`Audio ${audioTrack.enabled ? "enabled" : "disabled"}`);
    } else {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const newAudioTrack = newStream.getAudioTracks()[0];
        const currentStream = localStreamRef.current || new MediaStream();

        currentStream.addTrack(newAudioTrack);
        localStreamRef.current = currentStream;
        setLocalStream(currentStream);

        Object.values(peerCallsRef.current).forEach((call) => {
          if (call && call.peerConnection) {
            const sender = call.peerConnection
              .getSenders()
              .find((s) => s.track?.kind === "audio");
            if (sender) {
              sender.replaceTrack(newAudioTrack);
            } else {
              call.peerConnection.addTrack(newAudioTrack, currentStream);
            }
          }
        });

        setIsAudioOn(true);
        setParticipants((prev) =>
          prev.map((p) =>
            p.id === userId ? { ...p, audio: true, stream: currentStream } : p
          )
        );
        socket?.emit("update-status", {
          meetingId,
          userId,
          audio: true,
          video: isVideoOn,
        });
        console.log("New audio track added and enabled");
      } catch (error) {
        console.error("Error adding audio track:", error);
        toast.error("Failed to access microphone.");
      }
    }
  };

  const toggleVideo = async () => {
    if (!localStreamRef.current) return;

    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    if (videoTrack) {
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
      console.log(`Video ${videoTrack.enabled ? "enabled" : "disabled"}`);
    } else {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const newVideoTrack = newStream.getVideoTracks()[0];
        const currentStream = localStreamRef.current || new MediaStream();

        currentStream.addTrack(newVideoTrack);
        localStreamRef.current = currentStream;
        setLocalStream(currentStream);

        Object.values(peerCallsRef.current).forEach((call) => {
          if (call && call.peerConnection) {
            const sender = call.peerConnection
              .getSenders()
              .find((s) => s.track?.kind === "video");
            if (sender) {
              sender.replaceTrack(newVideoTrack);
            } else {
              call.peerConnection.addTrack(newVideoTrack, currentStream);
            }
          }
        });

        setIsVideoOn(true);
        setParticipants((prev) =>
          prev.map((p) =>
            p.id === userId ? { ...p, video: true, stream: currentStream } : p
          )
        );
        socket?.emit("update-status", {
          meetingId,
          userId,
          audio: isAudioOn,
          video: true,
        });
        console.log("New video track added and enabled");
      } catch (error) {
        console.error("Error adding video track:", error);
        toast.error("Failed to access camera.");
      }
    }
  };

  useEffect(() => {
    document.title = `Meeting: ${meetingId} | MentorOne Meet`;

    if (!meetingId || !userId) {
      toast.error("Invalid meeting ID or user ID.");
      navigate("/login");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Please log in to join the meeting.");
      navigate("/login");
      return;
    }

    const socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
      path: "/video-socket.io/",
      query: { meetingId },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    socketRef.current = socketInstance;
    setSocket(socketInstance);

    const peerId = `${userId}_${Date.now()}`;
    const peerInstance = new Peer(peerId, {
      host: import.meta.env.VITE_PEER_HOST || "localhost",
      port: parseInt(import.meta.env.VITE_PEER_PORT || "9000"),
      path: "/peerjs",
      debug: 3,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          {
            urls: "turn:openrelay.metered.ca:443",
            username: "openrelay.project",
            credential: "openrelay",
          },
        ],
      },
    });
    peerRef.current = peerInstance;
    setPeer(peerInstance);

    initLocalStream();

    socketInstance.on("connect", () => {
      console.log("Socket.IO connected:", socketInstance.id);
      socketInstance.emit(
        "join-meeting",
        { meetingId, userId, userName, peerId },
        (response: any) => {
          if (!response?.success) {
            console.error("Failed to join meeting:", response?.error);
            toast.error(response?.error || "Failed to join meeting.");
            navigate("/user/meetinghome");
          } else {
            console.log("Joined meeting successfully");
            setCreatorId(response.creatorId);
          }
        }
      );
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error.message);
      toast.error("Failed to connect to the server.");
      if (error.message.includes("Authentication error")) {
        localStorage.removeItem("accessToken");
        navigate("/login");
      }
    });

    socketInstance.on(
      "join-request",
      ({ userId: remoteUserId, userName, peerId }) => {
        if (userId !== creatorId) return;
        console.log(`Join request from ${userName} (${remoteUserId})`);
        setPendingJoinRequests((prev) => {
          // Remove any existing requests for the same userId
          const filteredRequests = prev.filter(
            (req) => req.userId !== remoteUserId
          );
          return [
            ...filteredRequests,
            { userId: remoteUserId, userName, peerId },
          ];
        });
        toast.info(`${userName} is requesting to join the meeting`, {
          duration: 10000,
        });
      }
    );

    socketInstance.on(
      "user-joined",
      ({
        userId: remoteUserId,
        userName: remoteName,
        peerId: remotePeerId,
      }) => {
        console.log(
          `User joined: ${remoteUserId} (${remoteName}, ${remotePeerId})`
        );
        if (remoteUserId === userId) return;

        if (!localStreamRef.current || !peerRef.current) {
          console.log(
            `Queuing join for ${remoteUserId} (local stream or peer not ready)`
          );
          pendingJoinsRef.current.push({
            userId: remoteUserId,
            userName: remoteName,
            peerId: remotePeerId,
          });
          return;
        }

        setParticipants((prev) => {
          if (prev.some((p) => p.id === remoteUserId)) return prev;
          return [
            ...prev,
            { id: remoteUserId, name: remoteName, audio: true, video: true },
          ];
        });

        const call = peerInstance.call(remotePeerId, localStreamRef.current);
        console.log(`Initiating call to ${remotePeerId}`);
        peerCallsRef.current[remoteUserId] = call;
        call.on("stream", (remoteStream) => {
          console.log(`Received remote stream from ${remoteUserId}`);
          setParticipants((prev) =>
            prev.map((p) =>
              p.id === remoteUserId ? { ...p, stream: remoteStream } : p
            )
          );
        });
        call.on("error", (err) => {
          console.error(`PeerJS call error with ${remoteUserId}:`, err);
          toast.error(`Failed to connect to ${remoteName}`);
        });
        call.on("close", () => {
          console.log(`PeerJS call closed with ${remoteUserId}`);
          setParticipants((prev) => prev.filter((p) => p.id !== remoteUserId));
        });
      }
    );

    socketInstance.on(
      "existing-participants",
      (
        existingParticipants: {
          userId: string;
          userName: string;
          peerId: string;
        }[]
      ) => {
        console.log("Received existing participants:", existingParticipants);
        existingParticipants.forEach(
          ({
            userId: remoteUserId,
            userName: remoteName,
            peerId: remotePeerId,
          }) => {
            if (remoteUserId === userId) return;

            if (!localStreamRef.current || !peerRef.current) {
              console.log(
                `Queuing existing participant ${remoteUserId} (local stream or peer not ready)`
              );
              pendingJoinsRef.current.push({
                userId: remoteUserId,
                userName: remoteName,
                peerId: remotePeerId,
              });
              return;
            }

            setParticipants((prev) => {
              if (prev.some((p) => p.id === remoteUserId)) return prev;
              return [
                ...prev,
                {
                  id: remoteUserId,
                  name: remoteName,
                  audio: true,
                  video: true,
                },
              ];
            });

            const call = peerInstance.call(
              remotePeerId,
              localStreamRef.current
            );
            console.log(
              `Initiating call to existing participant ${remotePeerId}`
            );
            peerCallsRef.current[remoteUserId] = call;
            call.on("stream", (remoteStream) => {
              console.log(`Received remote stream from ${remoteUserId}`);
              setParticipants((prev) =>
                prev.map((p) =>
                  p.id === remoteUserId ? { ...p, stream: remoteStream } : p
                )
              );
            });
            call.on("error", (err) => {
              console.error(`PeerJS call error with ${remoteUserId}:`, err);
              toast.error(`Failed to connect to ${remoteName}`);
            });
            call.on("close", () => {
              console.log(`PeerJS call closed with ${remoteUserId}`);
              setParticipants((prev) =>
                prev.filter((p) => p.id !== remoteUserId)
              );
            });
          }
        );
      }
    );

    socketInstance.on("user-left", ({ userId: remoteUserId }) => {
      console.log(`User left: ${remoteUserId}`);
      setParticipants((prev) => prev.filter((p) => p.id !== remoteUserId));
      if (peerCallsRef.current[remoteUserId]) {
        peerCallsRef.current[remoteUserId].close();
        delete peerCallsRef.current[remoteUserId];
      }
    });

    socketInstance.on("message", (message: Message) => {
      console.log("Received message:", message);
      setMessages((prev) => [...prev, message]);
    });

    socketInstance.on("reaction", ({ senderId, senderName, reaction }) => {
      console.log("Received reaction:", { senderId, senderName, reaction });
      toast({
        title: `${senderName} reacted`,
        description: `Sent a ${reaction} reaction`,
      });
    });

    socketInstance.on(
      "update-status",
      ({ userId: remoteUserId, audio, video }) => {
        console.log("Status update:", { remoteUserId, audio, video });
        setParticipants((prev) =>
          prev.map((p) => (p.id === remoteUserId ? { ...p, audio, video } : p))
        );
      }
    );

    socketInstance.on("join-rejected", () => {
      toast.error("Your join request was rejected by the meeting creator.");
      navigate("/user/meetinghome");
    });

    peerInstance.on("open", (id) => {
      console.log("PeerJS connected:", id);
    });

    peerInstance.on("error", (err) => {
      console.error("PeerJS error:", err);
      toast.error(`PeerJS error: ${err.message || err.type}`);
    });

    peerInstance.on("call", (call) => {
      console.log(`Received call from ${call.peer}`);
      const remoteUserId = call.peer.split("_")[0];
      if (localStreamRef.current) {
        console.log(`Answering call from ${remoteUserId}`);
        call.answer(localStreamRef.current);
        peerCallsRef.current[remoteUserId] = call;
        call.on("stream", (remoteStream) => {
          console.log(
            `Received remote stream from ${remoteUserId} via call answer`
          );
          setParticipants((prev) => {
            const participant = prev.find((p) => p.id === remoteUserId);
            if (participant) {
              return prev.map((p) =>
                p.id === remoteUserId ? { ...p, stream: remoteStream } : p
              );
            }
            return [
              ...prev,
              {
                id: remoteUserId,
                name: `User_${remoteUserId.slice(0, 5)}`,
                stream: remoteStream,
                audio: true,
                video: true,
              },
            ];
          });
        });
        call.on("error", (err) => {
          console.error(`PeerJS call error with ${remoteUserId}:`, err);
        });
        call.on("close", () => {
          console.log(`PeerJS call closed with ${remoteUserId}`);
          setParticipants((prev) => prev.filter((p) => p.id !== remoteUserId));
        });
      } else {
        console.log(
          `Queuing call from ${remoteUserId} (local stream not ready)`
        );
        pendingCallsRef.current.push({ call, remoteUserId });
      }
    });

    return () => {
      console.log("Component unmounting - thorough cleanup starting");

      if (socketRef.current) {
        console.log("Disconnecting socket");
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      console.log("Closing all peer connections");
      Object.entries(peerCallsRef.current).forEach(([userId, call]) => {
        try {
          if (call) {
            if (call.peerConnection) {
              const senders = call.peerConnection.getSenders();
              senders.forEach((sender) => {
                if (sender.track) {
                  sender.track.stop();
                }
              });
            }
            call.close();
          }
        } catch (err) {
          console.error(`Error closing peer connection for ${userId}:`, err);
        }
      });
      peerCallsRef.current = {};

      if (peerRef.current) {
        console.log("Destroying peer instance");
        try {
          peerRef.current.destroy();
        } catch (err) {
          console.error("Error destroying PeerJS instance:", err);
        }
        peerRef.current = null;
      }

      console.log("Stopping all media tracks");
      if (localStreamRef.current) {
        const tracks = localStreamRef.current.getTracks();
        console.log(`Stopping ${tracks.length} tracks from localStreamRef`);
        tracks.forEach((track) => {
          try {
            console.log(`Stopping track: ${track.kind} (${track.id})`);
            track.stop();
          } catch (err) {
            console.error(`Error stopping track ${track.id}:`, err);
          }
        });
        localStreamRef.current = null;
      }

      try {
        navigator.mediaDevices
          .getUserMedia({ audio: false, video: false })
          .then((s) => s.getTracks().forEach((track) => track.stop()))
          .catch((e) =>
            console.log("Expected error from false constraints:", e)
          );
      } catch (err) {
        console.log("Expected error from attempt to force-stop devices:", err);
      }

      document.title = "MentorOne Meet";
      console.log("Component unmount cleanup complete");
    };
  }, [
    meetingId,
    userId,
    userName,
    navigate,
    creatorId,
    initialVideoOn,
    initialAudioOn,
  ]);

  const toggleScreenShare = async () => {
    try {
      if (isSharingScreen) {
        if (localStream) {
          localStream.getTracks().forEach((track) => track.stop());
        }
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: isAudioOn,
          video: isVideoOn,
        });
        localStreamRef.current = newStream;
        setLocalStream(newStream);
        setIsSharingScreen(false);
        const videoTrack = newStream.getVideoTracks()[0];
        if (!isVideoOn && videoTrack) {
          videoTrack.enabled = false;
        }
        Object.values(peerCallsRef.current).forEach((call) => {
          if (call && call.peerConnection) {
            const sender = call.peerConnection
              .getSenders()
              .find((s) => s.track?.kind === "video");
            if (sender && videoTrack) {
              sender.replaceTrack(videoTrack);
            }
          }
        });
        setParticipants((prev) =>
          prev.map((p) => (p.id === userId ? { ...p, stream: newStream } : p))
        );
        console.log("Switched back to camera stream:", newStream.id);
      } else {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const audioTrack = localStream?.getAudioTracks()[0];
        const newStream = new MediaStream();
        screenStream.getTracks().forEach((track) => {
          newStream.addTrack(track);
          track.onended = () => {
            console.log(
              `Screen share track ended: ${track.kind} (${track.id})`
            );
            toggleScreenShare();
          };
        });
        if (audioTrack) {
          newStream.addTrack(audioTrack);
        }
        localStreamRef.current = newStream;
        setLocalStream(newStream);
        setIsSharingScreen(true);
        const videoTrack = newStream.getVideoTracks()[0];
        Object.values(peerCallsRef.current).forEach((call) => {
          if (call && call.peerConnection) {
            const sender = call.peerConnection
              .getSenders()
              .find((s) => s.track?.kind === "video");
            if (sender && videoTrack) {
              sender.replaceTrack(videoTrack);
            }
          }
        });
        setParticipants((prev) =>
          prev.map((p) => (p.id === userId ? { ...p, stream: newStream } : p))
        );
        console.log("Started screen sharing with stream:", newStream.id);
      }
    } catch (error) {
      console.error("Error toggling screen share:", error);
      toast.error("Failed to start or stop screen sharing.");
    }
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const message: Message = {
      id: `${userId}_${Date.now()}`,
      senderId: userId,
      senderName: userName,
      text,
      timestamp: new Date(),
    };
    socket?.emit("message", { meetingId, message });
    setMessages((prev) => [...prev, message]);
    console.log("Sent message:", message);
  };

  const sendReaction = (reaction: string) => {
    socket?.emit("reaction", { meetingId, userId, userName, reaction });
    toast({
      title: "Reaction sent",
      description: `You sent a ${reaction} reaction`,
    });
    setShowReactions(false);
    console.log("Sent reaction:", reaction);
  };

  const leaveMeeting = () => {
    console.log("Leaving meeting, stopping media tracks");
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        console.log(`Stopping track: ${track.kind} (${track.id})`);
        track.enabled = false;
        track.stop();
      });
      localStreamRef.current = null;
    }
    setLocalStream(null);
    socket?.emit("leave-meeting", { meetingId, userId });
    navigate(`/user/meeting-end/${meetingId}`);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="flex-1 flex relative">
        <VideoGrid participants={participants} currentUserId={userId} />
        {isChatOpen && (
          <Chat
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            messages={messages}
            sendMessage={sendMessage}
          />
        )}
        {isParticipantsOpen && (
          <Participants
            isOpen={isParticipantsOpen}
            onClose={() => setIsParticipantsOpen(false)}
            participants={participants}
            userId={userId}
          />
        )}
        {isMeetingInfoOpen && (
          <MeetingInfo
            isOpen={isMeetingInfoOpen}
            onClose={() => setIsMeetingInfoOpen(false)}
            meetingId={meetingId || ""}
          />
        )}
      </div>
      {showReactions && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-full p-2 flex gap-2 z-10">
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
      {userId === creatorId && pendingJoinRequests.length > 0 && (
        <div className="absolute bottom-4 right-4 bg-gray-800 rounded-lg p-4 z-20 max-w-md w-full">
          {pendingJoinRequests.map((request) => (
            <div
              key={request.userId}
              className="flex items-center justify-between mb-2"
            >
              <span className="text-white">
                {request.userName} wants to join
              </span>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  className="bg-blue-600 hover:bg-green-700"
                  onClick={() => handleAdmitUser(request)}
                >
                  Admit
                </Button>
                <Button
                  variant="default"
                  className="bg-white hover:bg-red-700"
                  onClick={() => handleRejectUser(request)}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="relative flex items-center p-4 bg-gray-900 text-white">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 truncate max-w-xs">
            {meetingId ? ` ${meetingId}` : "No Meeting ID"}
          </span>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
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
            {isAudioOn ? <Mic size={24} /> : <MicOff size={24} />}
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
            {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
          </Button>
          <Button
            variant="ghost"
            className={`w-14 h-14 rounded-full ${
              isSharingScreen
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
            onClick={toggleScreenShare}
            aria-label={
              isSharingScreen ? "Stop sharing screen" : "Share screen"
            }
          >
            {isSharingScreen ? (
              <ScreenShareOff size={24} />
            ) : (
              <ScreenShare size={24} />
            )}
          </Button>
          <Button
            variant="ghost"
            className={`w-14 h-14 rounded-full ${
              showReactions
                ? "bg-yellow-600 text-white"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
            onClick={() => setShowReactions(!showReactions)}
            aria-label="Show reactions"
          >
            <Smile size={24} />
          </Button>
          <Button
            variant="ghost"
            className={`w-14 h-14 rounded-full ${
              isChatOpen
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
            onClick={() => setIsChatOpen(!isChatOpen)}
            aria-label="Toggle chat"
          >
            <MessageSquare size={24} />
          </Button>
          <Button
            variant="ghost"
            className={`w-14 h-14 rounded-full ${
              isParticipantsOpen
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
            onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
            aria-label="Toggle participants"
          >
            <Users size={24} />
          </Button>
          <Button
            variant="ghost"
            className={`w-14 h-14 rounded-full ${
              isMeetingInfoOpen
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
            onClick={() => setIsMeetingInfoOpen(!isMeetingInfoOpen)}
            aria-label="Toggle meeting info"
          >
            <Info size={24} />
          </Button>
          <Button
            variant="ghost"
            className="w-14 h-14 rounded-full bg-red-600 text-white hover:bg-red-700"
            onClick={leaveMeeting}
            aria-label="Leave meeting"
          >
            <Phone size={24} className="rotate-135" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallMeeting;
