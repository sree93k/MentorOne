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
// } from "lucide-react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import { setError, setUser, setLoading } from "@/redux/slices/userSlice";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
//   interestedNewCareer: Yup.string().optional(),
// });

// // Create separate schemas for each user type
// const schoolDetailsSchema = Yup.object().shape({
//   schoolName: Yup.string().required("School name is required"),
//   class: Yup.string().required("Class is required"),
//   city: Yup.string().required("City is required"),
//   startDate: Yup.string()
//     .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date format")
//     .required("Start date is required"),
//   endDate: Yup.string()
//     .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid end date format")
//     .required("End date is required"),
//   userType: Yup.string()
//     .oneOf(["school"], "Invalid user type")
//     .required("User type is required"),
// });

// const collegeDetailsSchema = Yup.object().shape({
//   collegeName: Yup.string().required("College name is required"),
//   course: Yup.string().required("Course is required"),
//   specializedIn: Yup.string().optional(),
//   city: Yup.string().required("City is required"),
//   startDate: Yup.string()
//     .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date format")
//     .required("Start date is required"),
//   endDate: Yup.string()
//     .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid end date format")
//     .required("End date is required"),
//   userType: Yup.string()
//     .oneOf(["college", "fresher"], "Invalid user type")
//     .required("User type is required"),
// });

// const professionalDetailsSchema = Yup.object().shape({
//   jobRole: Yup.string().required("Job role is required"),
//   company: Yup.string().required("Company is required"),
//   experience: Yup.string().required("Experience is required"),
//   city: Yup.string().required("City is required"),
//   startDate: Yup.string()
//     .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date format")
//     .required("Start date is required"),
//   endDate: Yup.string()
//     .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid end date format")
//     .optional(),
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

// // EditableField component
// interface EditableFieldProps {
//   label: string;
//   field: string;
//   value: string;
//   onChange: (value: string) => void;
//   isEditing: boolean;
//   onEdit: () => void;
//   onSave: () => void;
//   onCancel: () => void;
//   type?: string;
//   error?: string;
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
//       <Input
//         type={type}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         readOnly={!isEditing}
//         className="bg-white"
//       />
//       {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
//     </div>
//   );
// };
// // Define initial mentee data structure
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
// // MenteeProfile component
// const MenteeProfile: React.FC = () => {
//   const dispatch = useDispatch();
//   const { user, error, loading } = useSelector(
//     (state: RootState) => state.user
//   );
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
//   const [profileData, setProfileData] = useState({
//     firstName: "",
//     lastName: "",
//     phone: "",
//     email: "",
//     bio: "",
//     skills: [] as string[],
//     interestedNewCareer: "",
//     profilePicture: "",
//   });
//   const [menteeData, setMenteeData] = useState(initialMenteeData);
//   const [originalMenteeData, setOriginalMenteeData] =
//     useState(initialMenteeData);
//   const [isEditingMentee, setIsEditingMentee] = useState(false);

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

//   // Fetch user data
//   useEffect(() => {
//     const fetchUserData = async () => {
//       dispatch(setLoading(true));
//       try {
//         const response = await userProfileData();
//         console.log(
//           "||||||||||||||FETCHED userProfileData response is ,",
//           response
//         );

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

