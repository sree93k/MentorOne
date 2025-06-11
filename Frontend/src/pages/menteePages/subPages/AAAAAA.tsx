// import React, { useState, useEffect } from "react";
// import * as Tabs from "@radix-ui/react-tabs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Pencil,
//   UploadIcon,
//   Loader2,
//   HardDriveUpload,
//   EyeIcon,
//   EyeOffIcon,
// } from "lucide-react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import { setError, setUser, setLoading } from "@/redux/slices/userSlice";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { updateUserProfile } from "@/services/userServices";
// import { uploadProfileImage } from "@/services/uploadService";
// import { toast } from "react-hot-toast";
// import {
//   XIcon,
//   SearchIcon,
//   GripVerticalIcon,
//   PlusIcon,
//   CircleCheckBig,
//   Ban,
//   CircleDashed,
// } from "lucide-react";
// import { updateUserPassword } from "@/services/userServices";
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
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// // Define the EditableField component props
// interface EditableFieldProps {
//   label: string;
//   field: string;
//   value: string;
//   workAs: string;
//   onEdit: () => void;
//   isEditing?: boolean;
//   onSave?: () => void;
//   onCancel?: () => void;
//   onChange?: (value: string) => void;
//   type?: string;
// }
// const historySchema = Yup.object().shape({
//   schoolName: Yup.string().when("type", {
//     is: "school",
//     then: (schema) => schema.required("School name is required"),
//   }),
//   class: Yup.string().when("type", {
//     is: "school",
//     then: (schema) => schema.required("Class is required"),
//   }),
//   course: Yup.string().when("type", {
//     is: "college",
//     then: (schema) => schema.required("Course is required"),
//   }),
//   college: Yup.string().when("type", {
//     is: "college",
//     then: (schema) => schema.required("College is required"),
//   }),
//   jobRole: Yup.string().when("type", {
//     is: "professional",
//     then: (schema) => schema.required("Job role is required"),
//   }),
//   company: Yup.string().when("type", {
//     is: "professional",
//     then: (schema) => schema.required("Company is required"),
//   }),
//   totalExperience: Yup.string().when("type", {
//     is: "professional",
//     then: (schema) => schema.required("Experience is required"),
//   }),
//   city: Yup.string().required("City is required"),
//   startYear: Yup.string().optional(),
//   endYear: Yup.string().optional(),
//   currentlyWorking: Yup.boolean().optional(),
// });
// // Yup validation schema for profile fields
// const profileSchema = Yup.object().shape({
//   firstName: Yup.string()
//     .required("First name is required")
//     .min(2, "Too short")
//     .matches(
//       /^[A-Za-z]+$/,
//       "First name must contain only letters (no spaces or numbers)"
//     )
//     .test(
//       "no-whitespace",
//       "First name cannot be empty or whitespace",
//       (value) => value?.trim().length !== 0
//     ),
//   lastName: Yup.string()
//     .required("Last name is required")
//     .min(2, "Too short")
//     .matches(
//       /^[A-Za-z]+$/,
//       "Last name must contain only letters (no spaces or numbers)"
//     )
//     .test(
//       "no-whitespace",
//       "Last name cannot be empty or whitespace",
//       (value) => value?.trim().length !== 0
//     ),
//   phone: Yup.string()
//     .matches(/^\d{10}$/, "Phone number must be 10 digits")
//     .required("Phone number is required"),
//   email: Yup.string().email("Invalid email").required("Email is required"),
//   workAs: Yup.string().optional(),
//   course: Yup.string().when("workAs", {
//     is: (val: string) => ["college", "fresher"].includes(val),
//     then: (schema) => schema.required("Course is required"),
//     otherwise: (schema) => schema.optional(),
//   }),
//   college: Yup.string().when("workAs", {
//     is: (val: string) => ["college", "fresher"].includes(val),
//     then: (schema) => schema.required("College is required"),
//     otherwise: (schema) => schema.optional(),
//   }),
//   courseStart: Yup.string().when("workAs", {
//     is: (val: string) => ["college", "fresher"].includes(val),
//     then: (schema) => schema.required("Start date is required"),
//     otherwise: (schema) => schema.optional(),
//   }),
//   courseEnd: Yup.string().when("workAs", {
//     is: (val: string) => ["college", "fresher"].includes(val),
//     then: (schema) => schema.required("End date is required"),
//     otherwise: (schema) => schema.optional(),
//   }),
//   city: Yup.string().required("City is required"),
//   bio: Yup.string().max(500, "Bio must be 500 characters or less").optional(),
//   schoolName: Yup.string().optional(),
//   class: Yup.string().optional(),
//   jobRole: Yup.string().optional(),
//   company: Yup.string().optional(),
//   totalExperience: Yup.string().optional(),
//   startYear: Yup.string().optional(),
//   endYear: Yup.string().optional(),
//   achievements: Yup.string().optional(),
//   linkedinUrl: Yup.string().url("Invalid URL").nullable().optional(),
//   portfolioUrl: Yup.string().url("Invalid URL").nullable().optional(),
//   interestedNewCareer: Yup.string().optional(),
//   featuredArticle: Yup.string().optional(),
//   mentorMotivation: Yup.string().optional(),
//   shortInfo: Yup.string().optional(),
//   skills: Yup.array().of(Yup.string()).optional(),
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
// const EditableField: React.FC<EditableFieldProps> = ({
//   label,
//   field,
//   value,
//   workAs,
//   onEdit,
//   isEditing = false,
//   onSave,
//   onCancel,
//   onChange,
//   type = "text",
// }) => {
//   const [error, setError] = useState<string | null>(null);

//   const handleSaveWithValidation = async () => {
//     try {
//       await profileSchema.validateAt(field, {
//         [field]: value,
//         workAs: workAs,
//       });
//       setError(null);
//       onSave?.();
//     } catch (err) {
//       if (err instanceof Yup.ValidationError) {
//         setError(err.message);
//       } else {
//         console.error(err);
//       }
//     }
//   };

//   return (
//     <div className="mb-6">
//       <div className="flex justify-between items-center mb-2">
//         <label className="text-sm font-medium">{label}</label>
//         {!isEditing ? (
//           <button
//             onClick={onEdit}
//             className="text-sm text-black hover:underline"
//           >
//             Edit
//           </button>
//         ) : (
//           <div className="flex gap-2">
//             <button
//               onClick={handleSaveWithValidation}
//               className="text-sm text-green-600 hover:underline"
//             >
//               Save
//             </button>
//             <button
//               onClick={onCancel}
//               className="text-sm text-red-600 hover:underline"
//             >
//               Cancel
//             </button>
//           </div>
//         )}
//       </div>
//       <Input
//         type={type}
//         value={value}
//         onChange={(e) => onChange && onChange(e.target.value)}
//         readOnly={!isEditing}
//         className="w-full bg-white"
//       />
//       {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
//     </div>
//   );
// };
// const menteeSchema = Yup.object().shape({
//   schoolName: Yup.string().when("category", {
//     is: "school",
//     then: (schema) => schema.required("School name is required"),
//     otherwise: (schema) => schema.optional(),
//   }),
//   class: Yup.string().when("category", {
//     is: "school",
//     then: (schema) => schema.required("Class is required"),
//     otherwise: (schema) => schema.optional(),
//   }),
//   course: Yup.string().when("category", {
//     is: (val) => ["college", "fresher"].includes(val),
//     then: (schema) => schema.required("Course is required"),
//     otherwise: (schema) => schema.optional(),
//   }),
//   college: Yup.string().when("category", {
//     is: (val) => ["college", "fresher"].includes(val),
//     then: (schema) => schema.required("College is required"),
//     otherwise: (schema) => schema.optional(),
//   }),
//   jobRole: Yup.string().when("category", {
//     is: "professional",
//     then: (schema) => schema.required("Job role is required"),
//     otherwise: (schema) => schema.optional(),
//   }),
//   company: Yup.string().when("category", {
//     is: "professional",
//     then: (schema) => schema.required("Company is required"),
//     otherwise: (schema) => schema.optional(),
//   }),
//   totalExperience: Yup.string().when("category", {
//     is: "professional",
//     then: (schema) => schema.required("Experience is required"),
//     otherwise: (schema) => schema.optional(),
//   }),
//   city: Yup.string().required("City is required"),
//   startYear: Yup.string().optional(),
//   endYear: Yup.string().optional(),
//   currentlyWorking: Yup.boolean().optional(),
// });
// // Main MenteeProfile component
// const MenteeProfile: React.FC = () => {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [editingField, setEditingField] = useState<string | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [isImageLoading, setIsImageLoading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [skillSearchTerm, setSkillSearchTerm] = useState("");
//   const [showSkillDropdown, setShowSkillDropdown] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [originalValues, setOriginalValues] = useState<{
//     [key: string]: string;
//   }>({});
//   const [historyErrors, setHistoryErrors] = useState<Record<string, string>>(
//     {}
//   );
//   const [isHistoryFormValid, setIsHistoryFormValid] = useState(false);
//   const [menteeErrors, setMenteeErrors] = useState<Record<string, string>>({});
//   const [isMenteeFormValid, setIsMenteeFormValid] = useState(false);
//   const dispatch = useDispatch();
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isFormValid, setIsFormValid] = useState(false);
//   const [isEditingMentee, setIsEditingMentee] = useState(false);
//   const [menteeData, setMenteeData] = useState({
//     schoolName: "",
//     class: "",
//     course: "",
//     college: "",
//     city: "",
//     jobRole: "",
//     company: "",
//     totalExperience: "",
//     startYear: "",
//     endYear: "",
//     currentlyWorking: false,
//   });
//   const [history, setHistory] = useState<any[]>([]);
//   const [historyModalOpen, setHistoryModalOpen] = useState(false);
//   const [newHistoryData, setNewHistoryData] = useState({
//     schoolName: "",
//     class: "",
//     course: "",
//     college: "",
//     city: "",
//     jobRole: "",
//     company: "",
//     totalExperience: "",
//     startYear: "",
//     endYear: "",
//     currentlyWorking: false,
//   });
//   const [newHistoryType, setNewHistoryType] = useState<
//     "school" | "college" | "professional"
//   >("school");
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

//   const { user, error, loading, isAuthenticated } = useSelector(
//     (state: RootState) => state.user
//   );

//   const [profileData, setProfileData] = useState({
//     firstName: "",
//     lastName: "",
//     phone: "",
//     email: "",
//     workAs: "",
//     course: "",
//     college: "",
//     courseStart: "",
//     courseEnd: "",
//     city: "",
//     bio: "",
//     schoolName: "",
//     class: "",
//     jobRole: "",
//     company: "",
//     profilePicture: "",
//     totalExperience: "",
//     startYear: "",
//     endYear: "",
//     achievements: "",
//     linkedinUrl: "",
//     youtubeUrl: "",
//     portfolioUrl: "",
//     interestedNewCareer: "",
//     featuredArticle: "",
//     mentorMotivation: "",
//     shortInfo: "",
//     skills: [] as string[],
//   });
//   useEffect(() => {
//     const fetchUserData = async () => {
//       dispatch(setLoading(true));
//       dispatch(setError(null));
//       try {
//         const response = await userProfileData();
//         console.log("<<<<<<<<<Mnteeee response data<<<<<<<<<<<<", response);
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
//     const validateHistory = async () => {
//       try {
//         await historySchema.validate(
//           { ...newHistoryData, type: newHistoryType },
//           { abortEarly: false }
//         );
//         setHistoryErrors({});
//         setIsHistoryFormValid(true);
//       } catch (validationErrors: any) {
//         const errorObj: Record<string, string> = {};
//         validationErrors.inner.forEach((err: any) => {
//           errorObj[err.path] = err.message;
//         });
//         setHistoryErrors(errorObj);
//         setIsHistoryFormValid(false);
//       }
//     };
//     validateHistory();
//   }, [newHistoryData, newHistoryType]);
//   useEffect(() => {
//     const validateMentee = async () => {
//       try {
//         await menteeSchema.validate(
//           { ...menteeData, category: user?.category },
//           { abortEarly: false }
//         );
//         setMenteeErrors({});
//         setIsMenteeFormValid(true);
//       } catch (validationErrors: any) {
//         const errorObj: Record<string, string> = {};
//         validationErrors.inner.forEach((err: any) => {
//           errorObj[err.path] = err.message;
//         });
//         setMenteeErrors(errorObj);
//         setIsMenteeFormValid(false);
//       }
//     };
//     validateMentee();
//   }, [menteeData, user?.category]);
//   // Sync profileData with Redux user state
//   // useEffect(() => {
//   //   if (user) {
//   //     setProfileData({
//   //       firstName: user.firstName || "",
//   //       lastName: user.lastName || "",
//   //       phone: user.phone ? String(user.phone) : "",
//   //       email: user.email || "",
//   //       workAs: user?.collegeDetails?.userType || "",
//   //       course: user?.collegeDetails?.course || "",
//   //       college: user?.collegeDetails?.collegeName || "",
//   //       courseStart: user?.collegeDetails?.startDate?.slice(0, 10) || "",
//   //       courseEnd: user?.collegeDetails?.endDate?.slice(0, 10) || "",
//   //       city: user?.collegeDetails?.city || "",
//   //       bio: user?.mentorId?.bio || "",
//   //       schoolName: "",
//   //       class: "",
//   //       jobRole: "",
//   //       company: "",
//   //       totalExperience: "",
//   //       startYear: "",
//   //       endYear: "",
//   //       achievements: user?.mentorId?.achievements?.[0] || "",
//   //       linkedinUrl: "",
//   //       youtubeUrl: "",
//   //       portfolioUrl: user?.mentorId?.portfolio || "",
//   //       interestedNewCareer: user?.menteeId?.interestedNewcareer?.[0] || "",
//   //       featuredArticle: user?.mentorId?.featuredArticle || "",
//   //       mentorMotivation: user?.mentorId?.mentorMotivation || "",
//   //       shortInfo: user?.mentorId?.shortInfo || "",
//   //       skills: user?.skills || [],
//   //       profilePicture: user?.profilePicture || "",
//   //     });
//   //     setPreviewUrl(user.profilePicture || null);
//   //   }
//   // }, [user]);
//   useEffect(() => {
//     if (user) {
//       setProfileData({
//         firstName: user.firstName || "",
//         lastName: user.lastName || "",
//         phone: user.phone ? String(user.phone) : "",
//         email: user.email || "",
//         workAs: user.category || "",
//         course: user.collegeDetails?.course || "",
//         college: user.collegeDetails?.collegeName || "",
//         courseStart: user.collegeDetails?.startDate?.slice(0, 10) || "",
//         courseEnd: user.collegeDetails?.endDate?.slice(0, 10) || "",
//         city: user.collegeDetails?.city || "",
//         bio: user.mentorId?.bio || "",
//         schoolName: user.schoolDetails?.schoolName || "",
//         class: user.schoolDetails?.class || "",
//         jobRole: user.professionalDetails?.jobRole || "",
//         company: user.professionalDetails?.company || "",
//         totalExperience: user.professionalDetails?.experience || "",
//         startYear: user.professionalDetails?.startDate?.slice(0, 4) || "",
//         endYear: user.professionalDetails?.endDate?.slice(0, 4) || "",
//         achievements: user.mentorId?.achievements?.[0] || "",
//         linkedinUrl: "",
//         youtubeUrl: "",
//         portfolioUrl: user.mentorId?.portfolio || "",
//         interestedNewCareer: user?.menteeId?.interestedNewcareer?.[0] || "",
//         featuredArticle: user.mentorId?.featuredArticle || "",
//         mentorMotivation: user.mentorId?.motivation || "",
//         shortInfo: user.mentorId?.shortInfo || "",
//         skills: user.skills || [],
//         profilePicture: user.profilePicture || "",
//       });

