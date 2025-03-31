import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LogoImage from "@/assets/logo.png";
import LogoNameImage from "@/assets/brandlogo.png";
import SideImage from "@/assets/AdminLogin.jpg";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminLogin } from "@/services/adminAuth";
import { TAdminLoginError, TAdminLogin } from "@/types/admin";
import { validateEmail, validatePassword } from "@/utils/UserValidator";
import {
  setUser,
  setIsAuthenticated,
  setAccessToken,
} from "@/redux/slices/userSlice";

const AdminLoginForm: React.FC = () => {
  const [adminEmail, setEmail] = useState("");
  const [adminPassword, setPassword] = useState("");
  const [errors, setErrors] = useState<TAdminLoginError>({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange =
    (field: keyof TAdminLoginError) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (field === "adminEmail") setEmail(value);
      if (field === "adminPassword") setPassword(value);
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const validateForm = () => {
    let newErrors: TAdminLoginError = {};
    const emailError = validateEmail(adminEmail);
    if (emailError) newErrors.adminEmail = emailError;
    const passwordError = validatePassword(adminPassword);
    if (passwordError) newErrors.adminPassword = passwordError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (validateForm()) {
      const data: TAdminLogin = { adminEmail, adminPassword };
      try {
        const result = await adminLogin(data);
        const responseData = result.response;

        if (responseData) {
          toast.success("Login successfully!");
          const { admin, accessToken } = responseData;
          localStorage.setItem("accessToken", accessToken);
          dispatch(setUser(admin));
          dispatch(setIsAuthenticated(true));
          navigate("/admin/dashboard");
        } else {
          toast.error("Some Error Occurred. Please try again!");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Invalid Username or Password");
      }
    } else {
      toast.error("Invalid Input");
    }
    setLoading(false);
  };

  return (
    <main
      className={`relative w-full min-h-screen bg-white bg-cover bg-no-repeat `}
    >
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between py-12 px-4 bg-white m-20">
        {/* Left side with logo and illustration */}
        <div className="flex flex-col items-start mb-8 lg:mb-0">
          <div className="flex items-center mb-8">
            <img
              className="w-[137px] h-[137px] object-cover"
              alt="Mentor ONE Logo"
              src={LogoImage}
            />
            <img
              className="w-[396px] h-[99px] object-cover ml-4"
              alt="Mentor ONE"
              src={LogoNameImage}
            />
          </div>
          <img
            className="w-full max-w-[497px] h-auto object-cover"
            alt="Collaboration Illustration"
            src={SideImage}
          />
        </div>

        {/* Right side with login form */}
        <Card className="w-full max-w-[597px] bg-[#e44332] rounded-[20px] text-white border-none">
          <CardContent className="p-12">
            <h1 className="text-4xl font-bold text-center mb-12 font-sans">
              Welcome Master One !
            </h1>

            <div className="space-y-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-2xl block font-normal">
                    Email ID
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={adminEmail}
                    onChange={handleChange("adminEmail")}
                    placeholder="Email ID"
                    className="h-[53px] bg-white text-black text-base text-left"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-2xl block font-normal"
                  >
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={adminPassword}
                    onChange={handleChange("adminPassword")}
                    placeholder="Password"
                    className="h-[53px] bg-white text-black text-base text-left"
                  />
                </div>

                {/* <div className="text-center">
                <button className="text-xl font-extralight">
                  Forgot password ?
                </button>
              </div> */}

                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    className="w-[199px] h-[72px] bg-white text-black text-2xl font-normal hover:bg-gray-100"
                  >
                    Login
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster position="top-right" />
    </main>
  );
};

export default AdminLoginForm;
