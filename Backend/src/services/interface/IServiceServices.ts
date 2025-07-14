import { EService } from "../../entities/serviceEntity";

export interface GetAllServicesParams {
  page: number;
  limit: number;
  search: string;
  type?: string;
}

export interface GetAllServicesForMenteeParams {
  page: number;
  limit: number;
  search: string;
  type?: string;
  oneToOneType?: string;
  digitalProductType?: string;
}

export interface GetAllServicesResponse {
  services: EService[];
  totalCount: number;
}

export interface GetAllServicesForMenteeResponse {
  services: EService[];
  total: number;
}

export interface GetAllVideoTutorialsParams {
  type?: string;
  searchQuery?: string;
  page?: number;
  limit?: number;
}

export interface GetAllVideoTutorialsResponse {
  tutorials: any[];
  total: number;
}

export interface GetTopServicesResponse {
  services: EService[];
}

export interface IServiceService {
  // Core CRUD operations
  createService(serviceData: Partial<EService>): Promise<EService>;
  getServiceById(serviceId: string): Promise<EService | null>;
  updateService(
    serviceId: string,
    serviceData: Partial<EService>
  ): Promise<EService | null>;
  deleteService(serviceId: string): Promise<boolean>;

  // Mentor-specific operations
  getAllServicesByMentor(
    mentorId: string,
    params: GetAllServicesParams
  ): Promise<GetAllServicesResponse>;

  // Mentee-specific operations
  getAllServicesForMentee(
    params: GetAllServicesForMenteeParams
  ): Promise<GetAllServicesForMenteeResponse>;

  // Video tutorials operations
  getAllVideoTutorials(
    params: GetAllVideoTutorialsParams
  ): Promise<GetAllVideoTutorialsResponse>;
  getTutorialById(tutorialId: string): Promise<any>;

  // Search operations
  findServicesByTitle(searchQuery: string): Promise<EService[]>;
  findServicesById(id: string): Promise<EService | null>;

  // Analytics and ranking
  getTopServices(limit: number): Promise<GetTopServicesResponse>;

  // Validation operations
  validateServiceData(serviceData: Partial<EService>): Promise<void>;
  validateServiceOwnership(
    serviceId: string,
    mentorId: string
  ): Promise<boolean>;
}
