import { EService } from "../../entities/serviceEntity";

export interface IServiceRepository {
  getAllServices(mentorId: string): Promise<EService[]>;
  getServiceById(serviceId: string): Promise<EService | null>;
  updateService(
    serviceId: string,
    serviceData: Partial<EService>
  ): Promise<EService | null>;
  getAllVideoTutorials(): Promise<any[]>;
  getTutorialById(tutorialId: string): Promise<any>;
}
