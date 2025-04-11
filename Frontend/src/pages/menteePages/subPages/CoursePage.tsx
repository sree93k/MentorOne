import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const categories = [
  { name: "Data Science", count: "50K+ Mentees", active: false },
  { name: "Web Development", count: "72K+ Mentees", active: true },
  { name: "Communication", count: "30K+ Mentees", active: false },
  { name: "Leadership", count: "25K+ Mentees", active: false },
  { name: "IT Certifications", count: "40K+ Mentees", active: false },
  { name: "Cyber Security", count: "35K+ Mentees", active: false },
];

const technologies = [
  { name: "JavaScript", mentees: "20K+" },
  { name: "Node JS", mentees: "12K+" },
  { name: "React JS", mentees: "17K+" },
  { name: "MongoDB", mentees: "8K+" },
  { name: "Next JS", mentees: "4K+" },
  { name: "Express JS", mentees: "13K+" },
  { name: "CSS", mentees: "3K+" },
];

const courses = [
  {
    id: 1,
    title: "Complete Web Development",
    instructor: "Akshay Saini",
    rating: 4.4,
    price: 1890,
    originalPrice: 3500,
    image:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2831&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Basic Tutorial Web Development",
    instructor: "Hrash Surendran",
    rating: 4.3,
    price: 490,
    originalPrice: 1500,
    image:
      "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=2870&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Advanced Web Development",
    instructor: "Afsal Madathingal",
    rating: 4.7,
    price: 2890,
    originalPrice: 4999,
    image:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2832&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Front End Development",
    instructor: "Siva Prasad",
    rating: 4.2,
    price: 999,
    originalPrice: 3100,
    image:
      "https://images.unsplash.com/photo-1593720216276-0caa6452e004?q=80&w=2924&auto=format&fit=crop",
  },
];

export default function CoursesPage() {
  return (
    <div className="container py-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          All the skills you need in one place
        </h1>
        <p className="text-xl text-muted-foreground">
          From critical skills to technical topics, M1 supports your
          professional development.
        </p>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
        {categories.map((category) => (
          <Button
            key={category.name}
            variant={category.active ? "default" : "outline"}
            className="flex-none"
          >
            <div className="text-left">
              <div>{category.name}</div>
              <div className="text-xs opacity-70">{category.count}</div>
            </div>
          </Button>
        ))}
      </div>

      <div className="flex gap-4 mb-12 overflow-x-auto pb-4">
        {technologies.map((tech) => (
          <Badge
            key={tech.name}
            variant="outline"
            className="px-4 py-2 text-base"
          >
            {tech.name}
            <span className="ml-2 text-xs text-muted-foreground">
              {tech.mentees} Mentees
            </span>
          </Badge>
        ))}
        <Button size="icon" variant="outline">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardContent className="p-4">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold mb-2">{course.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {course.instructor}
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-semibold">{course.rating}</span>
                <div className="text-yellow-400">★★★★★</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">₹{course.price}</span>
                <span className="text-sm text-muted-foreground line-through">
                  ₹{course.originalPrice}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
