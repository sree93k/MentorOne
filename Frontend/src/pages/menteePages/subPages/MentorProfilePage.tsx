"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Home,
  User,
  BookOpen,
  Clock,
  LogOut,
  ChevronDown,
  ChevronUp,
  Star,
  Linkedin,
  Youtube,
  Twitter,
  ArrowLeft,
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TestimonialsModal from "@/components/mentee/TestimonialModal";

export default function MentorProfile() {
  const [isTestimonialsOpen, setIsTestimonialsOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen bg-white">
      {/* Content */}
      <div>
        <Button variant="ghost" className="pl-0" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-7 w-7 " />
        </Button>
      </div>
      <div className="flex-1 max-w-screen-xl mx-auto w-full p-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Profile Section */}
          <div className="bg-black text-white p-6 flex flex-col">
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                <img
                  //   src="/placeholder.svg?height=128&width=128"
                  src={DummyImage}
                  alt="Anita Benny"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold">Anita Benny</h2>
              <p className="text-gray-300">Python Developer @ Flipkart</p>
              <p className="text-sm text-gray-400 mt-1">4 year Experience</p>

              {/* <Button className="mt-4 bg-white text-black hover:bg-gray-100">
                Follow
              </Button> */}

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
              {/* <div className="text-sm text-gray-400 mt-2">30 followers</div> */}
            </div>

            <ProfileSection title="About">
              <p className="text-sm">
                With over 4 years of extensive experience in software
                development, I have gained expertise in Python, Django,
                system-scaling, system design, optimization, data structures,
                and algorithms.
              </p>
              <p className="text-sm mt-2">
                In addition, I have a proven track record of mentoring students,
                helping them with conceptual programming skills, interview
                preparation, providing problem-solving strategies, and enhancing
                their logical reasoning abilities.
              </p>
            </ProfileSection>

            <ProfileSection title="Topics" />
            <ProfileSection title="Skills" />
            <ProfileSection title="Education" />
            <ProfileSection title="Work Experience" />
            {/* <ProfileSection title="Fluent in" /> */}
          </div>

          {/* Right Services Section */}
          <div className="md:col-span-2">
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium mb-4">Services Available</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="rounded-full bg-gray-200">
                  All
                </Badge>
                <Badge variant="outline" className="rounded-full bg-gray-200">
                  1:1 Call
                </Badge>
                <Badge variant="outline" className="rounded-full bg-gray-200">
                  Priority DM
                </Badge>
                <Badge variant="outline" className="rounded-full bg-gray-200">
                  Package
                </Badge>
                <Badge variant="outline" className="rounded-full bg-gray-200">
                  Digital product
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ServiceCard
                  type="1:1 Call"
                  title="Mock Interview"
                  description="To make you confident and ready for those tough questions"
                  duration="30 Mins"
                  price="₹2300+"
                />

                <ServiceCard
                  type="1:1 Call"
                  title="Beginner's Guide to Software Engineering & QA"
                  description="Unlock the full potential of your testing processes with expertise"
                  duration="30 Mins"
                  price="₹2300+"
                />

                <ServiceCard
                  type="Digital Product"
                  title="Namaste Javascript"
                  description="Best JavaScript tutorial series for beginners"
                  episodes="21 Episodes"
                  price="₹2300+"
                />

                <ServiceCard
                  type="1:1 Call"
                  title="In Depth CV Review"
                  description="To enhance your CV and boost your chances of landing your dream job"
                  duration="30 Mins"
                  price="₹2300+"
                />

                <ServiceCard
                  type="Priority DM"
                  title="CV Review"
                  description="Urgent questions ? Get priority answers now !"
                  duration="30 Mins"
                  price="₹2300+"
                />

                <ServiceCard
                  type="Priority DM"
                  title="Any Questions ?"
                  description="Got Questions ? I got Answers"
                  duration="30 Mins"
                  price="₹2300+"
                />
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-4">Package</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PackageCard
                    title="Mock Interview"
                    items={[
                      {
                        name: "DSA Roadmap",
                        type: "Video Meeting",
                        count: 1,
                      },
                      {
                        name: "DSA Roadmap",
                        type: "Video Meeting",
                        count: 1,
                      },
                      {
                        name: "DSA Roadmap",
                        type: "Video Meeting",
                        count: 1,
                      },
                    ]}
                    duration="30 Mins"
                    price="₹2300+"
                  />

                  <PackageCard
                    title="Placement season special"
                    description="Prepare for those grueling questions with ease"
                    items={[
                      {
                        name: "CV Review",
                        type: "Video Priority DM",
                        count: 1,
                      },
                      {
                        name: "Discovery Call",
                        type: "Video Meeting",
                        count: 1,
                      },
                      {
                        name: "Mock Interview",
                        type: "Video Meeting",
                        count: 2,
                      },
                      {
                        name: "Google Interview Questions",
                        type: "Note-Q&A",
                        count: 1,
                      },
                    ]}
                    duration="30 Mins"
                    price="₹2300+"
                  />
                </div>
              </div>
            </div>

            {/* Ratings and Testimonials */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-6">Ratings And Feedback</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border rounded-lg p-4 flex justify-center items-center">
                  <img
                    src="/placeholder.svg?height=100&width=180"
                    alt="Ratings"
                    className="h-24"
                  />
                </div>

                <div className="bg-white border rounded-lg p-4 flex flex-col justify-center items-center">
                  <div className="text-3xl font-bold">4.9/5</div>
                  <div className="text-gray-500">10 Ratings</div>
                </div>

                <div className="bg-white border rounded-lg p-4 flex flex-col justify-center items-center">
                  <div className="text-3xl font-bold">10</div>
                  <div className="text-gray-500">Testimonials</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TestimonialCard
                  rating={5}
                  text="I really want to thank Mrs. Vidhi for her support in helping me draft e-mails to PIs. I want to thank her for her encouragement and helping me realise the research topics I wish to pursue in future. Vidhi doesn't believe in showing off and she is there to genuinely help you navigate around this career without much expectations in return. Hard to find mentors like her."
                  author="Keerthi Sasidharan"
                  date="11th August, 2024"
                  highlighted
                />

                <TestimonialCard
                  rating={5}
                  text="Their guidance is both insightful and encouraging and tailored to my goals. Thanks for the session."
                  author="Afsal Madathingal"
                  date="21st June, 2025"
                />
              </div>

              <div className="flex justify-center mt-6">
                <Dialog
                  open={isTestimonialsOpen}
                  onOpenChange={setIsTestimonialsOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-md">
                      Show All Reviews
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] p-0">
                    <TestimonialsModal
                      onClose={() => setIsTestimonialsOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

function NavItem({ icon, label, badge }: NavItemProps) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100">
      {icon}
      <span>{label}</span>
      {badge && (
        <span className="ml-auto bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </div>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  active?: boolean;
}

function NavLink({ href, label, active }: NavLinkProps) {
  return (
    <a
      href={href}
      className={`px-6 py-4 font-medium ${
        active ? "border-b-2 border-black" : ""
      }`}
    >
      {label}
    </a>
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
  episodes?: string;
  price: string;
}

function ServiceCard({
  type,
  title,
  description,
  duration,
  episodes,
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
          <span className="text-sm">{duration || episodes}</span>
          {episodes && <span className="text-xs text-gray-500">5 lessons</span>}
        </div>

        <Button
          variant="outline"
          className="rounded-full bg-gray-200 border-gray-300"
          onClick={() => navigate("/seeker/mentorservice")}
        >
          {price} <ChevronUp className="h-4 w-4 ml-1 rotate-90" />
        </Button>
      </div>
    </div>
  );
}

interface PackageCardProps {
  title: string;
  description?: string;
  items: { name: string; type: string; count: number }[];
  duration: string;
  price: string;
}

function PackageCard({
  title,
  description,
  items,
  duration,
  price,
}: PackageCardProps) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <Badge
        variant="outline"
        className="mb-2 bg-red-100 text-red-800 border-red-200"
      >
        Package
      </Badge>
      <h4 className="font-bold mb-1">{title}</h4>
      {description && (
        <p className="text-sm text-gray-600 mb-2">{description}</p>
      )}

      <div className="space-y-2 my-4">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-xs text-gray-500">{item.type}</div>
            </div>
            <Badge variant="outline" className="bg-gray-100">
              x {item.count}
            </Badge>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-100 p-1 rounded">
            <Clock className="h-4 w-4 text-yellow-800" />
          </div>
          <span className="text-sm">{duration}</span>
        </div>

        <Button
          variant="outline"
          className="rounded-full bg-gray-200 border-gray-300"
        >
          {price} <ChevronUp className="h-4 w-4 ml-1 rotate-90" />
        </Button>
      </div>
    </div>
  );
}

interface TestimonialCardProps {
  rating: number;
  text: string;
  author: string;
  date: string;
  highlighted?: boolean;
}

function TestimonialCard({
  rating,
  text,
  author,
  date,
  highlighted,
}: TestimonialCardProps) {
  return (
    <div
      className={`p-4 rounded-lg ${
        highlighted ? "border-2 border-blue-500" : "bg-gray-50"
      }`}
    >
      <div className="flex items-center mb-2">
        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        <span className="ml-1 font-medium">{rating}/5</span>
      </div>
      <p className="text-sm mb-4">{text}</p>
      <div className="font-medium">{author}</div>
      <div className="text-xs text-gray-500">{date}</div>
    </div>
  );
}
