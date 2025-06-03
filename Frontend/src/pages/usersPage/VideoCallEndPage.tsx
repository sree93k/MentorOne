// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { ShieldCheck } from "lucide-react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store/store";
// const VideoCallEndPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { isOnline } = useSelector((state: RootState) => state.user);
//   const handleRejoin = () => {
//     console.log("VideoCallEndPage: Rejoining meeting:", id);
//     navigate(`/user/meeting/${id}`);
//   };

//   const handleReturnHome = () => {
//     console.log("VideoCallEndPage: Navigating to home screen");
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
//         {isOnline.role === "mentee" && (
//           <Button
//             variant="outline"
//             className="border-blue-600 text-blue-600 hover:bg-blue-50"
//             onClick={handleRejoin}
//           >
//             Rejoin
//           </Button>
//         )}
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
import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

const VideoCallEndPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { isOnline } = useSelector((state: RootState) => state.user);

  // Use joinLink from state, default to /user/meeting-join/<meetingId> for mentees
  const joinLink =
    state?.joinLink ||
    (isOnline?.role === "mentee"
      ? `/user/meeting-join/${id}`
      : `/user/meeting/${id}`);

  const handleRejoin = () => {
    console.log("VideoCallEndPage: Rejoining meeting with link:", joinLink);
    navigate(joinLink);
  };

  const handleReturnHome = () => {
    console.log("VideoCallEndPage: Navigating to home screen");
    navigate("/user/meetinghome");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
        <span className="text-blue-600">45</span>
      </div>

      <p className="text-gray-600 mb-8">Returning to home screen</p>

      <h1 className="text-3xl font-medium text-gray-800 mb-6">
        You've left the meeting
      </h1>

      <div className="flex gap-4 mb-6">
        {isOnline?.role === "mentee" && (
          <Button
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={handleRejoin}
          >
            Rejoin Meeting
          </Button>
        )}
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleReturnHome}
        >
          Return to Home
        </Button>
      </div>

      <Button variant="link" className="text-blue-600 mb-8">
        Submit Feedback
      </Button>

      <div className="max-w-md w-full border rounded-lg p-6 bg-white shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <ShieldCheck className="text-blue-600 h-6 w-6" />
          </div>
          <div>
            <h2 className="font-medium text-gray-900">
              Your Meeting is Secure
            </h2>
            <p className="text-gray-600 text-sm">
              Only invited or admitted participants can join the meeting.
            </p>
          </div>
        </div>
        <div className="text-right">
          <Button variant="link" className="text-blue-600">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallEndPage;
