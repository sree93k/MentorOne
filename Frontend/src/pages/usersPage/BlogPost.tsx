import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ThumbsUp, MessageSquare, Share2 } from "lucide-react";

export default function BlogPost() {
  const { id } = useParams();

  return (
    <div className="container py-6">
      <Link to="/seeker/blog">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blogs
        </Button>
      </Link>

      <Card>
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <Avatar className="h-12 w-12">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JJ</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">Jasna Jaffer</h3>
              <p className="text-sm text-muted-foreground">March 9, 2024</p>
            </div>
            <Button className="ml-auto">Follow</Button>
          </div>

          <h1 className="text-3xl font-bold mb-4">
            Don't use React imports like this. Use Wrapper Pattern instead
          </h1>

          <img
            src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop"
            alt="Blog cover"
            className="w-full h-[400px] object-cover rounded-lg mb-8"
          />

          <div className="prose prose-lg max-w-none">
            <p>
              While working on a real-life project, I came across an inefficient
              React.js import strategy. In this blog, I'll walk you through the
              problem and how I solved it. Read how I improved the design by
              creating a more flexible approach using the Wrapper Pattern.
            </p>
          </div>

          <div className="flex items-center gap-6 mt-8 pt-8 border-t">
            <Button variant="outline" size="lg">
              <ThumbsUp className="h-5 w-5 mr-2" />
              Like
            </Button>
            <Button variant="outline" size="lg">
              <MessageSquare className="h-5 w-5 mr-2" />
              Comment
            </Button>
            <Button variant="outline" size="lg">
              <Share2 className="h-5 w-5 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