//   // Sync profileData and menteeData with user
//   useEffect(() => {
//     if (user) {
//       setProfileData({
//         firstName: user.firstName || "",
//         lastName: user.lastName || "",
//         phone: user.phone ? String(user.phone) : "",
//         email: user.email || "",
//         bio: user.bio || "",
//         skills: user.skills || [],
//         interestedNewCareer: user.menteeId?.interestedNewcareer?.[0] || "",
//         profilePicture: user.profilePicture || "",
//       });
//       setMenteeData({
//         schoolDetails: {
//           schoolName: user.schoolDetails?.schoolName || "",
//           class: user.className || "",
//           city: user.schoolDetails?.city || "",
//           startDate: user?.schoolDetails?.startDate?.slice(0, 10) || "",
//           endDate: user?.schoolDetails?.endDate?.slice(0, 10) || "",
//           userType: user?.schoolDetails?.userType || "school",
//         },
//         collegeDetails: {
//           collegeName: user.collegeDetails?.collegeName || "",
//           course: user.collegeDetails?.course || "",
//           specializedIn: user.collegeDetails?.specializedIn || "",
//           city: user.collegeDetails?.city || "",
//           startDate: user?.collegeDetails?.startDate?.slice(0, 10) || "",
//           endDate: user?.collegeDetails?.endDate?.slice(0, 10) || "",
//           userType: user?.collegeDetails?.userType || "college",
//         },
//         professionalDetails: {
//           jobRole: user.professionalDetails?.jobRole || "",
//           company: user.professionalDetails?.company || "",
//           experience: user.professionalDetails?.experience || "",
//           city: user.professionalDetails?.city || "",
//           startDate: user?.professionalDetails?.startDate?.slice(0, 10) || "",
//           endDate: user?.professionalDetails?.endDate?.slice(0, 10) || "",
//           currentlyWorking: user.professionalDetails?.currentlyWorking || false,
//           userType: user?.professionalDetails?.userType || "professional",
//         },
//       });
//       setOriginalMenteeData({
//         schoolDetails: {
//           schoolName: user.schoolDetails?.schoolName || "",
//           class: user.schoolDetails?.class || "",
//           city: user.schoolDetails?.city || "",
//           startDate: user?.schoolDetails?.startDate?.slice(0, 10) || "",
//           endDate: user?.schoolDetails?.endDate?.slice(0, 10) || "",
//           userType: user?.schoolDetails?.userType || "school",
//         },
//         collegeDetails: {
//           collegeName: user.collegeDetails?.collegeName || "",
//           course: user.collegeDetails?.course || "",
//           specializedIn: user.collegeDetails?.specializedIn || "",
//           city: user.collegeDetails?.city || "",
//           startDate: user?.collegeDetails?.startDate?.slice(0, 10) || "",
//           endDate: user?.collegeDetails?.endDate?.slice(0, 10) || "",
//           userType: user?.collegeDetails?.userType || "college",
//         },
//         professionalDetails: {
//           jobRole: user.professionalDetails?.jobRole || "",
//           company: user.professionalDetails?.company || "",
//           experience: user.professionalDetails?.experience || "",
//           city: user.professionalDetails?.city || "",
//           startDate: user?.professionalDetails?.startDate?.slice(0, 10) || "",
//           endDate: user?.professionalDetails?.endDate?.slice(0, 10) || "",
//           currentlyWorking: user.professionalDetails?.currentlyWorking || false,
//           userType: user?.professionalDetails?.userType || "professional",
//         },
//       });
//       setPreviewUrl(user.profilePicture || null);
//     }
//   }, [user]);
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

//   // Save uploaded image
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
//       // Validate only the specific field from the main profile schema
//       await profileSchema.validateAt(field, { [field]: value });
//       const payload = { [field]: value };
//       const updatedUser = await updateUserProfile(payload);
//       dispatch(setUser(updatedUser));
//       setProfileData((prev) => ({ ...prev, [field]: value }));
//       toast.success(`${field} updated successfully`);
//     } catch (error) {
//       if (error instanceof Yup.ValidationError) {
//         toast.error(error.message);
//       } else {
//         toast.error(`Failed to update ${field}`);
//         console.error(error);
//       }
//     }
//   };

//   // Handle mentee data change
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

//   const validateUserTypeSection = async (userType, data) => {
//     try {
//       if (userType === "school") {
//         await schoolDetailsSchema.validate(data.schoolDetails);
//       } else if (["college", "fresher"].includes(userType)) {
//         await collegeDetailsSchema.validate(data.collegeDetails);
//       } else if (userType === "professional") {
//         await professionalDetailsSchema.validate(data.professionalDetails);
//       }
//       return { isValid: true, errors: {} };
//     } catch (error) {
//       if (error instanceof Yup.ValidationError) {
//         const errors = {};
//         error.inner.forEach((err) => {
//           errors[err.path] = err.message;
//         });
//         return { isValid: false, errors };
//       }
//       throw error;
//     }
//   };
//   const handleMenteeSave = async () => {
//     try {
//       let payload = {};
//       let userType = "";
//       let dataToValidate = {};

