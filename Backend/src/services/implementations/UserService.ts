// import { EUsers } from "../../entities/userEntity";
// import { EOTP } from "../../entities/OTPEntity";
// import { IUserService } from "../interface/IUserService";
// import UserRespository from "../../repositories/implementations/UserRepository";
// import { IUserRepository } from "../../repositories/interface/IUserRepository";
// import { IBaseRepository } from "../../repositories/interface/IBaseRepository";
// import BaseRepositotry from "../../repositories/implementations/BaseRepository";
// import { error } from "console";
// import { string } from "joi";
// import Users from "../../models/userModel";
// import bcrypt from "bcryptjs";
// // Removed incomplete import statement

// export default class UserService implements IUserService {
//   private UserRepository: IUserRepository;
//   private BaseRepository: IBaseRepository<EUsers>;
//   constructor() {
//     this.UserRepository = new UserRespository();
//     this.BaseRepository = new BaseRepositotry<EUsers>(Users);
//   }

//   async findUserWithEmail(user: Partial<EUsers>): Promise<EUsers | null> {
//     try {
//       console.log("user data step 1 : users", user);

//       if (!user.email) {
//         console.log("user data step 2 : no user ");

//         throw new Error(" Email not existing");
//       }
//       console.log("user data step 4 : ");
//       const userFound = await this.UserRepository.findByEmail(user.email);
//       console.log("user data step 5 : ", userFound);
//       if (!userFound) {
//         console.log("user data step 6 : errror");
//         console.error("user not found find with user email imservice", error);
//         return null;
//       }
//       console.log("user data step 7: success ");
//       const userObject = userFound.toObject();
//       console.log("user data step 8: success ");
//       const { password, ...userData } = userObject;
//       console.log("user data step 9: success ", userData);
//       return userData;
//     } catch (error) {
//       console.log("eroor at find user with email at service", error);
//       return null;
//     }
//   }

//   //editUserProfile
//   public async editUserProfile(
//     id: string,
//     payload: any
//   ): Promise<EUsers | null> {
//     try {
//       console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

//       console.log("service editUserProfile step 1", id, payload);

//       const updateData = await this.BaseRepository.update(id, payload);

//       console.log("service editUserProfile step 2", updateData);
//       return updateData;
//     } catch (error) {
//       console.log("error at editUserProfile service...last ", error);
//       return null;
//     }
//   }

//   async updatePassword(
//     id: string,
//     password: string,
//     newPassword: string
//   ): Promise<{ success: boolean; message: string }> {
//     try {
//       console.log(
//         "UserService updatePassword step 1",
//         id,
//         password,
//         newPassword
//       );

//       const user = await this.BaseRepository.findById(id);
//       if (!user || !(user as any).password) {
//         return {
//           success: false,
//           message: "User not found or password missing",
//         };
//       }

//       const isMatch = await bcrypt.compare(password, (user as any).password);
//       if (!isMatch) {
//         return { success: false, message: "Current password is incorrect" };
//       }

//       // Optionally: Hash the new password before storing
//       const hashedPassword = await bcrypt.hash(newPassword, 10);

//       await this.BaseRepository.update(id, { password: hashedPassword } as any);
//       return { success: true, message: "Password updated successfully" };
//     } catch (error) {
//       console.error("Error at updatePassword in UserService:", error);
//       return {
//         success: false,
//         message: "Something went wrong while updating password",
//       };
//     }
//   }

//   async updateOnlineStatus(
//     userId: string,
//     isOnline: boolean,
//     role: "mentor" | "mentee" | null
//   ): Promise<EUsers | null> {
//     try {
//       console.log("UserService updateOnlineStatus step 1", {
//         userId,
//         isOnline,
//         role,
//       });

//       const updateData = {
//         isOnline: {
//           status: isOnline,
//           role: role,
//         },
//       };

//       const updatedUser = await this.BaseRepository.update(userId, updateData);
//       console.log("UserService updateOnlineStatus step 2", updatedUser);

