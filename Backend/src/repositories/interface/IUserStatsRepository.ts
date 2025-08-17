import { EUsers } from "../../entities/userEntity";

/**
 * 🔹 ISP COMPLIANCE: User Statistics and Pagination Interface
 * Responsible only for user statistics and paginated queries
 */
export interface IUserStatsRepository {
  // User Statistics and Pagination
  countAllUsers(query?: any): Promise<number>;
  countUsersByRole(role: string): Promise<number>;
  getAllUsersWithPagination(
    query?: any,
    page?: number,
    limit?: number
  ): Promise<EUsers[]>;
}