//       // Determine which section to validate and save
//       if (user?.schoolDetails?.userType === "school") {
//         userType = "school";
//         payload = { schoolDetails: menteeData.schoolDetails };
//         dataToValidate = menteeData.schoolDetails;
//       } else if (
//         ["college", "fresher"].includes(user?.collegeDetails?.userType || "")
//       ) {
//         userType = user?.collegeDetails?.userType || "college";
//         payload = { collegeDetails: menteeData.collegeDetails };
//         dataToValidate = menteeData.collegeDetails;
//       } else if (user?.professionalDetails?.userType === "professional") {
//         userType = "professional";
//         payload = { professionalDetails: menteeData.professionalDetails };
//         dataToValidate = menteeData.professionalDetails;
//       }

//       // Validate using the appropriate schema
//       const validation = await validateUserTypeSection(userType, {
//         schoolDetails: menteeData.schoolDetails,
//         collegeDetails: menteeData.collegeDetails,
//         professionalDetails: menteeData.professionalDetails,
//       });

//       if (!validation.isValid) {
//         setFormErrors(validation.errors);
//         toast.error("Please fix the form errors");
//         return;
//       }

//       const updatedUser = await updateUserProfile(payload);
//       dispatch(setUser(updatedUser));
//       setIsEditingMentee(false);
//       setFormErrors({});
//       toast.success("Details updated successfully");
//     } catch (error) {
//       toast.error("Failed to update details");
//       console.error(error);
//     }
//   };

//   // Cancel mentee edits
//   const handleMenteeCancel = () => {
//     setMenteeData(originalMenteeData);
//     setFormErrors({});
//     setIsEditingMentee(false);
//   };

//   // Add skill
//   const addSkill = (skill: string) => {
//     if (skill && !profileData.skills.includes(skill)) {
//       const updatedSkills = [...profileData.skills, skill];
//       updateProfileField("skills", updatedSkills);
//       setSkillSearchTerm("");
//       setShowSkillDropdown(false);
//     }
//   };

//   // Remove skill
//   const removeSkill = (index: number) => {
//     const updatedSkills = profileData.skills.filter((_, i) => i !== index);
//     updateProfileField("skills", updatedSkills);
//   };

//   // Handle password update
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

//   // Generate year options
//   const currentYear = new Date().getFullYear();
//   const yearOptions = Array.from(
//     { length: 21 },
//     (_, i) => currentYear - 20 + i
//   );

