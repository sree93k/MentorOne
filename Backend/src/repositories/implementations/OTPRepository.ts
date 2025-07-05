// // ✅ Updated OTPRepository with SOLID, Inversify, and BaseRepository pattern

// import { injectable } from "inversify";
// import { IOTPRepository } from "../interface/IOTPRepository";
// import BaseRepository from "./BaseRepository";
// import OTPModel from "../../models/otpModel";
// import { EOTP } from "../../entities/OTPEntity";
// import { EUsers } from "../../entities/userEntity";

// @injectable()
// export default class OTPRepository
//   extends BaseRepository<EOTP>
//   implements IOTPRepository
// {
//   constructor() {
//     super(OTPModel);
//   }

//   async saveOTP(otp: Partial<EOTP>): Promise<EOTP | null> {
//     try {
//       const newOTP = new this.model(otp);
//       await newOTP.save();
//       return newOTP;
//     } catch (error: any) {
//       throw new Error(`Failed to save OTP: ${error.message}`);
//     }
//   }

//   async deleteOTPsByEmail(email: string): Promise<void> {
//     try {
//       await this.model.deleteMany({ email });
//     } catch (error: any) {
//       throw new Error(`Failed to delete OTPs: ${error.message}`);
//     }
//   }

//   async findOTP(email: string): Promise<EOTP | null> {
//     try {
//       const matchOTP = await this.model.findOne({ email });
//       return matchOTP ? (matchOTP.toObject() as EOTP) : null;
//     } catch (error: any) {
//       throw new Error(`Failed to find OTP: ${error.message}`);
//     }
//   }

//   async userData(email: string): Promise<EUsers | null> {
//     try {
//       const record = await this.model.findOne({ email });
//       return record?.user as unknown as EUsers;
//     } catch (error: any) {
//       throw new Error(`Failed to find user data: ${error.message}`);
//     }
//   }
// }
