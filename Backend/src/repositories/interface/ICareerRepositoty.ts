import { EUsers } from "../../entities/userEntity";
import { ESchoolExperience } from "../../entities/schoolEntity";
import { EWorkExperience } from "../../entities/professionalEnitity";
import { ECollegeExperience } from "../../entities/collegeEntity";
import { EGoals } from "../../entities/goalsEntity";
export interface ICareerRepository {
  createGoalDatas(data: {
    careerGoals: string;
    interestedNewcareer: string;
    goals: string[];
  }): Promise<EGoals>;
  collegeStudentFormDataCreate(
    formData: Partial<ECollegeExperience> & { userType: string },
    id: string
  ): Promise<ECollegeExperience | null>;
  schoolStudentFormDataCreate(
    formData: Partial<ESchoolExperience> & { userType: string },
    id: string
  ): Promise<ESchoolExperience | null>;
  professionalFormDataCreate(
    formData: Partial<EWorkExperience> & { userType: string },
    id: string
  ): Promise<(EWorkExperience & { userType: string }) | null>;
  updateSchoolExperience(
    id: string,
    formData: Partial<ESchoolExperience>
  ): Promise<ESchoolExperience | null>;
  collegeStudentFormDataCreate(
    formData: ECollegeExperience,
    id: string
  ): Promise<ECollegeExperience | null>;
  updateProfessionalExperience(
    id: string,
    formData: Partial<EWorkExperience & { userType: string }>
  ): Promise<(EWorkExperience & { userType: string }) | null>;
  updateCollegeExperience(
    id: string,
    formData: Partial<ECollegeExperience>
  ): Promise<ECollegeExperience | null>;
}
