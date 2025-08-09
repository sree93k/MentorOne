// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Check, CreditCard } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   getAllMenteePayments,
//   getMenteeWallet,
// } from "@/services/paymentServcie";

// interface Payment {
//   _id: string;
//   bookingId: string;
//   menteeId: string;
//   amount: number;
//   total: number;
//   status: string;
//   transactionId: string;
//   createdAt: string;
//   serviceName: string;
//   mentorName: string;
//   paymentMode: string;
// }

// interface WalletTransaction {
//   transactionId: string;
//   paymentId: string;
//   amount: number;
//   type: string;
//   description: string;
//   createdAt: string;
// }

// interface WalletData {
//   balance: number;
//   pendingBalance: number;
//   status: string;
//   transactions: WalletTransaction[];
//   totalCount: number;
//   totalPages: number;
//   currentPage: number;
// }

// export default function MenteeBillingPage() {
//   const navigate = useNavigate();
//   const [payments, setPayments] = useState<Payment[]>([]);
//   const [totalAmount, setTotalAmount] = useState<number>(0);
//   const [totalPaymentCount, setTotalPaymentCount] = useState<number>(0);
//   const [walletData, setWalletData] = useState<WalletData | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [paymentPage, setPaymentPage] = useState<number>(1);
//   const [walletPage, setWalletPage] = useState<number>(1);
//   const paymentsPerPage = 12;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);

//         const [paymentData, walletResponse] = await Promise.all([
//           getAllMenteePayments(paymentPage, paymentsPerPage),
//           getMenteeWallet(walletPage, paymentsPerPage),
//         ]);

//         console.log("Payment data:", paymentData);
//         console.log("Wallet data:", walletResponse);

//         if (!paymentData || typeof paymentData !== "object") {
//           throw new Error("Invalid payment data received");
//         }

//         setPayments(paymentData.payments || []);
//         setTotalAmount(paymentData.totalAmount || 0);
//         setTotalPaymentCount(paymentData.totalCount || 0);

//         setWalletData(walletResponse);
//       } catch (err: any) {
//         console.error("Failed to fetch data:", err);
//         setError(err.message || "Failed to load billing data");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [navigate, paymentPage, walletPage]);

//   const totalPaymentPages = Math.ceil(totalPaymentCount / paymentsPerPage);
//   const totalWalletPages = walletData
//     ? Math.ceil(walletData.totalCount / paymentsPerPage)
//     : 1;

//   const handlePaymentPageChange = (page: number) => {
//     if (page >= 1 && page <= totalPaymentPages) {
//       setPaymentPage(page);
//     }
//   };

//   const handleWalletPageChange = (page: number) => {
//     if (page >= 1 && page <= totalWalletPages) {
//       setWalletPage(page);
//     }
//   };

//   if (isLoading) {
//     return <div className="mx-28 py-0">Loading...</div>;
//   }

//   if (error) {
//     return <div className="mx-28 py-0 text-red-500">{error}</div>;
//   }

//   return (
//     <div className="mx-28 py-0">
//       <h1 className="text-2xl font-bold mb-4">Billing</h1>

