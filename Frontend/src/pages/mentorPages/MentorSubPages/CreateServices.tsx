import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  MonitorPlay,
  X,
  Upload,
  FileText,
  Video,
  Clock,
  IndianRupee,
  CheckCircle,
  Plus,
  Eye,
  Sparkles,
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
import { Tabs, TabsContent } from "@/components/ui/tabs";
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
    is: "1-1-call",
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
  gradient: string;
  iconBg: string;
}

const serviceTypes: ServiceType[] = [
  {
    id: "1-1-call",
    title: "1:1 Call",
    icon: <Calendar className="h-8 w-8" />,
    description: "Schedule personal video calls or chat sessions",
    gradient: "from-blue-500 to-purple-600",
    iconBg: "bg-blue-100 text-blue-600",
  },
  {
    id: "priority-dm",
    title: "Priority DM",
    icon: <MessageSquare className="h-8 w-8" />,
    description: "Offer priority Q&A message support",
    gradient: "from-green-500 to-teal-600",
    iconBg: "bg-green-100 text-green-600",
  },
  {
    id: "digital-products",
    title: "Digital Products",
    icon: <MonitorPlay className="h-8 w-8" />,
    description: "Sell your digital content and resources",
    gradient: "from-orange-500 to-pink-600",
    iconBg: "bg-orange-100 text-orange-600",
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

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form validation errors:", errors);
      toast.error("Please fix the form errors before submitting.");
    }
  }, [errors]);

  useEffect(() => {
    console.log("Selected Type:", selectedType);
    console.log("Selected Tab:", selectedTab);
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
    <div className="pl-28 mt-4 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className=" top-0 bg-white/80 backdrop-blur-md border-b border-gray-200/50 z-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="hover:bg-gray-100/70 rounded-xl p-2"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Create New Service
                </h1>
                <p className="text-sm text-gray-500">
                  Build your next mentorship offering
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Display */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                <X className="h-4 w-4 text-red-600" />
              </div>
              <h3 className="font-semibold text-red-800">
                Please fix the following errors:
              </h3>
            </div>
            <div className="space-y-1 ml-11">
              {Object.entries(errors).map(([field, error]) => (
                <p key={field} className="text-sm text-red-700">
                  <span className="font-medium capitalize">{field}:</span>{" "}
                  {error?.message}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Service Type Selection */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              Choose Your Service Type
            </h2>
            <p className="text-gray-600 text-lg">
              Select the type of mentorship service you want to offer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceTypes.map((type) => (
              <Card
                key={type.id}
                onClick={() => {
                  setSelectedType(type.id);
                  setValue("type", type.id);
                }}
                className={`cursor-pointer transition-all duration-500 ease-out transform hover:scale-[1.02] hover:-translate-y-1 group
                  ${
                    selectedType === type.id
                      ? "ring-2 ring-blue-500 shadow-2xl bg-gradient-to-br from-white to-blue-50"
                      : "border border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-xl bg-white"
                  }`}
              >
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <div
                      className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
                        selectedType === type.id
                          ? `bg-gradient-to-r ${type.gradient} text-white shadow-lg`
                          : type.iconBg
                      }`}
                    >
                      {type.icon}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-xl text-gray-900">
                        {type.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {type.description}
                      </p>
                    </div>
                    {selectedType === type.id && (
                      <div className="flex items-center justify-center gap-2 mt-4 text-blue-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium text-sm">Selected</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {errors.type && (
            <p className="text-red-500 text-sm mt-4 text-center">
              {errors.type.message}
            </p>
          )}
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          {/* 1:1 Call and Priority DM Forms */}
          {(selectedType === "1-1-call" || selectedType === "priority-dm") && (
            <div className="space-y-8">
              {/* Call Type Selection for 1:1 Call */}
              {selectedType === "1-1-call" && (
                <div className="space-y-4">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Select Call Type
                    </h3>
                    <p className="text-gray-600">
                      Choose how you want to connect with your mentees
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <button
                      onClick={() => {
                        setOneToOneType("chat");
                        setValue("oneToOneType", "chat");
                      }}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left group hover:scale-[1.02]
                        ${
                          oneToOneType === "chat"
                            ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg"
                            : "border-gray-200 hover:border-blue-300 bg-white hover:shadow-md"
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl transition-all ${
                            oneToOneType === "chat"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                          }`}
                        >
                          <MessageSquare className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Chat Session
                          </h4>
                          <p className="text-sm text-gray-600">
                            Message-based mentorship
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setOneToOneType("video");
                        setValue("oneToOneType", "video");
                      }}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left group hover:scale-[1.02]
                        ${
                          oneToOneType === "video"
                            ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg"
                            : "border-gray-200 hover:border-blue-300 bg-white hover:shadow-md"
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl transition-all ${
                            oneToOneType === "video"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                          }`}
                        >
                          <Video className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Video Call
                          </h4>
                          <p className="text-sm text-gray-600">
                            Face-to-face sessions
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                  {errors.oneToOneType && (
                    <p className="text-red-500 text-sm text-center">
                      {errors.oneToOneType.message}
                    </p>
                  )}
                </div>
              )}

              {/* Priority DM*/}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Priority DM Details
                </h3>
                <p className="text-gray-600">
                  Create one direct message support Service
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Service Title
                    </Label>
                    <Controller
                      control={control}
                      name="title"
                      render={({ field }) => (
                        <Input
                          placeholder="Enter a compelling service name"
                          {...field}
                          className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                      )}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {selectedType === "1-1-call" && (
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Duration (minutes)
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
                            className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                          />
                        )}
                      />
                      {errors.duration && (
                        <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.duration.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <IndianRupee className="h-4 w-4" />
                      Pricing (₹)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                        ₹
                      </span>
                      <Controller
                        control={control}
                        name="amount"
                        render={({ field }) => (
                          <Input
                            type="number"
                            className="h-12 pl-10 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                            placeholder="Enter your rate"
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
                      <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.amount.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                    Short Description
                  </Label>
                  <Controller
                    control={control}
                    name="shortDescription"
                    render={({ field }) => (
                      <Textarea
                        placeholder="A brief overview of what you offer..."
                        {...field}
                        className="min-h-[120px] rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                      />
                    )}
                  />
                  {errors.shortDescription && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.shortDescription.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                    Detailed Description
                  </Label>
                  <Controller
                    control={control}
                    name="longDescription"
                    render={({ field }) => (
                      <Textarea
                        placeholder="Provide detailed information about your service, what mentees can expect, your expertise..."
                        className="min-h-[120px] rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                        {...field}
                      />
                    )}
                  />
                  {errors.longDescription && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.longDescription.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Digital Products Form */}
          {selectedType === "digital-products" && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Digital Product Details
                </h3>
                <p className="text-gray-600">
                  Choose between digital documents or exclusive video content
                </p>
              </div>

              <Tabs
                value={selectedTab}
                onValueChange={(value) => {
                  console.log("Changing selectedTab to:", value);
                  setSelectedTab(
                    value as "digital-product" | "exclusive-content" | ""
                  );
                  setValue("selectedTab", value);
                }}
                className="w-full"
              >
                {/* Custom Tab Navigation */}
                <div className="flex justify-center mb-8">
                  <div className="bg-gray-100 p-2 rounded-2xl flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedTab("digital-product");
                        setValue("selectedTab", "digital-product");
                      }}
                      className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3
                        ${
                          selectedTab === "digital-product"
                            ? "bg-white text-blue-600 shadow-lg"
                            : "text-gray-600 hover:text-blue-600"
                        }`}
                    >
                      <FileText className="h-5 w-5" />
                      <div className="text-left">
                        <div className="text-sm font-semibold">
                          Digital Product
                        </div>
                        <div className="text-xs opacity-70">
                          E-Books, Guides, Resources
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTab("exclusive-content");
                        setValue("selectedTab", "exclusive-content");
                      }}
                      className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3
                        ${
                          selectedTab === "exclusive-content"
                            ? "bg-white text-blue-600 shadow-lg"
                            : "text-gray-600 hover:text-blue-600"
                        }`}
                    >
                      <Video className="h-5 w-5" />
                      <div className="text-left">
                        <div className="text-sm font-semibold">
                          Exclusive Content
                        </div>
                        <div className="text-xs opacity-70">
                          Video Tutorials
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <TabsContent value="digital-product" className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Basic Info */}
                    <div className="space-y-6">
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Product Title
                        </Label>
                        <Controller
                          control={control}
                          name="title"
                          render={({ field }) => (
                            <Input
                              placeholder="Enter your product name"
                              {...field}
                              className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                          )}
                        />
                        {errors.title && (
                          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                            <X className="h-3 w-3" />
                            {errors.title.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                          Product Description
                        </Label>
                        <Controller
                          control={control}
                          name="shortDescription"
                          render={({ field }) => (
                            <Textarea
                              placeholder="Describe what your digital product offers..."
                              {...field}
                              className="min-h-[120px] rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                            />
                          )}
                        />
                        {errors.shortDescription && (
                          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                            <X className="h-3 w-3" />
                            {errors.shortDescription.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right Column - Pricing and File Upload */}
                    <div className="space-y-6">
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <IndianRupee className="h-4 w-4" />
                          Price (₹)
                        </Label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                            ₹
                          </span>
                          <Controller
                            control={control}
                            name="amount"
                            render={({ field }) => (
                              <Input
                                type="number"
                                className="h-12 pl-10 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                placeholder="Enter price"
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
                          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                            <X className="h-3 w-3" />
                            {errors.amount.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Upload PDF File
                        </Label>
                        <div className="space-y-4">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                          />

                          <div
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all
                            ${
                              selectedFile
                                ? "border-green-300 bg-green-50"
                                : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                            }`}
                          >
                            {selectedFile ? (
                              <div className="space-y-3">
                                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto">
                                  <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-green-800">
                                    {selectedFile.name}
                                  </p>
                                  <p className="text-sm text-green-600">
                                    PDF uploaded successfully
                                  </p>
                                </div>
                                <div className="flex gap-3 justify-center">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsPDFModalOpen(true)}
                                    className="rounded-lg"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Preview
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleButtonClick}
                                    className="rounded-lg"
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Change File
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="h-12 w-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
                                  <Upload className="h-6 w-6 text-gray-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-700">
                                    Upload your PDF file
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Click to select or drag and drop
                                  </p>
                                </div>
                                <Button
                                  onClick={handleButtonClick}
                                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Select PDF File
                                </Button>
                              </div>
                            )}
                          </div>

                          {errors.pdfFile && (
                            <p className="text-red-500 text-xs flex items-center gap-1">
                              <X className="h-3 w-3" />
                              {errors.pdfFile.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="exclusive-content" className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Basic Info */}
                    <div className="space-y-6">
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          Course Title
                        </Label>
                        <Controller
                          control={control}
                          name="title"
                          render={({ field }) => (
                            <Input
                              placeholder="Enter your course name"
                              {...field}
                              className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                          )}
                        />
                        {errors.title && (
                          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                            <X className="h-3 w-3" />
                            {errors.title.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                          Course Description
                        </Label>
                        <Controller
                          control={control}
                          name="shortDescription"
                          render={({ field }) => (
                            <Textarea
                              placeholder="Describe what your video course covers..."
                              {...field}
                              className="min-h-[120px] rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                            />
                          )}
                        />
                        {errors.shortDescription && (
                          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                            <X className="h-3 w-3" />
                            {errors.shortDescription.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <IndianRupee className="h-4 w-4" />
                          Price (₹)
                        </Label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                            ₹
                          </span>
                          <Controller
                            control={control}
                            name="amount"
                            render={({ field }) => (
                              <Input
                                type="number"
                                className="h-12 pl-10 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                placeholder="Enter price"
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
                          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                            <X className="h-3 w-3" />
                            {errors.amount.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right Column - Video Management */}
                    <div className="space-y-6">
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Course Content
                        </Label>

                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all">
                          <div className="space-y-4">
                            <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
                              <Video className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">
                                Add Video Episodes
                              </p>
                              <p className="text-sm text-gray-500">
                                Upload videos organized by seasons and episodes
                              </p>
                            </div>
                            <Button
                              onClick={() => {
                                console.log("Opening video upload modal");
                                setIsModalOpen(true);
                              }}
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Video Episode
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Video Content Display */}
                      {exclusiveContent && exclusiveContent.length > 0 && (
                        <div className="space-y-4">
                          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Uploaded Content
                          </Label>

                          <div className="bg-gray-50 rounded-xl p-4 max-h-80 overflow-y-auto">
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full space-y-2"
                            >
                              {exclusiveContent.map((season, seasonIndex) => (
                                <AccordionItem
                                  key={seasonIndex}
                                  value={`season-${seasonIndex}`}
                                  className="border border-gray-200 rounded-lg px-4"
                                >
                                  <AccordionTrigger className="hover:no-underline py-3">
                                    <div className="flex items-center gap-3">
                                      <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <span className="text-xs font-bold text-blue-600">
                                          {seasonIndex + 1}
                                        </span>
                                      </div>
                                      <span className="font-medium">
                                        {season.season}
                                      </span>
                                      <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                                        {season.episodes.length} episodes
                                      </span>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="pb-3">
                                    <div className="space-y-2 ml-11">
                                      {season.episodes.map((ep, epIndex) => (
                                        <div
                                          key={epIndex}
                                          className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100"
                                        >
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                                                Episode {ep.episode}
                                              </span>
                                              <span className="font-medium text-sm">
                                                {ep.title}
                                              </span>
                                            </div>
                                            <p className="text-xs text-gray-600 mb-1">
                                              {ep.description}
                                            </p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                              <Video className="h-3 w-3" />
                                              {ep.video.name}
                                            </p>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              onRemoveEpisode(
                                                seasonIndex,
                                                epIndex
                                              )
                                            }
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                          >
                                            <X className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </div>

                          {errors.exclusiveContent && (
                            <p className="text-red-500 text-xs flex items-center gap-1">
                              <X className="h-3 w-3" />
                              {errors.exclusiveContent.message}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-8 border-t border-gray-100">
            <Button
              onClick={() => {
                console.log("Create button clicked");
                handleSubmit(onSubmit)();
              }}
              disabled={isSubmitting}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Creating Service...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5" />
                  Create Service
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
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
