export type TestimonialCategory =
  | "All"
  | "1:1 Call"
  | "PriorityDM"
  | "Digital Products";

export type RatingFilter = "All" | "High" | "Low";

export type SortOption = "Highest" | "Lowest" | "Newest" | "Oldest";

export interface Testimonial {
  id: string;
  content: string;
  rating: number;
  authorName: string;
  date: string;
  category: Exclude<TestimonialCategory, "All">;
  selected?: boolean;
}

interface FilterBarProps {
  selectedCategory: TestimonialCategory;
  selectedRating: RatingFilter;
  sortOption: SortOption;
  onCategoryChange: (category: TestimonialCategory) => void;
  onRatingChange: (rating: RatingFilter) => void;
  onSortChange: (sort: SortOption) => void;
}

export default function FilterBar({
  selectedCategory,
  selectedRating,
  sortOption,
  onCategoryChange,
  onRatingChange,
  onSortChange,
}: FilterBarProps) {
  const categories: TestimonialCategory[] = [
    "All",
    "1:1 Call",
    "PriorityDM",
    "Digital Products",
  ];
  const ratingFilters: RatingFilter[] = ["All", "High", "Low"];
  const sortOptions: SortOption[] = ["Highest", "Lowest", "Newest", "Oldest"];

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
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
        <select
          value={selectedRating}
          onChange={(e) => onRatingChange(e.target.value as RatingFilter)}
          className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          {ratingFilters.map((filter) => (
            <option key={filter} value={filter}>
              {filter} Ratings
            </option>
          ))}
        </select>
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
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
  );
}
