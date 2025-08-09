// import React, { useState, useEffect, useMemo } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Star, BookOpen, Clock, Award } from "lucide-react";
// import { getAllTutorials } from "@/services/menteeService";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";

// // Static course images - professional educational content
// const courseImages = [
//   "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2800&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2800&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2800&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2800&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1516321165247-7b389729b7c6?q=80&w=2800&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2800&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=2800&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1504707748692-419802cf939d?q=80&w=2800&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1516321497487-09736e785f47?q=80&w=2800&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1555066931-4365d14bab0c?q=80&w=2800&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2800&auto=format&fit=crop",
// ];

// export default function CoursesPage() {
//   const [activeFilter, setActiveFilter] = useState("All");
//   const [tutorials, setTutorials] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [hoveredCard, setHoveredCard] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalTutorials, setTotalTutorials] = useState(0);
//   const tutorialsPerPage = 12;
//   const navigate = useNavigate();

//   const filters = [
//     { display: "All", value: "All" },
//     { display: "Paid", value: "Paid" },
//     { display: "Free", value: "Free" },
//   ];

//   useEffect(() => {
//     const fetchTutorials = async () => {
//       setIsLoading(true);
//       try {
//         const { tutorials, total } = await getAllTutorials(
//           currentPage,
//           tutorialsPerPage,
//           activeFilter,
//           searchQuery
//         );
//         console.log("^^^^^^^^^^fetchTutorials tutorials....>>>", tutorials);

//         setTutorials(tutorials);
//         setTotalTutorials(total);
//       } catch (error: any) {
//         console.error("Failed to fetch tutorials:", error);
//         toast.error("Failed to load tutorials. Please try again.");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchTutorials();
//   }, [activeFilter, currentPage, searchQuery]);

//   const filteredTutorials = useMemo(() => {
//     return tutorials.filter((tutorial) => {
//       if (searchQuery) {
//         const query = searchQuery.toLowerCase();
//         return (
//           tutorial?.title?.toLowerCase().includes(query) ||
//           tutorial.shortDescription.toLowerCase().includes(query) ||
//           (tutorial.mentorId?.firstName &&
//             tutorial.mentorId.firstName.toLowerCase().includes(query)) ||
//           (tutorial.mentorId?.lastName &&
//             tutorial.mentorId.lastName.toLowerCase().includes(query))
//         );
//       }
//       return true;
//     });
//   }, [tutorials, searchQuery]);

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//     setCurrentPage(1); // Reset to first page on search
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const totalPages = Math.ceil(totalTutorials / tutorialsPerPage);

//   // Get course badge based on price
//   const getCourseBadge = (price) => {
//     if (price === 0)
//       return {
//         text: "Free",
//         bgColor: "bg-green-100",
//         textColor: "text-green-800",
//       };
//     if (price <= 500)
//       return {
//         text: "Affordable",
//         bgColor: "bg-blue-100",
//         textColor: "text-blue-800",
//       };
//     if (price <= 1000)
//       return {
//         text: "Standard",
//         bgColor: "bg-purple-100",
//         textColor: "text-purple-800",
//       };
//     return {
//       text: "Premium",
//       bgColor: "bg-amber-100",
//       textColor: "text-amber-800",
//     };
//   };

