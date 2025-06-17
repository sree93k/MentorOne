// // import { useState, useEffect } from "react";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import { Card } from "@/components/ui/card";
// // import { Input } from "@/components/ui/input";
// // import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu";
// // import { ChevronDown, CalendarX, Check } from "lucide-react";
// // import { getAllBookings } from "@/services/adminService";

// // interface Booking {
// //   date: string;
// //   mentorName: string;
// //   menteeName: string;
// //   service: string;
// //   type: string;
// //   timeSlot: string;
// //   paymentStatus: string;
// //   bookingStatus: string;
// // }

// // export default function BookingsPage() {
// //   const [bookings, setBookings] = useState<Booking[]>([]);
// //   const [total, setTotal] = useState(0);
// //   const [page, setPage] = useState(1);
// //   const [limit] = useState(10);
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [mentorFilter, setMentorFilter] = useState("");
// //   const [menteeFilter, setMenteeFilter] = useState("");
// //   const [typeFilter, setTypeFilter] = useState("All");
// //   const [statusFilter, setStatusFilter] = useState("All");
// //   const [tab, setTab] = useState("all");
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });

// //   const statusOptions = [
// //     "All",
// //     "confirmed",
// //     "rescheduled",
// //     "cancelled",
// //     "completed",
// //   ];

// //   const mapTypeToDisplay = (type: string): string => {
// //     switch (type?.toLowerCase()) {
// //       case "1-1call":
// //       case "1:1 call":
// //         return "1:1 Call";
// //       case "prioritydm":
// //       case "priority dm":
// //         return "Priority DM";
// //       case "digitalproducts":
// //       case "digital product":
// //         return "Digital Product";
// //       default:
// //         return type || "Unknown";
// //     }
// //   };

// //   const fetchBookings = async () => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       console.log("Fetching bookings with params:", {
// //         page,
// //         limit,
// //         searchQuery,
// //         statusFilter,
// //       });
// //       const response = await getAllBookings(
// //         page,
// //         limit,
// //         searchQuery,
// //         "", // No type filter for backend
// //         statusFilter
// //       );
// //       console.log("Backend response:", response);

// //       if (response?.data?.data) {
// //         const { data, total } = response.data;
// //         console.log("Bookings data:", data, "Total:", total);
// //         const formattedBookings = data.map((booking: any) => ({
// //           date: new Date(booking.bookingDate).toLocaleDateString("en-US", {
// //             day: "2-digit",
// //             month: "2-digit",
// //             year: "numeric",
// //           }),
// //           mentorName:
// //             `${booking.mentorId?.firstName || ""} ${
// //               booking.mentorId?.lastName || ""
// //             }`.trim() || "Unknown",
// //           menteeName:
// //             `${booking.menteeId?.firstName || ""} ${
// //               booking.menteeId?.lastName || ""
// //             }`.trim() || "Unknown",
// //           type: booking.serviceId?.type || "Unknown",
// //           service: booking.serviceId?.title || "Unknown",
// //           timeSlot: `${booking.startTime} - ${
// //             booking.endTime || booking.startTime
// //           }`,
// //           paymentStatus: booking.paymentDetails?.status || "Unknown",
// //           bookingStatus: booking.status || "Unknown",
// //         }));
// //         setBookings(formattedBookings);
// //         setTotal(total);
// //         const pending = data.filter(
// //           (b: any) => b.status === "confirmed" || b.status === "rescheduled"
// //         ).length;
// //         const completed = data.filter(
// //           (b: any) => b.status === "completed"
// //         ).length;
// //         setStats({ total, pending, completed });
// //       } else {
// //         console.log("No success in response:", response?.data);
// //         setError(response?.data?.error || "Failed to fetch bookings.");
// //         setBookings([]);
// //         setTotal(0);
// //         setStats({ total: 0, pending: 0, completed: 0 });
// //       }
// //     } catch (error: any) {
// //       console.error("Error fetching bookings:", error);
// //       setError(
// //         error.response?.data?.error ||
// //           error.message ||
// //           "An error occurred while fetching bookings."
// //       );
// //       setBookings([]);
// //       setTotal(0);
// //       setStats({ total: 0, pending: 0, completed: 0 });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchBookings();
// //   }, [page, searchQuery, mentorFilter, menteeFilter, statusFilter]);

// //   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     setSearchQuery(e.target.value);
// //     setPage(1);
// //   };

// //   const handleTabChange = (value: string) => {
// //     setTab(value);
// //     if (value === "upcoming") {
// //       setStatusFilter("confirmed");
// //     } else if (value === "completed") {
// //       setStatusFilter("completed");
// //     } else {
// //       setStatusFilter("All");
// //     }
// //     setPage(1);
// //   };

// //   const handleMentorFilter = (value: string) => {
// //     setMentorFilter(value);
// //     setPage(1);
// //   };

// //   const handleMenteeFilter = (value: string) => {
// //     setMenteeFilter(value);
// //     setPage(1);
// //   };

// //   const handleTypeFilter = (value: string) => {
// //     setTypeFilter(value);
// //     setPage(1);
// //   };