//   return (
//     <div className="flex-1 px-24">
//       {/* Profile Header */}
//       <div className="bg-black text-white p-8 rounded-t-xl">
//         <div className="flex items-end gap-6">
//           <div className="relative">
//             <Avatar className="h-24 w-24">
//               {isImageLoading ? (
//                 <AvatarFallback>
//                   <Loader2 className="h-8 w-8 animate-spin" />
//                 </AvatarFallback>
//               ) : previewUrl ? (
//                 <AvatarImage src={previewUrl} />
//               ) : (
//                 <AvatarFallback>
//                   <UploadIcon className="h-8 w-8" />
//                 </AvatarFallback>
//               )}
//             </Avatar>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageUpload}
//               className="hidden"
//               id="image-upload"
//             />
//             <Button
//               className="bg-green-500 p-1 rounded-full absolute bottom-0 right-0"
//               onClick={() => document.getElementById("image-upload")?.click()}
//             >
//               <Pencil size={16} />
//             </Button>
//             {selectedFile && (
//               <Button
//                 className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm mt-2"
//                 onClick={handleImageSave}
//                 disabled={isUploading}
//               >
//                 {isUploading ? "Uploading..." : "Save Image"}
//               </Button>
//             )}
//           </div>
//           <div>
//             <h2 className="text-3xl font-bold mb-1">
//               {profileData.firstName} {profileData.lastName}
//             </h2>
//             <div className="flex justify-between items-start mt-2">
//               <p className="text-sm text-gray-300">
//                 {profileData.skills.length > 0
//                   ? profileData.skills.join(" | ")
//                   : "No skills added"}
//               </p>
//               {editingField === "skills" ? (
//                 <div className="flex flex-col gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     {profileData.skills.map((skill, index) => (
//                       <Badge key={index} variant="secondary">
//                         {skill}
//                         <XIcon
//                           className="w-3 h-3 cursor-pointer ml-1"
//                           onClick={() => removeSkill(index)}
//                         />
//                       </Badge>
//                     ))}
//                   </div>
//                   <div className="relative">
//                     <Input
//                       placeholder="Search or add skill"
//                       value={skillSearchTerm}
//                       onChange={(e) => {
//                         setSkillSearchTerm(e.target.value);
//                         setShowSkillDropdown(true);
//                       }}
//                       onFocus={() => setShowSkillDropdown(true)}
//                     />
//                     {showSkillDropdown &&
//                       presetSkills.filter(
//                         (skill) => !profileData.skills.includes(skill)
//                       ).length > 0 && (
//                         <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
//                           {presetSkills
//                             .filter(
//                               (skill) =>
//                                 skill
//                                   .toLowerCase()
//                                   .includes(skillSearchTerm.toLowerCase()) &&
//                                 !profileData.skills.includes(skill)
//                             )
//                             .map((skill) => (
//                               <div
//                                 key={skill}
//                                 className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
//                                 onClick={() => addSkill(skill)}
//                               >
//                                 {skill}
//                               </div>
//                             ))}
//                         </div>
//                       )}
//                     <Button
//                       onClick={() =>
//                         updateProfileField("skills", profileData.skills)
//                       }
//                       className="text-sm text-green-600 hover:underline mt-2"
//                     >
//                       Save
//                     </Button>
//                   </div>
//                 </div>
//               ) : (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setEditingField("skills")}
//                   className="text-black hover:underline"
//                 >
//                   Edit Skills
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tabs Section */}
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
//                 onSave={() =>
//                   updateProfileField("firstName", profileData.firstName)
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
//                 onSave={() =>
//                   updateProfileField("lastName", profileData.lastName)
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
//                 onSave={() => updateProfileField("phone", profileData.phone)}
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
//                     Change password every month for security.
//                   </p>
//                 </div>
//               )}
//               <div className="mb-6">
//                 <Label className="text-sm font-medium">Bio</Label>
//                 <textarea
//                   className="w-full p-2 border rounded-md h-24"
//                   placeholder="Enter about yourself"
//                   value={profileData.bio}
//                   onChange={(e) =>
//                     setProfileData((prev) => ({ ...prev, bio: e.target.value }))
//                   }
//                   readOnly={editingField !== "bio"}
//                 />
//                 {editingField === "bio" ? (
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => updateProfileField("bio", profileData.bio)}
//                     className="text-green-600 hover:underline mt-2"
//                   >
//                     Save
//                   </Button>
//                 ) : (
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => setEditingField("bio")}
//                     className="text-black hover:underline mt-2"
//                   >
//                     Edit
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </Tabs.Content>

