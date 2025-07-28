// import { EFAQ } from "../../entities/EFAQEntity";
// import { EFAQCategory } from "../../entities/EFAQCategoryEntity";
// import { FAQ } from "../../models/FAQModel";
// import { FAQCategory } from "../../models/FAQCategoryModel";
// import { IFAQRepository } from "../interface/IFAQRepository";

// export class FAQRepository implements IFAQRepository {
//   async findFAQsByUserType(
//     userType: "anonymous" | "mentee" | "mentor"
//   ): Promise<EFAQ[]> {
//     return await FAQ.find({
//       isActive: true,
//       targetUsers: { $in: [userType] },
//     })
//       .populate("categoryId")
//       .sort({ priority: -1, "analytics.views": -1 })
//       .lean();
//   }

//   async searchFAQs(
//     query: string,
//     userType: "anonymous" | "mentee" | "mentor"
//   ): Promise<EFAQ[]> {
//     const searchTerms = query.toLowerCase().split(" ");

//     return await FAQ.find({
//       isActive: true,
//       targetUsers: { $in: [userType] },
//       $or: [
//         { $text: { $search: query } },
//         { keywords: { $in: searchTerms } },
//         { question: { $regex: query, $options: "i" } },
//       ],
//     })
//       .populate("categoryId")
//       .sort({ score: { $meta: "textScore" }, priority: -1 })
//       .limit(10)
//       .lean();
//   }

//   async findFAQById(id: string): Promise<EFAQ | null> {
//     return await FAQ.findById(id).populate("categoryId").lean();
//   }

//   async updateFAQAnalytics(
//     id: string,
//     type: "view" | "helpful" | "notHelpful"
//   ): Promise<void> {
//     const updateField = `analytics.${type}`;
//     await FAQ.findByIdAndUpdate(id, { $inc: { [updateField]: 1 } });
//   }

//   async findActiveCategories(
//     userType: "anonymous" | "mentee" | "mentor"
//   ): Promise<EFAQCategory[]> {
//     return await FAQCategory.find({
//       isActive: true,
//       targetUsers: { $in: [userType] },
//     })
//       .sort({ priority: -1 })
//       .lean();
//   }

//   async findFAQsByCategory(
//     categoryId: string,
//     userType: "anonymous" | "mentee" | "mentor"
//   ): Promise<EFAQ[]> {
//     return await FAQ.find({
//       categoryId,
//       isActive: true,
//       targetUsers: { $in: [userType] },
//     })
//       .sort({ priority: -1, "analytics.views": -1 })
//       .lean();
//   }
// }
import { EFAQ } from "../../entities/EFAQEntity";
import { EFAQCategory } from "../../entities/EFAQCategoryEntity";
import { FAQ } from "../../models/FAQModel";
import { FAQCategory } from "../../models/FAQCategoryModel";
import { IFAQRepository } from "../interface/IFAQRepository";
import BaseRepository from "./BaseRepository";

export class FAQRepository
  extends BaseRepository<EFAQ>
  implements IFAQRepository
{
  constructor() {
    super(FAQ);
  }

  async findFAQsByUserType(
    userType: "anonymous" | "mentee" | "mentor"
  ): Promise<EFAQ[]> {
    try {
      return await this.find(
        {
          isActive: true,
          targetUsers: { $in: [userType] },
        },
        {
          populate: "categoryId",
          sort: { priority: -1, "analytics.views": -1 },
          lean: true,
        }
      );
    } catch (error) {
      throw this.handleError(error, "findFAQsByUserType");
    }
  }

  async searchFAQs(
    query: string,
    userType: "anonymous" | "mentee" | "mentor"
  ): Promise<EFAQ[]> {
    try {
      const searchTerms = query.toLowerCase().split(" ");

      return await this.find(
        {
          isActive: true,
          targetUsers: { $in: [userType] },
          $or: [
            { $text: { $search: query } },
            { keywords: { $in: searchTerms } },
            { question: { $regex: query, $options: "i" } },
          ],
        },
        {
          populate: "categoryId",
          sort: { score: { $meta: "textScore" }, priority: -1 },
          limit: 10,
          lean: true,
        }
      );
    } catch (error) {
      throw this.handleError(error, "searchFAQs");
    }
  }

  async findFAQById(id: string): Promise<EFAQ | null> {
    try {
      return await this.findById(id, {
        populate: "categoryId",
        lean: true,
      });
    } catch (error) {
      throw this.handleError(error, "findFAQById");
    }
  }

  async updateFAQAnalytics(
    id: string,
    type: "view" | "helpful" | "notHelpful"
  ): Promise<void> {
    try {
      const updateField = `analytics.${type}`;
      await this.updateById(id, { $inc: { [updateField]: 1 } });
    } catch (error) {
      throw this.handleError(error, "updateFAQAnalytics");
    }
  }

  async findActiveCategories(
    userType: "anonymous" | "mentee" | "mentor"
  ): Promise<EFAQCategory[]> {
    try {
      return await FAQCategory.find({
        isActive: true,
        targetUsers: { $in: [userType] },
      })
        .sort({ priority: -1 })
        .lean();
    } catch (error) {
      throw this.handleError(error, "findActiveCategories");
    }
  }

  async findFAQsByCategory(
    categoryId: string,
    userType: "anonymous" | "mentee" | "mentor"
  ): Promise<EFAQ[]> {
    try {
      return await this.find(
        {
          categoryId,
          isActive: true,
          targetUsers: { $in: [userType] },
        },
        {
          sort: { priority: -1, "analytics.views": -1 },
          lean: true,
        }
      );
    } catch (error) {
      throw this.handleError(error, "findFAQsByCategory");
    }
  }
}
