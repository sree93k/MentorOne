import React, { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SreeImg from "@/assets/Sree.jpeg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import { setError, setUser, setLoading } from "@/redux/slices/userSlice";
import { getUserDetails } from "@/services/mentorService";
import { updateUserProfile, updateUserPassword } from "@/services/userServices";
import toast from "react-hot-toast";
import { CircleCheckBig, EyeIcon, EyeOffIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { XIcon, SearchIcon } from "lucide-react";
import { Pencil, UploadIcon, Loader2 } from "lucide-react";
import { uploadProfileImage } from "@/services/uploadService";
// Adjust based on your Redux setup
import * as Yup from "yup"; // For validation schema
import { Textarea } from "@/components/ui/textarea";

const profileSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "Too short")
    .matches(
      /^[A-Za-z]+$/,
      "First name must contain only letters (no spaces or numbers)"
    )
    .test(
      "no-whitespace",
      "First name cannot be empty or whitespace",
      (value) => value?.trim().length !== 0
    ),
  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Too short")
    .matches(
      /^[A-Za-z]+$/,
      "Last name must contain only letters (no spaces or numbers)"
    )
    .test(
      "no-whitespace",
      "Last name cannot be empty or whitespace",
      (value) => value?.trim().length !== 0
    ),
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
  mentorMotivation: Yup.string().optional(),
  shortInfo: Yup.string().optional(),
  skills: Yup.array().of(Yup.string()).optional(),
  achievements: Yup.array().of(Yup.string()).optional(),
  linkedin: Yup.string().url("Invalid URL").nullable().optional(),
  portfolio: Yup.string().url("Invalid URL").nullable().optional(),
  interestedNewCareer: Yup.array().of(Yup.string()).optional(),
  featuredArticle: Yup.string().optional(),
});

const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/\d/, "Must contain at least one number")
    .matches(/[@$!%*?&]/, "Must contain at least one special character")
    .test(
      "not-same-as-current",
      "New password must be different from current password",
      function (value) {
        return value !== this.parent.currentPassword;
      }
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your new password"),
});

