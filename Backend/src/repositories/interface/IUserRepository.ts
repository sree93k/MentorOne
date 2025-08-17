import { IUserCrudRepository } from "./IUserCrudRepository";
import { IMentorQueryRepository } from "./IMentorQueryRepository";
import { IUserStatusRepository } from "./IUserStatusRepository";
import { IUserStatsRepository } from "./IUserStatsRepository";

/**
 * 🔹 ISP COMPLIANCE: Composite User Repository Interface
 * Follows Interface Segregation Principle by extending focused interfaces
 * Clients can depend only on the specific interfaces they need
 */
export interface IUserRepository
  extends IUserCrudRepository,
    IMentorQueryRepository,
    IUserStatusRepository,
    IUserStatsRepository {
  // This interface now composes all user-related operations
  // but clients can inject only the specific interfaces they need
}
