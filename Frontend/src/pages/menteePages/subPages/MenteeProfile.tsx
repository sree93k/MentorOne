// import React, { useState, useEffect } from "react";
// import * as Tabs from "@radix-ui/react-tabs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Pencil,
//   UploadIcon,
//   Loader2,
//   EyeIcon,
//   EyeOffIcon,
//   XIcon,
//   CircleCheckBig,
//   SearchIcon,
// } from "lucide-react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import { setError, setUser, setLoading } from "@/redux/slices/userSlice";
// import { updateUserProfile, updateUserPassword } from "@/services/userServices";
// import { uploadProfileImage } from "@/services/uploadService";
// import { toast } from "react-hot-toast";
// import { Badge } from "@/components/ui/badge";
// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import * as Yup from "yup";
// import { userProfileData } from "@/services/menteeService";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { ProfilePicture } from "@/components/users/SecureMedia";

// const profileSchema = Yup.object().shape({
//   firstName: Yup.string()
//     .required("First name is required")
//     .min(2, "Too short")
//     .matches(/^[A-Za-z]+$/, "First name must contain only letters"),
//   lastName: Yup.string()
//     .required("Last name is required")
//     .min(2, "Too short")
//     .matches(/^[A-Za-z]+$/, "Last name must contain only letters"),
//   phone: Yup.string()
//     .matches(/^\d{10}$/, "Phone number must be 10 digits")
//     .required("Phone number is required"),
//   email: Yup.string().email("Invalid email").required("Email is required"),
//   bio: Yup.string().max(500, "Bio must be 500 characters or less").optional(),
//   skills: Yup.array().of(Yup.string()).optional(),
// });

// const schoolDetailsSchema = Yup.object().shape({
//   schoolName: Yup.string().required("School name is required"),
//   class: Yup.string().required("Class is required"),
//   city: Yup.string().required("City is required"),
//   startDate: Yup.string().required("Start year is required"),
//   endDate: Yup.string().required("End year is required"),
//   userType: Yup.string()
//     .oneOf(["school"], "Invalid user type")
//     .required("User type is required"),
// });

// const collegeDetailsSchema = Yup.object().shape({
//   collegeName: Yup.string().required("College name is required"),
//   course: Yup.string().required("Course is required"),
//   specializedIn: Yup.string().optional(),
//   city: Yup.string().required("City is required"),
//   startDate: Yup.string().required("Start year is required"),
//   endDate: Yup.string().required("End year is required"),
//   userType: Yup.string()
//     .oneOf(["college", "fresher"], "Invalid user type")
//     .required("User type is required"),
// });

// const professionalDetailsSchema = Yup.object().shape({
//   jobRole: Yup.string().required("Job role is required"),
//   company: Yup.string().required("Company is required"),
//   experience: Yup.string().required("Experience is required"),
//   city: Yup.string().required("City is required"),
//   startDate: Yup.string().required("Start year is required"),
//   endDate: Yup.string().optional(),
//   currentlyWorking: Yup.bool(),
//   userType: Yup.string()
//     .oneOf(["professional"], "Invalid user type")
//     .required("User type is required"),
// });

// const passwordSchema = Yup.object().shape({
//   currentPassword: Yup.string().required("Current password is required"),
//   newPassword: Yup.string()
//     .required("New password is required")
//     .min(8, "Password must be at least 8 characters")
//     .matches(/[A-Z]/, "Must contain at least one uppercase letter")
//     .matches(/[a-z]/, "Must contain at least one lowercase letter")
//     .matches(/\d/, "Must contain at least one number")
//     .matches(/[@$!%*?&]/, "Must contain at least one special character")
//     .test(
//       "not-same-as-current",
//       "New password must be different from current password",
//       function (value) {
//         return value !== this.parent.currentPassword;
//       }
//     ),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref("newPassword")], "Passwords must match")
//     .required("Please confirm your new password"),
// });

// interface EditableFieldProps {
//   label: string;
//   field: string;
//   value: string;
//   onChange: (value: string) => void;
//   isEditing: boolean;
//   onEdit: () => void;
//   onSave: () => Promise<void>;
//   onCancel: () => void;
//   type?: string;
//   error?: string;
//   children?: React.ReactNode;
// }

// const EditableField: React.FC<EditableFieldProps> = ({
//   label,
//   field,
//   value,
//   onChange,
//   isEditing,
//   onEdit,
//   onSave,
//   onCancel,
//   type = "text",
//   error,
//   children,
// }) => {
//   return (
//     <div className="mb-6">
//       <div className="flex justify-between items-center mb-2">
//         <Label>{label}</Label>
//         {!isEditing ? (
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={onEdit}
//             className="text-black hover:underline"
//           >
//             Edit
//           </Button>
//         ) : (
//           <div className="flex gap-2">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={onSave}
//               className="text-green-600 hover:underline"
//             >
//               Save
//             </Button>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={onCancel}
//               className="text-red-600 hover:underline"
//             >
//               Cancel
//             </Button>
//           </div>
//         )}
//       </div>
//       {children ? (
//         <div>{children}</div>
//       ) : (
//         <Input
//           type={type}
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           readOnly={!isEditing}
//           className="bg-white"
//         />
//       )}
//       {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
//     </div>
//   );
// };

// const initialMenteeData = {
//   schoolDetails: {
//     schoolName: "",
//     class: "",
//     city: "",
//     startDate: "",
//     endDate: "",
//     userType: "school",
//   },
//   collegeDetails: {
//     collegeName: "",
//     course: "",
//     specializedIn: "",
//     city: "",
//     startDate: "",
//     endDate: "",
//     userType: "college",
//   },
//   professionalDetails: {
//     jobRole: "",
//     company: "",
//     experience: "",
//     city: "",
//     startDate: "",
//     endDate: "",
//     currentlyWorking: false,
//     userType: "professional",
//   },
// };

// const MenteeProfile: React.FC = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state: RootState) => state.user);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [editingField, setEditingField] = useState<string | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [isImageLoading, setIsImageLoading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [skillSearchTerm, setSkillSearchTerm] = useState("");
//   const [showSkillDropdown, setShowSkillDropdown] = useState(false);
//   const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({});
//   const [originalValues, setOriginalValues] = useState<{
//     [key: string]: string;
//   }>({});
//   const [profileData, setProfileData] = useState({
//     firstName: "",
//     lastName: "",
//     phone: "",
//     email: "",
//     bio: "",
//     skills: [] as string[],

//     profilePicture: "",
//   });
//   const [menteeData, setMenteeData] = useState(initialMenteeData);
//   const [originalMenteeData, setOriginalMenteeData] =
//     useState(initialMenteeData);
//   const [editingMenteeField, setEditingMenteeField] = useState<string | null>(
//     null
//   );

//   const presetSkills = [
//     "Javascript",
//     "Node JS",
//     "Mongo DB",
//     "React JS",
//     "AWS",
//     "Tailwind CSS",
//     "Python",
//     "Django",
//     "SQL",
//     "Docker",
//   ];

//   // Year options for dropdowns
//   const currentYear = new Date().getFullYear();
//   const yearOptions = Array.from({ length: 21 }, (_, i) =>
//     (currentYear - 20 + i).toString()
//   );

//   useEffect(() => {
//     const fetchUserData = async () => {
//       dispatch(setLoading(true));
//       try {
//         const response = await userProfileData();

//         if (response) {
//           dispatch(setUser(response));
//         } else {
//           dispatch(setError("Failed to fetch user data"));
//         }
//       } catch (err) {
//         dispatch(setError("An error occurred while fetching user data"));
//       } finally {
//         dispatch(setLoading(false));
//       }
//     };
//     fetchUserData();
//   }, [dispatch]);

//   useEffect(() => {
//     if (user) {
//       setProfileData({
//         firstName: user.firstName || "",
//         lastName: user.lastName || "",
//         phone: user.phone ? String(user.phone) : "",
//         email: user.email || "",
//         bio: user.bio || "",
//         skills: user.skills || [],

