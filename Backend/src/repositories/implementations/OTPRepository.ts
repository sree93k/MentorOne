// import { EUsers } from "../../entities/userEntity";
// import { EOTP } from "../../entities/OTPEntity";
// import { IOTPRepository } from "../interface/IOTPRepository";
// import BaseRepository from "./BaseRepository";
// import OTPModel from "../../models/otpModel";

// export default class OTPRepository
//   extends BaseRepository<EOTP>
//   implements IOTPRepository
// {
//   constructor() {
//     super(OTPModel);
//   }
//   async saveOTP(otp: EOTP): Promise<EOTP | null> {
//     try {
//       console.log("repo save otp 1", otp);
//       const newOTP = new OTPModel(otp);
//       console.log("repo save otp 2", newOTP);
//       await newOTP.save();
//       console.log("repo save otp 3", newOTP);
//       return newOTP;
//     } catch (error) {
//       if (error instanceof Error) {
//         throw new Error("Failed to save OTP", error);
//       } else {
//         throw new Error("Failed to save OTP");
//       }
//     }
//   }
//   async deleteOTPsByEmail(email: string): Promise<void> {
//     try {
//       await OTPModel.deleteMany({ email });
//     } catch (error) {
//       if (error instanceof Error) {
//         throw new Error("Failed to delete OTPs", error);
//       } else {
//         throw new Error("Failed to delete OTPs");
//       }
//     }
//   }
//   async findOTP(email: Partial<EOTP>): Promise<EOTP | null> {
//     try {
//       console.log("find otp repo 1>>>>", email);
//       const matchOTP = await OTPModel.findOne({ email });
//       console.log("find otp repo 2", matchOTP);
//       return matchOTP ? matchOTP.toObject() : null;
//     } catch (error) {
//       if (error instanceof Error) {
//         console.log("find otp repo err 3");

//         throw new Error("Failed to find OTP", error);
//       } else {
//         console.log("find otp repo err 4");
//         throw new Error("Failed to find OTP");
//       }
//     }
//   }

//   async userData(email: Partial<EOTP>): Promise<EOTP | null> {
//     try {
//       const userDatas = await OTPModel.findOne({ email });
//       console.log("userDatas is >>>>>>>>>>", userDatas);

//       return userDatas ? (userDatas.user as unknown as EOTP) : null;
//     } catch (error) {
//       if (error instanceof Error) {
//         throw new Error("Failed to find user data", error);
//       } else {
//         throw new Error("Failed to find user data");
//       }
//     }
//   }
// }
import { injectable } from "inversify";
import { EUsers } from "../../entities/userEntity";
import { EOTP } from "../../entities/OTPEntity";
import { IOTPRepository } from "../interface/IOTPRepository";
import BaseRepository from "./BaseRepository";
import OTPModel from "../../models/otpModel";

/**
 * 🔹 DIP COMPLIANCE: Injectable OTP Repository
 */
@injectable()
export default class OTPRepository
  extends BaseRepository<EOTP>
  implements IOTPRepository
{
  constructor() {
    super(OTPModel);
  }

  async saveOTP(otp: EOTP): Promise<EOTP | null> {
    try {
      console.log("repo save otp 1", otp);
      const newOTP = new OTPModel(otp);
      console.log("repo save otp 2", newOTP);
      await newOTP.save();
      console.log("repo save otp 3", newOTP);
      return newOTP;
    } catch (error) {
      console.error("Error saving OTP:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to save OTP: ${error.message}`);
      } else {
        throw new Error("Failed to save OTP");
      }
    }
  }

  async deleteOTPsByEmail(email: string): Promise<void> {
    try {
      await OTPModel.deleteMany({ email });
    } catch (error) {
      console.error("Error deleting OTPs:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to delete OTPs: ${error.message}`);
      } else {
        throw new Error("Failed to delete OTPs");
      }
    }
  }

  // Fixed: use string parameter instead of Partial<EOTP>
  async findOTP(email: string): Promise<EOTP | null> {
    try {
      console.log("find otp repo 1>>>>", email);
      const matchOTP = await OTPModel.findOne({ email });
      console.log("find otp repo 2", matchOTP);
      return matchOTP;
    } catch (error) {
      console.error("Error finding OTP:", error);
      if (error instanceof Error) {
        console.log("find otp repo err 3");
        throw new Error(`Failed to find OTP: ${error.message}`);
      } else {
        console.log("find otp repo err 4");
        throw new Error("Failed to find OTP");
      }
    }
  }

  // Fixed: use string parameter and return EUsers
  async userData(email: string): Promise<EUsers | null> {
    try {
      console.log("Getting user data for email:", email);
      const otpRecord = await OTPModel.findOne({ email });
      console.log("userDatas is >>>>>>>>>>", otpRecord);

      return otpRecord ? (otpRecord.user as unknown as EUsers) : null;
    } catch (error) {
      console.error("Error finding user data:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to find user data: ${error.message}`);
      } else {
        throw new Error("Failed to find user data");
      }
    }
  }
}
