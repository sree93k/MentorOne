// "use client";

// import { useState } from "react";
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
// import {
//   Star,
//   Clock,
//   MapPin,
//   Code,
//   Palette,
//   BarChart3,
//   Camera,
//   Smartphone,
//   Globe,
//   Megaphone,
//   Shield,
// } from "lucide-react";

// const services = [
//   {
//     id: 1,
//     title: "Full Stack Web Development",
//     description:
//       "Complete web application development from frontend to backend with modern technologies",
//     provider: "TechCraft Solutions",
//     providerAvatar: "/placeholder.svg?height=40&width=40",
//     rating: 4.9,
//     reviews: 127,
//     price: "₹25,000",
//     duration: "2-4 weeks",
//     location: "Remote",
//     category: "Development",
//     icon: Code,
//     featured: true,
//     tags: ["React", "Node.js", "MongoDB"],
//   },
//   {
//     id: 2,
//     title: "UI/UX Design & Prototyping",
//     description:
//       "Modern user interface design with interactive prototypes and user experience optimization",
//     provider: "Design Studio Pro",
//     providerAvatar: "/placeholder.svg?height=40&width=40",
//     rating: 4.8,
//     reviews: 89,
//     price: "₹18,000",
//     duration: "1-3 weeks",
//     location: "Bangalore",
//     category: "Design",
//     icon: Palette,
//     featured: false,
//     tags: ["Figma", "Adobe XD", "Prototyping"],
//   },
//   {
//     id: 3,
//     title: "Digital Marketing Strategy",
//     description:
//       "Comprehensive digital marketing campaigns including SEO, social media, and content marketing",
//     provider: "Growth Hackers Inc",
//     providerAvatar: "/placeholder.svg?height=40&width=40",
//     rating: 4.7,
//     reviews: 156,
//     price: "₹15,000",
//     duration: "Ongoing",
//     location: "Mumbai",
//     category: "Marketing",
//     icon: Megaphone,
//     featured: true,
//     tags: ["SEO", "Social Media", "Analytics"],
//   },
//   {
//     id: 4,
//     title: "Mobile App Development",
//     description:
//       "Native and cross-platform mobile applications for iOS and Android platforms",
//     provider: "AppCraft Technologies",
//     providerAvatar: "/placeholder.svg?height=40&width=40",
//     rating: 4.6,
//     reviews: 94,
//     price: "₹35,000",
//     duration: "4-8 weeks",
//     location: "Remote",
//     category: "Development",
//     icon: Smartphone,
//     featured: false,
//     tags: ["React Native", "Flutter", "iOS"],
//   },
//   {
//     id: 5,
//     title: "Data Analytics & Visualization",
//     description:
//       "Business intelligence solutions with interactive dashboards and data-driven insights",
//     provider: "DataViz Experts",
//     providerAvatar: "/placeholder.svg?height=40&width=40",
//     rating: 4.8,
//     reviews: 73,
//     price: "₹22,000",
//     duration: "2-3 weeks",
//     location: "Delhi",
//     category: "Analytics",
//     icon: BarChart3,
//     featured: false,
//     tags: ["Power BI", "Tableau", "Python"],
//   },
//   {
//     id: 6,
//     title: "Professional Photography",
//     description:
//       "Corporate photography, product shoots, and event coverage with professional editing",
//     provider: "Lens & Light Studio",
//     providerAvatar: "/placeholder.svg?height=40&width=40",
//     rating: 4.9,
//     reviews: 112,
//     price: "₹12,000",
//     duration: "1-2 days",
//     location: "Pune",
//     category: "Creative",
//     icon: Camera,
//     featured: true,
//     tags: ["Portrait", "Product", "Event"],
//   },
//   {
//     id: 7,
//     title: "Cloud Infrastructure Setup",
//     description:
//       "AWS, Azure, and GCP cloud infrastructure deployment with security best practices",
//     provider: "CloudOps Solutions",
//     providerAvatar: "/placeholder.svg?height=40&width=40",
//     rating: 4.7,
//     reviews: 68,
//     price: "₹28,000",
//     duration: "1-2 weeks",
//     location: "Remote",
//     category: "DevOps",
//     icon: Globe,
//     featured: false,
//     tags: ["AWS", "Docker", "Kubernetes"],
//   },
//   {
//     id: 8,
//     title: "Cybersecurity Audit",
//     description:
//       "Comprehensive security assessment and penetration testing for web applications",
//     provider: "SecureShield Consulting",
//     providerAvatar: "/placeholder.svg?height=40&width=40",
//     rating: 4.8,
//     reviews: 45,
//     price: "₹20,000",
//     duration: "1 week",
//     location: "Chennai",
//     category: "Security",
//     icon: Shield,
//     featured: false,
//     tags: ["Penetration Testing", "Security Audit", "Compliance"],
//   },
// ];

