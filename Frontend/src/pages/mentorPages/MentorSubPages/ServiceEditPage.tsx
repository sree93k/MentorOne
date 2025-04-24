import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import { setError, setUser, setLoading } from "@/redux/slices/userSlice";
import { getServiceById, updateService } from "@/services/mentorService";
import UploadVideoModal from "@/components/mentor/VideoUploadModal";
import PDFViewerModal from "@/components/modal/PdfViewModal";

// Define form values type
interface FormValues {
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
      video?: File;
      videoUrl?: string;
    }>;
  }>;
}

// Yup validation schema
const serviceValidationSchema = Yup.object().shape(
  {
    title: Yup.string()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title cannot exceed 100 characters")
      .required("Service title is required"),
    shortDescription: Yup.string()
      .min(10, "Short description must be at least 10 characters")
      .max(200, "Short description cannot exceed 200 characters")
      .required("Short description is required"),
    longDescription: Yup.string().when("type", {
      is: (type: string) => ["1-1Call", "priorityDM"].includes(type),
      then: (schema) =>
        schema
          .min(20, "Long description must be at least 20 characters")
          .required("Long description is required"),
      otherwise: (schema) => schema.optional(),
    }),
    duration: Yup.number().when("type", {
      is: (type: string) => ["1-1Call", "priorityDM"].includes(type),
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
      is: "1-1Call",
      then: (schema) =>
        schema
          .oneOf(["chat", "video"], "Select a valid 1:1 call type")
          .required("1:1 call type is required"),
      otherwise: (schema) => schema.optional(),
    }),
    pdfFile: Yup.mixed().when(["type", "digitalProductType"], {
      is: (type: string, digitalProductType: string) =>
        type === "DigitalProducts" && digitalProductType === "documents",
      then: (schema) =>
        schema
          .test("fileType", "File must be a PDF", (value) => {
            return (
              !value ||
              (value instanceof File && value.type === "application/pdf")
            );
          })
          .optional(),
      otherwise: (schema) => schema.optional().nullable(),
    }),
    exclusiveContent: Yup.array().when(["type", "digitalProductType"], {
      is: (type: string, digitalProductType: string) =>
        type === "DigitalProducts" && digitalProductType === "videoTutorials",
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
                  video: Yup.mixed().test(
                    "videoOrUrl",
                    "Either a video file or video URL is required",
                    (value, context) => {
                      const { videoUrl } = context.parent;
                      return (
                        (value && value instanceof File) ||
                        (videoUrl && typeof videoUrl === "string")
                      );
                    }
                  ),
                  videoUrl: Yup.string().optional(),
                })
              ),
            })
          )
          .min(1, "At least one season with episodes is required"),
      otherwise: (schema) => schema.optional().nullable(),
    }),
  },
  [["type", "digitalProductType"]]
);

const ServiceEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [service, setService] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user, loading } = useSelector((state: RootState) => state.user);

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
      title: "",
      shortDescription: "",
      longDescription: "",
      duration: undefined,
      amount: undefined,
      oneToOneType: undefined,
      pdfFile: undefined,
      exclusiveContent: [],
    },
  });

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      try {
        console.log("Fetching service for edit", id);
        const serviceData = await getServiceById(id);
        console.log("Service fetched", serviceData);
        setService(serviceData);
        reset({
          title: serviceData.title,
          shortDescription: serviceData.shortDescription,
          longDescription: serviceData.longDescription,
          duration: serviceData.duration,
          amount: serviceData.amount,
          oneToOneType: serviceData.oneToOneType,
          pdfFile: undefined,
          exclusiveContent: serviceData.exclusiveContent || [],
        });
        if (serviceData.fileUrl) {
          setSelectedFile(null); // File will be re-uploaded if changed
        }
      } catch (error: any) {
        console.error("Error fetching service:", error);
        toast.error(`Failed to load service: ${error.message}`);
        navigate("/expert/services");
      }
    };
    fetchService();
  }, [id, reset, navigate]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form validation errors:", errors);
      toast.error("Please fix the form errors before submitting.");
    }
  }, [errors]);

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
    if (!id) {
      console.error("Service ID is missing");
      return;
    }
    console.log(
      "onSubmit called with form data:",
      JSON.stringify(data, null, 2)
    );
    try {
      dispatch(setLoading(true));
      const formData = new FormData();
      const mentorId = user?._id;
      console.log("Mentor ID:", mentorId);

      if (!mentorId) {
        throw new Error("Mentor ID not found. Please log in again.");
      }

      // Append basic fields
      formData.append("mentorId", mentorId);
      formData.append("title", data.title || "");
      formData.append("shortDescription", data.shortDescription || "");
      formData.append("amount", data.amount ? data.amount.toString() : "0");

      // Append type-specific fields
      if (service.type === "1-1Call" || service.type === "priorityDM") {
        formData.append(
          "duration",
          data.duration ? data.duration.toString() : "0"
        );
        formData.append("longDescription", data.longDescription || "");
        if (service.type === "1-1Call" && data.oneToOneType) {
          formData.append("oneToOneType", data.oneToOneType);
        }
      } else if (
        service.type === "DigitalProducts" &&
        service.digitalProductType
      ) {
        formData.append("digitalProductType", service.digitalProductType);
        if (service.digitalProductType === "documents" && data.pdfFile) {
          formData.append("pdfFile", data.pdfFile);
        } else if (
          service.digitalProductType === "videoTutorials" &&
          data.exclusiveContent &&
          data.exclusiveContent.length > 0
        ) {
          let videoCount = 0;
          data.exclusiveContent.forEach((season, seasonIndex) => {
            season.episodes.forEach((episode, episodeIndex) => {
              const videoKey = `video_${seasonIndex}_${episodeIndex}`;
              if (episode.video) {
                formData.append(videoKey, episode.video);
              }
              formData.append(`${videoKey}_season`, season.season);
              formData.append(`${videoKey}_episode`, episode.episode);
              formData.append(`${videoKey}_title`, episode.title);
              formData.append(`${videoKey}_description`, episode.description);
              if (episode.videoUrl) {
                formData.append(`${videoKey}_videoUrl`, episode.videoUrl);
              }
              videoCount++;
            });
          });
          formData.append("videoCount", videoCount.toString());
        }
      }

      // Log FormData contents
      const formDataEntries: { [key: string]: any } = {};
      for (const [key, value] of formData.entries()) {
        formDataEntries[key] = value instanceof File ? value.name : value;
      }
      console.log(
        "Submitting FormData entries:",
        JSON.stringify(formDataEntries, null, 2)
      );

      await updateService(id, formData);
      toast.success("Service updated successfully!");
      navigate("/expert/services");
    } catch (error: any) {
      console.error("Error updating service:", error);
      toast.error(
        `Failed to update service: ${error.message || "Unknown error"}`
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (!service) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Loading service...</p>
      </div>
    );
  }

  return (
    <div className="mx-40 py-6 border border-gray-200 bg-white">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/expert/services")}>
          <ArrowLeft className="h-7 w-7" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Service</h1>
      </div>

      <div className="max-w-4xl mx-auto">
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

        {(service.type === "1-1Call" || service.type === "priorityDM") && (
          <div className="space-y-6">
            {service.type === "1-1Call" && (
              <div className="w-full my-8">
                <div className="flex flex-col items-start gap-4 w-full">
                  <button
                    onClick={() => setValue("oneToOneType", "chat")}
                    className={`flex justify-between items-center min-w-[400px] w-1/2 px-4 py-3 border rounded-lg bg-[#fdf9e0] 
                      transition-all duration-200
                      ${
                        watch("oneToOneType") === "chat"
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
                    onClick={() => setValue("oneToOneType", "video")}
                    className={`flex justify-between items-center min-w-[400px] w-1/2 px-4 py-3 border rounded-lg bg-[#fdf9e0] 
                      transition-all duration-200
                      ${
                        watch("oneToOneType") === "video"
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
              <div className="flex-1">
                <Label className="text-sm font-medium mb-2 block">Title</Label>
                <Controller
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <Input placeholder="Name of service" {...field} />
                  )}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
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

        {service.type === "DigitalProducts" &&
          service.digitalProductType === "documents" && (
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
                    {(selectedFile || service.fileUrl) && (
                      <Button
                        variant="outline"
                        onClick={() => setIsPDFModalOpen(true)}
                      >
                        View PDF
                      </Button>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground text-gray-500">
                    {selectedFile
                      ? selectedFile.name
                      : service.fileUrl
                      ? "Existing PDF"
                      : "No file selected"}
                  </span>
                  {errors.pdfFile && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.pdfFile.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

        {service.type === "DigitalProducts" &&
          service.digitalProductType === "videoTutorials" && (
            <div className="space-y-6">
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
                                    {ep.video ? ep.video.name : ep.videoUrl}
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
            </div>
          )}

        <div className="flex gap-4 !my-14">
          <Button
            variant="outline"
            className="w-full text-lg p-8"
            onClick={() => navigate("/expert/services")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="w-full bg-black text-white text-lg p-8 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
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
        pdfUrl={service.fileUrl}
      />
    </div>
  );
};

export default ServiceEditPage;