interface EditableFieldProps {
  label: string;
  field: string;
  value: string | string[]; // Allow string or string[]
  workAs: string;
  onEdit: () => void;
  isEditing?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  onChange?: (value: string | string[]) => void; // Update to handle string or string[]
  type?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  field,
  value,
  workAs,
  onEdit,
  isEditing = false,
  onSave,
  onCancel,
  onChange,
  type = "text",
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleSaveWithValidation = async () => {
    try {
      // Convert string value to array if field is achievements or interestedNewCareer
      const validationValue =
        field === "achievements" || field === "interestedNewCareer"
          ? value
              .toString()
              .split(",")
              .map((v) => v.trim())
              .filter(Boolean)
          : value;

      await profileSchema.validateAt(field, {
        [field]: validationValue,
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

  // Convert array to string for input display
  const displayValue = Array.isArray(value) ? value.join(", ") : value;

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
          <div className="flex gap-2">
            <button
              onClick={handleSaveWithValidation}
              className="text-sm text-green-600 hover:underline"
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className="text-sm text-red-600 hover:underline"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      <Input
        type={type}
        value={displayValue}
        readOnly={!isEditing}
        onChange={(e) =>
          onChange &&
          onChange(
            field === "achievements" || field === "interestedNewCareer"
              ? e.target.value
              : e.target.value
          )
        }
        className="w-full bg-white"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
const MentorProfile: React.FC = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("profile");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // const [loading, setLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [skillSearchTerm, setSkillSearchTerm] = useState("");
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // const user = useSelector((state: RootState) => state.user.user);
  const { user, error, loading, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
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

  // Single profileData state
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
    shortInfo: "",
    skills: [] as string[],
  });

  // Fetch user details from server on mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user && user._id) {
        try {
          const userDetails = await getUserDetails(user._id);
          console.log(">>>>>>getUserDetails fetched>>>", userDetails);

          setProfileData(userDetails.data.response);
          setPreviewUrl(userDetails.data.response.profilePicture || null);
          console.log("prifile dataa is **********", profileData);
        } catch (error) {
          console.error("Failed to fetch user details", error);
          toast.error("Failed to load profile data.");
        } finally {
          dispatch(setLoading(false));
        }
      } else {
        dispatch(setLoading(false));
        toast.error("User not found. Please log in again.");
      }
    };
    fetchUserDetails();
  }, [user]);

  // Remove the second useEffect that overwrites profileData from Redux to avoid conflicts

  // Password validation
  useEffect(() => {
    const validate = async () => {
      try {
        await passwordSchema.validate(
          { currentPassword, newPassword, confirmPassword },
          { abortEarly: false }
        );
        setErrors({});
        setIsFormValid(true);
      } catch (validationErrors: any) {
        const errorObj: Record<string, string> = {};
        validationErrors.inner.forEach((err: any) => {
          errorObj[err.path] = err.message;
        });
        setErrors(errorObj);
        setIsFormValid(false);
      }
    };
    validate();
  }, [currentPassword, newPassword, confirmPassword]);

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

  const handleImageSave = async () => {
    if (!selectedFile) {
      toast.error("No image selected to upload");
      return;
    }
    dispatch(setLoading(true));
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      console.log("FormData entries:", [...formData.entries()]);
      console.log("mentee rpofile poage formdata image", formData);

      const response = await uploadProfileImage(formData);
      console.log("response of image uplaodi us ", response);

      const newProfilePictureUrl = response?.profilePicture;
      if (newProfilePictureUrl) {
        setPreviewUrl(newProfilePictureUrl);
        setProfileData((prev) => ({
          ...prev,
          profilePicture: newProfilePictureUrl,
        }));
      }
      toast.success("Profile image uploaded successfully");
      dispatch(setUser(response.data.data));
      setSelectedFile(null);
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEdit = (field: string) => {
    setEditingField(field);
  };

  const handleCancel = (field: string) => {
    setEditingField(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const updateProfileField = async (
    field: string,
    value: string | string[]
  ) => {
    try {
      await profileSchema.validateAt(field, { [field]: value });
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
          "profilePicture",
        ].includes(field)
      ) {
        payload = { [field]: value };
      } else if (field === "interestedNewCareer") {
        payload = {
          menteeId: {
            interestedNewcareer: Array.isArray(value) ? value : [value],
          },
        };
      } else {
        payload = { [field]: value };
      }
      const updateData = await updateUserProfile(payload);
      setProfileData((prev) => ({ ...prev, [field]: value }));
      dispatch(setUser(updateData));
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

  const handleSave = async (field: string, value: string | string[]) => {
    await updateProfileField(field, value);
    setEditingField(null);
  };

  const addSkill = (skill: string) => {
    if (skill && !profileData.skills.includes(skill)) {
      const updatedSkills = [...profileData.skills, skill];
      setProfileData((prev) => ({ ...prev, skills: updatedSkills }));
      setSkillSearchTerm("");
    }
  };

  const removeSkill = (index: number) => {
    const updatedSkills = profileData.skills.filter((_, i) => i !== index);
    setProfileData((prev) => ({ ...prev, skills: updatedSkills }));
  };

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

  const handlePasswordUpdate = async () => {
    try {
      await passwordSchema.validate(
        { currentPassword, newPassword, confirmPassword },
        { abortEarly: false }
      );
      setIsPasswordUpdating(true);
      const response = await updateUserPassword(currentPassword, newPassword);
      if (response && response.status === 200) {
        toast.success(response.data.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        setEditingField(null);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      if (error.name === "ValidationError") {
        error.inner.forEach((err: any) => {
          toast.error(err.message);
        });
      } else {
        toast.error("An error occurred while updating password");
        console.error(error);
      }
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  // if (loading) {
  //   return <div className="px-24 p-6">Loading profile data...</div>;
  // }

  if (!profileData) {
    return <div className="px-24 p-6">No profile data found.</div>;
  }

  return (
    <div className="flex-1 mx-36 border rounded-xl">
      <div className="bg-red-500 text-white p-8 rounded-t-xl relative">
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
              {profileData.firstName} {profileData.lastName}
            </h2>
            <div className="mt-2">
              {editingField === "shortInfo" ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={profileData.shortInfo}
                    placeholder="Enter Short Info"
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
                  <p
                    className={`text-sm ${
                      profileData?.shortInfo
                        ? "text-white"
                        : "text-white italic"
                    }`}
                  >
                    {profileData?.shortInfo || "Enter Short Intro"}
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
                  <p
                    className={`text-sm ${
                      profileData?.skills?.length > 0
                        ? "text-white"
                        : "text-white italic"
                    }`}
                  >
                    {profileData?.skills?.length > 0
                      ? profileData.skills.join(" | ")
                      : "Enter the Skills"}
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
      <div className="bg-white rounded-b-xl p-8 min-h-screen">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="flex gap-8 border-b mb-8">
            <Tabs.Trigger
              value="profile"
              className={`pb-4 ${
                activeTab === "profile" ? "border-b-2 border-black" : ""
              }`}
            >
              Profile
            </Tabs.Trigger>
            <Tabs.Trigger
              value="experience"
              className={`pb-4 ${
                activeTab === "experience" ? "border-b-2 border-black" : ""
              }`}
            >
              Experience
            </Tabs.Trigger>
            <Tabs.Trigger
              value="links"
              className={`pb-4 ${
                activeTab === "links" ? "border-b-2 border-black" : ""
              }`}
            >
              Links
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="profile">
            <div className="max-w-2xl">
              <div className="pb-6">
                <label className="text-sm bold py-3 font-medium">Email</label>
                <div className="flex items-center">
                  <p className="px-4 text-sm text-green-600">
                    {profileData.email}
                  </p>
                  <CircleCheckBig
                    size={22}
                    color="#198041"
                    strokeWidth={1.75}
                  />
                </div>
              </div>
              <EditableField
                label="First Name"
                field="firstName"
                value={profileData.firstName}
                workAs={profileData.workAs}
                onEdit={() => handleEdit("firstName")}
                isEditing={editingField === "firstName"}
                onSave={() => handleSave("firstName", profileData.firstName)}
                onCancel={() => handleCancel("firstName")}
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
                onCancel={() => handleCancel("lastName")}
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
                onCancel={() => handleCancel("phone")}
                type="tel"
                onChange={(value) =>
                  setProfileData((prev) => ({ ...prev, phone: value }))
                }
              />
              {editingField === "password" ? (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Password</label>
                  </div>
                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full"
                      />
                      {errors.currentPassword && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.currentPassword}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-2 top-2.5"
                      >
                        {showCurrentPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-2 top-2.5"
                      >
                        {showNewPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-2 top-2.5"
                      >
                        {showConfirmPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                    <div className="flex gap-4">
                      <Button
                        onClick={handlePasswordUpdate}
                        disabled={
                          !currentPassword ||
                          !newPassword ||
                          !confirmPassword ||
                          newPassword !== confirmPassword ||
                          isPasswordUpdating ||
                          !isFormValid
                        }
                        className="text-sm flex-1 text-green-600 hover:underline"
                      >
                        {isPasswordUpdating ? "Updating..." : "Save Password"}
                      </Button>
                      <button
                        className="text-sm flex-1 text-red-600 hover:underline"
                        onClick={() => handleCancel("password")}
                      >
                        Cancel
                      </button>
                    </div>
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
                    Change password at least every month for security.
                  </p>
                </div>
              )}

              {editingField === "bio" ? (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Bio
                  </label>
                  <Textarea
                    placeholder="Write something about yourself..."
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                    rows={4}
                    // className="w-full"
                    className="w-full border border-gray-300 focus-visible:ring-0 focus-visible:outline-none"
                  />
                  <div className="mt-2 flex gap-3">
                    <button
                      onClick={() => handleSave("bio", profileData.bio)}
                      className="text-green-600 hover:underline text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => handleCancel("bio")}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <button
                      onClick={() => handleEdit("bio")}
                      className="text-sm text-black hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {profileData.bio || ""}
                  </p>
                </div>
              )}
            </div>
          </Tabs.Content>
          {/* tab2  */}
          <Tabs.Content value="experience">
            <div className="max-w-2xl">
              {profileData?.schoolDetails?.userType === "school" && (
                <>
                  <EditableField
                    label="School Name"
                    field="schoolName"
                    value={profileData?.schoolDetails?.schoolName}
                    workAs={profileData.workAs}
                    onEdit={() => handleEdit("schoolName")}
                    isEditing={editingField === "schoolName"}
                    onSave={() =>
                      handleSave(
                        "schoolName",
                        profileData?.schoolDetails?.schoolName
                      )
                    }
                    onChange={(value) =>
                      setProfileData((prev) => ({ ...prev, schoolName: value }))
                    }
                  />
                  <EditableField
                    label="Class"
                    field="class"
                    value={profileData?.schoolDetails?.class}
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
                    value={profileData?.schoolDetails?.city}
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
              {profileData?.professionalDetails?.userType ===
                "professional" && (
                <>
                  <EditableField
                    label="Job Role"
                    field="jobRole"
                    value={profileData?.professionalDetails?.jobRole}
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
                    value={profileData?.professionalDetails?.company}
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
                    value={profileData?.professionalDetails?.experience}
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
                            handleSave(
                              "startDate",
                              profileData?.professionalDetails?.startDate
                            )
                          }
                          className="text-sm text-green-600 hover:underline"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit("startDate")}
                          className="text-sm text-black hover:underline"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    <select
                      value={profileData?.professionalDetails?.startDate}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          startYear: e.target.value,
                        }))
                      }
                      disabled={editingField !== "startDate"}
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
                      {editingField === "endDate" ? (
                        <button
                          onClick={() =>
                            handleSave(
                              "endDate",
                              profileData?.professionalDetails?.endDate
                            )
                          }
                          className="text-sm text-green-600 hover:underline"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit("endDate")}
                          className="text-sm text-black hover:underline"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    <select
                      value={profileData?.professionalDetails?.endDate}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          endYear: e.target.value,
                        }))
                      }
                      disabled={editingField !== "endDate"}
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
              {(profileData?.collegeDetails?.userType === "college" ||
                profileData?.collegeDetails?.userType === "fresher") && (
                <>
                  <EditableField
                    label="Specialized In"
                    field="specializedIn"
                    value={profileData?.collegeDetails?.specializedIn}
                    workAs={profileData.workAs}
                    onEdit={() => handleEdit("specializedIn")}
                    isEditing={editingField === "specializedIn"}
                    onSave={() =>
                      handleSave(
                        "specializedIn",
                        profileData?.collegeDetails?.specializedIn
                      )
                    }
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
                            handleSave(
                              "course",
                              profileData?.collegeDetails?.course
                            )
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
                      value={profileData?.collegeDetails?.course}
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
                    label="College Name"
                    field="college"
                    value={profileData?.collegeDetails?.collegeName}
                    workAs={profileData?.collegeDetails?.collegeName}
                    onEdit={() => handleEdit("college")}
                    isEditing={editingField === "college"}
                    onSave={() =>
                      handleSave(
                        "college",
                        profileData?.collegeDetails?.collegeName
                      )
                    }
                    onChange={(value) =>
                      setProfileData((prev) => ({ ...prev, college: value }))
                    }
                  />
                  {/* <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium">
                        Course Duration
                      </label>
                      {editingField === "courseDuration" ? (
                        <button
                          onClick={() =>
                            handleSave({
                              courseStart:
                                profileData?.collegeDetails?.startDate,
                              courseEnd: profileData?.collegeDetails?.endDate,
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
                          profileData?.collegeDetails?.startDate
                            ? profileData?.collegeDetails?.startDate.split(
                                "-"
                              )[0]
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
                          profileData?.collegeDetails?.endDate
                            ? profileData?.collegeDetails?.endDate.split("-")[0]
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
                  </div> */}
                  <EditableField
                    label="City"
                    field="city"
                    value={profileData?.collegeDetails?.city}
                    workAs={profileData?.collegeDetails?.city}
                    onEdit={() => handleEdit("city")}
                    isEditing={editingField === "city"}
                    onSave={() =>
                      handleSave("city", profileData?.collegeDetails?.city)
                    }
                    onChange={(value) =>
                      setProfileData((prev) => ({ ...prev, city: value }))
                    }
                  />
                </>
              )}
            </div>
          </Tabs.Content>

          {/* <Tabs.Content value="links">
            <div className="max-w-2xl">
              <EditableField
                label="Achievements"
                value={profileData.achievements}
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
                value={profileData.linkedinUrl}
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
                value={profileData.portfolioUrl}
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
                value={profileData.interestedNewCareer}
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
                value={profileData.featuredArticle}
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
          </Tabs.Content> */}
          <Tabs.Content value="links">
            <div className="max-w-2xl">
              <EditableField
                label="Achievements"
                field="achievements" // Added field prop
                value={profileData.achievements || []} // Ensure array or empty array
                workAs={profileData.workAs} // Added workAs prop
                onEdit={() => handleEdit("achievements")}
                isEditing={editingField === "achievements"}
                onSave={() =>
                  handleSave(
                    "achievements",
                    profileData.achievements
                      .toString()
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean)
                  )
                }
                onCancel={() => handleCancel("achievements")} // Added onCancel
                onChange={(value) =>
                  setProfileData((prev) => ({ ...prev, achievements: value }))
                }
              />
              {/* <EditableField
                label="LinkedIn URL"
                field="linkedinUrl" // Added field prop
                value={profileData?.mentorId?.linkedinUrl || ""} // Ensure string
                workAs={profileData.workAs} // Added workAs prop
                onEdit={() => handleEdit("linkedinUrl")}
                isEditing={editingField === "linkedinUrl"}
                onSave={() =>
                  handleSave("linkedinUrl", profileData.linkedinUrl)
                }
                onCancel={() => handleCancel("linkedinUrl")} // Added onCancel
                onChange={(value) =>
                  setProfileData((prev) => ({ ...prev, linkedinUrl: value }))
                }
              /> */}
              <EditableField
                label="Portfolio URL"
                field="portfolioUrl" // Added field prop
                value={profileData?.mentorId?.portfolio || ""} // Ensure string
                workAs={profileData.workAs} // Added workAs prop
                onEdit={() => handleEdit("portfolioUrl")}
                isEditing={editingField === "portfolioUrl"}
                onSave={() =>
                  handleSave("portfolioUrl", profileData.portfolioUrl)
                }
                onCancel={() => handleCancel("portfolioUrl")} // Added onCancel
                onChange={(value) =>
                  setProfileData((prev) => ({ ...prev, portfolioUrl: value }))
                }
              />
              <EditableField
                label="Interested New Career"
                field="interestedNewCareer" // Added field prop
                value={profileData?.mentorId?.interestedNewCareer || []} // Ensure array or empty array
                workAs={profileData.workAs} // Added workAs prop
                onEdit={() => handleEdit("interestedNewCareer")}
                isEditing={editingField === "interestedNewCareer"}
                onSave={() =>
                  handleSave(
                    "interestedNewCareer",
                    profileData.interestedNewCareer
                      .toString()
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean)
                  )
                }
                onCancel={() => handleCancel("interestedNewCareer")} // Added onCancel
                onChange={(value) =>
                  setProfileData((prev) => ({
                    ...prev,
                    interestedNewCareer: value,
                  }))
                }
              />
              <EditableField
                label="Featured Article"
                field="featuredArticle" // Added field prop
                value={profileData?.mentorId?.featuredArticle || ""} // Ensure string
                workAs={profileData.workAs} // Added workAs prop
                onEdit={() => handleEdit("featuredArticle")}
                isEditing={editingField === "featuredArticle"}
                onSave={() =>
                  handleSave("featuredArticle", profileData.featuredArticle)
                }
                onCancel={() => handleCancel("featuredArticle")} // Added onCancel
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

export default MentorProfile;
