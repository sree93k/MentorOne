// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Video, Mic, Settings, ChevronDown } from "lucide-react";
// import Header from "../../components/videoCall/Header";

// const JoinMeeting: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [userName, setUserName] = useState("");
//   const [isVideoOn, setIsVideoOn] = useState(true);
//   const [isAudioOn, setIsAudioOn] = useState(true);
//   const [stream, setStream] = useState<MediaStream | null>(null);
//   const [showDeviceSettings, setShowDeviceSettings] = useState(false);

//   useEffect(() => {
//     // Request camera and microphone permissions
//     const initializeMedia = async () => {
//       try {
//         const mediaStream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true,
//         });
//         setStream(mediaStream);
//       } catch (error) {
//         console.error("Error accessing media devices:", error);
//       }
//     };

//     initializeMedia();

//     // Cleanup
//     return () => {
//       if (stream) {
//         stream.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   const toggleVideo = () => {
//     if (stream) {
//       const videoTrack = stream.getVideoTracks()[0];
//       if (videoTrack) {
//         videoTrack.enabled = !videoTrack.enabled;
//         setIsVideoOn(videoTrack.enabled);
//       }
//     }
//   };

//   const toggleAudio = () => {
//     if (stream) {
//       const audioTrack = stream.getAudioTracks()[0];
//       if (audioTrack) {
//         audioTrack.enabled = !audioTrack.enabled;
//         setIsAudioOn(audioTrack.enabled);
//       }
//     }
//   };

//   const handleJoinMeeting = () => {
//     if (userName.trim()) {
//       navigate(`/meeting/${id}`);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-neutral-100">
//       <Header />

//       <main className="flex-1 flex items-center justify-center p-4">
//         <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Left side - Preview */}
//           <div className="bg-white p-6 rounded-lg shadow-card">
//             <div className="aspect-video bg-neutral-900 rounded-lg overflow-hidden mb-4 relative">
//               {stream && isVideoOn ? (
//                 <video
//                   autoPlay
//                   playsInline
//                   muted
//                   className="w-full h-full object-cover"
//                   srcObject={stream}
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center bg-neutral-800">
//                   <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center text-white text-3xl">
//                     {userName ? userName.charAt(0).toUpperCase() : "?"}
//                   </div>
//                 </div>
//               )}

//               <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
//                 <button
//                   onClick={toggleAudio}
//                   className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                     isAudioOn ? "bg-neutral-800/80" : "bg-danger-500"
//                   }`}
//                 >
//                   <Mic
//                     className={`w-5 h-5 ${
//                       isAudioOn ? "text-white" : "text-white"
//                     }`}
//                   />
//                 </button>

//                 <button
//                   onClick={toggleVideo}
//                   className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                     isVideoOn ? "bg-neutral-800/80" : "bg-danger-500"
//                   }`}
//                 >
//                   <Video
//                     className={`w-5 h-5 ${
//                       isVideoOn ? "text-white" : "text-white"
//                     }`}
//                   />
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <button
//                 onClick={() => setShowDeviceSettings(!showDeviceSettings)}
//                 className="text-primary-500 hover:text-primary-600 font-medium flex items-center"
//               >
//                 <Settings className="w-4 h-4 mr-1" />
//                 <span>Check audio and video</span>
//                 <ChevronDown className="w-4 h-4 ml-1" />
//               </button>
//             </div>
//           </div>

//           {/* Right side - Join form */}
//           <div className="bg-white p-6 rounded-lg shadow-card flex flex-col">
//             <h1 className="text-2xl font-bold mb-2">Ready to join?</h1>
//             <p className="text-neutral-600 mb-6">No one else is here</p>

//             <div className="mb-6">
//               <label
//                 htmlFor="name"
//                 className="block text-sm font-medium text-neutral-700 mb-1"
//               >
//                 Your name
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 value={userName}
//                 onChange={(e) => setUserName(e.target.value)}
//                 placeholder="Enter your name"
//                 className="input-field"
//                 autoFocus
//               />
//             </div>

//             <div className="flex flex-col space-y-3 mt-auto">
//               <button
//                 onClick={handleJoinMeeting}
//                 disabled={!userName.trim()}
//                 className="btn-primary w-full"
//               >
//                 Join now
//               </button>

//               <button className="btn-secondary w-full">Present</button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default JoinMeeting;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { validateMeeting } from "@/services/userServices";
import Logo from "@/assets/logo6.png";

const VideoCallJoinPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validate = async () => {
      // Add debugging to see what ID value is being received
      console.log("Meeting ID from params:", id);

      if (!id) {
        console.error("No meeting ID provided");
        setError("Invalid meeting ID");
        setIsValidating(false);
        return;
      }

      try {
        console.log("Attempting to validate meeting ID:", id);
        const valid = await validateMeeting(id);
        console.log("Validation result:", valid);

        setIsValid(valid);

        if (!valid) {
          console.error("Meeting validation failed");
          setError("This meeting has ended or does not exist");
        }
      } catch (error: any) {
        console.error("Error validating meeting:", error);
        // More detailed error handling
        if (error.response) {
          console.error("Server response:", error.response.data);
          setError(
            error.response.data.message || "Server error validating meeting"
          );
        } else if (error.request) {
          console.error("No response received");
          setError("Network error - please check your connection");
        } else {
          setError(error.message || "Failed to validate meeting");
        }
      } finally {
        setIsValidating(false);
      }
    };

    // Wrap in setTimeout to ensure component is fully mounted
    // This can help with navigation and state updates
    setTimeout(() => {
      validate();
    }, 0);
  }, [id]);

  const handleJoinMeeting = () => {
    if (!id) {
      toast.error("Meeting ID is missing");
      return;
    }
    console.log("Joining meeting:", id);
    navigate(`/user/meeting/${id}`);
  };

  const handleReturnHome = () => {
    console.log("Returning to meeting home");
    navigate("/user/meetinghome");
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="mb-6">
          <img src={Logo} alt="MentorOne" className="h-12" />
        </div>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Validating meeting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="mb-6">
          <img src={Logo} alt="MentorOne" className="h-12" />
        </div>
        <div className="text-center max-w-md p-8 bg-white shadow-lg rounded-lg">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Unable to join meeting</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={handleReturnHome} className="bg-blue-600">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="mb-6">
        <img src={Logo} alt="MentorOne" className="h-12" />
      </div>
      <div className="text-center max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Ready to join the meeting?</h2>
        <p className="text-gray-600 mb-6">
          You're about to join a video meeting. Please ensure your camera and
          microphone are working.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={handleReturnHome} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleJoinMeeting} className="bg-blue-600">
            Join Meeting
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallJoinPage;