//       <div className="flex flex-row gap-6 mb-6">
//         <Card className="w-full">
//           <CardContent className="p-6">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <span className="flex flex-col text-lg font-medium">
//                   Total Bill
//                 </span>
//                 <span className="text-2xl font-bold ml-0">
//                   ₹{(totalAmount || 0).toLocaleString("en-IN")}/-
//                 </span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="w-full">
//           <CardContent className="p-6">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <span className="flex flex-col text-lg font-medium">
//                   Transactions
//                 </span>
//                 <span className="text-2xl font-bold ml-0">
//                   {totalPaymentCount || 0} Nos
//                 </span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="w-full">
//           <CardContent className="p-6">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <span className="flex flex-col text-lg font-medium">
//                   Wallet Balance
//                 </span>
//                 <span className="text-2xl font-bold ml-0">
//                   ₹{(walletData?.pendingBalance || 0).toLocaleString("en-IN")}/-
//                 </span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Tabs defaultValue="transactions" className="w-full">
//         <TabsList className="grid w-full grid-cols-2 p-1 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-inner">
//           <TabsTrigger
//             value="transactions"
//             className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-100 data-[state=active]:to-green-100 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-900 rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
//           >
//             Transactions
//           </TabsTrigger>
//           <TabsTrigger
//             value="wallet"
//             className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-100 data-[state=active]:to-green-100 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-900 rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
//           >
//             Wallet
//           </TabsTrigger>
//         </TabsList>
//         <TabsContent value="transactions">
//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Product</TableHead>
//                   <TableHead>Mentor</TableHead>
//                   <TableHead>Amount</TableHead>
//                   <TableHead>Payment Mode</TableHead>
//                   <TableHead>Payment Status</TableHead>
//                   <TableHead className="w-[50px]"></TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {payments.length > 0 ? (
//                   payments.map((item) => (
//                     <TableRow key={item._id}>
//                       <TableCell>
//                         {new Date(item.createdAt).toLocaleDateString("en-GB", {
//                           day: "2-digit",
//                           month: "2-digit",
//                           year: "numeric",
//                         })}
//                       </TableCell>
//                       <TableCell>{item.serviceName}</TableCell>
//                       <TableCell>{item.mentorName}</TableCell>
//                       <TableCell>
//                         ₹{item.total.toLocaleString("en-IN")}/-
//                       </TableCell>
//                       <TableCell>{item.paymentMode}</TableCell>
//                       <TableCell>
//                         {item.status === "completed" ||
//                         item.status === "transferred"
//                           ? "Success"
//                           : item.status === "refunded"
//                           ? "Refunded"
//                           : item.status}
//                       </TableCell>
//                       <TableCell>
//                         <div
//                           className={`h-6 w-6 rounded-full flex items-center justify-center ${
//                             item.status === "completed" ||
//                             item.status === "transferred"
//                               ? "bg-green-500"
//                               : item.status === "failed"
//                               ? "bg-red-500"
//                               : item.status === "refunded"
//                               ? "bg-yellow-500"
//                               : "bg-gray-500"
//                           }`}
//                         >
//                           <Check
//                             className={`h-4 w-4 ${
//                               item.status === "completed"
//                                 ? "text-white"
//                                 : "text-black"
//                             }`}
//                           />
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={7}>
//                       <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg p-6 animate-fade-in shadow-sm">
//                         <div className="relative mb-4">
//                           <CreditCard className="w-16 h-16 text-gray-400 animate-pulse" />
//                           <div className="absolute inset-0 flex items-center justify-center">
//                             <div className="w-20 h-20 border-2 border-gray-200 rounded-full animate-pulse opacity-50"></div>
//                           </div>
//                         </div>
//                         <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
//                           No Payments Found
//                         </h3>
//                         <p className="text-sm text-gray-500 mt-2 max-w-sm text-center">
//                           You haven't made any payments yet. Book a session with
//                           a mentor to get started!
//                         </p>
//                         <Button
//                           variant="outline"
//                           className="mt-4 bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
//                           onClick={() => navigate("/seeker/mentors")}
//                         >
//                           Explore Mentors
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//           {totalPaymentCount > paymentsPerPage && (
//             <div className="flex justify-center items-center gap-2 mt-4">
//               <Button
//                 onClick={() => handlePaymentPageChange(paymentPage - 1)}
//                 disabled={paymentPage === 1}
//                 variant="outline"
//               >
//                 Previous
//               </Button>
//               {[...Array(totalPaymentPages)].map((_, index) => (
//                 <Button
//                   key={index + 1}
//                   onClick={() => handlePaymentPageChange(index + 1)}
//                   variant={paymentPage === index + 1 ? "default" : "outline"}
//                 >
//                   {index + 1}
//                 </Button>
//               ))}
//               <Button
//                 onClick={() => handlePaymentPageChange(paymentPage + 1)}
//                 disabled={paymentPage === totalPaymentPages}
//                 variant="outline"
//               >
//                 Next
//               </Button>
//             </div>
//           )}
//         </TabsContent>
//         <TabsContent value="wallet">
//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Transaction ID</TableHead>
//                   <TableHead>Type</TableHead>
//                   <TableHead>Amount</TableHead>
//                   <TableHead>Description</TableHead>
//                   <TableHead>Status</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {walletData && walletData.transactions.length > 0 ? (
//                   walletData.transactions.map((tx) => (
//                     <TableRow key={tx.paymentId}>
//                       <TableCell>
//                         {new Date(tx.createdAt).toLocaleDateString("en-GB", {
//                           day: "2-digit",
//                           month: "2-digit",
//                           year: "numeric",
//                         })}
//                       </TableCell>
//                       <TableCell>{tx.paymentId.slice(-10)}</TableCell>
//                       <TableCell>{tx.type}</TableCell>

