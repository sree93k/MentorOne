"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Youtube, Twitter } from "lucide-react";
import {
  ArrowLeft,
  Linkedin,
  Globe,
  Clock,
  Star,
  FileText,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
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
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

interface Testimonial {
  _id: string;
  menteeId: { firstName: string; lastName: string };
  mentorId: string;
  serviceId: { title: string; type: string };
  bookingId: string;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

interface Mentor {
  _id: string;
  userData: string;
  mentorData: string;
  name: string;
  role: string;
  work: string;
  workRole: string;
  topTestimonials: Testimonial[];
  profileImage?: string;
  badge: string;
  isBlocked: boolean;
  isApproved: string;
  bio?: string;
  skills?: string[];
  linkedinURL?: string;
  youtubeURL?: string;
  portfolio?: string;
  featuredArticle?: string;
  services: {
    _id: string;
    type: string;
    title: string;
    shortDescription: string;
    longDescription: string;
    duration: string;
    amount: number;
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
  const { user, error, loading, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    if (loading) return;
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
        console.log("-------------Mentordata is step 1", id);
        const mentorData = await getMentorById(id);
        console.log("-------------Mentordata is step 2", mentorData);
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
              <p className="text-white">
                {mentor.role} @ {mentor.work}
              </p>
              <div className="flex gap-2 mt-4">
                <TooltipProvider>
                  <div className="flex gap-2">
                    {mentor.youtubeURL && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={mentor.youtubeURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-full p-1 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                            aria-label="Visit YouTube Channel"
                          >
                            <Youtube className="h-5 w-5 text-black" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 text-white border-none">
                          <p>Visit YouTube Channel</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {mentor.linkedinURL && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={mentor.linkedinURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-full p-1 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                            aria-label="Visit LinkedIn Profile"
                          >
                            <Linkedin className="h-5 w-5 text-black" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 text-white border-none">
                          <p>Visit LinkedIn Profile</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {mentor.portfolio && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={mentor.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-full p-1 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                            aria-label="Visit Portfolio"
                          >
                            <Globe className="h-5 w-5 text-black" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 text-white border-none">
                          <p>Visit Portfolio</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {mentor.featuredArticle && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={mentor.featuredArticle}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-full p-1 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                            aria-label="View Featured Article"
                          >
                            <FileText className="h-5 w-5 text-black" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 text-white border-none">
                          <p>View Featured Article</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TooltipProvider>
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
                          className="bg-gray-200 text-black"
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
              {mentor.services?.length ? (
                <>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Array.from(
                      new Set(mentor.services.map((s) => s.type))
                    ).map((type, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="rounded-full bg-gray-200"
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mentor.services.map((service, index) => (
                      <ServiceCard
                        key={index}
                        type={service.type}
                        title={service.title}
                        shortDescription={service.shortDescription}
                        longDescription={service.longDescription}
                        duration={service.duration}
                        price={`₹${service.amount}`}
                        onClick={() =>
                          navigate("/seeker/mentorservice", {
                            state: { service, mentor },
                          })
                        }
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg p-6 animate-fade-in shadow-sm">
                  <div className="relative mb-4">
                    <Clock className="w-16 h-16 text-gray-400 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 border-2 border-gray-200 rounded-full animate-pulse opacity-50"></div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    No Services Listed
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 max-w-sm text-center">
                    This mentor hasn't added any services yet. Explore other
                    mentors or check back soon for updates!
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
                    onClick={() => navigate("/seeker/mentors")}
                  >
                    Explore Other Mentors
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium mb-4">Top Testimonials</h3>
              {mentor.topTestimonials?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
                  {mentor.topTestimonials.map((testimonial) => (
                    <TestimonialCard
                      key={testimonial._id}
                      testimonial={testimonial}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg p-6 animate-fade-in shadow-sm">
                  <div className="relative mb-4">
                    <Star className="w-16 h-16 text-gray-400 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 border-2 border-gray-200 rounded-full animate-pulse opacity-50"></div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    No Testimonials Yet
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 max-w-sm text-center">
                    This mentor hasn't received testimonials yet. Be the first
                    to book a session and share your feedback!
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
                    onClick={() => navigate("/seeker/mentors")}
                  >
                    Find Other Mentors
                  </Button>
                </div>
              )}
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
  shortDescription: string;
  duration?: string;
  price: string;
  onClick: () => void;
}

function ServiceCard({
  type,
  title,
  shortDescription,
  duration,
  price,
  onClick,
}: ServiceCardProps) {
  console.log(
    "ServiceCard >>>>>>>>>",
    type,
    title,
    shortDescription,
    duration,
    price
  );

  return (
    <div className="bg-white rounded-lg border p-4">
      <Badge
        variant="outline"
        className="mb-2 bg-red-100 text-red-800 border-red-200"
      >
        {type}
      </Badge>
      <h4 className="font-bold mb-1">{title}</h4>
      <p className="text-sm text-gray-600 mb-4">{shortDescription}</p>
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

interface TestimonialCardProps {
  testimonial: Testimonial;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-1">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>
      <p className="text-gray-700 mb-4">{testimonial.comment}</p>
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-gray-900">
            {`${testimonial.menteeId.firstName} ${testimonial.menteeId.lastName}`}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(testimonial.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span className="px-3 py-1 bg-gray-100 text-sm rounded-full text-gray-600">
          {testimonial.serviceId.type}
        </span>
      </div>
    </div>
  );
}
