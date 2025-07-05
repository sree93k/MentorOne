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
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import { setError, setLoading } from "@/redux/slices/adminSlice";
// import {
//   getAllBookings,
//   getAllusers,
//   getAllPayments,
//   getDashboardData
// } from "@/services/adminService";
// import { ChevronDown, CalendarX, Check } from "lucide-react";
// import { getDashboardData } from '../../../services/menteeService';
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
//     <div className="flex-1 ml-24 p-8 bg-white">
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
import { getDashboardData } from "@/services/adminService";
import { CalendarX } from "lucide-react";

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
  role: string[];
}

interface Payment {
  _id: string;
  createdAt: string;
  amount: number;
}

interface Service {
  _id: string;
  title: string;
  type: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [monthlyByService, setMonthlyByService] = useState<{
    [key: string]: number[];
  }>({});
  const [yearlyBookings, setYearlyBookings] = useState<
    { year: number; count: number }[]
  >([]);
  const [monthlyServices, setMonthlyServices] = useState<{
    [key: string]: number[];
  }>({});
  const [totalMentors, setTotalMentors] = useState<number>(0);
  const [totalMentees, setTotalMentees] = useState<number>(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState<number>(0);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [totalServices, setTotalServices] = useState<number>(0);

  const dispatch = useDispatch();
  const { error, loading } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(setError(null));
    dispatch(setLoading(true));

    const fetchData = async () => {
      try {
        const response = await getDashboardData();

        if (response && response.data && response.data.data) {
          const { users, bookings, payments, services } = response.data.data;

          // Process users
          const mentors = users.filter((user: User) =>
            user.role.includes("mentor")
          ).length;
          const mentees = users.filter((user: User) =>
            user.role.includes("mentee")
          ).length;
          setTotalMentors(mentors);
          setTotalMentees(mentees);

          // Process bookings
          const currentYear = new Date().getFullYear();
          const monthlyByService: { [key: string]: number[] } = {};
          const serviceSet = new Set<string>();
          const yearlyMap: { [key: number]: number } = {};

          bookings.forEach((booking: Booking) => {
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
            const year = date.getFullYear();
            yearlyMap[year] = (yearlyMap[year] || 0) + 1;
          });

          setMonthlyByService(monthlyByService);
          setTotalBookings(bookings.length);
          setTotalServices(serviceSet.size);

          const yearlyData = Object.entries(yearlyMap)
            .map(([year, count]) => ({ year: parseInt(year), count }))
            .sort((a, b) => a.year - b.year);
          setYearlyBookings(yearlyData);

          // Process payments
          const currentMonth = new Date().getMonth();
          const earnings = payments.reduce((sum: number, payment: Payment) => {
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

          // Process services
          const monthlyServicesData: { [key: string]: number[] } = {};
          services.forEach((service: Service) => {
            const date = new Date(service.createdAt);
            if (date.getFullYear() === currentYear) {
              const month = date.getMonth();
              const serviceType = service.type || "Unknown";
              if (!monthlyServicesData[serviceType]) {
                monthlyServicesData[serviceType] = Array(12).fill(0);
              }
              monthlyServicesData[serviceType][month] += 1;
            }
          });
          setMonthlyServices(monthlyServicesData);
        } else {
          dispatch(setError("No data found in the response"));
        }
      } catch (err: any) {
        const errorMessage = err
          ? `API error: ${err.response?.data?.message || err.message}`
          : "Unexpected error fetching data";
        dispatch(setError(errorMessage));
        console.error("Global fetch error:", err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [dispatch]);

  // Monthly bookings chart data
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

  // Yearly bookings chart data
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

  // Monthly services chart data
  const monthlyServicesChartData = {
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
    datasets: Object.entries(monthlyServices).map(
      ([serviceType, counts], index) => ({
        label: serviceType,
        data: counts,
        borderColor: `hsl(${index * 80}, 70%, 50%)`,
        backgroundColor: `hsla(${index * 80}, 70%, 50%, 0.2)`,
        fill: true,
        tension: 0.4,
      })
    ),
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

  const renderSkeletonLoader = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <svg
        className="h-16 w-16 text-red-400 mb-4"
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
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
        Something went wrong
      </h2>
      <p className="text-red-500 dark:text-red-400 mt-2">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  const renderNoCharts = () => (
    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <CalendarX className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4 animate-bounce" />
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
        No Data Available
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2 text-center max-w-md">
        It looks like there are no bookings or services to display. Start by
        creating a new booking or service to see your data here!
      </p>
    </div>
  );

  return (
    <div className="flex-1 ml-24 p-8 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total Users</h3>
          <p className="text-3xl font-bold">{totalMentees + totalMentors}</p>
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
        renderSkeletonLoader()
      ) : Object.keys(monthlyByService).length === 0 &&
        yearlyBookings.length === 0 &&
        Object.keys(monthlyServices).length === 0 ? (
        renderNoCharts()
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

          {/* Monthly Services Chart */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">
              Monthly Services by Type ({new Date().getFullYear()})
            </h2>
            <div className="h-[300px]">
              <Line
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: true,
                      text: "Monthly Services by Type",
                    },
                  },
                }}
                data={monthlyServicesChartData}
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