//                       <TableCell>
//                         ₹{tx.amount.toLocaleString("en-IN")}/-
//                       </TableCell>
//                       <TableCell>{tx.description}</TableCell>
//                       <TableCell>
//                         <div
//                           className={`h-6 w-6 rounded-full flex items-center justify-center ${
//                             walletData.status === "credit" &&
//                             tx.type === "credit"
//                               ? "bg-green-500"
//                               : "bg-green-500"
//                           }`}
//                         >
//                           <Check
//                             className={`h-4 w-4 ${
//                               walletData.status === "pending" &&
//                               tx.type === "credit"
//                                 ? "text-white"
//                                 : "text-white"
//                             }`}
//                           />
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={6}>
//                       <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg p-6 animate-fade-in shadow-sm">
//                         <div className="relative mb-4">
//                           <CreditCard className="w-16 h-16 text-gray-400 animate-pulse" />
//                           <div className="absolute inset-0 flex items-center justify-center">
//                             <div className="w-20 h-20 border-2 border-gray-200 rounded-full animate-pulse opacity-50"></div>
//                           </div>
//                         </div>
//                         <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
//                           No Wallet Transactions Found
//                         </h3>
//                         <p className="text-sm text-gray-500 mt-2 max-w-sm text-center">
//                           Your wallet has no transactions yet.
//                         </p>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//           {walletData && walletData.totalCount > paymentsPerPage && (
//             <div className="flex justify-center items-center gap-2 mt-4">
//               <Button
//                 onClick={() => handleWalletPageChange(walletPage - 1)}
//                 disabled={walletPage === 1}
//                 variant="outline"
//               >
//                 Previous
//               </Button>
//               {[...Array(totalWalletPages)].map((_, index) => (
//                 <Button
//                   key={index + 1}
//                   onClick={() => handleWalletPageChange(index + 1)}
//                   variant={walletPage === index + 1 ? "default" : "outline"}
//                 >
//                   {index + 1}
//                 </Button>
//               ))}
//               <Button
//                 onClick={() => handleWalletPageChange(walletPage + 1)}
//                 disabled={walletPage === totalWalletPages}
//                 variant="outline"
//               >
//                 Next
//               </Button>
//             </div>
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  CreditCard,
  Wallet,
  TrendingUp,
  Calendar,
  DollarSign,
  Receipt,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Activity,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  getAllMenteePayments,
  getMenteeWallet,
} from "@/services/paymentServcie";

interface Payment {
  _id: string;
  bookingId: string;
  menteeId: string;
  amount: number;
  total: number;
  status: string;
  transactionId: string;
  createdAt: string;
  serviceName: string;
  mentorName: string;
  paymentMode: string;
}

interface WalletTransaction {
  transactionId: string;
  paymentId: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
}

