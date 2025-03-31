export interface EmailVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onVerify: (otp: string) => void;
  onResendOtp: () => void;
  onReportIssue: () => void;
  verifying?: boolean; // Add this
}
