// import { useRef, useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Video, Mic, MicOff, VideoOff, ChevronDown, Users } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { cn } from "@/lib/utils";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { toast } from "react-hot-toast";
// import { joinMeeting } from "@/services/userServices";
// import { io, Socket } from "socket.io-client";

// export default function MeetingJoinPage() {
//   const { meetingId } = useParams<{ meetingId: string }>();
//   const navigate = useNavigate();
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const streamRef = useRef<MediaStream | null>(null);
//   const socketRef = useRef<Socket | null>(null);
//   const [isMicOn, setIsMicOn] = useState(true);
//   const [isVideoOn, setIsVideoOn] = useState(true);
//   const [userEmail] = useState("user@example.com");
//   const [userName] = useState("User");
//   const [isReady] = useState(true);
//   const [permissionError, setPermissionError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     // Initialize Socket.IO for rejection handling
//     const token = localStorage.getItem("accessToken");
//     if (!token) {
//       toast.error("Please log in to join the meeting.");
//       navigate("/login");
//       return;
//     }

//     const socketInstance = io(`${import.meta.env.VITE_SOCKET_URL}/video`, {
//       auth: { token },
//       transports: ["websocket"],
//       path: "/socket.io/",
//       query: { meetingId },
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     });
//     socketRef.current = socketInstance;

//     socketInstance.on("connect", () => {
//       console.log("Socket.IO connected for join page:", socketInstance.id);
//     });

//     socketInstance.on("join-rejected", () => {
//       console.log("Join request rejected by creator");
//       toast.error("Your join request was rejected by the meeting creator.");
//       setIsLoading(false);
//       navigate("/user/meetinghome");
//     });

//     socketInstance.on("connect_error", (error) => {
//       console.error("Socket.IO connection error:", error.message);
//       toast.error("Failed to connect to the server.");
//       if (error.message.includes("Authentication error")) {
//         localStorage.removeItem("accessToken");
//         navigate("/login");
//       }
//     });

//     // Setup media stream
//     const setupStream = async () => {
//       try {
//         setPermissionError(null);

//         if (isVideoOn || isMicOn) {
//           const permissions = await Promise.all([
//             navigator.permissions.query({ name: "camera" as PermissionName }),
//             navigator.permissions.query({
//               name: "microphone" as PermissionName,
//             }),
//           ]);

//           const [cameraPermission, micPermission] = permissions;
//           if (
//             cameraPermission.state === "denied" ||
//             micPermission.state === "denied"
//           ) {
//             setPermissionError(
//               "Camera and/or microphone access is blocked. Please allow access in your browser settings to use video chat."
//             );
//             return;
//           }

//           const stream = await navigator.mediaDevices.getUserMedia({
//             video: isVideoOn,
//             audio: isMicOn,
//           });
//           streamRef.current = stream;
//           if (videoRef.current) {
//             videoRef.current.srcObject = stream;
//           }
//         } else if (videoRef.current) {
//           videoRef.current.srcObject = null;
//         }
//       } catch (err) {
//         console.error("Error accessing media devices:", err);
//         if (err instanceof Error) {
//           if (
//             err.name === "NotAllowedError" ||
//             err.name === "PermissionDeniedError"
//           ) {
//             setPermissionError(
//               "Please allow camera and microphone access to use video chat. Click the camera icon in your browser's address bar to update permissions."
//             );
//           } else {
//             setPermissionError(
//               "Unable to access camera or microphone. Please make sure your devices are properly connected and not in use by another application."
//             );
//           }
//         }
//       }
//     };

//     setupStream();

