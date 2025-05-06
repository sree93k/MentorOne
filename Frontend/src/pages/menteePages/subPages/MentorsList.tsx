// import React, { useState, useEffect } from "react";
// import { Search, MessageCircle, Calendar, Star, FileText } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import DummyProfileImg from "@/assets/DummyProfile.jpg";
// import { useNavigate } from "react-router-dom";
// import { Skeleton } from "@/components/ui/skeleton";
// import { getAllMentors } from "@/services/menteeService";
// import { toast } from "react-hot-toast";

// interface Mentor {
//   userId: string;
//   mentorId: string;
//   name: string;
//   bio?: string;
//   role: string;
//   work: string;
//   workRole: string;
//   profileImage?: string;
//   badge: string;
//   isBlocked: boolean;
//   isApproved: boolean | "Pending";
// }

// const MentorsList: React.FC = () => {
//   const [activeFilter, setActiveFilter] = useState("All");
//   const [isLoading, setIsLoading] = useState(true);
//   const [mentors, setMentors] = useState<Mentor[]>([]);
//   const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>(
//     {}
//   );
//   const [hoveredCard, setHoveredCard] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const filters = [
//     "All",
//     "General QnA",
//     "Mock Interview",
//     "Resume Review",
//     "Career Guide",
//   ];

//   useEffect(() => {
//     const fetchMentors = async () => {
//       setIsLoading(true);
//       try {
//         const fetchedMentors = await getAllMentors(activeFilter);
//         console.log("Mentors fetched:", fetchedMentors);
//         setMentors(fetchedMentors);
//       } catch (error: any) {
//         console.error("Failed to fetch mentors:", {
//           message: error.message,
//           stack: error.stack,
//         });
//         toast.error("Failed to load mentors. Please try again.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchMentors();
//   }, [activeFilter]);

//   const handleImageLoad = (id: string) => {
//     setLoadedImages((prev) => ({ ...prev, [id]: true }));
//   };

//   // Fixed values for all cards
//   const rating = "4.8";
//   const expertise = "Career Guide";

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <div className="flex-1 max-w-7xl mx-auto">
//         <div className="p-6">
//           <div className="flex items-center gap-3 mb-6 overflow-x-auto">
//             {filters.map((filter) => (
//               <Button
//                 key={filter}
//                 variant={activeFilter === filter ? "default" : "outline"}
//                 className={`rounded-full ${
//                   activeFilter === filter
//                     ? "bg-black text-white"
//                     : "border-gray-300"
//                 }`}
//                 onClick={() => setActiveFilter(filter)}
//               >
//                 {filter}
//               </Button>
//             ))}
//           </div>

//           <div className="p-4 rounded-xl shadow-sm">
//             <h2 className="text-2xl font-bold mb-6 text-gray-800">
//               Top Mentors
//             </h2>
//             {isLoading ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {[...Array(8)].map((_, index) => (
//                   <div
//                     key={index}
//                     className="relative overflow-hidden rounded-xl border border-black"
//                   >
//                     <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gray-50">
//                       <Skeleton className="w-12 h-12 rounded-full" />
//                       <div className="flex-1">
//                         <Skeleton className="h-4 w-24 mb-1" />
//                         <Skeleton className="h-3 w-16" />
//                       </div>
//                     </div>
//                     <div className="p-5">
//                       <Skeleton className="h-6 w-3/4 mb-2" />
//                       <Skeleton className="h-4 w-1/2 mb-4" />
//                       <div className="space-y-3 mt-4">
//                         <Skeleton className="h-4 w-full" />
//                         <Skeleton className="h-4 w-3/4" />
//                         <Skeleton className="h-5 w-12" />
//                       </div>
//                     </div>
//                     <div className="p-4 pt-2 border-t border-gray-200">
//                       <Skeleton className="h-10 w-full rounded-md" />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : mentors.length === 0 ? (
//               <div className="text-center py-12">
//                 <p className="text-gray-500 text-lg">
//                   No mentors found for this category.
//                 </p>
//                 <Button
//                   className="mt-4 bg-black text-white hover:bg-gray-800"
//                   onClick={() => setActiveFilter("All")}
//                 >
//                   View all mentors
//                 </Button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {mentors.map((mentor) => {
//                   // Using fixed values instead of random ones