// //   const handleStatusFilter = (value: string) => {
// //     setStatusFilter(value);
// //     setPage(1);
// //   };

// //   const handleNextPage = () => {
// //     if (page < totalPages) {
// //       setPage(page + 1);
// //     }
// //   };

// //   const handlePrevPage = () => {
// //     if (page > 1) {
// //       setPage(page - 1);
// //     }
// //   };

// //   const totalPages = Math.ceil(total / limit);

// //   const filteredBookings = bookings.filter((booking) => {
// //     const matchesMentor = mentorFilter
// //       ? booking.mentorName.toLowerCase().includes(mentorFilter.toLowerCase())
// //       : true;
// //     const matchesMentee = menteeFilter
// //       ? booking.menteeName.toLowerCase().includes(menteeFilter.toLowerCase())
// //       : true;
// //     const matchesType =
// //       typeFilter && typeFilter !== "All" ? booking.type === typeFilter : true;
// //     return matchesMentor && matchesMentee && matchesType;
// //   });

// //   const uniqueMentors = Array.from(
// //     new Set(bookings.map((b) => b.mentorName))
// //   ).sort();
// //   const uniqueMentees = Array.from(
// //     new Set(bookings.map((b) => b.menteeName))
// //   ).sort();
// //   const uniqueTypes = Array.from(new Set(bookings.map((b) => b.type))).sort();

// //   const renderNoBookings = (tab: string) => (
// //     <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
// //       <CalendarX className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
// //       <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
// //         No {tab} Bookings
// //       </h2>
// //       <p className="text-gray-500 dark:text-gray-400 mt-2">
// //         {tab === "upcoming"
// //           ? "There are no upcoming bookings scheduled."
// //           : "There are no completed or cancelled bookings."}
// //       </p>
// //     </div>
// //   );

// //   return (
// //     <div className="flex min-h-screen">
// //       <div className="p-6 mx-32 w-full bg-white dark:bg-gray-900">
// //         <div className="flex flex-row mb-6">
// //           <div>
// //             <h1 className="text-2xl font-bold pt-4 text-gray-800 dark:text-gray-100">
// //               Bookings
// //             </h1>
// //           </div>
// //         </div>

// //         {error && <div className="text-red-500 mb-4">{error}</div>}

// //         <div className="flex justify-between items-center gap-6 mb-8 border-b border-gray-200 dark:border-gray-700 pb-2">
// //           <div className="flex grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
// //             <Card className="p-2 h-20 w-36 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
// //               <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-0">
// //                 Total Bookings
// //               </h3>
// //               <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
// //                 {stats.total}
// //               </p>
// //             </Card>
// //             <Card className="p-2 h-20 w-36 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
// //               <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-0">
// //                 Pending
// //               </h3>
// //               <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
// //                 {stats.pending}
// //               </p>
// //             </Card>
// //             <Card className="p-2 h-20 w-36 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
// //               <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-0">
// //                 Completed
// //               </h3>
// //               <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
// //                 {stats.completed}
// //               </p>
// //             </Card>
// //           </div>
// //           <div>
// //             <Input
// //               placeholder="Search by mentor or mentee..."
// //               value={searchQuery}
// //               onChange={handleSearch}
// //               className="w-64 rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 pr-4"
// //             />
// //           </div>
// //         </div>

