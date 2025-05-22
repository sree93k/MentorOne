import { EService } from "../../entities/serviceEntity";
import { EUsers } from "../../entities/userEntity";

export interface IMentorProfileService {
  welcomeData(formData: object, id: string): Promise<EUsers | null>;
  profileDatas(userId: string): Promise<EUsers | null>;
  createService(formData: Record<string, any>): Promise<EService | null>;
  getAllServices(userId: string): Promise<EService[]>;
  getServiceById(serviceId: string): Promise<EService | null>;
  updateService(
    serviceId: string,
    formData: Record<string, any>
  ): Promise<EService | null>;
  getAllMentors(serviceType?: string): Promise<EUsers[]>;
  getMentorById(mentorId: string): Promise<EUsers>;

  isApprovalChecking(
    userId: string
  ): Promise<{ isApproved: string | null; approvalReason: string | null }>;
}
