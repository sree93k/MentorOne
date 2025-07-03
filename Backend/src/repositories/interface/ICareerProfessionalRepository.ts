import { EWorkExperience } from "../../entities/professionalEnitity";

export interface ICareerProfessionalRepository {
  professionalFormDataCreate(
    formData: Partial<EWorkExperience> & { userType: string }
  ): Promise<EWorkExperience | null>;

  updateProfessionalExperience(
    id: string,
    formData: Partial<EWorkExperience>
  ): Promise<EWorkExperience | null>;
}