//           <Tabs.Content value="as-mentee">
//             <div className="max-w-2xl">
//               {user?.schoolDetails?.userType === "school" && (
//                 <>
//                   <Label className="text-sm font-medium">
//                     As a School Student
//                   </Label>
//                   {!isEditingMentee ? (
//                     <div className="mt-4">
//                       <p>School Name: {menteeData.schoolDetails.schoolName}</p>
//                       <p>Class: {menteeData.schoolDetails.class}</p>
//                       <p>City: {menteeData.schoolDetails.city}</p>
//                       <p>Start Date: {menteeData.schoolDetails.startDate}</p>
//                       <p>End Date: {menteeData.schoolDetails.endDate}</p>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => setIsEditingMentee(true)}
//                         className="text-black hover:underline mt-4"
//                       >
//                         Edit School Details
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="space-y-4 mt-4">
//                       <div>
//                         <Label>School Name*</Label>
//                         <Input
//                           value={menteeData.schoolDetails.schoolName}
//                           onChange={(e) =>
//                             handleMenteeChange(
//                               "schoolDetails",
//                               "schoolName",
//                               e.target.value
//                             )
//                           }
//                           className="bg-white"
//                         />
//                         {formErrors["schoolDetails.schoolName"] && (
//                           <p className="text-red-500 text-sm">
//                             {formErrors["schoolDetails.schoolName"]}
//                           </p>
//                         )}
//                       </div>
//                       <div>
//                         <Label>Class*</Label>
//                         <Select
//                           value={menteeData.schoolDetails.class}
//                           onValueChange={(value) =>
//                             handleMenteeChange("schoolDetails", "class", value)
//                           }
//                         >
//                           <SelectTrigger className="bg-white">
//                             <SelectValue placeholder="Select Class" />
//                           </SelectTrigger>
//                           <SelectContent className="bg-white">
//                             {Array.from({ length: 12 }, (_, i) => i + 1).map(
//                               (num) => (
//                                 <SelectItem key={num} value={num.toString()}>
//                                   {num}
//                                 </SelectItem>
//                               )
//                             )}
//                           </SelectContent>
//                         </Select>
//                         {formErrors["schoolDetails.class"] && (
//                           <p className="text-red-500 text-sm">
//                             {formErrors["schoolDetails.class"]}
//                           </p>
//                         )}
//                       </div>
//                       <div>
//                         <Label>City*</Label>
//                         <Input
//                           value={menteeData.schoolDetails.city}
//                           onChange={(e) =>
//                             handleMenteeChange(
//                               "schoolDetails",
//                               "city",
//                               e.target.value
//                             )
//                           }
//                           className="bg-white"
//                         />
//                         {formErrors["schoolDetails.city"] && (
//                           <p className="text-red-500 text-sm">
//                             {formErrors["schoolDetails.city"]}
//                           </p>
//                         )}
//                       </div>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <Label>Start Date*</Label>
//                           <Input
//                             type="date"
//                             value={menteeData.schoolDetails.startDate}
//                             onChange={(e) =>
//                               handleMenteeChange(
//                                 "schoolDetails",
//                                 "startDate",
//                                 e.target.value
//                               )
//                             }
//                             className="bg-white"
//                           />
//                           {formErrors["schoolDetails.startDate"] && (
//                             <p className="text-red-500 text-sm">
//                               {formErrors["schoolDetails.startDate"]}
//                             </p>
//                           )}
//                         </div>
//                         <div>
//                           <Label>End Date*</Label>
//                           <Input
//                             type="date"
//                             value={menteeData.schoolDetails.endDate}
//                             onChange={(e) =>
//                               handleMenteeChange(
//                                 "schoolDetails",
//                                 "endDate",
//                                 e.target.value
//                               )
//                             }
//                             className="bg-white"
//                           />
//                           {formErrors["schoolDetails.endDate"] && (
//                             <p className="text-red-500 text-sm">
//                               {formErrors["schoolDetails.endDate"]}
//                             </p>
//                           )}
//                         </div>
//                       </div>

