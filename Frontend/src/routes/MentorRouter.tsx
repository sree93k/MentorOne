import React from "react";
import { Route, Routes } from "react-router-dom";
import { lazy } from "react";

const MentorPage = lazy(() => import("../pages/mentorPages/MentorPage"));
const MentorRouter: React.FC = () => {
  return (
    // <Suspense fallback={<h1>loaidng</h1>}>
    <Routes>
      <Route path="/*" element={<MentorPage />} />
    </Routes>
    // </Suspense>
  );
};

export default MentorRouter;
