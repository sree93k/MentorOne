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
    // Enhanced screen-sharing layout with modern styling
    return (
      <div className="flex-1 flex flex-row p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 overflow-hidden gap-4">
        {/* Left side: 75% for screen sharing with enhanced styling */}
        <div className="w-[75%] h-full">
          <div className="w-full h-full relative group">
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium border border-white/20">
                📺 {screenSharingParticipant.name} is presenting
              </div>
            </div>
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gray-800">
              <VideoTile
                participant={screenSharingStream}
                isLocal={screenSharingParticipant?.id === currentUserId}
                isThreeUsers={false}
              />
            </div>
          </div>
        </div>

        {/* Right side: 25% for participant tiles in a column */}
        <div className="w-[25%] h-full flex flex-col gap-3 overflow-y-auto">
          <div className="mb-2">
            <div className="text-white/80 text-sm font-medium mb-3 px-2">
              Participants ({participantsForTiles.length})
            </div>
          </div>
          {participantsForTiles.map((participant, index) => (
            <div
              key={participant.id}
              className="w-full aspect-video min-h-[120px] animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
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

  // Enhanced normal layout (no screen sharing)
  const { gridCols, tileStyle, isThreeUsers } = getGridConfig(
    participants.length
  );

  return (
    <div className="flex-1 p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 overflow-hidden">
      <div
        className={`h-full grid ${gridCols} gap-4 place-items-center`}
        style={{
          gridTemplateColumns:
            participants.length === 1
              ? "1fr"
              : participants.length === 2
              ? "repeat(2, minmax(0, 1fr))"
              : participants.length <= 4
              ? "repeat(2, minmax(0, 1fr))"
              : participants.length <= 6
              ? "repeat(3, minmax(0, 1fr))"
              : window.innerWidth >= 1280
              ? "repeat(4, minmax(0, 1fr))"
              : "repeat(3, minmax(0, 1fr))",
        }}
      >
        {participants.map((participant, index) => (
          <div
            key={participant.id}
            className={`${tileStyle} animate-fade-in-scale`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <VideoTile
              participant={participant}
              isLocal={participant.id === currentUserId}
              isThreeUsers={isThreeUsers}
            />
          </div>
        ))}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-scale {
          animation: fadeInScale 0.6s ease-out forwards;
          opacity: 0;
          transform: scale(0.9);
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInScale {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default VideoGrid;
