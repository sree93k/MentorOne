import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeedbackModal from "@/components/modal/FeedbackModal";

interface Booking {
  date: string;
  product: string;
  service: string;
  userName: string;
  userId: string;
  timeSlot: string;
  status: string;
}

const allServiceTypes = ["All", "1:1 Call", "Priority DM", "Digital product"];

const upcomingBookings: Booking[] = [
  {
    date: "12/3/2025",
    product: "Mock Interview",
    service: "1:1 Call",
    userName: "Amritha S",
    userId: "M0NE23467",
    timeSlot: "12:30 PM",
    status: "Payment Success",
  },
  {
    date: "12/3/2025",
    product: "Mock Interview",
    service: "Priority DM",
    userName: "Amritha S",
    userId: "M0NE23467",
    timeSlot: "12:30 PM",
    status: "Payment Success",
  },
];

const completedBookings: Booking[] = [
  {
    date: "12/3/2025",
    product: "Mock Interview",
    service: "1:1 Call",
    userName: "Amritha S",
    userId: "M0NE23467",
    timeSlot: "12:30 PM",
    status: "Done",
  },
  {
    date: "12/3/2025",
    product: "Package",
    service: "Package",
    userName: "Amritha S",
    userId: "M0NE23467",
    timeSlot: "12:30 PM",
    status: "Not Attended",
  },
];

export default function BookingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const handleFeedbackSubmit = (feedback: string) => {
    console.log("Feedback submitted:", feedback);
  };

  const filterBookings = (bookings: Booking[]) => {
    if (selectedFilter === "All") return bookings;
    return bookings.filter((b) => b.service === selectedFilter);
  };

  return (
    <div className="mx-32 py-6">
      <h1 className="text-2xl font-bold mb-6">Bookings</h1>

      {/* Service Type Filter */}
      <div className="flex gap-2 mb-8 border-b border-black pb-2">
        {allServiceTypes.map((type) => (
          <Button
            key={type}
            onClick={() => setSelectedFilter(type)}
            variant="outline"
            className={`rounded-full border border-black px-4 py-1 font-medium transition-all ${
              selectedFilter === type
                ? "bg-black text-white underline underline-offset-4"
                : "bg-white text-black"
            }`}
          >
            {type}
          </Button>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="w-full flex justify-start gap-8 border-b mb-8">
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

        {/* Upcoming Tab */}
        <TabsContent value="upcoming">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>Service ID</TableHead>
                  <TableHead>Time Slot</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterBookings(upcomingBookings).map((booking, index) => (
                  <TableRow key={index}>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell>{booking.product}</TableCell>
                    <TableCell>{booking.service}</TableCell>
                    <TableCell>{booking.userName}</TableCell>
                    <TableCell>{booking.userId}</TableCell>
                    <TableCell>{booking.timeSlot}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Completed Tab */}
        <TabsContent value="completed">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>Service ID</TableHead>
                  <TableHead>Time Slot</TableHead>
                  <TableHead>Feedback</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterBookings(completedBookings).map((booking, index) => (
                  <TableRow key={index}>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell>{booking.product}</TableCell>
                    <TableCell>{booking.service}</TableCell>
                    <TableCell>{booking.userName}</TableCell>
                    <TableCell>{booking.userId}</TableCell>
                    <TableCell>{booking.timeSlot}</TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        className="p-0 h-auto font-normal underline"
                        onClick={() => setIsModalOpen(true)}
                      >
                        {booking.status}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
}
