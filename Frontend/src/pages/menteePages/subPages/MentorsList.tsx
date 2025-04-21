import React from "react";
import { useState, useEffect } from "react";
import { Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DummyProfileImg from "@/assets/DummyProfile.jpg";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
const MentorsList: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const [loadedImages, setLoadedImages] = useState<{ [key: number]: boolean }>(
    {}
  );

  const handleImageLoad = (id: number) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };
  const filters = [
    "All",
    "General QnA",
    "Mock Interview",
    "Resume Review",
    "Career Guide",
    "Most Visited",
  ];

  // Simulate loading delay (e.g., for API fetch)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2-second delay
    return () => clearTimeout(timer);
  }, []);

  const mentors = [
    {
      id: 1,
      name: "Aswanth",
      role: "MERN stack Developer",
      company: "Zeti",
      image: "/placeholder.svg?height=200&width=200",
      companyBadge: "Zeti",
    },
    {
      id: 2,
      name: "Shraavana S",
      role: "Python Django + React",
      company: "SourceUP",
      image: "/placeholder.svg?height=200&width=200",
      companyBadge: "SourceUp",
    },
    {
      id: 3,
      name: "Jithesh",
      role: "MERN stack Developer",
      company: "Infinity",
      image: "/placeholder.svg?height=200&width=200",
      companyBadge: "Infinity",
    },
    {
      id: 4,
      name: "Thahreen",
      role: "MERN stack Developer",
      company: "Quality",
      image: "/placeholder.svg?height=200&width=200",
      companyBadge: "Quality",
    },
    {
      id: 5,
      name: "Anila Benny",
      role: "MERN stack Developer",
      company: "PrwaTech",
      image: "/placeholder.svg?height=200&width=200",
      companyBadge: "Prwatech",
    },
    {
      id: 6,
      name: "Arjun",
      role: "MERN stack Developer",
      company: "Riafy",
      image: "/placeholder.svg?height=200&width=200",
      companyBadge: "Riafy",
    },
    {
      id: 7,
      name: "Anusree Vasudevan",
      role: "MERN stack Developer",
      company: "BOLD",
      image: "/placeholder.svg?height=200&width=200",
      companyBadge: "BOLD",
    },
    {
      id: 8,
      name: "Jithin",
      role: "MERN stack Developer",
      company: "PepGen",
      image: "/placeholder.svg?height=200&width=200",
      companyBadge: "PepGen",
    },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1">
        {/* Header */}

        {/* Filters */}
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

        {/* Mentors Grid */}
        <div className="p-4  bg-opacity-50 rounded-lg mx-4">
          <h2 className="text-2xl font-bold mb-4 ">Top Mentors</h2>

          {/* <div className="  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-white rounded-lg overflow-hidden shadow max-w-[280px]"
                onClick={() => navigate("/seeker/mentorprofile")}
              >
                <div className="relative">
                  {isLoading ? (
                    <Skeleton className="w-full h-40 object-cover rounded-t-lg animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                  ) : (
                    <img
                      src={DummyProfileImg}
                      alt={mentor.name}
                      width={300}
                      height={200}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                  )}

                  <Badge className="absolute bottom-2 left-2 bg-white text-black">
                    {mentor.companyBadge}
                  </Badge>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg">{mentor.name}</h3>
                  <p className="text-gray-600">{mentor.role}</p>
                  <p className="text-gray-500 text-sm">
                    SDE I@ {mentor.company}
                  </p>
                </div>
              </div>
            ))}
          </div> */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-white rounded-lg overflow-hidden shadow max-w-[280px] cursor-pointer"
                onClick={() => navigate("/seeker/mentorprofile")}
              >
                <div className="relative w-full h-40">
                  {!loadedImages[mentor.id] && (
                    <Skeleton className="w-full h-40 object-cover rounded-t-lg absolute top-0 left-0 z-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                  )}
                  <img
                    src={DummyProfileImg}
                    alt={mentor.name}
                    width={300}
                    height={200}
                    onLoad={() => handleImageLoad(mentor.id)}
                    className={`w-full h-40 object-cover rounded-t-lg transition-opacity duration-500 ${
                      loadedImages[mentor.id] ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <Badge className="absolute bottom-2 left-2 bg-white text-black z-10">
                    {mentor.companyBadge}
                  </Badge>
                </div>

                {/* This part always renders */}
                <div className="p-4">
                  <h3 className="font-bold text-lg">{mentor.name}</h3>
                  <p className="text-gray-600">{mentor.role}</p>
                  <p className="text-gray-500 text-sm">
                    SDE I@ {mentor.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MentorsList;