// //         <Tabs value={tab} onValueChange={handleTabChange} className="mb-8">
// //           <TabsList className="w-full flex justify-start gap-8 border-b border-gray-200 dark:border-gray-700 bg-transparent">
// //             <TabsTrigger
// //               value="all"
// //               className={`pb-3 text-lg font-semibold transition-all rounded-none ${
// //                 tab === "all"
// //                   ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
// //                   : "text-gray-500 dark:text-gray-400"
// //               }`}
// //             >
// //               All Bookings
// //             </TabsTrigger>
// //             <TabsTrigger
// //               value="upcoming"
// //               className={`pb-3 text-lg font-semibold transition-all rounded-none ${
// //                 tab === "upcoming"
// //                   ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
// //                   : "text-gray-500 dark:text-gray-400"
// //               }`}
// //             >
// //               Upcoming
// //             </TabsTrigger>
// //             <TabsTrigger
// //               value="completed"
// //               className={`pb-3 text-lg font-semibold transition-all rounded-none ${
// //                 tab === "completed"
// //                   ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
// //                   : "text-gray-500 dark:text-gray-400"
// //               }`}
// //             >
// //               Completed
// //             </TabsTrigger>
// //           </TabsList>
// //           <TabsContent value={tab}>
// //             <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
// //               <Table>
// //                 <TableHeader>
// //                   <TableRow className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
// //                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
// //                       Date
// //                     </TableHead>
// //                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
// //                       <DropdownMenu>
// //                         <DropdownMenuTrigger className="flex items-center gap-1">
// //                           Mentor Name
// //                           <ChevronDown className="h-4 w-4" />
// //                         </DropdownMenuTrigger>
// //                         <DropdownMenuContent className="bg-white dark:bg-gray-800">
// //                           <DropdownMenuItem
// //                             onClick={() => handleMentorFilter("")}
// //                           >
// //                             All
// //                           </DropdownMenuItem>
// //                           {uniqueMentors.map((mentor) => (
// //                             <DropdownMenuItem
// //                               key={mentor}
// //                               onClick={() => handleMentorFilter(mentor)}
// //                             >
// //                               {mentor}
// //                             </DropdownMenuItem>
// //                           ))}
// //                         </DropdownMenuContent>
// //                       </DropdownMenu>
// //                     </TableHead>
// //                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
// //                       <DropdownMenu>
// //                         <DropdownMenuTrigger className="flex items-center gap-1">
// //                           Mentee Name
// //                           <ChevronDown className="h-4 w-4" />
// //                         </DropdownMenuTrigger>
// //                         <DropdownMenuContent className="bg-white dark:bg-gray-800">
// //                           <DropdownMenuItem
// //                             onClick={() => handleMenteeFilter("")}
// //                           >
// //                             All
// //                           </DropdownMenuItem>
// //                           {uniqueMentees.map((mentee) => (
// //                             <DropdownMenuItem
// //                               key={mentee}
// //                               onClick={() => handleMenteeFilter(mentee)}
// //                             >
// //                               {mentee}
// //                             </DropdownMenuItem>
// //                           ))}
// //                         </DropdownMenuContent>
// //                       </DropdownMenu>
// //                     </TableHead>
// //                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
// //                       <DropdownMenu>
// //                         <DropdownMenuTrigger className="flex items-center gap-1">
// //                           Service Type
// //                           <ChevronDown className="h-4 w-4" />
// //                         </DropdownMenuTrigger>
// //                         <DropdownMenuContent className="bg-white dark:bg-gray-800">
// //                           <DropdownMenuItem
// //                             onClick={() => handleTypeFilter("All")}
// //                           >
// //                             All
// //                           </DropdownMenuItem>
// //                           {uniqueTypes.map((option) => (
// //                             <DropdownMenuItem
// //                               key={option}
// //                               onClick={() => handleTypeFilter(option)}
// //                             >
// //                               {mapTypeToDisplay(option)}
// //                             </DropdownMenuItem>
// //                           ))}
// //                         </DropdownMenuContent>
// //                       </DropdownMenu>
// //                     </TableHead>
// //                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
// //                       Service Name
// //                     </TableHead>
// //                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
// //                       Time Slot
// //                     </TableHead>
// //                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
// //                       <DropdownMenu>
// //                         <DropdownMenuTrigger className="flex items-center gap-1">
// //                           Booking Status
// //                           <ChevronDown className="h-4 w-4" />
// //                         </DropdownMenuTrigger>
// //                         <DropdownMenuContent className="bg-white dark:bg-gray-800">
// //                           {statusOptions.map((option) => (
// //                             <DropdownMenuItem
// //                               key={option}
// //                               onClick={() => handleStatusFilter(option)}
// //                             >
// //                               {option}
// //                             </DropdownMenuItem>
// //                           ))}
// //                         </DropdownMenuContent>
// //                       </DropdownMenu>
// //                     </TableHead>
// //                   </TableRow>
// //                 </TableHeader>
// //                 <TableBody>
// //                   {loading ? (
// //                     <TableRow>
// //                       <TableCell
// //                         colSpan={7}
// //                         className="text-center text-gray-600 dark:text-gray-300 py-4"
// //                       >
// //                         Loading...
// //                       </TableCell>
// //                     </TableRow>
// //                   ) : filteredBookings.length === 0 ? (
// //                     <TableRow>
// //                       <TableCell
// //                         colSpan={7}
// //                         className="text-center text-gray-600 dark:text-gray-300 py-4"
// //                       >
// //                         No bookings found
// //                       </TableCell>
// //                     </TableRow>
// //                   ) : (
// //                     filteredBookings.map((booking, index) => (
// //                       <TableRow
// //                         key={index}
// //                         className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
// //                       >
// //                         <TableCell className="text-gray-700 dark:text-gray-300 py-3">
// //                           {booking.date}
// //                         </TableCell>
// //                         <TableCell className="text-gray-700 dark:text-gray-300 py-3">
// //                           {booking.mentorName}
// //                         </TableCell>
// //                         <TableCell className="text-gray-700 dark:text-gray-300 py-3">
// //                           {booking.menteeName}
// //                         </TableCell>
// //                         <TableCell className="text-gray-700 dark:text-gray-300 py-3">
// //                           {mapTypeToDisplay(booking.type)}
// //                         </TableCell>
// //                         <TableCell className="text-gray-700 dark:text-gray-300 py-3">
// //                           {booking.service}
// //                         </TableCell>
// //                         <TableCell className="text-gray-700 dark:text-gray-300 py-3">
// //                           {booking.timeSlot}
// //                         </TableCell>
// //                         <TableCell className="text-gray-700 dark:text-gray-300 py-3 flex items-center gap-2">
// //                           {booking.bookingStatus === "confirmed" && (
// //                             <Check className="h-4 w-4 text-green-500" />
// //                           )}
// //                           {booking.bookingStatus}
// //                         </TableCell>
// //                       </TableRow>
// //                     ))
// //                   )}
// //                 </TableBody>
// //               </Table>
// //             </div>
// //           </TabsContent>
// //         </Tabs>