//       // Initialize menteeData
//       setMenteeData({
//         schoolName: user.schoolDetails?.schoolName || "",
//         class: user.schoolDetails?.class || "",
//         course: user.collegeDetails?.course || "",
//         college: user.collegeDetails?.collegeName || "",
//         city:
//           user.collegeDetails?.city ||
//           user.schoolDetails?.city ||
//           user.professionalDetails?.city ||
//           "",
//         jobRole: user.professionalDetails?.jobRole || "",
//         company: user.professionalDetails?.company || "",
//         totalExperience: user.professionalDetails?.experience || "",
//         startYear:
//           user.professionalDetails?.startDate?.slice(0, 4) ||
//           user.collegeDetails?.startDate?.slice(0, 4) ||
//           user.schoolDetails?.startDate?.slice(0, 4) ||
//           "",
//         endYear:
//           user.professionalDetails?.endDate?.slice(0, 4) ||
//           user.collegeDetails?.endDate?.slice(0, 4) ||
//           user.schoolDetails?.endDate?.slice(0, 4) ||
//           "",
//         currentlyWorking: user.professionalDetails?.currentlyWorking || false,
//       });

//       // Initialize history
//       const historyEntries = [];
//       if (user.previousSchools) {
//         historyEntries.push(
//           ...user.previousSchools.map((school: any) => ({
//             ...school,
//             type: "school",
//           }))
//         );
//       }
//       if (user.previousColleges) {
//         historyEntries.push(
//           ...user.previousColleges.map((college: any) => ({
//             ...college,
//             type: "college",
//           }))
//         );
//       }
//       if (user.workHistory) {
//         historyEntries.push(
//           ...user.workHistory.map((work: any) => ({
//             ...work,
//             type: "professional",
//           }))
//         );
//       }
//       setHistory(historyEntries);

//       setPreviewUrl(user.profilePicture || null);
//     }
//   }, [user]);

//   // Update preview URL when profile picture changes
//   useEffect(() => {
//     if (user && user.profilePicture && !selectedFile) {
//       setPreviewUrl(user.profilePicture);
//     }
//   }, [user, selectedFile]);

//   useEffect(() => {
//     const validate = async () => {
//       try {
//         await passwordSchema.validate(
//           {
//             currentPassword,
//             newPassword,
//             confirmPassword,
//           },
//           { abortEarly: false }
//         );
//         setErrors({});
//         setIsFormValid(true);
//       } catch (validationErrors: any) {
//         const errorObj: Record<string, string> = {};
//         validationErrors.inner.forEach((err: any) => {
//           errorObj[err.path] = err.message;
//         });
//         setErrors(errorObj);
//         setIsFormValid(false);
//       }
//     };

//     validate();
//   }, [currentPassword, newPassword, confirmPassword]);

//   // Handle mentee data changes
//   const handleMenteeChange = (field: string, value: string | boolean) => {
//     setMenteeData((prev) => ({ ...prev, [field]: value }));
//   };

//   // Handle new history data changes
//   const handleNewHistoryChange = (field: string, value: string | boolean) => {
//     setNewHistoryData((prev) => ({ ...prev, [field]: value }));
//   };

//   // Save mentee data
//   // const handleMenteeSave = async () => {
//   //   try {
//   //     let payload: any = {};
//   //     if (user?.category === "school") {
//   //       payload = {
//   //         schoolDetails: {
//   //           schoolName: menteeData.schoolName,
//   //           class: menteeData.class,
//   //           city: menteeData.city,
//   //           startDate: menteeData.startYear,
//   //           endDate: menteeData.endYear,
//   //         },
//   //       };
//   //     } else if (user?.category === "college" || user?.category === "fresher") {
//   //       payload = {
//   //         collegeDetails: {
//   //           course: menteeData.course,
//   //           collegeName: menteeData.college,
//   //           city: menteeData.city,
//   //           startDate: menteeData.startYear,
//   //           endDate: menteeData.endYear,
//   //         },
//   //       };
//   //     } else if (user?.category === "professional") {
//   //       payload = {
//   //         professionalDetails: {
//   //           jobRole: menteeData.jobRole,
//   //           company: menteeData.company,
//   //           experience: menteeData.totalExperience,
//   //           city: menteeData.city,
//   //           startDate: menteeData.startYear,
//   //           endDate: menteeData.endYear,
//   //           currentlyWorking: menteeData.currentlyWorking,
//   //         },
//   //       };
//   //     }
//   //     await updateProfileField(user?.category || "college", payload);
//   //     setIsEditingMentee(false);
//   //     toast.success("Mentee details updated successfully");
//   //   } catch (error) {
//   //     toast.error("Failed to update mentee details");
//   //     console.error(error);
//   //   }
//   // };
//   const handleMenteeSave = async () => {
//     try {
//       await menteeSchema.validate(
//         { ...menteeData, category: user?.category },
//         { abortEarly: false }
//       );
//       let payload: any = {};
//       if (user?.category === "school") {
//         payload = {
//           schoolDetails: {
//             schoolName: menteeData.schoolName,
//             class: menteeData.class,
//             city: menteeData.city,
//             startDate: menteeData.startYear,
//             endDate: menteeData.endYear,
//           },
//         };
//       } else if (user?.category === "college" || user?.category === "fresher") {
//         payload = {
//           collegeDetails: {
//             course: menteeData.course,
//             collegeName: menteeData.college,
//             city: menteeData.city,
//             startDate: menteeData.startYear,
//             endDate: menteeData.endYear,
//           },
//         };
//       } else if (user?.category === "professional") {
//         payload = {
//           professionalDetails: {
//             jobRole: menteeData.jobRole,
//             company: menteeData.company,
//             experience: menteeData.totalExperience,
//             city: menteeData.city,
//             startDate: menteeData.startYear,
//             endDate: menteeData.endYear,
//             currentlyWorking: menteeData.currentlyWorking,
//           },
//         };
//       }
//       await updateUserProfile(payload);
//       setIsEditingMentee(false);
//       toast.success("Mentee details updated successfully");
//     } catch (error) {
//       if (error instanceof Yup.ValidationError) {
//         error.inner.forEach((err: any) => toast.error(err.message));
//       } else {
//         toast.error("Failed to update mentee details");
//         console.error(error);
//       }
//     }
//   };

//   const handleDeleteHistory = async (id: string, index: number) => {
//     try {
//       await updateUserProfile({
//         deleteHistory: { id, type: history[index].type },
//       });
//       setHistory(history.filter((_, i) => i !== index));
//       toast.success("History entry deleted successfully");
//     } catch (error) {
//       toast.error("Failed to delete history entry");
//       console.error(error);
//     }
//   };
//   // Add new history
//   // const handleAddHistory = async () => {
//   //   try {
//   //     const payload = {
//   //       addHistory: {
//   //         type: newHistoryType,
//   //         data:
//   //           newHistoryType === "school"
//   //             ? {
//   //                 schoolName: newHistoryData.schoolName,
//   //                 class: newHistoryData.class,
//   //                 city: newHistoryData.city,
//   //                 startDate: newHistoryData.startYear,
//   //                 endDate: newHistoryData.endYear,
//   //               }
//   //             : newHistoryType === "college"
//   //             ? {
//   //                 course: newHistoryData.course,
//   //                 collegeName: newHistoryData.college,
//   //                 city: newHistoryData.city,
//   //                 startDate: newHistoryData.startYear,
//   //                 endDate: newHistoryData.endYear,
//   //               }
//   //             : {
//   //                 jobRole: newHistoryData.jobRole,
//   //                 company: newHistoryData.company,
//   //                 experience: newHistoryData.totalExperience,
//   //                 city: newHistoryData.city,
//   //                 startDate: newHistoryData.startYear,
//   //                 endDate: newHistoryData.endYear,
//   //                 currentlyWorking: newHistoryData.currentlyWorking,
//   //               },
//   //       },
//   //     };
//   //     await updateProfileField("addHistory", payload);
//   //     setHistoryModalOpen(false);
//   //     setNewHistoryData({
//   //       schoolName: "",
//   //       class: "",
//   //       course: "",
//   //       college: "",
//   //       city: "",
//   //       jobRole: "",
//   //       company: "",
//   //       totalExperience: "",
//   //       startYear: "",
//   //       endYear: "",
//   //       currentlyWorking: false,
//   //     });
//   //     setNewHistoryType("school");
//   //     toast.success("History added successfully");
//   //   } catch (error) {
//   //     toast.error("Failed to add history");
//   //     console.error(error);
//   //   }
//   // };
//   const handleAddHistory = async () => {
//     try {
//       await historySchema.validate(
//         { ...newHistoryData, type: newHistoryType },
//         { abortEarly: false }
//       );
//       const payload = {
//         addHistory: {
//           type: newHistoryType,
//           data:
//             newHistoryType === "school"
//               ? {
//                   schoolName: newHistoryData.schoolName,
//                   class: newHistoryData.class,
//                   city: newHistoryData.city,
//                   startDate: newHistoryData.startYear,
//                   endDate: newHistoryData.endYear,
//                 }
//               : newHistoryType === "college"
//               ? {
//                   course: newHistoryData.course,
//                   collegeName: newHistoryData.college,
//                   city: newHistoryData.city,
//                   startDate: newHistoryData.startYear,
//                   endDate: newHistoryData.endYear,
//                 }
//               : {
//                   jobRole: newHistoryData.jobRole,
//                   company: newHistoryData.company,
//                   experience: newHistoryData.totalExperience,
//                   city: newHistoryData.city,
//                   startDate: newHistoryData.startYear,
//                   endDate: newHistoryData.endYear,
//                   currentlyWorking: newHistoryData.currentlyWorking,
//                 },
//         },
//       };
//       const response = await updateUserProfile(payload);
//       setHistory((prev) => [
//         ...prev,
//         {
//           ...payload.addHistory.data,
//           type: newHistoryType,
//           _id: response.newHistoryId,
//         },
//       ]); // Assuming backend returns new ID
//       setHistoryModalOpen(false);
//       setNewHistoryData({
//         schoolName: "",
//         class: "",
//         course: "",
//         college: "",
//         city: "",
//         jobRole: "",
//         company: "",
//         totalExperience: "",
//         startYear: "",
//         endYear: "",
//         currentlyWorking: false,
//       });
//       setNewHistoryType("school");
//       toast.success("History added successfully");
//     } catch (error) {
//       if (error instanceof Yup.ValidationError) {
//         error.inner.forEach((err: any) => toast.error(err.message));
//       } else {
//         toast.error("Failed to add history");
//         console.error(error);
//       }
//     }
//   };
//   // Handle drag-and-drop
//   const onDragEnd = async (result: any) => {
//     if (!result.destination) return;
//     const reorderedHistory = Array.from(history);
//     const [movedItem] = reorderedHistory.splice(result.source.index, 1);
//     reorderedHistory.splice(result.destination.index, 0, movedItem);
//     setHistory(reorderedHistory);

//     // Update order in backend
//     const historyOrder = reorderedHistory.map((entry) => ({
//       _id: entry._id,
//       type: entry.type,
//     }));
//     try {
//       await updateProfileField("reorderHistory", {
//         reorderHistory: { historyOrder },
//       });
//       toast.success("History order updated successfully");
//     } catch (error) {
//       toast.error("Failed to update history order");
//       console.error(error);
//     }
//   };
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

//   // Save uploaded image to backend
//   const handleImageSave = async () => {
//     if (!selectedFile) {
//       toast.error("No image selected to upload");
//       return;
//     }
//     dispatch(setLoading(true));
//     try {
//       const formData = new FormData();
//       formData.append("image", selectedFile);
//       console.log("FormData entries:", [...formData.entries()]);
//       console.log("mentee rpofile poage formdata image", formData);

//       const response = await uploadProfileImage(formData);
//       console.log("response of image uplaodi us ", response);

//       const newProfilePictureUrl = response.profilePicture;
//       if (newProfilePictureUrl) {
//         setPreviewUrl(newProfilePictureUrl);
//         setProfileData((prev) => ({
//           ...prev,
//           profilePicture: newProfilePictureUrl,
//         }));
//       }
//       toast.success("Profile image uploaded successfully");
//       dispatch(setUser(response.data.data));
//       setSelectedFile(null);
//     } catch (error) {
//       toast.error("Failed to upload image");
//       console.error(error);
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   // Update profile field and send to backend
//   const updateProfileField = async (
//     field: string,
//     value: string | string[]
//   ) => {
//     try {
//       await profileSchema.validateAt(field, {
//         [field]: value,
//         workAs: profileData.workAs,
//       });
//       let payload = {};
//       if (
//         [
//           "workAs",
//           "course",
//           "college",
//           "city",
//           "courseStart",
//           "courseEnd",
//         ].includes(field)
//       ) {
//         payload = { collegeDetails: { [field]: value } };
//       } else if (
//         [
//           "bio",
//           "achievements",
//           "portfolioUrl",
//           "featuredArticle",
//           "mentorMotivation",
//           "shortInfo",
//           "skills",
//         ].includes(field)
//       ) {
//         // payload = { mentorId: { [field]: value } };
//         payload = { [field]: value };
//       } else if (field === "interestedNewCareer") {
//         payload = {
//           menteeId: {
//             interestedNewcareer: Array.isArray(value) ? value : [value],
//           },
//         };
//       } else {
//         payload = { [field]: value };
//       }
//       const updateData = await updateUserProfile(payload);
//       console.log("user data receievd>>>", updateData);

//       setProfileData((prev) => ({ ...prev, [field]: value }));
//       dispatch(setUser(updateData));
//       console.log("redux user updatd is >>>>>>>>>>>>>>>", user);

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

//   // Generate year options for dropdowns
//   const currentYear = new Date().getFullYear();
//   const yearOptions = Array.from({ length: 21 }, (_, i) =>
//     (currentYear - 20 + i).toString()
//   );

