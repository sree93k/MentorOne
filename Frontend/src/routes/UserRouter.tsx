import React from "react";
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

const BlogPage = lazy(() => import("../pages/usersPage/BlogPage"));
const BlogPostPage = lazy(() => import("../pages/usersPage/BlogPost"));
const UserRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/BlogPost" element={<BlogPostPage />} />
    </Routes>
  );
};

export default UserRouter;
//not using.....