// //         {totalPages > 1 && (
// //           <div className="flex justify-between items-center mt-6">
// //             <Button
// //               onClick={handlePrevPage}
// //               disabled={page === 1}
// //               className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-6"
// //             >
// //               Previous
// //             </Button>
// //             <div className="flex gap-2">
// //               {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
// //                 <Button
// //                   key={p}
// //                   onClick={() => setPage(p)}
// //                   variant={page === p ? "default" : "outline"}
// //                   className={`${
// //                     page === p
// //                       ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
// //                       : "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
// //                   } border-gray-300 dark:border-gray-600 rounded-full w-10 h-10`}
// //                 >
// //                   {p}
// //                 </Button>
// //               ))}
// //             </div>
// //             <Button
// //               onClick={handleNextPage}
// //               disabled={page === totalPages}
// //               className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-6"
// //             >
// //               Next
// //             </Button>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }
// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { ChevronDown, CalendarX, Check } from "lucide-react";
// import { getAllBookings } from "@/services/adminService";
// import { setLoading, setError } from "@/redux/slices/adminSlice";
// import TableSkeleton from "@/components/loadingPage/TabelSkeleton";

// interface Booking {
//   date: string;
//   mentorName: string;
//   menteeName: string;
//   service: string;
//   type: string;
//   timeSlot: string;
//   paymentStatus: string;
//   bookingStatus: string;
// }

// interface RootState {
//   admin: {
//     loading: boolean;
//     error: object;
//   };
// }

// const BookingsPage = () => {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [mentorFilter, setMentorFilter] = useState("");
//   const [menteeFilter, setMenteeFilter] = useState("");
//   const [typeFilter, setTypeFilter] = useState("All");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [tab, setTab] = useState("all");
//   const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
//   const dispatch = useDispatch();
//   const loading = useSelector((state: RootState) => state.admin.loading);
//   const error = useSelector((state: RootState) => state.admin.error);

//   const statusOptions = [
//     "All",
//     "confirmed",
//     "rescheduled",
//     "cancelled",
//     "completed",
//   ];

//   const mapTypeToDisplay = (type: string): string => {
//     switch (type?.toLowerCase()) {
//       case "1-1call":
//       case "1:1 call":
//         return "1:1 Call";
//       case "prioritydm":
//       case "priority dm":
//         return "Priority DM";
//       case "digitalproducts":
//       case "digital product":
//         return "Digital Product";
//       default:
//         return type || "Unknown";
//     }
//   };

//   const fetchBookings = async () => {
//     dispatch(setLoading(true));
//     dispatch(setError({}));
//     try {
//       const response = await getAllBookings(
//         page,
//         limit,
//         searchQuery,
//         "", // No type filter for backend
//         statusFilter
//       );

//       if (response?.data?.data) {
//         const { data, total } = response.data;
//         const formattedBookings = data.map((booking: any) => ({
//           date: new Date(booking.bookingDate).toLocaleDateString("en-US", {
//             day: "2-digit",
//             month: "2-digit",
//             year: "numeric",
//           }),
//           mentorName:
//             `${booking.mentorId?.firstName || ""} ${
//               booking.mentorId?.lastName || ""
//             }`.trim() || "Unknown",
//           menteeName:
//             `${booking.menteeId?.firstName || ""} ${
//               booking.menteeId?.lastName || ""
//             }`.trim() || "Unknown",
//           type: booking.serviceId?.type || "Unknown",
//           service: booking.serviceId?.title || "Unknown",
//           timeSlot: `${booking.startTime} - ${
//             booking.endTime || booking.startTime
//           }`,
//           paymentStatus: booking.paymentDetails?.status || "Unknown",
//           bookingStatus: booking.status || "Unknown",
//         }));
//         setBookings(formattedBookings);
//         setTotal(total);
//         const pending = data.filter(
//           (b: any) => b.status === "confirmed" || b.status === "rescheduled"
//         ).length;
//         const completed = data.filter(
//           (b: any) => b.status === "completed"
//         ).length;
//         setStats({ total, pending, completed });
//       } else {
//         dispatch(
//           setError({
//             message: response?.data?.error || "Failed to fetch bookings.",
//           })
//         );
//         setBookings([]);
//         setTotal(0);
//         setStats({ total: 0, pending: 0, completed: 0 });
//       }
//     } catch (error: any) {
//       dispatch(
//         setError({
//           message:
//             error.response?.data?.error ||
//             error.message ||
//             "An error occurred while fetching bookings.",
//         })
//       );
//       setBookings([]);
//       setTotal(0);
//       setStats({ total: 0, pending: 0, completed: 0 });
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, [page, searchQuery, mentorFilter, menteeFilter, statusFilter]);

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//     setPage(1);
//   };

//   const handleTabChange = (value: string) => {
//     setTab(value);
//     if (value === "upcoming") {
//       setStatusFilter("confirmed");
//     } else if (value === "completed") {
//       setStatusFilter("completed");
//     } else {
//       setStatusFilter("All");
//     }
//     setPage(1);
//   };

