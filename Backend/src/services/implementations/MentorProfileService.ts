import UserRepository from "../../repositories/implementations/UserRepository";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { IMentorProfileService } from "../interface/IMentorProfileService";
import { ICareerRepository } from "../../repositories/interface/ICareerRepositoty"; // Fixed typo
import CareerRepositiory from "../../repositories/implementations/CareerRepository";
import { EUsers } from "../../entities/userEntity";
import { ECollegeExperience } from "../../entities/collegeEntity";
import { ESchoolExperience } from "../../entities/schoolEntity";
import { EWorkExperience } from "../../entities/professionalEnitity";
import { IMentorRepository } from "../../repositories/interface/IMentorRepository";
import MentorRepository from "../../repositories/implementations/MentorRepository";
import { IBaseRepository } from "../../repositories/interface/IBaseRepository";
import BaseRepository from "../../repositories/implementations/BaseRepository";
import Users from "../../models/userModel";
import { ApiError } from "../../middlewares/errorHandler";
import { IServiceRepository } from "../../repositories/interface/IServiceRepository";
import ServiceRepository from "../../repositories/implementations/ServiceRepository";
import Schedule from "../../models/scheduleModel";
import BlockedDate from "../../models/blockedModel";
import { ESchedule } from "../../entities/scheduleEntity";
import { EBlockedDate } from "../../entities/blockedEntity";
import SlotRepository from "../../repositories/implementations/SlotRepository";
import { ISlotRepository } from "../../repositories/interface/ISlotRepository";
import CalendarRepository from "../../repositories/implementations/CalenderRepository";
import { ICalendarRepository } from "../../repositories/interface/ICalenderRepository";
import PriorityDMRepository from "../../repositories/implementations/PriorityDMRepository";
import { IPriorityDMRepository } from "../../repositories/interface/IPriorityDmRepository";
import BookingRepository from "../../repositories/implementations/BookingRepository";
import { IBookingRepository } from "../../repositories/interface/IBookingRepository";
import { EMentor } from "../../entities/mentorEntity";
import mongoose from "mongoose";
import { EPriorityDM } from "../../entities/priorityDMEntity";
// Define interfaces
interface WelcomeFormData {
  careerGoal: string;
  interestedCareer: string;
  selectedOptions: string[];
  userType: string;
  [key: string]: any;
}
import { EService } from "../../entities/serviceEntity";

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
export default class MentorProfileService implements IMentorProfileService {
  private UserRepository: IUserRepository;
  private CareerRepository: ICareerRepository;
  private MentorRepository: IMentorRepository;
  private BaseRepository: IBaseRepository<EUsers>;
  private ServiceRepository: IServiceRepository;
  private SlotRepository: ISlotRepository;
  private CalendarRepository: ICalendarRepository;
  private PriorityDMRepository: IPriorityDMRepository;
  private BookingRepository: IBookingRepository;

