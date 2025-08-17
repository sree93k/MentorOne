import { EUsers } from "../../entities/userEntity";

/**
 * 🔹 ISP COMPLIANCE: Mentor-specific Query Operations Interface
 * Responsible only for mentor-related queries and data retrieval
 */
export interface IMentorQueryRepository {
  // Mentor-specific Methods
  getAllMentors(
    role?: string,
    page?: number,
    limit?: number,
    searchQuery?: string
  ): Promise<EUsers[]>;

  countMentors(role?: string, searchQuery?: string): Promise<number>;
  getMentorById(mentorId: string): Promise<EUsers>;
  getTopMentors(limit: number): Promise<EUsers[]>;
}