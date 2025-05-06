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
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import logo from "@/assets/logo.png";
import SreeImg from "@/assets/Sree.jpeg";
import JasnaImg from "@/assets/Jasna.jpeg";
import JithinImg from "@/assets/Jithin.jpeg";
import AnotaImg from "@/assets/Anita.jpeg";
// Mock data for mentors
const mockMentors = [
  {
    userId: "user1",
    mentorId: "mentor1",
    name: "Sreekuttan",
    bio: "Leadership coach with 10+ years of experience helping professionals reach their full potential.",
    role: "Leadership Coach",
    work: "Google",
    workRole: "Senior Manager",
    profileImage: SreeImg,
    badge: "Premium",
    expertise: ["Career Growth", "Leadership"],
    isBlocked: false,
    isApproved: true,
  },
  {
    userId: "user2",
    mentorId: "mentor2",
    name: "Jasna Jaffer",
    bio: "Tech industry veteran helping newcomers navigate their career path in software development.",
    role: "Tech Mentor",
    work: "Microsoft",
    workRole: "Principal Engineer",
    profileImage: JasnaImg,
    badge: "Featured",
    expertise: ["Mock Interview", "Resume Review"],
    isBlocked: false,
    isApproved: true,
  },
  {
    userId: "user3",
    mentorId: "mentor3",
    name: "Jithin P",
    bio: "Specializing in resume reviews and interview preparation for tech positions.",
    role: "Career Coach",
    work: "LinkedIn",
    workRole: "HR Director",
    profileImage: JithinImg,
    badge: "Top Rated",
    expertise: ["Interview Prep", "Career Guide"],
    isBlocked: false,
    isApproved: true,
  },
  {
    userId: "user4",
    mentorId: "mentor4",
    name: "Anita Jose",
    bio: "Data science expert with a passion for mentoring aspiring analysts and scientists.",
    role: "Data Science Mentor",
    work: "Amazon",
    workRole: "Lead Data Scientist",
    profileImage: AnotaImg,
    badge: "Top Rated",
    expertise: ["Data Analysis", "Machine Learning"],
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
    image:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2800&auto=format&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2800&auto=format&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2800&auto=format&fit=crop",
  },
  {
    id: "course4",
    title: "Python",
    subtitle: "Python for Data Science",
    episodes: "15 Episodes",
    duration: "20 hours",
    level: "Intermediate",
    rating: 4.8,
    views: "6.3k",
    image:
      "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=2800&auto=format&fit=crop",
  },
];

// Testimonials for infinite cards
const testimonials = [
  {
    quote:
      "Working with my mentor completely transformed my career trajectory. I went from being stuck in a junior role to landing my dream job in just 3 months.",
    name: "Alex Rivera",
    title: "Frontend Developer",
    image:
      "https://images.unsplash.com/photo-1504707748692-419802cf939d?q=80&w=2800&auto=format&fit=crop",
  },
  {
    quote:
      "The resume review service was incredible. My mentor pointed out issues I never would have noticed and helped me craft a resume that actually got callbacks.",
    name: "Jasmine Chen",
    title: "Product Manager",
    image:
      "https://images.unsplash.com/photo-1516321497487-09736e785f47?q=80&w=2800&auto=format&fit=crop",
  },
  {
    quote:
      "The mock interviews were challenging but incredibly helpful. My mentor gave me constructive feedback that helped me ace my actual interviews.",
    name: "Raj Patel",
    title: "Data Scientist",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab0c?q=80&w=2800&auto=format&fit=crop",
  },
  {
    quote:
      "I was hesitant about paying for mentorship, but it was worth every penny. My mentor provided insights that I couldn't find anywhere else.",
    name: "Emma Wilson",
    title: "UX Designer",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2800&auto=format&fit=crop",
  },
];

// Services grid data
const grid = [
  {
    title: "Internship Preparation",
    description:
      "Our applications are HIPAA and SOC2 compliant, your data is safe with us, always.",
  },
  {
    title: "Mock Interview",
    description:
      "Schedule and automate your social media posts across multiple platforms to save time and maintain a consistent online presence.",
  },
  {
    title: "Resume Review",
    description:
      "Gain insights into your social media performance with detailed analytics and reporting tools to measure engagement and ROI.",
  },
  {
    title: "One - One Sessions",
    description:
      "Plan and organize your social media content with an intuitive calendar view, ensuring you never miss a post.",
  },
  {
    title: "Project Guidance",
    description:
      "Reach the right audience with advanced targeting options, including demographics, interests, and behaviors.",
  },
  {
    title: "Referral",
    description:
      "Monitor social media conversations and trends to stay informed about what your audience is saying and respond in real-time.",
  },
];

// AceternityLogo Component
const AceternityLogo = () => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 66 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-3 w-3 text-black dark:text-white"
    >
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="15"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
      />
    </svg>
  );
};

