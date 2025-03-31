"use client";

import { useState } from "react";
import { Link } from "react-router-dom"; // Replace Next.js Link with React Router Link
import { ArrowLeft, Check, LogOut, Pencil, Search } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SreeImg from "@/assets/Sree.jpeg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample user data
const userData = {
  id: 1,
  name: "Sreekuttan N",
  email: "sreekuttan1248@gmail.com",
  phone: "6281215102",
  status: "Active",
  joinedDate: "12/03/2025, 12:04PM",
  role: "Mentee/Mentor",
  bio: "Passionate about building scalable and efficient web applications, I specialize in MERN stack development(MongoDB, Express.js, React.js, Node.js). With hands-on experience in developing E-commerce platforms, social media applications, and mentor-based solutions, I thrive on turning ideas into functional digital products.",
  mentorStatus: "Approved",
  skills: ["Javascript", "Node JS", "React Js", "MongoDB"],
  jobTitle: "MERN Stack Developer",
  company: "Mentor One Pvt Ltd",
  followers: 121,
  services: [
    {
      id: 1,
      type: "1:1 Call",
      service: "Mock Interview",
      duration: "30Mins",
      price: "₹ 400",
    },
    {
      id: 2,
      type: "1:1 Call",
      service: "Mock Interview",
      duration: "30Mins",
      price: "₹ 400",
    },
    {
      id: 3,
      type: "1:1 Call",
      service: "Mock Interview",
      duration: "30Mins",
      price: "₹ 400",
    },
  ],
  title: "Full Stack Developer | MERN Stack Specialist | Freelancer",
};

const UserProfile: React.FC = () => {
  const [status, setStatus] = useState(userData.status);
  const [mentorStatus, setMentorStatus] = useState(userData.mentorStatus);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingMentorStatus, setIsEditingMentorStatus] = useState(false);

  return (
    <div className="flex min-h-screen flex-col pl-24">
      {/* Main content */}
      <main className="flex-1">
        <div className="p-6">
          <div className="mb-6 flex items-center">
            <Link to="/admin/allUsers">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border">
                <ArrowLeft className="h-4 w-4" />
              </div>
            </Link>
            <h1 className="ml-4 text-2xl font-semibold">{userData.name}</h1>
            <div className="ml-auto text-sm text-gray-500">
              {userData.followers} Followers
            </div>
          </div>

          <div className="rounded-md border p-6">
            <div className="mb-6 flex items-start gap-6">
              <Avatar className="h-20 w-20 rounded-full">
                <AvatarImage src={SreeImg} alt={userData.name} />
                <AvatarFallback className="rounded-md">
                  {userData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{userData.name}</h2>
                <p className="text-sm text-gray-500">{userData.title}</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex justify-between py-2">
                    <span className="text-sm font-medium text-gray-500">
                      Email ID
                    </span>
                    <span className="text-sm">{userData.email}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm font-medium text-gray-500">
                      Phone
                    </span>
                    <span className="text-sm">{userData.phone}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm font-medium text-gray-500">
                      Status
                    </span>
                    {isEditingStatus ? (
                      <div className="flex items-center gap-2">
                        <Select value={status} onValueChange={setStatus}>
                          <SelectTrigger className="h-8 w-32">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Block">Block</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => setIsEditingStatus(false)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
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
                  <div className="flex justify-between py-2">
                    <span className="text-sm font-medium text-gray-500">
                      Joined date
                    </span>
                    <span className="text-sm">{userData.joinedDate}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm font-medium text-gray-500">
                      Role
                    </span>
                    <span className="text-sm">{userData.role}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="mb-2 pb-14">
                    <h3 className="text-sm font-medium text-gray-500">
                      Skills
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {userData.skills.map((skill) => (
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

                  <div className="flex justify-between py-2">
                    <span className="text-sm font-medium text-gray-500">
                      Job Title
                    </span>
                    <span className="text-sm">{userData.jobTitle}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm font-medium text-gray-500">
                      Company
                    </span>
                    <span className="text-sm">{userData.company}</span>
                  </div>
                </div>
              </div>
              <div className="border-b pb-4">
                <div className="flex justify-between py-2">
                  <span className="text-sm font-medium text-gray-500">
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
                        <SelectContent>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => setIsEditingMentorStatus(false)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
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
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-500">Bio</h3>
              <p className="text-sm">{userData.bio}</p>
            </div>
          </div>
        </div>

        <div>
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
                {userData.services.map((service) => (
                  <tr key={service.id} className="border-b">
                    <td className="py-3 text-sm">{service.id}</td>
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
      </main>
    </div>
  );
};

export default UserProfile;
