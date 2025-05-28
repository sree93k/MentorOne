// import { EService } from "../../entities/serviceEntity";

// export interface IServiceRepository {
//   getAllServices(mentorId: string): Promise<EService[]>;
//   getServiceById(serviceId: string): Promise<EService | null>;
//   updateService(
//     serviceId: string,
//     serviceData: Partial<EService>
//   ): Promise<EService | null>;
//   getAllVideoTutorials(): Promise<any[]>;
//   getTutorialById(tutorialId: string): Promise<any>;
// }
import { EService } from "../../entities/serviceEntity";

export interface IServiceRepository {
  getAllServices(mentorId: string): Promise<EService[]>;
  getServiceById(serviceId: string): Promise<EService | null>;
  updateService(
    serviceId: string,
    serviceData: Partial<EService>
  ): Promise<EService | null>;
  getAllVideoTutorials(
    type?: string,
    searchQuery?: string,
    page?: number,
    limit?: number
  ): Promise<{ tutorials: any[]; total: number }>;
  getTutorialById(tutorialId: string): Promise<any>;
}
