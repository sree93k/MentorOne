import { injectable, inject } from "inversify";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { TYPES } from "../../inversify/types";
import { IMentorService } from "../interface/IMentorService";
import {
  UpdateMentorDTO,
  UpdateMentorFieldDTO,
  UpdateMentorProfileDTO,
} from "../../dtos/mentorDTO";
import { EUsers } from "../../entities/userEntity";
import { ECollegeExperience } from "../../entities/collegeEntity";
import { ESchoolExperience } from "../../entities/schoolEntity";
import { EWorkExperience } from "../../entities/professionalEnitity";
import { IMentorRepository } from "../../repositories/interface/IMentorRepository";
import MentorRepository from "../../repositories/implementations/MentorRepository";
import { IServiceService } from "../interface/IServiceServices"; // Changed import
import ServiceService from "./ServiceServices"; // Changed import
import { ESchedule } from "../../entities/scheduleEntity";
import { EBlockedDate } from "../../entities/blockedEntity";
import SlotRepository from "../../repositories/implementations/SlotRepository";
import { ISlotRepository } from "../../repositories/interface/ISlotRepository";
import ScheduleRepository from "../../repositories/implementations/ScheduleRepository";
import { IScheduleRepository } from "../../repositories/interface/IScheduleRepository";
import PriorityDMRepository from "../../repositories/implementations/PriorityDMRepository";
import { IPriorityDMRepository } from "../../repositories/interface/IPriorityDmRepository";
import CareerCollege from "../../repositories/implementations/CareerCollege";
import { ICareerCollege } from "../../repositories/interface/ICareerCollege";
import CareerSchool from "../../repositories/implementations/CareerSchool";
import { ICareerSchool } from "../../repositories/interface/ICareerSchool";
import CareerProfessional from "../../repositories/implementations/CareerProfessional";
import { ICareerProfessional } from "../../repositories/interface/ICareerProfessional";
import BookingService from "./Bookingservice";
import { IBookingService } from "../interface/IBookingService";
import { EMentor } from "../../entities/mentorEntity";
import mongoose from "mongoose";
import { EPriorityDM } from "../../entities/priorityDMEntity";
import { EService } from "../../entities/serviceEntity";
import { CreateServiceDTO, UpdateServiceDTO } from "../../dtos/serviceDTO";

// Define interfaces
interface WelcomeFormData {
  careerGoal: string;
  interestedCareer: string;
  selectedOptions: string[];
  userType: string;
  [key: string]: any;
}

interface GetAllServicesParams {
  page: number;
  limit: number;
  search: string;
  type?: string;
}

interface GetAllServicesResponse {
  services: EService[];
  totalPages: number;
  currentPage: number;
}

@injectable()
export default class MentorService implements IMentorService {
  private UserRepository: IUserRepository;
  private MentorRepository: IMentorRepository;
  private ServiceService: IServiceService; // Changed from ServiceRepository
  private SlotRepository: ISlotRepository;
  private ScheduleRepository: IScheduleRepository;
  private PriorityDMRepository: IPriorityDMRepository;
  private BookingService: IBookingService;
  private CareerCollege: ICareerCollege;
  private CareerSchool: ICareerSchool;
  private CareerProfessional: ICareerProfessional;

  constructor(
    @inject(TYPES.IUserRepository) userRepository: IUserRepository,
    @inject(TYPES.IMentorRepository) mentorRepository: IMentorRepository,
    @inject(TYPES.IServiceServices) serviceService: IServiceServices,
    @inject(TYPES.ISlotRepository) slotRepository: ISlotRepository,
    @inject(TYPES.IScheduleRepository) scheduleRepository: IScheduleRepository,
    @inject(TYPES.IPriorityDmRepository) priorityDMRepository: IPriorityDmRepository,
    @inject(TYPES.IBookingService) bookingService: IBookingService,
    @inject(TYPES.ICareerCollege) careerCollege: ICareerCollege,
    @inject(TYPES.ICareerSchool) careerSchool: ICareerSchool,
    @inject(TYPES.ICareerProfessional) careerProfessional: ICareerProfessional
  ) {
    this.UserRepository = userRepository;
    this.MentorRepository = mentorRepository;
    this.ServiceService = serviceService;
    this.SlotRepository = slotRepository;
    this.ScheduleRepository = scheduleRepository;
    this.PriorityDMRepository = priorityDMRepository;
    this.BookingService = bookingService;
    this.CareerCollege = careerCollege;
    this.CareerSchool = careerSchool;
    this.CareerProfessional = careerProfessional;
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
        linkedinUrl,
        youtubeLink,
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
        linkedinURL: linkedinUrl,
        youtubeURL: youtubeLink,
        portfolio,
        mentorMotivation,
        featuredArticle,
        interestedNewCareer: interestedNewcareer,
      };
      console.log(" mentor service, welcomeData step 4");

