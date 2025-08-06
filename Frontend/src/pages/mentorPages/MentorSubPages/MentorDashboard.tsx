// import React, { useEffect, useState } from "react";
// import { Card } from "@/components/ui/card";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Pie, Doughnut, Bar, Line } from "react-chartjs-2";
// import { getBookingsByMentor } from "@/services/bookingService";
// import { getAllMentorPayments } from "@/services/paymentServcie";
// import { getAllServices } from "@/services/mentorService";
// import { getTestimonialsByMentor } from "@/services/testimonialService";
// import { getChatHistory } from "@/services/userServices";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store/store";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// // Interfaces remain unchanged
// interface Booking {
//   _id: string;
//   createdAt: string;
//   serviceId: { _id: string; type: string; title: string };
//   status: string;
//   mentorId: { _id: string; firstName: string; lastName: string };
//   menteeId: { _id: string; firstName: string; lastName: string; email: string };
//   bookingDate: string;
//   day: string;
//   startTime: string;
// }

// interface Payment {
//   _id: string;
//   createdAt: string;
//   amount: number;
//   total: number;
//   serviceDetails: { _id: string; title: string; type: string };
// }

// interface Service {
//   _id: string;
//   title: string;
//   type: "1-1Call" | "priorityDM" | "DigitalProducts";
//   stats?: {
//     views: number;
//     bookings: number;
//     earnings: number;
//     conversions: string;
//   };
// }

// interface Testimonial {
//   _id: string;
//   createdAt: string;
//   rating: number;
//   comment: string;
// }

// interface ChatUser {
//   id: string;
//   bookingId: string;
//   otherUserId?: string;
// }

// const MentorDashboard: React.FC = () => {
//   // State and useEffect logic remains unchanged
//   const [monthlyBookings, setMonthlyBookings] = useState<{
//     [key: string]: number[];
//   }>({});
//   const [yearlyData, setYearlyData] = useState<
//     { year: number; bookings: number; mentees: number }[]
//   >([]);
//   const [earningsBreakdown, setEarningsBreakdown] = useState<
//     { name: string; value: number }[]
//   >([]);
//   const [monthlyBookingsPayments, setMonthlyBookingsPayments] = useState<{
//     bookings: number[];
//     payments: number[];
//   }>({ bookings: Array(12).fill(0), payments: Array(12).fill(0) });
//   const [testimonialsData, setTestimonialsData] = useState<{
//     counts: number[];
//     ratings: number[];
//   }>({ counts: Array(12).fill(0), ratings: Array(12).fill(0) });
//   const [currentMonthBookings, setCurrentMonthBookings] = useState<number>(0);
//   const [currentMonthEarnings, setCurrentMonthEarnings] = useState<number>(0);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const { user } = useSelector((state: RootState) => state.user);
//   // const mentorId = localStorage.getItem("userId") || "unknown";
//   const mentorId = user?._id;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const currentYear = new Date().getFullYear();
//         const currentMonth = new Date().getMonth();

//         // Fetch bookings
//         const bookingsResponse = await getBookingsByMentor(mentorId, 1, 1000);
//         const bookings: Booking[] = Array.isArray(bookingsResponse.data)
//           ? bookingsResponse.data
//           : [];
//         const monthlyByService: { [key: string]: number[] } = {};
//         let monthBookings = 0;
//         bookings.forEach((booking) => {
//           const date = new Date(booking.createdAt);
//           if (date.getFullYear() === currentYear) {
//             const month = date.getMonth();
//             const serviceType = booking.serviceId?.type || "Unknown";
//             if (!monthlyByService[serviceType]) {
//               monthlyByService[serviceType] = Array(12).fill(0);
//             }
//             monthlyByService[serviceType][month] += 1;
//             if (month === currentMonth) {
//               monthBookings += 1;
//             }
//           }
//         });
//         setMonthlyBookings(monthlyByService);
//         setCurrentMonthBookings(monthBookings);

