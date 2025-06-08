import { EMentor } from "../../entities/mentorEntity";
import { EService } from "../../entities/serviceEntity";

export interface IMentorRepository {
  createMentor(mentorData: EMentor): Promise<EMentor | null>;
  getMentor(id: string): Promise<EMentor | null>;
  updateField(
    id: string,
    field: string,
    status: string,
    reason?: string
  ): Promise<EMentor | null>;

  createService(service: Partial<EService>): Promise<EService | null>;
  createOnlineService(onlineService: Record<string, any>): Promise<string>;
  createDigitalProduct(digitalProduct: Record<string, any>): Promise<string>;
  createVideoTutorial(videoTutorial: Record<string, any>): Promise<string>;
  findById(id: string): Promise<EMentor | null>;
  update(id: string, data: any): Promise<EMentor>;
}
