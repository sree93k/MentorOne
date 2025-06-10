// // // // import React from "react";
// // // // import { Input } from "@/components/ui/input";
// // // // import { Card } from "@/components/ui/card";
// // // // import {
// // // //   LineChart,
// // // //   Line,
// // // //   XAxis,
// // // //   YAxis,
// // // //   Tooltip,
// // // //   ResponsiveContainer,
// // // // } from "recharts";

// // // // const data = [
// // // //   { name: "5k", value: 20 },
// // // //   { name: "10k", value: 40 },
// // // //   { name: "15k", value: 45 },
// // // //   { name: "20k", value: 35 },
// // // //   { name: "25k", value: 85 },
// // // //   { name: "30k", value: 45 },
// // // //   { name: "35k", value: 55 },
// // // //   { name: "40k", value: 25 },
// // // //   { name: "45k", value: 65 },
// // // //   { name: "50k", value: 60 },
// // // //   { name: "55k", value: 55 },
// // // //   { name: "60k", value: 50 },
// // // // ];

// // // // const AdminDashboard: React.FC = () => {
// // // //   return (
// // // //     <>
// // // //       {/* Main Content */}
// // // //       <div className="flex-1 ml-24 p-8 bg-white">
// // // //         {/* Header */}
// // // //         <div className="flex justify-between items-center mb-8">
// // // //           <h1 className="text-2xl font-bold">Admin Dashboard</h1>
// // // //           <Input type="search" placeholder="Search" className="w-64" />
// // // //         </div>

// // // //         {/* Stats Cards */}
// // // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// // // //           <Card className="p-6">
// // // //             <h3 className="text-sm text-gray-600 mb-2">Total Mentors</h3>
// // // //             <p className="text-3xl font-bold">33</p>
// // // //           </Card>
// // // //           <Card className="p-6">
// // // //             <h3 className="text-sm text-gray-600 mb-2">Total Mentees</h3>
// // // //             <p className="text-3xl font-bold">540</p>
// // // //           </Card>
// // // //           <Card className="p-6">
// // // //             <h3 className="text-sm text-gray-600 mb-2">Monthly Earnings</h3>
// // // //             <p className="text-3xl font-bold">₹12,300</p>
// // // //           </Card>
// // // //           <Card className="p-6">
// // // //             <h3 className="text-sm text-gray-600 mb-2">Subscribers</h3>
// // // //             <p className="text-3xl font-bold">120</p>
// // // //           </Card>
// // // //         </div>

// // // //         {/* Sales Chart */}
// // // //         <Card className="p-6">
// // // //           <div className="flex justify-between items-center mb-6">
// // // //             <h2 className="text-xl font-semibold">Sales Details</h2>
// // // //             <select className="border rounded-md px-3 py-1">
// // // //               <option>October</option>
// // // //             </select>
// // // //           </div>
// // // //           <div className="h-[300px]">
// // // //             <ResponsiveContainer width="100%" height="100%">
// // // //               <LineChart data={data}>
// // // //                 <XAxis dataKey="name" />
// // // //                 <YAxis />
// // // //                 <Tooltip />
// // // //                 <Line
// // // //                   type="monotone"
// // // //                   dataKey="value"
// // // //                   stroke="#2563eb"
// // // //                   strokeWidth={2}
// // // //                   dot={{ fill: "#2563eb" }}
// // // //                 />
// // // //               </LineChart>
// // // //             </ResponsiveContainer>
// // // //           </div>
// // // //         </Card>
// // // //       </div>
// // // //     </>
// // // //   );
// // // // };

// // // // export default AdminDashboard;

// // // import React, { useEffect, useState } from "react";
// // // import { Input } from "@/components/ui/input";
// // // import { Card } from "@/components/ui/card";
// // // import {
// // //   Chart as ChartJS,
// // //   CategoryScale,
// // //   LinearScale,
// // //   PointElement,
// // //   LineElement,
// // //   Title,
// // //   Tooltip,
// // //   Legend,
// // // } from "chart.js";
// // // import { Line } from "react-chartjs-2";
// // // import { getAllBookings } from "@/services/adminService"; // Adjust the import path
// // // import { AxiosResponse } from "axios";

// // // // Register Chart.js components
// // // ChartJS.register(
// // //   CategoryScale,
// // //   LinearScale,
// // //   PointElement,
// // //   LineElement,
// // //   Title,
// // //   Tooltip,
// // //   Legend
// // // );

// // // interface Booking {
// // //   _id: string;
// // //   createdAt: string;
// // //   serviceId: { _id: string; type: string; title: string };
// // //   status: string;
// // //   mentorId: { _id: string; firstName: string; lastName: string };
// // //   menteeId: { _id: string; firstName: string; lastName: string; email: string };
// // //   bookingDate: string;
// // //   day: string;
// // //   startTime: string;
// // //   rescheduleRequest: { mentorDecides: boolean; rescheduleStatus: string };
// // //   updatedAt: string;
// // //   __v: number;
// // // }

