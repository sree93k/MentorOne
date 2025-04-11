import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "../../../assets/SignupImg2.jpg";
import Logo from "../../../assets/logo.png";
import LogoName from "../../../assets/brandlogo.png";
import { Link } from "react-router-dom";
import { EmailVerificationModal } from "@/components/modal/OTPModal";
import { sentOTP, signUp } from "../../../services/userAuthService";
import {
  validateEmail,
  validateFullName,
  validatePassword,
  validatePhoneNumber,
} from "@/utils/UserValidator";
import { TUserSignUpError } from "@/types/user";
import toast, { Toaster } from "react-hot-toast";
import { Mail, Lock, User, Phone } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setUser,
  setIsAuthenticated,
  setAccessToken,
  setCurrentTab,
} from "@/redux/slices/userSlice";
export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [tab, setTab] = useState("mentee");
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<TUserSignUpError>({}); // Add errors state
  const [loading, setLoading] = useState(false); // Add loading state
  const [verifying, setVerifying] = useState(false);

  const navigate = useNavigate();
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    const trimmedValue = value.trim();
    const parts = trimmedValue.split(/\s+/);
    setFirstName(parts[0] || "");
    setLastName(parts.slice(1).join(" ") || "");
    if (errors.username) {
      setErrors((prev) => ({ ...prev, username: undefined }));
    }
  };
  const dispatch = useDispatch();
  const handleChange =
    (field: keyof TUserSignUpError) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (field === "email") setEmail(value);
      if (field === "password") setPassword(value);
      if (field === "confirmPassword") setConfirmPassword(value);
      if (field === "phone") setPhoneNumber(value);
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const validateForm = () => {
    let newErrors: TUserSignUpError = {};

    const fullNameError = validateFullName(username);
    if (fullNameError) newErrors.username = fullNameError;

    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    const phoneError = validatePhoneNumber(phone);
    if (phoneError) newErrors.phone = phoneError;

    if (!gender) newErrors.gender = "Please select a gender";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (validateForm()) {
      const userData = {
        gender,
        role: [tab] as [string],
        firstName,
        lastName,
        email,
        password,
        phone,
      };

      console.log("user dats is ", userData);

      try {
        const response = await sentOTP(userData);
        if (response && response.status === 200) {
          toast.success("OTP sent successfully!");
          setOpen(true);
        } else {
          toast.error(response.error);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred. Please try again.");
      }
    } else {
      toast.error("Please fill valid input data.");
    }
    setLoading(false);
  };

  return (
    <>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-6 md:p-8">
              <div className="flex flex-col items-center text-center mb-2">
                <h1 className="text-2xl font-bold">Welcome Master One</h1>
                <p className="text-balance text-muted-foreground">
                  Create New {tab.charAt(0).toUpperCase() + tab.slice(1)}{" "}
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
                  <Label htmlFor="username">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={username}
                      onChange={handleUsernameChange}
                      className="pl-10"
                    />
                  </div>
                  {errors.username && (
                    <p className="text-sm text-red-500">{errors.username}</p>
                  )}
                </div>
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
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label>Gender</Label>
                  <RadioGroup
                    name="gender"
                    value={gender}
                    onValueChange={setGender}
                    className="flex flex-row gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="cursor-pointer">
                        Male
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="cursor-pointer">
                        Female
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other" className="cursor-pointer">
                        Other
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.gender && (
                    <p className="text-sm text-red-500">{errors.gender}</p>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      required
                      value={phone}
                      onChange={handleChange("phone")}
                      className="pl-10"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="password">Password</Label>
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
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={handleChange("confirmPassword")}
                      className="pl-10"
                      placeholder="Confirm your password"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-black text-white"
                  disabled={loading}
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-indigo-600 hover:underline">
                    Sign In
                  </Link>
                </div>
              </form>
            </div>
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
                  className="h-20 w-64 object-contain"
                />
              </div>
              <img
                src={Image}
                alt="Signup Image"
                className="h-64 w-64 object-cover rounded-lg"
              />
            </div>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a> of
          MENTOR ONE.
        </div>
      </div>
      <EmailVerificationModal
        open={open}
        onOpenChange={setOpen}
        email={email}
        onVerify={async (otp) => {
          setVerifying(true);
          try {
            const verificationData = { email, otp };
            const response = await signUp(verificationData);
            const { userFound, accessToken } = response;
            if (!userFound || !accessToken) {
              throw new Error("Login response missing user or token");
            }
            dispatch(setUser(userFound));
            dispatch(setIsAuthenticated(true));
            dispatch(setAccessToken(accessToken));
            dispatch(setCurrentTab(tab));
            localStorage.setItem("accessToken", accessToken);
            toast.success(`Welcome, ${userFound.firstName || "User"}!`);
            const redirectPath =
              tab === "mentee" ? "/seeker/dashboard" : "/expert/dashboard";
            navigate(redirectPath);
          } catch (error) {
            console.error("Verification error:", error);
            toast.error(
              error instanceof Error
                ? error.message
                : "OTP verification failed. Please try again."
            );
          } finally {
            setVerifying(false);
          }
        }}
        onResendOtp={async () => {
          const userData = {
            gender,
            role: [tab] as [string],
            firstName,
            lastName,
            email,
            password,
            phone,
          };
          try {
            await sentOTP(userData);
            toast.success("OTP resent successfully!");
          } catch (error) {
            console.error("Failed to resend OTP:", error);
            toast.error("Failed to resend OTP.");
          }
        }}
        onReportIssue={() => toast.success("Issue reported!")}
        verifying={verifying}
      />
      <Toaster position="top-right" />
    </>
  );
}