//   const handleMentorFilter = (value: string) => {
//     setMentorFilter(value);
//     setPage(1);
//   };

//   const handleMenteeFilter = (value: string) => {
//     setMenteeFilter(value);
//     setPage(1);
//   };

//   const handleTypeFilter = (value: string) => {
//     setTypeFilter(value);
//     setPage(1);
//   };

//   const handleStatusFilter = (value: string) => {
//     setStatusFilter(value);
//     setPage(1);
//   };

//   const handleNextPage = () => {
//     if (page < totalPages) {
//       setPage(page + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (page > 1) {
//       setPage(page - 1);
//     }
//   };

//   const totalPages = Math.ceil(total / limit);

//   const filteredBookings = bookings.filter((booking) => {
//     const matchesMentor = mentorFilter
//       ? booking.mentorName.toLowerCase().includes(mentorFilter.toLowerCase())
//       : true;
//     const matchesMentee = menteeFilter
//       ? booking.menteeName.toLowerCase().includes(menteeFilter.toLowerCase())
//       : true;
//     const matchesType =
//       typeFilter && typeFilter !== "All" ? booking.type === typeFilter : true;
//     return matchesMentor && matchesMentee && matchesType;
//   });

//   const uniqueMentors = Array.from(
//     new Set(bookings.map((b) => b.mentorName))
//   ).sort();
//   const uniqueMentees = Array.from(
//     new Set(bookings.map((b) => b.menteeName))
//   ).sort();
//   const uniqueTypes = Array.from(new Set(bookings.map((b) => b.type))).sort();

//   const renderEmptyState = (tab: string) => (
//     <TableRow>
//       <TableCell colSpan={7} className="text-center py-12">
//         <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
//           <CalendarX className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4 animate-bounce" />
//           <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
//             No{" "}
//             {tab === "all"
//               ? "Bookings"
//               : tab === "upcoming"
//               ? "Upcoming Bookings"
//               : "Completed Bookings"}{" "}
//             Found
//           </h2>
//           <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md text-center">
//             {tab === "upcoming"
//               ? "There are no upcoming bookings scheduled. Encourage mentors to create new sessions!"
//               : tab === "completed"
//               ? "There are no completed or cancelled bookings yet."
//               : "No bookings match your current filters. Try adjusting the filters or check back later!"}
//           </p>
//           {tab !== "completed" && (
//             <Button className="mt-4 bg-green-500 hover:bg-green-600 text-white ">
//               No New Booking
//             </Button>
//           )}
//         </div>
//       </TableCell>
//     </TableRow>
//   );

//   const renderErrorState = () => (
//     <TableRow>
//       <TableCell colSpan={7} className="text-center py-12">
//         <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
//           <svg
//             className="h-16 w-16 text-red-400 mb-4"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>
//           <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
//             Something went wrong
//           </h2>
//           {/* <p className="text-red-500 dark:text-red-400 mt-2">
//             {error || "An error occurred."}
//           </p> */}
//           <Button
//             onClick={() => window.location.reload()}
//             className="mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
//           >
//             Try Again
//           </Button>
//         </div>
//       </TableCell>
//     </TableRow>
//   );

//   return (
//     <div className="flex min-h-screen">
//       <div className="p-6 mx-32 w-full bg-white dark:bg-gray-900">
//         <div className="flex flex-row mb-6">
//           <div>
//             <h1 className="text-2xl font-bold pt-4 text-gray-800 dark:text-gray-100">
//               Bookings
//             </h1>
//           </div>
//         </div>

//         <div className="flex justify-between items-center gap-6 mb-8 border-b border-gray-200 dark:border-gray-700 pb-2">
//           <div className="flex grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
//             <Card className="p-2 h-20 w-36 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
//               <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-0">
//                 Total Bookings
//               </h3>
//               <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//                 {stats.total}
//               </p>
//             </Card>
//             <Card className="p-2 h-20 w-36 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
//               <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-0">
//                 Pending
//               </h3>
//               <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//                 {stats.pending}
//               </p>
//             </Card>
//             <Card className="p-2 h-20 w-36 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
//               <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-0">
//                 Completed
//               </h3>
//               <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//                 {stats.completed}
//               </p>
//             </Card>
//           </div>
//           <div>
//             <Input
//               placeholder="Search by mentor or mentee..."
//               value={searchQuery}
//               onChange={handleSearch}
//               className="w-64 rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 pr-4"
//             />
//           </div>
//         </div>

