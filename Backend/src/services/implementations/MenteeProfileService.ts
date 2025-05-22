import UserRepository from "../../repositories/implementations/UserRepository";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { IMenteeProfileService } from "../interface/IMenteeProfileService";
import { ICareerRepository } from "../../repositories/interface/ICareerRepositoty"; // Fixed typo
import CareerRepositiory from "../../repositories/implementations/CareerRepository";
import { EUsers } from "../../entities/userEntity";
import { ObjectId } from "mongoose";
import { ECollegeExperience } from "../../entities/collegeEntity";
import { ESchoolExperience } from "../../entities/schoolEntity";
import { EWorkExperience } from "../../entities/professionalEnitity";
import { IMenteeRepository } from "../../repositories/interface/IMenteeRepository";
import MenteeRepository from "../../repositories/implementations/MenteeRepository";
import { IBaseRepository } from "../../repositories/interface/IBaseRepository";
import BaseRepositotry from "../../repositories/implementations/BaseRepository";
import { ApiError } from "../../middlewares/errorHandler";

import Users from "../../models/userModel";

interface WelcomeFormData {
  careerGoal: string;
  interestedCareer: string;
  selectedOptions: string[];
  userType: string;
  [key: string]: any;
}

export default class MenteeProfileService implements IMenteeProfileService {
  private UserRepository: IUserRepository;
  private CareerRepository: ICareerRepository;
  private MenteeRepository: IMenteeRepository;
  private BaseRepository: IBaseRepository<EUsers>;
  constructor() {
    this.UserRepository = new UserRepository();
    this.CareerRepository = new CareerRepositiory();
    this.MenteeRepository = new MenteeRepository();
    this.BaseRepository = new BaseRepositotry<EUsers>(Users);
  }
  //welcomeData
  async welcomeData(
    formData: WelcomeFormData,
    id: string
  ): Promise<EUsers | null> {
    try {
      console.log("welcomedata service step 1....formdata", formData);
      let experience:
        | ECollegeExperience
        | ESchoolExperience
        | EWorkExperience
        | null = null;
      console.log("welcomedata service step 2....formdata");
      const { careerGoals, interestedNewcareer, goals, ...userData } = formData;
      console.log("welcomedata service step 3....formdata");
      const menteeData = {
        careerGoals,
        interestedNewcareer,
        joinPurpose: goals,
      };
      const user = await this.BaseRepository.findById(id);
      if (!user) throw new Error("User not found");

      const populateFields: string[] = [];
      if (user.collegeDetails) {
        populateFields.push("collegeDetails");
      }
      if (user.schoolDetails) {
        populateFields.push("schoolDetails");
      }

      let userServerData = user;
      if (populateFields.length > 0) {
        userServerData = await this.BaseRepository?.getModel()
          .findById(id)
          .populate(populateFields) // Or use populateFields if that's your intent
          .exec();
      }
      console.log("userserverdata is >>>>", userServerData);
      const createMentee = await this.MenteeRepository.createMentee(menteeData);
      let userType;

      if (!userServerData?.mentorId) {
        if (
          userData.userType === "fresher" ||
          userData.userType === "college"
        ) {
          console.log("welcomedata service step 5....formdata");
          experience = await this.CareerRepository.collegeStudentFormDataCreate(
            userData,
            id
          );
          userType = experience?.userType;
        } else if (userData.userType === "school") {
          console.log("welcomedata service step 6....formdata");
          experience = await this.CareerRepository.schoolStudentFormDataCreate(
            userData,
            id
          );
          userType = experience?.userType;
        } else if (userData.userType === "professional") {
          console.log("welcomedata service step 7...formdata");
          experience = await this.CareerRepository.professionalFormDataCreate(
            userData,
            id
          );
          userType = experience?.userType;
        }
      } else {
        console.log("sampel else>>>>>>>>>>>>>>>>>>");

        experience =
          userServerData.schoolDetails ??
          userServerData.collegeDetails ??
          userServerData.professionalDetails ??
          null;
        userType = experience?.userType;
      }
      console.log("welcomedata service step 4....formdata", experience);

      console.log(
        "welcomedata service step 8....formdata experience",
        experience,
        "and create menteee",
        createMentee
      );
      if (experience && createMentee) {
        console.log("welcomedata service step 9....formdata");
        const updatedRoles = Array.from(
          new Set([...(user.role || []), "mentee"])
        );
        const userUpdate = await this.UserRepository.updateUser({
          id,
          userType: experience.userType,
          experienceId: experience?._id.toString(), // Convert ObjectId to string
          menteeId: createMentee?._id?.toString(),
          role: updatedRoles, // Convert ObjectId to string
        });
        console.log(
          "welcomedata service step 10.final sevice rturn",
          userUpdate
        );
        return userUpdate;
      }
      return null;
    } catch (error) {
      console.log("error at welcomedata service...last ", error);
      return null;
    }
  }
  //

  public async userProfielData(
    id: string
  ): Promise<{ user: Omit<EUsers, "password">[] } | null> {
    try {
      const response = await this.UserRepository.findById(id);

      const { password, ...userData } = response?.toObject();
      return { user: userData };
    } catch (error) {
      console.log("error at welcomedata service...last ", error);
      return null;
    }
  }

  //deleteAccount
  public async deleteAccount(id: string): Promise<boolean> {
    try {
      const user = await this.BaseRepository.findById(id);
      //   if (!user) return false;

      //   // Delete referenced documents
      //   if (user.collegeDetails) {
      //     await CollegeExperience.findByIdAndDelete(user.collegeDetails);
      //   }
      //   if (user.schoolDetails) {
      //     await SchoolExperience.findByIdAndDelete(user.schoolDetails);
      //   }
      //   if (user.professionalDetails) {
      //     await ProfessionalExperience.findByIdAndDelete(
      //       user.professionalDetails
      //     );
      //   }
      //   if (user.mentorId) {
      //     await Mentor.findByIdAndDelete(user.mentorId);
      //   }
      //   if (user.menteeId) {
      //     await Mentee.findByIdAndDelete(user.menteeId);
      //   }

      // Delete user
      return await this.BaseRepository.delete(id);
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  }
  async getAllMentors(): Promise<EUsers[]> {
    try {
      console.log("getAllMentors service step 1");
      let mentors = await this.UserRepository.getAllMentors();
      console.log(
        "getAllMentors service step 2: Mentors fetched",
        mentors.length
      );

      // Filter by isBlocked and isApproved
      mentors = mentors.filter(
        (mentor) => !mentor.isBlocked && mentor?.isApproved === "Approved"
      );
      console.log(
        "getAllMentors service step 3: Filtered by isBlocked and isApproved",
        mentors.length
      );

      return mentors;
    } catch (error: any) {
      console.log("getAllMentors service step 4: Error", {
        message: error.message,
        stack: error.stack,
      });
      throw new ApiError(500, `Failed to fetch mentors: ${error.message}`);
    }
  }

  async getMentorById(mentorId: string): Promise<EUsers> {
    try {
      console.log("getMentorById service step 1", { mentorId });
      const mentor = await this.UserRepository.getMentorById(mentorId);
      console.log("getMentorById service step 2: Mentor fetched", mentor);

      if (mentor.isBlocked) {
        throw new ApiError(403, "Mentor is blocked");
      }

      return mentor;
    } catch (error: any) {
      console.log("getMentorById service step 3: Error", {
        message: error.message,
        stack: error.stack,
      });
      throw error instanceof ApiError
        ? error
        : new ApiError(500, `Failed to fetch mentor: ${error.message}`);
    }
  }
}