//   const handlePasswordUpdate = async () => {
//     try {
//       await passwordSchema.validate(
//         { currentPassword, newPassword, confirmPassword },
//         { abortEarly: false }
//       );

//       setIsPasswordUpdating(true);

//       const response = await updateUserPassword(currentPassword, newPassword);
//       if (response && response?.status === 200) {
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
//     } catch (error: any) {
//       if (error.name === "ValidationError") {
//         error.inner.forEach((err: any) => {
//           setError(err.message);
//           toast.error(err.message);
//         });
//       } else {
//         toast.error("An error occurred while updating password");
//         console.error(error);
//       }
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
//             {/* Short Info Editing */}
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

//       {/* Loading Modal for Image Upload */}
//       <Dialog open={isUploading} onOpenChange={setIsUploading}>
//         <DialogContent className="sm:max-w-[425px]">
//           <div className="flex flex-col items-center justify-center p-6">
//             <img
//               src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif"
//               alt="Uploading Animation"
//               className="w-32 h-32 mb-4"
//             />
//             <p className="text-lg font-semibold">Uploading your image...</p>
//             <p className="text-sm text-gray-500">
//               Please wait while this cat dances for you!
//             </p>
//           </div>
//         </DialogContent>
//       </Dialog>

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
//             <Tabs.Trigger
//               value="experience"
//               className={`pb-4 ${
//                 activeTab === "experience" ? "border-b-2 border-black" : ""
//               }`}
//             >
//               More
//             </Tabs.Trigger>
//           </Tabs.List>

//           <Tabs.Content value="overview">
//             <div className="max-w-2xl">
//               <div className="pb-6">
//                 <label htmlFor="" className="text-sm bold py-3 font-medium">
//                   Email
//                 </label>
//                 <div className="flex items-center">
//                   <p className="px-4  text-sm text-green-600">
//                     {profileData.email}
//                   </p>
//                   <CircleCheckBig
//                     size={22}
//                     color="#198041"
//                     strokeWidth={1.75}
//                   />
//                 </div>
//               </div>

//               <EditableField
//                 label="First Name"
//                 field="firstName"
//                 value={profileData.firstName}
//                 workAs={profileData.workAs}
//                 onEdit={() => handleEdit("firstName")}
//                 isEditing={editingField === "firstName"}
//                 onSave={() => handleSave("firstName", profileData.firstName)}
//                 onCancel={() => handleCancel("firstName")}
//                 onChange={(value) =>
//                   setProfileData((prev) => ({ ...prev, firstName: value }))
//                 }
//               />
//               <EditableField
//                 label="Last Name"
//                 field="lastName"
//                 value={profileData.lastName}
//                 workAs={profileData.workAs}
//                 onEdit={() => handleEdit("lastName")}
//                 isEditing={editingField === "lastName"}
//                 onSave={() => handleSave("lastName", profileData.lastName)}
//                 onCancel={() => handleCancel("lastName")}
//                 onChange={(value) =>
//                   setProfileData((prev) => ({ ...prev, lastName: value }))
//                 }
//               />
//               <EditableField
//                 label="Phone"
//                 field="phone"
//                 value={profileData.phone}
//                 workAs={profileData.workAs}
//                 onEdit={() => handleEdit("phone")}
//                 isEditing={editingField === "phone"}
//                 onSave={() => handleSave("phone", profileData.phone)}
//                 onCancel={() => handleCancel("phone")}
//                 type="tel"
//                 onChange={(value) =>
//                   setProfileData((prev) => ({ ...prev, phone: value }))
//                 }
//               />
//               {editingField === "password" ? (
//                 <div className="mb-6">
//                   <div className="mb-6">
//                     <div className="flex justify-between items-center mb-2">
//                       <label className="text-sm font-medium">Password</label>
//                     </div>
//                     <div className="space-y-4">
//                       <div className="relative">
//                         <Input
//                           type={showCurrentPassword ? "text" : "password"}
//                           placeholder="Current Password"
//                           value={currentPassword}
//                           onChange={(e) => setCurrentPassword(e.target.value)}
//                           className="w-full"
//                         />
//                         {errors.currentPassword && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errors.currentPassword}
//                           </p>
//                         )}
//                         <button
//                           type="button"
//                           onClick={() =>
//                             setShowCurrentPassword(!showCurrentPassword)
//                           }
//                           className="absolute right-2 top-2.5"
//                         >
//                           {showCurrentPassword ? (
//                             <EyeOffIcon className="h-4 w-4" />
//                           ) : (
//                             <EyeIcon className="h-4 w-4" />
//                           )}
//                         </button>
//                       </div>
//                       <div className="relative">
//                         <Input
//                           type={showNewPassword ? "text" : "password"}
//                           placeholder="New Password"
//                           value={newPassword}
//                           onChange={(e) => setNewPassword(e.target.value)}
//                           className="w-full"
//                         />

//                         <button
//                           type="button"
//                           onClick={() => setShowNewPassword(!showNewPassword)}
//                           className="absolute right-2 top-2.5"
//                         >
//                           {showNewPassword ? (
//                             <EyeOffIcon className="h-4 w-4" />
//                           ) : (
//                             <EyeIcon className="h-4 w-4" />
//                           )}
//                         </button>
//                       </div>
//                       <div className="relative">
//                         <Input
//                           type={showConfirmPassword ? "text" : "password"}
//                           placeholder="Confirm Password"
//                           value={confirmPassword}
//                           onChange={(e) => setConfirmPassword(e.target.value)}
//                           className="w-full"
//                         />
//                         <button
//                           type="button"
//                           onClick={() =>
//                             setShowConfirmPassword(!showConfirmPassword)
//                           }
//                           className="absolute right-2 top-2.5"
//                         >
//                           {showConfirmPassword ? (
//                             <EyeOffIcon className="h-4 w-4" />
//                           ) : (
//                             <EyeIcon className="h-4 w-4" />
//                           )}
//                         </button>
//                       </div>
//                       {/* Inline error message */}
//                       {errors.confirmPassword && (
//                         <p className="text-xs text-red-500 mt-1">
//                           {errors.confirmPassword}
//                         </p>
//                       )}

//                       <div className="flex gap-4">
//                         <Button
//                           onClick={handlePasswordUpdate}
//                           disabled={
//                             !currentPassword ||
//                             !newPassword ||
//                             !confirmPassword ||
//                             newPassword !== confirmPassword ||
//                             isPasswordUpdating ||
//                             !isFormValid
//                           }
//                           className="text-sm flex-1 text-green-600 hover:underline"
//                         >
//                           {isPasswordUpdating ? "Updating..." : "Save Password"}
//                         </Button>
//                         <button
//                           className="text-sm  flex-1 text-red-600 hover:underline"
//                           onClick={() => handleCancel("password")}
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="mb-6">
//                   <div className="flex justify-between items-center mb-2">
//                     <label className="text-sm font-medium">Password</label>
//                     <button
//                       onClick={() => handleEdit("password")}
//                       className="text-sm text-black hover:underline"
//                     >
//                       Edit
//                     </button>
//                   </div>
//                   <p className="text-sm text-gray-500">
//                     Change password atleast every month for security.
//                   </p>
//                 </div>
//               )}
//               <div className="mb-6">
//                 <div className="flex justify-between items-center mb-2">
//                   <label className="text-sm font-medium">Bio</label>
//                   {editingField === "bio" ? (
//                     <button
//                       onClick={() => handleSave("bio", profileData.bio)}
//                       className="text-sm text-green-600 hover:underline"
//                     >
//                       Save
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => handleEdit("bio")}
//                       className="text-sm text-black hover:underline"
//                     >
//                       Edit
//                     </button>
//                   )}
//                 </div>
//                 <textarea
//                   className="w-full p-2 border rounded-md h-22"
//                   placeholder="Enter about yourself"
//                   value={profileData.bio}
//                   onChange={(e) =>
//                     setProfileData((prev) => ({
//                       ...prev,
//                       bio: e.target.value,
//                     }))
//                   }
//                   readOnly={editingField !== "bio"}
//                 />
//               </div>
//             </div>
//           </Tabs.Content>

//           {/* Tab 2: As Mentee */}
//           {/* <Tabs.Content value="as-mentee">
//             <div className="max-w-2xl">
//               {user?.schoolDetails?.userType === "school" && (
//                 <>
//                   <EditableField
//                     label="School Name"
//                     field="schoolName"
//                     value={user?.schoolDetails?.schoolName}
//                     workAs={profileData.workAs}
//                     onEdit={() => handleEdit("schoolName")}
//                     isEditing={editingField === "schoolName"}
//                     onSave={() =>
//                       handleSave("schoolName", profileData.schoolName)
//                     }
//                     onChange={(value) =>
//                       setProfileData((prev) => ({ ...prev, schoolName: value }))
//                     }
//                   />
//                   <EditableField
//                     label="Class"
//                     field="class"
//                     value={user?.schoolDetails?.class}
//                     workAs={profileData.workAs}
//                     onEdit={() => handleEdit("class")}
//                     isEditing={editingField === "class"}
//                     onSave={() => handleSave("class", profileData.class)}
//                     onChange={(value) =>
//                       setProfileData((prev) => ({ ...prev, class: value }))
//                     }
//                   />
//                   <EditableField
//                     label="City"
//                     field="city"
//                     value={user?.schoolDetails?.city}
//                     workAs={profileData.workAs}
//                     onEdit={() => handleEdit("city")}
//                     isEditing={editingField === "city"}
//                     onSave={() => handleSave("city", profileData.city)}
//                     onChange={(value) =>
//                       setProfileData((prev) => ({ ...prev, city: value }))
//                     }
//                   />
//                 </>
//               )}
//               {user?.professionalDetails?.userType === "professional" && (
//                 <>
//                   <EditableField
//                     label="Job Role"
//                     field="jobRole"
//                     value={user?.professionalDetails?.jobRole}
//                     workAs={profileData.workAs}
//                     onEdit={() => handleEdit("jobRole")}
//                     isEditing={editingField === "jobRole"}
//                     onSave={() => handleSave("jobRole", profileData.jobRole)}
//                     onChange={(value) =>
//                       setProfileData((prev) => ({ ...prev, jobRole: value }))
//                     }
//                   />
//                   <EditableField
//                     label="Company"
//                     field="company"
//                     value={user?.professionalDetails?.company}
//                     workAs={profileData.workAs}
//                     onEdit={() => handleEdit("company")}
//                     isEditing={editingField === "company"}
//                     onSave={() => handleSave("company", profileData.company)}
//                     onChange={(value) =>
//                       setProfileData((prev) => ({ ...prev, company: value }))
//                     }
//                   />
//                   <EditableField
//                     label="Total Experience"
//                     field="totalExperience"
//                     value={user?.professionalDetails?.experience}
//                     workAs={profileData.workAs}
//                     onEdit={() => handleEdit("totalExperience")}
//                     isEditing={editingField === "totalExperience"}
//                     onSave={() =>
//                       handleSave("totalExperience", profileData.totalExperience)
//                     }
//                     onChange={(value) =>
//                       setProfileData((prev) => ({
//                         ...prev,
//                         totalExperience: value,
//                       }))
//                     }
//                   />
//                   <div className="mb-6">
//                     <div className="flex justify-between items-center mb-2">
//                       <label className="text-sm font-medium">Start Year</label>
//                       {editingField === "startDate" ? (
//                         <button
//                           onClick={() =>
//                             handleSave(
//                               "startDate",
//                               user?.professionalDetails?.startDate
//                             )
//                           }
//                           className="text-sm text-green-600 hover:underline"
//                         >
//                           Save
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => handleEdit("startDate")}
//                           className="text-sm text-black hover:underline"
//                         >
//                           Edit
//                         </button>
//                       )}
//                     </div>
//                     <select
//                       value={user?.professionalDetails?.startDate}
//                       onChange={(e) =>
//                         setProfileData((prev) => ({
//                           ...prev,
//                           startYear: e.target.value,
//                         }))
//                       }
//                       disabled={editingField !== "startYear"}
//                       className="w-full p-2 border rounded-md"
//                     >
//                       <option value="">Select Year</option>
//                       {yearOptions.map((year) => (
//                         <option key={year} value={year}>
//                           {year}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="mb-6">
//                     <div className="flex justify-between items-center mb-2">
//                       <label className="text-sm font-medium">End Year</label>
//                       {editingField === "endDate" ? (
//                         <button
//                           onClick={() =>
//                             handleSave(
//                               "endYear",
//                               user?.professionalDetails?.endDate
//                             )
//                           }
//                           className="text-sm text-green-600 hover:underline"
//                         >
//                           Save
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => handleEdit("endDate")}
//                           className="text-sm text-black hover:underline"
//                         >
//                           Edit
//                         </button>
//                       )}
//                     </div>
//                     <select
//                       value={user?.professionalDetails?.endDate}
//                       onChange={(e) =>
//                         setProfileData((prev) => ({
//                           ...prev,
//                           endYear: e.target.value,
//                         }))
//                       }
//                       disabled={editingField !== "endDate"}
//                       className="w-full p-2 border rounded-md"
//                     >
//                       <option value="">Select Year</option>
//                       {yearOptions.map((year) => (
//                         <option key={year} value={year}>
//                           {year}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </>
//               )}
//               {(user?.collegeDetails?.userType === "college" ||
//                 user?.collegeDetails?.userType === "fresher") && (
//                 <>
//                   <div className="mb-6">
//                     {user?.collegeDetails?.userType === "college" && (
//                       <label className="text-sm font-medium ">
//                         As a College Student{" "}
//                       </label>
//                     )}
//                     {user?.collegeDetails?.userType === "frehser" && (
//                       <label className="text-sm font-medium ">
//                         As a Fresher{" "}
//                       </label>
//                     )}
//                   </div>

//                   <div className="mb-6">
//                     <div className="flex justify-between items-center mb-2">
//                       <label className="text-sm font-medium">Course</label>
//                       {editingField === "course" ? (
//                         <button
//                           onClick={() =>
//                             handleSave("course", profileData.course)
//                           }
//                           className="text-sm text-green-600 hover:underline"
//                         >
//                           Save
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => handleEdit("course")}
//                           className="text-sm text-black hover:underline"
//                         >
//                           Edit
//                         </button>
//                       )}
//                     </div>
//                     <select
//                       value={profileData.course}
//                       onChange={(e) =>
//                         setProfileData((prev) => ({
//                           ...prev,
//                           course: e.target.value,
//                         }))
//                       }
//                       disabled={editingField !== "course"}
//                       className="text-sm w-full p-2 border rounded-md"
//                     >
//                       <option value="btech">B-Tech (Computer Science)</option>
//                       <option value="mtech">M-Tech</option>
//                     </select>
//                   </div>
//                   <EditableField
//                     label="College"
//                     field="college"
//                     value={profileData.college}
//                     workAs={profileData.workAs}
//                     onEdit={() => handleEdit("college")}
//                     isEditing={editingField === "college"}
//                     onSave={() => handleSave("college", profileData.college)}
//                     onChange={(value) =>
//                       setProfileData((prev) => ({ ...prev, college: value }))
//                     }
//                   />

