// import { useState, useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { CalendarX } from "lucide-react";
// import { getAllMentorPayments } from "@/services/paymentServcie";

// interface PaymentItem {
//   _id: string;
//   bookingId: string;
//   menteeId: {
//     _id: string;
//     firstName: string;
//     lastName: string;
//   };
//   amount: number;
//   total: number;
//   status: string;
//   transactionId: string;
//   createdAt: string;
//   serviceDetails: {
//     _id: string;
//     title: string;
//     type: string;
//   };
//   mentorDetails: {
//     _id: string;
//     firstName: string;
//     lastName: string;
//   };
//   serviceName: string;
//   mentorName: string;
//   paymentMode: string;
//   type?: string; // Added to store formatted type
//   date?: string; // Added to store formatted date
//   menteeName?: string; // Added to store formatted menteeName
//   amountFormatted?: string; // Added to store formatted amount
// }

// export default function MentorPaymentsPage() {
//   const [selectedTab, setSelectedTab] = useState("sold");
//   const [typeFilter, setTypeFilter] = useState("All");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [globalSearch, setGlobalSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const limit = 22;

//   const { user } = useSelector((state: RootState) => state.user);
//   const mentorId = user?._id;

//   const {
//     data: { payments = [], total = 0, totalAmount = 0 } = {},
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["mentorPayments", mentorId, page, statusFilter], // Removed globalSearch from queryKey
//     queryFn: () => getAllMentorPayments(page, limit), // Pass empty searchQuery for client-side filtering
//     enabled: !!mentorId,
//     select: (data) => ({
//       payments: data.payments.map((payment: PaymentItem) => ({
//         ...payment,
//         date: new Date(payment.createdAt).toLocaleDateString("en-US", {
//           day: "2-digit",
//           month: "2-digit",
//           year: "numeric",
//         }),
//         type:
//           payment.serviceDetails.type === "1-1Call"
//             ? "1:1 Call"
//             : payment.serviceDetails.type === "priorityDM"
//             ? "Priority DM"
//             : payment.serviceDetails.type === "DigitalProducts"
//             ? "Digital Product"
//             : "Other",
//         amountFormatted: `₹${payment.total}`,
//         menteeName: `${payment.menteeId.firstName} ${payment.menteeId.lastName}`,
//       })),
//       total: data.total,
//       totalAmount: data.totalAmount,
//     }),
//   });

//   const uniqueTypes = useMemo<string[]>(
//     () => ["All", ...new Set(payments.map((item: PaymentItem) => item.type))],
//     [payments]
//   );
//   const uniqueStatuses = useMemo<string[]>(
//     () => ["All", ...new Set(payments.map((item: PaymentItem) => item.status))],
//     [payments]
//   );

//   const filterPayments = useMemo(() => {
//     return (payments: PaymentItem[], tab: string) => {
//       let filtered = payments;

//       // Apply tab-specific filtering
//       if (tab === "sold") {
//         filtered = filtered.filter((p) => p.status !== "transferred");
//       } else if (tab === "received") {
//         filtered = filtered.filter((p) => p.status === "transferred");
//       }

//       // Apply type filter
//       if (typeFilter !== "All") {
//         filtered = filtered.filter((p) => p.type === typeFilter);
//       }

//       // Apply status filter
//       if (statusFilter !== "All") {
//         filtered = filtered.filter((p) => p.status === statusFilter);
//       }

//       // Apply global search (client-side)
//       if (globalSearch) {
//         const query = globalSearch.toLowerCase();
//         filtered = filtered.filter(
//           (p) =>
//             p.menteeName?.toLowerCase().includes(query) ||
//             p.serviceName.toLowerCase().includes(query)
//         );
//       }

//       return filtered;
//     };
//   }, [typeFilter, statusFilter, globalSearch]);

//   const soldPayments = filterPayments(payments, "sold");
//   const receivedPayments = filterPayments(payments, "received");

//   const totalPages = Math.ceil(total / limit);
//   const pendingAmount = payments
//     .filter((p: PaymentItem) => p.status === "completed")
//     .reduce(
//       (sum: number, p: PaymentItem) =>
//         sum + parseFloat(p.amountFormatted!.replace("₹", "")),
//       0
//     );

//   if (isLoading)
//     return (
//       <div className="text-center py-4 text-gray-600 dark:text-gray-300">
//         Loading payments...
//       </div>
//     );
//   if (error)
//     return (
//       <div className="text-center py-4 text-red-500">
//         Error loading payments: {(error as Error).message}
//       </div>
//     );