//         profilePicture: user.profilePicture || "",
//       });
//       setMenteeData({
//         schoolDetails: {
//           schoolName: user.schoolDetails?.schoolName || "",
//           class: user.schoolDetails?.class?.toString() || "", // Ensure string
//           city: user.schoolDetails?.city || "",
//           startDate: user.schoolDetails?.startDate?.slice(0, 4) || "",
//           endDate: user.schoolDetails?.endDate?.slice(0, 4) || "",
//           userType: user.schoolDetails?.userType || "school",
//         },
//         collegeDetails: {
//           collegeName: user.collegeDetails?.collegeName || "",
//           course: user.collegeDetails?.course || "",
//           specializedIn: user.collegeDetails?.specializedIn || "",
//           city: user.collegeDetails?.city || "",
//           startDate: user.collegeDetails?.startDate?.slice(0, 4) || "",
//           endDate: user.collegeDetails?.endDate?.slice(0, 4) || "",
//           userType: user.collegeDetails?.userType || "college",
//         },
//         professionalDetails: {
//           jobRole: user.professionalDetails?.jobRole || "",
//           company: user.professionalDetails?.company || "",
//           experience: user.professionalDetails?.experience || "",
//           city: user.professionalDetails?.city || "",
//           startDate: user.professionalDetails?.startDate?.slice(0, 4) || "",
//           endDate: user.professionalDetails?.endDate?.slice(0, 4) || "",
//           currentlyWorking: user.professionalDetails?.currentlyWorking || false,
//           userType: user.professionalDetails?.userType || "professional",
//         },
//       });
//       setOriginalMenteeData({
//         schoolDetails: {
//           schoolName: user.schoolDetails?.schoolName || "",
//           class: user.schoolDetails?.class?.toString() || "",
//           city: user.schoolDetails?.city || "",
//           startDate: user.schoolDetails?.startDate?.slice(0, 4) || "",
//           endDate: user.schoolDetails?.endDate?.slice(0, 4) || "",
//           userType: user.schoolDetails?.userType || "school",
//         },
//         collegeDetails: {
//           collegeName: user.collegeDetails?.collegeName || "",
//           course: user.collegeDetails?.course || "",
//           specializedIn: user.collegeDetails?.specializedIn || "",
//           city: user.collegeDetails?.city || "",
//           startDate: user.collegeDetails?.startDate?.slice(0, 4) || "",
//           endDate: user.collegeDetails?.endDate?.slice(0, 4) || "",
//           userType: user.collegeDetails?.userType || "college",
//         },
//         professionalDetails: {
//           jobRole: user.professionalDetails?.jobRole || "",
//           company: user.professionalDetails?.company || "",
//           experience: user.professionalDetails?.experience || "",
//           city: user.professionalDetails?.city || "",
//           startDate: user.professionalDetails?.startDate?.slice(0, 4) || "",
//           endDate: user.professionalDetails?.endDate?.slice(0, 4) || "",
//           currentlyWorking: user.professionalDetails?.currentlyWorking || false,
//           userType: user.professionalDetails?.userType || "professional",
//         },
//       });
//       setPreviewUrl(user.profilePicture || null);
//     }
//   }, [user]);

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setIsImageLoading(true);
//       setSelectedFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewUrl(reader.result as string);
//         setIsImageLoading(false);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleImageSave = async () => {
//     if (!selectedFile) {
//       toast.error("No image selected to upload");
//       return;
//     }
//     dispatch(setLoading(true));
//     try {
//       const formData = new FormData();
//       formData.append("image", selectedFile);
//       const response = await uploadProfileImage(formData);
//       dispatch(setUser(response.data.data));
//       setSelectedFile(null);
//       setPreviewUrl(response.data.data.profilePicture);
//       toast.success("Profile image uploaded successfully");
//     } catch (error) {
//       toast.error("Failed to upload image");
//       console.error(error);
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   const updateProfileField = async (field: string, value: any) => {
//     try {
//       await profileSchema.validateAt(field, { [field]: value });
//       const payload = { [field]: value };
//       const updatedUser = await updateUserProfile(payload);
//       dispatch(setUser(updatedUser));
//       setProfileData((prev) => ({ ...prev, [field]: value }));
//       setEditingField(null); // Reset editing state
//       toast.success(`${field} updated successfully`);
//     } catch (error) {
//       if (error instanceof Yup.ValidationError) {
//         setFormErrors({ [field]: error.message });
//         toast.error(error.message);
//       } else {
//         toast.error(`Failed to update ${field}`);
//         console.error(error);
//       }
//     }
//   };

//   const handleMenteeChange = (
//     section: "schoolDetails" | "collegeDetails" | "professionalDetails",
//     field: string,
//     value: any
//   ) => {
//     setMenteeData((prev) => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [field]: value,
//       },
//     }));
//     setFormErrors((prev) => ({ ...prev, [`${section}.${field}`]: "" }));
//   };

//   const validateMenteeField = async (
//     section: "schoolDetails" | "collegeDetails" | "professionalDetails",
//     field: string,
//     value: any
//   ) => {
//     try {
//       const sectionData = menteeData[section];
//       const schema =
//         section === "schoolDetails"
//           ? schoolDetailsSchema
//           : section === "collegeDetails"
//           ? collegeDetailsSchema
//           : professionalDetailsSchema;
//       await schema.validateAt(field, sectionData);
//       return { isValid: true, error: "" };
//     } catch (error) {
//       if (error instanceof Yup.ValidationError) {
//         return { isValid: false, error: error.message };
//       }
//       throw error;
//     }
//   };

//   const handleMenteeSave = async (
//     section: "schoolDetails" | "collegeDetails" | "professionalDetails",
//     field: string
//   ) => {
//     try {
//       const value = menteeData[section][field];
//       const validation = await validateMenteeField(section, field, value);
//       if (!validation.isValid) {
//         setFormErrors({ [`${section}.${field}`]: validation.error });
//         toast.error(validation.error);
//         return;
//       }

//       const payload = {
//         [section]: { [field]: value },
//       };
//       const updatedUser = await updateUserProfile(payload);
//       dispatch(setUser(updatedUser));
//       setEditingMenteeField(null);
//       setOriginalMenteeData(menteeData); // Update original data
//       setFormErrors({});
//       toast.success(`${field} updated successfully`);
//     } catch (error) {
//       toast.error(`Failed to update ${field}`);
//       console.error(error);
//     }
//   };

//   const handleMenteeCancel = (
//     section: "schoolDetails" | "collegeDetails" | "professionalDetails",
//     field: string
//   ) => {
//     setMenteeData((prev) => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [field]: originalMenteeData[section][field],
//       },
//     }));
//     setFormErrors({});
//     setEditingMenteeField(null);
//   };

//   // Handle edit button click
//   const handleEdit = (field: string) => {
//     setOriginalValues((prev) => ({ ...prev, [field]: profileData[field] }));
//     setEditingField(field);
//   };

//   const handleCancel = (field: string) => {
//     setProfileData((prev) => ({ ...prev, [field]: originalValues[field] }));
//     setEditingField(null);
//     setCurrentPassword("");
//     setNewPassword("");
//     setConfirmPassword("");
//   };
//   // Handle save button click
//   const handleSave = (
//     fieldOrFields: string | { [key: string]: string },
//     value?: string
//   ) => {
//     if (typeof fieldOrFields === "string") {
//       updateProfileField(
//         fieldOrFields,
//         value || profileData[fieldOrFields as keyof typeof profileData]
//       );
//     } else if (fieldOrFields && typeof fieldOrFields === "object") {
//       Object.entries(fieldOrFields).forEach(([key, val]) => {
//         updateProfileField(key, val);
//       });
//     }
//     setEditingField(null);
//   };
//   // Add a skill
//   const addSkill = (skill: string) => {
//     if (skill && !profileData.skills.includes(skill)) {
//       const updatedSkills = [...profileData.skills, skill];
//       setProfileData((prev) => ({ ...prev, skills: updatedSkills }));
//       setSkillSearchTerm("");
//     }
//   };

//   // Remove a skill

//   const removeSkill = (index: number) => {
//     const updatedSkills = profileData.skills.filter((_, i) => i !== index);
//     setProfileData((prev) => ({ ...prev, skills: updatedSkills }));
//   };

//   // Filter skills for dropdown
//   const filteredSkills = presetSkills.filter(
//     (skill) =>
//       skill.toLowerCase().includes(skillSearchTerm.toLowerCase()) &&
//       !profileData.skills.includes(skill)
//   );

//   const handlePasswordUpdate = async () => {
//     try {
//       await passwordSchema.validate(
//         { currentPassword, newPassword, confirmPassword },
//         { abortEarly: false }
//       );
//       setIsPasswordUpdating(true);
//       const response = await updateUserPassword(currentPassword, newPassword);
//       if (response?.status === 200) {
//         toast.success(response.data.message);
//         setCurrentPassword("");
//         setNewPassword("");
//         setConfirmPassword("");
//         setEditingField(null);
//       } else {
//         toast.error(response.message);
//       }
//     } catch (error) {
//       toast.error("Failed to update password");
//       console.error(error);
//     } finally {
//       setIsPasswordUpdating(false);
//     }
//   };

//   return (
//     <div className="flex-1 px-24">
//       {/* Profile Header */}
//       <div className="bg-black text-white p-8 rounded-t-xl relative">
//         <div className="flex items-end gap-6">
//           <div className="relative">
//             <div className="flex flex-row justify-center items-center gap-4 mb-3">
//               {/* Replace the Avatar component with ProfilePicture */}
//               <div className="h-20 w-32 relative mb-6">
//                 {isImageLoading ? (
//                   <div className="h-24 w-24 bg-gray-200 rounded-full animate-pulse flex items-center justify-center">
//                     <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
//                   </div>
//                 ) : previewUrl ? (
//                   // Use ProfilePicture for existing/preview images
//                   <ProfilePicture
//                     profilePicture={previewUrl}
//                     userName={`${user?.firstName} ${user?.lastName || ""}`}
//                     size="xl"
//                     className="h-24 w-24"
//                   />
//                 ) : user?.profilePicture ? (
//                   // Use ProfilePicture for user's current profile picture
//                   <ProfilePicture
//                     profilePicture={user.profilePicture}
//                     userName={`${user?.firstName} ${user?.lastName || ""}`}
//                     size="xl"
//                     className="h-24 w-24"
//                   />
//                 ) : (
//                   // Fallback when no image
//                   <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200">
//                     <UploadIcon className="h-8 w-8 text-gray-400" />
//                   </div>
//                 )}
//               </div>
//               <div className="flex gap-2">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   className="hidden"
//                   id="image-upload"
//                 />
//                 <button
//                   className="bg-green-500 p-1 rounded-full"
//                   onClick={() =>
//                     document.getElementById("image-upload")?.click()
//                   }
//                   disabled={isImageLoading}
//                 >
//                   {isImageLoading ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   ) : (
//                     <Pencil size={16} />
//                   )}
//                 </button>
//                 {selectedFile && (
//                   <button
//                     className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm"
//                     onClick={handleImageSave}
//                     disabled={isUploading}
//                   >
//                     {isUploading ? "Uploading..." : "Save"}
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//           <div className="relative flex-1">
//             <h2 className="text-3xl font-bold mb-1">
//               {user?.firstName} {user?.lastName}
//             </h2>

//             <div className="mt-2"></div>
//             {/* Skills Editing */}
//             <div className="mt-2">
//               {editingField === "skills" ? (
//                 <div className="flex flex-col gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     {profileData.skills.map((skill, index) => (
//                       <Badge
//                         key={index}
//                         variant="secondary"
//                         className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200"
//                       >
//                         {skill}
//                         <XIcon
//                           className="w-3 h-3 cursor-pointer"
//                           onClick={() => removeSkill(index)}
//                         />
//                       </Badge>
//                     ))}
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div className="relative flex-1">
//                       <Input
//                         placeholder="Search or add a skill"
//                         value={skillSearchTerm}
//                         onChange={(e) => {
//                           setSkillSearchTerm(e.target.value);
//                           setShowSkillDropdown(true);
//                         }}
//                         onFocus={() => setShowSkillDropdown(true)}
//                         className="w-full text-sm text-gray-300"
//                       />
//                       <SearchIcon className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
//                       {showSkillDropdown && filteredSkills.length > 0 && (
//                         <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
//                           {filteredSkills.map((skill, index) => (
//                             <div
//                               key={index}
//                               className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-black"
//                               onClick={() => {
//                                 addSkill(skill);
//                                 setShowSkillDropdown(false);
//                               }}
//                             >
//                               {skill}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                     <button
//                       onClick={() => handleSave("skills", profileData.skills)}
//                       className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm"
//                     >
//                       Save
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex justify-between items-start">
//                   <p
//                     className={`text-sm ${
//                       profileData?.skills?.length > 0
//                         ? "text-gray-300"
//                         : "text-gray-500 italic"
//                     }`}
//                   >
//                     {profileData?.skills?.length > 0
//                       ? profileData.skills.join(" | ")
//                       : "Enter the Skills"}
//                   </p>
//                   <button
//                     onClick={() => handleEdit("skills")}
//                     className="ml-2 bg-green-500 p-1 rounded-full"
//                   >
//                     <Pencil size={16} />
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-b-xl p-24 min-h-screen">
//         <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
//           <Tabs.List className="flex gap-8 border-b mb-8">
//             <Tabs.Trigger
//               value="overview"
//               className={`pb-4 ${
//                 activeTab === "overview" ? "border-b-2 border-black" : ""
//               }`}
//             >
//               Overview
//             </Tabs.Trigger>
//             <Tabs.Trigger
//               value="as-mentee"
//               className={`pb-4 ${
//                 activeTab === "as-mentee" ? "border-b-2 border-black" : ""
//               }`}
//             >
//               As Mentee
//             </Tabs.Trigger>
//           </Tabs.List>

//           <Tabs.Content value="overview">
//             <div className="max-w-2xl">
//               <div className="pb-6">
//                 <Label className="text-sm font-medium">Email</Label>
//                 <div className="flex items-center">
//                   <p className="px-4 text-sm text-green-600">
//                     {profileData.email}
//                   </p>
//                   <CircleCheckBig size={22} color="#198041" />
//                 </div>
//               </div>
//               <EditableField
//                 label="First Name"
//                 field="firstName"
//                 value={profileData.firstName}
//                 isEditing={editingField === "firstName"}
//                 onEdit={() => setEditingField("firstName")}
//                 onSave={async () =>
//                   await updateProfileField("firstName", profileData.firstName)
//                 }
//                 onCancel={() => setEditingField(null)}
//                 onChange={(value) =>
//                   setProfileData((prev) => ({ ...prev, firstName: value }))
//                 }
//                 error={formErrors.firstName}
//               />
//               <EditableField
//                 label="Last Name"
//                 field="lastName"
//                 value={profileData.lastName}
//                 isEditing={editingField === "lastName"}
//                 onEdit={() => setEditingField("lastName")}
//                 onSave={async () =>
//                   await updateProfileField("lastName", profileData.lastName)
//                 }
//                 onCancel={() => setEditingField(null)}
//                 onChange={(value) =>
//                   setProfileData((prev) => ({ ...prev, lastName: value }))
//                 }
//                 error={formErrors.lastName}
//               />
//               <EditableField
//                 label="Phone"
//                 field="phone"
//                 value={profileData.phone}
//                 isEditing={editingField === "phone"}
//                 onEdit={() => setEditingField("phone")}
//                 onSave={async () =>
//                   await updateProfileField("phone", profileData.phone)
//                 }
//                 onCancel={() => setEditingField(null)}
//                 onChange={(value) =>
//                   setProfileData((prev) => ({ ...prev, phone: value }))
//                 }
//                 type="tel"
//                 error={formErrors.phone}
//               />
//               {editingField === "password" ? (
//                 <div className="mb-6">
//                   <Label className="text-sm font-medium">Password</Label>
//                   <div className="space-y-4">
//                     <div className="relative">
//                       <Input
//                         type={showCurrentPassword ? "text" : "password"}
//                         placeholder="Current Password"
//                         value={currentPassword}
//                         onChange={(e) => setCurrentPassword(e.target.value)}
//                       />
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() =>
//                           setShowCurrentPassword(!showCurrentPassword)
//                         }
//                         className="absolute right-2 top-2.5"
//                       >
//                         {showCurrentPassword ? (
//                           <EyeOffIcon size={16} />
//                         ) : (
//                           <EyeIcon size={16} />
//                         )}
//                       </Button>
//                       {formErrors.currentPassword && (
//                         <p className="text-red-500 text-sm mt-1">
//                           {formErrors.currentPassword}
//                         </p>
//                       )}
//                     </div>
//                     <div className="relative">
//                       <Input
//                         type={showNewPassword ? "text" : "password"}
//                         placeholder="New Password"
//                         value={newPassword}
//                         onChange={(e) => setNewPassword(e.target.value)}
//                       />
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => setShowNewPassword(!showNewPassword)}
//                         className="absolute right-2 top-2.5"
//                       >
//                         {showNewPassword ? (
//                           <EyeOffIcon size={16} />
//                         ) : (
//                           <EyeIcon size={16} />
//                         )}
//                       </Button>
//                       {formErrors.newPassword && (
//                         <p className="text-red-500 text-sm mt-1">
//                           {formErrors.newPassword}
//                         </p>
//                       )}
//                     </div>
//                     <div className="relative">
//                       <Input
//                         type={showConfirmPassword ? "text" : "password"}
//                         placeholder="Confirm Password"
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)}
//                       />
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() =>
//                           setShowConfirmPassword(!showConfirmPassword)
//                         }
//                         className="absolute right-2 top-2.5"
//                       >
//                         {showConfirmPassword ? (
//                           <EyeOffIcon size={16} />
//                         ) : (
//                           <EyeIcon size={16} />
//                         )}
//                       </Button>
//                       {formErrors.confirmPassword && (
//                         <p className="text-red-500 text-sm mt-1">
//                           {formErrors.confirmPassword}
//                         </p>
//                       )}
//                     </div>
//                     <div className="flex gap-2">
//                       <Button
//                         onClick={handlePasswordUpdate}
//                         disabled={isPasswordUpdating}
//                       >
//                         {isPasswordUpdating ? "Updating..." : "Save Password"}
//                       </Button>
//                       <Button
//                         variant="outline"
//                         onClick={() => setEditingField(null)}
//                       >
//                         Cancel
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="mb-6">
//                   <div className="flex justify-between items-center">
//                     <Label className="text-sm font-medium">Password</Label>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => setEditingField("password")}
//                       className="text-black hover:underline"
//                     >
//                       Edit
//                     </Button>
//                   </div>
//                   <p className="text-sm text-gray-500">
//                     Change password regularly for security.
//                   </p>
//                 </div>
//               )}
//               {user?.mentorActivated && (
//                 <EditableField
//                   label="Bio"
//                   field="bio"
//                   value={profileData.bio}
//                   isEditing={editingField === "bio"}
//                   onEdit={() => setEditingField("bio")}
//                   onSave={async () =>
//                     await updateProfileField("bio", profileData.bio)
//                   }
//                   onCancel={() => setEditingField(null)}
//                   onChange={(value) =>
//                     setProfileData((prev) => ({ ...prev, bio: value }))
//                   }
//                   error={formErrors.bio}
//                 >
//                   <textarea
//                     className="w-full p-2 border rounded-md h-24"
//                     placeholder="Enter about yourself"
//                     value={profileData.bio}
//                     onChange={(e) =>
//                       setProfileData((prev) => ({
//                         ...prev,
//                         bio: e.target.value,
//                       }))
//                     }
//                     readOnly={editingField !== "bio"}
//                   />
//                 </EditableField>
//               )}
//             </div>
//           </Tabs.Content>
//           <Tabs.Content value="as-mentee">
//             <div className="max-w-2xl">
//               {/* School Details */}
//               {user?.schoolDetails?.userType === "school" && (
//                 <>
//                   <h3 className="text-lg font-medium mb-4">
//                     As a School Student
//                   </h3>
//                   <EditableField
//                     label="School Name*"
//                     field="schoolDetails.schoolName"
//                     value={menteeData.schoolDetails.schoolName}
//                     isEditing={
//                       editingMenteeField === "schoolDetails.schoolName"
//                     }
//                     onEdit={() =>
//                       setEditingMenteeField("schoolDetails.schoolName")
//                     }
//                     onSave={async () =>
//                       await handleMenteeSave("schoolDetails", "schoolName")
//                     }
//                     onCancel={() =>
//                       handleMenteeCancel("schoolDetails", "schoolName")
//                     }
//                     onChange={(value) =>
//                       handleMenteeChange("schoolDetails", "schoolName", value)
//                     }
//                     error={formErrors["schoolDetails.schoolName"]}
//                   />
//                   <EditableField
//                     label="Class*"
//                     field="schoolDetails.class"
//                     value={menteeData.schoolDetails.class}
//                     isEditing={editingMenteeField === "schoolDetails.class"}
//                     onEdit={() => setEditingMenteeField("schoolDetails.class")}
//                     onSave={async () =>
//                       await handleMenteeSave("schoolDetails", "class")
//                     }
//                     onCancel={() =>
//                       handleMenteeCancel("schoolDetails", "class")
//                     }
//                     onChange={(value) =>
//                       handleMenteeChange("schoolDetails", "class", value)
//                     }
//                     error={formErrors["schoolDetails.class"]}
//                   >
//                     <Select
//                       value={menteeData.schoolDetails.class?.toString() || ""}
//                       onValueChange={(value) =>
//                         handleMenteeChange("schoolDetails", "class", value)
//                       }
//                       disabled={editingMenteeField !== "schoolDetails.class"}
//                     >
//                       <SelectTrigger className="bg-white">
//                         <SelectValue placeholder="Select Class" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-white">
//                         {Array.from({ length: 12 }, (_, i) => i + 1).map(
//                           (num) => (
//                             <SelectItem key={num} value={num.toString()}>
//                               {num}
//                             </SelectItem>
//                           )
//                         )}
//                       </SelectContent>
//                     </Select>
//                   </EditableField>
//                   <EditableField
//                     label="City*"
//                     field="schoolDetails.city"
//                     value={menteeData.schoolDetails.city}
//                     isEditing={editingMenteeField === "schoolDetails.city"}
//                     onEdit={() => setEditingMenteeField("schoolDetails.city")}
//                     onSave={async () =>
//                       await handleMenteeSave("schoolDetails", "city")
//                     }
//                     onCancel={() => handleMenteeCancel("schoolDetails", "city")}
//                     onChange={(value) =>
//                       handleMenteeChange("schoolDetails", "city", value)
//                     }
//                     error={formErrors["schoolDetails.city"]}
//                   />
//                 </>
//               )}
//               {/* College Details */}
//               {(user?.collegeDetails?.userType === "college" ||
//                 user?.collegeDetails?.userType === "fresher") && (
//                 <>
//                   <h3 className="text-lg font-medium mb-4">
//                     {user?.collegeDetails?.userType === "college"
//                       ? "As a College Student"
//                       : "As a Fresher"}
//                   </h3>
//                   <EditableField
//                     label="College Name*"
//                     field="collegeDetails.collegeName"
//                     value={menteeData.collegeDetails.collegeName}
//                     isEditing={
//                       editingMenteeField === "collegeDetails.collegeName"
//                     }
//                     onEdit={() =>
//                       setEditingMenteeField("collegeDetails.collegeName")
//                     }
//                     onSave={async () =>
//                       await handleMenteeSave("collegeDetails", "collegeName")
//                     }
//                     onCancel={() =>
//                       handleMenteeCancel("collegeDetails", "collegeName")
//                     }
//                     onChange={(value) =>
//                       handleMenteeChange("collegeDetails", "collegeName", value)
//                     }
//                     error={formErrors["collegeDetails.collegeName"]}
//                   />
//                   <EditableField
//                     label="Course*"
//                     field="collegeDetails.course"
//                     value={menteeData.collegeDetails.course}
//                     isEditing={editingMenteeField === "collegeDetails.course"}
//                     onEdit={() =>
//                       setEditingMenteeField("collegeDetails.course")
//                     }
//                     onSave={async () =>
//                       await handleMenteeSave("collegeDetails", "course")
//                     }
//                     onCancel={() =>
//                       handleMenteeCancel("collegeDetails", "course")
//                     }
//                     onChange={(value) =>
//                       handleMenteeChange("collegeDetails", "course", value)
//                     }
//                     error={formErrors["collegeDetails.course"]}
//                   >
//                     <Select
//                       value={menteeData.collegeDetails.course}
//                       onValueChange={(value) =>
//                         handleMenteeChange("collegeDetails", "course", value)
//                       }
//                       disabled={editingMenteeField !== "collegeDetails.course"}
//                     >
//                       <SelectTrigger className="bg-white">
//                         <SelectValue placeholder="Select Course" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-white">
//                         <SelectItem value="btech">B.Tech</SelectItem>
//                         <SelectItem value="bsc">B.Sc</SelectItem>
//                         <SelectItem value="bca">BCA</SelectItem>
//                         <SelectItem value="mca">MCA</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </EditableField>
//                   <EditableField
//                     label="Specialized In"
//                     field="collegeDetails.specializedIn"
//                     value={menteeData.collegeDetails.specializedIn}
//                     isEditing={
//                       editingMenteeField === "collegeDetails.specializedIn"
//                     }
//                     onEdit={() =>
//                       setEditingMenteeField("collegeDetails.specializedIn")
//                     }
//                     onSave={async () =>
//                       await handleMenteeSave("collegeDetails", "specializedIn")
//                     }
//                     onCancel={() =>
//                       handleMenteeCancel("collegeDetails", "specializedIn")
//                     }
//                     onChange={(value) =>
//                       handleMenteeChange(
//                         "collegeDetails",
//                         "specializedIn",
//                         value
//                       )
//                     }
//                     error={formErrors["collegeDetails.specializedIn"]}
//                   >
//                     <Select
//                       value={menteeData.collegeDetails.specializedIn}
//                       onValueChange={(value) =>
//                         handleMenteeChange(
//                           "collegeDetails",
//                           "specializedIn",
//                           value
//                         )
//                       }
//                       disabled={
//                         editingMenteeField !== "collegeDetails.specializedIn"
//                       }
//                     >
//                       <SelectTrigger className="bg-white">
//                         <SelectValue placeholder="Select Specialization" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-white">
//                         <SelectItem value="cs">Computer Science</SelectItem>
//                         <SelectItem value="it">
//                           Information Technology
//                         </SelectItem>
//                         <SelectItem value="ec">Electronics</SelectItem>
//                         <SelectItem value="me">Mechanical</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </EditableField>
//                   <EditableField
//                     label="City*"
//                     field="collegeDetails.city"
//                     value={menteeData.collegeDetails.city}
//                     isEditing={editingMenteeField === "collegeDetails.city"}
//                     onEdit={() => setEditingMenteeField("collegeDetails.city")}
//                     onSave={async () =>
//                       await handleMenteeSave("collegeDetails", "city")
//                     }
//                     onCancel={() =>
//                       handleMenteeCancel("collegeDetails", "city")
//                     }
//                     onChange={(value) =>
//                       handleMenteeChange("collegeDetails", "city", value)
//                     }
//                     error={formErrors["collegeDetails.city"]}
//                   />
//                   <EditableField
//                     label="Start Year*"
//                     field="collegeDetails.startDate"
//                     value={menteeData.collegeDetails.startDate}
//                     isEditing={
//                       editingMenteeField === "collegeDetails.startDate"
//                     }
//                     onEdit={() =>
//                       setEditingMenteeField("collegeDetails.startDate")
//                     }
//                     onSave={async () =>
//                       await handleMenteeSave("collegeDetails", "startDate")
//                     }
//                     onCancel={() =>
//                       handleMenteeCancel("collegeDetails", "startDate")
//                     }
//                     onChange={(value) =>
//                       handleMenteeChange("collegeDetails", "startDate", value)
//                     }
//                     error={formErrors["collegeDetails.startDate"]}
//                   >
//                     <Select
//                       value={menteeData.collegeDetails.startDate}
//                       onValueChange={(value) =>
//                         handleMenteeChange("collegeDetails", "startDate", value)
//                       }
//                       disabled={
//                         editingMenteeField !== "collegeDetails.startDate"
//                       }
//                     >
//                       <SelectTrigger className="bg-white">
//                         <SelectValue placeholder="Select Year" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-white max-h-56 overflow-y-auto">
//                         {yearOptions.map((year) => (
//                           <SelectItem key={year} value={year}>
//                             {year}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </EditableField>
//                   <EditableField
//                     label="End Year*"
//                     field="collegeDetails.endDate"
//                     value={menteeData.collegeDetails.endDate}
//                     isEditing={editingMenteeField === "collegeDetails.endDate"}
//                     onEdit={() =>
//                       setEditingMenteeField("collegeDetails.endDate")
//                     }
//                     onSave={async () =>
//                       await handleMenteeSave("collegeDetails", "endDate")
//                     }
//                     onCancel={() =>
//                       handleMenteeCancel("collegeDetails", "endDate")
//                     }
//                     onChange={(value) =>
//                       handleMenteeChange("collegeDetails", "endDate", value)
//                     }
//                     error={formErrors["collegeDetails.endDate"]}
//                   >
//                     <Select
//                       value={menteeData.collegeDetails.endDate}
//                       onValueChange={(value) =>
//                         handleMenteeChange("collegeDetails", "endDate", value)
//                       }
//                       disabled={editingMenteeField !== "collegeDetails.endDate"}
//                     >
//                       <SelectTrigger className="bg-white">
//                         <SelectValue placeholder="Select Year" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-white max-h-56 overflow-y-auto">
//                         {yearOptions.map((year) => (
//                           <SelectItem key={year} value={year}>
//                             {year}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </EditableField>
//                 </>
//               )}
//               {/* Professional Details */}
//               {user?.professionalDetails?.userType === "professional" && (
//                 <>
//                   <h3 className="text-lg font-medium mb-4">
//                     As a Professional
//                   </h3>
//                   <EditableField
//                     label="Job Role*"
//                     field="professionalDetails.jobRole"
//                     value={menteeData.professionalDetails.jobRole}
//                     isEditing={
//                       editingMenteeField === "professionalDetails.jobRole"
//                     }
//                     onEdit={() =>
//                       setEditingMenteeField("professionalDetails.jobRole")
//                     }
//                     onSave={async () =>
//                       await handleMenteeSave("professionalDetails", "jobRole")
//                     }
//                     onCancel={() =>
//                       handleMenteeCancel("professionalDetails", "jobRole")
//                     }
//                     onChange={(value) =>
//                       handleMenteeChange(
//                         "professionalDetails",
//                         "jobRole",
//                         value
//                       )
//                     }
//                     error={formErrors["professionalDetails.jobRole"]}
//                   >
//                     <Select
//                       value={menteeData.professionalDetails.jobRole}
//                       onValueChange={(value) =>
//                         handleMenteeChange(
//                           "professionalDetails",
//                           "jobRole",
//                           value
//                         )
//                       }
//                       disabled={
//                         editingMenteeField !== "professionalDetails.jobRole"
//                       }
//                     >
//                       <SelectTrigger className="bg-white">
//                         <SelectValue placeholder="Select Job Role" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-white">
//                         <SelectItem value="sde">Software Developer</SelectItem>
//                         <SelectItem value="designer">UI/UX Designer</SelectItem>
//                         <SelectItem value="pm">Product Manager</SelectItem>
//                         <SelectItem value="other">Other</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </EditableField>
//                   <EditableField
//                     label="Company*"
//                     field="professionalDetails.company"
//                     value={menteeData.professionalDetails.company}
//                     isEditing={
//                       editingMenteeField === "professionalDetails.company"
//                     }
//                     onEdit={() =>
//                       setEditingMenteeField("professionalDetails.company")
//                     }
//                     onSave={async () =>
//                       await handleMenteeSave("professionalDetails", "company")
//                     }
//                     onCancel={() =>
//                       handleMenteeCancel("professionalDetails", "company")
//                     }
//                     onChange={(value) =>
//                       handleMenteeChange(
//                         "professionalDetails",
//                         "company",
//                         value
//                       )
//                     }
//                     error={formErrors["professionalDetails.company"]}
//                   />
//                   <EditableField
//                     label="Total Experience*"
//                     field="professionalDetails.experience"
//                     value={menteeData.professionalDetails.experience}
//                     isEditing={
//                       editingMenteeField === "professionalDetails.experience"
//                     }
//                     onEdit={() =>
//                       setEditingMenteeField("professionalDetails.experience")
//                     }
//                     onSave={async () =>
//                       await handleMenteeSave(
//                         "professionalDetails",
//                         "experience"
//                       )
//                     }
//                     onCancel={() =>
//                       handleMenteeCancel("professionalDetails", "experience")
//                     }
//                     onChange={(value) =>
//                       handleMenteeChange(
//                         "professionalDetails",
//                         "experience",
//                         value
//                       )
//                     }
//                     error={formErrors["professionalDetails.experience"]}
//                   >
//                     <Select
//                       value={menteeData.professionalDetails.experience}
//                       onValueChange={(value) =>
//                         handleMenteeChange(
//                           "professionalDetails",
//                           "experience",
//                           value
//                         )
//                       }
//                       disabled={
//                         editingMenteeField !== "professionalDetails.experience"
//                       }
//                     >
//                       <SelectTrigger className="bg-white">
//                         <SelectValue placeholder="Select Experience" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-white">
//                         <SelectItem value="0-1">0-1 years</SelectItem>
//                         <SelectItem value="1-3">1-3 years</SelectItem>
//                         <SelectItem value="3-5">3-5 years</SelectItem>
//                         <SelectItem value="5+">5+ years</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </EditableField>
//                   <EditableField
//                     label="City*"
//                     field="professionalDetails.city"
//                     value={menteeData.professionalDetails.city}
//                     isEditing={
//                       editingMenteeField === "professionalDetails.city"
//                     }
//                     onEdit={() =>
//                       setEditingMenteeField("professionalDetails.city")
//                     }
//                     onSave={async () =>
//                       await handleMenteeSave("professionalDetails", "city")
//                     }
//                     onCancel={() =>
//                       handleMenteeCancel("professionalDetails", "city")
//                     }
//                     onChange={(value) =>
//                       handleMenteeChange("professionalDetails", "city", value)
//                     }
//                     error={formErrors["professionalDetails.city"]}
//                   />
//                   <EditableField
//                     label="Start Year*"
//                     field="professionalDetails.startDate"
//                     value={menteeData.professionalDetails.startDate}
//                     isEditing={
//                       editingMenteeField === "professionalDetails.startDate"
//                     }
//                     onEdit={() =>
//                       setEditingMenteeField("professionalDetails.startDate")
//                     }
//                     onSave={async () =>
//                       await handleMenteeSave("professionalDetails", "startDate")
//                     }
//                     onCancel={() =>
//                       handleMenteeCancel("professionalDetails", "startDate")
//                     }
//                     onChange={(value) =>
//                       handleMenteeChange(
//                         "professionalDetails",
//                         "startDate",
//                         value
//                       )
//                     }
//                     error={formErrors["professionalDetails.startDate"]}
//                   >
//                     <Select
//                       value={menteeData.professionalDetails.startDate}
//                       onValueChange={(value) =>
//                         handleMenteeChange(
//                           "professionalDetails",
//                           "startDate",
//                           value
//                         )
//                       }
//                       disabled={
//                         editingMenteeField !== "professionalDetails.startDate"
//                       }
//                     >
//                       <SelectTrigger className="bg-white">
//                         <SelectValue placeholder="Select Year" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-white max-h-56 overflow-y-auto">
//                         {yearOptions.map((year) => (
//                           <SelectItem key={year} value={year}>
//                             {year}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </EditableField>
//                   <EditableField
//                     label="Currently Working"
//                     field="professionalDetails.currentlyWorking"
//                     value={undefined}
//                     isEditing={
//                       editingMenteeField ===
//                       "professionalDetails.currentlyWorking"
//                     }
//                     onEdit={() =>
//                       setEditingMenteeField(
//                         "professionalDetails.currentlyWorking"
//                       )
//                     }
//                     onSave={async () =>
//                       await handleMenteeSave(
//                         "professionalDetails",
//                         "currentlyWorking"
//                       )
//                     }
//                     onCancel={() =>
//                       handleMenteeCancel(
//                         "professionalDetails",
//                         "currentlyWorking"
//                       )
//                     }
//                     onChange={() => {}}
//                     error={formErrors["professionalDetails.currentlyWorking"]}
//                   >
//                     <div className="flex items-center space-x-2">
//                       <Checkbox
//                         id="currentlyWorking"
//                         checked={
//                           menteeData.professionalDetails.currentlyWorking
//                         }
//                         onCheckedChange={(checked) =>
//                           handleMenteeChange(
//                             "professionalDetails",
//                             "currentlyWorking",
//                             !!checked
//                           )
//                         }
//                         disabled={
//                           editingMenteeField !==
//                           "professionalDetails.currentlyWorking"
//                         }
//                       />
//                       <Label htmlFor="currentlyWorking">
//                         Currently Working
//                       </Label>
//                     </div>
//                   </EditableField>
//                 </>
//               )}
//             </div>
//           </Tabs.Content>
//         </Tabs.Root>
//       </div>

