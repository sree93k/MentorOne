"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Validation schema for video upload
const videoValidationSchema = Yup.object().shape({
  season: Yup.string().required("Season is required"),
  episode: Yup.string().required("Episode is required"),
  title: Yup.string().required("Episode title is required"),
  description: Yup.string().required("Episode description is required"),
  video: Yup.mixed().required("Video file is required"),
});

interface UploadVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVideo: (data: any) => void;
}

export default function UploadVideoModal({
  isOpen,
  onClose,
  onAddVideo,
}: UploadVideoModalProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(videoValidationSchema),
    defaultValues: {
      season: "",
      episode: "",
      title: "",
      description: "",
      video: null,
    },
  });

  React.useEffect(() => {
    if (!isOpen) {
      reset();
      setFile(null);
    }
  }, [isOpen, reset]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      if (selectedFile.type.startsWith("video/")) {
        setFile(selectedFile);
        setValue("video", selectedFile);
      } else {
        alert("Please select a video file only.");
        setFile(null);
        setValue("video", null);
      }
    }
  };

  const onSubmit = (data: any) => {
    onAddVideo(data); // Pass data back to CreateService.tsx
    onClose(); // Close the modal
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Upload Video</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Season</Label>
              <Controller
                control={control}
                name="season"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Season" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {["Season 1", "Season 2", "Season 3"].map((season) => (
                        <SelectItem key={season} value={season}>
                          {season}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.season && (
                <p className="text-red-500 text-sm">{errors.season.message}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Episode</Label>
              <Controller
                control={control}
                name="episode"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Episode" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {["1", "2", "3"].map((ep) => (
                        <SelectItem key={ep} value={ep}>
                          Episode {ep}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.episode && (
                <p className="text-red-500 text-sm">{errors.episode.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">
              Episode Title
            </Label>
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <Input placeholder="Episode Title" {...field} />
              )}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">
              Description
            </Label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Textarea placeholder="Description" {...field} />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">
              Upload Video
            </Label>
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                variant="outline"
                className="bg-black text-white"
                onClick={handleButtonClick}
              >
                Upload Video
              </Button>
            </div>
            <span className="text-sm text-gray-500">
              {file ? file.name : "No file selected"}
            </span>
            {errors.video && (
              <p className="text-red-500 text-sm">{errors.video.message}</p>
            )}
          </div>

          <Button
            onClick={handleSubmit(onSubmit)}
            className="w-full bg-black text-white"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
