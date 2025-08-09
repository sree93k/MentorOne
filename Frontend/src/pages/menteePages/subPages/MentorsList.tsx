// import React, { useState, useEffect, useMemo } from "react";
// import { Star, MessageCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useNavigate } from "react-router-dom";
// import { getAllMentors } from "@/services/menteeService";
// import { toast } from "react-hot-toast";
// // Add this import for secure image loading
// import { ProfilePicture } from "@/components/users/SecureMedia";

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

// const MentorsList = () => {
//   const [activeFilter, setActiveFilter] = useState("All");
//   const [isLoading, setIsLoading] = useState(true);
//   const [mentors, setMentors] = useState<Mentor[]>([]);
//   const [hoveredCard, setHoveredCard] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalMentors, setTotalMentors] = useState(0);
//   const mentorsPerPage = 12;
//   const navigate = useNavigate();

//   const filters = [
//     { display: "All", value: "All" },
//     { display: "School Student", value: "School Student" },
//     { display: "College Student", value: "College Student" },
//     { display: "Professional", value: "Professional" },
//   ];

//   useEffect(() => {
//     const fetchMentors = async () => {
//       setIsLoading(true);
//       try {
//         const response = await getAllMentors(
//           currentPage,
//           mentorsPerPage,
//           activeFilter,
//           searchQuery
//         );
//         setMentors(response.mentors);
//         setTotalMentors(response.total);
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
//   }, [activeFilter, currentPage, searchQuery]);

//   const filteredMentors = useMemo(() => {
//     return mentors.filter((mentor) => {
//       if (searchQuery) {
//         const query = searchQuery.toLowerCase();
//         return (
//           mentor.name.toLowerCase().includes(query) ||
//           (mentor.bio && mentor.bio.toLowerCase().includes(query)) ||
//           mentor.work.toLowerCase().includes(query) ||
//           mentor.workRole.toLowerCase().includes(query)
//         );
//       }
//       return true;
//     });
//   }, [mentors, searchQuery]);

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//     setCurrentPage(1); // Reset to first page on search
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const totalPages = Math.ceil(totalMentors / mentorsPerPage);

//   return (
//     <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//       <div className="flex-1 max-w-7xl mx-auto">
//         <div className="pt-0 p-6">
//           {/* Header */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               Find Your Perfect Mentor
//             </h1>
//             <p className="text-gray-600">
//               Connect with industry professionals ready to guide your career
//               journey
//             </p>
//           </div>

