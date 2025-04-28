"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Linkedin, Youtube, Twitter, Clock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DummyImage from "@/assets/DummyProfile.jpg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { getMentorById } from "@/services/menteeService";
// import { useAuth } from "@/contexts/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
interface Mentor {
  _id: string;
  userData: string;
  mentorData: string;
  name: string;
  role: string;
  work: string;
  workRole: string;
  profileImage?: string;
  badge: string;
  isBlocked: boolean;
  isApproved: string;
  bio?: string;
  skills?: string[];
  services: {
    _id: string;
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
  // const { user, loading: authLoading } = useAuth();

  const { user, error, loading, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    if (loading) return; // Wait for auth check

    if (!user) {
      toast.error("Please log in to view mentor profiles.");
      navigate("/login");
      return;
    }

    const fetchMentor = async () => {
      if (!id) {
        toast.error("Mentor ID is missing.");
        navigate("/seeker/mentors");
        return;
      }
      setIsLoading(true);
      try {
        const mentorData = await getMentorById(id);
        setMentor(mentorData);
      } catch (error: any) {
        console.error("Failed to fetch mentor:", error);
        toast.error("Failed to load mentor details. Please try again.");
        navigate("/seeker/mentors");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMentor();
  }, [id, user, loading, navigate]);

  if (loading || isLoading) {
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
                {mentor.role} @ {mentor.work}
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

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value="about"
                className="border-t border-gray-700 pt-4"
              >
                <AccordionTrigger className="font-bold">About</AccordionTrigger>
                <AccordionContent className="mt-2">
                  <p className="text-sm">{mentor.bio || "No bio available."}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="skills"
                className="border-t border-gray-700 pt-4"
              >
                <AccordionTrigger className="font-bold">
                  Skills
                </AccordionTrigger>
                <AccordionContent className="mt-2">
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
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="education"
                className="border-t border-gray-700 pt-4"
              >
                <AccordionTrigger className="font-bold">
                  Education
                </AccordionTrigger>
                <AccordionContent className="mt-2">
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
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="work-experience"
                className="border-t border-gray-700 pt-4"
              >
                <AccordionTrigger className="font-bold">
                  Work Experience
                </AccordionTrigger>
                <AccordionContent className="mt-2">
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
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

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
                      price={`₹${service.amount}`}
                      onClick={() =>
                        navigate("/seeker/mentorservice", {
                          state: { service, mentor },
                        })
                      }
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

interface ServiceCardProps {
  type: string;
  title: string;
  description: string;
  duration?: string;
  amount: string;
  onClick: () => void;
}

function ServiceCard({
  type,
  title,
  description,
  duration,
  price,
  onClick,
}: ServiceCardProps) {
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
          onClick={onClick}
        >
          {price}
        </Button>
      </div>
    </div>
  );
}
