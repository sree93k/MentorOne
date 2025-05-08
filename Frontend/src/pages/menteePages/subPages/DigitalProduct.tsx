import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getTutorialById,
  checkBookingStatus,
  createBooking,
} from "@/services/menteeService";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import PaymentModal from "@/components/modal/PaymentConfirmModal"; // Adjust path as needed

export default function DigitalProducts() {
  const { id } = useParams<{ id: string }>();
  const [tutorial, setTutorial] = useState<any>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchTutorialAndBookingStatus = async () => {
      if (!id) {
        setError("Tutorial ID is missing");
        return;
      }
      try {
        const [tutorialData, bookingStatus] = await Promise.all([
          getTutorialById(id),
          checkBookingStatus(id),
        ]);
        setTutorial(tutorialData);
        setIsBooked(bookingStatus);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError(err.message || "Failed to load tutorial or booking status");
      }
    };
    fetchTutorialAndBookingStatus();
  }, [id]);

  useEffect(() => {
    // Handle payment success redirect
    const query = new URLSearchParams(location.search);
    const paymentStatus = query.get("payment");
    const sessionId = query.get("session_id");
    if (
      paymentStatus === "success" &&
      sessionId &&
      id &&
      tutorial &&
      user?._id
    ) {
      const createBookingAfterPayment = async () => {
        try {
          await createBooking(id, tutorial.mentorId._id, sessionId);
          setIsBooked(true);
          // Clear query params
          navigate(`/digitalcontent/${id}`, { replace: true });
        } catch (err: any) {
          setError(err.message || "Failed to create booking after payment");
        }
      };
      createBookingAfterPayment();
    } else if (paymentStatus === "cancel") {
      setError("Payment was cancelled");
      navigate(`/digitalcontent/${id}`, { replace: true });
    }
  }, [location.search, id, tutorial, user, navigate]);

  const handleEnrollClick = () => {
    if (!tutorial || !user?._id) {
      setError("User or tutorial data is missing");
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handleStartLearningClick = () => {
    navigate(`/seeker/tutorials/${id}`);
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
  };

  if (error) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!tutorial || !user?._id) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  const mentorName = `${tutorial.mentorId.firstName} ${
    tutorial.mentorId.lastName || ""
  }`.trim();
  const company =
    tutorial.mentorId.professionalDetails?.company || "Unknown Company";
  const profilePicture =
    tutorial.mentorId.profilePicture ||
    "https://www.svgrepo.com/show/192247/man-user.svg";

  // Prepare data for PaymentModal
  const service = {
    _id: tutorial._id,
    title: tutorial.title,
    duration: "30 minutes", // Dummy duration for video tutorials
    amount: tutorial.amount,
  };

  const mentor = {
    _id: tutorial.mentorId._id,
    name: mentorName,
    userData: tutorial.mentorId._id, // Assuming userData is mentor's _id
  };

  // Use current date and dummy time for video tutorials
  const currentDate = new Date().toISOString().split("T")[0]; // e.g., "2025-05-03"
  const dummyTime = "12:00 PM"; // Matches slotIndex: 1 in PaymentModal

  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <main className="flex p-2 gap-8">
          <div>
            <Button
              variant="ghost"
              className="pl-0"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-7 w-7" />
            </Button>
          </div>
          <div className="w-2/3 p-8 pt-2 bg-white">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">{tutorial.title}</h2>
              <div className="flex items-center">
                <span className="text-red-500 font-bold mr-1">4.7</span>
                <div className="flex">
                  {[1, 2, 3, 4].map((star) => (
                    <svg
                      key={star}
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="gold"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M11.0489 3.92705C11.3483 3.00574 12.6517 3.00574 12.9511 3.92705L14.0206 7.21885C14.1545 7.63087 14.5385 7.90983 14.9717 7.90983H18.4329C19.4016 7.90983 19.8044 9.14945 19.0207 9.71885L16.2205 11.7533C15.87 12.0079 15.7234 12.4593 15.8572 12.8713L16.9268 16.1631C17.2261 17.0844 16.1717 17.8506 15.388 17.2812L12.5878 15.2467C12.2373 14.9921 11.7627 14.9921 11.4122 15.2467L8.61204 17.2812C7.82833 17.8506 6.77385 17.0844 7.0732 16.1631L8.14277 12.8713C8.27665 12.4593 8.12999 12.0079 7.7795 11.7533L4.97933 9.71885C4.19562 9.14945 4.59839 7.90983 5.56712 7.90983H9.02832C9.46154 7.90983 9.8455 7.63087 9.97937 7.21885L11.0489 3.92705Z" />
                    </svg>
                  ))}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="gold"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M11.0489 3.92705C11.3483 3.00574 12.6517 3.00574 12.9511 3.92705L14.0206 7.21885C14.1545 7.63087 14.5385 7.90983 14.9717 7.90983H18.4329C19.4016 7.90983 19.8044 9.14945 19.0207 9.71885L16.2205 11.7533C15.87 12.0079 15.7234 12.4593 15.8572 12.8713L16.9268 16.1631C17.2261 17.0844 16.1717 17.8506 15.388 17.2812L12.5878 15.2467C12.2373 14.9921 11.7627 14.9921 11.4122 15.2467L8.61204 17.2812C7.82833 17.8506 6.77385 17.0844 7.0732 16.1631L8.14277 12.8713C8.27665 12.4593 8.12999 12.0079 7.7795 11.7533L4.97933 9.71885C4.19562 9.14945 4.59839 7.90983 5.56712 7.90983H9.02832C9.46154 7.90983 9.8455 7.63087 9.97937 7.21885L11.0489 3.92705Z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 mt-2">
                {tutorial.shortDescription}{" "}
                {tutorial.longDescription && (
                  <button
                    className="text-blue-600 font-medium"
                    onClick={() => alert(tutorial.longDescription)}
                  >
                    Read More
                  </button>
                )}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Course Content</h3>
              <Accordion type="single" collapsible className="w-full">
                {tutorial.exclusiveContent.map((season: any, index: number) => (
                  <AccordionItem
                    key={season._id || index}
                    value={`season-${season._id || index}`}
                  >
                    <AccordionTrigger className="bg-gray-100 p-4 px-8 flex justify-between items-center rounded-md hover:no-underline">
                      <h1 className="font-medium text-left text-xl">
                        {season.season}
                      </h1>
                    </AccordionTrigger>
                    <AccordionContent className="mt-4 space-y-4">
                      {season.episodes.map((episode: any) => (
                        <div
                          key={episode._id}
                          className="flex gap-4 border-b pb-4"
                        >
                          <div className="flex-shrink-0 mt-1">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                width="24"
                                height="24"
                                rx="4"
                                fill="#F1F1F1"
                              />
                              <path
                                d="M16 12L10 16.5V7.5L16 12Z"
                                fill="black"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div>
                            <h5 className="font-medium">
                              {episode.episode} | {episode.title}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {episode.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          <div className="w-1/3 p-4 bg-white">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                <img
                  src={profilePicture}
                  alt={mentorName}
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">{mentorName}</h3>
              <p className="text-gray-600 mb-6">{company}</p>

              <div className="w-full max-w-xs">
                <div className="bg-purple-600 rounded-lg p-4 mb-6 flex items-center justify-center">
                  <div className="relative w-full h-32">
                    <div className="absolute inset-0">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute rounded-full border border-white opacity-20"
                          style={{
                            width: `${(i + 1) * 20}px`,
                            height: `${(i + 1) * 20}px`,
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      ))}
                    </div>
                    <div className="absolute right-0 bottom-0 bg-yellow-300 p-4 rounded-lg">
                      <span className="text-3xl font-bold">
                        {tutorial.technology?.slice(0, 2).toUpperCase() || "JS"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">
                      ₹{tutorial.amount}
                    </span>
                    <span className="text-gray-500 line-through">
                      ₹{tutorial.amount + 1800}
                    </span>
                  </div>
                  <div className="text-gray-800 font-medium">
                    Discount: ₹1800 OFF
                  </div>
                </div>

                {isBooked ? (
                  <Button
                    className="w-full py-6 text-lg bg-green-700 hover:bg-green-800 text-white rounded-full"
                    onClick={handleStartLearningClick}
                  >
                    Start Learning
                  </Button>
                ) : (
                  <Button
                    className="w-full py-6 text-lg bg-black hover:bg-gray-800 text-white rounded-full"
                    onClick={handleEnrollClick}
                  >
                    Enroll Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {tutorial && user?._id && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={handlePaymentModalClose}
          service={service}
          mentor={mentor}
          selectedDate={currentDate} // Current date for video tutorials
          selectedTime={dummyTime} // Dummy time for video tutorials
          menteeId={user._id}
        />
      )}
    </div>
  );
}