// // // const AdminDashboard: React.FC = () => {
// // //   const [monthlyByService, setMonthlyByService] = useState<{
// // //     [key: string]: number[];
// // //   }>({});
// // //   const [yearlyBookings, setYearlyBookings] = useState<
// // //     { year: number; count: number }[]
// // //   >([]);
// // //   const [loading, setLoading] = useState<boolean>(true);
// // //   const [error, setError] = useState<string | null>(null);

// // //   useEffect(() => {
// // //     const fetchBookings = async () => {
// // //       try {
// // //         setLoading(true);
// // //         const response = await getAllBookings(1, 1000);
// // //         console.log("ADMIN DASHBOARD....getAllBookings", response);

// // //         if (response && response.data && response.data.data) {
// // //           const bookings: Booking[] = response.data.data; // Updated to response.data.data

// // //           // Process monthly bookings by service for current year
// // //           const currentYear = new Date().getFullYear();
// // //           const monthlyByService: { [key: string]: number[] } = {};
// // //           bookings.forEach((booking) => {
// // //             const date = new Date(booking.createdAt);
// // //             if (date.getFullYear() === currentYear) {
// // //               const month = date.getMonth();
// // //               const service = booking.serviceId?.title || "Unknown"; // Use serviceId.title
// // //               if (!monthlyByService[service]) {
// // //                 monthlyByService[service] = Array(12).fill(0);
// // //               }
// // //               monthlyByService[service][month] += 1;
// // //             }
// // //           });
// // //           setMonthlyByService(monthlyByService);

// // //           // Process yearly bookings
// // //           const yearlyMap: { [key: number]: number } = {};
// // //           bookings.forEach((booking) => {
// // //             const year = new Date(booking.createdAt).getFullYear();
// // //             yearlyMap[year] = (yearlyMap[year] || 0) + 1;
// // //           });
// // //           const yearlyData = Object.entries(yearlyMap)
// // //             .map(([year, count]) => ({ year: parseInt(year), count }))
// // //             .sort((a, b) => a.year - b.year);
// // //           setYearlyBookings(yearlyData);
// // //         } else {
// // //           setError("No bookings found in the response");
// // //           console.error("Unexpected response structure:", response?.data);
// // //         }
// // //       } catch (err: any) {
// // //         const errorMessage = err
// // //           ? `API error: ${err.response?.data?.message || err.message}`
// // //           : "Unexpected error fetching bookings";
// // //         setError(errorMessage);
// // //         console.error("Fetch bookings error:", err);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchBookings();
// // //   }, []);

// // //   // Monthly chart data
// // //   const monthlyChartData = {
// // //     labels: [
// // //       "Jan",
// // //       "Feb",
// // //       "Mar",
// // //       "Apr",
// // //       "May",
// // //       "Jun",
// // //       "Jul",
// // //       "Aug",
// // //       "Sep",
// // //       "Oct",
// // //       "Nov",
// // //       "Dec",
// // //     ],
// // //     datasets: Object.entries(monthlyByService).map(
// // //       ([service, counts], index) => ({
// // //         label: service,
// // //         data: counts,
// // //         borderColor: `hsl(${index * 60}, 70%, 50%)`,
// // //         backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.2)`,
// // //         fill: true,
// // //         tension: 0.4,
// // //       })
// // //     ),
// // //   };

// // //   // Yearly chart data
// // //   const yearlyChartData = {
// // //     labels: yearlyBookings.map((item) => item.year.toString()),
// // //     datasets: [
// // //       {
// // //         label: "Bookings",
// // //         data: yearlyBookings.map((item) => item.count),
// // //         borderColor: "#10b981",
// // //         backgroundColor: "rgba(16, 185, 129, 0.2)",
// // //         fill: true,
// // //         tension: 0.4,
// // //       },
// // //     ],
// // //   };

// // //   const chartOptions = {
// // //     responsive: true,
// // //     plugins: {
// // //       legend: { position: "top" as const },
// // //       title: { display: true, text: "" },
// // //     },
// // //     scales: {
// // //       y: { beginAtZero: true },
// // //     },
// // //   };

// // //   return (
// // //     <div className="flex-1 ml-24 p-8 bg-white">
// // //       {/* Header */}
// // //       <div className="flex justify-between items-center mb-8">
// // //         <h1 className="text-2xl font-bold">Admin Dashboard</h1>
// // //         <Input type="search" placeholder="Search" className="w-64" />
// // //       </div>

