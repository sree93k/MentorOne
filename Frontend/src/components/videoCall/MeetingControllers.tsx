import React, { useState } from "react";
import { useMeeting } from "@/contexts/MeetingContext";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  ScreenShareOff,
  Hand,
  MessageSquare,
  Users,
  MoreVertical,
  Phone,
  Settings,
} from "lucide-react";

interface MeetingControlsProps {
  onToggleChat: () => void;
  onToggleParticipants: () => void;
}

const MeetingControls: React.FC<MeetingControlsProps> = ({
  onToggleChat,
  onToggleParticipants,
}) => {
  const {
    isAudioOn,
    isVideoOn,
    isSharingScreen,
    isHandRaised,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    toggleRaiseHand,
    leaveMeeting,
  } = useMeeting();

  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="bg-neutral-800 py-3 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="text-white text-sm">
          <span className="font-medium">MeetUp</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          className={`control-button ${!isAudioOn && "control-button-active"}`}
          onClick={toggleAudio}
        >
          {isAudioOn ? (
            <Mic className="w-5 h-5 text-white" />
          ) : (
            <MicOff className="w-5 h-5 text-danger-400" />
          )}
        </button>

        <button
          className={`control-button ${!isVideoOn && "control-button-active"}`}
          onClick={toggleVideo}
        >
          {isVideoOn ? (
            <Video className="w-5 h-5 text-white" />
          ) : (
            <VideoOff className="w-5 h-5 text-danger-400" />
          )}
        </button>

        <button
          className={`control-button ${
            isSharingScreen && "control-button-active"
          }`}
          onClick={toggleScreenShare}
        >
          {isSharingScreen ? (
            <ScreenShareOff className="w-5 h-5 text-white" />
          ) : (
            <ScreenShare className="w-5 h-5 text-white" />
          )}
        </button>

        <button
          className={`control-button ${
            isHandRaised && "control-button-active"
          }`}
          onClick={toggleRaiseHand}
        >
          <Hand
            className={`w-5 h-5 ${
              isHandRaised ? "text-yellow-400" : "text-white"
            }`}
          />
        </button>

        <button className="control-button" onClick={onToggleChat}>
          <MessageSquare className="w-5 h-5 text-white" />
        </button>

        <button className="control-button" onClick={onToggleParticipants}>
          <Users className="w-5 h-5 text-white" />
        </button>

        <button
          className="control-button"
          onClick={() => setShowSettings(!showSettings)}
        >
          <MoreVertical className="w-5 h-5 text-white" />
        </button>

        <button className="btn-danger" onClick={leaveMeeting}>
          <Phone className="w-5 h-5 rotate-135" />
        </button>
      </div>

      {showSettings && (
        <div className="absolute bottom-16 right-4 bg-white rounded-lg shadow-elevated p-2 w-48">
          <button className="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded flex items-center">
            <Settings className="w-5 h-5 mr-2 text-neutral-700" />
            <span>Settings</span>
          </button>
          <div className="border-t border-neutral-200 my-1"></div>
          <button className="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded text-danger-500 flex items-center">
            <Phone className="w-5 h-5 mr-2 rotate-135" />
            <span>Leave meeting</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MeetingControls;
