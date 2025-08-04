// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ChevronDown } from "lucide-react";
// import { getAllusers } from "@/services/adminService";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import { Badge } from "flowbite-react";
// import { HiCheck } from "react-icons/hi";
// import { Users } from "lucide-react";
// import TableSkeleton from "@/components/loadingPage/TabelSkeleton";
// interface User {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   mentorStatus?: string;
//   role: string[];
//   status: string;
//   isBlocked?: boolean;
//   mentorId?: { isApproved: string };
// }

// const AllUsers: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [roleFilter, setRoleFilter] = useState<string | null>(null);
//   const [statusFilter, setStatusFilter] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [totalMentees, setTotalMentees] = useState(0);
//   const [totalMentors, setTotalMentors] = useState(0);
//   const [totalBoth, setTotalBoth] = useState(0);
//   const [approvalPending, setApprovalPending] = useState(0);
//   const limit = 10;
//   const navigate = useNavigate();

//   // Reset page to 1 when filters change
//   useEffect(() => {
//     setPage(1);
//   }, [roleFilter, statusFilter]);

//   // Fetch users when page or filters change
//   useEffect(() => {
//     const fetchUsers = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await getAllusers(
//           page,
//           limit,
//           roleFilter ?? undefined,
//           statusFilter ?? undefined
//         );
//         if (response && response.status === 200) {
//           console.log("Users response", response.data.data);

//           const fetchedUsers = response.data.data.users;

//           setUsers(fetchedUsers);
//           setTotal(response.data.data.total);
//           setTotalMentors(response.data.data.totalMentors);
//           setTotalMentees(response.data.data.totalMentees);
//           setTotalBoth(response.data.data.totalBoth);
//           setApprovalPending(response.data.data.approvalPending);

//           // Apply frontend filtering for role display
//           const filtered = fetchedUsers.filter((user: User) => {
//             if (!roleFilter) return true;
//             if (roleFilter === "mentee")
//               return (
//                 Array.isArray(user.role) &&
//                 user.role.includes("mentee") &&
//                 user.role.length === 1
//               );
//             if (roleFilter === "mentor")
//               return (
//                 Array.isArray(user.role) &&
//                 user.role.includes("mentor") &&
//                 user.role.length === 1
//               );
//             if (roleFilter === "both")
//               return (
//                 Array.isArray(user.role) &&
//                 user.role.includes("mentor") &&
//                 user.role.includes("mentee")
//               );
//             return true;
//           });

//           setFilteredUsers(filtered);
//         } else {
//           setError("Failed to fetch users. Please try again.");
//         }
//       } catch (err) {
//         setError("An error occurred while fetching users.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, [page, roleFilter, statusFilter]);

//   const totalPages = Math.ceil(total / limit);

//   // Generate pagination items
//   const getPageItems = () => {
//     if (totalPages <= 5) {
//       return Array.from({ length: totalPages }, (_, i) => i + 1);
//     } else {
//       const pages = [1];
//       if (page > 3) pages.push(0); // Ellipsis
//       for (
//         let i = Math.max(2, page - 1);
//         i <= Math.min(totalPages - 1, page + 1);
//         i++
//       ) {
//         pages.push(i);
//       }
//       if (page < totalPages - 2) pages.push(0); // Ellipsis
//       if (totalPages > 1) pages.push(totalPages);
//       return pages;
//     }
//   };

//   const renderEmptyState = () => (
//     <tr>
//       <td colSpan={7} className="px-4 py-12 text-center">
//         <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
//           <Users className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4 animate-bounce" />
//           <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
//             No Users Found
//           </h2>
//           <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
//             It looks like there are no users matching your criteria. Try
//             adjusting the filters or invite new users to join!
//           </p>
//           <Button className="mt-4 bg-green-500 hover:bg-green-600 text-white">
//             No New Users
//           </Button>
//         </div>
//       </td>
//     </tr>
//   );

