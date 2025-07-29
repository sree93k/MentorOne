import React, { useEffect } from "react";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  X,
  Users,
  Crown,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Participant {
  id: string;
  name: string;
  stream?: MediaStream | null;
  audio: boolean;
  video: boolean;
}

interface ParticipantsProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  userId: string;
}

const Participants: React.FC<ParticipantsProps> = ({
  isOpen,
  onClose,
  participants,
  userId,
}) => {
  useEffect(() => {
    const remoteUsers = participants.filter((p) => p.id !== userId);
    console.log(
      `Participants: Remote users count: ${remoteUsers.length}`,
      remoteUsers.map((p) => ({
        id: p.id,
        name: p.name,
        hasStream: !!p.stream,
        audio: p.audio,
        video: p.video,
      }))
    );
  }, [participants, userId]);

  // Generate avatar colors based on name
  const getAvatarColors = (name: string) => {
    const colors = [
      "from-blue-400 to-blue-600",
      "from-green-400 to-green-600",
      "from-purple-400 to-purple-600",
      "from-pink-400 to-pink-600",
      "from-yellow-400 to-yellow-600",
      "from-indigo-400 to-indigo-600",
      "from-red-400 to-red-600",
      "from-teal-400 to-teal-600",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-0 h-full bg-gradient-to-b from-white via-gray-50 to-white w-96 z-30 overflow-y-auto shadow-2xl border-l border-gray-200 animate-slide-in-right">
      {/* Enhanced Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Participants
              </h2>
              <p className="text-sm text-gray-500">
                {participants.length}{" "}
                {participants.length === 1 ? "person" : "people"} in call
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={20} className="text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Participants List */}
      <div className="p-4">
        {participants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Users className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">No participants</p>
          </div>
        ) : (
          <div className="space-y-3">
            {participants.map((participant, index) => {
              const isCurrentUser = participant.id === userId;
              const avatarColors = getAvatarColors(participant.name);

              return (
                <div
                  key={participant.id}
                  className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:shadow-md animate-fade-in ${
                    isCurrentUser
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Participant Info */}
                  <div className="flex items-center gap-3 flex-1">
                    {/* Enhanced Avatar */}
                    <div className="relative">
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-r ${avatarColors} flex items-center justify-center text-white font-medium shadow-lg transition-transform duration-200 group-hover:scale-105`}
                      >
                        {participant.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Connection Status */}
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                          participant.stream ? "bg-green-500" : "bg-gray-400"
                        }`}
                      >
                        {participant.stream ? (
                          <Wifi className="w-2 h-2 text-white" />
                        ) : (
                          <WifiOff className="w-2 h-2 text-white" />
                        )}
                      </div>
                    </div>

                    {/* Name and Status */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-800 truncate">
                          {participant.name}
                        </p>
                        {isCurrentUser && (
                          <>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                              You
                            </span>
                            <Crown className="w-4 h-4 text-yellow-500" />
                          </>
                        )}
                      </div>

                      {/* Connection Quality */}
                      <div className="flex items-center gap-1 mt-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            participant.stream
                              ? "bg-green-400 animate-pulse"
                              : "bg-red-400"
                          }`}
                        />
                        <span className="text-xs text-gray-500">
                          {participant.stream ? "Connected" : "Connecting..."}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Audio/Video Status */}
                  <div className="flex items-center gap-2">
                    {/* Audio Status */}
                    <div
                      className={`p-2 rounded-full transition-all duration-200 ${
                        participant.audio
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {participant.audio ? (
                        <Mic size={16} />
                      ) : (
                        <MicOff size={16} />
                      )}
                    </div>

                    {/* Video Status */}
                    <div
                      className={`p-2 rounded-full transition-all duration-200 ${
                        participant.video
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {participant.video ? (
                        <VideoIcon size={16} />
                      ) : (
                        <VideoOff size={16} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Meeting Stats */}
      <div className="mt-auto p-4 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-indigo-600">
              {participants.filter((p) => p.audio).length}
            </div>
            <div className="text-xs text-gray-500">Speaking</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {participants.filter((p) => p.video).length}
            </div>
            <div className="text-xs text-gray-500">Video On</div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
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
      `}</style>
    </div>
  );
};

export default Participants;
