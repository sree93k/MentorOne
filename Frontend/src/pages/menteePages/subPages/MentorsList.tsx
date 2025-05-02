import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1">
        <div className="p-4">
          {/* <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search mentors..."
              className="pl-10"
            />
          </div> */}
        </div>

        <div className="flex items-center gap-3 p-4">
          <div className="flex gap-2 overflow-x-auto">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                className={`rounded-full ${
                  activeFilter === filter ? "bg-black text-white" : ""
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-opacity-50 rounded-lg mx-4">
          <h2 className="text-2xl font-bold mb-4">Top Mentors</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg overflow-hidden shadow max-w-[280px]"
                >
                  <Skeleton className="w-full h-40 rounded-t-lg animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : mentors.length === 0 ? (
            <p className="text-gray-500 text-center">No mentors found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
              {mentors.map((mentor) => (
                <div
                  key={mentor.userId}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 cursor-pointer"
                  onClick={() =>
                    navigate(`/seeker/mentorprofile/${mentor.userId}`)
                  }
                >
                  <div className="relative w-full h-[250px] bg-gray-100">
                    {!loadedImages[mentor.userId] && (
                      <Skeleton className="absolute inset-0 w-full h-full animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
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
                    <Badge className="absolute top-2 left-2 bg-white text-black px-2 py-1 rounded-md text-xs shadow">
                      {mentor.role}
                    </Badge>
                  </div>

                  <div className="p-4 bg-gray-50">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {mentor.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {mentor.bio}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {mentor.workRole} <span className="text-gray-400">@</span>{" "}
                      {mentor.work}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorsList;
