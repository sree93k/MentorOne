// src/components/login-form.tsx
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "../../../assets/LoginImg.jpg";
import Logo from "../../../assets/logo.png";
import LogoName from "../../../assets/brandlogo.png";
import { Link } from "react-router-dom";
import GoogleAuthButton from "../GoogleAuthButton";

import { TUserLogin, TUserLoginError } from "@/types/user";
import { validateEmail, validatePassword } from "@/utils/UserValidator";
import { login } from "../../../services/userAuthService";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { EyeIcon, EyeOffIcon, Mail, Lock } from "lucide-react";
import {
  setUser,
  setIsAuthenticated,
  setAccessToken,
  setCurrentTab,
  setMentorActivated,
  setLoading,
} from "@/redux/slices/userSlice";
import { ForgotPasswordModal } from "@/components/modal/ResetPasswordModal";
import {
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
} from "@/services/userAuthService";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [tab, setTab] = useState("mentee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<TUserLoginError>({});
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mentorActivated } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    console.log("hi useeffect is", mentorActivated);
  }, []);

  const handleChange =
    (field: keyof TUserLoginError) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (field === "email") setEmail(value);
      if (field === "password") setPassword(value);
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const validateForm = () => {
    const newErrors: TUserLoginError = {};
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;
    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setLoading(true));

    try {
      if (!validateForm()) {
        toast.error("Invalid input. Please check your details.");
        return;
      }

      const loginData: TUserLogin = { role: [tab], email, password };
      console.log("Submitting login data:", loginData);

      const result = await login(loginData);
      console.log("result is ", result);

      const { userFound, accessToken } = result.response;

      if (!userFound || !accessToken) {
        throw new Error("Login response missing user or token");
      }

      dispatch(setUser(userFound));
      dispatch(setIsAuthenticated(true));
      dispatch(setAccessToken(accessToken));
      dispatch(setCurrentTab(tab));
      console.log(
        "logni page userFound.mentorActivated",
        userFound.mentorActivated
      );

      dispatch(setMentorActivated(userFound.mentorActivated));
      localStorage.setItem("accessToken", accessToken);
      toast.success(`Welcome, ${userFound.firstName || "User"}!`);
      console.log("step 1 response mentorstats,,....>>", mentorActivated);
      const redirectPath =
        tab === "mentee" ? "/seeker/dashboard" : "/expert/dashboard";
      navigate(redirectPath);
    } catch (error: unknown) {
      console.error("Login error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(
        errorMessage === "Login failed"
          ? "Invalid email or password"
          : errorMessage
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="relative hidden bg-muted md:flex md:flex-col md:items-center md:justify-center md:p-8">
            <div className="flex flex-col items-center gap-1 pt-4 mb-4">
              <Link to="/">
                <img
                  src={Logo}
                  alt="Logo"
                  className="h-20 w-20 object-contain"
                />
              </Link>
              <img
                src={LogoName}
                alt="Logo Name"
                className="h-20 w-66 object-contain"
              />
            </div>
            <img
              src={Image}
              alt="Login Image"
              className="h-64 w-64 object-cover rounded-lg"
            />
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col items-center text-center mb-4">
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-balance text-muted-foreground">
                Login to your {tab.charAt(0).toUpperCase() + tab.slice(1)}{" "}
                Account
              </p>
            </div>

            <Tabs
              value={tab}
              onValueChange={setTab as (value: string) => void}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6 gap-2">
                <TabsTrigger
                  value="mentee"
                  className={cn(
                    "border border-black transition-colors",
                    tab === "mentee"
                      ? "bg-black text-white"
                      : "bg-transparent text-black hover:bg-gray-100"
                  )}
                >
                  Mentee
                </TabsTrigger>
                <TabsTrigger
                  value="mentor"
                  className={cn(
                    "border border-black transition-colors",
                    tab === "mentor"
                      ? "bg-black text-white"
                      : "bg-transparent text-black hover:bg-gray-100"
                  )}
                >
                  Mentor
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <input type="hidden" name="role" value={tab} />
              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={handleChange("email")}
                    className="pl-10"
                    placeholder="e.g., sreekuttan1234@gmail.com"
                  />
                </div>
              </div>

              <div className="grid gap-1">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(true)}
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={handleChange("password")}
                    className="pl-10 pr-10"
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button" // Explicitly set type to "button" to prevent form submission
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOffIcon size={16} />
                    ) : (
                      <EyeIcon size={16} />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">
                    Invalid EmailID or Password
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full bg-black text-white">
                Login
              </Button>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <GoogleAuthButton />
              </div>
              <div className="text-center text-sm">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-indigo-600 hover:underline">
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a> of MENTOR ONE.
      </div>

      <ForgotPasswordModal
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
        email={email}
        onSubmitEmail={async (email: string) => {
          const response1 = await sendForgotPasswordOtp(email);
          console.log("response1", response1);
          dispatch(setLoading(false));
          if (response1.statusCode === 200) {
            toast.success("OTP sent to your email!");
          } else {
            toast.error(response1?.data || "Invalid Email");
            throw new Error(response1?.data || "Invalid Email");
          }
        }}
        onVerifyOtp={async (otp: string, email: string) => {
          setVerifying(true);
          try {
            const response = await verifyForgotPasswordOtp({ email, otp });
            // Check the response to determine if OTP is valid
            if (response?.status === 200 && response.data.success) {
              console.log("OTP verified successfully");
              toast.success("OTP verified!");
            } else {
              throw new Error(response?.data?.message || "Invalid OTP");
            }
          } catch (error) {
            console.error("Verification error:", error);
            toast.error(
              error instanceof Error
                ? error.message
                : "OTP verification failed. Please try again."
            );
            throw error; // Re-throw to be caught in ForgotPasswordModal
          } finally {
            setVerifying(false);
          }
        }}
        onResetPassword={async (email: string, password: string) => {
          setVerifying(true);
          try {
            console.log("onResetPassword verification start 1");
            const response = await resetPassword({ email, password });
            console.log("onResetPassword verification end Loginpage", response);
            toast.success("Password reset successfully!");
            navigate("/login");
          } catch (error) {
            console.error("Reset password error:", error);
            toast.error(
              error instanceof Error
                ? error.message
                : "Failed to reset password. Please try again."
            );
          } finally {
            setVerifying(false);
          }
        }}
        onResendOtp={async (email: string) => {
          try {
            await sendForgotPasswordOtp(email);
            toast.success("OTP resent successfully!");
          } catch (error) {
            console.log("error", error);

            toast.error("Failed to resend OTP.");
          }
        }}
        verifying={verifying}
      />
      <Toaster position="top-right" />
    </div>
  );
}
