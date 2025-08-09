// import { Button } from "@/components/ui/button";
// import DummyImage from "@/assets/DummyProfile.jpg";
// import { ProfilePicture } from "@/components/users/SecureMedia";

// interface Service {
//   _id: string; // Added _id
//   type: string;
//   title: string;
//   shortDescription: string;
//   longDescription: string;
//   duration: string;
//   price: number;
//   amount: number;
// }

// interface Mentor {
//   _id: string; // Added _id
//   name: string;
//   profileImage?: string;
//   profilePicture?: string;
//   skills?: string[];
// }

// interface BookingDetailsProps {
//   onConfirmClick: () => void;
//   service?: Service;
//   mentor?: Mentor;
// }

// export default function BookingDetails({
//   onConfirmClick,
//   service,
//   mentor,
// }: BookingDetailsProps) {
//   if (!service || !mentor) {
//     return <div>Service or mentor data is missing.</div>;
//   }

//   return (
//     <div className="rounded-3xl overflow-hidden bg-gray-100">
//       <div className="flex flex-row items-center justify-center gap-10 p-8">
//         <div className="flex flex-col items-start">
//           <div className="w-32 h-32 rounded-full overflow-hidden mb-2">
//             {/* <img
//               src={mentor.profileImage || mentor.profilePicture || DummyImage}
//               alt={mentor.name}
//               className="w-full h-full object-cover"
//             /> */}
//             <ProfilePicture
//               profilePicture={mentor?.profilePicture || DummyImage}
//               userName={`${mentor.name}`}
//               size="xl"
//             />
//           </div>
//           <h2 className="text-xl font-bold">{mentor.name}</h2>
//         </div>

//         <div className="flex items-center">
//           <h1 className="text-4xl font-semibold">{service.title}</h1>
//         </div>
//       </div>

//       <div className="flex justify-between items-center px-8 py-4 border-t border-gray-200">
//         <div className="text-sm">{service.duration} Meeting</div>
//         <Button
//           variant="outline"
//           className="rounded-full border-green-400 flex items-center gap-2"
//           onClick={onConfirmClick}
//         >
//           ₹{service?.amount}
//           <svg
//             width="16"
//             height="16"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M5 12H19M19 12L12 5M19 12L12 19"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         </Button>
//       </div>

//       <div className="bg-black text-white p-8">
//         <div className="mb-8">
//           <h3 className="text-xl font-semibold mb-4">About Service</h3>
//           <p className="text-gray-300">{service.shortDescription}</p>
//         </div>
//         {service.longDescription && (
//           <div className="mb-8">
//             <h3 className="text-xl font-semibold mb-4">Description</h3>
//             <p className="text-gray-300">{service.longDescription}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DummyImage from "@/assets/DummyProfile.jpg";
import { ProfilePicture } from "@/components/users/SecureMedia";
import {
  Clock,
  Video,
  MessageSquare,
  BookOpen,
  Star,
  Award,
  Sparkles,
  ArrowRight,
  DollarSign,
  Calendar,
  Target,
} from "lucide-react";

interface Service {
  _id: string;
  type: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  duration: string;
  price: number;
  amount: number;
}

