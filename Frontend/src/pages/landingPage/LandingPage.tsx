import React, { useState, useEffect, useId } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import {
  GraduationCap,
  Users,
  MessageSquare,
  BarChart,
  Star,
  Clock,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import SimpleContainer from "@/common/Container";
import Banner from "../../assets/Banner1.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { SparklesCore } from "@/components/ui/sparkles";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardData } from "@/services/menteeService";
import SreeImg from "@/assets/Sree.jpeg";
import JasnaImg from "@/assets/Jasna.jpeg";
import JithinImg from "@/assets/Jithin.jpeg";
import AnotaImg from "@/assets/Anita.jpeg";
import GradientBackgroundText from "@/components/mentee/AnimatedGradientText";

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
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "The mock interviews were challenging but incredibly helpful. My mentor gave me constructive feedback that helped me ace my actual interviews.",
    name: "Raj Patel",
    title: "Data Scientist",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "I was hesitant about paying for mentorship, but it was worth every penny. My mentor provided insights that I couldn't find anywhere else.",
    name: "Emma Wilson",
    title: "UX Designer",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2800&auto=format&fit=crop",
  },
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
      "https://img.freepik.com/free-vector/tiktok-profile-picture-template_742173-4482.jpg?t=st=1749964030~exp=1749967630~hmac=7df7e5e3ccbe58b53d43fef90c8d890182fa4aad2fa19f3b14d822940c153a85&w=1800",
  },
  {
    quote:
      "The mock interviews were challenging but incredibly helpful. My mentor gave me constructive feedback that helped me ace my actual interviews.",
    name: "Raj Patel",
    title: "Data Scientist",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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

// Features data for Why Choose MENTOR ONE?
const features = [
  {
    icon: GraduationCap,
    title: "Expert Mentorship",
    description:
      "Connect with industry professionals and gain valuable insights",
  },
  {
    icon: Users,
    title: "Personalized Matching",
    description: "Find the perfect mentor based on your goals and interests",
  },
  {
    icon: MessageSquare,
    title: "Seamless Communication",
    description: "Stay connected through our integrated messaging platform",
  },
  {
    icon: BarChart,
    title: "Progress Tracking",
    description: "Monitor your growth with detailed progress analytics",
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

// Enhanced Feature Card Component for Why Choose MENTOR ONE?
const StylishFeatureCard = ({ feature }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative bg-gradient-to-b from-neutral-100 to-white dark:from-neutral-800 dark:to-neutral-900 rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 15px 30px rgba(0, 0, 0, 0.2)"
          : "0 5px 15px rgba(0, 0, 0, 0.1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 z-0 opacity-20">
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={40}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      <div className="relative z-10 p-6 text-center">
        <div className="mb-4 flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mx-auto">
          <feature.icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          {feature.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {feature.description}
        </p>
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

  const badge =
    mentor.averageRating >= 4.5
      ? "Top Rated"
      : mentor.bookingCount > 50
      ? "Premium"
      : "Featured";

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
              src={
                mentor.profilePicture ||
                mentor.profileImage ||
                "/default-avatar.png"
              }
              alt={mentor.name || `${mentor.firstName} ${mentor.lastName}`}
              onLoad={() => setIsImageLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-500 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              } ${isHovered ? "scale-110" : "scale-100"}`}
            />
          </div>
        </div>
        <div className="absolute right-5 top-5 z-30">
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${badgeColors[badge]}`}
          >
            {badge}
          </div>
        </div>
      </div>
      <div className="bg-white pt-6 pb-6 px-6 relative z-20">
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-4">
          <div className="flex items-center px-3 py-1 bg-yellow-400 rounded-full text-sm font-bold text-gray-900 shadow-lg">
            <Star className="w-4 h-4 mr-1 fill-gray-900" />
            {(mentor.averageRating || 4.8).toFixed(1)}
          </div>
        </div>
        <div className="text-center mb-4">
          <h3 className="font-bold text-xl text-gray-900">
            {mentor.name || `${mentor.firstName} ${mentor.lastName}`}
          </h3>
          <div className="flex items-center justify-center text-sm text-gray-600">
            <span className="font-medium">
              {mentor.workRole ||
                mentor.mentorId?.bio.split(" ").slice(0, 3).join(" ") + "..."}
            </span>
            {mentor.work && (
              <>
                <span className="mx-1">@</span>
                <span className="text-gray-900 font-semibold">
                  {mentor.work}
                </span>
              </>
            )}
          </div>
        </div>
        <p className="text-gray-600 text-sm text-center mb-4 line-clamp-2">
          {mentor.bio || mentor.mentorId?.bio}
        </p>
        <div className="flex gap-2 px-4">
          <Button className="flex-1 bg-black hover:bg-gray-800 text-white transition-colors shadow-md">
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Course Card Component
const StylishCourseCard = ({ service }) => {
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
          src={
            service.image ||
            service.mentorProfileImage ||
            "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2800&auto=format&fit=crop"
          }
          alt={service.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex justify-between items-center mb-1">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              {service.level || service.type}
            </span>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span className="text-xs">
                {service.duration || `${service.duration} mins`}
              </span>
            </div>
          </div>
          <h3 className="font-bold text-lg">{service.title}</h3>
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-medium text-gray-600">
          {service.subtitle || service.shortDescription}
        </h4>
        <div className="flex items-center text-gray-500 text-sm mt-2 mb-3">
          <span>{service.mentorName || service.episodes}</span>
          <span className="mx-2">•</span>
          <Users className="w-4 h-4 mr-1" />
          <span>{service.views || service.bookingCount} students</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-yellow-500 font-medium mr-1">
              {(service.rating || service.averageRating || 4.8).toFixed(1)}
            </span>
            <div className="flex">
              {[...Array(5).keys()].map((i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i <
                    Math.floor(service.rating || service.averageRating || 4.8)
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
  direction = "right",
  speed = "normal",
}) => {
  const containerRef = useId();

  const containerStyles = {
    "--animation-duration":
      speed === "fast" ? "10s" : speed === "slow" ? "20s" : "30s",
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
            className="flex-shrink-0 w-72 rounded-2xl bg-gradient-to-br from-blue-50 to-white dark:from-indigo-950 dark:to-gray-900 border border-blue-100 dark:border-blue-800 p-5 shadow-md"
          >
            <div className="flex gap-4 items-start mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-blue-100 dark:border-blue-300">
                <img
                  src={
                    item.image ||
                    item.menteeId?.profilePicture ||
                    "/default-avatar.jpg"
                  }
                  alt={
                    item.name ||
                    `${item.menteeId?.firstName} ${item.menteeId?.lastName}`
                  }
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">
                  {item.name ||
                    `${item.menteeId?.firstName} ${item.menteeId?.lastName}`}
                </h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {item.title || item.serviceId?.title}
                </p>
              </div>
            </div>
            <blockquote className="italic text-gray-600 dark:text-gray-300 text-sm mb-4">
              "{item.quote || item.comment}"
            </blockquote>
            <div className="flex">
              {[...Array(Math.floor(item.rating || 5)).keys()].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scroll-right {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @keyframes scroll-left {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

// LandingPage Component
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<{
    topServices: any[];
    topMentors: any[];
    topTestimonials: any[];
  }>({ topServices: [], topMentors: [], topTestimonials: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleGetStarted = () => {
    navigate("/login");
  };

  const words = [
    {
      text: "Frequntly",
      className: "dark:text-black dark:text-white",
    },
    {
      text: "Asked",
      className: "dark:text-black dark:text-white",
    },
    {
      text: "Questions.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (err: any) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  // Determine which data to display
  const displayMentors =
    dashboardData.topMentors.length === 8
      ? dashboardData.topMentors
      : mockMentors;
  const displayServices =
    dashboardData.topServices.length === 8 ? dashboardData.topServices : grid;
  const displayTopServices =
    dashboardData.topServices.length === 8
      ? dashboardData.topServices.slice(0, 4)
      : mockCourses;
  const displayTestimonials =
    dashboardData.topTestimonials.length >= 20
      ? dashboardData.topTestimonials
      : testimonials;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-black text-white pt-16 md:pt-24 pb-12 md:pb-20 mt-16 relative overflow-hidden dark:bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/40 z-10" />
        <SimpleContainer className="relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="max-w-xl mx-auto px-4 md:px-0">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Find Your Perfect Mentor
              </h1>
              <p className="text-xl md:text-2xl text-white/85 mb-6 font-normal leading-relaxed">
                Connect with experienced professionals who can guide you towards
                success
              </p>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
                <GradientBackgroundText
                  className="font-semibold px-6 py-2"
                  onClick={handleGetStarted}
                >
                  Get Started
                </GradientBackgroundText>
              </div>
            </div>
            <div className="max-w-xl mx-auto px-4 md:px-0">
              <img
                src={Banner}
                alt="Mentorship"
                className="w-full max-h-[500px] object-cover shadow-lg scale-90 md:scale-100 transition-transform duration-300"
              />
            </div>
          </div>
        </SimpleContainer>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-white dark:text-white dark:bg-gray-900">
        <SimpleContainer>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2">
            Why Choose MENTOR ONE?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground text-center mb-10 max-w-2xl mx-auto leading-relaxed">
            Experience the power of personalized mentorship with our
            comprehensive platform
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <StylishFeatureCard key={index} feature={feature} />
            ))}
          </div>
        </SimpleContainer>
      </section>

      {/* Services Grid Section */}
      <section className="py-12 md:py-20 bg-gray-50 dark:text-white dark:bg-gray-900 px-24">
        <SimpleContainer>
          <h2 className="text-xl font-bold mb-4">
            Explore the Services You Need To Get Support
          </h2>
          <div className="py-6 lg:py-6">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 md:gap-2 max-w-7xl mx-auto">
                {[...Array(6)].map((_, idx) => (
                  <Skeleton key={idx} className="h-40 w-full rounded-3xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 md:gap-2 max-w-7xl mx-auto">
                {displayServices.map((service) => (
                  <div
                    key={service._id || service.title}
                    className="relative bg-gradient-to-b dark:from-neutral-900 from-neutral-300 dark:to-neutral-950 to-white p-6 rounded-3xl overflow-hidden"
                  >
                    <Grid size={20} />
                    <p className="text-base font-bold text-neutral-800 dark:text-white relative z-20">
                      {service.title}
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-4 text-base font-normal relative z-20">
                      {service.shortDescription || service.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button variant="outline" className="mt-4">
            More
          </Button>
        </SimpleContainer>
      </section>

      {/* Top Services Section */}
      <section className="py-12 md:py-20 bg-white dark:text-white dark:bg-gray-900 px-24">
        <SimpleContainer>
          <h2 className="text-xl font-bold mb-4">Top Services</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, idx) => (
                <Skeleton key={idx} className="h-80 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayTopServices.map((service) => (
                <StylishCourseCard
                  key={service._id || service.id}
                  service={service}
                />
              ))}
            </div>
          )}
        </SimpleContainer>
      </section>

      {/* Top Mentors Section */}
      <section className="py-12 md:py-20 bg-gray-50 dark:text-white dark:bg-gray-900 px-24">
        <SimpleContainer>
          <h2 className="text-xl font-bold mb-4">Top Mentors</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, idx) => (
                <Skeleton key={idx} className="h-80 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayMentors.map((mentor) => (
                <StylishMentorCard
                  key={mentor._id || mentor.userId}
                  mentor={mentor}
                />
              ))}
            </div>
          )}
        </SimpleContainer>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-20 bg-white dark:bg-black dark:bg-grid-white/[0.05]">
        <SimpleContainer>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2">
            Success Stories
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground text-center mb-10 max-w-2xl mx-auto leading-relaxed">
            Hear from our community members who have transformed their careers
          </p>
          {isLoading ? (
            <Skeleton className="h-40 w-full max-w-4xl" />
          ) : (
            <>
              <StylishInfiniteMovingCards
                items={displayTestimonials.slice(
                  0,
                  Math.ceil(displayTestimonials.length / 2)
                )}
                direction="right"
                speed="slow"
              />
              <div className="w-full" style={{ marginLeft: "-150px" }}>
                <StylishInfiniteMovingCards
                  items={displayTestimonials.slice(
                    Math.ceil(displayTestimonials.length / 2)
                  )}
                  direction="right"
                  speed="fast"
                />
              </div>
            </>
          )}
        </SimpleContainer>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/40 z-10" />
        <SimpleContainer className="text-center max-w-3xl mx-auto relative z-20">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg md:text-xl text-white/85 mb-6 font-normal leading-relaxed">
            Join our community of mentors and mentees today
          </p>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 justify-center">
            <GradientBackgroundText
              className="font-semibold px-6 py-2"
              onClick={handleGetStarted}
            >
              Get Started Now
            </GradientBackgroundText>
          </div>
        </SimpleContainer>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20 bg-gray-50 dark:text-white dark:bg-gray-900">
        <SimpleContainer className="max-w-3xl mx-auto">
          <TypewriterEffectSmooth words={words} />
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that matches the other
                components' aesthetic.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>
                Yes. It's animated by default, but you can disable it if you
                prefer.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </SimpleContainer>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