//           {/* Tabs and Search */}
//           <Tabs defaultValue="All" onValueChange={setActiveFilter}>
//             <TabsList className="flex justify-between items-center mb-6 gap-3 border-b border-gray-200 rounded-none w-full pb-6">
//               <div className="flex gap-3">
//                 {filters.map((filter) => (
//                   <TabsTrigger
//                     key={filter.value}
//                     value={filter.value}
//                     className={`rounded-full px-4 py-1 border border-black transition-colors duration-200
//                       ${
//                         activeFilter === filter.value
//                           ? "bg-black text-white"
//                           : "bg-white text-black"
//                       }
//                       hover:bg-black hover:text-white`}
//                   >
//                     {filter.display}
//                   </TabsTrigger>
//                 ))}
//               </div>
//               <Input
//                 type="text"
//                 placeholder="Search by mentor name, bio, or work..."
//                 value={searchQuery}
//                 onChange={handleSearch}
//                 className="w-full sm:w-64 rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
//               />
//             </TabsList>
//             {filters.map((filter) => (
//               <TabsContent key={filter.value} value={filter.value}>
//                 {isLoading ? (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                     {[...Array(6)].map((_, index) => (
//                       <div
//                         key={index}
//                         className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100"
//                       >
//                         <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
//                         <div className="relative px-6">
//                           <div className="w-20 h-20 rounded-full bg-gray-200 border-4 border-white absolute -top-10 animate-pulse" />
//                         </div>
//                         <div className="p-6 pt-12">
//                           <Skeleton className="h-6 w-32 mb-2" />
//                           <Skeleton className="h-4 w-48 mb-4" />
//                           <Skeleton className="h-16 w-full mb-4" />
//                           <div className="flex gap-2 mb-4">
//                             <Skeleton className="h-8 w-20 rounded-full" />
//                             <Skeleton className="h-8 w-20 rounded-full" />
//                           </div>
//                           <Skeleton className="h-10 w-full rounded-md" />
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : filteredMentors.length === 0 ? (
//                   <div className="text-center py-12 bg-white rounded-xl shadow-sm">
//                     <div className="mb-4">
//                       <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100">
//                         <MessageCircle className="w-8 h-8 text-gray-400" />
//                       </div>
//                     </div>
//                     <p className="text-gray-500 text-lg mb-2">
//                       No mentors found for this category
//                     </p>
//                     <p className="text-gray-400 mb-4">
//                       Try selecting a different role
//                     </p>
//                     <Button
//                       className="bg-black text-white hover:bg-gray-800"
//                       onClick={() => setActiveFilter("All")}
//                     >
//                       View all mentors
//                     </Button>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                     {filteredMentors.map((mentor) => {
//                       const rating = "4.8"; // Fixed for demo
//                       return (
//                         <div
//                           key={mentor.userId}
//                           className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300"
//                           style={{
//                             transform:
//                               hoveredCard === mentor.userId
//                                 ? "translateY(-8px)"
//                                 : "translateY(0)",
//                             boxShadow:
//                               hoveredCard === mentor.userId
//                                 ? "0 20px 30px rgba(0, 0, 0, 0.08)"
//                                 : "0 4px 6px rgba(0, 0, 0, 0.03)",
//                           }}
//                           onMouseEnter={() => setHoveredCard(mentor.userId)}
//                           onMouseLeave={() => setHoveredCard(null)}
//                         >
//                           <div className="h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
//                           <div className="relative px-6 ">
//                             <div className="absolute -top-16">
//                               <div className="relative">
//                                 {/* Replace the img tag with ProfilePicture component */}
//                                 <ProfilePicture
//                                   profilePicture={mentor.profileImage}
//                                   userName={mentor.name}
//                                   size="xl"
//                                   className="w-24 h-24 border-4 border-white shadow-md"
//                                 />
//                                 <div className="absolute -right-2 -top-4">
//                                   <div className="flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-400 text-gray-900 shadow-sm">
//                                     <Star className="w-3 h-3 mr-1 fill-gray-900" />
//                                     {rating}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="p-6 pt-16">
//                             <h3 className="font-bold text-lg text-gray-900">
//                               {mentor.name}
//                             </h3>
//                             <div className="flex items-center text-sm text-gray-600 mb-3">
//                               <span className="font-medium">
//                                 {mentor.workRole}
//                               </span>
//                               <span className="mx-1">@</span>
//                               <span className="text-gray-900 font-semibold">
//                                 {mentor.work}
//                               </span>
//                             </div>
//                             <p className="text-gray-600 mb-4 line-clamp-3">
//                               {mentor.bio ||
//                                 "Helping professionals grow their careers through mentorship and guidance."}
//                             </p>
//                             <div className="flex flex-wrap gap-2 mb-5">
//                               <span className="px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
//                                 {mentor.badge || "Premium"}
//                               </span>
//                             </div>
//                             <div className="flex gap-2">
//                               <Button
//                                 className="flex-1 bg-black hover:bg-gray-800 text-white transition-colors"
//                                 onClick={() =>
//                                   navigate(
//                                     `/seeker/mentorprofile/${mentor.userId}`
//                                   )
//                                 }
//                                 disabled={
//                                   mentor.isBlocked ||
//                                   mentor.isApproved !== "Approved"
//                                 }
//                               >
//                                 View Profile
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </TabsContent>
//             ))}
//             {/* Pagination */}
//             {filteredMentors.length !== 0 && (
//               <div className="flex justify-center gap-2 mt-6">
//                 <Button
//                   disabled={currentPage === 1}
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   className="bg-black text-white hover:bg-gray-800"
//                 >
//                   Previous
//                 </Button>
//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                   (page) => (
//                     <Button
//                       key={page}
//                       variant={currentPage === page ? "default" : "outline"}
//                       onClick={() => handlePageChange(page)}
//                       className={
//                         currentPage === page
//                           ? "bg-black text-white"
//                           : "border-gray-300 hover:bg-gray-50"
//                       }
//                     >
//                       {page}
//                     </Button>
//                   )
//                 )}
//                 <Button
//                   disabled={currentPage === totalPages}
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   className="bg-black text-white hover:bg-gray-800"
//                 >
//                   Next
//                 </Button>
//               </div>
//             )}
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MentorsList;
import React, { useState, useEffect, useMemo } from "react";
import {
  Star,
  MessageCircle,
  Search,
  Filter,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  Eye,
  Heart,
  TrendingUp,
  BookOpen,
  Target,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { getAllMentors } from "@/services/menteeService";
import { toast } from "react-hot-toast";
import { ProfilePicture } from "@/components/users/SecureMedia";

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
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMentors, setTotalMentors] = useState(0);
  const mentorsPerPage = 12;
  const navigate = useNavigate();

  const filters = [
    {
      display: "All Mentors",
      value: "All",
      icon: <Filter className="w-4 h-4" />,
    },
    {
      display: "School Student",
      value: "School Student",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      display: "College Student",
      value: "College Student",
      icon: <Target className="w-4 h-4" />,
    },
    {
      display: "Professional",
      value: "Professional",
      icon: <Award className="w-4 h-4" />,
    },
  ];

  useEffect(() => {
    const fetchMentors = async () => {
      setIsLoading(true);
      try {
        const response = await getAllMentors(
          currentPage,
          mentorsPerPage,
          activeFilter,
          searchQuery
        );
        setMentors(response.mentors);
        setTotalMentors(response.total);
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
  }, [activeFilter, currentPage, searchQuery]);

  const filteredMentors = useMemo(() => {
    return mentors.filter((mentor) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          mentor.name.toLowerCase().includes(query) ||
          (mentor.bio && mentor.bio.toLowerCase().includes(query)) ||
          mentor.work.toLowerCase().includes(query) ||
          mentor.workRole.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [mentors, searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalMentors / mentorsPerPage);

  // Get badge configuration
  const getBadgeConfig = (badge: string) => {
    switch (badge.toLowerCase()) {
      case "premium":
        return {
          color: "bg-gradient-to-r from-purple-500 to-blue-500",
          icon: <Crown className="w-3 h-3" />,
          textColor: "text-white",
        };
      case "expert":
        return {
          color: "bg-gradient-to-r from-orange-500 to-red-500",
          icon: <Award className="w-3 h-3" />,
          textColor: "text-white",
        };
      case "trending":
        return {
          color: "bg-gradient-to-r from-green-500 to-emerald-500",
          icon: <TrendingUp className="w-3 h-3" />,
          textColor: "text-white",
        };
      default:
        return {
          color: "bg-gradient-to-r from-gray-500 to-gray-600",
          icon: <Sparkles className="w-3 h-3" />,
          textColor: "text-white",
        };
    }
  };

  const renderSkeletonCard = () => (
    <Card className="border-0 shadow-lg overflow-hidden bg-white">
      <CardContent className="p-0">
        <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex-1">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-16 w-full mb-4" />
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl">
      <div className="mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
          <Users className="w-12 h-12 text-purple-600" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        No Mentors Found
      </h3>
      <p className="text-gray-600 text-center max-w-md mb-6">
        We couldn't find any mentors matching your criteria. Try adjusting your
        filters or search terms.
      </p>
      <Button
        onClick={() => {
          setActiveFilter("All");
          setSearchQuery("");
        }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-6 py-3 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
      >
        <Filter className="w-5 h-5 mr-2" />
        View All Mentors
      </Button>
    </div>
  );

  const renderMentorCard = (mentor: Mentor, index: number) => {
    const rating = "4.8"; // Fixed for demo
    const badgeConfig = getBadgeConfig(mentor.badge);
    const isHovered = hoveredCard === mentor.userId;

    return (
      <Card
        key={mentor.userId}
        className={`group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl overflow-hidden ${
          isHovered ? "transform -translate-y-2 scale-[1.02]" : ""
        }`}
        style={{ animationDelay: `${index * 100}ms` }}
        onMouseEnter={() => setHoveredCard(mentor.userId)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <CardContent className="p-0">
          {/* Header with gradient background */}
          <div className="h-20 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
            <div className="absolute top-3 right-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-white text-xs font-bold">{rating}</span>
              </div>
            </div>
          </div>

          {/* Profile section */}
          <div className="px-2 pb-6">
            {/* Profile picture and basic info */}
            <div className="flex items-start gap-2 -mt-8 mb-4">
              <div className="relative ">
                <ProfilePicture
                  profilePicture={mentor.profileImage}
                  userName={mentor.name}
                  size="xl"
                  className="w-16 h-16 border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1">
                  <div
                    className={`${badgeConfig.color} p-1.5 rounded-full shadow-md`}
                  >
                    {badgeConfig.icon}
                  </div>
                </div>
              </div>

              <div className="flex-1 mt-10">
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  {mentor.name}
                </h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span className="font-semibold text-purple-600">
                    {mentor.workRole}
                  </span>
                  <span className="mx-2 text-gray-400">@</span>
                  <span className="font-medium text-gray-800">
                    {mentor.work}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6">
              {/* Bio */}
              <p className=" text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {mentor.bio ||
                  "Helping professionals grow their careers through mentorship and guidance."}
              </p>

              {/* Badge and stats */}
              <div className="flex items-center justify-between mb-5">
                <Badge
                  className={`${badgeConfig.color} ${badgeConfig.textColor} border-0 px-3 py-1 rounded-full text-xs font-semibold`}
                >
                  <span className="flex items-center gap-1">
                    {badgeConfig.icon}
                    {mentor.badge || "Premium"}
                  </span>
                </Badge>

                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>2.1k</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    <span>342</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={() =>
                    navigate(`/seeker/mentorprofile/${mentor.userId}`)
                  }
                  disabled={
                    mentor.isBlocked || mentor.isApproved !== "Approved"
                  }
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Profile
                </Button>

                <Button
                  variant="outline"
                  className="px-4 rounded-xl border-2 border-purple-200 text-purple-600 hover:bg-purple-50 transition-all duration-200"
                  disabled={
                    mentor.isBlocked || mentor.isApproved !== "Approved"
                  }
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Hover overlay effect */}
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-purple-600/5 pointer-events-none transition-opacity duration-300"></div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center mt-12 gap-2">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          className="rounded-xl hover:bg-purple-50 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  variant={currentPage === page ? "default" : "outline"}
                  className={`rounded-xl min-w-[40px] ${
                    currentPage === page
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                      : "hover:bg-purple-50"
                  }`}
                >
                  {page}
                </Button>
              );
            } else if (page === currentPage - 2 || page === currentPage + 2) {
              return (
                <span key={page} className="px-2 py-1">
                  ...
                </span>
              );
            }
            return null;
          })}
        </div>

        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          className="rounded-xl hover:bg-purple-50 disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-8 py-1">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Find Your Perfect Mentor
              </h1>
              <p className="text-gray-600 mt-2">
                Connect with industry professionals ready to guide your career
                journey
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Available Mentors</p>
                    <p className="text-xl font-bold text-gray-900">
                      {totalMentors}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="All" onValueChange={setActiveFilter}>
          {/* Filters and Search */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <TabsList className="bg-white h-14 shadow-md rounded-xl p-1.5 grid grid-cols-4 gap-1">
                {filters.map((filter) => (
                  <TabsTrigger
                    key={filter.value}
                    value={filter.value}
                    className="rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                  >
                    {filter.icon}
                    <span className="ml-2">{filter.display}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search mentors by name, bio, or company..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-12 pr-4 py-3 rounded-xl border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          {filters.map((filter) => (
            <TabsContent key={filter.value} value={filter.value}>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index}>{renderSkeletonCard()}</div>
                  ))}
                </div>
              ) : filteredMentors.length === 0 ? (
                renderEmptyState()
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredMentors.map((mentor, index) =>
                      renderMentorCard(mentor, index)
                    )}
                  </div>
                  {renderPagination()}
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default MentorsList;
