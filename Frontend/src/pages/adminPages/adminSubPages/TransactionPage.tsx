// import { useState, useEffect } from "react";
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
// import { getAllPayments, transferToMentor } from "@/services/adminService";

// interface Payment {
//   date: string;
//   transactionId: string;
//   mentorName: string;
//   menteeName: string;
//   service: string;
//   amount: string;
//   status: string;
//   paymentId: string;
//   mentorId: string;
//   bookingId: string;
// }

// export default function PaymentsPage() {
//   const [payments, setPayments] = useState<Payment[]>([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [mentorFilter, setMentorFilter] = useState("");
//   const [menteeFilter, setMenteeFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [tab, setTab] = useState("booked");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [stats, setStats] = useState({
//     total: 0,
//     booked: 0,
//     pending: 0,
//     completed: 0,
//   });

//   const statusOptions = ["All", "pending", "completed", "failed", "refunded"];

//   const fetchPayments = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       console.log("Fetching payments with params:", {
//         page,
//         limit,
//         searchQuery,
//         statusFilter,
//       });
//       const response = await getAllPayments(
//         page,
//         limit,
//         searchQuery,
//         statusFilter
//       );
//       console.log("Backend response:", response);

//       if (response?.data?.data) {
//         const { data, total } = response.data;
//         console.log("Payments data:", data, "Total:", total);
//         const formattedPayments = data.map((payment: any) => ({
//           paymentId: payment._id,
//           date: new Date(payment.createdAt).toLocaleString("en-US", {
//             day: "2-digit",
//             month: "2-digit",
//             year: "numeric",
//             hour: "2-digit",
//             minute: "2-digit",
//           }),
//           transactionId: payment.transactionId
//             ? payment.transactionId.slice(-10)
//             : "N/A",
//           mentorName:
//             `${payment.mentorDetails?.firstName || ""} ${
//               payment.mentorDetails?.lastName || ""
//             }`.trim() || "Unknown",
//           menteeName:
//             `${payment.menteeId?.firstName || ""} ${
//               payment.menteeId?.lastName || ""
//             }`.trim() || "Unknown",
//           service: payment.serviceDetails?.title || "Unknown",
//           amount: `₹ ${payment.amount || 0}`,
//           status: payment.status || "Unknown",
//           mentorId: payment.mentorDetails?._id || "",
//           bookingId: payment.bookingId || "",
//         }));
//         setPayments(formattedPayments);
//         setTotal(total);
//         const booked = data.filter((p: any) => p.status === "completed").length;
//         const pending = data.filter((p: any) => p.status === "pending").length;
//         const completed = data.filter(
//           (p: any) => p.status === "transferred"
//         ).length;
//         setStats({ total, booked, pending, completed });
//       } else {
//         console.log("No success in response:", response?.data);
//         setError(response?.data?.error || "Failed to fetch payments.");
//         setPayments([]);
//         setTotal(0);
//         setStats({ total: 0, booked: 0, pending: 0, completed: 0 });
//       }
//     } catch (error: any) {
//       console.error("Error fetching payments:", error);
//       setError(
//         error.response?.data?.error ||
//           error.message ||
//           "An error occurred while fetching payments."
//       );
//       setPayments([]);
//       setTotal(0);
//       setStats({ total: 0, booked: 0, pending: 0, completed: 0 });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePayToMentor = async (
//     paymentId: string,
//     mentorId: string,
//     amount: string
//   ) => {
//     try {
//       const cleanAmount = parseFloat(amount.replace("₹ ", ""));
//       const response = await transferToMentor(paymentId, mentorId, cleanAmount);
//       if (response?.data?.success) {
//         fetchPayments(); // Refresh payments after transfer
//       } else {
//         setError("Failed to initiate payment to mentor.");
//       }
//     } catch (error: any) {
//       console.error("Error transferring to mentor:", error);
//       setError(error.response?.data?.error || "Failed to transfer payment.");
//     }
//   };

//   useEffect(() => {
//     fetchPayments();
//   }, [page, searchQuery, mentorFilter, menteeFilter, statusFilter]);

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//     setPage(1);
//   };

//   const handleTabChange = (value: string) => {
//     setTab(value);
//     if (value === "booked") {
//       setStatusFilter("completed");
//     } else if (value === "pending") {
//       setStatusFilter("pending");
//     } else if (value === "completed") {
//       setStatusFilter("transferred");
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

