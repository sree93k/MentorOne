import { IAdminService } from "../interface/IAdminService";
import Users from "../../models/userModel";
import Mentee from "../../models/menteeModel";
import Mentor from "../../models/mentorModel";
import { IBaseRepository } from "../../repositories/interface/IBaseRepository";
import BaseRepository from "../../repositories/implementations/BaseRepository";
import { IMenteeRepository } from "../../repositories/interface/IMenteeRepository";
import MenteeRepository from "../../repositories/implementations/MenteeRepository";
import { IMentorRepository } from "../../repositories/interface/IMentorRepository";
import MentorRepository from "../../repositories/implementations/MentorRepository";
import { EUsers } from "../../entities/userEntity";
import { EMentee } from "../../entities/menteeEntiry";
import { EMentor } from "../../entities/mentorEntity";
import { sendMail } from "../../utils/emailService";
import { Model } from "mongoose";
import ServiceRepository from "../../repositories/implementations/ServiceRepository";
import { IServiceRepository } from "../../repositories/interface/IServiceRepository";
import { EService } from "../../entities/serviceEntity";
import BookingRepository from "../../repositories/implementations/BookingRepository";
import { IBookingRepository } from "../../repositories/interface/IBookingRepository";
import { EBooking } from "../../entities/bookingEntity";
import { number } from "joi";
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export default class AdminService implements IAdminService {
  private BaseRepository: IBaseRepository<EUsers>;
  private MenteeRepository: IMenteeRepository;
  private MentorRepository: IMentorRepository;
  private ServiceRepository: IServiceRepository;
  private BookingRepository: IBookingRepository;

  constructor() {
    this.BaseRepository = new BaseRepository<EUsers>(Users);
    this.MenteeRepository = new MenteeRepository();
    this.MentorRepository = new MentorRepository();
    this.ServiceRepository = new ServiceRepository();
    this.BookingRepository = new BookingRepository();
  }

  private getModel(): Model<EUsers> {
    return require("../../models/userModel").default;
  }

  private getMentorModel(): Model<any> {
    return require("../../models/mentorModel").default;
  }

  async fetchAllUsers(
    page: number,
    limit: number,
    role?: string,
    status?: string
  ): Promise<{
    users: Omit<EUsers, "password">[];
    total: number;
    totalMentors: number;
    totalMentees: number;
    totalBoth: number;
    approvalPending: number;
  } | null> {
    try {
      console.log("all users service ************************************");
      const rawModel = (this.BaseRepository as BaseRepository<EUsers>).model;
      const mentorModel = this.getMentorModel();

      // Build MongoDB query for users
      const query: any = {};

      // Role filter
      if (role) {
        if (role === "mentee") {
          query.role = { $eq: ["mentee"] };
        } else if (role === "mentor") {
          query.role = { $eq: ["mentor"] };
        } else if (role === "both") {
          query.role = { $all: ["mentor", "mentee"] };
        }
      }

      // Status filter
      if (status) {
        query.isBlocked = status === "Blocked" ? true : false;
      }

      // Fetch total counts for all categories
      const total = await rawModel.countDocuments(query);
      const totalMentors = await rawModel.countDocuments({
        ...query,
        role: { $eq: ["mentor"] },
      });
      const totalMentees = await rawModel.countDocuments({
        ...query,
        role: { $eq: ["mentee"] },
      });
      const totalBoth = await rawModel.countDocuments({
        ...query,
        role: { $all: ["mentor", "mentee"] },
      });

      // Simply count pending mentors directly
      const approvalPending = await mentorModel.countDocuments({
        isApproved: "Pending",
      });

      // Log mentor data for debugging
      const pendingMentors = await mentorModel
        .find({ isApproved: "Pending" })
        .select("_id isApproved")
        .exec();
      console.log("admin service pending mentors:", pendingMentors);
      console.log("admin service approvalPending count:", approvalPending);

      // Fetch paginated users with population
      const allUsers = await rawModel
        .find(query)
        .populate("mentorId")
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      console.log("all users new list>>>>>>>>>>>>>", allUsers);

      // Remove password from response
      const usersWithoutPassword = allUsers.map((user: any) => {
        const { password, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
      });

      return {
        users: usersWithoutPassword,
        total,
        totalMentors,
        totalMentees,
        totalBoth,
        approvalPending,
      };
    } catch (error) {
      console.error("Error in fetchAllUsers:", error);
      return null;
    }
  }
  //getuserdata
  // async getUserDatas(id: string): Promise<{
  //   user: EUsers;
  //   menteeData: EMentee | null;
  //   mentorData: EMentor | null;
  // } | null> {
  //   try {
  //     console.log("AdminService getUserDatas step 1:", id);
  //     const user = await this.BaseRepository.findById(id);
  //     console.log("AdminService getUserDatas step 2:", user);
  //     if (!user) {
  //       console.log("AdminService getUserDatas: User not found");
  //       return null;
  //     }

  //     let menteeData: EMentee | null = null;
  //     let mentorData: EMentor | null = null;
  //     let serviceData: EService | null = null;
  //     let bookingData: EBooking | null = null;

  //     // Check roles and fetch corresponding data
  //     if (user.role?.includes("mentee") && user.menteeId) {
  //       menteeData = await this.MenteeRepository.getMentee(
  //         user.menteeId.toString()
  //       );
  //       console.log(
  //         "AdminService getUserDatas step 3 - menteeData:",
  //         menteeData
  //       );
  //     }
  //     if (user.role?.includes("mentee") && user.menteeId) {
  //       bookingData = await this.BookingRepository.findByMentee(id);
  //       console.log(
  //         "AdminService getUserDatas step 3 - menteeData:",
  //         menteeData
  //       );
  //     }

  //     if (user.role?.includes("mentor") && user.mentorId) {
  //       serviceData = await this.ServiceRepository.getAllServices(id);
  //       console.log(
  //         "AdminService getUserDatas step 3 - menteeData:",
  //         menteeData
  //       );
  //     }

  //     if (user.role?.includes("mentor") && user.mentorId) {
  //       mentorData = await this.MentorRepository.getMentor(
  //         user.mentorId.toString()
  //       );
  //       console.log(
  //         "AdminService getUserDatas step 4 - mentorData:",
  //         mentorData
  //       );
  //     }
  //     console.log(
  //       ">>>>>>>>>>>@@@@@@",
  //       user,
  //       menteeData,
  //       mentorData,
  //       serviceData,
  //       bookingData
  //     );

  //     return { user, menteeData, mentorData, serviceData, bookingData };
  //   } catch (error) {
  //     console.error("Error in getUserDatas:", error);
  //     return null;
  //   }
  // }
  // async getUserDatas(id: string): Promise<{
  //   user: EUsers;
  //   menteeData: EMentee | null;
  //   mentorData: EMentor | null;
  //   serviceData: EService[] | null; // Updated to array to match getAllServices return type
  //   bookingData: EBooking[] | null; // Updated to array to match findByMentee return type
  // } | null> {
  //   try {
  //     console.log("AdminService getUserDatas step 1:", id);
  //     const user = await this.BaseRepository.findById(id);
  //     console.log("AdminService getUserDatas step 2:", user);
  //     if (!user) {
  //       console.log("AdminService getUserDatas: User not found");
  //       return null;
  //     }

  //     let menteeData: EMentee | null = null;
  //     let mentorData: EMentor | null = null;
  //     let serviceData: EService[] | null = null;
  //     let bookingData: EBooking[] | null = null;

  //     // Fetch mentee data if user has mentee role
  //     if (user.role?.includes("mentee") && user.menteeId) {
  //       menteeData = await this.MenteeRepository.getMentee(
  //         user.menteeId.toString()
  //       );
  //       console.log(
  //         "AdminService getUserDatas step 3 - menteeData:",
  //         menteeData
  //       );
  //     }

  //     // Fetch booking data if user has mentee role
  //     if (user.role?.includes("mentee") && user.menteeId) {
  //       bookingData = await this.BookingRepository.findByMentee(id);
  //       console.log(
  //         "AdminService getUserDatas step 4 - bookingData:",
  //         bookingData
  //       );
  //     }

  //     // Fetch mentor data if user has mentor role
  //     if (user.role?.includes("mentor") && user.mentorId) {
  //       mentorData = await this.MentorRepository.getMentor(
  //         user.mentorId.toString()
  //       );
  //       console.log(
  //         "AdminService getUserDatas step 5 - mentorData:",
  //         mentorData
  //       );
  //     }

  //     // Fetch service data if user has mentor role
  //     if (user.role?.includes("mentor") && user.mentorId) {
  //       serviceData = await this.ServiceRepository.getAllServices(id);
  //       console.log(
  //         "AdminService getUserDatas step 6 - serviceData:",
  //         serviceData
  //       );
  //     }

  //     console.log("AdminService getUserDatas final response:", {
  //       user,
  //       menteeData,
  //       mentorData,
  //       serviceData,
  //       bookingData,
  //     });

  //     return { user, menteeData, mentorData, serviceData, bookingData };
  //   } catch (error) {
  //     console.error("Error in getUserDatas:", error);
  //     return null;
  //   }
  // }
  async getUserDatas(id: string): Promise<{
    user: EUsers;
    menteeData: EMentee | null;
    mentorData: EMentor | null;
    serviceData: EService[] | null;
    bookingData: EBooking[] | null;
  } | null> {
    try {
      console.log("AdminService getUserDatas step 1:", id);
      const user = await this.BaseRepository.findById(id);
      console.log("AdminService getUserDatas step 2:", user);
      if (!user) {
        console.log("AdminService getUserDatas: User not found");
        return null;
      }

      let menteeData: EMentee | null = null;
      let mentorData: EMentor | null = null;
      let serviceData: EService[] | null = null;
      let bookingData: EBooking[] | null = null;

      // Fetch mentee data if user has mentee role
      if (user.role?.includes("mentee") && user.menteeId) {
        menteeData = await this.MenteeRepository.getMentee(
          user.menteeId.toString()
        );
        console.log(
          "AdminService getUserDatas step 3 - menteeData:",
          menteeData
        );
      }

      // Fetch booking data if user has mentee role
      if (user.role?.includes("mentee") && user.menteeId) {
        bookingData = await this.BookingRepository.findByMentee(id);
        console.log(
          "AdminService getUserDatas step 4 - bookingData:",
          bookingData
        );
      }

      // Fetch mentor data if user has mentor role
      if (user.role?.includes("mentor") && user.mentorId) {
        mentorData = await this.MentorRepository.getMentor(
          user.mentorId.toString()
        );
        console.log(
          "AdminService getUserDatas step 5 - mentorData:",
          mentorData
        );
      }

      // Fetch service data if user has mentor role
      if (user.role?.includes("mentor") && user.mentorId) {
        // Provide default pagination parameters to avoid TypeError
        const params = {
          page: 1,
          limit: 10,
          search: "",
          type: "all",
        };
        serviceData = await this.ServiceRepository.getAllServices(id, params);
        console.log(
          "AdminService getUserDatas step 6 - serviceData:",
          serviceData
        );
        // Extract services array from response
        serviceData = serviceData ? serviceData.services : null;
      }

      console.log("AdminService getUserDatas final response:", {
        user,
        menteeData,
        mentorData,
        serviceData,
        bookingData,
      });

      return { user, menteeData, mentorData, serviceData, bookingData };
    } catch (error) {
      console.error("Error in getUserDatas:", error);
      return null;
    }
  }
  async mentorStatusChange(
    id: string,
    status: string,
    reason: string = ""
  ): Promise<{ mentorData: EMentor | null } | null> {
    try {
      console.log(
        "mentor service ....mentorStatusChange step 1",
        id,
        status,
        reason
      );

      const updateMentor = await this.MentorRepository.updateField(
        id,
        "isApproved",
        status,
        reason
      );
      console.log(
        "adminside service mentorStatusChange service is ",
        updateMentor
      );
      const userData = await this.BaseRepository.findByField("mentorId", id);
      console.log("user data is ", userData);
      const user = userData?.[0];
      if (!user) {
        console.warn("No user found with mentorId:", id);
        return { mentorData: updateMentor };
      }
      // Send email notification if status is updated
      if (updateMentor && (status === "Approved" || status === "Rejected")) {
        const message = `Your mentor status has been updated to "${status}". Reason: ${
          reason || "No reason provided"
        }`;

        console.log("user emails  is ", user?.email, "and message", message);
        const OTPDetails = await sendMail(user?.email, message);
        console.log("Email sent:", OTPDetails);
        // If Rejected, deactivate mentor in user model
        if (status === "Rejected") {
          await this.BaseRepository.update(user._id, {
            mentorActivated: false,
            refreshToken: "",
          } as any);
          console.log("User deactivated as mentor and refresh token cleared.");
        }
      }

      return { mentorData: updateMentor };
    } catch (error) {
      console.error("Error in mentorStatusChange:", error);
      return null;
    }
  }
  async userStatusChange(
    id: string,
    status: string
  ): Promise<{ userData: EUsers | null } | null> {
    try {
      console.log("userStatusChange start ", id, status);

      const updateUser = await this.BaseRepository.updateField(
        id,
        "isBlocked",
        status
      );
      console.log("userStatusChange response is ", updateUser);

      return { userData: updateUser };
    } catch (error) {
      console.error("Error in userStatusChange:", error);
      return null;
    }
  }
}
