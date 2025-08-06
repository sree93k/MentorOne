// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Pencil, Check, Star } from "lucide-react";
// import toast from "react-hot-toast";
// import {
//   getTestimonialsByMentor,
//   updateTopTestimonials,
// } from "@/services/testimonialService";

// type TestimonialCategory =
//   | "All"
//   | "1:1 Call"
//   | "PriorityDM"
//   | "Digital Products";
// type RatingFilter = "All" | "High" | "Low";
// type SortOption = "Highest" | "Lowest" | "Newest" | "Oldest";

// interface Testimonial {
//   _id: string;
//   comment: string;
//   rating: number;
//   menteeId: { firstName: string; lastName: string };
//   serviceId: { title: string; type: string };
//   createdAt: string;
// }

// export default function TestimonialPage() {
//   const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
//   const [selectedCategory, setSelectedCategory] =
//     useState<TestimonialCategory>("All");
//   const [selectedRating, setSelectedRating] = useState<RatingFilter>("All");
//   const [sortOption, setSortOption] = useState<SortOption>("Newest");
//   const [selectedTestimonialIds, setSelectedTestimonialIds] = useState<
//     string[]
//   >([]);
//   const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalTestimonials, setTotalTestimonials] = useState(0);

//   const testimonialsPerPage = 9;

//   const fetchTestimonials = async () => {
//     try {
//       setIsLoading(true);
//       const response = await getTestimonialsByMentor(
//         currentPage,
//         testimonialsPerPage
//       );

//       console.log(
//         "Mentor Testimonoial page fetchTestimonials step 1",
//         response
//       );

//       // Replace "mentorId" with actual mentor ID from auth context
//       setTestimonials(response.testimonials);
//       setTotalTestimonials(response.total);
//       // Fetch selected testimonials from mentor profile (you may need to add an API call for this)
//       // For now, assume selectedTestimonialIds is fetched or empty
//     } catch (error) {
//       console.error("Failed to fetch testimonials:", error);
//       toast.error("Failed to load testimonials");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTestimonials();
//   }, [currentPage]);

//   const handleCategoryChange = (category: TestimonialCategory) => {
//     setSelectedCategory(category);
//   };

//   const handleRatingChange = (rating: RatingFilter) => {
//     setSelectedRating(rating);
//   };

//   const handleSortChange = (sort: SortOption) => {
//     setSortOption(sort);
//   };

//   const handleSelect = (id: string) => {
//     if (!isEditing) return;

//     setTempSelectedIds((prev) => {
//       if (prev.includes(id)) {
//         return prev.filter((tid) => tid !== id);
//       } else if (prev.length >= 5) {
//         toast.error("You can select up to 5 testimonials only.");
//         return prev;
//       } else {
//         return [...prev, id];
//       }
//     });
//   };

//   const handleEdit = () => {
//     setIsEditing(true);
//     setTempSelectedIds(selectedTestimonialIds);
//   };

//   const handleSave = async () => {
//     try {
//       console.log("tempSelectedIds is ", tempSelectedIds);

//       await updateTopTestimonials(tempSelectedIds);
//       setSelectedTestimonialIds(tempSelectedIds);
//       setIsEditing(false);
//       toast.success("Selections saved successfully!");
//     } catch (error) {
//       console.error("Failed to save testimonials:", error);
//       toast.error("Failed to save selections");
//     }
//   };

//   const handleCancel = () => {
//     setTempSelectedIds(selectedTestimonialIds);
//     setIsEditing(false);
//   };

//   const filteredTestimonials = testimonials
//     .filter((t) => {
//       if (selectedCategory !== "All" && t.serviceId.type !== selectedCategory)
//         return false;
//       if (selectedRating === "High" && t.rating < 4) return false;
//       if (selectedRating === "Low" && t.rating >= 4) return false;
//       return true;
//     })
//     .sort((a, b) => {
//       if (sortOption === "Highest") return b.rating - a.rating;
//       if (sortOption === "Lowest") return a.rating - b.rating;
//       if (sortOption === "Newest")
//         return (
//           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//         );
//       if (sortOption === "Oldest")
//         return (
//           new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//         );
//       return 0;
//     });

