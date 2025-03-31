import React from "react";
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

const MentorDashboard = lazy(
  () => import("../pages/mentorPages/MentorDashboard")
);
const MentorRouter: React.FC = () => {
  return (
    <Suspense fallback={<h1>loaidng</h1>}>
      <Routes>
        <Route path="/dashboard" element={<MentorDashboard />} />
      </Routes>
    </Suspense>
  );
};

export default MentorRouter;
