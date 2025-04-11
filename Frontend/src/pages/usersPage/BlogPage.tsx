import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";

const categories = [
  "All",
  "JavaScript",
  "Artificial Intelligence",
  "System Design",
  "Web Development",
  "FrontEnd Development",
  "Node JS",
];

const blogPosts = [
  {
    id: 1,
    title: "Don't use React imports like this. Use Wrapper Pattern instead",
    excerpt:
      "While working on a real-life project, I came across an inefficient React.js import strategy. Learn how to import right way!",
    author: {
      name: "Jasna Jaffer",
      role: "Passionate Developer",
      avatar: "https://github.com/shadcn.png",
    },
    date: "March 9",
    likes: 40,
    comments: 11,
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Blog</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search" className="pl-10" />
          </div>
          <Link to="/seeker/blogpost">Write Blog</Link>
        </div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={category === selectedCategory ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid gap-6">
        {blogPosts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
              <div className="flex gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{post.author.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {post.author.role}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto">
                      Follow
                    </Button>
                  </div>
                  <Link to={`/blog/${post.id}`}>
                    <h2 className="text-xl font-semibold mb-2 hover:text-primary">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{post.date}</span>
                    <span>👍 {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                </div>
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-48 h-32 object-cover rounded-lg"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