// // //       {/* Stats Cards */}
// // //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
// // //         <Card className="p-6">
// // //           <h3 className="text-sm text-gray-600 mb-2">Total Mentors</h3>
// // //           <p className="text-3xl font-bold">33</p>
// // //         </Card>
// // //         <Card className="p-6">
// // //           <h3 className="text-sm text-gray-600 mb-2">Total Mentees</h3>
// // //           <p className="text-3xl font-bold">540</p>
// // //         </Card>
// // //         <Card className="p-6">
// // //           <h3 className="text-sm text-gray-600 mb-2">Monthly Earnings</h3>
// // //           <p className="text-3xl font-bold">₹12,300</p>
// // //         </Card>
// // //       </div>

// // //       {/* Charts */}
// // //       {loading ? (
// // //         <p>Loading charts...</p>
// // //       ) : error ? (
// // //         <p className="text-red-500">{error}</p>
// // //       ) : Object.keys(monthlyByService).length === 0 &&
// // //         yearlyBookings.length === 0 ? (
// // //         <p>No booking data available</p>
// // //       ) : (
// // //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// // //           {/* Monthly Bookings Chart */}
// // //           <Card className="p-6">
// // //             <h2 className="text-xl font-semibold mb-6">
// // //               Monthly Bookings by Service ({new Date().getFullYear()})
// // //             </h2>
// // //             <div className="h-[300px]">
// // //               <Line
// // //                 options={{
// // //                   ...chartOptions,
// // //                   plugins: {
// // //                     ...chartOptions.plugins,
// // //                     title: {
// // //                       display: true,
// // //                       text: "Monthly Bookings by Service",
// // //                     },
// // //                   },
// // //                 }}
// // //                 data={monthlyChartData}
// // //               />
// // //             </div>
// // //           </Card>

// // //           {/* Yearly Bookings Chart */}
// // //           <Card className="p-6">
// // //             <h2 className="text-xl font-semibold mb-6">Yearly Bookings</h2>
// // //             <div className="h-[300px]">
// // //               <Line
// // //                 options={{
// // //                   ...chartOptions,
// // //                   plugins: {
// // //                     ...chartOptions.plugins,
// // //                     title: { display: true, text: "Yearly Bookings" },
// // //                   },
// // //                 }}
// // //                 data={yearlyChartData}
// // //               />
// // //             </div>
// // //           </Card>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default AdminDashboard;
// // import React, { useEffect, useState } from "react";
// // import { Input } from "@/components/ui/input";
// // import { Card } from "@/components/ui/card";
// // import {
// //   Chart as ChartJS,
// //   CategoryScale,
// //   LinearScale,
// //   PointElement,
// //   LineElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// // } from "chart.js";
// // import { Line } from "react-chartjs-2";
// // import {
// //   getAllBookings,
// //   getAllusers,
// //   getAllPayments,
// // } from "@/services/adminService"; // Adjust the import path
// // import { AxiosResponse } from "axios";

// // // Register Chart.js components
// // ChartJS.register(
// //   CategoryScale,
// //   LinearScale,
// //   PointElement,
// //   LineElement,
// //   Title,
// //   Tooltip,
// //   Legend
// // );

// // interface Booking {
// //   _id: string;
// //   createdAt: string;
// //   serviceId: { _id: string; type: string; title: string };
// //   status: string;
// //   mentorId: { _id: string; firstName: string; lastName: string };
// //   menteeId: { _id: string; firstName: string; lastName: string; email: string };
// //   bookingDate: string;
// //   day: string;
// //   startTime: string;
// //   rescheduleRequest: { mentorDecides: boolean; rescheduleStatus: string };
// //   updatedAt: string;
// //   __v: number;
// // }

// // interface User {
// //   _id: string;
// //   role: string;
// //   // Add other user fields as needed
// // }

// // interface Payment {
// //   _id: string;
// //   createdAt: string;
// //   amount: number;
// //   // Add other payment fields as needed
// // }

// // const AdminDashboard: React.FC = () => {
// //   const [monthlyByService, setMonthlyByService] = useState<{
// //     [key: string]: number[];
// //   }>({});
// //   const [yearlyBookings, setYearlyBookings] = useState<
// //     { year: number; count: number }[]
// //   >([]);
// //   const [totalMentors, setTotalMentors] = useState<number>(0);
// //   const [totalMentees, setTotalMentees] = useState<number>(0);
// //   const [monthlyEarnings, setMonthlyEarnings] = useState<number>(0);
// //   const [totalBookings, setTotalBookings] = useState<number>(0);
// //   const [totalServices, setTotalServices] = useState<number>(0);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [error, setError] = useState<string | null>(null);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         setLoading(true);

// //         // Fetch bookings
// //         const bookingsResponse = await getAllBookings(1, 1000);
// //         if (
// //           bookingsResponse &&
// //           bookingsResponse.data &&
// //           bookingsResponse.data.data
// //         ) {
// //           const bookings: Booking[] = bookingsResponse.data.data;

