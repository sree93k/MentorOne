import { EService } from "../../entities/serviceEntity";

export interface inServiceRepository {
  getAllServices(mentorId: string): Promise<EService[]>;
  getServiceById(serviceId: string): Promise<EService | null>;
  updateService(
    serviceId: string,
    serviceData: Partial<EService>
  ): Promise<EService | null>;
}
