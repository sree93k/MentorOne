// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { ShieldCheck } from "lucide-react";

// const VideoCallEndPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   const handleRejoin = () => {
//     navigate(`/user/meeting/${id}`);
//   };

//   const handleReturnHome = () => {
//     navigate("/user/meetinghome");
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
//       <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
//         <span className="text-blue-600">49</span>
//       </div>

//       <p className="text-gray-600 mb-8">Returning to home screen</p>

//       <h1 className="text-3xl font-medium text-gray-800 mb-8">
//         You've left the meeting
//       </h1>

//       <div className="flex gap-4 mb-6">
//         <Button
//           variant="outline"
//           className="border-blue-600 text-blue-600 hover:bg-blue-50"
//           onClick={handleRejoin}
//         >
//           Rejoin
//         </Button>
//         <Button
//           className="bg-blue-600 hover:bg-blue-700 text-white"
//           onClick={handleReturnHome}
//         >
//           Return to home screen
//         </Button>
//       </div>

//       <Button variant="link" className="text-blue-600 mb-8">
//         Submit feedback
//       </Button>

//       <div className="max-w-md w-full border rounded-lg p-6">
//         <div className="flex items-center gap-4 mb-4">
//           <div className="bg-blue-100 p-3 rounded-lg">
//             <ShieldCheck className="text-blue-600 h-6 w-6" />
//           </div>
//           <div>
//             <h2 className="font-medium">Your meeting is safe</h2>
//             <p className="text-gray-600 text-sm">
//               No one can join a meeting unless invited or admitted by the host
//             </p>
//           </div>
//         </div>
//         <div className="text-right">
//           <Button variant="link" className="text-blue-600">
//             Learn more
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoCallEndPage;
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

const VideoCallEndPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Check media device status on mount
  useEffect(() => {
    console.log("VideoCallEndPage: Checking media device status");

    // Function to check active media streams
    const checkMediaStreams = async () => {
      try {
        // Get all media devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const activeDevices = devices.filter(
          (device) =>
            device.kind === "videoinput" || device.kind === "audioinput"
        );
        console.log("VideoCallEndPage: Media devices:", activeDevices);

        // Attempt to access media to check if streams are active
        const stream = await navigator.mediaDevices
          .getUserMedia({
            video: true,
            audio: true,
          })
          .catch((err) => {
            console.log(
              "VideoCallEndPage: No active media stream (expected):",
              err.message
            );
            return null;
          });

        if (stream) {
          console.warn(
            "VideoCallEndPage: Found active media stream, stopping tracks"
          );
          stream.getTracks().forEach((track) => {
            console.log(
              `VideoCallEndPage: Stopping track: ${track.kind} (${track.id})`
            );
            track.stop();
            track.enabled = false;
          });
        } else {
          console.log(
            "VideoCallEndPage: No active media streams, camera and audio are off"
          );
        }
      } catch (error) {
        console.error("VideoCallEndPage: Error checking media streams:", error);
      }
    };

    checkMediaStreams();

    // Cleanup on unmount (though not strictly necessary here)
    return () => {
      console.log("VideoCallEndPage: Component unmounting");
    };
  }, []);

  const handleRejoin = () => {
    console.log("VideoCallEndPage: Rejoining meeting:", id);
    navigate(`/user/meeting/${id}`);
  };

  const handleReturnHome = () => {
    console.log("VideoCallEndPage: Navigating to home screen");
    navigate("/user/meetinghome");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
        <span className="text-blue-600">49</span>
      </div>

      <p className="text-gray-600 mb-8">Returning to home screen</p>

      <h1 className="text-3xl font-medium text-gray-800 mb-8">
        You've left the meeting
      </h1>

      <div className="flex gap-4 mb-6">
        <Button
          variant="outline"
          className="border-blue-600 text-blue-600 hover:bg-blue-50"
          onClick={handleRejoin}
        >
          Rejoin
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleReturnHome}
        >
          Return to home screen
        </Button>
      </div>

      <Button variant="link" className="text-blue-600 mb-8">
        Submit feedback
      </Button>

      <div className="max-w-md w-full border rounded-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <ShieldCheck className="text-blue-600 h-6 w-6" />
          </div>
          <div>
            <h2 className="font-medium">Your meeting is safe</h2>
            <p className="text-gray-600 text-sm">
              No one can join a meeting unless invited or admitted by the host
            </p>
          </div>
        </div>
        <div className="text-right">
          <Button variant="link" className="text-blue-600">
            Learn more
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallEndPage;
