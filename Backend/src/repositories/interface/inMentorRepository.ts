import { EUsers } from "../../entities/userEntity";
import { EMentor } from "../../entities/mentorEntity";
import { EService } from "../../entities/serviceEntity";

export interface inMentorRepository {
  createMentor(mentorData: EMentor): Promise<EMentor | null>;
  getMentor(id: string): Promise<EMentor | null>;
  updateField(
    id: string,
    field: string,
    status: string
  ): Promise<EMentor | null>;

  createService(service: Record<string, any>): Promise<EService | null>;
  createOnlineService(onlineService: Record<string, any>): Promise<string>;
  createDigitalProduct(digitalProduct: Record<string, any>): Promise<string>;
  createVideoTutorial(videoTutorial: Record<string, any>): Promise<string>;
}
