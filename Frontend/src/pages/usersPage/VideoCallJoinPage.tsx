import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Video, Mic, Settings, ChevronDown } from "lucide-react";
import Header from "../../components/videoCall/Header";

const JoinMeeting: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showDeviceSettings, setShowDeviceSettings] = useState(false);

  useEffect(() => {
    // Request camera and microphone permissions
    const initializeMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream);
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    initializeMedia();

    // Cleanup
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const handleJoinMeeting = () => {
    if (userName.trim()) {
      navigate(`/meeting/${id}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side - Preview */}
          <div className="bg-white p-6 rounded-lg shadow-card">
            <div className="aspect-video bg-neutral-900 rounded-lg overflow-hidden mb-4 relative">
              {stream && isVideoOn ? (
                <video
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  srcObject={stream}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                  <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center text-white text-3xl">
                    {userName ? userName.charAt(0).toUpperCase() : "?"}
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
                <button
                  onClick={toggleAudio}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isAudioOn ? "bg-neutral-800/80" : "bg-danger-500"
                  }`}
                >
                  <Mic
                    className={`w-5 h-5 ${
                      isAudioOn ? "text-white" : "text-white"
                    }`}
                  />
                </button>

                <button
                  onClick={toggleVideo}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isVideoOn ? "bg-neutral-800/80" : "bg-danger-500"
                  }`}
                >
                  <Video
                    className={`w-5 h-5 ${
                      isVideoOn ? "text-white" : "text-white"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowDeviceSettings(!showDeviceSettings)}
                className="text-primary-500 hover:text-primary-600 font-medium flex items-center"
              >
                <Settings className="w-4 h-4 mr-1" />
                <span>Check audio and video</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Right side - Join form */}
          <div className="bg-white p-6 rounded-lg shadow-card flex flex-col">
            <h1 className="text-2xl font-bold mb-2">Ready to join?</h1>
            <p className="text-neutral-600 mb-6">No one else is here</p>

            <div className="mb-6">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Your name
              </label>
              <input
                type="text"
                id="name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="input-field"
                autoFocus
              />
            </div>

            <div className="flex flex-col space-y-3 mt-auto">
              <button
                onClick={handleJoinMeeting}
                disabled={!userName.trim()}
                className="btn-primary w-full"
              >
                Join now
              </button>

              <button className="btn-secondary w-full">Present</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JoinMeeting;