//   const renderNoPayments = (tab: string) => (
//     <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
//       <CalendarX className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
//       <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
//         No {tab} Payments
//       </h2>
//       <p className="text-gray-500 dark:text-gray-400 mt-2">
//         {tab === "sold"
//           ? "You have no sold payments."
//           : "You have no received payments."}
//       </p>
//     </div>
//   );

//   return (
//     <div className="mx-32 py-6">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
//         Payments
//       </h1>

//       {/* Total Earnings and Pending */}
//       <div className="grid grid-cols-2 gap-6 mb-8">
//         <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
//           <CardContent className="p-4">
//             <h2 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
//               Total Earnings
//             </h2>
//             <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//               ₹{totalAmount}
//             </p>
//           </CardContent>
//         </Card>
//         <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
//           <CardContent className="p-4">
//             <h2 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
//               Pending
//             </h2>
//             <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//               ₹{pendingAmount}
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Filters and Search */}
//       <div className="flex items-center gap-2 mb-8 border-b border-gray-200 dark:border-gray-700 pb-2">
//         {uniqueTypes.map((type) => (
//           <Button
//             key={type}
//             onClick={() => setTypeFilter(type)}
//             variant="outline"
//             className={`rounded-full border border-gray-300 dark:border-gray-600 px-4 py-1 font-medium transition-all ${
//               typeFilter === type
//                 ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
//                 : "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
//             }`}
//           >
//             {type}
//           </Button>
//         ))}
//         <Input
//           placeholder="Search by mentee name or service..."
//           value={globalSearch}
//           onChange={(e) => setGlobalSearch(e.target.value)}
//           className="ml-auto w-full sm:w-64 rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 pr-4 mr-4"
//         />
//       </div>

//       <Tabs value={selectedTab} onValueChange={setSelectedTab}>
//         <TabsList className="w-full flex justify-start gap-8 border-b border-gray-200 dark:border-gray-700 mb-8 bg-transparent">
//           <TabsTrigger
//             value="sold"
//             className={`pb-3 capitalize transition-all rounded-none text-lg font-semibold ${
//               selectedTab === "sold"
//                 ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
//                 : "text-gray-500 dark:text-gray-400"
//             }`}
//           >
//             Sold
//           </TabsTrigger>
//           <TabsTrigger
//             value="received"
//             className={`pb-3 capitalize transition-all rounded-none text-lg font-semibold ${
//               selectedTab === "received"
//                 ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
//                 : "text-gray-500 dark:text-gray-400"
//             }`}
//           >
//             Received
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="sold">
//           {soldPayments.length === 0 ? (
//             renderNoPayments("sold")
//           ) : (
//             <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Date
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Service ID
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Mentee Name
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Type
//                       <Select onValueChange={setTypeFilter} value={typeFilter}>
//                         <SelectTrigger className="border-none shadow-none p-0 h-auto">
//                           <SelectValue placeholder="Type" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-white dark:bg-gray-800">
//                           {uniqueTypes.map((type) => (
//                             <SelectItem key={type} value={type}>
//                               {type}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Service
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Amount
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Status
//                       <Select
//                         onValueChange={setStatusFilter}
//                         value={statusFilter}
//                       >
//                         <SelectTrigger className="border-none shadow-none p-0 h-auto">
//                           <SelectValue placeholder="Status" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-white dark:bg-gray-800">
//                           {uniqueStatuses.map((status) => (
//                             <SelectItem key={status} value={status}>
//                               {status}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {soldPayments.map((item: PaymentItem) => (
//                     <TableRow
//                       key={item._id}
//                       className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//                     >
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {item.date}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {item.bookingId.slice(-10)} {/* Show last 10 digits */}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {item.menteeName}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {item.type}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {item.serviceName}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         ₹ {item.total}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {item.status}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </TabsContent>

