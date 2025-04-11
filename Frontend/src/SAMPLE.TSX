// import React, { useState, useEffect } from "react";
// import * as Tabs from "@radix-ui/react-tabs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Pencil } from "lucide-react";
// import SreeImg from "@/assets/Sree.jpeg";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store/store"; //
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { UploadIcon, Loader2 } from "lucide-react";
// interface EditableFieldProps {
//   label: string;
//   value: string;
//   onEdit: () => void;
//   isEditing?: boolean;
//   onSave?: () => void;
//   type?: string;
// }
// import { Label } from "@/components/ui/label";
// const EditableField: React.FC<EditableFieldProps> = ({
//   label,
//   value,
//   onEdit,
//   isEditing = false,
//   onSave,
//   type = "text",
// }) => (
//   <div className="mb-6">
//     <div className="flex justify-between items-center mb-2">
//       <label className="text-sm font-medium">{label}</label>
//       {!isEditing ? (
//         <button onClick={onEdit} className="text-sm text-black hover:underline">
//           Edit
//         </button>
//       ) : (
//         <button
//           onClick={onSave}
//           className="text-sm text-green-600 hover:underline"
//         >
//           Save
//         </button>
//       )}
//     </div>
//     <Input
//       type={type}
//       value={value}
//       readOnly={!isEditing}
//       className="w-full bg-white"
//     />
//   </div>
// );

// const MenteeProfile: React.FC = () => {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [editingField, setEditingField] = useState<string | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [isImageLoading, setIsImageLoading] = useState(false);
//   const [profileData, setProfileData] = useState({
//     firstName: "Sreekuttan",
//     lastName: "Nannatt",
//     phone: "6282 155 102",
//     email: "sreekuttan1248@gmail.com",
//     workAs: "Fresher",
//     course: "B-Tech (Computer Science)",
//     college: "Calicut University Engineering College",
//     courseStart: "2013",
//     courseEnd: "2017",
//     city: "Calicut, Kerala, INDIA",
//     bio: "",
//     skills: "Javascript | Node JS | Mongo DB | React JS | AWS | Tailwind CSS",
//   });
//   const { user, isAuthenticated, accessToken } = useSelector(
//     (state: RootState) => state.user
//   );

//   useEffect(() => {
//     console.log("is activated is >>>>>>>>>>>>>>>>>>>>>>>>>>s");
//     console.log("users>>>>>>>", user);
//   }, []);

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setIsImageLoading(true); // Show loading indicator
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewUrl(reader.result as string); // Set preview URL for display
//         setIsImageLoading(false); // Hide loading indicator
//       };
//       reader.readAsDataURL(file); // Read file as data URL
//       // setFormData({ ...formData, imageFile: file }); // Store file in formData for submission
//     }
//   };

//   const handleEdit = (field: string) => {
//     setEditingField(field);
//   };

//   const handleSave = (field: string) => {
//     setEditingField(null);
//   };
//   return (
//     <>
//       {/* Main Content */}
//       <div className="flex-1 px-24">
//         {/* Profile Header */}
//         <div className="bg-black text-white p-8 rounded-t-xl relative">
//           <div className="flex items-end gap-6">
//             <div className="relative">
//               {/* /////// */}
//               <div className="flex flex-row justify-center items-center gap-4 mb-3">
//                 <div className="flex flex-col items-center">
//                   <Avatar className="h-24 w-24">
//                     {isImageLoading ? (
//                       <AvatarFallback className="bg-gray-100 flex items-center justify-center">
//                         <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
//                       </AvatarFallback>
//                     ) : previewUrl ? (
//                       <AvatarImage src={previewUrl} />
//                     ) : (
//                       // ) : formData.imageUrl ? (
//                       // <AvatarImage src={formData.imageUrl} />
//                       <AvatarFallback className="bg-gray-100">
//                         <UploadIcon className="h-8 w-8 text-gray-400" />
//                       </AvatarFallback>
//                     )}
//                   </Avatar>
//                 </div>
//                 <div>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     className="hidden"
//                     id="image-upload"
//                   />
//                   <button
//                     className="absolute bottom-2 right-2 bg-green-500 p-1 rounded-full"
//                     onClick={() =>
//                       document.getElementById("image-upload")?.click()
//                     }
//                     disabled={isImageLoading}
//                   >
//                     {isImageLoading ? (
//                       <UploadIcon className="h-4 w-4 mr-2" />
//                     ) : (
//                       <Pencil size={16} />
//                     )}
//                   </button>
//                 </div>
//               </div>
//               {/* /////// */}
//               {/* <img
//                 src={SreeImg}
//                 alt="Profile"
//                 className="w-32 h-32 rounded-full border-4 border-white"
//               />
//               <button className="absolute bottom-2 right-2 bg-green-500 p-1 rounded-full">
//                 <Pencil size={16} />
//               </button> */}
//             </div>
//             <div>
//               <h2 className="text-3xl font-bold mb-1">
//                 {user?.firstName} {user?.lastName}
//               </h2>

