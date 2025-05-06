// import React, { useState, useEffect } from "react";
// import { Search } from "lucide-react";
// import { Input } from "@/components/ui/input";
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

//   // Generate random number of bookings
//   const getRandomBookings = () => {
//     return Math.floor(Math.random() * 1500) + 50;
//   };

//   // Generate random rating (between 3.5 and 5.0)
//   const getRandomRating = () => {
//     return (Math.random() * 1.5 + 3.5).toFixed(1);
//   };

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

//           <div className="p-6 rounded-xl shadow-sm">
//             <h2 className="text-2xl font-bold mb-6 text-gray-800">
//               Top Mentors
//             </h2>
//             {isLoading ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {[...Array(8)].map((_, index) => (
//                   <div
//                     key={index}
//                     className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
//                   >
//                     <div className="p-4">
//                       <Skeleton className="w-16 h-16 rounded-full" />
//                       <div className="mt-3 space-y-2">
//                         <Skeleton className="h-5 w-3/4" />
//                         <Skeleton className="h-4 w-1/2" />
//                         <Skeleton className="h-4 w-full" />
//                       </div>
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
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
//                 {mentors.map((mentor) => {
//                   const bookings = getRandomBookings();
//                   const rating = getRandomRating();

//                   return (
//                     <div
//                       key={mentor.userId}
//                       className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200"
//                     >
//                       <div className="p-4">
//                         <div className="flex items-start gap-4">
//                           <div className="relative w-16 h-16 flex-shrink-0">
//                             {!loadedImages[mentor.userId] && (
//                               <Skeleton className="absolute inset-0 w-full h-full rounded-full animate-pulse" />
//                             )}
//                             <img
//                               src={mentor.profileImage || DummyProfileImg}
//                               alt={mentor.name}
//                               onLoad={() => handleImageLoad(mentor.userId)}
//                               className={`w-full h-full object-cover rounded-full transition-opacity duration-500 ${
//                                 loadedImages[mentor.userId]
//                                   ? "opacity-100"
//                                   : "opacity-0"
//                               }`}
//                             />
//                           </div>
//                           <div className="flex-1">
//                             <h3 className="font-bold text-lg text-gray-800">
//                               {mentor.name}
//                             </h3>
//                             <div className="flex items-center mt-1">
//                               <svg
//                                 className="w-5 h-5 text-black"
//                                 fill="currentColor"
//                                 viewBox="0 0 20 20"
//                               >
//                                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                               </svg>
//                               <span className="ml-1 font-semibold">
//                                 {rating}/5
//                               </span>
//                             </div>
//                             <p className="text-sm text-gray-600 mt-1 line-clamp-2">
//                               {mentor.bio ||
//                                 "Helping people with their career goals"}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="mt-4 flex gap-2">
//                           <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-800 text-sm">
//                             {bookings}+ bookings
//                           </div>
//                           <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-800 text-sm">
//                             1:1 Call
//                           </div>
//                         </div>

//                         <div className="mt-2">
//                           <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-800 text-sm">
//                             Priority DM
//                           </div>
//                         </div>

//                         <div className="mt-6 flex justify-end">
//                           <Button
//                             className="bg-black text-white hover:bg-gray-800 rounded-lg px-6 py-2"
//                             onClick={() =>
//                               navigate(`/seeker/mentorprofile/${mentor.userId}`)
//                             }
//                           >
//                             See Profile
//                           </Button>
//                         </div>
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
import { Search, MessageCircle, Calendar, Star, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DummyProfileImg from "@/assets/DummyProfile.jpg";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllMentors } from "@/services/menteeService";
import { toast } from "react-hot-toast";

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

const MentorsList: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
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
      } catch (error: any) {
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

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  // Fixed values for all cards
  const rating = "4.8";
  const expertise = "Career Guide";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 max-w-7xl mx-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Find a Mentor</h1>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search mentors..."
                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6 overflow-x-auto">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                className={`rounded-full ${
                  activeFilter === filter
                    ? "bg-black text-white"
                    : "border-gray-300"
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </Button>
            ))}
          </div>

          <div className="p-6 rounded-xl bg-white shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Top Mentors
            </h2>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-xl border border-black"
                  >
                    <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gray-50">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <div className="p-5">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <div className="space-y-3 mt-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-5 w-12" />
                      </div>
                    </div>
                    <div className="p-4 pt-2 border-t border-gray-200">
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            ) : mentors.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No mentors found for this category.
                </p>
                <Button
                  className="mt-4 bg-black text-white hover:bg-gray-800"
                  onClick={() => setActiveFilter("All")}
                >
                  View all mentors
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mentors.map((mentor) => {
                  // Using fixed values instead of random ones

                  return (
                    <div
                      key={mentor.userId}
                      className="relative overflow-hidden rounded-xl border border-black transition-all duration-300"
                      style={{
                        transform:
                          hoveredCard === mentor.userId
                            ? "translateY(-5px)"
                            : "translateY(0)",
                        boxShadow:
                          hoveredCard === mentor.userId
                            ? "0 10px 30px rgba(0, 0, 0, 0.1)"
                            : "none",
                      }}
                      onMouseEnter={() => setHoveredCard(mentor.userId)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      {/* Card Header with Mentor Info */}
                      <div className="flex flex-col items-center gap-3 p-4 border-b border-gray-200 bg-gray-50">
                        <div className="relative">
                          {!loadedImages[mentor.userId] && (
                            <Skeleton className="absolute inset-0 w-16 h-16 rounded-full animate-pulse" />
                          )}
                          <div className="w-32 h-32 rounded-full border-2 border-black bg-gray-100 overflow-hidden">
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
                          <div className="absolute -top-3 -right-14">
                            <div className="flex-shrink-0 flex items-center px-3 py-1 ml-4 rounded-full text-xs font-medium bg-black text-white">
                              {/* <MessageCircle className="w-4 h-4" /> */}
                              <Star className="w-3 h-3 mr-1 fill-white" />
                              {rating}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center w-full">
                          {/* Left: Role @ Company */}
                          <div className="flex items-center gap-1 overflow-hidden whitespace-nowrap text-ellipsis">
                            <p className="text-xs text-gray-600">
                              {mentor.workRole}
                            </p>
                            <span className="text-xs text-gray-400">@</span>
                            <p className="text-sm font-semibold text-ellipsis overflow-hidden">
                              {mentor.work}
                            </p>
                          </div>

                          {/* Right: Rating */}
                          {/* <div className="flex-shrink-0 flex items-center px-3 py-1 ml-4 rounded-full text-xs font-medium bg-black text-white">
                            <Star className="w-3 h-3 mr-1 fill-white" />
                            {rating}
                          </div> */}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-semibold text-sm">{mentor.name}</h3>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {mentor.bio ||
                            "Helping professionals grow their careers through mentorship and guidance."}
                        </p>

                        <div className="mb-4">
                          <span className="inline-block bg-gray-100 text-xs px-3 py-1 rounded-full font-medium">
                            {mentor.badge || expertise}
                          </span>
                        </div>
                        {/* 
                        <div className="space-y-3 mt-auto">
                          <div className="mt-4 flex gap-2">
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-800 text-sm">
                              1:1 Call
                            </div>
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-800 text-sm">
                              Priority DM
                            </div>
                          </div>
                        </div> */}
                      </div>

                      {/* Card Footer */}
                      <div className="p-4 pt-2 border-t border-gray-200">
                        <Button
                          className="w-full bg-black hover:bg-gray-800 text-white transition-colors"
                          onClick={() =>
                            navigate(`/seeker/mentorprofile/${mentor.userId}`)
                          }
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorsList;
