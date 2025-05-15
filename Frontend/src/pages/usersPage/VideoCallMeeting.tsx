import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useBeforeUnload } from "react-router-dom";
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

  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
  const peerCallsRef = useRef<{ [key: string]: any }>({});

  console.log("Redux user state:", user);
  const userId = user?._id || `anonymous_${Date.now()}`;
  console.log("Computed userId:", userId);
  const userName = user?.firstName || "Anonymous";

  if (!userId) {
    console.error("userId is not defined, redirecting to login");
    toast({
      title: "Authentication Error",
      description: "User ID could not be determined. Please log in again.",
      variant: "destructive",
    });
    navigate("/login", { replace: true });
    return null;
  }
  // Log remote users
  useEffect(() => {
    const remoteUsers = participants.filter((p) => p.id !== userId);
    console.log(
      `VideoCallMeeting: Remote users count: ${remoteUsers.length}`,
      remoteUsers.map((p) => ({
        id: p.id,
        name: p.name,
        hasStream: !!p.stream,
        audio: p.audio,
        video: p.video,
      }))
    );
  }, [participants, userId]);

  // Before unload handler
  useBeforeUnload(
    useCallback(() => {
      if (localStreamRef.current) {
        console.log("BeforeUnload: Stopping all media tracks");
        localStreamRef.current.getTracks().forEach((track) => {
          console.log(`Stopping track: ${track.kind} (${track.id})`);
          track.enabled = false;
          track.stop();
        });
      }
    }, [])
  );

  // Initialize local stream automatically
  const initLocalStream = async () => {
    try {
      console.log("Initializing local stream");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      console.log("Local stream initialized:", stream.id);
      localStreamRef.current = stream;
      setLocalStream(stream);

      // Add local participant
      setParticipants((prev) => [
        ...prev.filter((p) => p.id !== userId),
        {
          id: userId,
          name: userName,
          stream,
          audio: true,
          video: true,
        },
      ]);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      toast({
        title: "Media Error",
        description:
          "Failed to access camera or microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    document.title = `Meeting: ${meetingId} | MentorOne Meet`;

    if (!meetingId) {
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
      toast({
        title: "Authentication Error",
        description: "Please log in to join the meeting",
        variant: "destructive",
      });
      navigate("/login", { replace: true });
      return;
    }

    console.log(
      "Socket.IO: Using token (first 20 chars):",
      token.substring(0, 20) + "..."
    );

    // Initialize socket connection
    // const socketInstance = io(
    //   import.meta.env.VITE_SOCKET_URL || "http://localhost:5002",
    //   {
    //     auth: { token },
    //     transports: ["websocket"],
    //     path: "/socket.io/",
    //     query: { meetingId },
    //     reconnectionAttempts: 5,
    //   }
    // );
    const socketInstance = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5002",
      {
        auth: { token },
        transports: ["websocket"],
        path: "/video-socket.io/", // Correct path
        query: { meetingId },
        reconnectionAttempts: 5,
      }
    );

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    // Initialize PeerJS connection
    // const peerId = `${userId}_${Date.now()}`;
    // const peerInstance = new Peer(peerId, {
    //   host: import.meta.env.VITE_PEER_HOST || "localhost",
    //   port: parseInt(import.meta.env.VITE_PEER_PORT || "9000"),
    //   path: "/peerjs",
    //   debug: 2,
    //   config: {
    //     iceServers: [
    //       { urls: "stun:stun.l.google.com:19302" },
    //       { urls: "stun:stun1.l.google.com:19302" },
    //     ],
    //   },
    // });
    const peerId = `${userId}_${Date.now()}`;
    const peerInstance = new Peer(peerId, {
      host: import.meta.env.VITE_PEER_HOST || "localhost",
      port: parseInt(import.meta.env.VITE_PEER_PORT || "9000"),
      path: "/peerjs",
      debug: 2,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          {
            urls: "turn:openrelay.metered.ca:80", // Public TURN server for testing
            username: "openrelay.project",
            credential: "openrelay",
          },
          {
            urls: "turn:openrelay.metered.ca:443", // TURN over TLS
            username: "openrelay.project",
            credential: "openrelay",
          },
        ],
      },
    });

    peerRef.current = peerInstance;
    setPeer(peerInstance);

    // Initialize local stream
    initLocalStream();

    // Setup socket event listeners
    const setupSocketListeners = () => {
      socketInstance.on("connect", () => {
        console.log("Socket connected with ID:", socketInstance.id);

        // Test socket connectivity with debug ping
        socketInstance.emit(
          "debug-ping",
          { userId, meetingId },
          (response: any) => {
            console.log("Debug ping response:", response);
          }
        );

        // Join the meeting room with timeout
        console.log("Emitting join-meeting:", {
          meetingId,
          userId,
          userName,
          peerId: peerInstance.id,
        });
        const joinTimeout = setTimeout(() => {
          console.error("join-meeting: No response after 5 seconds");
          toast({
            title: "Error",
            description: "Failed to join meeting: Server did not respond",
            variant: "destructive",
          });
        }, 5000);

        socketInstance.emit(
          "join-meeting",
          {
            meetingId,
            userId,
            userName,
            peerId: peerInstance.id,
          },
          (response: any) => {
            clearTimeout(joinTimeout);
            console.log("join-meeting response:", response);
            if (!response?.success) {
              console.error("Failed to join meeting:", response?.error);
              toast({
                title: "Error",
                description: response?.error || "Failed to join meeting",
                variant: "destructive",
              });
              navigate("/user/meetinghome", { replace: true });
            } else {
              console.log("Successfully joined meeting:", response);
            }
          }
        );
      });

      socketInstance.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
        toast({
          title: "Connection Error",
          description: error.message.includes("Authentication error")
            ? "Invalid session. Please log in again."
            : "Failed to connect to the server. Please try again.",
          variant: "destructive",
        });
        if (error.message.includes("Authentication error")) {
          localStorage.removeItem("accessToken");
          navigate("/login", { replace: true });
        }
      });

      // socketInstance.on(
      //   "user-joined",
      //   ({
      //     userId: remoteUserId,
      //     userName: remoteName,
      //     peerId: remotePeerId,
      //   }) => {
      //     console.log("User-joined event received:", {
      //       remoteUserId,
      //       remoteName,
      //       remotePeerId,
      //     });

      //     // Add the new user to participants list
      //     setParticipants((prev) => {
      //       if (prev.some((p) => p.id === remoteUserId)) {
      //         console.log(`User ${remoteUserId} already in participants list`);
      //         return prev;
      //       }
      //       return [
      //         ...prev,
      //         {
      //           id: remoteUserId,
      //           name: remoteName,
      //           audio: true,
      //           video: true,
      //         },
      //       ];
      //     });

      //     // Make a call to the new participant
      //     if (localStreamRef.current && peerInstance.id) {
      //       console.log(
      //         "Initiating call to peer:",
      //         remotePeerId,
      //         "with local stream:",
      //         localStreamRef.current?.id
      //       );
      //       const call = peerInstance.call(
      //         remotePeerId,
      //         localStreamRef.current
      //       );
      //       console.log("Call initiated:", call?.peer);
      //       peerCallsRef.current[remoteUserId] = call;

      //       call.on("stream", (remoteStream) => {
      //         console.log(
      //           "Received remote stream from:",
      //           remotePeerId,
      //           "Stream ID:",
      //           remoteStream.id
      //         );
      //         setParticipants((prev) =>
      //           prev.map((p) =>
      //             p.id === remoteUserId ? { ...p, stream: remoteStream } : p
      //           )
      //         );
      //       });

      //       call.on("error", (err) => {
      //         console.error("PeerJS call error:", err);
      //         toast({
      //           title: "Call Error",
      //           description: `Failed to connect to ${remoteName}`,
      //           variant: "destructive",
      //         });
      //       });

      //       call.on("close", () => {
      //         console.log(`Call with ${remotePeerId} closed`);
      //         setParticipants((prev) =>
      //           prev.filter((p) => p.id !== remoteUserId)
      //         );
      //       });
      //     } else {
      //       console.warn("Cannot initiate call: No local stream or peer ID");
      //     }
      //   }
      // );
      socketInstance.on(
        "user-joined",
        ({
          userId: remoteUserId,
          userName: remoteName,
          peerId: remotePeerId,
        }) => {
          console.log("Received user-joined event:", {
            remoteUserId,
            remoteName,
            remotePeerId,
          });
          setParticipants((prev) => {
            if (prev.some((p) => p.id === remoteUserId)) {
              console.log(`User ${remoteUserId} already in participants list`);
              return prev;
            }
            const newParticipant = {
              id: remoteUserId,
              name: remoteName,
              audio: true,
              video: true,
            };
            console.log("Adding new participant:", newParticipant);
            return [...prev, newParticipant];
          });

          if (localStreamRef.current && peerInstance.id) {
            console.log("Initiating call to peer:", remotePeerId);
            const call = peerInstance.call(
              remotePeerId,
              localStreamRef.current
            );
            console.log("Call initiated:", call?.peer);
            peerCallsRef.current[remoteUserId] = call;

            call.on("stream", (remoteStream) => {
              console.log(
                "Received remote stream from:",
                remotePeerId,
                "Stream ID:",
                remoteStream.id
              );
              setParticipants((prev) =>
                prev.map((p) =>
                  p.id === remoteUserId ? { ...p, stream: remoteStream } : p
                )
              );
            });

            call.on("error", (err) => {
              console.error("PeerJS call error:", err);
              toast({
                title: "Call Error",
                description: `Failed to connect to ${remoteName}`,
                variant: "destructive",
              });
            });

            call.on("close", () => {
              console.log(`Call with ${remotePeerId} closed`);
              setParticipants((prev) =>
                prev.filter((p) => p.id !== remoteUserId)
              );
            });
          }
        }
      );
      socketInstance.on("user-left", ({ userId: remoteUserId }) => {
        console.log("User left:", remoteUserId);

        setParticipants((prev) => prev.filter((p) => p.id !== remoteUserId));

        if (peerCallsRef.current[remoteUserId]) {
          peerCallsRef.current[remoteUserId].close();
          delete peerCallsRef.current[remoteUserId];
        }

        if (peerConnections.current[remoteUserId]) {
          peerConnections.current[remoteUserId].close();
          delete peerConnections.current[remoteUserId];
        }
      });

      socketInstance.on("message", (message) => {
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
            prev.map((p) =>
              p.id === remoteUserId ? { ...p, audio, video } : p
            )
          );
        }
      );

      socketInstance.on("error", (error) => {
        console.error("Socket error:", error);
      });
    };

    // Setup PeerJS event listeners
    const setupPeerListeners = () => {
      peerInstance.on("open", (id) => {
        console.log("PeerJS connection established with ID:", id);
      });

      peerInstance.on("call", (call) => {
        console.log("Received call from:", call.peer);

        if (localStreamRef.current) {
          console.log(
            "Answering call with local stream:",
            localStreamRef.current.id
          );
          call.answer(localStreamRef.current);

          const remoteUserId = call.metadata?.userId || call.peer.split("_")[0];
          peerCallsRef.current[remoteUserId] = call;

          call.on("stream", (remoteStream) => {
            console.log(
              "Received remote stream from:",
              call.peer,
              "Stream ID:",
              remoteStream.id
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
            console.error("PeerJS call error:", err);
            toast({
              title: "Call Error",
              description: "Failed to establish video connection",
              variant: "destructive",
            });
          });

          call.on("close", () => {
            console.log(`Call with ${call.peer} closed`);
            setParticipants((prev) =>
              prev.filter((p) => p.id !== remoteUserId)
            );
          });
        } else {
          console.warn("Received call but no local stream is available");
        }
      });

      peerInstance.on("error", (error) => {
        console.error("PeerJS error:", error.type, error.message);
        toast({
          title: "Connection Error",
          description: `PeerJS error: ${error.message || error.type}`,
          variant: "destructive",
        });
      });

      peerInstance.on("disconnected", () => {
        console.log("PeerJS disconnected, attempting to reconnect");
        peerInstance.reconnect();
      });
    };

    // Initialize socket and peer listeners
    setupSocketListeners();
    setupPeerListeners();

    // Cleanup
    return () => {
      console.log("Cleaning up VideoCallMeeting component");

      if (socketInstance && socketInstance.connected) {
        console.log("Emitting leave-meeting for user:", userId);
        socketInstance.emit("leave-meeting", { meetingId, userId });
        socketInstance.disconnect();
      }

      if (localStreamRef.current) {
        console.log("Stopping all media tracks");
        localStreamRef.current.getTracks().forEach((track) => {
          console.log(`Stopping track: ${track.kind} (${track.id})`);
          track.enabled = false;
          track.stop();
        });
        localStreamRef.current = null;
        setLocalStream(null);
      }

      Object.values(peerCallsRef.current).forEach((call) => {
        console.log(`Closing call with peer: ${call?.peer}`);
        call?.close();
      });
      peerCallsRef.current = {};

      Object.values(peerConnections.current).forEach((pc) => {
        console.log(`Closing peer connection: ${pc?.connectionState}`);
        pc?.close();
      });
      peerConnections.current = {};

      if (peerInstance) {
        console.log("Destroying PeerJS instance");
        peerInstance.destroy();
      }

      document.title = "MentorOne Meet";
    };
  }, [meetingId, userId, userName, navigate]);

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
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
      }
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
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
      }
    }
  };

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    try {
      if (isSharingScreen) {
        if (localStream) {
          localStream.getTracks().forEach((track) => {
            console.log(
              `Stopping screen share track: ${track.kind} (${track.id})`
            );
            track.stop();
          });
        }

        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        localStreamRef.current = newStream;
        setLocalStream(newStream);
        setIsVideoOn(true);
        setIsSharingScreen(false);

        const videoTrack = newStream.getVideoTracks()[0];
        Object.values(peerConnections.current).forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === "video");
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });

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
        Object.values(peerConnections.current).forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === "video");
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });

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
      }
    } catch (error) {
      console.error("Error toggling screen share:", error);
      toast({
        title: "Screen Share Error",
        description: "Failed to start or stop screen sharing.",
        variant: "destructive",
      });
    }
  };

  // Send a chat message
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
  };

  // Send a reaction
  const sendReaction = (reaction: string) => {
    socket?.emit("reaction", {
      meetingId,
      userId,
      userName,
      reaction,
    });

    toast({
      title: "Reaction sent",
      description: `You sent a ${reaction} reaction`,
    });

    setShowReactions(false);
  };

  // Leave meeting
  const leaveMeeting = () => {
    console.log("Leaving meeting, initiating cleanup");
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        console.log(`Stopping track: ${track.kind} (${track.id})`);
        track.enabled = false;
        track.stop();
      });
      localStreamRef.current = null;
      setLocalStream(null);
    }
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
      <div className="p-4 flex items-center justify-between bg-gray-900 text-white">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 truncate max-w-xs">
            {meetingId ? `Meeting: ${meetingId}` : "No Meeting ID"}
          </span>
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
