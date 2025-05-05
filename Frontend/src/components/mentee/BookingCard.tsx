import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import DigitalProductModal from "@/components/modal/DocumentModal";
import PriorityDMModal from "@/components/modal/PriorityDMModal";

interface Booking {
  id: string;
  serviceId: string;
  mentorName: string;
  mentorImage: string;
  mentorId: string;
  title: string;
  technology: string;
  date: string;
  time: string;
  price: number;
  status: string;
  rating?: number;
  feedback?: string;
  serviceType: string;
  oneToOneType?: string | null;
  digitalProductType?: string | null;
}

interface BookingCardProps {
  booking: Booking;
  type: "upcoming" | "completed";
  navigateToProfile?: () => void;
  onFeedbackClick?: () => void;
}

export default function BookingCard({
  booking,
  type,
  navigateToProfile,
  onFeedbackClick,
}: BookingCardProps) {
  const [isDigitalProductModalOpen, setIsDigitalProductModalOpen] =
    useState(false);
  const [isPriorityDMModalOpen, setIsPriorityDMModalOpen] = useState(false);

  // Display both service type and subtype if available
  const getServiceTypeDetails = () => {
    let mainType = "";
    const serviceType = booking.serviceType.toLowerCase().replace(/-/g, "");

    switch (serviceType) {
      case "1-1call":
      case "11call":
      case "1:1call":
        mainType = "1:1 Call";
        break;
      case "digitalproducts":
      case "digitalproduct":
        mainType = "Digital Product";
        break;
      case "prioritydm":
        mainType = "Direct Message";
        break;
      default:
        mainType = booking.serviceType;
    }

    let subType = "";
    if (
      (serviceType === "1-1call" ||
        serviceType === "11call" ||
        serviceType === "1:1call") &&
      booking.oneToOneType
    ) {
      subType = booking.oneToOneType;
    } else if (
      (serviceType === "digitalproducts" || serviceType === "digitalproduct") &&
      booking.digitalProductType
    ) {
      subType = booking.digitalProductType;
    }

    if (subType) {
      return `${mainType} - ${subType}`;
    }
    return mainType;
  };

  // Check if this is a digital document
  const isDigitalDocument = () => {
    const serviceType = booking.serviceType.toLowerCase().replace(/-/g, "");
    return (
      (serviceType === "digitalproducts" || serviceType === "digitalproduct") &&
      booking.digitalProductType === "documents"
    );
  };

  // Check if this is a priority DM
  const isPriorityDM = () => {
    const serviceType = booking.serviceType.toLowerCase().replace(/-/g, "");
    return serviceType === "prioritydm";
  };

  // Handle card click
  const handleCardClick = () => {
    if (isDigitalDocument()) {
      setIsDigitalProductModalOpen(true);
    } else if (isPriorityDM()) {
      setIsPriorityDMModalOpen(true);
    }
  };

  return (
    <>
      <div
        className={`bg-white rounded-lg shadow-md overflow-hidden max-w-[250px] ${
          isDigitalDocument() || isPriorityDM()
            ? "cursor-pointer hover:shadow-lg transition-shadow"
            : ""
        }`}
        onClick={handleCardClick}
      >
        <div className="bg-red-500 p-4">
          <div className="flex items-center gap-4">
            <img
              src={booking.mentorImage}
              alt={booking.mentorName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="text-white font-semibold">{booking.mentorName}</h3>
              <Button
                variant="outline"
                size="sm"
                className="mt-1 bg-white hover:bg-gray-100 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  if (navigateToProfile) navigateToProfile();
                }}
              >
                Profile
              </Button>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h4 className="font-semibold text-lg">{booking.title}</h4>
          <p className="font-semibold text-gray-600 text-sm">
            {getServiceTypeDetails()}
          </p>
          <p className="text-gray-600">{booking.technology}</p>
          <div className="flex flex-col justify- mt-2">
            <div className="flex justify-between gap-4">
              <p className="text-sm text-gray-600">{booking.date}</p>
              <p className="text-sm text-gray-600">{booking.time}</p>
            </div>
            <p className="font-semibold py-2">₹{booking.price}/-</p>
          </div>
          <div className="flex justify-between">
            <div>
              {type === "upcoming" ? (
                <div className="mt-4">
                  <span className="px-5 py-2 bg-green-500 text-white rounded-full text-sm">
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </span>
                </div>
              ) : (
                <div className="mt-4 flex justify-between items-center">
                  {booking.rating ? (
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{booking.rating}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                  ) : null}
                  {!booking.feedback && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onFeedbackClick) onFeedbackClick();
                      }}
                      className="bg-orange-500 text-white hover:bg-orange-600 rounded-full"
                    >
                      Feedback
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Digital Product Modal */}
      {isDigitalDocument() && (
        <DigitalProductModal
          isOpen={isDigitalProductModalOpen}
          onClose={() => setIsDigitalProductModalOpen(false)}
          serviceId={booking.serviceId}
          title={booking.title}
          productType={booking.digitalProductType || "Document"}
        />
      )}

      {/* Priority DM Modal */}
      {isPriorityDM() && (
        <PriorityDMModal
          isOpen={isPriorityDMModalOpen}
          onClose={() => setIsPriorityDMModalOpen(false)}
          serviceId={booking.serviceId}
          title={booking.title}
          productType="Direct Message"
        />
      )}
    </>
  );
}