//   return (
//     <div className="flex-1 ml-24 p-8 bg-white">
//       {/* Header and Stats */}
//       <div className="mb-3 flex items-start justify-between flex-wrap">
//         <div className="mb-4 items-center pt-5">
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//             Users List
//           </h1>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-0 ml-auto">
//           <Card className="p-2 h-20 bg-gray-50 dark:bg-gray-800">
//             <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-0">
//               Total Users
//             </h3>
//             <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//               {total}
//             </p>
//           </Card>
//           <Card className="p-2 h-20 bg-gray-50 dark:bg-gray-800">
//             <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-0">
//               Total Mentors
//             </h3>
//             <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//               {totalMentors}
//             </p>
//           </Card>
//           <Card className="p-2 h-20 bg-gray-50 dark:bg-gray-800">
//             <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-0">
//               Total Mentees
//             </h3>
//             <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//               {totalMentees}
//             </p>
//           </Card>
//           <Card className="p-2 h-20 bg-gray-50 dark:bg-gray-800">
//             <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-0">
//               Total Both
//             </h3>
//             <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//               {totalBoth}
//             </p>
//           </Card>
//           <Card className="p-2 h-20 bg-gray-50 dark:bg-gray-800">
//             <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-0">
//               Approval Pendings
//             </h3>
//             <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//               {approvalPending}
//             </p>
//           </Card>
//         </div>
//       </div>

