import UserRepository from "../../repositories/implementations/UserRepository";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { IMenteeProfileService } from "../interface/IMenteeProfileService";
import { ICareerRepository } from "../../repositories/interface/ICareerRepositoty";
import CareerRepositiory from "../../repositories/implementations/CareerRepository";
import { EUsers } from "../../entities/userEntity";
import { ObjectId } from "mongoose";
import PriorityDMRepository from "../../repositories/implementations/PriorityDMRepository";
import { IPriorityDMRepository } from "../../repositories/interface/IPriorityDmRepository";
import { ECollegeExperience } from "../../entities/collegeEntity";
import { ESchoolExperience } from "../../entities/schoolEntity";
import { EWorkExperience } from "../../entities/professionalEnitity";
import { IMenteeRepository } from "../../repositories/interface/IMenteeRepository";
import MenteeRepository from "../../repositories/implementations/MenteeRepository";
import { IBaseRepository } from "../../repositories/interface/IBaseRepository";
import BaseRepositotry from "../../repositories/implementations/BaseRepository";
import Users from "../../models/userModel";
import { EPriorityDM } from "../../entities/priorityDMEntity";
import ServiceRepository from "../../repositories/implementations/ServiceRepository";
import { IServiceRepository } from "../../repositories/interface/IServiceRepository";
import BookingRepository from "../../repositories/implementations/BookingRepository";
import { IBookingRepository } from "../../repositories/interface/IBookingRepository";
import mongoose from "mongoose";
import { ITestimonialService } from "../interface/ITestimonialService";
import { IBookingService } from "../interface/IBookingService";
import BookingService from "./Bookingservice";
import TestimonialService from "./TestimonialService";
import { EService } from "../../entities/serviceEntity";
import { ETestimonial } from "../../entities/testimonialEntity";
import WalletRepository from "../../repositories/implementations/WalletRepository";
import { IWalletRepository } from "../../repositories/interface/IWalletRepository";
interface WelcomeFormData {
  careerGoal: string;
  interestedCareer: string;
  selectedOptions: string[];
  userType: string;
  [key: string]: any;
}
interface DashboardData {
  topServices: EService[];
  topMentors: EUsers[];
  topTestimonials: ETestimonial[];
}

export default class MenteeProfileService implements IMenteeProfileService {
  private UserRepository: IUserRepository;
  private CareerRepository: ICareerRepository;
  private MenteeRepository: IMenteeRepository;
  private BaseRepository: IBaseRepository<EUsers>;
  private PriorityDMRepository: IPriorityDMRepository;
  private ServiceRepository: IServiceRepository;
  private BookingRepository: IBookingRepository;
  private BookingService: IBookingService;
  private Testimonial: ITestimonialService;
  private WalletRepository: IWalletRepository;
  constructor() {
    this.UserRepository = new UserRepository();
    this.CareerRepository = new CareerRepositiory();
    this.MenteeRepository = new MenteeRepository();
    this.BaseRepository = new BaseRepositotry<EUsers>(Users);
    this.PriorityDMRepository = new PriorityDMRepository();
    this.ServiceRepository = new ServiceRepository();
    this.BookingRepository = new BookingRepository();
    this.BookingService = new BookingService();
    this.Testimonial = new TestimonialService();
    this.WalletRepository = new WalletRepository();
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
        await this.WalletRepository.createWallet(id);
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

      // Delete user
      return await this.BaseRepository.delete(id);
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  }

