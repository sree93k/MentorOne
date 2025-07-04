import { ESchoolExperience } from "../../entities/schoolEntity";

export interface ICareerSchoolRepository {
  schoolStudentFormDataCreate(
    formData: Partial<ESchoolExperience> & { userType: string }
  ): Promise<ESchoolExperience | null>;

  updateSchoolExperience(
    id: string,
    formData: Partial<ESchoolExperience>
  ): Promise<ESchoolExperience | null>;
}
