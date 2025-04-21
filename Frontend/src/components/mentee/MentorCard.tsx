import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BookingCard from "@/components/mentee/BookingCard";
import FeedbackModal from "@/components/mentee/FeedbackModal";

interface Booking {
  id: string;
  mentorName: string;
  mentorImage: string;
  title: string;
  technology: string;
  date: string;
  time: string;
  price: number;
  rating?: number;
  feedback?: string;
}

export default function BookingsPage() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [selectedMainTab, setSelectedMainTab] = useState("all");

  const bookings: Booking[] = [
    {
      id: "1",
      mentorName: "Akshay Saini",
      mentorImage:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100",
      title: "Mock Interview",
      technology: "React JS",
      date: "12/3/2025",
      time: "10:00 AM",
      price: 200,
    },
    // Add more bookings as needed
  ];

  const handleFeedbackSubmit = (
    bookingId: string,
    rating: number,
    feedback: string
  ) => {
    // Update booking with feedback and rating
    console.log("Feedback submitted:", { bookingId, rating, feedback });
    setIsFeedbackModalOpen(false);
  };

  return (
    <div className="mx-16 p-2">
      <Tabs defaultValue="all" onValueChange={setSelectedMainTab}>
        <TabsList className="flex justify-start mb-6 gap-3 border-b border-gray-200 rounded-none w-full pb-6">
          {["all", "query", "1-1-call", "packages"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className={`rounded-full px-4 py-1 border border-black transition-colors duration-200
        ${
          selectedMainTab === tab
            ? "bg-black text-white"
            : "bg-white text-black"
        }
        hover:bg-black hover:text-white`}
            >
              {tab === "1-1-call"
                ? "1:1 Call"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        {["all", "query", "1-1-call", "packages"].map((mainTab) => (
          <TabsContent key={mainTab} value={mainTab}>
            <Tabs defaultValue="upcoming" onValueChange={setSelectedTab}>
              <TabsList className="w-full flex justify-start gap-8  border-b border-gray-200  mb-8">
                {["upcoming", "completed"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className={`pb-3 capitalize transition-all rounded-none ${
                      selectedTab === tab
                        ? "border-b-2 border-black font-semibold"
                        : "text-muted-foreground "
                    }`}
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="upcoming">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 ">
                  {bookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      type="upcoming"
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="completed">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {bookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      type="completed"
                      onFeedbackClick={() => {
                        setSelectedBooking(booking);
                        setIsFeedbackModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        ))}
      </Tabs>

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={(rating, feedback) => {
          if (selectedBooking) {
            handleFeedbackSubmit(selectedBooking.id, rating, feedback);
          }
        }}
      />
    </div>
  );
}