//         <Tabs value={tab} onValueChange={handleTabChange} className="mb-8">
//           <TabsList className="w-full flex justify-start gap-8 border-b border-gray-200 dark:border-gray-700 bg-transparent">
//             <TabsTrigger
//               value="all"
//               className={`pb-3 text-lg font-semibold transition-all rounded-none ${
//                 tab === "all"
//                   ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
//                   : "text-gray-500 dark:text-gray-400"
//               }`}
//             >
//               All Bookings
//             </TabsTrigger>
//             <TabsTrigger
//               value="upcoming"
//               className={`pb-3 text-lg font-semibold transition-all rounded-none ${
//                 tab === "upcoming"
//                   ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
//                   : "text-gray-500 dark:text-gray-400"
//               }`}
//             >
//               Upcoming
//             </TabsTrigger>
//             <TabsTrigger
//               value="completed"
//               className={`pb-3 text-lg font-semibold transition-all rounded-none ${
//                 tab === "completed"
//                   ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
//                   : "text-gray-500 dark:text-gray-400"
//               }`}
//             >
//               Completed
//             </TabsTrigger>
//           </TabsList>
//           <TabsContent value={tab}>
//             <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Date
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger className="flex items-center gap-1">
//                           Mentor Name
//                           <ChevronDown className="h-4 w-4" />
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent className="bg-white dark:bg-gray-800">
//                           <DropdownMenuItem
//                             onClick={() => handleMentorFilter("")}
//                             className="text-gray-700 dark:text-gray-200"
//                           >
//                             All
//                           </DropdownMenuItem>
//                           {uniqueMentors.map((mentor) => (
//                             <DropdownMenuItem
//                               key={mentor}
//                               onClick={() => handleMentorFilter(mentor)}
//                               className="text-gray-700 dark:text-gray-200"
//                             >
//                               {mentor}
//                             </DropdownMenuItem>
//                           ))}
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger className="flex items-center gap-1">
//                           Mentee Name
//                           <ChevronDown className="h-4 w-4" />
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent className="bg-white dark:bg-gray-800">
//                           <DropdownMenuItem
//                             onClick={() => handleMenteeFilter("")}
//                             className="text-gray-700 dark:text-gray-200"
//                           >
//                             All
//                           </DropdownMenuItem>
//                           {uniqueMentees.map((mentee) => (
//                             <DropdownMenuItem
//                               key={mentee}
//                               onClick={() => handleMenteeFilter(mentee)}
//                               className="text-gray-700 dark:text-gray-200"
//                             >
//                               {mentee}
//                             </DropdownMenuItem>
//                           ))}
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger className="flex items-center gap-1">
//                           Service Type
//                           <ChevronDown className="h-4 w-4" />
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent className="bg-white dark:bg-gray-800">
//                           <DropdownMenuItem
//                             onClick={() => handleTypeFilter("All")}
//                             className="text-gray-700 dark:text-gray-200"
//                           >
//                             All
//                           </DropdownMenuItem>
//                           {uniqueTypes.map((option) => (
//                             <DropdownMenuItem
//                               key={option}
//                               onClick={() => handleTypeFilter(option)}
//                               className="text-gray-700 dark:text-gray-200"
//                             >
//                               {mapTypeToDisplay(option)}
//                             </DropdownMenuItem>
//                           ))}
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Service Name
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Time Slot
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger className="flex items-center gap-1">
//                           Booking Status
//                           <ChevronDown className="h-4 w-4" />
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent className="bg-white dark:bg-gray-800">
//                           {statusOptions.map((option) => (
//                             <DropdownMenuItem
//                               key={option}
//                               onClick={() => handleStatusFilter(option)}
//                               className="text-gray-700 dark:text-gray-200"
//                             >
//                               {option}
//                             </DropdownMenuItem>
//                           ))}
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {loading ? (
//                     <TableRow>
//                       <TableCell colSpan={7}>
//                         <TableSkeleton />
//                       </TableCell>
//                     </TableRow>
//                   ) : filteredBookings.length === 0 ? (
//                     renderEmptyState(tab)
//                   ) : (
//                     filteredBookings.map((booking, index) => (
//                       <TableRow
//                         key={index}
//                         className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//                       >
//                         <TableCell className="text-gray-700 dark:text-gray-200 py-3">
//                           {booking.date}
//                         </TableCell>
//                         <TableCell className="text-gray-700 dark:text-gray-200 py-3">
//                           {booking.mentorName}
//                         </TableCell>
//                         <TableCell className="text-gray-700 dark:text-gray-200 py-3">
//                           {booking.menteeName}
//                         </TableCell>
//                         <TableCell className="text-gray-700 dark:text-gray-200 py-3">
//                           {mapTypeToDisplay(booking.type)}
//                         </TableCell>
//                         <TableCell className="text-gray-700 dark:text-gray-200 py-3">
//                           {booking.service}
//                         </TableCell>
//                         <TableCell className="text-gray-700 dark:text-gray-200 py-3">
//                           {booking.timeSlot}
//                         </TableCell>
//                         <TableCell className="text-gray-700 dark:text-gray-200 py-3 flex items-center gap-2">
//                           {booking.bookingStatus === "confirmed" && (
//                             <Check className="h-4 w-4 text-green-500" />
//                           )}
//                           {booking.bookingStatus}
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           </TabsContent>
//         </Tabs>

//         {totalPages > 0 && (
//           <div className="flex justify-between items-center mt-6">
//             <Button
//               onClick={handlePrevPage}
//               disabled={page === 1}
//               className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-6"
//             >
//               Previous
//             </Button>
//             <div className="flex gap-2">
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//                 <Button
//                   key={p}
//                   onClick={() => setPage(p)}
//                   variant={page === p ? "default" : "outline"}
//                   className={`${
//                     page === p
//                       ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
//                       : "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
//                   } border-gray-300 dark:border-gray-600 rounded-full w-10 h-10`}
//                 >
//                   {p}
//                 </Button>
//               ))}
//             </div>
//             <Button
//               onClick={handleNextPage}
//               disabled={page === totalPages}
//               className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-6"
//             >
//               Next
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BookingsPage;
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, CalendarX, Check } from "lucide-react";
import { getAllBookings } from "@/services/adminService";
import { setLoading, setError } from "@/redux/slices/adminSlice";
import TableSkeleton from "@/components/loadingPage/TabelSkeleton";

interface Booking {
  date: string;
  mentorName: string;
  menteeName: string;
  service: string;
  type: string;
  timeSlot: string;
  paymentStatus: string;
  bookingStatus: string;
}

interface RootState {
  admin: {
    loading: boolean;
    error: object;
  };
}

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [mentorFilter, setMentorFilter] = useState("");
  const [menteeFilter, setMenteeFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("confirmed");
  const [tab, setTab] = useState("confirmed");
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.admin.loading);
  const error = useSelector((state: RootState) => state.admin.error);

  const statusOptions = [
    "confirmed",
    "rescheduled",
    "pending",
    "completed",
    "cancelled",
  ];

  const mapTypeToDisplay = (type: string): string => {
    switch (type?.toLowerCase()) {
      case "1-1call":
      case "1:1 call":
        return "1:1 Call";
      case "prioritydm":
      case "priority dm":
        return "Priority DM";
      case "digitalproducts":
      case "digital product":
        return "Digital Product";
      default:
        return type || "Unknown";
    }
  };

  const fetchBookings = async () => {
    dispatch(setLoading(true));
    dispatch(setError({}));
    try {
      const response = await getAllBookings(
        page,
        limit,
        searchQuery,
        "", // No type filter for backend
        statusFilter
      );

      if (response?.data?.data) {
        const { data, total } = response.data;
        const formattedBookings = data.map((booking: any) => ({
          date: new Date(booking.bookingDate).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          mentorName:
            `${booking.mentorId?.firstName || ""} ${
              booking.mentorId?.lastName || ""
            }`.trim() || "Unknown",
          menteeName:
            `${booking.menteeId?.firstName || ""} ${
              booking.menteeId?.lastName || ""
            }`.trim() || "Unknown",
          type: booking.serviceId?.type || "Unknown",
          service: booking.serviceId?.title || "Unknown",
          timeSlot: `${booking.startTime}`,
          paymentStatus: booking.paymentDetails?.status || "Unknown",
          bookingStatus: booking.status || "Unknown",
        }));
        setBookings(formattedBookings);
        setTotal(total);
        const pending = data.filter((b: any) => b.status === "pending").length;
        const completed = data.filter(
          (b: any) => b.status === "completed"
        ).length;
        setStats({ total, pending, completed });
      } else {
        dispatch(
          setError({
            message: response?.data?.error || "Failed to fetch bookings.",
          })
        );
        setBookings([]);
        setTotal(0);
        setStats({ total: 0, pending: 0, completed: 0 });
      }
    } catch (error: any) {
      dispatch(
        setError({
          message:
            error.response?.data?.error ||
            error.message ||
            "An error occurred while fetching bookings.",
        })
      );
      setBookings([]);
      setTotal(0);
      setStats({ total: 0, pending: 0, completed: 0 });
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, searchQuery, mentorFilter, menteeFilter, statusFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleTabChange = (value: string) => {
    setTab(value);
    setStatusFilter(value);
    setPage(1);
  };

  const handleMentorFilter = (value: string) => {
    setMentorFilter(value);
    setPage(1);
  };

  const handleMenteeFilter = (value: string) => {
    setMenteeFilter(value);
    setPage(1);
  };

  const handleTypeFilter = (value: string) => {
    setTypeFilter(value);
    setPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setTab(value);
    setPage(1);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const totalPages = Math.ceil(total / limit);

  const filteredBookings = bookings.filter((booking) => {
    const matchesMentor = mentorFilter
      ? booking.mentorName.toLowerCase().includes(mentorFilter.toLowerCase())
      : true;
    const matchesMentee = menteeFilter
      ? booking.menteeName.toLowerCase().includes(menteeFilter.toLowerCase())
      : true;
    const matchesType =
      typeFilter && typeFilter !== "All" ? booking.type === typeFilter : true;
    return matchesMentor && matchesMentee && matchesType;
  });

  const uniqueMentors = Array.from(
    new Set(bookings.map((b) => b.mentorName))
  ).sort();
  const uniqueMentees = Array.from(
    new Set(bookings.map((b) => b.menteeName))
  ).sort();
  const uniqueTypes = Array.from(new Set(bookings.map((b) => b.type))).sort();

  const renderEmptyState = (tab: string) => (
    <TableRow>
      <TableCell colSpan={7} className="text-center py-12">
        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <CalendarX className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4 animate-bounce" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            No {tab.charAt(0).toUpperCase() + tab.slice(1)} Bookings Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md text-center">
            {tab === "confirmed"
              ? "There are no confirmed bookings at the moment."
              : tab === "rescheduled"
              ? "No bookings have been rescheduled yet."
              : tab === "pending"
              ? "There are no pending bookings waiting for confirmation."
              : tab === "completed"
              ? "No bookings have been completed yet."
              : "No bookings have been cancelled."}
          </p>
          {tab !== "completed" && tab !== "cancelled" && (
            <Button className="mt-4 bg-green-500 hover:bg-green-600 text-white">
              New Booking
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );

  const renderErrorState = () => (
    <TableRow>
      <TableCell colSpan={7} className="text-center py-12">
        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <svg
            className="h-16 w-16 text-red-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Something went wrong
          </h2>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
          >
            Try Again
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="flex min-h-screen">
      <div className="p-6 mx-32 w-full bg-white dark:bg-gray-900">
        <div className="flex flex-row mb-6">
          <div>
            <h1 className="text-2xl font-bold pt-4 text-gray-800 dark:text-gray-100">
              Bookings
            </h1>
          </div>
        </div>

        <div className="flex justify-between items-center gap-6 mb-8 border-b border-gray-200 dark:border-gray-700 pb-2">
          <div className="flex grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-2 h-20 w-36 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-0">
                Total Bookings
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stats.total}
              </p>
            </Card>
            <Card className="p-2 h-20 w-36 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-0">
                Pending
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stats.pending}
              </p>
            </Card>
            <Card className="p-2 h-20 w-36 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-0">
                Completed
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stats.completed}
              </p>
            </Card>
          </div>
          <div>
            <Input
              placeholder="Search by mentor or mentee..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-64 rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 pr-4"
            />
          </div>
        </div>

        <Tabs value={tab} onValueChange={handleTabChange} className="mb-8">
          <TabsList className="w-full flex justify-start gap-8 border-b border-gray-200 dark:border-gray-700 bg-transparent">
            {statusOptions.map((status) => (
              <TabsTrigger
                key={status}
                value={status}
                className={`pb-3 text-lg font-semibold transition-all rounded-none ${
                  tab === status
                    ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={tab}>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Date
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1">
                          Mentor Name
                          <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white dark:bg-gray-800">
                          <DropdownMenuItem
                            onClick={() => handleMentorFilter("")}
                            className="text-gray-700 dark:text-gray-200"
                          >
                            All
                          </DropdownMenuItem>
                          {uniqueMentors.map((mentor) => (
                            <DropdownMenuItem
                              key={mentor}
                              onClick={() => handleMentorFilter(mentor)}
                              className="text-gray-700 dark:text-gray-200"
                            >
                              {mentor}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1">
                          Mentee Name
                          <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white dark:bg-gray-800">
                          <DropdownMenuItem
                            onClick={() => handleMenteeFilter("")}
                            className="text-gray-700 dark:text-gray-200"
                          >
                            All
                          </DropdownMenuItem>
                          {uniqueMentees.map((mentee) => (
                            <DropdownMenuItem
                              key={mentee}
                              onClick={() => handleMenteeFilter(mentee)}
                              className="text-gray-700 dark:text-gray-200"
                            >
                              {mentee}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1">
                          Service Type
                          <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white dark:bg-gray-800">
                          <DropdownMenuItem
                            onClick={() => handleTypeFilter("All")}
                            className="text-gray-700 dark:text-gray-200"
                          >
                            All
                          </DropdownMenuItem>
                          {uniqueTypes.map((option) => (
                            <DropdownMenuItem
                              key={option}
                              onClick={() => handleTypeFilter(option)}
                              className="text-gray-700 dark:text-gray-200"
                            >
                              {mapTypeToDisplay(option)}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Service Name
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Time Slot
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1">
                          Booking Status
                          <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white dark:bg-gray-800">
                          {statusOptions.map((option) => (
                            <DropdownMenuItem
                              key={option}
                              onClick={() => handleStatusFilter(option)}
                              className="text-gray-700 dark:text-gray-200"
                            >
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <TableSkeleton />
                      </TableCell>
                    </TableRow>
                  ) : filteredBookings.length === 0 ? (
                    renderEmptyState(tab)
                  ) : (
                    filteredBookings.map((booking, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <TableCell className="text-gray-700 dark:text-gray-200 py-3">
                          {booking.date}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-200 py-3">
                          {booking.mentorName}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-200 py-3">
                          {booking.menteeName}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-200 py-3">
                          {mapTypeToDisplay(booking.type)}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-200 py-3">
                          {booking.service}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-200 py-3">
                          {booking.timeSlot}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-200 py-3 flex items-center gap-2">
                          {booking.bookingStatus === "confirmed" && (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                          {booking.bookingStatus.charAt(0).toUpperCase() +
                            booking.bookingStatus.slice(1)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {totalPages > 0 && (
          <div className="flex justify-between items-center mt-6">
            <Button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-6"
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
                  } border-gray-300 dark:border-gray-600 rounded-full w-10 h-10`}
                >
                  {p}
                </Button>
              ))}
            </div>
            <Button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-6"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
