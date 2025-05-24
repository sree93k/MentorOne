// import { useState } from "react";
// import { Card } from "@/components/ui/card";
// import FilterHeader from "./FilterHeader";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";

// interface BookedTransaction {
//   date: string;
//   invoiceId: string;
//   transactionId: string;
//   soldBy: string;
//   buyer: string;
//   mode: string;
//   amount: string;
// }

// interface PendingTransaction {
//   date: string;
//   invoiceId: string;
//   transactionId: string;
//   soldBy: string;
//   buyer: string;
//   transferOn: string;
//   amount: string;
// }

// interface CompletedTransaction {
//   completedDate: string;
//   invoiceId: string;
//   soldBy: string;
//   buyer: string;
//   totalAmount: string;
//   toMentor: string;
//   profit: string;
// }

// export default function TransactionsPage() {
//   const [activeTab, setActiveTab] = useState("booked");

//   const bookedTransactions: BookedTransaction[] = [
//     {
//       date: "12/03/2025, 12:39 PM",
//       invoiceId: "MO73883",
//       transactionId: "xzykom343882723",
//       soldBy: "Akshay",
//       buyer: "Afsal",
//       mode: "Credit card",
//       amount: "₹ 3200",
//     },
//     {
//       date: "12/03/2025, 12:39 PM",
//       invoiceId: "MO73854",
//       transactionId: "xzykom343882723",
//       soldBy: "Akshay",
//       buyer: "Harsh",
//       mode: "UPI",
//       amount: "₹ 340",
//     },
//     {
//       date: "12/03/2025, 12:39 PM",
//       invoiceId: "MO73844",
//       transactionId: "xzykom343882723",
//       soldBy: "Akshay",
//       buyer: "Siva",
//       mode: "Debit Card",
//       amount: "₹355",
//     },
//   ];

//   const pendingTransactions: PendingTransaction[] = [
//     {
//       date: "12/03/2025, 12:39 PM",
//       invoiceId: "MO73883",
//       transactionId: "xzykom343882723",
//       soldBy: "Akshay",
//       buyer: "Afsal",
//       transferOn: "12/03/2025, 12:39 PM",
//       amount: "₹ 3000",
//     },
//     {
//       date: "12/03/2025, 12:39 PM",
//       invoiceId: "MO73854",
//       transactionId: "xzykom343882723",
//       soldBy: "Akshay",
//       buyer: "Harsh",
//       transferOn: "12/03/2025, 12:39 PM",
//       amount: "₹ 300",
//     },
//     {
//       date: "12/03/2025, 12:39 PM",
//       invoiceId: "MO73844",
//       transactionId: "xzykom343882723",
//       soldBy: "Akshay",
//       buyer: "Siva",
//       transferOn: "12/03/2025, 12:39 PM",
//       amount: "₹300",
//     },
//   ];

//   const completedTransactions: CompletedTransaction[] = [
//     {
//       completedDate: "12/03/2025, 12:39 PM",
//       invoiceId: "MO73883",
//       soldBy: "Akshay",
//       buyer: "Afsal",
//       totalAmount: "₹ 3200",
//       toMentor: "₹ 3000",
//       profit: "₹ 200",
//     },
//     {
//       completedDate: "12/03/2025, 12:39 PM",
//       invoiceId: "MO73854",
//       soldBy: "Akshay",
//       buyer: "Harsh",
//       totalAmount: "₹ 340",
//       toMentor: "₹ 300",
//       profit: "₹ 40",
//     },
//     {
//       completedDate: "12/03/2025, 12:39 PM",
//       invoiceId: "MO73844",
//       soldBy: "Akshay",
//       buyer: "Siva",
//       totalAmount: "₹355",
//       toMentor: "₹300",
//       profit: "₹55",
//     },
//   ];

//   const soldByOptions = ["All", "Akshay", "Sreekuttan", "Anila"];
//   const buyerOptions = ["All", "Afsal", "Harsh", "Siva"];
//   const modeOptions = ["All", "Credit card", "UPI", "Debit Card"];

