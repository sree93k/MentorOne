import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const navigate = useNavigate();

  // Function to extract S3 object key from full URL
  const getS3Key = (url: string): string => {
    console.log("getS3Key input:", url);
    const bucketUrl = "https://mentorone-app.s3.ap-south-1.amazonaws.com/";
    let key = url;
    if (url.startsWith(bucketUrl)) {
      key = url.replace(bucketUrl, "");
    } else if (url.includes("/videos/")) {
      // Handle cases where URL might be relative or malformed
      key = url.split("/videos/").pop() || url;
    }
    // Remove any query parameters
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
          const s3Key = getS3Key(seasons[0].episodes[0].videoUrl);
          console.log("Fetching video URL for key:", s3Key);
          const url = await getVideoUrl(s3Key);
          console.log("Received video URL:", url);
          setVideoUrl(url);
        }
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch tutorial:", err);
        setError(err.message || "Failed to load tutorial");
      }
    };
    fetchTutorial();
  }, [id]);

  const handleEpisodeClick = async (episode: Episode) => {
    setActiveEpisode(episode._id);
    try {
      const s3Key = getS3Key(episode.videoUrl);
      console.log("Fetching video URL for key:", s3Key);
      const url = await getVideoUrl(s3Key);
      console.log("Received video URL:", url);
      setVideoUrl(url);
    } catch (err: any) {
      console.error("Failed to load video:", err);
      setError(err.message || "Failed to load video");
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <p>Loading...</p>
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
    <div className="flex min-h-screen bg-white">
      <div className="flex-1">
        <main className="flex">
          <div>
            <Button
              variant="ghost"
              className="pl-0"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-7 w-7" />
            </Button>
          </div>
          <div className="w-2/3 p-4">
            <div className="aspect-video bg-gray-900 mb-4 relative">
              {videoUrl ? (
                <video
                  width="100%"
                  height="100%"
                  controls
                  src={videoUrl}
                  className="object-contain"
                  preload="auto"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p>Loading video...</p>
              )}
            </div>

            <Tabs defaultValue="about" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="about" className="font-bold">
                  About
                </TabsTrigger>
                <TabsTrigger value="discuss">Discuss Doubt</TabsTrigger>
              </TabsList>
              <TabsContent value="about">
                <h2 className="text-2xl font-bold mb-4">
                  {activeEpisodeData?.episode} | {activeEpisodeData?.title}
                </h2>
                <p className="mb-4">{activeEpisodeData?.description}</p>
              </TabsContent>
              <TabsContent value="discuss">
                <div className="p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-bold mb-2">Discussion Forum</h3>
                  <p>Ask your doubts and discuss with other learners here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="w-1/3 bg-gray-100 p-4">
            <h2 className="text-2xl font-bold mb-2">{tutorial.title}</h2>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 flex-1 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-sm font-medium">
                {progressPercentage} %
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {completedCount} of {totalCount} Completed
            </p>

            <Accordion
              type="single"
              collapsible
              defaultValue="season-1"
              className="w-full"
            >
              {seasons.map((season: Season) => (
                <AccordionItem key={season._id} value={season._id}>
                  <AccordionTrigger className="font-bold">
                    {season.season}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {season.episodes.map((episode: Episode) => (
                        <div
                          key={episode._id}
                          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
                            activeEpisode === episode._id ? "bg-white" : ""
                          }`}
                          onClick={() => handleEpisodeClick(episode)}
                        >
                          <div className="flex-shrink-0">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                width="24"
                                height="24"
                                rx="4"
                                fill="#F1F1F1"
                              />
                              {episode.completed ? (
                                <circle cx="12" cy="12" r="8" fill="#4CAF50" />
                              ) : (
                                <path
                                  d="M16 12L10 16.5V7.5L16 12Z"
                                  fill="black"
                                  stroke="black"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              )}
                            </svg>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {episode.episode}
                              </span>
                              <span className="text-sm">|</span>
                              <span className="text-sm">{episode.title}</span>
                            </div>
                          </div>
                          {episode.completed && (
                            <div className="ml-auto">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5 13L9 17L19 7"
                                  stroke="#4CAF50"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </main>
      </div>
    </div>
  );
}
