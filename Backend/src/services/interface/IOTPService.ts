import { EOTP } from "../../entities/OTPEntity";
import { EUsers } from "../../entities/userEntity";

export interface IOTPService {
  sendOTP(user: EUsers): Promise<EOTP | null>;
  verifyEmailOTP(otp: EOTP, email: Partial<EUsers>): Promise<EOTP | null>;
  checkOTPExists(user: Partial<EUsers>): Promise<EOTP | null>;
  getUserData(email: string): Promise<EUsers | null>;
}
