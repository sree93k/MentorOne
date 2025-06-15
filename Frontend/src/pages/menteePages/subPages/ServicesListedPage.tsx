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
import { Star, Clock, Code, Palette, Megaphone } from "lucide-react";
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
    console.log("++++++       handleCardClick step1", service);

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