interface WalletData {
  balance: number;
  pendingBalance: number;
  status: string;
  transactions: WalletTransaction[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export default function MenteeBillingPage() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalPaymentCount, setTotalPaymentCount] = useState<number>(0);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentPage, setPaymentPage] = useState<number>(1);
  const [walletPage, setWalletPage] = useState<number>(1);
  const paymentsPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [paymentData, walletResponse] = await Promise.all([
          getAllMenteePayments(paymentPage, paymentsPerPage),
          getMenteeWallet(walletPage, paymentsPerPage),
        ]);

        console.log("Payment data:", paymentData);
        console.log("Wallet data:", walletResponse);

        if (!paymentData || typeof paymentData !== "object") {
          throw new Error("Invalid payment data received");
        }

        setPayments(paymentData.payments || []);
        setTotalAmount(paymentData.totalAmount || 0);
        setTotalPaymentCount(paymentData.totalCount || 0);

        setWalletData(walletResponse);
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError(err.message || "Failed to load billing data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate, paymentPage, walletPage]);

  const totalPaymentPages = Math.ceil(totalPaymentCount / paymentsPerPage);
  const totalWalletPages = walletData
    ? Math.ceil(walletData.totalCount / paymentsPerPage)
    : 1;

  const handlePaymentPageChange = (page: number) => {
    if (page >= 1 && page <= totalPaymentPages) {
      setPaymentPage(page);
    }
  };

  const handleWalletPageChange = (page: number) => {
    if (page >= 1 && page <= totalWalletPages) {
      setWalletPage(page);
    }
  };

  // Get payment status configuration
  const getPaymentStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "transferred":
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          label: "Success",
          color: "text-green-600",
          bgColor: "bg-green-100",
          badgeVariant: "default" as const,
        };
      case "failed":
        return {
          icon: <XCircle className="w-4 h-4" />,
          label: "Failed",
          color: "text-red-600",
          bgColor: "bg-red-100",
          badgeVariant: "destructive" as const,
        };
      case "refunded":
        return {
          icon: <ArrowDownLeft className="w-4 h-4" />,
          label: "Refunded",
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          badgeVariant: "secondary" as const,
        };
      case "pending":
        return {
          icon: <Clock className="w-4 h-4" />,
          label: "Pending",
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          badgeVariant: "outline" as const,
        };
      default:
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          label: status,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          badgeVariant: "secondary" as const,
        };
    }
  };

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Bill Card */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-500 to-blue-600 text-white overflow-hidden relative">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">
                Total Spent
              </p>
              <p className="text-3xl font-bold">
                ₹{(totalAmount || 0).toLocaleString("en-IN")}
              </p>
              <p className="text-purple-100 text-xs mt-1">All time payments</p>
            </div>
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <DollarSign className="w-8 h-8" />
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 opacity-10">
            <TrendingUp className="w-24 h-24" />
          </div>
        </CardContent>
      </Card>

      {/* Transactions Card */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden relative">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium mb-1">
                Transactions
              </p>
              <p className="text-3xl font-bold">{totalPaymentCount || 0}</p>
              <p className="text-emerald-100 text-xs mt-1">
                Total payments made
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Receipt className="w-8 h-8" />
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 opacity-10">
            <Activity className="w-24 h-24" />
          </div>
        </CardContent>
      </Card>

      {/* Wallet Balance Card */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-pink-600 text-white overflow-hidden relative">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium mb-1">
                Wallet Balance
              </p>
              <p className="text-3xl font-bold">
                ₹{(walletData?.pendingBalance || 0).toLocaleString("en-IN")}
              </p>
              <p className="text-orange-100 text-xs mt-1">Available balance</p>
            </div>
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Wallet className="w-8 h-8" />
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 opacity-10">
            <Sparkles className="w-24 h-24" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPaymentTable = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-0">
      <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Payment History</h3>
            <p className="text-gray-600 text-sm mt-1">
              Track all your payment transactions
            </p>
          </div>
          {/* <Button
            variant="outline"
            className="rounded-xl border-2 border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button> */}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700">
                Date
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Service
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Mentor
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Amount
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Payment Mode
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Status
              </TableHead>
              {/* <TableHead className="font-semibold text-gray-700">
                Action
              </TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length > 0 ? (
              payments.map((item, index) => {
                const statusConfig = getPaymentStatusConfig(item.status);
                return (
                  <TableRow
                    key={item._id}
                    className="hover:bg-purple-50 transition-colors duration-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="font-medium">
                      {new Date(item.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">
                        {item.serviceName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {item.mentorName.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">
                          {item.mentorName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-lg text-gray-900">
                        ₹{item.total.toLocaleString("en-IN")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-50">
                        {item.paymentMode}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusConfig.badgeVariant}
                        className={`${statusConfig.bgColor} ${statusConfig.color} border-0`}
                      >
                        <span className="flex items-center gap-1">
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </Badge>
                    </TableCell>
                    {/* <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-lg hover:bg-purple-100"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell> */}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-64">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
                      <CreditCard className="w-10 h-10 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No Payments Yet
                    </h3>
                    <p className="text-gray-600 max-w-sm mb-6">
                      You haven't made any payments yet. Book a session with a
                      mentor to get started!
                    </p>
                    <Button
                      onClick={() => navigate("/seeker/mentors")}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-6 py-3"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Explore Mentors
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  const renderWalletTable = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-0">
      <div className="p-6 bg-gradient-to-r from-orange-50 to-pink-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Wallet Transactions
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Your wallet transaction history
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-gray-600">Current Balance</p>
              <p className="text-xl font-bold text-orange-600">
                ₹{(walletData?.pendingBalance || 0).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700">
                Date
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Transaction ID
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Type
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Amount
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Description
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {walletData && walletData.transactions.length > 0 ? (
              walletData.transactions.map((tx, index) => (
                <TableRow
                  key={tx.paymentId}
                  className="hover:bg-orange-50 transition-colors duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell className="font-medium">
                    {new Date(tx.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                      {tx.paymentId.slice(-10)}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={tx.type === "credit" ? "default" : "secondary"}
                      className={
                        tx.type === "credit"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      <span className="flex items-center gap-1">
                        {tx.type === "credit" ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownLeft className="w-3 h-3" />
                        )}
                        {tx.type}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-bold text-lg ${
                        tx.type === "credit" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.type === "credit" ? "+" : "-"}₹
                      {tx.amount.toLocaleString("en-IN")}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {tx.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-600 font-medium">
                        Completed
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-64">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
                      <Wallet className="w-10 h-10 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No Wallet Transactions
                    </h3>
                    <p className="text-gray-600 max-w-sm">
                      Your wallet transaction history will appear here once you
                      start making payments.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  const renderPagination = (
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void
  ) => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center mt-8 gap-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          className="rounded-xl hover:bg-purple-50 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <Button
                  key={page}
                  onClick={() => onPageChange(page)}
                  variant={currentPage === page ? "default" : "outline"}
                  className={`rounded-xl min-w-[40px] ${
                    currentPage === page
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                      : "hover:bg-purple-50"
                  }`}
                >
                  {page}
                </Button>
              );
            } else if (page === currentPage - 2 || page === currentPage + 2) {
              return (
                <span key={page} className="px-2 py-1">
                  ...
                </span>
              );
            }
            return null;
          })}
        </div>

        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          className="rounded-xl hover:bg-purple-50 disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">
                Loading billing data...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Error Loading Data
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-8 py-1">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Billing & Payments
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your payment history and wallet transactions
          </p>
        </div>

        {/* Stats Cards */}
        {renderStatsCards()}

        {/* Tabs */}
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="bg-white h-14 shadow-md rounded-xl p-1.5 grid grid-cols-2 gap-1 mb-8">
            <TabsTrigger
              value="transactions"
              className="rounded-lg px-6 py-2.5 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              <Receipt className="w-4 h-4 mr-2" />
              Payment History
            </TabsTrigger>
            <TabsTrigger
              value="wallet"
              className="rounded-lg px-6 py-2.5 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Wallet Transactions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            {renderPaymentTable()}
            {renderPagination(
              paymentPage,
              totalPaymentPages,
              handlePaymentPageChange
            )}
          </TabsContent>

          <TabsContent value="wallet">
            {renderWalletTable()}
            {renderPagination(
              walletPage,
              totalWalletPages,
              handleWalletPageChange
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
