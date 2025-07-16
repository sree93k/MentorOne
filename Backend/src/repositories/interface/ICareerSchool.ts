import { ESchoolExperience } from "../../entities/schoolEntity";

export interface ICareerSchool {
  schoolStudentFormDataCreate(
    formData: Partial<ESchoolExperience> & { userType: string },
    id: string
  ): Promise<ESchoolExperience | null>;
  updateSchoolExperience(
    id: string,
    formData: Partial<ESchoolExperience>
  ): Promise<ESchoolExperience | null>;
}