  constructor() {
    this.UserRepository = new UserRepository();
    this.CareerRepository = new CareerRepositiory();
    this.MentorRepository = new MentorRepository();
    this.BaseRepository = new BaseRepository<EUsers>(Users);
    this.ServiceRepository = new ServiceRepository();
    this.SlotRepository = new SlotRepository();
    this.CalendarRepository = new CalendarRepository();
    this.PriorityDMRepository = new PriorityDMRepository();
    this.BookingRepository = new BookingRepository();
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
  // async createService(formData: Record<string, any>): Promise<EService | null> {
  //   try {
  //     console.log("createService service step 1", formData);
  //     const {
  //       mentorId,
  //       type,
  //       title,
  //       shortDescription,
  //       amount,
  //       duration,
  //       longDescription,
  //       oneToOneType,
  //       digitalProductType,
  //       fileUrl,
  //       exclusiveContent,
  //     } = formData;

  //     // Validate required fields
  //     if (!mentorId || !type || !title || !shortDescription || !amount) {
  //       console.log("createService service step 2");
  //       throw new ApiError(400, "Missing required fields");
  //     }

  //     const service: Partial<EService> = {
  //       mentorId,
  //       type,
  //       title,
  //       shortDescription,
  //       amount: parseFloat(amount),
  //     };

  //     console.log("createService service step 3");

  //     if (type === "1-1Call" || type === "priorityDM") {
  //       console.log("createService service step 4");
  //       if (!duration || !longDescription) {
  //         console.log("createService service step 5");
  //         throw new ApiError(400, "Duration and long description are required");
  //       }
  //       service.duration = parseInt(duration);
  //       service.longDescription = longDescription;
  //       if (type === "1-1Call" && !oneToOneType) {
  //         console.log("createService service step 6");
  //         throw new ApiError(400, "One-to-one type is required");
  //       }
  //       if (type === "1-1Call") {
  //         service.oneToOneType = oneToOneType;
  //       }
  //     } else if (type === "DigitalProducts") {
  //       console.log("createService service step 7");
  //       if (!digitalProductType) {
  //         console.log("createService service step 8");
  //         throw new ApiError(400, "Digital product type is required");
  //       }
  //       service.digitalProductType = digitalProductType;
  //       if (digitalProductType === "documents") {
  //         console.log("createService service step 9");
  //         if (!fileUrl) {
  //           console.log("createService service step 10");
  //           throw new ApiError(400, "File URL is required for documents");
  //         }
  //         service.fileUrl = fileUrl;
  //       } else if (digitalProductType === "videoTutorials") {
  //         console.log("createService service step 11");
  //         const parsedExclusiveContent = Array.isArray(exclusiveContent)
  //           ? exclusiveContent
  //           : JSON.parse(exclusiveContent || "[]");
  //         if (!parsedExclusiveContent.length) {
  //           console.log("createService service step 12");
  //           throw new ApiError(
  //             400,
  //             "Exclusive content is required for video tutorials"
  //           );
  //         }
  //         service.exclusiveContent = parsedExclusiveContent;
  //       }
  //     } else {
  //       console.log("createService service step 13");
  //       throw new ApiError(400, "Invalid service type");
  //     }

  //     console.log("createService service step 14", service);
  //     const newService = await this.MentorRepository.createService(service);
  //     console.log("createService service step 15");
  //     if (!newService) {
  //       console.log("createService service step 16");
  //       throw new ApiError(500, "Failed to create service");
  //     }

  //     console.log("createService service step 17");
  //     return newService;
  //   } catch (error) {
  //     console.log("createService service step 18");
  //     console.error("Error in createService:", error);
  //     throw error;
  //   }
  // }
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
        if (!longDescription) {
          console.log("createService service step 5");
          throw new ApiError(400, "Long description is required");
        }
        service.longDescription = longDescription;

        if (type === "1-1Call") {
          if (!duration) {
            console.log("createService service step 6");
            throw new ApiError(400, "Duration is required for 1-1 Call");
          }
          if (!oneToOneType) {
            console.log("createService service step 7");
            throw new ApiError(400, "One-to-one type is required");
          }
          service.duration = parseInt(duration);
          service.oneToOneType = oneToOneType;
        }
      } else if (type === "DigitalProducts") {
        console.log("createService service step 8");
        if (!digitalProductType) {
          console.log("createService service step 9");
          throw new ApiError(400, "Digital product type is required");
        }
        service.digitalProductType = digitalProductType;
        if (digitalProductType === "documents") {
          console.log("createService service step 10");
          if (!fileUrl) {
            console.log("createService service step 11");
            throw new ApiError(400, "File URL is required for documents");
          }
          service.fileUrl = fileUrl;
        } else if (digitalProductType === "videoTutorials") {
          console.log("createService service step 12");
          const parsedExclusiveContent = Array.isArray(exclusiveContent)
            ? exclusiveContent
            : JSON.parse(exclusiveContent || "[]");
          if (!parsedExclusiveContent.length) {
            console.log("createService service step 13");
            throw new ApiError(
              400,
              "Exclusive content is required for video tutorials"
            );
          }
          service.exclusiveContent = parsedExclusiveContent;
        }
      } else {
        console.log("createService service step 14");
        throw new ApiError(400, "Invalid service type");
      }

      console.log("createService service step 15", service);
      const newService = await this.MentorRepository.createService(service);
      console.log("createService service step 16");
      if (!newService) {
        console.log("createService service step 17");
        throw new ApiError(500, "Failed to create service");
      }