// //           // Process monthly bookings by service for current year
// //           const currentYear = new Date().getFullYear();
// //           const monthlyByService: { [key: string]: number[] } = {};
// //           const serviceSet = new Set<string>();
// //           bookings.forEach((booking) => {
// //             const date = new Date(booking.createdAt);
// //             if (date.getFullYear() === currentYear) {
// //               const month = date.getMonth();
// //               const service = booking.serviceId?.title || "Unknown";
// //               if (!monthlyByService[service]) {
// //                 monthlyByService[service] = Array(12).fill(0);
// //               }
// //               monthlyByService[service][month] += 1;
// //             }
// //             serviceSet.add(booking.serviceId?.title || "Unknown");
// //           });
// //           setMonthlyByService(monthlyByService);
// //           setTotalBookings(bookings.length);
// //           setTotalServices(serviceSet.size);

// //           // Process yearly bookings
// //           const yearlyMap: { [key: number]: number } = {};
// //           bookings.forEach((booking) => {
// //             const year = new Date(booking.createdAt).getFullYear();
// //             yearlyMap[year] = (yearlyMap[year] || 0) + 1;
// //           });
// //           const yearlyData = Object.entries(yearlyMap)
// //             .map(([year, count]) => ({ year: parseInt(year), count }))
// //             .sort((a, b) => a.year - b.year);
// //           setYearlyBookings(yearlyData);
// //         } else {
// //           setError("No bookings found in the response");
// //           console.error(
// //             "Unexpected bookings response structure:",
// //             bookingsResponse?.data
// //           );
// //         }

// //         // Fetch mentors
// //         const mentorsResponse = await getAllusers(1, 1000, "mentor");
// //         if (
// //           mentorsResponse &&
// //           mentorsResponse.data &&
// //           mentorsResponse.data.data
// //         ) {
// //           setTotalMentors(mentorsResponse.data.data.length);
// //         } else {
// //           setError("No mentors found in the response");
// //           console.error(
// //             "Unexpected mentors response structure:",
// //             mentorsResponse?.data
// //           );
// //         }

// //         // Fetch mentees
// //         const menteesResponse = await getAllusers(1, 1000, "mentee");
// //         if (
// //           menteesResponse &&
// //           menteesResponse.data &&
// //           menteesResponse.data.data
// //         ) {
// //           setTotalMentees(menteesResponse.data.data.length);
// //         } else {
// //           setError("No mentees found in the response");
// //           console.error(
// //             "Unexpected mentees response structure:",
// //             menteesResponse?.data
// //           );
// //         }

// //         // Fetch monthly earnings
// //         const currentMonth = new Date().getMonth();
// //         const paymentsResponse = await getAllPayments(1, 1000);
// //         if (
// //           paymentsResponse &&
// //           paymentsResponse.data &&
// //           paymentsResponse.data.payments
// //         ) {
// //           const payments: Payment[] = paymentsResponse.data.payments;
// //           const earnings = payments.reduce((sum, payment) => {
// //             const paymentDate = new Date(payment.createdAt);
// //             if (
// //               paymentDate.getFullYear() === currentYear &&
// //               paymentDate.getMonth() === currentMonth
// //             ) {
// //               return sum + (payment.amount || 0);
// //             }
// //             return sum;
// //           }, 0);
// //           setMonthlyEarnings(earnings);
// //         } else {
// //           setError("No payments found in the response");
// //           console.error(
// //             "Unexpected payments response structure:",
// //             paymentsResponse?.data
// //           );
// //         }
// //       } catch (err: any) {
// //         const errorMessage = err
// //           ? `API error: ${err.response?.data?.message || err.message}`
// //           : "Unexpected error fetching data";
// //         setError(errorMessage);
// //         console.error("Fetch data error:", err);
// //       } finally {
// //         setLoading(false);
// //       }

// //       fetchData();
// //     };
// //   }, []);

// //   // Monthly chart data
// //   const monthlyChartData = {
// //     labels: [
// //       "Jan",
// //       "Feb",
// //       "Mar",
// //       "Apr",
// //       "May",
// //       "Jun",
// //       "Jul",
// //       "Aug",
// //       "Sep",
// //       "Oct",
// //       "Nov",
// //       "Dec",
// //     ],
// //     datasets: Object.entries(monthlyByService).map(
// //       ([service, counts], index) => ({
// //         label: service,
// //         data: counts,
// //         borderColor: `hsl(${index * 60}, 70%, 50%)`,
// //         backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.2)`,
// //         fill: true,
// //         tension: 0.4,
// //       })
// //     ),
// //   };

// //   // Yearly chart data
// //   const yearlyChartData = {
// //     labels: yearlyBookings.map((item) => item.year.toString()),
// //     datasets: [
// //       {
// //         label: "Bookings",
// //         data: yearlyBookings.map((item) => item.count),
// //         borderColor: "#10b981",
// //         backgroundColor: "rgba(16, 185, 129, 0.2)",
// //         fill: true,
// //         tension: 0.4,
// //       },
// //     ],
// //   };

