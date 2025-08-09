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
// import { setUser, setLoading } from "@/redux/slices/userSlice";
// import { updateUserProfile, updateUserPassword } from "@/services/userServices";
// import { uploadProfileImage } from "@/services/uploadService";
// import { getUserDetails } from "@/services/mentorService";
// import { toast } from "react-hot-toast";
// import { Badge } from "@/components/ui/badge";
// import { Textarea } from "@/components/ui/textarea";
// import * as Yup from "yup";
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

// // Validation Schemas
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
//   shortInfo: Yup.string().optional(),
//   achievements: Yup.string()
//     .required("achievements is required")
//     .min(2, "Too short"),
//   linkedinURL: Yup.string().url("Invalid URL").nullable().optional(),
//   portfolioURL: Yup.string().url("Invalid URL").nullable().optional(),
//   interestedNewCareer: Yup.array()
//     .of(Yup.string())
//     .optional()
//     .transform((value) =>
//       typeof value === "string"
//         ? value
//             .split(",")
//             .map((v) => v.trim())
//             .filter(Boolean)
//         : value
//     ),
//   featuredArticle: Yup.string().optional(),
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
//   endDate: Yup.string().when("currentlyWorking", {
//     is: false,
//     then: (schema) => schema.required("End year is required"),
//     otherwise: (schema) => schema.optional(),
//   }),
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
//   value?: string | boolean;
//   onChange: (value: any) => void;
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
//   const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     onSave();
//   };

//   const handleCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     onCancel();
//   };

