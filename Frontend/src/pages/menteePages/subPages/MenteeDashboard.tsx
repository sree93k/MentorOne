// // // import React, { useState, useEffect, useId } from "react";
// // // import { Star, Clock, Users, ChevronRight } from "lucide-react";
// // // import { Button } from "@/components/ui/button";
// // // import { Skeleton } from "@/components/ui/skeleton";
// // // import { SparklesCore } from "@/components/ui/sparkles";
// // // import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
// // // import { getDashboardData } from "@/services/menteeService";
// // // import SreeImg from "@/assets/Sree.jpeg";
// // // import JasnaImg from "@/assets/Jasna.jpeg";
// // // import JithinImg from "@/assets/Jithin.jpeg";
// // // import AnotaImg from "@/assets/Anita.jpeg";
// // // import GradientBackgroundText from "@/components/mentee/AnimatedGradientText";
// // // import { useSelector } from "react-redux";
// // // import { RootState } from "@/redux/store/store";
// // // import { setError } from "@/redux/slices/userSlice";
// // // // Mock data for mentors
// // // const mockMentors = [
// // //   {
// // //     userId: "user1",
// // //     mentorId: "mentor1",
// // //     name: "Sreekuttan",
// // //     bio: "Leadership coach with 10+ years of experience helping professionals reach their full potential.",
// // //     role: "Leadership Coach",
// // //     work: "Google",
// // //     workRole: "Senior Manager",
// // //     profileImage: SreeImg,
// // //     badge: "Premium",
// // //     expertise: ["Career Growth", "Leadership"],
// // //     isBlocked: false,
// // //     isApproved: true,
// // //   },
// // //   {
// // //     userId: "user2",
// // //     mentorId: "mentor2",
// // //     name: "Jasna Jaffer",
// // //     bio: "Tech industry veteran helping newcomers navigate their career path in software development.",
// // //     role: "Tech Mentor",
// // //     work: "Microsoft",
// // //     workRole: "Principal Engineer",
// // //     profileImage: JasnaImg,
// // //     badge: "Featured",
// // //     expertise: ["Mock Interview", "Resume Review"],
// // //     isBlocked: false,
// // //     isApproved: true,
// // //   },
// // //   {
// // //     userId: "user3",
// // //     mentorId: "mentor3",
// // //     name: "Jithin P",
// // //     bio: "Specializing in resume reviews and interview preparation for tech positions.",
// // //     role: "Career Coach",
// // //     work: "LinkedIn",
// // //     workRole: "HR Director",
// // //     profileImage: JithinImg,
// // //     badge: "Top Rated",
// // //     expertise: ["Interview Prep", "Career Guide"],
// // //     isBlocked: false,
// // //     isApproved: true,
// // //   },
// // //   {
// // //     userId: "user4",
// // //     mentorId: "mentor4",
// // //     name: "Anita Jose",
// // //     bio: "Data science expert with a passion for mentoring aspiring analysts and scientists.",
// // //     role: "Data Science Mentor",
// // //     work: "Amazon",
// // //     workRole: "Lead Data Scientist",
// // //     profileImage: AnotaImg,
// // //     badge: "Top Rated",
// // //     expertise: ["Data Analysis", "Machine Learning"],
// // //     isBlocked: false,
// // //     isApproved: true,
// // //   },
// // // ];

// // // // Mock courses data
// // // const mockCourses = [
// // //   {
// // //     id: "course1",
// // //     title: "JavaScript",
// // //     subtitle: "Namaste JavaScript",
// // //     episodes: "10 Episodes",
// // //     duration: "15 hours",
// // //     level: "Intermediate",
// // //     rating: 4.8,
// // //     views: "5.2k",
// // //     image:
// // //       "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2800&auto=format&fit=crop",
// // //   },
// // //   {
// // //     id: "course2",
// // //     title: "React.js",
// // //     subtitle: "Advanced React Patterns",
// // //     episodes: "8 Episodes",
// // //     duration: "12 hours",
// // //     level: "Advanced",
// // //     rating: 4.9,
// // //     views: "3.7k",
// // //     image:
// // //       "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2800&auto=format&fit=crop",
// // //   },
// // //   {
// // //     id: "course3",
// // //     title: "Node.js",
// // //     subtitle: "Backend Development",
// // //     episodes: "12 Episodes",
// // //     duration: "18 hours",
// // //     level: "Beginner",
// // //     rating: 4.7,
// // //     views: "4.1k",
// // //     image:
// // //       "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2800&auto=format&fit=crop",
// // //   },
// // //   {
// // //     id: "course4",
// // //     title: "Python",
// // //     subtitle: "Python for Data Science",
// // //     episodes: "15 Episodes",
// // //     duration: "20 hours",
// // //     level: "Intermediate",
// // //     rating: 4.8,
// // //     views: "6.3k",
// // //     image:
// // //       "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=2800&auto=format&fit=crop",
// // //   },
// // // ];

// // // // Testimonials for infinite cards
// // // const testimonials = [
// // //   {
// // //     quote:
// // //       "Working with my mentor completely transformed my career trajectory. I went from being stuck in a junior role to landing my dream job in just 3 months.",
// // //     name: "Harsh surendren",
// // //     title: "Frontend Developer",
// // //     image:
// // //       "https://images.unsplash.com/photo-1504707748692-419802cf939d?q=80&w=2800&auto=format&fit=crop",
// // //   },
// // //   {
// // //     quote:
// // //       "The resume review service was incredible. My mentor pointed out issues I never would have noticed and helped me craft a resume that actually got callbacks.",
// // //     name: "Mini kottakal",
// // //     title: "Product Manager",
// // //     image:
// // //       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
// // //   },
// // //   {
// // //     quote:
// // //       "The mock interviews were challenging but incredibly helpful. My mentor gave me constructive feedback that helped me ace my actual interviews.",
// // //     name: "Aksah nair",
// // //     title: "Data Scientist",
// // //     image:
// // //       "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
// // //   },
// // //   {
// // //     quote:
// // //       "I was hesitant about paying for mentorship, but it was worth every penny. My mentor provided insights that I couldn't find anywhere else.",
// // //     name: "Arun kumar",
// // //     title: "UX Designer",
// // //     image:
// // //       "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2800&auto=format&fit=crop",
// // //   },
// // //   {
// // //     quote:
// // //       "Working with my mentor completely transformed my career trajectory. I went from being stuck in a junior role to landing my dream job in just 3 months.",
// // //     name: "Krishna priya",
// // //     title: "Frontend Developer",
// // //     image:
// // //       "https://images.unsplash.com/photo-1504707748692-419802cf939d?q=80&w=2800&auto=format&fit=crop",
// // //   },
// // //   {
// // //     quote:
// // //       "The resume review service was incredible. My mentor pointed out issues I never would have noticed and helped me craft a resume that actually got callbacks.",
// // //     name: "Anu mol",
// // //     title: "Product Manager",
// // //     image:
// // //       "https://img.freepik.com/free-vector/tiktok-profile-picture-template_742173-4482.jpg?t=st=1749964030~exp=1749967630~hmac=7df7e5e3ccbe58b53d43fef90c8d890182fa4aad2fa19f3b14d822940c153a85&w=1800",
// // //   },
// // //   {
// // //     quote:
// // //       "The mock interviews were challenging but incredibly helpful. My mentor gave me constructive feedback that helped me ace my actual interviews.",
// // //     name: "Kannan devan",
// // //     title: "Data Scientist",
// // //     image:
// // //       "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
// // //   },
// // //   {
// // //     quote:
// // //       "I was hesitant about paying for mentorship, but it was worth every penny. My mentor provided insights that I couldn't find anywhere else.",
// // //     name: "Jithin jithu",
// // //     title: "UX Designer",
// // //     image:
// // //       "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2800&auto=format&fit=crop",
// // //   },
// // // ];

// // // // Services grid data
// // // const grid = [
// // //   {
// // //     title: "Internship Preparation",
// // //     description:
// // //       "Our applications are HIPAA and SOC2 compliant, your data is safe with us, always.",
// // //   },
// // //   {
// // //     title: "Mock Interview",
// // //     description:
// // //       "Schedule and automate your social media posts across multiple platforms to save time and maintain a consistent online presence.",
// // //   },
// // //   {
// // //     title: "Resume Review",
// // //     description:
// // //       "Gain insights into your social media performance with detailed analytics and reporting tools to measure engagement and ROI.",
// // //   },
// // //   {
// // //     title: "One - One Sessions",
// // //     description:
// // //       "Plan and organize your social media content with an intuitive calendar view, ensuring you never miss a post.",
// // //   },
// // //   {
// // //     title: "Project Guidance",
// // //     description:
// // //       "Reach the right audience with advanced targeting options, including demographics, interests, and behaviors.",
// // //   },
// // //   {
// // //     title: "Referral",
// // //     description:
// // //       "Monitor social media conversations and trends to stay informed about what your audience is saying and respond in real-time.",
// // //   },
// // // ];

// // // // AceternityLogo Component
// // // const AceternityLogo = () => {
// // //   return (
// // //     <svg
// // //       width="66"
// // //       height="65"
// // //       viewBox="0 0 66 65"
// // //       fill="none"
// // //       xmlns="http://www.w3.org/2000/svg"
// // //       className="h-3 w-3 text-black dark:text-white"
// // //     >
// // //       <path
// // //         d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
// // //         stroke="currentColor"
// // //         strokeWidth="15"
// // //         strokeMiterlimit="3.86874"
// // //         strokeLinecap="round"
// // //       />
// // //     </svg>
// // //   );
// // // };

// // // // Grid Pattern Component
// // // export function GridPattern({ width, height, x, y, squares, ...props }: any) {
// // //   const patternId = useId();

// // //   return (
// // //     <svg aria-hidden="true" {...props}>
// // //       <defs>
// // //         <pattern
// // //           id={patternId}
// // //           width={width}
// // //           height={height}
// // //           patternUnits="userSpaceOnUse"
// // //           x={x}
// // //           y={y}
// // //         >
// // //           <path d={`M.5 ${height}V.5H${width}`} fill="none" />
// // //         </pattern>
// // //       </defs>
// // //       <rect
// // //         width="100%"
// // //         height="100%"
// // //         strokeWidth={0}
// // //         fill={`url(#${patternId})`}
// // //       />
// // //       {squares && (
// // //         <svg x={x} y={y} className="overflow-visible">
// // //           {squares.map(([x, y]: any) => (
// // //             <rect
// // //               strokeWidth="0"
// // //               key={`${x}-${y}`}
// // //               width={width + 1}
// // //               height={height + 1}
// // //               x={x * width}
// // //               y={y * height}
// // //             />
// // //           ))}
// // //         </svg>
// // //       )}
// // //     </svg>
// // //   );
// // // }

// // // // Grid Component
// // // export const Grid = ({
// // //   pattern,
// // //   size,
// // // }: {
// // //   pattern?: number[][];
// // //   size?: number;
// // // }) => {
// // //   const p = pattern ?? [
// // //     [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
// // //     [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
// // //     [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
// // //     [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
// // //     [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
// // //   ];
// // //   return (
// // //     <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
// // //       <div className="absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 from-zinc-100/30 to-zinc-300/30 dark:to-zinc-900/30 opacity-100">
// // //         <GridPattern
// // //           width={size ?? 20}
// // //           height={size ?? 20}
// // //           x="-12"
// // //           y="4"
// // //           squares={p}
// // //           className="absolute inset-0 h-full w-full mix-blend-overlay dark:fill-white/10 dark:stroke-white/10 stroke-black/10 fill-black/10"
// // //         />
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // Enhanced Mentor Card Component
// // // const StylishMentorCard = ({ mentor }) => {
// // //   const [isHovered, setIsHovered] = useState(false);
// // //   const [isImageLoaded, setIsImageLoaded] = useState(false);

// // //   const badgeColors = {
// // //     Premium: "bg-gradient-to-r from-amber-500 to-yellow-500",
// // //     Featured: "bg-gradient-to-r from-blue-500 to-indigo-600",
// // //     "Top Rated": "bg-gradient-to-r from-emerald-500 to-green-600",
// // //   };

// // //   const badge =
// // //     mentor.averageRating >= 4.5
// // //       ? "Top Rated"
// // //       : mentor.bookingCount > 50
// // //       ? "Premium"
// // //       : "Featured";

// // //   return (
// // //     <div
// // //       className="relative overflow-hidden rounded-2xl transition-all duration-300 group"
// // //       style={{
// // //         transform: isHovered ? "translateY(-8px)" : "translateY(0)",
// // //         boxShadow: isHovered
// // //           ? "0 20px 40px rgba(0, 0, 0, 0.2)"
// // //           : "0 10px 30px rgba(0, 0, 0, 0.1)",
// // //       }}
// // //       onMouseEnter={() => setIsHovered(true)}
// // //       onMouseLeave={() => setIsHovered(false)}
// // //     >
// // //       <div className="h-32 overflow-hidden">
// // //         <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 via-blue-900 to-indigo-800 opacity-90 z-10"></div>
// // //         <div className="absolute inset-0 z-0 opacity-30">
// // //           <SparklesCore
// // //             background="transparent"
// // //             minSize={0.4}
// // //             maxSize={1}
// // //             particleDensity={60}
// // //             className="w-full h-full"
// // //             particleColor="#FFFFFF"
// // //           />
// // //         </div>
// // //         <div className="absolute left-1/2 top-2 transform -translate-x-1/2 z-20">
// // //           <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white transition-all duration-300 group-hover:border-yellow-400 shadow-xl">
// // //             {!isImageLoaded && (
// // //               <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
// // //             )}
// // //             <img
// // //               src={
// // //                 mentor.profilePicture ||
// // //                 mentor.profileImage ||
// // //                 "/default-avatar.png"
// // //               }
// // //               alt={mentor.name || `${mentor.firstName} ${mentor.lastName}`}
// // //               onLoad={() => setIsImageLoaded(true)}
// // //               className={`w-full h-full object-cover transition-all duration-500 ${
// // //                 isImageLoaded ? "opacity-100" : "opacity-0"
// // //               } ${isHovered ? "scale-110" : "scale-100"}`}
// // //             />
// // //           </div>
// // //         </div>
// // //         <div className="absolute right-5 top-5 z-30">
// // //           <div
// // //             className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${badgeColors[badge]}`}
// // //           >
// // //             {badge}
// // //           </div>
// // //         </div>
// // //       </div>
// // //       <div className="bg-white pt-6 pb-6 px-6 relative z-20">
// // //         <div className="absolute left-1/2 transform -translate-x-1/2 -top-4">
// // //           <div className="flex items-center px-3 py-1 bg-yellow-400 rounded-full text-sm font-bold text-gray-900 shadow-lg">
// // //             <Star className="w-4 h-4 mr-1 fill-gray-900" />
// // //             {(mentor.averageRating || 4.8).toFixed(1)}
// // //           </div>
// // //         </div>
// // //         <div className="text-center mb-4">
// // //           <h3 className="font-bold text-xl text-gray-900">
// // //             {mentor.name || `${mentor.firstName} ${mentor.lastName}`}
// // //           </h3>
// // //           <div className="flex items-center justify-center text-sm text-gray-600">
// // //             <span className="font-medium">
// // //               {mentor.workRole ||
// // //                 mentor.mentorId?.bio.split(" ").slice(0, 3).join(" ") + "..."}
// // //             </span>
// // //             {mentor.work && (
// // //               <>
// // //                 <span className="mx-1">@</span>
// // //                 <span className="text-gray-900 font-semibold">
// // //                   {mentor.work}
// // //                 </span>
// // //               </>
// // //             )}
// // //           </div>
// // //         </div>
// // //         <p className="text-gray-600 text-sm text-center mb-4 line-clamp-2">
// // //           {mentor.bio || mentor.mentorId?.bio}
// // //         </p>
// // //         <div className="flex gap-2 px-4">
// // //           <Button className="flex-1 bg-black hover:bg-gray-800 text-white transition-colors shadow-md">
// // //             View Profile
// // //           </Button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // Enhanced Course Card Component
// // // const StylishCourseCard = ({ service }) => {
// // //   const [isHovered, setIsHovered] = useState(false);

