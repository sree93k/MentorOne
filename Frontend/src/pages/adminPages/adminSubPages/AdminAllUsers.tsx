// // src/pages/AllUsers.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ChevronDown } from "lucide-react";
// import { getAllusers } from "@/services/adminService"; // Adjust import path
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
// import { HiCheck, HiClock } from "react-icons/hi";
// // Define the User interface based on backend data (excluding password)
// interface User {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   mentorStatus?: string;
//   role: string;
//   status: string;
// }

// const AllUsers: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [mentor, setMentor] = useState([]);
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
//   const [limit] = useState(10); // Fixed number of users per page
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
//         console.log("all users list at page1", response);
//         console.log("all users list at page2", response?.data);
//         console.log("all users list at page3", response?.data?.data.users);
//         if (response && response.status === 200) {
//           const fetchedUsers = response.data.data.users;
//           setUsers(fetchedUsers);
//           setTotal(response.data.data.total);
//           setMentor(response.data.data.mentorData);
//           // Assuming backend returns { users: User[], total: number }
//           // setUsers(response.data.data.users);
//           // setTotal(response.data.data.total);
//           // setMentor(response.data.data.mentorData);

//           // Filter and count mentors, mentees, and pending approvals
//           // const mentors = fetchedUsers.filter((user) => user.mentorId);
//           // const mentees = fetchedUsers.filter((user) => user.menteeId);
//           // const both = fetchedUsers.filter(
//           //   (user) => user.menteeId && user.mentorId
//           // );
//           // const pendingMentors = mentors.filter(
//           //   (user) => user.mentorId?.isApproved === "Pending"
//           // );
//           const mentors = fetchedUsers.filter(
//             (user) => user.role?.includes("mentor") && user.role.length === 1
//           );
//           const mentees = fetchedUsers.filter(
//             (user) => user.role?.includes("mentee") && user.role.length === 1
//           );
//           // const both = fetchedUsers.filter(
//           //   (user) =>
//           //     Array.isArray(user.role) &&
//           //     user.role.includes("mentor") &&
//           //     user.role.includes("mentee")
//           // );
//           const both = fetchedUsers.filter(
//             (user) => Array.isArray(user.role) && user.role.length === 2
//           );

//           const pendingMentors = mentors.filter(
//             (user) => user.mentorId?.isApproved === "Pending"
//           );

//           setTotalMentors(mentors.length);
//           setTotalMentees(mentees.length);
//           setTotalBoth(both.length);
//           setApprovalPending(pendingMentors.length);
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

//   useEffect(() => {
//     const mentors = users.filter(
//       (user) => user.role?.includes("mentor") && user.role.length === 1
//     );
//     const mentees = users.filter(
//       (user) => user.role?.includes("mentee") && user.role.length === 1
//     );
//     // const both = fetchedUsers.filter(
//     //   (user) =>
//     //     Array.isArray(user.role) &&
//     //     user.role.includes("mentor") &&
//     //     user.role.includes("mentee")
//     // );
//     const both = users.filter(
//       (user) => Array.isArray(user.role) && user.role.length === 2
//     );

//     console.log("mentees filter", mentees);
//     console.log("mentors filter", mentors);
//     console.log("both filter", both);
//   });
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

//   return (
//     <div className="flex min-h-screen ">
//       <main className="flex-1 mx-32 p-6 bg-white ">
//         {/* Header and Stats */}
//         <div className="mb-3 flex items-start justify-between flex-wrap ">
//           <div className="mb-4 items-center pt-5">
//             <h1 className="text-2xl font-bold">Users List</h1>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-0 ml-auto">
//             {/* Static stats - replace with dynamic data if needed */}
//             <Card className="p-2 h-20">
//               <h3 className="text-sm text-gray-600 mb-0">Total Users</h3>
//               <p className="text-3xl font-bold">{total}</p>
//             </Card>
//             <Card className="p-2 h-20">
//               <h3 className="text-sm text-gray-600 mb-0">Total Mentors</h3>
//               <p className="text-3xl font-bold">{totalMentors}</p>
//             </Card>
//             <Card className="p-2 h-20">
//               <h3 className="text-sm text-gray-600 mb-0">Total Mentees</h3>
//               <p className="text-3xl font-bold">{totalMentees}</p>
//             </Card>
//             <Card className="p-2 h-20">
//               <h3 className="text-sm text-gray-600 mb-0">Total Both</h3>
//               <p className="text-3xl font-bold">{totalMentees}</p>
//             </Card>
//             <Card className="p-2 h-20">
//               <h3 className="text-sm text-gray-600 mb-0">Approval Pendings</h3>
//               <p className="text-3xl font-bold">{approvalPending}</p>
//             </Card>
//           </div>
//         </div>

