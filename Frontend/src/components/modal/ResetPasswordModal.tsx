"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { OtpInput } from "./OTPInput";

export interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email?: string;
  onSubmitEmail: (email: string) => Promise<void>;
  onVerifyOtp: (otp: string, email: string) => Promise<void>;
  onResetPassword: (email: string, newPassword: string) => Promise<void>;
  onResendOtp: (email: string) => Promise<void>;
  verifying?: boolean;
}

export function ForgotPasswordModal({
  open,
  onOpenChange,
  email: initialEmail = "",
  onSubmitEmail,
  onVerifyOtp,
  onResetPassword,
  onResendOtp,
  verifying = false,
}: ForgotPasswordModalProps) {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setStep("email");
      setEmail(initialEmail);
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setResendTimer(0);
      setOtpError(null);
    }
  }, [open, initialEmail]);

  // Set timer when entering OTP step
  useEffect(() => {
    if (step === "otp") {
      setResendTimer(60);
    }
  }, [step]);

  // Timer countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "otp" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);

  const handleEmailSubmit = async () => {
    if (!email) return;
    try {
      await onSubmitEmail(email);
      setStep("otp");
    } catch (error) {
      console.error("Failed to send OTP:", error);
      // Optionally, add an error message for the user here
    }
  };

  const handleOtpVerify = async () => {
    if (otp.length !== 5) return;
    try {
      setOtpError(null); // Clear any previous error
      await onVerifyOtp(otp, email); // Wait for verification
      setStep("reset"); // Only proceed if successful
    } catch (error) {
      console.error("OTP verification failed:", error);
      setOtpError("Invalid OTP. Please try again."); // Show error to user
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      console.error("Passwords do not match");
      // Optionally, add a password mismatch error state here
      return;
    }
    try {
      await onResetPassword(email, newPassword);
      onOpenChange(false); // Close modal on success
    } catch (error) {
      console.error("Failed to reset password:", error);
      // Optionally, add an error message for the user here
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer === 0 && email) {
      try {
        await onResendOtp(email);
        setResendTimer(60);
      } catch (error) {
        console.error("Failed to resend OTP:", error);
      }
    }
  };

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, "$1****$3");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-t-4 border-b-4 border-blue-600 rounded-lg p-0 bg-white">
        <div className="p-6">
          {step === "email" ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-left">
                  Forgot Password
                </DialogTitle>
              </DialogHeader>
              <div className="mt-6">
                <Label htmlFor="forgot-email">Enter your email</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g., sreekuttan1234@gmail.com"
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-gray-700 mt-2">
                  We’ll send you an OTP to reset your password.
                </p>
              </div>
            </>
          ) : step === "otp" ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-left">
                  Verify OTP
                </DialogTitle>
              </DialogHeader>
              <div className="bg-green-100 rounded-md p-4 my-6 flex items-start gap-3">
                <div className="bg-white rounded-full p-2 mt-1">
                  <Mail className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-gray-700">
                  Enter the 5-digit OTP sent to ({maskedEmail})
                </p>
              </div>
              <OtpInput value={otp} onChange={setOtp} length={5} />
              {/* {otpError && (
                <p className="text-red-600 text-sm mt-2">{otpError}</p>
              )} */}
              <div className="mt-4 text-sm">
                <p className="text-gray-700">
                  Didn’t receive OTP? Resend in{" "}
                  {resendTimer > 0 ? (
                    <span>{resendTimer}s</span>
                  ) : (
                    <button
                      onClick={handleResendOtp}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Resend OTP
                    </button>
                  )}
                </p>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-left">
                  Reset Password
                </DialogTitle>
              </DialogHeader>
              <div className="mt-6 flex flex-col gap-4">
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <DialogFooter className="flex flex-row justify-between p-4 bg-gray-50 rounded-b-lg">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full px-8"
          >
            Cancel
          </Button>
          {step === "email" ? (
            <Button
              onClick={handleEmailSubmit}
              disabled={!email}
              className="rounded-full px-8 bg-blue-600 hover:bg-blue-700"
            >
              Send OTP
            </Button>
          ) : step === "otp" ? (
            <Button
              onClick={handleOtpVerify}
              disabled={otp.length !== 5 || verifying}
              className="rounded-full px-8 bg-blue-600 hover:bg-blue-700"
            >
              {verifying ? "Verifying..." : "Verify OTP"}
            </Button>
          ) : (
            <Button
              onClick={handleResetPassword}
              disabled={
                !newPassword || newPassword !== confirmPassword || verifying
              }
              className="rounded-full px-8 bg-blue-600 hover:bg-blue-700"
            >
              {verifying ? "Resetting..." : "Reset Password"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
