import React, { useState, useEffect, useMemo } from "react";
import { Star, MessageCircle, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import DummyProfileImg from "@/assets/DummyProfile.jpg";
import { useNavigate } from "react-router-dom";
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

const MentorsList = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loadedImages, setLoadedImages] = useState({});
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMentors, setTotalMentors] = useState(0);
  const mentorsPerPage = 12;
  const navigate = useNavigate();

  const filters = [
    { display: "All", value: "All" },
    { display: "School Student", value: "School Student" },
    { display: "College Student", value: "College Student" },
    { display: "Professional", value: "Professional" },
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

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

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
    setCurrentPage(1); // Reset to first page on search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalMentors / mentorsPerPage);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex-1 max-w-7xl mx-auto">
        <div className="pt-0 p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Find Your Perfect Mentor
            </h1>
            <p className="text-gray-600">
              Connect with industry professionals ready to guide your career
              journey
            </p>
          </div>

          {/* Tabs and Search */}
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
                placeholder="Search by mentor name, bio, or work..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full sm:w-64 rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </TabsList>
            {filters.map((filter) => (
              <TabsContent key={filter.value} value={filter.value}>
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                ) : filteredMentors.length === 0 ? (
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
                      Try selecting a different role
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
                    {filteredMentors.map((mentor) => {
                      const rating = "4.8"; // Fixed for demo
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
                          <div className="h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                          <div className="relative px-6">
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
                              <div className="absolute -right-2 -top-4">
                                <div className="flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-400 text-gray-900 shadow-sm">
                                  <Star className="w-3 h-3 mr-1 fill-gray-900" />
                                  {rating}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="p-6 pt-16">
                            <h3 className="font-bold text-lg text-gray-900">
                              {mentor.name}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600 mb-3">
                              <span className="font-medium">
                                {mentor.workRole}
                              </span>
                              <span className="mx-1">@</span>
                              <span className="text-gray-900 font-semibold">
                                {mentor.work}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4 line-clamp-3">
                              {mentor.bio ||
                                "Helping professionals grow their careers through mentorship and guidance."}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-5">
                              <span className="px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
                                {mentor.badge || "Premium"}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                className="flex-1 bg-black hover:bg-gray-800 text-white transition-colors"
                                onClick={() =>
                                  navigate(
                                    `/seeker/mentorprofile/${mentor.userId}`
                                  )
                                }
                                disabled={
                                  mentor.isBlocked ||
                                  mentor.isApproved !== "Approved"
                                }
                              >
                                View Profile
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            ))}
            {/* Pagination */}
            {filteredMentors.length !== 0 && (
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
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MentorsList;