//       if (!updatedUser) {
//         console.error("UserService: Failed to update user", userId);
//         return null;
//       }

//       return updatedUser;
//     } catch (error: any) {
//       console.error(
//         "Error at updateOnlineStatus in UserService:",
//         error.message
//       );
//       throw new Error("Failed to update online status");
//     }
//   }
// }
import { EUsers } from "../../entities/userEntity";
import { EMentee } from "../../entities/menteeEntiry"; // Add your mentee entity
import { EMentor } from "../../entities/mentorEntity"; // Add your mentor entity
import { EOTP } from "../../entities/OTPEntity";
import { IUserService } from "../interface/IUserService";
import UserRespository from "../../repositories/implementations/UserRepository";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { IBaseRepository } from "../../repositories/interface/IBaseRepository";
import BaseRepositotry from "../../repositories/implementations/BaseRepository";
import { error } from "console";
import { string } from "joi";
import Users from "../../models/userModel";
import Mentees from "../../models/menteeModel"; // Add your mentee model
import Mentors from "../../models/mentorModel"; // Add your mentor model
import bcrypt from "bcryptjs";

// Define collection types
type CollectionType = "user" | "mentee" | "mentor";

export default class UserService implements IUserService {
  private UserRepository: IUserRepository;
  private userBaseRepository: IBaseRepository<EUsers>;
  private menteeBaseRepository: IBaseRepository<EMentee>;
  private mentorBaseRepository: IBaseRepository<EMentor>;

