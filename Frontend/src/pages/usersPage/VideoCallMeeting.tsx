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

const VideoCallMeeting: React.FC = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.user);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [screenSharePeer, setScreenSharePeer] = useState<Peer | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
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

  const userId = user?._id || `anonymous_${Date.now()}`;
  const userName = user?.firstName || "User";
  const { isVideoOn: initialVideoOn = true, isMicOn: initialAudioOn = true } =
    location.state || {};

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

  const sendReaction = (reaction: string) => {
    socket?.emit("reaction", { meetingId, userId, userName, reaction });
    toast({
      title: "Reaction sent",
      description: `You sent a ${reaction} reaction`,
    });
    setShowReactions(false);
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
    navigate(`/user/meeting-end/${meetingId}`);
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

    const socketInstance = io(`${import.meta.env.VITE_SOCKET_URL}/video`, {
      auth: { token },
      transports: ["websocket"],
      path: "/socket.io/",
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
      socketInstance.emit(
        "join-meeting",
        { meetingId, userId, userName, peerId },
        (response: any) => {
          if (!response?.success) {
            toast.error(response?.error || "Failed to join meeting.");
            navigate("/user/meetinghome");
          } else {
            setCreatorId(response.creatorId);
          }
        }
      );
    });

    socketInstance.on("connect_error", (error) => {
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

    socketInstance.on(
      "screen-share-status",
      ({ userId: remoteUserId, isSharingScreen, screenSharePeerId }) => {
        setParticipants((prev: Participant[]) =>
          prev.map((p) => {
            if (p.id === remoteUserId) {
              return {
                ...p,
                isSharingScreen,
                screenSharePeerId: isSharingScreen
                  ? screenSharePeerId
                  : undefined,
                screenShareStream: isSharingScreen ? p.screenShareStream : null,
              };
            }
            return p;
          })
        );

        if (isSharingScreen && screenSharePeerId && peerRef.current) {
          const call = peerRef.current.call(
            screenSharePeerId,
            localStreamRef.current!
          );
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
          if (screenShareCallsRef.current[remoteUserId]) {
            screenShareCallsRef.current[remoteUserId].close();
            delete screenShareCallsRef.current[remoteUserId];
          }
        }
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
        existingParticipants.forEach(
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
                },
              ];
            });

            const call = peerInstance.call(
              remotePeerId,
              localStreamRef.current
            );
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
              setParticipants((prev) =>
                prev.filter((p) => p.id !== remoteUserId)
              );
            });
          }
        );
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

    socketInstance.on("message", (message: Message) => {
      // Convert timestamp string to Date object if it's a string
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

    socketInstance.on("reaction", ({ senderId, senderName, reaction }) => {
      toast({
        title: `${senderName} reacted`,
        description: `Sent a ${reaction} reaction`,
      });
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

    peerInstance.on("open", (id) => {
      console.log("PeerJS connected:", id);
    });

    peerInstance.on("error", (err) => {
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

      Object.entries(screenShareCallsRef.current).forEach(([userId, call]) => {
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
          console.error(
            `Error closing screen share peer connection for ${userId}:`,
            err
          );
        }
      });
      screenShareCallsRef.current = {};

      if (peerRef.current) {
        try {
          peerRef.current.destroy();
        } catch (err) {
          console.error("Error destroying PeerJS instance:", err);
        }
        peerRef.current = null;
      }

      if (screenSharePeerRef.current) {
        try {
          screenSharePeerRef.current.destroy();
        } catch (err) {
          console.error("Error destroying screen share PeerJS instance:", err);
        }
        screenSharePeerRef.current = null;
      }

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
        localStreamRef.current = null;
      }

      if (localScreenShareStreamRef.current) {
        localScreenShareStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
        localScreenShareStreamRef.current = null;
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
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="flex-1 flex relative">
        <VideoGrid participants={participants} currentUserId={userId} />
        {isChatOpen && (
          <Chat
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            messages={messages}
            sendMessage={sendMessage}
            currentUserId={userId}
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
        <div className="absolute bottom-4 right-4 bg-gray-800 rounded-lg p-4 z-20 max-w-sm w-full">
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
                  className="bg-blue-600 hover:bg-green-700 text-white"
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
