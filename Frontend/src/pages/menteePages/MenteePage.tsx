import React from "react";
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

import MenteeBillingPage from "./subPages/MenteePayment";
import BookingsPage from "./subPages/MenteeBookings";
import MentorProfilePage from "./subPages/MentorProfilePage";
import MentorServicePage from "./subPages/MentorServicePage";
import MentorsList from "./subPages/MentorsList";
import MenteeCourses from "./subPages/MenteeCourses";
import VideoTutorialPage from "./subPages/VideoTutorial";
import DigitalProducts from "./subPages/DigitalProduct";
import StripeCheckoutPage from "@/pages/menteePages/subPages/StripeCheckoutPage";
import VideoCallHome from "@/pages/usersPage/VideoCallHome";
import VideoCallMeeting from "@/pages/usersPage/VideoCallMeeting";
import VideoCallEndPage from "@/pages/usersPage/VideoCallEndPage";
import VideoCallJoinPage from "@/pages/usersPage/VideoCallJoinPage";
//=======
const Footer = lazy(() => import("@/components/landing/Footer"));
const MenteeHeader = lazy(() => import("@/components/mentee/MenteeHeader"));
const MenteeSidebar = lazy(() => import("@/components/mentee/MenteeSidebar"));
const MenteeDashboard = lazy(() => import("./subPages/MenteeDashboard"));
const MenteeProfile = lazy(() => import("./subPages/MenteeProfile"));
const MentorsPage = lazy(() => import("./subPages/MentorsPage"));

const CoursePage = lazy(() => import("./subPages/CoursePage"));
const BlogPage = lazy(() => import("../usersPage/BlogPage"));
const BlogPostPage = lazy(() => import("../usersPage/BlogPost"));

const MenteePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MenteeHeader />
      <MenteeSidebar />
      <main className="ml-24 p-8">
        <Suspense fallback={<h1>Loading...</h1>}>
          <Routes>
            <Route path="/dashboard" element={<MenteeDashboard />} />
            <Route path="/profile" element={<MenteeProfile />} />
            <Route path="/mentor" element={<MentorsPage />} />
            <Route path="/menteecourses" element={<MenteeCourses />} />
            <Route path="/payment" element={<MenteeBillingPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/mentorprofile/:id" element={<MentorProfilePage />} />
            <Route path="/mentorservice" element={<MentorServicePage />} />
            <Route path="/mentors" element={<MentorsList />} />
            <Route path="/courses" element={<CoursePage />} />
            <Route path="/digitalcontent/:id" element={<DigitalProducts />} />
            <Route path="/tutorials/:id" element={<VideoTutorialPage />} />
            <Route path="/checkout" element={<StripeCheckoutPage />} />
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

export default MenteePage;
