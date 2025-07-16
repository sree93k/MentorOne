import { ECollegeExperience } from "../../entities/collegeEntity";
import CollegeExperience from "../../models/CollegeExperienceModel";
import { ICareerCollege } from "../interface/ICareerCollege";
import BaseRepository from "./BaseRepository";

export default class CareerCollege
  extends BaseRepository<ECollegeExperience>
  implements ICareerCollege
{
  constructor() {
    super(CollegeExperience);
  }
  async collegeStudentFormDataCreate(
    formData: ECollegeExperience,
    id: string
  ): Promise<ECollegeExperience | null> {
    try {
      console.log(
        "college repo create 1 >>>>>>>>>>>>>>>>>>>>>>>>>>>>",
        formData
      );
      const newCollegeExperience = new CollegeExperience(formData);
      console.log(
        "college repo create 2 >>>>>>>>>>>>>>>>>>>>>>>>>>>>",
        newCollegeExperience
      );
      const result = await newCollegeExperience.save();
      console.log("college repo create 3 >>>>>>>>>>>>>>>>>>>>>>>>>>>>", result);
      return result;
    } catch (error) {
      console.error("Error creating college experience:", error);
      return null;
    }
  }

  async updateCollegeExperience(
    id: string,
    formData: Partial<ECollegeExperience>
  ): Promise<ECollegeExperience | null> {
    try {
      console.log("college repo update 1 >>>>>>>>>>>>>>>>>>>>>>>>>>>>", {
        id,
        formData,
      });
      const result = await CollegeExperience.findByIdAndUpdate(id, formData, {
        new: true,
      });
      console.log("college repo update 2 >>>>>>>>>>>>>>>>>>>>>>>>>>>>", result);
      if (!result) {
        console.error(`College experience not found for id: ${id}`);
      }
      return result;
    } catch (error) {
      console.error("Error updating college experience:", error);
      return null;
    }
  }
}
