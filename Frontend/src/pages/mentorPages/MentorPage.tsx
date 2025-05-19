import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

import ServicesPage from "./MentorSubPages/MentorServices";
import CreateService from "./MentorSubPages/CreateServices";
import MentorPaymentsPage from "./MentorSubPages/MentorPayment";
import BookingsPage from "./MentorSubPages/BookingPage";
import PriorityDMPage from "./MentorSubPages/PriorityDMPage";
import TestimonialPage from "./MentorSubPages/TestimonialPage";
import CalendarPage from "./MentorSubPages/CalenderPage";
import ServiceEditPage from "./MentorSubPages/ServiceEditPage";
import VideoCallHome from "@/pages/usersPage/VideoCallHome";
import VideoCallMeeting from "@/pages/usersPage/VideoCallMeeting";
import VideoCallEndPage from "@/pages/usersPage/VideoCallEndPage";
import VideoCallJoinPage from "@/pages/usersPage/VideoCallJoinPage";
//=======
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
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/createService" element={<CreateService />} />
            <Route path="/payment" element={<MentorPaymentsPage />} />
            <Route path="/booking" element={<BookingsPage />} />
            <Route path="/prioritydm" element={<PriorityDMPage />} />
            <Route path="/testimonials" element={<TestimonialPage />} />
            <Route path="/calender" element={<CalendarPage />} />
            <Route path="/editService/:id" element={<ServiceEditPage />} />
            <Route path="/meetinghome" element={<VideoCallHome />} />
            <Route path="/meeting/:meetingId" element={<VideoCallMeeting />} />
            <Route
              path="/meeting-end/:meetingId"
              element={<VideoCallEndPage />}
            />
            <Route
              path="/meeting-join/:meetingId"
              element={<VideoCallJoinPage />}
            />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default MentorPage;