// // //   return (
// // //     <div
// // //       className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300"
// // //       style={{
// // //         transform: isHovered ? "translateY(-8px)" : "translateY(0)",
// // //         boxShadow: isHovered
// // //           ? "0 15px 30px rgba(0, 0, 0, 0.1)"
// // //           : "0 5px 15px rgba(0, 0, 0, 0.05)",
// // //       }}
// // //       onMouseEnter={() => setIsHovered(true)}
// // //       onMouseLeave={() => setIsHovered(false)}
// // //     >
// // //       <div className="relative overflow-hidden h-48">
// // //         <img
// // //           src={
// // //             service.image ||
// // //             service.mentorProfileImage ||
// // //             "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2800&auto=format&fit=crop"
// // //           }
// // //           alt={service.title}
// // //           className={`w-full h-full object-cover transition-transform duration-700 ${
// // //             isHovered ? "scale-110" : "scale-100"
// // //           }`}
// // //         />
// // //         <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
// // //         <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
// // //           <div className="flex justify-between items-center mb-1">
// // //             <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
// // //               {service.level || service.type}
// // //             </span>
// // //             <div className="flex items-center">
// // //               <Clock className="w-3 h-3 mr-1" />
// // //               <span className="text-xs">
// // //                 {service.duration || `${service.duration} mins`}
// // //               </span>
// // //             </div>
// // //           </div>
// // //           <h3 className="font-bold text-lg">{service.title}</h3>
// // //         </div>
// // //       </div>
// // //       <div className="p-4">
// // //         <h4 className="font-medium text-gray-600">
// // //           {service.subtitle || service.shortDescription}
// // //         </h4>
// // //         <div className="flex items-center text-gray-500 text-sm mt-2 mb-3">
// // //           <span>{service.mentorName || service.episodes}</span>
// // //           <span className="mx-2">•</span>
// // //           <Users className="w-4 h-4 mr-1" />
// // //           <span>{service.views || service.bookingCount} students</span>
// // //         </div>
// // //         <div className="flex items-center justify-between">
// // //           <div className="flex items-center">
// // //             <span className="text-yellow-500 font-medium mr-1">
// // //               {(service.rating || service.averageRating || 4.8).toFixed(1)}
// // //             </span>
// // //             <div className="flex">
// // //               {[...Array(5).keys()].map((i) => (
// // //                 <Star
// // //                   key={i}
// // //                   className={`w-4 h-4 ${
// // //                     i <
// // //                     Math.floor(service.rating || service.averageRating || 4.8)
// // //                       ? "fill-yellow-400 text-yellow-400"
// // //                       : "text-gray-300"
// // //                   }`}
// // //                 />
// // //               ))}
// // //             </div>
// // //           </div>
// // //           <Button
// // //             variant="ghost"
// // //             size="sm"
// // //             className="text-blue-600 hover:text-blue-800 p-0 hover:bg-transparent"
// // //           >
// // //             Details <ChevronRight size={16} />
// // //           </Button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // Enhanced Infinite Moving Cards Component
// // // const StylishInfiniteMovingCards = ({
// // //   items,
// // //   direction = "right",
// // //   speed = "normal",
// // // }) => {
// // //   const containerRef = useId();

// // //   const containerStyles = {
// // //     "--animation-duration":
// // //       speed === "fast" ? "10s" : speed === "slow" ? "20s" : "30s",
// // //   } as React.CSSProperties;

// // //   return (
// // //     <div className="relative overflow-hidden w-full">
// // //       <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white to-transparent"></div>
// // //       <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white to-transparent"></div>
// // //       <div
// // //         className="flex gap-4 py-4"
// // //         style={{
// // //           ...containerStyles,
// // //           animation: `scroll-${direction} var(--animation-duration) linear infinite`,
// // //         }}
// // //       >
// // //         {[...items, ...items].map((item, idx) => (
// // //           <div
// // //             key={idx}
// // //             className="flex-shrink-0 w-72 rounded-2xl bg-gradient-to-br from-blue-50 to-white dark:from-indigo-950 dark:to-gray-900 border border-blue-100 dark:border-blue-800 p-5 shadow-md"
// // //           >
// // //             <div className="flex gap-4 items-start mb-4">
// // //               <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-blue-100 dark:border-blue-300">
// // //                 <img
// // //                   src={
// // //                     item.image ||
// // //                     item.menteeId?.profilePicture ||
// // //                     "/default-avatar.jpg"
// // //                   }
// // //                   alt={
// // //                     item.name ||
// // //                     `${item.menteeId?.firstName} ${item.menteeId?.lastName}`
// // //                   }
// // //                   className="w-full h-full object-cover"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <h4 className="font-bold text-gray-900 dark:text-white">
// // //                   {item.name ||
// // //                     `${item.menteeId?.firstName} ${item.menteeId?.lastName}`}
// // //                 </h4>
// // //                 <p className="text-sm text-blue-600 dark:text-blue-400">
// // //                   {item.title || item.serviceId?.title}
// // //                 </p>
// // //               </div>
// // //             </div>
// // //             <blockquote className="italic text-gray-600 dark:text-gray-300 text-sm mb-4">
// // //               "{item.quote || item.comment}"
// // //             </blockquote>
// // //             <div className="flex">
// // //               {[...Array(Math.floor(item.rating || 5)).keys()].map((_, i) => (
// // //                 <Star
// // //                   key={i}
// // //                   className="w-4 h-5 fill-yellow-400 text-yellow-400"
// // //                 />
// // //               ))}
// // //             </div>
// // //           </div>
// // //         ))}
// // //       </div>
// // //       <style>{`
// // //         @keyframes scroll-right {
// // //           from {
// // //             transform: translateX(0);
// // //           }
// // //           to {
// // //             transform: translateX(-50%);
// // //           }
// // //         }
// // //         @keyframes scroll-left {
// // //           from {
// // //             transform: translateX(-50%);
// // //           }
// // //           to {
// // //             transform: translateX(0);
// // //           }
// // //         }
// // //       `}</style>
// // //     </div>
// // //   );
// // // };

// // // // MenteeDashboard Component
// // // const MenteeDashboard: React.FC = () => {
// // //   const [dashboardData, setDashboardData] = useState<{
// // //     topServices: any[];
// // //     topMentors: any[];
// // //     topTestimonials: any[];
// // //   }>({ topServices: [], topMentors: [], topTestimonials: [] });
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   // const [error, setError] = useState<string | null>(null);
// // //   const { user, error, loading } = useSelector(
// // //     (state: RootState) => state.user
// // //   );
// // //   const placeholders = [
// // //     "Search for mentors...",
// // //     "Find top services...",
// // //     "Explore testimonials...",
// // //     "Discover new courses...",
// // //     "Connect with experts...",
// // //   ];

// // //   useEffect(() => {
// // //     const fetchDashboardData = async () => {
// // //       try {
// // //         setIsLoading(true);
// // //         const data = await getDashboardData();
// // //         setDashboardData(data);
// // //         console.log(" ✅   ✅   ✅   ✅  DASHBOARD MENTEE DATA>>>>>", data);
// // //       } catch (err: any) {
// // //         setError(err.message || "Failed to load dashboard data");
// // //       } finally {
// // //         setIsLoading(false);
// // //       }
// // //     };
// // //     fetchDashboardData();
// // //   }, []);

// // //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     console.log(e.target.value);
// // //   };

// // //   const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
// // //     e.preventDefault();
// // //     console.log("submitted");
// // //   };

// // //   // Determine which data to display
// // //   const displayMentors =
// // //     dashboardData.topMentors.length === 8
// // //       ? dashboardData.topMentors
// // //       : mockMentors;
// // //   const displayServices =
// // //     dashboardData.topServices.length === 8 ? dashboardData.topServices : grid;
// // //   const displayTopServices =
// // //     dashboardData.topServices.length === 8
// // //       ? dashboardData.topServices.slice(0, 4)
// // //       : mockCourses;
// // //   const displayTestimonials =
// // //     dashboardData.topTestimonials.length >= 20
// // //       ? dashboardData.topTestimonials
// // //       : testimonials;

// // //   return (
// // //     <>
// // //       <div className="px-18">
// // //         <div className="h-[35rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
// // //           <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
// // //             Mentor ONE
// // //           </h1>
// // //           <div className="w-[40rem] h-40 relative">
// // //             <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
// // //             <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
// // //             <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
// // //             <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
// // //             <SparklesCore
// // //               background="transparent"
// // //               minSize={0.4}
// // //               maxSize={1}
// // //               particleDensity={1200}
// // //               className="w-full h-full"
// // //               particleColor="#FFFFFF"
// // //             />
// // //             <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
// // //           </div>
// // //           <PlaceholdersAndVanishInput
// // //             placeholders={placeholders}
// // //             onChange={handleChange}
// // //             onSubmit={onSubmit}
// // //           />

// // //           <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-12">
// // //             <GradientBackgroundText className="font-semibold px-6 py-2">
// // //               Get Start Now
// // //             </GradientBackgroundText>
// // //           </div>
// // //         </div>

// // //         <div className="px-24">
// // //           <section className="mb-8 mt-6">
// // //             <h2 className="text-xl font-bold mb-4">
// // //               Explore the Services You Need To Get Support
// // //             </h2>
// // //             <div className="py-6 lg:py-6">
// // //               {isLoading ? (
// // //                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 md:gap-2 max-w-7xl mx-auto">
// // //                   {[...Array(6)].map((_, idx) => (
// // //                     <Skeleton key={idx} className="h-40 w-full rounded-3xl" />
// // //                   ))}
// // //                 </div>
// // //               ) : (
// // //                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 md:gap-2 max-w-7xl mx-auto">
// // //                   {displayServices.map((service) => (
// // //                     <div
// // //                       key={service._id || service.title}
// // //                       className="relative bg-gradient-to-b dark:from-neutral-900 from-neutral-300 dark:to-neutral-950 to-white p-6 rounded-3xl overflow-hidden"
// // //                     >
// // //                       <Grid size={20} />
// // //                       <p className="text-base font-bold text-neutral-800 dark:text-white relative z-20">
// // //                         {service.title}
// // //                       </p>
// // //                       <p className="text-neutral-600 dark:text-neutral-400 mt-4 text-base font-normal relative z-20">
// // //                         {service.shortDescription || service.description}
// // //                       </p>
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </section>

// // //           <section className="mb-8">
// // //             <h2 className="text-xl font-bold mb-4">Top Services</h2>
// // //             {isLoading ? (
// // //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
// // //                 {[...Array(4)].map((_, idx) => (
// // //                   <Skeleton key={idx} className="h-80 w-full rounded-xl" />
// // //                 ))}
// // //               </div>
// // //             ) : (
// // //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
// // //                 {displayTopServices.map((service) => (
// // //                   <StylishCourseCard
// // //                     key={service._id || service.id}
// // //                     service={service}
// // //                   />
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </section>

// // //           <section>
// // //             <h2 className="text-xl font-bold mb-4">Top Mentors</h2>
// // //             {isLoading ? (
// // //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
// // //                 {[...Array(4)].map((_, idx) => (
// // //                   <Skeleton key={idx} className="h-80 w-full rounded-2xl" />
// // //                 ))}
// // //               </div>
// // //             ) : (
// // //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
// // //                 {displayMentors.map((mentor) => (
// // //                   <StylishMentorCard
// // //                     key={mentor._id || mentor.userId}
// // //                     mentor={mentor}
// // //                   />
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </section>
// // //         </div>
// // //       </div>
// // //       <section>
// // //         <div className="rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden mt-10 gap-4">
// // //           {isLoading ? (
// // //             <Skeleton className="h-40 w-full max-w-4xl" />
// // //           ) : (
// // //             <>
// // //               <StylishInfiniteMovingCards
// // //                 items={displayTestimonials.slice(
// // //                   0,
// // //                   Math.ceil(displayTestimonials.length / 2)
// // //                 )}
// // //                 direction="right"
// // //                 speed="slow"
// // //               />
// // //               <div className="w-full" style={{ marginLeft: "-150px" }}>
// // //                 <StylishInfiniteMovingCards
// // //                   items={displayTestimonials.slice(
// // //                     Math.ceil(displayTestimonials.length / 2)
// // //                   )}
// // //                   direction="right"
// // //                   speed="fast"
// // //                 />
// // //               </div>
// // //             </>
// // //           )}
// // //         </div>
// // //       </section>
// // //     </>
// // //   );
// // // };

// // // export default MenteeDashboard;

// // import { useState, useEffect } from "react";
// // import {
// //   Star,
// //   ChevronRight,
// //   BookOpen,
// //   MessageSquare,
// //   Target,
// //   Award,
// //   Zap,
// //   FileText,
// //   User,
// //   Globe,
// //   Shield,
// //   Play,
// //   CheckCircle,
// //   Sparkles,
// //   Code,
// //   BrainCircuit,
// //   Rocket,
// // } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Skeleton } from "@/components/ui/skeleton";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Badge } from "@/components/ui/badge";
// // import {
// //   Accordion,
// //   AccordionContent,
// //   AccordionItem,
// //   AccordionTrigger,
// // } from "@/components/ui/accordion";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// // import SreeImg from "@/assets/Sree.jpeg";
// // import JasnaImg from "@/assets/Jasna.jpeg";
// // import JithinImg from "@/assets/Jithin.jpeg";
// // import AnotaImg from "@/assets/Anita.jpeg";

