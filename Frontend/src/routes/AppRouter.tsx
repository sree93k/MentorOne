import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingModal from "@/components/modal/LoadingModal";
const AdminRoute = lazy(() => import("./AdminRouter"));
const AuthRouter = lazy(() => import("./AuthRouter"));

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/*" element={<AuthRouter />} />
      <Route path="/admin/*" element={<AdminRoute />} />
    </Routes>
  );
};

export default AppRouter;
