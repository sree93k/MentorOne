import { EUsers } from "../../entities/userEntity";
import { EMentee } from "../../entities/menteeEntiry";
import { EMentor } from "../../entities/mentorEntity";
import { IUserService } from "../interface/IUserService";
import UserRespository from "../../repositories/implementations/UserRepository";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import bcrypt from "bcryptjs";
import * as Yup from "yup";
import CareerCollege from "../../repositories/implementations/CareerCollege";
import { ICareerCollege } from "../../repositories/interface/ICareerCollege";
import CareerSchool from "../../repositories/implementations/CareerSchool";
import { ICareerSchool } from "../../repositories/interface/ICareerSchool";
import CareerProfessional from "../../repositories/implementations/CareerProfessional";
import { ICareerProfessional } from "../../repositories/interface/ICareerProfessional";
import MenteeService from "./MenteeService";
import { IMenteeService } from "../interface/IMenteeService";
import MentorService from "./MentorService";
import { IMentorService } from "../interface/IMentorService";

// Define collection types
type CollectionType = "user" | "mentee" | "mentor";

// Union type for all repository interfaces

// Yup validation schema for collegeDetails
const collegeDetailsSchema = Yup.object().shape({
  collegeName: Yup.string().required("College name is required"),
  course: Yup.string().required("Course is required"),
  specializedIn: Yup.string().optional(),
  city: Yup.string().required("City is required"),
  startDate: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date format (YYYY-MM-DD)")
    .required("Start date is required"),
  endDate: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid end date format (YYYY-MM-DD)")
    .required("End date is required"),
  userType: Yup.string()
    .oneOf(["college", "fresher"], "Invalid user type")
    .required("User type is required"),
});

export default class UserService implements IUserService {
  private UserRepository: IUserRepository;
  private CareerCollege: ICareerCollege;
  private CareerSchool: ICareerSchool;
  private CareerProfessional: ICareerProfessional;
  private MenteeService: IMenteeService;
  private MentorService: IMentorService;
  constructor() {
    this.UserRepository = new UserRespository();
    this.CareerCollege = new CareerCollege();
    this.CareerSchool = new CareerSchool();
    this.CareerProfessional = new CareerProfessional();
    this.MenteeService = new MenteeService();
    this.MentorService = new MentorService();
  }