// // // Enhanced mock mentors data with Indian names
// // const mockMentors = [
// //   {
// //     id: "1",
// //     name: "Jithin Nair",
// //     title: "Senior AI Research Scientist",
// //     company: "Google India",
// //     rating: 4.9,
// //     sessions: 156,
// //     expertise: ["Machine Learning", "Deep Learning", "AI Ethics"],
// //     avatar: JithinImg,
// //     price: "₹8,500/hr",
// //     badge: "AI Expert",
// //     verified: true,
// //     responseTime: "< 2hrs",
// //   },
// //   {
// //     id: "2",
// //     name: "Priya Menon",
// //     title: "Principal Software Engineer",
// //     company: "Microsoft India",
// //     rating: 4.8,
// //     sessions: 203,
// //     expertise: ["System Design", "Leadership", "React"],
// //     avatar: JasnaImg,
// //     price: "₹7,200/hr",
// //     badge: "Tech Lead",
// //     verified: true,
// //     responseTime: "< 1hr",
// //   },
// //   {
// //     id: "3",
// //     name: "Anjali Krishnan",
// //     title: "Product Design Director",
// //     company: "Figma India",
// //     rating: 4.9,
// //     sessions: 178,
// //     expertise: ["UX Design", "Product Strategy", "Design Systems"],
// //     avatar: AnotaImg,
// //     price: "₹7,800/hr",
// //     badge: "Design Lead",
// //     verified: true,
// //     responseTime: "< 3hrs",
// //   },
// //   {
// //     id: "4",
// //     name: "Sreekuttan N",
// //     title: "Startup Founder & CEO",
// //     company: "TechFlow Kochi",
// //     rating: 4.7,
// //     sessions: 134,
// //     expertise: ["Entrepreneurship", "Business Strategy", "Fundraising"],
// //     avatar: SreeImg,
// //     price: "₹12,000/hr",
// //     badge: "Founder",
// //     verified: true,
// //     responseTime: "< 4hrs",
// //   },
// // ];

// // // Enhanced mock services data with Indian context and colorful themes
// // const mockServices = [
// //   {
// //     id: "1",
// //     title: "1-on-1 Mentoring",
// //     description: "Personalized guidance from industry experts across India",
// //     icon: User,
// //     features: ["Custom learning path", "Weekly sessions", "Goal tracking"],
// //     price: "From ₹4,800/hr",
// //     popular: true,
// //     bgColor:
// //       "from-blue-50 via-blue-100 to-indigo-200 dark:from-blue-950 dark:to-indigo-900",
// //     iconColor: "text-blue-600 dark:text-blue-400",
// //     image:
// //       "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
// //   },
// //   {
// //     id: "2",
// //     title: "Mock Interviews",
// //     description: "Practice with professionals from top Indian tech companies",
// //     icon: MessageSquare,
// //     features: [
// //       "Technical & behavioral",
// //       "Detailed feedback",
// //       "Recording included",
// //     ],
// //     price: "From ₹3,000/session",
// //     bgColor:
// //       "from-green-50 via-emerald-100 to-teal-200 dark:from-green-950 dark:to-emerald-900",
// //     iconColor: "text-green-600 dark:text-green-400",
// //     image:
// //       "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop",
// //   },
// //   {
// //     id: "3",
// //     title: "Resume Review",
// //     description: "Optimize your resume for Indian and global markets",
// //     icon: FileText,
// //     features: ["ATS optimization", "Industry-specific tips", "24hr turnaround"],
// //     price: "From ₹1,800/review",
// //     bgColor:
// //       "from-purple-50 via-violet-100 to-fuchsia-200 dark:from-purple-950 dark:to-violet-900",
// //     iconColor: "text-purple-600 dark:text-purple-400",
// //     image:
// //       "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop",
// //   },
// //   {
// //     id: "4",
// //     title: "Career Guidance",
// //     description: "Strategic career planning for the Indian tech ecosystem",
// //     icon: Target,
// //     features: ["Career assessment", "Industry insights", "Action plan"],
// //     price: "From ₹6,000/session",
// //     bgColor:
// //       "from-orange-50 via-amber-100 to-yellow-200 dark:from-orange-950 dark:to-amber-900",
// //     iconColor: "text-orange-600 dark:text-orange-400",
// //     image:
// //       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
// //   },
// //   {
// //     id: "5",
// //     title: "Skill Development",
// //     description: "Structured learning programs for emerging technologies",
// //     icon: BookOpen,
// //     features: ["Curated courses", "Hands-on projects", "Certificate"],
// //     price: "From ₹12,000/course",
// //     bgColor:
// //       "from-pink-50 via-rose-100 to-red-200 dark:from-pink-950 dark:to-rose-900",
// //     iconColor: "text-pink-600 dark:text-pink-400",
// //     image:
// //       "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
// //   },
// //   {
// //     id: "6",
// //     title: "Project Reviews",
// //     description: "Get feedback on your projects from senior developers",
// //     icon: Code,
// //     features: ["Code review", "Architecture feedback", "Best practices"],
// //     price: "From ₹3,600/review",
// //     bgColor:
// //       "from-teal-50 via-cyan-100 to-sky-200 dark:from-teal-950 dark:to-cyan-900",
// //     iconColor: "text-teal-600 dark:text-teal-400",
// //     image:
// //       "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
// //   },
// // ];

// // // Enhanced mock courses/learning paths (6 courses in 2 rows)
// // const mockCourses = [
// //   {
// //     id: "1",
// //     title: "Full-Stack Development Mastery",
// //     instructor: "Arjun Nair",
// //     level: "Intermediate",
// //     duration: "8 weeks",
// //     rating: 4.8,
// //     students: 1240,
// //     price: "₹17,999",
// //     image:
// //       "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=300&fit=crop",
// //     skills: ["React", "Node.js", "MongoDB", "AWS"],
// //   },
// //   {
// //     id: "2",
// //     title: "AI & Machine Learning Fundamentals",
// //     instructor: "Priya Menon",
// //     level: "Beginner",
// //     duration: "6 weeks",
// //     rating: 4.9,
// //     students: 890,
// //     price: "₹23,999",
// //     image:
// //       "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop",
// //     skills: ["Python", "TensorFlow", "Data Science", "Neural Networks"],
// //   },
// //   {
// //     id: "3",
// //     title: "Product Design Excellence",
// //     instructor: "Anjali Krishnan",
// //     level: "Advanced",
// //     duration: "10 weeks",
// //     rating: 4.7,
// //     students: 567,
// //     price: "₹26,999",
// //     image:
// //       "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=300&fit=crop",
// //     skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
// //   },
// //   {
// //     id: "4",
// //     title: "Mobile App Development",
// //     instructor: "Vineeth Kumar",
// //     level: "Intermediate",
// //     duration: "12 weeks",
// //     rating: 4.8,
// //     students: 723,
// //     price: "₹21,999",
// //     image:
// //       "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=300&fit=crop",
// //     skills: ["React Native", "Flutter", "iOS", "Android"],
// //   },
// //   {
// //     id: "5",
// //     title: "DevOps & Cloud Computing",
// //     instructor: "Rajesh Pillai",
// //     level: "Advanced",
// //     duration: "8 weeks",
// //     rating: 4.6,
// //     students: 445,
// //     price: "₹19,999",
// //     image:
// //       "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=300&fit=crop",
// //     skills: ["Docker", "Kubernetes", "AWS", "Jenkins"],
// //   },
// //   {
// //     id: "6",
// //     title: "Data Science & Analytics",
// //     instructor: "Kavya Nambiar",
// //     level: "Beginner",
// //     duration: "10 weeks",
// //     rating: 4.9,
// //     students: 892,
// //     price: "₹22,999",
// //     image:
// //       "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop",
// //     skills: ["Python", "R", "SQL", "Tableau"],
// //   },
// // ];

// // // Expanded South Indian (Kerala) testimonials - 12 testimonials for moving animation
// // const testimonials = [
// //   {
// //     name: "Akhil Raghavan",
// //     role: "Software Engineer",
// //     company: "Infosys Kochi",
// //     content:
// //       "MentorOne helped me transition from a fresher to a senior developer. The mentors from Kerala tech ecosystem provided invaluable insights.",
// //     rating: 5,
// //     avatar:
// //       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
// //   },
// //   {
// //     name: "Sneha Krishnamurthy",
// //     role: "Product Manager",
// //     company: "Technopark TVM",
// //     content:
// //       "The career guidance I received was transformative. I landed my dream PM role at a Thiruvananthapuram startup within 2 months.",
// //     rating: 5,
// //     avatar:
// //       "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
// //   },
// //   {
// //     name: "Vishnu Mohan",
// //     role: "UX Designer",
// //     company: "UST Global",
// //     content:
// //       "Outstanding mentorship platform! The design guidance from Kerala-based mentors helped me excel in my UX career at UST Global.",
// //     rating: 5,
// //     avatar:
// //       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
// //   },
// //   {
// //     name: "Athira Suresh",
// //     role: "Data Scientist",
// //     company: "Quest Global",
// //     content:
// //       "The AI mentorship program was exceptional. Learning from industry experts in Kochi helped me build a strong foundation in machine learning.",
// //     rating: 5,
// //     avatar:
// //       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
// //   },
// //   {
// //     name: "Anand Pillai",
// //     role: "Full-Stack Developer",
// //     company: "IBS Software",
// //     content:
// //       "From being confused about my career path to becoming a confident developer - MentorOne's structured approach made all the difference.",
// //     rating: 5,
// //     avatar:
// //       "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
// //   },
// //   {
// //     name: "Deepika Nair",
// //     role: "DevOps Engineer",
// //     company: "Tata Elxsi",
// //     content:
// //       "The cloud computing mentorship was exactly what I needed. Now I'm leading DevOps initiatives at Tata Elxsi thanks to my mentor's guidance.",
// //     rating: 5,
// //     avatar:
// //       "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
// //   },
// //   {
// //     name: "Rajesh Kumar",
// //     role: "Backend Developer",
// //     company: "Freshworks",
// //     content:
// //       "The mentorship sessions helped me master system design concepts. I successfully cracked interviews at multiple product companies.",
// //     rating: 5,
// //     avatar:
// //       "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
// //   },
// //   {
// //     name: "Kavitha Menon",
// //     role: "Frontend Developer",
// //     company: "Byju's",
// //     content:
// //       "Learning React from industry experts transformed my frontend skills. The personalized guidance was exactly what I needed.",
// //     rating: 5,
// //     avatar:
// //       "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
// //   },
// //   {
// //     name: "Arun Gopinath",
// //     role: "Mobile Developer",
// //     company: "Zoho",
// //     content:
// //       "The mobile development mentorship helped me transition from web to mobile. Now I'm building apps used by millions at Zoho.",
// //     rating: 5,
// //     avatar:
// //       "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face",
// //   },
// //   {
// //     name: "Lakshmi Nair",
// //     role: "QA Engineer",
// //     company: "HCL Technologies",
// //     content:
// //       "The testing mentorship program elevated my automation skills. I'm now leading a team of 10 QA engineers at HCL.",
// //     rating: 5,
// //     avatar:
// //       "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
// //   },
// //   {
// //     name: "Suresh Babu",
// //     role: "DevOps Lead",
// //     company: "TCS",
// //     content:
// //       "The cloud architecture guidance was phenomenal. I successfully migrated our entire infrastructure to AWS with zero downtime.",
// //     rating: 5,
// //     avatar:
// //       "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
// //   },
// //   {
// //     name: "Meera Krishnan",
// //     role: "Business Analyst",
// //     company: "Wipro",
// //     content:
// //       "The business analysis mentorship helped me understand requirements better. I'm now handling enterprise-level projects confidently.",
// //     rating: 5,
// //     avatar:
// //       "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
// //   },
// // ];

// // // FAQ data
// // const faqData = [
// //   {
// //     question: "How does the mentorship matching process work?",
// //     answer:
// //       "Our AI-powered matching system considers your goals, experience level, preferred learning style, and industry focus to connect you with the most suitable mentors from India's top tech companies. You can also browse mentor profiles and book sessions directly.",
// //   },
// //   {
// //     question: "What's included in a mentorship session?",
// //     answer:
// //       "Each session includes personalized guidance, actionable feedback, resource recommendations, and a follow-up summary. Sessions are recorded (with permission) for your reference, and you'll receive notes and action items in both English and Malayalam if preferred.",
// //   },
// //   {
// //     question: "Can I switch mentors if needed?",
// //     answer:
// //       "Absolutely! While we encourage building long-term relationships, you can work with multiple mentors or switch based on your evolving needs. There are no restrictions on changing mentors.",
// //   },
// //   {
// //     question: "What payment methods do you accept?",
// //     answer:
// //       "We accept all major payment methods including UPI, Net Banking, Credit/Debit Cards, and popular digital wallets like Paytm, PhonePe, and Google Pay. All prices are in Indian Rupees.",
// //   },
// //   {
// //     question: "Are sessions available in regional languages?",
// //     answer:
// //       "Yes! Many of our mentors are comfortable conducting sessions in Malayalam, Tamil, Hindi, and other regional languages alongside English, especially for our Kerala-based mentors.",
// //   },
// //   {
// //     question: "How do I track my progress?",
// //     answer:
// //       "Your dashboard includes comprehensive progress tracking, goal setting, session history, and skill assessments. You'll receive regular reports showing your growth and areas for improvement.",
// //   },
// // ];

// // // Moving Testimonials Component
// // const MovingTestimonials = ({
// //   testimonials,
// //   direction = "left",
// //   speed = "normal",
// // }) => {
// //   const animationClass =
// //     direction === "left" ? "animate-scroll-left" : "animate-scroll-right";
// //   const speedClass =
// //     speed === "fast"
// //       ? "duration-20s"
// //       : speed === "slow"
// //       ? "duration-40s"
// //       : "duration-30s";

// //   return (
// //     <div className="relative overflow-hidden">
// //       <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-950 dark:to-transparent z-10"></div>
// //       <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-950 dark:to-transparent z-10"></div>

// //       <div className={`flex gap-6 ${animationClass} ${speedClass}`}>
// //         {[...testimonials, ...testimonials].map((testimonial, index) => (
// //           <div
// //             key={index}
// //             className="flex-shrink-0 w-80 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800"
// //           >
// //             <div className="space-y-4">
// //               <div className="flex items-center gap-3">
// //                 <Avatar className="h-12 w-12">
// //                   <AvatarImage
// //                     src={testimonial.avatar}
// //                     alt={testimonial.name}
// //                   />
// //                   <AvatarFallback>
// //                     {testimonial.name
// //                       .split(" ")
// //                       .map((n) => n[0])
// //                       .join("")}
// //                   </AvatarFallback>
// //                 </Avatar>
// //                 <div>
// //                   <h4 className="font-semibold text-gray-900 dark:text-white">
// //                     {testimonial.name}
// //                   </h4>
// //                   <p className="text-sm text-gray-600 dark:text-gray-400">
// //                     {testimonial.role} at {testimonial.company}
// //                   </p>
// //                 </div>
// //               </div>

// //               <div className="flex">
// //                 {[...Array(testimonial.rating)].map((_, i) => (
// //                   <Star
// //                     key={i}
// //                     className="h-4 w-4 fill-yellow-400 text-yellow-400"
// //                   />
// //                 ))}
// //               </div>

