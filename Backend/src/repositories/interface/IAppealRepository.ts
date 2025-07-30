import {
  EAppeal,
  CreateAppealDTO,
  UpdateAppealDTO,
  AppealSearchFilters,
} from "../../entities/appealEntity";
import { IBaseRepository, IPaginatedResult } from "./IBaseRepository";

export interface IAppealRepository extends IBaseRepository<EAppeal> {
  /**
   * Create a new appeal
   */
  createAppeal(appealData: CreateAppealDTO): Promise<EAppeal>;

  /**
   * Find appeal by user ID and status
   */
  findByUserIdAndStatus(userId: string, status?: string): Promise<EAppeal[]>;

  /**
   * Find appeals by email
   */
  findByEmail(email: string): Promise<EAppeal[]>;

  /**
   * Get paginated appeals with search filters
   */
  findAppealsWithFilters(
    filters: AppealSearchFilters,
    page: number,
    limit: number
  ): Promise<IPaginatedResult<EAppeal>>;

  /**
   * Update appeal status and admin response
   */
  updateAppealStatus(
    appealId: string,
    updateData: UpdateAppealDTO
  ): Promise<EAppeal | null>;

  /**
   * Get appeal statistics
   */
  getAppealStatistics(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    under_review: number;
  }>;

  /**
   * Find recent appeals by user (to prevent spam)
   */
  findRecentAppealsByUser(
    userId: string,
    hoursBack: number
  ): Promise<EAppeal[]>;
}
