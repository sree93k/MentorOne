import mongoose from "mongoose";
import Policy from "../../models/policyModel";
import { IPolicyRepository, PolicyData } from "../interface/IPolicyRepository";

export default class PolicyRepository implements IPolicyRepository {
  async getPolicy(mentorId: string | mongoose.Types.ObjectId) {
    return await Policy.findOne({
      userId: new mongoose.Types.ObjectId(mentorId),
    });
  }

  async updatePolicy(
    mentorId: string | mongoose.Types.ObjectId,
    data: PolicyData
  ) {
    return await Policy.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(mentorId) },
      { $set: data, updatedAt: new Date() },
      { new: true, upsert: true }
    );
  }
}