// //               <p className="text-gray-700 dark:text-gray-300 italic text-sm leading-relaxed">
// //                 "{testimonial.content}"
// //               </p>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       <style jsx>{`
// //         @keyframes scroll-left {
// //           from {
// //             transform: translateX(0);
// //           }
// //           to {
// //             transform: translateX(-50%);
// //           }
// //         }
// //         @keyframes scroll-right {
// //           from {
// //             transform: translateX(-50%);
// //           }
// //           to {
// //             transform: translateX(0);
// //           }
// //         }
// //         .animate-scroll-left {
// //           animation: scroll-left linear infinite;
// //         }
// //         .animate-scroll-right {
// //           animation: scroll-right linear infinite;
// //         }
// //         .duration-20s {
// //           animation-duration: 20s;
// //         }
// //         .duration-30s {
// //           animation-duration: 30s;
// //         }
// //         .duration-40s {
// //           animation-duration: 40s;
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };

// // // Components
// // const MentorCard = ({ mentor }) => {
// //   return (
// //     <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden hover:scale-105 shadow-lg">
// //       <div className="relative h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
// //         <div className="absolute inset-0 bg-black/20"></div>
// //         <div className="absolute -bottom-8 left-6">
// //           <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
// //             <AvatarImage src={mentor.avatar} alt={mentor.name} />
// //             <AvatarFallback>
// //               {mentor.name
// //                 .split(" ")
// //                 .map((n) => n[0])
// //                 .join("")}
// //             </AvatarFallback>
// //           </Avatar>
// //         </div>
// //         {mentor.verified && (
// //           <Badge className="absolute top-4 right-4 bg-green-500 hover:bg-green-600">
// //             <Shield className="w-3 h-3 mr-1" />
// //             Verified
// //           </Badge>
// //         )}
// //       </div>

// //       <CardContent className="pt-12 pb-6">
// //         <div className="space-y-4">
// //           <div>
// //             <h3 className="font-bold text-lg text-gray-900 dark:text-white">
// //               {mentor.name}
// //             </h3>
// //             <p className="text-sm text-gray-600 dark:text-gray-400">
// //               {mentor.title}
// //             </p>
// //             <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
// //               {mentor.company}
// //             </p>
// //           </div>

// //           <div className="flex items-center justify-between">
// //             <div className="flex items-center gap-1">
// //               <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
// //               <span className="text-sm font-medium">{mentor.rating}</span>
// //               <span className="text-xs text-gray-500">({mentor.sessions})</span>
// //             </div>
// //             <Badge variant="outline" className="text-xs">
// //               {mentor.badge}
// //             </Badge>
// //           </div>

// //           <div className="flex flex-wrap gap-1 max-h-8">
// //             {mentor.expertise.slice(0, 2).map((skill, index) => (
// //               <Badge key={index} variant="secondary" className="text-xs">
// //                 {skill}
// //               </Badge>
// //             ))}
// //             {mentor.expertise.length > 2 && (
// //               <Badge variant="secondary" className="text-xs">
// //                 +{mentor.expertise.length - 2}
// //               </Badge>
// //             )}
// //           </div>

// //           <Button
// //             size="sm"
// //             className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
// //           >
// //             Book Session
// //           </Button>
// //         </div>
// //       </CardContent>
// //     </Card>
// //   );
// // };

// // const ServiceCard = ({ service }) => {
// //   const Icon = service.icon;

// //   return (
// //     <Card
// //       className={`group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br ${service.bgColor} hover:scale-105 relative overflow-hidden shadow-lg`}
// //     >
// //       {service.popular && (
// //         <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
// //           POPULAR
// //         </div>
// //       )}

// //       <div className="relative h-48 overflow-hidden">
// //         <img
// //           src={service.image}
// //           alt={service.title}
// //           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
// //         />
// //         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
// //         <div className="absolute bottom-4 left-4 right-4 z-10">
// //           <div className="flex items-center gap-3 mb-2">
// //             <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
// //               <Icon className="h-5 w-5 text-white" />
// //             </div>
// //           </div>
// //           <h3 className="font-bold text-white text-lg leading-tight">
// //             {service.title}
// //           </h3>
// //         </div>
// //       </div>

// //       <CardContent className="p-6">
// //         <div className="space-y-4">
// //           <p className="text-sm text-gray-700 dark:text-gray-400">
// //             {service.description}
// //           </p>

// //           <ul className="space-y-2">
// //             {service.features.map((feature, index) => (
// //               <li key={index} className="flex items-center gap-2 text-sm">
// //                 <CheckCircle className="h-4 w-4 text-green-600" />
// //                 <span className="text-gray-700 dark:text-gray-300">
// //                   {feature}
// //                 </span>
// //               </li>
// //             ))}
// //           </ul>

// //           <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
// //             <div className="flex items-center justify-between">
// //               <span className="font-bold text-lg text-gray-900 dark:text-white">
// //                 {service.price}
// //               </span>
// //               <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
// //                 Learn More
// //               </Button>
// //             </div>
// //           </div>
// //         </div>
// //       </CardContent>
// //     </Card>
// //   );
// // };

// // const CourseCard = ({ course }) => {
// //   return (
// //     <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white via-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden hover:scale-105 shadow-lg">
// //       <div className="relative h-40 overflow-hidden">
// //         <img
// //           src={course.image}
// //           alt={course.title}
// //           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
// //         />
// //         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
// //         <div className="absolute bottom-3 left-3 right-3">
// //           <Badge className="mb-2 bg-white/20 backdrop-blur-sm border-white/30 text-xs">
// //             {course.level}
// //           </Badge>
// //           <h3 className="font-bold text-white text-base leading-tight">
// //             {course.title}
// //           </h3>
// //         </div>
// //         <Button
// //           size="sm"
// //           className="absolute top-3 right-3 rounded-full w-8 h-8 p-0 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30"
// //         >
// //           <Play className="w-3 h-3" />
// //         </Button>
// //       </div>

// //       <CardContent className="p-4">
// //         <div className="space-y-3">
// //           <div className="flex items-center justify-between">
// //             <div className="flex items-center gap-2">
// //               <Avatar className="h-6 w-6">
// //                 <AvatarImage
// //                   src={
// //                     mockMentors.find((m) => m.name === course.instructor)
// //                       ?.avatar
// //                   }
// //                 />
// //                 <AvatarFallback className="text-xs">
// //                   {course.instructor
// //                     .split(" ")
// //                     .map((n) => n[0])
// //                     .join("")}
// //                 </AvatarFallback>
// //               </Avatar>
// //               <span className="text-xs text-gray-600 dark:text-gray-400">
// //                 {course.instructor}
// //               </span>
// //             </div>
// //             <span className="text-xs text-gray-500">{course.duration}</span>
// //           </div>

// //           <div className="flex items-center justify-between">
// //             <div className="flex items-center gap-1">
// //               <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
// //               <span className="text-xs font-medium">{course.rating}</span>
// //               <span className="text-xs text-gray-500">({course.students})</span>
// //             </div>
// //             <span className="font-bold text-base">{course.price}</span>
// //           </div>

// //           <div className="flex flex-wrap gap-1">
// //             {course.skills.map((skill, index) => (
// //               <Badge
// //                 key={index}
// //                 variant="secondary"
// //                 className="text-xs px-2 py-0"
// //               >
// //                 {skill}
// //               </Badge>
// //             ))}
// //           </div>

// //           <Button
// //             size="sm"
// //             className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
// //           >
// //             Enroll Now
// //           </Button>
// //         </div>
// //       </CardContent>
// //     </Card>
// //   );
// // };

// // // Simplified Hero Section Component
// // const DynamicHeroSection = () => {
// //   const [currentSlide, setCurrentSlide] = useState(0);

// //   const heroSlides = [
// //     {
// //       title: "MentorONE",
// //       subtitle:
// //         "Transform your career with personalized mentorship from India's top tech leaders",
// //       gradient: "from-blue-800 via-black to-purple-800",
// //     },
// //     {
// //       title: "Learn & Grow",
// //       subtitle: "Connect with industry experts from thriving tech ecosystem",
// //       gradient: "from-blue-800 via-black to-purple-800",
// //     },
// //     {
// //       title: "Career Success",
// //       subtitle:
// //         "Join thousands of professionals who have accelerated their careers with us",
// //       gradient: "from-blue-800 via-black to-purple-800",
// //     },
// //   ];

// //   useEffect(() => {
// //     const interval = setInterval(() => {
// //       setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
// //     }, 4000);

// //     return () => clearInterval(interval);
// //   }, []);

// //   const currentHero = heroSlides[currentSlide];

// //   return (
// //     <section
// //       className={`relative overflow-hidden bg-gradient-to-br ${currentHero.gradient} text-white`}
// //     >
// //       <div className="absolute inset-0 bg-grid-white/[0.05] bg-grid-16"></div>

// //       {/* Simplified floating shapes */}
// //       <div className="absolute inset-0 overflow-hidden opacity-20">
// //         <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full animate-pulse"></div>
// //         <div className="absolute bottom-32 right-32 w-24 h-24 border border-white/20 rounded-full animate-pulse"></div>
// //         <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-lg rotate-45"></div>
// //       </div>

// //       <div className="relative max-w-7xl mx-auto px-6 py-20">
// //         <div className="text-center space-y-8 transition-all duration-700">
// //           <div className="space-y-4">
// //             <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
// //               {currentHero.title}
// //             </h1>
// //             <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
// //               {currentHero.subtitle}
// //             </p>
// //           </div>

// //           <div className="flex flex-col sm:flex-row gap-4 justify-center">
// //             <Button
// //               size="lg"
// //               className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 shadow-lg"
// //             >
// //               <Rocket className="w-5 h-5 mr-2" />
// //               Start Learning
// //             </Button>
// //             <Button
// //               size="lg"
// //               variant="outline"
// //               className="border-white text-white hover:bg-white/10 font-semibold px-8"
// //             >
// //               <Play className="w-5 h-5 mr-2" />
// //               Watch Demo
// //             </Button>
// //           </div>

// //           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
// //             {[
// //               { number: "10K+", label: "Active Mentees" },
// //               { number: "500+", label: "Expert Mentors" },
// //               { number: "50K+", label: "Sessions Completed" },
// //               { number: "4.9", label: "Average Rating" },
// //             ].map((stat, index) => (
// //               <div key={index} className="text-center">
// //                 <div className="text-2xl md:text-3xl font-bold">
// //                   {stat.number}
// //                 </div>
// //                 <div className="text-blue-200 text-sm">{stat.label}</div>
// //               </div>
// //             ))}
// //           </div>

// //           {/* Slide indicators */}
// //           <div className="flex justify-center gap-2 pt-8">
// //             {heroSlides.map((_, index) => (
// //               <button
// //                 key={index}
// //                 onClick={() => setCurrentSlide(index)}
// //                 className={`w-3 h-3 rounded-full transition-all duration-300 ${
// //                   index === currentSlide ? "bg-white" : "bg-white/30"
// //                 }`}
// //               />
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // // Main Dashboard Component
// // const MenteeDashboard = () => {
// //   const [isLoading, setIsLoading] = useState(true);

// //   useEffect(() => {
// //     const timer = setTimeout(() => {
// //       setIsLoading(false);
// //     }, 800); // Reduced loading time

// //     return () => clearTimeout(timer);
// //   }, []);

// //   if (isLoading) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:bg-gray-950 p-6">
// //         <div className="max-w-7xl mx-auto space-y-8">
// //           <Skeleton className="h-64 w-full rounded-3xl" />
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //             {[...Array(6)].map((_, i) => (
// //               <Skeleton key={i} className="h-64 rounded-xl" />
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:bg-gray-950">
// //       {/* Dynamic Hero Section */}
// //       <DynamicHeroSection />

// //       <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
// //         {/* Services Section */}
// //         <section>
// //           <div className="text-center mb-12">
// //             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
// //               Our Mentorship Services
// //             </h2>
// //             <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
// //               Choose from our comprehensive range of mentorship services
// //               designed to accelerate your career growth in India's tech industry
// //             </p>
// //           </div>
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //             {mockServices.map((service) => (
// //               <ServiceCard key={service.id} service={service} />
// //             ))}
// //           </div>

// //           {/* Centered View All Button */}
// //           <div className="flex justify-center mt-12">
// //             <Button
// //               size="lg"
// //               className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
// //             >
// //               <Globe className="w-5 h-5 mr-2" />
// //               View All Services
// //               <ChevronRight className="w-5 h-5 ml-2" />
// //             </Button>
// //           </div>
// //         </section>

// //         {/* Top Mentors */}
// //         <section>
// //           <div className="text-center mb-8">
// //             <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
// //               Top Mentors
// //             </h2>
// //             <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
// //               Connect with industry leaders and accelerate your growth
// //             </p>
// //           </div>
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //             {mockMentors.map((mentor) => (
// //               <MentorCard key={mentor.id} mentor={mentor} />
// //             ))}
// //           </div>

// //           {/* Centered View All Button */}
// //           <div className="flex justify-center mt-12">
// //             <Button
// //               size="lg"
// //               className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
// //             >
// //               <User className="w-5 h-5 mr-2" />
// //               View All Mentors
// //               <ChevronRight className="w-5 h-5 ml-2" />
// //             </Button>
// //           </div>
// //         </section>

// //         {/* Featured Learning Paths */}
// //         <section>
// //           <div className="text-center mb-8">
// //             <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
// //               Featured Learning Paths
// //             </h2>
// //             <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
// //               Master in-demand skills with our expert-designed courses
// //             </p>
// //           </div>
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //             {mockCourses.map((course) => (
// //               <CourseCard key={course.id} course={course} />
// //             ))}
// //           </div>

// //           {/* Centered Explore All Button */}
// //           <div className="flex justify-center mt-12">
// //             <Button
// //               size="lg"
// //               className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
// //             >
// //               <BookOpen className="w-5 h-5 mr-2" />
// //               Explore All Courses
// //               <ChevronRight className="w-5 h-5 ml-2" />
// //             </Button>
// //           </div>
// //         </section>

// //         {/* Success Stories - Moving Testimonials */}
// //         <section>
// //           <div className="text-center mb-12">
// //             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
// //               Success Stories
// //             </h2>
// //             <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
// //               Hear from our mentees who have transformed their careers with
// //               MentorOne
// //             </p>
// //           </div>

// //           <div className="space-y-8">
// //             {/* First row - moving left */}
// //             <MovingTestimonials
// //               testimonials={testimonials.slice(0, 6)}
// //               direction="left"
// //               speed="normal"
// //             />

// //             {/* Second row - moving right */}
// //             <MovingTestimonials
// //               testimonials={testimonials.slice(6, 12)}
// //               direction="right"
// //               speed="normal"
// //             />
// //           </div>
// //         </section>

// //         {/* FAQ Section */}
// //         <section>
// //           <div className="text-center mb-12">
// //             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
// //               Frequently Asked Questions
// //             </h2>
// //             <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
// //               Everything you need to know about our mentorship platform
// //             </p>
// //           </div>
// //           <div className="max-w-4xl mx-auto">
// //             <Accordion type="single" collapsible className="w-full space-y-4">
// //               {faqData.map((faq, index) => (
// //                 <AccordionItem
// //                   key={index}
// //                   value={`item-${index}`}
// //                   className="border border-gray-200 dark:border-gray-800 rounded-lg px-6 bg-white dark:bg-gray-900 hover:shadow-md transition-all duration-300"
// //                 >
// //                   <AccordionTrigger className="text-left hover:no-underline py-6">
// //                     <span className="font-semibold text-gray-900 dark:text-white text-lg">
// //                       {faq.question}
// //                     </span>
// //                   </AccordionTrigger>
// //                   <AccordionContent className="pb-6 text-gray-600 dark:text-gray-400 text-base leading-relaxed">
// //                     {faq.answer}
// //                   </AccordionContent>
// //                 </AccordionItem>
// //               ))}
// //             </Accordion>
// //           </div>
// //         </section>

