import { useState } from "react";
import { Search, User, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useParams, useNavigate } from "react-router-dom";

interface Episode {
  id: string;
  number: string;
  title: string;
  completed: boolean;
}

interface Season {
  id: string;
  title: string;
  episodes: Episode[];
}

export default function VideoTutorialPage() {
  const { id } = useParams<{ id: string }>();
  const [activeEpisode, setActiveEpisode] = useState("ep-01");
  const navigate = useNavigate();
  const seasons: Season[] = [
    {
      id: "season-1",
      title: "Season 1",
      episodes: [
        {
          id: "ep-01",
          number: "EP-01",
          title: "How Javascript Works & Execution Context",
          completed: true,
        },
        {
          id: "ep-02",
          number: "EP-02",
          title: "How Javascript Works & Execution Context",
          completed: true,
        },
        {
          id: "ep-03",
          number: "EP-03",
          title: "How Javascript Works & Execution Context",
          completed: false,
        },
        {
          id: "ep-04",
          number: "EP-04",
          title: "How Javascript Works & Execution Context",
          completed: false,
        },
        {
          id: "ep-05",
          number: "EP-05",
          title: "How Javascript Works & Execution Context",
          completed: false,
        },
        {
          id: "ep-06",
          number: "EP-06",
          title: "How Javascript Works & Execution Context",
          completed: false,
        },
        {
          id: "ep-07",
          number: "EP-07",
          title: "How Javascript Works & Execution Context",
          completed: false,
        },
        {
          id: "ep-08",
          number: "EP-08",
          title: "How Javascript Works & Execution Context",
          completed: false,
        },
        {
          id: "ep-09",
          number: "EP-09",
          title: "How Javascript Works & Execution Context",
          completed: false,
        },
        {
          id: "ep-10",
          number: "EP-10",
          title: "How Javascript Works & Execution Context",
          completed: false,
        },
        {
          id: "ep-11",
          number: "EP-11",
          title: "How Javascript Works & Execution Context",
          completed: false,
        },
        {
          id: "ep-12",
          number: "EP-12",
          title: "How Javascript Works & Execution Context",
          completed: false,
        },
        {
          id: "ep-13",
          number: "EP-13",
          title: "How Javascript Works & Execution Context",
          completed: false,
        },
        {
          id: "ep-14",
          number: "EP-14",
          title: "How Javascript Works & Execution Context",
          completed: false,
        },
      ],
    },
  ];

  const completedCount = seasons
    .flatMap((s) => s.episodes)
    .filter((e) => e.completed).length;
  const totalCount = seasons.flatMap((s) => s.episodes).length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1">
        {/* Main Content */}
        <main className="flex">
          <div>
            <Button
              variant="ghost"
              className="pl-0"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-7 w-7 " />
            </Button>
          </div>
          <div className="w-2/3 p-4">
            <div className="aspect-video bg-gray-900 mb-4 relative">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/ZvbzSrg0afE"
                title="How JavaScript Works & Execution Context"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
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
                  EP-01 | How JavaScript Works 🔥& Execution Context
                </h2>
                <p className="mb-4">
                  Understanding how JavaScript works behind the scenes, inside
                  the JS Engine will make you a better developer. This video
                  covers details about Execution Context Creation's 2 phases:
                  The memory Allocation Phase and the Code Execution phase.
                </p>
                <p>
                  This video also answers questions about-Is Javascript
                  Single-threaded or multi-threaded? Is JS Synchronous or
                  asynchronous?
                </p>
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
            <h2 className="text-2xl font-bold mb-2">Namaste Javascript</h2>
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
              {seasons.map((season) => (
                <AccordionItem key={season.id} value={season.id}>
                  <AccordionTrigger className="font-bold">
                    {season.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {season.episodes.map((episode) => (
                        <div
                          key={episode.id}
                          className={`flex items-center gap-2 p-2 rounded-md ${
                            activeEpisode === episode.id ? "bg-white" : ""
                          }`}
                          onClick={() => setActiveEpisode(episode.id)}
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
                                {episode.number}
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
