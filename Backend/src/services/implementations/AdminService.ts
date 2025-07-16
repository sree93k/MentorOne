import { IAdminService } from "../interface/IAdminService";
import Users from "../../models/userModel";
import Mentor from "../../models/mentorModel";
import { EUsers } from "../../entities/userEntity";
import { EMentee } from "../../entities/menteeEntiry";
import { EMentor } from "../../entities/mentorEntity";
import { sendMail } from "../../utils/emailService";
import { IServiceService } from "../interface/IServiceServices";
import ServiceService from "./ServiceServices";
import BookingService from "./Bookingservice";
import { IBookingService } from "../interface/IBookingService";
import { EBooking } from "../../entities/bookingEntity";
import UserRepository from "../../repositories/implementations/UserRepository";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import MenteeService from "./MenteeService";
import { IMenteeService } from "../interface/IMenteeService";
import MentorService from "./MentorService";
import { IMentorService } from "../interface/IMentorService";
import { EService } from "../../entities/serviceEntity";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export default class AdminService implements IAdminService {
  private ServiceService: IServiceService;
  private BookingService: IBookingService;
  private UserRepository: IUserRepository;
  private MenteeServcie: IMenteeService;
  private MentorService: IMentorService;

  constructor() {
    this.ServiceService = new ServiceService();
    this.BookingService = new BookingService();
    this.UserRepository = new UserRepository();
    this.MenteeServcie = new MenteeService();
    this.MentorService = new MentorService();
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

      // Use Users model instead of rawModel
      const total = await Users.countDocuments(query);
      const totalMentors = await Users.countDocuments({
        ...query,
        role: { $eq: ["mentor"] },
      });
      const totalMentees = await Users.countDocuments({
        ...query,
        role: { $eq: ["mentee"] },
      });
      const totalBoth = await Users.countDocuments({
        ...query,
        role: { $all: ["mentor", "mentee"] },
      });

      // Use Mentor model instead of mentorModel
      const approvalPending = await Mentor.countDocuments({
        isApproved: "Pending",
      });

      // Log mentor data for debugging
      const pendingMentors = await Mentor.find({ isApproved: "Pending" })
        .select("_id isApproved")
        .exec();
      console.log("admin service pending mentors:", pendingMentors);
      console.log("admin service approvalPending count:", approvalPending);

      // Fetch paginated users with population
      const allUsers = await Users.find(query)
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

  async getUserDatas(id: string): Promise<{
    user: EUsers;
    menteeData: EMentee | null;
    mentorData: EMentor | null;
    serviceData: EService[] | null;
    bookingData: EBooking[] | null;
  } | null> {
    try {
      console.log("AdminService getUserDatas step 1:", id);
      const user = await this.UserRepository.findById(id);
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
        menteeData = await this.MenteeServcie.findMenteeById(
          user.menteeId._id.toString()
        );
        console.log(
          "AdminService getUserDatas step 3 - menteeData:",
          menteeData
        );
      }

      // Fetch booking data if user has mentee role
      if (user.role?.includes("mentee") && user.menteeId) {
        bookingData = await this.BookingService.findByMentee(id);
        console.log(
          "AdminService getUserDatas step 4 - bookingData:",
          bookingData
        );
      }

      // Fetch mentor data if user has mentor role
      if (user.role?.includes("mentor") && user.mentorId) {
        mentorData = await this.MentorService.findMentorById(
          user.mentorId._id.toString()
        );
        console.log(
          "AdminService getUserDatas step 5 - mentorData:",
          mentorData
        );
      }

      // Fetch service data if user has mentor role
      if (user.role?.includes("mentor") && user.mentorId) {
        // Use ServiceService instead of directly accessing repository
        const params = {
          page: 1,
          limit: 100, // Get all services for admin view
          search: "",
          type: "all",
        };
        const serviceResponse =
          await this.ServiceService.getAllServicesByMentor(id, params);
        console.log(
          "AdminService getUserDatas step 6 - serviceData:",
          serviceResponse
        );
        // Extract services array from response
        serviceData = serviceResponse ? serviceResponse.services : null;
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
        "mentor service ....mentorStatusChange step 1...",
        id,
        status,
        reason
      );
      const updateData = {
        field: "isApproved",
        status,
        reason,
      };
      const updateMentor = await this.MentorService.updateMentor(
        id,
        updateData
      );
      console.log(
        "adminside service mentorStatusChange service is ",
        updateMentor
      );
      const userData = await this.UserRepository.findByField("mentorId", id);
      console.log("user data is ", userData);
      const user = userData?.[0];
      if (!user) {
        console.warn("No user found with mentorId:", id);
        return { mentorData: updateMentor };
      }
      // Send email notification if status is updated
      if (updateMentor && (status === "Approved" || status === "Rejected")) {
        const message =
          status === "Approved"
            ? `Your mentor status has been updated to "${status}".`
            : `Your mentor status has been updated to "${status}" and the reason: ${
                reason || "No reason provided"
              }.`;
        console.log("user emails  is ", user?.email, "and message", message);

        const capitalizeFirstLetter = (str: string): string => {
          if (!str) return str;
          return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        };

        const name = `${capitalizeFirstLetter(
          user?.firstName
        )} ${capitalizeFirstLetter(user?.lastName)}`;
        const OTPDetails = await sendMail(
          user?.email,
          message,
          name,
          "Mentor One Status Updated"
        );
        console.log("Email sent:", OTPDetails);
        // If Rejected, deactivate mentor in user model
        if (status === "Rejected") {
          await this.UserRepository.update(user._id, {
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

      const updateUser = await this.UserRepository.updateField(
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