//     return () => {
//       console.log("Cleaning up MeetingJoinPage");
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach((track) => {
//           console.log(`Stopping track: ${track.kind} (${track.id})`);
//           track.stop();
//         });
//         streamRef.current = null;
//       }
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current = null;
//       }
//     };
//   }, [isVideoOn, isMicOn, navigate, meetingId]);

//   const handleJoinMeeting = async () => {
//     if (!meetingId) {
//       toast.error("Invalid meeting ID.");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       console.log("Sending join request for meeting:", meetingId);
//       await joinMeeting(meetingId);
//       console.log("Join request sent, waiting for admin approval");
//       navigate(`/user/meeting/${meetingId}`, {
//         state: { isVideoOn, isMicOn },
//       });
//     } catch (error: any) {
//       console.error("Error joining meeting:", error);
//       toast.error(error.message || "Failed to send join request.");
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       {/* Main Content */}
//       <main className="flex-1 flex items-center justify-between px-2 pt-10 pb-8">
//         <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
//           {permissionError && (
//             <Alert variant="destructive" className="mb-4 w-full">
//               <AlertDescription>{permissionError}</AlertDescription>
//             </Alert>
//           )}

//           {/* Video Preview */}
//           <div className="relative w-[800px] mx-auto">
//             <Card className="bg-neutral-100 overflow-hidden">
//               <CardContent className="p-0 relative aspect-video">
//                 {isVideoOn ? (
//                   <video
//                     ref={videoRef}
//                     autoPlay
//                     muted
//                     playsInline
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center bg-neutral-800">
//                     <div className="h-24 w-24 rounded-full bg-neutral-600 flex items-center justify-center">
//                       <span className="text-3xl font-medium text-white">
//                         {userName.charAt(0).toUpperCase()}
//                       </span>
//                     </div>
//                   </div>
//                 )}

//                 <div className="absolute top-4 left-4">
//                   <div className="text-white text-lg font-medium drop-shadow-md">
//                     {userName}
//                   </div>
//                 </div>

//                 <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
//                   <Button
//                     variant="secondary"
//                     size="icon"
//                     className={cn(
//                       "rounded-full h-12 w-12 bg-neutral-800/60 hover:bg-neutral-800/80 text-white border-0",
//                       !isMicOn && "bg-red-500/80 hover:bg-red-500/90"
//                     )}
//                     onClick={() => setIsMicOn(!isMicOn)}
//                   >
//                     {isMicOn ? (
//                       <Mic className="h-5 w-5" />
//                     ) : (
//                       <MicOff className="h-5 w-5" />
//                     )}
//                   </Button>

//                   <Button
//                     variant="secondary"
//                     size="icon"
//                     className={cn(
//                       "rounded-full h-12 w-12 bg-neutral-800/60 hover:bg-neutral-800/80 text-white border-0",
//                       !isVideoOn && "bg-red-500/80 hover:bg-red-500/90"
//                     )}
//                     onClick={() => setIsVideoOn(!isVideoOn)}
//                   >
//                     {isVideoOn ? (
//                       <Video className="h-5 w-5" />
//                     ) : (
//                       <VideoOff className="h-5 w-5" />
//                     )}
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Join Controls */}
//           <div className="flex flex-col items-center gap-6 mt-8">
//             <h2 className="text-3xl font-medium text-neutral-800">
//               Ready to join?
//             </h2>

//             <p className="text-neutral-600">
//               {isReady ? "No one else is here" : "Setting up your devices..."}
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
//               <Button
//                 className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 px-8 rounded-full"
//                 onClick={handleJoinMeeting}
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Requesting..." : "Join now"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Video, Mic, MicOff, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "react-hot-toast";
import { joinMeeting, validateUserSession } from "@/services/userServices";
import { io, Socket } from "socket.io-client";

export default function MeetingJoinPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [userName] = useState("User");
  const [isReady] = useState(true);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication first
    const checkAuth = async () => {
      try {
        const response = await validateUserSession();
        if (response?.status === 200) {
          setIsAuthenticated(true);
        } else {
          toast.error("Please log in to join the meeting.");
          navigate("/login");
          return;
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        toast.error("Please log in to join the meeting.");
        navigate("/login");
        return;
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Initialize Socket.IO for rejection handling (cookies will be sent automatically)
    const socketInstance = io(`${import.meta.env.VITE_SOCKET_URL}/video`, {
      withCredentials: true, // Important: This sends cookies automatically
      transports: ["websocket"],
      path: "/socket.io/",
      query: { meetingId },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
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
        navigate("/login");
      }
    });

    // Setup media stream
    const setupStream = async () => {
      try {
        setPermissionError(null);

        if (isVideoOn || isMicOn) {
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
            return;
          }

          const stream = await navigator.mediaDevices.getUserMedia({
            video: isVideoOn,
            audio: isMicOn,
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
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
          } else {
            setPermissionError(
              "Unable to access camera or microphone. Please make sure your devices are properly connected and not in use by another application."
            );
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
  }, [isVideoOn, isMicOn, navigate, meetingId, isAuthenticated]);

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

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-between px-2 pt-10 pb-8">
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
          {permissionError && (
            <Alert variant="destructive" className="mb-4 w-full">
              <AlertDescription>{permissionError}</AlertDescription>
            </Alert>
          )}

          {/* Video Preview */}
          <div className="relative w-[800px] mx-auto">
            <Card className="bg-neutral-100 overflow-hidden">
              <CardContent className="p-0 relative aspect-video">
                {isVideoOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                    <div className="h-24 w-24 rounded-full bg-neutral-600 flex items-center justify-center">
                      <span className="text-3xl font-medium text-white">
                        {userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}

                <div className="absolute top-4 left-4">
                  <div className="text-white text-lg font-medium drop-shadow-md">
                    {userName}
                  </div>
                </div>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                  <Button
                    variant="secondary"
                    size="icon"
                    className={cn(
                      "rounded-full h-12 w-12 bg-neutral-800/60 hover:bg-neutral-800/80 text-white border-0",
                      !isMicOn && "bg-red-500/80 hover:bg-red-500/90"
                    )}
                    onClick={() => setIsMicOn(!isMicOn)}
                  >
                    {isMicOn ? (
                      <Mic className="h-5 w-5" />
                    ) : (
                      <MicOff className="h-5 w-5" />
                    )}
                  </Button>

                  <Button
                    variant="secondary"
                    size="icon"
                    className={cn(
                      "rounded-full h-12 w-12 bg-neutral-800/60 hover:bg-neutral-800/80 text-white border-0",
                      !isVideoOn && "bg-red-500/80 hover:bg-red-500/90"
                    )}
                    onClick={() => setIsVideoOn(!isVideoOn)}
                  >
                    {isVideoOn ? (
                      <Video className="h-5 w-5" />
                    ) : (
                      <VideoOff className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Join Controls */}
          <div className="flex flex-col items-center gap-6 mt-8">
            <h2 className="text-3xl font-medium text-neutral-800">
              Ready to join?
            </h2>

            <p className="text-neutral-600">
              {isReady ? "No one else is here" : "Setting up your devices..."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 px-8 rounded-full"
                onClick={handleJoinMeeting}
                disabled={isLoading}
              >
                {isLoading ? "Requesting..." : "Join now"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
