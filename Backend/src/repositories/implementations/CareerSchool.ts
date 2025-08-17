import { injectable } from "inversify";
import { ESchoolExperience } from "../../entities/schoolEntity";
import SchoolExperience from "../../models/schoolExperienceModel";
import { ICareerSchool } from "../interface/ICareerSchool";
import BaseRepository from "./BaseRepository";

@injectable()
export default class CareerSchool
  extends BaseRepository<ESchoolExperience>
  implements ICareerSchool
{
  constructor() {
    super(SchoolExperience);
  }
  async schoolStudentFormDataCreate(
    formData: ESchoolExperience,
    id: string
  ): Promise<ESchoolExperience | null> {
    try {
      console.log(
        "school repo create 1 >>>>>>>>>>>>>>>>>>>>>>>>>>>>",
        formData
      );
      const newSchoolExperience = new SchoolExperience(formData);
      console.log(
        "school repo create 2 >>>>>>>>>>>>>>>>>>>>>>>>>>>>",
        newSchoolExperience
      );
      const result = await newSchoolExperience.save();
      console.log("school repo create 3 >>>>>>>>>>>>>>>>>>>>>>>>>>>>", result);
      return result;
    } catch (error) {
      console.error("Error creating school experience:", error);
      return null;
    }
  }

  async updateSchoolExperience(
    id: string,
    formData: Partial<ESchoolExperience>
  ): Promise<ESchoolExperience | null> {
    try {
      console.log("school repo update 1 >>>>>>>>>>>>>>>>>>>>>>>>>>>>", {
        id,
        formData,
      });
      const result = await SchoolExperience.findByIdAndUpdate(id, formData, {
        new: true,
      });
      console.log("school repo update 2 >>>>>>>>>>>>>>>>>>>>>>>>>>>>", result);
      if (!result) {
        console.error(`School experience not found for id: ${id}`);
      }
      return result;
    } catch (error) {
      console.error("Error updating school experience:", error);
      return null;
    }
  }
}
