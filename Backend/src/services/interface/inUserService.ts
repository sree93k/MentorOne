import { EUsers } from "../../entities/userEntity";
import { EOTP } from "../../entities/OTPEntity";

export interface inUserService {
  findUserWithEmail(user: Partial<EUsers>): Promise<EUsers | null>;
}
