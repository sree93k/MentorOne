import React from "react";
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

const MenteePage = lazy(() => import("../pages/menteePages/MenteePage"));

const MenteeRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/*" element={<MenteePage />} />
    </Routes>
  );
};

export default MenteeRouter;
