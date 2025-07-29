import React, { useEffect, useRef, useState } from "react";
import { MicOff, VideoOff, User, Wifi, WifiOff } from "lucide-react";

interface Participant {
  id: string;
  name: string;
  stream?: MediaStream;
  audio: boolean;
  video: boolean;
}

interface VideoTileProps {
  participant: Participant;
  isLocal: boolean;
  isThreeUsers?: boolean;
}

const VideoTile: React.FC<VideoTileProps> = ({
  participant,
  isLocal,
  isThreeUsers,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (participant.stream && videoRef.current) {
      console.log(
        `VideoTile: Setting stream for ${participant.name} (ID: ${participant.id}), Stream ID: ${participant.stream.id}`
      );
      videoRef.current.srcObject = participant.stream;
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [participant.stream, participant.name, participant.id]);

  // Generate gradient colors based on participant name
  const getGradientColors = (name: string) => {
    const colors = [
      ["from-blue-400", "to-purple-500"],
      ["from-green-400", "to-blue-500"],
      ["from-pink-400", "to-red-500"],
      ["from-yellow-400", "to-orange-500"],
      ["from-indigo-400", "to-purple-500"],
      ["from-teal-400", "to-green-500"],
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const [fromColor, toColor] = getGradientColors(participant.name);

  return (
    <div
      className={`relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden w-full h-full border-2 transition-all duration-300 hover:scale-[1.02] ${
        isLocal
          ? "border-blue-400 shadow-lg shadow-blue-400/20"
          : "border-gray-600 hover:border-gray-500"
      } ${isThreeUsers ? "" : "aspect-video"} group`}
      style={isThreeUsers ? { aspectRatio: "2/3" } : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className="w-full h-full object-cover"
      />
      {!participant.video && (
        <div className="absolute inset-0 ...">
          {" "}
          {/* Overlay when needed */}
          <div
            className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${fromColor} ${toColor} relative`}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
              <User className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>

            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)] animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
      {/* Overlay gradient for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

      {/* Connection Status Indicator */}
      <div className="absolute top-3 right-3">
        <div
          className={`p-1.5 rounded-full transition-all duration-300 ${
            isConnected
              ? "bg-green-500/80 backdrop-blur-sm"
              : "bg-red-500/80 backdrop-blur-sm"
          }`}
        >
          {isConnected ? (
            <Wifi className="w-3 h-3 text-white" />
          ) : (
            <WifiOff className="w-3 h-3 text-white" />
          )}
        </div>
      </div>

      {/* Audio/Video Status Icons */}
      <div className="absolute top-3 left-3 flex gap-2">
        {!participant.audio && (
          <div className="bg-red-500/90 backdrop-blur-sm rounded-full p-2 transition-all duration-300 hover:scale-110">
            <MicOff className="text-white w-4 h-4" />
          </div>
        )}
        {!participant.video && (
          <div className="bg-red-500/90 backdrop-blur-sm rounded-full p-2 transition-all duration-300 hover:scale-110">
            <VideoOff className="text-white w-4 h-4" />
          </div>
        )}
      </div>

      {/* Enhanced Name Label */}
      <div className="absolute bottom-3 left-3 right-3">
        <div
          className={`bg-black/60 backdrop-blur-md rounded-full px-4 py-2 transition-all duration-300 border border-white/20 ${
            isHovered ? "bg-black/80 scale-105" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  participant.audio
                    ? "bg-green-400 animate-pulse"
                    : "bg-gray-400"
                }`}
              />
              <span className="text-white text-sm font-medium truncate">
                {participant.name} {isLocal ? "(You)" : ""}
              </span>
            </div>

            {/* Audio Level Indicator */}
            {participant.audio && (
              <div className="flex items-center gap-1">
                <div
                  className="w-1 h-2 bg-green-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-1 h-3 bg-green-400 rounded-full animate-pulse"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-1 h-2 bg-green-400 rounded-full animate-pulse"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hover Effects */}
      <div
        className={`absolute inset-0 bg-blue-500/10 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Speaking Indicator */}
      {participant.audio && (
        <div
          className={`absolute inset-0 border-4 border-green-400 rounded-2xl transition-all duration-300 ${
            Math.random() > 0.7 ? "opacity-100 animate-pulse" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
};

export default VideoTile;
