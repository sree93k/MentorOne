import { injectable } from "inversify";
import { EWorkExperience } from "../../entities/professionalEnitity";
import WorkExperience from "../../models/professionalExperienceModel";
import { ICareerProfessional } from "../interface/ICareerProfessional";
import BaseRepository from "./BaseRepository";
@injectable()
export default class CareerProfessional
  extends BaseRepository<EWorkExperience>
  implements ICareerProfessional
{
  constructor() {
    super(WorkExperience);
  }
  async professionalFormDataCreate(
    formData: EWorkExperience & { userType: string },
    id: string
  ): Promise<(EWorkExperience & { userType: string }) | null> {
    try {
      console.log(
        "professional repo create 1 >>>>>>>>>>>>>>>>>>>>>>>>>>>>",
        formData
      );
      const newWorkExperience = new WorkExperience(formData);
      console.log(
        "professional repo create 2 >>>>>>>>>>>>>>>>>>>>>>>>>>>>",
        newWorkExperience
      );
      const result = await newWorkExperience.save();
      console.log(
        "professional repo create 3 >>>>>>>>>>>>>>>>>>>>>>>>>>>>",
        result
      );
      return result;
    } catch (error) {
      console.error("Error creating professional experience:", error);
      return null;
    }
  }

  async updateProfessionalExperience(
    id: string,
    formData: Partial<EWorkExperience & { userType: string }>
  ): Promise<(EWorkExperience & { userType: string }) | null> {
    try {
      console.log("professional repo update 1 >>>>>>>>>>>>>>>>>>>>>>>>>>>>", {
        id,
        formData,
      });
      const result = await WorkExperience.findByIdAndUpdate(id, formData, {
        new: true,
      });
      console.log(
        "professional repo update 2 >>>>>>>>>>>>>>>>>>>>>>>>>>>>",
        result
      );
      if (!result) {
        console.error(`Professional experience not found for id: ${id}`);
      }
      return result;
    } catch (error) {
      console.error("Error updating professional experience:", error);
      return null;
    }
  }
}
