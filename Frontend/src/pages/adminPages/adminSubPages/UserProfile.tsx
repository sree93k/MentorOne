// "use client";

// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import {
//   ArrowLeft,
//   Check,
//   Pencil,
//   Ban,
//   CircleCheckBig,
//   CircleDashed,
//   AlertTriangle,
// } from "lucide-react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import { setError, setLoading } from "@/redux/slices/adminSlice";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   getUserRoleData,
//   updateUserStatus,
//   updateMentorStatus,
//   blockUserWithReason,
// } from "@/services/adminService";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import ConfirmationModal from "@/components/modal/ConfirmationModal";
// import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// // FIXED: Import admin-specific ProfilePicture component
// import { AdminProfilePicture } from "@/components/admin/AdminSecureMedia";
// import { getAdminSignedUrl } from "@/services/adminMediaService";
// import BlockUserModal from "@/components/admin/BlockUserModal";
// interface UserProfileData {
//   user: {
//     _id: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//     phone?: string;
//     role: string[];
//     isBlocked: boolean;
//     createdAt: string;
//     bio?: string;
//     skills?: string[];
//     userType?: "school" | "college" | "fresher" | "professional";
//     profilePicture?: string;
//     schoolDetails?: {
//       schoolName: string;
//       class: string;
//       city: string;
//       startDate: string;
//       endDate: string;
//       userType: string;
//     };
//     collegeDetails?: {
//       collegeName: string;
//       course: string;
//       specializedIn?: string;
//       city: string;
//       startDate: string;
//       endDate: string;
//       userType: "college" | "fresher";
//     };
//     professionalDetails?: {
//       jobRole: string;
//       company: string;
//       experience: string;
//       city: string;
//       startDate: string;
//       endDate?: string;
//       currentlyWorking?: boolean;
//       userType: string;
//     }[];
//     achievements?: string;
//     linkedinUrl?: string;
//     youtubeUrl?: string;
//     portfolio?: string;
//     interestedInNewCareer?: string[];
//     featuredArticle?: string;
//     mentorMotivation?: string;
//   };
//   menteeData?: {
//     joinPurpose: string[];
//     careerGoals: string;
//     interestedNewcareer: string[];
//   } | null;
//   mentorData?: {
//     _id: string;
//     bio: string;
//     skills: string[];
//     selfIntro?: string;
//     isApproved?: string;
//     achievements?: string;
//     linkedinURL?: string;
//     youtubeURL?: string;
//     portfolio?: string;
//     interestedNewCareer?: string[];
//     featuredArticle?: string;
//     mentorMotivation?: string;
//   } | null;
//   serviceData?:
//     | {
//         _id: string;
//         mentorId: string;
//         type: string;
//         title: string;
//         technology?: string;
//         amount: number;
//         shortDescription: string;
//         duration?: number;
//         longDescription?: string;
//         oneToOneType?: string;
//         digitalProductType?: string;
//         fileUrl?: string;
//         exclusiveContent?: {
//           season: string;
//           episodes: {
//             episode: string;
//             title: string;
//             description: string;
//             videoUrl: string;
//           }[];
//         }[];
//         stats: {
//           views: number;
//           bookings: number;
//           earnings: number;
//           conversions: string;
//         };
//         createdAt: string;
//       }[]
//     | null;
//   bookingData?:
//     | {
//         _id: string;
//         serviceId: {
//           _id: string;
//           title: string;
//           technology: string;
//           amount: number;
//           type: string;
//           digitalProductType?: string;
//           oneToOneType?: string;
//         };
//         mentorId: {
//           _id: string;
//           firstName: string;
//           lastName: string;
//           profilePicture?: string;
//         };
//         menteeId: {
//           _id: string;
//           firstName: string;
//           lastName: string;
//         };
//         day: string;
//         slotIndex: number;
//         startTime: string;
//         bookingDate: string;
//         status: string;
//         paymentDetails: {
//           sessionId: string;
//           amount: number;
//           currency: string;
//           status: string;
//           createdAt: string;
//         };
//         createdAt: string;
//       }[]
//     | null;
// }

// const UserProfile: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
//   const [status, setStatus] = useState<string>("");
//   const [mentorStatus, setMentorStatus] = useState<string>("");
//   const [reason, setReason] = useState<string>("");
//   const [isEditingStatus, setIsEditingStatus] = useState(false);
//   const [isEditingMentorStatus, setIsEditingMentorStatus] = useState(false);
//   const [activeTab, setActiveTab] = useState("profile");
//   const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
//   const navigate = useNavigate();

