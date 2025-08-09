// // // // import React, { useState, useEffect } from "react";
// // // // import {
// // // //   Star,
// // // //   Clock,
// // // //   Users,
// // // //   Sparkles,
// // // //   ArrowUpRight,
// // // //   MessageSquare,
// // // //   Video,
// // // //   BookOpen,
// // // //   Target,
// // // //   Zap,
// // // //   Layers,
// // // //   Award,
// // // //   Crown,
// // // // } from "lucide-react";
// // // // import { Button } from "@/components/ui/button";
// // // // import { Skeleton } from "@/components/ui/skeleton";
// // // // import { Badge } from "@/components/ui/badge";
// // // // import { Card, CardContent } from "@/components/ui/card";
// // // // import { useSelector } from "react-redux";
// // // // import { RootState } from "@/redux/store/store";
// // // // import { setError } from "@/redux/slices/userSlice";
// // // // import { getDashboardData } from "@/services/menteeService";
// // // // import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
// // // // // --- Custom UI Components ---
// // // // import { AnimatedSpotlight } from "@/components/ui/AnimatedSpotlight";
// // // // import { Meteors } from "@/components/ui/Meteors";
// // // // import { InfiniteMovingCards } from "@/components/ui/InfiniteMovingCards";
// // // // import { Vortex } from "@/components/ui/Vortex";
// // // // import { GlassCard } from "@/components/ui/GlassCard";

// // // // // ============================================================================
// // // // // REDESIGNED COMPONENTS
// // // // // ============================================================================

// // // // const MyMentorshipCard = ({ mentorship }: { mentorship: any }) => {
// // // //   return (
// // // //     <Card className="relative p-6 bg-white/50 backdrop-blur-xl border border-white/[0.2] rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
// // // //       <div className="flex items-center gap-4 mb-4">
// // // //         <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500">
// // // //           <img
// // // //             src={mentorship.mentorProfileImage || "/default-avatar.png"}
// // // //             alt={mentorship.mentorName}
// // // //             className="w-full h-full object-cover"
// // // //           />
// // // //           <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
// // // //         </div>
// // // //         <div>
// // // //           <h4 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
// // // //             {mentorship.mentorName}
// // // //           </h4>
// // // //           <p className="text-sm text-gray-600">{mentorship.mentorRole}</p>
// // // //         </div>
// // // //       </div>
// // // //       <div className="mb-4">
// // // //         <h5 className="font-semibold text-gray-800 flex items-center gap-2">
// // // //           <Layers className="w-5 h-5 text-blue-500" />
// // // //           <span>{mentorship.serviceName}</span>
// // // //         </h5>
// // // //         <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
// // // //           <Clock className="w-4 h-4" />
// // // //           <span>Next Session: {mentorship.nextSessionDate}</span>
// // // //         </div>
// // // //       </div>
// // // //       <div className="flex justify-between items-center">
// // // //         <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 font-semibold px-4 py-1">
// // // //           In Progress
// // // //         </Badge>
// // // //         <Button
// // // //           size="sm"
// // // //           className="bg-purple-600 hover:bg-purple-700 rounded-full"
// // // //         >
// // // //           <MessageSquare className="w-4 h-4 mr-2" />
// // // //           Chat Now
// // // //         </Button>
// // // //       </div>
// // // //     </Card>
// // // //   );
// // // // };

// // // // const NewServiceCategoryCard = ({
// // // //   service,
// // // //   index,
// // // // }: {
// // // //   service: any;
// // // //   index: number;
// // // // }) => {
// // // //   const [isHovered, setIsHovered] = useState(false);
// // // //   const getServiceIcon = (title: string) => {
// // // //     switch (title?.toLowerCase()) {
// // // //       case "mock interview":
// // // //         return <Video className="w-8 h-8" />;
// // // //       case "resume review":
// // // //         return <BookOpen className="w-8 h-8" />;
// // // //       case "one - one sessions":
// // // //         return <MessageSquare className="w-8 h-8" />;
// // // //       case "project guidance":
// // // //         return <Target className="w-8 h-8" />;
// // // //       case "internship preparation":
// // // //         return <Award className="w-8 h-8" />;
// // // //       case "referral":
// // // //         return <Users className="w-8 h-8" />;
// // // //       default:
// // // //         return <Sparkles className="w-8 h-8" />;
// // // //     }
// // // //   };

// // // //   const gradients = [
// // // //     "from-purple-500 to-blue-600",
// // // //     "from-blue-500 to-indigo-600",
// // // //     "from-indigo-500 to-purple-600",
// // // //     "from-purple-600 to-pink-600",
// // // //     "from-pink-500 to-red-500",
// // // //     "from-green-500 to-emerald-600",
// // // //   ];

// // // //   const gradient = gradients[index % gradients.length];

// // // //   return (
// // // //     <GlassCard
// // // //       className={`group relative overflow-hidden border-2 border-white/20 transition-all duration-500 rounded-3xl animate-fade-in ${
// // // //         isHovered ? "scale-[1.05]" : ""
// // // //       }`}
// // // //       onMouseEnter={() => setIsHovered(true)}
// // // //       onMouseLeave={() => setIsHovered(false)}
// // // //     >
// // // //       <div
// // // //         className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20`}
// // // //       />
// // // //       <CardContent className="relative p-8 h-full flex flex-col">
// // // //         <div
// // // //           className={`p-4 bg-white/20 backdrop-blur-sm rounded-2xl w-fit mb-6 transition-transform duration-300 ${
// // // //             isHovered ? "scale-110 rotate-3" : ""
// // // //           }`}
// // // //         >
// // // //           <div className="text-white">{getServiceIcon(service.title)}</div>
// // // //         </div>
// // // //         <div className="flex-1">
// // // //           <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
// // // //             {service.title}
// // // //           </h3>
// // // //           <p className="text-white/90 text-sm leading-relaxed line-clamp-3">
// // // //             {service.shortDescription || service.description}
// // // //           </p>
// // // //         </div>
// // // //         <div className="flex items-center justify-between mt-6">
// // // //           <Badge className="bg-yellow-300 text-yellow-800 font-bold">
// // // //             <Zap className="w-4 h-4 mr-1" />
// // // //             Popular
// // // //           </Badge>
// // // //           <Button
// // // //             variant="ghost"
// // // //             size="sm"
// // // //             className="text-white hover:bg-white/20 rounded-xl p-2"
// // // //           >
// // // //             <ArrowUpRight className="w-5 h-5" />
// // // //           </Button>
// // // //         </div>
// // // //       </CardContent>
// // // //     </GlassCard>
// // // //   );
// // // // };

// // // // const NewMentorCard = ({ mentor, index }: { mentor: any; index: number }) => {
// // // //   const [isHovered, setIsHovered] = useState(false);
// // // //   const badgeConfig = {
// // // //     text: "Elite",
// // // //     gradient: "bg-gradient-to-r from-orange-500 to-red-500",
// // // //     icon: <Crown className="w-3 h-3" />,
// // // //   };

// // // //   return (
// // // //     <Card
// // // //       className={`group relative overflow-hidden bg-white/50 backdrop-blur-xl border-2 border-white/[0.2] shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl animate-fade-in ${
// // // //         isHovered ? "scale-[1.02]" : ""
// // // //       }`}
// // // //       onMouseEnter={() => setIsHovered(true)}
// // // //       onMouseLeave={() => setIsHovered(false)}
// // // //     >
// // // //       <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
// // // //       <CardContent className="relative p-0 overflow-hidden">
// // // //         <div className="relative h-32 overflow-hidden">
// // // //           <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 opacity-80" />
// // // //           <div className="absolute top-4 right-4 z-20">
// // // //             <Badge
// // // //               className={`${badgeConfig.gradient} text-white border-0 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg`}
// // // //             >
// // // //               <span className="flex items-center gap-1.5">
// // // //                 {badgeConfig.icon}
// // // //                 {badgeConfig.text}
// // // //               </span>
// // // //             </Badge>
// // // //           </div>
// // // //           <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 z-20">
// // // //             <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-white">
// // // //               <img
// // // //                 src={mentor.profilePicture || "/default-avatar.png"}
// // // //                 alt={mentor.name}
// // // //                 className={`w-full h-full object-cover transition-transform duration-500 ${
// // // //                   isHovered ? "scale-110" : "scale-100"
// // // //                 }`}
// // // //               />
// // // //             </div>
// // // //             <span className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
// // // //           </div>
// // // //         </div>
// // // //         <div className="pt-16 pb-6 px-6 relative text-center">
// // // //           <h3 className="font-bold text-xl text-gray-900 mb-1">
// // // //             {mentor.name}
// // // //           </h3>
// // // //           <p className="text-sm text-purple-600 font-semibold mb-2">
// // // //             {mentor.workRole}
// // // //           </p>
// // // //           <div className="flex items-center justify-center gap-2 text-gray-700 text-xs mb-4">
// // // //             <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
// // // //             <span>
// // // //               {(mentor.averageRating || 4.8).toFixed(1)} (
// // // //               {mentor.bookingCount || 0})
// // // //             </span>
// // // //           </div>
// // // //           <div className="flex justify-center gap-3">
// // // //             <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg">
// // // //               View Profile
// // // //             </Button>
// // // //           </div>
// // // //         </div>
// // // //       </CardContent>
// // // //     </Card>
// // // //   );
// // // // };

// // // // // ============================================================================
// // // // // MAIN DASHBOARD COMPONENT
// // // // // ============================================================================

// // // // const MenteeDashboard: React.FC = () => {
// // // //   const [dashboardData, setDashboardData] = useState<{
// // // //     topServices: any[];
// // // //     topMentors: any[];
// // // //     topTestimonials: any[];
// // // //     myMentorships: any[]; // New data point
// // // //   }>({
// // // //     topServices: [],
// // // //     topMentors: [],
// // // //     topTestimonials: [],
// // // //     myMentorships: [],
// // // //   });
// // // //   const [isLoading, setIsLoading] = useState(true);

// // // //   // Redux State
// // // //   const { user } = useSelector((state: RootState) => state.user);

// // // //   useEffect(() => {
// // // //     const fetchDashboardData = async () => {
// // // //       try {
// // // //         setIsLoading(true);
// // // //         // Simulate API call
// // // //         const data = await new Promise((resolve) =>
// // // //           setTimeout(() => {
// // // //             resolve({
// // // //               topServices: [
// // // //                 {
// // // //                   _id: "1",
// // // //                   title: "Mock Interview",
// // // //                   shortDescription:
// // // //                     "Practice for your dream job with real-world scenarios.",
// // // //                 },
// // // //                 {
// // // //                   _id: "2",
// // // //                   title: "Resume Review",
// // // //                   shortDescription:
// // // //                     "Get your resume polished by industry experts for maximum impact.",
// // // //                 },
// // // //                 {
// // // //                   _id: "3",
// // // //                   title: "One - One Sessions",
// // // //                   shortDescription:
// // // //                     "Personalized 1:1 sessions to tackle your specific career challenges.",
// // // //                 },
// // // //                 {
// // // //                   _id: "4",
// // // //                   title: "Project Guidance",
// // // //                   shortDescription:
// // // //                     "Expert help to steer your projects towards success and innovation.",
// // // //                 },
// // // //               ],
// // // //               topMentors: [
// // // //                 {
// // // //                   _id: "1",
// // // //                   name: "Alex Johnson",
// // // //                   workRole: "Senior Software Engineer",
// // // //                   averageRating: 4.9,
// // // //                   profilePicture:
// // // //                     "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2787&auto=format&fit=crop",
// // // //                 },
// // // //                 {
// // // //                   _id: "2",
// // // //                   name: "Sarah Lee",
// // // //                   workRole: "UX/UI Designer",
// // // //                   averageRating: 4.7,
// // // //                   profilePicture:
// // // //                     "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2940&auto=format&fit=crop",
// // // //                 },
// // // //                 {
// // // //                   _id: "3",
// // // //                   name: "Mark Chen",
// // // //                   workRole: "Data Scientist",
// // // //                   averageRating: 4.95,
// // // //                   profilePicture:
// // // //                     "https://images.unsplash.com/photo-1519085360753-af0f119f24c3?q=80&w=2787&auto=format&fit=crop",
// // // //                 },
// // // //                 {
// // // //                   _id: "4",
// // // //                   name: "Emily White",
// // // //                   workRole: "Product Manager",
// // // //                   averageRating: 4.8,
// // // //                   profilePicture:
// // // //                     "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=2807&auto=format&fit=crop",
// // // //                 },
// // // //               ],
// // // //               topTestimonials: [
// // // //                 {
// // // //                   _id: "1",
// // // //                   name: "John Doe",
// // // //                   title: "Mock Interview",
// // // //                   comment:
// // // //                     "The mock interview session was incredibly helpful. I landed my dream job!",
// // // //                   rating: 5,
// // // //                   image:
// // // //                     "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2960&auto=format&fit=crop",
// // // //                 },
// // // //                 {
// // // //                   _id: "2",
// // // //                   name: "Jane Smith",
// // // //                   title: "Resume Review",
// // // //                   comment:
// // // //                     "My resume was transformed. I started getting callbacks immediately.",
// // // //                   rating: 5,
// // // //                   image:
// // // //                     "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
// // // //                 },
// // // //                 {
// // // //                   _id: "3",
// // // //                   name: "Peter Jones",
// // // //                   title: "Project Guidance",
// // // //                   comment:
// // // //                     "The mentor's insights were game-changing. Highly recommend!",
// // // //                   rating: 5,
// // // //                   image:
// // // //                     "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2787&auto=format&fit=crop",
// // // //                 },
// // // //                 {
// // // //                   _id: "4",
// // // //                   name: "Alice Brown",
// // // //                   title: "1:1 Sessions",
// // // //                   comment:
// // // //                     "My confidence has skyrocketed thanks to my mentor's guidance.",
// // // //                   rating: 5,
// // // //                   image:
// // // //                     "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop",
// // // //                 },
// // // //               ],
// // // //               myMentorships: [
// // // //                 {
// // // //                   _id: "m1",
// // // //                   mentorName: "Alex Johnson",
// // // //                   mentorRole: "Senior Software Engineer",
// // // //                   serviceName: "Project Guidance",
// // // //                   nextSessionDate: "Oct 25, 2025 at 3:00 PM",
// // // //                   mentorProfileImage:
// // // //                     "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2787&auto=format&fit=crop",
// // // //                 },
// // // //               ],
// // // //             });
// // // //           }, 1500)
// // // //         );
// // // //         setDashboardData(data as any);
// // // //       } catch (err: any) {
// // // //         // Redux action to set error
// // // //         console.error("Failed to load dashboard data", err);
// // // //       } finally {
// // // //         setIsLoading(false);
// // // //       }
// // // //     };
// // // //     fetchDashboardData();
// // // //   }, []);

// // // //   const placeholders = [
// // // //     "Find your perfect mentor...",
// // // //     "Search specialized services...",
// // // //   ];
// // // //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // // //     console.log(e.target.value);
// // // //   };
// // // //   const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
// // // //     e.preventDefault();
// // // //     console.log("submitted");
// // // //   };

// // // //   const { topServices, topMentors, topTestimonials, myMentorships } =
// // // //     dashboardData;