//         {/* Users Table */}
//         <div className="rounded-md border">
//           {loading ? (
//             <div className="p-4 text-center">Loading...</div>
//           ) : error ? (
//             <div className="p-4 text-center text-red-500">{error}</div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b bg-gray-50 text-left">
//                     <th className="px-4 py-3 text-sm font-medium">SI No</th>
//                     <th className="px-4 py-3 text-sm font-medium">Name</th>
//                     <th className="px-4 py-3 text-sm font-medium">Email ID</th>
//                     <th className="px-4 py-3 text-sm font-medium">
//                       Mentor Status
//                     </th>
//                     <th className="px-4 py-3 text-sm font-medium">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger className="flex items-center gap-1">
//                           Role
//                           <ChevronDown className="h-4 w-4" />
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent className="bg-white">
//                           <DropdownMenuItem onClick={() => setRoleFilter(null)}>
//                             All
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => setRoleFilter("mentee")}
//                           >
//                             Mentee
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => setRoleFilter("mentor")}
//                           >
//                             Mentor
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => setRoleFilter("both")}
//                           >
//                             Both
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </th>
//                     <th className="px-4 py-3 text-sm font-medium">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger className="flex items-center gap-1">
//                           Status
//                           <ChevronDown className="h-4 w-4" />
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent className="bg-white">
//                           <DropdownMenuItem
//                             onClick={() => setStatusFilter(null)}
//                           >
//                             All
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => setStatusFilter("Active")}
//                           >
//                             Active
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => setStatusFilter("Blocked")}
//                           >
//                             Blocked
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </th>
//                     <th className="px-4 py-3 text-sm font-medium">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.length === 0 ? (
//                     <tr>
//                       <td colSpan={7} className="px-4 py-3 text-center">
//                         No users found
//                       </td>
//                     </tr>
//                   ) : (
//                     users.map((user, index) => (
//                       <tr key={user._id} className="border-b">
//                         <td className="px-4 py-3 text-sm">
//                           {(page - 1) * limit + index + 1}
//                         </td>
//                         <td className="px-4 py-3 text-sm">
//                           {`${user.firstName} ${user.lastName}`}
//                         </td>
//                         <td className="px-4 py-3 text-sm">{user.email}</td>
//                         <td className="px-4 py-3 text-sm">
//                           {/* {user?.mentorId?.isApproved || "N/A"} */}
//                           {user?.mentorId?.isApproved === "Pending" ? (
//                             <Badge icon={HiCheck} color="purple">
//                               Pending
//                             </Badge>
//                           ) : user?.mentorId?.isApproved === "Rejected" ? (
//                             <Badge icon={HiCheck} color="failure">
//                               Rejected
//                             </Badge>
//                           ) : user?.mentorId?.isApproved === "Approved" ? (
//                             <Badge icon={HiCheck} color="success">
//                               Approved
//                             </Badge>
//                           ) : (
//                             <Badge icon={HiCheck} color="warning" className="">
//                               N/A
//                             </Badge>
//                           )}
//                         </td>
//                         {/* <td className="px-4 py-3 text-sm">{user.role}</td> */}
//                         <td className="px-4 py-3 text-sm">
//                           {Array.isArray(user.role)
//                             ? user.role.length === 2
//                               ? "Both"
//                               : user.role.includes("mentor")
//                               ? "Mentor"
//                               : user.role.includes("mentee")
//                               ? "Mentee"
//                               : "N/A"
//                             : user.role}
//                         </td>
//                         <td className="px-4 py-3 text-sm">
//                           {user?.isBlocked ? "Blocked" : "Active"}
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
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         {!loading && !error && total > 0 && (
//           <div className="mt-4">
//             <Pagination>
//               <PaginationContent>
//                 <PaginationItem>
//                   {page > 1 ? (
//                     <PaginationPrevious
//                       onClick={() => setPage((prev) => prev - 1)}
//                       className="cursor-pointer"
//                     />
//                   ) : (
//                     <PaginationPrevious className="cursor-pointer pointer-events-none opacity-50" />
//                   )}
//                 </PaginationItem>
//                 {getPageItems().map((pageNum, index) =>
//                   pageNum === 0 ? (
//                     <PaginationItem key={`ellipsis-${index}`}>
//                       <PaginationEllipsis />
//                     </PaginationItem>
//                   ) : (
//                     <PaginationItem key={pageNum}>
//                       <PaginationLink
//                         onClick={() => setPage(pageNum)}
//                         isActive={pageNum === page}
//                         className="cursor-pointer"
//                       >
//                         {pageNum}
//                       </PaginationLink>
//                     </PaginationItem>
//                   )
//                 )}
//                 <PaginationItem>
//                   {page < totalPages ? (
//                     <PaginationNext
//                       onClick={() => setPage((prev) => prev + 1)}
//                       className="cursor-pointer"
//                     />
//                   ) : (
//                     <PaginationNext className=" pointer-events-none opacity-50" />
//                   )}
//                 </PaginationItem>
//               </PaginationContent>
//             </Pagination>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default AllUsers;
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
  const [mentor, setMentor] = useState([]);
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
        // Pass roleFilter as-is to backend
        const response = await getAllusers(
          page,
          limit,
          roleFilter ?? undefined,
          statusFilter ?? undefined
        );
        console.log("all users list", response?.data?.data);
        if (response && response.status === 200) {
          const fetchedUsers = response.data.data.users;
          setUsers(fetchedUsers);
          setTotal(response.data.data.total);
          setMentor(response.data.data.mentorData);

          // Apply frontend filtering to ensure correct role display
          const filtered = fetchedUsers.filter((user: User) => {
            if (!roleFilter) return true; // Show all users
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

          // Calculate stats based on fetchedUsers (not filtered)
          const mentors = fetchedUsers.filter(
            (user: User) =>
              Array.isArray(user.role) &&
              user.role.includes("mentor") &&
              user.role.length === 1
          );
          const mentees = fetchedUsers.filter(
            (user: User) =>
              Array.isArray(user.role) &&
              user.role.includes("mentee") &&
              user.role.length === 1
          );
          const both = fetchedUsers.filter(
            (user: User) =>
              Array.isArray(user.role) &&
              user.role.includes("mentor") &&
              user.role.includes("mentee")
          );
          const pendingMentors = mentors.filter(
            (user: User) => user.mentorId?.isApproved === "Pending"
          );

          setTotalMentors(mentors.length);
          setTotalMentees(mentees.length);
          setTotalBoth(both.length);
          setApprovalPending(pendingMentors.length);
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

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 mx-32 p-6 bg-white">
        {/* Header and Stats */}
        <div className="mb-3 flex items-start justify-between flex-wrap">
          <div className="mb-4 items-center pt-5">
            <h1 className="text-2xl font-bold">Users List</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-0 ml-auto">
            <Card className="p-2 h-20">
              <h3 className="text-sm text-gray-600 mb-0">Total Users</h3>
              <p className="text-3xl font-bold">{total}</p>
            </Card>
            <Card className="p-2 h-20">
              <h3 className="text-sm text-gray-600 mb-0">Total Mentors</h3>
              <p className="text-3xl font-bold">{totalMentors}</p>
            </Card>
            <Card className="p-2 h-20">
              <h3 className="text-sm text-gray-600 mb-0">Total Mentees</h3>
              <p className="text-3xl font-bold">{totalMentees}</p>
            </Card>
            <Card className="p-2 h-20">
              <h3 className="text-sm text-gray-600 mb-0">Total Both</h3>
              <p className="text-3xl font-bold">{totalBoth}</p>
            </Card>
            <Card className="p-2 h-20">
              <h3 className="text-sm text-gray-600 mb-0">Approval Pendings</h3>
              <p className="text-3xl font-bold">{approvalPending}</p>
            </Card>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-md border">
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50 text-left">
                    <th className="px-4 py-3 text-sm font-medium">SI No</th>
                    <th className="px-4 py-3 text-sm font-medium">Name</th>
                    <th className="px-4 py-3 text-sm font-medium">Email ID</th>
                    <th className="px-4 py-3 text-sm font-medium">
                      Mentor Status
                    </th>
                    <th className="px-4 py-3 text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1">
                          Role
                          <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white">
                          <DropdownMenuItem onClick={() => setRoleFilter(null)}>
                            All
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setRoleFilter("mentee")}
                          >
                            Mentee
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setRoleFilter("mentor")}
                          >
                            Mentor
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setRoleFilter("both")}
                          >
                            Both
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </th>
                    <th className="px-4 py-3 text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1">
                          Status
                          <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white">
                          <DropdownMenuItem
                            onClick={() => setStatusFilter(null)}
                          >
                            All
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setStatusFilter("Active")}
                          >
                            Active
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setStatusFilter("Blocked")}
                          >
                            Blocked
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </th>
                    <th className="px-4 py-3 text-sm font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-3 text-center">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <tr key={user._id} className="border-b">
                        <td className="px-4 py-3 text-sm">
                          {(page - 1) * limit + index + 1}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {`${user.firstName} ${user.lastName}`}
                        </td>
                        <td className="px-4 py-3 text-sm">{user.email}</td>
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
                        <td className="px-4 py-3 text-sm">
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
                        <td className="px-4 py-3 text-sm">
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
                    ))
                  )}
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
                        className="cursor-pointer"
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
