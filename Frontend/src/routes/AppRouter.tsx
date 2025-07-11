import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";

const AuthRouter = lazy(() => import("./AuthRouter"));
const AdminRoute = lazy(() => import("./AdminRouter"));

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/*" element={<AuthRouter />} />
      <Route path="/admin/*" element={<AdminRoute />} />
    </Routes>
  );
};

export default AppRouter;
