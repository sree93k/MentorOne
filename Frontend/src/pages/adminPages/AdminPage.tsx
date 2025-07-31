import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import BookingsPage from "./adminSubPages/BookingPage";
import TransactionsPage from "./adminSubPages/TransactionPage";
import AdminHeader from "@/components/admin/AdminHeader";
// import SampleProfile from "../../pages/adminPages/adminSubPages/SampleProfile";
const AppealsDashboard = lazy(() => import("./appeals/AppealsDashboard"));
const AppealReview = lazy(() => import("./appeals/AppealReview"));
const AdminDashboard = lazy(() => import("./adminSubPages/AdminDashboard"));
const AdminSidebar = lazy(() => import("@/components/admin/AdminSideBar"));
const AllUsers = lazy(() => import("./adminSubPages/AdminAllUsers"));
const UserProfile = lazy(() => import("./adminSubPages/UserProfile"));

const AdminPage: React.FC = () => {
  return (
    <div className=" min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader />
      <AdminSidebar />

      <main className="flex-1 max-w-full p-6">
        <Suspense fallback={<h1>Loading...</h1>}>
          <Routes>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/users" element={<AllUsers />} />
            <Route path="/userProfile/:id" element={<UserProfile />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            {/* <Route path="/sampleProfile" element={<SampleProfile />} /> */}
            {/* Default redirect to dashboard */}
            <Route path="/appeals" element={<AppealsDashboard />} />
            <Route path="/appeals/:appealId" element={<AppealReview />} />
            <Route path="/" element={<Navigate to="dashboard" replace />} />

            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default AdminPage;
