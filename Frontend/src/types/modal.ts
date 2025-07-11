export interface EmailVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onVerify: (otp: string) => void;
  onResendOtp: () => void;
  onReportIssue: () => void;
  verifying?: boolean; // Add this
}

export interface WelcomeModalForm1Props {
  open: boolean;
  email: string;
  onOpenChange: (open: boolean) => void;
  onSubmit?: boolean; // Add this
}
