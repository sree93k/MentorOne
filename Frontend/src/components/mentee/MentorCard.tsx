import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Mentor {
  userId: string;
  mentorId: string;
  name: string;
  bio: string;
  role: string;
  work: string;
  workRole: string;
  profileImage?: string;
  badge: string;
  isBlocked: boolean;
  isApproved: string;
}

interface MentorCardProps {
  mentor: Mentor;
  navigateToProfile: () => void;
}

export default function MentorCard({
  mentor,
  navigateToProfile,
}: MentorCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{mentor.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <img
          src={mentor.profileImage || "/default-profile.png"}
          alt={mentor.name}
          className="w-24 h-24 rounded-full mb-4"
        />
        <p className="text-sm text-gray-600">
          {mentor.bio || "No bio available"}
        </p>
        Málaga, Spain
        <p className="text-sm font-medium mt-2">{mentor.role}</p>
        <p className="text-sm text-gray-500">{mentor.work}</p>
        <p className="text-sm text-gray-500">{mentor.workRole}</p>
        <p className="text-sm text-gray-500">Badge: {mentor.badge}</p>
        <Button
          className="mt-4"
          onClick={navigateToProfile}
          disabled={mentor.isBlocked || mentor.isApproved !== "Approved"}
        >
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
}
