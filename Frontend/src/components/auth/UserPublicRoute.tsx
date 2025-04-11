import React from "react";
import { Navigate } from "react-router-dom";
import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { RollerCoasterIcon } from "lucide-react";

interface PublicRouteProps {
  element: React.ComponentType;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ element: Element }) => {
  const { isAuthenticated, currentTab } = useSelector(
    (state: RootState) => state.user
  );
  console.log("user public route...", isAuthenticated, "user :", currentTab);

  // If not authenticated, render the public component (e.g., login page)
  if (!isAuthenticated || !currentTab) {
    return <Element />;
  }
  console.log("user role", currentTab);

  // Redirect based on role
  // const role = user.role; // Access role from user object
  console.log(currentTab === "mentee");
  if (currentTab === "mentee") {
    return <Navigate to="/seeker/dashboard" />;
  } else if (currentTab === "mentor") {
    return <Navigate to="/expert/dashboard" />;
  }

  // Fallback: if role is neither mentee nor mentor (shouldn't happen), redirect to a generic dashboard
  return <Navigate to="/dashboard" />;
  // return isAuthenticated ? <Navigate to="/dashboard" /> : <Element />;
};

export default PublicRoute;