//         const yearlyMap: {
//           [key: number]: { bookings: number; mentees: Set<string> };
//         } = {};
//         bookings.forEach((item) => {
//           const year = new Date(item.createdAt).getFullYear();
//           if (!yearlyMap[year]) {
//             yearlyMap[year] = { bookings: 0, mentees: new Set() };
//           }
//           yearlyMap[year].bookings += 1;
//           yearlyMap[year].mentees.add(item.menteeId._id);
//         });
//         const yearlyData = Object.entries(yearlyMap)
//           .map(([year, data]) => ({
//             year: parseInt(year),
//             bookings: data.bookings,
//             mentees: data.mentees.size,
//           }))
//           .sort((a, b) => a.year - b.year);
//         setYearlyData(yearlyData);

//         // Fetch payments
//         const paymentsResponse = await getAllMentorPayments(1, 1000);
//         if (paymentsResponse && Array.isArray(paymentsResponse.payments)) {
//           const payments: Payment[] = paymentsResponse.payments;
//           const earningsByService: { [key: string]: number } = {};
//           let monthEarnings = 0;
//           const monthlyPayments = Array(12).fill(0);
//           payments.forEach((payment) => {
//             const date = new Date(payment.createdAt);
//             const serviceType = payment.serviceDetails?.type || "Unknown";
//             if (date.getFullYear() === currentYear) {
//               const month = date.getMonth();
//               monthlyPayments[month] += payment.total;
//               if (month === currentMonth) {
//                 monthEarnings += payment.total;
//               }
//             }
//             earningsByService[serviceType] =
//               (earningsByService[serviceType] || 0) + payment.total;
//           });
//           setCurrentMonthEarnings(monthEarnings);
//           setMonthlyBookingsPayments((prev) => ({
//             ...prev,
//             payments: monthlyPayments,
//           }));
//           setEarningsBreakdown(
//             Object.entries(earningsByService).map(([name, value]) => ({
//               name,
//               value,
//             }))
//           );
//         }

//         // Fetch services
//         const servicesResponse = await getAllServices({ page: 1, limit: 1000 });
//         if (servicesResponse && Array.isArray(servicesResponse.services)) {
//           const services: Service[] = servicesResponse.services;
//           setMonthlyBookings((prev) => {
//             const updatedBookings = { ...prev };
//             services.forEach((service) => {
//               const serviceType = service.type || "Unknown";
//               if (!updatedBookings[serviceType]) {
//                 updatedBookings[serviceType] = Array(12).fill(0);
//               }
//             });
//             return updatedBookings;
//           });
//         }

//         // Fetch testimonials
//         const testimonialsResponse = await getTestimonialsByMentor(1, 1000);
//         if (
//           testimonialsResponse &&
//           Array.isArray(testimonialsResponse.testimonials)
//         ) {
//           const testimonials: Testimonial[] = testimonialsResponse.testimonials;
//           const counts = Array(12).fill(0);
//           const ratings = Array(12).fill(0);
//           const ratingCounts = Array(12).fill(0);
//           testimonials.forEach((testimonial) => {
//             const date = new Date(testimonial.createdAt);
//             if (date.getFullYear() === currentYear) {
//               const month = date.getMonth();
//               counts[month] += 1;
//               ratings[month] += testimonial.rating;
//               ratingCounts[month] += 1;
//             }
//           });
//           const avgRatings = ratings.map((sum, i) =>
//             ratingCounts[i] > 0 ? sum / ratingCounts[i] : 0
//           );
//           setTestimonialsData({ counts, ratings: avgRatings });
//         }

//         // Fetch chat history
//         const chatResponse = await getChatHistory("mentor");
//         if (chatResponse && Array.isArray(chatResponse.data)) {
//           const uniqueMentees = new Set(
//             chatResponse.data
//               .map((chat: ChatUser) => chat.otherUserId)
//               .filter(Boolean)
//           );
//           setYearlyData((prev) =>
//             prev.map((yearData) => ({
//               ...yearData,
//               mentees: Math.max(yearData.mentees, uniqueMentees.size),
//             }))
//           );
//         }
//       } catch (err: any) {
//         const errorMessage =
//           err instanceof Error
//             ? `API error: ${err.message}`
//             : "Unexpected error fetching data";
//         setError((prev) => prev || errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [mentorId]);