//               <div>
//                 <p className="text-gray-300 mb-2">
//                   MERN Stack Developer | Fresher
//                 </p>
//                 <button className="absolute bottom-2 right-2 bg-green-500 p-1 rounded-full">
//                   <Pencil size={16} />
//                 </button>
//               </div>
//               <div>
//                 <p className="text-sm">{profileData.skills}</p>
//                 <button className="absolute bottom-2 right-2 bg-green-500 p-1 rounded-full">
//                   <Pencil size={16} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="bg-white rounded-b-xl p-24 min-h-screen ">
//           <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
//             <Tabs.List className="flex gap-8 border-b mb-8">
//               <Tabs.Trigger
//                 value="overview"
//                 className={`pb-4 ${
//                   activeTab === "overview" ? "border-b-2 border-black" : ""
//                 }`}
//               >
//                 Overview
//               </Tabs.Trigger>
//               <Tabs.Trigger
//                 value="as-mentee"
//                 className={`pb-4 ${
//                   activeTab === "as-mentee" ? "border-b-2 border-black" : ""
//                 }`}
//               >
//                 As Mentee
//               </Tabs.Trigger>
//             </Tabs.List>

//             <Tabs.Content value="overview">
//               <div className="max-w-2xl">
//                 <EditableField
//                   label="First Name"
//                   value={user.firstName}
//                   onEdit={() => handleEdit("firstName")}
//                   isEditing={editingField === "firstName"}
//                   onSave={() => handleSave("firstName")}
//                 />
//                 <EditableField
//                   label="Last Name"
//                   value={user.lastName}
//                   onEdit={() => handleEdit("lastName")}
//                   isEditing={editingField === "lastName"}
//                   onSave={() => handleSave("lastName")}
//                 />
//                 <EditableField
//                   label="Phone"
//                   value={profileData.phone}
//                   onEdit={() => handleEdit("phone")}
//                   isEditing={editingField === "phone"}
//                   onSave={() => handleSave("phone")}
//                   type="tel"
//                 />
//                 {editingField === "password" ? (
//                   <div className="mb-6">
//                     <div className="flex justify-between items-center mb-2">
//                       <label className="text-sm font-medium">Password</label>
//                       <button
//                         onClick={() => handleSave("password")}
//                         className="text-sm text-green-600 hover:underline"
//                       >
//                         Save
//                       </button>
//                     </div>
//                     <div className="space-y-2">
//                       <Input
//                         type="password"
//                         placeholder="New Password"
//                         className="w-full"
//                       />
//                       <Input
//                         type="password"
//                         placeholder="Confirm Password"
//                         className="w-full"
//                       />
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="mb-6">
//                     <div className="flex justify-between items-center mb-2">
//                       <label className="text-sm font-medium">Password</label>
//                       <button
//                         onClick={() => handleEdit("password")}
//                         className="text-sm text-black hover:underline"
//                       >
//                         Edit
//                       </button>
//                     </div>
//                     <p className="text-sm text-gray-500">
//                       User Since 7:05PM, 7th March 2025
//                     </p>
//                   </div>
//                 )}
//                 <Button
//                   variant="outline"
//                   className="text-red-500 border-red-500 hover:bg-red-50"
//                 >
//                   Delete Account
//                 </Button>
//               </div>
//             </Tabs.Content>

