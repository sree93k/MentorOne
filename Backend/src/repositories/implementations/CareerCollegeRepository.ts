import { injectable } from "inversify";
import CollegeExperience from "../../models/CollegeExperienceModel";
import { ICareerCollegeRepository } from "../interface/ICareerCollegeRepository";
import { ECollegeExperience } from "../../entities/collegeEntity";
import BaseRepository from "../implementations/BaseRepository";

@injectable()
export default class CareerCollegeRepository
  extends BaseRepository<ECollegeExperience>
  implements ICareerCollegeRepository
{
  constructor() {
    super(CollegeExperience);
  }

  async createCollegeExperience(
    formData: Partial<ECollegeExperience>
  ): Promise<ECollegeExperience> {
    try {
      const newEntry = await this.create(formData);
      return newEntry;
    } catch (error: any) {
      throw new Error(`Failed to create college experience: ${error.message}`);
    }
  }

  async updateCollegeExperience(
    id: string,
    formData: Partial<ECollegeExperience>
  ): Promise<ECollegeExperience | null> {
    try {
      const updated = await this.update(id, formData);
      if (!updated) {
        throw new Error(`College experience not found with ID: ${id}`);
      }
      return updated;
    } catch (error: any) {
      throw new Error(`Failed to update college experience: ${error.message}`);
    }
  }
}
