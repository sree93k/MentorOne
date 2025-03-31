import { EUsers } from "../../entities/userEntity";
import { EOTP } from "../../entities/OTPEntity";
import { inUserService } from "../interface/inUserService";
import imUserRespository from "../../repositories/implementations/imUserRepository";
import { inUserRepository } from "../../repositories/interface/inUserRepository";
import { error } from "console";

export default class UserService implements inUserService {
  private UserRepository: inUserRepository;
  constructor() {
    this.UserRepository = new imUserRespository();
  }

  async findUserWithEmail(user: Partial<EUsers>): Promise<EUsers | null> {
    try {
      console.log("user data step 1 : users", user);

      if (!user.email) {
        console.log("user data step 2 : no user ");

        throw new Error(" Email not existing");
      }
      console.log("user data step 4 : ");
      const userFound = await this.UserRepository.findByEmail(user.email);
      console.log("user data step 5 : ", userFound);
      if (!userFound) {
        console.log("user data step 6 : errror");
        console.error("user not found find with user email imservice", error);
        return null;
      }
      console.log("user data step 7: success ");
      const userObject = userFound.toObject();
      console.log("user data step 8: success ");
      const { password, ...userData } = userObject;
      console.log("user data step 9: success ", userData);
      return userData;
    } catch (error) {
      console.log("eroor at find user with email at service", error);
      return null;
    }
  }
}
