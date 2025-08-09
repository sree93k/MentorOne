// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Youtube } from "lucide-react";
// import {
//   ArrowLeft,
//   Linkedin,
//   Globe,
//   Clock,
//   Star,
//   FileText,
// } from "lucide-react";

// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
//   TooltipProvider,
// } from "@/components/ui/tooltip";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";

// import DummyImage from "@/assets/DummyProfile.jpg";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "react-hot-toast";
// import { getMentorById } from "@/services/menteeService";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import { ProfilePicture } from "@/components/users/SecureMedia";

// interface Testimonial {
//   _id: string;
//   menteeId: { firstName: string; lastName: string };
//   mentorId: string;
//   serviceId: { title: string; type: string };
//   bookingId: string;
//   comment: string;
//   rating: number;
//   createdAt: string;
//   updatedAt: string;
// }

// interface Mentor {
//   _id: string;
//   userData: string;
//   mentorData: string;
//   name: string;
//   role: string;
//   work: string;
//   workRole: string;
//   topTestimonials: Testimonial[];
//   profileImage?: string;
//   badge: string;
//   isBlocked: boolean;
//   isApproved: string;
//   bio?: string;
//   skills?: string[];
//   linkedinURL?: string;
//   youtubeURL?: string;
//   portfolio?: string;
//   featuredArticle?: string;
//   services: {
//     _id: string;
//     type: string;
//     title: string;
//     shortDescription: string;
//     longDescription: string;
//     duration: string;
//     amount: number;
//   }[];
//   education?: {
//     schoolName?: string;
//     collegeName?: string;
//     city?: string;
//   };
//   workExperience?: {
//     company: string;
//     jobRole: string;
//     city?: string;
//   };
// }

// export default function MentorProfile() {
//   const [mentor, setMentor] = useState<Mentor | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { user, loading } = useSelector((state: RootState) => state.user);

//   useEffect(() => {
//     if (loading) return;
//     if (!user) {
//       toast.error("Please log in to view mentor profiles.");
//       navigate("/login");
//       return;
//     }

//     const fetchMentor = async () => {
//       if (!id) {
//         toast.error("Mentor ID is missing.");
//         navigate("/seeker/mentors");
//         return;
//       }
//       setIsLoading(true);
//       try {
//         console.log("-------------Mentordata is step 1", id);
//         const mentorData = await getMentorById(id);
//         console.log("-------------Mentordata is step 2", mentorData);
//         setMentor(mentorData);
//       } catch (error: any) {
//         console.error("Failed to fetch mentor:", error);
//         toast.error("Failed to load mentor details. Please try again.");
//         navigate("/seeker/mentors");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchMentor();
//   }, [id, user, loading, navigate]);

//   if (loading || isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!mentor) {
//     return <div>Mentor not found.</div>;
//   }

