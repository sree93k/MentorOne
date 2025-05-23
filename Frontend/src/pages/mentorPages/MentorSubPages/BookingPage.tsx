// import { useState } from "react";
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
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import FeedbackModal from "@/components/modal/FeedbackModal";
// import { getBookingsByMentor } from "@/services/bookingService";
// import { Check } from "lucide-react";

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
//   const limit = 10; // Number of bookings per page

//   const { user } = useSelector((state: RootState) => state.user);
//   const mentorId = user?._id;

//   // Fetch bookings with pagination
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

//   // Capitalize first letter
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

//   const filterBookings = (bookings: Booking[]) => {
//     if (selectedFilter === "All") return bookings;
//     const serviceMap: { [key: string]: string } = {
//       "1:1 Call": "1-1Call",
//       "Priority DM": "priorityDM",
//       "Digital product": "DigitalProducts",
//     };
//     const backendServiceType = serviceMap[selectedFilter];
//     return bookings.filter((b) => b.service === selectedFilter);
//   };

//   const upcomingBookings = filterBookings(
//     bookings.filter(
//       (b) => b.status === "Confirmed" || b.status === "Rescheduled"
//     )
//   );
//   const completedBookings = filterBookings(
//     bookings.filter((b) => b.status === "Completed" || b.status === "Cancelled")
//   );

//   const totalPages = Math.ceil(total / limit);

//   if (isLoading)
//     return <div className="text-center py-4">Loading bookings...</div>;
//   if (error)
//     return (
//       <div className="text-center py-4 text-red-500">
//         Error loading bookings: {(error as Error).message}
//       </div>
//     );

//   return (
//     <div className="mx-32 py-6">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
//         Bookings
//       </h1>

//       {/* Service Type Filter */}
//       <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-700 pb-2">
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
//       </div>
//       {/* Tabs */}
//       <Tabs value={selectedTab} onValueChange={setSelectedTab}>
//         <TabsList className="w-full flex justify-start gap-8 border-b border-gray-200 dark:border-gray-700 mb-8 bg-transparent">
//           {["upcoming", "completed"].map((tab) => (
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

//           {/* Search Input */}
//           <div className="flex justify-end mb-8">
//             <Input
//               placeholder="Search by user name or product..."
//               value={globalSearch}
//               onChange={(e) => setGlobalSearch(e.target.value)}
//               className="w-full sm:w-64 rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 pr-4 mr-4"
//             />
//           </div>
//         </TabsList>

//         {/* Upcoming Tab */}
//         <TabsContent value="upcoming">
//           <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
//                   <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                     Date
//                   </TableHead>
//                   <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                     Product
//                   </TableHead>
//                   <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                     Service
//                   </TableHead>
//                   <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                     User Name
//                   </TableHead>
//                   <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                     Time Slot
//                   </TableHead>
//                   <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                     Amount
//                   </TableHead>
//                   <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                     Status
//                   </TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {upcomingBookings.map((booking) => (
//                   <TableRow
//                     key={booking._id}
//                     className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//                   >
//                     <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                       {booking.date}
//                     </TableCell>
//                     <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                       {booking.product}
//                     </TableCell>
//                     <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                       {booking.service}
//                     </TableCell>
//                     <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                       {booking.userName}
//                     </TableCell>
//                     <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                       {booking.timeSlot}
//                     </TableCell>
//                     <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                       ₹ {booking.amount}
//                     </TableCell>
//                     <TableCell className="text-gray-700 dark:text-gray-300 py-3 flex items-center gap-2">
//                       {booking.status === "Confirmed" && (
//                         <Check className="h-4 w-4 text-green-500" />
//                       )}
//                       {booking.status}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </TabsContent>

//         {/* Completed Tab */}
//         <TabsContent value="completed">
//           <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
//                   <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                     Date
//                   </TableHead>
//                   <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                     Product
//                   </TableHead>
//                   <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                     Service
//                   </TableHead>
//                   <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                     User Name
//                   </TableHead>
//                   <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                     Time Slot
//                   </TableHead>
//                   <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                     Amount
//                   </TableHead>
//                   <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                     Payment Status
//                   </TableHead>
//                   <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                     Feedback
//                   </TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {completedBookings.map((booking) => (
//                   <TableRow
//                     key={booking._id}
//                     className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//                   >
//                     <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                       {booking.date}
//                     </TableCell>
//                     <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                       {booking.product}
//                     </TableCell>
//                     <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                       {booking.service}
//                     </TableCell>
//                     <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                       {booking.userName}
//                     </TableCell>
//                     <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                       {booking.timeSlot}
//                     </TableCell>
//                     <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                       ₹ {booking.amount}
//                     </TableCell>
//                     <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                       {booking.paymentStatus}
//                     </TableCell>
//                     <TableCell>
//                       <Button
//                         variant="link"
//                         className="p-0 h-auto font-normal underline text-blue-600 dark:text-blue-400"
//                         onClick={() => {
//                           setSelectedBookingId(booking._id);
//                           setIsModalOpen(true);
//                         }}
//                       >
//                         {booking.status}
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </TabsContent>
//       </Tabs>
//       {/* Pagination */}
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
import { useQuery } from "@tanstack/react-query";
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
import { getBookingsByMentor } from "@/services/bookingService";
import { CalendarX, Check } from "lucide-react";

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
}

const allServiceTypes = ["All", "1:1 Call", "Priority DM", "Digital product"];

export default function BookingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [globalSearch, setGlobalSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { user } = useSelector((state: RootState) => state.user);
  const mentorId = user?._id;

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
          amount: booking.serviceId?.amount || 0,
          paymentStatus: capitalize(booking.paymentDetails?.status) || "N/A",
          status: capitalize(booking.status) || "N/A",
        })),
        total: response.total,
      };
    },
    enabled: !!mentorId,
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
    setIsModalOpen(false);
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
    bookings.filter(
      (b) => b.status === "Confirmed" || b.status === "Rescheduled"
    )
  );
  const completedBookings = filterBookings(
    bookings.filter((b) => b.status === "Completed" || b.status === "Cancelled")
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

  // Fallback UI for no bookings
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

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="w-full flex justify-start gap-8 border-b border-gray-200 dark:border-gray-700 mb-8 bg-transparent">
          {["upcoming", "completed"].map((tab) => (
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

        {/* Upcoming Tab */}
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

        {/* Completed Tab */}
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
                      Time Slot
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Amount
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Payment Status
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Feedback
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
                        {booking.timeSlot}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        ₹ {booking.amount}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {booking.paymentStatus}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="link"
                          className="p-0 h-auto font-normal underline text-blue-600 dark:text-blue-400"
                          onClick={() => {
                            setSelectedBookingId(booking._id);
                            setIsModalOpen(true);
                          }}
                        >
                          {booking.status}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Pagination */}
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

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBookingId(null);
        }}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
}
