"use client";

import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Pencil,
  Ban,
  CircleCheckBig,
  CircleDashed,
  AlertTriangle,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
    linkedinUrl?: string;
    youtubeUrl?: string;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
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

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getUserRoleData(id!);
        console.log("**************getUserRoleData reposne ", response);

        if (response && response.status === 200) {
          const data = response.data.data;
          console.log("dattas are", data);

          setUserProfile(data);
          console.log("**************setUserProfile  ", userProfile);
          setStatus(data.user.isBlocked ? "Blocked" : "Active");
          setMentorStatus(data.mentorData?.isApproved || "N/A");
        } else {
          setError("Failed to fetch user data");
        }
      } catch (err) {
        setError("An error occurred while fetching user data");
        console.error("Fetch error:", err);
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
        setError("Failed to update mentor status");
      } finally {
        setLoading(false);
      }
    } else {
      setIsEditingMentorStatus(false);
      setReason("");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!userProfile) return <div className="p-6">User not found</div>;

  const { user, menteeData, mentorData, serviceData, bookingData } =
    userProfile;

  return (
    <div className="flex min-h-screen flex-col pl-24">
      <main className="flex-1">
        <div className="max-w-6xl mx-auto p-2">
          <div className="rounded-md border p-8 bg-white">
            <div className="mb-6 flex items-start gap-6">
              <div className="mb-6 flex items-center">
                <div
                  className="flex h-8 w-8 items-center justify-start rounded-full border"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="h-6 w-8" />
                </div>
              </div>
              <Avatar className="h-24 w-24 rounded-full">
                <AvatarImage src={user.profilePicture} alt={user.firstName} />
                <AvatarFallback>{user.firstName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{`${user.firstName} ${user.lastName}`}</h2>
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
                {user.role.includes("mentor") && (
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
                )}
                {user.role.includes("mentor") && (
                  <TabsTrigger
                    value="services"
                    className={`pb-2 ${
                      activeTab === "services"
                        ? "border-b-2 border-black bg-green-800 text-white"
                        : ""
                    }`}
                  >
                    Services
                  </TabsTrigger>
                )}
                <TabsTrigger
                  value="bookings"
                  className={`pb-2 ${
                    activeTab === "bookings"
                      ? "border-b-2 border-black bg-green-800 text-white"
                      : ""
                  }`}
                >
                  Bookings
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
                              className="h-10 w-96 border rounded-md p-2"
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
                    <div className="w-full min-h-[50px] border border-gray-300 p-4 rounded-md">
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
                    <span className="w-1/3 text-sm font-medium text-gray-500">
                      Skills
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(mentorData?.skills || user.skills || []).map(
                        (skill: string) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="rounded-md"
                          >
                            {skill}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                  {userProfile.user.schoolDetails?.userType === "school" && (
                    <>
                      <div className="flex py-2">
                        <span className="w-1/3 text-sm font-medium text-gray-500">
                          School Name
                        </span>
                        <div className="text-sm">
                          {user.schoolDetails.schoolName || "N/A"}
                        </div>
                      </div>
                      <div className="flex py-2">
                        <span className="w-1/3 text-sm font-medium text-gray-500">
                          Class
                        </span>
                        <div className="text-sm">
                          {user.schoolDetails.class || "N/A"}
                        </div>
                      </div>
                      <div className="flex py-2">
                        <span className="w-1/3 text-sm font-medium text-gray-500">
                          City
                        </span>
                        <div className="text-sm">
                          {user.schoolDetails.city || "N/A"}
                        </div>
                      </div>
                      <div className="flex py-2">
                        <span className="w-1/3 text-sm font-medium text-gray-500">
                          Start Year
                        </span>
                        <div className="text-sm">
                          {user.schoolDetails.startDate
                            ? new Date(
                                user.schoolDetails.startDate
                              ).getFullYear()
                            : "N/A"}
                        </div>
                      </div>
                      <div className="flex py-2">
                        <span className="w-1/3 text-sm font-medium text-gray-500">
                          End Year
                        </span>
                        <div className="text-sm">
                          {user.schoolDetails.endDate
                            ? new Date(user.schoolDetails.endDate).getFullYear()
                            : "N/A"}
                        </div>
                      </div>
                    </>
                  )}
                  {(userProfile.user.collegeDetails?.userType === "college" ||
                    userProfile.user.collegeDetails?.userType === "fresher") &&
                    user.collegeDetails && (
                      <>
                        <div className="flex py-2">
                          <span className="w-1/3 text-sm font-medium text-gray-500">
                            College Name
                          </span>
                          <div className="text-sm">
                            {user.collegeDetails.collegeName || "N/A"}
                          </div>
                        </div>
                        <div className="flex py-2">
                          <span className="w-1/3 text-sm font-medium text-gray-500">
                            Course
                          </span>
                          <div className="text-sm">
                            {user.collegeDetails.course || "N/A"}
                          </div>
                        </div>
                        <div className="flex py-2">
                          <span className="w-1/3 text-sm font-medium text-gray-500">
                            Specialized In
                          </span>
                          <div className="text-sm">
                            {user.collegeDetails.specializedIn || "N/A"}
                          </div>
                        </div>
                        <div className="flex py-2">
                          <span className="w-1/3 text-sm font-medium text-gray-500">
                            City
                          </span>
                          <div className="text-sm">
                            {user.collegeDetails.city || "N/A"}
                          </div>
                        </div>
                        <div className="flex py-2">
                          <span className="w-1/3 text-sm font-medium text-gray-500">
                            Start Year
                          </span>
                          <div className="text-sm">
                            {user.collegeDetails.startDate
                              ? new Date(
                                  user.collegeDetails.startDate
                                ).getFullYear()
                              : "N/A"}
                          </div>
                        </div>
                        <div className="flex py-2">
                          <span className="w-1/3 text-sm font-medium text-gray-500">
                            End Year
                          </span>
                          <div className="text-sm">
                            {user.collegeDetails.endDate
                              ? new Date(
                                  user.collegeDetails.endDate
                                ).getFullYear()
                              : "N/A"}
                          </div>
                        </div>
                      </>
                    )}
                  {userProfile?.user?.professionalDetails?.userType ===
                    "professional" && (
                    <>
                      <div className="space-y-2 border-t pt-4">
                        <div className="flex py-2">
                          <span className="w-1/3 text-sm font-medium text-gray-500">
                            Job Role
                          </span>
                          <div className="text-sm">
                            {user.professionalDetails.jobRole || "N/A"}
                          </div>
                        </div>
                        <div className="flex py-2">
                          <span className="w-1/3 text-sm font-medium text-gray-500">
                            Company
                          </span>
                          <div className="text-sm">
                            {user.professionalDetails.company || "N/A"}
                          </div>
                        </div>
                        <div className="flex py-2">
                          <span className="w-1/3 text-sm font-medium text-gray-500">
                            Total Experience
                          </span>
                          <div className="text-sm">
                            {user.professionalDetails.experience || "N/A"}
                          </div>
                        </div>
                        <div className="flex py-2">
                          <span className="w-1/3 text-sm font-medium text-gray-500">
                            City
                          </span>
                          <div className="text-sm">
                            {user.professionalDetails.city || "N/A"}
                          </div>
                        </div>
                        <div className="flex py-2">
                          <span className="w-1/3 text-sm font-medium text-gray-500">
                            Start Year
                          </span>
                          <div className="text-sm">
                            {user.professionalDetails.startDate
                              ? new Date(
                                  user.professionalDetails.startDate
                                ).getFullYear()
                              : "N/A"}
                          </div>
                        </div>
                        <div className="flex py-2">
                          <span className="w-1/3 text-sm font-medium text-gray-500">
                            End Year
                          </span>
                          <div className="text-sm">
                            {user.professionalDetails.currentlyWorking
                              ? "Present"
                              : user.professionalDetails.endDate
                              ? new Date(
                                  user.professionalDetails.endDate
                                ).getFullYear()
                              : "N/A"}
                          </div>
                        </div>
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
                      {mentorData?.achievements || "N/A"}
                    </span>
                  </div>
                  <div className="flex py-2">
                    <span className="w-1/3 text-sm font-medium text-gray-500">
                      Portfolio URL
                    </span>
                    <span className="text-sm">
                      {mentorData?.portfolio || user.portfolio || "N/A"}
                    </span>
                  </div>
                  <div className="flex py-2">
                    <span className="w-1/3 text-sm font-medium text-gray-500">
                      Interested New Career
                    </span>
                    <span className="text-sm">
                      {mentorData?.interestedNewCareer?.length
                        ? mentorData.interestedNewCareer.join(", ")
                        : user.interestedNewCareer?.length
                        ? user.interestedNewCareer.join(", ")
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex py-2">
                    <span className="w-1/3 text-sm font-medium text-gray-500">
                      Featured Article
                    </span>
                    <span className="text-sm">
                      {mentorData?.featuredArticle ||
                        user.featuredArticle ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex py-2">
                    <span className="w-1/3 text-sm font-medium text-gray-500">
                      Mentor Motivation
                    </span>
                    <span className="text-sm">
                      {mentorData?.mentorMotivation ||
                        user.mentorMotivation ||
                        "N/A"}
                    </span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="services">
                <div className="px-12">
                  <h3 className="mb-4 text-base font-medium">Services</h3>
                  {serviceData && serviceData.length > 0 ? (
                    <div className="space-y-4">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-left">
                            <th className="pb-2 text-sm font-medium">#</th>
                            <th className="pb-2 text-sm font-medium">Date</th>
                            <th className="pb-2 text-sm font-medium">Type</th>
                            <th className="pb-2 text-sm font-medium">Title</th>
                            <th className="pb-2 text-sm font-medium">
                              Short Description
                            </th>
                            <th className="pb-2 text-sm font-medium">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {serviceData.map((service, index) => (
                            <tr key={service._id} className="border-b">
                              <td className="py-3 text-sm">{index + 1}</td>
                              <td className="py-3 text-sm">
                                {new Date(
                                  service.createdAt
                                ).toLocaleDateString()}
                              </td>
                              <td className="py-3 text-sm">{service.type}</td>
                              <td className="py-3 text-sm">{service.title}</td>
                              <td className="py-3 text-sm">
                                {service.shortDescription}
                              </td>
                              <td className="py-3 text-sm">
                                ₹ {service.amount}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-6 bg-gray-100 rounded-md">
                      <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        No services available
                      </span>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="bookings">
                <div className="px-12">
                  <h3 className="mb-4 text-base font-medium">Bookings</h3>
                  {bookingData && bookingData.length > 0 ? (
                    <div className="space-y-4">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-left">
                            <th className="pb-2 text-sm font-medium">#</th>
                            <th className="pb-2 text-sm font-medium">Date</th>
                            <th className="pb-2 text-sm font-medium">
                              Mentor Name
                            </th>
                            <th className="pb-2 text-sm font-medium">
                              Booking Date
                            </th>
                            <th className="pb-2 text-sm font-medium">Time</th>
                            <th className="pb-2 text-sm font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookingData.map((booking, index) => (
                            <tr key={booking._id} className="border-b">
                              <td className="py-3 text-sm">{index + 1}</td>
                              <td className="py-3 text-sm">
                                {new Date(
                                  booking.createdAt
                                ).toLocaleDateString()}
                              </td>
                              <td className="py-3 text-sm">{`${booking.mentorId.firstName} ${booking.mentorId.lastName}`}</td>
                              <td className="py-3 text-sm">
                                {new Date(
                                  booking.bookingDate
                                ).toLocaleDateString()}
                              </td>
                              <td className="py-3 text-sm">
                                {booking.startTime}
                              </td>
                              <td className="py-3 text-sm">{booking.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-6 bg-gray-100 rounded-md">
                      <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        No bookings available
                      </span>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
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
