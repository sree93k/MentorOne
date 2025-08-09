// import { useState, useEffect } from "react";
// import { ArrowLeft } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { useParams, useNavigate } from "react-router-dom";
// import { getTutorialById, getVideoUrl } from "@/services/menteeService";

// interface Episode {
//   _id: string;
//   episode: string;
//   title: string;
//   description: string;
//   videoUrl: string;
//   completed?: boolean;
// }

// interface Season {
//   _id: string;
//   season: string;
//   episodes: Episode[];
// }

// export default function VideoTutorialPage() {
//   const { id } = useParams<{ id: string }>();
//   const [tutorial, setTutorial] = useState<any>(null);
//   const [activeEpisode, setActiveEpisode] = useState<string | null>(null);
//   const [videoUrl, setVideoUrl] = useState<string>("");
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   // Function to extract S3 object key from full URL
//   const getS3Key = (url: string): string => {
//     console.log("getS3Key input:", url);
//     const bucketUrl = "https://mentorone-app.s3.ap-south-1.amazonaws.com/";
//     let key = url;
//     if (url.startsWith(bucketUrl)) {
//       key = url.replace(bucketUrl, "");
//     } else if (url.includes("/videos/")) {
//       // Handle cases where URL might be relative or malformed
//       key = url.split("/videos/").pop() || url;
//     }
//     // Remove any query parameters
//     key = key.split("?")[0];
//     console.log("getS3Key output:", key);
//     return key;
//   };

//   useEffect(() => {
//     const fetchTutorial = async () => {
//       if (!id) {
//         setError("Tutorial ID is missing");
//         return;
//       }
//       try {
//         const tutorialData = await getTutorialById(id);
//         const seasons = tutorialData.exclusiveContent.map((season: any) => ({
//           ...season,
//           episodes: season.episodes.map((ep: any, index: number) => ({
//             ...ep,
//             completed: index < 2,
//           })),
//         }));
//         setTutorial({ ...tutorialData, exclusiveContent: seasons });
//         if (seasons[0]?.episodes[0]) {
//           setActiveEpisode(seasons[0].episodes[0]._id);
//           const s3Key = getS3Key(seasons[0].episodes[0].videoUrl);
//           console.log("Fetching video URL for key:", s3Key);
//           const url = await getVideoUrl(s3Key);
//           console.log("Received video URL:", url);
//           setVideoUrl(url);
//         }
//         setError(null);
//       } catch (err: any) {
//         console.error("Failed to fetch tutorial:", err);
//         setError(err.message || "Failed to load tutorial");
//       }
//     };
//     fetchTutorial();
//   }, [id]);

//   const handleEpisodeClick = async (episode: Episode) => {
//     setActiveEpisode(episode._id);
//     try {
//       const s3Key = getS3Key(episode.videoUrl);
//       console.log("Fetching video URL for key:", s3Key);
//       const url = await getVideoUrl(s3Key);
//       console.log("Received video URL:", url);
//       setVideoUrl(url);
//     } catch (err: any) {
//       console.error("Failed to load video:", err);
//       setError(err.message || "Failed to load video");
//     }
//   };

//   if (error) {
//     return (
//       <div className="flex min-h-screen justify-center items-center">
//         <p className="text-red-500">{error}</p>
//       </div>
//     );
//   }

//   if (!tutorial) {
//     return (
//       <div className="flex min-h-screen justify-center items-center">
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   const seasons: Season[] = tutorial.exclusiveContent;
//   const completedCount = seasons
//     .flatMap((s: Season) => s.episodes)
//     .filter((e: Episode) => e.completed).length;
//   const totalCount = seasons.flatMap((s: Season) => s.episodes).length;
//   const progressPercentage = Math.round((completedCount / totalCount) * 100);

//   const activeEpisodeData = seasons
//     .flatMap((s: Season) => s.episodes)
//     .find((e: Episode) => e._id === activeEpisode);

//   return (
//     <div className="flex min-h-screen bg-white">
//       <div className="flex-1">
//         <main className="flex">
//           <div>
//             <Button
//               variant="ghost"
//               className="pl-0"
//               onClick={() => navigate(-1)}
//             >
//               <ArrowLeft className="h-7 w-7" />
//             </Button>
//           </div>
//           <div className="w-2/3 p-4">
//             <div className="aspect-video bg-gray-900 mb-4 relative">
//               {videoUrl ? (
//                 <video
//                   width="100%"
//                   height="100%"
//                   controls
//                   src={videoUrl}
//                   className="object-contain"
//                   preload="auto"
//                 >
//                   Your browser does not support the video tag.
//                 </video>
//               ) : (
//                 <p>Loading video...</p>
//               )}
//             </div>

