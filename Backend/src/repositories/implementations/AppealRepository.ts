import { injectable } from "inversify";
import { FilterQuery } from "mongoose";
import BaseRepository from "./BaseRepository"; // ✅ Import with curly braces
import AppealModel from "../../models/appealModel"; // ✅ Import the default export
import {
  EAppeal,
  CreateAppealDTO,
  UpdateAppealDTO,
  AppealSearchFilters,
} from "../../entities/appealEntity";
import { IAppealRepository } from "../interface/IAppealRepository";
import { IPaginatedResult } from "../interface/IBaseRepository";

@injectable()
export default class AppealRepository
  extends BaseRepository<EAppeal>
  implements IAppealRepository
{
  constructor() {
    console.log("🔍 AppealRepository: Constructor called");
    console.log("🔍 AppealModel:", AppealModel);
    console.log("🔍 AppealModel.modelName:", AppealModel?.modelName);

    super(AppealModel); // ✅ Pass the model to BaseRepository
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

  async findByQuery(query: any): Promise<EAppeal[]> {
    try {
      return await this.find(query, {
        sort: { submittedAt: -1 },
        lean: true,
      });
    } catch (error: any) {
      console.error("AppealRepository: Error in findByQuery", error);
      throw new Error(`Failed to find appeals by query: ${error.message}`);
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

  async getAppealStatistics(): Promise<any> {
    try {
      console.log("AppealRepository: Getting appeal statistics");

      // ✅ Use aggregate method from BaseRepository
      const statsPromises = [
        this.count({}),
        this.count({ status: "pending" }),
        this.count({ status: "approved" }),
        this.count({ status: "rejected" }),
        this.count({ status: "under_review" }),
        this.count({
          submittedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        }),
        this.aggregate([
          {
            $group: {
              _id: "$category",
              count: { $sum: 1 },
            },
          },
        ]),
      ];

      const [
        totalAppeals,
        pendingAppeals,
        approvedAppeals,
        rejectedAppeals,
        underReviewAppeals,
        recentAppeals,
        categoryStats,
      ] = await Promise.all(statsPromises);

      const stats = {
        total: totalAppeals,
        pending: pendingAppeals,
        approved: approvedAppeals,
        rejected: rejectedAppeals,
        under_review: underReviewAppeals,
        recent: recentAppeals,
        categoryBreakdown: categoryStats,
        approvalRate:
          totalAppeals > 0
            ? ((approvedAppeals / totalAppeals) * 100).toFixed(1)
            : 0,
      };

      console.log("AppealRepository: Statistics retrieved", stats);
      return stats;
    } catch (error: any) {
      console.error("AppealRepository: Error getting statistics", error);
      throw new Error(`Failed to get appeal statistics: ${error.message}`);
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

  async findAppealsWithFilters(
    searchQuery: any,
    page: number,
    limit: number
  ): Promise<IPaginatedResult<EAppeal>> {
    try {
      console.log("AppealRepository: findAppealsWithFilters", {
        searchQuery,
        page,
        limit,
      });

      // ✅ ADD: Debug existing data dates
      if (searchQuery.submittedAt) {
        console.log("🔍 Date filter applied, checking existing data...");
        const sampleAppeals = await this.find(
          {},
          {
            limit: 5,
            sort: { submittedAt: -1 },
            select: "submittedAt firstName email",
          }
        );

        console.log(
          "🔍 Sample appeal dates in DB:",
          sampleAppeals.map((a) => ({
            name: a.firstName,
            email: a.email,
            date: a.submittedAt,
            formatted: new Date(a.submittedAt).toISOString(),
          }))
        );
      }

      // ✅ Use the built-in findPaginated method from BaseRepository
      const result = await this.findPaginated(searchQuery, page, limit, {
        sort: { submittedAt: -1 },
        lean: true,
      });

      console.log("AppealRepository: Appeals found", {
        totalCount: result.total,
        currentPage: result.page,
        totalPages: result.totalPages,
        resultsInPage: result.data.length,
        searchQuery: JSON.stringify(searchQuery),
      });

      // ✅ Map to expected interface format
      return {
        data: result.data,
        totalCount: result.total,
        currentPage: result.page,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage,
      };
    } catch (error: any) {
      console.error("AppealRepository: Error in findAppealsWithFilters", error);
      throw new Error(`Failed to find appeals: ${error.message}`);
    }
  }
}
