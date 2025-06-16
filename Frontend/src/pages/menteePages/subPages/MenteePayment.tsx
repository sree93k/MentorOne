import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import {
  getAllMenteePayments,
  getMenteeWallet,
} from "@/services/paymentServcie";
import { CreditCard } from "lucide-react";
interface Payment {
  _id: string;
  bookingId: string;
  menteeId: string;
  amount: number;
  status: string;
  transactionId: string;
  createdAt: string;
  serviceName: string;
  mentorName: string;
  paymentMode: string;
}

export default function MenteeBillingPage() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [wallet, setWallet] = useState(0);
  const paymentsPerPage = 10;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          navigate("/login");
          return;
        }

        const paymentData = await getAllMenteePayments(
          currentPage,
          paymentsPerPage
        );

        const walletData = await getMenteeWallet(currentPage, paymentsPerPage);

        console.log("WALLET DATA.  >>> ", walletData);

        console.log("Payment data at page:", paymentData);

        if (!paymentData || typeof paymentData !== "object") {
          throw new Error("Invalid payment data received");
        }

        setPayments(paymentData.payments || []);
        setTotalAmount(paymentData.totalAmount || 0);
        setTotalCount(paymentData.totalCount || 0);
      } catch (err: any) {
        console.error("Failed to fetch payments:", err);
        setError(err.message || "Failed to load billing data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [navigate, currentPage]);

  const totalPages = Math.ceil(totalCount / paymentsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return <div className="mx-28 py-0">Loading...</div>;
  }

  if (error) {
    return <div className="mx-28 py-0 text-red-500">{error}</div>;
  }

  return (
    <div className="mx-28 py-0">
      <h1 className="text-2xl font-bold mb-4">Billing</h1>

      <div className="flex flex-row gap-6 mb-6">
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="flex flex-col text-lg font-medium">
                  Total Bill
                </span>
                <span className="text-2xl font-bold ml-0">
                  ₹{(totalAmount || 0).toLocaleString("en-IN")}/-
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="flex flex-col text-lg font-medium">
                  Purchased
                </span>
                <span className="text-2xl font-bold ml-0">
                  {totalCount || 0} Nos
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="flex flex-col text-lg font-medium">
                  Wallet
                </span>
                <span className="text-2xl font-bold ml-0">₹{0}</span>
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
              <TableHead>Mentor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Mode</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {payments.length > 0 ? (
              payments.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{item.serviceName}</TableCell>
                  <TableCell>{item.mentorName}</TableCell>
                  <TableCell>
                    ₹{item.amount.toLocaleString("en-IN")}/-
                  </TableCell>
                  <TableCell>{item.paymentMode}</TableCell>
                  <TableCell>
                    {item.status === "completed"
                      ? "Success"
                      : item.status === "refunded"
                      ? "Refunded"
                      : item.status}
                  </TableCell>
                  <TableCell>
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center ${
                        item.status === "completed"
                          ? "bg-green-500"
                          : item.status === "failed"
                          ? "bg-red-500"
                          : item.status === "refunded"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                      }`}
                    >
                      <Check
                        className={`h-4 w-4 ${
                          item.status === "completed"
                            ? "text-white"
                            : "text-black"
                        }`}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg p-6 animate-fade-in shadow-sm">
                    <div className="relative mb-4">
                      <CreditCard className="w-16 h-16 text-gray-400 animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 border-2 border-gray-200 rounded-full animate-pulse opacity-50"></div>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      No Payments Found
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 max-w-sm text-center">
                      You haven't made any payments yet. Book a session with a
                      mentor to get started!
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
                      onClick={() => navigate("/seeker/mentors")}
                    >
                      Explore Mentors
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalCount > paymentsPerPage && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>
          {[...Array(totalPages)].map((_, index) => (
            <Button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              variant={currentPage === index + 1 ? "default" : "outline"}
            >
              {index + 1}
            </Button>
          ))}
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