      console.log("mentor data is>>>>>>>>>>>", mentorData, "and id :", id);

      const user = await this.UserRepository.findById(id);
      console.log(" mentor service, welcomeData step 5", user);

      if (user?.mentorId) {
        const mentorIdString =
          typeof user.mentorId === "string"
            ? user.mentorId
            : user.mentorId._id.toString();

        await (this.MentorRepository as any).deleteById(mentorIdString);
      }
      if (user?.schoolDetails) {
        const schoolDetailsId =
          typeof user.schoolDetails === "string"
            ? user.schoolDetails
            : user.schoolDetails._id.toString();
        await (this.CareerSchool as any).deleteById(schoolDetailsId);
      } else if (user?.collegeDetails) {
        const collegeDetailsId =
          typeof user.collegeDetails === "string"
            ? user.collegeDetails
            : user.collegeDetails._id.toString();
        await (this.CareerCollege as any).deleteById(collegeDetailsId);
      } else if (user?.professionalDetails) {
        const professionalDetailsId =
          typeof user.professionalDetails === "string"
            ? user.professionalDetails
            : user.professionalDetails._id.toString();
        await (this.CareerProfessional as any).deleteById(
          professionalDetailsId
        );
      }

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
        userServerData = await this.UserRepository.findById(id);
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
          experience = await this.CareerCollege.collegeStudentFormDataCreate(
            userData,
            id
          );
          userType = experience?.userType;
        } else if (formData.userType === "school") {
          console.log("welcomedata service step 6....formdata");
          experience = await this.CareerSchool.schoolStudentFormDataCreate(
            userData,
            id
          );
          userType = experience?.userType;
        } else if (formData.userType === "professional") {
          console.log("welcomedata service step 7...formdata");
          experience = await this.CareerProfessional.professionalFormDataCreate(
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
        throw new Error("Missing required fields");
      }

      // Prepare service data using DTO
      const serviceData: CreateServiceDTO = {
        mentorId,
        type,
        title,
        shortDescription,
        amount: parseFloat(amount),
      };

      console.log("createService service step 3");

      if (type === "1-1Call" || type === "priorityDM") {
        console.log("createService service step 4");
        if (!longDescription) {
          console.log("createService service step 5");
          throw new Error("Long description is required");
        }
        serviceData.longDescription = longDescription;

        if (type === "1-1Call") {
          if (!duration) {
            console.log("createService service step 6");
            throw new Error("Duration is required for 1-1 Call");
          }
          if (!oneToOneType) {
            console.log("createService service step 7");
            throw new Error("One-to-one type is required");
          }
          serviceData.duration = parseInt(duration);
          serviceData.oneToOneType = oneToOneType;
        }
      } else if (type === "DigitalProducts") {
        console.log("createService service step 8");
        if (!digitalProductType) {
          console.log("createService service step 9");
          throw new Error("Digital product type is required");
        }
        serviceData.digitalProductType = digitalProductType;
        if (digitalProductType === "documents") {
          console.log("createService service step 10");
          if (!fileUrl) {
            console.log("createService service step 11");
            throw new Error("File URL is required for documents");
          }
          serviceData.fileUrl = fileUrl;
        } else if (digitalProductType === "videoTutorials") {
          console.log("createService service step 12");
          const parsedExclusiveContent = Array.isArray(exclusiveContent)
            ? exclusiveContent
            : JSON.parse(exclusiveContent || "[]");
          if (!parsedExclusiveContent.length) {
            console.log("createService service step 13");
            throw new Error(
              "Exclusive content is required for video tutorials"
            );
          }

          // 🔒 PROCESS VIDEO DATA: Convert videoKey to videoS3Key for signed URLs
          console.log("createService service step 12.5: Processing video data for signed URLs");
          const processedExclusiveContent = parsedExclusiveContent.map((season: any) => {
            if (season.episodes && Array.isArray(season.episodes)) {
              const processedEpisodes = season.episodes.map((episode: any) => {
                const processedEpisode = { ...episode };
                
                // Convert videoKey to videoS3Key for the signed URL system
                if (episode.videoKey) {
                  processedEpisode.videoS3Key = episode.videoKey;
                  console.log(`🔒 Processed episode: ${episode.title} - S3 Key: ${episode.videoKey}`);
                }
                
                // Keep videoUrl for backward compatibility but prefer S3 keys
                if (episode.videoUrl) {
                  processedEpisode.videoUrl = episode.videoUrl;
                }
                
                return processedEpisode;
              });
              
              return {
                ...season,
                episodes: processedEpisodes
              };
            }
            return season;
          });

          serviceData.exclusiveContent = processedExclusiveContent;
          console.log("createService service step 12.6: Video data processing completed");
        }
      } else {
        console.log("createService service step 14");
        throw new Error("Invalid service type");
      }

      console.log("createService service step 15", serviceData);
      // Use ServiceService instead of repository directly
      const newService = await this.ServiceService.createService(serviceData);
      console.log("createService service step 16");
      if (!newService) {
        console.log("createService service step 17");
        throw new Error("Failed to create service");
      }

      console.log("createService service step 18");
      return newService;
    } catch (error) {
      console.log("createService service step 19");
      console.error("Error in createService:", error);
      throw error;
    }
  }

  async getAllServices(
    userId: string,
    params: GetAllServicesParams
  ): Promise<GetAllServicesResponse> {
    try {
      console.log("getAllServices service step 1: Processing userId", userId);

      console.log(
        "getAllServices service step 2: Fetching services for mentorId",
        userId,
        params
      );
      // Use ServiceService instead of repository directly
      const response = await this.ServiceService.getAllServicesByMentor(
        userId,
        params
      );
      console.log("getAllServices service step 3: Services fetched");

      const totalPages = Math.ceil(response.totalCount / params.limit);

      return {
        services: response.services,
        totalPages,
        currentPage: params.page,
      };
    } catch (error: any) {
      console.error("getAllServices service error:", {
        message: error.message,
        stack: error.stack,
        userId,
      });
      throw new Error(`Failed to fetch services: ${error.message}`);
    }
  }

  async getServiceById(serviceId: string): Promise<EService | null> {
    try {
      console.log("getServiceById service step 1: Fetching service", serviceId);
      // Use ServiceService instead of repository directly
      const service = await this.ServiceService.getServiceById(serviceId);
      console.log("getServiceById service step 2: Service fetched", service);
      return service;
    } catch (error: any) {
      console.error("getServiceById service error:", error);
      throw new Error(`Failed to fetch service: ${error.message}`);
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
        throw new Error(
          "Missing required fields: mentorId, title, shortDescription, or amount"
        );
      }

      // Prepare update data using DTO
      const serviceData: UpdateServiceDTO = {
        title,
        shortDescription,
        amount: parseFloat(amount),
      };

      console.log("updateService service step 4");

      // Get existing service to check type
      const existingService = await this.ServiceService.getServiceById(
        serviceId
      );
      if (!existingService) {
        console.log("updateService service step 5");
        throw new Error("Service not found");
      }

      if (
        existingService.type === "1-1Call" ||
        existingService.type === "priorityDM"
      ) {
        console.log("updateService service step 6");
        if (duration) {
          serviceData.duration = parseInt(duration);
        }
        if (longDescription) {
          serviceData.longDescription = longDescription;
        }
        if (existingService.type === "1-1Call" && oneToOneType) {
          serviceData.oneToOneType = oneToOneType;
        }
      } else if (existingService.type === "DigitalProducts") {
        console.log("updateService service step 7");
        if (!digitalProductType) {
          console.log("updateService service step 8");
          throw new Error("Digital product type is required");
        }
        serviceData.digitalProductType = digitalProductType;
        if (digitalProductType === "documents") {
          console.log("updateService service step 9");
          if (pdfFile && pdfFile_url) {
            console.log("updateService service step 10");
            serviceData.fileUrl = pdfFile_url; // Use S3 URL
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
            throw new Error(
              "Exclusive content is required for video tutorials"
            );
          }
          if (exclusiveContent.length > 0) {
            serviceData.exclusiveContent = exclusiveContent;
          }
        }
      } else {
        console.log("updateService service step 13");
        throw new Error("Invalid service type");
      }

      console.log("updateService service step 14");
      // Use ServiceService instead of repository directly
      const updatedService = await this.ServiceService.updateService(
        serviceId,
        serviceData
      );
      console.log("updateService service step 15");
      if (!updatedService) {
        console.log("updateService service step 16");
        throw new Error("Failed to update service");
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
      throw new Error(`Failed to fetch mentors: ${error.message}`);
    }
  }

  async getMentorById(mentorId: string): Promise<EUsers> {
    try {
      console.log("getMentorById service step 1", { mentorId });
      const mentor = await this.UserRepository.getMentorById(mentorId);
      console.log("getMentorById service step 2: Mentor fetched", mentor);

      if (mentor.isBlocked) {
        throw new Error("Mentor is blocked");
      }

      return mentor;
    } catch (error: any) {
      console.log("getMentorById service step 3: Error", {
        message: error.message,
        stack: error.stack,
      });
      throw error instanceof Error
        ? error
        : new Error(`Failed to fetch mentor: ${error.message}`);
    }
  }

  async findMentorById(mentorId: string): Promise<EMentor | null> {
    try {
      console.log("getMentorById service step 1", { mentorId });
      const mentor = await this.MentorRepository.findById(mentorId);
      console.log("getMentorById service step 2: Mentor fetched", mentor);

      return mentor;
    } catch (error: any) {
      console.log("getMentorById service step 3: Error", {
        message: error.message,
        stack: error.stack,
      });
      throw error instanceof Error
        ? error
        : new Error(`Failed to fetch mentor: ${error.message}`);
    }
  }

  async isApprovalChecking(
    userId: string
  ): Promise<{ isApproved: string | null; approvalReason: string | null }> {
    try {
      console.log("isApprovalChecking step1", userId);
      const response = await this.MentorRepository.getMentor(userId);
      console.log("isApprovalChecking step2");
      return {
        isApproved: response?.isApproved || null,
        approvalReason: response?.approvalReason || null,
      };
    } catch (error: unknown) {
      console.log("isApprovalChecking service step 3: Error");
      throw error instanceof Error
        ? error
        : new Error(
            `Failed to fetch approval status: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
    }
  }

  async getMentorSchedule(serviceId: string): Promise<ESchedule[]> {
    try {
      console.log("getMentorSchedule service step 1", { serviceId });
      const response = await this.SlotRepository.findAvailableSlots(serviceId);
      console.log("getMentorSchedule service step 2", response);
      return response;
    } catch (error: any) {
      console.error("Error fetching mentor schedule:", error);
      throw new Error(`Failed to fetch mentor schedule: ${error.message}`);
    }
  }

  async getMentorBlockedDates(mentorId: string): Promise<EBlockedDate[]> {
    try {
      console.log("getMentorBlockedDates service step 1", { mentorId });
      const response = await this.SlotRepository.findBlockedDates(mentorId);
      console.log("getMentorBlockedDates service step 2", response);
      return response;
    } catch (error: any) {
      console.error("Error fetching mentor blocked dates:", error);
      throw new Error(`Failed to fetch mentor blocked dates: ${error.message}`);
    }
  }

  async assignScheduleToService(
    serviceId: string,
    scheduleId: string
  ): Promise<EService | null> {
    try {
      console.log("assignScheduleToService service step 1", {
        serviceId,
        scheduleId,
      });

      if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        console.log(
          "assignScheduleToService service step 2: Invalid serviceId"
        );
        throw new Error(`Invalid serviceId format: ${serviceId}`);
      }

      if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
        console.log(
          "assignScheduleToService service step 3: Invalid scheduleId"
        );
        throw new Error(`Invalid scheduleId format: ${scheduleId}`);
      }

      // Verify that the schedule exists
      const schedule = await this.ScheduleRepository.getSchedules(
        serviceId?.mentorId
      );
      if (!schedule) {
        console.log(
          "assignScheduleToService service step 4: Schedule not found"
        );
        throw new Error("Schedule not found");
      }

      // Update the service with the scheduleId using ServiceService
      const serviceData: UpdateServiceDTO = {
        slot: new mongoose.Types.ObjectId(scheduleId),
      };

      console.log("assignScheduleToService service step 5: Updating service");
      const updatedService = await this.ServiceService.updateService(
        serviceId,
        serviceData
      );
      console.log(
        "OOOOOOOOOO mentorsevcie assignScheduleToService reposne",
        updatedService
      );

      if (!updatedService) {
        console.log(
          "assignScheduleToService service step 6: Service not found"
        );
        throw new Error("Service not found");
      }

      console.log(
        "assignScheduleToService service step 7: Service updated",
        updatedService
      );
      return updatedService;
    } catch (error: any) {
      console.error("assignScheduleToService service error:", error);
      throw error instanceof Error
        ? error
        : new Error(`Failed to assign schedule: ${error.message}`);
    }
  }

  async replyToPriorityDM(
    priorityDMId: string,
    mentorId: string,
    data: {
      content: string;
      pdfFiles: Array<{ fileName: string; s3Key: string; url: string }>;
    }
  ): Promise<EPriorityDM | null> {
    console.log("@@@@@Mentor servcie replyToPriorityDM step 1");

    try {
      if (!mongoose.Types.ObjectId.isValid(priorityDMId)) {
        console.log("@@@@@Mentor servcie replyToPriorityDM step 2");
        throw new Error(`Invalid priorityDMId format: ${priorityDMId}`);
      }

      const priorityDM = await this.PriorityDMRepository.findById(priorityDMId);
      if (!priorityDM) {
        throw new Error("Priority DM not found");
      }
      console.log("@@@@@Mentor servcie replyToPriorityDM step 3", priorityDM);
      if (priorityDM.mentorId._id.toString() !== mentorId) {
        console.log("@@@@@Mentor servcie replyToPriorityDM step 4", mentorId);
        console.log(
          "@@@@@Mentor servcie replyToPriorityDM step 4.5",
          priorityDM.mentorId._id
        );
        throw new Error("Unauthorized to reply to this Priority DM");
      }

      if (priorityDM.status !== "pending") {
        console.log("@@@@@Mentor servcie replyToPriorityDM step 5");
        throw new Error("Priority DM has already been replied to or closed");
      }
      console.log("@@@@@Mentor servcie replyToPriorityDM step 6");
      const updateData: Partial<EPriorityDM> = {
        mentorReply: {
          content: data.content,
          pdfFiles: data.pdfFiles,
          repliedAt: new Date(),
        },
        status: "replied",
      };
      console.log("@@@@@Mentor servcie replyToPriorityDM step 7");
      const updatedDM = await this.PriorityDMRepository.update(
        priorityDMId,
        updateData
      );
      const bookingId = priorityDM?.bookingId?._id?.toString();
      console.log(
        "@@@@@Mentor servcie replyToPriorityDM step 7.1",
        typeof bookingId
      );
      const bookingStatusChange = await this.BookingService.updateStatus(
        bookingId,
        { status: "completed" }
      );
      console.log(
        "@@@@@Mentor servcie replyToPriorityDM step 7.5",
        bookingStatusChange
      );
      console.log(
        "@@@@@Mentor servcie replyToPriorityDM step 8 final",
        updatedDM
      );
      return updatedDM;
    } catch (error) {
      console.error("Error replying to PriorityDM:", error);
      throw error;
    }
  }

  async getPriorityDMs(
    serviceId: string,
    mentorId: string
  ): Promise<EPriorityDM[]> {
    try {
      if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        throw new Error(`Invalid serviceId format: ${serviceId}`);
      }

      const priorityDMs =
        await this.PriorityDMRepository.findByServiceAndMentor(
          serviceId,
          mentorId
        );

      return priorityDMs;
    } catch (error) {
      console.error("Error fetching PriorityDMs:", error);
      throw error;
    }
  }

  async getAllPriorityDMsByMentor(
    mentorId: string,
    page: number = 1,
    limit: number = 8,
    searchQuery: string = "",
    status?: "pending" | "replied",
    sort?: "asc" | "desc"
  ): Promise<{ priorityDMs: EPriorityDM[]; total: number }> {
    try {
      if (!mongoose.Types.ObjectId.isValid(mentorId)) {
        throw new Error(`Invalid mentorId format: ${mentorId}`);
      }

      const { priorityDMs, total } =
        await this.PriorityDMRepository.findByMentor(
          mentorId,
          page,
          limit,
          searchQuery,
          status,
          sort
        );

      return { priorityDMs, total };
    } catch (error) {
      console.error("Error fetching all PriorityDMs by mentor:", error);
      throw error;
    }
  }

  async updateTopTestimonials(
    mentorId: string,
    testimonialIds: string[]
  ): Promise<EMentor> {
    try {
      if (testimonialIds.length > 5) {
        throw new Error("Cannot select more than 5 testimonials");
      }
      console.log(
        "Mentor service updateTopTestimonials step 1 mentorId",
        mentorId
      );
      console.log(
        "Mentor service updateTopTestimonials step 2 testimonialIds",
        testimonialIds
      );
      const mentor = await this.UserRepository.findById(mentorId);
      console.log(
        "Mentor service updateTopTestimonials step 2.5 mentor",
        mentor
      );
      if (!mentor?.mentorId) {
        throw new Error("Mentor not found");
      }
      console.log(
        "Mentor service updateTopTestimonials step 3 mentor repsonse",
        mentor
      );
      const updatedMentor = await this.MentorRepository.update(
        mentor?.mentorId?._id,
        {
          topTestimonials: testimonialIds,
        }
      );
      console.log(
        "Mentor service updateTopTestimonials step 4 updatedMentor repsonse",
        updatedMentor
      );
      return updatedMentor;
    } catch (error: any) {
      throw new Error(error.message || "Failed to update top testimonials");
    }
  }

  async updateMentorField(
    id: string,
    data: UpdateMentorFieldDTO
  ): Promise<EMentor | null> {
    try {
      const { field, status, reason } = data;

      // Validate the field being updated
      if (!field || !status) {
        throw new Error("Field and status are required");
      }

      const mentor = await this.MentorRepository.updateField(
        id,
        field,
        status,
        reason
      );

      if (!mentor) {
        throw new Error(`Mentor with id ${id} not found`);
      }

      return mentor;
    } catch (error: any) {
      console.error(`Error updating mentor field ${data.field}:`, error);
      throw new Error(error.message || "Failed to update mentor field");
    }
  }

  // async updateMentor(
  //   id: string,
  //   data: UpdateMentorDTO
  // ): Promise<EMentor | null> {
  //   try {
  //     // Validate input
  //     console.log("menotr service updateMentor step 1");

  //     if (!id) {
  //       throw new Error("Mentor ID is required");
  //     }

  //     if (!data || Object.keys(data).length === 0) {
  //       throw new Error("Update data is required");
  //     }
  //     console.log("menotr service updateMentor step 2", data);

  //     // Use the base repository update method
  //     const updatedMentor = await this.MentorRepository.update(id, data);

  //     if (!updatedMentor) {
  //       throw new Error(`Mentor with id ${id} not found`);
  //     }
  //     console.log("menotr service updateMentor step 3");

  //     return updatedMentor;
  //   } catch (error: any) {
  //     console.error("Error updating mentor:", error);
  //     throw new Error(error.message || "Failed to update mentor");
  //   }
  // }
  async updateMentor(
    id: string,
    data: UpdateMentorDTO
  ): Promise<EMentor | null> {
    try {
      console.log("mentor service updateMentor step 1");

      if (!id) {
        throw new Error("Mentor ID is required");
      }

      if (!data || Object.keys(data).length === 0) {
        throw new Error("Update data is required");
      }

      console.log("mentor service updateMentor step 2", data);

      // Check if this is a field-based update (for status changes)
      let updateObject;
      if (data.field && data.status) {
        updateObject = { [data.field]: data.status };
        if (data.reason) {
          updateObject.approvalReason = data.reason;
        }
      } else {
        // Regular update
        updateObject = data;
      }

      console.log(
        "mentor service updateMentor - final update object:",
        updateObject
      );

      const updatedMentor = await this.MentorRepository.update(
        id,
        updateObject
      );

      if (!updatedMentor) {
        throw new Error(`Mentor with id ${id} not found`);
      }

      console.log("mentor service updateMentor step 3");
      return updatedMentor;
    } catch (error: any) {
      console.error("Error updating mentor:", error);
      throw new Error(error.message || "Failed to update mentor");
    }
  }

  async createMentor(data: EMentor): Promise<EMentor | null> {
    try {
      const mentor = await this.MentorRepository.create(data);
      return mentor;
    } catch (error: any) {
      throw new Error(error.message || "Failed to create mentor");
    }
  }
}