// const categories = [
//   "All",
//   "Development",
//   "Design",
//   "Marketing",
//   "Analytics",
//   "Creative",
//   "DevOps",
//   "Security",
// ];

// export default function ServicesListing() {
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   const filteredServices = services.filter((service) => {
//     const matchesCategory =
//       selectedCategory === "All" || service.category === selectedCategory;
//     const matchesSearch =
//       service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       service.provider.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesCategory && matchesSearch;
//   });
//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//     setCurrentPage(1); // Reset to first page on search
//   };
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex max-w-7xl mx-auto">
//         {/* Main Content */}
//         <main className="flex-1 p-8 pt-0">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               Professional Services
//             </h1>
//             <p className="text-gray-600">
//               Discover expert services to grow your business and enhance your
//               projects
//             </p>
//           </div>

//           {/* Filters and Search */}
//           <div className="flex items-center justify-between mb-8">
//             <div className="flex space-x-2">
//               {categories.map((category) => (
//                 <Button
//                   key={category}
//                   variant={
//                     selectedCategory === category ? "default" : "outline"
//                   }
//                   size="sm"
//                   onClick={() => setSelectedCategory(category)}
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
//               placeholder="Search by course title, description, or mentor..."
//               value={searchQuery}
//               onChange={handleSearch}
//               className="w-full sm:w-64 rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
//             />
//           </div>

//           {/* Services Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
//             {filteredServices.map((service) => {
//               const IconComponent = service.icon;
//               return (
//                 <Card
//                   key={service.id}
//                   className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md"
//                 >
//                   <CardHeader className="pb-3">
//                     <div className="flex items-start justify-between mb-3">
//                       <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
//                         <IconComponent className="w-6 h-6 text-gray-700" />
//                       </div>
//                       {service.featured && (
//                         <Badge
//                           variant="secondary"
//                           className="bg-amber-100 text-amber-800 border-amber-200"
//                         >
//                           Featured
//                         </Badge>
//                       )}
//                     </div>
//                     <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
//                       {service.title}
//                     </CardTitle>
//                     <CardDescription className="text-sm text-gray-600 line-clamp-2">
//                       {service.description}
//                     </CardDescription>
//                   </CardHeader>

//                   <CardContent className="pb-3">
//                     <div className="flex items-center space-x-2 mb-3">
//                       <Avatar className="w-6 h-6">
//                         <AvatarImage
//                           src={service.providerAvatar || "/placeholder.svg"}
//                         />
//                         <AvatarFallback className="text-xs">
//                           {service.provider.charAt(0)}
//                         </AvatarFallback>
//                       </Avatar>
//                       <span className="text-sm text-gray-600 truncate">
//                         {service.provider}
//                       </span>
//                     </div>

//                     <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
//                       <div className="flex items-center space-x-1">
//                         <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
//                         <span className="font-medium">{service.rating}</span>
//                         <span>({service.reviews})</span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <Clock className="w-3 h-3" />
//                         <span>{service.duration}</span>
//                       </div>
//                     </div>

//                     {/* <div className="flex items-center space-x-1 text-xs text-gray-500 mb-3">
//                       <MapPin className="w-3 h-3" />
//                       <span>{service.location}</span>
//                     </div> */}

//                     <div className="flex flex-wrap gap-1 mb-3">
//                       {service.tags.slice(0, 2).map((tag) => (
//                         <Badge
//                           key={tag}
//                           variant="outline"
//                           className="text-xs px-2 py-0"
//                         >
//                           {tag}
//                         </Badge>
//                       ))}
//                       {service.tags.length > 2 && (
//                         <Badge variant="outline" className="text-xs px-2 py-0">
//                           +{service.tags.length - 2}
//                         </Badge>
//                       )}
//                     </div>
//                   </CardContent>

//                   <CardFooter className="pt-0">
//                     <div className="flex items-center justify-between w-full">
//                       <div className="text-lg font-bold text-gray-900">
//                         {service.price}
//                       </div>
//                       <Button
//                         size="sm"
//                         className="bg-black hover:bg-gray-800 text-white"
//                       >
//                         View Details
//                       </Button>
//                     </div>
//                   </CardFooter>
//                 </Card>
//               );
//             })}
//           </div>

//           {/* Pagination */}
//           <div className="flex justify-center space-x-2">
//             <Button variant="outline" disabled>
//               Previous
//             </Button>
//             <Button variant="default" className="bg-black text-white">
//               1
//             </Button>
//             <Button variant="outline">Next</Button>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
// pages/ServicesListing.tsx
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
import {
  Star,
  Clock,
  MapPin,
  Code,
  Palette,
  BarChart3,
  Camera,
  Smartphone,
  Globe,
  Megaphone,
  Shield,
} from "lucide-react";
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

const serviceIcons: { [key: string]: React.ComponentType } = {
  "1-1Call": Code,
  priorityDM: Megaphone,
  DigitalProducts: Palette,
};

const categories = [
  "All",
  "1:1 Chat",
  "Videocall",
  "Priority DM",
  "Digital Books",
  "Tutorials",
];

export default function ServicesListing() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [totalServices, setTotalServices] = useState(0);
  const [loading, setLoading] = useState(false);
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
      setServices(response.services);
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
    navigate(`/seeker/service/${service._id}`, {
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

  const totalPages = Math.ceil(totalServices / limit);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <main className="flex-1 p-8 pt-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Professional Services
            </h1>
            <p className="text-gray-600">
              Discover expert services to grow your skills and career
            </p>
          </div>

          {/* Filters and Search */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-wrap space-x-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleCategoryChange(category)}
                  className={
                    selectedCategory === category ? "bg-black text-white" : ""
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
            <Input
              type="text"
              placeholder="Search by service title, description, or mentor..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full sm:w-64 rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Services Grid */}
          {loading ? (
            <p>Loading services...</p>
          ) : services.length === 0 ? (
            <p className="text-gray-500">No services found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {services.map((service) => {
                const IconComponent = serviceIcons[service.type] || Code;
                return (
                  <Card
                    key={service._id}
                    className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md cursor-pointer"
                    onClick={() => handleCardClick(service)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                          <IconComponent className="w-6 h-6 text-gray-700" />
                        </div>
                        {service.averageRating > 4.5 && (
                          <Badge
                            variant="secondary"
                            className="bg-amber-100 text-amber-800 border-amber-200"
                          >
                            Top Rated
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600 line-clamp-2">
                        {service.shortDescription}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pb-3">
                      <div className="flex items-center space-x-2 mb-3">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={service.mentorId.profilePicture} />
                          <AvatarFallback>
                            {service.mentorId.firstName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-600 truncate">
                          {`${service.mentorId.firstName} ${service.mentorId.lastName}`}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">
                            {service.averageRating.toFixed(1)}
                          </span>
                          <span>({service.bookingCount})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{service.duration} min</span>
                        </div>
                      </div>

                      {service.technology && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-0"
                          >
                            {service.technology}
                          </Badge>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="pt-0">
                      <div className="flex items-center justify-between w-full">
                        <div className="text-lg font-bold text-gray-900">
                          ₹{service.amount}
                        </div>
                        <Button
                          size="sm"
                          className="bg-black hover:bg-gray-800 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(service);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>
              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index + 1}
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  className={
                    currentPage === index + 1 ? "bg-black text-white" : ""
                  }
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
