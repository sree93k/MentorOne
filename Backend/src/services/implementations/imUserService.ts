import { EUsers } from "../../entities/userEntity";
import { EOTP } from "../../entities/OTPEntity";
import { inUserService } from "../interface/inUserService";
import imUserRespository from "../../repositories/implementations/imUserRepository";
import { inUserRepository } from "../../repositories/interface/inUserRepository";
import { inBaseRepository } from "../../repositories/interface/inBaseRepository";
import imBaseRepositotry from "../../repositories/implementations/imBaseRepository";
import { error } from "console";
import { string } from "joi";
import Users from "../../models/userModel";
import bcrypt from "bcryptjs";
// Removed incomplete import statement

export default class UserService implements inUserService {
  private UserRepository: inUserRepository;
  private BaseRepository: inBaseRepository<EUsers>;
  constructor() {
    this.UserRepository = new imUserRespository();
    this.BaseRepository = new imBaseRepositotry<EUsers>(Users);
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

  //editUserProfile
  public async editUserProfile(
    id: string,
    payload: any
  ): Promise<EUsers | null> {
    try {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

      console.log("service editUserProfile step 1", id, payload);

      const updateData = await this.BaseRepository.update(id, payload);

      console.log("service editUserProfile step 2", updateData);
      return updateData;
    } catch (error) {
      console.log("error at editUserProfile service...last ", error);
      return null;
    }
  }

  async updatePassword(
    id: string,
    password: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log(
        "UserService updatePassword step 1",
        id,
        password,
        newPassword
      );

      const user = await this.BaseRepository.findById(id);
      if (!user || !(user as any).password) {
        return {
          success: false,
          message: "User not found or password missing",
        };
      }

      const isMatch = await bcrypt.compare(password, (user as any).password);
      if (!isMatch) {
        return { success: false, message: "Current password is incorrect" };
      }

      // Optionally: Hash the new password before storing
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.BaseRepository.update(id, { password: hashedPassword } as any);
      return { success: true, message: "Password updated successfully" };
    } catch (error) {
      console.error("Error at updatePassword in UserService:", error);
      return {
        success: false,
        message: "Something went wrong while updating password",
      };
    }
  }
}