//             <Tabs.Content value="as-mentee">
//               <div className="max-w-2xl">
//                 <EditableField
//                   label="Work As"
//                   value={profileData.workAs}
//                   onEdit={() => handleEdit("workAs")}
//                   isEditing={editingField === "workAs"}
//                   onSave={() => handleSave("workAs")}
//                 />
//                 <div className="mb-6">
//                   <div className="flex justify-between items-center mb-2">
//                     <label className="text-sm font-medium">Course</label>
//                     <button
//                       onClick={() => handleSave("course")}
//                       className="text-sm text-green-600 hover:underline"
//                     >
//                       Save
//                     </button>
//                   </div>
//                   <select className="w-full p-2 border rounded-md">
//                     <option value="btech">B-Tech (Computer Science)</option>
//                     <option value="mtech">M-Tech</option>
//                   </select>
//                 </div>
//                 <EditableField
//                   label="College"
//                   value={profileData.college}
//                   onEdit={() => handleEdit("college")}
//                   isEditing={editingField === "college"}
//                   onSave={() => handleSave("college")}
//                 />
//                 <div className="mb-6">
//                   <label className="text-sm font-medium block mb-2">
//                     Course Duration
//                   </label>
//                   <div className="flex gap-4">
//                     <Input
//                       type="text"
//                       value={profileData.courseStart}
//                       className="w-1/2"
//                     />
//                     <Input
//                       type="text"
//                       value={profileData.courseEnd}
//                       className="w-1/2"
//                     />
//                   </div>
//                 </div>
//                 <EditableField
//                   label="City"
//                   value={profileData.city}
//                   onEdit={() => handleEdit("city")}
//                   isEditing={editingField === "city"}
//                   onSave={() => handleSave("city")}
//                 />
//                 <div className="mb-6">
//                   <label className="text-sm font-medium block mb-2">Bio</label>

//                   <textarea
//                     className="w-full p-2 border rounded-md h-32"
//                     placeholder="Enter about yourself"
//                     value={profileData.bio}
//                   />
//                 </div>
//               </div>
//             </Tabs.Content>
//           </Tabs.Root>
//         </div>
//       </div>
//     </>
//   );
// };

// export default MenteeProfile;

import React, { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, UploadIcon, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  updateUserProfile,
  uploadProfileImage,
  deleteUserAccount,
  updateUserPassword,
} from "@/services/menteeService";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface EditableFieldProps {
  label: string;
  value: string;
  onEdit: () => void;
  isEditing?: boolean;
  onSave: () => void;
  onChange?: (value: string) => void;
  type?: string;
  renderInput?: () => JSX.Element;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  onEdit,
  isEditing = false,
  onSave,
  onChange,
  type = "text",
  renderInput,
}) => (
  <div className="mb-6">
    <div className="flex justify-between items-center mb-2">
      <label className="text-sm font-medium">{label}</label>
      {!isEditing ? (
        <button onClick={onEdit} className="text-sm text-black hover:underline">
          Edit
        </button>
      ) : (
        <button
          onClick={onSave}
          className="text-sm text-green-600 hover:underline"
        >
          Save
        </button>
      )}
    </div>
    {isEditing ? (
      renderInput ? (
        renderInput()
      ) : (
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="w-full bg-white"
        />
      )
    ) : (
      <p className="text-sm">{value || "N/A"}</p>
    )}
  </div>
);

