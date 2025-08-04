// import React, { useEffect, useState } from "react";
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
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import { setError, setLoading } from "@/redux/slices/adminSlice";
// import {
//   getAllBookings,
//   getAllusers,
//   getAllPayments,
// } from "@/services/adminService";
// import { CalendarX } from "lucide-react";
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
// declare global {
//   interface Window {
//     testCookies: () => Promise<void>;
//   }
// }
// window.testCookies = async (): Promise<void> => {
//   try {
//     console.log("🍪 === FRONTEND COOKIE TEST ===");
//     console.log("🍪 Document cookies before:", document.cookie);

//     const response = await fetch("http://localhost:5002/admin/test-cookies", {
//       method: "GET",
//       credentials: "include", // This is equivalent to withCredentials: true
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const data = await response.json();
//     console.log("🍪 Test response:", data);
//     console.log("🍪 Document cookies after:", document.cookie);

//     // Check response headers
//     console.log("🍪 Response headers:");
//     response.headers.forEach((value, key) => {
//       console.log(`🍪   ${key}: ${value}`);
//     });
//   } catch (error) {
//     console.error("🍪 Cookie test failed:", error);
//   }
// };
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

//   const dispatch = useDispatch();
//   const { error, loading } = useSelector((state: RootState) => state.admin);

//   useEffect(() => {
//     dispatch(setError(null));
//     dispatch(setLoading(false));
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const currentYear = new Date().getFullYear();
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
//           console.log("Mentors response: step 1", mentorsResponse);
//           if (
//             mentorsResponse &&
//             mentorsResponse.data &&
//             mentorsResponse.data.data
//           ) {
//             console.log(
//               "Mentees response: step 2",
//               mentorsResponse?.data.data.total
//             );
//             setTotalMentors(mentorsResponse.data.data.total);
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
//           const menteeResponse = await getAllusers(1, 1000, "mentee");
//           console.log("Mentees response: step 1", menteeResponse);

//           if (
//             menteeResponse &&
//             menteeResponse.data &&
//             menteeResponse.data.data
//           ) {
//             console.log(
//               "Mentees response: step 2",
//               menteeResponse?.data.data.total
//             );
//             setTotalMentees(menteeResponse.data.data.total);
//           } else {
//             console.error(
//               "Unexpected mentees response structure:",
//               menteeResponse?.data
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
//           if (paymentsResponse && paymentsResponse.data) {
//             const payments: Payment[] = paymentsResponse.data.data; // Changed to .data
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

//   const renderSkeletonLoader = () => (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
//       {[...Array(2)].map((_, i) => (
//         <div
//           key={i}
//           className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
//         >
//           <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
//           <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
//         </div>
//       ))}
//     </div>
//   );

//   const renderErrorState = () => (
//     <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
//       <svg
//         className="h-16 w-16 text-red-400 mb-4"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//         />
//       </svg>
//       <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
//         Something went wrong
//       </h2>
//       <p className="text-red-500 dark:text-red-400 mt-2">{error}</p>
//       <button
//         onClick={() => window.location.reload()}
//         className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//       >
//         Try Again
//       </button>
//     </div>
//   );

//   const renderNoCharts = () => (
//     <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
//       <CalendarX className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4 animate-bounce" />
//       <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
//         No Payments or Bookings Yet
//       </h2>
//       <p className="text-gray-500 dark:text-gray-400 mt-2 text-center max-w-md">
//         It looks like there are no payments or bookings to display. Start by
//         creating a new booking to see your data here!
//       </p>
//       <a className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
//         No New Charts
//       </a>
//     </div>
//   );

