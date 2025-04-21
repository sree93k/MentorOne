import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import SreeImg from "@/assets/Sree.jpeg";
import JasnaImg from "@/assets/Jasna.jpeg";
import JithinImg from "@/assets/Jithin.jpeg";
import AnotaImg from "@/assets/Anita.jpeg";
import React, { useEffect, useState, useId } from "react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { BackgroundBeams } from "@/components/ui/background-beams";
import Image from "next/image";
import { motion } from "motion/react";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import logo from "@/assets/logo.png";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { SparklesCore } from "@/components/ui/sparkles";
import { cn } from "@/lib/utils";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import VueImg from "@/assets/vue.jpg";
import ReactImg from "@/assets/react.jpg";
import AnglularImg from "@/assets/angular.jpg";
import FlutterImg from "@/assets/Flutter.png";
const words1 = `Oxygen gets you high. In a catastrophic emergency, we're taking giant, panicked breaths. Suddenly you become euphoric, docile. You accept your fate. `;
interface ServiceCardProps {
  title: string;
}

export const projects = [
  {
    title: "Stripe",
    description:
      "A technology company that builds economic infrastructure for the internet.",
    link: "https://stripe.com",
  },
  {
    title: "Netflix",
    description:
      "A streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.",
    link: "https://netflix.com",
  },
  {
    title: "Google",
    description:
      "A multinational technology company that specializes in Internet-related services and products.",
    link: "https://google.com",
  },
  {
    title: "Meta",
    description:
      "A technology company that focuses on building products that advance Facebook's mission of bringing the world closer together.",
    link: "https://meta.com",
  },
  {
    title: "Amazon",
    description:
      "A multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
    link: "https://amazon.com",
  },
  {
    title: "Microsoft",
    description:
      "A multinational technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.",
    link: "https://microsoft.com",
  },
];
const testimonials = [
  {
    quote:
      "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
    name: "Charles Dickens",
    title: "A Tale of Two Cities",
  },
  {
    quote:
      "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
    name: "William Shakespeare",
    title: "Hamlet",
  },
  {
    quote: "All that we see or seem is but a dream within a dream.",
    name: "Edgar Allan Poe",
    title: "A Dream Within a Dream",
  },
  {
    quote:
      "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    name: "Jane Austen",
    title: "Pride and Prejudice",
  },
  {
    quote:
      "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
    name: "Herman Melville",
    title: "Moby-Dick",
  },
];
interface CourseCardProps {
  title: string;
  subtitle: string;
  episodes: string;
  rating: number;
  views: string;
  image: string;
}

interface MentorCardProps {
  name: string;
  role: string;
  rating: number;
  image: string;
  services: string[];
}

const CourseCard = ({
  title,
  subtitle,
  episodes,
  rating,
  views,
  image,
}: CourseCardProps) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm">
    <div className="relative">
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <div className="absolute bottom-2 left-2 bg-white rounded-full px-3 py-1">
        <span className="text-sm font-medium">{title}</span>
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-medium mb-1">{subtitle}</h3>
      <p className="text-sm text-gray-600 mb-2">{episodes}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-red-500 font-medium mr-1">{rating}</span>
          {"★".repeat(Math.floor(rating))}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span>{views}</span>
          <ChevronRight size={20} />
        </div>
      </div>
    </div>
  </div>
);

const MentorCard = ({
  name,
  role,
  rating,
  image,
  services,
}: MentorCardProps) => (
  <div className="relative rounded-xl overflow-hidden">
    {/* <div className="h-32 bg-gradient-to-r from-red-400 via-green-400 to-blue-400"></div> */}
    <div className="h-40 bg-green-500"></div>
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
      <img
        src={image}
        alt={name}
        className="w-25 h-25 rounded-full border-4 border-white"
      />
    </div>
    <div className="bg-white pt-6 pb-4 px-4 text-center bg-yellow-300">
      <Button variant="outline" className="mb-2  bg-black text-white">
        View Profile
      </Button>
      <h3 className="font-medium">{name}</h3>
      <p className="text-sm text-gray-600 mb-2">{role}</p>
      <div className="flex items-center justify-center mb-2">
        <span className="text-red-500 font-medium mr-1">{rating}</span>
        {"★".repeat(Math.floor(rating))}
      </div>
      <p className="text-xs text-gray-500">{services.join(" | ")}</p>
    </div>
  </div>
);
const ServiceCard = ({ title }: ServiceCardProps) => (
  <div className="bg-white rounded-lg p-4 shadow-sm">
    <h3 className="text-lg font-medium">{title}</h3>
  </div>
);

const AceternityLogo = () => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 66 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-3 w-3 text-black dark:text-white"
    >
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="15"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
      />
    </svg>
  );
};

