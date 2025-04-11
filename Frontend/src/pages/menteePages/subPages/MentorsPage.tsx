import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const categories = [
  "All",
  "General QnA",
  "Mock Interview",
  "Resume Review",
  "Career Guide",
  "Most Visited",
];

const mentors = [
  {
    id: 1,
    name: "Aswanth",
    role: "MERN stack Developer",
    company: "Zet1",
    image: "https://github.com/shadcn.png",
  },
  // Add more mentors...
];

export default function MentorsPage() {
  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Mentors</h1>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search" className="pl-10" />
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        {categories.map((category) => (
          <Button
            key={category}
            variant={category === "All" ? "default" : "outline"}
            size="sm"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6">Top Mentors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mentors.map((mentor) => (
            <Card key={mentor.id}>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={mentor.image} />
                    <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold">{mentor.name}</h3>
                  <p className="text-sm text-muted-foreground">{mentor.role}</p>
                  <Badge variant="outline" className="mt-2">
                    {mentor.company}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