//   // Modal states
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [confirmAction, setConfirmAction] = useState<() => void>(
//     () => () => {}
//   );
//   const [modalTitle, setModalTitle] = useState("Confirm Action");
//   const [modalDescription, setModalDescription] = useState(
//     "Are you sure you want to proceed?"
//   );

//   const dispatch = useDispatch();
//   const { error, loading } = useSelector((state: RootState) => state.admin);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       dispatch(setLoading(true));
//       dispatch(setError(null));
//       try {
//         const response = await getUserRoleData(id!);
//         console.log("**************getUserRoleData reposne ", response);

//         if (response && response.status === 200) {
//           const data = response.data.data;
//           console.log("dattas are", data);

//           setUserProfile(data);
//           setStatus(data.user.isBlocked ? "Blocked" : "Active");
//           setMentorStatus(data.mentorData?.isApproved || "N/A");
//         } else {
//           dispatch(setError("Failed to fetch user data"));
//         }
//       } catch (err) {
//         dispatch(setError("An error occurred while fetching user data"));
//         console.error("Fetch error:", err);
//       } finally {
//         dispatch(setLoading(false));
//       }
//     };
//     fetchUserData();
//   }, [id, dispatch]);

//   const handleStatusUpdate = async (blockData?: {
//     category: string;
//     reason: string;
//     adminNote?: string;
//   }) => {
//     if (!userProfile) return;

//     const newIsBlocked = status === "Blocked";

//     if (newIsBlocked !== userProfile.user.isBlocked) {
//       dispatch(setLoading(true));
//       try {
//         if (newIsBlocked && blockData) {
//           // Use enhanced blocking with reason
//           await blockUserWithReason(userProfile.user._id, blockData);
//         } else {
//           // Regular unblock
//           await updateUserStatus(userProfile.user._id, newIsBlocked);
//         }

//         setUserProfile({
//           ...userProfile,
//           user: { ...userProfile.user, isBlocked: newIsBlocked },
//         });
//         setIsEditingStatus(false);
//         setIsBlockModalOpen(false);

//         toast.success(
//           newIsBlocked
//             ? "User blocked successfully"
//             : "User unblocked successfully"
//         );
//       } catch (err: any) {
//         console.error("Status update error:", err);
//         toast.error(err.message || "Failed to update user status");
//         dispatch(setError("Failed to update user status"));
//       } finally {
//         dispatch(setLoading(false));
//       }
//     } else {
//       setIsEditingStatus(false);
//       setIsBlockModalOpen(false);
//     }
//   };

//   // Add this inside your UserProfile component, right after the useEffect that fetches user data
//   useEffect(() => {
//     console.log("🧪 DEBUG: Component mounted with userProfile:", !!userProfile);
//     if (userProfile?.user?.profilePicture) {
//       console.log(
//         "🧪 DEBUG: Testing with URL:",
//         userProfile.user.profilePicture
//       );
//       console.log("🧪 DEBUG: About to call getAdminSignedUrl...");

//       getAdminSignedUrl(userProfile.user.profilePicture)
//         .then((signedUrl) => {
//           console.log("🧪 DEBUG: Success! Signed URL:", signedUrl);
//         })
//         .catch((error) => {
//           console.error("🧪 DEBUG: Failed:", error);
//         });
//     }
//   }, [userProfile]);

//   const handleMentorStatusUpdate = async (reason: string) => {
//     if (!userProfile || !userProfile.mentorData) return;
//     const newMentorStatus = mentorStatus;
//     if (newMentorStatus !== userProfile.mentorData.isApproved) {
//       dispatch(setLoading(true));
//       try {
//         const response = await updateMentorStatus(
//           userProfile.mentorData._id,
//           newMentorStatus,
//           reason
//         );
//         setUserProfile({
//           ...userProfile,
//           mentorData: {
//             ...userProfile.mentorData,
//             isApproved: newMentorStatus,
//           },
//         });
//         setIsEditingMentorStatus(false);
//         setReason("");
//       } catch (err) {
//         dispatch(setError("Failed to update mentor status"));
//       } finally {
//         dispatch(setLoading(false));
//       }
//     } else {
//       setIsEditingMentorStatus(false);
//       setReason("");
//     }
//   };

//   if (!userProfile) return <div className="p-6">User not found</div>;

//   const { user, menteeData, mentorData, serviceData, bookingData } =
//     userProfile;

//   return (
//     <div className="flex min-h-screen flex-col pl-24">
//       <main className="flex-1">
//         <div className="max-w-6xl mx-auto p-2">
//           <div className="rounded-md border p-8 bg-white">
//             <div className="mb-6 flex items-start gap-6">
//               {/* <div className="mb-6 flex items-center">
//                 <div
//                   className="flex h-8 w-8 items-center justify-start rounded-full border"
//                   onClick={() => navigate(-1)}
//                 >
//                   <ArrowLeft className="h-6 w-8" />
//                 </div>
//               </div> */}
//               {/* <div className="space-y-2">
//                 <div className="flex items-center">
//                   <button
//                     className="flex h-10 w-10 items-center justify-center rounded-full border  border-gray-300 bg-white hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 active:scale-95 shadow-sm"
//                     onClick={() => navigate(-1)}
//                     aria-label="Go back"
//                   >
//                     <ArrowLeft className="h-5 w-5 text-gray-600 hover:text-white" />
//                   </button>
//                 </div>
//               </div> */}
//               <div className="space-y-2">
//                 <div className="flex items-center">
//                   <button
//                     className="group flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-blue-700 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 active:scale-95 shadow-sm"
//                     onClick={() => navigate(-1)}
//                     aria-label="Go back"
//                   >
//                     <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
//                   </button>
//                 </div>
//               </div>
//               {/* FIXED: Use AdminProfilePicture component for S3 images */}
//               <AdminProfilePicture
//                 profilePicture={user.profilePicture}
//                 userName={`${user.firstName} ${user.lastName}`}
//                 size="xl"
//                 className="h-24 w-24"
//               />
//               <div>
//                 <h2 className="text-xl font-semibold">{`${user.firstName} ${user.lastName}`}</h2>
//               </div>
//             </div>

//             {error && (
//               <div className="mb-4 p-4 text-red-500 bg-red-100 rounded-md">
//                 {error}
//               </div>
//             )}

//             <Tabs value={activeTab} onValueChange={setActiveTab}>
//               <TabsList className="flex justify-start gap-24 border-b mb-12">
//                 <TabsTrigger
//                   value="profile"
//                   className={`pb-2 ${
//                     activeTab === "profile"
//                       ? "border-b-2 border-black bg-green-800 text-white"
//                       : ""
//                   }`}
//                 >
//                   Profile
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="account"
//                   className={`pb-2 ${
//                     activeTab === "account"
//                       ? "border-b-2 border-black bg-green-800 text-white"
//                       : ""
//                   }`}
//                 >
//                   Account
//                 </TabsTrigger>
//                 {user.role.includes("mentor") && (
//                   <TabsTrigger
//                     value="experience"
//                     className={`pb-2 ${
//                       activeTab === "experience"
//                         ? "border-b-2 border-black bg-green-800 text-white"
//                         : ""
//                     }`}
//                   >
//                     Experience
//                   </TabsTrigger>
//                 )}
//                 {user.role.includes("mentor") && (
//                   <TabsTrigger
//                     value="services"
//                     className={`pb-2 ${
//                       activeTab === "services"
//                         ? "border-b-2 border-black bg-green-800 text-white"
//                         : ""
//                     }`}
//                   >
//                     Services
//                   </TabsTrigger>
//                 )}
//                 <TabsTrigger
//                   value="bookings"
//                   className={`pb-2 ${
//                     activeTab === "bookings"
//                       ? "border-b-2 border-black bg-green-800 text-white"
//                       : ""
//                   }`}
//                 >
//                   Bookings
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="profile">
//                 <div className="space-y-4">
//                   <div className="flex py-2">
//                     <span className="w-1/3 text-sm font-medium text-gray-500">
//                       Email ID
//                     </span>
//                     <span className="text-sm">{user.email}</span>
//                   </div>
//                   <div className="flex py-2">
//                     <span className="w-1/3 text-sm font-medium text-gray-500">
//                       Phone
//                     </span>
//                     <span className="text-sm">{user.phone || "N/A"}</span>
//                   </div>
//                   <div className="flex py-2">
//                     <span className="w-1/3 text-sm font-medium text-gray-500">
//                       Status
//                     </span>
//                     {isEditingStatus ? (
//                       // <div className="flex items-center gap-2">
//                       //   <Select value={status} onValueChange={setStatus}>
//                       //     <SelectTrigger className="h-8 w-32">
//                       //       <SelectValue placeholder="Select status" />
//                       //     </SelectTrigger>
//                       //     <SelectContent className="bg-white">
//                       //       <SelectItem value="Active">Active</SelectItem>
//                       //       <SelectItem value="Blocked">Blocked</SelectItem>
//                       //     </SelectContent>
//                       //   </Select>
//                       //   <Button
//                       //     size="icon"
//                       //     variant="ghost"
//                       //     className="h-6 w-6"
//                       //     onClick={() => {
//                       //       setModalTitle("Confirm Status Update");
//                       //       setModalDescription(
//                       //         `Are you sure you want to set the status to ${status}?`
//                       //       );
//                       //       setConfirmAction(() => handleStatusUpdate);
//                       //       setIsModalOpen(true);
//                       //     }}
//                       //   >
//                       //     <Check className="h-4 w-4" />
//                       //   </Button>
//                       // </div>
//                       <div className="flex items-center gap-2">
//                         <Select value={status} onValueChange={setStatus}>
//                           <SelectTrigger className="h-8 w-32">
//                             <SelectValue placeholder="Select status" />
//                           </SelectTrigger>
//                           <SelectContent className="bg-white">
//                             <SelectItem value="Active">Active</SelectItem>
//                             <SelectItem value="Blocked">Blocked</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         <Button
//                           size="icon"
//                           variant="ghost"
//                           className="h-6 w-6"
//                           onClick={() => {
//                             if (status === "Blocked") {
//                               // Open enhanced blocking modal
//                               setIsBlockModalOpen(true);
//                             } else {
//                               // Direct unblock
//                               setModalTitle("Confirm Status Update");
//                               setModalDescription(
//                                 `Are you sure you want to set the status to ${status}?`
//                               );
//                               setConfirmAction(
//                                 () => () => handleStatusUpdate()
//                               );
//                               setIsModalOpen(true);
//                             }
//                           }}
//                         >
//                           <Check className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     ) : (
//                       <div className="flex items-center gap-2">
//                         {status === "Active" ? (
//                           <CircleCheckBig
//                             size={28}
//                             color="#198041"
//                             strokeWidth={1.75}
//                           />
//                         ) : (
//                           <Ban size={28} color="#cc141d" strokeWidth={1.75} />
//                         )}
//                         <span className="text-sm">{status}</span>
//                         <Button
//                           size="icon"
//                           variant="ghost"
//                           className="h-6 w-6"
//                           onClick={() => setIsEditingStatus(true)}
//                         >
//                           <Pencil className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     )}
//                   </div>
//                   <div className="flex py-2">
//                     <span className="w-1/3 text-sm font-medium text-gray-500">
//                       Joined Date
//                     </span>
//                     <span className="text-sm">
//                       {new Date(user.createdAt).toLocaleString()}
//                     </span>
//                   </div>
//                   <div className="flex py-2">
//                     <span className="w-1/3 text-sm font-medium text-gray-500">
//                       Role
//                     </span>
//                     <span className="text-sm">{user.role.join(", ")}</span>
//                   </div>
//                   {user.role.includes("mentor") && (
//                     <div className="flex py-2">
//                       <span className="w-1/3 text-sm font-medium text-gray-500">
//                         Mentor Status
//                       </span>
//                       {isEditingMentorStatus ? (
//                         <div className="flex items-center gap-2">
//                           <Select
//                             value={mentorStatus}
//                             onValueChange={setMentorStatus}
//                           >
//                             <SelectTrigger className="h-8 w-32">
//                               <SelectValue placeholder="Select status" />
//                             </SelectTrigger>
//                             <SelectContent className="bg-white">
//                               <SelectItem value="Approved">Approved</SelectItem>
//                               <SelectItem value="Pending">Pending</SelectItem>
//                               <SelectItem value="Rejected">Rejected</SelectItem>
//                             </SelectContent>
//                           </Select>
//                           {(mentorStatus === "Approved" ||
//                             mentorStatus === "Rejected") && (
//                             <input
//                               type="text"
//                               placeholder="Enter reason"
//                               value={reason}
//                               onChange={(e) => setReason(e.target.value)}
//                               className="h-10 w-96 border rounded-md p-2"
//                             />
//                           )}
//                           <Button
//                             size="icon"
//                             variant="ghost"
//                             className="h-6 w-6"
//                             onClick={() => {
//                               if (
//                                 (mentorStatus === "Approved" ||
//                                   mentorStatus === "Rejected") &&
//                                 !reason.trim()
//                               ) {
//                                 toast.error(
//                                   "Please provide a reason for the status change."
//                                 );
//                                 return;
//                               }
//                               setModalTitle("Confirm Mentor Status Update");
//                               setModalDescription(
//                                 `Are you sure you want to set the mentor status to ${mentorStatus}${
//                                   reason ? ` with reason: "${reason}"` : ""
//                                 }?`
//                               );
//                               setConfirmAction(
//                                 () => () => handleMentorStatusUpdate(reason)
//                               );
//                               setIsModalOpen(true);
//                             }}
//                             disabled={
//                               (mentorStatus === "Approved" ||
//                                 mentorStatus === "Rejected") &&
//                               !reason.trim()
//                             }
//                           >
//                             <Check className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       ) : (
//                         <div className="flex items-center gap-2">
//                           {mentorStatus === "Approved" ? (
//                             <CircleCheckBig
//                               size={28}
//                               color="#198041"
//                               strokeWidth={1.75}
//                             />
//                           ) : mentorStatus === "Pending" ? (
//                             <CircleDashed
//                               size={28}
//                               color="#291aff"
//                               strokeWidth={1.75}
//                             />
//                           ) : (
//                             <Ban size={28} color="#cc141d" strokeWidth={1.75} />
//                           )}
//                           <span className="text-sm">{mentorStatus}</span>
//                           <Button
//                             size="icon"
//                             variant="ghost"
//                             className="h-6 w-6"
//                             onClick={() => setIsEditingMentorStatus(true)}
//                           >
//                             <Pencil className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                   <div>
//                     <h3 className="mb-2 text-sm font-medium text-gray-500">
//                       Bio
//                     </h3>
//                     <div className="w-full min-h-[50px] border border-gray-300 p-4 rounded-md">
//                       <p className="text-sm">
//                         {mentorData?.bio || user.bio || "N/A"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </TabsContent>

//               <TabsContent value="account">
//                 <div className="space-y-4">
//                   <div className="flex py-2">
//                     <span className="w-1/3 text-sm font-medium text-gray-500">
//                       Skills
//                     </span>
//                     <div className="flex flex-wrap gap-2">
//                       {(mentorData?.skills || user.skills || []).map(
//                         (skill: string) => (
//                           <Badge
//                             key={skill}
//                             variant="outline"
//                             className="rounded-md"
//                           >
//                             {skill}
//                           </Badge>
//                         )
//                       )}
//                     </div>
//                   </div>
//                   {userProfile.user.schoolDetails?.userType === "school" && (
//                     <>
//                       <div className="flex py-2">
//                         <span className="w-1/3 text-sm font-medium text-gray-500">
//                           School Name
//                         </span>
//                         <div className="text-sm">
//                           {user.schoolDetails.schoolName || "N/A"}
//                         </div>
//                       </div>
//                       <div className="flex py-2">
//                         <span className="w-1/3 text-sm font-medium text-gray-500">
//                           Class
//                         </span>
//                         <div className="text-sm">
//                           {user.schoolDetails.class || "N/A"}
//                         </div>
//                       </div>
//                       <div className="flex py-2">
//                         <span className="w-1/3 text-sm font-medium text-gray-500">
//                           City
//                         </span>
//                         <div className="text-sm">
//                           {user.schoolDetails.city || "N/A"}
//                         </div>
//                       </div>
//                       <div className="flex py-2">
//                         <span className="w-1/3 text-sm font-medium text-gray-500">
//                           Start Year
//                         </span>
//                         <div className="text-sm">
//                           {user.schoolDetails.startDate
//                             ? new Date(
//                                 user.schoolDetails.startDate
//                               ).getFullYear()
//                             : "N/A"}
//                         </div>
//                       </div>
//                       <div className="flex py-2">
//                         <span className="w-1/3 text-sm font-medium text-gray-500">
//                           End Year
//                         </span>
//                         <div className="text-sm">
//                           {user.schoolDetails.endDate
//                             ? new Date(user.schoolDetails.endDate).getFullYear()
//                             : "N/A"}
//                         </div>
//                       </div>
//                     </>
//                   )}
//                   {(userProfile.user.collegeDetails?.userType === "college" ||
//                     userProfile.user.collegeDetails?.userType === "fresher") &&
//                     user.collegeDetails && (
//                       <>
//                         <div className="flex py-2">
//                           <span className="w-1/3 text-sm font-medium text-gray-500">
//                             College Name
//                           </span>
//                           <div className="text-sm">
//                             {user.collegeDetails.collegeName || "N/A"}
//                           </div>
//                         </div>
//                         <div className="flex py-2">
//                           <span className="w-1/3 text-sm font-medium text-gray-500">
//                             Course
//                           </span>
//                           <div className="text-sm">
//                             {user.collegeDetails.course || "N/A"}
//                           </div>
//                         </div>
//                         <div className="flex py-2">
//                           <span className="w-1/3 text-sm font-medium text-gray-500">
//                             Specialized In
//                           </span>
//                           <div className="text-sm">
//                             {user.collegeDetails.specializedIn || "N/A"}
//                           </div>
//                         </div>
//                         <div className="flex py-2">
//                           <span className="w-1/3 text-sm font-medium text-gray-500">
//                             City
//                           </span>
//                           <div className="text-sm">
//                             {user.collegeDetails.city || "N/A"}
//                           </div>
//                         </div>
//                         <div className="flex py-2">
//                           <span className="w-1/3 text-sm font-medium text-gray-500">
//                             Start Year
//                           </span>
//                           <div className="text-sm">
//                             {user.collegeDetails.startDate
//                               ? new Date(
//                                   user.collegeDetails.startDate
//                                 ).getFullYear()
//                               : "N/A"}
//                           </div>
//                         </div>
//                         <div className="flex py-2">
//                           <span className="w-1/3 text-sm font-medium text-gray-500">
//                             End Year
//                           </span>
//                           <div className="text-sm">
//                             {user.collegeDetails.endDate
//                               ? new Date(
//                                   user.collegeDetails.endDate
//                                 ).getFullYear()
//                               : "N/A"}
//                           </div>
//                         </div>
//                       </>
//                     )}
//                   {userProfile?.user?.professionalDetails?.userType ===
//                     "professional" && (
//                     <>
//                       <div className="space-y-2 border-t pt-4">
//                         <div className="flex py-2">
//                           <span className="w-1/3 text-sm font-medium text-gray-500">
//                             Job Role
//                           </span>
//                           <div className="text-sm">
//                             {user.professionalDetails.jobRole || "N/A"}
//                           </div>
//                         </div>
//                         <div className="flex py-2">
//                           <span className="w-1/3 text-sm font-medium text-gray-500">
//                             Company
//                           </span>
//                           <div className="text-sm">
//                             {user.professionalDetails.company || "N/A"}
//                           </div>
//                         </div>
//                         <div className="flex py-2">
//                           <span className="w-1/3 text-sm font-medium text-gray-500">
//                             Total Experience
//                           </span>
//                           <div className="text-sm">
//                             {user.professionalDetails.experience || "N/A"}
//                           </div>
//                         </div>
//                         <div className="flex py-2">
//                           <span className="w-1/3 text-sm font-medium text-gray-500">
//                             City
//                           </span>
//                           <div className="text-sm">
//                             {user.professionalDetails.city || "N/A"}
//                           </div>
//                         </div>
//                         <div className="flex py-2">
//                           <span className="w-1/3 text-sm font-medium text-gray-500">
//                             Start Year
//                           </span>
//                           <div className="text-sm">
//                             {user.professionalDetails.startDate
//                               ? new Date(
//                                   user.professionalDetails.startDate
//                                 ).getFullYear()
//                               : "N/A"}
//                           </div>
//                         </div>
//                         <div className="flex py-2">
//                           <span className="w-1/3 text-sm font-medium text-gray-500">
//                             End Year
//                           </span>
//                           <div className="text-sm">
//                             {user.professionalDetails.currentlyWorking
//                               ? "Present"
//                               : user.professionalDetails.endDate
//                               ? new Date(
//                                   user.professionalDetails.endDate
//                                 ).getFullYear()
//                               : "N/A"}
//                           </div>
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </TabsContent>

//               <TabsContent value="experience">
//                 <div className="space-y-4">
//                   <div className="flex py-2">
//                     <span className="w-1/3 text-sm font-medium text-gray-500">
//                       Achievements
//                     </span>
//                     <span className="text-sm">
//                       {mentorData?.achievements || "N/A"}
//                     </span>
//                   </div>
//                   <div className="flex py-2">
//                     <span className="w-1/3 text-sm font-medium text-gray-500">
//                       Portfolio Link
//                     </span>
//                     <span className="text-sm">
//                       {mentorData?.portfolio || user.portfolio ? (
//                         <a
//                           href={mentorData?.portfolio || user.portfolio}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-600 hover:underline"
//                         >
//                           {mentorData?.portfolio || user.portfolio}
//                         </a>
//                       ) : (
//                         "N/A"
//                       )}
//                     </span>
//                   </div>
//                   <div className="flex py-2">
//                     <span className="w-1/3 text-sm font-medium text-gray-500">
//                       LinkedIn Link
//                     </span>
//                     <span className="text-sm">
//                       {mentorData?.linkedinURL ? (
//                         <a
//                           href={mentorData.linkedinURL}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-600 hover:underline"
//                         >
//                           {mentorData.linkedinURL}
//                         </a>
//                       ) : (
//                         "N/A"
//                       )}
//                     </span>
//                   </div>
//                   <div className="flex py-2">
//                     <span className="w-1/3 text-sm font-medium text-gray-500">
//                       Youtube Link
//                     </span>
//                     <span className="text-sm">
//                       {mentorData?.youtubeURL ? (
//                         <a
//                           href={mentorData.youtubeURL}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-600 hover:underline"
//                         >
//                           {mentorData.youtubeURL}
//                         </a>
//                       ) : (
//                         "N/A"
//                       )}
//                     </span>
//                   </div>
//                   <div className="flex py-2">
//                     <span className="w-1/3 text-sm font-medium text-gray-500">
//                       Featured Article
//                     </span>
//                     <span className="text-sm">
//                       {mentorData?.featuredArticle || user.featuredArticle ? (
//                         <a
//                           href={
//                             mentorData?.featuredArticle || user.featuredArticle
//                           }
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-600 hover:underline"
//                         >
//                           {mentorData?.featuredArticle || user.featuredArticle}
//                         </a>
//                       ) : (
//                         "N/A"
//                       )}
//                     </span>
//                   </div>
//                   <div className="flex py-2">
//                     <span className="w-1/3 text-sm font-medium text-gray-500">
//                       Interested New Career
//                     </span>
//                     <span className="text-sm">
//                       {mentorData?.interestedNewCareer?.length
//                         ? mentorData.interestedNewCareer.join(", ")
//                         : user.interestedInNewCareer?.length
//                         ? user.interestedInNewCareer.join(", ")
//                         : "N/A"}
//                     </span>
//                   </div>
//                   <div className="flex py-2">
//                     <span className="w-1/3 text-sm font-medium text-gray-500">
//                       Mentor Motivation
//                     </span>
//                     <span className="text-sm">
//                       {mentorData?.mentorMotivation ||
//                         user.mentorMotivation ||
//                         "N/A"}
//                     </span>
//                   </div>
//                 </div>
//               </TabsContent>

//               <TabsContent value="services">
//                 <div className="px-12">
//                   <h3 className="mb-4 text-base font-medium">Services</h3>
//                   {serviceData && serviceData.length > 0 ? (
//                     <div className="space-y-4">
//                       <table className="w-full">
//                         <thead>
//                           <tr className="border-b text-left">
//                             <th className="pb-2 text-sm font-medium">#</th>
//                             <th className="pb-2 text-sm font-medium">Date</th>
//                             <th className="pb-2 text-sm font-medium">Type</th>
//                             <th className="pb-2 text-sm font-medium">Title</th>
//                             <th className="pb-2 text-sm font-medium">
//                               Short Description
//                             </th>
//                             <th className="pb-2 text-sm font-medium">Amount</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {serviceData.map((service, index) => (
//                             <tr key={service._id} className="border-b">
//                               <td className="py-3 text-sm">{index + 1}</td>
//                               <td className="py-3 text-sm">
//                                 {new Date(
//                                   service.createdAt
//                                 ).toLocaleDateString()}
//                               </td>
//                               <td className="py-3 text-sm">{service.type}</td>
//                               <td className="py-3 text-sm">{service.title}</td>
//                               <td className="py-3 text-sm">
//                                 {service.shortDescription}
//                               </td>
//                               <td className="py-3 text-sm">
//                                 ₹ {service.amount}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     <div className="flex items-center justify-center p-6 bg-gray-100 rounded-md">
//                       <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
//                       <span className="text-sm font-medium text-gray-700">
//                         No services available
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </TabsContent>

//               <TabsContent value="bookings">
//                 <div className="px-12">
//                   <h3 className="mb-4 text-base font-medium">Bookings</h3>
//                   {bookingData && bookingData.length > 0 ? (
//                     <div className="space-y-4">
//                       <table className="w-full">
//                         <thead>
//                           <tr className="border-b text-left">
//                             <th className="pb-2 text-sm font-medium">#</th>
//                             <th className="pb-2 text-sm font-medium">Date</th>
//                             <th className="pb-2 text-sm font-medium">
//                               Mentor Name
//                             </th>
//                             <th className="pb-2 text-sm font-medium">
//                               Booking Date
//                             </th>
//                             <th className="pb-2 text-sm font-medium">Time</th>
//                             <th className="pb-2 text-sm font-medium">Status</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {bookingData.map((booking, index) => (
//                             <tr key={booking._id} className="border-b">
//                               <td className="py-3 text-sm">{index + 1}</td>
//                               <td className="py-3 text-sm">
//                                 {new Date(
//                                   booking.createdAt
//                                 ).toLocaleDateString()}
//                               </td>
//                               <td className="py-3 text-sm">{`${booking.mentorId.firstName} ${booking.mentorId.lastName}`}</td>
//                               <td className="py-3 text-sm">
//                                 {new Date(
//                                   booking.bookingDate
//                                 ).toLocaleDateString()}
//                               </td>
//                               <td className="py-3 text-sm">
//                                 {booking.startTime}
//                               </td>
//                               <td className="py-3 text-sm">{booking.status}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     <div className="flex items-center justify-center p-6 bg-gray-100 rounded-md">
//                       <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
//                       <span className="text-sm font-medium text-gray-700">
//                         No bookings available
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       </main>
//       <ConfirmationModal
//         open={isModalOpen}
//         onOpenChange={setIsModalOpen}
//         onConfirm={confirmAction}
//         title={modalTitle}
//         description={modalDescription}
//       />
//       <BlockUserModal
//         isOpen={isBlockModalOpen}
//         user={{
//           _id: user._id,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           email: user.email,
//           role: user.role,
//           createdAt: user.createdAt,
//         }}
//         onConfirm={handleStatusUpdate}
//         onCancel={() => setIsBlockModalOpen(false)}
//         isLoading={loading}
//       />
//     </div>
//   );
// };

// export default UserProfile;
"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Pencil,
  Ban,
  CircleCheckBig,
  CircleDashed,
  AlertTriangle,
  User,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  Link,
  Youtube,
  Linkedin,
  BookOpen,
  Target,
  Heart,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import { setError, setLoading } from "@/redux/slices/adminSlice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getUserRoleData,
  updateUserStatus,
  updateMentorStatus,
  blockUserWithReason,
} from "@/services/adminService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AdminProfilePicture } from "@/components/admin/AdminSecureMedia";
import { getAdminSignedUrl } from "@/services/adminMediaService";
import BlockUserModal from "@/components/admin/BlockUserModal";