//   useEffect(() => {
//     setMonthlyBookingsPayments((prev) => {
//       const newBookings = Object.values(monthlyBookings).reduce(
//         (acc, curr) => acc.map((val, i) => val + curr[i]),
//         Array(12).fill(0)
//       );
//       return { bookings: newBookings, payments: prev.payments };
//     });
//   }, [monthlyBookings]);

//   // Chart data remains unchanged
//   const monthlyBookingsChart = {
//     labels: [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ],
//     datasets: Object.entries(monthlyBookings).map(([type, counts], index) => ({
//       label: type,
//       data: counts,
//       backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
//     })),
//   };

//   const earningsBreakdownChart = {
//     labels: earningsBreakdown.map((item) => item.name),
//     datasets: [
//       {
//         label: "Earnings",
//         data: earningsBreakdown.map((item) => item.value),
//         backgroundColor: [
//           "#8884d8",
//           "#82ca9d",
//           "#ffc658",
//           "#ff7300",
//           "#d81b60",
//         ],
//       },
//     ],
//   };

//   const monthlyBookingsPaymentsChart = {
//     labels: [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ],
//     datasets: [
//       {
//         label: "Bookings",
//         data: monthlyBookingsPayments.bookings,
//         backgroundColor: "#8884d8",
//         yAxisID: "y-bookings",
//       },
//       {
//         label: "Payments (₹)",
//         data: monthlyBookingsPayments.payments,
//         backgroundColor: "#82ca9d",
//         yAxisID: "y-payments",
//       },
//     ],
//   };

//   const yearlyChart = {
//     labels: yearlyData.map((item) => item.year.toString()),
//     datasets: [
//       {
//         label: "Bookings",
//         data: yearlyData.map((item) => item.bookings),
//         backgroundColor: "#8884d8",
//       },
//       {
//         label: "Mentees",
//         data: yearlyData.map((item) => item.mentees),
//         backgroundColor: "#82ca9d",
//       },
//     ],
//   };

//   const testimonialsChart = {
//     labels: [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ],
//     datasets: [
//       {
//         label: "Testimonials Count",
//         data: testimonialsData.counts,
//         borderColor: "#8884d8",
//         backgroundColor: "rgba(136, 132, 216, 0.2)",
//         fill: true,
//         tension: 0.4,
//       },
//       {
//         label: "Average Rating",
//         data: testimonialsData.ratings,
//         borderColor: "#82ca9d",
//         backgroundColor: "rgba(130, 202, 157, 0.2)",
//         fill: true,
//         tension: 0.4,
//       },
//     ],
//   };

//   // Responsive chart options
//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false, // Allow charts to fill container height
//     plugins: {
//       legend: {
//         position: "top" as const,
//         labels: {
//           font: {
//             size: window.innerWidth < 640 ? 10 : 12, // Smaller font on mobile
//           },
//         },
//       },
//       title: {
//         display: true,
//         text: "",
//         font: {
//           size: window.innerWidth < 640 ? 14 : 16,
//         },
//       },
//     },
//     scales: {
//       "y-bookings": {
//         type: "linear" as const,
//         position: "left" as const,
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: "Bookings",
//           font: { size: window.innerWidth < 640 ? 10 : 12 },
//         },
//       },
//       "y-payments": {
//         type: "linear" as const,
//         position: "right" as const,
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: "Payments (₹)",
//           font: { size: window.innerWidth < 640 ? 10 : 12 },
//         },
//         grid: { drawOnChartArea: false },
//       },
//     },
//   };

