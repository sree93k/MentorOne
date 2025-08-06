// import { useState, useMemo, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import { setError, setLoading } from "@/redux/slices/userSlice";
// import { useNavigate } from "react-router-dom";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import FeedbackModal from "@/components/mentee/FeedbackModal";
// import RescheduleModal from "@/components/modal/ResheduleModal";
// import ConfirmationModal from "@/components/modal/ConfirmationModal";
// import {
//   getBookingsByMentor,
//   updateStatus,
//   updateBookingStatus,
// } from "@/services/bookingService";
// import { CalendarX, Check } from "lucide-react";
// import { toast } from "react-hot-toast";

// interface RescheduleRequest {
//   requestedDate?: string;
//   requestedTime?: string;
//   requestedSlotIndex?: number;
//   mentorDecides?: boolean;
//   rescheduleStatus?: "noreschedule" | "pending" | "approved" | "rejected";
//   reason?: string;
// }

// interface Booking {
//   date: string;
//   product: string;
//   service: string;
//   userName: string;
//   userId: string;
//   timeSlot: string;
//   amount: number;
//   paymentStatus: string;
//   status: string;
//   _id: string;
//   rescheduleRequest?: RescheduleRequest;
//   bookingDate?: string;
//   serviceId: string;
//   startTime?: string;
//   slotIndex?: number;
// }

// const allServiceTypes = ["All", "1:1 Call", "Priority DM", "Digital product"];