// // // //   return (
// // // //     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 font-sans text-gray-900">
// // // //       <div className="relative overflow-hidden">
// // // //         {/* --- Hero Section with Vortex Background --- */}
// // // //         <Vortex className="absolute inset-0 z-0 h-[80vh] w-full" />
// // // //         <div className="relative z-10 container mx-auto px-8 py-24 text-center">
// // // //           <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-8 tracking-tight animate-fade-in-up">
// // // //             <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
// // // //               Your Mentorship
// // // //             </span>
// // // //             <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
// // // //               HUB
// // // //             </span>
// // // //           </h1>
// // // //           <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed font-light animate-fade-in-up delay-200">
// // // //             Transform your career with personalized mentorship from industry
// // // //             leaders
// // // //           </p>
// // // //           <div className="flex justify-center mb-12 animate-fade-in-up delay-400">
// // // //             <div className="relative w-full max-w-lg">
// // // //               <PlaceholdersAndVanishInput
// // // //                 placeholders={placeholders}
// // // //                 onChange={handleChange}
// // // //                 onSubmit={onSubmit}
// // // //                 className="w-full"
// // // //               />
// // // //               <Meteors number={20} className="z-0" />
// // // //             </div>
// // // //           </div>
// // // //           <div className="flex flex-col md:flex-row justify-center items-center gap-4 animate-fade-in-up delay-600">
// // // //             <Button className="bg-white text-purple-900 hover:bg-gray-100 rounded-2xl px-8 py-4 font-semibold shadow-lg">
// // // //               <span className="flex items-center gap-2">
// // // //                 Explore Mentors <ArrowUpRight className="w-5 h-5" />
// // // //               </span>
// // // //             </Button>
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* --- Main Content Sections with Glassmorphism Theme --- */}
// // // //       <div className="relative z-20 bg-white pt-16">
// // // //         <div className="container mx-auto px-8 py-16">
// // // //           {/* --- My Mentorships Section (New) --- */}
// // // //           {myMentorships.length > 0 && (
// // // //             <>
// // // //               <section className="mb-20">
// // // //                 <div className="text-center mb-12">
// // // //                   <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 animate-fade-in-up">
// // // //                     My Mentorships
// // // //                   </h2>
// // // //                   <p className="text-gray-600 text-lg max-w-2xl mx-auto animate-fade-in-up delay-200">
// // // //                     A quick overview of your ongoing professional journey
// // // //                   </p>
// // // //                 </div>
// // // //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// // // //                   {isLoading
// // // //                     ? [...Array(3)].map((_, idx) => (
// // // //                         <Skeleton
// // // //                           key={idx}
// // // //                           className="h-48 bg-gray-200 rounded-3xl animate-pulse"
// // // //                         />
// // // //                       ))
// // // //                     : myMentorships.map((mentorship, index) => (
// // // //                         <MyMentorshipCard
// // // //                           key={mentorship._id}
// // // //                           mentorship={mentorship}
// // // //                         />
// // // //                       ))}
// // // //                 </div>
// // // //               </section>
// // // //               <hr className="my-16 border-t-2 border-gray-100" />
// // // //             </>
// // // //           )}

// // // //           {/* --- Service Categories Section (Redesigned) --- */}
// // // //           <section className="mb-20">
// // // //             <div className="text-center mb-12">
// // // //               <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 animate-fade-in-up">
// // // //                 Services That Transform Careers
// // // //               </h2>
// // // //               <p className="text-gray-600 text-lg max-w-2xl mx-auto animate-fade-in-up delay-200">
// // // //                 Discover comprehensive mentorship services designed to
// // // //                 accelerate your professional growth
// // // //               </p>
// // // //             </div>
// // // //             {isLoading ? (
// // // //               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
// // // //                 {[...Array(6)].map((_, idx) => (
// // // //                   <Skeleton
// // // //                     key={idx}
// // // //                     className="h-64 bg-gray-200 rounded-3xl animate-pulse"
// // // //                   />
// // // //                 ))}
// // // //               </div>
// // // //             ) : (
// // // //               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
// // // //                 {topServices.slice(0, 6).map((service, index) => (
// // // //                   <NewServiceCategoryCard
// // // //                     key={service._id}
// // // //                     service={service}
// // // //                     index={index}
// // // //                   />
// // // //                 ))}
// // // //               </div>
// // // //             )}
// // // //           </section>

// // // //           {/* --- Elite Mentors Section (Redesigned) --- */}
// // // //           <section className="mb-20">
// // // //             <div className="text-center mb-12">
// // // //               <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 animate-fade-in-up">
// // // //                 Elite Mentors
// // // //               </h2>
// // // //               <p className="text-gray-600 text-lg max-w-2xl mx-auto animate-fade-in-up delay-200">
// // // //                 Connect with industry veterans who are passionate about your
// // // //                 success
// // // //               </p>
// // // //             </div>
// // // //             {isLoading ? (
// // // //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
// // // //                 {[...Array(4)].map((_, idx) => (
// // // //                   <Skeleton
// // // //                     key={idx}
// // // //                     className="h-96 bg-gray-200 rounded-3xl animate-pulse"
// // // //                   />
// // // //                 ))}
// // // //               </div>
// // // //             ) : (
// // // //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
// // // //                 {topMentors.slice(0, 4).map((mentor, index) => (
// // // //                   <NewMentorCard
// // // //                     key={mentor._id}
// // // //                     mentor={mentor}
// // // //                     index={index}
// // // //                   />
// // // //                 ))}
// // // //               </div>
// // // //             )}
// // // //           </section>
// // // //         </div>

// // // //         {/* --- Testimonials Section (Enhanced) --- */}
// // // //         <section className="relative overflow-hidden bg-gradient-to-br from-purple-50/50 to-blue-50/50 py-20">
// // // //           <AnimatedSpotlight
// // // //             className="-top-40 left-0 md:left-60 md:-top-20"
// // // //             fill="purple"
// // // //           />
// // // //           <div className="relative z-10 container mx-auto px-8">
// // // //             <div className="text-center mb-12">
// // // //               <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 animate-fade-in-up">
// // // //                 Success Stories
// // // //               </h2>
// // // //               <p className="text-gray-600 text-lg max-w-2xl mx-auto animate-fade-in-up delay-200">
// // // //                 Hear from mentees who transformed their careers with our
// // // //                 platform
// // // //               </p>
// // // //             </div>
// // // //             {isLoading ? (
// // // //               <div className="flex gap-6 overflow-hidden">
// // // //                 {[...Array(3)].map((_, idx) => (
// // // //                   <Skeleton
// // // //                     key={idx}
// // // //                     className="flex-shrink-0 w-80 h-40 bg-gray-200 rounded-3xl animate-pulse"
// // // //                   />
// // // //                 ))}
// // // //               </div>
// // // //             ) : topTestimonials.length > 0 ? (
// // // //               <div className="relative">
// // // //                 <InfiniteMovingCards
// // // //                   items={topTestimonials}
// // // //                   direction="right"
// // // //                   speed="slow"
// // // //                 />
// // // //               </div>
// // // //             ) : (
// // // //               <div className="text-center text-gray-500 py-12">
// // // //                 <p>No testimonials available at the moment</p>
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         </section>

// // // //         {/* --- CTA Section --- */}
// // // //         <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-20">
// // // //           <div className="relative z-10 container mx-auto px-8 text-center">
// // // //             <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in-up">
// // // //               Ready to Transform Your Career?
// // // //             </h2>
// // // //             <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto animate-fade-in-up delay-200">
// // // //               Join thousands of professionals who have accelerated their careers
// // // //               with personalized mentorship
// // // //             </p>
// // // //             <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-400">
// // // //               <Button className="bg-white text-purple-900 hover:bg-gray-100 rounded-2xl px-8 py-4 font-semibold shadow-lg">
// // // //                 <span className="flex items-center gap-2">
// // // //                   Find Your Mentor <ArrowUpRight className="w-5 h-5" />
// // // //                 </span>
// // // //               </Button>
// // // //               <Button
// // // //                 variant="outline"
// // // //                 className="border-2 border-white text-white hover:bg-white/10 rounded-2xl px-8 py-4 font-semibold backdrop-blur-sm"
// // // //               >
// // // //                 Learn More
// // // //               </Button>
// // // //             </div>
// // // //           </div>
// // // //         </section>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default MenteeDashboard;
// // // import React, { useState, useEffect, useId } from "react";
// // // import {
// // //   Star,
// // //   Clock,
// // //   Users,
// // //   ChevronRight,
// // //   Award,
// // //   Crown,
// // //   Sparkles,
// // //   ArrowUpRight,
// // //   MessageSquare,
// // //   Video,
// // //   BookOpen,
// // //   Target,
// // //   Zap,
// // //   Eye,
// // //   Heart,
// // //   Globe,
// // //   Play,
// // // } from "lucide-react";
// // // import { Button } from "@/components/ui/button";
// // // import { SparklesCore } from "@/components/ui/sparkles";
// // // import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
// // // import { getDashboardData } from "@/services/menteeService";
// // // import GradientBackgroundText from "@/components/mentee/AnimatedGradientText";
// // // import { useSelector } from "react-redux";
// // // import { RootState } from "@/redux/store/store";
// // // import { setError } from "@/redux/slices/userSlice";
// // // import { Badge } from "@/components/ui/badge";
// // // import { Card, CardContent } from "@/components/ui/card";

// // // // ============================================================================
// // // // UTILITY COMPONENTS
// // // // ============================================================================

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

// // // // ============================================================================
// // // // CARD COMPONENTS
// // // // ============================================================================

// // // // Service Category Card Component
// // // const ServiceCategoryCard = ({
// // //   service,
// // //   index,
// // // }: {
// // //   service: any;
// // //   index: number;
// // // }) => {
// // //   const [isHovered, setIsHovered] = useState(false);

// // //   const getServiceIcon = (title: string) => {
// // //     switch (title?.toLowerCase()) {
// // //       case "mock interview":
// // //         return <Video className="w-8 h-8" />;
// // //       case "resume review":
// // //         return <BookOpen className="w-8 h-8" />;
// // //       case "one - one sessions":
// // //         return <MessageSquare className="w-8 h-8" />;
// // //       case "project guidance":
// // //         return <Target className="w-8 h-8" />;
// // //       case "internship preparation":
// // //         return <Award className="w-8 h-8" />;
// // //       case "referral":
// // //         return <Users className="w-8 h-8" />;
// // //       default:
// // //         return <Sparkles className="w-8 h-8" />;
// // //     }
// // //   };

// // //   const gradients = [
// // //     "from-purple-500 to-blue-600",
// // //     "from-blue-500 to-indigo-600",
// // //     "from-indigo-500 to-purple-600",
// // //     "from-purple-600 to-pink-600",
// // //     "from-pink-500 to-red-500",
// // //     "from-green-500 to-emerald-600",
// // //   ];

// // //   const gradient = gradients[index % gradients.length];

// // //   return (
// // //     <Card
// // //       className={`group relative overflow-hidden border-0 transition-all duration-500 rounded-3xl ${
// // //         isHovered ? "scale-[1.05] -translate-y-3" : ""
// // //       }`}
// // //       style={{ animationDelay: `${index * 100}ms` }}
// // //       onMouseEnter={() => setIsHovered(true)}
// // //       onMouseLeave={() => setIsHovered(false)}
// // //     >
// // //       <div
// // //         className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`}
// // //       />

// // //       {/* Geometric Background */}
// // //       <div className="absolute inset-0 overflow-hidden">
// // //         <Grid size={20} />
// // //       </div>

// // //       {/* Animated Background Elements */}
// // //       <div className="absolute inset-0">
// // //         <div className="absolute top-4 right-4 w-12 h-12 border-2 border-white/20 rounded-full" />
// // //         <div className="absolute bottom-6 left-6 w-6 h-6 border border-white/30 rounded-lg rotate-45" />
// // //         <div className="absolute top-1/2 left-4 w-4 h-4 bg-white/20 rounded-full" />
// // //       </div>

// // //       <CardContent className="relative p-8 h-full">
// // //         <div className="flex flex-col h-full">
// // //           {/* Icon */}
// // //           <div
// // //             className={`p-4 bg-white/20 backdrop-blur-sm rounded-2xl w-fit mb-6 transition-transform duration-300 ${
// // //               isHovered ? "scale-110 rotate-3" : ""
// // //             }`}
// // //           >
// // //             <div className="text-white">{getServiceIcon(service.title)}</div>
// // //           </div>

// // //           {/* Content */}
// // //           <div className="flex-1">
// // //             <h3 className="text-xl font-bold text-white mb-4 line-clamp-2">
// // //               {service.title}
// // //             </h3>
// // //             <p className="text-white/90 text-sm leading-relaxed line-clamp-3">
// // //               {service.shortDescription || service.description}
// // //             </p>
// // //           </div>

// // //           {/* Bottom */}
// // //           <div className="flex items-center justify-between mt-6">
// // //             <div className="flex items-center gap-2">
// // //               <Zap className="w-4 h-4 text-yellow-300" />
// // //               <span className="text-white/90 text-sm font-medium">Popular</span>
// // //             </div>
// // //             <Button
// // //               variant="ghost"
// // //               size="sm"
// // //               className="text-white hover:bg-white/20 rounded-xl p-2"
// // //             >
// // //               <ArrowUpRight className="w-5 h-5" />
// // //             </Button>
// // //           </div>
// // //         </div>

// // //         {/* Hover Effects */}
// // //         {isHovered && (
// // //           <div className="absolute inset-0 bg-white/10 backdrop-blur-sm transition-opacity duration-300" />
// // //         )}
// // //       </CardContent>
// // //     </Card>
// // //   );
// // // };

// // // // Featured Service Card Component
// // // const FeaturedServiceCard = ({
// // //   service,
// // //   index,
// // // }: {
// // //   service: any;
// // //   index: number;
// // // }) => {
// // //   const [isHovered, setIsHovered] = useState(false);

// // //   const getServiceIcon = (type: string) => {
// // //     switch (type?.toLowerCase()) {
// // //       case "videocall":
// // //       case "video":
// // //         return <Video className="w-6 h-6" />;
// // //       case "chat":
// // //       case "1:1 chat":
// // //         return <MessageSquare className="w-6 h-6" />;
// // //       case "digital books":
// // //       case "documents":
// // //         return <BookOpen className="w-6 h-6" />;
// // //       case "priority dm":
// // //         return <Target className="w-6 h-6" />;
// // //       default:
// // //         return <Sparkles className="w-6 h-6" />;
// // //     }
// // //   };

// // //   return (
// // //     <Card
// // //       className={`group relative overflow-hidden bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl ${
// // //         isHovered ? "scale-[1.02] -translate-y-2" : ""
// // //       }`}
// // //       style={{ animationDelay: `${index * 100}ms` }}
// // //       onMouseEnter={() => setIsHovered(true)}
// // //       onMouseLeave={() => setIsHovered(false)}
// // //     >
// // //       {/* Background Effects */}
// // //       <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