  async getAllMentors(
    page: number = 1,
    limit: number = 12,
    role?: string,
    searchQuery?: string
  ): Promise<{ mentors: EUsers[]; total: number }> {
    try {
      console.log("getAllMentors service step 1", {
        page,
        limit,
        role,
        searchQuery,
      });
      let mentors = await this.UserRepository.getAllMentors(
        role,
        page,
        limit,
        searchQuery
      );
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

      const total = await this.UserRepository.countMentors(role, searchQuery);
      console.log("getAllMentors service step 4: Total mentors", total);

      return { mentors, total };
    } catch (error: any) {
      console.log("getAllMentors service step 5: Error", {
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

  async createPriorityDM(data: {
    serviceId: string;
    bookingId: string; // Not optional since it's required
    menteeId: string;
    content: string;
    pdfFiles: Array<{ fileName: string; s3Key: string; url: string }>;
  }): Promise<EPriorityDM> {
    try {
      const { serviceId, bookingId, menteeId, content, pdfFiles } = data;

      // Validate serviceId
      if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        throw new Error("Invalid serviceId format");
      }

      // Fetch service to get mentorId
      const service = await this.ServiceRepository.getServiceById(serviceId);
      if (!service) {
        throw new Error("Service not found");
      }

      if (service.type !== "priorityDM") {
        throw new Error("Service is not a Priority DM");
      }

      // Validate menteeId
      if (!mongoose.Types.ObjectId.isValid(menteeId)) {
        throw new Error("Invalid menteeId format");
      }

      // Validate bookingId
      if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new Error("Invalid bookingId format");
      }

      // Verify booking exists
      const booking = await this.BookingRepository.findById(bookingId);
      if (!booking) {
        throw new Error("Booking not found");
      }

      // Prepare PriorityDM data
      const priorityDMData: Partial<EPriorityDM> = {
        serviceId: new mongoose.Types.ObjectId(serviceId),
        mentorId: new mongoose.Types.ObjectId(service.mentorId),
        menteeId: new mongoose.Types.ObjectId(menteeId),
        bookingId: new mongoose.Types.ObjectId(bookingId),
        content,
        pdfFiles,
        status: "pending",
      };

      console.log("PriorityDM Data to Save:", priorityDMData);

      // Create PriorityDM
      const priorityDM = await this.PriorityDMRepository.create(priorityDMData);
      if (!priorityDM) {
        throw new Error("Failed to create Priority DM");
      }
      const bookingStatusChange = await this.BookingRepository.update(
        bookingId,
        { status: "pending" }
      );
      console.log("mnetee cretaion bookingStatusChange", bookingStatusChange);
      return priorityDM;
    } catch (error) {
      console.error("Error creating PriorityDM:", error);
      throw error;
    }
  }

  async getPriorityDMs(
    bookingId: string,
    menteeId: string
  ): Promise<EPriorityDM[]> {
    try {
      if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new Error(`Invalid serviceId format: ${bookingId}`);
      }
      console.log("menteeservice getPriorityDMs step 1", bookingId, menteeId);

      const priorityDMs =
        await this.PriorityDMRepository.findByServiceAndMentee(
          bookingId,
          menteeId
        );
      console.log("menteeservice getPriorityDMs step 2", priorityDMs);
      return priorityDMs;
    } catch (error) {
      console.error("Error fetching PriorityDMs:", error);
      throw error;
    }
  }

  async getTopServices(limit: number = 8): Promise<EService[]> {
    try {
      console.log("getTopServices service step 1", { limit });
      const services = await this.ServiceRepository.getTopServices(limit);
      console.log("getTopServices service step 2", services.length);
      return services;
    } catch (error: any) {
      console.error("getTopServices service error", error);
      throw new Error(`Failed to fetch top services: ${error.message}`);
    }
  }

  async getDashboardData(): Promise<DashboardData> {
    try {
      console.log("getDashboardData service step 1");
      const [topServices, topMentors, topTestimonials] = await Promise.all([
        this.getTopServices(8),
        this.UserRepository.getTopMentors(8),
        this.Testimonial.getTopTestimonials(30),
      ]);
      console.log("getDashboardData service step 2", {
        services: topServices.length,
        mentors: topMentors.length,
        testimonials: topTestimonials.length,
      });
      return { topServices, topMentors, topTestimonials };
    } catch (error: any) {
      console.error("getDashboardData service error", error);
      throw new Error(`Failed to fetch dashboard data: ${error.message}`);
    }
  }
}