// export default function BookingsPage() {
//   const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
//   const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
//   const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
//   const [selectedTab, setSelectedTab] = useState("upcoming");
//   const [selectedFilter, setSelectedFilter] = useState("All");
//   const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
//     null
//   );
//   const [actionType, setActionType] = useState<"approve" | "reject" | null>(
//     null
//   );
//   const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
//   const [globalSearch, setGlobalSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const limit = 40;
//   const dispatch = useDispatch();
//   const { user, error, loading } = useSelector(
//     (state: RootState) => state.user
//   );
//   const mentorId = user?._id;
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   const {
//     data: { bookings = [], total = 0 } = {},
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["mentorBookings", mentorId, page],
//     queryFn: async () => {
//       if (!mentorId) throw new Error("Mentor ID is required");
//       const response = await getBookingsByMentor(mentorId, page, limit);
//       console.log("+++++++++++getBookingsByMentor", response);
//       console.log("+++++++++++getBookingsByMentor step1", response.data);
//       return {
//         bookings: response.data.map((booking: any) => ({
//           _id: booking._id,
//           date: new Date(booking.bookingDate).toLocaleDateString("en-US", {
//             day: "2-digit",
//             month: "2-digit",
//             year: "numeric",
//           }),
//           bookingDate: booking.bookingDate,
//           product: booking.serviceId?.title || "Unknown Product",
//           service:
//             booking.serviceId?.type === "1-1Call"
//               ? "1:1 Call"
//               : booking.serviceId?.type === "priorityDM"
//               ? "Priority DM"
//               : "Digital product",
//           userName:
//             `${capitalize(booking.menteeId?.firstName)} ${capitalize(
//               booking.menteeId?.lastName
//             )}` || "Unknown User",
//           userId: booking.menteeId?._id || "N/A",
//           timeSlot: booking.startTime || "N/A",
//           startTime: booking.startTime,
//           slotIndex: booking.slotIndex,
//           amount: booking.serviceId?.amount || 0,
//           paymentStatus: capitalize(booking.paymentDetails?.status) || "N/A",
//           status: capitalize(booking.status) || "N/A",
//           serviceId: booking.serviceId?._id || "N/A",
//           rescheduleRequest: {
//             requestedDate: booking.rescheduleRequest?.requestedDate,
//             requestedTime: booking.rescheduleRequest?.requestedTime,
//             requestedSlotIndex: booking.rescheduleRequest?.requestedSlotIndex,
//             mentorDecides: booking.rescheduleRequest?.mentorDecides,
//             rescheduleStatus:
//               booking.rescheduleRequest?.rescheduleStatus || "noreschedule",
//             reason: booking.rescheduleRequest?.reason,
//           },
//         })),
//         total: response.total,
//       };
//     },
//     enabled: !!mentorId,
//   });

//   useEffect(() => {
//     dispatch(setError(null));
//     dispatch(setLoading(false));
//     console.log("@@@@@@@@@@@@@@@@");
//     console.log("@@@@@@@@@@@@@@@@");
//     console.log("@@@@@@@@@@@@@@@@");
//   }, []);

//   const updateBookingStatusMutation = useMutation({
//     mutationFn: async ({
//       bookingId,
//       status,
//       updates,
//     }: {
//       bookingId: string;
//       status: string;
//       updates?: {
//         bookingDate?: string;
//         startTime?: string;
//         slotIndex?: number;
//         rescheduleRequest?: {
//           rescheduleStatus:
//             | "noreschedule"
//             | "pending"
//             | "accepted"
//             | "rejected";
//           requestedDate?: string;
//           requestedTime?: string;
//           requestedSlotIndex?: number;
//         };
//       };
//     }) => {
//       const payload = { status, ...updates };
//       console.log("++++++++|||||||||updateStatus", bookingId, payload);
//       if (updates?.rescheduleRequest?.rescheduleStatus === "rejected") {
//         console.log("");

//         await updateBookingStatus(bookingId, status);
//       } else {
//         await updateStatus(bookingId, payload);
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["mentorBookings", mentorId, page],
//       });
//       toast.success("Reschedule request updated successfully.");
//     },
//     onError: (isError: any) => {
//       toast.error(isError.message || "Failed to update reschedule request.");
//     },
//   });

//   const capitalize = (str: string | undefined) =>
//     str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

//   const handleFeedbackSubmit = (feedback: string) => {
//     console.log(
//       "Feedback submitted for booking",
//       selectedBookingId,
//       ":",
//       feedback
//     );
//     setIsFeedbackModalOpen(false);
//     setSelectedBookingId(null);
//   };

//   const handleApproveReschedule = (booking: Booking) => {
//     setSelectedBooking(booking);
//     setSelectedBookingId(booking._id);
//     setActionType("approve"); // Updated
//     setIsConfirmationModalOpen(true);
//   };

//   const handleRejectReschedule = (booking: Booking) => {
//     // Newly Added
//     setSelectedBooking(booking);
//     setSelectedBookingId(booking._id);
//     setActionType("reject");
//     setIsConfirmationModalOpen(true);
//   };

//   const confirmApproval = () => {
//     if (!selectedBooking || !selectedBooking.rescheduleRequest) return;

//     const isApprove = actionType === "approve";
//     // Calculate day of the week if approving
//     const dayOfWeek = isApprove
//       ? new Date(
//           selectedBooking.rescheduleRequest.requestedDate!
//         ).toLocaleDateString("en-US", {
//           weekday: "long",
//         })
//       : undefined;

//     updateBookingStatusMutation.mutate({
//       bookingId: selectedBooking._id,
//       status: isApprove ? "confirmed" : "confirmed",
//       updates: {
//         ...(isApprove && {
//           bookingDate: selectedBooking.rescheduleRequest.requestedDate,
//           startTime: selectedBooking.rescheduleRequest.requestedTime,
//           slotIndex: selectedBooking.rescheduleRequest.requestedSlotIndex,
//           dayOfWeek, // Add day of the week to payload
//         }),
//         rescheduleRequest: {
//           rescheduleStatus: isApprove ? "accepted" : "rejected",
//         },
//       },
//     });

//     setIsConfirmationModalOpen(false);
//     setSelectedBooking(null);
//     setSelectedBookingId(null);
//     setActionType(null);
//   };

//   const handleRescheduleSubmit = (data: {
//     requestedDate?: string;
//     requestedTime?: string;
//     requestedSlotIndex?: number;
//   }) => {
//     if (!selectedBooking) return;

//     updateBookingStatusMutation.mutate({
//       bookingId: selectedBooking._id,
//       status: "rescheduled",
//       updates: {
//         bookingDate: data.requestedDate,
//         startTime: data.requestedTime,
//         slotIndex: data.requestedSlotIndex,
//         rescheduleRequest: {
//           rescheduleStatus: "pending",
//           requestedDate: data.requestedDate,
//           requestedTime: data.requestedTime,
//           requestedSlotIndex: data.requestedSlotIndex,
//         },
//       },
//     });

//     setIsRescheduleModalOpen(false);
//     setSelectedBooking(null);
//     setSelectedBookingId(null);
//     console.log("======setSelectedBooking   ======4", selectedBooking);
//   };
//   const refreshBookings = async () => {
//     await queryClient.invalidateQueries({
//       queryKey: ["mentorBookings", mentorId, page],
//     });
//   };
//   const filterBookings = useMemo(() => {
//     return (bookings: Booking[]) => {
//       let filtered = bookings;

//       // Service type filter
//       if (selectedFilter !== "All") {
//         const serviceMap: { [key: string]: string } = {
//           "1:1 Call": "1-1Call",
//           "Priority DM": "priorityDM",
//           "Digital product": "DigitalProducts",
//         };
//         filtered = filtered.filter((b) => b.service === selectedFilter);
//       }

//       // Global search filter
//       if (globalSearch) {
//         const query = globalSearch.toLowerCase();
//         filtered = filtered.filter(
//           (b) =>
//             b.userName.toLowerCase().includes(query) ||
//             b.product.toLowerCase().includes(query)
//         );
//       }

//       return filtered;
//     };
//   }, [selectedFilter, globalSearch]);

//   const upcomingBookings = filterBookings(
//     bookings.filter((b) => b.status === "Confirmed")
//   );
//   const pendingBookings = filterBookings(
//     bookings.filter((b) => b.status === "Pending")
//   );
//   const rescheduledBookings = filterBookings(
//     bookings.filter((b) => b.status === "Rescheduled")
//   );
//   const completedBookings = filterBookings(
//     bookings.filter((b) => b.status === "Completed")
//   );
//   const cancelledBookings = filterBookings(
//     bookings.filter((b) => b.status === "Cancelled")
//   );
//   const totalPages = Math.ceil(total / limit);

//   const renderNoBookings = (tab: string) => (
//     <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
//       <CalendarX className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
//       <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
//         No {tab} Bookings
//       </h2>
//       <p className="text-gray-500 dark:text-gray-400 mt-2">
//         {tab === "upcoming" || tab === "pending"
//           ? "You have no upcoming bookings scheduled."
//           : "You have no completed or cancelled bookings."}
//       </p>
//     </div>
//   );

//   if (isLoading)
//     return (
//       <div className="text-center py-4 text-gray-600 dark:text-gray-300">
//         Loading bookings...
//       </div>
//     );
//   if (isError)
//     return (
//       <div className="text-center py-4 text-red-500">
//         Error loading bookings: {(isError as Error).message}
//       </div>
//     );

//   return (
//     <div className="mx-32 py-6">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
//         Bookings
//       </h1>
//       {/* Service Type Filter and Search */}
//       <div className="flex items-center gap-2 mb-8 border-b border-gray-200 dark:border-gray-700 pb-2">
//         {allServiceTypes.map((type) => (
//           <Button
//             key={type}
//             onClick={() => setSelectedFilter(type)}
//             variant="outline"
//             className={`rounded-full border border-gray-300 dark:border-gray-600 px-4 py-1 font-medium transition-all ${
//               selectedFilter === type
//                 ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
//                 : "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
//             }`}
//           >
//             {type}
//           </Button>
//         ))}
//         <Input
//           placeholder="Search by user name or product..."
//           value={globalSearch}
//           onChange={(e) => setGlobalSearch(e.target.value)}
//           className="ml-auto w-full sm:w-64 rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 pr-4 mr-4"
//         />
//       </div>

//       <Tabs value={selectedTab} onValueChange={setSelectedTab}>
//         <TabsList className="w-full flex justify-start gap-8 border-b border-gray-200 dark:border-gray-700 mb-8 bg-transparent">
//           {["upcoming", "rescheduled", "pending", "completed", "cancelled"].map(
//             (tab) => (
//               <TabsTrigger
//                 key={tab}
//                 value={tab}
//                 className={`pb-3 capitalize transition-all rounded-none text-lg font-semibold ${
//                   selectedTab === tab
//                     ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
//                     : "text-gray-500 dark:text-gray-400"
//                 }`}
//               >
//                 {tab}
//               </TabsTrigger>
//             )
//           )}
//         </TabsList>

//         <TabsContent value="upcoming">
//           {upcomingBookings.length === 0 ? (
//             renderNoBookings("upcoming")
//           ) : (
//             <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Date
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Product
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Service
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       User Name
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Booking Date
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Time Slot
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Amount
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Status
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {upcomingBookings.map((booking) => (
//                     <TableRow
//                       key={booking._id}
//                       className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//                     >
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.date}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.product}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.service}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.userName}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {new Date(booking?.bookingDate).toLocaleDateString(
//                           "en-GB"
//                         )}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.timeSlot}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         ₹ {booking.amount}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3 flex items-center gap-2">
//                         {booking.status === "Confirmed" && (
//                           <Check className="h-4 w-4 text-green-500" />
//                         )}
//                         {booking.status}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </TabsContent>

//         <TabsContent value="rescheduled">
//           {rescheduledBookings.length === 0 ? (
//             renderNoBookings("rescheduled")
//           ) : (
//             <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Date
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Product
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Service
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       User Name
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Booking Date
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Time Slot
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Requested Date
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Requested Time
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Amount
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Reschedule Status
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Actions
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {rescheduledBookings.map((booking) => (
//                     <TableRow
//                       key={booking._id}
//                       className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//                     >
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.date}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.product}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.service}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.userName}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {new Date(booking?.bookingDate).toLocaleDateString(
//                           "en-GB"
//                         )}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.timeSlot}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.rescheduleRequest?.requestedDate
//                           ? new Date(
//                               booking.rescheduleRequest.requestedDate
//                             ).toLocaleDateString("en-US", {
//                               day: "2-digit",
//                               month: "2-digit",
//                               year: "numeric",
//                             })
//                           : "Mentor Decide"}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.rescheduleRequest?.requestedTime ||
//                           "Mentor Decide"}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         ₹ {booking.amount}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {capitalize(
//                           booking.rescheduleRequest?.rescheduleStatus
//                         ) || "N/A"}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3 flex gap-2">
//                         {booking.rescheduleRequest?.rescheduleStatus ===
//                           "pending" && (
//                           <>
//                             <Button
//                               variant="default"
//                               size="sm"
//                               onClick={() => handleApproveReschedule(booking)}
//                               className="bg-green-500 hover:bg-green-600 text-white"
//                             >
//                               Approve
//                             </Button>
//                             <Button
//                               variant="destructive"
//                               size="sm"
//                               onClick={() => handleRejectReschedule(booking)}
//                               className="bg-red-500 hover:bg-red-600 text-white"
//                             >
//                               Reject
//                             </Button>
//                           </>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </TabsContent>

//         <TabsContent value="pending">
//           {pendingBookings.length === 0 ? (
//             renderNoBookings("pending")
//           ) : (
//             <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Date
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Product
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Service
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       User Name
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Booking Date
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Time Slot
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Amount
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Status
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Reply
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {pendingBookings.map((booking) => (
//                     <TableRow
//                       key={booking._id}
//                       className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//                     >
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.date}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.product}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.service}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.userName}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {new Date(booking?.bookingDate).toLocaleDateString(
//                           "en-GB"
//                         )}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.timeSlot}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         ₹ {booking.amount}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3 flex items-center gap-2">
//                         {booking.status === "Pending" && (
//                           <Check className="h-4 w-4 text-green-500" />
//                         )}
//                         {booking.status}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         <Button
//                           variant="default"
//                           size="sm"
//                           onClick={() => navigate(`/expert/prioritydm`)}
//                           className="bg-blue-500 hover:bg-blue-600 text-white"
//                         >
//                           Reply
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </TabsContent>

//         <TabsContent value="completed">
//           {completedBookings.length === 0 ? (
//             renderNoBookings("completed")
//           ) : (
//             <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Date
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Product
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Service
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       User Name
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Booking Date
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Time Slot
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Amount
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Status
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {completedBookings.map((booking) => (
//                     <TableRow
//                       key={booking._id}
//                       className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//                     >
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.date}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.product}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.service}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.userName}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {new Date(booking?.bookingDate).toLocaleDateString(
//                           "en-GB"
//                         )}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.timeSlot}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         ₹ {booking.amount}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3 flex items-center gap-2">
//                         {booking.status === "Completed" && (
//                           <Check className="h-4 w-4 text-green-500" />
//                         )}
//                         {booking.status}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </TabsContent>

//         <TabsContent value="cancelled">
//           {cancelledBookings.length === 0 ? (
//             renderNoBookings("cancelled")
//           ) : (
//             <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Date
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Product
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Service
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       User Name
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Booking Date
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Time Slot
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Amount
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Status
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {cancelledBookings.map((booking) => (
//                     <TableRow
//                       key={booking._id}
//                       className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//                     >
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.date}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.product}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.service}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.userName}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {new Date(booking?.bookingDate).toLocaleDateString(
//                           "en-GB"
//                         )}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.timeSlot}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         ₹ {booking.amount}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3 flex items-center gap-2">
//                         {booking.status === "Cancelled" && (
//                           <Check className="h-4 w-4 text-green-500" />
//                         )}
//                         {booking.status}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </TabsContent>
//       </Tabs>

//       {totalPages > 1 && (
//         <div className="flex justify-between items-center mt-6">
//           <Button
//             onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//             disabled={page === 1}
//             className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
//           >
//             Previous
//           </Button>
//           <div className="flex gap-2">
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//               <Button
//                 key={p}
//                 onClick={() => setPage(p)}
//                 variant={page === p ? "default" : "outline"}
//                 className={`${
//                   page === p
//                     ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
//                     : "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
//                 } border-gray-300 dark:border-gray-600`}
//               >
//                 {p}
//               </Button>
//             ))}
//           </div>
//           <Button
//             onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
//             disabled={page === totalPages}
//             className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
//           >
//             Next
//           </Button>
//         </div>
//       )}

//       <FeedbackModal
//         isOpen={isFeedbackModalOpen}
//         onClose={() => {
//           setIsFeedbackModalOpen(false);
//           setSelectedBookingId(null);
//         }}
//         onSubmit={handleFeedbackSubmit}
//       />

//       <ConfirmationModal
//         open={isConfirmationModalOpen}
//         onOpenChange={setIsConfirmationModalOpen}
//         onConfirm={confirmApproval}
//         title={`${
//           actionType === "approve" ? "Approve" : "Reject"
//         } Reschedule Request`}
//         description={`Are you sure you want to ${actionType} the reschedule request for ${
//           selectedBooking?.userName
//         }'s booking to ${
//           selectedBooking?.rescheduleRequest?.requestedDate || "N/A"
//         } at ${selectedBooking?.rescheduleRequest?.requestedTime || "N/A"}?`}
//       />

//       <RescheduleModal
//         isOpen={isRescheduleModalOpen}
//         onClose={() => {
//           setIsRescheduleModalOpen(false);
//           setSelectedBooking(null);
//           setSelectedBookingId(null);
//         }}
//         onSubmit={handleRescheduleSubmit}
//         bookingId={selectedBooking?._id}
//         serviceSlot={selectedBooking?.serviceId}
//         mentorId={mentorId}
//         refreshBookings={refreshBookings}
//       />
//     </div>
//   );
// }
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
import {
  CalendarX,
  Check,
  Search,
  Filter,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
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
      if (updates?.rescheduleRequest?.rescheduleStatus === "rejected") {
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
    setIsFeedbackModalOpen(false);
    setSelectedBookingId(null);
  };

  const handleApproveReschedule = (booking: Booking) => {
    setSelectedBooking(booking);
    setSelectedBookingId(booking._id);
    setActionType("approve");
    setIsConfirmationModalOpen(true);
  };

  const handleRejectReschedule = (booking: Booking) => {
    setSelectedBooking(booking);
    setSelectedBookingId(booking._id);
    setActionType("reject");
    setIsConfirmationModalOpen(true);
  };

  const confirmApproval = () => {
    if (!selectedBooking || !selectedBooking.rescheduleRequest) return;

    const isApprove = actionType === "approve";
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
          dayOfWeek,
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
  };

  const refreshBookings = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["mentorBookings", mentorId, page],
    });
  };

  const filterBookings = useMemo(() => {
    return (bookings: Booking[]) => {
      let filtered = bookings;

      if (selectedFilter !== "All") {
        filtered = filtered.filter((b) => b.service === selectedFilter);
      }

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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "completed":
        return <Check className="h-4 w-4 text-green-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "rescheduled":
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold";

    switch (status.toLowerCase()) {
      case "confirmed":
        return `${baseClasses} bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300`;
      case "pending":
        return `${baseClasses} bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300`;
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`;
      case "cancelled":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`;
      case "rescheduled":
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300`;
    }
  };

  const renderNoBookings = (tab: string) => (
    <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
      <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-lg mb-6">
        <CalendarX className="h-12 w-12 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
        No {tab} Bookings
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-center max-w-md">
        {tab === "upcoming" || tab === "pending"
          ? "You have no upcoming bookings scheduled at the moment."
          : "You have no completed or cancelled bookings to display."}
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Loading your bookings...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 font-semibold">
            Error loading bookings: {(isError as Error).message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pl-20 max-w-7xl mx-auto px-6 py-8 space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Bookings Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
            Manage and track all your mentoring sessions
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
          <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="text-blue-800 dark:text-blue-300 font-semibold">
            {total} Total Bookings
          </span>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
              <Filter className="h-4 w-4" />
            </div>
            {allServiceTypes.map((type) => (
              <Button
                key={type}
                onClick={() => setSelectedFilter(type)}
                variant="outline"
                className={`rounded-full border-2 px-6 py-2 font-semibold transition-all duration-200 ${
                  selectedFilter === type
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-blue-400"
                }`}
              >
                {type}
              </Button>
            ))}
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search by name or product..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="pl-12 pr-4 py-3 rounded-full bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-4"
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl  p-0 shadow-lg border border-slate-200 dark:border-slate-700">
          <TabsList className="w-full h-16 grid grid-cols-5 bg-slate-100 dark:bg-slate-700 rounded-xl p-0">
            {[
              {
                key: "upcoming",
                label: "Upcoming",
                icon: Calendar,
                count: upcomingBookings.length,
              },
              {
                key: "rescheduled",
                label: "Rescheduled",
                icon: RefreshCw,
                count: rescheduledBookings.length,
              },
              {
                key: "pending",
                label: "Pending",
                icon: AlertCircle,
                count: pendingBookings.length,
              },
              {
                key: "completed",
                label: "Completed",
                icon: CheckCircle,
                count: completedBookings.length,
              },
              {
                key: "cancelled",
                label: "Cancelled",
                icon: XCircle,
                count: cancelledBookings.length,
              },
            ].map(({ key, label, icon: Icon, count }) => (
              <TabsTrigger
                key={key}
                value={key}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  selectedTab === key
                    ? "bg-white dark:bg-slate-800 text-blue-600 shadow-md"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
                {count > 0 && (
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-bold px-2 py-1 rounded-full">
                    {count}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Upcoming Tab */}
          <TabsContent value="upcoming" className="m-0">
            {upcomingBookings.length === 0 ? (
              <div className="p-8">{renderNoBookings("upcoming")}</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700">
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Date
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Product
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Service
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        User Name
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Booking Date
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Time Slot
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Amount
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingBookings.map((booking, index) => (
                      <TableRow
                        key={booking._id}
                        className={`transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700 ${
                          index % 2 === 0
                            ? "bg-white dark:bg-slate-800"
                            : "bg-slate-50/50 dark:bg-slate-750"
                        }`}
                      >
                        <TableCell className="text-slate-700 dark:text-slate-300 font-medium py-4 px-6">
                          {booking.date}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 py-4 px-6">
                          {booking.product}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {booking.service}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 font-medium py-4 px-6">
                          {booking.userName}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 py-4 px-6">
                          {new Date(booking?.bookingDate).toLocaleDateString(
                            "en-GB"
                          )}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            {booking.timeSlot}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 font-bold py-4 px-6">
                          ₹ {booking.amount}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className={getStatusBadge(booking.status)}>
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Rescheduled Tab */}
          <TabsContent value="rescheduled" className="m-0">
            {rescheduledBookings.length === 0 ? (
              <div className="p-8">{renderNoBookings("rescheduled")}</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-slate-50 to-orange-50 dark:from-slate-800 dark:to-slate-700">
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Date
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Product
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Service
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        User Name
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Requested Date
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Requested Time
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Amount
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Status
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rescheduledBookings.map((booking, index) => (
                      <TableRow
                        key={booking._id}
                        className={`transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700 ${
                          index % 2 === 0
                            ? "bg-white dark:bg-slate-800"
                            : "bg-slate-50/50 dark:bg-slate-750"
                        }`}
                      >
                        <TableCell className="text-slate-700 dark:text-slate-300 font-medium py-4 px-6">
                          {booking.date}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 py-4 px-6">
                          {booking.product}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {booking.service}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 font-medium py-4 px-6">
                          {booking.userName}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 py-4 px-6">
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
                        <TableCell className="text-slate-700 dark:text-slate-300 py-4 px-6">
                          {booking.rescheduleRequest?.requestedTime ||
                            "Mentor Decide"}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 font-bold py-4 px-6">
                          ₹ {booking.amount}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div
                            className={getStatusBadge(
                              booking.rescheduleRequest?.rescheduleStatus ||
                                "N/A"
                            )}
                          >
                            {capitalize(
                              booking.rescheduleRequest?.rescheduleStatus
                            ) || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          {booking.rescheduleRequest?.rescheduleStatus ===
                            "pending" && (
                            <div className="flex gap-2">
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleApproveReschedule(booking)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold"
                              >
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRejectReschedule(booking)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Pending Tab */}
          <TabsContent value="pending" className="m-0">
            {pendingBookings.length === 0 ? (
              <div className="p-8">{renderNoBookings("pending")}</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-slate-50 to-amber-50 dark:from-slate-800 dark:to-slate-700">
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Date
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Product
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Service
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        User Name
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Booking Date
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Time Slot
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Amount
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Status
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Reply
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingBookings.map((booking, index) => (
                      <TableRow
                        key={booking._id}
                        className={`transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700 ${
                          index % 2 === 0
                            ? "bg-white dark:bg-slate-800"
                            : "bg-slate-50/50 dark:bg-slate-750"
                        }`}
                      >
                        <TableCell className="text-slate-700 dark:text-slate-300 font-medium py-4 px-6">
                          {booking.date}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 py-4 px-6">
                          {booking.product}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {booking.service}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 font-medium py-4 px-6">
                          {booking.userName}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 py-4 px-6">
                          {new Date(booking?.bookingDate).toLocaleDateString(
                            "en-GB"
                          )}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            {booking.timeSlot}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 font-bold py-4 px-6">
                          ₹ {booking.amount}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className={getStatusBadge(booking.status)}>
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => navigate(`/expert/prioritydm`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
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

          {/* Completed Tab */}
          <TabsContent value="completed" className="m-0">
            {completedBookings.length === 0 ? (
              <div className="p-8">{renderNoBookings("completed")}</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-slate-50 to-green-50 dark:from-slate-800 dark:to-slate-700">
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Date
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Product
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Service
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        User Name
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Booking Date
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Time Slot
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Amount
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedBookings.map((booking, index) => (
                      <TableRow
                        key={booking._id}
                        className={`transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700 ${
                          index % 2 === 0
                            ? "bg-white dark:bg-slate-800"
                            : "bg-slate-50/50 dark:bg-slate-750"
                        }`}
                      >
                        <TableCell className="text-slate-700 dark:text-slate-300 font-medium py-4 px-6">
                          {booking.date}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 py-4 px-6">
                          {booking.product}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {booking.service}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 font-medium py-4 px-6">
                          {booking.userName}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 py-4 px-6">
                          {new Date(booking?.bookingDate).toLocaleDateString(
                            "en-GB"
                          )}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            {booking.timeSlot}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 font-bold py-4 px-6">
                          ₹ {booking.amount}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className={getStatusBadge(booking.status)}>
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Cancelled Tab */}
          <TabsContent value="cancelled" className="m-0">
            {cancelledBookings.length === 0 ? (
              <div className="p-8">{renderNoBookings("cancelled")}</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-slate-50 to-red-50 dark:from-slate-800 dark:to-slate-700">
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Date
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Product
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Service
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        User Name
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Booking Date
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Time Slot
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Amount
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cancelledBookings.map((booking, index) => (
                      <TableRow
                        key={booking._id}
                        className={`transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700 ${
                          index % 2 === 0
                            ? "bg-white dark:bg-slate-800"
                            : "bg-slate-50/50 dark:bg-slate-750"
                        }`}
                      >
                        <TableCell className="text-slate-700 dark:text-slate-300 font-medium py-4 px-6">
                          {booking.date}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 py-4 px-6">
                          {booking.product}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {booking.service}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 font-medium py-4 px-6">
                          {booking.userName}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 py-4 px-6">
                          {new Date(booking?.bookingDate).toLocaleDateString(
                            "en-GB"
                          )}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            {booking.timeSlot}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 font-bold py-4 px-6">
                          ₹ {booking.amount}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className={getStatusBadge(booking.status)}>
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-slate-600 dark:text-slate-400 text-sm">
                Showing page {page} of {totalPages} ({total} total bookings)
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  variant="outline"
                  className="px-4 py-2 rounded-lg border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
                >
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        variant={page === pageNum ? "default" : "outline"}
                        className={`w-10 h-10 rounded-lg font-semibold ${
                          page === pageNum
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                  variant="outline"
                  className="px-4 py-2 rounded-lg border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </Tabs>

      {/* Modals */}
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