// //   const chartOptions = {
// //     responsive: true,
// //     plugins: {
// //       legend: { position: "top" as const },
// //       title: { display: true, text: "" },
// //     },
// //     scales: {
// //       y: { beginAtZero: true },
// //     },
// //   };

// //   return (
// //     <div className="flex-1 ml-24 p-8 bg-white">
// //       {/* Header */}
// //       <div className="flex justify-between items-center mb-8">
// //         <h1 className="text-2xl font-bold">Admin Dashboard</h1>
// //         <Input type="search" placeholder="Search" className="w-64" />
// //       </div>

// //       {/* Stats Cards */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
// //         <Card className="p-6">
// //           <h3 className="text-sm text-gray-600 mb-2">Total Mentors</h3>
// //           <p className="text-3xl font-bold">{totalMentors}</p>
// //         </Card>
// //         <Card className="p-6">
// //           <h3 className="text-sm text-gray-600 mb-2">Total Mentees</h3>
// //           <p className="text-3xl font-bold">{totalMentees}</p>
// //         </Card>
// //         <Card className="p-6">
// //           <h3 className="text-sm text-gray-600 mb-2">Monthly Earnings</h3>
// //           <p className="text-3xl font-bold">
// //             ₹{monthlyEarnings.toLocaleString()}
// //           </p>
// //         </Card>
// //         <Card className="p-6">
// //           <h3 className="text-sm text-gray-600 mb-2">Total Bookings</h3>
// //           <p className="text-3xl font-bold">{totalBookings}</p>
// //         </Card>
// //         <Card className="p-6">
// //           <h3 className="text-sm text-gray-600 mb-2">Total Services</h3>
// //           <p className="text-3xl font-bold">{totalServices}</p>
// //         </Card>
// //       </div>

// //       {/* Charts */}
// //       {loading ? (
// //         <p>Loading charts...</p>
// //       ) : error ? (
// //         <p className="text-red-500">{error}</p>
// //       ) : Object.keys(monthlyByService).length === 0 &&
// //         yearlyBookings.length === 0 ? (
// //         <p>No booking data available</p>
// //       ) : (
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //           {/* Monthly Bookings Chart */}
// //           <Card className="p-6">
// //             <h2 className="text-xl font-semibold mb-6">
// //               Monthly Bookings by Service ({new Date().getFullYear()})
// //             </h2>
// //             <div className="h-[300px]">
// //               <Line
// //                 options={{
// //                   ...chartOptions,
// //                   plugins: {
// //                     ...chartOptions.plugins,
// //                     title: {
// //                       display: true,
// //                       text: "Monthly Bookings by Service",
// //                     },
// //                   },
// //                 }}
// //                 data={monthlyChartData}
// //               />
// //             </div>
// //           </Card>

// //           {/* Yearly Bookings Chart */}
// //           <Card className="p-6">
// //             <h2 className="text-xl font-semibold mb-6">Yearly Bookings</h2>
// //             <div className="h-[300px]">
// //               <Line
// //                 options={{
// //                   ...chartOptions,
// //                   plugins: {
// //                     ...chartOptions.plugins,
// //                     title: { display: true, text: "Yearly Bookings" },
// //                   },
// //                 }}
// //                 data={yearlyChartData}
// //               />
// //             </div>
// //           </Card>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default AdminDashboard;
// import React, { useEffect, useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Line } from "react-chartjs-2";
// import {
//   getAllBookings,
//   getAllusers,
//   getAllPayments,
// } from "@/services/adminService";
// import { AxiosResponse } from "axios";

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

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
//   rescheduleRequest: { mentorDecides: boolean; rescheduleStatus: string };
//   updatedAt: string;
//   __v: number;
// }

// interface User {
//   _id: string;
//   role: string;
// }

// interface Payment {
//   _id: string;
//   createdAt: string;
//   amount: number;
// }

// const AdminDashboard: React.FC = () => {
//   const [monthlyByService, setMonthlyByService] = useState<{
//     [key: string]: number[];
//   }>({});
//   const [yearlyBookings, setYearlyBookings] = useState<
//     { year: number; count: number }[]
//   >([]);
//   const [totalMentors, setTotalMentors] = useState<number>(0);
//   const [totalMentees, setTotalMentees] = useState<number>(0);
//   const [monthlyEarnings, setMonthlyEarnings] = useState<number>(0);
//   const [totalBookings, setTotalBookings] = useState<number>(0);
//   const [totalServices, setTotalServices] = useState<number>(0);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const currentYear = new Date().getFullYear(); // Moved to top scope
//         const currentMonth = new Date().getMonth();