//   return (
//     <div className="mb-6">
//       <div className="flex justify-between items-center mb-2">
//         <Label>{label}</Label>
//         {!isEditing ? (
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={(e) => {
//               e.preventDefault();
//               onEdit();
//             }}
//             className="text-black hover:underline"
//           >
//             Edit
//           </Button>
//         ) : (
//           <div className="flex gap-2">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={handleSaveClick}
//               className="text-green-600 hover:underline"
//             >
//               Save
//             </Button>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={handleCancelClick}
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
//           value={value !== undefined ? String(value) : ""}
//           onChange={(e) => onChange(e.target.value)}
//           readOnly={!isEditing}
//           className="w-full bg-white"
//         />
//       )}
//       {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
//     </div>
//   );
// };
// type MenteeDataType = {
//   schoolDetails: {
//     schoolName: string;
//     class: string;
//     city: string;
//     startDate: string;
//     endDate: string;
//     userType: string;
//   };
//   collegeDetails: {
//     collegeName: string;
//     course: string;
//     specializedIn: string;
//     city: string;
//     startDate: string;
//     endDate: string;
//     userType: string;
//   };
//   professionalDetails: {
//     jobRole: string;
//     company: string;
//     experience: string;
//     city: string;
//     startDate: string;
//     endDate: string;
//     currentlyWorking: boolean;
//     userType: string;
//   };
// };

// const initialMenteeData: MenteeDataType = {
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

// const MentorProfile: React.FC = () => {
//   const dispatch = useDispatch();
//   const { user, error, loading } = useSelector(
//     (state: RootState) => state.user
//   );
//   const [activeTab, setActiveTab] = useState("profile");
//   const [editingField, setEditingField] = useState<string | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [isImageLoading, setIsImageLoading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
//     [key: string]: any;
//   }>({});
//   const [isUploading, setIsUploading] = useState(false);
//   const [profileData, setProfileData] = useState({
//     firstName: "",
//     lastName: "",
//     phone: "",
//     email: "",
//     bio: "",
//     skills: [] as string[],
//     shortInfo: "",
//     profilePicture: "",
//     achievements: "",
//     linkedinURL: "",
//     portfolioURL: "",
//     interestedNewCareer: [] as string[],
//     featuredArticle: "",
//   });
//   const [mentorData, setMentorData] = useState(initialMenteeData);
//   const [originalMentorData, setOriginalMentorData] =
//     useState(initialMenteeData);
//   const [editingMentorField, setEditingMentorField] = useState<string | null>(
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

//   // Fetch user details
//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       if (user && user._id) {
//         dispatch(setLoading(true));
//         try {
//           const userDetails = await getUserDetails(user._id);
//           console.log("FETCHED ||||||||||| ....>?,", userDetails);

//           const data = userDetails.data;
//           setProfileData({
//             firstName: data.firstName || "",
//             lastName: data.lastName || "",
//             phone: data.phone ? String(data.phone) : "",
//             email: data.email || "",
//             bio: data.mentorId?.bio || "",
//             skills: data.skills || [],
//             shortInfo: data.shortInfo || "",
//             profilePicture: data.profilePicture || "",
//             achievements: data.mentorId?.achievements || "",
//             linkedinURL: data.mentorId?.linkedinURL || "",
//             portfolioURL: data.mentorId?.portfolio || "",
//             interestedNewCareer: data.mentorId?.interestedNewCareer || [],
//             featuredArticle: data.mentorId?.featuredArticle || "",
//           });
//           setMentorData({
//             schoolDetails: {
//               schoolName: data.schoolDetails?.schoolName || "",
//               class: data.schoolDetails?.class?.toString() || "",
//               city: data.schoolDetails?.city || "",
//               startDate: data.schoolDetails?.startDate?.slice(0, 4) || "",
//               endDate: data.schoolDetails?.endDate?.slice(0, 4) || "",
//               userType: data.schoolDetails?.userType || "school",
//             },
//             collegeDetails: {
//               collegeName: data.collegeDetails?.collegeName || "",
//               course: data.collegeDetails?.course || "",
//               specializedIn: data.collegeDetails?.specializedIn || "",
//               city: data.collegeDetails?.city || "",
//               startDate: data.collegeDetails?.startDate?.slice(0, 4) || "",
//               endDate: data.collegeDetails?.endDate?.slice(0, 4) || "",
//               userType: data.collegeDetails?.userType || "college",
//             },
//             professionalDetails: {
//               jobRole: data.professionalDetails?.jobRole || "",
//               company: data.professionalDetails?.company || "",
//               experience: data.professionalDetails?.experience || "",
//               city: data.professionalDetails?.city || "",
//               startDate: data.professionalDetails?.startDate?.slice(0, 4) || "",
//               endDate: data.professionalDetails?.endDate?.slice(0, 4) || "",
//               currentlyWorking:
//                 data.professionalDetails?.currentlyWorking || false,
//               userType: data.professionalDetails?.userType || "professional",
//             },
//           });
//           setOriginalMentorData({
//             schoolDetails: {
//               schoolName: data.schoolDetails?.schoolName || "",
//               class: data.schoolDetails?.class?.toString() || "",
//               city: data.schoolDetails?.city || "",
//               startDate: data.schoolDetails?.startDate?.slice(0, 4) || "",
//               endDate: data.schoolDetails?.endDate?.slice(0, 4) || "",
//               userType: data.schoolDetails?.userType || "school",
//             },
//             collegeDetails: {
//               collegeName: data.collegeDetails?.collegeName || "",
//               course: data.collegeDetails?.course || "",
//               specializedIn: data.collegeDetails?.specializedIn || "",
//               city: data.collegeDetails?.city || "",
//               startDate: data.collegeDetails?.startDate?.slice(0, 4) || "",
//               endDate: data.collegeDetails?.endDate?.slice(0, 4) || "",
//               userType: data.collegeDetails?.userType || "college",
//             },
//             professionalDetails: {
//               jobRole: data.professionalDetails?.jobRole || "",
//               company: data.professionalDetails?.company || "",
//               experience: data.professionalDetails?.experience || "",
//               city: data.professionalDetails?.city || "",
//               startDate: data.professionalDetails?.startDate?.slice(0, 4) || "",
//               endDate: data.professionalDetails?.endDate?.slice(0, 4) || "",
//               currentlyWorking:
//                 data.professionalDetails?.currentlyWorking || false,
//               userType: data.professionalDetails?.userType || "professional",
//             },
//           });
//           setPreviewUrl(data.profilePicture || null);
//         } catch (error) {
//           console.error("Failed to fetch user details", error);
//           toast.error("Failed to load profile data.");
//         } finally {
//           dispatch(setLoading(false));
//         }
//       } else {
//         dispatch(setLoading(false));
//         toast.error("User not found. Please log in again.");
//       }
//     };
//     fetchUserDetails();
//   }, [dispatch]);

//   // Password validation
//   useEffect(() => {
//     const validate = async () => {
//       try {
//         console.log("currentPassword ....", currentPassword);
//         console.log("newPassword ....", newPassword);
//         console.log("confirmPassword ....", confirmPassword);
//         await passwordSchema.validate(
//           { currentPassword, newPassword, confirmPassword },
//           { abortEarly: false }
//         );
//         setFormErrors((prev) => ({
//           ...prev,
//           currentPassword: "",
//           newPassword: "",
//           confirmPassword: "",
//         }));
//       } catch (validationErrors: any) {
//         const errorObj: Record<string, string> = {};
//         validationErrors.inner.forEach((err: any) => {
//           errorObj[err.path] = err.message;
//         });
//         setFormErrors((prev) => ({ ...prev, ...errorObj }));
//       }
//     };
//     validate();
//   }, [currentPassword, newPassword, confirmPassword]);

//   // Handle image upload
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

//   const handleImageSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     if (!selectedFile) {
//       toast.error("No image selected to upload");
//       return;
//     }
//     dispatch(setLoading(true));
//     try {
//       const formData = new FormData();
//       formData.append("image", selectedFile);
//       const response = await uploadProfileImage(formData);
//       const newProfilePictureUrl = response?.profilePicture;
//       if (newProfilePictureUrl) {
//         setPreviewUrl(newProfilePictureUrl);
//         setProfileData((prev) => ({
//           ...prev,
//           profilePicture: newProfilePictureUrl,
//         }));
//         dispatch(setUser({ ...user, profilePicture: newProfilePictureUrl }));
//       }
//       toast.success("Profile image uploaded successfully");
//       setSelectedFile(null);
//     } catch (error) {
//       toast.error("Failed to upload image");
//       console.error(error);
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   const updateProfileField = async (field: string, value: any) => {
//     try {
//       let validationValue = value;

//       await profileSchema.validateAt(field, { [field]: validationValue });
//       const payload = { [field]: value };
//       const updatedUser = await updateUserProfile(payload);
//       dispatch(setUser(updatedUser));
//       setProfileData((prev) => ({ ...prev, [field]: value }));
//       setFormErrors((prev) => ({ ...prev, [field]: "" }));
//       toast.success(`${field} updated successfully`);
//     } catch (error) {
//       if (error instanceof Yup.ValidationError) {
//         setFormErrors({ [field]: error.message });
//         toast.error(error.message);
//       } else {
//         toast.error(`Failed to update ${field}`);
//         console.error(error);
//       }
//       throw error;
//     }
//   };

//   const handleMentorChange = (
//     section: "schoolDetails" | "collegeDetails" | "professionalDetails",
//     field: string,
//     value: any
//   ) => {
//     setMentorData((prev) => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [field]: value,
//       },
//     }));
//     setFormErrors((prev) => ({ ...prev, [`${section}.${field}`]: "" }));
//   };

//   const validateMentorField = async (
//     section: "schoolDetails" | "collegeDetails" | "professionalDetails",
//     field: string,
//     value: any
//   ) => {
//     try {
//       const sectionData = mentorData[section];
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

//   const handleMentorSave = async (
//     section: "schoolDetails" | "collegeDetails" | "professionalDetails",
//     field: string
//   ) => {
//     try {
//       const value = mentorData[section][field];
//       const validation = await validateMentorField(section, field, value);
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
//       setMentorData((prev) => ({
//         ...prev,
//         [section]: {
//           ...prev[section],
//           [field]: value,
//         },
//       }));
//       setOriginalMentorData((prev) => ({
//         ...prev,
//         [section]: {
//           ...prev[section],
//           [field]: value,
//         },
//       }));
//       setEditingMentorField(null);
//       setFormErrors((prev) => ({ ...prev, [`${section}.${field}`]: "" }));
//       toast.success(`${field} updated successfully`);
//     } catch (error) {
//       toast.error(`Failed to update ${field}`);
//       console.error(error);
//     }
//   };

//   const handleMentorCancel = (
//     section: "schoolDetails" | "collegeDetails" | "professionalDetails",
//     field: string
//   ) => {
//     setMentorData((prev) => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [field]: originalMentorData[section][field],
//       },
//     }));
//     setFormErrors({});
//     setEditingMentorField(null);
//   };

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

//   const handleSave = async (field: string, value?: any) => {
//     try {
//       await updateProfileField(
//         field,
//         value !== undefined
//           ? value
//           : profileData[field as keyof typeof profileData]
//       );
//       setEditingField(null);
//     } catch (error) {
//       console.error(`Error saving ${field}:`, error);
//     }
//   };

//   const addSkill = (skill: string) => {
//     if (skill && !profileData.skills.includes(skill)) {
//       const updatedSkills = [...profileData.skills, skill];
//       setProfileData((prev) => ({ ...prev, skills: updatedSkills }));
//       setSkillSearchTerm("");
//     }
//   };

//   const removeSkill = (index: number) => {
//     const updatedSkills = profileData.skills.filter((_, i) => i !== index);
//     setProfileData((prev) => ({ ...prev, skills: updatedSkills }));
//   };

//   const filteredSkills = presetSkills.filter(
//     (skill) =>
//       skill.toLowerCase().includes(skillSearchTerm.toLowerCase()) &&
//       !profileData.skills.includes(skill)
//   );

//   const handlePasswordUpdate = async () => {
//     try {
//       console.log("currentPassword ....", currentPassword);
//       console.log("newPassword ....", newPassword);
//       console.log("confirmPassword ....", confirmPassword);
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
//         setShowCurrentPassword(false);
//         setShowNewPassword(false);
//         setShowConfirmPassword(false);
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

//   if (!profileData) {
//     return <div className="px-24 p-6">No profile data found.</div>;
//   }

//   return (
//     <div className="flex-1 mx-36 border rounded-xl">
//       <div className="bg-red-500 text-white p-8 rounded-t-xl relative">
//         <div className="flex items-end gap-6">
//           {/* <div className="relative">
//             <div className="flex flex-row justify-center items-center gap-4 mb-3">
//               <Avatar className="h-24 w-24">
//                 {isImageLoading ? (
//                   <AvatarFallback className="bg-gray-100 flex items-center justify-center">
//                     <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
//                   </AvatarFallback>
//                 ) : previewUrl ? (
//                   <AvatarImage src={previewUrl} />
//                 ) : user?.profilePicture ? (
//                   <AvatarImage src={user.profilePicture} />
//                 ) : (
//                   <AvatarFallback className="bg-gray-100">
//                     <UploadIcon className="h-8 w-8 text-gray-400" />
//                   </AvatarFallback>
//                 )}
//               </Avatar>
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
//                     disabled={isImageLoading}
//                   >
//                     Save
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div> */}
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
//               {profileData.firstName} {profileData.lastName}
//             </h2>

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
//                         ? "text-white"
//                         : "text-white italic"
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
//       <div className="bg-white rounded-b-xl p-8 min-h-screen">
//         <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
//           <Tabs.List className="flex gap-8 border-b mb-8">
//             <Tabs.Trigger
//               value="profile"
//               className={`pb-4 ${
//                 activeTab === "profile" ? "border-b-2 border-black" : ""
//               }`}
//             >
//               Profile
//             </Tabs.Trigger>
//             <Tabs.Trigger
//               value="experience"
//               className={`pb-4 ${
//                 activeTab === "experience" ? "border-b-2 border-black" : ""
//               }`}
//             >
//               Experience
//             </Tabs.Trigger>
//             <Tabs.Trigger
//               value="links"
//               className={`pb-4 ${
//                 activeTab === "links" ? "border-b-2 border-black" : ""
//               }`}
//             >
//               Links
//             </Tabs.Trigger>
//           </Tabs.List>

//           <Tabs.Content value="profile">
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
//                 onEdit={() => handleEdit("firstName")}
//                 onSave={async () => await handleSave("firstName")}
//                 onCancel={() => handleCancel("firstName")}
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
//                 onEdit={() => handleEdit("lastName")}
//                 onSave={async () => await handleSave("lastName")}
//                 onCancel={() => handleCancel("lastName")}
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
//                 onEdit={() => handleEdit("phone")}
//                 onSave={async () => await handleSave("phone")}
//                 onCancel={() => handleCancel("phone")}
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
//                         className="w-full"
//                       />
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() =>
//                           setShowCurrentPassword(!showCurrentPassword)
//                         }
//                         className="absolute right-2 top-1"
//                       >
//                         {showCurrentPassword ? (
//                           <EyeOffIcon size={16} />
//                         ) : (
//                           <EyeIcon size={16} />
//                         )}
//                       </Button>
//                       {formErrors.currentPassword && (
//                         <p className="text-green-500 text-sm mt-1">
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
//                         className="w-full"
//                       />
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => setShowNewPassword(!showNewPassword)}
//                         className="absolute right-2 top-1"
//                       >
//                         {showNewPassword ? (
//                           <EyeOffIcon size={16} />
//                         ) : (
//                           <EyeIcon size={16} />
//                         )}
//                       </Button>
//                       {formErrors.newPassword && (
//                         <p className="text-green-500 text-sm mt-1">
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
//                         className="w-full"
//                       />
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() =>
//                           setShowConfirmPassword(!showConfirmPassword)
//                         }
//                         className="absolute right-2 top-1"
//                       >
//                         {showConfirmPassword ? (
//                           <EyeOffIcon size={16} />
//                         ) : (
//                           <EyeIcon size={16} />
//                         )}
//                       </Button>
//                       {formErrors.confirmPassword && (
//                         <p className="text-green-500 text-sm mt-1">
//                           {formErrors.confirmPassword}
//                         </p>
//                       )}
//                     </div>
//                     <div className="flex gap-2">
//                       <Button
//                         onClick={handlePasswordUpdate}
//                         disabled={
//                           isPasswordUpdating ||
//                           !currentPassword ||
//                           !newPassword ||
//                           !confirmPassword ||
//                           newPassword !== confirmPassword
//                         }
//                       >
//                         {isPasswordUpdating ? "Updating..." : "Save Password"}
//                       </Button>
//                       <Button
//                         variant="outline"
//                         onClick={() => handleCancel("password")}
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
//                       onClick={() => handleEdit("password")}
//                       className="text-black hover:underline"
//                     >
//                       Edit
//                     </Button>
//                   </div>
//                   <p className="text-sm text-gray-500">
//                     Change password at least every month for security.
//                   </p>
//                 </div>
//               )}
//               <EditableField
//                 label="Bio"
//                 field="bio"
//                 value={profileData.bio}
//                 isEditing={editingField === "bio"}
//                 onEdit={() => handleEdit("bio")}
//                 onSave={async () => await handleSave("bio")}
//                 onCancel={() => handleCancel("bio")}
//                 onChange={(value) =>
//                   setProfileData((prev) => ({ ...prev, bio: value }))
//                 }
//                 error={formErrors.bio}
//               >
//                 <Textarea
//                   className="w-full p-2 border rounded-md h-24"
//                   placeholder="Write something about yourself..."
//                   value={profileData.bio}
//                   onChange={(e) =>
//                     setProfileData((prev) => ({ ...prev, bio: e.target.value }))
//                   }
//                   readOnly={editingField !== "bio"}
//                 />
//               </EditableField>
//             </div>
//           </Tabs.Content>

//           <Tabs.Content value="experience">
//             <div className="max-w-2xl">
//               {Object.values(mentorData.schoolDetails).some(
//                 (value) => value && value !== "school"
//               ) && (
//                 <>
//                   <h3 className="text-lg font-medium mb-4">
//                     As a School Student
//                   </h3>
//                   <EditableField
//                     label="School Name*"
//                     field="schoolDetails.schoolName"
//                     value={mentorData.schoolDetails.schoolName}
//                     isEditing={
//                       editingMentorField === "schoolDetails.schoolName"
//                     }
//                     onEdit={() =>
//                       setEditingMentorField("schoolDetails.schoolName")
//                     }
//                     onSave={async () =>
//                       await handleMentorSave("schoolDetails", "schoolName")
//                     }
//                     onCancel={() =>
//                       handleMentorCancel("schoolDetails", "schoolName")
//                     }
//                     onChange={(value) =>
//                       handleMentorChange("schoolDetails", "schoolName", value)
//                     }
//                     error={formErrors["schoolDetails.schoolName"]}
//                   />
//                   <EditableField
//                     label="Class*"
//                     field="schoolDetails.class"
//                     value={mentorData.schoolDetails.class}
//                     isEditing={editingMentorField === "schoolDetails.class"}
//                     onEdit={() => setEditingMentorField("schoolDetails.class")}
//                     onSave={async () =>
//                       await handleMentorSave("schoolDetails", "class")
//                     }
//                     onCancel={() =>
//                       handleMentorCancel("schoolDetails", "class")
//                     }
//                     onChange={(value) =>
//                       handleMentorChange("schoolDetails", "class", value)
//                     }
//                     error={formErrors["schoolDetails.class"]}
//                   >
//                     <Select
//                       value={mentorData.schoolDetails.class}
//                       onValueChange={(value) =>
//                         handleMentorChange("schoolDetails", "class", value)
//                       }
//                       disabled={editingMentorField !== "schoolDetails.class"}
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
//                     value={mentorData.schoolDetails.city}
//                     isEditing={editingMentorField === "schoolDetails.city"}
//                     onEdit={() => setEditingMentor("schoolDetails.city")}
//                     onSave={async () =>
//                       await handleMentorSave("schoolDetails", "city")
//                     }
//                     onCancel={() => handleMentorCancel("schoolDetails", "city")}
//                     onChange={(value) =>
//                       handleMentorChange("schoolDetails", "city", value)
//                     }
//                     error={formErrors["schoolDetails.city"]}
//                   />
//                   <EditableField
//                     label="Start Year*"
//                     field="schoolDetails.startDate"
//                     value={mentorData.schoolDetails.startDate}
//                     isEditing={editingMentorField === "schoolDetails.startDate"}
//                     onEdit={() =>
//                       setEditingMentorField("schoolDetails.startDate")
//                     }
//                     onSave={async () =>
//                       await handleMentorSave("schoolDetails", "startDate")
//                     }
//                     onCancel={() =>
//                       handleMentorCancel("schoolDetails", "startDate")
//                     }
//                     onChange={(value) =>
//                       handleMentorChange("schoolDetails", "startDate", value)
//                     }
//                     error={formErrors["schoolDetails.startDate"]}
//                   >
//                     <Select
//                       value={mentorData.schoolDetails.startDate}
//                       onValueChange={(value) =>
//                         handleMentorChange("schoolDetails", "startDate", value)
//                       }
//                       disabled={
//                         editingMentorField !== "schoolDetails.startDate"
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
//                     field="schoolDetails.endDate"
//                     value={mentorData.schoolDetails.endDate}
//                     isEditing={editingMentorField === "schoolDetails.endDate"}
//                     onEdit={() =>
//                       setEditingMentorField("schoolDetails.endDate")
//                     }
//                     onSave={async () =>
//                       await handleMentorSave("schoolDetails", "endDate")
//                     }
//                     onCancel={() =>
//                       handleMentorCancel("schoolDetails", "endDate")
//                     }
//                     onChange={(value) =>
//                       handleMentorChange("schoolDetails", "endDate", value)
//                     }
//                     error={formErrors["schoolDetails.endDate"]}
//                   >
//                     <Select
//                       value={mentorData.schoolDetails.endDate}
//                       onValueChange={(value) =>
//                         handleMentorChange("schoolDetails", "endDate", value)
//                       }
//                       disabled={editingMentorField !== "schoolDetails.endDate"}
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
//               {Object.values(mentorData.collegeDetails).some(
//                 (value) => value && value !== "college" && value !== "fresher"
//               ) && (
//                 <>
//                   <h3 className="text-lg font-medium mb-4">
//                     {mentorData.collegeDetails.userType === "college"
//                       ? "As a College Student"
//                       : "As a Fresher"}
//                   </h3>
//                   <EditableField
//                     label="College Name*"
//                     field="collegeDetails.collegeName"
//                     value={mentorData.collegeDetails.collegeName}
//                     isEditing={
//                       editingMentorField === "collegeDetails.collegeName"
//                     }
//                     onEdit={() =>
//                       setEditingMentorField("collegeDetails.collegeName")
//                     }
//                     onSave={async () =>
//                       await handleMentorSave("collegeDetails", "collegeName")
//                     }
//                     onCancel={() =>
//                       handleMentorCancel("collegeDetails", "collegeName")
//                     }
//                     onChange={(value) =>
//                       handleMentorChange("collegeDetails", "collegeName", value)
//                     }
//                     error={formErrors["collegeDetails.collegeName"]}
//                   />
//                   <EditableField
//                     label="Course*"
//                     field="collegeDetails.course"
//                     value={mentorData.collegeDetails.course}
//                     isEditing={editingMentorField === "collegeDetails.course"}
//                     onEdit={() =>
//                       setEditingMentorField("collegeDetails.course")
//                     }
//                     onSave={async () =>
//                       await handleMentorSave("collegeDetails", "course")
//                     }
//                     onCancel={() =>
//                       handleMentorCancel("collegeDetails", "course")
//                     }
//                     onChange={(value) =>
//                       handleMentorChange("collegeDetails", "course", value)
//                     }
//                     error={formErrors["collegeDetails.course"]}
//                   >
//                     <Select
//                       value={mentorData.collegeDetails.course}
//                       onValueChange={(value) =>
//                         handleMentorChange("collegeDetails", "course", value)
//                       }
//                       disabled={editingMentorField !== "collegeDetails.course"}
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
//                     value={mentorData.collegeDetails.specializedIn}
//                     isEditing={
//                       editingMentorField === "collegeDetails.specializedIn"
//                     }
//                     onEdit={() =>
//                       setEditingMentorField("collegeDetails.specializedIn")
//                     }
//                     onSave={async () =>
//                       await handleMentorSave("collegeDetails", "specializedIn")
//                     }
//                     onCancel={() =>
//                       handleMentorCancel("collegeDetails", "specializedIn")
//                     }
//                     onChange={(value) =>
//                       handleMentorChange(
//                         "collegeDetails",
//                         "specializedIn",
//                         value
//                       )
//                     }
//                     error={formErrors["collegeDetails.specializedIn"]}
//                   >
//                     <Select
//                       value={mentorData.collegeDetails.specializedIn}
//                       onValueChange={(value) =>
//                         handleMentorChange(
//                           "collegeDetails",
//                           "specializedIn",
//                           value
//                         )
//                       }
//                       disabled={
//                         editingMentorField !== "collegeDetails.specializedIn"
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
//                     value={mentorData.collegeDetails.city}
//                     isEditing={editingMentorField === "collegeDetails.city"}
//                     onEdit={() => setEditingMentorField("collegeDetails.city")}
//                     onSave={async () =>
//                       await handleMentorSave("collegeDetails", "city")
//                     }
//                     onCancel={() =>
//                       handleMentorCancel("collegeDetails", "city")
//                     }
//                     onChange={(value) =>
//                       handleMentorChange("collegeDetails", "city", value)
//                     }
//                     error={formErrors["collegeDetails.city"]}
//                   />
//                   <EditableField
//                     label="Start Year*"
//                     field="collegeDetails.startDate"
//                     value={mentorData.collegeDetails.startDate}
//                     isEditing={
//                       editingMentorField === "collegeDetails.startDate"
//                     }
//                     onEdit={() =>
//                       setEditingMentorField("collegeDetails.startDate")
//                     }
//                     onSave={async () =>
//                       await handleMentorSave("collegeDetails", "startDate")
//                     }
//                     onCancel={() =>
//                       handleMentorCancel("collegeDetails", "startDate")
//                     }
//                     onChange={(value) =>
//                       handleMentorChange("collegeDetails", "startDate", value)
//                     }
//                     error={formErrors["collegeDetails.startDate"]}
//                   >
//                     <Select
//                       value={mentorData.collegeDetails.startDate}
//                       onValueChange={(value) =>
//                         handleMentorChange("collegeDetails", "startDate", value)
//                       }
//                       disabled={
//                         editingMentorField !== "collegeDetails.startDate"
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
//                     value={mentorData.collegeDetails.endDate}
//                     isEditing={editingMentorField === "collegeDetails.endDate"}
//                     onEdit={() =>
//                       setEditingMentorField("collegeDetails.endDate")
//                     }
//                     onSave={async () =>
//                       await handleMentorSave("collegeDetails", "endDate")
//                     }
//                     onCancel={() =>
//                       handleMentorCancel("collegeDetails", "endDate")
//                     }
//                     onChange={(value) =>
//                       handleMentorChange("collegeDetails", "endDate", value)
//                     }
//                     error={formErrors["collegeDetails.endDate"]}
//                   >
//                     <Select
//                       value={mentorData.collegeDetails.endDate}
//                       onValueChange={(value) =>
//                         handleMentorChange("collegeDetails", "endDate", value)
//                       }
//                       disabled={editingMentorField !== "collegeDetails.endDate"}
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
//               {Object.values(mentorData.professionalDetails).some(
//                 (value) => value && value !== "professional" && value !== false
//               ) && (
//                 <>
//                   <h3 className="text-lg font-medium mb-4">
//                     As a Professional
//                   </h3>
//                   <EditableField
//                     label="Job Role*"
//                     field="professionalDetails.jobRole"
//                     value={mentorData.professionalDetails.jobRole}
//                     isEditing={
//                       editingMentorField === "professionalDetails.jobRole"
//                     }
//                     onEdit={() =>
//                       setEditingMentorField("professionalDetails.jobRole")
//                     }
//                     onSave={async () =>
//                       await handleMentorSave("professionalDetails", "jobRole")
//                     }
//                     onCancel={() =>
//                       handleMentorCancel("professionalDetails", "jobRole")
//                     }
//                     onChange={(value) =>
//                       handleMentorChange(
//                         "professionalDetails",
//                         "jobRole",
//                         value
//                       )
//                     }
//                     error={formErrors["professionalDetails.jobRole"]}
//                   >
//                     <Select
//                       value={mentorData.professionalDetails.jobRole}
//                       onValueChange={(value) =>
//                         handleMentorChange(
//                           "professionalDetails",
//                           "jobRole",
//                           value
//                         )
//                       }
//                       disabled={
//                         editingMentorField !== "professionalDetails.jobRole"
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
//                     value={mentorData.professionalDetails.company}
//                     isEditing={
//                       editingMentorField === "professionalDetails.company"
//                     }
//                     onEdit={() =>
//                       setEditingMentorField("professionalDetails.company")
//                     }
//                     onSave={async () =>
//                       await handleMentorSave("professionalDetails", "company")
//                     }
//                     onCancel={() =>
//                       handleMentorCancel("professionalDetails", "company")
//                     }
//                     onChange={(value) =>
//                       handleMentorChange(
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
//                     value={mentorData.professionalDetails.experience}
//                     isEditing={
//                       editingMentorField === "professionalDetails.experience"
//                     }
//                     onEdit={() =>
//                       setEditingMentorField("professionalDetails.experience")
//                     }
//                     onSave={async () =>
//                       await handleMentorSave(
//                         "professionalDetails",
//                         "experience"
//                       )
//                     }
//                     onCancel={() =>
//                       handleMentorCancel("professionalDetails", "experience")
//                     }
//                     onChange={(value) =>
//                       handleMentorChange(
//                         "professionalDetails",
//                         "experience",
//                         value
//                       )
//                     }
//                     error={formErrors["professionalDetails.experience"]}
//                   >
//                     <Select
//                       value={mentorData.professionalDetails.experience}
//                       onValueChange={(value) =>
//                         handleMentorChange(
//                           "professionalDetails",
//                           "experience",
//                           value
//                         )
//                       }
//                       disabled={
//                         editingMentorField !== "professionalDetails.experience"
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
//                     value={mentorData.professionalDetails.city}
//                     isEditing={
//                       editingMentorField === "professionalDetails.city"
//                     }
//                     onEdit={() =>
//                       setEditingMentorField("professionalDetails.city")
//                     }
//                     onSave={async () =>
//                       await handleMentorSave("professionalDetails", "city")
//                     }
//                     onCancel={() =>
//                       handleMentorCancel("professionalDetails", "city")
//                     }
//                     onChange={(value) =>
//                       handleMentorChange("professionalDetails", "city", value)
//                     }
//                     error={formErrors["professionalDetails.city"]}
//                   />
//                   <EditableField
//                     label="Start Year*"
//                     field="professionalDetails.startDate"
//                     value={mentorData.professionalDetails.startDate}
//                     isEditing={
//                       editingMentorField === "professionalDetails.startDate"
//                     }
//                     onEdit={() =>
//                       setEditingMentorField("professionalDetails.startDate")
//                     }
//                     onSave={async () =>
//                       await handleMentorSave("professionalDetails", "startDate")
//                     }
//                     onCancel={() =>
//                       handleMentorCancel("professionalDetails", "startDate")
//                     }
//                     onChange={(value) =>
//                       handleMentorChange(
//                         "professionalDetails",
//                         "startDate",
//                         value
//                       )
//                     }
//                     error={formErrors["professionalDetails.startDate"]}
//                   >
//                     <Select
//                       value={mentorData.professionalDetails.startDate}
//                       onValueChange={(value) =>
//                         handleMentorChange(
//                           "professionalDetails",
//                           "startDate",
//                           value
//                         )
//                       }
//                       disabled={
//                         editingMentorField !== "professionalDetails.startDate"
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
//                     value={mentorData.professionalDetails.currentlyWorking}
//                     isEditing={
//                       editingMentorField ===
//                       "professionalDetails.currentlyWorking"
//                     }
//                     onEdit={() =>
//                       setEditingMentorField(
//                         "professionalDetails.currentlyWorking"
//                       )
//                     }
//                     onSave={async () =>
//                       await handleMentorSave(
//                         "professionalDetails",
//                         "currentlyWorking"
//                       )
//                     }
//                     onCancel={() =>
//                       handleMentorCancel(
//                         "professionalDetails",
//                         "currentlyWorking"
//                       )
//                     }
//                     onChange={(value) =>
//                       handleMentorChange(
//                         "professionalDetails",
//                         "currentlyWorking",
//                         value
//                       )
//                     }
//                     error={formErrors["professionalDetails.currentlyWorking"]}
//                   >
//                     <div className="flex items-center space-x-2">
//                       <Checkbox
//                         id="currentlyWorking"
//                         checked={
//                           mentorData.professionalDetails.currentlyWorking
//                         }
//                         onCheckedChange={(checked) =>
//                           handleMentorChange(
//                             "professionalDetails",
//                             "currentlyWorking",
//                             !!checked
//                           )
//                         }
//                         disabled={
//                           editingMentorField !==
//                           "professionalDetails.currentlyWorking"
//                         }
//                       />
//                       <Label htmlFor="currentlyWorking">
//                         Currently Working
//                       </Label>
//                     </div>
//                   </EditableField>
//                   <EditableField
//                     label="End Year"
//                     field="professionalDetails.endDate"
//                     value={mentorData.professionalDetails.endDate}
//                     isEditing={
//                       editingMentorField === "professionalDetails.endDate"
//                     }
//                     onEdit={() =>
//                       setEditingMentorField("professionalDetails.endDate")
//                     }
//                     onSave={async () =>
//                       await handleMentorSave("professionalDetails", "endDate")
//                     }
//                     onCancel={() =>
//                       handleMentorCancel("professionalDetails", "endDate")
//                     }
//                     onChange={(value) =>
//                       handleMentorChange(
//                         "professionalDetails",
//                         "endDate",
//                         value
//                       )
//                     }
//                     error={formErrors["professionalDetails.endDate"]}
//                   >
//                     <Select
//                       value={mentorData.professionalDetails.endDate}
//                       onValueChange={(value) =>
//                         handleMentorChange(
//                           "professionalDetails",
//                           "endDate",
//                           value
//                         )
//                       }
//                       disabled={
//                         editingMentorField !== "professionalDetails.endDate" ||
//                         mentorData.professionalDetails.currentlyWorking
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
//                 </>
//               )}
//             </div>
//           </Tabs.Content>

//           <Tabs.Content value="links">
//             <div className="max-w-2xl">
//               <EditableField
//                 label="Achievements"
//                 field="achievements"
//                 value={profileData.achievements}
//                 isEditing={editingField === "achievements"}
//                 onEdit={() => handleEdit("achievements")}
//                 onSave={async () => await handleSave("achievements")}
//                 onCancel={() => handleCancel("achievements")}
//                 onChange={(value) =>
//                   setProfileData((prev) => ({
//                     ...prev,
//                     achievements: value,
//                   }))
//                 }
//                 error={formErrors.achievements}
//               />
//               <EditableField
//                 label="LinkedIn URL"
//                 field="linkedinURL"
//                 value={profileData.linkedinURL}
//                 isEditing={editingField === "linkedinURL"}
//                 onEdit={() => handleEdit("linkedinURL")}
//                 onSave={async () => await handleSave("linkedinURL")}
//                 onCancel={() => handleCancel("linkedinURL")}
//                 onChange={(value) =>
//                   setProfileData((prev) => ({ ...prev, linkedinURL: value }))
//                 }
//                 error={formErrors.linkedinURL}
//               />
//               <EditableField
//                 label="Portfolio URL"
//                 field="portfolioURL"
//                 value={profileData.portfolioURL}
//                 isEditing={editingField === "portfolioURL"}
//                 onEdit={() => handleEdit("portfolioURL")}
//                 onSave={async () => await handleSave("portfolioURL")}
//                 onCancel={() => handleCancel("portfolioURL")}
//                 onChange={(value) =>
//                   setProfileData((prev) => ({ ...prev, portfolioURL: value }))
//                 }
//                 error={formErrors.portfolioURL}
//               />

//               <EditableField
//                 label="Featured Article"
//                 field="featuredArticle"
//                 value={profileData.featuredArticle}
//                 isEditing={editingField === "featuredArticle"}
//                 onEdit={() => handleEdit("featuredArticle")}
//                 onSave={async () => await handleSave("featuredArticle")}
//                 onCancel={() => handleCancel("featuredArticle")}
//                 onChange={(value) =>
//                   setProfileData((prev) => ({
//                     ...prev,
//                     featuredArticle: value,
//                   }))
//                 }
//                 error={formErrors.featuredArticle}
//               />
//             </div>
//           </Tabs.Content>
//         </Tabs.Root>
//       </div>
//     </div>
//   );
// };

// export default MentorProfile;
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
  Link2,
  Trophy,
  Star,
  Save,
  X,
  Camera,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import { setUser, setLoading } from "@/redux/slices/userSlice";
import { updateUserProfile, updateUserPassword } from "@/services/userServices";
import { uploadProfileImage } from "@/services/uploadService";
import { getUserDetails } from "@/services/mentorService";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import * as Yup from "yup";
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

// Validation Schemas (keeping your existing ones)
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
  shortInfo: Yup.string().optional(),
  achievements: Yup.string()
    .required("achievements is required")
    .min(2, "Too short"),
  linkedinURL: Yup.string().url("Invalid URL").nullable().optional(),
  portfolioURL: Yup.string().url("Invalid URL").nullable().optional(),
  interestedNewCareer: Yup.array()
    .of(Yup.string())
    .optional()
    .transform((value) =>
      typeof value === "string"
        ? value
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean)
        : value
    ),
  featuredArticle: Yup.string().optional(),
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
  endDate: Yup.string().when("currentlyWorking", {
    is: false,
    then: (schema) => schema.required("End year is required"),
    otherwise: (schema) => schema.optional(),
  }),
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
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1 rounded-lg text-xs font-medium"
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
                ? "bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
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

