"use client";

import { useState, useEffect } from "react";
import FilterBar from "@/components/mentor/FilterBar";
import TestimonialCard from "@/components/mentor/TestimonialCard";
import {
  Testimonial,
  TestimonialCategory,
  RatingFilter,
  SortOption,
} from "@/components/mentor/FilterBar";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";

const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    content: "The 1:1 session was amazing. Super insightful!",
    rating: 5,
    authorName: "Arjun Mehta",
    date: "2023-10-01",
    category: "1:1 Call",
  },
  {
    id: "2",
    content: "Priority DM was quick and solved my doubts efficiently.",
    rating: 4,
    authorName: "Sara Iqbal",
    date: "2023-09-20",
    category: "PriorityDM",
  },
  {
    id: "3",
    content: "The templates saved me hours of work. Highly recommend!",
    rating: 5,
    authorName: "Kunal Patel",
    date: "2023-08-25",
    category: "Digital Products",
  },
  {
    id: "4",
    content:
      "Very informative call. Cleared a lot of confusion about career roadmap.",
    rating: 5,
    authorName: "Meera Raj",
    date: "2023-07-30",
    category: "1:1 Call",
  },
  {
    id: "5",
    content: "Got a response in under 2 hours. Loved the support!",
    rating: 4,
    authorName: "Ravi Sharma",
    date: "2023-06-18",
    category: "PriorityDM",
  },
  {
    id: "6",
    content: "Digital downloads were useful but could be more detailed.",
    rating: 3,
    authorName: "Ananya Nair",
    date: "2023-05-12",
    category: "Digital Products",
  },
  {
    id: "7",
    content: "1:1 mentoring gave me clarity on switching to frontend dev.",
    rating: 5,
    authorName: "Mohit Verma",
    date: "2023-04-07",
    category: "1:1 Call",
  },
  {
    id: "8",
    content: "Quick response and accurate suggestions. Appreciate the help.",
    rating: 4,
    authorName: "Tanya Kaur",
    date: "2023-03-14",
    category: "PriorityDM",
  },
  {
    id: "9",
    content: "Loved the resume templates and bonus guides!",
    rating: 5,
    authorName: "Neeraj Pillai",
    date: "2023-02-05",
    category: "Digital Products",
  },
  {
    id: "10",
    content: "Helpful insights during the live session. Would book again.",
    rating: 5,
    authorName: "Priya Bansal",
    date: "2023-01-22",
    category: "1:1 Call",
  },
];

export default function TestimonialPage() {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(mockTestimonials);
  const [selectedCategory, setSelectedCategory] =
    useState<TestimonialCategory>("All");
  const [selectedRating, setSelectedRating] = useState<RatingFilter>("All");
  const [sortOption, setSortOption] = useState<SortOption>("Newest");
  const [selectedTestimonialIds, setSelectedTestimonialIds] = useState<
    string[]
  >([]);
  const [isEditing, setIsEditing] = useState(false);
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);

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

  const handleSave = () => {
    setSelectedTestimonialIds(tempSelectedIds);
    setIsEditing(false);
    toast.success("Selections saved successfully!");
  };

  const handleCancel = () => {
    setTempSelectedIds(selectedTestimonialIds);
    setIsEditing(false);
  };

  const filteredTestimonials = testimonials
    .filter((t) => {
      if (selectedCategory !== "All" && t.category !== selectedCategory)
        return false;
      if (selectedRating === "High" && t.rating < 4) return false;
      if (selectedRating === "Low" && t.rating >= 4) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOption === "Highest") return b.rating - a.rating;
      if (sortOption === "Lowest") return a.rating - b.rating;
      if (sortOption === "Newest")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortOption === "Oldest")
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      return 0;
    });

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
      <FilterBar
        selectedCategory={selectedCategory}
        selectedRating={selectedRating}
        sortOption={sortOption}
        onCategoryChange={handleCategoryChange}
        onRatingChange={handleRatingChange}
        onSortChange={handleSortChange}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestimonials.map((testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            onSelect={handleSelect}
            isSelected={tempSelectedIds.includes(testimonial.id)}
            canSelect={isEditing}
          />
        ))}
      </div>
    </div>
  );
}
