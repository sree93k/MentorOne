// import React, { useRef, useEffect } from "react";
// import { Mic, MicOff, Video as VideoOff } from "lucide-react";

// interface Participant {
//   id: string;
//   name: string;
//   stream?: MediaStream;
//   audio: boolean;
//   video: boolean;
// }

// interface VideoGridProps {
//   participants: Participant[];
// }

// const VideoGrid: React.FC<VideoGridProps> = ({ participants }) => {
//   const getGridCols = (count: number) => {
//     if (count <= 2) return "grid-cols-1";
//     if (count <= 4) return "grid-cols-2";
//     if (count <= 9) return "grid-cols-3";
//     return "grid-cols-4";
//   };

//   return (
//     <div
//       className={`flex-1 grid ${getGridCols(
//         participants.length
//       )} gap-4 p-4 bg-gray-900`}
//     >
//       {participants.map((participant) => (
//         <VideoTile key={participant.id} participant={participant} />
//       ))}
//     </div>
//   );
// };

// interface VideoTileProps {
//   participant: Participant;
// }

// const VideoTile: React.FC<VideoTileProps> = ({ participant }) => {
//   const videoRef = useRef<HTMLVideoElement>(null);

//   useEffect(() => {
//     if (participant.stream && videoRef.current) {
//       videoRef.current.srcObject = participant.stream;
//     }
//   }, [participant.stream]);

//   return (
//     <div className="relative max-h-[617px] bg-gray-800 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
//       {participant.video && participant.stream ? (
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted={participant.id === "local"}
//           className="w-full h-full object-cover"
//         />
//       ) : (
//         <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-medium uppercase">
//           {participant.name.charAt(0)}
//         </div>
//       )}

//       <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex items-center justify-between">
//         <span className="text-white font-medium">{participant.name}</span>
//         <div className="flex items-center space-x-1">
//           {participant.audio ? (
//             <Mic className="w-4 h-4 text-white" />
//           ) : (
//             <MicOff className="w-4 h-4 text-red-400" />
//           )}
//           {!participant.video && <VideoOff className="w-4 h-4 text-red-400" />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoGrid;
import React, { useRef, useEffect } from "react";
import { Mic, MicOff, Video as VideoOff } from "lucide-react";

interface Participant {
  id: string;
  name: string;
  stream?: MediaStream | null;
  audio: boolean;
  video: boolean;
}

interface VideoGridProps {
  participants: Participant[];
}

const VideoGrid: React.FC<VideoGridProps> = ({ participants }) => {
  const getGridCols = (count: number) => {
    if (count <= 2) return "grid-cols-1";
    if (count <= 4) return "grid-cols-2";
    if (count <= 9) return "grid-cols-3";
    return "grid-cols-4";
  };

  return (
    <div
      className={`flex-1 grid ${getGridCols(
        participants.length
      )} gap-4 p-4 bg-gray-900 h-full overflow-auto`}
      style={{ maxHeight: "calc(100vh - 120px)" }} // Adjust for header/footer
    >
      {participants.map((participant) => (
        <VideoTile key={participant.id} participant={participant} />
      ))}
    </div>
  );
};

interface VideoTileProps {
  participant: Participant;
}

const VideoTile: React.FC<VideoTileProps> = ({ participant }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (participant.stream && videoRef.current) {
      videoRef.current.srcObject = participant.stream;
      console.log("VideoTile: Set stream for:", participant.id);
    } else if (videoRef.current) {
      videoRef.current.srcObject = null;
      console.log("VideoTile: Cleared stream for:", participant.id);
    }
  }, [participant.stream, participant.id]);

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
      {participant.video && participant.stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={
            participant.id === "local" || participant.id.includes("anonymous")
          }
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-medium uppercase">
          {participant.name.charAt(0)}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex items-center justify-between">
        <span className="text-white font-medium">{participant.name}</span>
        <div className="flex items-center space-x-1">
          {participant.audio ? (
            <Mic className="w-4 h-4 text-white" />
          ) : (
            <MicOff className="w-4 h-4 text-red-400" />
          )}
          {!participant.video && <VideoOff className="w-4 h-4 text-red-400" />}
        </div>
      </div>
    </div>
  );
};

export default VideoGrid;
