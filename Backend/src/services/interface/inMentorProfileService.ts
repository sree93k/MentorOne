import { EUsers } from "../../entities/userEntity";

export interface inMentorProfileService {
  welcomeData(formData: object, id: string): Promise<EUsers | null>;
  profileDatas(userId: string): Promise<EUsers | null>;
}