// // //       <CardContent className="p-0">
// // //         {/* Header Image */}
// // //         <div className="relative overflow-hidden h-48">
// // //           <img
// // //             src={
// // //               service.image ||
// // //               service.mentorProfileImage ||
// // //               "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2800&auto=format&fit=crop"
// // //             }
// // //             alt={service.title}
// // //             className={`w-full h-full object-cover transition-transform duration-700 ${
// // //               isHovered ? "scale-110" : "scale-100"
// // //             }`}
// // //           />

// // //           {/* Gradient Overlay */}
// // //           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

// // //           {/* Service Type Icon */}
// // //           <div className="absolute top-4 left-4">
// // //             <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
// // //               <div className="text-white">{getServiceIcon(service.type)}</div>
// // //             </div>
// // //           </div>

// // //           {/* Rating Badge */}
// // //           <div className="absolute top-4 right-4">
// // //             <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
// // //               <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
// // //               <span className="text-white text-sm font-bold">
// // //                 {(service.rating || service.averageRating || 4.8).toFixed(1)}
// // //               </span>
// // //             </div>
// // //           </div>

// // //           {/* Play Button Overlay */}
// // //           {isHovered && (
// // //             <div className="absolute inset-0 flex items-center justify-center">
// // //               <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
// // //                 <Play className="w-6 h-6 text-white ml-1" />
// // //               </div>
// // //             </div>
// // //           )}

// // //           {/* Bottom Info */}
// // //           <div className="absolute bottom-4 left-4 right-4">
// // //             <div className="flex items-center gap-2 text-white text-sm mb-2">
// // //               <Clock className="w-4 h-4" />
// // //               <span>{service.duration || "30"} mins</span>
// // //               <Users className="w-4 h-4 ml-2" />
// // //               <span>
// // //                 {service.views || service.bookingCount || "0"} students
// // //               </span>
// // //             </div>
// // //             <h3 className="font-bold text-xl text-white line-clamp-2">
// // //               {service.title}
// // //             </h3>
// // //           </div>
// // //         </div>

// // //         {/* Content */}
// // //         <div className="p-6">
// // //           <div className="mb-4">
// // //             <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
// // //               {service.subtitle || service.shortDescription}
// // //             </p>
// // //           </div>

// // //           {/* Mentor Info */}
// // //           {service.mentorName && (
// // //             <div className="flex items-center gap-3 mb-4">
// // //               <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
// // //                 {service.mentorName.charAt(0)}
// // //               </div>
// // //               <span className="font-medium text-gray-700 text-sm">
// // //                 {service.mentorName}
// // //               </span>
// // //             </div>
// // //           )}

// // //           {/* Stats and Action */}
// // //           <div className="flex items-center justify-between">
// // //             <div className="flex items-center">
// // //               <span className="text-yellow-500 font-bold text-lg mr-1">
// // //                 {(service.rating || service.averageRating || 4.8).toFixed(1)}
// // //               </span>
// // //               <div className="flex">
// // //                 {[...Array(5).keys()].map((i) => (
// // //                   <Star
// // //                     key={i}
// // //                     className={`w-4 h-4 ${
// // //                       i <
// // //                       Math.floor(service.rating || service.averageRating || 4.8)
// // //                         ? "fill-yellow-400 text-yellow-400"
// // //                         : "text-gray-300"
// // //                     }`}
// // //                   />
// // //                 ))}
// // //               </div>
// // //             </div>

// // //             <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-4 py-2 font-semibold shadow-md hover:shadow-lg transition-all duration-200">
// // //               <span className="flex items-center gap-2">
// // //                 Details
// // //                 <ChevronRight className="w-4 h-4" />
// // //               </span>
// // //             </Button>
// // //           </div>
// // //         </div>
// // //       </CardContent>
// // //     </Card>
// // //   );
// // // };

// // // // Mentor Card Component
// // // const MentorCard = ({ mentor, index }: { mentor: any; index: number }) => {
// // //   const [isHovered, setIsHovered] = useState(false);
// // //   const [isImageLoaded, setIsImageLoaded] = useState(false);

// // //   const getBadgeConfig = (rating: number) => {
// // //     if (rating >= 4.8) {
// // //       return {
// // //         text: "Elite",
// // //         gradient: "bg-gradient-to-r from-orange-500 to-red-500",
// // //         icon: <Crown className="w-3 h-3" />,
// // //       };
// // //     } else if (rating >= 4.5) {
// // //       return {
// // //         text: "Top Rated",
// // //         gradient: "bg-gradient-to-r from-purple-500 to-blue-500",
// // //         icon: <Award className="w-3 h-3" />,
// // //       };
// // //     }
// // //     return {
// // //       text: "Premium",
// // //       gradient: "bg-gradient-to-r from-green-500 to-emerald-500",
// // //       icon: <Sparkles className="w-3 h-3" />,
// // //     };
// // //   };

// // //   const badgeConfig = getBadgeConfig(mentor.averageRating || 4.8);

// // //   return (
// // //     <Card
// // //       className={`group relative overflow-hidden bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl ${
// // //         isHovered ? "scale-[1.02] -translate-y-2" : ""
// // //       }`}
// // //       style={{ animationDelay: `${index * 100}ms` }}
// // //       onMouseEnter={() => setIsHovered(true)}
// // //       onMouseLeave={() => setIsHovered(false)}
// // //     >
// // //       {/* Animated Background */}
// // //       <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

// // //       {/* Glowing Border Effect */}
// // //       <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

// // //       <CardContent className="relative p-0 overflow-hidden">
// // //         {/* Header Section */}
// // //         <div className="relative h-32 overflow-hidden">
// // //           {/* Dynamic Background */}
// // //           <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700" />

// // //           {/* Animated Particles */}
// // //           <div className="absolute inset-0 opacity-30">
// // //             <SparklesCore
// // //               background="transparent"
// // //               minSize={0.4}
// // //               maxSize={1}
// // //               particleDensity={80}
// // //               className="w-full h-full"
// // //               particleColor="#FFFFFF"
// // //             />
// // //           </div>

// // //           {/* Geometric Overlay */}
// // //           <div className="absolute inset-0">
// // //             <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white/20 rounded-full" />
// // //             <div className="absolute bottom-4 left-4 w-8 h-8 border border-white/30 rounded-lg rotate-45" />
// // //           </div>

// // //           {/* Badge */}
// // //           <div className="absolute top-4 right-4 z-20">
// // //             <Badge
// // //               className={`${badgeConfig.gradient} text-white border-0 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm`}
// // //             >
// // //               <span className="flex items-center gap-1.5">
// // //                 {badgeConfig.icon}
// // //                 {badgeConfig.text}
// // //               </span>
// // //             </Badge>
// // //           </div>

// // //           {/* Profile Picture */}
// // //           <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 translate-y-2 z-20">
// // //             <div className="relative">
// // //               <div className="w-20 h-20 rounded-2xl overflow-hidden border-3 border-white shadow-2xl bg-white">
// // //                 {!isImageLoaded && (
// // //                   <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
// // //                 )}
// // //                 <img
// // //                   src={
// // //                     mentor.profilePicture ||
// // //                     mentor.profileImage ||
// // //                     "/default-avatar.png"
// // //                   }
// // //                   alt={mentor.name || `${mentor.firstName} ${mentor.lastName}`}
// // //                   onLoad={() => setIsImageLoaded(true)}
// // //                   className={`w-full h-full object-cover transition-all duration-500 ${
// // //                     isImageLoaded ? "opacity-100" : "opacity-0"
// // //                   } ${isHovered ? "scale-110" : "scale-100"}`}
// // //                 />
// // //               </div>

// // //               {/* Status Indicator */}
// // //               <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg">
// // //                 <div className="w-full h-full bg-green-500 rounded-full animate-pulse" />
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Content Section */}
// // //         <div className="pt-12 pb-6 px-6 relative">
// // //           {/* Rating Badge */}
// // //           <div className="absolute left-1/2 transform -translate-x-1/2 -top-4">
// // //             <div className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-sm font-bold text-gray-900 shadow-lg">
// // //               <Star className="w-4 h-4 mr-1.5 fill-gray-900" />
// // //               {(mentor.averageRating || 4.8).toFixed(1)}
// // //               <span className="ml-2 text-xs opacity-70">
// // //                 ({mentor.bookingCount || 0})
// // //               </span>
// // //             </div>
// // //           </div>

// // //           {/* Name and Title */}
// // //           <div className="text-center mb-4">
// // //             <h3 className="font-bold text-xl text-gray-900 mb-1">
// // //               {mentor.name || `${mentor.firstName} ${mentor.lastName}`}
// // //             </h3>
// // //             <div className="flex items-center justify-center text-sm">
// // //               <span className="font-semibold text-purple-600">
// // //                 {mentor.workRole || "Professional Mentor"}
// // //               </span>
// // //               {mentor.work && (
// // //                 <>
// // //                   <span className="mx-2 text-gray-400">@</span>
// // //                   <span className="text-gray-700 font-medium">
// // //                     {mentor.work}
// // //                   </span>
// // //                 </>
// // //               )}
// // //             </div>
// // //           </div>

// // //           {/* Bio */}
// // //           <p className="text-gray-600 text-sm text-center mb-6 line-clamp-2 leading-relaxed">
// // //             {mentor.bio ||
// // //               mentor.mentorId?.bio ||
// // //               "Experienced professional ready to guide you on your journey to success."}
// // //           </p>

// // //           {/* Stats Row */}
// // //           <div className="flex items-center justify-center gap-6 mb-6">
// // //             <div className="flex items-center gap-1.5">
// // //               <div className="p-1.5 bg-purple-100 rounded-lg">
// // //                 <Eye className="w-4 h-4 text-purple-600" />
// // //               </div>
// // //               <span className="text-sm font-medium text-gray-700">2.1k</span>
// // //             </div>
// // //             <div className="flex items-center gap-1.5">
// // //               <div className="p-1.5 bg-pink-100 rounded-lg">
// // //                 <Heart className="w-4 h-4 text-pink-600" />
// // //               </div>
// // //               <span className="text-sm font-medium text-gray-700">342</span>
// // //             </div>
// // //             <div className="flex items-center gap-1.5">
// // //               <div className="p-1.5 bg-blue-100 rounded-lg">
// // //                 <Globe className="w-4 h-4 text-blue-600" />
// // //               </div>
// // //               <span className="text-sm font-medium text-gray-700">Global</span>
// // //             </div>
// // //           </div>

// // //           {/* Action Buttons */}
// // //           <div className="flex gap-3">
// // //             <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 h-12">
// // //               <span className="flex items-center gap-2">
// // //                 View Profile
// // //                 <ArrowUpRight className="w-4 h-4" />
// // //               </span>
// // //             </Button>
// // //             <Button
// // //               variant="outline"
// // //               className="px-4 rounded-2xl border-2 border-purple-200 text-purple-600 hover:bg-purple-50 transition-all duration-200 h-12"
// // //             >
// // //               <MessageSquare className="w-4 h-4" />
// // //             </Button>
// // //           </div>
// // //         </div>
// // //       </CardContent>

// // //       {/* Hover Effects */}
// // //       {isHovered && (
// // //         <>
// // //           <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-purple-600/5 pointer-events-none transition-opacity duration-300" />
// // //           <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur opacity-75 transition-opacity duration-300" />
// // //         </>
// // //       )}
// // //     </Card>
// // //   );
// // // };

// // // // Testimonial Card Component
// // // const TestimonialCard = ({
// // //   testimonial,
// // //   index,
// // // }: {
// // //   testimonial: any;
// // //   index: number;
// // // }) => {
// // //   return (
// // //     <Card className="flex-shrink-0 w-80 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
// // //       <CardContent className="p-6">
// // //         {/* Header */}
// // //         <div className="flex items-center gap-4 mb-4">
// // //           <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-200">
// // //             <img
// // //               src={
// // //                 testimonial.image ||
// // //                 testimonial.menteeId?.profilePicture ||
// // //                 "/default-avatar.jpg"
// // //               }
// // //               alt={
// // //                 testimonial.name ||
// // //                 `${testimonial.menteeId?.firstName} ${testimonial.menteeId?.lastName}`
// // //               }
// // //               className="w-full h-full object-cover"
// // //             />
// // //           </div>
// // //           <div>
// // //             <h4 className="font-bold text-gray-900">
// // //               {testimonial.name ||
// // //                 `${testimonial.menteeId?.firstName} ${testimonial.menteeId?.lastName}`}
// // //             </h4>
// // //             <p className="text-sm bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-medium">
// // //               {testimonial.title || testimonial.serviceId?.title}
// // //             </p>
// // //           </div>
// // //         </div>

// // //         {/* Quote */}
// // //         <blockquote className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-4">
// // //           "{testimonial.quote || testimonial.comment}"
// // //         </blockquote>

// // //         {/* Rating */}
// // //         <div className="flex items-center justify-between">
// // //           <div className="flex">
// // //             {[...Array(Math.floor(testimonial.rating || 5)).keys()].map(
// // //               (_, i) => (
// // //                 <Star
// // //                   key={i}
// // //                   className="w-4 h-4 fill-yellow-400 text-yellow-400"
// // //                 />
// // //               )
// // //             )}
// // //           </div>
// // //           <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-0 px-2 py-1 rounded-full text-xs">
// // //             Verified
// // //           </Badge>
// // //         </div>
// // //       </CardContent>
// // //     </Card>
// // //   );
// // // };

// // // // ============================================================================
// // // // ANIMATION COMPONENTS
// // // // ============================================================================

// // // // Infinite Moving Cards Component
// // // const InfiniteMovingCards = ({
// // //   items,
// // //   direction = "right",
// // //   speed = "normal",
// // // }: {
// // //   items: any[];
// // //   direction?: "right" | "left";
// // //   speed?: "fast" | "normal" | "slow";
// // // }) => {
// // //   const containerStyles = {
// // //     "--animation-duration":
// // //       speed === "fast" ? "10s" : speed === "slow" ? "20s" : "30s",
// // //   } as React.CSSProperties;

// // //   return (
// // //     <div className="relative overflow-hidden w-full">
// // //       {/* Fade edges */}
// // //       <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-white via-white/50 to-transparent" />
// // //       <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-white via-white/50 to-transparent" />

// // //       <div
// // //         className="flex gap-6 py-6"
// // //         style={{
// // //           ...containerStyles,
// // //           animation: `scroll-${direction} var(--animation-duration) linear infinite`,
// // //         }}
// // //       >
// // //         {[...items, ...items].map((item, idx) => (
// // //           <TestimonialCard key={idx} testimonial={item} index={idx} />
// // //         ))}
// // //       </div>

// // //       <style>{`
// // //         @keyframes scroll-right {
// // //           from { transform: translateX(0); }
// // //           to { transform: translateX(-50%); }
// // //         }
// // //         @keyframes scroll-left {
// // //           from { transform: translateX(-50%); }
// // //           to { transform: translateX(0); }
// // //         }
// // //       `}</style>
// // //     </div>
// // //   );
// // // };

// // // // ============================================================================
// // // // SECTION COMPONENTS
// // // // ============================================================================

// // // // Hero Section Component
// // // const HeroSection = ({
// // //   placeholders,
// // //   handleChange,
// // //   onSubmit,
// // // }: {
// // //   placeholders: string[];
// // //   handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// // //   onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
// // // }) => {
// // //   return (
// // //     <div className="relative overflow-hidden">
// // //       <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />

