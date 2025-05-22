import { EOTP } from "../../entities/OTPEntity";
import { EUsers } from "../../entities/userEntity";

export interface IOTPService {
  sendOTP(user: EUsers): Promise<EOTP | null>;
  verifyEmailOTP(otp: EOTP, email: EUsers): Promise<EOTP | null>;
  checkOTPExists(user: EUsers): Promise<EOTP | null>;
}
