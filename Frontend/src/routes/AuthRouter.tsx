import React from "react";
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
// import LoadingSpinner from "../common/LoadingSpinner";

const LandingPage = lazy(() => import("../pages/landingPage/LandingPage"));
const SigninPage = lazy(() => import("../pages/userAuth/Signin"));
const SignupPage = lazy(() => import("../pages/userAuth/Signup"));
const AuthRouter: React.FC = () => {
  return (
    <Suspense fallback={<h1>loaidng</h1>}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Suspense>
  );
};

export default AuthRouter;
