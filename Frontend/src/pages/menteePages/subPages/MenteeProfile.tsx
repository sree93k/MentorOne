import React, { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, UploadIcon, Loader2, HardDriveUpload } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  updateUserProfile,
  uploadProfileImage,
} from "@/services/menteeService";
import { toast } from "react-hot-toast";
import { XIcon, SearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import * as Yup from "yup";

// Define the EditableField component props
interface EditableFieldProps {
  label: string;
  field: string;
  value: string;
  workAs: string;
  onEdit: () => void;
  isEditing?: boolean;
  onSave?: () => void;
  onChange?: (value: string) => void;
  type?: string;
}

// Yup validation schema for profile fields
const profileSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "Too short"),
  lastName: Yup.string().required("Last name is required").min(2, "Too short"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  workAs: Yup.string().optional(),
  course: Yup.string().when("workAs", {
    is: (val: string) => ["college", "fresher"].includes(val),
    then: (schema) => schema.required("Course is required"),
    otherwise: (schema) => schema.optional(),
  }),
  college: Yup.string().when("workAs", {
    is: (val: string) => ["college", "fresher"].includes(val),
    then: (schema) => schema.required("College is required"),
    otherwise: (schema) => schema.optional(),
  }),
  courseStart: Yup.string().when("workAs", {
    is: (val: string) => ["college", "fresher"].includes(val),
    then: (schema) => schema.required("Start date is required"),
    otherwise: (schema) => schema.optional(),
  }),
  courseEnd: Yup.string().when("workAs", {
    is: (val: string) => ["college", "fresher"].includes(val),
    then: (schema) => schema.required("End date is required"),
    otherwise: (schema) => schema.optional(),
  }),
  city: Yup.string().required("City is required"),
  bio: Yup.string().max(500, "Bio must be 500 characters or less").optional(),
  schoolName: Yup.string().optional(),
  class: Yup.string().optional(),
  jobRole: Yup.string().optional(),
  company: Yup.string().optional(),
  totalExperience: Yup.string().optional(),
  startYear: Yup.string().optional(),
  endYear: Yup.string().optional(),
  achievements: Yup.string().optional(),
  linkedinUrl: Yup.string().url("Invalid URL").nullable().optional(),
  portfolioUrl: Yup.string().url("Invalid URL").nullable().optional(),
  interestedNewCareer: Yup.string().optional(),
  featuredArticle: Yup.string().optional(),
  mentorMotivation: Yup.string().optional(),
  shortInfo: Yup.string().optional(),
  skills: Yup.array().of(Yup.string()).optional(),
});

