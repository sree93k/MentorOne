// import React, { createContext, useState, useContext, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";

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

// interface MeetingContextType {
//   meetingId: string;
//   participants: Participant[];
//   messages: Message[];
//   localStream: MediaStream | null;
//   isAudioOn: boolean;
//   isVideoOn: boolean;
//   isSharingScreen: boolean;
//   isHandRaised: boolean;
//   addParticipant: (participant: Participant) => void;
//   removeParticipant: (id: string) => void;
//   sendMessage: (text: string) => void;
//   toggleAudio: () => void;
//   toggleVideo: () => void;
//   toggleScreenShare: () => void;
//   toggleRaiseHand: () => void;
//   leaveMeeting: () => void;
// }

// const defaultContext: MeetingContextType = {
//   meetingId: "",
//   participants: [],
//   messages: [],
//   localStream: null,
//   isAudioOn: true,
//   isVideoOn: true,
//   isSharingScreen: false,
//   isHandRaised: false,
//   addParticipant: () => {},
//   removeParticipant: () => {},
//   sendMessage: () => {},
//   toggleAudio: () => {},
//   toggleVideo: () => {},
//   toggleScreenShare: () => {},
//   toggleRaiseHand: () => {},
//   leaveMeeting: () => {},
// };

// const MeetingContext = createContext<MeetingContextType>(defaultContext);

// export const useMeeting = () => useContext(MeetingContext);

// export const MeetingProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [meetingId, setMeetingId] = useState(id || "");
//   const [participants, setParticipants] = useState<Participant[]>([]);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [localStream, setLocalStream] = useState<MediaStream | null>(null);
//   const [isAudioOn, setIsAudioOn] = useState(true);
//   const [isVideoOn, setIsVideoOn] = useState(true);
//   const [isSharingScreen, setIsSharingScreen] = useState(false);
//   const [isHandRaised, setIsHandRaised] = useState(false);

//   // Initialize local stream when component mounts
//   useEffect(() => {
//     const initLocalStream = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           audio: true,
//           video: true,
//         });
//         setLocalStream(stream);

//         // Add local participant
//         const localParticipant: Participant = {
//           id: "local",
//           name: "You",
//           stream,
//           audio: true,
//           video: true,
//         };

//         setParticipants([localParticipant]);
//       } catch (error) {
//         console.error("Error accessing media devices:", error);
//       }
//     };

//     initLocalStream();

//     // Mock adding additional participants for demo
//     setTimeout(() => {
//       addParticipant({
//         id: "123",
//         name: "John Doe",
//         audio: true,
//         video: true,
//       });

//       addParticipant({
//         id: "456",
//         name: "Jane Smith",
//         audio: false,
//         video: true,
//       });
//     }, 2000);

//     // Cleanup function
//     return () => {
//       if (localStream) {
//         localStream.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   const addParticipant = (participant: Participant) => {
//     setParticipants((prev) => [...prev, participant]);
//   };

//   const removeParticipant = (id: string) => {
//     setParticipants((prev) => prev.filter((p) => p.id !== id));
//   };

//   const sendMessage = (text: string) => {
//     const newMessage: Message = {
//       id: Date.now().toString(),
//       senderId: "local",
//       senderName: "You",
//       text,
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, newMessage]);
//   };

//   const toggleAudio = () => {
//     if (localStream) {
//       const audioTrack = localStream.getAudioTracks()[0];
//       if (audioTrack) {
//         audioTrack.enabled = !audioTrack.enabled;
//         setIsAudioOn(audioTrack.enabled);
//       }
//     }
//   };

//   const toggleVideo = () => {
//     if (localStream) {
//       const videoTrack = localStream.getVideoTracks()[0];
//       if (videoTrack) {
//         videoTrack.enabled = !videoTrack.enabled;
//         setIsVideoOn(videoTrack.enabled);
//       }
//     }
//   };

//   const toggleScreenShare = async () => {
//     if (isSharingScreen) {
//       // Stop screen sharing and revert to camera
//       if (localStream) {
//         const videoTrack = localStream.getVideoTracks()[0];
//         if (videoTrack) {
//           videoTrack.stop();
//         }
//       }

//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//         });
//         const videoTrack = stream.getVideoTracks()[0];

