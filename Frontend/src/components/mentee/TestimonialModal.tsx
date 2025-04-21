"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TestimonialsModalProps {
  onClose: () => void;
}

export default function TestimonialsModal({ onClose }: TestimonialsModalProps) {
  const testimonials = [
    {
      id: 1,
      rating: 5,
      text: "Their guidance is both insightful and encouraging and tailored to my goals. Thanks for the session.",
      author: "Keerthi Sasidharan",
      date: "11th August, 2024",
      pinned: true,
    },
    {
      id: 2,
      rating: 4,
      text: "Their guidance is both insightful and encouraging and tailored to my goals. Thanks for the session.",
      author: "Keerthi Sasidharan",
      date: "11th August, 2024",
    },
    {
      id: 3,
      rating: 4,
      text: "Their guidance is both insightful and encouraging and tailored to my goals. Thanks for the session.",
      author: "Keerthi Sasidharan",
      date: "11th August, 2024",
    },
  ];

  return (
    <div className="flex flex-col max-h-[80vh] overflow-y-auto bg-white p-4">
      <div className="flex items-center gap-2 mb-4">
        <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
        <span className="text-xl font-bold">4.9</span>
        <h2 className="text-xl font-bold">10 Testimonials</h2>
      </div>

      <div className="flex gap-2 mb-6">
        <Badge
          variant="outline"
          className="rounded-full flex items-center gap-1"
        >
          <span className="text-yellow-400 text-lg">👋</span>
          <span>6 Friendly</span>
        </Badge>
        <Badge
          variant="outline"
          className="rounded-full flex items-center gap-1"
        >
          <span className="text-yellow-400 text-lg">👋</span>
          <span>2 Helpful</span>
        </Badge>
        <Badge
          variant="outline"
          className="rounded-full flex items-center gap-1"
        >
          <span className="text-yellow-400 text-lg">👋</span>
          <span>2 Insightful</span>
        </Badge>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-sm text-gray-500">📌 Pinned</span>
        </div>
      </div>

      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="p-6 rounded-lg bg-orange-50 border border-orange-100"
          >
            <div className="flex items-center mb-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 font-medium">{testimonial.rating}/5</span>
            </div>
            <p className="mb-4">{testimonial.text}</p>
            <div className="font-medium">{testimonial.author}</div>
            <div className="text-sm text-gray-500">{testimonial.date}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
