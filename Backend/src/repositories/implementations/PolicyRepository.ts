// import { injectable } from "inversify";
// import mongoose from "mongoose";
// import BaseRepository from "../implementations/BaseRepository";
// import Policy from "../../models/policyModel";
// import { EPolicy } from "../../entities/policyEntity";
// import { IPolicyRepository, PolicyData } from "../interface/IPolicyRepository";

// @injectable()
// export default class PolicyRepository
//   extends BaseRepository<EPolicy>
//   implements IPolicyRepository
// {
//   constructor() {
//     super(Policy);
//   }

//   async getPolicy(
//     mentorId: string | mongoose.Types.ObjectId
//   ): Promise<EPolicy | null> {
//     return this.model.findOne({
//       userId: new mongoose.Types.ObjectId(mentorId),
//     });
//   }

//   async updatePolicy(
//     mentorId: string | mongoose.Types.ObjectId,
//     data: PolicyData
//   ): Promise<EPolicy | null> {
//     return this.model.findOneAndUpdate(
//       { userId: new mongoose.Types.ObjectId(mentorId) },
//       { $set: { ...data, updatedAt: new Date() } },
//       { new: true, upsert: true }
//     );
//   }
// }
