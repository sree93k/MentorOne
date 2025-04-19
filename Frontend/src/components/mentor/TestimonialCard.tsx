import { Check, Star } from "lucide-react";
import { Testimonial } from "./FilterBar";

interface TestimonialCardProps {
  testimonial: Testimonial;
  onSelect: (id: string) => void;
  isSelected: boolean;
  canSelect: boolean;
}

export default function TestimonialCard({
  testimonial,
  onSelect,
  isSelected,
  canSelect,
}: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-1">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <button
          onClick={() => onSelect(testimonial.id)}
          disabled={!canSelect && !isSelected}
          className={`w-6 h-6 rounded border ${
            isSelected
              ? "bg-blue-500 border-blue-500 text-white"
              : canSelect
              ? "border-gray-300 hover:border-blue-500"
              : "border-gray-200 bg-gray-100 cursor-not-allowed"
          }`}
        >
          {isSelected && <Check className="w-4 h-4 mx-auto" />}
        </button>
      </div>
      <p className="text-gray-700 mb-4">{testimonial.content}</p>
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-gray-900">
            {testimonial.authorName}
          </p>
          <p className="text-sm text-gray-500">{testimonial.date}</p>
        </div>
        <span className="px-3 py-1 bg-gray-100 text-sm rounded-full text-gray-600">
          {testimonial.category}
        </span>
      </div>
    </div>
  );
}