//                       <div className="flex gap-2">
//                         <Button onClick={handleMenteeSave}>Save</Button>
//                         <Button variant="outline" onClick={handleMenteeCancel}>
//                           Cancel
//                         </Button>
//                       </div>
//                     </div>
//                   )}
//                 </>
//               )}
//               {["college", "fresher"].includes(
//                 user?.collegeDetails?.userType || ""
//               ) && (
//                 <>
//                   <Label className="text-sm font-medium">
//                     {user?.collegeDetails?.userType === "college"
//                       ? "As a College Student"
//                       : "As a Fresher"}
//                   </Label>
//                   {!isEditingMentee ? (
//                     <div className="mt-4">
//                       <p>
//                         College Name: {menteeData.collegeDetails.collegeName}
//                       </p>
//                       <p>Course: {menteeData.collegeDetails.course}</p>
//                       <p>
//                         Specialized In:{" "}
//                         {menteeData.collegeDetails.specializedIn || "N/A"}
//                       </p>
//                       <p>City: {menteeData.collegeDetails.city}</p>
//                       <p>Start Date: {menteeData.collegeDetails.startDate}</p>
//                       <p>End Date: {menteeData.collegeDetails.endDate}</p>
//                       <p>User Type: {menteeData.collegeDetails.userType}</p>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => setIsEditingMentee(true)}
//                         className="text-black hover:underline mt-4"
//                       >
//                         Edit College Details
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="space-y-4 mt-4">
//                       <div>
//                         <Label>College Name*</Label>
//                         <Input
//                           value={menteeData.collegeDetails.collegeName}
//                           onChange={(e) =>
//                             handleMenteeChange(
//                               "collegeDetails",
//                               "collegeName",
//                               e.target.value
//                             )
//                           }
//                           className="bg-white"
//                         />
//                         {formErrors["collegeDetails.collegeName"] && (
//                           <p className="text-red-500 text-sm">
//                             {formErrors["collegeDetails.collegeName"]}
//                           </p>
//                         )}
//                       </div>
//                       <div>
//                         <Label>Course*</Label>
//                         <Select
//                           value={menteeData.collegeDetails.course}
//                           onValueChange={(value) =>
//                             handleMenteeChange(
//                               "collegeDetails",
//                               "course",
//                               value
//                             )
//                           }
//                         >
//                           <SelectTrigger className="bg-white">
//                             <SelectValue placeholder="Select Course" />
//                           </SelectTrigger>
//                           <SelectContent className="bg-white">
//                             <SelectItem value="btech">B.Tech</SelectItem>
//                             <SelectItem value="bsc">B.Sc</SelectItem>
//                             <SelectItem value="bca">BCA</SelectItem>
//                             <SelectItem value="mca">MCA</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         {formErrors["collegeDetails.course"] && (
//                           <p className="text-red-500 text-sm">
//                             {formErrors["collegeDetails.course"]}
//                           </p>
//                         )}
//                       </div>
//                       <div>
//                         <Label>Specialized In</Label>
//                         <Select
//                           value={menteeData.collegeDetails.specializedIn}
//                           onValueChange={(value) =>
//                             handleMenteeChange(
//                               "collegeDetails",
//                               "specializedIn",
//                               value
//                             )
//                           }
//                         >
//                           <SelectTrigger className="bg-white">
//                             <SelectValue placeholder="Select Specialization" />
//                           </SelectTrigger>
//                           <SelectContent className="bg-white">
//                             <SelectItem value="cs">Computer Science</SelectItem>
//                             <SelectItem value="it">
//                               Information Technology
//                             </SelectItem>
//                             <SelectItem value="ec">Electronics</SelectItem>
//                             <SelectItem value="me">Mechanical</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         {formErrors["collegeDetails.specializedIn"] && (
//                           <p className="text-red-500 text-sm">
//                             {formErrors["collegeDetails.specializedIn"]}
//                           </p>
//                         )}
//                       </div>
//                       <div>
//                         <Label>City*</Label>
//                         <Input
//                           value={menteeData.collegeDetails.city}
//                           onChange={(e) =>
//                             handleMenteeChange(
//                               "collegeDetails",
//                               "city",
//                               e.target.value
//                             )
//                           }
//                           className="bg-white"
//                         />
//                         {formErrors["collegeDetails.city"] && (
//                           <p className="text-red-500 text-sm">
//                             {formErrors["collegeDetails.city"]}
//                           </p>
//                         )}
//                       </div>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <Label>Start Date*</Label>
//                           <Input
//                             type="date"
//                             value={menteeData.collegeDetails.startDate}
//                             onChange={(e) =>
//                               handleMenteeChange(
//                                 "collegeDetails",
//                                 "startDate",
//                                 e.target.value
//                               )
//                             }
//                             className="bg-white"
//                           />
//                           {formErrors["collegeDetails.startDate"] && (
//                             <p className="text-red-500 text-sm">
//                               {formErrors["collegeDetails.startDate"]}
//                             </p>
//                           )}
//                         </div>
//                         <div>
//                           <Label>End Date*</Label>
//                           <Input
//                             type="date"
//                             value={menteeData.collegeDetails.endDate}
//                             onChange={(e) =>
//                               handleMenteeChange(
//                                 "collegeDetails",
//                                 "endDate",
//                                 e.target.value
//                               )
//                             }
//                             className="bg-white"
//                           />
//                           {formErrors["collegeDetails.endDate"] && (
//                             <p className="text-red-500 text-sm">
//                               {formErrors["collegeDetails.endDate"]}
//                             </p>
//                           )}
//                         </div>
//                       </div>

