import {
  EAppeal,
  CreateAppealDTO,
  UpdateAppealDTO,
  AppealSearchFilters,
} from "../../entities/appealEntity";
import { IPaginatedResult } from "../../repositories/interface/IBaseRepository";

export interface IAppealService {
  /**
   * Submit a new appeal
   */
  submitAppeal(appealData: CreateAppealDTO): Promise<{
    success: boolean;
    data?: EAppeal;
    message: string;
    appealId?: string;
  }>;

  /**
   * Get appeal by ID (public access)
   */
  getAppealById(appealId: string): Promise<{
    success: boolean;
    data?: Partial<EAppeal>;
    message: string;
  }>;

  /**
   * Get appeals with filters (admin only)
   */
  getAppealsWithFilters(
    filters: AppealSearchFilters,
    page: number,
    limit: number
  ): Promise<{
    success: boolean;
    data?: IPaginatedResult<EAppeal>;
    message: string;
  }>;

  /**
   * Review appeal (admin only)
   */
  reviewAppeal(
    appealId: string,
    adminId: string,
    decision: "approved" | "rejected",
    adminResponse: string,
    adminNotes?: string
  ): Promise<{
    success: boolean;
    data?: EAppeal;
    message: string;
  }>;

  /**
   * Get appeal statistics (admin only)
   */
  getAppealStatistics(): Promise<{
    success: boolean;
    data?: any;
    message: string;
  }>;
  getLatestAppealByEmail(email: string): Promise<{
    success: boolean;
    data?: any;
    message: string;
  }>;
}
