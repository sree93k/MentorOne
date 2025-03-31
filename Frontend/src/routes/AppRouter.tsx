import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";

const AdminRoute = lazy(() => import("./AdminRouter"));
const MenteeRoute = lazy(() => import("./MenteeRouter"));
const MentorRoute = lazy(() => import("./MentorRouter"));
const AuthRouter = lazy(() => import("./AuthRouter"));

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/*" element={<AuthRouter />} />
      <Route path="/admin/*" element={<AdminRoute />} />
      <Route path="/seeker/*" element={<MenteeRoute />} />
      <Route path="/expert/*" element={<MentorRoute />} />
    </Routes>
  );
};

export default AppRouter;
