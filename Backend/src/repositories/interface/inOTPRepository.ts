import { EUsers } from "../../entities/userEntity";
import { EOTP } from "../../entities/OTPEntity";

export interface inOTPRepository {
  saveOTP(otp: EOTP): Promise<EOTP | null>;
  deleteOTPsByEmail(email: string): Promise<void>;
  findOTP(user: Partial<EUsers>): Promise<EOTP | null>;
  userData(email: Partial<EUsers>): Promise<EUsers | null>;
}
