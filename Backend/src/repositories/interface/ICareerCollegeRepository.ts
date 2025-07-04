import { ECollegeExperience } from "../../entities/collegeEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface ICareerCollegeRepository
  extends IBaseRepository<ECollegeExperience> {
  createCollegeExperience(
    formData: Partial<ECollegeExperience>
  ): Promise<ECollegeExperience>;

  updateCollegeExperience(
    id: string,
    formData: Partial<ECollegeExperience>
  ): Promise<ECollegeExperience | null>;
}
