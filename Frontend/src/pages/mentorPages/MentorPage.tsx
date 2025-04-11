import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

// import Welcome from "@/components/mentor/ZDemoWelcome2";
import WelcomeModal from "@/components/mentor/MentorWelcomeModal";

const Footer = lazy(() => import("@/components/landing/Footer"));
const MentorSidebar = lazy(() => import("@/components/mentor/MentorSidebar"));
const MentorHeader = lazy(() => import("@/components/mentor/MentorHeader"));
const MentorDashboard = lazy(() => import("./MentorSubPages/MentorDashboard"));
const MentorProfile = lazy(() => import("./MentorSubPages/MentorProfile"));

//Mentee Dashboard
export const MentorPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <MentorHeader />
      {/* Sidebar */}
      <MentorSidebar />
      {/* Main Content */}
      <main className="ml-15 px-8">
        {/* <MenteeDashboard /> */}
        <Suspense fallback={<h1>loaidng</h1>}>
          <Routes>
            <Route path="/dashboard" element={<MentorDashboard />} />
            <Route path="/profile" element={<MentorProfile />} />
            {/* <Route path="/welcome" element={<Welcome />} /> */}
            {/* <Route path="/WelcomeModal" element={<WelcomeModal />} /> */}
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default MentorPage;
