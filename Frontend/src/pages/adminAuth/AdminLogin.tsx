import React from "react";

import { AuthPageProps } from "../../types/dashboard";
import AdminLoginForm from "@/components/auth/AuthForm/AdminSignInForm";
const AdminLogin: React.FC<AuthPageProps> = () => {
  return (
    <div>
      <AdminLoginForm />
    </div>
  );
};

export default AdminLogin;
