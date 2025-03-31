import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import SreeImg from "@/assets/Sree.jpeg";
import JasnaImg from "@/assets/Jasna.jpeg";
import JithinImg from "@/assets/Jithin.jpeg";
import AnotaImg from "@/assets/Anita.jpeg";
interface ServiceCardProps {
  title: string;
}

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
    <div className="h-32 bg-gradient-to-r from-red-400 via-green-400 to-blue-400"></div>
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
      <img
        src={image}
        alt={name}
        className="w-20 h-20 rounded-full border-4 border-white"
      />
    </div>
    <div className="bg-white pt-16 pb-4 px-4 text-center">
      <Button variant="outline" className="mb-2">
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

//==>>>>>>>>>>>>>
const MenteeDashboard: React.FC = () => {
  return (
    <>
      <div className="px-24">
        <div className="bg-gray-500 rounded-xl p-24 text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Get Subscription Get 1000 Coins
          </h2>
          <Button variant="default" className="bg-black text-white">
            Subscribe
          </Button>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            Explore the Services You Need To Get Support
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <ServiceCard title="Intership Preparation" />
            <ServiceCard title="Mock Interview" />
            <ServiceCard title="Resume Review" />
            <ServiceCard title="One - One Sessions" />
            <ServiceCard title="Project Guideness" />
            <ServiceCard title="Refferal" />
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
              image="/js-card.png"
            />
            <CourseCard
              title="Node.js"
              subtitle="Namaste Node JS"
              episodes="3 Season"
              rating={4.7}
              views="3k"
              image="/node-card.png"
            />
            <CourseCard
              title="JavaScript"
              subtitle="Namaste JavaScipt"
              episodes="10 Episodes"
              rating={4.7}
              views="5k"
              image="/js-card.png"
            />
            <CourseCard
              title="Node.js"
              subtitle="Namaste Node JS"
              episodes="3 Season"
              rating={4.7}
              views="3k"
              image="/node-card.png"
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
    </>
  );
};

export default MenteeDashboard;