//             <Tabs defaultValue="about" className="w-full">
//               <TabsList className="mb-4">
//                 <TabsTrigger value="about" className="font-bold">
//                   About
//                 </TabsTrigger>
//                 <TabsTrigger value="discuss">Discuss Doubt</TabsTrigger>
//               </TabsList>
//               <TabsContent value="about">
//                 <h2 className="text-2xl font-bold mb-4">
//                   {activeEpisodeData?.episode} | {activeEpisodeData?.title}
//                 </h2>
//                 <p className="mb-4">{activeEpisodeData?.description}</p>
//               </TabsContent>
//               <TabsContent value="discuss">
//                 <div className="p-4 bg-gray-100 rounded-lg">
//                   <h3 className="font-bold mb-2">Discussion Forum</h3>
//                   <p>Ask your doubts and discuss with other learners here.</p>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>

//           <div className="w-1/3 bg-gray-100 p-4">
//             <h2 className="text-2xl font-bold mb-2">{tutorial.title}</h2>
//             <div className="flex items-center gap-2 mb-4">
//               <div className="h-2 flex-1 bg-gray-300 rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-green-500 rounded-full"
//                   style={{ width: `${progressPercentage}%` }}
//                 />
//               </div>
//               <span className="text-sm font-medium">
//                 {progressPercentage} %
//               </span>
//             </div>
//             <p className="text-sm text-gray-600 mb-4">
//               {completedCount} of {totalCount} Completed
//             </p>

//             <Accordion
//               type="single"
//               collapsible
//               defaultValue="season-1"
//               className="w-full"
//             >
//               {seasons.map((season: Season) => (
//                 <AccordionItem key={season._id} value={season._id}>
//                   <AccordionTrigger className="font-bold">
//                     {season.season}
//                   </AccordionTrigger>
//                   <AccordionContent>
//                     <div className="space-y-2">
//                       {season.episodes.map((episode: Episode) => (
//                         <div
//                           key={episode._id}
//                           className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
//                             activeEpisode === episode._id ? "bg-white" : ""
//                           }`}
//                           onClick={() => handleEpisodeClick(episode)}
//                         >
//                           <div className="flex-shrink-0">
//                             <svg
//                               width="20"
//                               height="20"
//                               viewBox="0 0 24 24"
//                               fill="none"
//                               xmlns="http://www.w3.org/2000/svg"
//                             >
//                               <rect
//                                 width="24"
//                                 height="24"
//                                 rx="4"
//                                 fill="#F1F1F1"
//                               />
//                               {episode.completed ? (
//                                 <circle cx="12" cy="12" r="8" fill="#4CAF50" />
//                               ) : (
//                                 <path
//                                   d="M16 12L10 16.5V7.5L16 12Z"
//                                   fill="black"
//                                   stroke="black"
//                                   strokeWidth="1.5"
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                 />
//                               )}
//                             </svg>
//                           </div>
//                           <div>
//                             <div className="flex items-center gap-2">
//                               <span className="text-sm font-medium">
//                                 {episode.episode}
//                               </span>
//                               <span className="text-sm">|</span>
//                               <span className="text-sm">{episode.title}</span>
//                             </div>
//                           </div>
//                           {episode.completed && (
//                             <div className="ml-auto">
//                               <svg
//                                 width="16"
//                                 height="16"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 xmlns="http://www.w3.org/2000/svg"
//                               >
//                                 <path
//                                   d="M5 13L9 17L19 7"
//                                   stroke="#4CAF50"
//                                   strokeWidth="2"
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                 />
//                               </svg>
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </AccordionContent>
//                 </AccordionItem>
//               ))}
//             </Accordion>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Play,
  CheckCircle,
  Clock,
  BookOpen,
  MessageCircle,
  Users,
  BarChart3,
  Volume2,
  Settings,
  Maximize,
  Download,
  Share2,
  Star,
  Award,
  Target,
  Sparkles,
  Video,
  PlayCircle,
  PauseCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useParams, useNavigate } from "react-router-dom";
import { getTutorialById, getVideoUrl } from "@/services/menteeService";

interface Episode {
  _id: string;
  episode: string;
  title: string;
  description: string;
  videoUrl: string;
  completed?: boolean;
}

