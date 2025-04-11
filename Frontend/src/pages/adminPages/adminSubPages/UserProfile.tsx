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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleCheckBig, Ban, CircleDashed } from "lucide-react";
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
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingMentorStatus, setIsEditingMentorStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");

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

  const handleMentorStatusUpdate = async () => {
    if (!userProfile || !userProfile.mentorData) return;
    const newMentorStatus = mentorStatus;
    if (newMentorStatus !== userProfile.mentorData.isApproved) {
      setLoading(true);
      try {
        console.log("sampleuserpfile", userProfile);

        console.log(
          "mentor status update rpsonse step 1 ",
          userProfile.mentorData?._id,
          newMentorStatus
        );
        const response = await updateMentorStatus(
          userProfile.mentorData?._id,
          newMentorStatus
        );
        console.log("mentor status update rpsonse uis ", response);

        setUserProfile({
          ...userProfile,
          mentorData: {
            ...userProfile.mentorData,
            isApproved: newMentorStatus,
          },
        });
        setIsEditingMentorStatus(false);
      } catch (err) {
        setError("Failed to update mentor status");
      } finally {
        setLoading(false);
      }
    } else {
      setIsEditingMentorStatus(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!userProfile) return <div className="p-6">User not found</div>;

  const { user, menteeData, mentorData } = userProfile;

  return (
    <div className="flex min-h-screen flex-col pl-24">
      <main className="flex-1">
        {/* <div className="p-6"> */}
        <div className="max-w-6xl mx-auto p-6">
          <div className="mb-6 flex items-center">
            <Link to="/admin/allUsers">
              <div className="flex h-8 w-8 items-center justify-start rounded-full border">
                <ArrowLeft className="h-6 w-8" />
              </div>
            </Link>
            <h1 className="ml-4 text-2xl font-semibold">{`${user.firstName} ${user.lastName}`}</h1>
          </div>

          <div className="rounded-md border p-10">
            <div className="mb-6 flex items-start gap-6">
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
                      ? "border-b-2 border-black  bg-green-800 text-white"
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

                  <div className="flex  py-2">
                    <span className=" w-1/3 text-sm font-medium text-gray-500">
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
                          onClick={handleStatusUpdate}
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
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={handleMentorStatusUpdate}
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
                  <div className="flex  py-2">
                    <span className="w-1/3 mb-2 text-sm font-medium text-gray-500">
                      Skills
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(
                        mentorData?.skills ||
                        user.skills?.split(",") ||
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
                  <div className="flex  py-2">
                    <span className=" w-1/3 text-sm font-medium text-gray-500">
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
                  <div className="flex  py-2">
                    <span className="w-1/3 text-sm font-medium text-gray-500">
                      Achievements
                    </span>
                    <span className="text-sm">
                      {user.achievements || "N/A"}
                    </span>
                  </div>
                  <div className="flex  py-2">
                    <span className="w-1/3 text-sm font-medium text-gray-500">
                      LinkedIn URL
                    </span>
                    <span className="text-sm">{user.linkedinUrl || "N/A"}</span>
                  </div>
                  <div className="flex  py-2">
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
                  <div className="flex  py-2">
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
              <table className="w-full">
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
    </div>
  );
};

export default UserProfile;

// "use client";

// import { useState, useEffect } from "react";
// import { Link, useParams } from "react-router-dom";
// import { ArrowLeft, Check, Pencil } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { getUserRoleData } from "@/services/adminService"; // Adjust path
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// // Sample user data
// const userData1 = {
//   id: 1,
//   name: "Sreekuttan N",
//   email: "sreekuttan1248@gmail.com",
//   phone: "6281215102",
//   status: "Active",
//   joinedDate: "12/03/2025, 12:04PM",
//   role: "Mentee/Mentor",
//   bio: "Passionate about building scalable and efficient web applications, I specialize in MERN stack development(MongoDB, Express.js, React.js, Node.js). With hands-on experience in developing E-commerce platforms, social media applications, and mentor-based solutions, I thrive on turning ideas into functional digital products.",
//   mentorStatus: "Approved",
//   skills: ["Javascript", "Node JS", "React Js", "MongoDB"],
//   jobTitle: "MERN Stack Developer",
//   company: "Mentor One Pvt Ltd",
//   followers: 121,
//   services: [
//     {
//       id: 1,
//       type: "1:1 Call",
//       service: "Mock Interview",
//       duration: "30Mins",
//       price: "₹ 400",
//     },
//     {
//       id: 2,
//       type: "1:1 Call",
//       service: "Mock Interview",
//       duration: "30Mins",
//       price: "₹ 400",
//     },
//     {
//       id: 3,
//       type: "1:1 Call",
//       service: "Mock Interview",
//       duration: "30Mins",
//       price: "₹ 400",
//     },
//   ],
//   title: "Full Stack Developer | MERN Stack Specialist | Freelancer",
// };

// interface UserProfileData {
//   user: {
//     _id: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//     phone?: number;
//     status?: string;
//     role: string[];
//     isBlocked: boolean;
//     createdAt: string;
//     bio?: string;
//     skills?: string;
//   };
//   menteeData?: {
//     joinPurpose: string[];
//     careerGoals: string;
//     interestedNewcareer: string[];
//   } | null;
//   mentorData?: {
//     bio: string;
//     skills: string[];
//     selfIntro?: string;
//     isApproved?: boolean;
//     services?: {
//       type: string;
//       service: string;
//       duration: string;
//       price: string;
//     }[];
//   } | null;
// }

// const UserProfile: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
//   const [status, setStatus] = useState<string>("");
//   const [mentorStatus, setMentorStatus] = useState<string>("");
//   const [isEditingStatus, setIsEditingStatus] = useState(false);
//   const [isEditingMentorStatus, setIsEditingMentorStatus] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await getUserRoleData(id!);
//         if (response && response.status === 200) {
//           const data = response.data.data;
//           setUserProfile(data);
//           setStatus(data.user.isBlocked ? "Blocked" : "Active");
//           setMentorStatus(
//             data.mentorData?.isApproved === "Approved"
//               ? "Approved"
//               : data?.mentorData.isApproved === "Rejected"
//               ? "Rejetced"
//               : data?.mentorData.isApproved === "Pending"
//               ? "Pending"
//               : "N/A"
//           );
//         } else {
//           setError("Failed to fetch user data");
//         }
//       } catch (err) {
//         setError("An error occurred while fetching user data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserData();
//   }, [id]);

//   if (loading) return <div className="p-6">Loading...</div>;
//   if (error) return <div className="p-6 text-red-500">{error}</div>;
//   if (!userProfile) return <div className="p-6">User not found</div>;

//   const { user, menteeData, mentorData } = userProfile;

//   return (
//     <div className="flex min-h-screen flex-col pl-24">
//       <main className="flex-1">
//         <div className="p-6">
//           <div className="mb-6 flex items-center">
//             <Link to="/admin/allUsers">
//               <div className="flex h-8 w-8 items-center justify-center rounded-full border">
//                 <ArrowLeft className="h-4 w-4" />
//               </div>
//             </Link>
//             <h1 className="ml-4 text-2xl font-semibold">{`${user.firstName} ${user.lastName}`}</h1>
//           </div>

//           <div className="rounded-md border p-10">
//             <div className="mb-6 flex items-start gap-6">
//               <Avatar className="h-20 w-20 rounded-full">
//                 <AvatarImage src={user.profilePicture} alt={user.firstName} />
//                 <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
//               </Avatar>
//               <div>
//                 <h2 className="text-xl font-semibold">{`${user.firstName} ${user.lastName}`}</h2>
//                 {/* Assuming job title comes from mentorData or user */}
//                 <p className="text-sm text-gray-500">
//                   {mentorData?.selfIntro || "N/A"}
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-6 md:grid-cols-2">
//               <div className="space-y-4">
//                 <div className="border-b pb-4">
//                   <div className="flex justify-between py-2">
//                     <span className="text-sm font-medium text-gray-500">
//                       Email ID
//                     </span>
//                     <span className="text-sm">{user.email}</span>
//                   </div>
//                   <div className="flex justify-between py-2">
//                     <span className="text-sm font-medium text-gray-500">
//                       Phone
//                     </span>
//                     <span className="text-sm">{user.phone || "N/A"}</span>
//                   </div>
//                   <div className="flex justify-between py-2">
//                     <span className="text-sm font-medium text-gray-500">
//                       Status
//                     </span>
//                     {isEditingStatus ? (
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
//                           onClick={() => setIsEditingStatus(false)}
//                         >
//                           <Check className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     ) : (
//                       <div className="flex items-center gap-2">
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
//                   <div className="flex justify-between py-2">
//                     <span className="text-sm font-medium text-gray-500">
//                       Joined date
//                     </span>
//                     <span className="text-sm">
//                       {new Date(user.createdAt).toLocaleString()}
//                     </span>
//                   </div>
//                   <div className="flex justify-between py-2">
//                     <span className="text-sm font-medium text-gray-500">
//                       Role
//                     </span>
//                     <span className="text-sm">{user.role.join(", ")}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div className="border-b pb-4">
//                   <div className="mb-2 pb-14">
//                     <h3 className="text-sm font-medium text-gray-500">
//                       Skills
//                     </h3>
//                     <div className="mt-2 flex flex-wrap gap-2">
//                       {(
//                         mentorData?.skills ||
//                         user.skills?.split(",") ||
//                         []
//                       ).map((skill: string) => (
//                         <Badge
//                           key={skill}
//                           variant="outline"
//                           className="rounded-md"
//                         >
//                           {skill}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="flex justify-between py-2">
//                     <span className="text-sm font-medium text-gray-500">
//                       Job Title
//                     </span>
//                     <span className="text-sm">{userData1.jobTitle}</span>
//                   </div>
//                   <div className="flex justify-between py-2">
//                     <span className="text-sm font-medium text-gray-500">
//                       Company
//                     </span>
//                     <span className="text-sm">{userData1.company}</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="border-b pb-4">
//                 <div className="flex justify-between py-2">
//                   <span className="text-sm font-medium text-gray-500">
//                     Mentor Status
//                   </span>
//                   {isEditingMentorStatus ? (
//                     <div className="flex items-center gap-2">
//                       <Select
//                         value={mentorStatus}
//                         onValueChange={setMentorStatus}
//                       >
//                         <SelectTrigger className="h-8 w-32">
//                           <SelectValue placeholder="Select status" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-white">
//                           <SelectItem value="Approved">Approved</SelectItem>
//                           <SelectItem value="Pending">Pending</SelectItem>
//                           <SelectItem value="Rejected">Rejected</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         className="h-6 w-6"
//                         onClick={() => setIsEditingMentorStatus(false)}
//                       >
//                         <Check className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm">{mentorStatus}</span>
//                       {user.role.includes("mentor") && (
//                         <Button
//                           size="icon"
//                           variant="ghost"
//                           className="h-6 w-6"
//                           onClick={() => setIsEditingMentorStatus(true)}
//                         >
//                           <Pencil className="h-4 w-4" />
//                         </Button>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div>
//               <h3 className="mb-2 text-sm font-medium text-gray-500">Bio</h3>
//               <p className="text-sm">{mentorData?.bio || user.bio || "N/A"}</p>
//             </div>
//           </div>
//         </div>

//         {/* {mentorData?.services && ( */}
//         <div className="px-12">
//           <h3 className="mb-4 text-base font-medium">Services</h3>
//           <div className="space-y-4">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b text-left">
//                   <th className="pb-2 text-sm font-medium">#</th>
//                   <th className="pb-2 text-sm font-medium">Type</th>
//                   <th className="pb-2 text-sm font-medium">Service</th>
//                   <th className="pb-2 text-sm font-medium">Duration</th>
//                   <th className="pb-2 text-sm font-medium">Price</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {mentorData?.services?.map((service, index) => (
//                   <tr key={index} className="border-b">
//                     <td className="py-3 text-sm">{index + 1}</td>
//                     <td className="py-3 text-sm">{service.type}</td>
//                     <td className="py-3 text-sm">{service.service}</td>
//                     <td className="py-3 text-sm">{service.duration}</td>
//                     <td className="py-3 text-sm">{service.price}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//         {/* )} */}
//       </main>
//     </div>
//   );
// };

// export default UserProfile;