//                   return (
//                     <div
//                       key={mentor.userId}
//                       className="relative overflow-hidden rounded-xl border border-black transition-all duration-300"
//                       style={{
//                         transform:
//                           hoveredCard === mentor.userId
//                             ? "translateY(-5px)"
//                             : "translateY(0)",
//                         boxShadow:
//                           hoveredCard === mentor.userId
//                             ? "0 10px 30px rgba(0, 0, 0, 0.1)"
//                             : "none",
//                       }}
//                       onMouseEnter={() => setHoveredCard(mentor.userId)}
//                       onMouseLeave={() => setHoveredCard(null)}
//                     >
//                       {/* Card Header with Mentor Info */}
//                       <div className="flex flex-col items-center gap-3 p-4 border-b border-gray-200 bg-gray-50">
//                         <div className="relative">
//                           {!loadedImages[mentor.userId] && (
//                             <Skeleton className="absolute inset-0 w-16 h-16 rounded-full animate-pulse" />
//                           )}
//                           <div className="w-32 h-32 rounded-full border-2 border-black bg-gray-100 overflow-hidden">
//                             <img
//                               src={mentor.profileImage || DummyProfileImg}
//                               alt={mentor.name}
//                               onLoad={() => handleImageLoad(mentor.userId)}
//                               className={`w-full h-full object-cover transition-opacity duration-500 ${
//                                 loadedImages[mentor.userId]
//                                   ? "opacity-100"
//                                   : "opacity-0"
//                               }`}
//                             />
//                           </div>
//                           <div className="absolute -top-2 -right-14">
//                             <div className="flex-shrink-0 flex items-center px-3 py-1 ml-4 rounded-full text-xs font-medium bg-black text-white">
//                               {/* <MessageCircle className="w-4 h-4" /> */}
//                               <Star className="w-3 h-3 mr-1 fill-white" />
//                               {rating}
//                             </div>
//                           </div>
//                         </div>

//                         <div className="flex justify-between items-center w-full">
//                           {/* Left: Role @ Company */}
//                           <div className="flex items-center gap-1 overflow-hidden whitespace-nowrap text-ellipsis">
//                             <p className="text-xs text-gray-600">
//                               {mentor.workRole}
//                             </p>
//                             <span className="text-xs text-gray-400">@</span>
//                             <p className="text-sm font-semibold text-ellipsis overflow-hidden">
//                               {mentor.work}
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Card Body */}
//                       <div className="p-4 flex-1 flex flex-col">
//                         <h3 className="font-semibold text-sm">{mentor.name}</h3>

//                         <p className="text-sm text-gray-600 mb-4 line-clamp-2">
//                           {mentor.bio ||
//                             "Helping professionals grow their careers through mentorship and guidance."}
//                         </p>
//                       </div>

//                       {/* Card Footer */}
//                       <div className="p-4 pt-2 border-t border-gray-200">
//                         <Button
//                           className="w-full bg-black hover:bg-gray-800 text-white transition-colors"
//                           onClick={() =>
//                             navigate(`/seeker/mentorprofile/${mentor.userId}`)
//                           }
//                         >
//                           View Profile
//                         </Button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MentorsList;
import React, { useState, useEffect } from "react";
import {
  Star,
  Calendar,
  MessageCircle,
  ExternalLink,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DummyProfileImg from "@/assets/DummyProfile.jpg";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllMentors } from "@/services/menteeService";
import { toast } from "react-hot-toast";

// Keeping your existing interface
interface Mentor {
  userId: string;
  mentorId: string;
  name: string;
  bio?: string;
  role: string;
  work: string;
  workRole: string;
  profileImage?: string;
  badge: string;
  isBlocked: boolean;
  isApproved: boolean | "Pending";
}

