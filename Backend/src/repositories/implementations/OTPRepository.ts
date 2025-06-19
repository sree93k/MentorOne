import { EUsers } from "../../entities/userEntity";
import { EOTP } from "../../entities/OTPEntity";
import { IOTPRepository } from "../interface/IOTPRepository";

import OTPModel from "../../models/otpModel";

export default class OTPRepository implements IOTPRepository {
  async saveOTP(otp: EOTP): Promise<EOTP | null> {
    try {
      console.log("repo save otp 1", otp);
      const newOTP = new OTPModel(otp);
      console.log("repo save otp 2", newOTP);
      await newOTP.save();
      console.log("repo save otp 3", newOTP);
      return newOTP;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to save OTP", error);
      } else {
        throw new Error("Failed to save OTP");
      }
    }
  }
  async deleteOTPsByEmail(email: string): Promise<void> {
    try {
      await OTPModel.deleteMany({ email });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to delete OTPs", error);
      } else {
        throw new Error("Failed to delete OTPs");
      }
    }
  }
  async findOTP(email: Partial<EUsers>): Promise<EOTP | null> {
    try {
      console.log("find otp repo 1>>>>", email);
      const matchOTP = await OTPModel.findOne({ email });
      console.log("find otp repo 2", matchOTP);
      return matchOTP ? matchOTP.toObject() : null;
    } catch (error) {
      if (error instanceof Error) {
        console.log("find otp repo err 3");

        throw new Error("Failed to find OTP", error);
      } else {
        console.log("find otp repo err 4");
        throw new Error("Failed to find OTP");
      }
    }
  }

  async userData(email: Partial<EUsers>): Promise<EUsers | null> {
    try {
      const userDatas = await OTPModel.findOne({ email });
      console.log("userDatas is >>>>>>>>>>", userDatas);

      return userDatas ? (userDatas.user as unknown as EUsers) : null;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to find user data", error);
      } else {
        throw new Error("Failed to find user data");
      }
    }
  }
}
