import React, { useState, useEffect, useId } from "react";
import {
  Star,
  Calendar,
  MessageCircle,
  BookOpen,
  Award,
  ExternalLink,
  Heart,
  Bookmark,
  Clock,
  Users,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SparklesCore } from "@/components/ui/sparkles";
import { motion } from "framer-motion";

// Mock data for demonstration
const mockMentors = [
  {
    userId: "user1",
    mentorId: "mentor1",
    name: "Sarah Johnson",
    bio: "Leadership coach with 10+ years of experience helping professionals reach their full potential.",
    role: "Leadership Coach",
    work: "Google",
    workRole: "Senior Manager",
    profileImage: "/api/placeholder/200/200",
    badge: "Premium",
    expertise: ["Career Growth", "Leadership"],
    isBlocked: false,
    isApproved: true,
  },
  {
    userId: "user2",
    mentorId: "mentor2",
    name: "Michael Chen",
    bio: "Tech industry veteran helping newcomers navigate their career path in software development.",
    role: "Tech Mentor",
    work: "Microsoft",
    workRole: "Principal Engineer",
    profileImage: "/api/placeholder/200/200",
    badge: "Featured",
    expertise: ["Mock Interview", "Resume Review"],
    isBlocked: false,
    isApproved: true,
  },
  {
    userId: "user3",
    mentorId: "mentor3",
    name: "Priya Patel",
    bio: "Specializing in resume reviews and interview preparation for tech positions.",
    role: "Career Coach",
    work: "LinkedIn",
    workRole: "HR Director",
    profileImage: "/api/placeholder/200/200",
    badge: "Top Rated",
    expertise: ["Interview Prep", "Career Guide"],
    isBlocked: false,
    isApproved: true,
  },
];

// Mock courses data
const mockCourses = [
  {
    id: "course1",
    title: "JavaScript",
    subtitle: "Namaste JavaScript",
    episodes: "10 Episodes",
    duration: "15 hours",
    level: "Intermediate",
    rating: 4.8,
    views: "5.2k",
    image: "/api/placeholder/400/250",
  },
  {
    id: "course2",
    title: "React.js",
    subtitle: "Advanced React Patterns",
    episodes: "8 Episodes",
    duration: "12 hours",
    level: "Advanced",
    rating: 4.9,
    views: "3.7k",
    image: "/api/placeholder/400/250",
  },
  {
    id: "course3",
    title: "Node.js",
    subtitle: "Backend Development",
    episodes: "12 Episodes",
    duration: "18 hours",
    level: "Beginner",
    rating: 4.7,
    views: "4.1k",
    image: "/api/placeholder/400/250",
  },
];

// Testimonials for infinite cards
const testimonials = [
  {
    quote:
      "Working with my mentor completely transformed my career trajectory. I went from being stuck in a junior role to landing my dream job in just 3 months.",
    name: "Alex Rivera",
    title: "Frontend Developer",
    image: "/api/placeholder/100/100",
  },
  {
    quote:
      "The resume review service was incredible. My mentor pointed out issues I never would have noticed and helped me craft a resume that actually got callbacks.",
    name: "Jasmine Chen",
    title: "Product Manager",
    image: "/api/placeholder/100/100",
  },
  {
    quote:
      "The mock interviews were challenging but incredibly helpful. My mentor gave me constructive feedback that helped me ace my actual interviews.",
    name: "Raj Patel",
    title: "Data Scientist",
    image: "/api/placeholder/100/100",
  },
  {
    quote:
      "I was hesitant about paying for mentorship, but it was worth every penny. My mentor provided insights that I couldn't find anywhere else.",
    name: "Emma Wilson",
    title: "UX Designer",
    image: "/api/placeholder/100/100",
  },
  {
    quote:
      "The personalized career roadmap my mentor created for me gave me clear direction on what skills to develop next. I'm now on track for a promotion.",
    name: "Marcus Johnson",
    title: "DevOps Engineer",
    image: "/api/placeholder/100/100",
  },
];