//   return (
//     <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//       <div className="flex-1 max-w-7xl mx-auto">
//         <div className="pt-0 p-6">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               Courses & Tutorials
//             </h1>
//             <p className="text-gray-600">
//               Explore top courses to enhance your skills and knowledge
//             </p>
//           </div>

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
//                 placeholder="Search by course title, description, or mentor..."
//                 value={searchQuery}
//                 onChange={handleSearch}
//                 className="w-full sm:w-64 rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
//               />
//             </TabsList>
//             {filters.map((filter) => (
//               <TabsContent key={filter.value} value={filter.value}>
//                 {isLoading ? (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                     {[...Array(8)].map((_, index) => (
//                       <div
//                         key={index}
//                         className="relative overflow-hidden rounded-xl border border-black"
//                       >
//                         <Skeleton className="w-full h-48" />
//                         <div className="p-4">
//                           <Skeleton className="h-6 w-3/4 mb-2" />
//                           <Skeleton className="h-4 w-1/2 mb-2" />
//                           <Skeleton className="h-4 w-1/4 mb-2" />
//                           <Skeleton className="h-4 w-full mb-4" />
//                           <Skeleton className="h-10 w-full rounded-md" />
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : filteredTutorials.length > 0 ? (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                     {filteredTutorials.map((tutorial, index) => {
//                       const badge = getCourseBadge(tutorial.amount);
//                       return (
//                         <div
//                           key={tutorial._id}
//                           className="relative overflow-hidden rounded-xl border border-black transition-all duration-300"
//                           style={{
//                             transform:
//                               hoveredCard === tutorial._id
//                                 ? "translateY(-5px)"
//                                 : "translateY(0)",
//                             boxShadow:
//                               hoveredCard === tutorial._id
//                                 ? "0 10px 30px rgba(0, 0, 0, 0.1)"
//                                 : "none",
//                           }}
//                           onMouseEnter={() => setHoveredCard(tutorial._id)}
//                           onMouseLeave={() => setHoveredCard(null)}
//                           onClick={() =>
//                             navigate(`/seeker/digitalcontent/${tutorial._id}`)
//                           }
//                         >
//                           <div className="relative">
//                             <img
//                               src={courseImages[index % courseImages.length]}
//                               alt={tutorial.title}
//                               className="w-full h-48 object-cover"
//                             />
//                             <div
//                               className={`absolute top-4 right-4 ${badge.bgColor} ${badge.textColor} px-3 py-1 rounded-full text-xs font-medium`}
//                             >
//                               {badge.text}
//                             </div>
//                           </div>
//                           <div className="p-5">
//                             <div className="flex justify-between items-start mb-2">
//                               <h3 className="font-bold text-lg line-clamp-2">
//                                 {tutorial.title}
//                               </h3>
//                               <div className="flex items-center gap-1 bg-black text-white rounded-full px-2 py-1">
//                                 <Star className="w-3 h-3 fill-white" />
//                                 <span className="text-xs">4.4</span>
//                               </div>
//                             </div>
//                             <p className="text-sm text-gray-600 mb-4">
//                               By{" "}
//                               <span className="font-medium">
//                                 {tutorial.mentorId?.firstName}{" "}
//                                 {tutorial.mentorId?.lastName}
//                               </span>
//                             </p>
//                             <div className="flex flex-wrap gap-2 mb-4">
//                               <div className="flex items-center text-xs bg-gray-100 px-3 py-1 rounded-full">
//                                 <BookOpen className="w-3 h-3 mr-1" />
//                                 {tutorial.seasonCount || 1} Seasons
//                               </div>
//                               <div className="flex items-center text-xs bg-gray-100 px-3 py-1 rounded-full">
//                                 <Clock className="w-3 h-3 mr-1" />
//                                 10+ Hours
//                               </div>
//                             </div>
//                             <div className="flex justify-between items-center mt-4">
//                               <div className="font-bold text-lg">
//                                 {tutorial.amount === 0
//                                   ? "Free"
//                                   : `₹${tutorial.amount}`}
//                               </div>
//                               <Button className="bg-black hover:bg-gray-800 text-white text-sm px-4 py-2">
//                                 View Course
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   <div className="text-center py-12 bg-white rounded-xl shadow-sm">
//                     <Award className="mx-auto h-12 w-12 text-gray-400" />
//                     <h3 className="mt-2 text-lg font-medium text-gray-900">
//                       No courses found
//                     </h3>
//                     <p className="mt-1 text-sm text-gray-500">
//                       There are no courses available for this category.
//                     </p>
//                     <div className="mt-6">
//                       <Button
//                         className="bg-black text-white hover:bg-gray-800"
//                         onClick={() => setActiveFilter("All")}
//                       >
//                         View all courses
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </TabsContent>
//             ))}
//             {filteredTutorials.length > 0 && (
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
// }
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  BookOpen,
  Clock,
  Award,
  Search,
  Filter,
  Play,
  Users,
  ChevronLeft,
  ChevronRight,
  Crown,
  Zap,
  Target,
  Eye,
  Heart,
  DollarSign,
  GraduationCap,
} from "lucide-react";
import { getAllTutorials } from "@/services/menteeService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// Better image handling approach - using a hash-based system for consistent images
const generateCourseImage = (courseId: string, index: number): string => {
  // Create a consistent hash from courseId for repeatable image selection
  const hash = courseId.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  const imageIndex = Math.abs(hash) % courseImages.length;
  return courseImages[imageIndex];
};

// Curated professional course images with educational themes
const courseImages = [
  "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1504707748692-419802cf939d?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
];

export default function CoursesPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [tutorials, setTutorials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTutorials, setTotalTutorials] = useState(0);
  const tutorialsPerPage = 12;
  const navigate = useNavigate();

  const filters = [
    {
      display: "All Courses",
      value: "All",
      icon: <Filter className="w-4 h-4" />,
    },
    { display: "Premium", value: "Paid", icon: <Crown className="w-4 h-4" /> },
    { display: "Free", value: "Free", icon: <Zap className="w-4 h-4" /> },
  ];

  useEffect(() => {
    const fetchTutorials = async () => {
      setIsLoading(true);
      try {
        const { tutorials, total } = await getAllTutorials(
          currentPage,
          tutorialsPerPage,
          activeFilter,
          searchQuery
        );
        console.log("^^^^^^^^^^fetchTutorials tutorials....>>>", tutorials);

        setTutorials(tutorials);
        setTotalTutorials(total);
      } catch (error: any) {
        console.error("Failed to fetch tutorials:", error);
        toast.error("Failed to load tutorials. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTutorials();
  }, [activeFilter, currentPage, searchQuery]);

  const filteredTutorials = useMemo(() => {
    return tutorials.filter((tutorial) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          tutorial?.title?.toLowerCase().includes(query) ||
          tutorial.shortDescription.toLowerCase().includes(query) ||
          (tutorial.mentorId?.firstName &&
            tutorial.mentorId.firstName.toLowerCase().includes(query)) ||
          (tutorial.mentorId?.lastName &&
            tutorial.mentorId.lastName.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [tutorials, searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalTutorials / tutorialsPerPage);

  // Enhanced course badge system
  const getCourseBadge = (price: number) => {
    if (price === 0)
      return {
        text: "Free",
        gradient: "bg-gradient-to-r from-green-500 to-emerald-500",
        textColor: "text-white",
        icon: <Zap className="w-3 h-3" />,
      };
    if (price <= 500)
      return {
        text: "Starter",
        gradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
        textColor: "text-white",
        icon: <Target className="w-3 h-3" />,
      };
    if (price <= 1000)
      return {
        text: "Pro",
        gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
        textColor: "text-white",
        icon: <Award className="w-3 h-3" />,
      };
    return {
      text: "Premium",
      gradient: "bg-gradient-to-r from-orange-500 to-red-500",
      textColor: "text-white",
      icon: <Crown className="w-3 h-3" />,
    };
  };

  const renderSkeletonCard = () => (
    <Card className="border-0 shadow-lg overflow-hidden bg-white rounded-2xl">
      <CardContent className="p-0">
        <Skeleton className="w-full h-48" />
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-1/2 mb-4" />
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full mb-4" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl">
      <div className="mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
          <GraduationCap className="w-12 h-12 text-purple-600" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        No Courses Found
      </h3>
      <p className="text-gray-600 text-center max-w-md mb-6">
        We couldn't find any courses matching your criteria. Try adjusting your
        filters or explore all courses.
      </p>
      <Button
        onClick={() => {
          setActiveFilter("All");
          setSearchQuery("");
        }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-6 py-3 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
      >
        <BookOpen className="w-5 h-5 mr-2" />
        View All Courses
      </Button>
    </div>
  );

  const renderCourseCard = (tutorial: any, index: number) => {
    const badge = getCourseBadge(tutorial.amount);
    const isHovered = hoveredCard === tutorial._id;
    const courseImage = generateCourseImage(tutorial._id, index);

    return (
      <Card
        key={tutorial._id}
        className={`group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl overflow-hidden cursor-pointer ${
          isHovered ? "transform -translate-y-2 scale-[1.02]" : ""
        }`}
        style={{ animationDelay: `${index * 100}ms` }}
        onMouseEnter={() => setHoveredCard(tutorial._id)}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={() => navigate(`/seeker/digitalcontent/${tutorial._id}`)}
      >
        <CardContent className="p-0">
          {/* Course Image */}
          <div className="relative overflow-hidden">
            <img
              src={courseImage}
              alt={tutorial.title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
            </div>

            {/* Badge */}
            <div className="absolute top-4 right-4">
              <Badge
                className={`${badge.gradient} ${badge.textColor} border-0 px-3 py-1 rounded-full text-xs font-semibold shadow-lg`}
              >
                <span className="flex items-center gap-1">
                  {badge.icon}
                  {badge.text}
                </span>
              </Badge>
            </div>

            {/* Rating */}
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-bold text-gray-900">4.8</span>
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="p-6 pt-2">
            {/* Title */}
            <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors duration-200">
              {tutorial.title}
            </h3>

            {/* Instructor */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {tutorial.mentorId?.firstName?.charAt(0) || "M"}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                By{" "}
                <span className="font-semibold text-gray-900">
                  {tutorial.mentorId?.firstName} {tutorial.mentorId?.lastName}
                </span>
              </span>
            </div>

            {/* Course Stats */}

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {tutorial.shortDescription ||
                "Master new skills with this comprehensive course designed for all levels."}
            </p>

            {/* Engagement Stats */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {tutorial.amount === 0 ? (
                  <span className="text-2xl font-bold text-green-600">
                    Free
                  </span>
                ) : (
                  <>
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{tutorial.amount}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <BookOpen className="w-3 h-3" />
                  <span>{tutorial.seasonCount || 1} Seasons</span>
                </div>
              </div>
            </div>

            {/* Price and Action */}
            <div className="flex justify-between items-center">
              <Button
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-6 py-2 font-semibold shadow-md transform hover:scale-105 transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/seeker/digitalcontent/${tutorial._id}`);
                }}
              >
                <Play className="w-4 h-4 mr-2" />
                Start Learning
              </Button>
            </div>
          </div>
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
                Courses & Tutorials
              </h1>
              <p className="text-gray-600 mt-2">
                Explore top courses to enhance your skills and advance your
                career
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Available Courses</p>
                    <p className="text-xl font-bold text-gray-900">
                      {totalTutorials}
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
              <TabsList className="bg-white h-14 shadow-md rounded-xl p-1.5 grid grid-cols-3 gap-1">
                {filters.map((filter) => (
                  <TabsTrigger
                    key={filter.value}
                    value={filter.value}
                    className="rounded-lg px-6 py-2.5 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                  >
                    {filter.icon}
                    <span className="ml-2">{filter.display}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search courses, instructors, or topics..."
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
              ) : filteredTutorials.length === 0 ? (
                renderEmptyState()
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTutorials.map((tutorial, index) =>
                      renderCourseCard(tutorial, index)
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
}