//         // Fetch bookings
//         try {
//           const bookingsResponse = await getAllBookings(1, 1000);
//           console.log("Bookings response:", bookingsResponse?.data);
//           if (
//             bookingsResponse &&
//             bookingsResponse.data &&
//             bookingsResponse.data.data
//           ) {
//             const bookings: Booking[] = bookingsResponse.data.data;
//             const monthlyByService: { [key: string]: number[] } = {};
//             const serviceSet = new Set<string>();
//             bookings.forEach((booking) => {
//               const date = new Date(booking.createdAt);
//               if (date.getFullYear() === currentYear) {
//                 const month = date.getMonth();
//                 const service = booking.serviceId?.title || "Unknown";
//                 if (!monthlyByService[service]) {
//                   monthlyByService[service] = Array(12).fill(0);
//                 }
//                 monthlyByService[service][month] += 1;
//               }
//               serviceSet.add(booking.serviceId?.title || "Unknown");
//             });
//             setMonthlyByService(monthlyByService);
//             setTotalBookings(bookings.length);
//             setTotalServices(serviceSet.size);

//             const yearlyMap: { [key: number]: number } = {};
//             bookings.forEach((booking) => {
//               const year = new Date(booking.createdAt).getFullYear();
//               yearlyMap[year] = (yearlyMap[year] || 0) + 1;
//             });
//             const yearlyData = Object.entries(yearlyMap)
//               .map(([year, count]) => ({ year: parseInt(year), count }))
//               .sort((a, b) => a.year - b.year);
//             setYearlyBookings(yearlyData);
//           } else {
//             console.error(
//               "Unexpected bookings response structure:",
//               bookingsResponse?.data
//             );
//             setError((prev) => prev || "No bookings found in the response");
//           }
//         } catch (err) {
//           console.error("Bookings fetch error:", err);
//           setError((prev) => prev || "Failed to fetch bookings");
//         }

//         // Fetch mentors
//         try {
//           const mentorsResponse = await getAllusers(1, 1000, "mentor");
//           console.log("Mentors response:", mentorsResponse?.data);
//           if (
//             mentorsResponse &&
//             mentorsResponse.data &&
//             mentorsResponse.data.data
//           ) {
//             setTotalMentors(mentorsResponse.data.data.length);
//           } else {
//             console.error(
//               "Unexpected mentors response structure:",
//               mentorsResponse?.data
//             );
//             setError((prev) => prev || "No mentors found in the response");
//           }
//         } catch (err) {
//           console.error("Mentors fetch error:", err);
//           setError((prev) => prev || "Failed to fetch mentors");
//         }

//         // Fetch mentees
//         try {
//           const menteesResponse = await getAllusers(1, 1000, "mentee");
//           console.log("Mentees response:", menteesResponse?.data);
//           if (
//             menteesResponse &&
//             menteesResponse.data &&
//             menteesResponse.data.data
//           ) {
//             setTotalMentees(menteesResponse.data.data.length);
//           } else {
//             console.error(
//               "Unexpected mentees response structure:",
//               menteesResponse?.data
//             );
//             setError((prev) => prev || "No mentees found in the response");
//           }
//         } catch (err) {
//           console.error("Mentees fetch error:", err);
//           setError((prev) => prev || "Failed to fetch mentees");
//         }

//         // Fetch monthly earnings
//         try {
//           const paymentsResponse = await getAllPayments(1, 1000);
//           console.log("Payments response:", paymentsResponse?.data);
//           if (
//             paymentsResponse &&
//             paymentsResponse.data &&
//             paymentsResponse.data.payments
//           ) {
//             const payments: Payment[] = paymentsResponse.data.payments;
//             const earnings = payments.reduce((sum, payment) => {
//               const paymentDate = new Date(payment.createdAt);
//               if (
//                 paymentDate.getFullYear() === currentYear &&
//                 paymentDate.getMonth() === currentMonth
//               ) {
//                 return sum + (payment.amount || 0);
//               }
//               return sum;
//             }, 0);
//             setMonthlyEarnings(earnings);
//           } else {
//             console.error(
//               "Unexpected payments response structure:",
//               paymentsResponse?.data
//             );
//             setError((prev) => prev || "No payments found in the response");
//           }
//         } catch (err) {
//           console.error("Payments fetch error:", err);
//           setError((prev) => prev || "Failed to fetch payments");
//         }
//       } catch (err: any) {
//         const errorMessage = err
//           ? `API error: ${err.response?.data?.message || err.message}`
//           : "Unexpected error fetching data";
//         setError((prev) => prev || errorMessage);
//         console.error("Global fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Monthly chart data
//   const monthlyChartData = {
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
//     datasets: Object.entries(monthlyByService).map(
//       ([service, counts], index) => ({
//         label: service,
//         data: counts,
//         borderColor: `hsl(${index * 60}, 70%, 50%)`,
//         backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.2)`,
//         fill: true,
//         tension: 0.4,
//       })
//     ),
//   };

