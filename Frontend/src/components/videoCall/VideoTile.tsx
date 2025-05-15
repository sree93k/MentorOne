import React, { useEffect, useRef } from "react";
import { Mic, MicOff, Video as VideoOff } from "lucide-react";
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
}

const VideoTile: React.FC<VideoTileProps> = ({ participant, isLocal }) => {
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
    <div className="relative bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-2 left-2 text-white text-sm bg-gray-800 bg-opacity-50 px-2 py-1 rounded">
        {participant.name} {isLocal ? "(You)" : ""}
      </div>
      <div className="absolute top-2 right-2 flex gap-2">
        {!participant.audio && <MicOff className="text-red-500" size={16} />}
        {!participant.video && <VideoOff className="text-red-500" size={16} />}
      </div>
    </div>
  );
};

export default VideoTile;
