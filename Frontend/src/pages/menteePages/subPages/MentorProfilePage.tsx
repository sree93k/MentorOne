"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Search,
  ArrowLeft,
  Linkedin,
  Youtube,
  Twitter,
  Clock,
  ChevronDown,
} from "lucide-react";
import DummyImage from "@/assets/DummyProfile.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "react-hot-toast";
import { getMentorById } from "@/services/menteeService";

interface Mentor {
  _id: string;
  name: string;
  role: string;
  company: string;
  profileImage?: string;
  companyBadge: string;
  isBlocked: boolean;
  isApproved: string;
  bio?: string;
  skills?: string[];
  services?: {
    type: string;
    title: string;
    description: string;
    duration: string;
    price: number;
  }[];
  education?: {
    schoolName?: string;
    collegeName?: string;
    city?: string;
  };
  workExperience?: {
    company: string;
    jobRole: string;
    city?: string;
  };
}

export default function MentorProfile() {
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMentor = async () => {
      if (!id) {
        toast.error("Mentor ID is missing.");
        return;
      }
      setIsLoading(true);
      try {
        const mentorData = await getMentorById(id);
        setMentor(mentorData);
      } catch (error: any) {
        console.error("Failed to fetch mentor:", error);

        toast.error("Failed to load mentor details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMentor();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!mentor) {
    return <div>Mentor not found.</div>;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div>
        <Button variant="ghost" className="pl-0" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-7 w-7" />
        </Button>
      </div>
      <div className="flex-1 max-w-screen-xl mx-auto w-full p-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Profile Section */}
          <div className="bg-black text-white p-6 flex flex-col">
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                <img
                  src={mentor.profileImage || DummyImage}
                  alt={mentor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold">{mentor.name}</h2>
              <p className="text-gray-300">
                {mentor.role} @ {mentor.company}
              </p>
              <div className="flex gap-2 mt-4">
                <div className="bg-white rounded-full p-1">
                  <Linkedin className="h-5 w-5 text-black" />
                </div>
                <div className="bg-white rounded-full p-1">
                  <Youtube className="h-5 w-5 text-black" />
                </div>
                <div className="bg-white rounded-full p-1">
                  <Twitter className="h-5 w-5 text-black" />
                </div>
              </div>
            </div>

            <ProfileSection title="About">
              <p className="text-sm">{mentor.bio || "No bio available."}</p>
            </ProfileSection>

            <ProfileSection title="Skills">
              <div className="flex flex-wrap gap-2">
                {mentor.skills?.length ? (
                  mentor.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-gray-200"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm">No skills listed.</p>
                )}
              </div>
            </ProfileSection>

            <ProfileSection title="Education">
              {mentor.education ? (
                <div>
                  {mentor.education.schoolName && (
                    <p className="text-sm">
                      School: {mentor.education.schoolName},{" "}
                      {mentor.education.city}
                    </p>
                  )}
                  {mentor.education.collegeName && (
                    <p className="text-sm">
                      College: {mentor.education.collegeName},{" "}
                      {mentor.education.city}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm">No education details available.</p>
              )}
            </ProfileSection>

            <ProfileSection title="Work Experience">
              {mentor.workExperience ? (
                <p className="text-sm">
                  {mentor.workExperience.jobRole} at{" "}
                  {mentor.workExperience.company}
                  {mentor.workExperience.city &&
                    `, ${mentor.workExperience.city}`}
                </p>
              ) : (
                <p className="text-sm">No work experience listed.</p>
              )}
            </ProfileSection>
          </div>

          {/* Right Services Section */}
          <div className="md:col-span-2">
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium mb-4">Services Available</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {mentor.services?.length ? (
                  Array.from(new Set(mentor.services.map((s) => s.type))).map(
                    (type, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="rounded-full bg-gray-200"
                      >
                        {type}
                      </Badge>
                    )
                  )
                ) : (
                  <Badge variant="outline" className="rounded-full bg-gray-200">
                    No services
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mentor.services?.length ? (
                  mentor.services.map((service, index) => (
                    <ServiceCard
                      key={index}
                      type={service.type}
                      title={service.title}
                      description={service.description}
                      duration={service.duration}
                      price={`₹${service.price}`}
                    />
                  ))
                ) : (
                  <p className="text-gray-500">No services available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProfileSectionProps {
  title: string;
  children?: React.ReactNode;
}

function ProfileSection({ title, children }: ProfileSectionProps) {
  return (
    <Collapsible className="mb-4 border-t border-gray-700 pt-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">{title}</h3>
        <CollapsibleTrigger className="text-gray-400">
          <ChevronDown className="h-5 w-5" />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-2">{children}</CollapsibleContent>
    </Collapsible>
  );
}

interface ServiceCardProps {
  type: string;
  title: string;
  description: string;
  duration?: string;
  price: string;
}

function ServiceCard({
  type,
  title,
  description,
  duration,
  price,
}: ServiceCardProps) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-lg border p-4">
      <Badge
        variant="outline"
        className="mb-2 bg-red-100 text-red-800 border-red-200"
      >
        {type}
      </Badge>
      <h4 className="font-bold mb-1">{title}</h4>
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-1 rounded">
            <Clock className="h-4 w-4 text-blue-800" />
          </div>
          <span className="text-sm">{duration}</span>
        </div>

        <Button
          variant="outline"
          className="rounded-full bg-gray-200 border-gray-300"
          onClick={() => navigate("/seeker/mentorservice")}
        >
          {price}
        </Button>
      </div>
    </div>
  );
}
