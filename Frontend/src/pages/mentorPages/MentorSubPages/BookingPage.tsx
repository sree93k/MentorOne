import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import { setError, setLoading } from "@/redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeedbackModal from "@/components/mentee/FeedbackModal";
import RescheduleModal from "@/components/modal/ResheduleModal";
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import {
  getBookingsByMentor,
  updateStatus,
  updateBookingStatus,
} from "@/services/bookingService";
import { CalendarX, Check } from "lucide-react";
import { toast } from "react-hot-toast";

interface RescheduleRequest {
  requestedDate?: string;
  requestedTime?: string;
  requestedSlotIndex?: number;
  mentorDecides?: boolean;
  rescheduleStatus?: "noreschedule" | "pending" | "approved" | "rejected";
  reason?: string;
}

interface Booking {
  date: string;
  product: string;
  service: string;
  userName: string;
  userId: string;
  timeSlot: string;
  amount: number;
  paymentStatus: string;
  status: string;
  _id: string;
  rescheduleRequest?: RescheduleRequest;
  bookingDate?: string;
  serviceId: string;
  startTime?: string;
  slotIndex?: number;
}

const allServiceTypes = ["All", "1:1 Call", "Priority DM", "Digital product"];

export default function BookingsPage() {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [globalSearch, setGlobalSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 40;
  const dispatch = useDispatch();
  const { user, error, loading } = useSelector(
    (state: RootState) => state.user
  );
  const mentorId = user?._id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: { bookings = [], total = 0 } = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["mentorBookings", mentorId, page],
    queryFn: async () => {
      if (!mentorId) throw new Error("Mentor ID is required");
      const response = await getBookingsByMentor(mentorId, page, limit);
      console.log("+++++++++++getBookingsByMentor", response);
      console.log("+++++++++++getBookingsByMentor step1", response.data);
      return {
        bookings: response.data.map((booking: any) => ({
          _id: booking._id,
          date: new Date(booking.bookingDate).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          bookingDate: booking.bookingDate,
          product: booking.serviceId?.title || "Unknown Product",
          service:
            booking.serviceId?.type === "1-1Call"
              ? "1:1 Call"
              : booking.serviceId?.type === "priorityDM"
              ? "Priority DM"
              : "Digital product",
          userName:
            `${capitalize(booking.menteeId?.firstName)} ${capitalize(
              booking.menteeId?.lastName
            )}` || "Unknown User",
          userId: booking.menteeId?._id || "N/A",
          timeSlot: booking.startTime || "N/A",
          startTime: booking.startTime,
          slotIndex: booking.slotIndex,
          amount: booking.serviceId?.amount || 0,
          paymentStatus: capitalize(booking.paymentDetails?.status) || "N/A",
          status: capitalize(booking.status) || "N/A",
          serviceId: booking.serviceId?._id || "N/A",
          rescheduleRequest: {
            requestedDate: booking.rescheduleRequest?.requestedDate,
            requestedTime: booking.rescheduleRequest?.requestedTime,
            requestedSlotIndex: booking.rescheduleRequest?.requestedSlotIndex,
            mentorDecides: booking.rescheduleRequest?.mentorDecides,
            rescheduleStatus:
              booking.rescheduleRequest?.rescheduleStatus || "noreschedule",
            reason: booking.rescheduleRequest?.reason,
          },
        })),
        total: response.total,
      };
    },
    enabled: !!mentorId,
  });

  useEffect(() => {
    dispatch(setError(null));
    dispatch(setLoading(false));
    console.log("@@@@@@@@@@@@@@@@");
    console.log("@@@@@@@@@@@@@@@@");
    console.log("@@@@@@@@@@@@@@@@");
  }, []);

  const updateBookingStatusMutation = useMutation({
    mutationFn: async ({
      bookingId,
      status,
      updates,
    }: {
      bookingId: string;
      status: string;
      updates?: {
        bookingDate?: string;
        startTime?: string;
        slotIndex?: number;
        rescheduleRequest?: {
          rescheduleStatus:
            | "noreschedule"
            | "pending"
            | "accepted"
            | "rejected";
          requestedDate?: string;
          requestedTime?: string;
          requestedSlotIndex?: number;
        };
      };
    }) => {
      const payload = { status, ...updates };
      console.log("++++++++|||||||||updateStatus", bookingId, payload);
      if (updates?.rescheduleRequest?.rescheduleStatus === "rejected") {
        console.log("");

        await updateBookingStatus(bookingId, status);
      } else {
        await updateStatus(bookingId, payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mentorBookings", mentorId, page],
      });
      toast.success("Reschedule request updated successfully.");
    },
    onError: (isError: any) => {
      toast.error(isError.message || "Failed to update reschedule request.");
    },
  });

  const capitalize = (str: string | undefined) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const handleFeedbackSubmit = (feedback: string) => {
    console.log(
      "Feedback submitted for booking",
      selectedBookingId,
      ":",
      feedback
    );
    setIsFeedbackModalOpen(false);
    setSelectedBookingId(null);
  };

  const handleApproveReschedule = (booking: Booking) => {
    setSelectedBooking(booking);
    setSelectedBookingId(booking._id);
    setActionType("approve"); // Updated
    setIsConfirmationModalOpen(true);
  };

  const handleRejectReschedule = (booking: Booking) => {
    // Newly Added
    setSelectedBooking(booking);
    setSelectedBookingId(booking._id);
    setActionType("reject");
    setIsConfirmationModalOpen(true);
  };

  // const confirmApproval = () => {
  //   if (!selectedBooking || !selectedBooking.rescheduleRequest) return;

  //   const isApprove = actionType === "approve";
  //   updateBookingStatusMutation.mutate({
  //     bookingId: selectedBooking._id,
  //     status: isApprove ? "confirmed" : "confirmed",
  //     updates: {
  //       ...(isApprove && {
  //         bookingDate: selectedBooking.rescheduleRequest.requestedDate,
  //         startTime: selectedBooking.rescheduleRequest.requestedTime,
  //         slotIndex: selectedBooking.rescheduleRequest.requestedSlotIndex,
  //       }),
  //       rescheduleRequest: {
  //         rescheduleStatus: isApprove ? "accepted" : "rejected",
  //       },
  //     },
  //   });

  //   setIsConfirmationModalOpen(false);
  //   setSelectedBooking(null);
  //   setSelectedBookingId(null);
  //   setActionType(null);
  // };

  const confirmApproval = () => {
    if (!selectedBooking || !selectedBooking.rescheduleRequest) return;

    const isApprove = actionType === "approve";
    // Calculate day of the week if approving
    const dayOfWeek = isApprove
      ? new Date(
          selectedBooking.rescheduleRequest.requestedDate!
        ).toLocaleDateString("en-US", {
          weekday: "long",
        })
      : undefined;

    updateBookingStatusMutation.mutate({
      bookingId: selectedBooking._id,
      status: isApprove ? "confirmed" : "confirmed",
      updates: {
        ...(isApprove && {
          bookingDate: selectedBooking.rescheduleRequest.requestedDate,
          startTime: selectedBooking.rescheduleRequest.requestedTime,
          slotIndex: selectedBooking.rescheduleRequest.requestedSlotIndex,
          dayOfWeek, // Add day of the week to payload
        }),
        rescheduleRequest: {
          rescheduleStatus: isApprove ? "accepted" : "rejected",
        },
      },
    });

    setIsConfirmationModalOpen(false);
    setSelectedBooking(null);
    setSelectedBookingId(null);
    setActionType(null);
  };

  const handleRescheduleSubmit = (data: {
    requestedDate?: string;
    requestedTime?: string;
    requestedSlotIndex?: number;
  }) => {
    if (!selectedBooking) return;

    updateBookingStatusMutation.mutate({
      bookingId: selectedBooking._id,
      status: "rescheduled",
      updates: {
        bookingDate: data.requestedDate,
        startTime: data.requestedTime,
        slotIndex: data.requestedSlotIndex,
        rescheduleRequest: {
          rescheduleStatus: "pending",
          requestedDate: data.requestedDate,
          requestedTime: data.requestedTime,
          requestedSlotIndex: data.requestedSlotIndex,
        },
      },
    });

    setIsRescheduleModalOpen(false);
    setSelectedBooking(null);
    setSelectedBookingId(null);
    console.log("======setSelectedBooking   ======4", selectedBooking);
  };
  const refreshBookings = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["mentorBookings", mentorId, page],
    });
  };
  const filterBookings = useMemo(() => {
    return (bookings: Booking[]) => {
      let filtered = bookings;

      // Service type filter
      if (selectedFilter !== "All") {
        const serviceMap: { [key: string]: string } = {
          "1:1 Call": "1-1Call",
          "Priority DM": "priorityDM",
          "Digital product": "DigitalProducts",
        };
        filtered = filtered.filter((b) => b.service === selectedFilter);
      }

      // Global search filter
      if (globalSearch) {
        const query = globalSearch.toLowerCase();
        filtered = filtered.filter(
          (b) =>
            b.userName.toLowerCase().includes(query) ||
            b.product.toLowerCase().includes(query)
        );
      }

      return filtered;
    };
  }, [selectedFilter, globalSearch]);

  const upcomingBookings = filterBookings(
    bookings.filter((b) => b.status === "Confirmed")
  );
  const pendingBookings = filterBookings(
    bookings.filter((b) => b.status === "Pending")
  );
  const rescheduledBookings = filterBookings(
    bookings.filter((b) => b.status === "Rescheduled")
  );
  const completedBookings = filterBookings(
    bookings.filter((b) => b.status === "Completed")
  );
  const cancelledBookings = filterBookings(
    bookings.filter((b) => b.status === "Cancelled")
  );
  const totalPages = Math.ceil(total / limit);

  const renderNoBookings = (tab: string) => (
    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <CalendarX className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
        No {tab} Bookings
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2">
        {tab === "upcoming" || tab === "pending"
          ? "You have no upcoming bookings scheduled."
          : "You have no completed or cancelled bookings."}
      </p>
    </div>
  );

  if (isLoading)
    return (
      <div className="text-center py-4 text-gray-600 dark:text-gray-300">
        Loading bookings...
      </div>
    );
  if (isError)
    return (
      <div className="text-center py-4 text-red-500">
        Error loading bookings: {(isError as Error).message}
      </div>
    );

  return (
    <div className="mx-32 py-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Bookings
      </h1>
      {/* Service Type Filter and Search */}
      <div className="flex items-center gap-2 mb-8 border-b border-gray-200 dark:border-gray-700 pb-2">
        {allServiceTypes.map((type) => (
          <Button
            key={type}
            onClick={() => setSelectedFilter(type)}
            variant="outline"
            className={`rounded-full border border-gray-300 dark:border-gray-600 px-4 py-1 font-medium transition-all ${
              selectedFilter === type
                ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                : "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
            }`}
          >
            {type}
          </Button>
        ))}
        <Input
          placeholder="Search by user name or product..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          className="ml-auto w-full sm:w-64 rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 pr-4 mr-4"
        />
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="w-full flex justify-start gap-8 border-b border-gray-200 dark:border-gray-700 mb-8 bg-transparent">
          {["upcoming", "rescheduled", "pending", "completed", "cancelled"].map(
            (tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className={`pb-3 capitalize transition-all rounded-none text-lg font-semibold ${
                  selectedTab === tab
                    ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {tab}
              </TabsTrigger>
            )
          )}
        </TabsList>

        <TabsContent value="upcoming">
          {upcomingBookings.length === 0 ? (
            renderNoBookings("upcoming")
          ) : (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Date
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Product
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Service
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      User Name
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Booking Date
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Time Slot
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Amount
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingBookings.map((booking) => (
                    <TableRow
                      key={booking._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.date}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.product}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.service}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.userName}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {new Date(booking?.bookingDate).toLocaleDateString(
                          "en-GB"
                        )}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.timeSlot}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        ₹ {booking.amount}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3 flex items-center gap-2">
                        {booking.status === "Confirmed" && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                        {booking.status}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="rescheduled">
          {rescheduledBookings.length === 0 ? (
            renderNoBookings("rescheduled")
          ) : (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Date
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Product
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Service
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      User Name
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Booking Date
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Time Slot
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Requested Date
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Requested Time
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Amount
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Reschedule Status
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rescheduledBookings.map((booking) => (
                    <TableRow
                      key={booking._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.date}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.product}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.service}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.userName}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {new Date(booking?.bookingDate).toLocaleDateString(
                          "en-GB"
                        )}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.timeSlot}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.rescheduleRequest?.requestedDate
                          ? new Date(
                              booking.rescheduleRequest.requestedDate
                            ).toLocaleDateString("en-US", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "Mentor Decide"}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.rescheduleRequest?.requestedTime ||
                          "Mentor Decide"}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        ₹ {booking.amount}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {capitalize(
                          booking.rescheduleRequest?.rescheduleStatus
                        ) || "N/A"}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3 flex gap-2">
                        {booking.rescheduleRequest?.rescheduleStatus ===
                          "pending" && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleApproveReschedule(booking)}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRejectReschedule(booking)}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending">
          {pendingBookings.length === 0 ? (
            renderNoBookings("pending")
          ) : (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Date
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Product
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Service
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      User Name
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Booking Date
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Time Slot
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Amount
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Status
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Reply
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingBookings.map((booking) => (
                    <TableRow
                      key={booking._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.date}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.product}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.service}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.userName}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {new Date(booking?.bookingDate).toLocaleDateString(
                          "en-GB"
                        )}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.timeSlot}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        ₹ {booking.amount}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3 flex items-center gap-2">
                        {booking.status === "Pending" && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                        {booking.status}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => navigate(`/expert/prioritydm`)}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Reply
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedBookings.length === 0 ? (
            renderNoBookings("completed")
          ) : (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Date
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Product
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Service
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      User Name
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Booking Date
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Time Slot
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Amount
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedBookings.map((booking) => (
                    <TableRow
                      key={booking._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.date}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.product}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.service}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.userName}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {new Date(booking?.bookingDate).toLocaleDateString(
                          "en-GB"
                        )}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.timeSlot}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        ₹ {booking.amount}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3 flex items-center gap-2">
                        {booking.status === "Completed" && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                        {booking.status}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled">
          {cancelledBookings.length === 0 ? (
            renderNoBookings("cancelled")
          ) : (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Date
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Product
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Service
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      User Name
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Booking Date
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Time Slot
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Amount
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cancelledBookings.map((booking) => (
                    <TableRow
                      key={booking._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.date}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.product}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.service}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.userName}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {new Date(booking?.bookingDate).toLocaleDateString(
                          "en-GB"
                        )}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.timeSlot}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        ₹ {booking.amount}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3 flex items-center gap-2">
                        {booking.status === "Cancelled" && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                        {booking.status}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <Button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            Previous
          </Button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                onClick={() => setPage(p)}
                variant={page === p ? "default" : "outline"}
                className={`${
                  page === p
                    ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                    : "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                } border-gray-300 dark:border-gray-600`}
              >
                {p}
              </Button>
            ))}
          </div>
          <Button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            Next
          </Button>
        </div>
      )}

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => {
          setIsFeedbackModalOpen(false);
          setSelectedBookingId(null);
        }}
        onSubmit={handleFeedbackSubmit}
      />

      <ConfirmationModal
        open={isConfirmationModalOpen}
        onOpenChange={setIsConfirmationModalOpen}
        onConfirm={confirmApproval}
        title={`${
          actionType === "approve" ? "Approve" : "Reject"
        } Reschedule Request`}
        description={`Are you sure you want to ${actionType} the reschedule request for ${
          selectedBooking?.userName
        }'s booking to ${
          selectedBooking?.rescheduleRequest?.requestedDate || "N/A"
        } at ${selectedBooking?.rescheduleRequest?.requestedTime || "N/A"}?`}
      />

      <RescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => {
          setIsRescheduleModalOpen(false);
          setSelectedBooking(null);
          setSelectedBookingId(null);
        }}
        onSubmit={handleRescheduleSubmit}
        bookingId={selectedBooking?._id}
        serviceSlot={selectedBooking?.serviceId}
        mentorId={mentorId}
        refreshBookings={refreshBookings}
      />
    </div>
  );
}