//       <Dialog open={isUploading} onOpenChange={setIsUploading}>
//         <DialogContent>
//           <div className="flex flex-col items-center p-6">
//             <Loader2 className="h-12 w-12 animate-spin" />
//             <p className="text-lg font-semibold">Uploading your image...</p>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default MenteeProfile;
import React, { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pencil,
  UploadIcon,
  Loader2,
  EyeIcon,
  EyeOffIcon,
  XIcon,
  CircleCheckBig,
  SearchIcon,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  School,
  Star,
  Save,
  X,
  Camera,
  User,
  BookOpen,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import { setError, setUser, setLoading } from "@/redux/slices/userSlice";
import { updateUserProfile, updateUserPassword } from "@/services/userServices";
import { uploadProfileImage } from "@/services/uploadService";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import * as Yup from "yup";
import { userProfileData } from "@/services/menteeService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ProfilePicture } from "@/components/users/SecureMedia";

const profileSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "Too short")
    .matches(/^[A-Za-z]+$/, "First name must contain only letters"),
  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Too short")
    .matches(/^[A-Za-z]+$/, "Last name must contain only letters"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  bio: Yup.string().max(500, "Bio must be 500 characters or less").optional(),
  skills: Yup.array().of(Yup.string()).optional(),
});

const schoolDetailsSchema = Yup.object().shape({
  schoolName: Yup.string().required("School name is required"),
  class: Yup.string().required("Class is required"),
  city: Yup.string().required("City is required"),
  startDate: Yup.string().required("Start year is required"),
  endDate: Yup.string().required("End year is required"),
  userType: Yup.string()
    .oneOf(["school"], "Invalid user type")
    .required("User type is required"),
});