interface UserProfileData {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: string[];
    isBlocked: boolean;
    createdAt: string;
    bio?: string;
    skills?: string[];
    userType?: "school" | "college" | "fresher" | "professional";
    profilePicture?: string;
    schoolDetails?: {
      schoolName: string;
      class: string;
      city: string;
      startDate: string;
      endDate: string;
      userType: string;
    };
    collegeDetails?: {
      collegeName: string;
      course: string;
      specializedIn?: string;
      city: string;
      startDate: string;
      endDate: string;
      userType: "college" | "fresher";
    };
    professionalDetails?: {
      jobRole: string;
      company: string;
      experience: string;
      city: string;
      startDate: string;
      endDate?: string;
      currentlyWorking?: boolean;
      userType: string;
    }[];
    achievements?: string;
    linkedinUrl?: string;
    youtubeUrl?: string;
    portfolio?: string;
    interestedInNewCareer?: string[];
    featuredArticle?: string;
    mentorMotivation?: string;
  };
  menteeData?: {
    joinPurpose: string[];
    careerGoals: string;
    interestedNewcareer: string[];
  } | null;
  mentorData?: {
    _id: string;
    bio: string;
    skills: string[];
    selfIntro?: string;
    isApproved?: string;
    achievements?: string;
    linkedinURL?: string;
    youtubeURL?: string;
    portfolio?: string;
    interestedNewCareer?: string[];
    featuredArticle?: string;
    mentorMotivation?: string;
  } | null;
  serviceData?:
    | {
        _id: string;
        mentorId: string;
        type: string;
        title: string;
        technology?: string;
        amount: number;
        shortDescription: string;
        duration?: number;
        longDescription?: string;
        oneToOneType?: string;
        digitalProductType?: string;
        fileUrl?: string;
        exclusiveContent?: {
          season: string;
          episodes: {
            episode: string;
            title: string;
            description: string;
            videoUrl: string;
          }[];
        }[];
        stats: {
          views: number;
          bookings: number;
          earnings: number;
          conversions: string;
        };
        createdAt: string;
      }[]
    | null;
  bookingData?:
    | {
        _id: string;
        serviceId: {
          _id: string;
          title: string;
          technology: string;
          amount: number;
          type: string;
          digitalProductType?: string;
          oneToOneType?: string;
        };
        mentorId: {
          _id: string;
          firstName: string;
          lastName: string;
          profilePicture?: string;
        };
        menteeId: {
          _id: string;
          firstName: string;
          lastName: string;
        };
        day: string;
        slotIndex: number;
        startTime: string;
        bookingDate: string;
        status: string;
        paymentDetails: {
          sessionId: string;
          amount: number;
          currency: string;
          status: string;
          createdAt: string;
        };
        createdAt: string;
      }[]
    | null;
}

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [status, setStatus] = useState<string>("");
  const [mentorStatus, setMentorStatus] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingMentorStatus, setIsEditingMentorStatus] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const navigate = useNavigate();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(
    () => () => {}
  );
  const [modalTitle, setModalTitle] = useState("Confirm Action");
  const [modalDescription, setModalDescription] = useState(
    "Are you sure you want to proceed?"
  );

  const dispatch = useDispatch();
  const { error, loading } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    const fetchUserData = async () => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const response = await getUserRoleData(id!);
        console.log("**************getUserRoleData reposne ", response);

        if (response && response.status === 200) {
          const data = response.data.data;
          console.log("dattas are", data);

          setUserProfile(data);
          setStatus(data.user.isBlocked ? "Blocked" : "Active");
          setMentorStatus(data.mentorData?.isApproved || "N/A");
        } else {
          dispatch(setError("Failed to fetch user data"));
        }
      } catch (err) {
        dispatch(setError("An error occurred while fetching user data"));
        console.error("Fetch error:", err);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchUserData();
  }, [id, dispatch]);

  const handleStatusUpdate = async (blockData?: {
    category: string;
    reason: string;
    adminNote?: string;
  }) => {
    if (!userProfile) return;

    const newIsBlocked = status === "Blocked";

    if (newIsBlocked !== userProfile.user.isBlocked) {
      dispatch(setLoading(true));
      try {
        if (newIsBlocked && blockData) {
          await blockUserWithReason(userProfile.user._id, blockData);
        } else {
          await updateUserStatus(userProfile.user._id, newIsBlocked);
        }

        setUserProfile({
          ...userProfile,
          user: { ...userProfile.user, isBlocked: newIsBlocked },
        });
        setIsEditingStatus(false);
        setIsBlockModalOpen(false);

        toast.success(
          newIsBlocked
            ? "User blocked successfully"
            : "User unblocked successfully"
        );
      } catch (err: any) {
        console.error("Status update error:", err);
        toast.error(err.message || "Failed to update user status");
        dispatch(setError("Failed to update user status"));
      } finally {
        dispatch(setLoading(false));
      }
    } else {
      setIsEditingStatus(false);
      setIsBlockModalOpen(false);
    }
  };

  useEffect(() => {
    console.log("🧪 DEBUG: Component mounted with userProfile:", !!userProfile);
    if (userProfile?.user?.profilePicture) {
      console.log(
        "🧪 DEBUG: Testing with URL:",
        userProfile.user.profilePicture
      );
      console.log("🧪 DEBUG: About to call getAdminSignedUrl...");

      getAdminSignedUrl(userProfile.user.profilePicture)
        .then((signedUrl) => {
          console.log("🧪 DEBUG: Success! Signed URL:", signedUrl);
        })
        .catch((error) => {
          console.error("🧪 DEBUG: Failed:", error);
        });
    }
  }, [userProfile]);

  const handleMentorStatusUpdate = async (reason: string) => {
    if (!userProfile || !userProfile.mentorData) return;
    const newMentorStatus = mentorStatus;
    if (newMentorStatus !== userProfile.mentorData.isApproved) {
      dispatch(setLoading(true));
      try {
        const response = await updateMentorStatus(
          userProfile.mentorData._id,
          newMentorStatus,
          reason
        );
        setUserProfile({
          ...userProfile,
          mentorData: {
            ...userProfile.mentorData,
            isApproved: newMentorStatus,
          },
        });
        setIsEditingMentorStatus(false);
        setReason("");
      } catch (err) {
        dispatch(setError("Failed to update mentor status"));
      } finally {
        dispatch(setLoading(false));
      }
    } else {
      setIsEditingMentorStatus(false);
      setReason("");
    }
  };

  if (!userProfile)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user profile...</p>
        </div>
      </div>
    );

  const { user, menteeData, mentorData, serviceData, bookingData } =
    userProfile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="pl-24">
        <main className="flex-1">
          <div className="max-w-7xl mx-auto p-6">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <button
                  className="group flex h-12 w-12 items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-blue-600 hover:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
                  onClick={() => navigate(-1)}
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    User Profile
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage user account and settings
                  </p>
                </div>
              </div>

              {/* User Header Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 h-24"></div>
                <div className="px-8 pb-8">
                  <div className="flex items-start gap-6 -mt-12">
                    <div className="relative">
                      <AdminProfilePicture
                        profilePicture={user.profilePicture}
                        userName={`${user.firstName} ${user.lastName}`}
                        size="xl"
                        className="h-24 w-24 ring-4 ring-white shadow-xl"
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full ring-4 ring-white ${
                          status === "Active" ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                    </div>
                    <div className="flex-1 pt-12">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{`${user.firstName} ${user.lastName}`}</h2>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {user.role.join(", ")}
                            </Badge>
                            <span className="text-gray-500 text-sm flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Joined{" "}
                              {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                {error}
              </div>
            )}

            {/* Tabs Section */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="bg-white rounded-xl p-2 shadow-lg border border-gray-100">
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg px-6 py-3 font-medium transition-all duration-300"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="account"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg px-6 py-3 font-medium transition-all duration-300"
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Account
                </TabsTrigger>
                {user.role.includes("mentor") && (
                  <TabsTrigger
                    value="experience"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg px-6 py-3 font-medium transition-all duration-300"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Experience
                  </TabsTrigger>
                )}
                {user.role.includes("mentor") && (
                  <TabsTrigger
                    value="services"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg px-6 py-3 font-medium transition-all duration-300"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Services
                  </TabsTrigger>
                )}
                <TabsTrigger
                  value="bookings"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg px-6 py-3 font-medium transition-all duration-300"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Bookings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Contact Information */}
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Mail className="h-5 w-5 text-blue-600" />
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {user.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {user.phone || "Not provided"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Management */}
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Account Status
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          User Status
                        </span>
                        {isEditingStatus ? (
                          <div className="flex items-center gap-2">
                            <Select value={status} onValueChange={setStatus}>
                              <SelectTrigger className="h-8 w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Blocked">Blocked</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-green-100"
                              onClick={() => {
                                if (status === "Blocked") {
                                  setIsBlockModalOpen(true);
                                } else {
                                  setModalTitle("Confirm Status Update");
                                  setModalDescription(
                                    `Are you sure you want to set the status to ${status}?`
                                  );
                                  setConfirmAction(
                                    () => () => handleStatusUpdate()
                                  );
                                  setIsModalOpen(true);
                                }
                              }}
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              {status === "Active" ? (
                                <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                                  <CircleCheckBig className="h-4 w-4" />
                                  <span className="text-sm font-medium">
                                    Active
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full">
                                  <Ban className="h-4 w-4" />
                                  <span className="text-sm font-medium">
                                    Blocked
                                  </span>
                                </div>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-blue-100"
                              onClick={() => setIsEditingStatus(true)}
                            >
                              <Pencil className="h-4 w-4 text-blue-600" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {user.role.includes("mentor") && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">
                            Mentor Status
                          </span>
                          {isEditingMentorStatus ? (
                            <div className="flex items-center gap-2 flex-wrap">
                              <Select
                                value={mentorStatus}
                                onValueChange={setMentorStatus}
                              >
                                <SelectTrigger className="h-8 w-28">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectItem value="Approved">
                                    Approved
                                  </SelectItem>
                                  <SelectItem value="Pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="Rejected">
                                    Rejected
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              {(mentorStatus === "Approved" ||
                                mentorStatus === "Rejected") && (
                                <input
                                  type="text"
                                  placeholder="Enter reason"
                                  value={reason}
                                  onChange={(e) => setReason(e.target.value)}
                                  className="h-8 text-xs border rounded-md p-2 w-32"
                                />
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-green-100"
                                onClick={() => {
                                  if (
                                    (mentorStatus === "Approved" ||
                                      mentorStatus === "Rejected") &&
                                    !reason.trim()
                                  ) {
                                    toast.error(
                                      "Please provide a reason for the status change."
                                    );
                                    return;
                                  }
                                  setModalTitle("Confirm Mentor Status Update");
                                  setModalDescription(
                                    `Are you sure you want to set the mentor status to ${mentorStatus}${
                                      reason ? ` with reason: "${reason}"` : ""
                                    }?`
                                  );
                                  setConfirmAction(
                                    () => () => handleMentorStatusUpdate(reason)
                                  );
                                  setIsModalOpen(true);
                                }}
                                disabled={
                                  (mentorStatus === "Approved" ||
                                    mentorStatus === "Rejected") &&
                                  !reason.trim()
                                }
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                {mentorStatus === "Approved" ? (
                                  <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                                    <CircleCheckBig className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                      Approved
                                    </span>
                                  </div>
                                ) : mentorStatus === "Pending" ? (
                                  <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                                    <CircleDashed className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                      Pending
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full">
                                    <Ban className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                      Rejected
                                    </span>
                                  </div>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-blue-100"
                                onClick={() => setIsEditingMentorStatus(true)}
                              >
                                <Pencil className="h-4 w-4 text-blue-600" />
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      Bio
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {mentorData?.bio || user.bio || "No bio available"}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="account">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Skills */}
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5 text-blue-600" />
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(mentorData?.skills || user.skills || []).map(
                        (skill: string) => (
                          <Badge
                            key={skill}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                          >
                            {skill}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>

                  {/* Education/Professional Details */}
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                      {userProfile.user.schoolDetails?.userType === "school"
                        ? "School Details"
                        : userProfile.user.collegeDetails
                        ? "Education Details"
                        : "Professional Details"}
                    </h3>
                    <div className="space-y-3">
                      {userProfile.user.schoolDetails?.userType ===
                        "school" && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">
                              School:
                            </span>
                            <span className="text-sm text-gray-900">
                              {user.schoolDetails.schoolName || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">
                              Class:
                            </span>
                            <span className="text-sm text-gray-900">
                              {user.schoolDetails.class || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">
                              City:
                            </span>
                            <span className="text-sm text-gray-900 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {user.schoolDetails.city || "N/A"}
                            </span>
                          </div>
                        </>
                      )}

                      {(userProfile.user.collegeDetails?.userType ===
                        "college" ||
                        userProfile.user.collegeDetails?.userType ===
                          "fresher") &&
                        user.collegeDetails && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-600">
                                College:
                              </span>
                              <span className="text-sm text-gray-900">
                                {user.collegeDetails.collegeName || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-600">
                                Course:
                              </span>
                              <span className="text-sm text-gray-900">
                                {user.collegeDetails.course || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-600">
                                Specialization:
                              </span>
                              <span className="text-sm text-gray-900">
                                {user.collegeDetails.specializedIn || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-600">
                                City:
                              </span>
                              <span className="text-sm text-gray-900 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {user.collegeDetails.city || "N/A"}
                              </span>
                            </div>
                          </>
                        )}

                      {userProfile?.user?.professionalDetails?.userType ===
                        "professional" && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">
                              Job Role:
                            </span>
                            <span className="text-sm text-gray-900">
                              {user.professionalDetails.jobRole || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">
                              Company:
                            </span>
                            <span className="text-sm text-gray-900">
                              {user.professionalDetails.company || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">
                              Experience:
                            </span>
                            <span className="text-sm text-gray-900">
                              {user.professionalDetails.experience || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">
                              City:
                            </span>
                            <span className="text-sm text-gray-900 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {user.professionalDetails.city || "N/A"}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="experience">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Achievements */}
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      Achievements
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {mentorData?.achievements || "No achievements listed"}
                      </p>
                    </div>
                  </div>

                  {/* Links & Portfolio */}
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Link className="h-5 w-5 text-blue-600" />
                      Links & Portfolio
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Link className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Portfolio
                          </p>
                          {mentorData?.portfolio || user.portfolio ? (
                            <a
                              href={mentorData?.portfolio || user.portfolio}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              View Portfolio
                            </a>
                          ) : (
                            <span className="text-sm text-gray-500">
                              Not provided
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Linkedin className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            LinkedIn
                          </p>
                          {mentorData?.linkedinURL ? (
                            <a
                              href={mentorData.linkedinURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              View Profile
                            </a>
                          ) : (
                            <span className="text-sm text-gray-500">
                              Not provided
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <Youtube className="h-4 w-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            YouTube
                          </p>
                          {mentorData?.youtubeURL ? (
                            <a
                              href={mentorData.youtubeURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-red-600 hover:text-red-800 hover:underline"
                            >
                              View Channel
                            </a>
                          ) : (
                            <span className="text-sm text-gray-500">
                              Not provided
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Featured Article
                          </p>
                          {mentorData?.featuredArticle ||
                          user.featuredArticle ? (
                            <a
                              href={
                                mentorData?.featuredArticle ||
                                user.featuredArticle
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-green-600 hover:text-green-800 hover:underline"
                            >
                              Read Article
                            </a>
                          ) : (
                            <span className="text-sm text-gray-500">
                              Not provided
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Career Interests */}
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      Career Interests
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(mentorData?.interestedNewCareer?.length
                        ? mentorData.interestedNewCareer
                        : user.interestedInNewCareer || []
                      ).map((interest: string) => (
                        <Badge
                          key={interest}
                          className="bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 transition-all duration-300"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Mentor Motivation */}
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      Mentor Motivation
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {mentorData?.mentorMotivation ||
                          user.mentorMotivation ||
                          "No motivation statement provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="services">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                      Services
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Manage mentor services and offerings
                    </p>
                  </div>

                  {serviceData && serviceData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                              #
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                              Date
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                              Type
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                              Title
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                              Description
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {serviceData.map((service, index) => (
                            <tr
                              key={service._id}
                              className="hover:bg-gray-50 transition-colors duration-200"
                            >
                              <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                {index + 1}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {new Date(
                                  service.createdAt
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                  {service.type}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 font-medium max-w-xs truncate">
                                {service.title}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                                {service.shortDescription}
                              </td>
                              <td className="px-6 py-4 text-sm font-semibold text-gray-900 flex items-center gap-1">
                                <DollarSign className="h-4 w-4 text-green-600" />
                                ₹{service.amount}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="h-8 w-8 text-yellow-600" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        No services available
                      </h4>
                      <p className="text-gray-600">
                        This mentor hasn't created any services yet.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="bookings">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Calendar className="h-6 w-6 text-blue-600" />
                      Bookings
                    </h3>
                    <p className="text-gray-600 mt-1">
                      View all booking history and appointments
                    </p>
                  </div>

                  {bookingData && bookingData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                              #
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                              Date
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                              Mentor
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                              Booking Date
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                              Time
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {bookingData.map((booking, index) => (
                            <tr
                              key={booking._id}
                              className="hover:bg-gray-50 transition-colors duration-200"
                            >
                              <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                {index + 1}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {new Date(
                                  booking.createdAt
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <Users className="h-4 w-4 text-white" />
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">
                                    {`${booking.mentorId.firstName} ${booking.mentorId.lastName}`}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {new Date(
                                  booking.bookingDate
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-1">
                                <Clock className="h-4 w-4 text-gray-400" />
                                {booking.startTime}
                              </td>
                              <td className="px-6 py-4">
                                <Badge
                                  className={`${
                                    booking.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : booking.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : booking.status === "cancelled"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {booking.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="h-8 w-8 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        No bookings available
                      </h4>
                      <p className="text-gray-600">
                        No appointment bookings found for this user.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <ConfirmationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={confirmAction}
        title={modalTitle}
        description={modalDescription}
      />
      <BlockUserModal
        isOpen={isBlockModalOpen}
        user={{
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        }}
        onConfirm={handleStatusUpdate}
        onCancel={() => setIsBlockModalOpen(false)}
        isLoading={loading}
      />
    </div>
  );
};

export default UserProfile;