// // //       {/* Animated Background */}
// // //       <div className="absolute inset-0">
// // //         <SparklesCore
// // //           background="transparent"
// // //           minSize={0.6}
// // //           maxSize={1.4}
// // //           particleDensity={50}
// // //           className="w-full h-full"
// // //           particleColor="#FFFFFF"
// // //         />
// // //       </div>

// // //       {/* Geometric Background Elements */}
// // //       <div className="absolute inset-0 overflow-hidden">
// // //         <div className="absolute top-20 left-20 w-64 h-64 border border-white/10 rounded-full" />
// // //         <div className="absolute bottom-32 right-32 w-48 h-48 border border-white/10 rounded-full" />
// // //         <div className="absolute top-1/2 left-1/4 w-32 h-32 border border-white/20 rounded-lg rotate-45" />
// // //         <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/5 rounded-full" />
// // //       </div>

// // //       <div className="relative z-10 container mx-auto px-8 py-24">
// // //         <div className="text-center max-w-4xl mx-auto">
// // //           {/* Main Title */}
// // //           <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-8 tracking-tight">
// // //             <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
// // //               Mentor
// // //             </span>
// // //             <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
// // //               ONE
// // //             </span>
// // //           </h1>

// // //           {/* Subtitle */}
// // //           <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed font-light">
// // //             Transform your career with personalized mentorship from industry
// // //             leaders
// // //           </p>

// // //           {/* Gradient Lines */}
// // //           <div className="relative mb-12">
// // //             <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-400 to-transparent h-[2px] w-3/4 mx-auto blur-sm" />
// // //             <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-400 to-transparent h-px w-3/4 mx-auto" />
// // //             <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-400 to-transparent h-[5px] w-1/4 mx-auto blur-sm" />
// // //             <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-400 to-transparent h-px w-1/4 mx-auto" />
// // //           </div>

// // //           {/* Search Input */}
// // //           <div className="mb-12">
// // //             <PlaceholdersAndVanishInput
// // //               placeholders={placeholders}
// // //               onChange={handleChange}
// // //               onSubmit={onSubmit}
// // //             />
// // //           </div>

// // //           {/* CTA Button */}
// // //           <div className="flex flex-col md:flex-row justify-center items-center gap-4">
// // //             <GradientBackgroundText className="font-semibold px-8 py-4 text-lg">
// // //               Get Started Now
// // //             </GradientBackgroundText>
// // //           </div>

// // //           {/* Stats */}
// // //           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
// // //             <div className="text-center">
// // //               <div className="text-3xl font-bold text-white mb-2">1000+</div>
// // //               <div className="text-white/70 text-sm">Expert Mentors</div>
// // //             </div>
// // //             <div className="text-center">
// // //               <div className="text-3xl font-bold text-white mb-2">50k+</div>
// // //               <div className="text-white/70 text-sm">Success Stories</div>
// // //             </div>
// // //             <div className="text-center">
// // //               <div className="text-3xl font-bold text-white mb-2">98%</div>
// // //               <div className="text-white/70 text-sm">Satisfaction Rate</div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Bottom Wave */}
// // //       <div className="absolute bottom-0 left-0 w-full overflow-hidden">
// // //         <svg viewBox="0 0 1440 320" className="relative block w-full h-20">
// // //           <path
// // //             fill="white"
// // //             fillOpacity="1"
// // //             d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,117.3C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
// // //           ></path>
// // //         </svg>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // Service Categories Section Component
// // // const ServiceCategoriesSection = ({
// // //   displayServices,
// // //   isLoading,
// // // }: {
// // //   displayServices: any[];
// // //   isLoading: boolean;
// // // }) => {
// // //   return (
// // //     <section className="mb-20">
// // //       <div className="text-center mb-12">
// // //         <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
// // //           Services That Transform Careers
// // //         </h2>
// // //         <p className="text-gray-600 text-lg max-w-2xl mx-auto">
// // //           Discover comprehensive mentorship services designed to accelerate your
// // //           professional growth
// // //         </p>
// // //       </div>

// // //       {isLoading ? (
// // //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
// // //           {[...Array(6)].map((_, idx) => (
// // //             <div
// // //               key={idx}
// // //               className="h-64 bg-gray-200 rounded-3xl animate-pulse"
// // //             />
// // //           ))}
// // //         </div>
// // //       ) : (
// // //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
// // //           {displayServices.slice(0, 6).map((service, index) => (
// // //             <ServiceCategoryCard
// // //               key={service._id || service.title || index}
// // //               service={service}
// // //               index={index}
// // //             />
// // //           ))}
// // //         </div>
// // //       )}

// // //       <div className="text-center mt-12">
// // //         <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
// // //           <span className="flex items-center gap-2">
// // //             Explore All Services
// // //             <ArrowUpRight className="w-5 h-5" />
// // //           </span>
// // //         </Button>
// // //       </div>
// // //     </section>
// // //   );
// // // };

// // // // Featured Services Section Component
// // // const FeaturedServicesSection = ({
// // //   displayServices,
// // //   isLoading,
// // // }: {
// // //   displayServices: any[];
// // //   isLoading: boolean;
// // // }) => {
// // //   return (
// // //     <section className="mb-20">
// // //       <div className="text-center mb-12">
// // //         <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
// // //           Featured Services
// // //         </h2>
// // //         <p className="text-gray-600 text-lg max-w-2xl mx-auto">
// // //           Hand-picked premium services from our top-rated mentors
// // //         </p>
// // //       </div>

// // //       {isLoading ? (
// // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
// // //           {[...Array(4)].map((_, idx) => (
// // //             <div
// // //               key={idx}
// // //               className="h-96 bg-gray-200 rounded-3xl animate-pulse"
// // //             />
// // //           ))}
// // //         </div>
// // //       ) : (
// // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
// // //           {displayServices.slice(0, 4).map((service, index) => (
// // //             <FeaturedServiceCard
// // //               key={service._id || service.id || index}
// // //               service={service}
// // //               index={index}
// // //             />
// // //           ))}
// // //         </div>
// // //       )}
// // //     </section>
// // //   );
// // // };

// // // // Elite Mentors Section Component
// // // const EliteMentorsSection = ({
// // //   displayMentors,
// // //   isLoading,
// // // }: {
// // //   displayMentors: any[];
// // //   isLoading: boolean;
// // // }) => {
// // //   return (
// // //     <section className="mb-20">
// // //       <div className="text-center mb-12">
// // //         <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
// // //           Elite Mentors
// // //         </h2>
// // //         <p className="text-gray-600 text-lg max-w-2xl mx-auto">
// // //           Connect with industry veterans who are passionate about your success
// // //         </p>
// // //       </div>

// // //       {isLoading ? (
// // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
// // //           {[...Array(4)].map((_, idx) => (
// // //             <div
// // //               key={idx}
// // //               className="h-96 bg-gray-200 rounded-3xl animate-pulse"
// // //             />
// // //           ))}
// // //         </div>
// // //       ) : (
// // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
// // //           {displayMentors.slice(0, 4).map((mentor, index) => (
// // //             <MentorCard
// // //               key={mentor._id || mentor.userId || index}
// // //               mentor={mentor}
// // //               index={index}
// // //             />
// // //           ))}
// // //         </div>
// // //       )}

// // //       <div className="text-center mt-12">
// // //         <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
// // //           <span className="flex items-center gap-2">
// // //             View All Mentors
// // //             <Users className="w-5 h-5" />
// // //           </span>
// // //         </Button>
// // //       </div>
// // //     </section>
// // //   );
// // // };

// // // // Testimonials Section Component
// // // const TestimonialsSection = ({
// // //   displayTestimonials,
// // //   isLoading,
// // // }: {
// // //   displayTestimonials: any[];
// // //   isLoading: boolean;
// // // }) => {
// // //   return (
// // //     <section className="bg-gradient-to-br from-purple-50/50 to-blue-50/50 py-20">
// // //       <div className="container mx-auto px-8">
// // //         <div className="text-center mb-12">
// // //           <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
// // //             Success Stories
// // //           </h2>
// // //           <p className="text-gray-600 text-lg max-w-2xl mx-auto">
// // //             Hear from mentees who transformed their careers with our platform
// // //           </p>
// // //         </div>

// // //         {isLoading ? (
// // //           <div className="flex gap-6 overflow-hidden">
// // //             {[...Array(3)].map((_, idx) => (
// // //               <div
// // //                 key={idx}
// // //                 className="flex-shrink-0 w-80 h-40 bg-gray-200 rounded-3xl animate-pulse"
// // //               />
// // //             ))}
// // //           </div>
// // //         ) : displayTestimonials.length > 0 ? (
// // //           <>
// // //             <InfiniteMovingCards
// // //               items={displayTestimonials.slice(
// // //                 0,
// // //                 Math.ceil(displayTestimonials.length / 2)
// // //               )}
// // //               direction="right"
// // //               speed="slow"
// // //             />
// // //             <InfiniteMovingCards
// // //               items={displayTestimonials.slice(
// // //                 Math.ceil(displayTestimonials.length / 2)
// // //               )}
// // //               direction="left"
// // //               speed="normal"
// // //             />
// // //           </>
// // //         ) : (
// // //           <div className="text-center text-gray-500 py-12">
// // //             <p>No testimonials available at the moment</p>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </section>
// // //   );
// // // };

// // // // CTA Section Component
// // // const CTASection = () => {
// // //   return (
// // //     <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-20">
// // //       <div className="absolute inset-0">
// // //         <SparklesCore
// // //           background="transparent"
// // //           minSize={0.4}
// // //           maxSize={1}
// // //           particleDensity={30}
// // //           className="w-full h-full"
// // //           particleColor="#FFFFFF"
// // //         />
// // //       </div>

// // //       <div className="relative z-10 container mx-auto px-8 text-center">
// // //         <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
// // //           Ready to Transform Your Career?
// // //         </h2>
// // //         <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
// // //           Join thousands of professionals who have accelerated their careers
// // //           with personalized mentorship
// // //         </p>

// // //         <div className="flex flex-col sm:flex-row gap-4 justify-center">
// // //           <Button className="bg-white text-purple-900 hover:bg-gray-100 rounded-2xl px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
// // //             <span className="flex items-center gap-2">
// // //               Find Your Mentor
// // //               <ArrowUpRight className="w-5 h-5" />
// // //             </span>
// // //           </Button>
// // //           <Button
// // //             variant="outline"
// // //             className="border-2 border-white text-white hover:bg-white/10 rounded-2xl px-8 py-4 font-semibold backdrop-blur-sm"
// // //           >
// // //             Learn More
// // //           </Button>
// // //         </div>
// // //       </div>
// // //     </section>
// // //   );
// // // };

// // // // ============================================================================
// // // // MAIN DASHBOARD COMPONENT
// // // // ============================================================================

// // // const MenteeDashboard: React.FC = () => {
// // //   // State Management
// // //   const [dashboardData, setDashboardData] = useState<{
// // //     topServices: any[];
// // //     topMentors: any[];
// // //     topTestimonials: any[];
// // //   }>({ topServices: [], topMentors: [], topTestimonials: [] });
// // //   const [isLoading, setIsLoading] = useState(true);

// // //   // Redux State
// // //   const { user, error, loading } = useSelector(
// // //     (state: RootState) => state.user
// // //   );

// // //   // Constants
// // //   const placeholders = [
// // //     "Find your perfect mentor...",
// // //     "Search specialized services...",
// // //     "Discover career guidance...",
// // //     "Explore skill development...",
// // //     "Connect with industry experts...",
// // //   ];

// // //   // Effects
// // //   useEffect(() => {
// // //     const fetchDashboardData = async () => {
// // //       try {
// // //         setIsLoading(true);
// // //         const data = await getDashboardData();
// // //         setDashboardData(data);
// // //       } catch (err: any) {
// // //         setError(err.message || "Failed to load dashboard data");
// // //       } finally {
// // //         setIsLoading(false);
// // //       }
// // //     };
// // //     fetchDashboardData();
// // //   }, []);

// // //   // Event Handlers
// // //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     console.log(e.target.value);
// // //   };

// // //   const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
// // //     e.preventDefault();
// // //     console.log("submitted");
// // //   };

// // //   // Data Processing
// // //   const displayMentors = dashboardData.topMentors || [];
// // //   const displayServices = dashboardData.topServices || [];
// // //   const displayTestimonials = dashboardData.topTestimonials || [];

// // //   // Render
// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
// // //       {/* Hero Section */}
// // //       <HeroSection
// // //         placeholders={placeholders}
// // //         handleChange={handleChange}
// // //         onSubmit={onSubmit}
// // //       />

// // //       {/* Main Content */}
// // //       <div className="relative z-10 -mt-1 bg-white">
// // //         <div className="container mx-auto px-8 py-16">
// // //           {/* Service Categories Section */}
// // //           <ServiceCategoriesSection
// // //             displayServices={displayServices}
// // //             isLoading={isLoading}
// // //           />

// // //           {/* Featured Services Section */}
// // //           <FeaturedServicesSection
// // //             displayServices={displayServices}
// // //             isLoading={isLoading}
// // //           />

// // //           {/* Elite Mentors Section */}
// // //           <EliteMentorsSection
// // //             displayMentors={displayMentors}
// // //             isLoading={isLoading}
// // //           />
// // //         </div>

// // //         {/* Testimonials Section */}
// // //         <TestimonialsSection
// // //           displayTestimonials={displayTestimonials}
// // //           isLoading={isLoading}
// // //         />

// // //         {/* CTA Section */}
// // //         <CTASection />
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default MenteeDashboard;
// // import React, { useState, useEffect, useId } from "react";
// // import {
// //   Star,
// //   Clock,
// //   Users,
// //   ChevronRight,
// //   TrendingUp,
// //   Award,
// //   BookOpen,
// //   MessageSquare,
// //   Calendar,
// //   Target,
// //   Zap,
// //   Search,
// //   Filter,
// //   ArrowRight,
// //   Play,
// //   CheckCircle,
// //   Globe,
// //   Brain,
// //   Lightbulb,
// //   Rocket,
// // } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Skeleton } from "@/components/ui/skeleton";
// // import { SparklesCore } from "@/components/ui/sparkles";
// // import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
// // import { getDashboardData } from "@/services/menteeService";
// // import GradientBackgroundText from "@/components/mentee/AnimatedGradientText";
// // import { useSelector } from "react-redux";
// // import { RootState } from "@/redux/store/store";

// // // Grid Pattern Component
// // export function GridPattern({ width, height, x, y, squares, ...props }: any) {
// //   const patternId = useId();

// //   return (
// //     <svg aria-hidden="true" {...props}>
// //       <defs>
// //         <pattern
// //           id={patternId}
// //           width={width}
// //           height={height}
// //           patternUnits="userSpaceOnUse"
// //           x={x}
// //           y={y}
// //         >
// //           <path d={`M.5 ${height}V.5H${width}`} fill="none" />
// //         </pattern>
// //       </defs>
// //       <rect
// //         width="100%"
// //         height="100%"
// //         strokeWidth={0}
// //         fill={`url(#${patternId})`}
// //       />
// //       {squares && (
// //         <svg x={x} y={y} className="overflow-visible">
// //           {squares.map(([x, y]: any) => (
// //             <rect
// //               strokeWidth="0"
// //               key={`${x}-${y}`}
// //               width={width + 1}
// //               height={height + 1}
// //               x={x * width}
// //               y={y * height}
// //             />
// //           ))}
// //         </svg>
// //       )}
// //     </svg>
// //   );
// // }

