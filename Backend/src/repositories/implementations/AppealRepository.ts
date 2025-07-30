// import { Model } from "mongoose";
// import Appeal from "../../models/appealModel";

// export default class AppealRepository {
//   private appealModel: Model<any>;

//   constructor() {
//     this.appealModel = Appeal;
//   }

//   async createAppeal(appealData: {
//     userId: string;
//     email: string;
//     firstName: string;
//     lastName: string;
//     appealMessage: string;
//     category: string;
//     status: string;
//     submittedAt: Date;
//   }) {
//     try {
//       const appeal = new this.appealModel(appealData);
//       return await appeal.save();
//     } catch (error) {
//       console.error("Error creating appeal:", error);
//       throw error;
//     }
//   }

//   async findById(appealId: string) {
//     try {
//       return await this.appealModel.findById(appealId);
//     } catch (error) {
//       console.error("Error finding appeal:", error);
//       throw error;
//     }
//   }

//   async updateAppeal(appealId: string, updateData: any) {
//     try {
//       return await this.appealModel.findByIdAndUpdate(
//         appealId,
//         { $set: updateData },
//         { new: true }
//       );
//     } catch (error) {
//       console.error("Error updating appeal:", error);
//       throw error;
//     }
//   }

//   async getAllAppeals(page: number = 1, limit: number = 10, status?: string) {
//     try {
//       const query = status ? { status } : {};
//       const skip = (page - 1) * limit;

//       const appeals = await this.appealModel
//         .find(query)
//         .sort({ submittedAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean();

//       const total = await this.appealModel.countDocuments(query);

//       return { appeals, total };
//     } catch (error) {
//       console.error("Error getting appeals:", error);
//       throw error;
//     }
//   }
// }
import { FilterQuery } from "mongoose";
import BaseRepository from "./BaseRepository";
import Appeal from "../../models/appealModel";
import {
  EAppeal,
  CreateAppealDTO,
  UpdateAppealDTO,
  AppealSearchFilters,
} from "../../entities/appealEntity";
import { IAppealRepository } from "../interface/IAppealRepository";
import { IPaginatedResult } from "../interface/IBaseRepository";

export default class AppealRepository
  extends BaseRepository<EAppeal>
  implements IAppealRepository
{
  constructor() {
    super(Appeal);
  }

  async createAppeal(appealData: CreateAppealDTO): Promise<EAppeal> {
    try {
      console.log("AppealRepository: Creating appeal", {
        email: appealData.email,
        category: appealData.category,
      });

      const appeal = await this.create({
        ...appealData,
        status: "pending",
        submittedAt: new Date(),
      } as Partial<EAppeal>);

      console.log("AppealRepository: Appeal created successfully", {
        appealId: appeal._id,
      });

      return appeal;
    } catch (error) {
      console.error("AppealRepository: Error creating appeal", error);
      throw this.handleError(error, "createAppeal");
    }
  }

  async findByUserIdAndStatus(
    userId: string,
    status?: string
  ): Promise<EAppeal[]> {
    try {
      const filter: FilterQuery<EAppeal> = { userId };
      if (status) {
        filter.status = status;
      }

      return await this.find(filter, {
        sort: { submittedAt: -1 },
      });
    } catch (error) {
      throw this.handleError(error, "findByUserIdAndStatus");
    }
  }

  async findByEmail(email: string): Promise<EAppeal[]> {
    try {
      return await this.find({ email }, { sort: { submittedAt: -1 } });
    } catch (error) {
      throw this.handleError(error, "findByEmail");
    }
  }

  async findAppealsWithFilters(
    filters: AppealSearchFilters,
    page: number,
    limit: number
  ): Promise<IPaginatedResult<EAppeal>> {
    try {
      const query: FilterQuery<EAppeal> = {};

      // Apply filters
      if (filters.status) {
        query.status = filters.status;
      }

      if (filters.email) {
        query.email = { $regex: filters.email, $options: "i" };
      }

      if (filters.userId) {
        query.userId = filters.userId;
      }

      if (filters.category) {
        query.category = filters.category;
      }

      if (filters.dateFrom || filters.dateTo) {
        query.submittedAt = {};
        if (filters.dateFrom) {
          query.submittedAt.$gte = filters.dateFrom;
        }
        if (filters.dateTo) {
          query.submittedAt.$lte = filters.dateTo;
        }
      }

      return await this.findPaginated(query, page, limit, {
        sort: { submittedAt: -1 },
      });
    } catch (error) {
      throw this.handleError(error, "findAppealsWithFilters");
    }
  }

  async updateAppealStatus(
    appealId: string,
    updateData: UpdateAppealDTO
  ): Promise<EAppeal | null> {
    try {
      console.log("AppealRepository: Updating appeal status", {
        appealId,
        status: updateData.status,
      });

      const updatedAppeal = await this.updateById(appealId, {
        ...updateData,
        ...(updateData.status &&
          updateData.status !== "pending" && {
            reviewedAt: new Date(),
          }),
      });

      if (updatedAppeal) {
        console.log("AppealRepository: Appeal status updated successfully", {
          appealId: updatedAppeal._id,
          newStatus: updatedAppeal.status,
        });
      }

      return updatedAppeal;
    } catch (error) {
      throw this.handleError(error, "updateAppealStatus");
    }
  }

  async getAppealStatistics(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    under_review: number;
  }> {
    try {
      const stats = await this.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const result = {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        under_review: 0,
      };

      stats.forEach((stat) => {
        result[stat._id as keyof typeof result] = stat.count;
        result.total += stat.count;
      });

      return result;
    } catch (error) {
      throw this.handleError(error, "getAppealStatistics");
    }
  }

  async findRecentAppealsByUser(
    userId: string,
    hoursBack: number = 24
  ): Promise<EAppeal[]> {
    try {
      const timeThreshold = new Date();
      timeThreshold.setHours(timeThreshold.getHours() - hoursBack);

      return await this.find(
        {
          userId,
          submittedAt: { $gte: timeThreshold },
        },
        {
          sort: { submittedAt: -1 },
        }
      );
    } catch (error) {
      throw this.handleError(error, "findRecentAppealsByUser");
    }
  }
}
