import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  MonitorPlay,
  X,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { setLoading } from "@/redux/slices/userSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadVideoModal from "@/components/mentor/VideoUploadModal";
import PDFViewerModal from "@/components/modal/PdfViewModal";
import * as Yup from "yup";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateService } from "@/services/mentorService";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import toast from "react-hot-toast";

// Define form values type
interface FormValues {
  type: "1-1-call" | "priority-dm" | "digital-products";
  title: string;
  shortDescription: string;
  longDescription?: string;
  duration?: number;
  amount: number;
  oneToOneType?: "chat" | "video";
  pdfFile?: File | null | undefined;
  exclusiveContent?: Array<{
    season: string;
    episodes: Array<{
      episode: string;
      title: string;
      description: string;
      video: File;
    }>;
  }>;
  selectedTab?: "digital-product" | "exclusive-content" | "";
}

const serviceValidationSchema = Yup.object().shape({
  type: Yup.string()
    .oneOf(["1-1-call", "priority-dm", "digital-products"])
    .required("Service type is required"),
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters")
    .required("Service title is required"),
  shortDescription: Yup.string()
    .min(10, "Short description must be at least 10 characters")
    .max(200, "Short description cannot exceed 200 characters")
    .required("Short description is required"),
  longDescription: Yup.string().when("type", {
    is: (type: string) => ["1-1-call", "priority-dm"].includes(type),
    then: (schema) =>
      schema
        .min(20, "Long description must be at least 20 characters")
        .required("Long description is required"),
    otherwise: (schema) => schema.optional(),
  }),
  duration: Yup.number().when("type", {
    is: "1-1-call", // Only required for 1-1-call
    then: (schema) =>
      schema
        .typeError("Duration must be a number")
        .min(5, "Duration must be at least 5 minutes")
        .required("Duration is required"),
    otherwise: (schema) => schema.optional(),
  }),
  amount: Yup.number()
    .typeError("Amount must be a number")
    .min(0, "Amount cannot be negative")
    .required("Amount is required"),
  oneToOneType: Yup.string().when("type", {
    is: "1-1-call",
    then: (schema) =>
      schema
        .oneOf(["chat", "video"], "Select a valid 1:1 call type")
        .required("1:1 call type is required"),
    otherwise: (schema) => schema.optional(),
  }),
  pdfFile: Yup.mixed().when(["type", "selectedTab"], {
    is: (type: string, selectedTab: string) =>
      type === "digital-products" && selectedTab === "digital-product",
    then: (schema) =>
      schema
        .required("PDF file is required")
        .test("fileType", "File must be a PDF", (value) => {
          return (
            value && value instanceof File && value.type === "application/pdf"
          );
        }),
    otherwise: (schema) => schema.optional().nullable(),
  }),
  exclusiveContent: Yup.array().when(["type", "selectedTab"], {
    is: (type: string, selectedTab: string) =>
      type === "digital-products" && selectedTab === "exclusive-content",
    then: (schema) =>
      schema
        .of(
          Yup.object().shape({
            season: Yup.string().required("Season is required"),
            episodes: Yup.array().of(
              Yup.object().shape({
                episode: Yup.string().required("Episode number is required"),
                title: Yup.string().required("Episode title is required"),
                description: Yup.string().required(
                  "Episode description is required"
                ),
                video: Yup.mixed()
                  .required("Video file is required")
                  .test(
                    "fileType",
                    "File must be a video (mp4, mov, avi)",
                    (value) => {
                      return (
                        value &&
                        value instanceof File &&
                        [
                          "video/mp4",
                          "video/quicktime",
                          "video/x-msvideo",
                        ].includes(value.type)
                      );
                    }
                  ),
              })
            ),
          })
        )
        .min(1, "At least one season with episodes is required"),
    otherwise: (schema) => schema.optional().nullable(),
  }),
  selectedTab: Yup.string()
    .oneOf(["digital-product", "exclusive-content", ""])
    .optional(),
});

interface ServiceType {
  id: "1-1-call" | "priority-dm" | "digital-products";
  title: string;
  icon: React.ReactNode;
  description: string;
}