//   // Yearly chart data
//   const yearlyChartData = {
//     labels: yearlyBookings.map((item) => item.year.toString()),
//     datasets: [
//       {
//         label: "Bookings",
//         data: yearlyBookings.map((item) => item.count),
//         borderColor: "#10b981",
//         backgroundColor: "rgba(16, 185, 129, 0.2)",
//         fill: true,
//         tension: 0.4,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: "top" as const },
//       title: { display: true, text: "" },
//     },
//     scales: {
//       y: { beginAtZero: true },
//     },
//   };

//   return (
//     <div className="flex-1 ml-24 p-8 bg-white">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-2xl font-bold">Admin Dashboard</h1>
//         <Input type="search" placeholder="Search" className="w-64" />
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
//         <Card className="p-6">
//           <h3 className="text-sm text-gray-600 mb-2">Total Mentors</h3>
//           <p className="text-3xl font-bold">{totalMentors}</p>
//         </Card>
//         <Card className="p-6">
//           <h3 className="text-sm text-gray-600 mb-2">Total Mentees</h3>
//           <p className="text-3xl font-bold">{totalMentees}</p>
//         </Card>
//         <Card className="p-6">
//           <h3 className="text-sm text-gray-600 mb-2">Monthly Earnings</h3>
//           <p className="text-3xl font-bold">
//             ₹{monthlyEarnings.toLocaleString()}
//           </p>
//         </Card>
//         <Card className="p-6">
//           <h3 className="text-sm text-gray-600 mb-2">Total Bookings</h3>
//           <p className="text-3xl font-bold">{totalBookings}</p>
//         </Card>
//         <Card className="p-6">
//           <h3 className="text-sm text-gray-600 mb-2">Total Services</h3>
//           <p className="text-3xl font-bold">{totalServices}</p>
//         </Card>
//       </div>

//       {/* Charts */}
//       {loading ? (
//         <p>Loading charts...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : Object.keys(monthlyByService).length === 0 &&
//         yearlyBookings.length === 0 ? (
//         <p>No booking data available</p>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Monthly Bookings Chart */}
//           <Card className="p-6">
//             <h2 className="text-xl font-semibold mb-6">
//               Monthly Bookings by Service ({new Date().getFullYear()})
//             </h2>
//             <div className="h-[300px]">
//               <Line
//                 options={{
//                   ...chartOptions,
//                   plugins: {
//                     ...chartOptions.plugins,
//                     title: {
//                       display: true,
//                       text: "Monthly Bookings by Service",
//                     },
//                   },
//                 }}
//                 data={monthlyChartData}
//               />
//             </div>
//           </Card>

//           {/* Yearly Bookings Chart */}
//           <Card className="p-6">
//             <h2 className="text-xl font-semibold mb-6">Yearly Bookings</h2>
//             <div className="h-[300px]">
//               <Line
//                 options={{
//                   ...chartOptions,
//                   plugins: {
//                     ...chartOptions.plugins,
//                     title: { display: true, text: "Yearly Bookings" },
//                   },
//                 }}
//                 data={yearlyChartData}
//               />
//             </div>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  getAllBookings,
  getAllusers,
  getAllPayments,
} from "@/services/adminService";
import { AxiosResponse } from "axios";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
  rescheduleRequest: { mentorDecides: boolean; rescheduleStatus: string };
  updatedAt: string;
  __v: number;
}

interface User {
  _id: string;
  role: string;
}

interface Payment {
  _id: string;
  createdAt: string;
  amount: number;
}

