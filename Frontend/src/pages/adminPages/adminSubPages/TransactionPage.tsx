import { useState } from "react";

import FilterHeader from "./FilterHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface BookedTransaction {
  date: string;
  invoiceId: string;
  transactionId: string;
  soldBy: string;
  buyer: string;
  mode: string;
  amount: string;
}

interface PendingTransaction {
  date: string;
  invoiceId: string;
  transactionId: string;
  soldBy: string;
  buyer: string;
  transferOn: string;
  amount: string;
}

interface CompletedTransaction {
  completedDate: string;
  invoiceId: string;
  soldBy: string;
  buyer: string;
  totalAmount: string;
  toMentor: string;
  profit: string;
}

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("booked");

  const bookedTransactions: BookedTransaction[] = [
    {
      date: "12/03/2025, 12:39 PM",
      invoiceId: "MO73883",
      transactionId: "xzykom343882723",
      soldBy: "Akshay",
      buyer: "Afsal",
      mode: "Credit card",
      amount: "₹ 3200",
    },
    {
      date: "12/03/2025, 12:39 PM",
      invoiceId: "MO73854",
      transactionId: "xzykom343882723",
      soldBy: "Akshay",
      buyer: "Harsh",
      mode: "UPI",
      amount: "₹ 340",
    },
    {
      date: "12/03/2025, 12:39 PM",
      invoiceId: "MO73844",
      transactionId: "xzykom343882723",
      soldBy: "Akshay",
      buyer: "Siva",
      mode: "Debit Card",
      amount: "₹355",
    },
  ];

  const pendingTransactions: PendingTransaction[] = [
    {
      date: "12/03/2025, 12:39 PM",
      invoiceId: "MO73883",
      transactionId: "xzykom343882723",
      soldBy: "Akshay",
      buyer: "Afsal",
      transferOn: "12/03/2025, 12:39 PM",
      amount: "₹ 3000",
    },
    {
      date: "12/03/2025, 12:39 PM",
      invoiceId: "MO73854",
      transactionId: "xzykom343882723",
      soldBy: "Akshay",
      buyer: "Harsh",
      transferOn: "12/03/2025, 12:39 PM",
      amount: "₹ 300",
    },
    {
      date: "12/03/2025, 12:39 PM",
      invoiceId: "MO73844",
      transactionId: "xzykom343882723",
      soldBy: "Akshay",
      buyer: "Siva",
      transferOn: "12/03/2025, 12:39 PM",
      amount: "₹300",
    },
  ];

  const completedTransactions: CompletedTransaction[] = [
    {
      completedDate: "12/03/2025, 12:39 PM",
      invoiceId: "MO73883",
      soldBy: "Akshay",
      buyer: "Afsal",
      totalAmount: "₹ 3200",
      toMentor: "₹ 3000",
      profit: "₹ 200",
    },
    {
      completedDate: "12/03/2025, 12:39 PM",
      invoiceId: "MO73854",
      soldBy: "Akshay",
      buyer: "Harsh",
      totalAmount: "₹ 340",
      toMentor: "₹ 300",
      profit: "₹ 40",
    },
    {
      completedDate: "12/03/2025, 12:39 PM",
      invoiceId: "MO73844",
      soldBy: "Akshay",
      buyer: "Siva",
      totalAmount: "₹355",
      toMentor: "₹300",
      profit: "₹55",
    },
  ];

  const soldByOptions = ["All", "Akshay", "Sreekuttan", "Anila"];
  const buyerOptions = ["All", "Afsal", "Harsh", "Siva"];
  const modeOptions = ["All", "Credit card", "UPI", "Debit Card"];

  return (
    <div className="flex flex-col mx-32 min-h-screen bg-white py-8">
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>
      <div className="flex-1 felx-col gap-8">
        <Tabs
          defaultValue="booked"
          className="flex"
          onValueChange={setActiveTab}
        >
          <TabsList className="flex flex-col h-fit bg-transparent p-0 w-40">
            <TabsTrigger
              value="booked"
              className={`py-2 px-4 text-left rounded-none ${
                activeTab === "booked"
                  ? "bg-gray-100 font-semibold"
                  : "bg-transparent"
              }`}
            >
              Booked
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className={`py-2 px-4 text-left rounded-none ${
                activeTab === "pending"
                  ? "bg-gray-100 font-semibold"
                  : "bg-transparent"
              }`}
            >
              Pending
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className={`py-2 px-4 text-left rounded-none ${
                activeTab === "completed"
                  ? "bg-gray-100 font-semibold"
                  : "bg-transparent"
              }`}
            >
              Completed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="booked" className="max-w-4xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>
                    <FilterHeader title="Sold By" options={soldByOptions} />
                  </TableHead>
                  <TableHead>
                    <FilterHeader title="Buyer" options={buyerOptions} />
                  </TableHead>
                  <TableHead>
                    <FilterHeader title="Mode" options={modeOptions} />
                  </TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookedTransactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.invoiceId}</TableCell>
                    <TableCell>{transaction.transactionId}</TableCell>
                    <TableCell>{transaction.soldBy}</TableCell>
                    <TableCell>{transaction.buyer}</TableCell>
                    <TableCell>{transaction.mode}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="pending" className="max-w-4xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>
                    <FilterHeader title="Sold By" options={soldByOptions} />
                  </TableHead>
                  <TableHead>
                    <FilterHeader title="Buyer" options={buyerOptions} />
                  </TableHead>
                  <TableHead>Transfer On</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingTransactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.invoiceId}</TableCell>
                    <TableCell>{transaction.transactionId}</TableCell>
                    <TableCell>{transaction.soldBy}</TableCell>
                    <TableCell>{transaction.buyer}</TableCell>
                    <TableCell>{transaction.transferOn}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="completed" className="max-w-4xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Completed Date</TableHead>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>
                    <FilterHeader title="Sold By" options={soldByOptions} />
                  </TableHead>
                  <TableHead>
                    <FilterHeader title="Buyer" options={buyerOptions} />
                  </TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>To Mentor</TableHead>
                  <TableHead>Profit</TableHead>
                  <TableHead>Transfer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedTransactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{transaction.completedDate}</TableCell>
                    <TableCell>{transaction.invoiceId}</TableCell>
                    <TableCell>{transaction.soldBy}</TableCell>
                    <TableCell>{transaction.buyer}</TableCell>
                    <TableCell>{transaction.totalAmount}</TableCell>
                    <TableCell>{transaction.toMentor}</TableCell>
                    <TableCell>{transaction.profit}</TableCell>
                    <TableCell>
                      <Button className="bg-black text-white text-xs py-1 px-3 h-auto">
                        Pay
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
