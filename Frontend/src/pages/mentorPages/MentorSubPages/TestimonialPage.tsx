"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Check, Star } from "lucide-react";
import toast from "react-hot-toast";
import {
  getTestimonialsByMentor,
  updateTopTestimonials,
} from "@/services/testimonialService";

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

      // Replace "mentorId" with actual mentor ID from auth context
      setTestimonials(response.testimonials);
      setTotalTestimonials(response.total);
      // Fetch selected testimonials from mentor profile (you may need to add an API call for this)
      // For now, assume selectedTestimonialIds is fetched or empty
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

  return (
    <div className="p-6 mx-36">
      <h1 className="text-2xl font-bold mb-6">Testimonials</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          {!isEditing && (
            <Button
              onClick={handleEdit}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </Button>
          )}
          {isEditing && (
            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-blue-500 text-white">
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="flex gap-4 ml-auto">
          {/* <select
            value={selectedRating}
            onChange={(e) => handleRatingChange(e.target.value as RatingFilter)}
            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            {ratingFilters.map((filter) => (
              <option key={filter} value={filter}>
                {filter} Ratings
              </option>
            ))}
          </select> */}
          <select
            value={sortOption}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                Sort: {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isLoading ? (
        <div className="text-center py-4">Loading testimonials...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                className="bg-white rounded-lg shadow-md p-6 relative"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => handleSelect(testimonial._id)}
                    disabled={
                      !isEditing && !tempSelectedIds.includes(testimonial._id)
                    }
                    className={`w-6 h-6 rounded border ${
                      tempSelectedIds.includes(testimonial._id)
                        ? "bg-blue-500 border-blue-500 text-white"
                        : isEditing
                        ? "border-gray-300 hover:border-blue-500"
                        : "border-gray-200 bg-gray-100 cursor-not-allowed"
                    }`}
                  >
                    {tempSelectedIds.includes(testimonial._id) && (
                      <Check className="w-4 h-4 mx-auto" />
                    )}
                  </button>
                </div>
                <p className="text-gray-700 mb-4">{testimonial.comment}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {`${testimonial.menteeId.firstName} ${testimonial.menteeId.lastName}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(testimonial.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-sm rounded-full text-gray-600">
                    {testimonial.serviceId.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="bg-gray-900 text-white"
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className={`${
                      currentPage === page
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-900"
                    } border-gray-300`}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="bg-gray-900 text-white"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
