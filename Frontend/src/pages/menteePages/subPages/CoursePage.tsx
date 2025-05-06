// import React, { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { getAllTutorials } from "@/services/menteeService";
// import { useNavigate } from "react-router-dom";

// const filters = ["All tutorials", "Paid", "Free", "Packages"];

// const tempImages = [
//   "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2831&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=2870&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2832&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1593720216276-0caa6452e004?q=80&w=2924&auto=format&fit=crop",
// ];

// export default function CoursesPage() {
//   const [activeFilter, setActiveFilter] = useState("All tutorials");
//   const [tutorials, setTutorials] = useState([]);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchTutorials = async () => {
//       try {
//         const data = await getAllTutorials();
//         setTutorials(data);
//         setError(null);
//       } catch (err: any) {
//         console.error("Failed to fetch tutorials:", err);
//         setError(err.message || "Failed to load tutorials");
//       }
//     };
//     fetchTutorials();
//   }, []);

//   return (
//     <div className="container py-0">
//       <div className="flex gap-4 mb-8 border-b p-2">
//         {filters.map((filter) => (
//           <Button
//             key={filter}
//             variant={activeFilter === filter ? "default" : "outline"}
//             className={`rounded-full ${
//               activeFilter === filter
//                 ? "bg-black text-white"
//                 : "bg-white text-black"
//             }`}
//             onClick={() => setActiveFilter(filter)}
//           >
//             {filter}
//           </Button>
//         ))}
//       </div>

//       {error && (
//         <p className="text-center text-sm text-red-500 mb-4">{error}</p>
//       )}
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Top Courses</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {tutorials.length > 0 ? (
//           tutorials.map((tutorial: any, index: number) => (
//             <Card
//               key={tutorial._id}
//               className="cursor-pointer"
//               onClick={() => navigate(`/seeker/digitalcontent/${tutorial._id}`)}
//             >
//               <CardContent className="p-4">
//                 <img
//                   src={tempImages[index % tempImages.length]}
//                   alt={tutorial.title}
//                   className="w-full h-48 object-cover rounded-lg mb-4"
//                 />
//                 <h3 className="font-semibold mb-2">{tutorial.title}</h3>
//                 <p className="text-sm text-muted-foreground mb-2">
//                   {tutorial.mentorUsername}
//                 </p>
//                 <p className="text-sm text-muted-foreground mb-2">
//                   {tutorial.seasonCount} Seasons
//                 </p>
//                 <div className="flex items-center gap-2 mb-4">
//                   <span className="font-semibold">4.4</span>
//                   <div className="text-yellow-400">★★★★★</div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="font-bold">₹{tutorial.amount}</span>
//                 </div>
//               </CardContent>
//             </Card>
//           ))
//         ) : (
//           <p className="text-center text-sm text-muted-foreground">
//             No tutorials available
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getAllTutorials } from "@/services/menteeService";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, BookOpen, Clock, Award } from "lucide-react";

// Static course images - professional educational content
const courseImages = [
  // "https://images.unsplash.com/photo-1516321310764-8d9a662d692a?q=80&w=2800&auto=format&fit=crop",
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
  const [activeFilter, setActiveFilter] = useState("All tutorials");
  const [tutorials, setTutorials] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const filters = ["All tutorials", "Paid", "Free", "Packages"];

  useEffect(() => {
    const fetchTutorials = async () => {
      setIsLoading(true);
      try {
        const data = await getAllTutorials();
        setTutorials(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch tutorials:", err);
        setError(err.message || "Failed to load tutorials");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTutorials();
  }, []);

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
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 max-w-7xl mx-auto">
        <div className="pt-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Courses & Tutorials
            </h1>
            {/* <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                className="pl-4 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div> */}
          </div>

          <div className="flex items-center gap-3 mb-2 overflow-x-auto border-b pb-1">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                className={`rounded-full ${
                  activeFilter === filter
                    ? "bg-black text-white"
                    : "border-gray-300"
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </Button>
            ))}
          </div>

          <div className="p-2 rounded-xl  shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Top Courses
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

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
            ) : tutorials.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tutorials.map((tutorial, index) => {
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
                      {/* Image Section */}
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

                      {/* Content Section */}
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
                            {tutorial.mentorUsername}
                          </span>
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <div className="flex items-center text-xs bg-gray-100 px-3 py-1 rounded-full">
                            <BookOpen className="w-3 h-3 mr-1" />
                            {tutorial.seasonCount} Seasons
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
              <div className="text-center py-12">
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
                    onClick={() => setActiveFilter("All tutorials")}
                  >
                    View all courses
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
