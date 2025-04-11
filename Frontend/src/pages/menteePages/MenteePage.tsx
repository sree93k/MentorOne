import React from "react";
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

const Footer = lazy(() => import("@/components/landing/Footer"));
const MenteeHeader = lazy(() => import("@/components/mentee/MenteeHeader"));
const MenteeSidebar = lazy(() => import("@/components/mentee/MenteeSidebar"));
const MenteeDashboard = lazy(() => import("./subPages/MenteeDashboard"));
const MenteeProfile = lazy(() => import("./subPages/MenteeProfile"));
const MentorsPage = lazy(() => import("./subPages/MentorsPage"));
const MentorProfile = lazy(() => import("./subPages/MentorsProfile"));
const CoursePage = lazy(() => import("./subPages/CoursePage"));
const BlogPage = lazy(() => import("../usersPage/BlogPage"));
const BlogPostPage = lazy(() => import("../usersPage/BlogPost"));

const MenteePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* <div className="min-h-screen bg-gray-50 dark:bg-red-500"></div> */}
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
            <Route path="/mentors" element={<MentorsPage />} />
            <Route path="/mentorprofile" element={<MentorProfile />} />
            <Route path="/courses" element={<CoursePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blogpost" element={<BlogPostPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default MenteePage;
