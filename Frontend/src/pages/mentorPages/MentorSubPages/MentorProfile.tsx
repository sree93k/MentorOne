import React, { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import SreeImg from "@/assets/Sree.jpeg";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { getUserDetails, updateUserDetails } from "@/services/mentorService";
import toast from "react-hot-toast";

interface EditableFieldProps {
  label: string;
  value: string;
  onEdit: () => void;
  isEditing?: boolean;
  onSave?: () => void;
  type?: string;
  onChange?: (value: string) => void;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  onEdit,
  isEditing = false,
  onSave,
  type = "text",
  onChange,
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
    <Input
      type={type}
      value={value}
      readOnly={!isEditing}
      onChange={(e) => onChange && onChange(e.target.value)}
      className="w-full bg-white"
    />
  </div>
);

const MentorProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user && user._id) {
        try {
          const userDetails = await getUserDetails(user._id);
          setProfileData(userDetails.data.response);
        } catch (error) {
          console.error("Failed to fetch user details", error);
          toast.error("Failed to load profile data.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        toast.error("User not found. Please log in again.");
      }
    };
    fetchUserDetails();
  }, [user]);

  const handleEdit = (field: string) => {
    setEditingField(field);
  };

  const handleSave = async (field: string) => {
    if (field === "password" && newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (field === "password" && newPassword) {
      setProfileData({ ...profileData, password: newPassword });
    }
    try {
      if (user && user._id && profileData) {
        await updateUserDetails(user._id, profileData);
        toast.success(`${field} updated successfully!`);
      }
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error("Failed to update profile.");
    }
    setEditingField(null);
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleFieldChange = (field: string, value: string) => {
    setProfileData({ ...profileData, [field]: value });
  };

  if (loading) {
    return <div className="px-24 p-6">Loading profile data...</div>;
  }

  if (!profileData) {
    return <div className="px-24 p-6">No profile data found.</div>;
  }

  return (
    <div className="flex-1 px-24 border rounded-xl">
      {/* Profile Header */}
      <div className="bg-red-500 text-white p-8 rounded-t-xl relative">
        <div className="flex items-end gap-6">
          <div className="relative">
            <img
              src={profileData.imageUrl || SreeImg}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white"
            />
            <button className="absolute bottom-2 right-2 bg-green-500 p-1 rounded-full">
              <Pencil size={16} />
            </button>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-1">
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p className="text-gray-300 mb-2">{profileData.shortIntro}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
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
              value="account"
              className={`pb-4 ${
                activeTab === "account" ? "border-b-2 border-black" : ""
              }`}
            >
              Account
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="profile">
            <div className="max-w-2xl">
              <EditableField
                label="First Name"
                value={profileData.firstName || ""}
                onEdit={() => handleEdit("firstName")}
                isEditing={editingField === "firstName"}
                onSave={() => handleSave("firstName")}
                onChange={(value) => handleFieldChange("firstName", value)}
              />
              <EditableField
                label="Last Name"
                value={profileData.lastName || ""}
                onEdit={() => handleEdit("lastName")}
                isEditing={editingField === "lastName"}
                onSave={() => handleSave("lastName")}
                onChange={(value) => handleFieldChange("lastName", value)}
              />
              <EditableField
                label="Display Name"
                value={profileData.displayName || ""}
                onEdit={() => handleEdit("displayName")}
                isEditing={editingField === "displayName"}
                onSave={() => handleSave("displayName")}
                onChange={(value) => handleFieldChange("displayName", value)}
              />
              <EditableField
                label="Short Intro"
                value={profileData.shortIntro || ""}
                onEdit={() => handleEdit("shortIntro")}
                isEditing={editingField === "shortIntro"}
                onSave={() => handleSave("shortIntro")}
                onChange={(value) => handleFieldChange("shortIntro", value)}
              />
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">About You</label>
                  {editingField !== "about" ? (
                    <button
                      onClick={() => handleEdit("about")}
                      className="text-sm text-black hover:underline"
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSave("about")}
                      className="text-sm text-green-600 hover:underline"
                    >
                      Save
                    </button>
                  )}
                </div>
                <textarea
                  value={profileData.about || ""}
                  onChange={(e) => handleFieldChange("about", e.target.value)}
                  readOnly={editingField !== "about"}
                  className="w-full p-2 border rounded-md h-32 bg-white"
                />
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="account">
            <div className="max-w-2xl">
              <EditableField
                label="Email ID"
                value={profileData.email || ""}
                onEdit={() => handleEdit("email")}
                isEditing={editingField === "email"}
                onSave={() => handleSave("email")}
                onChange={(value) => handleFieldChange("email", value)}
              />
              <EditableField
                label="Mobile Number"
                value={profileData.phone || ""}
                onEdit={() => handleEdit("phone")}
                isEditing={editingField === "phone"}
                onSave={() => handleSave("phone")}
                type="tel"
                onChange={(value) => handleFieldChange("phone", value)}
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
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full"
                    />
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <p className="text-sm text-gray-500">••••••••</p>
                </div>
              )}
              <Button
                variant="outline"
                className="text-red-500 border-red-500 hover:bg-red-50"
              >
                Delete Account
              </Button>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
};

export default MentorProfile;
