import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  Globe,
  Package,
  MonitorPlay,
  X,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadVideoModal from "@/components/mentor/VideoUploadModal";
import * as Yup from "yup";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateService } from "@/services/mentorService";

interface ServiceType {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

const serviceTypes: ServiceType[] = [
  {
    id: "1-1-call",
    title: "1:1 Call",
    icon: <Calendar className="h-8 w-8 text-primary" />,
    description: "Schedule 1:1 Video Call",
  },
  {
    id: "priority-dm",
    title: "Priority DM",
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    description: "Setup priority Q&A messages",
  },
  {
    id: "digital-products",
    title: "Digital Products",
    icon: <MonitorPlay className="h-8 w-8 text-primary" />,
    description: "Sell your digital products",
  },
];

const serviceValidationSchema = Yup.object().shape({
  title: Yup.string().required("Service title is required"),
  description: Yup.string().required("Service description is required"),
  exclusiveContent: Yup.array().of(
    Yup.object().shape({
      season: Yup.string().required(),
      episodes: Yup.array().of(
        Yup.object().shape({
          episode: Yup.string().required(),
          title: Yup.string().required(),
          description: Yup.string().required(),
          video: Yup.mixed().required(),
        })
      ),
    })
  ),
});

const CreateServices: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("digital-product");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { control, handleSubmit, setValue, watch } = useForm({
    resolver: yupResolver(serviceValidationSchema),
    defaultValues: {
      title: "",
      description: "",
      exclusiveContent: [],
    },
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setSelectedType("1-1-call");
  }, []);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("Please upload a valid PDF file.");
      e.target.value = "";
      setSelectedFile(null);
    }
  };

  const exclusiveContent = watch("exclusiveContent");

  const onAddVideo = (videoData: any) => {
    const currentContent = exclusiveContent || [];
    const seasonIndex = currentContent.findIndex(
      (item) => item.season === videoData.season
    );

    if (seasonIndex >= 0) {
      const updatedContent = [...currentContent];
      updatedContent[seasonIndex].episodes = [
        ...(updatedContent[seasonIndex].episodes || []),
        {
          episode: videoData.episode,
          title: videoData.title,
          description: videoData.description,
          video: videoData.video,
        },
      ];
      setValue("exclusiveContent", updatedContent);
    } else {
      setValue("exclusiveContent", [
        ...currentContent,
        {
          season: videoData.season,
          episodes: [
            {
              episode: videoData.episode,
              title: videoData.title,
              description: videoData.description,
              video: videoData.video,
            },
          ],
        },
      ]);
    }
  };

  const onRemoveEpisode = (seasonIndex: number, episodeIndex: number) => {
    const updatedContent = [...exclusiveContent];
    updatedContent[seasonIndex].episodes.splice(episodeIndex, 1);
    if (updatedContent[seasonIndex].episodes.length === 0) {
      updatedContent.splice(seasonIndex, 1);
    }
    setValue("exclusiveContent", updatedContent);
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);

      data.exclusiveContent.forEach(
        (
          season: {
            season: string;
            episodes: {
              episode: string;
              title: string;
              description: string;
              video: File;
            }[];
          },
          seasonIndex: number
        ) => {
          formData.append(
            `exclusiveContent[${seasonIndex}][season]`,
            season.season
          );
          season.episodes.forEach(
            (
              episode: {
                episode: string;
                title: string;
                description: string;
                video: File;
              },
              episodeIndex: number
            ) => {
              formData.append(
                `exclusiveContent[${seasonIndex}][episodes][${episodeIndex}][episode]`,
                episode.episode
              );
              formData.append(
                `exclusiveContent[${seasonIndex}][episodes][${episodeIndex}][title]`,
                episode.title
              );
              formData.append(
                `exclusiveContent[${seasonIndex}][episodes][${episodeIndex}][description]`,
                episode.description
              );
              formData.append(
                `exclusiveContent[${seasonIndex}][episodes][${episodeIndex}][video]`,
                episode.video
              );
            }
          );
        }
      );

      await CreateService(formData);
      alert("Service created successfully!");
    } catch (error) {
      console.error("Error creating service:", error);
      alert("Failed to create service.");
    }
  };

  return (
    <div className="mx-40 py-6 border border-gray-300">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-7 w-7 " />
        </Button>
        <h1 className="text-2xl font-bold">Create Service</h1>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Select Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {serviceTypes.map((type) => (
              <Card
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-[1.03] 
                  ${
                    selectedType === type.id
                      ? "border-2 border-black shadow-md"
                      : "border border-gray-300 hover:border-black"
                  }`}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  {type.icon}
                  <h3 className="font-semibold text-lg mt-3">{type.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {type.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {(selectedType === "1-1-call" || selectedType === "priority-dm") && (
          <div className="space-y-6">
            <div className="flex flex-wrap md:flex-nowrap gap-6">
              <div className="flex-1">
                <Label className="text-sm font-medium mb-2 block">Title</Label>
                <Input placeholder="Name of service" />
              </div>
              <div className="flex-1">
                <Label className="text-sm font-medium mb-2 block">
                  Duration (mins)
                </Label>
                <Input type="number" placeholder="30" />
              </div>
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-6">
              <div className="flex-1">
                <Label className="text-sm font-medium mb-2 block">
                  Short Description
                </Label>
                <Textarea placeholder="Brief description of your service" />
              </div>
              <div className="flex-1">
                <Label className="text-sm font-medium mb-2 block">
                  Amount (₹)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    ₹
                  </span>
                  <Input type="number" className="pl-8" placeholder="0" />
                </div>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Long Description
              </Label>
              <Textarea
                placeholder="Detailed description of your service"
                className="min-h-[200px]"
              />
            </div>
          </div>
        )}

        {selectedType === "digital-products" && (
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="mb-8"
          >
            <TabsList className="w-full my-16">
              <div className="flex flex-col items-start gap-4 w-full">
                <TabsTrigger
                  value="digital-product"
                  className="flex justify-between items-center min-w-[400px] w-1/2 px-4 py-3 border border-gray-300 rounded-lg 
                    bg-[#fdf9e0] hover:border-black transition-all duration-200
                    data-[state=active]:border-black data-[state=active]:font-semibold"
                >
                  <p>Digital Product</p>
                  <p className="text-gray-500 text-sm">
                    E-Book, Guides, Resources
                  </p>
                </TabsTrigger>
                <TabsTrigger
                  value="exclusive-content"
                  className="flex justify-between items-center min-w-[400px] w-1/2 px-4 py-3 border border-gray-300 rounded-lg 
                    bg-[#fdf9e0] hover:border-black transition-all duration-200
                    data-[state=active]:border-black data-[state=active]:font-semibold"
                >
                  <p>Exclusive Content</p>
                  <p className="text-gray-500 text-sm">Video Tutorials</p>
                </TabsTrigger>
              </div>
            </TabsList>

            <TabsContent value="digital-product">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Title
                    </Label>
                    <Input placeholder="Name of service" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Short Description
                    </Label>
                    <Textarea placeholder="Brief description of your service" />
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Amount (₹)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        ₹
                      </span>
                      <Input type="number" className="pl-8" placeholder="0" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Upload File
                    </Label>
                    <div className="flex items-center gap-4">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        className="bg-black text-white"
                        onClick={handleButtonClick}
                      >
                        Upload PDF
                      </Button>
                    </div>
                    <span className="text-sm text-muted-foreground text-gray-500">
                      {selectedFile ? selectedFile.name : "No file selected"}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="exclusive-content">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Title
                    </Label>
                    <Controller
                      control={control}
                      name="title"
                      render={({ field }) => (
                        <Input placeholder="Name of service" {...field} />
                      )}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Short Description
                    </Label>
                    <Controller
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <Textarea
                          placeholder="Brief description of your service"
                          {...field}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Amount (₹)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        ₹
                      </span>
                      <Input type="number" className="pl-8" placeholder="0" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-6 mt-10">
                <div className="w-1/2 flex justify-end">
                  <div className="flex flex-col items-end gap-2">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Upload Videos
                      </Label>
                      <Button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-black text-white"
                      >
                        Add Video
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 space-y-2">
                  <Accordion type="single" collapsible className="w-full">
                    {exclusiveContent &&
                      exclusiveContent.length > 0 &&
                      exclusiveContent.map((season, seasonIndex) => (
                        <AccordionItem
                          key={seasonIndex}
                          value={`season-${seasonIndex}`}
                        >
                          <AccordionTrigger>{season.season}</AccordionTrigger>
                          <AccordionContent>
                            {season.episodes.map((ep, epIndex) => (
                              <div
                                key={epIndex}
                                className="flex justify-between items-center p-2 border-b border-gray-200"
                              >
                                <div>
                                  <p className="font-medium">
                                    Episode {ep.episode}: {ep.title}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {ep.description}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {ep.video.name}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    onRemoveEpisode(seasonIndex, epIndex)
                                  }
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                  </Accordion>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        <Button
          onClick={handleSubmit(onSubmit)}
          className="!my-14 w-full bg-black text-white text-lg p-8"
          size="lg"
        >
          Create
        </Button>
      </div>

      <UploadVideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddVideo={onAddVideo}
      />
    </div>
  );
};

export default CreateServices;