const serviceTypes: ServiceType[] = [
  {
    id: "1-1-call",
    title: "1:1 Call",
    icon: <Calendar className="h-8 w-8 text-primary" />,
    description: "Schedule 1:1 Video Call or Chat",
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

const CreateServices: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<
    "1-1-call" | "priority-dm" | "digital-products"
  >("1-1-call");
  const dispatch = useDispatch();
  const [oneToOneType, setOneToOneType] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTab, setSelectedTab] = useState<
    "digital-product" | "exclusive-content" | ""
  >("digital-product");

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(serviceValidationSchema),
    defaultValues: {
      type: "1-1-call",
      title: "",
      shortDescription: "",
      longDescription: "",
      duration: undefined,
      amount: undefined,
      oneToOneType: "",
      pdfFile: undefined,
      exclusiveContent: [],
      selectedTab: "",
    },
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const user = useSelector((state: RootState) => state.user.user);

  // Log form errors for debugging
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form validation errors:", errors);
      toast.error("Please fix the form errors before submitting.");
    }
  }, [errors]);

  useEffect(() => {
    console.log("Selected Type:", selectedType);
    console.log("Selected Tab:", selectedTab);
    // Reset form when selectedType changes
    reset({
      type: selectedType,
      title: "",
      shortDescription: "",
      longDescription: "",
      duration: undefined,
      amount: undefined,
      oneToOneType: "",
      pdfFile: undefined,
      exclusiveContent: [],
      selectedTab: selectedType === "digital-products" ? "digital-product" : "",
    });
    setSelectedFile(null);
    setOneToOneType(null);
    setSelectedTab(
      selectedType === "digital-products" ? "digital-product" : ""
    );
  }, [selectedType, reset]);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error("File input ref is not set");
      toast.error("File input is not available");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast.error("File size exceeds 10MB limit.");
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
      setValue("pdfFile", file);
      toast.success("PDF selected successfully!");
    } else {
      toast.error("Please upload a valid PDF file.");
      e.target.value = "";
      setSelectedFile(null);
      setValue("pdfFile", undefined);
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
    toast.success("Video added to exclusive content!");
  };

  const onRemoveEpisode = (seasonIndex: number, episodeIndex: number) => {
    const updatedContent = [...exclusiveContent];
    updatedContent[seasonIndex].episodes.splice(episodeIndex, 1);
    if (updatedContent[seasonIndex].episodes.length === 0) {
      updatedContent.splice(seasonIndex, 1);
    }
    setValue("exclusiveContent", updatedContent);
    toast.success("Episode removed successfully!");
  };

  const onSubmit = async (data: FormValues) => {
    console.log("onSubmit called with data:", data);
    try {
      dispatch(setLoading(true));
      const formData = new FormData();
      const mentorId = user?._id;
      console.log("Mentor ID:", mentorId);

      if (!mentorId) {
        throw new Error("Mentor ID not found. Please log in again.");
      }
      formData.append("mentorId", mentorId);
      formData.append(
        "type",
        data.type === "1-1-call"
          ? "1-1Call"
          : data.type === "priority-dm"
          ? "priorityDM"
          : "DigitalProducts"
      );
      formData.append("title", data.title);
      formData.append("shortDescription", data.shortDescription);
      formData.append("amount", data.amount.toString());
      if (data.selectedTab && data.type === "digital-products") {
        formData.append("selectedTab", data.selectedTab);
      }

      if (data.type === "1-1-call" || data.type === "priority-dm") {
        formData.append("longDescription", data.longDescription!);
        if (data.type === "1-1-call") {
          formData.append("duration", data.duration!.toString());
          formData.append("oneToOneType", data.oneToOneType!);
        }
      }

      if (
        data.type === "digital-products" &&
        data.selectedTab === "digital-product" &&
        data.pdfFile
      ) {
        formData.append("digitalProductType", "documents");
        formData.append("pdfFile", data.pdfFile);
      }

      if (
        data.type === "digital-products" &&
        data.selectedTab === "exclusive-content"
      ) {
        formData.append("digitalProductType", "videoTutorials");

        if (data.exclusiveContent && data.exclusiveContent.length > 0) {
          data.exclusiveContent.forEach((season, seasonIndex) => {
            season.episodes.forEach((episode, episodeIndex) => {
              const videoKey = `video_${seasonIndex}_${episodeIndex}`;
              formData.append(videoKey, episode.video);
              formData.append(`${videoKey}_season`, season.season);
              formData.append(`${videoKey}_episode`, episode.episode);
              formData.append(`${videoKey}_title`, episode.title);
              formData.append(`${videoKey}_description`, episode.description);
            });
          });

          formData.append(
            "videoCount",
            data.exclusiveContent
              .reduce((count, season) => count + season.episodes.length, 0)
              .toString()
          );
        }
      }

      console.log("Submitting FormData:", formData);
      await CreateService(formData);
      toast.success("Service created successfully!");
      navigate(-1);
    } catch (error: any) {
      console.error("Error creating service:", error);
      toast.error(
        `Failed to create service: ${error.message || "Unknown error"}`
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
  return (
    <div className="mx-40 py-6 border border-gray-200 bg-white">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-7 w-7" />
        </Button>
        <h1 className="text-2xl font-bold">Create Service</h1>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Display all form errors at the top */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            <p>Please fix the following errors:</p>
            <ul className="list-disc ml-4">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>
                  {field}: {error?.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Select Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {serviceTypes.map((type) => (
              <Card
                key={type.id}
                onClick={() => {
                  setSelectedType(type.id);
                  setValue("type", type.id);
                }}
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
          {errors.type && (
            <p className="text-red-500 text-sm mt-2">{errors.type.message}</p>
          )}
        </div>

        {(selectedType === "1-1-call" || selectedType === "priority-dm") && (
          <div className="space-y-6">
            {selectedType === "1-1-call" && (
              <div className="w-full my-8">
                <div className="flex flex-col items-start gap-4 w-full">
                  <button
                    onClick={() => {
                      setOneToOneType("chat");
                      setValue("oneToOneType", "chat");
                    }}
                    className={`flex justify-between items-center min-w-[400px] w-1/2 px-4 py-3 border rounded-lg bg-[#fdf9e0] 
              transition-all duration-200
              ${
                oneToOneType === "chat"
                  ? "border-black font-semibold bg-[#fdf9e0]"
                  : "border-gray-300 hover:border-black"
              }`}
                  >
                    <p>Chat Session</p>
                    <p className="text-gray-500 text-sm">
                      Message-based support
                    </p>
                  </button>
                  <button
                    onClick={() => {
                      setOneToOneType("video");
                      setValue("oneToOneType", "video");
                    }}
                    className={`flex justify-between items-center min-w-[400px] w-1/2 px-4 py-3 border rounded-lg bg-[#fdf9e0] 
              transition-all duration-200
              ${
                oneToOneType === "video"
                  ? "border-black font-semibold bg-[#fdf9e0]"
                  : "border-gray-300 hover:border-black"
              }`}
                  >
                    <p>Video Call</p>
                    <p className="text-gray-500 text-sm">
                      1-on-1 video session
                    </p>
                  </button>
                </div>
                {errors.oneToOneType && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.oneToOneType.message}
                  </p>
                )}
              </div>
            )}
            <div className="flex flex-wrap md:flex-nowrap gap-6">
              <div
                className={
                  selectedType === "1-1-call"
                    ? "flex-1"
                    : "w-full max-w-[435px]"
                }
              >
                <Label className="text-sm font-medium mb-2 block">Title</Label>
                <Controller
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <Input
                      placeholder="Name of service"
                      {...field}
                      className="w-full"
                    />
                  )}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              {selectedType === "1-1-call" && (
                <div className="flex-1">
                  <Label className="text-sm font-medium mb-2 block">
                    Duration (mins)
                  </Label>
                  <Controller
                    control={control}
                    name="duration"
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="30"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseInt(e.target.value, 10)
                            : undefined;
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                  {errors.duration && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.duration.message}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-6">
              <div className="flex-1">
                <Label className="text-sm font-medium mb-2 block">
                  Short Description
                </Label>
                <Controller
                  control={control}
                  name="shortDescription"
                  render={({ field }) => (
                    <Textarea
                      placeholder="Brief description of your service"
                      {...field}
                    />
                  )}
                />
                {errors.shortDescription && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.shortDescription.message}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <Label className="text-sm font-medium mb-2 block">
                  Amount (₹)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    ₹
                  </span>
                  <Controller
                    control={control}
                    name="amount"
                    render={({ field }) => (
                      <Input
                        type="number"
                        className="pl-8"
                        placeholder="0"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseInt(e.target.value, 10)
                            : undefined;
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                </div>
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Long Description
              </Label>
              <Controller
                control={control}
                name="longDescription"
                render={({ field }) => (
                  <Textarea
                    placeholder="Detailed description of your service"
                    className="min-h-[200px]"
                    {...field}
                  />
                )}
              />
              {errors.longDescription && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.longDescription.message}
                </p>
              )}
            </div>
          </div>
        )}
        {selectedType === "digital-products" && (
          <Tabs
            value={selectedTab}
            onValueChange={(value) => {
              console.log("Changing selectedTab to:", value);
              setSelectedTab(
                value as "digital-product" | "exclusive-content" | ""
              );
              setValue("selectedTab", value);
            }}
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
                  <div className="w-full max-w-[400px]">
                    <Label className="text-sm font-medium mb-2 block">
                      Title
                    </Label>
                    <Controller
                      control={control}
                      name="title"
                      render={({ field }) => (
                        <Input
                          placeholder="Name of service"
                          {...field}
                          className="w-full"
                        />
                      )}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Short Description
                    </Label>
                    <Controller
                      control={control}
                      name="shortDescription"
                      render={({ field }) => (
                        <Textarea
                          placeholder="Brief description of your service"
                          {...field}
                        />
                      )}
                    />
                    {errors.shortDescription && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.shortDescription.message}
                      </p>
                    )}
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
                      <Controller
                        control={control}
                        name="amount"
                        render={({ field }) => (
                          <Input
                            type="number"
                            className="pl-8"
                            placeholder="0"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value
                                ? parseInt(e.target.value, 10)
                                : undefined;
                              field.onChange(value);
                            }}
                          />
                        )}
                      />
                    </div>
                    {errors.amount && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.amount.message}
                      </p>
                    )}
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
                      {selectedFile && (
                        <Button
                          variant="outline"
                          onClick={() => setIsPDFModalOpen(true)}
                        >
                          View PDF
                        </Button>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground text-gray-500">
                      {selectedFile ? selectedFile.name : "No file selected"}
                    </span>
                    {errors.pdfFile && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.pdfFile.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="exclusive-content">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="w-full max-w-[400px]">
                    <Label className="text-sm font-medium mb-2 block">
                      Title
                    </Label>
                    <Controller
                      control={control}
                      name="title"
                      render={({ field }) => (
                        <Input
                          placeholder="Name of service"
                          {...field}
                          className="w-full"
                        />
                      )}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Short Description
                    </Label>
                    <Controller
                      control={control}
                      name="shortDescription"
                      render={({ field }) => (
                        <Textarea
                          placeholder="Brief description of your service"
                          {...field}
                        />
                      )}
                    />
                    {errors.shortDescription && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.shortDescription.message}
                      </p>
                    )}
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
                      <Controller
                        control={control}
                        name="amount"
                        render={({ field }) => (
                          <Input
                            type="number"
                            className="pl-8"
                            placeholder="0"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value
                                ? parseInt(e.target.value, 10)
                                : undefined;
                              field.onChange(value);
                            }}
                          />
                        )}
                      />
                    </div>
                    {errors.amount && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.amount.message}
                      </p>
                    )}
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
                        onClick={() => {
                          console.log("Opening video upload modal");
                          setIsModalOpen(true);
                        }}
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
                  {errors.exclusiveContent && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.exclusiveContent.message}
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        <Button
          onClick={() => {
            console.log("Create button clicked");
            handleSubmit(onSubmit)();
          }}
          disabled={isSubmitting}
          className="!my-14 w-full bg-black text-white text-lg p-8 disabled:opacity-50"
          size="lg"
        >
          {isSubmitting ? "Creating..." : "Create"}
        </Button>
      </div>

      <UploadVideoModal
        isOpen={isModalOpen}
        onClose={() => {
          console.log("Closing video upload modal");
          setIsModalOpen(false);
        }}
        onAddVideo={onAddVideo}
      />
      <PDFViewerModal
        isOpen={isPDFModalOpen}
        onClose={() => setIsPDFModalOpen(false)}
        pdfFile={selectedFile}
      />
    </div>
  );
};

export default CreateServices;