// Enhanced Mentor Card Component
const StylishMentorCard = ({ mentor }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const badgeColors = {
    Premium: "bg-gradient-to-r from-amber-500 to-yellow-500",
    Featured: "bg-gradient-to-r from-blue-500 to-indigo-600",
    "Top Rated": "bg-gradient-to-r from-emerald-500 to-green-600",
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl transition-all duration-300 group"
      style={{
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 20px 40px rgba(0, 0, 0, 0.2)"
          : "0 10px 30px rgba(0, 0, 0, 0.1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background with gradient overlay */}
      <div className="h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 via-blue-900 to-indigo-800 opacity-90 z-10"></div>

        {/* Moving particles background */}
        <div className="absolute inset-0 z-0 opacity-30">
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={60}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>

        {/* Profile image */}
        <div className="absolute left-1/2 top-16 transform -translate-x-1/2 z-20">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white transition-all duration-300 group-hover:border-yellow-400 shadow-xl">
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
            )}
            <img
              src={mentor.profileImage}
              alt={mentor.name}
              onLoad={() => setIsImageLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-500 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              } ${isHovered ? "scale-110" : "scale-100"}`}
            />
          </div>
        </div>

        {/* Badge */}
        <div className="absolute right-5 top-5 z-30">
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
              badgeColors[mentor.badge] || "bg-black"
            }`}
          >
            {mentor.badge}
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="bg-white pt-16 pb-6 px-6 relative z-20">
        {/* Rating */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-6">
          <div className="flex items-center px-3 py-1 bg-yellow-400 rounded-full text-sm font-bold text-gray-900 shadow-lg">
            <Star className="w-4 h-4 mr-1 fill-gray-900" />
            4.8
          </div>
        </div>

        {/* Name and title */}
        <div className="text-center mb-4">
          <h3 className="font-bold text-xl text-gray-900">{mentor.name}</h3>
          <div className="flex items-center justify-center text-sm text-gray-600">
            <span className="font-medium">{mentor.workRole}</span>
            <span className="mx-1">@</span>
            <span className="text-gray-900 font-semibold">{mentor.work}</span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-600 text-sm text-center mb-4 line-clamp-2">
          {mentor.bio}
        </p>

        {/* Expertise badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-5">
          {mentor.expertise.map((exp, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
            >
              {exp}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 px-4">
          <Button className="flex-1 bg-black hover:bg-gray-800 text-white transition-colors shadow-md">
            View Profile
          </Button>
          <Button
            variant="outline"
            className="w-10 h-10 p-0 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
          >
            <Heart className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Course Card Component
const StylishCourseCard = ({ course }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300"
      style={{
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 15px 30px rgba(0, 0, 0, 0.1)"
          : "0 5px 15px rgba(0, 0, 0, 0.05)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className="relative overflow-hidden h-48">
        <img
          src={course.image}
          alt={course.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

        {/* Course info on image */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex justify-between items-center mb-1">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              {course.level}
            </span>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span className="text-xs">{course.duration}</span>
            </div>
          </div>
          <h3 className="font-bold text-lg">{course.title}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="font-medium text-gray-900">{course.subtitle}</h4>

        <div className="flex items-center text-gray-500 text-sm mt-2 mb-3">
          <BookOpen className="w-4 h-4 mr-1" />
          <span>{course.episodes}</span>
          <span className="mx-2">•</span>
          <Users className="w-4 h-4 mr-1" />
          <span>{course.views} students</span>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-yellow-500 font-medium mr-1">
              {course.rating}
            </span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(course.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-800 p-0 hover:bg-transparent"
          >
            Details <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Infinite Moving Cards Component
const StylishInfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "normal",
}) => {
  const containerRef = useId();

  const containerStyles = {
    "--animation-duration":
      speed === "fast" ? "20s" : speed === "slow" ? "40s" : "30s",
  };

  return (
    <div className="relative overflow-hidden w-full">
      {/* Gradient edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white to-transparent"></div>
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white to-transparent"></div>

      {/* Moving content */}
      <div
        className="flex gap-4 py-4"
        style={{
          ...containerStyles,
          animation: `scroll-${direction} var(--animation-duration) linear infinite`,
        }}
      >
        {/* Double the items for seamless loop */}
        {[...items, ...items].map((item, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-72 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-6 shadow-md"
          >
            <div className="flex gap-4 items-start mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-blue-100">
                <img
                  src={item.image || "/api/placeholder/100/100"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{item.name}</h4>
                <p className="text-sm text-blue-600">{item.title}</p>
              </div>
            </div>
            <blockquote className="italic text-gray-700 text-sm">
              "{item.quote}"
            </blockquote>
            <div className="mt-4 flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add CSS animation */}
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

// Main component to showcase all the styled components
const StylishCards = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      {/* Mentors Section */}
      <section className="mb-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Our Top Mentors</h2>
          <p className="text-gray-600 mt-2">
            Connect with industry experts to accelerate your career growth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockMentors.map((mentor) => (
            <StylishMentorCard key={mentor.userId} mentor={mentor} />
          ))}
        </div>
      </section>

      {/* Courses Section */}
      <section className="mb-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Courses</h2>
          <p className="text-gray-600 mt-2">
            Expand your skills with our curated collection of expert-led courses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockCourses.map((course) => (
            <StylishCourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            What Our Community Says
          </h2>
          <p className="text-gray-600 mt-2 text-center">
            Real stories from professionals who transformed their careers
          </p>
        </div>

        <div className="py-8">
          <StylishInfiniteMovingCards
            items={testimonials}
            direction="left"
            speed="normal"
          />
          <div className="mt-8">
            <StylishInfiniteMovingCards
              items={testimonials}
              direction="right"
              speed="slow"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default StylishCards;