      console.log("createService service step 18");
      return newService;
    } catch (error) {
      console.log("createService service step 19");
      console.error("Error in createService:", error);
      throw error;
    }
  }
  // async getAllServices(userId: string): Promise<EService[]> {
  //   try {
  //     console.log("getAllServices service step 1: Processing userId", userId);

  //     // Fetch services using ServiceRepository
  //     console.log(
  //       "getAllServices service step 2: Fetching services for mentorId",
  //       userId
  //     );
  //     const services = await this.ServiceRepository.getAllServices(userId);
  //     if (!services) {
  //       console.log("getAllServices service step 3: No services found");
  //       return [];
  //     }
  //     console.log("getAllServices service step 4: Services fetched");

  //     return services;
  //   } catch (error: any) {
  //     console.error("getAllServices service error:", {
  //       message: error.message,
  //       stack: error.stack,
  //       userId,
  //     });
  //     throw new ApiError(500, `Failed to fetch services: ${error.message}`);
  //   }
  // }

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
      const { services, totalCount } =
        await this.ServiceRepository.getAllServices(userId, params);
      console.log("getAllServices service step 3: Services fetched");

      const totalPages = Math.ceil(totalCount / params.limit);

      return {
        services,
        totalPages,
        currentPage: params.page,
      };
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

  async getMentorSchedule(serviceId: string): Promise<ESchedule[]> {
    try {
      console.log("getMentorSchedule service step 1", { serviceId });
      const response = await this.SlotRepository.findAvailableSlots(serviceId);
      // const schedule = await Schedule.findOne({ mentorId }).exec();

      console.log("getMentorSchedule service step 2", response);
      return response;
    } catch (error: any) {
      console.error("Error fetching mentor schedule:", error);
      throw new ApiError(
        500,
        `Failed to fetch mentor schedule: ${error.message}`
      );
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
      throw new ApiError(
        500,
        `Failed to fetch mentor blocked dates: ${error.message}`
      );
    }
  }
  // MentorProfileService.ts
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
        throw new ApiError(400, `Invalid serviceId format: ${serviceId}`);
      }

      if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
        console.log(
          "assignScheduleToService service step 3: Invalid scheduleId"
        );
        throw new ApiError(400, `Invalid scheduleId format: ${scheduleId}`);
      }

      // Verify that the schedule exists
      const schedule = await this.CalendarRepository.getSchedules(
        serviceId?.mentorId
      );
      // const schedule = await Schedule.findById(scheduleId).exec();
      if (!schedule) {
        console.log(
          "assignScheduleToService service step 4: Schedule not found"
        );
        throw new ApiError(404, "Schedule not found");
      }

      // Update the service with the scheduleId
      const serviceData: Partial<EService> = {
        slot: new mongoose.Types.ObjectId(scheduleId),
      };

      console.log("assignScheduleToService service step 5: Updating service");
      const updatedService = await this.ServiceRepository.updateService(
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
        throw new ApiError(404, "Service not found");
      }

      console.log(
        "assignScheduleToService service step 7: Service updated",
        updatedService
      );
      return updatedService;
    } catch (error: any) {
      console.error("assignScheduleToService service error:", error);
      throw error instanceof ApiError
        ? error
        : new ApiError(500, `Failed to assign schedule: ${error.message}`);
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
        throw new ApiError(400, `Invalid priorityDMId format: ${priorityDMId}`);
      }

      const priorityDM = await this.PriorityDMRepository.findById(priorityDMId);
      if (!priorityDM) {
        throw new ApiError(404, "Priority DM not found");
      }
      console.log("@@@@@Mentor servcie replyToPriorityDM step 3", priorityDM);
      if (priorityDM.mentorId._id.toString() !== mentorId) {
        console.log("@@@@@Mentor servcie replyToPriorityDM step 4", mentorId);
        console.log(
          "@@@@@Mentor servcie replyToPriorityDM step 4.5",
          priorityDM.mentorId._id
        );
        throw new ApiError(403, "Unauthorized to reply to this Priority DM");
      }

      if (priorityDM.status !== "pending") {
        console.log("@@@@@Mentor servcie replyToPriorityDM step 5");
        throw new ApiError(
          400,
          "Priority DM has already been replied to or closed"
        );
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

      const bookingStatusChange = await this.BookingRepository.update(
        priorityDM?.bookingId?._id,
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
        throw new ApiError(400, `Invalid serviceId format: ${serviceId}`);
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

  // async getAllPriorityDMsByMentor(mentorId: string): Promise<EPriorityDM[]> {
  //   try {
  //     if (!mongoose.Types.ObjectId.isValid(mentorId)) {
  //       throw new ApiError(400, `Invalid mentorId format: ${mentorId}`);
  //     }

  //     const priorityDMs = await this.PriorityDMRepository.findByMentor(
  //       mentorId
  //     );
  //     return priorityDMs;
  //   } catch (error) {
  //     console.error("Error fetching all PriorityDMs by mentor:", error);
  //     throw error;
  //   }
  // }
  // src/services/MentorProfileService.ts
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
        throw new ApiError(400, `Invalid mentorId format: ${mentorId}`);
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
        throw new ApiError(400, "Cannot select more than 5 testimonials");
      }

      const mentor = await this.MentorRepository.findById(mentorId);
      if (!mentor) {
        throw new ApiError(404, "Mentor not found");
      }

      const updatedMentor = await this.MentorRepository.update(mentorId, {
        topTestimonials: testimonialIds,
      });

      return updatedMentor;
    } catch (error: any) {
      throw new ApiError(
        500,
        error.message || "Failed to update top testimonials"
      );
    }
  }
}