//   return (
//     <div className="flex flex-col mx-32 min-h-screen bg-white py-6 px-6">
//       <div className="flex flex-row mb-6">
//         <h1 className="text-2xl font-bold pt-4 mb-6">Transactions</h1>
//         <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mb-0 ml-auto">
//           {/* Static stats - replace with dynamic data if needed */}
//           <Card className="p-2 h-20 w-60">
//             <h3 className="text-sm text-gray-600 mb-0">Total Bookings</h3>
//             <p className="text-3xl font-bold">22</p>
//           </Card>
//           <Card className="p-2 h-20">
//             <h3 className="text-sm text-gray-600 mb-0">Pending</h3>
//             <p className="text-3xl font-bold">11</p>
//           </Card>
//           <Card className="p-2 h-20">
//             <h3 className="text-sm text-gray-600 mb-0">Completed</h3>
//             <p className="text-3xl font-bold">11</p>
//           </Card>
//         </div>
//       </div>
//       <Tabs
//         defaultValue="booked"
//         className="flex flex-col "
//         onValueChange={setActiveTab}
//       >
//         <TabsList className="flex w-full justify-start bg-transparent p-0 mb-4 border-b ">
//           <TabsTrigger
//             value="booked"
//             className={`px-4 py-2 rounded-none border-b-2 ${
//               activeTab === "booked"
//                 ? "border-black font-semibold"
//                 : "border-transparent"
//             }`}
//           >
//             Booked
//           </TabsTrigger>
//           <TabsTrigger
//             value="pending"
//             className={`px-4 py-2 rounded-none border-b-2 ${
//               activeTab === "pending"
//                 ? "border-black font-semibold"
//                 : "border-transparent"
//             }`}
//           >
//             Pending
//           </TabsTrigger>
//           <TabsTrigger
//             value="completed"
//             className={`px-4 py-2 rounded-none border-b-2 ${
//               activeTab === "completed"
//                 ? "border-black font-semibold"
//                 : "border-transparent"
//             }`}
//           >
//             Completed
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="booked" className="max-w-5xl ">
//           <div className="overflow-x-auto ">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Date</TableHead>

//                   <TableHead>Transaction ID</TableHead>
//                   <TableHead>
//                     <FilterHeader title="Sold By" options={soldByOptions} />
//                   </TableHead>
//                   <TableHead>
//                     <FilterHeader title="Buyer" options={buyerOptions} />
//                   </TableHead>
//                   <TableHead>
//                     <FilterHeader title="Mode" options={modeOptions} />
//                   </TableHead>
//                   <TableHead>Amount</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {bookedTransactions.map((transaction, index) => (
//                   <TableRow key={index}>
//                     <TableCell>{transaction.date}</TableCell>

//                     <TableCell>{transaction.transactionId}</TableCell>
//                     <TableCell>{transaction.soldBy}</TableCell>
//                     <TableCell>{transaction.buyer}</TableCell>
//                     <TableCell>{transaction.mode}</TableCell>
//                     <TableCell>{transaction.amount}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </TabsContent>

//         <TabsContent value="pending" className="max-w-5xl">
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Date</TableHead>

//                   <TableHead>Transaction ID</TableHead>
//                   <TableHead>
//                     <FilterHeader title="Sold By" options={soldByOptions} />
//                   </TableHead>
//                   <TableHead>
//                     <FilterHeader title="Buyer" options={buyerOptions} />
//                   </TableHead>
//                   <TableHead>Transfer On</TableHead>
//                   <TableHead>Amount</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {pendingTransactions.map((transaction, index) => (
//                   <TableRow key={index}>
//                     <TableCell>{transaction.date}</TableCell>

//                     <TableCell>{transaction.transactionId}</TableCell>
//                     <TableCell>{transaction.soldBy}</TableCell>
//                     <TableCell>{transaction.buyer}</TableCell>
//                     <TableCell>{transaction.transferOn}</TableCell>
//                     <TableCell>{transaction.amount}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </TabsContent>

//         <TabsContent value="completed" className="max-w-5xl">
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Completed Date</TableHead>