const PasswordEdit: React.FC<{
  onSave: (newPassword: string) => void;
  onCancel: () => void;
}> = ({ onSave, onCancel }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError(null);
    onSave(newPassword);
  };

  return (
    <div className="space-y-2">
      <Input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-2">
        <Button onClick={handleSave}>Save</Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

const MenteeProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { user, accessToken } = useSelector((state: RootState) => state.user);

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    email: user?.email || "",
    workAs: "",
    course: "",
    college: "",
    courseStart: "",
    courseEnd: "",
    city: "",
    bio: "",
    jobRole: "",
    company: "",
    totalExperience: "",
    achievements: "",
    linkedinUrl: "",
    youtubeUrl: "",
    portfolioUrl: "",
  });

  useEffect(() => {
    // Ideally, fetch profile data from the backend here
    // For now, syncing with user object
    setProfileData((prev) => ({
      ...prev,
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      email: user?.email || "",
    }));
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
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("profileImage", selectedFile);
      await uploadProfileImage(formData, accessToken);
      toast.success("Profile image uploaded successfully");
      setSelectedFile(null);
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setTimeout(() => setIsUploading(false), 3000);
    }
  };

  const updateProfileField = async (field: string, value: any) => {
    try {
      await updateUserProfile(field, value, accessToken);
      setProfileData((prev) => ({ ...prev, [field]: value }));
      toast.success(`${field} updated successfully`);
    } catch (error) {
      toast.error(`Failed to update ${field}`);
      console.error(error);
    }
  };

  const handleEdit = (field: string) => setEditingField(field);
  const handleSave = (field: string, value: any) => {
    updateProfileField(field, value);
    setEditingField(null);
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUserAccount(accessToken);
      toast.success("Account deleted successfully");
      // Redirect or logout logic here
    } catch (error) {
      toast.error("Failed to delete account");
      console.error(error);
    }
    setShowDeleteDialog(false);
  };

  return (
    <div className="flex-1 px-24">
      {/* Profile Header */}
      <div className="bg-black text-white p-8 rounded-t-xl relative">
        <div className="flex items-end gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              {isImageLoading ? (
                <AvatarFallback className="bg-gray-100 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                </AvatarFallback>
              ) : previewUrl ? (
                <AvatarImage src={previewUrl} />
              ) : (
                <AvatarFallback className="bg-gray-100">
                  <UploadIcon className="h-8 w-8 text-gray-400" />
                </AvatarFallback>
              )}
            </Avatar>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            {!previewUrl ? (
              <button
                className="bg-green-500 p-1 rounded-full mt-2"
                onClick={() => document.getElementById("image-upload")?.click()}
                disabled={isImageLoading}
              >
                <Pencil size={16} />
              </button>
            ) : (
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm mt-2"
                onClick={handleImageSave}
                disabled={isUploading}
              >
                Save
              </button>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-1">
              {profileData.firstName} {profileData.lastName}
            </h2>
          </div>
        </div>
      </div>

      {/* Loading Modal */}
      <Dialog open={isUploading} onOpenChange={setIsUploading}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col items-center justify-center p-6">
            <img
              src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif"
              alt="Uploading Animation"
              className="w-32 h-32 mb-4"
            />
            <p className="text-lg font-semibold">Uploading your image...</p>
            <p className="text-sm text-gray-500">Please wait a moment!</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tabs */}
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
              value="additional-info"
              className={`pb-4 ${
                activeTab === "additional-info" ? "border-b-2 border-black" : ""
              }`}
            >
              Additional Info
            </Tabs.Trigger>
          </Tabs.List>

          {/* Overview Tab */}
          <Tabs.Content value="overview">
            <div className="max-w-2xl">
              <EditableField
                label="First Name"
                value={profileData.firstName}
                onEdit={() => handleEdit("firstName")}
                isEditing={editingField === "firstName"}
                onSave={() => handleSave("firstName", profileData.firstName)}
                onChange={(value) =>
                  setProfileData((prev) => ({ ...prev, firstName: value }))
                }
              />
              <EditableField
                label="Last Name"
                value={profileData.lastName}
                onEdit={() => handleEdit("lastName")}
                isEditing={editingField === "lastName"}
                onSave={() => handleSave("lastName", profileData.lastName)}
                onChange={(value) =>
                  setProfileData((prev) => ({ ...prev, lastName: value }))
                }
              />
              <EditableField
                label="Phone"
                value={profileData.phone}
                onEdit={() => handleEdit("phone")}
                isEditing={editingField === "phone"}
                onSave={() => handleSave("phone", profileData.phone)}
                type="tel"
                onChange={(value) =>
                  setProfileData((prev) => ({ ...prev, phone: value }))
                }
              />
              <EditableField
                label="Email"
                value={profileData.email}
                onEdit={() => handleEdit("email")}
                isEditing={editingField === "email"}
                onSave={() => handleSave("email", profileData.email)}
                type="email"
                onChange={(value) =>
                  setProfileData((prev) => ({ ...prev, email: value }))
                }
              />
              {editingPassword ? (
                <PasswordEdit
                  onSave={(newPassword) => {
                    updateUserPassword(newPassword, accessToken)
                      .then(() => {
                        toast.success("Password updated successfully");
                        setEditingPassword(false);
                      })
                      .catch((err) => {
                        toast.error("Failed to update password");
                        console.error(err);
                      });
                  }}
                  onCancel={() => setEditingPassword(false)}
                />
              ) : (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Password</label>
                    <button
                      onClick={() => setEditingPassword(true)}
                      className="text-sm text-black hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">********</p>
                </div>
              )}
              <Dialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-red-500 border-red-500 hover:bg-red-50"
                  >
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <div className="p-6">
                    <h3 className="text-lg font-medium">
                      Confirm Delete Account
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Are you sure you want to delete your account? This action
                      cannot be undone.
                    </p>
                    <div className="mt-4 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Tabs.Content>

          {/* As Mentee Tab */}
          <Tabs.Content value="as-mentee">
            <div className="max-w-2xl">
              {(user?.userType === "college" ||
                user?.userType === "fresher") && (
                <>
                  <EditableField
                    label="Work As"
                    value={profileData.workAs}
                    onEdit={() => handleEdit("workAs")}
                    isEditing={editingField === "workAs"}
                    onSave={() => handleSave("workAs", profileData.workAs)}
                    onChange={(value) =>
                      setProfileData((prev) => ({ ...prev, workAs: value }))
                    }
                  />
                  <EditableField
                    label="Course"
                    value={profileData.course}
                    onEdit={() => handleEdit("course")}
                    isEditing={editingField === "course"}
                    onSave={() => handleSave("course", profileData.course)}
                    renderInput={() => (
                      <select
                        value={profileData.course}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            course: e.target.value,
                          }))
                        }
                        className="text-sm w-full p-2 border rounded-md"
                      >
                        <option value="btech">B-Tech (Computer Science)</option>
                        <option value="mtech">M-Tech</option>
                        {/* Add more options as needed */}
                      </select>
                    )}
                  />
                  <EditableField
                    label="College"
                    value={profileData.college}
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
                      {!editingField || editingField !== "courseDuration" ? (
                        <button
                          onClick={() => handleEdit("courseDuration")}
                          className="text-sm text-black hover:underline"
                        >
                          Edit
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleSave("courseDuration", {
                              courseStart: profileData.courseStart,
                              courseEnd: profileData.courseEnd,
                            })
                          }
                          className="text-sm text-green-600 hover:underline"
                        >
                          Save
                        </button>
                      )}
                    </div>
                    {editingField === "courseDuration" ? (
                      <div className="flex gap-4">
                        <Input
                          type="text"
                          value={profileData.courseStart}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              courseStart: e.target.value,
                            }))
                          }
                          placeholder="Start Year"
                          className="w-1/2"
                        />
                        <Input
                          type="text"
                          value={profileData.courseEnd}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              courseEnd: e.target.value,
                            }))
                          }
                          placeholder="End Year"
                          className="w-1/2"
                        />
                      </div>
                    ) : (
                      <p className="text-sm">
                        {profileData.courseStart} - {profileData.courseEnd}
                      </p>
                    )}
                  </div>
                  <EditableField
                    label="City"
                    value={profileData.city}
                    onEdit={() => handleEdit("city")}
                    isEditing={editingField === "city"}
                    onSave={() => handleSave("city", profileData.city)}
                    onChange={(value) =>
                      setProfileData((prev) => ({ ...prev, city: value }))
                    }
                  />
                  <EditableField
                    label="Bio"
                    value={profileData.bio}
                    onEdit={() => handleEdit("bio")}
                    isEditing={editingField === "bio"}
                    onSave={() => handleSave("bio", profileData.bio)}
                    renderInput={() => (
                      <textarea
                        className="w-full p-2 border rounded-md h-32"
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                      />
                    )}
                  />
                </>
              )}
              {user?.userType === "professional" && (
                <>
                  <EditableField
                    label="Job Role"
                    value={profileData.jobRole}
                    onEdit={() => handleEdit("jobRole")}
                    isEditing={editingField === "jobRole"}
                    onSave={() => handleSave("jobRole", profileData.jobRole)}
                    onChange={(value) =>
                      setProfileData((prev) => ({ ...prev, jobRole: value }))
                    }
                  />
                  <EditableField
                    label="Company"
                    value={profileData.company}
                    onEdit={() => handleEdit("company")}
                    isEditing={editingField === "company"}
                    onSave={() => handleSave("company", profileData.company)}
                    onChange={(value) =>
                      setProfileData((prev) => ({ ...prev, company: value }))
                    }
                  />
                  <EditableField
                    label="Total Experience"
                    value={profileData.totalExperience}
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
                </>
              )}
            </div>
          </Tabs.Content>

          {/* Additional Info Tab */}
          <Tabs.Content value="additional-info">
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
                label="YouTube URL"
                value={profileData.youtubeUrl}
                onEdit={() => handleEdit("youtubeUrl")}
                isEditing={editingField === "youtubeUrl"}
                onSave={() => handleSave("youtubeUrl", profileData.youtubeUrl)}
                onChange={(value) =>
                  setProfileData((prev) => ({ ...prev, youtubeUrl: value }))
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
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
};

export default MenteeProfile;
