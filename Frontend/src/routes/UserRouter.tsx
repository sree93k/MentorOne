// import React from "react";
// import { Route, Routes } from "react-router-dom";
// import { lazy, Suspense } from "react";

// import VideoCallHome from "@/pages/usersPage/VideoCallHome";
// import VideoCallMeeting from "@/pages/usersPage/VideoCallMeeting";
// import VideoCallEndPage from "@/pages/usersPage/VideoCallEndPage";
// import { MeetingProvider } from "@/contexts/MeetingContext";

// const BlogPage = lazy(() => import("../pages/usersPage/BlogPage"));
// const BlogPostPage = lazy(() => import("../pages/usersPage/BlogPost"));
// const UserRouter: React.FC = () => {
//   return (
//     <Routes>
//       <Route path="/blog" element={<BlogPage />} />
//       <Route path="/BlogPost" element={<BlogPostPage />} />

//       <Route path="/meetinghome" element={<VideoCallHome />} />
//       <Route path="/meeting/:id" element={<VideoCallMeeting />} />
//       <Route path="/meetingend" element={<VideoCallEndPage />} />
//     </Routes>
//   );
// };

// export default UserRouter;
// //not using.....
import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import VideoCallHome from "@/pages/usersPage/VideoCallHome";
import VideoCallMeeting from "@/pages/usersPage/VideoCallMeeting";
import VideoCallEndPage from "@/pages/usersPage/VideoCallEndPage";
import { MeetingProvider } from "@/contexts/MeetingContext";

// Lazy-loaded components
const BlogPage = lazy(() => import("../pages/usersPage/BlogPage"));
const BlogPostPage = lazy(() => import("../pages/usersPage/BlogPost"));

const MeetingRoutesWrapper: React.FC = () => {
  return (
    <MeetingProvider>
      <Routes>
        <Route path="/meetinghome" element={<VideoCallHome />} />
        <Route path="/meeting/:id" element={<VideoCallMeeting />} />
        <Route path="/meeting-end/:id" element={<VideoCallEndPage />} />
      </Routes>
    </MeetingProvider>
  );
};

const UserRouter: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Non-meeting routes */}
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/BlogPost" element={<BlogPostPage />} />

        {/* Meeting-related routes wrapped with context */}
        <Route path="/*" element={<MeetingRoutesWrapper />} />
      </Routes>
    </Suspense>
  );
};

export default UserRouter;
