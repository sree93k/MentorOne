import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BillingItem {
  date: string;
  product: string;
  description: string;
  amount: string;
  paymentMode: string;
}

const billingData: BillingItem[] = [
  {
    date: "10/3/2025",
    product: "Namaste Javascript",
    description: "Tutorial, Akshay Saini",
    amount: "₹2300/-",
    paymentMode: "Credit Card",
  },
  {
    date: "1/3/2025",
    product: "Namste Node Js",
    description: "E Book, Akshay Saini",
    amount: "₹140/-",
    paymentMode: "UPI",
  },
  {
    date: "12/12/2024",
    product: "Mock Interview",
    description: "Harsh Surendren",
    amount: "₹490/-",
    paymentMode: "Net Banking",
  },
];

export default function MenteeBillingPage() {
  const totalBill = "₹5200/-";
  const totalItems = "3 Nos";

  return (
    <div className="mx-28 py-0">
      <h1 className="text-2xl font-bold mb-4">Billing</h1>

      <div className="flex flex-row gap-6 mb-6">
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-lg  font-medium">Total Bill</span>
                <span className="text-2xl font-bold ml-4">- {totalBill}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className=" text-lg font-medium">Purchased</span>
                <span className="text-2xl font-bold ml-4">- {totalItems}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Mode</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {billingData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.product}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>{item.paymentMode}</TableCell>
                <TableCell>
                  <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