// //         {/* Call to Action */}
// //         <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-800 via-purple-800 to-indigo-800 text-white shadow-2xl">
// //           <div className="absolute inset-0 bg-grid-white/[0.1] bg-grid-16"></div>
// //           <div className="relative px-8 py-16 text-center">
// //             <div className="space-y-6">
// //               <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
// //                 <Sparkles className="w-4 h-4" />
// //                 Start Your Journey Today
// //               </div>
// //               <h2 className="text-3xl md:text-5xl font-bold">
// //                 Ready to Accelerate Your Career?
// //               </h2>
// //               <p className="text-xl text-blue-100 max-w-2xl mx-auto">
// //                 Join thousands of professionals who have transformed their
// //                 careers with personalized mentorship
// //               </p>
// //               <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
// //                 <Button
// //                   size="lg"
// //                   className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 shadow-lg"
// //                 >
// //                   <BrainCircuit className="w-5 h-5 mr-2" />
// //                   Find Your Mentor
// //                 </Button>
// //                 <Button
// //                   size="lg"
// //                   variant="outline"
// //                   className="border-white text-white hover:bg-white/10 font-semibold px-8"
// //                 >
// //                   <MessageSquare className="w-5 h-5 mr-2" />
// //                   Contact Support
// //                 </Button>
// //               </div>
// //             </div>
// //           </div>
// //         </section>

// //         {/* Why Choose MentorOne - Enhanced with colors */}
// //         <section>
// //           <div className="text-center mb-12">
// //             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
// //               Why Choose MentorOne?
// //             </h2>
// //             <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
// //               We provide everything you need for successful mentorship and
// //               career growth
// //             </p>
// //           </div>
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
// //             {[
// //               {
// //                 icon: Shield,
// //                 title: "Verified Experts",
// //                 description:
// //                   "All mentors are thoroughly vetted professionals from India's top tech companies and startups.",
// //                 gradient: "from-blue-500 to-cyan-500",
// //                 bgGradient:
// //                   "from-blue-50 via-cyan-50 to-blue-100 dark:from-blue-950 dark:to-cyan-900",
// //               },
// //               {
// //                 icon: Zap,
// //                 title: "Instant Matching",
// //                 description:
// //                   "Our AI-powered system connects you with the perfect mentor in minutes.",
// //                 gradient: "from-green-500 to-emerald-500",
// //                 bgGradient:
// //                   "from-green-50 via-emerald-50 to-green-100 dark:from-green-950 dark:to-emerald-900",
// //               },
// //               {
// //                 icon: Globe,
// //                 title: "Pan-India Network",
// //                 description:
// //                   "Access mentors from Bangalore, Hyderabad, Pune, Mumbai, and Kerala's emerging tech hubs.",
// //                 gradient: "from-purple-500 to-violet-500",
// //                 bgGradient:
// //                   "from-purple-50 via-violet-50 to-purple-100 dark:from-purple-950 dark:to-violet-900",
// //               },
// //               {
// //                 icon: Award,
// //                 title: "Proven Results",
// //                 description:
// //                   "95% of our mentees achieve their career goals within 6 months, with average salary increases of 40%.",
// //                 gradient: "from-orange-500 to-red-500",
// //                 bgGradient:
// //                   "from-orange-50 via-red-50 to-orange-100 dark:from-orange-950 dark:to-red-900",
// //               },
// //             ].map((feature, index) => (
// //               <Card
// //                 key={index}
// //                 className={`group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br ${feature.bgGradient} text-center hover:scale-105 shadow-lg`}
// //               >
// //                 <CardContent className="p-6">
// //                   <div className="space-y-4">
// //                     <div className="relative">
// //                       <div
// //                         className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} group-hover:scale-110 transition-transform duration-300 shadow-lg`}
// //                       >
// //                         <feature.icon className="h-8 w-8 text-white" />
// //                       </div>
// //                     </div>
// //                     <h3 className="font-bold text-xl text-gray-900 dark:text-white">
// //                       {feature.title}
// //                     </h3>
// //                     <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
// //                       {feature.description}
// //                     </p>
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             ))}
// //           </div>
// //         </section>
// //       </div>
// //     </div>
// //   );
// // };

// // export default MenteeDashboard;
// import { useState, useEffect } from "react";
// import {
//   Star,
//   ChevronRight,
//   BookOpen,
//   MessageSquare,
//   Target,
//   Award,
//   Zap,
//   FileText,
//   User,
//   Globe,
//   Shield,
//   Play,
//   CheckCircle,
//   Sparkles,
//   Code,
//   BrainCircuit,
//   Rocket,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import SreeImg from "@/assets/Sree.jpeg";
// import JasnaImg from "@/assets/Jasna.jpeg";
// import JithinImg from "@/assets/Jithin.jpeg";
// import AnotaImg from "@/assets/Anita.jpeg";

// // Enhanced mock mentors data with Indian names
// const mockMentors = [
//   {
//     id: "1",
//     name: "Jithin Nair",
//     title: "Senior AI Research Scientist",
//     company: "Google India",
//     rating: 4.9,
//     sessions: 156,
//     expertise: ["Machine Learning", "Deep Learning", "AI Ethics"],
//     avatar: JithinImg,
//     price: "₹8,500/hr",
//     badge: "AI Expert",
//     verified: true,
//     responseTime: "< 2hrs",
//   },
//   {
//     id: "2",
//     name: "Priya Menon",
//     title: "Principal Software Engineer",
//     company: "Microsoft India",
//     rating: 4.8,
//     sessions: 203,
//     expertise: ["System Design", "Leadership", "React"],
//     avatar: JasnaImg,
//     price: "₹7,200/hr",
//     badge: "Tech Lead",
//     verified: true,
//     responseTime: "< 1hr",
//   },
//   {
//     id: "3",
//     name: "Anjali Krishnan",
//     title: "Product Design Director",
//     company: "Figma India",
//     rating: 4.9,
//     sessions: 178,
//     expertise: ["UX Design", "Product Strategy", "Design Systems"],
//     avatar: AnotaImg,
//     price: "₹7,800/hr",
//     badge: "Design Lead",
//     verified: true,
//     responseTime: "< 3hrs",
//   },
//   {
//     id: "4",
//     name: "Sreekuttan N",
//     title: "Startup Founder & CEO",
//     company: "TechFlow Kochi",
//     rating: 4.7,
//     sessions: 134,
//     expertise: ["Entrepreneurship", "Business Strategy", "Fundraising"],
//     avatar: SreeImg,
//     price: "₹12,000/hr",
//     badge: "Founder",
//     verified: true,
//     responseTime: "< 4hrs",
//   },
// ];

// // Enhanced mock services data with Indian context and colorful themes
// const mockServices = [
//   {
//     id: "1",
//     title: "1-on-1 Mentoring",
//     description: "Personalized guidance from industry experts across India",
//     icon: User,
//     features: ["Custom learning path", "Weekly sessions", "Goal tracking"],
//     price: "From ₹4,800/hr",
//     popular: true,
//     bgColor:
//       "from-blue-50 via-blue-100 to-indigo-200 dark:from-blue-950 dark:to-indigo-900",
//     iconColor: "text-blue-600 dark:text-blue-400",
//     image:
//       "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
//   },
//   {
//     id: "2",
//     title: "Mock Interviews",
//     description: "Practice with professionals from top Indian tech companies",
//     icon: MessageSquare,
//     features: [
//       "Technical & behavioral",
//       "Detailed feedback",
//       "Recording included",
//     ],
//     price: "From ₹3,000/session",
//     bgColor:
//       "from-green-50 via-emerald-100 to-teal-200 dark:from-green-950 dark:to-emerald-900",
//     iconColor: "text-green-600 dark:text-green-400",
//     image:
//       "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop",
//   },
//   {
//     id: "3",
//     title: "Resume Review",
//     description: "Optimize your resume for Indian and global markets",
//     icon: FileText,
//     features: ["ATS optimization", "Industry-specific tips", "24hr turnaround"],
//     price: "From ₹1,800/review",
//     bgColor:
//       "from-purple-50 via-violet-100 to-fuchsia-200 dark:from-purple-950 dark:to-violet-900",
//     iconColor: "text-purple-600 dark:text-purple-400",
//     image:
//       "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop",
//   },
//   {
//     id: "4",
//     title: "Career Guidance",
//     description: "Strategic career planning for the Indian tech ecosystem",
//     icon: Target,
//     features: ["Career assessment", "Industry insights", "Action plan"],
//     price: "From ₹6,000/session",
//     bgColor:
//       "from-orange-50 via-amber-100 to-yellow-200 dark:from-orange-950 dark:to-amber-900",
//     iconColor: "text-orange-600 dark:text-orange-400",
//     image:
//       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
//   },
//   {
//     id: "5",
//     title: "Skill Development",
//     description: "Structured learning programs for emerging technologies",
//     icon: BookOpen,
//     features: ["Curated courses", "Hands-on projects", "Certificate"],
//     price: "From ₹12,000/course",
//     bgColor:
//       "from-pink-50 via-rose-100 to-red-200 dark:from-pink-950 dark:to-rose-900",
//     iconColor: "text-pink-600 dark:text-pink-400",
//     image:
//       "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
//   },
//   {
//     id: "6",
//     title: "Project Reviews",
//     description: "Get feedback on your projects from senior developers",
//     icon: Code,
//     features: ["Code review", "Architecture feedback", "Best practices"],
//     price: "From ₹3,600/review",
//     bgColor:
//       "from-teal-50 via-cyan-100 to-sky-200 dark:from-teal-950 dark:to-cyan-900",
//     iconColor: "text-teal-600 dark:text-teal-400",
//     image:
//       "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
//   },
// ];

// // Enhanced mock courses/learning paths (6 courses in 2 rows)
// const mockCourses = [
//   {
//     id: "1",
//     title: "Full-Stack Development Mastery",
//     instructor: "Arjun Nair",
//     level: "Intermediate",
//     duration: "8 weeks",
//     rating: 4.8,
//     students: 1240,
//     price: "₹17,999",
//     image:
//       "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=300&fit=crop",
//     skills: ["React", "Node.js", "MongoDB", "AWS"],
//   },
//   {
//     id: "2",
//     title: "AI & Machine Learning Fundamentals",
//     instructor: "Priya Menon",
//     level: "Beginner",
//     duration: "6 weeks",
//     rating: 4.9,
//     students: 890,
//     price: "₹23,999",
//     image:
//       "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop",
//     skills: ["Python", "TensorFlow", "Data Science", "Neural Networks"],
//   },
//   {
//     id: "3",
//     title: "Product Design Excellence",
//     instructor: "Anjali Krishnan",
//     level: "Advanced",
//     duration: "10 weeks",
//     rating: 4.7,
//     students: 567,
//     price: "₹26,999",
//     image:
//       "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=300&fit=crop",
//     skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
//   },
//   {
//     id: "4",
//     title: "Mobile App Development",
//     instructor: "Vineeth Kumar",
//     level: "Intermediate",
//     duration: "12 weeks",
//     rating: 4.8,
//     students: 723,
//     price: "₹21,999",
//     image:
//       "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=300&fit=crop",
//     skills: ["React Native", "Flutter", "iOS", "Android"],
//   },
//   {
//     id: "5",
//     title: "DevOps & Cloud Computing",
//     instructor: "Rajesh Pillai",
//     level: "Advanced",
//     duration: "8 weeks",
//     rating: 4.6,
//     students: 445,
//     price: "₹19,999",
//     image:
//       "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=300&fit=crop",
//     skills: ["Docker", "Kubernetes", "AWS", "Jenkins"],
//   },
//   {
//     id: "6",
//     title: "Data Science & Analytics",
//     instructor: "Kavya Nambiar",
//     level: "Beginner",
//     duration: "10 weeks",
//     rating: 4.9,
//     students: 892,
//     price: "₹22,999",
//     image:
//       "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop",
//     skills: ["Python", "R", "SQL", "Tableau"],
//   },
// ];

// // Expanded South Indian (Kerala) testimonials - 12 testimonials for moving animation
// const testimonials = [
//   {
//     name: "Akhil Raghavan",
//     role: "Software Engineer",
//     company: "Infosys Kochi",
//     content:
//       "MentorOne helped me transition from a fresher to a senior developer. The mentors from Kerala tech ecosystem provided invaluable insights.",
//     rating: 5,
//     avatar:
//       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
//   },
//   {
//     name: "Sneha Krishnamurthy",
//     role: "Product Manager",
//     company: "Technopark TVM",
//     content:
//       "The career guidance I received was transformative. I landed my dream PM role at a Thiruvananthapuram startup within 2 months.",
//     rating: 5,
//     avatar:
//       "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
//   },
//   {
//     name: "Vishnu Mohan",
//     role: "UX Designer",
//     company: "UST Global",
//     content:
//       "Outstanding mentorship platform! The design guidance from Kerala-based mentors helped me excel in my UX career at UST Global.",
//     rating: 5,
//     avatar:
//       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
//   },
//   {
//     name: "Athira Suresh",
//     role: "Data Scientist",
//     company: "Quest Global",
//     content:
//       "The AI mentorship program was exceptional. Learning from industry experts in Kochi helped me build a strong foundation in machine learning.",
//     rating: 5,
//     avatar:
//       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
//   },
//   {
//     name: "Anand Pillai",
//     role: "Full-Stack Developer",
//     company: "IBS Software",
//     content:
//       "From being confused about my career path to becoming a confident developer - MentorOne's structured approach made all the difference.",
//     rating: 5,
//     avatar:
//       "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
//   },
//   {
//     name: "Deepika Nair",
//     role: "DevOps Engineer",
//     company: "Tata Elxsi",
//     content:
//       "The cloud computing mentorship was exactly what I needed. Now I'm leading DevOps initiatives at Tata Elxsi thanks to my mentor's guidance.",
//     rating: 5,
//     avatar:
//       "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
//   },
//   {
//     name: "Rajesh Kumar",
//     role: "Backend Developer",
//     company: "Freshworks",
//     content:
//       "The mentorship sessions helped me master system design concepts. I successfully cracked interviews at multiple product companies.",
//     rating: 5,
//     avatar:
//       "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
//   },
//   {
//     name: "Kavitha Menon",
//     role: "Frontend Developer",
//     company: "Byju's",
//     content:
//       "Learning React from industry experts transformed my frontend skills. The personalized guidance was exactly what I needed.",
//     rating: 5,
//     avatar:
//       "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
//   },
//   {
//     name: "Arun Gopinath",
//     role: "Mobile Developer",
//     company: "Zoho",
//     content:
//       "The mobile development mentorship helped me transition from web to mobile. Now I'm building apps used by millions at Zoho.",
//     rating: 5,
//     avatar:
//       "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face",
//   },
//   {
//     name: "Lakshmi Nair",
//     role: "QA Engineer",
//     company: "HCL Technologies",
//     content:
//       "The testing mentorship program elevated my automation skills. I'm now leading a team of 10 QA engineers at HCL.",
//     rating: 5,
//     avatar:
//       "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
//   },
//   {
//     name: "Suresh Babu",
//     role: "DevOps Lead",
//     company: "TCS",
//     content:
//       "The cloud architecture guidance was phenomenal. I successfully migrated our entire infrastructure to AWS with zero downtime.",
//     rating: 5,
//     avatar:
//       "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
//   },
//   {
//     name: "Meera Krishnan",
//     role: "Business Analyst",
//     company: "Wipro",
//     content:
//       "The business analysis mentorship helped me understand requirements better. I'm now handling enterprise-level projects confidently.",
//     rating: 5,
//     avatar:
//       "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
//   },
// ];