// // // Grid Component
// // export const Grid = ({
// //   pattern,
// //   size,
// // }: {
// //   pattern?: number[][];
// //   size?: number;
// // }) => {
// //   const p = pattern ?? [
// //     [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
// //     [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
// //     [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
// //     [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
// //     [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
// //   ];
// //   return (
// //     <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
// //       <div className="absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 from-zinc-100/30 to-zinc-300/30 dark:to-zinc-900/30 opacity-100">
// //         <GridPattern
// //           width={size ?? 20}
// //           height={size ?? 20}
// //           x="-12"
// //           y="4"
// //           squares={p}
// //           className="absolute inset-0 h-full w-full mix-blend-overlay dark:fill-white/10 dark:stroke-white/10 stroke-black/10 fill-black/10"
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// // // Modern Stats Card Component
// // const StatsCard = ({ icon: Icon, label, value, trend, color }: any) => (
// //   <div className="relative group">
// //     <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
// //     <div className="relative bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300">
// //       <div className="flex items-center justify-between mb-4">
// //         <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
// //           <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
// //         </div>
// //         {trend && (
// //           <span className="text-green-500 text-sm font-medium flex items-center">
// //             <TrendingUp className="w-4 h-4 mr-1" />
// //             {trend}
// //           </span>
// //         )}
// //       </div>
// //       <div>
// //         <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
// //           {value}
// //         </h3>
// //         <p className="text-gray-600 dark:text-gray-400 text-sm">{label}</p>
// //       </div>
// //     </div>
// //   </div>
// // );

// // // Enhanced Mentor Card Component
// // const FuturisticMentorCard = ({ mentor }: any) => {
// //   const [isHovered, setIsHovered] = useState(false);

// //   const getBadgeInfo = (mentor: any) => {
// //     if (mentor.averageRating >= 4.8)
// //       return { text: "Elite", color: "from-yellow-400 to-orange-500" };
// //     if (mentor.averageRating >= 4.5)
// //       return { text: "Expert", color: "from-blue-500 to-indigo-600" };
// //     if (mentor.bookingCount > 100)
// //       return { text: "Popular", color: "from-green-500 to-emerald-600" };
// //     return { text: "Mentor", color: "from-purple-500 to-pink-600" };
// //   };

// //   const badge = getBadgeInfo(mentor);

// //   return (
// //     <div
// //       className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10"
// //       onMouseEnter={() => setIsHovered(true)}
// //       onMouseLeave={() => setIsHovered(false)}
// //     >
// //       {/* Animated background gradient */}
// //       <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

// //       {/* Header with image and badge */}
// //       <div className="relative p-6 pb-0">
// //         <div className="flex items-start justify-between mb-4">
// //           <div className="relative">
// //             <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 group-hover:border-blue-400 transition-colors duration-300">
// //               <img
// //                 src={
// //                   mentor.profilePicture ||
// //                   mentor.profileImage ||
// //                   "/default-avatar.png"
// //                 }
// //                 alt={mentor.name || `${mentor.firstName} ${mentor.lastName}`}
// //                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
// //               />
// //             </div>
// //             <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-3 border-white dark:border-gray-900 flex items-center justify-center">
// //               <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
// //             </div>
// //           </div>
// //           <div
// //             className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${badge.color} shadow-lg`}
// //           >
// //             {badge.text}
// //           </div>
// //         </div>

// //         <div className="mb-4">
// //           <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
// //             {mentor.name || `${mentor.firstName} ${mentor.lastName}`}
// //           </h3>
// //           <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm mb-1">
// //             {mentor.workRole || mentor.role}
// //           </p>
// //           {mentor.work && (
// //             <p className="text-gray-500 dark:text-gray-400 text-sm">
// //               @ {mentor.work}
// //             </p>
// //           )}
// //         </div>

// //         {/* Stats */}
// //         <div className="flex items-center gap-4 mb-4">
// //           <div className="flex items-center text-yellow-500">
// //             <Star className="w-4 h-4 fill-current mr-1" />
// //             <span className="text-sm font-semibold">
// //               {(mentor.averageRating || 4.8).toFixed(1)}
// //             </span>
// //           </div>
// //           <div className="flex items-center text-gray-500 dark:text-gray-400">
// //             <Users className="w-4 h-4 mr-1" />
// //             <span className="text-sm">{mentor.bookingCount || 0} sessions</span>
// //           </div>
// //         </div>

// //         {/* Expertise tags */}
// //         <div className="flex flex-wrap gap-2 mb-6">
// //           {(mentor.expertise || ["Leadership", "Career"])
// //             .slice(0, 2)
// //             .map((skill: string, index: number) => (
// //               <span
// //                 key={index}
// //                 className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-lg"
// //               >
// //                 {skill}
// //               </span>
// //             ))}
// //         </div>
// //       </div>

// //       {/* Action buttons */}
// //       <div className="px-6 pb-6">
// //         <div className="flex gap-2">
// //           <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/25">
// //             View Profile
// //           </Button>
// //           <Button
// //             variant="outline"
// //             className="px-4 rounded-xl border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
// //           >
// //             <MessageSquare className="w-4 h-4" />
// //           </Button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // Enhanced Service Card Component
// // const FuturisticServiceCard = ({ service }: any) => {
// //   const [isHovered, setIsHovered] = useState(false);

// //   const getServiceIcon = (title: string) => {
// //     if (title.toLowerCase().includes("interview")) return MessageSquare;
// //     if (title.toLowerCase().includes("resume")) return BookOpen;
// //     if (title.toLowerCase().includes("project")) return Target;
// //     if (title.toLowerCase().includes("session")) return Users;
// //     return Lightbulb;
// //   };

// //   const Icon = getServiceIcon(service.title);

// //   return (
// //     <div
// //       className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10"
// //       onMouseEnter={() => setIsHovered(true)}
// //       onMouseLeave={() => setIsHovered(false)}
// //     >
// //       {/* Animated background */}
// //       <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

// //       {/* Content */}
// //       <div className="relative p-8">
// //         <div className="flex items-start justify-between mb-6">
// //           <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white group-hover:scale-110 transition-transform duration-300">
// //             <Icon className="w-8 h-8" />
// //           </div>
// //           <div className="text-right">
// //             <div className="text-2xl font-bold text-gray-900 dark:text-white">
// //               {service.bookingCount || 0}
// //             </div>
// //             <div className="text-sm text-gray-500 dark:text-gray-400">
// //               bookings
// //             </div>
// //           </div>
// //         </div>

// //         <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
// //           {service.title}
// //         </h3>

// //         <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2">
// //           {service.shortDescription || service.description}
// //         </p>

// //         <div className="flex items-center justify-between">
// //           <div className="flex items-center gap-4">
// //             <div className="flex items-center text-yellow-500">
// //               <Star className="w-4 h-4 fill-current mr-1" />
// //               <span className="text-sm font-semibold">
// //                 {(service.averageRating || 4.8).toFixed(1)}
// //               </span>
// //             </div>
// //             <div className="flex items-center text-gray-500 dark:text-gray-400">
// //               <Clock className="w-4 h-4 mr-1" />
// //               <span className="text-sm">{service.duration || "60"} min</span>
// //             </div>
// //           </div>

// //           <Button
// //             variant="ghost"
// //             size="sm"
// //             className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-0 hover:bg-transparent group"
// //           >
// //             Explore
// //             <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
// //           </Button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // Testimonial Card Component
// // const TestimonialCard = ({ testimonial }: any) => (
// //   <div className="flex-shrink-0 w-80 rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
// //     <div className="flex items-start gap-4 mb-4">
// //       <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
// //         <img
// //           src={testimonial.menteeId?.profilePicture || "/default-avatar.jpg"}
// //           alt={`${testimonial.menteeId?.firstName} ${testimonial.menteeId?.lastName}`}
// //           className="w-full h-full object-cover"
// //         />
// //       </div>
// //       <div className="flex-1">
// //         <h4 className="font-semibold text-gray-900 dark:text-white">
// //           {`${testimonial.menteeId?.firstName} ${testimonial.menteeId?.lastName}`}
// //         </h4>
// //         <p className="text-sm text-blue-600 dark:text-blue-400">
// //           {testimonial.serviceId?.title}
// //         </p>
// //         <div className="flex mt-2">
// //           {[...Array(Math.floor(testimonial.rating || 5))].map((_, i) => (
// //             <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //     <blockquote className="text-gray-600 dark:text-gray-400 text-sm italic">
// //       "{testimonial.comment}"
// //     </blockquote>
// //   </div>
// // );

// // // Infinite Moving Cards Component
// // const InfiniteMovingCards = ({
// //   items,
// //   direction = "right",
// //   speed = "normal",
// // }: any) => {
// //   const containerStyles = {
// //     "--animation-duration":
// //       speed === "fast" ? "15s" : speed === "slow" ? "25s" : "20s",
// //   } as React.CSSProperties;

// //   return (
// //     <div className="relative overflow-hidden w-full">
// //       <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-white dark:from-gray-950 to-transparent"></div>
// //       <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-white dark:from-gray-950 to-transparent"></div>
// //       <div
// //         className="flex gap-6 py-8"
// //         style={{
// //           ...containerStyles,
// //           animation: `scroll-${direction} var(--animation-duration) linear infinite`,
// //         }}
// //       >
// //         {[...items, ...items].map((item: any, idx: number) => (
// //           <TestimonialCard
// //             key={`${item._id || idx}-${idx}`}
// //             testimonial={item}
// //           />
// //         ))}
// //       </div>
// //       <style>{`
// //         @keyframes scroll-right {
// //           from { transform: translateX(0); }
// //           to { transform: translateX(-50%); }
// //         }
// //         @keyframes scroll-left {
// //           from { transform: translateX(-50%); }
// //           to { transform: translateX(0); }
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };

// // // Main Dashboard Component
// // const MenteeDashboard: React.FC = () => {
// //   const [dashboardData, setDashboardData] = useState<{
// //     topServices: any[];
// //     topMentors: any[];
// //     topTestimonials: any[];
// //   }>({ topServices: [], topMentors: [], topTestimonials: [] });
// //   const [isLoading, setIsLoading] = useState(true);
// //   const { user, error } = useSelector((state: RootState) => state.user);

// //   const placeholders = [
// //     "Search for AI & ML mentors...",
// //     "Find software engineering experts...",
// //     "Discover data science coaches...",
// //     "Explore career guidance services...",
// //     "Connect with industry leaders...",
// //   ];

// //   useEffect(() => {
// //     const fetchDashboardData = async () => {
// //       try {
// //         setIsLoading(true);
// //         const data = await getDashboardData();
// //         setDashboardData(data);
// //       } catch (err: any) {
// //         console.error("Failed to load dashboard data:", err);
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };
// //     fetchDashboardData();
// //   }, []);

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     console.log(e.target.value);
// //   };

// //   const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
// //     e.preventDefault();
// //     console.log("Search submitted");
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
// //       {/* Hero Section */}
// //       <div className="relative overflow-hidden">
// //         <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800"></div>
// //         <div className="absolute inset-0 bg-black/20"></div>

// //         {/* Animated background particles */}
// //         <div className="absolute inset-0">
// //           <SparklesCore
// //             background="transparent"
// //             minSize={0.4}
// //             maxSize={1.4}
// //             particleDensity={100}
// //             className="w-full h-full"
// //             particleColor="#FFFFFF"
// //           />
// //         </div>

// //         <div className="relative z-10 container mx-auto px-6 py-24 lg:py-32">
// //           <div className="text-center max-w-4xl mx-auto">
// //             <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
// //               <Rocket className="w-5 h-5 text-yellow-400" />
// //               <span className="text-white text-sm font-medium">
// //                 Welcome to MentorONE
// //               </span>
// //             </div>

// //             <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
// //               Accelerate Your
// //               <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
// //                 {" "}
// //                 Career Journey
// //               </span>
// //             </h1>

// //             <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
// //               Connect with industry experts, enhance your skills, and unlock new
// //               opportunities with personalized mentorship
// //             </p>

// //             <div className="max-w-2xl mx-auto mb-8">
// //               <PlaceholdersAndVanishInput
// //                 placeholders={placeholders}
// //                 onChange={handleChange}
// //                 onSubmit={onSubmit}
// //               />
// //             </div>

// //             <div className="flex flex-col sm:flex-row gap-4 justify-center">
// //               <GradientBackgroundText className="font-semibold px-8 py-3">
// //                 Start Your Journey
// //               </GradientBackgroundText>
// //               <Button
// //                 variant="outline"
// //                 className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 px-8 py-3 rounded-full"
// //               >
// //                 Learn More
// //               </Button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Decorative elements */}
// //         <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 dark:from-gray-950 to-transparent"></div>
// //       </div>

// //       <div className="container mx-auto px-6 py-16 space-y-16">
// //         {/* Stats Section */}
// //         <section>
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //             <StatsCard
// //               icon={Users}
// //               label="Active Mentors"
// //               value={dashboardData.topMentors.length || "100+"}
// //               trend="+12%"
// //               color="bg-blue-500"
// //             />
// //             <StatsCard
// //               icon={BookOpen}
// //               label="Available Services"
// //               value={dashboardData.topServices.length || "50+"}
// //               trend="+8%"
// //               color="bg-green-500"
// //             />
// //             <StatsCard
// //               icon={Award}
// //               label="Success Stories"
// //               value={dashboardData.topTestimonials.length || "500+"}
// //               trend="+25%"
// //               color="bg-purple-500"
// //             />
// //             <StatsCard
// //               icon={Clock}
// //               label="Hours of Mentoring"
// //               value="10K+"
// //               trend="+18%"
// //               color="bg-orange-500"
// //             />
// //           </div>
// //         </section>

// //         {/* Services Section */}
// //         <section>
// //           <div className="text-center mb-12">
// //             <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
// //               Premium Services
// //             </h2>
// //             <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
// //               Discover personalized mentorship services designed to accelerate
// //               your professional growth
// //             </p>
// //           </div>

// //           {isLoading ? (
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //               {[...Array(6)].map((_, idx) => (
// //                 <Skeleton key={idx} className="h-64 w-full rounded-3xl" />
// //               ))}
// //             </div>
// //           ) : (
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //               {dashboardData.topServices.map((service) => (
// //                 <FuturisticServiceCard key={service._id} service={service} />
// //               ))}
// //             </div>
// //           )}
// //         </section>

// //         {/* Featured Mentors Section */}
// //         <section>
// //           <div className="text-center mb-12">
// //             <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
// //               Meet Our Expert Mentors
// //             </h2>
// //             <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
// //               Learn from industry leaders and experienced professionals who are
// //               passionate about your success
// //             </p>
// //           </div>