//   return (
//     <div className="flex min-h-screen bg-white">
//       <div>
//         <Button variant="ghost" className="pl-0" onClick={() => navigate(-1)}>
//           <ArrowLeft className="h-7 w-7" />
//         </Button>
//       </div>
//       <div className="flex-1 max-w-screen-xl mx-auto w-full p-2">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-black text-white p-6 flex flex-col">
//             <div className="flex flex-col items-center mb-6">
//               {/* <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
//                 <img
//                   src={mentor.profileImage || DummyImage}
//                   alt={mentor.name}
//                   className="w-full h-full object-cover"
//                 />
//               </div> */}
//               <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
//                 {mentor.profileImage ? (
//                   <ProfilePicture
//                     profilePicture={mentor.profileImage}
//                     userName={mentor.name}
//                     size="lg"
//                     className="w-full h-full object-cover rounded-full"
//                   />
//                 ) : (
//                   <img
//                     src={DummyImage}
//                     alt={mentor.name}
//                     className="w-full h-full object-cover"
//                   />
//                 )}
//               </div>
//               <h2 className="text-2xl font-bold">{mentor.name}</h2>
//               <p className="text-white">
//                 {mentor.role} @ {mentor.work}
//               </p>
//               <div className="flex gap-2 mt-4">
//                 <TooltipProvider>
//                   <div className="flex gap-2">
//                     {mentor.youtubeURL && (
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <a
//                             href={mentor.youtubeURL}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="bg-white rounded-full p-1 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
//                             aria-label="Visit YouTube Channel"
//                           >
//                             <Youtube className="h-5 w-5 text-black" />
//                           </a>
//                         </TooltipTrigger>
//                         <TooltipContent className="bg-gray-800 text-white border-none">
//                           <p>Visit YouTube Channel</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     )}
//                     {mentor.linkedinURL && (
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <a
//                             href={mentor.linkedinURL}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="bg-white rounded-full p-1 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
//                             aria-label="Visit LinkedIn Profile"
//                           >
//                             <Linkedin className="h-5 w-5 text-black" />
//                           </a>
//                         </TooltipTrigger>
//                         <TooltipContent className="bg-gray-800 text-white border-none">
//                           <p>Visit LinkedIn Profile</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     )}
//                     {mentor.portfolio && (
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <a
//                             href={mentor.portfolio}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="bg-white rounded-full p-1 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
//                             aria-label="Visit Portfolio"
//                           >
//                             <Globe className="h-5 w-5 text-black" />
//                           </a>
//                         </TooltipTrigger>
//                         <TooltipContent className="bg-gray-800 text-white border-none">
//                           <p>Visit Portfolio</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     )}
//                     {mentor.featuredArticle && (
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <a
//                             href={mentor.featuredArticle}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="bg-white rounded-full p-1 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
//                             aria-label="View Featured Article"
//                           >
//                             <FileText className="h-5 w-5 text-black" />
//                           </a>
//                         </TooltipTrigger>
//                         <TooltipContent className="bg-gray-800 text-white border-none">
//                           <p>View Featured Article</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     )}
//                   </div>
//                 </TooltipProvider>
//               </div>
//             </div>

//             <Accordion type="single" collapsible className="w-full">
//               <AccordionItem
//                 value="about"
//                 className="border-t border-gray-700 pt-4"
//               >
//                 <AccordionTrigger className="font-bold">About</AccordionTrigger>
//                 <AccordionContent className="mt-2">
//                   <p className="text-sm">{mentor.bio || "No bio available."}</p>
//                 </AccordionContent>
//               </AccordionItem>
//               <AccordionItem
//                 value="skills"
//                 className="border-t border-gray-700 pt-4"
//               >
//                 <AccordionTrigger className="font-bold">
//                   Skills
//                 </AccordionTrigger>
//                 <AccordionContent className="mt-2">
//                   <div className="flex flex-wrap gap-2">
//                     {mentor.skills?.length ? (
//                       mentor.skills.map((skill, index) => (
//                         <Badge
//                           key={index}
//                           variant="outline"
//                           className="bg-gray-200 text-black"
//                         >
//                           {skill}
//                         </Badge>
//                       ))
//                     ) : (
//                       <p className="text-sm">No skills listed.</p>
//                     )}
//                   </div>
//                 </AccordionContent>
//               </AccordionItem>
//               <AccordionItem
//                 value="education"
//                 className="border-t border-gray-700 pt-4"
//               >
//                 <AccordionTrigger className="font-bold">
//                   Education
//                 </AccordionTrigger>
//                 <AccordionContent className="mt-2">
//                   {mentor.education ? (
//                     <div>
//                       {mentor.education.schoolName && (
//                         <p className="text-sm">
//                           School: {mentor.education.schoolName},{" "}
//                           {mentor.education.city}
//                         </p>
//                       )}
//                       {mentor.education.collegeName && (
//                         <p className="text-sm">
//                           College: {mentor.education.collegeName},{" "}
//                           {mentor.education.city}
//                         </p>
//                       )}
//                     </div>
//                   ) : (
//                     <p className="text-sm">No education details available.</p>
//                   )}
//                 </AccordionContent>
//               </AccordionItem>
//               <AccordionItem
//                 value="work-experience"
//                 className="border-t border-gray-700 pt-4"
//               >
//                 <AccordionTrigger className="font-bold">
//                   Work Experience
//                 </AccordionTrigger>
//                 <AccordionContent className="mt-2">
//                   {mentor.workExperience ? (
//                     <p className="text-sm">
//                       {mentor.workExperience.jobRole} at{" "}
//                       {mentor.workExperience.company}
//                       {mentor.workExperience.city &&
//                         `, ${mentor.workExperience.city}`}
//                     </p>
//                   ) : (
//                     <p className="text-sm">No work experience listed.</p>
//                   )}
//                 </AccordionContent>
//               </AccordionItem>
//             </Accordion>
//           </div>

