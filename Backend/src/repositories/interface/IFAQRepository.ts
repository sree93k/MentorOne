// import { EFAQCategory } from "../../entities/EFAQCategoryEntity";
// import { EFAQ } from "../../entities/EFAQEntity";
// export interface IFAQRepository {
//   // FAQ Management
//   findFAQsByUserType(
//     userType: "anonymous" | "mentee" | "mentor"
//   ): Promise<EFAQ[]>;
//   searchFAQs(
//     query: string,
//     userType: "anonymous" | "mentee" | "mentor"
//   ): Promise<EFAQ[]>;
//   findFAQById(id: string): Promise<EFAQ | null>;
//   updateFAQAnalytics(
//     id: string,
//     type: "view" | "helpful" | "notHelpful"
//   ): Promise<void>;

//   // Category Management
//   findActiveCategories(
//     userType: "anonymous" | "mentee" | "mentor"
//   ): Promise<EFAQCategory[]>;
//   findFAQsByCategory(
//     categoryId: string,
//     userType: "anonymous" | "mentee" | "mentor"
//   ): Promise<EFAQ[]>;
// }

// Backend/src/repositories/interface/IFAQRepository.ts
import { EFAQ } from "../../entities/EFAQEntity";
import { EFAQCategory } from "../../entities/EFAQCategoryEntity";

export interface IFAQRepository {
  findFAQsByUserType(
    userType: "anonymous" | "mentee" | "mentor"
  ): Promise<EFAQ[]>;
  searchFAQs(
    query: string,
    userType: "anonymous" | "mentee" | "mentor"
  ): Promise<EFAQ[]>;
  findFAQById(id: string): Promise<EFAQ | null>;
  updateFAQAnalytics(
    id: string,
    type: "view" | "helpful" | "notHelpful"
  ): Promise<void>;
  findActiveCategories(
    userType: "anonymous" | "mentee" | "mentor"
  ): Promise<EFAQCategory[]>;
  findFAQsByCategory(
    categoryId: string,
    userType: "anonymous" | "mentee" | "mentor"
  ): Promise<EFAQ[]>;
}
