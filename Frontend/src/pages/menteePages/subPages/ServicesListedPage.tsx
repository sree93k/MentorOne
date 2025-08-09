// "use client";

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Star, Clock, Code, Palette, Megaphone, Award } from "lucide-react";
// import { getAllServices } from "@/services/menteeService";
// import { toast } from "react-hot-toast";

// interface Service {
//   _id: string;
//   title: string;
//   shortDescription: string;
//   amount: number;
//   duration: number;
//   type: string;
//   technology?: string;
//   digitalProductType?: string;
//   oneToOneType?: string;
//   mentorId: {
//     _id: string;
//     firstName: string;
//     lastName: string;
//     profilePicture: string;
//   };
//   bookingCount: number;
//   averageRating: number;
// }

// const serviceIcons: { [key: string]: React.ComponentType } = {
//   "1-1Call": Code,
//   priorityDM: Megaphone,
//   DigitalProducts: Palette,
// };

// const categories = [
//   "All",
//   "1:1 Chat",
//   "Videocall",
//   "Priority DM",
//   "Digital Books",
//   "Tutorials",
// ];

// export default function ServicesListing() {
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [services, setServices] = useState<Service[]>([]);
//   const [totalServices, setTotalServices] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const limit = 12;

//   useEffect(() => {
//     fetchServices();
//   }, [selectedCategory, searchQuery, currentPage]);

//   const fetchServices = async () => {
//     setLoading(true);
//     try {
//       let typeFilter: string | undefined;
//       let subTypeFilter: {
//         oneToOneType?: string;
//         digitalProductType?: string;
//       } = {};

//       switch (selectedCategory) {
//         case "1:1 Chat":
//           typeFilter = "1-1Call";
//           subTypeFilter.oneToOneType = "chat";
//           break;
//         case "Videocall":
//           typeFilter = "1-1Call";
//           subTypeFilter.oneToOneType = "video";
//           break;
//         case "Priority DM":
//           typeFilter = "priorityDM";
//           break;
//         case "Digital Books":
//           typeFilter = "DigitalProducts";
//           subTypeFilter.digitalProductType = "documents";
//           break;
//         case "Tutorials":
//           typeFilter = "DigitalProducts";
//           subTypeFilter.digitalProductType = "videoTutorials";
//           break;
//         default:
//           typeFilter = undefined;
//       }

//       const response = await getAllServices(
//         currentPage,
//         limit,
//         typeFilter,
//         searchQuery,
//         subTypeFilter.oneToOneType,
//         subTypeFilter.digitalProductType
//       );

//       console.log("RESPONSES getAllServices >>>", response);

//       setServices(response?.services);
//       setTotalServices(response.total);
//     } catch (error: any) {
//       toast.error("Failed to fetch services: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleCategoryChange = (category: string) => {
//     setSelectedCategory(category);
//     setCurrentPage(1);
//   };

//   const handlePageChange = (newPage: number) => {
//     setCurrentPage(newPage);
//   };

//   const handleCardClick = (service: Service) => {
//     navigate(`/seeker/mentorservice/`, {
//       state: {
//         service,
//         mentor: {
//           _id: service.mentorId._id,
//           userData: service.mentorId._id,
//           firstName: service.mentorId.firstName,
//           lastName: service.mentorId.lastName,
//           profilePicture: service.mentorId.profilePicture,
//         },
//       },
//     });
//   };

//   const totalPages = Math.ceil(totalServices / limit);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto">
//         <main className="flex-1 p-8 pt-0">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               Professional Services
//             </h1>
//             <p className="text-gray-600">
//               Discover expert services to grow your skills and career
//             </p>
//           </div>

//           {/* Filters and Search */}
//           <div className="flex items-center justify-between mb-8">
//             <div className="flex flex-wrap space-x-2">
//               {categories.map((category) => (
//                 <Button
//                   key={category}
//                   variant={
//                     selectedCategory === category ? "default" : "outline"
//                   }
//                   size="sm"
//                   onClick={() => handleCategoryChange(category)}
//                   className={
//                     selectedCategory === category ? "bg-black text-white" : ""
//                   }
//                 >
//                   {category}
//                 </Button>
//               ))}
//             </div>
//             <Input
//               type="text"
//               placeholder="Search by service title, description, or mentor..."
//               value={searchQuery}
//               onChange={handleSearch}
//               className="w-full sm:w-64 rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
//             />
//           </div>

