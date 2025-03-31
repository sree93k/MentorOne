import React from "react";
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
// import LoadingSpinner from "../common/LoadingSpinner";
import PrivateRoute from "@/components/auth/AdminPrivateRoute";
import PublicRoute from "@/components/auth/AdminPublicRoute";
const AdminSigninPage = lazy(() => import("../pages/adminAuth/AdminLogin"));
// const AdminDashboard = lazy(() => import("../pages/adminPages/AdminDashboard"));
const AdminPage = lazy(() => import("@/pages/adminPages/AdminPage"));

const AdminRouter: React.FC = () => {
  return (
    <Suspense fallback={<h1>loaidng</h1>}>
      <Routes>
        <Route
          path="/login"
          element={<PublicRoute element={AdminSigninPage} />}
        />
        <Route path="/*" element={<PrivateRoute element={AdminPage} />} />
        {/* <Route path="/dashboard" element={<AdminDashboard />} /> */}
      </Routes>
    </Suspense>
  );
};

export default AdminRouter;
