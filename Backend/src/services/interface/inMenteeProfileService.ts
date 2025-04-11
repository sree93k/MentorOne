import { EUsers } from "../../entities/userEntity";

export interface inMenteeProfileService {
  welcomeData(formData: object, id: string): Promise<EUsers | null>;
  editUserProfile(id: string, payload: any): Promise<EUsers | null>;
  deleteAccount(id: string): Promise<boolean>;
}