//   const standardChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "top" as const,
//         labels: {
//           font: {
//             size: window.innerWidth < 640 ? 10 : 12,
//           },
//         },
//       },
//       title: {
//         display: true,
//         text: "",
//         font: {
//           size: window.innerWidth < 640 ? 14 : 16,
//         },
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           font: { size: window.innerWidth < 640 ? 10 : 12 },
//         },
//       },
//     },
//   };

//   return (
//     <main className="ml-0 sm:ml-24 p-4 sm:p-8 bg-white min-h-screen overflow-x-hidden">
//       <div className="flex justify-between items-center mb-6 sm:mb-8">
//         <h1 className="text-xl sm:text-2xl font-bold">Mentor Dashboard</h1>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
//         <Card className="p-4 sm:p-6">
//           <h3 className="text-xs sm:text-sm text-gray-600 mb-2">
//             Current Month Bookings
//           </h3>
//           <p className="text-2xl sm:text-3xl font-bold">
//             {currentMonthBookings}
//           </p>
//         </Card>
//         <Card className="p-4 sm:p-6">
//           <h3 className="text-xs sm:text-sm text-gray-600 mb-2">
//             Current Month Earnings
//           </h3>
//           <p className="text-2xl sm:text-3xl font-bold">
//             ₹{currentMonthEarnings.toLocaleString()}
//           </p>
//         </Card>
//       </div>

//       <div className="space-y-4 sm:space-y-6">
//         <div className="lg:col-span-2">
//           <Card className="p-4 sm:p-6">
//             <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
//               Monthly Bookings vs Payments ({new Date().getFullYear()})
//             </h2>
//             <div className="h-[300px] sm:h-[400px] lg:h-[500px]">
//               {monthlyBookingsPayments.bookings.some((v) => v > 0) ||
//               monthlyBookingsPayments.payments.some((v) => v > 0) ? (
//                 <Bar
//                   data={monthlyBookingsPaymentsChart}
//                   options={{
//                     ...chartOptions,
//                     plugins: {
//                       ...chartOptions.plugins,
//                       title: {
//                         display: true,
//                         text: "Monthly Bookings vs Payments",
//                       },
//                     },
//                   }}
//                 />
//               ) : (
//                 <p className="text-center text-gray-500">No data available</p>
//               )}
//             </div>
//           </Card>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//           <Card className="p-4 sm:p-6">
//             <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
//               Lifetime Earnings by Service
//             </h2>
//             <div className="h-[250px] sm:h-[300px] lg:h-[400px]">
//               {earningsBreakdown.length > 0 ? (
//                 <Doughnut
//                   data={earningsBreakdownChart}
//                   options={{
//                     ...standardChartOptions,
//                     plugins: {
//                       ...standardChartOptions.plugins,
//                       title: {
//                         display: true,
//                         text: "Lifetime Earnings by Service",
//                       },
//                     },
//                   }}
//                 />
//               ) : (
//                 <p className="text-center text-gray-500">
//                   No earnings data available
//                 </p>
//               )}
//             </div>
//           </Card>
//           <Card className="p-4 sm:p-6">
//             <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
//               Monthly Bookings by Service Type ({new Date().getFullYear()})
//             </h2>
//             <div className="h-[250px] sm:h-[300px] lg:h-[400px]">
//               {Object.keys(monthlyBookings).length > 0 &&
//               Object.values(monthlyBookings).some((counts) =>
//                 counts.some((v) => v > 0)
//               ) ? (
//                 <Pie
//                   data={monthlyBookingsChart}
//                   options={{
//                     ...standardChartOptions,
//                     plugins: {
//                       ...standardChartOptions.plugins,
//                       title: {
//                         display: true,
//                         text: "Monthly Bookings by Service Type",
//                       },
//                     },
//                   }}
//                 />
//               ) : (
//                 <p className="text-center text-gray-500">
//                   No booking data available
//                 </p>
//               )}
//             </div>
//           </Card>

