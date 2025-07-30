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
  Timer,
} from "lucide-react";
import { io, Socket } from "socket.io-client";
import Peer from "peerjs";
import VideoGrid from "@/components/videoCall/VideoGrid";
import Chat from "@/components/videoCall/Chat";
import Participants from "@/components/videoCall/Participants";
import MeetingInfo from "@/components/videoCall/MeetingInfo";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { useBlockDetection } from "@/hooks/useBlockDetection";

interface Participant {
  id: string;
  name: string;
  stream?: MediaStream | null;
  cameraStream?: MediaStream | null;
  screenShareStream?: MediaStream | null;
  audio: boolean;
  video: boolean;
  isSharingScreen?: boolean;
  screenSharePeerId?: string;
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

interface FloatingReaction {
  id: string;
  emoji: string;
  x: number;
}

const VideoCallMeeting: React.FC = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.user);

  // States
  const [socket, setSocket] = useState<Socket | null>(null);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [screenSharePeer, setScreenSharePeer] = useState<Peer | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [countParticipents, setCountParticipents] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [localScreenShareStream, setLocalScreenShareStream] =
    useState<MediaStream | null>(null);
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
  const [floatingReactions, setFloatingReactions] = useState<
    FloatingReaction[]
  >([]);

  // Meeting duration tracking
  const [meetingStartTime, setMeetingStartTime] = useState<Date | null>(null);
  const [meetingDuration, setMeetingDuration] = useState("0:00");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Refs (keeping all your existing refs)
  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const screenSharePeerRef = useRef<Peer | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const localScreenShareStreamRef = useRef<MediaStream | null>(null);
  const peerCallsRef = useRef<{ [key: string]: any }>({});
  const screenShareCallsRef = useRef<{ [key: string]: any }>({});
  const pendingJoinsRef = useRef<
    { userId: string; userName: string; peerId: string }[]
  >([]);
  const pendingCallsRef = useRef<{ call: any; remoteUserId: string }[]>([]);
  const pendingScreenShareCallsRef = useRef<
    { call: any; remoteUserId: string }[]
  >([]);
  const { isBlocked } = useBlockDetection(user?._id);
  const userId = user?._id || `anonymous_${Date.now()}`;
  const userName = user?.firstName || "User";
  const { isVideoOn: initialVideoOn = true, isMicOn: initialAudioOn = true } =
    location.state || {};

  // Calculate meeting duration
  const calculateDuration = (startTime: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - startTime.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
  };
  useEffect(() => {
    if (isBlocked) {
      // Immediately leave the meeting
      if (socket) {
        socket.emit("leave-meeting", { meetingId, userId: user?._id });
      }
      navigate("/blocked");
    }
  }, [isBlocked]);
  useEffect(() => {
    // Start timer immediately when component mounts
    if (!meetingStartTime) {
      const startTime = new Date();
      setMeetingStartTime(startTime);
      console.log(
        "⏱️ Timer started immediately at:",
        startTime.toLocaleTimeString()
      );

      const interval = setInterval(() => {
        const now = new Date();
        const diffMs = now.getTime() - startTime.getTime();
        const totalSeconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const duration = `${minutes}:${seconds.toString().padStart(2, "0")}`;
        setMeetingDuration(duration);
        console.log("⏱️ Timer update:", duration); // You should see this every second
      }, 1000);

      intervalRef.current = interval;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []); // Empty dependency array - runs only once when component mounts

  // 🔍 DEBUGGING: Add this temporary useEffect to check if timer state is updating
  useEffect(() => {
    console.log("⏱️ Meeting duration state changed:", meetingDuration);
  }, [meetingDuration]);

  const addFloatingReaction = (emoji: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    const x = Math.random() * 80 + 10; // Random position between 10% and 90%

    setFloatingReactions((prev) => [...prev, { id, emoji, x }]);

    // Remove after animation completes
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    }, 3000);
  };

  // Single panel management - only one panel can be open at a time
  const handleChatToggle = () => {
    if (isChatOpen) {
      setIsChatOpen(false);
    } else {
      // Close other panels and open chat
      setIsParticipantsOpen(false);
      setIsMeetingInfoOpen(false);
      setIsChatOpen(true);
    }
  };

  const handleParticipantsToggle = () => {
    if (isParticipantsOpen) {
      setIsParticipantsOpen(false);
    } else {
      // Close other panels and open participants
      setIsChatOpen(false);
      setIsMeetingInfoOpen(false);
      setIsParticipantsOpen(true);
    }
  };

  const handleMeetingInfoToggle = () => {
    if (isMeetingInfoOpen) {
      setIsMeetingInfoOpen(false);
    } else {
      // Close other panels and open meeting info
      setIsChatOpen(false);
      setIsParticipantsOpen(false);
      setIsMeetingInfoOpen(true);
    }
  };
  const sendReaction = (reaction: string) => {
    const emojiMap: { [key: string]: string } = {
      heart: "❤️",
      thumbsup: "👍",
      party: "🎉",
    };

    const emoji = emojiMap[reaction] || reaction;

    console.log("🎉 Sending reaction:", { emoji, meetingId, userId, userName });
    console.log("🔍 Socket status:", {
      exists: !!socket,
      connected: socket?.connected,
    });

    if (!socket || !socket.connected) {
      console.error("❌ Socket not connected!");
      toast.error("Not connected to meeting");
      return;
    }

    // Send reaction via socket
    socket.emit("reaction", {
      meetingId,
      userId,
      userName,
      reaction: emoji,
    });

    console.log("✅ Reaction sent via socket");
    toast.success(`You sent a ${emoji} reaction`);
    setShowReactions(false);
  };

  // All your existing functions remain the same
  useBeforeUnload(
    useCallback(() => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          track.enabled = false;
          track.stop();
        });
        localStreamRef.current = null;
      }
      if (localScreenShareStreamRef.current) {
        localScreenShareStreamRef.current.getTracks().forEach((track) => {
          track.enabled = false;
          track.stop();
        });
        localScreenShareStreamRef.current = null;
      }
    }, [])
  );

  const initLocalStream = async () => {
    try {
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
          cameraStream: stream,
          audio: initialAudioOn,
          video: initialVideoOn,
          isSharingScreen: false,
        },
      ]);
      setCountParticipents(countParticipents + 1);
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
        setCountParticipents(countParticipents + 1);
        peerCallsRef.current[remoteUserId] = call;
        call.on("stream", (remoteStream) => {
          setParticipants((prev) =>
            prev.map((p) =>
              p.id === remoteUserId
                ? {
                    ...p,
                    stream: remoteStream,
                    cameraStream: remoteStream,
                  }
                : p
            )
          );
        });
        call.on("error", (err) => {
          toast.error(`Failed to connect to ${remoteName}`);
        });
        call.on("close", () => {
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
      call.answer(localStreamRef.current);
      peerCallsRef.current[remoteUserId] = call;
      call.on("stream", (remoteStream) => {
        setParticipants((prev) => {
          const participant = prev.find((p) => p.id === remoteUserId);
          if (participant) {
            return prev.map((p) =>
              p.id === remoteUserId
                ? {
                    ...p,
                    stream: remoteStream,
                    cameraStream: remoteStream,
                  }
                : p
            );
          }
          return [
            ...prev,
            {
              id: remoteUserId,
              name: `User_${remoteUserId.slice(0, 5)}`,
              stream: remoteStream,
              cameraStream: remoteStream,
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
        setParticipants((prev) => prev.filter((p) => p.id !== remoteUserId));
      });
    });
  };

  const processPendingScreenShareCalls = () => {
    if (!localScreenShareStreamRef.current || !screenSharePeerRef.current)
      return;

    const pendingCalls = [...pendingScreenShareCallsRef.current];
    pendingScreenShareCallsRef.current = [];
    pendingCalls.forEach(({ call, remoteUserId }) => {
      call.answer(localScreenShareStreamRef.current);
      screenShareCallsRef.current[remoteUserId] = call;
      call.on("stream", (remoteStream) => {
        setParticipants((prev) =>
          prev.map((p) =>
            p.id === remoteUserId
              ? {
                  ...p,
                  screenShareStream: remoteStream,
                }
              : p
          )
        );
      });
      call.on("error", (err) => {
        console.error(
          `PeerJS screen share call error with ${remoteUserId}:`,
          err
        );
      });
      call.on("close", () => {
        setParticipants((prev) =>
          prev.map((p) =>
            p.id === remoteUserId
              ? { ...p, screenShareStream: null, isSharingScreen: false }
              : p
          )
        );
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

  const updateStreamForAllPeers = (updatedStream: MediaStream) => {
    Object.values(peerCallsRef.current).forEach((call) => {
      if (call && call.peerConnection) {
        const senders = call.peerConnection.getSenders();
        updatedStream.getTracks().forEach((track) => {
          const sender = senders.find((s) => s.track?.kind === track.kind);
          if (sender) {
            sender.replaceTrack(track).catch((err: any) => {
              console.error(`Error replacing track for ${track.kind}:`, err);
            });
          } else {
            call.peerConnection.addTrack(track, updatedStream);
          }
        });
      }
    });
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
      updateStreamForAllPeers(localStreamRef.current);
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

        updateStreamForAllPeers(currentStream);

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
      updateStreamForAllPeers(localStreamRef.current);
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

        updateStreamForAllPeers(currentStream);

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
      } catch (error) {
        console.error("Error adding video track:", error);
        toast.error("Failed to access camera.");
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (isSharingScreen) {
        if (localScreenShareStreamRef.current) {
          localScreenShareStreamRef.current
            .getTracks()
            .forEach((track) => track.stop());
          localScreenShareStreamRef.current = null;
          setLocalScreenShareStream(null);
        }
        setParticipants((prev: Participant[]) =>
          prev.map((p) =>
            p.id === userId
              ? {
                  ...p,
                  screenShareStream: null,
                  isSharingScreen: false,
                  screenSharePeerId: undefined,
                }
              : p
          )
        );
        setIsSharingScreen(false);

        if (screenSharePeerRef.current) {
          Object.values(screenShareCallsRef.current).forEach((call) => {
            if (call) call.close();
          });
          screenShareCallsRef.current = {};
          screenSharePeerRef.current.destroy();
          screenSharePeerRef.current = null;
          setScreenSharePeer(null);
        }

        socket?.emit("screen-share-status", {
          meetingId,
          userId,
          isSharingScreen: false,
          screenSharePeerId: null,
        });
      } else {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        localScreenShareStreamRef.current = screenStream;
        setLocalScreenShareStream(screenStream);
        screenStream.getTracks().forEach((track) => {
          track.onended = () => {
            toggleScreenShare();
          };
        });

        const screenSharePeerId = `${userId}_screen_${Date.now()}`;
        const screenSharePeerInstance = new Peer(screenSharePeerId, {
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
        screenSharePeerRef.current = screenSharePeerInstance;
        setScreenSharePeer(screenSharePeerInstance);

        screenSharePeerInstance.on("open", (id) => {
          setParticipants((prev: Participant[]) =>
            prev.map((p) =>
              p.id === userId
                ? {
                    ...p,
                    screenShareStream: screenStream,
                    isSharingScreen: true,
                    screenSharePeerId: id,
                  }
                : p
            )
          );
          setIsSharingScreen(true);
          socket?.emit("screen-share-status", {
            meetingId,
            userId,
            isSharingScreen: true,
            screenSharePeerId: id,
          });

          const otherParticipants = participants.filter((p) => p.id !== userId);
          otherParticipants.forEach((participant) => {
            const call = screenSharePeerInstance.call(
              participant.id,
              screenStream
            );
            screenShareCallsRef.current[participant.id] = call;
            call.on("error", (err) => {
              console.error(
                `Screen share call error with ${participant.id}:`,
                err
              );
            });
            call.on("close", () => {
              console.log(`Screen share call closed with ${participant.id}`);
            });
          });

          processPendingScreenShareCalls();
        });

        screenSharePeerInstance.on("error", (err) => {
          toast.error(`Screen share PeerJS error: ${err.message || err.type}`);
        });

        screenSharePeerInstance.on("call", (call) => {
          const remoteUserId = call.peer.split("_")[0];
          if (localScreenShareStreamRef.current) {
            call.answer(localScreenShareStreamRef.current);
            screenShareCallsRef.current[remoteUserId] = call;
            call.on("stream", (remoteStream) => {
              setParticipants((prev) =>
                prev.map((p) =>
                  p.id === remoteUserId
                    ? { ...p, screenShareStream: remoteStream }
                    : p
                )
              );
            });
            call.on("error", (err) => {
              console.error(
                `PeerJS screen share call error with ${remoteUserId}:`,
                err
              );
            });
            call.on("close", () => {
              setParticipants((prev) =>
                prev.map((p) =>
                  p.id === remoteUserId
                    ? { ...p, screenShareStream: null, isSharingScreen: false }
                    : p
                )
              );
            });
          } else {
            pendingScreenShareCallsRef.current.push({ call, remoteUserId });
          }
        });
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
  };

  const leaveMeeting = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.enabled = false;
        track.stop();
      });
      localStreamRef.current = null;
    }
    if (localScreenShareStreamRef.current) {
      localScreenShareStreamRef.current.getTracks().forEach((track) => {
        track.enabled = false;
        track.stop();
      });
      localScreenShareStreamRef.current = null;
    }
    setLocalStream(null);
    setLocalScreenShareStream(null);
    setMessages([]);
    socket?.emit("leave-meeting", { meetingId, userId });

    // ✅ FIXED: Use the current meetingDuration state instead of recalculating
    let finalDuration = meetingDuration; // Use the current timer value

    // Convert MM:SS or HH:MM:SS format to readable format for end page
    const formatDurationForEndPage = (duration: string): string => {
      const parts = duration.split(":");

      if (parts.length === 2) {
        // MM:SS format
        const minutes = parseInt(parts[0]);
        const seconds = parseInt(parts[1]);

        if (minutes === 0) {
          return `${seconds} sec`;
        } else if (minutes < 60) {
          return `${minutes} min`;
        }
      } else if (parts.length === 3) {
        // HH:MM:SS format
        const hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);

        if (hours > 0) {
          return `${hours}h ${minutes}m`;
        } else {
          return `${minutes} min`;
        }
      }

      return duration; // fallback to original format
    };

    const formattedDuration = formatDurationForEndPage(finalDuration);
    // const participantCount = participants.length;
    const participantCount = countParticipents;

    console.log("🔍 Leaving meeting with:", {
      originalDuration: finalDuration,
      formattedDuration: formattedDuration,
      participantCount: participantCount,
    });

    // Pass the join link for mentees, host link for mentors
    const joinLink =
      user?.role === "mentee"
        ? `/user/meeting-join/${meetingId}`
        : `/user/meeting/${meetingId}`;

    navigate(`/user/meeting-end/${meetingId}`, {
      state: {
        joinLink,
        duration: formattedDuration, // Use the formatted duration
        participantCount,
      },
    });
  };

  useEffect(() => {
    if (!meetingId || !userId) {
      toast.error("Invalid meeting ID or user ID.");
      navigate("/login");
      return;
    }

    console.log("🔍 Setting up socket connection...");

    const socketInstance = io(`${import.meta.env.VITE_SOCKET_URL}/video`, {
      transports: ["websocket"],
      path: "/socket.io/",
      query: { meetingId },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true,
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

    // Socket event listeners
    socketInstance.on("connect", () => {
      console.log("✅ Socket connected");
      socketInstance.emit(
        "join-meeting",
        { meetingId, userId, userName, peerId },
        (response) => {
          if (!response?.success) {
            toast.error(response?.error || "Failed to join meeting.");
            navigate("/user/meetinghome");
          } else {
            setCreatorId(response.creatorId);
            console.log("✅ Successfully joined meeting");
          }
        }
      );
    });

    socketInstance.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
      toast.error("Failed to connect to the server.");
      if (error.message.includes("Authentication error")) {
        document.cookie =
          "isAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate("/login");
      }
    });

    socketInstance.on(
      "join-request",
      ({ userId: remoteUserId, userName, peerId }) => {
        if (userId !== creatorId) return;
        setPendingJoinRequests((prev) => {
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
        if (remoteUserId === userId) return;

        if (!localStreamRef.current || !peerRef.current) {
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
              isSharingScreen: false,
            },
          ];
        });

        const call = peerInstance.call(remotePeerId, localStreamRef.current);
        peerCallsRef.current[remoteUserId] = call;
        call.on("stream", (remoteStream) => {
          setParticipants((prev) =>
            prev.map((p) =>
              p.id === remoteUserId
                ? {
                    ...p,
                    stream: remoteStream,
                    cameraStream: remoteStream,
                  }
                : p
            )
          );
        });
        call.on("error", (err) => {
          toast.error(`Failed to connect to ${remoteName}`);
        });
        call.on("close", () => {
          setParticipants((prev) => prev.filter((p) => p.id !== remoteUserId));
        });

        if (
          isSharingScreen &&
          screenSharePeerRef.current &&
          localScreenShareStreamRef.current
        ) {
          const call = screenSharePeerRef.current.call(
            remoteUserId,
            localScreenShareStreamRef.current
          );
          screenShareCallsRef.current[remoteUserId] = call;
          call.on("error", (err) => {
            console.error(`Screen share call error with ${remoteUserId}:`, err);
          });
          call.on("close", () => {
            console.log(`Screen share call closed with ${remoteUserId}`);
          });
        }
      }
    );

    // Add all other socket event listeners here...
    socketInstance.on("user-left", ({ userId: remoteUserId }) => {
      setParticipants((prev) => prev.filter((p) => p.id !== remoteUserId));
      if (peerCallsRef.current[remoteUserId]) {
        peerCallsRef.current[remoteUserId].close();
        delete peerCallsRef.current[remoteUserId];
      }
      if (screenShareCallsRef.current[remoteUserId]) {
        screenShareCallsRef.current[remoteUserId].close();
        delete screenShareCallsRef.current[remoteUserId];
      }
    });

    socketInstance.on("message", (message: Message) => {
      const convertedMessage = {
        ...message,
        timestamp:
          typeof message.timestamp === "string"
            ? new Date(message.timestamp)
            : message.timestamp,
      };
      if (message.senderId !== userId) {
        setMessages((prev) => [...prev, convertedMessage]);
      }
    });

    socketInstance.on("reaction", (data) => {
      console.log("🎉 Reaction received via socket:", data);
      const { senderId, senderName, reaction } = data;

      // Show floating animation for ALL users (including sender)
      addFloatingReaction(reaction);

      // Show toast notification for others only (not sender)
      if (senderId !== userId) {
        toast.success(`${senderName} sent ${reaction}`);
      }
    });

    // ... ADD ALL YOUR OTHER SOCKET LISTENERS HERE ...
    socketInstance.on(
      "join-request",
      ({ userId: remoteUserId, userName, peerId }) => {
        if (userId !== creatorId) return;
        setPendingJoinRequests((prev) => {
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
        if (remoteUserId === userId) return;

        if (!localStreamRef.current || !peerRef.current) {
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
              isSharingScreen: false,
            },
          ];
        });

        const call = peerInstance.call(remotePeerId, localStreamRef.current);
        peerCallsRef.current[remoteUserId] = call;

        call.on("stream", (remoteStream) => {
          setParticipants((prev) =>
            prev.map((p) =>
              p.id === remoteUserId
                ? { ...p, stream: remoteStream, cameraStream: remoteStream }
                : p
            )
          );
        });

        call.on("error", (err) => {
          toast.error(`Failed to connect to ${remoteName}`);
        });

        call.on("close", () => {
          setParticipants((prev) => prev.filter((p) => p.id !== remoteUserId));
        });

        if (
          isSharingScreen &&
          screenSharePeerRef.current &&
          localScreenShareStreamRef.current
        ) {
          const call = screenSharePeerRef.current.call(
            remoteUserId,
            localScreenShareStreamRef.current
          );
          screenShareCallsRef.current[remoteUserId] = call;
          call.on("error", (err) => {
            console.error(`Screen share call error with ${remoteUserId}:`, err);
          });
          call.on("close", () => {
            console.log(`Screen share call closed with ${remoteUserId}`);
          });
        }
      }
    );

    socketInstance.on("user-left", ({ userId: remoteUserId }) => {
      setParticipants((prev) => prev.filter((p) => p.id !== remoteUserId));
      if (peerCallsRef.current[remoteUserId]) {
        peerCallsRef.current[remoteUserId].close();
        delete peerCallsRef.current[remoteUserId];
      }
      if (screenShareCallsRef.current[remoteUserId]) {
        screenShareCallsRef.current[remoteUserId].close();
        delete screenShareCallsRef.current[remoteUserId];
      }
    });

    socketInstance.on("message", (message) => {
      const convertedMessage = {
        ...message,
        timestamp:
          typeof message.timestamp === "string"
            ? new Date(message.timestamp)
            : message.timestamp,
      };
      if (message.senderId !== userId) {
        setMessages((prev) => [...prev, convertedMessage]);
      }
    });

    socketInstance.on(
      "update-status",
      ({ userId: remoteUserId, audio, video }) => {
        setParticipants((prev) =>
          prev.map((p) => (p.id === remoteUserId ? { ...p, audio, video } : p))
        );
      }
    );

    socketInstance.on("join-rejected", () => {
      toast.error("Your join request was rejected by the meeting creator.");
      navigate("/user/meetinghome");
    });

    // Peer event listeners
    peerInstance.on("open", (id) => {
      console.log("✅ PeerJS connected:", id);
    });

    peerInstance.on("error", (err) => {
      console.error("❌ PeerJS error:", err);
      toast.error(`PeerJS error: ${err.message || err.type}`);
    });

    peerInstance.on("call", (call) => {
      const remoteUserId = call.peer.split("_")[0];
      if (localStreamRef.current) {
        call.answer(localStreamRef.current);
        peerCallsRef.current[remoteUserId] = call;

        call.on("stream", (remoteStream) => {
          setParticipants((prev) => {
            const participant = prev.find((p) => p.id === remoteUserId);
            if (participant) {
              return prev.map((p) =>
                p.id === remoteUserId
                  ? { ...p, stream: remoteStream, cameraStream: remoteStream }
                  : p
              );
            }
            return [
              ...prev,
              {
                id: remoteUserId,
                name: `User_${remoteUserId.slice(0, 5)}`,
                stream: remoteStream,
                cameraStream: remoteStream,
                audio: true,
                video: true,
                isSharingScreen: false,
              },
            ];
          });
        });

        call.on("error", (err) => {
          console.error(`PeerJS call error with ${remoteUserId}:`, err);
        });

        call.on("close", () => {
          setParticipants((prev) => prev.filter((p) => p.id !== remoteUserId));
        });
      } else {
        pendingCallsRef.current.push({ call, remoteUserId });
      }
    });

    return () => {
      console.log("🧹 Cleaning up socket and peer connections...");

      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

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
        try {
          peerRef.current.destroy();
        } catch (err) {
          console.error("Error destroying PeerJS instance:", err);
        }
        peerRef.current = null;
      }

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
        localStreamRef.current = null;
      }

      setMessages([]);
      document.title = "MentorOne Meet";
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

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 relative overflow-hidden">
      {/* Floating Reactions Animation */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {floatingReactions.map((reaction) => (
          <div
            key={reaction.id}
            className="absolute bottom-32 text-4xl animate-bounce-up-fade"
            style={{
              left: `${reaction.x}%`,
              animation: "bounceUpFade 3s ease-out forwards",
            }}
          >
            {reaction.emoji}
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex relative">
        <VideoGrid participants={participants} currentUserId={userId} />

        {/* Enhanced Side Panels */}
        {isChatOpen && (
          <div className="animate-slide-in-right">
            <Chat
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
              messages={messages}
              sendMessage={sendMessage}
              currentUserId={userId}
            />
          </div>
        )}

        {isParticipantsOpen && (
          <div className="animate-slide-in-right">
            <Participants
              isOpen={isParticipantsOpen}
              onClose={() => setIsParticipantsOpen(false)}
              participants={participants}
              userId={userId}
            />
          </div>
        )}

        {isMeetingInfoOpen && (
          <div className="animate-slide-in-left">
            <MeetingInfo
              isOpen={isMeetingInfoOpen}
              onClose={() => setIsMeetingInfoOpen(false)}
              meetingId={meetingId || ""}
            />
          </div>
        )}
      </div>

      {/* Enhanced Reactions Panel */}
      {showReactions && (
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-xl rounded-2xl p-3 flex gap-3 z-40 animate-fade-in-up border border-white/20">
          <Button
            variant="ghost"
            className="rounded-xl p-3 text-pink-400 hover:bg-pink-500/20 hover:scale-110 transition-all duration-200"
            onClick={() => sendReaction("heart")}
          >
            <Heart size={24} className="fill-current" />
          </Button>
          <Button
            variant="ghost"
            className="rounded-xl p-3 text-blue-400 hover:bg-blue-500/20 hover:scale-110 transition-all duration-200"
            onClick={() => sendReaction("thumbsup")}
          >
            <ThumbsUp size={24} className="fill-current" />
          </Button>
          <Button
            variant="ghost"
            className="rounded-xl p-3 text-yellow-400 hover:bg-yellow-500/20 hover:scale-110 transition-all duration-200"
            onClick={() => sendReaction("party")}
          >
            <PartyPopper size={24} className="fill-current" />
          </Button>
        </div>
      )}

      {/* Enhanced Join Requests */}
      {userId === creatorId && pendingJoinRequests.length > 0 && (
        <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-xl rounded-2xl p-4 z-50 max-w-sm w-full border border-white/20 animate-slide-in-right">
          <h4 className="text-white font-medium mb-3">Join Requests</h4>
          {pendingJoinRequests.map((request) => (
            <div
              key={request.userId}
              className="flex items-center justify-between mb-3 p-3 bg-white/5 rounded-xl"
            >
              <span className="text-white text-sm">
                {request.userName} wants to join
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg transition-all duration-200"
                  onClick={() => handleAdmitUser(request)}
                >
                  Admit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-400 text-red-400 hover:bg-red-500/20 px-4 py-1 rounded-lg transition-all duration-200"
                  onClick={() => handleRejectUser(request)}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Control Bar */}
      <div className="relative flex items-center justify-between p-6 bg-gradient-to-t from-gray-900/95 via-gray-800/90 to-transparent backdrop-blur-xl border-t border-white/10">
        {/* Left Side - Meeting Info */}
        <div className="flex items-center gap-4 text-white/80">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
            <Timer className="w-4 h-4" />
            <span className="text-sm font-medium">{meetingDuration}</span>
          </div>
        </div>

        {/* Center - Control Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className={`w-14 h-14 rounded-full transition-all duration-200 hover:scale-105 ${
              !isAudioOn
                ? "bg-red-500 hover:bg-red-600 text-white shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
            }`}
            onClick={toggleAudio}
            aria-label={isAudioOn ? "Mute microphone" : "Unmute microphone"}
          >
            {isAudioOn ? <Mic size={24} /> : <MicOff size={24} />}
          </Button>

          <Button
            variant="ghost"
            className={`w-14 h-14 rounded-full transition-all duration-200 hover:scale-105 ${
              !isVideoOn
                ? "bg-red-500 hover:bg-red-600 text-white shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
            }`}
            onClick={toggleVideo}
            aria-label={isVideoOn ? "Turn off camera" : "Turn on camera"}
          >
            {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
          </Button>

          <Button
            variant="ghost"
            className={`w-14 h-14 rounded-full transition-all duration-200 hover:scale-105 ${
              isSharingScreen
                ? "bg-green-500 hover:bg-green-600 text-white shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
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
            className={`w-14 h-14 rounded-full transition-all duration-200 hover:scale-105 ${
              showReactions
                ? "bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
            }`}
            onClick={() => setShowReactions(!showReactions)}
            aria-label="Show reactions"
          >
            <Smile size={24} />
          </Button>

          <Button
            variant="ghost"
            className={`w-14 h-14 rounded-full transition-all duration-200 hover:scale-105 ${
              isChatOpen
                ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
            }`}
            onClick={handleChatToggle}
            aria-label="Toggle chat"
          >
            <MessageSquare size={24} />
            {messages.length > 0 && !isChatOpen && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {messages.length > 9 ? "9+" : messages.length}
              </div>
            )}
          </Button>

          <Button
            variant="ghost"
            className={`w-14 h-14 rounded-full transition-all duration-200 hover:scale-105 ${
              isParticipantsOpen
                ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
            }`}
            onClick={handleParticipantsToggle}
            aria-label="Toggle participants"
          >
            <Users size={24} />
            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {participants.length}
            </div>
          </Button>

          <Button
            variant="ghost"
            className={`w-14 h-14 rounded-full transition-all duration-200 hover:scale-105 ${
              isMeetingInfoOpen
                ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
            }`}
            onClick={handleMeetingInfoToggle}
            aria-label="Toggle meeting info"
          >
            <Info size={24} />
          </Button>

          <Button
            variant="ghost"
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200 hover:scale-105 shadow-lg"
            onClick={leaveMeeting}
            aria-label="Leave meeting"
          >
            <Phone size={24} className="rotate-135" />
          </Button>
        </div>

        {/* Right Side - Participant Count */}
        <div className="flex items-center gap-2 text-white/80">
          <div className="bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
            <span className="text-sm font-medium">
              {participants.length} participant
              {participants.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes bounceUpFade {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-100px) scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-200px) scale(0.8);
            opacity: 0;
          }
        }

        .animate-bounce-up-fade {
          animation: bounceUpFade 3s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.3s ease-out;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out;
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
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

        @keyframes fadeInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default VideoCallMeeting;