// EditableField component
const EditableField: React.FC<EditableFieldProps> = ({
  label,
  field,
  value,
  workAs,
  onEdit,
  isEditing = false,
  onSave,
  onChange,
  type = "text",
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleSaveWithValidation = async () => {
    try {
      await profileSchema.validateAt(field, {
        [field]: value,
        workAs: workAs,
      });
      setError(null);
      onSave?.();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setError(err.message);
      } else {
        console.error(err);
      }
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium">{label}</label>
        {!isEditing ? (
          <button
            onClick={onEdit}
            className="text-sm text-black hover:underline"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleSaveWithValidation}
            className="text-sm text-green-600 hover:underline"
          >
            Save
          </button>
        )}
      </div>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        readOnly={!isEditing}
        className="w-full bg-white"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

// Main MenteeProfile component
const MenteeProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [skillSearchTerm, setSkillSearchTerm] = useState("");
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  const presetSkills = [
    "Javascript",
    "Node JS",
    "Mongo DB",
    "React JS",
    "AWS",
    "Tailwind CSS",
    "Python",
    "Django",
    "SQL",
    "Docker",
  ];

  const { user, isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.user
  );

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    workAs: "",
    course: "",
    college: "",
    courseStart: "",
    courseEnd: "",
    city: "",
    bio: "",
    schoolName: "",
    class: "",
    jobRole: "",
    company: "",
    profilePicture: "",
    totalExperience: "",
    startYear: "",
    endYear: "",
    achievements: "",
    linkedinUrl: "",
    youtubeUrl: "",
    portfolioUrl: "",
    interestedNewCareer: "",
    featuredArticle: "",
    mentorMotivation: "",
    shortInfo: "MERN Stack Developer | Fresher",
    skills: [
      "Javascript",
      "Node JS",
      "Mongo DB",
      "React JS",
      "AWS",
      "Tailwind CSS",
    ],
  });

  // Populate profile data from Redux store on mount
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone ? String(user.phone) : "",
        email: user.email || "",
        workAs: user?.collegeDetails?.userType || "",
        course: user?.collegeDetails?.course || "",
        college: user?.collegeDetails?.collegeName || "",
        courseStart: user?.collegeDetails?.startDate?.slice(0, 10) || "",
        courseEnd: user?.collegeDetails?.endDate?.slice(0, 10) || "",
        city: user?.collegeDetails?.city || "",
        bio: user?.mentorId?.bio || "",
        schoolName: "",
        class: "",
        jobRole: "",
        company: "",
        totalExperience: "",
        startYear: "",
        endYear: "",
        achievements: user?.mentorId?.achievements?.[0] || "",
        linkedinUrl: "",
        youtubeUrl: "",
        profilePicture: user?.profilePicture || "",
        portfolioUrl: user?.mentorId?.portfolio || "",
        interestedNewCareer: user?.menteeId?.interestedNewcareer?.[0] || "",
        featuredArticle: user?.mentorId?.featuredArticle || "",
        mentorMotivation: user?.mentorId?.mentorMotivation || "",
        shortInfo: "MERN Stack Developer | Fresher",
        skills: [
          "Javascript",
          "Node JS",
          "Mongo DB",
          "React JS",
          "AWS",
          "Tailwind CSS",
        ],
      });
      setPreviewUrl(user.profilePicture || null);
    }
  }, [user]);

  // Update preview URL when profile picture changes
  useEffect(() => {
    if (user && user.profilePicture && !selectedFile) {
      setPreviewUrl(user.profilePicture);
    }
  }, [user, selectedFile]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsImageLoading(true);
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setIsImageLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save uploaded image to backend
  const handleImageSave = async () => {
    if (!selectedFile) {
      toast.error("No image selected to upload");
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      console.log("FormData entries:", [...formData.entries()]);
      const response = await uploadProfileImage(formData, accessToken);
      const newProfilePictureUrl = response.profilePicture;
      if (newProfilePictureUrl) {
        setPreviewUrl(newProfilePictureUrl);
        setProfileData((prev) => ({
          ...prev,
          profilePicture: newProfilePictureUrl,
        }));
      }
      toast.success("Profile image uploaded successfully");
      setSelectedFile(null);
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  // Update profile field and send to backend
  const updateProfileField = async (
    field: string,
    value: string | string[]
  ) => {
    try {
      await profileSchema.validateAt(field, {
        [field]: value,
        workAs: profileData.workAs,
      });
      let payload = {};
      if (
        [
          "workAs",
          "course",
          "college",
          "city",
          "courseStart",
          "courseEnd",
        ].includes(field)
      ) {
        payload = { collegeDetails: { [field]: value } };
      } else if (
        [
          "bio",
          "achievements",
          "portfolioUrl",
          "featuredArticle",
          "mentorMotivation",
          "shortInfo",
          "skills",
        ].includes(field)
      ) {
        payload = { mentorId: { [field]: value } };
      } else if (field === "interestedNewCareer") {
        payload = {
          menteeId: {
            interestedNewcareer: Array.isArray(value) ? value : [value],
          },
        };
      } else {
        payload = { [field]: value };
      }
      await updateUserProfile(payload, accessToken);
      setProfileData((prev) => ({ ...prev, [field]: value }));
      toast.success(`${field} updated successfully`);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        toast.error(error.message);
      } else {
        toast.error(`Failed to update ${field}`);
        console.error(error);
      }
    }
  };

  // Handle edit button click
  const handleEdit = (field: string) => {
    setEditingField(field);
  };

  // Handle save button click
  const handleSave = (
    fieldOrFields: string | { [key: string]: string },
    value?: string
  ) => {
    if (typeof fieldOrFields === "string") {
      updateProfileField(
        fieldOrFields,
        value || profileData[fieldOrFields as keyof typeof profileData]
      );
    } else if (fieldOrFields && typeof fieldOrFields === "object") {
      Object.entries(fieldOrFields).forEach(([key, val]) => {
        updateProfileField(key, val);
      });
    }
    setEditingField(null);
  };

  // Add a skill
  const addSkill = (skill: string) => {
    if (skill && !profileData.skills.includes(skill)) {
      setProfileData((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
      setSkillSearchTerm("");
    }
  };

  // Remove a skill
  const removeSkill = (index: number) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  // Filter skills for dropdown
  const filteredSkills = presetSkills.filter(
    (skill) =>
      skill.toLowerCase().includes(skillSearchTerm.toLowerCase()) &&
      !profileData.skills.includes(skill)
  );

  // Generate year options for dropdowns
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 21 }, (_, i) =>
    (currentYear - 20 + i).toString()
  );

  // Placeholder delete account function (replace with actual API call)
  const deleteAccount = async (accessToken: string) => {
    console.log("Deleting account...");
    // Example API call:
    // await fetch('/api/delete-account', {
    //   method: 'DELETE',
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    // });
  };

  return (
    <div className="flex-1 px-24">
      {/* Profile Header */}
      <div className="bg-black text-white p-8 rounded-t-xl relative">
        <div className="flex items-end gap-6">
          <div className="relative">
            <div className="flex flex-row justify-center items-center gap-4 mb-3">
              <Avatar className="h-24 w-24">
                {isImageLoading ? (
                  <AvatarFallback className="bg-gray-100 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                  </AvatarFallback>
                ) : previewUrl ? (
                  <AvatarImage src={previewUrl} />
                ) : user?.profilePicture ? (
                  <AvatarImage src={user.profilePicture} />
                ) : (
                  <AvatarFallback className="bg-gray-100">
                    <UploadIcon className="h-8 w-8 text-gray-400" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <button
                  className="bg-green-500 p-1 rounded-full"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                  disabled={isImageLoading}
                >
                  {isImageLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Pencil size={16} />
                  )}
                </button>
                {selectedFile && (
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm"
                    onClick={handleImageSave}
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Save"}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="relative flex-1">
            <h2 className="text-3xl font-bold mb-1">
              {user?.firstName} {user?.lastName}
            </h2>
            {/* Short Info Editing */}
            <div className="mt-2">
              {editingField === "shortInfo" ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={profileData.shortInfo}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        shortInfo: e.target.value,
                      }))
                    }
                    className="w-full text-sm text-gray-300"
                  />
                  <button
                    onClick={() =>
                      handleSave("shortInfo", profileData.shortInfo)
                    }
                    className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <p className="text-gray-300 text-sm">
                    {profileData.shortInfo}
                  </p>
                  <button
                    onClick={() => handleEdit("shortInfo")}
                    className="ml-2 bg-green-500 p-1 rounded-full"
                  >
                    <Pencil size={16} />
                  </button>
                </div>
              )}
            </div>
            {/* Skills Editing */}
            <div className="mt-2">
              {editingField === "skills" ? (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 flex-wrap">
                    {profileData.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        {skill}
                        <XIcon
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => removeSkill(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        placeholder="Search or add a skill"
                        value={skillSearchTerm}
                        onChange={(e) => {
                          setSkillSearchTerm(e.target.value);
                          setShowSkillDropdown(true);
                        }}
                        onFocus={() => setShowSkillDropdown(true)}
                        className="w-full text-sm text-gray-300"
                      />
                      <SearchIcon className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                      {showSkillDropdown && filteredSkills.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredSkills.map((skill, index) => (
                            <div
                              key={index}
                              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-black"
                              onClick={() => {
                                addSkill(skill);
                                setShowSkillDropdown(false);
                              }}
                            >
                              {skill}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleSave("skills", profileData.skills)}
                      className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <p className="text-gray-300 text-sm">
                    {profileData.skills.join(" | ")}
                  </p>
                  <button
                    onClick={() => handleEdit("skills")}
                    className="ml-2 bg-green-500 p-1 rounded-full"
                  >
                    <Pencil size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Modal for Image Upload */}
      <Dialog open={isUploading} onOpenChange={setIsUploading}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col items-center justify-center p-6">
            <img
              src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif"
              alt="Uploading Animation"
              className="w-32 h-32 mb-4"
            />
            <p className="text-lg font-semibold">Uploading your image...</p>
            <p className="text-sm text-gray-500">
              Please wait while this cat dances for you!
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tabs Section */}
      <div className="bg-white rounded-b-xl p-24 min-h-screen">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="flex gap-8 border-b mb-8">
            <Tabs.Trigger
              value="overview"
              className={`pb-4 ${
                activeTab === "overview" ? "border-b-2 border-black" : ""
              }`}
            >
              Overview
            </Tabs.Trigger>
            <Tabs.Trigger
              value="as-mentee"
              className={`pb-4 ${
                activeTab === "as-mentee" ? "border-b-2 border-black" : ""
              }`}
            >
              As Mentee
            </Tabs.Trigger>
            <Tabs.Trigger
              value="experience"
              className={`pb-4 ${
                activeTab === "experience" ? "border-b-2 border-black" : ""
              }`}
            >
              More
            </Tabs.Trigger>
          </Tabs.List>

          {/* Tab 1: Overview */}
          <Tabs.Content value="overview">
            <div className="max-w-2xl">
              <EditableField
                label="First Name"
                field="firstName"
                value={profileData.firstName}
                workAs={profileData.workAs}
                onEdit={() => handleEdit("firstName")}
                isEditing={editingField === "firstName"}
                onSave={() => handleSave("firstName", profileData.firstName)}
                onChange={(value) =>
                  setProfileData((prev) => ({ ...prev, firstName: value }))
                }
              />
              <EditableField
                label="Last Name"
                field="lastName"
                value={profileData.lastName}
                workAs={profileData.workAs}
                onEdit={() => handleEdit("lastName")}
                isEditing={editingField === "lastName"}
                onSave={() => handleSave("lastName", profileData.lastName)}
                onChange={(value) =>
                  setProfileData((prev) => ({ ...prev, lastName: value }))
                }
              />
              <EditableField
                label="Phone"
                field="phone"
                value={profileData.phone}
                workAs={profileData.workAs}
                onEdit={() => handleEdit("phone")}
                isEditing={editingField === "phone"}
                onSave={() => handleSave("phone", profileData.phone)}
                type="tel"
                onChange={(value) =>
                  setProfileData((prev) => ({ ...prev, phone: value }))
                }
              />
              {editingField === "password" ? (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Password</label>
                    <button
                      onClick={() => handleSave("password")}
                      className="text-sm text-green-600 hover:underline"
                    >
                      Save
                    </button>
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="New Password"
                      className="w-full"
                    />
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      className="w-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Password</label>
                    <button
                      onClick={() => handleEdit("password")}
                      className="text-sm text-black hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    User Since 7:05PM, 7th March 2025
                  </p>
                </div>
              )}
              <Button
                variant="outline"
                className="text-red-500 border-red-500 hover:bg-red-50"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete your account? This action cannot be undone."
                    )
                  ) {
                    deleteAccount(accessToken)
                      .then(() => {
                        toast.success("Account deleted successfully");
                        // Redirect to login or home page
                        // window.location.href = "/login";
                      })
                      .catch((error) => {
                        toast.error("Failed to delete account");
                        console.error(error);
                      });
                  }
                }}
              >
                Delete Account
              </Button>
            </div>
          </Tabs.Content>

          {/* Tab 2: As Mentee */}
          <Tabs.Content value="as-mentee">
            <div className="max-w-2xl">
              {user?.collegeDetails?.userType === "school" && (
                <>
                  <EditableField
                    label="School Name"
                    field="schoolName"
                    value={profileData.schoolName}
                    workAs={profileData.workAs}
                    onEdit={() => handleEdit("schoolName")}
                    isEditing={editingField === "schoolName"}
                    onSave={() =>
                      handleSave("schoolName", profileData.schoolName)
                    }
                    onChange={(value) =>
                      setProfileData((prev) => ({ ...prev, schoolName: value }))
                    }
                  />
                  <EditableField
                    label="Class"
                    field="class"
                    value={profileData.class}
                    workAs={profileData.workAs}
                    onEdit={() => handleEdit("class")}
                    isEditing={editingField === "class"}
                    onSave={() => handleSave("class", profileData.class)}
                    onChange={(value) =>
                      setProfileData((prev) => ({ ...prev, class: value }))
                    }
                  />
                  <EditableField
                    label="City"
                    field="city"
                    value={profileData.city}
                    workAs={profileData.workAs}
                    onEdit={() => handleEdit("city")}
                    isEditing={editingField === "city"}
                    onSave={() => handleSave("city", profileData.city)}
                    onChange={(value) =>
                      setProfileData((prev) => ({ ...prev, city: value }))
                    }
                  />
                </>
              )}
              {user?.collegeDetails?.userType === "professional" && (
                <>
                  <EditableField
                    label="Job Role"
                    field="jobRole"
                    value={profileData.jobRole}
                    workAs={profileData.workAs}
                    onEdit={() => handleEdit("jobRole")}
                    isEditing={editingField === "jobRole"}
                    onSave={() => handleSave("jobRole", profileData.jobRole)}
                    onChange={(value) =>
                      setProfileData((prev) => ({ ...prev, jobRole: value }))
                    }
                  />
                  <EditableField
                    label="Company"
                    field="company"
                    value={profileData.company}
                    workAs={profileData.workAs}
                    onEdit={() => handleEdit("company")}
                    isEditing={editingField === "company"}
                    onSave={() => handleSave("company", profileData.company)}
                    onChange={(value) =>
                      setProfileData((prev) => ({ ...prev, company: value }))
                    }
                  />
                  <EditableField
                    label="Total Experience"
                    field="totalExperience"
                    value={profileData.totalExperience}
                    workAs={profileData.workAs}
                    onEdit={() => handleEdit("totalExperience")}
                    isEditing={editingField === "totalExperience"}
                    onSave={() =>
                      handleSave("totalExperience", profileData.totalExperience)
                    }
                    onChange={(value) =>
                      setProfileData((prev) => ({
                        ...prev,
                        totalExperience: value,
                      }))
                    }
                  />
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium">Start Year</label>
                      {editingField === "startYear" ? (
                        <button
                          onClick={() =>
                            handleSave("startYear", profileData.startYear)
                          }
                          className="text-sm text-green-600 hover:underline"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit("startYear")}
                          className="text-sm text-black hover:underline"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    <select
                      value={profileData.startYear}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          startYear: e.target.value,
                        }))
                      }
                      disabled={editingField !== "startYear"}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select Year</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium">End Year</label>
                      {editingField === "endYear" ? (
                        <button
                          onClick={() =>
                            handleSave("endYear", profileData.endYear)
                          }
                          className="text-sm text-green-600 hover:underline"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit("endYear")}
                          className="text-sm text-black hover:underline"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    <select
                      value={profileData.endYear}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          endYear: e.target.value,
                        }))
                      }
                      disabled={editingField !== "endYear"}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select Year</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              {(user?.collegeDetails?.userType === "college" ||
                user?.collegeDetails?.userType === "fresher") && (
                <>
                  <EditableField
                    label="Work As"
                    field="workAs"
                    value={profileData.workAs}
                    workAs={profileData.workAs}
                    onEdit={() => handleEdit("workAs")}
                    isEditing={editingField === "workAs"}
                    onSave={() => handleSave("workAs", profileData.workAs)}
                    onChange={(value) =>
                      setProfileData((prev) => ({ ...prev, workAs: value }))
                    }
                  />
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium">Course</label>
                      {editingField === "course" ? (
                        <button
                          onClick={() =>
                            handleSave("course", profileData.course)
                          }
                          className="text-sm text-green-600 hover:underline"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit("course")}
                          className="text-sm text-black hover:underline"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    <select
                      value={profileData.course}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          course: e.target.value,
                        }))
                      }
                      disabled={editingField !== "course"}
                      className="text-sm w-full p-2 border rounded-md"
                    >
                      <option value="btech">B-Tech (Computer Science)</option>
                      <option value="mtech">M-Tech</option>
                      {/* Add more options as needed */}
                    </select>
                  </div>
                  <EditableField
                    label="College"
                    field="college"
                    value={profileData.college}
                    workAs={profileData.workAs}
                    onEdit={() => handleEdit("college")}
                    isEditing={editingField === "college"}
                    onSave={() => handleSave("college", profileData.college)}
                    onChange={(value) =>
                      setProfileData((prev) => ({ ...prev, college: value }))
                    }
                  />
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium">
                        Course Duration
                      </label>
                      {editingField === "courseDuration" ? (
                        <button
                          onClick={() =>
                            handleSave({
                              courseStart: profileData.courseStart,
                              courseEnd: profileData.courseEnd,
                            })
                          }
                          className="text-sm text-green-600 hover:underline"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit("courseDuration")}
                          className="text-sm text-black hover:underline"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <select
                        value={
                          profileData.courseStart
                            ? profileData.courseStart.split("-")[0]
                            : ""
                        }
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            courseStart: `${e.target.value}-01-01`,
                          }))
                        }
                        disabled={editingField !== "courseDuration"}
                        className="w-1/2 p-2 border rounded-md"
                      >
                        <option value="">Select Start Year</option>
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <select
                        value={
                          profileData.courseEnd
                            ? profileData.courseEnd.split("-")[0]
                            : ""
                        }
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            courseEnd: `${e.target.value}-12-31`,
                          }))
                        }
                        disabled={editingField !== "courseDuration"}
                        className="w-1/2 p-2 border rounded-md"
                      >
                        <option value="">Select End Year</option>
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <EditableField
                    label="City"
                    field="city"
                    value={profileData.city}
                    workAs={profileData.workAs}
                    onEdit={() => handleEdit("city")}
                    isEditing={editingField === "city"}
                    onSave={() => handleSave("city", profileData.city)}
                    onChange={(value) =>
                      setProfileData((prev) => ({ ...prev, city: value }))
                    }
                  />
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium">Bio</label>
                      {editingField === "bio" ? (
                        <button
                          onClick={() => handleSave("bio", profileData.bio)}
                          className="text-sm text-green-600 hover:underline"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit("bio")}
                          className="text-sm text-black hover:underline"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    <textarea
                      className="w-full p-2 border rounded-md h-32"
                      placeholder="Enter about yourself"
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      readOnly={editingField !== "bio"}
                    />
                  </div>
                </>
              )}
            </div>
          </Tabs.Content>

          {/* Tab 3: More */}
          <Tabs.Content value="experience">
            <div className="max-w-2xl">
              <EditableField
                label="Achievements"
                field="achievements"
                value={profileData.achievements}
                workAs={profileData.workAs}
                onEdit={() => handleEdit("achievements")}
                isEditing={editingField === "achievements"}
                onSave={() =>
                  handleSave("achievements", profileData.achievements)
                }
                onChange={(value) =>
                  setProfileData((prev) => ({ ...prev, achievements: value }))
                }
              />
              <EditableField
                label="LinkedIn URL"
                field="linkedinUrl"
                value={profileData.linkedinUrl}
                workAs={profileData.workAs}
                onEdit={() => handleEdit("linkedinUrl")}
                isEditing={editingField === "linkedinUrl"}
                onSave={() =>
                  handleSave("linkedinUrl", profileData.linkedinUrl)
                }
                onChange={(value) =>
                  setProfileData((prev) => ({ ...prev, linkedinUrl: value }))
                }
              />
              <EditableField
                label="Portfolio URL"
                field="portfolioUrl"
                value={profileData.portfolioUrl}
                workAs={profileData.workAs}
                onEdit={() => handleEdit("portfolioUrl")}
                isEditing={editingField === "portfolioUrl"}
                onSave={() =>
                  handleSave("portfolioUrl", profileData.portfolioUrl)
                }
                onChange={(value) =>
                  setProfileData((prev) => ({ ...prev, portfolioUrl: value }))
                }
              />
              <EditableField
                label="Interested New Career"
                field="interestedNewCareer"
                value={profileData.interestedNewCareer}
                workAs={profileData.workAs}
                onEdit={() => handleEdit("interestedNewCareer")}
                isEditing={editingField === "interestedNewCareer"}
                onSave={() =>
                  handleSave(
                    "interestedNewCareer",
                    profileData.interestedNewCareer
                  )
                }
                onChange={(value) =>
                  setProfileData((prev) => ({
                    ...prev,
                    interestedNewCareer: value,
                  }))
                }
              />
              <EditableField
                label="Featured Article"
                field="featuredArticle"
                value={profileData.featuredArticle}
                workAs={profileData.workAs}
                onEdit={() => handleEdit("featuredArticle")}
                isEditing={editingField === "featuredArticle"}
                onSave={() =>
                  handleSave("featuredArticle", profileData.featuredArticle)
                }
                onChange={(value) =>
                  setProfileData((prev) => ({
                    ...prev,
                    featuredArticle: value,
                  }))
                }
              />
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
};

export default MenteeProfile;