type MenteeDataType = {
  schoolDetails: {
    schoolName: string;
    class: string;
    city: string;
    startDate: string;
    endDate: string;
    userType: string;
  };
  collegeDetails: {
    collegeName: string;
    course: string;
    specializedIn: string;
    city: string;
    startDate: string;
    endDate: string;
    userType: string;
  };
  professionalDetails: {
    jobRole: string;
    company: string;
    experience: string;
    city: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    userType: string;
  };
};

const initialMenteeData: MenteeDataType = {
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

const MentorProfile: React.FC = () => {
  const dispatch = useDispatch();
  const { user, error, loading } = useSelector(
    (state: RootState) => state.user
  );
  const [activeTab, setActiveTab] = useState("profile");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
    [key: string]: any;
  }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    bio: "",
    skills: [] as string[],
    shortInfo: "",
    profilePicture: "",
    achievements: "",
    linkedinURL: "",
    portfolioURL: "",
    interestedNewCareer: [] as string[],
    featuredArticle: "",
  });
  const [mentorData, setMentorData] = useState(initialMenteeData);
  const [originalMentorData, setOriginalMentorData] =
    useState(initialMenteeData);
  const [editingMentorField, setEditingMentorField] = useState<string | null>(
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

  // Year options for dropdowns
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 21 }, (_, i) =>
    (currentYear - 20 + i).toString()
  );

  // Your existing useEffect and handler functions remain the same...
  // (I'm keeping them as they are since they handle your backend logic)

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user && user._id) {
        dispatch(setLoading(true));
        try {
          const userDetails = await getUserDetails(user._id);
          console.log("FETCHED ||||||||||| ....>?,", userDetails);

          const data = userDetails.data;
          setProfileData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            phone: data.phone ? String(data.phone) : "",
            email: data.email || "",
            bio: data.mentorId?.bio || "",
            skills: data.skills || [],
            shortInfo: data.shortInfo || "",
            profilePicture: data.profilePicture || "",
            achievements: data.mentorId?.achievements || "",
            linkedinURL: data.mentorId?.linkedinURL || "",
            portfolioURL: data.mentorId?.portfolio || "",
            interestedNewCareer: data.mentorId?.interestedNewCareer || [],
            featuredArticle: data.mentorId?.featuredArticle || "",
          });
          setMentorData({
            schoolDetails: {
              schoolName: data.schoolDetails?.schoolName || "",
              class: data.schoolDetails?.class?.toString() || "",
              city: data.schoolDetails?.city || "",
              startDate: data.schoolDetails?.startDate?.slice(0, 4) || "",
              endDate: data.schoolDetails?.endDate?.slice(0, 4) || "",
              userType: data.schoolDetails?.userType || "school",
            },
            collegeDetails: {
              collegeName: data.collegeDetails?.collegeName || "",
              course: data.collegeDetails?.course || "",
              specializedIn: data.collegeDetails?.specializedIn || "",
              city: data.collegeDetails?.city || "",
              startDate: data.collegeDetails?.startDate?.slice(0, 4) || "",
              endDate: data.collegeDetails?.endDate?.slice(0, 4) || "",
              userType: data.collegeDetails?.userType || "college",
            },
            professionalDetails: {
              jobRole: data.professionalDetails?.jobRole || "",
              company: data.professionalDetails?.company || "",
              experience: data.professionalDetails?.experience || "",
              city: data.professionalDetails?.city || "",
              startDate: data.professionalDetails?.startDate?.slice(0, 4) || "",
              endDate: data.professionalDetails?.endDate?.slice(0, 4) || "",
              currentlyWorking:
                data.professionalDetails?.currentlyWorking || false,
              userType: data.professionalDetails?.userType || "professional",
            },
          });
          setOriginalMentorData({
            schoolDetails: {
              schoolName: data.schoolDetails?.schoolName || "",
              class: data.schoolDetails?.class?.toString() || "",
              city: data.schoolDetails?.city || "",
              startDate: data.schoolDetails?.startDate?.slice(0, 4) || "",
              endDate: data.schoolDetails?.endDate?.slice(0, 4) || "",
              userType: data.schoolDetails?.userType || "school",
            },
            collegeDetails: {
              collegeName: data.collegeDetails?.collegeName || "",
              course: data.collegeDetails?.course || "",
              specializedIn: data.collegeDetails?.specializedIn || "",
              city: data.collegeDetails?.city || "",
              startDate: data.collegeDetails?.startDate?.slice(0, 4) || "",
              endDate: data.collegeDetails?.endDate?.slice(0, 4) || "",
              userType: data.collegeDetails?.userType || "college",
            },
            professionalDetails: {
              jobRole: data.professionalDetails?.jobRole || "",
              company: data.professionalDetails?.company || "",
              experience: data.professionalDetails?.experience || "",
              city: data.professionalDetails?.city || "",
              startDate: data.professionalDetails?.startDate?.slice(0, 4) || "",
              endDate: data.professionalDetails?.endDate?.slice(0, 4) || "",
              currentlyWorking:
                data.professionalDetails?.currentlyWorking || false,
              userType: data.professionalDetails?.userType || "professional",
            },
          });
          setPreviewUrl(data.profilePicture || null);
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
  }, [dispatch]);

  // Password validation
  useEffect(() => {
    const validate = async () => {
      try {
        await passwordSchema.validate(
          { currentPassword, newPassword, confirmPassword },
          { abortEarly: false }
        );
        setFormErrors((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } catch (validationErrors: any) {
        const errorObj: Record<string, string> = {};
        validationErrors.inner.forEach((err: any) => {
          errorObj[err.path] = err.message;
        });
        setFormErrors((prev) => ({ ...prev, ...errorObj }));
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

  const handleImageSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("No image selected to upload");
      return;
    }
    dispatch(setLoading(true));
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      const response = await uploadProfileImage(formData);
      const newProfilePictureUrl = response?.profilePicture;
      if (newProfilePictureUrl) {
        setPreviewUrl(newProfilePictureUrl);
        setProfileData((prev) => ({
          ...prev,
          profilePicture: newProfilePictureUrl,
        }));
        dispatch(setUser({ ...user, profilePicture: newProfilePictureUrl }));
      }
      toast.success("Profile image uploaded successfully");
      setSelectedFile(null);
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateProfileField = async (field: string, value: any) => {
    try {
      let validationValue = value;

      await profileSchema.validateAt(field, { [field]: validationValue });
      const payload = { [field]: value };
      const updatedUser = await updateUserProfile(payload);
      dispatch(setUser(updatedUser));
      setProfileData((prev) => ({ ...prev, [field]: value }));
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
      toast.success(`${field} updated successfully`);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setFormErrors({ [field]: error.message });
        toast.error(error.message);
      } else {
        toast.error(`Failed to update ${field}`);
        console.error(error);
      }
      throw error;
    }
  };

  const handleMentorChange = (
    section: "schoolDetails" | "collegeDetails" | "professionalDetails",
    field: string,
    value: any
  ) => {
    setMentorData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setFormErrors((prev) => ({ ...prev, [`${section}.${field}`]: "" }));
  };

  const validateMentorField = async (
    section: "schoolDetails" | "collegeDetails" | "professionalDetails",
    field: string,
    value: any
  ) => {
    try {
      const sectionData = mentorData[section];
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

  const handleMentorSave = async (
    section: "schoolDetails" | "collegeDetails" | "professionalDetails",
    field: string
  ) => {
    try {
      const value = mentorData[section][field];
      const validation = await validateMentorField(section, field, value);
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
      setMentorData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
      setOriginalMentorData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
      setEditingMentorField(null);
      setFormErrors((prev) => ({ ...prev, [`${section}.${field}`]: "" }));
      toast.success(`${field} updated successfully`);
    } catch (error) {
      toast.error(`Failed to update ${field}`);
      console.error(error);
    }
  };

  const handleMentorCancel = (
    section: "schoolDetails" | "collegeDetails" | "professionalDetails",
    field: string
  ) => {
    setMentorData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: originalMentorData[section][field],
      },
    }));
    setFormErrors({});
    setEditingMentorField(null);
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

  const handleSave = async (field: string, value?: any) => {
    try {
      await updateProfileField(
        field,
        value !== undefined
          ? value
          : profileData[field as keyof typeof profileData]
      );
      setEditingField(null);
    } catch (error) {
      console.error(`Error saving ${field}:`, error);
    }
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
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
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

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="pl-28 min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative px-16 overflow-hidden rounded-xl mx-6 mt-8">
        <div className="absolute  inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.3,
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-end gap-16">
            {/* Profile Image */}
            <div className="relative group">
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
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                {/* <p className="text-blue-100 text-lg font-medium">
                  Mentor Profile
                </p> */}
              </div>

              {/* Skills Section */}
              <div className="mt-6 ">
                {editingField === "skills" ? (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profileData.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          className="bg-white/20  text-white border-white/30 hover:bg-white/30 transition-all duration-200 px-3 py-1 rounded-full"
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
                          <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-auto ">
                            {filteredSkills.map((skill, index) => (
                              <div
                                key={index}
                                className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-gray-800 transition-colors duration-200"
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
                      <h3 className="text-sm font-semibold text-blue-100 mb-2">
                        Skills & Expertise
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
                            Add your skills to showcase your expertise
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
      <div className="max-w-7xl mx-auto px-6 mt-0 relative ">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
            <Tabs.List className="flex border-b border-gray-100 bg-gray-50/50">
              <Tabs.Trigger
                value="profile"
                className={`flex items-center gap-2 px-8 py-4 text-sm font-semibold transition-all duration-200 ${
                  activeTab === "profile"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                }`}
              >
                <Star className="w-4 h-4" />
                Personal Profile
              </Tabs.Trigger>
              <Tabs.Trigger
                value="experience"
                className={`flex items-center gap-2 px-8 py-4 text-sm font-semibold transition-all duration-200 ${
                  activeTab === "experience"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Experience & Education
              </Tabs.Trigger>
              <Tabs.Trigger
                value="links"
                className={`flex items-center gap-2 px-8 py-4 text-sm font-semibold transition-all duration-200 ${
                  activeTab === "links"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                }`}
              >
                <Link2 className="w-4 h-4" />
                Links & Achievements
              </Tabs.Trigger>
            </Tabs.List>

            {/* Profile Tab */}
            <Tabs.Content value="profile" className="p-8">
              <div className="max-w-5xl p-8 ">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold border-blue-600  text-gray-800 mb-2">
                    Personal Information
                  </h2>
                  <p className="text-gray-600">
                    Manage your basic profile information and credentials
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
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
                    onEdit={() => handleEdit("firstName")}
                    onSave={async () => await handleSave("firstName")}
                    onCancel={() => handleCancel("firstName")}
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
                    onEdit={() => handleEdit("lastName")}
                    onSave={async () => await handleSave("lastName")}
                    onCancel={() => handleCancel("lastName")}
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
                    onEdit={() => handleEdit("phone")}
                    onSave={async () => await handleSave("phone")}
                    onCancel={() => handleCancel("phone")}
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
                            className="pr-10"
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
                            className="pr-10"
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
                            className="pr-10"
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
                          disabled={
                            isPasswordUpdating ||
                            !currentPassword ||
                            !newPassword ||
                            !confirmPassword ||
                            newPassword !== confirmPassword
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6"
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
                          onClick={() => handleCancel("password")}
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
                          onClick={() => handleEdit("password")}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl"
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Change Password
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <EditableField
                      label="Professional Bio"
                      field="bio"
                      value={profileData.bio}
                      isEditing={editingField === "bio"}
                      onEdit={() => handleEdit("bio")}
                      onSave={async () => await handleSave("bio")}
                      onCancel={() => handleCancel("bio")}
                      onChange={(value) =>
                        setProfileData((prev) => ({ ...prev, bio: value }))
                      }
                      error={formErrors.bio}
                      placeholder="Tell others about yourself, your experience, and what makes you a great mentor..."
                    >
                      <Textarea
                        className={`w-full h-32 transition-all duration-200 ${
                          editingField === "bio"
                            ? "bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                            : "bg-transparent border-transparent resize-none text-gray-800"
                        }`}
                        placeholder="Tell others about yourself, your experience, and what makes you a great mentor..."
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
                </div>
              </div>
            </Tabs.Content>

            {/* Experience Tab */}
            <Tabs.Content value="experience" className="p-8">
              <div className="max-w-5xl p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Experience & Education
                  </h2>
                  <p className="text-gray-600">
                    Share your educational background and professional journey
                  </p>
                </div>

                <div className="space-y-8">
                  {/* School Details */}
                  {Object.values(mentorData.schoolDetails).some(
                    (value) => value && value !== "school"
                  ) && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-green-100 rounded-xl">
                          <School className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-green-800">
                            School Education
                          </h3>
                          <p className="text-green-600 text-sm">
                            Your academic foundation
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <EditableField
                          label="School Name"
                          field="schoolDetails.schoolName"
                          value={mentorData.schoolDetails.schoolName}
                          isEditing={
                            editingMentorField === "schoolDetails.schoolName"
                          }
                          onEdit={() =>
                            setEditingMentorField("schoolDetails.schoolName")
                          }
                          onSave={async () =>
                            await handleMentorSave(
                              "schoolDetails",
                              "schoolName"
                            )
                          }
                          onCancel={() =>
                            handleMentorCancel("schoolDetails", "schoolName")
                          }
                          onChange={(value) =>
                            handleMentorChange(
                              "schoolDetails",
                              "schoolName",
                              value
                            )
                          }
                          error={formErrors["schoolDetails.schoolName"]}
                          placeholder="Enter school name"
                        />

                        <EditableField
                          label="Class"
                          field="schoolDetails.class"
                          value={mentorData.schoolDetails.class}
                          isEditing={
                            editingMentorField === "schoolDetails.class"
                          }
                          onEdit={() =>
                            setEditingMentorField("schoolDetails.class")
                          }
                          onSave={async () =>
                            await handleMentorSave("schoolDetails", "class")
                          }
                          onCancel={() =>
                            handleMentorCancel("schoolDetails", "class")
                          }
                          onChange={(value) =>
                            handleMentorChange("schoolDetails", "class", value)
                          }
                          error={formErrors["schoolDetails.class"]}
                        >
                          <Select
                            value={mentorData.schoolDetails.class}
                            onValueChange={(value) =>
                              handleMentorChange(
                                "schoolDetails",
                                "class",
                                value
                              )
                            }
                            disabled={
                              editingMentorField !== "schoolDetails.class"
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
                          value={mentorData.schoolDetails.city}
                          isEditing={
                            editingMentorField === "schoolDetails.city"
                          }
                          onEdit={() =>
                            setEditingMentorField("schoolDetails.city")
                          }
                          onSave={async () =>
                            await handleMentorSave("schoolDetails", "city")
                          }
                          onCancel={() =>
                            handleMentorCancel("schoolDetails", "city")
                          }
                          onChange={(value) =>
                            handleMentorChange("schoolDetails", "city", value)
                          }
                          error={formErrors["schoolDetails.city"]}
                          icon={<MapPin className="w-4 h-4" />}
                          placeholder="Enter city"
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <EditableField
                            label="Start Year"
                            field="schoolDetails.startDate"
                            value={mentorData.schoolDetails.startDate}
                            isEditing={
                              editingMentorField === "schoolDetails.startDate"
                            }
                            onEdit={() =>
                              setEditingMentorField("schoolDetails.startDate")
                            }
                            onSave={async () =>
                              await handleMentorSave(
                                "schoolDetails",
                                "startDate"
                              )
                            }
                            onCancel={() =>
                              handleMentorCancel("schoolDetails", "startDate")
                            }
                            onChange={(value) =>
                              handleMentorChange(
                                "schoolDetails",
                                "startDate",
                                value
                              )
                            }
                            error={formErrors["schoolDetails.startDate"]}
                            icon={<Calendar className="w-4 h-4" />}
                          >
                            <Select
                              value={mentorData.schoolDetails.startDate}
                              onValueChange={(value) =>
                                handleMentorChange(
                                  "schoolDetails",
                                  "startDate",
                                  value
                                )
                              }
                              disabled={
                                editingMentorField !== "schoolDetails.startDate"
                              }
                            >
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Start Year" />
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
                            field="schoolDetails.endDate"
                            value={mentorData.schoolDetails.endDate}
                            isEditing={
                              editingMentorField === "schoolDetails.endDate"
                            }
                            onEdit={() =>
                              setEditingMentorField("schoolDetails.endDate")
                            }
                            onSave={async () =>
                              await handleMentorSave("schoolDetails", "endDate")
                            }
                            onCancel={() =>
                              handleMentorCancel("schoolDetails", "endDate")
                            }
                            onChange={(value) =>
                              handleMentorChange(
                                "schoolDetails",
                                "endDate",
                                value
                              )
                            }
                            error={formErrors["schoolDetails.endDate"]}
                            icon={<Calendar className="w-4 h-4" />}
                          >
                            <Select
                              value={mentorData.schoolDetails.endDate}
                              onValueChange={(value) =>
                                handleMentorChange(
                                  "schoolDetails",
                                  "endDate",
                                  value
                                )
                              }
                              disabled={
                                editingMentorField !== "schoolDetails.endDate"
                              }
                            >
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="End Year" />
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

                  {/* College Details */}
                  {Object.values(mentorData.collegeDetails).some(
                    (value) =>
                      value && value !== "college" && value !== "fresher"
                  ) && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-100 rounded-xl">
                          <GraduationCap className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-blue-800">
                            {mentorData.collegeDetails.userType === "college"
                              ? "College Education"
                              : "Fresh Graduate"}
                          </h3>
                          <p className="text-blue-600 text-sm">
                            Higher education and specialization
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <EditableField
                          label="College/University Name"
                          field="collegeDetails.collegeName"
                          value={mentorData.collegeDetails.collegeName}
                          isEditing={
                            editingMentorField === "collegeDetails.collegeName"
                          }
                          onEdit={() =>
                            setEditingMentorField("collegeDetails.collegeName")
                          }
                          onSave={async () =>
                            await handleMentorSave(
                              "collegeDetails",
                              "collegeName"
                            )
                          }
                          onCancel={() =>
                            handleMentorCancel("collegeDetails", "collegeName")
                          }
                          onChange={(value) =>
                            handleMentorChange(
                              "collegeDetails",
                              "collegeName",
                              value
                            )
                          }
                          error={formErrors["collegeDetails.collegeName"]}
                          placeholder="Enter college name"
                        />

                        <EditableField
                          label="Course"
                          field="collegeDetails.course"
                          value={mentorData.collegeDetails.course}
                          isEditing={
                            editingMentorField === "collegeDetails.course"
                          }
                          onEdit={() =>
                            setEditingMentorField("collegeDetails.course")
                          }
                          onSave={async () =>
                            await handleMentorSave("collegeDetails", "course")
                          }
                          onCancel={() =>
                            handleMentorCancel("collegeDetails", "course")
                          }
                          onChange={(value) =>
                            handleMentorChange(
                              "collegeDetails",
                              "course",
                              value
                            )
                          }
                          error={formErrors["collegeDetails.course"]}
                        >
                          <Select
                            value={mentorData.collegeDetails.course}
                            onValueChange={(value) =>
                              handleMentorChange(
                                "collegeDetails",
                                "course",
                                value
                              )
                            }
                            disabled={
                              editingMentorField !== "collegeDetails.course"
                            }
                          >
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select Course" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="btech">
                                Bachelor of Technology (B.Tech)
                              </SelectItem>
                              <SelectItem value="bsc">
                                Bachelor of Science (B.Sc)
                              </SelectItem>
                              <SelectItem value="bca">
                                Bachelor of Computer Applications (BCA)
                              </SelectItem>
                              <SelectItem value="mca">
                                Master of Computer Applications (MCA)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </EditableField>

                        <EditableField
                          label="Specialization"
                          field="collegeDetails.specializedIn"
                          value={mentorData.collegeDetails.specializedIn}
                          isEditing={
                            editingMentorField ===
                            "collegeDetails.specializedIn"
                          }
                          onEdit={() =>
                            setEditingMentorField(
                              "collegeDetails.specializedIn"
                            )
                          }
                          onSave={async () =>
                            await handleMentorSave(
                              "collegeDetails",
                              "specializedIn"
                            )
                          }
                          onCancel={() =>
                            handleMentorCancel(
                              "collegeDetails",
                              "specializedIn"
                            )
                          }
                          onChange={(value) =>
                            handleMentorChange(
                              "collegeDetails",
                              "specializedIn",
                              value
                            )
                          }
                          error={formErrors["collegeDetails.specializedIn"]}
                        >
                          <Select
                            value={mentorData.collegeDetails.specializedIn}
                            onValueChange={(value) =>
                              handleMentorChange(
                                "collegeDetails",
                                "specializedIn",
                                value
                              )
                            }
                            disabled={
                              editingMentorField !==
                              "collegeDetails.specializedIn"
                            }
                          >
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select Specialization" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="cs">
                                Computer Science
                              </SelectItem>
                              <SelectItem value="it">
                                Information Technology
                              </SelectItem>
                              <SelectItem value="ec">
                                Electronics & Communication
                              </SelectItem>
                              <SelectItem value="me">
                                Mechanical Engineering
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </EditableField>

                        <EditableField
                          label="City"
                          field="collegeDetails.city"
                          value={mentorData.collegeDetails.city}
                          isEditing={
                            editingMentorField === "collegeDetails.city"
                          }
                          onEdit={() =>
                            setEditingMentorField("collegeDetails.city")
                          }
                          onSave={async () =>
                            await handleMentorSave("collegeDetails", "city")
                          }
                          onCancel={() =>
                            handleMentorCancel("collegeDetails", "city")
                          }
                          onChange={(value) =>
                            handleMentorChange("collegeDetails", "city", value)
                          }
                          error={formErrors["collegeDetails.city"]}
                          icon={<MapPin className="w-4 h-4" />}
                          placeholder="Enter city"
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <EditableField
                            label="Start Year"
                            field="collegeDetails.startDate"
                            value={mentorData.collegeDetails.startDate}
                            isEditing={
                              editingMentorField === "collegeDetails.startDate"
                            }
                            onEdit={() =>
                              setEditingMentorField("collegeDetails.startDate")
                            }
                            onSave={async () =>
                              await handleMentorSave(
                                "collegeDetails",
                                "startDate"
                              )
                            }
                            onCancel={() =>
                              handleMentorCancel("collegeDetails", "startDate")
                            }
                            onChange={(value) =>
                              handleMentorChange(
                                "collegeDetails",
                                "startDate",
                                value
                              )
                            }
                            error={formErrors["collegeDetails.startDate"]}
                            icon={<Calendar className="w-4 h-4" />}
                          >
                            <Select
                              value={mentorData.collegeDetails.startDate}
                              onValueChange={(value) =>
                                handleMentorChange(
                                  "collegeDetails",
                                  "startDate",
                                  value
                                )
                              }
                              disabled={
                                editingMentorField !==
                                "collegeDetails.startDate"
                              }
                            >
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Start Year" />
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
                            value={mentorData.collegeDetails.endDate}
                            isEditing={
                              editingMentorField === "collegeDetails.endDate"
                            }
                            onEdit={() =>
                              setEditingMentorField("collegeDetails.endDate")
                            }
                            onSave={async () =>
                              await handleMentorSave(
                                "collegeDetails",
                                "endDate"
                              )
                            }
                            onCancel={() =>
                              handleMentorCancel("collegeDetails", "endDate")
                            }
                            onChange={(value) =>
                              handleMentorChange(
                                "collegeDetails",
                                "endDate",
                                value
                              )
                            }
                            error={formErrors["collegeDetails.endDate"]}
                            icon={<Calendar className="w-4 h-4" />}
                          >
                            <Select
                              value={mentorData.collegeDetails.endDate}
                              onValueChange={(value) =>
                                handleMentorChange(
                                  "collegeDetails",
                                  "endDate",
                                  value
                                )
                              }
                              disabled={
                                editingMentorField !== "collegeDetails.endDate"
                              }
                            >
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="End Year" />
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
                  {Object.values(mentorData.professionalDetails).some(
                    (value) =>
                      value && value !== "professional" && value !== false
                  ) && (
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
                            Your career journey and expertise
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <EditableField
                          label="Job Role"
                          field="professionalDetails.jobRole"
                          value={mentorData.professionalDetails.jobRole}
                          isEditing={
                            editingMentorField === "professionalDetails.jobRole"
                          }
                          onEdit={() =>
                            setEditingMentorField("professionalDetails.jobRole")
                          }
                          onSave={async () =>
                            await handleMentorSave(
                              "professionalDetails",
                              "jobRole"
                            )
                          }
                          onCancel={() =>
                            handleMentorCancel("professionalDetails", "jobRole")
                          }
                          onChange={(value) =>
                            handleMentorChange(
                              "professionalDetails",
                              "jobRole",
                              value
                            )
                          }
                          error={formErrors["professionalDetails.jobRole"]}
                        >
                          <Select
                            value={mentorData.professionalDetails.jobRole}
                            onValueChange={(value) =>
                              handleMentorChange(
                                "professionalDetails",
                                "jobRole",
                                value
                              )
                            }
                            disabled={
                              editingMentorField !==
                              "professionalDetails.jobRole"
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
                              <SelectItem value="pm">
                                Product Manager
                              </SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </EditableField>

                        <EditableField
                          label="Company"
                          field="professionalDetails.company"
                          value={mentorData.professionalDetails.company}
                          isEditing={
                            editingMentorField === "professionalDetails.company"
                          }
                          onEdit={() =>
                            setEditingMentorField("professionalDetails.company")
                          }
                          onSave={async () =>
                            await handleMentorSave(
                              "professionalDetails",
                              "company"
                            )
                          }
                          onCancel={() =>
                            handleMentorCancel("professionalDetails", "company")
                          }
                          onChange={(value) =>
                            handleMentorChange(
                              "professionalDetails",
                              "company",
                              value
                            )
                          }
                          error={formErrors["professionalDetails.company"]}
                          placeholder="Enter company name"
                        />

                        <EditableField
                          label="Total Experience"
                          field="professionalDetails.experience"
                          value={mentorData.professionalDetails.experience}
                          isEditing={
                            editingMentorField ===
                            "professionalDetails.experience"
                          }
                          onEdit={() =>
                            setEditingMentorField(
                              "professionalDetails.experience"
                            )
                          }
                          onSave={async () =>
                            await handleMentorSave(
                              "professionalDetails",
                              "experience"
                            )
                          }
                          onCancel={() =>
                            handleMentorCancel(
                              "professionalDetails",
                              "experience"
                            )
                          }
                          onChange={(value) =>
                            handleMentorChange(
                              "professionalDetails",
                              "experience",
                              value
                            )
                          }
                          error={formErrors["professionalDetails.experience"]}
                        >
                          <Select
                            value={mentorData.professionalDetails.experience}
                            onValueChange={(value) =>
                              handleMentorChange(
                                "professionalDetails",
                                "experience",
                                value
                              )
                            }
                            disabled={
                              editingMentorField !==
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
                          value={mentorData.professionalDetails.city}
                          isEditing={
                            editingMentorField === "professionalDetails.city"
                          }
                          onEdit={() =>
                            setEditingMentorField("professionalDetails.city")
                          }
                          onSave={async () =>
                            await handleMentorSave(
                              "professionalDetails",
                              "city"
                            )
                          }
                          onCancel={() =>
                            handleMentorCancel("professionalDetails", "city")
                          }
                          onChange={(value) =>
                            handleMentorChange(
                              "professionalDetails",
                              "city",
                              value
                            )
                          }
                          error={formErrors["professionalDetails.city"]}
                          icon={<MapPin className="w-4 h-4" />}
                          placeholder="Enter city"
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <EditableField
                            label="Start Year"
                            field="professionalDetails.startDate"
                            value={mentorData.professionalDetails.startDate}
                            isEditing={
                              editingMentorField ===
                              "professionalDetails.startDate"
                            }
                            onEdit={() =>
                              setEditingMentorField(
                                "professionalDetails.startDate"
                              )
                            }
                            onSave={async () =>
                              await handleMentorSave(
                                "professionalDetails",
                                "startDate"
                              )
                            }
                            onCancel={() =>
                              handleMentorCancel(
                                "professionalDetails",
                                "startDate"
                              )
                            }
                            onChange={(value) =>
                              handleMentorChange(
                                "professionalDetails",
                                "startDate",
                                value
                              )
                            }
                            error={formErrors["professionalDetails.startDate"]}
                            icon={<Calendar className="w-4 h-4" />}
                          >
                            <Select
                              value={mentorData.professionalDetails.startDate}
                              onValueChange={(value) =>
                                handleMentorChange(
                                  "professionalDetails",
                                  "startDate",
                                  value
                                )
                              }
                              disabled={
                                editingMentorField !==
                                "professionalDetails.startDate"
                              }
                            >
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Start Year" />
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
                            field="professionalDetails.endDate"
                            value={mentorData.professionalDetails.endDate}
                            isEditing={
                              editingMentorField ===
                              "professionalDetails.endDate"
                            }
                            onEdit={() =>
                              setEditingMentorField(
                                "professionalDetails.endDate"
                              )
                            }
                            onSave={async () =>
                              await handleMentorSave(
                                "professionalDetails",
                                "endDate"
                              )
                            }
                            onCancel={() =>
                              handleMentorCancel(
                                "professionalDetails",
                                "endDate"
                              )
                            }
                            onChange={(value) =>
                              handleMentorChange(
                                "professionalDetails",
                                "endDate",
                                value
                              )
                            }
                            error={formErrors["professionalDetails.endDate"]}
                            icon={<Calendar className="w-4 h-4" />}
                          >
                            <Select
                              value={mentorData.professionalDetails.endDate}
                              onValueChange={(value) =>
                                handleMentorChange(
                                  "professionalDetails",
                                  "endDate",
                                  value
                                )
                              }
                              disabled={
                                editingMentorField !==
                                  "professionalDetails.endDate" ||
                                mentorData.professionalDetails.currentlyWorking
                              }
                            >
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="End Year" />
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
                            value={
                              mentorData.professionalDetails.currentlyWorking
                            }
                            isEditing={
                              editingMentorField ===
                              "professionalDetails.currentlyWorking"
                            }
                            onEdit={() =>
                              setEditingMentorField(
                                "professionalDetails.currentlyWorking"
                              )
                            }
                            onSave={async () =>
                              await handleMentorSave(
                                "professionalDetails",
                                "currentlyWorking"
                              )
                            }
                            onCancel={() =>
                              handleMentorCancel(
                                "professionalDetails",
                                "currentlyWorking"
                              )
                            }
                            onChange={(value) =>
                              handleMentorChange(
                                "professionalDetails",
                                "currentlyWorking",
                                value
                              )
                            }
                            error={
                              formErrors["professionalDetails.currentlyWorking"]
                            }
                          >
                            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-200">
                              <Checkbox
                                id="currentlyWorking"
                                checked={
                                  mentorData.professionalDetails
                                    .currentlyWorking
                                }
                                onCheckedChange={(checked) =>
                                  handleMentorChange(
                                    "professionalDetails",
                                    "currentlyWorking",
                                    !!checked
                                  )
                                }
                                disabled={
                                  editingMentorField !==
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

            {/* Links Tab */}
            <Tabs.Content value="links" className="p-8">
              <div className="max-w-5xl p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Links & Achievements
                  </h2>
                  <p className="text-gray-600">
                    Showcase your accomplishments and professional presence
                  </p>
                </div>

                <div className="space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
                  <EditableField
                    label="Achievements & Awards"
                    field="achievements"
                    value={profileData.achievements}
                    isEditing={editingField === "achievements"}
                    onEdit={() => handleEdit("achievements")}
                    onSave={async () => await handleSave("achievements")}
                    onCancel={() => handleCancel("achievements")}
                    onChange={(value) =>
                      setProfileData((prev) => ({
                        ...prev,
                        achievements: value,
                      }))
                    }
                    error={formErrors.achievements}
                    icon={<Trophy className="w-4 h-4" />}
                    placeholder="Share your notable achievements, awards, certifications, or recognition..."
                  >
                    <Textarea
                      className={`w-full h-32 transition-all duration-200 ${
                        editingField === "achievements"
                          ? "bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          : "bg-transparent border-transparent resize-none text-gray-800"
                      }`}
                      placeholder="Share your notable achievements, awards, certifications, or recognition..."
                      value={profileData.achievements}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          achievements: e.target.value,
                        }))
                      }
                      readOnly={editingField !== "achievements"}
                    />
                  </EditableField>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <EditableField
                      label="LinkedIn Profile"
                      field="linkedinURL"
                      value={profileData.linkedinURL}
                      isEditing={editingField === "linkedinURL"}
                      onEdit={() => handleEdit("linkedinURL")}
                      onSave={async () => await handleSave("linkedinURL")}
                      onCancel={() => handleCancel("linkedinURL")}
                      onChange={(value) =>
                        setProfileData((prev) => ({
                          ...prev,
                          linkedinURL: value,
                        }))
                      }
                      error={formErrors.linkedinURL}
                      icon={<Link2 className="w-4 h-4" />}
                      placeholder="https://www.linkedin.com/in/your-profile"
                    />

                    <EditableField
                      label="Portfolio Website"
                      field="portfolioURL"
                      value={profileData.portfolioURL}
                      isEditing={editingField === "portfolioURL"}
                      onEdit={() => handleEdit("portfolioURL")}
                      onSave={async () => await handleSave("portfolioURL")}
                      onCancel={() => handleCancel("portfolioURL")}
                      onChange={(value) =>
                        setProfileData((prev) => ({
                          ...prev,
                          portfolioURL: value,
                        }))
                      }
                      error={formErrors.portfolioURL}
                      icon={<Link2 className="w-4 h-4" />}
                      placeholder="https://your-portfolio.com"
                    />
                  </div>

                  <EditableField
                    label="Featured Article or Blog"
                    field="featuredArticle"
                    value={profileData.featuredArticle}
                    isEditing={editingField === "featuredArticle"}
                    onEdit={() => handleEdit("featuredArticle")}
                    onSave={async () => await handleSave("featuredArticle")}
                    onCancel={() => handleCancel("featuredArticle")}
                    onChange={(value) =>
                      setProfileData((prev) => ({
                        ...prev,
                        featuredArticle: value,
                      }))
                    }
                    error={formErrors.featuredArticle}
                    icon={<Link2 className="w-4 h-4" />}
                    placeholder="Link to your featured article, blog post, or publication"
                  />
                </div>

                {/* Preview Cards */}
                <div className="mt-12">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">
                    Link Previews
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileData.linkedinURL && (
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <Link2 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-blue-800">
                              LinkedIn Profile
                            </p>
                            <p className="text-sm text-blue-600 truncate max-w-xs">
                              {profileData.linkedinURL}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {profileData.portfolioURL && (
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                            <Link2 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-purple-800">
                              Portfolio
                            </p>
                            <p className="text-sm text-purple-600 truncate max-w-xs">
                              {profileData.portfolioURL}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-gray-700 font-medium">
              Updating your profile...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorProfile;
//bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6
//rounded-2xl bg-blue-100