  constructor() {
    this.UserRepository = new UserRespository();
    this.userBaseRepository = new BaseRepositotry<EUsers>(Users);
    this.menteeBaseRepository = new BaseRepositotry<EMentee>(Mentees);
    this.mentorBaseRepository = new BaseRepositotry<EMentor>(Mentors);
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
        console.log("user data step 6 : error");
        console.error("user not found find with user email in service", error);
        return null;
      }
      console.log("user data step 7: success ");
      const userObject = userFound.toObject();
      console.log("user data step 8: success ");
      const { password, ...userData } = userObject;
      console.log("user data step 9: success ", userData);
      return userData;
    } catch (error) {
      console.log("error at find user with email at service", error);
      return null;
    }
  }

  // Generic method with collection type parameter - Method 2
  public async editProfile<T>(
    id: string,
    payload: any,
    collectionType: CollectionType
  ): Promise<T | null> {
    try {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      console.log(
        `service editProfile for ${collectionType} step 1`,
        id,
        payload
      );

      let updateData: T | null = null;

      switch (collectionType) {
        case "user":
          updateData = (await this.userBaseRepository.update(id, payload)) as T;
          break;
        case "mentee":
          updateData = (await this.menteeBaseRepository.update(
            id,
            payload
          )) as T;
          break;
        case "mentor":
          updateData = (await this.mentorBaseRepository.update(
            id,
            payload
          )) as T;
          break;
        default:
          throw new Error(`Unsupported collection type: ${collectionType}`);
      }

      console.log(
        `service editProfile for ${collectionType} step 2`,
        updateData
      );
      return updateData;
    } catch (error) {
      console.log(`error at editProfile service for ${collectionType}`, error);
      return null;
    }
  }

  // Convenience method for backward compatibility
  public async editUserProfile(
    id: string,
    payload: any
  ): Promise<EUsers | null> {
    return this.editProfile<EUsers>(id, payload, "user");
  }

  // New convenience methods for mentee and mentor
  public async editMenteeProfile(
    id: string,
    payload: any
  ): Promise<EMentee | null> {
    return this.editProfile<EMentee>(id, payload, "mentee");
  }

  public async editMentorProfile(
    id: string,
    payload: any
  ): Promise<EMentor | null> {
    return this.editProfile<EMentor>(id, payload, "mentor");
  }

  // Helper method to get repository by collection type
  private getRepository(collectionType: CollectionType): IBaseRepository<any> {
    switch (collectionType) {
      case "user":
        return this.userBaseRepository;
      case "mentee":
        return this.menteeBaseRepository;
      case "mentor":
        return this.mentorBaseRepository;
      default:
        throw new Error(`Unsupported collection type: ${collectionType}`);
    }
  }

  // Generic method for finding by ID across collections
  public async findById<T>(
    id: string,
    collectionType: CollectionType
  ): Promise<T | null> {
    try {
      console.log(`Finding ${collectionType} by ID:`, id);

      const repository = this.getRepository(collectionType);
      const result = (await repository.findById(id)) as T;

      console.log(`Found ${collectionType}:`, result);
      return result;
    } catch (error) {
      console.log(`Error finding ${collectionType} by ID:`, error);
      return null;
    }
  }

  async updatePassword(
    id: string,
    password: string,
    newPassword: string,
    collectionType: CollectionType = "user" // Default to user for backward compatibility
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log(
        `UserService updatePassword step 1 for ${collectionType}`,
        id,
        password,
        newPassword
      );

      const repository = this.getRepository(collectionType);
      const user = await repository.findById(id);

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

      // Hash the new password before storing
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await repository.update(id, { password: hashedPassword } as any);
      return { success: true, message: "Password updated successfully" };
    } catch (error) {
      console.error(
        `Error at updatePassword in UserService for ${collectionType}:`,
        error
      );
      return {
        success: false,
        message: "Something went wrong while updating password",
      };
    }
  }

  async updateOnlineStatus(
    userId: string,
    isOnline: boolean,
    role: "mentor" | "mentee" | null,
    collectionType: CollectionType = "user" // Default to user for backward compatibility
  ): Promise<any | null> {
    try {
      console.log(
        `UserService updateOnlineStatus step 1 for ${collectionType}`,
        {
          userId,
          isOnline,
          role,
        }
      );

      const updateData = {
        isOnline: {
          status: isOnline,
          role: role,
        },
      };

      const repository = this.getRepository(collectionType);
      const updatedUser = await repository.update(userId, updateData);
      console.log(
        `UserService updateOnlineStatus step 2 for ${collectionType}`,
        updatedUser
      );

      if (!updatedUser) {
        console.error(
          `UserService: Failed to update ${collectionType}`,
          userId
        );
        return null;
      }

      return updatedUser;
    } catch (error: any) {
      console.error(
        `Error at updateOnlineStatus in UserService for ${collectionType}:`,
        error.message
      );
      throw new Error(`Failed to update online status for ${collectionType}`);
    }
  }

  // Generic bulk update method
  public async bulkUpdate<T>(
    updates: Array<{ id: string; payload: any }>,
    collectionType: CollectionType
  ): Promise<Array<T | null>> {
    try {
      console.log(`Bulk updating ${collectionType} profiles`, updates);

      const repository = this.getRepository(collectionType);
      const results = await Promise.allSettled(
        updates.map(({ id, payload }) => repository.update(id, payload))
      );

      return results.map((result) =>
        result.status === "fulfilled" ? (result.value as T) : null
      );
    } catch (error) {
      console.log(`Error in bulk update for ${collectionType}:`, error);
      return [];
    }
  }
}

// Usage Examples:

// Using the generic editProfile method:
// const userService = new UserService();
// await userService.editProfile<EUsers>(userId, userData, 'user');
// await userService.editProfile<EMentee>(menteeId, menteeData, 'mentee');
// await userService.editProfile<EMentor>(mentorId, mentorData, 'mentor');

// Using convenience methods (backward compatible):
// await userService.editUserProfile(userId, userData);
// await userService.editMenteeProfile(menteeId, menteeData);
// await userService.editMentorProfile(mentorId, mentorData);

// Using other generic methods:
// await userService.findById<EUsers>(userId, 'user');
// await userService.updatePassword(userId, oldPass, newPass, 'mentee');
// await userService.updateOnlineStatus(userId, true, 'mentor', 'mentor');
