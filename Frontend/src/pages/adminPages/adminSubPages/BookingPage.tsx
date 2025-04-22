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
import { Card } from "@/components/ui/card";
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
    <div className="flex min-h-screen ">
      <div className="p-6 mx-32 w-full bg-white ">
        <div className="flex flex-row mb-6">
          <div>
            <h1 className="text-2xl font-bold pt-4 mb-6">Bookings</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mb-0 ml-auto">
            {/* Static stats - replace with dynamic data if needed */}
            <Card className="p-2 h-20 w-60">
              <h3 className="text-sm text-gray-600 mb-0">Total Bookings</h3>
              <p className="text-3xl font-bold">22</p>
            </Card>
            <Card className="p-2 h-20">
              <h3 className="text-sm text-gray-600 mb-0">Pending</h3>
              <p className="text-3xl font-bold">11</p>
            </Card>
            <Card className="p-2 h-20">
              <h3 className="text-sm text-gray-600 mb-0">Completed</h3>
              <p className="text-3xl font-bold">11</p>
            </Card>
          </div>
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
  );
}