// //           {isLoading ? (
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
// //               {[...Array(8)].map((_, idx) => (
// //                 <Skeleton key={idx} className="h-96 w-full rounded-3xl" />
// //               ))}
// //             </div>
// //           ) : (
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
// //               {dashboardData.topMentors.map((mentor) => (
// //                 <FuturisticMentorCard key={mentor._id} mentor={mentor} />
// //               ))}
// //             </div>
// //           )}
// //         </section>

// //         {/* Success Stories Section */}
// //         <section>
// //           <div className="text-center mb-12">
// //             <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
// //               Success Stories
// //             </h2>
// //             <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
// //               Hear from our mentees about their transformative experiences and
// //               career achievements
// //             </p>
// //           </div>

// //           {isLoading ? (
// //             <Skeleton className="h-64 w-full rounded-3xl" />
// //           ) : dashboardData.topTestimonials.length > 0 ? (
// //             <div className="space-y-8">
// //               <InfiniteMovingCards
// //                 items={dashboardData.topTestimonials.slice(
// //                   0,
// //                   Math.ceil(dashboardData.topTestimonials.length / 2)
// //                 )}
// //                 direction="right"
// //                 speed="slow"
// //               />
// //               <InfiniteMovingCards
// //                 items={dashboardData.topTestimonials.slice(
// //                   Math.ceil(dashboardData.topTestimonials.length / 2)
// //                 )}
// //                 direction="left"
// //                 speed="fast"
// //               />
// //             </div>
// //           ) : (
// //             <div className="text-center py-16">
// //               <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
// //               <p className="text-gray-500 dark:text-gray-400">
// //                 No testimonials available yet.
// //               </p>
// //             </div>
// //           )}
// //         </section>

// //         {/* CTA Section */}
// //         <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 p-12 lg:p-16">
// //           <div className="absolute inset-0 bg-black/10"></div>
// //           <div className="relative z-10 text-center">
// //             <Brain className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
// //             <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
// //               Ready to Transform Your Career?
// //             </h2>
// //             <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
// //               Join thousands of professionals who have accelerated their careers
// //               through our mentorship platform
// //             </p>
// //             <div className="flex flex-col sm:flex-row gap-4 justify-center">
// //               <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold">
// //                 Find Your Mentor
// //               </Button>
// //               <Button
// //                 variant="outline"
// //                 className="border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-3 rounded-full"
// //               >
// //                 Browse Services
// //               </Button>
// //             </div>
// //           </div>
// //         </section>
// //       </div>
// //     </div>
// //   );
// // };

// // export default MenteeDashboard;
// import React, { useState, useEffect, useId } from "react";
// import {
//   Star,
//   Clock,
//   Users,
//   ChevronRight,
//   TrendingUp,
//   Award,
//   BookOpen,
//   MessageCircle,
//   Video,
//   Download,
//   Zap,
//   Target,
//   Globe,
//   ArrowRight,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { SparklesCore } from "@/components/ui/sparkles";
// import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
// import { getDashboardData } from "@/services/menteeService";
// import GradientBackgroundText from "@/components/mentee/AnimatedGradientText";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store/store";

// // Dummy data for fallback when no API data
// const dummyMentors = [
//   {
//     _id: "mentor1",
//     firstName: "Sarah",
//     lastName: "Chen",
//     bio: "Senior Product Manager at Google with 8+ years experience in tech leadership and product strategy.",
//     workRole: "Senior Product Manager",
//     work: "Google",
//     profilePicture:
//       "https://images.unsplash.com/photo-1494790108755-2616b612b789?q=80&w=400",
//     averageRating: 4.9,
//     bookingCount: 127,
//     expertise: ["Product Strategy", "Leadership"],
//   },
//   {
//     _id: "mentor2",
//     firstName: "David",
//     lastName: "Rodriguez",
//     bio: "Full Stack Engineer at Meta specializing in React, Node.js and cloud architecture.",
//     workRole: "Senior Software Engineer",
//     work: "Meta",
//     profilePicture:
//       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
//     averageRating: 4.8,
//     bookingCount: 89,
//     expertise: ["React", "Node.js"],
//   },
//   {
//     _id: "mentor3",
//     firstName: "Emily",
//     lastName: "Johnson",
//     bio: "UX Design Lead at Adobe with expertise in design systems and user research.",
//     workRole: "UX Design Lead",
//     work: "Adobe",
//     profilePicture:
//       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400",
//     averageRating: 4.9,
//     bookingCount: 156,
//     expertise: ["UX Design", "Design Systems"],
//   },
//   {
//     _id: "mentor4",
//     firstName: "Michael",
//     lastName: "Thompson",
//     bio: "Data Scientist at Netflix focusing on ML algorithms and data visualization.",
//     workRole: "Senior Data Scientist",
//     work: "Netflix",
//     profilePicture:
//       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400",
//     averageRating: 4.7,
//     bookingCount: 94,
//     expertise: ["Machine Learning", "Data Science"],
//   },
//   {
//     _id: "mentor5",
//     firstName: "Priya",
//     lastName: "Sharma",
//     bio: "Engineering Manager at Microsoft leading cross-functional teams in cloud technologies.",
//     workRole: "Engineering Manager",
//     work: "Microsoft",
//     profilePicture:
//       "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400",
//     averageRating: 4.8,
//     bookingCount: 103,
//     expertise: ["Team Leadership", "Cloud Tech"],
//   },
//   {
//     _id: "mentor6",
//     firstName: "James",
//     lastName: "Wilson",
//     bio: "DevOps Engineer at AWS with expertise in containerization and CI/CD pipelines.",
//     workRole: "DevOps Engineer",
//     work: "AWS",
//     profilePicture:
//       "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400",
//     averageRating: 4.6,
//     bookingCount: 78,
//     expertise: ["DevOps", "AWS"],
//   },
// ];

// const dummyServices = [
//   {
//     _id: "service1",
//     title: "1-on-1 Mentorship Session",
//     shortDescription:
//       "Get personalized guidance from industry experts in a private session tailored to your goals.",
//     type: "1-1Call",
//     amount: 299,
//     duration: 60,
//     mentorName: "Sarah Chen",
//     averageRating: 4.9,
//     bookingCount: 234,
//     icon: Video,
//   },
//   {
//     _id: "service2",
//     title: "Resume Review & Optimization",
//     shortDescription:
//       "Professional resume review with detailed feedback and optimization suggestions.",
//     type: "priorityDM",
//     amount: 149,
//     duration: 30,
//     mentorName: "David Rodriguez",
//     averageRating: 4.8,
//     bookingCount: 189,
//     icon: Award,
//   },
//   {
//     _id: "service3",
//     title: "Mock Interview Preparation",
//     shortDescription:
//       "Practice interviews with real-time feedback to boost your confidence and performance.",
//     type: "1-1Call",
//     amount: 199,
//     duration: 45,
//     mentorName: "Emily Johnson",
//     averageRating: 4.9,
//     bookingCount: 156,
//     icon: MessageCircle,
//   },
//   {
//     _id: "service4",
//     title: "Career Guidance Roadmap",
//     shortDescription:
//       "Comprehensive career planning and goal setting with actionable steps.",
//     type: "DigitalProducts",
//     amount: 99,
//     duration: 30,
//     mentorName: "Michael Thompson",
//     averageRating: 4.7,
//     bookingCount: 203,
//     icon: Target,
//   },
//   {
//     _id: "service5",
//     title: "Technical Skills Assessment",
//     shortDescription:
//       "Evaluate your technical abilities and get personalized improvement recommendations.",
//     type: "priorityDM",
//     amount: 179,
//     duration: 40,
//     mentorName: "Priya Sharma",
//     averageRating: 4.8,
//     bookingCount: 167,
//     icon: TrendingUp,
//   },
//   {
//     _id: "service6",
//     title: "Portfolio Review & Enhancement",
//     shortDescription:
//       "Get expert feedback on your portfolio with suggestions for improvement.",
//     type: "DigitalProducts",
//     amount: 129,
//     duration: 35,
//     mentorName: "James Wilson",
//     averageRating: 4.6,
//     bookingCount: 142,
//     icon: Globe,
//   },
// ];

// const dummyTestimonials = [
//   {
//     _id: "test1",
//     comment:
//       "The mentorship completely transformed my career trajectory. I landed my dream job at Google within 3 months!",
//     rating: 5,
//     menteeId: {
//       firstName: "Alex",
//       lastName: "Kumar",
//       profilePicture:
//         "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
//     },
//     serviceId: { title: "Career Guidance" },
//   },
//   {
//     _id: "test2",
//     comment:
//       "Amazing mock interview sessions that prepared me perfectly for real interviews. Highly recommended!",
//     rating: 5,
//     menteeId: {
//       firstName: "Maria",
//       lastName: "Garcia",
//       profilePicture:
//         "https://images.unsplash.com/photo-1494790108755-2616b612b789?q=80&w=200",
//     },
//     serviceId: { title: "Mock Interview" },
//   },
//   {
//     _id: "test3",
//     comment:
//       "The resume review was incredibly detailed and helped me get 3x more interview calls.",
//     rating: 5,
//     menteeId: {
//       firstName: "John",
//       lastName: "Smith",
//       profilePicture:
//         "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200",
//     },
//     serviceId: { title: "Resume Review" },
//   },
//   {
//     _id: "test4",
//     comment:
//       "The technical guidance helped me level up my skills and transition into a senior role.",
//     rating: 4,
//     menteeId: {
//       firstName: "Lisa",
//       lastName: "Wong",
//       profilePicture:
//         "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
//     },
//     serviceId: { title: "Technical Skills" },
//   },
//   {
//     _id: "test5",
//     comment:
//       "Portfolio feedback was spot-on and helped me showcase my work more effectively.",
//     rating: 5,
//     menteeId: {
//       firstName: "Carlos",
//       lastName: "Mendez",
//       profilePicture:
//         "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
//     },
//     serviceId: { title: "Portfolio Review" },
//   },
//   {
//     _id: "test6",
//     comment:
//       "The 1-on-1 sessions provided personalized insights that I couldn't find anywhere else.",
//     rating: 5,
//     menteeId: {
//       firstName: "Aisha",
//       lastName: "Patel",
//       profilePicture:
//         "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200",
//     },
//     serviceId: { title: "1-on-1 Session" },
//   },
//   {
//     _id: "test7",
//     comment:
//       "Career roadmap service gave me clear direction and actionable steps for my goals.",
//     rating: 4,
//     menteeId: {
//       firstName: "Robert",
//       lastName: "Lee",
//       profilePicture:
//         "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=200",
//     },
//     serviceId: { title: "Career Roadmap" },
//   },
//   {
//     _id: "test8",
//     comment:
//       "Technical assessment was thorough and the improvement plan was incredibly valuable.",
//     rating: 5,
//     menteeId: {
//       firstName: "Sophie",
//       lastName: "Chen",
//       profilePicture:
//         "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200",
//     },
//     serviceId: { title: "Skills Assessment" },
//   },
//   {
//     _id: "test9",
//     comment:
//       "The mentorship program exceeded my expectations. Professional and highly effective.",
//     rating: 5,
//     menteeId: {
//       firstName: "Daniel",
//       lastName: "Brown",
//       profilePicture:
//         "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200",
//     },
//     serviceId: { title: "Mentorship Program" },
//   },
//   {
//     _id: "test10",
//     comment:
//       "Interview preparation was game-changing. Felt confident and prepared for every question.",
//     rating: 5,
//     menteeId: {
//       firstName: "Nina",
//       lastName: "Johansson",
//       profilePicture:
//         "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=200",
//     },
//     serviceId: { title: "Interview Prep" },
//   },
// ];

// // Service categories with icons and gradients
// const serviceCategories = [
//   {
//     title: "1-on-1 Mentorship",
//     description:
//       "Personal guidance sessions with industry experts tailored to your specific career goals and challenges.",
//     icon: Video,
//     gradient: "from-blue-500 to-cyan-500",
//     bgGradient: "from-blue-50 to-cyan-50",
//   },
//   {
//     title: "Resume & Portfolio Review",
//     description:
//       "Professional review and optimization of your resume and portfolio to stand out to employers.",
//     icon: Award,
//     gradient: "from-purple-500 to-pink-500",
//     bgGradient: "from-purple-50 to-pink-50",
//   },
//   {
//     title: "Mock Interviews",
//     description:
//       "Practice interviews with real-time feedback to build confidence and improve performance.",
//     icon: MessageCircle,
//     gradient: "from-green-500 to-emerald-500",
//     bgGradient: "from-green-50 to-emerald-50",
//   },
//   {
//     title: "Career Planning",
//     description:
//       "Strategic career guidance and roadmap creation to achieve your professional objectives.",
//     icon: Target,
//     gradient: "from-orange-500 to-red-500",
//     bgGradient: "from-orange-50 to-red-50",
//   },
//   {
//     title: "Skills Assessment",
//     description:
//       "Comprehensive evaluation of your technical and soft skills with improvement recommendations.",
//     icon: TrendingUp,
//     gradient: "from-indigo-500 to-purple-500",
//     bgGradient: "from-indigo-50 to-purple-50",
//   },
//   {
//     title: "Digital Resources",
//     description:
//       "Access to exclusive e-books, templates, and digital tools to accelerate your growth.",
//     icon: Download,
//     gradient: "from-teal-500 to-blue-500",
//     bgGradient: "from-teal-50 to-blue-50",
//   },
// ];

// // Grid Pattern Component
// export function GridPattern({ width, height, x, y, squares, ...props }: any) {
//   const patternId = useId();

//   return (
//     <svg aria-hidden="true" {...props}>
//       <defs>
//         <pattern
//           id={patternId}
//           width={width}
//           height={height}
//           patternUnits="userSpaceOnUse"
//           x={x}
//           y={y}
//         >
//           <path d={`M.5 ${height}V.5H${width}`} fill="none" />
//         </pattern>
//       </defs>
//       <rect
//         width="100%"
//         height="100%"
//         strokeWidth={0}
//         fill={`url(#${patternId})`}
//       />
//       {squares && (
//         <svg x={x} y={y} className="overflow-visible">
//           {squares.map(([x, y]: any) => (
//             <rect
//               strokeWidth="0"
//               key={`${x}-${y}`}
//               width={width + 1}
//               height={height + 1}
//               x={x * width}
//               y={y * height}
//             />
//           ))}
//         </svg>
//       )}
//     </svg>
//   );
// }

// // Grid Component
// export const Grid = ({
//   pattern,
//   size,
// }: {
//   pattern?: number[][];
//   size?: number;
// }) => {
//   const p = pattern ?? [
//     [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
//     [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
//     [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
//     [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
//     [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
//   ];
//   return (
//     <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
//       <div className="absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 from-zinc-100/30 to-zinc-300/30 dark:to-zinc-900/30 opacity-100">
//         <GridPattern
//           width={size ?? 20}
//           height={size ?? 20}
//           x="-12"
//           y="4"
//           squares={p}
//           className="absolute inset-0 h-full w-full mix-blend-overlay dark:fill-white/10 dark:stroke-white/10 stroke-black/10 fill-black/10"
//         />
//       </div>
//     </div>
//   );
// };

