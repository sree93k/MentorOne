// import { useState, useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import FeedbackModal from "@/components/modal/FeedbackModal";
// import { getBookingsByMentor } from "@/services/bookingService";
// import { CalendarX, Check } from "lucide-react";
// import RescheduleModal from "@/components/modal/ResheduleModal";
// import ConfirmationModal from "@/components/modal/ConfirmationModal";

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
// }

// const allServiceTypes = ["All", "1:1 Call", "Priority DM", "Digital product"];

// export default function BookingsPage() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedTab, setSelectedTab] = useState("upcoming");
//   const [selectedFilter, setSelectedFilter] = useState("All");
//   const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
//     null
//   );
//   const [globalSearch, setGlobalSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const limit = 10;

//   const { user } = useSelector((state: RootState) => state.user);
//   const mentorId = user?._id;

//   const {
//     data: { bookings = [], total = 0 } = {},
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["mentorBookings", mentorId, page],
//     queryFn: async () => {
//       if (!mentorId) throw new Error("Mentor ID is required");
//       const response = await getBookingsByMentor(mentorId, page, limit);
//       return {
//         bookings: response.data.map((booking: any) => ({
//           _id: booking._id,
//           date: new Date(booking.bookingDate).toLocaleDateString("en-US", {
//             day: "2-digit",
//             month: "2-digit",
//             year: "numeric",
//           }),
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
//           amount: booking.serviceId?.amount || 0,
//           paymentStatus: capitalize(booking.paymentDetails?.status) || "N/A",
//           status: capitalize(booking.status) || "N/A",
//         })),
//         total: response.total,
//       };
//     },
//     enabled: !!mentorId,
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
//     setIsModalOpen(false);
//     setSelectedBookingId(null);
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

//   if (isLoading)
//     return (
//       <div className="text-center py-4 text-gray-600 dark:text-gray-300">
//         Loading bookings...
//       </div>
//     );
//   if (error)
//     return (
//       <div className="text-center py-4 text-red-500">
//         Error loading bookings: {(error as Error).message}
//       </div>
//     );

//   // Fallback UI for no bookings
//   const renderNoBookings = (tab: string) => (
//     <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
//       <CalendarX className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
//       <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
//         No {tab} Bookings
//       </h2>
//       <p className="text-gray-500 dark:text-gray-400 mt-2">
//         {tab === "upcoming"
//           ? "You have no upcoming bookings scheduled."
//           : "You have no completed or cancelled bookings."}
//       </p>
//     </div>
//   );

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
//           {["upcoming", "rescheduled", "completed", "cancelled"].map((tab) => (
//             <TabsTrigger
//               key={tab}
//               value={tab}
//               className={`pb-3 capitalize transition-all rounded-none text-lg font-semibold ${
//                 selectedTab === tab
//                   ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
//                   : "text-gray-500 dark:text-gray-400"
//               }`}
//             >
//               {tab}
//             </TabsTrigger>
//           ))}
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

//         {/* Rescheduled Tab */}
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
//                       Time Slot
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Amount
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Booking Status
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Reshedule Status
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Confirm
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
//                         {booking.timeSlot}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         ₹ {booking.amount}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3 flex items-center gap-2">
//                         {booking.status === "Rescheduled" && (
//                           <Check className="h-4 w-4 text-green-500" />
//                         )}
//                         {booking.status}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {booking.rescheduleRequest.rescheduleStatus}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         <Select>
//                           <SelectTrigger className="w-[180px]">
//                             <SelectValue placeholder="Select a fruit" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectGroup>
//                               <SelectLabel>Fruits</SelectLabel>
//                               <SelectItem value="apple">Apple</SelectItem>
//                               <SelectItem value="banana">Banana</SelectItem>
//                               <SelectItem value="blueberry">
//                                 Blueberry
//                               </SelectItem>
//                               <SelectItem value="grapes">Grapes</SelectItem>
//                               <SelectItem value="pineapple">
//                                 Pineapple
//                               </SelectItem>
//                             </SelectGroup>
//                           </SelectContent>
//                         </Select>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </TabsContent>

//         {/* Completed Tab */}
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

