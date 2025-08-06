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
import {
  ChevronDown,
  CalendarX,
  Check,
  Search,
  CreditCard,
  RotateCcw,
  TrendingUp,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Filter,
  Download,
  Calendar,
  User,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";
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
  total: string;
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
  const [statusFilter, setStatusFilter] = useState("completed");
  const [showFilters, setShowFilters] = useState(false);
  const [searching, setSearching] = useState(false);
  const [tab, setTab] = useState("booked");
  const [stats, setStats] = useState({
    total: 0,
    booked: 0,
    transferred: 0,
    refunded: 0,
  });
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.admin.loading);
  const error = useSelector((state: RootState) => state.admin.error);

  const statusOptions = ["completed", "transferred", "refunded"];

  const fetchPayments = async () => {
    dispatch(setLoading(true));
    setSearching(true);
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
          total: `₹ ${payment.total || 0}`,
          status: payment.status || "Unknown",
          mentorId: payment.mentorDetails?._id || "",
          bookingId: payment.bookingId || "",
        }));
        setPayments(formattedPayments);
        setTotal(total);
        const booked = data.filter((p: any) => p.status === "completed").length;
        const transferred = data.filter(
          (p: any) => p.status === "transferred"
        ).length;
        const refunded = data.filter(
          (p: any) => p.status === "refunded"
        ).length;
        setStats({ total, booked, transferred, refunded });
      } else {
        dispatch(
          setError({
            message: response?.data?.error || "Failed to fetch payments.",
          })
        );
        setPayments([]);
        setTotal(0);
        setStats({ total: 0, booked: 0, transferred: 0, refunded: 0 });
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
      setStats({ total: 0, booked: 0, transferred: 0, refunded: 0 });
    } finally {
      dispatch(setLoading(false));
      setSearching(false);
    }
  };

  const handlePayToMentor = async (
    paymentId: string,
    mentorId: string,
    total: string
  ) => {
    dispatch(setLoading(true));
    dispatch(setError({}));
    try {
      const cleanAmount = parseFloat(total.replace("₹ ", ""));
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
    } else if (value === "transferred") {
      setStatusFilter("transferred");
    } else if (value === "refunded") {
      setStatusFilter("refunded");
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
    setTab(value === "completed" ? "booked" : value);
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "transferred":
        return <ArrowUpRight className="h-4 w-4 text-blue-500" />;
      case "refunded":
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium";
    switch (status.toLowerCase()) {
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800 border border-green-200`;
      case "transferred":
        return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`;
      case "refunded":
        return `${baseClasses} bg-red-100 text-red-800 border border-red-200`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
    }
  };

  const renderEmptyState = (tab: string) => (
    <TableRow>
      <TableCell
        colSpan={tab === "transferred" ? 8 : 7}
        className="text-center py-16"
      >
        <div className="flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
            <CalendarX className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No {tab.charAt(0).toUpperCase() + tab.slice(1)} Payments Found
          </h3>
          <p className="text-gray-600 max-w-md text-center mb-6">
            {tab === "booked"
              ? "There are no completed payments yet. Encourage bookings to start processing payments!"
              : tab === "transferred"
              ? "There are no payments transferred to mentors."
              : "No payments have been refunded yet."}
          </p>
          {tab === "booked" || tab === "transferred" ? (
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CreditCard className="h-4 w-4 mr-2" />
              New Payment
            </Button>
          ) : null}
        </div>
      </TableCell>
    </TableRow>
  );

  const renderErrorState = () => (
    <TableRow>
      <TableCell
        colSpan={tab === "transferred" ? 8 : 7}
        className="text-center py-16"
      >
        <div className="flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-red-600 mb-6">
            {error?.message || "An error occurred."}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="ml-24 p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                Payment Transactions
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and monitor all payment transactions
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">
                      Total Payments
                    </p>
                    <p className="text-3xl font-bold text-blue-900">
                      {stats.total}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-1">
                      Completed
                    </p>
                    <p className="text-3xl font-bold text-green-900">
                      {stats.booked}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 mb-1">
                      Transferred
                    </p>
                    <p className="text-3xl font-bold text-purple-900">
                      {stats.transferred}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                    <ArrowUpRight className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
              <div className="p-6 bg-gradient-to-br from-red-50 to-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600 mb-1">
                      Refunded
                    </p>
                    <p className="text-3xl font-bold text-red-900">
                      {stats.refunded}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                    <ArrowDownRight className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filters */}
          {/* <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by mentor or mentee..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 bg-white border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
              />
            </div>
            <Button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm rounded-xl px-4 py-2 transition-all duration-300">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div> */}
          {/* Enhanced Search & Filter Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  Search & Filter Payments
                </h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-xl hover:from-blue-200 hover:to-indigo-200 transition-all duration-300 font-medium"
                >
                  <Filter className="h-4 w-4" />
                  <span>{showFilters ? "Hide" : "Show"} Advanced Filters</span>
                </button>
              </div>

              {/* Enhanced Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by mentor, mentee, or transaction..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all duration-300 text-gray-900 placeholder-gray-500"
                />
                {searching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                  </div>
                )}
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Mentor Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Mentor
                      </label>
                      <select
                        value={mentorFilter}
                        onChange={(e) => handleMentorFilter(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all duration-300"
                      >
                        <option value="">All Mentors</option>
                        {uniqueMentors.map((mentor) => (
                          <option key={mentor} value={mentor}>
                            {mentor}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Mentee Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Mentee
                      </label>
                      <select
                        value={menteeFilter}
                        onChange={(e) => handleMenteeFilter(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all duration-300"
                      >
                        <option value="">All Mentees</option>
                        {uniqueMentees.map((mentee) => (
                          <option key={mentee} value={mentee}>
                            {mentee}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Payment Status
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => handleStatusFilter(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all duration-300"
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Filter Results & Clear */}
              {(searchQuery || mentorFilter || menteeFilter) && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {total} result{total !== 1 ? "s" : ""} found
                    </span>
                    {total > 0 && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setMentorFilter("");
                      setMenteeFilter("");
                      setPage(1);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300 font-medium"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Clear All Filters</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs value={tab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="bg-white rounded-xl p-2 shadow-lg border border-gray-100">
            <TabsTrigger
              value="booked"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg px-6 py-3 font-medium transition-all duration-300"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
            </TabsTrigger>
            <TabsTrigger
              value="transferred"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg px-6 py-3 font-medium transition-all duration-300"
            >
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Transferred
            </TabsTrigger>
            <TabsTrigger
              value="refunded"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg px-6 py-3 font-medium transition-all duration-300"
            >
              <ArrowDownRight className="h-4 w-4 mr-2" />
              Refunded
            </TabsTrigger>
          </TabsList>

          <TabsContent value={tab}>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <TableHead className="text-gray-700 font-semibold text-sm py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date
                      </div>
                    </TableHead>
                    <TableHead className="text-gray-700 font-semibold text-sm py-4 px-6">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Transaction ID
                      </div>
                    </TableHead>
                    <TableHead className="text-gray-700 font-semibold text-sm py-4 px-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                          <User className="h-4 w-4" />
                          Mentor Name
                          <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white shadow-xl border border-gray-200 rounded-xl">
                          <DropdownMenuItem
                            onClick={() => handleMentorFilter("")}
                            className="text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                          >
                            All
                          </DropdownMenuItem>
                          {uniqueMentors.map((mentor) => (
                            <DropdownMenuItem
                              key={mentor}
                              onClick={() => handleMentorFilter(mentor)}
                              className="text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                            >
                              {mentor}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>
                    <TableHead className="text-gray-700 font-semibold text-sm py-4 px-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                          <Users className="h-4 w-4" />
                          Mentee Name
                          <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white shadow-xl border border-gray-200 rounded-xl">
                          <DropdownMenuItem
                            onClick={() => handleMenteeFilter("")}
                            className="text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                          >
                            All
                          </DropdownMenuItem>
                          {uniqueMentees.map((mentee) => (
                            <DropdownMenuItem
                              key={mentee}
                              onClick={() => handleMenteeFilter(mentee)}
                              className="text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                            >
                              {mentee}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>
                    <TableHead className="text-gray-700 font-semibold text-sm py-4 px-6">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Service
                      </div>
                    </TableHead>
                    <TableHead className="text-gray-700 font-semibold text-sm py-4 px-6">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Amount
                      </div>
                    </TableHead>
                    <TableHead className="text-gray-700 font-semibold text-sm py-4 px-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                          <CheckCircle className="h-4 w-4" />
                          Status
                          <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white shadow-xl border border-gray-200 rounded-xl">
                          {statusOptions.map((option) => (
                            <DropdownMenuItem
                              key={option}
                              onClick={() => handleStatusFilter(option)}
                              className="text-gray-700 hover:bg-blue-50 hover:text-blue-700"
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
                  ) : filteredPayments.length === 0 ? (
                    renderEmptyState(tab)
                  ) : (
                    filteredPayments.map((payment, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-blue-50/50 transition-all duration-200 border-b border-gray-100"
                      >
                        <TableCell className="text-gray-700 py-4 px-6 font-medium">
                          {payment.date}
                        </TableCell>
                        <TableCell className="text-gray-600 py-4 px-6">
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                            {payment.transactionId}
                          </code>
                        </TableCell>
                        <TableCell className="text-gray-700 py-4 px-6 font-medium">
                          {payment.mentorName}
                        </TableCell>
                        <TableCell className="text-gray-700 py-4 px-6 font-medium">
                          {payment.menteeName}
                        </TableCell>
                        <TableCell className="text-gray-600 py-4 px-6">
                          {payment.service}
                        </TableCell>
                        <TableCell className="text-gray-900 py-4 px-6 font-bold">
                          {payment.total}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <span className={getStatusBadge(payment.status)}>
                            {getStatusIcon(payment.status)}
                            {payment.status.charAt(0).toUpperCase() +
                              payment.status.slice(1)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-8">
            <Button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm rounded-xl px-6 py-2 transition-all duration-300"
            >
              Previous
            </Button>
            <div className="flex gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum =
                  Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                if (pageNum > totalPages) return null;
                return (
                  <Button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-xl transition-all duration-300 ${
                      page === pageNum
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm rounded-xl px-6 py-2 transition-all duration-300"
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
