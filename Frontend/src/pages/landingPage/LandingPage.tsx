// src/pages/landingPage/LandingPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import {
  GraduationCap,
  Users,
  MessageSquare,
  BarChart,
  Star,
} from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import SimpleContainer from "@/common/Container";
import Banner from "../../assets/Banner1.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
const features = [
  {
    icon: GraduationCap,
    title: "Expert Mentorship",
    description:
      "Connect with industry professionals and gain valuable insights",
  },
  {
    icon: Users,
    title: "Personalized Matching",
    description: "Find the perfect mentor based on your goals and interests",
  },
  {
    icon: MessageSquare,
    title: "Seamless Communication",
    description: "Stay connected through our integrated messaging platform",
  },
  {
    icon: BarChart,
    title: "Progress Tracking",
    description: "Monitor your growth with detailed progress analytics",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    avatar: "SJ",
    content:
      "Mentor One helped me transition into tech. My mentor provided invaluable guidance throughout my journey.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Product Manager",
    avatar: "MC",
    content:
      "The mentorship I received was transformative. I gained practical insights that accelerated my career growth.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer",
    avatar: "ER",
    content:
      "Finding a mentor in my field was easy. The platform's matching system is spot-on!",
    rating: 5,
  },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {[...Array(rating)].map((_, index) => (
        <Star
          key={index}
          className="w-3.5 h-3.5 text-yellow-400 fill-current"
        />
      ))}
    </div>
  );

  const words = [
    {
      text: "Frequntly",
      className: " dark:text-black dark:text-white",
    },
    {
      text: "Asked",
      className: " dark:text-black dark:text-white",
    },
    {
      text: "Questions.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-black text-white pt-16 md:pt-24 pb-12 md:pb-20 mt-16 relative overflow-hidden dark:bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/40 z-10" />
        <SimpleContainer className="relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="max-w-xl mx-auto px-4 md:px-0">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Find Your Perfect Mentor
              </h1>
              <p className="text-xl md:text-2xl text-white/85 mb-6 font-normal leading-relaxed">
                Connect with experienced professionals who can guide you towards
                success
              </p>
              <Button
                onClick={handleGetStarted}
                className="bg-white text-black px-8 py-3 text-lg font-semibold rounded-lg hover:bg-white/90 transition-all"
              >
                Get Started
              </Button>
            </div>
            <div className="max-w-xl mx-auto px-4 md:px-0">
              <img
                src={Banner}
                alt="Mentorship"
                className="w-full max-h-[500px] object-cover shadow-lg scale-90 md:scale-100 transition-transform duration-300"
              />
            </div>
          </div>
        </SimpleContainer>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-white dark:text-white dark:bg-gray-900">
        <SimpleContainer>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2">
            Why Choose MENTOR ONE?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground text-center mb-10 max-w-2xl mx-auto leading-relaxed">
            Experience the power of personalized mentorship with our
            comprehensive platform
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="h-full border hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mx-auto">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </SimpleContainer>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-20 bg-gray-50 dark:text-white dark:bg-gray-900">
        <SimpleContainer>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2">
            Success Stories
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground text-center mb-10 max-w-2xl mx-auto leading-relaxed">
            Hear from our community members who have transformed their careers
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="h-full border hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="w-12 h-12 bg-primary text-white font-semibold">
                      {testimonial.avatar}
                    </Avatar>
                    <div className="ml-3">
                      <h3 className="text-lg font-bold">{testimonial.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-base italic mb-3 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  {renderStars(testimonial.rating)}
                </CardContent>
              </Card>
            ))}
          </div>
        </SimpleContainer>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/40 z-10" />
        <SimpleContainer className="text-center max-w-3xl mx-auto relative z-20">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg md:text-xl text-white/85 mb-6 font-normal leading-relaxed">
            Join our community of mentors and mentees today
          </p>
          <Button
            onClick={handleGetStarted}
            className="bg-white text-black px-8 py-3 text-lg font-semibold rounded-lg hover:bg-white/90 transition-all"
          >
            Get Started Now
          </Button>
        </SimpleContainer>
      </section>
      <section className="mx-80 py-20 md:py-20 bg-gray-10 dark:text-white">
        {/* <h1>Frequently Asked Questions</h1> */}
        <TypewriterEffectSmooth words={words} />
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              Yes. It comes with default styles that matches the other
              components&apos; aesthetic.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it animated?</AccordionTrigger>
            <AccordionContent>
              Yes. It&apos;s animated by default, but you can disable it if you
              prefer.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