const MentorsList = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [mentors, setMentors] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const filters = [
    "All",
    "General QnA",
    "Mock Interview",
    "Resume Review",
    "Career Guide",
  ];

  useEffect(() => {
    const fetchMentors = async () => {
      setIsLoading(true);
      try {
        const fetchedMentors = await getAllMentors(activeFilter);
        console.log("Mentors fetched:", fetchedMentors);
        setMentors(fetchedMentors);
      } catch (error) {
        console.error("Failed to fetch mentors:", {
          message: error.message,
          stack: error.stack,
        });
        toast.error("Failed to load mentors. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, [activeFilter]);

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  // For demo purposes
  const expertiseAreas = [
    "Career Growth",
    "Interview Prep",
    "Leadership",
    "Resume Review",
    "Negotiation",
    "Tech Skills",
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex-1 max-w-7xl mx-auto">
        <div className="p-6">
          {/* Updated stylish header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Find Your Perfect Mentor
            </h1>
            <p className="text-gray-600">
              Connect with industry professionals ready to guide your career
              journey
            </p>
          </div>

          {/* Redesigned filter buttons */}
          <div className="flex items-center gap-3 mb-8 overflow-x-auto">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                className={`rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter
                    ? "bg-black text-white shadow-md"
                    : "border-gray-300 hover:border-black hover:bg-gray-50"
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100"
                >
                  <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
                  <div className="relative px-6">
                    <div className="w-20 h-20 rounded-full bg-gray-200 border-4 border-white absolute -top-10 animate-pulse" />
                  </div>
                  <div className="p-6 pt-12">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-48 mb-4" />
                    <Skeleton className="h-16 w-full mb-4" />
                    <div className="flex gap-2 mb-4">
                      <Skeleton className="h-8 w-20 rounded-full" />
                      <Skeleton className="h-8 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : mentors.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <p className="text-gray-500 text-lg mb-2">
                No mentors found for this category
              </p>
              <p className="text-gray-400 mb-4">
                Try selecting a different expertise area
              </p>
              <Button
                className="bg-black text-white hover:bg-gray-800"
                onClick={() => setActiveFilter("All")}
              >
                View all mentors
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mentors.map((mentor) => {
                // Using fixed values for demo
                const rating = "4.8";
                // Randomly select 2 expertise areas for each mentor
                const randomExpertise = expertiseAreas
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 2);

                return (
                  <div
                    key={mentor.userId}
                    className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300"
                    style={{
                      transform:
                        hoveredCard === mentor.userId
                          ? "translateY(-8px)"
                          : "translateY(0)",
                      boxShadow:
                        hoveredCard === mentor.userId
                          ? "0 20px 30px rgba(0, 0, 0, 0.08)"
                          : "0 4px 6px rgba(0, 0, 0, 0.03)",
                    }}
                    onMouseEnter={() => setHoveredCard(mentor.userId)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Gradient banner background */}
                    <div className="h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                    <div className="relative px-6">
                      {/* Profile image */}
                      <div className="absolute -top-12">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                          {!loadedImages[mentor.userId] && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                          )}
                          <img
                            src={mentor.profileImage || DummyProfileImg}
                            alt={mentor.name}
                            onLoad={() => handleImageLoad(mentor.userId)}
                            className={`w-full h-full object-cover transition-opacity duration-500 ${
                              loadedImages[mentor.userId]
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                        </div>

                        {/* Rating badge */}
                        <div className="absolute -right-2 -top-4">
                          <div className="flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-400 text-gray-900 shadow-sm">
                            <Star className="w-3 h-3 mr-1 fill-gray-900" />
                            {rating}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card content */}
                    <div className="p-6 pt-16">
                      {/* Name and title */}
                      <h3 className="font-bold text-lg text-gray-900">
                        {mentor.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <span className="font-medium">{mentor.workRole}</span>
                        <span className="mx-1">@</span>
                        <span className="text-gray-900 font-semibold">
                          {mentor.work}
                        </span>
                      </div>

                      {/* Bio */}
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {mentor.bio ||
                          "Helping professionals grow their careers through mentorship and guidance."}
                      </p>

                      {/* Expertise tags */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        {/* {randomExpertise.map((exp, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                          >
                            {exp}
                          </span>
                        ))} */}
                        <span className="px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
                          {mentor.badge || "Premium"}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-black hover:bg-gray-800 text-white transition-colors"
                          onClick={() =>
                            navigate(`/seeker/mentorprofile/${mentor.userId}`)
                          }
                        >
                          View Profile
                        </Button>
                        {/* <Button
                          variant="outline"
                          className="w-10 h-10 p-0 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                        >
                          <Bookmark className="w-4 h-4" />
                        </Button> */}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorsList;