// // Enhanced Mentor Card Component
// const ModernMentorCard = ({ mentor }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   const getBadge = () => {
//     if (mentor.averageRating >= 4.8)
//       return { text: "Top Rated", color: "from-yellow-500 to-orange-500" };
//     if (mentor.bookingCount > 100)
//       return { text: "Popular", color: "from-blue-500 to-indigo-500" };
//     return { text: "Verified", color: "from-green-500 to-emerald-500" };
//   };

//   const badge = getBadge();

//   return (
//     <div
//       className={`group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 ${
//         isHovered ? "transform -translate-y-2 scale-[1.02]" : ""
//       }`}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Animated background gradient */}
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

//       {/* Header with profile and badge */}
//       <div className="relative p-6 pb-4">
//         <div className="flex items-start justify-between mb-4">
//           <div className="relative">
//             <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white dark:border-gray-700 shadow-lg">
//               <img
//                 src={mentor.profilePicture || "/default-avatar.png"}
//                 alt={`${mentor.firstName} ${mentor.lastName}`}
//                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//               />
//             </div>
//             <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
//           </div>
//           <div
//             className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${badge.color} shadow-lg`}
//           >
//             {badge.text}
//           </div>
//         </div>

//         <div>
//           <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
//             {mentor.firstName} {mentor.lastName}
//           </h3>
//           <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
//             {mentor.workRole}
//           </p>
//           <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
//             @ {mentor.work}
//           </p>
//         </div>
//       </div>

//       {/* Bio */}
//       <div className="px-6 pb-4">
//         <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
//           {mentor.bio}
//         </p>
//       </div>

//       {/* Stats */}
//       <div className="px-6 pb-6">
//         <div className="flex items-center justify-between text-sm">
//           <div className="flex items-center space-x-1">
//             <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//             <span className="font-medium text-gray-900 dark:text-white">
//               {mentor.averageRating?.toFixed(1) || "4.8"}
//             </span>
//           </div>
//           <div className="text-gray-500 dark:text-gray-400">
//             {mentor.bookingCount || 0} sessions
//           </div>
//         </div>

//         <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
//           View Profile
//           <ArrowRight className="w-4 h-4 ml-2" />
//         </Button>
//       </div>
//     </div>
//   );
// };

// // Enhanced Service Card Component
// const ModernServiceCard = ({ service }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const IconComponent = service.icon || BookOpen;

//   const getTypeColor = (type) => {
//     switch (type) {
//       case "1-1Call":
//         return "from-blue-500 to-cyan-500";
//       case "priorityDM":
//         return "from-purple-500 to-pink-500";
//       case "DigitalProducts":
//         return "from-green-500 to-emerald-500";
//       default:
//         return "from-gray-500 to-gray-600";
//     }
//   };

//   return (
//     <div
//       className={`group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 ${
//         isHovered ? "transform -translate-y-2 scale-[1.02]" : ""
//       }`}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Animated background */}
//       <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

//       {/* Header */}
//       <div className="relative p-6 pb-4">
//         <div className="flex items-start justify-between mb-4">
//           <div
//             className={`p-3 rounded-2xl bg-gradient-to-r ${getTypeColor(
//               service.type
//             )} shadow-lg`}
//           >
//             <IconComponent className="w-6 h-6 text-white" />
//           </div>
//           <div className="text-right">
//             <div className="text-2xl font-bold text-gray-900 dark:text-white">
//               ${service.amount}
//             </div>
//             <div className="text-xs text-gray-500 dark:text-gray-400">
//               {service.duration}min session
//             </div>
//           </div>
//         </div>

//         <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
//           {service.title}
//         </h3>
//         <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
//           {service.shortDescription}
//         </p>
//       </div>

//       {/* Stats */}
//       <div className="px-6 pb-6">
//         <div className="flex items-center justify-between text-sm mb-4">
//           <div className="flex items-center space-x-1">
//             <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//             <span className="font-medium text-gray-900 dark:text-white">
//               {service.averageRating?.toFixed(1) || "4.8"}
//             </span>
//           </div>
//           <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
//             <Users className="w-4 h-4" />
//             <span>{service.bookingCount || 0} booked</span>
//           </div>
//         </div>

//         <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
//           Book Session
//           <Zap className="w-4 h-4 ml-2" />
//         </Button>
//       </div>
//     </div>
//   );
// };

// // Service Category Card
// const ServiceCategoryCard = ({ category }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const IconComponent = category.icon;

//   return (
//     <div
//       className={`group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 transition-all duration-500 hover:shadow-xl ${
//         isHovered ? "transform -translate-y-1" : ""
//       }`}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <Grid size={20} />

//       <div className="relative p-6">
//         <div
//           className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${category.gradient} mb-4 shadow-lg`}
//         >
//           <IconComponent className="w-6 h-6 text-white" />
//         </div>

//         <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
//           {category.title}
//         </h3>
//         <p className="text-sm text-gray-600 dark:text-gray-300">
//           {category.description}
//         </p>
//       </div>
//     </div>
//   );
// };

// // Enhanced Testimonial Card for Infinite Scroll
// const TestimonialCard = ({ testimonial }) => {
//   return (
//     <div className="flex-shrink-0 w-80 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
//       <div className="flex items-start space-x-4 mb-4">
//         <img
//           src={testimonial.menteeId?.profilePicture || "/default-avatar.png"}
//           alt={`${testimonial.menteeId?.firstName} ${testimonial.menteeId?.lastName}`}
//           className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
//         />
//         <div className="flex-1">
//           <h4 className="font-semibold text-gray-900 dark:text-white">
//             {testimonial.menteeId?.firstName} {testimonial.menteeId?.lastName}
//           </h4>
//           <p className="text-sm text-blue-600 dark:text-blue-400">
//             {testimonial.serviceId?.title}
//           </p>
//         </div>
//         <div className="flex">
//           {[...Array(5)].map((_, i) => (
//             <Star
//               key={i}
//               className={`w-4 h-4 ${
//                 i < (testimonial.rating || 5)
//                   ? "fill-yellow-400 text-yellow-400"
//                   : "text-gray-300"
//               }`}
//             />
//           ))}
//         </div>
//       </div>
//       <blockquote className="text-gray-600 dark:text-gray-300 text-sm italic">
//         "{testimonial.comment}"
//       </blockquote>
//     </div>
//   );
// };

// // Infinite Moving Cards Component
// const InfiniteMovingCards = ({
//   items,
//   direction = "right",
//   speed = "normal",
// }) => {
//   const animationDuration =
//     speed === "fast" ? "15s" : speed === "slow" ? "30s" : "20s";

//   return (
//     <div className="relative overflow-hidden w-full">
//       <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-gray-50 dark:from-gray-950 to-transparent"></div>
//       <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-gray-50 dark:from-gray-950 to-transparent"></div>

//       <div
//         className="flex gap-6 py-4"
//         style={{
//           animation: `scroll-${direction} ${animationDuration} linear infinite`,
//         }}
//       >
//         {[...items, ...items].map((item, idx) => (
//           <TestimonialCard key={idx} testimonial={item} />
//         ))}
//       </div>

//       <style>{`
//         @keyframes scroll-right {
//           from { transform: translateX(0); }
//           to { transform: translateX(-50%); }
//         }
//         @keyframes scroll-left {
//           from { transform: translateX(-50%); }
//           to { transform: translateX(0); }
//         }
//       `}</style>
//     </div>
//   );
// };

// // Main Dashboard Component
// const MenteeDashboard: React.FC = () => {
//   const [dashboardData, setDashboardData] = useState<{
//     topServices: any[];
//     topMentors: any[];
//     topTestimonials: any[];
//   }>({ topServices: [], topMentors: [], topTestimonials: [] });
//   const [isLoading, setIsLoading] = useState(true);
//   const { user, error, loading } = useSelector(
//     (state: RootState) => state.user
//   );

//   const placeholders = [
//     "Search for mentors by expertise...",
//     "Find specific services...",
//     "Explore career guidance...",
//     "Discover interview prep...",
//     "Look for resume reviews...",
//   ];

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setIsLoading(true);
//         const data = await getDashboardData();
//         setDashboardData(data);
//       } catch (err: any) {
//         console.error("Dashboard data fetch error:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchDashboardData();
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     console.log(e.target.value);
//   };

//   const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log("Search submitted");
//   };

//   // Determine data to display (API data or fallback to dummy data)
//   const displayMentors =
//     dashboardData.topMentors.length > 0
//       ? dashboardData.topMentors.slice(0, 6)
//       : dummyMentors;

//   const displayServices =
//     dashboardData.topServices.length > 0
//       ? dashboardData.topServices.slice(0, 6)
//       : dummyServices;

//   const displayTestimonials =
//     dashboardData.topTestimonials.length > 0
//       ? dashboardData.topTestimonials.slice(0, 20)
//       : dummyTestimonials;

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
//       {/* Hero Section */}
//       <div className="relative">
//         <div className="h-[40rem] w-full bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-center overflow-hidden rounded-none md:rounded-3xl mx-0 md:mx-6 mb-8">
//           {/* Background Effects */}
//           <div className="absolute inset-0">
//             <SparklesCore
//               background="transparent"
//               minSize={0.4}
//               maxSize={1}
//               particleDensity={800}
//               className="w-full h-full"
//               particleColor="#FFFFFF"
//             />
//           </div>

//           {/* Gradient Overlays */}
//           <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
//           <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
//           <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent h-[5px] w-1/4 blur-sm" />
//           <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent h-px w-1/4" />

//           {/* Content */}
//           <div className="relative z-20 text-center">
//             <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan-100 mb-6">
//               MentorONE
//             </h1>
//             <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto px-6">
//               Connect with industry experts, accelerate your career, and unlock
//               your potential with personalized mentorship.
//             </p>

//             {/* Search */}
//             <div className="mb-8">
//               <PlaceholdersAndVanishInput
//                 placeholders={placeholders}
//                 onChange={handleChange}
//                 onSubmit={onSubmit}
//               />
//             </div>

//             {/* CTA Button */}
//             <GradientBackgroundText className="font-semibold px-8 py-3 text-lg">
//               Start Your Journey
//             </GradientBackgroundText>
//           </div>

//           {/* Bottom Mask */}
//           <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-6 space-y-16">
//         {/* Service Categories Section */}
//         <section>
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
//               Explore Our{" "}
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//                 Services
//               </span>
//             </h2>
//             <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
//               Comprehensive mentorship services designed to accelerate your
//               career growth and professional development.
//             </p>
//           </div>