//   const filteredPayments = payments.filter((payment) => {
//     const matchesMentor = mentorFilter
//       ? payment.mentorName.toLowerCase().includes(mentorFilter.toLowerCase())
//       : true;
//     const matchesMentee = menteeFilter
//       ? payment.menteeName.toLowerCase().includes(menteeFilter.toLowerCase())
//       : true;
//     return matchesMentor && matchesMentee;
//   });

//   const uniqueMentors = Array.from(
//     new Set(payments.map((p) => p.mentorName))
//   ).sort();
//   const uniqueMentees = Array.from(
//     new Set(payments.map((p) => p.menteeName))
//   ).sort();

//   const renderNoPayments = (tab: string) => (
//     <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
//       <CalendarX className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
//       <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
//         No {tab} Payments
//       </h2>
//       <p className="text-gray-500 dark:text-gray-400 mt-2">
//         {tab === "booked"
//           ? "There are no booked payments."
//           : tab === "pending"
//           ? "There are no pending payments to mentors."
//           : "There are no completed payments to mentors."}
//       </p>
//       <Button className="mt-4 bg-green-500 hover:bg-green-600 text-white ">
//         Create New Payments
//       </Button>
//     </div>
//   );

//   return (
//     <div className="flex min-h-screen">
//       <div className="p-6 mx-32 w-full bg-white dark:bg-gray-900">
//         <div className="flex flex-row mb-6">
//           <div>
//             <h1 className="text-2xl font-bold pt-4 text-gray-800 dark:text-gray-100">
//               Payments
//             </h1>
//           </div>
//         </div>

//         {error && <div className="text-red-500 mb-4">{error}</div>}

