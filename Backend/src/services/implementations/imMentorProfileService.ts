import imUserRepository from "../../repositories/implementations/imUserRepository";
import { inUserRepository } from "../../repositories/interface/inUserRepository";
import { inMentorProfileService } from "../interface/inMentorProfileService";
import { inCareerRepository } from "../../repositories/interface/inCareerRepositoty"; // Fixed typo
import imCareerRepositiory from "../../repositories/implementations/imCareerRepository";
import { EUsers } from "../../entities/userEntity";
import { ObjectId } from "mongoose";
import { ECollegeExperience } from "../../entities/collegeEntity";
import { ESchoolExperience } from "../../entities/schoolEntity";
import { EWorkExperience } from "../../entities/professionalEnitity";
import { inMentorRepository } from "../../repositories/interface/inMentorRepository";
import imMentorRepository from "../../repositories/implementations/imMentorRepository";
import { EMentor } from "../../entities/mentorEntity";
import { inBaseRepository } from "../../repositories/interface/inBaseRepository";
import imBaseRepository from "../../repositories/implementations/imBaseRepository";
import Users from "../../models/userModel";
// Define interfaces
interface WelcomeFormData {
  careerGoal: string;
  interestedCareer: string;
  selectedOptions: string[];
  userType: string;
  [key: string]: any;
}

export default class MentorProfileService implements inMentorProfileService {
  private UserRepository: inUserRepository;
  private CareerRepository: inCareerRepository;
  private MentorRepository: inMentorRepository;
  private BaseRepository: inBaseRepository<EUsers>;
  constructor() {
    this.UserRepository = new imUserRepository();
    this.CareerRepository = new imCareerRepositiory();
    this.MentorRepository = new imMentorRepository();
    this.BaseRepository = new imBaseRepository<EUsers>(Users);
  }

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

      console.log("welcomedata service step 4....formdata", formData);
      const {
        bio,
        skills,
        achievements,
        linkedinURL,
        youtubeURL,
        portfolio,
        mentorMotivation,
        featuredArticle,
        interestedNewcareer,
        imageUrl,
        ...userData
      } = formData;
      console.log("interestedNewcareer>>>>>>>>>>", interestedNewcareer);
      const mentorData = {
        bio,
        skills,
        achievements,
        linkedinURL,
        youtubeURL,
        portfolio,
        mentorMotivation,
        featuredArticle,
        interestedNewCareer: interestedNewcareer,
      };
      console.log("mentor data is>>>>>>>>>>>", mentorData);

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
        userServerData = await this.BaseRepository.getModel()
          .findById(id)
          .populate(populateFields) // Or use populateFields if that's your intent
          .exec();
      }

      let userType;

      console.log("userServerData is>>>", userServerData);

      const newMentor = await this.MentorRepository.createMentor(mentorData);
      console.log("new mentor 11111", newMentor);

      if (!userServerData?.menteeId) {
        console.log("userServerData.meteee not exists....");
        if (
          formData.userType === "fresher" ||
          formData.userType === "college"
        ) {
          console.log("welcomedata service step 5....formdata");
          experience = await this.CareerRepository.collegeStudentFormDataCreate(
            userData,
            id
          );
          userType = experience?.userType;
        } else if (formData.userType === "school") {
          console.log("welcomedata service step 6....formdata");
          experience = await this.CareerRepository.schoolStudentFormDataCreate(
            userData,
            id
          );
          userType = experience?.userType;
        } else if (formData.userType === "professional") {
          console.log("welcomedata service step 7...formdata");
          experience = await this.CareerRepository.professionalFormDataCreate(
            userData,
            id
          );
          userType = experience?.userType;
        }
      } else {
        console.log("userServerData exists....ifelse");
        experience =
          userServerData.schoolDetails ??
          userServerData.collegeDetails ??
          userServerData.professionalDetails ??
          null;
        userType = experience?.userType;
        console.log("use type si %%%%%%%%%%%%%%%%%%%%%%%", userType);
        console.log("use type si %%%%%%%%%%%%%%%%%%%%%%%", experience);
      }

      console.log("welcomedata service step 8....formdata", experience);
      if (experience) {
        console.log("welcomedata service step 9....formdata");
        const userUpdate = await this.UserRepository.mentorUpdate({
          id,
          userType: experience.userType,
          experienceId: experience._id.toString(),
          mentorId: newMentor?._id?.toString() || "",
          imageUrl: imageUrl,
        });
        console.log(
          "welcomedata service step 10....final sevice rturn",
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

  //profile datas
  async profileDatas(userId: string): Promise<EUsers | null> {
    try {
      console.log("profileDatas service step1", userId);
      const response = await this.UserRepository.findById(userId);
      console.log("profileDatas service step2", response);
      if (!response) {
        return null;
      }
      const { password, ...userData } = response.toObject
        ? response.toObject()
        : response;
      return userData as EUsers;
    } catch (error) {
      console.log("error at profileDatas service...last ", error);
      return null;
    }
  }
}
