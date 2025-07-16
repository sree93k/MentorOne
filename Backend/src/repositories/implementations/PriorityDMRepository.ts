import mongoose from "mongoose";
import PriorityDMModel from "../../models/priorityDmModel";
import { EPriorityDM } from "../../entities/priorityDMEntity";
import BaseRepository from "./BaseRepository";
import { IPriorityDMRepository } from "../interface/IPriorityDmRepository";
import { extend } from "joi";

export default class PriorityDMRepository
  extends BaseRepository<EPriorityDM>
  implements IPriorityDMRepository
{
  constructor() {
    super(PriorityDMModel);
  }
  async create(data: Partial<EPriorityDM>): Promise<EPriorityDM> {
    try {
      const priorityDM = await PriorityDMModel.create(data);
      return priorityDM;
    } catch (error: any) {
      console.error("Error in PriorityDMRepository.create:", error);
      throw new Error(`Failed to create PriorityDM: ${error.message}`);
    }
  }

  async findById(id: string): Promise<EPriorityDM | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ID format: ${id}`);
      }

      const priorityDM = await PriorityDMModel.findById(id)
        .populate("mentorId", "firstName lastName")
        .populate("menteeId", "firstName lastName profilePicture")
        .populate("serviceId")
        .populate("bookingId");

      return priorityDM;
    } catch (error: any) {
      console.error("Error in PriorityDMRepository.findById:", error);
      throw new Error(`Failed to fetch PriorityDM: ${error.message}`);
    }
  }

  async findByServiceAndMentee(
    bookingId: string,
    menteeId: string
  ): Promise<EPriorityDM[]> {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(bookingId) ||
        !mongoose.Types.ObjectId.isValid(menteeId)
      ) {
        throw new Error("Invalid serviceId or menteeId format");
      }
      console.log(
        "prioritydm repository findByServiceAndMentee step 1",
        bookingId,
        menteeId
      );

      const priorityDMs = await PriorityDMModel.findOne({
        bookingId: new mongoose.Types.ObjectId(bookingId),
        menteeId: new mongoose.Types.ObjectId(menteeId),
      })
        .populate("mentorId", "firstName lastName")
        .populate("menteeId", "firstName lastName profilePicture")
        .populate("serviceId")
        .populate("bookingId");
      console.log(
        "prioritydm repository findByServiceAndMentee step 2",
        priorityDMs
      );
      return priorityDMs as unknown as EPriorityDM[];
    } catch (error: any) {
      console.log(
        "prioritydm repository findByServiceAndMentee step 3 errro",
        error
      );
      console.error(
        "Error in PriorityDMRepository.findByServiceAndMentee:",
        error
      );
      throw new Error(`Failed to fetch PriorityDMs: ${error.message}`);
    }
  }

  async findByServiceAndMentor(
    serviceId: string,
    mentorId: string
  ): Promise<EPriorityDM[]> {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(serviceId) ||
        !mongoose.Types.ObjectId.isValid(mentorId)
      ) {
        throw new Error("Invalid serviceId or mentorId format");
      }

      const priorityDMs = await PriorityDMModel.find({
        serviceId: new mongoose.Types.ObjectId(serviceId),
        mentorId: new mongoose.Types.ObjectId(mentorId),
      })
        .populate("mentorId", "firstName lastName")
        .populate("menteeId", "firstName lastName profilePicture")
        .populate("serviceId")
        .populate("bookingId");

      return priorityDMs;
    } catch (error: any) {
      console.error(
        "Error in PriorityDMRepository.findByServiceAndMentor:",
        error
      );
      throw new Error(`Failed to fetch PriorityDMs: ${error.message}`);
    }
  }

  async findByMentor(
    mentorId: string,
    page: number = 1,
    limit: number = 8,
    searchQuery: string = "",
    status?: "pending" | "replied",
    sort?: "asc" | "desc"
  ): Promise<{ priorityDMs: EPriorityDM[]; total: number }> {
    try {
      if (!mongoose.Types.ObjectId.isValid(mentorId)) {
        throw new Error("Invalid mentorId format");
      }

      const query: any = {
        mentorId: new mongoose.Types.ObjectId(mentorId),
      };

      // Filter by status if provided
      if (status) {
        query.status = status;
      }

      // Search by mentee name or content
      if (searchQuery) {
        query.$or = [
          {
            "menteeId.firstName": { $regex: searchQuery, $options: "i" },
          },
          {
            "menteeId.lastName": { $regex: searchQuery, $options: "i" },
          },
          {
            content: { $regex: searchQuery, $options: "i" },
          },
        ];
      }

      // Calculate skip for pagination
      const skip = (page - 1) * limit;

      // Build sort options
      const sortOptions: any = {};
      if (sort) {
        sortOptions.createdAt = sort === "asc" ? 1 : -1;
      }

      // Fetch DMs with pagination, search, and sort
      const [priorityDMs, total] = await Promise.all([
        PriorityDMModel.find(query)
          .populate("mentorId", "firstName lastName profilePicture")
          .populate("menteeId", "firstName lastName profilePicture")
          .populate("serviceId")
          .populate("bookingId")
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .lean(),
        PriorityDMModel.countDocuments(query),
      ]);

      console.log(
        "PriorityDMRepository.findByMentor response:",
        priorityDMs.length,
        "DMs, total:",
        total
      );

      return { priorityDMs, total };
    } catch (error: any) {
      console.error("Error in PriorityDMRepository.findByMentor:", error);
      throw new Error(`Failed to fetch PriorityDMs: ${error.message}`);
    }
  }
  async update(
    id: string,
    data: Partial<EPriorityDM>
  ): Promise<EPriorityDM | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ID format: ${id}`);
      }

      const updatedDM = await PriorityDMModel.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      )
        .populate("mentorId", "firstName lastName")
        .populate("menteeId", "firstName lastName profilePicture")
        .populate("serviceId")
        .populate("bookingId");

      return updatedDM;
    } catch (error: any) {
      console.error("Error in PriorityDMRepository.update:", error);
      throw new Error(`Failed to update PriorityDM: ${error.message}`);
    }
  }
}