//         <div className="flex justify-between items-center gap-6 mb-8 border-b border-gray-200 dark:border-gray-700 pb-2">
//           <div className="flex grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-6">
//             <Card className="p-2 h-20 w-36 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
//               <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-0">
//                 Total Payments
//               </h3>
//               <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//                 {stats.total}
//               </p>
//             </Card>
//             <Card className="p-2 h-20 w-36 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
//               <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-0">
//                 Booked
//               </h3>
//               <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//                 {stats.booked}
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
//               value="booked"
//               className={`pb-3 text-lg font-semibold transition-all rounded-none ${
//                 tab === "booked"
//                   ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
//                   : "text-gray-500 dark:text-gray-400"
//               }`}
//             >
//               Booked
//             </TabsTrigger>
//             <TabsTrigger
//               value="pending"
//               className={`pb-3 text-lg font-semibold transition-all rounded-none ${
//                 tab === "pending"
//                   ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
//                   : "text-gray-500 dark:text-gray-400"
//               }`}
//             >
//               Pending
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
//                       Transaction ID
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
//                           >
//                             All
//                           </DropdownMenuItem>
//                           {uniqueMentors.map((mentor) => (
//                             <DropdownMenuItem
//                               key={mentor}
//                               onClick={() => handleMentorFilter(mentor)}
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
//                           >
//                             All
//                           </DropdownMenuItem>
//                           {uniqueMentees.map((mentee) => (
//                             <DropdownMenuItem
//                               key={mentee}
//                               onClick={() => handleMenteeFilter(mentee)}
//                             >
//                               {mentee}
//                             </DropdownMenuItem>
//                           ))}
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Service
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Amount
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger className="flex items-center gap-1">
//                           Status
//                           <ChevronDown className="h-4 w-4" />
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent className="bg-white dark:bg-gray-800">
//                           {statusOptions.map((option) => (
//                             <DropdownMenuItem
//                               key={option}
//                               onClick={() => handleStatusFilter(option)}
//                             >
//                               {option}
//                             </DropdownMenuItem>
//                           ))}
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableHead>
//                     {tab === "pending" && (
//                       <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                         Action
//                       </TableHead>
//                     )}
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {loading ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={tab === "pending" ? 8 : 7}
//                         className="text-center text-gray-600 dark:text-gray-300 py-4"
//                       >
//                         Loading...
//                       </TableCell>
//                     </TableRow>
//                   ) : filteredPayments.length === 0 ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={tab === "pending" ? 8 : 7}
//                         className="text-center text-gray-600 dark:text-gray-300 py-4"
//                       >
//                         {renderNoPayments(tab)}
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     filteredPayments.map((payment, index) => (
//                       <TableRow
//                         key={index}
//                         className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//                       >
//                         <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                           {payment.date}
//                         </TableCell>
//                         <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                           {payment.transactionId}
//                         </TableCell>
//                         <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                           {payment.mentorName}
//                         </TableCell>
//                         <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                           {payment.menteeName}
//                         </TableCell>
//                         <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                           {payment.service}
//                         </TableCell>
//                         <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                           {payment.amount}
//                         </TableCell>
//                         <TableCell className="text-gray-700 dark:text-gray-300 py-3 flex items-center gap-2">
//                           {payment.status === "completed" && (
//                             <Check className="h-4 w-4 text-green-500" />
//                           )}
//                           {payment.status}
//                         </TableCell>
//                         {tab === "pending" && (
//                           <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                             <Button
//                               onClick={() =>
//                                 handlePayToMentor(
//                                   payment.paymentId,
//                                   payment.mentorId,
//                                   payment.amount
//                                 )
//                               }
//                               className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-4"
//                             >
//                               Pay
//                             </Button>
//                           </TableCell>
//                         )}
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           </TabsContent>
//         </Tabs>

//         {totalPages > 1 && (
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
// }

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
import { getAllPayments, transferToMentor } from "@/services/adminService";
import { setLoading, setError } from "@/redux/slices/adminSlice";
import TableSkeleton from "@/components/loadingPage/TabelSkeleton";

interface Payment {
  date: string;
  transactionId: string;
  mentorName: string;
  menteeName: string;
  service: string;
  amount: string;
  status: string;
  paymentId: string;
  mentorId: string;
  bookingId: string;
}

interface RootState {
  admin: {
    loading: boolean;
    error: object;
  };
}

const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [mentorFilter, setMentorFilter] = useState("");
  const [menteeFilter, setMenteeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [tab, setTab] = useState("booked");
  const [stats, setStats] = useState({
    total: 0,
    booked: 0,
    pending: 0,
    completed: 0,
  });
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.admin.loading);
  const error = useSelector((state: RootState) => state.admin.error);

  const statusOptions = ["All", "pending", "completed", "failed", "refunded"];

  const fetchPayments = async () => {
    dispatch(setLoading(true));
    dispatch(setError({}));
    try {
      const response = await getAllPayments(
        page,
        limit,
        searchQuery,
        statusFilter
      );

      if (response?.data?.data) {
        const { data, total } = response.data;
        const formattedPayments = data.map((payment: any) => ({
          paymentId: payment._id,
          date: new Date(payment.createdAt).toLocaleString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          transactionId: payment.transactionId
            ? payment.transactionId.slice(-10)
            : "N/A",
          mentorName:
            `${payment.mentorDetails?.firstName || ""} ${
              payment.mentorDetails?.lastName || ""
            }`.trim() || "Unknown",
          menteeName:
            `${payment.menteeId?.firstName || ""} ${
              payment.menteeId?.lastName || ""
            }`.trim() || "Unknown",
          service: payment.serviceDetails?.title || "Unknown",
          amount: `₹ ${payment.amount || 0}`,
          status: payment.status || "Unknown",
          mentorId: payment.mentorDetails?._id || "",
          bookingId: payment.bookingId || "",
        }));
        setPayments(formattedPayments);
        setTotal(total);
        const booked = data.filter((p: any) => p.status === "completed").length;
        const pending = data.filter((p: any) => p.status === "pending").length;
        const completed = data.filter(
          (p: any) => p.status === "transferred"
        ).length;
        setStats({ total, booked, pending, completed });
      } else {
        dispatch(
          setError({
            message: response?.data?.error || "Failed to fetch payments.",
          })
        );
        setPayments([]);
        setTotal(0);
        setStats({ total: 0, booked: 0, pending: 0, completed: 0 });
      }
    } catch (error: any) {
      dispatch(
        setError({
          message:
            error.response?.data?.error ||
            error.message ||
            "An error occurred while fetching payments.",
        })
      );
      setPayments([]);
      setTotal(0);
      setStats({ total: 0, booked: 0, pending: 0, completed: 0 });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handlePayToMentor = async (
    paymentId: string,
    mentorId: string,
    amount: string
  ) => {
    dispatch(setLoading(true));
    dispatch(setError({}));
    try {
      const cleanAmount = parseFloat(amount.replace("₹ ", ""));
      const response = await transferToMentor(paymentId, mentorId, cleanAmount);
      if (response?.data?.success) {
        fetchPayments(); // Refresh payments after transfer
      } else {
        dispatch(
          setError({ message: "Failed to initiate payment to mentor." })
        );
      }
    } catch (error: any) {
      dispatch(
        setError({
          message: error.response?.data?.error || "Failed to transfer payment.",
        })
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page, searchQuery, mentorFilter, menteeFilter, statusFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleTabChange = (value: string) => {
    setTab(value);
    if (value === "booked") {
      setStatusFilter("completed");
    } else if (value === "pending") {
      setStatusFilter("pending");
    } else if (value === "completed") {
      setStatusFilter("transferred");
    } else {
      setStatusFilter("All");
    }
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

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
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

  const filteredPayments = payments.filter((payment) => {
    const matchesMentor = mentorFilter
      ? payment.mentorName.toLowerCase().includes(mentorFilter.toLowerCase())
      : true;
    const matchesMentee = menteeFilter
      ? payment.menteeName.toLowerCase().includes(menteeFilter.toLowerCase())
      : true;
    return matchesMentor && matchesMentee;
  });

  const uniqueMentors = Array.from(
    new Set(payments.map((p) => p.mentorName))
  ).sort();
  const uniqueMentees = Array.from(
    new Set(payments.map((p) => p.menteeName))
  ).sort();

  const renderEmptyState = (tab: string) => (
    <TableRow>
      <TableCell
        colSpan={tab === "pending" ? 8 : 7}
        className="text-center py-12"
      >
        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <CalendarX className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4 animate-bounce" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            No{" "}
            {tab === "booked"
              ? "Booked Payments"
              : tab === "pending"
              ? "Pending Payments"
              : "Completed Payments"}{" "}
            Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md text-center">
            {tab === "booked"
              ? "There are no booked payments yet. Encourage bookings to start processing payments!"
              : tab === "pending"
              ? "There are no payments pending transfer to mentors."
              : "No payments have been completed to mentors yet."}
          </p>
          {(tab === "booked" || tab === "pending" || tab === "completed") && (
            <Button className="mt-4 bg-green-500 hover:bg-green-600 text-white ">
              No New Payments
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );

  const renderErrorState = () => (
    <TableRow>
      <TableCell
        colSpan={tab === "pending" ? 8 : 7}
        className="text-center py-12"
      >
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
          <p className="text-red-500 dark:text-red-400 mt-2">
            {error?.message || "An error occurred."}
          </p>
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
              Payments
            </h1>
          </div>
        </div>

        <div className="flex justify-between items-center gap-6 mb-8 border-b border-gray-200 dark:border-gray-700 pb-2">
          <div className="flex grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="p-2 h-20 w-36 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-0">
                Total Payments
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stats.total}
              </p>
            </Card>
            <Card className="p-2 h-20 w-36 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-0">
                Booked
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stats.booked}
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
            <TabsTrigger
              value="booked"
              className={`pb-3 text-lg font-semibold transition-all rounded-none ${
                tab === "booked"
                  ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Booked
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className={`pb-3 text-lg font-semibold transition-all rounded-none ${
                tab === "pending"
                  ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Pending
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className={`pb-3 text-lg font-semibold transition-all rounded-none ${
                tab === "completed"
                  ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Completed
            </TabsTrigger>
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
                      Transaction ID
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
                      Service
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Amount
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1">
                          Status
                          <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white dark:bg-gray-800">
                          {statusOptions.map((option) => (
                            <DropdownMenuItem
                              key={option}
                              onClick={() => handleStatusFilter(option)}
                              className="text-gray-700 dark:text-gray-200"
                            >
                              {option}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>
                    {tab === "pending" && (
                      <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                        Action
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={tab === "pending" ? 8 : 7}>
                        <TableSkeleton />
                      </TableCell>
                    </TableRow>
                  ) : error.message ? (
                    renderErrorState()
                  ) : filteredPayments.length === 0 ? (
                    renderEmptyState(tab)
                  ) : (
                    filteredPayments.map((payment, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <TableCell className="text-gray-700 dark:text-gray-200 py-3">
                          {payment.date}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-200 py-3">
                          {payment.transactionId}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-200 py-3">
                          {payment.mentorName}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-200 py-3">
                          {payment.menteeName}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-200 py-3">
                          {payment.service}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-200 py-3">
                          {payment.amount}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-200 py-3 flex items-center gap-2">
                          {payment.status === "completed" && (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                          {payment.status}
                        </TableCell>
                        {tab === "pending" && (
                          <TableCell className="text-gray-700 dark:text-gray-200 py-3">
                            <Button
                              onClick={() =>
                                handlePayToMentor(
                                  payment.paymentId,
                                  payment.mentorId,
                                  payment.amount
                                )
                              }
                              className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-4"
                            >
                              Pay
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {totalPages > 1 && (
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

export default PaymentsPage;