const collegeDetailsSchema = Yup.object().shape({
  collegeName: Yup.string().required("College name is required"),
  course: Yup.string().required("Course is required"),
  specializedIn: Yup.string().optional(),
  city: Yup.string().required("City is required"),
  startDate: Yup.string().required("Start year is required"),
  endDate: Yup.string().required("End year is required"),
  userType: Yup.string()
    .oneOf(["college", "fresher"], "Invalid user type")
    .required("User type is required"),
});

const professionalDetailsSchema = Yup.object().shape({
  jobRole: Yup.string().required("Job role is required"),
  company: Yup.string().required("Company is required"),
  experience: Yup.string().required("Experience is required"),
  city: Yup.string().required("City is required"),
  startDate: Yup.string().required("Start year is required"),
  endDate: Yup.string().optional(),
  currentlyWorking: Yup.bool(),
  userType: Yup.string()
    .oneOf(["professional"], "Invalid user type")
    .required("User type is required"),
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
  value?: string | boolean;
  onChange: (value: any) => void;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
  type?: string;
  error?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  placeholder?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  field,
  value,
  onChange,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  type = "text",
  error,
  children,
  icon,
  placeholder,
}) => {
  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onSave();
  };

  const handleCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onCancel();
  };

  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 p-6 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          {icon && <div className="text-gray-500">{icon}</div>}
          <Label className="text-sm font-semibold text-gray-700">{label}</Label>
        </div>
        {!isEditing ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onEdit();
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1 rounded-lg text-xs font-medium"
          >
            <Pencil className="w-3 h-3 mr-1" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveClick}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1 rounded-lg text-xs font-medium"
            >
              <Save className="w-3 h-3 mr-1" />
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelClick}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg text-xs font-medium"
            >
              <X className="w-3 h-3 mr-1" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="relative">
        {children ? (
          <div>{children}</div>
        ) : (
          <Input
            type={type}
            value={value !== undefined ? String(value) : ""}
            onChange={(e) => onChange(e.target.value)}
            readOnly={!isEditing}
            placeholder={placeholder}
            className={`w-full transition-all duration-200 ${
              isEditing
                ? "bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                : "bg-transparent border-transparent text-gray-800 font-medium"
            }`}
          />
        )}
        {error && (
          <div className="flex items-center gap-1 mt-2 text-red-500 text-xs">
            <div className="w-1 h-1 bg-red-500 rounded-full"></div>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

const initialMenteeData = {
  schoolDetails: {
    schoolName: "",
    class: "",
    city: "",
    startDate: "",
    endDate: "",
    userType: "school",
  },
  collegeDetails: {
    collegeName: "",
    course: "",
    specializedIn: "",
    city: "",
    startDate: "",
    endDate: "",
    userType: "college",
  },
  professionalDetails: {
    jobRole: "",
    company: "",
    experience: "",
    city: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    userType: "professional",
  },
};

const MenteeProfile: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const [activeTab, setActiveTab] = useState("overview");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [originalValues, setOriginalValues] = useState<{
    [key: string]: string;
  }>({});
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    bio: "",
    skills: [] as string[],
    profilePicture: "",
  });
  const [menteeData, setMenteeData] = useState(initialMenteeData);
  const [originalMenteeData, setOriginalMenteeData] =
    useState(initialMenteeData);
  const [editingMenteeField, setEditingMenteeField] = useState<string | null>(
    null
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

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 21 }, (_, i) =>
    (currentYear - 20 + i).toString()
  );
  useEffect(() => {
    const fetchUserData = async () => {
      dispatch(setLoading(true));
      try {
        const response = await userProfileData();
        if (response) {
          dispatch(setUser(response));
        } else {
          dispatch(setError("Failed to fetch user data"));
        }
      } catch (err) {
        dispatch(setError("An error occurred while fetching user data"));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchUserData();
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone ? String(user.phone) : "",
        email: user.email || "",
        bio: user.bio || "",
        skills: user.skills || [],
        profilePicture: user.profilePicture || "",
      });
      setMenteeData({
        schoolDetails: {
          schoolName: user.schoolDetails?.schoolName || "",
          class: user.schoolDetails?.class?.toString() || "",
          city: user.schoolDetails?.city || "",
          startDate: user.schoolDetails?.startDate?.slice(0, 4) || "",
          endDate: user.schoolDetails?.endDate?.slice(0, 4) || "",
          userType: user.schoolDetails?.userType || "school",
        },
        collegeDetails: {
          collegeName: user.collegeDetails?.collegeName || "",
          course: user.collegeDetails?.course || "",
          specializedIn: user.collegeDetails?.specializedIn || "",
          city: user.collegeDetails?.city || "",
          startDate: user.collegeDetails?.startDate?.slice(0, 4) || "",
          endDate: user.collegeDetails?.endDate?.slice(0, 4) || "",
          userType: user.collegeDetails?.userType || "college",
        },
        professionalDetails: {
          jobRole: user.professionalDetails?.jobRole || "",
          company: user.professionalDetails?.company || "",
          experience: user.professionalDetails?.experience || "",
          city: user.professionalDetails?.city || "",
          startDate: user.professionalDetails?.startDate?.slice(0, 4) || "",
          endDate: user.professionalDetails?.endDate?.slice(0, 4) || "",
          currentlyWorking: user.professionalDetails?.currentlyWorking || false,
          userType: user.professionalDetails?.userType || "professional",
        },
      });
      setOriginalMenteeData({
        schoolDetails: {
          schoolName: user.schoolDetails?.schoolName || "",
          class: user.schoolDetails?.class?.toString() || "",
          city: user.schoolDetails?.city || "",
          startDate: user.schoolDetails?.startDate?.slice(0, 4) || "",
          endDate: user.schoolDetails?.endDate?.slice(0, 4) || "",
          userType: user.schoolDetails?.userType || "school",
        },
        collegeDetails: {
          collegeName: user.collegeDetails?.collegeName || "",
          course: user.collegeDetails?.course || "",
          specializedIn: user.collegeDetails?.specializedIn || "",
          city: user.collegeDetails?.city || "",
          startDate: user.collegeDetails?.startDate?.slice(0, 4) || "",
          endDate: user.collegeDetails?.endDate?.slice(0, 4) || "",
          userType: user.collegeDetails?.userType || "college",
        },
        professionalDetails: {
          jobRole: user.professionalDetails?.jobRole || "",
          company: user.professionalDetails?.company || "",
          experience: user.professionalDetails?.experience || "",
          city: user.professionalDetails?.city || "",
          startDate: user.professionalDetails?.startDate?.slice(0, 4) || "",
          endDate: user.professionalDetails?.endDate?.slice(0, 4) || "",
          currentlyWorking: user.professionalDetails?.currentlyWorking || false,
          userType: user.professionalDetails?.userType || "professional",
        },
      });
      setPreviewUrl(user.profilePicture || null);
    }
  }, [user]);

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
      const response = await uploadProfileImage(formData);
      dispatch(setUser(response.data.data));
      setSelectedFile(null);
      setPreviewUrl(response.data.data.profilePicture);
      toast.success("Profile image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateProfileField = async (field: string, value: any) => {
    try {
      await profileSchema.validateAt(field, { [field]: value });
      const payload = { [field]: value };
      const updatedUser = await updateUserProfile(payload);
      dispatch(setUser(updatedUser));
      setProfileData((prev) => ({ ...prev, [field]: value }));
      setEditingField(null);
      toast.success(`${field} updated successfully`);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setFormErrors({ [field]: error.message });
        toast.error(error.message);
      } else {
        toast.error(`Failed to update ${field}`);
        console.error(error);
      }
    }
  };

  const handleMenteeChange = (
    section: "schoolDetails" | "collegeDetails" | "professionalDetails",
    field: string,
    value: any
  ) => {
    setMenteeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setFormErrors((prev) => ({ ...prev, [`${section}.${field}`]: "" }));
  };

  const validateMenteeField = async (
    section: "schoolDetails" | "collegeDetails" | "professionalDetails",
    field: string,
    value: any
  ) => {
    try {
      const sectionData = menteeData[section];
      const schema =
        section === "schoolDetails"
          ? schoolDetailsSchema
          : section === "collegeDetails"
          ? collegeDetailsSchema
          : professionalDetailsSchema;
      await schema.validateAt(field, sectionData);
      return { isValid: true, error: "" };
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        return { isValid: false, error: error.message };
      }
      throw error;
    }
  };

  const handleMenteeSave = async (
    section: "schoolDetails" | "collegeDetails" | "professionalDetails",
    field: string
  ) => {
    try {
      const value = menteeData[section][field];
      const validation = await validateMenteeField(section, field, value);
      if (!validation.isValid) {
        setFormErrors({ [`${section}.${field}`]: validation.error });
        toast.error(validation.error);
        return;
      }
      const payload = {
        [section]: { [field]: value },
      };
      const updatedUser = await updateUserProfile(payload);
      dispatch(setUser(updatedUser));
      setEditingMenteeField(null);
      setOriginalMenteeData(menteeData);
      setFormErrors({});
      toast.success(`${field} updated successfully`);
    } catch (error) {
      toast.error(`Failed to update ${field}`);
      console.error(error);
    }
  };

  const handleMenteeCancel = (
    section: "schoolDetails" | "collegeDetails" | "professionalDetails",
    field: string
  ) => {
    setMenteeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: originalMenteeData[section][field],
      },
    }));
    setFormErrors({});
    setEditingMenteeField(null);
  };

  const handleEdit = (field: string) => {
    setOriginalValues((prev) => ({ ...prev, [field]: profileData[field] }));
    setEditingField(field);
  };

  const handleCancel = (field: string) => {
    setProfileData((prev) => ({ ...prev, [field]: originalValues[field] }));
    setEditingField(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

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

  const handlePasswordUpdate = async () => {
    try {
      await passwordSchema.validate(
        { currentPassword, newPassword, confirmPassword },
        { abortEarly: false }
      );
      setIsPasswordUpdating(true);
      const response = await updateUserPassword(currentPassword, newPassword);
      if (response?.status === 200) {
        toast.success(response.data.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setEditingField(null);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to update password");
      console.error(error);
    } finally {
      setIsPasswordUpdating(false);
    }
  };
  return (
    <div className="flex-1 px-12 min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl px-12">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-violet-700"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.3,
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-end gap-12">
            {/* Profile Image */}
            <div className="relative group px-4">
              <div className="relative">
                {isImageLoading ? (
                  <div className="h-32 w-32 bg-white/20 backdrop-blur-sm rounded-3xl animate-pulse flex items-center justify-center border-4 border-white/30">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                ) : previewUrl ? (
                  <div className="h-32 w-32 rounded-3xl overflow-hidden border-4 border-white/30 shadow-2xl">
                    <ProfilePicture
                      profilePicture={previewUrl}
                      userName={`${user?.firstName} ${user?.lastName || ""}`}
                      size="xl"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : user?.profilePicture ? (
                  <div className="h-32 w-32 rounded-3xl overflow-hidden border-4 border-white/30 shadow-2xl">
                    <ProfilePicture
                      profilePicture={user.profilePicture}
                      userName={`${user?.firstName} ${user?.lastName || ""}`}
                      size="xl"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-32 w-32 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border-4 border-white/30 shadow-2xl">
                    <UploadIcon className="h-8 w-8 text-white" />
                  </div>
                )}

                {/* Image Upload Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-3xl transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <button
                      onClick={() =>
                        document.getElementById("image-upload")?.click()
                      }
                      disabled={isImageLoading}
                      className="bg-white/20 backdrop-blur-sm border border-white/30 text-white p-3 rounded-2xl hover:bg-white/30 transition-all duration-200"
                    >
                      <Camera className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Button for Image */}
              {selectedFile && (
                <div className="absolute -bottom-2 -right-2">
                  <button
                    onClick={handleImageSave}
                    disabled={isUploading}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 border-2 border-white"
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-white">
              <div className="mb-4">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                  {user?.firstName} {user?.lastName}
                </h1>
              </div>

              {/* Skills Section */}
              <div className="mt-6">
                {editingField === "skills" ? (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profileData.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-all duration-200 px-3 py-1 rounded-full"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(index)}
                            className="ml-2 hover:bg-white/20 rounded-full p-0.5"
                          >
                            <XIcon className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <Input
                          placeholder="Search or add a skill..."
                          value={skillSearchTerm}
                          onChange={(e) => {
                            setSkillSearchTerm(e.target.value);
                            setShowSkillDropdown(true);
                          }}
                          onFocus={() => setShowSkillDropdown(true)}
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 focus:border-white/50"
                        />
                        <SearchIcon className="absolute right-3 top-3 h-4 w-4 text-white/70" />
                        {showSkillDropdown && filteredSkills.length > 0 && (
                          <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-auto">
                            {filteredSkills.map((skill, index) => (
                              <div
                                key={index}
                                className="px-4 py-3 hover:bg-emerald-50 cursor-pointer text-gray-800 transition-colors duration-200"
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
                      <Button
                        onClick={() => handleSave("skills", profileData.skills)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 rounded-xl px-6"
                      >
                        Save Skills
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="group flex items-start justify-between bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-emerald-100 mb-2">
                        Skills & Interests
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profileData?.skills?.length > 0 ? (
                          profileData.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-all duration-200 px-3 py-1 rounded-full"
                            >
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-white/70 italic">
                            Add your skills and interests to showcase your
                            learning journey
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleEdit("skills")}
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white hover:bg-white/20 rounded-xl"
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl border-b-2 border-blue-600 rounded-b-xl  p-8 min-h-screen -z-20">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="flex gap-8 border-b mb-8">
            <Tabs.Trigger
              value="overview"
              className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-all duration-200 ${
                activeTab === "overview"
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <User className="w-4 h-4" />
              Personal Profile
            </Tabs.Trigger>
            <Tabs.Trigger
              value="as-mentee"
              className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-all duration-200 ${
                activeTab === "as-mentee"
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Learning Journey
            </Tabs.Trigger>
          </Tabs.List>

          {/* Overview Tab */}
          <Tabs.Content value="overview">
            <div className="max-w-4xl">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Personal Information
                </h2>
                <p className="text-gray-600">
                  Manage your basic profile information and credentials
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email Field - Special styling */}
                <div className="md:col-span-2 bg-emerald-50 rounded-xl border border-emerald-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CircleCheckBig className="w-6 h-6 text-emerald-600" />
                      <div>
                        <Label className="text-sm font-semibold text-emerald-800">
                          Email Address
                        </Label>
                        <p className="text-emerald-700 font-medium">
                          {profileData.email}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                      Verified
                    </Badge>
                  </div>
                </div>

                <EditableField
                  label="First Name"
                  field="firstName"
                  value={profileData.firstName}
                  isEditing={editingField === "firstName"}
                  onEdit={() => setEditingField("firstName")}
                  onSave={async () =>
                    await updateProfileField("firstName", profileData.firstName)
                  }
                  onCancel={() => setEditingField(null)}
                  onChange={(value) =>
                    setProfileData((prev) => ({ ...prev, firstName: value }))
                  }
                  error={formErrors.firstName}
                  placeholder="Enter your first name"
                />

                <EditableField
                  label="Last Name"
                  field="lastName"
                  value={profileData.lastName}
                  isEditing={editingField === "lastName"}
                  onEdit={() => setEditingField("lastName")}
                  onSave={async () =>
                    await updateProfileField("lastName", profileData.lastName)
                  }
                  onCancel={() => setEditingField(null)}
                  onChange={(value) =>
                    setProfileData((prev) => ({ ...prev, lastName: value }))
                  }
                  error={formErrors.lastName}
                  placeholder="Enter your last name"
                />

                <EditableField
                  label="Phone Number"
                  field="phone"
                  value={profileData.phone}
                  isEditing={editingField === "phone"}
                  onEdit={() => setEditingField("phone")}
                  onSave={async () =>
                    await updateProfileField("phone", profileData.phone)
                  }
                  onCancel={() => setEditingField(null)}
                  onChange={(value) =>
                    setProfileData((prev) => ({ ...prev, phone: value }))
                  }
                  type="tel"
                  error={formErrors.phone}
                  placeholder="Enter your phone number"
                />

                {/* Password Field - Special handling */}
                {editingField === "password" ? (
                  <div className="md:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Change Password
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="relative">
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          Current Password
                        </Label>
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Current password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-2 top-8"
                        >
                          {showCurrentPassword ? (
                            <EyeOffIcon size={16} />
                          ) : (
                            <EyeIcon size={16} />
                          )}
                        </Button>
                        {formErrors.currentPassword && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.currentPassword}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          New Password
                        </Label>
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="New password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-2 top-8"
                        >
                          {showNewPassword ? (
                            <EyeOffIcon size={16} />
                          ) : (
                            <EyeIcon size={16} />
                          )}
                        </Button>
                        {formErrors.newPassword && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.newPassword}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          Confirm Password
                        </Label>
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-2 top-8"
                        >
                          {showConfirmPassword ? (
                            <EyeOffIcon size={16} />
                          ) : (
                            <EyeIcon size={16} />
                          )}
                        </Button>
                        {formErrors.confirmPassword && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <Button
                        onClick={handlePasswordUpdate}
                        disabled={isPasswordUpdating}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6"
                      >
                        {isPasswordUpdating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Update Password
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingField(null)}
                        className="rounded-xl px-6"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="md:col-span-2 group bg-white rounded-xl border border-gray-100 p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="text-sm font-semibold text-gray-700">
                          Password
                        </Label>
                        <p className="text-gray-500 text-sm mt-1">
                          Change your password regularly for better security
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingField("password")}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Change Password
                      </Button>
                    </div>
                  </div>
                )}

                {user?.mentorActivated && (
                  <div className="md:col-span-2">
                    <EditableField
                      label="Bio"
                      field="bio"
                      value={profileData.bio}
                      isEditing={editingField === "bio"}
                      onEdit={() => setEditingField("bio")}
                      onSave={async () =>
                        await updateProfileField("bio", profileData.bio)
                      }
                      onCancel={() => setEditingField(null)}
                      onChange={(value) =>
                        setProfileData((prev) => ({ ...prev, bio: value }))
                      }
                      error={formErrors.bio}
                      placeholder="Tell others about yourself and your learning goals..."
                    >
                      <Textarea
                        className={`w-full h-32 transition-all duration-200 ${
                          editingField === "bio"
                            ? "bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                            : "bg-transparent border-transparent resize-none text-gray-800"
                        }`}
                        placeholder="Tell others about yourself and your learning goals..."
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        readOnly={editingField !== "bio"}
                      />
                    </EditableField>
                  </div>
                )}
              </div>
            </div>
          </Tabs.Content>

          {/* As Mentee Tab */}
          <Tabs.Content value="as-mentee">
            <div className="max-w-4xl">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Your Learning Journey
                </h2>
                <p className="text-gray-600">
                  Share your educational background and career aspirations
                </p>
              </div>

              <div className="space-y-8">
                {/* School Details */}
                {user?.schoolDetails?.userType === "school" && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <School className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-green-800">
                          School Student
                        </h3>
                        <p className="text-green-600 text-sm">
                          Your current academic journey
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <EditableField
                        label="School Name"
                        field="schoolDetails.schoolName"
                        value={menteeData.schoolDetails.schoolName}
                        isEditing={
                          editingMenteeField === "schoolDetails.schoolName"
                        }
                        onEdit={() =>
                          setEditingMenteeField("schoolDetails.schoolName")
                        }
                        onSave={async () =>
                          await handleMenteeSave("schoolDetails", "schoolName")
                        }
                        onCancel={() =>
                          handleMenteeCancel("schoolDetails", "schoolName")
                        }
                        onChange={(value) =>
                          handleMenteeChange(
                            "schoolDetails",
                            "schoolName",
                            value
                          )
                        }
                        error={formErrors["schoolDetails.schoolName"]}
                        placeholder="Enter your school name"
                      />

                      <EditableField
                        label="Class"
                        field="schoolDetails.class"
                        value={menteeData.schoolDetails.class}
                        isEditing={editingMenteeField === "schoolDetails.class"}
                        onEdit={() =>
                          setEditingMenteeField("schoolDetails.class")
                        }
                        onSave={async () =>
                          await handleMenteeSave("schoolDetails", "class")
                        }
                        onCancel={() =>
                          handleMenteeCancel("schoolDetails", "class")
                        }
                        onChange={(value) =>
                          handleMenteeChange("schoolDetails", "class", value)
                        }
                        error={formErrors["schoolDetails.class"]}
                      >
                        <Select
                          value={
                            menteeData.schoolDetails.class?.toString() || ""
                          }
                          onValueChange={(value) =>
                            handleMenteeChange("schoolDetails", "class", value)
                          }
                          disabled={
                            editingMenteeField !== "schoolDetails.class"
                          }
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select Class" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(
                              (num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  Class {num}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </EditableField>

                      <EditableField
                        label="City"
                        field="schoolDetails.city"
                        value={menteeData.schoolDetails.city}
                        isEditing={editingMenteeField === "schoolDetails.city"}
                        onEdit={() =>
                          setEditingMenteeField("schoolDetails.city")
                        }
                        onSave={async () =>
                          await handleMenteeSave("schoolDetails", "city")
                        }
                        onCancel={() =>
                          handleMenteeCancel("schoolDetails", "city")
                        }
                        onChange={(value) =>
                          handleMenteeChange("schoolDetails", "city", value)
                        }
                        error={formErrors["schoolDetails.city"]}
                        icon={<MapPin className="w-4 h-4" />}
                        placeholder="Enter your city"
                      />
                    </div>
                  </div>
                )}

                {/* College Details */}
                {(user?.collegeDetails?.userType === "college" ||
                  user?.collegeDetails?.userType === "fresher") && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-blue-800">
                          {user?.collegeDetails?.userType === "college"
                            ? "College Student"
                            : "Fresh Graduate"}
                        </h3>
                        <p className="text-blue-600 text-sm">
                          Your higher education journey
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <EditableField
                        label="College Name"
                        field="collegeDetails.collegeName"
                        value={menteeData.collegeDetails.collegeName}
                        isEditing={
                          editingMenteeField === "collegeDetails.collegeName"
                        }
                        onEdit={() =>
                          setEditingMenteeField("collegeDetails.collegeName")
                        }
                        onSave={async () =>
                          await handleMenteeSave(
                            "collegeDetails",
                            "collegeName"
                          )
                        }
                        onCancel={() =>
                          handleMenteeCancel("collegeDetails", "collegeName")
                        }
                        onChange={(value) =>
                          handleMenteeChange(
                            "collegeDetails",
                            "collegeName",
                            value
                          )
                        }
                        error={formErrors["collegeDetails.collegeName"]}
                        placeholder="Enter your college name"
                      />

                      <EditableField
                        label="Course"
                        field="collegeDetails.course"
                        value={menteeData.collegeDetails.course}
                        isEditing={
                          editingMenteeField === "collegeDetails.course"
                        }
                        onEdit={() =>
                          setEditingMenteeField("collegeDetails.course")
                        }
                        onSave={async () =>
                          await handleMenteeSave("collegeDetails", "course")
                        }
                        onCancel={() =>
                          handleMenteeCancel("collegeDetails", "course")
                        }
                        onChange={(value) =>
                          handleMenteeChange("collegeDetails", "course", value)
                        }
                        error={formErrors["collegeDetails.course"]}
                      >
                        <Select
                          value={menteeData.collegeDetails.course}
                          onValueChange={(value) =>
                            handleMenteeChange(
                              "collegeDetails",
                              "course",
                              value
                            )
                          }
                          disabled={
                            editingMenteeField !== "collegeDetails.course"
                          }
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select Course" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="btech">B.Tech</SelectItem>
                            <SelectItem value="bsc">B.Sc</SelectItem>
                            <SelectItem value="bca">BCA</SelectItem>
                            <SelectItem value="mca">MCA</SelectItem>
                          </SelectContent>
                        </Select>
                      </EditableField>

                      <EditableField
                        label="Specialized In"
                        field="collegeDetails.specializedIn"
                        value={menteeData.collegeDetails.specializedIn}
                        isEditing={
                          editingMenteeField === "collegeDetails.specializedIn"
                        }
                        onEdit={() =>
                          setEditingMenteeField("collegeDetails.specializedIn")
                        }
                        onSave={async () =>
                          await handleMenteeSave(
                            "collegeDetails",
                            "specializedIn"
                          )
                        }
                        onCancel={() =>
                          handleMenteeCancel("collegeDetails", "specializedIn")
                        }
                        onChange={(value) =>
                          handleMenteeChange(
                            "collegeDetails",
                            "specializedIn",
                            value
                          )
                        }
                        error={formErrors["collegeDetails.specializedIn"]}
                      >
                        <Select
                          value={menteeData.collegeDetails.specializedIn}
                          onValueChange={(value) =>
                            handleMenteeChange(
                              "collegeDetails",
                              "specializedIn",
                              value
                            )
                          }
                          disabled={
                            editingMenteeField !==
                            "collegeDetails.specializedIn"
                          }
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select Specialization" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="cs">Computer Science</SelectItem>
                            <SelectItem value="it">
                              Information Technology
                            </SelectItem>
                            <SelectItem value="ec">Electronics</SelectItem>
                            <SelectItem value="me">Mechanical</SelectItem>
                          </SelectContent>
                        </Select>
                      </EditableField>

                      <EditableField
                        label="City"
                        field="collegeDetails.city"
                        value={menteeData.collegeDetails.city}
                        isEditing={editingMenteeField === "collegeDetails.city"}
                        onEdit={() =>
                          setEditingMenteeField("collegeDetails.city")
                        }
                        onSave={async () =>
                          await handleMenteeSave("collegeDetails", "city")
                        }
                        onCancel={() =>
                          handleMenteeCancel("collegeDetails", "city")
                        }
                        onChange={(value) =>
                          handleMenteeChange("collegeDetails", "city", value)
                        }
                        error={formErrors["collegeDetails.city"]}
                        icon={<MapPin className="w-4 h-4" />}
                        placeholder="Enter your city"
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <EditableField
                          label="Start Year"
                          field="collegeDetails.startDate"
                          value={menteeData.collegeDetails.startDate}
                          isEditing={
                            editingMenteeField === "collegeDetails.startDate"
                          }
                          onEdit={() =>
                            setEditingMenteeField("collegeDetails.startDate")
                          }
                          onSave={async () =>
                            await handleMenteeSave(
                              "collegeDetails",
                              "startDate"
                            )
                          }
                          onCancel={() =>
                            handleMenteeCancel("collegeDetails", "startDate")
                          }
                          onChange={(value) =>
                            handleMenteeChange(
                              "collegeDetails",
                              "startDate",
                              value
                            )
                          }
                          error={formErrors["collegeDetails.startDate"]}
                          icon={<Calendar className="w-4 h-4" />}
                        >
                          <Select
                            value={menteeData.collegeDetails.startDate}
                            onValueChange={(value) =>
                              handleMenteeChange(
                                "collegeDetails",
                                "startDate",
                                value
                              )
                            }
                            disabled={
                              editingMenteeField !== "collegeDetails.startDate"
                            }
                          >
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent className="bg-white max-h-56 overflow-y-auto">
                              {yearOptions.map((year) => (
                                <SelectItem key={year} value={year}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </EditableField>

                        <EditableField
                          label="End Year"
                          field="collegeDetails.endDate"
                          value={menteeData.collegeDetails.endDate}
                          isEditing={
                            editingMenteeField === "collegeDetails.endDate"
                          }
                          onEdit={() =>
                            setEditingMenteeField("collegeDetails.endDate")
                          }
                          onSave={async () =>
                            await handleMenteeSave("collegeDetails", "endDate")
                          }
                          onCancel={() =>
                            handleMenteeCancel("collegeDetails", "endDate")
                          }
                          onChange={(value) =>
                            handleMenteeChange(
                              "collegeDetails",
                              "endDate",
                              value
                            )
                          }
                          error={formErrors["collegeDetails.endDate"]}
                          icon={<Calendar className="w-4 h-4" />}
                        >
                          <Select
                            value={menteeData.collegeDetails.endDate}
                            onValueChange={(value) =>
                              handleMenteeChange(
                                "collegeDetails",
                                "endDate",
                                value
                              )
                            }
                            disabled={
                              editingMenteeField !== "collegeDetails.endDate"
                            }
                          >
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent className="bg-white max-h-56 overflow-y-auto">
                              {yearOptions.map((year) => (
                                <SelectItem key={year} value={year}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </EditableField>
                      </div>
                    </div>
                  </div>
                )}

                {/* Professional Details */}
                {user?.professionalDetails?.userType === "professional" && (
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-purple-100 rounded-xl">
                        <Briefcase className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-purple-800">
                          Professional Experience
                        </h3>
                        <p className="text-purple-600 text-sm">
                          Your career journey and growth
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <EditableField
                        label="Job Role"
                        field="professionalDetails.jobRole"
                        value={menteeData.professionalDetails.jobRole}
                        isEditing={
                          editingMenteeField === "professionalDetails.jobRole"
                        }
                        onEdit={() =>
                          setEditingMenteeField("professionalDetails.jobRole")
                        }
                        onSave={async () =>
                          await handleMenteeSave(
                            "professionalDetails",
                            "jobRole"
                          )
                        }
                        onCancel={() =>
                          handleMenteeCancel("professionalDetails", "jobRole")
                        }
                        onChange={(value) =>
                          handleMenteeChange(
                            "professionalDetails",
                            "jobRole",
                            value
                          )
                        }
                        error={formErrors["professionalDetails.jobRole"]}
                      >
                        <Select
                          value={menteeData.professionalDetails.jobRole}
                          onValueChange={(value) =>
                            handleMenteeChange(
                              "professionalDetails",
                              "jobRole",
                              value
                            )
                          }
                          disabled={
                            editingMenteeField !== "professionalDetails.jobRole"
                          }
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select Job Role" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="sde">
                              Software Developer
                            </SelectItem>
                            <SelectItem value="designer">
                              UI/UX Designer
                            </SelectItem>
                            <SelectItem value="pm">Product Manager</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </EditableField>

                      <EditableField
                        label="Company"
                        field="professionalDetails.company"
                        value={menteeData.professionalDetails.company}
                        isEditing={
                          editingMenteeField === "professionalDetails.company"
                        }
                        onEdit={() =>
                          setEditingMenteeField("professionalDetails.company")
                        }
                        onSave={async () =>
                          await handleMenteeSave(
                            "professionalDetails",
                            "company"
                          )
                        }
                        onCancel={() =>
                          handleMenteeCancel("professionalDetails", "company")
                        }
                        onChange={(value) =>
                          handleMenteeChange(
                            "professionalDetails",
                            "company",
                            value
                          )
                        }
                        error={formErrors["professionalDetails.company"]}
                        placeholder="Enter your company name"
                      />

                      <EditableField
                        label="Total Experience"
                        field="professionalDetails.experience"
                        value={menteeData.professionalDetails.experience}
                        isEditing={
                          editingMenteeField ===
                          "professionalDetails.experience"
                        }
                        onEdit={() =>
                          setEditingMenteeField(
                            "professionalDetails.experience"
                          )
                        }
                        onSave={async () =>
                          await handleMenteeSave(
                            "professionalDetails",
                            "experience"
                          )
                        }
                        onCancel={() =>
                          handleMenteeCancel(
                            "professionalDetails",
                            "experience"
                          )
                        }
                        onChange={(value) =>
                          handleMenteeChange(
                            "professionalDetails",
                            "experience",
                            value
                          )
                        }
                        error={formErrors["professionalDetails.experience"]}
                      >
                        <Select
                          value={menteeData.professionalDetails.experience}
                          onValueChange={(value) =>
                            handleMenteeChange(
                              "professionalDetails",
                              "experience",
                              value
                            )
                          }
                          disabled={
                            editingMenteeField !==
                            "professionalDetails.experience"
                          }
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select Experience" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="0-1">0-1 years</SelectItem>
                            <SelectItem value="1-3">1-3 years</SelectItem>
                            <SelectItem value="3-5">3-5 years</SelectItem>
                            <SelectItem value="5+">5+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </EditableField>

                      <EditableField
                        label="City"
                        field="professionalDetails.city"
                        value={menteeData.professionalDetails.city}
                        isEditing={
                          editingMenteeField === "professionalDetails.city"
                        }
                        onEdit={() =>
                          setEditingMenteeField("professionalDetails.city")
                        }
                        onSave={async () =>
                          await handleMenteeSave("professionalDetails", "city")
                        }
                        onCancel={() =>
                          handleMenteeCancel("professionalDetails", "city")
                        }
                        onChange={(value) =>
                          handleMenteeChange(
                            "professionalDetails",
                            "city",
                            value
                          )
                        }
                        error={formErrors["professionalDetails.city"]}
                        icon={<MapPin className="w-4 h-4" />}
                        placeholder="Enter your city"
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <EditableField
                          label="Start Year"
                          field="professionalDetails.startDate"
                          value={menteeData.professionalDetails.startDate}
                          isEditing={
                            editingMenteeField ===
                            "professionalDetails.startDate"
                          }
                          onEdit={() =>
                            setEditingMenteeField(
                              "professionalDetails.startDate"
                            )
                          }
                          onSave={async () =>
                            await handleMenteeSave(
                              "professionalDetails",
                              "startDate"
                            )
                          }
                          onCancel={() =>
                            handleMenteeCancel(
                              "professionalDetails",
                              "startDate"
                            )
                          }
                          onChange={(value) =>
                            handleMenteeChange(
                              "professionalDetails",
                              "startDate",
                              value
                            )
                          }
                          error={formErrors["professionalDetails.startDate"]}
                          icon={<Calendar className="w-4 h-4" />}
                        >
                          <Select
                            value={menteeData.professionalDetails.startDate}
                            onValueChange={(value) =>
                              handleMenteeChange(
                                "professionalDetails",
                                "startDate",
                                value
                              )
                            }
                            disabled={
                              editingMenteeField !==
                              "professionalDetails.startDate"
                            }
                          >
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent className="bg-white max-h-56 overflow-y-auto">
                              {yearOptions.map((year) => (
                                <SelectItem key={year} value={year}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </EditableField>
                      </div>

                      <div className="md:col-span-2">
                        <EditableField
                          label="Currently Working"
                          field="professionalDetails.currentlyWorking"
                          value={undefined}
                          isEditing={
                            editingMenteeField ===
                            "professionalDetails.currentlyWorking"
                          }
                          onEdit={() =>
                            setEditingMenteeField(
                              "professionalDetails.currentlyWorking"
                            )
                          }
                          onSave={async () =>
                            await handleMenteeSave(
                              "professionalDetails",
                              "currentlyWorking"
                            )
                          }
                          onCancel={() =>
                            handleMenteeCancel(
                              "professionalDetails",
                              "currentlyWorking"
                            )
                          }
                          onChange={() => {}}
                          error={
                            formErrors["professionalDetails.currentlyWorking"]
                          }
                        >
                          <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-200">
                            <Checkbox
                              id="currentlyWorking"
                              checked={
                                menteeData.professionalDetails.currentlyWorking
                              }
                              onCheckedChange={(checked) =>
                                handleMenteeChange(
                                  "professionalDetails",
                                  "currentlyWorking",
                                  !!checked
                                )
                              }
                              disabled={
                                editingMenteeField !==
                                "professionalDetails.currentlyWorking"
                              }
                              className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                            />
                            <Label
                              htmlFor="currentlyWorking"
                              className="text-gray-700 font-medium"
                            >
                              I'm currently working at this company
                            </Label>
                          </div>
                        </EditableField>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>

      {/* Loading Overlays */}
      <Dialog open={isUploading} onOpenChange={setIsUploading}>
        <DialogContent className="bg-white rounded-2xl border-0 shadow-2xl">
          <div className="flex flex-col items-center p-6">
            <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
            <p className="text-lg font-semibold text-gray-800 mt-4">
              Uploading your image...
            </p>
            <p className="text-sm text-gray-600 mt-1">
              This will only take a moment
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Global Loading Overlay */}
      {user?.loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-gray-700 font-medium">
              Updating your profile...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenteeProfile;
