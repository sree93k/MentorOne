import React, { useState, useEffect } from "react";
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
import { DashboardDataResponseDTO } from "@/types/admin";

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

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] =
    useState<DashboardDataResponseDTO | null>(null);
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(setError(null));
    dispatch(setLoading(true));

    const fetchData = async () => {
      try {
        const response = await getDashboardData();
        if (response) {
          setDashboardData(response);
        } else {
          dispatch(setError("Failed to fetch dashboard data"));
        }
      } catch (err) {
        dispatch(setError("Unexpected error fetching dashboard data"));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [dispatch]);

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
    datasets: dashboardData?.bookings.monthlyByService
      ? Object.entries(dashboardData.bookings.monthlyByService).map(
          ([service, counts], index) => ({
            label: service,
            data: counts,
            borderColor: `hsl(${index * 60}, 70%, 50%)`,
            backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.2)`,
            fill: true,
            tension: 0.4,
          })
        )
      : [],
  };

  // Yearly chart data
  const yearlyChartData = {
    labels:
      dashboardData?.bookings.yearlyBookings.map((item) =>
        item.year.toString()
      ) || [],
    datasets: [
      {
        label: "Bookings",
        data:
          dashboardData?.bookings.yearlyBookings.map((item) => item.count) ||
          [],
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

  const renderSkeletonLoader = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          Baking
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
        No Payments or Bookings Yet
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2 text-center max-w-md">
        It looks like there are no payments or bookings to display. Start by
        creating a new booking to see your data here!
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total Users</h3>
          <p className="text-3xl font-bold">
            {(dashboardData?.users.totalMentors || 0) +
              (dashboardData?.users.totalMentees || 0)}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Monthly Earnings</h3>
          <p className="text-3xl font-bold">
            ₹{(dashboardData?.payments.monthlyEarnings || 0).toLocaleString()}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold">
            {dashboardData?.bookings.total || 0}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total Services</h3>
          <p className="text-3xl font-bold">
            {dashboardData?.bookings.totalServices || 0}
          </p>
        </Card>
      </div>

      {/* Charts */}
      {loading ? (
        renderSkeletonLoader()
      ) : !dashboardData ||
        (Object.keys(dashboardData.bookings.monthlyByService).length === 0 &&
          dashboardData.bookings.yearlyBookings.length === 0) ? (
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
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
