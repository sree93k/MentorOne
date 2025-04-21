import FilterHeader from "./FilterHeader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Booking {
  date: string;
  name: string;
  email: string;
  service: string;
  timeSlot: string;
  payment: string;
  status: string;
}

export default function BookingsPage() {
  const bookings: Booking[] = [
    {
      date: "12/03/2025",
      name: "Sreekuttan N",
      email: "sreekuttan1248@gmail.com",
      service: "1:1 Session",
      timeSlot: "12:44 pm",
      payment: "Success",
      status: "Pending",
    },
    {
      date: "12/03/2025",
      name: "Sreekuttan N",
      email: "sreekuttan1248@gmail.com",
      service: "Package",
      timeSlot: "12:44 pm",
      payment: "Success",
      status: "Completed",
    },
    {
      date: "12/03/2025",
      name: "Sreekuttan N",
      email: "sreekuttan1248@gmail.com",
      service: "1:1 Session",
      timeSlot: "12:44 pm",
      payment: "Success",
      status: "Pending",
    },
  ];

  const serviceOptions = ["All", "1:1 Session", "Package", "Group Session"];
  const paymentOptions = ["All", "Success", "Failed", "Pending"];
  const statusOptions = ["All", "Pending", "Completed", "Cancelled"];

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1">
        <div className="p-4">
          <div className="flex justify-end mb-4">
            <Button variant="outline" className="flex items-center gap-2">
              Sort
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email ID</TableHead>
                <TableHead>
                  <FilterHeader title="Service" options={serviceOptions} />
                </TableHead>
                <TableHead>Time Slot</TableHead>
                <TableHead>
                  <FilterHeader title="Payment" options={paymentOptions} />
                </TableHead>
                <TableHead>
                  <FilterHeader title="Status" options={statusOptions} />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking, index) => (
                <TableRow key={index}>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.name}</TableCell>
                  <TableCell>{booking.email}</TableCell>
                  <TableCell>{booking.service}</TableCell>
                  <TableCell>{booking.timeSlot}</TableCell>
                  <TableCell>{booking.payment}</TableCell>
                  <TableCell>{booking.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
