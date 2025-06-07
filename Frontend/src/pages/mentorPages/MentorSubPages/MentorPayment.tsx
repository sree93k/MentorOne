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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarX } from "lucide-react";
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
  type?: string; // Added to store formatted type
  date?: string; // Added to store formatted date
  menteeName?: string; // Added to store formatted menteeName
  amountFormatted?: string; // Added to store formatted amount
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
    queryKey: ["mentorPayments", mentorId, page, statusFilter], // Removed globalSearch from queryKey
    queryFn: () => getAllMentorPayments(page, limit), // Pass empty searchQuery for client-side filtering
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
        amountFormatted: `₹${payment.amount}`,
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

      // Apply tab-specific filtering
      if (tab === "sold") {
        filtered = filtered.filter((p) => p.status !== "transferred");
      } else if (tab === "received") {
        filtered = filtered.filter((p) => p.status === "transferred");
      }

      // Apply type filter
      if (typeFilter !== "All") {
        filtered = filtered.filter((p) => p.type === typeFilter);
      }

      // Apply status filter
      if (statusFilter !== "All") {
        filtered = filtered.filter((p) => p.status === statusFilter);
      }

      // Apply global search (client-side)
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
    .filter((p: PaymentItem) => p.status === "pending")
    .reduce(
      (sum: number, p: PaymentItem) =>
        sum + parseFloat(p.amountFormatted!.replace("₹", "")),
      0
    );

  if (isLoading)
    return (
      <div className="text-center py-4 text-gray-600 dark:text-gray-300">
        Loading payments...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-4 text-red-500">
        Error loading payments: {(error as Error).message}
      </div>
    );

  const renderNoPayments = (tab: string) => (
    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <CalendarX className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
        No {tab} Payments
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2">
        {tab === "sold"
          ? "You have no sold payments."
          : "You have no received payments."}
      </p>
    </div>
  );

  return (
    <div className="mx-32 py-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Payments
      </h1>

      {/* Total Earnings and Pending */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
          <CardContent className="p-4">
            <h2 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
              Total Earnings
            </h2>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ₹{totalAmount}
            </p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
          <CardContent className="p-4">
            <h2 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
              Pending
            </h2>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ₹{pendingAmount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-2 mb-8 border-b border-gray-200 dark:border-gray-700 pb-2">
        {uniqueTypes.map((type) => (
          <Button
            key={type}
            onClick={() => setTypeFilter(type)}
            variant="outline"
            className={`rounded-full border border-gray-300 dark:border-gray-600 px-4 py-1 font-medium transition-all ${
              typeFilter === type
                ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                : "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
            }`}
          >
            {type}
          </Button>
        ))}
        <Input
          placeholder="Search by mentee name or service..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          className="ml-auto w-full sm:w-64 rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 pr-4 mr-4"
        />
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="w-full flex justify-start gap-8 border-b border-gray-200 dark:border-gray-700 mb-8 bg-transparent">
          <TabsTrigger
            value="sold"
            className={`pb-3 capitalize transition-all rounded-none text-lg font-semibold ${
              selectedTab === "sold"
                ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Sold
          </TabsTrigger>
          <TabsTrigger
            value="received"
            className={`pb-3 capitalize transition-all rounded-none text-lg font-semibold ${
              selectedTab === "received"
                ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Received
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sold">
          {soldPayments.length === 0 ? (
            renderNoPayments("sold")
          ) : (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Date
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Service ID
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Mentee Name
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Type
                      <Select onValueChange={setTypeFilter} value={typeFilter}>
                        <SelectTrigger className="border-none shadow-none p-0 h-auto">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800">
                          {uniqueTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Service
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Amount
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Status
                      <Select
                        onValueChange={setStatusFilter}
                        value={statusFilter}
                      >
                        <SelectTrigger className="border-none shadow-none p-0 h-auto">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800">
                          {uniqueStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {soldPayments.map((item: PaymentItem) => (
                    <TableRow
                      key={item._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {item.date}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {item.bookingId.slice(-10)} {/* Show last 10 digits */}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {item.menteeName}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {item.type}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {item.serviceName}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {item.amountFormatted}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {item.status}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="received">
          {receivedPayments.length === 0 ? (
            renderNoPayments("received")
          ) : (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Date
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Service ID
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Transaction ID
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Payment Mode
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Amount
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4">
                      Status
                      <Select
                        onValueChange={setStatusFilter}
                        value={statusFilter}
                      >
                        <SelectTrigger className="border-none shadow-none p-0 h-auto">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800">
                          {uniqueStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receivedPayments.map((item: PaymentItem) => (
                    <TableRow
                      key={item._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {item.date}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {item.bookingId.slice(-10)} {/* Show last 10 digits */}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {item.transactionId}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {item.paymentMode}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {item.amountFormatted}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-3">
                        {item.status}
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
    </div>
  );
}