//         if (localStream) {
//           const oldTrack = localStream.getVideoTracks()[0];
//           if (oldTrack) {
//             localStream.removeTrack(oldTrack);
//           }
//           localStream.addTrack(videoTrack);
//         }

//         setIsSharingScreen(false);
//       } catch (error) {
//         console.error("Error accessing camera:", error);
//       }
//     } else {
//       // Start screen sharing
//       try {
//         const stream = await navigator.mediaDevices.getDisplayMedia({
//           video: true,
//         });
//         const screenTrack = stream.getVideoTracks()[0];

//         if (localStream) {
//           const oldTrack = localStream.getVideoTracks()[0];
//           if (oldTrack) {
//             localStream.removeTrack(oldTrack);
//           }
//           localStream.addTrack(screenTrack);
//         }

//         screenTrack.onended = () => {
//           toggleScreenShare();
//         };

//         setIsSharingScreen(true);
//       } catch (error) {
//         console.error("Error sharing screen:", error);
//       }
//     }
//   };

//   const toggleRaiseHand = () => {
//     setIsHandRaised(!isHandRaised);
//   };

//   const leaveMeeting = () => {
//     if (localStream) {
//       localStream.getTracks().forEach((track) => track.stop());
//     }
//     navigate(`/user/meeting-end/${meetingId}`);
//   };

//   return (
//     <MeetingContext.Provider
//       value={{
//         meetingId,
//         participants,
//         messages,
//         localStream,
//         isAudioOn,
//         isVideoOn,
//         isSharingScreen,
//         isHandRaised,
//         addParticipant,
//         removeParticipant,
//         sendMessage,
//         toggleAudio,
//         toggleVideo,
//         toggleScreenShare,
//         toggleRaiseHand,
//         leaveMeeting,
//       }}
//     >
//       {children}
//     </MeetingContext.Provider>
//   );
// };
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";

