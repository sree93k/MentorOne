import { EService } from "../../entities/serviceEntity";

export interface inServiceRepository {
  getAllServices(mentorId: string): Promise<EService[]>;
}
