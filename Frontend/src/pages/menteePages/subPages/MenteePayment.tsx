// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Check } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { getAllMenteePayments } from "@/services/paymentServcie";

// interface Payment {
//   _id: string;
//   bookingId: string;
//   menteeId: string;
//   amount: number;
//   status: string;
//   transactionId: string;
//   createdAt: string;
//   serviceName: string;
//   mentorName: string;
//   paymentMode: string;
// }

// export default function MenteeBillingPage() {
//   const navigate = useNavigate();
//   const [payments, setPayments] = useState<Payment[]>([]);
//   const [totalAmount, setTotalAmount] = useState<number>(0);
//   const [totalCount, setTotalCount] = useState<number>(0);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchPayments = async () => {
//       try {
//         setIsLoading(true);
//         const accessToken = localStorage.getItem("accessToken");
//         if (!accessToken) {
//           navigate("/login");
//           return;
//         }

//         const paymentData = await getAllMenteePayments();
//         console.log("Payment data at page:", paymentData);

//         // Ensure paymentData is valid
//         if (!paymentData || typeof paymentData !== "object") {
//           throw new Error("Invalid payment data received");
//         }

//         setPayments(paymentData.payments || []);
//         setTotalAmount(paymentData.totalAmount || 0);
//         setTotalCount(paymentData.totalCount || 0);
//       } catch (err: any) {
//         console.error("Failed to fetch payments:", err);
//         setError(err.message || "Failed to load billing data");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPayments();
//   }, [navigate]);

//   if (isLoading) {
//     return <div className="mx-28 py-0">Loading...</div>;
//   }

//   if (error) {
//     return <div className="mx-28 py-0 text-red-500">{error}</div>;
//   }

//   return (
//     <div className="mx-28 py-0">
//       <h1 className="text-2xl font-bold mb-4">Billing</h1>

//       <div className="flex flex-row gap-6 mb-6">
//         <Card className="w-full">
//           <CardContent className="p-6">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <span className="text-lg font-medium">Total Bill</span>
//                 <span className="text-2xl font-bold ml-4">
//                   - ₹{(totalAmount || 0).toLocaleString("en-IN")}/-
//                 </span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="w-full">
//           <CardContent className="p-6">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <span className="text-lg font-medium">Purchased</span>
//                 <span className="text-2xl font-bold ml-4">
//                   - {totalCount || 0} Nos
//                 </span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Date</TableHead>
//               <TableHead>Product</TableHead>
//               <TableHead>Mentor</TableHead>
//               <TableHead>Amount</TableHead>
//               <TableHead>Payment Mode</TableHead>
//               <TableHead className="w-[50px]"></TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {payments.length > 0 ? (
//               payments.map((item) => (
//                 <TableRow key={item._id}>
//                   <TableCell>
//                     {new Date(item.createdAt).toLocaleDateString("en-GB", {
//                       day: "2-digit",
//                       month: "2-digit",
//                       year: "numeric",
//                     })}
//                   </TableCell>
//                   <TableCell>{item.serviceName}</TableCell>
//                   <TableCell>{item.mentorName}</TableCell>
//                   <TableCell>
//                     ₹{item.amount.toLocaleString("en-IN")}/-
//                   </TableCell>
//                   <TableCell>{item.paymentMode}</TableCell>
//                   <TableCell>
//                     <div
//                       className={`h-6 w-6 rounded-full flex items-center justify-center ${
//                         item.status === "completed"
//                           ? "bg-green-500"
//                           : item.status === "failed"
//                           ? "bg-red-500"
//                           : item.status === "refunded"
//                           ? "bg-yellow-500"
//                           : "bg-gray-500"
//                       }`}
//                     >
//                       <Check
//                         className={`h-4 w-4 ${
//                           item.status === "completed"
//                             ? "text-white"
//                             : "text-black"
//                         }`}
//                       />
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={6} className="text-center">
//                   No payments found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }
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
import { getAllMenteePayments } from "@/services/paymentServcie";

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
                <span className="text-lg font-medium">Total Bill</span>
                <span className="text-2xl font-bold ml-4">
                  - ₹{(totalAmount || 0).toLocaleString("en-IN")}/-
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-lg font-medium">Purchased</span>
                <span className="text-2xl font-bold ml-4">
                  - {totalCount || 0} Nos
                </span>
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
                <TableCell colSpan={6} className="text-center">
                  No payments found.
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