//==>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const grid = [
  {
    title: "Intership Preparation",
    description:
      "Our applications are HIPAA and SOC2 compliant, your data is safe with us, always.",
  },
  {
    title: "Mock Interview",
    description:
      "Schedule and automate your social media posts across multiple platforms to save time and maintain a consistent online presence.",
  },
  {
    title: "Resume Review",
    description:
      "Gain insights into your social media performance with detailed analytics and reporting tools to measure engagement and ROI.",
  },
  {
    title: "One - One Sessions",
    description:
      "Plan and organize your social media content with an intuitive calendar view, ensuring you never miss a post.",
  },
  {
    title: "Project Guideness",
    description:
      "Reach the right audience with advanced targeting options, including demographics, interests, and behaviors.",
  },
  {
    title: "Refferal",
    description:
      "Monitor social media conversations and trends to stay informed about what your audience is saying and respond in real-time.",
  },
];

export const Grid = ({
  pattern,
  size,
}: {
  pattern?: number[][];
  size?: number;
}) => {
  const p = pattern ?? [
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-0  -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r  [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 from-zinc-100/30 to-zinc-300/30 dark:to-zinc-900/30 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full  mix-blend-overlay dark:fill-white/10 dark:stroke-white/10 stroke-black/10 fill-black/10"
        />
      </div>
    </div>
  );
};

export function GridPattern({ width, height, x, y, squares, ...props }: any) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]: any) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}
//==>>>>>>>>>>>>>
const MenteeDashboard: React.FC = () => {
  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <>
      <div className="px-18">
        <div className="h-[35rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md ">
          <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
            Mentor ONE
          </h1>
          <div className="w-[40rem] h-40 relative">
            {/* Gradients */}
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

            {/* Core component */}
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={1200}
              className="w-full h-full"
              particleColor="#FFFFFF"
            />

            {/* Radial Gradient to prevent sharp edges */}
            <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
          </div>
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-12">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
            >
              <AceternityLogo />

              <span>Get Start Now</span>
            </HoverBorderGradient>
          </div>
        </div>

        <div className="px-24">
          <section className="mb-8 mt-6">
            <h2 className="text-xl font-bold mb-4">
              Explore the Services You Need To Get Support
            </h2>
            <div className="py-6 lg:py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 md:gap-2 max-w-7xl mx-auto">
                {grid.map((feature) => (
                  <div
                    key={feature.title}
                    className="relative bg-gradient-to-b dark:from-neutral-900 from-neutral-100 dark:to-neutral-950 to-white p-6 rounded-3xl overflow-hidden"
                  >
                    <Grid size={20} />
                    <p className="text-base font-bold text-neutral-800 dark:text-white relative z-20">
                      {feature.title}
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-4 text-base font-normal relative z-20">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <Button variant="outline" className="mt-4">
              More
            </Button>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Top Courses</h2>
            <div className="grid grid-cols-4 gap-4">
              <CourseCard
                title="JavaScript"
                subtitle="Namaste JavaScipt"
                episodes="10 Episodes"
                rating={4.7}
                views="5k"
                image={ReactImg}
              />
              <CourseCard
                title="Node.js"
                subtitle="Namaste Node JS"
                episodes="3 Season"
                rating={4.7}
                views="3k"
                image={AnglularImg}
              />
              <CourseCard
                title="JavaScript"
                subtitle="Namaste JavaScipt"
                episodes="10 Episodes"
                rating={4.7}
                views="5k"
                image={VueImg}
              />
              <CourseCard
                title="Node.js"
                subtitle="Namaste Node JS"
                episodes="3 Season"
                rating={4.7}
                views="3k"
                image={FlutterImg}
              />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Top Mentors</h2>
            <div className="grid grid-cols-4 gap-4">
              <MentorCard
                name="Anita Benny"
                role="Python Developer"
                rating={4.7}
                image={AnotaImg}
                services={[
                  "Mock Interview",
                  "One-to-one",
                  "Resume Review",
                  "Tutorial",
                ]}
              />
              <MentorCard
                name="Sreekuttan N"
                role="MERN Stack Developer"
                rating={4.7}
                image={SreeImg}
                services={[
                  "Mock Interview",
                  "One-to-one",
                  "Resume Review",
                  "Tutorial",
                ]}
              />
              <MentorCard
                name="Jasna Jaffer"
                role="Python Developer"
                rating={4.7}
                image={JasnaImg}
                services={[
                  "Mock Interview",
                  "One-to-one",
                  "Resume Review",
                  "Tutorial",
                ]}
              />
              <MentorCard
                name="Sreekuttan N"
                role="MERN Stack Developer"
                rating={4.7}
                image={JithinImg}
                services={[
                  "Mock Interview",
                  "One-to-one",
                  "Resume Review",
                  "Tutorial",
                ]}
              />
            </div>
          </section>
        </div>
        <section>
          <div className=" rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden mt-10 gap-4">
            <InfiniteMovingCards
              items={testimonials}
              direction="right"
              speed="slow"
            />
            <div className="w-full " style={{ marginLeft: "-150px" }}>
              <InfiniteMovingCards
                items={testimonials}
                direction="right"
                speed="fast"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default MenteeDashboard;