//           <div className="md:col-span-2">
//             <div className="bg-gray-50 p-4 rounded-lg mb-6">
//               <h3 className="font-medium mb-4">Services Available</h3>
//               {mentor.services?.length ? (
//                 <>
//                   <div className="flex flex-wrap gap-2 mb-4">
//                     {Array.from(
//                       new Set(mentor.services.map((s) => s.type))
//                     ).map((type, index) => (
//                       <Badge
//                         key={index}
//                         variant="outline"
//                         className="rounded-full bg-gray-200"
//                       >
//                         {type}
//                       </Badge>
//                     ))}
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {mentor.services.map((service, index) => (
//                       <ServiceCard
//                         key={index}
//                         type={service.type}
//                         title={service.title}
//                         shortDescription={service.shortDescription}
//                         longDescription={service.longDescription}
//                         duration={service.duration}
//                         price={`₹${service.amount}`}
//                         onClick={() =>
//                           navigate("/seeker/mentorservice", {
//                             state: { service, mentor },
//                           })
//                         }
//                       />
//                     ))}
//                   </div>
//                 </>
//               ) : (
//                 <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg p-6 animate-fade-in shadow-sm">
//                   <div className="relative mb-4">
//                     <Clock className="w-16 h-16 text-gray-400 animate-pulse" />
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="w-20 h-20 border-2 border-gray-200 rounded-full animate-pulse opacity-50"></div>
//                     </div>
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
//                     No Services Listed
//                   </h3>
//                   <p className="text-sm text-gray-500 mt-2 max-w-sm text-center">
//                     This mentor hasn't added any services yet. Explore other
//                     mentors or check back soon for updates!
//                   </p>
//                   <Button
//                     variant="outline"
//                     className="mt-4 bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
//                     onClick={() => navigate("/seeker/mentors")}
//                   >
//                     Explore Other Mentors
//                   </Button>
//                 </div>
//               )}
//             </div>

//             <div className="bg-gray-50 p-4 rounded-lg mb-6">
//               <h3 className="font-medium mb-4">Top Testimonials</h3>
//               {mentor.topTestimonials?.length ? (
//                 <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
//                   {mentor.topTestimonials.map((testimonial) => (
//                     <TestimonialCard
//                       key={testimonial._id}
//                       testimonial={testimonial}
//                     />
//                   ))}
//                 </div>
//               ) : (
//                 <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg p-6 animate-fade-in shadow-sm">
//                   <div className="relative mb-4">
//                     <Star className="w-16 h-16 text-gray-400 animate-pulse" />
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="w-20 h-20 border-2 border-gray-200 rounded-full animate-pulse opacity-50"></div>
//                     </div>
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
//                     No Testimonials Yet
//                   </h3>
//                   <p className="text-sm text-gray-500 mt-2 max-w-sm text-center">
//                     This mentor hasn't received testimonials yet. Be the first
//                     to book a session and share your feedback!
//                   </p>
//                   <Button
//                     variant="outline"
//                     className="mt-4 bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
//                     onClick={() => navigate("/seeker/mentors")}
//                   >
//                     Find Other Mentors
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// interface ServiceCardProps {
//   type: string;
//   title: string;
//   shortDescription: string;
//   longDescription: string;
//   duration?: string;
//   price: string;
//   onClick: () => void;
// }

// function ServiceCard({
//   type,
//   title,
//   shortDescription,
//   longDescription,
//   duration,
//   price,
//   onClick,
// }: ServiceCardProps) {
//   console.log(
//     "ServiceCard >>>>>>>>>",
//     type,
//     title,
//     shortDescription,
//     longDescription,
//     duration,
//     price
//   );

//   return (
//     <div className="bg-white rounded-lg border p-4">
//       <Badge
//         variant="outline"
//         className="mb-2 bg-red-100 text-red-800 border-red-200"
//       >
//         {type}
//       </Badge>
//       <h4 className="font-bold mb-1">{title}</h4>
//       <p className="text-sm text-gray-600 mb-4">{shortDescription}</p>
//       <div className="flex justify-between items-center">
//         <div className="flex items-center gap-2">
//           <div className="bg-blue-100 p-1 rounded">
//             <Clock className="h-4 w-4 text-blue-800" />
//           </div>
//           <span className="text-sm">{duration}</span>
//         </div>
//         <Button
//           variant="outline"
//           className="rounded-full bg-gray-200 border-gray-300"
//           onClick={onClick}
//         >
//           {price}
//         </Button>
//       </div>
//     </div>
//   );
// }

// interface TestimonialCardProps {
//   testimonial: Testimonial;
// }

// function TestimonialCard({ testimonial }: TestimonialCardProps) {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 relative">
//       <div className="flex justify-between items-start mb-4">
//         <div className="flex items-center space-x-1">
//           {[...Array(testimonial.rating)].map((_, i) => (
//             <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
//           ))}
//         </div>
//       </div>
//       <p className="text-gray-700 mb-4">{testimonial.comment}</p>
//       <div className="flex justify-between items-center">
//         <div>
//           <p className="font-semibold text-gray-900">
//             {`${testimonial.menteeId.firstName} ${testimonial.menteeId.lastName}`}
//           </p>
//           <p className="text-sm text-gray-500">
//             {new Date(testimonial.createdAt).toLocaleDateString()}
//           </p>
//         </div>
//         <span className="px-3 py-1 bg-gray-100 text-sm rounded-full text-gray-600">
//           {testimonial.serviceId.type}
//         </span>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Youtube,
  ArrowLeft,
  Linkedin,
  Globe,
  Clock,
  Star,
  FileText,
  Award,
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
  Video,
  MessageSquare,
  BookOpen,
  Users,
  Calendar,
  Target,
  Crown,
  Zap,
  TrendingUp,
  Heart,
  Eye,
  Play,
  ChevronRight,
  Badge as BadgeIcon,
  Sparkles,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import DummyImage from "@/assets/DummyProfile.jpg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { getMentorById } from "@/services/menteeService";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { ProfilePicture } from "@/components/users/SecureMedia";

interface Testimonial {
  _id: string;
  menteeId: { firstName: string; lastName: string };
  mentorId: string;
  serviceId: { title: string; type: string };
  bookingId: string;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

interface Mentor {
  _id: string;
  userData: string;
  mentorData: string;
  name: string;
  role: string;
  work: string;
  workRole: string;
  topTestimonials: Testimonial[];
  profileImage?: string;
  badge: string;
  isBlocked: boolean;
  isApproved: string;
  bio?: string;
  skills?: string[];
  linkedinURL?: string;
  youtubeURL?: string;
  portfolio?: string;
  featuredArticle?: string;
  services: {
    _id: string;
    type: string;
    title: string;
    shortDescription: string;
    longDescription: string;
    duration: string;
    amount: number;
  }[];
  education?: {
    schoolName?: string;
    collegeName?: string;
    city?: string;
  };
  workExperience?: {
    company: string;
    jobRole: string;
    city?: string;
  };
}

export default function MentorProfile() {
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      toast.error("Please log in to view mentor profiles.");
      navigate("/login");
      return;
    }

    const fetchMentor = async () => {
      if (!id) {
        toast.error("Mentor ID is missing.");
        navigate("/seeker/mentors");
        return;
      }
      setIsLoading(true);
      try {
        console.log("-------------Mentordata is step 1", id);
        const mentorData = await getMentorById(id);
        console.log("-------------Mentordata is step 2", mentorData);
        setMentor(mentorData);
      } catch (error: any) {
        console.error("Failed to fetch mentor:", error);
        toast.error("Failed to load mentor details. Please try again.");
        navigate("/seeker/mentors");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMentor();
  }, [id, user, loading, navigate]);

  // Get service type configuration
  const getServiceTypeConfig = (type: string) => {
    switch (type) {
      case "1-1Call":
        return {
          icon: <Video className="w-5 h-5" />,
          gradient: "bg-gradient-to-r from-blue-500 to-indigo-500",
          label: "1:1 Call",
        };
      case "priorityDM":
        return {
          icon: <MessageSquare className="w-5 h-5" />,
          gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
          label: "Priority DM",
        };
      case "DigitalProducts":
        return {
          icon: <BookOpen className="w-5 h-5" />,
          gradient: "bg-gradient-to-r from-green-500 to-emerald-500",
          label: "Digital Product",
        };
      default:
        return {
          icon: <Sparkles className="w-5 h-5" />,
          gradient: "bg-gradient-to-r from-gray-500 to-gray-600",
          label: type,
        };
    }
  };

  // Get badge configuration
  const getBadgeConfig = (badge: string) => {
    switch (badge.toLowerCase()) {
      case "premium":
        return {
          gradient: "bg-gradient-to-r from-purple-500 to-blue-500",
          icon: <Crown className="w-4 h-4" />,
          label: "Premium Mentor",
        };
      case "expert":
        return {
          gradient: "bg-gradient-to-r from-orange-500 to-red-500",
          icon: <Award className="w-4 h-4" />,
          label: "Expert",
        };
      case "trending":
        return {
          gradient: "bg-gradient-to-r from-green-500 to-emerald-500",
          icon: <TrendingUp className="w-4 h-4" />,
          label: "Trending",
        };
      default:
        return {
          gradient: "bg-gradient-to-r from-gray-500 to-gray-600",
          icon: <BadgeIcon className="w-4 h-4" />,
          label: badge,
        };
    }
  };

  const calculateAverageRating = () => {
    if (!mentor?.topTestimonials?.length) return 0;
    const total = mentor.topTestimonials.reduce(
      (sum, testimonial) => sum + testimonial.rating,
      0
    );
    return (total / mentor.topTestimonials.length).toFixed(1);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">
                Loading mentor profile...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Mentor Not Found
              </h3>
              <p className="text-gray-600 mb-4">
                The mentor you're looking for doesn't exist.
              </p>
              <Button
                onClick={() => navigate("/seeker/mentors")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl"
              >
                Browse Mentors
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const badgeConfig = getBadgeConfig(mentor.badge);
  const averageRating = calculateAverageRating();

  return (
    <div className=" min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Back Button */}
      <div className="relative z-0 -ml-6  ">
        <button
          className=" group flex h-12 w-12 items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-blue-600 hover:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
        </button>
      </div>
      <div className=" max-w-7xl mx-auto px-8 py-1 -mt-8 ">
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Mentor Profile
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-8 gap-8">
          {/* Left Sidebar - Mentor Info */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-purple-600 to-blue-600 text-white sticky top-8">
              <CardContent className="p-0">
                {/* Profile Header */}
                <div className="pt-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>

                  {/* Profile Picture */}
                  <div className="relative z-10">
                    <div className="w-44 h-44 mx-auto mb-6 relative">
                      {mentor.profileImage ? (
                        <ProfilePicture
                          profilePicture={mentor.profileImage}
                          userName={mentor.name}
                          size="xl"
                          className="w-full h-full object-cover rounded-full border-4 border-white/30 shadow-xl"
                        />
                      ) : (
                        <img
                          src={DummyImage}
                          alt={mentor.name}
                          className="w-full h-full object-cover rounded-full border-4 border-white/30 shadow-xl"
                        />
                      )}

                      {/* Badge */}
                      <div className="absolute -bottom-2 -right-2">
                        <div
                          className={`${badgeConfig.gradient} p-2 rounded-full shadow-lg border-2 border-white`}
                        >
                          {badgeConfig.icon}
                        </div>
                      </div>
                    </div>

                    {/* Name and Role */}
                    <h1 className="text-2xl font-bold mb-2">{mentor.name}</h1>
                    <p className="text-white/80 text-lg mb-2">
                      {mentor.workRole} @ {mentor.work}
                    </p>

                    {/* Badge Label */}
                    <Badge
                      className={`${badgeConfig.gradient} text-white border-0 px-4 py-1 rounded-full text-sm font-semibold shadow-lg`}
                    >
                      <span className="flex items-center gap-1">
                        {badgeConfig.icon}
                        {badgeConfig.label}
                      </span>
                    </Badge>

                    {/* Rating */}
                    <div className="flex items-center justify-center gap-2 mt-4 mb-6">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(Number(averageRating))
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-white/30"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-white font-bold">
                        {averageRating}
                      </span>
                      <span className="text-white/70 text-sm">
                        ({mentor.topTestimonials?.length || 0})
                      </span>
                    </div>

                    {/* Social Links */}
                    <TooltipProvider>
                      <div className="flex justify-center gap-3">
                        {mentor.youtubeURL && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a
                                href={mentor.youtubeURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all duration-200 hover:scale-110"
                              >
                                <Youtube className="h-5 w-5" />
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>YouTube Channel</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {mentor.linkedinURL && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a
                                href={mentor.linkedinURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all duration-200 hover:scale-110"
                              >
                                <Linkedin className="h-5 w-5" />
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>LinkedIn Profile</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {mentor.portfolio && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a
                                href={mentor.portfolio}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all duration-200 hover:scale-110"
                              >
                                <Globe className="h-5 w-5" />
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Portfolio</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {mentor.featuredArticle && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a
                                href={mentor.featuredArticle}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all duration-200 hover:scale-110"
                              >
                                <FileText className="h-5 w-5" />
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Featured Article</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Accordion Sections */}
                <div className="px-6 pb-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="about" className="border-white/20">
                      <AccordionTrigger className="text-white hover:text-white/80 font-bold">
                        About
                      </AccordionTrigger>
                      <AccordionContent className="text-white/80 text-sm leading-relaxed">
                        {mentor.bio || "No bio available."}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="skills" className="border-white/20">
                      <AccordionTrigger className="text-white hover:text-white/80 font-bold">
                        Skills
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-wrap gap-2">
                          {mentor.skills?.length ? (
                            mentor.skills.map((skill, index) => (
                              <Badge
                                key={index}
                                className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors"
                              >
                                {skill}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-white/70 text-sm">
                              No skills listed.
                            </p>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                      value="education"
                      className="border-white/20"
                    >
                      <AccordionTrigger className="text-white hover:text-white/80 font-bold">
                        <span className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          Education
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-white/80 text-sm">
                        {mentor.education ? (
                          <div className="space-y-2">
                            {mentor.education.schoolName && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3" />
                                <span>
                                  School: {mentor.education.schoolName},{" "}
                                  {mentor.education.city}
                                </span>
                              </div>
                            )}
                            {mentor.education.collegeName && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3" />
                                <span>
                                  College: {mentor.education.collegeName},{" "}
                                  {mentor.education.city}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p>No education details available.</p>
                        )}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                      value="work-experience"
                      className="border-white/20"
                    >
                      <AccordionTrigger className="text-white hover:text-white/80 font-bold">
                        <span className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          Work Experience
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-white/80 text-sm">
                        {mentor.workExperience ? (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            <span>
                              {mentor.workExperience.jobRole} at{" "}
                              {mentor.workExperience.company}
                              {mentor.workExperience.city &&
                                `, ${mentor.workExperience.city}`}
                            </span>
                          </div>
                        ) : (
                          <p>No work experience listed.</p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-5 space-y-8">
            {/* Services Section */}
            <Card className="border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  Available Services
                </CardTitle>
                <p className="text-gray-600">
                  Choose from expert services tailored to your needs
                </p>
              </CardHeader>
              <CardContent className="p-6">
                {mentor.services?.length ? (
                  <>
                    {/* Service Type Summary */}
                    <div className="flex flex-wrap gap-3 mb-8">
                      {Array.from(
                        new Set(mentor.services.map((s) => s.type))
                      ).map((type, index) => {
                        const config = getServiceTypeConfig(type);
                        return (
                          <Badge
                            key={index}
                            className={`${config.gradient} text-white border-0 px-4 py-2 rounded-full font-semibold`}
                          >
                            <span className="flex items-center gap-2">
                              {config.icon}
                              {config.label}
                            </span>
                          </Badge>
                        );
                      })}
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                      {mentor.services.map((service, index) => (
                        <ServiceCard
                          key={index}
                          service={service}
                          mentor={mentor}
                          isHovered={hoveredService === service._id}
                          onHover={setHoveredService}
                          onClick={() =>
                            navigate("/seeker/mentorservice", {
                              state: { service, mentor },
                            })
                          }
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
                      <Clock className="w-10 h-10 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No Services Listed
                    </h3>
                    <p className="text-gray-600 text-center max-w-sm mb-6">
                      This mentor hasn't added any services yet. Check back soon
                      for updates!
                    </p>
                    <Button
                      onClick={() => navigate("/seeker/mentors")}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl"
                    >
                      Explore Other Mentors
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Testimonials Section */}
            <Card className="border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-gray-100">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  Student Testimonials
                </CardTitle>
                <p className="text-gray-600">
                  What students say about their experience
                </p>
              </CardHeader>
              <CardContent className="p-6">
                {mentor.topTestimonials?.length ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {mentor.topTestimonials.map((testimonial, index) => (
                      <TestimonialCard
                        key={testimonial._id}
                        testimonial={testimonial}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mb-4">
                      <Star className="w-10 h-10 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No Testimonials Yet
                    </h3>
                    <p className="text-gray-600 text-center max-w-sm mb-6">
                      Be the first to book a session and share your feedback!
                    </p>
                    <Button
                      onClick={() => navigate("/seeker/mentors")}
                      className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-xl"
                    >
                      Find Other Mentors
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ServiceCardProps {
  service: {
    _id: string;
    type: string;
    title: string;
    shortDescription: string;
    longDescription: string;
    duration: string;
    amount: number;
  };
  mentor: Mentor;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onClick: () => void;
}

function ServiceCard({
  service,
  mentor,
  isHovered,
  onHover,
  onClick,
}: ServiceCardProps) {
  const config = getServiceTypeConfig(service.type);

  return (
    <Card
      className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl overflow-hidden cursor-pointer ${
        isHovered ? "transform -translate-y-1 scale-[1.02]" : ""
      }`}
      onMouseEnter={() => onHover(service._id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-2xl ${config.gradient} shadow-lg`}>
            <div className="text-white">{config.icon}</div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-2xl font-bold text-gray-900">
              <span>₹{service.amount}</span>
            </div>
            {service.duration && (
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <Clock className="w-3 h-3" />
                <span>{service.duration}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <Badge
            className={`${config.gradient} text-white border-0 px-3 py-1 rounded-full text-xs font-semibold mb-3`}
          >
            {config.label}
          </Badge>
          <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {service.title}
          </h4>
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {service.shortDescription}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>127</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>23</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold shadow-md transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <span className="mr-2">Book Session</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  return (
    <Card
      className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-6">
        {/* Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200 text-xs"
          >
            {testimonial.serviceId.type}
          </Badge>
        </div>

        {/* Comment */}
        <p className="text-gray-700 mb-4 leading-relaxed italic">
          "{testimonial.comment}"
        </p>

        {/* Author Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {testimonial.menteeId.firstName.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {`${testimonial.menteeId.firstName} ${testimonial.menteeId.lastName}`}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(testimonial.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-sm font-bold text-gray-900">
                {testimonial.rating}.0
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to get service type configuration (moved outside component)
function getServiceTypeConfig(type: string) {
  switch (type) {
    case "1-1Call":
      return {
        icon: <Video className="w-5 h-5" />,
        gradient: "bg-gradient-to-r from-blue-500 to-indigo-500",
        label: "1:1 Call",
      };
    case "priorityDM":
      return {
        icon: <MessageSquare className="w-5 h-5" />,
        gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
        label: "Priority DM",
      };
    case "DigitalProducts":
      return {
        icon: <BookOpen className="w-5 h-5" />,
        gradient: "bg-gradient-to-r from-green-500 to-emerald-500",
        label: "Digital Product",
      };
    default:
      return {
        icon: <Sparkles className="w-5 h-5" />,
        gradient: "bg-gradient-to-r from-gray-500 to-gray-600",
        label: type,
      };
  }
}
