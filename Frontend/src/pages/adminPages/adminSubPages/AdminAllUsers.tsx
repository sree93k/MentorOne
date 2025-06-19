import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { getAllusers } from "@/services/adminService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "flowbite-react";
import { HiCheck } from "react-icons/hi";
import { Users } from "lucide-react";
import TableSkeleton from "@/components/loadingPage/TabelSkeleton";
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mentorStatus?: string;
  role: string[];
  status: string;
  isBlocked?: boolean;
  mentorId?: { isApproved: string };
}

const AllUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalMentees, setTotalMentees] = useState(0);
  const [totalMentors, setTotalMentors] = useState(0);
  const [totalBoth, setTotalBoth] = useState(0);
  const [approvalPending, setApprovalPending] = useState(0);
  const limit = 10;
  const navigate = useNavigate();

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [roleFilter, statusFilter]);

  // Fetch users when page or filters change
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllusers(
          page,
          limit,
          roleFilter ?? undefined,
          statusFilter ?? undefined
        );
        if (response && response.status === 200) {
          const fetchedUsers = response.data.data.users;
          setUsers(fetchedUsers);
          setTotal(response.data.data.total);
          setTotalMentors(response.data.data.totalMentors);
          setTotalMentees(response.data.data.totalMentees);
          setTotalBoth(response.data.data.totalBoth);
          setApprovalPending(response.data.data.approvalPending);

          // Apply frontend filtering for role display
          const filtered = fetchedUsers.filter((user: User) => {
            if (!roleFilter) return true;
            if (roleFilter === "mentee")
              return (
                Array.isArray(user.role) &&
                user.role.includes("mentee") &&
                user.role.length === 1
              );
            if (roleFilter === "mentor")
              return (
                Array.isArray(user.role) &&
                user.role.includes("mentor") &&
                user.role.length === 1
              );
            if (roleFilter === "both")
              return (
                Array.isArray(user.role) &&
                user.role.includes("mentor") &&
                user.role.includes("mentee")
              );
            return true;
          });

          setFilteredUsers(filtered);
        } else {
          setError("Failed to fetch users. Please try again.");
        }
      } catch (err) {
        setError("An error occurred while fetching users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page, roleFilter, statusFilter]);

  const totalPages = Math.ceil(total / limit);

  // Generate pagination items
  const getPageItems = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      const pages = [1];
      if (page > 3) pages.push(0); // Ellipsis
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push(0); // Ellipsis
      if (totalPages > 1) pages.push(totalPages);
      return pages;
    }
  };

  const renderEmptyState = () => (
    <tr>
      <td colSpan={7} className="px-4 py-12 text-center">
        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <Users className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4 animate-bounce" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            No Users Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
            It looks like there are no users matching your criteria. Try
            adjusting the filters or invite new users to join!
          </p>
          <Button className="mt-4 bg-green-500 hover:bg-green-600 text-white">
            No New Users
          </Button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 mx-32 p-6 bg-white dark:bg-gray-900">
        {/* Header and Stats */}
        <div className="mb-3 flex items-start justify-between flex-wrap">
          <div className="mb-4 items-center pt-5">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Users List
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-0 ml-auto">
            <Card className="p-2 h-20 bg-gray-50 dark:bg-gray-800">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-0">
                Total Users
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {total}
              </p>
            </Card>
            <Card className="p-2 h-20 bg-gray-50 dark:bg-gray-800">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-0">
                Total Mentors
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {totalMentors}
              </p>
            </Card>
            <Card className="p-2 h-20 bg-gray-50 dark:bg-gray-800">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-0">
                Total Mentees
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {totalMentees}
              </p>
            </Card>
            <Card className="p-2 h-20 bg-gray-50 dark:bg-gray-800">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-0">
                Total Both
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {totalBoth}
              </p>
            </Card>
            <Card className="p-2 h-20 bg-gray-50 dark:bg-gray-800">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-0">
                Approval Pendings
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {approvalPending}
              </p>
            </Card>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-md border border-gray-200 dark:border-gray-700">
          {loading ? (
            <TableSkeleton />
          ) : error ? (
            <div className="p-4 text-center">
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
                <p className="text-red-500 dark:text-red-400 mt-2">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50 dark:bg-gray-800 text-left">
                    <th className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                      SI No
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                      Name
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                      Email ID
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                      Mentor Status
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1 text-gray-700 dark:text-gray-200">
                          Role
                          <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white dark:bg-gray-800">
                          <DropdownMenuItem
                            onClick={() => setRoleFilter(null)}
                            className="text-gray-700 dark:text-gray-200"
                          >
                            All
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setRoleFilter("mentee")}
                            className="text-gray-700 dark:text-gray-200"
                          >
                            Mentee
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setRoleFilter("mentor")}
                            className="text-gray-700 dark:text-gray-200"
                          >
                            Mentor
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setRoleFilter("both")}
                            className="text-gray-700 dark:text-gray-200"
                          >
                            Both
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1 text-gray-700 dark:text-gray-200">
                          Status
                          <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white dark:bg-gray-800">
                          <DropdownMenuItem
                            onClick={() => setStatusFilter(null)}
                            className="text-gray-700 dark:text-gray-200"
                          >
                            All
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setStatusFilter("Active")}
                            className="text-gray-700 dark:text-gray-200"
                          >
                            Active
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setStatusFilter("Blocked")}
                            className="text-gray-700 dark:text-gray-200"
                          >
                            Blocked
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0
                    ? renderEmptyState()
                    : filteredUsers.map((user, index) => (
                        <tr
                          key={user._id}
                          className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                            {(page - 1) * limit + index + 1}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                            {`${user.firstName} ${user.lastName}`}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                            {user.email}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {user.mentorId?.isApproved === "Pending" ? (
                              <Badge icon={HiCheck} color="purple">
                                Pending
                              </Badge>
                            ) : user.mentorId?.isApproved === "Rejected" ? (
                              <Badge icon={HiCheck} color="failure">
                                Rejected
                              </Badge>
                            ) : user.mentorId?.isApproved === "Approved" ? (
                              <Badge icon={HiCheck} color="success">
                                Approved
                              </Badge>
                            ) : (
                              <Badge icon={HiCheck} color="warning">
                                N/A
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                            {Array.isArray(user.role)
                              ? user.role.length === 2
                                ? "Both"
                                : user.role.includes("mentor")
                                ? "Mentor"
                                : user.role.includes("mentee")
                                ? "Mentee"
                                : "N/A"
                              : "N/A"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                            {user.isBlocked ? "Blocked" : "Active"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <Button
                              className="w-20 bg-blue-500 hover:bg-blue-600 text-white"
                              onClick={() =>
                                navigate(`/admin/userProfile/${user._id}`)
                              }
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && total > 0 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  {page > 1 ? (
                    <PaginationPrevious
                      onClick={() => setPage((prev) => prev - 1)}
                      className="cursor-pointer"
                    />
                  ) : (
                    <PaginationPrevious className="cursor-pointer pointer-events-none opacity-50" />
                  )}
                </PaginationItem>
                {getPageItems().map((pageNum, index) =>
                  pageNum === 0 ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setPage(pageNum)}
                        isActive={pageNum === page}
                        className="cursor-pointer text-gray-700 dark:text-gray-200"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  {page < totalPages ? (
                    <PaginationNext
                      onClick={() => setPage((prev) => prev + 1)}
                      className="cursor-pointer"
                    />
                  ) : (
                    <PaginationNext className="pointer-events-none opacity-50" />
                  )}
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllUsers;
