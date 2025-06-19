import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Link2, Plus, Video } from "lucide-react";
import { toast } from "react-hot-toast";
import Logo from "@/assets/logo6.png";
import MeetingImage from "@/assets/MeetingImage.jpg";
import { startVideoCall } from "@/services/userServices";
import {
  allVideoCallBookings,
  updateBookingStatus,
} from "@/services/bookingService";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmationModal from "@/components/modal/ConfirmationModal"; // Adjust path as needed

const VideoCallHome: React.FC = () => {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const [showNewMeetingOptions, setShowNewMeetingOptions] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const { isOnline } = useSelector((state: RootState) => state.user);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<
    "pending" | "confirmed" | "completed" | "rescheduled" | "cancelled" | null
  >(null);
  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const response = await allVideoCallBookings();
      const filteredBookings = response.data
        .filter((booking: any) =>
          ["confirmed", "rescheduled"].includes(booking.status)
        )
        .slice(0, 5);
      setBookings(filteredBookings);
    } catch (error: any) {
      console.log("error :", error);
    }
  };

  useEffect(() => {
    if (isOnline.role === "mentor") {
      fetchBookings();
    }
  }, [isOnline.role]);

  const handleLogoClick = () => {
    const role = isOnline?.role;
    console.log("LOG>>>>>>>role", isOnline);
    console.log("LOG>>>>>>>role", role);

    if (role === "mentor") {
      navigate("/expert/dashboard");
    } else if (role === "mentee") {
      navigate("/seeker/dashboard");
    }
  };

  const handleCreateMeeting = async () => {
    try {
      console.log("@@@ handleCreateMeeting STEP 1", {
        bookings,
        selectedBookingId,
      });

      if (!selectedBookingId) {
        toast.error("No Booking Selected");
        return;
      }

      const selectedBooking = bookings.find(
        (booking) => booking._id === selectedBookingId
      );
      if (!selectedBooking) {
        throw new Error("Selected booking not found");
      }

      const menteeId = selectedBooking.menteeId?._id;
      const bookingId = selectedBooking._id;
      console.log("@@@ handleCreateMeeting STEP 2", { menteeId, bookingId });

      if (!menteeId || !bookingId) {
        throw new Error(
          "Invalid booking data: Missing mentee ID or booking ID"
        );
      }

      const meetingId = await startVideoCall(menteeId, bookingId);
      console.log("videocallhome got meetingid from backend", meetingId);

      toast.success(
        `Meeting created and notification sent to ${selectedBooking.menteeId.firstName}`
      );
      navigate(`/user/meeting/${meetingId}`);
    } catch (error: any) {
      console.error("@@@ handleCreateMeeting ERROR", error);

      toast.error(error.message);
    } finally {
      setShowNewMeetingOptions(false);
    }
  };

  const handleJoinMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (meetingCode.trim()) {
      console.log("meeting code is:", meetingCode);
      navigate(`/user/meeting-join/${meetingCode}`);
    } else if (selectedBookingId) {
      try {
        const selectedBooking = bookings.find(
          (booking) => booking._id === selectedBookingId
        );
        if (!selectedBooking) {
          throw new Error("Selected booking not found");
        }
        const meetingId = await startVideoCall(
          selectedBooking.menteeId._id,
          selectedBooking._id
        );

        toast.success(
          `Meeting created and notification sent to ${selectedBooking.menteeId.firstName}`
        );
        navigate(`/user/meeting/${meetingId}`);
      } catch (error: any) {
        toast.error(error.message);
      }
    } else {
      toast.error("Invalid Input");
    }
  };

  const handleSelectBooking = (bookingId: string) => {
    setSelectedBookingId(bookingId);
  };

  const handleStatusChange = (
    newStatus:
      | "pending"
      | "confirmed"
      | "completed"
      | "rescheduled"
      | "cancelled",
    bookingId: string
  ) => {
    console.log("handleStatusChange", { newStatus, bookingId });
    setPendingStatus(newStatus);
    setPendingBookingId(bookingId);
    setModalOpen(true);
  };

  const handleConfirmStatusUpdate = async () => {
    if (!pendingBookingId || !pendingStatus) return;

    try {
      console.log("Updating status for booking", {
        bookingId: pendingBookingId,
        status: pendingStatus,
      });
      await updateBookingStatus(pendingBookingId, pendingStatus);

      toast.success(`Booking status updated to ${pendingStatus}`);
      // Refresh bookings
      await fetchBookings();
    } catch (error: any) {
      console.error("Error updating status:", error);

      toast.error(error.message);
    } finally {
      setModalOpen(false);
      setPendingStatus(null);
      setPendingBookingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b p-4 flex items-center justify-between">
        <div
          className="flex items-center cursor-pointer"
          onClick={handleLogoClick}
        >
          <img src={Logo} alt="MentorOne" className="h-8 mr-4" />
          <span className="text-xl font-semibold text-gray-800">
            MentorOne Meet
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            •{" "}
            {new Date().toLocaleDateString([], {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </span>
          <Button variant="ghost" size="icon" aria-label="Help">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 md:px-6 flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Video calls and meetings for everyone
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Connect, collaborate, and mentor from anywhere with MentorOne Meet
          </p>

          <div className="relative">
            {isOnline.role === "mentor" && (
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 mb-4"
                onClick={() => setShowNewMeetingOptions(!showNewMeetingOptions)}
                aria-expanded={showNewMeetingOptions}
                aria-controls="new-meeting-options"
              >
                <Video className="w-5 h-5" />
                New meeting
              </Button>
            )}
            {showNewMeetingOptions && (
              <div
                id="new-meeting-options"
                className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md p-2 z-10 w-64"
              >
                <Button
                  variant="ghost"
                  className="w-full text-left flex items-center gap-2 p-2 hover:bg-gray-100"
                  onClick={handleCreateMeeting}
                >
                  <Plus className="w-5 h-5" />
                  Start a meeting
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-left flex items-center gap-2 p-2 hover:bg-gray-100"
                  disabled
                >
                  <Link2 className="w-5 h-5" />
                  Create a meeting for later
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-left flex items-center gap-2 p-2 hover:bg-gray-100"
                  disabled
                >
                  <Calendar className="w-5 h-5" />
                  Schedule in Calendar
                </Button>
              </div>
            )}
            {isOnline.role === "mentee" && (
              <form onSubmit={handleJoinMeeting} className="flex gap-2 mb-8">
                <Input
                  placeholder="Enter a code or link"
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                  className="border rounded-md px-4 py-2 w-64"
                  aria-label="Meeting code or link"
                />
                <Button type="submit" variant="outline">
                  Join
                </Button>
              </form>
            )}
          </div>
          {isOnline.role === "mentor" && (
            <>
              <Table>
                <TableCaption className="text-green-600 text-lg font-bold">
                  Select a booking to start a meeting
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Select</TableHead>
                    <TableHead className="w-[100px] text-center">
                      Date
                    </TableHead>
                    <TableHead className="text-center">Time</TableHead>
                    <TableHead className="text-center">Mentee</TableHead>
                    <TableHead className="text-center">Service</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <TableRow key={booking._id}>
                        <TableCell className="text-center">
                          <input
                            type="radio"
                            name="booking"
                            value={booking._id}
                            checked={selectedBookingId === booking._id}
                            onChange={() => handleSelectBooking(booking._id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium text-center">
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-center">
                          {booking.startTime}
                        </TableCell>
                        <TableCell className="text-center">
                          {booking.menteeId?.firstName || "N/A"}
                        </TableCell>
                        <TableCell className="text-center">
                          {booking.serviceId?.title || "N/A"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Select
                            value={booking.status}
                            onValueChange={(value) =>
                              handleStatusChange(value, booking._id)
                            }
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectGroup>
                                <SelectItem value="confirmed">
                                  Confirmed
                                </SelectItem>
                                {/* <SelectItem value="pending">Pending</SelectItem> */}
                                <SelectItem value="completed">
                                  Completed
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No bookings found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <ConfirmationModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                onConfirm={handleConfirmStatusUpdate}
                title="Confirm Status Update"
                description={`Are you sure you want to change the booking status to ${pendingStatus}? This action cannot be undone.`}
              />
            </>
          )}
        </div>
        <div className="flex-1 hidden md:block">
          <img
            src={MeetingImage}
            alt="Video call illustration"
            className="w-full h-auto"
          />
        </div>
      </main>
    </div>
  );
};

export default VideoCallHome;
