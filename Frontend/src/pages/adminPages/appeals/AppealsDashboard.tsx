import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Filter,
  Calendar,
  Mail,
  User,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import adminAppealService from "@/services/adminAppealService";

interface Appeal {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  category: string;
  status: "pending" | "approved" | "rejected" | "under_review";
  submittedAt: string;
  appealMessage: string;
  appealCount?: number;
  canReappeal?: boolean;
  reviewedAt?: string;
  reviewedBy?: string;
  adminResponse?: string;
}

interface SearchFilters {
  search: string;
  status: string;
  category: string;
  startDate: string;
  endDate: string;
}

const AppealsDashboard: React.FC = () => {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  // ✅ Enhanced filters with debouncing
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
    status: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  // ✅ Advanced pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // ✅ Statistics state
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    approvalRate: 0,
  });

  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // ✅ Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchFilters: SearchFilters) => {
      console.log("🔍 Debounced search triggered", searchFilters);
      loadAppeals(1, searchFilters); // Reset to page 1 on new search
    }, 500),
    [pagination.limit]
  );

  // ✅ Load appeals with advanced filtering
  const loadAppeals = useCallback(
    async (
      page: number = pagination.page,
      searchFilters: SearchFilters = filters
    ) => {
      try {
        setSearching(true);
        console.log("📋 Loading appeals", { page, searchFilters });

        const result = await adminAppealService.getAppeals({
          page,
          limit: pagination.limit,
          ...searchFilters,
        });

        if (result.success && result.data) {
          setAppeals(result.data.data || []);
          setPagination((prev) => ({
            ...prev,
            page,
            total: result.data.totalCount || 0,
            totalPages: result.data.totalPages || 0,
            hasNextPage: result.data.hasNextPage || false,
            hasPreviousPage: result.data.hasPreviousPage || false,
          }));

          console.log("✅ Appeals loaded successfully", {
            count: result.data.data?.length || 0,
            total: result.data.totalCount || 0,
          });
        } else {
          console.error("❌ Failed to load appeals", result.message);
          setAppeals([]);
          toast.error(result.message || "Failed to load appeals");
        }
      } catch (error) {
        console.error("❌ Error loading appeals:", error);
        setAppeals([]);
        toast.error("Error loading appeals");
      } finally {
        setSearching(false);
        setLoading(false);
      }
    },
    [pagination.limit]
  );

  // ✅ Load statistics
  const loadStatistics = useCallback(async () => {
    try {
      const result = await adminAppealService.getAppealStatistics();
      if (result.success && result.data) {
        setStatistics(result.data);
      }
    } catch (error) {
      console.error("❌ Error loading statistics:", error);
    }
  }, []);

  // ✅ Initial load
  useEffect(() => {
    loadAppeals();
    loadStatistics();
  }, []);

  // ✅ Handle filter changes with debouncing
  useEffect(() => {
    if (
      filters.search !== "" ||
      filters.status !== "" ||
      filters.category !== "" ||
      filters.startDate !== "" ||
      filters.endDate !== ""
    ) {
      debouncedSearch(filters);
    } else {
      loadAppeals(1, filters);
    }
  }, [filters, debouncedSearch]);

  // ✅ Handle filter input changes
  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ✅ Clear all filters
  const clearFilters = () => {
    setFilters({
      search: "",
      status: "",
      category: "",
      startDate: "",
      endDate: "",
    });
  };

  // ✅ Page navigation
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadAppeals(newPage);
    }
  };

  // ✅ Status configuration with modern styling
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="h-4 w-4" />,
          color: "bg-amber-50 text-amber-700 border-amber-200",
          bgGradient: "from-amber-500/10 to-yellow-500/10",
          textColor: "text-amber-700",
        };
      case "under_review":
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          color: "bg-blue-50 text-blue-700 border-blue-200",
          bgGradient: "from-blue-500/10 to-indigo-500/10",
          textColor: "text-blue-700",
        };
      case "approved":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: "bg-green-50 text-green-700 border-green-200",
          bgGradient: "from-green-500/10 to-emerald-500/10",
          textColor: "text-green-700",
        };
      case "rejected":
        return {
          icon: <XCircle className="h-4 w-4" />,
          color: "bg-red-50 text-red-700 border-red-200",
          bgGradient: "from-red-500/10 to-rose-500/10",
          textColor: "text-red-700",
        };
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          color: "bg-gray-50 text-gray-700 border-gray-200",
          bgGradient: "from-gray-500/10 to-slate-500/10",
          textColor: "text-gray-700",
        };
    }
  };

  const handleViewAppeal = (appealId: string) => {
    navigate(`/admin/appeals/${appealId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-96">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded-lg w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="flex-1 mx-32 p-6 bg-white dark:bg-gray-900">
        {/* Modern Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0  backdrop-blur-sm bg-white/95">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Appeal Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Review and manage user account appeals
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {statistics.total}
                  </div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {statistics.pending}
                  </div>
                  <div className="text-xs text-gray-500">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {statistics.approved}
                  </div>
                  <div className="text-xs text-gray-500">Approved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {statistics.rejected}
                  </div>
                  <div className="text-xs text-gray-500">Rejected</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* ✅ Modern Search & Filter Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Search & Filter
                </h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  <span>{showFilters ? "Hide" : "Show"} Filters</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or message..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                />
                {searching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        handleFilterChange("status", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="under_review">Under Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) =>
                        handleFilterChange("category", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Categories</option>
                      <option value="wrongful_block">Wrongful Block</option>
                      <option value="account_hacked">Account Hacked</option>
                      <option value="misunderstanding">Misunderstanding</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) =>
                        handleFilterChange("startDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) =>
                        handleFilterChange("endDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Clear Filters */}
              {(filters.search ||
                filters.status ||
                filters.category ||
                filters.startDate ||
                filters.endDate) && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-600">
                    {pagination.total} result{pagination.total !== 1 ? "s" : ""}{" "}
                    found
                  </span>
                  <button
                    onClick={clearFilters}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Clear Filters</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ✅ Modern Appeals Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {appeals.length === 0 && !loading ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No appeals found
                </h3>
                <p className="text-gray-600">
                  {filters.search || filters.status || filters.category
                    ? "No appeals match your current filters."
                    : "No appeals have been submitted yet."}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User Details
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Appeal Info
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appeals.map((appeal) => {
                        const statusConfig = getStatusConfig(appeal.status);
                        return (
                          <tr
                            key={appeal._id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">
                                    {appeal.firstName} {appeal.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500 flex items-center space-x-1">
                                    <Mail className="h-3 w-3" />
                                    <span>{appeal.email}</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  {appeal.category.replace("_", " ")}
                                </span>
                                {appeal.appealCount &&
                                  appeal.appealCount > 1 && (
                                    <div className="text-xs text-amber-600 font-medium">
                                      Re-appeal #{appeal.appealCount}
                                    </div>
                                  )}
                                <div className="text-xs text-gray-500 max-w-xs truncate">
                                  {appeal.appealMessage}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div
                                className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border-2 ${statusConfig.color}`}
                              >
                                {statusConfig.icon}
                                <span className="text-sm font-semibold capitalize">
                                  {appeal.status.replace("_", " ")}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-1 text-sm text-gray-500">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {new Date(
                                    appeal.submittedAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="text-xs text-gray-400">
                                {new Date(
                                  appeal.submittedAt
                                ).toLocaleTimeString()}
                              </div>
                            </td>
                            <td className="px-4 py-4  whitespace-nowrap">
                              <button
                                onClick={() => handleViewAppeal(appeal._id)}
                                className="inline-flex items-center space-x-2  px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-sm"
                              >
                                <Eye className="h-4 w-3" />
                                <span>Review</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* ✅ Modern Pagination */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing{" "}
                      {pagination.page === 1
                        ? 1
                        : (pagination.page - 1) * pagination.limit + 1}{" "}
                      to{" "}
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total
                      )}{" "}
                      of {pagination.total} results
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={!pagination.hasPreviousPage}
                        className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center space-x-1">
                        {Array.from(
                          { length: Math.min(5, pagination.totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (pagination.totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (pagination.page <= 3) {
                              pageNum = i + 1;
                            } else if (
                              pagination.page >=
                              pagination.totalPages - 2
                            ) {
                              pageNum = pagination.totalPages - 4 + i;
                            } else {
                              pageNum = pagination.page - 2 + i;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                  pageNum === pagination.page
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                        )}
                      </div>

                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={!pagination.hasNextPage}
                        className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// ✅ Debounce utility function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null;
  return ((...args: any[]) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

export default AppealsDashboard;
