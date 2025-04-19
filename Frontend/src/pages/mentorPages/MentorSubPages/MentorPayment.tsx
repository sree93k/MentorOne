import { useState } from "react";
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

interface PaymentItem {
  date: string;
  serviceId: string;
  name: string;
  type: string;
  service?: string;
  transactionId?: string;
  paymentMode?: string;
  amount: string;
  status: string;
}

const paymentData: PaymentItem[] = [
  {
    date: "12/03/2025",
    serviceId: "SID001",
    name: "Sreekuttan N",
    type: "1:1 Call",
    service: "Mentoring Session",
    transactionId: "xjdskd33431",
    paymentMode: "Credit Card",
    amount: "₹5400",
    status: "Completed",
  },
  {
    date: "12/03/2025",
    serviceId: "SID002",
    name: "Sreekuttan N",
    type: "Group Session",
    service: "Workshop",
    transactionId: "xjdskd33432",
    paymentMode: "Credit Card",
    amount: "₹5400",
    status: "Pending",
  },
  {
    date: "12/03/2025",
    serviceId: "SID003",
    name: "Sreekuttan N",
    type: "1:1 Call",
    service: "Consulting",
    transactionId: "xjdskd33433",
    paymentMode: "Credit Card",
    amount: "₹5400",
    status: "Completed",
  },
];

export default function MentorPaymentsPage() {
  const totalEarnings = "₹5000";
  const pendingAmount = "₹4000";
  const [soldTypeFilter, setSoldTypeFilter] = useState("All");
  const [soldStatusFilter, setSoldStatusFilter] = useState("All");
  const [receivedTypeFilter, setReceivedTypeFilter] = useState("All");
  const [receivedStatusFilter, setReceivedStatusFilter] = useState("All");

  const uniqueTypes = ["All", ...new Set(paymentData.map((item) => item.type))];
  const uniqueStatuses = [
    "All",
    ...new Set(paymentData.map((item) => item.status)),
  ];

  const filteredSoldData = paymentData.filter(
    (item) =>
      (soldTypeFilter === "All" || item.type === soldTypeFilter) &&
      (soldStatusFilter === "All" || item.status === soldStatusFilter)
  );

  const filteredReceivedData = paymentData.filter(
    (item) =>
      (receivedTypeFilter === "All" || item.type === receivedTypeFilter) &&
      (receivedStatusFilter === "All" || item.status === receivedStatusFilter)
  );

  return (
    <div className="mx-32 py-6">
      <h1 className="text-2xl font-bold mb-4">Payments</h1>

      <div className="grid grid-cols-2 gap-6 mb-3">
        <Card>
          <CardContent className="p-3">
            <h2 className="text-lg font-medium mb-4">Total Earnings</h2>
            <p className="text-2xl font-bold">{totalEarnings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <h2 className="text-lg font-medium mb-4">Pendings</h2>
            <p className="text-2xl font-bold">{pendingAmount}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sold" className="w-full">
        {/* <TabsList className="grid grid-cols-2 gap-2 mb-10">
          <TabsTrigger
            value="sold"
            className="border border-gray-300 rounded-md data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:border-black hover:border-black transition-all duration-200 font-semibold p-4"
          >
            Sold
          </TabsTrigger>
          <TabsTrigger
            value="received"
            className="border border-gray-300 rounded-md data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:border-black hover:border-black transition-all duration-200 font-semibold p-4"
          >
            Received
          </TabsTrigger>
        </TabsList> */}

        <TabsList className="border-b w-full rounded-none justify-start h-auto p-0 bg-transparent mb-4">
          <TabsTrigger
            value="sold"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none px-8 py-2"
          >
            Sold
          </TabsTrigger>
          <TabsTrigger
            value="received"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none px-8 py-2"
          >
            Received
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sold">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Service ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>
                    <Select
                      onValueChange={setSoldTypeFilter}
                      value={soldTypeFilter}
                    >
                      <SelectTrigger className="border-none shadow-none p-0 h-auto">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {uniqueTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>
                    <Select
                      onValueChange={setSoldStatusFilter}
                      value={soldStatusFilter}
                    >
                      <SelectTrigger className="border-none shadow-none p-0 h-auto">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
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
                {filteredSoldData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.serviceId}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.service}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>{item.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="received">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Service ID</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>
                    <Select
                      onValueChange={setReceivedStatusFilter}
                      value={receivedStatusFilter}
                    >
                      <SelectTrigger className="border-none shadow-none p-0 h-auto">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
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
                {filteredReceivedData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.serviceId}</TableCell>
                    <TableCell>{item.transactionId}</TableCell>
                    <TableCell>{item.paymentMode}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>{item.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
