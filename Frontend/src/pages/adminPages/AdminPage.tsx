import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import SampleProfile from "../../pages/adminPages/adminSubPages/SampleProfile";
const AdminDashboard = lazy(() => import("./adminSubPages/AdminDashboard"));
const AdminSidebar = lazy(() => import("@/components/admin/AdminSideBar"));
const AllUsers = lazy(() => import("./adminSubPages/AdminAllUsers"));
const UserProfile = lazy(() => import("./adminSubPages/UserProfile"));

const AdminPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 max-w-full p-6">
        <Suspense fallback={<h1>Loading...</h1>}>
          <Routes>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/allUsers" element={<AllUsers />} />
            <Route path="/userProfile/:id" element={<UserProfile />} />
            <Route path="/sampleProfile" element={<SampleProfile />} />
            {/* Default redirect to dashboard */}
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default AdminPage;
