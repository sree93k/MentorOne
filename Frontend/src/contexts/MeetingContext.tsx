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
  setLocalStream: (stream: MediaStream | null) => void;
  addParticipant: (participant: Participant) => void;
  updateParticipant: (id: string, updates: Partial<Participant>) => void;
  removeParticipant: (id: string) => void;
  sendMessage: (text: string) => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => Promise<void>;
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
  setLocalStream: () => {},
  addParticipant: () => {},
  updateParticipant: () => {},
  removeParticipant: () => {},
  sendMessage: () => {},
  toggleAudio: () => {},
  toggleVideo: () => {},
  toggleScreenShare: async () => {},
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

  useEffect(() => {
    setMeetingId(id || "");
    return () => {
      if (localStream) {
        console.log("MeetingContext: Cleaning up local stream");
        localStream.getTracks().forEach((track) => {
          console.log(`Stopping track: ${track.kind} (${track.id})`);
          track.stop();
        });
      }
    };
  }, [id, localStream]);

  const addParticipant = (participant: Participant) => {
    setParticipants((prev) => {
      if (prev.some((p) => p.id === participant.id)) {
        console.log(`Participant ${participant.id} already exists`);
        return prev;
      }
      console.log(
        `Adding participant: ${participant.name} (${participant.id})`
      );
      return [...prev, participant];
    });
  };

  const updateParticipant = (id: string, updates: Partial<Participant>) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const removeParticipant = (id: string) => {
    console.log(`Removing participant: ${id}`);
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const newMessage: Message = {
      id: `${Date.now()}`,
      senderId: "local", // This should be updated by the consuming component
      senderName: "You", // This should be updated by the consuming component
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
        console.log(`Audio ${audioTrack.enabled ? "enabled" : "disabled"}`);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
        console.log(`Video ${videoTrack.enabled ? "enabled" : "disabled"}`);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (isSharingScreen) {
        if (localStream) {
          localStream.getTracks().forEach((track) => {
            console.log(`Stopping track: ${track.kind} (${track.id})`);
            track.stop();
          });
        }
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setLocalStream(newStream);
        setIsSharingScreen(false);
        setIsVideoOn(true);
        console.log("Switched back to camera stream:", newStream.id);
      } else {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const newStream = new MediaStream();
        screenStream.getTracks().forEach((track) => {
          newStream.addTrack(track);
          track.onended = () => {
            console.log(`Screen share ended: ${track.id}`);
            toggleScreenShare();
          };
        });
        if (localStream) {
          const audioTrack = localStream.getAudioTracks()[0];
          if (audioTrack) {
            newStream.addTrack(audioTrack);
          }
        }
        setLocalStream(newStream);
        setIsSharingScreen(true);
        console.log("Started screen sharing with stream:", newStream.id);
      }
    } catch (error) {
      console.error("Error toggling screen share:", error);
    }
  };

  const toggleRaiseHand = () => {
    setIsHandRaised(!isHandRaised);
    console.log(`Raise hand ${isHandRaised ? "lowered" : "raised"}`);
  };

  const leaveMeeting = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        console.log(`Stopping track: ${track.kind} (${track.id})`);
        track.stop();
      });
      setLocalStream(null);
    }
    setParticipants([]);
    setMessages([]);
    navigate(`/user/meeting-end/${meetingId}`);
    console.log(`Left meeting: ${meetingId}`);
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
        setLocalStream,
        addParticipant,
        updateParticipant,
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