//           {isLoading ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {[...Array(6)].map((_, idx) => (
//                 <Skeleton key={idx} className="h-48 w-full rounded-3xl" />
//               ))}
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {serviceCategories.map((category, idx) => (
//                 <ServiceCategoryCard key={idx} category={category} />
//               ))}
//             </div>
//           )}
//         </section>

//         {/* Top Services Section */}
//         <section>
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//                 Popular{" "}
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
//                   Services
//                 </span>
//               </h2>
//               <p className="text-gray-600 dark:text-gray-300">
//                 Most booked services by our community
//               </p>
//             </div>
//             <Button
//               variant="outline"
//               className="hidden md:flex items-center space-x-2 border-gray-300 dark:border-gray-600"
//             >
//               <span>View All</span>
//               <ArrowRight className="w-4 h-4" />
//             </Button>
//           </div>

//           {isLoading ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {[...Array(6)].map((_, idx) => (
//                 <Skeleton key={idx} className="h-80 w-full rounded-3xl" />
//               ))}
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {displayServices.map((service) => (
//                 <ModernServiceCard key={service._id} service={service} />
//               ))}
//             </div>
//           )}
//         </section>

//         {/* Top Mentors Section */}
//         <section>
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//                 Expert{" "}
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
//                   Mentors
//                 </span>
//               </h2>
//               <p className="text-gray-600 dark:text-gray-300">
//                 Connect with industry leaders and experienced professionals
//               </p>
//             </div>
//             <Button
//               variant="outline"
//               className="hidden md:flex items-center space-x-2 border-gray-300 dark:border-gray-600"
//             >
//               <span>View All</span>
//               <ArrowRight className="w-4 h-4" />
//             </Button>
//           </div>

//           {isLoading ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {[...Array(6)].map((_, idx) => (
//                 <Skeleton key={idx} className="h-96 w-full rounded-3xl" />
//               ))}
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {displayMentors.map((mentor) => (
//                 <ModernMentorCard key={mentor._id} mentor={mentor} />
//               ))}
//             </div>
//           )}
//         </section>
//       </div>

//       {/* Testimonials Section */}
//       <section className="py-16 mt-16 bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
//             Success{" "}
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
//               Stories
//             </span>
//           </h2>
//           <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
//             Hear from our community members who achieved their career goals
//             through mentorship.
//           </p>
//         </div>

//         {isLoading ? (
//           <div className="space-y-8">
//             <Skeleton className="h-40 w-full max-w-6xl mx-auto" />
//             <Skeleton className="h-40 w-full max-w-6xl mx-auto" />
//           </div>
//         ) : (
//           <div className="space-y-8">
//             {/* First row - right direction */}
//             <InfiniteMovingCards
//               items={displayTestimonials.slice(
//                 0,
//                 Math.ceil(displayTestimonials.length / 2)
//               )}
//               direction="right"
//               speed="slow"
//             />
//             {/* Second row - left direction */}
//             <InfiniteMovingCards
//               items={displayTestimonials.slice(
//                 Math.ceil(displayTestimonials.length / 2)
//               )}
//               direction="left"
//               speed="fast"
//             />
//           </div>
//         )}
//       </section>

//       {/* Call to Action Section */}
//       <section className="py-20">
//         <div className="max-w-4xl mx-auto text-center px-6">
//           <div className="relative">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-lg opacity-20"></div>
//             <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl p-12">
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
//                 Ready to Transform Your Career?
//               </h2>
//               <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
//                 Join thousands of professionals who have accelerated their
//                 careers through personalized mentorship. Start your journey
//                 today.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg shadow-xl">
//                   Find Your Mentor
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="border-gray-300 dark:border-gray-600 px-8 py-3 text-lg"
//                 >
//                   Browse Services
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default MenteeDashboard;
import React, { useState, useEffect, useId } from "react";
import {
  Star,
  Clock,
  Users,
  ChevronRight,
  TrendingUp,
  Award,
  BookOpen,
  MessageCircle,
  Video,
  FileText,
  Zap,
  Target,
  Trophy,
  Play,
  Calendar,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// Enhanced Grid Pattern Component
export function GridPattern({ width, height, x, y, squares, ...props }) {
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
          {squares.map(([x, y], idx) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}-${idx}`}
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

// Enhanced Grid Component
export const Grid = ({ pattern, size }) => {
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

// Sparkles Component
const SparklesCore = ({
  background,
  minSize,
  maxSize,
  particleDensity,
  className,
  particleColor,
}) => {
  return (
    <div className={className}>
      <div className="absolute inset-0 opacity-30">
        {[...Array(Math.floor(particleDensity / 10))].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * (maxSize - minSize) + minSize}px`,
              height: `${Math.random() * (maxSize - minSize) + minSize}px`,
              backgroundColor: particleColor,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Animated Background Text Component
const GradientBackgroundText = ({ children, className }) => {
  return (
    <button
      className={`relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 ${className}`}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl">
        {children}
      </span>
    </button>
  );
};

// Search Input Component
const PlaceholdersAndVanishInput = ({ placeholders, onChange, onSubmit }) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  return (
    <form onSubmit={onSubmit} className="relative w-full max-w-xl mx-auto">
      <input
        onChange={onChange}
        placeholder={placeholders[currentPlaceholder]}
        className="w-full h-12 pl-6 pr-12 text-white bg-zinc-800 border border-zinc-700 rounded-full placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none transition-all duration-300"
        type="text"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
      >
        <ArrowRight className="h-4 w-4 text-white" />
      </button>
    </form>
  );
};

// Service Type Icons
const getServiceIcon = (type) => {
  const iconMap = {
    "1-1Call": Video,
    DigitalProducts: BookOpen,
    priorityDM: MessageCircle,
    MockInterview: Users,
    ResumeReview: FileText,
    CareerGuidance: Target,
    ProjectGuidance: Trophy,
    InternshipPrep: Award,
  };
  return iconMap[type] || Zap;
};

// Enhanced Service Card Component
const ModernServiceCard = ({ service }) => {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = getServiceIcon(service.type);

  return (
    <div
      className={`relative group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 ${
        isHovered ? "transform -translate-y-2 scale-[1.02]" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {service.title}
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                {service.type.replace(/([A-Z])/g, " $1").trim()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{service.amount}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              per session
            </div>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {service.shortDescription ||
            "Transform your career with expert guidance and personalized mentorship."}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {service.duration || "60"} min
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {service.bookingCount || 0} booked
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {service.averageRating || "4.8"}
            </span>
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg group-hover:shadow-blue-500/25">
          <Play className="w-4 h-4" />
          <span>Book Session</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

// Enhanced Mentor Card Component
const ModernMentorCard = ({ mentor }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getBadgeInfo = () => {
    const rating = mentor.averageRating || 4.8;
    const bookings = mentor.bookingCount || 0;

    if (rating >= 4.8)
      return { text: "Top Rated", color: "from-yellow-500 to-orange-500" };
    if (bookings > 50)
      return { text: "Popular", color: "from-blue-500 to-indigo-600" };
    return { text: "Featured", color: "from-purple-500 to-pink-500" };
  };

  const badge = getBadgeInfo();

  return (
    <div
      className={`relative group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 ${
        isHovered ? "transform -translate-y-2 scale-[1.02]" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header with Sparkles */}
      <div className="relative h-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={60}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />

        {/* Badge */}
        <div className="absolute top-4 right-4 z-20">
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg bg-gradient-to-r ${badge.color}`}
          >
            {badge.text}
          </div>
        </div>

        {/* Profile Image */}
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 z-20">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-xl group-hover:border-yellow-400 transition-colors duration-300">
            <img
              src={
                mentor.profilePicture ||
                mentor.profileImage ||
                `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`
              }
              alt={mentor.name || `${mentor.firstName} ${mentor.lastName}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-zinc-800" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative pt-12 pb-6 px-6">
        {/* Rating Badge */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-2">
          <div className="flex items-center px-3 py-1 bg-yellow-400 rounded-full text-sm font-bold text-gray-900 shadow-lg">
            <Star className="w-4 h-4 mr-1 fill-gray-900" />
            {(mentor.averageRating || 4.8).toFixed(1)}
          </div>
        </div>

        <div className="text-center mb-4">
          <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1">
            {mentor.name || `${mentor.firstName} ${mentor.lastName}`}
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">
              {mentor.workRole || "Senior Professional"}
            </span>
            {mentor.work && (
              <>
                <span className="mx-1">@</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  {mentor.work}
                </span>
              </>
            )}
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm text-center mb-4 line-clamp-2">
          {mentor.bio ||
            mentor.mentorId?.bio ||
            "Experienced professional ready to guide your career journey."}
        </p>

        <div className="flex items-center justify-center space-x-6 mb-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{mentor.bookingCount || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Available</span>
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg group-hover:shadow-indigo-500/25">
          <MessageCircle className="w-4 h-4" />
          <span>Connect Now</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

// Enhanced Testimonial Card Component
const ModernTestimonialCard = ({ testimonial }) => {
  return (
    <div className="flex-shrink-0 w-80 mx-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative">
            <img
              src={
                testimonial.menteeId?.profilePicture ||
                `https://images.unsplash.com/photo-150${Math.floor(
                  Math.random() * 9
                )}?w=60&h=60&fit=crop&crop=face`
              }
              alt={`${testimonial.menteeId?.firstName} ${testimonial.menteeId?.lastName}`}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-zinc-700"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 dark:text-white">
              {testimonial.menteeId?.firstName} {testimonial.menteeId?.lastName}
            </h4>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {testimonial.serviceId?.title}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            {[...Array(Math.floor(testimonial.rating || 5))].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
        </div>

        <blockquote className="text-gray-700 dark:text-gray-300 text-sm italic mb-4 line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
          "{testimonial.comment}"
        </blockquote>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Verified Review</span>
          <span>{new Date(testimonial.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

// Infinite Moving Cards Component
const InfiniteMovingCards = ({
  items,
  direction = "right",
  speed = "normal",
}) => {
  const containerStyles = {
    "--animation-duration":
      speed === "fast" ? "15s" : speed === "slow" ? "25s" : "35s",
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-gray-50 dark:from-zinc-950 to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-gray-50 dark:from-zinc-950 to-transparent" />

      <div
        className="flex py-6"
        style={{
          ...containerStyles,
          animation: `scroll-${direction} var(--animation-duration) linear infinite`,
        }}
      >
        {[...items, ...items].map((item, idx) => (
          <ModernTestimonialCard
            key={`${item._id}-${idx}`}
            testimonial={item}
          />
        ))}
      </div>

      <style>{`
        @keyframes scroll-right {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes scroll-left {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

// Loading Skeleton Component
const LoadingSkeleton = ({ className }) => (
  <div
    className={`animate-pulse bg-gray-200 dark:bg-zinc-800 rounded-xl ${className}`}
  />
);

// Main Dashboard Component
const MenteeDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    topServices: [],
    topMentors: [],
    topTestimonials: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Dummy data for fallback
  const dummyServices = [
    {
      _id: "1",
      title: "1-on-1 Mentoring Call",
      type: "1-1Call",
      amount: 500,
      shortDescription:
        "Personalized career guidance and strategic planning session",
      duration: 60,
      bookingCount: 45,
      averageRating: 4.9,
    },
    {
      _id: "2",
      title: "Resume Review & Optimization",
      type: "ResumeReview",
      amount: 200,
      shortDescription:
        "Professional resume analysis with improvement recommendations",
      duration: 30,
      bookingCount: 78,
      averageRating: 4.8,
    },
    {
      _id: "3",
      title: "Mock Interview Session",
      type: "MockInterview",
      amount: 300,
      shortDescription: "Practice interviews with real-time feedback and tips",
      duration: 45,
      bookingCount: 62,
      averageRating: 4.7,
    },
    {
      _id: "4",
      title: "Career Strategy Guide",
      type: "DigitalProducts",
      amount: 150,
      shortDescription: "Comprehensive digital guide for career advancement",
      duration: 0,
      bookingCount: 156,
      averageRating: 4.6,
    },
    {
      _id: "5",
      title: "Priority DM Support",
      type: "priorityDM",
      amount: 100,
      shortDescription: "Direct messaging access for quick career questions",
      duration: 0,
      bookingCount: 89,
      averageRating: 4.8,
    },
    {
      _id: "6",
      title: "Project Guidance",
      type: "ProjectGuidance",
      amount: 400,
      shortDescription: "Technical project review and improvement suggestions",
      duration: 90,
      bookingCount: 34,
      averageRating: 4.9,
    },
  ];

  const dummyMentors = [
    {
      _id: "1",
      name: "Sarah Johnson",
      workRole: "Senior Software Engineer",
      work: "Google",
      bio: "Helping developers advance their careers in tech with 8+ years of experience",
      averageRating: 4.9,
      bookingCount: 127,
    },
    {
      _id: "2",
      name: "Michael Chen",
      workRole: "Product Manager",
      work: "Microsoft",
      bio: "Product strategy expert guiding professionals in product management",
      averageRating: 4.8,
      bookingCount: 98,
    },
    {
      _id: "3",
      name: "Emily Rodriguez",
      workRole: "UX Design Lead",
      work: "Apple",
      bio: "Creative professional mentoring designers in user experience",
      averageRating: 4.9,
      bookingCount: 156,
    },
    {
      _id: "4",
      name: "David Kumar",
      workRole: "Data Scientist",
      work: "Amazon",
      bio: "Analytics expert helping professionals break into data science",
      averageRating: 4.7,
      bookingCount: 87,
    },
    {
      _id: "5",
      name: "Lisa Wang",
      workRole: "Engineering Manager",
      work: "Netflix",
      bio: "Leadership coach for technical professionals and aspiring managers",
      averageRating: 4.8,
      bookingCount: 112,
    },
    {
      _id: "6",
      name: "James Thompson",
      workRole: "Startup Founder",
      work: "TechVentures",
      bio: "Entrepreneur guiding professionals in startup and business strategy",
      averageRating: 4.6,
      bookingCount: 67,
    },
  ];

  const dummyTestimonials = [
    {
      _id: "1",
      menteeId: { firstName: "Alex", lastName: "Parker", profilePicture: null },
      serviceId: { title: "1-on-1 Mentoring" },
      comment:
        "Incredible experience! My mentor helped me land my dream job at a top tech company. The personalized guidance was exactly what I needed.",
      rating: 5,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "2",
      menteeId: {
        firstName: "Priya",
        lastName: "Sharma",
        profilePicture: null,
      },
      serviceId: { title: "Resume Review" },
      comment:
        "The resume review completely transformed my profile. I started getting interview calls within a week of implementing the suggestions.",
      rating: 5,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "3",
      menteeId: { firstName: "John", lastName: "Davis", profilePicture: null },
      serviceId: { title: "Mock Interview" },
      comment:
        "The mock interview sessions boosted my confidence tremendously. I felt fully prepared for my actual interviews.",
      rating: 5,
      createdAt: new Date().toISOString(),
    },
  ];

  const placeholders = [
    "Search for mentors...",
    "Find top services...",
    "Explore career guidance...",
    "Discover new opportunities...",
    "Connect with experts...",
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Simulate API call - replace with actual API call
        setTimeout(() => {
          setDashboardData({
            topServices: [],
            topMentors: [],
            topTestimonials: [],
          });
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleChange = (e) => {
    console.log(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };

  // Determine which data to display
  const displayServices =
    dashboardData.topServices.length > 0
      ? dashboardData.topServices.slice(0, 6)
      : dummyServices;
  const displayMentors =
    dashboardData.topMentors.length > 0
      ? dashboardData.topMentors.slice(0, 6)
      : dummyMentors;
  const displayTestimonials =
    dashboardData.topTestimonials.length > 0
      ? dashboardData.topTestimonials
      : dummyTestimonials;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Hero Section */}
      <div className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={100}
          className="w-full h-full absolute inset-0"
          particleColor="#FFFFFF"
        />

        <div className="relative z-20 text-center px-4">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm font-medium">
              Welcome to MentorONE
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-100">
            MentorONE
          </h1>

          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Transform your career with personalized mentorship from industry
            experts
          </p>

          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />

          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 mt-12">
            <GradientBackgroundText className="font-semibold px-8 py-3">
              Get Started Now
            </GradientBackgroundText>
            <button className="px-8 py-3 border border-white/20 text-white rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
              Learn More
            </button>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-8 text-white/80 z-20">
          <div className="text-center">
            <div className="text-2xl font-bold">500+</div>
            <div className="text-sm">Expert Mentors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">10k+</div>
            <div className="text-sm">Success Stories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">4.9</div>
            <div className="text-sm">Average Rating</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Services Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full px-4 py-2 mb-4">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Popular Services</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Accelerate Your Career Growth
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose from our comprehensive range of mentorship services
              designed to help you achieve your professional goals faster.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <LoadingSkeleton key={idx} className="h-80" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayServices.map((service) => (
                <ModernServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
              <span>View All Services</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Mentors Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full px-4 py-2 mb-4">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">Top Mentors</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Learn from Industry Leaders
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Connect with experienced professionals from top companies who are
              passionate about helping others succeed.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <LoadingSkeleton key={idx} className="h-96" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayMentors.map((mentor) => (
                <ModernMentorCard key={mentor._id} mentor={mentor} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
              <span>Browse All Mentors</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <SparklesCore
              background="transparent"
              minSize={0.3}
              maxSize={0.8}
              particleDensity={50}
              className="w-full h-full absolute inset-0"
              particleColor="#FFFFFF"
            />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Trusted by Professionals Worldwide
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    500+
                  </div>
                  <div className="text-blue-100">Expert Mentors</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    10k+
                  </div>
                  <div className="text-blue-100">Sessions Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
                  <div className="text-blue-100">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    4.9★
                  </div>
                  <div className="text-blue-100">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full px-4 py-2 mb-4">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">Platform Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and resources
              you need for effective mentorship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Video,
                title: "1-on-1 Video Calls",
                description:
                  "Face-to-face mentoring sessions with HD video quality and screen sharing capabilities.",
              },
              {
                icon: MessageCircle,
                title: "Priority Messaging",
                description:
                  "Direct access to your mentor through our secure messaging platform.",
              },
              {
                icon: FileText,
                title: "Resume Reviews",
                description:
                  "Professional resume analysis with detailed feedback and improvement suggestions.",
              },
              {
                icon: Users,
                title: "Mock Interviews",
                description:
                  "Practice interviews with real-time feedback to boost your confidence.",
              },
              {
                icon: BookOpen,
                title: "Digital Resources",
                description:
                  "Access to exclusive guides, templates, and learning materials.",
              },
              {
                icon: Trophy,
                title: "Career Tracking",
                description:
                  "Monitor your progress and celebrate milestones with detailed analytics.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-zinc-800 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Testimonials Section */}
      <section className="bg-white dark:bg-zinc-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-full px-4 py-2 mb-4">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Success Stories</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Mentees Say
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Real feedback from professionals who transformed their careers
              through our mentorship platform.
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-8">
              <LoadingSkeleton className="h-40 w-full" />
              <LoadingSkeleton className="h-40 w-full" />
            </div>
          ) : (
            <div className="space-y-8">
              <InfiniteMovingCards
                items={displayTestimonials.slice(
                  0,
                  Math.ceil(displayTestimonials.length / 2)
                )}
                direction="right"
                speed="slow"
              />
              <InfiniteMovingCards
                items={displayTestimonials.slice(
                  Math.ceil(displayTestimonials.length / 2)
                )}
                direction="left"
                speed="fast"
              />
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative">
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={80}
              className="w-full h-full absolute inset-0"
              particleColor="#FFFFFF"
            />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
                Join thousands of professionals who have accelerated their
                careers with personalized mentorship.
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                <button className="bg-white text-indigo-900 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-xl">
                  Start Your Journey
                </button>
                <button className="border border-white/20 text-white font-medium py-4 px-8 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                  Book a Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MenteeDashboard;
