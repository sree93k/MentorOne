import React from "react";
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

const Footer = lazy(() => import("@/components/landing/Footer"));
const MenteeHeader = lazy(() => import("@/components/mentee/MenteeHeader"));
const MenteeSidebar = lazy(() => import("@/components/mentee/MenteeSidebar"));
const MenteeDashboard = lazy(() => import("./subPages/MenteeDashboard"));
const MenteeProfile = lazy(() => import("./subPages/MenteeProfile"));

const MenteePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <MenteeHeader />

      {/* Sidebar */}
      <MenteeSidebar />
      {/* Main Content */}
      <main className="ml-24 p-8">
        {/* <MenteeDashboard /> */}
        <Suspense fallback={<h1>loaidng</h1>}>
          <Routes>
            <Route path="/dashboard" element={<MenteeDashboard />} />
            <Route path="/profile" element={<MenteeProfile />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default MenteePage;
