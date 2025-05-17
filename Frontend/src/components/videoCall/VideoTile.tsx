import React, { useEffect, useRef } from "react";
import { Mic, MicOff, VideoOff } from "lucide-react";

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

  useEffect(() => {
    if (participant.stream && videoRef.current) {
      console.log(
        `VideoTile: Setting stream for ${participant.name} (ID: ${participant.id}), Stream ID: ${participant.stream.id}`
      );
      videoRef.current.srcObject = participant.stream;
    }
  }, [participant.stream, participant.name, participant.id]);

  return (
    <div
      className={`relative bg-black rounded-lg overflow-hidden w-full h-full ${
        isThreeUsers ? "" : "aspect-video"
      }`}
      style={isThreeUsers ? { aspectRatio: "2/3" } : undefined}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-1 left-1 text-white text-xs bg-gray-800 bg-opacity-50 px-1 py-0.5 rounded">
        {participant.name} {isLocal ? "(You)" : ""}
      </div>

      <div className="absolute top-1 right-1 flex gap-1">
        {!participant.audio && (
          <div className="bg-blue-500 rounded-full p-1">
            <MicOff className="text-white" size={22} />
          </div>
        )}
        {!participant.video && (
          <div className="bg-blue-500 rounded-full p-1">
            <VideoOff className="text-white" size={22} />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoTile;