//           {/* Services Grid */}
//           {loading ? (
//             <p>Loading services...</p>
//           ) : services.length === 0 ? (
//             <div className="text-center py-12 bg-white rounded-xl shadow-sm">
//               <Award className="mx-auto h-12 w-12 text-gray-400" />
//               <h3 className="mt-2 text-lg font-medium text-gray-900">
//                 No services found
//               </h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 There are no services available for this category.
//               </p>
//               <div className="mt-6">
//                 <Button
//                   className="bg-black text-white hover:bg-gray-800"
//                   onClick={() => handleCategoryChange("All")}
//                 >
//                   View all services
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
//               {services.map((service) => {
//                 const IconComponent = serviceIcons[service.type] || Code;
//                 return (
//                   <Card
//                     key={service._id}
//                     className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md cursor-pointer"
//                     onClick={() => handleCardClick(service)}
//                   >
//                     <CardHeader className="pb-3">
//                       <div className="flex items-start justify-between mb-3">
//                         <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
//                           <IconComponent className="w-6 h-6 text-gray-700" />
//                         </div>
//                         {service.averageRating > 4.5 && (
//                           <Badge
//                             variant="secondary"
//                             className="bg-amber-100 text-amber-800 border-amber-200"
//                           >
//                             Top Rated
//                           </Badge>
//                         )}
//                       </div>
//                       <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
//                         {service.title}
//                       </CardTitle>
//                       <CardDescription className="text-sm text-gray-600 line-clamp-2">
//                         {service.shortDescription}
//                       </CardDescription>
//                     </CardHeader>

//                     <CardContent className="pb-3">
//                       <div className="flex items-center space-x-2 mb-3">
//                         <Avatar className="w-6 h-6">
//                           <AvatarImage src={service.mentorId.profilePicture} />
//                           <AvatarFallback>
//                             {service.mentorId.firstName.charAt(0)}
//                           </AvatarFallback>
//                         </Avatar>
//                         <span className="text-sm text-gray-600 truncate">
//                           {`${service.mentorId.firstName} ${service.mentorId.lastName}`}
//                         </span>
//                       </div>

//                       <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
//                         <div className="flex items-center space-x-1">
//                           <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
//                           <span className="font-medium">
//                             {service.averageRating.toFixed(1)}
//                           </span>
//                           <span>({service.bookingCount})</span>
//                         </div>
//                         <div className="flex items-center space-x-1">
//                           <Clock className="w-3 h-3" />
//                           <span>{service.duration} min</span>
//                         </div>
//                       </div>

//                       {service.technology && (
//                         <div className="flex flex-wrap gap-1 mb-3">
//                           <Badge
//                             variant="outline"
//                             className="text-xs px-2 py-0"
//                           >
//                             {service.technology}
//                           </Badge>
//                         </div>
//                       )}
//                     </CardContent>

//                     <CardFooter className="pt-0">
//                       <div className="flex items-center justify-between w-full">
//                         <div className="text-lg font-bold text-gray-900">
//                           ₹{service.amount}
//                         </div>
//                         <Button
//                           size="sm"
//                           className="bg-black hover:bg-gray-800 text-white"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleCardClick(service);
//                           }}
//                         >
//                           View Details
//                         </Button>
//                       </div>
//                     </CardFooter>
//                   </Card>
//                 );
//               })}
//             </div>
//           )}

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-center space-x-2">
//               <Button
//                 variant="outline"
//                 disabled={currentPage === 1}
//                 onClick={() => handlePageChange(currentPage - 1)}
//               >
//                 Previous
//               </Button>
//               {[...Array(totalPages)].map((_, index) => (
//                 <Button
//                   key={index + 1}
//                   variant={currentPage === index + 1 ? "default" : "outline"}
//                   className={
//                     currentPage === index + 1 ? "bg-black text-white" : ""
//                   }
//                   onClick={() => handlePageChange(index + 1)}
//                 >
//                   {index + 1}
//                 </Button>
//               ))}
//               <Button
//                 variant="outline"
//                 disabled={currentPage === totalPages}
//                 onClick={() => handlePageChange(currentPage + 1)}
//               >
//                 Next
//               </Button>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Star,
  Clock,
  Code,
  Video,
  MessageSquare,
  FileText,
  Award,
  Search,
  Filter,
  Crown,
  Target,
  TrendingUp,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getAllServices } from "@/services/menteeService";
import { toast } from "react-hot-toast";

interface Service {
  _id: string;
  title: string;
  shortDescription: string;
  amount: number;
  duration: number;
  type: string;
  technology?: string;
  digitalProductType?: string;
  oneToOneType?: string;
  mentorId: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
  };
  bookingCount: number;
  averageRating: number;
}