//   const categories: TestimonialCategory[] = [
//     "All",
//     "1:1 Call",
//     "PriorityDM",
//     "Digital Products",
//   ];
//   const ratingFilters: RatingFilter[] = ["All", "High", "Low"];
//   const sortOptions: SortOption[] = ["Highest", "Lowest", "Newest", "Oldest"];
//   const totalPages = Math.ceil(totalTestimonials / testimonialsPerPage);

//   return (
//     <div className="p-6 mx-36">
//       <h1 className="text-2xl font-bold mb-6">Testimonials</h1>
//       <div className="flex justify-between items-center mb-4">
//         <div className="flex items-center gap-4">
//           {!isEditing && (
//             <Button
//               onClick={handleEdit}
//               variant="outline"
//               className="flex items-center gap-2"
//             >
//               <Pencil className="w-4 h-4" />
//               Edit
//             </Button>
//           )}
//           {isEditing && (
//             <div className="flex gap-2">
//               <Button onClick={handleSave} className="bg-black text-white">
//                 Save
//               </Button>
//               <Button onClick={handleCancel} variant="outline">
//                 Cancel
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <div className="flex gap-2 flex-wrap">
//           {categories.map((category) => (
//             <button
//               key={category}
//               onClick={() => handleCategoryChange(category)}
//               className={`px-4 py-2 rounded-full text-sm ${
//                 selectedCategory === category
//                   ? "bg-black text-white"
//                   : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//               }`}
//             >
//               {category}
//             </button>
//           ))}
//         </div>
//         <div className="flex gap-4 ml-auto">
//           <select
//             value={sortOption}
//             onChange={(e) => handleSortChange(e.target.value as SortOption)}
//             className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm"
//           >
//             {sortOptions.map((option) => (
//               <option key={option} value={option}>
//                 Sort: {option}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//       {isLoading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="flex flex-col items-center text-center">
//             <div className="relative mb-4">
//               <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-500 rounded-full animate-spin"></div>
//             </div>
//             <p className="text-gray-500 text-lg">Loading testimonials...</p>
//           </div>
//         </div>
//       ) : filteredTestimonials.length === 0 ? (
//         <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg p-6 animate-fade-in">
//           <div className="relative mb-4">
//             <Star className="w-16 h-16 text-gray-400 animate-pulse" />
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="w-20 h-20 border-2 border-gray-200 rounded-full animate-pulse"></div>
//             </div>
//           </div>
//           <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
//             No Testimonials Yet
//           </h3>
//           <p className="text-sm text-gray-500 mt-2 max-w-xs text-center">
//             No testimonials to display. Keep providing great mentorship to
//             receive feedback from your mentees!
//           </p>
//         </div>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredTestimonials.map((testimonial) => (
//               <div
//                 key={testimonial._id}
//                 className="bg-white rounded-lg shadow-md p-6 relative"
//               >
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="flex items-center space-x-1">
//                     {[...Array(testimonial.rating)].map((_, i) => (
//                       <Star
//                         key={i}
//                         className="w-5 h-5 fill-yellow-400 text-yellow-400"
//                       />
//                     ))}
//                   </div>
//                   <button
//                     onClick={() => handleSelect(testimonial._id)}
//                     disabled={
//                       !isEditing && !tempSelectedIds.includes(testimonial._id)
//                     }
//                     className={`w-6 h-6 rounded border ${
//                       tempSelectedIds.includes(testimonial._id)
//                         ? "bg-blue-500 border-blue-500 text-white"
//                         : isEditing
//                         ? "border-gray-300 hover:border-blue-500"
//                         : "border-gray-200 bg-gray-100 cursor-not-allowed"
//                     }`}
//                   >
//                     {tempSelectedIds.includes(testimonial._id) && (
//                       <Check className="w-4 h-4 mx-auto" />
//                     )}
//                   </button>
//                 </div>
//                 <p className="text-gray-700 mb-4">{testimonial.comment}</p>
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p className="font-semibold text-gray-900">
//                       {`${testimonial.menteeId.firstName} ${testimonial.menteeId.lastName}`}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       {new Date(testimonial.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <span className="px-3 py-1 bg-gray-100 text-sm rounded-full text-gray-600">
//                     {testimonial.serviceId.type}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//           {totalPages > 1 && (
//             <div className="flex justify-center gap-2 mt-6">
//               <Button
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage(currentPage - 1)}
//                 className="bg-gray-900 text-white"
//               >
//                 Previous
//               </Button>
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                 (page) => (
//                   <Button
//                     key={page}
//                     variant={currentPage === page ? "default" : "outline"}
//                     onClick={() => setCurrentPage(page)}
//                     className={`${
//                       currentPage === page
//                         ? "bg-gray-900 text-white"
//                         : "bg-white text-gray-900"
//                     } border-gray-300`}
//                   >
//                     {page}
//                   </Button>
//                 )
//               )}
//               <Button
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage(currentPage + 1)}
//                 className="bg-gray-900 text-white"
//               >
//                 Next
//               </Button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Check,
  Star,
  Search,
  Filter,
  Users,
  TrendingUp,
  Phone,
  MessageCircle,
  FileText,
  Calendar,
  ChevronDown,
  StarIcon,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getTestimonialsByMentor,
  updateTopTestimonials,
} from "@/services/testimonialService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TestimonialCategory =
  | "All"
  | "1:1 Call"
  | "PriorityDM"
  | "Digital Products";