import { useParams, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
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

interface MeetingContextType {
  meetingId: string;
  participants: Participant[];
  messages: Message[];
  localStream: MediaStream | null;
  isAudioOn: boolean;
  isVideoOn: boolean;
  isSharingScreen: boolean;
  isHandRaised: boolean;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (id: string) => void;
  sendMessage: (text: string) => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  toggleRaiseHand: () => void;
  leaveMeeting: () => void;
  initializeMeeting: () => void;
  cleanupMeeting: () => void;
}

const defaultContext: MeetingContextType = {
  meetingId: "",
  participants: [],
  messages: [],
  localStream: null,
  isAudioOn: true,
  isVideoOn: true,
  isSharingScreen: false,
  isHandRaised: false,
  addParticipant: () => {},
  removeParticipant: () => {},
  sendMessage: () => {},
  toggleAudio: () => {},
  toggleVideo: () => {},
  toggleScreenShare: () => {},
  toggleRaiseHand: () => {},
  leaveMeeting: () => {},
  initializeMeeting: () => {},
  cleanupMeeting: () => {},
};

const MeetingContext = createContext<MeetingContextType>(defaultContext);

export const useMeeting = () => useContext(MeetingContext);

export const MeetingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);
  const [meetingId, setMeetingId] = useState(id || "");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const peerConnectionsRef = useRef<{ [key: string]: RTCPeerConnection }>({});

  const initializeMeeting = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setLocalStream(stream);
      setParticipants([
        {
          id: user?._id || "local",
          name: user?.name || "You",
          stream,
          audio: true,
          video: true,
        },
      ]);

      const token = localStorage.getItem("accessToken");
      socketRef.current = io(import.meta.env.VITE_API_URL, {
        auth: { token },
        query: { meetingId, userId: user?._id },
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to Socket.IO server");
      });

      socketRef.current.on("user-joined", async ({ userId, userName }) => {
        const peerConnection = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        peerConnectionsRef.current[userId] = peerConnection;

        localStream?.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStream);
        });

        peerConnection.ontrack = (event) => {
          setParticipants((prev) => {
            const existing = prev.find((p) => p.id === userId);
            if (!existing) {
              return [
                ...prev,
                {
                  id: userId,
                  name: userName,
                  stream: event.streams[0],
                  audio: true,
                  video: true,
                },
              ];
            }
            return prev;
          });
        };

        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current?.emit("ice-candidate", {
              to: userId,
              candidate: event.candidate,
            });
          }
        };

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socketRef.current?.emit("offer", {
          to: userId,
          offer,
          from: user?._id,
        });
      });

      socketRef.current.on("offer", async ({ offer, from }) => {
        const peerConnection = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        peerConnectionsRef.current[from] = peerConnection;

        peerConnection.ontrack = (event) => {
          setParticipants((prev) => {
            const existing = prev.find((p) => p.id === from);
            if (!existing) {
              return [
                ...prev,
                {
                  id: from,
                  name: "Participant",
                  stream: event.streams[0],
                  audio: true,
                  video: true,
                },
              ];
            }
            return prev;
          });
        };

        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current?.emit("ice-candidate", {
              to: from,
              candidate: event.candidate,
            });
          }
        };

        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        localStream?.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStream);
        });
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socketRef.current?.emit("answer", { to: from, answer });
      });

      socketRef.current.on("answer", async ({ answer, from }) => {
        const peerConnection = peerConnectionsRef.current[from];
        if (peerConnection) {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
        }
      });

      socketRef.current.on("ice-candidate", async ({ candidate, from }) => {
        const peerConnection = peerConnectionsRef.current[from];
        if (peerConnection) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      socketRef.current.on("user-left", ({ userId }) => {
        setParticipants((prev) => prev.filter((p) => p.id !== userId));
        const peerConnection = peerConnectionsRef.current[userId];
        if (peerConnection) {
          peerConnection.close();
          delete peerConnectionsRef.current[userId];
        }
      });

      socketRef.current.on("message", (message: Message) => {
        setMessages((prev) => [...prev, message]);
      });
    } catch (error) {
      console.error("Error initializing meeting:", error);
    }
  };

  const cleanupMeeting = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());
    peerConnectionsRef.current = {};
    setParticipants([]);
    setMessages([]);
  };

  const addParticipant = (participant: Participant) => {
    setParticipants((prev) => [...prev, participant]);
  };

  const removeParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const sendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user?._id || "local",
      senderName: user?.name || "You",
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    socketRef.current?.emit("message", newMessage);
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
        setParticipants((prev) =>
          prev.map((p) =>
            p.id === user?._id ? { ...p, audio: audioTrack.enabled } : p
          )
        );
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
        setParticipants((prev) =>
          prev.map((p) =>
            p.id === user?._id ? { ...p, video: videoTrack.enabled } : p
          )
        );
      }
    }
  };

  const toggleScreenShare = async () => {
    if (isSharingScreen) {
      if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.stop();
        }
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const videoTrack = stream.getVideoTracks()[0];
        if (localStream) {
          const oldTrack = localStream.getVideoTracks()[0];
          if (oldTrack) {
            localStream.removeTrack(oldTrack);
          }
          localStream.addTrack(videoTrack);
        }
        setIsSharingScreen(false);
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const screenTrack = stream.getVideoTracks()[0];
        if (localStream) {
          const oldTrack = localStream.getVideoTracks()[0];
          if (oldTrack) {
            localStream.removeTrack(oldTrack);
          }
          localStream.addTrack(screenTrack);
        }
        screenTrack.onended = () => {
          toggleScreenShare();
        };
        setIsSharingScreen(true);
      } catch (error) {
        console.error("Error sharing screen:", error);
      }
    }
    Object.values(peerConnectionsRef.current).forEach((pc) => {
      const sender = pc.getSenders().find((s) => s.track?.kind === "video");
      if (sender && localStream) {
        sender.replaceTrack(localStream.getVideoTracks()[0]);
      }
    });
  };

  const toggleRaiseHand = () => {
    setIsHandRaised(!isHandRaised);
  };

  const leaveMeeting = () => {
    cleanupMeeting();
    navigate(`/user/meeting-end/${meetingId}`);
  };

  return (
    <MeetingContext.Provider
      value={{
        meetingId,
        participants,
        messages,
        localStream,
        isAudioOn,
        isVideoOn,
        isSharingScreen,
        isHandRaised,
        addParticipant,
        removeParticipant,
        sendMessage,
        toggleAudio,
        toggleVideo,
        toggleScreenShare,
        toggleRaiseHand,
        leaveMeeting,
        initializeMeeting,
        cleanupMeeting,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
};
