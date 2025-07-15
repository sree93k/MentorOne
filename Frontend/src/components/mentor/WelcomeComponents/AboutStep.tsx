import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadIcon, Loader2 } from "lucide-react"; // Added Loader2 for loading spinner
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WelcomeFormData } from "../MentorWelcomeModal";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
interface AboutStepProps {
  formData: WelcomeFormData;
  setFormData: (data: WelcomeFormData) => void;
}

const AboutStep: React.FC<AboutStepProps> = ({ formData, setFormData }) => {
  const [activeTab, setActiveTab] = useState(formData.userType || "school");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // For local image preview
  const [isImageLoading, setIsImageLoading] = useState(false); // Loading state for image preview
  const { reason, isApproved } = useSelector((state: RootState) => state.user);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsImageLoading(true); // Show loading indicator
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string); // Set preview URL for display
        setIsImageLoading(false); // Hide loading indicator
      };
      reader.readAsDataURL(file); // Read file as data URL
      setFormData({ ...formData, imageFile: file }); // Store file in formData for submission
    }
  };

  // Generate demo years (2000 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2000 + 1 },
    (_, i) => 2000 + i
  ).reverse();

  return (
    <>
      <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700 mb-3">
        {isApproved === "Rejected" && reason ? (
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-red-600 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-700">
                Application Rejected
              </h3>
              <p className="mt-1 text-sm text-red-600">
                Your mentor application was not approved.
              </p>
              <p className="mt-2 text-sm font-medium text-red-700">
                Reason: {reason}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Please revise your application and resubmit to continue.
              </p>
            </div>
          </div>
        ) : (
          // </div>
          <div>
            <p>Lovely to see you!</p>
            <p>
              Filling out the form only takes a couple minutes. We'd love to
              learn more about your background and why you'd like to become a
              mentor.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-row justify-center items-center gap-4 mb-3">
        <div className="flex flex-col items-center">
          <Label>Photo</Label>
          <Avatar className="h-24 w-24">
            {isImageLoading ? (
              <AvatarFallback className="bg-gray-100 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
              </AvatarFallback>
            ) : previewUrl ? (
              <AvatarImage src={previewUrl} />
            ) : formData.imageUrl ? (
              <AvatarImage src={formData.imageUrl} />
            ) : (
              <AvatarFallback className="bg-gray-100">
                <UploadIcon className="h-8 w-8 text-gray-400" />
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("image-upload")?.click()}
            disabled={isImageLoading} // Disable button while loading
          >
            <UploadIcon className="h-4 w-4 mr-2" />
            {isImageLoading ? "Loading..." : "Upload Photo"}
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(
            value as "school" | "college" | "fresher" | "professional"
          );
          setFormData({ ...formData, userType: value as any });
        }}
      >
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger
            value="school"
            className={`${
              activeTab === "school"
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            School Student
          </TabsTrigger>
          <TabsTrigger
            value="college"
            className={`${
              activeTab === "college"
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            College Student
          </TabsTrigger>
          <TabsTrigger
            value="fresher"
            className={`${
              activeTab === "fresher"
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            Fresher
          </TabsTrigger>
          <TabsTrigger
            value="professional"
            className={`${
              activeTab === "professional"
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            Professional
          </TabsTrigger>
        </TabsList>

        {/* TabsContent remains unchanged for brevity */}
        <TabsContent value="school" className="mt-6 bg-white">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>School Name</Label>
                <Input
                  name="schoolName"
                  value={formData.schoolName || ""}
                  onChange={handleInputChange}
                  placeholder="Enter school name"
                />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  name="city"
                  value={formData.city || ""}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Current Class</Label>
              <div className="flex flex-wrap gap-2">
                {[8, 9, 10, 11, 12].map((grade) => (
                  <Button
                    key={grade}
                    variant={
                      formData.class === grade.toString()
                        ? "default"
                        : "outline"
                    }
                    className={`rounded-full h-8 px-4 ${
                      formData.class === grade.toString()
                        ? "bg-black text-white"
                        : "bg-white text-black border-gray-300"
                    }`}
                    onClick={() =>
                      handleSelectChange("class", grade.toString())
                    }
                  >
                    {grade}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="college" className="mt-6 bg-white">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Course</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("course", value)}
                  value={formData.course}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="btech">B.Tech</SelectItem>
                    <SelectItem value="bsc">B.Sc</SelectItem>
                    <SelectItem value="bca">BCA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Specialization</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("specializedIn", value)
                  }
                  value={formData.specializedIn}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Specialization" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="it">Information Technology</SelectItem>
                    <SelectItem value="ec">Electronics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>College Name</Label>
                <Input
                  name="collegeName"
                  value={formData.collegeName || ""}
                  onChange={handleInputChange}
                  placeholder="Enter college name"
                />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  name="city"
                  value={formData.city || ""}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fresher" className="mt-6 bg-white">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Course</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("course", value)}
                  value={formData.course}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="btech">B.Tech</SelectItem>
                    <SelectItem value="bsc">B.Sc</SelectItem>
                    <SelectItem value="bca">BCA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Specialization</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("specializedIn", value)
                  }
                  value={formData.specializedIn}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Specialization" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="it">Information Technology</SelectItem>
                    <SelectItem value="ec">Electronics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>College Name</Label>
                <Input
                  name="collegeName"
                  value={formData.collegeName || ""}
                  onChange={handleInputChange}
                  placeholder="Enter college name"
                />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  name="city"
                  value={formData.city || ""}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="professional" className="mt-6 bg-white">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Working Experience</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("experience", value)
                  }
                  value={formData.experience}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Experience" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="0-2">0-2 years</SelectItem>
                    <SelectItem value="2-5">2-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Current Job Role</Label>
                <Input
                  name="jobRole"
                  value={formData.jobRole || ""}
                  onChange={handleInputChange}
                  placeholder="Enter job role"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Current Company</Label>
              <Input
                name="company"
                value={formData.company || ""}
                onChange={handleInputChange}
                placeholder="Enter company name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Year</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("startDate", value)
                  }
                  value={formData.startDate}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent className="bg-white max-h-[200px] overflow-y-auto">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>End Year</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("endDate", value)
                  }
                  value={formData.endDate}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent className="bg-white max-h-[200px] overflow-y-auto">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input
                name="city"
                value={formData.city || ""}
                onChange={handleInputChange}
                placeholder="Enter city"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default AboutStep;
