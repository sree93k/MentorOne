import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DummyProfileImg from "@/assets/DummyProfile.jpg";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllMentors } from "@/services/menteeService";
import { toast } from "react-hot-toast"; // Fixed import

interface Mentor {
  _id: string;
  name: string;
  role: string;
  company: string;
  profileImage?: string;
  companyBadge: string;
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
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search mentors..."
              className="pl-10"
            />
          </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mentors.map((mentor) => (
                <div
                  key={mentor._id}
                  className="bg-white rounded-lg overflow-hidden shadow max-w-[280px] cursor-pointer"
                  onClick={() =>
                    navigate(`/seeker/mentorprofile/${mentor._id}`)
                  }
                >
                  <div className="relative w-full h-40 bg-red-400">
                    {!loadedImages[mentor._id] && (
                      <Skeleton className="w-full h-40 rounded-t-lg absolute top-0 left-0 z-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                    )}
                    <img
                      src={mentor.profileImage || DummyProfileImg}
                      alt={mentor.name}
                      width={300}
                      height={200}
                      onLoad={() => handleImageLoad(mentor._id)}
                      className={`w-full h-40 object-cover rounded-t-lg transition-opacity duration-500 ${
                        loadedImages[mentor._id] ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <Badge className="absolute bottom-2 left-2 bg-white text-black z-10">
                      {mentor.companyBadge}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{mentor.name}</h3>
                    <p className="text-gray-600">{mentor.role}</p>
                    <p className="text-gray-500 text-sm">
                      {mentor.role} @ {mentor.company}
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