interface Mentor {
  _id: string;
  name: string;
  profileImage?: string;
  profilePicture?: string;
  skills?: string[];
  workRole?: string;
  work?: string;
  badge?: string;
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
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
          <Award className="w-10 h-10 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Missing Information
        </h3>
        <p className="text-gray-600 text-center max-w-sm">
          Service or mentor data is missing. Please try again.
        </p>
      </div>
    );
  }

  // Get service type configuration
  const getServiceTypeConfig = (type: string) => {
    switch (type) {
      case "1-1Call":
        return {
          icon: <Video className="w-6 h-6" />,
          gradient: "bg-gradient-to-r from-blue-500 to-indigo-500",
          label: "1:1 Video Call",
          bgGradient: "from-blue-50 to-indigo-50",
        };
      case "priorityDM":
        return {
          icon: <MessageSquare className="w-6 h-6" />,
          gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
          label: "Priority DM",
          bgGradient: "from-purple-50 to-pink-50",
        };
      case "DigitalProducts":
        return {
          icon: <BookOpen className="w-6 h-6" />,
          gradient: "bg-gradient-to-r from-green-500 to-emerald-500",
          label: "Digital Product",
          bgGradient: "from-green-50 to-emerald-50",
        };
      default:
        return {
          icon: <Sparkles className="w-6 h-6" />,
          gradient: "bg-gradient-to-r from-gray-500 to-gray-600",
          label: "Service",
          bgGradient: "from-gray-50 to-gray-100",
        };
    }
  };

  // Get mentor badge configuration
  const getBadgeConfig = (badge: string) => {
    switch (badge?.toLowerCase()) {
      case "premium":
        return {
          gradient: "bg-gradient-to-r from-purple-500 to-blue-500",
          icon: <Award className="w-3 h-3" />,
          label: "Premium",
        };
      case "expert":
        return {
          gradient: "bg-gradient-to-r from-orange-500 to-red-500",
          icon: <Target className="w-3 h-3" />,
          label: "Expert",
        };
      default:
        return {
          gradient: "bg-gradient-to-r from-gray-500 to-gray-600",
          icon: <Sparkles className="w-3 h-3" />,
          label: badge || "Mentor",
        };
    }
  };

  const serviceConfig = getServiceTypeConfig(service.type);
  const badgeConfig = getBadgeConfig(mentor.badge || "");

  return (
    <Card className="border-0 shadow-2xl bg-white rounded-3xl overflow-hidden">
      <CardContent className="p-0">
        {/* Header Section with Gradient Background */}
        <div
          className={`bg-gradient-to-r ${serviceConfig.bgGradient} p-8 relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300  to-transparent"></div>

          <div className="relative z-0 flex flex-col lg:flex-row items-center gap-8">
            {/* Mentor Profile */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <ProfilePicture
                    profilePicture={
                      mentor?.profilePicture ||
                      mentor?.profileImage ||
                      DummyImage
                    }
                    userName={mentor.name}
                    size="xl"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Badge */}
                <div className="absolute -bottom-2 -right-2">
                  <div
                    className={`${badgeConfig.gradient} p-2 rounded-full shadow-lg border-2 border-white`}
                  >
                    {badgeConfig.icon}
                  </div>
                </div>
              </div>

              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {mentor.name}
                </h2>
                {mentor.workRole && mentor.work && (
                  <p className="text-gray-600 mb-2">
                    {mentor.workRole} @ {mentor.work}
                  </p>
                )}
                <Badge
                  className={`${badgeConfig.gradient} text-white border-0 px-3 py-1 rounded-full text-sm font-semibold`}
                >
                  <span className="flex items-center gap-1">
                    {badgeConfig.icon}
                    {badgeConfig.label}
                  </span>
                </Badge>
              </div>
            </div>

            {/* Service Title and Type */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <div
                  className={`${serviceConfig.gradient} p-3 rounded-2xl shadow-lg`}
                >
                  <div className="text-white">{serviceConfig.icon}</div>
                </div>
                <Badge
                  className={`${serviceConfig.gradient} text-white border-0 px-4 py-2 rounded-full text-sm font-semibold`}
                >
                  {serviceConfig.label}
                </Badge>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {service.title}
              </h1>

              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                {service.shortDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Service Details Section */}
        <div className="p-8 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Service Info */}
            <div className="flex items-center gap-6">
              {service.duration && (
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="font-medium">
                    {service.duration} Session
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-gray-600">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </div>
                <span className="font-medium">4.8 Rating</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="font-medium">Instant Booking</span>
              </div>
            </div>

            {/* Price and CTA */}
            <div className="flex items-center ">
              <Button
                onClick={onConfirmClick}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-8 py-3  font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <div className="flex items-center gap-2 text-3xl font-bold text-white p-8">
                  <span>₹{service?.amount}</span>
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* About Service Section */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-8">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              About This Service
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              {service.shortDescription}
            </p>
          </div>

          {service.longDescription && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <BookOpen className="w-6 h-6" />
                </div>
                Detailed Description
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                {service.longDescription}
              </p>
            </div>
          )}

          {/* Skills */}
          {mentor.skills && mentor.skills.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Target className="w-6 h-6" />
                </div>
                Mentor Expertise
              </h3>
              <div className="flex flex-wrap gap-3">
                {mentor.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors px-4 py-2 text-sm"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