//           <Card className="p-4 sm:p-6">
//             <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
//               Yearly Bookings and Mentees
//             </h2>
//             <div className="h-[250px] sm:h-[300px] lg:h-[400px]">
//               {yearlyData.length > 0 ? (
//                 <Bar
//                   data={yearlyChart}
//                   options={{
//                     ...standardChartOptions,
//                     plugins: {
//                       ...standardChartOptions.plugins,
//                       title: {
//                         display: true,
//                         text: "Yearly Bookings and Mentees",
//                       },
//                     },
//                   }}
//                 />
//               ) : (
//                 <p className="text-center text-gray-500">
//                   No yearly data available
//                 </p>
//               )}
//             </div>
//           </Card>

//           <Card className="p-4 sm:p-6">
//             <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
//               Monthly Testimonials and Ratings ({new Date().getFullYear()})
//             </h2>
//             <div className="h-[250px] sm:h-[300px] lg:h-[400px]">
//               {testimonialsData.counts.some((v) => v > 0) ||
//               testimonialsData.ratings.some((v) => v > 0) ? (
//                 <Line
//                   data={testimonialsChart}
//                   options={{
//                     ...standardChartOptions,
//                     plugins: {
//                       ...standardChartOptions.plugins,
//                       title: {
//                         display: true,
//                         text: "Monthly Testimonials and Ratings",
//                       },
//                     },
//                   }}
//                 />
//               ) : (
//                 <p className="text-center text-gray-500">
//                   No testimonials data available
//                 </p>
//               )}
//             </div>
//           </Card>
//         </div>
//       </div>

//       {loading && <p className="text-center">Loading charts...</p>}
//       {error && <p className="text-red-500 text-center">{error}</p>}
//     </main>
//   );
// };