// Grid Pattern Component
export function GridPattern({ width, height, x, y, squares, ...props }: any) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]: any) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}

// Grid Component
export const Grid = ({
  pattern,
  size,
}: {
  pattern?: number[][];
  size?: number;
}) => {
  const p = pattern ?? [
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 from-zinc-100/30 to-zinc-300/30 dark:to-zinc-900/30 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full mix-blend-overlay dark:fill-white/10 dark:stroke-white/10 stroke-black/10 fill-black/10"
        />
      </div>
    </div>
  );
};

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
      <div className="h-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 via-blue-900 to-indigo-800 opacity-90 z-10"></div>
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
        <div className="absolute left-1/2 top-2 transform -translate-x-1/2 z-20">
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
      <div className="bg-white pt-6 pb-6 px-6 relative z-20">
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-4">
          <div className="flex items-center px-3 py-1 bg-yellow-400 rounded-full text-sm font-bold text-gray-900 shadow-lg">
            <Star className="w-4 h-4 mr-1 fill-gray-900" />
            4.8
          </div>
        </div>
        <div className="text-center mb-4">
          <h3 className="font-bold text-xl text-gray-900">{mentor.name}</h3>
          <div className="flex items-center justify-center text-sm text-gray-600">
            <span className="font-medium">{mentor.workRole}</span>
            <span className="mx-1">@</span>
            <span className="text-gray-900 font-semibold">{mentor.work}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm text-center mb-4 line-clamp-2">
          {mentor.bio}
        </p>
        {/* <div className="flex flex-wrap justify-center gap-2 mb-5">
          {mentor.expertise.map((exp, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
            >
              {exp}
            </span>
          ))}
        </div> */}
        <div className="flex gap-2 px-4">
          <Button className="flex-1 bg-black hover:bg-gray-800 text-white transition-colors shadow-md">
            View Profile
          </Button>
          {/* <Button
            variant="outline"
            className="w-10 h-10 p-0 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
          >
            <Heart className="w-4 h-4 text-red-500" />
          </Button> */}
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
      <div className="relative overflow-hidden h-48">
        <img
          src={course.image}
          alt={course.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
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
      <div className="p-4">
        <h4 className="font-medium text-gray-900">{course.subtitle}</h4>
        <div className="flex items-center text-gray-500 text-sm mt-2 mb-3">
          <BookOpen className="w-4 h-4 mr-1" />
          <span>{course.episodes}</span>
          <span className="mx-2">•</span>
          <Users className="w-4 h-4 mr-1" />
          <span>{course.views} students</span>
        </div>
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
  } as React.CSSProperties;

  return (
    <div className="relative overflow-hidden w-full">
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white to-transparent"></div>
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white to-transparent"></div>
      <div
        className="flex gap-4 py-4"
        style={{
          ...containerStyles,
          animation: `scroll-${direction} var(--animation-duration) linear infinite`,
        }}
      >
        {[...items, ...items].map((item, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-72 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-6 shadow-md"
          >
            <div className="flex gap-4 items-start mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-blue-100">
                <img
                  src={item.image}
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

// MenteeDashboard Component
const MenteeDashboard: React.FC = () => {
  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <>
      <div className="px-18">
        <div className="h-[35rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
          <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
            Mentor ONE
          </h1>
          <div className="w-[40rem] h-40 relative">
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={1200}
              className="w-full h-full"
              particleColor="#FFFFFF"
            />
            <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
          </div>
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-12">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
            >
              <AceternityLogo />
              <span>Get Start Now</span>
            </HoverBorderGradient>
          </div>
        </div>

        <div className="px-24">
          <section className="mb-8 mt-6">
            <h2 className="text-xl font-bold mb-4">
              Explore the Services You Need To Get Support
            </h2>
            <div className="py-6 lg:py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 md:gap-2 max-w-7xl mx-auto">
                {grid.map((feature) => (
                  <div
                    key={feature.title}
                    className="relative bg-gradient-to-b dark:from-neutral-900 from-neutral-300 dark:to-neutral-950 to-white p-6 rounded-3xl overflow-hidden"
                  >
                    <Grid size={20} />
                    <p className="text-base font-bold text-neutral-800 dark:text-white relative z-20">
                      {feature.title}
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-4 text-base font-normal relative z-20">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <Button variant="outline" className="mt-4">
              More
            </Button>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Top Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockCourses.map((course) => (
                <StylishCourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Top Mentors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockMentors.map((mentor) => (
                <StylishMentorCard key={mentor.userId} mentor={mentor} />
              ))}
            </div>
          </section>
        </div>
      </div>
      <section>
        <div className="rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden mt-10 gap-4">
          <StylishInfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
          <div className="w-full" style={{ marginLeft: "-150px" }}>
            <StylishInfiniteMovingCards
              items={testimonials}
              direction="right"
              speed="fast"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default MenteeDashboard;
