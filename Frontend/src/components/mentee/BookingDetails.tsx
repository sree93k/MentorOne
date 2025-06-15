import { Button } from "@/components/ui/button";
import DummyImage from "@/assets/DummyProfile.jpg";
import { useEffect } from "react";

interface Service {
  _id: string; // Added _id
  type: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  duration: string;
  price: number;
}

interface Mentor {
  _id: string; // Added _id
  name: string;
  profileImage?: string;
  profilePicture?: string;
  skills?: string[];
}

interface BookingDetailsProps {
  onConfirmClick: () => void;
  service?: Service;
  mentor?: Mentor;
}

export default function BookingDetails({
  onConfirmClick,
  service,
  mentor,
}: BookingDetailsProps) {
  if (!service || !mentor) {
    return <div>Service or mentor data is missing.</div>;
  }
  useEffect(() => {
    console.log("......        Booking details step 1 service", service);
    console.log(".......        Booking details step 1 mentor", mentor);
  });
  return (
    <div className="rounded-3xl overflow-hidden bg-gray-100">
      <div className="flex flex-row items-center justify-center gap-10 p-8">
        <div className="flex flex-col items-start">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-2">
            <img
              src={mentor.profileImage || mentor.profilePicture || DummyImage}
              alt={mentor.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-bold">{mentor.name}</h2>
        </div>

        <div className="flex items-center">
          <h1 className="text-4xl font-semibold">{service.title}</h1>
        </div>
      </div>

      <div className="flex justify-between items-center px-8 py-4 border-t border-gray-200">
        <div className="text-sm">{service.duration} Meeting</div>
        <Button
          variant="outline"
          className="rounded-full border-green-400 flex items-center gap-2"
          onClick={onConfirmClick}
        >
          ₹{service.amount}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>

      <div className="bg-black text-white p-8">
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">About Service</h3>
          <p className="text-gray-300">{service.shortDescription}</p>
        </div>
        {service.longDescription && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Description</h3>
            <p className="text-gray-300">{service.longDescription}</p>
          </div>
        )}
      </div>
    </div>
  );
}
