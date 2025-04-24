"use client";

import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getUserRoleData,
  updateUserStatus,
  updateMentorStatus,
} from "@/services/adminService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleCheckBig, Ban, CircleDashed } from "lucide-react";
import toast from "react-hot-toast";
// Assuming you have a toast component for error messages

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
    skills?: string;
    userType?: "school" | "college" | "fresher" | "professional";
    schoolName?: string;
    class?: string;
    city?: string;
    collegeName?: string;
    course?: string;
    specializedIn?: string;
    startYear?: string;
    endYear?: string;
    jobRole?: string;
    company?: string;
    totalExperience?: string;
    achievements?: string;
    linkedinUrl?: string;
    youtubeUrl?: string;
    portfolioUrl?: string;
    interestedNewCareer?: string;
    featuredArticle?: string;
    mentorMotivation?: string;
  };
  menteeData?: {
    joinPurpose: string[];
    careerGoals: string;
    interestedNewcareer: string[];
  } | null;
  mentorData?: {
    _id: string; // Ensure this is included for the API call
    bio: string;
    skills: string[];
    selfIntro?: string;
    isApproved?: string;
    services?: {
      type: string;
      service: string;
      duration: string;
      price: string;
    }[];
  } | null;
}

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [status, setStatus] = useState<string>("");
  const [mentorStatus, setMentorStatus] = useState<string>("");
  const [reason, setReason] = useState<string>(""); // New state for reason
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingMentorStatus, setIsEditingMentorStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(
    () => () => {}
  );
  const [modalTitle, setModalTitle] = useState("Confirm Action");
  const [modalDescription, setModalDescription] = useState(
    "Are you sure you want to proceed?"
  );

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getUserRoleData(id!);
        if (response && response.status === 200) {
          const data = response.data.data;
          setUserProfile(data);
          setStatus(data.user.isBlocked ? "Blocked" : "Active");
          setMentorStatus(data.mentorData?.isApproved || "N/A");
        } else {
          setError("Failed to fetch user data");
        }
      } catch (err) {
        setError("An error occurred while fetching user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!userProfile) return;
    const newIsBlocked = status === "Blocked";
    if (newIsBlocked !== userProfile.user.isBlocked) {
      setLoading(true);
      try {
        await updateUserStatus(userProfile.user._id, newIsBlocked);
        setUserProfile({
          ...userProfile,
          user: { ...userProfile.user, isBlocked: newIsBlocked },
        });
        setIsEditingStatus(false);
      } catch (err) {
        setError("Failed to update user status");
      } finally {
        setLoading(false);
      }
    } else {
      setIsEditingStatus(false);
    }
  };

  const handleMentorStatusUpdate = async (reason: string) => {
    if (!userProfile || !userProfile.mentorData) return;
    const newMentorStatus = mentorStatus;
    if (newMentorStatus !== userProfile.mentorData.isApproved) {
      setLoading(true);
      try {
        const response = await updateMentorStatus(
          userProfile.mentorData._id,
          newMentorStatus,
          reason
        );
        console.log("response is ", response);

        setUserProfile({
          ...userProfile,
          mentorData: {
            ...userProfile.mentorData,
            isApproved: newMentorStatus,
          },
        });
        setIsEditingMentorStatus(false);
        setReason(""); // Reset reason after successful update
      } catch (err) {
        setError("Failed to update mentor status");
      } finally {
        setLoading(false);
      }
    } else {
      setIsEditingMentorStatus(false);
      setReason(""); // Reset reason if no change
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!userProfile) return <div className="p-6">User not found</div>;

  const { user, menteeData, mentorData } = userProfile;

  return (
    <div className="flex min-h-screen flex-col pl-24">
      <main className="flex-1">
        <div className="max-w-6xl mx-auto p-2">
          <div className="rounded-md border p-8 bg-white">
            <div className="mb-6 flex items-start gap-6 ">
              <div className="mb-6 flex items-center">
                <Link to="/admin/allUsers">
                  <div className="flex h-8 w-8 items-center justify-start rounded-full border">
                    <ArrowLeft className="h-6 w-8" />
                  </div>
                </Link>
              </div>
              <Avatar className="h-24 w-24 rounded-full">
                <AvatarImage src={user.profilePicture} alt={user.firstName} />
                <AvatarFallback>{user.firstName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{`${user.firstName} ${user.lastName}`}</h2>
                <p className="text-sm text-gray-500">
                  {mentorData?.selfIntro || "N/A"}
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 text-red-500 bg-red-100 rounded-md">
                {error}
              </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="flex justify-start gap-24 border-b mb-12">
                <TabsTrigger
                  value="profile"
                  className={`pb-2 ${
                    activeTab === "profile"
                      ? "border-b-2 border-black bg-green-800 text-white"
                      : ""
                  }`}
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="account"
                  className={`pb-2 ${
                    activeTab === "account"
                      ? "border-b-2 border-black bg-green-800 text-white"
                      : ""
                  }`}
                >
                  Account
                </TabsTrigger>
                <TabsTrigger
                  value="experience"
                  className={`pb-2 ${
                    activeTab === "experience"
                      ? "border-b-2 border-black bg-green-800 text-white"
                      : ""
                  }`}
                >
                  Experience
                </TabsTrigger>
              </TabsList>
              <TabsContent value="profile">
                <div className="space-y-4">
                  <div className="flex py-2">
                    <span className="w-1/3 text-sm font-medium text-gray-500">
                      Email ID
                    </span>
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex py-2">
                    <span className="w-1/3 text-sm font-medium text-gray-500">
                      Phone
                    </span>
                    <span className="text-sm">{user.phone || "N/A"}</span>
                  </div>
                  <div className="flex py-2">
                    <span className="w-1/3 text-sm font-medium text-gray-500">
                      Status
                    </span>
                    {isEditingStatus ? (
                      <div className="flex items-center gap-2">
                        <Select value={status} onValueChange={setStatus}>
                          <SelectTrigger className="h-8 w-32">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Blocked">Blocked</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => {
                            setModalTitle("Confirm Status Update");
                            setModalDescription(
                              `Are you sure you want to set the status to ${status}?`
                            );
                            setConfirmAction(() => handleStatusUpdate);
                            setIsModalOpen(true);
                          }}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {status === "Active" ? (
                          <CircleCheckBig
                            size={28}
                            color="#198041"
                            strokeWidth={1.75}
                          />
                        ) : (
                          <Ban size={28} color="#cc141d" strokeWidth={1.75} />
                        )}
                        <span className="text-sm">{status}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => setIsEditingStatus(true)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex py-2">
                    <span className="w-1/3 text-sm font-medium text-gray-500">
                      Joined Date
                    </span>
                    <span className="text-sm">
                      {new Date(user.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex py-2">
                    <span className="w-1/3 text-sm font-medium text-gray-500">
                      Role
                    </span>
                    <span className="text-sm">{user.role.join(", ")}</span>
                  </div>
                  {user.role.includes("mentor") && (
                    <div className="flex py-2">
                      <span className="w-1/3 text-sm font-medium text-gray-500">
                        Mentor Status
                      </span>
                      {isEditingMentorStatus ? (
                        <div className="flex items-center gap-2">
                          <Select
                            value={mentorStatus}
                            onValueChange={setMentorStatus}
                          >
                            <SelectTrigger className="h-8 w-32">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="Approved">Approved</SelectItem>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                          {(mentorStatus === "Approved" ||
                            mentorStatus === "Rejected") && (
                            <input
                              type="text"
                              placeholder="Enter reason"
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                              className="h-8 w-32 border rounded-md p-2"
                            />
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
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
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {mentorStatus === "Approved" ? (
                            <CircleCheckBig
                              size={28}
                              color="#198041"
                              strokeWidth={1.75}
                            />
                          ) : mentorStatus === "Pending" ? (
                            <CircleDashed
                              size={28}
                              color="#291aff"
                              strokeWidth={1.75}
                            />
                          ) : (
                            <Ban size={28} color="#cc141d" strokeWidth={1.75} />
                          )}
                          <span className="text-sm">{mentorStatus}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => setIsEditingMentorStatus(true)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-500">
                      Bio
                    </h3>
                    <div className="w-full min-h-[100px] border border-gray-300 p-4 rounded-md">
                      <p className="text-sm">
                        {mentorData?.bio || user.bio || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="account">
                <div className="space-y-4">
                  <div className="flex py-2">
                    <span className="w-1/3 mb-2 text-sm font-medium text-gray-500">
                      Skills
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(
                        mentorData?.skills ||
                        user?.skills?.split(",") ||
                        []
                      ).map((skill: string) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="rounded-md"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex py-2">
                    <span className="w-1/3 text-sm font-medium text-gray-500">
                      User Type
                    </span>
                    <span className="text-sm">{user.userType || "N/A"}</span>
                  </div>
                  {user.userType === "school" && (
                    <>
                      <div className="flex justify-between py-2">
                        <span className="text-sm font-medium text-gray-500">
                          School Name
                        </span>
                        <span className="text-sm">
                          {user.schoolName || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm font-medium text-gray-500">
                          Class
                        </span>
                        <span className="text-sm">{user.class || "N/A"}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm font-medium text-gray-500">
                          City
                        </span>
                        <span className="text-sm">{user.city || "N/A"}</span>
                      </div>
                    </>
                  )}
                  {(user.userType === "college" ||
                    user.userType === "fresher") && (
                    <>
                      <div className="flex justify-between py-2">
                        <span className="text-sm font-medium text-gray-500">
                          College Name
                        </span>
                        <span className="text-sm">
                          {user.collegeName || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm font-medium text-gray-500">
                          Course
                        </span>
                        <span className="text-sm">{user.course || "N/A"}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm font-medium text-gray-500">
                          Specialized In
                        </span>
                        <span className="text-sm">
                          {user.specializedIn || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm font-medium text-gray-500">
                          Start Year
                        </span>
                        <span className="text-sm">
                          {user.startYear || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm font-medium text-gray-500">
                          End Year
                        </span>
                        <span className="text-sm">{user.endYear || "N/A"}</span>
                      </div>
                    </>
                  )}
                  {user.userType === "professional" && (
                    <>
                      <div className="flex justify-between py-2">
                        <span className="text-sm font-medium text-gray-500">
                          Job Role
                        </span>
                        <span className="text-sm">{user.jobRole || "N/A"}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm font-medium text-gray-500">
                          Company
                        </span>
                        <span className="text-sm">{user.company || "N/A"}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm font-medium text-gray-500">
                          Total Experience
                        </span>
                        <span className="text-sm">
                          {user.totalExperience || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm font-medium text-gray-500">
                          Start Year
                        </span>
                        <span className="text-sm">
                          {user.startYear || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm font-medium text-gray-500">
                          End Year
                        </span>
                        <span className="text-sm">{user.endYear || "N/A"}</span>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="experience">
                <div className="space-y-4">
                  <div className="flex py-2">
                    <span className="w-1/3 text-sm font-medium text-gray-500">
                      Achievements
                    </span>
                    <span className="text-sm">
                      {user.achievements || "N/A"}
                    </span>
                  </div>
                  <div className="flex py-2">
                    <span className="w-1/3 text-sm font-medium text-gray-500">
                      LinkedIn URL
                    </span>
                    <span className="text-sm">{user.linkedinUrl || "N/A"}</span>
                  </div>
                  <div className="flex py-2">
                    <span className="w-1/3 text-sm font-medium text-gray-500">
                      YouTube URL
                    </span>
                    <span className="text-sm">{user.youtubeUrl || "N/A"}</span>
                  </div>
                  <div className="flex py-2">
                    <span className="w-1/3 text-sm font-medium text-gray-500">
                      Portfolio URL
                    </span>
                    <span className="text-sm">
                      {user.portfolioUrl || "N/A"}
                    </span>
                  </div>
                  <div className="flex py-2">
                    <span className="w-1/3 text-sm font-medium text-gray-500">
                      Interested New Career
                    </span>
                    <span className="text-sm">
                      {user.interestedNewCareer || "N/A"}
                    </span>
                  </div>
                  <div className="flex py-2">
                    <span className="w-1/3 text-sm font-medium text-gray-500">
                      Featured Article
                    </span>
                    <span className="text-sm">
                      {user.featuredArticle || "N/A"}
                    </span>
                  </div>
                  <div className="flex py-2">
                    <span className="w-1/3 text-sm font-medium text-gray-500">
                      Mentor Motivation
                    </span>
                    <span className="text-sm">
                      {user.mentorMotivation || "N/A"}
                    </span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {mentorData?.services && (
          <div className="px-12">
            <h3 className="mb-4 text-base font-medium">Services</h3>
            <div className="space-y-4">
              <table
                className="w

-full"
              >
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 text-sm font-medium">#</th>
                    <th className="pb-2 text-sm font-medium">Type</th>
                    <th className="pb-2 text-sm font-medium">Service</th>
                    <th className="pb-2 text-sm font-medium">Duration</th>
                    <th className="pb-2 text-sm font-medium">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {mentorData.services.map((service, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 text-sm">{index + 1}</td>
                      <td className="py-3 text-sm">{service.type}</td>
                      <td className="py-3 text-sm">{service.service}</td>
                      <td className="py-3 text-sm">{service.duration}</td>
                      <td className="py-3 text-sm">{service.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <ConfirmationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={confirmAction}
        title={modalTitle}
        description={modalDescription}
      />
    </div>
  );
};

export default UserProfile;