type RatingFilter = "All" | "High" | "Low";
type SortOption = "Highest" | "Lowest" | "Newest" | "Oldest";

interface Testimonial {
  _id: string;
  comment: string;
  rating: number;
  menteeId: { firstName: string; lastName: string };
  serviceId: { title: string; type: string };
  createdAt: string;
}

export default function TestimonialPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<TestimonialCategory>("All");
  const [selectedRating, setSelectedRating] = useState<RatingFilter>("All");
  const [sortOption, setSortOption] = useState<SortOption>("Newest");
  const [selectedTestimonialIds, setSelectedTestimonialIds] = useState<
    string[]
  >([]);
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTestimonials, setTotalTestimonials] = useState(0);

  const testimonialsPerPage = 9;

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const response = await getTestimonialsByMentor(
        currentPage,
        testimonialsPerPage
      );

      console.log(
        "Mentor Testimonoial page fetchTestimonials step 1",
        response
      );

      setTestimonials(response.testimonials);
      setTotalTestimonials(response.total);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
      toast.error("Failed to load testimonials");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [currentPage]);

  const handleCategoryChange = (category: TestimonialCategory) => {
    setSelectedCategory(category);
  };

  const handleRatingChange = (rating: RatingFilter) => {
    setSelectedRating(rating);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort);
  };

  const handleSelect = (id: string) => {
    if (!isEditing) return;

    setTempSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((tid) => tid !== id);
      } else if (prev.length >= 5) {
        toast.error("You can select up to 5 testimonials only.");
        return prev;
      } else {
        return [...prev, id];
      }
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTempSelectedIds(selectedTestimonialIds);
  };

  const handleSave = async () => {
    try {
      console.log("tempSelectedIds is ", tempSelectedIds);

      await updateTopTestimonials(tempSelectedIds);
      setSelectedTestimonialIds(tempSelectedIds);
      setIsEditing(false);
      toast.success("Selections saved successfully!");
    } catch (error) {
      console.error("Failed to save testimonials:", error);
      toast.error("Failed to save selections");
    }
  };

  const handleCancel = () => {
    setTempSelectedIds(selectedTestimonialIds);
    setIsEditing(false);
  };

  const filteredTestimonials = testimonials
    .filter((t) => {
      if (selectedCategory !== "All" && t.serviceId.type !== selectedCategory)
        return false;
      if (selectedRating === "High" && t.rating < 4) return false;
      if (selectedRating === "Low" && t.rating >= 4) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOption === "Highest") return b.rating - a.rating;
      if (sortOption === "Lowest") return a.rating - b.rating;
      if (sortOption === "Newest")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sortOption === "Oldest")
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      return 0;
    });

  const categories: TestimonialCategory[] = [
    "All",
    "1:1 Call",
    "PriorityDM",
    "Digital Products",
  ];
  const ratingFilters: RatingFilter[] = ["All", "High", "Low"];
  const sortOptions: SortOption[] = ["Highest", "Lowest", "Newest", "Oldest"];
  const totalPages = Math.ceil(totalTestimonials / testimonialsPerPage);

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "1:1 Call":
        return <Phone className="h-4 w-4" />;
      case "PriorityDM":
        return <MessageCircle className="h-4 w-4" />;
      case "Digital Products":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getServiceTypeBadge = (type: string) => {
    const baseClasses =
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold";

    switch (type) {
      case "1:1 Call":
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300`;
      case "PriorityDM":
        return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300`;
      case "Digital Products":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300`;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-slate-300 dark:text-slate-600"
        }`}
      />
    ));
  };

  const averageRating =
    testimonials.length > 0
      ? (
          testimonials.reduce((sum, t) => sum + t.rating, 0) /
          testimonials.length
        ).toFixed(1)
      : "0.0";

  const renderNoTestimonials = () => (
    <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
      <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-lg mb-6">
        <Star className="h-12 w-12 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
        No Testimonials Yet
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-center max-w-md">
        No testimonials to display. Keep providing great mentorship to receive
        feedback from your mentees!
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Loading testimonials...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pl-20 max-w-7xl mx-auto px-6 py-8 space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Testimonials Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
            Manage and showcase your mentee reviews
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {totalTestimonials}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Total Reviews
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {averageRating}
                </span>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Average Rating
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <Button
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Top Testimonials
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Save Selection
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="px-6 py-3 rounded-lg border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
          {isEditing && (
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Selected: {tempSelectedIds.length}/5
            </div>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
              <Filter className="h-4 w-4" />
            </div>
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => handleCategoryChange(category)}
                variant="outline"
                className={`rounded-full border-2 px-6 py-2 font-semibold transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-blue-400"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Select
              value={selectedRating}
              onValueChange={(value: RatingFilter) => handleRatingChange(value)}
            >
              <SelectTrigger className="w-40 rounded-lg bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {ratingFilters.map((rating) => (
                  <SelectItem key={rating} value={rating}>
                    {rating} Rating{rating !== "All" ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sortOption}
              onValueChange={(value: SortOption) => handleSortChange(value)}
            >
              <SelectTrigger className="w-40 rounded-lg bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {sortOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      {filteredTestimonials.length === 0 ? (
        renderNoTestimonials()
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial._id}
              className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg border transition-all duration-200 hover:shadow-xl hover:scale-[1.02] ${
                tempSelectedIds.includes(testimonial._id)
                  ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <div className="p-6">
                {/* Header with Rating and Selection */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-1">
                    {renderStars(testimonial.rating)}
                    <span className="ml-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {testimonial.rating}/5
                    </span>
                  </div>
                  <button
                    onClick={() => handleSelect(testimonial._id)}
                    disabled={
                      !isEditing && !tempSelectedIds.includes(testimonial._id)
                    }
                    className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                      tempSelectedIds.includes(testimonial._id)
                        ? "bg-blue-500 border-blue-500 text-white shadow-lg"
                        : isEditing
                        ? "border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        : "border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-700 cursor-not-allowed opacity-50"
                    }`}
                  >
                    {tempSelectedIds.includes(testimonial._id) && (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Comment */}
                <div className="mb-6">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-4">
                    "{testimonial.comment}"
                  </p>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-end">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-slate-400" />
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {`${testimonial.menteeId.firstName} ${testimonial.menteeId.lastName}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {new Date(testimonial.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div
                    className={getServiceTypeBadge(testimonial.serviceId.type)}
                  >
                    {getServiceIcon(testimonial.serviceId.type)}
                    {testimonial.serviceId.type}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-slate-600 dark:text-slate-400 text-sm">
              Showing page {currentPage} of {totalPages} ({totalTestimonials}{" "}
              total testimonials)
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                className="px-4 py-2 rounded-lg border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
              >
                Previous
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      className={`w-10 h-10 rounded-lg font-semibold ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                className="px-4 py-2 rounded-lg border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