// export default MentorDashboard;
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Doughnut, Bar, Line } from "react-chartjs-2";
import { getBookingsByMentor } from "@/services/bookingService";
import { getAllMentorPayments } from "@/services/paymentServcie";
import { getAllServices } from "@/services/mentorService";
import { getTestimonialsByMentor } from "@/services/testimonialService";
import { getChatHistory } from "@/services/userServices";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import {
  TrendingUp,
  Users,
  Calendar,
  Star,
  DollarSign,
  MessageCircle,
  BarChart3,
  PieChart,
  Activity,
  Award,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Interfaces
interface Booking {
  _id: string;
  createdAt: string;
  serviceId: { _id: string; type: string; title: string };
  status: string;
  mentorId: { _id: string; firstName: string; lastName: string };
  menteeId: { _id: string; firstName: string; lastName: string; email: string };
  bookingDate: string;
  day: string;
  startTime: string;
}

interface Payment {
  _id: string;
  createdAt: string;
  amount: number;
  total: number;
  serviceDetails: { _id: string; title: string; type: string };
}

interface Service {
  _id: string;
  title: string;
  type: "1-1Call" | "priorityDM" | "DigitalProducts";
  stats?: {
    views: number;
    bookings: number;
    earnings: number;
    conversions: string;
  };
}

interface Testimonial {
  _id: string;
  createdAt: string;
  rating: number;
  comment: string;
}

interface ChatUser {
  id: string;
  bookingId: string;
  otherUserId?: string;
}

const MentorDashboard: React.FC = () => {
  const [monthlyBookings, setMonthlyBookings] = useState<{
    [key: string]: number[];
  }>({});
  const [yearlyData, setYearlyData] = useState<
    { year: number; bookings: number; mentees: number }[]
  >([]);
  const [earningsBreakdown, setEarningsBreakdown] = useState<
    { name: string; value: number }[]
  >([]);
  const [monthlyBookingsPayments, setMonthlyBookingsPayments] = useState<{
    bookings: number[];
    payments: number[];
  }>({ bookings: Array(12).fill(0), payments: Array(12).fill(0) });
  const [testimonialsData, setTestimonialsData] = useState<{
    counts: number[];
    ratings: number[];
  }>({ counts: Array(12).fill(0), ratings: Array(12).fill(0) });
  const [currentMonthBookings, setCurrentMonthBookings] = useState<number>(0);
  const [currentMonthEarnings, setCurrentMonthEarnings] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.user);
  const mentorId = user?._id;

  // Calculate additional metrics
  const totalEarnings = earningsBreakdown.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const totalBookings = monthlyBookingsPayments.bookings.reduce(
    (sum, count) => sum + count,
    0
  );
  const avgRating =
    testimonialsData.ratings
      .filter((r) => r > 0)
      .reduce((sum, rating, _, arr) => sum + rating / arr.length, 0) || 0;
  const totalTestimonials = testimonialsData.counts.reduce(
    (sum, count) => sum + count,
    0
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        // Fetch bookings
        const bookingsResponse = await getBookingsByMentor(mentorId, 1, 1000);
        const bookings: Booking[] = Array.isArray(bookingsResponse.data)
          ? bookingsResponse.data
          : [];
        const monthlyByService: { [key: string]: number[] } = {};
        let monthBookings = 0;
        bookings.forEach((booking) => {
          const date = new Date(booking.createdAt);
          if (date.getFullYear() === currentYear) {
            const month = date.getMonth();
            const serviceType = booking.serviceId?.type || "Unknown";
            if (!monthlyByService[serviceType]) {
              monthlyByService[serviceType] = Array(12).fill(0);
            }
            monthlyByService[serviceType][month] += 1;
            if (month === currentMonth) {
              monthBookings += 1;
            }
          }
        });
        setMonthlyBookings(monthlyByService);
        setCurrentMonthBookings(monthBookings);

        const yearlyMap: {
          [key: number]: { bookings: number; mentees: Set<string> };
        } = {};
        bookings.forEach((item) => {
          const year = new Date(item.createdAt).getFullYear();
          if (!yearlyMap[year]) {
            yearlyMap[year] = { bookings: 0, mentees: new Set() };
          }
          yearlyMap[year].bookings += 1;
          yearlyMap[year].mentees.add(item.menteeId._id);
        });
        const yearlyData = Object.entries(yearlyMap)
          .map(([year, data]) => ({
            year: parseInt(year),
            bookings: data.bookings,
            mentees: data.mentees.size,
          }))
          .sort((a, b) => a.year - b.year);
        setYearlyData(yearlyData);

        // Fetch payments
        const paymentsResponse = await getAllMentorPayments(1, 1000);
        if (paymentsResponse && Array.isArray(paymentsResponse.payments)) {
          const payments: Payment[] = paymentsResponse.payments;
          const earningsByService: { [key: string]: number } = {};
          let monthEarnings = 0;
          const monthlyPayments = Array(12).fill(0);
          payments.forEach((payment) => {
            const date = new Date(payment.createdAt);
            const serviceType = payment.serviceDetails?.type || "Unknown";
            if (date.getFullYear() === currentYear) {
              const month = date.getMonth();
              monthlyPayments[month] += payment.total;
              if (month === currentMonth) {
                monthEarnings += payment.total;
              }
            }
            earningsByService[serviceType] =
              (earningsByService[serviceType] || 0) + payment.total;
          });
          setCurrentMonthEarnings(monthEarnings);
          setMonthlyBookingsPayments((prev) => ({
            ...prev,
            payments: monthlyPayments,
          }));
          setEarningsBreakdown(
            Object.entries(earningsByService).map(([name, value]) => ({
              name,
              value,
            }))
          );
        }

        // Fetch services
        const servicesResponse = await getAllServices({ page: 1, limit: 1000 });
        if (servicesResponse && Array.isArray(servicesResponse.services)) {
          const services: Service[] = servicesResponse.services;
          setMonthlyBookings((prev) => {
            const updatedBookings = { ...prev };
            services.forEach((service) => {
              const serviceType = service.type || "Unknown";
              if (!updatedBookings[serviceType]) {
                updatedBookings[serviceType] = Array(12).fill(0);
              }
            });
            return updatedBookings;
          });
        }

        // Fetch testimonials
        const testimonialsResponse = await getTestimonialsByMentor(1, 1000);
        if (
          testimonialsResponse &&
          Array.isArray(testimonialsResponse.testimonials)
        ) {
          const testimonials: Testimonial[] = testimonialsResponse.testimonials;
          const counts = Array(12).fill(0);
          const ratings = Array(12).fill(0);
          const ratingCounts = Array(12).fill(0);
          testimonials.forEach((testimonial) => {
            const date = new Date(testimonial.createdAt);
            if (date.getFullYear() === currentYear) {
              const month = date.getMonth();
              counts[month] += 1;
              ratings[month] += testimonial.rating;
              ratingCounts[month] += 1;
            }
          });
          const avgRatings = ratings.map((sum, i) =>
            ratingCounts[i] > 0 ? sum / ratingCounts[i] : 0
          );
          setTestimonialsData({ counts, ratings: avgRatings });
        }

        // Fetch chat history
        const chatResponse = await getChatHistory("mentor");
        if (chatResponse && Array.isArray(chatResponse.data)) {
          const uniqueMentees = new Set(
            chatResponse.data
              .map((chat: ChatUser) => chat.otherUserId)
              .filter(Boolean)
          );
          setYearlyData((prev) =>
            prev.map((yearData) => ({
              ...yearData,
              mentees: Math.max(yearData.mentees, uniqueMentees.size),
            }))
          );
        }
      } catch (err: any) {
        const errorMessage =
          err instanceof Error
            ? `API error: ${err.message}`
            : "Unexpected error fetching data";
        setError((prev) => prev || errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mentorId]);

  useEffect(() => {
    setMonthlyBookingsPayments((prev) => {
      const newBookings = Object.values(monthlyBookings).reduce(
        (acc, curr) => acc.map((val, i) => val + curr[i]),
        Array(12).fill(0)
      );
      return { bookings: newBookings, payments: prev.payments };
    });
  }, [monthlyBookings]);

  // Chart configurations with modern styling
  const colors = {
    primary: "#6366f1",
    secondary: "#8b5cf6",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#06b6d4",
    gradient: [
      "#6366f1",
      "#8b5cf6",
      "#ec4899",
      "#f59e0b",
      "#10b981",
      "#06b6d4",
    ],
  };

  const monthlyBookingsChart = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: Object.entries(monthlyBookings).map(([type, counts], index) => ({
      label: type,
      data: counts,
      backgroundColor: colors.gradient[index % colors.gradient.length],
      borderRadius: 8,
      borderSkipped: false,
    })),
  };

  const earningsBreakdownChart = {
    labels: earningsBreakdown.map((item) => item.name),
    datasets: [
      {
        label: "Earnings",
        data: earningsBreakdown.map((item) => item.value),
        backgroundColor: colors.gradient,
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const monthlyBookingsPaymentsChart = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Bookings",
        data: monthlyBookingsPayments.bookings,
        backgroundColor: colors.primary,
        borderRadius: 8,
        yAxisID: "y-bookings",
      },
      {
        label: "Payments (₹)",
        data: monthlyBookingsPayments.payments,
        backgroundColor: colors.success,
        borderRadius: 8,
        yAxisID: "y-payments",
      },
    ],
  };

  const yearlyChart = {
    labels: yearlyData.map((item) => item.year.toString()),
    datasets: [
      {
        label: "Bookings",
        data: yearlyData.map((item) => item.bookings),
        backgroundColor: colors.primary,
        borderRadius: 8,
      },
      {
        label: "Mentees",
        data: yearlyData.map((item) => item.mentees),
        backgroundColor: colors.success,
        borderRadius: 8,
      },
    ],
  };

  const testimonialsChart = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Testimonials Count",
        data: testimonialsData.counts,
        borderColor: colors.primary,
        backgroundColor: `${colors.primary}20`,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: colors.primary,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: "Average Rating",
        data: testimonialsData.ratings,
        borderColor: colors.warning,
        backgroundColor: `${colors.warning}20`,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: colors.warning,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: "500",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      "y-bookings": {
        type: "linear" as const,
        position: "left" as const,
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: { size: 11 },
        },
      },
      "y-payments": {
        type: "linear" as const,
        position: "right" as const,
        beginAtZero: true,
        grid: { display: false },
        ticks: {
          font: { size: 11 },
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: "500",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        cornerRadius: 8,
        padding: 12,
      },
    },
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    color = "blue",
  }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: string;
    color?: string;
  }) => {
    const colorClasses = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      yellow: "from-yellow-500 to-yellow-600",
      pink: "from-pink-500 to-pink-600",
      indigo: "from-indigo-500 to-indigo-600",
    };

    return (
      <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-90`}
        />
        <div className="relative p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
              <p className="text-3xl font-bold">{value}</p>
              {trend && (
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>{trend}</span>
                </div>
              )}
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Icon className="w-8 h-8" />
            </div>
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <main className="ml-0 sm:ml-24 p-4 sm:p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-600">
              Loading your dashboard...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="ml-0 sm:ml-24 p-4 sm:p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 text-lg">
          Welcome back! Here's what's happening with your mentoring business.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="This Month Bookings"
          value={currentMonthBookings}
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="This Month Earnings"
          value={`₹${currentMonthEarnings.toLocaleString()}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Total Earnings"
          value={`₹${totalEarnings.toLocaleString()}`}
          icon={TrendingUp}
          color="purple"
        />
        <StatCard
          title="Total Bookings"
          value={totalBookings}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Average Rating"
          value={avgRating.toFixed(1)}
          icon={Star}
          color="yellow"
        />
        <StatCard
          title="Total Reviews"
          value={totalTestimonials}
          icon={MessageCircle}
          color="pink"
        />
      </div>

      {/* Main Chart */}
      <div className="mb-8">
        <Card className="p-6 shadow-lg border-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Monthly Performance
              </h2>
              <p className="text-gray-600">
                Bookings vs Payments trends for {new Date().getFullYear()}
              </p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-xl">
              <BarChart3 className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <div className="h-[400px] lg:h-[500px]">
            {monthlyBookingsPayments.bookings.some((v) => v > 0) ||
            monthlyBookingsPayments.payments.some((v) => v > 0) ? (
              <Bar data={monthlyBookingsPaymentsChart} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    No performance data available yet
                  </p>
                  <p className="text-gray-400">
                    Start accepting bookings to see your analytics
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Secondary Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Earnings Breakdown */}
        <Card className="p-6 shadow-lg border-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Earnings by Service
              </h3>
              <p className="text-gray-600">Lifetime revenue breakdown</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <PieChart className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="h-[350px]">
            {earningsBreakdown.length > 0 ? (
              <Doughnut
                data={earningsBreakdownChart}
                options={pieChartOptions}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No earnings data available</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Service Type Distribution */}
        <Card className="p-6 shadow-lg border-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Bookings by Service
              </h3>
              <p className="text-gray-600">
                Distribution for {new Date().getFullYear()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="h-[350px]">
            {Object.keys(monthlyBookings).length > 0 &&
            Object.values(monthlyBookings).some((counts) =>
              counts.some((v) => v > 0)
            ) ? (
              <Pie data={monthlyBookingsChart} options={pieChartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No booking data available</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Bottom Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Yearly Trends */}
        <Card className="p-6 shadow-lg border-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Yearly Growth
              </h3>
              <p className="text-gray-600">Bookings and mentees over time</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="h-[350px]">
            {yearlyData.length > 0 ? (
              <Bar data={yearlyChart} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No yearly data available</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Testimonials & Ratings */}
        <Card className="p-6 shadow-lg border-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Reviews & Ratings
              </h3>
              <p className="text-gray-600">
                Monthly testimonials for {new Date().getFullYear()}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="h-[350px]">
            {testimonialsData.counts.some((v) => v > 0) ||
            testimonialsData.ratings.some((v) => v > 0) ? (
              <Line data={testimonialsChart} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No testimonials data available
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {error && (
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      )}
    </main>
  );
};

export default MentorDashboard;