//                   <EditableField
//                     label="City"
//                     field="city"
//                     value={profileData.city}
//                     workAs={profileData.workAs}
//                     onEdit={() => handleEdit("city")}
//                     isEditing={editingField === "city"}
//                     onSave={() => handleSave("city", profileData.city)}
//                     onChange={(value) =>
//                       setProfileData((prev) => ({ ...prev, city: value }))
//                     }
//                   />
//                 </>
//               )}
//             </div>
//           </Tabs.Content> */}

//           <Tabs.Content value="as-mentee">
//             <div className="max-w-2xl">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-semibold">
//                   {user?.category === "school" && "School Details"}
//                   {(user?.category === "college" ||
//                     user?.category === "fresher") &&
//                     `${
//                       user?.category === "fresher" ? "Fresher" : "College"
//                     } Details`}
//                   {user?.category === "professional" && "Professional Details"}
//                 </h2>
//                 {!isEditingMentee ? (
//                   <Button
//                     onClick={() => setIsEditingMentee(true)}
//                     className="bg-blue-600 text-white hover:bg-blue-700"
//                   >
//                     Edit
//                   </Button>
//                 ) : (
//                   <div className="space-x-2">
//                     <Button
//                       onClick={handleMenteeSave}
//                       className="bg-green-600 text-white hover:bg-green-700"
//                     >
//                       Save
//                     </Button>
//                     <Button
//                       onClick={() => setIsEditingMentee(false)}
//                       variant="outline"
//                       className="bg-white text-gray-800 hover:bg-gray-100"
//                     >
//                       Cancel
//                     </Button>
//                   </div>
//                 )}
//               </div>
//               {user?.category === "school" && (
//                 <div className="space-y-4">
//                   <div>
//                     <Label>School Name*</Label>
//                     <Input
//                       placeholder="Enter school name"
//                       value={menteeData.schoolName}
//                       onChange={(e) =>
//                         handleMenteeChange("schoolName", e.target.value)
//                       }
//                       disabled={!isEditingMentee}
//                       className="bg-white"
//                     />
//                   </div>
//                   <div>
//                     <Label>Current Class*</Label>
//                     <Select
//                       value={menteeData.class}
//                       onValueChange={(value) =>
//                         handleMenteeChange("class", value)
//                       }
//                       disabled={!isEditingMentee}
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
//                   </div>
//                   <div>
//                     <Label>City*</Label>
//                     <Input
//                       placeholder="Enter city"
//                       value={menteeData.city}
//                       onChange={(e) =>
//                         handleMenteeChange("city", e.target.value)
//                       }
//                       disabled={!isEditingMentee}
//                       className="bg-white"
//                     />
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <Label>Start Year</Label>
//                       <Select
//                         value={menteeData.startYear}
//                         onValueChange={(value) =>
//                           handleMenteeChange("startYear", value)
//                         }
//                         disabled={!isEditingMentee}
//                       >
//                         <SelectTrigger className="bg-white">
//                           <SelectValue placeholder="Select Year" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-white max-h-56 overflow-y-auto">
//                           {yearOptions.map((year) => (
//                             <SelectItem key={`start-${year}`} value={year}>
//                               {year}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div>
//                       <Label>End Year</Label>
//                       <Select
//                         value={menteeData.endYear}
//                         onValueChange={(value) =>
//                           handleMenteeChange("endYear", value)
//                         }
//                         disabled={!isEditingMentee}
//                       >
//                         <SelectTrigger className="bg-white">
//                           <SelectValue placeholder="Select Year" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-white max-h-56 overflow-y-auto">
//                           {yearOptions.map((year) => (
//                             <SelectItem key={`end-${year}`} value={year}>
//                               {year}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
//                 </div>
//               )}
//               {(user?.category === "college" ||
//                 user?.category === "fresher") && (
//                 <div className="space-y-4">
//                   <div>
//                     <Label>Course*</Label>
//                     <Select
//                       value={menteeData.course}
//                       onValueChange={(value) =>
//                         handleMenteeChange("course", value)
//                       }
//                       disabled={!isEditingMentee}
//                     >
//                       <SelectTrigger className="bg-white">
//                         <SelectValue placeholder="Select Course" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-white">
//                         <SelectItem value="btech">B.Tech</SelectItem>
//                         <SelectItem value="mtech">M.Tech</SelectItem>
//                         <SelectItem value="bsc">B.Sc</SelectItem>
//                         <SelectItem value="bca">BCA</SelectItem>
//                         <SelectItem value="mca">MCA</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div>
//                     <Label>College Name*</Label>
//                     <Input
//                       placeholder="Enter college name"
//                       value={menteeData.college}
//                       onChange={(e) =>
//                         handleMenteeChange("college", e.target.value)
//                       }
//                       disabled={!isEditingMentee}
//                       className="bg-white"
//                     />
//                   </div>
//                   <div>
//                     <Label>City*</Label>
//                     <Input
//                       placeholder="Enter city"
//                       value={menteeData.city}
//                       onChange={(e) =>
//                         handleMenteeChange("city", e.target.value)
//                       }
//                       disabled={!isEditingMentee}
//                       className="bg-white"
//                     />
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <Label>Start Year</Label>
//                       <Select
//                         value={menteeData.startYear}
//                         onValueChange={(value) =>
//                           handleMenteeChange("startYear", value)
//                         }
//                         disabled={!isEditingMentee}
//                       >
//                         <SelectTrigger className="bg-white">
//                           <SelectValue placeholder="Select Year" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-white max-h-56 overflow-y-auto">
//                           {yearOptions.map((year) => (
//                             <SelectItem key={`start-${year}`} value={year}>
//                               {year}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div>
//                       <Label>End Year</Label>
//                       <Select
//                         value={menteeData.endYear}
//                         onValueChange={(value) =>
//                           handleMenteeChange("endYear", value)
//                         }
//                         disabled={!isEditingMentee}
//                       >
//                         <SelectTrigger className="bg-white">
//                           <SelectValue placeholder="Select Year" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-white max-h-56 overflow-y-auto">
//                           {yearOptions.map((year) => (
//                             <SelectItem key={`end-${year}`} value={year}>
//                               {year}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
//                 </div>
//               )}
//               {user?.category === "professional" && (
//                 <div className="space-y-4">
//                   <div>
//                     <Label>Job Role*</Label>
//                     <Select
//                       value={menteeData.jobRole}
//                       onValueChange={(value) =>
//                         handleMenteeChange("jobRole", value)
//                       }
//                       disabled={!isEditingMentee}
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
//                   </div>
//                   <div>
//                     <Label>Company*</Label>
//                     <Input
//                       placeholder="Enter company name"
//                       value={menteeData.company}
//                       onChange={(e) =>
//                         handleMenteeChange("company", e.target.value)
//                       }
//                       disabled={!isEditingMentee}
//                       className="bg-white"
//                     />
//                   </div>
//                   <div>
//                     <Label>Total Experience*</Label>
//                     <Select
//                       value={menteeData.totalExperience}
//                       onValueChange={(value) =>
//                         handleMenteeChange("totalExperience", value)
//                       }
//                       disabled={!isEditingMentee}
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
//                   </div>
//                   <div>
//                     <Label>City*</Label>
//                     <Input
//                       placeholder="Enter city"
//                       value={menteeData.city}
//                       onChange={(e) =>
//                         handleMenteeChange("city", e.target.value)
//                       }
//                       disabled={!isEditingMentee}
//                       className="bg-white"
//                     />
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Checkbox
//                       id="currentlyWorking"
//                       checked={menteeData.currentlyWorking}
//                       onCheckedChange={(checked) =>
//                         handleMenteeChange("currentlyWorking", !!checked)
//                       }
//                       disabled={!isEditingMentee}
//                     />
//                     <label
//                       htmlFor="currentlyWorking"
//                       className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                     >
//                       Currently working in this role
//                     </label>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <Label>Start Year</Label>
//                       <Select
//                         value={menteeData.startYear}
//                         onValueChange={(value) =>
//                           handleMenteeChange("startYear", value)
//                         }
//                         disabled={!isEditingMentee}
//                       >
//                         <SelectTrigger className="bg-white">
//                           <SelectValue placeholder="Select Year" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-white max-h-56 overflow-y-auto">
//                           {yearOptions.map((year) => (
//                             <SelectItem key={`start-${year}`} value={year}>
//                               {year}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div>
//                       <Label>End Year</Label>
//                       <Select
//                         value={menteeData.endYear}
//                         onValueChange={(value) =>
//                           handleMenteeChange("endYear", value)
//                         }
//                         disabled={!isEditingMentee}
//                       >
//                         <SelectTrigger className="bg-white">
//                           <SelectValue placeholder="Select Year" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-white max-h-56 overflow-y-auto">
//                           {yearOptions.map((year) => (
//                             <SelectItem key={`end-${year}`} value={year}>
//                               {year}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
//                 </div>
//               )}
//               <div className="mt-8">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-semibold">
//                     Previous Education & Work History
//                   </h2>
//                   <Button
//                     onClick={() => setHistoryModalOpen(true)}
//                     className="bg-blue-600 text-white hover:bg-blue-700"
//                   >
//                     <PlusIcon className="w-4 h-4 mr-2" />
//                     Add History
//                   </Button>
//                 </div>
//                 <DragDropContext onDragEnd={onDragEnd}>
//                   <Droppable droppableId="history">
//                     {(provided) => (
//                       <div {...provided.droppableProps} ref={provided.innerRef}>
//                         {history.map((entry, index) => (
//                           <Draggable
//                             key={entry._id}
//                             draggableId={entry._id}
//                             index={index}
//                           >
//                             {(provided) => (
//                               <div
//                                 ref={provided.innerRef}
//                                 {...provided.draggableProps}
//                                 className="mb-4"
//                               >
//                                 <Card className="bg-white border-gray-200">
//                                   <CardHeader className="flex flex-row items-center justify-between">
//                                     <CardTitle className="text-sm font-medium capitalize">
//                                       {entry.type} Experience
//                                     </CardTitle>
//                                     <div className="flex items-center space-x-2">
//                                       <div {...provided.dragHandleProps}>
//                                         <GripVerticalIcon className="w-4 h-4 text-gray-500 cursor-pointer" />
//                                       </div>
//                                       <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={() =>
//                                           handleDeleteHistory(entry._id, index)
//                                         }
//                                       >
//                                         <XIcon className="w-4 h-4 text-red-600" />
//                                       </Button>
//                                     </div>
//                                   </CardHeader>
//                                   <CardContent>
//                                     {entry.type === "school" && (
//                                       <div className="space-y-2">
//                                         <p>
//                                           <strong>School:</strong>{" "}
//                                           {entry.schoolName}
//                                         </p>
//                                         <p>
//                                           <strong>Class:</strong> {entry.class}
//                                         </p>
//                                         <p>
//                                           <strong>City:</strong> {entry.city}
//                                         </p>
//                                         <p>
//                                           <strong>Years:</strong>{" "}
//                                           {entry.startDate?.slice(0, 4)} -{" "}
//                                           {entry.endDate?.slice(0, 4)}
//                                         </p>
//                                       </div>
//                                     )}
//                                     {entry.type === "college" && (
//                                       <div className="space-y-2">
//                                         <p>
//                                           <strong>Course:</strong>{" "}
//                                           {entry.course}
//                                         </p>
//                                         <p>
//                                           <strong>College:</strong>{" "}
//                                           {entry.collegeName}
//                                         </p>
//                                         <p>
//                                           <strong>City:</strong> {entry.city}
//                                         </p>
//                                         <p>
//                                           <strong>Years:</strong>{" "}
//                                           {entry.startDate?.slice(0, 4)} -{" "}
//                                           {entry.endDate?.slice(0, 4)}
//                                         </p>
//                                       </div>
//                                     )}
//                                     {entry.type === "professional" && (
//                                       <div className="space-y-2">
//                                         <p>
//                                           <strong>Job Role:</strong>{" "}
//                                           {entry.jobRole}
//                                         </p>
//                                         <p>
//                                           <strong>Company:</strong>{" "}
//                                           {entry.company}
//                                         </p>
//                                         <p>
//                                           <strong>Experience:</strong>{" "}
//                                           {entry.experience}
//                                         </p>
//                                         <p>
//                                           <strong>City:</strong> {entry.city}
//                                         </p>
//                                         <p>
//                                           <strong>Years:</strong>{" "}
//                                           {entry.startDate?.slice(0, 4)} -{" "}
//                                           {entry.endDate?.slice(0, 4)}
//                                         </p>
//                                         <p>
//                                           <strong>Currently Working:</strong>{" "}
//                                           {entry.currentlyWorking
//                                             ? "Yes"
//                                             : "No"}
//                                         </p>
//                                       </div>
//                                     )}
//                                   </CardContent>
//                                 </Card>
//                               </div>
//                             )}
//                           </Draggable>
//                         ))}
//                         {provided.placeholder}
//                       </div>
//                     )}
//                   </Droppable>
//                 </DragDropContext>
//               </div>
//               <Dialog
//                 open={historyModalOpen}
//                 onOpenChange={setHistoryModalOpen}
//               >
//                 <DialogContent className="sm:max-w-lg p-6 border-t-4 border-b-4 border-blue-600 rounded-lg bg-white">
//                   <div className="mb-4">
//                     <Label>History Type*</Label>
//                     <Select
//                       value={newHistoryType}
//                       onValueChange={(value) =>
//                         setNewHistoryType(
//                           value as "school" | "college" | "professional"
//                         )
//                       }
//                     >
//                       <SelectTrigger className="bg-white">
//                         <SelectValue placeholder="Select Type" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-white">
//                         <SelectItem value="school">School</SelectItem>
//                         <SelectItem value="college">College</SelectItem>
//                         <SelectItem value="professional">
//                           Professional
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   {newHistoryType === "school" && (
//                     <div className="space-y-4">
//                       <div>
//                         <Label>School Name*</Label>
//                         <Input
//                           placeholder="Enter school name"
//                           value={newHistoryData.schoolName}
//                           onChange={(e) =>
//                             handleNewHistoryChange("schoolName", e.target.value)
//                           }
//                           className="bg-white"
//                         />
//                       </div>
//                       <div>
//                         <Label>Current Class*</Label>
//                         <Select
//                           value={newHistoryData.class}
//                           onValueChange={(value) =>
//                             handleNewHistoryChange("class", value)
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
//                       </div>
//                       <div>
//                         <Label>City*</Label>
//                         <Input
//                           placeholder="Enter city"
//                           value={newHistoryData.city}
//                           onChange={(e) =>
//                             handleNewHistoryChange("city", e.target.value)
//                           }
//                           className="bg-white"
//                         />
//                       </div>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <Label>Start Year</Label>
//                           <Select
//                             value={newHistoryData.startYear}
//                             onValueChange={(value) =>
//                               handleNewHistoryChange("startYear", value)
//                             }
//                           >
//                             <SelectTrigger className="bg-white">
//                               <SelectValue placeholder="Select Year" />
//                             </SelectTrigger>
//                             <SelectContent className="bg-white max-h-56 overflow-y-auto">
//                               {yearOptions.map((year) => (
//                                 <SelectItem key={`start-${year}`} value={year}>
//                                   {year}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div>
//                           <Label>End Year</Label>
//                           <Select
//                             value={newHistoryData.endYear}
//                             onValueChange={(value) =>
//                               handleNewHistoryChange("endYear", value)
//                             }
//                           >
//                             <SelectTrigger className="bg-white">
//                               <SelectValue placeholder="Select Year" />
//                             </SelectTrigger>
//                             <SelectContent className="bg-white max-h-56 overflow-y-auto">
//                               {yearOptions.map((year) => (
//                                 <SelectItem key={`end-${year}`} value={year}>
//                                   {year}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                   {newHistoryType === "college" && (
//                     <div className="space-y-4">
//                       <div>
//                         <Label>Course*</Label>
//                         <Select
//                           value={newHistoryData.course}
//                           onValueChange={(value) =>
//                             handleNewHistoryChange("course", value)
//                           }
//                         >
//                           <SelectTrigger className="bg-white">
//                             <SelectValue placeholder="Select Course" />
//                           </SelectTrigger>
//                           <SelectContent className="bg-white">
//                             <SelectItem value="btech">B.Tech</SelectItem>
//                             <SelectItem value="mtech">M.Tech</SelectItem>
//                             <SelectItem value="bsc">B.Sc</SelectItem>
//                             <SelectItem value="bca">BCA</SelectItem>
//                             <SelectItem value="mca">MCA</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                       <div>
//                         <Label>College Name*</Label>
//                         <Input
//                           placeholder="Enter college name"
//                           value={newHistoryData.college}
//                           onChange={(e) =>
//                             handleNewHistoryChange("college", e.target.value)
//                           }
//                           className="bg-white"
//                         />
//                       </div>
//                       <div>
//                         <Label>City*</Label>
//                         <Input
//                           placeholder="Enter city"
//                           value={newHistoryData.city}
//                           onChange={(e) =>
//                             handleNewHistoryChange("city", e.target.value)
//                           }
//                           className="bg-white"
//                         />
//                       </div>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <Label>Start Year</Label>
//                           <Select
//                             value={newHistoryData.startYear}
//                             onValueChange={(value) =>
//                               handleNewHistoryChange("startYear", value)
//                             }
//                           >
//                             <SelectTrigger className="bg-white">
//                               <SelectValue placeholder="Select Year" />
//                             </SelectTrigger>
//                             <SelectContent className="bg-white max-h-56 overflow-y-auto">
//                               {yearOptions.map((year) => (
//                                 <SelectItem key={`start-${year}`} value={year}>
//                                   {year}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div>
//                           <Label>End Year</Label>
//                           <Select
//                             value={newHistoryData.endYear}
//                             onValueChange={(value) =>
//                               handleNewHistoryChange("endYear", value)
//                             }
//                           >
//                             <SelectTrigger className="bg-white">
//                               <SelectValue placeholder="Select Year" />
//                             </SelectTrigger>
//                             <SelectContent className="bg-white max-h-56 overflow-y-auto">
//                               {yearOptions.map((year) => (
//                                 <SelectItem key={`end-${year}`} value={year}>
//                                   {year}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                   {newHistoryType === "professional" && (
//                     <div className="space-y-4">
//                       <div>
//                         <Label>Job Role*</Label>
//                         <Select
//                           value={newHistoryData.jobRole}
//                           onValueChange={(value) =>
//                             handleNewHistoryChange("jobRole", value)
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
//                       </div>
//                       <div>
//                         <Label>Company*</Label>
//                         <Input
//                           placeholder="Enter company name"
//                           value={newHistoryData.company}
//                           onChange={(e) =>
//                             handleNewHistoryChange("company", e.target.value)
//                           }
//                           className="bg-white"
//                         />
//                       </div>
//                       <div>
//                         <Label>Total Experience*</Label>
//                         <Select
//                           value={newHistoryData.totalExperience}
//                           onValueChange={(value) =>
//                             handleNewHistoryChange("totalExperience", value)
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
//                       </div>
//                       <div>
//                         <Label>City*</Label>
//                         <Input
//                           placeholder="Enter city"
//                           value={newHistoryData.city}
//                           onChange={(e) =>
//                             handleNewHistoryChange("city", e.target.value)
//                           }
//                           className="bg-white"
//                         />
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Checkbox
//                           id="currentlyWorkingNew"
//                           checked={newHistoryData.currentlyWorking}
//                           onCheckedChange={(checked) =>
//                             handleNewHistoryChange(
//                               "currentlyWorking",
//                               !!checked
//                             )
//                           }
//                         />
//                         <label
//                           htmlFor="currentlyWorkingNew"
//                           className="text-sm font-medium leading-none"
//                         >
//                           Currently working in this role
//                         </label>
//                       </div>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <Label>Start Year</Label>
//                           <Select
//                             value={newHistoryData.startYear}
//                             onValueChange={(value) =>
//                               handleNewHistoryChange("startYear", value)
//                             }
//                           >
//                             <SelectTrigger className="bg-white">
//                               <SelectValue placeholder="Select Year" />
//                             </SelectTrigger>
//                             <SelectContent className="bg-white max-h-56 overflow-y-auto">
//                               {yearOptions.map((year) => (
//                                 <SelectItem key={`start-${year}`} value={year}>
//                                   {year}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div>
//                           <Label>End Year</Label>
//                           <Select
//                             value={newHistoryData.endYear}
//                             onValueChange={(value) =>
//                               handleNewHistoryChange("endYear", value)
//                             }
//                           >
//                             <SelectTrigger className="bg-white">
//                               <SelectValue placeholder="Select Year" />
//                             </SelectTrigger>
//                             <SelectContent className="bg-white max-h-56 overflow-y-auto">
//                               {yearOptions.map((year) => (
//                                 <SelectItem key={`end-${year}`} value={year}>
//                                   {year}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                   <div className="mt-4 flex justify-end space-x-2">
//                     <Button
//                       onClick={() => setHistoryModalOpen(false)}
//                       variant="outline"
//                       className="bg-white text-gray-800 hover:bg-gray-100"
//                     >
//                       Cancel
//                     </Button>
//                     <Button
//                       onClick={handleAddHistory}
//                       className="bg-blue-600 text-white hover:bg-blue-700"
//                       disabled={!isHistoryFormValid} // Assuming validation state
//                     >
//                       Add
//                     </Button>
//                   </div>
//                 </DialogContent>
//               </Dialog>
//             </div>
//           </Tabs.Content>
//           {/* Tab 3: More */}
//           <Tabs.Content value="experience">
//             <div className="max-w-2xl">
//               <EditableField
//                 label="Achievements"
//                 field="achievements"
//                 value={profileData.achievements}
//                 workAs={profileData.workAs}
//                 onEdit={() => handleEdit("achievements")}
//                 isEditing={editingField === "achievements"}
//                 onSave={() =>
//                   handleSave("achievements", profileData.achievements)
//                 }
//                 onChange={(value) =>
//                   setProfileData((prev) => ({ ...prev, achievements: value }))
//                 }
//               />

//               <EditableField
//                 label="Portfolio URL"
//                 field="portfolioUrl"
//                 value={profileData.portfolioUrl}
//                 workAs={profileData.workAs}
//                 onEdit={() => handleEdit("portfolioUrl")}
//                 isEditing={editingField === "portfolioUrl"}
//                 onSave={() =>
//                   handleSave("portfolioUrl", profileData.portfolioUrl)
//                 }
//                 onChange={(value) =>
//                   setProfileData((prev) => ({ ...prev, portfolioUrl: value }))
//                 }
//               />
//               <EditableField
//                 label="Interested New Career"
//                 field="interestedNewCareer"
//                 value={profileData.interestedNewCareer}
//                 workAs={profileData.workAs}
//                 onEdit={() => handleEdit("interestedNewCareer")}
//                 isEditing={editingField === "interestedNewCareer"}
//                 onSave={() =>
//                   handleSave(
//                     "interestedNewCareer",
//                     profileData.interestedNewCareer
//                   )
//                 }
//                 onChange={(value) =>
//                   setProfileData((prev) => ({
//                     ...prev,
//                     interestedNewCareer: value,
//                   }))
//                 }
//               />
//               <EditableField
//                 label="Featured Article"
//                 field="featuredArticle"
//                 value={profileData.featuredArticle}
//                 workAs={profileData.workAs}
//                 onEdit={() => handleEdit("featuredArticle")}
//                 isEditing={editingField === "featuredArticle"}
//                 onSave={() =>
//                   handleSave("featuredArticle", profileData.featuredArticle)
//                 }
//                 onChange={(value) =>
//                   setProfileData((prev) => ({
//                     ...prev,
//                     featuredArticle: value,
//                   }))
//                 }
//               />
//             </div>
//           </Tabs.Content>
//         </Tabs.Root>
//       </div>
//     </div>
//   );
// };

// export default MenteeProfile;
// // import React, { useState, useEffect } from "react";
// // import * as Tabs from "@radix-ui/react-tabs";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import {
// //   Pencil,
// //   UploadIcon,
// //   Loader2,
// //   HardDriveUpload,
// //   EyeIcon,
// //   EyeOffIcon,
// // } from "lucide-react";
// // import { useSelector, useDispatch } from "react-redux";
// // import { RootState } from "@/redux/store/store";
// // import { setError, setUser, setLoading } from "@/redux/slices/userSlice";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// // import { updateUserProfile } from "@/services/userServices";
// // import { uploadProfileImage } from "@/services/uploadService";
// // import { toast } from "react-hot-toast";
// // import {
// //   XIcon,
// //   SearchIcon,
// //   GripVerticalIcon,
// //   PlusIcon,
// //   CircleCheckBig,
// //   Ban,
// //   CircleDashed,
// // } from "lucide-react";
// // import { updateUserPassword } from "@/services/userServices";
// // import { Badge } from "@/components/ui/badge";
// // import { Dialog, DialogContent } from "@/components/ui/dialog";
// // import * as Yup from "yup";
// // import { userProfileData } from "@/services/menteeService";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Label } from "@/components/ui/label";
// // import { Checkbox } from "@/components/ui/checkbox";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// // // Define the EditableField component props
// // interface EditableFieldProps {
// //   label: string;
// //   field: string;
// //   value: string;
// //   workAs: string;
// //   onEdit: () => void;
// //   isEditing?: boolean;
// //   onSave?: () => void;
// //   onCancel?: () => void;
// //   onChange?: (value: string) => void;
// //   type?: string;
// // }

// // // Yup validation schema for profile fields
// // const profileSchema = Yup.object().shape({
// //   firstName: Yup.string()
// //     .required("First name is required")
// //     .min(2, "Too short")
// //     .matches(
// //       /^[A-Za-z]+$/,
// //       "First name must contain only letters (no spaces or numbers)"
// //     )
// //     .test(
// //       "no-whitespace",
// //       "First name cannot be empty or whitespace",
// //       (value) => value?.trim().length !== 0
// //     ),
// //   lastName: Yup.string()
// //     .required("Last name is required")
// //     .min(2, "Too short")
// //     .matches(
// //       /^[A-Za-z]+$/,
// //       "Last name must contain only letters (no spaces or numbers)"
// //     )
// //     .test(
// //       "no-whitespace",
// //       "Last name cannot be empty or whitespace",
// //       (value) => value?.trim().length !== 0
// //     ),
// //   phone: Yup.string()
// //     .matches(/^\d{10}$/, "Phone number must be 10 digits")
// //     .required("Phone number is required"),
// //   email: Yup.string().email("Invalid email").required("Email is required"),
// //   workAs: Yup.string().optional(),
// //   course: Yup.string().when("workAs", {
// //     is: (val: string) => ["college", "fresher"].includes(val),
// //     then: (schema) => schema.required("Course is required"),
// //     otherwise: (schema) => schema.optional(),
// //   }),
// //   college: Yup.string().when("workAs", {
// //     is: (val: string) => ["college", "fresher"].includes(val),
// //     then: (schema) => schema.required("College is required"),
// //     otherwise: (schema) => schema.optional(),
// //   }),
// //   courseStart: Yup.string().when("workAs", {
// //     is: (val: string) => ["college", "fresher"].includes(val),
// //     then: (schema) => schema.required("Start date is required"),
// //     otherwise: (schema) => schema.optional(),
// //   }),
// //   courseEnd: Yup.string().when("workAs", {
// //     is: (val: string) => ["college", "fresher"].includes(val),
// //     then: (schema) => schema.required("End date is required"),
// //     otherwise: (schema) => schema.optional(),
// //   }),
// //   city: Yup.string().required("City is required"),
// //   bio: Yup.string().max(500, "Bio must be 500 characters or less").optional(),
// //   schoolName: Yup.string().optional(),
// //   class: Yup.string().optional(),
// //   jobRole: Yup.string().optional(),
// //   company: Yup.string().optional(),
// //   totalExperience: Yup.string().optional(),
// //   startYear: Yup.string().optional(),
// //   endYear: Yup.string().optional(),
// //   achievements: Yup.string().optional(),
// //   linkedinUrl: Yup.string().url("Invalid URL").nullable().optional(),
// //   portfolioUrl: Yup.string().url("Invalid URL").nullable().optional(),
// //   interestedNewCareer: Yup.string().optional(),
// //   featuredArticle: Yup.string().optional(),
// //   mentorMotivation: Yup.string().optional(),
// //   shortInfo: Yup.string().optional(),
// //   skills: Yup.array().of(Yup.string()).optional(),
// // });

// // const passwordSchema = Yup.object().shape({
// //   currentPassword: Yup.string().required("Current password is required"),
// //   newPassword: Yup.string()
// //     .required("New password is required")
// //     .min(8, "Password must be at least 8 characters")
// //     .matches(/[A-Z]/, "Must contain at least one uppercase letter")
// //     .matches(/[a-z]/, "Must contain at least one lowercase letter")
// //     .matches(/\d/, "Must contain at least one number")
// //     .matches(/[@$!%*?&]/, "Must contain at least one special character")
// //     .test(
// //       "not-same-as-current",
// //       "New password must be different from current password",
// //       function (value) {
// //         return value !== this.parent.currentPassword;
// //       }
// //     ),
// //   confirmPassword: Yup.string()
// //     .oneOf([Yup.ref("newPassword")], "Passwords must match")
// //     .required("Please confirm your new password"),
// // });

// // // EditableField component
// // const EditableField: React.FC<EditableFieldProps> = ({
// //   label,
// //   field,
// //   value,
// //   workAs,
// //   onEdit,
// //   isEditing = false,
// //   onSave,
// //   onCancel,
// //   onChange,
// //   type = "text",
// // }) => {
// //   const [error, setError] = useState<string | null>(null);

// //   const handleSaveWithValidation = async () => {
// //     try {
// //       await profileSchema.validateAt(field, {
// //         [field]: value,
// //         workAs: workAs,
// //       });
// //       setError(null);
// //       onSave?.();
// //     } catch (err) {
// //       if (err instanceof Yup.ValidationError) {
// //         setError(err.message);
// //       } else {
// //         console.error(err);
// //       }
// //     }
// //   };

// //   return (
// //     <div className="mb-6">
// //       <div className="flex justify-between items-center mb-2">
// //         <label className="text-sm font-medium">{label}</label>
// //         {!isEditing ? (
// //           <button
// //             onClick={onEdit}
// //             className="text-sm text-black hover:underline"
// //           >
// //             Edit
// //           </button>
// //         ) : (
// //           <div className="flex gap-2">
// //             <button
// //               onClick={handleSaveWithValidation}
// //               className="text-sm text-green-600 hover:underline"
// //             >
// //               Save
// //             </button>
// //             <button
// //               onClick={onCancel}
// //               className="text-sm text-red-600 hover:underline"
// //             >
// //               Cancel
// //             </button>
// //           </div>
// //         )}
// //       </div>
// //       <Input
// //         type={type}
// //         value={value}
// //         onChange={(e) => onChange && onChange(e.target.value)}
// //         readOnly={!isEditing}
// //         className="w-full bg-white"
// //       />
// //       {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
// //     </div>
// //   );
// // };

// // // Main MenteeProfile component
// // const MenteeProfile: React.FC = () => {
// //   const [activeTab, setActiveTab] = useState("overview");
// //   const [editingField, setEditingField] = useState<string | null>(null);
// //   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
// //   const [isImageLoading, setIsImageLoading] = useState(false);
// //   const [selectedFile, setSelectedFile] = useState<File | null>(null);
// //   const [isUploading, setIsUploading] = useState(false);
// //   const [skillSearchTerm, setSkillSearchTerm] = useState("");
// //   const [showSkillDropdown, setShowSkillDropdown] = useState(false);
// //   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
// //   const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
// //   const [currentPassword, setCurrentPassword] = useState("");
// //   const [newPassword, setNewPassword] = useState("");
// //   const [confirmPassword, setConfirmPassword] = useState("");
// //   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
// //   const [showNewPassword, setShowNewPassword] = useState(false);
// //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
// //   const [originalValues, setOriginalValues] = useState<{
// //     [key: string]: string;
// //   }>({});
// //   const dispatch = useDispatch();
// //   const [errors, setErrors] = useState<Record<string, string>>({});
// //   const [isFormValid, setIsFormValid] = useState(false);
// //   const [isEditingMentee, setIsEditingMentee] = useState(false);
// //   const [menteeData, setMenteeData] = useState({
// //     schoolName: "",
// //     class: "",
// //     course: "",
// //     college: "",
// //     city: "",
// //     jobRole: "",
// //     company: "",
// //     totalExperience: "",
// //     startYear: "",
// //     endYear: "",
// //     currentlyWorking: false,
// //   });
// //   const [history, setHistory] = useState<any[]>([]);
// //   const [historyModalOpen, setHistoryModalOpen] = useState(false);
// //   const [newHistoryData, setNewHistoryData] = useState({
// //     schoolName: "",
// //     class: "",
// //     course: "",
// //     college: "",
// //     city: "",
// //     jobRole: "",
// //     company: "",
// //     totalExperience: "",
// //     startYear: "",
// //     endYear: "",
// //     currentlyWorking: false,
// //   });
// //   const [newHistoryType, setNewHistoryType] = useState<
// //     "school" | "college" | "professional"
// //   >("school");
// //   const presetSkills = [
// //     "Javascript",
// //     "Node JS",
// //     "Mongo DB",
// //     "React JS",
// //     "AWS",
// //     "Tailwind CSS",
// //     "Python",
// //     "Django",
// //     "SQL",
// //     "Docker",
// //   ];

// //   const { user, error, loading, isAuthenticated } = useSelector(
// //     (state: RootState) => state.user
// //   );

// //   const [profileData, setProfileData] = useState({
// //     firstName: "",
// //     lastName: "",
// //     phone: "",
// //     email: "",
// //     workAs: "",
// //     course: "",
// //     collegeName: "",
// //     courseStart: "",
// //     courseEnd: "",
// //     city: "",
// //     bio: "",
// //     schoolName: "",
// //     class: "",
// //     jobRole: "",
// //     company: "",
// //     profilePicture: "",
// //     totalExperience: "",
// //     startYear: "",
// //     endYear: "",
// //     achievements: "",
// //     linkedinUrl: "",
// //     youtubeUrl: "",
// //     portfolioUrl: "",
// //     interestedNewCareer: "",
// //     featuredArticle: "",
// //     mentorMotivation: "",
// //     shortInfo: "",
// //     skills: [] as string[],
// //   });
// //   useEffect(() => {
// //     const fetchUserData = async () => {
// //       dispatch(setLoading(true));
// //       dispatch(setError(null));
// //       try {
// //         const response = await userProfileData();
// //         console.log("<<<<<<<<<Menteeee response data<<<<<<<<<<<<", response);
// //         if (response) {
// //           dispatch(setUser(response));
// //         } else {
// //           dispatch(setError("Failed to fetch user data"));
// //         }
// //       } catch (err) {
// //         dispatch(setError("An error occurred while fetching user data"));
// //       } finally {
// //         dispatch(setLoading(false));
// //       }
// //     };
// //     fetchUserData();
// //   }, [dispatch]);

// //   useEffect(() => {
// //     if (user) {
// //       setProfileData({
// //         firstName: user.firstName || "",
// //         lastName: user.lastName || "",
// //         phone: user.phone ? String(user.phone) : "",
// //         email: user.email || "",
// //         workAs: user.category || "",
// //         course: user.collegeDetails?.course || "",
// //         collegeName: user.collegeDetails?.collegeName || "",
// //         courseStart: user.collegeDetails?.startDate?.slice(0, 10) || "",
// //         courseEnd: user.collegeDetails?.endDate?.slice(0, 10) || "",
// //         city: user.collegeDetails?.city || "",
// //         bio: user.mentorId?.bio || "",
// //         schoolName: user.schoolDetails?.schoolName || "",
// //         class: user.schoolDetails?.class || "",
// //         jobRole: user.professionalDetails?.jobRole || "",
// //         company: user.professionalDetails?.company || "",
// //         totalExperience: user.professionalDetails?.experience || "",
// //         startYear: user.professionalDetails?.startDate?.slice(0, 4) || "",
// //         endYear: user.professionalDetails?.endDate?.slice(0, 4) || "",
// //         achievements: user.mentorId?.achievements?.[0] || "",
// //         linkedinUrl: "",
// //         youtubeUrl: "",
// //         portfolioUrl: user.mentorId?.portfolio || "",
// //         interestedNewCareer: user?.menteeId?.interestedNewcareer?.[0] || "",
// //         featuredArticle: user.mentorId?.featuredArticle || "",
// //         mentorMotivation: user.mentorId?.motivation || "",
// //         shortInfo: user.mentorId?.shortInfo || "",
// //         skills: user.skills || [],
// //         profilePicture: user.profilePicture || "",
// //       });

// //       // Initialize menteeData
// //       setMenteeData({
// //         schoolName: user.schoolDetails?.schoolName || "",
// //         class: user.schoolDetails?.class || "",
// //         course: user.collegeDetails?.course || "",
// //         collegeName: user.collegeDetails?.collegeName || "",
// //         city:
// //           user.collegeDetails?.city ||
// //           user.schoolDetails?.city ||
// //           user.professionalDetails?.city ||
// //           "",
// //         jobRole: user.professionalDetails?.jobRole || "",
// //         company: user.professionalDetails?.company || "",
// //         totalExperience: user.professionalDetails?.experience || "",
// //         startYear:
// //           user.professionalDetails?.startDate?.slice(0, 4) ||
// //           user.collegeDetails?.startDate?.slice(0, 4) ||
// //           user.schoolDetails?.startDate?.slice(0, 4) ||
// //           "",
// //         endYear:
// //           user.professionalDetails?.endDate?.slice(0, 4) ||
// //           user.collegeDetails?.endDate?.slice(0, 4) ||
// //           user.schoolDetails?.endDate?.slice(0, 4) ||
// //           "",
// //         currentlyWorking: user.professionalDetails?.currentlyWorking || false,
// //       });

// //       // Initialize history
// //       const historyEntries = [];
// //       if (user.previousSchools) {
// //         historyEntries.push(
// //           ...user.previousSchools.map((school: any) => ({
// //             ...school,
// //             type: "school",
// //           }))
// //         );
// //       }
// //       if (user.previousColleges) {
// //         historyEntries.push(
// //           ...user.previousColleges.map((college: any) => ({
// //             ...college,
// //             type: "college",
// //           }))
// //         );
// //       }
// //       if (user.workHistory) {
// //         historyEntries.push(
// //           ...user.workHistory.map((work: any) => ({
// //             ...work,
// //             type: "professional",
// //           }))
// //         );
// //       }
// //       setHistory(historyEntries);

// //       setPreviewUrl(user.profilePicture || null);
// //     }
// //   }, [user]);

// //   // Update preview URL when profile picture changes
// //   useEffect(() => {
// //     if (user && user.profilePicture && !selectedFile) {
// //       setPreviewUrl(user.profilePicture);
// //     }
// //   }, [user, selectedFile]);

// //   useEffect(() => {
// //     const validate = async () => {
// //       try {
// //         await passwordSchema.validate(
// //           {
// //             currentPassword,
// //             newPassword,
// //             confirmPassword,
// //           },
// //           { abortEarly: false }
// //         );
// //         setErrors({});
// //         setIsFormValid(true);
// //       } catch (validationErrors: any) {
// //         const errorObj: Record<string, string> = {};
// //         validationErrors.inner.forEach((err: any) => {
// //           errorObj[err.path] = err.message;
// //         });
// //         setErrors(errorObj);
// //         setIsFormValid(false);
// //       }
// //     };

// //     validate();
// //   }, [currentPassword, newPassword, confirmPassword]);

// //   // Handle mentee data changes
// //   const handleMenteeChange = (field: string, value: string | boolean) => {
// //     setMenteeData((prev) => ({ ...prev, [field]: value }));
// //   };

// //   // Handle new history data changes
// //   const handleNewHistoryChange = (field: string, value: string | boolean) => {
// //     setNewHistoryData((prev) => ({ ...prev, [field]: value }));
// //   };

// //   // Save mentee data
// //   const handleMenteeSave = async () => {
// //     try {
// //       let payload: any = {};
// //       if (user?.category === "school") {
// //         payload = {
// //           schoolDetails: {
// //             schoolName: menteeData.schoolName,
// //             class: menteeData.class,
// //             city: menteeData.city,
// //             startDate: menteeData.startYear,
// //             endDate: menteeData.endYear,
// //           },
// //         };
// //       } else if (user?.category === "college" || user?.category === "fresher") {
// //         payload = {
// //           collegeDetails: {
// //             course: menteeData.course,
// //             collegeName: menteeData.college,
// //             city: menteeData.city,
// //             startDate: menteeData.startYear,
// //             endDate: menteeData.endYear,
// //           },
// //         };
// //       } else if (user?.category === "professional") {
// //         payload = {
// //           professionalDetails: {
// //             jobRole: menteeData.jobRole,
// //             company: menteeData.company,
// //             experience: menteeData.totalExperience,
// //             city: menteeData.city,
// //             startDate: menteeData.startYear,
// //             endDate: menteeData.endYear,
// //             currentlyWorking: menteeData.currentlyWorking,
// //           },
// //         };
// //       }
// //       await updateProfileField(user?.category || "college", payload);
// //       setIsEditingMentee(false);
// //       toast.success("Mentee details updated successfully");
// //     } catch (error) {
// //       toast.error("Failed to update mentee details");
// //       console.error(error);
// //     }
// //   };

// //   // Add new history
// //   const handleAddHistory = async () => {
// //     try {
// //       const payload = {
// //         addHistory: {
// //           type: newHistoryType,
// //           data:
// //             newHistoryType === "school"
// //               ? {
// //                   schoolName: newHistoryData.schoolName,
// //                   class: newHistoryData.class,
// //                   city: newHistoryData.city,
// //                   startDate: newHistoryData.startYear,
// //                   endDate: newHistoryData.endYear,
// //                 }
// //               : newHistoryType === "college"
// //               ? {
// //                   course: newHistoryData.course,
// //                   collegeName: newHistoryData.college,
// //                   city: newHistoryData.city,
// //                   startDate: newHistoryData.startYear,
// //                   endDate: newHistoryData.endYear,
// //                 }
// //               : {
// //                   jobRole: newHistoryData.jobRole,
// //                   company: newHistoryData.company,
// //                   experience: newHistoryData.totalExperience,
// //                   city: newHistoryData.city,
// //                   startDate: newHistoryData.startYear,
// //                   endDate: newHistoryData.endYear,
// //                   currentlyWorking: newHistoryData.currentlyWorking,
// //                 },
// //         },
// //       };
// //       await updateProfileField("addHistory", payload);
// //       setHistoryModalOpen(false);
// //       setNewHistoryData({
// //         schoolName: "",
// //         class: "",
// //         course: "",
// //         college: "",
// //         city: "",
// //         jobRole: "",
// //         company: "",
// //         totalExperience: "",
// //         startYear: "",
// //         endYear: "",
// //         currentlyWorking: false,
// //       });
// //       setNewHistoryType("school");
// //       toast.success("History added successfully");
// //     } catch (error) {
// //       toast.error("Failed to add history");
// //       console.error(error);
// //     }
// //   };

// //   // Handle drag-and-drop
// //   const onDragEnd = async (result: any) => {
// //     if (!result.destination) return;
// //     const reorderedHistory = Array.from(history);
// //     const [movedItem] = reorderedHistory.splice(result.source.index, 1);
// //     reorderedHistory.splice(result.destination.index, 0, movedItem);
// //     setHistory(reorderedHistory);

// //     // Update order in backend
// //     const historyOrder = reorderedHistory.map((entry) => ({
// //       _id: entry._id,
// //       type: entry.type,
// //     }));
// //     try {
// //       await updateProfileField("reorderHistory", {
// //         reorderHistory: { historyOrder },
// //       });
// //       toast.success("History order updated successfully");
// //     } catch (error) {
// //       toast.error("Failed to update history order");
// //       console.error(error);
// //     }
// //   };
// //   // Handle image upload
// //   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = e.target.files?.[0];
// //     if (file) {
// //       setIsImageLoading(true);
// //       setSelectedFile(file);
// //       const reader = new FileReader();
// //       reader.onloadend = () => {
// //         setPreviewUrl(reader.result as string);
// //         setIsImageLoading(false);
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   // Save uploaded image to backend
// //   const handleImageSave = async () => {
// //     if (!selectedFile) {
// //       toast.error("No image selected to upload");
// //       return;
// //     }
// //     dispatch(setLoading(true));
// //     try {
// //       const formData = new FormData();
// //       formData.append("image", selectedFile);
// //       console.log("FormData entries:", [...formData.entries()]);
// //       console.log("mentee rpofile poage formdata image", formData);

// //       const response = await uploadProfileImage(formData);
// //       console.log("response of image uplaodi us ", response);

// //       const newProfilePictureUrl = response.profilePicture;
// //       if (newProfilePictureUrl) {
// //         setPreviewUrl(newProfilePictureUrl);
// //         setProfileData((prev) => ({
// //           ...prev,
// //           profilePicture: newProfilePictureUrl,
// //         }));
// //       }
// //       toast.success("Profile image uploaded successfully");
// //       dispatch(setUser(response.data.data));
// //       setSelectedFile(null);
// //     } catch (error) {
// //       toast.error("Failed to upload image");
// //       console.error(error);
// //     } finally {
// //       dispatch(setLoading(false));
// //     }
// //   };

// //   // Update profile field and send to backend
// //   const updateProfileField = async (
// //     field: string,
// //     value: string | string[]
// //   ) => {
// //     try {
// //       await profileSchema.validateAt(field, {
// //         [field]: value,
// //         workAs: profileData.workAs,
// //       });
// //       console.log("FIELD and VLAUE", field, value);

// //       let payload = {};
// //       if (
// //         [
// //           "workAs",
// //           "course",
// //           "college",
// //           "city",
// //           "courseStart",
// //           "courseEnd",
// //         ].includes(field)
// //       ) {
// //         payload = { collegeDetails: { [field]: value } };
// //       } else if (
// //         [
// //           "bio",
// //           "achievements",
// //           "portfolioUrl",
// //           "featuredArticle",
// //           "mentorMotivation",
// //           "shortInfo",
// //           "skills",
// //         ].includes(field)
// //       ) {
// //         // payload = { mentorId: { [field]: value } };
// //         payload = { [field]: value };
// //       } else if (field === "interestedNewCareer") {
// //         payload = {
// //           menteeId: {
// //             interestedNewcareer: Array.isArray(value) ? value : [value],
// //           },
// //         };
// //       } else {
// //         payload = { [field]: value };
// //       }
// //       const updateData = await updateUserProfile(payload);
// //       console.log("user data receievd>>>", updateData);

// //       setProfileData((prev) => ({ ...prev, [field]: value }));
// //       dispatch(setUser(updateData));
// //       console.log("redux user updatd is >>>>>>>>>>>>>>>", user);

// //       toast.success(`${field} updated successfully`);
// //     } catch (error) {
// //       if (error instanceof Yup.ValidationError) {
// //         toast.error(error.message);
// //       } else {
// //         toast.error(`Failed to update ${field}`);
// //         console.error(error);
// //       }
// //     }
// //   };

// //   // Handle edit button click
// //   const handleEdit = (field: string) => {
// //     setOriginalValues((prev) => ({ ...prev, [field]: profileData[field] }));
// //     setEditingField(field);
// //   };

// //   const handleCancel = (field: string) => {
// //     setProfileData((prev) => ({ ...prev, [field]: originalValues[field] }));
// //     setEditingField(null);
// //     setCurrentPassword("");
// //     setNewPassword("");
// //     setConfirmPassword("");
// //   };
// //   // Handle save button click
// //   const handleSave = (
// //     fieldOrFields: string | { [key: string]: string },
// //     value?: string
// //   ) => {
// //     if (typeof fieldOrFields === "string") {
// //       updateProfileField(
// //         fieldOrFields,
// //         value || profileData[fieldOrFields as keyof typeof profileData]
// //       );
// //     } else if (fieldOrFields && typeof fieldOrFields === "object") {
// //       Object.entries(fieldOrFields).forEach(([key, val]) => {
// //         updateProfileField(key, val);
// //       });
// //     }
// //     setEditingField(null);
// //   };

// //   // Add a skill
// //   const addSkill = (skill: string) => {
// //     if (skill && !profileData.skills.includes(skill)) {
// //       const updatedSkills = [...profileData.skills, skill];
// //       setProfileData((prev) => ({ ...prev, skills: updatedSkills }));
// //       setSkillSearchTerm("");
// //     }
// //   };

// //   // Remove a skill

// //   const removeSkill = (index: number) => {
// //     const updatedSkills = profileData.skills.filter((_, i) => i !== index);
// //     setProfileData((prev) => ({ ...prev, skills: updatedSkills }));
// //   };

// //   // Filter skills for dropdown
// //   const filteredSkills = presetSkills.filter(
// //     (skill) =>
// //       skill.toLowerCase().includes(skillSearchTerm.toLowerCase()) &&
// //       !profileData.skills.includes(skill)
// //   );

// //   // Generate year options for dropdowns
// //   const currentYear = new Date().getFullYear();
// //   const yearOptions = Array.from({ length: 21 }, (_, i) =>
// //     (currentYear - 20 + i).toString()
// //   );

// //   const handlePasswordUpdate = async () => {
// //     try {
// //       await passwordSchema.validate(
// //         { currentPassword, newPassword, confirmPassword },
// //         { abortEarly: false }
// //       );

// //       setIsPasswordUpdating(true);

// //       const response = await updateUserPassword(currentPassword, newPassword);
// //       if (response && response?.status === 200) {
// //         toast.success(response.data.message);
// //         setCurrentPassword("");
// //         setNewPassword("");
// //         setConfirmPassword("");
// //         setShowCurrentPassword(false);
// //         setShowNewPassword(false);
// //         setShowConfirmPassword(false);
// //         setEditingField(null);
// //       } else {
// //         toast.error(response.message);
// //       }
// //     } catch (error: any) {
// //       if (error.name === "ValidationError") {
// //         error.inner.forEach((err: any) => {
// //           setError(err.message);
// //           toast.error(err.message);
// //         });
// //       } else {
// //         toast.error("An error occurred while updating password");
// //         console.error(error);
// //       }
// //     } finally {
// //       setIsPasswordUpdating(false);
// //     }
// //   };

// //   return (
// //     <div className="flex-1 px-24">
// //       {/* Profile Header */}
// //       <div className="bg-black text-white p-8 rounded-t-xl relative">
// //         <div className="flex items-end gap-6">
// //           <div className="relative">
// //             <div className="flex flex-row justify-center items-center gap-4 mb-3">
// //               <Avatar className="h-24 w-24">
// //                 {isImageLoading ? (
// //                   <AvatarFallback className="bg-gray-100 flex items-center justify-center">
// //                     <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
// //                   </AvatarFallback>
// //                 ) : previewUrl ? (
// //                   <AvatarImage src={previewUrl} />
// //                 ) : user?.profilePicture ? (
// //                   <AvatarImage src={user.profilePicture} />
// //                 ) : (
// //                   <AvatarFallback className="bg-gray-100">
// //                     <UploadIcon className="h-8 w-8 text-gray-400" />
// //                   </AvatarFallback>
// //                 )}
// //               </Avatar>
// //               <div className="flex gap-2">
// //                 <input
// //                   type="file"
// //                   accept="image/*"
// //                   onChange={handleImageUpload}
// //                   className="hidden"
// //                   id="image-upload"
// //                 />
// //                 <button
// //                   className="bg-green-500 p-1 rounded-full"
// //                   onClick={() =>
// //                     document.getElementById("image-upload")?.click()
// //                   }
// //                   disabled={isImageLoading}
// //                 >
// //                   {isImageLoading ? (
// //                     <Loader2 className="h-4 w-4 animate-spin" />
// //                   ) : (
// //                     <Pencil size={16} />
// //                   )}
// //                 </button>
// //                 {selectedFile && (
// //                   <button
// //                     className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm"
// //                     onClick={handleImageSave}
// //                     disabled={isUploading}
// //                   >
// //                     {isUploading ? "Uploading..." : "Save"}
// //                   </button>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //           <div className="relative flex-1">
// //             <h2 className="text-3xl font-bold mb-1">
// //               {user?.firstName} {user?.lastName}
// //             </h2>
// //             {/* Short Info Editing */}
// //             <div className="mt-2"></div>
// //             {/* Skills Editing */}
// //             <div className="mt-2">
// //               {editingField === "skills" ? (
// //                 <div className="flex flex-col gap-2">
// //                   <div className="flex gap-2 flex-wrap">
// //                     {profileData.skills.map((skill, index) => (
// //                       <Badge
// //                         key={index}
// //                         variant="secondary"
// //                         className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200"
// //                       >
// //                         {skill}
// //                         <XIcon
// //                           className="w-3 h-3 cursor-pointer"
// //                           onClick={() => removeSkill(index)}
// //                         />
// //                       </Badge>
// //                     ))}
// //                   </div>
// //                   <div className="flex items-center gap-2">
// //                     <div className="relative flex-1">
// //                       <Input
// //                         placeholder="Search or add a skill"
// //                         value={skillSearchTerm}
// //                         onChange={(e) => {
// //                           setSkillSearchTerm(e.target.value);
// //                           setShowSkillDropdown(true);
// //                         }}
// //                         onFocus={() => setShowSkillDropdown(true)}
// //                         className="w-full text-sm text-gray-300"
// //                       />
// //                       <SearchIcon className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
// //                       {showSkillDropdown && filteredSkills.length > 0 && (
// //                         <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
// //                           {filteredSkills.map((skill, index) => (
// //                             <div
// //                               key={index}
// //                               className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-black"
// //                               onClick={() => {
// //                                 addSkill(skill);
// //                                 setShowSkillDropdown(false);
// //                               }}
// //                             >
// //                               {skill}
// //                             </div>
// //                           ))}
// //                         </div>
// //                       )}
// //                     </div>
// //                     <button
// //                       onClick={() => handleSave("skills", profileData.skills)}
// //                       className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm"
// //                     >
// //                       Save
// //                     </button>
// //                   </div>
// //                 </div>
// //               ) : (
// //                 <div className="flex justify-between items-start">
// //                   <p
// //                     className={`text-sm ${
// //                       profileData?.skills?.length > 0
// //                         ? "text-gray-300"
// //                         : "text-gray-500 italic"
// //                     }`}
// //                   >
// //                     {profileData?.skills?.length > 0
// //                       ? profileData.skills.join(" | ")
// //                       : "Enter the Skills"}
// //                   </p>
// //                   <button
// //                     onClick={() => handleEdit("skills")}
// //                     className="ml-2 bg-green-500 p-1 rounded-full"
// //                   >
// //                     <Pencil size={16} />
// //                   </button>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Loading Modal for Image Upload */}
// //       <Dialog open={isUploading} onOpenChange={setIsUploading}>
// //         <DialogContent className="sm:max-w-[425px]">
// //           <div className="flex flex-col items-center justify-center p-6">
// //             <img
// //               src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif"
// //               alt="Uploading Animation"
// //               className="w-32 h-32 mb-4"
// //             />
// //             <p className="text-lg font-semibold">Uploading your image...</p>
// //             <p className="text-sm text-gray-500">
// //               Please wait while this cat dances for you!
// //             </p>
// //           </div>
// //         </DialogContent>
// //       </Dialog>

// //       {/* Tabs Section */}
// //       <div className="bg-white rounded-b-xl p-24 min-h-screen">
// //         <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
// //           <Tabs.List className="flex gap-8 border-b mb-8">
// //             <Tabs.Trigger
// //               value="overview"
// //               className={`pb-4 ${
// //                 activeTab === "overview" ? "border-b-2 border-black" : ""
// //               }`}
// //             >
// //               Overview
// //             </Tabs.Trigger>
// //             <Tabs.Trigger
// //               value="as-mentee"
// //               className={`pb-4 ${
// //                 activeTab === "as-mentee" ? "border-b-2 border-black" : ""
// //               }`}
// //             >
// //               As Mentee
// //             </Tabs.Trigger>
// //           </Tabs.List>

// //           {/* Tab 1: Overview */}
// //           <Tabs.Content value="overview">
// //             <div className="max-w-2xl">
// //               <div className="pb-6">
// //                 <label htmlFor="" className="text-sm bold py-3 font-medium">
// //                   Email
// //                 </label>
// //                 <div className="flex items-center">
// //                   <p className="px-4  text-sm text-green-600">
// //                     {profileData.email}
// //                   </p>
// //                   <CircleCheckBig
// //                     size={22}
// //                     color="#198041"
// //                     strokeWidth={1.75}
// //                   />
// //                 </div>
// //               </div>

// //               <EditableField
// //                 label="First Name"
// //                 field="firstName"
// //                 value={profileData.firstName}
// //                 workAs={profileData.workAs}
// //                 onEdit={() => handleEdit("firstName")}
// //                 isEditing={editingField === "firstName"}
// //                 onSave={() => handleSave("firstName", profileData.firstName)}
// //                 onCancel={() => handleCancel("firstName")}
// //                 onChange={(value) =>
// //                   setProfileData((prev) => ({ ...prev, firstName: value }))
// //                 }
// //               />
// //               <EditableField
// //                 label="Last Name"
// //                 field="lastName"
// //                 value={profileData.lastName}
// //                 workAs={profileData.workAs}
// //                 onEdit={() => handleEdit("lastName")}
// //                 isEditing={editingField === "lastName"}
// //                 onSave={() => handleSave("lastName", profileData.lastName)}
// //                 onCancel={() => handleCancel("lastName")}
// //                 onChange={(value) =>
// //                   setProfileData((prev) => ({ ...prev, lastName: value }))
// //                 }
// //               />
// //               <EditableField
// //                 label="Phone"
// //                 field="phone"
// //                 value={profileData.phone}
// //                 workAs={profileData.workAs}
// //                 onEdit={() => handleEdit("phone")}
// //                 isEditing={editingField === "phone"}
// //                 onSave={() => handleSave("phone", profileData.phone)}
// //                 onCancel={() => handleCancel("phone")}
// //                 type="tel"
// //                 onChange={(value) =>
// //                   setProfileData((prev) => ({ ...prev, phone: value }))
// //                 }
// //               />
// //               {editingField === "password" ? (
// //                 <div className="mb-6">
// //                   <div className="mb-6">
// //                     <div className="flex justify-between items-center mb-2">
// //                       <label className="text-sm font-medium">Password</label>
// //                     </div>
// //                     <div className="space-y-4">
// //                       <div className="relative">
// //                         <Input
// //                           type={showCurrentPassword ? "text" : "password"}
// //                           placeholder="Current Password"
// //                           value={currentPassword}
// //                           onChange={(e) => setCurrentPassword(e.target.value)}
// //                           className="w-full"
// //                         />
// //                         {errors.currentPassword && (
// //                           <p className="text-red-500 text-xs mt-1">
// //                             {errors.currentPassword}
// //                           </p>
// //                         )}
// //                         <button
// //                           type="button"
// //                           onClick={() =>
// //                             setShowCurrentPassword(!showCurrentPassword)
// //                           }
// //                           className="absolute right-2 top-2.5"
// //                         >
// //                           {showCurrentPassword ? (
// //                             <EyeOffIcon className="h-4 w-4" />
// //                           ) : (
// //                             <EyeIcon className="h-4 w-4" />
// //                           )}
// //                         </button>
// //                       </div>
// //                       <div className="relative">
// //                         <Input
// //                           type={showNewPassword ? "text" : "password"}
// //                           placeholder="New Password"
// //                           value={newPassword}
// //                           onChange={(e) => setNewPassword(e.target.value)}
// //                           className="w-full"
// //                         />

// //                         <button
// //                           type="button"
// //                           onClick={() => setShowNewPassword(!showNewPassword)}
// //                           className="absolute right-2 top-2.5"
// //                         >
// //                           {showNewPassword ? (
// //                             <EyeOffIcon className="h-4 w-4" />
// //                           ) : (
// //                             <EyeIcon className="h-4 w-4" />
// //                           )}
// //                         </button>
// //                       </div>
// //                       <div className="relative">
// //                         <Input
// //                           type={showConfirmPassword ? "text" : "password"}
// //                           placeholder="Confirm Password"
// //                           value={confirmPassword}
// //                           onChange={(e) => setConfirmPassword(e.target.value)}
// //                           className="w-full"
// //                         />
// //                         <button
// //                           type="button"
// //                           onClick={() =>
// //                             setShowConfirmPassword(!showConfirmPassword)
// //                           }
// //                           className="absolute right-2 top-2.5"
// //                         >
// //                           {showConfirmPassword ? (
// //                             <EyeOffIcon className="h-4 w-4" />
// //                           ) : (
// //                             <EyeIcon className="h-4 w-4" />
// //                           )}
// //                         </button>
// //                       </div>
// //                       {/* Inline error message */}
// //                       {errors.confirmPassword && (
// //                         <p className="text-xs text-red-500 mt-1">
// //                           {errors.confirmPassword}
// //                         </p>
// //                       )}

// //                       <div className="flex gap-4">
// //                         <Button
// //                           onClick={handlePasswordUpdate}
// //                           disabled={
// //                             !currentPassword ||
// //                             !newPassword ||
// //                             !confirmPassword ||
// //                             newPassword !== confirmPassword ||
// //                             isPasswordUpdating ||
// //                             !isFormValid
// //                           }
// //                           className="text-sm flex-1 text-green-600 hover:underline"
// //                         >
// //                           {isPasswordUpdating ? "Updating..." : "Save Password"}
// //                         </Button>
// //                         <button
// //                           className="text-sm  flex-1 text-red-600 hover:underline"
// //                           onClick={() => handleCancel("password")}
// //                         >
// //                           Cancel
// //                         </button>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ) : (
// //                 <div className="mb-6">
// //                   <div className="flex justify-between items-center mb-2">
// //                     <label className="text-sm font-medium">Password</label>
// //                     <button
// //                       onClick={() => handleEdit("password")}
// //                       className="text-sm text-black hover:underline"
// //                     >
// //                       Edit
// //                     </button>
// //                   </div>
// //                   <p className="text-sm text-gray-500">
// //                     {/* User Since 7:05PM, 7th March 2025 */}
// //                     Change password atleast every month for security.
// //                   </p>
// //                 </div>
// //               )}
// //               <div className="mb-6">
// //                 <div className="flex justify-between items-center mb-2">
// //                   <label className="text-sm font-medium">Bio</label>
// //                   {editingField === "bio" ? (
// //                     <button
// //                       onClick={() => handleSave("bio", profileData.bio)}
// //                       className="text-sm text-green-600 hover:underline"
// //                     >
// //                       Save
// //                     </button>
// //                   ) : (
// //                     <button
// //                       onClick={() => handleEdit("bio")}
// //                       className="text-sm text-black hover:underline"
// //                     >
// //                       Edit
// //                     </button>
// //                   )}
// //                 </div>
// //                 <textarea
// //                   className="w-full p-2 border rounded-md h-22"
// //                   placeholder="Enter about yourself"
// //                   value={profileData.bio}
// //                   onChange={(e) =>
// //                     setProfileData((prev) => ({
// //                       ...prev,
// //                       bio: e.target.value,
// //                     }))
// //                   }
// //                   readOnly={editingField !== "bio"}
// //                 />
// //               </div>
// //             </div>
// //           </Tabs.Content>

// //           {/* Tab 2: As Mentee */}
// //           <Tabs.Content value="as-mentee">
// //             <div className="max-w-2xl">
// //               {user?.schoolDetails?.userType === "school" && (
// //                 <>
// //                   <EditableField
// //                     label="School Name"
// //                     field="schoolName"
// //                     value={user?.schoolDetails?.schoolName}
// //                     workAs={profileData.workAs}
// //                     onEdit={() => handleEdit("schoolName")}
// //                     isEditing={editingField === "schoolName"}
// //                     onSave={() =>
// //                       handleSave("schoolName", profileData.schoolName)
// //                     }
// //                     onChange={(value) =>
// //                       setProfileData((prev) => ({ ...prev, schoolName: value }))
// //                     }
// //                   />
// //                   <EditableField
// //                     label="Class"
// //                     field="class"
// //                     value={user?.schoolDetails?.class}
// //                     workAs={profileData.workAs}
// //                     onEdit={() => handleEdit("class")}
// //                     isEditing={editingField === "class"}
// //                     onSave={() => handleSave("class", profileData.class)}
// //                     onChange={(value) =>
// //                       setProfileData((prev) => ({ ...prev, class: value }))
// //                     }
// //                   />
// //                   <EditableField
// //                     label="City"
// //                     field="city"
// //                     value={user?.schoolDetails?.city}
// //                     workAs={profileData.workAs}
// //                     onEdit={() => handleEdit("city")}
// //                     isEditing={editingField === "city"}
// //                     onSave={() => handleSave("city", profileData.city)}
// //                     onChange={(value) =>
// //                       setProfileData((prev) => ({ ...prev, city: value }))
// //                     }
// //                   />
// //                 </>
// //               )}
// //               {user?.professionalDetails?.userType === "professional" && (
// //                 <>
// //                   <EditableField
// //                     label="Job Role"
// //                     field="jobRole"
// //                     value={user?.professionalDetails?.jobRole}
// //                     workAs={profileData.workAs}
// //                     onEdit={() => handleEdit("jobRole")}
// //                     isEditing={editingField === "jobRole"}
// //                     onSave={() => handleSave("jobRole", profileData.jobRole)}
// //                     onChange={(value) =>
// //                       setProfileData((prev) => ({ ...prev, jobRole: value }))
// //                     }
// //                   />
// //                   <EditableField
// //                     label="Company"
// //                     field="company"
// //                     value={user?.professionalDetails?.company}
// //                     workAs={profileData.workAs}
// //                     onEdit={() => handleEdit("company")}
// //                     isEditing={editingField === "company"}
// //                     onSave={() => handleSave("company", profileData.company)}
// //                     onChange={(value) =>
// //                       setProfileData((prev) => ({ ...prev, company: value }))
// //                     }
// //                   />
// //                   <EditableField
// //                     label="Total Experience"
// //                     field="totalExperience"
// //                     value={user?.professionalDetails?.experience}
// //                     workAs={profileData.workAs}
// //                     onEdit={() => handleEdit("totalExperience")}
// //                     isEditing={editingField === "totalExperience"}
// //                     onSave={() =>
// //                       handleSave("totalExperience", profileData.totalExperience)
// //                     }
// //                     onChange={(value) =>
// //                       setProfileData((prev) => ({
// //                         ...prev,
// //                         totalExperience: value,
// //                       }))
// //                     }
// //                   />
// //                   <div className="mb-6">
// //                     <div className="flex justify-between items-center mb-2">
// //                       <label className="text-sm font-medium">Start Year</label>
// //                       {editingField === "startDate" ? (
// //                         <button
// //                           onClick={() =>
// //                             handleSave(
// //                               "startDate",
// //                               user?.professionalDetails?.startDate
// //                             )
// //                           }
// //                           className="text-sm text-green-600 hover:underline"
// //                         >
// //                           Save
// //                         </button>
// //                       ) : (
// //                         <button
// //                           onClick={() => handleEdit("startDate")}
// //                           className="text-sm text-black hover:underline"
// //                         >
// //                           Edit
// //                         </button>
// //                       )}
// //                     </div>
// //                     <select
// //                       value={user?.professionalDetails?.startDate}
// //                       onChange={(e) =>
// //                         setProfileData((prev) => ({
// //                           ...prev,
// //                           startYear: e.target.value,
// //                         }))
// //                       }
// //                       disabled={editingField !== "startYear"}
// //                       className="w-full p-2 border rounded-md"
// //                     >
// //                       <option value="">Select Year</option>
// //                       {yearOptions.map((year) => (
// //                         <option key={year} value={year}>
// //                           {year}
// //                         </option>
// //                       ))}
// //                     </select>
// //                   </div>
// //                   <div className="mb-6">
// //                     <div className="flex justify-between items-center mb-2">
// //                       <label className="text-sm font-medium">End Year</label>
// //                       {editingField === "endDate" ? (
// //                         <button
// //                           onClick={() =>
// //                             handleSave(
// //                               "endYear",
// //                               user?.professionalDetails?.endDate
// //                             )
// //                           }
// //                           className="text-sm text-green-600 hover:underline"
// //                         >
// //                           Save
// //                         </button>
// //                       ) : (
// //                         <button
// //                           onClick={() => handleEdit("endDate")}
// //                           className="text-sm text-black hover:underline"
// //                         >
// //                           Edit
// //                         </button>
// //                       )}
// //                     </div>
// //                     <select
// //                       value={user?.professionalDetails?.endDate}
// //                       onChange={(e) =>
// //                         setProfileData((prev) => ({
// //                           ...prev,
// //                           endYear: e.target.value,
// //                         }))
// //                       }
// //                       disabled={editingField !== "endDate"}
// //                       className="w-full p-2 border rounded-md"
// //                     >
// //                       <option value="">Select Year</option>
// //                       {yearOptions.map((year) => (
// //                         <option key={year} value={year}>
// //                           {year}
// //                         </option>
// //                       ))}
// //                     </select>
// //                   </div>
// //                 </>
// //               )}
// //               {(user?.collegeDetails?.userType === "college" ||
// //                 user?.collegeDetails?.userType === "fresher") && (
// //                 <>
// //                   <div className="mb-6">
// //                     {user?.collegeDetails?.userType === "frehser" && (
// //                       <label className="text-sm font-medium ">
// //                         As a Fresher{" "}
// //                       </label>
// //                     )}
// //                     {user?.collegeDetails?.userType === "college" && (
// //                       <label className="text-sm font-medium ">
// //                         As a College Student{" "}
// //                       </label>
// //                     )}
// //                   </div>

// //                   <div className="mb-6">
// //                     <div className="flex justify-between items-center mb-2">
// //                       <label className="text-sm font-medium">Course</label>
// //                       {editingField === "course" ? (
// //                         <button
// //                           onClick={() =>
// //                             handleSave("course", profileData.course)
// //                           }
// //                           className="text-sm text-green-600 hover:underline"
// //                         >
// //                           Save
// //                         </button>
// //                       ) : (
// //                         <button
// //                           onClick={() => handleEdit("course")}
// //                           className="text-sm text-black hover:underline"
// //                         >
// //                           Edit
// //                         </button>
// //                       )}
// //                     </div>
// //                     <select
// //                       value={profileData.course}
// //                       onChange={(e) =>
// //                         setProfileData((prev) => ({
// //                           ...prev,
// //                           course: e.target.value,
// //                         }))
// //                       }
// //                       disabled={editingField !== "course"}
// //                       className="text-sm w-full p-2 border rounded-md"
// //                     >
// //                       <option value="btech">B-Tech (Computer Science)</option>
// //                       <option value="mtech">M-Tech</option>
// //                     </select>
// //                   </div>
// //                   <EditableField
// //                     label="College"
// //                     field="collegeName"
// //                     value={profileData.college}
// //                     workAs={profileData.workAs}
// //                     onEdit={() => handleEdit("collegeName")}
// //                     isEditing={editingField === "collegeName"}
// //                     onSave={() =>
// //                       handleSave("collegeName", profileData.collegeName)
// //                     }
// //                     onChange={(value) =>
// //                       setProfileData((prev) => ({
// //                         ...prev,
// //                         collegeName: value,
// //                       }))
// //                     }
// //                   />

// //                   <EditableField
// //                     label="City"
// //                     field="city"
// //                     value={profileData.city}
// //                     workAs={profileData.workAs}
// //                     onEdit={() => handleEdit("city")}
// //                     isEditing={editingField === "city"}
// //                     onSave={() => handleSave("city", profileData.city)}
// //                     onChange={(value) =>
// //                       setProfileData((prev) => ({ ...prev, city: value }))
// //                     }
// //                   />
// //                   <EditableField
// //                     label="Interested New Career"
// //                     field="interestedNewCareer"
// //                     value={profileData.interestedNewCareer}
// //                     workAs={profileData.workAs}
// //                     onEdit={() => handleEdit("interestedNewCareer")}
// //                     isEditing={editingField === "interestedNewCareer"}
// //                     onSave={() =>
// //                       handleSave(
// //                         "interestedNewCareer",
// //                         profileData.interestedNewCareer
// //                       )
// //                     }
// //                     onChange={(value) =>
// //                       setProfileData((prev) => ({
// //                         ...prev,
// //                         interestedNewCareer: value,
// //                       }))
// //                     }
// //                   />
// //                 </>
// //               )}
// //             </div>
// //           </Tabs.Content>
// //         </Tabs.Root>
// //       </div>
// //     </div>
// //   );
// // };

// // export default MenteeProfile;
