import React from "react";
import { Link } from "react-router-dom"; // Assuming you're using react-router-dom for navigation
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPinOff, Home } from "lucide-react"; // Icons for the theme

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4 py-8 bg-gradient-to-br from-indigo-50 to-purple-50">
      <Card className="w-full max-w-md text-center p-8 shadow-xl rounded-lg border-none animate-fade-in-up">
        <CardHeader className="flex flex-col items-center justify-center mb-6">
          <div className="mb-4 text-purple-600">
            <MapPinOff className="h-24 w-24 animate-bounce-slow" />{" "}
            {/* Larger, thematic icon */}
          </div>
          <CardTitle className="text-6xl font-extrabold text-gray-800 tracking-tighter">
            404
          </CardTitle>
          <CardDescription className="text-xl font-semibold text-gray-600 mt-2">
            Page Not Found
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed max-w-sm mx-auto">
            Oops! It seems you've wandered off the mentor-guided path. The page
            you're looking for might have been moved, deleted, or never existed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg text-md transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              <Link to="/">
                <Home className="mr-2 h-5 w-5" />
                Go to Homepage
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;
