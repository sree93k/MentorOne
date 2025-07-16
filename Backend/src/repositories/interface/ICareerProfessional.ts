import { EWorkExperience } from "../../entities/professionalEnitity";

export interface ICareerProfessional {
  professionalFormDataCreate(
    formData: Partial<EWorkExperience> & { userType: string },
    id: string
  ): Promise<(EWorkExperience & { userType: string }) | null>;
  updateProfessionalExperience(
    id: string,
    formData: Partial<EWorkExperience & { userType: string }>
  ): Promise<(EWorkExperience & { userType: string }) | null>;
}