interface Season {
  _id: string;
  season: string;
  episodes: Episode[];
}

export default function VideoTutorialPage() {
  const { id } = useParams<{ id: string }>();
  const [tutorial, setTutorial] = useState<any>(null);
  const [activeEpisode, setActiveEpisode] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [hoveredEpisode, setHoveredEpisode] = useState<string | null>(null);
  const navigate = useNavigate();

  // Function to extract S3 object key from full URL
  const getS3Key = (url: string): string => {
    console.log("getS3Key input:", url);
    const bucketUrl = "https://mentorone-app.s3.ap-south-1.amazonaws.com/";
    let key = url;
    if (url.startsWith(bucketUrl)) {
      key = url.replace(bucketUrl, "");
    } else if (url.includes("/videos/")) {
      key = url.split("/videos/").pop() || url;
    }
    key = key.split("?")[0];
    console.log("getS3Key output:", key);
    return key;
  };

  useEffect(() => {
    const fetchTutorial = async () => {
      if (!id) {
        setError("Tutorial ID is missing");
        return;
      }
      try {
        const tutorialData = await getTutorialById(id);
        const seasons = tutorialData.exclusiveContent.map((season: any) => ({
          ...season,
          episodes: season.episodes.map((ep: any, index: number) => ({
            ...ep,
            completed: index < 2,
          })),
        }));
        setTutorial({ ...tutorialData, exclusiveContent: seasons });
        if (seasons[0]?.episodes[0]) {
          setActiveEpisode(seasons[0].episodes[0]._id);
          setIsVideoLoading(true);
          const s3Key = getS3Key(seasons[0].episodes[0].videoUrl);
          console.log("Fetching video URL for key:", s3Key);
          const url = await getVideoUrl(s3Key);
          console.log("Received video URL:", url);
          setVideoUrl(url);
          setIsVideoLoading(false);
        }
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch tutorial:", err);
        setError(err.message || "Failed to load tutorial");
        setIsVideoLoading(false);
      }
    };
    fetchTutorial();
  }, [id]);

  const handleEpisodeClick = async (episode: Episode) => {
    setActiveEpisode(episode._id);
    setIsVideoLoading(true);
    try {
      const s3Key = getS3Key(episode.videoUrl);
      console.log("Fetching video URL for key:", s3Key);
      const url = await getVideoUrl(s3Key);
      console.log("Received video URL:", url);
      setVideoUrl(url);
    } catch (err: any) {
      console.error("Failed to load video:", err);
      setError(err.message || "Failed to load video");
    } finally {
      setIsVideoLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Video className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Error Loading Tutorial
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={() => navigate(-1)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl"
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading tutorial...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const seasons: Season[] = tutorial.exclusiveContent;
  const completedCount = seasons
    .flatMap((s: Season) => s.episodes)
    .filter((e: Episode) => e.completed).length;
  const totalCount = seasons.flatMap((s: Season) => s.episodes).length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  const activeEpisodeData = seasons
    .flatMap((s: Season) => s.episodes)
    .find((e: Episode) => e._id === activeEpisode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Back Button */}
      <div className="relative z-10 -ml-6  ">
        <button
          className=" group flex h-12 w-12 items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-blue-600 hover:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8 -mt-10">
        {/* Header */}

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
          {/* Main Video Section */}
          <div className="lg:col-span-7 space-y-6">
            {/* Video Player Card */}
            <Card className="border-0 shadow-2xl bg-black rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video relative bg-black rounded-2xl overflow-hidden">
                  {isVideoLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                      <div className="text-center">
                        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-white font-medium">
                          Loading video...
                        </p>
                      </div>
                    </div>
                  ) : videoUrl ? (
                    <video
                      width="100%"
                      height="100%"
                      controls
                      src={videoUrl}
                      className="object-contain rounded-2xl"
                      preload="auto"
                      style={{ background: "#000" }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
                      <div className="text-center">
                        <PlayCircle className="w-24 h-24 text-white/50 mx-auto mb-4" />
                        <p className="text-white/70 font-medium">
                          Select an episode to start learning
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Video Controls & Info */}
            <Card className="border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                      <Video className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {activeEpisodeData?.episode} |{" "}
                        {activeEpisodeData?.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600">Episode Details</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="rounded-lg">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-lg">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <Tabs defaultValue="about" className="w-full">
                  <TabsList className="bg-gray-100 h-12 rounded-xl p-1">
                    <TabsTrigger
                      value="about"
                      className="rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      About
                    </TabsTrigger>
                    <TabsTrigger
                      value="discuss"
                      className="rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Discuss
                    </TabsTrigger>
                    <TabsTrigger
                      value="notes"
                      className="rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Notes
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="about" className="mt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          Episode Description
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {activeEpisodeData?.description ||
                            "No description available for this episode."}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                        <div className="text-center p-3 bg-purple-50 rounded-xl">
                          <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                          <p className="text-lg font-bold text-gray-900">
                            15 min
                          </p>
                          <p className="text-sm text-gray-600">Duration</p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-xl">
                          <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                          <p className="text-lg font-bold text-gray-900">
                            1.2k
                          </p>
                          <p className="text-sm text-gray-600">Views</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-xl">
                          <Star className="w-6 h-6 text-green-600 mx-auto mb-2" />
                          <p className="text-lg font-bold text-gray-900">4.8</p>
                          <p className="text-sm text-gray-600">Rating</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="discuss" className="mt-6">
                    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageCircle className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Discussion Forum
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Ask your doubts and discuss with other learners
                            here.
                          </p>
                          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Start Discussion
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="notes" className="mt-6">
                    <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Target className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Personal Notes
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Take notes while learning to remember key points.
                          </p>
                          <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-xl">
                            <Target className="w-4 h-4 mr-2" />
                            Add Notes
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Course Progress & Episodes */}
          <div className="lg:col-span-3">
            <div className="sticky top-8 space-y-6">
              {/* Course Progress Card */}
              <Card className="border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    {tutorial.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">
                          Progress
                        </span>
                        <span className="text-sm font-bold text-purple-600">
                          {progressPercentage}%
                        </span>
                      </div>
                      <Progress
                        value={progressPercentage}
                        className="h-3 bg-gray-200"
                      />
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {completedCount} of {totalCount} completed
                      </span>
                      <Badge className="bg-green-100 text-green-800 border-0">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-600">
                          {seasons.length}
                        </div>
                        <div className="text-xs text-gray-600">Seasons</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">
                          {totalCount}
                        </div>
                        <div className="text-xs text-gray-600">Episodes</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Episodes List */}
              <Card className="border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    Course Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue={seasons[0]?._id}
                    className="w-full space-y-2"
                  >
                    {seasons.map((season: Season) => (
                      <AccordionItem
                        key={season._id}
                        value={season._id}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <AccordionTrigger className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-3 hover:no-underline hover:from-purple-100 hover:to-blue-100 transition-all duration-200">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                              <Video className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-left">
                              <h4 className="font-bold text-gray-900 text-sm">
                                {season.season}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {season.episodes.length} episodes
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-2 py-2 bg-white">
                          <div className="space-y-1">
                            {season.episodes.map((episode: Episode) => (
                              <div
                                key={episode._id}
                                className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                  activeEpisode === episode._id
                                    ? "bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300"
                                    : hoveredEpisode === episode._id
                                    ? "bg-gray-50 border border-gray-200"
                                    : "hover:bg-gray-50"
                                }`}
                                onClick={() => handleEpisodeClick(episode)}
                                onMouseEnter={() =>
                                  setHoveredEpisode(episode._id)
                                }
                                onMouseLeave={() => setHoveredEpisode(null)}
                              >
                                {/* Episode Icon */}
                                <div
                                  className={`p-2 rounded-lg transition-all duration-200 ${
                                    episode.completed
                                      ? "bg-green-100"
                                      : activeEpisode === episode._id
                                      ? "bg-purple-200"
                                      : "bg-gray-100 group-hover:bg-purple-100"
                                  }`}
                                >
                                  {episode.completed ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : activeEpisode === episode._id ? (
                                    <PauseCircle className="w-4 h-4 text-purple-600" />
                                  ) : (
                                    <PlayCircle className="w-4 h-4 text-gray-500 group-hover:text-purple-600" />
                                  )}
                                </div>

                                {/* Episode Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1 mb-1">
                                    <span className="text-xs font-semibold text-gray-900">
                                      {episode.episode}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      •
                                    </span>
                                    <span className="text-xs text-gray-900 truncate">
                                      {episode.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    <span>15 min</span>
                                  </div>
                                </div>

                                {/* Status Indicator */}
                                {episode.completed && (
                                  <div className="flex-shrink-0">
                                    <Badge className="bg-green-100 text-green-700 border-0 text-xs px-2 py-1">
                                      Done
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
