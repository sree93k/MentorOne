import React from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "5k", value: 20 },
  { name: "10k", value: 40 },
  { name: "15k", value: 45 },
  { name: "20k", value: 35 },
  { name: "25k", value: 85 },
  { name: "30k", value: 45 },
  { name: "35k", value: 55 },
  { name: "40k", value: 25 },
  { name: "45k", value: 65 },
  { name: "50k", value: 60 },
  { name: "55k", value: 55 },
  { name: "60k", value: 50 },
];

const AdminDashboard: React.FC = () => {
  return (
    <>
      {/* Main Content */}
      <div className="flex-1 ml-24 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Hi, Admin</h1>
          <Input type="search" placeholder="Search" className="w-64" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-sm text-gray-600 mb-2">Total Mentors</h3>
            <p className="text-3xl font-bold">33</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm text-gray-600 mb-2">Total Mentees</h3>
            <p className="text-3xl font-bold">540</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm text-gray-600 mb-2">Monthly Earnings</h3>
            <p className="text-3xl font-bold">₹12,300</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm text-gray-600 mb-2">Subscribers</h3>
            <p className="text-3xl font-bold">120</p>
          </Card>
        </div>

        {/* Sales Chart */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Sales Details</h2>
            <select className="border rounded-md px-3 py-1">
              <option>October</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ fill: "#2563eb" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </>
  );
};

export default AdminDashboard;
