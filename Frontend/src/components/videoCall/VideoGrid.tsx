import React from "react";
import VideoTile from "./VideoTile";

interface Participant {
  id: string;
  name: string;
  stream?: MediaStream;
  audio: boolean;
  video: boolean;
}

interface VideoGridProps {
  participants: Participant[];
  currentUserId: string;
}

const VideoGrid: React.FC<VideoGridProps> = ({
  participants,
  currentUserId,
}) => {
  console.log("VideoGrid: participants:", participants);
  console.log("VideoGrid: currentUserId:", currentUserId);

  return (
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-900">
      {participants.map((participant) => (
        <VideoTile
          key={participant.id}
          participant={participant}
          isLocal={participant.id === currentUserId}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
