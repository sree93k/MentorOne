import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LogoImage from "@/assets/logo.png";
import LogoNameImage from "@/assets/brandlogo.png";
import SideImage from "@/assets/AdminLogin.jpg";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "@/services/adminAuth";
import { TAdminLoginResponse, TAdminLogin } from "@/types/admin";
import { loginValidate } from "@/utils/AdminValidator";
import {
  setLoading,
  setAdmin,
  setIsAuthenticated,
  setAccessToken,
} from "@/redux/slices/adminSlice";
import { RootState } from "@/redux/store/store";
import { EyeIcon, EyeOffIcon } from "lucide-react";
interface LoginError {
  adminEmail?: string;
  adminPassword?: string;
}

const AdminLoginForm: React.FC = () => {
  const [adminEmail, setEmail] = useState("");
  const [adminPassword, setPassword] = useState("");
  const [error, setError] = useState<LoginError>({});
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useSelector((state: RootState) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("useEffect ");
  }, []);
  console.log("store>>");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setLoading(true));
    console.log("submit 1");

    const formattedErrors = loginValidate({
      adminEmail,
      adminPassword,
    }) as LoginError;
    console.log("submit 2");
    if (formattedErrors) {
      console.log("submit 3");
      setTimeout(() => {
        dispatch(setLoading(false));
        setError(formattedErrors);
      }, 1000);
      console.log("submit 4");
    } else {
      console.log("submit 5");
      setError({});
      console.log("submit 6");
      const data: TAdminLogin = { adminEmail, adminPassword };
      console.log("submit 7");
      const response: TAdminLoginResponse = await adminLogin(data);
      console.log("submit 8", response);
      console.log("response success", response.success);
      console.log("repsonse data", response.data);

      if (response.success && response.data) {
        toast.success("Welcome Admin");
        console.log("submit 9");
        const { adminFound, accessToken } = response.data;
        console.log("user>>", adminFound); // Fixed: comma inside parentheses
        console.log("accesstoken", accessToken);
        console.log("LOGIN success>>>>>> respnse ", response);
        console.log("LOGIN success>>>>>> accesstoken ", accessToken);

        dispatch(setAdmin(adminFound));
        console.log();

        dispatch(setIsAuthenticated(true));
        dispatch(setAccessToken(accessToken));
        localStorage.setItem("accessToken", accessToken);

        navigate("/admin/dashboard");
      } else {
        console.log("submit 10");
        setError({
          adminEmail: response.error,
          adminPassword: response.error,
        });
        dispatch(setLoading(false));
      }
    }
  };

  return (
    <main className="relative w-full min-h-screen bg-white bg-cover bg-no-repeat">
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
              Welcome Master One!
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
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email ID"
                    className="h-[53px] bg-white text-black text-base text-left"
                  />
                </div>

                <div className="space-y-2 relative">
                  <label
                    htmlFor="password"
                    className="text-2xl block font-normal"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={adminPassword}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="h-[53px] bg-white text-black text-base pr-12" // add padding right for the icon
                    />
                    <span
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOffIcon size={20} />
                      ) : (
                        <EyeIcon size={20} />
                      )}
                    </span>
                  </div>
                  {error.adminPassword && (
                    <p className="text-white">{error.adminPassword}</p>
                  )}
                </div>

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