//         {/* Cancelled Tab */}
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
//       {/* Feedback Modal */}
//       <FeedbackModal
//         isOpen={isModalOpen}
//         onClose={() => {
//           setIsModalOpen(false);
//           setSelectedBookingId(null);
//         }}
//         onSubmit={handleFeedbackSubmit}
//       />
//     </div>
//   );
// }
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
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
import FeedbackModal from "@/components/modal/FeedbackModal";
import RescheduleModal from "@/components/modal/ResheduleModal"; // Ensure correct spelling
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import { getBookingsByMentor, updateStatus } from "@/services/bookingService";
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
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [globalSearch, setGlobalSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 40;

  const { user } = useSelector((state: RootState) => state.user);
  const mentorId = user?._id;

  const queryClient = useQueryClient();

  const {
    data: { bookings = [], total = 0 } = {},
    isLoading,
    error,
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

  // const updateBookingStatusMutation = useMutation({
  //   mutationFn: async ({
  //     bookingId,
  //     status,
  //     updates,
  //   }: {
  //     bookingId: string;
  //     status: string;
  //     updates?: {
  //       bookingDate?: string;
  //       startTime?: string;
  //       slotIndex?: number;
  //     };
  //   }) => {
  //     const payload = { status, ...updates };
  //     await updateStatus(bookingId, payload);
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({
  //       queryKey: ["mentorBookings", mentorId, page],
  //     });
  //     toast.success("Reschedule request updated successfully.");
  //   },
  //   onError: (error: any) => {
  //     toast.error(error.message || "Failed to update reschedule request.");
  //   },
  // });
  // BookingsPage.tsx
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
      await updateStatus(bookingId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mentorBookings", mentorId, page],
      });
      toast.success("Reschedule request updated successfully.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update reschedule request.");
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
    setIsConfirmationModalOpen(true);
  };

  const handleRejectReschedule = (booking: Booking) => {
    setSelectedBooking(booking);
    setSelectedBookingId(booking._id);
    setIsRescheduleModalOpen(true);
  };
  // BookingsPage.tsx
  const confirmApproval = () => {
    if (!selectedBooking || !selectedBooking.rescheduleRequest) return;

    updateBookingStatusMutation.mutate({
      bookingId: selectedBooking._id,
      status: "confirmed", // Change from "rescheduled" to "confirmed"
      updates: {
        bookingDate: selectedBooking.rescheduleRequest.requestedDate,
        startTime: selectedBooking.rescheduleRequest.requestedTime,
        slotIndex: selectedBooking.rescheduleRequest.requestedSlotIndex,
        rescheduleRequest: {
          rescheduleStatus: "accepted", // Set to "accepted"
        },
      },
    });

    setIsConfirmationModalOpen(false);
    setSelectedBooking(null);
    setSelectedBookingId(null);
  };

  // const handleRescheduleSubmit = (data: {
  //   requestedDate?: string;
  //   requestedTime?: string;
  //   requestedSlotIndex?: number;
  // }) => {
  //   if (!selectedBooking) return;

  //   updateBookingStatusMutation.mutate({
  //     bookingId: selectedBooking._id,
  //     status: "rescheduled",
  //     updates: {
  //       bookingDate: data.requestedDate,
  //       startTime: data.requestedTime,
  //       slotIndex: data.requestedSlotIndex,
  //     },
  //   });

  //   setIsRescheduleModalOpen(false);
  //   setSelectedBooking(null);
  //   setSelectedBookingId(null);
  // };
  // BookingsPage.tsx
  const handleRescheduleSubmit = (data: {
    requestedDate?: string;
    requestedTime?: string;
    requestedSlotIndex?: number;
  }) => {
    if (!selectedBooking) return;

    updateBookingStatusMutation.mutate({
      bookingId: selectedBooking._id,
      status: "confirmed", // Change from "rescheduled" to "confirmed"
      updates: {
        bookingDate: data.requestedDate,
        startTime: data.requestedTime,
        slotIndex: data.requestedSlotIndex,
        rescheduleRequest: {
          rescheduleStatus: "accepted", // Set to "accepted"
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
    bookings.filter((b) => b.status === "Confirmed" || b.status === "Pending")
  );
  const rescheduledBookings = filterBookings(
    bookings.filter(
      (b) =>
        b.status === "Rescheduled" ||
        (b.rescheduleRequest?.rescheduleStatus === "pending" &&
          b.status === "Confirmed")
    )
  );
  const completedBookings = filterBookings(
    bookings.filter((b) => b.status === "Completed")
  );
  const cancelledBookings = filterBookings(
    bookings.filter((b) => b.status === "Cancelled")
  );
  const totalPages = Math.ceil(total / limit);

  if (isLoading)
    return (
      <div className="text-center py-4 text-gray-600 dark:text-gray-300">
        Loading bookings...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-4 text-red-500">
        Error loading bookings: {(error as Error).message}
      </div>
    );

  const renderNoBookings = (tab: string) => (
    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <CalendarX className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
        No {tab} Bookings
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2">
        {tab === "upcoming"
          ? "You have no upcoming bookings scheduled."
          : "You have no completed or cancelled bookings."}
      </p>
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
          {["upcoming", "rescheduled", "completed", "cancelled"].map((tab) => (
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
          ))}
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
                        {(booking.status === "Confirmed" ||
                          booking.status === "Pending") && (
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
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.rescheduleRequest?.requestedTime || "N/A"}
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
        title="Approve Reschedule Request"
        description={`Are you sure you want to approve the reschedule request for ${selectedBooking?.userName}'s booking to ${selectedBooking?.rescheduleRequest?.requestedDate} at ${selectedBooking?.rescheduleRequest?.requestedTime}?`}
      />

      <RescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => {
          setIsRescheduleModalOpen(false);
          setSelectedBooking(null);
          setSelectedBookingId(null);
        }}
        onSubmit={handleRescheduleSubmit}
        serviceId={selectedBooking?.serviceId?._id}
        mentorId={mentorId}
      />
    </div>
  );
}
