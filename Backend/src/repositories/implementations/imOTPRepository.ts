import { EUsers } from "../../entities/userEntity";
import { EOTP } from "../../entities/OTPEntity";
import { inOTPRepository } from "../interface/inOTPRepository";
import { ApiError } from "../../middlewares/errorHandler";
import OTPModel from "../../models/otpModel";

export default class OTPRepository implements inOTPRepository {
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
        throw new ApiError(500, "Failed to save OTP", error.message);
      } else {
        throw new ApiError(500, "Failed to save OTP", "Unknown error");
      }
    }
  }

  async findOTP(email: Partial<EUsers>): Promise<EOTP | null> {
    try {
      //   console.log("find otp repo 1", user);
      //   const email = user.email; // Extract the email string
      //   const matchOTP = await OTPModel.findOne({ email });
      console.log("find otp repo 1", email);
      const matchOTP = await OTPModel.findOne({ email });
      console.log("find otp repo 2", matchOTP);
      return matchOTP ? matchOTP.toObject() : null;
    } catch (error) {
      if (error instanceof Error) {
        console.log("find otp repo err 3");

        throw new ApiError(500, "Failed to find OTP", error.message);
      } else {
        console.log("find otp repo err 4");
        throw new ApiError(500, "Failed to find OTP", "Unknown error");
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
        throw new ApiError(500, "Failed to find user data", error.message);
      } else {
        throw new ApiError(500, "Failed to find user data", "Unknown error");
      }
    }
  }
}
