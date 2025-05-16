// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Calendar, Link2, Plus, Video } from "lucide-react";
// import { toast } from "react-hot-toast";
// import Logo from "@/assets/logo6.png";
// import MeetingImage from "@/assets/MeetingImage.jpg"; // Add an image for the right side
// import { startVideoCall } from "@/services/userServices";
// import { joinMeeting } from "@/services/userServices";

// const VideoCallHome: React.FC = () => {
//   const navigate = useNavigate();
//   const [meetingCode, setMeetingCode] = useState("");
//   const [showNewMeetingOptions, setShowNewMeetingOptions] = useState(false);

//   const handleCreateMeeting = async () => {
//     try {
//       const meetingId = await startVideoCall();
//       console.log("videocallhome oet meetingid from backedn", meetingId);

//       navigate(`/user/meeting/${meetingId}`);
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to create meeting",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleJoinMeeting = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (meetingCode.trim()) {
//       console.log("meeting code is..", meetingCode);

//       await joinMeeting(meetingCode);
//       navigate(`/user/meeting/${meetingCode}`);
//     } else {
//       toast({
//         title: "Invalid Input",
//         description: "Please enter a valid meeting code",
//         variant: "destructive",
//       });
//     }
//   };

//   // const handleJoinMeeting = async () => {
//   //   if (meetingCode.trim()) {
//   //     try {
//   //       console.log("homepagehandleJoinMeeting step 1", meetingCode);

//   //       await joinMeeting(meetingCode);
//   //       console.log("homepagehandleJoinMeeting step 2");
//   //       navigate(`/user/meeting/${meetingCode}`);
//   //       console.log("homepagehandleJoinMeeting step 3");
//   //     } catch (error: any) {
//   //       toast({
//   //         title: "Error",
//   //         description: error.message || "Failed to join meeting",
//   //         variant: "destructive",
//   //       });
//   //     }
//   //   }
//   // };

//   return (
//     <div className="min-h-screen bg-white">
//       <header className="border-b p-4 flex items-center justify-between">
//         <div className="flex items-center">
//           <img src={Logo} alt="MentorOne" className="h-8 mr-4" />
//           <span className="text-xl font-semibold text-gray-800">
//             MentorOne Meet
//           </span>
//         </div>
//         <div className="flex items-center gap-4">
//           <span className="text-gray-700">
//             {new Date().toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}{" "}
//             •{" "}
//             {new Date().toLocaleDateString([], {
//               weekday: "short",
//               day: "numeric",
//               month: "short",
//             })}
//           </span>
//           <Button variant="ghost" size="icon" aria-label="Help">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <circle cx="12" cy="12" r="10" />
//               <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
//               <path d="M12 17h.01" />
//             </svg>
//           </Button>
//         </div>
//       </header>

//       <main className="max-w-6xl mx-auto py-12 px-4 md:px-6 flex flex-col md:flex-row gap-12 items-center">
//         <div className="flex-1">
//           <h1 className="text-4xl font-bold text-gray-800 mb-4">
//             Video calls and meetings for everyone
//           </h1>
//           <p className="text-lg text-gray-600 mb-8">
//             Connect, collaborate, and mentor from anywhere with MentorOne Meet
//           </p>

