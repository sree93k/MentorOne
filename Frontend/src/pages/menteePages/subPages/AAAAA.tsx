import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookingDetails from "@/components/mentee/BookingDetails";
import BookingConfirm from "@/components/mentee/BookingConfirm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

interface Service {
  _id: string;
  type: string;
  title: string;
  description: string;
  duration: string;
  amount: number;
}

interface Mentor {
  _id: string;
  name: string;
  role: string;
  work: string;
  workRole: string;
  profileImage?: string;
  badge: string;
  isBlocked: boolean;
  isApproved: string;
  bio?: string;
  skills?: string[];
}

export default function MentorServicePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { service, mentor } = location.state || {};
  const { user, error, loading, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
  const menteeId = user?._id || null;

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !user) {
      toast.error("Please log in to book a service.");
      navigate("/login");
      return;
    }

    if (!service || !mentor || !service._id || !mentor.userData) {
      console.error("Missing or invalid service/mentor data:", {
        service,
        mentor,
      });
      toast.error("Service or mentor data is missing.");
      navigate(-1);
    } else {
      console.log("MentorServicePage service:", service);
      console.log("MentorServicePage mentor:", mentor);
    }
  }, [service, mentor, user, loading, isAuthenticated, navigate]);

  const handleConfirmClick = () => {
    console.log("BookingDetails Confirm clicked");
  };

  const handleBookingConfirm = (date: string, time: string) => {
    if (!menteeId) {
      toast.error("User not authenticated.");
      navigate("/login");
      return;
    }
    navigate("/seeker/checkout", {
      state: {
        service,
        mentor,
        selectedDate: date,
        selectedTime: time,
        menteeId,
      },
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div>
        <Button variant="ghost" className="pl-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-7 w-7" />
        </Button>
      </div>
      <div className="flex-1 flex flex-row justify-between gap-10 max-w-7xl mx-auto p-4">
        <div className="flex-[2] p-4">
          <BookingDetails
            onConfirmClick={handleConfirmClick}
            service={service}
            mentor={mentor}
          />
        </div>
        <div className="flex-1 p-4">
          <BookingConfirm onConfirm={handleBookingConfirm} />
        </div>
      </div>
    </div>
  );
}
