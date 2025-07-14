import { EOTP } from "../../entities/OTPEntity";
import { EUsers } from "../../entities/userEntity";
import { IOTPRepository } from "../../repositories/interface/IOTPRepository";
import { IOTPService } from "../interface/IOTPService";
import OTPRepository from "../../repositories/implementations/OTPRepository";
import { sendMail } from "../../utils/emailService";
import OTPModel from "../../models/otpModel";
import UserModel from "../../models/userModel";
import bcrypt from "bcryptjs";

export default class OTPService implements IOTPService {
  private OTPRepository: IOTPRepository;

  constructor() {
    this.OTPRepository = new OTPRepository();
  }

  async sendOTP(user: EUsers): Promise<EOTP | null> {
    try {
      console.log("otp sent service 1");
      if (!user?.email) {
        throw new Error("User email is null");
      }
      const userData = await this.OTPRepository.userData(user.email);
      if (userData?.isBlocked) {
        throw new Error("Account is Blocked");
      }
      await this.OTPRepository.deleteOTPsByEmail(user.email);
      let newUser;
      const OTPNumber = Math.floor(10000 + Math.random() * 90000).toString();
      const expirationTime = new Date(Date.now() + 1 * 60000);
      if (user.password) {
        const hashedPassword = await bcrypt.hash(user.password.toString(), 10);
        newUser = new UserModel({
          ...user,
          password: hashedPassword,
        });
      }
      console.log("user sent sevioce 1.5 user>>>", user);
      console.log("otp sent service 2", newUser);
      const OTP = new OTPModel({
        email: user.email?.toString() || "",
        user: newUser,
        otp: OTPNumber,
        expirationTime,
        attempts: 1,
        createdDate: new Date(),
      });

      console.log("otp sent service 3 :", OTP);
      const savedOTP = await this.OTPRepository.saveOTP(OTP);
      console.log("otp sent service 4");
      if (!user.email) {
        throw new Error("User email is null");
      }
      const capitalizeFirstLetter = (str: string): string => {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };

      const name = `${capitalizeFirstLetter(
        user?.firstName
      )} ${capitalizeFirstLetter(user?.lastName)}`;
      console.log("otp sent service 5");
      const OTPDetails = await sendMail(
        user.email,
        OTPNumber,
        name,
        "Mentor One OTP Verification"
      );
      console.log("otp sent service 6");
      if (!OTPDetails) {
        return null;
      }
      console.log("otp sent service 7");
      return savedOTP;
    } catch (error) {
      console.error("sent OTP error imService", error);
      return null;
    }
  }

  async verifyEmailOTP(
    otp: EOTP,
    email: Partial<EUsers>
  ): Promise<EOTP | null> {
    try {
      console.log("Verifying OTP for email: and otp", email, "and ", otp);
      const OTPUser = await this.OTPRepository.findOTP(email);
      console.log("otp check output", OTPUser);

      if (!OTPUser) {
        console.log("No OTP found for email:", email);
        throw new Error("OTP not found");
      }
      console.log("OTP Service otps are, ", OTPUser.otp, "and ", otp);

      if (OTPUser.otp !== otp.otp) {
        console.log("OTP mismatch. Expected:", OTPUser.otp, "Got:", otp);
        throw new Error("Invalid OTP");
      }

      // Check if OTP has expired
      const now = new Date();
      if (OTPUser.expirationTime && now > OTPUser.expirationTime) {
        console.log("OTP has expired");
        throw new Error("OTP has expired");
      }

      console.log("OTP verified successfully");
      return OTPUser;
    } catch (error) {
      console.error("verifyOTP error at imService", error);
      throw error;
    }
  }

  async checkOTPExists(user: Partial<EUsers>): Promise<EOTP | null> {
    try {
      console.log("otp exists service step", user);

      const OTPExists = await this.OTPRepository.findOTP(user);
      console.log("otp exists service step 2", OTPExists);
      if (!OTPExists) {
        return null;
      }
      console.log("otp exists service step 3 sucess");
      return OTPExists;
    } catch (error) {
      console.log("check OTP exists error", error);
      return null;
    }
  }

  async getUserData(email: string): Promise<EUsers | null> {
    try {
      const OtpUser = await this.OTPRepository.userData(email);
      return OtpUser;
    } catch (error: any) {
      throw new Error("Failed to create notification", error.message);
    }
  }
}
