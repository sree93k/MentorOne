import React from "react";
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
// import LoadingSpinner from "../common/LoadingSpinner";
import PrivateRoute from "@/components/auth/UserPrivateRoute";
import PublicRoute from "@/components/auth/UserPublicRoute";
import LoadingModal from "@/components/modal/LoadingModal";
const LandingPage = lazy(() => import("../pages/landingPage/LandingPage"));
const SigninPage = lazy(() => import("../pages/userAuth/Signin"));
const SignupPage = lazy(() => import("../pages/userAuth/Signup"));
const MenteeRoute = lazy(() => import("./MenteeRouter"));
const MentorRoute = lazy(() => import("./MentorRouter"));
const UserRouter = lazy(() => import("./UserRouter"));
// const BlockedPage = lazy(() => import("../pages/usersPage/BlockedPage"));
import BlockedPage from "../pages/public/BlockedPage";
import AppealForm from "../pages/public/AppealForm";
const AppealStatusPage = lazy(() => import("../pages/public/AppealStatusPage"));
//==>>>>>>>>>>
const AuthRouter: React.FC = () => {
  return (
    <Suspense fallback={<LoadingModal />}>
      {/* <LoadingOverlay /> */}

      <Routes>
        <Route path="/" element={<PublicRoute element={LandingPage} />} />
        <Route path="/login" element={<PublicRoute element={SigninPage} />} />
        <Route path="/signup" element={<PublicRoute element={SignupPage} />} />
        <Route
          path="/seeker/*"
          element={<PrivateRoute element={MenteeRoute} />}
        />
        <Route
          path="/expert/*"
          element={<PrivateRoute element={MentorRoute} />}
        />
        <Route path="/user/*" element={<PrivateRoute element={UserRouter} />} />
        <Route path="/blocked" element={<BlockedPage />} />
        <Route path="/appeal/submit" element={<AppealForm />} />
        <Route path="/appeal/status/:appealId" element={<AppealStatusPage />} />
      </Routes>
    </Suspense>
  );
};

export default AuthRouter;
