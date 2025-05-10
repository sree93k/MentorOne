// import React, { lazy, Suspense } from "react";
// import { Route, Routes } from "react-router-dom";

// import VideoCallHome from "@/pages/usersPage/VideoCallHome";
// import VideoCallMeeting from "@/pages/usersPage/VideoCallMeeting";
// import VideoCallEndPage from "@/pages/usersPage/VideoCallEndPage";
// import { MeetingProvider } from "@/contexts/MeetingContext";
// import VideoCallJoinPage from "@/pages/usersPage/VideoCallJoinPage";
// // Lazy-loaded components
// const BlogPage = lazy(() => import("../pages/usersPage/BlogPage"));
// const BlogPostPage = lazy(() => import("../pages/usersPage/BlogPost"));

// const MeetingRoutesWrapper: React.FC = () => {
//   return (
//     <MeetingProvider>
//       <Routes>
//         <Route path="/meetinghome" element={<VideoCallHome />} />
//         <Route path="/meeting/:id" element={<VideoCallMeeting />} />
//         <Route path="/meeting-end/:id" element={<VideoCallEndPage />} />
//         <Route path="/meeting-join/:id" element={<VideoCallJoinPage />} />
//       </Routes>
//     </MeetingProvider>
//   );
// };

// const UserRouter: React.FC = () => {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <Routes>
//         {/* Non-meeting routes */}
//         <Route path="/blog" element={<BlogPage />} />
//         <Route path="/BlogPost" element={<BlogPostPage />} />

//         {/* Meeting-related routes wrapped with context */}
//         <Route path="/*" element={<MeetingRoutesWrapper />} />
//       </Routes>
//     </Suspense>
//   );
// };

// export default UserRouter;

//==========================================================================================
import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import VideoCallHome from "@/pages/usersPage/VideoCallHome";
import VideoCallMeeting from "@/pages/usersPage/VideoCallMeeting";
import VideoCallEndPage from "@/pages/usersPage/VideoCallEndPage";
import VideoCallJoinPage from "@/pages/usersPage/VideoCallJoinPage";
import { MeetingProvider } from "@/contexts/MeetingContext";

// Lazy-loaded components
const BlogPage = lazy(() => import("../pages/usersPage/BlogPage"));
const BlogPostPage = lazy(() => import("../pages/usersPage/BlogPost"));

// const MeetingRoutesWrapper: React.FC = () => {
//   return (
//     <MeetingProvider>
//       <Routes>
//         <Route path="/meetinghome" element={<VideoCallHome />} />
//         <Route path="/meeting/:meetingId" element={<VideoCallMeeting />} />
//         <Route path="/meeting/end/:meetingId" element={<VideoCallEndPage />} />
//         <Route
//           path="/meeting-join/:meetingId"
//           element={<VideoCallJoinPage />}
//         />
//       </Routes>
//     </MeetingProvider>
//   );
// };

// const UserRouter: React.FC = () => {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <Routes>
//         {/* Non-meeting routes */}
//         <Route path="/blog" element={<BlogPage />} />
//         <Route path="/blog/:id" element={<BlogPostPage />} />

//         {/* Meeting-related routes wrapped with context */}
//         <Route path="/*" element={<MeetingRoutesWrapper />} />
//       </Routes>
//     </Suspense>
//   );
// };
const MeetingRoutesWrapper: React.FC = () => {
  return (
    <MeetingProvider>
      <Routes>
        <Route path="/meeting/:meetingId" element={<VideoCallMeeting />} />
        <Route path="/meeting-end/:meetingId" element={<VideoCallEndPage />} />
        <Route
          path="/meeting-join/:meetingId"
          element={<VideoCallJoinPage />}
        />
      </Routes>
    </MeetingProvider>
  );
};

const UserRouter: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPostPage />} />
        <Route path="/meetinghome" element={<VideoCallHome />} />
        <Route path="/*" element={<MeetingRoutesWrapper />} />
      </Routes>
    </Suspense>
  );
};

export default UserRouter;
