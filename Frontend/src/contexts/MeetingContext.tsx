import React, { createContext, useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
};

const MeetingContext = createContext<MeetingContextType>(defaultContext);

export const useMeeting = () => useContext(MeetingContext);

export const MeetingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meetingId, setMeetingId] = useState(id || "");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);

  // Initialize local stream when component mounts
  useEffect(() => {
    const initLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setLocalStream(stream);

        // Add local participant
        const localParticipant: Participant = {
          id: "local",
          name: "You",
          stream,
          audio: true,
          video: true,
        };

        setParticipants([localParticipant]);
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    initLocalStream();

    // Mock adding additional participants for demo
    setTimeout(() => {
      addParticipant({
        id: "123",
        name: "John Doe",
        audio: true,
        video: true,
      });

      addParticipant({
        id: "456",
        name: "Jane Smith",
        audio: false,
        video: true,
      });
    }, 2000);

    // Cleanup function
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const addParticipant = (participant: Participant) => {
    setParticipants((prev) => [...prev, participant]);
  };

  const removeParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const sendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "local",
      senderName: "You",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (isSharingScreen) {
      // Stop screen sharing and revert to camera
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
      // Start screen sharing
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
  };

  const toggleRaiseHand = () => {
    setIsHandRaised(!isHandRaised);
  };

  const leaveMeeting = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
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
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
};
