// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Video,
//   Calendar,
//   Link as LinkIcon,
//   ChevronRight,
//   ChevronLeft,
// } from "lucide-react";
// import Header from "@/components/videoCall/Header";

// const Home: React.FC = () => {
//   const navigate = useNavigate();
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [meetingCode, setMeetingCode] = useState("");
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const handleCreateMeeting = () => {
//     const meetingId = Math.random().toString(36).substring(2, 10);
//     console.log("meeting id", meetingId);

//     navigate(`/user/meeting/${meetingId}`);
//   };

//   const handleJoinMeeting = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (meetingCode.trim()) {
//       console.log("meeting code", meetingCode);

//       navigate(`/user/meeting/${meetingCode}`);
//     }
//   };

//   const slides = [
//     {
//       title: "Video calls and meetings for everyone",
//       description:
//         "Connect, collaborate and celebrate from anywhere with MeetUp",
//       image:
//         "https://images.pexels.com/photos/3153198/pexels-photo-3153198.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//     },
//     {
//       title: "Secure meetings for your team",
//       description:
//         "Get your team together with enterprise-grade video conferencing",
//       image:
//         "https://images.pexels.com/photos/3182746/pexels-photo-3182746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//     },
//     {
//       title: "Easy to use for everyone",
//       description:
//         "Simple, intuitive interface makes video meetings accessible to all",
//       image:
//         "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//     },
//   ];

//   const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
//   const prevSlide = () =>
//     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

//   return (
//     <div className="min-h-screen flex flex-col bg-neutral-50">
//       <Header />

//       <main className="flex-1 flex flex-col md:flex-row">
//         {/* Left side - Content */}
//         <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
//           <h1 className="text-4xl font-bold text-neutral-900 mb-4">
//             {slides[currentSlide].title}
//           </h1>
//           <p className="text-lg text-neutral-700 mb-8">
//             {slides[currentSlide].description}
//           </p>

//           <div className="flex flex-wrap gap-4 mb-8">
//             <div className="relative">
//               <button
//                 className="btn-primary flex items-center space-x-2"
//                 onClick={() => setShowDropdown(!showDropdown)}
//               >
//                 <Video className="w-5 h-5" />
//                 <span>New meeting</span>
//               </button>

//               {showDropdown && (
//                 <div className="absolute top-full left-0 mt-2 bg-white shadow-elevated rounded-lg w-64 z-10 py-2 bounce-in">
//                   <button
//                     className="w-full text-left px-4 py-3 hover:bg-neutral-100 flex items-center"
//                     onClick={handleCreateMeeting}
//                   >
//                     <LinkIcon className="w-5 h-5 mr-3 text-neutral-600" />
//                     <div>
//                       <div className="font-medium">
//                         Start an instant meeting
//                       </div>
//                       <div className="text-sm text-neutral-600">
//                         Start now and share link to invite others
//                       </div>
//                     </div>
//                   </button>

//                   <button className="w-full text-left px-4 py-3 hover:bg-neutral-100 flex items-center">
//                     <Calendar className="w-5 h-5 mr-3 text-neutral-600" />
//                     <div>
//                       <div className="font-medium">Schedule for later</div>
//                       <div className="text-sm text-neutral-600">
//                         Plan your meeting in calendar
//                       </div>
//                     </div>
//                   </button>
//                 </div>
//               )}
//             </div>

//             <form onSubmit={handleJoinMeeting} className="flex">
//               <input
//                 type="text"
//                 placeholder="Enter a code or link"
//                 value={meetingCode}
//                 onChange={(e) => setMeetingCode(e.target.value)}
//                 className="input-field rounded-r-none"
//               />
//               <button
//                 type="submit"
//                 className="btn-primary rounded-l-none"
//                 disabled={!meetingCode.trim()}
//               >
//                 Join
//               </button>
//             </form>
//           </div>

//           <div className="flex items-center space-x-2 mb-6">
//             <button
//               className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center"
//               onClick={prevSlide}
//             >
//               <ChevronLeft className="w-5 h-5" />
//             </button>

//             <div className="flex items-center space-x-1">
//               {slides.map((_, index) => (
//                 <button
//                   key={index}
//                   className={`w-2 h-2 rounded-full ${
//                     index === currentSlide ? "bg-primary-500" : "bg-neutral-300"
//                   }`}
//                   onClick={() => setCurrentSlide(index)}
//                 />
//               ))}
//             </div>

//             <button
//               className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center"
//               onClick={nextSlide}
//             >
//               <ChevronRight className="w-5 h-5" />
//             </button>
//           </div>

//           <div className="mt-auto">
//             <Link
//               to="#"
//               className="text-primary-500 hover:text-primary-600 font-medium flex items-center"
//             >
//               <span>Learn more about MeetUp</span>
//               <ChevronRight className="w-4 h-4 ml-1" />
//             </Link>
//           </div>
//         </div>

//         {/* Right side - Image */}
//         <div className="w-full md:w-1/2 bg-neutral-100 relative overflow-hidden">
//           <img
//             src={slides[currentSlide].image}
//             alt="Video conference"
//             className="w-full h-full object-cover transition-opacity duration-500"
//           />
//           <div className="absolute bottom-6 right-6 bg-white p-4 rounded-lg shadow-card max-w-xs">
//             <h3 className="text-lg font-medium mb-2">
//               Get a link you can share
//             </h3>
//             <p className="text-sm text-neutral-600 mb-4">
//               Click "New meeting" to get a link you can send to people you want
//               to meet with
//             </p>
//             <div className="flex justify-end">
//               <button className="btn-primary" onClick={handleCreateMeeting}>
//                 New meeting
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>

//       <footer className="bg-white py-4 px-8 border-t border-neutral-200">
//         <div className="flex flex-wrap justify-between items-center">
//           <div className="flex items-center space-x-6">
//             <Link
//               to="#"
//               className="text-sm text-neutral-600 hover:text-neutral-900"
//             >
//               Privacy
//             </Link>
//             <Link
//               to="#"
//               className="text-sm text-neutral-600 hover:text-neutral-900"
//             >
//               Terms
//             </Link>
//             <Link
//               to="#"
//               className="text-sm text-neutral-600 hover:text-neutral-900"
//             >
//               Help
//             </Link>
//           </div>

//           <div className="text-sm text-neutral-600">© 2025 MentorOne</div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Home;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Link2, Plus, Video } from "lucide-react";
import { toast } from "react-hot-toast";
import Logo from "@/assets/logo6.png";
import MeetingImage from "@/assets/MeetingImage.jpg"; // Add an image for the right side
import { startVideoCall } from "@/services/userServices";

const VideoCallHome: React.FC = () => {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const [showNewMeetingOptions, setShowNewMeetingOptions] = useState(false);

  const handleCreateMeeting = async () => {
    try {
      const meetingId = await startVideoCall();
      navigate(`/user/meeting/${meetingId}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create meeting",
        variant: "destructive",
      });
    }
  };

  const handleJoinMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (meetingCode.trim()) {
      navigate(`/user/meeting/${meetingCode}`);
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
