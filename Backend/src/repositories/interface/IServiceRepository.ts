// src/repositories/interface/IServiceRepository.ts
import { EService } from "../../entities/serviceEntity";

export interface IServiceRepository {
  getAllServices(
    mentorId: string,
    params: {
      page: number;
      limit: number;
      search: string;
      type?: string;
    }
  ): Promise<{ services: EService[]; totalCount: number }>;

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
  ): Promise<{ tutorials: EService[]; total: number }>;

  getTutorialById(tutorialId: string): Promise<EService | null>;
  findServicesByTitle(searchQuery: string): Promise<Partial<EService>[]>;
  findServicesById(id: string): Promise<EService | null>;
  getTopServices(limit: number): Promise<EService[]>;

  getAllServicesForMentee(params: {
    page: number;
    limit: number;
    search: string;
    type?: string;
    oneToOneType?: string;
    digitalProductType?: string;
  }): Promise<{ services: EService[]; total: number }>;

  getDocuments(mentorId: string): Promise<EService[]>;
  createDocument(payload: Partial<EService>): Promise<EService>;

  getAllTutorials(
    page: number,
    limit: number,
    type?: "Free" | "Paid",
    search?: string
  ): Promise<{ tutorials: EService[]; total: number }>;
}
