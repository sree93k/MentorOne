import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Video, Send } from "lucide-react";

export default function MentorProfile() {
  return (
    <div className="container py-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">Anita Benny</h2>
                <p className="text-sm text-muted-foreground">
                  Python Developer @ Flipkart
                </p>
                <p className="text-sm text-muted-foreground">
                  2 years Experience
                </p>
                <Button className="mt-4 w-full">Follow</Button>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="icon">
                    <img
                      src="/linkedin.svg"
                      alt="LinkedIn"
                      className="h-4 w-4"
                    />
                  </Button>
                  <Button variant="outline" size="icon">
                    <img src="/github.svg" alt="GitHub" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-9">
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Services Available</h3>
            <div className="flex gap-2">
              <Badge variant="outline">All</Badge>
              <Badge>1:1 Call</Badge>
              <Badge variant="outline">Priority DM</Badge>
              <Badge variant="outline">Package</Badge>
              <Badge variant="outline">Digital product</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <Badge>1:1 Call</Badge>
                <h4 className="text-lg font-semibold mt-4">Mock Interview</h4>
                <p className="text-sm text-muted-foreground">
                  To make you confident and ready for those tough questions
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">30 Mins</span>
                  <Video className="h-4 w-4 ml-4" />
                  <span className="text-sm">Video Meeting</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-semibold">₹2300+</span>
                  <Button size="sm">
                    <Send className="h-4 w-4 mr-2" />
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
