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
import { ApiError } from "../../middlewares/errorHandler";
import { inServiceRepository } from "../../repositories/interface/inServiceRepository";
import imServiceRepository from "../../repositories/implementations/imServiceRepository";
// Define interfaces
interface WelcomeFormData {
  careerGoal: string;
  interestedCareer: string;
  selectedOptions: string[];
  userType: string;
  [key: string]: any;
}
import { EService } from "../../entities/serviceEntity";
export default class MentorProfileService implements inMentorProfileService {
  private UserRepository: inUserRepository;
  private CareerRepository: inCareerRepository;
  private MentorRepository: inMentorRepository;
  private BaseRepository: inBaseRepository<EUsers>;
  private ServiceRepository: inServiceRepository;
  constructor() {
    this.UserRepository = new imUserRepository();
    this.CareerRepository = new imCareerRepositiory();
    this.MentorRepository = new imMentorRepository();
    this.BaseRepository = new imBaseRepository<EUsers>(Users);
    this.ServiceRepository = new imServiceRepository();
  }

  async welcomeData(
    formData: WelcomeFormData,
    id: string
  ): Promise<EUsers | null> {
    try {
      console.log(" mentor service, welcomeData step 1");
      console.log("welcomedata service step 1....formdata", formData);
      let experience:
        | ECollegeExperience
        | ESchoolExperience
        | EWorkExperience
        | null = null;
      console.log(" mentor service, welcomeData step 2");
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
      console.log(" mentor service, welcomeData step 3");
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
      console.log(" mentor service, welcomeData step 4");

      console.log("mentor data is>>>>>>>>>>>", mentorData, "and id :", id);

      const user = await this.BaseRepository.findById(id);
      console.log(" mentor service, welcomeData step 5", user);

      if (!user) throw new Error("User not found");
      console.log(" mentor service, welcomeData step 6");
      const populateFields: string[] = [];
      if (user.collegeDetails) {
        console.log(" mentor service, welcomeData step 7");
        populateFields.push("collegeDetails");
      }
      if (user.schoolDetails) {
        console.log(" mentor service, welcomeData step 8");
        populateFields.push("schoolDetails");
      }
      if (user.professionalDetails) {
        console.log(" mentor service, welcomeData step 9");
        populateFields.push("professionalDetails");
      }
      console.log(" mentor service, welcomeData step 10");
      let userServerData = user;
      if (populateFields.length > 0) {
        console.log(" mentor service, welcomeData step 11");
        userServerData = await this.BaseRepository.getModel()
          .findById(id)
          .populate(populateFields) // Or use populateFields if that's your intent
          .exec();
      }
      console.log(" mentor service, welcomeData step 12");
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
        console.log("userServerData exists....ifelse", userServerData);
        experience =
          userServerData.schoolDetails ??
          userServerData.collegeDetails ??
          userServerData.professionalDetails ??
          null;
        userType = experience?.userType;
        console.log("use type si %%%%%%%%%%%%%%%%%%%%%%%", experience);
        console.log("use type si %%%%%%%%%%%%%%%%%%%%%%%", userType);
        console.log("use type si %%%%%%%%%%%%%%%%%%%%%%%", experience);
      }

      console.log("welcomedata service step 8....formdata", experience);
      if (experience) {
        const updatedRoles = Array.from(
          new Set([...(user.role || []), "mentor"])
        );
        console.log("welcomedata service step 9....formdata");
        const userUpdate = await this.UserRepository.mentorUpdate({
          id,
          userType: experience.userType,
          experienceId: experience._id.toString(),
          mentorId: newMentor?._id?.toString() || "",
          profilePicture: imageUrl,
          role: updatedRoles,
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
  async createService(formData: Record<string, any>): Promise<EService | null> {
    try {
      console.log("createService service step 1", formData);
      const {
        mentorId,
        type,
        title,
        shortDescription,
        amount,
        duration,
        longDescription,
        oneToOneType,
        digitalProductType,
        fileUrl,
        exclusiveContent,
      } = formData;

      // Validate required fields
      if (!mentorId || !type || !title || !shortDescription || !amount) {
        console.log("createService service step 2");
        throw new ApiError(400, "Missing required fields");
      }

      const service: Partial<EService> = {
        mentorId,
        type,
        title,
        shortDescription,
        amount: parseFloat(amount),
      };

      console.log("createService service step 3");

      if (type === "1-1Call" || type === "priorityDM") {
        console.log("createService service step 4");
        if (!duration || !longDescription) {
          console.log("createService service step 5");
          throw new ApiError(400, "Duration and long description are required");
        }
        service.duration = parseInt(duration);
        service.longDescription = longDescription;
        if (type === "1-1Call" && !oneToOneType) {
          console.log("createService service step 6");
          throw new ApiError(400, "One-to-one type is required");
        }
        if (type === "1-1Call") {
          service.oneToOneType = oneToOneType;
        }
      } else if (type === "DigitalProducts") {
        console.log("createService service step 7");
        if (!digitalProductType) {
          console.log("createService service step 8");
          throw new ApiError(400, "Digital product type is required");
        }
        service.digitalProductType = digitalProductType;
        if (digitalProductType === "documents") {
          console.log("createService service step 9");
          if (!fileUrl) {
            console.log("createService service step 10");
            throw new ApiError(400, "File URL is required for documents");
          }
          service.fileUrl = fileUrl;
        } else if (digitalProductType === "videoTutorials") {
          console.log("createService service step 11");
          const parsedExclusiveContent = Array.isArray(exclusiveContent)
            ? exclusiveContent
            : JSON.parse(exclusiveContent || "[]");
          if (!parsedExclusiveContent.length) {
            console.log("createService service step 12");
            throw new ApiError(
              400,
              "Exclusive content is required for video tutorials"
            );
          }
          service.exclusiveContent = parsedExclusiveContent;
        }
      } else {
        console.log("createService service step 13");
        throw new ApiError(400, "Invalid service type");
      }

      console.log("createService service step 14");
      const newService = await this.MentorRepository.createService(service);
      console.log("createService service step 15");
      if (!newService) {
        console.log("createService service step 16");
        throw new ApiError(500, "Failed to create service");
      }

      console.log("createService service step 17");
      return newService;
    } catch (error) {
      console.log("createService service step 18");
      console.error("Error in createService:", error);
      throw error;
    }
  }

  async getAllServices(userId: string): Promise<EService[]> {
    try {
      console.log("getAllServices service step 1: Processing userId", userId);

      // Fetch services using ServiceRepository
      console.log(
        "getAllServices service step 2: Fetching services for mentorId",
        userId
      );
      const services = await this.ServiceRepository.getAllServices(userId);
      if (!services) {
        console.log("getAllServices service step 3: No services found");
        return [];
      }
      console.log("getAllServices service step 4: Services fetched", services);

      return services;
    } catch (error: any) {
      console.error("getAllServices service error:", {
        message: error.message,
        stack: error.stack,
        userId,
      });
      throw new ApiError(500, `Failed to fetch services: ${error.message}`);
    }
  }

  async getServiceById(serviceId: string): Promise<EService | null> {
    try {
      console.log("getServiceById service step 1: Fetching service", serviceId);
      const service = await this.ServiceRepository.getServiceById(serviceId);
      console.log("getServiceById service step 2: Service fetched", service);
      return service;
    } catch (error: any) {
      console.error("getServiceById service error:", error);
      throw new ApiError(500, `Failed to fetch service: ${error.message}`);
    }
  }

  async updateService(
    serviceId: string,
    formData: Record<string, any>
  ): Promise<EService | null> {
    try {
      console.log("updateService service step 1", formData);

      const {
        mentorId,
        title,
        shortDescription,
        amount,
        duration,
        longDescription,
        oneToOneType,
        digitalProductType,
        pdfFile,
        pdfFile_url,
        videoCount,
      } = formData;

      console.log("updateService service step 2: Parsed formData", {
        mentorId,
        title,
        shortDescription,
        amount,
        duration,
        longDescription,
        oneToOneType,
        digitalProductType,
        pdfFile: pdfFile ? `File: ${pdfFile.originalname}` : null,
        pdfFile_url,
        videoCount,
      });

      if (!mentorId || !title || !shortDescription || !amount) {
        console.log("updateService service step 3: Missing required fields");
        throw new ApiError(
          400,
          "Missing required fields: mentorId, title, shortDescription, or amount"
        );
      }

      const service: Partial<EService> = {
        mentorId,
        title,
        shortDescription,
        amount: parseFloat(amount),
      };

      console.log("updateService service step 4");

      const existingService = await this.ServiceRepository.getServiceById(
        serviceId
      );
      if (!existingService) {
        console.log("updateService service step 5");
        throw new ApiError(404, "Service not found");
      }

      if (
        existingService.type === "1-1Call" ||
        existingService.type === "priorityDM"
      ) {
        console.log("updateService service step 6");
        if (duration) {
          service.duration = parseInt(duration);
        }
        if (longDescription) {
          service.longDescription = longDescription;
        }
        if (existingService.type === "1-1Call" && oneToOneType) {
          service.oneToOneType = oneToOneType;
        }
      } else if (existingService.type === "DigitalProducts") {
        console.log("updateService service step 7");
        if (!digitalProductType) {
          console.log("updateService service step 8");
          throw new ApiError(400, "Digital product type is required");
        }
        service.digitalProductType = digitalProductType;
        if (digitalProductType === "documents") {
          console.log("updateService service step 9");
          if (pdfFile && pdfFile_url) {
            console.log("updateService service step 10");
            service.fileUrl = pdfFile_url; // Use S3 URL
          }
        } else if (digitalProductType === "videoTutorials") {
          console.log("updateService service step 11");
          const exclusiveContent: any[] = [];
          const videoCountNum = parseInt(videoCount || "0", 10);

          for (let i = 0; i < videoCountNum; i++) {
            let seasonIndex = 0;
            let episodeIndex = 0;
            let found = false;

            while (seasonIndex < 100 && !found) {
              episodeIndex = 0;
              while (episodeIndex < 100 && !found) {
                const videoKey = `video_${seasonIndex}_${episodeIndex}`;
                if (formData[videoKey]) {
                  const season = formData[`${videoKey}_season`];
                  const episode = formData[`${videoKey}_episode`];
                  const title = formData[`${videoKey}_title`];
                  const description = formData[`${videoKey}_description`];
                  const videoUrl =
                    formData[`${videoKey}_url`] ||
                    formData[`${videoKey}_videoUrl`];

                  const seasonObj = exclusiveContent.find(
                    (s) => s.season === season
                  );
                  const episodeObj = {
                    episode,
                    title,
                    description,
                    videoUrl,
                  };

                  if (seasonObj) {
                    seasonObj.episodes.push(episodeObj);
                  } else {
                    exclusiveContent.push({
                      season,
                      episodes: [episodeObj],
                    });
                  }

                  found = true;
                }
                episodeIndex++;
              }
              seasonIndex++;
            }
          }

          if (videoCountNum > 0 && exclusiveContent.length === 0) {
            console.log("updateService service step 12");
            throw new ApiError(
              400,
              "Exclusive content is required for video tutorials"
            );
          }
          if (exclusiveContent.length > 0) {
            service.exclusiveContent = exclusiveContent;
          }
        }
      } else {
        console.log("updateService service step 13");
        throw new ApiError(400, "Invalid service type");
      }

      console.log("updateService service step 14");
      const updatedService = await this.ServiceRepository.updateService(
        serviceId,
        service
      );
      console.log("updateService service step 15");
      if (!updatedService) {
        console.log("updateService service step 16");
        throw new ApiError(500, "Failed to update service");
      }

      console.log("updateService service step 17");
      return updatedService;
    } catch (error) {
      console.log("updateService service step 18");
      console.error("Error in updateService:", error);
      throw error;
    }
  }

  async getAllMentors(serviceType?: string): Promise<EUsers[]> {
    try {
      console.log("getAllMentors service step 1", { serviceType });
      let mentors = await this.UserRepository.getAllMentors(serviceType);
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

  // async isApprovalChecking(userId: string): Promise<string | null> {
  //   try {
  //     console.log("isApprovalChecking step1", userId);
  //     const response = await this.MentorRepository.getMentor(userId);
  //     console.log("isApprovalChecking step2", response);
  //     return response?.isApproved || null;
  //   } catch (error: unknown) {
  //     console.log("isApprovalChecking service step 3: Error");
  //     throw error instanceof ApiError
  //       ? error
  //       : new ApiError(
  //           500,
  //           `Failed to fetch isApproval: ${
  //             error instanceof Error ? error.message : "Unknown error"
  //           }`
  //         );
  //   }
  // }
  async isApprovalChecking(
    userId: string
  ): Promise<{ isApproved: string | null; approvalReason: string | null }> {
    try {
      console.log("isApprovalChecking step1", userId);
      const response = await this.MentorRepository.getMentor(userId);
      console.log("isApprovalChecking step2", response);
      return {
        isApproved: response?.isApproved || null,
        approvalReason: response?.approvalReason || null,
      };
    } catch (error: unknown) {
      console.log("isApprovalChecking service step 3: Error");
      throw error instanceof ApiError
        ? error
        : new ApiError(
            500,
            `Failed to fetch approval status: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
    }
  }
}