//           <div className="relative">
//             <Button
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 mb-4"
//               onClick={() => setShowNewMeetingOptions(!showNewMeetingOptions)}
//               aria-expanded={showNewMeetingOptions}
//               aria-controls="new-meeting-options"
//             >
//               <Video className="w-5 h-5" />
//               New meeting
//             </Button>
//             {showNewMeetingOptions && (
//               <div
//                 id="new-meeting-options"
//                 className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md p-2 z-10 w-64"
//               >
//                 <Button
//                   variant="ghost"
//                   className="w-full text-left flex items-center gap-2 p-2 hover:bg-gray-100"
//                   onClick={handleCreateMeeting}
//                 >
//                   <Plus className="w-5 h-5" />
//                   Start an instant meeting
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   className="w-full text-left flex items-center gap-2 p-2 hover:bg-gray-100"
//                   disabled
//                 >
//                   <Link2 className="w-5 h-5" />
//                   Create a meeting for later
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   className="w-full text-left flex items-center gap-2 p-2 hover:bg-gray-100"
//                   disabled
//                 >
//                   <Calendar className="w-5 h-5" />
//                   Schedule in Calendar
//                 </Button>
//               </div>
//             )}
//             <form onSubmit={handleJoinMeeting} className="flex gap-2 mb-8">
//               <Input
//                 placeholder="Enter a code or link"
//                 value={meetingCode}
//                 onChange={(e) => setMeetingCode(e.target.value)}
//                 className="border rounded-md px-4 py-2 w-64"
//                 aria-label="Meeting code or link"
//               />
//               <Button type="submit" variant="outline">
//                 Join
//               </Button>
//             </form>
//           </div>
//         </div>
//         <div className="flex-1 hidden md:block">
//           <img
//             src={MeetingImage}
//             alt="Video call illustration"
//             className="w-full h-auto"
//           />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default VideoCallHome;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Link2, Plus, Video } from "lucide-react";
import { toast } from "react-hot-toast";
import Logo from "@/assets/logo6.png";
import MeetingImage from "@/assets/MeetingImage.jpg";
import { startVideoCall } from "@/services/userServices";

const VideoCallHome: React.FC = () => {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const [showNewMeetingOptions, setShowNewMeetingOptions] = useState(false);

  const handleCreateMeeting = async () => {
    try {
      const meetingId = await startVideoCall();
      console.log("videocallhome got meetingid from backend", meetingId);
      navigate(`/user/meeting/${meetingId}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create meeting",
        variant: "destructive",
      });
    }
  };

  const handleJoinMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (meetingCode.trim()) {
      console.log("meeting code is:", meetingCode);
      navigate(`/user/meeting-join/${meetingCode}`);
    } else {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid meeting code",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <img src={Logo} alt="MentorOne" className="h-8 mr-4" />
          <span className="text-xl font-semibold text-gray-800">
            MentorOne Meet
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            •{" "}
            {new Date().toLocaleDateString([], {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </span>
          <Button variant="ghost" size="icon" aria-label="Help">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-12 px-4 md:px-6 flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Video calls and meetings for everyone
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Connect, collaborate, and mentor from anywhere with MentorOne Meet
          </p>

          <div className="relative">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 mb-4"
              onClick={() => setShowNewMeetingOptions(!showNewMeetingOptions)}
              aria-expanded={showNewMeetingOptions}
              aria-controls="new-meeting-options"
            >
              <Video className="w-5 h-5" />
              New meeting
            </Button>
            {showNewMeetingOptions && (
              <div
                id="new-meeting-options"
                className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md p-2 z-10 w-64"
              >
                <Button
                  variant="ghost"
                  className="w-full text-left flex items-center gap-2 p-2 hover:bg-gray-100"
                  onClick={handleCreateMeeting}
                >
                  <Plus className="w-5 h-5" />
                  Start an instant meeting
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-left flex items-center gap-2 p-2 hover:bg-gray-100"
                  disabled
                >
                  <Link2 className="w-5 h-5" />
                  Create a meeting for later
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-left flex items-center gap-2 p-2 hover:bg-gray-100"
                  disabled
                >
                  <Calendar className="w-5 h-5" />
                  Schedule in Calendar
                </Button>
              </div>
            )}
            <form onSubmit={handleJoinMeeting} className="flex gap-2 mb-8">
              <Input
                placeholder="Enter a code or link"
                value={meetingCode}
                onChange={(e) => setMeetingCode(e.target.value)}
                className="border rounded-md px-4 py-2 w-64"
                aria-label="Meeting code or link"
              />
              <Button type="submit" variant="outline">
                Join
              </Button>
            </form>
          </div>
        </div>
        <div className="flex-1 hidden md:block">
          <img
            src={MeetingImage}
            alt="Video call illustration"
            className="w-full h-auto"
          />
        </div>
      </main>
    </div>
  );
};

export default VideoCallHome;
