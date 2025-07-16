import React from "react";
import VideoTile from "./VideoTile";

interface Participant {
  id: string;
  name: string;
  stream?: MediaStream | null;
  cameraStream?: MediaStream | null;
  screenShareStream?: MediaStream | null;
  audio: boolean;
  video: boolean;
  isSharingScreen?: boolean;
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

  // Log screen-sharing status and stream details for debugging
  participants.forEach((p) => {
    console.log(
      `VideoGrid: Participant ${p.name} (ID: ${p.id}) - isSharingScreen: ${
        p.isSharingScreen
      }, stream ID: ${p.stream?.id || "none"}, cameraStream ID: ${
        p.cameraStream?.id || "none"
      }, screenShareStream ID: ${p.screenShareStream?.id || "none"}`
    );
  });

  // Find the participant who is sharing their screen
  const screenSharingParticipant = participants.find(
    (participant) => participant.isSharingScreen
  );

  // Extract the screen-sharing stream if it exists
  const screenSharingStream = screenSharingParticipant
    ? {
        id: `${screenSharingParticipant.id}-screen`,
        name: `${screenSharingParticipant.name}'s Screen`,
        stream: screenSharingParticipant.screenShareStream,
        audio: screenSharingParticipant.audio,
        video: true,
      }
    : null;

  // Use cameraStream for participant tiles to show camera feeds, fallback to stream only if cameraStream is not available
  const participantsForTiles = participants.map((participant) => {
    const tileStream =
      participant.id === screenSharingParticipant?.id
        ? participant.cameraStream // For screen-sharing user, use cameraStream
        : participant.cameraStream || participant.stream; // For others, use cameraStream or fallback to stream

    console.log(
      `VideoGrid: Tile for ${participant.name} (ID: ${
        participant.id
      }) using stream ID: ${tileStream?.id || "none"}`
    );

    return {
      ...participant,
      stream: tileStream,
    };
  });

  // Calculate grid layout and tile sizing for normal view (no screen sharing)
  const getGridConfig = (count: number) => {
    let columns: number;
    let tileStyle: string;
    const isThreeUsers: boolean = false;

    if (count <= 1) {
      columns = 1;
      tileStyle = "max-w-[70vw] max-h-[80vh] w-full mx-auto";
    } else if (count === 2) {
      columns = 2;
      tileStyle = "max-w-[55vw] max-h-[65vh] w-full";
    } else if (count <= 4) {
      columns = 2;
      tileStyle = "max-w-[40vw] max-h-[65vh] w-full mx-auto";
    } else if (count <= 6) {
      columns = 3;
      tileStyle = "max-w-[30vw] max-h-[25vh] w-full";
    } else {
      columns = window.innerWidth >= 1280 ? 4 : 3;
      tileStyle = "max-w-[25vw] max-h-[20vh] w-full";
    }

    return {
      gridCols: `grid-cols-${columns}`,
      tileStyle,
      isThreeUsers,
    };
  };

  if (screenSharingStream) {
    console.log(
      `VideoGrid: Screen sharing active by ${screenSharingParticipant.name} (ID: ${screenSharingParticipant.id}), stream ID: ${screenSharingStream.stream?.id}`
    );
    // Screen-sharing layout: 70% left (screen share), 30% right (participant tiles in a column)
    return (
      <div className="flex-1 flex flex-row p-2 bg-gray-900 overflow-hidden">
        {/* Left side: 70% for screen sharing */}
        <div className="w-[80%] h-full pr-2">
          <div className="w-full h-full">
            <VideoTile
              participant={screenSharingStream}
              isLocal={screenSharingParticipant?.id === currentUserId}
              isThreeUsers={false}
            />
          </div>
        </div>
        {/* Right side: 30% for participant tiles in a column */}
        <div className="w-[20%] h-full flex flex-col gap-2 overflow-y-auto">
          {participantsForTiles.map((participant) => (
            <div key={participant.id} className="w-full">
              <VideoTile
                participant={participant}
                isLocal={participant.id === currentUserId}
                isThreeUsers={false}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Normal layout (no screen sharing)
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