const serviceIcons: { [key: string]: React.ComponentType<any> } = {
  "1-1Call": Video,
  priorityDM: MessageSquare,
  DigitalProducts: FileText,
};

const categories = [
  {
    display: "All Services",
    value: "All",
    icon: <Filter className="w-4 h-4" />,
  },
  {
    display: "1:1 Chat",
    value: "1:1 Chat",
    icon: <MessageSquare className="w-4 h-4" />,
  },
  {
    display: "Video Call",
    value: "Videocall",
    icon: <Video className="w-4 h-4" />,
  },
  {
    display: "Priority DM",
    value: "Priority DM",
    icon: <Target className="w-4 h-4" />,
  },
  {
    display: "Digital Books",
    value: "Digital Books",
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    display: "Tutorials",
    value: "Tutorials",
    icon: <Code className="w-4 h-4" />,
  },
];

export default function ServicesListing() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [totalServices, setTotalServices] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const navigate = useNavigate();
  const limit = 12;

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, searchQuery, currentPage]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      let typeFilter: string | undefined;
      let subTypeFilter: {
        oneToOneType?: string;
        digitalProductType?: string;
      } = {};

      switch (selectedCategory) {
        case "1:1 Chat":
          typeFilter = "1-1Call";
          subTypeFilter.oneToOneType = "chat";
          break;
        case "Videocall":
          typeFilter = "1-1Call";
          subTypeFilter.oneToOneType = "video";
          break;
        case "Priority DM":
          typeFilter = "priorityDM";
          break;
        case "Digital Books":
          typeFilter = "DigitalProducts";
          subTypeFilter.digitalProductType = "documents";
          break;
        case "Tutorials":
          typeFilter = "DigitalProducts";
          subTypeFilter.digitalProductType = "videoTutorials";
          break;
        default:
          typeFilter = undefined;
      }

      const response = await getAllServices(
        currentPage,
        limit,
        typeFilter,
        searchQuery,
        subTypeFilter.oneToOneType,
        subTypeFilter.digitalProductType
      );

      console.log("RESPONSES getAllServices >>>", response);

      setServices(response?.services);
      setTotalServices(response.total);
    } catch (error: any) {
      toast.error("Failed to fetch services: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleCardClick = (service: Service) => {
    navigate(`/seeker/mentorservice/`, {
      state: {
        service,
        mentor: {
          _id: service.mentorId._id,
          userData: service.mentorId._id,
          firstName: service.mentorId.firstName,
          lastName: service.mentorId.lastName,
          profilePicture: service.mentorId.profilePicture,
        },
      },
    });
  };

  // Get service type configuration
  const getServiceTypeConfig = (type: string, subType?: string) => {
    if (type === "1-1Call") {
      return {
        icon:
          subType === "video" ? (
            <Video className="w-5 h-5" />
          ) : (
            <MessageSquare className="w-5 h-5" />
          ),
        color: "bg-gradient-to-r from-blue-500 to-indigo-500",
        label: subType === "video" ? "Video Call" : "1:1 Chat",
      };
    } else if (type === "priorityDM") {
      return {
        icon: <Target className="w-5 h-5" />,
        color: "bg-gradient-to-r from-purple-500 to-pink-500",
        label: "Priority DM",
      };
    } else if (type === "DigitalProducts") {
      return {
        icon:
          subType === "documents" ? (
            <BookOpen className="w-5 h-5" />
          ) : (
            <Code className="w-5 h-5" />
          ),
        color: "bg-gradient-to-r from-green-500 to-emerald-500",
        label: subType === "documents" ? "Digital Book" : "Tutorial",
      };
    }
    return {
      icon: <Sparkles className="w-5 h-5" />,
      color: "bg-gradient-to-r from-gray-500 to-gray-600",
      label: "Service",
    };
  };

  // Get rating badge configuration
  const getRatingBadge = (rating: number, bookingCount: number) => {
    if (rating >= 4.8) {
      return {
        text: "Elite",
        gradient: "bg-gradient-to-r from-orange-500 to-red-500",
        icon: <Crown className="w-3 h-3" />,
      };
    } else if (rating >= 4.5) {
      return {
        text: "Top Rated",
        gradient: "bg-gradient-to-r from-purple-500 to-blue-500",
        icon: <Award className="w-3 h-3" />,
      };
    } else if (bookingCount >= 50) {
      return {
        text: "Popular",
        gradient: "bg-gradient-to-r from-green-500 to-emerald-500",
        icon: <TrendingUp className="w-3 h-3" />,
      };
    }
    return null;
  };

  const totalPages = Math.ceil(totalServices / limit);

  const renderSkeletonCard = () => (
    <Card className="border-0 shadow-lg overflow-hidden bg-white rounded-2xl">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-3">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex gap-4 mb-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </CardContent>
      <CardFooter>
        <div className="flex justify-between items-center w-full">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </CardFooter>
    </Card>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl col-span-full">
      <div className="mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
          <Award className="w-12 h-12 text-purple-600" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        No Services Found
      </h3>
      <p className="text-gray-600 text-center max-w-md mb-6">
        We couldn't find any services matching your criteria. Try adjusting your
        filters or explore all services.
      </p>
      <Button
        onClick={() => {
          setSelectedCategory("All");
          setSearchQuery("");
        }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-6 py-3 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
      >
        <Filter className="w-5 h-5 mr-2" />
        View All Services
      </Button>
    </div>
  );

  const renderServiceCard = (service: Service, index: number) => {
    const serviceConfig = getServiceTypeConfig(
      service.type,
      service.digitalProductType || service.oneToOneType
    );
    const ratingBadge = getRatingBadge(
      service.averageRating,
      service.bookingCount
    );
    const isHovered = hoveredCard === service._id;

    return (
      <Card
        key={service._id}
        className={`group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl overflow-hidden cursor-pointer ${
          isHovered ? "transform -translate-y-2 scale-[1.02]" : ""
        }`}
        style={{ animationDelay: `${index * 100}ms` }}
        onMouseEnter={() => setHoveredCard(service._id)}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={() => handleCardClick(service)}
      >
        <CardHeader className="pb-4">
          {/* Header with service type and badge */}
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-2xl ${serviceConfig.color} shadow-lg`}>
              <div className="text-white">{serviceConfig.icon}</div>
            </div>
            {ratingBadge && (
              <Badge
                className={`${ratingBadge.gradient} text-white border-0 px-3 py-1 rounded-full text-xs font-semibold shadow-lg`}
              >
                <span className="flex items-center gap-1">
                  {ratingBadge.icon}
                  {ratingBadge.text}
                </span>
              </Badge>
            )}
          </div>

          {/* Title and Description */}
          <CardTitle className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors duration-200">
            {service.title}
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {service.shortDescription}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-4">
          {/* Mentor Info */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-10 h-10 border-2 border-white shadow-md">
              <AvatarImage src={service.mentorId.profilePicture} />
              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-500 text-white font-bold">
                {service.mentorId.firstName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {`${service.mentorId.firstName} ${service.mentorId.lastName}`}
              </p>
              <p className="text-xs text-gray-500">{serviceConfig.label}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-sm text-gray-900">
                {service.averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-500">
                ({service.bookingCount})
              </span>
            </div>
            {service.duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {service.duration}m
                </span>
              </div>
            )}
          </div>

          {/* Technology/Category Badge */}
          {service.technology && (
            <div className="mb-2">
              <Badge
                variant="outline"
                className="bg-gray-50 text-gray-700 border-gray-200"
              >
                {service.technology}
              </Badge>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                ₹{service.amount}
              </span>
            </div>
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-4 py-2 font-semibold shadow-md transform hover:scale-105 transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick(service);
              }}
            >
              <span className="mr-2">View Details</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardFooter>
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
        <div className="mb-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Professional Services
              </h1>
              <p className="text-gray-600 mt-2">
                Discover expert services to grow your skills and advance your
                career
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Available Services</p>
                    <p className="text-xl font-bold text-gray-900">
                      {totalServices}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="All" onValueChange={handleCategoryChange}>
          {/* Filters and Search */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <TabsList className="bg-white h-14 shadow-md rounded-xl p-1.5 grid grid-cols-3 lg:grid-cols-6 gap-1">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.value}
                    value={category.value}
                    className="rounded-lg px-3 py-2.5 text-xs lg:text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                  >
                    <span className="flex items-center gap-1">
                      {category.icon}
                      <span className="hidden sm:inline">
                        {category.display}
                      </span>
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search services, mentors, or technologies..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-12 pr-4 py-3 rounded-xl border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          {categories.map((category) => (
            <TabsContent key={category.value} value={category.value}>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index}>{renderSkeletonCard()}</div>
                  ))}
                </div>
              ) : services.length === 0 ? (
                <div className="grid grid-cols-1">{renderEmptyState()}</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {services.map((service, index) =>
                      renderServiceCard(service, index)
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
