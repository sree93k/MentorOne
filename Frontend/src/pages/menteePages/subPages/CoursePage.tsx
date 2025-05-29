import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, BookOpen, Clock, Award } from "lucide-react";
import { getAllTutorials } from "@/services/menteeService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// Static course images - professional educational content
const courseImages = [
  "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516321165247-7b389729b7c6?q=80&w=2800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=2800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504707748692-419802cf939d?q=80&w=2800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516321497487-09736e785f47?q=80&w=2800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555066931-4365d14bab0c?q=80&w=2800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2800&auto=format&fit=crop",
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
    { display: "All", value: "All" },
    { display: "Paid", value: "Paid" },
    { display: "Free", value: "Free" },
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
          tutorial.title.toLowerCase().includes(query) ||
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
    setCurrentPage(1); // Reset to first page on search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalTutorials / tutorialsPerPage);

  // Get course badge based on price
  const getCourseBadge = (price) => {
    if (price === 0)
      return {
        text: "Free",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
      };
    if (price <= 500)
      return {
        text: "Affordable",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
      };
    if (price <= 1000)
      return {
        text: "Standard",
        bgColor: "bg-purple-100",
        textColor: "text-purple-800",
      };
    return {
      text: "Premium",
      bgColor: "bg-amber-100",
      textColor: "text-amber-800",
    };
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex-1 max-w-7xl mx-auto">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Courses & Tutorials
            </h1>
            <p className="text-gray-600">
              Explore top courses to enhance your skills and knowledge
            </p>
          </div>

          <Tabs defaultValue="All" onValueChange={setActiveFilter}>
            <TabsList className="flex justify-between items-center mb-6 gap-3 border-b border-gray-200 rounded-none w-full pb-6">
              <div className="flex gap-3">
                {filters.map((filter) => (
                  <TabsTrigger
                    key={filter.value}
                    value={filter.value}
                    className={`rounded-full px-4 py-1 border border-black transition-colors duration-200
                      ${
                        activeFilter === filter.value
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      }
                      hover:bg-black hover:text-white`}
                  >
                    {filter.display}
                  </TabsTrigger>
                ))}
              </div>
              <Input
                type="text"
                placeholder="Search by course title, description, or mentor..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full sm:w-64 rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </TabsList>
            {filters.map((filter) => (
              <TabsContent key={filter.value} value={filter.value}>
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, index) => (
                      <div
                        key={index}
                        className="relative overflow-hidden rounded-xl border border-black"
                      >
                        <Skeleton className="w-full h-48" />
                        <div className="p-4">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2 mb-2" />
                          <Skeleton className="h-4 w-1/4 mb-2" />
                          <Skeleton className="h-4 w-full mb-4" />
                          <Skeleton className="h-10 w-full rounded-md" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredTutorials.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTutorials.map((tutorial, index) => {
                      const badge = getCourseBadge(tutorial.amount);
                      return (
                        <div
                          key={tutorial._id}
                          className="relative overflow-hidden rounded-xl border border-black transition-all duration-300"
                          style={{
                            transform:
                              hoveredCard === tutorial._id
                                ? "translateY(-5px)"
                                : "translateY(0)",
                            boxShadow:
                              hoveredCard === tutorial._id
                                ? "0 10px 30px rgba(0, 0, 0, 0.1)"
                                : "none",
                          }}
                          onMouseEnter={() => setHoveredCard(tutorial._id)}
                          onMouseLeave={() => setHoveredCard(null)}
                          onClick={() =>
                            navigate(`/seeker/digitalcontent/${tutorial._id}`)
                          }
                        >
                          <div className="relative">
                            <img
                              src={courseImages[index % courseImages.length]}
                              alt={tutorial.title}
                              className="w-full h-48 object-cover"
                            />
                            <div
                              className={`absolute top-4 right-4 ${badge.bgColor} ${badge.textColor} px-3 py-1 rounded-full text-xs font-medium`}
                            >
                              {badge.text}
                            </div>
                          </div>
                          <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-lg line-clamp-2">
                                {tutorial.title}
                              </h3>
                              <div className="flex items-center gap-1 bg-black text-white rounded-full px-2 py-1">
                                <Star className="w-3 h-3 fill-white" />
                                <span className="text-xs">4.4</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                              By{" "}
                              <span className="font-medium">
                                {tutorial.mentorId?.firstName}{" "}
                                {tutorial.mentorId?.lastName}
                              </span>
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              <div className="flex items-center text-xs bg-gray-100 px-3 py-1 rounded-full">
                                <BookOpen className="w-3 h-3 mr-1" />
                                {tutorial.seasonCount || 1} Seasons
                              </div>
                              <div className="flex items-center text-xs bg-gray-100 px-3 py-1 rounded-full">
                                <Clock className="w-3 h-3 mr-1" />
                                10+ Hours
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                              <div className="font-bold text-lg">
                                {tutorial.amount === 0
                                  ? "Free"
                                  : `₹${tutorial.amount}`}
                              </div>
                              <Button className="bg-black hover:bg-gray-800 text-white text-sm px-4 py-2">
                                View Course
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <Award className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      No courses found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      There are no courses available for this category.
                    </p>
                    <div className="mt-6">
                      <Button
                        className="bg-black text-white hover:bg-gray-800"
                        onClick={() => setActiveFilter("All")}
                      >
                        View all courses
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            ))}
            <div className="flex justify-center gap-2 mt-6">
              <Button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="bg-black text-white hover:bg-gray-800"
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                    className={
                      currentPage === page
                        ? "bg-black text-white"
                        : "border-gray-300 hover:bg-gray-50"
                    }
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="bg-black text-white hover:bg-gray-800"
              >
                Next
              </Button>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
