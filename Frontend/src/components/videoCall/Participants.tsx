import React, { useEffect } from "react";
import { Mic, MicOff, Video as VideoIcon, VideoOff, X } from "lucide-react";
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

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-0 h-full bg-white dark:bg-gray-900 w-80 z-10 overflow-y-auto">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Participants ({participants.length})
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>
      </div>
      <div className="p-4">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center justify-between py-2 border-b last:border-0"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                {participant.name.charAt(0)}
              </div>
              <div>
                <p>
                  {participant.name} {participant.id === userId && "(You)"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              {participant.audio ? (
                <Mic size={16} className="ml-2" />
              ) : (
                <MicOff size={16} className="ml-2 text-red-500" />
              )}
              {participant.video ? (
                <VideoIcon size={16} className="ml-2" />
              ) : (
                <VideoOff size={16} className="ml-2 text-red-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Participants;