const AdminDashboard: React.FC = () => {
  const [monthlyByService, setMonthlyByService] = useState<{
    [key: string]: number[];
  }>({});
  const [yearlyBookings, setYearlyBookings] = useState<
    { year: number; count: number }[]
  >([]);
  const [totalMentors, setTotalMentors] = useState<number>(0);
  const [totalMentees, setTotalMentees] = useState<number>(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState<number>(0);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [totalServices, setTotalServices] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        // Fetch bookings
        try {
          const bookingsResponse = await getAllBookings(1, 1000);
          console.log("Bookings response:", bookingsResponse?.data);
          if (
            bookingsResponse &&
            bookingsResponse.data &&
            bookingsResponse.data.data
          ) {
            const bookings: Booking[] = bookingsResponse.data.data;
            const monthlyByService: { [key: string]: number[] } = {};
            const serviceSet = new Set<string>();
            bookings.forEach((booking) => {
              const date = new Date(booking.createdAt);
              if (date.getFullYear() === currentYear) {
                const month = date.getMonth();
                const service = booking.serviceId?.title || "Unknown";
                if (!monthlyByService[service]) {
                  monthlyByService[service] = Array(12).fill(0);
                }
                monthlyByService[service][month] += 1;
              }
              serviceSet.add(booking.serviceId?.title || "Unknown");
            });
            setMonthlyByService(monthlyByService);
            setTotalBookings(bookings.length);
            setTotalServices(serviceSet.size);

            const yearlyMap: { [key: number]: number } = {};
            bookings.forEach((booking) => {
              const year = new Date(booking.createdAt).getFullYear();
              yearlyMap[year] = (yearlyMap[year] || 0) + 1;
            });
            const yearlyData = Object.entries(yearlyMap)
              .map(([year, count]) => ({ year: parseInt(year), count }))
              .sort((a, b) => a.year - b.year);
            setYearlyBookings(yearlyData);
          } else {
            console.error(
              "Unexpected bookings response structure:",
              bookingsResponse?.data
            );
            setError((prev) => prev || "No bookings found in the response");
          }
        } catch (err) {
          console.error("Bookings fetch error:", err);
          setError((prev) => prev || "Failed to fetch bookings");
        }

        // Fetch mentors
        try {
          const mentorsResponse = await getAllusers(1, 1000, "mentor");
          console.log("Mentors response: step 1", mentorsResponse);
          if (
            mentorsResponse &&
            mentorsResponse.data &&
            mentorsResponse.data.data
          ) {
            console.log(
              "Mentees response: step 2",
              mentorsResponse?.data.data.total
            );
            setTotalMentors(mentorsResponse.data.data.total);
          } else {
            console.error(
              "Unexpected mentors response structure:",
              mentorsResponse?.data
            );
            setError((prev) => prev || "No mentors found in the response");
          }
        } catch (err) {
          console.error("Mentors fetch error:", err);
          setError((prev) => prev || "Failed to fetch mentors");
        }

        // Fetch mentees
        try {
          const menteeResponse = await getAllusers(1, 1000, "mentee");
          console.log("Mentees response: step 1", menteeResponse);

          if (
            menteeResponse &&
            menteeResponse.data &&
            menteeResponse.data.data
          ) {
            console.log(
              "Mentees response: step 2",
              menteeResponse?.data.data.total
            );
            setTotalMentees(menteeResponse.data.data.total);
          } else {
            console.error(
              "Unexpected mentees response structure:",
              menteeResponse?.data
            );
            setError((prev) => prev || "No mentees found in the response");
          }
        } catch (err) {
          console.error("Mentees fetch error:", err);
          setError((prev) => prev || "Failed to fetch mentees");
        }

        // Fetch monthly earnings
        try {
          const paymentsResponse = await getAllPayments(1, 1000);
          console.log("Payments response:", paymentsResponse?.data);
          if (paymentsResponse && paymentsResponse.data) {
            const payments: Payment[] = paymentsResponse.data.data; // Changed to .data
            const earnings = payments.reduce((sum, payment) => {
              const paymentDate = new Date(payment.createdAt);
              if (
                paymentDate.getFullYear() === currentYear &&
                paymentDate.getMonth() === currentMonth
              ) {
                return sum + (payment.amount || 0);
              }
              return sum;
            }, 0);
            setMonthlyEarnings(earnings);
          } else {
            console.error(
              "Unexpected payments response structure:",
              paymentsResponse?.data
            );
            setError((prev) => prev || "No payments found in the response");
          }
        } catch (err) {
          console.error("Payments fetch error:", err);
          setError((prev) => prev || "Failed to fetch payments");
        }
      } catch (err: any) {
        const errorMessage = err
          ? `API error: ${err.response?.data?.message || err.message}`
          : "Unexpected error fetching data";
        setError((prev) => prev || errorMessage);
        console.error("Global fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Monthly chart data
  const monthlyChartData = {
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
    datasets: Object.entries(monthlyByService).map(
      ([service, counts], index) => ({
        label: service,
        data: counts,
        borderColor: `hsl(${index * 60}, 70%, 50%)`,
        backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.2)`,
        fill: true,
        tension: 0.4,
      })
    ),
  };

  // Yearly chart data
  const yearlyChartData = {
    labels: yearlyBookings.map((item) => item.year.toString()),
    datasets: [
      {
        label: "Bookings",
        data: yearlyBookings.map((item) => item.count),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="flex-1 ml-24 p-8 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total Users</h3>
          <p className="text-3xl font-bold">{totalMentees}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Monthly Earnings</h3>
          <p className="text-3xl font-bold">
            ₹{monthlyEarnings.toLocaleString()}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold">{totalBookings}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total Services</h3>
          <p className="text-3xl font-bold">{totalServices}</p>
        </Card>
      </div>

      {/* Charts */}
      {loading ? (
        <p>Loading charts...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : Object.keys(monthlyByService).length === 0 &&
        yearlyBookings.length === 0 ? (
        <p>No booking data available</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Bookings Chart */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">
              Monthly Bookings by Service ({new Date().getFullYear()})
            </h2>
            <div className="h-[300px]">
              <Line
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: true,
                      text: "Monthly Bookings by Service",
                    },
                  },
                }}
                data={monthlyChartData}
              />
            </div>
          </Card>

          {/* Yearly Bookings Chart */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Yearly Bookings</h2>
            <div className="h-[300px]">
              <Line
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { display: true, text: "Yearly Bookings" },
                  },
                }}
                data={yearlyChartData}
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