//   return (
//     <div className="flex-1 ml-24 p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-2xl font-bold">Admin Dashboard</h1>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
//         <Card className="p-6">
//           <h3 className="text-sm text-gray-600 mb-2">Total Users</h3>
//           <p className="text-3xl font-bold">{totalMentees + totalMentors}</p>
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
//         renderSkeletonLoader()
//       ) : Object.keys(monthlyByService).length === 0 &&
//         yearlyBookings.length === 0 ? (
//         renderNoCharts()
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
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import { setError, setLoading } from "@/redux/slices/adminSlice";
import {
  getAllBookings,
  getAllusers,
  getAllPayments,
} from "@/services/adminService";
import {
  CalendarX,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  Activity,
  BarChart3,
  Briefcase,
  RefreshCw,
  Download,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
} from "lucide-react";

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

declare global {
  interface Window {
    testCookies: () => Promise<void>;
  }
}

window.testCookies = async (): Promise<void> => {
  try {
    console.log("🍪 === FRONTEND COOKIE TEST ===");
    console.log("🍪 Document cookies before:", document.cookie);

    const response = await fetch("http://localhost:5002/admin/test-cookies", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("🍪 Test response:", data);
    console.log("🍪 Document cookies after:", document.cookie);

    response.headers.forEach((value, key) => {
      console.log(`🍪   ${key}: ${value}`);
    });
  } catch (error) {
    console.error("🍪 Cookie test failed:", error);
  }
};

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

  const dispatch = useDispatch();
  const { error, loading } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(setError(null));
    dispatch(setLoading(false));
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
            const payments: Payment[] = paymentsResponse.data.data;
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
        borderColor: `hsl(${index * 60 + 200}, 70%, 50%)`,
        backgroundColor: `hsla(${index * 60 + 200}, 70%, 50%, 0.1)`,
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: `hsl(${index * 60 + 200}, 70%, 50%)`,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
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
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: "#6366f1",
        pointBorderColor: "#fff",
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
      title: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
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
    },
    elements: {
      point: {
        hoverBackgroundColor: "#fff",
      },
    },
  };

  const renderSkeletonLoader = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
        >
          <div className="h-6 bg-gray-200 rounded-lg w-1/3 mb-6"></div>
          <div className="h-80 bg-gray-200 rounded-xl"></div>
        </div>
      ))}
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <svg
          className="h-10 w-10 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-red-600 mb-6 text-center max-w-md">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );

  const renderNoCharts = () => (
    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
        <CalendarX className="h-10 w-10 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No Data Available Yet
      </h3>
      <p className="text-gray-600 text-center max-w-md mb-6">
        It looks like there are no payments or bookings to display. Start by
        creating bookings to see your analytics here!
      </p>
      <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
        <Zap className="h-4 w-4" />
        Get Started
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="ml-24 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Monitor your platform's performance and analytics
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">
                    Total Users
                  </p>
                  <p className="text-3xl font-bold text-blue-900">
                    {totalMentees + totalMentors}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">
                      +12% this month
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">
                    Monthly Earnings
                  </p>
                  <p className="text-3xl font-bold text-green-900">
                    ₹{monthlyEarnings.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">
                      +8% this month
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">
                    Total Bookings
                  </p>
                  <p className="text-3xl font-bold text-purple-900">
                    {totalBookings}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">
                      +15% this month
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
            <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 mb-1">
                    Total Services
                  </p>
                  <p className="text-3xl font-bold text-orange-900">
                    {totalServices}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">
                      +5% this month
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        {loading ? (
          renderSkeletonLoader()
        ) : Object.keys(monthlyByService).length === 0 &&
          yearlyBookings.length === 0 ? (
          renderNoCharts()
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Monthly Bookings Chart */}
            <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Monthly Bookings by Service
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Performance overview for {new Date().getFullYear()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="h-80">
                  <Line
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        title: {
                          display: false,
                        },
                      },
                    }}
                    data={monthlyChartData}
                  />
                </div>
              </div>
            </Card>

            {/* Yearly Bookings Chart */}
            <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Yearly Bookings Trend
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Historical booking performance
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Activity className="h-4 w-4 text-indigo-600" />
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="h-80">
                  <Line
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        title: { display: false },
                      },
                    }}
                    data={yearlyChartData}
                  />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
