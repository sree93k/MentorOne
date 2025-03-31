// src/components/login-form.tsx
import { useState } from "react";
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
import { Mail, Lock } from "lucide-react";
import { TUserLogin, TUserLoginError } from "@/types/user";
import { validateEmail, validatePassword } from "@/utils/UserValidator";
import { login } from "../../../services/userAuthService";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setUser,
  setIsAuthenticated,
  setAccessToken,
} from "@/redux/slices/userSlice";
import { ForgotPasswordModal } from "@/components/modal/ResetPasswordModal"; // Ensure correct import

// Backend service functions (replace with actual implementations)
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
  const [loading, setLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    let newErrors: TUserLoginError = {};
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;
    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (validateForm()) {
      const data: TUserLogin = { role: [tab], email, password };
      try {
        const result = await login(data);
        const responseData = result.response;

        if (responseData) {
          toast.success("Login successfully!");
          const { user, accessToken } = responseData;
          localStorage.setItem("accessToken", accessToken);
          dispatch(setUser(user));
          dispatch(setIsAuthenticated(true));
          navigate(
            tab === "mentee" ? "/seeker/dashboard" : "/expert/dashboard"
          );
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
    <div
      className={cn("flex flex-col gap-6", className)}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    >
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="relative hidden bg-muted md:flex md:flex-col md:items-center md:justify-center md:p-8">
            <div className="flex flex-col items-center gap-1 pt-4 mb-4">
              <img src={Logo} alt="Logo" className="h-20 w-20 object-contain" />
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
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="mentee">Mentee</TabsTrigger>
                <TabsTrigger value="mentor">Mentor</TabsTrigger>
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
                {/* {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )} */}
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
                    type="password"
                    required
                    value={password}
                    onChange={handleChange("password")}
                    className="pl-10"
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && (
                  // <p className="text-sm text-red-500">{errors.password}</p>
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
          "email send for forgopt passoerd login tsx step 1";
          await sendForgotPasswordOtp(email);
          toast.success("OTP sent to your email!");
        }}
        onVerifyOtp={async (otp: string, email: string) => {
          setVerifying(true);
          try {
            console.log("entered on verify otp start 1 loginpage", email, otp);

            await verifyForgotPasswordOtp({ email, otp });
            console.log("otp veritfied step 2");

            toast.success("OTP verified!");
          } catch (error) {
            console.error("Verification error:", error);
            toast.error(
              error instanceof Error
                ? error.message
                : "OTP verification failed. Please try again."
            );
            throw error;
          } finally {
            setVerifying(false);
          }
        }}
        onResetPassword={async (email: string, password: string) => {
          setVerifying(true);
          try {
            console.log("onResetPassword verification start 1");

            await resetPassword({ email, password });
            console.log("onResetPassword verification  end");

            toast.success("Password reset successfully!");
            navigate("/signin");
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
            toast.error("Failed to resend OTP.");
          }
        }}
        verifying={verifying}
      />
      <Toaster position="top-right" />
    </div>
  );
}
