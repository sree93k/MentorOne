import { EService } from "../../entities/serviceEntity";
interface GetAllServicesParams {
  page: number;
  limit: number;
  search: string;
  type?: string;
}

interface GetAllServicesResponse {
  services: EService[];
  totalCount: number;
}

export interface IServiceRepository {
  // getAllServices(mentorId: string): Promise<EService[]>;
  getAllServices(
    mentorId: string,
    params: GetAllServicesParams
  ): Promise<GetAllServicesResponse>;
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
  findServicesByTitle(searchQuery: string): Promise<any[]>;
}
