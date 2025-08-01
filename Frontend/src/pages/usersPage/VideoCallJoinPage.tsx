import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  User,
  AlertCircle,
  CheckCircle,
  Settings,
  Clock,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { joinMeeting } from "@/services/userServices";
import { io, Socket } from "socket.io-client";
import { checkAuthStatus } from "@/utils/auth";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

export default function MeetingJoinPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isReady] = useState(true);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState({
    camera: "checking",
    microphone: "checking",
  });

  // Get user name from Redux store
  const { isOnline } = useSelector((state: RootState) => state.user);
  const userName = isOnline?.firstName || isOnline?.name || "User";

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  useEffect(() => {
    console.log("🔍 MeetingJoinPage: Component mounted");
    console.log("🔍 All cookies:", document.cookie);

    const isAuthenticated = checkAuthStatus();
    console.log("🔍 Authentication check result:", isAuthenticated);

    if (!isAuthenticated) {
      console.log("❌ NOT AUTHENTICATED - Will redirect to login");
      toast.error("Please log in to join the meeting.");
      navigate("/login");
      return;
    }

    console.log("✅ AUTHENTICATED - Proceeding with join page setup");

    const socketInstance = io(`${import.meta.env.VITE_SOCKET_URL}/video`, {
      transports: ["websocket"],
      path: "/socket.io/",
      query: { meetingId },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true,
    });
    socketRef.current = socketInstance;

    socketInstance.on("connect", () => {
      console.log("Socket.IO connected for join page:", socketInstance.id);
    });

    socketInstance.on("join-rejected", () => {
      console.log("Join request rejected by creator");
      toast.error("Your join request was rejected by the meeting creator.");
      setIsLoading(false);
      navigate("/user/meetinghome");
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error.message);
      toast.error("Failed to connect to the server.");
      if (error.message.includes("Authentication error")) {
        // ✅ FIXED: Clear the readable cookie on auth error
        document.cookie =
          "isAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate("/login");
      }
    });

    // Setup media stream
    const setupStream = async () => {
      try {
        setPermissionError(null);
        setDeviceStatus({ camera: "checking", microphone: "checking" });

        if (isVideoOn || isMicOn) {
          // Check permissions first
          try {
            const permissions = await Promise.all([
              navigator.permissions.query({ name: "camera" as PermissionName }),
              navigator.permissions.query({
                name: "microphone" as PermissionName,
              }),
            ]);

            const [cameraPermission, micPermission] = permissions;

            if (
              cameraPermission.state === "denied" ||
              micPermission.state === "denied"
            ) {
              setPermissionError(
                "Camera and/or microphone access is blocked. Please allow access in your browser settings to use video chat."
              );
              setDeviceStatus({
                camera:
                  cameraPermission.state === "denied" ? "denied" : "granted",
                microphone:
                  micPermission.state === "denied" ? "denied" : "granted",
              });
              return;
            }
          } catch (err) {
            console.log(
              "Permission check not supported, proceeding with getUserMedia"
            );
          }

          const stream = await navigator.mediaDevices.getUserMedia({
            video: isVideoOn,
            audio: isMicOn,
          });

          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }

          setDeviceStatus({ camera: "granted", microphone: "granted" });
        } else if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
        if (err instanceof Error) {
          if (
            err.name === "NotAllowedError" ||
            err.name === "PermissionDeniedError"
          ) {
            setPermissionError(
              "Please allow camera and microphone access to use video chat. Click the camera icon in your browser's address bar to update permissions."
            );
            setDeviceStatus({ camera: "denied", microphone: "denied" });
          } else {
            setPermissionError(
              "Unable to access camera or microphone. Please make sure your devices are properly connected and not in use by another application."
            );
            setDeviceStatus({ camera: "error", microphone: "error" });
          }
        }
      }
    };

    setupStream();

    return () => {
      console.log("Cleaning up MeetingJoinPage");
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          console.log(`Stopping track: ${track.kind} (${track.id})`);
          track.stop();
        });
        streamRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isVideoOn, isMicOn, navigate, meetingId]);

  const handleJoinMeeting = async () => {
    if (!meetingId) {
      toast.error("Invalid meeting ID.");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Sending join request for meeting:", meetingId);
      await joinMeeting(meetingId);
      console.log("Join request sent, waiting for admin approval");
      navigate(`/user/meeting/${meetingId}`, {
        state: { isVideoOn, isMicOn },
      });
    } catch (error: any) {
      console.error("Error joining meeting:", error);
      toast.error(error.message || "Failed to send join request.");
      setIsLoading(false);
    }
  };

  const getDeviceIcon = (device: string, status: string) => {
    if (status === "checking")
      return (
        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
      );
    if (status === "granted")
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
              <Video className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MentorOne Meet
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-gray-600 bg-white/50 px-3 py-2 rounded-lg">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-sm">Meeting ID: {meetingId}</span>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl">
          {/* Permission Error Alert */}
          {permissionError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-800 mb-1">
                  Permission Required
                </h4>
                <p className="text-red-700 text-sm">{permissionError}</p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Video Preview */}
            <div className="relative">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50">
                <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900">
                  {isVideoOn ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <User className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                  {/* User name overlay */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-white text-sm font-medium">
                        {userName}
                      </span>
                    </div>
                  </div>

                  {/* Control buttons */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                    <button
                      onClick={() => setIsMicOn(!isMicOn)}
                      className={`p-4 rounded-full transition-all duration-200 hover:scale-105 ${
                        !isMicOn
                          ? "bg-red-500 hover:bg-red-600 text-white shadow-lg"
                          : "bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                      }`}
                    >
                      {isMicOn ? (
                        <Mic className="w-5 h-5" />
                      ) : (
                        <MicOff className="w-5 h-5" />
                      )}
                    </button>

                    <button
                      onClick={() => setIsVideoOn(!isVideoOn)}
                      className={`p-4 rounded-full transition-all duration-200 hover:scale-105 ${
                        !isVideoOn
                          ? "bg-red-500 hover:bg-red-600 text-white shadow-lg"
                          : "bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                      }`}
                    >
                      {isVideoOn ? (
                        <Video className="w-5 h-5" />
                      ) : (
                        <VideoOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Device Status */}
              <div className="mt-4 bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50">
                <h4 className="font-medium text-gray-800 mb-3">
                  Device Status
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Video className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Camera</span>
                    </div>
                    {getDeviceIcon("camera", deviceStatus.camera)}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mic className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Microphone</span>
                    </div>
                    {getDeviceIcon("microphone", deviceStatus.microphone)}
                  </div>
                </div>
              </div>
            </div>

            {/* Join Controls */}
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Ready to join?
                </h1>
                <p className="text-xl text-gray-600">
                  {isReady
                    ? "Waiting for the host to admit you"
                    : "Setting up your devices..."}
                </p>
              </div>

              {/* Meeting Info Card */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Meeting Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Meeting ID</span>
                    <span className="font-mono text-sm font-medium text-gray-800">
                      {meetingId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Your name</span>
                    <span className="text-sm font-medium text-gray-800">
                      {userName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className="text-sm font-medium text-blue-600">
                      Ready to join
                    </span>
                  </div>
                </div>
              </div>

              {/* Join Button */}
              <div className="space-y-4">
                <button
                  onClick={handleJoinMeeting}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Requesting to join...</span>
                    </div>
                  ) : (
                    "Join now"
                  )}
                </button>

                <p className="text-center text-sm text-gray-500">
                  The meeting host will be notified of your request to join
                </p>
              </div>

              {/* Audio/Video Settings */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Before you join
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mic className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Microphone</span>
                    </div>
                    <button
                      onClick={() => setIsMicOn(!isMicOn)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        isMicOn
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {isMicOn ? "On" : "Off"}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Video className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Camera</span>
                    </div>
                    <button
                      onClick={() => setIsVideoOn(!isVideoOn)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        isVideoOn
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {isVideoOn ? "On" : "Off"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