// // FAQ data
// const faqData = [
//   {
//     question: "How does the mentorship matching process work?",
//     answer:
//       "Our AI-powered matching system considers your goals, experience level, preferred learning style, and industry focus to connect you with the most suitable mentors from India's top tech companies. You can also browse mentor profiles and book sessions directly.",
//   },
//   {
//     question: "What's included in a mentorship session?",
//     answer:
//       "Each session includes personalized guidance, actionable feedback, resource recommendations, and a follow-up summary. Sessions are recorded (with permission) for your reference, and you'll receive notes and action items in both English and Malayalam if preferred.",
//   },
//   {
//     question: "Can I switch mentors if needed?",
//     answer:
//       "Absolutely! While we encourage building long-term relationships, you can work with multiple mentors or switch based on your evolving needs. There are no restrictions on changing mentors.",
//   },
//   {
//     question: "What payment methods do you accept?",
//     answer:
//       "We accept all major payment methods including UPI, Net Banking, Credit/Debit Cards, and popular digital wallets like Paytm, PhonePe, and Google Pay. All prices are in Indian Rupees.",
//   },
//   {
//     question: "Are sessions available in regional languages?",
//     answer:
//       "Yes! Many of our mentors are comfortable conducting sessions in Malayalam, Tamil, Hindi, and other regional languages alongside English, especially for our Kerala-based mentors.",
//   },
//   {
//     question: "How do I track my progress?",
//     answer:
//       "Your dashboard includes comprehensive progress tracking, goal setting, session history, and skill assessments. You'll receive regular reports showing your growth and areas for improvement.",
//   },
// ];

// // Moving Testimonials Component
// const MovingTestimonials = ({
//   testimonials,
//   direction = "left",
//   speed = "normal",
// }) => {
//   const animationClass =
//     direction === "left" ? "animate-scroll-left" : "animate-scroll-right";
//   const speedClass =
//     speed === "fast"
//       ? "duration-20s"
//       : speed === "slow"
//       ? "duration-40s"
//       : "duration-30s";

//   return (
//     <div className="relative overflow-hidden">
//       <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-950 dark:to-transparent z-10"></div>
//       <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-950 dark:to-transparent z-10"></div>

//       <div className={`flex gap-6 ${animationClass} ${speedClass}`}>
//         {[...testimonials, ...testimonials].map((testimonial, index) => (
//           <div
//             key={index}
//             className="flex-shrink-0 w-80 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800"
//           >
//             <div className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <Avatar className="h-12 w-12">
//                   <AvatarImage
//                     src={testimonial.avatar}
//                     alt={testimonial.name}
//                   />
//                   <AvatarFallback>
//                     {testimonial.name
//                       .split(" ")
//                       .map((n) => n[0])
//                       .join("")}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <h4 className="font-semibold text-gray-900 dark:text-white">
//                     {testimonial.name}
//                   </h4>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     {testimonial.role} at {testimonial.company}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex">
//                 {[...Array(testimonial.rating)].map((_, i) => (
//                   <Star
//                     key={i}
//                     className="h-4 w-4 fill-yellow-400 text-yellow-400"
//                   />
//                 ))}
//               </div>

//               <p className="text-gray-700 dark:text-gray-300 italic text-sm leading-relaxed">
//                 "{testimonial.content}"
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <style jsx>{`
//         @keyframes scroll-left {
//           from {
//             transform: translateX(0);
//           }
//           to {
//             transform: translateX(-50%);
//           }
//         }
//         @keyframes scroll-right {
//           from {
//             transform: translateX(-50%);
//           }
//           to {
//             transform: translateX(0);
//           }
//         }
//         .animate-scroll-left {
//           animation: scroll-left linear infinite;
//         }
//         .animate-scroll-right {
//           animation: scroll-right linear infinite;
//         }
//         .duration-20s {
//           animation-duration: 20s;
//         }
//         .duration-30s {
//           animation-duration: 30s;
//         }
//         .duration-40s {
//           animation-duration: 40s;
//         }
//       `}</style>
//     </div>
//   );
// };

// // Components
// const MentorCard = ({ mentor }) => {
//   return (
//     <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden hover:scale-105 shadow-lg">
//       <div className="relative h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
//         <div className="absolute inset-0 bg-black/20"></div>
//         <div className="absolute -bottom-8 left-6">
//           <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
//             <AvatarImage src={mentor.avatar} alt={mentor.name} />
//             <AvatarFallback>
//               {mentor.name
//                 .split(" ")
//                 .map((n) => n[0])
//                 .join("")}
//             </AvatarFallback>
//           </Avatar>
//         </div>
//         {mentor.verified && (
//           <Badge className="absolute top-4 right-4 bg-green-500 hover:bg-green-600">
//             <Shield className="w-3 h-3 mr-1" />
//             Verified
//           </Badge>
//         )}
//       </div>

//       <CardContent className="pt-12 pb-6">
//         <div className="space-y-4">
//           <div>
//             <h3 className="font-bold text-lg text-gray-900 dark:text-white">
//               {mentor.name}
//             </h3>
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               {mentor.title}
//             </p>
//             <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
//               {mentor.company}
//             </p>
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-1">
//               <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//               <span className="text-sm font-medium">{mentor.rating}</span>
//               <span className="text-xs text-gray-500">({mentor.sessions})</span>
//             </div>
//             <Badge variant="outline" className="text-xs">
//               {mentor.badge}
//             </Badge>
//           </div>

//           <div className="flex flex-wrap gap-1 max-h-8">
//             {mentor.expertise.slice(0, 2).map((skill, index) => (
//               <Badge key={index} variant="secondary" className="text-xs">
//                 {skill}
//               </Badge>
//             ))}
//             {mentor.expertise.length > 2 && (
//               <Badge variant="secondary" className="text-xs">
//                 +{mentor.expertise.length - 2}
//               </Badge>
//             )}
//           </div>

//           <Button
//             size="sm"
//             className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
//           >
//             Book Session
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// const ServiceCard = ({ service }) => {
//   const Icon = service.icon;

//   return (
//     <Card
//       className={`group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br ${service.bgColor} hover:scale-105 relative overflow-hidden shadow-lg`}
//     >
//       {service.popular && (
//         <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
//           POPULAR
//         </div>
//       )}

//       <div className="relative h-48 overflow-hidden">
//         <img
//           src={service.image}
//           alt={service.title}
//           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
//         <div className="absolute bottom-4 left-4 right-4 z-10">
//           <div className="flex items-center gap-3 mb-2">
//             <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
//               <Icon className="h-5 w-5 text-white" />
//             </div>
//           </div>
//           <h3 className="font-bold text-white text-lg leading-tight">
//             {service.title}
//           </h3>
//         </div>
//       </div>

//       <CardContent className="p-6">
//         <div className="space-y-4">
//           <p className="text-sm text-gray-700 dark:text-gray-400">
//             {service.description}
//           </p>

//           <ul className="space-y-2">
//             {service.features.map((feature, index) => (
//               <li key={index} className="flex items-center gap-2 text-sm">
//                 <CheckCircle className="h-4 w-4 text-green-600" />
//                 <span className="text-gray-700 dark:text-gray-300">
//                   {feature}
//                 </span>
//               </li>
//             ))}
//           </ul>

//           <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
//             <div className="flex items-center justify-between">
//               <span className="font-bold text-lg text-gray-900 dark:text-white">
//                 {service.price}
//               </span>
//               <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
//                 Learn More
//               </Button>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// const CourseCard = ({ course }) => {
//   return (
//     <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white via-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden hover:scale-105 shadow-lg">
//       <div className="relative h-40 overflow-hidden">
//         <img
//           src={course.image}
//           alt={course.title}
//           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
//         <div className="absolute bottom-3 left-3 right-3">
//           <Badge className="mb-2 bg-white/20 backdrop-blur-sm border-white/30 text-xs">
//             {course.level}
//           </Badge>
//           <h3 className="font-bold text-white text-base leading-tight">
//             {course.title}
//           </h3>
//         </div>
//         <Button
//           size="sm"
//           className="absolute top-3 right-3 rounded-full w-8 h-8 p-0 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30"
//         >
//           <Play className="w-3 h-3" />
//         </Button>
//       </div>

//       <CardContent className="p-4">
//         <div className="space-y-3">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <Avatar className="h-6 w-6">
//                 <AvatarImage
//                   src={
//                     mockMentors.find((m) => m.name === course.instructor)
//                       ?.avatar
//                   }
//                 />
//                 <AvatarFallback className="text-xs">
//                   {course.instructor
//                     .split(" ")
//                     .map((n) => n[0])
//                     .join("")}
//                 </AvatarFallback>
//               </Avatar>
//               <span className="text-xs text-gray-600 dark:text-gray-400">
//                 {course.instructor}
//               </span>
//             </div>
//             <span className="text-xs text-gray-500">{course.duration}</span>
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-1">
//               <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
//               <span className="text-xs font-medium">{course.rating}</span>
//               <span className="text-xs text-gray-500">({course.students})</span>
//             </div>
//             <span className="font-bold text-base">{course.price}</span>
//           </div>

//           <div className="flex flex-wrap gap-1">
//             {course.skills.map((skill, index) => (
//               <Badge
//                 key={index}
//                 variant="secondary"
//                 className="text-xs px-2 py-0"
//               >
//                 {skill}
//               </Badge>
//             ))}
//           </div>

//           <Button
//             size="sm"
//             className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
//           >
//             Enroll Now
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// // Hero Section Component with SparklesCore
// const DynamicHeroSection = () => {
//   return (
//     <div className="h-[40rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-none md:rounded-none mx-0 ">
//       <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
//         MentorONE
//       </h1>

//       <div className="w-[40rem] h-40 relative">
//         {/* Gradient Lines */}
//         <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
//         <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
//         <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
//         <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

//         {/* SparklesCore Component */}
//         <div className="absolute inset-0">
//           <div className="w-full h-full relative">
//             {/* Sparkles simulation with CSS */}
//             {[...Array(100)].map((_, i) => (
//               <div
//                 key={i}
//                 className="absolute animate-pulse"
//                 style={{
//                   left: `${Math.random() * 100}%`,
//                   top: `${Math.random() * 100}%`,
//                   animationDelay: `${Math.random() * 3}s`,
//                   animationDuration: `${1 + Math.random() * 2}s`,
//                 }}
//               >
//                 <div className="w-0.5 h-0.5 bg-white rounded-full opacity-70"></div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
//       </div>

//       {/* Subtitle */}
//       <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto px-6 text-center relative z-20">
//         Transform your career with personalized mentorship from industry leaders
//         across India
//       </p>

//       {/* CTA Buttons */}
//       <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 relative z-20">
//         <Button
//           size="lg"
//           className="bg-white text-black hover:bg-gray-100 font-semibold px-8 shadow-lg"
//         >
//           <Rocket className="w-5 h-5 mr-2" />
//           Start Learning
//         </Button>
//         <Button
//           size="lg"
//           variant="outline"
//           className="border-white text-white hover:bg-white/10 font-semibold px-8"
//         >
//           <Play className="w-5 h-5 mr-2" />
//           Watch Demo
//         </Button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto relative z-20">
//         {[
//           { number: "10K+", label: "Active Mentees" },
//           { number: "500+", label: "Expert Mentors" },
//           { number: "50K+", label: "Sessions Completed" },
//           { number: "4.9", label: "Average Rating" },
//         ].map((stat, index) => (
//           <div key={index} className="text-center">
//             <div className="text-2xl md:text-3xl font-bold text-white">
//               {stat.number}
//             </div>
//             <div className="text-gray-400 text-sm">{stat.label}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Main Dashboard Component
// const MenteeDashboard = () => {
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 800); // Reduced loading time

