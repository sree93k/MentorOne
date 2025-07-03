import { EUsers } from "../../entities/userEntity";
import { EOTP } from "../../entities/OTPEntity";

export interface IOTPRepository {
  saveOTP(otp: EOTP): Promise<EOTP | null>;
  deleteOTPsByEmail(email: string): Promise<void>;
  findOTP(email: string): Promise<EOTP | null>;
  userData(email: string): Promise<EUsers | null>;
}