//         <TabsContent value="received">
//           {receivedPayments.length === 0 ? (
//             renderNoPayments("received")
//           ) : (
//             <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Date
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Service ID
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Transaction ID
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Payment Mode
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Amount
//                     </TableHead>
//                     <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
//                       Status
//                       <Select
//                         onValueChange={setStatusFilter}
//                         value={statusFilter}
//                       >
//                         <SelectTrigger className="border-none shadow-none p-0 h-auto">
//                           <SelectValue placeholder="Status" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-white dark:bg-gray-800">
//                           {uniqueStatuses.map((status) => (
//                             <SelectItem key={status} value={status}>
//                               {status}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {receivedPayments.map((item: PaymentItem) => (
//                     <TableRow
//                       key={item._id}
//                       className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//                     >
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {item.date}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {item.bookingId.slice(-10)} {/* Show last 10 digits */}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {item.transactionId.slice(-10)}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {item.paymentMode}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         ₹ {item.amount}
//                       </TableCell>
//                       <TableCell className="text-gray-700 dark:text-gray-300 py-3">
//                         {item.status}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
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
//     </div>
//   );
// }
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Clock,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  MessageCircle,
  FileText,
  Users,
} from "lucide-react";
import { getAllMentorPayments } from "@/services/paymentServcie";

interface PaymentItem {
  _id: string;
  bookingId: string;
  menteeId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  amount: number;
  total: number;
  status: string;
  transactionId: string;
  createdAt: string;
  serviceDetails: {
    _id: string;
    title: string;
    type: string;
  };
  mentorDetails: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  serviceName: string;
  mentorName: string;
  paymentMode: string;
  type?: string;
  date?: string;
  menteeName?: string;
  amountFormatted?: string;
}