//     return () => clearTimeout(timer);
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:bg-gray-950 p-6">
//         <div className="max-w-7xl mx-auto space-y-8">
//           <Skeleton className="h-64 w-full rounded-3xl" />
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[...Array(6)].map((_, i) => (
//               <Skeleton key={i} className="h-64 rounded-xl" />
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 dark:bg-gray-950">
//       {/* Dynamic Hero Section */}
//       <DynamicHeroSection />

//       <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
//         {/* Services Section */}
//         <section>
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
//               Our Mentorship Services
//             </h2>
//             <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
//               Choose from our comprehensive range of mentorship services
//               designed to accelerate your career growth in India's tech industry
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {mockServices.map((service) => (
//               <ServiceCard key={service.id} service={service} />
//             ))}
//           </div>

//           {/* Centered View All Button */}
//           <div className="flex justify-center mt-12">
//             <Button
//               size="lg"
//               className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
//             >
//               <Globe className="w-5 h-5 mr-2" />
//               View All Services
//               <ChevronRight className="w-5 h-5 ml-2" />
//             </Button>
//           </div>
//         </section>

//         {/* Top Mentors */}
//         <section>
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
//               Top Mentors
//             </h2>
//             <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
//               Connect with industry leaders and accelerate your growth
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {mockMentors.map((mentor) => (
//               <MentorCard key={mentor.id} mentor={mentor} />
//             ))}
//           </div>

//           {/* Centered View All Button */}
//           <div className="flex justify-center mt-12">
//             <Button
//               size="lg"
//               className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
//             >
//               <User className="w-5 h-5 mr-2" />
//               View All Mentors
//               <ChevronRight className="w-5 h-5 ml-2" />
//             </Button>
//           </div>
//         </section>

//         {/* Featured Learning Paths */}
//         <section>
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
//               Featured Learning Paths
//             </h2>
//             <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
//               Master in-demand skills with our expert-designed courses
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {mockCourses.map((course) => (
//               <CourseCard key={course.id} course={course} />
//             ))}
//           </div>

//           {/* Centered Explore All Button */}
//           <div className="flex justify-center mt-12">
//             <Button
//               size="lg"
//               className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
//             >
//               <BookOpen className="w-5 h-5 mr-2" />
//               Explore All Courses
//               <ChevronRight className="w-5 h-5 ml-2" />
//             </Button>
//           </div>
//         </section>

//         {/* Success Stories - Moving Testimonials */}
//         <section>
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
//               Success Stories
//             </h2>
//             <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
//               Hear from our mentees who have transformed their careers with
//               MentorOne
//             </p>
//           </div>

//           <div className="space-y-8">
//             {/* First row - moving left */}
//             <MovingTestimonials
//               testimonials={testimonials.slice(0, 6)}
//               direction="left"
//               speed="normal"
//             />

//             {/* Second row - moving right */}
//             <MovingTestimonials
//               testimonials={testimonials.slice(6, 12)}
//               direction="right"
//               speed="normal"
//             />
//           </div>
//         </section>

//         {/* FAQ Section */}
//         <section>
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
//               Frequently Asked Questions
//             </h2>
//             <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
//               Everything you need to know about our mentorship platform
//             </p>
//           </div>
//           <div className="max-w-4xl mx-auto">
//             <Accordion type="single" collapsible className="w-full space-y-4">
//               {faqData.map((faq, index) => (
//                 <AccordionItem
//                   key={index}
//                   value={`item-${index}`}
//                   className="border border-gray-200 dark:border-gray-800 rounded-lg px-6 bg-white dark:bg-gray-900 hover:shadow-md transition-all duration-300"
//                 >
//                   <AccordionTrigger className="text-left hover:no-underline py-6">
//                     <span className="font-semibold text-gray-900 dark:text-white text-lg">
//                       {faq.question}
//                     </span>
//                   </AccordionTrigger>
//                   <AccordionContent className="pb-6 text-gray-600 dark:text-gray-400 text-base leading-relaxed">
//                     {faq.answer}
//                   </AccordionContent>
//                 </AccordionItem>
//               ))}
//             </Accordion>
//           </div>
//         </section>

//         {/* Call to Action */}
//         <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-800 via-purple-800 to-indigo-800 text-white shadow-2xl">
//           <div className="absolute inset-0 bg-grid-white/[0.1] bg-grid-16"></div>
//           <div className="relative px-8 py-16 text-center">
//             <div className="space-y-6">
//               <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
//                 <Sparkles className="w-4 h-4" />
//                 Start Your Journey Today
//               </div>
//               <h2 className="text-3xl md:text-5xl font-bold">
//                 Ready to Accelerate Your Career?
//               </h2>
//               <p className="text-xl text-blue-100 max-w-2xl mx-auto">
//                 Join thousands of professionals who have transformed their
//                 careers with personalized mentorship
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
//                 <Button
//                   size="lg"
//                   className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 shadow-lg"
//                 >
//                   <BrainCircuit className="w-5 h-5 mr-2" />
//                   Find Your Mentor
//                 </Button>
//                 <Button
//                   size="lg"
//                   variant="outline"
//                   className="border-white text-white hover:bg-white/10 font-semibold px-8"
//                 >
//                   <MessageSquare className="w-5 h-5 mr-2" />
//                   Contact Support
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Why Choose MentorOne - Enhanced with colors */}
//         <section>
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
//               Why Choose MentorOne?
//             </h2>
//             <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
//               We provide everything you need for successful mentorship and
//               career growth
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {[
//               {
//                 icon: Shield,
//                 title: "Verified Experts",
//                 description:
//                   "All mentors are thoroughly vetted professionals from India's top tech companies and startups.",
//                 gradient: "from-blue-500 to-cyan-500",
//                 bgGradient:
//                   "from-blue-50 via-cyan-50 to-blue-100 dark:from-blue-950 dark:to-cyan-900",
//               },
//               {
//                 icon: Zap,
//                 title: "Instant Matching",
//                 description:
//                   "Our AI-powered system connects you with the perfect mentor in minutes.",
//                 gradient: "from-green-500 to-emerald-500",
//                 bgGradient:
//                   "from-green-50 via-emerald-50 to-green-100 dark:from-green-950 dark:to-emerald-900",
//               },
//               {
//                 icon: Globe,
//                 title: "Pan-India Network",
//                 description:
//                   "Access mentors from Bangalore, Hyderabad, Pune, Mumbai, and Kerala's emerging tech hubs.",
//                 gradient: "from-purple-500 to-violet-500",
//                 bgGradient:
//                   "from-purple-50 via-violet-50 to-purple-100 dark:from-purple-950 dark:to-violet-900",
//               },
//               {
//                 icon: Award,
//                 title: "Proven Results",
//                 description:
//                   "95% of our mentees achieve their career goals within 6 months, with average salary increases of 40%.",
//                 gradient: "from-orange-500 to-red-500",
//                 bgGradient:
//                   "from-orange-50 via-red-50 to-orange-100 dark:from-orange-950 dark:to-red-900",
//               },
//             ].map((feature, index) => (
//               <Card
//                 key={index}
//                 className={`group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br ${feature.bgGradient} text-center hover:scale-105 shadow-lg`}
//               >
//                 <CardContent className="p-6">
//                   <div className="space-y-4">
//                     <div className="relative">
//                       <div
//                         className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} group-hover:scale-110 transition-transform duration-300 shadow-lg`}
//                       >
//                         <feature.icon className="h-8 w-8 text-white" />
//                       </div>
//                     </div>
//                     <h3 className="font-bold text-xl text-gray-900 dark:text-white">
//                       {feature.title}
//                     </h3>
//                     <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
//                       {feature.description}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default MenteeDashboard;
import { useState, useEffect, lazy, Suspense, memo, useCallback } from "react";
import {
  Star,
  ChevronRight,
  BookOpen,
  MessageSquare,
  Target,
  Award,
  Zap,
  FileText,
  User,
  Globe,
  Shield,
  Play,
  CheckCircle,
  Sparkles,
  Code,
  BrainCircuit,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SreeImg from "@/assets/Sree.jpeg";
import JasnaImg from "@/assets/Jasna.jpeg";
import JithinImg from "@/assets/Jithin.jpeg";
import AnotaImg from "@/assets/Anita.jpeg";

// Intersection Observer Hook for lazy loading
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [targetElement, setTargetElement] = useState(null);

  useEffect(() => {
    if (!targetElement) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(targetElement);

    return () => observer.disconnect();
  }, [targetElement, options]);

  return [setTargetElement, isIntersecting];
};

// Lazy Image Component with progressive loading
const LazyImage = memo(
  ({
    src,
    alt,
    className,
    fallback = "https://via.placeholder.com/400x300?text=Loading...",
  }) => {
    const [imageSrc, setImageSrc] = useState(fallback);
    const [isLoaded, setIsLoaded] = useState(false);
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

    useEffect(() => {
      if (isVisible && src) {
        const img = new Image();
        img.onload = () => {
          setImageSrc(src);
          setIsLoaded(true);
        };
        img.src = src;
      }
    }, [isVisible, src]);

    return (
      <div ref={ref} className={className}>
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-70"
          }`}
          loading="lazy"
        />
      </div>
    );
  }
);

// Enhanced mock mentors data with Indian names
const mockMentors = [
  {
    id: "1",
    name: "Jithin Nair",
    title: "Senior AI Research Scientist",
    company: "Google India",
    rating: 4.9,
    sessions: 156,
    expertise: ["Machine Learning", "Deep Learning", "AI Ethics"],
    avatar: JithinImg,
    price: "₹8,500/hr",
    badge: "AI Expert",
    verified: true,
    responseTime: "< 2hrs",
  },
  {
    id: "2",
    name: "Priya Menon",
    title: "Principal Software Engineer",
    company: "Microsoft India",
    rating: 4.8,
    sessions: 203,
    expertise: ["System Design", "Leadership", "React"],
    avatar: JasnaImg,
    price: "₹7,200/hr",
    badge: "Tech Lead",
    verified: true,
    responseTime: "< 1hr",
  },
  {
    id: "3",
    name: "Anjali Krishnan",
    title: "Product Design Director",
    company: "Figma India",
    rating: 4.9,
    sessions: 178,
    expertise: ["UX Design", "Product Strategy", "Design Systems"],
    avatar: AnotaImg,
    price: "₹7,800/hr",
    badge: "Design Lead",
    verified: true,
    responseTime: "< 3hrs",
  },
  {
    id: "4",
    name: "Sreekuttan N",
    title: "Startup Founder & CEO",
    company: "TechFlow Kochi",
    rating: 4.7,
    sessions: 134,
    expertise: ["Entrepreneurship", "Business Strategy", "Fundraising"],
    avatar: SreeImg,
    price: "₹12,000/hr",
    badge: "Founder",
    verified: true,
    responseTime: "< 4hrs",
  },
];

// Enhanced mock services data with Indian context and colorful themes
const mockServices = [
  {
    id: "1",
    title: "1-on-1 Mentoring",
    description: "Personalized guidance from industry experts across India",
    icon: User,
    features: ["Custom learning path", "Weekly sessions", "Goal tracking"],
    price: "From ₹4,800/hr",
    popular: true,
    bgColor:
      "from-blue-50 via-blue-100 to-indigo-200 dark:from-blue-950 dark:to-indigo-900",
    iconColor: "text-blue-600 dark:text-blue-400",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
  },
  {
    id: "2",
    title: "Mock Interviews",
    description: "Practice with professionals from top Indian tech companies",
    icon: MessageSquare,
    features: [
      "Technical & behavioral",
      "Detailed feedback",
      "Recording included",
    ],
    price: "From ₹3,000/session",
    bgColor:
      "from-green-50 via-emerald-100 to-teal-200 dark:from-green-950 dark:to-emerald-900",
    iconColor: "text-green-600 dark:text-green-400",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop",
  },
  {
    id: "3",
    title: "Resume Review",
    description: "Optimize your resume for Indian and global markets",
    icon: FileText,
    features: ["ATS optimization", "Industry-specific tips", "24hr turnaround"],
    price: "From ₹1,800/review",
    bgColor:
      "from-purple-50 via-violet-100 to-fuchsia-200 dark:from-purple-950 dark:to-violet-900",
    iconColor: "text-purple-600 dark:text-purple-400",
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop",
  },
  {
    id: "4",
    title: "Career Guidance",
    description: "Strategic career planning for the Indian tech ecosystem",
    icon: Target,
    features: ["Career assessment", "Industry insights", "Action plan"],
    price: "From ₹6,000/session",
    bgColor:
      "from-orange-50 via-amber-100 to-yellow-200 dark:from-orange-950 dark:to-amber-900",
    iconColor: "text-orange-600 dark:text-orange-400",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
  },
  {
    id: "5",
    title: "Skill Development",
    description: "Structured learning programs for emerging technologies",
    icon: BookOpen,
    features: ["Curated courses", "Hands-on projects", "Certificate"],
    price: "From ₹12,000/course",
    bgColor:
      "from-pink-50 via-rose-100 to-red-200 dark:from-pink-950 dark:to-rose-900",
    iconColor: "text-pink-600 dark:text-pink-400",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
  },
  {
    id: "6",
    title: "Project Reviews",
    description: "Get feedback on your projects from senior developers",
    icon: Code,
    features: ["Code review", "Architecture feedback", "Best practices"],
    price: "From ₹3,600/review",
    bgColor:
      "from-teal-50 via-cyan-100 to-sky-200 dark:from-teal-950 dark:to-cyan-900",
    iconColor: "text-teal-600 dark:text-teal-400",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
  },
];

// Enhanced mock courses/learning paths (6 courses in 2 rows)
const mockCourses = [
  {
    id: "1",
    title: "Full-Stack Development Mastery",
    instructor: "Arjun Nair",
    level: "Intermediate",
    duration: "8 weeks",
    rating: 4.8,
    students: 1240,
    price: "₹17,999",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=300&fit=crop",
    skills: ["React", "Node.js", "MongoDB", "AWS"],
  },
  {
    id: "2",
    title: "AI & Machine Learning Fundamentals",
    instructor: "Priya Menon",
    level: "Beginner",
    duration: "6 weeks",
    rating: 4.9,
    students: 890,
    price: "₹23,999",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop",
    skills: ["Python", "TensorFlow", "Data Science", "Neural Networks"],
  },
  {
    id: "3",
    title: "Product Design Excellence",
    instructor: "Anjali Krishnan",
    level: "Advanced",
    duration: "10 weeks",
    rating: 4.7,
    students: 567,
    price: "₹26,999",
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=300&fit=crop",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
  },
  {
    id: "4",
    title: "Mobile App Development",
    instructor: "Vineeth Kumar",
    level: "Intermediate",
    duration: "12 weeks",
    rating: 4.8,
    students: 723,
    price: "₹21,999",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=300&fit=crop",
    skills: ["React Native", "Flutter", "iOS", "Android"],
  },
  {
    id: "5",
    title: "DevOps & Cloud Computing",
    instructor: "Rajesh Pillai",
    level: "Advanced",
    duration: "8 weeks",
    rating: 4.6,
    students: 445,
    price: "₹19,999",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=300&fit=crop",
    skills: ["Docker", "Kubernetes", "AWS", "Jenkins"],
  },
  {
    id: "6",
    title: "Data Science & Analytics",
    instructor: "Kavya Nambiar",
    level: "Beginner",
    duration: "10 weeks",
    rating: 4.9,
    students: 892,
    price: "₹22,999",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop",
    skills: ["Python", "R", "SQL", "Tableau"],
  },
];

// Expanded South Indian (Kerala) testimonials - 12 testimonials for moving animation
const testimonials = [
  {
    name: "Akhil Raghavan",
    role: "Software Engineer",
    company: "Infosys Kochi",
    content:
      "MentorOne helped me transition from a fresher to a senior developer. The mentors from Kerala tech ecosystem provided invaluable insights.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Sneha Krishnamurthy",
    role: "Product Manager",
    company: "Technopark TVM",
    content:
      "The career guidance I received was transformative. I landed my dream PM role at a Thiruvananthapuram startup within 2 months.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Vishnu Mohan",
    role: "UX Designer",
    company: "UST Global",
    content:
      "Outstanding mentorship platform! The design guidance from Kerala-based mentors helped me excel in my UX career at UST Global.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Athira Suresh",
    role: "Data Scientist",
    company: "Quest Global",
    content:
      "The AI mentorship program was exceptional. Learning from industry experts in Kochi helped me build a strong foundation in machine learning.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Anand Pillai",
    role: "Full-Stack Developer",
    company: "IBS Software",
    content:
      "From being confused about my career path to becoming a confident developer - MentorOne's structured approach made all the difference.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Deepika Nair",
    role: "DevOps Engineer",
    company: "Tata Elxsi",
    content:
      "The cloud computing mentorship was exactly what I needed. Now I'm leading DevOps initiatives at Tata Elxsi thanks to my mentor's guidance.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Rajesh Kumar",
    role: "Backend Developer",
    company: "Freshworks",
    content:
      "The mentorship sessions helped me master system design concepts. I successfully cracked interviews at multiple product companies.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Kavitha Menon",
    role: "Frontend Developer",
    company: "Byju's",
    content:
      "Learning React from industry experts transformed my frontend skills. The personalized guidance was exactly what I needed.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Arun Gopinath",
    role: "Mobile Developer",
    company: "Zoho",
    content:
      "The mobile development mentorship helped me transition from web to mobile. Now I'm building apps used by millions at Zoho.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Lakshmi Nair",
    role: "QA Engineer",
    company: "HCL Technologies",
    content:
      "The testing mentorship program elevated my automation skills. I'm now leading a team of 10 QA engineers at HCL.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Suresh Babu",
    role: "DevOps Lead",
    company: "TCS",
    content:
      "The cloud architecture guidance was phenomenal. I successfully migrated our entire infrastructure to AWS with zero downtime.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Meera Krishnan",
    role: "Business Analyst",
    company: "Wipro",
    content:
      "The business analysis mentorship helped me understand requirements better. I'm now handling enterprise-level projects confidently.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
  },
];

// FAQ data
const faqData = [
  {
    question: "How does the mentorship matching process work?",
    answer:
      "Our AI-powered matching system considers your goals, experience level, preferred learning style, and industry focus to connect you with the most suitable mentors from India's top tech companies. You can also browse mentor profiles and book sessions directly.",
  },
  {
    question: "What's included in a mentorship session?",
    answer:
      "Each session includes personalized guidance, actionable feedback, resource recommendations, and a follow-up summary. Sessions are recorded (with permission) for your reference, and you'll receive notes and action items in both English and Malayalam if preferred.",
  },
  {
    question: "Can I switch mentors if needed?",
    answer:
      "Absolutely! While we encourage building long-term relationships, you can work with multiple mentors or switch based on your evolving needs. There are no restrictions on changing mentors.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major payment methods including UPI, Net Banking, Credit/Debit Cards, and popular digital wallets like Paytm, PhonePe, and Google Pay. All prices are in Indian Rupees.",
  },
  {
    question: "Are sessions available in regional languages?",
    answer:
      "Yes! Many of our mentors are comfortable conducting sessions in Malayalam, Tamil, Hindi, and other regional languages alongside English, especially for our Kerala-based mentors.",
  },
  {
    question: "How do I track my progress?",
    answer:
      "Your dashboard includes comprehensive progress tracking, goal setting, session history, and skill assessments. You'll receive regular reports showing your growth and areas for improvement.",
  },
];

// Optimized Moving Testimonials Component with intersection observer
const MovingTestimonials = memo(
  ({ testimonials, direction = "left", speed = "normal" }) => {
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
      if (isVisible) {
        const timer = setTimeout(() => setShouldAnimate(true), 100);
        return () => clearTimeout(timer);
      }
    }, [isVisible]);

    const animationClass =
      direction === "left" ? "animate-scroll-left" : "animate-scroll-right";
    const speedClass =
      speed === "fast"
        ? "duration-20s"
        : speed === "slow"
        ? "duration-40s"
        : "duration-30s";

    return (
      <div ref={ref} className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-950 dark:to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-950 dark:to-transparent z-10"></div>

        <div
          className={`flex gap-6 ${
            shouldAnimate ? animationClass : ""
          } ${speedClass}`}
        >
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-80 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      loading="lazy"
                    />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>

                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-gray-700 dark:text-gray-300 italic text-sm leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>
            </div>
          ))}
        </div>

        <style jsx>{`
          @keyframes scroll-left {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }
          @keyframes scroll-right {
            from {
              transform: translateX(-50%);
            }
            to {
              transform: translateX(0);
            }
          }
          .animate-scroll-left {
            animation: scroll-left linear infinite;
          }
          .animate-scroll-right {
            animation: scroll-right linear infinite;
          }
          .duration-20s {
            animation-duration: 20s;
          }
          .duration-30s {
            animation-duration: 30s;
          }
          .duration-40s {
            animation-duration: 40s;
          }
        `}</style>
      </div>
    );
  }
);

// Lazy loaded components
const LazySection = memo(
  ({
    children,
    fallback = <Skeleton className="h-64 w-full rounded-xl" />,
  }) => {
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
      if (isVisible) {
        const timer = setTimeout(() => setShouldLoad(true), 100);
        return () => clearTimeout(timer);
      }
    }, [isVisible]);

    return <div ref={ref}>{shouldLoad ? children : fallback}</div>;
  }
);

// Optimized Components
const MentorCard = memo(({ mentor }) => {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden hover:scale-105 shadow-lg">
      <div className="relative h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute -bottom-8 left-6">
          <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
            <AvatarImage src={mentor.avatar} alt={mentor.name} loading="lazy" />
            <AvatarFallback>
              {mentor.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
        {mentor.verified && (
          <Badge className="absolute top-4 right-4 bg-green-500 hover:bg-green-600">
            <Shield className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        )}
      </div>

      <CardContent className="pt-12 pb-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              {mentor.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {mentor.title}
            </p>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {mentor.company}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{mentor.rating}</span>
              <span className="text-xs text-gray-500">({mentor.sessions})</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {mentor.badge}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-1 max-h-8">
            {mentor.expertise.slice(0, 2).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {mentor.expertise.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{mentor.expertise.length - 2}
              </Badge>
            )}
          </div>

          <Button
            size="sm"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
          >
            Book Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

const ServiceCard = memo(({ service }) => {
  const Icon = service.icon;

  return (
    <Card
      className={`group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br ${service.bgColor} hover:scale-105 relative overflow-hidden shadow-lg`}
    >
      {service.popular && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
          POPULAR
        </div>
      )}

      <div className="relative h-48 overflow-hidden">
        <LazyImage
          src={service.image}
          alt={service.title}
          className="w-full h-full group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
              <Icon className="h-5 w-5 text-white" />
            </div>
          </div>
          <h3 className="font-bold text-white text-lg leading-tight">
            {service.title}
          </h3>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          <p className="text-sm text-gray-700 dark:text-gray-400">
            {service.description}
          </p>

          <ul className="space-y-2">
            {service.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-gray-700 dark:text-gray-300">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                {service.price}
              </span>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

const CourseCard = memo(({ course }) => {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white via-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden hover:scale-105 shadow-lg">
      <div className="relative h-40 overflow-hidden">
        <LazyImage
          src={course.image}
          alt={course.title}
          className="w-full h-full group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-3 left-3 right-3">
          <Badge className="mb-2 bg-white/20 backdrop-blur-sm border-white/30 text-xs">
            {course.level}
          </Badge>
          <h3 className="font-bold text-white text-base leading-tight">
            {course.title}
          </h3>
        </div>
        <Button
          size="sm"
          className="absolute top-3 right-3 rounded-full w-8 h-8 p-0 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30"
        >
          <Play className="w-3 h-3" />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={
                    mockMentors.find((m) => m.name === course.instructor)
                      ?.avatar
                  }
                  loading="lazy"
                />
                <AvatarFallback className="text-xs">
                  {course.instructor
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {course.instructor}
              </span>
            </div>
            <span className="text-xs text-gray-500">{course.duration}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{course.rating}</span>
              <span className="text-xs text-gray-500">({course.students})</span>
            </div>
            <span className="font-bold text-base">{course.price}</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {course.skills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-2 py-0"
              >
                {skill}
              </Badge>
            ))}
          </div>

          <Button
            size="sm"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
          >
            Enroll Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

// Hero Section Component with optimized sparkles
const DynamicHeroSection = memo(() => {
  const [sparklesLoaded, setSparklesLoaded] = useState(false);

  useEffect(() => {
    // Load sparkles after hero text is rendered
    const timer = setTimeout(() => setSparklesLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-[40rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-none md:rounded-none mx-0">
      <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
        MentorONE
      </h1>

      <div className="w-[40rem] h-40 relative">
        {/* Gradient Lines */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

        {/* Optimized SparklesCore Component */}
        {sparklesLoaded && (
          <div className="absolute inset-0">
            <div className="w-full h-full relative">
              {/* Reduced sparkles for better performance */}
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${1 + Math.random() * 2}s`,
                  }}
                >
                  <div className="w-0.5 h-0.5 bg-white rounded-full opacity-70"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>

      {/* Subtitle */}
      <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto px-6 text-center relative z-20">
        Transform your career with personalized mentorship from industry leaders
        across India
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 relative z-20">
        <Button
          size="lg"
          className="bg-white text-black hover:bg-gray-100 font-semibold px-8 shadow-lg"
        >
          <Rocket className="w-5 h-5 mr-2" />
          Start Learning
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-white text-white hover:bg-white/10 font-semibold px-8"
        >
          <Play className="w-5 h-5 mr-2" />
          Watch Demo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto relative z-20">
        {[
          { number: "10K+", label: "Active Mentees" },
          { number: "500+", label: "Expert Mentors" },
          { number: "50K+", label: "Sessions Completed" },
          { number: "4.9", label: "Average Rating" },
        ].map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">
              {stat.number}
            </div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

// Main Dashboard Component with Progressive Loading
const MenteeDashboard = () => {
  const [sectionsLoaded, setSectionsLoaded] = useState({
    hero: true,
    services: false,
    mentors: false,
    courses: false,
    testimonials: false,
    faq: false,
    cta: false,
    features: false,
  });

  // Progressive loading controller
  useEffect(() => {
    const loadSections = async () => {
      // Load hero first (already loaded)
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Then load services
      setSectionsLoaded((prev) => ({ ...prev, services: true }));
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Load mentors
      setSectionsLoaded((prev) => ({ ...prev, mentors: true }));
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Load courses
      setSectionsLoaded((prev) => ({ ...prev, courses: true }));
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Load testimonials
      setSectionsLoaded((prev) => ({ ...prev, testimonials: true }));
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Load FAQ
      setSectionsLoaded((prev) => ({ ...prev, faq: true }));
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Load CTA
      setSectionsLoaded((prev) => ({ ...prev, cta: true }));
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Load features last
      setSectionsLoaded((prev) => ({ ...prev, features: true }));
    };

    loadSections();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 dark:bg-gray-950">
      {/* Hero Section - Loads First */}
      <DynamicHeroSection />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Services Section - Loads Second */}
        <LazySection
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          }
        >
          {sectionsLoaded.services && (
            <section>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Our Mentorship Services
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Choose from our comprehensive range of mentorship services
                  designed to accelerate your career growth in India's tech
                  industry
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>

              <div className="flex justify-center mt-12">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Globe className="w-5 h-5 mr-2" />
                  View All Services
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </section>
          )}
        </LazySection>

        {/* Top Mentors - Loads Third */}
        <LazySection
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          }
        >
          {sectionsLoaded.mentors && (
            <section>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Top Mentors
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                  Connect with industry leaders and accelerate your growth
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockMentors.map((mentor) => (
                  <MentorCard key={mentor.id} mentor={mentor} />
                ))}
              </div>

              <div className="flex justify-center mt-12">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <User className="w-5 h-5 mr-2" />
                  View All Mentors
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </section>
          )}
        </LazySection>

        {/* Featured Learning Paths - Loads Fourth */}
        <LazySection
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          }
        >
          {sectionsLoaded.courses && (
            <section>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Featured Learning Paths
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                  Master in-demand skills with our expert-designed courses
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>

              <div className="flex justify-center mt-12">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explore All Courses
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </section>
          )}
        </LazySection>

        {/* Success Stories - Loads Fifth */}
        <LazySection fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
          {sectionsLoaded.testimonials && (
            <section>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Success Stories
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Hear from our mentees who have transformed their careers with
                  MentorOne
                </p>
              </div>

              <div className="space-y-8">
                <MovingTestimonials
                  testimonials={testimonials.slice(0, 6)}
                  direction="left"
                  speed="normal"
                />
                <MovingTestimonials
                  testimonials={testimonials.slice(6, 12)}
                  direction="right"
                  speed="normal"
                />
              </div>
            </section>
          )}
        </LazySection>

        {/* FAQ Section - Loads Sixth */}
        <LazySection fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
          {sectionsLoaded.faq && (
            <section>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Everything you need to know about our mentorship platform
                </p>
              </div>
              <div className="max-w-4xl mx-auto">
                <Accordion
                  type="single"
                  collapsible
                  className="w-full space-y-4"
                >
                  {faqData.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border border-gray-200 dark:border-gray-800 rounded-lg px-6 bg-white dark:bg-gray-900 hover:shadow-md transition-all duration-300"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-6">
                        <span className="font-semibold text-gray-900 dark:text-white text-lg">
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6 text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>
          )}
        </LazySection>

        {/* Call to Action - Loads Seventh */}
        <LazySection
          fallback={<Skeleton className="h-64 w-full rounded-3xl" />}
        >
          {sectionsLoaded.cta && (
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-800 via-purple-800 to-indigo-800 text-white shadow-2xl">
              <div className="absolute inset-0 bg-grid-white/[0.1] bg-grid-16"></div>
              <div className="relative px-8 py-16 text-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    Start Your Journey Today
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold">
                    Ready to Accelerate Your Career?
                  </h2>
                  <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                    Join thousands of professionals who have transformed their
                    careers with personalized mentorship
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button
                      size="lg"
                      className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 shadow-lg"
                    >
                      <BrainCircuit className="w-5 h-5 mr-2" />
                      Find Your Mentor
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10 font-semibold px-8"
                    >
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Contact Support
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </LazySection>

        {/* Why Choose MentorOne - Loads Last */}
        <LazySection
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          }
        >
          {sectionsLoaded.features && (
            <section>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Why Choose MentorOne?
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  We provide everything you need for successful mentorship and
                  career growth
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: Shield,
                    title: "Verified Experts",
                    description:
                      "All mentors are thoroughly vetted professionals from India's top tech companies and startups.",
                    gradient: "from-blue-500 to-cyan-500",
                    bgGradient:
                      "from-blue-50 via-cyan-50 to-blue-100 dark:from-blue-950 dark:to-cyan-900",
                  },
                  {
                    icon: Zap,
                    title: "Instant Matching",
                    description:
                      "Our AI-powered system connects you with the perfect mentor in minutes.",
                    gradient: "from-green-500 to-emerald-500",
                    bgGradient:
                      "from-green-50 via-emerald-50 to-green-100 dark:from-green-950 dark:to-emerald-900",
                  },
                  {
                    icon: Globe,
                    title: "Pan-India Network",
                    description:
                      "Access mentors from Bangalore, Hyderabad, Pune, Mumbai, and Kerala's emerging tech hubs.",
                    gradient: "from-purple-500 to-violet-500",
                    bgGradient:
                      "from-purple-50 via-violet-50 to-purple-100 dark:from-purple-950 dark:to-violet-900",
                  },
                  {
                    icon: Award,
                    title: "Proven Results",
                    description:
                      "95% of our mentees achieve their career goals within 6 months, with average salary increases of 40%.",
                    gradient: "from-orange-500 to-red-500",
                    bgGradient:
                      "from-orange-50 via-red-50 to-orange-100 dark:from-orange-950 dark:to-red-900",
                  },
                ].map((feature, index) => (
                  <Card
                    key={index}
                    className={`group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br ${feature.bgGradient} text-center hover:scale-105 shadow-lg`}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="relative">
                          <div
                            className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                          >
                            <feature.icon className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                          {feature.title}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </LazySection>
      </div>
    </div>
  );
};

export default MenteeDashboard;
