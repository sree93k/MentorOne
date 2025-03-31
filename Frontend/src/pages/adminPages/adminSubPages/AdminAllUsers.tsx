"use client";

import { useState } from "react";
import { Link } from "react-router-dom"; // Use React Router instead of Next.js Link
import { ArrowLeft, ChevronDown, LogOut, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
// Sample data
const users = [
  {
    id: 1,
    name: "Sreekuttan N",
    email: "sreekuttan@gmail.com",
    mentorStatus: "",
    role: "Mentee",
    status: "Active",
  },
  {
    id: 2,
    name: "Jasna Jaffer",
    email: "jasna@gmail.com",
    mentorStatus: "Pending",
    role: "Mentee",
    status: "Active",
  },
  {
    id: 3,
    name: "Jasna Jaffer",
    email: "jasna@gmail.com",
    mentorStatus: "",
    role: "Mentor",
    status: "Block",
  },
  {
    id: 4,
    name: "Jasna Jaffer",
    email: "jasna@gmail.com",
    mentorStatus: "",
    role: "Both",
    status: "Active",
  },
  {
    id: 5,
    name: "Jasna Jaffer",
    email: "jasna@gmail.com",
    mentorStatus: "Pending",
    role: "Mentee",
    status: "Active",
  },
];

const AllUsers: React.FC = () => {
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const navigate = useNavigate();
  // Filter users based on selected filters
  const filteredUsers = users.filter((user) => {
    if (roleFilter && user.role !== roleFilter) return false;
    if (statusFilter && user.status !== statusFilter) return false;
    return true;
  });

  function EditButton() {
    navigate("/admin/userProfile");
  }

  return (
    <div className="flex min-h-screen pl-24">
      {/* Main content */}
      <main className="flex-1 max-w-full p-6">
        <div className="p-6">
          <div className="mb-6 flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <h1 className="ml-4 text-2xl font-semibold">Users</h1>
          </div>

          <div className="rounded-md border">
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
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setRoleFilter(null)}>
                            All
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setRoleFilter("Mentee")}
                          >
                            Mentee
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setRoleFilter("Mentor")}
                          >
                            Mentor
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setRoleFilter("Both")}
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
                        <DropdownMenuContent>
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
                            onClick={() => setStatusFilter("Block")}
                          >
                            Block
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </th>
                    <th className="px-4 py-3 text-sm font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="px-4 py-3 text-sm">{user.id}</td>
                      <td className="px-4 py-3 text-sm">{user.name}</td>
                      <td className="px-4 py-3 text-sm">{user.email}</td>
                      <td className="px-4 py-3 text-sm">{user.mentorStatus}</td>
                      <td className="px-4 py-3 text-sm">{user.role}</td>
                      <td className="px-4 py-3 text-sm">{user.status}</td>
                      <td className="px-4 py-3 text-sm">
                        {/* <Link to={`/admin/userProfile/`}> */}
                        <Button
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={() => EditButton()}
                        >
                          Edit
                        </Button>
                        {/* </Link> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AllUsers;