export default function MentorPaymentsPage() {
  const [selectedTab, setSelectedTab] = useState("sold");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [globalSearch, setGlobalSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 22;

  const { user } = useSelector((state: RootState) => state.user);
  const mentorId = user?._id;

  const {
    data: { payments = [], total = 0, totalAmount = 0 } = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["mentorPayments", mentorId, page, statusFilter],
    queryFn: () => getAllMentorPayments(page, limit),
    enabled: !!mentorId,
    select: (data) => ({
      payments: data.payments.map((payment: PaymentItem) => ({
        ...payment,
        date: new Date(payment.createdAt).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        type:
          payment.serviceDetails.type === "1-1Call"
            ? "1:1 Call"
            : payment.serviceDetails.type === "priorityDM"
            ? "Priority DM"
            : payment.serviceDetails.type === "DigitalProducts"
            ? "Digital Product"
            : "Other",
        amountFormatted: `₹${payment.total}`,
        menteeName: `${payment.menteeId.firstName} ${payment.menteeId.lastName}`,
      })),
      total: data.total,
      totalAmount: data.totalAmount,
    }),
  });

  const uniqueTypes = useMemo<string[]>(
    () => ["All", ...new Set(payments.map((item: PaymentItem) => item.type))],
    [payments]
  );
  const uniqueStatuses = useMemo<string[]>(
    () => ["All", ...new Set(payments.map((item: PaymentItem) => item.status))],
    [payments]
  );

  const filterPayments = useMemo(() => {
    return (payments: PaymentItem[], tab: string) => {
      let filtered = payments;

      if (tab === "sold") {
        filtered = filtered.filter((p) => p.status !== "transferred");
      } else if (tab === "received") {
        filtered = filtered.filter((p) => p.status === "transferred");
      }

      if (typeFilter !== "All") {
        filtered = filtered.filter((p) => p.type === typeFilter);
      }

      if (statusFilter !== "All") {
        filtered = filtered.filter((p) => p.status === statusFilter);
      }

      if (globalSearch) {
        const query = globalSearch.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.menteeName?.toLowerCase().includes(query) ||
            p.serviceName.toLowerCase().includes(query)
        );
      }

      return filtered;
    };
  }, [typeFilter, statusFilter, globalSearch]);

  const soldPayments = filterPayments(payments, "sold");
  const receivedPayments = filterPayments(payments, "received");

  const totalPages = Math.ceil(total / limit);
  const pendingAmount = payments
    .filter((p: PaymentItem) => p.status === "completed")
    .reduce(
      (sum: number, p: PaymentItem) =>
        sum + parseFloat(p.amountFormatted!.replace("₹", "")),
      0
    );

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "transferred":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold";

    switch (status.toLowerCase()) {
      case "completed":
        return `${baseClasses} bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300`;
      case "pending":
        return `${baseClasses} bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300`;
      case "transferred":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`;
      case "failed":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300`;
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "1:1 Call":
        return <Phone className="h-4 w-4" />;
      case "Priority DM":
        return <MessageCircle className="h-4 w-4" />;
      case "Digital Product":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const renderNoPayments = (tab: string) => (
    <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
      <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-lg mb-6">
        <DollarSign className="h-12 w-12 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
        No {tab} Payments
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-center max-w-md">
        {tab === "sold"
          ? "You have no sold payments at the moment."
          : "You have no received payments to display."}
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Loading your payments...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 font-semibold">
            Error loading payments: {(error as Error).message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className=" pl-20 max-w-7xl mx-auto px-6 py-8 space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Payments Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
            Track your earnings and payment history
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                  Total Earnings
                </h2>
                <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                  ₹{totalAmount.toLocaleString()}
                </p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                  All time revenue
                </p>
              </div>
              <div className="p-3 bg-emerald-200 dark:bg-emerald-800 rounded-full">
                <TrendingUp className="h-8 w-8 text-emerald-700 dark:text-emerald-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-2">
                  Pending Amount
                </h2>
                <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                  ₹{pendingAmount.toLocaleString()}
                </p>
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                  Awaiting transfer
                </p>
              </div>
              <div className="p-3 bg-amber-200 dark:bg-amber-800 rounded-full">
                <Clock className="h-8 w-8 text-amber-700 dark:text-amber-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
              <Filter className="h-4 w-4" />
            </div>
            {uniqueTypes.map((type) => (
              <Button
                key={type}
                onClick={() => setTypeFilter(type)}
                variant="outline"
                className={`rounded-full border-2 px-6 py-2 font-semibold transition-all duration-200 ${
                  typeFilter === type
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
              placeholder="Search by mentee name or service..."
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
        className="space-y-6"
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-lg border border-slate-200 dark:border-slate-700">
          <TabsList className="w-full h-16 grid grid-cols-2 bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
            {[
              {
                key: "sold",
                label: "Sold",
                icon: CreditCard,
                count: soldPayments.length,
              },
              {
                key: "received",
                label: "Received",
                icon: CheckCircle,
                count: receivedPayments.length,
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
                <span>{label}</span>
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
          {/* Sold Tab */}
          <TabsContent value="sold" className="m-0">
            {soldPayments.length === 0 ? (
              <div className="p-8">{renderNoPayments("sold")}</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700">
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Date
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Service ID
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Mentee Name
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Type
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Service
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
                    {soldPayments.map((item: PaymentItem, index) => (
                      <TableRow
                        key={item._id}
                        className={`transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700 ${
                          index % 2 === 0
                            ? "bg-white dark:bg-slate-800"
                            : "bg-slate-50/50 dark:bg-slate-750"
                        }`}
                      >
                        <TableCell className="text-slate-700 dark:text-slate-300 font-medium py-4 px-6">
                          {item.date}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 py-4 px-6">
                          <span className="font-mono text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                            {item.bookingId.slice(-10)}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 font-medium py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-slate-400" />
                            {item.menteeName}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {getServiceIcon(item.type!)}
                            {item.type}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 py-4 px-6">
                          {item.serviceName}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 font-bold py-4 px-6">
                          ₹{item.total.toLocaleString()}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className={getStatusBadge(item.status)}>
                            {getStatusIcon(item.status)}
                            {item.status}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Received Tab */}
          <TabsContent value="received" className="m-0">
            {receivedPayments.length === 0 ? (
              <div className="p-8">{renderNoPayments("received")}</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-slate-50 to-green-50 dark:from-slate-800 dark:to-slate-700">
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Date
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Service ID
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Transaction ID
                      </TableHead>
                      <TableHead className="text-slate-800 dark:text-slate-200 font-bold text-sm py-4 px-6">
                        Payment Mode
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
                    {receivedPayments.map((item: PaymentItem, index) => (
                      <TableRow
                        key={item._id}
                        className={`transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700 ${
                          index % 2 === 0
                            ? "bg-white dark:bg-slate-800"
                            : "bg-slate-50/50 dark:bg-slate-750"
                        }`}
                      >
                        <TableCell className="text-slate-700 dark:text-slate-300 font-medium py-4 px-6">
                          {item.date}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 py-4 px-6">
                          <span className="font-mono text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                            {item.bookingId.slice(-10)}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 py-4 px-6">
                          <span className="font-mono text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                            {item.transactionId.slice(-10)}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 py-4 px-6">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-slate-400" />
                            {item.paymentMode}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 font-bold py-4 px-6">
                          ₹{item.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className={getStatusBadge(item.status)}>
                            {getStatusIcon(item.status)}
                            {item.status}
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
                Showing page {page} of {totalPages} ({total} total payments)
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
    </div>
  );
}