//                       <div>
//                         <Label>Interested in a New Career</Label>
//                         <Input
//                           value={profileData.interestedNewCareer}
//                           onChange={(e) =>
//                             setProfileData((prev) => ({
//                               ...prev,
//                               interestedNewCareer: e.target.value,
//                             }))
//                           }
//                           className="bg-white"
//                         />
//                         {editingField === "interestedNewCareer" ? (
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() =>
//                               updateProfileField(
//                                 "interestedNewCareer",
//                                 profileData.interestedNewCareer
//                               )
//                             }
//                             className="text-green-600 hover:underline mt-2"
//                           >
//                             Save
//                           </Button>
//                         ) : (
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() =>
//                               setEditingField("interestedNewCareer")
//                             }
//                             className="text-black hover:underline mt-2"
//                           >
//                             Edit
//                           </Button>
//                         )}
//                       </div>
//                       <div className="flex gap-2">
//                         <Button onClick={handleMenteeSave}>Save</Button>
//                         <Button variant="outline" onClick={handleMenteeCancel}>
//                           Cancel
//                         </Button>
//                       </div>
//                     </div>
//                   )}
//                 </>
//               )}
//               {user?.professionalDetails?.userType === "professional" && (
//                 <>
//                   <Label className="text-sm font-medium">
//                     As a Professional
//                   </Label>
//                   {!isEditingMentee ? (
//                     <div className="mt-4">
//                       <p>Job Role: {menteeData.professionalDetails.jobRole}</p>
//                       <p>Company: {menteeData.professionalDetails.company}</p>
//                       <p>
//                         Experience: {menteeData.professionalDetails.experience}
//                       </p>
//                       <p>City: {menteeData.professionalDetails.city}</p>
//                       <p>
//                         Start Date: {menteeData.professionalDetails.startDate}
//                       </p>
//                       <p>
//                         End Date:{" "}
//                         {menteeData.professionalDetails.endDate || "N/A"}
//                       </p>
//                       <p>
//                         Currently Working:{" "}
//                         {menteeData.professionalDetails.currentlyWorking
//                           ? "Yes"
//                           : "No"}
//                       </p>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => setIsEditingMentee(true)}
//                         className="text-black hover:underline mt-4"
//                       >
//                         Edit Professional Details
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="space-y-4 mt-4">
//                       <div>
//                         <Label>Job Role*</Label>
//                         <Select
//                           value={menteeData.professionalDetails.jobRole}
//                           onValueChange={(value) =>
//                             handleMenteeChange(
//                               "professionalDetails",
//                               "jobRole",
//                               value
//                             )
//                           }
//                         >
//                           <SelectTrigger className="bg-white">
//                             <SelectValue placeholder="Select Job Role" />
//                           </SelectTrigger>
//                           <SelectContent className="bg-white">
//                             <SelectItem value="sde">
//                               Software Developer
//                             </SelectItem>
//                             <SelectItem value="designer">
//                               UI/UX Designer
//                             </SelectItem>
//                             <SelectItem value="pm">Product Manager</SelectItem>
//                             <SelectItem value="other">Other</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         {formErrors["professionalDetails.jobRole"] && (
//                           <p className="text-red-500 text-sm">
//                             {formErrors["professionalDetails.jobRole"]}
//                           </p>
//                         )}
//                       </div>
//                       <div>
//                         <Label>Company*</Label>
//                         <Input
//                           value={menteeData.professionalDetails.company}
//                           onChange={(e) =>
//                             handleMenteeChange(
//                               "professionalDetails",
//                               "company",
//                               e.target.value
//                             )
//                           }
//                           className="bg-white"
//                         />
//                         {formErrors["professionalDetails.company"] && (
//                           <p className="text-red-500 text-sm">
//                             {formErrors["professionalDetails.company"]}
//                           </p>
//                         )}
//                       </div>
//                       <div>
//                         <Label>Total Experience*</Label>
//                         <Select
//                           value={menteeData.professionalDetails.experience}
//                           onValueChange={(value) =>
//                             handleMenteeChange(
//                               "professionalDetails",
//                               "experience",
//                               value
//                             )
//                           }
//                         >
//                           <SelectTrigger className="bg-white">
//                             <SelectValue placeholder="Select Experience" />
//                           </SelectTrigger>
//                           <SelectContent className="bg-white">
//                             <SelectItem value="0-1">0-1 years</SelectItem>
//                             <SelectItem value="1-3">1-3 years</SelectItem>
//                             <SelectItem value="3-5">3-5 years</SelectItem>
//                             <SelectItem value="5+">5+ years</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         {formErrors["professionalDetails.experience"] && (
//                           <p className="text-red-500 text-sm">
//                             {formErrors["professionalDetails.experience"]}
//                           </p>
//                         )}
//                       </div>
//                       <div>
//                         <Label>City*</Label>
//                         <Input
//                           value={menteeData.professionalDetails.city}
//                           onChange={(e) =>
//                             handleMenteeChange(
//                               "professionalDetails",
//                               "city",
//                               e.target.value
//                             )
//                           }
//                           className="bg-white"
//                         />
//                         {formErrors["professionalDetails.city"] && (
//                           <p className="text-red-500 text-sm">
//                             {formErrors["professionalDetails.city"]}
//                           </p>
//                         )}
//                       </div>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <Label>Start Date*</Label>
//                           <Input
//                             type="date"
//                             value={menteeData.professionalDetails.startDate}
//                             onChange={(e) =>
//                               handleMenteeChange(
//                                 "professionalDetails",
//                                 "startDate",
//                                 e.target.value
//                               )
//                             }
//                             className="bg-white"
//                           />
//                           {formErrors["professionalDetails.startDate"] && (
//                             <p className="text-red-500 text-sm">
//                               {formErrors["professionalDetails.startDate"]}
//                             </p>
//                           )}
//                         </div>
//                         <div>
//                           <Label>End Date</Label>
//                           <Input
//                             type="date"
//                             value={menteeData.professionalDetails.endDate}
//                             onChange={(e) =>
//                               handleMenteeChange(
//                                 "professionalDetails",
//                                 "endDate",
//                                 e.target.value
//                               )
//                             }
//                             className="bg-white"
//                           />
//                           {formErrors["professionalDetails.endDate"] && (
//                             <p className="text-red-500 text-sm">
//                               {formErrors["professionalDetails.endDate"]}
//                             </p>
//                           )}
//                         </div>
//                       </div>

//                       <div className="flex gap-2">
//                         <Button onClick={handleMenteeSave}>Save</Button>
//                         <Button variant="outline" onClick={handleMenteeCancel}>
//                           Cancel
//                         </Button>
//                       </div>
//                     </div>
//                   )}
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
