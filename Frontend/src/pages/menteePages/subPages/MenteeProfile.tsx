import React, { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import SreeImg from "@/assets/Sree.jpeg";
interface EditableFieldProps {
  label: string;
  value: string;
  onEdit: () => void;
  isEditing?: boolean;
  onSave?: () => void;
  type?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  onEdit,
  isEditing = false,
  onSave,
  type = "text",
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
      className="w-full bg-white"
    />
  </div>
);

const MenteeProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    firstName: "Sreekuttan",
    lastName: "Nannatt",
    phone: "6282 155 102",
    email: "sreekuttan1248@gmail.com",
    workAs: "Fresher",
    course: "B-Tech (Computer Science)",
    college: "Calicut University Engineering College",
    courseStart: "2013",
    courseEnd: "2017",
    city: "Calicut, Kerala, INDIA",
    bio: "",
    skills: "Javascript | Node JS | Mongo DB | React JS | AWS | Tailwind CSS",
  });

  const handleEdit = (field: string) => {
    setEditingField(field);
  };

  const handleSave = (field: string) => {
    setEditingField(null);
  };
  return (
    <>
      {/* Main Content */}
      <div className="flex-1 px-24">
        {/* Profile Header */}
        <div className="bg-black text-white p-8 rounded-t-xl relative">
          <div className="flex items-end gap-6">
            <div className="relative">
              <img
                src={SreeImg}
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
              <p className="text-gray-300 mb-2">
                MERN Stack Developer | Fresher
              </p>
              <p className="text-sm">{profileData.skills}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-b-xl p-24 min-h-screen ">
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
            </Tabs.List>

            <Tabs.Content value="overview">
              <div className="max-w-2xl">
                <EditableField
                  label="First Name"
                  value={profileData.firstName}
                  onEdit={() => handleEdit("firstName")}
                  isEditing={editingField === "firstName"}
                  onSave={() => handleSave("firstName")}
                />
                <EditableField
                  label="Last Name"
                  value={profileData.lastName}
                  onEdit={() => handleEdit("lastName")}
                  isEditing={editingField === "lastName"}
                  onSave={() => handleSave("lastName")}
                />
                <EditableField
                  label="Phone"
                  value={profileData.phone}
                  onEdit={() => handleEdit("phone")}
                  isEditing={editingField === "phone"}
                  onSave={() => handleSave("phone")}
                  type="tel"
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
                >
                  Delete Account
                </Button>
              </div>
            </Tabs.Content>

            <Tabs.Content value="as-mentee">
              <div className="max-w-2xl">
                <EditableField
                  label="Work As"
                  value={profileData.workAs}
                  onEdit={() => handleEdit("workAs")}
                  isEditing={editingField === "workAs"}
                  onSave={() => handleSave("workAs")}
                />
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Course</label>
                    <button
                      onClick={() => handleSave("course")}
                      className="text-sm text-green-600 hover:underline"
                    >
                      Save
                    </button>
                  </div>
                  <select className="w-full p-2 border rounded-md">
                    <option value="btech">B-Tech (Computer Science)</option>
                    <option value="mtech">M-Tech</option>
                  </select>
                </div>
                <EditableField
                  label="College"
                  value={profileData.college}
                  onEdit={() => handleEdit("college")}
                  isEditing={editingField === "college"}
                  onSave={() => handleSave("college")}
                />
                <div className="mb-6">
                  <label className="text-sm font-medium block mb-2">
                    Course Duration
                  </label>
                  <div className="flex gap-4">
                    <Input
                      type="text"
                      value={profileData.courseStart}
                      className="w-1/2"
                    />
                    <Input
                      type="text"
                      value={profileData.courseEnd}
                      className="w-1/2"
                    />
                  </div>
                </div>
                <EditableField
                  label="City"
                  value={profileData.city}
                  onEdit={() => handleEdit("city")}
                  isEditing={editingField === "city"}
                  onSave={() => handleSave("city")}
                />
                <div className="mb-6">
                  <label className="text-sm font-medium block mb-2">Bio</label>
                  <textarea
                    className="w-full p-2 border rounded-md h-32"
                    placeholder="Enter about yourself"
                    value={profileData.bio}
                  />
                </div>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </>
  );
};

export default MenteeProfile;
