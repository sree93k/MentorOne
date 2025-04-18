import imUserRepository from "../../repositories/implementations/imUserRepository";
import { inUserRepository } from "../../repositories/interface/inUserRepository";
import { inMenteeProfileService } from "../interface/inMenteeProfileService";
import { inCareerRepository } from "../../repositories/interface/inCareerRepositoty"; // Fixed typo
import imCareerRepositiory from "../../repositories/implementations/imCareerRepository";
import { EUsers } from "../../entities/userEntity";
import { ObjectId } from "mongoose";
import { ECollegeExperience } from "../../entities/collegeEntity";
import { ESchoolExperience } from "../../entities/schoolEntity";
import { EWorkExperience } from "../../entities/professionalEnitity";
import { inMenteeRepository } from "../../repositories/interface/inMenteeRepository";
import imMenteeRepository from "../../repositories/implementations/imMenteeRepository";
import { inBaseRepository } from "../../repositories/interface/inBaseRepository";
import imBaseRepositotry from "../../repositories/implementations/imBaseRepository";

// import CollegeExperience from "../../models/CollegeExperienceModel";
// import SchoolExperience from "../../models/schoolExperienceModel";
// import ProfessionalExperience from "../../models/professionalExperienceModel";
import Users from "../../models/userModel";
// import Mentor from "../../models/mentorModel";
// import Mentee from "../../models/menteeModel";
// Define interfaces
interface WelcomeFormData {
  careerGoal: string;
  interestedCareer: string;
  selectedOptions: string[];
  userType: string;
  [key: string]: any;
}

export default class MenteeProfileService implements inMenteeProfileService {
  private UserRepository: inUserRepository;
  private CareerRepository: inCareerRepository;
  private MenteeRepository: inMenteeRepository;
  private BaseRepository: inBaseRepository<EUsers>;
  constructor() {
    this.UserRepository = new imUserRepository();
    this.CareerRepository = new imCareerRepositiory();
    this.MenteeRepository = new imMenteeRepository();
    this.BaseRepository = new imBaseRepositotry<EUsers>(Users);
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
        const userUpdate = await this.UserRepository.updateUser({
          id,
          userType: experience.userType,
          experienceId: experience?._id.toString(), // Convert ObjectId to string
          menteeId: createMentee?._id?.toString(), // Convert ObjectId to string
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

  //editUserProfile
  // public async editUserProfile(
  //   id: string,
  //   payload: any
  // ): Promise<EUsers | null> {
  //   try {
  //     console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

  //     console.log("service editUserProfile step 1", id, payload);

  //     const updateData = await this.BaseRepository.update(id, payload);

  //     console.log("service editUserProfile step 2", updateData);
  //     return updateData;
  //   } catch (error) {
  //     console.log("error at editUserProfile service...last ", error);
  //     return null;
  //   }
  // }

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
}