//       {/* Users Table */}
//       <div className="rounded-md border border-gray-200 dark:border-gray-700">
//         {loading ? (
//           <TableSkeleton />
//         ) : error ? (
//           <div className="p-4 text-center">
//             <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
//               <svg
//                 className="h-16 w-16 text-red-400 mb-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
//                 Something went wrong
//               </h2>
//               <p className="text-red-500 dark:text-red-400 mt-2">{error}</p>
//               <Button
//                 onClick={() => window.location.reload()}
//                 className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
//               >
//                 Try Again
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b bg-gray-50 dark:bg-gray-800 text-left">
//                   <th className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200">
//                     SI No
//                   </th>
//                   <th className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200">
//                     Name
//                   </th>
//                   <th className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200">
//                     Email ID
//                   </th>
//                   <th className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200">
//                     Mentor Status
//                   </th>
//                   <th className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger className="flex items-center gap-1 text-gray-700 dark:text-gray-200">
//                         Role
//                         <ChevronDown className="h-4 w-4" />
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent className="bg-white dark:bg-gray-800">
//                         <DropdownMenuItem
//                           onClick={() => setRoleFilter(null)}
//                           className="text-gray-700 dark:text-gray-200"
//                         >
//                           All
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           onClick={() => setRoleFilter("mentee")}
//                           className="text-gray-700 dark:text-gray-200"
//                         >
//                           Mentee
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           onClick={() => setRoleFilter("mentor")}
//                           className="text-gray-700 dark:text-gray-200"
//                         >
//                           Mentor
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           onClick={() => setRoleFilter("both")}
//                           className="text-gray-700 dark:text-gray-200"
//                         >
//                           Both
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </th>
//                   <th className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger className="flex items-center gap-1 text-gray-700 dark:text-gray-200">
//                         Status
//                         <ChevronDown className="h-4 w-4" />
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent className="bg-white dark:bg-gray-800">
//                         <DropdownMenuItem
//                           onClick={() => setStatusFilter(null)}
//                           className="text-gray-700 dark:text-gray-200"
//                         >
//                           All
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           onClick={() => setStatusFilter("Active")}
//                           className="text-gray-700 dark:text-gray-200"
//                         >
//                           Active
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           onClick={() => setStatusFilter("Blocked")}
//                           className="text-gray-700 dark:text-gray-200"
//                         >
//                           Blocked
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </th>
//                   <th className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredUsers.length === 0
//                   ? renderEmptyState()
//                   : filteredUsers.map((user, index) => (
//                       <tr
//                         key={user._id}
//                         className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
//                       >
//                         <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
//                           {(page - 1) * limit + index + 1}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
//                           {`${user.firstName} ${user.lastName}`}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
//                           {user.email}
//                         </td>
//                         <td className="px-4 py-3 text-sm">
//                           {user.mentorId?.isApproved === "Pending" ? (
//                             <Badge icon={HiCheck} color="purple">
//                               Pending
//                             </Badge>
//                           ) : user.mentorId?.isApproved === "Rejected" ? (
//                             <Badge icon={HiCheck} color="failure">
//                               Rejected
//                             </Badge>
//                           ) : user.mentorId?.isApproved === "Approved" ? (
//                             <Badge icon={HiCheck} color="success">
//                               Approved
//                             </Badge>
//                           ) : (
//                             <Badge icon={HiCheck} color="warning">
//                               N/A
//                             </Badge>
//                           )}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
//                           {Array.isArray(user.role)
//                             ? user.role.length === 2
//                               ? "Both"
//                               : user.role.includes("mentor")
//                               ? "Mentor"
//                               : user.role.includes("mentee")
//                               ? "Mentee"
//                               : "N/A"
//                             : "N/A"}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
//                           {user.isBlocked ? "Blocked" : "Active"}
//                         </td>
//                         <td className="px-4 py-3 text-sm">
//                           <Button
//                             className="w-20 bg-blue-500 hover:bg-blue-600 text-white"
//                             onClick={() =>
//                               navigate(`/admin/userProfile/${user._id}`)
//                             }
//                           >
//                             Edit
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       {!loading && !error && total > 0 && (
//         <div className="mt-4">
//           <Pagination>
//             <PaginationContent>
//               <PaginationItem>
//                 {page > 1 ? (
//                   <PaginationPrevious
//                     onClick={() => setPage((prev) => prev - 1)}
//                     className="cursor-pointer"
//                   />
//                 ) : (
//                   <PaginationPrevious className="cursor-pointer pointer-events-none opacity-50" />
//                 )}
//               </PaginationItem>
//               {getPageItems().map((pageNum, index) =>
//                 pageNum === 0 ? (
//                   <PaginationItem key={`ellipsis-${index}`}>
//                     <PaginationEllipsis />
//                   </PaginationItem>
//                 ) : (
//                   <PaginationItem key={pageNum}>
//                     <PaginationLink
//                       onClick={() => setPage(pageNum)}
//                       isActive={pageNum === page}
//                       className="cursor-pointer text-gray-700 dark:text-gray-200"
//                     >
//                       {pageNum}
//                     </PaginationLink>
//                   </PaginationItem>
//                 )
//               )}
//               <PaginationItem>
//                 {page < totalPages ? (
//                   <PaginationNext
//                     onClick={() => setPage((prev) => prev + 1)}
//                     className="cursor-pointer"
//                   />
//                 ) : (
//                   <PaginationNext className="pointer-events-none opacity-50" />
//                 )}
//               </PaginationItem>
//             </PaginationContent>
//           </Pagination>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllUsers;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ArrowLeft,
  Users,
  Filter,
  Search,
  Download,
  UserPlus,
  TrendingUp,
  Activity,
} from "lucide-react";
import { getAllusers } from "@/services/adminService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [searchQuery, setSearchQuery] = useState("");
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
          console.log("Users response", response.data.data);

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

  const clearFilters = () => {
    setRoleFilter(null);
    setStatusFilter(null);
    setSearchQuery("");
    setPage(1);
  };

  const hasActiveFilters = roleFilter || statusFilter || searchQuery;

  const renderEmptyState = () => (
    <tr>
      <td colSpan={7} className="px-4 py-12 text-center">
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl border border-gray-200 p-8">
          <div className="bg-blue-100 rounded-full p-6 mb-4">
            <Users className="h-16 w-16 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Users Found
          </h2>
          <p className="text-gray-600 mb-6 max-w-md text-center">
            {hasActiveFilters
              ? "No users match your current filters. Try adjusting your search criteria."
              : "It looks like there are no users in the system yet. New users will appear here when they register!"}
          </p>
          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="flex-1 ml-24 p-8 bg-gradient-to-br bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Users Management
              </h1>
              <p className="text-gray-600 mt-1 font-medium">
                Manage and monitor all registered users
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Total Users
              </h3>
              <p className="text-3xl font-bold text-gray-900">{total}</p>
              <div className="flex items-center text-sm text-emerald-600 mt-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+12% this month</span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Total Mentors
              </h3>
              <p className="text-3xl font-bold text-gray-900">{totalMentors}</p>
              <div className="flex items-center text-sm text-purple-600 mt-2">
                <Activity className="w-4 h-4 mr-1" />
                <span>Expert users</span>
              </div>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Total Mentees
              </h3>
              <p className="text-3xl font-bold text-gray-900">{totalMentees}</p>
              <div className="flex items-center text-sm text-emerald-600 mt-2">
                <Activity className="w-4 h-4 mr-1" />
                <span>Learning users</span>
              </div>
            </div>
            <div className="bg-emerald-100 p-3 rounded-xl">
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Dual Role
              </h3>
              <p className="text-3xl font-bold text-gray-900">{totalBoth}</p>
              <div className="flex items-center text-sm text-amber-600 mt-2">
                <Activity className="w-4 h-4 mr-1" />
                <span>Mentor & Mentee</span>
              </div>
            </div>
            <div className="bg-amber-100 p-3 rounded-xl">
              <Users className="w-8 h-8 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Pending Approval
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {approvalPending}
              </p>
              <div className="flex items-center text-sm text-red-600 mt-2">
                <Activity className="w-4 h-4 mr-1" />
                <span>Needs review</span>
              </div>
            </div>
            <div className="bg-red-100 p-3 rounded-xl">
              <Users className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Search & Filter Users
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search by name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
            />
          </div>

          {/* Filter Badges */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-600">Active filters:</span>
              {roleFilter && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Role: {roleFilter}
                </span>
              )}
              {statusFilter && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  Status: {statusFilter}
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Search: "{searchQuery}"
                </span>
              )}
            </div>
          )}

          {/* Results Summary */}
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-blue-600">{total}</span> user
            {total !== 1 ? "s" : ""} found
          </div>
        </div>
      </div>

      {/* Enhanced Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-pink-50/30 rounded-2xl border border-red-200 p-8">
              <div className="bg-red-100 rounded-full p-6 mb-4">
                <svg
                  className="h-16 w-16 text-red-600"
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
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Something went wrong
              </h2>
              <p className="text-red-600 mb-6">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gradient-to-r from-gray-50 to-blue-50/30 text-left">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    #
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Mentor Status
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors">
                        Role
                        <ChevronDown className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
                        <DropdownMenuItem
                          onClick={() => setRoleFilter(null)}
                          className="text-gray-700 hover:bg-gray-50"
                        >
                          All Roles
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setRoleFilter("mentee")}
                          className="text-gray-700 hover:bg-gray-50"
                        >
                          👨‍🎓 Mentee
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setRoleFilter("mentor")}
                          className="text-gray-700 hover:bg-gray-50"
                        >
                          👨‍🏫 Mentor
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setRoleFilter("both")}
                          className="text-gray-700 hover:bg-gray-50"
                        >
                          🎯 Both
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors">
                        Status
                        <ChevronDown className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
                        <DropdownMenuItem
                          onClick={() => setStatusFilter(null)}
                          className="text-gray-700 hover:bg-gray-50"
                        >
                          All Status
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setStatusFilter("Active")}
                          className="text-gray-700 hover:bg-gray-50"
                        >
                          ✅ Active
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setStatusFilter("Blocked")}
                          className="text-gray-700 hover:bg-gray-50"
                        >
                          🚫 Blocked
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
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
                        className="border-b hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30 transition-all duration-200"
                      >
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                          {(page - 1) * limit + index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {`${user.firstName} ${user.lastName}`}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {user.mentorId?.isApproved === "Pending" ? (
                            <Badge icon={HiCheck} color="purple">
                              ⏳ Pending
                            </Badge>
                          ) : user.mentorId?.isApproved === "Rejected" ? (
                            <Badge icon={HiCheck} color="failure">
                              ❌ Rejected
                            </Badge>
                          ) : user.mentorId?.isApproved === "Approved" ? (
                            <Badge icon={HiCheck} color="success">
                              ✅ Approved
                            </Badge>
                          ) : (
                            <Badge icon={HiCheck} color="warning">
                              ➖ N/A
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              Array.isArray(user.role) && user.role.length === 2
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : Array.isArray(user.role) &&
                                  user.role.includes("mentor")
                                ? "bg-purple-100 text-purple-800 border border-purple-200"
                                : Array.isArray(user.role) &&
                                  user.role.includes("mentee")
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : "bg-gray-100 text-gray-800 border border-gray-200"
                            }`}
                          >
                            {Array.isArray(user.role)
                              ? user.role.length === 2
                                ? "🎯 Both"
                                : user.role.includes("mentor")
                                ? "👨‍🏫 Mentor"
                                : user.role.includes("mentee")
                                ? "👨‍🎓 Mentee"
                                : "❓ N/A"
                              : "❓ N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.isBlocked
                                ? "bg-red-100 text-red-800 border border-red-200"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            {user.isBlocked ? "🚫 Blocked" : "✅ Active"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md"
                            onClick={() =>
                              navigate(`/admin/userProfile/${user._id}`)
                            }
                          >
                            View Profile
                          </Button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Enhanced Pagination */}
      {!loading && !error && total > 0 && (
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {(page - 1) * limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(page * limit, total)}
              </span>{" "}
              of <span className="font-semibold text-gray-900">{total}</span>{" "}
              users
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  {page > 1 ? (
                    <PaginationPrevious
                      onClick={() => setPage((prev) => prev - 1)}
                      className="cursor-pointer hover:bg-blue-50"
                    />
                  ) : (
                    <PaginationPrevious className="cursor-not-allowed opacity-50" />
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
                        className={`cursor-pointer transition-colors ${
                          pageNum === page
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "text-gray-700 hover:bg-blue-50"
                        }`}
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
                      className="cursor-pointer hover:bg-blue-50"
                    />
                  ) : (
                    <PaginationNext className="cursor-not-allowed opacity-50" />
                  )}
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
