import { injectable } from "inversify";
import { ICareerSchoolRepository } from "../interface/ICareerSchoolRepository";
import { ESchoolExperience } from "../../entities/schoolEntity";
import SchoolExperience from "../../models/schoolExperienceModel";
import BaseRepository from "../implementations/BaseRepository";

@injectable()
export class CareerSchoolRepository
  extends BaseRepository<ESchoolExperience>
  implements ICareerSchoolRepository
{
  constructor() {
    super(SchoolExperience);
  }

  async schoolStudentFormDataCreate(
    formData: Partial<ESchoolExperience> & { userType: string }
  ): Promise<ESchoolExperience | null> {
    try {
      return await this.create(formData);
    } catch (error) {
      console.error("Error in schoolStudentFormDataCreate:", error);
      return null;
    }
  }

  async updateSchoolExperience(
    id: string,
    formData: Partial<ESchoolExperience>
  ): Promise<ESchoolExperience | null> {
    try {
      return await this.update(id, formData);
    } catch (error) {
      console.error("Error in updateSchoolExperience:", error);
      return null;
    }
  }
}
