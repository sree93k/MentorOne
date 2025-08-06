import { useState, useEffect } from "react";
import {
  ChevronDown,
  CalendarX,
  Check,
  Search,
  Calendar,
  Users,
  Clock,
  TrendingUp,
  Filter,
  RotateCcw,
} from "lucide-react";

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

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      date: "12/15/2024",
      mentorName: "John Smith",
      menteeName: "Alice Johnson",
      service: "Career Guidance",
      type: "1:1 call",
      timeSlot: "10:00 AM",
      paymentStatus: "paid",
      bookingStatus: "confirmed",
    },
    {
      date: "12/16/2024",
      mentorName: "Sarah Davis",
      menteeName: "Bob Wilson",
      service: "Technical Interview Prep",
      type: "priority dm",
      timeSlot: "2:00 PM",
      paymentStatus: "paid",
      bookingStatus: "pending",
    },
    {
      date: "12/17/2024",
      mentorName: "Mike Brown",
      menteeName: "Carol Martinez",
      service: "Code Review",
      type: "digital product",
      timeSlot: "4:00 PM",
      paymentStatus: "paid",
      bookingStatus: "completed",
    },
  ]);
  const [total, setTotal] = useState(3);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [mentorFilter, setMentorFilter] = useState("");
  const [menteeFilter, setMenteeFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("confirmed");
  const [tab, setTab] = useState("confirmed");
  const [stats, setStats] = useState({ total: 3, pending: 1, completed: 1 });
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searching, setSearching] = useState(false);

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
    const matchesStatus = booking.bookingStatus === statusFilter;
    const matchesSearch = searchQuery
      ? booking.mentorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.menteeName.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return (
      matchesMentor &&
      matchesMentee &&
      matchesType &&
      matchesStatus &&
      matchesSearch
    );
  });

  const uniqueMentors = Array.from(
    new Set(bookings.map((b) => b.mentorName))
  ).sort();
  const uniqueMentees = Array.from(
    new Set(bookings.map((b) => b.menteeName))
  ).sort();
  const uniqueTypes = Array.from(new Set(bookings.map((b) => b.type))).sort();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "rescheduled":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "1-1call":
      case "1:1 call":
        return "📞";
      case "prioritydm":
      case "priority dm":
        return "💬";
      case "digitalproducts":
      case "digital product":
        return "📱";
      default:
        return "📋";
    }
  };

  const renderEmptyState = (tab: string) => (
    <tr>
      <td colSpan={7} className="text-center py-16">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
              <CalendarX className="h-12 w-12 text-indigo-500" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">0</span>
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              No {tab.charAt(0).toUpperCase() + tab.slice(1)} Bookings
            </h3>
            <p className="text-gray-500 max-w-md">
              {tab === "confirmed"
                ? "There are no confirmed bookings at the moment. New bookings will appear here once confirmed."
                : tab === "rescheduled"
                ? "No bookings have been rescheduled yet. Rescheduled sessions will be tracked here."
                : tab === "pending"
                ? "There are no pending bookings waiting for confirmation. Pending requests will show up here."
                : tab === "completed"
                ? "No bookings have been completed yet. Finished sessions will be listed here."
                : "No bookings have been cancelled. Cancelled sessions would appear in this section."}
            </p>
          </div>
          {tab !== "completed" && tab !== "cancelled" && (
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule New Booking
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex-1 ml-24 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Bookings Management
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor and manage all booking activities
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Bookings
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Pending
                </p>
                <p className="text-3xl font-bold text-amber-600">
                  {stats.pending}
                </p>
                <p className="text-xs text-amber-600 flex items-center mt-2">
                  <Clock className="h-3 w-3 mr-1" />
                  Awaiting confirmation
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Completed
                </p>
                <p className="text-3xl font-bold text-emerald-600">
                  {stats.completed}
                </p>
                <p className="text-xs text-emerald-600 flex items-center mt-2">
                  <Check className="h-3 w-3 mr-1" />
                  Successfully finished
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        {/* <div className="p-6 mb-8 bg-white border-0 shadow-lg rounded-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by mentor or mentee name..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex items-center gap-3">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Filters applied:{" "}
                {
                  [
                    mentorFilter,
                    menteeFilter,
                    typeFilter !== "All" ? typeFilter : null,
                  ].filter(Boolean).length
                }
              </span>
            </div>
          </div>
        </div> */}
        {/* Enhanced Search & Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Search & Filter Bookings
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
                placeholder="Search by mentor, mentee, or service..."
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                  {/* Service Type Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Service Type
                    </label>
                    <select
                      value={typeFilter}
                      onChange={(e) => handleTypeFilter(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all duration-300"
                    >
                      <option value="All">All Types</option>
                      {uniqueTypes.map((type) => (
                        <option key={type} value={type}>
                          {getTypeIcon(type)} {mapTypeToDisplay(type)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Results & Clear */}
            {(searchQuery ||
              mentorFilter ||
              menteeFilter ||
              (typeFilter && typeFilter !== "All")) && (
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
                    setTypeFilter("All");
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
        {/* Tabs and Table */}
        <div className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
            <div className="bg-white rounded-xl p-1 shadow-sm inline-flex">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => handleTabChange(status)}
                  className={`px-6 py-2 rounded-lg transition-all font-medium ${
                    tab === status
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="text-left text-gray-700 font-semibold py-4 px-6">
                    Date
                  </th>
                  <th className="text-left text-gray-700 font-semibold py-4 px-6">
                    <div className="relative group">
                      <button className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
                        Mentor Name
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <button
                          onClick={() => handleMentorFilter("")}
                          className="w-full text-left px-4 py-2 hover:bg-indigo-50 hover:text-indigo-700 first:rounded-t-xl"
                        >
                          All Mentors
                        </button>
                        {uniqueMentors.map((mentor) => (
                          <button
                            key={mentor}
                            onClick={() => handleMentorFilter(mentor)}
                            className="w-full text-left px-4 py-2 hover:bg-indigo-50 hover:text-indigo-700"
                          >
                            {mentor}
                          </button>
                        ))}
                      </div>
                    </div>
                  </th>
                  <th className="text-left text-gray-700 font-semibold py-4 px-6">
                    <div className="relative group">
                      <button className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
                        Mentee Name
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <button
                          onClick={() => handleMenteeFilter("")}
                          className="w-full text-left px-4 py-2 hover:bg-indigo-50 hover:text-indigo-700 first:rounded-t-xl"
                        >
                          All Mentees
                        </button>
                        {uniqueMentees.map((mentee) => (
                          <button
                            key={mentee}
                            onClick={() => handleMenteeFilter(mentee)}
                            className="w-full text-left px-4 py-2 hover:bg-indigo-50 hover:text-indigo-700"
                          >
                            {mentee}
                          </button>
                        ))}
                      </div>
                    </div>
                  </th>
                  <th className="text-left text-gray-700 font-semibold py-4 px-6">
                    <div className="relative group">
                      <button className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
                        Service Type
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <button
                          onClick={() => handleTypeFilter("All")}
                          className="w-full text-left px-4 py-2 hover:bg-indigo-50 hover:text-indigo-700 first:rounded-t-xl"
                        >
                          All Types
                        </button>
                        {uniqueTypes.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleTypeFilter(option)}
                            className="w-full text-left px-4 py-2 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2"
                          >
                            <span>{getTypeIcon(option)}</span>
                            {mapTypeToDisplay(option)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </th>
                  <th className="text-left text-gray-700 font-semibold py-4 px-6">
                    Service Name
                  </th>
                  <th className="text-left text-gray-700 font-semibold py-4 px-6">
                    Time Slot
                  </th>
                  <th className="text-left text-gray-700 font-semibold py-4 px-6">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center">
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  renderEmptyState(tab)
                ) : (
                  filteredBookings.map((booking, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                    >
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">
                          {booking.date}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {booking.mentorName.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">
                            {booking.mentorName}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {booking.menteeName.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">
                            {booking.menteeName}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">
                            {getTypeIcon(booking.type)}
                          </span>
                          <span className="text-gray-700">
                            {mapTypeToDisplay(booking.type)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-900 font-medium">
                          {booking.service}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">
                            {booking.timeSlot}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            booking.bookingStatus
                          )}`}
                        >
                          {booking.bookingStatus === "confirmed" && (
                            <Check className="h-3 w-3 mr-1" />
                          )}
                          {booking.bookingStatus.charAt(0).toUpperCase() +
                            booking.bookingStatus.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div className="flex space-x-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum =
                  Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      page === pageNum
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                        : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
