import { ECollegeExperience } from "../../entities/collegeEntity";

export interface ICareerCollege {
  collegeStudentFormDataCreate(
    formData: Partial<ECollegeExperience> & { userType: string },
    id: string
  ): Promise<ECollegeExperience | null>;
  updateCollegeExperience(
    id: string,
    formData: Partial<ECollegeExperience>
  ): Promise<ECollegeExperience | null>;
}
