// import { injectable } from "inversify";
// import { ICareerProfessionalRepository } from "../interface/ICareerProfessionalRepository";
// import { EWorkExperience } from "../../entities/professionalEnitity";
// import WorkExperience from "../../models/professionalExperienceModel";
// import BaseRepository from "../implementations/BaseRepository";

// @injectable()
// export default class CareerProfessionalRepository
//   extends BaseRepository<EWorkExperience>
//   implements ICareerProfessionalRepository
// {
//   constructor() {
//     super(WorkExperience);
//   }

//   async professionalFormDataCreate(
//     formData: Partial<EWorkExperience> & { userType: string }
//   ): Promise<EWorkExperience | null> {
//     try {
//       return await this.create(formData);
//     } catch (error) {
//       console.error("Error in professionalFormDataCreate:", error);
//       return null;
//     }
//   }

//   async updateProfessionalExperience(
//     id: string,
//     formData: Partial<EWorkExperience>
//   ): Promise<EWorkExperience | null> {
//     try {
//       return await this.update(id, formData);
//     } catch (error) {
//       console.error("Error in updateProfessionalExperience:", error);
//       return null;
//     }
//   }
// }
