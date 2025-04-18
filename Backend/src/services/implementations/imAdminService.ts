import { inAdminService } from "../interface/inAdminService";
import Users from "../../models/userModel";
import Mentee from "../../models/menteeModel";
import Mentor from "../../models/mentorModel";
import { inBaseRepository } from "../../repositories/interface/inBaseRepository";
import imBaseRepository from "../../repositories/implementations/imBaseRepository";
import { inMenteeRepository } from "../../repositories/interface/inMenteeRepository";
import MenteeRepository from "../../repositories/implementations/imMenteeRepository";
import { inMentorRepository } from "../../repositories/interface/inMentorRepository";
import MentorRepository from "../../repositories/implementations/imMentorRepository";
import { EUsers } from "../../entities/userEntity";
import { EMentee } from "../../entities/menteeEntiry";
import { EMentor } from "../../entities/mentorEntity";
import { sendMail } from "../../utils/emailService";
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export default class AdminService implements inAdminService {
  private BaseRepository: inBaseRepository<EUsers>;
  private MenteeRepository: inMenteeRepository;
  private MentorRepository: inMentorRepository;

  constructor() {
    this.BaseRepository = new imBaseRepository<EUsers>(Users);
    this.MenteeRepository = new MenteeRepository();
    this.MentorRepository = new MentorRepository();
  }

  async fetchAllUsers(
    page: number,
    limit: number,
    role?: string,
    status?: string
  ): Promise<{ users: Omit<EUsers, "password">[]; total: number } | null> {
    try {
      // Manually access the original Mongoose model from BaseRepository
      // @ts-ignore if TS complains, or access it via a getter if needed
      const rawModel = (this.BaseRepository as BaseRepository<EUsers>).model;

      // Do population here using the model
      let allUsers = await rawModel.find().populate("mentorId").exec();
      console.log("all users new list>>>>>>>>>>>>>", allUsers);

      if (role) {
        allUsers = allUsers.filter((user: any) => user.role.includes(role));
      }

      if (status) {
        allUsers = allUsers.filter((user: any) =>
          status === "Blocked" ? user.isBlocked : !user.isBlocked
        );
      }

      const total = allUsers.length;
      const startIndex = (page - 1) * limit;
      const paginatedUsers = allUsers.slice(startIndex, startIndex + limit);

      const usersWithoutPassword = paginatedUsers.map((user: any) => {
        const { password, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
      });

      return { users: usersWithoutPassword, total };
    } catch (error) {
      console.error("Error in fetchAllUsers:", error);
      return null;
    }
  }

  //getuserdata
  async getUserDatas(id: string): Promise<{
    user: EUsers;
    menteeData: EMentee | null;
    mentorData: EMentor | null;
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

      // Check roles and fetch corresponding data
      if (user.role?.includes("mentee") && user.menteeId) {
        menteeData = await this.MenteeRepository.getMentee(
          user.menteeId.toString()
        );
        console.log(
          "AdminService getUserDatas step 3 - menteeData:",
          menteeData
        );
      }

      if (user.role?.includes("mentor") && user.mentorId) {
        mentorData = await this.MentorRepository.getMentor(
          user.mentorId.toString()
        );
        console.log(
          "AdminService getUserDatas step 4 - mentorData:",
          mentorData
        );
      }
      console.log(">>>>>>>>>>>@@@@@@", user, menteeData, mentorData);

      return { user, menteeData, mentorData };
    } catch (error) {
      console.error("Error in getUserDatas:", error);
      return null;
    }
  }

  async mentorStatusChange(
    id: string,
    status: string,
    reason: string = "" // Default to empty string if not provided
  ): Promise<{ mentorData: EMentor | null } | null> {
    try {
      const updateMentor = await this.MentorRepository.updateField(
        id,
        "isApproved",
        status
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
            refreshToken: "", // Clear refreshToken
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

  // async mentorStatusChange(
  //   id: string,
  //   status: string,
  //   reason: string
  // ): Promise<{ mentorData: EMentor | null } | null> {
  //   try {
  //     const updateMentor = await this.MentorRepository.updateField(
  //       id,
  //       "isApproved",
  //       status
  //     );
  //     return { mentorData: updateMentor };
  //   } catch (error) {
  //     console.error("Error in mentorStatusChange:", error);
  //     return null;
  //   }
  // }

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
