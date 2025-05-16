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

  // Calculate grid layout and tile sizing based on participant count
  const getGridConfig = (count: number) => {
    let columns: number;
    let tileStyle: string;
    let isThreeUsers: boolean = false;

    if (count <= 1) {
      // Single user: centered, large tile
      columns = 1;
      tileStyle = "max-w-[70vw] max-h-[80vh] w-full mx-auto";
    } else if (count === 2) {
      // 2 users: side by side, medium tiles
      columns = 2;
      tileStyle = "max-w-[55vw] max-h-[65vh] w-full";
    } else if (count <= 4) {
      // 4 users: 2x2 grid, smaller tiles
      columns = 2;
      tileStyle = "max-w-[40vw] max-h-[65vh] w-full mx-auto";
    } else if (count <= 6) {
      // 5-6 users: 3x2 grid, compact tiles
      columns = 3;
      tileStyle = "max-w-[30vw] max-h-[25vh] w-full";
    } else {
      // 7+ users: 3 or 4 columns based on screen width, very compact
      columns = window.innerWidth >= 1280 ? 4 : 3;
      tileStyle = "max-w-[25vw] max-h-[20vh] w-full";
    }

    return {
      gridCols: `grid-cols-${columns}`,
      tileStyle,
      isThreeUsers,
    };
  };

  const { gridCols, tileStyle, isThreeUsers } = getGridConfig(
    participants.length
  );

  return (
    <div
      className={`flex-1 grid ${gridCols} gap-2 p-2 bg-gray-900 place-items-center overflow-hidden sm:${gridCols} lg:${gridCols}`}
    >
      {participants.map((participant) => (
        <div key={participant.id} className={tileStyle}>
          <VideoTile
            participant={participant}
            isLocal={participant.id === currentUserId}
            isThreeUsers={isThreeUsers}
          />
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