//                   <TableHead>
//                     <FilterHeader title="Sold By" options={soldByOptions} />
//                   </TableHead>
//                   <TableHead>
//                     <FilterHeader title="Buyer" options={buyerOptions} />
//                   </TableHead>
//                   <TableHead>Total Amount</TableHead>
//                   <TableHead>To Mentor</TableHead>
//                   <TableHead>Profit</TableHead>
//                   <TableHead>Transfer</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {completedTransactions.map((transaction, index) => (
//                   <TableRow key={index}>
//                     <TableCell>{transaction.completedDate}</TableCell>

//                     <TableCell>{transaction.soldBy}</TableCell>
//                     <TableCell>{transaction.buyer}</TableCell>
//                     <TableCell>{transaction.totalAmount}</TableCell>
//                     <TableCell>{transaction.toMentor}</TableCell>
//                     <TableCell>{transaction.profit}</TableCell>
//                     <TableCell>
//                       <Button className="bg-black text-white text-xs py-1 px-3 h-auto">
//                         Pay
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
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

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [mentorFilter, setMentorFilter] = useState("");
  const [menteeFilter, setMenteeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [tab, setTab] = useState("booked");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    booked: 0,
    pending: 0,
    completed: 0,
  });

  const statusOptions = ["All", "pending", "completed", "failed", "refunded"];

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching payments with params:", {
        page,
        limit,
        searchQuery,
        statusFilter,
      });
      const response = await getAllPayments(
        page,
        limit,
        searchQuery,
        statusFilter
      );
      console.log("Backend response:", response);

      if (response?.data?.data) {
        const { data, total } = response.data;
        console.log("Payments data:", data, "Total:", total);
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
        console.log("No success in response:", response?.data);
        setError(response?.data?.error || "Failed to fetch payments.");
        setPayments([]);
        setTotal(0);
        setStats({ total: 0, booked: 0, pending: 0, completed: 0 });
      }
    } catch (error: any) {
      console.error("Error fetching payments:", error);
      setError(
        error.response?.data?.error ||
          error.message ||
          "An error occurred while fetching payments."
      );
      setPayments([]);
      setTotal(0);
      setStats({ total: 0, booked: 0, pending: 0, completed: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handlePayToMentor = async (
    paymentId: string,
    mentorId: string,
    amount: string
  ) => {
    try {
      const cleanAmount = parseFloat(amount.replace("₹ ", ""));
      const response = await transferToMentor(paymentId, mentorId, cleanAmount);
      if (response?.data?.success) {
        fetchPayments(); // Refresh payments after transfer
      } else {
        setError("Failed to initiate payment to mentor.");
      }
    } catch (error: any) {
      console.error("Error transferring to mentor:", error);
      setError(error.response?.data?.error || "Failed to transfer payment.");
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

  const renderNoPayments = (tab: string) => (
    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <CalendarX className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
        No {tab} Payments
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2">
        {tab === "booked"
          ? "There are no booked payments."
          : tab === "pending"
          ? "There are no pending payments to mentors."
          : "There are no completed payments to mentors."}
      </p>
    </div>
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

        {error && <div className="text-red-500 mb-4">{error}</div>}

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
                          >
                            All
                          </DropdownMenuItem>
                          {uniqueMentors.map((mentor) => (
                            <DropdownMenuItem
                              key={mentor}
                              onClick={() => handleMentorFilter(mentor)}
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
                          >
                            All
                          </DropdownMenuItem>
                          {uniqueMentees.map((mentee) => (
                            <DropdownMenuItem
                              key={mentee}
                              onClick={() => handleMenteeFilter(mentee)}
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
                      <TableCell
                        colSpan={tab === "pending" ? 8 : 7}
                        className="text-center text-gray-600 dark:text-gray-300 py-4"
                      >
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={tab === "pending" ? 8 : 7}
                        className="text-center text-gray-600 dark:text-gray-300 py-4"
                      >
                        {renderNoPayments(tab)}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                          {payment.date}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                          {payment.transactionId}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                          {payment.mentorName}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                          {payment.menteeName}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                          {payment.service}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                          {payment.amount}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300 py-3 flex items-center gap-2">
                          {payment.status === "completed" && (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                          {payment.status}
                        </TableCell>
                        {tab === "pending" && (
                          <TableCell className="text-gray-700 dark:text-gray-300 py-3">
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
}
