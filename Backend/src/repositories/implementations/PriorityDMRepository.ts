// repositories/implementations/PriorityDMRepository.ts
import { injectable } from "inversify";
import { Types } from "mongoose";
import PriorityDMModel from "../../models/priorityDmModel";
import { EPriorityDM } from "../../entities/priorityDMEntity";
import BaseRepository from "../implementations/BaseRepository";
import { IPriorityDMRepository } from "../interface/IPriorityDmRepository";

@injectable()
export default class PriorityDMRepository
  extends BaseRepository<EPriorityDM>
  implements IPriorityDMRepository
{
  constructor() {
    super(PriorityDMModel);
  }

  async findByServiceAndMentee(
    bookingId: string,
    menteeId: string
  ): Promise<EPriorityDM[]> {
    this.validateObjectId([bookingId, menteeId], ["bookingId", "menteeId"]);

    const result = await this.model
      .findOne({
        bookingId: new Types.ObjectId(bookingId),
        menteeId: new Types.ObjectId(menteeId),
      })
      .populate("mentorId", "firstName lastName")
      .populate("menteeId", "firstName lastName profilePicture")
      .populate("serviceId")
      .populate("bookingId");

    return result ? [result] : [];
  }

  async findByServiceAndMentor(
    serviceId: string,
    mentorId: string
  ): Promise<EPriorityDM[]> {
    this.validateObjectId([serviceId, mentorId], ["serviceId", "mentorId"]);

    return await this.model
      .find({
        serviceId: new Types.ObjectId(serviceId),
        mentorId: new Types.ObjectId(mentorId),
      })
      .populate("mentorId", "firstName lastName")
      .populate("menteeId", "firstName lastName profilePicture")
      .populate("serviceId")
      .populate("bookingId");
  }

  async findByMentor(
    mentorId: string,
    page: number = 1,
    limit: number = 8,
    searchQuery: string = "",
    status?: "pending" | "replied",
    sort?: "asc" | "desc"
  ): Promise<{ priorityDMs: EPriorityDM[]; total: number }> {
    this.validateObjectId([mentorId], ["mentorId"]);

    const query: any = {
      mentorId: new Types.ObjectId(mentorId),
    };

    if (status) query.status = status;
    if (searchQuery) {
      query.$or = [
        { content: { $regex: searchQuery, $options: "i" } },
        { "menteeId.firstName": { $regex: searchQuery, $options: "i" } },
        { "menteeId.lastName": { $regex: searchQuery, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const sortOptions: { createdAt: 1 | -1 } = {
      createdAt: sort === "asc" ? 1 : -1,
    };

    const [priorityDMs, total] = await Promise.all([
      this.model
        .find(query)
        .populate("mentorId", "firstName lastName profilePicture")
        .populate("menteeId", "firstName lastName profilePicture")
        .populate("serviceId")
        .populate("bookingId")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      this.model.countDocuments(query),
    ]);

    return { priorityDMs, total };
  }

  async update(
    id: string,
    data: Partial<EPriorityDM>
  ): Promise<EPriorityDM | null> {
    this.validateObjectId([id], ["id"]);

    return await this.model
      .findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
      .populate("mentorId", "firstName lastName")
      .populate("menteeId", "firstName lastName profilePicture")
      .populate("serviceId")
      .populate("bookingId");
  }

  private validateObjectId(ids: string[], fieldNames: string[]) {
    ids.forEach((id, index) => {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ${fieldNames[index]} format: ${id}`);
      }
    });
  }
}