  async findUserWithEmail(user: Partial<EUsers>): Promise<EUsers | null> {
    try {
      console.log("user data step 1 : users", user);
      if (!user.email) {
        console.log("user data step 2 : no user ");
        throw new Error("Email not existing");
      }
      console.log("user data step 4 : ");
      const userFound = await this.UserRepository.findByEmail(user.email);
      console.log("user data step 5 : ", userFound);
      if (!userFound) {
        console.log("user data step 6 : error");
        console.error("user not found find with user email in service");
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
      const editableFields = [
        "featuredArticle",
        "portfolio",
        "youtubeURL",
        "linkedinURL",
        "achievements",
        "portfolio",
        "bio",
      ];
      if (editableFields.some((key) => key in payload)) {
        console.log(
          "Updating portfolio-related or achievements-related fields.step 1 "
        );
        const user = await this.UserRepository.findById(id);
        console.log(
          "Updating portfolio-related or achievements-related fields.step 2 ",
          user
        );
        const mentorId = user?.mentorId?.toString();
        console.log(
          "Updating portfolio-related or achievements-related fields.step 3 ",
          mentorId
        );
        if (!mentorId) {
          throw new Error("Mentor ID is undefined for this user.");
        }
        const updateMentor = await this.MentorService.updateMentor(
          mentorId,
          payload
        );
        console.log(
          "Updating portfolio-related or achievements-related fields.step 4",
          updateMentor
        );
      }
      if ("schoolDetails" in payload) {
        console.log("Payload has schoolDetails:step 1", payload.schoolDetails);

        const user = await this.UserRepository.findById(id);
        console.log("Payload has schoolDetails:step 2", user);

        const updateSchoolDetails =
          await this.CareerSchool.updateSchoolExperience(
            user?.schoolDetails, // this is ObjectId from User
            payload.schoolDetails // ✅ pass only the object inside
          );

        console.log("Updated schoolDetails >>>>", updateSchoolDetails);
      } else if ("collegeDetails" in payload) {
        console.log(
          "Payload has collegeDetails:step 1",
          payload.collegeDetails
        );

        const user = await this.UserRepository.findById(id);
        console.log("Payload has collegeDetails:step 2", user);

        const updateCollegeDetails =
          await this.CareerCollege.updateCollegeExperience(
            user?.collegeDetails, // this is ObjectId from User
            payload.collegeDetails // ✅ pass only the object inside
          );

        console.log("Updated collegeDetails >>>>", updateCollegeDetails);
      } else if ("professionalDetails" in payload) {
        console.log(
          "Payload has professionalDetails:step 1",
          payload.professionalDetails
        );

        const user = await this.UserRepository.findById(id);
        console.log("Payload has professionalDetails:step 2", user);

        const updateProfessionalDetails =
          await this.CareerProfessional.updateProfessionalExperience(
            user?.professionalDetails, // this is ObjectId from User
            payload.professionalDetails // ✅ pass only the object inside
          );

        console.log(
          "Updated professionalDetails >>>>",
          updateProfessionalDetails
        );
      } else {
        if (collectionType === "user") {
          const user = await this.UserRepository.findById(id);

          if (!user) {
            console.error("User not found:", id);
            throw new Error("User not found");
          }

          let userUpdatePayload = { ...payload };

          // Handle schoolDetails
          if (payload.schoolDetails) {
            // Add schoolDetails validation if needed
            const schoolPayload = {
              ...payload.schoolDetails,
              userType: payload.schoolDetails.userType || "school",
            };
            let schoolDoc;
            if (user.schoolDetails) {
              schoolDoc = await this.CareerSchool.updateSchoolExperience(
                user.schoolDetails.toString(), // Ensure ObjectId is passed as string
                schoolPayload
              );
            } else {
              schoolDoc = await this.CareerSchool.schoolStudentFormDataCreate(
                schoolPayload,
                id
              );
              if (schoolDoc) {
                userUpdatePayload.schoolDetails = schoolDoc._id;
              }
            }
            if (!schoolDoc) {
              throw new Error("Failed to update or create school details");
            }
          }

          // Handle collegeDetails
          if (payload.collegeDetails) {
            // Validate collegeDetails payload
            await collegeDetailsSchema.validate(payload.collegeDetails, {
              abortEarly: false,
            });

            const collegePayload = {
              ...payload.collegeDetails,
              collegeName:
                payload.collegeDetails.collegeName ||
                payload.collegeDetails.college, // Map 'college' to 'collegeName' for backward compatibility
              userType:
                payload.collegeDetails.userType ||
                user.category ||
                user.collegeDetails?.userType ||
                "college",
            };
            let collegeDoc;
            if (user.collegeDetails) {
              collegeDoc = await this.CareerCollege.updateCollegeExperience(
                user.collegeDetails.toString(), // Ensure ObjectId is passed as string
                collegePayload
              );
            } else {
              collegeDoc =
                await this.CareerCollege.collegeStudentFormDataCreate(
                  collegePayload,
                  id
                );
              if (collegeDoc) {
                userUpdatePayload.collegeDetails = collegeDoc._id;
              }
            }
            if (!collegeDoc) {
              throw new Error("Failed to update or create college details");
            }
          }

          // Handle professionalDetails
          if (payload.professionalDetails) {
            // Add professionalDetails validation if needed
            const professionalPayload = {
              ...payload.professionalDetails,
              userType: payload.professionalDetails.userType || "professional",
            };
            let professionalDoc;
            if (user.professionalDetails) {
              professionalDoc =
                await this.CareerProfessional.updateProfessionalExperience(
                  user.professionalDetails.toString(),
                  professionalPayload
                );
            } else {
              professionalDoc =
                await this.CareerProfessional.professionalFormDataCreate(
                  professionalPayload,
                  id
                );
              if (professionalDoc) {
                userUpdatePayload.professionalDetails = professionalDoc._id;
              }
            }
            if (!professionalDoc) {
              throw new Error(
                "Failed to update or create professional details"
              );
            }
          }

          // Update user document with references or other fields
          updateData = (await this.UserRepository.update(
            id,
            userUpdatePayload
          )) as T;
        } else {
          // Handle mentee or mentor updates
          switch (collectionType) {
            case "mentee":
              updateData = (await this.MenteeService.updateMentee(
                id,
                payload
              )) as T;
              break;
            case "mentor":
              updateData = (await this.MentorService.updateMentor(
                id,
                payload
              )) as T;
              break;
            default:
              throw new Error(`Unsupported collection type: ${collectionType}`);
          }
        }
      }

      updateData = await this.UserRepository.findById(id);

      console.log(
        `service editProfile for ${collectionType} step 2`,
        updateData
      );
      return updateData;
    } catch (error) {
      console.log(`error at editProfile service for ${collectionType}`, error);
      throw error; // Throw error to be handled by controller
    }
  }

  public async editUserProfile(
    id: string,
    payload: any
  ): Promise<EUsers | null> {
    return this.editProfile<EUsers>(id, payload, "user");
  }

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

  private getRepository(collectionType: CollectionType): RepositoryType {
    switch (collectionType) {
      case "user":
        return this.UserRepository;
      case "mentee":
        return this.MenteeService;
      case "mentor":
        return this.MentorService;
      default:
        throw new Error(`Unsupported collection type: ${collectionType}`);
    }
  }

  public async findById<T>(
    id: string,
    collectionType: CollectionType
  ): Promise<T | null> {
    try {
      console.log(`Finding ${collectionType} by ID:`, id);

      let result: T | null = null;

      // Handle each collection type specifically
      switch (collectionType) {
        case "user":
          // For Users collection, just use findById with single argument
          result = (await this.UserRepository.findById(id)) as T;
          break;
        case "mentee":
          result = (await this.MenteeService.findMenteeById(id)) as T;
          break;
        case "mentor":
          result = (await this.MentorService.getMentorById(id)) as T;
          break;
        default:
          throw new Error(`Unsupported collection type: ${collectionType}`);
      }

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
    collectionType: CollectionType = "user"
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log(
        `UserService updatePassword step 1 for ${collectionType}`,
        id,
        password,
        newPassword
      );

      let user: any = null;

      // Get user from appropriate repository
      switch (collectionType) {
        case "user":
          user = await this.UserRepository.findById(id);
          break;
        case "mentee":
          user = await this.MenteeService.findMenteeById(id);
          break;
        case "mentor":
          user = await this.MentorService.getMentorById(id);
          break;
        default:
          throw new Error(`Unsupported collection type: ${collectionType}`);
      }

      if (!user || !user.password) {
        return {
          success: false,
          message: "User not found or password missing",
        };
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return { success: false, message: "Current password is incorrect" };
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password in appropriate repository
      switch (collectionType) {
        case "user":
          await this.UserRepository.update(id, {
            password: hashedPassword,
          } as any);
          break;
        case "mentee":
          await this.MenteeService.updateMentee(id, {
            password: hashedPassword,
          } as any);
          break;
        case "mentor":
          await this.MentorService.updateMentor(id, {
            password: hashedPassword,
          } as any);
          break;
      }

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
    collectionType: CollectionType = "user"
  ): Promise<any | null> {
    try {
      console.log(
        `UserService updateOnlineStatus step 1 for ${collectionType}`,
        { userId, isOnline, role }
      );

      const updateData = {
        isOnline: { status: isOnline, role },
      };

      let updatedUser: any = null;

      // Update in appropriate repository
      switch (collectionType) {
        case "user":
          updatedUser = await this.UserRepository.update(userId, updateData);
          break;
        case "mentee":
          updatedUser = await this.MenteeService.updateMentee(
            userId,
            updateData
          );
          break;
        case "mentor":
          updatedUser = await this.MentorService.updateMentor(
            userId,
            updateData
          );
          break;
        default:
          throw new Error(`Unsupported collection type: ${collectionType}`);
      }

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

  public async bulkUpdate<T>(
    updates: Array<{ id: string; payload: any }>,
    collectionType: CollectionType
  ): Promise<Array<T | null>> {
    try {
      console.log(`Bulk updating ${collectionType} profiles`, updates);

      const results = await Promise.allSettled(
        updates.map(async ({ id, payload }) => {
          switch (collectionType) {
            case "user":
              return await this.UserRepository.update(id, payload);
            case "mentee":
              return await this.MenteeService.updateMentee(id, payload);
            case "mentor":
              return await this.MentorService.updateMentor(id, payload);
            default:
              throw new Error(`Unsupported collection type: ${collectionType}`);
          }
        })
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
