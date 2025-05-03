import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllTutorials } from "@/services/menteeService"; // Import the service
import { useNavigate } from "react-router-dom";

const filters = ["All tutorials", "Paid", "Free", "Packages"];

// Temporary images (reused from your original courses)
const tempImages = [
  "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2831&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=2870&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2832&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1593720216276-0caa6452e004?q=80&w=2924&auto=format&fit=crop",
];

export default function CoursesPage() {
  const [activeFilter, setActiveFilter] = useState("All tutorials");
  const [tutorials, setTutorials] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const data = await getAllTutorials();
        setTutorials(data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch tutorials:", err);
        setError(err.message || "Failed to load tutorials");
      }
    };
    fetchTutorials();
  }, []);

  return (
    <div className="container py-0">
      <div className="flex gap-4 mb-8 border-b p-2">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            className={`rounded-full ${
              activeFilter === filter
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>

      {error && (
        <p className="text-center text-sm text-red-500 mb-4">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tutorials.length > 0 ? (
          tutorials.map((tutorial: any, index: number) => (
            <Card key={tutorial._id}>
              <CardContent className="p-4">
                <img
                  src={tempImages[index % tempImages.length]} // Cycle through temp images
                  alt={tutorial.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold mb-2">{tutorial.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {tutorial.mentorUsername}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  {tutorial.seasonCount} Seasons
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-semibold">4.4</span>
                  <div className="text-yellow-400">★★★★★</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">₹{tutorial.amount}</span>
                  {/* Optional: Add a discounted price if needed */}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            No tutorials available
          </p>
        )}
      </div>
    </div>
  );
}
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

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {tutorials.length > 0 ? (
//           tutorials.map((tutorial: any, index: number) => (
//             <Card
//               key={tutorial._id}
//               className="cursor-pointer"
//               onClick={() => navigate(`/digitalcontent/${tutorial._id}`)}
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
